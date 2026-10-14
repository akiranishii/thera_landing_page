/* thera. logo animation, v2: track "santorini-crescent", approach "emblem-aerial".
 *
 * t = 0  Santorini from above, drawn as a map emblem inside the logo's disc (centre 320,320, r 280), in the
 *        Blue Haze palette only. Outer sea #EAF0F4 with faint #DDE6EC graticule and border ring, a page-colour
 *        shelf around the coasts and a few #C4D5E0 wave marks; the crescent of Thera in ink #223848 (projected
 *        from real coordinates: thin north arm, broad south-east, thin Akrotiri arm) with a #C4D5E0 surf line
 *        along the caldera cliffs and white town specks (Oia, Imerovigli, Firostefani, Fira, Akrotiri);
 *        Therasia as a #466680 crescent on the west with its own caldera surf and Manolas on its cliff;
 *        Aspronisi in the south-west strait; the caldera sea #8DA8BB with wave marks; Nea Kameni white (the
 *        future island dot) and Palea Kameni #466680 in the middle, ringed with surf.
 * t = 1  The "Caldera and Sunken Head" mark, exact LOGO_PATHS strings and hex fills: sunken head #8DA8BB, cliffs
 *        crescent #223848 with the island dot knocked out (evenodd, page #F7F9FA shows through).
 *
 * Morph plan (every detail has a destination in the mark)
 *   Thera        -> cliffs crescent. One closed ring, anchor-matched point for point to the logo crescent (Oia
 *                   tip -> crown, airport bulge -> east rim, Exomitis -> south-east rim, Akrotiri tip -> neck, Fira
 *                   -> nose tip). The outer coast and the tips travel in polar form around the disc centre (the
 *                   Akrotiri arm sweeps round toward the neck instead of cutting across the caldera; coastline
 *                   bumps flatten faster than the coast expands) on the rim clock (done 0.88). The caldera cliffs
 *                   travel straight onto the profile on the slow clock (locks at 1.0).
 *   caldera sea  -> sunken head. Its ring is [Thera's outer coast, shared point for point] + [the caldera rim
 *                   line Akrotiri -> Aspronisi -> under Therasia -> Oia]; Thera is painted on top, so the visible
 *                   sea / cliff boundary is always the live coast. The rim line opens out onto the left rim.
 *   Therasia     -> folds into the rim. Each of its points rides the rim line (nearest sample + normal and
 *                   tangent offsets); the offsets shrink to zero, so it slides out with the line, its outer half
 *                   passes the rim, its inner half thins onto it and it takes the sea colour. Aspronisi likewise.
 *   Nea Kameni   -> the island dot. Never hidden: drawn above the cliffs, it rounds out and glides on a shallow
 *                   arc to (463,280) r 52 (t 0.18-0.78). Palea Kameni slides under it and shrinks.
 *   towns        -> gather into the islet as it crosses the cliffs (white specks converging, gone inside it).
 *   surf, shelf  -> thin into the edges they line (cliff surf -> profile, islet surf -> dot edge, shelf -> rim).
 *   waves        -> flatten into their sea; graticule slides out past the rim; border ring widens into it.
 *   The map turns 14 degrees anticlockwise as it settles (display rotation easing to 0 by t = 0.85).
 * Colours are the logo's from t = 0 (ink cliffs, sea-blue caldera); only Therasia (#466680 -> #8DA8BB) and the
 * islet (#FFFFFF -> #F7F9FA) shift, by OKLab mixing with exact end values. The disc is trimmed by a page-colour
 * evenodd frame rather than a clipPath, which Chrome composites non-deterministically.
 */
(function () {
  'use strict';
  var NS = 'http://www.w3.org/2000/svg';
  var WHITE = '#FFFFFF', BG = '#F7F9FA', SURFACE = '#EAF0F4', LINE = '#DDE6EC', LIGHT = '#C4D5E0',
      SEA = '#8DA8BB', PRIMARY = '#466680', INK = '#223848';
  var CX = 320, CY = 320, R = 280;
  var SPACING = 3;              // viewBox units between outline samples
  var PSI0 = 14;                // display rotation at t = 0 (degrees, clockwise); eases to 0

  // Exact end-state paths (LOGO_PATHS.md)
  var HEAD_D = 'M 353.2 598 A 280 280 0 0 1 263.1 45.9 A 40 40 0 0 0 235.5 103 A 251 251 0 0 1 258 170 L 342.6 314.1 A 20 20 0 0 1 336.8 340.6 L 299 367 L 303 415 A 85 85 0 0 1 314 531.3 L 309.7 548.6 A 40 40 0 0 0 353.2 598 Z';
  var CLIFF_D = 'M 263.1 45.9 A 280 280 0 1 1 353.2 598 A 40 40 0 0 1 309.7 548.6 L 314 531.3 A 85 85 0 0 0 303 415 L 299 367 L 336.8 340.6 A 20 20 0 0 0 342.6 314.1 L 258 170 A 251 251 0 0 0 235.5 103 A 40 40 0 0 1 263.1 45.9 Z';
  var DOT_D = 'M 411 280 A 52 52 0 1 1 515 280 A 52 52 0 1 1 411 280 Z';
  var DOT_C = [463, 280], DOT_R = 52;
  // logo anchors on CLIFF_D (crown is its start point)
  var LOGO_ANCH = { east: [600, 320], se: [517.99, 517.99], neck: [353.2, 598], nose: [342.6, 314.1] };

  /* ------------------------------------------------------------------ small maths */
  function clamp01(x) { return x < 0 ? 0 : x > 1 ? 1 : x; }
  function sstep(a, b, t) { var x = clamp01((t - a) / (b - a)); return x * x * (3 - 2 * x); }
  function lerp(a, b, t) { return a + (b - a) * t; }
  function f1(x) { return (Math.round(x * 10) / 10).toString(); }
  function f3(x) { return (Math.round(x * 1000) / 1000).toString(); }
  function rot(p, deg) {   // same sense as SVG rotate(): positive is clockwise on screen
    var a = deg * Math.PI / 180, c = Math.cos(a), s = Math.sin(a), dx = p[0] - CX, dy = p[1] - CY;
    return [CX + dx * c - dy * s, CY + dx * s + dy * c];
  }

  /* ------------------------------------------------------------------ colour (OKLab, exact ends) */
  function lin(c) { c /= 255; return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); }
  function gam(c) { c = c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055; return Math.max(0, Math.min(255, Math.round(c * 255))); }
  var labCache = {};
  function toLab(hex) {
    if (labCache[hex]) return labCache[hex];
    var r = lin(parseInt(hex.slice(1, 3), 16)), g = lin(parseInt(hex.slice(3, 5), 16)), b = lin(parseInt(hex.slice(5, 7), 16));
    var l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
    var m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
    var s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
    return (labCache[hex] = [0.2104542553 * l + 0.7936177850 * m - 0.0040720468 * s,
      1.9779984951 * l - 2.4285922050 * m + 0.4505937099 * s, 0.0259040371 * l + 0.7827717662 * m - 0.8086757660 * s]);
  }
  function hex2(v) { return (v < 16 ? '0' : '') + v.toString(16); }
  function mix(a, b, t) {
    if (t <= 0) return a; if (t >= 1) return b;
    var A = toLab(a), B = toLab(b), L = lerp(A[0], B[0], t), x = lerp(A[1], B[1], t), y = lerp(A[2], B[2], t);
    var l = L + 0.3963377774 * x + 0.2158037573 * y, m = L - 0.1055613458 * x - 0.0638541728 * y, s = L - 0.0894841775 * x - 1.2914855480 * y;
    l = l * l * l; m = m * m * m; s = s * s * s;
    return '#' + hex2(gam(4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s)) +
      hex2(gam(-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s)) +
      hex2(gam(-0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s));
  }

  /* ------------------------------------------------------------------ curves */
  function crPoint(p0, p1, p2, p3, u) {
    var u2 = u * u, u3 = u2 * u;
    return [
      0.5 * (2 * p1[0] + (-p0[0] + p2[0]) * u + (2 * p0[0] - 5 * p1[0] + 4 * p2[0] - p3[0]) * u2 + (-p0[0] + 3 * p1[0] - 3 * p2[0] + p3[0]) * u3),
      0.5 * (2 * p1[1] + (-p0[1] + p2[1]) * u + (2 * p0[1] - 5 * p1[1] + 4 * p2[1] - p3[1]) * u2 + (-p0[1] + 3 * p1[1] - 3 * p2[1] + p3[1]) * u3)];
  }
  // closed Catmull-Rom through ctrl; output index i*per is exactly ctrl[i]
  function splineClosed(ctrl, per) {
    var n = ctrl.length, out = [];
    for (var i = 0; i < n; i++) for (var j = 0; j < per; j++) out.push(crPoint(ctrl[(i - 1 + n) % n], ctrl[i], ctrl[(i + 1) % n], ctrl[(i + 2) % n], j / per));
    return out;
  }
  // open Catmull-Rom from ctrl[0] to ctrl[n-1] (end points mirrored)
  function splineOpen(ctrl, per) {
    var n = ctrl.length, out = [];
    function P(i) {
      if (i < 0) return [2 * ctrl[0][0] - ctrl[1][0], 2 * ctrl[0][1] - ctrl[1][1]];
      if (i > n - 1) return [2 * ctrl[n - 1][0] - ctrl[n - 2][0], 2 * ctrl[n - 1][1] - ctrl[n - 2][1]];
      return ctrl[i];
    }
    for (var i = 0; i < n - 1; i++) for (var j = 0; j < per; j++) out.push(crPoint(P(i - 1), P(i), P(i + 1), P(i + 2), j / per));
    out.push(ctrl[n - 1].slice());
    return out;
  }
  function cumLen(pts, closed) {
    var c = [0], n = pts.length, m = closed ? n : n - 1;
    for (var i = 1; i <= m; i++) { var a = pts[i - 1], b = pts[i % n]; c.push(c[i - 1] + Math.hypot(b[0] - a[0], b[1] - a[1])); }
    return c;
  }
  function polyAt(pts, cum) {
    var n = pts.length;
    return function (L) {
      var lo = 0, hi = cum.length - 1;
      if (L <= 0) return pts[0].slice();
      if (L >= cum[hi]) return pts[hi % n].slice();
      while (lo < hi - 1) { var mid = (lo + hi) >> 1; if (cum[mid] <= L) lo = mid; else hi = mid; }
      var a = pts[lo], b = pts[(lo + 1) % n], sg = cum[lo + 1] - cum[lo], u = sg > 0 ? (L - cum[lo]) / sg : 0;
      return [a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u];
    };
  }
  // anchors land on the same indices in every ring built with the same counts
  function resample(at, anchorsL, counts) {
    var out = [];
    for (var k = 0; k < counts.length; k++) for (var j = 0; j < counts[k]; j++) out.push(at(anchorsL[k] + (anchorsL[k + 1] - anchorsL[k]) * j / counts[k]));
    return out;
  }
  function ctrlRing(ctrl, per, n) {
    var pts = splineClosed(ctrl, per), cum = cumLen(pts, true), at = polyAt(pts, cum), out = [];
    for (var i = 0; i < n; i++) out.push(at(cum[cum.length - 1] * i / n));
    return out;
  }
  function centroid(pts) { var c = [0, 0]; for (var i = 0; i < pts.length; i++) { c[0] += pts[i][0] / pts.length; c[1] += pts[i][1] / pts.length; } return c; }
  // ring of n points starting at angle 0 (east) around c, by arc length (star-shaped rings only)
  function ringFromEast(pts, c, n) {
    var best = 0, bd = Infinity;
    for (var i = 0; i < pts.length; i++) {
      var a = Math.atan2(pts[i][1] - c[1], pts[i][0] - c[0]);
      if (Math.abs(a) < bd && pts[i][0] > c[0]) { bd = Math.abs(a); best = i; }
    }
    var rolled = pts.slice(best).concat(pts.slice(0, best)), cum = cumLen(rolled, true), at = polyAt(rolled, cum), out = [];
    for (i = 0; i < n; i++) out.push(at(cum[cum.length - 1] * i / n));
    return out;
  }

  /* ------------------------------------------------------------------ the map (north up, before rotation) */
  // Projected from real coordinates (about 30 px per km, north up), then smoothed into clean curves.
  // Thera, clockwise from the Oia tip: the thin north arm, the east coast with the airport bulge, Exomitis, the
  // thin south arm to the Akrotiri tip, then back north along the caldera cliffs (Athinios, Fira, Imerovigli).
  var THERA = [
    [224, 119, 'crown'], [233, 106], [252, 98], [290, 93], [328, 103], [362, 124], [392, 157], [415, 199],
    [435, 246], [458, 290], [489, 322], [512, 355], [522, 390, 'east'], [524, 430], [516, 468], [494, 500], [450, 524, 'se'],
    [396, 526], [338, 514], [290, 500], [242, 488], [204, 478], [184, 467, 'neck'],
    [196, 455], [226, 450], [270, 446], [318, 438], [354, 422], [377, 396], [388, 356], [392, 306, 'nose'],
    [389, 262], [376, 222], [346, 180], [300, 148], [258, 129], [238, 124]
  ];
  // the caldera's west edge, Akrotiri tip -> under Aspronisi and Therasia -> Oia tip (end points = Thera's tips)
  var WEST = [[184, 467], [178, 436], [171, 404], [161, 374], [151, 345], [141, 300], [136, 255], [138, 210], [148, 172], [168, 142], [196, 125], [224, 119]];
  var THERASIA = [[195, 124], [172, 127], [146, 145], [125, 182], [112, 232], [112, 284], [124, 326], [144, 354],
    [158, 358], [162, 340], [160, 306], [156, 268], [157, 230], [163, 194], [178, 160], [199, 136]];
  var ASPRO = [171, 404, 8];
  var NEA = [[299, 289], [314, 296], [319, 311], [310, 325], [294, 330], [281, 321], [281, 304]];
  var PALEA = [[244, 327], [253, 331], [253, 340], [245, 345], [237, 342], [236, 333]];
  // town specks [x, y, r] (north up); they ride the coast they stand on, then gather into the island dot
  var TOWNS = [
    [246, 113, 5.2], [260, 108, 4.4], [272, 116, 3.6], [285, 109, 3.2],     // Oia
    [369, 198, 5.0], [382, 213, 4.0],                                       // Imerovigli
    [397, 246, 3.8],                                                         // Firostefani
    [403, 273, 6.0], [405, 292, 5.0], [418, 282, 3.8], [402, 310, 4.2],     // Fira
    [254, 466, 4.2]                                                          // Akrotiri
  ];
  var MANOLAS = [146, 236, 3.4];                                             // on Therasia's cliff top
  // wave marks [x, y, width] (north up): in the caldera (#C4D5E0) and in the open sea (#DDE6EC)
  var WAVES_IN = [[236, 196, 30], [330, 222, 24], [282, 400, 28], [196, 262, 22]];
  var WAVES_OUT = [[122, 424, 28], [204, 536, 26], [478, 140, 24], [552, 262, 22], [430, 572, 22]];
  var GRAT_LAT = [196, 444], GRAT_LON = [196, 444];

  function el(tag, attrs, parent) {
    var e = document.createElementNS(NS, tag);
    for (var k in attrs) e.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(e);
    return e;
  }

  function mount(container) {
        var svg = el('svg', { viewBox: '0 0 640 640', xmlns: NS, role: 'img', 'aria-label': 'Santorini from above becoming the thera. mark' });
    container.appendChild(svg);
    function base(p) { return rot(p, -PSI0); }   // the morph frame: the map pre-turned against the display rotation

    /* ---- hero ring: Thera <-> logo crescent, anchor-matched ---- */
    var PER = 24, ctrl = THERA.map(base), fine = splineClosed(ctrl, PER), fineCum = cumLen(fine, true);
    var tagL = {}, tagI = {}; THERA.forEach(function (p, i) { if (p[2]) { tagL[p[2]] = fineCum[i * PER]; tagI[p[2]] = i; } });
    var probe = el('path', { d: CLIFF_D, fill: 'none' }, svg);
    var total = probe.getTotalLength();
    function nearestL(pt) {
      var best = 0, bd = Infinity;
      for (var L = 0; L <= total; L += 0.5) { var q = probe.getPointAtLength(L), d = Math.hypot(q.x - pt[0], q.y - pt[1]); if (d < bd) { bd = d; best = L; } }
      return best;
    }
    var order = ['east', 'se', 'neck', 'nose'];
    var mapA = [0], logoA = [0];
    order.forEach(function (k) { mapA.push(tagL[k]); logoA.push(nearestL(LOGO_ANCH[k])); });
    mapA.push(fineCum[fineCum.length - 1]); logoA.push(total);
    var counts = [], anchorIdx = [0];
    for (var k = 0; k < mapA.length - 1; k++) {
      counts.push(Math.ceil(Math.max(mapA[k + 1] - mapA[k], logoA[k + 1] - logoA[k]) / SPACING));
      anchorIdx.push(anchorIdx[k] + counts[k]);
    }
    var B0 = resample(polyAt(fine, fineCum), mapA, counts);
    var B1 = resample(function (L) { var q = probe.getPointAtLength(Math.min(L, total)); return [q.x, q.y]; }, logoA, counts);
    var N = B0.length, neckIdx = anchorIdx[3];
    // weight of the rim clock: 1 on the outer coast and both tips, easing to 0 along the caldera cliffs
    var KTIP = 70, wRim = new Float64Array(N);
    for (var i = 0; i < N; i++) {
      if (i <= neckIdx) wRim[i] = 1;
      else { var dd = Math.min(i - neckIdx, N - i) / KTIP; wRim[i] = dd >= 1 ? 0 : 1 - dd * dd * (3 - 2 * dd); }
    }
    var CUR = new Float64Array(2 * N);
    // normals of a polyline (closed or open), pointing out of a clockwise ring
    function ringNormals(P, n, closed) {
      var out = new Float64Array(2 * n);
      for (var i = 0; i < n; i++) {
        var a = closed ? (i - 1 + n) % n : Math.max(0, i - 1), b = closed ? (i + 1) % n : Math.min(n - 1, i + 1);
        var dx = P[2 * b] - P[2 * a], dy = P[2 * b + 1] - P[2 * a + 1], l = Math.hypot(dx, dy) || 1;
        out[2 * i] = dy / l; out[2 * i + 1] = -dx / l;
      }
      return out;
    }
    var B0f = new Float64Array(2 * N); for (i = 0; i < N; i++) { B0f[2 * i] = B0[i][0]; B0f[2 * i + 1] = B0[i][1]; }
    // polar form of both ends around the disc centre: the outer coast and the tips travel on arcs (the
    // Akrotiri arm sweeps round the rim instead of cutting across the caldera); the cliffs travel straight
    function polar(P0, P1, n) {
      var o = { r0: new Float64Array(n), a0: new Float64Array(n), r1: new Float64Array(n), da: new Float64Array(n), rm: 0 };
      for (var i = 0; i < n; i++) {
        var x0 = P0[2 * i] - CX, y0 = P0[2 * i + 1] - CY, x1 = P1[2 * i] - CX, y1 = P1[2 * i + 1] - CY;
        o.r0[i] = Math.hypot(x0, y0); o.r1[i] = Math.hypot(x1, y1); o.a0[i] = Math.atan2(y0, x0);
        var d = Math.atan2(y1, x1) - o.a0[i]; while (d > Math.PI) d -= 2 * Math.PI; while (d < -Math.PI) d += 2 * Math.PI;
        o.da[i] = d;
      }
      var sorted = Array.prototype.slice.call(o.r0).sort(function (a, b) { return a - b; });
      o.rm = sorted[n >> 1];   // median start radius: bumps around it flatten faster than the coast expands
      return o;
    }
    function polarR(o, i, s) { var u = 1 - s; return o.rm + (o.r1[i] - o.rm) * s + (o.r0[i] - o.rm) * u * u; }
    var B1f = new Float64Array(2 * N); for (i = 0; i < N; i++) { B1f[2 * i] = B1[i][0]; B1f[2 * i + 1] = B1[i][1]; }
    var BP = polar(B0f, B1f, N);

    /* ---- the caldera's west edge <-> the left rim ---- */
    var westCtrl = WEST.map(base);
    westCtrl[0] = ctrl[tagI.neck].slice(); westCtrl[westCtrl.length - 1] = ctrl[0].slice();
    var westFine = splineOpen(westCtrl, 20), westCum = cumLen(westFine, false), westLen = westCum[westCum.length - 1];
    var NECK_A = Math.atan2(598 - CY, 353.2 - CX), CROWN_A = Math.atan2(45.9 - CY, 263.1 - CX) + 2 * Math.PI;
    var NW = Math.ceil(Math.max(westLen, R * (CROWN_A - NECK_A)) / SPACING) + 1;
    var W0 = new Float64Array(2 * NW), W1 = new Float64Array(2 * NW), WL = new Float64Array(2 * NW);
    var westAt = polyAt(westFine, westCum);
    for (i = 0; i < NW; i++) {
      var q = westAt(westLen * i / (NW - 1)), a = NECK_A + (CROWN_A - NECK_A) * i / (NW - 1);
      W0[2 * i] = q[0]; W0[2 * i + 1] = q[1];
      W1[2 * i] = CX + R * Math.cos(a); W1[2 * i + 1] = CY + R * Math.sin(a);
    }
    var W0n = ringNormals(W0, NW, false);   // points west (out of the caldera) along the arc
    var WP = polar(W0, W1, NW);
    // attach a point to the west arc: [sample index, normal offset, tangent offset]
    function attachWest(p) {
      var best = 0, bd = Infinity;
      for (var i = 0; i < NW; i++) { var dx = W0[2 * i] - p[0], dy = W0[2 * i + 1] - p[1], d2 = dx * dx + dy * dy; if (d2 < bd) { bd = d2; best = i; } }
      var nx = W0n[2 * best], ny = W0n[2 * best + 1], vx = p[0] - W0[2 * best], vy = p[1] - W0[2 * best + 1];
      return [best, vx * nx + vy * ny, vx * ny - vy * nx];   // tangent axis = (ny, -nx)
    }

    /* ---- Therasia, Aspronisi ---- */
    var NT = 140, theraR = ctrlRing(THERASIA.map(base), 16, NT);
    var theraAtt = theraR.map(attachWest);
    var asproAtt = attachWest(base(ASPRO)), manolasAtt = attachWest(base(MANOLAS));
    // Therasia's caldera-facing coast (the samples east of the arc), as one run of ring indices
    var tRun = [], startI = 0;
    for (i = 0; i < NT; i++) if (theraAtt[i][1] >= 0 && theraAtt[(i + 1) % NT][1] < 0) startI = (i + 1) % NT;
    for (i = 0; i < NT; i++) { var ti = (startI + i) % NT; if (theraAtt[ti][1] < 0) tRun.push(ti); else break; }
    var TL = new Float64Array(2 * NT);
    var T0f = new Float64Array(2 * NT); for (i = 0; i < NT; i++) { T0f[2 * i] = theraR[i][0]; T0f[2 * i + 1] = theraR[i][1]; }
    // which side of the run is the caldera: opposite the arc's (westward) normal
    var tMid = tRun[tRun.length >> 1], tA = tRun[(tRun.length >> 1) - 1], tB = tRun[(tRun.length >> 1) + 1];
    var tSide = ((T0f[2 * tB + 1] - T0f[2 * tA + 1]) * W0n[2 * theraAtt[tMid][0]] - (T0f[2 * tB] - T0f[2 * tA]) * W0n[2 * theraAtt[tMid][0] + 1]) > 0 ? -1 : 1;

    /* ---- Nea Kameni -> dot, Palea Kameni ---- */
    var M = 120, neaRaw = ctrlRing(NEA.map(base), 16, 240), neaC = centroid(neaRaw);
    var nea0 = ringFromEast(neaRaw, neaC, M), dot1 = [];
    for (i = 0; i < M; i++) { var an = 2 * Math.PI * i / M; dot1.push([DOT_R * Math.cos(an), DOT_R * Math.sin(an)]); }
    var paleaR = ctrlRing(PALEA.map(base), 16, 64), paleaC = centroid(paleaR);

    /* ---- towns: frames relative to the Thera ring ---- */
    function attachRing(p) {
      var best = 0, bd = Infinity;
      for (var i = 0; i < N; i++) { var dx = B0f[2 * i] - p[0], dy = B0f[2 * i + 1] - p[1], d2 = dx * dx + dy * dy; if (d2 < bd) { bd = d2; best = i; } }
      return [best, p[0] - B0f[2 * best], p[1] - B0f[2 * best + 1]];
    }
    var towns = TOWNS.map(function (tw, j) { var p = base(tw); return { att: attachRing(p), r: tw[2], delay: 0 }; });
    // stagger: specks nearest the islet's path leave last (Fira), the far ones (Oia, Akrotiri) first
    towns.forEach(function (tw, j) { tw.delay = j < 4 ? 0 : j < 7 ? 0.04 : j < 11 ? 0.1 : 0.02; });

    svg.removeChild(probe);

    /* ---- DOM, back to front ---- */
    var bgRect = el('rect', { x: 0, y: 0, width: 640, height: 640, fill: BG }, svg);
    var discG = el('g', {}, svg);
    var outerSea = el('circle', { cx: CX, cy: CY, r: R + 2, fill: SURFACE }, discG);
    var border = el('circle', { cx: CX, cy: CY, fill: 'none', stroke: LINE }, discG);
    var mapG = el('g', {}, discG);
    var gratG = el('g', { transform: 'rotate(' + (-PSI0) + ' ' + CX + ' ' + CY + ')' }, mapG);
    var grat = el('path', { fill: 'none', stroke: LINE, 'stroke-width': 2 }, gratG);
    var halo = el('path', { fill: 'none', stroke: BG, 'stroke-linejoin': 'round' }, mapG);
    var caldera = el('path', { fill: SEA }, mapG);
    var wavesOut = el('path', { fill: 'none', stroke: LIGHT, 'stroke-width': 3.5, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, mapG);
    var wavesIn = el('path', { fill: 'none', stroke: LIGHT, 'stroke-width': 3.5, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, mapG);
    var therasia = el('path', {}, mapG);
    var aspro = el('circle', {}, mapG);
    var surf = el('path', { fill: LIGHT }, mapG);
    var thera = el('path', { fill: INK }, mapG);
    var isleSurf = el('path', { fill: 'none', stroke: LIGHT, 'stroke-linejoin': 'round' }, mapG);
    var palea = el('path', {}, mapG);
    var townEls = towns.map(function () { return el('circle', { fill: WHITE }, mapG); });
    var manolas = el('circle', { fill: WHITE }, mapG);
    var islet = el('path', {}, mapG);
    // page colour outside the disc trims everything flush to the rim (a clipPath composites non-deterministically)
    var frame = el('path', { fill: BG, 'fill-rule': 'evenodd', d: 'M0 0H640V640H0Z M' + (CX - R) + ' ' + CY + ' A' + R + ' ' + R + ' 0 1 0 ' + (CX + R) + ' ' + CY + ' A' + R + ' ' + R + ' 0 1 0 ' + (CX - R) + ' ' + CY + ' Z' }, discG);

    var WN = new Float64Array(2 * NW);   // live west-arc normals
    function liveWest(att, sh, out) {
      var k = att[0], nx = WN[2 * k], ny = WN[2 * k + 1];
      out[0] = WL[2 * k] + (nx * att[1] + ny * att[2]) * sh;
      out[1] = WL[2 * k + 1] + (ny * att[1] - nx * att[2]) * sh;
    }
    var TMP = [0, 0];
    var wIn = WAVES_IN.map(function (w) { return base(w).concat([w[2]]); }), wOut = WAVES_OUT.map(function (w) { return base(w).concat([w[2]]); });
    // a tilde: two quadratic arcs, flattened and narrowed by k (1 = full mark, 0 = nothing), shifted by (dx, dy)
    function waves(list, k, dx, dy) {
      var d = '';
      for (var j = 0; j < list.length; j++) {
        var w = list[j][2] * k, a = 3 * k, x = list[j][0] + dx - w / 2, y = list[j][1] + dy;
        d += 'M' + f1(x) + ' ' + f1(y) + 'q' + f1(w / 4) + ' ' + f1(-2 * a) + ' ' + f1(w / 2) + ' 0t' + f1(w / 2) + ' 0';
      }
      return d;
    }
    var CRUN = []; for (i = neckIdx + 10; i <= N - 8; i++) CRUN.push(i);
    // a tapered band on one side of a live polyline (P, run of indices): the surf lines. It starts 2 px inside
    // the land so it tucks under the coast it lines.
    function band(P, run, w, side) {
      var n = run.length, fw = '', bk = '';
      for (var j = 0; j < n; j++) {
        var a = run[Math.max(0, j - 1)], b = run[Math.min(n - 1, j + 1)], k = run[j];
        var ex = P[2 * b] - P[2 * a], ey = P[2 * b + 1] - P[2 * a + 1], l = Math.hypot(ex, ey) || 1;
        var nx = side * ey / l, ny = -side * ex / l;
        var f = j / (n - 1), tp = Math.min(1, f / 0.1, (1 - f) / 0.1), ww = w * Math.sqrt(Math.max(0, tp));
        fw += (j ? 'L' : 'M') + f1(P[2 * k] - nx * 2) + ' ' + f1(P[2 * k + 1] - ny * 2);
        bk = 'L' + f1(P[2 * k] + nx * ww) + ' ' + f1(P[2 * k + 1] + ny * ww) + bk;
      }
      return fw + bk + 'Z';
    }

    function set(t) {
      t = clamp01(t);
      var i, s, str;
      var exact = t >= 1;

      /* clocks */
      var psi = PSI0 * (1 - sstep(0, 0.85, t));            // the map settles into place
      var sRim = sstep(0.02, 0.88, t);                      // outer coast and rim line -> the disc rim
      var sProf = 0.25 * t + 0.75 * sstep(0.05, 1, t);      // caldera cliffs -> the profile (locks at 1)

      if (exact) {
        frame.setAttribute('display', 'none');
        mapG.setAttribute('transform', 'rotate(0 ' + CX + ' ' + CY + ')');
        outerSea.setAttribute('display', 'none');
        border.setAttribute('display', 'none');
        [gratG, halo, wavesIn, wavesOut, therasia, aspro, surf, isleSurf, palea, manolas, islet].forEach(function (e) { e.setAttribute('display', 'none'); });
        townEls.forEach(function (e) { e.setAttribute('display', 'none'); });
        caldera.setAttribute('d', HEAD_D); caldera.setAttribute('fill', SEA);
        thera.setAttribute('d', CLIFF_D + ' ' + DOT_D); thera.setAttribute('fill-rule', 'evenodd'); thera.setAttribute('fill', INK);
        return;
      }
      frame.setAttribute('display', '');
      mapG.setAttribute('transform', 'rotate(' + f3(psi) + ' ' + CX + ' ' + CY + ')');
      outerSea.setAttribute('display', '');
      thera.setAttribute('fill-rule', 'nonzero');

      /* Thera ring */
      for (i = 0; i < N; i++) {
        var wr = wRim[i];
        s = sProf + (sRim - sProf) * wr;
        var lx = B0f[2 * i] + (B1f[2 * i] - B0f[2 * i]) * s, ly = B0f[2 * i + 1] + (B1f[2 * i + 1] - B0f[2 * i + 1]) * s;
        if (wr > 0) {
          var pr = polarR(BP, i, s), pa = BP.a0[i] + BP.da[i] * s;
          lx += (CX + pr * Math.cos(pa) - lx) * wr; ly += (CY + pr * Math.sin(pa) - ly) * wr;
        }
        CUR[2 * i] = lx; CUR[2 * i + 1] = ly;
      }
      str = 'M' + f1(CUR[0]) + ' ' + f1(CUR[1]);
      for (i = 1; i < N; i++) str += 'L' + f1(CUR[2 * i]) + ' ' + f1(CUR[2 * i + 1]);
      var theraD = str + 'Z';
      thera.setAttribute('d', theraD);

      /* west arc (live), its normals */
      for (i = 0; i < NW; i++) {
        var wr2 = polarR(WP, i, sRim), wa = WP.a0[i] + WP.da[i] * sRim;
        WL[2 * i] = CX + wr2 * Math.cos(wa); WL[2 * i + 1] = CY + wr2 * Math.sin(wa);
      }
      WL[0] = CUR[2 * neckIdx]; WL[1] = CUR[2 * neckIdx + 1];
      WL[2 * (NW - 1)] = CUR[0]; WL[2 * (NW - 1) + 1] = CUR[1];
      for (i = 0; i < NW; i++) {
        var ia = Math.max(0, i - 1), ib = Math.min(NW - 1, i + 1);
        var dx = WL[2 * ib] - WL[2 * ia], dy = WL[2 * ib + 1] - WL[2 * ia + 1], l = Math.hypot(dx, dy) || 1;
        WN[2 * i] = dy / l; WN[2 * i + 1] = -dx / l;
      }

      /* caldera sea: Akrotiri tip -> west arc -> Oia tip -> Thera's outer coast -> back */
      str = 'M' + f1(CUR[2 * neckIdx]) + ' ' + f1(CUR[2 * neckIdx + 1]);
      for (i = 1; i < NW - 1; i++) str += 'L' + f1(WL[2 * i]) + ' ' + f1(WL[2 * i + 1]);
      for (i = 0; i < neckIdx; i++) str += 'L' + f1(CUR[2 * i]) + ' ' + f1(CUR[2 * i + 1]);
      caldera.setAttribute('d', str + 'Z');

      /* Therasia rides the west arc and folds into the rim */
      var shT = 1 - sstep(0.15, 0.82, t), therasiaD = '';
      if (shT > 0.002) {
        for (i = 0; i < NT; i++) {
          liveWest(theraAtt[i], shT, TMP); TL[2 * i] = TMP[0]; TL[2 * i + 1] = TMP[1];
          therasiaD += (i ? 'L' : 'M') + f1(TMP[0]) + ' ' + f1(TMP[1]);
        }
        therasiaD += 'Z';
        therasia.setAttribute('d', therasiaD); therasia.setAttribute('display', '');
        therasia.setAttribute('fill', mix(PRIMARY, SEA, sstep(0.3, 0.8, t)));
      } else therasia.setAttribute('display', 'none');
      var shA = 1 - sstep(0.06, 0.4, t);
      if (shA > 0.002) {
        liveWest(asproAtt, shT, TMP);
        aspro.setAttribute('cx', f1(TMP[0])); aspro.setAttribute('cy', f1(TMP[1])); aspro.setAttribute('r', f1(ASPRO[2] * shA));
        aspro.setAttribute('fill', mix(PRIMARY, SEA, sstep(0.1, 0.4, t))); aspro.setAttribute('display', '');
      } else aspro.setAttribute('display', 'none');

      /* outer shelf: a light band outside Thera and Therasia, thinning into the rim */
      var hw = 7 * (1 - sstep(0.05, 0.5, t));
      if (hw > 0.05) {
        halo.setAttribute('d', theraD + (therasiaD ? ' ' + therasiaD : ''));
        halo.setAttribute('stroke-width', f1(2 * hw)); halo.setAttribute('display', '');
      } else halo.setAttribute('display', 'none');

      /* surf along the caldera cliffs (and Therasia's caldera coast): tapered bands on the sea side */
      var sw = 6 * (1 - sstep(0.1, 0.6, t));
      if (sw > 0.05) {
        var sd = band(CUR, CRUN, sw, 1);
        if (therasiaD) sd += ' ' + band(TL, tRun, sw * 0.8 * shT, tSide);
        surf.setAttribute('d', sd); surf.setAttribute('display', '');
      } else surf.setAttribute('display', 'none');

      /* wave marks flatten into their sea: the caldera's sink into the sea colour, the open sea's drift outward */
      var kw = 1 - sstep(0.02, 0.3, t);
      if (kw > 0.01) {
        wavesIn.setAttribute('d', waves(wIn, kw, 0, 0)); wavesIn.setAttribute('stroke', mix(LIGHT, SEA, 1 - kw)); wavesIn.setAttribute('display', '');
        wavesOut.setAttribute('d', waves(wOut, kw, 0, 0)); wavesOut.setAttribute('display', '');
      } else { wavesIn.setAttribute('display', 'none'); wavesOut.setAttribute('display', 'none'); }

      /* Nea Kameni -> the island dot */
      var mv = sstep(0.18, 0.74, t), shp = sstep(0.2, 0.78, t);
      var bowK = 4 * mv * (1 - mv) * 26;                    // a shallow arc, bulging north of the straight line
      var cx = lerp(neaC[0], DOT_C[0], mv), cy = lerp(neaC[1], DOT_C[1], mv) - bowK;
      str = '';
      for (i = 0; i < M; i++) {
        var px = lerp(nea0[i][0] - neaC[0], dot1[i][0], shp) + cx, py = lerp(nea0[i][1] - neaC[1], dot1[i][1], shp) + cy;
        str += (i ? 'L' : 'M') + f1(px) + ' ' + f1(py);
      }
      var neaD = str + 'Z';
      islet.setAttribute('d', neaD); islet.setAttribute('display', '');
      islet.setAttribute('fill', mix(WHITE, BG, sstep(0.55, 0.95, t)));

      /* Palea Kameni slides into Nea Kameni */
      var pk = sstep(0.08, 0.4, t), paleaD = '';
      if (pk < 1) {
        var pcx = lerp(paleaC[0], cx, pk), pcy = lerp(paleaC[1], cy, pk), ps = 1 - 0.75 * pk;
        for (i = 0; i < paleaR.length; i++) paleaD += (i ? 'L' : 'M') + f1(pcx + (paleaR[i][0] - paleaC[0]) * ps) + ' ' + f1(pcy + (paleaR[i][1] - paleaC[1]) * ps);
        paleaD += 'Z';
        palea.setAttribute('d', paleaD); palea.setAttribute('fill', PRIMARY); palea.setAttribute('display', '');
      } else palea.setAttribute('display', 'none');
      var iw = 3.5 * (1 - sstep(0.1, 0.42, t));
      if (iw > 0.05) {
        isleSurf.setAttribute('d', neaD + (paleaD ? ' ' + paleaD : '')); isleSurf.setAttribute('stroke-width', f1(2 * iw)); isleSurf.setAttribute('display', '');
      } else isleSurf.setAttribute('display', 'none');

      /* towns ride their coast, then gather into the islet */
      for (i = 0; i < towns.length; i++) {
        var tw = towns[i], g = sstep(0.14 + tw.delay, 0.5 + tw.delay, t), te = townEls[i];
        if (g >= 1) { te.setAttribute('display', 'none'); continue; }
        var k2 = tw.att[0];
        var hx = CUR[2 * k2] + tw.att[1], hy = CUR[2 * k2 + 1] + tw.att[2];
        var gg = g * g * (3 - 2 * g);
        te.setAttribute('cx', f1(lerp(hx, cx, gg))); te.setAttribute('cy', f1(lerp(hy, cy, gg)));
        te.setAttribute('r', f1(tw.r * (1 - 0.3 * g))); te.setAttribute('display', '');
      }
      var gm = sstep(0.12, 0.52, t);
      if (gm < 1) {
        liveWest(manolasAtt, shT, TMP);
        var ge = gm * gm * (3 - 2 * gm);
        manolas.setAttribute('cx', f1(lerp(TMP[0], cx, ge))); manolas.setAttribute('cy', f1(lerp(TMP[1], cy, ge)));
        manolas.setAttribute('r', f1(MANOLAS[2] * (1 - 0.3 * gm))); manolas.setAttribute('display', '');
      } else manolas.setAttribute('display', 'none');

      /* graticule slides out past the rim; the border ring widens into it */
      var go = sstep(0.0, 0.4, t), gop = 1 - sstep(0.04, 0.36, t);
      if (gop > 0.002) {
        var off = 170 * go, gd = '';
        gd += 'M0 ' + f1(GRAT_LAT[0] - off) + 'H640M0 ' + f1(GRAT_LAT[1] + off) + 'H640';
        gd += 'M' + f1(GRAT_LON[0] - off) + ' 0V640M' + f1(GRAT_LON[1] + off) + ' 0V640';
        grat.setAttribute('d', gd); gratG.setAttribute('opacity', f3(gop)); gratG.setAttribute('display', '');
      } else gratG.setAttribute('display', 'none');
      var bo = sstep(0.0, 0.36, t);
      if (bo < 1) {
        border.setAttribute('r', f1(lerp(265, 284, bo))); border.setAttribute('stroke-width', f1(lerp(2.5, 1, bo)));
        border.setAttribute('display', '');
      } else border.setAttribute('display', 'none');
    }

    return {
      set: set,
      destroy: function () { if (svg.parentNode) svg.parentNode.removeChild(svg); }
    };
  }

  window.TheraAnimations = window.TheraAnimations || {};
  window.TheraAnimations['santorini-crescent'] = {
    title: 'Santorini to the caldera crescent',
    from: 'Santorini from above',
    to: 'Caldera and Sunken Head',
    approach: 'emblem-aerial',
    viewBox: '0 0 640 640',
    mount: mount
  };
})();
