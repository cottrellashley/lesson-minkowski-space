---
description: "Structure and placement rules for all lesson-content artifacts."
applyTo: "lesson-content/**"
---

# Lesson Content Structure Instructions

Use the following structure for all new content in lesson-content/:

- references/ : markdown references, concept notes, walkthroughs
- marimo/ : marimo files to run/edit
- apps/ : HTML-JS interactive apps
- jupiter/ : Jupyter notebooks used in VS Code

## Placement Rules

1. New marimo files go to lesson-content/marimo/.
2. New HTML files go to lesson-content/apps/.
3. New markdown reference material goes to lesson-content/references/.
4. New .ipynb notebooks go to lesson-content/jupiter/.

## Subdirectory Instruction Rule

Use dedicated instruction files for each lesson-content subdirectory. The shared
rules in this file apply to all lesson-content paths, and directory-specific
instruction files add additional constraints for:

- lesson-content/references/**
- lesson-content/marimo/**
- lesson-content/apps/**
- lesson-content/jupiter/**

## Backward Compatibility

- Existing root files in lesson-content/ are legacy and may remain.
- Do not move or rename legacy files unless explicitly requested.

## Handoff Rules

- Always return a clickable file link for created/updated artifacts.
- For HTML in apps/, always provide render URL:
  http://localhost:5500/apps/<file>.html
