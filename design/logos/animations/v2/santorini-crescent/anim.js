/* thera. logo animation v2 — track "santorini-crescent" (final; from approach "emblem-postcard").
 *
 * t = 0  A day-lit Santorini postcard composed inside the logo's disc, all in Blue Haze: a #DDE6EC
 *        sky that separates the disc from the #F7F9FA page, a low Therasia on the far horizon (a flat
 *        60/40 mix of #C4D5E0 and #8DA8BB), two white cloud pills and a white sun; the caldera sea
 *        (#8DA8BB) with a #466680 volcanic islet and a white-sailed boat; on the right the ink cliff
 *        (#223848) with a sunlit strip along its sea-facing face (a flat mix of #466680 and #223848),
 *        three chapels whose white walls hang in front of the rock (flush with the terrace risers)
 *        with #466680 domes against the sky, and nine white cubes down the face (#FFFFFF fronts,
 *        #C4D5E0 shade sides, arched #466680 doors). 44 shapes.
 * t = 1  "Caldera and Sunken Head": cliffs crescent #223848, sunken head (the sea) #8DA8BB, island
 *        dot knocked out (evenodd) in #F7F9FA at (463,280) r 52. Disc centre (320,320) r 280.
 *
 * Story: the caldera fills. The sea rises inside the disc while the cliff grows up and around it;
 * the cliff's sea-facing face becomes the goddess profile, so the head ends up sunk in the sea.
 *   cliff    -> crescent      hand-matched outline: face segments map one to one onto the profile
 *                             segments (crown fillet, brow, nose ridge, nose tip, lips, chin, neck);
 *                             the skyline's corners are matched explicitly (terraces and risers pair
 *                             with points of the end skyline, risers flatten by 0.36) and the skyline
 *                             lifts out past the rim. The outline is clipped to the rim analytically.
 *                             Crown and neck run on the cliff clock, nose and lips form last.
 *   sea      -> sunken head   the disc below a horizon that rises with the crown, bounded on the right
 *                             by the very same face polyline as the cliff, so sea and cliff are two
 *                             abutting fills at every t, exactly as the logo renders. 0.55-0.85 the
 *                             horizon bends into the rim: its left end climbs the rim while its right
 *                             end climbs the cliff's edge (face, crown, skyline), both meeting at the
 *                             skyline's rim exit, so the top edge stays one straight chord and the sky
 *                             closes as a shrinking triangle at the rim (left rim whole by ~0.8; from
 *                             0.85 sea + cliff tile the disc with no sky left).
 *   sun      -> island dot    drawn above everything and never hidden: it climbs over the cliff top,
 *                             reaches x ~455 well right of the crown corner, then drifts down to
 *                             (463,280), growing from r 36 to r 52 while the rock rises around it.
 *                             White -> #F7F9FA over 0.80-0.98.
 *   village  -> the dot       the cubes gather into a stepped 5/4/3 pyramid riding the cliff
 *                             (0.04-0.27, lowest houses first), then the pyramid shrinks into the
 *                             sun's live centre (0.28-0.45), white into white: the village becomes the
 *                             island dot. The domes drop into the ink on the way. Nothing fades.
 *   lit strip -> the profile  narrows into the face edge (0.04-0.46).
 *   islet    -> the sea       sinks below its waterline (0.06-0.36).
 *   boat     -> the rim       sails out of the disc to the left (0.04-0.46).
 *   Therasia -> the sea       sits on the live horizon and sinks into the rising sea (0.06-0.45).
 *   clouds   -> the horizon   each pill eases down onto the rising horizon and narrows into it (by 0.5).
 *   sky      -> covered       by the rising sea, the bending horizon and the rising rock.
 * Rim stretches are drawn as sub-arcs of at most 90 degrees with exact endpoints (3 decimals), so the
 * implied arc centre never drifts (within 0.002 of the intended centre at every t) and nothing spills
 * past the rim. The intended centre is (320,320) until 0.80; it then glides 0.9 units onto the circle
 * that the logo's own r 280 arcs actually draw (about (320.90, 319.87), see LC0) by 0.99, so the swap
 * to the exact LOGO_PATHS strings at t = 0.995 is seamless. Every fill is a Blue Haze swatch or a flat
 * mix of two; the only colour change is the sun's white -> #F7F9FA. set(t) rewrites the page rect's
 * width every frame so the browser repaints the whole picture at once (without it, partial repaints
 * leave the raster a grey level off at edges and the pixel-exact reverse check fails).
 */
(function () {
  'use strict';
  var NS = 'http://www.w3.org/2000/svg';
  var WHITE = '#FFFFFF', BG = '#F7F9FA', LINE = '#DDE6EC', LIGHT = '#C4D5E0';
  var SEA = '#8DA8BB', PRIMARY = '#466680', INK = '#223848';
  var CX = 320, CY = 320, R = 280, TAU = 2 * Math.PI, QUARTER = Math.PI / 2;
  var EXACT_T = 0.995;
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
  // Skyline corners, crown -> far right: terrace, riser, terrace, riser, terrace. Each corner is
  // matched to a point of the end skyline (which lies outside the disc); risers pair with zero-length
  // stretches, so they flatten on their own faster clock and never slide along the crown.
  var SKY0 = [[388, 192], [446, 192], [446, 178], [502, 178], [502, 166], [724, 166]];
  var SKY1 = [[263.1, 45.9], [281.5, 27], [281.5, 27], [300, 8], [300, 8], [724, -12]];
  var LEVEL0 = 352;                    // the horizon starts 160 below the crown and rises with it

  /* ---------------------------------------------------------------- the village */
  // [left x, floor y, w, h, dome r, door, stack row, stack column] in draw order (chapels first, the
  // lowest houses last). Chapels hang their white walls from the terrace line (wall top = terrace),
  // so the walls read on the rock and only the domes stand against the sky. The pyramid is 5/4/3.
  var HOUSES = [
    [400, 210, 32, 18, 12, 0, 2, 0],
    [446, 196, 34, 18, 13, 0, 2, 1],
    [502, 184, 30, 18, 11, 0, 2, 2],
    [385, 247, 42, 32, 0, 1, 1, 0],
    [432, 241, 34, 25, 0, 0, 1, 1],
    [471, 251, 45, 34, 0, 1, 1, 2],
    [521, 239, 32, 26, 0, 0, 1, 3],
    [393, 288, 38, 31, 0, 0, 0, 0],
    [436, 285, 40, 29, 0, 1, 0, 2],
    [481, 292, 31, 25, 0, 0, 0, 4],
    [400, 325, 39, 28, 0, 1, 0, 1],
    [444, 320, 31, 24, 0, 0, 0, 3]
  ];
  var LIT_W = 14;                      // the sunlit strip along the cliff face (sun on the left)
  var SIDE = 0.3;                      // share of each cube that is its shaded side face (#C4D5E0)
  var CUBE = [18, 15];                 // pyramid cube size
  var STACK_OFF = [86, 70];            // the pyramid's base centre, relative to the live crown
  var V_GATHER = [0.04, 0.27], V_SHRINK = [0.28, 0.45];

  /* ---------------------------------------------------------------- sea and sky details */
  var ISLET_D = 'M 112 404 A 66 34 0 0 1 214 384 A 46 28 0 0 1 280 404 Z';
  var ISLET_BASE = 404, ISLET_H = 36;
  var HULL_D = 'M 222 452 L 276 452 A 30 30 0 0 1 262 462 L 236 462 A 30 30 0 0 1 222 452 Z';
  var SAIL_D = 'M 251 404 L 251 446 L 226 446 Z';
  var JIB_D = 'M 255 414 L 255 446 L 273 446 Z';
  // Therasia, the far rim of the caldera: a long low plateau built from two shallow arcs, base on y 352
  var THERASIA_D = 'M 20 352 A 160 24 0 0 1 178 334 A 66 18 0 0 1 244 352 Z';
  var THERASIA_H = 24;
  // the sun's keyframes [t, x, y, r]: over the cliff top, clear of the crown corner, then down into the rock
  var SUN_K = [[0.04, 292, 128, 36], [0.14, 366, 98, 38], [0.24, 444, 128, 40], [0.40, 461, 212, 46], [0.60, 463, 262, 50], [0.80, 463, 280, 52]];
  // cloud pills [x, y, w, h] and their [start, end] of the descent onto the horizon
  var CLOUDS = [[86, 196, 112, 13], [176, 140, 64, 10]];
  var CLOUD_T = [[0.04, 0.46], [0.08, 0.5]];

  /* ---------------------------------------------------------------- helpers */
  function clamp01(x) { return x < 0 ? 0 : x > 1 ? 1 : x; }
  function sstep(a, b, t) { var x = clamp01((t - a) / (b - a)); return x * x * (3 - 2 * x); }
  function lerp(a, b, t) { return a + (b - a) * t; }
  function f2(v) { return (Math.round(v * 100) / 100).toString(); }
  function f3(v) { return (Math.round(v * 1000) / 1000).toString(); }
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
  // monotone cubic keyframe track (Fritsch-Butland tangents, flat at both ends): no overshoot
  function track(keys) {
    var n = keys.length, dims = keys[0].length - 1, M = [];
    for (var k = 0; k < n; k++) {
      M.push([]);
      for (var j = 1; j <= dims; j++) {
        var m = 0;
        if (k > 0 && k < n - 1) {
          var h0 = keys[k][0] - keys[k - 1][0], h1 = keys[k + 1][0] - keys[k][0];
          var d0 = (keys[k][j] - keys[k - 1][j]) / h0, d1 = (keys[k + 1][j] - keys[k][j]) / h1;
          if (d0 * d1 > 0) { var w1 = 2 * h1 + h0, w2 = h1 + 2 * h0; m = (w1 + w2) / (w1 / d0 + w2 / d1); }
        }
        M[k].push(m);
      }
    }
    return function (t, out) {
      if (t <= keys[0][0]) { for (var j = 0; j < dims; j++) out[j] = keys[0][j + 1]; return out; }
      if (t >= keys[n - 1][0]) { for (j = 0; j < dims; j++) out[j] = keys[n - 1][j + 1]; return out; }
      var k = 0; while (t > keys[k + 1][0]) k++;
      var h = keys[k + 1][0] - keys[k][0], s = (t - keys[k][0]) / h, s2 = s * s, s3 = s2 * s;
      var a = 2 * s3 - 3 * s2 + 1, b = s3 - 2 * s2 + s, c = -2 * s3 + 3 * s2, d = s3 - s2;
      for (j = 0; j < dims; j++) out[j] = a * keys[k][j + 1] + b * h * M[k][j] + c * keys[k + 1][j + 1] + d * h * M[k + 1][j];
      return out;
    };
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
      svg.removeChild(probe);
      FS[0] = SKY0[0][0]; FS[1] = SKY0[0][1]; FE[0] = SKY1[0][0]; FE[1] = SKY1[0][1];   // the crown is shared exactly
      var FN = FA.length;
      var nodeQ = new Float64Array(NODE_W.length);
      var LIT_END = FA.indexOf(6);         // the strip runs from the crown to the start of the chin

      /* ---- skyline: the flattened version (risers gone) lies on the line crown -> far end ---- */
      var NK = SKY0.length, SKYF = SKY0.map(function (p, k) {
        var a = SKY0[0], z = SKY0[NK - 1], u = (p[0] - a[0]) / (z[0] - a[0]);
        return k === 0 || k === NK - 1 ? p.slice() : [p[0], lerp(a[1], z[1], u)];
      });
      var KX = new Float64Array(NK), KY = new Float64Array(NK);
      function skyAt(x, X, Y) {                // y of a skyline polyline at x (risers skipped)
        for (var k = 1; k < NK; k++) if (X[k] > X[k - 1] + 1e-6 && x <= X[k]) return lerp(Y[k - 1], Y[k], clamp01((x - X[k - 1]) / (X[k] - X[k - 1])));
        return Y[NK - 1];
      }

      /* ---- village: start rects, pyramid slots, gather order (lowest houses first) ---- */
      var NH = HOUSES.length, rowCount = [5, 4, 3];
      var SLOT = HOUSES.map(function (h) {
        var row = h[6], col = h[7], n = rowCount[row];
        return [(col - (n - 1) / 2) * CUBE[0] - CUBE[0] / 2, -(row + 1) * CUBE[1]];   // left x, top y
      });
      var order = HOUSES.map(function (h, i) { return i; }).sort(function (a, b) { return HOUSES[b][1] - HOUSES[a][1]; });
      var GS = new Float64Array(NH), GE = new Float64Array(NH), DOMEX = new Float64Array(NH), TERR0 = new Float64Array(NH);
      var SX0 = new Float64Array(NK), SY0 = new Float64Array(NK);
      for (var k0 = 0; k0 < NK; k0++) { SX0[k0] = SKY0[k0][0]; SY0[k0] = SKY0[k0][1]; }
      order.forEach(function (i, rank) {
        GS[i] = V_GATHER[0] + 0.011 * rank; GE[i] = V_GATHER[1] - 0.06 + 0.005 * rank;
      });
      HOUSES.forEach(function (h, i) {
        DOMEX[i] = h[0] + h[2] * SIDE + h[2] * (1 - SIDE) / 2;
        TERR0[i] = h[4] ? skyAt(DOMEX[i], SX0, SY0) : 0;
      });
      var PYR_DOME = CUBE[0] * (1 - SIDE) * 0.46;

      /* ---- defs (all clip paths are constant: set(t) never adds or removes one) ---- */
      var defs = el('defs', {}, svg);
      var discClip = el('clipPath', { id: uid + 'disc' }, defs);
      el('circle', { cx: CX, cy: CY, r: R }, discClip);
      var isletClip = el('clipPath', { id: uid + 'islet' }, defs);
      el('rect', { x: 40, y: 40, width: 560, height: ISLET_BASE - 40 }, isletClip);

      /* ---- layers, back to front ---- */
      var page = el('rect', { x: 0, y: 0, width: 640, height: 640, fill: BG }, svg);
      var sky = el('circle', { cx: CX, cy: CY, r: R, fill: LINE }, svg);
      var clouds = CLOUDS.map(function (c) { return el('rect', { width: c[2], fill: WHITE }, svg); });
      var therasiaG = el('g', { 'clip-path': 'url(#' + uid + 'disc)' }, svg);
      var therasia = el('path', { d: THERASIA_D, fill: mix(LIGHT, SEA, 0.4) }, therasiaG);
      var sea = el('path', { fill: SEA }, svg);
      var isletG = el('g', { 'clip-path': 'url(#' + uid + 'islet)' }, svg);
      var islet = el('path', { d: ISLET_D, fill: PRIMARY }, isletG);
      var boatClip = el('g', { 'clip-path': 'url(#' + uid + 'disc)' }, svg);
      var boat = el('g', {}, boatClip);
      el('path', { d: SAIL_D, fill: WHITE }, boat);
      el('path', { d: JIB_D, fill: WHITE }, boat);
      el('path', { d: HULL_D, fill: INK }, boat);
      var cliff = el('path', { fill: INK }, svg);
      var lit = el('path', { fill: mix(INK, PRIMARY, 0.55) }, svg);
      var village = el('g', { 'clip-path': 'url(#' + uid + 'disc)' }, svg);
      var hEls = HOUSES.map(function (h) {
        return {
          side: el('rect', { fill: LIGHT }, village),
          face: el('rect', { fill: WHITE }, village),
          door: h[5] ? el('path', { fill: PRIMARY }, village) : null,
          dome: h[4] ? el('path', { fill: PRIMARY }, village) : null
        };
      });
      var sun = el('circle', {}, svg);
      var sunAt = track(SUN_K), SUN = [0, 0, 0];

      /* ---- disc geometry ---- */
      // The logo's own rim: its two r 280 arcs share endpoints (263.1,45.9) and (353.2,598), a chord that is
      // almost a diameter, so the circle they draw is centred at about (320.90, 319.87), not (320,320).
      // The rim is drawn around (320,320) until 0.80 and glides onto that exact circle by 0.99, so the
      // swap to the exact strings at 0.995 does not shift the rim.
      var LC0 = (function () {
        var x0 = 353.2, y0 = 598, x1 = 263.1, y1 = 45.9, mx = (x0 + x1) / 2, my = (y0 + y1) / 2;
        var dx = x1 - x0, dy = y1 - y0, c = Math.sqrt(dx * dx + dy * dy), h = Math.sqrt(Math.max(0, R * R - c * c / 4));
        return [mx + (-dy / c) * h, my + (dx / c) * h];   // small arc, sweep 1 (HEAD_D's outer arc)
      })();
      var ccx = CX, ccy = CY;
      function rr(x, y) { var dx = x - ccx, dy = y - ccy; return dx * dx + dy * dy; }
      // where the segment from inside point (x0,y0) to outside point (x1,y1) meets the rim: its angle
      function rimAngle(x0, y0, x1, y1) {
        var dx = x1 - x0, dy = y1 - y0, fx = x0 - ccx, fy = y0 - ccy;
        var a = dx * dx + dy * dy, b = 2 * (fx * dx + fy * dy), c = fx * fx + fy * fy - R * R;
        var u = a > 0 ? clamp01((-b + Math.sqrt(Math.max(0, b * b - 4 * a * c))) / (2 * a)) : 0;
        return Math.atan2(y0 + dy * u - ccy, x0 + dx * u - ccx);
      }
      function rimPt(a) { return f3(ccx + R * Math.cos(a)) + ' ' + f3(ccy + R * Math.sin(a)); }
      // the rim clockwise from angle a0 to a1 as sub-arcs of at most 90 degrees (start point already drawn)
      function rimArcs(a0, a1) {
        var sw = a1 - a0; while (sw < 0) sw += TAU; while (sw >= TAU) sw -= TAU;
        var n = Math.max(1, Math.ceil(sw / QUARTER - 1e-9)), s = '';
        for (var k = 1; k <= n; k++) s += (sw * R / n < 1 ? 'L' : 'A280 280 0 0 1 ') + rimPt(a0 + sw * k / n);
        return s;
      }
      function ccw(a0, a1) { var sw = a1 - a0; while (sw < 0) sw += TAU; while (sw >= TAU) sw -= TAU; return sw; }
      var FX = new Float64Array(2 * FN);
      // the cliff's edge from the horizon up to the skyline's rim exit (the bend's right-hand track)
      var BP = new Float64Array(2 * (FN + NK + 2)), BL = new Float64Array(FN + NK + 2), nb = 0;
      function pushB(x, y) {
        if (nb) { var dx = x - BP[2 * nb - 2], dy = y - BP[2 * nb - 1]; BL[nb] = BL[nb - 1] + Math.sqrt(dx * dx + dy * dy); } else BL[0] = 0;
        BP[2 * nb] = x; BP[2 * nb + 1] = y; nb++;
      }

      function set(t) {
        t = clamp01(+t || 0);
        var i, k, exact = t >= EXACT_T;
        /* clocks */
        var qc = sstep(0.02, 1, t);              // cliff clock: crown, skyline, sea level
        var qs = sstep(0.18, 1, t);              // slow feature clock: nose and lips form last
        var qr = sstep(0.04, 0.36, t);           // the skyline's risers flatten
        var bend = sstep(0.55, 0.85, t);         // the horizon bends into the rim arc
        for (i = 0; i < NODE_W.length; i++) nodeQ[i] = qs + (qc - qs) * NODE_W[i];
        for (k = 0; k < NK; k++) {
          KX[k] = lerp(lerp(SKY0[k][0], SKYF[k][0], qr), SKY1[k][0], qc);
          KY[k] = lerp(lerp(SKY0[k][1], SKYF[k][1], qr), SKY1[k][1], qc);
        }
        var crownX = KX[0], crownY = KY[0];
        var kl = sstep(0.8, 0.99, t); ccx = lerp(CX, LC0[0], kl); ccy = lerp(CY, LC0[1], kl);
        var level = lerp(LEVEL0, SKY1[0][1], qc);
        for (i = 0; i < FN; i++) {
          var a = FA[i], q = nodeQ[a] + (nodeQ[a + 1] - nodeQ[a]) * FF[i];
          FX[2 * i] = lerp(FS[2 * i], FE[2 * i], q); FX[2 * i + 1] = lerp(FS[2 * i + 1], FE[2 * i + 1], q);
        }
        sunAt(t, SUN);
        var scx = SUN[0], scy = SUN[1], sr = SUN[2];

        /* main masses. The page rect is rewritten every frame so the whole picture is repainted at once
           (partial repaints let the browser's raster drift a grey level at edges; see the header). */
        page.setAttribute('width', '640');
        sky.setAttribute('display', exact || bend >= 1 ? 'none' : '');
        if (exact) {
          sea.setAttribute('d', HEAD_D);
          cliff.setAttribute('d', CLIFF_D + ' ' + DOT_D); cliff.setAttribute('fill-rule', 'evenodd');
        } else {
          var R2 = R * R, ks = 1, kf = 1;
          while (ks < NK - 1 && rr(KX[ks], KY[ks]) < R2) ks++;
          while (kf < FN - 1 && rr(FX[2 * kf], FX[2 * kf + 1]) < R2) kf++;
          var as = rimAngle(KX[ks - 1], KY[ks - 1], KX[ks], KY[ks]);
          var af = rimAngle(FX[2 * kf - 2], FX[2 * kf - 1], FX[2 * kf], FX[2 * kf + 1]);
          // the cliff: skyline from the crown to the rim, the rim clockwise, the face back up to the crown
          var sky_d = '', face_up = '';
          for (k = 1; k < ks; k++) sky_d += 'L' + f2(KX[k]) + ' ' + f2(KY[k]);
          for (i = kf - 1; i > 0; i--) face_up += 'L' + f2(FX[2 * i]) + ' ' + f2(FX[2 * i + 1]);
          cliff.setAttribute('d', 'M' + f2(crownX) + ' ' + f2(crownY) + sky_d + 'L' + rimPt(as) + rimArcs(as, af) + face_up + 'Z');
          cliff.setAttribute('fill-rule', 'nonzero');

          // the sea: the rim from the face's exit clockwise to the horizon's left end, the top edge,
          // then down the same face polyline (sea and cliff abut along it)
          var sd = 'M' + rimPt(af);
          if (bend >= 1) {
            // the horizon has become the rim: the sea is the rest of the disc
            sd += rimArcs(af, as);
            for (k = ks - 1; k >= 0; k--) sd += 'L' + f2(KX[k]) + ' ' + f2(KY[k]);
            for (i = 1; i < kf; i++) sd += 'L' + f2(FX[2 * i]) + ' ' + f2(FX[2 * i + 1]);
          } else {
            var half = Math.sqrt(Math.max(0, R2 - (level - ccy) * (level - ccy)));
            var aA = Math.atan2(level - ccy, -half);
            // F: where the face crosses the horizon (j = first face sample below it)
            var j = 0, Fx = crownX, Fy = crownY;
            if (level > crownY) {
              j = 1; while (j < kf && FX[2 * j + 1] < level) j++;
              var y0 = FX[2 * j - 1], y1 = FX[2 * j + 1], u = y1 > y0 ? clamp01((level - y0) / (y1 - y0)) : 1;
              Fx = lerp(FX[2 * j - 2], FX[2 * j], u); Fy = lerp(y0, y1, u);
            }
            // The bend: the horizon's left end P climbs the rim clockwise to the skyline's exit while its
            // right end E climbs the cliff's own edge (face up to the crown, then along the skyline) to
            // the same exit. The sea's top edge is the straight chord P-E, below it the sea abuts the
            // cliff along its edge, and the sky above the chord closes as a triangle at the rim.
            var aP = aA, q = 0, Ex = Fx, Ey = Fy;
            nb = 0; pushB(Fx, Fy);
            if (bend > 0) {
              aP = aA + ccw(aA, as) * bend;
              for (i = j - 1; i >= 1; i--) pushB(FX[2 * i], FX[2 * i + 1]);
              if (j >= 1) pushB(crownX, crownY);
              for (k = 1; k < ks; k++) pushB(KX[k], KY[k]);
              pushB(ccx + R * Math.cos(as), ccy + R * Math.sin(as));
              var se = BL[nb - 1] * bend;
              while (q < nb - 2 && BL[q + 1] <= se) q++;
              var we = BL[q + 1] > BL[q] ? clamp01((se - BL[q]) / (BL[q + 1] - BL[q])) : 0;
              Ex = lerp(BP[2 * q], BP[2 * q + 2], we); Ey = lerp(BP[2 * q + 1], BP[2 * q + 3], we);
            }
            sd += rimArcs(af, aP) + 'L' + f2(Ex) + ' ' + f2(Ey);
            for (k = q; k >= 0; k--) sd += 'L' + f2(BP[2 * k]) + ' ' + f2(BP[2 * k + 1]);
            for (i = j > 0 ? j : 1; i < kf; i++) sd += 'L' + f2(FX[2 * i]) + ' ' + f2(FX[2 * i + 1]);
          }
          sea.setAttribute('d', sd + 'Z');
        }

        // sunlit strip on the face: inset along the face's inward normal, tapered at both ends
        var lw = LIT_W * (1 - sstep(0.04, 0.46, t));
        lit.setAttribute('display', exact || lw <= 0 ? 'none' : '');
        if (!exact && lw > 0) {
          var ld = 'M' + f2(FX[0]) + ' ' + f2(FX[1]), back = '';
          for (i = 1; i <= LIT_END; i++) ld += 'L' + f2(FX[2 * i]) + ' ' + f2(FX[2 * i + 1]);
          for (i = LIT_END; i >= 0; i--) {
            var ia = i > 0 ? i - 1 : 0, ib = i < LIT_END ? i + 1 : LIT_END;
            var nx = FX[2 * ib] - FX[2 * ia], ny = FX[2 * ib + 1] - FX[2 * ia + 1], nl = Math.sqrt(nx * nx + ny * ny) || 1;
            var fr = i / LIT_END, wv = lw * Math.min(1, i / 6) * (fr < 0.55 ? 1 : 1 - sstep(0.55, 1, fr));
            back += 'L' + f2(FX[2 * i] + ny / nl * wv) + ' ' + f2(FX[2 * i + 1] - nx / nl * wv);
          }
          lit.setAttribute('d', ld + back + 'Z');
        }

        /* Therasia sinks into the rising sea */
        var kt = sstep(0.06, 0.45, t);
        therasiaG.setAttribute('display', exact || kt >= 1 ? 'none' : '');
        therasia.setAttribute('transform', 'translate(0 ' + f2(level - LEVEL0 + THERASIA_H * kt) + ')');

        /* clouds ease down onto the rising horizon and narrow into it */
        for (i = 0; i < CLOUDS.length; i++) {
          var c = CLOUDS[i], kc = sstep(CLOUD_T[i][0], CLOUD_T[i][1], t);
          var hh = c[3] * (1 - kc), bot = lerp(c[1] + c[3], level, kc), cw = c[2] * (1 - 0.25 * kc);
          clouds[i].setAttribute('display', exact || kc >= 1 ? 'none' : '');
          clouds[i].setAttribute('x', f2(c[0] + 18 * kc + (c[2] - cw) / 2)); clouds[i].setAttribute('width', f2(cw));
          clouds[i].setAttribute('y', f2(bot - hh)); clouds[i].setAttribute('height', f2(hh)); clouds[i].setAttribute('rx', f2(hh / 2));
        }

        /* islet sinks below its waterline; the boat sails out of the disc */
        var ki = sstep(0.06, 0.36, t);
        isletG.setAttribute('display', ki >= 1 || exact ? 'none' : '');
        islet.setAttribute('transform', 'translate(0 ' + f2(ISLET_H * ki) + ')');
        var kbt = sstep(0.04, 0.46, t);
        boatClip.setAttribute('display', kbt >= 1 || exact ? 'none' : '');
        boat.setAttribute('transform', 'translate(' + f2(-250 * kbt) + ' ' + f2(-6 * kbt) + ')');

        /* village: gather into one stepped pyramid on the live cliff, then shrink into the sun's centre */
        var kv = sstep(V_SHRINK[0], V_SHRINK[1], t), sv = 1 - kv;
        var showVillage = !exact && kv < 1;
        village.setAttribute('display', showVillage ? '' : 'none');
        if (showVillage) {
          var bx = crownX + STACK_OFF[0], by = crownY + STACK_OFF[1];
          var domeDrop = 1 - sstep(0.24, 0.38, t);
          for (i = 0; i < NH; i++) {
            var h = HOUSES[i], sl = SLOT[i], e = hEls[i];
            var g = sstep(GS[i], GE[i], t);
            var y0t = h[1] - h[3] + (h[4] ? skyAt(DOMEX[i], KX, KY) - TERR0[i] : 0);   // chapels ride their terrace
            var x = lerp(h[0], bx + sl[0], g), y = lerp(y0t, by + sl[1], g);
            var W = lerp(h[2], CUBE[0], g) * sv, Hh = lerp(h[3], CUBE[1], g) * sv;
            x = scx + (x - scx) * sv; y = scy + (y - scy) * sv;
            var sw = W * SIDE, fw = W - sw;
            e.side.setAttribute('x', f2(x)); e.side.setAttribute('y', f2(y)); e.side.setAttribute('width', f2(sw + 0.6 * sv)); e.side.setAttribute('height', f2(Hh));
            e.face.setAttribute('x', f2(x + sw)); e.face.setAttribute('y', f2(y)); e.face.setAttribute('width', f2(fw)); e.face.setAttribute('height', f2(Hh));
            if (e.door) {
              var dw = Math.min(6 * sv, fw * 0.3), dh = Math.min(9 * sv, Hh * 0.45);
              var dx0 = x + sw + fw / 2 - dw / 2, yb = y + Hh, ya = yb - dh + dw / 2;   // an arched Cycladic door
              e.door.setAttribute('d', 'M' + f2(dx0) + ' ' + f2(yb) + 'V' + f2(ya) + 'A' + f2(dw / 2) + ' ' + f2(dw / 2) + ' 0 0 1 ' + f2(dx0 + dw) + ' ' + f2(ya) + 'V' + f2(yb) + 'Z');
            }
            if (e.dome) {
              var r = lerp(h[4], PYR_DOME, g) * sv * domeDrop, dcx = x + sw + fw / 2;
              e.dome.setAttribute('d', 'M' + f2(dcx - r) + ' ' + f2(y + 0.5) + 'A' + f2(r) + ' ' + f2(r) + ' 0 0 1 ' + f2(dcx + r) + ' ' + f2(y + 0.5) + 'Z');
            }
          }
        }

        /* sun -> island dot */
        sun.setAttribute('display', exact ? 'none' : '');
        sun.setAttribute('cx', f3(scx)); sun.setAttribute('cy', f3(scy)); sun.setAttribute('r', f3(sr));
        sun.setAttribute('fill', mix(WHITE, BG, sstep(0.8, 0.98, t)));
      }

      return {
        set: set,
        destroy: function () { if (svg.parentNode) svg.parentNode.removeChild(svg); }
      };
    }
  };
})();
