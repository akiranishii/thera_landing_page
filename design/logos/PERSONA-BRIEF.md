# Round 3 brief: Thera, the personal assistant

## What the founder asked
"Possible to make this into a side profile of an elegant goddess as well (minimal as possible), which can be called Thera the personal assistant?"

"This" is the adopted mark, **Caldera and Sunken Head** (`final/profile-crescent/`): a disc split by a goddess profile looking right; the ink crescent in front of her face is the cliffs of Thera, the sea-blue half behind the profile is the sunken head, and the knocked-out dot is the island she looks toward. It is live on the website (navbar, favicon, app icon, link preview) and is the end state of the Santorini animation the founder loved.

The new goal: the mark should read, first and unmistakably, as **an elegant goddess in side profile**, a persona named Thera who is your personal assistant. Minimal as possible. It should feel like the same family as the adopted mark (it can be an evolution of it), so the brand does not restart.

## What "elegant goddess" means here
- A long, graceful neck; a straight classical (Greek) nose; a calm, closed composure; upswept hair or a chignon; at most one ornament (a pearl, a diadem line, a single laurel leaf).
- Elegance comes from proportion and from few, long, confident curves. Not from detail.
- She looks right (toward the wordmark and the future).
- She is a calm, trustworthy assistant persona: warm, intelligent, discreet. Not a sexualised figure, not a cartoon mascot, not a generic "user" icon, not a therapy/psychology brand.

## Minimal
- Two to four shapes total. Every curve is an arc or a clean cubic with tangent joins. No feature smaller than 4 units on the 64 viewBox. Light gaps at least 6 units.
- If you can remove something and she is still a goddess, remove it.

## Must keep from the adopted mark (family resemblance)
Choose deliberately which of these you carry: the disc silhouette (r 28 at 32,32), the Blue Haze two-tone (ink #223848 + sea #8DA8BB, light #F7F9FA), the island dot (it can become a pearl earring or an eye), the profile grammar (forehead arc, straight nose ridge about 30° from vertical, short lip plane, one chin arc). Adopted mark geometry (64 viewBox):
```
crescent (ink, evenodd with dot): M 26.31 4.59 A 28 28 0 1 1 35.32 59.8 A 4 4 0 0 1 30.97 54.86 L 31.4 53.13 A 8.5 8.5 0 0 0 30.3 41.5 L 29.9 36.7 L 33.68 34.06 A 2 2 0 0 0 34.26 31.41 L 25.8 17 A 25.1 25.1 0 0 0 23.55 10.3 A 4 4 0 0 1 26.31 4.59 Z M 41.1 28 A 5.2 5.2 0 1 1 51.5 28 A 5.2 5.2 0 1 1 41.1 28 Z
head (sea #8DA8BB): M 35.32 59.8 A 28 28 0 0 1 26.31 4.59 A 4 4 0 0 0 23.55 10.3 A 25.1 25.1 0 0 1 25.8 17 L 34.26 31.41 A 2 2 0 0 1 33.68 34.06 L 29.9 36.7 L 30.3 41.5 A 8.5 8.5 0 0 1 31.4 53.13 L 30.97 54.86 A 4 4 0 0 0 35.32 59.8 Z
```
Read `final/profile-crescent/README.md` for its construction and rules.

## Lessons from rounds 1 and 2 (read before drawing)
- A thin profile cut through a disc reads as a cracked coin; a profile across a ring reads as a prohibition sign; a crescent with a face reads as "moon with a face". Avoid.
- Small nose/lip/chin bumps (1.5–4 units) make faces cartoonish and vanish at 48 px. Build each profile from at most four calm moves; the nose is the dominant move; the forehead is short.
- Positive head silhouettes (cameo, plain head-in-circle) were judged generic "user avatar" glyphs and blobs at 16 px. This round DOES want a persona, so a head is welcome, but it must be ownable and elegant: the chignon, the long neck, the pearl or the crescent are what make it Thera rather than anyone.
- Every mark must still work at 16 px (favicon) as one calm shape, at 20–24 px in a navbar beside "thera.", at 32–40 px as a chat avatar labelled "Thera", and at 512 px. Provide a simplified 16 px cut where needed.
- Single colour must work (ink on light, light on dark). Two-tone is a bonus.

## Usage contexts the mark must serve
1. Navbar lockup beside "thera." (Inter SemiBold, letter-spacing -1.5, #223848).
2. The assistant's avatar in chat, labelled "Thera" (circular bubble, 32–40 px).
3. Favicon (16 px) and iOS app icon (dark tile #1C2E3D).
4. Large hero / link preview (two-tone).

## Files (same conventions as earlier rounds)
- Concepts: `concepts/<slug>/` with mark-a.svg, mark-b.svg (two genuinely different takes), lockup-a.svg, avatar-a.svg (your preferred mark in a circular 64x64 bubble as it would appear as Thera's chat avatar), README.md.
- viewBox 0 0 64 64 for marks and avatars; lockups trimmed to about 200 x 80.
- Render with `node tools/render.mjs <file.svg> <outDir> [sizes] [bg]` and Read the PNGs (especially -512.png and the -16-zoom.png / -48-zoom.png). Inter is installed, so lockups render with the real wordmark.
