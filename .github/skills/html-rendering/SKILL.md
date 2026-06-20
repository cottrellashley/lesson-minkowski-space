---
name: html-rendering
description: 'Serve and hand off HTML interactives with direct rendered URLs inside this lesson workspace.'
argument-hint: 'Describe the HTML artifact to render and share'
user-invocable: true
---

# HTML Rendering Skill

## Goal

Make HTML artifacts instantly viewable as rendered pages, not raw source files.

## Workflow

1. Confirm or create the target file in lesson-content/apps/.
2. Check whether port 5500 is serving.
3. If not serving, start:
   cd lesson-content && python3 -m http.server 5500
4. Return both:
   - clickable file link
   - direct render URL: http://localhost:5500/apps/<file>.html

## Handoff Requirement

If the user asks to see the page, always provide the rendered URL immediately.

## Do Not

- Do not stop at only a file link.
- Do not require the user to infer that local HTTP serving is needed.
