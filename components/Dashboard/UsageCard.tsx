"use client";

interface UsageCardProps {
  limit: number;
  used: number;
  remaining: number;
  resetsOn: string;
  loading: boolean;
  error?: string;
}

export function UsageCard({
  limit,
  used,
  remaining,
  resetsOn,
  loading,
  error,
}: UsageCardProps) {
  const progress = Math.min((used / limit) * 100, 100);
  const resetLabel = new Date(`${resetsOn}T00:00:00Z`).toLocaleDateString([], {
    month: "short",
    day: "numeric",
  });

  return (
    <div className="panel mx-4 mt-4 p-5 sm:mx-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-text-secondary">Daily message space</p>
          <p className="mt-1 text-sm leading-relaxed text-text-primary">
            {loading
              ? "Checking today's usage..."
              : `${used} of ${limit} used, ${remaining} left today.`}
          </p>
        </div>
        <span className="rounded-full border border-border-base px-3 py-1 text-xs text-text-secondary">
          resets {resetLabel}
        </span>
      </div>
      <div className="mt-4 h-2 overflow-hidden rounded-full bg-bg-elevated">
        <div
          className={`h-full rounded-full transition-[width] ${
            remaining <= 10 ? "bg-warning" : "bg-accent"
          }`}
          style={{ width: `${progress}%` }}
        />
      </div>
      {error ? <p className="mt-3 text-xs text-warning">{error}</p> : null}
    </div>
  );
}
