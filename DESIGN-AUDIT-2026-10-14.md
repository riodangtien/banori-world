# BANORI — Design audit, 14 October 2026

Scope: current local implementation, not deployed site. Reviewed Home, About, Brand, game launcher, first/third-person gameplay, map, quiz, reward, desktop 1440×900, tablet 768×1024 and landscape 844×390. Screenshots: qa/demo/refinement/audit-*.png. Source review: GameHUD, game.css, App, PlayHUD, CameraRig, GameContext, questions, FieldMap, Character and world generation. No production files modified during this audit.

## Overall finding

The project has a recognizable brand and a working educational demo. Its primary weakness is inconsistent art direction and a game interface still carrying editorial/portfolio typography. More decoration alone will not solve this. Prioritize readability, navigable composition and mathematics integrated into the forest.

## Highest-priority findings

1. **Illustration and game have different visual promises.** The forest artwork is rich, bright and narrative. The 3D forest has a gray horizon, olive colors, repeated angular crowns and a generic human explorer. This was an intentional substitute in earlier work, but the mismatch remains visible. Preserve official 2D assets. Harmonize light, material palette, character presentation and authored landmark silhouettes before adding model count.
2. **HUD readability is too low for primary-school users.** Many labels and controls use 8–11 px type. At 844×390 the camera/explorer buttons measured 31 px high with 8 px text; pause/fullscreen measured 40×40. Measurements were taken in a desktop pointer context at a small landscape viewport, not a physical touch device. Hidden climate controls were also returned by the raw measurement and should not be counted as visible controls. Use larger mission/action text, clearer verbs and larger interactive areas; reserve microtype for nonessential metadata.
3. **World composition is cluttered near the opening.** The start view contains foreground trees, campsite boards and bridge rails competing with the target. The center tree is a stronger shape than the banana. Third-person camera meets crowns/rails, and the avatar is visually dark. Create a calm start clearing, keep the first objective unobstructed, frame the route with vegetation outside the camera corridor, and give landmarks unique silhouettes. Wider ground paths alone do not clear crowns.
4. **Educational content is disconnected from world objects.** The same banana/book/crystal progression presents fixed questions; the new garden is decorative. Link primary maths to observable scene quantities: count seedlings, group bananas, compare shapes, measure a short bridge or read a route distance. Keep Find → Capture → Learn and the report-required relocation after wrong answers, but reduce the travel burden and strengthen guidance for younger pupils.
5. **First-use learning is optional text, not an actual guided interaction.** Instructions live in collapsed details and a tiny footer. Add a short contextual tutorial: move a little, turn toward an obvious object, frame it, capture it. Reveal only the needed control at each step. Explain camera vs explorer by function, not just names.

## Other design gaps

- **Small landscape layout:** navbar uses 64 px of a 390 px screen (about 16%). Keeping it is the user's requirement; reduce repeated HUD content and collapse the minimap rather than remove navigation. Mission, map and tools currently form large competing corner blocks.
- **Minimap:** real roads/rivers/player are already present. Add readable route hierarchy, destination names matching the 3D signs, bridges and a clear explanation of player heading. Differentiate a straight-line distance from a walkable route; only expose an assisted route when guidance is enabled.
- **Camera/object feedback:** current lock feedback says the target is frameable, but invalid capture uses one generic message for distance, aim and obstruction. Show the actual reason with a simple visual response. The camera model remains a blocky dark rectangle occupying substantial lower-right space.
- **Question/reward design:** notebook composition is strong, but photo appears asynchronously and may initially use the fallback icon. Let the preview settle before showing the complete sheet. Questions need child-readable spacing, larger hint text and visual explanations. Result reports XP and retries but not what mathematical skills were practiced. All three grades have the same fixed three-question loop (9 questions total); this is a sample, not a complete learning progression.
- **Grade selection:** Grades 1–2 and 4–5 combine materially different learning levels. Individual grades or clearly named topic sets would offer better expectations. Do not claim curriculum coverage without a reviewed content plan.
- **Home:** strong central artwork, but the upper blank area dominates and the side copy/actions are small. Primary CTA does not explain that World is a maths demo. Watch Trailer currently opens an availability message instead of a video. Use a truthful demo CTA or supply the actual trailer.
- **About:** attractive illustration, but text is mostly brand slogans; the educational purpose, age range and concrete player actions are not explained.
- **Navigation:** Characters and Brand/Overview both route to the same concept overview. Their distinct labels suggest distinct destinations. Resolve the structure while keeping the existing navbar design.
- **Brand:** large empty upper-middle region, small body copy and captions close to the mascot's feet. Space is not consistently serving a hierarchy; regroup the overview around a clear mascot focal point. Do not add back decorations the user previously removed.
- **State feedback:** loading depends on the character asset with generic preparing/unavailable labels. Provide a clear readiness state, helpful retry and a way to resume rather than accidentally restart. Session progress is not persistent. Audio follows the user's no-toggle preference; consider gentle ducking while a question is open instead of reintroducing a sound toggle.
- **Accessibility:** focus trapping/reduced-motion/ARIA already exist. Remaining gaps include small text, weak status announcement for continuously updated distance, keyboard discoverability and a portrait touch flow that requires rotation. Inspect contrast and focus at real zoom/device sizes before claiming compliance.

## Suggested implementation order

1. Readability and contextual onboarding; clarify the primary action in each state.
2. Author the start clearing and one memorable educational route; align lighting/material colors with approved forest illustration.
3. Simplify small-screen HUD and improve camera feedback/collision presentation.
4. Turn one garden into a real counting mission, with a visual explanation and helpful retry.
5. Extend grade/topic content and results. Then polish Home/About/navigation copy and Brand spacing.

Avoid a whole-site redesign. Preserve official mascot/logo/artwork, the navbar, the fixed World frame and the gameplay mechanics already requested. No Git push or deployment made in this review.

## Validation limits

Browser screenshots use software SwiftShader with local-file routing because Chromium HTTP access is restricted in the sandbox. They provide layout/state evidence, not representative GPU FPS. No physical child usability session or physical mobile-device performance test has been performed. Recommendations above are design judgments based on observed UI/source, not a claim that every suggested feature is required for a demo.
