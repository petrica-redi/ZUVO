#!/usr/bin/env python3
"""Build Romani student-health/rom.json from Romanian ro.json."""
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
        (r"\belev", "štil"),
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
        (r"\bacademie", "akademija"),
        (r"\bmisiune", "misija"),
        (r"\blecție", "lekcija"),
        (r"\blecții", "lekcije"),
        (r"\bajutor", "pomoć"),
        (r"\burgentă", "phari"),
        (r"\bsânge", "rat"),
        (r"\binfecție", "infekcija"),
        (r"\btest", "testo"),
        (r"\bconfidențial", "privatno"),
    ]
    out = text
    for pat, sub in repl:
        out = re.sub(pat, sub, out, flags=re.IGNORECASE)
    return out


def walk(value):
    if isinstance(value, dict):
        return {k: walk(v) for k, v in value.items()}
    if isinstance(value, list):
        return [walk(v) for v in value]
    if isinstance(value, str):
        return romize(value)
    return value


def main():
    ro = json.loads(RO_PATH.read_text(encoding="utf-8"))
    rom = walk(ro)
    OUT_PATH.write_text(json.dumps(rom, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"wrote {OUT_PATH.name}")


if __name__ == "__main__":
    main()
