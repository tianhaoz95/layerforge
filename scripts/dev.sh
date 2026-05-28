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

NODE_MAJOR=$(node -e "process.stdout.write(process.versions.node.split('.')[0])")
if (( NODE_MAJOR < 20 )); then
  warn "Node.js 20+ is required (found $(node -v)). Please upgrade."
  exit 1
fi

if ! python3 -c "import numpy" &>/dev/null; then
  warn "numpy not found — Python challenges will fail at runtime."
  warn "  Fix: pip install numpy"
fi

# ── Install dependencies if needed ───────────────────────────────────────────

if [ ! -d "$REPO_ROOT/node_modules" ]; then
  log "node_modules not found — running pnpm install..."
  pnpm --dir "$REPO_ROOT" install
fi

# ── Graceful shutdown ─────────────────────────────────────────────────────────

DEV_PID=""

cleanup() {
  # Reset all traps immediately to prevent re-entry if signals arrive during cleanup
  trap - INT TERM EXIT

  echo ""
  log "Shutting down all services..."

  if [[ -n "${DEV_PID:-}" ]] && kill -0 "$DEV_PID" 2>/dev/null; then
    # Send SIGTERM to pnpm. When Ctrl+C is used, the whole foreground process
    # group already received SIGINT (Vite and tsx are already stopping). This
    # also covers the `kill <pid>` / SIGTERM case where children don't auto-receive.
    kill -TERM "$DEV_PID" 2>/dev/null || true

    # Wait up to 5 s for a clean shutdown (25 × 0.2 s)
    local i=0
    while kill -0 "$DEV_PID" 2>/dev/null && (( i++ < 25 )); do
      sleep 0.2
    done

    # Force-kill anything that didn't stop in time
    if kill -0 "$DEV_PID" 2>/dev/null; then
      warn "Services did not stop within 5 s — force-killing..."
      kill -KILL "$DEV_PID" 2>/dev/null || true
      # Also kill any grandchildren that survived (e.g. detached Vite workers)
      pkill -KILL -P "$DEV_PID" 2>/dev/null || true
    fi
  fi

  ok "All services stopped."
  exit 0
}

trap cleanup INT TERM EXIT

# ── Launch ────────────────────────────────────────────────────────────────────

ok "Starting LayerForge dev environment"
echo ""
echo -e "  ${CYAN}home${RESET}     →  http://localhost:5174"
echo -e "  ${CYAN}preview${RESET}  →  http://localhost:5175"
echo -e "  ${CYAN}study${RESET}    →  http://localhost:5173"
echo -e "  ${CYAN}sandbox${RESET}  →  http://localhost:3001"
echo ""
echo -e "  Press ${YELLOW}Ctrl+C${RESET} to stop all services."
echo ""

cd "$REPO_ROOT"
pnpm dev &
DEV_PID=$!

# Wait for pnpm to exit. `wait` returns non-zero when interrupted by a signal;
# the trap above handles cleanup in that case.
wait "$DEV_PID" || true
