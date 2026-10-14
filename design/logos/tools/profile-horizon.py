#!/usr/bin/env python3
"""thera. / profile-horizon generator.

A disc (or a semicircle) split by a band of light. The band's lower edge is a reclining goddess
profile, face up: forehead arc (with a crest and a brow dip), one straight nose with a filleted tip,
a short lip plane, one chin arc, a throat and a flat chest to the rim. The band's upper edge (the
sky) is either a flat chord notched only by the nose ("flat" mode, the final), or the whole profile
offset outward by a constant ("offset" mode, the rejected ribbon). Everything is arcs and lines.

Usage: python3 profile-horizon.py <variant a|b> <out.svg> ['{"json": "overrides"}']
"""
import json, math, sys

# ---------- tiny 2D kit ----------
def add(a, b): return (a[0] + b[0], a[1] + b[1])
def sub(a, b): return (a[0] - b[0], a[1] - b[1])
def mul(a, s): return (a[0] * s, a[1] * s)
def dot(a, b): return a[0] * b[0] + a[1] * b[1]
def dist(a, b): return math.hypot(a[0] - b[0], a[1] - b[1])
def unit(v):
    l = math.hypot(*v); return (v[0] / l, v[1] / l)
def normal_left(d):
    """Outward normal for a boundary traversed left->right with the mass below (screen coords, y down)."""
    return (d[1], -d[0])

def line_line(p1, d1, p2, d2):
    den = d1[0] * d2[1] - d1[1] * d2[0]
    w = sub(p2, p1)
    t = (w[0] * d2[1] - w[1] * d2[0]) / den
    return add(p1, mul(d1, t))

def line_circle(p, d, c, r):
    f_ = sub(p, c)
    a = dot(d, d); b = 2 * dot(f_, d); cc = dot(f_, f_) - r * r
    s = math.sqrt(max(b * b - 4 * a * cc, 0))
    return [add(p, mul(d, (-b - s) / (2 * a))), add(p, mul(d, (-b + s) / (2 * a)))]

def circle_circle(c1, r1, c2, r2):
    d = dist(c1, c2)
    a = (r1 * r1 - r2 * r2 + d * d) / (2 * d)
    h = math.sqrt(max(r1 * r1 - a * a, 0))
    n = unit(sub(c2, c1)); p = add(c1, mul(n, a)); perp = (-n[1], n[0])
    return [add(p, mul(perp, h)), sub(p, mul(perp, h))]

def nearest(pts, q): return min(pts, key=lambda p: dist(p, q))

def f(x):
    s = f"{x:.2f}".rstrip("0").rstrip(".")
    return "0" if s in ("-0", "") else s
def P(p): return f"{f(p[0])} {f(p[1])}"
def arc(r, sweep, p, large=0): return f"A {f(r)} {f(r)} 0 {large} {sweep} {P(p)}"

# ---------- containers ----------
class Disc:
    def __init__(self, c, r): self.c, self.r = c, r
    def left_x(self, y): return self.c[0] - math.sqrt(self.r ** 2 - (y - self.c[1]) ** 2)
    def right_x(self, y): return self.c[0] + math.sqrt(self.r ** 2 - (y - self.c[1]) ** 2)
    def close_lower(self, E, H):
        return arc(self.r, 1, H, large=self._large(E, H, cw=True))
    def close_upper(self, E, P0):
        return arc(self.r, 0, P0, large=self._large(E, P0, cw=False))
    def _large(self, a, b, cw):
        ta = math.atan2(a[1] - self.c[1], a[0] - self.c[0])
        tb = math.atan2(b[1] - self.c[1], b[0] - self.c[0])
        span = (tb - ta) % (2 * math.pi) if cw else (ta - tb) % (2 * math.pi)
        return 1 if span > math.pi else 0
    def note(self): return f"disc c ({f(self.c[0])},{f(self.c[1])}) r {f(self.r)}"

class Semi(Disc):
    """Upper half-disc: flat base at y = c.y, arc above."""
    def close_lower(self, E, H):
        base_r = (self.c[0] + self.r, self.c[1]); base_l = (self.c[0] - self.r, self.c[1])
        return " ".join([arc(self.r, 1, base_r), f"L {P(base_l)}", arc(self.r, 1, H)])
    def note(self): return f"semicircle c ({f(self.c[0])},{f(self.c[1])}) r {f(self.r)}, base y {f(self.c[1])}"

# ---------- the profile ----------
def build(p):
    cont = Semi(tuple(p["centre"]), p["R"]) if p["container"] == "semi" else Disc(tuple(p["centre"]), p["R"])
    F = p["F"]
    rad = math.radians
    n = {}

    # forehead: one arc with its crest s_f above the face plane at x_crest, passing through the brow B
    B = (p["x_brow"], F)
    s_f = p["forehead_crest"]; xc = p["x_crest"]
    r_f = ((B[0] - xc) ** 2 + s_f ** 2) / (2 * s_f)
    c_f = (xc, F - s_f + r_f)
    H = nearest([q for q in circle_circle(c_f, r_f, cont.c, cont.r)], (cont.left_x(F), F - s_f))
    brow_desc = math.degrees(math.asin((B[0] - xc) / r_f))      # forehead descends into the brow at this angle
    rH = sub(H, c_f); hair_tan = math.degrees(math.atan2(rH[0], -rH[1]))
    flat_forehead = p.get("flat_forehead", False)
    if flat_forehead:
        H = (cont.left_x(F), F)

    # nose
    an = rad(p["ridge_deg"]); au = rad(p["underside_from_vertical_deg"])
    h = p["nose_h"]
    T = (B[0] + h / math.tan(an), F - h)
    d1 = (math.cos(an), -math.sin(an)); d2 = (math.sin(au), math.cos(au))
    nb = p["nose_base_rise"]
    N = (T[0] + (h - nb) * math.tan(au), F - nb)
    r_t = p["tip_r"]
    theta = math.acos(max(-1, min(1, dot(d1, d2))))
    t = r_t * math.tan(theta / 2)
    T1 = sub(T, mul(d1, t)); T2 = add(T, mul(d2, t))
    n1 = normal_left(d1); n2 = normal_left(d2)
    cT = sub(T1, mul(n1, r_t))

    # lip plane
    L = (N[0] + p["lip_len"], N[1] - p["lip_rise"])
    d_lip = unit(sub(L, N)); n_lip = normal_left(d_lip)

    # chin arc from L to the throat W, bulging up by chin_s; chest runs flat from W
    yW = F + p["throat_drop"]
    W = (p["x_throat"], yW)
    s = p["chin_s"]
    c_len = dist(L, W); r_c = (c_len * c_len / 4 + s * s) / (2 * s)
    d_c = unit(sub(W, L)); n_down = (-d_c[1], d_c[0])
    M = mul(add(L, W), 0.5); c_c = add(M, mul(n_down, r_c - s))
    chin_apex = (c_c[0], c_c[1] - r_c)
    half = math.degrees(math.asin(min(1, c_len / (2 * r_c))))
    E = (cont.right_x(yW), yW)

    # optional concave brow fillet between the forehead and the ridge (r_b), and a throat fillet (r_w)
    r_b = p.get("brow_r", 0); r_w = p.get("throat_r", 0)
    seg = [f"M {P(H)}"]
    if r_b > 0:
        # tangent direction of the forehead arriving at B (clockwise arc): rotate radius vector
        if flat_forehead:
            dB = (1.0, 0.0)
        else:
            rB = unit(sub(B, c_f)); dB = (-rB[1], rB[0])
        phi = math.acos(max(-1, min(1, dot(dB, d1))))
        tb = r_b * math.tan(phi / 2)
        B1 = sub(B, mul(dB, tb)); B2 = add(B, mul(d1, tb))
        if flat_forehead:
            seg += [f"L {P(B1)}"]
        else:
            seg += [arc(r_f, 1, B1)]
        seg += [arc(r_b, 0, B2)]          # concave: anticlockwise
    else:
        seg += ([f"L {P(B)}"] if flat_forehead else [arc(r_f, 1, B)])
    seg += [f"L {P(T1)}", arc(r_t, 1, T2), f"L {P(N)}", f"L {P(L)}"]
    if r_w > 0:
        rW = unit(sub(W, c_c)); dW = (-rW[1], rW[0])   # chin arc tangent arriving at W
        dE = (1.0, 0.0)
        phi = math.acos(max(-1, min(1, dot(dW, dE))))
        tw = r_w * math.tan(phi / 2)
        # W1 on the chin arc: back up along the arc by angle tw/r_c
        ang = tw / r_c
        aW = math.atan2(W[1]-c_c[1], W[0]-c_c[0]) - ang
        W1 = (c_c[0] + r_c*math.cos(aW), c_c[1] + r_c*math.sin(aW))
        W2 = add(W, mul(dE, tw))
        seg += [arc(r_c, 1, W1), arc(r_w, 0, W2), f"L {P(E)}"]
    else:
        seg += [arc(r_c, 1, W), f"L {P(E)}"]
    seg += [cont.close_lower(E, H), "Z"]
    lower = " ".join(seg)

    # ----- the sky -----
    g = p["gap"]
    T1o = add(T1, mul(n1, g)); T2o = add(T2, mul(n2, g))
    if p["sky"] == "flat":
        ys = p["sky_y"]
        foot_l = line_line(T1o, d1, (0, ys), (1, 0))
        foot_r = line_line(T2o, d2, (0, ys), (1, 0))
        P0 = (cont.left_x(ys), ys); Eo = (cont.right_x(ys), ys)
        r_fo = p.get("foot_r", 0)
        r_a = r_t + g
        seg = [f"M {P(P0)}"]
        if r_fo > 0:
            # convex fillets of the sky at both feet of the notch (sky is traversed anticlockwise, so sweep 0).
            # If the straight offset stub between the chord and the apex arc is shorter than the fillet's tangent
            # length, the fillet is drawn between the chord and the apex circle itself (externally tangent).
            notes_feet = []
            # left foot
            phi_l = math.acos(max(-1, min(1, dot((1, 0), d1)))); tl = r_fo * math.tan(phi_l / 2)
            if T1o[1] < ys - 0.01 and dist(foot_l, T1o) >= tl:
                Fl1 = sub(foot_l, (tl, 0)); Fl2 = add(foot_l, mul(d1, tl))
                seg += [f"L {P(Fl1)}", arc(r_fo, 0, Fl2), f"L {P(T1o)}"]
                notes_feet.append(f"left: line fillet, stub {f(dist(Fl2, T1o))}")
            else:
                cx = cT[0] - math.sqrt((r_a + r_fo) ** 2 - (cT[1] - ys + r_fo) ** 2); cf = (cx, ys - r_fo)
                tp = add(cT, mul(unit(sub(cf, cT)), r_a))
                seg += [f"L {P((cx, ys))}", arc(r_fo, 0, tp)]
                notes_feet.append(f"left: circle fillet, chord tangent x {f(cx)}")
            # right foot
            phi_r = math.acos(max(-1, min(1, dot(d2, (1, 0))))); tr = r_fo * math.tan(phi_r / 2)
            if T2o[1] < ys - 0.01 and dist(T2o, foot_r) >= tr:
                Fr1 = sub(foot_r, mul(d2, tr)); Fr2 = add(foot_r, (tr, 0))
                seg += [arc(r_a, 1, T2o), f"L {P(Fr1)}", arc(r_fo, 0, Fr2)]
                notes_feet.append(f"right: line fillet, stub {f(dist(T2o, Fr1))}")
            else:
                cx = cT[0] + math.sqrt((r_a + r_fo) ** 2 - (cT[1] - ys + r_fo) ** 2); cf = (cx, ys - r_fo)
                tp = add(cT, mul(unit(sub(cf, cT)), r_a))
                seg += [arc(r_a, 1, tp), arc(r_fo, 0, (cx, ys))]
                notes_feet.append(f"right: circle fillet, apex arc ends ({P(tp)}), chord tangent x {f(cx)}")
            n["notch feet fillets"] = f"r {f(r_fo)}; " + "; ".join(notes_feet)
        else:
            a_l = T1o if T1o[1] < ys else (cT[0] - math.sqrt(r_a**2 - (cT[1]-ys)**2), ys)
            a_r = T2o if T2o[1] < ys else (cT[0] + math.sqrt(r_a**2 - (cT[1]-ys)**2), ys)
            seg += ([f"L {P(foot_l)}", f"L {P(T1o)}"] if T1o[1] < ys else [f"L {P(a_l)}"]) + [arc(r_a, 1, a_r)] + ([f"L {P(foot_r)}"] if T2o[1] < ys else [])
        seg += [f"L {P(Eo)}", cont.close_upper(Eo, P0), "Z"]
        upper = " ".join(seg)
        n.update({"sky": f"flat chord y {f(ys)}, nose notch feet x {f(foot_l[0])} / {f(foot_r[0])} ({f(foot_r[0]-foot_l[0])} wide), notch apex y {f(cT[1]-r_t-g)}",
                  "gap over plane": F - ys, "gap over forehead crest": (F - s_f) - ys,
                  "gap over chin apex": chin_apex[1] - ys, "gap over chest": yW - ys, "gap round nose": g})
    else:
        Bo = nearest(line_circle(T1o, d1, c_f, r_f + g), B)
        P0 = nearest(circle_circle(c_f, r_f + g, cont.c, cont.r), (cont.left_x(F - g), F - g))
        No = line_line(T2o, d2, add(N, mul(n_lip, g)), d_lip)
        Lo = nearest(line_circle(add(N, mul(n_lip, g)), d_lip, c_c, r_c + g), L)
        lip_ok = dot(sub(Lo, No), d_lip) > 0.05
        if not lip_ok:
            No = Lo = nearest(line_circle(T2o, d2, c_c, r_c + g), L)
        yo = yW - g
        Wo = (c_c[0] + math.sqrt((r_c + g) ** 2 - (yo - c_c[1]) ** 2), yo)
        Eo = (cont.right_x(yo), yo)
        upper = " ".join([f"M {P(P0)}", arc(r_f + g, 1, Bo), f"L {P(T1o)}", arc(r_t + g, 1, T2o), f"L {P(No)}"]
                         + ([f"L {P(Lo)}"] if lip_ok else [])
                         + [arc(r_c + g, 1, Wo), f"L {P(Eo)}", cont.close_upper(Eo, P0), "Z"])
        n.update({"sky": f"offset ribbon g {f(g)}, lip segment {'kept' if lip_ok else 'dropped'}"})

    n.update({
        "container": cont.note(),
        "H hairline (on rim)": H, "forehead r": r_f, "forehead centre": c_f, "forehead crest": (xc, F - s_f),
        "forehead tangent at hairline deg": hair_tan, "forehead descends into brow deg": brow_desc,
        "brow bend deg": brow_desc + p["ridge_deg"],
        "B brow": B, "T tip": T, "tip fillet": {"r": r_t, "T1": T1, "T2": T2, "centre": cT},
        "nose apex interior deg": 180 - math.degrees(theta), "nose ridge length": dist(B, T),
        "nose run along face": N[0] - B[0], "nose projection": h,
        "N nose base": N, "L lip base": L, "W throat": W, "chin r": r_c, "chin centre": c_c, "chin apex": chin_apex,
        "chin half-angle deg": half, "chin rise over lip base": L[1] - chin_apex[1],
        "E chest end": E, "face length hair->throat": W[0] - H[0], "nose share of face": (N[0] - B[0]) / (W[0] - H[0]),
    })
    return lower, upper, n

DEFAULTS = {
    "a": dict(container="disc", centre=[32, 32], R=26, F=36, sky="flat", sky_y=27, gap=8, foot_r=4,
              x_crest=40, forehead_crest=2, x_brow=18, brow_r=5,
              ridge_deg=45, nose_h=8, underside_from_vertical_deg=15, nose_base_rise=1.2, tip_r=2.5,
              lip_len=3, lip_rise=0.3, x_throat=42, chin_s=2.2, throat_drop=1.5, throat_r=4),
    "b": dict(container="semi", centre=[32, 47], R=28, F=40, sky="flat", sky_y=31, gap=7, foot_r=4,
              x_crest=42, forehead_crest=2, x_brow=18, brow_r=5,
              ridge_deg=45, nose_h=7, underside_from_vertical_deg=15, nose_base_rise=1.2, tip_r=2.5,
              lip_len=3, lip_rise=0.3, x_throat=42, chin_s=2.2, throat_drop=1.5, throat_r=4),
}

def svg(lower, upper, ink="#223848", ink2=None, comment=""):
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">\n'
            f'  <!-- {comment} -->\n'
            f'  <path fill="{ink}" d="{upper}"/>\n'
            f'  <path fill="{ink2 or ink}" d="{lower}"/>\n'
            f'</svg>\n')

if __name__ == "__main__":
    variant, out = sys.argv[1], sys.argv[2]
    p = dict(DEFAULTS[variant])
    if len(sys.argv) > 3: p.update(json.loads(sys.argv[3]))
    lower, upper, notes = build(p)
    comment = (f"thera. / profile-horizon {variant.upper()}: {notes['container']}. Sky above, the goddess (the island) below, "
               f"a band of light between them. The lower edge is a reclining profile, face up: forehead arc, brow, one straight "
               f"nose, lip plane, one chin arc, throat, flat chest. {notes['sky']}.")
    with open(out, "w") as fh:
        fh.write(svg(lower, upper, ink=p.get("ink", "#223848"), ink2=p.get("ink2"), comment=comment))
    for k, v in notes.items():
        if isinstance(v, tuple): v = f"({f(v[0])}, {f(v[1])})"
        elif isinstance(v, float): v = f(v)
        elif isinstance(v, dict): v = {kk: (f"({f(vv[0])}, {f(vv[1])})" if isinstance(vv, tuple) else f(vv)) for kk, vv in v.items()}
        print(f"{k}: {v}")
