#!/usr/bin/env python3
"""Build design/logos/gallery.html from the concept folders and the workflow result JSONs.

Usage: python3 build-gallery.py <out.html> <results.json> [<results2.json> ...]
Each results JSON is the `result` object of one workflow run ({ranked, judgments, concepts, inspections, finals}).
"""
import html, json, os, re, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]          # design/logos
CONCEPTS = ROOT / "concepts"
FINAL = ROOT / "final"
out_path = Path(sys.argv[1])
rounds = [json.load(open(p)) for p in sys.argv[2:]]

# ---------- helpers ----------
def esc(s): return html.escape(str(s), quote=True)

def load_svg(path, uid, color=None):
    """Inline-ready SVG: no xml decl/comments/style, no fixed size, ids namespaced, optional recolor."""
    p = Path(path)
    if not p.exists():
        return '<span class="missing">missing</span>'
    s = p.read_text()
    s = re.sub(r"<\?xml[^>]*\?>", "", s)
    s = re.sub(r"<!--.*?-->", "", s, flags=re.S)
    s = re.sub(r"<style.*?</style>", "", s, flags=re.S)
    s = re.sub(r'<svg([^>]*)>', lambda m: "<svg" + re.sub(r'\s(width|height)="[^"]*"', "", m.group(1)) + ' role="img" aria-hidden="true" focusable="false">', s, count=1)
    # namespace ids
    ids = re.findall(r'\sid="([^"]+)"', s)
    for i in ids:
        s = s.replace(f'id="{i}"', f'id="{uid}-{i}"').replace(f'url(#{i})', f'url(#{uid}-{i})').replace(f'href="#{i}"', f'href="#{uid}-{i}"')
    if color:
        s = s.replace("#223848", color).replace("#F7F9FA", color).replace("#f7f9fa", color)
    return s.strip()

def tile(svg_ink, svg_light, size, label=None, cls=""):
    """A preview tile that shows the ink mark on light backgrounds and the light mark on dark ones (switched by CSS)."""
    lab = f'<span class="tlabel">{esc(label)}</span>' if label else ""
    return (f'<div class="tile {cls}" style="--s:{size}px">'
            f'<div class="ink">{svg_ink}</div><div class="light">{svg_light}</div>{lab}</div>')

def score_rows(slug, judgments):
    rows = []
    for j in judgments:
        for s in j["scores"]:
            if s["slug"] == slug:
                tot = s["distinctiveness"] + s["relevance"] + s["legibility"] + s["craft"]
                rows.append((j["lens"], s, tot))
    return rows

# ---------- gather ----------
concept_meta = {}   # slug -> dict(round, concept, inspection, judgments(list of rows), avg)
finals = []         # list of dict(round, final, avg, rows)
for ri, r in enumerate(rounds, start=1):
    ins_by = {i["slug"]: i for i in r.get("inspections", []) if i}
    rank_by = {x["slug"]: x for x in r.get("ranked", [])}
    for c in r.get("concepts", []):
        if not c: continue
        rows = score_rows(c["slug"], r.get("judgments", []))
        concept_meta[c["slug"]] = dict(round=ri, concept=c, inspection=ins_by.get(c["slug"]), rows=rows,
                                       avg=rank_by.get(c["slug"], {}).get("avg"), variants=rank_by.get(c["slug"], {}).get("variants", {}))
    for f in r.get("finals", []):
        if not f: continue
        rows = score_rows(f["slug"], r.get("judgments", []))
        finals.append(dict(round=ri, final=f, avg=rank_by.get(f["slug"], {}).get("avg"), rows=rows))

# combined ranking from the latest round that re-judged everything
latest = rounds[-1]
combined = latest.get("ranked", [])

# ---------- finalists ----------
def finalist_block(fd, idx):
    f = fd["final"]; slug = f["slug"]; d = FINAL / slug
    uid = f"f{idx}-{slug}"
    mark = load_svg(d / "mark.svg", uid + "-m")
    mark_light = load_svg(d / "mark-light.svg", uid + "-ml") if (d / "mark-light.svg").exists() else load_svg(d / "mark.svg", uid + "-ml", "#F7F9FA")
    accent_file = d / "mark-accent.svg" if (d / "mark-accent.svg").exists() else d / "mark-mono.svg"
    accent = load_svg(accent_file, uid + "-ac")
    accent_label = "accent · light bg" if accent_file.name == "mark-accent.svg" else "one colour"
    fav = load_svg(d / "favicon.svg", uid + "-fv")
    fav_light = load_svg(d / "favicon.svg", uid + "-fvl", "#F7F9FA")
    app = load_svg(d / "app-icon.svg", uid + "-ai")
    app_light = load_svg(d / "app-icon-light.svg", uid + "-ail") if (d / "app-icon-light.svg").exists() else ""
    lock_h = load_svg(d / "lockup-horizontal.svg", uid + "-lh")
    lock_s = load_svg(d / "lockup-stacked.svg", uid + "-ls")
    lock_h_light = load_svg(d / "lockup-horizontal.svg", uid + "-lhl", "#F7F9FA")
    name = f.get("name") or slug
    if (d / "avatar.svg").exists():
        avatar_ctx = (f'<div class="ctx avatar"><span class="bubble own">{load_svg(d / "avatar.svg", uid + "-av")}</span>'
                      f'<span class="msg"><b class="who">Thera</b>You’re already in SoMa on Thursday. Want to reach out to Alex?</span></div>')
    else:
        av = load_svg(d / "mark-light.svg", uid + "-av") if (d / "mark-light.svg").exists() else load_svg(d / "mark.svg", uid + "-av", "#F7F9FA")
        avatar_ctx = f'<div class="ctx avatar"><span class="bubble">{av}</span><span class="msg">You’re already in SoMa on Thursday. Want to reach out to Alex?</span></div>'
    rationale = f.get("rationale", "")
    sentences = re.split(r"(?<=[.!?])\s+", rationale)
    lede = " ".join(sentences[:2])
    rest = " ".join(sentences[2:])
    rows = fd["rows"]
    avg = fd["avg"]
    score_html = "".join(
        f'<div class="score"><span class="lens">{esc(lens)}</span><span class="num">{tot}<small>/40</small></span></div>'
        for lens, s, tot in rows)
    changes = f.get("changes", [])[:5]
    changes_html = "".join(f"<li>{esc(c)}</li>" for c in changes)
    comments_html = "".join(f'<li><b>{esc(lens)}</b> {esc(s["comment"])}</li>' for lens, s, tot in rows)
    return f'''
<article class="finalist" id="final-{esc(slug)}">
  <div class="fin-head">
    <div class="fin-title">
      <span class="eyebrow">Finalist {idx} · round {fd["round"]}</span>
      <h3>{esc(name)}</h3>
      <p class="lede">{esc(lede)}</p>
    </div>
    <div class="scores" aria-label="Judge scores">
      {score_html}
      <div class="score total"><span class="lens">average</span><span class="num">{avg if avg is not None else "–"}<small>/40</small></span></div>
    </div>
  </div>

  <div class="fin-hero">
    {tile(mark, mark_light, 220, "mark", "big")}
    <div class="context" aria-label="In context">
      <div class="ctx navbar"><span class="ctx-mark">{load_svg(d / "mark.svg", uid + "-nav")}</span><span class="ctx-word">thera.</span><span class="ctx-links"><i></i><i></i><i></i></span><span class="ctx-btn">Get Early Access</span></div>
      <div class="ctx-row">
        <div class="ctx tab"><span class="fav16">{load_svg(d / "favicon.svg", uid + "-tab")}</span><span>Thera — The Relationship Assistant</span></div>
        {avatar_ctx}
        <div class="ctx home"><span class="appicon">{app}</span><span class="applabel">thera</span></div>
      </div>
    </div>
  </div>

  <div class="strip" aria-label="Variants">
    {tile(mark, mark_light, 88, "mark")}
    {tile(accent, accent, 88, accent_label, "keep")}
    {tile(fav, fav_light, 88, "favicon")}
    <div class="tile actual wide" style="--s:88px"><div class="sizes"><span style="width:16px;height:16px">{load_svg(d / "favicon.svg", uid + "-s16")}</span><span style="width:24px;height:24px">{load_svg(d / "favicon.svg", uid + "-s24")}</span><span style="width:32px;height:32px">{load_svg(d / "favicon.svg", uid + "-s32")}</span><span style="width:48px;height:48px">{load_svg(d / "favicon.svg", uid + "-s48")}</span></div><div class="sizes light"><span style="width:16px;height:16px">{load_svg(d / "favicon.svg", uid + "-l16", "#F7F9FA")}</span><span style="width:24px;height:24px">{load_svg(d / "favicon.svg", uid + "-l24", "#F7F9FA")}</span><span style="width:32px;height:32px">{load_svg(d / "favicon.svg", uid + "-l32", "#F7F9FA")}</span><span style="width:48px;height:48px">{load_svg(d / "favicon.svg", uid + "-l48", "#F7F9FA")}</span></div><span class="tlabel">16 · 24 · 32 · 48 px</span></div>
    <div class="tile" style="--s:88px"><div class="ink">{app}</div><div class="light">{app_light or app}</div><span class="tlabel">app icon</span></div>
    <div class="tile wide" style="--s:88px"><div class="ink">{lock_h}</div><div class="light">{lock_h_light}</div><span class="tlabel">lockup</span></div>
    <div class="tile stacked" style="--s:88px"><div class="ink">{lock_s}</div><div class="light">{load_svg(d / "lockup-stacked.svg", uid + "-lsl", "#F7F9FA")}</div><span class="tlabel">stacked</span></div>
  </div>

  <details class="notes">
    <summary>Judge comments and refinement notes</summary>
    <div class="notes-grid">
      <div>{("<h4>Rationale, continued</h4><p>" + esc(rest) + "</p>") if rest else ""}<h4 style="margin-top:14px">What the judges said</h4><ul>{comments_html}</ul></div>
      <div><h4>What the refinement pass changed</h4><ul>{changes_html}</ul><p class="construction"><b>Construction.</b> {esc(f.get("construction", ""))[:600]}{"…" if len(f.get("construction", "")) > 600 else ""}</p></div>
    </div>
  </details>
</article>'''

# ---------- direction grid ----------
def concept_card(slug, meta, idx):
    c = meta["concept"]; d = CONCEPTS / slug; uid = f"c{idx}-{slug}"
    a = load_svg(d / "mark-a.svg", uid + "-a"); b = load_svg(d / "mark-b.svg", uid + "-b")
    a_l = load_svg(d / "mark-a.svg", uid + "-al", "#F7F9FA"); b_l = load_svg(d / "mark-b.svg", uid + "-bl", "#F7F9FA")
    lock = load_svg(d / "lockup-a.svg", uid + "-lk")
    avg = meta["avg"]
    pref = c.get("preferred", "a").upper()
    jv = meta.get("variants") or {}
    jpref = max(jv.items(), key=lambda kv: kv[1])[0].upper() if jv else pref
    is_final = any(fd["final"]["slug"] == slug for fd in finals)
    rows = meta["rows"]
    comments_html = "".join(f'<li><b>{esc(lens)}</b> ({tot}/40) {esc(s["comment"])}</li>' for lens, s, tot in rows)
    looks = meta["inspection"]["looksLike"] if meta.get("inspection") else ""
    badge = '<span class="badge final">Finalist</span>' if is_final else ('<span class="badge pending">Awaiting judges</span>' if meta.get("pending") else "")
    return f'''
<article class="concept" id="concept-{esc(slug)}">
  <div class="c-head"><div><span class="eyebrow">Round {meta["round"]} · {esc(slug)}</span><h3>{esc(c.get("name", slug))}</h3></div><div class="c-score">{badge}{"" if meta.get("pending") else f'<span class="num">{avg if avg is not None else "–"}<small>/40</small></span>'}</div></div>
  <div class="c-marks">
    <div class="c-variant{" pref" if jpref == "A" and not meta.get("pending") else ""}">{tile(a, a_l, 96)}<span class="vlabel">A{" · judges’ pick" if jpref == "A" and not meta.get("pending") else ""}</span><span class="v16">{load_svg(d / "mark-a.svg", uid + "-a16")}</span></div>
    <div class="c-variant{" pref" if jpref == "B" and not meta.get("pending") else ""}">{tile(b, b_l, 96)}<span class="vlabel">B{" · judges’ pick" if jpref == "B" and not meta.get("pending") else ""}</span><span class="v16">{load_svg(d / "mark-b.svg", uid + "-b16")}</span></div>
  </div>
  <p class="idea">{esc(c.get("idea", ""))}</p>
  <div class="c-lockup">{lock}</div>
  {"" if meta.get("pending") else f'<details><summary>Judges and inspection</summary><p class="looks"><b>Inspector:</b> {esc(looks)}</p><ul>{comments_html}</ul></details>'}
</article>'''

# concepts on disk that no round has judged yet (a round still in progress)
pending = []
for d in sorted(CONCEPTS.iterdir()):
    if d.is_dir() and d.name not in concept_meta and (d / "mark-a.svg").exists():
        readme = (d / "README.md").read_text() if (d / "README.md").exists() else ""
        paras = [x.strip() for x in readme.split("\n\n") if x.strip() and not x.strip().startswith("#")]
        idea = paras[0] if paras else ""
        idea = idea.replace("**", "").replace("`", "")
        pending.append((d.name, dict(round=len(rounds) + 1, concept=dict(slug=d.name, name=d.name.replace("-", " ").title(), idea=idea[:420] + ("…" if len(idea) > 420 else ""), preferred="a"), inspection=None, rows=[], avg=None, variants={}, pending=True)))

# order: by avg desc
ordered = sorted(concept_meta.items(), key=lambda kv: -(kv[1]["avg"] or 0))
finals_sorted = sorted(finals, key=lambda fd: -(fd["avg"] or 0))

n_dirs = len(concept_meta) + len(pending); n_finals = len(finals_sorted); n_rounds = len(rounds)
latest_round = len(rounds)
latest_finals = [fd for fd in finals_sorted if fd["round"] == latest_round] if n_rounds >= 3 else []
earlier_finals = [fd for fd in finals_sorted if fd not in latest_finals]
latest_html = "".join(finalist_block(fd, i + 1) for i, fd in enumerate(latest_finals))
finalists_html = "".join(finalist_block(fd, i + 1) for i, fd in enumerate(earlier_finals))
latest_section = f'''<section id="persona"><span class="eyebrow">Round {latest_round}</span><h2>Thera, the personal assistant</h2><p class="muted">The adopted crescent mark, evolved into a minimal, elegant goddess in profile who doubles as the assistant’s face. Each set includes Thera’s chat avatar, shown here labelled as she would appear in the product.</p>{latest_html}</section>''' if latest_html else ""
concepts_html = "".join(concept_card(slug, meta, i) for i, (slug, meta) in enumerate(ordered))
pending_html = "".join(concept_card(slug, meta, 100 + i) for i, (slug, meta) in enumerate(pending))
pending_section = f'''<section id="pending"><h2>Round {len(rounds) + 1}: profile-led directions, in progress</h2><p class="muted">Drawn and rendered; judging and refinement are still running. These will move into the ranked list and, if they win, into the finalists.</p><div class="grid">{pending_html}</div></section>''' if pending else ""

combined_html = ""
if n_rounds > 1 and combined:
    items = "".join(f'<li><a href="#{"final-" if any(fd["final"]["slug"]==x["slug"] for fd in finals) else "concept-"}{esc(x["slug"])}">{esc(x["slug"])}</a><span class="num">{x["avg"]}</span></li>' for x in combined)
    combined_html = f'<section class="combined"><h2>Combined ranking</h2><p class="muted">In round {n_rounds} the judges scored the new concepts together with the earlier finalists, so this order compares across rounds.</p><ol>{items}</ol></section>'

page = f'''<title>Thera Logo Explorations</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Newsreader:ital,wght@1,400;1,500&display=swap">
<style>
/* Layout: one column of wide cards; previews on fixed light/dark tiles so marks are judged on real backgrounds. */
:root {{
  --bg:#F7F9FA; --card:#FFFFFF; --surface:#EAF0F4; --line:#DDE6EC; --fg:#223848; --body:#586C79; --muted:#5D7488;
  --primary:#466680; --accent:#8DA8BB; --ink:#1C2E3D; --mint:#D8E8E5; --mint-fg:#2f5d53;
  --font:"Inter",ui-sans-serif,system-ui,-apple-system,"Segoe UI",sans-serif; --serif:"Newsreader","Iowan Old Style",Georgia,serif;
}}
@media (prefers-color-scheme: dark) {{ :root:not([data-theme="light"]) {{ --bg:#16242F; --card:#1C2E3D; --surface:#223848; --line:#2E4458; --fg:#F7F9FA; --body:#C4D5E0; --muted:#A9BCCB; --primary:#8DA8BB; --accent:#8DA8BB; --mint:#2b4a44; --mint-fg:#CFE6DF; color-scheme:dark }} }}
:root[data-theme="dark"] {{ --bg:#16242F; --card:#1C2E3D; --surface:#223848; --line:#2E4458; --fg:#F7F9FA; --body:#C4D5E0; --muted:#A9BCCB; --primary:#8DA8BB; --accent:#8DA8BB; --mint:#2b4a44; --mint-fg:#CFE6DF; color-scheme:dark }}
*{{box-sizing:border-box}}
body{{margin:0;background:var(--bg);color:var(--body);font-family:var(--font);font-size:15px;line-height:1.55;-webkit-font-smoothing:antialiased}}
.wrap{{max-width:1120px;margin:0 auto;padding-block:40px 80px;padding-inline:20px}}
h1,h2,h3,h4{{color:var(--fg);margin:0;text-wrap:balance;letter-spacing:-.02em}}
h1{{font-size:clamp(2rem,5vw,3.25rem);line-height:1.05;font-weight:600}}
h1 em{{font-family:var(--serif);font-style:italic;font-weight:400}}
h2{{font-size:1.5rem;font-weight:600;margin-bottom:6px}}
h3{{font-size:1.25rem;font-weight:600}} h4{{font-size:.8rem;text-transform:uppercase;letter-spacing:.12em;color:var(--muted);margin-bottom:8px}}
p{{margin:0}} .muted{{color:var(--muted)}} .lede{{font-size:1rem;max-width:62ch;text-wrap:pretty}}
.eyebrow{{display:block;font-size:.6875rem;font-weight:600;letter-spacing:.16em;text-transform:uppercase;color:var(--primary);margin-bottom:6px}}
header.top{{display:flex;flex-direction:column;gap:14px;margin-bottom:36px;max-width:760px}}
header.top p{{max-width:66ch}}
.method{{display:flex;flex-wrap:wrap;gap:8px 18px;font-size:.8125rem;color:var(--muted)}} .method span b{{color:var(--fg);font-weight:600}}
.controls{{display:flex;flex-wrap:wrap;align-items:center;gap:10px;margin:28px 0 14px}}
.seg{{display:inline-flex;border:1px solid var(--line);border-radius:999px;padding:3px;background:var(--card)}}
.seg button{{appearance:none;border:0;background:transparent;color:var(--body);font:inherit;font-size:.8125rem;font-weight:500;padding:6px 12px;border-radius:999px;cursor:pointer;min-height:32px}}
.seg button[aria-pressed="true"]{{background:var(--primary);color:#fff}} .seg button:focus-visible{{outline:2px solid var(--primary);outline-offset:2px}}
section{{margin-top:44px}}
/* tiles */
.tile{{position:relative;width:var(--s);height:var(--s);border-radius:14px;border:1px solid var(--line);background:#FFFFFF;display:flex;align-items:center;justify-content:center;flex:0 0 auto;overflow:hidden}}
.tile svg{{width:calc(var(--s) * .72);height:calc(var(--s) * .72);display:block}}
.tile.big{{--s:220px;border-radius:24px}} .tile.big svg{{width:160px;height:160px}}
.tile .ink,.tile .light{{display:flex;align-items:center;justify-content:center}} .tile .light{{display:none}}
.tile .tlabel{{position:absolute;left:8px;bottom:5px;font-size:.625rem;letter-spacing:.06em;text-transform:uppercase;color:#8DA8BB}}
.tile.wide{{width:calc(var(--s) * 2.6)}} .tile.wide svg{{width:calc(var(--s) * 2.2);height:calc(var(--s) * .7)}} .tile.stacked svg{{width:calc(var(--s) * .82);height:calc(var(--s) * .82)}}
.tile.actual{{padding:0 10px}} .sizes{{display:flex;align-items:flex-end;gap:8px}} .sizes span{{display:inline-flex}} .sizes span svg{{width:100%;height:100%}} .sizes.light{{display:none}}
[data-bg="dark"] .tile:not(.keep){{background:var(--ink);border-color:#2E4458}} [data-bg="dark"] .tile:not(.keep) .ink{{display:none}} [data-bg="dark"] .tile:not(.keep) .light{{display:flex}} [data-bg="dark"] .sizes{{display:none}} [data-bg="dark"] .sizes.light{{display:flex}} [data-bg="dark"] .tile .tlabel{{color:#8DA8BB}}
[data-bg="surface"] .tile:not(.keep){{background:#EAF0F4}}
.strip{{display:flex;flex-wrap:wrap;gap:10px;margin-top:16px;align-items:center}}
/* finalists */
.finalist{{background:var(--card);border:1px solid var(--line);border-radius:24px;padding:28px;margin-top:18px}}
.fin-head{{display:flex;flex-wrap:wrap;gap:20px 32px;justify-content:space-between;align-items:flex-start}}
.fin-title{{flex:1 1 420px;min-width:0}}
.scores{{display:grid;grid-template-columns:repeat(4,auto);gap:6px 18px;align-items:end}}
.score{{display:flex;flex-direction:column;gap:2px}} .score .lens{{font-size:.6875rem;text-transform:uppercase;letter-spacing:.1em;color:var(--muted)}}
.score .num{{font-size:1.25rem;font-weight:600;color:var(--fg);font-variant-numeric:tabular-nums}} .score .num small{{font-size:.7rem;color:var(--muted);font-weight:500;margin-left:2px}}
.score.total .num{{color:var(--primary)}}
.fin-hero{{display:grid;grid-template-columns:220px minmax(0,1fr);gap:20px;margin-top:22px;align-items:stretch}}
.context{{display:flex;flex-direction:column;gap:10px;min-width:0}}
.ctx{{border:1px solid var(--line);background:var(--bg);border-radius:14px;display:flex;align-items:center;gap:10px;padding:10px 14px;min-width:0}}
.ctx.navbar{{height:52px}} .ctx-mark svg{{width:22px;height:22px;display:block}} .ctx-word{{font-weight:600;letter-spacing:-.03em;color:var(--fg);font-size:1.1rem}}
.ctx-links{{display:flex;gap:10px;margin-left:auto}} .ctx-links i{{display:block;width:44px;height:8px;border-radius:4px;background:var(--line)}}
.ctx-btn{{font-size:.75rem;font-weight:500;color:#fff;background:#466680;border-radius:999px;padding:7px 12px;white-space:nowrap}}
.ctx-row{{display:grid;grid-template-columns:minmax(0,1.2fr) minmax(0,1.6fr) auto;gap:10px;flex:1}}
.ctx.tab{{font-size:.75rem;color:var(--body);white-space:nowrap;overflow:hidden}} .ctx.tab span:last-child{{overflow:hidden;text-overflow:ellipsis;min-width:0}}
.fav16{{display:inline-flex;width:16px;height:16px;flex:0 0 16px}} .fav16 svg{{width:16px;height:16px}}
.ctx.avatar{{align-items:flex-start;font-size:.8125rem;color:var(--fg)}} .bubble{{display:inline-flex;align-items:center;justify-content:center;width:32px;height:32px;border-radius:50%;background:#466680;flex:0 0 32px}} .bubble svg{{width:20px;height:20px}} .bubble.own{{width:40px;height:40px;flex:0 0 40px;background:transparent}} .bubble.own svg{{width:40px;height:40px}} .who{{display:block;font-size:.6875rem;letter-spacing:.06em;text-transform:uppercase;color:var(--primary);margin-bottom:2px}}
.msg{{background:var(--card);border:1px solid var(--line);border-radius:12px 12px 12px 4px;padding:8px 10px;min-width:0}}
.ctx.home{{flex-direction:column;justify-content:center;gap:6px;background:linear-gradient(180deg,#C4D5E0,#8DA8BB);border:0;padding:12px 16px}} .appicon svg{{width:56px;height:56px;border-radius:13px;display:block;box-shadow:0 6px 14px -6px rgba(0,0,0,.4)}} .applabel{{font-size:.6875rem;color:#fff;text-shadow:0 1px 2px rgba(0,0,0,.3)}}
details.notes{{margin-top:18px;border-top:1px solid var(--line);padding-top:12px}} summary{{cursor:pointer;font-weight:500;color:var(--primary);font-size:.9rem}} summary:focus-visible{{outline:2px solid var(--primary);outline-offset:3px;border-radius:4px}}
.notes-grid{{display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:24px;margin-top:14px;font-size:.875rem}}
.notes-grid ul{{margin:0;padding-left:18px;display:flex;flex-direction:column;gap:8px}} .construction{{margin-top:12px;font-size:.8rem;color:var(--muted)}}
/* concept grid */
.grid{{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:16px;margin-top:16px}}
.concept{{background:var(--card);border:1px solid var(--line);border-radius:20px;padding:20px;display:flex;flex-direction:column;gap:12px;min-width:0}}
.c-head{{display:flex;justify-content:space-between;gap:12px;align-items:flex-start}} .c-score{{display:flex;align-items:center;gap:8px}} .c-score .num{{font-weight:600;color:var(--fg);font-variant-numeric:tabular-nums}} .c-score small{{color:var(--muted);font-weight:500}}
.badge{{font-size:.625rem;text-transform:uppercase;letter-spacing:.1em;font-weight:600;padding:3px 8px;border-radius:999px;background:var(--mint);color:var(--mint-fg)}} .badge.pending{{background:var(--surface);color:var(--muted)}}
.c-marks{{display:flex;gap:12px}} .c-variant{{display:flex;flex-direction:column;gap:4px;align-items:flex-start;position:relative}}
.vlabel{{font-size:.6875rem;color:var(--muted)}} .c-variant.pref .vlabel{{color:var(--primary);font-weight:600}}
.v16{{position:absolute;right:6px;top:6px;width:16px;height:16px;display:inline-flex}} .v16 svg{{width:16px;height:16px}} [data-bg="dark"] .v16{{display:none}}
.idea{{font-size:.875rem;text-wrap:pretty}} .c-lockup svg{{width:100%;max-width:220px;height:auto;display:block}}
.concept details{{font-size:.8125rem;border-top:1px solid var(--line);padding-top:8px}} .concept details ul{{padding-left:16px;margin:8px 0 0;display:flex;flex-direction:column;gap:6px}} .looks{{margin-top:8px}}
.combined ol{{columns:2;column-gap:32px;padding-left:20px;margin:10px 0 0;font-variant-numeric:tabular-nums}} .combined li{{display:flex;justify-content:space-between;gap:8px;padding:4px 0;border-bottom:1px solid var(--line);break-inside:avoid}} .combined a{{color:var(--fg);text-decoration:none}} .combined a:hover{{text-decoration:underline}}
footer{{margin-top:48px;border-top:1px solid var(--line);padding-top:16px;font-size:.8125rem;color:var(--muted)}} code{{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:.8em;background:var(--surface);padding:1px 5px;border-radius:4px;color:var(--fg)}}
.missing{{font-size:.7rem;color:#b4604f}}
@media (max-width:720px){{ .ctx-btn,.ctx-links{{display:none}} .fin-hero{{grid-template-columns:1fr}} .tile.big{{--s:180px;margin:0 auto}} .ctx-row{{grid-template-columns:1fr}} .ctx.home{{flex-direction:row;justify-content:flex-start}} .scores{{grid-template-columns:repeat(2,auto)}} .combined ol{{columns:1}} .finalist{{padding:18px;border-radius:18px}} .tile.wide{{width:calc(var(--s) * 2.2)}} }}
@media (prefers-reduced-motion:no-preference){{ .seg button{{transition:background .15s,color .15s}} }}
</style>
<div class="wrap" id="root" data-bg="light">
  <header class="top">
    <span class="eyebrow">thera. · brand identity · exploration</span>
    <h1>Logo explorations, <em>round {n_rounds}.</em></h1>
    <p class="lede">Marks inspired by Thera, the classical name of Santorini: the caldera ring, the goddess in profile, the ringed city of Atlantis, and the Θ of Θήρα. Every direction was drawn in SVG, rendered at 512, 48 and 16 px, inspected, and scored by three judges. The strongest were refined into full sets.</p>
    <div class="method"><span><b>{n_dirs}</b> directions</span><span><b>{n_dirs * 2}</b> marks drawn</span><span><b>{n_finals}</b> finalists refined</span><span><b>3</b> judges: brand, craft, product</span></div>
  </header>

  <div class="controls" role="group" aria-label="Preview background">
    <span class="muted" style="font-size:.8125rem">Preview marks on</span>
    <div class="seg"><button type="button" data-set="light" aria-pressed="true">White</button><button type="button" data-set="surface" aria-pressed="false">Surface</button><button type="button" data-set="dark" aria-pressed="false">Dark</button></div>
  </div>

  {latest_section}

  <section id="finalists">
    <h2>{"Earlier finalists" if latest_section else "Finalists"}</h2>
    <p class="muted">Each finalist comes as a mark, a light version for dark backgrounds, an accent version, a 16 px favicon, an app icon and two lockups. The “in context” row places it in the site navbar, a browser tab, a chat bubble and a home screen.</p>
    {finalists_html}
  </section>

  {combined_html}

  {pending_section}

  <section id="directions">
    <h2>All directions</h2>
    <p class="muted">Ordered by the judges’ average. The small square in each tile’s corner is the mark at its true 16 px size.</p>
    <div class="grid">{concepts_html}</div>
  </section>

  <footer>Source files live in the website repo under <code>design/logos/</code> (concepts/&lt;slug&gt;/ for every direction, final/&lt;slug&gt;/ for the refined sets, each with a README and renders). To adopt a mark on the site, replace <code>src/app/icon.svg</code>, the symbol in <code>src/components/ui/Wordmark.tsx</code>, and the Apple and Open Graph images.</footer>
</div>
<script>
(function(){{
  var root=document.getElementById('root');var btns=root.querySelectorAll('.seg button');
  function set(v){{root.setAttribute('data-bg',v);btns.forEach(function(b){{b.setAttribute('aria-pressed',String(b.dataset.set===v))}});try{{localStorage.setItem('thera-logo-bg',v)}}catch(e){{}}}}
  btns.forEach(function(b){{b.addEventListener('click',function(){{set(b.dataset.set)}})}});
  try{{var s=localStorage.getItem('thera-logo-bg');if(s==='dark'||s==='surface'||s==='light')set(s)}}catch(e){{}}
}})();
</script>
'''
out_path.write_text(page)
print(f"wrote {out_path} ({out_path.stat().st_size // 1024} KB): {n_dirs} directions, {n_finals} finalists")
