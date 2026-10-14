"""thera. profile-crescent generator (round 2, profile-led).

Variant A, "Caldera": an eccentric crescent (outer circle r28 at (32,32), caldera circle shifted right)
whose inner cliff edge on the thick side is the goddess profile, looking right at the island dot. All of A's
coordinates are given in the unshifted frame and moved right by PARAMS_A["ox"] (4) at build time, so the open C
sits optically centred in the 64 box (ink x 8..54) instead of hugging the left edge.
Variant B, "Sunken head": a disc split by the same profile; the front half is the ink crescent with the
dot knocked out where the gaze lands, the back half (the head) is muted blue, dropped in mono.

Everything is circles, arcs and straight lines. Usage:
  python3 profile-crescent.py <outDir>
"""
import math, sys, os, json

INK = "#223848"; SEA = "#8DA8BB"; LIGHT = "#F7F9FA"

def fmt(v):
    s = f"{v:.2f}".rstrip("0").rstrip(".")
    return "0" if s in ("-0", "") else s
def pt(p): return f"{fmt(p[0])} {fmt(p[1])}"
def unit(a, b):
    dx, dy = b[0]-a[0], b[1]-a[1]; n = math.hypot(dx, dy); return (dx/n, dy/n)
def dist(a, b): return math.hypot(b[0]-a[0], b[1]-a[1])
def deg(a): return math.degrees(a)

def fillet(a, p, b, r):
    """Round the corner at p between segments a-p and p-b. Returns tangent points and centre."""
    u1 = unit(p, a); u2 = unit(p, b)
    ang = math.acos(max(-1, min(1, u1[0]*u2[0] + u1[1]*u2[1])))
    d = r / math.tan(ang/2)
    t1 = (p[0]+u1[0]*d, p[1]+u1[1]*d); t2 = (p[0]+u2[0]*d, p[1]+u2[1]*d)
    bis = unit((0,0), (u1[0]+u2[0], u1[1]+u2[1]))
    cen = (p[0]+bis[0]*r/math.sin(ang/2), p[1]+bis[1]*r/math.sin(ang/2))
    return t1, t2, cen

def circ_circ(c1, r1, c2, r2):
    d = dist(c1, c2)
    a = (r1*r1 - r2*r2 + d*d) / (2*d)
    h = math.sqrt(max(r1*r1 - a*a, 0))
    u = unit(c1, c2); p2 = (c1[0]+u[0]*a, c1[1]+u[1]*a)
    return [(p2[0]+u[1]*h, p2[1]-u[0]*h), (p2[0]-u[1]*h, p2[1]+u[0]*h)]

def ray_circ(o, d, c, r):
    """Largest t >= 0 with |o + t d - c| = r."""
    f = (o[0]-c[0], o[1]-c[1])
    b = 2*(f[0]*d[0]+f[1]*d[1]); cc = f[0]*f[0]+f[1]*f[1]-r*r
    disc = b*b - 4*cc
    return (-b + math.sqrt(disc)) / 2

def on_circle(c, r, ang_deg):
    """Point on a circle at ang_deg measured counter-clockwise from +x, y up (screen y down)."""
    a = math.radians(ang_deg); return (c[0] + r*math.cos(a), c[1] - r*math.sin(a))

def sweep(a, p, b):
    """SVG sweep flag for an arc a->b that passes through p."""
    cr = (p[0]-a[0])*(b[1]-p[1]) - (p[1]-a[1])*(b[0]-p[0])
    return 1 if cr > 0 else 0

def arc_bulge(a, b, bulge):
    """Circle through a and b whose arc bulges `bulge` to the left of a->b (screen coords: left of
    direction (dx,dy) is (dy,-dx)). Returns r and centre."""
    c = dist(a, b); r = (c*c/4 + bulge*bulge) / (2*bulge)
    mid = ((a[0]+b[0])/2, (a[1]+b[1])/2); t = unit(a, b); left = (t[1], -t[0])
    h = r - bulge
    cen = (mid[0]-left[0]*h, mid[1]-left[1]*h)
    return r, cen

def circle_fillet(c_in, r_in, c_out, r_out, rf, near):
    """Fillet circle of radius rf inside circle (c_in, r_in) and outside circle (c_out, r_out), nearest `near`.
    Returns (fillet centre, tangent point on inner circle, tangent point on outer circle)."""
    cands = circ_circ(c_in, r_in - rf, c_out, r_out + rf)
    fc = min(cands, key=lambda q: dist(q, near))
    u1 = unit(c_in, fc); t_in = (c_in[0]+u1[0]*r_in, c_in[1]+u1[1]*r_in)
    u2 = unit(c_out, fc); t_out = (c_out[0]+u2[0]*r_out, c_out[1]+u2[1]*r_out)
    return fc, t_in, t_out

def A(r, sw, p, large=0): return f"A {fmt(r)} {fmt(r)} 0 {large} {sw} {pt(p)}"
def L(p): return f"L {pt(p)}"
def M(p): return f"M {pt(p)}"

# ----------------------------------------------------------------------------------------------
def profile_chain(P, going_down=True):
    """Common profile: hair -> forehead arc -> brow -> nose ridge -> filleted tip -> underside ->
    mouth -> lip plane -> chin arc -> throat. Returns list of (kind, ...) segments and a report."""
    hair = tuple(P["hair"]); brow = tuple(P["brow"]); tip = tuple(P["tip"]); mouth = tuple(P["mouth"])
    lip = tuple(P["lip"]); rc = P["chin_r"]; apex_x = P["chin_apex_x"]
    ccen = (apex_x - rc, lip[1] + math.sqrt(rc*rc - (lip[0]-(apex_x-rc))**2))
    # forehead arc through hair and brow with given bulge (forward = +x)
    rf, fcen = arc_bulge(hair, brow, P["forehead_bulge"])   # left of hair->brow (going down) is +x: bulges forward
    t1, t2, tcen = fillet(brow, tip, mouth, P["tip_r"])
    rep = {
        "forehead_r": round(rf, 2), "forehead_centre": [round(fcen[0],2), round(fcen[1],2)],
        "forehead_chord_deg_from_vertical": round(deg(math.atan2(brow[0]-hair[0], brow[1]-hair[1])), 1),
        "nose_deg_from_vertical": round(deg(math.atan2(tip[0]-brow[0], tip[1]-brow[1])), 1),
        "nose_len": round(dist(brow, tip), 2),
        "underside_deg_below_horizontal": round(deg(math.atan2(mouth[1]-tip[1], tip[0]-mouth[0])), 1),
        "lip_len": round(dist(mouth, lip), 2),
        "lip_lean_deg": round(deg(math.atan2(lip[0]-mouth[0], lip[1]-mouth[1])), 1),
        "chin_centre": [round(ccen[0],2), round(ccen[1],2)], "chin_apex": [round(apex_x,2), round(ccen[1],2)],
        "chin_behind_tip": round(tip[0]-apex_x, 2),
        "tip_inner_x": round(tcen[0] + P["tip_r"], 2),
    }
    # tangent angle of the forehead at the brow (from vertical, +ve leaning forward going down)
    v = (brow[0]-fcen[0], brow[1]-fcen[1]); tang = (-v[1], v[0])  # rotate 90
    if tang[1] < 0: tang = (-tang[0], -tang[1])
    rep["forehead_tangent_at_brow_deg"] = round(deg(math.atan2(tang[0], tang[1])), 1)
    v = (hair[0]-fcen[0], hair[1]-fcen[1]); tang = (-v[1], v[0])
    if tang[1] < 0: tang = (-tang[0], -tang[1])
    rep["forehead_tangent_at_hair_deg"] = round(deg(math.atan2(tang[0], tang[1])), 1)
    rep["bridge_bend_deg"] = round(rep["nose_deg_from_vertical"] - rep["forehead_tangent_at_brow_deg"], 1)
    return dict(hair=hair, brow=brow, tip=tip, mouth=mouth, lip=lip, rc=rc, ccen=ccen, rf=rf, fcen=fcen,
                t1=t1, t2=t2, tcen=tcen), rep

# ----------------------------------------------------------------------------------------------
def shift_x(P, ox):
    """Copy of the parameter dict with every x coordinate moved by ox (optical centring of the open C)."""
    Q = dict(P)
    for k in ("ci", "hair", "brow", "tip", "mouth", "lip", "dot"):
        Q[k] = (P[k][0] + ox, P[k][1])
    Q["chin_apex_x"] = P["chin_apex_x"] + ox
    return Q

def build_a(P, color=INK):
    ox = P.get("ox", 0); P = shift_x(P, ox)
    Co = (32 + ox, 32); R = P["R"]; Ci = tuple(P["ci"]); ri = P["ri"]; th = P["horn_deg"]
    g, rep = profile_chain(P)
    # hair must sit on the inner circle (given y, solve x on the left side)
    hy = g["hair"][1]; hx = Ci[0] - math.sqrt(ri*ri - (hy-Ci[1])**2)
    assert abs(hx - g["hair"][0]) < 0.05, f"hair x should be {hx:.2f}"
    # throat: chin circle meets the inner circle, the intersection just past the apex (larger x)
    W = max(circ_circ(g["ccen"], g["rc"], Ci, ri), key=lambda p: p[0])
    # horn cuts along rays from Co at +-th
    def horn(sign):
        d = (math.cos(math.radians(th)), -sign*math.sin(math.radians(th)))
        Po = (Co[0]+R*d[0], Co[1]+R*d[1])
        ti = ray_circ(Co, d, Ci, ri); Pi = (Co[0]+ti*d[0], Co[1]+ti*d[1])
        width = R - ti
        mid = ((Po[0]+Pi[0])/2, (Po[1]+Pi[1])/2)
        t = (math.sin(math.radians(th)), sign*math.cos(math.radians(th)))   # tangential, toward the opening
        capmid = (mid[0]+t[0]*width/2, mid[1]+t[1]*width/2)
        return Po, Pi, width, capmid
    Pou, Piu, wu, cmu = horn(+1)
    Pol, Pil, wl, cml = horn(-1)
    style = P.get("horn_style", "round")
    def cap(Pfrom, Pto, w, cm):
        return A(w/2, sweep(Pfrom, cm, Pto), Pto) if style == "round" else L(Pto)
    # fillets (light-side rounding) at the hairline and the throat
    fh = P.get("hair_fillet", 0); ft = P.get("throat_fillet", 0)
    if fh > 0:
        hc, hT_in, hT_fore = circle_fillet(Ci, ri, g["fcen"], g["rf"], fh, g["hair"])
        hmid = (hc[0] + unit(hc, g["hair"])[0]*fh, hc[1] + unit(hc, g["hair"])[1]*fh)
    if ft > 0:
        tc_, tT_in, tT_chin = circle_fillet(Ci, ri, g["ccen"], g["rc"], ft, W)
        tmid = (tc_[0] + unit(tc_, W)[0]*ft, tc_[1] + unit(tc_, W)[1]*ft)
    # path: outer arc from upper horn over the top, down the left, to the lower horn (ccw visually = sweep 0)
    d = [M(Pou), A(R, 0, Pol, 1)]
    d.append(cap(Pol, Pil, wl, cml))                                  # lower horn end
    if ft > 0:
        d += [A(ri, 1, tT_in), A(ft, sweep(tT_in, tmid, tT_chin), tT_chin), A(g["rc"], 0, g["lip"])]
    else:
        d += [A(ri, 1, W), A(g["rc"], 0, g["lip"])]                   # inner circle to throat, chin arc up
    d += [L(g["mouth"]), L(g["t2"]), A(P["tip_r"], 0, g["t1"]), L(g["brow"])]
    if fh > 0:
        d += [A(g["rf"], 0, hT_fore), A(fh, sweep(hT_fore, hmid, hT_in), hT_in), A(ri, 1, Piu)]
    else:
        d += [A(g["rf"], 0, g["hair"]), A(ri, 1, Piu)]                # forehead up, inner circle to upper horn
    d.append(cap(Piu, Pou, wu, cmu))                                  # upper horn end
    d.append("Z")
    path = " ".join(d)
    dot = tuple(P["dot"]); dr = P["dot_r"]
    # report
    rep.update({
        "throat": [round(W[0],2), round(W[1],2)],
        "band_back": round((Ci[0]-ri) - (Co[0]-R), 2), "band_top": round((Ci[1]-ri) - (Co[1]-R), 2),
        "band_at_horn_cut": round(wu, 2), "horn_tip_x": round(cmu[0]+ (wu/2)*math.sin(math.radians(th)), 2),
        "horn_upper_cap_centre": [round(cmu[0]-0,2), round(cmu[1],2)],
        "nose_protrusion_past_inner_circle": round(g["tip"][0] - (Ci[0]-math.sqrt(ri*ri-(g["tip"][1]-Ci[1])**2)), 2),
        "gap_tip_to_dot": round(dist(g["tip"], dot) - dr, 2),
        "gap_dot_to_inner_circle": round(ri - dist(Ci, dot) - dr, 2),
        "gap_brow_to_dot": round(dist(g["brow"], dot) - dr, 2),
        "gap_dot_to_upper_horn_inner": round(dist(dot, Piu) - dr, 2),
        "profile_height": round(W[1]-g["hair"][1], 2),
        "thirds": [round(g["brow"][1]-g["hair"][1],2), round(g["mouth"][1]-g["brow"][1],2), round(W[1]-g["mouth"][1],2)],
        "caldera_box": [Ci[0]-ri, Ci[1]-ri, Ci[0]+ri, Ci[1]+ri],
        "ox": ox, "ink_box_x": [Co[0]-R, round(Pou[0], 2)],
    })
    # angle between chin arc and inner circle at W (light-side corner)
    tc = unit(g["ccen"], W); tc = (-tc[1], tc[0])     # chin tangent (clockwise)
    ti = unit(Ci, W); ti = (-ti[1], ti[0])
    rep["throat_corner_deg"] = round(deg(math.acos(abs(tc[0]*ti[0]+tc[1]*ti[1]))), 1)
    # hairline corner: angle between forehead tangent and inner circle tangent at hair
    tf = unit(g["fcen"], g["hair"]); tf = (-tf[1], tf[0])
    tj = unit(Ci, g["hair"]); tj = (-tj[1], tj[0])
    rep["hair_corner_deg"] = round(deg(math.acos(abs(tf[0]*tj[0]+tf[1]*tj[1]))), 1)
    if fh > 0: rep["hair_fillet_tangents"] = [[round(v,2) for v in hT_in], [round(v,2) for v in hT_fore]]
    if ft > 0: rep["throat_fillet_tangents"] = [[round(v,2) for v in tT_in], [round(v,2) for v in tT_chin]]
    rep["horn_style"] = style
    svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
  <!-- {P.get("comment","")} -->
  <path fill="{color}" d="{path}"/>
  <circle fill="{color}" cx="{fmt(dot[0])}" cy="{fmt(dot[1])}" r="{fmt(dr)}"/>
</svg>
'''
    return svg, rep, path

# ----------------------------------------------------------------------------------------------
def build_b(P, ink=INK, sea=SEA, mono=False):
    Co = (32, 32); R = P["R"]
    g, rep = profile_chain(P)
    # hair on the rim: given y, solve x on the left
    hy = g["hair"][1]; hx = Co[0] - math.sqrt(R*R - (hy-Co[1])**2)
    assert abs(hx - g["hair"][0]) < 0.05, f"hair x should be {hx:.2f}"
    # throat: point on chin circle at throat_deg below the apex, then the neck line to the rim
    ta = math.radians(P["throat_deg"])
    Th = (g["ccen"][0] + g["rc"]*math.cos(ta), g["ccen"][1] + g["rc"]*math.sin(ta))
    na = math.radians(P["neck_deg"]); nd = (-math.cos(na), math.sin(na))   # down-left
    tn = ray_circ(Th, nd, Co, R); W = (Th[0]+tn*nd[0], Th[1]+tn*nd[1])
    dot = tuple(P["dot"]); dr = P["dot_r"]
    # crescent (front, ink): hair -> rim clockwise over the top and down the right to W -> neck -> chin -> ... -> hair
    # large-arc: angle from hair to W clockwise
    a1 = math.atan2(-(g["hair"][1]-Co[1]), g["hair"][0]-Co[0]); a2 = math.atan2(-(W[1]-Co[1]), W[0]-Co[0])
    span = (a1 - a2) % (2*math.pi)
    d = [M(g["hair"]), A(R, 1, W, 1 if span > math.pi else 0), L(Th),
         A(g["rc"], 0, g["lip"]), L(g["mouth"]), L(g["t2"]), A(P["tip_r"], 0, g["t1"]), L(g["brow"]),
         A(g["rf"], 0, g["hair"]), "Z"]
    # dot knock-out as a subpath (evenodd)
    d += [M((dot[0]-dr, dot[1])), A(dr, 1, (dot[0]+dr, dot[1]), 1), A(dr, 1, (dot[0]-dr, dot[1]), 1), "Z"]
    crescent = " ".join(d)
    # head (back): W -> rim up the left to hair (clockwise visually = sweep 1) -> profile down -> W
    d = [M(W), A(R, 1, g["hair"], 1 if (2*math.pi - span) > math.pi else 0), A(g["rf"], 1, g["brow"]),
         L(g["t1"]), A(P["tip_r"], 1, g["t2"]), L(g["mouth"]), L(g["lip"]), A(g["rc"], 1, Th), L(W), "Z"]
    head = " ".join(d)
    rep.update({
        "throat": [round(Th[0],2), round(Th[1],2)], "neck_rim": [round(W[0],2), round(W[1],2)],
        "neck_len": round(dist(Th, W), 2),
        "profile_height": round(W[1]-g["hair"][1], 2),
        "thirds": [round(g["brow"][1]-g["hair"][1],2), round(g["mouth"][1]-g["brow"][1],2), round(W[1]-g["mouth"][1],2)],
        "ink_in_front_of_tip": round((Co[0]+math.sqrt(R*R-(g["tip"][1]-Co[1])**2)) - g["tip"][0], 2),
        "ink_in_front_of_brow": round((Co[0]+math.sqrt(R*R-(g["brow"][1]-Co[1])**2)) - g["brow"][0], 2),
        "ink_in_front_of_chin": round((Co[0]+math.sqrt(R*R-(g["ccen"][1]-Co[1])**2)) - (g["ccen"][0]+g["rc"]), 2),
        "ink_beside_throat": round((Co[0]+math.sqrt(R*R-(Th[1]-Co[1])**2)) - Th[0], 2),
        "dot_margin_to_rim": round(R - dist(Co, dot) - dr, 2),
        "gap_dot_to_forehead": round(dist(dot, g["brow"]) - dr, 2),
        "gap_dot_to_tip": round(dist(dot, g["tip"]) - dr, 2),
    })
    # horn wedge angles: forehead vs rim at hair, neck vs rim at W
    tf = unit(g["fcen"], g["hair"]); tf = (-tf[1], tf[0]); tr = unit(Co, g["hair"]); tr = (-tr[1], tr[0])
    rep["crown_wedge_deg"] = round(deg(math.acos(abs(tf[0]*tr[0]+tf[1]*tr[1]))), 1)
    tr = unit(Co, W); tr = (-tr[1], tr[0])
    rep["neck_wedge_deg"] = round(deg(math.acos(abs(nd[0]*tr[0]+nd[1]*tr[1]))), 1)
    head_el = "" if mono else f'\n  <path fill="{sea}" d="{head}"/>'
    svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
  <!-- {P.get("comment","")} -->{head_el}
  <path fill="{ink}" fill-rule="evenodd" d="{crescent}"/>
</svg>
'''
    return svg, rep, crescent, head

# ----------------------------------------------------------------------------------------------
def lockup(mark_inner, ink_right_x, scale, text_x_gap=15, color=INK, which="A"):
    """Mark at `scale` with its ink box x 4..60 placed so x4 -> 16, centred on the cap band of Inter 600 44px
    (cap top 24, baseline 56; cap height 32, mark 56*scale tall). ink_right_x: rightmost ink x of the mark (64 space)."""
    h = 56*scale; ty = 40 - h/2 - 4*scale; tx = 16 - 4*scale
    right = 16 + (ink_right_x-4)*scale
    text_x = right + text_x_gap - 0.5      # Inter's t ink starts ~0.5 right of the origin at 44px
    # period ink ends 113.5 px after the text origin at 44px (measured by sibling concepts: x 66.5 -> 180)
    width = text_x + 113.5 + 16
    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {fmt(width)} 80" width="{fmt(width)}" height="80">
  <!-- thera. lockup: profile-crescent {which} at scale {scale:.4f} (disc {fmt(h)} px, x 16..52, y 22..58, centred on the cap band of Inter 600 at 44 px: cap top 24, baseline 56, so it overshoots the cap height by 2 px each way like an O); {text_x_gap} px from the disc to the t's ink; period ink ends at x 180, 16 px margins. -->
  <g transform="translate({fmt(tx)} {fmt(ty)}) scale({scale:.4f})">
{mark_inner}  </g>
  <text x="{fmt(text_x)}" y="56" font-family="Inter, system-ui, sans-serif" font-size="44" font-weight="600" letter-spacing="-1.5" fill="{color}">thera.</text>
</svg>
'''

# ----------------------------------------------------------------------------------------------
PARAMS_A = {
    "comment": "thera. profile-crescent A, Caldera: outer circle c(36,32) r28, i.e. the whole mark is shifted 4 right of the box centre so the open C sits optically centred (ink x 8..54, bbox centre 31, left edge on a whole pixel at 16 and 48 px); caldera circle c(38.5,32) r20 (band 10.5 at the back, 8 at the top and bottom, 6.5 at the horn cuts); horns cut flat on the rays at +-50 deg from the centre. The inner edge on the thick side is the goddess profile looking right: forehead arc r25.9 (tangent 9 deg from vertical at the brow), straight nose ridge 29 deg from vertical with an r2.5 tip, underside 35 deg, 4-unit lip plane, chin arc r8.5 (apex 1.5 behind the nose tip), r4 throat fillet into the caldera. The island dot r4.5 sits at eye level where the gaze lands. One path plus one circle, no strokes.",
    "R": 28, "ci": (34.5, 32), "ri": 20, "horn_deg": 50, "horn_style": "flat", "ox": 4,
    "hair": (21.27, 17), "brow": (24.8, 26.5), "forehead_bulge": 0.5, "tip": (30.3, 36.5), "tip_r": 2.5,
    "mouth": (26.2, 39.4), "lip": (26.6, 43.4), "chin_r": 8.5, "chin_apex_x": 28.8,
    "hair_fillet": 0, "throat_fillet": 4,
    "dot": (39.5, 27), "dot_r": 4.5,
}
PARAMS_B = {
    "comment": "thera. profile-crescent B, Sunken head: one disc c(32,32) r28 split by the same profile grammar. The front half is the ink crescent (the cliffs) with the island dot r4.5 knocked out at eye level; the back half, the head, is sea blue #8DA8BB and is dropped in single colour (see mark-b-mono.svg). Profile: forehead arc r29.5 from the rim at (24,5.17), nose ridge 30 deg from vertical with an r2 tip, underside 36 deg, 5-unit lip plane, chin arc r8.5 (apex 2 behind the tip), throat at 38 deg, neck to the rim at 76 deg. Horn wedges 72 deg at the crown, 75 deg at the neck.",
    "R": 28,
    "hair": (24, 5.17), "brow": (28.8, 17), "forehead_bulge": 0.7, "tip": (38.2, 33), "tip_r": 2,
    "mouth": (32.9, 36.7), "lip": (33.3, 41.5), "chin_r": 8.5, "chin_apex_x": 36.2, "throat_deg": 38, "neck_deg": 76,
    "dot": (45, 22), "dot_r": 4.5,
}

def main():
    out = sys.argv[1]; os.makedirs(out, exist_ok=True)
    PA = PARAMS_A; PB = PARAMS_B
    if len(sys.argv) > 2:
        override = json.loads(sys.argv[2]); PA = {**PA, **override.get("A", {})}; PB = {**PB, **override.get("B", {})}
    suffix = override.get("suffix", "") if len(sys.argv) > 2 else ""
    svg_a, rep_a, path_a = build_a(PA)
    open(os.path.join(out, f"mark-a{suffix}.svg"), "w").write(svg_a)
    open(os.path.join(out, f"mark-a{suffix}-light.svg"), "w").write(build_a(PA, color=LIGHT)[0])
    svg_b, rep_b, cres_b, head_b = build_b(PB)
    open(os.path.join(out, f"mark-b{suffix}.svg"), "w").write(svg_b)
    open(os.path.join(out, f"mark-b{suffix}-mono.svg"), "w").write(build_b(PB, mono=True)[0])
    open(os.path.join(out, f"mark-b{suffix}-light.svg"), "w").write(build_b(PB, ink=LIGHT, sea="#466680")[0])
    inner = (f'    <path fill="{SEA}" d="{head_b}"/>\n'
             f'    <path fill="{INK}" fill-rule="evenodd" d="{cres_b}"/>\n')
    open(os.path.join(out, f"lockup-a{suffix}.svg"), "w").write(lockup(inner, 60, 0.6429, which="B"))
    print("A:", json.dumps(rep_a)); print("B:", json.dumps(rep_b))

if __name__ == "__main__":
    main()
