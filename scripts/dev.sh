#!/usr/bin/env bash
# set -e intentionally omitted — it interferes with signal-interrupted `wait`
set -uo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

CYAN='\033[0;36m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RESET='\033[0m'

log()  { echo -e "${CYAN}[layerforge]${RESET} $*"; }
ok()   { echo -e "${GREEN}[layerforge]${RESET} $*"; }
warn() { echo -e "${YELLOW}[layerforge]${RESET} $*"; }

# ── Dependency check ──────────────────────────────────────────────────────────

check_dep() {
  if ! command -v "$1" &>/dev/null; then
    warn "Required dependency not found: $1"
    warn "  $2"
    exit 1
  fi
}

check_dep node    "Install Node.js 20+ from https://nodejs.org"
check_dep pnpm    "Run: npm install -g pnpm"
check_dep python3 "Install Python 3.10+ from https://python.org"
check_dep java    "Install Java 11+ (required for Firebase emulators): https://java.com"

NODE_MAJOR=$(node -e "process.stdout.write(process.versions.node.split('.')[0])")
if (( NODE_MAJOR < 20 )); then
  warn "Node.js 20+ is required (found $(node -v)). Please upgrade."
  exit 1
fi

if ! python3 -c "import numpy" &>/dev/null; then
  warn "numpy not found — Python challenges will fail at runtime."
  warn "  Fix: pip install numpy"
fi

# ── Stripe dev key check ──────────────────────────────────────────────────────

FUNCTIONS_ENV="$REPO_ROOT/services/functions/.env.local"
if [ ! -f "$FUNCTIONS_ENV" ]; then
  warn "services/functions/.env.local not found."
  warn "  Stripe billing will not work locally. Create the file:"
  warn "    cp services/functions/.env.example services/functions/.env.local"
  warn "  Then fill in your Stripe TEST keys."
elif ! grep -q "^STRIPE_SECRET_KEY=sk_test_" "$FUNCTIONS_ENV"; then
  warn "STRIPE_SECRET_KEY in services/functions/.env.local does not look like a test key."
  warn "  Make sure it starts with sk_test_ for local development."
fi

# ── Install dependencies if needed ───────────────────────────────────────────

if [ ! -d "$REPO_ROOT/node_modules" ]; then
  log "node_modules not found — running pnpm install..."
  pnpm --dir "$REPO_ROOT" install
fi

FIREBASE="$REPO_ROOT/node_modules/.bin/firebase"
if [ ! -x "$FIREBASE" ]; then
  warn "firebase-tools not found in node_modules — running pnpm install..."
  pnpm --dir "$REPO_ROOT" install
fi

# ── Build Cloud Functions (required by Functions emulator) ────────────────────

log "Building Cloud Functions..."
pnpm --filter @layerforge/functions build --silent 2>&1 | grep -v "^$" || true
ok "Cloud Functions built"

# ── Graceful shutdown ─────────────────────────────────────────────────────────

DEV_PID=""
EMULATOR_PID=""

cleanup() {
  # Reset all traps immediately to prevent re-entry if signals arrive during cleanup
  trap - INT TERM EXIT

  echo ""
  log "Shutting down all services..."

  # ── Stop Vite/pnpm dev ────────────────────────────────────────────────────
  if [[ -n "${DEV_PID:-}" ]] && kill -0 "$DEV_PID" 2>/dev/null; then
    kill -TERM "$DEV_PID" 2>/dev/null || true

    local i=0
    while kill -0 "$DEV_PID" 2>/dev/null && (( i++ < 25 )); do
      sleep 0.2
    done

    if kill -0 "$DEV_PID" 2>/dev/null; then
      warn "Dev servers did not stop within 5 s — force-killing..."
      kill -KILL "$DEV_PID" 2>/dev/null || true
      pkill -KILL -P "$DEV_PID" 2>/dev/null || true
    fi
  fi

  # ── Stop Firebase emulators ───────────────────────────────────────────────
  if [[ -n "${EMULATOR_PID:-}" ]] && kill -0 "$EMULATOR_PID" 2>/dev/null; then
    kill -TERM "$EMULATOR_PID" 2>/dev/null || true

    local j=0
    while kill -0 "$EMULATOR_PID" 2>/dev/null && (( j++ < 25 )); do
      sleep 0.2
    done

    if kill -0 "$EMULATOR_PID" 2>/dev/null; then
      warn "Firebase emulator did not stop within 5 s — force-killing..."
      kill -KILL "$EMULATOR_PID" 2>/dev/null || true
      pkill -KILL -P "$EMULATOR_PID" 2>/dev/null || true
    fi
  fi

  ok "All services stopped."
  exit 0
}

trap cleanup INT TERM EXIT

# ── Launch Firebase emulators ─────────────────────────────────────────────────
# Includes the Functions emulator so Stripe Cloud Functions run against
# test keys from services/functions/.env.local (never the live secret).

log "Starting Firebase emulators (Auth :9099, Firestore :8080, Functions :5001, UI :4000)..."

cd "$REPO_ROOT"

# On first run the import directory doesn't exist yet; import only when it does.
EMULATOR_EXTRA_ARGS="--export-on-exit .firebase/emulator-data"
if [ -d ".firebase/emulator-data" ]; then
  EMULATOR_EXTRA_ARGS="--import .firebase/emulator-data $EMULATOR_EXTRA_ARGS"
fi

# shellcheck disable=SC2086
"$FIREBASE" emulators:start --only auth,firestore,functions --project demo-layerforge \
  $EMULATOR_EXTRA_ARGS &
EMULATOR_PID=$!

# Wait for Auth emulator to be ready (up to ~18 s)
EMULATOR_READY=0
for _ in $(seq 1 60); do
  if curl -sf http://localhost:9099/ >/dev/null 2>&1; then
    EMULATOR_READY=1
    break
  fi
  sleep 0.3
done

if [ "$EMULATOR_READY" = "0" ]; then
  warn "Firebase Auth emulator did not become ready within 18 s."
  warn "Check that Java 11+ is installed and no other process owns :9099."
  exit 1
fi

# Wait for Functions emulator to be ready (up to ~12 s)
for _ in $(seq 1 40); do
  if (echo > /dev/tcp/localhost/5001) &>/dev/null 2>&1; then
    break
  fi
  sleep 0.3
done

ok "Firebase emulators ready (Stripe calls → test keys via services/functions/.env.local)"

# ── Launch dev servers ────────────────────────────────────────────────────────

echo ""
echo -e "  ${CYAN}study${RESET}        →  http://localhost:5173  (test Stripe: price IDs from apps/study/.env.local)"
echo -e "  ${CYAN}home${RESET}         →  http://localhost:5174"
echo -e "  ${CYAN}preview${RESET}      →  http://localhost:5175"
echo -e "  ${CYAN}sandbox${RESET}      →  http://localhost:3001"
echo -e "  ${CYAN}emulator UI${RESET}  →  http://localhost:4000"
echo ""
echo -e "  Press ${YELLOW}Ctrl+C${RESET} to stop all services."
echo ""

pnpm dev &
DEV_PID=$!

# Wait for pnpm to exit. `wait` returns non-zero when interrupted by a signal;
# the trap above handles cleanup in that case.
wait "$DEV_PID" || true
