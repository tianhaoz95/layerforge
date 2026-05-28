# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**LayerForge** is a code-first AI/ML learning platform where users implement ML concepts from scratch (transformers, attention, etc.) in-browser and receive opt-in AI hints only on failure. The authoritative product spec is `layer-forge-prd.md`; the phased implementation plan is `design/implementation-plan.md`.

## Repository Structure

```
layerforge/
├── apps/
│   ├── home/      # Marketing landing page — React + Vite + Tailwind (port 5174)
│   ├── preview/   # Waitlist signup — React + Vite + Tailwind (port 5175)
│   └── study/     # Core challenge platform — React + Vite + Monaco Editor (port 5173)
├── services/
│   └── sandbox/   # Code execution REST service — Node.js + Express + TypeScript (port 3001)
└── design/        # PRD and implementation plan docs
```

## Dev Commands

```bash
# Install all workspace dependencies
pnpm install

# Run all services in parallel
pnpm dev

# Run a single workspace
pnpm --filter @layerforge/study dev
pnpm --filter @layerforge/sandbox dev
pnpm --filter @layerforge/home dev
pnpm --filter @layerforge/preview dev

# Type-check all
pnpm typecheck

# Build all
pnpm build
```

**Prerequisites:** Node 20+, pnpm 9+, Python 3+ (for sandbox), Rust toolchain (for sandbox Rust challenges).

## Architecture

### apps/study — the main product

- **Routing:** `src/App.tsx` — React Router v6, two routes: `/` → Dashboard, `/challenge/:id` → ChallengePage.
- **Challenge data:** `src/data/challenges.ts` — static TypeScript array of 4 Python challenges (Phase 1). Each challenge includes the full starter code with the test harness embedded — the sandbox just runs the file as-is.
- **Sandbox client:** `src/services/sandbox.ts` — single `runCode(code, language)` function that POSTs to `/api/sandbox/run` (proxied by Vite to `localhost:3001`).
- **Progress state:** `src/hooks/useProgress.ts` — localStorage in Phase 1; swap to Firestore `users/{uid}/submissions` in Phase 2.
- **Key pages:** `ChallengePage.tsx` uses `@monaco-editor/react` for the in-browser editor; on submit it calls the sandbox and shows `ResultPanel`; on failure shows a "Get Hint" button that triggers `HintPanel` (static hint in Phase 1, Gemini Cloud Function in Phase 3).

### services/sandbox

- `src/index.ts` — Express app, port 3001, CORS enabled.
- `src/executor.ts` — `executePython` / `executeRust` use `child_process.execFile` (not `exec` — no shell) with 10 s timeout. Code is written to a temp file under `/tmp/lf-<uuid>/`, executed, then cleaned up.
- `src/routes/run.ts` — `POST /run` validates with zod then dispatches to executor.
- **Production:** swap `execFile` for Docker container execution on Cloud Run (see Dockerfile).

### apps/preview

- Single-page waitlist form in `src/components/WaitlistForm.tsx`.
- Phase 1: `persistEntry()` writes to `localStorage['layerforge:waitlist']`.
- Phase 2: replace `persistEntry` body with `addDoc(collection(db, 'waitlist'), entry)`.

### apps/home

- Static marketing page. Components: `Navbar`, `Hero`, `Features`, `HowItWorks`, `Footer`.
- No state, no routing. Hardcodes `http://localhost:5175` as the waitlist URL (update for production).

## Key Product Constraints

- **AI is opt-in only.** The "Get Hint" button must never be triggered automatically — only on explicit click. This applies in all phases.
- **Gemini API key is server-side only.** Never put it in frontend code. In Phase 3 it lives only in Cloud Functions environment variables.
- **Sandbox is not internet-accessible in production.** Cloud Run deploys with `--no-allow-unauthenticated`; only the Cloud Functions service account can invoke it.
- **Credit enforcement is server-side.** The frontend credit counter is display-only; enforcement happens in the `requestHint` Cloud Function after Firebase ID token verification.
- **Skill synchronization.** The challenge-creation skill `new-challenge` exists in two separate locations: the global Antigravity configuration (`~/.gemini/config/skills/new-challenge/SKILL.md`) and the repository-local Claude Code command (`.claude/commands/new-challenge.md`). When updating or modifying guidelines/instructions for the skill, both files must be updated together to maintain parity between Antigravity (Gemini) and Claude Code.

## Firebase Phases

**Phase 1 (current):** No Firebase. Mock auth, localStorage for progress and waitlist, static challenge data, sandbox runs locally via child_process.

**Phase 2:** Add Firebase Auth (Google Sign-In), Firestore for user profiles / progress / waitlist. Replace service interfaces — no component rewrites needed since abstractions are already in place (`useProgress`, `WaitlistService`).

**Phase 3:** Add Gemini Flash hints via Firebase Cloud Functions callable. Replace `HintPanel`'s static `staticHint` prop with a Cloud Function response. Wrap sandbox in a Cloud Function that calls Cloud Run.

## Sandbox API

```
GET  /health  →  { status: "ok", supportedLanguages: ["python", "rust"] }

POST /run
  Body:     { code: string, language: "python" | "rust" }
  Response: { success: boolean, output: string, errors: string, executionTimeMs: number }
```

## Challenge Structure

Each `Challenge` in `src/data/challenges.ts` has:
- `starterCode` — complete Python/Rust file with function signature + docstring + embedded test harness at the bottom. Users fill in the body; the sandbox runs the whole file.
- `staticHint` — plain-text Socratic hint shown on "Get Hint" in Phase 1.
- `description` — plain text rendered as `whitespace-pre-wrap` in the problem pane.

Test harnesses use `assert` statements (AssertionError → non-zero exit → `success: false`) and print `"All tests passed!"` on success.
