# Parameters for cameo.py. All in viewBox units (0..64). Face looks right.

def scaled(p, s, skull, **over):
    """the same bust scaled by s about the skull centre, moved to a new skull centre."""
    q = dict(p)
    for k in ("rs", "rf", "ln", "tip_r", "lu", "ll", "chin_d", "chin_h", "rk"):
        q[k] = p[k] * s
    q["bun"] = (skull[0] + (p["bun"][0] - p["skull"][0]) * s, skull[1] + (p["bun"][1] - p["skull"][1]) * s)
    q["jaw_x"] = skull[0] + (p["jaw_x"] - p["skull"][0]) * s
    q["skull"] = skull
    q.pop("base_y", None)
    q.update(over)
    return q

PARAMS_B = dict(
    comment="thera. cameo B 'Bust': one sealed silhouette, head and neck truncated flat. Skull circle, flatter forehead arc, straight nose, lip plane, chin arc, tangent jaw, short neck; one chignon circle at the nape with a single notch above it.",
    hull=False,
    skull=(31, 19.5), rs=15,                # cranium circle
    hair_deg=-25, rf=30, brow_tan_deg=10,   # forehead arc r30, tangent to the skull at -25 deg; brow tangent 10 deg from vertical
    nose_deg=30, ln=11.5, tip_r=1.3,        # straight nose, 30 deg from vertical, tip filleted r1.3
    under_deg=35, lu=4.4,                   # underside of the nose, 35 deg below horizontal
    lip_deg=5, ll=4,                        # lip plane, 4 long, leaning 5 deg forward
    chin_d=2, chin_h=4.8,                   # chin apex 2 ahead of and 4.8 below the lip base -> chin arc r6.08
    throat_deg=45, jaw_deg=45, jaw_x=43.5,  # chin arc ends at 45 deg; jaw line tangent to it, to the neck front at x 43.5
    neck_deg=85,                            # neck front, 85 deg below horizontal going down-back
    bun=(20, 34.5), rk=8.5,                 # chignon at the nape, centred level with the mouth
    nape_deg=42, nape_line_deg=2,           # neck back leaves the knot's underside at 42 deg, leaning 2 deg back
    base_y=58,
)

PARAMS_A = scaled(
    PARAMS_B, 0.65, (29.8, 26.2),              # 0.72 at (32, 27) left the jaw 2.3 -> 0 from the rim (a tapering sliver); 0.65 here keeps every gap >= 6
    rim=22,
    comment="thera. cameo A 'Brooch': ink ring r28/22 with the same bust at 0.65 floating inside, neck cut by the inner rim. One path, evenodd.",
)

LOCKUP = dict(
    mark="b", scale=0.6355, translate=(8.69, 19.14), w=186, h=80,
    text_x=56.7, baseline=56, font_size=44,
    comment="Bust 34 px tall (1.06 x the 32 px cap height of Inter 600 at 44 px): base on the baseline (y 56), round crown overshooting the cap line by 2 (y 22); knot back at x 16, nose tip at x 42.2. Text ink starts x 57.2 (15 px from the nose) and ends x 170.2; 16 px margins.",
)
