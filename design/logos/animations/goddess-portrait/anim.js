// thera. logo animation: classical goddess in profile (flat-vector museum-poster roundel) -> "Goddess on the coin" mark.
// Track "goddess-coin", approach "portrait". Plain browser script, no modules. Hand-matched paths throughout (no flubber needed).
//
// Scene (t = 0): a dusty-terracotta roundel on warm paper; a goddess in profile looking right; ivory skin with soft shading
// planes, auburn hair gathered into a chignon, a gold fillet with laurel leaves, eye + brow, lips, ear + drop earring, and a
// hint of draped chiton at the shoulders with a fibula.
//
// Morph plan
//   hair mass + skull       -> the coin body. Its silhouette is four cubics that land exactly on the r 280 rim; its hidden
//                              inner edge runs just inside the profile, under the face, so hair and face never show a gap.
//   face plane + neck       -> the band of light. One hand-matched path: forehead arc, nasion dip, nose line, tip fillet,
//                              lips, chin arc, throat fillet, neck; its back edge (hairline, nape) straightens to x = 240.
//                              Clipped to the disc, so the neck runs to the rim once the chiton has gone.
//   roundel                 -> the crescent (it stays a disc, covered by hair and face, then swaps to the exact path at lock).
//   diadem                  -> the rim: it widens to r 275, takes the body colour and thins to nothing in the last 15%.
//   leaves, strands, shading, eye, brow, lips, nostril, ear, earring -> fold into the profile line / hairline by t = 0.6.
//   chiton + folds + fibula -> sink out of the bottom of the roundel while taking the roundel's colour (t = 0.1 .. 0.55).
(function () {
  "use strict";
  var NS = "http://www.w3.org/2000/svg";

  // ---- end state (LOGO_PATHS.md, viewBox 0 0 640 640) ----
  var BG = "#F7F9FA", BODY = "#466680", CRESCENT = "#8DA8BB";
  var BODY_PATH = "M 240 51.7 A 280 280 0 0 0 240 588.3 Z";
  var CRESCENT_PATH = "M 360 597.1 A 280 280 0 0 0 360 42.9 A 400 400 0 0 1 366 170 L 433.2 315.4 A 20 20 0 0 1 427.1 339.7 L 387 370 L 388.9 421.9 A 80 80 0 0 1 375 532.4 A 40 40 0 0 0 360 563.7 L 360 597.1 Z";
  var DISC_PATH = "M 320 40 A 280 280 0 1 1 320 600 A 280 280 0 1 1 320 40 Z";
  var LOCK = 0.92; // geometry is exact and swapped to the logo paths from here on; colours lock at 0.9

  // ---- colour helper: OKLab blends with hand-picked mid stops (no grey mud) ----
  function hexToLin(h) {
    var n = parseInt(h.slice(1), 16), c = [(n >> 16) & 255, (n >> 8) & 255, n & 255];
    return c.map(function (v) { v /= 255; return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); });
  }
  function linToHex(c) {
    var s = c.map(function (v) { v = v <= 0.0031308 ? 12.92 * v : 1.055 * Math.pow(v, 1 / 2.4) - 0.055; v = Math.round(Math.min(1, Math.max(0, v)) * 255); return (v < 16 ? "0" : "") + v.toString(16); });
    return ("#" + s.join("")).toUpperCase();
  }
  function linToLab(c) {
    var r = c[0], g = c[1], b = c[2];
    var l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
    var m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
    var s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
    return [0.2104542553 * l + 0.7936177850 * m - 0.0040720468 * s,
            1.9779984951 * l - 2.4285922050 * m + 0.4505937099 * s,
            0.0259040371 * l + 0.7827717662 * m - 0.8086757660 * s];
  }
  function labToLin(L) {
    var l = L[0] + 0.3963377774 * L[1] + 0.2158037573 * L[2];
    var m = L[0] - 0.1055613458 * L[1] - 0.0638541728 * L[2];
    var s = L[0] - 0.0894841775 * L[1] - 1.2914855480 * L[2];
    l = l * l * l; m = m * m * m; s = s * s * s;
    return [4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
            -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
            -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s];
  }
  var labCache = {};
  function lab(h) { return labCache[h] || (labCache[h] = linToLab(hexToLin(h))); }
  function mixLab(A, B, k) { return linToHex(labToLin([A[0] + (B[0] - A[0]) * k, A[1] + (B[1] - A[1]) * k, A[2] + (B[2] - A[2]) * k])); }
  // mix(hexA, hexB, u): OKLab blend; the ends are returned verbatim so locked colours are exact.
  function mix(a, b, u) { return u <= 0 ? a : u >= 1 ? b : mixLab(lab(a), lab(b), u); }
  // ramp(["#a", "#mid", "#b"]) -> function(u) -> hex, piecewise through the stops.
  function ramp(stops) {
    var n = stops.length - 1;
    return function (u) {
      if (u <= 0) return stops[0];
      if (u >= 1) return stops[n];
      var s = Math.min(n - 1, Math.floor(u * n));
      return mixLab(lab(stops[s]), lab(stops[s + 1]), u * n - s);
    };
  }

  // ---- easing / lerp / path helpers ----
  function clamp01(x) { return x < 0 ? 0 : x > 1 ? 1 : x; }
  function smooth(x) { x = clamp01(x); return x * x * (3 - 2 * x); }
  function win(t, a, b) { return smooth((t - a) / (b - a)); }
  function lerp(a, b, u) { return u >= 1 ? b : u <= 0 ? a : a + (b - a) * u; }
  function lerpArr(A, B, u, out) { for (var i = 0; i < A.length; i++) out[i] = lerp(A[i], B[i], u); return out; }
  function f(n) { return String(Math.round(n * 100) / 100); }
  function P(x, y) { return f(x) + " " + f(y); }
  function flat(obj, keys) { var out = []; keys.forEach(function (k) { var v = obj[k]; if (typeof v === "number") out.push(v); else out.push(v[0], v[1]); }); return out; }
  function indexer(obj, keys) { var m = {}, i = 0; keys.forEach(function (k) { m[k] = i; i += typeof obj[k] === "number" ? 1 : 2; }); return m; }
  function deg(y, x) { return Math.atan2(y - 320, x - 320) * 180 / Math.PI; }
  // Cubic-Bezier approximation of the r 280 rim from angle a0 to a1 (degrees, signed sweep), n segments.
  function arcCubics(cx, cy, r, a0, a1, n) {
    var out = [], d = (a1 - a0) / n, k = 4 / 3 * Math.tan(Math.abs(d) * Math.PI / 180 / 4) * r, s = d > 0 ? 1 : -1;
    for (var i = 0; i <= n; i++) {
      var a = (a0 + d * i) * Math.PI / 180, px = cx + r * Math.cos(a), py = cy + r * Math.sin(a);
      var tx = -Math.sin(a) * s, ty = Math.cos(a) * s;
      if (i > 0) out.push([px - k * tx, py - k * ty]);
      out.push([px, py]);
      if (i < n) out.push([px + k * tx, py + k * ty]);
    }
    return out;
  }

  // ---- illustration palette (t = 0) ----
  var COL = {
    paper: "#F2EBE0", disc: "#CB8870",
    skin: "#F3E3CD", skinShade: "#D9BB9B", blush: "#E6A48E",
    hair: "#5A392B", hairLight: "#8E5E45",
    gold: "#CFA955", goldDark: "#9A7730",
    chiton: "#A8513A", chitonFold: "#D5977C",
    lips: "#C9716A", lipLine: "#A2514B",
    iris: "#3F2C1E", sclera: "#FBF5EA",
    ear: "#ECD3B8", earLine: "#C9A383", nostril: "#CC8F7E"
  };
  var paperRamp = ramp([COL.paper, BG]);
  var discRamp = ramp([COL.disc, "#BE9AA3", CRESCENT]);   // terracotta -> dusty rose-mauve -> sea blue
  var hairRamp = ramp([COL.hair, "#5B4152", BODY]);       // auburn -> plum -> slate blue
  var skinRamp = ramp([COL.skin, "#F5EEE4", BG]);         // ivory -> warm white -> page

  // ---- face + neck -> band of light (hand-matched; same command structure at both ends) ----
  // Profile runs P0 (forehead top) .. P11 (neck base); B0..B4 is the back edge (neck back, nape, behind the ear, temple).
  var FKEYS = ["P0", "rF", "P1", "rN", "P2", "P3", "rT", "P4", "P5", "cU", "P6", "cL", "P7", "P8", "rC", "P9", "rJ", "P10", "P11", "rB", "B0",
               "c01a", "c01b", "B1", "c12a", "c12b", "B2", "c23a", "c23b", "B3", "c34a", "c34b", "B4", "rTop"];
  var FACE0 = {
    P0: [372, 168], rF: 95, P1: [404, 250], rN: 12, P2: [398, 262], P3: [448, 318], rT: 14, P4: [430, 338],
    P5: [426, 346], cU: [442, 356], P6: [428, 370], cL: [442, 384], P7: [422, 396], P8: [420, 400],
    rC: 50, P9: [398, 468], rJ: 24, P10: [388, 488], P11: [392, 606], rB: 60, B0: [330, 606],
    c01a: [326, 560], c01b: [322, 450], B1: [326, 406], c12a: [316, 380], c12b: [300, 330], B2: [304, 300],
    c23a: [310, 264], c23b: [326, 232], B3: [334, 212], c34a: [338, 186], c34b: [342, 168], B4: [348, 152], rTop: 40
  };
  var FACE1 = {
    P0: [360, 42.9], rF: 400, P1: [366, 170], rN: 20, P2: [366, 170], P3: [433.2, 315.4], rT: 20, P4: [427.1, 339.7],
    P5: [387, 370], cU: [387.48, 383], P6: [387.63, 387], cL: [388.1, 400], P7: [388.46, 410], P8: [388.9, 421.9],
    rC: 80, P9: [375, 532.4], rJ: 40, P10: [360, 563.7], P11: [360, 640], rB: 400, B0: [240, 640],
    c01a: [240, 560], c01b: [240, 480], B1: [240, 420], c12a: [240, 380], c12b: [240, 340], B2: [240, 300],
    c23a: [240, 260], c23b: [240, 220], B3: [240, 180], c34a: [240, 140], c34b: [240, 100], B4: [240, 51.7], rTop: 280
  };
  var F0 = flat(FACE0, FKEYS), F1 = flat(FACE1, FKEYS), FI = indexer(FACE0, FKEYS);
  function pt(v, i) { return P(v[i], v[i + 1]); }
  function arcTo(v, ri, sweep, pi) { return " A " + f(v[ri]) + " " + f(v[ri]) + " 0 0 " + sweep + " " + pt(v, pi); }
  function cubTo(v, a, b, p) { return " C " + pt(v, a) + " " + pt(v, b) + " " + pt(v, p); }
  function buildFace(v) {
    var I = FI;
    return "M " + pt(v, I.P0) + arcTo(v, I.rF, 1, I.P1) + arcTo(v, I.rN, 0, I.P2) + " L " + pt(v, I.P3) + arcTo(v, I.rT, 1, I.P4) +
      " L " + pt(v, I.P5) + " Q " + pt(v, I.cU) + " " + pt(v, I.P6) + " Q " + pt(v, I.cL) + " " + pt(v, I.P7) + " L " + pt(v, I.P8) +
      arcTo(v, I.rC, 1, I.P9) + arcTo(v, I.rJ, 0, I.P10) + " L " + pt(v, I.P11) + arcTo(v, I.rB, 1, I.B0) +
      cubTo(v, I.c01a, I.c01b, I.B1) + cubTo(v, I.c12a, I.c12b, I.B2) + cubTo(v, I.c23a, I.c23b, I.B3) + cubTo(v, I.c34a, I.c34b, I.B4) +
      arcTo(v, I.rTop, 1, I.P0) + " Z";
  }

  // ---- hair + chignon -> coin body ----
  // Silhouette N0..N4 (four cubics: crown, back of skull, chignon, under the bun to the nape) lands on the rim at t = 1.
  // Q0..Q9 is the hidden inner edge: it runs just inside the profile, so the hair always extends under the face.
  var HKEYS = ["N0", "a0", "b1", "N1", "a1", "b2", "N2", "a2", "b3", "N3", "a3", "b4", "N4", "Q0", "Q1", "Q2", "Q3", "Q4", "Q5", "Q6", "Q7", "Q8", "Q9"];
  var HAIR0 = {
    N0: [372, 168], a0: [382, 140], b1: [332, 94], N1: [262, 100], a1: [206, 106], b2: [160, 180], N2: [160, 236],
    a2: [122, 262], b3: [118, 352], N3: [182, 396], a3: [236, 420], b4: [300, 418], N4: [334, 406],
    Q0: [380, 560], Q1: [382, 488], Q2: [390, 472], Q3: [416, 402], Q4: [422, 346], Q5: [426, 336], Q6: [440, 318], Q7: [396, 266], Q8: [398, 250], Q9: [368, 180]
  };
  var rim = arcCubics(320, 320, 280, deg(42.9, 360), deg(597.7, 356) - 360, 4);
  var HAIR1 = {
    N0: rim[0], a0: rim[1], b1: rim[2], N1: rim[3], a1: rim[4], b2: rim[5], N2: rim[6], a2: rim[7], b3: rim[8], N3: rim[9], a3: rim[10], b4: rim[11], N4: rim[12],
    Q0: [348, 588], Q1: [354, 562], Q2: [370, 532], Q3: [383, 421], Q4: [382, 371], Q5: [421, 340], Q6: [427, 316], Q7: [361, 172], Q8: [361, 170], Q9: [354, 47]
  };
  var H0 = flat(HAIR0, HKEYS), H1 = flat(HAIR1, HKEYS), HI = indexer(HAIR0, HKEYS);
  var HAIR_OUT0 = HI.a0, HAIR_OUT1 = HI.Q0; // the outer silhouette (a0..N4) runs on a slightly faster clock than the face, so the body meets the rim before the profile locks
  function buildHair(v) {
    var I = HI;
    var d = "M " + pt(v, I.N0) + cubTo(v, I.a0, I.b1, I.N1) + cubTo(v, I.a1, I.b2, I.N2) + cubTo(v, I.a2, I.b3, I.N3) + cubTo(v, I.a3, I.b4, I.N4);
    for (var i = I.Q0; i <= I.Q9; i += 2) d += " L " + pt(v, i);
    return d + " Z";
  }

  // Diadem: an arc on the skull (centre (288,240) r 112) -> an arc just inside the rim (r 275) that thins away.
  var SK0 = [288, 240, 140], SK1 = [320, 320, 280];               // skull frame -> rim frame (for strands and leaves)
  function polar(cx, cy, r, a) { a *= Math.PI / 180; return [cx + r * Math.cos(a), cy + r * Math.sin(a)]; }
  function diadem(cx, cy, r, aFront, aBack) { var a = polar(cx, cy, r, aFront), b = polar(cx, cy, r, aBack); return [a[0], a[1], b[0], b[1], r]; }
  var DIA0 = diadem(288, 240, 112, -48, -162), DIA1 = diadem(320, 320, 268, -100, -182); // front x,y, back x,y, radius
  function buildDiadem(d) { return "M " + P(d[0], d[1]) + " A " + f(d[4]) + " " + f(d[4]) + " 0 0 0 " + P(d[2], d[3]); }
  var LEAVES = [-60, -78, -96, -114, -132];
  var LEAF0 = LEAVES.map(function (a) { return polar(288, 240, 114, a); }), LEAF1 = LEAVES.map(function (a) { return polar(320, 320, 262, a); });
  var STRANDS = ["M 374 174 C 334 150 292 150 254 170 C 212 192 194 236 202 290",
                 "M 370 186 C 334 178 304 194 284 224 C 264 254 260 292 270 332",
                 "M 358 200 C 334 210 322 232 318 260",
                 "M 142 300 C 140 360 190 400 232 380 C 262 366 256 318 220 312 C 196 310 190 338 208 348"];

  function el(tag, attrs, parent) {
    var e = document.createElementNS(NS, tag);
    for (var k in attrs) e.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(e);
    return e;
  }

  window.TheraAnimations = window.TheraAnimations || {};
  window.TheraAnimations["goddess-portrait"] = {
    title: "Portrait goddess to the coin mark",
    from: "Classical goddess",
    to: "Goddess on the coin",
    viewBox: "0 0 640 640",
    mount: function (container) {
      var svg = el("svg", { xmlns: NS, viewBox: "0 0 640 640", role: "img", "aria-label": "A classical goddess in profile becoming the thera. coin mark" });
      svg.style.willChange = "transform"; // one compositing layer: cheap scrubbing, and repaints are pixel-stable
      var defs = el("defs", {}, svg);
      el("circle", { cx: 320, cy: 320, r: 280 }, el("clipPath", { id: "gc-disc" }, defs));
      var faceClip = el("path", {}, el("clipPath", { id: "gc-face" }, defs));

      var paper = el("rect", { x: 0, y: 0, width: 640, height: 640, fill: COL.paper }, svg);
      var disc = el("path", { d: DISC_PATH, fill: COL.disc }, svg);

      var hair = el("path", { fill: COL.hair }, svg);
      var strands = el("g", { fill: "none", stroke: COL.hairLight, "stroke-width": 3.2, "stroke-linecap": "round" }, svg);
      STRANDS.forEach(function (d) { el("path", { d: d }, strands); });
      var diadem = el("path", { fill: "none", stroke: COL.gold, "stroke-width": 10, "stroke-linecap": "round" }, svg);
      var leaves = el("g", { fill: COL.gold, stroke: COL.goldDark, "stroke-width": 1.2, "stroke-linejoin": "round" }, svg);
      var leafEls = LEAVES.map(function () { return el("path", { d: "M 0 -17 Q 9 -6 0 8 Q -9 -6 0 -17 Z" }, leaves); });

      var faceG = el("g", { "clip-path": "url(#gc-disc)" }, svg);
      var face = el("path", { fill: COL.skin }, faceG);
      var shading = el("g", { "clip-path": "url(#gc-face)", fill: COL.skinShade }, faceG);
      ["M 338 214 C 354 206 374 214 386 234 C 390 246 374 254 356 258 C 344 258 334 236 338 214 Z",        // temple / socket
       "M 314 338 C 346 352 380 374 412 398 C 416 424 410 448 404 458 C 368 434 332 392 314 338 Z",         // lower cheek plane, to the jaw
       "M 326 470 C 350 486 372 490 392 488 L 392 512 C 364 512 342 504 326 492 Z"].forEach(function (d) { el("path", { d: d }, shading); }); // under the chin
      var blush = el("ellipse", { cx: 388, cy: 330, rx: 20, ry: 13, fill: COL.blush }, shading);

      var earG = el("g", {}, svg);
      el("path", { d: "M 334 262 C 306 254 292 288 300 316 C 306 334 326 338 336 326 C 326 308 326 282 334 262 Z", fill: COL.ear, stroke: COL.earLine, "stroke-width": 1.5 }, earG);
      el("path", { d: "M 324 276 C 312 282 312 306 322 316", fill: "none", stroke: COL.earLine, "stroke-width": 2, "stroke-linecap": "round" }, earG);
      var earringG = el("g", {}, svg);
      el("circle", { cx: 318, cy: 340, r: 4, fill: COL.gold }, earringG);
      el("ellipse", { cx: 318, cy: 355, rx: 5, ry: 8, fill: COL.gold, stroke: COL.goldDark, "stroke-width": 1 }, earringG);

      var eyeG = el("g", {}, svg);
      el("path", { d: "M 352 244 Q 374 232 394 240", fill: "none", stroke: COL.hair, "stroke-width": 4, "stroke-linecap": "round" }, eyeG); // brow
      el("path", { d: "M 358 266 Q 376 250 394 262 Q 378 274 358 266 Z", fill: COL.sclera }, eyeG);
      el("circle", { cx: 382, cy: 263, r: 7, fill: COL.iris }, eyeG);
      el("circle", { cx: 384, cy: 261, r: 2, fill: COL.sclera }, eyeG);
      el("path", { d: "M 358 266 Q 376 250 394 262", fill: "none", stroke: COL.hair, "stroke-width": 2.5, "stroke-linecap": "round" }, eyeG); // lid
      var nostrilG = el("g", {}, svg);
      el("path", { d: "M 436 328 Q 428 330 428 337", fill: "none", stroke: COL.nostril, "stroke-width": 2.2, "stroke-linecap": "round" }, nostrilG);
      var lipsG = el("g", {}, svg);
      el("path", { d: "M 426 346 Q 442 356 428 370 Q 442 384 422 396 Q 410 386 416 370 Q 410 356 426 346 Z", fill: COL.lips }, lipsG);
      el("path", { d: "M 416 370 Q 424 366 428 370", fill: "none", stroke: COL.lipLine, "stroke-width": 1.5, "stroke-linecap": "round" }, lipsG);

      var chitonClip = el("g", { "clip-path": "url(#gc-disc)" }, svg);
      var chitonG = el("g", {}, chitonClip);
      var chiton = el("path", { d: "M 40 476 C 150 522 260 530 334 540 L 392 540 C 450 530 540 522 600 560 L 600 720 L 40 720 Z", fill: COL.chiton }, chitonG);
      var folds = el("g", { fill: "none", stroke: COL.chitonFold, "stroke-width": 3, "stroke-linecap": "round" }, chitonG);
      ["M 212 544 Q 206 568 216 600", "M 250 540 Q 244 566 252 600", "M 436 548 Q 440 572 432 604", "M 458 546 Q 468 570 466 604"].forEach(function (d) { el("path", { d: d }, folds); });
      var fibula = el("g", {}, chitonG);
      el("circle", { cx: 418, cy: 542, r: 7.5, fill: COL.gold, stroke: COL.goldDark, "stroke-width": 1.5 }, fibula);
      el("circle", { cx: 418, cy: 542, r: 2.5, fill: COL.goldDark }, fibula);

      container.appendChild(svg);

      var fv = new Array(F0.length), hv = new Array(H0.length), dv = new Array(DIA0.length);
      // Shrink a detail group toward a point on the (current) profile while fading it.
      function foldTo(group, k, ax, ay, tx, ty) {
        var s = 1 - k;
        group.setAttribute("transform", "translate(" + P(lerp(ax, tx, k), lerp(ay, ty, k)) + ") scale(" + f(s) + ") translate(" + P(-ax, -ay) + ")");
        group.setAttribute("opacity", f(1 - smooth(k * 1.3)));
      }

      function set(t) {
        t = clamp01(t);
        var g = smooth(t / LOCK);               // geometry progress
        var gh = smooth(t / (LOCK * 0.85));     // hair-silhouette clock (reaches the rim at t = 0.78)
        var c = smooth((t - 0.15) / 0.75);      // colour progress (locks at 0.9)
        var locked = t >= LOCK;
        var hairCol = hairRamp(c), discCol = discRamp(c);

        paper.setAttribute("fill", paperRamp(c));
        disc.setAttribute("d", locked ? CRESCENT_PATH : DISC_PATH);
        disc.setAttribute("fill", discCol);

        lerpArr(H0, H1, g, hv);
        for (var i = HAIR_OUT0; i < HAIR_OUT1; i++) hv[i] = lerp(H0[i], H1[i], gh);
        hair.setAttribute("d", locked ? BODY_PATH : buildHair(hv));
        hair.setAttribute("fill", hairCol);

        var cx = lerp(SK0[0], SK1[0], gh), cy = lerp(SK0[1], SK1[1], gh), sc = lerp(SK0[2], SK1[2], gh) / SK0[2];
        strands.setAttribute("transform", "translate(" + P(cx, cy) + ") scale(" + f(sc) + ") translate(" + P(-SK0[0], -SK0[1]) + ")");
        strands.setAttribute("opacity", f(1 - win(t, 0.05, 0.42)));

        lerpArr(DIA0, DIA1, gh, dv);
        diadem.setAttribute("d", buildDiadem(dv));
        diadem.setAttribute("stroke", mix(COL.gold, "#E6D6B2", win(t, 0.5, 0.86)));   // gold -> pale sand: a glint on the rim, never olive
        diadem.setAttribute("stroke-width", f(lerp(10, 2.5, win(t, 0.55, 0.88))));
        diadem.setAttribute("opacity", f(1 - win(t, 0.72, 0.88)));
        var kL = win(t, 0.03, 0.26);
        leaves.setAttribute("opacity", f(1 - kL));
        LEAVES.forEach(function (a, i) {
          leafEls[i].setAttribute("transform", "translate(" + P(lerp(LEAF0[i][0], LEAF1[i][0], gh), lerp(LEAF0[i][1], LEAF1[i][1], gh)) + ") rotate(" + f(a + 118) + ") scale(" + f((1 - kL) * sc) + ")");
        });

        lerpArr(F0, F1, g, fv);
        var fd = buildFace(fv);
        face.setAttribute("d", fd);
        face.setAttribute("fill", skinRamp(c));
        face.setAttribute("visibility", locked ? "hidden" : "visible");
        faceClip.setAttribute("d", fd);
        shading.setAttribute("opacity", f(0.4 * (1 - win(t, 0.05, 0.45))));
        blush.setAttribute("opacity", f(0.7 * (1 - win(t, 0.05, 0.4))));

        var I = FI;
        foldTo(earG, win(t, 0.08, 0.5), 318, 300, fv[I.B2], fv[I.B2 + 1]);
        foldTo(earringG, win(t, 0.04, 0.4), 318, 350, fv[I.B1], fv[I.B1 + 1]);
        foldTo(eyeG, win(t, 0.14, 0.56), 376, 258, fv[I.P2], fv[I.P2 + 1]);
        foldTo(nostrilG, win(t, 0.05, 0.4), 432, 332, fv[I.P4], fv[I.P4 + 1]);
        foldTo(lipsG, win(t, 0.2, 0.6), 427, 371, fv[I.P6], fv[I.P6 + 1]);

        var kC = win(t, 0.1, 0.55);
        chitonG.setAttribute("transform", "translate(0 " + f(150 * kC) + ")");
        chiton.setAttribute("fill", mix(COL.chiton, discCol, kC));
        folds.setAttribute("opacity", f(1 - smooth(kC * 1.4)));
        fibula.setAttribute("opacity", f(1 - smooth(kC * 1.4)));
      }

      return {
        set: set,
        destroy: function () { if (svg.parentNode) svg.parentNode.removeChild(svg); }
      };
    }
  };
})();
