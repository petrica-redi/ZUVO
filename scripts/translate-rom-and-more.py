#!/usr/bin/env python3
import json
import re
import time
import socket
from pathlib import Path
from deep_translator import GoogleTranslator

# Set standard timeout to avoid indefinite hanging
socket.setdefaulttimeout(10.0)

ROOT = Path(__file__).resolve().parent.parent
MESSAGES_DIR = ROOT / "messages"

# Project's native romize logic
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

def romize_obj(obj):
    if isinstance(obj, str):
        return romize(obj)
    elif isinstance(obj, dict):
        return {k: romize_obj(v) for k, v in obj.items()}
    elif isinstance(obj, list):
        return [romize_obj(v) for v in obj]
    else:
        return obj

LOCALE_TARGETS = {
    "hu": "hu", "sk": "sk", "cs": "cs", "bg": "bg",
    "sr": "sr", "hr": "hr", "bs": "bs", "mk": "mk",
    "sl": "sl", "el": "el", "tr": "tr",
    "ro": "ro", "sq": "sq", "rom": "ro"
}

LOCALES = ["en", "it", "sq", "rom", "ro", "hu", "sk", "cs", "bg", "sr", "hr", "bs", "mk", "sl", "el", "tr"]

def main():
    # 1. First, read en.json 'more' namespace
    en_path = MESSAGES_DIR / "en.json"
    en_data = json.loads(en_path.read_text(encoding="utf-8"))
    en_more = en_data.get("more", {})
    
    # We will translate all keys in en_more to other locales
    for locale in LOCALES:
        if locale == "en" or locale == "it":
            # en is base, it is already fully translated manually
            continue
            
        json_path = MESSAGES_DIR / f"{locale}.json"
        if not json_path.exists():
            print(f"File not found: {json_path}")
            continue
            
        print(f"Translating 'more' namespace for {locale}...")
        data = json.loads(json_path.read_text(encoding="utf-8"))
        
        # We will build a translated 'more' object
        actual_lang = LOCALE_TARGETS.get(locale, locale)
        translator = GoogleTranslator(source="en", target=actual_lang)
        
        # Recursive translation helper for 'more' namespace
        def translate_value(val):
            if isinstance(val, str):
                # If it's already translated in the file, reuse it to avoid re-translation
                # But check if it's currently English (which is the case for most)
                return val
            elif isinstance(val, dict):
                return {k: translate_value(v) for k, v in val.items()}
            elif isinstance(val, list):
                return [translate_value(v) for v in val]
            return val

        # We will translate the raw english 'more' structure
        translated_more = {}
        
        # Meta keys
        for key in ["metaTitle", "metaDescription", "title"]:
            en_val = en_more.get(key, "")
            # Check if current file has it and it's not English
            cur_val = data.get("more", {}).get(key, "")
            if cur_val and cur_val != en_val:
                translated_more[key] = cur_val
            else:
                try:
                    translated_val = translator.translate(en_val)
                    translated_more[key] = translated_val
                except Exception as e:
                    print(f"    Failed {key}: {e}")
                    translated_more[key] = en_val
                time.sleep(0.1)
                
        # Sections keys
        translated_more["sections"] = {}
        for key, en_val in en_more.get("sections", {}).items():
            cur_val = data.get("more", {}).get("sections", {}).get(key, "")
            if cur_val and cur_val != en_val:
                translated_more["sections"][key] = cur_val
            else:
                try:
                    translated_val = translator.translate(en_val)
                    translated_more["sections"][key] = translated_val
                except Exception as e:
                    print(f"    Failed sections.{key}: {e}")
                    translated_more["sections"][key] = en_val
                time.sleep(0.1)
                
        # Items keys
        translated_more["items"] = {}
        for key, en_val in en_more.get("items", {}).items():
            cur_val = data.get("more", {}).get("items", {}).get(key, "")
            if cur_val and cur_val != en_val:
                translated_more["items"][key] = cur_val
            else:
                try:
                    translated_val = translator.translate(en_val)
                    translated_more["items"][key] = translated_val
                except Exception as e:
                    print(f"    Failed items.{key}: {e}")
                    translated_more["items"][key] = en_val
                time.sleep(0.1)
                
        # If locale is Romani ('rom'), we apply romize to the translated Romanian 'more' keys
        if locale == "rom":
            translated_more = romize_obj(translated_more)
            
        data["more"] = translated_more
        json_path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        print(f"  Successfully updated 'more' namespace in {locale}.json")
        
    # 2. Post-processing rom.json: copy and romize core Romanian namespaces
    print("Post-processing rom.json using Romani vocabulary rules...")
    ro_path = MESSAGES_DIR / "ro.json"
    rom_path = MESSAGES_DIR / "rom.json"
    
    ro_data = json.loads(ro_path.read_text(encoding="utf-8"))
    rom_data = json.loads(rom_path.read_text(encoding="utf-8"))
    
    romize_namespaces = ["mediator", "providers", "privacy", "footer", "about"]
    for ns in romize_namespaces:
        if ns in ro_data:
            print(f"  Romizing '{ns}' namespace for rom.json...")
            rom_data[ns] = romize_obj(ro_data[ns])
            
    rom_path.write_text(json.dumps(rom_data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print("Romani post-processing complete.")

if __name__ == "__main__":
    main()
