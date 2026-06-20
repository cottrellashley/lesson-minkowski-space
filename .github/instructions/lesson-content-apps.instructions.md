---
description: "Rules for lesson-content/apps HTML-JS interactive artifacts."
applyTo: "lesson-content/apps/**"
---

# Apps Directory Instructions

Use this directory for HTML/JS/CSS learning applications.

## Allowed Artifacts

- HTML files (`.html`)
- Optional colocated JS/CSS assets

## Render Rules

- Ensure local server is running from `lesson-content/` on port `5500`.
- Always provide:
  - clickable file link
  - render URL: `http://localhost:5500/apps/<file>.html`

## Smooth UX SOP (Required)

When creating or updating an app in `lesson-content/apps/`, always execute this sequence:

1. Save/update the app file under `lesson-content/apps/`.
2. Ensure server is active:
  - check port 5500
  - if not active, run `cd lesson-content && python3 -m http.server 5500`
3. Construct the render URL: `http://localhost:5500/apps/<file>.html`
4. Attempt to open the rendered page automatically using browser tools.
5. Read page state once to verify it loaded.
6. Return a minimal handoff to user:
  - one clickable file link
  - one direct render URL
  - one sentence describing what they should see

If automatic opening is blocked by tool preconditions, immediately provide the direct render URL and one manual fallback step (open URL in VS Code Simple Browser).

Do not hand off only source paths when the user asked to see rendered output.

## UX Rules

- Keep controls explicit and labels instructional.
- Prefer one concept per interactive app.
- Prioritize a one-click experience: user should click URL and see rendered page with no extra setup.
