"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { AuthCard } from "@/components/Auth/AuthCard";
import { normalizeAuthError } from "@/lib/auth-errors";
import { createClient } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  async function handleLogin() {
    const supabase = createClient();
    setLoading(true);
    setError("");

    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (authError) {
      setError(normalizeAuthError(authError.message));
      return;
    }

    router.replace("/dashboard");
    router.refresh();
  }

  async function handleGoogle() {
    const supabase = createClient();
    setGoogleLoading(true);
    setError("");

    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (oauthError) {
      setError(normalizeAuthError(oauthError.message));
      setGoogleLoading(false);
    }
  }

  return (
    <AuthCard
      title="Come back into a quieter space."
      subtitle="Log in to return to your grounded chat, task support, and focus tools."
      footerPrompt="Don't have an account?"
      footerHref="/signup"
      footerLabel="Sign up"
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-xs uppercase tracking-[0.24em] text-text-muted">Email</label>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Email"
            className="w-full rounded-xl border border-border-base bg-bg-elevated px-4 py-3 text-text-primary outline-none placeholder:text-text-muted"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs uppercase tracking-[0.24em] text-text-muted">Password</label>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Password"
            className="w-full rounded-xl border border-border-base bg-bg-elevated px-4 py-3 text-text-primary outline-none placeholder:text-text-muted"
          />
        </div>
        {error ? <p className="text-sm text-warning">{error}</p> : null}
        <button
          type="button"
          onClick={() => void handleLogin()}
          disabled={loading || googleLoading || !email.trim() || !password.trim()}
          className="w-full rounded-xl bg-accent py-3 font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>
        <div className="text-center text-sm text-text-secondary">or</div>
        <button
          type="button"
          onClick={() => void handleGoogle()}
          disabled={loading || googleLoading}
          className="w-full rounded-xl border border-border-base bg-bg-elevated py-3 text-text-primary transition-colors hover:border-accent/40 disabled:opacity-60"
        >
          {googleLoading ? "Opening Google..." : "Continue with Google"}
        </button>
      </div>
    </AuthCard>
  );
}
