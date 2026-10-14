# dome-horizon — final set

The Santorini dome and the horizon, reduced to one circle and one cut. A single r21 circle is sliced by the horizon and the two halves slide apart along it: the dome above, the caldera (or the dome's reflection in the sea) below. The light between them is the horizon line. It is also the theta of Θήρα, a circle crossed by a line, with the line made of light rather than ink, and two arcs meeting across a horizon is the relationship read. Single colour, two closed paths, no strokes, no masks.

Start point: concept `dome-horizon`, variant B (the judges' preference). Three judges asked for the same things, and this set acts on each of them.

## What changed from the concept, and why

| Feedback | Action |
| --- | --- |
| Test a 10-unit slide so the halves overlap more and read as one sliced object at 48 px (craftsperson). | Rendered slides of 8, 10, 11 and 12 at 512 / 48 / 16 side by side. **10 wins**: the chords now overlap 32 of 42 units (76%) and the form reads as one disc that slipped along its horizon rather than two shapes, while the offset stays unmistakable at 24% of the diameter. 8 collapses to a 45-degree stagger that reads like a drop shadow; 12 (the concept) keeps reading as a pair. The slide is the only number that moved on the primary mark. |
| Keep the offset; it is what separates this from theta-caldera (strategist). | Kept. The gap is still 8, the slide is 10, the mark is still point-symmetric about (32, 32). |
| Try the lower half in muted blue to borrow the sunset reading (strategist). | `mark-accent.svg`: dome #466680, caldera #8DA8BB. The lighter half becomes the reflection, which also settles the "object or two shapes" question in favour of one dome and its mirror. It genuinely adds something, so it is not a copy of `mark.svg`. Light backgrounds only. |
| Trim the lockup viewBox from 320 to about 196 (all three). | `lockup-horizontal.svg` is 195 x 80, measured against the real Inter SemiBold outlines (with kerning): the period's ink ends at x 178.5, margins are 16 left and 16.5 right. |
| Test the mark inside a circular avatar mask (product). | Rendered in a 64-unit circle on #EAF0F4 (ink) and #1C2E3D (light) at 0.6 and 0.68 scale, at 512, 48 and 16. It sits comfortably; the whole mark fits inside a radius-27 circle and the diagonal mass reads as the intended slip, not as a mis-centred glyph. No geometry change needed. Recommended: 0.68 of the circle's diameter. |
| Favicon should be the best of the set (all three). | `favicon.svg` is the same construction re-cut so that at 16 px every chord end, not just the horizon, lands on a whole pixel. See below. |

## Construction

All marks: viewBox 0 0 64 64. One circle, one horizontal cut, one horizontal slide. For centre (32, 32), radius r, gap g and slide s:

- dome: upper half of the circle centred at (32 - s/2, 32 - g/2)
- caldera: lower half of the circle centred at (32 + s/2, 32 + g/2)

**mark.svg** — r 21, g 8, s 10, ink #223848.
- dome `M6 28 A21 21 0 0 1 48 28 Z` (x 6..48, y 7..28)
- caldera `M16 36 A21 21 0 0 0 58 36 Z` (x 16..58, y 36..57)
- footprint 52 x 50, margins 6 left/right and 7 top/bottom; no feature smaller than 8 units.
- the chords sit on y 28 and y 36, which are rows 7 and 9 at 16 px and 21 and 27 at 48 px, so the horizon is a clean 2 px (and 6 px) band of light. The two inner chord corners (x 48 and x 16) land on whole pixels at 16 px as well (12 and 4), so the slip itself is crisp.

**mark-light.svg** — identical geometry in #F7F9FA, for #1C2E3D and darker.

**mark-accent.svg** — identical geometry, dome #466680, caldera #8DA8BB.

**favicon.svg** — r 22, g 8, s 12, ink #223848: `M4 28 A22 22 0 0 1 48 28 Z` and `M16 36 A22 22 0 0 0 60 36 Z`, footprint 56 x 52. With r 22 and s 12 all four chord ends fall on multiples of 4 units, so at 16 px the dome fills columns 1..11 and the caldera columns 4..14 with solid end pixels, and at 48 px the ends sit on 3 / 36 and 12 / 45. The pixel grid of `mark.svg` at 16 px is the same except for one 40%-grey end column on each half; the slide differs by half a pixel at 16 px and by 1.5 px at 48 px, below the threshold where the two would be told apart. This is the "simplify and thicken" step for a mark that has no secondary detail to drop.

**app-icon.svg** — 64 x 64, rx 14, fill #1C2E3D; the light mark at scale 0.7, translate (9.6, 9.6), so its footprint is 36.4 x 35 (57% of the tile) and the horizon gap straddles the tile's centre line. 0.6 was tried and left the glyph looking small, because the mark's own footprint is only 52 x 50 of its 64 box. **app-icon-light.svg** is the same tile in #F7F9FA with the ink mark, for dark home screens and dark-mode icon slots. The dark tile is the primary icon.

**lockup-horizontal.svg** — viewBox 0 0 195 80. Mark at scale 0.68 (35.4 x 34), translate (11.92, 18.24): it spans x 16..51.3 and y 23..57, standing on the baseline (y 56) and reaching the h / cap line (y 24) with 1 unit of round overshoot each way, like an O. Wordmark `thera.` in Inter 600, 44 px, letter-spacing -1.5, x 65, baseline 56; the t's ink starts at x 65.5 (14.5 units from the mark) and the period's ink ends at x 178.5. Margins 16 / 16.5 / 23 / 23.

**lockup-stacked.svg** — viewBox 0 0 160 140. Mark at full size, translate (48, 13): x 54..106, y 20..70, centred on x 80. Wordmark 44 px, x 25.5, baseline 120 (cap top 88, 18 units under the mark; 20 units of margin above the dome and below the baseline). The wordmark's ink runs x 26..139, placed so the mark's axis falls midway between the centre of "thera" and the centre of "thera.": centring on the whole string pushes the letters visibly left of the mark, centring on the letters alone leaves the period hanging outside the box. Rendered both ways; the midpoint reads centred.

## Renders

`renders/` holds every file at the requested sizes: marks and favicon at 512 / 48 / 16 (plus pixel-zoom files for 48 and 16), `mark-light` on #1C2E3D, app icons at 256 (`app-icon-light` on #1C2E3D, its intended context), lockups at 320. Inter is not installed on this machine, so `lockup-horizontal-320.png` and `lockup-stacked-320.png` show the system fallback; `lockup-horizontal-inter-320.png` and `lockup-stacked-inter-320.png` are the same files rendered with Inter SemiBold embedded and are the ones to judge the type by. `_review-marks.png` and `_review-icons-lockups.png` are contact sheets of all of the above.

## Rationale

It is one familiar whole with one confident move, which is the grammar of the Linear / Stripe generation of marks, and it carries the most of the brief at once: dome, horizon, caldera, reflection, theta, two arcs meeting, without illustrating any of them. It is the most legible thing in the exploration at 16 px because it is two solid masses on a pixel-aligned cut, and it survives a single colour on any background. The known weakness is strategic rather than formal: split-and-slid discs have cousins among fintech and design-tool marks, and the mark says place rather than person. The slide, the horizon of light and the dome-over-reflection reading in the accent version are what make this one thera.'s, and the warmth is left to the wordmark and the voice, which is where this product's warmth lives anyway.

## Usage notes

- Minimum clear space: the horizon gap (8 units at mark scale) on all sides.
- Use `mark.svg` / `mark-light.svg` wherever the mark must carry on its own; `mark-accent.svg` is for large, light-background moments (hero, print).
- In a circular avatar, place the mark at about 0.68 of the circle's diameter, centred.
- Do not rotate, outline, add a stroke to or re-space the two halves; the 8-unit gap and 10-unit slide are the mark.
