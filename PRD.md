# Clarity — Product Requirements Document

## Overview

**Clarity** is an AI-powered emotional grounding and focus companion for people managing ADHD, anxiety, executive dysfunction, and emotional overwhelm. It is a calm, non-judgmental presence — not a productivity tracker.

**Deployment:** Public web app on Vercel. Free tier throughout. Auth-gated.

---

## Target Users

- Adults with ADHD or executive dysfunction
- People managing anxiety, racing thoughts, or emotional dysregulation
- Anyone experiencing task paralysis, doomscrolling loops, or hyperfixation
- Users wanting a private, low-friction thinking partner

---

## Core Pillars

### 1. ADHD & Focus Support
- Break tasks into the smallest possible next action
- Act as a digital body double (gentle presence prompting forward motion)
- Filter hyperfixation loops and redirect attention
- Hold context across a session when the user loses track of their goal

### 2. Emotional Regulation
- Guide somatic grounding, box breathing, and sensory check-ins
- Externalize and untangle racing thoughts
- Meet any emotional baseline (anger, grief, numbness) without toxic positivity
- Safe vulnerability space — no social pressure, no fear of being a burden

### 3. Executive Function Scaffolding
- Turn vague goals into ordered checklists with a clear first action
- Sort tasks by urgency, effort, or deadline
- Help draft emails and messages when starting is hard
- Capture messy thoughts, summarize, convert to action items

### 4. Adaptive Tone
- Detect and mirror the user's emotional register in real time
- Shift from warm/gentle to structured/directive based on signals
- Never lecture, moralize, or apply toxic positivity

---

## Feature List

### MVP (V1 — Launch)

| Feature | Description |
|---|---|
| Email / OAuth Auth | Supabase auth — email+password and Google OAuth |
| AI Chat Interface | Streaming conversational UI |
| Voice-to-Text Input | Hands-free via Web Speech API |
| Task Breakdown | Goal → ordered checklist, first step highlighted |
| Focus Mode | Minimal full-screen UI with ambient body double presence |
| Grounding Exercise | Box breathing + 5-4-3-2-1 sensory, step-by-step guided |
| Mood Check-In | Optional mood tag at session start, colors AI tone |
| Thought Dump | Free-form dump → AI reflects themes + cognitive distortions |
| Session Memory | Context retained within a session (not cross-session in V1) |
| Rate Limiting | 50 messages/day per user — cost protection, no card required |

### V2 (Post-Launch)

| Feature | Description |
|---|---|
| Persistent Memory | Cross-session goal and context via Supabase |
| Usage Dashboard | User sees their daily message count + reset time |
| Calendar Integration | Auto-schedule focus blocks |
| Writing Assist | AI drafts emails/messages |
| Streak (optional, shame-free) | Progress indicator, non-punitive |

---

## UX Principles

1. **Low friction above all.** Every interaction is one step, not three.
2. **Never punish.** No shame for incompletion, missed days, or low usage.
3. **Calm aesthetic.** Dark, muted palette. No harsh whites or aggressive colors.
4. **Adaptive density.** Emptier when user is overwhelmed. Structured when planning.
5. **Voice-first optional.** All inputs support voice. All outputs readable aloud.

---

## Free Tier Budget Reality

| Service | Free Tier Limit | Expected Usage |
|---|---|---|
| Vercel | 100GB bandwidth/mo, unlimited deploys | Well within limits for early users |
| Supabase | 500MB DB, 50k MAU, 2GB bandwidth | Sufficient for hundreds of users |
| Anthropic | Pay-as-you-go (no free tier) | ~$0.001/message with Haiku; 50msg/day/user cap keeps costs low |

**Cost at 100 daily active users:** ~$5/month (100 users × 50 msgs × $0.001)

---

## Success Metrics (V1)

- User completes at least one task breakdown per session
- Grounding exercise completion rate > 60%
- Average session length > 4 minutes
- Voice input used in > 30% of sessions
- Day-7 retention > 25%
- Zero unauthorized API calls (all gated behind auth + rate limit)
