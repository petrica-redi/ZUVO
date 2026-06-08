#!/usr/bin/env python3
"""Build Romani learn flat translations from Romanian learn JSON using Romani vocabulary patterns."""
import json
import re
from pathlib import Path

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[2]
EN_FLAT = None


def flatten(obj, prefix=""):
    out = {}
    if isinstance(obj, dict):
        for key, value in obj.items():
            path = f"{prefix}.{key}" if prefix else key
            if isinstance(value, dict):
                out.update(flatten(value, path))
            else:
                out[path] = value
    return out


def romize(text: str) -> str:
    repl = [
        (r"\bși\b", "thaj"),
        (r"\bsau\b", "vaj"),
        (r"\bdar\b", "amari"),
        (r"\bdacă\b", "te"),
        (r"\bcând\b", "kana"),
        (r"\bnu\b", "na"),
        (r"\beste\b", "si"),
        (r"\bsunt\b", "si"),
        (r"\bpoate\b", "šaj"),
        (r"\bcopil", "čhavo"),
        (r"\bcopii", "čhavore"),
        (r"\bfamilie", "familija"),
        (r"\bsănătate", "sastipen"),
        (r"\bboli", "nasvalipen"),
        (r"\bbolnav", "nasvalo"),
        (r"\bmedic", "doktoro"),
        (r"\bdoctor", "doktoro"),
        (r"\bspital", "spitalo"),
        (r"\bapă", "paji"),
        (r"\bmâini", "vasta"),
        (r"\bmână", "vast"),
        (r"\bzi\b", "dives"),
        (r"\bzile\b", "dives"),
        (r"\bani\b", "berša"),
        (r"\ban\b", "berš"),
        (r"\bcomunitate", "komuniteto"),
        (r"\bRomă", "Rom"),
        (r"\broma\b", "rom"),
        (r"\bînvățare", "sikhavipen"),
        (r"\bvaccin", "vakcin"),
        (r"\bgratuit", "makhlo"),
        (r"\bajutor", "pomoć"),
        (r"\burgent", "phari"),
        (r"\bfrică", "dar"),
        (r"\bstres", "stress"),
        (r"\bsarcină", "pušnipen"),
        (r"\bfeme", "džuvlja"),
        (r"\bspune", "phen"),
        (r"\bmerge", "ja"),
        (r"\bmergi\b", "ja"),
        (r"\bacum\b", "akana"),
        (r"\bazi\b", "ando dives"),
        (r"\bnoapte", "rat"),
        (r"\bziua\b", "dives"),
    ]
    out = text
    for pattern, replacement in repl:
        out = re.sub(pattern, replacement, out, flags=re.IGNORECASE)
    return out


def main():
    en_learn = json.loads((ROOT / "messages/en.json").read_text())["learn"]
    en_flat = flatten(en_learn)
    ro_path = HERE / "learn" / "ro.json"
    if not ro_path.exists():
        raise SystemExit("Run auto-translate-learn.py first to create ro.json")
    ro_flat = flatten(json.loads(ro_path.read_text()))

    rom_flat = {}
    for path, en_val in en_flat.items():
        ro_val = ro_flat[path]
        candidate = romize(ro_val)
        if candidate.strip() == en_val.strip():
            candidate = f"[rom] {ro_val}"
        rom_flat[path] = candidate

    (HERE / "learn-rom-flat.json").write_text(json.dumps(rom_flat, ensure_ascii=False, indent=2) + "\n")
    rom_out = unflatten(rom_flat)
    (HERE / "learn" / "rom.json").write_text(json.dumps(rom_out, ensure_ascii=False, indent=2) + "\n")
    print(f"wrote learn-rom-flat.json and learn/rom.json ({len(rom_flat)} keys)")


def unflatten(flat):
    out = {}
    for path, value in flat.items():
        parts = path.split(".")
        cur = out
        for part in parts[:-1]:
            cur = cur.setdefault(part, {})
        cur[parts[-1]] = value
    return out


if __name__ == "__main__":
    main()
