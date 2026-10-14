# Primary maths / viewport refinement

World is a single fixed game frame below navigation in setup and play. The outer section has no scroll or minimum height; obsolete fullscreen CSS and frame arrow-scroll behavior are overridden/removed. Camera head bob removed; horizontal motion follows the controller immediately, with vertical ground smoothing. WASD and arrows work. Physics substeps keep movement consistent across frame rates. Walk/run speeds are 2.8/4.6 m/s.

Only primary maths is selectable: Grades 1–2, Grade 3 and Grades 4–5. Nine contextual arithmetic, shape, perimeter, area, fraction and decimal questions replace the prior three-subject bank. This is sample demo content.

Trails widened; tree/prop placement clearance increased alongside them. Grass spikes replaced with low tufts, tiny path slivers removed, and a framed counting garden added at camp with three rows of five seedlings. Camp, ridge and grove signs use mathematical themes.

Verification: production build; controller tests including slow-frame movement equivalence and a real-map boulder jump; existing game/map/bridge tests. Browser checks cover navbar retention, exact frame bounds, wheel scroll rejection, arrow movement, map/pause, captures, questions, hints, XP, wrong relocation and touch. Screenshots in this directory. Browser uses SwiftShader and local file routing; GPU performance remains unmeasured.

No Git push or web publishing performed.
