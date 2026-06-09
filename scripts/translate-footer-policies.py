#!/usr/bin/env python3
import json
import time
from pathlib import Path
from deep_translator import GoogleTranslator

ROOT = Path(__file__).resolve().parent.parent
MESSAGES_DIR = ROOT / "messages"

ENGLISH_KEYS = {
    "footer": {
        "policies": "Platform Policies"
    },
    "about": {
        "policiesLink": "Platform Policies"
    }
}

ITALIAN_KEYS = {
    "footer": {
        "policies": "Politiche"
    },
    "about": {
        "policiesLink": "Politiche della piattaforma"
    }
}

ROMANIAN_KEYS = {
    "footer": {
        "policies": "Politici"
    },
    "about": {
        "policiesLink": "Politici platformă"
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
        
        # Ensure namespaces exist
        if "footer" not in data:
            data["footer"] = {}
        if "about" not in data:
            data["about"] = {}
            
        if locale == "en":
            data["footer"]["policies"] = ENGLISH_KEYS["footer"]["policies"]
            data["about"]["policiesLink"] = ENGLISH_KEYS["about"]["policiesLink"]
        elif locale == "it":
            # Preserve existing it.json footer.policies if present
            if "policies" not in data["footer"] or not data["footer"]["policies"]:
                data["footer"]["policies"] = ITALIAN_KEYS["footer"]["policies"]
            data["about"]["policiesLink"] = ITALIAN_KEYS["about"]["policiesLink"]
        elif locale == "ro" or locale == "rom":
            if "policies" not in data["footer"] or not data["footer"]["policies"]:
                data["footer"]["policies"] = ROMANIAN_KEYS["footer"]["policies"]
            if "policiesLink" not in data["about"] or not data["about"]["policiesLink"]:
                data["about"]["policiesLink"] = ROMANIAN_KEYS["about"]["policiesLink"]
        else:
            actual_lang = LOCALE_TARGETS.get(locale, locale)
            translator = GoogleTranslator(source="en", target=actual_lang)
            
            # Translate footer.policies
            if "policies" not in data["footer"] or not data["footer"]["policies"]:
                try:
                    val = translator.translate(ENGLISH_KEYS["footer"]["policies"])
                    data["footer"]["policies"] = val
                    print(f"    Translated footer.policies -> {val}")
                except Exception as e:
                    print(f"    Failed footer.policies for {locale}: {e}")
                    data["footer"]["policies"] = ENGLISH_KEYS["footer"]["policies"]
                time.sleep(0.3)
                
            # Translate about.policiesLink
            if "policiesLink" not in data["about"] or not data["about"]["policiesLink"]:
                try:
                    val = translator.translate(ENGLISH_KEYS["about"]["policiesLink"])
                    data["about"]["policiesLink"] = val
                    print(f"    Translated about.policiesLink -> {val}")
                except Exception as e:
                    print(f"    Failed about.policiesLink for {locale}: {e}")
                    data["about"]["policiesLink"] = ENGLISH_KEYS["about"]["policiesLink"]
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
