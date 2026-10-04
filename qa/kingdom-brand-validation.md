# Kingdom chapter and brand slides — 2026-10-04

Added the Vệ Binh Vương Quốc chapter after WATERY with supplied VBVK.svg, forest/gold accents, a battlefield preview, gameplay sequence, project link and accessible how-to modal. Source: owner repository README (main branch). Its Pages endpoint returned 404 during inspection, so the primary action deliberately opens the supplied GitHub repository.

Replaced the monochrome logo placeholder with supplied logodonsac.svg; removed the clear-space placeholder. Logo slide now has a large primary mark above three variants. Removed the three decorative diagonal lines from WATERY.

Brand now switches between Overview, Logo, Color and Type using buttons. Inactive slides are hidden and inert. Color uses one terrain-independent presentation viewport with a primary asymmetric palette, compact supporting swatches, a thin usage bar and three combinations. No brand slide is below Color in document flow.

Checks: node --check script.js and git diff --check passed. Browser inspected desktop and 390×844 mobile. COLOR at 1920×1080, 1600×900, 1440×900, 1366×768 and 390×844: zero section scroll overflow, zero labels outside the viewport, exactly one active brand slide. Game images loaded, how-to opens/closes, chapter navigation works, and forest audio volume reaches zero on the game chapter. Mobile VBVK image fits its artwork container. No browser console errors.

Screenshots: kingdom-chapter.png, logo-system-updated.png, color-one-screen.png. Structured COLOR measurements: color-viewport-checks.json. Changes remain local; no push or deployment performed for this UI request.
