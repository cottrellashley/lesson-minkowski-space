---
name: pdf-reading
description: 'Read PDFs in lesson-content/resources, extract usable text, and produce learner-friendly summaries reliably.'
argument-hint: 'Describe which PDF(s) to read and what depth is needed'
user-invocable: true
---

# PDF Reading Skill

## Goal

Turn PDF resources into usable learning content with minimal user effort.

## Standard Workflow

1. Identify target PDF(s) in `lesson-content/resources/`.
2. Extract text using this fallback chain:
   - `pdftotext` (preferred when available)
   - `uv run python` with `pypdf` (project-managed fallback)
   - other available extractors only if needed
3. If extraction fails, report exactly what failed and try the next fallback.
4. Summarize in student-facing language:
   - topic
   - key definitions
   - main equations/results
   - one short checkpoint question
5. If multiple PDFs are requested, process in batches and provide concise progress updates.

## Background Mode

When the conversation context indicates the user is working in `lesson-content/resources/`:

1. Begin extraction and high-level summarization in the background without waiting for an explicit "read this PDF" request.
2. Offer a short menu of available PDFs and ask which one to expand first.
3. Keep summaries brief by default, then deepen on request.

## Reliability Notes

- Prefer `uv run python` so environment packages are consistent.
- Avoid binary dumps; only return cleaned, readable text/snippets.
- Quote equations exactly when possible.
