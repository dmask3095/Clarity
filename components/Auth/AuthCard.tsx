"use client";

import Link from "next/link";

interface AuthCardProps {
  title: string;
  subtitle: string;
  footerPrompt: string;
  footerHref: string;
  footerLabel: string;
  children: React.ReactNode;
}

export function AuthCard({
  title,
  subtitle,
  footerPrompt,
  footerHref,
  footerLabel,
  children,
}: AuthCardProps) {
  return (
    <main className="flex min-h-screen items-start justify-center px-6 py-16">
      <div className="panel mt-10 w-full max-w-sm p-8">
        <p className="font-display text-3xl italic text-text-primary">clarity</p>
        <p className="mt-3 text-sm leading-relaxed text-text-secondary">{title}</p>
        <p className="mt-2 text-sm leading-relaxed text-text-muted">{subtitle}</p>
        <div className="mt-8">{children}</div>
        <p className="mt-6 text-sm text-text-secondary">
          {footerPrompt}{" "}
          <Link href={footerHref} className="text-text-primary underline underline-offset-4">
            {footerLabel}
          </Link>
        </p>
      </div>
    </main>
  );
}
