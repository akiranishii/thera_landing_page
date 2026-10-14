#!/usr/bin/env python3
"""Parametric generator for the thera. cameo marks (round 2, profile-led).

A "Brooch": an ink ring with a positive bust floating inside it, cut by the inner rim at the base.
            One path, evenodd (outer circle + a hole whose boundary is the inner rim and the bust).
B "Bust":   the bust alone as one sealed silhouette. One path.

Face looks right. Profile = forehead arc (the skull circle), one straight nose with a small tip fillet,
a short underside, a short lip plane, one chin arc, a straight throat. Hair = the skull circle plus one
chignon circle fused at the back. Everything is circles, arcs and straight lines.

Usage: python3 cameo.py <outdir>   (writes mark-a.svg, mark-b.svg, lockup-a.svg)
"""
import math, sys, os

INK = "#223848"

def pt(c, r, deg):
    a = math.radians(deg)
    return (c[0] + r * math.cos(a), c[1] + r * math.sin(a))

def ang(c, p):
    return math.degrees(math.atan2(p[1] - c[1], p[0] - c[0])) % 360

def f(v):
    s = f"{v:.2f}".rstrip("0").rstrip(".")
    return "0" if s in ("-0", "") else s

def P(p):
    return f"{f(p[0])} {f(p[1])}"

def circ_x(c, r, p, d):
    """point where ray p + t d (t>0) leaves circle (c, r); p inside."""
    px, py = p[0] - c[0], p[1] - c[1]
    a = d[0] ** 2 + d[1] ** 2
    b = 2 * (px * d[0] + py * d[1])
    cc = px * px + py * py - r * r
    t = (-b + math.sqrt(b * b - 4 * a * cc)) / (2 * a)
    return (p[0] + t * d[0], p[1] + t * d[1])

def circ_circ(c1, r1, c2, r2):
    """both intersection points of two circles."""
    dx, dy = c2[0] - c1[0], c2[1] - c1[1]
    d = math.hypot(dx, dy)
    a = (d * d + r1 * r1 - r2 * r2) / (2 * d)
    h = math.sqrt(max(0.0, r1 * r1 - a * a))
    mx, my = c1[0] + a * dx / d, c1[1] + a * dy / d
    return ((mx + h * dy / d, my - h * dx / d), (mx - h * dy / d, my + h * dx / d))

def fillet(p1, t, p2, r):
    """round the corner at t between p1->t->p2; returns tangent points (a on p1-t, b on t-p2) and sweep."""
    d1 = (p1[0] - t[0], p1[1] - t[1]); n1 = math.hypot(*d1); d1 = (d1[0] / n1, d1[1] / n1)
    d2 = (p2[0] - t[0], p2[1] - t[1]); n2 = math.hypot(*d2); d2 = (d2[0] / n2, d2[1] / n2)
    cosang = d1[0] * d2[0] + d1[1] * d2[1]
    a = math.acos(max(-1, min(1, cosang)))
    dist = r / math.tan(a / 2)
    pa = (t[0] + d1[0] * dist, t[1] + d1[1] * dist)
    pb = (t[0] + d2[0] * dist, t[1] + d2[1] * dist)
    cross = d1[0] * d2[1] - d1[1] * d2[0]
    sweep = 1 if cross < 0 else 0
    return pa, pb, sweep

# ---- segment lists: ('M', p) | ('L', p) | ('A', r, large, sweep, p) ----

def reverse(segs):
    """reverse a segment list that starts with ('M', p0)."""
    pts = [s[-1] for s in segs]
    out = [("M", pts[-1])]
    for i in range(len(segs) - 1, 0, -1):
        s = segs[i]
        prev = pts[i - 1]
        if s[0] == "L":
            out.append(("L", prev))
        else:
            out.append(("A", s[1], s[2], 1 - s[3], prev))
    return out

def to_d(segs, close=True):
    parts = []
    for s in segs:
        if s[0] == "M":
            parts.append(f"M {P(s[1])}")
        elif s[0] == "L":
            parts.append(f"L {P(s[1])}")
        else:
            parts.append(f"A {f(s[1])} {f(s[1])} 0 {s[2]} {s[3]} {P(s[4])}")
    return " ".join(parts) + (" Z" if close else "")

def bust(p):
    """Clockwise outline of the bust from the back-base point up the back, over the crown, down the face
    to the front-base point. Returns (segs, info). Base points are where the neck lines reach y=base_y
    (variant B) or the inner rim circle (variant A, when p['rim'] is given)."""
    S, Rs = tuple(p["skull"]), p["rs"]
    K, Rk = tuple(p["bun"]), p["rk"]
    info = {}
    # --- face, top down ---
    crown = (S[0], S[1] - Rs)
    if "rf" in p:
        # forehead: a flatter arc (radius rf) internally tangent to the skull circle at the hairline H,
        # running down to the brow B where its tangent is brow_tan_deg from vertical.
        thH = p["hair_deg"]
        H = pt(S, Rs, thH)
        u = (math.cos(math.radians(thH)), math.sin(math.radians(thH)))
        Cf = (S[0] + (Rs - p["rf"]) * u[0], S[1] + (Rs - p["rf"]) * u[1])
        B = pt(Cf, p["rf"], -p["brow_tan_deg"])
    else:
        H = None
        B = pt(S, Rs, -p["brow_deg"])                   # brow, on the skull circle
    nd = math.radians(p["nose_deg"])
    T = (B[0] + p["ln"] * math.sin(nd), B[1] + p["ln"] * math.cos(nd))
    ud = math.radians(p["under_deg"])
    U = (T[0] - p["lu"] * math.cos(ud), T[1] + p["lu"] * math.sin(ud))
    ld = math.radians(p["lip_deg"])
    L = (U[0] + p["ll"] * math.sin(ld), U[1] + p["ll"] * math.cos(ld))
    d, h = p["chin_d"], p["chin_h"]
    Rc = (d * d + h * h) / (2 * d)
    Cc = (L[0] + d - Rc, L[1] + h)
    Th = pt(Cc, Rc, p["throat_deg"])
    # jaw: straight line from the end of the chin arc, back and down at jaw_deg below horizontal
    # (tangent to the chin arc when jaw_deg == 90 - throat_deg), to the neck front J at x = jaw_x.
    jd = math.radians(p["jaw_deg"])
    jdir = (-math.cos(jd), math.sin(jd))
    tj = (p["jaw_x"] - Th[0]) / jdir[0]
    J = (p["jaw_x"], Th[1] + tj * jdir[1])
    nk = math.radians(p["neck_deg"])                   # neck front, below horizontal, going down and back
    ndir = (-math.cos(nk), math.sin(nk))
    if "rim" in p:
        Fb = circ_x((32.0, 32.0), p["rim"], J, ndir)
    else:
        t = (p["base_y"] - J[1]) / ndir[1]
        Fb = (J[0] + t * ndir[0], p["base_y"])
    ta, tb, tsw = fillet(B, T, U, p["tip_r"])
    # --- back, bottom up ---
    N = pt(K, Rk, p["nape_deg"])                       # nape: corner where the neck back meets the underside of the bun
    nb = math.radians(p["nape_line_deg"])              # neck back line, lean from vertical (positive = base further back)
    bdown = (-math.sin(nb), math.cos(nb))
    if "rim" in p:
        Bb = circ_x((32.0, 32.0), p["rim"], N, bdown)
    else:
        t = (p["base_y"] - N[1]) / bdown[1]
        Bb = (N[0] + t * bdown[0], p["base_y"])
    segs = [("M", Bb), ("L", N)]
    if p.get("hull", False):
        # back of the head: the external tangent line from the skull circle down to the chignon circle (the hair
        # swept back into the knot). No notch between skull and knot; the only concave corner is the nape.
        dx, dy = S[0] - K[0], S[1] - K[1]
        d = math.hypot(dx, dy)
        c = math.acos(max(-1, min(1, (Rk - Rs) / d)))
        base_a = math.atan2(dy, dx)
        cands = []
        for sgn in (1, -1):
            a = base_a + sgn * c
            n = (math.cos(a), math.sin(a))
            cands.append(n)
        n = min(cands, key=lambda v: v[0])                # the normal pointing back (left)
        Tk = (K[0] + Rk * n[0], K[1] + Rk * n[1])
        Ts = (S[0] + Rs * n[0], S[1] + Rs * n[1])
        sweep_bun = (ang(K, Tk) - p["nape_deg"]) % 360
        segs.append(("A", Rk, 1 if sweep_bun > 180 else 0, 1, Tk))
        segs.append(("L", Ts))
        sweep_sk = (270 - ang(S, Ts)) % 360
        segs.append(("A", Rs, 1 if sweep_sk > 180 else 0, 1, crown))
        notch = Ts
        info.update(dict(Tk=Tk, Ts=Ts))
    else:
        i1, i2 = circ_circ(S, Rs, K, Rk)
        notch = min((i1, i2), key=lambda q: q[0] + q[1])  # the upper-left intersection
        th_bun_n, th_bun_notch = p["nape_deg"], ang(K, notch)
        th_sk_notch = ang(S, notch)
        sweep_bun = (th_bun_notch - th_bun_n) % 360
        segs.append(("A", Rk, 1 if sweep_bun > 180 else 0, 1, notch))
        sweep_sk = (270 - th_sk_notch) % 360
        segs.append(("A", Rs, 1 if sweep_sk > 180 else 0, 1, crown))
    if H is not None:
        segs.append(("A", Rs, 0, 1, H))
        segs.append(("A", p["rf"], 0, 1, B))
        info["H"] = H
    else:
        segs.append(("A", Rs, 0, 1, B))
    segs.append(("L", ta))
    segs.append(("A", p["tip_r"], 0, tsw, tb))
    segs.append(("L", U))
    segs.append(("L", L))
    segs.append(("A", Rc, 0, 1, Th))
    segs.append(("L", J))
    segs.append(("L", Fb))
    info.update(dict(crown=crown, B=B, T=T, U=U, L=L, Rc=Rc, Cc=Cc, Th=Th, J=J, Fb=Fb, N=N, Bb=Bb, notch=notch,
                     chin_apex=(Cc[0] + Rc, Cc[1]), ta=ta, tb=tb))
    return segs, info

def ext_tangent_normal(c1, r1, c2, r2, prefer):
    """unit normal n of an external tangent line to circles (c1,r1),(c2,r2): tangent points c1+r1 n, c2+r2 n.
    prefer: function on n choosing between the two solutions (min)."""
    dx, dy = c1[0] - c2[0], c1[1] - c2[1]
    d = math.hypot(dx, dy)
    c = math.acos(max(-1, min(1, (r2 - r1) / d)))
    base = math.atan2(dy, dx)
    cands = [(math.cos(base + s * c), math.sin(base + s * c)) for s in (1, -1)]
    return min(cands, key=prefer)

def head(p):
    """Head-only silhouette (no neck): clockwise outline. Base = common tangent of the chin circle and the knot."""
    S, Rs = tuple(p["skull"]), p["rs"]
    K, Rk = tuple(p["bun"]), p["rk"]
    info = {}
    crown = (S[0], S[1] - Rs)
    thH = p["hair_deg"]
    H = pt(S, Rs, thH)
    u = (math.cos(math.radians(thH)), math.sin(math.radians(thH)))
    Cf = (S[0] + (Rs - p["rf"]) * u[0], S[1] + (Rs - p["rf"]) * u[1])
    B = pt(Cf, p["rf"], -p["brow_tan_deg"])
    nd = math.radians(p["nose_deg"])
    T = (B[0] + p["ln"] * math.sin(nd), B[1] + p["ln"] * math.cos(nd))
    ud = math.radians(p["under_deg"])
    U = (T[0] - p["lu"] * math.cos(ud), T[1] + p["lu"] * math.sin(ud))
    ld = math.radians(p["lip_deg"])
    L = (U[0] + p["ll"] * math.sin(ld), U[1] + p["ll"] * math.cos(ld))
    d, h = p["chin_d"], p["chin_h"]
    Rc = (d * d + h * h) / (2 * d)
    Cc = (L[0] + d - Rc, L[1] + h)
    ta, tb, tsw = fillet(B, T, U, p["tip_r"])
    # base: external tangent under the chin circle and the knot, or (base_r) a concave arc tangent to both
    base_arc = None
    if p.get("base_r"):
        Rb = p["base_r"]
        c1, c2 = circ_circ(Cc, Rc + Rb, K, Rk + Rb)
        Cb = max((c1, c2), key=lambda q: q[1])            # the centre below the head
        v1 = (Cb[0] - Cc[0], Cb[1] - Cc[1]); n1 = math.hypot(*v1)
        v2 = (Cb[0] - K[0], Cb[1] - K[1]); n2 = math.hypot(*v2)
        Th = (Cc[0] + Rc * v1[0] / n1, Cc[1] + Rc * v1[1] / n1)
        N = (K[0] + Rk * v2[0] / n2, K[1] + Rk * v2[1] / n2)
        base_arc = ("A", Rb, 0, 0, N)
        info["base_sagitta"] = Rb - math.sqrt(Rb * Rb - ((Th[0] - N[0]) ** 2 + (Th[1] - N[1]) ** 2) / 4)
    else:
        nb = ext_tangent_normal(Cc, Rc, K, Rk, prefer=lambda v: -v[1])
        Th = (Cc[0] + Rc * nb[0], Cc[1] + Rc * nb[1])
        N = (K[0] + Rk * nb[0], K[1] + Rk * nb[1])
    segs = [("M", N)]
    if p.get("hull", True):
        # back: external tangent line from the knot up to the skull (hair swept into the knot, no notch)
        nh = ext_tangent_normal(S, Rs, K, Rk, prefer=lambda v: v[0])
        Tk = (K[0] + Rk * nh[0], K[1] + Rk * nh[1])
        Ts = (S[0] + Rs * nh[0], S[1] + Rs * nh[1])
        sw = (ang(K, Tk) - ang(K, N)) % 360
        segs.append(("A", Rk, 1 if sw > 180 else 0, 1, Tk))
        segs.append(("L", Ts))
    else:
        # back: the knot circle overlaps the skull circle; the outline follows the knot round to the notch
        # (the upper-left intersection) and then the skull's own arc up to the crown.
        i1, i2 = circ_circ(S, Rs, K, Rk)
        notch = min((i1, i2), key=lambda q: q[0] + q[1])
        Tk = Ts = notch
        sw = (ang(K, notch) - ang(K, N)) % 360
        segs.append(("A", Rk, 1 if sw > 180 else 0, 1, notch))
        # how sharp is the notch: angle between the two tangents there
        a1 = ang(S, notch); a2 = ang(K, notch)
        info["notch_deg"] = (a2 - a1) % 360
    sw = (270 - ang(S, Ts)) % 360
    segs.append(("A", Rs, 1 if sw > 180 else 0, 1, crown))
    segs.append(("A", Rs, 0, 1, H))
    segs.append(("A", p["rf"], 0, 1, B))
    segs.append(("L", ta))
    segs.append(("A", p["tip_r"], 0, tsw, tb))
    segs.append(("L", U))
    segs.append(("L", L))
    sw = (ang(Cc, Th) - ang(Cc, L)) % 360
    segs.append(("A", Rc, 1 if sw > 180 else 0, 1, Th))
    segs.append(base_arc if base_arc else ("L", N))
    info.update(dict(crown=crown, H=H, B=B, T=T, U=U, L=L, Rc=Rc, Cc=Cc, Th=Th, N=N, Tk=Tk, Ts=Ts,
                     chin_apex=(Cc[0] + Rc, Cc[1]), knot_back=(K[0] - Rk, K[1]), knot_bottom=(K[0], K[1] + Rk),
                     base_deg=math.degrees(math.atan2(Th[1] - N[1], Th[0] - N[0]))))
    return segs, info

def svg_wrap(body, comment):
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">\n'
            f'  <!-- {comment} -->\n{body}\n</svg>\n')

def mark_a(p):
    R, r = 28.0, p["rim"]
    C = (32.0, 32.0)
    if p.get("headonly"):
        # nonzero winding: outer circle clockwise, inner circle counter-clockwise, head clockwise.
        # The head may overlap the ring (fused at the base) and stays solid.
        segs, info = head(p)
        d = (f"M {f(C[0]-R)} 32 A {R} {R} 0 1 1 {f(C[0]+R)} 32 A {R} {R} 0 1 1 {f(C[0]-R)} 32 Z "
             f"M {f(C[0]-r)} 32 A {f(r)} {f(r)} 0 1 0 {f(C[0]+r)} 32 A {f(r)} {f(r)} 0 1 0 {f(C[0]-r)} 32 Z "
             + to_d(segs))
        body = f'  <path fill="{INK}" fill-rule="nonzero" d="{d}"/>'
        return body, info, d
    segs, info = bust(p)
    # hole = inner rim from Bb over the top to Fb, then the bust outline (reversed: down the face is now up... )
    # bust segs run Bb -> back -> crown -> face -> Fb (clockwise). The hole loop: Bb -(rim, over the top)-> Fb -(bust reversed)-> Bb.
    rim_sweep = (ang(C, Fb := info["Fb"]) - ang(C, info["Bb"])) % 360
    hole = [("M", info["Bb"]), ("A", r, 1 if rim_sweep > 180 else 0, 1, Fb)]
    rev = reverse(segs)        # starts at Fb, ends at Bb
    hole += rev[1:]
    outer = f"M {f(C[0]-R)} 32 A 28 28 0 1 0 {f(C[0]+R)} 32 A 28 28 0 1 0 {f(C[0]-R)} 32 Z"
    d = outer + " " + to_d(hole)
    body = f'  <path fill="{INK}" fill-rule="evenodd" d="{d}"/>'
    return body, info, d

def mark_b(p):
    if p.get("headonly"):
        segs, info = head(p)
        d = to_d(segs)
        return f'  <path fill="{INK}" d="{d}"/>', info, d
    segs, info = bust(p)
    if p.get("base_r"):
        # convex base: one arc from Fb down-and-back to Bb
        segs.append(("A", p["base_r"], 0, 1, info["Bb"]))
    d = to_d(segs)
    body = f'  <path fill="{INK}" d="{d}"/>'
    return body, info, d

def report(name, info, p):
    print(f"--- {name}")
    for k, v in info.items():
        if isinstance(v, tuple):
            print(f"  {k:10s} ({f(v[0])}, {f(v[1])})")
        else:
            print(f"  {k:10s} {f(v)}")
    head_h = info["chin_apex"][1] - info["crown"][1]
    print(f"  head height crown->chin apex {f(head_h)}, nose {f(p['ln'])} = {p['ln']/head_h:.0%}")
    print(f"  nose projects {f(info['T'][0]-info['B'][0])} past the brow; chin apex {f(info['T'][0]-info['chin_apex'][0])} behind the tip")
    if "rim" in p:
        C = (32.0, 32.0); r = p["rim"]
        for k in ("crown", "T", "chin_apex", "N", "notch", "knot_back", "knot_bottom", "Ts", "Tk"):
            if k in info:
                q = info[k]
                print(f"  gap to rim at {k:10s} {f(r - math.hypot(q[0]-C[0], q[1]-C[1]))}")

if __name__ == "__main__":
    out = sys.argv[1]
    os.makedirs(out, exist_ok=True)
    from cameo_params import PARAMS_A, PARAMS_B, LOCKUP
    body, info, d = mark_a(PARAMS_A)
    report("A", info, PARAMS_A)
    open(os.path.join(out, "mark-a.svg"), "w").write(svg_wrap(body, PARAMS_A["comment"]))
    body_b, info_b, d_b = mark_b(PARAMS_B)
    report("B", info_b, PARAMS_B)
    open(os.path.join(out, "mark-b.svg"), "w").write(svg_wrap(body_b, PARAMS_B["comment"]))
    # lockup: preferred mark beside the wordmark
    L = LOCKUP
    which = L["mark"]
    dd = d if which == "a" else d_b
    rule = ' fill-rule="evenodd"' if which == "a" else ""
    s = L["scale"]; tx, ty = L["translate"]
    svg = (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {L["w"]} {L["h"]}" width="{L["w"]}" height="{L["h"]}">\n'
           f'  <!-- thera. cameo lockup: mark-{which} at scale {s} (translate {tx}, {ty}) beside the wordmark. {L["comment"]} -->\n'
           f'  <g transform="translate({tx} {ty}) scale({s})"><path fill="{INK}"{rule} d="{dd}"/></g>\n'
           f'  <text x="{L["text_x"]}" y="{L["baseline"]}" font-family="Inter, system-ui, sans-serif" font-weight="600" '
           f'font-size="{L["font_size"]}" letter-spacing="-1.5" fill="{INK}">thera.</text>\n</svg>\n')
    open(os.path.join(out, "lockup-a.svg"), "w").write(svg)
    print("wrote", out)
