"use client";

import { CheckSquare, Crosshair, FileText, LogOut, RefreshCw, Settings, Wind } from "lucide-react";
import type { AppMode } from "@/store/sessionStore";

interface HeaderProps {
  mode: AppMode;
  userLabel: string;
  onOpenTasks: () => void;
  onNewSession: () => void;
  onOpenSettings: () => void;
  onSignOut: () => void;
  onSelectMode: (mode: AppMode) => void;
}

const labels: Record<AppMode, string> = {
  chat: "Companion chat",
  focus: "Focus mode",
  grounding: "Grounding",
  thoughtdump: "Thought dump",
};

export function Header({
  mode,
  userLabel,
  onOpenTasks,
  onNewSession,
  onOpenSettings,
  onSignOut,
  onSelectMode,
}: HeaderProps) {
  return (
    <header className="border-b border-border-base bg-bg-base/75 px-4 py-4 backdrop-blur lg:hidden">
      <div className="mx-auto flex max-w-2xl items-center justify-between gap-4">
        <div>
          <p className="font-display text-2xl italic text-text-primary">clarity</p>
          <p className="text-xs text-text-secondary">
            {labels[mode]} for {userLabel}
          </p>
        </div>
        <div className="flex items-center gap-2 text-text-secondary">
          <button type="button" aria-label="Task breakdown" onClick={onOpenTasks} className="rounded-xl p-2 hover:bg-bg-surface">
            <CheckSquare size={18} />
          </button>
          <button type="button" aria-label="Focus mode" onClick={() => onSelectMode("focus")} className="rounded-xl p-2 hover:bg-bg-surface">
            <Crosshair size={18} />
          </button>
          <button type="button" aria-label="Grounding exercise" onClick={() => onSelectMode("grounding")} className="rounded-xl p-2 hover:bg-bg-surface">
            <Wind size={18} />
          </button>
          <button type="button" aria-label="Thought dump" onClick={() => onSelectMode("thoughtdump")} className="rounded-xl p-2 hover:bg-bg-surface">
            <FileText size={18} />
          </button>
          <button type="button" aria-label="Settings" onClick={onOpenSettings} className="rounded-xl p-2 hover:bg-bg-surface">
            <Settings size={18} />
          </button>
          <button type="button" aria-label="New session" onClick={onNewSession} className="rounded-xl p-2 hover:bg-bg-surface">
            <RefreshCw size={18} />
          </button>
          <button type="button" aria-label="Sign out" onClick={onSignOut} className="rounded-xl p-2 hover:bg-bg-surface">
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </header>
  );
}
