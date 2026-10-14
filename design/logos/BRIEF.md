# thera. logo exploration brief

## The product
thera. — The Relationship Assistant. A voice-first AI personal CRM: remember who matters, know when to reconnect, make the meeting happen. Positioning: a personal chief of staff for relationships. Premium, calm, warm, intelligent. Not a sales CRM, not a social network, not a generic AI chatbot.

## The name and the inspiration
"Thera" (Θήρα) is the classical Greek name of Santorini. The Minoan eruption of Thera is one of the sources of the Atlantis legend: an advanced island city, built in concentric rings of land and water (Plato), lost to the sea. The founder's intent: thera. is building the next kind of network, a city of real relationships, as advanced and well-designed as Atlantis was imagined to be.

Visual sources to draw from (inspired by, not literal):
- The side-face profile of a Greek goddess / classical statue, or the ultra-minimal Cycladic figurine head (the Cyclades include Thera) with only a nose ridge.
- Santorini: the caldera (a ring of cliffs around a sunken crater), crescent island seen from above, white domes and arcs, the horizon line at sunset, blue and white.
- Atlantis: concentric rings, canals, a plan-view city, harbor, Greek key / meander.
- The Greek letter theta Θ: the initial of Θήρα, a circle crossed by a line — also an eye, a horizon, a caldera.
- Relationship: two profiles, two arcs meeting, an intersection, a path between two points.

## Brand system it must live in
- Wordmark is lowercase "thera." with a trailing period, set in Inter semibold, tight tracking.
- Palette (Blue Haze): background #F7F9FA, ink/headings #223848, primary #466680, muted blue #8DA8BB, light accent #C4D5E0, surface #EAF0F4, dark section #1C2E3D. No gradients, no neon.
- Current placeholder symbol: two overlapping circles with a filled lens. We want something more distinctive and more ownable.

## Hard requirements for every mark
- Pure SVG, geometric construction (circles, arcs, lines, simple paths). Clean, even stroke weights or solid fills; round or square caps consistently.
- Works in a single color (ink on light, light on ink). No gradients, no text inside the mark.
- Must be recognizable at 16 px (favicon) and 48 px, and beautiful at 512 px. Avoid thin hairlines and tiny details that collapse at 16 px.
- Must sit comfortably next to "thera." as a horizontal lockup, with an optical size close to the x-height to cap-height of the type.
- Modern and restrained, in the spirit of Linear / Apple / Stripe-era marks. No clip-art, no literal statues, no stock "AI" imagery.
- Evoke the inspiration (Santorini, goddess profile, Atlantis, Θ) without being a tourist postcard.

## File conventions
- Each concept lives in design/logos/concepts/<slug>/ with: mark-a.svg, mark-b.svg (two variants), lockup-a.svg (mark + "thera." wordmark, horizontal), and README.md (idea, construction notes, which variant you prefer and why).
- Marks use viewBox="0 0 64 64" with the shape optically centered and about 48–56 units across (leave 4–8 units of margin).
- Lockups use viewBox="0 0 320 80" or similar, mark on the left, wordmark text: <text font-family="Inter, system-ui, sans-serif" font-weight="600" letter-spacing="-1.5" fill="#223848">thera.</text>
- Render to check: node design/logos/tools/render.mjs <file.svg> <outDir> [sizes=512,48,16] [bg=#ffffff]. It writes <name>-512.png, -48.png, -16.png plus pixelated -zoom.png files for the small sizes. Read the PNGs with the Read tool and look at them honestly. Also render once with bg=#1c2e3d after recoloring to light, or just check the mono version reads.
