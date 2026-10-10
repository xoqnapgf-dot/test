# Research and visual-design notes

These notes accompany the six-world catalogue in [`src/data.js`](src/data.js). **Research cutoff: 2026-10-10; source review: 2026-10-11.** Provider documentation is a dated snapshot, not an assertion that every user, region, model endpoint, plan, or tool has the same access. The page ranks no one and displays no benchmark scores.

## How the model notes were selected

1. I started from the six requested representative families—GPT, Claude, Gemini, DeepSeek, Qwen, and GLM—and checked the current named model cards, API references, and launch/release notes linked below. Provider primary sources anchor product and model capabilities; independent reporting and a bounded survey/traffic source are used only for their specific context.
2. I separated **model** capability from **product**, **tool**, **API workflow**, and **deployment** claims. For example: OpenAI's voice model is a separate GPT-Live branch; Gemini Robotics-ER 1.6 is a distinct embodied/spatial branch; Qwen's draft Omni announcement is not evidence that every Qwen endpoint accepts video; GLM-5.3-Flash is not the text-only GLM-5.3 endpoint.
3. Where a fact was unusually consequential, easy to overgeneralize, disputed, or time-sensitive, I checked an additional source or the primary model card/license. This is not an independent replication of vendor model evaluations, and not every product feature has a second-source corroboration. If a source is a vendor claim or a draft announcement, it is labeled as such.
4. I summarized capabilities as nine non-exclusive, illustrative phrases per family in `src/data.js`. The short entries are not a complete product matrix, guaranteed behavior, controlled comparison, or all-models claim. They intentionally mix model and tool/workflow examples, with the boundary called out where that matters. The face order, motion tempo, palette, and art themes have no relation to quality or popularity.
5. The catalogue has no performance scores. Benchmark results across companies are not interchangeable without checking task version, data split, prompt, tool access, scoring harness, inference budget, and publication status. Vendor results stay vendor-reported unless independently replicated.

## The six snapshots and their source boundaries

### GPT — OpenAI

- [GPT-6 Astra model/API page](https://developers.openai.com/api/docs/models/gpt-6-astra), [GPT-6.1 Sol model/API page](https://developers.openai.com/api/docs/models/gpt-6.1-sol), and [Using GPT-6](https://developers.openai.com/api/docs/guides/latest-model), checked 2026-10-10. These identify current text-and-image API model variants and their published reasoning, coding, context, and tool details. **The pages list text/image input; they are not evidence of audio or video input for those variants.**
- [Introducing GPT-Live](https://openai.com/index/introducing-gpt-live/), a separate voice-model branch. It supports the *Low-latency voice* note, not a claim that GPT-6.1 Sol itself is an audio model.
- The tool/workflow phrases link to distinct API features: [computer use](https://developers.openai.com/api/docs/guides/tools-computer-use), [web search](https://developers.openai.com/api/docs/guides/tools-web-search), [structured outputs](https://developers.openai.com/api/docs/guides/structured-outputs), and [multi-agent orchestration](https://developers.openai.com/api/docs/guides/responses-multi-agent). Computer interaction requires an application/tool loop; web search and parallel delegation are enabled by API request/tool configuration, and multi-agent is documented as a beta. These are not silent default properties of every model response.
- [Conversation compaction guide](https://developers.openai.com/api/docs/guides/compaction), checked 2026-10-10. It describes an API technique for carrying task-relevant state through a reduced context. This is the basis for *Long-run continuity*; compaction is not persistent cross-session memory.
- The phrases (*Deliberate reasoning*, *Image–text synthesis*, *Repository-scale coding*, *Computer use*, *Parallel delegation*, *Grounded web research*, and *Structured contracts*) are shorthand for capabilities documented across the named API models and their tools/workflows, not a promise that each feature is enabled on every endpoint or consumer plan. Surface availability can differ.
- **What that means in the cube:** nine distinct illustrated topics for the GPT family. The voice cell is explicitly attributed to the separate GPT-Live branch; the rest are not silently extended to it.

### Claude — Anthropic

- [Claude model overview](https://docs.anthropic.com/en/docs/about-claude/models/overview), [context-window guide](https://docs.anthropic.com/en/docs/build-with-claude/context-windows), and [platform release notes](https://docs.anthropic.com/en/release-notes/overview), checked 2026-10-10. These are the source for the dated Claude 5.5 family snapshot, model-specific context and thinking controls, and current API boundaries.
- [Computer-use tool documentation](https://docs.anthropic.com/en/docs/agents-and-tools/tool-use/computer-use-tool) supports *Desktop interaction* as a tool-mediated capability, not a claim that the model autonomously controls a user's desktop without an integration.
- [MCP connector documentation](https://docs.anthropic.com/en/docs/agents-and-tools/mcp-connector) supports *Tool interoperability*. The MCP connector is a platform integration; a model does not acquire a user's connected services by default.
- Anthropic's product [Claude app release notes](https://docs.anthropic.com/en/release-notes/claude-apps) describe app features such as Artifacts. *Artifacts and prototypes* is therefore a product/workflow example, not a model-only capability guaranteed by the API.
- [Constitutional AI: Harmlessness from AI Feedback](https://www.anthropic.com/research/constitutional-ai-harmlessness-from-ai-feedback) is the methodological source for *Constitutional steering*. It documents a research approach; it does **not** establish that the undisclosed training recipe of every Claude 5.5 variant is unchanged or reducible to that paper.
- **What that means in the cube:** extended thinking, codebase work, visual computer-use, long documents, editing, app artifacts, MCP/tool connections, safety steering, and evidence synthesis are illustrative capability areas, not nine mutually exclusive model benchmarks.

### Gemini — Google / Google DeepMind

- [Gemini 4 Argon announcement](https://blog.google/innovation-and-ai/models-and-research/gemini-models/gemini-4-argon/), checked against its announcement on 2026-10-10. Google reports a one-million-token **output** window and a limited launch for trusted cyber defenders. Accordingly, the cell says *output window* and identifies the restricted launch; it should not be read as general availability for every Gemini user.
- [Gemini 3.8 Live announcement](https://blog.google/innovation-and-ai/models-and-research/gemini-models/gemini-3-8-live-gemini-3-8-live-extended-thinking/) and [Live Avatar announcement](https://blog.google/innovation-and-ai/models-and-research/gemini-models/gemini-3-8-live-with-live-avatar/), checked 2026-10-10. These support examples of separate live speech/visual product branches. The live interaction cells are not assigned wholesale to every Gemini endpoint.
- [Gemini Robotics-ER 1.6](https://deepmind.google/blog/gemini-robotics-er-1-6/), announced 2026-04-14, describes a distinct embodied-reasoning/robotics branch and spatial-understanding claims. The *Spatial scene reading* cell names that branch explicitly; it must **not** be generalized to the ordinary Gemini chat/API endpoint.
- The current Gemini app, API, search, and connected-app surfaces have different tools and availability. *Source-grounded discovery*, *Connected-app actions*, and *Visual creation and edit* refer to specific product/service workflows, not universal behavior of every Gemini model.
- For the historical gag only, Google's [May 2024 AI Overviews update](https://blog.google/products-and-platforms/products/search/ai-overviews-update-may-2024/) acknowledges odd or inaccurate Search AI Overview results, including the widely discussed glue-on-pizza answer, and describes subsequent changes. That episode belongs to **Search AI Overviews in 2024**, not a current-model evaluation or a verdict on Gemini as a family.
- **What that means in the cube:** multimodal input, very long context, deliberate modes, grounded search, live speech, coding, connected services, spatial understanding, and image creation are examples tied to their own named model/product branches where necessary.

### DeepSeek

- The [DeepSeek V4.1-Flash model card](https://huggingface.co/deepseek-ai/DeepSeek-V4.1-Flash) and [DeepSeek API documentation](https://api-docs.deepseek.com/) were checked 2026-10-10. The model card describes a large mixture-of-experts model, a one-million-token context, and **image and text** input. Its listed input modalities do not include video, so `Visual token understanding` says image/text and does not claim video support.
- The model-specific [license file](https://huggingface.co/deepseek-ai/DeepSeek-V4.1-Flash/blob/main/LICENSE) and [Hugging Face API metadata](https://huggingface.co/api/models/deepseek-ai/DeepSeek-V4.1-Flash) report public, ungated, MIT-licensed weights. This verifies the license for this model repository, not a blanket license for every DeepSeek asset or hosted service.
- *Thinking / direct mode*, *Mathematical problem solving*, *Code-generation efficiency*, and the throughput claims are descriptive summaries of vendor-published modes and evaluation material. The model card presents results under specified, sometimes different, inference settings; I did not convert those results into a cross-provider score or an independently verified speed claim.
- *Sparse expert routing* and *Compact inference memory* refer to the model-card architecture/cache descriptions. *Tool-directed execution* depends on the serving API and caller-provided tools; it is not a tool-using property of the raw weights alone.
- **What that means in the cube:** one Flash model card, its API, and its license inform the snapshot. The project does not claim all DeepSeek models have the Flash model's modalities, license, architecture, or release status.

### Qwen — Alibaba Qwen Team

- The Qwen team's [Qwen3.8-Flash-Next release post](https://qwen.ai/blog?id=qwen3.8-flash-next), dated 2026-08-26, distinguishes downloadable open weights from the hosted Qwen3.8-Flash service. The terms *Local open-weight use* and *Context extension* do not imply the API and the open checkpoint are identical deployments.
- The [Qwen3.8-Omni-Flash announcement](https://qwen.ai/blog?id=qwen3.8-omni-flash), dated 2026-09-18, describes text, image, audio, and video input and a one-million-token context. **The page was marked `[draft]` when reviewed.** Treat these modality/context details as provisional vendor material, not independently verified, general Qwen guarantees.
- The other cells—multilingual translation, document/chart reading, speech alignment, audio/video, agentic coding, MCP/tool calls, long context, and long-running office work—are examples assembled from this separately versioned model/product family. The Omni post is not used as proof that Flash-Next or every Qwen service has identical multimodal I/O.
- **What that means in the cube:** the label is *Qwen 3.8 family*, not a single model spec. Draft status and the open-weights/API distinction are retained in the notes rather than flattened into a family-wide promise.

### GLM — Z.ai

- Z.ai's [GLM-5.3-Flash VLM documentation](https://docs.z.ai/guides/vlm/glm-5.3-flash) lists text, image, video, and file input, text output, a one-million-token context, and tool/function calling. The [model launch/capability post](https://autoclaw.z.ai/blog/model/glm-5.3-flash/) distinguishes GLM-5.3-Flash from the text-only GLM-5.3 line and describes public weights and deployment paths. Both were checked 2026-10-10.
- *Cross-format perception*, *Office-file production*, and interface feedback are scoped to this Flash variant and the documented tool workflow. File input alone is not proof that every file format can be edited or exported by the base model without surrounding software.
- The attention, cache, long-horizon, terminal, and benchmark statements are provider descriptions, not a new evaluation performed for this project. Published benchmark results have not been copied into the cube or normalized against other providers.
- **What that means in the cube:** the caption names `GLM-5.3-Flash`, not GLM as an undifferentiated family, and its modality/tool details remain scoped to the cited product variant.

## Popularity and benchmark caveats

- [Pew Research Center's 2026 U.S. adult survey](https://www.pewresearch.org/internet/2026/06/17/americans-and-ai-2026-chatbots-smart-devices-and-views-on-impact/) surveyed 5,119 U.S. adults on 2026-02-17–23. Its self-reported ever-use figures include ChatGPT (44%), Gemini (24%), and Claude (6%). They are **U.S. population survey measures**, not global adoption, API token share, current weekly use, or capability/quality scores; this survey does not put DeepSeek, Qwen, and GLM on the same six-brand basis. Those percentages do not determine the cube's order.
- [OpenRouter rankings](https://openrouter.ai/rankings) expose activity routed through one platform; the checked display included traffic through 2026-10-09. That is useful platform-specific traffic context, **not** population-level adoption, all-provider inference volume, or model quality. Provider routing, aliases, and user mix affect the numbers.
- No benchmark leaderboard is reproduced in the project. Each vendor's benchmark post may use a different model variant, harness, tool budget, prompt, test split, sampling setting, or context length. Directly comparing isolated scores without those controls would imply more certainty than the sources warrant.

## Disputed and historical context behind three tiny route details

- **GPT–Claude marketing handoff:** Reuters' [2026-02-07 report](https://www.reuters.com/business/media-telecom/anthropic-buys-super-bowl-ads-slap-openai-selling-ads-chatgpt-2026-02-07/) covers Anthropic's Super Bowl campaign and the public exchange with OpenAI. Anthropic's own [ad-free Claude statement](https://www.anthropic.com/news/claude-is-a-space-to-think) records its product-policy position. This is a public marketing disagreement/rivalry, not evidence of a personal feud.
- **Distillation shard:** Reuters' [2026-02-12 report](https://www.reuters.com/technology/artificial-intelligence/openai-accuses-deepseek-distilling-us-models-2026-02-12/) covers OpenAI's allegations about DeepSeek. Anthropic's [2026-02-23 account of alleged distillation attacks](https://www.anthropic.com/news/detecting-and-preventing-distillation-attacks) describes Anthropic's own claims. These are attributed company allegations and reporting—not an independently established finding about DeepSeek. Distillation itself is a legitimate, widely used training technique; the dispute is about alleged unauthorized extraction or policy violations. The in-scene mirror depicts the public debate, not a factual verdict.
- **Blue plate:** Google's [2024 AI Overviews update](https://blog.google/products-and-platforms/products/search/ai-overviews-update-may-2024/) is historical Search-product context. It is not a statement about current Gemini model quality, and the scene's prop is explicitly sealed and inedible.

## Visual and shader references: what was learned, used, and not copied

The scene's geometry, layout, animation, palettes, iconography, and shaders are original project work. The references below informed techniques; **their example scenes, complete shader bodies, artwork, textures, camera layouts, and prose were not copied.** Code-level dependencies are separately identified under [Third-party code and licenses](#third-party-code-and-licenses).

### Three.js `InstancedMesh` and examples

- Three.js [`InstancedMesh` documentation](https://threejs.org/docs/pages/InstancedMesh.html), version `0.186.1`: an instance is a transform of shared geometry/material; after editing per-instance transforms with `setMatrixAt`, flag `instanceMatrix.needsUpdate = true` so the changed buffer is uploaded.
  - **Used here:** `src/worlds.js` updates the small world-dust field using `setMatrixAt` and sets `instanceMatrix.needsUpdate` after the per-frame loop. `src/cube.js` does the same for one animated mote per capability sticker. This is also why tests count actual renderer calls rather than drawing 54 separate decorative mote meshes.
  - **Not copied:** no Three.js demo scene, camera, controls, geometry, color scheme, or full source file.
- Three.js's [dynamic instancing example](https://threejs.org/examples/webgl_instancing_dynamic.html) and its [source](https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/webgl_instancing_dynamic.html) show a changing instance matrix buffer and the update step.
  - **Learned:** instance data is mutable, but the GPU-facing attribute must be marked dirty after edits; update bounds when your own changing-instance geometry requires it.
  - **Used here:** the same matrix-upload pattern, applied to the project's orbiting dust and sticker motes. The local implementation owns each orbit, phase, transform, and buffer update.
  - **Not copied:** the example's mesh arrangement, animation, scene, exact code, or dynamic-performance measurements. The raw link tracks Three.js `dev`; compare against the installed `0.186.1` documentation for version-specific changes.
- Three.js's [instancing performance example](https://threejs.org/examples/webgl_instancing_performance.html) informed the choice to share geometry/material for repeated small objects.
  - **Learned and used:** batch repeated orbiting particles as `InstancedMesh`; the six worlds remain separate because they need different materials and behavior.
  - **Not copied:** the demo's object set, benchmark setup, exact optimizations, or performance claims. The project's draw-call assertion is a functional smoke bound, not a benchmark.
- Three.js's [shader lava example](https://threejs.org/examples/webgl_shader_lava.html) was inspected as a reference for time-driven shader uniforms and UV-space motion.
  - **Learned and used:** pass elapsed time and per-world parameters through uniforms to a small custom animated fragment shader (`src/worlds.js` halo; `src/textures.js` glyph/ring accents).
  - **Not copied:** the lava texture, noise construction, surface look, example shader body, or scene. No post-processing/bloom pass or downloaded texture is used.

### The Book of Shaders

- [Chapter 05 — Shaping functions](https://thebookofshaders.com/05/) explains remapping a normalized input and composing smooth transition functions.
  - **Learned:** shape a threshold with an explicit interval rather than a hard on/off edge.
  - **Used here:** concentric halo/ring masks in `src/worlds.js` and `src/textures.js`; the local transition and tuning are chosen for this dark, low-contrast scene.
  - **Not copied:** chapter examples, figures, color treatments, or complete GLSL programs.
- [Chapter 11 — Noise](https://thebookofshaders.com/11/) develops value-noise interpolation over a lattice.
  - **Learned:** hash neighboring lattice values, interpolate smoothly in each coordinate, and use the result as a continuous field rather than uncorrelated per-vertex randomness.
  - **Used here:** the CPU-side `hash2`/`valueNoise` pair in `src/worlds.js` builds deterministically seeded terrain variation for each island.
  - **Not copied:** shader listing, hashes, constants, or sample terrain.
- [Chapter 13 — fBm](https://thebookofshaders.com/13/) layers noise at multiple frequencies and amplitudes.
  - **Learned:** combine a few broad and fine octaves to provide structure at more than one scale.
  - **Used here:** `fbm` in `src/worlds.js` sums four seeded value-noise octaves, increasing frequency and reducing amplitude; separate broad/fine samples shape each island's rim and relief.
  - **Not copied:** the chapter's fBm shader, exact octave recipe, visual example, or animation. The chosen four-octave CPU formulation and constants are project-specific.
- The [smoothstep glossary entry](https://thebookofshaders.com/glossary/?search=smoothstep) was checked alongside the specification reference below.
  - **Learned:** the cubic Hermite transition is defined for ascending edges; reversing the bounds is not a supported way to invert the result.
  - **Used here:** halo masks use ordered edges and invert the result explicitly (`1.0 - smoothstep(0.78, 1.02, radius)`). A reversed-edge halo expression found during review was corrected.
  - **Not copied:** glossary code or an external shader. The equation is the GLSL built-in's standard definition.

### GLSL standard reference

- Khronos' official [GLSL `smoothstep` reference page](https://registry.khronos.org/OpenGL-Refpages/gl4/html/smoothstep.xhtml) describes Hermite interpolation and says results are undefined when `edge0 >= edge1`; the [GLSL 4.60 specification](https://registry.khronos.org/OpenGL/specs/gl/GLSLangSpec.4.60.pdf) is the formal language reference.
  - **Learned and used:** keep shader edge order increasing; when a mask must run inward-to-outward in reverse, complement its value instead of swapping edge bounds. This directly informed the corrected halo expression in `src/worlds.js`.
  - **Not copied:** Khronos' reference-page or specification text, sample program, or graphics assets. The cited reference validates the built-in's rule; the bespoke halo remains original.

## Third-party code and licenses

- **Three.js `0.186.1`** is the only runtime dependency installed from npm. Its preserved MIT notice is [`vendor/three/LICENSE`](vendor/three/LICENSE). The final local bundle includes Three.js code; keep the notice with redistributed source/builds.
- **cubejs solver code** is vendored in [`vendor/cubejs/`](vendor/cubejs/) and its preserved MIT notice is [`vendor/cubejs/LICENSE`](vendor/cubejs/LICENSE). It runs locally inside the inlined solver worker. No external solving API is called.
- Vite, Playwright Core, and the bundled Chromium package are development/test tools, not runtime requests made by the page.
- The repository does not assign this project a new project-level license. Retain the two third-party notices; do not infer a broader license grant from them.
