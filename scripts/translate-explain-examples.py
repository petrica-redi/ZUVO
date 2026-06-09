#!/usr/bin/env python3
import json
import time
import socket
import sys
from pathlib import Path
from deep_translator import GoogleTranslator

# Reconfigure stdout/stderr to use UTF-8 on Windows
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')
if hasattr(sys.stderr, 'reconfigure'):
    sys.stderr.reconfigure(encoding='utf-8')

# Set standard timeout
socket.setdefaulttimeout(10.0)

ROOT = Path(__file__).resolve().parent.parent
MESSAGES_DIR = ROOT / "messages"

# Romani romize helper
def romize(text: str) -> str:
    if not isinstance(text, str):
        return text
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
        (r"\bziua\b", "dives"),
        (r"\bazi\b", "ando dives"),
        (r"\bnoapte\b", "rat"),
    ]
    out = text
    for pattern, replacement in repl:
        out = re.sub(pattern, replacement, out, flags=re.IGNORECASE)
    return out

ENGLISH_EXAMPLES = {
    "example1": "Hypertension",
    "example2": "Type 2 diabetes",
    "example3": "Anemia",
    "example4": "Bronchial asthma",
    "example5": "Metformin 500mg",
    "example6": "Enalapril 10mg"
}

ITALIAN_EXAMPLES = {
    "example1": "Ipertensione",
    "example2": "Diabete di tipo 2",
    "example3": "Anemia",
    "example4": "Asma bronchiale",
    "example5": "Metformina 500mg",
    "example6": "Enalapril 10mg"
}

ROMANIAN_EXAMPLES = {
    "example1": "Hipertensiune arterială",
    "example2": "Diabet tip 2",
    "example3": "Anemie",
    "example4": "Astm bronșic",
    "example5": "Metformin 500mg",
    "example6": "Enalapril 10mg"
}

LOCALE_TARGETS = {
    "hu": "hu", "sk": "sk", "cs": "cs", "bg": "bg",
    "sr": "sr", "hr": "hr", "bs": "bs", "mk": "mk",
    "sl": "sl", "el": "el", "tr": "tr",
    "ro": "ro", "sq": "sq", "rom": "ro"
}

LOCALES = ["en", "it", "sq", "rom", "ro", "hu", "sk", "cs", "bg", "sr", "hr", "bs", "mk", "sl", "el", "tr"]

import re

def main():
    for locale in LOCALES:
        json_path = MESSAGES_DIR / f"{locale}.json"
        if not json_path.exists():
            print(f"File not found: {json_path}")
            continue
            
        print(f"Processing {locale}...")
        data = json.loads(json_path.read_text(encoding="utf-8"))
        
        if "explain" not in data:
            data["explain"] = {}
            
        if locale == "en":
            for k, v in ENGLISH_EXAMPLES.items():
                data["explain"][k] = v
        elif locale == "it":
            for k, v in ITALIAN_EXAMPLES.items():
                data["explain"][k] = v
        elif locale == "ro":
            for k, v in ROMANIAN_EXAMPLES.items():
                data["explain"][k] = v
        elif locale == "rom":
            for k, v in ROMANIAN_EXAMPLES.items():
                data["explain"][k] = romize(v)
        else:
            actual_lang = LOCALE_TARGETS.get(locale, locale)
            translator = GoogleTranslator(source="en", target=actual_lang)
            for k, v in ENGLISH_EXAMPLES.items():
                try:
                    translated_val = translator.translate(v)
                    data["explain"][k] = translated_val
                    print(f"    Translated {k} -> {translated_val}")
                except Exception as e:
                    print(f"    Failed to translate {k} for {locale}: {e}")
                    data["explain"][k] = v
                time.sleep(0.3)
                
        json_path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        print(f"  Updated messages/{locale}.json successfully.")

if __name__ == "__main__":
    main()
