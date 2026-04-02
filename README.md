# FocusMed MVP (B2C + B2B)

FocusMed is a revenue-first EdTech MVP for health students.  
This implementation includes:

- TypeScript/Next.js web product and public APIs
- Python/FastAPI adaptive study engine
- SQL schema for Supabase/Postgres analytics and subscriptions

## Implemented product surfaces

- Landing page with pricing and waitlist
- Onboarding flow with signup and trial start
- Student area for study sessions, dashboard, and recommendations
- Institutional page for B2B pilot positioning

## Implemented API interfaces

- `POST /api/auth/signup`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `POST /api/checkout/create-session`
- `POST /api/study/session`
- `GET /api/study/dashboard`
- `POST /api/webhooks/payments`
- `POST /api/cron/daily-plan`
- `GET /api/institutions/report`

## Local setup

1. Install dependencies:

```bash
npm install
```

2. Create `.env.local` from `.env.example` and fill Supabase credentials.

3. Apply SQL schema in Supabase SQL editor:

- `supabase/schema.sql`
- optional smoke checks: `supabase/smoke_test.sql`

4. Run Python AI service:

```bash
cd ai_service
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

5. Run Next.js app:

```bash
npm run dev
```

## Payment webhook idempotency

`/api/webhooks/payments` stores each event in `payment_events` with `event_id` unique constraint.  
Duplicate events are accepted and ignored safely.

## Suggested 90-day execution cadence

- Month 1: acquisition + activation instrumentation
- Month 2: improve trial-to-paid conversion and retention loops
- Month 3: institutional pilot with one active cohort
