#!/usr/bin/env python3
import json
import time
from pathlib import Path
from deep_translator import GoogleTranslator

ROOT = Path(__file__).resolve().parent.parent
MESSAGES_DIR = ROOT / "messages"

def translate_dict(translator, en_dict, it_dict):
    updated = False
    for k, v in en_dict.items():
        if isinstance(v, dict):
            if k not in it_dict:
                it_dict[k] = {}
                updated = True
            if translate_dict(translator, v, it_dict[k]):
                updated = True
        else:
            if k not in it_dict or it_dict[k] == "" or it_dict[k] == v:
                try:
                    translated_val = translator.translate(v)
                    it_dict[k] = translated_val
                    print(f"  Translated: {k} -> {translated_val[:40]}...")
                    updated = True
                    time.sleep(0.3)
                except Exception as e:
                    print(f"  Failed to translate key {k}: {e}")
                    it_dict[k] = v
    return updated

def main():
    en_path = MESSAGES_DIR / "en.json"
    it_path = MESSAGES_DIR / "it.json"
    
    if not en_path.exists() or not it_path.exists():
        print("Missing en.json or it.json")
        return
        
    en_data = json.loads(en_path.read_text(encoding="utf-8"))
    it_data = json.loads(it_path.read_text(encoding="utf-8"))
    
    if "privacy" not in en_data:
        print("No privacy namespace in en.json")
        return
        
    if "privacy" not in it_data:
        it_data["privacy"] = {}
        
    translator = GoogleTranslator(source="en", target="it")
    print("Translating missing privacy keys for Italian...")
    if translate_dict(translator, en_data["privacy"], it_data["privacy"]):
        it_path.write_text(json.dumps(it_data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        print("Updated messages/it.json successfully.")
    else:
        print("No missing privacy keys for Italian.")

if __name__ == "__main__":
    main()
