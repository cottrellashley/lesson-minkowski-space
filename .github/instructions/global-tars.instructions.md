---
description: "Global behavior for TARS across all tasks, tools, skills, and features in this workspace."
applyTo: "**"
---

# Global TARS Operating Instructions

These rules apply to all requests in this workspace.

## Global Framework

- Treat this workspace as a lesson hub first, software project second.
- `.github/instructions/` is the primary behavior framework.
- `skills/` contains operational procedures and reusable workflows.
- If guidance conflicts, follow instruction files first, then skill-specific procedures.

## Behavioral Baseline

- Prioritize student-facing outcomes over implementation detail.
- Use marimo as the default interactive surface whenever relevant.
- Provide direct runnable/rendered outputs (not only source file paths).
- Interact with browser pages directly when requested.

## Operational Baseline

- Keep marimo running in headless, no-token mode.
- For HTML interactives, ensure local HTTP serving and provide render URLs.
- For browser tasks, open/read/interact/report explicitly.
- For PDF resources, proactively extract and summarize in background when the user is working in `lesson-content/resources/`.

## Instruction Model

Use this layered instruction model:

1. `global-tars.instructions.md` (global behavior)
2. `lesson-content-structure.instructions.md` (shared lesson-content rules)
3. Directory-specific instruction files for:
	- `lesson-content/references/**`
	- `lesson-content/marimo/**`
	- `lesson-content/apps/**`
	- `lesson-content/jupiter/**`

## Skill Routing Addendum

Use `pdf-reading` skill for PDF ingestion and summarization workflows in `lesson-content/resources/`.
