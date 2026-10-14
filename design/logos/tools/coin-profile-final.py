#!/usr/bin/env python3
"""Final-set generator for the thera. coin-profile mark ("Goddess on the coin").

Usage:
  python3 design/logos/tools/coin-profile-final.py <outdir>            # writes the whole final set from PARAMS
  python3 design/logos/tools/coin-profile-final.py <outdir> --report   # also prints band widths / corner angles

Geometry (viewBox 0 0 64 64): one disc c(32,32) r28. The goddess in profile is knocked out as a
single band of light from the top rim to the bottom rim. The band's back edge is a vertical line
(x = 24, pixel-true at 16 and 48 px); its front edge is the profile: forehead arc, straight nose with
a filleted tip, nose underside, lip plane, chin arc, and a neck that leaves the chin tangentially and
meets the rim at x = 36 (also pixel-true). Two closed paths, no strokes, no masks.
"""
import math, os, sys

INK, LIGHT, PRIMARY, MUTED, DARK = '#223848', '#F7F9FA', '#466680', '#8DA8BB', '#1C2E3D'
C = (32.0, 32.0)


def f(v):
    s = f"{v:.2f}".rstrip('0').rstrip('.')
    return '0' if s in ('-0', '') else s


def unit(v):
    n = math.hypot(*v)
    return (v[0] / n, v[1] / n)


def rim(x, R, top):
    dy = math.sqrt(R * R - (x - C[0]) ** 2)
    return (x, C[1] - dy if top else C[1] + dy)


def ang(p):
    return math.degrees(math.atan2(p[1] - C[1], p[0] - C[0]))


def fillet(p1, t, p2, r):
    """Round the corner at t between p1->t->p2 with radius r. Returns (a, b, sweep, corner_deg)."""
    d1 = unit((p1[0] - t[0], p1[1] - t[1]))
    d2 = unit((p2[0] - t[0], p2[1] - t[1]))
    a_ = math.acos(max(-1, min(1, d1[0] * d2[0] + d1[1] * d2[1])))
    dist = r / math.tan(a_ / 2)
    a = (t[0] + d1[0] * dist, t[1] + d1[1] * dist)
    b = (t[0] + d2[0] * dist, t[1] + d2[1] * dist)
    cross = d1[0] * d2[1] - d1[1] * d2[0]
    return a, b, (1 if cross < 0 else 0), math.degrees(a_)


def tangent_from(W, c, r):
    """Tangent point on circle (c, r) seen from the external point W, on the front (+x) side."""
    dx, dy = W[0] - c[0], W[1] - c[1]
    d = math.hypot(dx, dy)
    a = math.atan2(dy, dx) - math.acos(r / d)
    return (c[0] + r * math.cos(a), c[1] + r * math.sin(a)), math.degrees(a)


def corner_at_rim(p, d_in, R):
    """Angle between an edge leaving rim point p into the disc (direction d_in) and the rim tangent."""
    rad = ((p[0] - C[0]) / R, (p[1] - C[1]) / R)
    t = (-rad[1], rad[0])
    d = unit(d_in)
    a = math.degrees(math.acos(max(-1, min(1, d[0] * t[0] + d[1] * t[1]))))
    return min(a, 180 - a)


def throat_fillet(c, rc, W, lean_deg, rf):
    """Concave fillet of radius rf between the chin circle (c, rc) and the neck line through W.
    The neck line leans lean_deg from vertical (positive = throat ahead of the exit). Returns
    (Tc, Tn, F): tangent point on the chin circle, tangent point on the neck line, fillet centre."""
    th = math.radians(lean_deg)
    n = (math.sin(th), -math.cos(th))          # up the neck line
    m = (math.cos(th), math.sin(th))           # +x normal (ink side)
    P0 = (W[0] + rf * m[0], W[1] + rf * m[1])
    d = (P0[0] - c[0], P0[1] - c[1])
    dn = d[0] * n[0] + d[1] * n[1]
    disc = dn * dn - (d[0] ** 2 + d[1] ** 2) + (rc + rf) ** 2
    s = -dn - math.sqrt(disc)                  # the root nearest the exit
    F = (P0[0] + s * n[0], P0[1] + s * n[1])
    u = unit((F[0] - c[0], F[1] - c[1]))
    Tc = (c[0] + rc * u[0], c[1] + rc * u[1])
    Tn = (W[0] + s * n[0], W[1] + s * n[1])
    return Tc, Tn, F


def build(P):
    R = P['R']
    xb = P['x_back']
    H = rim(P['x_crown'], R, True)
    B, T, U = (tuple(P[k]) for k in ('brow', 'tip', 'under'))
    rc = P['chin_r']
    c = tuple(P['chin_c'])
    aL = math.radians(P['lip_deg'])
    L = (c[0] + rc * math.cos(aL), c[1] + rc * math.sin(aL))
    W = rim(P['x_neck'], R, False)
    rf = P.get('throat_r', 0)
    if rf > 0:
        Th, Tn, F = throat_fillet(c, rc, W, P.get('neck_lean', 0), rf)
        aTh = math.degrees(math.atan2(Th[1] - c[1], Th[0] - c[0]))
        neck = f"A {f(rf)} {f(rf)} 0 0 0 {f(Tn[0])} {f(Tn[1])} L {f(W[0])} {f(W[1])} Z"
    else:
        Th, aTh = tangent_from(W, c, rc)
        Tn, F = Th, None
        neck = f"L {f(W[0])} {f(W[1])} Z"
    a, b, sw, tip_ang = fillet(B, T, U, P['tip_r'])
    Hb, Wb = rim(xb, R, True), rim(xb, R, False)
    fr = P['forehead_r']

    body = f"M {f(Hb[0])} {f(Hb[1])} A {R} {R} 0 0 0 {f(Wb[0])} {f(Wb[1])} Z"
    span = (ang(W) - ang(H)) % 360
    large = 1 if span > 180 else 0
    front = (f"M {f(W[0])} {f(W[1])} A {R} {R} 0 {large} 0 {f(H[0])} {f(H[1])} "
             f"A {f(fr)} {f(fr)} 0 0 1 {f(B[0])} {f(B[1])} "
             f"L {f(a[0])} {f(a[1])} A {f(P['tip_r'])} {f(P['tip_r'])} 0 0 {sw} {f(b[0])} {f(b[1])} "
             f"L {f(U[0])} {f(U[1])} L {f(L[0])} {f(L[1])} "
             f"A {f(rc)} {f(rc)} 0 0 1 {f(Th[0])} {f(Th[1])} " + neck)
    pts = dict(H=H, B=B, T=T, U=U, L=L, Th=Th, Tn=Tn, W=W, Hb=Hb, Wb=Wb, chin_c=c, aTh=aTh,
               tip_a=a, tip_b=b, tip_ang=tip_ang, F=F)
    return body, front, pts


def front_x(P, pts, y):
    """x of the profile at height y (forehead arc approximated by its chord)."""
    H, B, T, U, L, Th, W = (pts[k] for k in 'H B T U L Th W'.split())
    for p, q in ((H, B), (B, T), (T, U), (U, L)):
        if min(p[1], q[1]) <= y <= max(p[1], q[1]):
            t = (y - p[1]) / (q[1] - p[1])
            return p[0] + t * (q[0] - p[0])
    c, rc = pts['chin_c'], P['chin_r']
    if L[1] <= y <= Th[1]:
        return c[0] + math.sqrt(max(0, rc * rc - (y - c[1]) ** 2))
    Tn, F = pts['Tn'], pts['F']
    if F is not None and Th[1] <= y <= Tn[1]:
        rf = P['throat_r']
        return F[0] - math.sqrt(max(0, rf * rf - (y - F[1]) ** 2))
    if Tn[1] <= y <= W[1]:
        t = (y - Tn[1]) / (W[1] - Tn[1]) if W[1] != Tn[1] else 0
        return Tn[0] + t * (W[0] - Tn[0])
    return None


def report(P, pts):
    R = P['R']
    H, B, T, U, L, Th, W, Hb, Wb = (pts[k] for k in 'H B T U L Th W Hb Wb'.split())
    c = pts['chin_c']
    print("points:")
    for k in 'H B T U L Th Tn F W Hb Wb chin_c'.split():
        if pts.get(k) is not None:
            print(f"  {k:7s} ({f(pts[k][0])}, {f(pts[k][1])})")
    print(f"crown chord {math.dist(H, Hb):.2f}   neck chord {math.dist(W, Wb):.2f}")
    print("band width (back->profile) and front ink (profile->rim) by y:")
    for y in range(6, 60, 3):
        fx = front_x(P, pts, y)
        if fx is None:
            continue
        rx = C[0] + math.sqrt(R * R - (y - C[1]) ** 2)
        print(f"  y={y:2d}  front {fx:5.1f}  band {fx - P['x_back']:5.1f}  frontink {rx - fx:5.1f}")
    print(f"corners: crown {corner_at_rim(H, (B[0]-H[0], B[1]-H[1]), R):.0f}, "
          f"neck {corner_at_rim(W, (Th[0]-W[0], Th[1]-W[1]), R):.0f}, "
          f"body top {corner_at_rim(Hb, (0, 1), R):.0f}, body bottom {corner_at_rim(Wb, (0, -1), R):.0f}")
    nose_h = T[1] - B[1]
    prof_h = W[1] - H[1]
    print(f"nose: {nose_h:.1f} tall, {math.degrees(math.atan2(T[0]-B[0], T[1]-B[1])):.1f} deg from vertical, "
          f"projects {T[0]-B[0]:.1f} past the brow; profile height {prof_h:.1f}; nose share {nose_h/prof_h:.2f}")
    print(f"forehead: {B[1]-H[1]:.1f} tall, chord leans {math.degrees(math.atan2(B[0]-H[0], B[1]-H[1])):.1f} deg")
    print(f"tip corner {pts['tip_ang']:.0f} deg, fillet r {P['tip_r']}")
    print(f"underside: {math.degrees(math.atan2(U[1]-T[1], T[0]-U[0])):.1f} deg below horizontal, {math.dist(T, U):.1f} long")
    print(f"lip plane: {math.dist(U, L):.1f} long, leans {math.degrees(math.atan2(L[0]-U[0], L[1]-U[1])):.1f} deg forward")
    apex = c[0] + P['chin_r']
    print(f"chin: r {P['chin_r']} from {P['lip_deg']} to {pts['aTh']:.1f} deg (sweep {pts['aTh']-P['lip_deg']:.0f}); "
          f"apex x {apex:.2f} at y {c[1]:.2f}: {T[0]-apex:.2f} behind the tip, {apex-L[0]:.2f} ahead of the lip")
    Tn = pts['Tn']
    if pts['F'] is not None:
        print(f"throat: r {P['throat_r']} fillet from ({f(Th[0])}, {f(Th[1])}) to ({f(Tn[0])}, {f(Tn[1])}); neck straight {math.dist(Tn, W):.2f} long, lean {P.get('neck_lean', 0)} deg; "
              f"throat behind the lip base by {L[0] - min(Th[0], Tn[0]):.2f}; apex to exit recession {apex - W[0]:.2f}")
    else:
        nd = unit((W[0] - Th[0], W[1] - Th[1]))
        print(f"neck: {math.degrees(math.atan2(nd[1], -nd[0])):.1f} deg below horizontal, {math.dist(Th, W):.1f} long; "
              f"apex to exit recession {apex - W[0]:.2f}")
    # lip corner
    tl = (-math.sin(math.radians(P['lip_deg'])), math.cos(math.radians(P['lip_deg'])))
    lp = unit((L[0] - U[0], L[1] - U[1]))
    print(f"lip corner (lip plane vs chin tangent): {math.degrees(math.acos(max(-1, min(1, tl[0]*lp[0]+tl[1]*lp[1])))):.0f} deg")


def svg(paths, comment, size_attr=True):
    body = "\n".join(f'  <path fill="{fill}" d="{d}"/>' for fill, d in paths)
    wh = ' width="64" height="64"' if size_attr else ''
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"{wh}>\n  <!-- {comment} -->\n{body}\n</svg>\n'


def write(path, text):
    with open(path, 'w') as fh:
        fh.write(text)


def regenerate(outdir, P, FAV, LOCK, ICON):
    os.makedirs(outdir, exist_ok=True)
    body, front, pts = build(P)
    desc = P['comment']
    write(os.path.join(outdir, 'mark.svg'), svg([(INK, body), (INK, front)], desc))
    write(os.path.join(outdir, 'mark-light.svg'), svg([(LIGHT, body), (LIGHT, front)],
          desc + " Light version (#F7F9FA) for #1C2E3D and darker: the goddess becomes a dark head between two light pieces."))
    if P.get('accent_two_tone', True):
        write(os.path.join(outdir, 'mark-accent.svg'), svg([(PRIMARY, body), (MUTED, front)],
              "thera. mark, coin-profile, two-tone accent: the coin body in primary #466680, the crescent in front of the face in muted #8DA8BB (the moon over the caldera). Same geometry as mark.svg. For large moments on light backgrounds only (hero, print, 128 px and up); the face sits on the muted piece, so use mark.svg wherever the mark must carry on its own."))
    else:
        write(os.path.join(outdir, 'mark-accent.svg'), svg([(PRIMARY, body), (PRIMARY, front)],
              "thera. mark, coin-profile, accent: same geometry as mark.svg in primary #466680. A two-tone (body #466680, crescent #8DA8BB) was rendered and rejected; see README."))
    # favicon: explicit pixel-snapped profile
    write(os.path.join(outdir, 'favicon.svg'),
          f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">\n'
          f'  <!-- {FAV["comment"]} -->\n'
          f'  <style>@media (prefers-color-scheme: dark) {{ path {{ fill: {LIGHT}; }} }}</style>\n'
          f'  <path fill="{INK}" d="{body}"/>\n'
          f'  <path fill="{INK}" d="{FAV["front"]}"/>\n</svg>\n')
    # app icons
    s = ICON['scale']
    t = (64 - 64 * s) / 2
    for name, tile, ink in (('app-icon.svg', DARK, LIGHT), ('app-icon-light.svg', LIGHT, INK)):
        write(os.path.join(outdir, name),
              f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">\n'
              f'  <!-- thera. app icon, coin-profile: {tile} tile (rx 14) with the {"light" if ink == LIGHT else "ink"} mark at {s:.2f} (disc {56*s:.1f} units, {56*s/64*100:.0f}% of the tile), centred. -->\n'
              f'  <rect width="64" height="64" rx="14" fill="{tile}"/>\n'
              f'  <g transform="translate({f(t)} {f(t)}) scale({f(s)})">\n'
              f'    <path fill="{ink}" d="{body}"/>\n'
              f'    <path fill="{ink}" d="{front}"/>\n  </g>\n</svg>\n')
    # horizontal lockup
    L = LOCK
    sc = round(L['disc'] / 56, 4)
    tx = L['mark_x'] - 4 * sc
    ty = L['mark_cy'] - 32 * sc
    text_x = L['mark_x'] + L['disc'] + L['gap'] - L['ink_lead']
    width = text_x + L['ink_lead'] + L['ink_w'] + L['margin']
    write(os.path.join(outdir, 'lockup-horizontal.svg'),
          f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {f(width)} {f(L["height"])}" width="{f(width)}" height="{f(L["height"])}">\n'
          f'  <!-- thera. horizontal lockup, coin-profile. Disc {L["disc"]} px (scale {sc:.4f}) at x {L["mark_x"]}..{f(L["mark_x"]+L["disc"])}, '
          f'centred on the cap band of Inter 600 at {L["font"]} px (cap top {f(L["baseline"]-L["cap"])}, baseline {L["baseline"]}), '
          f'so it overshoots the cap height by {f((L["disc"]-L["cap"])/2)} px top and bottom like an O. {L["gap"]} px from the disc to the t; '
          f'the period\'s ink ends at {f(text_x + L["ink_lead"] + L["ink_w"])}; margins {L["margin"]}. The goddess looks at her name. -->\n'
          f'  <g transform="translate({f(tx)} {f(ty)}) scale({sc})">\n'
          f'    <path fill="{INK}" d="{body}"/>\n    <path fill="{INK}" d="{front}"/>\n  </g>\n'
          f'  <text x="{f(text_x)}" y="{L["baseline"]}" font-family="Inter, system-ui, sans-serif" font-size="{L["font"]}" font-weight="600" letter-spacing="-1.5" fill="{INK}">thera.</text>\n</svg>\n')
    # stacked lockup
    S = L['stacked']
    sw = S['width']
    ms = S['disc'] / 56
    mtx = sw / 2 - 32 * ms
    mty = S['top'] - 4 * ms
    disc_bottom = S['top'] + S['disc']
    baseline = disc_bottom + S['gap'] + L['cap']
    height = baseline + S['bottom']
    write(os.path.join(outdir, 'lockup-stacked.svg'),
          f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {f(sw)} {f(height)}" width="{f(sw)}" height="{f(height)}">\n'
          f'  <!-- thera. stacked lockup, coin-profile. Disc {S["disc"]} px centred on x {f(sw/2)}, y {S["top"]}..{f(disc_bottom)}; '
          f'wordmark Inter 600 {L["font"]} px, letter-spacing -1.5, baseline {f(baseline)} (cap top {f(baseline - L["cap"])}, {S["gap"]} px under the disc). '
          f'The wordmark is set so the disc\'s axis falls midway between the centre of "thera" and the centre of "thera.". -->\n'
          f'  <g transform="translate({f(mtx)} {f(mty)}){"" if ms == 1 else f" scale({f(ms)})"}">\n'
          f'    <path fill="{INK}" d="{body}"/>\n    <path fill="{INK}" d="{front}"/>\n  </g>\n'
          f'  <text x="{f(S["text_x"])}" y="{f(baseline)}" font-family="Inter, system-ui, sans-serif" font-size="{L["font"]}" font-weight="600" letter-spacing="-1.5" fill="{INK}">thera.</text>\n</svg>\n')
    return pts


# ---------------------------------------------------------------- parameters
PARAMS = {
    "R": 28, "x_back": 24, "x_crown": 36, "x_neck": 36,
    "brow": [36.6, 17], "forehead_r": 40,
    "tip": [44, 33], "tip_r": 2,
    "under": [38.7, 37],
    "chin_c": [32.5, 47], "chin_r": 8, "lip_deg": -37,
    "throat_r": 4, "neck_lean": 0,
    "accent_two_tone": True,
    "comment": ("thera. mark, coin-profile (Goddess on the coin): one disc c(32,32) r28 with the goddess in profile knocked out "
                "as a single band of light from the top rim to the bottom rim. Back edge of the band: a vertical line at x 24. "
                "Front edge: the profile (forehead arc r40, one straight nose with an r2 tip, nose underside, short lip plane, chin arc r8, "
                "r4 throat, and a vertical neck at x 36 that meets the rim). Both band exits are 12 wide and both edges sit on the 16 px "
                "grid. Two closed paths, no strokes, no masks: the coin body behind the head and the crescent in front of the face. "
                "She looks right, toward the wordmark."),
}

FAVICON = {
    "front": "M 36 59.71 A 28 28 0 0 0 36 4.29 L 36 20 L 44 32 L 40 36 L 40 48 L 36 52 Z",
    "comment": ("thera. favicon, coin-profile: the mark re-cut for the 16 px grid (1 px = 4 units). Same disc and the same vertical "
                "back edge at x 24 (column 6); the profile is reduced to straight moves that sit on the grid: forehead at x 36 (column 9), "
                "nose ridge to a tip on (44, 32), underside to (40, 36), lip-and-chin plane at x 40 down to y 48, back to the neck at "
                "x 36 (y 52) and down to the rim. At 16 px the band is three clean columns with a nose and a one-column chin step. "
                "Flips to #F7F9FA under prefers-color-scheme: dark. Use at 16 and 32; use mark.svg at 48 and above."),
}

LOCKUP = {
    # Inter SemiBold at 44 px: cap height 32 (cap top = baseline - 32); "thera." ink starts 0.5 px right of the text origin
    # and ends 113.5 px right of it (measured for dome-horizon with the real font).
    "font": 44, "cap": 32, "baseline": 56, "ink_lead": 0.5, "ink_w": 113,
    "disc": 36, "mark_x": 16, "mark_cy": 40, "gap": 15, "margin": 16, "height": 80,
    "stacked": {"width": 160, "disc": 56, "top": 20, "gap": 18, "bottom": 20, "text_x": 25.5},
}

ICON = {"scale": 0.66}

if __name__ == '__main__':
    if len(sys.argv) < 2:
        print(__doc__)
        sys.exit(1)
    pts = regenerate(sys.argv[1], PARAMS, FAVICON, LOCKUP, ICON)
    if '--report' in sys.argv:
        report(PARAMS, pts)
