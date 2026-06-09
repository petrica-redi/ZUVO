#!/usr/bin/env python3
import json
from pathlib import Path
from deep_translator import GoogleTranslator

ROOT = Path(__file__).resolve().parent.parent
EN_PATH = ROOT / "messages" / "en.json"

def main():
    en_data = json.loads(EN_PATH.read_text(encoding="utf-8"))
    glossary = en_data["glossary"]
    
    translator = GoogleTranslator(source="en", target="it")
    
    # 1. Translate basic keys
    it_glossary = {
        "meta": {
            "title": translator.translate(glossary["meta"]["title"]),
            "description": translator.translate(glossary["meta"]["description"])
        },
        "title": translator.translate(glossary["title"]),
        "subtitle": translator.translate(glossary["subtitle"]),
        "searchPlaceholder": translator.translate(glossary["searchPlaceholder"]),
        "searchAria": translator.translate(glossary["searchAria"]),
        "noResults": translator.translate(glossary["noResults"]),
        "allCount": translator.translate(glossary["allCount"]),
        "categories": {
            k: translator.translate(v) for k, v in glossary["categories"].items()
        },
        "entries": {}
    }
    
    # 2. Translate entries
    for entry_id, entry_data in glossary["entries"].items():
        it_glossary["entries"][entry_id] = {
            "term": translator.translate(entry_data["term"]),
            "simple": translator.translate(entry_data["simple"])
        }
        print(f"Translated glossary entry: {entry_id}")
        
    out_js = ROOT / "scripts" / "italian-glossary-translation.js"
    js_content = f"// Italian Glossary Translation\nconst GLOSSARY_IT = {json.dumps(it_glossary, ensure_ascii=False, indent=2)};\n"
    out_js.write_text(js_content, encoding="utf-8")
    print(f"Wrote JS translations to {out_js}")

if __name__ == "__main__":
    main()
