# Design System — Clarity

## Aesthetic Direction

Clarity should feel like **a dimly lit, quiet room** — the digital equivalent of sitting with a trusted friend at 11pm. Not a productivity dashboard. Not a wellness app with sunflowers. A calm, private, low-pressure space.

Think: journaling in a dark-themed notes app crossed with the warmth of a late-night conversation.

---

## Color Palette

Define in `tailwind.config.ts` as CSS variables + Tailwind extensions:

```typescript
// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'bg-base':     '#0F0F14',   // near-black, slight blue tint
        'bg-surface':  '#17171F',   // card / panel surfaces
        'bg-elevated': '#1E1E28',   // modals, focus areas, inputs
        'text-primary':   '#E8E6F0', // soft white, main readable text
        'text-secondary': '#9B99AA', // hints, timestamps, secondary
        'text-muted':     '#5C5A6A', // placeholders
        'accent':         '#7B6CFF', // muted lavender — calm, not urgent
        'accent-soft':    '#2D2851', // accent bg tint for bubbles/tags
        'success':        '#4CAF82', // soft green for completions
        'calm':           '#6AB0C4', // blue for grounding/breathing
        'warning':        '#C4966A', // warm amber — never use red
        'border-base':    '#2A2A36',
        'border-subtle':  '#1E1E28',
      },
      fontFamily: {
        display: ['Instrument Serif', 'Georgia', 'serif'],
        body:    ['Inter', 'system-ui', 'sans-serif'],
      },
      lineHeight: {
        relaxed: '1.8', // use for chat messages
      },
      animation: {
        'pulse-slow': 'pulse 3s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}

export default config
```

### Add to `app/layout.tsx` `<head>`:
```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
<link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter:wght@300;400;500&display=swap" rel="stylesheet" />
```

---

## Global Base Styles (`app/globals.css`)

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  html, body {
    background-color: #0F0F14;
    color: #E8E6F0;
    font-family: 'Inter', system-ui, sans-serif;
    -webkit-font-smoothing: antialiased;
  }

  * {
    box-sizing: border-box;
  }

  /* Respect reduced motion — disable ALL animations */
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      transition-duration: 0.01ms !important;
    }
  }
}

@layer utilities {
  /* Scrollbar — match dark theme */
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: #0F0F14; }
  ::-webkit-scrollbar-thumb { background: #2A2A36; border-radius: 2px; }
}
```

---

## Layout

### App Shell (`app/dashboard/page.tsx`)

```
Desktop:
┌──────────┬──────────────────────────────────────────┐
│ SIDEBAR  │  MAIN CONTENT AREA (max-w-2xl, centered) │
│ (64px)   │                                          │
│          │  Chat / Focus / Grounding / ThoughtDump  │
│          │                                          │
└──────────┴──────────────────────────────────────────┘
                          ↕
                    INPUT BAR (sticky bottom)

Mobile:
┌─────────────────────────────────────────────────────┐
│  HEADER (logo + mode icon)                          │
├─────────────────────────────────────────────────────┤
│  MAIN CONTENT (full width)                          │
│                                                     │
├─────────────────────────────────────────────────────┤
│  INPUT BAR                                          │
└─────────────────────────────────────────────────────┘
```

Tailwind class patterns:
- Body: `bg-bg-base text-text-primary font-body`
- Sidebar: `w-16 bg-bg-surface border-r border-border-base flex flex-col items-center py-6 gap-6`
- Main: `flex-1 flex flex-col max-w-2xl mx-auto w-full`
- Input bar: `sticky bottom-0 bg-bg-base border-t border-border-base p-4`

---

## Component Specs

### Chat Message Bubble

```
User message (right-aligned):
  bg-accent-soft, text-text-primary, rounded-2xl rounded-br-sm
  max-w-[85%], ml-auto, px-4 py-3

AI message (left-aligned):
  bg-bg-surface, text-text-primary, rounded-2xl rounded-bl-sm
  max-w-[85%], px-4 py-3, leading-relaxed

Timestamp:
  text-text-muted text-xs mt-1, opacity-0 group-hover:opacity-100 transition-opacity
```

AI typing indicator: three dots, gentle opacity pulse animation

### Input Bar

```
┌──────────────────────────────────────────[🎤][↑]┐
│  Type or tap the mic to speak...                 │
└──────────────────────────────────────────────────┘
```
- `bg-bg-elevated border border-border-base rounded-2xl flex items-end gap-2 p-3`
- Textarea: `flex-1 bg-transparent resize-none text-text-primary placeholder:text-text-muted outline-none text-base leading-relaxed max-h-32`
- Mic button: `text-text-secondary hover:text-accent` — pulsing red dot when active
- Send button: `bg-accent text-white rounded-xl p-2` — disabled + `opacity-40` when empty

### Mood Check-In Tags

```
[overwhelmed]  [anxious]  [scattered]  [numb]  [okay]  [focused]
```
- Default: `px-4 py-2 rounded-full border border-border-base text-text-secondary text-sm`
- Selected: `border-accent bg-accent-soft text-text-primary`
- Role: `role="radio"` with `aria-checked`

### Task Breakdown Checklist

```
┌──────────────────────────────────────┐
│  Breaking it down:                   │
│                                      │
│  🟢  Open a new doc          ← first step: bg-accent-soft/20 row
│  ○   Write 3 bullet points
│  ○   Expand each one
│  ○   Add a title
│  ○   Read once and save
└──────────────────────────────────────┘
```
- Completed: `line-through text-text-muted`
- Checkbox: custom SVG circle, fills `accent` on check

### Focus Mode (Full Viewport)

```
                    ┌─────────────────────┐
                    │                     │
                    │  Working on:        │ text-text-secondary text-sm
                    │                     │
                    │  [GOAL TEXT]        │ font-display text-3xl italic text-text-primary
                    │                     │
                    │      · · ·          │ accent pulse, 3s, prefers-reduced-motion off
                    │                     │
                    │  [ I'm done ]       │ text-text-secondary text-sm cursor-pointer
                    └─────────────────────┘
```
- Container: `fixed inset-0 z-50 bg-bg-base flex flex-col items-center justify-center`
- Goal: `font-display text-3xl md:text-4xl italic text-center max-w-lg leading-tight`

### Grounding Exercise Card

```
┌──────────────────────────────────────┐
│  ○ ○ ● ○  (step 3 of 4)             │ progress dots
│                                      │
│  Breathe out slowly...               │ text-lg leading-relaxed
│                                      │
│   [SVG circle timer — 4s stroke]     │ calm color stroke
│                                      │
│           [Ready →]                  │ accent button
└──────────────────────────────────────┘
```
- Card: `bg-bg-surface rounded-3xl p-8 max-w-sm w-full mx-auto`
- Progress dots: current = `bg-accent`, done = `bg-success`, upcoming = `bg-border-base`
- Timer SVG: stroke animation over 4s, `stroke: #6AB0C4` (calm color)

---

## Motion

Use only for:
- Message fade + slide up on appear: `opacity-0 translate-y-1 → opacity-100 translate-y-0`, 200ms ease-out
- AI typing dots: opacity pulse
- Focus mode ambient pulse: `animate-pulse-slow` on dots
- Grounding timer: SVG stroke-dashoffset animation
- Mood tag selection: border/bg color transition 150ms

Do NOT use motion for:
- Page transitions
- Sidebar toggle
- Input interactions

---

## Iconography (Lucide React)

Size: 18px standard, 20px for primary actions.

| Purpose | Icon |
|---|---|
| Mic on | `Mic` |
| Mic active | `MicOff` |
| Send | `ArrowUp` |
| Focus Mode | `Focus` |
| Grounding | `Wind` |
| Thought Dump | `FileText` |
| Tasks | `CheckSquare` |
| New session | `RefreshCw` |
| Close | `X` |
| Settings | `Settings` |
| Sign out | `LogOut` |

All icon buttons: `aria-label` required.
```tsx
<button aria-label="Start voice input" className="...">
  <Mic size={18} />
</button>
```

---

## Auth Pages (`/login`, `/signup`)

Same dark palette. Centered card layout. No decorative elements — these pages should feel calm and private.

```
┌────────────────────────────────────┐
│                                    │
│  clarity                           │ font-display, text-2xl, italic
│                                    │
│  [Email input]                     │
│  [Password input]                  │
│                                    │
│  [Sign in ──────────────────────]  │ full-width accent button
│                                    │
│  ── or ──                          │
│                                    │
│  [Continue with Google]            │ bg-bg-elevated, border, full-width
│                                    │
│  Don't have an account? Sign up    │ text-text-secondary
└────────────────────────────────────┘
```

- Card: `bg-bg-surface rounded-3xl p-8 max-w-sm w-full mx-auto mt-24`
- Inputs: `bg-bg-elevated border border-border-base rounded-xl px-4 py-3 text-text-primary placeholder:text-text-muted outline-none focus:border-accent transition-colors`
- Primary button: `bg-accent text-white rounded-xl py-3 font-medium hover:opacity-90 transition-opacity`
- Error messages: `text-warning text-sm` — never red
