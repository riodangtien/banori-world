# Environment quality validation — 3 October 2026

Baseline: GitHub default branch `32257783ea9922161bc937f2a69ae13652dd28ea`. Source and public assets were backed up before the quality pass. The previous local checkout was left intact.

## Automated checks

- Strict TypeScript + Vite production build passed.
- **13 tests passed**, covering the original five map checks and eight quality checks: placement rejection; transformed model bounds grounding; all rendered terrain vertices matching the grounding field and upward normals; finite merged structure geometry and an embedded hero trunk; complete accepted scatter and dry bridge ends; ten-minute independent terrestrial behavior simulations; all aquatic loops staying in open water above the lake bed; and repeated snow/rain movement and respawning.
- `placement-validation.json` records **zero findings** for 287 trees, 190 dry rocks, 20 slope-resting logs, 32 stumps and four bank-to-bank bridges. Water rocks are separately checked for island/transform validity and excluded from bridge spans.
- `qa/final-runtime.json` records **zero invalid transforms**, no placement findings, and terrain contact for the rigged animals. Observed desktop overview: **60 FPS, 142 main-pass draw calls, 161,203 triangles**, 93 geometries and 15 textures. Reflection and refraction use two extra offscreen passes every six desktop frames / ten narrow-screen frames; main-pass figures do not include those passes.
- `qa/runtime-weather-checks.json` records advancing snow time and changed particle coordinates, rain as the sole active precipitation, and selection of snow resuming a previously paused scene. Explicit Pause intentionally stops animation. No React state changes occur per animation frame.
- Final browser logs have no new renderer errors or warnings. Earlier development errors from incompatible merged geometry and cloned render-target uniforms were fixed and the world reloaded before final QA.
- `git diff --check` passed. Obsolete bundles generated during this task were removed; tracked baseline bundles remain untouched.

## Visual inspection

Complete-island default, top, front, rear, left, right, low and high views were inspected. Close-ups cover the tower foundation, stairs, landing, braces and rails; all three open camp tents and guardian props; ancient trunk and terrain-entering roots; raised source pool, layered waterfall, splash and mist; river banks, bridge decks and ramps; pine grazing glade, rabbit meadow, autumn grove, hidden sanctuary, wetland and swimming fish. Night, autumn rain, winter snow, pause and resume were exercised. Saved individual images and contact sheets are in `qa/`.

Manual findings fixed after initial implementation included a sign/pine overlap, the waterfall being hidden by a sloped cliff, the main trail entering the hero root footprint, redundant nearby crossings, an oversized top-view crop and overly strong water highlights. The final default composition exposes forest, river, guardian tree and lookout.

Integrated website was checked at desktop 1280 × 720 and an **actual DOM-confirmed 390 × 844** narrow viewport. Scroll width stayed 390; controls and title do not overlap, the whole island fits, and original brand navigation and WATERY content remain. The temporary viewport override was reset.

## Practical limits

FPS is an observation on this desktop browser, including a narrow viewport test; it is not certification of every integrated GPU, physical phone or Safari. Footprint/bounds checks are conservative broad-phase validation, complemented by manual inspection; they are not a general arbitrary-mesh triangle intersection solver. Structural joints, roots entering soil and embedded rocks are intentional contacts. Vite retains its Three.js vendor-size warning (about 704 KB raw / 181 KB gzip). No new remote runtime asset dependencies or texture packs were added.

Changes and the compiled `forest` build are local and reviewable. No commit, push, PR or GitHub Pages publication was performed.

## Reproduce

From `world-src`: `npm ci`, `npm test`, `npm run build`. Serve the repository root with a static HTTP server and open `/#world`. Build output uses relative paths for the existing GitHub Pages workflow.
