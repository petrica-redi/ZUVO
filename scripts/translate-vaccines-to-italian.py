#!/usr/bin/env python3
import json
import re
import time
from pathlib import Path
from deep_translator import GoogleTranslator

ROOT = Path(__file__).resolve().parent.parent
EN_PATH = ROOT / "messages" / "en.json"

def main():
    en_data = json.loads(EN_PATH.read_text(encoding="utf-8"))
    vaccines = en_data["vaccines"]
    
    translator = GoogleTranslator(source="en", target="it")
    
    # 1. Translate UI keys
    ui_translations = {}
    for key, val in list(vaccines.items()):
        if key in ["items", "ageGroups"]:
            continue
        if isinstance(val, list):
            ui_translations[key] = [translator.translate(item) for item in val]
        elif isinstance(val, dict):
            ui_translations[key] = {k: translator.translate(v) for k, v in val.items()}
        else:
            ui_translations[key] = translator.translate(val)
            
    print("UI TRANSLATIONS GENERATED")
    
    # 2. Translate Age Group Labels
    age_group_labels = {}
    for key, val in vaccines["ageGroups"].items():
        age_group_labels[key] = translator.translate(val["label"])
        
    print("AGE GROUP LABELS GENERATED")
    
    # 3. Translate Items
    items_translations = {}
    for item_id, item_data in vaccines["items"].items():
        prevents = [translator.translate(p) for p in item_data["preventsDiseases"]]
        items_translations[item_id] = {
            "name": translator.translate(item_data["name"]),
            "prevents": prevents,
            "howItWorks": translator.translate(item_data["howItWorks"]),
            "sideEffects": translator.translate(item_data["sideEffects"]),
            "mythDebunked": translator.translate(item_data["mythDebunked"])
        }
        print(f"Translated item: {item_id}")
        
    # Write to a javascript file for easy inclusion
    out_js = ROOT / "scripts" / "italian-vaccine-translations.js"
    
    js_content = f"""// Italian Vaccine Translations
export const UI_IT = {json.dumps(ui_translations, ensure_ascii=False, indent=2)};

export const AGE_IT = {json.dumps(age_group_labels, ensure_ascii=False, indent=2)};

export const ITEMS_IT = {{
"""
    for item_id, data in items_translations.items():
        js_content += f"""  {item_id}: item(
    {json.dumps(data["name"], ensure_ascii=False)},
    {json.dumps(data["prevents"], ensure_ascii=False)},
    {json.dumps(data["howItWorks"], ensure_ascii=False)},
    {json.dumps(data["sideEffects"], ensure_ascii=False)},
    {json.dumps(data["mythDebunked"], ensure_ascii=False)}
  ),
"""
    js_content += "};\n"
    
    out_js.write_text(js_content, encoding="utf-8")
    print(f"Wrote JS translations to {out_js}")

if __name__ == "__main__":
    main()
