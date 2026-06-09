#!/usr/bin/env python3
import json
import time
from pathlib import Path
from deep_translator import GoogleTranslator

ROOT = Path(__file__).resolve().parent.parent
MESSAGES_DIR = ROOT / "messages"

ENGLISH_KEYS = {
    "localExportLabel": "Download local data",
    "localExportHint": "Save your mood logs, water tracking, and local settings to a JSON file.",
    "guestNote": "If you use the app as a guest, your progress is only saved on this device. Create an account to sync to the server."
}

ROMANIAN_KEYS = {
    "localExportLabel": "Descarcă date locale",
    "localExportHint": "Salvează jurnalele de dispoziție, consumul de apă și setările locale într-un fișier JSON.",
    "guestNote": "Dacă utilizați aplicația ca oaspete, progresul dvs. este salvat doar pe acest dispozitiv. Creați un cont pentru a-l sincroniza cu serverul."
}

LOCALE_TARGETS = {
    "hu": "hu", "sk": "sk", "cs": "cs", "bg": "bg",
    "sr": "sr", "hr": "hr", "bs": "bs", "mk": "mk",
    "sl": "sl", "el": "el", "tr": "tr",
    "ro": "ro", "sq": "sq", "rom": "ro"
}

LOCALES = ["en", "it", "sq", "rom", "ro", "hu", "sk", "cs", "bg", "sr", "hr", "bs", "mk", "sl", "el", "tr"]

def main():
    for locale in LOCALES:
        json_path = MESSAGES_DIR / f"{locale}.json"
        if not json_path.exists():
            print(f"File not found: {json_path}")
            continue
            
        print(f"Processing {locale}...")
        data = json.loads(json_path.read_text(encoding="utf-8"))
        
        if "privacy" not in data:
            data["privacy"] = {}
            
        if locale == "en":
            for k, v in ENGLISH_KEYS.items():
                data["privacy"][k] = v
        elif locale == "ro" or locale == "rom":
            for k, v in ROMANIAN_KEYS.items():
                data["privacy"][k] = v
        else:
            actual_lang = LOCALE_TARGETS.get(locale, locale)
            translator = GoogleTranslator(source="en", target=actual_lang)
            
            for k, v in ENGLISH_KEYS.items():
                try:
                    translated_val = translator.translate(v)
                    data["privacy"][k] = translated_val
                    print(f"    Translated key: {k} -> {translated_val[:35]}...")
                except Exception as e:
                    print(f"    Warning: failed to translate {v} for {locale}: {e}. Falling back to English.")
                    data["privacy"][k] = v
                time.sleep(0.3)
                
        # Write back to file
        json_path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        print(f"  Updated messages/{locale}.json successfully.")

if __name__ == "__main__":
    import sys
    if hasattr(sys.stdout, 'reconfigure'):
        try:
            sys.stdout.reconfigure(encoding='utf-8')
        except Exception:
            pass
    main()
