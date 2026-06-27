# Technical Architecture & Implementation Spec

## Stack Summary

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Deployment | Vercel (free tier) |
| Auth + DB | Supabase (free tier) |
| AI | Anthropic Claude API — `claude-haiku-3-5` |
| Styling | Tailwind CSS |
| State | Zustand + persist middleware |
| Icons | Lucide React |
| Voice | Web Speech API (browser-native, no cost) |

---

## Environment Variables

### `.env.local.example`
```bash
# Supabase — safe to expose to browser (anon key only)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Anthropic — NEVER prefix with NEXT_PUBLIC_, server-side only
ANTHROPIC_API_KEY=your_anthropic_api_key
```

---

## `next.config.ts`
```typescript
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Reduce bundle size
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
}

export default nextConfig
```

---

## `package.json`
```json
{
  "name": "clarity",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "@anthropic-ai/sdk": "^0.27.0",
    "@supabase/ssr": "^0.5.0",
    "@supabase/supabase-js": "^2.45.0",
    "lucide-react": "^0.400.0",
    "next": "14.2.5",
    "react": "^18",
    "react-dom": "^18",
    "zustand": "^4.5.0"
  },
  "devDependencies": {
    "@types/node": "^20",
    "@types/react": "^18",
    "@types/react-dom": "^18",
    "autoprefixer": "^10.0.1",
    "postcss": "^8",
    "tailwindcss": "^3.4.1",
    "typescript": "^5"
  }
}
```

---

## Supabase Setup

### Database Tables

Run these in the Supabase SQL editor:

```sql
-- Rate limiting table
CREATE TABLE usage (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  message_count INTEGER NOT NULL DEFAULT 0,
  UNIQUE(user_id, date)
);

-- Enable Row Level Security
ALTER TABLE usage ENABLE ROW LEVEL SECURITY;

-- Users can only see and update their own usage
CREATE POLICY "Users can view own usage"
  ON usage FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own usage"
  ON usage FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own usage"
  ON usage FOR INSERT
  WITH CHECK (auth.uid() = user_id);
```

### Auth Setup (Supabase Dashboard)
1. Go to Authentication → Providers
2. Enable **Email** (with "Confirm email" ON for production)
3. Enable **Google** OAuth (requires Google Cloud Console credentials)
4. Set Site URL to your Vercel production URL
5. Add `http://localhost:3000` to Redirect URLs (for dev)

---

## `middleware.ts` (Auth Guard)

```typescript
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  // Protect /dashboard — redirect to /login if not authenticated
  if (!user && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Redirect authenticated users away from auth pages
  if (user && (
    request.nextUrl.pathname === '/login' ||
    request.nextUrl.pathname === '/signup'
  )) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/dashboard/:path*', '/login', '/signup'],
}
```

---

## `lib/supabase.ts` (Browser Client)

```typescript
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

---

## `lib/supabase-server.ts` (Server Client)

```typescript
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {}
        },
      },
    }
  )
}
```

---

## `/api/chat/route.ts` (Streaming AI Endpoint)

This is the most critical file. It must: verify auth, check rate limit, call Anthropic, stream response, increment usage.

```typescript
import { NextRequest } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@/lib/supabase-server'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
})

const DAILY_LIMIT = 50

export async function POST(request: NextRequest) {
  // 1. Verify auth
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  // 2. Check rate limit
  const today = new Date().toISOString().split('T')[0]

  const { data: usage } = await supabase
    .from('usage')
    .select('message_count')
    .eq('user_id', user.id)
    .eq('date', today)
    .single()

  const currentCount = usage?.message_count ?? 0

  if (currentCount >= DAILY_LIMIT) {
    return new Response(
      JSON.stringify({
        error: 'daily_limit',
        message: "You've reached your 50 messages for today. Come back tomorrow — your thoughts will still be here.",
      }),
      { status: 429, headers: { 'Content-Type': 'application/json' } }
    )
  }

  // 3. Parse request
  const { messages, systemPrompt } = await request.json()

  if (!messages || !Array.isArray(messages)) {
    return new Response(JSON.stringify({ error: 'Invalid request' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  // 4. Stream from Anthropic
  const encoder = new TextEncoder()

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const anthropicStream = await anthropic.messages.stream({
          model: 'claude-haiku-3-5',
          max_tokens: 600,
          system: systemPrompt,
          messages,
        })

        for await (const chunk of anthropicStream) {
          if (
            chunk.type === 'content_block_delta' &&
            chunk.delta.type === 'text_delta'
          ) {
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ text: chunk.delta.text })}\n\n`)
            )
          }
        }

        // 5. Increment usage after successful stream
        await supabase.from('usage').upsert(
          { user_id: user.id, date: today, message_count: currentCount + 1 },
          { onConflict: 'user_id,date' }
        )

        controller.enqueue(encoder.encode('data: [DONE]\n\n'))
        controller.close()
      } catch (err) {
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ error: 'Stream failed' })}\n\n`)
        )
        controller.close()
      }
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  })
}
```

---

## `store/sessionStore.ts`

```typescript
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type MoodTag = 'overwhelmed' | 'anxious' | 'scattered' | 'numb' | 'okay' | 'focused'
export type AppMode = 'chat' | 'focus' | 'grounding' | 'thoughtdump'

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

interface SessionState {
  messages: ChatMessage[]
  mood: MoodTag | null
  sessionGoal: string | null
  mode: AppMode
  isStreaming: boolean

  setMood: (mood: MoodTag) => void
  setGoal: (goal: string) => void
  setMode: (mode: AppMode) => void
  addMessage: (msg: ChatMessage) => void
  appendToLastAssistant: (text: string) => void
  setStreaming: (v: boolean) => void
  clearSession: () => void
}

export const useSessionStore = create<SessionState>()(
  persist(
    (set) => ({
      messages: [],
      mood: null,
      sessionGoal: null,
      mode: 'chat',
      isStreaming: false,

      setMood: (mood) => set({ mood }),
      setGoal: (goal) => set({ sessionGoal: goal }),
      setMode: (mode) => set({ mode }),
      setStreaming: (v) => set({ isStreaming: v }),

      addMessage: (msg) =>
        set((state) => ({ messages: [...state.messages, msg] })),

      appendToLastAssistant: (text) =>
        set((state) => {
          const msgs = [...state.messages]
          const last = msgs[msgs.length - 1]
          if (last?.role === 'assistant') {
            msgs[msgs.length - 1] = { ...last, content: last.content + text }
          } else {
            msgs.push({ role: 'assistant', content: text })
          }
          return { messages: msgs }
        }),

      clearSession: () =>
        set({ messages: [], mood: null, sessionGoal: null, mode: 'chat' }),
    }),
    {
      name: 'clarity-session',
      // Only persist messages and mood — not streaming state
      partialize: (state) => ({
        messages: state.messages,
        mood: state.mood,
        sessionGoal: state.sessionGoal,
        mode: state.mode,
      }),
    }
  )
)
```

---

## `lib/anthropic.ts` (Client-Side Fetch)

```typescript
import { ChatMessage } from '@/store/sessionStore'

export async function streamChat(
  messages: ChatMessage[],
  systemPrompt: string,
  onChunk: (text: string) => void,
  onDone: () => void,
  onError: (error: string) => void
) {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages, systemPrompt }),
  })

  // Handle rate limit or auth errors before streaming
  if (response.status === 429) {
    const data = await response.json()
    onError(data.message ?? "You've reached today's message limit.")
    return
  }

  if (!response.ok) {
    onError("Something went quiet. Try again in a moment.")
    return
  }

  const reader = response.body!.getReader()
  const decoder = new TextDecoder()

  while (true) {
    const { done, value } = await reader.read()
    if (done) break

    const chunk = decoder.decode(value)
    const lines = chunk.split('\n').filter((l) => l.startsWith('data:'))

    for (const line of lines) {
      const data = line.replace('data: ', '').trim()
      if (data === '[DONE]') {
        onDone()
        return
      }
      try {
        const parsed = JSON.parse(data)
        if (parsed.text) onChunk(parsed.text)
        if (parsed.error) onError(parsed.error)
      } catch {}
    }
  }
}
```

---

## `hooks/useChat.ts`

```typescript
import { useSessionStore } from '@/store/sessionStore'
import { streamChat } from '@/lib/anthropic'
import { SYSTEM_PROMPT } from '@/lib/prompts'

export function useChat() {
  const {
    messages,
    addMessage,
    appendToLastAssistant,
    setStreaming,
    addMessage: pushMessage,
  } = useSessionStore()

  async function sendMessage(content: string) {
    const userMsg = { role: 'user' as const, content }
    addMessage(userMsg)
    setStreaming(true)

    await streamChat(
      [...messages, userMsg],
      SYSTEM_PROMPT,
      (text) => appendToLastAssistant(text),
      () => setStreaming(false),
      (error) => {
        pushMessage({ role: 'assistant', content: error })
        setStreaming(false)
      }
    )
  }

  return { sendMessage }
}
```

---

## `hooks/useVoiceInput.ts`

```typescript
import { useState, useRef } from 'react'

export function useVoiceInput(onResult: (text: string) => void) {
  const [listening, setListening] = useState(false)
  const recognitionRef = useRef<SpeechRecognition | null>(null)

  function startListening() {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SR) return

    const recognition = new SR()
    recognition.continuous = false
    recognition.interimResults = false
    recognition.lang = 'en-US'
    recognition.onresult = (e) => onResult(e.results[0][0].transcript)
    recognition.onend = () => setListening(false)
    recognition.start()
    recognitionRef.current = recognition
    setListening(true)
  }

  function stopListening() {
    recognitionRef.current?.stop()
    setListening(false)
  }

  return { listening, startListening, stopListening }
}
```

---

## Auth Pages

### `app/login/page.tsx`
Implement with:
- Email + password form
- Google OAuth button (`supabase.auth.signInWithOAuth({ provider: 'google' })`)
- Link to `/signup`
- On success → router.push('/dashboard')

### `app/signup/page.tsx`
Implement with:
- Email + password form
- Google OAuth button
- Link to `/login`
- On success → show "Check your email" message (Supabase sends confirmation)

---

## Grounding Exercise State Machine

```
Type: 'box_breathing' | '5_4_3_2_1'

Box Breathing (3 cycles):
  Step 1: Inhale 4 counts — SVG circle fills over 4s → user taps Ready
  Step 2: Hold 4 counts — SVG circle stays full → user taps Ready
  Step 3: Exhale 4 counts — SVG circle empties over 4s → user taps Ready
  Step 4: Hold 4 counts — SVG circle stays empty → user taps Ready
  Repeat × 3, then → COMPLETE

5-4-3-2-1 Sensory:
  Step 1: "Name 5 things you can see." → user types → submit → next
  Step 2: "Name 4 things you can physically feel." → same
  Step 3: "Name 3 things you can hear." → same
  Step 4: "Name 2 things you can smell." → same
  Step 5: "Name 1 thing you can taste." → same → COMPLETE
  On COMPLETE: send full responses to AI for a soft landing reflection
```

---

## Focus Mode Behavior

- Full-screen takeover (`position: fixed`, `inset: 0`, `z-index: 50`)
- No sidebar, no header, no nav
- Session goal in large display serif at center
- Subtle ambient pulse (3s ease-in-out, `prefers-reduced-motion` disables)
- Every 15 min: AI sends a gentle check-in (client-side setInterval)
- "I'm done" exits and asks AI "How'd that go?" — one question

---

## Performance Notes

- Lazy load Focus, Grounding, and ThoughtDump with `dynamic(() => import(...), { ssr: false })`
- The chat window should use `useRef` to scroll to bottom on new messages, not re-render the whole list
- Keep `messages` array in store bounded — trim to last 20 messages before sending to API (cost + performance)
- Voice input is browser-native — zero bundle cost

### Trimming message history for API calls (in `useChat.ts`):
```typescript
// Send only last 20 messages to API to control token cost
const recentMessages = [...messages, userMsg].slice(-20)
```

---

## Accessibility

- All icon-only buttons: `aria-label`
- Chat stream container: `aria-live="polite"`
- Grounding timer: `aria-label="Breathing timer"` on SVG
- Mood tags: `role="radio"` + `aria-checked`
- Keyboard navigation: all interactive elements reachable via Tab
- Focus ring: visible on all focusable elements
- `prefers-reduced-motion`: disable all animations
- Minimum contrast: 4.5:1 for all text against backgrounds

---

## Vercel Deployment Checklist

1. Push to GitHub
2. Connect repo to Vercel
3. Add environment variables in Vercel dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `ANTHROPIC_API_KEY`
4. Update Supabase Auth → Site URL to production Vercel URL
5. Add production URL to Supabase Auth → Redirect URLs
6. Deploy
