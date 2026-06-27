"use client";

import { useEffect, useMemo, useState } from "react";

interface GroundingExerciseProps {
  onClose: () => void;
  onComplete: (exercise: string, responses: string[]) => void;
}

const BOX_PHASES = ["Inhale", "Hold", "Exhale", "Hold"];
const SENSORY_STEPS = [
  "Name 5 things you can see.",
  "Name 4 things you can physically feel.",
  "Name 3 things you can hear.",
  "Name 2 things you can smell.",
  "Name 1 thing you can taste.",
];

export default function GroundingExercise({ onClose, onComplete }: GroundingExerciseProps) {
  const [exercise, setExercise] = useState<"box" | "sensory" | null>(null);
  const [boxStep, setBoxStep] = useState(0);
  const [cycle, setCycle] = useState(0);
  const [progress, setProgress] = useState(0);
  const [responses, setResponses] = useState<string[]>([]);
  const [sensoryValue, setSensoryValue] = useState("");

  useEffect(() => {
    if (exercise !== "box") {
      return;
    }

    setProgress(0);
    const startedAt = Date.now();
    const intervalId = window.setInterval(() => {
      const elapsed = Date.now() - startedAt;
      setProgress(Math.min(elapsed / 4000, 1));
    }, 100);

    return () => window.clearInterval(intervalId);
  }, [exercise, boxStep, cycle]);

  const circumference = useMemo(() => 2 * Math.PI * 42, []);
  const sensoryIndex = responses.length;

  function advanceBox() {
    if (boxStep < BOX_PHASES.length - 1) {
      setBoxStep((current) => current + 1);
      return;
    }

    if (cycle < 2) {
      setCycle((current) => current + 1);
      setBoxStep(0);
      return;
    }

    onComplete("box breathing", ["completed 3 cycles"]);
  }

  function submitSensoryStep() {
    if (!sensoryValue.trim()) {
      return;
    }

    const nextResponses = [...responses, sensoryValue.trim()];
    setResponses(nextResponses);
    setSensoryValue("");

    if (nextResponses.length === SENSORY_STEPS.length) {
      onComplete("5-4-3-2-1 sensory", nextResponses);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-bg-base/96 px-6">
      <div className="panel w-full max-w-md p-8">
        {!exercise ? (
          <div className="space-y-4">
            <p className="text-sm uppercase tracking-[0.3em] text-text-secondary">Grounding</p>
            <h2 className="font-display text-4xl italic text-text-primary">Okay. Let&apos;s slow this down.</h2>
            <p className="text-sm leading-relaxed text-text-secondary">
              Pick the kind of anchor that feels easiest right now.
            </p>
            <div className="grid gap-3">
              <button
                type="button"
                onClick={() => setExercise("box")}
                className="rounded-2xl border border-border-base bg-bg-elevated/70 px-4 py-4 text-left text-text-primary transition-colors hover:border-accent/40"
              >
                Box breathing
              </button>
              <button
                type="button"
                onClick={() => setExercise("sensory")}
                className="rounded-2xl border border-border-base bg-bg-elevated/70 px-4 py-4 text-left text-text-primary transition-colors hover:border-accent/40"
              >
                5-4-3-2-1 sensory check-in
              </button>
              <button
                type="button"
                onClick={onClose}
                className="pt-2 text-sm text-text-secondary transition-colors hover:text-text-primary"
              >
                Not right now
              </button>
            </div>
          </div>
        ) : exercise === "box" ? (
          <div className="space-y-6 text-center">
            <div className="flex justify-center gap-2">
              {BOX_PHASES.map((phase, index) => (
                <span
                  key={phase}
                  className={`h-2.5 w-2.5 rounded-full ${
                    index < boxStep
                      ? "bg-success"
                      : index === boxStep
                        ? "bg-accent"
                        : "bg-border-base"
                  }`}
                />
              ))}
            </div>
            <div className="mx-auto flex h-36 w-36 items-center justify-center">
              <svg
                aria-label="Breathing timer"
                viewBox="0 0 120 120"
                className="h-full w-full -rotate-90"
              >
                <circle cx="60" cy="60" r="42" fill="none" stroke="rgb(42 42 54)" strokeWidth="8" />
                <circle
                  cx="60"
                  cy="60"
                  r="42"
                  fill="none"
                  stroke="rgb(106 176 196)"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={circumference - circumference * progress}
                />
              </svg>
            </div>
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-[0.3em] text-text-secondary">
                Cycle {cycle + 1} of 3
              </p>
              <h3 className="text-2xl text-text-primary">{BOX_PHASES[boxStep]} for 4 counts</h3>
            </div>
            <button
              type="button"
              onClick={advanceBox}
              className="rounded-2xl bg-accent px-5 py-3 font-medium text-white transition-opacity hover:opacity-90"
            >
              Ready
            </button>
          </div>
        ) : (
          <div className="space-y-5">
            <div className="flex justify-center gap-2">
              {SENSORY_STEPS.map((step, index) => (
                <span
                  key={step}
                  className={`h-2.5 w-2.5 rounded-full ${
                    index < sensoryIndex
                      ? "bg-success"
                      : index === sensoryIndex
                        ? "bg-accent"
                        : "bg-border-base"
                  }`}
                />
              ))}
            </div>
            <h3 className="text-xl leading-relaxed text-text-primary">{SENSORY_STEPS[sensoryIndex]}</h3>
            <textarea
              rows={4}
              value={sensoryValue}
              onChange={(event) => setSensoryValue(event.target.value)}
              placeholder="Type whatever you notice."
              className="min-h-[120px] w-full rounded-3xl border border-border-base bg-bg-elevated/80 p-4 text-text-primary outline-none placeholder:text-text-muted"
            />
            <div className="flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={onClose}
                className="text-sm text-text-secondary transition-colors hover:text-text-primary"
              >
                Exit
              </button>
              <button
                type="button"
                onClick={submitSensoryStep}
                className="rounded-2xl bg-accent px-5 py-3 font-medium text-white transition-opacity hover:opacity-90"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
