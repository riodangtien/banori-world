# Complete environment audit — before quality-pass implementation

Audited 3 October 2026. Inspected every source module and the rendered world in overview, rear, left/right orbit, overhead, low silhouette and watchtower close-up. Existing source and assets were snapshotted to work/quality-pass-baseline.zip before edits. Findings below distinguish code-proven defects from visual design weaknesses; final resolution evidence will be appended after validation.

## CRITICAL

- **Hero tree floating:** trunk geometry height is 1 scaled by 2.15, but its center is 2.15 above the ground. Its minimum is therefore terrain + 1.075. No roots exist. Use geometry bounds and a terrain-conforming root base.
- **Tower/foundation intersection:** tower and RockArch both occupy (17,-11). The ladder steps have no side rails and terminate against a large central rock; supports do not account for footing elevation. Rebuild the foundation, access, platform and braces together.
- **No world-wide placement system:** tree/rock/log generation happens independently; there is no obstacle registry, footprint spacing, bounding-box grounding or final scan. Full object extents are not checked against water/path/island bounds.
- **Terrain placement mismatch:** all objects use an analytic height function while the rendered terrain uses interpolated triangle heights. Grounding must sample the actual authoritative triangulated surface.

## MAJOR

- **River discontinuities:** channels hard-switch terrain height to 0.065 while water ribbons use a different width modulation. This yields abrupt trench walls and misaligned wet masks. Source and waterfall are disconnected; fall is a rectangular slab without a basin.
- **Water material:** river/lake have no normals, flow coordinates, Fresnel, depth shading, reflection or refraction. Scrolling flat rectangular marks are not enough to read as water.
- **Waterfall cliff:** arbitrary rocks occupy the water mouth. Mist is static; foam is a stationary circle. Upstream river height derives from land rather than a connected water-level model.
- **Bridges:** GLB is grounded from the river-center height; bridge ends are never sampled. Other bridges have hardcoded rotations/lengths independent of stream geometry. Paths continue across water as flat land ribbons.
- **Village/columns:** four toy houses and three unrelated columns do not tell the explorer-camp story. Remove both; replace with one coherent camp containing three tents and useful objects.
- **Forest overcrowding:** overlapping independent tree scatters, 15 trees on a tiny lake island, dense pine crowns and no minimum spacing. Uniform bush/stone/log scatter produces noise rather than intentional clusters.
- **Weather:** snow and rain share point positions, constant vertical speed and a flat y=0 respawn threshold. Neither has per-particle drift/speed/phase or terrain impact. Rain is drawn as round points. Pause/reduced-motion can silently make selected snow static. Snow animation itself does use useFrame; the user-visible freeze requires runtime/state verification rather than claiming the loop is missing.
- **Wildlife absent:** semantic animal zones exist but there are no animals, behavior or safe movement targets.
- **Night lacks local lighting:** cool light exists, but lanterns, fireflies and warm camp illumination are absent.
- **Trail hierarchy/connectivity:** routes enter lake/water, do not terminate at entrances, and lack explicit bank crossings and a tower access trail.

## MINOR

- Log orientation only uses yaw/90° roll, not endpoint slope or actual model radius; long logs can hang above/clip slopes.
- Major props/rocks share land independently with trees; pine crowns intersect the lookout rocks.
- Reeds appear throughout open lake water. Bank vegetation needs shallow-only placement.
- Mushrooms respect water only; some sit in open clearings or across routes. Concentrate them near shaded roots.
- Triangle ribbons may invert normals or overlap at crossings. Water/paths need explicit normals and dry-only segments.
- Seeded arrays use viewport width for generation, leading to different layouts across devices. Quality should alter rendered counts/LOD while keeping placement deterministic.
- Many individual landmark meshes create repeated geometries/materials. Merge static objects by material and instance repeated foliage.
- Material/resource disposal for cloned models/shaders is missing.
- The island underside cylinder does not match its irregular top outline.
- Existing automated tests check map scale/topology only; they do not scan actual placements, bounds, weather progression, bridge bank contact or animal safety.

## POLISH

- Ancient roots, ferns, fallen leaves, useful direction signs, camp equipment, protected sapling and birdhouse are missing.
- Tree families differ mainly by crown color or simple cone versus sphere. River-side and autumn trees need different silhouettes.
- Campfire is a small static cone; no warm night light, smoke or fireflies.
- Default overview reveals landmarks but underuses foreground negative space; lower angles reveal structure issues.
- No repeatable camera presets for top/front/rear/left/right/low QA; no runtime performance or placement report.

## Quality-pass design

Keep BANORI branding, finite irregular island, ten semantic regions, hero-tree/lookout identities and landing-page integration. Rebuild geometry/placement around a shared triangulated height field; use explicit site footprints, validated clustered scatter, bank-derived bridges, connected source→fall→pool→stream water, a rooted hero tree, a braced lookout and explorer camp. Add a small recognizable wildlife cast with safe asynchronous ambient behavior. Write and run numerical scans, then inspect all requested views and weather combinations. Do not claim a blanket absence of every visual intersection from AABB checks alone.


## Resolution after implementation and QA

| Audit area | Resolution and evidence |
|---|---|
| Floating hero trunk / absent roots | New trunk starts below sampled ground; seven terrain-conforming roots enter soil. Automated trunk-contact check and hero close-up. |
| Tower / arch / unsupported ladder | Conflicting arch removed. Four anchored posts, stone footings, beams, cross braces, railings, landing, stringers and real ground-to-deck stairs. Lookout front/side views. |
| Mismatched ground heights / seams / underside | One cached triangulated field drives both rendering and placement. Every top vertex and normal checked; edge triangles and underside follow the same irregular contour. |
| Independent overlapping scatters | Shared seeded registry reserves complete site and habitat footprints, waterways, paths and bridges. Zero final placement findings. |
| Static cyan water / inconsistent river widths | Width profiles and sloping carved beds match water masks; original depth/flow/Fresnel shader with shared clipped reflection and refraction passes, subtle moving highlights and shallow transparency. |
| Hidden waterfall / missing source | Raised visible pool feeds a clear cliff lip; inclined layered falling sheet follows the carved face, with foam, splash and moving mist. Flanking rocks leave the mouth open. |
| Submerged or disconnected crossings | Four crossings detected from actual wet trail intervals; bank elevations drive deck heights, footings and approach ramps. Ghost water ribbons removed. |
| Root-blocked trails / weak traversal | Main trail connects camp, river, hero viewing glade and lookout junction; secondary pine/waterfall/wetland branches and a narrow protected sanctuary trail. |
| Unexplained ruins / toy village | Replaced by three explorer tents, campfire, seating, crates, barrels, map table/board, packs, rope, wood supply, birdhouse, drinking bowl and protected sapling. |
| Repeated forest / crowded island / misplaced fungi | Clustered tree spacing, varied silhouettes/scales/colors, open glades and biome crown proportions. One generous island tree. Mushrooms concentrate near shaded trunks and roots. |
| Empty fauna / unsafe motion | Seven appropriate species: deer, fox, rabbit, birds, butterflies, fish and frog. Two CC0 rigs plus original anatomical hulls; independent behavior timers, biome/obstacle-safe land routes and checked lake loops. |
| Frozen precipitation / incorrect thresholds | Separate snow points and angled rain segments update typed buffers, individual speed/drift/phase and terrain-based respawning; only selected weather is visible. Selecting precipitation resumes motion. |
| Flat night / shadows | Cool readable moonlight, warm bounded fire and lantern lighting, moving fireflies, fog and softer shadow bias. Rain reduces sunlight. |
| Performance / disposal / verification | Instance batches, material-merged structures, far-detail reduction, small shared/throttled water targets, model clip pruning and resource disposal. 13 tests pass; desktop overview observed at 60 FPS. |

Final QA evidence and practical validation limits are documented in `validation.md` and `qa/`. Automated findings are zero for the checked placement and transform categories; intentional construction joints, rooted soil contact and embedded rocks are retained.
