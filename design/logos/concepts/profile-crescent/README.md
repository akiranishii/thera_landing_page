# profile-crescent — "Caldera" and "Sunken head" (round 2, profile-led)

Santorini from above. The crescent of cliffs is the back of a head; its inner edge, where the
island meets the caldera, is the goddess in profile, looking at the small island in the middle of
the water: the one person who matters. Two takes on the same profile grammar:

- **mark-a "Caldera"**: a bold eccentric crescent in ink. The cliff edge on the thick side is the
  profile, carved as positive ink into the light caldera; the dot is ink, floating where her gaze
  lands. One path plus one circle, single colour.
- **mark-b "Sunken head"**: the same profile splits a whole disc. The front half is the ink
  crescent (the cliffs) with the dot knocked out of it; the back half, the head, is sea blue
  (`#8DA8BB`, the one secondary element), the part of Thera that sank. In single colour the head
  drops away and the crescent alone carries the face as a negative (`mark-b-mono.svg`).

Both are circles, arcs and straight lines only; fills, no strokes, no masks, no gradients, no
text. The face looks right, toward the wordmark.

## What round 1 taught, and how this mark applies it

- **Four calm moves.** Each profile is a forehead arc, one straight nose, a short lip plane and one
  chin arc. The nose underside and (in B) a short neck are connectors. Nothing else is drawn; the
  mouth is the corner where the lip plane meets the chin.
- **The nose dominates.** A: ridge 11.4 units, 33% of the 34-unit profile, 29° from vertical.
  B: ridge 18.6 units, 34% of the 55-unit profile, 30° from vertical. The forehead is short
  (9.5 / 11.8) and leans back, so the brow-to-nose bend is 20° in both: the single Greek line.
- **No feature under 4 units.** Lip planes 4.0 / 4.8; nose tips filleted r 2.5 / r 2 (fillets, not
  features); chin arcs r 8.5. Every light gap is 6.5 or wider: in A the island is 8.7 from the
  nose tip, 10.2 from the brow, 8.4 from the caldera wall and 8.6 from the upper horn; in B the
  dot has 7.1 of ink to the rim and 8.4 to the nose tip.
- **Horns never taper to a point.** A's horns are cut flat on the rays at ±50° from the centre
  and are 6.5 wide at the cut (band 10.5 at the back of the head, 8 at the top and bottom). B's
  crescent ends in 72° and 75° wedges where the forehead and the neck meet the rim, like a coin
  cut by its own portrait.
- **Sealed silhouette at 16 px.** A is one fat C with a dot (3 px band at the back, 2 px at the
  horns, 2 px dot); B is a disc, half sea blue, half ink, with a white dot. The face is a 32 px
  and up reading in A, 24 px and up in B.

## Construction, variant A (viewBox 0 0 64 64)

Outer circle centre (36, 32), r 28, the clean coast. The whole mark sits 4 units right of the box
centre so the open C is optically centred: ink x 8..54, y 4..60, bbox centre 31 (one unit left of
centre, the usual correction for an open C), and the back of the C lands on a whole pixel column at
16 and 48 px. Caldera circle centre (38.5, 32), r 20, shifted 2.5 forward so the band thickens
behind the head: 10.5 at the back, 8 at the top and bottom, 6 at 3 o'clock before the cut. Horns
cut flat on the rays at ±50°: outer (54, 10.55) and (54, 53.45), inner (49.83, 15.52) and
(49.83, 48.48), 6.48 wide; the flat ends read as a cut ring, where round caps read as a monoline
letter C (both were rendered).

Profile, top to bottom, on the thick side of the inner edge:

| point | role | coordinates | note |
|---|---|---|---|
| H | hairline, on the caldera circle | (25.27, 17) | the cliff arc meets the forehead at 80°, a plain corner like the Vessel's rim corner |
| B | brow | (28.8, 26.5) | forehead arc H→B r 25.93, centre (3.2, 30.61), bulging forward 0.5; tangent 32° from vertical at H, 9° at B |
| T | nose tip (corner) | (34.3, 36.5) | ridge B→T 29° from vertical, 11.4 long; filleted r 2.5 between (33.22, 34.54) and (32.48, 37.79) |
| U | under the nose | (30.2, 39.4) | underside 35° below horizontal |
| L | base of the lip plane | (30.6, 43.4) | lip plane 4.0 long, leaning 6° forward |
| chin | | centre (24.3, 49.11), r 8.5 | apex (32.8, 49.11), 1.5 behind the nose tip |
| W | throat | (32.56, 51.1) | the chin circle meets the caldera circle at 86°; filleted r 4 on the light side, tangents (32.76, 48.29) on the chin and (36.3, 51.88) on the caldera wall, so the chin runs into the sea floor as an S-curve |

The face protrudes 15.3 past the caldera wall at the nose; thirds hairline–brow 9.5, brow–nose
base 12.9, nose base–throat 11.7. Island dot r 4.5 (9 units) at (43.5, 27): at eye level, ahead of
the brow, 7.5 right of the circle's centre and 5 above it. It is not at the geometric centre of
anything; it is where she is looking.

```
M 54 10.55 A 28 28 0 1 0 54 53.45 L 49.83 48.48 A 20 20 0 0 1 36.3 51.88 A 4 4 0 0 1 32.76
48.29 A 8.5 8.5 0 0 0 30.6 43.4 L 30.2 39.4 L 32.48 37.79 A 2.5 2.5 0 0 0 33.22 34.54 L 28.8
26.5 A 25.93 25.93 0 0 0 25.27 17 A 20 20 0 0 1 49.83 15.52 L 54 10.55 Z
circle (43.5, 27) r 4.5
```

## Construction, variant B (viewBox 0 0 64 64)

One disc, centre (32, 32), r 28, split into two closed paths that share the profile edge. The ink
crescent runs from the crown H round the rim clockwise to the neck W and back up the face, with
the dot as an evenodd subpath; the head is the complement.

| point | role | coordinates | note |
|---|---|---|---|
| H | crown, on the rim | (24, 5.17) | forehead meets the rim at 72° |
| B | brow | (28.8, 17) | forehead arc r 29.46, centre (−0.25, 21.9), bulging forward 0.7; tangent 35° at H, 10° at B |
| T | nose tip | (38.2, 33) | ridge 30° from vertical, 18.6 long; filleted r 2 between (37.26, 31.41) and (36.68, 34.06) |
| U | under the nose | (32.9, 36.7) | underside 35° below horizontal |
| L | base of the lip plane | (33.3, 41.5) | lip plane 4.8 long, leaning 5° forward |
| chin | | centre (27.7, 47.89), r 8.5 | apex (36.2, 47.89), 2 behind the nose tip |
| Th | throat | (34.4, 53.13) | chin arc ends 38° below the apex |
| W | neck, on the rim | (32.69, 59.99) | neck 7.1 long at 76° below horizontal, meets the rim at 75° |

Ink in front of the face: 26.8 at the brow, 21.8 at the nose tip, 18.9 at the chin, 16 beside
the throat. Dot r 4.5 at (45, 22), at eye level: 7.1 of ink to the rim, 12.5 to the forehead, 8.4
to the nose tip. The head is 44% of the disc.

```
head (#8DA8BB): M 32.69 59.99 A 28 28 0 0 1 24 5.17 A 29.46 29.46 0 0 1 28.8 17 L 37.26 31.41
                A 2 2 0 0 1 36.68 34.06 L 32.9 36.7 L 33.3 41.5 A 8.5 8.5 0 0 1 34.4 53.13 L 32.69 59.99 Z
crescent (ink): M 24 5.17 A 28 28 0 1 1 32.69 59.99 L 34.4 53.13 A 8.5 8.5 0 0 0 33.3 41.5 L 32.9 36.7
                L 36.68 34.06 A 2 2 0 0 0 37.26 31.41 L 28.8 17 A 29.46 29.46 0 0 0 24 5.17 Z
                M 40.5 22 A 4.5 4.5 0 1 1 49.5 22 A 4.5 4.5 0 1 1 40.5 22 Z
```

The head in `#466680` was rendered too: at 16 px it makes a more solid disc, at 48 px it blurs
the seam that is the face. `#8DA8BB` keeps the face and the "sunken" reading; use `#466680` only
where the muted blue would be lost (very small, low-contrast surfaces). `mark-b-light.svg` is the
dark-background version: crescent `#F7F9FA`, head `#466680`, rendered on `#1C2E3D`.

## Lockup

`lockup-a.svg`, viewBox 0 0 196 80, carries the preferred mark (B). Disc at scale 0.6429, 36 px,
x 16..52, y 22..58: centred on the cap band of Inter 600 at 44 px (cap top 24, baseline 56), so a
round shape overshoots the cap height by 2 px each way like an O. Wordmark `thera.` at x 66.5,
baseline 56, letter-spacing −1.5; the t's ink starts 15 px from the disc, the period's ink ends at
180, margins 16 each side (the same measured Inter metrics the dome-horizon and coin-profile sets
use). She looks at her name, and the dot sits between the face and the t.

## Renders, and what each iteration said

`renders/` holds both marks and `mark-b-mono` at 512 / 48 / 16 (pixel-zoomed 48 and 16), plus 32
and 24; both marks light on `#1C2E3D`; the lockup at 320 with real Inter SemiBold. All were read.

1. Draft 1 (before the usage limit): concentric band 10 with round caps, forehead on the circle,
   r 6 chin, sharp tip, dot at nose level. A read as a monoline C with a Pac-Man bump; B (a solid
   disc with the crescent knocked out light and an ink dot) read as a disc with an eye and a mouth.
   Both rejected.
2. Eccentric crescent, four-move face, round caps. A code slip put the forehead arc's centre on
   the wrong side, so the forehead was concave: an old man / witch. B already read as a cameo on a
   two-tone coin. Fixed the bulge.
3. Flat horns, r 3 fillets at the hairline and throat, bigger caldera (r 20). The hairline fillet
   turned into a hair curl, the r 7.5 chin was a ball, and the dot on the axis in the C's mouth
   still said Pac-Man. Flat horns beat round (rendered side by side): round reads as a letter.
4. Hairline fillet removed (an 80° corner, like the Vessel's rim corner, reads as a hairline), chin
   r 9.5 with an r 5 throat fillet, dot raised to eye level and brought closer, horns cut at ±50°.
   The face became a coin portrait rather than a cartoon; the big chin and fillet made a jowl. A
   face at 0.8 scale was rendered and lost its nose at 48 px: the big face stays.
5. Chin r 8.5, throat fillet r 4 (final A). A bolder band (caldera r 18, band 10 at the top) was
   rendered and rejected: it crowds the face and the dot at 48 px. B's mouth raised 1.3 and the
   chin reduced to r 8.5 with a 7-unit neck, so the lower face is no longer bottom-heavy.
6. Production check before review. A's ink box was x 4..50 in a box centred at 32, so the C hugged
   the left edge of its tile (ink centroid x 23.3). Shifts of +2, +3, +4 and +5 were rendered side
   by side at 512 / 48 / 16: +4 centres the composition (bbox centre 31) and puts the back of the C
   on a whole pixel column at both 16 and 48 px, where +3 greys that column and +5 looks
   right-heavy. Every A coordinate moved 4 right (`PARAMS_A["ox"]`); nothing else in the geometry
   changed, and B was already a centred disc. The lockup's transform is now written as
   `scale(0.6429)` rather than the rounded `0.64`, so the disc is exactly 36 px (it was 35.84).
   Measured from the 320 render: disc x 16..52, y 22..58; t ink at 66.9; period ink ends at
   ~180.4; margins 16 / 15.6. Nothing else needed a fix: no feature under 4 units (A's lip plane
   is 4.02, the shortest), no light gap under 7, A's horns 6.48 wide at the cut. The one rule B
   bends is that its ink crescent ends in 72° and 75° corners at the rim rather than 6-unit-wide
   ends; in the two-tone the disc is sealed so these are seams, in mono they are the corners of a
   coin cut by its portrait, and widening them would change the profile, so they stay.

## Preference: variant B

B is the one to show. The goddess is unmistakable at 512 and 48 without being told, the
silhouette is the sealed disc the judges rewarded in round 1, and the two tones tell the whole
story in one object: the cliffs of Thera in ink, the half that sank in sea blue, the Θ of a circle
crossed by a line (the line is a face), and the one person she looks at. It sits beside the
wordmark like an O. Its cost is that single colour drops the head: `mark-b-mono.svg` is a bold
crescent with the face as a negative and a hole, which still reads as a profile at 512 and as a
half-disc with a dot at 16, but is the weaker of the two in mono at 48.

A is the purer Santorini: a crescent island seen from above, one ink, one path, and the cliff
profile is the first thing you see at 512. It is the one to use if a single-colour mark is a hard
requirement. Its cost is the category: a crescent with a face on its inner edge is the man in the
moon's composition, and nothing in the craft fully escapes that.

## What a stranger might see

- **A at 512**: a profile carved into the inside of a crescent, looking at a dot; a face in a cave
  or an alcove; a crescent moon with a face looking at a star (the honest risk); a Greek coin with
  a chunk missing. At 48: a C with a nose and a dot. At 16: a fat C with a dot, close to "C·".
  Not a crack, a lightning bolt or a prohibition sign; not Pac-Man once the dot sits above the axis.
- **B at 512**: a cameo or coin portrait; a head in profile against a dark half, looking at a
  light; a moon phase with a face. At 48: a two-tone disc with a profile. At 16: a half-and-half
  disc with a dot, which is a moon-phase / dark-mode glyph's silhouette, with the seam as its only
  tell. In mono: a crescent with a face-shaped bite and a hole.

## Regenerating

`design/logos/tools/profile-crescent.py` builds every file in this folder from the two parameter
dicts at the bottom of the script (`PARAMS_A`, `PARAMS_B`) and prints the measurements above:

```
python3 design/logos/tools/profile-crescent.py design/logos/concepts/profile-crescent
node design/logos/tools/render.mjs design/logos/concepts/profile-crescent/mark-a.svg design/logos/concepts/profile-crescent/renders
```
