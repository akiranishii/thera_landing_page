# Caldera crescent

## Idea

Santorini from above: a crescent of cliffs around a sunken caldera, with a small island at the centre. The crescent's inner edge, the cliff line, is a side-face profile; the dot is the island, held in the face's gaze. Read the other way, the crescent is an arm wrapped around the dot: one person, kept close. Thera, Atlantis, the goddess profile and "who matters" in a single gesture, with nothing illustrated.

Both marks are one filled path plus one circle, ink `#223848`, no strokes, no gradients, no text.

## Variant A: the lune

A classical crescent built from two circles.

- Outer circle, centre (35.53, 32), r 27: the outer coast, the back of the head.
- Caldera circle, centre (44.03, 32), r 21.5: the sunken crater. The lune is the outer disc minus this circle; its tips fall where the circles meet (x = 55.47).
- Profile: a promontory on the inner edge, like Skaros rock jutting into the caldera. One straight line from the hairline (26.19, 20) to the nose tip (28.13, 34.5), the Greek profile's unbroken forehead-to-nose line; a short return under the nose; a lip plane down to (26.54, 44.5); then the inner arc itself is the jaw, sweeping forward into the lower horn.
- Dot r 5 at the caldera centre, 11 units clear of the nose tip (about 2.7 px at 16 px).

Reads as a thick crescent with a dot at 16 px, as a crescent with a nose at 48 px, and as a carved profile at 512 px. Its risk is that a slim lune plus dot drifts toward "moon with a face"; the deep wrap of the inner circle (the tips reach past the dot) keeps it closer to a C than to a moon, but the association is still there.

## Variant B: the rim (preferred)

A uniform band, the caldera rim, an Atlantis ring and an arm.

- Centre (32, 32), outer r 27, band width 10 (inner r 17), round caps of r 5, with a 60 degree opening centred at 3 o'clock.
- Profile: the band's inner edge carries one straight ridge, Cycladic-style, from the brow (20.3, 19.67) to the nose tip (20, 35), with a short return under the nose to (15.91, 37.5). No lips, no chin: like a Cycladic figurine, the face is a smooth oval with a single nose. The ridge is a flat facet that cuts the circle; the notch beneath it is what makes it a nose.
- Dot r 5.5 at the exact centre, 6.9 units clear of the nose tip (1.7 px at 16 px) and 11.5 clear of the band elsewhere. Production check: the tip originally sat at (21.2, 35), 5.7 units from the dot; at 16 px, light on dark, that left a single muddy pixel between dot and band, so the tip was pulled back 1.2 units and the brow moved down the circle to keep the facet near vertical. The notch under the nose is now 4.1 x 2.5 units.

Because the band is even all the way round it is also a theta without its bar, and the ring-around-a-dot is a plan-view city with its harbour.

## Lockup

`lockup-a.svg` sets variant B at a 40 unit box beside "thera." in Inter semibold 46 px, letter-spacing -1.5, caps vertically centred on the mark. The viewBox is 208 x 80, tightened from 320 so the file's box hugs the lockup (about 20 px margin each side; content ends at x = 187 with Inter). Measured with the real Inter from the site's build (`renders/lockup-a-inter.png`, 1x, and `-4x.png`): mark ink 34.0 px tall centred at y = 40.0; Inter cap height and the h ascender are both 33.5 px, also centred at y = 40.0. So the mark is at cap height plus 0.5 px, centred to within 0.25 px, and the 6.25 px band matches the semibold stem weight. Inter is not installed system-wide on the render VM, so `renders/lockup-a-320.png` (made with `tools/render.mjs`) shows a fallback sans; the SVG itself declares Inter.

## Which one, and why

B. At 16 px it is the cleanest raster of the two: a bold C around a dot with a 2.5 px band and a 3 px dot, no thin tapers. At 48 px the nose is already legible as a facet. At 512 px it looks machined rather than drawn: one weight, round terminals, one straight cut. It carries three of the brief's sources at once (caldera rim, Atlantis ring, theta) and the profile without ever becoming a cartoon, and it has none of the star-and-crescent echo that any filled lune with a dot picks up. A is the more romantic reading and worth keeping as the illustrative cousin, but B is the one to put on a favicon.

Two-tone option: the dot may be set in `#466680` (light accent `#C4D5E0` on dark) to separate "the person" from "the city". Both marks must still read in a single colour, and they do; see `renders/contact-sheet.png` for light and dark at 160, 48 and 16 px.

## Files

- `mark-a.svg`, `mark-b.svg`: 64 x 64 viewBox marks.
- `lockup-a.svg`: 208 x 80 horizontal lockup with variant B.
- `renders/`: `mark-a-*.png`, `mark-b-*.png`, `lockup-a-320.png` (fallback font), `lockup-a-inter.png` and `lockup-a-inter-4x.png` (real Inter), `contact-sheet.png`.
