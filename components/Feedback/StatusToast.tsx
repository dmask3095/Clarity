"use client";

interface StatusToastProps {
  tone?: "default" | "warning";
  message: string;
}

export function StatusToast({ tone = "default", message }: StatusToastProps) {
  return (
    <div
      className={`fixed right-4 top-4 z-[60] max-w-sm rounded-2xl border px-4 py-3 text-sm shadow-[0_18px_60px_rgba(0,0,0,0.35)] backdrop-blur ${
        tone === "warning"
          ? "border-warning/40 bg-bg-surface/95 text-warning"
          : "border-border-base bg-bg-surface/95 text-text-primary"
      }`}
    >
      {message}
    </div>
  );
}
