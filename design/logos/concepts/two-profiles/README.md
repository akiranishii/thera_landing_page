# two-profiles — "The Vessel"

Direction: two minimal profiles facing each other; the space between them is the mark.

## Idea

A solid coin. Cut out of it is an amphora-shaped void, and the two edges of that void are
two faces in profile, looking at each other (the Rubin vase figure–ground illusion, rebuilt
from circles and arcs). Read it one way and it is a Greek vessel; read it the other way and it
is two people, close, with the space they share between them. The circle is the island, the
caldera, the Θ of Θήρα; the vessel is Akrotiri pottery; the profiles are the classical
statue / Cycladic head with little more than a brow, a straight Greek nose and a chin.

The coin keeps it a single, sealed object (it is one path), which is what makes it behave
like a Linear/Apple-era mark instead of an illustration: at 16 px it is simply a dark coin
with a light vase-shaped slot; at 48 px the pinch of the two noses appears; at 512 px the
faces resolve.

## Variants

### mark-a.svg — The Vessel (preferred)
The two profiles do not touch. The void is a complete vase: flat rim (the two hairlines),
neck (noses almost meeting), body (lips and chins) and a round base where the two throats
merge. The relationship is the shared space, held open.

### mark-b.svg — The Meeting
Same coin, same faces, but the profiles press nose to nose. The fused noses become a bar
across the circle, so the mark reads as a theta (Θ, Thera's initial), while the shared space
splits into a cup above and a base below, which together read as an hourglass: *when* to
reconnect. The lower faces are Cycladic (no lips), so the lower void stays a clean jar.

Both are solid ink, single path, `fill-rule="evenodd"`, no strokes, no text, no gradients.
Only #223848 is used; the secondary #466680 was not needed.

## Construction (viewBox 0 0 64 64)

- Coin: circle centre (32, 32), r = 28 (4 units of margin), drawn as two 180° arcs.
- Void (mark A), left edge from the rim corner (20, 13) down to the base, then mirrored
  (x → 64 − x, arc sweep flags preserved when traversed back up):
  - forehead: arc r 13 from (20, 13) to the brow (26.5, 23), bulging toward the centre
  - bridge: short line to (26, 24.5)
  - nose: straight ridge to the tip (29, 31), straight underside back to (24.5, 33.5)
    (the Greek profile: brow, bridge and nose as one near-straight line)
  - lip: arc r 4 to (25.5, 38.5), dip to (24.8, 40)
  - chin: arc r 8 to (24, 49)
  - base: arc r 8 to (32, 53.5), the two throats meeting in one round bottom
  - rim: flat line at y = 13 from x = 20 to 44 (24 units wide; nose gap is 6 units, 1.5 px at 16 px)
- Void (mark B): the upper subpath keeps the forehead/bridge/ridge and ends in a 3-unit flat
  at y = 30 where the two noses press together; the lower subpath starts at y = 35, runs the
  nose undersides, one r 9 chin arc each side, and the same round r 8 base, bottoming out at
  y = 54 (6 units of ring, matching the rim corners). The bar between the voids is 5 units
  thick at the centre and widens outward (it is the two noses).
- Everything is arcs and lines; no beziers, so it stays exactly geometric and easy to redraw.

## Renders

`renders/` holds mark-a / mark-b at 512, 48 and 16 (plus pixel-zoomed 48 and 16), the
lockup at 320, and `*-light-*` versions of both marks in #F7F9FA on the dark section colour
#1C2E3D. Light-on-dark is just the ink colour swapped; the void becomes the dark ground and
the illusion holds.

## Lockup

`lockup-a.svg` (viewBox 0 0 204 80): mark A scaled so the coin is 38 px, centred on the cap
height of "thera." set at 46 px Inter 600, tracking −1.5. The gap between coin and the "t" is
15 px (about 0.4 of the coin). The box is fitted to the ink (15 px left, 16 px right, 21 px
top and bottom) so the lockup centres correctly wherever it is placed. A round shape wants to sit slightly larger than the type's
ascender height to look equal, which is why the coin is 38 and not 34.

## Which one, and why

**Mark A.** It is the purer statement of the direction: two sides and the space they share,
held open. The vase silhouette is calmer and more ownable than B's hourglass, and the open
gap between the noses is the tension that makes the illusion flip. B is the warmer, more
literal "the meeting happens" variant and it carries the Θ, but nose-to-nose is more intimate
than a relationship assistant should default to, and its two voids read as a figure-8 at
16 px while A's single vase stays a single quiet shape.

## Iteration notes

1. Open-ended profiles (void running through the top and bottom of the circle) read as
   lungs / a coffee bean at 16 px. Enclosing the void inside the coin fixed it.
2. A stroked version (one continuous line: profile, base, profile) was tried in three
   postures; the nose zigzags always read as rabbit ears or claws. Dropped.
3. Rotating the pair 90° (profiles above and below a horizontal horizon) read as jaws.
   Dropped.
4. A pointed arch housing the profiles read as a Gothic window. Dropped.
5. The vase's flat trophy foot was replaced by a round base and the lower face was
   simplified to one lip and one larger chin; the void was shifted up 1 unit to sit optically
   centred.
6. Production check (re-rendered and measured from the 512 px rasters): mark A's nose gap
   widened from 5 to 6 units so the neck stays open at 16 px; mark B's theta bar thickened
   from 4 to 5 units and its jar raised 1 unit (base y 55 → 54) so the bottom ring matches the
   rim corners and the void centroid moves from y 33.3 to 32.8 (mark A sits at 32.5); the
   lockup's viewBox was fitted to the ink (240 → 204 wide, content moved down 2 px) because
   the ink was sitting 2 px high with 53 px of empty space on the right. Note that the render
   tool only shows the real wordmark when Inter is installed; without it Chromium falls back
   to Nimbus Sans.
