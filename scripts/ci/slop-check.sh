#!/usr/bin/env bash
# Deterministic check for phrases that signal placeholder/demo code an LLM
# left behind. Case-insensitive; scans tracked source files only.
#
# Player-facing PROSE rules (no math metaphors, em-dash density, no
# semicolons in texts) live in test-content.ts, which runs in npm test —
# they need the content graph, not a grep.
set -euo pipefail

PATTERNS=(
  'in a real app'
  'in a production app'
  'for demonstration purposes'
  'this is a simplified'
  'simplified version of'
  'you would typically'
  'left as an exercise'
  'as an AI'
  'YOUR_API_KEY'
  'lorem ipsum'
)
# NOTE: the RevenueCat placeholder keys are deliberately NOT banned here —
# they must stay until the ASC/RevenueCat setup lands, and proAccess.ts
# fails open while they're in place. Replacing them is a pre-ship checklist
# item, not a CI gate.

FILES=$(git ls-files '*.ts' '*.tsx' '*.js' '*.jsx' | grep -v -e '^scripts/ci/' || true)
[ -z "$FILES" ] && exit 0

STATUS=0
for p in "${PATTERNS[@]}"; do
  if MATCHES=$(echo "$FILES" | xargs grep -lni "$p" 2>/dev/null); then
    echo "BANNED PHRASE \"$p\" found in:"
    echo "$MATCHES"
    STATUS=1
  fi
done

exit $STATUS
