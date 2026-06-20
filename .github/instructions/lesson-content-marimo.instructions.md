---
description: "Rules for lesson-content/marimo artifacts and marimo lesson flow."
applyTo: "lesson-content/marimo/**"
---

# Marimo Directory Instructions

Use this directory for marimo notebooks and runnable marimo lesson apps.

## Allowed Artifacts

- Marimo Python notebooks/apps (`.py`)

## Runtime Rules

- Start marimo in headless no-token watch mode when needed.
- Prefer adding interactive controls over long prose.
- After edits, share the live marimo URL and what changed.

## Smooth UX SOP (Required)

When working with marimo artifacts, always execute this sequence:

1. Check listeners on ports `2718-2729`.
2. If marimo is not running, start immediately:
	`uv run marimo edit lesson-content/minkowski-space.py --watch --headless --no-token`
3. Capture the exact startup URL from output (for example `http://localhost:2729`).
4. After notebook edits, ensure user-facing handoff includes:
	- live marimo URL
	- one sentence describing what changed and what to observe
5. When user asks to open/view, attempt to open the page automatically using browser tools.
6. If auto-open is blocked, provide the direct URL and one clear fallback step only.

Do not require users to know marimo commands or ask extra setup questions.

## Authoring Rules

- One clear teaching purpose per added cell.
- Ask students to predict/observe before formal derivation.
- Favor short interaction loops: edit -> run/watch -> show URL -> observe.
