import type { Metadata, Viewport } from "next";
import { Instrument_Serif, Inter } from "next/font/google";
import "./globals.css";

const bodyFont = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["300", "400", "500", "600"],
});

const displayFont = Instrument_Serif({
  subsets: ["latin"],
  variable: "--font-display",
  weight: "400",
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: {
    default: "Clarity",
    template: "%s | Clarity",
  },
  description: "A calm AI companion for grounding, focus, and emotional clarity.",
  applicationName: "Clarity",
  keywords: [
    "ADHD support",
    "focus companion",
    "grounding",
    "emotional regulation",
    "executive dysfunction",
    "AI companion",
  ],
  category: "health",
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
  manifest: "/manifest.webmanifest",
  openGraph: {
    title: "Clarity",
    description: "A calm AI companion for grounding, focus, and emotional clarity.",
    type: "website",
    siteName: "Clarity",
  },
  twitter: {
    card: "summary",
    title: "Clarity",
    description: "A calm AI companion for grounding, focus, and emotional clarity.",
  },
  appleWebApp: {
    capable: true,
    title: "Clarity",
    statusBarStyle: "black-translucent",
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
};

export const viewport: Viewport = {
  themeColor: "#0F0F14",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${bodyFont.variable} ${displayFont.variable}`}>{children}</body>
    </html>
  );
}
