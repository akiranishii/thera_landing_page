# coin-profile — "Goddess on the coin" (round 2, profile-led)

An ancient Thera coin with the goddess struck into it. A solid disc; the head in profile is knocked
out as one bold band of light that runs from the top edge of the coin to the bottom edge, the way a
coin portrait is cut off by the rim at the crown and the neck. The band's front edge is the profile
(brow, nose, lips, chin); its back edge is one calm arc. The coin is left in two pieces: the body of
the coin behind the head, and a crescent in front of the face, which is the Santorini crescent and
the moon over the caldera. The goddess looks right, toward the wordmark.

Variant B is the same goddess as a positive silhouette: the head side of the coin with everything in
front of the face removed, a half-coin whose cut is the profile.

Both are arcs and straight lines only, ink #223848, no strokes, no masks, no gradients, no text. No
secondary colour is used.

## What round 1 taught, and how this mark applies it

- The round-1 coin was a 7-unit zigzag cut (forehead, nose, underside, lip, chin, five changes of
  direction at uniform width) and read as a crack or a lightning bolt. Here the cut is a bold object,
  9 to 17 units wide, with a single straight-ish back edge, so the light shape reads as a head
  rather than a line.
- The profile is four moves: a forehead arc (r 40, almost straight), one straight nose, a short
  lip plane, one chin arc. The underside of the nose and a short neck are the connectors. The nose
  is the dominant move: 16.5 units tall, 30% of the 55.3-unit profile, 33° from vertical, projecting
  10.8 units past the brow. The forehead is 13 units and leans 14°, so the bridge bend is 19°, the
  single Greek line. The chin apex sits 3.5 behind the nose tip and 1.45 ahead of the lip base; the
  mouth is implied by the corner where the lip plane meets the chin arc, not drawn.
- No light gap under 9 units (the band's crown chord is 9.2, its neck chord 10.6). The nose tip
  is softened with an r 2 corner, which is a fillet, not a feature.
- The crescent in front of the face does not taper to a horn. Both of its ends are cut by the band's
  exits at blunt angles: 78° at the crown, 65° at the neck. The coin body's two corners are 85°.
  At 16 px every piece ends in solid pixels.
- The silhouette is a sealed disc (x 4..60, y 4..60). At 16 px it is one disc with a curved light
  slit, the same family as dome-horizon's slit; the face is a 48-px-and-up reading.

## Construction, variant A (viewBox 0 0 64 64)

Disc: centre (32, 32), r 28. Two closed paths: the coin body (behind the head) and the front crescent.

Front edge of the band (the profile), top to bottom:

| point | role | coordinates | note |
|---|---|---|---|
| H | crown, on the rim | (31, 4.02) | forehead meets the rim at 78° |
| B | brow | (34.2, 17) | forehead arc H→B, r 40, bulging forward 0.6 |
| T | nose tip | (45, 33.5) | straight ridge B→T, 33° from vertical; corner filleted r 2 (tangent points (43.98, 31.94) and (43.52, 34.63)) |
| U | under the nose | (39.5, 37.7) | underside T→U, 37° below horizontal |
| L | base of the lip plane | (40.05, 42.91) | lip plane U→L, 5.2 long, leaning 6° forward |
| chin | | centre (33.5, 47.5), r 8 | chin arc L→Th from −35° to +42°; apex x 41.5 at y 47.5 |
| Th | throat | (39.45, 52.85) | the arc's tangent here is 48° below horizontal; the neck bends 30° steeper |
| W | neck, on the rim | (38.07, 59.33) | neck Th→W, 78° below horizontal, meets the rim at 65° |

Back edge of the band: one arc from Hb (22, 5.85) on the rim to Wb (27.5, 59.64) on the rim,
r 147.43 (centre (−119.43, 47.48)), sagitta 2.5, bulging toward the face. It leans 6°, like the
forehead.

Band width (back edge to profile): 9.2 at the crown chord, 9.3 down the forehead, 9.8 at the brow,
17.4 at the nose tip, 11.9 at the lips, 13.5 at the chin, 10.6 at the neck chord. Front crescent
(profile to rim): 10.9 just under the crown, 20.5 at the forehead, 15.3 at the nose tip, 18 at the
lips, 13.5 at the chin, 6 at y 57 just above the neck exit. Coin body: 18 to 24 wide, the dominant mass.

Paths, as written in `mark-a.svg`:

```
coin body:      M 22 5.85 A 28 28 0 0 0 27.5 59.64 A 147.43 147.43 0 0 0 22 5.85 Z
front crescent: M 38.07 59.33 A 28 28 0 0 0 31 4.02 A 40 40 0 0 1 34.2 17 L 43.98 31.94
                A 2 2 0 0 1 43.52 34.63 L 39.5 37.7 L 40.05 42.91 A 8 8 0 0 1 39.45 52.85
                L 38.07 59.33 Z
```

The band is 9 units wide where it enters and leaves the coin and swells only where the nose is,
so what you see first is a coin with one cut, and second that the cut is a face.

## Construction, variant B (viewBox 0 0 64 64)

One closed path: the disc, centre (40.5, 32), r 28, cut by the same profile. Everything in front
of the face is removed, so the ink is the head side of the coin, the obverse. The disc centre sits
8.5 right of the box centre so that the silhouette (ink x 12.5..52.8, y 4..60) is optically centred.

Points, shifted 8.5 from variant A: H (39.5, 4.02), B (42.7, 17), T (53.5, 33.5), U (48, 37.7),
L (48.87, 42.34). The lower face is calmer than A's because a positive silhouette shows every
bend: chin circle centre (41.5, 47.5), r 9, from −35° to +20°, apex x 50.5 (3 behind the nose
tip); the neck leaves the chin tangentially at Th (49.96, 50.58), 70° below horizontal, and meets
the rim at W (46.79, 59.28). A's throat notch was tried here first and read as a small beard.

```
M 39.5 4.02 A 28 28 0 1 0 46.79 59.28 L 49.96 50.58 A 9 9 0 0 0 48.87 42.34 L 48 37.7
L 52.02 34.63 A 2 2 0 0 0 52.48 31.94 L 42.7 17 A 40 40 0 0 0 39.5 4.02 Z
```

## Lockup

`lockup-a.svg`, viewBox 0 0 196 80. Variant A at scale 0.6429, translate (13.429, 19.429): the
disc is 36 px, x 16..52, y 22..58, centred on the cap band of Inter 600 at 44 px (cap top 24,
baseline 56; the metrics measured for dome-horizon), so it overshoots the cap height by 2 px each
way, which is what makes a round shape look equal to the type. Wordmark `thera.` at x 66.5,
baseline 56, letter-spacing −1.5: the t's ink starts at 67, 15 px from the coin, and the period's
ink ends at 180, leaving 16-px margins on both sides. The goddess looks at her name.

## Renders

`renders/` holds mark-a and mark-b at 512 / 48 / 16 with pixel-zoomed 48 and 16, both marks as
#F7F9FA on #1C2E3D (`mark-a-light-*`, `mark-b-light-*`), and the lockup at 320 with real Inter
SemiBold (installed on this machine). All were read. Variant A was also checked at 32 and 24 px: the
nose bump is still visible at 32; at 24 it is a disc with a curved slit.

Light on dark, A inverts cleanly: the head becomes the dark shape between two light pieces and the
face reads just as well.

## Iterations, and what each render said

1. Band 7 to 14 wide, centred, back edge bulging 8. Read as a coffee bean: the band pinched to 7.4
   at the brow (the brow is the most recessed point of any profile, so a bulging back edge always
   pinches there) and the two halves were symmetrical.
2. Band 13 to 19 wide, head moved right. The face was clear but the coin fell apart into a lens and
   a crescent with a face on its inner edge: the round-1 "moon with a face" exactly.
3. Back edge flattened to sagitta 2.5, band 9 at the exits, 17 at the nose. The coin held and the
   face held. Kept. The chin ran straight into the rim at 60°.
4. Chin r 9.5 swept to 50° with a throat and a neck: blunter exit (67°) but a ball chin that read
   as a double chin.
5. Chin r 8 swept to 42°, vertical lip plane, neck at 78°: the final lower face.
6. Tilted 5° back (goddess looking up): the nose flattens to 38° and the band reads as a diagonal
   crack. Rejected; the mark stays upright.
7. For B, a light disc with a 6-unit ink rim and the band in ink (the task's first B suggestion):
   at 16 px it is a bar through a ring (Φ, or a no-entry sign) and at 48 px the flat-backed
   positive head reads as a Moai. Rejected in favour of the positive half-coin.

## Preference: variant A

A is the coin. It keeps the sealed disc the judges rewarded in round 1, it is one object at 16 px,
and it carries the whole story in one cut: the goddess profile, the crescent of Santorini in front
of her, the Θ of a circle crossed by a line, and the relationship read of two pieces of one coin
facing across a gap. It also survives light-on-dark without change and sits beside the wordmark at
cap height like an O. B is the most legible face of the two and the calmest silhouette, but it gives
up the coin at small sizes and lives in a crowded category (a head in profile is the universal
avatar glyph); it is the better choice for large, editorial moments, or as a cameo inside a circle
of surface colour, and it is the version to show the founder if "goddess" must come before "coin".

## What a stranger might see

- Variant A at 512: a coin or disc with a face cut through it; a sliced coin whose cut is a
  profile; a doorway with a figure. The ink in front of the face reads as a crescent moon, which is
  welcome. At 48: a disc with a profile-shaped gap, nose and chin visible. At 16: a coin with a
  curved light slit; a coffee bean is the honest risk, and it is the same risk dome-horizon's
  16-px slit carries.
- Variant B at 512: a classical profile silhouette, a cameo, a Cycladic head; also a generic
  "profile" avatar. At 48: a head with a nose. At 16: a dark oval with a bump on its right; calm, but
  no coin.
- Neither reads as a crack, a lightning bolt, a prohibition sign, or a moon with a face, which were
  the round-1 failures.

## Regenerating

`design/logos/tools/coin-profile.py` builds every file in this folder from two parameter dicts
(`PARAMS_A`, `PARAMS_B` at the bottom of the script; variant B is `PARAMS_A` with a r 9 chin to 20°
and a tangent neck, shifted 8.5 right):

```
python3 design/logos/tools/coin-profile.py design/logos/concepts/coin-profile
node design/logos/tools/render.mjs design/logos/concepts/coin-profile/mark-a.svg design/logos/concepts/coin-profile/renders
```
