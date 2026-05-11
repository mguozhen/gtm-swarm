#!/usr/bin/env bash
# Run CIA discovery for a gtm-swarm project, copy outputs to projects/<slug>/cia/.
# Requires: ~/.claude/skills/cia installed + CIA_HUB_URL + CIA_HUB_TOKEN in
# ~/.claude/settings.json env.
#
# Usage:
#   scripts/cia-for-project.sh <slug> "<topic>" [country]
#   scripts/cia-for-project.sh voc-ai "amazon review intelligence" us
#   scripts/cia-for-project.sh btcmind "btc perp risk co-pilot" us

set -euo pipefail

if [[ $# -lt 2 ]]; then
  echo "Usage: $0 <project-slug> \"<topic>\" [country]" >&2
  exit 1
fi

SLUG="$1"
TOPIC="$2"
COUNTRY="${3:-us}"
REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
CIA_BIN="$HOME/.claude/skills/cia/scripts/cia"
PROJECT_DIR="$REPO_ROOT/projects/$SLUG"
CIA_OUT="$PROJECT_DIR/cia"

if [[ ! -x "$CIA_BIN" ]]; then
  echo "CIA not installed. Run: git clone https://github.com/ericstory/CIA-insight.git ~/.claude/skills/cia && bash ~/.claude/skills/cia/install.sh" >&2
  exit 1
fi
if [[ ! -d "$PROJECT_DIR" ]]; then
  echo "Project not found: $PROJECT_DIR" >&2
  exit 1
fi
if ! grep -q "CIA_HUB_TOKEN" ~/.claude/settings.json 2>/dev/null; then
  echo "⚠ CIA_HUB_TOKEN not in ~/.claude/settings.json env. CIA fetches will fail until you ask @andrew for one." >&2
fi

echo "→ CIA discovery for $SLUG / $TOPIC ($COUNTRY)"

"$CIA_BIN" init "$TOPIC" --country "$COUNTRY"

# Example data pulls (Founder customizes for the project)
"$CIA_BIN" fetch-itunes-serp --topic "$TOPIC" --keywords "$TOPIC" --limit 20 || echo "  (itunes skipped/failed)"
"$CIA_BIN" fetch-tiktok --topic "$TOPIC" --queries "$TOPIC" --max-items 30 || echo "  (tiktok skipped/failed)"
"$CIA_BIN" fetch-reddit --topic "$TOPIC" --queries "$TOPIC" --subreddits "Entrepreneur,smallbusiness,startups" --max-items 30 || echo "  (reddit skipped/failed)"

"$CIA_BIN" status --topic "$TOPIC" || true
"$CIA_BIN" export --topic "$TOPIC" || true

REPORTS_BASE="$HOME/workspace/analytics/reports"
TOPIC_SLUG=$(echo "$TOPIC" | tr '[:upper:]' '[:lower:]' | tr -c '[:alnum:]\n' '-' | tr -s '-' | sed 's/^-\|-$//g')
LATEST=$(ls -dt "$REPORTS_BASE"/*"$TOPIC_SLUG"* 2>/dev/null | head -1)

if [[ -z "$LATEST" || ! -d "$LATEST" ]]; then
  echo "⚠ Could not locate CIA output dir under $REPORTS_BASE" >&2
  exit 1
fi

mkdir -p "$CIA_OUT"
for f in synthesis.md report.md report.html data.xlsx cia.db; do
  if [[ -f "$LATEST/$f" ]]; then cp "$LATEST/$f" "$CIA_OUT/$f" && echo "  ✓ $f"; fi
done

echo ""
echo "✓ CIA data copied to $CIA_OUT"
echo "  Next: wizard Step 1+2 will auto-include this data in the LLM prompt."
