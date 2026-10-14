# BANORI expedition interface

## Design brief
Make learning feel like setting out on a forest expedition. Keep the official BANORI logo/character, blue sky, navy field equipment and banana-yellow rewards. Use authored icons, mission patches, a field map and a camera scanner instead of form controls and utility cards. Primary action: locate and photograph the assigned collectible. Learning and retry retain the existing Word brief. Scope: launcher, gameplay HUD, map/pause, quiz, reward/completion and collectible presentation; preserve movement, camera, forest topology and unrelated website sections.

## Core loop contract
Explore the forest to find and capture a recognizable object, then solve its question. Correct answers add XP and unlock the next mission. Wrong answers or skipping move the item and require another capture. The interface explains the current step, range and camera lock immediately; optional location guidance is shown on the real map. Input remains responsive; no reward animation gates continuation.

## Level plan
Keep the existing connected trails and bridges. The tutorial starts on clear ground ahead of the player at 2–3.4 metres. Camp, river crossing and ridge lookout are spatial anchors represented by matching world signs and map icons. Later items use the existing validated dry trail locations; relocation remains more than six metres away. The minimap shows actual island outline, waterways, trails and player heading; it only reveals the item when location help is enabled. Field-map and pause overlays freeze player control. Centre screen remains clear while moving.

## Visual/state contract
- Launcher: forest artwork plus original explorer; large primary start action; three subject choices, three difficulty choices, mission preview.
- Find: compact objective plate top-left, XP/progress above, minimap top-right, camera lock near reticle, movement/actions in safe lower corners.
- Map/pause: real top-down cartography and an explicit resume path.
- Quiz: field notebook with captured item stamp, four answers, visible hint/skip controls.
- Reward: authored medal, XP meter and immediate next action. Complete: three item badges and retry.
- Touch: 44 px minimum key controls, landscape gameplay, independently scrollable menus at short heights.
- Motion: short entry/press/reward cues; no shake or flashing; reduced-motion alternatives.

## Skills consulted
Downloaded into the workspace from majidmanzarpour/threejs-game-skills: threejs-game-ui-designer, threejs-gameplay-systems, threejs-aaa-graphics-builder. UI patterns, game feel, genre patterns and graphics references were read. No third-party generation scripts or external asset services are used. Existing art and code-native vector/Three.js shapes provide the visual assets.

Validation: 36 unit tests passed; production build passed. Browser test covers 6 launcher widths (390–1440px), real capture photo, quiz/hint/XP, next mission, wrong-answer relocation, Literature Hard, map/pause movement freeze, and touch landscape. Local files were fulfilled through Playwright routing because the sandbox blocked Chrome HTTP transport. Rendering used software SwiftShader; FPS is not representative of a GPU device. Measured gameplay: 96 draw calls and 151,152 triangles. Original terrain, bridges and character assets preserved. Label overlay found during visual review and hidden during modal states.
