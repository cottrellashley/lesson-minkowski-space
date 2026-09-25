---
description: "Rules for lesson-content/jupiter notebooks used in VS Code."
applyTo: "lesson-content/jupiter/**"
---

# Jupiter Directory Instructions

Use this directory for VS Code Jupyter notebooks used for explanation and experimentation.

For full execution/edit/debug procedures, use the `jupiter-notebook-operations` skill.

## Allowed Artifacts

- Jupyter notebooks (`.ipynb`)

## Notebook Style

- Interleave short markdown framing with executable cells.
- Keep cells small and concept-focused.
- Execute cells after edits when feasible.

## Teaching Flow

- State the objective of each notebook section.
- End sections with a short check question or prompt.

## Detailed Notebook Operations

The following is the required operational workflow for notebooks in `lesson-content/jupiter/**`.

### 1) How To Execute Individual Cells

Primary method:

1. Get the latest notebook structure first.
	- Use the notebook summary tool to identify current cell order and cell types.
2. Execute code cells only.
	- Do not try to run markdown cells.
3. Run in order when cells depend on prior state.
	- Run imports/setup cells first, then analysis/plot cells.
4. If a cell has output but execution state is unclear, read the cell output directly.

Fallback method (when interactive kernel execution is unstable):

- Execute the full notebook with `nbconvert` from the project environment.
- Preferred command pattern:
  - `uv run jupyter nbconvert --to notebook --execute --inplace lesson-content/jupiter/<notebook>.ipynb --ExecutePreprocessor.timeout=180`

### 2) How To Add Libraries To The Project Venv

Use `uv` so dependencies are tracked in project files.

1. Add packages:
	- `uv add <package1> <package2> ...`
2. Confirm installation in the active project venv:
	- `uv pip list`
3. Keep dependency metadata consistent:
	- `pyproject.toml` and `uv.lock` should reflect the new packages.

Typical notebook stack:

- `ipykernel`
- `jupyterlab`
- `pandas`
- `scipy`
- `seaborn`
- `plotly`

### 3) How To Connect A Notebook To The Project Venv

1. Register a dedicated kernel from the project venv:
	- `uv run python -m ipykernel install --user --name lesson-minkowski-space --display-name "Python (lesson-minkowski-space)"`
2. Ensure notebook metadata points to that kernel:
	- `metadata.kernelspec.name = "lesson-minkowski-space"`
	- `metadata.kernelspec.display_name = "Python (lesson-minkowski-space)"`
3. Validate at runtime with a code cell:
	- `import sys; print(sys.executable)`
	- Executable should resolve to the workspace `.venv` path.

### 4) How To Debug Notebook Execution Issues

Use this sequence:

1. Refresh notebook summary to get current cell order and execution status.
2. Run imports/setup cell first.
3. If a cell fails, inspect the exact traceback from cell output.
4. Fix the specific failing cell, then rerun from the nearest dependency boundary.
5. If kernel state is corrupted or stuck:
	- Restart kernel and rerun sequentially.
	- If still unstable, use `nbconvert` execution fallback.
6. Confirm final outputs are present in notebook JSON or rendered output.

Debugging checks to always include:

- Kernel path (`sys.executable`)
- Package import validity
- Cell execution order
- Plot/data output presence

### 5) How To Edit/Add Notebook Content (New And Existing Cells)

When editing notebooks programmatically:

1. Always pull latest notebook summary first (cells may have changed).
2. For existing cells:
	- Edit the cell content directly.
	- Preserve `metadata.id` for existing cells.
3. For new cells:
	- Insert at `TOP`, `BOTTOM`, or after a target cell.
	- Include `metadata.language` as `markdown` or `python`.
4. Keep teaching structure tight:
	- short markdown objective cell
	- small executable cell
	- short check question cell
5. After content changes, execute relevant cells to validate behavior.

If creating/replacing a notebook as JSON, enforce:

- valid top-level notebook JSON
- each cell as valid JSON object in `cells`
- `metadata.language` on each cell
- `metadata.id` retained for existing cells

## Cross-Skill Routing

- Use `jupiter-notebook-operations` for notebook execution, dependency setup, kernel wiring, debugging, and cell editing workflows.
