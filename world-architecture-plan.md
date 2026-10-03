# BANORI world architecture plan

Written after research and before map implementation, 3 October 2026.

## Preserve

Preserve the existing landing page, branding SVGs, WATERY sections, navigation, #world URL, lazy iframe integration and GitHub Pages relative-path deployment. Preserve R3F/Three and the useful local source concepts: finite island, semantic biomes, river/lake topology, seeded instanced vegetation and orbit interaction.

## Rewrite and extend

1. Add editable `world-src` to this repository and a reproducible build into `forest`. Earlier local source is a recovery base, not the current published source. Keep old hashed assets until replacement is verified.
2. Terrain first: retain BANORI island and biome layout, introduce original seeded multi-octave noise, cache spline samples and compute nearest segment distances without per-call allocations.
3. Geography: maintain river/lake cutouts, strengthen waterfalls with animated streaks and mist; match placement to shared heightAt.
4. Trails/landmarks: clear a central hero-tree plaza, western camp and ridge lookout. Normalize three CC0 GLBs; build original banana plants, lookout and details. Avoid randomly covering routes.
5. Vegetation: reduce overcrowding, retain broadleaf/pine distinction, vary instance colors, add rooted shader grass wind with bounded buffers. Common trees stay instanced.
6. Props: add camp and small ruins with coherent moss/wood recoloring. Assets live in public/world-assets/{trees,vegetation,rocks,structures,props,water,wildlife}.
7. Environment: user-selectable clear/rain/snow, seasons and animation pause; small fixed particle buffers. Respect reduced-motion and pause rendering when the iframe is hidden.
8. Camera: overview plus landmark destinations; orbit, zoom and reset; keep mobile controls compact.
9. Optimization: cache map curve samples, no per-blade CPU animation, cap DPR and density for small devices; expose development performance readings for verification. Defer true chunk streaming and reflection passes because the map is finite.
10. Verify build, semantic map tests, browser errors, assets loading, desktop and mobile layouts, weather/season changes and multiple camera destinations. Record actual evidence and limitations in validation.md.

## Art direction

BANORI is a miniature adventure landscape: moss green terrain, darker pine highlands, a turquoise water route, pale sand trails, golden hero canopy, yellow banana leaves/fruit accents, muted stone and warm wood. Sparse near-side vegetation opens the silhouette. The hero tree is the visual anchor; camp, waterfall and lookout provide a readable exploration loop. No downloaded whole scene or reference branding is used.

## Publication boundary

Prepare and verify the complete local repository change. Do not replace the live website without explicit publication authorization. Provide a concrete preview and reviewable files first.


## Implemented environment quality architecture

The current implementation supersedes the earlier village, ruin and fixed-bridge plan. The world is a guardian camp linked to the ancient tree, mountain lookout, waterfall viewing bank and protected hidden sanctuary.

`map.ts` owns a cached 0.4-unit triangulated height field, river width profiles, carved beds and the raised source pool. Terrain renders the identical diagonal and interpolated heights, clips boundary triangles, and closes the same irregular underside. `grounding.ts` provides normal sampling, bounds grounding, footprint validation and terrain snapping. `layout.ts` deterministically reserves structural sites, all bridge spans and wildlife glades before accepting clustered trees, rocks, slope-resting logs and stumps.

`Landmarks.tsx` builds original material-batched structures, grounded stone footings, connected stair stringers and landings, bank ramps, terrain-conforming roots and small protection scenes. Only the camp canvas uses a Kenney model. `Water.tsx` shares clipped Three.js Reflector/Refractor targets at 384 pixels (256 on narrow screens) and updates them every six/ten frames; original flow/depth/Fresnel shaders draw the water and layered waterfall.

Wildlife uses two optimized CC0 rigs and original rabbit, frog, bird, butterfly and fish hulls. Independent IDLE/MOVE/ACTION/PAUSE controllers validate complete land movement segments against biome, water, paths and obstacle footprints. A full ten-minute simulation per terrestrial species is tested. Birds perch on the roof and return from short flights; fish remain in the lake's open water. Snow and rain update typed buffers with individual speed, drift and phase, respawning above sampled ground. Selecting precipitation intentionally resumes motion; explicit Pause remains available.

Vegetation uses instance batches, biome-specific crown proportions and colors, cluster clearings, restricted mushroom scenes and shoreline reeds. Far views reduce grass instance counts and hide small details. Static props merge by material; water passes share targets; no React state changes per animation frame. Lighting combines hemisphere and directional light, bounded warm camp/lantern lights at night, atmospheric fog and moving fireflies. `Diagnostics.tsx` exposes a hidden DOM report for repeatable QA without adding technical UI to the experience.

Validation combines deterministic placement checks, exact terrain/normal checks, finite geometry/transforms, bounds grounding, contact checks at the hero trunk, animal route simulation and particle progression with complete-island camera presets and saved visual QA. Broad-phase footprint validation is deliberately conservative; intentional structural joints, roots entering soil, and rocks embedded in earth are expected contacts, not errors.
