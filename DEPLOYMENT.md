# Deployment Guide

This app is ready to deploy once Supabase and Anthropic credentials are added.

## 1. Supabase

Create a new Supabase project, then run:

`supabase/migrations/20260627_create_usage.sql`

In the Supabase dashboard:

- Enable `Email` auth
- Enable `Google` auth if you want OAuth
- Set the site URL to your Vercel production URL
- Add these redirect URLs:
  - `http://localhost:3000`
  - `https://your-vercel-domain.vercel.app`

Copy these values from `Project Settings -> API`:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## 2. Anthropic

Create an Anthropic API key and set:

- `ANTHROPIC_API_KEY`
- `ANTHROPIC_MODEL=claude-haiku-4-5-20251001`

The app also accepts another valid Anthropic model ID through `ANTHROPIC_MODEL` if you want to change it later.

## 3. Local Verification

Create `.env.local` from `.env.local.example`, fill in the real values, then run:

```bash
npm install
npm run lint
npm run build
npm run dev
```

Check:

- `/signup` creates an account
- `/login` signs in
- `/dashboard` redirects to `/login` when signed out
- chat streams responses
- the `usage` table increments once per successful AI response
- the 51st message in a day returns the gentle limit message

## 4. Vercel

Import `dmask3095/Clarity` into Vercel.

Framework preset:

- `Next.js`

Add environment variables in the Vercel project:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `ANTHROPIC_API_KEY`
- `ANTHROPIC_MODEL`

Then deploy.

## 5. Post-Deploy Supabase Auth

After Vercel gives you the production URL:

- update Supabase `Site URL`
- add the exact production URL to `Redirect URLs`
- if using Google OAuth, add the same redirect URI in Google Cloud Console

## 6. Smoke Test

After the first production deploy:

1. Open the landing page.
2. Create a fresh account.
3. Confirm the email flow or OAuth callback.
4. Send a chat message.
5. Open Supabase and confirm a `usage` row exists for that user and date.
6. Sign out and confirm `/dashboard` is protected.
