"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUp } from "lucide-react";
import { VoiceButton } from "./VoiceButton";

interface InputBarProps {
  disabled?: boolean;
  onSend: (message: string) => Promise<void> | void;
}

export function InputBar({ disabled, onSend }: InputBarProps) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    const textarea = textareaRef.current;

    if (!textarea) {
      return;
    }

    textarea.style.height = "0px";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 128)}px`;
  }, [value]);

  async function handleSend() {
    const trimmed = value.trim();

    if (!trimmed || disabled) {
      return;
    }

    setValue("");
    await onSend(trimmed);
  }

  return (
    <div className="border-t border-border-base bg-bg-base/95 p-4 backdrop-blur">
      <div className="mx-auto flex w-full max-w-2xl items-end gap-2 rounded-3xl border border-border-base bg-bg-elevated/90 p-3">
        <textarea
          ref={textareaRef}
          rows={1}
          value={value}
          placeholder="Type or tap the mic to speak..."
          onChange={(event) => setValue(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              void handleSend();
            }
          }}
          className="max-h-32 flex-1 resize-none bg-transparent text-base leading-relaxed text-text-primary outline-none placeholder:text-text-muted"
        />
        <VoiceButton
          onTranscript={(transcript) => setValue((current) => `${current}${current ? " " : ""}${transcript}`)}
        />
        <button
          type="button"
          aria-label="Send message"
          disabled={disabled || !value.trim()}
          onClick={() => void handleSend()}
          className="rounded-xl bg-accent p-2 text-white transition-opacity hover:opacity-90 disabled:opacity-40"
        >
          <ArrowUp size={18} />
        </button>
      </div>
    </div>
  );
}
