import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase-server";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/dashboard");
  }

  return (
    <main className="ambient-grid relative min-h-screen overflow-hidden px-6 py-10 sm:px-10">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-6xl flex-col justify-between gap-16">
        <header className="flex items-center justify-between">
          <span className="font-display text-3xl italic text-text-primary">clarity</span>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="rounded-full border border-border-base px-4 py-2 text-sm text-text-secondary transition-colors hover:text-text-primary"
            >
              Log in
            </Link>
            <Link
              href="/signup"
              className="rounded-full bg-accent px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
            >
              Get started
            </Link>
          </div>
        </header>

        <section className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="max-w-2xl">
            <p className="mb-4 text-sm uppercase tracking-[0.32em] text-text-muted">
              Grounding. Focus. Gentle momentum.
            </p>
            <h1 className="text-balance font-display text-5xl italic leading-[0.95] text-text-primary sm:text-6xl">
              A private AI companion for the moments your mind feels too loud.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-text-secondary">
              Clarity helps with emotional grounding, ADHD friction, task paralysis, racing
              thoughts, and focus recovery without turning your life into a dashboard.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/signup"
                className="rounded-2xl bg-accent px-5 py-3 font-medium text-white transition-opacity hover:opacity-90"
              >
                Create your calm space
              </Link>
              <Link
                href="/login"
                className="rounded-2xl border border-border-base px-5 py-3 text-text-secondary transition-colors hover:text-text-primary"
              >
                I already have an account
              </Link>
            </div>
          </div>

          <div className="panel relative overflow-hidden p-6 sm:p-8">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(123,108,255,0.18),transparent_45%)]" />
            <div className="relative space-y-5">
              <div className="rounded-3xl border border-border-base/70 bg-bg-base/80 p-4">
                <p className="text-sm leading-relaxed text-text-secondary">
                  “Everything feels too big. I don&apos;t know where to start.”
                </p>
              </div>
              <div className="rounded-3xl border border-accent/30 bg-accent-soft/70 p-5 text-text-primary">
                <p className="leading-relaxed">
                  Let&apos;s make this smaller. <strong className="font-medium">Step 1:</strong>{" "}
                  open the thing you need to work on. Nothing else yet.
                </p>
              </div>
              <div className="grid gap-3 text-sm text-text-secondary sm:grid-cols-2">
                <div className="rounded-2xl border border-border-base/70 bg-bg-base/60 p-4">
                  Task breakdowns that start with one tiny move
                </div>
                <div className="rounded-2xl border border-border-base/70 bg-bg-base/60 p-4">
                  Real-time grounding when anxiety spikes
                </div>
                <div className="rounded-2xl border border-border-base/70 bg-bg-base/60 p-4">
                  Voice-first support when typing feels like too much
                </div>
                <div className="rounded-2xl border border-border-base/70 bg-bg-base/60 p-4">
                  Warm, adaptive tone with no shame and no pressure
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
