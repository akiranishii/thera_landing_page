# Cycladic head

Direction: the Early Cycladic marble head (the Cyclades include Thera). A flat, featureless face with
only a nose ridge. Ancient and ultra-minimal at the same time, which is exactly the tension thera. wants:
an old idea of a person, rendered as a modern object.

## Idea

The mark is a face reduced to the two things a Cycladic sculptor kept: the plane of the face and the nose.
No eyes, no mouth, no hair. It evokes "a person worth remembering" without drawing a person, and it carries
the Santorini / Aegean origin of the name without a postcard.

Two takes:

- **mark-a "Carved"**: a solid marble face. Flat forehead, convex cheeks, narrow round chin. The nose is
  negative space, a tapered slot cut out of the stone. Reads as a carved object.
- **mark-b "Soft"**: the same head drawn as a single line. Round crown, soft chin point, the nose as a
  short tapered ridge inside. Because of the silhouette it also reads as a speech bubble (voice-first) and
  as a pin (make the meeting happen), which are both true to the product.

## Construction

Both marks: viewBox 0 0 64 64, ink #223848 only, no secondary color needed, no gradients, no text.

**mark-a**

- Face: one closed path. Flat top from (24,7) to (40,7), rounded corners into cheeks that are widest at
  about y=21 (x 11.5 and 52.5), then long convex sides to a round chin at (32,60). Width 41, height 53.
  The silhouette is top-heavy (centroid about y=30), so it sits 1 unit below the geometric centre of the
  viewBox to read as optically centred.
  The straight forehead line is what separates it from a guitar pick, a seed or a map pin; it is the
  single most "Cycladic" cue in the silhouette.
- Nose: a tapered stadium cut with fill-rule evenodd. Radius 3 at the brow (y=18) widening to radius
  5.5 at the tip (y=43). 8 units of stone remain between the forehead edge and the top of the nose, which
  is 2 px at 16 px, so the brow never collapses; the cut is 6 units wide at the brow (1.5 px at 16 px) so
  it stays open rather than greying out.
- The nose runs from 15% to 78% of the face height, close to the proportion of the sculptures.

**mark-b**

- Outline: one closed path, stroke 8, round joins, no fill. Round crown (control points at y=8), sides
  tightening into a soft chin at (32,56.5) through a small quadratic so the point is softened, not sharp.
  The centreline is inset 0.5 so the outer extent stays 44 x 55.5 (x 10-54, y 4-59.5).
- Nose: a filled tapered stadium, radius 3 at the brow (y=22) to 4.5 at the tip (y=36). It keeps 7
  units of clear space to the inner edge of the crown and 6 units to the chin diagonal, so the counter
  around it survives at 16 px. (An 18-unit nose ending at y=39 came within 4.9 units of the chin sides and
  the counter closed up at 16 px.)
- The nose is filled rather than stroked on purpose: a stroked line in a pin reads as an "info" icon;
  the taper is what makes it a nose.

**lockup-a**

- viewBox 0 0 320 80. Wordmark "thera." in Inter 600, 60 px, letter-spacing -1.5, baseline y=62.
- mark-a scaled 0.85 (height 45) so it spans the ascender-to-baseline band of the wordmark; the chin
  overshoots the baseline by 0.75 units like a round letter would. Gap mark-to-text about 18 units.
- Inter is not installed on this VM, so renders/lockup-a-320.png uses a fallback face. The files
  renders/lockup-a-inter-proof-*.png were rendered with Inter embedded and are the ones to judge.

## What was tried and rejected

- A lyre-shaped face with flared temples (the literal "lyre" reading): the flare turns into horns and the
  whole thing reads as a molar.
- A rounded inverted trapezoid with straight sides: flowerpot / tooth.
- A straight stadium slot for the nose: reads as a buttonhole or a zero, not a nose. The taper is essential.
- An inverted version (disc or rounded tile with the face carved out and the nose hanging from the rim,
  tying in the ring / theta idea): at any size it reads as a bell or an open mouth with a uvula.
- An outlined bubble with an off-center speech tail: clunky, and it unbalances the lockup.

## Preference

**mark-a.** It is the more ownable of the two: the flat-topped solid with a carved, tapered nose is not a
shape anyone else is using, while an outlined pin with a mark inside is a crowded category. It is also the
stronger small-size mark: at 16 px it is a solid silhouette with one clean light cut, whereas the outline
of mark-b is a 2 px ring. Solid also matches the brand better: stone, calm, premium.
mark-b is worth keeping as the friendlier alternate, or as a line-style icon inside the product where the
pin / bubble double reading is useful.

## Renders

renders/ contains mark-a and mark-b at 512, 48 (+zoom) and 16 (+zoom), lockup-a at 320 (fallback font),
and the Inter-proofed lockup at 1024 and 320. Both marks were also checked as #F7F9FA on #1C2E3D at 128
and 16 px; both read.

## Production pass

Checked fresh renders at 512 / 48 / 16 and the Inter-embedded lockup proof. Three fixes, idea unchanged:

- mark-a: moved the face down 1 unit (the top-heavy silhouette read high in the box) and opened the nose
  cut from r2.5-5 to r3-5.5 so it is a continuous light column at 16 px instead of greying out at the brow.
- mark-b: the nose tip at y=39 came within 4.9 units of the chin diagonal and the counter filled in at
  16 px; the nose now ends at y=36 (6 units clear). Stroke 7 to 8 so the ring is a solid 2 px at 16 px,
  with the centreline inset 0.5 so the outer extent and margins are unchanged.
- lockup-a: carries the updated mark path; the translate was adjusted by -0.85 so the mark keeps the same
  position against the type (ascender-to-baseline band, ~19 units to the t). No alignment change needed.
