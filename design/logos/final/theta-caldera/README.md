# theta-caldera — final

The Θ of Θήρα as a place: one solid disc, one horizon, and the caldera's open side.

## What changed from the concept (variant B)

The judges kept variant B's full disc, its 8-unit slot just below centre and its two-tone, and asked for one thing: a
decision only this mark makes, so that in single colour it is not a disc with a cut (sunset / toggle / dome-horizon B).

The decision: **the slot no longer spans the chord.** It enters from the left edge and stops 12 units short of the right,
so the disc stays joined by a bridge of ink. That is the caldera itself: Santorini's ring is broken on the west where the
sea comes in, and the island is one piece everywhere else. In mono the mark is now a single connected shape with one
unmistakable asymmetry; in colour the horizon reads as a line that is light where the sea enters and colour where the
cliff meets it. The ring, the horizon, the dome and its reflection, the Θ, and the two sides meeting across a line are
all still there. Variant A (the split monoline ring) is retired.

## Construction (viewBox 0 0 64 64)

- Disc: centre (32, 32), radius 25 (x 7..57, y 7..57).
- Slot: y 32..40, from the left edge to a round end of radius 4 centred (40, 36); the slot's extreme is x = 44.
  Above the slot the dome is an exact half disc; below it the lower cap is 17 units tall (chord at y = 40,
  x 8.315..55.685), the smaller reflection.
- Bridge: the ink between the slot end and the right edge, x 44..55.7 at the slot's height (about 12 units).
- Grid: slot edges y = 32 / 40 and the slot end x = 44 are whole pixels at 16 px (rows 8–9, column 11; the slot is
  exactly 2 px) and at 48 px (rows 24–30, column 33; the slot is exactly 6 px). The bridge is 3 solid columns at 16 px.
- Mono: one path, `M 7 32 H 40 A 4 4 0 0 1 40 40 H 8.315 A 25 25 0 1 0 7 32 Z`. No masking, no overlapping fills, so
  it knocks out cleanly on any background.
- Two-tone: the same outline split into two closed paths along y = 40. The ink piece is the dome plus the bridge
  (`… H 55.685 A 25 25 0 1 0 7 32 Z`); the blue piece is the clean lower cap (`M 8.315 40 H 55.685 A 25 25 0 0 1 8.315 40 Z`).
  The seam continues the slot's lower edge, so the horizon is one straight line across the whole disc. Seams at the
  slot's top or middle were rendered and rejected: both put a small blue tab beside the slot end that reads as an error.

## Files

| file | contents |
|---|---|
| `mark.svg` | primary mark, single path, ink #223848 |
| `mark-light.svg` | same geometry in #F7F9FA for dark backgrounds (rendered on #1C2E3D) |
| `mark-duotone.svg` | the default colour mark: ink dome + #466680 cap. This is the version the lockups use |
| `mark-accent.svg` | the two-tone in the lighter key, #466680 + #8DA8BB, for surfaces and secondary placements |
| `favicon.svg` | 16 px version: single colour, square-ended slot ending on x = 44, flips to #F7F9FA under `prefers-color-scheme: dark` |
| `app-icon.svg` | 64 × 64 tile, rx 14, #1C2E3D, light mark with the #8DA8BB cap at 0.66 (disc 33 units, 52% of the tile) |
| `app-icon-mono.svg` | the same tile with the single-colour light mark |
| `app-icon-light.svg` | light tile (#F7F9FA) with the ink + #466680 mark, for light-mode contexts |
| `lockup-horizontal.svg` | mark + "thera." |
| `lockup-stacked.svg` | mark over "thera." |

## Lockups

Horizontal (viewBox 0 0 205 80): the mark at 0.72 (disc 36 units, x 19..55, y 22..58) beside 44 px Inter 600
"thera." with letter-spacing −1.5 at x 72, baseline 56. Inter's cap band at 44 px is y 24..56, so the disc stands on
the baseline with a 2-unit round overshoot top and bottom, like an O. 17 units from the disc to the t. The slot opens
outward, away from the type, and the solid bridge faces it, so the lockup starts with a light opening and ends with
the period. The horizon seam sits at y 45.76, in the lower half of the x-height band; the blue cap below it (y 45.8..58)
sits at the same height as the period (y 49..55). Margins are about 19 each side.

Stacked (viewBox 0 0 160 140): the mark at 0.6875 (disc 44 units, y 25..69) above the wordmark at x 23, baseline 115
(ink x 23..137). The disc is centred at x 79, one unit left of the ink centre, because the period is light and the
word's optical centre sits at about 78.5. 14 units between the disc and the ascenders; margins 25 top and bottom.

Both lockups were rendered with a real Inter SemiBold, and the text metrics were measured in the browser
(cap band 24..56, x-height top 32, period 179..185 at x 72), so the alignment numbers above are checked, not estimated.

## Favicon and app icon

The favicon drops the round slot end (under a pixel at 16 px; it only greys one column) for a square end on the pixel
boundary, and stays single colour. A 12-unit slot was tried and rejected: it turns the lower cap into a sliver and the
icon into a C. The 8-unit slot already reads as two clean white rows inside a 12.5 px disc.

The app icon uses the two-tone: on the dark tile the #8DA8BB cap is quiet but keeps the blue in the identity, and the
mono tile beside it looks flatter. The glyph was raised from 60% to 66% of the box after the first render, where the
disc (47% of the tile) sat a touch small; at 66% the disc is 52% of the tile with 15.5-unit margins.

## Explored and rejected on the way

Rendered side by side in mono and two-tone before choosing:
- The slide from dome-horizon B (upper half disc, lower cap shifted 8 units): it is dome-horizon B, it loses the full
  disc that fills avatar bubbles and tiles, and it is the least calm of the set.
- A lower segment that is only smaller (chord at y 44, no bridge): the stock sunset pictogram, worse in mono than the
  original.
- The bridged slot moved lower (y 36..44): the lower cap becomes a sliver and the slot starts to read as a mouth.
- Two-tone seams at the top and the middle of the slot (see Construction).

## Why this holds

It is one familiar whole with one confident move. The full disc gives it the app-icon and avatar fit the product
judge wanted; the bridge gives it the mono-only identity the craftsperson asked for; the two-tone keeps the blue and the
period echo the strategist liked, and the slide was not needed to get there. At 16 px it is a dark disc with two white
rows and a solid right side; at 512 px it is a calm, heavy, slightly open circle, which is what a personal chief of
staff for relationships should feel like.
