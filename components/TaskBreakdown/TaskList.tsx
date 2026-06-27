"use client";

import { useState } from "react";
import { TaskItem } from "./TaskItem";

interface TaskListProps {
  steps: string[];
}

export function TaskList({ steps }: TaskListProps) {
  const [completed, setCompleted] = useState<Record<number, boolean>>({});

  return (
    <div className="mt-3 rounded-3xl border border-border-base/70 bg-bg-base/45 p-4">
      <p className="mb-3 text-sm text-text-secondary">Breaking it down:</p>
      <div className="space-y-2">
        {steps.map((step, index) => (
          <TaskItem
            key={`${index}-${step}`}
            checked={Boolean(completed[index])}
            isFirst={index === 0}
            label={step}
            onToggle={() =>
              setCompleted((current) => ({
                ...current,
                [index]: !current[index],
              }))
            }
          />
        ))}
      </div>
    </div>
  );
}
