import React from "react";
import { Button } from "@/components/ui/button";

interface MCQProps {
  choices: string[];
  onChoose: (index: number) => void;
  disabled?: boolean;
}

export function MCQ({ choices, onChoose, disabled = false }: MCQProps) {
  return (
    <div className="space-y-3">
      {choices.map((choice, index) => (
        <Button
          key={index}
          variant="default"
          className="w-full text-left justify-start p-4 h-auto whitespace-normal"
          onClick={() => onChoose(index)}
          disabled={disabled}
        >
          <span className="mr-3 font-bold text-[--color-primary]">
            {String.fromCharCode(65 + index)}.
          </span>
          {choice}
        </Button>
      ))}
    </div>
  );
}
