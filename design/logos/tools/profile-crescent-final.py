"""thera. profile-crescent, final set ("Caldera and Sunken Head", mono first).

Builds every file in design/logos/final/profile-crescent/ from one parameter dict. The mark is one disc
(centre (32,32), r 28) split by a goddess profile: the ink crescent in front of the face is the cliffs of
Thera, the void behind the profile is the head, the half that sank. The island dot is knocked out of the
crescent where the gaze lands. Single colour is the primary; the two-tone fills the void with sea blue.

Everything is circles, arcs and straight lines. Usage:
  python3 profile-crescent-final.py <outDir> ['{"param": value, ...}']
"""
import math, sys, os, json

INK = "#223848"; PRIMARY = "#466680"; SEA = "#8DA8BB"; LIGHT = "#F7F9FA"; DARK = "#1C2E3D"

def fmt(v):
    s = f"{v:.2f}".rstrip("0").rstrip(".")
    return "0" if s in ("-0", "") else s
def pt(p): return f"{fmt(p[0])} {fmt(p[1])}"
def unit(a, b):
    dx, dy = b[0]-a[0], b[1]-a[1]; n = math.hypot(dx, dy); return (dx/n, dy/n)
def dist(a, b): return math.hypot(b[0]-a[0], b[1]-a[1])
def deg(a): return math.degrees(a)
def add(a, b, k=1): return (a[0]+k*b[0], a[1]+k*b[1])

def fillet(a, p, b, r):
    """Round the corner at p between segments a-p and p-b. Returns tangent points and centre."""
    u1 = unit(p, a); u2 = unit(p, b)
    ang = math.acos(max(-1, min(1, u1[0]*u2[0] + u1[1]*u2[1])))
    d = r / math.tan(ang/2)
    t1 = add(p, u1, d); t2 = add(p, u2, d)
    bis = unit((0, 0), (u1[0]+u2[0], u1[1]+u2[1]))
    cen = add(p, bis, r/math.sin(ang/2))
    return t1, t2, cen

def circ_circ(c1, r1, c2, r2):
    d = dist(c1, c2)
    a = (r1*r1 - r2*r2 + d*d) / (2*d)
    h = math.sqrt(max(r1*r1 - a*a, 0))
    u = unit(c1, c2); p2 = add(c1, u, a)
    return [(p2[0]+u[1]*h, p2[1]-u[0]*h), (p2[0]-u[1]*h, p2[1]+u[0]*h)]

def ray_circ(o, d, c, r):
    """Largest t >= 0 with |o + t d - c| = r."""
    f = (o[0]-c[0], o[1]-c[1])
    b = 2*(f[0]*d[0]+f[1]*d[1]); cc = f[0]*f[0]+f[1]*f[1]-r*r
    return (-b + math.sqrt(b*b - 4*cc)) / 2

def sweep(a, p, b):
    """SVG sweep flag for an arc a->b that passes through p."""
    cr = (p[0]-a[0])*(b[1]-p[1]) - (p[1]-a[1])*(b[0]-p[0])
    return 1 if cr > 0 else 0

def arc_bulge(a, b, bulge):
    """Circle through a and b whose arc bulges `bulge` to the left of a->b (screen coords)."""
    c = dist(a, b); r = (c*c/4 + bulge*bulge) / (2*bulge)
    mid = ((a[0]+b[0])/2, (a[1]+b[1])/2); t = unit(a, b); left = (t[1], -t[0])
    return r, add(mid, left, -(r - bulge))

def circle_fillet(c_in, r_in, c_out, r_out, rf, near):
    """Fillet circle of radius rf inside circle (c_in, r_in) and outside circle (c_out, r_out), nearest `near`.
    Returns (fillet centre, tangent point on inner circle, tangent point on outer circle)."""
    fc = min(circ_circ(c_in, r_in - rf, c_out, r_out + rf), key=lambda q: dist(q, near))
    return fc, add(c_in, unit(c_in, fc), r_in), add(c_out, unit(c_out, fc), r_out)

def line_circle_fillet(c_in, r_in, p, d, n, rf, near):
    """Fillet circle of radius rf inside circle (c_in, r_in) and on the +n side of the line p + t d
    (n is the unit normal toward the ink). Returns (fillet centre, tangent on circle, tangent on line)."""
    o = add(p, n, rf)                       # offset line
    f = (o[0]-c_in[0], o[1]-c_in[1]); rr = r_in - rf
    b = 2*(f[0]*d[0]+f[1]*d[1]); cc = f[0]*f[0]+f[1]*f[1]-rr*rr
    disc = math.sqrt(b*b - 4*cc)
    cands = [add(o, d, (-b + s*disc)/2) for s in (1, -1)]
    fc = min(cands, key=lambda q: dist(q, near))
    return fc, add(c_in, unit(c_in, fc), r_in), add(fc, n, -rf)

def A(r, sw, p, large=0): return f"A {fmt(r)} {fmt(r)} 0 {large} {sw} {pt(p)}"
def L(p): return f"L {pt(p)}"
def M(p): return f"M {pt(p)}"

# ----------------------------------------------------------------------------------------------
def build(P, ox=0.0, with_dot=True, style=None):
    """Returns (crescent path, dot subpath, head path, report). ox shifts the whole geometry in x (favicon centring).
    style "full" draws the whole profile; "cycladic" drops the lip plane and chin (nose only), for the favicon."""
    style = style or "full"
    Co = (32 + ox, 32); R = P["R"]
    hx = P["hair_x"] + ox; hy = Co[1] - math.sqrt(R*R - (hx-Co[0])**2); hair = (hx, hy)
    brow = (P["brow"][0]+ox, P["brow"][1]); tip = (P["tip"][0]+ox, P["tip"][1])
    mouth = (P["mouth"][0]+ox, P["mouth"][1]); lip = (P["lip"][0]+ox, P["lip"][1])
    rc = P["chin_r"]; apex_x = P["chin_apex_x"] + ox
    ccen = (apex_x - rc, lip[1] + math.sqrt(rc*rc - (lip[0]-(apex_x-rc))**2))
    rf, fcen = arc_bulge(hair, brow, P["forehead_bulge"])
    t1, t2, tcen = fillet(brow, tip, mouth, P["tip_r"])
    # throat on the chin circle, neck line to the rim
    ta = math.radians(P["throat_deg"]); Th = (ccen[0] + rc*math.cos(ta), ccen[1] + rc*math.sin(ta))
    na = math.radians(P["neck_deg"]); nd = (-math.cos(na), math.sin(na)); nn = (nd[1], -nd[0])   # normal toward the ink (+x)
    if style == "cycladic":
        # one straight line from under the nose to the rim, leaning like the neck
        Th = mouth; na = math.radians(P.get("cyc_neck_deg", 82)); nd = (-math.cos(na), math.sin(na)); nn = (nd[1], -nd[0])
    W = add(Th, nd, ray_circ(Th, nd, Co, R))
    # horn fillets (ink side): crown between the rim and the forehead circle, neck between the rim and the neck line
    cf = P["crown_fillet"]; nf = P["neck_fillet"]
    cfc, cT_rim, cT_fore = circle_fillet(Co, R, fcen, rf, cf, hair)
    nfc, nT_rim, nT_line = line_circle_fillet(Co, R, Th, nd, nn, nf, W)
    cmid = add(cfc, unit(cfc, hair), cf); nmid = add(nfc, unit(nfc, W), nf)
    # crescent: crown tangent -> rim clockwise over the top and down the right -> neck tangent -> fillet -> neck line
    #           -> throat -> chin arc up -> lip -> mouth -> tip fillet -> brow -> forehead up -> crown fillet -> Z
    a1 = math.atan2(-(cT_rim[1]-Co[1]), cT_rim[0]-Co[0]); a2 = math.atan2(-(nT_rim[1]-Co[1]), nT_rim[0]-Co[0])
    span = (a1 - a2) % (2*math.pi)
    # paths: crescent (ink) and head (its complement inside the disc), sharing the profile edge
    d = [M(cT_rim), A(R, 1, nT_rim, 1 if span > math.pi else 0),
         A(nf, sweep(nT_rim, nmid, nT_line), nT_line), L(Th)]
    d += [A(rc, 0, lip), L(mouth)] if style == "full" else []
    d += [L(t2), A(P["tip_r"], 0, t1), L(brow), A(rf, 0, cT_fore), A(cf, sweep(cT_fore, cmid, cT_rim), cT_rim), "Z"]
    crescent = " ".join(d)
    d = [M(nT_rim), A(R, 1, cT_rim, 1 if (2*math.pi - span) > math.pi else 0),
         A(cf, sweep(cT_rim, cmid, cT_fore), cT_fore), A(rf, 1, brow), L(t1), A(P["tip_r"], 1, t2)]
    d += [L(mouth), L(lip), A(rc, 1, Th)] if style == "full" else []
    d += [L(nT_line), A(nf, sweep(nT_line, nmid, nT_rim), nT_rim), "Z"]
    head = " ".join(d)
    dot = (P["dot"][0]+ox, P["dot"][1]); dr = P["dot_r"]
    dot_sub = " ".join([M((dot[0]-dr, dot[1])), A(dr, 1, (dot[0]+dr, dot[1]), 1), A(dr, 1, (dot[0]-dr, dot[1]), 1), "Z"])
    # ---- report
    def rim_x(y): return Co[0] + math.sqrt(R*R - (y-Co[1])**2)
    tip_inner = (tcen[0] + P["tip_r"], tcen[1])
    v = (brow[0]-fcen[0], brow[1]-fcen[1]); tang = (-v[1], v[0]); tang = tang if tang[1] >= 0 else (-tang[0], -tang[1])
    v2 = (hair[0]-fcen[0], hair[1]-fcen[1]); tang2 = (-v2[1], v2[0]); tang2 = tang2 if tang2[1] >= 0 else (-tang2[0], -tang2[1])
    tf = unit(fcen, hair); tf = (-tf[1], tf[0]); tr = unit(Co, hair); tr = (-tr[1], tr[0])
    trw = unit(Co, W); trw = (-trw[1], trw[0])
    # nearest ink edge to the dot: tip fillet circle, nose ridge, rim
    def seg_dist(p, a, b):
        ab = (b[0]-a[0], b[1]-a[1]); t = max(0, min(1, ((p[0]-a[0])*ab[0] + (p[1]-a[1])*ab[1]) / (ab[0]**2+ab[1]**2)))
        return dist(p, add(a, ab, t))
    rep = {
        "hair": [round(hair[0],2), round(hair[1],2)], "brow": list(brow), "tip": list(tip), "mouth": list(mouth), "lip": list(lip),
        "forehead_r": round(rf, 2), "forehead_centre": [round(fcen[0],2), round(fcen[1],2)],
        "forehead_tangent_at_hair_deg": round(deg(math.atan2(tang2[0], tang2[1])), 1),
        "forehead_tangent_at_brow_deg": round(deg(math.atan2(tang[0], tang[1])), 1),
        "nose_deg_from_vertical": round(deg(math.atan2(tip[0]-brow[0], tip[1]-brow[1])), 1),
        "nose_len": round(dist(brow, tip), 2), "tip_fillet_tangents": [[round(v,2) for v in t1], [round(v,2) for v in t2]],
        "underside_deg_below_horizontal": round(deg(math.atan2(mouth[1]-tip[1], tip[0]-mouth[0])), 1),
        "lip_len": round(dist(mouth, lip), 2), "lip_lean_deg": round(deg(math.atan2(lip[0]-mouth[0], lip[1]-mouth[1])), 1),
        "chin_centre": [round(ccen[0],2), round(ccen[1],2)], "chin_apex": [round(apex_x,2), round(ccen[1],2)],
        "chin_behind_tip": round(tip[0]-apex_x, 2),
        "throat": [round(Th[0],2), round(Th[1],2)], "neck_rim": [round(W[0],2), round(W[1],2)], "neck_len": round(dist(Th, W), 2),
        "crown_wedge_deg": round(deg(math.acos(abs(tf[0]*tr[0]+tf[1]*tr[1]))), 1),
        "neck_wedge_deg": round(deg(math.acos(abs(nd[0]*trw[0]+nd[1]*trw[1]))), 1),
        "crown_fillet": {"centre": [round(v,2) for v in cfc], "rim_tangent": [round(v,2) for v in cT_rim], "forehead_tangent": [round(v,2) for v in cT_fore]},
        "neck_fillet": {"centre": [round(v,2) for v in nfc], "rim_tangent": [round(v,2) for v in nT_rim], "neck_tangent": [round(v,2) for v in nT_line]},
        "profile_height": round(W[1]-hair[1], 2),
        "thirds": [round(brow[1]-hair[1],2), round(mouth[1]-brow[1],2), round(W[1]-mouth[1],2)],
        "ink_in_front_of_brow": round(rim_x(brow[1]) - brow[0], 2), "ink_in_front_of_tip": round(rim_x(tip[1]) - tip_inner[0], 2),
        "ink_in_front_of_chin": round(rim_x(ccen[1]) - apex_x, 2), "ink_beside_throat": round(rim_x(Th[1]) - Th[0], 2),
        "dot": list(dot), "dot_r": dr,
        "gap_dot_to_rim": round(R - dist(Co, dot) - dr, 2),
        "gap_dot_to_tip": round(dist(dot, tcen) - P["tip_r"] - dr, 2),
        "gap_dot_to_ridge": round(seg_dist(dot, brow, t1) - dr, 2),
        "gap_dot_to_brow": round(dist(dot, brow) - dr, 2),
        "ink_box_x": [round(min(cT_rim[0], nT_rim[0], cT_fore[0], nT_line[0]), 2), round(Co[0]+R, 2)],
        "horn_ends": {"crown": [[round(v,2) for v in cT_rim], [round(v,2) for v in cT_fore]], "neck": [[round(v,2) for v in nT_rim], [round(v,2) for v in nT_line]]},
        "crown_end_width": round(dist(cT_rim, cT_fore), 2), "neck_end_width": round(dist(nT_rim, nT_line), 2),
        "ink_box_y": [round(Co[1]-R, 2), round(Co[1]+R, 2)],
    }
    # crescent width (perpendicular to the forehead, to the rim) at a few heights, to show the horn is blunt
    widths = {}
    for y in (8, 10, 12, 14):
        # forehead x at y
        fx = fcen[0] + math.sqrt(rf*rf - (y-fcen[1])**2)
        widths[str(y)] = round(rim_x(y) - fx, 2) if y > cT_fore[1] else None
    rep["crescent_width_at_y_(horizontal)"] = widths
    return crescent, dot_sub, head, rep

def svg(body, comment, size=64, vb="0 0 64 64"):
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{vb}" width="{size}" height="{size}">\n'
            f'  <!-- {comment} -->\n{body}</svg>\n')

def mark_svg(crescent, dot_sub, color, comment):
    return svg(f'  <path fill="{color}" fill-rule="evenodd" d="{crescent} {dot_sub}"/>\n', comment)

def twotone_svg(crescent, dot_sub, head, ink, sea, comment, cx=32):
    return svg(f'  <path fill="{sea}" d="{head}"/>\n'
               f'  <path fill="{ink}" fill-rule="evenodd" d="{crescent} {dot_sub}"/>\n', comment)

# ----------------------------------------------------------------------------------------------
# Inter SemiBold at 44 px, letter-spacing -1.5, measured from an 8x canvas raster of "thera.":
# ink x 0.375..113.875 from the text origin; cap top -32 (h), t top -29.75, x-height top -24.25, baseline overshoot 0.5;
# the period's ink is x 107..113.875, y -6.5..0.375 (6.875 square); "thera" without the period ends at 101.875.
T = {"left": 0.375, "right": 113.875, "letters_right": 101.875, "cap": 32, "xh": 24.25, "period": (107, 113.875, -6.5, 0.375)}

def lockup_h(crescent, dot_sub, rep, scale, gap=15, margin=16, color=INK, size=44):
    """Mark with its disc centred on the cap band (cap top 24, baseline 56 at 44 px), ink-left at `margin`,
    `gap` px from the disc's right edge to the t's ink. ViewBox trimmed to the ink with `margin` each side."""
    disc_h = 56*scale; ty = 40 - disc_h/2 - 4*scale
    ink_left = rep["ink_box_x"][0]
    tx = margin - ink_left*scale
    if abs(tx) < 0.05: tx = 0.0; margin = ink_left*scale          # keep the transform clean when the ink lands on the margin anyway
    disc_right = tx + 60*scale
    text_x = disc_right + gap - T["left"]
    width = text_x + T["right"] + margin
    comment = (f"thera. horizontal lockup: profile-crescent mark at scale {scale:.4f} (disc {fmt(disc_h)} px, y {fmt(ty+4*scale)}..{fmt(ty+60*scale)}, "
               f"centred on the cap band of Inter 600 at {size} px: cap top 24, baseline 56, so the disc overshoots the cap height by {fmt((disc_h-32)/2)} px each way like an O); "
               f"crescent ink x {fmt(margin)}..{fmt(disc_right)}; {gap} px from the rim to the t's ink; period ink ends at x {fmt(text_x+T['right'])}; margins {fmt(margin)}. "
               f"The island dot ({fmt(2*rep['dot_r']*scale)} px) echoes the period ({fmt(T['period'][1]-T['period'][0])} px).")
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {fmt(width)} 80" width="{fmt(width)}" height="80">\n'
            f'  <!-- {comment} -->\n'
            f'  <g transform="translate({fmt(tx)} {fmt(ty)}) scale({scale:.4f})">\n'
            f'    <path fill="{color}" fill-rule="evenodd" d="{crescent} {dot_sub}"/>\n'
            f'  </g>\n'
            f'  <text x="{fmt(text_x)}" y="56" font-family="Inter, system-ui, sans-serif" font-size="{size}" font-weight="600" letter-spacing="-1.5" fill="{color}">thera.</text>\n'
            f'</svg>\n'), {"width": round(width, 2), "text_x": round(text_x, 2), "disc_right": round(disc_right, 2), "ty": round(ty, 2), "tx": round(tx, 2)}

def lockup_v(crescent, dot_sub, rep, scale, gap=16, margin=20, color=INK, size=44, axis_shift=0.0):
    """Mark above the wordmark. The mark's ink box is centred on the wordmark's optical axis (midway between the
    centre of 'thera' and the centre of 'thera.'), plus `axis_shift` in mark units (+x moves the mark right); the
    final set uses -2.5, which puts the crescent's ink centroid on the wordmark's ink centroid (measured from the raster)."""
    disc_h = 56*scale
    ink_w = (rep["ink_box_x"][1] - rep["ink_box_x"][0]) * scale
    text_w = T["right"] - T["left"]
    word_centre = ((T["left"] + T["letters_right"])/2 + (T["left"] + T["right"])/2) / 2   # from the text origin
    # layout: left margin = margin; text origin so that the wordmark ink starts at margin (the ink spans T.left..T.right)
    text_x = margin - T["left"]
    axis = text_x + word_centre
    mark_ink_left = axis - ink_w/2 + axis_shift*scale
    tx = mark_ink_left - rep["ink_box_x"][0]*scale
    ty = margin - 4*scale
    baseline = margin + disc_h + gap + T["cap"]
    width = margin + text_w + margin; height = baseline + 0.5 + margin
    # if the mark is wider than the text (it is not), widen; keep simple
    comment = (f"thera. stacked lockup: profile-crescent mark at scale {scale:.4f} (disc {fmt(disc_h)} px, ink {fmt(ink_w)} wide) above Inter 600 {size} px; "
               f"{gap} px from the rim to the cap height; the mark's ink box is centred on x {fmt(axis + axis_shift*scale)}, i.e. {fmt(-axis_shift*scale)} left of the wordmark's optical axis, "
               f"which puts the crescent's ink centroid on the wordmark's ink centroid (the period is light, so the word's centre of mass is left of its box centre); margins {margin}.")
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {fmt(width)} {fmt(height)}" width="{fmt(width)}" height="{fmt(height)}">\n'
            f'  <!-- {comment} -->\n'
            f'  <g transform="translate({fmt(tx)} {fmt(ty)}) scale({scale:.4f})">\n'
            f'    <path fill="{color}" fill-rule="evenodd" d="{crescent} {dot_sub}"/>\n'
            f'  </g>\n'
            f'  <text x="{fmt(text_x)}" y="{fmt(baseline)}" font-family="Inter, system-ui, sans-serif" font-size="{size}" font-weight="600" letter-spacing="-1.5" fill="{color}">thera.</text>\n'
            f'</svg>\n'), {"width": round(width,2), "height": round(height,2), "axis": round(axis,2), "baseline": round(baseline,2), "tx": round(tx,2)}

def app_icon(crescent, dot_sub, rep, scale, tile, color, head=None, head_color=None, dx=0.0):
    """64x64 rounded tile, rx 14, mark at `scale` with its ink box centred (+dx optical shift in mark units)."""
    ink_cx = (rep["ink_box_x"][0] + rep["ink_box_x"][1]) / 2
    tx = 32 - (ink_cx + dx)*scale; ty = 32 - 32*scale
    head_el = f'    <path fill="{head_color}" d="{head}"/>\n' if head else ""
    comment = (f"thera. app icon: profile-crescent at {int(scale*100)}% (disc {fmt(56*scale)} units, {int(56*scale/64*100)}% of the tile) on {tile}; "
               f"the crescent's ink box is centred on the tile{' with a ' + fmt(dx) + '-unit optical shift' if dx else ''}.")
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">\n'
            f'  <!-- {comment} -->\n'
            f'  <rect width="64" height="64" rx="14" fill="{tile}"/>\n'
            f'  <g transform="translate({fmt(tx)} {fmt(ty)}) scale({scale:.4f})">\n{head_el}'
            f'    <path fill="{color}" fill-rule="evenodd" d="{crescent} {dot_sub}"/>\n'
            f'  </g>\n</svg>\n')

# ----------------------------------------------------------------------------------------------
PARAMS = {
    "R": 28,
    "hair_x": 21, "brow": (25.8, 17), "forehead_bulge": 0.7,
    "tip": (35.2, 33), "tip_r": 2, "mouth": (29.9, 36.7), "lip": (30.3, 41.5),
    "chin_r": 8.5, "chin_apex_x": 33.2, "throat_deg": 38, "neck_deg": 76,
    "crown_fillet": 4, "neck_fillet": 4,
    "dot": (46.3, 28), "dot_r": 5.2,
    "favicon_ox": -8,          # favicon: the disc centre slides left so the crescent's ink is centred in the 16 px tile
    "favicon_style": "cycladic",
    # favicon: a Cycladic head (nose only), re-cut so that at 16 px (1 px = 4 units) the nose tip, the mouth corner and the
    # straight line below it sit on pixel boundaries once the disc has slid 8 left: tip (36,32)->(28,32), mouth (28,36)->(20,36)
    "favicon_overrides": {"brow": (26, 16), "tip": (36, 32), "mouth": (28, 36), "cyc_neck_deg": 90},
    "lockup_scale": 0.68,                 # disc 38.08 px beside 44 px type (cap 32): 3 px overshoot each way
    "stack_scale": 1.0, "stack_axis_shift": -2.5,   # puts the crescent's ink centroid (42.1, measured) on the wordmark's ink centroid
    "icon_scale": 0.72, "icon_dx": 0.0,   # disc 40.3 units, 63% of the tile
}

def main():
    out = sys.argv[1]; os.makedirs(out, exist_ok=True)
    P = dict(PARAMS)
    if len(sys.argv) > 2: P.update(json.loads(sys.argv[2]))
    cres, dot, head, rep = build(P)
    desc = (f"thera. mark, profile-crescent (Caldera and Sunken Head). One disc c(32,32) r28 split by a goddess profile looking right: "
            f"the ink crescent in front of the face is the cliffs of Thera, the void behind the profile is the head, the half that sank. "
            f"Profile: forehead arc r{fmt(rep['forehead_r'])} from the rim at ({pt(rep['hair'])}), straight nose ridge {fmt(rep['nose_deg_from_vertical'])} deg from vertical "
            f"({fmt(rep['nose_len'])} long) with an r{fmt(P['tip_r'])} tip, underside {fmt(rep['underside_deg_below_horizontal'])} deg, {fmt(rep['lip_len'])}-unit lip plane, "
            f"chin arc r{fmt(P['chin_r'])} (apex {fmt(rep['chin_behind_tip'])} behind the tip), throat at {P['throat_deg']} deg, neck to the rim at {P['neck_deg']} deg. "
            f"Both horns are blunted with r{fmt(P['crown_fillet'])} fillets (end chords {fmt(rep['crown_end_width'])} and {fmt(rep['neck_end_width'])}) so the crescent never tapers to a point. "
            f"The island dot r{fmt(P['dot_r'])} is knocked out at ({pt(rep['dot'])}), below eye level and ahead of the nose, where the gaze lands. "
            f"One path, evenodd, no strokes.")
    open(os.path.join(out, "mark.svg"), "w").write(mark_svg(cres, dot, INK, desc))
    open(os.path.join(out, "mark-light.svg"), "w").write(mark_svg(cres, dot, LIGHT, desc + " Light version for #1C2E3D and darker."))
    open(os.path.join(out, "mark-accent.svg"), "w").write(twotone_svg(cres, dot, head, PRIMARY, SEA,
        desc + " Two-tone: the crescent in the primary #466680, the sunken head filled in sea blue #8DA8BB (the one secondary element), so the disc is sealed."))
    open(os.path.join(out, "mark-duotone.svg"), "w").write(twotone_svg(cres, dot, head, INK, SEA,
        desc + " Colour mark: the crescent in ink, the sunken head in sea blue #8DA8BB."))
    # favicon: no dot, geometry slid left so the crescent is centred in the tile
    FP = {**P, **P.get("favicon_overrides", {})}
    fc, fdot, fhead, frep = build(FP, ox=P["favicon_ox"], with_dot=False, style=P.get("favicon_style", "full"))
    fdesc = (f"thera. favicon: the profile-crescent mark reduced to a Cycladic head: the same crescent, crown and nose, with no island dot (a 2 px speck at 16 px) "
             f"and no lip or chin (sub-pixel lumps at 16 px), one straight line from under the nose to the rim instead. The disc centre is slid {fmt(-P['favicon_ox'])} "
             f"units left to (24, 32) so the ink (x {fmt(frep['ink_box_x'][0])}..{fmt(frep['ink_box_x'][1])}) is centred in the tile, and at 16 px (1 px = 4 units) the nose tip (28,32), "
             f"the mouth corner (20,36), the vertical edge x 20 and the rim x 52 all sit on pixel boundaries. Use at 16 and 32 px; at 48 px and above use mark.svg.")
    open(os.path.join(out, "favicon.svg"), "w").write(svg(f'  <path fill="{INK}" d="{fc}"/>\n', fdesc))
    # app icons
    open(os.path.join(out, "app-icon.svg"), "w").write(app_icon(cres, dot, rep, P["icon_scale"], DARK, LIGHT, dx=P["icon_dx"]))
    open(os.path.join(out, "app-icon-light.svg"), "w").write(app_icon(cres, dot, rep, P["icon_scale"], LIGHT, INK, dx=P["icon_dx"]))
    open(os.path.join(out, "app-icon-duotone.svg"), "w").write(app_icon(cres, dot, rep, P["icon_scale"], DARK, LIGHT, head=head, head_color=PRIMARY, dx=P["icon_dx"]))
    # lockups
    lh, lhrep = lockup_h(cres, dot, rep, P["lockup_scale"])
    open(os.path.join(out, "lockup-horizontal.svg"), "w").write(lh)
    lv, lvrep = lockup_v(cres, dot, rep, P["stack_scale"], axis_shift=P["stack_axis_shift"])
    open(os.path.join(out, "lockup-stacked.svg"), "w").write(lv)
    print(json.dumps({"mark": rep, "favicon_ink_box_x": frep["ink_box_x"], "lockup_h": lhrep, "lockup_v": lvrep}, indent=1))
    print("CRESCENT:", cres); print("DOT:", dot); print("HEAD:", head)

if __name__ == "__main__":
    main()
