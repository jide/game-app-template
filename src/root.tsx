import { useEffect, useMemo, useState } from "react";
import { State, Player } from "./schema";
import { MapSchema } from "@colyseus/schema";
import { MCQ } from "@/components/lib/MCQ";
import { TrueFalse } from "@/components/lib/TrueFalse";
import { colyseus } from "@/use-colyseus";

const endpoint = import.meta.env.VITE_COLYSEUS_ENDPOINT as string;
const ROOM_NAME = import.meta.env.VITE_ROOM_NAME as string;

export function App() {
  const [definition, setDefinition] = useState<any[]>([]);

  const { useConnectToColyseus, useColyseusRoom, useColyseusState } =
    colyseus<State>(endpoint, State);

  useConnectToColyseus(ROOM_NAME, { name: "Player" });

  const room = useColyseusRoom();
  const state = useColyseusState();

  useEffect(() => {
    if (!room) return;
    const handler = (payload: any) => setDefinition(payload?.steps || []);
    room.onMessage("definition", handler);
    return () => {
      // no off() API; reconnect will replace listeners when hook reconnects
    };
  }, [room]);

  const myId = room?.sessionId;
  const myScore = useMemo(() => {
    const players = state?.players as MapSchema<Player> | undefined;
    if (!players || !myId) return 0;
    return players.get(myId)?.score || 0;
  }, [state, myId]);

  const stepIndex = state?.extNum.get("stepIndex") ?? 0;
  const step = definition[stepIndex];
  const timeLeft = state?.extNum.get("timeLeftSec") ?? 0;
  const total = state?.extNum.get("totalSteps") ?? 0;

  const sendSubmit = (correct: boolean) =>
    room?.send("ui.event", { type: "answer.submit", correct });
  const sendChoice = (choiceIndex: number) =>
    room?.send("ui.event", { type: "answer.submit", choiceIndex });

  return (
    <div className="min-h-dvh text-[--color-foreground] bg-[--color-background]">
      <div className="max-w-3xl mx-auto p-6 space-y-4">
        <header className="flex items-center justify-between">
          <h1 className="text-2xl font-extrabold">Game App Template</h1>
          <div className="text-sm opacity-80">Endpoint: {endpoint}</div>
        </header>
        <div className="rounded-lg bg-[--color-panel] p-4 space-y-3">
          <div>Outline: {state?.outline.currentId}</div>
          <div>Room: {room?.roomId}</div>
          <div>My score: {myScore}</div>
        </div>
        {state?.phase === "question" && (
          <div className="rounded-lg bg-[--color-panel] p-6 space-y-4">
            <div className="flex items-center justify-between">
              <strong>
                Step {stepIndex + 1}/{total}
              </strong>
              <div className="text-sm">Time left: {timeLeft}s</div>
            </div>
            <div className="text-lg font-semibold">
              {String(step?.data?.question || "")}
            </div>
            {String(step?.kind) === "qcm" ? (
              <MCQ
                choices={(step?.data?.choices || []) as string[]}
                onChoose={sendChoice}
              />
            ) : (
              <TrueFalse onAnswer={sendSubmit} />
            )}
          </div>
        )}
        {state?.phase === "finished" && (
          <div className="rounded-lg bg-[--color-panel] p-6 space-y-2">
            <div className="text-xl font-bold">Finished!</div>
            <div>Outline: {state?.outline.currentId}</div>
          </div>
        )}
      </div>
    </div>
  );
}
