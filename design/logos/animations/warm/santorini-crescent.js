/* thera. logo animation — track "santorini-crescent" (approach "postcard", final).
 *
 * t = 0  A Santorini postcard at dusk: a terracotta cliff promontory on the right, lit along its
 *        sea-facing edge, with a stepped white village on the ridge and three terraces of cube
 *        houses on the face (steel-blue shadow faces, four blue domes); the Aegean below with the
 *        sun's reflection; the volcanic islet in the caldera; a gold-to-dusk sky with the sun on
 *        the horizon and a soft two-hump island far away.
 * t = 1  The "Caldera and Sunken Head" mark: ink crescent (the cliffs) #223848, sea-blue sunken
 *        head #8DA8BB, island dot knocked out (evenodd) in #F7F9FA. Disc centre (320,320) r 280.
 *
 * Morph plan
 *   cliff        -> ink crescent   hand-matched outline: the sea-facing face becomes the goddess
 *                                  profile, the skyline and frame edges become the outer rim.
 *   sea          -> sunken head    hand-matched outline. The sea polygon is the whole lower frame
 *                                  INCLUDING the cliff's region (rim + climb + the cliff's own rim,
 *                                  point for point), and the cliff is painted on top, so the visible
 *                                  sea/cliff boundary is always the cliff's profile: no gaps, no
 *                                  notches, no needles by construction. At t >= 0.96 the exact
 *                                  LOGO_PATHS strings replace the sampled outlines.
 *   sun          -> island dot     never hidden: it is drawn above the cliff, glides from the horizon
 *                                  to (463,280) over t 0.25-0.4 (before the water reaches it) while
 *                                  it dims from gold into the cliff's live colour (so it sinks into
 *                                  the rock), then brightens through sea-blue to page colour over
 *                                  0.6-0.93; from t = 0.96 it is the evenodd hole in the cliff path.
 *   sky          -> background     the five stops travel to #F7F9FA together over t 0.3-0.65.
 *   village      -> one rigid group riding the live cliff face: translate + scale toward a point by
 *                   the cheek over t 0.08-0.4 (lowest houses lead by a few hundredths; the layout
 *                   contracts a little faster than the houses shrink, so they close ranks into one
 *                   block), white -> steel -> the cliff's live colour by 0.4, hidden from 0.42.
 *   islet, reflection, ripples, lit edge, terraces -> gone by t = 0.25; clouds and far island by 0.35.
 *
 * Every sample of every outline moves on a quadratic path: lerp(start, end, q) + 4w(1-w)*bow, where
 * q is blended between the progress of the segment's two end nodes (so neighbouring segments with
 * different timing stay continuous), bow is a precomputed mid-point control and w is q unless the
 * segment names its own bow clock.
 *   timing  the disc rim (sea rim + cliff rim, including the crown fillet) is round by t = 0.72; the
 *           horizon rises on its own clock (0.28-0.75, its left end a little ahead) so the frame's
 *           bottom-left corner and left edge round first while the horizon stays straight, then it
 *           bows onto the rim arc over 0.35-0.78; the profile's nodes are graded between the rim clock
 *           and the slow clock (crown and neck with the rim, nose and mouth last, done at t = 0.96).
 *   bows    the sea's own rim (neck -> bottom -> left) bows radially outward under ONE smooth sin^2
 *           window that is zero at both ends, so there is no pinch or shoulder where segments meet;
 *           the horizon's right end and the hidden "climb" are pulled into the cliff so the sea's top
 *           edge always meets the face from inside the rock.
 *
 * All colour interpolation is OKLCH along the shorter hue arc with a hand-picked plum stop, so
 * terracotta -> ink travels through rose, plum and indigo, never grey.
 *
 * mount(container, options): options.transparentEnd = true sets the sky rect fill to 'none' at
 * t >= 0.96 for hosts placing the mark on another background.
 */
(function () {
  'use strict';
  var NS = 'http://www.w3.org/2000/svg';
  var SPACING = 4;                  // px between outline samples
  var BG = '#F7F9FA', INK = '#223848', SEA = '#8DA8BB', STEEL = '#C4D5E0';
  var PLUM = '#754163';             // the dusk stop between terracotta and ink (OKLCH chroma 0.086)
  var CX = 320, CY = 320;           // disc centre
  var EXACT_T = 0.96;               // from here the exact logo strings are used
  var LOCK_T = 0.94;                // from here the colours are exact

  /* ------------------------------------------------------------------ colour (OKLCH) */
  var lchCache = {};
  function srgbToLin(c) { return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); }
  function linToSrgb(c) { return c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055; }
  function hexToLch(hex) {
    if (lchCache[hex]) return lchCache[hex];
    var r = srgbToLin(parseInt(hex.slice(1, 3), 16) / 255);
    var g = srgbToLin(parseInt(hex.slice(3, 5), 16) / 255);
    var b = srgbToLin(parseInt(hex.slice(5, 7), 16) / 255);
    var l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
    var m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
    var s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
    var L = 0.2104542553 * l + 0.7936177850 * m - 0.0040720468 * s;
    var A = 1.9779984951 * l - 2.4285922050 * m + 0.4505937099 * s;
    var B = 0.0259040371 * l + 0.7827717662 * m - 0.8086757660 * s;
    var C = Math.sqrt(A * A + B * B), h = Math.atan2(B, A) * 180 / Math.PI;
    if (h < 0) h += 360;
    return (lchCache[hex] = [L, C, h]);
  }
  function lchToHex(L, C, h) {
    var hr = h * Math.PI / 180, A = C * Math.cos(hr), B = C * Math.sin(hr);
    var l_ = L + 0.3963377774 * A + 0.2158037573 * B;
    var m_ = L - 0.1055613458 * A - 0.0638541728 * B;
    var s_ = L - 0.0894841775 * A - 1.2914855480 * B;
    var l = l_ * l_ * l_, m = m_ * m_ * m_, s = s_ * s_ * s_;
    var r = 4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
    var g = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
    var b = -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s;
    function ch(c) { var v = Math.round(255 * Math.max(0, Math.min(1, linToSrgb(c)))); return (v < 16 ? '0' : '') + v.toString(16); }
    return '#' + ch(r) + ch(g) + ch(b);
  }
  // mix(a, b, t): OKLCH interpolation along the shorter hue arc; exact at the ends
  function mix(a, b, t) {
    if (t <= 0) return a; if (t >= 1) return b;
    var A = hexToLch(a), B = hexToLch(b);
    var ha = A[1] < 0.015 ? B[2] : A[2], hb = B[1] < 0.015 ? A[2] : B[2];
    var dh = ((hb - ha + 540) % 360) - 180;
    return lchToHex(A[0] + (B[0] - A[0]) * t, A[1] + (B[1] - A[1]) * t, ha + dh * t);
  }
  // ramp(stops, t): piecewise mix through hand-picked stops
  function ramp(stops, t) {
    var n = stops.length - 1, x = Math.max(0, Math.min(1, t)) * n, i = Math.min(n - 1, Math.floor(x));
    return mix(stops[i], stops[i + 1], x - i);
  }

  /* ------------------------------------------------------------------ easing */
  function clamp01(x) { return x < 0 ? 0 : x > 1 ? 1 : x; }
  function sstep(a, b, t) { var x = clamp01((t - a) / (b - a)); return x * x * (3 - 2 * x); }
  function lerp(a, b, t) { return a + (b - a) * t; }

  /* ------------------------------------------------------------------ geometry */
  // Exact end-state paths (LOGO_PATHS.md)
  var HEAD_D = 'M 353.2 598 A 280 280 0 0 1 263.1 45.9 A 40 40 0 0 0 235.5 103 A 251 251 0 0 1 258 170 L 342.6 314.1 A 20 20 0 0 1 336.8 340.6 L 299 367 L 303 415 A 85 85 0 0 1 314 531.3 L 309.7 548.6 A 40 40 0 0 0 353.2 598 Z';
  var CLIFF_D = 'M 263.1 45.9 A 280 280 0 1 1 353.2 598 A 40 40 0 0 1 309.7 548.6 L 314 531.3 A 85 85 0 0 0 303 415 L 299 367 L 336.8 340.6 A 20 20 0 0 0 342.6 314.1 L 258 170 A 251 251 0 0 0 235.5 103 A 40 40 0 0 1 263.1 45.9 Z';
  var DOT_D = 'M 411 280 A 52 52 0 1 1 515 280 A 52 52 0 1 1 411 280 Z';

  // Cliff face, crown -> neck: it becomes the goddess profile.
  var PROFILE = [
    ['M 525 165 L 528 195',                 'M 263.1 45.9 A 40 40 0 0 0 235.5 103'],
    ['M 528 195 L 525 230',                 'M 235.5 103 A 251 251 0 0 1 258 170'],
    ['M 525 230 L 520 262 L 510 305',       'M 258 170 L 342.6 314.1'],
    ['M 510 305 L 508 315 L 500 335',       'M 342.6 314.1 A 20 20 0 0 1 336.8 340.6'],
    ['M 500 335 L 460 385',                 'M 336.8 340.6 L 299 367'],
    ['M 460 385 L 415 455',                 'M 299 367 L 303 415'],
    ['M 415 455 L 365 570',                 'M 303 415 A 85 85 0 0 1 314 531.3'],
    ['M 365 570 L 327 660',                 'M 314 531.3 L 309.7 548.6 A 40 40 0 0 0 353.2 598']
  ];
  // Cliff outer rim, crown clockwise to neck. It runs 20 px past the frame with rounded corners
  // (invisible at t = 0, but they round off the rim early in the morph).
  var CLIFF_RIM = [
    ['M 525 165 L 555 132 L 590 110',       'M 263.1 45.9 A 280 280 0 0 1 320 40'],
    ['M 590 110 L 625 96 Q 660 82 660 120', 'M 320 40 A 280 280 0 0 1 517.99 122.01'],
    ['M 660 120 L 660 340',                 'M 517.99 122.01 A 280 280 0 0 1 600 320'],
    ['M 660 340 L 660 620 Q 660 660 620 660', 'M 600 320 A 280 280 0 0 1 517.99 517.99'],
    ['M 620 660 L 470 660',                 'M 517.99 517.99 A 280 280 0 0 1 415.77 583.11'],
    ['M 470 660 L 327 660',                 'M 415.77 583.11 A 280 280 0 0 1 353.2 598']
  ];
  // Sea rim, neck clockwise (bottom, left, horizon) to the crown. The frame corners are big rounded
  // corners that lie entirely outside the frame (invisible at t = 0), so the square -> disc rounding
  // is spread along the rim instead of concentrated in a tight shoulder. The last segment is the
  // "climb": hidden inside the cliff at t = 0, it becomes the last 8 degrees of the arc before the crown.
  var SEA_RIM = [
    ['M 327 660 L 290 660',                 'M 353.2 598 A 280 280 0 0 1 320 600'],
    ['M 290 660 L 40 660',                  'M 320 600 A 280 280 0 0 1 122.01 517.99'],
    ['M 40 660 Q -120 660 -120 500',        'M 122.01 517.99 A 280 280 0 0 1 40 320'],
    ['M -120 500 L -120 455 Q -120 335 0 335', 'M 40 320 A 280 280 0 0 1 122.01 122.01'],
    ['M 0 335 L 500 335',                   'M 122.01 122.01 A 280 280 0 0 1 224.23 56.89'],
    ['M 500 335 L 545 318 L 556 262 L 552 196 L 538 168 L 525 165', 'M 224.23 56.89 A 280 280 0 0 1 263.1 45.9']
  ];
  var PULL_X = 70, PULL_Y = 6;      // mid-point pull of the horizon's right end into the cliff

  // Village at t = 0: [x, y, w, h]. A stepped skyline on the ridge (each house's floor sits on the
  // ridge line at its left edge, upper tiers stand on the roofs below) and three terraces of cubes on
  // the face (floors on the terrace lines). Two sizes: 22x20 and 16x16, plus the larger ridge houses.
  var HOUSES = [
    [527, 139, 26, 24], [555, 112, 22, 20], [579, 91, 26, 26], [607, 83, 22, 20],       // ridge, tier 1
    [529, 121, 22, 18], [581, 71, 22, 20], [609, 67, 18, 16],                            // tier 2 (on roofs)
    [531, 107, 16, 14], [583, 57, 16, 14],                                               // tier 3
    [532, 186, 22, 20], [560, 188, 16, 16], [582, 183, 22, 20], [610, 186, 16, 16],      // terrace 1
    [525, 238, 22, 20], [553, 241, 16, 16], [575, 235, 22, 20], [603, 238, 16, 16],      // terrace 2
    [518, 290, 22, 20], [546, 292, 16, 16], [568, 287, 22, 20], [596, 290, 16, 16], [618, 288, 16, 16]  // terrace 3
  ];
  // Terrace lines on the face (x1, y1, x2, y2), the ledges the cubes stand on
  var TERRACES = [[529, 206, 640, 200], [522, 258, 640, 252], [513, 310, 640, 304]];
  // Domes: [houseIndex, radius / house width], seated on the roof of their house
  var DOMES = [[7, 0.44], [8, 0.44], [1, 0.4], [6, 0.42]];
  // Windows: [houseIndex, dx from the house's left, dy of the window's bottom above the floor, w, h]
  var WINDOWS = [[0, 10, 7, 5, 8], [2, 10, 8, 5, 8], [9, 9, 6, 4, 6], [15, 9, 6, 4, 6], [17, 9, 6, 4, 6], [11, 9, 6, 4, 6]];
  var VILLAGE_END = [560, 400];     // where the village gathers (t = 0 coordinates, inside the cliff by the cheek)
  var VILLAGE_SCALE = 0.22, HOUSE_SCALE = 0.38;   // group layout scale and house size scale at the end of the glide
  // Sun reflection and ripples: [cx, y, w, h]
  var SPARKLES = [[432, 347, 64, 4], [432, 361, 46, 4], [432, 377, 32, 3], [432, 393, 22, 3], [432, 409, 14, 3]];
  var RIPPLES = [[95, 432, 70, 3], [175, 478, 56, 3], [60, 530, 64, 3]];
  var CLOUDS = [[40, 118, 230, 20], [300, 62, 180, 16]];
  var FAR_ISLAND_D = 'M 0 335 L 0 322 C 18 312 38 306 62 310 C 82 313 96 320 112 318 C 130 316 148 322 160 328 C 166 331 170 333 174 335 Z';

  // Node clocks. Segments blend between the progress of their two end nodes. The disc rim (sea rim
  // and cliff rim) runs on Q_RIM, which finishes at t = 0.72. The horizon's two nodes run on Q_H
  // (0.25-0.75) and its bow on Q_HB (0.4-0.8). The profile's nine nodes (crown .. neck) run on a
  // graded blend between Q_RIM and the slow Q_P: crown, fillet and neck move with the rim, the brow
  // and chin mostly with it, the nose and mouth lock last.
  var Q_P = 0, Q_RIM = 1, Q_H = 2, Q_HB = 3, Q_HL = 4, Q_NODE = 5;   // Q_HL: the horizon's left end, between the rim and the horizon clocks
  var NODE_W = [1, 1, 0.5, 0.2, 0, 0, 0.2, 0.5, 1];   // weight of Q_RIM per profile node

  var mountCount = 0;

  function el(tag, attrs, parent) {
    var e = document.createElementNS(NS, tag);
    for (var k in attrs) e.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(e);
    return e;
  }

  window.TheraAnimations = window.TheraAnimations || {};
  window.TheraAnimations['santorini-crescent-warm'] = {
    title: 'Santorini to the caldera crescent',
    from: 'Santorini at dusk',
    to: 'Caldera and Sunken Head',
    viewBox: '0 0 640 640',
    mount: function (container, options) {
      var transparentEnd = !!(options && options.transparentEnd);
      var uid = 'thera-sc-' + (++mountCount) + '-';
      var svg = el('svg', { viewBox: '0 0 640 640', xmlns: NS, 'aria-label': 'Santorini becoming the thera. mark' });
      container.appendChild(svg);

      /* ---- sampler (needs the svg in the document) ---- */
      var probe = el('path', {}, svg);
      function plen(d) { probe.setAttribute('d', d); return probe.getTotalLength(); }
      function sample(d, n) {
        probe.setAttribute('d', d); var L = probe.getTotalLength(), out = new Float64Array(2 * n);
        for (var i = 0; i < n; i++) { var q = probe.getPointAtLength(L * i / (n - 1)); out[2 * i] = q.x; out[2 * i + 1] = q.y; }
        return out;
      }
      function edge(pair) {
        var n = Math.max(3, Math.ceil(Math.max(plen(pair[0]), plen(pair[1])) / SPACING) + 1);
        return { n: n, s: sample(pair[0], n), e: sample(pair[1], n) };
      }
      var profile = PROFILE.map(edge), cliffRim = CLIFF_RIM.map(edge), seaRim = SEA_RIM.map(edge);
      svg.removeChild(probe);

      /* ---- outline segments: start, end, mid-point bow, node clocks, optional bow clock ---- */
      function seg(ed, rev, qa, qb, bow, qw) {
        var n = ed.n, s = new Float64Array(2 * n), e = new Float64Array(2 * n), b = new Float64Array(2 * n);
        for (var i = 0; i < n; i++) {
          var j = rev ? n - 1 - i : i;
          s[2 * i] = ed.s[2 * j]; s[2 * i + 1] = ed.s[2 * j + 1];
          e[2 * i] = ed.e[2 * j]; e[2 * i + 1] = ed.e[2 * j + 1];
          if (bow) { var v = bow(i / (n - 1), e[2 * i], e[2 * i + 1]); b[2 * i] = v[0]; b[2 * i + 1] = v[1]; }
        }
        return { n: n, s: s, e: e, b: b, qa: qa, qb: qb, qw: qw === undefined ? -1 : qw };
      }
      // The sea's own rim (neck -> bottom -> left, up to the horizon's left end) bows radially outward
      // under ONE sin^2 window over that chain, zero at both ends, so the frame corners round early and
      // nothing pinches where segments meet. The horizon has its own small swell on the Q_HB clock plus
      // the pull of its right end into the cliff; the climb is pulled into the cliff too.
      var SEA_BOW = 22, HORIZON_BOW = 10, chainLen = [];
      for (var cl = 0, ci = 0; ci < 4; ci++) { cl += seaRim[ci].n; chainLen.push(cl); }
      function chainBow(ci) {
        var F0 = ci ? chainLen[ci - 1] / chainLen[3] : 0, F1 = chainLen[ci] / chainLen[3];
        return function (f, ex, ey) {
          var F = F0 + (F1 - F0) * f, w = Math.sin(Math.PI * F); w = SEA_BOW * w * w;
          var dx = ex - CX, dy = ey - CY, L = Math.sqrt(dx * dx + dy * dy) || 1;
          return [w * dx / L, w * dy / L];
        };
      }
      function horizonBow(f, ex, ey) {
        var w = HORIZON_BOW * Math.sin(Math.PI * f), dx = ex - CX, dy = ey - CY, L = Math.sqrt(dx * dx + dy * dy) || 1, g = f * f;
        return [w * dx / L + PULL_X * g, w * dy / L + PULL_Y * g];
      }
      function climbBow(f) { var g = (1 - f) * (1 - f); return [PULL_X * g + 24 * Math.sin(Math.PI * f), PULL_Y * g]; }

      var rimSegs = cliffRim.map(function (e) { return seg(e, false, Q_RIM, Q_RIM, null); });
      var seaOutline = [
        seg(seaRim[0], false, Q_RIM, Q_RIM, chainBow(0)),
        seg(seaRim[1], false, Q_RIM, Q_RIM, chainBow(1)),
        seg(seaRim[2], false, Q_RIM, Q_RIM, chainBow(2)),
        seg(seaRim[3], false, Q_RIM, Q_HL, chainBow(3)),
        seg(seaRim[4], false, Q_HL, Q_H, horizonBow, Q_HB),
        seg(seaRim[5], false, Q_H, Q_RIM, climbBow)
      ].concat(rimSegs);
      // profile, emitted neck -> crown (reversed); segment j runs from node j+1 to node j
      var last = profile.length - 1;
      var cliffOutline = rimSegs.concat(profile.slice().reverse().map(function (e, k) {
        var j = last - k;
        return seg(e, true, Q_NODE + j + 1, Q_NODE + j, null);
      }));

      var Q = new Float64Array(Q_NODE + NODE_W.length);
      function outlineD(parts) {
        var str = '', first = true;
        for (var k = 0; k < parts.length; k++) {
          var sg = parts[k], n = sg.n, s = sg.s, e = sg.e, b = sg.b, qa = Q[sg.qa], dq = Q[sg.qb] - qa, inv = 1 / (n - 1);
          var qw = sg.qw >= 0 ? Q[sg.qw] : -1, ww = 4 * qw * (1 - qw);
          for (var i = first ? 0 : 1; i < n; i++) {
            var q = qa + dq * i * inv, w = qw >= 0 ? ww : 4 * q * (1 - q), i2 = 2 * i;
            var x = s[i2] + (e[i2] - s[i2]) * q + b[i2] * w, y = s[i2 + 1] + (e[i2 + 1] - s[i2 + 1]) * q + b[i2 + 1] * w;
            str += (first && i === 0 ? 'M' : 'L') + x.toFixed(1) + ' ' + y.toFixed(1);
          }
          first = false;
        }
        return str + 'Z';
      }

      /* ---- the rail: ridge (right to left) + face (crown to neck); the village rides it ---- */
      var railParts = [[cliffRim[1], true], [cliffRim[0], true]].concat(profile.map(function (e) { return [e, false]; }));
      var RN = 0, PROF0 = 0;
      for (var rp = 0; rp < railParts.length; rp++) { if (rp === 2) PROF0 = RN; RN += railParts[rp][0].n - (rp ? 1 : 0); }
      var RS = new Float64Array(2 * RN), RE = new Float64Array(2 * RN), RL = new Float64Array(2 * RN), RW = new Float64Array(RN);
      (function () {
        // RW = weight of the rim clock at each rail sample: 1 on the ridge, then the graded node weights
        // along the face, so the rail matches the painted outline.
        var w = 0, np = railParts.length;
        for (var k = 0; k < np; k++) {
          var ed = railParts[k][0], rev = railParts[k][1], n = ed.n;
          for (var i = k ? 1 : 0; i < n; i++, w++) {
            var j = rev ? n - 1 - i : i, f = i / (n - 1);
            RS[2 * w] = ed.s[2 * j]; RS[2 * w + 1] = ed.s[2 * j + 1]; RE[2 * w] = ed.e[2 * j]; RE[2 * w + 1] = ed.e[2 * j + 1];
            RW[w] = k < 2 ? 1 : NODE_W[k - 2] + (NODE_W[k - 1] - NODE_W[k - 2]) * f;
          }
        }
      })();
      // frame of a point relative to the t = 0 rail: [nearest sample k, normal offset d, tangent offset tau]
      function frameAt(cx, cy) {
        var best = 0, bd = Infinity;
        for (var k = 0; k < RN; k++) { var dx = RS[2 * k] - cx, dy = RS[2 * k + 1] - cy, dd = dx * dx + dy * dy; if (dd < bd) { bd = dd; best = k; } }
        var a = Math.max(0, best - 1), c = Math.min(RN - 1, best + 1);
        var tx = RS[2 * c] - RS[2 * a], ty = RS[2 * c + 1] - RS[2 * a + 1], L = Math.sqrt(tx * tx + ty * ty); tx /= L; ty /= L;
        var vx = cx - RS[2 * best], vy = cy - RS[2 * best + 1];
        return [best, vx * ty - vy * tx, vx * tx + vy * ty];   // normal (ty, -tx) points into the cliff
      }
      var FP = [0, 0];
      function liveFrame(fr) {   // writes the live position of a rail frame into FP
        var pk = fr[0], pa = pk > 0 ? pk - 1 : 0, pc = pk + 1 < RN ? pk + 1 : RN - 1;
        var tx = RL[2 * pc] - RL[2 * pa], ty = RL[2 * pc + 1] - RL[2 * pa + 1], L = Math.sqrt(tx * tx + ty * ty) || 1;
        tx /= L; ty /= L;
        FP[0] = RL[2 * pk] + fr[1] * ty + fr[2] * tx; FP[1] = RL[2 * pk + 1] - fr[1] * tx + fr[2] * ty;
      }
      // The village is one rigid group: every house is an offset from the village centre, and the
      // centre glides (riding the live face) from its t = 0 place to VILLAGE_END while the group scales.
      var C0 = [0, 0], ymin = Infinity, ymax = -Infinity;
      HOUSES.forEach(function (h) { var yc = h[1] + h[3] / 2; C0[0] += (h[0] + h[2] / 2) / HOUSES.length; C0[1] += yc / HOUSES.length; if (yc < ymin) ymin = yc; if (yc > ymax) ymax = yc; });
      var frameC0 = frameAt(C0[0], C0[1]), frameC1 = frameAt(VILLAGE_END[0], VILLAGE_END[1]);
      var houseOff = HOUSES.map(function (h) { return [h[0] + h[2] / 2 - C0[0], h[1] + h[3] / 2 - C0[1]]; });
      var houseDelay = HOUSES.map(function (h) { return 0.03 * (ymax - (h[1] + h[3] / 2)) / (ymax - ymin); });   // lowest first
      var terraceFrames = TERRACES.map(function (tl) { return [frameAt(tl[0], tl[1]), frameAt(tl[2], tl[3])]; });
      var HN = new Float64Array(4 * HOUSES.length);   // live x, y, w, h

      /* ---- defs ---- */
      var defs = el('defs', {}, svg);
      var skyG = el('linearGradient', { id: uid + 'sky', x1: 0, y1: 0, x2: 0, y2: 1 }, defs);
      var SKY_OFF = [0, 0.3, 0.5, 0.56, 1];
      var SKY0 = ['#5A6AA8', '#C98B9C', '#F4C272', '#EBAB63', '#D8945C'];
      var skyStops = SKY_OFF.map(function (o) { return el('stop', { offset: o }, skyG); });
      var cliffG = el('linearGradient', { id: uid + 'cliff', x1: 0, y1: 0, x2: 1, y2: 1 }, defs);
      var cliffStops = [el('stop', { offset: 0 }, cliffG), el('stop', { offset: 1 }, cliffG)];
      var seaG = el('linearGradient', { id: uid + 'sea', gradientUnits: 'userSpaceOnUse', x1: 0, y1: 335, x2: 0, y2: 660 }, defs);
      var seaStops = [el('stop', { offset: 0 }, seaG), el('stop', { offset: 1 }, seaG)];
      var glowG = el('radialGradient', { id: uid + 'glow' }, defs);
      el('stop', { offset: 0, 'stop-color': '#FFD38A', 'stop-opacity': 0.75 }, glowG);
      el('stop', { offset: 0.45, 'stop-color': '#FFC98A', 'stop-opacity': 0.3 }, glowG);
      el('stop', { offset: 1, 'stop-color': '#FFC98A', 'stop-opacity': 0 }, glowG);
      // the lit edge fades in below the crown and softens toward the bottom of the frame
      var edgeG = el('linearGradient', { id: uid + 'edge', gradientUnits: 'userSpaceOnUse', x1: 0, y1: 165, x2: 0, y2: 660 }, defs);
      el('stop', { offset: 0, 'stop-color': '#E9B892', 'stop-opacity': 0 }, edgeG);
      el('stop', { offset: 0.16, 'stop-color': '#E9B892', 'stop-opacity': 1 }, edgeG);
      el('stop', { offset: 0.6, 'stop-color': '#E9B892', 'stop-opacity': 1 }, edgeG);
      el('stop', { offset: 1, 'stop-color': '#E9B892', 'stop-opacity': 0.3 }, edgeG);

      /* ---- layers, back to front ---- */
      var skyFill = 'url(#' + uid + 'sky)', edgeStroke = 'url(#' + uid + 'edge)';
      var seaFill = 'url(#' + uid + 'sea)', cliffFill = 'url(#' + uid + 'cliff)';
      var sky = el('rect', { x: 0, y: 0, width: 640, height: 640, fill: skyFill }, svg);
      var clouds = CLOUDS.map(function (c) { return el('rect', { x: c[0], y: c[1], width: c[2], height: c[3], rx: c[3] / 2, fill: '#F7D2C6' }, svg); });
      var glow = el('circle', { fill: 'url(#' + uid + 'glow)' }, svg);
      var farIsland = el('path', { d: FAR_ISLAND_D, fill: '#8E7390' }, svg);
      var sea = el('path', { fill: seaFill }, svg);
      var islet = el('path', { d: 'M 160 380 C 185 352 212 344 240 348 C 268 352 292 362 316 380 Z' }, svg);
      var sparkles = SPARKLES.map(function (s) { return el('rect', { height: s[3], rx: s[3] / 2, fill: '#FFE6AE' }, svg); });
      var ripples = RIPPLES.map(function (s) { return el('rect', { height: s[3], rx: s[3] / 2, fill: '#FFFFFF' }, svg); });
      var cliff = el('path', { fill: cliffFill }, svg);
      var litSoft = el('path', { fill: 'none', stroke: edgeStroke, 'stroke-width': 11, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' }, svg);
      var litEdge = el('path', { fill: 'none', stroke: edgeStroke, 'stroke-width': 3.5, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' }, svg);
      var terraces = el('path', { fill: 'none', stroke: '#D59C7E', 'stroke-width': 2, 'stroke-linecap': 'round' }, svg);
      var houses = HOUSES.map(function () { return el('rect', {}, svg); });
      var sideFaces = el('path', {}, svg);
      var domes = DOMES.map(function () { return el('path', {}, svg); });
      var windows = WINDOWS.map(function () { return el('rect', { fill: '#5A4A48' }, svg); });
      var sun = el('circle', {}, svg);

      function set(t) {
        t = clamp01(t);
        var i, i2;
        var p = sstep(0, 0.96, t);              // slow clock: profile shape progress, 1 from t = 0.96
        var exact = t >= EXACT_T;
        var qr = sstep(0, 0.72, t);             // rim clock: the disc is round by t = 0.72
        Q[Q_P] = p; Q[Q_RIM] = qr;
        Q[Q_H] = sstep(0.28, 0.75, t);          // the horizon rises after the corners have started rounding
        Q[Q_HB] = sstep(0.35, 0.78, t);         // and bows onto the arc later still
        Q[Q_HL] = Q[Q_H] + 0.3 * (qr - Q[Q_H]); // its left end keeps a little closer to the rounding corner
        for (i = 0; i < NODE_W.length; i++) Q[Q_NODE + i] = p + (qr - p) * NODE_W[i];

        /* colours */
        var kc = sstep(0.1, LOCK_T, t), gc = sstep(0.15, 0.55, t);
        var cliffTop = ramp([mix('#B5614A', '#8E4F3E', gc), PLUM, INK], kc);
        var cliffBot = ramp([mix('#6E3F32', '#8E4F3E', gc), PLUM, INK], kc);
        var ks = sstep(0.15, LOCK_T, t), gs = sstep(0.15, 0.6, t);
        var seaTop = mix(mix('#3D8EB8', '#2C6A96', gs), SEA, ks);
        var seaBot = mix(mix('#1E4B7A', '#2C6A96', gs), SEA, ks);
        if (t >= LOCK_T) { cliffTop = cliffBot = INK; seaTop = seaBot = SEA; }
        var rock = mix(cliffTop, cliffBot, 0.5);   // the cliff's live colour where the sun and the village sit
        var ksky = sstep(0.3, 0.65, t);
        for (i = 0; i < skyStops.length; i++) skyStops[i].setAttribute('stop-color', ksky >= 1 ? BG : mix(SKY0[i], BG, ksky));
        // at the exact end state the masses take flat fills, so the logo colours are literal hex values
        sky.setAttribute('fill', transparentEnd && exact ? 'none' : exact ? BG : skyFill);
        sea.setAttribute('fill', exact ? SEA : seaFill); cliff.setAttribute('fill', exact ? INK : cliffFill);
        cliffStops[0].setAttribute('stop-color', cliffTop); cliffStops[1].setAttribute('stop-color', cliffBot);
        seaStops[0].setAttribute('stop-color', seaTop); seaStops[1].setAttribute('stop-color', seaBot);
        seaG.setAttribute('y1', lerp(335, 60, Q[Q_H]).toFixed(1)); seaG.setAttribute('y2', lerp(660, 600, qr).toFixed(1));

        /* main masses */
        sea.setAttribute('d', exact ? HEAD_D : outlineD(seaOutline));
        if (exact) { cliff.setAttribute('d', CLIFF_D + ' ' + DOT_D); cliff.setAttribute('fill-rule', 'evenodd'); }
        else { cliff.setAttribute('d', outlineD(cliffOutline)); cliff.setAttribute('fill-rule', 'nonzero'); }

        /* live rail (ridge + face) for the lit edge, the terraces and the village */
        for (i = 0; i < RN; i++) {
          var rq = p + (qr - p) * RW[i];
          RL[2 * i] = RS[2 * i] + (RE[2 * i] - RS[2 * i]) * rq;
          RL[2 * i + 1] = RS[2 * i + 1] + (RE[2 * i + 1] - RS[2 * i + 1]) * rq;
        }
        var fe = sstep(0.02, 0.25, t), hideEdge = fe >= 1;
        litEdge.setAttribute('display', hideEdge ? 'none' : ''); litSoft.setAttribute('display', hideEdge ? 'none' : '');
        terraces.setAttribute('display', hideEdge ? 'none' : '');
        if (!hideEdge) {
          var ed = '';
          for (i = PROF0; i < RN; i++) ed += (i === PROF0 ? 'M' : 'L') + RL[2 * i].toFixed(1) + ' ' + RL[2 * i + 1].toFixed(1);
          litEdge.setAttribute('d', ed); litEdge.setAttribute('opacity', (1 - fe).toFixed(3));
          litSoft.setAttribute('d', ed); litSoft.setAttribute('opacity', (0.32 * (1 - fe)).toFixed(3));
          var td = '';
          for (i = 0; i < terraceFrames.length; i++) {
            liveFrame(terraceFrames[i][0]); td += 'M' + FP[0].toFixed(1) + ' ' + FP[1].toFixed(1);
            liveFrame(terraceFrames[i][1]); td += 'L' + FP[0].toFixed(1) + ' ' + FP[1].toFixed(1);
          }
          terraces.setAttribute('d', td); terraces.setAttribute('opacity', (0.7 * (1 - fe)).toFixed(3));
        }

        /* sun -> island dot: drawn above everything and never hidden; it glides into the rock before the
           water reaches it, dims into the rock's colour, then brightens through sea-blue to the page */
        var su = sstep(0.25, 0.4, t), sarc = 4 * su * (1 - su);
        var sx = lerp(432, 463, su), sy = lerp(279, 280, su) - 10 * sarc, sr = lerp(54, 52, su);
        var k1 = sstep(0.25, 0.45, t), k2 = sstep(0.6, 0.78, t), k3 = sstep(0.78, 0.93, t);
        var sunCol = k3 >= 1 ? BG : k3 > 0 ? mix(SEA, BG, k3) : k2 > 0 ? mix(rock, SEA, k2) : mix(mix('#FCDC8E', '#F7B063', sstep(0.05, 0.25, t)), rock, k1);
        sun.setAttribute('display', exact ? 'none' : '');
        sun.setAttribute('cx', sx.toFixed(1)); sun.setAttribute('cy', sy.toFixed(1)); sun.setAttribute('r', sr.toFixed(1));
        sun.setAttribute('fill', sunCol);
        var fg = sstep(0.05, 0.35, t);
        glow.setAttribute('display', fg >= 1 ? 'none' : '');
        if (fg < 1) {
          glow.setAttribute('cx', sx.toFixed(1)); glow.setAttribute('cy', sy.toFixed(1));
          glow.setAttribute('r', lerp(170, 60, fg).toFixed(1)); glow.setAttribute('opacity', (1 - fg).toFixed(3));
        }

        /* sky details */
        var fc = sstep(0, 0.35, t);
        for (i = 0; i < clouds.length; i++) {
          clouds[i].setAttribute('opacity', (0.8 * (1 - fc)).toFixed(3));
          clouds[i].setAttribute('x', (CLOUDS[i][0] + 25 * fc).toFixed(1));
          clouds[i].setAttribute('display', fc >= 1 ? 'none' : '');
        }
        var fi = sstep(0.05, 0.35, t);
        farIsland.setAttribute('opacity', (1 - fi).toFixed(3)); farIsland.setAttribute('display', fi >= 1 ? 'none' : '');

        /* sea details: the islet sinks and the light on the water fades, all by t = 0.25 */
        var kis = sstep(0.06, 0.25, t);
        islet.setAttribute('display', kis >= 1 ? 'none' : '');
        if (kis < 1) {
          islet.setAttribute('transform', 'translate(0 380) scale(1 ' + (1 - kis).toFixed(4) + ') translate(0 -380)');
          islet.setAttribute('fill', mix('#4C3A36', seaBot, sstep(0.06, 0.22, t)));
        }
        var fs = sstep(0.02, 0.25, t), hideStrokes = fs >= 1;
        for (i = 0; i < sparkles.length; i++) {
          sparkles[i].setAttribute('display', hideStrokes ? 'none' : '');
          if (!hideStrokes) {
            var sw = SPARKLES[i][2] * (1 - fs);
            sparkles[i].setAttribute('x', (SPARKLES[i][0] - sw / 2).toFixed(1)); sparkles[i].setAttribute('y', SPARKLES[i][1]);
            sparkles[i].setAttribute('width', sw.toFixed(1)); sparkles[i].setAttribute('opacity', (0.9 * (1 - fs)).toFixed(3));
          }
        }
        for (i = 0; i < ripples.length; i++) {
          ripples[i].setAttribute('display', hideStrokes ? 'none' : '');
          if (!hideStrokes) {
            var rw = RIPPLES[i][2] * (1 - fs);
            ripples[i].setAttribute('x', (RIPPLES[i][0] - rw / 2).toFixed(1)); ripples[i].setAttribute('y', RIPPLES[i][1]);
            ripples[i].setAttribute('width', rw.toFixed(1)); ripples[i].setAttribute('opacity', (0.25 * (1 - fs)).toFixed(3));
          }
        }

        /* village: one rigid group gliding into the cliff by the cheek, taking the rock's colour */
        var hc1 = sstep(0.08, 0.3, t), hc2 = sstep(0.26, 0.4, t);
        var houseCol = hc2 >= 1 ? rock : mix(mix('#FFFFFF', '#AFC4D3', hc1), rock, hc2);
        var domeCol = hc2 >= 1 ? rock : mix('#2E64B8', rock, hc2);
        var hideHouses = t >= 0.42;
        liveFrame(frameC0); var ax0 = FP[0], ay0 = FP[1];
        liveFrame(frameC1); var ax1 = FP[0], ay1 = FP[1];
        for (i = 0; i < houses.length; i++) {
          var h = houses[i];
          h.setAttribute('display', hideHouses ? 'none' : '');
          if (hideHouses) continue;
          var a = HOUSES[i], o = houseOff[i];
          var u = sstep(0.08 + houseDelay[i], 0.4 + houseDelay[i], t), uc = 1 - (1 - u) * (1 - u);
          var s = lerp(1, VILLAGE_SCALE, uc), ss = lerp(1, HOUSE_SCALE, u);
          var w = a[2] * ss, hh = a[3] * ss;   // the layout contracts a little faster than the houses shrink, so they close ranks
          var x = lerp(ax0, ax1, u) + o[0] * s - w / 2, y = lerp(ay0, ay1, u) + o[1] * s - hh / 2;
          i2 = 4 * i; HN[i2] = x; HN[i2 + 1] = y; HN[i2 + 2] = w; HN[i2 + 3] = hh;
          h.setAttribute('x', x.toFixed(1)); h.setAttribute('y', y.toFixed(1));
          h.setAttribute('width', w.toFixed(1)); h.setAttribute('height', hh.toFixed(1));
          h.setAttribute('fill', houseCol);
        }
        var fsd = sstep(0.05, 0.3, t), hideSides = hideHouses || fsd >= 1;
        sideFaces.setAttribute('display', hideSides ? 'none' : '');
        if (!hideSides) {
          var sd = '';
          for (i = 0; i < houses.length; i++) {
            i2 = 4 * i;
            var fw = HN[i2 + 2] * 0.27;   // the shadow face is the right side of every house (light from the sun at the left)
            sd += 'M' + (HN[i2] + HN[i2 + 2] - fw).toFixed(1) + ' ' + HN[i2 + 1].toFixed(1) + 'h' + fw.toFixed(1) + 'v' + HN[i2 + 3].toFixed(1) + 'h' + (-fw).toFixed(1) + 'Z';
          }
          sideFaces.setAttribute('d', sd);
          sideFaces.setAttribute('fill', mix(STEEL, houseCol, fsd));
        }
        for (i = 0; i < domes.length; i++) {
          var dm = domes[i];
          dm.setAttribute('display', hideHouses ? 'none' : '');
          if (hideHouses) continue;
          i2 = 4 * DOMES[i][0];
          var dcx = HN[i2] + HN[i2 + 2] / 2, dby = HN[i2 + 1], r = HN[i2 + 2] * DOMES[i][1];
          dm.setAttribute('d', 'M' + (dcx - r).toFixed(1) + ' ' + dby.toFixed(1) + 'A' + r.toFixed(1) + ' ' + r.toFixed(1) + ' 0 0 1 ' + (dcx + r).toFixed(1) + ' ' + dby.toFixed(1) + 'Z');
          dm.setAttribute('fill', domeCol);
        }
        var fwn = sstep(0.02, 0.25, t), hideWin = hideHouses || fwn >= 1;
        for (i = 0; i < windows.length; i++) {
          windows[i].setAttribute('display', hideWin ? 'none' : '');
          if (hideWin) continue;
          var wn = WINDOWS[i], hs = HOUSES[wn[0]]; i2 = 4 * wn[0];
          var scl = HN[i2 + 2] / hs[2];
          windows[i].setAttribute('x', (HN[i2] + wn[1] * scl).toFixed(1));
          windows[i].setAttribute('y', (HN[i2 + 1] + HN[i2 + 3] - (wn[2] + wn[4]) * scl).toFixed(1));
          windows[i].setAttribute('width', (wn[3] * scl).toFixed(1)); windows[i].setAttribute('height', (wn[4] * scl).toFixed(1));
          windows[i].setAttribute('opacity', (1 - fwn).toFixed(3));
        }
      }

      return {
        set: set,
        destroy: function () { if (svg.parentNode) svg.parentNode.removeChild(svg); }
      };
    }
  };
})();
