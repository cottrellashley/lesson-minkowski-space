# Host the static General Relativity lessons

The static lessons use plain HTML, CSS, and JavaScript. No build step, npm install, marimo, or Python packages are required. Python 3 is only used below as a convenient local web server.

## Clone and run

```sh
git clone https://github.com/cottrellashley/lesson-minkowski-space.git
cd lesson-minkowski-space
python3 -m http.server 8000 --bind 127.0.0.1 --directory lesson-content/apps
```

On Windows, use `py -3` in place of `python3` if necessary. Keep the server running and open:

- Main immersive lesson: http://127.0.0.1:8000/immersive-gr-story/
- Manifold sequence: http://127.0.0.1:8000/manifolds-00-index.html
- Manifold Layer Lab: http://127.0.0.1:8000/

The root index is the Manifold Layer Lab; the immersive GR lesson is in its own subdirectory. The standalone galaxy simulation is outside this serving directory at `lesson-content/galaxy-collision.html`.

The immersive lesson is self-contained. The other manifold pages request optional Google Fonts; fallback fonts are available. The Python notebooks and reference PDFs remain in the repository but are not needed to run the static lessons.

## Static hosting

For a static hosting service, use `lesson-content/apps` as the publish directory with no build command. The immersive lesson will be at `/immersive-gr-story/`. To host only that lesson at the site root, publish `lesson-content/apps/immersive-gr-story` instead. Preserve filenames and relative paths. Use a persistent static host for a public deployment; the Python command above is for local preview.

## Prompt for an agent on another computer

Clone https://github.com/cottrellashley/lesson-minkowski-space.git and check out the latest main branch. If a checkout already exists, inspect its status and preserve local changes before updating it. Read HOSTING.md. Run the existing static General Relativity lesson without rewriting it or introducing a framework. Serve lesson-content/apps using Python 3's HTTP server bound to 127.0.0.1 on port 8000 (or another available port). Open /immersive-gr-story/ in the browser, verify the canvas renders, the Begin/next controls advance the lesson, and the coordinate/frame sliders work when revealed. Also verify /manifolds-00-index.html and the root Manifold Layer Lab load. Keep the server running and give me the exact URL and stop command. If this environment already has a configured deployment target and I am requesting a public hosted URL, deploy these static files there with no build step and verify the resulting URL; otherwise get the local version running first and ask which public hosting target to use. Do not publish the whole repository as the website: use lesson-content/apps (or its immersive-gr-story subfolder for an immersive-only site).
