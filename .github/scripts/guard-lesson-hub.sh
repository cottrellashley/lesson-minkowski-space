#!/usr/bin/env bash

payload="$(cat)"

if printf '%s' "$payload" | grep -Eiq 'git reset --hard|git checkout --|rm -rf|rm -fr'; then
  cat <<'EOF'
{"hookSpecificOutput":{"hookEventName":"PreToolUse","permissionDecision":"deny","permissionDecisionReason":"Blocked destructive command in lesson hub workspace."},"stopReason":"Blocked destructive command in lesson hub workspace."}
EOF
  exit 2
fi

cat <<'EOF'
{"hookSpecificOutput":{"hookEventName":"PreToolUse","permissionDecision":"allow"}}
EOF