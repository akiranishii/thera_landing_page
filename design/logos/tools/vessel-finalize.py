"""Write the full thera. Vessel deliverable set from one parameter dict."""
import json, sys, os, math
sys.path.insert(0, os.path.dirname(__file__)); from vessel import build, fmt

P = json.loads(sys.argv[1]); OUT = sys.argv[2]; os.makedirs(OUT, exist_ok=True)
INK, LIGHT, PRIMARY, DARK = "#223848", "#F7F9FA", "#466680", "#1C2E3D"
COIN = "M 4 32 A 28 28 0 1 0 60 32 A 28 28 0 1 0 4 32 Z"
_, rep, void = build(P)
d_full = f"{COIN}\n    {void}"
cmt = ("thera. mark, The Vessel: a solid coin (c 32,32 r 28) with a vase-shaped void whose two edges are profiles "
       "facing each other. One path, evenodd, no strokes. Each profile is a forehead arc, a straight nose with a "
       f"soft r{P['tip_r']} tip, a short lip plane and one chin arc; neck gap {rep['neck_gap']} units.")

def mark(color, name, comment=cmt):
    s = f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">\n  <!-- {comment} -->\n  <path fill="{color}" fill-rule="evenodd" d="{d_full}"/>\n</svg>\n'
    open(os.path.join(OUT, name), "w").write(s)

mark(INK, "mark.svg"); mark(LIGHT, "mark-light.svg", cmt + " Light version for dark backgrounds.")
mark(PRIMARY, "mark-accent.svg", cmt + " Single-colour accent version in the primary blue; a two-tone split was tested and rejected (see README).")

# Favicon: same silhouette snapped to the 16 px grid (1 px = 4 units). No face detail.
fav_void = "M 20 12 L 44 12 L 36 26 L 36 34 L 40 38 L 40 48 A 10 10 0 0 1 24 48 L 24 38 L 28 34 L 28 26 Z"
fav = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
  <!-- thera. favicon: the Vessel reduced to its 16 px silhouette, a coin with a keyhole. Edges sit on the 16 px pixel grid (1 px = 4 units): rim row 3, neck 2 px wide at rows 6.5-8.5, body 4 px wide, round base ending at row 13. -->
  <path fill="{INK}" fill-rule="evenodd" d="{COIN}
    {fav_void}"/>
</svg>
'''
open(os.path.join(OUT, "favicon.svg"), "w").write(fav)

# App icon: rounded square, light mark at ~60% size.
sc = P.get("icon_scale", 0.64); off = (64 - 64*sc)/2
for name, bg, fg in (("app-icon.svg", DARK, LIGHT), ("app-icon-light.svg", LIGHT, INK)):
    s = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
  <!-- thera. app icon: the Vessel at {int(sc*100)}% on the {'dark section' if bg == DARK else 'background'} colour. -->
  <rect width="64" height="64" rx="14" fill="{bg}"/>
  <g transform="translate({fmt(off)} {fmt(off)}) scale({sc})">
    <path fill="{fg}" fill-rule="evenodd" d="{d_full}"/>
  </g>
</svg>
'''
    open(os.path.join(OUT, name), "w").write(s)

# Wordmark metrics, Inter SemiBold (measured from the font): per 1 px of font size.
CAP = 1490/2048; INK_L = 0.45/46; INK_W = 119.27/46; DOT_DESC = 0.52/46
def text_el(x, y, size):
    return f'<text x="{fmt(x)}" y="{fmt(y)}" font-family="Inter, system-ui, sans-serif" font-weight="600" font-size="{size}" letter-spacing="-1.5" fill="{INK}">thera.</text>'

# Horizontal lockup: coin 38 px beside 46 px type, coin centred on the cap height, 15 px gap, 16 px margins.
fs = 46; coin = 38; s = coin/56; cap = CAP*fs; gap = 15; m = 16
coin_left = m; coin_top = m; coin_cy = coin_top + coin/2
baseline = coin_cy + cap/2
gx = coin_left - 4*s; gy = coin_top - 4*s
tx = coin_left + coin + gap - INK_L*fs
W = tx + INK_L*fs + INK_W*fs + m; H = coin_top + coin + m
hl = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {fmt(W)} {fmt(H)}" width="{fmt(W)}" height="{fmt(H)}">
  <!-- thera. horizontal lockup. Coin {coin} px (1.13 x the {fmt(cap)} px cap height of Inter 600 at {fs} px), centred on the cap height so it overshoots the baseline and the ascender equally; {gap} px between coin and the t; {m} px margins fitted to the ink. -->
  <g transform="translate({fmt(gx)} {fmt(gy)}) scale({fmt(s)})">
    <path fill="{INK}" fill-rule="evenodd" d="{d_full}"/>
  </g>
  {text_el(tx, baseline, fs)}
</svg>
'''
open(os.path.join(OUT, "lockup-horizontal.svg"), "w").write(hl)
print("horizontal", dict(W=round(W,2), H=round(H,2), baseline=round(baseline,2), text_x=round(tx,2), cap=round(cap,2)))

# Stacked lockup: coin 56 px above 46 px type, both centred on x; 16 px between coin and cap top; 20 px margins.
fs2 = 46; coin2 = 56; s2 = 1.0; cap2 = CAP*fs2; gap2 = 16; m2 = 20
inkw = INK_W*fs2; W2 = inkw + 2*m2; cx = W2/2
coin_top2 = m2; base2 = coin_top2 + coin2 + gap2 + cap2
tx2 = cx - inkw/2 - INK_L*fs2
H2 = base2 + DOT_DESC*fs2 + m2
st = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {fmt(W2)} {fmt(H2)}" width="{fmt(W2)}" height="{fmt(H2)}">
  <!-- thera. stacked lockup. Coin {coin2} px centred above the wordmark (Inter 600, {fs2} px); {gap2} px from coin to cap height; the wordmark is centred on its ink, period included. -->
  <g transform="translate({fmt(cx-32)} {fmt(coin_top2-4)})">
    <path fill="{INK}" fill-rule="evenodd" d="{d_full}"/>
  </g>
  {text_el(tx2, base2, fs2)}
</svg>
'''
open(os.path.join(OUT, "lockup-stacked.svg"), "w").write(st)
print("stacked", dict(W=round(W2,2), H=round(H2,2), baseline=round(base2,2), text_x=round(tx2,2)))
print("report", json.dumps(rep))
