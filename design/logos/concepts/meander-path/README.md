# Meander path

**Direction:** the Greek key reimagined as a single path. "Your network, in motion."

## Idea

The meander is the oldest Greek line there is: one stroke that turns, doubles back and keeps going. Here it is reduced to one gesture.

- **Mark A, "Two dots, one path."** Two interlocking hooks drawn as one continuous line, with a dot at each end. Two people, and the single path that runs between them. The shape is one repeat of a Greek-key fret, point-symmetric about the centre: turn it 180 degrees and it is the same mark, which is the point (a relationship is the same from either end).
- **Mark B, "Square spiral, opening outward."** One dot at the centre, and a square spiral that leaves it, wraps once, and runs out past its own frame. The dot is you; the path is the network growing outward from you. It is also, loosely, Plato's Atlantis in plan: a centre, a ring, and the canal that opens the city to the sea.

Neither is a literal fret or a literal city plan. The meander is there as rhythm and turn, not as ornament.

## Construction

Both marks live on `viewBox="0 0 64 64"`, ink `#223848`, no gradients, no text. Butt caps, miter joins, a single stroke weight each, so every corner is a true right angle.

**Mark A**

- Grid: columns at x = 12, 25.33, 38.67, 52 (equal pitch 13.33), rows at y = 15, 32, 49 (pitch 17).
- One path, stroke 7: `M12 49 V15 H38.67 V32 H25.33 V49 H52 V15`. Seven segments, six turns.
- Dots r = 7 at (12, 49) and (52, 15). The dots sit on the two free ends of the line so the stroke runs into them centred. (Was r = 8; at 8 the dot came within 1.83 units of the neighbouring bar's miter end and fused with it at 16 and 48 px. At r = 7 the clearance is 2.83 units.)
- Extents 5..59 by 8..56. Point-symmetric about (32, 32).
- Dot-to-stroke ratio is 2:1, which is what makes the ends read as nodes rather than as fat line caps.

**Mark B**

- Grid: 12 / 32 / 52 on both axes (pitch 20, so at 16 px every stroke is exactly 2 px and every gap exactly 3 px).
- One path, stroke 8: `M32 32 H52 V12 H12 V52 H60`. The tail runs 8 units past the frame's grid line (4 units past the stroke's outer edge); that overrun is the "opening outward".
- Centre dot r = 9. Clearance from the dot to the frame is 7 units all round.
- Extents 8..60 by 8..56.

**Lockup** (`lockup-a.svg`, `viewBox="0 0 196 80"`): Mark A at a 40 px box (scale 0.625), set so the mark spans exactly the cap/ascender height of `thera.` in Inter 600 at 40 px, letter-spacing -1.5 (mark y 24.5..54.5 against cap top ~24 and baseline 53). The bottom dot overshoots the baseline by about 1 px, the way round letters overshoot a baseline. The viewBox is trimmed to the content width (the text ends near x = 170). Inter is not installed on the build machine, so the renders here show the system fallback; the horizontal metrics will tighten a little under real Inter.

## What I looked at

Rendered every round at 512 / 48 / 16 and read the pixel zooms. Five rounds, eighteen candidates, including plain serpentines (read as "2" or "Z"), the hooks with the dots on the middle row (read as a chain link), rounded-corner spirals (read as "e"), and spirals with the stub pointing up or down (read as "g" and as a keyhole). Both final marks were also checked inverted (`#F7F9FA` on `#1C2E3D`); they hold.

- Mark A at 16 px: four 1.75 px verticals, so it goes a little soft, but the fret shape and the two heavier ends are still unmistakable. At 48 px and up it is crisp.
- Mark B at 16 px: pixel-exact (2 px strokes, 3 px gaps), the sharpest 16 px of anything I tried.

## Preference: A

A is the meander. It is point-symmetric, it says "two people, one path" without a caption, and nothing else on the market looks like it. Its only cost is a slightly softer favicon than B, and that is a rendering cost, not a legibility one.

B is cleaner at 16 px and the "outward" tail is a nice gesture, but a square spiral with a centre dot keeps drifting toward a letterform (a square "G" or "@"), which makes it less ownable. Keep it as the fallback if the favicon ever needs to be bulletproof, or as a secondary device in the system.

## Files

- `mark-a.svg`, `mark-b.svg`, `lockup-a.svg`
- `renders/`: PNGs at 512 / 48 / 16 (plus pixel zooms) and the lockup at 320.
