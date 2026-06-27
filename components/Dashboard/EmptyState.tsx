"use client";

interface EmptyStateProps {
  onStarterPrompt: (prompt: string) => void;
  onOpenTasks: () => void;
  onOpenGrounding: () => void;
  onOpenFocus: () => void;
}

export function EmptyState({
  onStarterPrompt,
  onOpenTasks,
  onOpenGrounding,
  onOpenFocus,
}: EmptyStateProps) {
  return (
    <div className="mx-4 mt-4 space-y-4 sm:mx-6">
      <div className="panel p-6">
        <p className="text-sm uppercase tracking-[0.28em] text-text-muted">Start gently</p>
        <h2 className="mt-3 font-display text-4xl italic leading-tight text-text-primary">
          You do not need to arrive here organized.
        </h2>
        <p className="mt-4 max-w-xl text-sm leading-relaxed text-text-secondary">
          You can unload, get grounded, ask for one tiny next step, or just let Clarity help hold
          the thread with you.
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <button
          type="button"
          onClick={() => onStarterPrompt("Everything feels noisy. Help me slow it down.")}
          className="panel p-5 text-left transition-transform hover:-translate-y-0.5"
        >
          <p className="text-sm text-text-primary">Slow me down</p>
          <p className="mt-2 text-sm leading-relaxed text-text-secondary">
            Start with grounding and a calmer pace.
          </p>
        </button>
        <button
          type="button"
          onClick={onOpenTasks}
          className="panel p-5 text-left transition-transform hover:-translate-y-0.5"
        >
          <p className="text-sm text-text-primary">Break a task down</p>
          <p className="mt-2 text-sm leading-relaxed text-text-secondary">
            Turn one intimidating thing into a few clear steps.
          </p>
        </button>
        <button
          type="button"
          onClick={onOpenGrounding}
          className="panel p-5 text-left transition-transform hover:-translate-y-0.5"
        >
          <p className="text-sm text-text-primary">Do a grounding exercise</p>
          <p className="mt-2 text-sm leading-relaxed text-text-secondary">
            Use box breathing or a sensory reset.
          </p>
        </button>
        <button
          type="button"
          onClick={onOpenFocus}
          className="panel p-5 text-left transition-transform hover:-translate-y-0.5"
        >
          <p className="text-sm text-text-primary">Start focus mode</p>
          <p className="mt-2 text-sm leading-relaxed text-text-secondary">
            Open a quiet body-double space for one task.
          </p>
        </button>
      </div>
    </div>
  );
}
