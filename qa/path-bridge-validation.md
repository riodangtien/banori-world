# Path and bridge repair — 2026-10-04

- Roads use a single union clipped to the same terrain triangles as the ground. Junctions no longer stack independent ribbons.
- Bridge footprints are clipped exactly from roads. Dry connectors align the trails with bridge entrances.
- Four bridges now have solid decks and continuous bank ramps shortened where nearby crossings would overlap, with matching handrails. Ramp panels follow terrain across their width and length.
- Rendering and player grounding share the same bridge height function. Bridge clearance reservations cover the actual route rather than a large circle that excluded nearby wildlife habitats.
- 26 tests passed: includes road triangle interiors above terrain, upward bridge faces, no terrain piercing ramp panels, ramp endpoint contact, walking across all four bridges without jumping, and clearance between complete bridge footprints including their width. Ten-minute wildlife simulations also pass.
- Production build and git diff whitespace checks passed. Existing Three.js vendor bundle-size warning remains.
- Local compiled preview updated for publication. The close neighbouring crossings now have separate ramps and handrails with a dry trail connector between them.
