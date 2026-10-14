/* thera. logo animation v2 — track "santorini-crescent", approach "emblem-postcard".
 *
 * t = 0  A day-lit Santorini postcard composed inside the logo's disc, all in Blue Haze: a pale sky
 *        (#EAF0F4) with a lighter haze band (#F7F9FA, clipped to an inset circle so it never touches
 *        the rim), two white cloud pills and a white sun; the caldera sea (#8DA8BB) with a light
 *        horizon band (#C4D5E0), a low volcanic islet (#466680) and a small white-sailed boat; on the
 *        right the ink cliff (#223848) with a sunlit strip along its sea-facing face (a 55/45 mix of
 *        #466680 and #223848), three domed chapels on the stepped skyline (#466680 domes against the
 *        sky) and a cascade of white cubes down the face (#FFFFFF fronts, #DDE6EC shade sides,
 *        arched #466680 doors).
 * t = 1  "Caldera and Sunken Head": cliffs crescent #223848, sunken head (the sea) #8DA8BB, island
 *        dot knocked out (evenodd) in #F7F9FA at (463,280) r 52. Disc centre (320,320) r 280.
 *
 * Story: the caldera fills. The sea rises inside the disc while the cliff grows up and around it;
 * the cliff's sea-facing face becomes the goddess profile, so the head ends up sunk in the sea.
 *   sea      -> sunken head   the part of the disc below the horizon (an exact circular segment).
 *                             The horizon rises on the same clock as the cliff's crown and never
 *                             passes it (level - crown = 160 (1 - qc) >= 0) while the skyline always
 *                             rises to the right of the crown, so the cliff covers the sea's right
 *                             side by construction. From t = 0.96 the exact HEAD_D string is used.
 *   cliff    -> crescent      hand-matched outline: face segments map one to one onto the profile
 *                             segments (crown fillet, brow, nose ridge, nose tip, lips, chin, neck),
 *                             the stepped skyline lifts out past the rim; the outline is clipped to
 *                             the rim analytically (no clip-path). Crown and neck move with the cliff
 *                             clock, the nose and lips form last (0.96). Exact CLIFF_D + DOT_D after.
 *   sun      -> island dot    drawn above the rock and never hidden: it travels on a quadratic path
 *                             over the cliff top and settles into (463,280) r 52 while the rock rises
 *                             around it (0.08-0.80); white -> #F7F9FA over 0.80-0.95.
 *   village  -> the rock      the cubes gather and close ranks into a stepped pyramid riding the live
 *                             cliff (0.04-0.30, face houses first), then the pyramid sinks into the
 *                             rock below its own base line (0.28-0.50). Nothing fades.
 *   lit strip -> the profile  narrows into the face edge (0.04-0.46).
 *   islet    -> the sea       sinks below its waterline (0.06-0.36).
 *   boat     -> the rim       sails out of the disc to the left (0.04-0.46).
 *   haze band, horizon band   narrow into the rising horizon line (0.06-0.50).
 *   clouds, sky               are covered by the rising sea and the rising rock; the last sliver of
 *                             sky drifts to page colour (0.78-0.95) so the rim does not flicker at
 *                             the swap.
 * Every fill is a Blue Haze swatch or a flat mix of two; colour changes are tiny (sun, sky sliver).
 * set(t) also rewrites the page rect's width every frame so the browser repaints the whole picture
 * at once (partial repaints made its two raster buffers differ by a grey level at edges, which
 * broke the pixel-exact reverse check).
 */
(function () {
  'use strict';
  var NS = 'http://www.w3.org/2000/svg';
  var WHITE = '#FFFFFF', BG = '#F7F9FA', SURFACE = '#EAF0F4', LINE = '#DDE6EC', LIGHT = '#C4D5E0';
  var SEA = '#8DA8BB', PRIMARY = '#466680', INK = '#223848';
  var CX = 320, CY = 320, R = 280;
  var EXACT_T = 0.96;
  var SPACING = 3;

  /* ---------------------------------------------------------------- exact end state (LOGO_PATHS.md) */
  var HEAD_D = 'M 353.2 598 A 280 280 0 0 1 263.1 45.9 A 40 40 0 0 0 235.5 103 A 251 251 0 0 1 258 170 L 342.6 314.1 A 20 20 0 0 1 336.8 340.6 L 299 367 L 303 415 A 85 85 0 0 1 314 531.3 L 309.7 548.6 A 40 40 0 0 0 353.2 598 Z';
  var CLIFF_D = 'M 263.1 45.9 A 280 280 0 1 1 353.2 598 A 40 40 0 0 1 309.7 548.6 L 314 531.3 A 85 85 0 0 0 303 415 L 299 367 L 336.8 340.6 A 20 20 0 0 0 342.6 314.1 L 258 170 A 251 251 0 0 0 235.5 103 A 40 40 0 0 1 263.1 45.9 Z';
  var DOT_D = 'M 411 280 A 52 52 0 1 1 515 280 A 52 52 0 1 1 411 280 Z';

  /* ---------------------------------------------------------------- the cliff */
  // Sea-facing face, crown -> neck -> a tail past the rim. [t = 0 segment, t = 1 segment]
  var FACE = [
    ['M 388 192 A 16 16 0 0 0 380 206',       'M 263.1 45.9 A 40 40 0 0 0 235.5 103'],   // crown fillet
    ['M 380 206 L 377 262',                   'M 235.5 103 A 251 251 0 0 1 258 170'],    // brow
    ['M 377 262 L 388 318',                   'M 258 170 L 342.6 314.1'],                // nose ridge
    ['M 388 318 A 10 10 0 0 1 385 332',       'M 342.6 314.1 A 20 20 0 0 1 336.8 340.6'],// nose tip
    ['M 385 332 L 375 350',                   'M 336.8 340.6 L 299 367'],                // under the nose
    ['M 375 350 L 373 398',                   'M 299 367 L 303 415'],                    // lips
    ['M 373 398 A 160 160 0 0 1 356 522',     'M 303 415 A 85 85 0 0 1 314 531.3'],      // chin
    ['M 356 522 L 350 545',                   'M 314 531.3 L 309.7 548.6'],              // under the chin
    ['M 350 545 A 60 60 0 0 0 333 600',       'M 309.7 548.6 A 40 40 0 0 0 353.2 598'],  // neck fillet
    ['M 333 600 L 335 664',                   'M 353.2 598 L 361 664']                   // tail, outside the disc
  ];
  // weight of the cliff clock per face node (the rest is the slow feature clock)
  var NODE_W = [1, 0.9, 0.7, 0.35, 0.25, 0.25, 0.35, 0.6, 0.85, 1, 1];
  // Skyline, crown -> right, stepped terraces for the village; it lifts out past the rim. It always
  // rises to the right of the crown, so it never dips below the crown (and below the sea level).
  var SKYLINE = ['M 388 192 L 446 192 L 446 180 L 514 180 L 514 168 L 724 168',
                 'M 263.1 45.9 L 300 8 L 724 -12'];
  var CROWN0 = [388, 192], CROWN1 = [263.1, 45.9], LEVEL0 = 352;   // the horizon starts 160 below the crown

  /* ---------------------------------------------------------------- the village */
  // [left x, floor y, w, h, dome r, door, stack row, stack column] in draw order (upper tiers first,
  // the houses on the cliff face last). The stack is a stepped pyramid of equal cubes: row 0 has six
  // cubes, row 1 five, row 2 the three domed chapels; every house keeps its side of the village.
  var HOUSES = [
    [396, 192, 32, 17, 12, 0, 2, 0],   // three chapels on the skyline terraces, domes against the sky
    [454, 180, 34, 19, 13, 0, 2, 1],
    [522, 168, 32, 17, 12, 0, 2, 2],
    [392, 227, 36, 26, 0, 1, 1, 0],    // the village cascading down the cliff face, against the rock
    [428, 225, 29, 22, 0, 0, 1, 1],
    [457, 227, 41, 31, 0, 1, 1, 2],
    [498, 225, 31, 24, 0, 0, 1, 3],
    [529, 222, 29, 22, 0, 0, 1, 4],
    [397, 261, 34, 26, 0, 0, 0, 0],
    [431, 258, 38, 29, 0, 0, 0, 3],
    [469, 261, 29, 22, 0, 0, 0, 5],
    [402, 294, 31, 26, 0, 1, 0, 1],
    [433, 292, 29, 22, 0, 0, 0, 4],
    [407, 326, 34, 24, 0, 1, 0, 2]
  ];
  var LIT_W = 14;                      // the sunlit strip along the cliff face (sun on the left), narrows into the edge
  var SIDE = 0.3;                      // share of each cube that is its shaded side face (#DDE6EC)
  var CUBE = [18, 15];                 // stack cube size
  var STACK_OFF = [78, 108];           // the stack's base centre, relative to the live crown

  /* ---------------------------------------------------------------- sea and sky details */
  var ISLET_D = 'M 112 404 A 66 34 0 0 1 214 384 A 46 28 0 0 1 280 404 Z';
  var ISLET_BASE = 404, ISLET_H = 36;
  var HULL_D = 'M 222 452 L 276 452 A 30 30 0 0 1 262 462 L 236 462 A 30 30 0 0 1 222 452 Z';
  var SAIL_D = 'M 251 404 L 251 446 L 226 446 Z';
  var JIB_D = 'M 255 414 L 255 446 L 273 446 Z';
  var SUN0 = [292, 128, 36], SUN_C = [476, 104], SUN1 = [463, 280, 52];   // quadratic path over the cliff top
  // cloud pills [x, y, w, h]: the left one is covered by the rising sea, the right one by the rising rock
  var CLOUDS = [[86, 196, 112, 13], [176, 140, 64, 10]];
  var HAZE_R = 258;                    // the haze band is clipped to this inset circle, so it never touches the rim

  /* ---------------------------------------------------------------- helpers */
  function clamp01(x) { return x < 0 ? 0 : x > 1 ? 1 : x; }
  function sstep(a, b, t) { var x = clamp01((t - a) / (b - a)); return x * x * (3 - 2 * x); }
  function lerp(a, b, t) { return a + (b - a) * t; }
  function f1(v) { return (Math.round(v * 10) / 10).toString(); }
  // OKLab mix between two swatches (the ends are returned verbatim)
  function toLab(hex) {
    var c = [1, 3, 5].map(function (i) { var v = parseInt(hex.slice(i, i + 2), 16) / 255; return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); });
    var l = Math.cbrt(0.4122214708 * c[0] + 0.5363325363 * c[1] + 0.0514459929 * c[2]);
    var m = Math.cbrt(0.2119034982 * c[0] + 0.6806995451 * c[1] + 0.1073969566 * c[2]);
    var s = Math.cbrt(0.0883024619 * c[0] + 0.2817188376 * c[1] + 0.6299787005 * c[2]);
    return [0.2104542553 * l + 0.7936177850 * m - 0.0040720468 * s, 1.9779984951 * l - 2.4285922050 * m + 0.4505937099 * s, 0.0259040371 * l + 0.7827717662 * m - 0.8086757660 * s];
  }
  function fromLab(L) {
    var l = L[0] + 0.3963377774 * L[1] + 0.2158037573 * L[2], m = L[0] - 0.1055613458 * L[1] - 0.0638541728 * L[2], s = L[0] - 0.0894841775 * L[1] - 1.2914855480 * L[2];
    l = l * l * l; m = m * m * m; s = s * s * s;
    return '#' + [4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s, -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s, -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s].map(function (v) {
      v = v <= 0.0031308 ? 12.92 * v : 1.055 * Math.pow(v, 1 / 2.4) - 0.055; v = Math.round(255 * clamp01(v)); return (v < 16 ? '0' : '') + v.toString(16);
    }).join('').toUpperCase();
  }
  function mix(a, b, t) { if (t <= 0) return a; if (t >= 1) return b; var A = toLab(a), B = toLab(b); return fromLab([lerp(A[0], B[0], t), lerp(A[1], B[1], t), lerp(A[2], B[2], t)]); }
  function el(tag, attrs, parent) {
    var e = document.createElementNS(NS, tag);
    for (var k in attrs) e.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(e);
    return e;
  }
  var mountCount = 0;

  window.TheraAnimations = window.TheraAnimations || {};
  window.TheraAnimations['santorini-crescent'] = {
    title: 'Santorini to the caldera crescent',
    from: 'Santorini postcard',
    to: 'Caldera and Sunken Head',
    viewBox: '0 0 640 640',
    mount: function (container) {
      var uid = 'thera-scv2-' + (++mountCount) + '-';
      var svg = el('svg', { viewBox: '0 0 640 640', xmlns: NS, role: 'img', 'aria-label': 'Santorini becoming the thera. mark' });
      container.appendChild(svg);

      /* ---- sample matched outlines (the probe needs the svg in the document) ---- */
      var probe = el('path', {}, svg);
      function plen(d) { probe.setAttribute('d', d); return probe.getTotalLength(); }
      function sample(d, n) {
        probe.setAttribute('d', d); var L = probe.getTotalLength(), out = [];
        for (var i = 0; i < n; i++) { var q = probe.getPointAtLength(L * i / (n - 1)); out.push(q.x, q.y); }
        return out;
      }
      // face: one flat list of samples, crown -> tail; each sample knows its node and its fraction
      var FS = [], FE = [], FA = [], FF = [];
      FACE.forEach(function (pair, k) {
        var n = Math.max(3, Math.ceil(Math.max(plen(pair[0]), plen(pair[1])) / SPACING) + 1);
        var s = sample(pair[0], n), e = sample(pair[1], n);
        for (var i = k ? 1 : 0; i < n; i++) { FS.push(s[2 * i], s[2 * i + 1]); FE.push(e[2 * i], e[2 * i + 1]); FA.push(k); FF.push(i / (n - 1)); }
      });
      var FN = FA.length;
      var skyN = Math.ceil(Math.max(plen(SKYLINE[0]), plen(SKYLINE[1])) / SPACING) + 1;
      var KS = sample(SKYLINE[0], skyN), KE = sample(SKYLINE[1], skyN);
      svg.removeChild(probe);
      var nodeQ = new Float64Array(NODE_W.length);
      var LIT_END = FA.indexOf(6);         // the strip runs from the crown to the start of the chin

      /* ---- village: every house's start rect and its slot in the stack (relative to the base centre) ---- */
      var NH = HOUSES.length, rowCount = [6, 5, 3];
      var SLOT = HOUSES.map(function (h) {
        var row = h[6], col = h[7], n = rowCount[row];
        return [(col - (n - 1) / 2) * CUBE[0] - CUBE[0] / 2, -(row + 1) * CUBE[1]];   // left x, top y
      });
      var HX = new Float64Array(NH), HY = new Float64Array(NH), HW = new Float64Array(NH), HH = new Float64Array(NH), HR = new Float64Array(NH);

      /* ---- defs (all clip paths are constant: set(t) never adds or removes one) ---- */
      var defs = el('defs', {}, svg);
      var discClip = el('clipPath', { id: uid + 'disc' }, defs);
      el('circle', { cx: CX, cy: CY, r: R }, discClip);
      var hazeClip = el('clipPath', { id: uid + 'haze' }, defs);
      el('circle', { cx: CX, cy: CY, r: HAZE_R }, hazeClip);
      var isletClip = el('clipPath', { id: uid + 'islet' }, defs);
      el('rect', { x: 40, y: 40, width: 560, height: ISLET_BASE - 40 }, isletClip);
      var villageClip = el('clipPath', { id: uid + 'village' }, defs);
      var villageClipRect = el('rect', { x: 40, y: 40, width: 560, height: 560 }, villageClip);

      /* ---- layers, back to front. Every shape stays inside the disc's bounding box. ---- */
      var page = el('rect', { x: 0, y: 0, width: 640, height: 640, fill: BG }, svg);
      var sky = el('circle', { cx: CX, cy: CY, r: R, fill: SURFACE }, svg);
      var haze = el('rect', { x: 40, width: 560, fill: BG, 'clip-path': 'url(#' + uid + 'haze)' }, svg);
      var clouds = CLOUDS.map(function (c) { return el('rect', { y: c[1], width: c[2], height: c[3], rx: c[3] / 2, fill: WHITE }, svg); });
      var sea = el('path', { fill: SEA }, svg);
      var hband = el('rect', { x: 40, width: 560, fill: LIGHT, 'clip-path': 'url(#' + uid + 'disc)' }, svg);
      var isletG = el('g', { 'clip-path': 'url(#' + uid + 'islet)' }, svg);
      var islet = el('path', { d: ISLET_D, fill: PRIMARY }, isletG);
      var boatClip = el('g', { 'clip-path': 'url(#' + uid + 'disc)' }, svg);
      var boat = el('g', {}, boatClip);
      el('path', { d: SAIL_D, fill: WHITE }, boat);
      el('path', { d: JIB_D, fill: WHITE }, boat);
      el('path', { d: HULL_D, fill: INK }, boat);
      var cliff = el('path', { fill: INK }, svg);
      var lit = el('path', { fill: mix(INK, PRIMARY, 0.55) }, svg);
      var village = el('g', { 'clip-path': 'url(#' + uid + 'village)' }, svg);
      var hEls = HOUSES.map(function (h) {
        return {
          side: el('rect', { fill: LINE }, village),
          face: el('rect', { fill: WHITE }, village),
          door: h[5] ? el('path', { fill: PRIMARY }, village) : null,
          dome: h[4] ? el('path', { fill: PRIMARY }, village) : null
        };
      });
      var sun = el('circle', {}, svg);

      /* ---- disc geometry ---- */
      function rr(x, y) { var dx = x - CX, dy = y - CY; return dx * dx + dy * dy; }
      // where the segment from inside point (x0,y0) to outside point (x1,y1) meets the rim
      var HIT = [0, 0];
      function rimHit(x0, y0, x1, y1) {
        var dx = x1 - x0, dy = y1 - y0, fx = x0 - CX, fy = y0 - CY;
        var a = dx * dx + dy * dy, b = 2 * (fx * dx + fy * dy), c = fx * fx + fy * fy - R * R;
        var u = a > 0 ? (-b + Math.sqrt(Math.max(0, b * b - 4 * a * c))) / (2 * a) : 0;
        u = clamp01(u); HIT[0] = x0 + dx * u; HIT[1] = y0 + dy * u;
      }
      var SX = new Float64Array(2 * skyN), FX = new Float64Array(2 * FN);

      function set(t) {
        t = clamp01(+t || 0);
        var i, exact = t >= EXACT_T;
        /* clocks */
        var qc = sstep(0.02, 0.96, t);           // cliff clock: crown, skyline, sea level
        var qs = sstep(0.18, 0.96, t);           // slow feature clock: nose and lips form last
        for (i = 0; i < NODE_W.length; i++) nodeQ[i] = qs + (qc - qs) * NODE_W[i];
        var crownX = lerp(CROWN0[0], CROWN1[0], qc), crownY = lerp(CROWN0[1], CROWN1[1], qc);
        var level = lerp(LEVEL0, CROWN1[1], qc);

        /* main masses. The page rect is rewritten every frame so the whole picture is repainted at once:
           partial repaints let the browser's two raster buffers drift apart by a grey level at edges. */
        page.setAttribute('width', '640');
        sky.setAttribute('display', exact ? 'none' : '');
        sky.setAttribute('fill', mix(SURFACE, BG, sstep(0.78, 0.95, t)));   // only a sliver is left by then
        if (exact) {
          sea.setAttribute('d', HEAD_D);
          cliff.setAttribute('d', CLIFF_D + ' ' + DOT_D); cliff.setAttribute('fill-rule', 'evenodd');
        } else {
          // the sea: the part of the disc below the horizon
          var half = Math.sqrt(Math.max(0, R * R - (level - CY) * (level - CY)));
          sea.setAttribute('d', 'M' + f1(CX - half) + ' ' + f1(level) + 'L' + f1(CX + half) + ' ' + f1(level) +
            'A280 280 0 ' + (level < CY ? 1 : 0) + ' 1 ' + f1(CX - half) + ' ' + f1(level) + 'Z');
          // the cliff: skyline from the crown to the rim, the rim clockwise, the face back up to the crown
          for (i = 0; i < skyN; i++) { SX[2 * i] = lerp(KS[2 * i], KE[2 * i], qc); SX[2 * i + 1] = lerp(KS[2 * i + 1], KE[2 * i + 1], qc); }
          for (i = 0; i < FN; i++) {
            var a = FA[i], q = nodeQ[a] + (nodeQ[a + 1] - nodeQ[a]) * FF[i];
            FX[2 * i] = lerp(FS[2 * i], FE[2 * i], q); FX[2 * i + 1] = lerp(FS[2 * i + 1], FE[2 * i + 1], q);
          }
          var R2 = R * R, ks = 1, kf = 1;
          while (ks < skyN - 1 && rr(SX[2 * ks], SX[2 * ks + 1]) < R2) ks++;
          while (kf < FN - 1 && rr(FX[2 * kf], FX[2 * kf + 1]) < R2) kf++;
          var d = 'M' + f1(SX[0]) + ' ' + f1(SX[1]);
          for (i = 1; i < ks; i++) d += 'L' + f1(SX[2 * i]) + ' ' + f1(SX[2 * i + 1]);
          rimHit(SX[2 * ks - 2], SX[2 * ks - 1], SX[2 * ks], SX[2 * ks + 1]);
          var hsx = HIT[0], hsy = HIT[1];
          rimHit(FX[2 * kf - 2], FX[2 * kf - 1], FX[2 * kf], FX[2 * kf + 1]);
          var hfx = HIT[0], hfy = HIT[1];
          var sweep = Math.atan2(hfy - CY, hfx - CX) - Math.atan2(hsy - CY, hsx - CX);
          while (sweep < 0) sweep += 2 * Math.PI;
          d += 'L' + f1(hsx) + ' ' + f1(hsy) + 'A280 280 0 ' + (sweep > Math.PI ? 1 : 0) + ' 1 ' + f1(hfx) + ' ' + f1(hfy);
          for (i = kf - 1; i > 0; i--) d += 'L' + f1(FX[2 * i]) + ' ' + f1(FX[2 * i + 1]);
          cliff.setAttribute('d', d + 'Z'); cliff.setAttribute('fill-rule', 'nonzero');
        }
        // sunlit strip on the face: inset along the face's inward normal, tapered at both ends
        var lw = LIT_W * (1 - sstep(0.04, 0.46, t));
        lit.setAttribute('display', exact || lw <= 0 ? 'none' : '');
        if (!exact && lw > 0) {
          var ld = 'M' + f1(FX[0]) + ' ' + f1(FX[1]), back = '';
          for (i = 1; i <= LIT_END; i++) ld += 'L' + f1(FX[2 * i]) + ' ' + f1(FX[2 * i + 1]);
          for (i = LIT_END; i >= 0; i--) {
            var ia = i > 0 ? i - 1 : 0, ib = i < LIT_END ? i + 1 : LIT_END;
            var tx = FX[2 * ib] - FX[2 * ia], ty = FX[2 * ib + 1] - FX[2 * ia + 1], tl = Math.sqrt(tx * tx + ty * ty) || 1;
            var f = i / LIT_END, wv = lw * Math.min(1, i / 6) * (f < 0.55 ? 1 : 1 - sstep(0.55, 1, f));
            back += 'L' + f1(FX[2 * i] + ty / tl * wv) + ' ' + f1(FX[2 * i + 1] - tx / tl * wv);
          }
          lit.setAttribute('d', ld + back + 'Z');
        }

        /* sky details: the haze band narrows into the horizon, the clouds drift into the sea and the rock */
        var kb = sstep(0.06, 0.5, t), hzH = 40 * (1 - kb), hbH = 12 * (1 - kb);
        var showBands = !exact && kb < 1;
        haze.setAttribute('display', showBands ? '' : 'none'); hband.setAttribute('display', showBands ? '' : 'none');
        if (showBands) {
          haze.setAttribute('y', f1(level - hzH)); haze.setAttribute('height', f1(hzH));
          hband.setAttribute('y', f1(level)); hband.setAttribute('height', f1(hbH));
        }
        var drift = 26 * sstep(0, 0.6, t), hideClouds = exact || t >= 0.7;
        for (i = 0; i < clouds.length; i++) {
          clouds[i].setAttribute('display', hideClouds ? 'none' : '');
          clouds[i].setAttribute('x', f1(CLOUDS[i][0] + drift * (i === 1 ? 0.6 : 1)));
        }

        /* islet sinks below its waterline; the boat sails out of the disc */
        var ki = sstep(0.06, 0.36, t);
        isletG.setAttribute('display', ki >= 1 || exact ? 'none' : '');
        islet.setAttribute('transform', 'translate(0 ' + f1(ISLET_H * ki) + ')');
        var kbt = sstep(0.04, 0.46, t);
        boatClip.setAttribute('display', kbt >= 1 || exact ? 'none' : '');
        boat.setAttribute('transform', 'translate(' + f1(-250 * kbt) + ' ' + f1(-6 * kbt) + ')');

        /* village: gather into one stepped stack on the live cliff, then sink into the rock */
        var sx = clamp01((t - 0.28) / 0.22), sk = sx * sx * (2 - sx);   // eases in, leaves at speed: no lingering crumbs
        var showVillage = !exact && sk < 1;
        village.setAttribute('display', showVillage ? '' : 'none');
        if (showVillage) {
          var bx = crownX + STACK_OFF[0], by = crownY + STACK_OFF[1];
          var top = 1e9;
          for (i = 0; i < NH; i++) {
            var h = HOUSES[i], s = SLOT[i];
            var g = sstep(0.04 + 0.012 * (NH - 1 - i), 0.3 + 0.004 * (NH - 1 - i), t);   // the face houses lead
            HX[i] = lerp(h[0], bx + s[0], g); HY[i] = lerp(h[1] - h[3], by + s[1], g);
            HW[i] = lerp(h[2], CUBE[0], g); HH[i] = lerp(h[3], CUBE[1], g);
            HR[i] = h[4] ? lerp(h[4], CUBE[0] * (1 - SIDE) * 0.46, g) : 0;
            var tp = HY[i] - HR[i]; if (tp < top) top = tp;
          }
          var dy = sk * (by - top + 1);
          villageClipRect.setAttribute('height', f1(sk > 0 ? Math.max(0, by - 40) : 560));
          for (i = 0; i < NH; i++) {
            var e = hEls[i], x = HX[i], y = HY[i] + dy, W = HW[i], Hh = HH[i], sw = W * SIDE, fw = W - sw;
            e.side.setAttribute('x', f1(x)); e.side.setAttribute('y', f1(y)); e.side.setAttribute('width', f1(sw + 0.6)); e.side.setAttribute('height', f1(Hh));
            e.face.setAttribute('x', f1(x + sw)); e.face.setAttribute('y', f1(y)); e.face.setAttribute('width', f1(fw)); e.face.setAttribute('height', f1(Hh));
            if (e.door) {
              var dw = Math.min(6, fw * 0.3), dh = Math.min(9, Hh * 0.45);
              var dx0 = x + sw + fw / 2 - dw / 2, yb = y + Hh, ya = yb - dh + dw / 2;   // an arched Cycladic door
              e.door.setAttribute('d', 'M' + f1(dx0) + ' ' + f1(yb) + 'V' + f1(ya) + 'A' + f1(dw / 2) + ' ' + f1(dw / 2) + ' 0 0 1 ' + f1(dx0 + dw) + ' ' + f1(ya) + 'V' + f1(yb) + 'Z');
            }
            if (e.dome) {
              var r = HR[i], dcx = x + sw + fw / 2;
              e.dome.setAttribute('d', 'M' + f1(dcx - r) + ' ' + f1(y + 0.5) + 'A' + f1(r) + ' ' + f1(r) + ' 0 0 1 ' + f1(dcx + r) + ' ' + f1(y + 0.5) + 'Z');
            }
          }
        }

        /* sun -> island dot */
        var su = sstep(0.08, 0.8, t), sa = (1 - su) * (1 - su), sb = 2 * su * (1 - su), sc = su * su;
        sun.setAttribute('display', exact ? 'none' : '');
        sun.setAttribute('cx', f1(sa * SUN0[0] + sb * SUN_C[0] + sc * SUN1[0])); sun.setAttribute('cy', f1(sa * SUN0[1] + sb * SUN_C[1] + sc * SUN1[1]));
        sun.setAttribute('r', f1(lerp(SUN0[2], SUN1[2], su)));
        sun.setAttribute('fill', mix(WHITE, BG, sstep(0.8, 0.95, t)));
      }

      return {
        set: set,
        destroy: function () { if (svg.parentNode) svg.parentNode.removeChild(svg); }
      };
    }
  };
})();
