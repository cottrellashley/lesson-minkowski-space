---
name: lesson-hub
description: 'Orchestrate tutoring workflows in this workspace. Use for concept explanations, marimo demonstrations, checkpoint creation, markdown explainers, HTML learning aids, and student-first lesson delivery inside VS Code.'
argument-hint: 'Describe the concept, exercise, or lesson step you want to run'
user-invocable: true
---

# Lesson Hub Workflow

## When to Use

- The user wants to learn, not code.
- A concept should be shown with marimo rather than described abstractly.
- A quick markdown explainer or HTML interactive would help.
- The student needs a checkpoint, prompt, or short exercise.
- The workspace should behave like a small educational product instead of a project folder.

## Core Modes

### Explain a Concept

1. Identify the misconception, concept, or question.
2. Predict the expected physical behavior.
3. Use or update marimo if a visualization is missing.
4. Explain the result in plain language.
5. End with a one-step student prompt.

### Build a Checkpoint

1. Locate the lesson section where the checkpoint belongs.
2. Add one focused prompt.
3. Prefer a short-answer field, slider exploration, or compare-and-predict task.
4. Validate the notebook.

### Create a Markdown Explainer

1. Write a short student-facing note.
2. Use headings, concise prose, and KaTeX equations.
3. Optimize for preview rendering inside VS Code.
4. Keep the artifact tightly scoped to one learning objective.

### Create a Small HTML Learning Aid

1. Use a single self-contained file when possible.
2. Keep the interface minimal and visually intentional.
3. Explain what the student should manipulate and notice.
4. Avoid turning the artifact into a generic developer demo.
5. Always provide a render path, not only a file path:
	- ensure server: `cd lesson-content && python3 -m http.server 5500`
	- render URL: `http://localhost:5500/<file>.html`
	- include the clickable file link too.

### HTML Rendering Handoff Rule

When a student says they want to "see it" or "browser render":

1. Start or verify the local server on port `5500`.
2. Return the direct URL in chat (`http://localhost:5500/...`).
3. Mention it can be opened in VS Code Simple Browser if desired.

Never respond with only the file link when rendered output is requested.

## Teaching Quality Checks

- Does the interaction start from intuition?
- Is the student asked to observe or predict something?
- Is the math connected back to geometry or physical meaning?
- Does the result feel like a lesson step rather than a coding task?

## Reference Workflows

- [Lesson workflows](./references/workflows.md)

## Cross-Skill Routing

Use companion skills for operational tasks:

- For marimo startup/restart/health checks: `marimo-operations`
- For HTML serving and rendered URL handoff: `html-rendering`
- For opening and manipulating browser pages: `browser-interaction`
- For extracting and summarizing PDFs in resources: `pdf-reading`