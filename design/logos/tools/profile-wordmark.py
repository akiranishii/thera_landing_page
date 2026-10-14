#!/usr/bin/env python3
"""Parametric generator for the thera. profile-wordmark mark (round 2, profile-led).

A single goddess profile facing right, solid ink. The back of the head is a circular arc
(centre Cb, radius Rb); the front is four calm moves: a short straight forehead (joined to the
crown by one fillet), one straight nose, a short lip plane, one chin arc that is internally
tangent to the back circle so the bottom is sealed and smooth.

Usage: python3 profile-wordmark.py <outdir> [json-overrides]
Writes mark-a.svg (head alone) and mark-b.svg (head on a full disc, two-tone).
"""
import json, math, sys, os

INK = "#223848"
BLUE = "#8DA8BB"

P = dict(
    xb=37.0, yb=31.0, Rb=26.0,      # back circle
    dB=7.0, yB=20.0,                # brow: dB forward of the chord, at yB
    lean_f=15.0,                    # forehead lean from vertical (deg)
    r_k=13.0,                       # crown fillet radius
    lean_n=27.0, yT=37.0,           # nose: lean from vertical, tip y
    r_t=2.0,                        # nose tip fillet
    U=(11.3, 40.5),                 # under the nose (dx from chord, y)
    lip_lean=6.0,                   # lip plane lean from vertical, forward (deg)
    rc=8.0,                         # chin radius
    apex=12.9,                      # chin apex dx from chord
    jaw=0.0,                        # jaw line rises toward the back by this angle (deg); tangent to the back circle
    shift_b=-5.0,                   # x shift applied to variant B so the disc fits the box
    shift_by=1.0,                   # y shift applied to variant B (A is centred on its own ink box)
    b_cut=0.5,                      # variant B: the blue crescent ends on a horizontal cut this far above the chin apex, so its lower horn never tapers to a point at the rim
)


def f(v):
    s = f"{v:.2f}".rstrip('0').rstrip('.')
    return '0' if s == '-0' else s


def fillet(p1, t, p2, r):
    """Round the corner at t between p1->t->p2 with radius r. Returns (a, b)."""
    d1 = (p1[0]-t[0], p1[1]-t[1]); n1 = math.hypot(*d1); d1 = (d1[0]/n1, d1[1]/n1)
    d2 = (p2[0]-t[0], p2[1]-t[1]); n2 = math.hypot(*d2); d2 = (d2[0]/n2, d2[1]/n2)
    ang = math.acos(max(-1, min(1, d1[0]*d2[0] + d1[1]*d2[1])))
    dist = r / math.tan(ang/2)
    return (t[0] + d1[0]*dist, t[1] + d1[1]*dist), (t[0] + d2[0]*dist, t[1] + d2[1]*dist)


def build(P):
    xb, yb, Rb = P['xb'], P['yb'], P['Rb']
    Cb = (xb, yb)
    # --- forehead line through B, leaning lean_f (top goes back) ---
    B = (xb + P['dB'], P['yB'])
    lf = math.radians(P['lean_f'])
    u = (math.sin(lf), math.cos(lf))        # unit direction down the forehead (down and forward)
    n_in = (-u[1], u[0])                    # inward normal: left of travel... check sign below
    # inward = toward the ink = toward -x mostly. u = (sin, cos) -> (-cos, sin) has negative x. good.
    n_in = (-math.cos(lf), math.sin(lf))
    # --- crown fillet: centre K at distance r_k inside the line and Rb - r_k from Cb ---
    rk = P['r_k']
    base = (B[0] + n_in[0]*rk, B[1] + n_in[1]*rk)   # point on the inner parallel
    # K = base + t*u ; |K - Cb| = Rb - rk
    px, py = base[0]-Cb[0], base[1]-Cb[1]
    a = 1.0; b = 2*(px*u[0] + py*u[1]); c = px*px + py*py - (Rb-rk)**2
    disc = b*b - 4*a*c
    if disc < 0:
        raise SystemExit("crown fillet: no solution (r_k too big or line too far)")
    ts = [(-b - math.sqrt(disc))/2, (-b + math.sqrt(disc))/2]
    t = min(ts)  # upper solution (smaller y: u has positive y, so smaller t = higher)
    K = (base[0] + t*u[0], base[1] + t*u[1])
    P1 = (K[0] - n_in[0]*rk, K[1] - n_in[1]*rk)          # touch on the forehead line
    dkx, dky = K[0]-Cb[0], K[1]-Cb[1]; dk = math.hypot(dkx, dky)
    J = (Cb[0] + Rb*dkx/dk, Cb[1] + Rb*dky/dk)            # touch on the back circle
    # --- nose ---
    ln = math.radians(P['lean_n'])
    T = (B[0] + (P['yT'] - B[1])*math.tan(ln), P['yT'])
    U = (xb + P['U'][0], P['U'][1])
    tA, tB = fillet(B, T, U, P['r_t'])
    # --- jaw line: tangent to the back circle at a point jaw deg left of the bottom; chin circle tangent to it ---
    th = math.radians(P['jaw'])
    Qj = (xb - Rb*math.sin(th), yb + Rb*math.cos(th))      # tangent point on the back circle
    dj = (math.cos(th), math.sin(th))                        # forward along the jaw (right, and down by jaw deg)
    nin = (math.sin(th), -math.cos(th))                      # inward normal (up into the ink)
    rc = P['rc']
    s_ = (xb + P['apex'] - rc - Qj[0] - rc*nin[0])/dj[0]
    Tj = (Qj[0] + s_*dj[0], Qj[1] + s_*dj[1])                # chin circle touches the jaw here
    Cc = (Tj[0] + rc*nin[0], Tj[1] + rc*nin[1])
    # lip plane from U down (leaning forward) until it meets the chin circle
    ll = math.radians(P['lip_lean'])
    d = (math.sin(ll), math.cos(ll))
    px, py = U[0]-Cc[0], U[1]-Cc[1]
    b = 2*(px*d[0] + py*d[1]); c = px*px + py*py - rc*rc
    disc = b*b - 4*c
    if disc < 0:
        raise SystemExit("lip plane misses the chin circle")
    t = (-b - math.sqrt(disc))/2
    if t < 0:
        raise SystemExit("U is inside the chin circle")
    L = (U[0] + t*d[0], U[1] + t*d[1])
    beta = math.degrees(math.atan2(Tj[1]-Cc[1], Tj[0]-Cc[0]))
    G = Tj; rc_err = 0.0
    pts = dict(Qj=Qj, Tj=Tj)
    pts.update(dict(Cb=Cb, B=B, K=K, P1=P1, J=J, T=T, tA=tA, tB=tB, U=U, L=L, Cc=Cc, rc=rc, beta=beta, G=G, rc_err=rc_err))
    return pts


def head_path(P, pts, dx=0.0):
    Rb = P['Rb']; rk = P['r_k']; rt = P['r_t']; rc = pts['rc']
    def s(p): return f"{f(p[0]+dx)} {f(p[1])}"
    P1, B, tA, tB, U, L, Tj, Qj, J, Cb = [pts[k] for k in 'P1 B tA tB U L Tj Qj J Cb'.split()]
    # clockwise sweep (screen coords: increasing atan2) from Qj to J on the back circle
    sweep = (math.degrees(math.atan2(J[1]-Cb[1], J[0]-Cb[0])) - math.degrees(math.atan2(Qj[1]-Cb[1], Qj[0]-Cb[0]))) % 360
    large = 1 if sweep > 180 else 0
    return (f"M {s(P1)} L {s(B)} L {s(tA)} A {f(rt)} {f(rt)} 0 0 1 {s(tB)} L {s(U)} L {s(L)} "
            f"A {f(rc)} {f(rc)} 0 0 1 {s(Tj)} L {s(Qj)} A {f(Rb)} {f(Rb)} 0 {large} 1 {s(J)} "
            f"A {f(rk)} {f(rk)} 0 0 1 {s(P1)} Z")


def line_circle(p, d, c, R, forward=True):
    """intersection of p + t d with circle (c,R); forward=True takes the larger t, else the smaller."""
    px, py = p[0]-c[0], p[1]-c[1]
    b = 2*(px*d[0] + py*d[1]); cc = px*px + py*py - R*R
    disc = b*b - 4*cc
    if disc < 0: raise SystemExit("line misses the rim")
    t = (-b + math.sqrt(disc))/2 if forward else (-b - math.sqrt(disc))/2
    return (p[0] + t*d[0], p[1] + t*d[1])


def circle_circle(c1, r1, c2, r2):
    """intersections of two circles"""
    dx, dy = c2[0]-c1[0], c2[1]-c1[1]; d = math.hypot(dx, dy)
    a = (r1*r1 - r2*r2 + d*d)/(2*d); h = math.sqrt(max(0, r1*r1 - a*a))
    mx, my = c1[0] + a*dx/d, c1[1] + a*dy/d
    return [(mx + h*dy/d, my - h*dx/d), (mx - h*dy/d, my + h*dx/d)]


def b_paths(P, pts, dx=0.0, dy=0.0):
    """Variant B: blue crescent in front of the face + ink head = disc minus crescent. Two non-overlapping pieces."""
    xb, yb, Rb = P['xb']+dx, P['yb']+dy, P['Rb']; Cb = (xb, yb)
    rt = P['r_t']; rc = pts['rc']
    def sh(p): return (p[0]+dx, p[1]+dy)
    B, tA, tB, U, L, Cc, T = [sh(pts[k]) for k in 'B tA tB U L Cc T'.split()]
    lf = math.radians(P['lean_f'])
    Htop = line_circle(B, (-math.sin(lf), -math.cos(lf)), Cb, Rb)           # forehead line meets the rim
    # The chin arc would meet the rim at only ~20 deg, a 6-unit taper of blue to a point. Instead the crescent
    # ends on a horizontal cut b_cut above the chin apex: Pc on the chin arc, Pr on the rim, and the ink
    # takes everything below it (the bust's truncation, as on a coin).
    yc = Cc[1] - P['b_cut']
    Pc = (Cc[0] + math.sqrt(rc*rc - (yc-Cc[1])**2), yc)
    Pr = (xb + math.sqrt(Rb*Rb - (yc-yb)**2), yc)
    def s(p): return f"{f(p[0])} {f(p[1])}"
    def sweep_cw(p, q):
        return (math.degrees(math.atan2(q[1]-yb, q[0]-xb)) - math.degrees(math.atan2(p[1]-yb, p[0]-xb))) % 360
    large_blue = 1 if sweep_cw(Htop, Pr) > 180 else 0
    large_ink = 1 if sweep_cw(Pr, Htop) > 180 else 0
    ink = (f"M {s(Htop)} L {s(B)} L {s(tA)} A {f(rt)} {f(rt)} 0 0 1 {s(tB)} L {s(U)} L {s(L)} "
           f"A {f(rc)} {f(rc)} 0 0 1 {s(Pc)} L {s(Pr)} A {f(Rb)} {f(Rb)} 0 {large_ink} 1 {s(Htop)} Z")
    blue = (f"M {s(Htop)} A {f(Rb)} {f(Rb)} 0 {large_blue} 1 {s(Pr)} L {s(Pc)} A {f(rc)} {f(rc)} 0 0 0 {s(L)} L {s(U)} L {s(tB)} "
            f"A {f(rt)} {f(rt)} 0 0 0 {s(tA)} L {s(B)} Z")
    # crossing angles (how decisively each horn closes)
    def ang_between(t1, t2):
        return math.degrees(math.acos(abs(t1[0]*t2[0] + t1[1]*t2[1])))
    rim_t = lambda q: (-(q[1]-yb), q[0]-xb)
    top_deg = ang_between((math.sin(lf), math.cos(lf)), tuple(v/Rb for v in rim_t(Htop)))
    cut_rim_deg = ang_between((1.0, 0.0), tuple(v/Rb for v in rim_t(Pr)))
    chin_t = (-(Pc[1]-Cc[1]), Pc[0]-Cc[0])
    cut_chin_deg = ang_between((1.0, 0.0), tuple(v/rc for v in chin_t))
    return ink, blue, dict(Htop=Htop, Pc=Pc, Pr=Pr, top_deg=top_deg, cut_w=Pr[0]-Pc[0], cut_rim_deg=cut_rim_deg, cut_chin_deg=cut_chin_deg)


def disc_path(P, dx=0.0):
    xb, yb, Rb = P['xb']+dx, P['yb'], P['Rb']
    return f"M {f(xb-Rb)} {f(yb)} A {f(Rb)} {f(Rb)} 0 1 1 {f(xb+Rb)} {f(yb)} A {f(Rb)} {f(Rb)} 0 1 1 {f(xb-Rb)} {f(yb)} Z"


def report(P, pts):
    xb, yb, Rb = P['xb'], P['yb'], P['Rb']
    B, T, U, L, G, J, P1, K, Cc = [pts[k] for k in 'B T U L G J P1 K Cc'.split()]
    print("points:")
    for k in 'J P1 K B tA T tB U L Cc Tj Qj'.split():
        v = pts[k]; print(f"  {k:3s} ({v[0]:.2f}, {v[1]:.2f})")
    Tj, Qj = pts['Tj'], pts['Qj']
    print(f"chin r {pts['rc']:.2f}, arc from L ({math.degrees(math.atan2(L[1]-Cc[1], L[0]-Cc[0])):.0f} deg) to the jaw ({pts['beta']:.0f} deg); jaw line {math.dist(Tj,Qj):.2f} long from ({Tj[0]:.2f},{Tj[1]:.2f}) to ({Qj[0]:.2f},{Qj[1]:.2f})")
    print(f"forehead: J.y {J[1]:.2f} -> P1.y {P1[1]:.2f} (fillet) -> B.y {B[1]:.2f}; straight part {math.dist(P1,B):.2f} long, lean {P['lean_f']} deg")
    sweep = (math.degrees(math.atan2(J[1]-yb, J[0]-xb)) - math.degrees(math.atan2(pts['Qj'][1]-yb, pts['Qj'][0]-xb))) % 360
    print(f"crown: fillet top at ({K[0]:.2f}, {K[1]-P['r_k']:.2f}); back arc sweep {sweep:.0f} deg from the jaw to J")
    print(f"nose: {T[1]-B[1]:.1f} tall, {T[0]-B[0]:.1f} forward, lean {P['lean_n']} deg; brow bend {P['lean_n']-P['lean_f']} deg")
    und = (U[0]-T[0], U[1]-T[1]); print(f"underside: {math.hypot(*und):.2f} long, {math.degrees(math.atan2(und[1], -und[0])):.1f} deg below horizontal")
    lip = (L[0]-U[0], L[1]-U[1]); print(f"lip plane: {math.hypot(*lip):.2f} long, lean {math.degrees(math.atan2(lip[0], lip[1])):.1f} deg forward")
    print(f"chin apex x {Cc[0]+pts['rc']:.2f} at y {Cc[1]:.2f}: {Cc[0]+pts['rc']-T[0]:.2f} vs nose tip, {Cc[0]+pts['rc']-L[0]:.2f} vs lip base")
    top = yb-Rb if J[0] >= xb else K[1]-P['r_k']
    bottom = max(yb+Rb, pts['Tj'][1])
    print(f"ink box: x {xb-Rb:.2f}..{T[0]:.2f}  y {top:.2f}..{bottom:.2f}  ({T[0]-(xb-Rb):.2f} x {bottom-top:.2f})")
    h = Rb*2; print(f"profile shares of {h:.0f}: forehead {(B[1]-(yb-Rb))/h:.2f} nose {(T[1]-B[1])/h:.2f} lower {((yb+Rb)-T[1])/h:.2f}")
    # crescent width in front of the face for variant B (same circle)
    print("variant B crescent (profile -> rim) by y:")
    def front_x(y):
        segs = [(P1,B),(B,T),(T,U),(U,L)]
        for a,b in segs:
            if min(a[1],b[1]) <= y <= max(a[1],b[1]):
                t=(y-a[1])/(b[1]-a[1]); return a[0]+t*(b[0]-a[0])
        if L[1] <= y <= Cc[1]-P['b_cut']:   # below the cut the crescent has ended
            return Cc[0]+math.sqrt(max(0,pts['rc']**2-(y-Cc[1])**2))
        if y < P1[1]:
            # fillet
            if y >= K[1]-P['r_k']:
                return K[0]+math.sqrt(max(0,P['r_k']**2-(y-K[1])**2))
        return None
    for y in range(8, 58, 4):
        fx = front_x(y)
        if fx is None: continue
        rim = xb + math.sqrt(max(0, Rb*Rb-(y-yb)**2))
        print(f"  y={y:2d} front {fx:5.2f} rim {rim:5.2f} crescent {rim-fx:5.2f}")


def write(outdir, P):
    pts = build(P)
    os.makedirs(outdir, exist_ok=True)
    a = (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">\n'
         f'  <!-- thera. mark, profile-wordmark A ("She looks at the name"): one goddess profile facing right, solid ink. '
         f'Back of the head: circle c({f(P["xb"])},{f(P["yb"])}) r{f(P["Rb"])}. Front: crown fillet r{f(P["r_k"])}, straight forehead leaning {P["lean_f"]} deg, '
         f'one straight nose leaning {P["lean_n"]} deg with an r{f(P["r_t"])} tip, underside, short lip plane, one chin arc r{f(pts["rc"])} that runs tangent into a jaw line, itself tangent to the back circle. '
         f'One closed path, arcs and lines only, no strokes. -->\n'
         f'  <path fill="{INK}" d="{head_path(P, pts)}"/>\n</svg>\n')
    dx = P['shift_b']
    ink, blue, bi = b_paths(P, pts, dx, P['shift_by'])
    cutw = f(bi['cut_w'])
    b = (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">\n'
         f'  <!-- thera. mark, profile-wordmark B ("Struck on the coin"): the same profile with the back arc extended to a full disc, c({f(P["xb"]+dx)},{f(P["yb"]+P["shift_by"])}) r{f(P["Rb"])}. '
         f'Two pieces that share one edge: the head in ink (the disc behind the profile; the forehead line runs out to the rim at the crown, and under the chin a short horizontal cut (the truncation of the bust) runs to the rim so the crescent ends {cutw} units wide instead of tapering to a point) and the crescent in front of her face in muted blue. No overlap, no masks. -->\n'
         f'  <path fill="{BLUE}" d="{blue}"/>\n'
         f'  <path fill="{INK}" d="{ink}"/>\n</svg>\n')
    print(f"B: forehead meets rim at ({bi['Htop'][0]:.2f},{bi['Htop'][1]:.2f}) crossing {bi['top_deg']:.0f} deg; "
          f"crescent ends on a {bi['cut_w']:.2f}-wide horizontal cut at y {bi['Pc'][1]:.2f} from the chin ({bi['Pc'][0]:.2f}) to the rim ({bi['Pr'][0]:.2f}), "
          f"{bi['cut_chin_deg']:.0f} deg to the chin arc and {bi['cut_rim_deg']:.0f} deg to the rim")
    open(os.path.join(outdir, 'mark-a.svg'), 'w').write(a)
    open(os.path.join(outdir, 'mark-b.svg'), 'w').write(b)
    report(P, pts)
    return pts


if __name__ == '__main__':
    outdir = sys.argv[1]
    if len(sys.argv) > 2:
        P.update(json.loads(sys.argv[2]))
    write(outdir, P)
