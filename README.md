# MatchEdge FC — matchedgefc.com

Production-ready marketing + picks site: **Next.js 14 (App Router)**, **Tailwind CSS**, **Supabase**, **Stripe**, deployable on **Vercel**.

## What’s in this folder

| Path | Purpose |
|------|---------|
| `app/` | Pages and API routes (`layout.tsx`, `page.tsx`, `api/checkout`) |
| `components/` | UI sections (Hero, Picks, Pricing, Footer, …) |
| `lib/` | Supabase client + data loaders (`getPicks`, `getSportRecords`) |
| `supabase/schema.sql` | Tables + RLS for public read |
| `.env.example` | Environment variables to copy |

## 1. Install Node.js

Install **Node 20 LTS** from [nodejs.org](https://nodejs.org/) (or use `nvm`). Verify:

```bash
node -v
npm -v
```

## 2. Install dependencies

```bash
cd matchedgefc
npm install
```

## 3. Environment variables

Copy `.env.example` to `.env.local` (never commit secrets):

```bash
cp .env.example .env.local
```

Fill in:

- **`NEXT_PUBLIC_SITE_URL`** — Your production URL, e.g. `https://matchedgefc.com` (use `http://localhost:3000` locally).
- **Supabase** — Create a project at [supabase.com](https://supabase.com). In **Project Settings → API**, copy **URL** and **anon public** key.
- **Stripe** — [Dashboard](https://dashboard.stripe.com): create a **Product** “Edge” with a **$15/month** recurring **Price**. Copy **Price ID** (`price_...`). Add **Secret key** to `STRIPE_SECRET_KEY`. Optional: `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` for future client-side Stripe.js.

## 4. Supabase database

1. Open Supabase **SQL Editor**.
2. Paste and run `supabase/schema.sql`.
3. In **Table Editor**, add rows to **`picks`** and **`sport_records`** (or use SQL `insert`).

Column names must match `lib/types.ts`. **Picks** load only from `picks` (empty slate shows “No picks today — check back on matchday”). **W–L** loads only from `sport_records`; if the table is empty or Supabase isn’t configured, the UI shows **0W–0L** per sport.

## 5. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## 6. Deploy to Vercel

1. Push this repo to GitHub/GitLab/Bitbucket.
2. Import the project in [vercel.com](https://vercel.com).
3. Set **Root Directory** to `matchedgefc` if the repo contains other folders.
4. Add the same env vars as **.env.local** in Vercel **Settings → Environment Variables**.
5. Add your domain **matchedgefc.com** under **Domains** and point DNS per Vercel’s instructions.

## 7. Stripe webhooks (optional, for membership features)

For **unlocking picks after payment** or syncing subscription status, add a **Stripe webhook** endpoint later (e.g. `/api/webhooks/stripe`) and store customer/subscription IDs in Supabase. The current checkout flow only redirects after payment; Edge-only content gating is a follow-up.

## 8. Disclaimer text

Edit the disclaimer copy in `components/Footer.tsx` (constant `disclaimer`).

## Design tokens

- **Navy:** `#080D1A` (see `tailwind.config.ts` `navy.*`)
- **Electric green:** `#00C853` (`edge` in Tailwind)
- **Fonts:** Rajdhani (headings), Inter (body) via `next/font` in `app/layout.tsx`
- **Theme:** `next-themes` with `defaultTheme="system"` (follows device light/dark)

## Scripts

```bash
npm run dev    # development
npm run build  # production build
npm run start  # run production build locally
npm run lint   # ESLint
```

## Support

If `npm install` fails, ensure Node 20+ and delete `node_modules` + `package-lock.json` then run `npm install` again.
