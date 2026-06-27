import type { ChatMessage } from "@/store/sessionStore";

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
}

export function buildSessionTranscript(messages: ChatMessage[]) {
  return messages
    .map((message) => {
      const speaker = message.role === "user" ? "You" : "Clarity";
      return `[${formatTime(message.createdAt)}] ${speaker}: ${message.content}`;
    })
    .join("\n\n");
}

export async function copySessionTranscript(messages: ChatMessage[]) {
  const transcript = buildSessionTranscript(messages);

  if (!transcript.trim()) {
    throw new Error("There isn't a session to copy yet.");
  }

  await navigator.clipboard.writeText(transcript);
}
