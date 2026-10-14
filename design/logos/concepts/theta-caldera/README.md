# theta-caldera — Θ as caldera

## Idea
Θ is the initial of Θήρα and already a circle crossed by a line. Read literally it is a letter; read as a place it is the
caldera ring with the horizon running through it, a dome over the water, an eye, a circle with one connection through it.
Both marks keep that single move — one round form, one horizontal — and say nothing else.

## mark-a — split ring (stroke)
The caldera is not a closed ring: Thera is a crescent and the ring of islands is broken where the sea comes in. So the Θ's
ring is broken where the horizon meets it. Two arcs sit above and below one bar, like a dome and its reflection, or two
profiles facing each other across a line.

Construction (64 viewBox): ring centre (32,32), radius 22, stroke 8, round caps. Arc tips at y = 32 ± 13 (x = 32 ± 17.75),
leaving a clear 5-unit gap between each cap and the bar. At 16 px the stroke is exactly 2 px: the bar fills pixel rows 7–8
and the gaps fall on clean white rows 6 and 9. The bar (y = 32, x 10..54 plus caps) spans exactly the outer diameter, so
the whole mark inscribes one 52-unit circle.

Explored and rejected on the way: bar joined to the left wall with an opening on the right (reads as a lowercase "e" /
"element of"); a short centred dash (reads as a "remove" button); a lowered horizon with a shallow bottom arc (weather
icon, smiley); a closed ring with the bar pinned out one side (looks like an error); bar overshooting the ring (loses the
circular silhouette and the overshoot vanishes at 16 px).

## mark-b — sunset disc (solid)
The same Θ as a solid: one disc with a single horizon cut just below centre. The upper segment is the dome / sun, the lower
is its reflection in the caldera, which is the one place the secondary colour (#466680) is allowed. In mono both are ink
and it is simply a solid Θ.

Construction: disc centre (32,32), radius 25; slot y 32..40 (8 units: exactly 2 px at 16 px and 6 px at 48 px, so the cut
stays a clean white band on the pixel grid). Upper path = chord at y 32, two quarter arcs over the top (an exact half
disc); lower path = chord at y 40, small arc counter-clockwise. Two closed paths, no masking, so it knocks
out correctly on any background.

## Lockup
lockup-a.svg (viewBox 0 0 205 80, trimmed to the content with ≈19 units of margin each side) uses mark-b at 0.72 scale:
a 36-unit disc (y 22..58) against a 44 px Inter semibold "thera." whose ascender-to-baseline height is 32 (y 24..56).
The disc is centred on that band and overshoots it by 2 units top and bottom, so it stands on the baseline like a letter
rather than hanging below it. 17 units of air between the disc and the "t". The horizon slot sits at the x-height
centre, where the eye expects a baseline-ish line, and the period in "thera." echoes the small lower segment.

## Preference: mark-b
mark-b is the one I would ship. It is the most ownable of the two (a split ring has cousins in horizon / weather
icons; a solid disc with one off-centre cut does not), it is unmistakable at 16 px (a filled disc survives any
rasteriser), it carries the brand's two blues as part of its structure rather than as decoration, and it is the calmest.
mark-a is the more elegant, more "Θ" reading and works well as a secondary / monoline version for UI chrome, but it is
quieter and needs the gaps to stay clean at small sizes.

Renders are in ./renders (512 / 48 / 16 plus pixel zooms). Dark-background checks (ink → #F7F9FA, secondary → #C4D5E0)
were rendered on #1C2E3D and both marks hold.
