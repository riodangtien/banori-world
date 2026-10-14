# BANORI educational demo validation

14 October 2026. Local production build served on port 4180.

Implemented from the user's Word brief: subject/difficulty selection; Find → Capture → Learn; three missions; local sample quizzes; hints; XP; wrong/skip → teleport → find → recapture → shuffled retry. The two previous World promotional boards are removed. Other website sections and official assets are preserved.

- TypeScript and Vite production build passed.
- 5 test files / 36 tests passed. Tests cover all 27 question records, safe locations, relocation distance, answer reshuffling, line-of-sight capture, XP once per mission, recapture gating and three-mission completion.
- Automated Chrome checks passed for actual 3D capture, quiz opening, question hint, correct reward, next mission, wrong-answer relocation, refusal to reopen an uncaptured quiz, Vietnamese Literature at Hard difficulty, restart/subject selection, 390 px layout and landscape simulated-touch capture.
- No browser JavaScript errors recorded.
- Screenshots were visually inspected for selection, gameplay, quiz, relocation, reward, mobile and touch layouts.
- Native Windows browser automation was unavailable because its URL check could not verify the user's open browser. Validation used a separate headless Chrome instance instead. Simulated touch was tested; a physical phone was not used.

The demo uses 27 sample questions across 3 subjects × 3 difficulties, with 3 questions per combination. XP/progress lasts for the current session only. Full curriculum, accounts, streaks and leaderboards are future scope. The existing explorer model and forest assets are reused.

No publication was performed for this change.
