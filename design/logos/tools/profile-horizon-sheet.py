#!/usr/bin/env python3
"""Contact sheet: several profile-horizon parameter sets side by side. Usage: sheet.py out.svg spec.json"""
import json, sys, importlib.util, os
spec = importlib.util.spec_from_file_location("ph", os.path.join(os.path.dirname(__file__), "profile-horizon.py"))
ph = importlib.util.module_from_spec(spec); spec.loader.exec_module(ph)
out, specfile = sys.argv[1], sys.argv[2]
items = json.load(open(specfile))
cols = min(3, len(items)); rows = (len(items) + cols - 1) // cols
parts = [f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {cols*64} {rows*64}">', '<rect width="100%" height="100%" fill="#ffffff"/>']
for i, it in enumerate(items):
    p = dict(ph.DEFAULTS[it.get("base", "a")]); p.update(it.get("params", {}))
    lower, upper, notes = ph.build(p)
    x, y = (i % cols) * 64, (i // cols) * 64
    parts.append(f'<g transform="translate({x} {y})"><path fill="#223848" d="{upper}"/><path fill="#223848" d="{lower}"/>'
                 f'<text x="2" y="62" font-size="3" font-family="Inter, sans-serif" fill="#8DA8BB">{it["label"]}</text></g>')
    print(it["label"], "| gaps:", {k: ph.f(v) for k, v in notes.items() if k.startswith("gap")}, "| chin apex", ph.f(notes["chin apex"][1]), "| H", ph.P(notes["H hairline (on rim)"]))
parts.append('</svg>')
open(out, "w").write("\n".join(parts))
