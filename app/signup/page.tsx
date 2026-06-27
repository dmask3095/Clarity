"use client";

import Link from "next/link";
import { useState } from "react";
import { createClient } from "@/lib/supabase";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

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
      setError(authError.message);
      return;
    }

    setMessage("Check your email to confirm your account, then come back here to log in.");
  }

  async function handleGoogle() {
    const supabase = createClient();
    setError("");
    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (oauthError) {
      setError(oauthError.message);
    }
  }

  return (
    <main className="flex min-h-screen items-start justify-center px-6 py-16">
      <div className="panel mt-10 w-full max-w-sm p-8">
        <p className="font-display text-3xl italic text-text-primary">clarity</p>
        <div className="mt-8 space-y-4">
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Email"
            className="w-full rounded-xl border border-border-base bg-bg-elevated px-4 py-3 text-text-primary outline-none placeholder:text-text-muted"
          />
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Password"
            className="w-full rounded-xl border border-border-base bg-bg-elevated px-4 py-3 text-text-primary outline-none placeholder:text-text-muted"
          />
          {error ? <p className="text-sm text-warning">{error}</p> : null}
          {message ? <p className="text-sm text-success">{message}</p> : null}
          <button
            type="button"
            onClick={() => void handleSignup()}
            disabled={loading}
            className="w-full rounded-xl bg-accent py-3 font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {loading ? "Creating account..." : "Sign up"}
          </button>
          <div className="text-center text-sm text-text-secondary">or</div>
          <button
            type="button"
            onClick={() => void handleGoogle()}
            className="w-full rounded-xl border border-border-base bg-bg-elevated py-3 text-text-primary transition-colors hover:border-accent/40"
          >
            Continue with Google
          </button>
        </div>
        <p className="mt-6 text-sm text-text-secondary">
          Already have an account?{" "}
          <Link href="/login" className="text-text-primary underline underline-offset-4">
            Log in
          </Link>
        </p>
      </div>
    </main>
  );
}
