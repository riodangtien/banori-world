# Explorer, photography and movement validation

The playable character is Man in Long Sleeves by Quaternius, licensed CC0 1.0: https://poly.pizza/m/DLptRuewTn. It replaces RobotExpressive. Source notice and SHA256 records ship with the model.

## Runtime asset

- Source: world-src/public/world-assets/characters/human-explorer.glb; compiled copy: forest/world-assets/characters/human-explorer.glb.
- 471,696 bytes; 1,970 triangles; zero image textures; five skinned meshes.
- Four retained clips: Idle, Walk, Run and Jump. Geometry and materials retained; animation names shortened.
- All four clips parsed and evaluated with finite transforms using Three.js. Evidence: qa/human-explorer-asset-check.json.
- Height normalized to 1.7 world units after updating skeleton matrices and skinned bounds. Spawn selects a clear dry area near camp.

## Camera and photography

Third person shows the character with an obstacle-aware follow camera. First person places the view at eye height, hides the body, adds subtle walking bob and a held camera with hands. V switches views; F or CHỤP ẢNH takes a picture. LƯU ẢNH downloads the PNG. The held camera and HTML viewfinder are excluded from the picture.

Browser verification rendered both views and captured a complete 1280 × 720 PNG preview. Evidence: qa/human-third-person.png and qa/human-first-person-photo.png. The save link has the PNG download attribute; clicking it in the in-app browser produced no download-completion event within 15 seconds, so file download completion is unverified. No browser console errors were reported.

## Movement and wildlife

Collision footprints approximate trunks and physical props rather than full foliage. Small stones and low decorations are passable. Obstacle height is considered while jumping; rock/log tops support landing. Movement slides along solid footprints to reduce snagging. Trees, major structures, deep water and island boundaries remain solid or blocked. Jump impulse is 5.5 with gravity 12; terrain step allowance is 0.45.

There are three deer, three foxes, four rabbits, four frogs, six birds and twelve fish. Butterflies scale from nine at low density to thirty at high density, giving 41–62 animals overall. Ground animals start at independently seeded safe positions within their habitats. Existing distance culling and animation pause are retained.

## Verification

Production TypeScript/Vite build passed. All 22 tests passed, including actual-scene rock traversal by jumping, tree collision while airborne, and walk/run animation and speed selection. Existing terrain, placement and wildlife checks passed. Browser screenshots verify the new character and photography UI. Sustained walking/running browser automation remains inconclusive because the in-app browser can leave native fullscreen during focus changes; controller tests verify those behaviors. Physical mobile gameplay was not tested.

Desktop controls: WASD move, Shift run, Space jump, drag camera, V switch view, F photograph in first person, Escape or EXIT WORLD return. Existing touch joystick, jump button and portrait guidance remain available.

The rejected BANORI reconstruction is isolated outside the deliverable repository under work/retired-banori. Superseded robot assets and old compiled bundles are retired outside the shipped site. Original user attachments and website branding remain intact.

## Wildlife scatter and sound update

Ground animals now occupy fourteen reserved habitats: one habitat per individual, spread across pine, meadow, central forest, river banks and lake/wetland edges. Birds and butterflies use four separate flight areas. Ten-minute simulation checks passed for all fourteen habitats; placement and movement tests passed after regenerating the obstacle scatter around these habitats.

Original Web Audio synthesis provides filtered wind/water noise, stereo bird chirps and distance-attenuated frog calls. No external recordings are shipped. Sound starts inside the ENTER WORLD gesture, supports a persistent on-screen toggle, and fades out while paused, hidden or off the world section. Browser diagnostics confirmed enabled=true, error=false and nonzero output RMS (0.022676) after entering play, and the toggle changed to disabled correctly. This confirms generated signal, not listening through physical speakers.

Production build and all 22 tests passed. Deployment is requested by the user; its result is recorded separately in deployment-validation.md.
