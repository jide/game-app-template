import React from "react";
import { Button } from "../ui/button";

export function MCQ({
  choices,
  onChoose,
}: {
  choices: string[];
  onChoose: (i: number) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {choices.map((c, i) => (
        <Button key={i} onClick={() => onChoose(i)}>
          {c}
        </Button>
      ))}
    </div>
  );
}
