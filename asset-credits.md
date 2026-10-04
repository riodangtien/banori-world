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
