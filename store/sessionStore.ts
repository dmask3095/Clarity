"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { MoodTag } from "@/lib/prompts";

export type AppMode = "chat" | "focus" | "grounding" | "thoughtdump";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
}

export type ChatMessagePayload = Pick<ChatMessage, "role" | "content">;

interface SessionState {
  messages: ChatMessage[];
  mood: MoodTag | null;
  sessionGoal: string | null;
  mode: AppMode;
  isStreaming: boolean;
  hasHydrated: boolean;
  setMood: (mood: MoodTag | null) => void;
  setGoal: (goal: string | null) => void;
  setMode: (mode: AppMode) => void;
  addMessage: (message: ChatMessagePayload) => void;
  startAssistantMessage: () => void;
  appendToLastAssistant: (text: string) => void;
  replaceLastAssistant: (text: string) => void;
  setStreaming: (value: boolean) => void;
  clearSession: () => void;
  setHydrated: (value: boolean) => void;
}

function buildMessage(message: ChatMessagePayload): ChatMessage {
  return {
    ...message,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };
}

export const useSessionStore = create<SessionState>()(
  persist(
    (set) => ({
      messages: [],
      mood: null,
      sessionGoal: null,
      mode: "chat",
      isStreaming: false,
      hasHydrated: false,
      setMood: (mood) => set({ mood }),
      setGoal: (goal) => set({ sessionGoal: goal }),
      setMode: (mode) => set({ mode }),
      setStreaming: (isStreaming) => set({ isStreaming }),
      setHydrated: (hasHydrated) => set({ hasHydrated }),
      addMessage: (message) =>
        set((state) => ({
          messages: [...state.messages, buildMessage(message)],
        })),
      startAssistantMessage: () =>
        set((state) => ({
          messages: [...state.messages, buildMessage({ role: "assistant", content: "" })],
        })),
      appendToLastAssistant: (text) =>
        set((state) => {
          const messages = [...state.messages];
          const last = messages[messages.length - 1];

          if (last?.role === "assistant") {
            messages[messages.length - 1] = { ...last, content: `${last.content}${text}` };
            return { messages };
          }

          return {
            messages: [...messages, buildMessage({ role: "assistant", content: text })],
          };
        }),
      replaceLastAssistant: (text) =>
        set((state) => {
          const messages = [...state.messages];
          const last = messages[messages.length - 1];

          if (last?.role === "assistant") {
            messages[messages.length - 1] = { ...last, content: text };
            return { messages };
          }

          return {
            messages: [...messages, buildMessage({ role: "assistant", content: text })],
          };
        }),
      clearSession: () =>
        set({
          messages: [],
          mood: null,
          sessionGoal: null,
          mode: "chat",
          isStreaming: false,
        }),
    }),
    {
      name: "clarity-session",
      partialize: (state) => ({
        messages: state.messages,
        mood: state.mood,
        sessionGoal: state.sessionGoal,
        mode: state.mode,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    },
  ),
);
