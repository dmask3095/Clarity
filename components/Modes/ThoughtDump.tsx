"use client";

import { useState } from "react";

interface ThoughtDumpProps {
  onClose: () => void;
  onSubmit: (value: string) => void;
}

export default function ThoughtDump({ onClose, onSubmit }: ThoughtDumpProps) {
  const [value, setValue] = useState("");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-bg-base/96 px-6">
      <div className="panel w-full max-w-2xl p-8">
        <p className="text-sm uppercase tracking-[0.3em] text-text-secondary">Thought dump</p>
        <h2 className="mt-3 font-display text-4xl italic text-text-primary">
          Put it down exactly how it&apos;s showing up.
        </h2>
        <textarea
          rows={12}
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder="Messy is welcome here."
          className="mt-6 min-h-[280px] w-full rounded-3xl border border-border-base bg-bg-elevated/80 p-5 text-base leading-relaxed text-text-primary outline-none placeholder:text-text-muted"
        />
        <div className="mt-5 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="text-sm text-text-secondary transition-colors hover:text-text-primary"
          >
            Close
          </button>
          <button
            type="button"
            onClick={() => value.trim() && onSubmit(value.trim())}
            className="rounded-2xl bg-accent px-5 py-3 font-medium text-white transition-opacity hover:opacity-90"
          >
            Let Clarity reflect this back
          </button>
        </div>
      </div>
    </div>
  );
}
