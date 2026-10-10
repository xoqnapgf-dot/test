# AI Orbit Cube

**Six worlds, one turning field.** A quiet, local-first 3D Rubik’s cube: 27 turning cubies carry 54 individually named capability cells, while six small procedural worlds continue to evolve around them. Turning a layer migrates the cells into different worlds; terrain, halos, route couriers, and residents visibly adapt to the new mixture.

This is a visual field guide—not a leaderboard, benchmark, endorsement, or claim that one model family is uniformly better. The six families are GPT, Claude, Gemini, DeepSeek, Qwen, and GLM. Each has nine distinct, source-linked capability notes in [`src/data.js`](src/data.js); the six themes and face layout are art direction, not capability scores. The snapshot cutoff is **2026-10-10**. Research caveats, dated sources, visual-reference notes, and a concrete account of what was learned, used, and not copied are in [`SOURCES.md`](SOURCES.md).

## Open it

### Run directly from disk (offline)

Open [`index.html`](index.html) in a recent desktop or mobile browser. The checked-in `standalone/orbit-cube.js` is a classic, bundled script, its stylesheet is local, and the exact-state solver is an inlined Blob worker. No server, account, API key, CDN, or network connection is needed for the scene. Keep the adjacent `standalone/` folder in place when copying the project.

The source of truth is the readable code under `src/`. After editing it, rebuild the generated bundle before opening the page. Build/test tooling needs Node.js **20.19+ or 22.12+** (Vite 8); no Node runtime is needed to open the already-built page.

```sh
npm ci                 # only needed for development, building, or tests
npm run build:standalone
```

### Develop or host it

```sh
cd ai-orbit-cube
npm ci
npm run dev             # rebuilds the standalone bundle, then serves on :5173
```

The page and every runtime dependency are local. For a deployable static folder:

```sh
npm run build           # writes dist/ (page, bundle, and both documents)
npm run preview         # serves dist/ on :4173
```

Upload the **contents of `dist/`** to any static host, including beneath a URL prefix; all runtime paths are relative. There is no application server or runtime network dependency. Because the inlined solver runs from a Blob URL, a restrictive host Content Security Policy should permit `worker-src 'self' blob:`. WebGL 2 is required; enable browser graphics acceleration if the fallback message appears.

No remote fonts, images, or audio are loaded. The visible 3D scene is drawn with Three.js, bespoke canvas glyphs, and project-authored shaders. The page does not transmit turns, model names, or analytics.

## Controls

| Input | Action |
| --- | --- |
| Drag directly across a sticker | Turn the layer containing that sticker. A straight, sufficiently long drag chooses the turn direction; the sticker’s row or column determines the slice. |
| Drag empty space | Orbit the camera independently of the cube. |
| Right-drag, middle-drag, or Shift-drag | Orbit even when the gesture starts on a sticker. |
| Mouse wheel / two-finger pinch | Zoom the camera. |
| Double-click / `Escape` | Reset the camera. |
| `U R F D L B M E S` | Turn a face or middle slice. `Shift` + a turn key reverses it; `Alt` + a turn key makes a half-turn. |
| `X Y Z` | Rotate the whole cube. Shift and Alt work here too. |
| `?` or the small corner `?` | Open the field guide and the only gameplay overlay. |

Touches follow the same sticker-versus-empty-space distinction. The field guide contains the full capability catalogue, move notes, a short reversible shuffle, camera reset, and an exact-state restore action. It stays closed during ordinary play.

## What happens in the scene

- **54 distinct cells:** six faces by nine positions, one unique short name, Chinese gloss, glyph, and longer description per cell. Glyphs are generated locally; no image/font files are downloaded.
- **27 physical cubies:** regular face turns, middle-slice turns, and whole-cube rotations use real 3D geometry and a discrete state model. The layer is animated first, then the exact facelet state is committed.
- **Six separate worlds:** each has its own palette, procedural noise terrain, small landmark, residents, halo, and orbiting dust. Animated routes join neighboring worlds. A migrated cell affects face composition; terrain tint, rim strength, resident mix, and the family-colored signal shift continuously, while arrivals pulse the destination.
- **A quiet idle loop:** after 72 seconds of inactivity the cube makes a 10-move scramble, rests for 17 seconds, then reverses the exact saved move list. Reduced-motion preference disables this automatic shuffle and slows the remaining animation. Opening the guide also pauses idle motion. A direct user move during a shuffle cancels the remaining scramble, restores its exact starting state, then applies the user’s move once; an already-running restoration is allowed to finish first.
- **A deliberate short demo:** the guide’s “Take a short shuffle” makes a 12-move scramble, pauses briefly, and returns to the state it started from. It is not a reset and does not overwrite a mixed state.
- **An exact local solver:** the guide’s restore button uses the vendored cubejs solver in a Web Worker, verifies the canonical facelet result and captured orientation, and animates the return. It runs on-device and does not contact an API.
- **Only corner help during play:** the decorative worlds have no HUD, score, labels, or persistent instructions. The accessible guide opens only when requested. Completed-turn announcements use a visually hidden live region; the solver's live status is visible in the guide.

Three tiny optional details are explained in the guide: a neutral 2026 GPT–Claude marketing handoff; a mirrored shard for the *alleged* distillation dispute; and a safely sealed, non-edible nod to the 2024 Google Search AI Overviews “glue on pizza” incident. None is intended as a claim about present model behavior, a personal feud, or established misconduct.

## Checks

```sh
npm run test:unit     # state, notation, catalog, and exact-restoration tests
npm run test:e2e      # headless Chromium: WebGL scene, controls, solver, automation, file:// entry
npm run check         # unit suite, standalone/static build, then browser suite
```

**Last verified locally on 2026-10-11:** `npm run check` passed all 6 logic tests and 9 Chromium browser tests; the build produced the static `dist/` site and included both third-party notices. The browser run exercised WebGL 2, the offline `file://` entry and Blob solver, pointer/keyboard/touch paths, exact solver return, and the idle-shuffle cancellation/restore path. I also opened the production preview at `http://localhost:4173/` in headless Chromium at 1365 × 900 and 390 × 844: the scene rendered 27 cubies, 54 stickers, six worlds and six routes, with 324 draw calls, no page errors, and no external requests. This is a functional/smoke check—not a GPU performance benchmark, a screen-reader certification, or testing on a physical phone.

## Project layout and notices

- `index.html` — offline/static entry point, using only relative file paths.
- `src/` — readable cube model, interaction, procedural worlds, shader textures, catalog, and solver client.
- `standalone/` — generated IIFE bundle and CSS for `file://`, local preview, and static hosting. Rebuild with `npm run build:standalone` after source changes.
- `tests/` — Node logic tests and headless Chromium integration tests.
- `vendor/cubejs/` and `vendor/three/` — preserved MIT notices. Three.js `0.186.1` is the only npm runtime dependency; cubejs solver code is vendored and bundled into the local worker. Test/build tools are development-only.
- `dist/vendor/` — the build copies both third-party license files next to the standalone site so a static deployment carries its notices.

The repository does not add a project-level license declaration. Preserve the included third-party license files when redistributing the source or generated bundle.
