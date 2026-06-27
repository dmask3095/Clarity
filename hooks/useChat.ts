"use client";

import { streamChat } from "@/lib/anthropic";
import { buildPreferenceContext, SYSTEM_PROMPT } from "@/lib/prompts";
import { useSessionStore, type ChatMessagePayload } from "@/store/sessionStore";

interface SendMessageOptions {
  hiddenPrompt?: string;
  visibleUserMessage?: string | null;
  goal?: string | null;
}

function toPayload(message: ChatMessagePayload): ChatMessagePayload {
  return {
    role: message.role,
    content: message.content,
  };
}

export function useChat() {
  const messages = useSessionStore((state) => state.messages);
  const addMessage = useSessionStore((state) => state.addMessage);
  const startAssistantMessage = useSessionStore((state) => state.startAssistantMessage);
  const appendToLastAssistant = useSessionStore((state) => state.appendToLastAssistant);
  const replaceLastAssistant = useSessionStore((state) => state.replaceLastAssistant);
  const setStreaming = useSessionStore((state) => state.setStreaming);
  const setGoal = useSessionStore((state) => state.setGoal);
  const mood = useSessionStore((state) => state.mood);
  const sessionGoal = useSessionStore((state) => state.sessionGoal);
  const preferences = useSessionStore((state) => state.preferences);

  async function sendMessage(content: string, options: SendMessageOptions = {}) {
    const visibleUserMessage = options.visibleUserMessage ?? content;
    const nextVisibleMessages = [...messages];

    if (visibleUserMessage) {
      const userMessage: ChatMessagePayload = { role: "user", content: visibleUserMessage };
      nextVisibleMessages.push({
        ...userMessage,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
      });
      addMessage(userMessage);
    }

    if (options.goal !== undefined) {
      setGoal(options.goal);
    }

    const apiMessages = nextVisibleMessages
      .slice(-20)
      .map((message) => toPayload(message))
      .concat(options.hiddenPrompt ? [{ role: "user" as const, content: options.hiddenPrompt }] : []);

    const activeGoal = options.goal !== undefined ? options.goal : sessionGoal;
    const systemPrompt = [SYSTEM_PROMPT, buildPreferenceContext(preferences, mood, activeGoal)]
      .filter(Boolean)
      .join("\n\n");

    startAssistantMessage();
    setStreaming(true);

    await streamChat(
      apiMessages,
      systemPrompt,
      (text) => appendToLastAssistant(text),
      () => setStreaming(false),
      (error) => {
        replaceLastAssistant(error);
        setStreaming(false);
      },
    );
  }

  async function sendPrompt(prompt: string) {
    await sendMessage(prompt, { hiddenPrompt: prompt, visibleUserMessage: null });
  }

  return {
    sendMessage,
    sendPrompt,
  };
}
