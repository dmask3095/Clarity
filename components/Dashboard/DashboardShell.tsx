"use client";

import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ChatWindow } from "@/components/Chat/ChatWindow";
import { EmptyState } from "@/components/Dashboard/EmptyState";
import { InputBar } from "@/components/Chat/InputBar";
import { UsageCard } from "@/components/Dashboard/UsageCard";
import { StatusToast } from "@/components/Feedback/StatusToast";
import { MoodCheckIn } from "@/components/MoodCheckIn";
import SettingsPanel from "@/components/Settings/SettingsPanel";
import SupportPanel from "@/components/Support/SupportPanel";
import { useUsage } from "@/hooks/useUsage";
import { Header } from "@/components/Layout/Header";
import { Sidebar } from "@/components/Layout/Sidebar";
import { useChat } from "@/hooks/useChat";
import { useSession } from "@/hooks/useSession";
import {
  buildFocusCheckIn,
  buildGroundingLanding,
  buildMoodGreeting,
  buildTaskBreakdownPrompt,
  buildThoughtDumpPrompt,
  type MoodTag,
} from "@/lib/prompts";
import { copySessionTranscript } from "@/lib/session-export";
import { useSessionStore } from "@/store/sessionStore";

const FocusMode = dynamic(() => import("@/components/Modes/FocusMode"), { ssr: false });
const GroundingExercise = dynamic(() => import("@/components/Modes/GroundingExercise"), {
  ssr: false,
});
const ThoughtDump = dynamic(() => import("@/components/Modes/ThoughtDump"), { ssr: false });

interface DashboardShellProps {
  initialUserLabel: string;
}

export function DashboardShell({ initialUserLabel }: DashboardShellProps) {
  const router = useRouter();
  const { signOut } = useSession();
  const { sendMessage, sendPrompt } = useChat();
  const { usage, loading: usageLoading, error: usageError, refresh: refreshUsage } = useUsage();
  const messages = useSessionStore((state) => state.messages);
  const mood = useSessionStore((state) => state.mood);
  const mode = useSessionStore((state) => state.mode);
  const sessionGoal = useSessionStore((state) => state.sessionGoal);
  const preferences = useSessionStore((state) => state.preferences);
  const isStreaming = useSessionStore((state) => state.isStreaming);
  const hasHydrated = useSessionStore((state) => state.hasHydrated);
  const setMood = useSessionStore((state) => state.setMood);
  const setPreferences = useSessionStore((state) => state.setPreferences);
  const setMode = useSessionStore((state) => state.setMode);
  const setGoal = useSessionStore((state) => state.setGoal);
  const clearSession = useSessionStore((state) => state.clearSession);
  const [taskGoal, setTaskGoal] = useState("");
  const [taskOpen, setTaskOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [supportOpen, setSupportOpen] = useState(false);
  const [toast, setToast] = useState<{ message: string; tone?: "default" | "warning" } | null>(null);

  useEffect(() => {
    if (!toast) {
      return;
    }

    const timeoutId = window.setTimeout(() => setToast(null), 2600);
    return () => window.clearTimeout(timeoutId);
  }, [toast]);

  async function handleSignOut() {
    await signOut();
    router.replace("/");
    router.refresh();
  }

  function handleNewSession() {
    clearSession();
    setTaskOpen(false);
  }

  async function handleMoodSelect(nextMood: MoodTag) {
    setMood(nextMood);
    await sendPrompt(buildMoodGreeting(nextMood));
    await refreshUsage();
  }

  async function handleTaskBreakdown() {
    const trimmed = taskGoal.trim();

    if (!trimmed) {
      return;
    }

    await sendMessage(`Break this task down: ${trimmed}`, {
      goal: trimmed,
      hiddenPrompt: buildTaskBreakdownPrompt(trimmed),
    });
    await refreshUsage();

    setTaskGoal("");
    setTaskOpen(false);
  }

  async function handleSendMessage(content: string) {
    await sendMessage(content);
    await refreshUsage();
  }

  async function handleCopySession() {
    try {
      await copySessionTranscript(messages);
      setToast({ message: "Session copied to your clipboard." });
    } catch (error) {
      setToast({
        message: error instanceof Error ? error.message : "Unable to copy this session right now.",
        tone: "warning",
      });
    }
  }

  if (!hasHydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center px-6">
        <div className="w-full max-w-2xl space-y-4">
          <div className="panel h-28 animate-pulse bg-bg-surface/70" />
          <div className="panel h-40 animate-pulse bg-bg-surface/60" />
          <div className="panel h-52 animate-pulse bg-bg-surface/50" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-transparent text-text-primary">
      <Sidebar
        mode={mode}
        onSelectMode={setMode}
        onOpenTasks={() => setTaskOpen(true)}
        onNewSession={handleNewSession}
        onOpenSettings={() => setSettingsOpen(true)}
        onCopySession={() => void handleCopySession()}
        onOpenSupport={() => setSupportOpen(true)}
        onSignOut={() => void handleSignOut()}
      />

      <div className="flex min-h-screen flex-1 flex-col">
        <Header
          mode={mode}
          userLabel={initialUserLabel}
          onOpenTasks={() => setTaskOpen(true)}
          onNewSession={handleNewSession}
          onOpenSettings={() => setSettingsOpen(true)}
          onCopySession={() => void handleCopySession()}
          onOpenSupport={() => setSupportOpen(true)}
          onSignOut={() => void handleSignOut()}
          onSelectMode={setMode}
        />

        <main className="flex flex-1 flex-col">
          <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col">
            {usage ? (
              <UsageCard
                limit={usage.limit}
                used={usage.used}
                remaining={usage.remaining}
                resetsOn={usage.resetsOn}
                loading={usageLoading}
                error={usageError}
              />
            ) : null}

            {taskOpen ? (
              <div className="panel mx-4 mt-4 p-5 sm:mx-6">
                <p className="text-sm text-text-secondary">What feels too big right now?</p>
                <textarea
                  rows={3}
                  value={taskGoal}
                  onChange={(event) => setTaskGoal(event.target.value)}
                  placeholder="Give me the thing and I’ll help make it smaller."
                  className="mt-4 min-h-[110px] w-full rounded-3xl border border-border-base bg-bg-elevated/70 p-4 text-text-primary outline-none placeholder:text-text-muted"
                />
                <div className="mt-4 flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => setTaskOpen(false)}
                    className="text-sm text-text-secondary transition-colors hover:text-text-primary"
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    onClick={() => void handleTaskBreakdown()}
                    className="rounded-2xl bg-accent px-4 py-3 font-medium text-white transition-opacity hover:opacity-90"
                  >
                    Break it down
                  </button>
                </div>
              </div>
            ) : null}

            {messages.length === 0 && mode === "chat" ? (
              <>
                <div className="mt-4">
                  <MoodCheckIn
                    selectedMood={mood}
                    onSelect={(nextMood) => void handleMoodSelect(nextMood)}
                  />
                </div>
                <EmptyState
                  onStarterPrompt={(prompt) => void handleSendMessage(prompt)}
                  onOpenTasks={() => setTaskOpen(true)}
                  onOpenGrounding={() => setMode("grounding")}
                  onOpenFocus={() => setMode("focus")}
                />
              </>
            ) : null}

            <ChatWindow messages={messages} />
          </div>
        </main>

        <InputBar disabled={isStreaming} onSend={handleSendMessage} />
      </div>

      {mode === "focus" ? (
        <FocusMode
          goal={sessionGoal}
          onSetGoal={(goal) => {
            setGoal(goal);
          }}
          onCheckIn={() => {
            if (sessionGoal) {
              void sendPrompt(buildFocusCheckIn(sessionGoal)).then(() => refreshUsage());
            }
          }}
          onDone={() => {
            setMode("chat");
            if (sessionGoal) {
              void sendPrompt(
                `The user just finished a focus session for "${sessionGoal}". Ask in one warm sentence how it went.`,
              ).then(() => refreshUsage());
            }
          }}
        />
      ) : null}

      {mode === "grounding" ? (
        <GroundingExercise
          onClose={() => setMode("chat")}
          onComplete={(exercise, responses) => {
            setMode("chat");
            void sendPrompt(buildGroundingLanding(exercise, responses)).then(() => refreshUsage());
          }}
        />
      ) : null}

      {mode === "thoughtdump" ? (
        <ThoughtDump
          onClose={() => setMode("chat")}
          onSubmit={(value) => {
            setMode("chat");
            void sendMessage(value, {
              hiddenPrompt: buildThoughtDumpPrompt(value),
            }).then(() => refreshUsage());
          }}
        />
      ) : null}

      {settingsOpen ? (
        <SettingsPanel
          preferences={preferences}
          onClose={() => setSettingsOpen(false)}
          onChange={setPreferences}
        />
      ) : null}

      {supportOpen ? <SupportPanel onClose={() => setSupportOpen(false)} /> : null}

      {toast ? <StatusToast message={toast.message} tone={toast.tone} /> : null}
    </div>
  );
}
