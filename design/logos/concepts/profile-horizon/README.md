# profile-horizon — "The profile is the horizon" (round 2, profile-led)

The dome-horizon idea (a disc split by a line of light) with the line of light drawn as a goddess
lying on her back: sky above, the island below, and the horizon between them is her forehead, nose,
lips, chin and throat. Thera is the sleeper; the Aegean light lies along her face. The sky is one
calm dome whose underside is a straight horizon except where it lifts, in a single soft arch, to
make room for her nose.

Two takes, both single colour (#223848), fills only, arcs and straight lines, no text, no gradients:

- **mark-a** — a full disc (r 26). The coin, the caldera, the Θ of Θήρα with the bar drawn in
  light. Preferred.
- **mark-b** — a semicircle (r 28, flat base). The Santorini dome standing on its base, with the
  sleeper lying along the base line under the vault. Centred by ink mass: the half-disc sits 2
  units above the box's geometric centre so its centroid lands on y 32 (see Production check).

The profile is built from four calm moves, as the round-1 notes asked: a forehead arc, one straight
nose, a short lip plane, one chin arc. Connectors are a straight underside under the nose and a flat
chest to the rim; the only other geometry is three fillets (brow, nose tip, throat) that soften
corners without adding features.

## Idea

- **Sky / island.** The upper mass is the sky (a dome, the Santorini vault). The lower mass is the
  island as a reclining figure, face up, head to the left, body running right toward the wordmark.
- **Horizon of light.** The 8-unit band between them is the horizon at sunset. Its upper edge is a
  dead-straight chord, so the mark keeps the two-mass calm of dome-horizon; its lower edge is the
  face. The nose is the one thing that breaks the horizon, and the sky lifts over it.
- **Relationship.** Two masses meeting across one line; the sky shaped by the person under it.

## Construction, mark-a (viewBox 0 0 64 64)

Disc centre (32, 32), r 26 (x 6..58, y 6..58). Two closed paths, no strokes.

**Face (lower edge of the lower mass), left to right.** Face plane F = y 36.

| point | role | coordinates | note |
|---|---|---|---|
| H | hairline, on the rim | (6.79, 38.37) | the rim is the back of the head; the forehead recedes 2.4 below the brow |
| forehead | arc H → brow | r 162.08, centre (42, 196.58) | almost straight, rising at 12.5° from the rim, 7.8° at the brow |
| B | brow | (20, 36) | concave fillet r 5 between forehead and ridge; the bend is 37° |
| T | nose tip | (28, 28) | ridge 45° from the face plane, 11.3 long, projecting 8; fillet r 2.5 (centre (26.71, 32.83)) |
| N | nose base | (29.82, 34.8) | underside 15° from vertical: the nose has a clear bottom, which is what separates it from a hill |
| L | lip base | (32.82, 34.5) | lip plane 3 long, leaning 0.3 forward; the corner where it meets the chin is the mouth |
| chin | arc L → W | r 10.7, centre (36.08, 44.69) | apex (36.08, 33.99), 0.5 above the lip base; it is the throat that makes it a chin |
| W | throat | (44, 37.5) | 1.5 below the face plane; concave fillet r 4 into the chest |
| E | chest end, on the rim | (57.41, 37.5) | flat chest, the sea-level line |

Face length hairline → throat 37.2; the nose occupies 9.8 of it along the face and is the dominant
move in depth (8 units; the forehead recedes 2.4, the chin rises 0.5 over the lip plane, the throat
drops 1.5). Nose apex interior angle 60°.

**Sky (lower edge of the upper mass).** A flat chord at y 28 from rim to rim, interrupted by one
notch over the nose: the nose outline offset outward by 8 (ridge line, an r 10.5 arc around the
tip's fillet centre, and the same arc meeting the chord on the right, since the offset underside
falls below the chord). Both feet of the notch are filleted r 5 so the sky's edge is a single soft
wave, 19.6 wide at the chord, apex y 22.33. Ink above the notch apex: 16 units.

**Gaps.** 8 over the face plane, 8 round the nose, 6.5 over the forehead at the brow, 6 over the
chin apex, 9.5 over the chest, 10.4 at the hairline. Nothing under 6. No horn or taper: the band is
open at both rim ends, 8 wide on the left and 9.5 on the right.

**Grid.** The sky chord is on y 28, row 7 at 16 px and row 21 at 48 px (the same row dome-horizon
uses), so the band's top edge is a crisp white row at 16 px. The face plane y 36 is row 9. The
disc's margins are 6 on all sides.

Paths as written:

```
sky   M 6.31 28 L 14.62 28 A 5 5 0 0 0 18.15 26.54 L 19.28 25.41 A 10.5 10.5 0 0 1 34.82 26.17
      A 5 5 0 0 0 38.69 28 L 57.69 28 A 26 26 0 0 0 6.31 28 Z
face  M 6.79 38.37 A 162.08 162.08 0 0 1 18.33 36.23 A 5 5 0 0 0 21.19 34.81 L 24.94 31.06
      A 2.5 2.5 0 0 1 29.12 32.18 L 29.82 34.8 L 32.82 34.5 A 10.7 10.7 0 0 1 42.71 36.29
      A 4 4 0 0 0 45.77 37.5 L 57.41 37.5 A 26 26 0 0 1 6.79 38.37 Z
```

## Construction, mark-b

Semicircle centre (32, 44), r 28: flat base y 44, crown y 16, x 4..60. Same grammar, one size down
so the dome keeps 7.9 units of ink above the notch: face plane y 36, sky chord y 28 (row 7 at 16 px
and row 21 at 48 px, the same rows as A), nose projecting 7 with the notch offset 6.5, brow (19, 36),
tip (26, 29), throat (43, 37.5), chest y 37.5 to the rim, base y 44 (row 11 / row 33). The body under
the face is 6.5 to 8 units thick (5.6 at the hairline corner): a figure lying on the ground line under
the vault. Gaps 8 / 6.5 / 6 / 9.5 as in A, with 6.5 round the nose. The bounding box is y 16..44
(margins 16 above, 20 below); the ink centroid is (31.9, 32.2).

## Lockup (lockup-a.svg, viewBox 0 0 195 80)

Mark A at scale 0.68 (disc 35.4 px, 1.105 × the 32 px cap height of Inter 600 at 44 px), disc
centred on the cap band (y 24..56), left edge at x 16. The band of light opens toward the wordmark
and the figure's body runs into the name. Wordmark `thera.` in Inter 600, 44 px, letter-spacing
−1.5, x 65.5, baseline 56: the t's ink starts about 14.5 px from the disc and the period's ink ends
near x 179, leaving 16 px margins. Rendered with the real Inter SemiBold (`renders/lockup-a-320.png`).

## Which variant, and why

**A.** The full disc is the sealed object the brief asks for: at 16 px it is one dark coin with a
crisp 2 px horizon that has a small lift in it, the same family as dome-horizon's favicon, and it
fills a circular avatar. At 48 px it is a disc with a nosed horizon; at 512 px it is a sleeping face
and a sky. B carries the same face, and the dome-on-base silhouette is a more literal Santorini
image, but its body is a thin bar, so at 16 px it collapses into three stripes (dome, light, bar)
rather than one shape, and a wide half-disc sits awkwardly in square and circular slots. B is the
better "picture", A is the better mark.

## What a stranger might see

Readings observed in the renders, roughly in order of likelihood:

- **A reclining face / a sleeping profile** at 512 and 256: the intended read. The nose with its
  steep underside, the short mouth step, the chin and the neck curve are what carry it; without the
  throat drop it was hills.
- **A landscape: hills under a dome, a mountain horizon.** This is the risk of any reclining
  profile and it never fully goes away; it is now the second read, not the first. It is also an
  acceptable second read for Thera (the caldera rim).
- **A coin / a disc cut by a horizon** at 48 px and below, where the face is only a bump. This is
  the dome-horizon family read and is fine; the face is a 128-px-and-up pleasure.
- **A wave** reads were strong in the first draft (see below) and are gone now that the sky edge is
  straight.
- Not seen: moon-with-a-face (no crescent), prohibition sign (no ring), cracked coin (the band is
  8 wide and both edges are calm), cartoon (no feature under 6 except the 0.5 chin rise, which is a
  sagitta on an r 10.7 arc, not a bump).

## How it got here (rendered and rejected on the way)

All iterations are in `renders/iterations/`.

1. **d1, the ribbon.** The whole profile offset outward by 8 so the sky's edge echoed the face. The
   constant-width band became the figure and read as a river / a wave through a mountain range; the
   parallel edges doubled every hump. The nose at 38° with a 60° underside was a mountain peak, and
   the chin (3.7 tall, 13 wide) a second hill.
2. **d2, flat sky with a crest forehead.** Straight sky chord with the nose notch; forehead given a
   3-unit crest and a V-shaped brow dip. Calmer, but the forehead, nose and chin were three bumps of
   similar width with V valleys between: rolling hills.
3. **Sheet 1 (six profile grammars).** What turned hills into a face: a steeper nose underside
   (20° then 15° from vertical, so the nose has a bottom), a concave fillet at the brow instead of a
   V, a short lip plane, a small chin close to the nose, and a throat that drops below the face plane
   with a fillet into the chest. The 45° ridge read most clearly as a nose; the receding (not
   crested) forehead read as the top of a head.
4. **Sheet 2.** Combinations; exposed a thorn at the notch's right foot, because the offset
   underside line falls below the sky chord when the underside is steep, so the notch's right side
   must be the apex arc itself meeting the chord, with a circle-to-line fillet.
5. **Sheet 3 and the final.** Face moved 2 units right so the nose sits near the disc's centre,
   feet fillets r 5, sky chord moved from y 27 to y 28 to land on the 16 px grid, chin sagitta
   trimmed from 2.2 to 1.7 so the gap over the chin apex is 6.

## Regenerating

The marks are parametric. `design/logos/tools/profile-horizon.py` builds either variant from a
parameter dict and prints the geometry; `design/logos/tools/profile-horizon-sheet.py` renders a
contact sheet of several parameter sets (the `sheet*.json` specs are in `renders/iterations/`).

```
python3 design/logos/tools/profile-horizon.py a design/logos/concepts/profile-horizon/mark-a.svg \
  '{"sky_y":28,"forehead_crest":1.5,"x_crest":42,"x_brow":20,"x_throat":44,"chin_s":1.7,"foot_r":5}'
python3 design/logos/tools/profile-horizon.py b design/logos/concepts/profile-horizon/mark-b.svg \
  '{"centre":[32,44],"F":36,"sky_y":28,"gap":6.5,"forehead_crest":1.5,"x_crest":43,"x_brow":19,"x_throat":43,"chin_s":1.7,"foot_r":5}'
```

The full printed geometry for both is saved in `renders/notes-a.txt` and `renders/notes-b.txt`.

## Renders

`renders/`: both marks at 512 / 48 / 16 with pixel-zoomed 48 and 16; the lockup at 320 with real
Inter; `mark-a-light-*` is the same geometry in #F7F9FA on #1C2E3D (the light version holds; the
band becomes a dark horizon and the face reads the same way).

## Production check (pre-review)

Every SVG re-rendered and measured from the 512 and 2048 rasters (ink bbox, ink centroid, connected
components, edge-to-edge distance between the two masses, lockup ink extents).

- **A**: bbox x 6.4..57.6, y 6..58, centroid (32.05, 32.21): centred. Two masses, no slivers or
  thorns, nothing clipped. Minimum gap 6.2 units, over the chin apex (the 8-unit band narrows to 6
  there; nothing under 6). Chord y 28 and face plane y 36 are whole rows at 16 and 48 px. Unchanged.
- **B**: was centred (32, 48), bbox y 20..48, ink centroid y 36.2: the half-disc hung 4 units low.
  Moved up 4 (centre (32, 44)); geometry otherwise identical. Up 2 would centre the bbox but puts
  every horizontal edge on a half pixel at 16 and 48 px; up 4 keeps chord / face / base on whole rows
  and lands the centroid on y 32, the normal optical correction for a bottom-heavy shape. Minimum gap
  6.1, over the chin.
- **Lockup**: ink margins 16.5 left / 15.8 right; disc spans y 22.3..57.7, centred on the cap band
  (24..56) and on the `h` ascender-to-baseline band (23.6..56); disc-to-`t` gap 14.6 (0.46 cap height).
  Unchanged.
- Sub-4-unit elements, kept on purpose: the lip plane (3 long, 0.3 rise), the chin sagitta (1.7 over
  an 11.6 chord, 0.5 above the lip base), the nose-base rise (1.2) and the throat drop (1.5). They are
  modulations of one continuous edge, not separable bumps; the nose (8 units) is the only feature.
  Removing them would leave a lone peak, so that is a design call, not a production fix.
- Honest read at 512: the first read for a stranger is still a landscape (a peak and a low hill under
  a sky), with the reclining face as the second read; at 48 and 16 both marks are a coin / a dome cut
  by a horizon with a lift in it. B at 16 px is a dome, a white row and a bar, three stripes, not one
  sealed shape.
