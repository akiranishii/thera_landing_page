/* thera. animation: Santorini from above -> "Caldera and Sunken Head" mark
   track "santorini-crescent", approach "aerial".
   t = 0  : the island from a plane / map tile: Thera's sand crescent with a terracotta cliff band on the caldera
            side, Therasia across the water, Nea and Palea Kameni in the middle, white towns on the rim, sun glitter.
   t = 1  : the two-tone mark. Cliffs crescent #223848, sunken head #8DA8BB, island dot #F7F9FA. Disc c(320,320) r280.
   Hero morph: the coastline ring is point-matched to the logo crescent at seven anchors (crown, east rim, neck,
   chin, lip, nose, brow) and lerped; the outer coast reaches the r280 rim exactly when the sea tile becomes the
   disc, the profile keeps resolving until t = 1. Plain browser script, no deps. */
(function () {
  "use strict";
  var NS = "http://www.w3.org/2000/svg";
  var BG = "#F7F9FA", INK = "#223848", HEAD = "#8DA8BB";
  var CRESCENT_D = "M 263.1 45.9 A 280 280 0 1 1 353.2 598 A 40 40 0 0 1 309.7 548.6 L 314 531.3 A 85 85 0 0 0 303 415 L 299 367 L 336.8 340.6 A 20 20 0 0 0 342.6 314.1 L 258 170 A 251 251 0 0 0 235.5 103 A 40 40 0 0 1 263.1 45.9 Z";
  var DOT_D = "M 411 280 A 52 52 0 1 1 515 280 A 52 52 0 1 1 411 280 Z";
  var HEAD_D = "M 353.2 598 A 280 280 0 0 1 263.1 45.9 A 40 40 0 0 0 235.5 103 A 251 251 0 0 1 258 170 L 342.6 314.1 A 20 20 0 0 1 336.8 340.6 L 299 367 L 303 415 A 85 85 0 0 1 314 531.3 L 309.7 548.6 A 40 40 0 0 0 353.2 598 Z";
  var DISC_D = "M 40 320 A 280 280 0 1 1 600 320 A 280 280 0 1 1 40 320 Z";
  var DOT_C = [463, 280], DOT_R = 52, CX = 320, CY = 320, R = 280;

  /* ---------- small maths ---------- */
  function clamp01(x) { return x < 0 ? 0 : x > 1 ? 1 : x; }
  function lerp(a, b, t) { return a + (b - a) * t; }
  function sstep(a, b, t) { var x = clamp01((t - a) / (b - a)); return x * x * (3 - 2 * x); }
  function f1(x) { return Math.round(x * 10) / 10; }
  function f3(x) { return Math.round(x * 1000) / 1000; }

  /* ---------- colour helper: OKLab mixing between hand-picked stops ---------- */
  function hexRgb(h) { h = h.replace("#", ""); return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)]; }
  function lin(c) { c /= 255; return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); }
  function gam(c) { c = c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055; return Math.max(0, Math.min(255, Math.round(c * 255))); }
  function toLab(hex) {
    var c = hexRgb(hex), r = lin(c[0]), g = lin(c[1]), b = lin(c[2]);
    var l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
    var m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
    var s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
    return [0.2104542553 * l + 0.7936177850 * m - 0.0040720468 * s, 1.9779984951 * l - 2.4285922050 * m + 0.4505937099 * s, 0.0259040371 * l + 0.7827717662 * m - 0.8086757660 * s];
  }
  function fromLab(L, a, b) {
    var l = L + 0.3963377774 * a + 0.2158037573 * b, m = L - 0.1055613458 * a - 0.0638541728 * b, s = L - 0.0894841775 * a - 1.2914855480 * b;
    l = l * l * l; m = m * m * m; s = s * s * s;
    return "rgb(" + gam(4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s) + "," + gam(-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s) + "," + gam(-0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s) + ")";
  }
  // ramp([[pos, hex], ...]) -> function(t) -> css colour. Exact hex at both ends so the logo colours lock.
  function ramp(stops) {
    var labs = stops.map(function (s) { return toLab(s[1]); });
    return function (t) {
      if (t <= 0) return stops[0][1];
      if (t >= 1) return stops[stops.length - 1][1];
      var k = 0; while (k < stops.length - 2 && t > stops[k + 1][0]) k++;
      var u = (t - stops[k][0]) / (stops[k + 1][0] - stops[k][0]), A = labs[k], B = labs[k + 1];
      return fromLab(lerp(A[0], B[0], u), lerp(A[1], B[1], u), lerp(A[2], B[2], u));
    };
  }

  /* ---------- rings (closed polylines) ---------- */
  function spline(ctrl, perSeg) { // closed Catmull-Rom through ctrl; output index i*perSeg == ctrl[i]
    var n = ctrl.length, out = [];
    for (var i = 0; i < n; i++) {
      var p0 = ctrl[(i - 1 + n) % n], p1 = ctrl[i], p2 = ctrl[(i + 1) % n], p3 = ctrl[(i + 2) % n];
      for (var j = 0; j < perSeg; j++) {
        var u = j / perSeg, u2 = u * u, u3 = u2 * u;
        out.push([
          0.5 * (2 * p1[0] + (-p0[0] + p2[0]) * u + (2 * p0[0] - 5 * p1[0] + 4 * p2[0] - p3[0]) * u2 + (-p0[0] + 3 * p1[0] - 3 * p2[0] + p3[0]) * u3),
          0.5 * (2 * p1[1] + (-p0[1] + p2[1]) * u + (2 * p0[1] - 5 * p1[1] + 4 * p2[1] - p3[1]) * u2 + (-p0[1] + 3 * p1[1] - 3 * p2[1] + p3[1]) * u3)]);
      }
    }
    return out;
  }
  function cumLengths(pts) { var c = [0]; for (var i = 1; i <= pts.length; i++) { var a = pts[i - 1], b = pts[i % pts.length]; c.push(c[i - 1] + Math.hypot(b[0] - a[0], b[1] - a[1])); } return c; }
  function polyAt(pts, cum) {
    return function (L) {
      var n = pts.length, lo = 0, hi = n;
      while (lo < hi - 1) { var mid = (lo + hi) >> 1; if (cum[mid] <= L) lo = mid; else hi = mid; }
      var a = pts[lo], b = pts[(lo + 1) % n], seg = cum[lo + 1] - cum[lo], u = seg > 0 ? (L - cum[lo]) / seg : 0;
      return [a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u];
    };
  }
  function resample(at, anchorsL, counts) { // anchors land on the same indices in every ring built with the same counts
    var out = [];
    for (var k = 0; k < counts.length; k++) for (var j = 0; j < counts[k]; j++) out.push(at(anchorsL[k] + (anchorsL[k + 1] - anchorsL[k]) * j / counts[k]));
    return out;
  }
  function normals(pts) { // inward normals for a clockwise ring in screen coords
    var n = pts.length, out = [];
    for (var i = 0; i < n; i++) { var a = pts[(i - 1 + n) % n], b = pts[(i + 1) % n], dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1; out.push([-dy / l, dx / l]); }
    return out;
  }
  function ringD(pts) { var s = "M" + f1(pts[0][0]) + " " + f1(pts[0][1]); for (var i = 1; i < pts.length; i++) s += "L" + f1(pts[i][0]) + " " + f1(pts[i][1]); return s + "Z"; }
  function circleRing(c, r, n) { var out = []; for (var i = 0; i < n; i++) { var a = 2 * Math.PI * i / n; out.push([c[0] + r * Math.cos(a), c[1] + r * Math.sin(a)]); } return out; }
  function ctrlRing(ctrl, perSeg, n) { var pts = spline(ctrl, perSeg), cum = cumLengths(pts); return resample(polyAt(pts, cum), [0, cum[cum.length - 1]], [n]); }
  function centroid(pts) { var c = [0, 0]; pts.forEach(function (p) { c[0] += p[0] / pts.length; c[1] += p[1] / pts.length; }); return c; }
  // superellipse |x/a|^n + |y/a|^n = 1 as a ring; n = 2 is the circle, large n is a rounded square
  var SEA_N = 256, seaAng = [];
  for (var sa = 0; sa < SEA_N; sa++) seaAng.push(2 * Math.PI * sa / SEA_N);
  function superRing(a, n) {
    var out = new Array(SEA_N), e = 2 / n;
    for (var i = 0; i < SEA_N; i++) {
      var c = Math.cos(seaAng[i]), s = Math.sin(seaAng[i]);
      out[i] = [CX + a * (c < 0 ? -1 : 1) * Math.pow(Math.abs(c), e), CY + a * (s < 0 ? -1 : 1) * Math.pow(Math.abs(s), e)];
    }
    return out;
  }

  function superR(a, n, th) { var c = Math.abs(Math.cos(th)), s2 = Math.abs(Math.sin(th)); return a / Math.pow(Math.pow(c, n) + Math.pow(s2, n), 1 / n); }

  /* ---------- the map (t = 0), viewBox 0 0 640 640, north roughly up ----------
     Thera, clockwise: outer coast from the Oia tip round the east and south to the Akrotiri tip, then back north
     along the caldera cliffs. Tagged points are anchors matched to the logo: crown, east rim, neck, chin, lip, nose, brow. */
  var THERA = [
    [198, 90, "crown"], [214, 70], [242, 58], [292, 44], [360, 42], [430, 62], [492, 108], [540, 170], [572, 240], [588, 320, "east"],
    [584, 395], [565, 462], [528, 520], [478, 562], [415, 588], [345, 598], [275, 590], [212, 574], [168, 560], [142, 546],
    [136, 530, "neck"],
    [150, 517], [184, 514], [236, 503], [292, 486], [340, 462, "chin"], [322, 405, "lip"], [350, 360], [360, 318, "nose"],
    [346, 268], [318, 230], [292, 205, "brow"], [278, 170], [258, 138], [232, 112], [210, 102]
  ];
  var LOGO_ANCHORS = [[263.1, 45.9], [600, 320], [353.2, 598], [332, 478.9], [303, 415], [344, 327], [258, 170]];
  var THERASIA = [[178, 140], [202, 166], [212, 210], [206, 258], [190, 300], [164, 318], [138, 306], [120, 266], [114, 214], [122, 172], [146, 146]];
  var NEA = [[322, 318], [330, 340], [312, 365], [285, 372], [258, 358], [252, 330], [265, 305], [292, 298]];
  var PALEA = [[246, 368], [252, 384], [238, 396], [220, 392], [212, 376], [222, 360]];
  var PALEA_C = [231, 379];

  var landRamp = ramp([[0, "#E6D2A3"], [0.22, "#DEBF8E"], [0.45, "#C4876A"], [0.62, "#8C5A5C"], [0.8, "#474A62"], [1, INK]]);
  var cliffRamp = ramp([[0, "#B25E48"], [0.5, "#7E4D55"], [1, INK]]);
  var seaRamp = ramp([[0, "#2A7AB3"], [0.5, "#5B91B8"], [1, HEAD]]);
  var dotRamp = ramp([[0, "#4B4642"], [0.34, "#4B4642"], [0.48, "#AD7660"], [0.62, "#E6D8BD"], [0.74, BG], [1, BG]]);
  var FRINGE = "#7FD3DF", TOWN = "#FFFDF6", GLINT = "#FFF3D2", HILL = "#CDB882";

  function mount(container) {
    var svg = document.createElementNS(NS, "svg");
    svg.setAttribute("viewBox", "0 0 640 640");
    svg.setAttribute("xmlns", NS);
    function el(tag, attrs, parent) { var e = document.createElementNS(NS, tag); for (var k in attrs) e.setAttribute(k, attrs[k]); (parent || svg).appendChild(e); return e; }

    /* -- hero rings: Thera's coast and the logo crescent, anchor-matched point for point -- */
    var PER = 24, fine = spline(THERA, PER), fineCum = cumLengths(fine);
    var mapAnch = [0]; THERA.forEach(function (p, i) { if (p[2] && i > 0) mapAnch.push(fineCum[i * PER]); }); mapAnch.push(fineCum[fineCum.length - 1]);
    var probe = el("path", { d: CRESCENT_D, fill: "none" });
    var total = probe.getTotalLength(), logoAnch = [0];
    for (var a = 1; a < LOGO_ANCHORS.length; a++) {
      var best = 0, bd = 1e9;
      for (var L = 0; L <= total; L += 0.5) { var p = probe.getPointAtLength(L), d = Math.hypot(p.x - LOGO_ANCHORS[a][0], p.y - LOGO_ANCHORS[a][1]); if (d < bd) { bd = d; best = L; } }
      logoAnch.push(best);
    }
    logoAnch.push(total);
    var counts = [], anchorIdx = [0];
    for (var k = 0; k < mapAnch.length - 1; k++) { counts.push(Math.ceil(Math.max(mapAnch[k + 1] - mapAnch[k], logoAnch[k + 1] - logoAnch[k]) / 2.5)); anchorIdx.push(anchorIdx[k] + counts[k]); }
    var base = resample(polyAt(fine, fineCum), mapAnch, counts);
    var logo = resample(function (L) { var p = probe.getPointAtLength(Math.min(L, total)); return [p.x, p.y]; }, logoAnch, counts);
    svg.removeChild(probe);
    var N = base.length, baseN = normals(base);
    var neckIdx = anchorIdx[2], noseIdx = anchorIdx[5], browIdx = anchorIdx[6];
    // outer-coast weight: 1 along crown -> east -> neck, tapering to 0 at both tips; the inner coast is the profile
    var wOut = new Array(N);
    for (var i = 0; i < N; i++) wOut[i] = i <= neckIdx ? clamp01(Math.min(i, neckIdx - i) / 18) : 0;
    var wPush = new Array(N);
    for (i = 0; i < N; i++) wPush[i] = i <= neckIdx ? clamp01(Math.min(i, neckIdx - i) / 7) : 0;
    // coastline wobble (fine detail) along the base normals, gone by t = 0.55; a few bays
    var baseCum = cumLengths(base), wob = new Array(N);
    var bays = [[0.36, 9, 40], [0.52, 7, 34], [0.17, -6, 30], [0.68, 5, 26]];
    for (i = 0; i < N; i++) {
      var s = baseCum[i], w = 3.0 * Math.sin(s / 23) + 1.8 * Math.sin(s / 9.5 + 2);
      for (var b = 0; b < bays.length; b++) { var ds = s - bays[b][0] * baseCum[N]; w += bays[b][1] * Math.exp(-ds * ds / (bays[b][2] * bays[b][2])); }
      var dTip = Math.min(Math.abs(s - mapAnch[0]), Math.abs(s - mapAnch[2]), Math.abs(s - baseCum[N]));
      wob[i] = w * Math.min(1, dTip / 36);
    }
    /* -- islets and Therasia -- */
    var M = 96, neaRing = ctrlRing(NEA, 16, M), dotRing = circleRing(DOT_C, DOT_R, M), neaC = centroid(neaRing);
    var theraRing = ctrlRing(THERASIA, 16, 72), theraD = ringD(theraRing), theraC = centroid(theraRing);
    var paleaD = ringD(ctrlRing(PALEA, 16, 48));
    var foldIdx = browIdx + Math.round(counts[6] * 0.42); // where Therasia folds into the forehead cliffs

    /* -- DOM, bottom to top (~40 elements) -- */
    el("rect", { x: 0, y: 0, width: 640, height: 640, fill: BG });
    var sea = el("path", { fill: seaRamp(0) });
    var glintG = el("g", { stroke: GLINT, "stroke-width": 5, "stroke-linecap": "round", fill: "none" });
    [[96, 418, 46], [112, 433, 22], [104, 404, 16], [130, 447, 12], [84, 390, 10]].forEach(function (g) { el("line", { x1: g[0], y1: g[1], x2: g[0] + g[2], y2: g[1] }, glintG); });
    var isle = el("g", {});                                   // everything that settles with the island
    var therasiaG = el("g", {}, isle);
    var therasiaFringe = el("path", { d: theraD, fill: "none", stroke: FRINGE, "stroke-linejoin": "round" }, therasiaG);
    var therasia = el("path", { d: theraD }, therasiaG);
    var manolas = el("circle", { cx: 176, cy: 236, r: 5, fill: TOWN }, therasiaG);
    var fringe = el("path", { fill: "none", stroke: FRINGE, "stroke-linejoin": "round" }, isle);
    var land = el("path", {}, isle);
    var hill = el("path", { fill: HILL }, isle);
    var cliff = el("path", {}, isle);
    var townG = el("g", { fill: TOWN }, isle);
    var townSpecs = [];
    function town(idx, off, dots) { dots.forEach(function (d) { townSpecs.push({ idx: idx, off: off, dx: d[0], dy: d[1], r: d[2], e: el("circle", { r: d[2] }, townG) }); }); }
    town(noseIdx, 12, [[0, 0, 6], [8, 10, 5], [-3, 14, 4.2], [10, -6, 3.8]]);                 // Fira
    town(browIdx, 12, [[0, 0, 5.4], [9, 8, 4.2]]);                                            // Imerovigli
    town(N - Math.round(counts[6] * 0.72), 11, [[0, 0, 5.8], [10, 6, 4.6], [3, 14, 3.8]]);    // Oia
    var paleaG = el("g", {}, isle);
    var paleaFringe = el("path", { d: paleaD, fill: "none", stroke: FRINGE, "stroke-linejoin": "round" }, paleaG);
    var palea = el("path", { d: paleaD }, paleaG);
    var neaFringe = el("path", { fill: "none", stroke: FRINGE, "stroke-linejoin": "round" }, isle);
    var dot = el("path", {}, isle);
    var frame = el("path", { fill: BG, "fill-rule": "evenodd" });   // page colour outside the sea, trims the island flush to the rim
    container.appendChild(svg);

    var cur = new Array(N), curN;
    function set(t) {
      t = clamp01(t);
      var done = t >= 0.999; curN = null;
      var sIn = 0.5 * t + 0.5 * t * t * (3 - 2 * t);     // profile progress
      var rim = sstep(0.08, 0.74, t);                    // sea tile -> disc, and outer coast -> r280 rim, together
      var sOut = Math.max(sIn, rim);
      var wAmp = 1 - sstep(0, 0.55, t);                  // coastline wobble
      // the island settles: a slight plane-view tilt eases out
      var rot = -8 * (1 - sstep(0.04, 0.6, t));
      isle.setAttribute("transform", rot ? "rotate(" + f3(rot) + " 320 320)" : "");
      // sea: full-bleed tile (rounded square) -> disc r280 -> the sunken head at t = 1
      var seaA = lerp(320, 280, rim), seaE = 2 + 22 * Math.pow(1 - rim, 1.7), seaD;
      if (done) seaD = HEAD_D; else if (rim >= 1) seaD = DISC_D; else seaD = ringD(superRing(seaA, seaE));
      sea.setAttribute("d", seaD); sea.setAttribute("fill", done ? HEAD : seaRamp(t));
      frame.setAttribute("d", rim >= 1 ? "M0 0Z" : "M0 0H640V640H0Z " + seaD);   // not needed once the sea is the disc
      // hero ring; from ~0.6 the outer coast is pushed radially onto the sea's edge so the island fills the tile to its rim
      var push = sstep(0.42, 0.62, t);
      for (var i = 0; i < N; i++) {
        var sp = sIn + (sOut - sIn) * wOut[i], w = wob[i] * wAmp;
        var x = lerp(base[i][0], logo[i][0], sp) + baseN[i][0] * w, y = lerp(base[i][1], logo[i][1], sp) + baseN[i][1] * w;
        if (push > 0 && wPush[i] > 0) {
          var dx = x - CX, dy = y - CY, r = Math.hypot(dx, dy), target = rim >= 1 ? R : superR(seaA, seaE, Math.atan2(dy, dx));
          if (target > r) { var k2 = (target - r) / r * push * wPush[i]; x += dx * k2; y += dy * k2; }
        }
        cur[i] = [x, y];
      }
      var landD = done ? CRESCENT_D + " " + DOT_D : ringD(cur);
      land.setAttribute("d", landD); land.setAttribute("fill", done ? INK : landRamp(t)); land.setAttribute("fill-rule", done ? "evenodd" : "nonzero");
      fringe.setAttribute("d", done ? CRESCENT_D : landD); fringe.setAttribute("stroke-width", f1(lerp(26, 8, sstep(0, 0.5, t)))); fringe.setAttribute("opacity", f1(0.9 * (1 - sstep(0.12, 0.5, t))));
      // inland tone: an inset of the coast, fades early
      var hillOp = 1 - sstep(0.08, 0.34, t);
      if (hillOp > 0) {
        if (!curN) curN = normals(cur);
        var hp = [], INS = 18;
        for (var h = 10; h <= neckIdx - 10; h++) hp.push([cur[h][0] + curN[h][0] * INS, cur[h][1] + curN[h][1] * INS]);
        for (h = neckIdx + 10; h <= N - 10; h++) hp.push([cur[h][0] + curN[h][0] * INS, cur[h][1] + curN[h][1] * INS]);
        hill.setAttribute("d", ringD(hp));
      } else hill.setAttribute("d", "M0 0Z");
      hill.setAttribute("opacity", f1(hillOp));
      // cliff band along the caldera edge (neck -> crown), offset into the land, fades as the land darkens
      var cliffOp = 1 - sstep(0.42, 0.66, t), D = 15 * (1 - sstep(0.3, 0.66, t));
      if (cliffOp > 0) {
        if (!curN) curN = normals(cur);
        var inner = [], outer = [];
        for (var j = neckIdx; j <= N; j++) {
          var jj = j % N, taper = Math.min(1, (j - neckIdx) / 16, (N - j) / 16 + 0.08);
          inner.push(cur[jj]); outer.push([cur[jj][0] + curN[jj][0] * D * taper, cur[jj][1] + curN[jj][1] * D * taper]);
        }
        outer.reverse();
        cliff.setAttribute("d", ringD(inner.concat(outer)));
      } else cliff.setAttribute("d", "M0 0Z");
      cliff.setAttribute("fill", cliffRamp(t)); cliff.setAttribute("opacity", f1(cliffOp));
      // towns ride the cliff edge, shrink and fade
      var townK = 1 - sstep(0.04, 0.38, t);
      townG.setAttribute("opacity", f1(townK));
      townSpecs.forEach(function (sp2) {
        var p = cur[sp2.idx], n = baseN[sp2.idx];
        sp2.e.setAttribute("cx", f1(p[0] + n[0] * sp2.off + sp2.dx)); sp2.e.setAttribute("cy", f1(p[1] + n[1] * sp2.off + sp2.dy)); sp2.e.setAttribute("r", f1(sp2.r * townK));
      });
      manolas.setAttribute("r", f1(5 * townK));
      // sun glitter drifts and fades
      var gl = 1 - sstep(0.03, 0.42, t);
      glintG.setAttribute("opacity", f1(0.95 * gl)); glintG.setAttribute("transform", "translate(" + f1(60 * (1 - gl)) + " " + f1(-20 * (1 - gl)) + ")");
      // Therasia drifts across the caldera, flattens against the forehead cliffs and is absorbed
      var te = sstep(0.1, 0.52, t), tOp = 1 - sstep(0.44, 0.54, t);
      if (tOp > 0) {
        if (!curN) curN = normals(cur);
        var fp = cur[foldIdx], fn = curN[foldIdx];
        var tx = lerp(theraC[0], fp[0] + fn[0] * 24, te), ty = lerp(theraC[1], fp[1] + fn[1] * 24, te);
        var ang = Math.atan2(fn[1], fn[0]) * 180 / Math.PI;        // long (y) axis turns onto the coast tangent
        therasiaG.setAttribute("transform", "translate(" + f1(tx) + " " + f1(ty) + ") rotate(" + f1(ang * te) + ") scale(" + f3(lerp(1, 0.3, te)) + " " + f3(lerp(1, 0.5, te)) + ") translate(" + f1(-theraC[0]) + " " + f1(-theraC[1]) + ")");
      }
      therasiaG.setAttribute("opacity", f1(tOp));
      therasia.setAttribute("fill", landRamp(t));
      therasiaFringe.setAttribute("stroke-width", f1(lerp(22, 8, sstep(0, 0.4, t)))); therasiaFringe.setAttribute("opacity", f1(0.9 * (1 - sstep(0.1, 0.4, t))));
      // Palea Kameni slides into Nea Kameni
      var pe = sstep(0.04, 0.42, t), pk = 1 - sstep(0.1, 0.45, t);
      var sd = sstep(0.3, 0.76, t), sh = sstep(0.08, 0.5, t), dc = [lerp(neaC[0], DOT_C[0], sd), lerp(neaC[1], DOT_C[1], sd)];
      var px = lerp(PALEA_C[0], dc[0], pe), py = lerp(PALEA_C[1], dc[1], pe);
      paleaG.setAttribute("transform", "translate(" + f1(px) + " " + f1(py) + ") scale(" + f3(Math.max(0.001, pk)) + ") translate(" + f1(-PALEA_C[0]) + " " + f1(-PALEA_C[1]) + ")");
      paleaG.setAttribute("opacity", pk > 0 ? 1 : 0);
      palea.setAttribute("fill", dotRamp(t));
      paleaFringe.setAttribute("stroke-width", f1(lerp(18, 6, sstep(0, 0.4, t)))); paleaFringe.setAttribute("opacity", f1(0.9 * (1 - sstep(0.08, 0.4, t))));
      // Nea Kameni -> island dot: shape, position and colour (dark lava lit to ivory, then page white)
      var dotD;
      if (done) dotD = DOT_D; else {
        var pts = new Array(M);
        for (var q = 0; q < M; q++) pts[q] = [lerp(neaRing[q][0] - neaC[0], dotRing[q][0] - DOT_C[0], sh) + dc[0], lerp(neaRing[q][1] - neaC[1], dotRing[q][1] - DOT_C[1], sh) + dc[1]];
        dotD = ringD(pts);
      }
      dot.setAttribute("d", dotD); dot.setAttribute("fill", done ? BG : dotRamp(t)); dot.setAttribute("opacity", done ? 0 : 1);
      neaFringe.setAttribute("d", dotD); neaFringe.setAttribute("stroke-width", f1(lerp(20, 6, sstep(0, 0.4, t)))); neaFringe.setAttribute("opacity", f1(0.9 * (1 - sstep(0.1, 0.42, t))));
    }
    return { set: set, destroy: function () { if (svg.parentNode) svg.parentNode.removeChild(svg); } };
  }

  window.TheraAnimations = window.TheraAnimations || {};
  window.TheraAnimations["santorini-crescent"] = {
    title: "Santorini to the caldera crescent",
    from: "Santorini from above",
    to: "Caldera and Sunken Head",
    viewBox: "0 0 640 640",
    mount: mount
  };
})();
