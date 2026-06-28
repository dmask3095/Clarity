"use client";

export default function SupportPanel({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-bg-base/94 px-6">
      <div className="panel w-full max-w-3xl p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-text-muted">Support Now</p>
            <h2 className="mt-3 font-display text-4xl italic text-text-primary">
              Clarity can sit with you, but it can&apos;t provide emergency care.
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-text-secondary">
              If you may act on thoughts of self-harm, suicide, or you feel unsafe right now, use a
              human crisis service immediately.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-2xl border border-border-base px-4 py-2 text-sm text-text-secondary transition-colors hover:text-text-primary"
          >
            Close
          </button>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <div className="rounded-3xl border border-warning/30 bg-warning/10 p-5">
            <p className="text-sm text-text-primary">Urgent emotional or mental health crisis</p>
            <p className="mt-2 text-sm leading-relaxed text-text-secondary">
              In the United States and its territories, call or text <strong>988</strong> any time,
              day or night. You can also use 988 chat.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <a
                href="tel:988"
                className="rounded-2xl bg-accent px-4 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90"
              >
                Call 988
              </a>
              <a
                href="sms:988"
                className="rounded-2xl border border-border-base px-4 py-3 text-sm text-text-primary transition-colors hover:border-accent/40"
              >
                Text 988
              </a>
              <a
                href="https://chat.988lifeline.org/"
                target="_blank"
                rel="noreferrer"
                className="rounded-2xl border border-border-base px-4 py-3 text-sm text-text-primary transition-colors hover:border-accent/40"
              >
                Chat 988
              </a>
            </div>
          </div>

          <div className="rounded-3xl border border-border-base bg-bg-elevated/60 p-5">
            <p className="text-sm text-text-primary">Immediate danger or medical emergency</p>
            <p className="mt-2 text-sm leading-relaxed text-text-secondary">
              If someone is in immediate danger, having a medical emergency, or you need urgent in-person
              help, call <strong>911</strong> now.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <a
                href="tel:911"
                className="rounded-2xl bg-accent px-4 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90"
              >
                Call 911
              </a>
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-3xl border border-border-base bg-bg-elevated/40 p-5">
          <p className="text-sm text-text-primary">If you can keep going here for a moment</p>
          <p className="mt-2 text-sm leading-relaxed text-text-secondary">
            You could also reach out to a trusted person nearby, move closer to other people, or put a little
            distance between you and anything you could use to hurt yourself while you wait for human support.
          </p>
        </div>

        <p className="mt-6 text-xs leading-relaxed text-text-muted">
          This panel is written for U.S. users. If you&apos;re elsewhere, use your local emergency number or local
          crisis service right away.
        </p>
      </div>
    </div>
  );
}
