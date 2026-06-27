"use client";

interface TaskItemProps {
  checked: boolean;
  isFirst: boolean;
  label: string;
  onToggle: () => void;
}

export function TaskItem({ checked, isFirst, label, onToggle }: TaskItemProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`flex w-full items-start gap-3 rounded-2xl border px-3 py-3 text-left transition-colors ${
        isFirst
          ? "border-accent/30 bg-accent-soft/20"
          : "border-border-base/60 bg-bg-base/35 hover:bg-bg-elevated/70"
      }`}
    >
      <span
        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
          checked ? "border-accent bg-accent text-white" : "border-border-base text-transparent"
        }`}
      >
        <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 fill-current">
          <path d="M6.4 11.3 3.6 8.5l-.9.9 3.7 3.7 7-7-.9-.9z" />
        </svg>
      </span>
      <span className={`${checked ? "text-text-muted line-through" : "text-text-primary"}`}>
        {label}
      </span>
    </button>
  );
}
