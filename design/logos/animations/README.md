# thera. logo animations

Scrubbable SVG morphs from an illustration to a logo mark, built as self-contained modules.

**Current (v2, on-brand).** Both illustrations are drawn in the Blue Haze palette with the marks' geometric vocabulary, so every frame belongs to the identity. Style rules are in `v2/STYLE.md`; `tools/palette-check.mjs` verifies every frame stays on palette.

| Track | From | To | Module |
| --- | --- | --- | --- |
| goddess-coin | Geometric goddess portrait on a coin: laurel, ringed chignon, earring | "Goddess on the coin" (final/coin-profile, two-tone) | `v2/goddess-coin/anim.js` |
| santorini-crescent | Santorini postcard in a disc: ink cliff, white village, blue domes, sea, sail, sun | "Caldera and Sunken Head" (final/profile-crescent, duotone) | `v2/santorini-crescent/anim.js` |

Rejected v2 candidates (Blue Haze silver coin with dolphins, aerial map emblem) are in `v2/<track>/<approach>/`.

**Earlier (v1, warm).** Fully rendered warm illustrations that only reached the palette near the end: `goddess-coin/`, `santorini-crescent/`, `goddess-portrait/`. Copies registered under `-warm` ids live in `warm/` for the comparison section of the page.

`index.html` is the presentation page (published as a claude.ai artifact; it is written without a document skeleton because the artifact host supplies one). Each `<track>/demo.html` is a standalone test page. Rejected approaches are kept in `goddess-coin/portrait/`, `goddess-coin/ancient-coin/`, `santorini-crescent/postcard/` and `santorini-crescent/aerial/` with their frames.

## Using a module

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/flubber/0.4.2/flubber.min.js"></script>
<script src="v2/goddess-coin/anim.js"></script>
<script>
  const def = window.TheraAnimations["goddess-coin"];   // { title, from, to, viewBox, mount }
  const ctrl = def.mount(document.querySelector("#stage")); // injects one <svg>
  ctrl.set(0);     // illustration
  ctrl.set(0.5);   // halfway
  ctrl.set(1);     // the exact logo
</script>
```

`set(t)` is deterministic and cheap (well under a millisecond per frame), so any easing or scroll-linked driver can call it. The modules assume a `#F7F9FA` background (the light band of the coin mark and the island dot are drawn in that colour). See `CONTRACT.md` for the full module contract and `tools/frames.mjs` to render filmstrips.
