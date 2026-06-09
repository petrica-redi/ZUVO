#!/usr/bin/env python3
import json
import time
from pathlib import Path
from deep_translator import GoogleTranslator

ROOT = Path(__file__).resolve().parent.parent
MESSAGES_DIR = ROOT / "messages"

ENGLISH_KEYS = {
    "unverifiedWarningTitle": "This directory is in development",
    "unverifiedWarningBody": "The listings shown are examples only and have not been verified. Do not rely on this information for making medical decisions. Contact your local healthcare provider, NGO, or health mediator to find care near you.",
    "unverifiedBadge": "Not yet verified",
    "unverifiedListingNote": "Listing not yet verified — contact the provider directly to confirm services."
}

ITALIAN_KEYS = {
    "unverifiedWarningTitle": "Questa directory è in fase di sviluppo",
    "unverifiedWarningBody": "Gli elenchi mostrati sono solo esempi e non sono stati verificati. Non fare affidamento su queste informazioni per prendere decisioni sanitarie. Contatta il tuo centro sanitario locale, ONG o mediatore sanitario per trovare assistenza vicino a te.",
    "unverifiedBadge": "Non ancora verificato",
    "unverifiedListingNote": "Elenco non ancora verificato — contatta il provider direttamente per confermare i servizi."
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
        
        if "providers" not in data:
            data["providers"] = {}
            
        if locale == "en":
            for k, v in ENGLISH_KEYS.items():
                data["providers"][k] = v
        elif locale == "it":
            for k, v in ITALIAN_KEYS.items():
                data["providers"][k] = v
        else:
            actual_lang = LOCALE_TARGETS.get(locale, locale)
            translator = GoogleTranslator(source="en", target=actual_lang)
            
            for k, v in ENGLISH_KEYS.items():
                # Only translate if not already present or if it's currently empty/default
                if k not in data["providers"] or data["providers"][k] == v or data["providers"][k] == "":
                    try:
                        translated_val = translator.translate(v)
                        data["providers"][k] = translated_val
                        print(f"    Translated key: {k} -> {translated_val[:30]}...")
                    except Exception as e:
                        print(f"    Warning: failed to translate {v} for {locale}: {e}. Falling back to English.")
                        data["providers"][k] = v
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
