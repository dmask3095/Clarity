"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
      setError(authError.message);
      return;
    }

    router.replace("/dashboard");
    router.refresh();
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
          <button
            type="button"
            onClick={() => void handleLogin()}
            disabled={loading}
            className="w-full rounded-xl bg-accent py-3 font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign in"}
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
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-text-primary underline underline-offset-4">
            Sign up
          </Link>
        </p>
      </div>
    </main>
  );
}
