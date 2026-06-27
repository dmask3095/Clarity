# Clarity

Clarity is a calm AI companion for emotional grounding, focus, ADHD friction, and executive dysfunction support. It is built with Next.js 14, Supabase auth, and an authenticated streaming Anthropic chat route.

## Stack

- Next.js 14 App Router
- Tailwind CSS
- Supabase auth + Postgres
- Anthropic Messages API
- Zustand session state
- Browser-native Web Speech API for voice input

## Local Setup

1. Install dependencies:

```bash
npm install
```

2. Create `.env.local` from `.env.local.example`.

3. Fill in:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
ANTHROPIC_API_KEY=
ANTHROPIC_MODEL=claude-haiku-4-5-20251001
```

4. Run the app:

```bash
npm run dev
```

5. Validate before deploy:

```bash
npm run lint
npm run build
```

For a full production checklist, see `DEPLOYMENT.md`.

## Supabase Setup

Create the `usage` table for daily rate limiting, or run:

`supabase/migrations/20260627_create_usage.sql`

The SQL is:

```sql
CREATE TABLE usage (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  message_count INTEGER NOT NULL DEFAULT 0,
  UNIQUE(user_id, date)
);

ALTER TABLE usage ENABLE ROW LEVEL SECURITY;

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

Enable:

- Email auth
- Google OAuth
- `http://localhost:3000` as a redirect URL
- Your production Vercel URL as the site URL and redirect URL

## Core Features

- Auth-gated dashboard
- Streaming AI chat endpoint at `/api/chat`
- Daily 50-message rate limit
- Mood check-in
- Task breakdown with interactive checklist rendering
- Focus mode
- Grounding exercises
- Thought dump flow
- Voice-to-text input

## Git

The local workspace is initialized and connected to:

`https://github.com/dmask3095/Clarity.git`
