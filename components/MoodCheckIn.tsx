"use client";

import type { MoodTag } from "@/lib/prompts";

const MOODS: MoodTag[] = ["overwhelmed", "anxious", "scattered", "numb", "okay", "focused"];

interface MoodCheckInProps {
  selectedMood: MoodTag | null;
  onSelect: (mood: MoodTag) => void;
}

export function MoodCheckIn({ selectedMood, onSelect }: MoodCheckInProps) {
  return (
    <div className="panel mx-4 p-5 sm:mx-6">
      <p className="text-sm text-text-secondary">Where are you starting from right now?</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {MOODS.map((mood) => {
          const active = selectedMood === mood;

          return (
            <button
              key={mood}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => onSelect(mood)}
              className={`rounded-full border px-4 py-2 text-sm capitalize transition-colors ${
                active
                  ? "border-accent bg-accent-soft text-text-primary"
                  : "border-border-base text-text-secondary hover:text-text-primary"
              }`}
            >
              {mood}
            </button>
          );
        })}
      </div>
    </div>
  );
}
