"use client";

import {
  CheckSquare,
  Copy,
  Crosshair,
  FileText,
  LogOut,
  MessageSquare,
  RefreshCw,
  Settings,
  Wind,
} from "lucide-react";
import type { AppMode } from "@/store/sessionStore";

interface SidebarProps {
  mode: AppMode;
  onSelectMode: (mode: AppMode) => void;
  onOpenTasks: () => void;
  onNewSession: () => void;
  onOpenSettings: () => void;
  onCopySession: () => void;
  onSignOut: () => void;
}

function SidebarButton({
  active,
  ariaLabel,
  onClick,
  children,
}: {
  active?: boolean;
  ariaLabel: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      onClick={onClick}
      className={`rounded-2xl p-3 transition-colors ${
        active ? "bg-accent-soft text-text-primary" : "text-text-secondary hover:bg-bg-elevated hover:text-text-primary"
      }`}
    >
      {children}
    </button>
  );
}

export function Sidebar({
  mode,
  onSelectMode,
  onOpenTasks,
  onNewSession,
  onOpenSettings,
  onCopySession,
  onSignOut,
}: SidebarProps) {
  return (
    <aside className="hidden w-16 flex-col items-center gap-6 border-r border-border-base bg-bg-surface/85 py-6 lg:flex">
      <span className="font-display text-2xl italic text-text-primary">c</span>
      <SidebarButton active={mode === "chat"} ariaLabel="Chat mode" onClick={() => onSelectMode("chat")}>
        <MessageSquare size={18} />
      </SidebarButton>
      <SidebarButton ariaLabel="Task breakdown" onClick={onOpenTasks}>
        <CheckSquare size={18} />
      </SidebarButton>
      <SidebarButton active={mode === "focus"} ariaLabel="Focus mode" onClick={() => onSelectMode("focus")}>
        <Crosshair size={18} />
      </SidebarButton>
      <SidebarButton
        active={mode === "grounding"}
        ariaLabel="Grounding exercise"
        onClick={() => onSelectMode("grounding")}
      >
        <Wind size={18} />
      </SidebarButton>
      <SidebarButton
        active={mode === "thoughtdump"}
        ariaLabel="Thought dump"
        onClick={() => onSelectMode("thoughtdump")}
      >
        <FileText size={18} />
      </SidebarButton>
      <div className="mt-auto flex flex-col gap-4">
        <SidebarButton ariaLabel="Copy session" onClick={onCopySession}>
          <Copy size={18} />
        </SidebarButton>
        <SidebarButton ariaLabel="Settings" onClick={onOpenSettings}>
          <Settings size={18} />
        </SidebarButton>
        <SidebarButton ariaLabel="New session" onClick={onNewSession}>
          <RefreshCw size={18} />
        </SidebarButton>
        <SidebarButton ariaLabel="Sign out" onClick={onSignOut}>
          <LogOut size={18} />
        </SidebarButton>
      </div>
    </aside>
  );
}
