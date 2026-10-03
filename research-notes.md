# BANORI world research

Research completed 3 October 2026, before implementation. Repository baseline: `32257783ea9922161bc937f2a69ae13652dd28ea`. The published repository contains static landing pages and a compiled R3F forest, but no editable forest source. An earlier local source project is available; it is a starting point, not a claim to match the final compiled scene. Existing unpublished changes in the older checkout are preserved by working in a fresh clone.

## Technical references

| Reference and source | Verified license / classification | Technique studied | Useful BANORI application | Decision |
|---|---|---|---|---|
| [momentchan/r3f-procedural-grass](https://github.com/momentchan/r3f-procedural-grass) | MIT; SAFE WITH ATTRIBUTION if copied, also honor README author credit | TerrainMath.ts, grass vertex/compute shaders: FBM, height-derived normals, GPU deformation | Multi-scale terrain variation and cheap rooted grass wind | ADAPT TECHNIQUE with original code; reject full GPGPU physics complexity |
| [mesqme/infinite-terrain](https://github.com/mesqme/infinite-terrain) | MIT, copyright Misha Kiiatkin; SAFE WITH ATTRIBUTION if copied | Terrain.jsx, Grass.jsx: chunk ownership, seeded scatter, obstacle footprints, instanced blades | Precompute curve samples; reserve trails and landmark clearings; instance common foliage | ADAPT TECHNIQUE; reject infinite streaming for a finite brand diorama |
| [eliemichel/PolyworldJs](https://github.com/eliemichel/PolyworldJs) | CC BY 4.0, Élie Michel; SAFE WITH ATTRIBUTION | forest.js, tree builder/material and screenshots: deterministic positions and tree variation | Distinct broadleaf/pine silhouettes, per-instance tints and varied sizes | ADAPT TECHNIQUE; no geometry or scene copied |
| [SahilK-027/Elemental-Serenity](https://github.com/SahilK-027/Elemental-Serenity) | MIT, copyright Sahil K; SAFE WITH ATTRIBUTION if copied | ParticleSystem.class.js and world shader organization: bounded particles and independent environmental systems | Small fixed particle buffers, rain/snow controls, seasonal material palettes | ADAPT TECHNIQUE; reject audio and expensive simulation |
| [kenjinp/hello-terrain](https://github.com/kenjinp/hello-terrain) | MIT, copyright Poimandres; SAFE WITH ATTRIBUTION if copied | README, package structure and elevation/terrain query architecture: variable LOD, separation of elevation and rendering | Shared authoritative height function for all placements; bounded quality settings | ADAPT ARCHITECTURE; reject earth-scale WebGPU dependency for current WebGL deployment |
| [IceCreamYou/THREE.Terrain](https://github.com/IceCreamYou/THREE.Terrain) | MIT; SAFE WITH ATTRIBUTION if copied | Primary README: seeded terrain, slope-aware scatter, distant grass LOD | Keep terrain and scatter reproducible; use density controls for mobile | ADAPT TECHNIQUE, no library imported |
| [Three.js InstancedMesh](https://threejs.org/docs/#api/en/objects/InstancedMesh) and [water example](https://threejs.org/examples/?q=water#webgl_shaders_water) | Three.js MIT; SAFE WITH ATTRIBUTION for source reuse | Shared geometry/material draws; animated water shading | Instance plants and stones; original lightweight water shader instead of reflection passes | USE existing Three dependency; ADAPT concepts |

The five requested repositories were cloned for reading only into `work/references` outside the deliverable. License files were inspected directly (Polyworld license is in its README). No reference application source or screenshot enters the shipping site. Dependency licenses remain in node_modules and build notices.

## Asset research and selection

| Source | License / classification | Style and technical review | Decision |
|---|---|---|---|
| [Kenney Nature Kit](https://kenney.nl/assets/nature-kit) | Pack License.txt and official page: CC0; SAFE TO REUSE | Low-poly solid-color GLBs. Inspect chosen accessor counts, byte size and embedded texture references before shipping. Wood bridge, detailed tent and damaged stone column fit the warm wood / moss palette. | SELECT only three models; recolor materials, discard texture use, normalize scale; keep pack license |
| [Quaternius Ultimate Stylized Nature](https://quaternius.com/packs/ultimatestylizednature.html) | Official page license must be checked per download; REFERENCE ONLY in this change | Broad organic nature collection; larger scope than needed | REJECT download to avoid mixing vegetation identities |
| [Poly Pizza](https://poly.pizza/) | Per-model CC0/CC BY varies; REFERENCE ONLY until specific license verified | Suitable catalog, inconsistent author styles and polygon budgets | REJECT this round; selected pack provides consistent props |
| [Sketchfab banana tree by Matrix Rex](https://sketchfab.com/3d-models/low-poly-banana-tree-718b366ac66e47d3be46aa840964c6b8) | Individual license could not be verified from accessible page; DO NOT USE | Candidate found; download/texture/polygon budget unverified | REJECT copying; original banana plant silhouette instead |
| [OpenGameArt Low Poly Trees](https://opengameart.org/content/low-poly-trees) | Listing inspected; no downloaded file license audit; REFERENCE ONLY | Alternative tree collection, unnecessary alongside existing instancing | REJECT download |

The complete Nature Kit archive is temporary inspection material, not a shipped asset library. Only selected small GLBs and the license enter public/world-assets. Exact byte counts and triangle counts are recorded in asset-credits.md after inspection.

## Environment composition references

[Maxime Maillot: Gate in the forest](https://dhieen.artstation.com/projects/48bR4l), [Stimona Milanova: Stylized Forest Path](https://milva.artstation.com/projects/Bmrmr6), and [Brian Kim: Conifer Forest Biome](https://www.artstation.com/artwork/L4POwP) were examined as artistic references. These artworks are REFERENCE ONLY: no images, textures, meshes or scene layouts are reused.

BANORI composition decisions (our interpretation): foreground meadow and shore give breathing room; a curved pale trail leads into the middle-ground hero tree and camp; darker clustered pines and rocky ridges form the background. Turquoise water separates green masses. Warm banana yellow is reserved for the hero tree, flags and flowers, keeping the brand focal point distinct. Clearings protect landmarks from random foliage. This original arrangement combines technique knowledge rather than copying a reference scene.


## Environment quality pass — 3 October 2026

Research completed before implementation. Official Three.js [Water](https://threejs.org/docs/pages/Water.html) and [Water2](https://threejs.org/docs/pages/Water2.html), including the installed r180 MIT source, informed the shared planar reflection/refraction targets, flowing surface normals and Fresnel blending. BANORI uses original shaders and world geometry; no external map is copied. [BufferAttribute](https://threejs.org/docs/pages/BufferAttribute.html) informs direct particle updates. [InstancedMesh](https://threejs.org/docs/pages/InstancedMesh.html) and [R3F performance](https://r3f.docs.pmnd.rs/advanced/scaling-performance) inform shared geometry, instance batches, bounded render targets and imperative updates. [Drei useGLTF](https://drei.docs.pmnd.rs/loaders/gltf-use-gltf) and [useAnimations](https://drei.docs.pmnd.rs/abstractions/use-animations) inform cached models and clip mixing.

[Quaternius Ultimate Animated Animals](https://quaternius.com/packs/ultimateanimatedanimals.html) explicitly licenses its stylized rigged animals CC0. Deer and fox were downloaded through the official linked public folder, reduced to four ambient clips and packed into GLB. No texture fetches or remote runtime assets. OpenGameArt Animated Wild Animals was reviewed and rejected because it is a 2D sprite pack. NPS [Great Smoky Mountains mammals](https://www.nps.gov/grsm/learn/nature/mammals.htm) and [eastern cottontail](https://www.nps.gov/cwdw/learn/nature/eastern-cottontail-rabbit.htm) informed ecological placement and the original rabbit's long ears, strong haunches and short pale tail. Original bird, butterfly, fish and frog meshes use intentional silhouettes and articulated parts.

Composition decisions: cluster trees around open glades, reserve the complete footprint of structural sites and wildlife routes, create a connected main trail plus secondary and hidden branches, and put visual storytelling at destinations. A triangulated height field is the authoritative ground for rendered terrain and placement. Bounds checks are conservative broad-phase tests; final multi-angle visual inspection complements them rather than claiming a general mesh intersection solver.


### Quality-pass reuse classifications

| Resource | License / classification | Useful technique and BANORI decision |
|---|---|---|
| Three.js Water/Water2 official docs and installed example source | MIT code; **REFERENCE ONLY** for Water2 itself | Study flow normals and Fresnel; write BANORI's own water surface and waterfall shaders. |
| Three.js Reflector and Refractor | MIT; **SAFE WITH ATTRIBUTION** | Use the installed library implementations for shared clipped offscreen passes. Preserve runtime notices in `world-assets/Third-Party-Notices.txt`. |
| Three.js BufferAttribute and InstancedMesh docs | **REFERENCE ONLY** | Direct particle-buffer updates and repeated plant instances; original BANORI placement data. |
| R3F scaling-performance and Drei GLTF/animation docs | MIT software, docs **REFERENCE ONLY** | Cached models, animation mixers, imperative frame updates and bounded draw costs. |
| Quaternius deer and fox | CC0 1.0; **SAFE TO REUSE** | Select two matching stylized rigs; remove unrelated action clips and convert embedded glTF buffers into smaller GLB. |
| OpenGameArt Animated Wild Animals | CC0; **DO NOT USE** for this world | Rejected because the assets are 2D pixel sprites, incompatible with the requested 3D environment style. |
| NPS animal pages | **REFERENCE ONLY** | Study species appearance and habitat; original rabbit silhouette and biome placement, no site imagery or models imported. |

The official URLs are listed immediately above and in asset credits. Original copyright/license records for bundled runtime libraries are preserved with both source assets and static deployment assets.
