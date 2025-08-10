import React from "react";
import { Button } from "@/components/ui/button";

interface TrueFalseProps {
  onAnswer: (correct: boolean) => void;
  disabled?: boolean;
}

export function TrueFalse({ onAnswer, disabled = false }: TrueFalseProps) {
  return (
    <div className="flex gap-4">
      <Button
        variant="primary"
        className="flex-1"
        onClick={() => onAnswer(true)}
        disabled={disabled}
      >
        True
      </Button>
      <Button
        variant="secondary"
        className="flex-1"
        onClick={() => onAnswer(false)}
        disabled={disabled}
      >
        False
      </Button>
    </div>
  );
}
