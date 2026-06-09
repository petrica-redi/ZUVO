#!/usr/bin/env python3
import json
import re
import time
from pathlib import Path
from deep_translator import GoogleTranslator

ROOT = Path(__file__).resolve().parent.parent

ENGLISH_GUIDES = [
    "Healthcare System Guides",
    "Italy: Healthcare System (SSN) Guide",
    "Pediatrician vs. General Practitioner (GP)",
    "Children up to 14 years old must be registered with a Pediatrician (Pediatra di Base). Adults (14 and older) register with a General Practitioner (Medico di Medicina Generale). Both services are free through the National Health Service (SSN).",
    "How to register with the SSN",
    [
        "Find the nearest ASL (Azienda Sanitaria Locale) office in your area.",
        "Bring a valid ID document, your Tax Code (Codice Fiscale), and proof of address.",
        "If you do not have a regular residence permit, request an STP Code (Straniero Temporaneamente Presente).",
        "Choose your doctor or pediatrician from the available local list.",
        "You will receive a paper card (Tessera Sanitaria) to access free visits and prescriptions."
    ],
    "Non-Residents: The STP Code",
    "If you do not have a residence permit or are undocumented, you still have a legal right to urgent and essential medical care. The ASL will issue an STP Code (Straniero Temporaneamente Presente). It is anonymous, does not report you to immigration authorities, and guarantees access to vaccinations, pregnancy care, and urgent clinic visits.",
    "View Guide",
    "Close Guide"
]

ITALIAN_GUIDES = [
    "Guide ai Sistemi Sanitari Nazionali",
    "Italia: Guida al Servizio Sanitario (SSN)",
    "Pediatra di Base vs. Medico di Medicina Generale (GP)",
    "I bambini fino a 14 anni devono essere iscritti con un pediatra di base. Gli adulti (dai 14 anni in su) si iscrivono con un medico di medicina generale. Entrambi i servizi sono gratuiti tramite il Servizio Sanitario Nazionale (SSN).",
    "Come iscriversi al SSN",
    [
        "Trova l'ufficio ASL (Azienda Sanitaria Locale) più vicino alla tua zona.",
        "Porta un documento d'identità valido, il tuo Codice Fiscale e una prova di domicilio.",
        "Se non hai un permesso di soggiorno regolare, richiedi il codice STP (Straniero Temporaneamente Presente).",
        "Scegli il tuo medico o pediatra dall'elenco locale dei medici disponibili.",
        "Riceverai una tessera sanitaria cartacea per accedere gratuitamente a visite e ricette."
    ],
    "Non Residenti: Il Codice STP",
    "Se non hai un permesso di soggiorno o sei privo di documenti, hai comunque il diritto legale a cure mediche urgenti ed essenziali. L'ASL ti rilascerà un codice STP (Straniero Temporaneamente Presente). È completamente anonimo, non comporta segnalazioni alle autorità di immigrazione e garantisce l'accesso a vaccinazioni, cure per la gravidanza e visite urgenti.",
    "Visualizza Guida",
    "Chiudi Guida"
]

ENGLISH_EXPLAIN_KEYS = {
    "followUpChat": "Ask AI Advisor",
    "followUpNavigate": "Find a Doctor",
    "followUpGlossary": "Medical Terms"
}

LOCALE_TARGETS = {
    "hu": "hu", "sk": "sk", "cs": "cs", "bg": "bg",
    "sr": "sr", "hr": "hr", "bs": "bs", "mk": "mk",
    "sl": "sl", "el": "el", "tr": "tr",
    "ro": "ro", "sq": "sq", "rom": "ro" # use Romanian translator for Romani as a base fallback if needed
}

def translate_guides(target_lang):
    if target_lang == "it":
        return ITALIAN_GUIDES
    
    actual_lang = LOCALE_TARGETS.get(target_lang, target_lang)
    translator = GoogleTranslator(source="en", target=actual_lang)
    translated = []
    for item in ENGLISH_GUIDES:
        if isinstance(item, list):
            steps = []
            for step in item:
                steps.append(translator.translate(step))
                time.sleep(0.1)
            translated.append(steps)
        else:
            translated.append(translator.translate(item))
            time.sleep(0.1)
    return translated

def translate_explain(target_lang):
    actual_lang = LOCALE_TARGETS.get(target_lang, target_lang)
    translator = GoogleTranslator(source="en", target=actual_lang)
    out = {}
    for k, v in ENGLISH_EXPLAIN_KEYS.items():
        out[k] = translator.translate(v)
        time.sleep(0.1)
    return out

def format_js_val(val):
    if isinstance(val, list):
        items = [json.dumps(x, ensure_ascii=False) for x in val]
        return "[" + ", ".join(items) + "]"
    return json.dumps(val, ensure_ascii=False)

def update_mjs_file(filepath, locale, translated_guides):
    content = filepath.read_text(encoding="utf-8")
    lines = content.splitlines()
    
    # We find the locale block
    # e.g., '  hu: def("hu", {' or '  hu: {'
    # and then the navigate line after it
    locale_pattern = re.compile(r'^\s+' + re.escape(locale) + r':\s+(?:def\("' + re.escape(locale) + r'",\s*\{|\{)')
    
    in_locale = False
    updated_lines = []
    
    for line in lines:
        if locale_pattern.search(line):
            in_locale = True
            updated_lines.append(line)
            continue
        
        if in_locale and "navigate:" in line:
            # Check if it's already updated
            first_guide_translated = translated_guides[0]
            if first_guide_translated in line:
                print(f"  {locale} navigate already updated in {filepath.name}")
                in_locale = False
                updated_lines.append(line)
                continue
            
            # Find the trailing ],
            idx = line.rfind("],")
            if idx != -1:
                # Format new elements to append
                new_elements = ", ".join(format_js_val(x) for x in translated_guides)
                line = line[:idx] + ", " + new_elements + "],"
                print(f"  Updated {locale} navigate array in {filepath.name}")
            in_locale = False
        
        updated_lines.append(line)
        
    filepath.write_text("\n".join(updated_lines) + "\n", encoding="utf-8")

def main():
    # 1. Update generated locales in MJS files
    mjs_files = [
        ROOT / "scripts" / "i18n-data" / "ui-pages-locale-data.mjs",
        ROOT / "scripts" / "i18n-data" / "ui-pages-extra-locales.mjs",
        ROOT / "scripts" / "i18n-data" / "ui-pages-remaining-locales.mjs"
    ]
    
    generated_locales = ["it", "hu", "sk", "cs", "bg", "sr", "hr", "bs", "mk", "sl", "el", "tr"]
    
    for locale in generated_locales:
        print(f"Processing {locale}...")
        translated = translate_guides(locale)
        for f in mjs_files:
            update_mjs_file(f, locale, translated)
            
    # 2. Patch JSON files directly for ro, sq, rom
    direct_locales = ["ro", "sq", "rom"]
    for locale in direct_locales:
        print(f"Processing direct locale {locale}...")
        json_path = ROOT / "messages" / f"{locale}.json"
        if not json_path.exists():
            print(f"  File not found: {json_path}")
            continue
            
        data = json.loads(json_path.read_text(encoding="utf-8"))
        
        # Translate and add to navigate
        translated_guides = translate_guides(locale)
        # Check navigate keys
        if "navigate" not in data:
            data["navigate"] = {}
            
        navigate_keys = [
            "systemGuidesTitle", "italySsnTitle", "italyDoctorTitle", "italyDoctorDesc",
            "italyEnrollTitle", "italyEnrollSteps", "italyStpTitle", "italyStpDesc",
            "viewGuide", "closeGuide"
        ]
        
        for key, val in zip(navigate_keys, translated_guides):
            data["navigate"][key] = val
            
        # For sq and rom, also translate and add explain follow-up keys
        if locale in ["sq", "rom"]:
            exp_translated = translate_explain(locale)
            if "explain" not in data:
                data["explain"] = {}
            for k, v in exp_translated.items():
                data["explain"][k] = v
                
        json_path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        print(f"  Patched direct locale {locale}.json successfully.")

if __name__ == "__main__":
    main()
