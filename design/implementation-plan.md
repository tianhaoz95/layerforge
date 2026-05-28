# LayerForge — Implementation Plan

**Version:** 1.0  
**Status:** Active — Phase 1 in progress  
**PRD:** `layer-forge-prd.md`

---

## Monorepo Layout

```
layerforge/
├── apps/
│   ├── home/        # Marketing landing page (React + Vite)
│   ├── preview/     # Waitlist signup (React + Vite)
│   └── study/       # Core challenge platform (React + Vite + Monaco)
├── services/
│   └── sandbox/     # Code execution REST service (Node + Express)
├── design/          # Architecture and planning docs
├── pnpm-workspace.yaml
└── package.json     # Workspace root — dev/build/lint scripts
```

---

## Technology Choices

### Frontend (all three apps): React 18 + Vite + TypeScript + Tailwind CSS

- **React 18**: `@monaco-editor/react` is the most mature Monaco wrapper; concurrent features enable progressive loading of the heavy editor bundle without blocking the problem description pane.
- **Vite**: Sub-500 ms cold-start vs 10–30 s for Webpack; native ESM in dev; Rollup production builds are smaller and tree-shaken.
- **Tailwind CSS v3**: Zero-runtime cost, dark-theme friendly, purge-by-default. Avoids the version-constraint overhead of a full component library.
- **React Router v6** (study app only): client-side routing for dashboard → challenge navigation.

### Sandbox: Node.js + Express + TypeScript

- Aligns with Firebase Cloud Functions (Node.js 20 runtime) — the execution logic can be lifted nearly verbatim into a callable Cloud Function in Phase 2.
- `child_process.execFile` (not `exec`) spawns Python/Rust processes without a shell, reducing attack surface.
- REST over tRPC/GraphQL: the API has two endpoints; a typed fetch wrapper in the study app is sufficient.

### Why Firebase is deferred to Phase 2

1. Phase 1 development requires only `pnpm dev` — zero external service dependencies, zero billing.
2. Auth-gated routes are built with a `useAuth` mock hook returning a static profile, enabling full UI iteration without Firebase provisioning.
3. Service interfaces (`ChallengeService`, `WaitlistService`) are typed abstractions; swapping from local JSON/localStorage to Firestore is a single-file change per service.
4. Firestore Security Rules and credit-enforcement logic need careful design that benefits from a working UI to validate against.

---

## Port Assignments

| Service | Port |
|---|---|
| `services/sandbox` | 3001 |
| `apps/study` | 5173 |
| `apps/home` | 5174 |
| `apps/preview` | 5175 |

The `apps/study` Vite config proxies `/api/sandbox → http://localhost:3001` so the frontend never hard-codes the sandbox URL in non-dev code.

---

## Challenge Data Model

```typescript
type Language = 'python' | 'rust';
type Difficulty = 'beginner' | 'intermediate' | 'advanced';

interface Challenge {
  id: string;
  title: string;
  module: string;          // e.g. "Transformer Layers"
  difficulty: Difficulty;
  language: Language;
  description: string;     // plain text, rendered in problem pane
  starterCode: string;     // full source including embedded test harness
  tags: string[];
  staticHint: string;      // shown on "Get Hint" in Phase 1; Gemini replaces in Phase 3
}
```

Challenges are static TypeScript fixtures in Phase 1. Firestore-backed in Phase 2 (no component changes needed — the `ChallengeService` interface is the abstraction boundary).

---

## Sandbox API Contract

```
GET  /health
→ 200 { status: "ok", supportedLanguages: ["python", "rust"] }

POST /run
Body: { code: string, language: "python" | "rust" }
→ 200 { success: boolean, output: string, errors: string, executionTimeMs: number }
→ 400 { error: "INVALID_REQUEST", message: string }
→ 408 { error: "TIMEOUT", message: string }
→ 500 { error: "SANDBOX_ERROR", message: string }
```

**Phase 1 execution model:** user code is written to a temp file; `execFile` spawns `python3` or `rustc`+binary with a 10 s timeout. The test harness is embedded directly in each challenge's `starterCode` (not injected by the sandbox) — the sandbox simply runs the file and reports stdout/stderr/exit code.

**Phase 3 production model:** same API, different transport — Express forwards to a Cloud Run container; Cloud Functions hold the sandbox URL as an env var (never client-visible).

---

## Phase 1 — Local-First Baseline

### services/sandbox
- [x] Express app with `cors`, `express.json`, port 3001
- [x] `GET /health`
- [x] `POST /run` — validates input with zod, dispatches to executor
- [x] Python executor: temp file, `execFile('python3', [file])`, 10 s timeout, cleanup
- [x] Rust executor: temp file, `execFile('rustc', ...)` compile then run, cleanup
- [x] `Dockerfile` (used for Phase 3 Cloud Run deployment)

### apps/study
- [x] Vite proxy: `/api/sandbox → localhost:3001`
- [x] 4 seed challenges (beginner + intermediate Python)
- [x] `Dashboard` page: module grid with challenge cards, localStorage progress
- [x] `ChallengePage`: split-pane layout, Monaco editor, submit → sandbox
- [x] Results panel: pass/fail output display
- [x] On failure: "Get Hint" button → shows `staticHint` (Gemini replaces in Phase 3)
- [x] Progress persistence: `localStorage` (Firestore subcollection swap in Phase 2)

### apps/home
- [x] Hero, Features, How It Works, CTA sections
- [x] Link to waitlist (`apps/preview`)

### apps/preview
- [x] Email + name waitlist form
- [x] Phase 1: persist to `localStorage`, show confirmation
- [x] `WaitlistService` interface: swap implementation to Firestore `addDoc` in Phase 2

---

## Phase 2 — Firebase Integration

### Auth
- Replace mock `useAuth` with `onAuthStateChanged`.
- `ProtectedRoute` redirects to `/login`; `LoginPage` has `GoogleSignInButton`.
- On first sign-in: create `users/{uid}` Firestore doc.

### Firestore Data Model

```
users/{uid}
  email, displayName, tier: "free"|"enterprise", createdAt

users/{uid}/credits/current
  hintsUsed, hintCap (10 free / configurable enterprise), overageHeadroom, periodStart/End

users/{uid}/submissions/{submissionId}
  challengeId, language, userCode, success, output, errors, executedAt

challenges/{challengeId}   (read-only; populated by admin script)

waitlist/{docId}
  email, name, submittedAt
```

**Security rules:** clients read/write only their own `users/{uid}/**`; `challenges` is authenticated-read / never client-writable; `hints` sub-collection is Cloud Function-write only.

### Cloud Functions
- `runCode` (callable): auth-verify → write submission → forward to sandbox → write result → return to client.
- `requestHint` (callable): credit check → read submission context → call Gemini → `FieldValue.increment` credits → log hint → return markdown.
- `resetMonthlyCredits` (scheduled, 1st of month 00:00 UTC): reset `hintsUsed` to 0 across all users.

---

## Phase 3 — Gemini AI Hints

### Data flow
```
Click "Get Hint"
  → requestHint Cloud Function
    → credit check (abort with 429 if exhausted)
      → load challenge + latest submission from Firestore
        → gemini-2.0-flash-001 (system prompt + user code + errors)
          → FieldValue.increment(hintsUsed)
            → return HintResponse { hintMarkdown, tokensUsed, hintsRemaining }
```

### System prompt constraints
- Never provide the full corrected implementation; max 3–5 line snippet.
- Markdown output with syntax-highlighted code blocks.
- Socratic approach: guiding question before the hint.
- `maxOutputTokens: 400`, `temperature: 0.3`.

### Token budget
- Free: 10 hints/month ≈ $0.002/user/month at Gemini Flash pricing.
- Enterprise: configurable cap + purchasable `overageHeadroom`.
- Enforcement is server-side only in `requestHint`; frontend counter is advisory.

### Security invariants (all phases)
1. Gemini API key: Cloud Functions env var only. Never in client code or API responses.
2. Sandbox not internet-accessible in production: Cloud Run with `--no-allow-unauthenticated`.
3. AI never auto-triggered: no code path calls `requestHint` except an explicit button click.
4. User code never executes in the sandbox Node.js process: child process (Phase 1) or Docker container (Phase 3).
