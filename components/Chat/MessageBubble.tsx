"use client";

import { TaskList } from "@/components/TaskBreakdown/TaskList";
import type { ChatMessage } from "@/store/sessionStore";

interface MessageBubbleProps {
  message: ChatMessage;
}

function stripHeadingMarkers(text: string) {
  return text
    .split("\n")
    .map((line) => line.replace(/^#{1,6}\s*/g, ""))
    .join("\n");
}

function parseTaskSteps(content: string) {
  const lines = content
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const steps = lines
    .map((line) =>
      line
        .replace(/^\d+\.\s*/, "")
        .replace(/^🟢\s*/, "")
        .replace(/\*\*/g, "")
        .trim(),
    )
    .filter(Boolean);

  return lines.length > 1 && lines.every((line) => /^(\d+\.\s|🟢\s)/.test(line)) ? steps : null;
}

function renderInlineStrong(text: string) {
  return text.split(/(\*\*.*?\*\*)/g).map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={`${part}-${index}`} className="font-medium text-text-primary">
          {part.slice(2, -2)}
        </strong>
      );
    }

    return <span key={`${part}-${index}`}>{part}</span>;
  });
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const cleaned = stripHeadingMarkers(message.content).trim();
  const taskSteps = parseTaskSteps(cleaned);
  const time = new Date(message.createdAt).toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });

  return (
    <div
      className={`group animate-message-in ${message.role === "user" ? "ml-auto" : "mr-auto"} max-w-[85%]`}
    >
      <div
        className={`rounded-2xl px-4 py-3 ${
          message.role === "user"
            ? "rounded-br-sm bg-accent-soft text-text-primary"
            : "rounded-bl-sm bg-bg-surface text-text-primary"
        }`}
      >
        {cleaned ? (
          taskSteps ? (
            <TaskList steps={taskSteps} />
          ) : (
            <div className="space-y-3 text-sm leading-relaxed text-text-primary sm:text-[15px]">
              {cleaned.split("\n\n").map((paragraph, index) => (
                <p key={`${paragraph}-${index}`}>{renderInlineStrong(paragraph)}</p>
              ))}
            </div>
          )
        ) : (
          <div className="flex items-center gap-1 py-1 text-text-secondary">
            <span className="h-2 w-2 animate-pulse rounded-full bg-text-secondary/70" />
            <span className="h-2 w-2 animate-pulse rounded-full bg-text-secondary/50 [animation-delay:120ms]" />
            <span className="h-2 w-2 animate-pulse rounded-full bg-text-secondary/35 [animation-delay:240ms]" />
          </div>
        )}
      </div>
      <p className="mt-1 px-2 text-xs text-text-muted opacity-0 transition-opacity group-hover:opacity-100">
        {time}
      </p>
    </div>
  );
}
