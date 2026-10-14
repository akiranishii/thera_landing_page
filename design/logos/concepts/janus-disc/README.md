# janus-disc — "Two faces of the city" (round 2, profile-led)

Two profiles looking outward from one disc: one face remembers, the other looks ahead. The disc is
Thera, the coin and the Θ; the two heads are the people a relationship is made of; the Greek line
from crown to nose-tip is the goddess profile the founder asked to feel. Variant B cuts the same
disc with a vertical column of light, the stele between two people.

Both marks share one profile geometry. They are single colour, fills only, no strokes, no masks,
no gradients, no text.

## What round 1 taught, and what this round did about it

Every earlier attempt at outward profiles (eleven draft rounds are kept in `drafts/d1`–`d16`) failed
the same way: a wide crown, a face attached as a flange at mid-height, a wide base under the chins.
That silhouette is a helmet (Vader, Stormtrooper, a kettle), whatever the profile does. Three
changes fixed it, in order of importance:

1. **The forehead and the nose are one line.** The brow sits *on* the crown circle and the nose
   ridge leaves it with a 4° bend, so the whole upper edge is one continuous Greek line from the
   crown to the nose tip. A separate forehead, straight or arched, always produced a visor corner at
   the brow (d5–d10) or a cap brim (d8 brow-bone tests).
2. **The chin never leaves the disc.** A chin circle that pokes outside the hull and re-enters reads
   as a cheek pouch (d13). The chin here is a circle internally tangent to the base circle, so it is
   a soft bulge of the disc itself; the chin's prominence comes entirely from the 6.7-unit mouth
   notch above it.
3. **The mass is one disc, not a bust.** Narrow necks, flat bust bases and crown saddles (d7–d10)
   all made a head shape that broke at 16 px. The crown and base are two arcs of nearly the same
   circle, so at 16 px it is a disc.

Also tested and rejected: eyes as light circles (instant face, instant cartoon, grey dots at 16 px);
a horizontal light horizon at the mouth (a hat on a bowl); an ink stele protruding above and below
the heads (a bell or a grenade); a thin ink bar inside the light column (fussy); a 3-unit tip fillet
(blunt).

## Construction (viewBox 0 0 64 64)

Crown: circle centre (32, 31), r 25, top at y 6. Base: circle centre (32, 31), r 27, bottom at
y 58. Left profile, top-down, mirrored on x = 32 (x → 64 − x) for the right face:

| point | role | coordinates | note |
|---|---|---|---|
| B | brow | (9.1, 21) | on the crown circle; crown tangent 23.6° from vertical, ridge 27.6°, so the bend is 4° |
| T | nose tip | (3.6, 31.5) | ridge B→T 10.5 tall, 5.5 out; corner filleted r 2.2, so the rounded tip's extreme is x 4.47 |
| U | under the nose | (10.3, 35) | underside T→U, 27.6° below horizontal; the mouth notch is 6.7 deep |
| L | base of the lower lip | (8.69, 36.5) | on the chin circle |
| chin | — | centre (16.74, 40.54), r 9 | apex (7.74, 40.54), 1 unit inside the base circle |
| P | throat | (9.1, 45.31) | the chin circle is internally tangent to the base circle here (148° on the base circle); no corner |

Moves per profile: crown arc, nose (ridge + underside), lower lip, chin arc. The nose is 10.5 tall, the
mouth notch 6.7 deep from the nose tip (4.5 from the tip-to-chin hull line) and about 10 wide at its
mouth, the chin arc r 9. Three dimensions sit below the round-2 floor of 4 units: the r 2.2 tip fillet,
the 2.2-unit lip plane U→L, and the 2.56 units by which the chin apex stands proud of the notch bottom.
None is a bump (the Vessel final has an r 1.2 fillet and a 1.6 chin bulge at the same scale); at 48 px
the nose is a 3 px spur over the chin and the notch a 2 px nick, and at 16 px both vanish into the disc.
Footprint x 4.47..59.53, y 6..58 (55 × 52), centred on (32, 32).

**mark-a.svg** — one path:

```
M 9.1 21 L 4.62 29.55 A 2.2 2.2 0 0 0 5.55 32.52 L 10.3 35 L 8.69 36.5
A 9 9 0 0 0 7.74 40.54 A 9 9 0 0 0 9.1 45.31 A 27 27 0 0 0 54.9 45.31
A 9 9 0 0 0 56.26 40.54 A 9 9 0 0 0 55.31 36.5 L 53.7 35 L 58.45 32.52
A 2.2 2.2 0 0 0 59.38 29.55 L 54.9 21 A 25 25 0 0 0 9.1 21 Z
```

**mark-b.svg** — the same outline cut by a vertical column of light 8 units wide (x 28..36), as two
closed paths. The left half runs from the column edge on the crown circle (28, 6.32), along the
crown arc to the brow, down the profile, and along the base arc back to the column edge (28, 57.7).
The column is 2 px at 16 px and 6 px at 48 px. On a dark ground (`renders/mark-b-light-512.png`)
the column reads as an ink stele between two light heads.

**lockup-a.svg** (viewBox 0 0 197 80) — mark B at scale 0.68 (37.4 × 35.4), translate
(12.96, 18.24): it spans x 16..53.4 and y 22.3..57.7, centred on the cap band of Inter 600 at 44 px
(ascender line y 24, baseline y 56, cap/ascender height 32), overshooting both by 1.7 like an O.
14.2 units from the mark to the t's ink at x 67.7; the wordmark's ink ends at x 181; margins 16
left and 16 right. Text metrics were measured in Chromium with the installed Inter SemiBold
(ink from 1 px right of the origin to 113 px past it, ascender 32 px above the baseline), so the
render in `renders/lockup-a-320.png` shows the real wordmark.

## Which variant, and why

**B is preferred.** The faces are the point of this round, and the split is what makes them read.
At 512 px mark B is unmistakably two profiles looking away from each other; at 48 px each half still
has its nose and its mouth; at 16 px it is a disc with one vertical line of light, which is a calmer
and more distinctive favicon than a plain disc. It also carries more of the brief at once: two
people, the column between them, the Θ as a disc crossed by a line (turned on its side), the caldera
as a ring with a gap. Beside the wordmark the column rhymes with the stems of the t and the h.

Mark A is the better single sealed object (one path, a true disc at 16 px) and the more faithful
"Janus" (one shared head). Its weakness is honest: a solid symmetric silhouette with two noses is
always one step from a helmet, and A sits exactly on that line. It is here as the mono-object
version and as the shape B is cut from; if the judges want a one-piece mark, A with the mouth notch
deepened to 8 is the next thing to try, not another construction.

## What a stranger might see

- **Mark B, 512 and 48 px:** two faces in profile, back to back, facing out; a coin split in two; two
  halves of an island with a strait between. At 16 px: a disc with a slit, a pause button, a split
  coin. Nobody will see a moon or a prohibition sign; the column is vertical and 8 units wide.
- **Mark A, 512 px:** two profiles sharing a head (if you are told "two faces" you cannot unsee it);
  a round helmet seen from the front; an acorn or a nut; a coin with two heads. At 48 px: a disc
  with two side bumps and notches. At 16 px: a disc.
- Neither reads as a crescent, a cracked coin or a cartoon: the nose is 10.5 units, the notch is 6.7,
  nothing tapers to a point (the nose ends in a 90° corner filleted r 2.2, the chin is tangent to the
  base), and the only sub-4-unit dimensions are the tip fillet, the 2.2 lip plane and the 2.56 chin
  step listed under Construction. The honest weakness is that the nose breaks the disc's own hull by
  only about 0.5 unit (tip x 4.47 against the base circle's x 5.0), so at 48 px the faces are a disc
  with two thorns and read as faces only in B, where the split gives each half a back of the head.

## Files

- `mark-a.svg` — solid Janus disc, ink #223848, one path.
- `mark-b.svg` — the same disc cut by an 8-unit column of light, two paths. Preferred.
- `lockup-a.svg` — mark B beside "thera." (Inter 600, 44 px, letter-spacing −1.5), 197 × 80.
- `renders/` — both marks at 512 / 48 / 16 with pixel zooms, both marks light (#F7F9FA) on
  #1C2E3D at 512 and 48, and the lockup at 320. All were read and checked.
- `drafts/` — the eleven rounds that led here (d1–d4 from the first session, d5–d16 from this one),
  each with a contact sheet `sheet.png` at 256 / 48 / 16.
