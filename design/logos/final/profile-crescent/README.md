# profile-crescent — "Caldera and Sunken Head" (final)

Santorini from above. The disc is Thera before the eruption; the ink crescent is the ring of
cliffs that is left, and its inner edge is the goddess in profile, looking across the caldera at the
one island that matters. The void behind her is the half of the island that sank. In single colour
the mark is that crescent alone: the cliffs in ink, the head as the empty sea, the island knocked
out of the ink where her gaze lands. In two tones the sunken half is filled with sea blue and the
disc is sealed again.

Start point: concept `profile-crescent`, variant B (the judges' preference), rebuilt mono-first.
One closed path with the dot as an evenodd subpath; arcs and straight lines only; no strokes, no
masks, no gradients, no text. It is the same geometry in every file; only colour, scale and the
favicon's reduction change.

## What changed from the concept, and why

| Feedback | Action |
| --- | --- |
| Solve mono first: crescent as ink, head as void, dot kept; make the mono file the primary (strategist, craftsperson). | `mark.svg` is now the single-colour crescent. The two-tone is no longer the primary; it is `mark-duotone.svg` (ink + sea blue, the picture the judges chose) and `mark-accent.svg` (#466680 + #8DA8BB). The lockups and app icons carry the mono mark. |
| Pull the seam about 3 units left so the crescent is never thin (craftsperson). | Every profile point moved 3 left: hair (24, 5.17) → (21, 6.25) on the rim, brow (28.8, 17) → (25.8, 17), nose tip (38.2, 33) → (35.2, 33), and so on. Ink in front of the nose tip grew from 21.8 to 25.4 units, in front of the chin from 18.9 to 21.9, beside the throat from 16 to 19. The head is now 38% of the disc instead of 44%, and the crescent at 48 px is a solid D rather than a lumpy one. |
| Soften the crown wedge with an r3 fillet (craftsperson); horns must end at least 6 units wide (round-1 rule). | Both horns are filleted, crown and neck. r3, r3.5 and r4 were rendered side by side at 512 / 48 / 16. r3 ends in a 4.7-unit chord and reads as a comma curl at 512; r4 ends in 6.35 (crown) and 6.59 (neck) chords, meets the 6-unit rule, and reads as a blunt terminal. **r4** is final. In the two-tone the fillets leave a 4-unit blue sliver at each horn tip that reads as the crescent's rounded end sitting inside the disc; it is sub-pixel at 48. |
| Nudge the dot lower and further forward so it never reads as a displaced eye (strategist); the r4.5 dot is a floating 2-px speck at 16 (craftsperson); drop the dot below 24 px (product). | Dot moved from (45, 22), which was at eye height, to **(46.3, 28)**: 6 lower and 1.3 forward, in front of the bridge of the nose, so the gaze runs about 15° downward from the eye to the island and nothing sits where an eye would be. Radius 4.5 → **5.2** (see the period echo below). Gaps: 7.95 to the rim, 7.25 to the nose tip, 7.31 to the ridge. The dot is kept in `mark.svg` (6.8 px at 48, where it reads as the island) and **removed from `favicon.svg`**, which is the file for 16 and 32 px. |
| Make the island dot echo the wordmark's period explicitly in the lockup (strategist). | The period of Inter SemiBold at 44 px is 6.875 px square (measured from an 8× raster: x 107..113.875, y −6.5..0.375 from the origin). At the lockup's scale of 0.68 the r5.2 dot is 7.07 px. Same size, same colour relationship (a round light hole in ink beside a round ink dot on light), and the dot sits between the face and the t. |
| Keep B's sealed disc outline but carry the head as a light knockout, as coin-profile does (product). | Not taken. A light band for the head would put ink behind the head, which is coin-profile's mark, and the mono would then show a different object from the two-tone the judges chose (a band of light instead of a sunken half). The sealed disc is kept in the two-tone; in mono the open side is the point: the half that sank is not drawn. The seam shift and the fillets were the way to make that crescent hold on its own. |

Rendered on the way and rejected: r3 fillets (curl); a flat radial cut on the horns as in variant A
(a ray from the centre runs almost parallel to the crescent at the crown, so there is no width to
cut; the fillet is the only blunt end this geometry allows); the full profile in the favicon (its
lip and chin are sub-pixel lumps at 16 and 32); horizontal lockup discs of 36 and 40 px (36 sits
light beside the type, 40 overshoots the ascender visibly); app-icon scales of 0.66 and 0.76 (0.66
sits small, 0.76 crowds the corners).

## Construction (viewBox 0 0 64 64)

Disc: centre (32, 32), r 28 (x 4..60, y 4..60). The ink crescent runs from the crown fillet
clockwise over the top and down the right side to the neck fillet, then back up the profile.

Profile, top to bottom (the inner edge of the crescent, looking right):

| point | role | coordinates | note |
|---|---|---|---|
| H | crown, on the rim | (21, 6.25) | the forehead meets the rim at 75.5°; filleted r 4 (below) |
| B | brow | (25.8, 17) | forehead arc H→B r 25.1, centre (1.12, 21.57), bulging forward 0.7; tangent 37.6° from vertical at H, 10.5° at B |
| T | nose tip (corner) | (35.2, 33) | ridge B→T 30.4° from vertical, 18.56 long (35% of the 53.65-unit profile); filleted r 2 between (34.26, 31.41) and (33.68, 34.06); the bridge bend at the brow is 20°, the single Greek line |
| U | under the nose | (29.9, 36.7) | underside 34.9° below horizontal |
| L | base of the lip plane | (30.3, 41.5) | lip plane 4.82 long, leaning 4.8° forward; the mouth is the corner where it meets the chin |
| chin | | centre (24.7, 47.89), r 8.5 | apex (33.2, 47.89), 2 behind the nose tip |
| Th | throat | (31.4, 53.13) | the chin arc ends 38° below its apex |
| W | neck, on the rim | (29.71, 59.91) | neck 6.99 long at 76° below horizontal, meets the rim at 80.7°; filleted r 4 (below) |

Thirds: hairline–brow 10.75, brow–nose base 19.7, nose base–neck 23.21. Forehead short, nose
dominant, four calm moves (forehead arc, nose, lip plane, chin arc) with the underside and the neck
as connectors; no feature under 4 units (the lip plane, 4.82, is the shortest).

Horn fillets, r 4, on the ink side:

- crown: centre (27.12, 8.5); tangent to the rim at (26.31, 4.59) and to the forehead arc at
  (23.55, 10.3); end chord 6.35.
- neck: centre (34.85, 55.83); tangent to the rim at (35.32, 59.8) and to the neck line at
  (30.97, 54.86); end chord 6.59.

Island dot: centre (46.3, 28), r 5.2, knocked out (evenodd). 7.95 of ink to the rim, 7.25 to the
nose tip, 7.31 to the ridge, 18 to the brow.

Ink in front of the face: 29.8 at the brow, 25.4 at the nose tip, 21.9 at the chin, 19 beside the
throat. Ink box x 23.55..60, y 4..60; ink centroid (42.1, 30.3), measured from the 512 raster.

```
crescent: M 26.31 4.59 A 28 28 0 1 1 35.32 59.8 A 4 4 0 0 1 30.97 54.86 L 31.4 53.13
          A 8.5 8.5 0 0 0 30.3 41.5 L 29.9 36.7 L 33.68 34.06 A 2 2 0 0 0 34.26 31.41 L 25.8 17
          A 25.1 25.1 0 0 0 23.55 10.3 A 4 4 0 0 1 26.31 4.59 Z
dot:      M 41.1 28 A 5.2 5.2 0 1 1 51.5 28 A 5.2 5.2 0 1 1 41.1 28 Z
head:     M 35.32 59.8 A 28 28 0 0 1 26.31 4.59 A 4 4 0 0 0 23.55 10.3 A 25.1 25.1 0 0 1 25.8 17
          L 34.26 31.41 A 2 2 0 0 1 33.68 34.06 L 29.9 36.7 L 30.3 41.5 A 8.5 8.5 0 0 1 31.4 53.13
          L 30.97 54.86 A 4 4 0 0 0 35.32 59.8 Z
```

The head path is the exact complement of the crescent inside the disc (same points, reversed), so
the two-tone files have no overlapping fills and the seam is one edge.

**Position in the box.** The disc stays centred at (32, 32) in every mark file, so the mono
crescent and the two-tone disc are the same object in the same place: in a circular avatar the
crescent sits on the circle's right edge and the head's void is the avatar's own background, which
is the sunken-half reading. The crescent's own ink is therefore right of the box centre (bbox centre
41.6); the favicon, the app icons and the lockups place it by its ink, as described below. Minimum
clear space around the ink: 8 units at mark scale (the width of the light gaps inside the mark).

## Files

| file | contents |
|---|---|
| `mark.svg` | primary mark, single path, ink #223848 |
| `mark-light.svg` | same geometry in #F7F9FA for #1C2E3D and darker (rendered on #1C2E3D). The strongest single-colour reading of the set: light cliffs, the head as the dark sea |
| `mark-accent.svg` | two-tone: crescent #466680, sunken head #8DA8BB (the one secondary element), dot knocked out |
| `mark-duotone.svg` | the colour mark the judges chose: crescent in ink, head #8DA8BB. For hero and print moments on light backgrounds |
| `favicon.svg` | 16 px version, see below |
| `app-icon.svg` | 64 × 64 tile, rx 14, #1C2E3D, light mono mark at 72% (disc 40.3 units, 63% of the tile), ink box centred: translate (1.92, 8.96) |
| `app-icon-light.svg` | the same tile in #F7F9FA with the ink mark, for light icon slots |
| `app-icon-duotone.svg` | the dark tile with the head filled in #466680, so the icon is a sealed disc. Quieter; the mono tile is the recommendation |
| `lockup-horizontal.svg` | mark + "thera." |
| `lockup-stacked.svg` | mark over "thera." |

### Favicon

`favicon.svg` is the mark reduced to a Cycladic head: the same crescent, crown and nose, with no
island dot (a 2.6-px speck at 16) and no lip or chin (sub-pixel lumps at 16 and 32), one straight
line from under the nose to the rim instead. It is cut to the 16 px grid (1 px = 4 units): the
disc centre slides 8 left to (24, 32), so the rim's right edge is x 52 (column 13), the vertical
edge under the nose is x 20 (column 5), the nose tip is (28, 32) and the mouth corner (20, 36),
all on pixel boundaries; the ink spans x 15.88..52, so the tile has 4 px of margin on the left and
3 on the right. At 16 it is one D with a single nose wedge in its upper left; at 32 the nose is
unmistakably a nose. Path:

```
M 18.63 4.52 A 28 28 0 1 1 24 60 A 4 4 0 0 1 20 56 L 20 36 L 26.03 32.98 A 2 2 0 0 0 26.83 30.13
L 18 16 A 21.79 21.79 0 0 0 15.88 10.35 A 4 4 0 0 1 18.63 4.52 Z
```

Use it at 16 and 32; at 48 and above use `mark.svg`.

### Lockups

Type metrics were measured from an 8× canvas raster of Inter SemiBold (the variable font the site
ships, installed on this machine) at 44 px with letter-spacing −1.5: ink x 0.375..113.875 from the
text origin, cap top −32, x-height −24.25, period x 107..113.875, y −6.5..0.375.

`lockup-horizontal.svg`, viewBox 0 0 185.31 80. Mark at scale 0.68 (disc 38.08 px, y 20.96..59.04),
centred on the cap band (cap top 24, baseline 56) so the round shape overshoots the cap height by
3 px each way like an O; the crescent's ink starts at x 16.01 and the rim ends at 40.8. Wordmark at
x 55.43, baseline 56: 15 px from the rim to the t's ink; the period's ink ends at x 169.3; margins
16 each side. The dot (7.07 px) sits between the nose and the t at y 33.7..40.8, in the upper half
of the x-height band, and is the period's size. She looks at her name.

`lockup-stacked.svg`, viewBox 0 0 153.5 144.5. Mark at full size (disc 56 px) at translate
(29.47, 16); wordmark at x 19.62, baseline 124 (ink x 20..133.5); 16 px from the rim to the cap
height; margins 20. The mark's ink box is centred at x 71.25, which is 2.5 left of the midpoint
rule the sibling sets use (midway between the centre of "thera" and of "thera."): because the
crescent's mass is on its right and the period is light, that shift puts the crescent's ink
centroid on the wordmark's ink centroid (71.42 vs 71.40, measured from the 320 render). Both
placements were rendered; this one reads centred.

## Renders

`renders/` holds every file at the brief's sizes: `mark`, `mark-light` (on #1C2E3D),
`mark-accent`, `mark-duotone` and `favicon` at 512 / 48 / 16 with pixel-zoomed 48 and 16;
`app-icon`, `app-icon-light` (on #1C2E3D) and `app-icon-duotone` at 256; both lockups at 320 with
real Inter SemiBold. All were read. Extra checks outside the brief: the mark at 32 and 24 (the face
still reads at 24; below that use the favicon), `mark-light` at 32, the favicon at 32, and the
horizontal lockup at 160 px wide. `_review-marks.png` and `_review-icons-lockups.png` are contact
sheets of the above.

## What a stranger might see

- **At 512, mono**: a profile cut out of a dark half-disc, looking at a dot; a cameo in negative; a
  dark D with a face. The honest risk is still "moon with a face and a star", but the silhouette is
  a fat D, not a thin crescent, and the dot sits in front of the nose, not at the eye.
- **At 512, two-tone**: a disc split by a profile, one half dark and one half sea blue, with a light
  island in the dark half. A coin, a cameo, a moon phase.
- **At 48**: a solid D with a nose and a chin and a hole; the face reads without being told.
- **At 16** (`favicon.svg`): one D with a notch in its upper left. Not a crack, not a bolt, not a
  prohibition sign, not Pac-Man (the opening is not a mouth on the axis).
- **Light on dark**: the cliffs lit, the head as night sea. The most convincing single-colour form.

## Why this is the one to show

It is the mark in the exploration that tells the founder's story most directly, the goddess, the
caldera, the sunken half and the one person she is looking at, and it now does so in one colour
without a second tone to lean on. The profile is the same four calm moves the Vessel used, so it
holds the same craft standard at 48; the horns are blunt; the dot is the period; the favicon is a
Cycladic head cut on the pixel grid; and the two-tone the judges liked is unchanged except for the
seam moving 3 units and the horn tips rounding. Its remaining cost is categorical rather than
formal: a profile beside a dot will always have a moon cousin, and the mono crescent is a less
symmetrical object than a sealed coin, so it needs its ink, not its box, to be centred.

## Regenerating

`design/logos/tools/profile-crescent-final.py` builds this whole set from the parameter dict at
the bottom of the script and prints the measurements above; parameters can be overridden with a
JSON argument.

```
python3 design/logos/tools/profile-crescent-final.py design/logos/final/profile-crescent
for f in design/logos/final/profile-crescent/*.svg; do node design/logos/tools/render.mjs "$f" design/logos/final/profile-crescent/renders; done
```

(`mark-light` and `app-icon-light` are rendered with bg `#1c2e3d`; app icons at 256; lockups at 320.)
