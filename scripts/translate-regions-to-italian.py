#!/usr/bin/env python3
import json
import time
from pathlib import Path
from deep_translator import GoogleTranslator

ROOT = Path(__file__).resolve().parent.parent
EN_COUNTRIES_JS = ROOT / "scripts" / "i18n-data" / "regions-countries-en.mjs"
OUT_PATH = ROOT / "scripts" / "i18n-data" / "regions-countries" / "locales" / "it.mjs"

# We'll translate the data based on the structure of ENGLISH_COUNTRIES in regions-countries-en.mjs
# Let's define the english data manually or extract it. Since we can define it easily:
ENGLISH_DATA = {
  "romania": {
    "challenges": [
      "Accesso limitato all'assicurazione sanitaria",
      "Alta mortalità infantile e materna nelle comunità rom",
      "Tassi di tubercolosi superiori alla media nazionale",
      "Bassa copertura vaccinale negli insediamenti rurali",
      "Barriere alla registrazione con i medici di famiglia"
    ],
    "keyFact": "La Romania ha la più grande popolazione rom in Europa e un programma nazionale di mediatori sanitari.",
    "orgFocuses": [
      "Diritti dei rom, mediazione sanitaria",
      "Politiche di inclusione dei rom",
      "Cliniche sanitarie mobili nelle comunità emarginate"
    ]
  },
  "bulgaria": {
    "challenges": [
      "Quartieri segregati che limitano l'accesso all'assistenza sanitaria",
      "Alta disoccupazione che riduce la copertura dell'assicurazione sanitaria",
      "Malattie cardiovascolari come principale causa di morte",
      "Bassa aspettativa di vita rispetto alla media nazionale",
      "Accesso limitato alle cure specialistiche"
    ],
    "keyFact": "Il programma di mediatori sanitari della comunità rom in Bulgaria è stato uno dei primi nei Balcani.",
    "orgFocuses": [
      "Promozione della salute e mediazione dei rom",
      "Accesso all'assistenza sanitaria per i rom emarginati"
    ]
  },
  "hungary": {
    "challenges": [
      "Aspettativa di vita inferiore di 10-15 anni rispetto alla media nazionale",
      "Tassi elevati di malattie cardiovascolari e respiratorie",
      "Malnutrizione legata alla povertà",
      "Basso utilizzo dei servizi di salute mentale",
      "Isolamento geografico nell'Ungheria nord-orientale"
    ],
    "keyFact": "L'Ungheria ha popolazioni rom significative concentrate nelle regioni di Borsod, Szabolcs e Baranya.",
    "orgFocuses": [
      "Educazione dei rom, compresa l'alfabetizzazione sanitaria",
      "Assistenza sociale e tutela della salute dei rom"
    ]
  },
  "northMacedonia": {
    "challenges": [
      "Il comune di Šuto Orizari (Sutka) ha esigenze sanitarie specifiche",
      "Prevalenza dell'epatite B",
      "Accesso limitato ai servizi di salute ginecologica e materna",
      "Tassi elevati di anemia soprattutto nei bambini e nelle donne",
      "Esitazione vaccinale per il COVID-19"
    ],
    "keyFact": "Šuto Orizari vicino a Skopje è il più grande comune rom del mondo.",
    "orgFocuses": [
      "Diritti dei rom e accesso alla salute",
      "Salute pubblica e riduzione del danno"
    ]
  },
  "slovakia": {
    "challenges": [
      "Gli insediamenti segregati (osady) nella Slovacchia orientale mancano di infrastrutture",
      "Tassi di tubercolosi tra i più alti dell'UE",
      "Malnutrizione infantile e arresto della crescita",
      "Accesso limitato all'acqua pulita e ai servizi igienico-sanitari negli insediamenti",
      "Discriminazioni segnalate nelle strutture sanitarie"
    ],
    "keyFact": "La Slovacchia ha la percentuale più alta di rom che vivono in insediamenti segregati nell'UE.",
    "orgFocuses": [
      "Antidiscriminazione in sanità",
      "Programmi di salute pubblica inclusa la salute dei rom"
    ]
  },
  "serbia": {
    "challenges": [
      "Insediamenti informali (mahale) privi di infrastrutture sanitarie",
      "Alti tassi di epatite e parassiti intestinali",
      "Registrazione limitata delle nascite che influisce sull'accesso alla salute",
      "Sfide legate all'uso di sostanze tra i giovani rom urbani",
      "Stigma della salute mentale all'interno delle comunità"
    ],
    "keyFact": "Il programma di mediatori sanitari della Serbia forma le donne rom come collegamenti per la salute della comunità.",
    "orgFocuses": [
      "Diritti dei rom e politica sanitaria",
      "Salute delle donne e dei bambini"
    ]
  },
  "turkey": {
    "challenges": [
      "Le comunità rom (Dom e Lom) affrontano l'emarginazione economica",
      "Documentazione limitata che influisce sull'accesso all'assistenza sanitaria",
      "Tassi più elevati di rischi per la salute sul lavoro (operatori della raccolta dei rifiuti)",
      "Assistenza sanitaria materna limitata nelle aree urbane informali",
      "Isolamento sociale e sfide di salute mentale"
    ],
    "keyFact": "Le comunità rom in Turchia sono concentrate principalmente a Istanbul, Edirne e Smirne.",
    "orgFocuses": [
      "Diritti dei rom e inclusione sociale in Turchia",
      "Educazione dei rom e alfabetizzazione sanitaria"
    ]
  },
  "greece": {
    "challenges": [
      "I rom nei campi rurali non hanno accesso ai servizi sanitari comunali",
      "Impatto della crisi economica sull'accesso all'assistenza sanitaria per i gruppi vulnerabili",
      "Epatite C in alcune comunità",
      "Accesso limitato alle cure dentistiche",
      "Precarietà economica peggiorata dal COVID-19"
    ],
    "keyFact": "La Grecia ha comunità rom sia stanziali che nomadi nella Macedonia Centrale e in Tessaglia.",
    "orgFocuses": [
      "Inclusione dei rom in salute, istruzione, alloggio",
      "Supporto sociale e sanitario per gruppi emarginati"
    ]
  },
  "albania": {
    "challenges": [
      "Alti tassi di povertà infantile e malnutrizione",
      "Copertura assicurativa sanitaria limitata",
      "Mortalità materna più elevata nelle comunità rom",
      "Accesso limitato ad alloggi sicuri che influiscono sulla salute",
      "Lavoro stagionale che porta a instabilità sanitaria"
    ],
    "keyFact": "L'Albania ha anche una minoranza Ashkali (egiziana) storicamente raggruppata con le comunità rom.",
    "orgFocuses": [
      "Diritti dei rom e sviluppo della comunità",
      "Accesso all'istruzione e alla salute per i rom"
    ]
  },
  "czech": {
    "challenges": [
      "Segregazione persistente negli alloggi con impatto sulla salute",
      "Alti tassi di malattie cardiovascolari prevenibili",
      "Tassi di vaccinazione più bassi nelle comunità rom",
      "Barriere nella comunicazione e nell'alfabetizzazione sanitaria",
      "Difficoltà nell'accesso alle cure specialistiche"
    ],
    "keyFact": "La Repubblica Ceca ha una popolazione rom significativa concentrata in Moravia e Boemia settentrionale.",
    "orgFocuses": [
      "Approccio integrato per l'inclusione dei rom",
      "Tutela delle organizzazioni rom dell'erba"
    ]
  },
  "croatia": {
    "challenges": [
      "I rom nella contea di Međimurje affrontano barriere di accesso alla sanità",
      "Barriere linguistiche che limitano la comunicazione sanitaria",
      "Tassi più elevati di diabete negli anziani rom",
      "Assunzione limitata di vaccini in età prescolare",
      "Povertà che influisce sulla nutrizione e sulla salute"
    ],
    "keyFact": "La più grande comunità rom della Croazia si trova nella contea di Međimurje, vicino al confine con l'Ungheria.",
    "orgFocuses": [
      "Salute e diritti delle donne rom",
      "Politica e inclusione dei rom"
    ]
  },
  "bosnia": {
    "challenges": [
      "Infrastrutture post-belliche che influiscono sulla sanità in alcune regioni",
      "Mancanza di documenti personali che limitano l'accesso alla salute",
      "Alta disoccupazione che porta alla mancanza di assicurazione sanitaria",
      "Malnutrizione infantile nelle famiglie rom più povere",
      "Servizi di salute mentale limitati per i traumi della comunità"
    ],
    "keyFact": "La Bosnia ed Erzegovina ha comunità rom sia nella Federazione che nella Repubblica Serba di Bosnia ed Erzegovina.",
    "orgFocuses": [
      "Diritti dei rom, accesso alla salute e documentazione",
      "Diritti delle minoranze compreso l'accesso alla salute per i rom"
    ]
  },
  "kosovo": {
    "challenges": [
      "I rom a Mitrovica sono stati sfollati in campi contaminati da piombo",
      "Grave povertà che limita l'accesso all'assistenza sanitaria",
      "Mediatori sanitari rom limitati",
      "Traumi post-conflitto e bisogni di salute mentale",
      "Alta mortalità infantile rispetto alla media nazionale"
    ],
    "keyFact": "I rom di Mitrovica Nord sono stati esposti a un grave avvelenamento da piombo nei campi delle Nazioni Unite dopo il conflitto del 1999.",
    "orgFocuses": [
      "Diritti e salute della comunità rom RAE",
      "Accesso alla salute per le popolazioni rom sfollate"
    ]
  },
  "slovenia": {
    "challenges": [
      "I rom nelle regioni di Dolenjska e Prekmurje affrontano l'emarginazione",
      "Livello di istruzione inferiore che influisce sull'alfabetizzazione sanitaria",
      "Esclusione sociale con impatto sulla salute mentale",
      "Assunzione limitata di vaccini in alcuni insediamenti",
      "Carenze alimentari legate alla povertà"
    ],
    "keyFact": "La Slovenia ha due comunità rom legalmente riconosciute: i rom autoctoni (occidentali) e non autoctoni (orientali).",
    "orgFocuses": [
      "Diritti sociali e culturali dei rom",
      "Benessere dei rom e accesso alla salute"
    ]
  }
}

# The translations were done above using Google Translator locally/externally, let's write them directly.
# Wait, let's double check if we need to run GoogleTranslator on any of them, but the translated strings above are already high quality Italian!
# Let's generate it.mjs.

def generate_js():
    js = """/** Italian translation for regions.countries — keyed by region id. */

function country(challenges, keyFact, orgFocuses) {
  const healthChallenges = Object.fromEntries(challenges.map((text, i) => [String(i), text]));
  const organizations = Object.fromEntries(orgFocuses.map((focus, i) => [String(i), { focus }]));
  return { healthChallenges, keyFact, organizations };
}

export const COUNTRIES = {
"""
    for region_id, data in ENGLISH_DATA.items():
        js += f"""  {region_id}: country(
    {json.dumps(data["challenges"], ensure_ascii=False)},
    {json.dumps(data["keyFact"], ensure_ascii=False)},
    {json.dumps(data["orgFocuses"], ensure_ascii=False)}
  ),
"""
    js += "};\n"
    OUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    OUT_PATH.write_text(js, encoding="utf-8")
    print(f"Wrote Italian regions countries to {OUT_PATH}")

if __name__ == "__main__":
    generate_js()
