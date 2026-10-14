# Atlantis rings

Plato's Atlantis in plan: concentric rings of land and water around a central island, with one canal cut straight through to the sea. The mark is that plan reduced to its bones: an island (you), the land ring(s) around it, and a single engineered canal out to the world. It is not a map of a city; it is the memory of one.

Both marks are built from the same section of radial bands and the same canal rule. They differ in what they keep.

## mark-a.svg - "Harbor plan"

The full plan, lightly drawn. Centre (32,32). Bands outside-in: land 22-28, water 17-22, land 11-17, water 6-11, island r6. One canal, 8 units wide, with straight vertical walls at x=28 and x=36, cut from the sea through both land rings down to the innermost water ring. Each land ring is one filled path: outer arc, line across the canal wall, inner arc, close. No stroke caps anywhere, so the canal reads as a cut, not as an opening.

Why square cuts: round-capped rings with a gap at the bottom read instantly as the Podcasts / broadcast icon (dot as a head, cap ends as legs). The straight walls turn the same geometry into an engineered plan.

Honest limits: at 16 px the five bands become a ringed dot with a faint notch (recognisable, not crisp), and a small beacon echo survives because any "dot with rings and a channel below" shares bones with a transmitter icon.

## mark-b.svg - "Harbor mouth"

The same plan, reduced to its two heaviest parts. Island r11 in #466680 (the one secondary element; ink in mono), water 11-16.5, one land ring 16.5-25.5. The same 8-unit square-cut canal, placed on the 7:30 axis (135 deg): the closed face of the ring sits against the wordmark and the opening faces out to sea. It is a harbor seen from above, and also Santorini's caldera with Nea Kameni sitting in the middle of it.

Angles tested and rejected: 4:30 and 3:00 read as a magnifier / Q / C, 6:00 as a magnet, 10:30 looks like it is opening upward, 9:00 goes flat, 8:00 looks like a fudged 45. Round caps at any angle become refresh / loading.

## lockup-a.svg

Mark B at 0.65 (51-unit footprint = 33 px, about the cap height of 44 px Inter semibold), centred at y=41, between cap centre (40) and x-height centre (44) because the word is lowercase. 14 px gap to the text. Renders here used a fallback sans because Inter is not installed on this machine; if real Inter semibold looks lighter than the ring, scale the mark to 0.62 rather than thinning the ring.

## Preference: B

B is the one I would ship. It is crisp at 16 px where A goes soft; its silhouette is ownable (a cut ring around a filled island is not an existing system icon, where A keeps a beacon echo); the two-tone island in the brand primary adds the warmth the brief asks for without a gradient; and its weight matches Inter semibold in the lockup. A is the more literal plan and the stronger explanation of the idea, which makes it a good companion illustration or an about-page diagram, but B is the better mark.

## Checks done

renders/ holds 512, 48 and 16 px renders (plus pixel zooms) of both marks on white, 512 and 16 px light-on-#1c2e3d versions, a single-colour version of B, and the lockup on light and dark.
