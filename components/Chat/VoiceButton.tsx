"use client";

import { Mic, MicOff } from "lucide-react";
import { useVoiceInput } from "@/hooks/useVoiceInput";

interface VoiceButtonProps {
  onTranscript: (text: string) => void;
}

export function VoiceButton({ onTranscript }: VoiceButtonProps) {
  const { listening, supported, startListening, stopListening } = useVoiceInput(onTranscript);

  if (!supported) {
    return null;
  }

  return (
    <button
      type="button"
      aria-label={listening ? "Stop voice input" : "Start voice input"}
      onClick={listening ? stopListening : startListening}
      className={`rounded-xl p-2 transition-colors ${
        listening ? "bg-warning/20 text-warning" : "text-text-secondary hover:text-accent"
      }`}
    >
      {listening ? <MicOff size={18} /> : <Mic size={18} />}
    </button>
  );
}
