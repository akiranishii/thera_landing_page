# two-profiles — "The Vessel" (final)

Two people face to face; the space they share is a Greek vase, cut into the coin of Thera.
Read it one way and it is an amphora on a coin; read it the other way and it is two profiles,
close, with the space between them held open. The circle is the island, the caldera and the Θ
of Θήρα; the vessel is Akrotiri pottery; the profiles are a classical statue cut down to a brow,
a straight Greek nose and a chin.

One path, `fill-rule="evenodd"`, no strokes, no gradients, no text. It is the same object in
every file; only the colour and the frame change.

## What changed from the concept, and why

The judges chose variant A and asked for three things. All three are done; variant B is dropped.

1. **Profiles rebuilt from calm moves.** The old profile had a 1.5-unit step at the bridge, a
   sharp nose tip, an r4 lip knob and an r8 chin knob. Each profile is now: a forehead arc, a
   straight nose ridge with a soft r1.2 tip, a straight underside, a short straight lip plane and
   one chin arc that runs into the base. No knobs; the mouth is implied, not drawn.
2. **Neck widened from 6 to 8 units.** The nose tips now stop at x 27.98 / 36.02, so the pinch is
   6 px at 48, 4 px at 32, 2.5 px at 20 and 2 px at 16. The 20 px render was checked specifically.
3. **Flat rim kept** at y 13, 24 units wide, so the vase keeps its lip and the 16 px silhouette
   stays the same keyhole the judges liked.

Two things the feedback did not ask for but the renders demanded:

- **A lip plane.** The first rebuilds used exactly three moves (brow arc, nose, chin arc). With
  one chin arc starting directly under the nose, the chin apex sits at mid-face and the lower face
  reads as a snout or a pout, not a mouth and chin. A 4-unit straight lip plane between the nose
  underside and the chin arc puts the chin where a chin is and restores the classical thirds
  (hairline to brow 12, brow to nose base 9.5, nose base to throat 14). It is a straight line,
  not a bump, so it adds no lumpiness. The small corner where the lip plane meets the chin arc is
  deliberate: the chin cannot be tangent to the lip plane and still project (solving for tangency
  gives r ≈ 25 with the apex on the lip line, i.e. no chin), and that corner is what reads as the
  lips.
- **A flatter forehead.** The old r13 forehead was a dome, which is what made the faces look
  cartoonish (big-headed). The forehead arc is now r 27 with its tangent at the brow 8° from
  vertical, so the forehead reads as a classical slope and the brow is a 25° bend into the nose,
  the single Greek line. The vase keeps a shoulder without the faces getting an egghead.

Rejected on the way: chin apex level with the nose tip (snout), chin bulge below 1.6 (chin
disappears at 48), rim 26 wide (no gain at 16, more ring lost at the corners), void raised 1 unit
(see optical centre below), a two-tone accent (see mark-accent below).

## Construction (viewBox 0 0 64 64)

Coin: circle centre (32, 32), r 28, drawn as two 180° arcs. 4 units of margin.

Void, left profile built top-down, then mirrored (x → 64 − x) and traversed upward; arc sweep
flags are preserved by the mirror-plus-reversal.

| point | role | coordinates | note |
|---|---|---|---|
| R | rim corner | (20, 13) | flat rim R→R′, 24 wide |
| B | brow | (24.8, 25) | forehead arc R→B, r 27.09, tangent at B 8° from vertical |
| T | nose tip (corner) | (28.3, 32.5) | ridge B→T is 25° from vertical; the corner is filleted r 1.2, so the rounded tip's innermost point is x 27.98 (neck 8.02) |
| M | under the nose | (25.5, 34.5) | underside T→M, 35.5° below horizontal |
| L | base of the lip plane | (25.8, 38.5) | lip plane M→L leans 4.3° toward the centre |
| W | throat | (24.5, 48.5) | chin arc L→W, r 7.64, centre (19.46, 42.76); apex x 27.10 at y 42.76, 0.9 behind the nose tip |
| base | bottom centre | (32, 53.5) | base arc W→base, r 8.5; the two throats meet in one round bottom |

Path, as written in `mark.svg`:

```
M 4 32 A 28 28 0 1 0 60 32 A 28 28 0 1 0 4 32 Z
M 20 13 A 27.09 27.09 0 0 1 24.8 25 L 27.88 31.6 A 1.2 1.2 0 0 1 27.49 33.08 L 25.5 34.5
L 25.8 38.5 A 7.64 7.64 0 0 1 24.5 48.5 A 8.5 8.5 0 0 0 32 53.5 A 8.5 8.5 0 0 0 39.5 48.5
A 7.64 7.64 0 0 1 38.2 38.5 L 38.5 34.5 L 36.51 33.08 A 1.2 1.2 0 0 1 36.12 31.6 L 39.2 25
A 27.09 27.09 0 0 1 44 13 Z
```

Everything is arcs and straight lines; no beziers.

**Optical centre.** Measured from the 512 px raster: the void's centroid is at y 30.65 (1.35
units above the coin centre) and the ink centroid at y 32.38, so the light part sits high and the
mass sits low, which is the stable arrangement. Raising the void 1 unit was rendered and looked
high; it stays where it is. The void is 22% of the coin's area.

**Ring.** 9 units above the rim, 5.5 radially at the rim corners, 6.5 under the base, 20 at the
sides. The coin stays a solid object at every size, which is what keeps it a mark rather than an
illustration.

## Files

- `mark.svg` — primary mark, ink #223848.
- `mark-light.svg` — same geometry in #F7F9FA for dark backgrounds. Rendered on #1C2E3D; the
  void becomes the dark ground and the illusion holds.
- `mark-accent.svg` — same geometry in the primary #466680, single colour. A two-tone version was
  built and rendered (left half #466680, right half #8DA8BB, i.e. one tone per person): it makes
  "two people" explicit but breaks the single sealed coin into two halves, and at 48 px the
  #8DA8BB half loses contrast on #F7F9FA. It did not help, so the accent file is one colour.
- `favicon.svg` — the 16 px silhouette only: a coin with a keyhole. No face detail. Every edge
  that can sit on the 16 px grid does (1 px = 4 units): rim at row 3, 6 px wide (x 20–44); funnel
  to a neck 2 px wide (x 28–36) and 2 px tall (y 26–34); body 4 px wide (x 24–40); round base
  ending at row 13 (y 52). Use it at 16 and 32; at 48 and above use `mark.svg`.
- `app-icon.svg` — 64 × 64, rx 14, #1C2E3D, with the light mark at 64% (coin 35.8 units, 56% of
  the tile). `app-icon-light.svg` is the inverse (#F7F9FA tile, ink mark). Both read; the dark one
  is the recommendation: the light coin on the dark tile has more presence and the vase reads as a
  dark window, which is the most coin-like of the two.
- `lockup-horizontal.svg` — viewBox 204.27 × 70. Coin 38 px (1.13 × the 33.47 px cap height of
  Inter 600 at 46 px), centred on the cap height so it overshoots the ascender and the baseline
  by 2.3 px each, which is what makes a round shape look equal to the type. 15 px from the coin to
  the t. The box is fitted to the ink with 16 px margins so it centres wherever it is placed.
  Text: `font-family="Inter, system-ui, sans-serif" font-weight="600" font-size="46"
  letter-spacing="-1.5"`. Wordmark ink extents were measured from the font (Inter SemiBold,
  2048 upm, cap height 1490): 119.27 px wide at 46 px, starting 0.45 px right of the text origin.
- `lockup-stacked.svg` — viewBox 159.27 × 145.99. Coin 56 px centred above the wordmark
  (Inter 600, 46 px); 16 px from the coin to the cap height; wordmark centred on its ink, period
  included; 20 px margins.

## Renders

`renders/` holds every file at the sizes in the brief: marks, accent and favicon at 512 / 48 / 16
(plus pixel-zoomed 48 and 16), the light mark on #1C2E3D, both app icons at 256, both lockups at
320. All were read and checked. Extra checks outside the brief: the mark at 32, 24 and 20 px
(neck open at all three), the favicon at 32, and the horizontal lockup at 160 px wide.

The render tool now shows real Inter: the variable font the site ships (`.next/static/media/`) was
unpacked to `~/.local/share/fonts/Inter-Variable.ttf`. Without it Chromium falls back to Nimbus
Sans and the lockups are not what they look like in the product.

## Regenerating

The mark is parametric. `design/logos/tools/vessel.py` builds the path from the named points
above and `design/logos/tools/vessel-finalize.py` writes this whole set from one parameter
dict:

```
python3 design/logos/tools/vessel-finalize.py '{"rim_x":20,"rim_y":13,"brow":[24.8,25],"forehead_end_deg":8,"tip":[28.3,32.5],"mouth":[25.5,34.5],"lip":[25.8,38.5],"throat":[24.5,48.5],"chin_bulge":1.9,"base_y":53.5,"base_r":8.5,"tip_r":1.2,"icon_scale":0.64}' design/logos/final/two-profiles
```

Then render with `node design/logos/tools/render.mjs <file.svg> design/logos/final/two-profiles/renders [sizes] [bg]`.

## Why this is the one

It is the only mark in the set a founder can explain in one breath and that then rewards a
second look. At 512 the two faces are calm and classical; at 48 the coin and the vase with its
pinched neck are the whole message; at 16 it is a coin with a keyhole, which is a distinctive
favicon silhouette rather than a collapsed one. It holds light-on-dark, sits beside the wordmark
at 1.13 × cap height without fighting it, and it carries Thera (the coin, the Θ), the vessel
(Akrotiri), the goddess profile and the relationship (two people and what is between them)
without drawing any of them literally.
