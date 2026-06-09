#!/usr/bin/env python3
"""Build Romani content-pages/rom.json from Romanian ro.json."""
import json
import re
from pathlib import Path

HERE = Path(__file__).resolve().parent
RO_PATH = HERE / "ro.json"
OUT_PATH = HERE / "rom.json"


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
        (r"\bvaccin", "vakcin"),
        (r"\bgratuit", "makhlo"),
        (r"\burgent", "phari"),
        (r"\bfrică", "dar"),
        (r"\bdrepturi", "hakaja"),
        (r"\btratament", "tretmano"),
        (r"\bmedicament", "lek"),
        (r"\bmedicamente", "lekura"),
        (r"\bîntrebare", "puximata"),
        (r"\brăspuns", "paso"),
        (r"\bDa\b", "Va"),
        (r"\bNu\b", "Na"),
    ]
    out = text
    for pat, sub in repl:
        out = re.sub(pat, sub, out, flags=re.IGNORECASE)
    return out


def walk(obj):
    if isinstance(obj, dict):
        return {k: walk(v) for k, v in obj.items()}
    if isinstance(obj, list):
        return [walk(v) for v in obj]
    if isinstance(obj, str):
        return romize(obj)
    return obj


def main():
    ro = json.loads(RO_PATH.read_text(encoding="utf-8"))
    # UI overrides in Romani
    ro["healthQuiz"]["title"] = "Sastipenaki quiz"
    ro["healthQuiz"]["subtitle"] = "Dikh sar zhanes. Sikhave kova nevo."
    ro["rights"]["title"] = "Dikh tiri hakaja"
    ro["stories"]["title"] = "Paramiča andar komuniteto"
    rom = walk(ro)
    OUT_PATH.write_text(json.dumps(rom, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"wrote {OUT_PATH}")


if __name__ == "__main__":
    main()
