# Animation module contract

Each animation lives in `design/logos/animations/<track>/` and consists of:

- `anim.js` — a plain browser script (no ES modules, no imports). It registers one factory:

  ```js
  window.TheraAnimations = window.TheraAnimations || {};
  window.TheraAnimations["<track>"] = {
    title: "Goddess to coin",            // short
    from: "Classical goddess",           // label at t = 0
    to: "Goddess on the coin",           // label at t = 1
    viewBox: "0 0 640 640",              // the SVG's viewBox (square)
    mount(container) {                   // injects ONE <svg> into container, returns a controller
      ...
      return {
        set(t) { /* 0 = illustration, 1 = logo; must be idempotent and scrubbable in both directions */ },
        destroy() { /* remove listeners, clear container */ },
      };
    },
  };
  ```

- `demo.html` — a standalone test page (copy `tools/demo-template.html`, set `data-track`). It loads flubber from the CDN, then `anim.js`, mounts into `#stage`, and exposes `window.__anim` (the controller) and a range slider.

Rules
- Pure SVG + JS. Allowed library: flubber 0.4.2 (`window.flubber`, loaded by the host page before `anim.js`): `flubber.interpolate(fromPath, toPath, {maxSegmentLength: 2})` returns `t => dString`. Prefer hand-matched paths (same command structure, numbers lerped) for the hero morph where you control both ends; use flubber for everything else. No GSAP, no CSS keyframes for the morph itself (CSS transitions are fine for simple opacity/transform if they are driven from `set(t)` deterministically, but prefer direct attribute updates).
- `set(t)` must be deterministic: calling `set(0.5)` twice gives the same frame; calling `set(1)` then `set(0)` restores the illustration exactly. Precompute interpolators in `mount`, do only cheap work in `set`.
- The end state at t = 1 must be the logo exactly, in its colours, centred, filling about 70% of the viewBox. The start state at t = 0 must be a full-colour illustration (not a sketch, not a photo).
- Colours interpolate through pleasant intermediates (interpolate in RGB or OKLab, never through grey mud). Time the layers: detail should dissolve or collapse in the first ~60% of t while the main masses morph through the whole range; the logo's final hard edges and exact colours should lock in during the last ~15%.
- Keep the DOM small (under ~80 elements) and the frame cheap, so scrubbing at 60 fps works on a phone.
- Respect `prefers-reduced-motion`: the host handles playback; the module only needs `set(t)`.

Render to check
  node design/logos/animations/tools/frames.mjs design/logos/animations/<track>/demo.html design/logos/animations/<track>/frames
writes frame-000.png … frame-100.png at t = 0, .1, …, 1 and `filmstrip.png` (all eleven in a row), plus `reverse-check.txt` reporting whether set(1)→set(0) restored the t=0 frame pixel-for-pixel. Read `filmstrip.png` and the individual frames with the Read tool and look honestly at every stage, not only the ends.
