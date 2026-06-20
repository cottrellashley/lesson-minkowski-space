---
name: marimo-operations
description: 'Operational playbook for starting, restarting, and validating marimo in this workspace.'
argument-hint: 'Describe marimo startup, restart, or validation task'
user-invocable: true
---

# Marimo Operations Skill

## Goal

Keep the notebook live and seamless without requiring user setup steps.

## Standard Start

1. Check existing listeners on ports 2718-2726.
2. If marimo is not running, start:
   uv run marimo edit lesson-content/minkowski-space.py --watch --headless --no-token
3. Capture and share the actual URL from startup output.

For newly created marimo files, place them in `lesson-content/marimo/` and run those from the same command pattern.

## Restart Procedure

1. Stop marimo only:
   pkill -f 'marimo edit'
2. Start again with the standard start command.
3. Share the new active URL.

## Verification Checklist

- No token/password in URL.
- Browser does not auto-open.
- Watch mode active.
- Notebook URL reachable.

## Do Not

- Do not use killall uvicorn.
- Do not ask the user whether marimo should be started.
