# 从一条射线到一片海 — a real-time shader film

A **96-second, nine-chapter film** rendered live in the browser, in which every pixel is
computed from scratch: **no 3D models, no textures, no video, no network**. Sea, mountains,
clouds and sunset are the output of fragment shaders — a height field, a sky integral, a
water surface and a volumetric cloud slab, all evaluated per pixel, per frame.

**Open `index.html`.** It runs from disk (`file://`) or from any static host; every path is
relative and nothing is loaded from the network. A WebGL2 browser is required.

```
shader-seascape-render/
├── index.html          entry point: canvases, HUD, captions, timeline, panel
├── src/
│   ├── gl.js           WebGL2 wrapper: programs, targets, textures, readback
│   ├── glsl/           the renderer, as shader source (loaded as classic <script> strings)
│   │   ├── common.js   hash / value noise / fBm / ridged noise / ACES / sRGB
│   │   ├── sky.js      Rayleigh + Mie single scattering, ozone, sun-disk transmittance
│   │   ├── bake.js     the two bake passes: 256×128 sky LUT, 64×32 sun transmittance
│   │   ├── terrain.js  16 km height tile: signed-distance march, neighbour-difference
│   │   │               normals, material masks, traced soft shadows, sky ambient
│   │   ├── clouds.js   128³ volume + 160 km weather map, sun-occlusion march, phase lobes
│   │   ├── water.js    wind-wave slopes, wave normals, depth absorption, foam, Fresnel
│   │   ├── scene.js    the ray marcher that combines them, plus debug views
│   │   ├── gen.js      terrain generation pass (fBm + ridged massifs + erosion, baked)
│   │   └── post.js     ACES tonemap, bloom pyramid, grade, vignette, grain, dither
│   ├── gen.js          CPU side of terrain generation (shaping, islands, coastline)
│   ├── renderer.js     pass orchestration, uniforms, auto-exposure, adaptive resolution
│   ├── camera.js       look-at basis
│   ├── timeline.js     the film: nine chapters, 36 word-timed cues, cards, camera spline
│   ├── captions.js     word-timed Chinese captions
│   ├── overlays.js     annotation cards, leader lines, chapter meter
│   ├── instruments.js  the instrument panels (atlas map, sky LUT, weather map, histogram,
│   │                   bloom pyramid level)
│   ├── mg.js           the motion-graphics layer: one canvas, nine per-chapter graphics
│   ├── audio.js        the soundtrack, synthesised with Web Audio from the renderer's state
│   ├── ui.js           transport, keyboard, panel, free-flight camera
│   └── main.js         boot, the device tier, quality handling, probe hooks, URL overrides
├── assets/
│   ├── style.css       layout, HUD, cards, panel, z-order
│   └── fonts/          four subset woff2 faces (OFL) + fonts.css
└── tools/              analysis and capture scripts (not needed to run the film)
```

## Controls

| | |
| --- | --- |
| `space` | play / pause the film |
| `←` `→` | seek 5 s |
| chapter buttons | jump to a chapter (the film's own step titles) |
| `C` | captions · `P` panel · `M` sound · `H` hide the interface · `F` fullscreen |
| drag on the picture | look around |
| `W A S D` `Q E` | free flight (`shift` = 3×) after anything in the picture is changed |

The film is a film, not a slideshow: the camera flies the whole 96 seconds along one closed
spline, every layer fades in **while** the chapter talks about it, and the graphics in the
middle of the frame are drawn from the renderer's own live state — the terrain silhouette
around the camera, the sky LUT's own column, the frame's own luminance histogram, the march's
own step list, the frame-time trace. Changing any control in the panel hands the camera over:
the picture stops and the drag/keys take over, with the ground and the sea as a hard floor.

## The nine steps, and where each one lives

| Chapter | Step | Implementation |
| --- | --- | --- |
| 01 射线 · 0–10.5 s | per-pixel camera ray, ground-plane intersection | `glsl/scene.js` (ray setup, plane hit for the sea) |
| 02 地形 · 10.5–21 s | fractal-noise terrain, distance-proportional march | `glsl/terrain.js`, `glsl/common.js`, `gen.js` |
| 03 光照 · 21–31.5 s | neighbour-difference normals, sun dot, material by slope/height, traced soft shadows, sky ambient | `glsl/terrain.js` |
| 04 大气 · 31.5–42 s | Rayleigh + Mie sky with ozone, haze on distant ridges | `glsl/sky.js`, `glsl/bake.js` |
| 05 海面 · 42–52.5 s | sea level flooding the valleys, wind-wave slopes, depth absorption, foam | `glsl/water.js` |
| 06 反射 · 52.5–63 s | Fresnel reflection of sky and mountains, sun specular glitter path | `glsl/water.js`, `glsl/scene.js` |
| 07 云 · 63–73.5 s | volumetric altocumulus, sun-occlusion sampling, three-lobe phase function, cloud shadows | `glsl/clouds.js`, `glsl/scene.js` |
| 08 合成 · 73.5–84 s | ACES tonemap, bloom pyramid, split-tone grade, vignette, grain | `glsl/post.js` |
| 09 实时 · 84–96 s | everything at once, adaptive resolution, frame-time trace | `renderer.js`, `instruments.js`, `mg.js` |

Reference points the implementation follows (all implemented from their published formulae,
not copied): the atmosphere is Bruneton-style single scattering with a transmittance LUT and
an ozone term; the terrain march uses distance-proportional steps with a linear refinement
(Inigo Quilez, *terrain marching*); the water's slope variance and whitecap fraction come from
Cox & Munk (1954) and Monahan & Ó Muircheartaigh (1980); absorption follows Pope & Fry (1997);
Fresnel is Schlick's approximation; the cloud phase function is a three-lobe Henyey-Greenstein
mix in the spirit of Kokhanovsky's cloud optics and Bart Wronski's volumetric notes; the
tonemap is the Narkowicz ACES fit with the Hill matrix pair.

## Numbers the page actually runs on

* 16 km terrain tile baked at 512² or 2048² (RGBA8, −1600 … 4200 m), with procedural
  far mountains beyond the tile; erosion is a thermal/fluvial pass with a resolved talus angle.
* 256×128 sky LUT and a 64×32 sun-transmittance LUT, both baked on the GPU.
* A 128³ cloud volume plus a 160 km weather map; up to 88 march steps with 6 sun-occlusion
  steps each; clouds 1900–3300 m.
* Auto-exposure from an 8×8 luminance readback, using a **trimmed mean** (25–88 % band) so a
  specular sun path cannot drag the frame to black.
* Adaptive internal resolution, decided from a *monotonic-clock* frame time: a GPU starts at
  1.00× and may fall to 0.45×, a device with no GPU starts at 0.30× and may fall to 0.18×. The
  controller's cooldown is time-based, not frame-based, so the slower the device the faster it
  stops being wrong.
* The soundtrack is synthesised in-page with Web Audio; its layers follow the renderer's own
  numbers (wind speed, wave amplitude, cloud cover, exposure, frame time).

## Tools

The film is verified by rendering it and looking at the frames, not by assertion. The scripts
in `tools/` are the harness (`node tools/*.mjs`, they need a headless Chromium; `_browser.mjs`
points at one):

| Tool | What it does |
| --- | --- |
| `film.mjs --t 5,16,… --out shots/x{t}.png` | render stamps of the film at a given quality/scale/resolution |
| `layout.mjs [stamps] [W] [H]` | every visible overlay box at each stamp, plus overlapping pairs |
| `mgtext.mjs [stamps] [W] [H]` | the motion-graphics canvas labels, measured, plus collisions |
| `domdump.mjs 5,16,…` | dump the live DOM geometry of cards and panels |
| `terrainmap.mjs 512` | the baked height field: table, statistics, and the flight's ground clearance |
| `filmaudit.mjs 2 1280 720` | caption timing, card/panel/leader visibility, and panel ink at every stamp |
| `defaultrun.mjs <url> 20,40,60` | the *visitor's* path: no query parameters, boot screen, adaptive resolution, wall-clock film; screenshots each stamp |
| `httpcheck.mjs <port> 5,26,…` | the same page over HTTP: status, MIME, fonts, and frames matched against the `file://` ones |
| `capdbg.mjs`, `entercheck.mjs`, `check.mjs`, `diag.mjs` | captions, boot order, uniform/GL sanity |
| `sheet.mjs`, `texpng.mjs`, `targetpng.mjs` | contact sheets and texture dumps for reading bakes by eye |
| `subset_fonts.py` | rebuilds the four subset woff2 faces from the full OFL fonts |

`tools/probe_*.mjs`, `axes.mjs` and `pageshot.mjs` are one-off scrapers from earlier
debugging; they are kept for reference but are not part of the pipeline.

## Fonts

Space Grotesk (Latin), JetBrains Mono (numerals, telemetry), Noto Sans SC and Noto Serif SC
(Chinese), subset to the glyphs the page uses — 324 kB in total, all SIL Open Font License
(`assets/fonts/OFL.txt`). They are served from `assets/fonts/`, never from a CDN.

## Honest status

* Every frame in this repository was rendered by this code and inspected as an image; the
  geometry audits above report zero overlapping overlay boxes and zero overlapping
  motion-graphics labels at 1280×720.
* The **soundtrack was checked as data** (levels, peaks, layer gains), not by ear — no audio
  output was available while building it.
* Performance depends on the machine. Before the renderer is built the page asks the driver
  what it is: a GPU gets the full 2048² terrain bake, a software rasteriser (SwiftShader,
  llvmpipe, a VM with no GPU) gets 768² and a low starting internal resolution, and the boot
  screen says so. Measured in this repository's own harness, where the only renderer is
  SwiftShader: 14 s for the first frame at 0.30× and about 8 s per frame after it — the film
  then plays slowly rather than freezing, which is the honest behaviour for a CPU rasteriser
  running a per-pixel ray marcher.
* The film's clock is wall time, so sound and picture stay together whatever the device does:
  the picture drops frames the way a video player does instead of crawling through the
  schedule, and the soundtrack's own swell rate is driven by the film's advance rather than by
  the render frame time.
