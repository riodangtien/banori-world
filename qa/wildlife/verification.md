# Wildlife mechanic verification — 2026-10-14

The station-based iteration has been replaced with a wildlife photography expedition. Seven categories can be found in any order: deer, fox, rabbit, frog, bird, butterfly and fish. The old learning tables/sign rendering components were removed from source and runtime. Natural camp furniture and the forest remain.

- Build and TypeScript: PASS.
- Unit tests: 45/45 PASS. Includes all seven capture categories, distance/aim/occlusion, photographing fish through water, arbitrary discovery order, repeated-species rejection, single XP award, retry without relocation and stale capture transaction protection.
- Browser: PASS for a real rabbit photograph from the starting area, maths question, wrong answer/hint, correct answer/XP, duplicate photograph rejection, named collection, save/reload and portrait layout. The animal is recognized from live scene geometry; no mock capture action was used.
- Runtime inspection: all seven categories present; no old question-table group. Console/page errors: none recorded.
- The browser test serves local repository files through a Playwright route because the sandbox blocks Chrome localhost HTTP. No test transport is in production code.
- Full walking-route traversal to all seven animal habitats and physical mobile/GPU performance were not tested in this pass.

Question data still comes from the existing verified Grade 1–5 maths bank. Photographing an animal unlocks its challenge; these questions do not claim to describe the animal's physical dimensions. Selected maths templates can recur across species, while each species awards progress only once per expedition. Old station-demo saves are kept separate from the new wildlife save key.

No push or deployment performed.

## Restored playable character

The original CC0 human explorer is restored at the owner's request. Build/typecheck PASS. Browser PASS: visible third-person 3D geometry, active animation mixer, Idle/Walk/Run/Jump states, hidden model in Camera view, all seven wildlife categories present and no former question tables or page errors. Screenshot: restored-explorer.png.
