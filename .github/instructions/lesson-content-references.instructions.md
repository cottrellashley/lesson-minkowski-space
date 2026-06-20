---
description: "Rules for lesson-content/references artifacts (notes, guides, explainers)."
applyTo: "lesson-content/references/**"
---

# References Directory Instructions

Use this directory for student-facing references and static explainers.

## Allowed Artifacts

- Markdown explainers (`.md`)
- Short conceptual walkthroughs
- Study/reference sheets

## Content Style

- Prioritize conceptual clarity over implementation details.
- Keep sections concise and preview-friendly in VS Code.
- Use equations only when they clarify intuition.

## Naming

- Use descriptive, learning-outcome-focused names (e.g., `proper-time-intuition.md`).

## PDF Ingestion SOP (Required)

When PDFs are present in `lesson-content/resources/`, handle them proactively:

1. Detect available PDF files and prepare a short inventory.
2. Start text extraction in the background using reliable tooling (`pdftotext` or `uv run python` + `pypdf`).
3. Produce concise, student-facing summaries without waiting for a direct request.
4. Present results as:
	- title/topic
	- key points
	- critical equations/results
	- one short checkpoint question

The user should not need to explicitly ask for each extraction step.
