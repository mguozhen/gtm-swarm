#!/usr/bin/env bash
# Reviewer CLI — list pending drafts in a reviewer's queue, approve or reject.
#
# Usage:
#   review-queue.sh <reviewer>                list pending
#   review-queue.sh <reviewer> approve <id>   approve a draft (move to bank/)
#   review-queue.sh <reviewer> reject  <id> "<reason>"  reject (write anti-pattern)
#
# Drafts live in agents/<n>/content-bank/draft/ and are surfaced via
# symlinks under reviews/<reviewer>/ for filtering.

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
REVIEWER="${1:-}"
CMD="${2:-list}"
TARGET="${3:-}"
REASON="${4:-}"

if [[ -z "$REVIEWER" ]]; then
  echo "Usage: review-queue.sh <reviewer> [list|approve <id>|reject <id> \"reason\"]"
  exit 1
fi

QUEUE="$REPO_ROOT/reviews/$REVIEWER"
if [[ ! -d "$QUEUE" ]]; then
  echo "No queue for reviewer '$REVIEWER' — check agents/*/agent.yaml for reviewer names." >&2
  exit 1
fi

list_pending() {
  echo "Pending for $REVIEWER:"
  echo
  local found=0
  shopt -s nullglob
  for link in "$QUEUE"/*.md; do
    local id
    id="$(basename "${link%.md}")"
    local target
    target="$(readlink "$link" 2>/dev/null || echo "$link")"
    local agent
    agent="$(echo "$target" | sed -E 's|.*/agents/([^/]+)/.*|\1|')"
    local first
    first="$(grep -m1 '^# \|^title:' "$link" 2>/dev/null | head -1)"
    printf "  %-12s  %s\n    %s\n    → %s\n\n" "$agent" "$id" "$first" "$target"
    found=1
  done
  [[ $found -eq 0 ]] && echo "  (empty)"
}

resolve_draft() {
  local id="$1"
  local link="$QUEUE/$id.md"
  if [[ ! -e "$link" ]]; then
    echo "No draft '$id' in queue for $REVIEWER" >&2
    exit 1
  fi
  echo "$link"
}

approve() {
  local link
  link="$(resolve_draft "$TARGET")"
  local target
  target="$(readlink "$link")"
  local agent_dir
  agent_dir="$(dirname "$(dirname "$target")")"
  local bank="$agent_dir/bank"
  mkdir -p "$bank"
  local fname
  fname="$(basename "$target")"
  git -C "$REPO_ROOT" mv "${target#$REPO_ROOT/}" "${bank#$REPO_ROOT/}/$fname" 2>/dev/null \
    || mv "$target" "$bank/$fname"
  rm "$link"
  echo "Approved → $bank/$fname"
}

reject() {
  if [[ -z "$REASON" ]]; then
    echo "Reject requires a reason." >&2
    exit 1
  fi
  local link
  link="$(resolve_draft "$TARGET")"
  local target
  target="$(readlink "$link")"
  local agent_dir
  agent_dir="$(dirname "$(dirname "$target")")"
  local agent_id
  agent_id="$(basename "$agent_dir")"
  local summary
  summary="$(grep -m1 '^# \|^title:' "$target" | head -1 | sed 's/^# //; s/^title: //')"
  local date_str
  date_str="$(date +%Y-%m-%d)"
  cat >> "$agent_dir/anti-patterns.md" <<ENTRY

### $date_str · $TARGET
- What: $summary
- Why rejected: $REASON
- Avoid: TODO (Reviewer to refine)
ENTRY
  rm "$target" "$link"
  echo "Rejected $TARGET — appended to $agent_id/anti-patterns.md"
}

case "$CMD" in
  list)    list_pending ;;
  approve) approve ;;
  reject)  reject ;;
  *)       echo "Unknown command: $CMD"; exit 1 ;;
esac
