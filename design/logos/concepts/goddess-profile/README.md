# Goddess profile — "Coin" and "Theta"

Direction: a classical goddess profile reduced to one calm line (brow, nose, lips, chin) that lives in a circle.
Two takes, same profile grammar, opposite weight.

## The idea

The circle is the coin, the moon over the caldera, the ring of Atlantis, and the Θ of Θήρα. The profile is a
classical bust cut down to five moves: a straight, slightly set-back forehead; a straight Greek nose that
continues the forehead line with only a 10° bend at the bridge; a short underside; a near-vertical lip plane
(8° forward lean); one chin arc. No hair, no eye, no lips drawn as bumps. The mouth is implied by the lip plane,
the way a Cycladic head implies everything with a nose ridge. The face looks left, into open space.

- **mark-a "Coin"** — a solid disc with the profile engraved through it as a single line of light. The sliver of
  ink in front of the face becomes a crescent (Santorini from above), tapering to a horn at the chin.
  Reads as a seal or a coin: the head of the city on its currency.
- **mark-b "Theta"** — a ring crossed by the same profile line. A Θ whose bar has become a face. The chin arc is
  internally tangent to the ring and dissolves into it, so the line and the ring are one continuous system.

## Construction (viewBox 0 0 64 64, ink #223848, no secondary colour used)

Shared profile chain (mark-b coordinates; mark-a uses the same B, T, U with a taller frame):

| point | role | mark-b | mark-a |
|---|---|---|---|
| S | hairline, on the frame | (32.5, 7.5) | (34.1, 2) — starts outside the disc so the cut enters clean |
| B | brow | (27, 24) | (27, 24) |
| T | nose tip (round join only, no tip arc) | (19, 38) | (19, 38) |
| U | under the nose | (23, 40) | (23, 40) |
| W | start of chin | (21.98, 47.25) | (21.15, 53.16) |
| chin arc | r | 8 | 9 |
| P2 | merges into frame | (28.89, 56.3) | (29.29, 63.38) |

- Forehead S→B leans back 18° from vertical; nose B→T is 30° from vertical; the bridge bend is ~10° so the
  forehead and nose still read as the single Greek line.
- Lip plane U→W is a straight line leaning 8° forward. Its length is solved, not eyeballed: it is the length
  that makes the chin circle internally tangent to the frame, so the chin flows into the ring/rim with no
  pocket or notch.
- **mark-b**: ring c=(32,32) r=24.5, stroke 7 (outer edge r=28, the same footprint as the coin), round caps and joins;
  profile is a 7-unit stroke; the chin centre sits 16.5 from the ring centre so centreline, inner and outer edges are all tangent. The line
  crosses the ring at the top (a crisp T) and becomes the ring at the bottom.
- **mark-a**: disc c=(32,32) r=28; the profile is a 7-unit butt-capped cut (mask). The chin circle is placed so
  the cut's *inner* edge (r=5.5 about the chin centre) is tangent to the disc edge: the head piece runs into
  the rim with no step, and the crescent piece tapers to a point. The file uses an SVG `<mask>` for clarity;
  for production, outline the stroke and subtract it from the disc to get one compound path.
- Lockup: mark-a at 0.6× so the disc spans y 23.2–56.8 against a 44px Inter 600 wordmark (cap height 24–56),
  i.e. cap height with a little round-shape overshoot; 12 units of air between disc and "t". viewBox 0 0 196 80: in Inter 600 the ink runs x 18.4–177.2, so the side margins are equal.

## What was checked

Rendered at 512 / 48 / 16 and on #1c2e3d with light ink (renders/ holds both sets; the *-dark-*.png files are light ink on #1c2e3d).
- 16 px: mark-a reads as a solid disc with a slit, mark-b as a ring with a line. Neither muddies.
- 48 px: both read as a face in a circle.
- 512 px: junctions inspected at 8× — the ring/chin merge and the coin's rim/chin merge are tangent and clean.
Production check (rendered fresh, measured per pixel row at 16 px): mark-b's original 6-unit stroke left the profile line at mid-grey
(94/76/63 of 255) in the rows where it runs alone inside the ring, so ring and profile went to 7 units with the ring at r=24.5 (outer edge
unchanged at 28) and the chin re-solved; 8 units would have closed the nose-to-ring gap to ~2 units. mark-a's 7-unit cut already reaches
full white in every row at 16 px and was left as designed. The lockup was proofed with the real Inter SemiBold: h-top 24.3, x-height 32,
baseline 56 against the disc at 23.2–56.8, i.e. cap height plus a round overshoot, centred on the cap band; the viewBox was trimmed from
210 to 196 because the ink ended at x=177, leaving a 33-unit right margin against 18 on the left.
Earlier rounds (small r≈3.5 arcs for nose tip and lips, hollow-plus-chin from two tangent circles) looked like
a wobbly cartoon at every size and were discarded; the straight-line grammar above is what made it calm.

## Preference: mark-a (Coin)

It is the more ownable object: a solid, stampable mark that works as an app icon and a favicon without any
stroke-weight compromise, matches the weight of the semibold wordmark, and carries three readings at once
(coin/seal, moon over the caldera, crescent island in front of a face). mark-b is lighter and more "Θ", and is
the better choice if the system wants a line-art mark; it could also take the profile in #466680 against an
ink ring as a secondary treatment, which the coin cannot.
