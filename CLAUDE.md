# Repository conventions

This repo is a playground for testing new models on animation, real-time music videos and
web design. Every piece of work follows the same shape:

- **One project = one top-level folder, named after its content** (lowercase, ASCII,
  hyphenated, e.g. `kaminare-pv/` for the カミナレ music video). Never put project files in
  the repo root.
- Each folder is **self-contained**: an `index.html` entry point, relative paths only, every
  asset (audio, fonts, images, video, generated data) saved inside the folder. It must run
  from `file://` and from any static host with no network access. Classic `<script>` bundles
  rather than ES modules, and no `fetch()` of local files, so it works on `file://`.
- Readable source lives in the project's `src/`, build/analysis scripts in `tools/`, and a
  `README.md` explains what it is and how to rebuild. `node_modules/` is never committed.
- Animation/video work is delivered as a real-time web page, not a rendered video file.
- Add a row for every new project to the table in the root `README.md`.
- **Every new project starts from a blank slate.** Do not open, read or reuse the existing
  projects' code, scripts, assets or notes (including their READMEs and the root `README.md`
  table) to guide a new one, so each test shows what the model does on its own. Look at earlier
  work only when the user asks for it, or when the task actually needs it (for example, editing
  or extending that project). Adding the new row to the root `README.md` table is the one
  exception.
