# dome-horizon — "Dome and horizon"

The Santorini dome and the horizon, reduced to one semicircle and one line. Two takes, both single-colour, both built from a circle and a straight cut.

## mark-a.svg — Dome and sun (arc over dot)

**Idea.** A thick half-ring is the dome, its two flat feet standing on an unseen horizon. A solid dot has slipped just below that horizon, past the dome's right foot: the sun meeting the sea, or a second person stepping out from under the arch. The dot also rhymes with the full stop in "thera.", so the mark and the wordmark end the same way.

**Construction.** viewBox 0 0 64 64, ink #223848 only.
- Dome: arc of radius 17 centred at (27, 32), 180°, stroke 10, butt caps. The caps are perpendicular to the path, so the feet are horizontal cuts on y = 32, the horizon. Outer radius 22, inner 12; the opening is 24 wide. (Stroke was 9; raised to 10 in production check so the ring holds two solid pixel rows at 16 px.)
- Sun: circle r 8.5 at (50.5, 47). Clearance to the dome's right foot is 6.5 units vertically and about 6.6 on the diagonal, which stays a visible gap at 16 px.
- Footprint 54 x 45.5 (x 5–59, y 10–55.5), centred at (32, 32.75); the heavier arc on top keeps the optical centre on 32.

**At size.** 16 px: the arc is a 2.5 px ring and the dot a 4.25 px disc; both read, with a clear gap. 48 px and 512 px: clean. Light-on-dark checked on #1C2E3D.

## mark-b.svg — Dome and caldera (dome inside a circle)

**Idea.** One circle, cut by the horizon and slid apart. The upper half is the dome; the lower half, offset to the right, is the caldera it fell into, or its reflection in the sea. It is also theta, the initial of Θήρα: a circle crossed by a line, with the line made of light instead of ink. Two arcs meeting across a horizon is the relationship read.

**Construction.** viewBox 0 0 64 64, ink #223848 only.
- Dome: upper half of a radius-21 circle centred at (26, 28). Spans x 5–47, y 7–28.
- Caldera: lower half of the same circle centred at (38, 36). Spans x 17–59, y 36–57.
- Horizon gap 8 units (y 28 to 36), horizontal shear 12 units (about 29% of the diameter), so the slip is read as deliberate and not as a drawing error.
- The chord edges sit on y = 28 and y = 36, which fall on whole pixels at 16 px (7 and 9) and 48 px (21 and 27), so the horizon stays crisp at favicon sizes.
- Footprint 54 x 50, centred at (32, 32).

**At size.** 16 px: two bold half-discs with a clean 2 px light line between them; the most legible favicon of the two. 48 px and 512 px: reads as one circle that has been moved by the horizon. Light-on-dark checked.

## lockup-a.svg

Mark B at 34 px tall (scale 0.68 of the 64 box, 36.7 wide), translate (12.6, 18.24) so it spans x 16–52.7 and y 23–57; wordmark "thera." in Inter 600, 44 px, letter-spacing -1.5, baseline y = 56. Inter's cap height at 44 px is 32, so the cap band is y 24–56: the mark sits on the baseline at cap height with 1 px of round overshoot top and bottom, like an O, and its crown lines up with the tops of t and h. Gap from the mark's right edge to the t is about 14 px. The cap band is centred in the 80 px box. (Production check: the first cut centred the mark on the x-height band, which hung it 3.6 px below the baseline; checked against the real Inter webfont, it read as dropped, so it was moved onto the baseline. Inter is not installed on this machine, so the stock renders show the system fallback.)

## Preference: mark B

B is the stronger mark. It is one familiar whole with one confident move, which is what the Linear/Stripe generation of marks does; it has a square footprint, so it fills a favicon and sits well beside the wordmark; it is the most legible of everything tried at 16 px because it is two solid masses; and it carries the most of the brief at once (dome, horizon, caldera, theta, two arcs meeting) without illustrating any of them. A is a good second: more playful, more clearly "sun and dome", and the dot-as-full-stop is a nice tie to the wordmark, but the thick-ring-plus-dot grammar is closer to icon vocabulary and the ring goes slightly grey at 16 px.

If a second colour is ever wanted, the one element that can take #466680 is the sun in A or the caldera half in B; the files are kept single-colour on purpose.

## What was tried and rejected

Rendered and looked at, then dropped: a solid dome with the horizon extended into a path (reads as a mouse or a cap), the same with a sun above (a postcard), a ring with a chord and a dome inside (weather/Pokéball icon), a stroked dome crossed by the horizon (a bridge), a solid dome with an arched doorway (half-donut), a sun circle with a dome bitten out (jellyfish), a thick cap arc over a dot (visibility/radar icon), and a dome with a horizon slot (helmet).
