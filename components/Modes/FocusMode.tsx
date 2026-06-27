"use client";

import { useEffect, useState } from "react";

interface FocusModeProps {
  goal: string | null;
  onSetGoal: (goal: string) => void;
  onDone: () => void;
  onCheckIn: () => void;
}

export default function FocusMode({ goal, onSetGoal, onDone, onCheckIn }: FocusModeProps) {
  const [draft, setDraft] = useState(goal ?? "");

  useEffect(() => {
    if (!goal) {
      return;
    }

    const intervalId = window.setInterval(() => {
      onCheckIn();
    }, 15 * 60 * 1000);

    return () => window.clearInterval(intervalId);
  }, [goal, onCheckIn]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-bg-base/96 px-6">
      <div className="panel w-full max-w-2xl p-8 text-center">
        {goal ? (
          <div className="space-y-6">
            <p className="text-sm uppercase tracking-[0.3em] text-text-secondary">Working on</p>
            <h2 className="font-display text-4xl italic leading-tight text-text-primary md:text-5xl">
              {goal}
            </h2>
            <div className="flex justify-center gap-3">
              <span className="h-3 w-3 animate-pulse-slow rounded-full bg-accent" />
              <span className="h-3 w-3 animate-pulse-slow rounded-full bg-accent [animation-delay:180ms]" />
              <span className="h-3 w-3 animate-pulse-slow rounded-full bg-accent [animation-delay:360ms]" />
            </div>
            <button
              type="button"
              onClick={onDone}
              className="text-sm text-text-secondary transition-colors hover:text-text-primary"
            >
              I&apos;m done
            </button>
          </div>
        ) : (
          <div className="space-y-5">
            <p className="text-sm uppercase tracking-[0.3em] text-text-secondary">Focus mode</p>
            <h2 className="font-display text-4xl italic text-text-primary">
              What&apos;s the one thing you want to do in this session?
            </h2>
            <textarea
              rows={3}
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder="Write the one thing."
              className="min-h-[120px] w-full rounded-3xl border border-border-base bg-bg-elevated/80 p-4 text-lg text-text-primary outline-none placeholder:text-text-muted"
            />
            <button
              type="button"
              onClick={() => draft.trim() && onSetGoal(draft.trim())}
              className="rounded-2xl bg-accent px-5 py-3 font-medium text-white transition-opacity hover:opacity-90"
            >
              Start this session
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
