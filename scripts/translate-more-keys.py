#!/usr/bin/env python3
import json
import time
from pathlib import Path
from deep_translator import GoogleTranslator

ROOT = Path(__file__).resolve().parent.parent
MESSAGES_DIR = ROOT / "messages"

ENGLISH_KEYS = {
    "sections": {
        "track": "Track & Family",
        "trust": "Trust & Safety"
    },
    "items": {
        "providersLabel": "Find Healthcare",
        "providersDesc": "Clinics and services near you",
        "trackLabel": "Daily Wellbeing",
        "trackDesc": "Track mood, water, and activity",
        "familyLabel": "Family Health",
        "familyDesc": "Health records for the whole family",
        "challengesLabel": "Health Challenges",
        "challengesDesc": "Community goals and habits",
        "methodologyLabel": "How it Works",
        "methodologyDesc": "Our clinical governance and safety",
        "policiesLabel": "Platform Policies",
        "policiesDesc": "Clinical safety, data rights, Roma equity",
        "impactLabel": "Public Health Impact",
        "impactDesc": "Evidence and outcomes of the program"
    }
}

ITALIAN_KEYS = {
    "sections": {
        "track": "Monitora e famiglia",
        "trust": "Fiducia e sicurezza"
    },
    "items": {
        "providersLabel": "Trova assistenza sanitaria",
        "providersDesc": "Cliniche e servizi vicino a te",
        "trackLabel": "Benessere quotidiano",
        "trackDesc": "Monitora umore, acqua e attività",
        "familyLabel": "Salute familiare",
        "familyDesc": "Registri sanitari per tutta la famiglia",
        "challengesLabel": "Sfide sanitarie",
        "challengesDesc": "Obiettivi comunitari e abitudini",
        "methodologyLabel": "Come funziona",
        "methodologyDesc": "La nostra governance clinica e sicurezza",
        "policiesLabel": "Politiche della piattaforma",
        "policiesDesc": "Sicurezza clinica, diritti sui dati, equità rom",
        "impactLabel": "Impatto sulla salute pubblica",
        "impactDesc": "Prove e risultati del programma"
    }
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
        
        if "more" not in data:
            data["more"] = {}
        if "sections" not in data["more"]:
            data["more"]["sections"] = {}
        if "items" not in data["more"]:
            data["more"]["items"] = {}
            
        if locale == "en":
            # Just copy English keys
            for k, v in ENGLISH_KEYS["sections"].items():
                data["more"]["sections"][k] = v
            for k, v in ENGLISH_KEYS["items"].items():
                data["more"]["items"][k] = v
        elif locale == "it":
            # Just copy Italian keys
            for k, v in ITALIAN_KEYS["sections"].items():
                data["more"]["sections"][k] = v
            for k, v in ITALIAN_KEYS["items"].items():
                data["more"]["items"][k] = v
        else:
            # Translate from English keys
            actual_lang = LOCALE_TARGETS.get(locale, locale)
            translator = GoogleTranslator(source="en", target=actual_lang)
            
            for k, v in ENGLISH_KEYS["sections"].items():
                # Check if already exists in JSON to avoid re-translation
                if k not in data["more"]["sections"] or data["more"]["sections"][k] == v or data["more"]["sections"][k] == "":
                    try:
                        translated_val = translator.translate(v)
                        data["more"]["sections"][k] = translated_val
                        print(f"    Translated section key: {k}")
                    except Exception as e:
                        print(f"    Warning: failed to translate {v} for {locale}: {e}. Falling back to English.")
                        data["more"]["sections"][k] = v
                    time.sleep(0.4)
                    
            for k, v in ENGLISH_KEYS["items"].items():
                if k not in data["more"]["items"] or data["more"]["items"][k] == v or data["more"]["items"][k] == "":
                    try:
                        translated_val = translator.translate(v)
                        data["more"]["items"][k] = translated_val
                        print(f"    Translated item key: {k}")
                    except Exception as e:
                        print(f"    Warning: failed to translate {v} for {locale}: {e}. Falling back to English.")
                        data["more"]["items"][k] = v
                    time.sleep(0.4)
                    
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
