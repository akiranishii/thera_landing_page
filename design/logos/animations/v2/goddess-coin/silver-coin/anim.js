// thera. logo animation v2 — track "goddess-coin", approach "silver-coin".
//
// t = 0  The silver coin of Thera, struck in Blue Haze: a #466680 rim with a row of #C4D5E0 beads, a #8DA8BB
//        field, the goddess head in flat low relief looking right (#466680 hair with #6A879D wave planes, a
//        #C4D5E0 stephane and a round chignon; a white face plane with a #EAF0F4 neck plane; eye, brow, ear and
//        earring in the same blues), the legend ΘΗΡΑ in #F7F9FA along the left rim, and two geometric dolphins
//        (the badge of archaic Theran staters) in the field in front of her face.
// t = 1  The two-tone "Goddess on the coin" mark (LOGO_PATHS.md): body #466680, crescent #8DA8BB, light band of
//        the profile in the page colour.
//
// Morph (all paths are matched point lists, lerped point for point; no flubber):
//   face plane -> the light band. Its front is the profile (hand-matched to the logo profile), its back edge
//                 (hairline, ear, nape, neck) straightens into the cut at x = 240, its top and its neck truncation
//                 grow out to the rim. White settles into the page colour.
//   field      -> the crescent. The field in front of her face keeps its colour; its inner edge is the profile
//                 (tucked under the face), its outer edge sinks the rim on the right (r 250 -> 280).
//   hair       -> the coin body. The hair mass swells out to the rim (radially, from the ear) and fuses with the
//                 rim, which is the same blue; the field behind the head disappears under it.
//   rim        -> body on the left, gone under the crescent on the right, under the band at top and bottom.
//   beads      -> shrink and sink into the rim edge (0.08 - 0.40).
//   ΘΗΡΑ       -> each letter slides out under the rim (clipped at the field's edge) and takes the field's blue
//                 as it goes, staggered (0.05 - 0.40).
//   dolphins   -> swim out into the rim on the crescent side, slipping under it while they take the crescent's
//                 blue (0.02 - 0.40).
//   relief     -> wave planes, stephane, chignon coil, neck plane, ear, eye, brow, nostril and mouth flatten into
//                 their masses' colours by 0.44; the features ride with the profile and the ear with the hairline
//                 (clipped to the face plane).
// From t = 0.96 the exact LOGO_PATHS strings and fills are written; everything else is hidden.
// set(t) is stateless: everything is precomputed in mount; set() fills preallocated buffers and writes attributes
// through a cache.
(function () {
  "use strict";
  var NS = "http://www.w3.org/2000/svg";
  var CX = 320, CY = 320, R = 280;
  var RF = 250;          // the field's radius inside the rim at t = 0
  var RB = R + 0.5;      // the band's arcs sit half a unit outside the rim (page colour on page colour)
  var RH = 276;          // the hair's final outer radius: inside the rim, which is the same blue
  var HX = 243;          // the hair's final inner edge, under the band
  var CHORD = 240.6;     // the body's hidden right arc folds onto this chord, under the band
  var OFFX = 6;          // the field's inner edge tucks this far under the face
  var PUSH = 3;          // the hair's inner edge tucks this far under the face
  var EXACT_T = 0.96;
  var BG = "#F7F9FA", BODY = "#466680", CRES = "#8DA8BB";
  var FACE = "#FFFFFF", SHADE = "#EAF0F4", HI = "#6A879D", LIGHT = "#C4D5E0", LINE = "#DDE6EC";
  var BODY_PATH = "M 240 51.7 A 280 280 0 0 0 240 588.3 Z";
  var CRES_PATH = "M 360 597.1 A 280 280 0 0 0 360 42.9 A 400 400 0 0 1 366 170 L 433.2 315.4 A 20 20 0 0 1 427.1 339.7 L 387 370 L 388.9 421.9 A 80 80 0 0 1 375 532.4 A 40 40 0 0 0 360 563.7 L 360 597.1 Z";
  var DISC_PATH = "M 40 320 A 280 280 0 1 0 600 320 A 280 280 0 1 0 40 320 Z";

  // ---------- easing ----------
  function ss(t, a, b) { var x = (t - a) / (b - a); x = x < 0 ? 0 : x > 1 ? 1 : x; return x * x * (3 - 2 * x); }
  function lerp(a, b, s) { return a + (b - a) * s; }

  // ---------- colour: OKLab blends, ends returned verbatim ----------
  function hexToLab(h) {
    var n = parseInt(h.slice(1), 16), c = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map(function (v) {
      v /= 255; return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    var l = Math.cbrt(0.4122214708 * c[0] + 0.5363325363 * c[1] + 0.0514459929 * c[2]);
    var m = Math.cbrt(0.2119034982 * c[0] + 0.6806995451 * c[1] + 0.1073969566 * c[2]);
    var s = Math.cbrt(0.0883024619 * c[0] + 0.2817188376 * c[1] + 0.6299787005 * c[2]);
    return [0.2104542553 * l + 0.7936177850 * m - 0.0040720468 * s,
            1.9779984951 * l - 2.4285922050 * m + 0.4505937099 * s,
            0.0259040371 * l + 0.7827717662 * m - 0.8086757660 * s];
  }
  var HEX2 = [];
  for (var hx = 0; hx < 256; hx++) HEX2.push((hx < 16 ? "0" : "") + hx.toString(16).toUpperCase());
  function gam(v) { v = v < 0 ? 0 : v > 1 ? 1 : v; return Math.round((v <= 0.0031308 ? 12.92 * v : 1.055 * Math.pow(v, 1 / 2.4) - 0.055) * 255); }
  function labToHex(L, A, B) {
    var l = L + 0.3963377774 * A + 0.2158037573 * B, m = L - 0.1055613458 * A - 0.0638541728 * B, s = L - 0.0894841775 * A - 1.2914855480 * B;
    l = l * l * l; m = m * m * m; s = s * s * s;
    return "#" + HEX2[gam(4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s)] +
      HEX2[gam(-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s)] +
      HEX2[gam(-0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s)];
  }
  var labCache = {};
  function lab(h) { return labCache[h] || (labCache[h] = hexToLab(h)); }
  function mix(a, b, u) {
    if (u <= 0) return a; if (u >= 1) return b;
    var A = lab(a), B = lab(b);
    return labToHex(A[0] + (B[0] - A[0]) * u, A[1] + (B[1] - A[1]) * u, A[2] + (B[2] - A[2]) * u);
  }

  // ---------- geometry: sample segment lists into point arrays ----------
  // ops: ["M",x,y] then ["L",n,x,y] | ["C",n,x1,y1,x2,y2,x,y] | ["A",n,r,large,sweep,x,y]
  function arcPts(x0, y0, r, large, sweep, x1, y1, n, out) {
    var mx = (x0 + x1) / 2, my = (y0 + y1) / 2, xp = (x0 - x1) / 2, yp = (y0 - y1) / 2, d2 = xp * xp + yp * yp;
    if (r * r < d2) r = Math.sqrt(d2);
    var k = Math.sqrt(Math.max(0, (r * r - d2) / d2)), sign = (large === sweep) ? -1 : 1;
    var cx = mx + sign * k * yp, cy = my - sign * k * xp;
    var a0 = Math.atan2(y0 - cy, x0 - cx), a1 = Math.atan2(y1 - cy, x1 - cx), da = a1 - a0;
    if (sweep) { while (da < 0) da += 2 * Math.PI; } else { while (da > 0) da -= 2 * Math.PI; }
    for (var i = 1; i <= n; i++) { var a = a0 + da * i / n; out.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]); }
  }
  function sampleOps(ops) {
    var out = [], x = ops[0][1], y = ops[0][2];
    out.push([x, y]);
    for (var k = 1; k < ops.length; k++) {
      var o = ops[k], n = o[1], i, u;
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
      } else if (o[0] === "A") {
        arcPts(x, y, o[2], o[3], o[4], o[5], o[6], n, out);
        x = o[5]; y = o[6];
      }
    }
    return out;
  }
  function ringPts(a0, a1, r, n, includeStart) {
    var out = [], i0 = includeStart ? 0 : 1, N = includeStart ? n - 1 : n;
    for (var i = i0; i <= N; i++) { var a = a0 + (a1 - a0) * i / N; out.push([CX + r * Math.cos(a), CY + r * Math.sin(a)]); }
    return out;
  }
  function flat(pts) { var f = new Float64Array(pts.length * 2); for (var i = 0; i < pts.length; i++) { f[2 * i] = pts[i][0]; f[2 * i + 1] = pts[i][1]; } return f; }
  function r2(v) { return Math.round(v * 100) / 100; }
  function pathOf(buf, n) {
    var s = "M" + r2(buf[0]) + " " + r2(buf[1]);
    for (var i = 1; i < n; i++) s += "L" + r2(buf[2 * i]) + " " + r2(buf[2 * i + 1]);
    return s + "Z";
  }
  function linesOf(buf, i0, n) {
    var s = "";
    for (var i = i0; i < i0 + n; i++) s += "L" + r2(buf[2 * i]) + " " + r2(buf[2 * i + 1]);
    return s;
  }
  function linesOfIdx(buf, idx) {
    var s = "";
    for (var k = 0; k < idx.length; k++) s += "L" + r2(buf[2 * idx[k]]) + " " + r2(buf[2 * idx[k] + 1]);
    return s;
  }
  function P(x, y) { return r2(x) + " " + r2(y); }
  // crescent between two arcs from A to B, both bulging to the same side (rO < rI: the outer arc bulges more)
  function crescent(ax, ay, bx, by, rO, rI, sweep) {
    return "M" + P(ax, ay) + "A" + rO + " " + rO + " 0 0 " + sweep + " " + P(bx, by) +
      "A" + rI + " " + rI + " 0 0 " + (1 - sweep) + " " + P(ax, ay) + "Z";
  }

  // ---------- the profile: hairline H down to the neck truncation W (matched to the logo profile) ----------
  var H = [350, 196], W = [368, 548], N = [252, 445], Q = [258, 548];
  var PROFILE0 = [
    ["M", H[0], H[1]],
    ["C", 24, 362, 216, 368, 242, 365, 262],          // forehead to brow
    ["C", 30, 362, 281, 393, 303, 420, 334],          // bridge, then the straight Greek nose
    ["A", 8, 8, 0, 1, 416, 347],                      // round tip
    ["L", 8, 388, 362],                               // underside to the nostril base
    ["C", 6, 389, 369, 395, 374, 396, 381],           // philtrum and upper lip
    ["C", 5, 397, 386, 390, 389, 387, 391],           // mouth corner
    ["C", 6, 395, 394, 398, 402, 393, 407],           // lower lip
    ["C", 4, 391, 410, 388, 411, 387, 412],           // into the chin cleft
    ["C", 28, 397, 420, 399, 452, 381, 468],          // chin
    ["C", 10, 371, 474, 364, 478, 362, 486],          // throat
    ["L", 14, W[0], W[1]]                             // neck to the truncation
  ];
  function along(ax, ay, bx, by, u) { return [lerp(ax, bx, u), lerp(ay, by, u)]; }
  var l1 = along(387, 370, 388.9, 421.9, 6 / 21), l2 = along(387, 370, 388.9, 421.9, 11 / 21), l3 = along(387, 370, 388.9, 421.9, 17 / 21);
  var PROFILE1 = [
    ["M", 360, 42.9],
    ["A", 24, 400, 0, 1, 366, 170],
    ["L", 30, 433.2, 315.4],
    ["A", 8, 20, 0, 1, 427.1, 339.7],
    ["L", 8, 387, 370],
    ["L", 6, l1[0], l1[1]],
    ["L", 5, l2[0], l2[1]],
    ["L", 6, l3[0], l3[1]],
    ["L", 4, 388.9, 421.9],
    ["A", 28, 80, 0, 1, 375, 532.4],
    ["A", 10, 40, 0, 0, 360, 563.7],
    ["L", 14, 360, 597.1]
  ];
  // the face plane's back edge: neck (Q -> N), up behind the ear, the temple above it, the fringe to H
  var BACK0 = [["M", Q[0], Q[1]], ["L", 12, N[0], N[1]],
    ["C", 12, 258, 402, 274, 356, 282, 318],
    ["C", 12, 288, 284, 290, 252, 310, 232],
    ["C", 12, 324, 222, 338, 206, H[0], H[1]]];
  var BASE0 = [["M", W[0], W[1]], ["C", 12, 340, 560, 290, 562, Q[0], Q[1]]];   // the neck truncation, a shallow curve
  // the hair's outer contour, H over the crown and round the back of the head to the nape N
  var HAIR0 = [["M", H[0], H[1]],
    ["C", 8, 346, 174, 340, 146, 316, 126],
    ["C", 8, 292, 106, 244, 100, 208, 124],
    ["C", 8, 176, 146, 164, 204, 174, 262],
    ["C", 10, 182, 318, 214, 402, N[0], N[1]]];
  var HAIR_C0 = [262, 300];   // the hair swells out radially from here (near the ear)
  var BUN = [186, 332, 50];

  // ---------- dolphins (local frame: heading +x, about 120 long) ----------
  var DOLPHIN = "M-50 12C-36 -6 -14 -17 8 -18C22 -19 32 -15 38 -10C42 -6 48 -4 61 -3C58 1 50 3 41 3C30 8 14 10 -2 9C-20 8 -36 12 -48 19Z" +
    "M-40 15C-48 21 -56 27 -64 34C-64 25 -61 18 -57 13C-61 8 -63 2 -62 -8C-57 0 -50 6 -40 10Z" +          // forked tail
    "M-16 -12C-15 -21 -16 -28 -20 -36C-8 -32 0 -24 6 -14Z" +                                              // dorsal fin
    "M22 5C18 12 12 18 3 22C6 15 8 10 8 5Z";                                                              // flipper (all clockwise)
  // start centre, heading (deg), travel; they swim out along a gentle curve and slip under the rim
  var DOLPHINS = [
    { x: 470, y: 224, a: -38, turn: 10, d: 176, s: 0.88, k0: 0.02, k1: 0.36 },
    { x: 480, y: 428, a: 36, turn: -10, d: 176, s: 0.84, k0: 0.06, k1: 0.40 }
  ];

  // ---------- legend ΘΗΡΑ (monoline, cap height 36) ----------
  var LETTERS = [
    "M0 -18A13 18 0 1 1 0 18A13 18 0 1 1 0 -18ZM-6 0L6 0",
    "M-11 -18L-11 18M11 -18L11 18M-11 0L11 0",
    "M-10 18L-10 -18L2 -18A9.5 9.5 0 0 1 2 1L-10 1",
    "M-12 18L0 -18L12 18M-6.4 3L6.4 3"
  ];
  var LETTER_ANG = [250, 263, 276, 289];   // degrees clockwise from 12 o'clock: up the left rim, tops outward
  var LETTER_R = 222;

  window.TheraAnimations = window.TheraAnimations || {};
  window.TheraAnimations["goddess-coin"] = {
    title: "Goddess to the coin mark",
    from: "Silver coin of Thera",
    to: "Goddess on the coin",
    viewBox: "0 0 640 640",
    mount: function (container) {
      var i, j, k;
      // ----- profile with per-point clocks: the top leads with the band's top, the bottom with its base -----
      var P0a = sampleOps(PROFILE0), P1a = sampleOps(PROFILE1), NP = P0a.length;
      var P0 = flat(P0a), P1 = flat(P1a);
      var wT = new Float64Array(NP), wB = new Float64Array(NP), pc = new Float64Array(NP);
      for (i = 0; i < NP; i++) { wT[i] = 1 - ss(i, 5, 16); wB[i] = ss(i, NP - 16, NP - 5); }

      // ----- band (face plane): back (Q -> H), top (H -> rim), front (profile), base (W -> Q) -----
      var aTop = Math.atan2(51.7 - CY, 240 - CX), aH = Math.atan2(42.9 - CY, 360 - CX), aW = -aH, aBot = -aTop;
      var back0a = sampleOps(BACK0), NBK = back0a.length;                 // 49
      var back1a = sampleOps([["M", 240, 588.3], ["L", NBK - 1, 240, 51.7]]);
      var NTOP = 12;
      var top0a = [], base0a = sampleOps(BASE0).slice(1);
      for (i = 0; i < NTOP; i++) top0a.push([H[0], H[1]]);
      var top1a = ringPts(aTop, aH, RB, NTOP, false);
      var base1a = ringPts(aW, aBot, RB, NTOP, false);
      var band0 = flat(back0a.concat(top0a, P0a, base0a)), band1 = flat(back1a.concat(top1a, P1a, base1a));
      var NBAND = band0.length / 2, NFR = NBK + NTOP;
      var bandL = new Float64Array(NBK);
      for (k = 0; k < NBK; k++) bandL[k] = ss(k, 26, NBK - 1);
      var EAR_IDX = 26;                                                    // back-edge point the ear rides on

      // ----- hair: outer contour (H -> N), a tail down the neck (N -> Q), and the inner edge under the band -----
      var hair0a = sampleOps(HAIR0), NHO = hair0a.length;                // 35
      var hair0 = flat(hair0a), hairT = new Float64Array(NHO * 2), wHF = new Float64Array(NHO);
      var aEnd = Math.acos((HX - CX) / RH);                                 // bottom end of the hair arc, on x = HX
      var aEndTop = 2 * Math.PI - Math.acos((354 - CX) / RH);               // top end: x = 354, under the band (a cap over it)
      for (j = 0; j < NHO; j++) {
        var dx0 = hair0a[j][0] - HAIR_C0[0], dy0 = hair0a[j][1] - HAIR_C0[1], dl = Math.hypot(dx0, dy0);
        dx0 /= dl; dy0 /= dl;
        var fx = HAIR_C0[0] - CX, fy = HAIR_C0[1] - CY, fd = fx * dx0 + fy * dy0;
        var sR = -fd + Math.sqrt(fd * fd - (fx * fx + fy * fy) + RH * RH);
        var ang = Math.atan2(HAIR_C0[1] + sR * dy0 - CY, HAIR_C0[0] + sR * dx0 - CX);
        if (ang < 0) ang += 2 * Math.PI;
        if (ang < aEnd || ang > aEndTop) ang = (ang < Math.PI) ? aEnd : aEndTop;   // clamp to an end
        hairT[2 * j] = CX + RH * Math.cos(ang); hairT[2 * j + 1] = CY + RH * Math.sin(ang);
        wHF[j] = 1 - ss(j, 3, 12);                                        // the front crown keeps pace with the band's top
      }
      var NTAIL = 13, tailT = [CX + RH * Math.cos(aEnd), CY + RH * Math.sin(aEnd)];
      var NHAIR = NHO + NTAIL + NBK;
      // static clip for the hair's relief planes: the t = 0 silhouette (contour + hairline)
      var hairClip0 = [];
      for (j = 0; j < NHO; j++) hairClip0.push(hair0a[j]);
      for (k = 12; k < NBK; k++) hairClip0.push(back0a[k]);
      var hairClipD = "M" + hairClip0.map(function (p) { return P(p[0], p[1]); }).join("L") + "Z";

      // ----- coin body: the circle; its right arc folds onto the chord under the band and the crescent -----
      var NB = 240, bodyCos = new Float64Array(NB), bodySin = new Float64Array(NB), chordY = new Float64Array(NB);
      var aTop2 = aTop + 2 * Math.PI, aSpan = aBot - aTop;
      for (i = 0; i < NB; i++) {
        var a = i / NB * 2 * Math.PI; bodyCos[i] = Math.cos(a); bodySin[i] = Math.sin(a);
        var u = a > aTop2 ? (a - aTop2) / aSpan : a < aBot ? (a + 2 * Math.PI - aTop2) / aSpan : -1;
        chordY[i] = u < 0 ? -1 : 51.7 + u * (588.3 - 51.7);
      }
      var rightIdx = [];
      for (i = NB - 1; i >= 0; i--) if (chordY[i] >= 0 && i / NB * 2 * Math.PI < aBot) rightIdx.push(i);
      for (i = NB - 1; i >= 0; i--) if (chordY[i] >= 0 && i / NB * 2 * Math.PI > aTop2) rightIdx.push(i);
      var BODY_ARC = "M 240 51.7 A 280 280 0 0 0 240 588.3";
      var NC = 90;

      // ----- DOM -----
      var svg = document.createElementNS(NS, "svg");
      svg.setAttribute("viewBox", "0 0 640 640");
      svg.setAttribute("xmlns", NS);
      svg.setAttribute("role", "img");
      svg.setAttribute("aria-label", "A silver coin of Thera with the goddess and two dolphins becoming the thera. mark");
      svg.style.willChange = "transform";
      var letterAttr = 'fill="none" stroke="' + BG + '" stroke-width="6.5" stroke-linecap="round" stroke-linejoin="round"';
      var lettersSvg = "";
      for (k = 0; k < 4; k++) lettersSvg += '<path id="sc-l' + k + '" ' + letterAttr + ' d="' + LETTERS[k] + '"/>';
      var B0 = BUN;
      var bunHi = "M" + P(B0[0] + 36 * Math.cos(2.6), B0[1] + 36 * Math.sin(2.6)) +
        "A36 36 0 0 1 " + P(B0[0] + 36 * Math.cos(5.0), B0[1] + 36 * Math.sin(5.0)) +
        "A7 7 0 0 1 " + P(B0[0] + 22 * Math.cos(5.0), B0[1] + 22 * Math.sin(5.0)) +
        "A22 22 0 0 0 " + P(B0[0] + 22 * Math.cos(2.6), B0[1] + 22 * Math.sin(2.6)) +
        "A7 7 0 0 1 " + P(B0[0] + 36 * Math.cos(2.6), B0[1] + 36 * Math.sin(2.6)) + "Z";
      svg.innerHTML =
        '<defs>' +
          '<clipPath id="sc-fieldclip"><circle cx="320" cy="320" r="' + RF + '"/></clipPath>' +
          '<clipPath id="sc-hairclip"><path d="' + hairClipD + '"/></clipPath>' +
          '<clipPath id="sc-bandclip"><path id="sc-bandclip-p"/></clipPath>' +
        '</defs>' +
        '<rect id="sc-bg" x="0" y="0" width="640" height="640" fill="' + BG + '"/>' +
        '<path id="sc-body" fill="' + BODY + '"/>' +
        '<circle id="sc-back" cx="320" cy="320" r="' + RF + '" fill="' + CRES + '"/>' +
        '<path id="sc-field" fill="' + CRES + '"/>' +
        '<g clip-path="url(#sc-fieldclip)">' +
          '<path id="sc-d0" d="' + DOLPHIN + '"/><path id="sc-d1" d="' + DOLPHIN + '"/>' + lettersSvg +
        '</g>' +
        '<circle id="sc-beads" cx="320" cy="320" fill="none" stroke-linecap="round"/>' +
        '<circle id="sc-bun" cx="' + B0[0] + '" cy="' + B0[1] + '" r="' + B0[2] + '" fill="' + BODY + '"/>' +
        '<path id="sc-bunhi" d="' + bunHi + '"/>' +
        '<path id="sc-hair" fill="' + BODY + '"/>' +
        '<g id="sc-hairplanes" clip-path="url(#sc-hairclip)">' +
          '<path id="sc-w0" d="' + crescent(334, 150, 214, 146, 92, 140, 0) + '"/>' +
          '<path id="sc-w1" d="' + crescent(300, 248, 180, 282, 104, 150, 0) + '"/>' +
          '<path id="sc-w2" d="' + crescent(276, 330, 204, 384, 70, 110, 0) + '"/>' +
          '<path id="sc-steph" d="' + crescent(344, 188, 182, 228, 98, 150, 0) + '"/>' +
        '</g>' +
        '<path id="sc-band"/>' +
        '<path id="sc-shade" clip-path="url(#sc-bandclip)" d="M300 324C314 396 338 446 374 474L380 566L240 566L240 324Z"/>' +
        '<g clip-path="url(#sc-bandclip)"><g id="sc-ear">' +
          '<path id="sc-ear0" d="M300 280C286 280 280 296 284 310C287 322 296 330 306 328C301 318 300 300 306 284C304 281 302 280 300 280Z"/>' +
          '<path id="sc-ear1" d="M296 296C292 302 292 312 297 318C296 310 297 302 300 298Z"/>' +
          '<path id="sc-ear2" d="M300 330A4.5 4.5 0 1 1 300 339A4.5 4.5 0 1 1 300 330ZM300 342C305 348 305 356 300 360C295 356 295 348 300 342Z"/>' +
        '</g></g>' +
        '<g id="sc-eye">' +
          '<path id="sc-eye0" d="M326 276C334 266 348 264 357 271C350 279 336 281 326 276Z"/>' +
          '<path id="sc-brow" d="M321 259C333 247 352 245 366 252L365 256C352 251 334 253 321 262Z"/>' +
        '</g>' +
        '<path id="sc-nos" d="M404 350C398 350 395 354 396 360L400 357C400 354 401 352 404 351Z"/>' +
        '<path id="sc-mouth" d="M393 389L377 392L393 394Z"/>';
      container.innerHTML = "";
      container.appendChild(svg);
      function $(id) { return svg.querySelector("#" + id); }
      var el = {
        body: $("sc-body"), back: $("sc-back"), field: $("sc-field"), beads: $("sc-beads"),
        bun: $("sc-bun"), bunhi: $("sc-bunhi"), hair: $("sc-hair"), planes: $("sc-hairplanes"),
        w: [$("sc-w0"), $("sc-w1"), $("sc-w2")], steph: $("sc-steph"),
        band: $("sc-band"), bandclip: $("sc-bandclip-p"), shade: $("sc-shade"),
        ear: $("sc-ear"), ear0: $("sc-ear0"), ear1: $("sc-ear1"), ear2: $("sc-ear2"),
        eye: $("sc-eye"), eye0: $("sc-eye0"), brow: $("sc-brow"), nos: $("sc-nos"), mouth: $("sc-mouth"),
        d: [$("sc-d0"), $("sc-d1")], l: [$("sc-l0"), $("sc-l1"), $("sc-l2"), $("sc-l3")]
      };
      var EYE_IDX = 24, NOS_IDX = 66, MOUTH_IDX = 81;

      // ----- buffers -----
      var bufBand = new Float64Array(NBAND * 2), bufField = new Float64Array((NC + NP) * 2), bufBody = new Float64Array(NB * 2);
      var bufHair = new Float64Array(NHAIR * 2), pushed = new Float64Array(NBK * 2);

      var last = new Map();
      function put(node, name, value) {
        var c = last.get(node); if (!c) { c = {}; last.set(node, c); }
        if (c[name] !== value) { c[name] = value; node.setAttribute(name, value); }
      }
      function fix3(v) { return (Math.round(v * 1000) / 1000) + ""; }

      function set(t) {
        t = t < 0 ? 0 : t > 1 ? 1 : t;
        var exact = t >= EXACT_T;
        var e = ss(t, 0.10, 0.90);          // profile
        var eT = ss(t, 0.12, 0.58);         // band top, upper hairline, forehead corner
        var eB = ss(t, 0.18, 0.64);         // band base, neck, chin corner
        var eHair = ss(t, 0.12, 0.46);      // hair swells to the rim
        var eTail = ss(t, 0.16, 0.52);      // ... and down the back of the neck
        var xr = (t - 0.36) / 0.32, eRing = xr <= 0 ? 0 : xr >= 1 ? 1 : xr * xr;   // the rim sinks under the crescent (accelerating, no lingering hairline)
        var eRet = ss(t, 0.70, 0.92);       // hidden right arc of the body folds onto the chord
        var x, y, p, w;

        // ----- profile -----
        for (i = 0; i < NP; i++) pc[i] = e + (eT - e) * wT[i] + (eB - e) * wB[i];

        // ----- band (face plane -> light band) -----
        for (k = 0; k < NBAND; k++) {
          p = k < NBK ? eB + (eT - eB) * bandL[k] : k < NFR ? eT : k < NFR + NP ? pc[k - NFR] : eB;
          bufBand[2 * k] = band0[2 * k] + (band1[2 * k] - band0[2 * k]) * p;
          bufBand[2 * k + 1] = band0[2 * k + 1] + (band1[2 * k + 1] - band0[2 * k + 1]) * p;
        }
        var bandD = pathOf(bufBand, NBAND);
        var faceCol = mix(FACE, BG, ss(t, 0.30, 0.90));
        if (exact) { put(el.band, "d", ""); }
        else { put(el.band, "d", bandD); }
        put(el.band, "fill", faceCol);
        put(el.bandclip, "d", bandD);

        // ----- field in front of the face -> crescent -----
        if (exact) {
          put(el.field, "d", CRES_PATH);
          put(el.back, "visibility", "hidden");
        } else {
          put(el.back, "visibility", "visible");
          for (i = 0; i < NP; i++) {
            k = (NC + i) * 2;
            bufField[k] = bufBand[(NFR + i) * 2] - OFFX;
            bufField[k + 1] = bufBand[(NFR + i) * 2 + 1];
          }
          var rr = lerp(RF, R, eRing);
          var aLast = Math.atan2(bufField[(NC + NP - 1) * 2 + 1] - CY, bufField[(NC + NP - 1) * 2] - CX);
          var aFirst = Math.atan2(bufField[NC * 2 + 1] - CY, bufField[NC * 2] - CX);
          if (eRing >= 1) {
            put(el.field, "d", "M" + P(CX + R * Math.cos(aLast), CY + R * Math.sin(aLast)) + "A280 280 0 0 0 " +
              P(CX + R * Math.cos(aFirst), CY + R * Math.sin(aFirst)) + linesOf(bufField, NC, NP) + "Z");
          } else {
            for (i = 0; i < NC; i++) {
              var an = aLast + (aFirst - aLast) * i / (NC - 1);
              bufField[2 * i] = CX + rr * Math.cos(an); bufField[2 * i + 1] = CY + rr * Math.sin(an);
            }
            put(el.field, "d", pathOf(bufField, NC + NP));
          }
        }

        // ----- hair -> body -----
        if (exact) { put(el.hair, "d", ""); }
        else {
          // inner edge: the band's live back edge, pushed under the band along its normal
          for (k = 0; k < NBK; k++) {
            var k0 = k > 0 ? k - 1 : k, k1 = k < NBK - 1 ? k + 1 : k;
            var tx = bufBand[2 * k1] - bufBand[2 * k0], ty = bufBand[2 * k1 + 1] - bufBand[2 * k0 + 1], len = Math.hypot(tx, ty) || 1;
            pushed[2 * k] = bufBand[2 * k] - ty / len * PUSH;
            pushed[2 * k + 1] = bufBand[2 * k + 1] + tx / len * PUSH;
          }
          for (j = 0; j < NHO; j++) {
            w = eHair + (eT - eHair) * wHF[j];
            bufHair[2 * j] = hair0[2 * j] + (hairT[2 * j] - hair0[2 * j]) * w;
            bufHair[2 * j + 1] = hair0[2 * j + 1] + (hairT[2 * j + 1] - hair0[2 * j + 1]) * w;
          }
          for (j = 0; j < NTAIL; j++) {                       // N -> Q down the neck, swinging out to the bottom end
            k = 12 - j, i = NHO + j;
            bufHair[2 * i] = pushed[2 * k] + (tailT[0] - pushed[2 * k]) * eTail;
            bufHair[2 * i + 1] = pushed[2 * k + 1] + (tailT[1] - pushed[2 * k + 1]) * eTail;
          }
          for (k = 0; k < NBK; k++) { i = NHO + NTAIL + k; bufHair[2 * i] = pushed[2 * k]; bufHair[2 * i + 1] = pushed[2 * k + 1]; }
          put(el.hair, "d", pathOf(bufHair, NHAIR));
        }

        // ----- coin body -----
        if (exact) put(el.body, "d", BODY_PATH);
        else if (eRet <= 0) put(el.body, "d", DISC_PATH);
        else {
          for (i = 0; i < NB; i++) {
            x = CX + R * bodyCos[i]; y = CY + R * bodySin[i];
            if (chordY[i] >= 0) { x += (CHORD - x) * eRet; y += (chordY[i] - y) * eRet; }
            bufBody[2 * i] = x; bufBody[2 * i + 1] = y;
          }
          put(el.body, "d", BODY_ARC + linesOfIdx(bufBody, rightIdx) + "Z");
        }

        // ----- beads sink into the rim -----
        var eBd = ss(t, 0.08, 0.40);
        var br = lerp(265, 277, eBd), bw = 9 * (1 - eBd);
        put(el.beads, "r", fix3(br));
        put(el.beads, "stroke-width", fix3(bw));
        put(el.beads, "stroke-dasharray", "0 " + fix3(2 * Math.PI * br / 64));
        put(el.beads, "stroke", mix(LIGHT, BODY, ss(t, 0.14, 0.40)));
        put(el.beads, "visibility", bw > 0.05 ? "visible" : "hidden");

        // ----- legend: each letter slides out under the rim -----
        for (k = 0; k < 4; k++) {
          var eL = ss(t, 0.05 + 0.03 * k, 0.31 + 0.03 * k);
          put(el.l[k], "transform", "translate(320 320) rotate(" + LETTER_ANG[k] + ") translate(0 " + fix3(-lerp(LETTER_R, LETTER_R + 52, eL)) + ") scale(" + fix3(0.86 - 0.2 * eL) + ")");
          put(el.l[k], "stroke", mix(BG, CRES, ss(eL, 0.5, 1)));       // the last of each letter dissolves into the field
          put(el.l[k], "visibility", eL < 1 ? "visible" : "hidden");
        }

        // ----- dolphins swim out into the rim -----
        for (k = 0; k < 2; k++) {
          var D = DOLPHINS[k], ed = ss(t, D.k0, D.k1);
          var ah = (D.a + D.turn * ed) * Math.PI / 180, a0r = D.a * Math.PI / 180;
          // position: integrate the slowly turning heading (closed form of a constant-curvature arc)
          var dist = D.d * ed, px, py;
          if (Math.abs(D.turn) < 1e-6 || ed === 0) { px = D.x + dist * Math.cos(a0r); py = D.y + dist * Math.sin(a0r); }
          else {
            var kap = (D.turn * Math.PI / 180) / D.d;              // radians per unit length
            px = D.x + (Math.sin(a0r + kap * dist) - Math.sin(a0r)) / kap;
            py = D.y - (Math.cos(a0r + kap * dist) - Math.cos(a0r)) / kap;
          }
          put(el.d[k], "transform", "translate(" + P(px, py) + ") rotate(" + fix3(ah * 180 / Math.PI) + ") scale(" + fix3(D.s * (1 - 0.12 * ed)) + ")");
          put(el.d[k], "fill", mix(BG, CRES, ss(ed, 0.55, 1)));        // ... and the dolphins dive into the crescent's blue
          put(el.d[k], "visibility", ed < 1 ? "visible" : "hidden");
        }

        // ----- hair relief flattens -----
        var fHair = ss(t, 0.10, 0.44), fSteph = ss(t, 0.08, 0.42), fBun = ss(t, 0.08, 0.30);
        for (k = 0; k < 3; k++) put(el.w[k], "fill", mix(HI, BODY, fHair));
        put(el.steph, "fill", mix(LIGHT, BODY, fSteph));
        put(el.planes, "visibility", (fHair < 1 || fSteph < 1) && !exact ? "visible" : "hidden");
        put(el.bunhi, "fill", mix(HI, BODY, fBun));
        put(el.bunhi, "visibility", fBun < 1 ? "visible" : "hidden");
        put(el.bun, "visibility", exact ? "hidden" : "visible");

        // ----- face relief flattens; the features ride with the profile, the ear with the hairline -----
        var fShade = ss(t, 0.08, 0.44), fFeat = ss(t, 0.06, 0.42), fEar = ss(t, 0.08, 0.38);
        put(el.shade, "fill", mix(SHADE, faceCol, fShade));
        put(el.shade, "visibility", fShade < 1 && !exact ? "visible" : "hidden");
        var dxE = bufBand[(NFR + EYE_IDX) * 2] - P0[2 * EYE_IDX], dyE = bufBand[(NFR + EYE_IDX) * 2 + 1] - P0[2 * EYE_IDX + 1];
        put(el.eye, "transform", "translate(" + P(dxE, dyE) + ")");
        put(el.eye0, "fill", mix(BODY, faceCol, fFeat));
        put(el.brow, "fill", mix(CRES, faceCol, fFeat));
        put(el.eye, "visibility", fFeat < 1 ? "visible" : "hidden");
        var dxN = bufBand[(NFR + NOS_IDX) * 2] - P0[2 * NOS_IDX], dyN = bufBand[(NFR + NOS_IDX) * 2 + 1] - P0[2 * NOS_IDX + 1];
        put(el.nos, "transform", "translate(" + P(dxN, dyN) + ")");
        put(el.nos, "fill", mix(CRES, faceCol, fFeat));
        put(el.nos, "visibility", fFeat < 1 ? "visible" : "hidden");
        var dxM = bufBand[(NFR + MOUTH_IDX) * 2] - P0[2 * MOUTH_IDX], dyM = bufBand[(NFR + MOUTH_IDX) * 2 + 1] - P0[2 * MOUTH_IDX + 1];
        put(el.mouth, "transform", "translate(" + P(dxM, dyM) + ")");
        put(el.mouth, "fill", mix(CRES, faceCol, fFeat));
        put(el.mouth, "visibility", fFeat < 1 ? "visible" : "hidden");
        var dxR = bufBand[EAR_IDX * 2] - band0[EAR_IDX * 2], dyR = bufBand[EAR_IDX * 2 + 1] - band0[EAR_IDX * 2 + 1];
        put(el.ear, "transform", "translate(" + P(dxR, dyR) + ")");
        put(el.ear0, "fill", mix(LIGHT, faceCol, fEar));
        put(el.ear1, "fill", mix(CRES, faceCol, fEar));
        put(el.ear2, "fill", mix(CRES, faceCol, fEar));
        put(el.ear, "visibility", fEar < 1 ? "visible" : "hidden");
      }

      return {
        set: set,
        destroy: function () { last.clear(); container.innerHTML = ""; }
      };
    }
  };
})();
