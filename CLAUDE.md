# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**LayerForge** is a code-first AI/ML learning platform where users implement ML concepts from scratch (transformers, attention, GPU kernels, tokenizers) in-browser and receive opt-in Socratic AI hints only when they ask. Users subscribe monthly ($29) or annually ($249) with a 7-day free trial.

## Repository Structure

```
layerforge/
├── apps/
│   ├── home/      # Marketing landing page — React + Vite + Tailwind (port 5174)
│   ├── preview/   # Waitlist signup — React + Vite + Tailwind (port 5175)
│   ├── study/     # Core challenge platform — React + Vite + Monaco Editor (port 5173)
│   └── admin/     # Internal ops dashboard — React + Vite + Tailwind (port 5176)
├── services/
│   ├── sandbox/   # Code execution REST service — Node.js + Express (port 3001)
│   └── functions/ # Firebase Cloud Functions — Node.js + TypeScript
└── scripts/
    └── dev.sh     # Full local dev environment (emulators + all apps)
```

## Dev Commands

```bash
# Recommended: full local environment with Firebase emulators
./scripts/dev.sh

# Or run manually
pnpm install
pnpm dev                                    # all apps + sandbox in parallel

pnpm --filter @layerforge/study    dev      # port 5173
pnpm --filter @layerforge/home     dev      # port 5174
pnpm --filter @layerforge/preview  dev      # port 5175
pnpm --filter @layerforge/admin    dev      # port 5176
pnpm --filter @layerforge/sandbox  dev      # port 3001

pnpm typecheck
pnpm build
```

**Prerequisites:** Node 20+, pnpm 9+, Python 3+, Java 11+ (Firebase emulators), Rust toolchain (Rust challenges).

## Architecture

### apps/study — the main product

- **Routing:** `src/App.tsx` — auth guard (`RequireAuthLayout`) → subscription guard (`RequireSubscriptionLayout`) → routes.
- **Challenge data:** `src/data/challenges.ts` — 13 Python challenges. Each includes starter code, embedded test harness, static hint, and visualisation.
- **Sandbox client:** `src/services/sandbox.ts` — POSTs to `/api/sandbox/run` (Vite-proxied to `localhost:3001`).
- **Progress state:** `src/hooks/useProgress.ts` — localStorage.
- **Subscription state:** `src/hooks/useSubscription.ts` — Firestore `onSnapshot` on `users/{uid}.subscription`.
- **Billing:** `src/pages/BillingPage.tsx` — calls `createCheckoutSession` CF, redirects to Stripe Checkout; `src/pages/BillingSuccessPage.tsx` — calls `syncCheckoutSession` CF to write subscription to Firestore, waits for `useSubscription` to confirm before showing "Start building".
- **Profile:** `src/pages/ProfilePage.tsx` — stats, activity heatmap, subscription status, Stripe Customer Portal link.

### services/functions — Cloud Functions

| Export | Type | Purpose |
|---|---|---|
| `runCode` | callable (gen1) | Forwards code to Cloud Run sandbox with identity token |
| `createCheckoutSession` | callable (gen2) | Creates Stripe Checkout session; blocks duplicate subscriptions |
| `syncCheckoutSession` | callable (gen2) | Retrieves Stripe session + subscription, writes to Firestore; called from success page |
| `stripeWebhook` | HTTP (gen2) | Verifies Stripe signature, syncs subscription events to Firestore |
| `createPortalSession` | callable (gen2) | Opens Stripe Customer Portal |

Stripe secret keys live in **Firebase Secret Manager** — never in source or GitHub:
```bash
firebase functions:secrets:set STRIPE_SECRET_KEY     --project layerforge-platform
firebase functions:secrets:set STRIPE_WEBHOOK_SECRET  --project layerforge-platform
# After rotating secrets, redeploy functions to pick up the new version:
firebase deploy --only functions --project layerforge-platform
```

### services/sandbox

- Writes code to `/tmp/lf-<uuid>/`, runs with `child_process.execFile` (no shell), 10 s timeout, then cleans up.
- Production: Cloud Run with `--no-allow-unauthenticated`; only the Cloud Functions service account can invoke it.

### apps/admin

- Deployed to `layerforge-admin.web.app`, gated by Google Sign-In email allowlist.
- Default allowed email: `jacksonzhou666@gmail.com`. Override at build time with `VITE_ADMIN_EMAILS=a@b.com`.
- Reads Firestore `waitlist` collection live; provides search, copy-all-emails, CSV export.

## Key Product Constraints

- **AI is opt-in only.** The "Get Hint" button must never be triggered automatically.
- **Stripe secret key is server-side only.** It lives in Firebase Secret Manager and is never in frontend code or GitHub secrets.
- **Sandbox is not internet-accessible in production.** Cloud Run deploys with `--no-allow-unauthenticated`.
- **Subscription enforcement is server-side.** `RequireSubscriptionLayout` reads Firestore; `createCheckoutSession` blocks duplicates by checking `stripe.subscriptions.list` before creating a session.
- **Skill synchronization.** The `new-challenge` skill exists in two locations: `~/.gemini/config/skills/new-challenge/SKILL.md` (Antigravity/Gemini) and `.claude/commands/new-challenge.md` (Claude Code). Keep both in sync when updating.

## Stripe

### Price IDs

| Mode | Monthly | Annual |
|---|---|---|
| **Live** | `price_1TcbpLJiNqYDPd3otD1Hd4QT` | `price_1TcbpMJiNqYDPd3oWQQKFoG4` |
| **Test** | `price_1TcXxWR26VFYYHsPPJ0BGphb` | `price_1TcXxXR26VFYYHsPwcMhQKkJ` |

Live price IDs are in `apps/study/.env.production` (gitignored) and in GitHub secrets (`VITE_STRIPE_PRICE_MONTHLY`, `VITE_STRIPE_PRICE_ANNUAL`). Test IDs are in `apps/study/.env.local` (gitignored).

When adding a new price, also add its ID to `ALLOWED_PRICES` in `services/functions/src/stripe/client.ts`.

### Promo codes / discount codes

Stripe handles all coupon logic. To create a promo code:

```bash
# 1. Create a coupon
stripe coupons create \
  --percent-off 20 \
  --duration forever \
  --api-key sk_live_...          # or sk_test_... for sandbox

# 2. Wrap it in a human-readable promo code
stripe promotion_codes create \
  --coupon cou_xxx \
  --code LAUNCH20 \
  --api-key sk_live_...
```

Or use the Stripe Dashboard → **Billing → Coupons → Create coupon → Add promotion code**.

The Checkout page already shows a promo code input (`allow_promotion_codes: true` is set in `createCheckoutSession`). No code changes needed to add new codes — create them in Stripe and share the code string.

### Webhook

Registered endpoint: `https://us-central1-layerforge-platform.cloudfunctions.net/stripeWebhook`
Webhook ID: `we_1TcbpRJiNqYDPd3oJMCYHZRT` (live), `we_1TcY6HR26VFYYHsPlMw1CAb1` (test)

Events subscribed: `checkout.session.completed`, `customer.subscription.created/updated/deleted`, `invoice.payment_succeeded/failed`.

## Local Dev Environment

`./scripts/dev.sh` starts:
- Firebase Auth emulator (`:9099`)
- Firebase Firestore emulator (`:8080`)
- Firebase Functions emulator (`:5001`) — uses test Stripe keys from `services/functions/.env.local`
- All Vite dev servers + sandbox

**Required local files (gitignored):**

`services/functions/.env.local`:
```
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

`apps/study/.env.local`:
```
VITE_STRIPE_PRICE_MONTHLY=price_1TcXxWR26VFYYHsPPJ0BGphb
VITE_STRIPE_PRICE_ANNUAL=price_1TcXxXR26VFYYHsPwcMhQKkJ
```

See `services/functions/.env.example` and `apps/study/.env.example` for templates.

## Firestore Data Model

```
users/{uid}
  stripeCustomerId   string
  subscription
    id               string    — Stripe subscription ID
    status           string    — trialing | active | past_due | canceled | …
    priceId          string
    currentPeriodEnd Timestamp
    cancelAtPeriodEnd boolean
    trialEnd         Timestamp | null

stripeCustomers/{stripeCustomerId}
  uid                string    — reverse map for webhook UID resolution

waitlist/{id}
  name / email / submittedAt
```

Security rules: `users/{uid}` — owner read-only, Admin SDK writes only. `stripeCustomers` — Admin SDK only. `waitlist` — public create (field-validated), authenticated read.

## Sandbox API

```
GET  /health
POST /run  { code: string, language: "python" | "rust" }
        → { success: boolean, output: string, errors: string, executionTimeMs: number }
```

## Challenge Structure

Each `Challenge` in `src/data/challenges.ts` has:
- `starterCode` — complete file with function stub + embedded test harness.
- `staticHint` — Socratic hint shown on "Get Hint".
- `description` — rendered as `whitespace-pre-wrap`.

Test harnesses use `assert` (AssertionError → non-zero exit → `success: false`) and print `"All tests passed!"` on success.

To add a challenge: `/new-challenge <topic>`
