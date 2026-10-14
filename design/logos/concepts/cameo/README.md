# cameo — "The Bust" and "The Brooch" (round 2, profile-led)

A classical head seen in profile as a positive, solid silhouette: a straight Greek nose continuous with the
forehead, a short neck cut flat like a coin portrait, and a single chignon at the nape. It is built from
two circles (skull, knot), three arcs (forehead, chin, a nose-tip fillet) and six straight lines, and it
faces right, toward the wordmark. Think of the Girl Scouts profiles or a 1970s coin portrait, not a
Victorian cameo: one blunt shape, no eye, no lips drawn, no hair detail.

- **mark-b "Bust"** — the silhouette alone, one sealed object. Preferred.
- **mark-a "Brooch"** — the same bust at 0.65, floating inside an ink ring (r 28 / 22), the neck cut by
  the inner rim. The ring is the Θ of Θήρα, the coin and the caldera; the bust is the goddess.

Both are single colour, ink #223848, arcs and straight lines only, no strokes, no masks, no gradients, no
text. No secondary colour is used (an accent version could set the Brooch's ring in #8DA8BB; it was not
needed). `mark-a-light.svg` / `mark-b-light.svg` are the same geometry in #F7F9FA for dark grounds.

## What round 1 taught, and how this mark applies it

- **Positive silhouette, not a cut.** Nothing is engraved through a disc, so there is no crack, bolt or
  prohibition bar to misread. The ink is the head; the light is the background.
- **Four calm moves on the face.** Forehead arc (r 30, nearly straight, tangent to the skull at the
  hairline), one straight nose, a short lip plane, one chin arc. The underside of the nose and the jaw
  line are connectors. The mouth is the corner where the lip plane meets the chin arc; it is not drawn.
- **The nose is the move.** 11.5 units at 30° from vertical, 31 % of the crown-to-chin height, projecting
  5.75 past the brow, with a 20° bend at the bridge so forehead and nose still read as the one Greek
  line. The forehead is short: the brow sits 16 units under the crown, and the skull does the rest.
- **Nothing small.** Chin arc r 6.76, knot r 8.5 protruding 4.5 behind the skull, notch 4.0 deep
  (measured from the notch to the skull-to-knot tangent), neck 17.3 wide at the base. The only sub-4
  element is the r 1.3 fillet on the nose tip, which is a corner softening, not a feature. In the Brooch
  every light gap between bust and rim is 6 or more (crown 6.3, knot 6.6, jaw 6.1–6.6, chin 7.9,
  nose 10.0); the bust touches the ring only at the two neck cuts, which meet the rim at about 60° and
  80°, so there is no sliver. The honest cost of the Brooch is that the face is the Bust at 0.65, so its
  lip plane (2.6), nose underside (2.9), chin projection (1.3), notch (2.6) and knot protrusion (2.9) are
  all under 4 units: at 48 px they are 1–2 px and the face is a silhouette with a nose, not a drawing.
- **One sealed shape at 16 px.** The Bust rasters to a solid blob with a nose bump and a neck, every core
  pixel at full ink (grid below). The Brooch is a ring with a solid blob, and the 6-unit ring goes to
  half-tone at 16 px, which is the honest cost of the frame.
- **No crescent, no horn, no moon.** The knot ends in a round r 8.5; the base is a flat cut.

## Construction, variant B (viewBox 0 0 64 64)

Skull circle centre (31, 19.5), r 15. Chignon circle centre (20, 34.5), r 8.5, overlapping the skull;
the outline follows the knot round to the notch where the two circles meet and then the skull's own arc
up to the crown. The forehead is a r 30 arc internally tangent to the skull at the hairline H (the skull
at −25°), centre (17.4, 25.84), run down to the brow where its tangent is 10° from vertical. The
neck is a flat-based trapezoid: front 85° from horizontal, back leaning 2°, cut at y 58.

Clockwise from the back of the base:

| point | role | coordinates | note |
|---|---|---|---|
| Bb | back of the base | (25.69, 58) | base is flat, 17.3 wide |
| N | nape | (26.32, 40.19) | corner where the neck back meets the knot's underside (knot at 42°) |
| knot | chignon | centre (20, 34.5), r 8.5 | arc N → notch, 212° of it, leftmost point (11.5, 34.5) |
| notch | hair pulled over the occiput | (17.65, 26.33) | the two arcs meet at 101°; 3.7 units deep |
| crown | top of the skull | (31, 4.5) | skull arc from the notch over the crown to H |
| H | hairline | (44.59, 13.16) | forehead arc leaves the skull tangentially |
| B | brow | (46.95, 20.63) | forehead tangent 10° from vertical; nose leaves at 30° |
| T | nose tip (corner) | (52.7, 30.59) | filleted r 1.3 between (52.1, 29.56) and (51.72, 31.27) |
| U | under the nose | (49.1, 33.11) | underside 35° below horizontal, 4.4 long |
| L | base of the lip plane | (49.44, 37.1) | lip plane 4 long, leaning 5° forward |
| chin | | centre (44.68, 41.9), r 6.76 | apex (51.44, 41.9), 1.26 behind the nose tip; arc L → Th |
| Th | end of the chin | (49.46, 46.68) | jaw line leaves tangentially at 45° |
| J | neck front | (43.5, 52.64) | neck front runs 85° to the base |
| Fb | front of the base | (43.03, 58) | |

Path, as written in `mark-b.svg`:

```
M 25.69 58 L 26.32 40.19 A 8.5 8.5 0 1 1 17.65 26.33 A 15 15 0 0 1 31 4.5 A 15 15 0 0 1 44.59 13.16
A 30 30 0 0 1 46.95 20.63 L 52.1 29.56 A 1.3 1.3 0 0 1 51.72 31.27 L 49.1 33.11 L 49.44 37.1
A 6.76 6.76 0 0 1 49.46 46.68 L 43.5 52.64 L 43.03 58 Z
```

Footprint x 11.5..52.7, y 4.5..58 (41 × 53.5). The head is 41 deep and 44 tall to the chin's bottom;
the neck is 42 % of the head's depth. Thirds, crown to brow 16.1, brow to nose base 12.5, nose base to
chin bottom 15.5.

## Construction, variant A (viewBox 0 0 64 64)

Ring: outer circle centre (32, 32) r 28, inner r 22, 6 units thick. Bust: the same drawing scaled 0.65
about the skull centre and moved to skull (29.8, 26.2), r 9.75; knot (22.65, 35.95), r 5.53; forehead
r 19.5; nose 7.48; chin r 4.39; tip fillet r 0.85. The neck lines run into the rim at Fb (37.44, 53.32)
and Bb (26.28, 53.24), so the bust is a coin portrait cut by its border. One path, `fill-rule="evenodd"`:
the outer disc, then one hole whose boundary is the inner rim from Bb over the top to Fb and the bust
outline back down to Bb.

Key points: crown (29.8, 16.45), brow (40.17, 26.93), nose tip (43.9, 33.41), chin apex (43.09, 40.76),
end of the chin (41.8, 43.87), neck front corner (37.92, 47.74), nape (26.76, 39.65), notch (21.12, 30.64).
Gaps to the rim: crown 6.3, knot back 6.6, knot bottom 8.7, jaw 6.6 at the chin end and 6.1 at its
midpoint, chin apex 7.9, nose tip 10.0, nape 12.7; the neck front corner is 5.2 from the rim and the
5.6-unit neck front then meets it at about 60°. The bust sits 2.2 left of the ring's centre because the
chin and jaw have to clear the rim where the circle is already closing in at the lower right; the spare
air lands in front of the face, which is where a coin portrait keeps it.

## Lockup

`lockup-a.svg` (the preferred mark, B), viewBox 0 0 186 80. The bust at scale 0.6355, translate
(8.69, 19.14): 34 px tall, standing on the baseline (y 56) with its round crown overshooting the cap
line by 2 px (y 22), against Inter 600 at 44 px (cap height 32, cap band 24..56). A flat-based shape
sits on the baseline rather than straddling it; the overshoot is on the round end only, like an O.
Knot back at x 16, nose tip at x 42.2; `thera.` at x 56.7, baseline 56, letter-spacing −1.5. Measured
from the 320 px render with the real Inter SemiBold: ink x 16.3..169.7 (16 px margins), the t's ink
starts 15.7 px from the nose tip, mark height 33.7 px. The goddess looks at her name.

## Preference: variant B, the Bust

1. It is the only one of the two in which the goddess is visible at every size the brief names. In the
   lockup (34 px) the Bust is still an unmistakable classical profile with a chignon; the Brooch at
   36 px is a ring around a smudge, and reads as a generic user badge.
2. It is one sealed shape with no light gaps to manage, and its 16 px raster is all solid pixels. The
   Brooch's 6-unit ring becomes half-tone at 16 px, its bust has to drop to 0.65 to clear the rim, and a
   ring around a head is the universal avatar glyph, which is the crowded category round 1 warned about.
3. The product supplies the circle anyway: in a circular avatar crop or an app-icon tile, the Bust sits
   inside the circle and becomes the cameo. The Brooch would then be a ring inside a ring.
4. It is the more ownable object: a positive silhouette with a Greek nose and a knot, in the spirit of
   the Apple bite or the Girl Scouts profiles, rather than a frame.

The Brooch is the version to show if the founder wants the coin / Θ / caldera reading inside the mark
itself rather than supplied by the context, and it is the stronger favicon of the two only if a ring
is wanted there.

## What a stranger might see

- **Bust at 512:** a classical or neoclassical profile silhouette; a cameo or coin portrait; a woman
  with her hair in a knot. Possible misreads: a Roman emperor (strong nose, short neck), a chess pawn at
  the smallest sizes (head on a stem). The knot sits at mouth level and is round, so it no longer reads
  as a colonial queue (draft 1 did).
- **Bust at 48:** a head in profile with a bun. **At 16:** a solid head-and-neck silhouette; honestly, a
  "user" glyph in profile.
- **Brooch at 512:** a cameo brooch, a coin with a portrait, a profile inside a ring, attached only at
  the neck; the avatar-icon reading is the risk. **At 48:** a head silhouette with a nose and a bun inside
  a ring; the features are 1–2 px, so it is a contact / user icon in profile. **At 16:** a grey ring with
  a blob joined to it at the base: a badge or a target.
- Neither reads as a cracked coin, a lightning bolt, a prohibition sign, a crescent or a moon with a
  face. There is no crescent in either mark.

## Iterations, and what each render said

1. Floating bust in a ring, and a bust on a flat block; knot small and low, chin r 5. Colonial
   ponytail (George Washington), a throat notch that read as a beard, a brick base.
2. Knot moved to the top-back, back of the head as a tangent line. Moai / hooded monk; with no neck
   the bust was a head on a block.
3. Neck added, knot at ear height. The knot read as an ear or a sideburn; the neck a parallelogram
   leaning left; a thumb at 16 px.
4. Knot at the nape, overlapping the skull with a notch; vertical neck; chin r 6. First draft that
   read as a chignon. Still a pictogram (ball plus rectangle), and the Brooch's jaw ran through the rim.
5. Tangent line from the skull to the knot, no notch. A Hershey's-kiss wedge; the knot vanished.
6. Head only, no neck, base tangent to chin and knot. The calmest 16 px of the set (a dome), but a
   helmet or a hood at 512.
7. Head only with the notched knot, and a concave cameo truncation. With nothing under it the low
   knot read as a jowl; the concave base made two lobes. The knot needs the neck for context.
8. Back to 4 with a bigger skull (r 15), a shallower notch, a wider neck, nose 11.5: the final. Four
   neck/knot variants and four ring/scale variants (ring 21.5 / 22 / 22.5, bust 0.68..0.75) were rendered
   side by side; r 22 at 0.72 was chosen for the largest face.
9. Production check of 8. The Bust passed (every feature 4 or more, base on the viewBox at 16 px, lockup
   measured at base y 56.3 / h-ascender 24.3 / margins 15.7 and 15.1). The Brooch did not: at 0.72 the
   crown, nose and knot cleared the rim by 6, but the chin apex was 3.5 from it and the 45° jaw ran
   2.3 → 1.1 → 0 from a rim whose tangent there is also 45°, a tapering sliver that read as a crack at
   512 and a grey smear at 48. Fitted numerically for the largest bust with every gap at 6 or more:
   0.65 with the skull at (29.8, 26.2). The bust is now attached to the ring only at its two neck cuts.

## Files

- `mark-a.svg` — Brooch, ink. `mark-a-light.svg` — the same in #F7F9FA.
- `mark-b.svg` — Bust, ink (preferred). `mark-b-light.svg` — the same in #F7F9FA.
- `lockup-a.svg` — the Bust beside `thera.`, 186 × 80.
- `renders/` — both marks at 512 / 48 / 16 with pixel-zoomed 48 and 16, the light marks on #1C2E3D at
  512 / 48 / 16, the Bust also at 32 and 24, the Brooch also at 36 (its lockup size), and the lockup at
  320 with real Inter SemiBold. All were read.

16 px rasters (`#` at least 70 % ink, `+` half-tone, `.` under 12 %):

```
Bust                Brooch
................    ................
......++++......    .....++##++.....
.....#####+.....    ...+###++###+...
....+######+....    ..+##......##+..
....#######+....    ..#+..##+...##..
....########....    .+#..+###+..+#+.
....########+...    .++..#####...++.
...##########...    .#+..#####+..+#.
...#########+...    .#+.+#####+..+#.
...#########+...    .++.+#####+..++.
...++++######...    .+#+.++###+.+#+.
......+#####+...    ..##..+###..##..
......+####+....    ..+##++##++##+..
......+####.....    ...+########+...
......+++++.....    .....++##++.....
................    ................
```

## Regenerating

The marks are parametric. `design/logos/tools/cameo.py` builds every file in this folder from the
dicts in `design/logos/tools/cameo_params.py` (`PARAMS_B` is the drawing; `PARAMS_A` is `PARAMS_B`
scaled 0.65 and placed in the ring; `LOCKUP` holds the lockup metrics):

```
python3 design/logos/tools/cameo.py design/logos/concepts/cameo
node design/logos/tools/render.mjs design/logos/concepts/cameo/mark-b.svg design/logos/concepts/cameo/renders
node design/logos/tools/render.mjs design/logos/concepts/cameo/lockup-a.svg design/logos/concepts/cameo/renders 320
```
