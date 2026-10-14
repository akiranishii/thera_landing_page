// thera. logo animation v2 — track "goddess-coin" (final, from the "emblem-portrait" approach).
//
// t = 0  A geometric goddess portrait composed inside the coin, drawn only in the Blue Haze family: a sea-blue field
//        (#8DA8BB) inside a thin light rim ring (#C4D5E0); her hair and the back of her head in primary #466680, a
//        rounded dome with one lighter crown plane (#6A879E) and wave bands built from arcs concentric with her
//        chignon; the chignon is a #466680 bun with one ink coil (1.5 turns) round a #6A879E centre (a quiet nod to
//        Atlantis); a laurel of #C4D5E0 leaves on the crown; a hair lock over the ear; face and neck in white with the
//        neck in one #EAF0F4 plane under the jaw line; an almond eye and brow in ink #223848; a nostril and the lips as
//        small #C4D5E0 shapes; a drop earring with a light highlight. She looks right.
// t = 1  The "Goddess on the coin" mark, exact: body #466680 (left segment), crescent #8DA8BB, the light band between
//        them is the page colour #F7F9FA (LOGO_PATHS.md).
//
// Masses (closed polylines sampled from matched segment lists, same point count at both ends):
//   field  the coin field: a full disc, covered by the face and the hair everywhere but the crescent; at the lock it
//          is swapped for the exact crescent string.
//   face   face + neck -> the light band. Its profile is hand-matched to the logo profile segment by segment (forehead,
//          Greek nose ridge, tip, under-nose, lips -> the lip plane, chin, throat, neck). It lies UNDER the hair: its back
//          edge always runs 4 units under the hairline, so the only visible back edge is the hair's.
//   hair   hair + back of the head -> the coin body. Its inner edge is the hairline (the visible face/hair boundary).
//          Its outer contour is blended in polar form (angle and radius about the disc centre), so it can never cross
//          the rim and always meets it tangentially; the back closes its gap to the rim with a radial ease-out.
// Motion, overlapping clocks, so the face never shows a flat top inside the disc and the middle is never heavier
// than either end (dark coverage inside the disc rises steadily from 23% to its final 32%):
//   rise   (0.04-0.46)  the forehead climbs to the rim at the crescent tip, the front of the hair just ahead of it, the
//                        crown is cropped by the rim, the neck truncation drops onto it; the back of the head and the
//                        nape reach the rim by 0.62, so no field shows between hair and rim from about 0.45.
//   slide  (0.18-0.64)  the junction slides back along the rim to the body's corner; the hairline relaxes (0.18-0.44)
//                        into one calm curve that runs into the junction under the rim, so the band's top is a rounded
//                        forehead under a thin fringe that opens along the rim behind it (no spike, no flat top).
//   settle (0.34-0.84)  the last bow at the jaw straightens onto x = 240; the profile keeps morphing to 0.90.
//   lock   (0.90)       profile done, face colour = page colour: body, crescent and band are written as the exact
//                        LOGO_PATHS strings in one call, with no visible change (see FIELD_DISC below).
// Details, each with a destination: wave bands thin and darken into the hair; the chignon closes in and takes the
// body colour by 0.48; the crown plane thins out onto the rim; the laurel leaves fold flat onto the stem while the stem
// rides the crown out to the rim (it is tied to the hair contour, so it never crosses open field) and shortens there
// by 0.40; the rim ring grows to the disc edge under the hair and thins away there by 0.76; eye, brow and nostril ride
// the face and shrink into the profile line by 0.50, taking the crescent colour as they arrive (no opacity fade); the
// lips flatten into the profile and take the crescent colour; the earring slides back under the hair; the neck plane
// brightens into the face.
// All colour stays in the palette (OKLab blends between palette colours).
// set(t) is stateless: everything is precomputed in mount; set() fills preallocated buffers and writes attributes
// through a cache.
(function () {
  "use strict";

  var NS = "http://www.w3.org/2000/svg";
  var CX = 320, CY = 320, R = 280;
  var RB = R + 0.5;        // the face's rim arcs sit just outside the disc: page colour on page colour
  var PUSH = 4;            // the face's back edge runs this far under the hairline
  var BG = "#F7F9FA", WHITE = "#FFFFFF", SURF = "#EAF0F4", LIGHT = "#C4D5E0", CRES = "#8DA8BB", BODY = "#466680", INK = "#223848";
  var WAVE = "#344F64";    // 50/50 of primary and ink
  var CROWN = "#6A879E";   // 50/50 of primary and muted sea blue
  var BODY_PATH = "M 240 51.7 A 280 280 0 0 0 240 588.3 Z";
  var CRES_PATH = "M 360 597.1 A 280 280 0 0 0 360 42.9 A 400 400 0 0 1 366 170 L 433.2 315.4 A 20 20 0 0 1 427.1 339.7 L 387 370 L 388.9 421.9 A 80 80 0 0 1 375 532.4 A 40 40 0 0 0 360 563.7 L 360 597.1 Z";
  // The renderer draws an SVG arc a fraction of a pixel differently from a polyline on the same circle (and from an arc
  // whose centre differs by 0.1), so the rim is written with the logo's own arc strings well before the lock:
  // the field is the disc written through the crescent's exact right arc and the body's exact left arc; once the hair
  // covers the left segment it drops the left part; the hair's rim becomes an arc on the body's circle (centre CXB).
  var FIELD_DISC = "M 360 597.1 A 280 280 0 0 0 360 42.9 A 280 280 0 0 0 240 51.7 A 280 280 0 0 0 240 588.3 A 280 280 0 0 0 360 597.1 Z";
  var FIELD_RIGHT = "M 360 597.1 A 280 280 0 0 0 360 42.9 A 280 280 0 0 0 240 51.7 L 240 588.3 A 280 280 0 0 0 360 597.1 Z";
  var CXB = 240 + Math.sqrt(R * R - 268.3 * 268.3);   // centre of the body's arc (BODY_PATH), 320.08

  // ---------- easing ----------
  function ss(t, a, b) { var x = (t - a) / (b - a); x = x < 0 ? 0 : x > 1 ? 1 : x; return x * x * (3 - 2 * x); }
  function lerp(a, b, s) { return a + (b - a) * s; }

  // ---------- colour: OKLab blends between palette colours, ends returned verbatim ----------
  function hexToLin(h) {
    var n = parseInt(h.slice(1), 16), c = [(n >> 16) & 255, (n >> 8) & 255, n & 255];
    return c.map(function (v) { v /= 255; return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); });
  }
  function linToHex(c) {
    var s = c.map(function (v) { v = v <= 0.0031308 ? 12.92 * v : 1.055 * Math.pow(v, 1 / 2.4) - 0.055; v = Math.round(Math.min(1, Math.max(0, v)) * 255); return (v < 16 ? "0" : "") + v.toString(16); });
    return ("#" + s.join("")).toUpperCase();
  }
  function linToLab(c) {
    var l = Math.cbrt(0.4122214708 * c[0] + 0.5363325363 * c[1] + 0.0514459929 * c[2]);
    var m = Math.cbrt(0.2119034982 * c[0] + 0.6806995451 * c[1] + 0.1073969566 * c[2]);
    var s = Math.cbrt(0.0883024619 * c[0] + 0.2817188376 * c[1] + 0.6299787005 * c[2]);
    return [0.2104542553 * l + 0.7936177850 * m - 0.0040720468 * s, 1.9779984951 * l - 2.4285922050 * m + 0.4505937099 * s, 0.0259040371 * l + 0.7827717662 * m - 0.8086757660 * s];
  }
  function labToLin(L) {
    var l = L[0] + 0.3963377774 * L[1] + 0.2158037573 * L[2], m = L[0] - 0.1055613458 * L[1] - 0.0638541728 * L[2], s = L[0] - 0.0894841775 * L[1] - 1.2914855480 * L[2];
    l = l * l * l; m = m * m * m; s = s * s * s;
    return [4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s, -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s, -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s];
  }
  var labCache = {};
  function lab(h) { return labCache[h] || (labCache[h] = linToLab(hexToLin(h))); }
  function mix(a, b, u) {
    if (u <= 0) return a; if (u >= 1) return b;
    var A = lab(a), B = lab(b);
    return linToHex(labToLin([A[0] + (B[0] - A[0]) * u, A[1] + (B[1] - A[1]) * u, A[2] + (B[2] - A[2]) * u]));
  }

  // ---------- geometry: sample segment lists into point arrays ----------
  // ops: ["M",x,y] then ["L",n,x,y] | ["C",n,x1,y1,x2,y2,x,y] | ["A",n,r,large,sweep,x,y]
  function arcCentre(x0, y0, r, large, sweep, x1, y1) {
    var mx = (x0 + x1) / 2, my = (y0 + y1) / 2, xp = (x0 - x1) / 2, yp = (y0 - y1) / 2, d2 = xp * xp + yp * yp;
    if (r * r < d2) r = Math.sqrt(d2);
    var k = Math.sqrt(Math.max(0, (r * r - d2) / d2)), sign = (large === sweep) ? -1 : 1;
    return [mx + sign * k * yp, my - sign * k * xp, r];
  }
  function arcPts(x0, y0, r, large, sweep, x1, y1, n, out) {
    var c = arcCentre(x0, y0, r, large, sweep, x1, y1), cx = c[0], cy = c[1]; r = c[2];
    var a0 = Math.atan2(y0 - cy, x0 - cx), a1 = Math.atan2(y1 - cy, x1 - cx), da = a1 - a0;
    if (sweep) { while (da < 0) da += 2 * Math.PI; } else { while (da > 0) da -= 2 * Math.PI; }
    for (var i = 1; i <= n; i++) { var a = a0 + da * i / n; out.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]); }
  }
  function sampleOps(ops) {
    var out = [], x = ops[0][1], y = ops[0][2], i, u;
    out.push([x, y]);
    for (var k = 1; k < ops.length; k++) {
      var o = ops[k], n = o[1];
      if (o[0] === "L") {
        for (i = 1; i <= n; i++) { u = i / n; out.push([lerp(x, o[2], u), lerp(y, o[3], u)]); }
        x = o[2]; y = o[3];
      } else if (o[0] === "C") {
        for (i = 1; i <= n; i++) {
          u = i / n; var v = 1 - u;
          out.push([v * v * v * x + 3 * v * v * u * o[2] + 3 * v * u * u * o[4] + u * u * u * o[6],
                    v * v * v * y + 3 * v * v * u * o[3] + 3 * v * u * u * o[5] + u * u * u * o[7]]);
        }
        x = o[6]; y = o[7];
      } else {
        arcPts(x, y, o[2], o[3], o[4], o[5], o[6], n, out);
        x = o[5]; y = o[6];
      }
    }
    return out;
  }
  function cumFrac(pts) {
    var c = [0];
    for (var i = 1; i < pts.length; i++) c.push(c[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
    var tot = c[c.length - 1];
    return c.map(function (v) { return v / tot; });
  }
  function flat(pts) { var f = new Float64Array(pts.length * 2); for (var i = 0; i < pts.length; i++) { f[2 * i] = pts[i][0]; f[2 * i + 1] = pts[i][1]; } return f; }
  function r2(v) { return Math.round(v * 100) / 100; }
  function pathOf(buf, n) {
    var s = "M" + r2(buf[0]) + " " + r2(buf[1]);
    for (var i = 1; i < n; i++) s += "L" + r2(buf[2 * i]) + " " + r2(buf[2 * i + 1]);
    return s + "Z";
  }
  function fix3(v) { return (Math.round(v * 1000) / 1000) + ""; }
  function ang(x, y) { return Math.atan2(y - CY, x - CX); }

  // ---------- the portrait (t = 0) ----------
  // profile, from the hairline junction H on the forehead down to the neck truncation W
  var H = [346, 158], W = [370, 548], Q = [262, 548], N = [254, 446];
  var PROFILE0 = [
    ["M", H[0], H[1]],
    ["C", 24, 358, 184, 366, 214, 368, 240],      // forehead to the brow
    ["L", 30, 422, 326],                          // Greek nose ridge
    ["C", 8, 427, 334, 422, 343, 413, 343],       // tip
    ["L", 8, 400, 348],                           // under the nose
    ["C", 6, 400, 354, 406, 360, 406, 365],       // philtrum and upper lip
    ["C", 5, 404, 369, 399, 370, 397, 372],       // mouth corner
    ["C", 6, 404, 376, 406, 384, 401, 390],       // lower lip
    ["C", 4, 398, 393, 394, 395, 394, 399],       // chin cleft
    ["C", 18, 404, 412, 414, 432, 406, 448],      // chin
    ["C", 10, 400, 460, 386, 464, 374, 466],      // under the chin
    ["C", 10, 368, 468, 364, 476, 364, 486],      // throat
    ["L", 14, W[0], W[1]]                         // neck
  ];
  // logo profile (LOGO_PATHS), same counts: the lip plane is split in four, the chin arc in two
  function along(a, b, u) { return [lerp(a[0], b[0], u), lerp(a[1], b[1], u)]; }
  var LIP_A = [387, 370], LIP_B = [388.9, 421.9];
  var l1 = along(LIP_A, LIP_B, 6 / 21), l2 = along(LIP_A, LIP_B, 11 / 21), l3 = along(LIP_A, LIP_B, 17 / 21);
  var chinC = arcCentre(388.9, 421.9, 80, 0, 1, 375, 532.4);
  var chA0 = Math.atan2(421.9 - chinC[1], 388.9 - chinC[0]), chA1 = Math.atan2(532.4 - chinC[1], 375 - chinC[0]);
  var chAs = chA0 + (chA1 - chA0) * 0.64, chinS = [chinC[0] + 80 * Math.cos(chAs), chinC[1] + 80 * Math.sin(chAs)];
  var PROFILE1 = [
    ["M", 360, 42.9],
    ["A", 24, 400, 0, 1, 366, 170],
    ["L", 30, 433.2, 315.4],
    ["A", 8, 20, 0, 1, 427.1, 339.7],
    ["L", 8, LIP_A[0], LIP_A[1]],
    ["L", 6, l1[0], l1[1]],
    ["L", 5, l2[0], l2[1]],
    ["L", 6, l3[0], l3[1]],
    ["L", 4, LIP_B[0], LIP_B[1]],
    ["A", 18, 80, 0, 1, chinS[0], chinS[1]],
    ["A", 10, 80, 0, 1, 375, 532.4],
    ["A", 10, 40, 0, 0, 360, 563.7],
    ["L", 14, 360, 597.1]
  ];
  var I_BROW = 24, I_TIP = 62, I_LIP0 = 72, I_LIP1 = 87, I_CHIN = 109, I_THROAT = 125;
  // back of the neck, truncation corner Q up to the nape N (the visible back edge of the face below the hair)
  var NECK0 = [["M", Q[0], Q[1]], ["L", 10, N[0], N[1]]];
  // the hairline, N behind the jaw, over the hair lock that covers the ear, the temple, up to H
  var HAIRLINE0 = [["M", N[0], N[1]],
    ["C", 12, 264, 412, 282, 388, 292, 360],
    ["C", 8, 304, 346, 324, 330, 320, 302],
    ["C", 8, 316, 276, 300, 266, 306, 246],
    ["C", 12, 314, 216, 330, 190, H[0], H[1]]];
  var K_EAR = 12, K_JAW = 6;
  var HL_MID_FROM = 0.30;         // the hairline keeps its drawn shape up to this fraction during the rise
  var BOW0 = 8;                   // the calm hairline of the middle bows out this far at the jaw, straightened by the settle
  // the hair's outer contour, H over the crown and the back of the head, behind the chignon, to N
  var HAIR0 = [["M", H[0], H[1]],
    ["C", 12, 354, 114, 322, 70, 258, 66],
    ["C", 16, 196, 62, 134, 100, 114, 168],
    ["C", 18, 98, 228, 106, 312, 156, 366],
    ["C", 11, 190, 402, 226, 428, N[0], N[1]]];
  var TRUNC0 = [["M", W[0], W[1]], ["C", 14, 336, 560, 292, 560, Q[0], Q[1]]];

  // chignon: a primary bun with one ink coil (1.5 turns) around a lighter centre
  var BUN0 = [152, 312], BUN1 = [150, 330], BUN_R = 58, BUN_CORE = 15;
  function coilPath() {                         // a filled Archimedean band, 1.5 turns, tapering inward
    var o = [], n = 54, a0 = -0.6, k, a, r, w, pts = [];
    for (k = 0; k <= n; k++) { a = a0 + 3 * Math.PI * k / n; r = 46 - 24 * k / n; w = 6 - 2 * k / n; pts.push([a, r, w]); }
    for (k = 0; k <= n; k++) o.push([pts[k][1] + pts[k][2] / 2, pts[k][0]]);
    for (k = n; k >= 0; k--) o.push([pts[k][1] - pts[k][2] / 2, pts[k][0]]);
    return o.map(function (q, i) { return (i ? "L" : "M") + r2(q[0] * Math.cos(q[1])) + " " + r2(q[0] * Math.sin(q[1])); }).join("") + "Z";
  }
  // wave bands: arcs concentric with the chignon
  var WAVE_R = [102, 134, 166, 198], WAVE_A0 = -104 * Math.PI / 180, WAVE_A1 = -6 * Math.PI / 180;
  // laurel: a stem arc on the crown with ten leaves; it slides onto the rim ring
  var LAU0 = { cx: 262, cy: 258, r: 150, a0: -60, a1: -160 }, NST = 25, ST_ANCHOR = 0.32;
  var NLEAF = 10;
  var RING_R0 = 263, RING_W0 = 4;

  window.TheraAnimations = window.TheraAnimations || {};
  window.TheraAnimations["goddess-coin"] = {
    title: "Goddess to the coin mark",
    from: "Classical goddess",
    to: "Goddess on the coin",
    viewBox: "0 0 640 640",
    mount: function (container) {
      var i, j, k;
      var aTop = Math.atan2(51.7 - CY, 240 - CXB), aH = ang(360, 42.9), aW = ang(360, 597.1), aBot = Math.atan2(588.3 - CY, 240 - CXB);
      var aBot2 = aBot - 2 * Math.PI;                         // the hair runs the long way round, over the left
      var aQmid = ang(Q[0], Q[1]), aQ1 = Math.acos((240 - PUSH - CX) / RB);   // neck-back corner on the RB circle
      var JM = [360, 42.9];                                    // where the hairline junction meets the rim (the crescent tip)
      function unwrap(a) { return a > aH + 0.35 ? a - 2 * Math.PI : a; }   // angles on the left run from aH down to aBot2

      // ----- profile -----
      var P0a = sampleOps(PROFILE0), P1a = sampleOps(PROFILE1), NP = P0a.length;
      if (P1a.length !== NP) throw new Error("profile sample mismatch");
      var P0 = flat(P0a), P1 = flat(P1a);
      var wT = new Float64Array(NP), wB = new Float64Array(NP);
      for (i = 0; i < NP; i++) { wT[i] = 1 - ss(i, 2, 22); wB[i] = ss(i, NP - 22, NP - 2); }

      // ----- hair contour (H -> N), polar: start angle/radius, rim angle at mid (rise) and end (slide), clock blend -----
      var hair0a = sampleOps(HAIR0), NHO = hair0a.length, hf = cumFrac(hair0a);
      var hA0 = new Float64Array(NHO), hR0 = new Float64Array(NHO), aMid = new Float64Array(NHO), aEnd = new Float64Array(NHO);
      var cF = new Float64Array(NHO);
      for (j = 0; j < NHO; j++) {
        hA0[j] = unwrap(ang(hair0a[j][0], hair0a[j][1]));
        hR0[j] = Math.hypot(hair0a[j][0] - CX, hair0a[j][1] - CY);
        aMid[j] = aH + (aBot2 - aH) * hf[j];
        aEnd[j] = aTop + (aBot2 - aTop) * hf[j];
        cF[j] = 1 - ss(hf[j], 0.08, 0.50);                    // front + crown: cropped by the rim during the rise; the rest on eH
      }
      var rPow = new Float64Array(NHO);
      for (j = 0; j < NHO; j++) rPow[j] = 1.5 + 0.7 * (1 - cF[j]); // the front reaches the rim a little before the forehead; the back closes its gap early

      // ----- hairline (N -> H): stretched up to the rim during the rise, straightened onto x = 240 during the settle -----
      var hl0a = sampleOps(HAIRLINE0), NHL = hl0a.length, lf = cumFrac(hl0a);
      var hl0 = flat(hl0a), hlMid = new Float64Array(NHL * 2), hlLow = new Float64Array(NHL), hl1 = new Float64Array(NHL * 2), hlJ = new Float64Array(NHL);
      // mid pose (end of the rise): the lower hairline as drawn; from under the ear lock it rises almost straight and near
      // the top runs forward under the rim to the junction, so the hair right of x = 240 is only a thin fringe on the rim
      var KA = 0;
      for (k = 0; k < NHL; k++) if (lf[k] <= HL_MID_FROM) KA = k;
      var hlA = hl0a[KA], hlM = sampleOps([["M", hlA[0], hlA[1]], ["C", 64, hlA[0] - 20, hlA[1] - 150, 292, 52, JM[0], JM[1]]]), hmf = cumFrac(hlM);
      for (k = 0; k < NHL; k++) {
        if (k <= KA) { hlMid[2 * k] = hl0[2 * k]; hlMid[2 * k + 1] = hl0[2 * k + 1]; continue; }
        var sf = (lf[k] - lf[KA]) / (1 - lf[KA]), m = 0;
        while (m < hmf.length - 2 && hmf[m + 1] < sf) m++;
        var fr = (sf - hmf[m]) / ((hmf[m + 1] - hmf[m]) || 1);
        hlMid[2 * k] = lerp(hlM[m][0], hlM[m + 1][0], fr); hlMid[2 * k + 1] = lerp(hlM[m][1], hlM[m + 1][1], fr);
      }
      for (k = 0; k < NHL; k++) {
        hlLow[k] = 1 - ss(lf[k], 0.0, 0.45);                  // the lower hairline settles with the nape (eH), the upper with eS
        hlJ[k] = ss(lf[k], HL_MID_FROM, 1);                    // how much of the junction's slide along the rim a point follows
        hl1[2 * k] = 240; hl1[2 * k + 1] = 588.3 - (588.3 - 51.7) * lf[k];
      }

      // ----- laurel stem: each sample is tied to the hair contour (parameter along it + depth inside it), so it rides
      // the crown out to the rim and never crosses open field -----
      var stU = new Float64Array(NST), stD = new Float64Array(NST);
      for (i = 0; i < NST; i++) {
        var sa = (LAU0.a0 + (LAU0.a1 - LAU0.a0) * i / (NST - 1)) * Math.PI / 180;
        var sx = LAU0.cx + LAU0.r * Math.cos(sa), sy = LAU0.cy + LAU0.r * Math.sin(sa), best = 1e9;
        for (j = 0; j < NHO - 1; j++) {
          var ax_ = hair0a[j][0], ay_ = hair0a[j][1], bx_ = hair0a[j + 1][0], by_ = hair0a[j + 1][1];
          var vx = bx_ - ax_, vy = by_ - ay_, vl = vx * vx + vy * vy, f = Math.max(0, Math.min(1, ((sx - ax_) * vx + (sy - ay_) * vy) / vl));
          var qx_ = ax_ + vx * f, qy_ = ay_ + vy * f, dd = Math.hypot(sx - qx_, sy - qy_);
          if (dd < best) { best = dd; stU[i] = j + f; stD[i] = dd; }
        }
      }
      var bufSt = new Float64Array(NST * 2);

      // ----- neck back, truncation, crown plane thickness -----
      var neck0a = sampleOps(NECK0), NNK = neck0a.length, neck0 = flat(neck0a);   // Q .. N
      var base0a = sampleOps(TRUNC0).slice(1, 14), NBASE = base0a.length, base0 = flat(base0a);
      var NTOP = 12;
      var CR0 = 1, CR1 = 30, NCR = CR1 - CR0 + 1, crTh = new Float64Array(NCR);
      for (j = 0; j < NCR; j++) crTh[j] = 30 * Math.pow(Math.sin(Math.PI * j / (NCR - 1)), 0.7);

      // ----- DOM -----
      var svg = document.createElementNS(NS, "svg");
      svg.setAttribute("viewBox", "0 0 640 640");
      svg.setAttribute("xmlns", NS);
      svg.setAttribute("role", "img");
      svg.setAttribute("aria-label", "A goddess portrait on a coin becoming the thera. mark");
      svg.style.willChange = "transform";
      var bunHtml = '<circle cx="0" cy="0" r="' + BUN_R + '" fill="' + BODY + '"/>' +
        '<circle id="ge-buncore" cx="0" cy="0" r="' + BUN_CORE + '" fill="' + CROWN + '"/>' +
        '<path id="ge-coil" fill="' + INK + '" d="' + coilPath() + '"/>';
      var leafHtml = "";
      for (k = 0; k < NLEAF; k++) leafHtml += '<path id="ge-leaf' + k + '" d="M0 0C6 -6 17 -7 26 0C17 7 6 6 0 0Z"/>';
      svg.innerHTML =
        '<defs>' +
          '<clipPath id="ge-hclip"><path id="ge-hclipp"/></clipPath>' +
          '<clipPath id="ge-fclip"><path id="ge-fclipp"/></clipPath>' +
        '</defs>' +
        '<rect x="0" y="0" width="640" height="640" fill="' + BG + '"/>' +
        '<path id="ge-field" fill="' + CRES + '"/>' +
        '<circle id="ge-ring" cx="' + CX + '" cy="' + CY + '" fill="none" stroke="' + LIGHT + '"/>' +
        '<path id="ge-face"/>' +
        '<g clip-path="url(#ge-fclip)"><path id="ge-shade"/></g>' +
        '<g id="ge-earring" fill="' + BODY + '">' +
          '<circle cx="299" cy="364" r="6"/>' +
          '<path d="M299 372C308 385 310 396 299 405C288 396 290 385 299 372Z"/>' +
          '<path fill="' + LIGHT + '" d="M297 383C294 389 294 394 297 398C299 393 299 388 297 383Z"/>' +
        '</g>' +
        '<path id="ge-body" fill="' + BODY + '"/>' +
        '<g clip-path="url(#ge-hclip)"><path id="ge-waves"/></g>' +
        '<path id="ge-crown" fill="' + CROWN + '"/>' +
        '<g id="ge-bun">' + bunHtml + '</g>' +
        '<g id="ge-laurel" fill="' + LIGHT + '">' +
          '<path id="ge-stem" fill="none" stroke="' + LIGHT + '" stroke-linecap="butt"/>' + leafHtml +
        '</g>' +
        '<g id="ge-eye" fill="' + INK + '">' +
          '<path d="M330 247Q350 231 374 239Q350 238 330 251Z"/>' +
          '<path d="M341 265Q356 253 372 261Q357 272 341 265Z"/>' +
        '</g>' +
        '<path id="ge-nostril" fill="' + LIGHT + '" d="M407 333C399 333 396 340 399 345C402 341 405 339 410 339Z"/>' +
        '<path id="ge-lips"/>';
      container.innerHTML = "";
      container.appendChild(svg);
      function $(id) { return svg.querySelector("#" + id); }
      var el = {
        field: $("ge-field"), body: $("ge-body"), crown: $("ge-crown"), waves: $("ge-waves"), hclip: $("ge-hclipp"), fclip: $("ge-fclipp"),
        bun: $("ge-bun"), laurel: $("ge-laurel"), stem: $("ge-stem"), ring: $("ge-ring"), face: $("ge-face"), shade: $("ge-shade"),
        eye: $("ge-eye"), nostril: $("ge-nostril"), lips: $("ge-lips"), earring: $("ge-earring"), coil: $("ge-coil"), core: $("ge-buncore"), leaves: []
      };
      for (k = 0; k < NLEAF; k++) el.leaves.push($("ge-leaf" + k));

      // ----- buffers -----
      var NHAIR = NHO + NHL, NBAND = NNK + (NHL - 1) + NTOP + NP + NBASE;
      var OFF_HID = NNK, OFF_TOP = NNK + NHL - 1, OFF_FR = OFF_TOP + NTOP, OFF_BASE = OFF_FR + NP;
      var bufHair = new Float64Array(NHAIR * 2), bufBand = new Float64Array(NBAND * 2);
      var bufCr = new Float64Array(NCR * 4), bufLip = new Float64Array((I_LIP1 - I_LIP0 + 1) * 4);
      var last = new Map();
      function put(node, name, value) {
        var c = last.get(node); if (!c) { c = {}; last.set(node, c); }
        if (c[name] !== value) { c[name] = value; node.setAttribute(name, value); }
      }
      function fx(i) { return bufBand[2 * (OFF_FR + i)]; }          // live profile point i
      function fy(i) { return bufBand[2 * (OFF_FR + i) + 1]; }
      function hx(k) { return bufHair[2 * (NHO + k)]; }             // live hairline point k (N = 0 ... H = NHL-1)
      function hy(k) { return bufHair[2 * (NHO + k) + 1]; }
      // the eye, brow and nostril shrink into a point on the live profile and take the crescent colour as they arrive
      function fold(node, kf, ax0, ay0, pIdx, c0, lock) {
        if (kf >= 1 || lock) { put(node, "display", "none"); return; }
        var px = fx(pIdx), py = fy(pIdx), dx = px - P0[2 * pIdx], dy = py - P0[2 * pIdx + 1];
        put(node, "display", "inline");
        put(node, "transform", "translate(" + r2(lerp(ax0 + dx, px - 2, kf)) + " " + r2(lerp(ay0 + dy, py, kf)) + ") scale(" + fix3(1 - kf) + ") translate(" + (-ax0) + " " + (-ay0) + ")");
        put(node, "fill", mix(c0, CRES, ss(kf, 0.45, 1)));
      }

      function set(t) {
        t = t < 0 ? 0 : t > 1 ? 1 : t;
        var eUp = ss(t, 0.04, 0.46);   // rise: junction and forehead to the rim, crown cropped by the rim
        var eJ = ss(t, 0.18, 0.64);    // slide: the junction moves back along the rim, the band's top opens behind it
        var eS = ss(t, 0.34, 0.84);    // settle: hairline onto x = 240
        var e = ss(t, 0.06, 0.90);     // profile
        var eB = ss(t, 0.08, 0.58);    // neck truncation onto the rim
        var eH = ss(t, 0.08, 0.62);    // back of the head and the nape out to the rim
        var faceCol = mix(WHITE, BG, ss(t, 0.30, 0.90));
        // one lock: once every mass has arrived and the face is page coloured, write the exact LOGO_PATHS strings
        var lock = e >= 1 && eS >= 1 && eH >= 1 && eJ >= 1 && eUp >= 1 && eB >= 1 && faceCol === BG;
        var p, x, y, a, w, tx, ty, len, nx, ny, o, r;

        // ----- hair: contour (polar blend onto rim targets) + hairline -----
        for (j = 0; j < NHO; j++) {
          a = aMid[j] + (aEnd[j] - aMid[j]) * eJ;
          w = eUp * cF[j] + eH * (1 - cF[j]);
          a = hA0[j] + (a - hA0[j]) * w; r = R - (R - hR0[j]) * Math.pow(1 - w, rPow[j]);
          bufHair[2 * j] = CX + (CXB - CX) * w + r * Math.cos(a);
          bufHair[2 * j + 1] = CY + r * Math.sin(a);
        }
        // the junction J is contour point 0; the hairline's own formula would put its top at jx, jy, so its upper part
        // is shifted by the difference (weighted along its length) to meet J exactly
        var jx = lerp(lerp(H[0], JM[0], eUp), 240, eS), jy = lerp(lerp(H[1], JM[1], eUp), 51.7, eS);
        var djx = bufHair[0] - jx, djy = bufHair[1] - jy;
        for (k = 0; k < NHL; k++) {
          x = hl0[2 * k] + (hlMid[2 * k] - hl0[2 * k]) * eUp; y = hl0[2 * k + 1] + (hlMid[2 * k + 1] - hl0[2 * k + 1]) * eUp;
          p = eS + (eH - eS) * hlLow[k];
          bufHair[2 * (NHO + k)] = x + (hl1[2 * k] - x) * p + djx * hlJ[k];
          bufHair[2 * (NHO + k) + 1] = y + (hl1[2 * k + 1] - y) * p + djy * hlJ[k];
        }
        // the hairline's ends are the contour's ends (nape N, junction J)
        bufHair[2 * NHO] = bufHair[2 * (NHO - 1)]; bufHair[2 * NHO + 1] = bufHair[2 * (NHO - 1) + 1];
        bufHair[2 * (NHAIR - 1)] = bufHair[0]; bufHair[2 * (NHAIR - 1) + 1] = bufHair[1];
        // middle: the ear lock and the S of the drawn hairline relax into one calm curve from N to J, a cubic that rises
        // from the nape (bowing out by BOW0 * (1 - eS) at the jaw) and runs into J along the rim, so the hair right of
        // x = 240 is a thin fringe under the rim that shortens as J slides back; once J is at the body's corner and eS = 1
        // it is the straight edge x = 240, point for point
        var wSm = ss(t, 0.18, 0.44);
        if (wSm > 0) {
          var bnx = bufHair[2 * NHO], bny = bufHair[2 * NHO + 1], bjx = bufHair[0], bjy = bufHair[1];
          var aj = ang(bjx, bjy), l2 = 0.9 * Math.max(0, bjx - 240), pin = l2 * l2 / (2 * R) + 6 * ss(l2, 0, 20);
          var c1x = bnx + BOW0 * (1 - eS), c1y = bny + (bjy - bny) * 0.4;
          var c2x = bjx + Math.sin(aj) * l2 - Math.cos(aj) * pin, c2y = bjy - Math.cos(aj) * l2 - Math.sin(aj) * pin;
          var sq = 1 - eS * eS * eS;                   // spacing: the cubic's parameter spacing hands over to hl1's
          for (k = 1; k < NHL - 1; k++) {
            var bu = lf[k], bv = 1 - bu;
            var sx_ = bv * bv * bv * bnx + 3 * bv * bv * bu * c1x + 3 * bv * bu * bu * c2x + bu * bu * bu * bjx;
            var sy_ = bv * bv * bv * bny + 3 * bv * bv * bu * c1y + 3 * bv * bu * bu * c2y + bu * bu * bu * bjy;
            sy_ = hl1[2 * k + 1] + (sy_ - hl1[2 * k + 1]) * (sq + (1 - sq) * Math.min(1, Math.abs(sx_ - 240) / 2));
            o = 2 * (NHO + k);
            bufHair[o] += (sx_ - bufHair[o]) * wSm;
            bufHair[o + 1] += (sy_ - bufHair[o + 1]) * wSm;
          }
        }
        // once the whole contour is on the rim it is written as one arc on the body's circle; once every hair clock is
        // done the hair is exactly the body segment and BODY_PATH itself is written
        var onRim = eUp >= 1 && eH >= 1, settled = onRim && eJ >= 1 && eS >= 1;
        var hairD;
        if (settled || lock) hairD = BODY_PATH;
        else if (onRim) {
          hairD = "M" + r2(bufHair[0]) + " " + r2(bufHair[1]) + "A280 280 0 0 0 " + r2(bufHair[2 * (NHO - 1)]) + " " + r2(bufHair[2 * (NHO - 1) + 1]);
          for (k = 1; k < NHL - 1; k++) hairD += "L" + r2(bufHair[2 * (NHO + k)]) + " " + r2(bufHair[2 * (NHO + k) + 1]);
          hairD += "Z";
        } else hairD = pathOf(bufHair, NHAIR);
        put(el.body, "d", hairD);
        put(el.hclip, "d", hairD);
        var Nx = bufHair[2 * (NHO - 1)], Ny = bufHair[2 * (NHO - 1) + 1];

        // ----- face band: neck back (Q -> N), hidden back edge under the hairline (N -> J), top, profile, base -----
        var aQ = aQmid + (aQ1 - aQmid) * eS;
        var Qx = Q[0] + (CX + RB * Math.cos(aQ) - Q[0]) * eB, Qy = Q[1] + (CY + RB * Math.sin(aQ) - Q[1]) * eB;
        for (k = 0; k < NNK; k++) {
          var u = k / (NNK - 1);
          bufBand[2 * k] = neck0[2 * k] + (Qx - Q[0]) * (1 - u) + (Nx - N[0]) * u;
          bufBand[2 * k + 1] = neck0[2 * k + 1] + (Qy - Q[1]) * (1 - u) + (Ny - N[1]) * u;
        }
        for (k = 1; k < NHL; k++) {                       // offset to the left of the hairline (into the hair)
          var ka = k - 1, kb = k < NHL - 1 ? k + 1 : k;
          tx = hx(kb) - hx(ka); ty = hy(kb) - hy(ka); len = Math.hypot(tx, ty) || 1;
          var d = PUSH * ss(k, 0, 4) * ss(NHL - 1 - k, 0, 6);
          o = OFF_HID + k - 1;
          bufBand[2 * o] = hx(k) + ty / len * d; bufBand[2 * o + 1] = hy(k) - tx / len * d;
        }
        for (i = 0; i < NP; i++) {
          p = e + (eUp - e) * wT[i] + (eB - e) * wB[i];
          o = OFF_FR + i;
          bufBand[2 * o] = P0[2 * i] + (P1[2 * i] - P0[2 * i]) * p;
          bufBand[2 * o + 1] = P0[2 * i + 1] + (P1[2 * i + 1] - P0[2 * i + 1]) * p;
        }
        // top: polar from the hidden back edge to the forehead, pushed onto the RB circle as both reach the rim, so it
        // follows the rim behind the sliding junction and never cuts a chord inside the disc
        var Jbx = bufBand[2 * (OFF_TOP - 1)], Jby = bufBand[2 * (OFF_TOP - 1) + 1], Fx = fx(0), Fy = fy(0);
        var aJb = ang(Jbx, Jby), aF = ang(Fx, Fy), rJb = Math.hypot(Jbx - CX, Jby - CY), rF = Math.hypot(Fx - CX, Fy - CY);
        for (k = 0; k < NTOP; k++) {
          var ut = (k + 1) / (NTOP + 1), at = aJb + (aF - aJb) * ut, rt = lerp(rJb, rF, ut);
          rt += (RB - rt) * ss(rt, R - 12, R);
          o = OFF_TOP + k;
          bufBand[2 * o] = CX + rt * Math.cos(at);
          bufBand[2 * o + 1] = CY + rt * Math.sin(at);
        }
        // base: the neck truncation drops onto the RB arc
        for (k = 0; k < NBASE; k++) {
          var ub = (k + 1) / (NBASE + 1), ab = aW + (aQ - aW) * ub;
          o = OFF_BASE + k;
          bufBand[2 * o] = base0[2 * k] + (CX + RB * Math.cos(ab) - base0[2 * k]) * eB;
          bufBand[2 * o + 1] = base0[2 * k + 1] + (CY + RB * Math.sin(ab) - base0[2 * k + 1]) * eB;
        }
        var bandD = pathOf(bufBand, NBAND);
        if (lock) { put(el.face, "d", ""); put(el.field, "d", CRES_PATH); put(el.fclip, "d", ""); }
        else { put(el.face, "d", bandD); put(el.field, "d", onRim && eJ >= 1 ? FIELD_RIGHT : FIELD_DISC); put(el.fclip, "d", bandD); }
        put(el.face, "fill", faceCol);

        // ----- crown plane: a crescent highlight inside the crown contour that thins out onto the rim -----
        var kCr = ss(t, 0.14, 0.60);
        if (kCr < 1 && !lock) {
          for (j = 0; j < NCR; j++) {
            var jj = CR0 + j;
            tx = bufHair[2 * (jj + 1)] - bufHair[2 * (jj - 1)]; ty = bufHair[2 * (jj + 1) + 1] - bufHair[2 * (jj - 1) + 1]; len = Math.hypot(tx, ty) || 1;
            nx = ty / len; ny = -tx / len;                // left of travel = into the hair
            var th = crTh[j] * (1 - kCr);
            bufCr[2 * j] = bufHair[2 * jj]; bufCr[2 * j + 1] = bufHair[2 * jj + 1];
            o = 2 * (2 * NCR - 1 - j);
            bufCr[o] = bufHair[2 * jj] + nx * th; bufCr[o + 1] = bufHair[2 * jj + 1] + ny * th;
          }
          put(el.crown, "d", pathOf(bufCr, 2 * NCR));
        } else put(el.crown, "d", "");

        // ----- chignon: closes in toward the body and takes its colour -----
        var kBun = ss(t, 0.20, 0.56), kBunC = ss(t, 0.20, 0.48);
        var bcx = lerp(BUN0[0], BUN1[0], kBun), bcy = lerp(BUN0[1], BUN1[1], kBun);
        if (kBun < 1 && !lock) {
          put(el.bun, "transform", "translate(" + r2(bcx) + " " + r2(bcy) + ") scale(" + fix3(1 - kBun) + ")");
          put(el.bun, "display", "inline");
          put(el.coil, "fill", mix(INK, BODY, kBunC));
          put(el.core, "fill", mix(CROWN, BODY, kBunC));
        } else put(el.bun, "display", "none");

        // ----- wave bands: arcs concentric with the chignon, thinning into the hair -----
        var kWv = ss(t, 0.16, 0.54);
        if (kWv < 1 && !lock) {
          var ww = 6 * (1 - kWv), wd = "";
          var ca0 = Math.cos(WAVE_A0), sa0 = Math.sin(WAVE_A0), ca1 = Math.cos(WAVE_A1), sa1 = Math.sin(WAVE_A1);
          for (k = 0; k < WAVE_R.length; k++) {
            var rr = WAVE_R[k] * (1 - 0.2 * kWv), ro = rr + ww / 2, ri = rr - ww / 2;
            wd += "M" + r2(bcx + ro * ca0) + " " + r2(bcy + ro * sa0) + "A" + r2(ro) + " " + r2(ro) + " 0 0 1 " + r2(bcx + ro * ca1) + " " + r2(bcy + ro * sa1) +
                  "L" + r2(bcx + ri * ca1) + " " + r2(bcy + ri * sa1) + "A" + r2(ri) + " " + r2(ri) + " 0 0 0 " + r2(bcx + ri * ca0) + " " + r2(bcy + ri * sa0) + "Z";
          }
          put(el.waves, "d", wd);
          put(el.waves, "fill", mix(WAVE, BODY, ss(t, 0.30, 0.54)));
        } else put(el.waves, "d", "");

        // ----- rim ring: widens out to the disc edge and thins away there -----
        var ringW = RING_W0 * (1 - ss(t, 0.46, 0.76));
        var ringR = Math.min(lerp(RING_R0, R, ss(t, 0.28, 0.60)), R - ringW / 2);   // stays under the hair's edge on the left
        if (ringW > 0.01 && !lock) {
          put(el.ring, "r", fix3(ringR));
          put(el.ring, "stroke-width", fix3(ringW));
          put(el.ring, "display", "inline");
        } else put(el.ring, "display", "none");

        // ----- laurel: the stem rides the crown out to the rim (the ring's place) and shortens there as a thin arc;
        // the leaves fold flat onto it on the way -----
        var eL = ss(t, 0.10, 0.34), kLf = ss(t, 0.10, 0.30), shrink = ss(t, 0.20, 0.40);
        if (shrink < 1 && !lock) {
          var stW = lerp(3.5, 2, eL);
          for (i = 0; i < NST; i++) {
            var ju = Math.floor(stU[i]), jf = stU[i] - ju, j0 = Math.max(0, ju - 1), j1 = Math.min(NHO - 1, ju + 2);
            var px_ = lerp(bufHair[2 * ju], bufHair[2 * ju + 2], jf), py_ = lerp(bufHair[2 * ju + 1], bufHair[2 * ju + 3], jf);
            tx = bufHair[2 * j1] - bufHair[2 * j0]; ty = bufHair[2 * j1 + 1] - bufHair[2 * j0 + 1]; len = Math.hypot(tx, ty) || 1;
            var dep = lerp(stD[i], stW / 2, eL);
            bufSt[2 * i] = px_ + ty / len * dep; bufSt[2 * i + 1] = py_ - tx / len * dep;
          }
          var sA = ST_ANCHOR * (NST - 1) * shrink, sB = (NST - 1) + (ST_ANCHOR * (NST - 1) - (NST - 1)) * shrink;
          function stAt(s, out) { var i0 = Math.min(NST - 2, Math.floor(s)), f = s - i0; out[0] = lerp(bufSt[2 * i0], bufSt[2 * i0 + 2], f); out[1] = lerp(bufSt[2 * i0 + 1], bufSt[2 * i0 + 3], f); return out; }
          var q0 = stAt(sA, [0, 0]), sd = "M" + r2(q0[0]) + " " + r2(q0[1]);
          for (i = Math.ceil(sA + 1e-6); i < sB; i++) sd += "L" + r2(bufSt[2 * i]) + " " + r2(bufSt[2 * i + 1]);
          q0 = stAt(sB, q0); sd += "L" + r2(q0[0]) + " " + r2(q0[1]);
          put(el.stem, "d", sd);
          put(el.stem, "stroke-width", fix3(stW));
          put(el.laurel, "display", "inline");
          for (k = 0; k < NLEAF; k++) {
            var leaf = el.leaves[k];
            if (kLf >= 1) { put(leaf, "display", "none"); continue; }
            put(leaf, "display", "inline");
            var sl = sA + (sB - sA) * (k + 0.5) / NLEAF, side = k % 2 ? -1 : 1, la = stAt(sl, [0, 0]), lb = stAt(Math.min(NST - 1, sl + 0.5), [0, 0]), lc = stAt(Math.max(0, sl - 0.5), [0, 0]);
            var rot = Math.atan2(lb[1] - lc[1], lb[0] - lc[0]) * 180 / Math.PI + side * 36 * (1 - kLf);
            put(leaf, "transform", "translate(" + r2(la[0]) + " " + r2(la[1]) + ") rotate(" + r2(rot) + ") scale(" + fix3(1 - kLf * kLf) + " " + fix3(1 - kLf) + ")");
          }
        } else put(el.laurel, "display", "none");

        // ----- neck plane under the jaw line: rides the face, brightens into it -----
        var kSh = ss(t, 0.18, 0.48);
        if (kSh < 1 && !lock) {
          var ax = fx(I_CHIN) + 8, ay = fy(I_CHIN) - 2, ex = hx(K_EAR) - 10, ey = hy(K_EAR) + 4;
          var gx = hx(0) - 30, gy = 640, zx = fx(I_THROAT) + 30, zy = 640;   // the whole neck below the jaw (clipped to the face)
          var qx = (ax + ex) / 2 - 4, qy = (ay + ey) / 2 + 26 * (1 - kSh);
          put(el.shade, "d", "M" + r2(ax) + " " + r2(ay) + "Q" + r2(qx) + " " + r2(qy) + " " + r2(ex) + " " + r2(ey) + "L" + r2(gx) + " " + r2(gy) + "L" + r2(zx) + " " + r2(zy) + "Z");
          put(el.shade, "fill", mix(SURF, faceCol, kSh));
        } else put(el.shade, "d", "");

        // ----- eye + brow, nostril: ride the face, shrink into the profile line (no opacity fade) -----
        fold(el.eye, ss(t, 0.22, 0.50), 354, 254, I_BROW, INK, lock);
        fold(el.nostril, ss(t, 0.18, 0.46), 404, 339, I_TIP, LIGHT, lock);

        // ----- lips: front edge is the live profile, the back edge flattens onto it; they take the crescent colour -----
        var kLip = ss(t, 0.26, 0.58);
        if (kLip < 1 && !lock) {
          var NL = I_LIP1 - I_LIP0 + 1;
          for (j = 0; j < NL; j++) {
            var pi = I_LIP0 + j, dpt = 12 * Math.pow(Math.sin(Math.PI * j / (NL - 1)), 0.7) * (1 - kLip);
            bufLip[2 * j] = fx(pi); bufLip[2 * j + 1] = fy(pi);
            o = 2 * (2 * NL - 1 - j);
            bufLip[o] = fx(pi) - dpt; bufLip[o + 1] = fy(pi);
          }
          put(el.lips, "d", pathOf(bufLip, 2 * NL));
          put(el.lips, "fill", mix(LIGHT, CRES, kLip));
        } else put(el.lips, "d", "");

        // ----- earring: rides the hairline, slides back under the hair -----
        var kE = ss(t, 0.16, 0.50);
        if (kE < 1 && !lock) {
          var edx = hx(K_EAR) - hl0[2 * K_EAR] - 44 * kE, edy = hy(K_EAR) - hl0[2 * K_EAR + 1] + 4 * kE;
          put(el.earring, "display", "inline");
          put(el.earring, "transform", "translate(" + r2(299 + edx) + " " + r2(364 + edy) + ") scale(" + fix3(1 - 0.6 * kE) + ") translate(-299 -364)");
        } else put(el.earring, "display", "none");
      }

      return {
        set: set,
        destroy: function () { last.clear(); container.innerHTML = ""; }
      };
    }
  };
})();
