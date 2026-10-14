"""Small 2-D geometry kit for the round-3 persona marks (screen coordinates, y down).

Curves are lines (point + unit direction) and circles (centre, radius). Paths are built from
explicit tangent points so every join can be checked; arcs are emitted with flags derived from
their centres, so a path is exactly the geometry that was computed.
"""
import math

def fmt(v):
    s = f"{v:.2f}".rstrip("0").rstrip(".")
    return "0" if s in ("-0", "") else s
def pt(p): return f"{fmt(p[0])} {fmt(p[1])}"
def add(a, b, k=1.0): return (a[0] + k * b[0], a[1] + k * b[1])
def sub(a, b): return (a[0] - b[0], a[1] - b[1])
def dot(a, b): return a[0] * b[0] + a[1] * b[1]
def cross(a, b): return a[0] * b[1] - a[1] * b[0]
def nrm(a):
    n = math.hypot(a[0], a[1]); return (a[0] / n, a[1] / n)
def dist(a, b): return math.hypot(a[0] - b[0], a[1] - b[1])
def unit(a, b): return nrm(sub(b, a))
def ang(deg):
    """Unit vector at a screen angle: 0 = right, 90 = down, 180 = left, 270 = up."""
    r = math.radians(deg); return (math.cos(r), math.sin(r))
def heading(d): return math.degrees(math.atan2(d[1], d[0])) % 360
def left(d): return (d[1], -d[0])     # the left-hand normal when walking along d on screen
def right(d): return (-d[1], d[0])
def mid(a, b): return ((a[0] + b[0]) / 2, (a[1] + b[1]) / 2)

# --- intersections -----------------------------------------------------------------------------
def line_line(p, d, q, e):
    den = cross(d, e)
    t = cross(sub(q, p), e) / den
    return add(p, d, t)

def line_circle(p, d, c, r):
    f = sub(p, c); b = 2 * dot(f, d); cc = dot(f, f) - r * r
    disc = b * b - 4 * cc
    if disc < 0: return []
    s = math.sqrt(disc)
    return [add(p, d, (-b - s) / 2), add(p, d, (-b + s) / 2)]

def circle_circle(c1, r1, c2, r2):
    d = dist(c1, c2)
    a = (r1 * r1 - r2 * r2 + d * d) / (2 * d)
    h2 = r1 * r1 - a * a
    if h2 < 0: return []
    h = math.sqrt(h2); u = unit(c1, c2); m = add(c1, u, a)
    return [(m[0] + u[1] * h, m[1] - u[0] * h), (m[0] - u[1] * h, m[1] + u[0] * h)]

def nearest(cands, hint): return min(cands, key=lambda q: dist(q, hint))

# --- constructions -----------------------------------------------------------------------------
def circle_tangent_at(p, d, q):
    """Circle tangent to direction d at p and passing through q. Returns (centre, r)."""
    v = sub(q, p); n = left(d)
    if dot(n, v) < 0: n = right(d)
    r = dot(v, v) / (2 * dot(n, v))
    return add(p, n, r), r

def circle_bulge(a, b, bulge, toward):
    """Circle through a and b whose arc's midpoint is pushed `bulge` toward the side of `toward`."""
    c = dist(a, b); r = (c * c / 4 + bulge * bulge) / (2 * bulge)
    m = mid(a, b); n = left(unit(a, b))
    if dot(n, sub(toward, m)) < 0: n = right(unit(a, b))
    return add(m, n, -(r - bulge)), r

def tangent_dir_on_circle(c, p, cw):
    """Direction of travel at p on circle c, clockwise (screen) if cw."""
    rv = unit(c, p)
    return (-rv[1], rv[0]) if cw else (rv[1], -rv[0])

def point_where_heading(c, r, deg, cw):
    """Point on circle where the direction of travel (cw or ccw on screen) has screen heading `deg`."""
    d = ang(deg)
    rv = (d[1], -d[0]) if cw else (-d[1], d[0])   # inverse of tangent_dir_on_circle
    return add(c, rv, r)

def foot(p, d, q): return add(p, d, dot(sub(q, p), d))

# fillets: each curve is ('L', p, d) or ('C', c, r). `side` per curve: +1 offset to the left of a line
# (or outward of a circle), -1 to the right (or inward). The fillet centre is the intersection of
# the two offset curves nearest `hint`.
def _offset(cv, s, rf):
    if cv[0] == 'L': return ('L', add(cv[1], left(cv[2]), s * rf), cv[2])
    return ('C', cv[1], cv[2] + s * rf)

def _touch(cv, fc):
    if cv[0] == 'L': return foot(cv[1], cv[2], fc)
    return add(cv[1], unit(cv[1], fc), cv[2])

def fillet(cv1, s1, cv2, s2, rf, hint):
    o1, o2 = _offset(cv1, s1, rf), _offset(cv2, s2, rf)
    if o1[0] == 'L' and o2[0] == 'L': cands = [line_line(o1[1], o1[2], o2[1], o2[2])]
    elif o1[0] == 'L': cands = line_circle(o1[1], o1[2], o2[1], o2[2])
    elif o2[0] == 'L': cands = line_circle(o2[1], o2[2], o1[1], o1[2])
    else: cands = circle_circle(o1[1], o1[2], o2[1], o2[2])
    fc = nearest(cands, hint)
    return fc, _touch(cv1, fc), _touch(cv2, fc)

# --- paths -------------------------------------------------------------------------------------
class Path:
    def __init__(self, p):
        self.parts = [f"M {pt(p)}"]; self.cur = p; self.start = p
    def L(self, p):
        self.parts.append(f"L {pt(p)}"); self.cur = p; return self
    def A(self, p, c, cw):
        r0, r1 = dist(self.cur, c), dist(p, c)
        assert abs(r0 - r1) < 0.05, (self.cur, p, c, r0, r1)
        a0 = math.atan2(self.cur[1] - c[1], self.cur[0] - c[0])
        a1 = math.atan2(p[1] - c[1], p[0] - c[0])
        span = (a1 - a0) % (2 * math.pi) if cw else (a0 - a1) % (2 * math.pi)
        r = (r0 + r1) / 2
        self.parts.append(f"A {fmt(r)} {fmt(r)} 0 {1 if span > math.pi else 0} {1 if cw else 0} {pt(p)}")
        self.cur = p; return self
    def Z(self):
        self.parts.append("Z"); return self
    def __str__(self): return " ".join(self.parts)

def circle_path(c, r):
    a = (c[0] - r, c[1]); b = (c[0] + r, c[1])
    return f"M {pt(a)} A {fmt(r)} {fmt(r)} 0 1 1 {pt(b)} A {fmt(r)} {fmt(r)} 0 1 1 {pt(a)} Z"

def outer_tangent(c1, r1, c2, r2, side=+1):
    """External common tangent of two circles. side=+1/-1 picks one of the two. Returns (t1, t2)."""
    d = sub(c2, c1); L = math.hypot(*d); th = math.atan2(d[1], d[0])
    phi = math.acos((r1 - r2) / L)
    a = th + side * phi; n = (math.cos(a), math.sin(a))
    return add(c1, n, r1), add(c2, n, r2)
