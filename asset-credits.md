# Asset credits

The world uses four selected, texture-free CC0 models. All other terrain, structures, plants, roots, rocks, props, original wildlife shapes and shaders are authored in BANORI source.

| Asset | Author / official source | License | Modifications | Use |
|---|---|---|---|---|
| Open detailed tent | [Kenney Nature Kit](https://kenney.nl/assets/nature-kit) | CC0 1.0 | Bounds-based grounding and scaling; canvas and wood palette; reused at three appropriate scales | Explorer camp |
| Animated deer | [Quaternius Ultimate Animated Animals](https://quaternius.com/packs/ultimateanimatedanimals.html) | CC0 1.0 | Retained Idle, Idle_2, Eating and Walk; removed unused buffers; packed GLB; normalized scale and flat rough materials | Pine grazing glade |
| Animated fox | [Quaternius Ultimate Animated Animals](https://quaternius.com/packs/ultimateanimatedanimals.html) | CC0 1.0 | Retained the same four ambient clips; removed unused buffers; packed GLB; normalized scale and materials | Ancient forest clearing |

Original license records accompany the assets in both source public assets and the compiled forest. Quaternius models were obtained from the public glTF folder linked by the official pack page. The original full archive and working downloads are excluded from the website.

## Verified payload

- structures/tent_detailedOpen.glb: 15324 bytes, 232 triangles, 0 textures.
- animals/deer.glb: 1152844 bytes, 2098 triangles, 0 textures.
- animals/fox.glb: 971188 bytes, 1848 triangles, 0 textures.

Rabbit, bird, butterfly, fish and frog meshes are original purpose-built silhouettes with anatomical cross-sections and articulated parts. They are not external models. The tower, bridges, hero roots, banana accent and guardian props are original geometry. The earlier wooden bridge and damaged column GLBs have been retired from the scene. Three.js Reflector/Refractor and software libraries retain their MIT notices; official Water2 was studied as a reference. No external environment scene or reference-project artwork is copied.

Selected runtime copyright/license records, including Three.js Reflector/Refractor, React and pmndrs packages, are preserved in `world-assets/Third-Party-Notices.txt` in both source and compiled output.

## Playable explorer

Man in Long Sleeves by Tomás Laulhé (Quaternius), from the [creator's Poly Pizza catalog](https://poly.pizza/m/DLptRuewTn) and [Animated Men Pack](https://poly.pizza/bundle/Animated-Men-Pack-DAC9SDgMQT), is licensed CC0 1.0. Retained and renamed Idle, Walk, Run and Jump; geometry and materials are unchanged. The renderer normalizes height to 1.7 world units. Runtime: 471,696 bytes, 1,970 triangles, five skinned meshes, no image textures. Source notice and SHA256 records accompany `characters/human-explorer.glb`. The first-person camera prop and hands are authored in project source.

## Kingdom chapter artwork

VBVK.svg and logodonsac.svg are supplied by the project owner. The kingdom battlefield preview (Assets/go_stage07_bg-1.webp) comes from the owner's [Vệ Binh Vương Quốc UI demo](https://github.com/riodangtien/game2d-ui-demo). It is used as a preview only; no new license claim is made for the original game artwork. The game description and instructions follow the repository README. The project button links to the repository because its GitHub Pages endpoint currently returns 404.

Local fonts: Space Grotesk and Barlow Condensed by their respective authors, distributed under the SIL Open Font License. License files are included in assets/fonts. Sources: https://github.com/google/fonts/tree/main/ofl/spacegrotesk and https://github.com/google/fonts/tree/main/ofl/barlowcondensed.

Navigation background: assets/thanhdieuhuong.svg supplied by the project owner, used as the illustrated sky navigation background.

Navigation sky v2: original background illustration generated with the built-in ImageGen tool for this project. Replaces the illustrated navigation background in the current UI.


## BANORI V2 official mascot representation

assets/banori-official-billboard.png is a rasterized derivative of the owner's unchanged 2home.svg, preserving its aspect ratio and artwork. The V2 Explorer renders this as a temporary billboard, without a rig or walking/jumping animation. The earlier CC0 human explorer remains archived in the asset collection but is not rendered as BANORI. Learning baskets, shape signs and measurement bridge miniatures are authored procedurally in project source.

## Current playable explorer restoration

At the owner's request, the original CC0 human-explorer.glb is again the playable explorer with Idle, Walk, Run and Jump clips. The BANORI billboard is retired from gameplay; official branding artwork remains on the website.

## Original forest wildlife expansion — 2026-10-15

Wolf, bear, wild boar, badger and squirrel geometry is authored in ForestAnimals.tsx, with custom anatomical hulls, face markings and procedural leg motion. The existing Quaternius deer is the style reference. A download from its pack was researched but unavailable due to the provider quota; no additional external model is shipped. Refinements to rabbit, frog, bird, butterfly and fish are also original project geometry.

## Ready-made model replacement — 2026-10-15

The earlier procedural wolf/bear/boar/badger/squirrel meshes were retired from the scene. Current models:

| Model | Author | Source | License |
|---|---|---|---|
| Wolf | Quaternius | https://poly.pizza/m/P1gU3Qkr9r | CC0 1.0 |
| Black bear | Poly by Google | https://poly.pizza/m/56ym_pyVnel | CC-BY 3.0 |
| Boar | Poly by Google | https://poly.pizza/m/57fSWum6F1P | CC-BY 3.0 |
| Badger | Poly by Google | https://poly.pizza/m/8k4cduyRhi4 | CC-BY 3.0 |
| Squirrel | Poly by Google | https://poly.pizza/m/794lutNHni- | CC-BY 3.0 |

Geometry and embedded textures retained. Display scale/orientation/grounding adjusted; rough non-metallic materials. Wolf has author-supplied skeletal animations; the other four are static models. License links and attribution are shipped in world-assets/animals/credits.html and FOREST-MODEL-LICENSES.md in source and compiled output.
