# CLAUDE.md — Instructions for Claude Code

Read this file first. Then read all referenced spec files before writing a single line of code.

---

## What You're Building

**Clarity** — an AI-powered emotional grounding and focus companion for people with ADHD, anxiety, and executive dysfunction. It is a calm, private, non-judgmental companion — not a productivity dashboard.

This is a **production public deployment**. Every decision must prioritize:
1. **Cost efficiency** — runs entirely on free tiers
2. **Safety** — no API key exposure, auth-gated AI access, per-user rate limits
3. **Performance** — fast cold starts, minimal bundle, streaming responses

---

## Read These Files First (in order)

1. `PRD.md` — Product requirements, feature list, user personas
2. `AI_PROMPTS.md` — System prompt, persona rules, all prompt templates
3. `TECHNICAL_SPEC.md` — Full architecture, code scaffolding, implementation patterns
4. `DESIGN_SYSTEM.md` — Colors, typography, component specs, motion rules

Do not write any code until all four files are read.

---

## Tech Stack (Free-Tier Production)

| Layer | Choice | Why |
|---|---|---|
| Frontend + API | **Vercel** | Free tier, global CDN, serverless functions |
| Auth + DB | **Supabase** | Free tier: email/OAuth auth + Postgres |
| AI | **Anthropic Claude API** (`claude-haiku-3-5`) | Cheapest capable model; ~$0.001/message |
| Styling | **Tailwind CSS** | Zero runtime cost |
| State | **Zustand** | Minimal bundle |
| ORM | **Supabase JS client** | No extra ORM needed |

**No separate Express server.** All backend logic lives in Vercel API Routes (`/api/*.ts`).

---

## Folder Structure

```
clarity/
├── CLAUDE.md
├── PRD.md
├── AI_PROMPTS.md
├── TECHNICAL_SPEC.md
├── DESIGN_SYSTEM.md
│
├── app/                        # Next.js App Router
│   ├── layout.tsx
│   ├── page.tsx                # Landing / auth redirect
│   ├── login/
│   │   └── page.tsx
│   ├── signup/
│   │   └── page.tsx
│   └── dashboard/
│       └── page.tsx            # Main app (auth-protected)
│
├── api/                        # Vercel Serverless Functions
│   └── chat/
│       └── route.ts            # POST /api/chat — streaming AI endpoint
│
├── components/
│   ├── Chat/
│   │   ├── ChatWindow.tsx
│   │   ├── MessageBubble.tsx
│   │   ├── InputBar.tsx
│   │   └── VoiceButton.tsx
│   ├── Modes/
│   │   ├── FocusMode.tsx
│   │   ├── GroundingExercise.tsx
│   │   └── ThoughtDump.tsx
│   ├── TaskBreakdown/
│   │   ├── TaskList.tsx
│   │   └── TaskItem.tsx
│   ├── MoodCheckIn.tsx
│   └── Layout/
│       ├── Sidebar.tsx
│       └── Header.tsx
│
├── hooks/
│   ├── useChat.ts
│   ├── useVoiceInput.ts
│   └── useSession.ts
│
├── lib/
│   ├── anthropic.ts            # Client-side streaming fetch
│   ├── prompts.ts              # System prompt + templates
│   ├── supabase.ts             # Supabase client (browser)
│   └── supabase-server.ts      # Supabase client (server/API routes)
│
├── store/
│   └── sessionStore.ts
│
├── middleware.ts               # Auth guard — protects /dashboard
├── .env.local.example
├── next.config.ts
├── tailwind.config.ts
└── package.json
```

**Framework: Next.js 14 (App Router).** Use Next.js — not Vite + Express. It gives API routes, SSR auth, and Vercel deployment for free in one package.

---

## Build Order

### Phase 1 — Project Scaffold
1. `npx create-next-app@latest clarity --typescript --tailwind --app`
2. Install deps: `@supabase/supabase-js @supabase/ssr @anthropic-ai/sdk zustand lucide-react`
3. Create `.env.local` from `.env.local.example`
4. Configure `next.config.ts` (see TECHNICAL_SPEC.md)

### Phase 2 — Auth (Supabase)
5. Create Supabase project at supabase.com
6. Enable Email auth + Google OAuth in Supabase dashboard
7. Implement `lib/supabase.ts` (browser client)
8. Implement `lib/supabase-server.ts` (server client using cookies)
9. Implement `middleware.ts` — redirect unauthenticated users away from `/dashboard`
10. Build `app/login/page.tsx` and `app/signup/page.tsx`
11. Build `app/page.tsx` — landing page with "Get Started" → `/signup`
12. **Verify:** User can sign up, log in, and be redirected to `/dashboard`. Unauthenticated users hitting `/dashboard` are redirected to `/login`.

### Phase 3 — Rate Limiting (Cost Protection)
13. Create Supabase table `usage` (schema in TECHNICAL_SPEC.md)
14. In `/api/chat/route.ts`: before calling Anthropic, check user's message count for today
15. If count ≥ 50 → return 429 with a calm error message
16. After successful response → increment count
17. **Verify:** After 50 messages, user sees a gentle "you've reached today's limit" message

### Phase 4 — AI Streaming Endpoint
18. Implement `api/chat/route.ts` (POST, auth-checked, rate-limited, streaming)
19. System prompt from `AI_PROMPTS.md` → `Core System Prompt`
20. Model: `claude-haiku-3-5` — fastest and cheapest for this use case
21. Max tokens: `600` — enough for companion responses, prevents runaway costs
22. **Verify:** Authenticated user can send a message and receive a streamed response

### Phase 5 — Session Store
23. Implement `store/sessionStore.ts` with Zustand + `persist` (localStorage)
24. Session data: messages, mood, sessionGoal, mode, isStreaming

### Phase 6 — Core Chat UI
25. Build `components/Chat/ChatWindow.tsx` — scrollable message list, `aria-live="polite"`
26. Build `components/Chat/MessageBubble.tsx` — user vs AI styles, markdown-light rendering
27. Build `components/Chat/InputBar.tsx` — auto-expand textarea, send + voice buttons
28. Build `components/Chat/VoiceButton.tsx` — Web Speech API, pulsing active state
29. Wire up `hooks/useChat.ts` — sends to `/api/chat`, streams into store
30. Build `app/dashboard/page.tsx` with full chat layout
31. **Verify:** Full streamed conversation works end-to-end in production

### Phase 7 — Mood Check-In
32. Build `MoodCheckIn.tsx` — shown when `messages.length === 0`
33. On mood select → generate opening message using `buildMoodGreeting(mood)`

### Phase 8 — Task Breakdown
34. Build `TaskBreakdown/TaskList.tsx` + `TaskItem.tsx`
35. Detect numbered list in AI response → render as interactive checklist
36. First item visually distinct (green accent row)

### Phase 9 — Grounding Exercise
37. Build `Modes/GroundingExercise.tsx` — step state machine
38. Box breathing: SVG circle timer, 4-count steps, 3 cycles
39. 5-4-3-2-1: wait for user text input before each next step

### Phase 10 — Focus Mode
40. Build `Modes/FocusMode.tsx` — full-viewport, goal display, ambient pulse
41. `prefers-reduced-motion` disables pulse

### Phase 11 — Thought Dump
42. Build `Modes/ThoughtDump.tsx` — large textarea, on submit calls `buildThoughtDumpPrompt`

### Phase 12 — Polish & Deploy
43. Mobile responsive layout
44. All `aria-label` on icon buttons
45. Graceful error states (API failure, rate limit, network)
46. `vercel deploy` — set env vars in Vercel dashboard

---

## Critical Rules

### Security
- **Never expose `ANTHROPIC_API_KEY` to the client.** It lives only in Vercel env vars, accessed only in `/api/chat/route.ts`
- **Every `/api/chat` request must verify the Supabase session** before calling Anthropic
- **Rate limit is mandatory** — without it, a single user can bankrupt the API budget

### Performance
- Use `claude-haiku-3-5` not Sonnet — 5x cheaper, fast enough for conversational use
- Cap `max_tokens` at `600` — companion responses don't need to be long
- Use streaming — never wait for full response
- Lazy-load Grounding and Focus Mode components (`dynamic(() => import(...))` in Next.js)

### UX
- No red color anywhere — use amber (`--warning`) instead
- No harsh white backgrounds — `--bg-base` is `#0F0F14`
- Never render `#` markdown headers in chat — strip or convert to plain text
- Never use `<form>` elements — use `onClick`/`onChange` handlers
- `prefers-reduced-motion` honored everywhere

---

## Environment Variables

```
# .env.local.example
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
ANTHROPIC_API_KEY=your_anthropic_key   # NEVER prefix with NEXT_PUBLIC_
```

---

## Definition of Done

The build is complete when:
1. Unauthenticated users cannot access the app or trigger any AI call
2. A user can sign up, log in, and land on the dashboard
3. Full streamed AI conversation works
4. Voice-to-text input works
5. Task breakdown renders as interactive checklist
6. Mood check-in generates a personalized opening
7. Focus Mode, Grounding Exercise, and Thought Dump all function
8. Rate limit kicks in at 50 messages/day with a gentle message
9. App is deployed on Vercel and publicly accessible
10. No API keys are exposed in client-side code or network responses
