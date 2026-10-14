# profile-wordmark — "She looks at the name" (round 2, profile-led)

One goddess in profile, solid ink, facing right, built to sit immediately left of "thera." so that
she looks at the name and the period at the end of it is the island, or the sun, she looks toward.
The back of her head is a circular arc; the front is the profile in four calm moves: a short
straight forehead, one straight Greek nose, a short lip plane, one round chin. Standing alone it is
a calm D-like object, round at the back and flat under the jaw, with a face for a front edge.

Variant B is the same profile with the back arc carried round into a full disc: the head in ink,
the crescent in front of her face in muted blue, ending on a short flat cut under the chin, the way
a bust on a coin is truncated. A coin of Thera with the goddess struck on it, or the moon over the
caldera with her face as its terminator.

Both marks are arcs and straight lines only, ink #223848 (#8DA8BB for the one secondary element in
B), no strokes, no masks, no gradients, no text.

## What round 1 taught, and how this mark applies it

- The round-1 profiles failed as thin cuts and lines (a crack, a bolt, a prohibition sign). Here
  the profile is the edge of a solid mass, never a line: the lone head is 41.7 x 50.2 units of ink,
  and in B the two pieces share one edge with no gap at all.
- Four moves, nose dominant. Forehead (3.7 straight + the crown fillet), nose 17 units tall, which
  is a third of the 50-unit head, lip plane 4.4, chin arc r 8. The nose leans 27° from vertical and
  the forehead 15°, so the brow bend is 12°: the forehead and nose read as one Greek line with one
  soft break, not a furrowed brow (18° and more read as a brow ridge in the renders; see below).
- Forehead short: 13.2 units from crown to brow, of which only 3.7 is straight. The crown is one r 13
  fillet between the straight forehead and the r 26 back circle, so the skull is a smooth dome that
  peaks behind the face, where a skull's vertex is.
- No feature under 4 units except the connectors: the nose underside (5.6), the lip plane (4.4), the
  r 2 nose tip, and the 1.1-unit step where the lip plane meets the chin, which is the implied mouth
  (two-profiles found the same thing: a corner there, not a bump, is what reads as lips). At 16 px the
  mouth vanishes and the shape is an egg with a nose, which is intended.
- No crescent in the mono mark at all. In B the blue crescent's upper horn closes as a wedge at the
  rim: the forehead line crosses it at 68°, and the blue is 6 units wide within 1.8 units of the tip.
  The lower horn did not: the chin arc met the rim at only 20°, which the production check measured
  as a 6-unit-tall taper (blue 5.9 wide at the chin apex, 3.0 three units lower, 1.0 at five, then
  nothing). It now ends on a horizontal cut 0.5 above the chin apex, 6.34 units wide, meeting the
  chin arc at 86° and the rim at 48°; the ink takes everything below it. (The first B drafts had a
  1.8-unit blue sliver over the crown as well; see iterations.)
- The silhouette is one sealed object. A is a D with a profile front; B is a disc. The 16 px renders
  were read: A is one dark egg with a bump on its right; B is one two-tone disc.

## Construction, variant A (viewBox 0 0 64 64)

Back of the head: circle Cb (37, 31), r 26. The face is built forward of the vertical chord x = 37.

| point | role | coordinates | note |
|---|---|---|---|
| J | crown, on the back circle | (23.95, 8.51) | where the r 13 fillet leaves the circle (tangent) |
| K | crown fillet centre | (30.48, 19.76) | r 13; its top (30.48, 6.76) is the top of the mark |
| P1 | top of the straight forehead | (43.03, 16.39) | fillet meets the forehead line (tangent) |
| B | brow | (44, 20) | forehead P1→B leans 15° from vertical |
| T | nose tip (corner) | (52.66, 37) | ridge B→T leans 27°; filleted r 2 between (51.92, 35.55) and (51.39, 38.02) |
| U | under the nose | (48.3, 40.5) | underside T→U, 5.6 long, 39° below horizontal |
| L | base of the lip plane | (48.76, 44.89) | lip plane U→L, 4.4 long, leaning 6° forward |
| Cc | chin centre | (41.9, 49), r 8 | chin arc L→Tj from −31° to 90°; apex x 49.9 at y 49, 2.8 behind the nose tip, 1.1 ahead of L |
| Tj | chin meets the jaw | (41.9, 57) | tangent |
| Qj | jaw meets the back circle | (37, 57) | tangent: the jaw line is the bottom tangent of the back circle |

Path, one closed subpath, as written in `mark-a.svg`:

```
M 43.03 16.39 L 44 20 L 51.92 35.55 A 2 2 0 0 1 51.39 38.02 L 48.3 40.5 L 48.76 44.89
A 8 8 0 0 1 41.9 57 L 37 57 A 26 26 0 0 1 23.95 8.51 A 13 13 0 0 1 43.03 16.39 Z
```

Every junction is tangent except the four that are the face: the brow (12°), the nose tip (r 2
fillet), the corner under the nose and the corner at the mouth. Ink box x 11..52.66, y 6.76..57
(41.7 x 50.2), margins 11 / 11.3 / 6.8 / 7. The ink centroid, measured from the 512 render, is at
(31.1, 32.9), within a unit of the box centre, so the heavy back and the light nose balance.

Why the bottom is flat: a chin circle that is internally tangent to the back circle (the sealed,
all-round version) can only be 2–5 units in radius unless the chin is tucked behind the lip, which
is draft 1's Moai. Running the chin arc tangent into a jaw line that is itself tangent to the back
circle keeps everything smooth, lets the chin be r 8, and gives the head a jawline, which is what a
head has under the chin. The flat 4.9-unit jaw also lets the mark stand on the baseline.

## Construction, variant B (viewBox 0 0 64 64)

Disc: centre (32, 32), r 26 (the back circle of A, shifted −5, +1 to sit in the box). The same
profile, shifted the same way. Two pieces that share one edge and do not overlap:

- Ink, the head: the disc behind the profile. The forehead line is extended up to the rim, which it
  meets at (35.03, 6.18) at 68°. The chin arc runs from the lip base to Pc (44.88, 49.5), half a
  unit above the chin apex (44.9, 50), and a horizontal cut runs from there to the rim at
  Pr (51.23, 49.5): the truncation of the bust. `M 35.03 6.18 L 39 21 L 46.92 36.55
  A 2 2 0 0 1 46.39 39.02 L 43.3 41.5 L 43.76 45.89 A 8 8 0 0 1 44.88 49.5 L 51.23 49.5
  A 26 26 0 1 1 35.03 6.18 Z`
- Blue (#8DA8BB), the crescent in front of her face: the rim from the crown crossing round the
  front to Pr, the cut back to Pc, then the profile back up. 10–17 units wide from the forehead to
  the lips, 6.8 one unit above the cut, 6.34 at the cut, which it meets at 86° (chin side) and 48°
  (rim side). Continuing the chin arc to the rim instead, as the first version did, gave a blue
  horn that crossed the rim at 20° and was under 6 units wide for its last 6 units of height.

A's crown fillet and A's flat jaw are inside the disc in B, so B's ink silhouette is the disc minus
the crescent and the two marks differ in object, not in colour: A is a head, B is a coin with a head
on it. B needs two colours; in one colour it is a plain disc. The light-on-dark version
(#F7F9FA head, #466680 crescent on #1C2E3D) was rendered and reads as a moon with a face for its
terminator, which is a reading we are happy to own.

## Lockup

`lockup-a.svg`, viewBox 0 0 187 80. Variant A at scale 0.6867, translate (8.45, 18.11): the ink is
34.5 px tall, x 16..44.6. The flat jaw stands on the baseline (y 57.25) and the crown reaches
y 22.75, 2.5 px above the cap height of Inter 600 at 44 px (cap band y 25.25..57.25, metrics
measured for dome-horizon), the overshoot of a round letter. 13 px from the nose tip to the t (the
chin and brow are 2–3 px further back). Wordmark at x 57.11, baseline 57.25, letter-spacing −1.5;
the period's ink ends at x 171, margins 16 both sides, 22.75 top and bottom (the ink block was
measured from the 320 render: x 15.8..171.2, y 23.0..57.5). Rendered at 320 and 160 with the real
Inter SemiBold: she looks at the t, and the period is the last thing on her line of sight.

## Iterations, and what each render said

1. **Draft 1** (brow 5 ahead of the chord, forehead 14°, nose 32°, crown fillet r 9, chin r 5.4
   tucked and internally tangent to the back circle). A face, but a Moai: huge skull, jutting brow
   over a receding forehead, a knob chin. Fix: more face, less skull.
2. **Face pushed forward** (brow 8–9 ahead, crown fillet 13–16, chin apex 15–16). Reads as a face at
   every size, but the tangent-chin construction collapses to a 2–4-unit spike (a witch's chin) and a
   fillet of 16 steps off the circle at the crown. Fix: rebuild the bottom on a jaw line.
3. **Jaw line + chin r 6.5–7.5.** A real chin at last, but a ball sitting on a floor, and the 18°
   brow bend reads as a furrowed, masculine brow. A bug surfaced here too: my generator hard-coded
   the back arc's large-arc flag, which was only right by accident in draft 1; from this round the
   arc swept 150°, the renderer chose the mirror circle, and the backs bulged out of the viewBox. The
   flag is now computed from the sweep. Fix for the face: bend 12°, bigger softer chin.
4. **Bend 12°, chin r 8, apex 2.7 behind the nose tip.** The calm classical line. The lip plane came
   out 3.3 and the chin projected 1.5 past it, a touch of a pout; a 10° rising jaw was tried and
   gives her a lifted chin that looks above the name rather than at it.
5. **Lip plane 4.4 at 6° lean, chin 1.1 ahead of it, jaw flat** (chosen), against a 5° jaw, an r 11
   crown and a 28° nose. The flat jaw is the level gaze and the baseline. B rebuilt as the disc minus
   the crescent after the first B showed a 1.8-unit blue sliver over the crown and the chin poking
   2 units out of the disc.
6. Final renders at 512 / 48 / 16, light on dark, lockup at 320 and 160, centroid check. Mark raised
   from 33.5 to 34.5 px in the lockup after the first lockup render looked a touch small beside the type.
7. **Production check** (every render re-read, ink boxes measured from the rasters). A: centred
   within 0.3 units (margins 11.0 / 11.9 / 6.75 / 7.0), no change. B: the disc is centred and the
   shared edge shows no antialiasing seam at 512, but the blue under the chin was a taper to a point
   along the rim, visible as a 1 px tail at 48; fixed with the horizontal cut above (the 68° crown
   wedge was left as it is). Lockup: the horizontal margins were equal but the ink block sat 1.25 px
   high in the 80 px box (crown at 21.5, baseline 56), so mark and wordmark moved down 1.25 px.

## Preference: variant A

A is the direction's answer: the goddess is visible at 512, at 48 and still as a head at 16, in one
colour, on light or dark, and she looks at the name. It is the only profile in the exploration that
is an object rather than a line or a cut, and it is a favicon silhouette no competitor has. B is the
more finished-looking thing on a page, it keeps the sealed disc the judges rewarded, it carries the
coin and the moon, and it is the version to use as an avatar or app icon, but it needs its second
colour (in mono it is a disc), and at 16 px the face is gone. If "goddess" must come before "coin",
it is A.

## What a stranger might see

- **A at 512:** a classical head in profile, a cameo silhouette, a bust. Also, honestly: a bald head,
  a mannequin head, and more likely a man than a goddess, since there is no hair and no neck. The
  straight forehead-nose line is the only classical cue, by design; a chignon at the nape would say
  "goddess" at once and was left out because it breaks the one-shape favicon. At 48: a head with a
  nose and chin. At 16: an egg or bean with a bump on its right; no face, but a distinctive shape.
- **B at 512:** a coin with a profile struck on it, a cameo, a moon phase (waning gibbous) with a
  face for its edge, a profile avatar in a circle. The flat cut under the chin reads as the bust's
  truncation, or as a horizon under her chin; it is the one straight edge in the crescent and it is
  noticed. At 48: a two-tone disc with a face edge and a 5 px flat under the chin. At 16: a two-tone
  disc; the moon-phase reading is the risk, and the phase/toggle family is crowded.
- Neither reads as a crack, a bolt, a no-entry sign or a moon with a face drawn on it, which were the
  round-1 failures.

## Files and renders

- `mark-a.svg`, `mark-b.svg`, `lockup-a.svg`, this README.
- `renders/`: both marks at 512 / 48 / 16 with pixel-zoomed 48 and 16; both marks light-on-dark
  (`mark-a-light-*`, `mark-b-light-*`, #F7F9FA on #1C2E3D, B's crescent in #466680) at 512 and 48;
  the lockup at 320 and 160 with the real Inter SemiBold. All were read.

## Regenerating

`design/logos/tools/profile-wordmark.py` builds both marks from one parameter dict (the defaults at
the top of the script are this concept; `b_cut` is the height of B's chin cut above the chin apex)
and prints the point table, the band widths, the crown crossing angle and the cut's width and angles:

```
python3 design/logos/tools/profile-wordmark.py design/logos/concepts/profile-wordmark
node design/logos/tools/render.mjs design/logos/concepts/profile-wordmark/mark-a.svg design/logos/concepts/profile-wordmark/renders
```

The lockup is `mark-a.svg`'s path under `translate(8.45 18.11) scale(0.6867)` beside the wordmark.
