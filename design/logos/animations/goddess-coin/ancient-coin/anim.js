// thera. logo animation — track "goddess-coin", approach "ancient-coin".
// A worn Greek bronze coin (tetradrachm style) with the goddess in low relief
// becomes the two-tone "Goddess on the coin" mark.
//
// Every hero mass is a closed polyline sampled from matched segment lists, so
// each illustration shape and its logo shape have the same point count and the
// morph is a point-wise lerp (no flubber needed for the heroes):
//   body     : the worn, irregular coin             -> the disc (#466680); its right half retracts under the band at the end
//   band     : the lit face and neck (ivory gold)   -> the light band (page colour): the hairline straightens into the vertical cut,
//              the top and base of the relief grow out to the rim
//   crescent : the flat coin field in front of her face, rim to profile, with the legend on it
//                                                   -> the crescent (#8DA8BB); its inner edge is the profile throughout
//   hair     : hair, fillet, chignon (in shadow)    -> a sliver along the cut, same colour as the body, then gone
// Beads, legend, raised rim, cast shadow, eye, ear, necklace fold into the rim or the masses in the first 60%.
// Colour travels in OKLCH along the "dusk" arc: bronze -> copper -> dusty rose -> mauve -> slate -> Blue Haze
// (the shorter arc through yellow-green is olive mud; the sunset arc is never muddy).
(function () {
  "use strict";

  var CX = 320, CY = 320, R = 280;
  var BG = "#F7F9FA", BODY = "#466680", CRES = "#8DA8BB";
  var BODY_PATH = "M 240 51.7 A 280 280 0 0 0 240 588.3 Z";
  var CRES_PATH = "M 360 597.1 A 280 280 0 0 0 360 42.9 A 400 400 0 0 1 366 170 L 433.2 315.4 A 20 20 0 0 1 427.1 339.7 L 387 370 L 388.9 421.9 A 80 80 0 0 1 375 532.4 A 40 40 0 0 0 360 563.7 L 360 597.1 Z";
  var BAND_PATH = "M 240 588.3 L 240 51.7 A 280 280 0 1 1 240 588.3 Z";

  // ---------- colour: hex <-> OKLab / OKLCH ----------
  function hexToRgb(h) {
    return [parseInt(h.slice(1, 3), 16) / 255, parseInt(h.slice(3, 5), 16) / 255, parseInt(h.slice(5, 7), 16) / 255];
  }
  function lin(c) { return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); }
  function gam(c) { c = Math.max(0, Math.min(1, c)); return c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055; }
  function rgbToLab(rgb) {
    var r = lin(rgb[0]), g = lin(rgb[1]), b = lin(rgb[2]);
    var l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
    var m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
    var s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
    return [0.2104542553 * l + 0.7936177850 * m - 0.0040720468 * s,
            1.9779984951 * l - 2.4285922050 * m + 0.4505937099 * s,
            0.0259040371 * l + 0.7827717662 * m - 0.8086757660 * s];
  }
  function labToHex(L, a, b) {
    var l = L + 0.3963377774 * a + 0.2158037573 * b;
    var m = L - 0.1055613458 * a - 0.0638541728 * b;
    var s = L - 0.0894841775 * a - 1.2914855480 * b;
    l = l * l * l; m = m * m * m; s = s * s * s;
    var r = 4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
    var g = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
    var bb = -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s;
    var out = "#";
    [r, g, bb].forEach(function (c) { var v = Math.round(gam(c) * 255); out += (v < 16 ? "0" : "") + v.toString(16); });
    return out.toUpperCase();
  }
  function toLch(hex) {
    var lab = rgbToLab(hexToRgb(hex));
    return { L: lab[0], C: Math.hypot(lab[1], lab[2]), h: Math.atan2(lab[2], lab[1]) * 180 / Math.PI };
  }
  // makeMix(a, b) -> s => hex. OKLCH, hue turning the "dusk" way (decreasing: gold -> copper -> rose -> mauve -> blue).
  // A near-neutral end borrows the other end's hue so the pale ivory just loses chroma. Exact ends at s <= 0 / s >= 1.
  function makeMix(hexA, hexB) {
    var A = toLch(hexA), B = toLch(hexB);
    var hA = A.h, hB = B.h;
    if (A.C < 0.012) hA = hB; else if (B.C < 0.012) hB = hA;
    while (hB > hA) hB -= 360;
    if (hA - hB > 340) hB += 360;
    var span = Math.min(1, Math.abs(hB - hA) / 180);
    return function (s) {
      if (s <= 0) return hexA;
      if (s >= 1) return hexB;
      var hs = ss(s, 0, 0.75);                                   // hue arrives before lightness and chroma settle
      var L = A.L + (B.L - A.L) * s;
      var C = (A.C + (B.C - A.C) * s) * (1 - 0.32 * span * Math.sin(Math.PI * s));  // dusty, not candy, through rose and violet
      var h = (hA + (hB - hA) * hs) * Math.PI / 180;
      return labToHex(L, C * Math.cos(h), C * Math.sin(h));
    };
  }
  // straight OKLab blend for near colours (flattening a gradient into its middle tone)
  function blend(hexA, hexB, s) {
    if (s <= 0) return hexA; if (s >= 1) return hexB;
    var a = rgbToLab(hexToRgb(hexA)), b = rgbToLab(hexToRgb(hexB));
    return labToHex(a[0] + (b[0] - a[0]) * s, a[1] + (b[1] - a[1]) * s, a[2] + (b[2] - a[2]) * s);
  }

  // ---------- easing ----------
  function ss(t, a, b) { var x = (t - a) / (b - a); x = x < 0 ? 0 : x > 1 ? 1 : x; return x * x * (3 - 2 * x); }
  function lerp(a, b, s) { return a + (b - a) * s; }

  // ---------- geometry: sample segment lists into point arrays ----------
  // ops: ["M",x,y] then ["L",n,x,y] | ["C",n,x1,y1,x2,y2,x,y] | ["A",n,r,large,sweep,x,y]
  function arcPts(x0, y0, r, large, sweep, x1, y1, n, out) {
    var mx = (x0 + x1) / 2, my = (y0 + y1) / 2;
    var xp = (x0 - x1) / 2, yp = (y0 - y1) / 2;
    var d2 = xp * xp + yp * yp;
    if (r * r < d2) r = Math.sqrt(d2);
    var k = Math.sqrt(Math.max(0, (r * r - d2) / d2));
    var sign = (large === sweep) ? -1 : 1;
    var cx = mx + sign * k * yp, cy = my - sign * k * xp;
    var a0 = Math.atan2(y0 - cy, x0 - cx), a1 = Math.atan2(y1 - cy, x1 - cx);
    var da = a1 - a0;
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
  function shift(pts, dx, dy) { return pts.map(function (p) { return [p[0] + dx, p[1] + dy]; }); }
  function pathOf(pts) {
    var s = "M" + pts[0][0].toFixed(2) + " " + pts[0][1].toFixed(2);
    for (var i = 1; i < pts.length; i++) s += "L" + pts[i][0].toFixed(2) + " " + pts[i][1].toFixed(2);
    return s + "Z";
  }
  function openPathOf(pts) { return pathOf(pts).slice(0, -1); }
  function lerpPts(A, B, s, out) {
    for (var i = 0; i < A.length; i++) { out[i] = [A[i][0] + (B[i][0] - A[i][0]) * s, A[i][1] + (B[i][1] - A[i][1]) * s]; }
    out.length = A.length;
    return out;
  }

  // ---------- the profile (H at the hairline down to W at the neck truncation) ----------
  var PROFILE0 = [
    ["M", 352, 190],
    ["C", 24, 364, 211, 369, 240, 365, 262],          // forehead to brow
    ["C", 30, 362, 281, 393, 303, 420, 334],          // bridge dip then the nose ridge
    ["A", 8, 9, 0, 1, 417, 349],                      // round tip
    ["L", 8, 388, 362],                               // underside to the nostril base
    ["C", 6, 389, 369, 395, 374, 396, 381],           // philtrum and upper lip
    ["C", 5, 397, 386, 390, 389, 387, 391],           // mouth corner
    ["C", 6, 395, 394, 398, 402, 393, 407],           // lower lip
    ["C", 4, 391, 410, 388, 411, 387, 412],           // into the chin cleft
    ["C", 28, 403, 420, 405, 452, 381, 468],          // chin
    ["C", 10, 371, 474, 364, 478, 362, 486],          // throat
    ["L", 14, 368, 548]                               // neck to the truncation
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

  var D = [11, 4];      // cast-shadow offset (light from the upper left)
  var OFF = [5, 2];     // how far the band's front tucks under the crescent (hidden overlap, no seam)

  // the worn coin edge as a radius function of angle (slightly out-of-round, a few chips)
  function rimR0(a) {
    var r = 276 + 3.2 * Math.cos(2 * a + 0.6) + 2.6 * Math.sin(3 * a + 1.1) + 1.8 * Math.sin(7 * a + 2.3) + 1.1 * Math.sin(13 * a + 0.4);
    var chips = [[0.9, 7], [2.6, 5], [4.4, 6]];
    for (var c = 0; c < chips.length; c++) { var dd = a - chips[c][0]; r -= chips[c][1] * Math.exp(-(dd * dd) / 0.012); }
    return r;
  }

  window.TheraAnimations = window.TheraAnimations || {};
  window.TheraAnimations["goddess-coin"] = {
    title: "Ancient coin to the mark",
    from: "Coin of Thera",
    to: "Goddess on the coin",
    viewBox: "0 0 640 640",
    mount: function (container) {
      // ----- precompute point sets -----
      var P0 = sampleOps(PROFILE0), P1 = sampleOps(PROFILE1), NP = P0.length;

      // crescent outer edge: the coin edge from W' (360,597.1) counter-clockwise through the right to H' (360,42.9)
      var NC = 80, aW = Math.atan2(597.1 - CY, 360 - CX), cresAng = [], cresR0 = [];
      for (var ci = 0; ci < NC; ci++) { var ca = aW - 2 * aW * ci / (NC - 1); cresAng.push(ca); cresR0.push(rimR0(ca)); }

      // band: back (Q -> N -> hairline -> H), top (H -> H''), front (H'' -> W'', the profile tucked under the crescent), base (W'' -> Q)
      var back0 = sampleOps([["M", 258, 548], ["L", 12, 252, 445],
        ["C", 12, 262, 400, 280, 350, 293, 322], ["C", 12, 300, 300, 298, 250, 312, 214], ["C", 12, 322, 196, 340, 188, 352, 190]]);
      var back1 = sampleOps([["M", 240, 588.3], ["L", 48, 240, 51.7]]);
      var NTOP = 12;
      var top0 = sampleOps([["M", 352, 190], ["L", NTOP, 352 + OFF[0], 190 + OFF[1]]]).slice(1);
      var top1 = []; arcPts(240, 51.7, R, 0, 1, 360, 42.9, NTOP, top1);
      var front0 = shift(P0, OFF[0], OFF[1]);
      var front1 = [[360, 42.9]]; arcPts(360, 42.9, R, 0, 1, 360, 597.1, NP - 1, front1);
      var base0 = sampleOps([["M", 368 + OFF[0], 548 + OFF[1]], ["L", NTOP, 258, 548]]).slice(1);
      var base1 = []; arcPts(360, 597.1, R, 0, 1, 240, 588.3, NTOP, base1);
      var NBK = back0.length, NFR = NBK + NTOP;
      var band0 = back0.concat(top0, front0, base0), band1 = back1.concat(top1, front1, base1), NBAND = band0.length;
      // per-point easing weights: bandL = how much of the outline lead (eT over eB) a point takes, so the forehead
      // and the top edge reach the rim first; bandW = blend toward the profile easing (e): 0 = outline, 1 = profile
      var bandW = [], bandL = [];
      for (var bw = 0; bw < NBAND; bw++) {
        if (bw < NBK) { bandW.push(0); bandL.push(ss(bw, 22, NBK - 1)); }
        else if (bw < NFR) { bandW.push((bw - NBK + 1) / NTOP); bandL.push(1); }
        else if (bw < NFR + NP) { bandW.push(1); bandL.push(0); }
        else { bandW.push(1 - (bw - NFR - NP + 1) / NTOP); bandL.push(0); }
      }

      // hair: outer contour (H -> crown -> back of head -> chignon -> N) then the hairline back to H (shared with the band)
      var hairOut0 = sampleOps([["M", 352, 190],
        ["C", 12, 345, 166, 322, 126, 290, 112], ["C", 12, 250, 94, 200, 124, 188, 180],
        ["C", 12, 178, 232, 184, 292, 198, 332], ["C", 12, 174, 338, 162, 394, 192, 420], ["C", 10, 216, 440, 238, 446, 252, 445]]);
      var yN = back1[12][1];
      var hairOut1 = sampleOps([["M", 236, 51.7], ["L", 58, 236, yN]]);
      var hair0 = hairOut0.concat(back0.slice(12, 49)), hair1 = hairOut1.concat(back1.slice(12, 49));
      var NHO = hairOut0.length, hairW = [], hairL = [];
      for (var hw = 0; hw < hair0.length; hw++) {
        hairW.push(hw < NHO ? Math.sin(Math.PI * hw / (NHO - 1)) : 0);
        hairL.push(hw < NHO ? 1 - hw / (NHO - 1) : bandL[12 + hw - NHO]);   // shared hairline points take the band's lead
      }
      var hairHi0 = hairOut0.slice(0, 25), hairHi1 = hairOut1.slice(0, 25);

      // coin body: irregular worn edge -> circle (sampled by angle). Once the band hides the right half, the right
      // arc (from (240,51.7) clockwise round to (240,588.3)) blends onto the chord x = 240 point by point, so every
      // intermediate body stays inside the disc and under the band, and nothing dark fringes the band's edges.
      var NB = 240, bodyR0 = [], bodyAng = [], chordY = [];
      var aTop = Math.atan2(51.7 - CY, 240 - CX) + 2 * Math.PI, aBot = Math.atan2(588.3 - CY, 240 - CX), aSpan = 2 * Math.PI - aTop + aBot;
      for (var i = 0; i < NB; i++) {
        var a = i / NB * 2 * Math.PI; bodyAng.push(a); bodyR0.push(rimR0(a));
        var u = a > aTop ? (a - aTop) / aSpan : a < aBot ? (a + 2 * Math.PI - aTop) / aSpan : -1;
        chordY.push(u < 0 ? -1 : 51.7 + u * (588.3 - 51.7));
      }

      // ----- colour ramps -----
      var mixBg = makeMix("#F4EFE5", BG);
      var mixLit = makeMix("#D3A657", BODY), mixField = makeMix("#AD7D3C", BODY), mixDark = makeMix("#7B5222", BODY);
      var mixCLit = makeMix("#D3A657", CRES), mixCField = makeMix("#AD7D3C", CRES), mixCDark = makeMix("#7B5222", CRES);
      var mixBandA = makeMix("#F3E0A9", BG), mixBandB = makeMix("#DBB96E", BG);
      var mixHair = makeMix("#86602E", BODY);
      var mixStrip = makeMix("#4E3214", BODY);
      var mixInk = makeMix("#6A4619", BODY);
      var mixBead = makeMix("#C99B4F", BODY);

      // ----- DOM -----
      var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      svg.setAttribute("viewBox", "0 0 640 640");
      svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
      svg.setAttribute("role", "img");
      svg.setAttribute("aria-label", "An ancient coin of Thera becoming the thera. mark");
      svg.style.willChange = "transform";   // own compositor layer: deterministic rasterisation while scrubbing (reverse check is pixel-exact)
      var ink = 'fill="none" stroke="#4A2E10" stroke-linecap="round" stroke-linejoin="round"';
      var letter = 'fill="none" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"';
      svg.innerHTML =
        '<defs>' +
          '<radialGradient id="tc-shadow" gradientUnits="userSpaceOnUse" cx="332" cy="338" r="292">' +
            '<stop offset="0" stop-color="#3A2A14"/><stop offset="0.9" stop-color="#3A2A14"/><stop offset="1" stop-color="#3A2A14" stop-opacity="0"/></radialGradient>' +
          '<radialGradient id="tc-metal" gradientUnits="userSpaceOnUse" cx="236" cy="214" r="372">' +
            '<stop id="tc-m0" offset="0"/><stop id="tc-m1" offset="0.58"/><stop id="tc-m2" offset="1"/></radialGradient>' +
          '<radialGradient id="tc-cresg" gradientUnits="userSpaceOnUse" cx="236" cy="214" r="372">' +
            '<stop id="tc-c0" offset="0"/><stop id="tc-c1" offset="0.58"/><stop id="tc-c2" offset="1"/></radialGradient>' +
          '<linearGradient id="tc-face" gradientUnits="userSpaceOnUse" x1="250" y1="150" x2="420" y2="520">' +
            '<stop id="tc-f0" offset="0"/><stop id="tc-f1" offset="1"/></linearGradient>' +
        '</defs>' +
        '<rect id="tc-bg" x="0" y="0" width="640" height="640"/>' +
        '<circle id="tc-drop" cx="332" cy="338" r="292" fill="url(#tc-shadow)"/>' +
        '<path id="tc-body"/>' +
        '<ellipse id="tc-pat2" cx="118" cy="292" rx="30" ry="17" transform="rotate(60 118 292)" fill="#4F8C7E"/>' +
        '<path id="tc-band"/>' +
        '<path id="tc-cres"/>' +
        '<ellipse id="tc-pat1" cx="470" cy="470" rx="42" ry="22" transform="rotate(-35 470 470)" fill="#4F8C7E"/>' +
        '<path id="tc-strip"/>' +
        '<path id="tc-hair"/>' +
        '<path id="tc-hairhi" fill="none" stroke="#F4DFA0" stroke-width="5" stroke-linecap="round"/>' +
        '<path id="tc-strands" fill="none" stroke="#5E4118" stroke-width="3" stroke-linecap="round" d="M346 182C312 158 264 160 222 196C206 212 198 240 196 280M328 150C292 122 242 128 208 164M226 388A30 30 0 1 1 166 388A30 30 0 1 1 226 388M212 380C200 372 186 384 194 396"/>' +
        '<path id="tc-fillet" fill="none" stroke="#C9A054" stroke-width="9" stroke-linecap="round" d="M338 172C300 136 245 134 206 168"/>' +
        '<g id="tc-feat">' +
          '<path ' + ink + ' stroke-width="4" d="M310 300C296 296 288 322 296 338C301 348 311 346 313 340M306 312C300 318 302 330 307 334"/>' +
          '<path ' + ink + ' stroke-width="3" d="M305 348L305 360"/>' +
          '<circle cx="305" cy="366" r="5" fill="#4A2E10"/>' +
          '<path ' + ink + ' stroke-width="3" d="M322 275C330 262 348 260 354 270C348 280 332 282 322 275Z"/>' +
          '<circle cx="340" cy="271" r="5" fill="#4A2E10"/>' +
          '<path ' + ink + ' stroke-width="3.5" d="M320 256C332 246 352 246 362 252"/>' +
          '<path ' + ink + ' stroke-width="3" d="M394 353C400 352 405 346 402 340"/>' +
          '<path ' + ink + ' stroke-width="3" d="M387 391L373 393"/>' +
        '</g>' +
        '<path id="tc-necklace" fill="none" stroke="#C9A054" stroke-width="5" stroke-linecap="round" stroke-dasharray="0 9" d="M262 522C290 536 340 538 366 528"/>' +
        '<circle id="tc-rim" cx="320" cy="320" fill="none"/>' +
        '<circle id="tc-beads" cx="320" cy="320" fill="none" stroke-linecap="round"/>' +
        '<g id="tc-l0" ' + letter + '><ellipse cx="0" cy="0" rx="13" ry="18"/><path d="M-7 0L7 0"/></g>' +
        '<g id="tc-l1" ' + letter + '><path d="M-11 -18L-11 18M11 -18L11 18M-11 0L11 0"/></g>' +
        '<g id="tc-l2" ' + letter + '><path d="M-10 18L-10 -18L3 -18A9 9 0 0 1 3 0L-10 0"/></g>' +
        '<g id="tc-l3" ' + letter + '><path d="M-13 18L0 -18L13 18M-7.5 4L7.5 4"/></g>';
      container.innerHTML = "";
      container.appendChild(svg);
      function $(id) { return svg.querySelector("#" + id); }
      var el = {
        bg: $("tc-bg"), drop: $("tc-drop"), body: $("tc-body"), pat1: $("tc-pat1"), pat2: $("tc-pat2"),
        band: $("tc-band"), cres: $("tc-cres"), strip: $("tc-strip"), hair: $("tc-hair"), hairhi: $("tc-hairhi"),
        strands: $("tc-strands"), fillet: $("tc-fillet"), feat: $("tc-feat"), necklace: $("tc-necklace"),
        rim: $("tc-rim"), beads: $("tc-beads"),
        m0: $("tc-m0"), m1: $("tc-m1"), m2: $("tc-m2"), c0: $("tc-c0"), c1: $("tc-c1"), c2: $("tc-c2"), f0: $("tc-f0"), f1: $("tc-f1"),
        letters: [$("tc-l0"), $("tc-l1"), $("tc-l2"), $("tc-l3")]
      };
      var LETTER_ANG = [57, 70, 83, 96];   // degrees clockwise from 12 o'clock, on the field in front of the face
      var FEAT_IDX = 30;                   // profile point near the bridge of the nose; the features ride with it
      var bufBand = [], bufCres = [], bufStrip = [], bufHair = [], bufHi = [], bodyPts = [];

      // write an attribute only when its value changed: cheaper, and keeps the raster identical frame to frame
      var last = new Map();
      function put(node, name, value) {
        var m = last.get(node); if (!m) { m = {}; last.set(node, m); }
        if (m[name] !== value) { m[name] = value; node.setAttribute(name, value); }
      }

      function set(t) {
        t = t < 0 ? 0 : t > 1 ? 1 : t;
        var e = ss(t, 0.08, 0.9);           // profile: crescent inner edge and the band's front
        var eB = ss(t, 0.06, 0.82);         // band outline: neck and lower hairline straighten, base reaches the rim
        var eT = ss(t, 0.04, 0.62);         // band top and forehead lead: the light grows up to the rim first
        var eH = ss(t, 0.14, 0.7);          // hair interior runs ahead of its junctions
        var eEdge = ss(t, 0, 0.6);          // coin edge regularises
        var eRet = ss(t, 0.64, 0.96);       // hidden right arc of the body folds onto the chord x = 240
        var sc = ss(t, 0.08, 0.92);         // colour (metal, band, hair, page)
        var lift = ss(t, 0.2, 0.8);         // the field in front of the face lightens into the moon (same hue journey as the body)
        var flat = ss(t, 0.5, 0.9);         // gradients flatten to their middle tone
        var fine = 1 - ss(t, 0.04, 0.26);   // strands, fillet, necklace, hair highlight
        var feat = 1 - ss(t, 0.1, 0.38);    // eye, brow, ear, nostril, mouth
        var exact = t >= 0.999;
        var i, k;

        // page and drop shadow
        put(el.bg, "fill", mixBg(sc));
        put(el.drop, "opacity", (0.16 * (1 - ss(t, 0.12, 0.55))).toFixed(3));

        // coin body: worn edge -> circle; flat fill at the end so it is pixel-exact against the logo file
        var field0 = mixField(sc), lit0 = mixLit(sc), dark0 = mixDark(sc), field = field0, lit = lit0, dark = dark0;
        if (flat > 0) { lit = blend(lit0, field0, flat); dark = blend(dark0, field0, flat); }
        if (exact) {
          put(el.body, "d", BODY_PATH);
          put(el.body, "fill", BODY);
        } else {
          put(el.body, "fill", "url(#tc-metal)");
          for (i = 0; i < NB; i++) {
            var rr = lerp(bodyR0[i], R, eEdge);
            var x = CX + rr * Math.cos(bodyAng[i]), y = CY + rr * Math.sin(bodyAng[i]);
            if (chordY[i] >= 0 && eRet > 0) { x += (240 - x) * eRet; y += (chordY[i] - y) * eRet; }
            bodyPts[i] = [x, y];
          }
          put(el.body, "d", pathOf(bodyPts));
          put(el.m0, "stop-color", lit); put(el.m1, "stop-color", field); put(el.m2, "stop-color", dark);
        }
        var patO = 0.22 * (1 - ss(t, 0.05, 0.36));
        put(el.pat1, "opacity", patO.toFixed(3)); put(el.pat2, "opacity", patO.toFixed(3));

        // band (the lit relief -> the light band)
        if (exact) {
          put(el.band, "d", BAND_PATH);
          put(el.band, "fill", BG);
        } else {
          put(el.band, "fill", "url(#tc-face)");
          for (k = 0; k < NBAND; k++) {
            var w = bandW[k], p = eB + (eT - eB) * bandL[k]; p += (e - p) * w;
            var bx = band0[k][0] + (band1[k][0] - band0[k][0]) * p, by = band0[k][1] + (band1[k][1] - band0[k][1]) * p;
            bufBand[k] = [bx, by];
          }
          bufBand.length = NBAND;
          put(el.band, "d", pathOf(bufBand));
          var fa = mixBandA(sc), fb = mixBandB(sc);
          if (flat > 0) { var mid = blend(fa, fb, 0.5); fa = blend(fa, mid, flat); fb = blend(fb, mid, flat); }
          put(el.f0, "stop-color", fa); put(el.f1, "stop-color", fb);
        }

        // crescent: the field in front of her face, rim to profile, lightening into the moon
        if (exact) {
          put(el.cres, "d", CRES_PATH);
          put(el.cres, "fill", CRES);
        } else {
          put(el.cres, "fill", "url(#tc-cresg)");
          var inset = 0.7 * (1 - eEdge);
          for (i = 0; i < NC; i++) {
            var rc = lerp(cresR0[i], R, eEdge) - inset;
            bufCres[i] = [CX + rc * Math.cos(cresAng[i]), CY + rc * Math.sin(cresAng[i])];
          }
          for (i = 0; i < NP; i++) bufCres[NC + i] = [lerp(P0[i][0], P1[i][0], e), lerp(P0[i][1], P1[i][1], e)];
          bufCres.length = NC + NP;
          put(el.cres, "d", pathOf(bufCres));
          var cf = blend(field0, mixCField(sc), lift), cl = blend(lit0, mixCLit(sc), lift), cd = blend(dark0, mixCDark(sc), lift);
          if (flat > 0) { cl = blend(cl, cf, flat); cd = blend(cd, cf, flat); }
          put(el.c0, "stop-color", cl); put(el.c1, "stop-color", cf); put(el.c2, "stop-color", cd);
        }

        // cast shadow of the relief along the profile (on the field, i.e. over the crescent)
        var stripO = 0.85 * (1 - ss(t, 0.3, 0.62));
        if (stripO > 0) {
          var sp = lerpPts(P0, P1, e, bufStrip), sh = [];
          for (k = sp.length - 1; k >= 0; k--) { var tw = Math.min(1, k / 22) * (1 - e); sh.push([sp[k][0] + D[0] * tw, sp[k][1] + D[1] * tw]); }
          put(el.strip, "d", pathOf(sh.concat(sp)));
          put(el.strip, "fill", mixStrip(sc));
        } else put(el.strip, "d", "");
        put(el.strip, "opacity", stripO.toFixed(3));

        // hair (in shadow) collapses into the cut and takes the body colour
        var hairO = 1 - ss(t, 0.45, 0.72);
        if (hairO > 0) {
          for (k = 0; k < hair0.length; k++) {
            var hb = eB + (eT - eB) * hairL[k], hp = hb + (eH - hb) * hairW[k];
            bufHair[k] = [hair0[k][0] + (hair1[k][0] - hair0[k][0]) * hp, hair0[k][1] + (hair1[k][1] - hair0[k][1]) * hp];
          }
          bufHair.length = hair0.length;
          put(el.hair, "d", pathOf(bufHair));
          put(el.hair, "fill", mixHair(sc));
        } else { put(el.hair, "d", ""); put(el.hair, "fill", BODY); }
        put(el.hair, "opacity", hairO.toFixed(3));
        var hiO = 0.9 * fine;
        put(el.hairhi, "d", hiO > 0 ? openPathOf(lerpPts(hairHi0, hairHi1, eH, bufHi)) : "");
        put(el.hairhi, "opacity", hiO.toFixed(3));

        // fine detail: the strands and fillet go first; the facial features ride with the face while they fade
        put(el.strands, "opacity", fine.toFixed(3));
        put(el.fillet, "opacity", fine.toFixed(3));
        put(el.necklace, "opacity", fine.toFixed(3));
        if (feat > 0) {
          var dx = (P1[FEAT_IDX][0] - P0[FEAT_IDX][0]) * e, dy = (P1[FEAT_IDX][1] - P0[FEAT_IDX][1]) * e;
          put(el.feat, "transform", "translate(" + dx.toFixed(2) + " " + dy.toFixed(2) + ")");
        }
        put(el.feat, "opacity", feat.toFixed(3));

        // raised rim and bead border dissolve into the edge
        var eRim = ss(t, 0.1, 0.6), inkC = mixInk(sc);
        put(el.rim, "r", lerp(270, R, eRim).toFixed(2));
        put(el.rim, "stroke", mixDark(sc));
        put(el.rim, "stroke-width", (4 * (1 - eRim)).toFixed(2));
        put(el.rim, "opacity", (0.55 * (1 - ss(t, 0.25, 0.6))).toFixed(3));
        var br = lerp(256, R, eRim);
        put(el.beads, "r", br.toFixed(2));
        put(el.beads, "stroke", mixBead(sc));
        put(el.beads, "stroke-width", (9 * (1 - eRim)).toFixed(2));
        put(el.beads, "stroke-dasharray", "0 " + (2 * Math.PI * br / 56).toFixed(3));
        put(el.beads, "opacity", (1 - ss(t, 0.3, 0.6)).toFixed(3));

        // legend ΘΗΡΑ slides out to the rim and shrinks into it
        var eL = ss(t, 0.14, 0.56), lO = 1 - ss(t, 0.28, 0.56), lr = lerp(226, R, eL), lsc = 1 - eL;
        for (k = 0; k < 4; k++) {
          put(el.letters[k], "transform", "translate(320 320) rotate(" + LETTER_ANG[k] + ") translate(0 " + (-lr).toFixed(2) + ") scale(" + lsc.toFixed(3) + ")");
          put(el.letters[k], "stroke", inkC);
          put(el.letters[k], "opacity", lO.toFixed(3));
        }
      }

      return {
        set: set,
        destroy: function () { last.clear(); container.innerHTML = ""; }
      };
    }
  };
})();
