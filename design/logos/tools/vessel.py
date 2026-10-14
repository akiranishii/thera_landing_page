"""thera. Vessel mark generator. Left profile built top-down from named points, mirrored to the right.
rim corner -> forehead arc -> brow -> straight nose ridge -> filleted tip -> straight underside ->
mouth corner -> (optional straight lip plane) -> chin arc -> throat -> base arc -> bottom centre."""
import math, sys, json

def fmt(v):
    s = f"{v:.2f}".rstrip("0").rstrip(".")
    return "0" if s in ("-0", "") else s
def pt(p): return f"{fmt(p[0])} {fmt(p[1])}"
def unit(a, b):
    dx, dy = b[0]-a[0], b[1]-a[1]; n = math.hypot(dx, dy); return (dx/n, dy/n)

def fillet(a, p, b, r):
    u1 = unit(p, a); u2 = unit(p, b)
    ang = math.acos(max(-1, min(1, u1[0]*u2[0] + u1[1]*u2[1])))
    d = r / math.tan(ang/2)
    t1 = (p[0]+u1[0]*d, p[1]+u1[1]*d); t2 = (p[0]+u2[0]*d, p[1]+u2[1]*d)
    bis = unit((0,0), (u1[0]+u2[0], u1[1]+u2[1]))
    cen = (p[0]+bis[0]*r/math.sin(ang/2), p[1]+bis[1]*r/math.sin(ang/2))
    return t1, t2, cen

def forehead_radius(rim, brow, end_deg):
    """Arc from the rim corner to the brow whose tangent at the brow is end_deg from vertical
    (positive = leaning toward the centre)."""
    phi = math.radians(end_deg); dx = rim[0]-brow[0]; dy = rim[1]-brow[1]
    return -(dx*dx + dy*dy) / (2*(dx*math.cos(phi) - dy*math.sin(phi)))

def arc_for_bulge(a, b, bulge):
    c = math.hypot(b[0]-a[0], b[1]-a[1]); r = (c*c/4 + bulge*bulge) / (2*bulge)
    mid = ((a[0]+b[0])/2, (a[1]+b[1])/2); t = unit(a, b); perp = (-t[1], t[0])
    h = math.sqrt(max(r*r - c*c/4, 0))
    c1 = (mid[0]+perp[0]*h, mid[1]+perp[1]*h); c2 = (mid[0]-perp[0]*h, mid[1]-perp[1]*h)
    cen = c1 if c1[0] < c2[0] else c2          # centre on the left => bulge to the right
    return r, cen

def build(P, color="#223848", comment=""):
    rim = (P["rim_x"], P["rim_y"]); brow = tuple(P["brow"]); tip = tuple(P["tip"])
    mouth = tuple(P["mouth"]); lip = tuple(P["lip"]) if P.get("lip") else None
    throat = tuple(P["throat"]); base = (32, P["base_y"]); rb = P["base_r"]; rt = P.get("tip_r", 0)
    rf = forehead_radius(rim, brow, P.get("forehead_end_deg", 0))
    chin_start = lip or mouth
    rc, ccen = arc_for_bulge(chin_start, throat, P["chin_bulge"])

    segs = [("A", rf, 1, brow)]
    if rt > 0:
        t1, t2, tcen = fillet(brow, tip, mouth, rt)
        segs += [("L", t1), ("A", rt, 1, t2), ("L", mouth)]; inner_x = tcen[0] + rt
    else:
        segs += [("L", tip), ("L", mouth)]; inner_x = tip[0]
    if lip: segs.append(("L", lip))
    segs += [("A", rc, 1, throat), ("A", rb, 0, base)]

    d = [f"M {pt(rim)}"]
    for s in segs:
        d.append(f"L {pt(s[1])}" if s[0] == "L" else f"A {fmt(s[1])} {fmt(s[1])} 0 0 {s[2]} {pt(s[3])}")
    starts = [rim] + [s[-1] for s in segs]
    for i in range(len(segs)-1, -1, -1):
        s = segs[i]; m = (64-starts[i][0], starts[i][1])
        d.append(f"L {pt(m)}" if s[0] == "L" else f"A {fmt(s[1])} {fmt(s[1])} 0 0 {s[2]} {pt(m)}")
    d.append("Z"); void = " ".join(d)
    coin = "M 4 32 A 28 28 0 1 0 60 32 A 28 28 0 1 0 4 32 Z"

    rep = {
        "forehead_r": round(rf, 2),
        "forehead_chord_deg": round(math.degrees(math.atan2(brow[0]-rim[0], brow[1]-rim[1])), 1),
        "nose_deg": round(math.degrees(math.atan2(tip[0]-brow[0], tip[1]-brow[1])), 1),
        "underside_deg": round(math.degrees(math.atan2(mouth[1]-tip[1], tip[0]-mouth[0])), 1),
        "lip_lean_deg": round(math.degrees(math.atan2(lip[0]-mouth[0], lip[1]-mouth[1])), 1) if lip else None,
        "neck_gap": round(2*(32-inner_x), 2), "chin_r": round(rc, 2), "chin_centre": [round(ccen[0],2), round(ccen[1],2)],
        "chin_apex_x": round(ccen[0]+rc, 2), "chin_apex_y": round(ccen[1], 2),
        "thirds": [brow[1]-rim[1], mouth[1]-brow[1], throat[1]-mouth[1]],
        "rim_width": 64-2*rim[0], "void_height": base[1]-rim[1],
    }
    svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
  <!-- {comment} -->
  <path fill="{color}" fill-rule="evenodd" d="{coin}
    {void}"/>
</svg>
'''
    return svg, rep, void

if __name__ == "__main__":
    P = json.loads(sys.argv[1]); out = sys.argv[2]
    svg, rep, _ = build(P, color=P.get("color", "#223848"), comment=P.get("comment", "thera. mark"))
    open(out, "w").write(svg); print(out, json.dumps(rep))
