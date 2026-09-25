---
name: jupiter-notebook-operations
description: 'Operate Jupyter notebooks in lesson-content/jupiter with reliable cell execution, venv library management, kernel wiring, debugging, and structured cell edits.'
argument-hint: 'Describe the notebook task: run cells, add packages, connect kernel, debug, or edit notebook sections'
user-invocable: true
---

# Jupiter Notebook Operations

Use this skill for all notebook operations in `lesson-content/jupiter/**`.

## Scope

- Execute individual notebook cells reliably.
- Add notebook dependencies to the project venv.
- Connect notebooks to the correct venv kernel.
- Debug failing or hanging notebook execution.
- Edit or insert notebook cells while preserving metadata and structure.

## Standard Execution Workflow

1. Read notebook summary first to get current cell order and cell types.
2. Run code cells only (never markdown cells).
3. Run cells sequentially when there are dependencies.
4. Read cell outputs to validate execution and inspect errors.

If cell-by-cell execution is unstable, execute the notebook via:

- `uv run jupyter nbconvert --to notebook --execute --inplace lesson-content/jupiter/<notebook>.ipynb --ExecutePreprocessor.timeout=180`

## Library Management In Project Venv

Use `uv` so changes are tracked in project files.

1. Add required libraries:
   - `uv add <packages>`
2. Verify installed packages:
   - `uv pip list`
3. Confirm `pyproject.toml` and `uv.lock` updated.

Typical notebook dependencies:

- `ipykernel`
- `jupyterlab`
- `pandas`
- `scipy`
- `seaborn`
- `plotly`

## Kernel Wiring (Notebook <-> Venv)

1. Register the project kernel:
   - `uv run python -m ipykernel install --user --name lesson-minkowski-space --display-name "Python (lesson-minkowski-space)"`
2. Ensure notebook metadata includes:
   - `kernelspec.name: lesson-minkowski-space`
   - `kernelspec.display_name: Python (lesson-minkowski-space)`
3. Verify active runtime path with:
   - `import sys; print(sys.executable)`

Expected result: executable points to workspace `.venv`.

## Debugging Playbook

1. Re-read notebook summary after each significant edit.
2. Execute import/setup cell first.
3. Inspect traceback from failing cell output.
4. Fix one failure at a time and rerun from dependency boundary.
5. If kernel state is corrupted/stuck:
   - restart kernel,
   - rerun in order,
   - fallback to `nbconvert --execute` for deterministic validation.
6. Confirm final outputs are present.

Always check:

- kernel path
- package import success
- execution order validity
- expected visual/data outputs

## Cell Editing Workflow

1. Pull latest notebook summary (cells may have changed).
2. Existing cells:
   - edit in place,
   - preserve `metadata.id`.
3. New cells:
   - insert at top/bottom or after target location,
   - include `metadata.language` (`markdown` or `python`).
4. Keep teaching flow compact:
   - objective markdown,
   - focused code cell,
   - short check-question markdown.
5. Execute edited/new cells to validate.

## JSON Requirements

When creating/replacing notebook JSON directly:

- valid top-level notebook JSON object,
- `cells` array with valid cell objects,
- each cell includes `metadata.language`,
- existing cells retain `metadata.id`.
