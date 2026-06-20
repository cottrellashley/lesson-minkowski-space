# 🌌 Minkowski Space 101: Interactive Relativity Lesson

A complete, self-contained lesson on special relativity using interactive visualizations in VS Code.

## What Is This?

This is a **lesson workspace**, not a code project. When you open it in VS Code, you get:

- ✨ A beautiful, distraction-free learning environment
- 🎯 A tutor persona named TARS guiding you through concepts
- 📊 Interactive Minkowski diagrams you can manipulate
- 🎮 Live calculations showing relativistic effects
- 🧠 Focus on *understanding*, not equations
- 🧩 Workspace-packaged agent customizations that make VS Code feel like a compact learning hub

**You don't write code. You learn physics.**

## Quick Start

### 1. Open in VS Code
```bash
code lesson-minkowski-space
```

### 2. Start the Interactive Lesson
- Press `Cmd+Shift+B` (or `Ctrl+Shift+B` on Linux/Windows)
- Select **"🚀 Start Interactive Lesson"**
- VS Code will open a browser tab with the interactive notebook

### 3. Talk to Your Tutor
Use the chat (bottom right in VS Code) to ask questions.
The tutor will guide you through visualizations and concepts.

## What You'll Learn

- **Part 1:** Why relativity? (Why light is special)
- **Part 2:** Spacetime geometry (Minkowski diagrams)
- **Part 3:** Time dilation (from geometry!)
- **Part 4:** Length contraction (also from geometry!)
- **Part 5:** Relativity of simultaneity (the deep insight)
- **Part 6:** The unified picture (4-vectors and invariant intervals)

## File Structure

```
lesson-minkowski-space/
├── .github/
│   ├── agents/             # Tutor and notebook-editing custom agents
│   ├── hooks/              # Runtime behavior guardrails
│   ├── instructions/       # Always-on learning-hub instructions
│   ├── scripts/            # Hook helper scripts
│   └── skills/             # Reusable lesson orchestration workflows
├── .vscode/
│   ├── settings.json        # Hides the "code editor" UI
│   ├── extensions.json      # Recommended extensions
│   └── tasks.json           # Keyboard shortcuts for lessons
├── .instructions.md         # Legacy tutor reference notes
├── .prompt.md               # Legacy tutor prompt notes
├── SKILL.md                 # Legacy teaching notes
├── lesson-content/
│   └── minkowski-space.py   # Interactive marimo notebook
├── copilot-instructions.md  # Workspace-wide routing into the learning hub
└── README.md                # This file
```

## Agent-Customization Architecture

This workspace now uses the same primitives described in the VS Code agent customization docs, but applies them to teaching instead of software delivery:

- **Custom instructions** define the default learning-hub behavior.
- **Custom agents** separate tutoring from notebook maintenance.
- **Skills** package repeatable teaching workflows.
- **Hooks** reinforce the non-destructive, tutor-first runtime behavior.

The result is a repo that behaves more like a small educational product than a normal source tree.

## How It Works

1. **VS Code is the shell** - Chat, markdown preview, and embedded web views create the lesson surface
2. **marimo is the engine** - Behind the scenes, it runs interactive visualizations
3. **Custom agents provide roles** - Tutoring and notebook maintenance are separated deliberately
4. **Hooks and instructions shape behavior** - The workspace keeps the interaction student-first
5. **You discover concepts** - By visualizing first, then understanding equations

## Requirements

- VS Code with the Copilot Chat extension
- Python 3.9+
- `uv` package manager (or `pip`)
- marimo (`uv run marimo edit ...` will install if needed)

## Starting Over

If the notebook gets messy, restart:
- **VS Code:** Press `Cmd+Shift+B`, select "🔄 Restart Kernel"
- Or just reload the browser tab

## Customizing for Your Own Lessons

This is a **template**. To create a new lesson:

1. Duplicate this folder: `cp -r lesson-minkowski-space lesson-my-topic`
2. Update `.github/instructions/` with your lesson behavior and tone
3. Update `.github/agents/` if you want different tutor or editing roles
4. Update `.github/skills/lesson-hub/` with your teaching workflow and references
5. Replace `lesson-content/minkowski-space.py` with your lesson content
6. Commit and share!

## Advanced: Running Without VS Code

If you want to just run the interactive notebook:

```bash
cd lesson-minkowski-space
uv run marimo edit lesson-content/minkowski-space.py
```

Then open `http://localhost:2718` in your browser.

## Credits

- **Framework:** marimo for interactive notebooks
- **UI:** VS Code with custom configuration and agent customizations
- **Tutor:** Copilot Chat, packaged as a workspace tutor
- **Physics:** Einstein's geometric insight into spacetime

---

**Remember:** The math is just notation for the geometry. Master the geometry, and the math becomes obvious. 🌌

