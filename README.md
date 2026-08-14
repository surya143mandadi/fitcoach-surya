# FitCoach Surya

A mobile-first **PWA** for a 12-week fat-loss + muscle-gain program (starts **6 Sep 2026**).
Runs immediately on **local demo data** — no backend or login required.

## Stack
React 18 + TypeScript + Vite + Tailwind + Zustand, `vite-plugin-pwa` (installable on iPhone).

## Run it

```bash
bun install
bun run dev      # dev server with hot reload, LAN-accessible (--host)
# or a production build:
bun run build && bun run preview
```

Vite prints a **Network** URL like `http://192.168.x.x:5173/`.

### Install on iPhone (Add to Home Screen)
1. Make sure your iPhone is on the **same Wi-Fi** as this computer.
2. Open the **Network URL** in **Safari** (must be Safari for PWA install).
3. Tap the **Share** icon → **Add to Home Screen** → **Add**.
4. Launch "FitCoach" from your home screen — it opens full-screen, no browser chrome.

> Full offline caching (service worker) needs a secure context (HTTPS or localhost).
> Over a plain LAN IP the app still installs and runs; for offline support, serve over
> HTTPS (e.g. a tunnel like `cloudflared`/`ngrok`, or deploy to Vercel/Netlify).

## What's inside
- **Today** — today's/next workout, week schedule, quick stats, nutrition snapshot.
- **Workout** — Thu Upper / Fri Lower+Core / Sat Full Body. Per exercise: demo video area,
  step-by-step technique, setup & posture, breathing, muscles worked, common mistakes,
  safety tips, easier alternative, sets/reps/rest, weight+reps logging, previous history,
  rest timer, progressive-overload recommendation, and live completion %.
- **Progress** — transformation dashboard: weight vs target, waist, weekly avg, progress
  photos, strength progress, workouts completed, avg steps, water, protein, calories.
- **Nutrition** — Indian non-veg meal suggestions with calorie/protein tracking, water
  logging, and a weekly check-in.
- **Coach** — AI coach (works offline via rule engine). Handles technique, easier
  alternatives, weight selection, progression from your logged reps, and missing equipment.
  **Never diagnoses injuries** — on pain reports it tells you to stop and see a professional.
- **Plan** — 12-week phase overview, profile, targets, and demo-data reset.

## Auth-ready backend
- `db/schema.sql` — Postgres schema mirroring `src/types.ts` (RLS stubs included).
- The Zustand store isolates persistence; swap localStorage for an API/Supabase client.
- AI Coach: set `VITE_COACH_API_URL` to route to a real LLM endpoint (see `src/lib/coach.ts`);
  the injury guardrail is enforced client-side before any call.

Baseline body scan (Apr 2026): 75.5 kg · 30.3 kg skeletal muscle · 54.9 kg lean · 27.3% BF · 93.7 cm waist.
