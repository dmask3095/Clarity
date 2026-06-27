import type { ChatMessagePayload } from "@/store/sessionStore";

export async function streamChat(
  messages: ChatMessagePayload[],
  systemPrompt: string,
  onChunk: (text: string) => void,
  onDone: () => void,
  onError: (error: string) => void,
) {
  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ messages, systemPrompt }),
    });

    if (response.status === 429) {
      const data = await response.json();
      onError(data.message ?? "You've reached today's message limit.");
      return;
    }

    if (response.status === 401) {
      onError("Your session has expired. Please log in again.");
      return;
    }

    if (!response.ok || !response.body) {
      onError("Something went quiet. Try again in a moment.");
      return;
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();

      if (done) {
        break;
      }

      buffer += decoder.decode(value, { stream: true });
      const events = buffer.split("\n\n");
      buffer = events.pop() ?? "";

      for (const event of events) {
        const line = event
          .split("\n")
          .find((entry) => entry.startsWith("data:"));

        if (!line) {
          continue;
        }

        const data = line.replace("data:", "").trim();

        if (data === "[DONE]") {
          onDone();
          return;
        }

        try {
          const parsed = JSON.parse(data) as { error?: string; text?: string };

          if (parsed.text) {
            onChunk(parsed.text);
          }

          if (parsed.error) {
            onError(parsed.error);
            return;
          }
        } catch {
          // Ignore malformed partial chunks.
        }
      }
    }

    onDone();
  } catch {
    onError("The connection dropped. Try again when you're ready.");
  }
}
