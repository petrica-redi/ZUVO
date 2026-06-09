#!/usr/bin/env python3
import json
import re
import time
from pathlib import Path
from deep_translator import GoogleTranslator

ROOT = Path(__file__).resolve().parent.parent

ENGLISH_EXPLAIN_KEYS = [
    "Ask AI Advisor",
    "Find a Doctor",
    "Medical Terms"
]

ITALIAN_EXPLAIN_KEYS = [
    "Chiedi all'assistente AI",
    "Trova un medico",
    "Termini medici"
]

LOCALE_TARGETS = {
    "hu": "hu", "sk": "sk", "cs": "cs", "bg": "bg",
    "sr": "sr", "hr": "hr", "bs": "bs", "mk": "mk",
    "sl": "sl", "el": "el", "tr": "tr"
}

def translate_explain(target_lang):
    if target_lang == "it":
        return ITALIAN_EXPLAIN_KEYS
    actual_lang = LOCALE_TARGETS.get(target_lang, target_lang)
    translator = GoogleTranslator(source="en", target=actual_lang)
    translated = []
    for item in ENGLISH_EXPLAIN_KEYS:
        translated.append(translator.translate(item))
        time.sleep(0.1)
    return translated

def update_mjs_explain(filepath, locale, translated_keys):
    content = filepath.read_text(encoding="utf-8")
    lines = content.splitlines()
    
    locale_pattern = re.compile(r'^\s+' + re.escape(locale) + r':\s+(?:def\("' + re.escape(locale) + r'",\s*\{|\{)')
    
    in_locale = False
    updated_lines = []
    
    for line in lines:
        if locale_pattern.search(line):
            in_locale = True
            updated_lines.append(line)
            continue
        
        if in_locale and "explain:" in line:
            # Check if it's already updated (e.g. check if the first key is already in the line)
            first_key = translated_keys[0]
            if first_key in line:
                print(f"  {locale} explain already updated in {filepath.name}")
                in_locale = False
                updated_lines.append(line)
                continue
            
            # Find the trailing ],
            idx = line.rfind("],")
            if idx != -1:
                new_elements = ", ".join(json.dumps(x, ensure_ascii=False) for x in translated_keys)
                line = line[:idx] + ", " + new_elements + "],"
                print(f"  Updated {locale} explain array in {filepath.name}")
            in_locale = False
            
        updated_lines.append(line)
        
    filepath.write_text("\n".join(updated_lines) + "\n", encoding="utf-8")

def main():
    mjs_files = [
        ROOT / "scripts" / "i18n-data" / "ui-pages-locale-data.mjs",
        ROOT / "scripts" / "i18n-data" / "ui-pages-extra-locales.mjs",
        ROOT / "scripts" / "i18n-data" / "ui-pages-remaining-locales.mjs"
    ]
    
    generated_locales = ["it", "hu", "sk", "cs", "bg", "sr", "hr", "bs", "mk", "sl", "el", "tr"]
    
    for locale in generated_locales:
        print(f"Processing {locale}...")
        translated = translate_explain(locale)
        for f in mjs_files:
            update_mjs_explain(f, locale, translated)

if __name__ == "__main__":
    main()
