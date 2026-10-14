# coin-profile — "Goddess on the coin" (final)

An ancient coin of Thera with the goddess struck into it. One solid disc; her head in profile is
knocked out as a single band of light that runs from the top rim to the bottom rim, the way a coin
portrait is cropped by the rim at the crown and at the neck. The band's back edge is one vertical
cut; its front edge is the profile: brow, one straight nose, lips, chin, throat, neck. The coin is
left in two pieces, the body of the coin behind her and the crescent in front of her face, which is
the Santorini crescent and the moon over the caldera. Light on dark she turns positive: a dark head
between two light pieces. She looks right, toward the wordmark.

Two closed paths, arcs and straight lines only, no strokes, no masks, no gradients, no text. The
same object in every file; only colour and frame change.

## What changed from the concept, and why

Start point: concept `coin-profile`, variant A (all three judges' choice). Variant B is dropped.

| Feedback | Action |
| --- | --- |
| The back edge is an r147 arc leaning 6° for no stated reason, so the left lens tilts; make it vertical or concentric, and snap it to x = 24 (craftsperson, product). | **Vertical line at x = 24.** The coin body is now a clean circular segment (x 4..24) and the back of the head is one straight cut. x = 24 is column 6 at 16 px, column 18 at 48 px, column 12 at 32 px. |
| Both band edges land on half pixels, so the 16 px favicon is a grey slit; snap the back edge and the neck exit to whole pixels the way theta-caldera does (product, strategist). | **Both band exits are 12 units wide (x 24..36)** at the crown and at the neck, and the neck leaves the rim vertically at x = 36 (column 9 at 16 px, 27 at 48 px). At 16 px the band is three clean light columns at the top and the bottom with the face between them. |
| Keep the band wide at the rim so it never closes into a crack; keep it at least 3 px at 16 (strategist, product); hold it between 8 and 11 (craftsperson). | The exits are 12 (3 px at 16), the craftsperson's upper number plus one pixel-true unit. Crowns of 34, 35 and 36 were rendered side by side: 34 and 35 both leave the third column grey at 16 px, and 36 is the only width that is crisp. The face is where the band must swell: 13 at the brow, 20 at the nose tip, 15 at the lips, 16 at the chin, back to 12 at the neck. The two parallel-sided sections at the exits are what make it a band with a face on its front edge rather than a wedge. |
| The nose is a 15-unit, 33° beak with an r2 tip (craftsperson). | **Nose at 24.8° from vertical**, 16 tall (29% of the 55.4-unit profile), projecting 7.4 past the brow; tip corner 102°, filleted r2 (a softening, not a feature). The forehead chord now leans only 2.7°, so the bridge is a single calm bend. |
| The chin arc has a sagitta of 1.76 and meets the neck in a visible kink; fillet the throat with an r4 (craftsperson). The lower face has three moves where two would do; run the chin tangent into the neck as in B (product). | **Lower face rebuilt.** Two moves: a short lip plane and one r8 chin arc that sweeps 88° through the apex and under the chin. The arc runs into an **r4 concave throat fillet** that is tangent to both the chin and the neck, and the neck is a straight vertical line to the rim. No corner anywhere below the lips. B's tangent neck was tried first (iteration 1): with the neck exit fixed at x = 36 a tangent neck leaves the throat ahead of the lip base, which reads as a ball chin with no throat; the fillet puts the throat 2.9 behind the lip base, where a throat is. |
| Adopt the light-on-dark version as the app icon, where the head goes positive (strategist, product). | `app-icon.svg` is the dark tile with the light mark; the head is the dark shape. It is the primary icon. |
| Drop B (all three). | Dropped. |

## Construction (viewBox 0 0 64 64)

Disc: centre (32, 32), r 28 (x 4..60, y 4..60). Two closed paths.

**Coin body** (behind the head): the segment of the disc left of x = 24.

```
M 24 5.17 A 28 28 0 0 0 24 58.83 Z
```

**Crescent** (in front of the face): from the neck exit up the right rim to the crown, then down
the profile. Points, top to bottom:

| point | role | coordinates | note |
| --- | --- | --- | --- |
| H | crown, on the rim | (36, 4.29) | forehead meets the rim at 79° |
| B | brow | (36.6, 17) | forehead arc H→B, r 40, chord 12.7 leaning 2.7°, sagitta 0.5 bulging forward |
| T | nose tip | (44, 33) | ridge B→T is 24.8° from vertical, 16 tall; corner 102°, filleted r 2 (tangent points (43.32, 31.54) and (42.71, 33.97)) |
| U | under the nose | (38.7, 37) | underside T→U, 37° below horizontal, 6.6 long |
| L | base of the lip plane | (38.89, 42.19) | lip plane U→L, 5.2 long, leaning 2.1° forward; the mouth is the 35° corner where it meets the chin arc, not drawn |
| chin | | centre (32.5, 47), r 8 | arc L→Th from −37° to 51.3°; apex x 40.5 at y 47, 3.5 behind the nose tip and 1.6 ahead of the lip base |
| Th | throat, on the chin | (37.5, 53.24) | the r 4 fillet, centre (40, 56.37), is tangent to the chin here and to the neck line at Tn |
| Tn | base of the throat | (36, 56.37) | 2.9 behind the lip base |
| W | neck, on the rim | (36, 59.71) | vertical neck Tn→W, 3.35 long, meets the rim at 69° |

```
M 36 59.71 A 28 28 0 0 0 36 4.29 A 40 40 0 0 1 36.6 17 L 43.32 31.54 A 2 2 0 0 1 42.71 33.97
L 38.7 37 L 38.89 42.19 A 8 8 0 0 1 37.5 53.24 A 4 4 0 0 0 36 56.37 L 36 59.71 Z
```

**The four moves** are the forehead arc, the nose ridge, the lip plane and the chin arc. The
underside, the throat fillet and the neck are connectors; the tip fillet is a softening.
Classical thirds: hairline to brow 12.7, brow to nose base 20 (nose 16 plus the underside), nose
base to throat 16.

**Band width** (back edge to profile): 12.0 at the crown chord, 12.1 to 12.5 down the forehead,
13.1 at the brow, 20.0 at the nose tip, 16.0 under the nose, 14.8 at the lips, 16.4 at the chin,
12.8 at the throat, 12.0 at the neck chord. **Crescent** (profile to rim): 6.3 just under the crown,
11.7 at y 9, 17 to 19 along the forehead and nose, 16 at the tip, 20 at the lips, 14.5 at the chin,
8.6 at y 57 above the neck exit. **Corners at the rim**: body 73° top and bottom, crown 79°, neck
69°. Nothing tapers to a point; the crescent's ends are cut by the band's exits at those angles.

**Areas**, measured from the 512 px raster: body 787 (32% of the disc), head 826 (34%), crescent
850 (34%). The ink centroid is (32.14, 31.72) and the light band's centroid (31.67, 32.51): light
high and slightly back, mass low, which is why the disc does not look like it is sliding.

**Pixel grid.** At 16 px (1 px = 4 units) the back edge is the boundary of column 6, the crown and
neck fronts the boundary of column 9, and the nose tip reaches column 11; at 48 px (1 px = 4/3)
they are columns 18, 27 and 33; at 32 px, 12, 18 and 22. The face itself is diagonals and arcs and
is grey at 16 px by nature, which is what the favicon fixes.

## Files

| file | contents |
| --- | --- |
| `mark.svg` | primary mark, two paths, ink #223848 |
| `mark-light.svg` | same geometry in #F7F9FA, for #1C2E3D and darker; the head becomes the dark shape between two light pieces |
| `mark-accent.svg` | two-tone: coin body #466680, crescent #8DA8BB. Large light-background moments only (hero, print, 128 px and up) |
| `favicon.svg` | the profile re-cut in straight moves on the 16 px grid; flips to #F7F9FA under `prefers-color-scheme: dark` |
| `app-icon.svg` | 64 × 64, rx 14, #1C2E3D tile, light mark at 0.66 (disc 37 units, 58% of the tile). The primary icon |
| `app-icon-light.svg` | the inverse: #F7F9FA tile, ink mark, for light-mode icon slots |
| `lockup-horizontal.svg` | mark + "thera." |
| `lockup-stacked.svg` | mark over "thera." |

**Accent.** Three versions were rendered on #F7F9FA at 512 and 48. Body #466680 with the crescent
#8DA8BB is the one shipped: the crescent becomes visibly a second thing, the moon in front of her
face, which the single-colour mark only implies, and the two pieces were already separate so
nothing is broken that was sealed. Its cost is that the face is drawn on the muted piece (2.3:1 on
#F7F9FA), so it is restricted to large sizes; `mark.svg` is the mark. The inverse (body muted,
crescent primary) keeps the face but turns the body of the coin into a pale backdrop and makes the
mark front-heavy; mono #466680 was safe and added nothing.

**Favicon.** The same disc and the same vertical cut at x = 24, with the profile reduced to
straight moves that sit on the grid: forehead at x 36 down to y 20, nose ridge to a tip on (44, 32),
underside to (40, 36), one lip-and-chin plane at x 40 down to y 48, back to the neck at (36, 52) and
down to the rim.

```
M 36 59.71 A 28 28 0 0 0 36 4.29 L 36 20 L 44 32 L 40 36 L 40 48 L 36 52 Z
```

At 16 px it is a disc with three clean light columns at the top and the bottom, a two-column nose
on rows 5–8 and a one-column step for the mouth and chin on rows 9–12. At 32 px every vertical
edge is on a pixel and the nose and chin step read as a face. Use it at 16 and 32; at 48 and above
use `mark.svg`, which was also checked at 32 and 24 px (nose visible at both, back edge crisp at
both).

**App icon.** 0.60 and 0.66 were rendered side by side at 256; 0.60 sits small in the tile,
because the disc fills only 56 of its 64 box. At 0.66 the disc is 58% of the tile with 13.5-unit
margins, in line with the other finalists (52 to 57%). The dark tile is the recommendation: on it the goddess is the positive dark head, which is the
strongest single image of this mark.

## Lockups

Metrics are from the real Inter SemiBold (the variable font installed at
`~/.local/share/fonts/Inter-Variable.ttf`), measured in the browser for the dome-horizon set: at
44 px the cap band is 32 tall and "thera." with letter-spacing −1.5 has 113 px of ink starting
0.5 px right of the text origin. Both renders were measured back from the raster.

**Horizontal** (viewBox 0 0 196 80): the mark at 0.6429 (disc 36 px, x 16..52, y 22..58), centred
on the cap band (cap top 24, baseline 56), so the disc overshoots the cap height by 2 px top and
bottom, like an O. Wordmark at x 66.5, baseline 56: the t's ink starts at x 67 (15 px from the
disc; measured 14.8) and the period's ink ends at x 180 (measured 179.5). Margins 16 left and
right, 22 top and bottom. The face is still a face at 36 px, and she looks at her name.

**Stacked** (viewBox 0 0 160 146): the mark at full size (disc 56 px, x 52..108, y 20..76) above
the wordmark at 44 px, baseline 126 (cap top 94, 18 px under the disc). Wordmark ink runs x 26..139;
the disc's axis at x 80 is midway between the centre of "thera" (76.5) and of "thera." (82.5), as
in the other finalists, since centring on the whole string pushes the letters visibly left and
centring on the letters alone leaves the period hanging. Margins 20 top and bottom.

## Iterations, and what each render said

1. Vertical back edge at 24, crown at 34, nose 25°, r9 chin with B's tangent neck to x = 36. The
   crack was gone and the stele-like head on dark was immediately the best image. But with the
   neck exit pinned at 36 the tangent point lands ahead of the lip base: a ball chin, no throat.
2. r4 concave throat between the chin and a vertical neck. The throat appeared and the neck
   exited cleanly; the r9 chin was still a knob with a 5-unit recession to the neck.
3. Crowns 34 / 35 / 36 rendered side by side at 512 and 16. Only 36 gives a crisp three-column
   band at 16 px; 34 and 35 leave the third column half grey. 36 taken; the band's exits are
   now both exactly 12.
4. Chins r9 (apex 41), r10 (apex 41, flatter) and r8 (apex 40.5) at crown 36. r10 dropped the
   jaw toward the rim and read heavy; r8 is compact, leaves a short true neck (3.35) below the
   throat, and puts the apex 3.5 behind the tip, the concept's proportion. r8 taken.
5. Accent three ways (see Files). Favicon compared with the plain mark at 16 and 32: the
   re-cut profile is crisper at both.

## Renders

`renders/` holds every file at the sizes in the brief: `mark`, `mark-light` (on #1C2E3D),
`mark-accent` (on #F7F9FA) and `favicon` at 512 / 48 / 16 with pixel-zoomed 48 and 16; `app-icon`
and `app-icon-light` (on #1C2E3D) at 256; both lockups at 320 with real Inter. Extra checks:
`mark` at 32 and 24, `favicon` at 32. All were read.

## Regenerating

The set is parametric. `design/logos/tools/coin-profile-final.py` builds every file from the
`PARAMS`, `FAVICON`, `LOCKUP` and `ICON` dicts at the bottom of the script, and `--report` prints
the band widths, corner angles and nose, chin and throat numbers quoted above.

```
python3 design/logos/tools/coin-profile-final.py design/logos/final/coin-profile --report
node design/logos/tools/render.mjs design/logos/final/coin-profile/mark.svg design/logos/final/coin-profile/renders
```

## Why this holds

It is the only mark in the set that says "person" and "place" in the same object. A stranger at 512
sees a coin with a face cut into it within a second; at 48 the nose, lips and chin are still there;
at 16 it is one calm disc with a straight light band and a bump, two crisp edges and no slit. It
survives a single colour on any background, and on dark it becomes a positive head, which is what
the app icon uses. It carries Thera (the coin), the goddess, the crescent of Santorini and the Θ of
a circle crossed by a line, without illustrating any of them, and it sits beside the wordmark at
cap height like an O.

## Usage notes

- Minimum clear space: the band width (12 units at mark scale) on all sides.
- Use `mark.svg` / `mark-light.svg` wherever the mark must carry on its own; the accent is for
  large light-background moments only.
- In a circular avatar, place the mark at about 0.66 of the circle's diameter, centred; the
  vertical cut should stay vertical.
- Do not rotate, outline, stroke or re-space the pieces; the vertical cut at x 24 and the 12-unit
  exits are the mark.
