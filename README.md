# LayerForge

**Code-first AI/ML engineering platform.** Implement transformer layers, attention mechanisms, GPU kernels, and tokenizers from scratch — in-browser — and get opt-in AI hints only when you ask for them.

---

## What it is

LayerForge drops users into a code editor immediately. Each challenge provides a function stub, an embedded test harness, and a visualisation of the concept. Users run their code against the tests in a sandboxed executor. If they get stuck they can request a single Socratic hint from a Gemini-powered mentor — but it never gives the full answer.

Subscription is $29/month or $249/year with a 7-day free trial (card required).

---

## Repository layout

```
layerforge/
├── apps/
│   ├── home/        # Marketing landing page       (React + Vite, port 5174)
│   ├── preview/     # Waitlist signup page          (React + Vite, port 5175)
│   ├── study/       # Core challenge platform       (React + Vite + Monaco, port 5173)
│   └── admin/       # Internal ops dashboard        (React + Vite, port 5176)
├── services/
│   ├── sandbox/     # Code execution REST service   (Node.js + Express, port 3001)
│   └── functions/   # Firebase Cloud Functions      (Node.js, TypeScript)
├── firebase.json
├── firestore.rules
└── firestore.indexes.json
```

### apps/study — the main product

| Path | Purpose |
|---|---|
| `src/App.tsx` | React Router v6 — auth guard → subscription guard → routes |
| `src/data/challenges.ts` | All 13 challenge definitions (starter code + test harness + hint) |
| `src/pages/BillingPage.tsx` | Plan selection, Stripe Checkout redirect, active sub management |
| `src/pages/ProfilePage.tsx` | Stats, activity heatmap, subscription info, Stripe Portal link |
| `src/hooks/useSubscription.ts` | Firestore live-listener on `users/{uid}.subscription` |
| `src/components/RequireSubscriptionLayout.tsx` | Gates routes behind active/trialing subscription |
| `src/lib/firebase.ts` | Firebase SDK init (Auth, Firestore, Functions, App Check) |
| `src/services/sandbox.ts` | POSTs code to `/api/sandbox/run` (Vite-proxied to sandbox service) |

### services/functions — Cloud Functions

| Export | Type | Purpose |
|---|---|---|
| `runCode` | callable (gen1) | Forwards code execution to Cloud Run sandbox with identity token |
| `createCheckoutSession` | callable (gen2) | Creates Stripe Checkout session; blocks duplicate subscriptions |
| `stripeWebhook` | HTTP (gen2) | Verifies Stripe signature; syncs subscription → Firestore |
| `createPortalSession` | callable (gen2) | Opens Stripe Customer Portal for billing management |

### services/sandbox — code executor

Express app that writes code to a temp directory under `/tmp/lf-<uuid>/`, runs it with `child_process.execFile` (no shell), and cleans up. 10-second timeout. Supports Python 3 and Rust. In production it runs on Cloud Run with `--no-allow-unauthenticated` — only the Cloud Functions service account can invoke it.

---

## Challenges

| # | Title | Language |
|---|---|---|
| 1 | Linear Layer Forward Pass | Python |
| 2 | ReLU Activation | Python |
| 3 | Scaled Dot-Product Attention | Python |
| 4 | Layer Normalization | Python |
| 5 | Multi-Head Attention | Python |
| 6 | Rotary Position Embedding (RoPE) | Python |
| 7 | Proportional RoPE (p-RoPE) | Python |
| 8 | Vector Addition Kernel (Triton) | Python |
| 9 | Sinusoidal Positional Encoding | Python |
| 10 | Grouped-Query Attention (GQA) | Python |
| 11 | SwiGLU Feed-Forward Network | Python |
| 12 | 2D Convolution (Conv2d) | Python |
| 13 | BPE Tokenizer with Training | Python |

---

## Prerequisites

- **Node.js** ≥ 20
- **pnpm** ≥ 9 (`npm i -g pnpm`)
- **Python** ≥ 3.9 (sandbox)
- **Rust** toolchain via `rustup` (sandbox Rust challenges)
- **Firebase CLI** — installed as a workspace dev dependency (`pnpm exec firebase`)

---

## Getting started

```bash
# 1. Install all workspace dependencies
pnpm install

# 2. Copy the study app env file and fill in values (see Environment variables below)
cp apps/study/.env.example apps/study/.env.local

# 3. Run everything in parallel (all apps + sandbox)
pnpm dev
```

Individual workspaces:

```bash
pnpm --filter @layerforge/study    dev   # http://localhost:5173
pnpm --filter @layerforge/home     dev   # http://localhost:5174
pnpm --filter @layerforge/preview  dev   # http://localhost:5175
pnpm --filter @layerforge/admin    dev   # http://localhost:5176
pnpm --filter @layerforge/sandbox  dev   # http://localhost:3001
```

Type-check all packages:

```bash
pnpm typecheck
```

---

## Environment variables

### apps/study

Create `apps/study/.env.local` (gitignored):

```env
# Firebase
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_FIREBASE_MEASUREMENT_ID=

# Stripe price IDs (not secret — safe to commit for test env)
VITE_STRIPE_PRICE_MONTHLY=
VITE_STRIPE_PRICE_ANNUAL=
```

See `apps/study/.env.example` for all keys. Production values live in `apps/study/.env.production` (gitignored).

### services/functions

Secrets are stored in **Firebase Secret Manager** — never in source code or GitHub:

```bash
# Set or rotate a secret
firebase functions:secrets:set STRIPE_SECRET_KEY     --project layerforge-platform
firebase functions:secrets:set STRIPE_WEBHOOK_SECRET  --project layerforge-platform

# After rotating, redeploy functions so they pick up the new version
firebase deploy --only functions --project layerforge-platform
```

---

## Firestore data model

```
users/{uid}
  stripeCustomerId   string
  subscription
    id               string    — Stripe subscription ID
    status           string    — trialing | active | past_due | canceled | …
    priceId          string    — which price the user is on
    currentPeriodEnd Timestamp
    cancelAtPeriodEnd boolean
    trialEnd         Timestamp | null

stripeCustomers/{stripeCustomerId}
  uid                string    — reverse map used by webhook to resolve Firebase UID

waitlist/{id}
  name               string
  email              string
  submittedAt        string    — ISO 8601
```

**Security rules summary:**

- `waitlist` — public create (field-validated), authenticated read/update/delete
- `users/{uid}` — owner read-only; writes are Admin SDK only (Cloud Functions)
- `stripeCustomers` — deny-all for clients; Admin SDK only

---

## Stripe integration

### Subscription flow

1. User signs in → `RequireSubscriptionLayout` checks Firestore
2. No active subscription → redirect to `/billing`
3. User picks Monthly ($29) or Annual ($249) → calls `createCheckoutSession` CF
4. CF checks for existing live subscription (blocks duplicates), then creates Stripe Checkout with 7-day trial + required card
5. Stripe redirects to `/billing/success`
6. Stripe fires webhook → `stripeWebhook` CF verifies HMAC signature, writes to `users/{uid}.subscription`
7. Firestore listener in `useSubscription` updates in real time; `RequireSubscriptionLayout` grants access

### Live Stripe resources

| Resource | ID |
|---|---|
| Product | `prod_UbpUQ3Zg6npH59` |
| Monthly price | `price_1TcbpLJiNqYDPd3otD1Hd4QT` |
| Annual price | `price_1TcbpMJiNqYDPd3oWQQKFoG4` |
| Webhook endpoint | `we_1TcbpRJiNqYDPd3oJMCYHZRT` |

Webhook events: `checkout.session.completed`, `customer.subscription.created/updated/deleted`, `invoice.payment_succeeded/failed`.

### Adding a new price tier

```bash
stripe prices create \
  --product prod_UbpUQ3Zg6npH59 \
  --unit-amount <cents> \
  --currency usd \
  --recurring.interval month \
  --api-key sk_live_...
```

Then add the new price ID to `ALLOWED_PRICES` in `services/functions/src/stripe/client.ts` and redeploy functions.

---

## Deployment

Everything deploys automatically on push to `main` via two GitHub Actions workflows.

### `deploy.yml` — Firebase hosting + functions + Firestore rules

```
build job
  ├── pnpm install
  ├── build all four apps (injects VITE_* env vars from GitHub secrets)
  ├── build functions
  └── upload dist artifacts

deploy-hosting job  (runs in parallel with deploy-functions)
  ├── admin   → https://layerforge-admin.web.app
  ├── home    → https://layerforge-platform.web.app
  ├── preview → https://layerforge-preview.web.app
  └── study   → https://layerforge-study.web.app

deploy-functions job  (runs in parallel with deploy-hosting)
  ├── firebase deploy --only firestore   (rules + indexes)
  └── firebase deploy --only functions
```

### `deploy-sandbox.yml` — Cloud Run sandbox

Triggers only when `services/sandbox/**` changes. Builds a Docker image, pushes to Artifact Registry, and deploys to Cloud Run (`--no-allow-unauthenticated`, 2 Gi RAM, concurrency 1).

### Required GitHub secrets

| Secret | Used by |
|---|---|
| `FIREBASE_SERVICE_ACCOUNT_LAYERFORGE_PLATFORM` | All Firebase/GCP deploy steps |
| `VITE_FIREBASE_API_KEY` | study app build |
| `VITE_FIREBASE_AUTH_DOMAIN` | study app build |
| `VITE_FIREBASE_PROJECT_ID` | study app build |
| `VITE_FIREBASE_STORAGE_BUCKET` | study app build |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | study app build |
| `VITE_FIREBASE_APP_ID` | study app build |
| `VITE_FIREBASE_MEASUREMENT_ID` | study app build |
| `VITE_STRIPE_PRICE_MONTHLY` | study app build |
| `VITE_STRIPE_PRICE_ANNUAL` | study app build |

`STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET` are Firebase Secret Manager secrets — they are **not** GitHub secrets and are never exposed to CI.

---

## Firebase App Check

All four apps use reCAPTCHA v3 App Check (site key `6LfV6gItAAAAAJJ6yjVIJYyo1aQ4Wa8foQqWSVNQ`). In development each app sets `FIREBASE_APPCHECK_DEBUG_TOKEN = true`, which prints a debug token to the browser console on first run. Register that token once in **Firebase Console → App Check → Apps → Manage debug tokens**.

---

## Admin dashboard

`apps/admin` is deployed to `https://layerforge-admin.web.app` and gated by Google Sign-In with an email allowlist. The default allowed email is `jacksonzhou666@gmail.com`; override at build time with:

```bash
VITE_ADMIN_EMAILS=a@example.com,b@example.com pnpm --filter @layerforge/admin build
```

Features:
- **Overview** — total / last-7-day / last-30-day waitlist signup counts, 30-day bar chart
- **Waitlist tab** — live Firestore table with search, copy-all-emails, and CSV export

---

## Adding a challenge

Run the challenge creation skill from the repo root:

```
/new-challenge <topic>
```

This scaffolds a new entry in `apps/study/src/data/challenges.ts` with starter code, embedded test harness, static Socratic hint, and visualisation stub.

---

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite 5, Tailwind CSS 3, React Router v6 |
| Editor | Monaco Editor (`@monaco-editor/react`) |
| Cloud Functions | Firebase Functions v6, Node.js 22 (gen1 + gen2) |
| Database | Cloud Firestore |
| Auth | Firebase Auth — Google Sign-In |
| Payments | Stripe (Checkout, Customer Portal, Webhooks) |
| Code execution | `child_process.execFile`, Cloud Run (Docker) |
| Hosting | Firebase Hosting — 4 sites |
| CI/CD | GitHub Actions |
| Monorepo tooling | pnpm workspaces |
