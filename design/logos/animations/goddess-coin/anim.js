// thera. logo animation — track "goddess-coin".
// A worn bronze coin of Thera (goddess head in low relief, beaded border, legend ΘΗΡΑ) softens into the
// two-tone "Goddess on the coin" mark. The disc is the same object the whole way, so the middle never
// reads as a cross-fade.
//
// Every hero mass is a closed polyline sampled from matched segment lists (same point count at both ends,
// point-wise lerp, no flubber):
//   body     : the worn, out-of-round coin             -> the disc (#466680). Once the band hides the right half,
//              the hidden right arc folds point by point onto the chord, so it ends as the exact left segment.
//   band     : the lit face and neck plane (ivory gold)  -> the light band (page colour). Its hairline/neck edge
//              straightens into the vertical cut at x = 240, its top and base grow out to the rim (top first),
//              its front is the profile tucked under the crescent.
//   crescent : the flat coin field in front of her face, rim to profile, with the legend on it
//                                                        -> the crescent (#8DA8BB). Its inner edge is the profile
//              throughout; its outer arc rides the coin edge between the band's corners; its lightness lifts
//              out of the body colour first, then its hue follows.
//   hair     : hair, fillet, chignon (in shadow)         -> first a smooth skull cap hugging the band's back edge,
//              then a sliver along the cut that takes the body's own gradient and is gone by 0.6.
// Everything else folds into those masses in the first 60%: strands, fillet and necklace fade by 0.24, the
// facial features ride with the face and fade by 0.38, the bead border and raised rim shrink out to the
// edge by 0.6, the legend slides to the rim and shrinks into it by 0.56, the cast shadow thins out by 0.62.
// Colour travels in OKLCH on the decreasing "dusk" arc (bronze -> copper -> dusty rose -> mauve -> slate ->
// Blue Haze) with a chroma dip in the middle; the shorter arc through yellow-green is olive mud.
// set(t) is stateless: point sets, weights and ramps are precomputed in mount; set() only fills preallocated
// typed-array buffers and writes attributes (through a cache, so unchanged values are not rewritten).
(function () {
  "use strict";

  var CX = 320, CY = 320, R = 280;
  var RB = R + 0.5;      // the band's arcs sit half a unit outside the rim: page colour on page colour, never a hairline
  var CHORD = 240.6;     // the body's hidden right arc folds onto this chord, 0.6 inside the band's cut: no two edges coincide
  var BG = "#F7F9FA", BODY = "#466680", CRES = "#8DA8BB";
  var BODY_PATH = "M 240 51.7 A 280 280 0 0 0 240 588.3 Z";
  var CRES_PATH = "M 360 597.1 A 280 280 0 0 0 360 42.9 A 400 400 0 0 1 366 170 L 433.2 315.4 A 20 20 0 0 1 427.1 339.7 L 387 370 L 388.9 421.9 A 80 80 0 0 1 375 532.4 A 40 40 0 0 0 360 563.7 L 360 597.1 Z";
  var EXACT_T = 0.96;    // from here (the body's fold is complete) the exact LOGO_PATHS strings and flat fills are written

  // ---------- easing ----------
  function ss(t, a, b) { var x = (t - a) / (b - a); x = x < 0 ? 0 : x > 1 ? 1 : x; return x * x * (3 - 2 * x); }
  function lerp(a, b, s) { return a + (b - a) * s; }

  // ---------- colour: hex <-> OKLCH ----------
  var HEX2 = [];
  for (var hx = 0; hx < 256; hx++) HEX2.push((hx < 16 ? "0" : "") + hx.toString(16).toUpperCase());
  function lin(c) { return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); }
  function gam(c) { c = c < 0 ? 0 : c > 1 ? 1 : c; return c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055; }
  function lchOf(hex) {                                   // mount-time only -> [L, C, h(deg)]
    var r = lin(parseInt(hex.slice(1, 3), 16) / 255), g = lin(parseInt(hex.slice(3, 5), 16) / 255), b = lin(parseInt(hex.slice(5, 7), 16) / 255);
    var l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
    var m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
    var s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
    var L = 0.2104542553 * l + 0.7936177850 * m - 0.0040720468 * s;
    var A = 1.9779984951 * l - 2.4285922050 * m + 0.4505937099 * s;
    var B = 0.0259040371 * l + 0.7827717662 * m - 0.8086757660 * s;
    return [L, Math.hypot(A, B), Math.atan2(B, A) * 180 / Math.PI];
  }
  function lchHex(c) {                                    // [L, C, h] -> "#RRGGBB" (only the string is allocated)
    var hr = c[2] * Math.PI / 180, a = c[1] * Math.cos(hr), b = c[1] * Math.sin(hr), L = c[0];
    var l = L + 0.3963377774 * a + 0.2158037573 * b;
    var m = L - 0.1055613458 * a - 0.0638541728 * b;
    var s = L - 0.0894841775 * a - 1.2914855480 * b;
    l = l * l * l; m = m * m * m; s = s * s * s;
    var r = 4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
    var g = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
    var bb = -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s;
    return "#" + HEX2[Math.round(gam(r) * 255)] + HEX2[Math.round(gam(g) * 255)] + HEX2[Math.round(gam(bb) * 255)];
  }
  // makeRamp(a, b) -> (s, out) writes the OKLCH colour at s into out. The hue turns the "dusk" way (decreasing:
  // gold -> copper -> rose -> mauve -> blue) and arrives early (ss 0.10..0.65) so the violet beat is short; the
  // chroma dips (windowed to the first 80%) so the middle is a dusty greyed mauve, never candy and never below
  // C 0.04 on the metal ramps. A near-neutral end borrows the other end's hue so pale ivory just loses chroma.
  function makeRamp(hexA, hexB) {
    var A = lchOf(hexA), B = lchOf(hexB), hA = A[2], hB = B[2];
    if (A[1] < 0.012) hA = hB; else if (B[1] < 0.012) hB = hA;
    while (hB > hA) hB -= 360;
    if (hA - hB > 340) hB += 360;
    var span = Math.min(1, Math.abs(hB - hA) / 180);
    return function (s, out) {
      if (s <= 0) { out[0] = A[0]; out[1] = A[1]; out[2] = hA; return out; }
      if (s >= 1) { out[0] = B[0]; out[1] = B[1]; out[2] = hB; return out; }
      var dip = s < 0.8 ? Math.sin(Math.PI * s / 0.8) : 0;
      out[0] = A[0] + (B[0] - A[0]) * s;
      out[1] = (A[1] + (B[1] - A[1]) * s) * (1 - 0.40 * span * dip);
      out[2] = hA + (hB - hA) * ss(s, 0.10, 0.65);
      return out;
    };
  }
  // straight OKLCH blend of two near colours (hue on the shorter arc); out may alias a
  function mixLch(out, a, b, s) {
    if (s <= 0) { out[0] = a[0]; out[1] = a[1]; out[2] = a[2]; return out; }
    if (s >= 1) { out[0] = b[0]; out[1] = b[1]; out[2] = b[2]; return out; }
    var dh = b[2] - a[2]; while (dh > 180) dh -= 360; while (dh < -180) dh += 360;
    out[0] = a[0] + (b[0] - a[0]) * s; out[1] = a[1] + (b[1] - a[1]) * s; out[2] = a[2] + dh * s;
    return out;
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
  // n points on the circle (CX,CY,r) from angle a0 to a1; includeStart adds the a0 point first
  function ringPts(a0, a1, r, n, includeStart) {
    var out = [], i0 = includeStart ? 0 : 1, N = includeStart ? n - 1 : n;
    for (var i = i0; i <= N; i++) { var a = a0 + (a1 - a0) * i / N; out.push([CX + r * Math.cos(a), CY + r * Math.sin(a)]); }
    return out;
  }
  function shift(pts, dx, dy) { return pts.map(function (p) { return [p[0] + dx, p[1] + dy]; }); }
  // inset an open polyline by d along its left-hand normal (left of the direction of travel, y down)
  function insetLeft(pts, d) {
    return pts.map(function (p, i) {
      var a = pts[i > 0 ? i - 1 : i], b = pts[i < pts.length - 1 ? i + 1 : i];
      var tx = b[0] - a[0], ty = b[1] - a[1], len = Math.hypot(tx, ty) || 1;
      return [p[0] + ty / len * d, p[1] - tx / len * d];
    });
  }
  function flat(pts) { var f = new Float64Array(pts.length * 2); for (var i = 0; i < pts.length; i++) { f[2 * i] = pts[i][0]; f[2 * i + 1] = pts[i][1]; } return f; }
  function r2(v) { return Math.round(v * 100) / 100; }
  function pathOf(buf, n, open) {
    var s = "M" + r2(buf[0]) + " " + r2(buf[1]);
    for (var i = 1; i < n; i++) s += "L" + r2(buf[2 * i]) + " " + r2(buf[2 * i + 1]);
    return open ? s : s + "Z";
  }
  function linesOf(buf, i0, n) {          // "L x y" for points i0 .. i0+n-1
    var s = "";
    for (var i = i0; i < i0 + n; i++) s += "L" + r2(buf[2 * i]) + " " + r2(buf[2 * i + 1]);
    return s;
  }
  function linesOfIdx(buf, idx) {         // "L x y" for the listed point indices
    var s = "";
    for (var k = 0; k < idx.length; k++) s += "L" + r2(buf[2 * idx[k]]) + " " + r2(buf[2 * idx[k] + 1]);
    return s;
  }
  function svgPath(pts) { return pts.map(function (p, i) { return (i ? "L" : "M") + r2(p[0]) + " " + r2(p[1]); }).join(""); }

  // ---------- the profile (H at the hairline down to W at the neck truncation) ----------
  var H = [350, 196], W = [368, 548], N = [252, 445], Q = [258, 548];
  var PROFILE0 = [
    ["M", H[0], H[1]],
    ["C", 24, 362, 216, 368, 242, 365, 262],          // forehead to brow
    ["C", 30, 362, 281, 393, 303, 420, 334],          // bridge dip then the nose ridge
    ["A", 8, 8, 0, 1, 416, 347],                      // round tip (short hook)
    ["L", 8, 388, 362],                               // underside to the nostril base
    ["C", 6, 389, 369, 395, 374, 396, 381],           // philtrum and upper lip
    ["C", 5, 397, 386, 390, 389, 387, 391],           // mouth corner
    ["C", 6, 395, 394, 398, 402, 393, 407],           // lower lip
    ["C", 4, 391, 410, 388, 411, 387, 412],           // into the chin cleft
    ["C", 28, 397, 420, 399, 452, 381, 468],          // chin (light jaw)
    ["C", 10, 371, 474, 364, 478, 362, 486],          // throat
    ["L", 14, W[0], W[1]]                             // neck to the truncation
  ];
  // Logo profile, same segment counts (the lip plane of the logo is split in four to match).
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
  // the band's back edge: neck (Q -> N), nape behind the ear, concave temple, convex fringe to H
  var BACK0 = [["M", Q[0], Q[1]], ["L", 12, N[0], N[1]],
    ["C", 12, 262, 400, 290, 352, 300, 306],
    ["C", 12, 296, 276, 296, 246, 312, 232],
    ["C", 12, 324, 234, 338, 206, H[0], H[1]]];
  // the hair's outer contour, H over the crown and the back of the head to the chignon and N (36 segments)
  var HAIR0 = [["M", H[0], H[1]],
    ["C", 8, 344, 180, 346, 150, 326, 128],
    ["C", 8, 304, 106, 252, 104, 214, 140],
    ["C", 7, 186, 166, 182, 230, 194, 292],
    ["C", 7, 206, 342, 160, 376, 176, 420],
    ["C", 6, 190, 440, 228, 448, N[0], N[1]]];
  // skull-cap thickness behind the band's edge, by contour point (0 = on the top edge in front of H, ~5 = H ... 36 = N)
  var CAP_KNOTS = [[0, 0], [2, 12], [5, 22], [9, 30], [16, 30], [24, 24], [30, 14], [36, 4]];
  function capD(j) {
    for (var k = 1; k < CAP_KNOTS.length; k++) {
      if (j <= CAP_KNOTS[k][0]) { var a = CAP_KNOTS[k - 1], b = CAP_KNOTS[k]; return lerp(a[1], b[1], (j - a[0]) / (b[0] - a[0])); }
    }
    return CAP_KNOTS[CAP_KNOTS.length - 1][1];
  }

  var SHADOW = [11, 4];   // cast-shadow offset (light from the upper left)
  var OFF = [5, 2];       // how far the band's front tucks under the crescent (hidden overlap, no seam)
  var PUSH = 3;           // how far the hair's hairline edge tucks under the band

  // the worn coin edge as a radius function of angle (slightly out-of-round, a few chips)
  function rimR0(a) {
    var r = 276 + 3.2 * Math.cos(2 * a + 0.6) + 2.6 * Math.sin(3 * a + 1.1) + 1.8 * Math.sin(7 * a + 2.3) + 1.1 * Math.sin(13 * a + 0.4);
    var d1 = a - 0.9, d2 = a - 2.6, d3 = a - 4.4;
    return r - 7 * Math.exp(-d1 * d1 / 0.012) - 5 * Math.exp(-d2 * d2 / 0.012) - 6 * Math.exp(-d3 * d3 / 0.012);
  }

  window.TheraAnimations = window.TheraAnimations || {};
  window.TheraAnimations["goddess-coin"] = {
    title: "Goddess to the coin mark",
    from: "Classical goddess",
    to: "Goddess on the coin",
    viewBox: "0 0 640 640",
    mount: function (container) {
      var i, k, j, m;
      // ----- profile: per-point clocks. The first points lead with the band's top (eT), the last with its base
      // (eB), so the corners reach the rim with the band; the rest follows the profile clock (e). -----
      var P0a = sampleOps(PROFILE0), P1a = sampleOps(PROFILE1), NP = P0a.length;
      var P0 = flat(P0a), P1 = flat(P1a);
      var wT = new Float64Array(NP), wB = new Float64Array(NP), pc = new Float64Array(NP);
      for (i = 0; i < NP; i++) { wT[i] = 1 - ss(i, 5, 14); wB[i] = ss(i, NP - 15, NP - 6); }

      // ----- band: back (Q -> N -> hairline -> H), top (H -> H''), front (the profile tucked under the crescent), base -----
      var aTop = Math.atan2(51.7 - CY, 240 - CX), aH = Math.atan2(42.9 - CY, 360 - CX), aW = -aH, aBot = -aTop;
      var back0a = sampleOps(BACK0), NBK = back0a.length;              // 49
      var back1a = sampleOps([["M", 240, 588.3], ["L", NBK - 1, 240, 51.7]]);
      var NTOP = 12;
      var top0a = sampleOps([["M", H[0], H[1]], ["L", NTOP, H[0] + OFF[0], H[1] + OFF[1]]]).slice(1);
      var top1a = ringPts(aTop, aH, RB, NTOP, false);
      var front0a = shift(P0a, OFF[0], OFF[1]);
      var front1a = ringPts(aH, aW, RB, NP, true);
      var base0a = sampleOps([["M", W[0] + OFF[0], W[1] + OFF[1]], ["L", NTOP, Q[0], Q[1]]]).slice(1);
      var base1a = ringPts(aW, aBot, RB, NTOP, false);
      var band0 = flat(back0a.concat(top0a, front0a, base0a)), band1 = flat(back1a.concat(top1a, front1a, base1a));
      var NBAND = band0.length / 2, NFR = NBK + NTOP;
      var bandL = new Float64Array(NBK);                                 // the upper hairline leads with the top
      for (k = 0; k < NBK; k++) bandL[k] = ss(k, 30, NBK - 1);
      var IH = NBK - 1, IN = 12, NHL = IH - IN + 1;                      // back indices of H and N, hairline point count (37)
      var NTW = 6, NE = NHL + NTW;                                        // the hair's edge: hairline + the first half of the top edge (43)

      // ----- hair: outer contour (37 points, H -> N) + the hairline pushed under the band -----
      var hairOut0a = sampleOps(HAIR0), NHO = hairOut0a.length;         // 37
      var hairOut0 = flat(hairOut0a);
      var capDj = new Float64Array(NHO), wCh = new Float64Array(NHO);
      for (j = 0; j < NHO; j++) { capDj[j] = capD(j); wCh[j] = ss(j, 21, 25) * (1 - ss(j, 31, 35)); }
      var HI0 = 3, HI1 = 13, FI0 = 1, FI1 = 17;                           // contour ranges of the crown highlight and the fillet
      var hi0 = flat(insetLeft(hairOut0a, 4).slice(HI0, HI1 + 1)), NHI = HI1 - HI0 + 1;
      var fil0 = flat(insetLeft(hairOut0a, 18).slice(FI0, FI1 + 1)), NFI = FI1 - FI0 + 1;

      // ----- coin body: irregular worn edge -> circle (sampled by angle); the hidden right arc folds onto the chord -----
      var NB = 240, bodyR0 = new Float64Array(NB), bodyCos = new Float64Array(NB), bodySin = new Float64Array(NB), chordY = new Float64Array(NB), bodyAng = new Float64Array(NB);
      var aTop2 = aTop + 2 * Math.PI, aSpan = 2 * Math.PI - aTop2 + aBot;
      for (i = 0; i < NB; i++) {
        var a = i / NB * 2 * Math.PI; bodyAng[i] = a; bodyCos[i] = Math.cos(a); bodySin[i] = Math.sin(a); bodyR0[i] = rimR0(a);
        var u = a > aTop2 ? (a - aTop2) / aSpan : a < aBot ? (a + 2 * Math.PI - aTop2) / aSpan : -1;
        chordY[i] = u < 0 ? -1 : 51.7 + u * (588.3 - 51.7);
      }
      var rightIdx = [];                                                  // the hidden right arc, from the bottom chord end round to the top
      for (i = NB - 1; i >= 0; i--) if (chordY[i] >= 0 && bodyAng[i] < aBot) rightIdx.push(i);
      for (i = NB - 1; i >= 0; i--) if (chordY[i] >= 0 && bodyAng[i] > aTop2) rightIdx.push(i);
      // Skia anti-aliases a polygon and a true arc differently at the edge, so once an edge is a real circle arc it is
      // written as an "A" command (the body's left arc from 0.6, the crescent's outer arc from 0.64): the final switch
      // to the LOGO_PATHS strings then changes nothing along the rim.
      var BODY_ARC = "M 240 51.7 A 280 280 0 0 0 240 588.3", CRES_ARC = "M 360 597.1 A 280 280 0 0 0 360 42.9";
      var NC = 80;                                                        // crescent outer arc samples

      // ----- colour ramps -----
      var rBg = makeRamp("#F4EFE5", BG);
      var rLit = makeRamp("#D3A657", BODY), rField = makeRamp("#AD7D3C", BODY), rDark = makeRamp("#7B5222", BODY);
      var rCLit = makeRamp("#D3A657", CRES), rCField = makeRamp("#AD7D3C", CRES), rCDark = makeRamp("#7B5222", CRES);
      var rBandA = makeRamp("#F3E0A9", BG), rBandB = makeRamp("#DBB96E", BG);
      var rHair = makeRamp("#86602E", BODY), rStrip = makeRamp("#4E3214", BODY), rInk = makeRamp("#6A4619", BODY), rBead = makeRamp("#C99B4F", BODY);
      var cBg = new Float64Array(3), cLit = new Float64Array(3), cField = new Float64Array(3), cDark = new Float64Array(3);
      var cCl = new Float64Array(3), cCf = new Float64Array(3), cCd = new Float64Array(3), cTmp = new Float64Array(3);
      var cBa = new Float64Array(3), cBb = new Float64Array(3), cMid = new Float64Array(3), cHair = new Float64Array(3), cH = new Float64Array(3);
      var cMisc = new Float64Array(3);

      // ----- DOM -----
      var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      svg.setAttribute("viewBox", "0 0 640 640");
      svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
      svg.setAttribute("role", "img");
      svg.setAttribute("aria-label", "An ancient coin of Thera becoming the thera. mark");
      svg.style.willChange = "transform";   // own compositor layer: deterministic rasterisation while scrubbing
      var ink = 'fill="none" stroke="#4A2E10" stroke-linecap="round" stroke-linejoin="round"';
      var letter = 'fill="none" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"';
      var grad = function (id, p0, p1, p2) {
        return '<radialGradient id="' + id + '" gradientUnits="userSpaceOnUse" cx="236" cy="214" r="372">' +
          '<stop id="' + p0 + '" offset="0"/><stop id="' + p1 + '" offset="0.58"/><stop id="' + p2 + '" offset="1"/></radialGradient>';
      };
      svg.innerHTML =
        '<defs>' +
          '<radialGradient id="tc-shadow" gradientUnits="userSpaceOnUse" cx="332" cy="338" r="292">' +
            '<stop offset="0" stop-color="#3A2A14"/><stop offset="0.9" stop-color="#3A2A14"/><stop offset="1" stop-color="#3A2A14" stop-opacity="0"/></radialGradient>' +
          grad("tc-metal", "tc-m0", "tc-m1", "tc-m2") + grad("tc-cresg", "tc-c0", "tc-c1", "tc-c2") + grad("tc-hairg", "tc-h0", "tc-h1", "tc-h2") +
          '<linearGradient id="tc-face" gradientUnits="userSpaceOnUse" x1="250" y1="150" x2="420" y2="520">' +
            '<stop id="tc-f0" offset="0"/><stop id="tc-f1" offset="1"/></linearGradient>' +
        '</defs>' +
        '<rect id="tc-bg" x="0" y="0" width="640" height="640"/>' +
        '<circle id="tc-drop" cx="332" cy="338" r="292" fill="url(#tc-shadow)"/>' +
        '<path id="tc-body"/>' +
        '<ellipse id="tc-pat2" cx="118" cy="292" rx="30" ry="17" transform="rotate(60 118 292)" fill="#4F8C7E"/>' +
        '<path id="tc-hair" fill="url(#tc-hairg)"/>' +
        '<path id="tc-band"/>' +
        '<path id="tc-cres"/>' +
        '<ellipse id="tc-pat1" cx="470" cy="470" rx="42" ry="22" transform="rotate(-35 470 470)" fill="#4F8C7E"/>' +
        '<path id="tc-strip"/>' +
        '<path id="tc-strands" fill="none" stroke="#5E4118" stroke-width="2.5" stroke-linecap="round" d="M338 190C306 174 270 186 244 214C228 232 220 258 218 290M330 168C298 150 252 156 228 182M232 392A26 26 0 1 1 180 392A26 26 0 1 1 232 392M218 384C208 376 194 386 200 398"/>' +
        '<path id="tc-fillet" fill="none" stroke="#C9A054" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>' +
        '<path id="tc-hairhi" fill="none" stroke="#F4DFA0" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>' +
        '<g id="tc-feat">' +
          '<path ' + ink + ' stroke-width="3.5" d="M322 258C334 247 352 247 362 253"/>' +
          '<path ' + ink + ' stroke-width="3" d="M322 277C330 264 348 262 355 272C349 282 332 284 322 277Z"/>' +
          '<circle cx="340" cy="273" r="5" fill="#4A2E10"/>' +
          '<path ' + ink + ' stroke-width="4" d="M311 300C299 294 286 314 292 338C296 350 310 352 317 344"/>' +
          '<path ' + ink + ' stroke-width="3" d="M305 309C297 317 298 333 305 340M314 318C311 324 312 332 315 336"/>' +
          '<path ' + ink + ' stroke-width="3" d="M309 350L309 360"/>' +
          '<circle cx="309" cy="366" r="5" fill="#4A2E10"/>' +
          '<path ' + ink + ' stroke-width="3" d="M394 353C400 352 405 346 402 340"/>' +
          '<path ' + ink + ' stroke-width="3" d="M387 391L373 393"/>' +
        '</g>' +
        '<path id="tc-necklace" fill="none" stroke="#C9A054" stroke-width="5" stroke-linecap="round" stroke-dasharray="0 14" d="M264 520C292 534 336 536 362 526"/>' +
        '<circle id="tc-rim" cx="320" cy="320" fill="none"/>' +
        '<circle id="tc-beads" cx="320" cy="320" fill="none" stroke-linecap="round"/>' +
        '<g id="tc-l0" ' + letter + '><circle cx="0" cy="0" r="4"/></g>' +
        '<g id="tc-l1" ' + letter + '><path d="M0 -18A13 18 0 1 1 0 18A13 18 0 1 1 0 -18ZM-6 0L6 0"/></g>' +
        '<g id="tc-l2" ' + letter + '><path d="M-11 -18L-11 18M11 -18L11 18M-11 0L11 0"/></g>' +
        '<g id="tc-l3" ' + letter + '><path d="M-10 18L-10 -18L2 -18A9.5 9.5 0 0 1 2 1L-10 1"/></g>' +
        '<g id="tc-l4" ' + letter + '><path d="M-12 18L0 -18L12 18M-6.4 3L6.4 3"/></g>';
      container.innerHTML = "";
      container.appendChild(svg);
      function $(id) { return svg.querySelector("#" + id); }
      var el = {
        bg: $("tc-bg"), drop: $("tc-drop"), body: $("tc-body"), pat1: $("tc-pat1"), pat2: $("tc-pat2"),
        band: $("tc-band"), cres: $("tc-cres"), strip: $("tc-strip"), hair: $("tc-hair"), hairhi: $("tc-hairhi"),
        strands: $("tc-strands"), fillet: $("tc-fillet"), feat: $("tc-feat"), necklace: $("tc-necklace"),
        rim: $("tc-rim"), beads: $("tc-beads"),
        m0: $("tc-m0"), m1: $("tc-m1"), m2: $("tc-m2"), c0: $("tc-c0"), c1: $("tc-c1"), c2: $("tc-c2"),
        h0: $("tc-h0"), h1: $("tc-h1"), h2: $("tc-h2"), f0: $("tc-f0"), f1: $("tc-f1"),
        letters: [$("tc-l0"), $("tc-l1"), $("tc-l2"), $("tc-l3"), $("tc-l4")]
      };
      var LETTER_ANG = [43, 55, 68, 81, 94];   // degrees clockwise from 12 o'clock, on the field in front of the face (dot, Θ, Η, Ρ, Α)
      var FEAT_IDX = 30;                       // profile point near the bridge of the nose; the features ride with it
      var fillet0 = pathOf(fil0, NFI, true);

      // ----- buffers (filled in set, never reallocated) -----
      var bufBand = new Float64Array(NBAND * 2), bufCres = new Float64Array((NC + NP) * 2), bufBody = new Float64Array(NB * 2);
      var bufStrip = new Float64Array(NP * 4), bufHair = new Float64Array((NHO + NE) * 2), bufHi = new Float64Array(NHI * 2), bufFil = new Float64Array(NFI * 2);
      var eP = new Float64Array(NE * 2), eN = new Float64Array(NE * 2);   // the hair's edge on the band (N -> H -> top) and its outward normals
      var eIdx = new Float64Array(NHO);                                   // where contour point j sits along that edge (fractional index)
      for (j = 0; j < NHO; j++) eIdx[j] = (NHO - 1 - j) * (NE - 1) / (NHO - 1);

      // write an attribute only when its value changed: cheaper, and keeps the raster identical frame to frame
      var last = new Map();
      function put(node, name, value) {
        var c = last.get(node); if (!c) { c = {}; last.set(node, c); }
        if (c[name] !== value) { c[name] = value; node.setAttribute(name, value); }
      }
      function fix3(v) { return (Math.round(v * 1000) / 1000) + ""; }

      function set(t) {
        t = t < 0 ? 0 : t > 1 ? 1 : t;
        var e = ss(t, 0.08, 0.90);          // profile: crescent inner edge and the band's front
        var eT = ss(t, 0.08, 0.60);         // band top, upper hairline and the forehead corner: the light grows up to the rim first
        var eB = ss(t, 0.24, 0.64);         // band base, hairline/neck edge and the neck corner (waits while the hair becomes a cap)
        var eEdge = ss(t, 0, 0.60);         // coin edge regularises
        var eRet = ss(t, 0.64, 0.96);       // hidden right arc of the body folds onto the chord
        var sc = ss(t, 0.08, 0.92);         // colour (metal, band, hair, page)
        var liftL = ss(t, 0.15, 0.55);      // the field in front of the face lightens into the moon (lightness leads)
        var liftC = ss(t, 0.20, 0.70);      // ... then its chroma and hue settle on the crescent ramp
        var flat = ss(t, 0.50, 0.90);       // gradients flatten to their middle tone
        var fine = 1 - ss(t, 0.04, 0.24);   // strands, fillet, necklace
        var hiO = 0.85 * (1 - ss(t, 0.24, 0.42));   // crown highlight rides the cap until it is gone
        var feat = 1 - ss(t, 0.10, 0.38);   // eye, brow, ear, nostril, mouth
        var cA = ss(t, 0.16, 0.42), cAc = ss(t, 0.12, 0.34);   // hair -> skull cap (chignon tucks in first)
        var shrink = 1 - 0.8 * ss(t, 0.42, 0.60);               // the cap thins onto the cut
        var mg = ss(t, 0.36, 0.50);         // hair takes the body's own gradient (invisible against it)
        var hairO = 1 - ss(t, 0.46, 0.60);
        var exact = t >= EXACT_T, colourExact = sc >= 1;
        var x, y, p, w, d, nx, ny, tx, ty, len, k0, k1;

        // ----- colour -----
        rLit(sc, cLit); rField(sc, cField); rDark(sc, cDark);
        rCLit(sc, cCl); rCField(sc, cCf); rCDark(sc, cCd);
        // crescent stops: lightness lifts toward the crescent ramp first, chroma and hue follow
        cCl[0] = lerp(cLit[0], cCl[0], liftL); cCl[1] = lerp(cLit[1], cCl[1], liftC); cCl[2] = cLit[2] + (cCl[2] - cLit[2]) * liftC;
        cCf[0] = lerp(cField[0], cCf[0], liftL); cCf[1] = lerp(cField[1], cCf[1], liftC); cCf[2] = cField[2] + (cCf[2] - cField[2]) * liftC;
        cCd[0] = lerp(cDark[0], cCd[0], liftL); cCd[1] = lerp(cDark[1], cCd[1], liftC); cCd[2] = cDark[2] + (cCd[2] - cDark[2]) * liftC;
        if (flat > 0) { mixLch(cLit, cLit, cField, flat); mixLch(cDark, cDark, cField, flat); mixLch(cCl, cCl, cCf, flat); mixLch(cCd, cCd, cCf, flat); }
        var lit = colourExact ? BODY : lchHex(cLit), field = colourExact ? BODY : lchHex(cField), dark = colourExact ? BODY : lchHex(cDark);
        var cl = colourExact ? CRES : lchHex(cCl), cf = colourExact ? CRES : lchHex(cCf), cd = colourExact ? CRES : lchHex(cCd);

        // page and drop shadow
        put(el.bg, "fill", colourExact ? BG : lchHex(rBg(sc, cBg)));
        put(el.drop, "opacity", fix3(0.16 * (1 - ss(t, 0.12, 0.55))));

        // ----- profile clocks and the crescent's inner edge (shared with the band's front) -----
        for (i = 0; i < NP; i++) {
          p = e + (eT - e) * wT[i] + (eB - e) * wB[i]; pc[i] = p;
          k = (NC + i) * 2;
          bufCres[k] = P0[2 * i] + (P1[2 * i] - P0[2 * i]) * p;
          bufCres[k + 1] = P0[2 * i + 1] + (P1[2 * i + 1] - P0[2 * i + 1]) * p;
        }

        // ----- coin body -----
        if (exact) {
          put(el.body, "d", BODY_PATH); put(el.body, "fill", BODY);
          put(el.m0, "stop-color", BODY); put(el.m1, "stop-color", BODY); put(el.m2, "stop-color", BODY);
        } else {
          put(el.body, "fill", "url(#tc-metal)");
          for (i = 0; i < NB; i++) {
            var rr = lerp(bodyR0[i], R, eEdge);
            x = CX + rr * bodyCos[i]; y = CY + rr * bodySin[i];
            if (chordY[i] >= 0 && eRet > 0) { x += (CHORD - x) * eRet; y += (chordY[i] - y) * eRet; }
            bufBody[2 * i] = x; bufBody[2 * i + 1] = y;
          }
          put(el.body, "d", eEdge >= 1 ? BODY_ARC + linesOfIdx(bufBody, rightIdx) + "Z" : pathOf(bufBody, NB));
          put(el.m0, "stop-color", lit); put(el.m1, "stop-color", field); put(el.m2, "stop-color", dark);
        }
        var patO = fix3(0.22 * (1 - ss(t, 0.05, 0.36)));
        put(el.pat1, "opacity", patO); put(el.pat2, "opacity", patO);

        // ----- band (the lit relief -> the light band) -----
        if (exact) {
          put(el.band, "d", "");           // only body + crescent composite over the page, exactly as the mark file does
          put(el.band, "fill", BG); put(el.f0, "stop-color", BG); put(el.f1, "stop-color", BG);
        } else {
          put(el.band, "fill", "url(#tc-face)");
          for (k = 0; k < NBAND; k++) {
            p = k < NBK ? eB + (eT - eB) * bandL[k] : k < NFR ? eT : k < NFR + NP ? pc[k - NFR] : eB;
            bufBand[2 * k] = band0[2 * k] + (band1[2 * k] - band0[2 * k]) * p;
            bufBand[2 * k + 1] = band0[2 * k + 1] + (band1[2 * k + 1] - band0[2 * k + 1]) * p;
          }
          put(el.band, "d", pathOf(bufBand, NBAND));
          rBandA(sc, cBa); rBandB(sc, cBb);
          if (flat > 0) { mixLch(cMid, cBa, cBb, 0.5); mixLch(cBa, cBa, cMid, flat); mixLch(cBb, cBb, cMid, flat); }
          put(el.f0, "stop-color", colourExact ? BG : lchHex(cBa)); put(el.f1, "stop-color", colourExact ? BG : lchHex(cBb));
        }

        // ----- crescent: the field in front of her face, rim to profile, between the band's corners -----
        if (exact) {
          put(el.cres, "d", CRES_PATH); put(el.cres, "fill", CRES);
          put(el.c0, "stop-color", CRES); put(el.c1, "stop-color", CRES); put(el.c2, "stop-color", CRES);
        } else {
          put(el.cres, "fill", "url(#tc-cresg)");
          var inset = 0.7 * (1 - eEdge);
          var aLast = Math.atan2(bufCres[(NC + NP - 1) * 2 + 1] - CY, bufCres[(NC + NP - 1) * 2] - CX);
          var aFirst = Math.atan2(bufCres[NC * 2 + 1] - CY, bufCres[NC * 2] - CX);
          for (i = 0; i < NC; i++) {
            var ang = aLast + (aFirst - aLast) * i / (NC - 1);
            var rc = lerp(rimR0(ang), R, eEdge) - inset;
            bufCres[2 * i] = CX + rc * Math.cos(ang); bufCres[2 * i + 1] = CY + rc * Math.sin(ang);
          }
          put(el.cres, "d", (eEdge >= 1 && eT >= 1 && eB >= 1) ? CRES_ARC + linesOf(bufCres, NC, NP) + "Z" : pathOf(bufCres, NC + NP));
          put(el.c0, "stop-color", cl); put(el.c1, "stop-color", cf); put(el.c2, "stop-color", cd);
        }

        // ----- cast shadow of the relief along the profile (on the field, over the crescent) -----
        var stripO = 0.85 * (1 - ss(t, 0.30, 0.62));
        if (stripO > 0) {
          for (i = 0; i < NP; i++) {
            k = NP - 1 - i; var tw = Math.min(1, k / 22) * (1 - e);
            bufStrip[2 * i] = bufCres[(NC + k) * 2] + SHADOW[0] * tw; bufStrip[2 * i + 1] = bufCres[(NC + k) * 2 + 1] + SHADOW[1] * tw;
            bufStrip[2 * (NP + i)] = bufCres[(NC + i) * 2]; bufStrip[2 * (NP + i) + 1] = bufCres[(NC + i) * 2 + 1];
          }
          put(el.strip, "d", pathOf(bufStrip, NP * 2));
        } else put(el.strip, "d", "");
        put(el.strip, "fill", colourExact ? BODY : lchHex(rStrip(sc, cMisc)));
        put(el.strip, "opacity", fix3(stripO));

        // ----- hair: the illustrated mass -> a skull cap hugging the band's edge (over the top too) -> a sliver on the cut -----
        if (hairO > 0) {
          for (m = 0; m < NE; m++) {                       // the band's edge from N up to H and on along its top, with outward normals
            k = m < NHL ? IN + m : NBK + (m - NHL);
            eP[2 * m] = bufBand[2 * k]; eP[2 * m + 1] = bufBand[2 * k + 1];
          }
          for (m = 0; m < NE; m++) {
            k0 = m > 0 ? m - 1 : m; k1 = m < NE - 1 ? m + 1 : m;
            tx = eP[2 * k1] - eP[2 * k0]; ty = eP[2 * k1 + 1] - eP[2 * k0 + 1]; len = Math.hypot(tx, ty) || 1;
            eN[2 * m] = ty / len; eN[2 * m + 1] = -tx / len;
          }
          for (j = 0; j < NHO; j++) {                      // outer contour: contour point j sits d behind edge point eIdx[j]
            var f = eIdx[j]; k0 = Math.floor(f); k1 = k0 < NE - 1 ? k0 + 1 : k0; var fr = f - k0;
            var ex = eP[2 * k0] + (eP[2 * k1] - eP[2 * k0]) * fr, ey = eP[2 * k0 + 1] + (eP[2 * k1 + 1] - eP[2 * k0 + 1]) * fr;
            nx = eN[2 * k0] + (eN[2 * k1] - eN[2 * k0]) * fr; ny = eN[2 * k0 + 1] + (eN[2 * k1 + 1] - eN[2 * k0 + 1]) * fr;
            len = Math.hypot(nx, ny) || 1; nx /= len; ny /= len;
            var room = lerp(rimR0(Math.atan2(ey - CY, ex - CX)), R, eEdge) - Math.hypot(ex - CX, ey - CY) - 1.5;   // stay inside the coin
            var dj = capDj[j] * shrink; if (dj > room) dj = room < 0 ? 0 : room;
            w = cA + (cAc - cA) * wCh[j];
            x = ex + nx * dj; y = ey + ny * dj;
            bufHair[2 * j] = hairOut0[2 * j] + (x - hairOut0[2 * j]) * w;
            bufHair[2 * j + 1] = hairOut0[2 * j + 1] + (y - hairOut0[2 * j + 1]) * w;
            if (hiO > 0 && j >= HI0 && j <= HI1) {          // crown highlight, inset 4 inside the same contour
              d = Math.max(1.5, dj - 4); x = ex + nx * d; y = ey + ny * d; i = j - HI0;
              bufHi[2 * i] = hi0[2 * i] + (x - hi0[2 * i]) * w; bufHi[2 * i + 1] = hi0[2 * i + 1] + (y - hi0[2 * i + 1]) * w;
            }
            if (fine > 0 && j >= FI0 && j <= FI1) {          // fillet, inset 18
              d = Math.max(1, dj - 18); x = ex + nx * d; y = ey + ny * d; i = j - FI0;
              bufFil[2 * i] = fil0[2 * i] + (x - fil0[2 * i]) * w; bufFil[2 * i + 1] = fil0[2 * i + 1] + (y - fil0[2 * i + 1]) * w;
            }
          }
          for (m = 0; m < NE; m++) {                       // the edge itself, tucked under the band
            i = NHO + m;
            bufHair[2 * i] = eP[2 * m] - eN[2 * m] * PUSH; bufHair[2 * i + 1] = eP[2 * m + 1] - eN[2 * m + 1] * PUSH;
          }
          put(el.hair, "d", pathOf(bufHair, NHO + NE));
          put(el.hairhi, "d", hiO > 0 ? pathOf(bufHi, NHI, true) : "");
          put(el.fillet, "d", fine > 0 ? (cA > 0 ? pathOf(bufFil, NFI, true) : fillet0) : "");
        } else { put(el.hair, "d", ""); put(el.hairhi, "d", ""); put(el.fillet, "d", ""); }
        rHair(sc, cHair);
        put(el.h0, "stop-color", colourExact ? BODY : lchHex(mixLch(cH, cHair, cLit, mg)));
        put(el.h1, "stop-color", colourExact ? BODY : lchHex(mixLch(cH, cHair, cField, mg)));
        put(el.h2, "stop-color", colourExact ? BODY : lchHex(mixLch(cH, cHair, cDark, mg)));
        put(el.hair, "opacity", fix3(hairO));
        put(el.hairhi, "opacity", fix3(hiO));

        // ----- fine detail: strands, fillet and necklace go first; the features ride with the face while they fade -----
        put(el.strands, "opacity", fix3(fine));
        put(el.fillet, "opacity", fix3(fine));
        put(el.necklace, "opacity", fix3(fine));
        var dx = bufCres[(NC + FEAT_IDX) * 2] - P0[2 * FEAT_IDX], dy = bufCres[(NC + FEAT_IDX) * 2 + 1] - P0[2 * FEAT_IDX + 1];
        put(el.feat, "transform", "translate(" + r2(dx) + " " + r2(dy) + ")");
        put(el.feat, "opacity", fix3(feat));

        // ----- raised rim and bead border dissolve into the edge -----
        var eRim = ss(t, 0.10, 0.60);
        put(el.rim, "r", fix3(lerp(270, R, eRim)));
        put(el.rim, "stroke", dark);
        put(el.rim, "stroke-width", fix3(4 * (1 - eRim)));
        put(el.rim, "opacity", fix3(0.55 * (1 - ss(t, 0.25, 0.60))));
        var br = lerp(256, R, eRim);
        put(el.beads, "r", fix3(br));
        put(el.beads, "stroke", lchHex(rBead(sc, cMisc)));
        put(el.beads, "stroke-width", fix3(9 * (1 - eRim)));
        put(el.beads, "stroke-dasharray", "0 " + fix3(2 * Math.PI * br / 56));
        put(el.beads, "opacity", fix3(1 - ss(t, 0.30, 0.60)));

        // ----- legend · ΘΗΡΑ slides out to the rim and shrinks into it -----
        var eL = ss(t, 0.14, 0.56), lO = fix3(1 - ss(t, 0.28, 0.56)), lr = fix3(-lerp(226, R, eL)), lsc = fix3(1 - eL);
        var inkC = lchHex(rInk(sc, cMisc));
        for (k = 0; k < 5; k++) {
          put(el.letters[k], "transform", "translate(320 320) rotate(" + LETTER_ANG[k] + ") translate(0 " + lr + ") scale(" + lsc + ")");
          put(el.letters[k], "stroke", inkC);
          put(el.letters[k], "opacity", lO);
        }
      }

      return {
        set: set,
        destroy: function () { last.clear(); container.innerHTML = ""; }
      };
    }
  };
})();
