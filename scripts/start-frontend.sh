#!/usr/bin/env bash
# Launch BOTH the admin UI and the customer UI in dev mode.
# Starts each shell plus all of its Module-Federation remote MFs so the UIs
# load completely (no "remote not found" errors).
#   Admin UI:    http://localhost:5174
#   Customer UI: http://localhost:5173
#
# Each `vite` dev server is launched with stdin redirected from /dev/null so it
# never blocks on the "press h for help" TTY read (which would otherwise suspend
# the backgrounded process via SIGTTIN and prevent it from binding its port).
set -u
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
LOG_DIR="${LOG_DIR:-/tmp/banking360-fe}"
mkdir -p "$LOG_DIR"
PIDS_FILE="$LOG_DIR/pids.txt"
: > "$PIDS_FILE"
PIDS=()

# Kill any stale dev servers so module-federation ports are free.
pkill -f "node.*vite" 2>/dev/null || true
pkill -f "pnpm --filter" 2>/dev/null || true
sleep 2

start_pkg() {
  local dir="$1"
  [ -f "$dir/package.json" ] || return 0
  local name
  name=$(node -p "require('./$dir/package.json').name" 2>/dev/null) || return 0
  local log="$LOG_DIR/$(echo "$dir" | tr '/' '_').log"
  echo "starting $name -> $dir (log: $log)"
  ( pnpm --filter "$name" dev < /dev/null > "$log" 2>&1 ) &
  local pid=$!
  PIDS+=($pid)
  echo "$pid $name $dir" >> "$PIDS_FILE"
}

# Admin group: shell + 19 remote MFs (ports 5174, 5200-5218)
for d in frontend/admin/*/; do start_pkg "${d%/}"; done
# Customer group: shell + 13 remote MFs (ports 5173, 5171, 5175-5186)
for d in frontend/customer/*/; do start_pkg "${d%/}"; done

echo "Started ${#PIDS[@]} vite processes."
echo "Admin UI:    http://localhost:5174"
echo "Customer UI: http://localhost:5173"
echo "Logs: $LOG_DIR   PIDs: $PIDS_FILE"

trap 'echo; echo "Stopping all frontend processes..."; kill "${PIDS[@]}" 2>/dev/null; pkill -P "${PIDS[@]}" 2>/dev/null; exit 0' INT TERM
wait