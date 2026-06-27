"use client";

import type { ResponseLength, SupportStyle, UserPreferences } from "@/lib/preferences";

interface SettingsPanelProps {
  preferences: UserPreferences;
  onClose: () => void;
  onChange: (preferences: Partial<UserPreferences>) => void;
}

function OptionButton({
  active,
  label,
  description,
  onClick,
}: {
  active: boolean;
  label: string;
  description: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-2xl border p-4 text-left transition-colors ${
        active
          ? "border-accent bg-accent-soft/50 text-text-primary"
          : "border-border-base bg-bg-elevated/60 text-text-secondary hover:text-text-primary"
      }`}
    >
      <p className="text-sm text-text-primary">{label}</p>
      <p className="mt-2 text-xs leading-relaxed">{description}</p>
    </button>
  );
}

export default function SettingsPanel({
  preferences,
  onClose,
  onChange,
}: SettingsPanelProps) {
  const supportStyleOptions: Array<{
    value: SupportStyle;
    label: string;
    description: string;
  }> = [
    {
      value: "gentle",
      label: "Gentle",
      description: "More warmth, softness, and emotional cushioning.",
    },
    {
      value: "structured",
      label: "Structured",
      description: "More scaffolding, sequencing, and practical shape.",
    },
    {
      value: "minimal",
      label: "Minimal",
      description: "Lower word count, less pressure, more breathing room.",
    },
  ];

  const responseLengthOptions: Array<{
    value: ResponseLength;
    label: string;
    description: string;
  }> = [
    {
      value: "brief",
      label: "Brief",
      description: "Keep responses compact and fast to absorb.",
    },
    {
      value: "balanced",
      label: "Balanced",
      description: "A middle ground between short support and enough context.",
    },
    {
      value: "spacious",
      label: "Spacious",
      description: "A little more reflection and room before action.",
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-bg-base/94 px-6">
      <div className="panel w-full max-w-3xl p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-text-muted">Settings</p>
            <h2 className="mt-3 font-display text-4xl italic text-text-primary">
              Shape how Clarity shows up for you.
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-text-secondary">
              These preferences stay on this device and gently steer the companion&apos;s tone,
              pacing, and grounding style.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-2xl border border-border-base px-4 py-2 text-sm text-text-secondary transition-colors hover:text-text-primary"
          >
            Close
          </button>
        </div>

        <div className="mt-8 space-y-8">
          <section>
            <p className="text-sm text-text-secondary">Support style</p>
            <div className="mt-3 grid gap-3 md:grid-cols-3">
              {supportStyleOptions.map((option) => (
                <OptionButton
                  key={option.value}
                  active={preferences.supportStyle === option.value}
                  label={option.label}
                  description={option.description}
                  onClick={() => onChange({ supportStyle: option.value })}
                />
              ))}
            </div>
          </section>

          <section>
            <p className="text-sm text-text-secondary">Response length</p>
            <div className="mt-3 grid gap-3 md:grid-cols-3">
              {responseLengthOptions.map((option) => (
                <OptionButton
                  key={option.value}
                  active={preferences.responseLength === option.value}
                  label={option.label}
                  description={option.description}
                  onClick={() => onChange({ responseLength: option.value })}
                />
              ))}
            </div>
          </section>

          <section>
            <p className="text-sm text-text-secondary">Grounding guidance</p>
            <div className="mt-3 grid gap-3 md:grid-cols-2">
              <OptionButton
                active={preferences.groundingPreference === "ask-first"}
                label="Ask first"
                description="Clarity checks before shifting into a grounding exercise."
                onClick={() => onChange({ groundingPreference: "ask-first" })}
              />
              <OptionButton
                active={preferences.groundingPreference === "auto"}
                label="Move quicker"
                description="If you sound clearly distressed, Clarity can guide grounding faster."
                onClick={() => onChange({ groundingPreference: "auto" })}
              />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
