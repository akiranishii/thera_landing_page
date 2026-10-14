# v2 style brief: on-brand illustrations that simplify into the mark

## Why v2 exists
The founder's feedback on v1: "I was hoping the goddess and santorini would still retain a similar color scheme and logo-like style." v1 started from warm, fully rendered illustrations (bronze coin, terracotta sunset) and only reached the brand palette in the last 20% of the timeline; `tools/palette-check.mjs` measured 60–99% off-palette pixels for t < 0.8. v2 must look like it belongs to the same identity from the very first frame: the illustration is the logo's richer, more figurative sibling, and the animation is that sibling simplifying into the mark (and, played backwards, the mark blossoming into the picture).

## Palette (hard rule, checked by tools/palette-check.mjs on every frame)
Only the Blue Haze family:
- #FFFFFF white, #F7F9FA background, #EAF0F4 surface, #DDE6EC line, #C4D5E0 light accent, #8DA8BB muted sea blue, #466680 primary, #223848 ink, #1C2E3D dark.
- Flat mixes between two of those (e.g. a 50/50 of #8DA8BB and #466680 is fine) — they stay in the blue family automatically.
- Optional, very sparing accents from the site's calendar pastels (lavender #E3DFF0, mint #D8E8E5, sand #EEE5DE), only as small light details and under 4% of pixels. Prefer none.
- No warm colours, no saturated blues, no gold, no terracotta, no sunset. A "sun" is a white or #F7F9FA disc; "warmth" comes from composition and light, not hue.
- palette-check must print PALETTE: PASS (off-palette < 1% in every frame).

## Drawing style (logo-like)
- Built from the logo's own vocabulary: circles, arcs, straight lines, simple closed paths with clean tangents; consistent corner radii; no outlines or strokes on figures (a uniform-weight line is acceptable for one deliberate detail such as a horizon or a laurel stem).
- Flat fills. At most a single subtle tonal step per mass to suggest light (e.g. #466680 hair with a #8DA8BB highlight plane). No gradients, no textures, no drop shadows, no blur.
- Composed inside the logo's disc (centre 320,320, r 280 on the 640 viewBox) or in a rounded frame that becomes the disc, so the silhouette is already close to the mark at t = 0. Page background #F7F9FA outside it.
- Readable and charming at 160 px (thumbnail) as well as 480 px. A stranger should see "a goddess" / "Santorini" at t = 0 without being told.
- Restraint: roughly 15–45 shapes at t = 0. Every detail must have a destination in the mark (a mass it merges into, a rim it sinks into, an edge it becomes), so nothing fades for no reason.

## Motion
- Same module contract as v1 (`../CONTRACT.md`): `set(t)` deterministic, reversible, cheap; t = 0 illustration, t = 1 exact logo (paths in `../LOGO_PATHS.md`, exact hex fills).
- Because both ends share the palette, colour change is small and should feel like light shifting, not a recolour. Most of the story is shape: details merge, masses settle, edges straighten.
- Timeline: fine details resolve 0–0.55, main masses morph throughout, final edges lock 0.85–1.0. No moment should look emptier or muddier than both ends.
- Reuse v1 techniques freely: read `../goddess-coin/anim.js`, `../santorini-crescent/anim.js` and `../goddess-portrait/anim.js` for the matched-segment sampling, colour helpers and timing structure, then restyle.

## Checks before returning
1. `node ../tools/frames.mjs <dir>/demo.html <dir>/frames` → read filmstrip.png and frames 000, 030, 050, 070, 100; reverse-check.txt must say OK.
2. `node ../tools/palette-check.mjs <dir>/demo.html` → must print PALETTE: PASS.
3. t = 1 equals the logo: same path strings and hex fills as LOGO_PATHS.md.
