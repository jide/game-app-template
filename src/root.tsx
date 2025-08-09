import React, { useEffect, useMemo, useRef, useState } from "react";
import { Client, Room } from "colyseus.js";
import { State, Player } from "./schema";
import { MapSchema } from "@colyseus/schema";
import { MCQ } from "./components/lib/MCQ";
import { TrueFalse } from "./components/lib/TrueFalse";

const endpoint = import.meta.env.VITE_COLYSEUS_ENDPOINT || "ws://localhost:2567";
const ROOM_NAME = import.meta.env.VITE_ROOM_NAME || "full-llm-demo";

export function App() {
  const [room, setRoom] = useState<Room<State> | null>(null);
  const [rev, setRev] = useState(0);
  const [definition, setDefinition] = useState<any[]>([]);
  const clientRef = useRef<Client>();

  useEffect(() => {
    const client = new Client(endpoint);
    clientRef.current = client;
    (async () => {
      const r = await client.joinOrCreate<State>(ROOM_NAME, { name: "Player" }, State);
      setRoom(r);
      r.onStateChange(() => setRev((x) => x + 1));
      r.onMessage("definition", (payload: any) => setDefinition(payload?.steps || []));
    })();
    return () => { room?.leave(); };
  }, []);

  const state = room?.state as State | undefined;
  const myId = room?.sessionId;
  const myScore = useMemo(() => {
    const players = state?.players as MapSchema<Player> | undefined;
    if (!players || !myId) return 0;
    return players.get(myId)?.score || 0;
  }, [state, myId, rev]);

  const stepIndex = state?.extNum.get("stepIndex") ?? 0;
  const step = definition[stepIndex];
  const timeLeft = state?.extNum.get("timeLeftSec") ?? 0;
  const total = state?.extNum.get("totalSteps") ?? 0;

  const sendSubmit = (correct: boolean) => room?.send("ui.event", { type: "answer.submit", correct });
  const sendChoice = (choiceIndex: number) => room?.send("ui.event", { type: "answer.submit", choiceIndex });

  return (
    <div className="min-h-dvh text-[--color-panel-foreground] bg-[--color-background]">
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
              <strong>Step {stepIndex + 1}/{total}</strong>
              <div className="text-sm">Time left: {timeLeft}s</div>
            </div>
            <div className="text-lg font-semibold">{String(step?.data?.question || "")}</div>
            {String(step?.kind) === "qcm" ? (
              <MCQ choices={(step?.data?.choices || []) as string[]} onChoose={sendChoice} />
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


