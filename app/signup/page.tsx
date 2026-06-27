"use client";

import { useState } from "react";
import { AuthCard } from "@/components/Auth/AuthCard";
import { normalizeAuthError } from "@/lib/auth-errors";
import { createClient } from "@/lib/supabase";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  async function handleSignup() {
    const supabase = createClient();
    setLoading(true);
    setError("");
    setMessage("");

    const { error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    setLoading(false);

    if (authError) {
      setError(normalizeAuthError(authError.message));
      return;
    }

    setMessage("Check your email to confirm your account, then come back here to log in.");
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
      title="Build a private place to land."
      subtitle="Create an account to unlock grounded chat, guided focus sessions, and gentle task support."
      footerPrompt="Already have an account?"
      footerHref="/login"
      footerLabel="Log in"
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
        <p className="text-xs leading-relaxed text-text-muted">
          Use at least 6 characters. You can always switch to Google later if that feels easier.
        </p>
        {error ? <p className="text-sm text-warning">{error}</p> : null}
        {message ? <p className="text-sm text-success">{message}</p> : null}
        <button
          type="button"
          onClick={() => void handleSignup()}
          disabled={loading || googleLoading || !email.trim() || password.length < 6}
          className="w-full rounded-xl bg-accent py-3 font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {loading ? "Creating account..." : "Sign up"}
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
