#!/usr/bin/env python3
"""Parametric generator for the thera. coin-profile mark (concept round 2).
Usage: python3 design/logos/tools/coin-profile.py <outdir>   (regenerates the concept set from PARAMS_A / PARAMS_B at the bottom)
Face looks right. Light band = head (crown to neck) knocked out of an ink disc.
Front edge of the band = profile (forehead arc, nose, underside, lip plane, chin arc, neck).
Back edge = one arc. Both ends cut by the rim."""
import math, json, sys

def circ_pt(c, r, deg):
    a = math.radians(deg)
    return (c[0] + r*math.cos(a), c[1] + r*math.sin(a))

def rim_y(cx, cy, R, x, top=True):
    dy = math.sqrt(R*R - (x-cx)**2)
    return cy - dy if top else cy + dy

def line_rim(p, d, c, R):
    """first positive t where p + t d hits circle (c,R) from inside"""
    px, py = p[0]-c[0], p[1]-c[1]
    a = d[0]**2 + d[1]**2
    b = 2*(px*d[0] + py*d[1])
    cc = px*px + py*py - R*R
    disc = b*b - 4*a*cc
    t = (-b + math.sqrt(disc))/(2*a)
    return (p[0] + t*d[0], p[1] + t*d[1])

def fillet(p1, t, p2, r):
    """round the corner at t between segments p1->t->p2 with radius r. returns (a, b, sweep)"""
    d1 = (p1[0]-t[0], p1[1]-t[1]); n1 = math.hypot(*d1); d1 = (d1[0]/n1, d1[1]/n1)
    d2 = (p2[0]-t[0], p2[1]-t[1]); n2 = math.hypot(*d2); d2 = (d2[0]/n2, d2[1]/n2)
    cosang = d1[0]*d2[0] + d1[1]*d2[1]
    ang = math.acos(max(-1, min(1, cosang)))
    dist = r / math.tan(ang/2)
    a = (t[0] + d1[0]*dist, t[1] + d1[1]*dist)
    b = (t[0] + d2[0]*dist, t[1] + d2[1]*dist)
    cross = d1[0]*d2[1] - d1[1]*d2[0]
    sweep = 1 if cross < 0 else 0
    return a, b, sweep

def arc_through(p, q, sag, side=1):
    """circle through p,q with sagitta sag; side=+1 bulges to the right of p->q direction (screen coords)."""
    mx, my = (p[0]+q[0])/2, (p[1]+q[1])/2
    dx, dy = q[0]-p[0], q[1]-p[1]
    c = math.hypot(dx, dy)
    r = (c*c/4 + sag*sag)/(2*sag)
    # right-perpendicular of (dx,dy) in screen coords (y down): (-dy, dx) is rotation by +90 (clockwise on screen)
    # We want "right of travel direction" on screen: travelling down (0,1), right is (-1,0)?? no: travelling down screen, right-hand side is to the LEFT on screen (x negative)... define bulge direction explicitly instead.
    return r

def f(v): 
    s = f"{v:.2f}".rstrip('0').rstrip('.')
    return s if s != '-0' else '0'

def build(P):
    C = (32.0, 32.0); R = P['R']
    # ---- front edge (profile), top to bottom ----
    H = (P['xH'], rim_y(*C, R, P['xH'], True))
    B = tuple(P['B'])
    T = tuple(P['T'])
    U = tuple(P['U'])
    cc = tuple(P['chin_c']); rc = P['chin_r']
    L = circ_pt(cc, rc, P['aL'])
    Th = circ_pt(cc, rc, P['aTh'])
    # neck: tangent at Th, down
    ta = math.radians(P['aTh'])
    nd = (-math.sin(ta), math.cos(ta))
    if P.get('neck_deg') is not None:
        # override neck direction (deg below horizontal, going left) -> small corner at Th
        a = math.radians(P['neck_deg']); nd = (-math.cos(a), math.sin(a))
    W = line_rim(Th, nd, C, R)
    # nose tip fillet
    ta_, tb_, sw = fillet(B, T, U, P['tip_r'])
    # forehead arc H->B radius
    fr = P['forehead_r']
    # ---- back edge ----
    Hb = (P['xHb'], rim_y(*C, R, P['xHb'], True))
    Wb = (P['xWb'], rim_y(*C, R, P['xWb'], False))
    # back arc through Hb and Wb with bulge to the right: radius from sagitta
    dx, dy = Wb[0]-Hb[0], Wb[1]-Hb[1]; ch = math.hypot(dx, dy)
    sag = P['back_sag']; br = (ch*ch/4 + sag*sag)/(2*sag)
    # centre is left of the chord: midpoint - (br - sag) * unit perpendicular pointing right
    ux, uy = dx/ch, dy/ch
    perp_right = (uy, -ux) if uy > 0 else (-uy, ux)  # travelling down, right side on screen is +x: perp (uy,-ux) with uy>0 -> (+,...) ok
    mx, my = (Hb[0]+Wb[0])/2, (Hb[1]+Wb[1])/2
    bc = (mx - perp_right[0]*(br - sag), my - perp_right[1]*(br - sag))

    # ---- paths ----
    # Front ink piece: from W along rim clockwise? On screen, from W (bottom) going right/up around to H (top): that's counter-clockwise visually = sweep 0 in SVG (sweep 1 = clockwise on screen).
    # rim arc W -> H passing through the right side: large-arc? angle span: compute
    def ang(p): return math.degrees(math.atan2(p[1]-C[1], p[0]-C[0]))
    span = (ang(W) - ang(H)) % 360   # going counter-clockwise on screen = decreasing angle in screen coords... keep simple: use large-arc from geometry
    # going from W counter-clockwise (screen) to H through the right side: in screen coords (y down) counter-clockwise visual == decreasing atan2 angle. W angle ~ +80 deg, H ~ -100 deg -> decreasing from 80 to -100 = 180 span
    large = 1 if span > 180 else 0
    front = (f"M {f(W[0])} {f(W[1])} A {R} {R} 0 {large} 0 {f(H[0])} {f(H[1])} "
             f"A {fr} {fr} 0 0 1 {f(B[0])} {f(B[1])} "
             f"L {f(ta_[0])} {f(ta_[1])} A {P['tip_r']} {P['tip_r']} 0 0 {sw} {f(tb_[0])} {f(tb_[1])} "
             f"L {f(U[0])} {f(U[1])} L {f(L[0])} {f(L[1])} "
             f"A {rc} {rc} 0 0 1 {f(Th[0])} {f(Th[1])} L {f(W[0])} {f(W[1])} Z")
    # Back ink piece: from Hb along rim clockwise? going from Hb (top-left) through the left side down to Wb: visually counter-clockwise -> sweep 0
    span2 = (ang(Hb) - ang(Wb)) % 360
    large2 = 1 if span2 > 180 else 0
    back = (f"M {f(Hb[0])} {f(Hb[1])} A {R} {R} 0 {large2} 0 {f(Wb[0])} {f(Wb[1])} "
            f"A {f(br)} {f(br)} 0 0 0 {f(Hb[0])} {f(Hb[1])} Z")
    pts = dict(H=H, B=B, T=T, U=U, L=L, Th=Th, W=W, Hb=Hb, Wb=Wb, back_c=bc, back_r=br, tip=(ta_, tb_))
    return front, back, pts, bc, br

def back_x(bc, br, y):
    return bc[0] + math.sqrt(max(0, br*br - (y-bc[1])**2))

def report(P, pts, bc, br):
    C=(32,32); R=P['R']
    print("points:", {k: (tuple(round(x,2) for x in v) if isinstance(v, tuple) and len(v)==2 and not isinstance(v[0], tuple) else v) for k,v in pts.items() if k not in ('tip',)})
    H,B,T,U,L,Th,W,Hb,Wb = [pts[k] for k in 'H B T U L Th W Hb Wb'.split()]
    print(f"top chord {math.dist(H,Hb):.2f}  bottom chord {math.dist(W,Wb):.2f}")
    # front profile x at y via sampling the segments
    def front_x(y):
        # forehead arc approx by chord interpolation (ok for report), nose etc linear
        segs = [(H,B),(B,T),(T,U),(U,L)]
        for a,b in segs:
            if min(a[1],b[1]) <= y <= max(a[1],b[1]):
                t=(y-a[1])/(b[1]-a[1]); return a[0]+t*(b[0]-a[0])
        cc=P['chin_c']; rc=P['chin_r']
        if L[1] <= y <= Th[1]:
            return cc[0]+math.sqrt(max(0,rc*rc-(y-cc[1])**2))
        if Th[1] <= y <= W[1]:
            t=(y-Th[1])/(W[1]-Th[1]); return Th[0]+t*(W[0]-Th[0])
        return None
    print("band width by y (back->front) and ink in front (front->rim):")
    for y in range(6, 60, 3):
        fx = front_x(y); 
        if fx is None: continue
        bx = back_x(bc, br, y)
        rim = 32 + math.sqrt(R*R-(y-32)**2)
        print(f"  y={y:2d}  back {bx:5.1f} front {fx:5.1f}  band {fx-bx:5.1f}  frontink {rim-fx:5.1f}")
    # corner angles at rim
    def corner(p, d_in, side):
        # angle between the edge direction (pointing into the disc from p) and the rim tangent on the given side
        rad = ((p[0]-32)/R, (p[1]-32)/R)
        tan_r = (-rad[1], rad[0])  # one tangent
        # pick tangent pointing to 'side' (+1 = +x-ish)
        if (tan_r[0]*side) < 0: tan_r = (-tan_r[0], -tan_r[1])
        n = math.hypot(*d_in); d=(d_in[0]/n, d_in[1]/n)
        return math.degrees(math.acos(max(-1,min(1,d[0]*tan_r[0]+d[1]*tan_r[1]))))
    print(f"corner front@H {corner(H,(B[0]-H[0],B[1]-H[1]),+1):.0f}  front@W {corner(W,(Th[0]-W[0],Th[1]-W[1]),+1):.0f}")
    # back piece corners: tangent of back arc at Hb/Wb
    def back_tan(p):
        rad=(p[0]-bc[0], p[1]-bc[1]); return (-rad[1], rad[0])
    tb=back_tan(Hb); 
    if tb[1]<0: tb=(-tb[0],-tb[1])
    print(f"corner back@Hb {corner(Hb,tb,-1):.0f}", end='  ')
    tw=back_tan(Wb)
    if tw[1]>0: tw=(-tw[0],-tw[1])
    print(f"back@Wb {corner(Wb,tw,-1):.0f}")
    print(f"nose: B->T dy {T[1]-B[1]:.1f}, angle from vertical {math.degrees(math.atan2(T[0]-B[0], T[1]-B[1])):.0f} deg; profile height {W[1]-H[1]:.1f}; nose share {(T[1]-B[1])/(W[1]-H[1]):.2f}")
    print(f"forehead H->B height {B[1]-H[1]:.1f}; lip plane len {math.dist(U,L):.1f}; chin apex x {P['chin_c'][0]+P['chin_r']:.1f} vs tip {T[0]} lip {L[0]:.1f}")

def svg(P, front, back, comment, ink="#223848"):
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">\n'
            f'  <!-- {comment} -->\n'
            f'  <path fill="{ink}" d="{back}"/>\n'
            f'  <path fill="{ink}" d="{front}"/>\n</svg>\n')


# ---------------- variant builders ----------------
def build_ring(P, rim=6.0, ink="#223848"):
    """B1: light disc with an ink rim, the head band in ink joining the rim top and bottom."""
    front, back, pts, bc, br = build(P)
    R = P['R']; ri = R - rim
    H,B,T,U,L,Th,W,Hb,Wb = [pts[k] for k in 'H B T U L Th W Hb Wb'.split()]
    ta_, tb_ = pts['tip']
    # ink band as a closed path: Hb -> rim arc (clockwise, over the top) -> H -> profile down -> W -> rim arc (clockwise, under the bottom) -> Wb -> back arc up -> Hb
    band = (f"M {f(Hb[0])} {f(Hb[1])} A {R} {R} 0 0 1 {f(H[0])} {f(H[1])} "
            f"A {P['forehead_r']} {P['forehead_r']} 0 0 1 {f(B[0])} {f(B[1])} "
            f"L {f(ta_[0])} {f(ta_[1])} A {P['tip_r']} {P['tip_r']} 0 0 1 {f(tb_[0])} {f(tb_[1])} "
            f"L {f(U[0])} {f(U[1])} L {f(L[0])} {f(L[1])} "
            f"A {P['chin_r']} {P['chin_r']} 0 0 1 {f(Th[0])} {f(Th[1])} L {f(W[0])} {f(W[1])} "
            f"A {R} {R} 0 0 1 {f(Wb[0])} {f(Wb[1])} "
            f"A {f(br)} {f(br)} 0 0 0 {f(Hb[0])} {f(Hb[1])} Z")
    ring = (f"M 4 32 A {R} {R} 0 1 0 60 32 A {R} {R} 0 1 0 4 32 Z "
            f"M {f(32-ri)} 32 A {ri} {ri} 0 1 1 {f(32+ri)} 32 A {ri} {ri} 0 1 1 {f(32-ri)} 32 Z")
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">\n'
            f'  <!-- {P.get("comment","thera. coin-profile B (ring)")} -->\n'
            f'  <path fill="{ink}" fill-rule="evenodd" d="{ring}"/>\n'
            f'  <path fill="{ink}" d="{band}"/>\n</svg>\n'), pts

def build_half(P, ink="#223848"):
    """B2: positive silhouette, no rim: the disc left of the profile."""
    front, back, pts, bc, br = build(P)
    R = P['R']
    H,B,T,U,L,Th,W = [pts[k] for k in 'H B T U L Th W'.split()]
    ta_, tb_ = pts['tip']
    # from H along the rim through the left side (counter-clockwise on screen = sweep 0) to W, then profile up
    path = (f"M {f(H[0])} {f(H[1])} A {R} {R} 0 1 0 {f(W[0])} {f(W[1])} "
            f"L {f(Th[0])} {f(Th[1])} A {P['chin_r']} {P['chin_r']} 0 0 0 {f(L[0])} {f(L[1])} "
            f"L {f(U[0])} {f(U[1])} L {f(tb_[0])} {f(tb_[1])} A {P['tip_r']} {P['tip_r']} 0 0 0 {f(ta_[0])} {f(ta_[1])} "
            f"L {f(B[0])} {f(B[1])} A {P['forehead_r']} {P['forehead_r']} 0 0 0 {f(H[0])} {f(H[1])} Z")
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">\n'
            f'  <!-- {P.get("comment","thera. coin-profile B (half)")} -->\n'
            f'  <path fill="{ink}" d="{path}"/>\n</svg>\n'), pts

# ---------------- regenerate the concept set ----------------
# python3 design/logos/tools/coin-profile.py design/logos/concepts/coin-profile
# Writes mark-a.svg, mark-b.svg, mark-a-light.svg, mark-b-light.svg and lockup-a.svg from the two parameter dicts below.
PARAMS_A = {"R":28,"xH":31,"B":[34.2,17],"forehead_r":40,"T":[45,33.5],"tip_r":2,"U":[39.5,37.7],
            "chin_c":[33.5,47.5],"chin_r":8,"aL":-35,"aTh":42,"neck_deg":78,"xHb":22,"xWb":27.5,"back_sag":2.5}
PARAMS_B = dict(PARAMS_A, aTh=20, neck_deg=None, chin_r=9, chin_c=[33,47.5])
B_SHIFT = 8.5

def _shift_path(d, dx):
    toks = d.replace(',', ' ').split(); out = []; i = 0
    while i < len(toks):
        t = toks[i]
        if t in ('M','L'): out += [t, f(float(toks[i+1])+dx), toks[i+2]]; i += 3
        elif t == 'A': out += [t] + toks[i+1:i+6] + [f(float(toks[i+6])+dx), toks[i+7]]; i += 8
        else: out.append('Z'); i += 1
    return " ".join(out)

def regenerate(outdir):
    import re, os
    ink, light = '#223848', '#F7F9FA'
    def svg2(paths, comment, fill):
        body = "\n".join(f'  <path fill="{fill}" d="{d}"/>' for d in paths)
        return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">\n  <!-- {comment} -->\n{body}\n</svg>\n'
    front, back, pts, bc, br = build(PARAMS_A)
    cA = "thera. mark, coin-profile A (Goddess on the coin). See README.md for construction."
    open(os.path.join(outdir,'mark-a.svg'),'w').write(svg2([back, front], cA, ink))
    open(os.path.join(outdir,'mark-a-light.svg'),'w').write(svg2([back, front], cA, light))
    s, _ = build_half(PARAMS_B)
    dB = _shift_path(re.search(r'd="([^"]+)"', s).group(1), B_SHIFT)
    cB = "thera. mark, coin-profile B (The obverse). See README.md for construction."
    open(os.path.join(outdir,'mark-b.svg'),'w').write(svg2([dB], cB, ink))
    open(os.path.join(outdir,'mark-b-light.svg'),'w').write(svg2([dB], cB, light))
    sc = 36/56; tx = 16 - 4*sc; ty = 22 - 4*sc
    lock = (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 196 80" width="196" height="80">\n'
            f'  <g transform="translate({tx:.3f} {ty:.3f}) scale({sc:.4f})">\n    <path fill="{ink}" d="{back}"/>\n    <path fill="{ink}" d="{front}"/>\n  </g>\n'
            f'  <text x="66.5" y="56" font-family="Inter, system-ui, sans-serif" font-size="44" font-weight="600" letter-spacing="-1.5" fill="{ink}">thera.</text>\n</svg>\n')
    open(os.path.join(outdir,'lockup-a.svg'),'w').write(lock)

if __name__ == '__main__' and len(sys.argv) == 2:
    regenerate(sys.argv[1])
