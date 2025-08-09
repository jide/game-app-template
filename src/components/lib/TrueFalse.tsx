import React from "react";
import { Button } from "../ui/button";

export function TrueFalse({ onAnswer }: { onAnswer: (v: boolean) => void }) {
  return (
    <div className="flex gap-2">
      <Button onClick={() => onAnswer(true)}>True</Button>
      <Button onClick={() => onAnswer(false)} variant="secondary">
        False
      </Button>
    </div>
  );
}
