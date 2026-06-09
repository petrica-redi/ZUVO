/**
 * Patches the full vaccines namespace into all locale message files.
 * Run: node scripts/patch-vaccines-all-locales.mjs
 */
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT_DIR = join(dirname(fileURLToPath(import.meta.url)), "..");
const MESSAGES_DIR = join(ROOT_DIR, "messages");

const LOCALES = ["en", "it", "sq", "rom", "ro", "hu", "sk", "cs", "bg", "sr", "hr", "bs", "mk", "sl", "el", "tr"];
const EXISTING_UI_LOCALES = new Set(["sq", "rom", "ro"]);
const ITEM_IDS = ["bcg", "hepb", "dtap", "ipv", "mmr", "pneumo", "rota", "varicella", "hpv", "flu"];
const AGE_GROUP_IDS = ["birth", "2months", "4months", "6months", "12months", "18months", "4years", "9years", "adult", "pregnant"];
const UI_KEYS = [
  "heroTitle",
  "heroSubtitle",
  "askCta",
  "backToSchedule",
  "preventsLabel",
  "dosesNeeded",
  "howItWorks",
  "sideEffects",
  "mythTitle",
  "qaTitle",
  "qaSubtitle",
  "qaPlaceholder",
  "qaAria",
  "qaCommon",
  "childAgePrompt",
  "childAgeAria",
  "ageOptionDefault",
  "ageNewborn",
  "age2m",
  "age4m",
  "age6m",
  "age12m",
  "age18m",
  "age48m",
  "age108m",
  "neededByAge",
  "vaccinesCount",
  "importance",
  "fears",
  "meta",
];

function item(name, preventsDiseases, howItWorks, sideEffects, mythDebunked) {
  return { name, preventsDiseases, howItWorks, sideEffects, mythDebunked };
}

function deepClone(value) {
  return JSON.parse(JSON.stringify(value));
}

function makeAgeGroups(labels) {
  return {
    birth: { label: labels.birth },
    "2months": { label: labels["2months"] },
    "4months": { label: labels["4months"] },
    "6months": { label: labels["6months"] },
    "12months": { label: labels["12months"] },
    "18months": { label: labels["18months"] },
    "4years": { label: labels["4years"] },
    "9years": { label: labels["9years"] },
    adult: { label: labels.adult },
    pregnant: { label: labels.pregnant },
  };
}

const UI_TRANSLATIONS = {
  hu: {
    heroTitle: "Oltási útmutató",
    heroSubtitle: "Minden oltás egyszerűen elmagyarázva. Koppints bármelyik oltásra, hogy többet tudj meg.",
    askCta: "Kérdezz az oltásokról",
    backToSchedule: "Vissza az oltási naptárhoz",
    preventsLabel: "Megelőzi",
    dosesNeeded: "{count, plural, one {# adag szükséges} other {# adag szükséges}}",
    howItWorks: "Hogyan működik",
    sideEffects: "Mellékhatások (normálisak)",
    mythTitle: "Tévhit vs. igazság",
    qaTitle: "Kérdezz az oltásokról",
    qaSubtitle: "Bármilyen kérdés. Őszinte válaszok tereptapasztalatból.",
    qaPlaceholder: "Írd be az oltással kapcsolatos kérdésed...",
    qaAria: "Tegyél fel kérdést az oltásokról",
    qaCommon: "Gyakori kérdések",
    childAgePrompt: "Hány éves a gyermeked?",
    childAgeAria: "Gyermek életkorának kiválasztása",
    ageOptionDefault: "Válassz életkort...",
    ageNewborn: "Újszülött (0 hónap)",
    age2m: "2 hónap",
    age4m: "4 hónap",
    age6m: "6 hónap",
    age12m: "12 hónap (1 év)",
    age18m: "18 hónap",
    age48m: "4-6 év",
    age108m: "9-12 év",
    neededByAge: "Ebben a korban szükséges oltások:",
    vaccinesCount: "{count, plural, one {# oltás} other {# oltás}}",
    importance: {
      critical: "Létfontosságú",
      important: "Fontos",
      recommended: "Ajánlott",
    },
    fears: [
      "Biztonságosak az oltások a babámnak?",
      "Fájni fog a gyermekemnek?",
      "Mi van, ha utána lázas lesz?",
      "Elhalaszthatom az oltásokat?",
      "A gyermekem beteg - így is kaphat oltást?",
    ],
    meta: {
      title: "Oltási útmutató - Redi Health",
      description: "Minden oltás egyszerű szavakkal elmagyarázva.",
    },
  },
  sk: {
    heroTitle: "Sprievodca očkovaním",
    heroSubtitle: "Každá vakcína vysvetlená jednoducho. Ťuknite na ktorúkoľvek vakcínu a zistite viac.",
    askCta: "Opýtajte sa na vakcíny",
    backToSchedule: "Späť k očkovaciemu kalendáru",
    preventsLabel: "Chráni pred",
    dosesNeeded: "{count, plural, one {# potrebná dávka} other {# potrebné dávky}}",
    howItWorks: "Ako to funguje",
    sideEffects: "Vedľajšie účinky (bežné)",
    mythTitle: "Mýtus vs. pravda",
    qaTitle: "Opýtajte sa na vakcíny",
    qaSubtitle: "Akákoľvek otázka. Úprimné odpovede z praxe v teréne.",
    qaPlaceholder: "Napíšte svoju otázku o vakcínach...",
    qaAria: "Položiť otázku o vakcínach",
    qaCommon: "Časté otázky",
    childAgePrompt: "Koľko rokov má vaše dieťa?",
    childAgeAria: "Vyberte vek dieťaťa",
    ageOptionDefault: "Vyberte vek...",
    ageNewborn: "Novorodenec (0 mesiacov)",
    age2m: "2 mesiace",
    age4m: "4 mesiace",
    age6m: "6 mesiacov",
    age12m: "12 mesiacov (1 rok)",
    age18m: "18 mesiacov",
    age48m: "4-6 rokov",
    age108m: "9-12 rokov",
    neededByAge: "Vakcíny potrebné v tomto veku:",
    vaccinesCount: "{count, plural, one {# vakcína} other {# vakcíny}}",
    importance: {
      critical: "Nevyhnutná",
      important: "Dôležitá",
      recommended: "Odporúčaná",
    },
    fears: [
      "Sú vakcíny bezpečné pre moje bábätko?",
      "Bude to moje dieťa bolieť?",
      "Čo ak dostane potom horúčku?",
      "Môžem očkovanie odložiť?",
      "Moje dieťa je choré - môže aj tak dostať vakcínu?",
    ],
    meta: {
      title: "Sprievodca očkovaním - Redi Health",
      description: "Každá vakcína vysvetlená jednoduchými slovami.",
    },
  },
  cs: {
    heroTitle: "Průvodce očkováním",
    heroSubtitle: "Každá vakcína vysvětlená jednoduše. Klepněte na kteroukoliv vakcínu a zjistěte víc.",
    askCta: "Zeptejte se na vakcíny",
    backToSchedule: "Zpět k očkovacímu kalendáři",
    preventsLabel: "Chrání před",
    dosesNeeded: "{count, plural, one {# potřebná dávka} other {# potřebné dávky}}",
    howItWorks: "Jak to funguje",
    sideEffects: "Vedlejší účinky (běžné)",
    mythTitle: "Mýtus vs. pravda",
    qaTitle: "Zeptejte se na vakcíny",
    qaSubtitle: "Jakýkoliv dotaz. Upřímné odpovědi z terénní praxe.",
    qaPlaceholder: "Napište svou otázku o vakcínách...",
    qaAria: "Položit otázku o vakcínách",
    qaCommon: "Časté otázky",
    childAgePrompt: "Kolik je vašemu dítěti?",
    childAgeAria: "Vyberte věk dítěte",
    ageOptionDefault: "Vyberte věk...",
    ageNewborn: "Novorozenec (0 měsíců)",
    age2m: "2 měsíce",
    age4m: "4 měsíce",
    age6m: "6 měsíců",
    age12m: "12 měsíců (1 rok)",
    age18m: "18 měsíců",
    age48m: "4-6 let",
    age108m: "9-12 let",
    neededByAge: "Vakcíny potřebné v tomto věku:",
    vaccinesCount: "{count, plural, one {# vakcína} other {# vakcíny}}",
    importance: {
      critical: "Nezbytná",
      important: "Důležitá",
      recommended: "Doporučená",
    },
    fears: [
      "Jsou vakcíny bezpečné pro moje miminko?",
      "Bude to moje dítě bolet?",
      "Co když bude mít potom horečku?",
      "Můžu očkování odložit?",
      "Moje dítě je nemocné - může i tak dostat vakcínu?",
    ],
    meta: {
      title: "Průvodce očkováním - Redi Health",
      description: "Každá vakcína vysvětlená jednoduchými slovy.",
    },
  },
  bg: {
    heroTitle: "Наръчник за ваксини",
    heroSubtitle: "Всяка ваксина е обяснена просто. Натиснете върху която и да е ваксина, за да научите повече.",
    askCta: "Задай въпрос за ваксините",
    backToSchedule: "Назад към календара",
    preventsLabel: "Предпазва от",
    dosesNeeded: "{count, plural, one {# нужна доза} other {# нужни дози}}",
    howItWorks: "Как действа",
    sideEffects: "Странични реакции (нормални)",
    mythTitle: "Мит vs. истина",
    qaTitle: "Попитай за ваксините",
    qaSubtitle: "Всеки въпрос е добре дошъл. Честни отговори от работа на терен.",
    qaPlaceholder: "Напиши въпроса си за ваксините...",
    qaAria: "Задай въпрос за ваксините",
    qaCommon: "Чести въпроси",
    childAgePrompt: "На колко години е детето ви?",
    childAgeAria: "Изберете възраст на детето",
    ageOptionDefault: "Изберете възраст...",
    ageNewborn: "Новородено (0 месеца)",
    age2m: "2 месеца",
    age4m: "4 месеца",
    age6m: "6 месеца",
    age12m: "12 месеца (1 година)",
    age18m: "18 месеца",
    age48m: "4-6 години",
    age108m: "9-12 години",
    neededByAge: "Нужни ваксини на тази възраст:",
    vaccinesCount: "{count, plural, one {# ваксина} other {# ваксини}}",
    importance: {
      critical: "Задължителна",
      important: "Важна",
      recommended: "Препоръчителна",
    },
    fears: [
      "Безопасни ли са ваксините за моето бебе?",
      "Ще боли ли детето ми?",
      "Ами ако получи температура след това?",
      "Мога ли да отложа ваксините?",
      "Детето ми е болно - може ли все пак да се ваксинира?",
    ],
    meta: {
      title: "Наръчник за ваксини - Redi Health",
      description: "Всяка ваксина е обяснена с прости думи.",
    },
  },
  sr: {
    heroTitle: "Водич кроз вакцине",
    heroSubtitle: "Свака вакцина објашњена једноставно. Додирните било коју вакцину да сазнате више.",
    askCta: "Постави питање о вакцинама",
    backToSchedule: "Назад на календар",
    preventsLabel: "Штити од",
    dosesNeeded: "{count, plural, one {# потребна доза} other {# потребне дозе}}",
    howItWorks: "Како делује",
    sideEffects: "Нуспојаве (нормалне)",
    mythTitle: "Мит vs. истина",
    qaTitle: "Питај о вакцинама",
    qaSubtitle: "Свако питање је у реду. Искрени одговори из искуства на терену.",
    qaPlaceholder: "Упишите своје питање о вакцинама...",
    qaAria: "Постави питање о вакцинама",
    qaCommon: "Честа питања",
    childAgePrompt: "Колико година има ваше дете?",
    childAgeAria: "Изаберите узраст детета",
    ageOptionDefault: "Изаберите узраст...",
    ageNewborn: "Новорођенче (0 месеци)",
    age2m: "2 месеца",
    age4m: "4 месеца",
    age6m: "6 месеци",
    age12m: "12 месеци (1 година)",
    age18m: "18 месеци",
    age48m: "4-6 година",
    age108m: "9-12 година",
    neededByAge: "Вакцине потребне у овом узрасту:",
    vaccinesCount: "{count, plural, one {# вакцина} other {# вакцине}}",
    importance: {
      critical: "Неопходна",
      important: "Важна",
      recommended: "Препоручена",
    },
    fears: [
      "Да ли су вакцине безбедне за моју бебу?",
      "Да ли ће моје дете болети?",
      "Шта ако добије температуру после?",
      "Могу ли да одложим вакцине?",
      "Моје дете је болесно - да ли ипак може да се вакцинише?",
    ],
    meta: {
      title: "Водич кроз вакцине - Redi Health",
      description: "Свака вакцина објашњена једноставним речима.",
    },
  },
  hr: {
    heroTitle: "Vodič kroz cjepiva",
    heroSubtitle: "Svako cjepivo objašnjeno jednostavno. Dodirnite bilo koje cjepivo da saznate više.",
    askCta: "Postavi pitanje o cjepivima",
    backToSchedule: "Natrag na kalendar",
    preventsLabel: "Štiti od",
    dosesNeeded: "{count, plural, one {# potrebna doza} other {# potrebne doze}}",
    howItWorks: "Kako djeluje",
    sideEffects: "Nuspojave (normalne)",
    mythTitle: "Mit vs. istina",
    qaTitle: "Pitaj o cjepivima",
    qaSubtitle: "Svako pitanje je dobrodošlo. Iskreni odgovori iz iskustva na terenu.",
    qaPlaceholder: "Upišite svoje pitanje o cjepivima...",
    qaAria: "Postavi pitanje o cjepivima",
    qaCommon: "Česta pitanja",
    childAgePrompt: "Koliko godina ima vaše dijete?",
    childAgeAria: "Odaberite dob djeteta",
    ageOptionDefault: "Odaberite dob...",
    ageNewborn: "Novorođenče (0 mjeseci)",
    age2m: "2 mjeseca",
    age4m: "4 mjeseca",
    age6m: "6 mjeseci",
    age12m: "12 mjeseci (1 godina)",
    age18m: "18 mjeseci",
    age48m: "4-6 godina",
    age108m: "9-12 godina",
    neededByAge: "Cjepiva potrebna u ovoj dobi:",
    vaccinesCount: "{count, plural, one {# cjepivo} other {# cjepiva}}",
    importance: {
      critical: "Neophodno",
      important: "Važno",
      recommended: "Preporučeno",
    },
    fears: [
      "Jesu li cjepiva sigurna za moju bebu?",
      "Hoće li moje dijete boljeti?",
      "Što ako dobije temperaturu poslije?",
      "Mogu li odgoditi cjepiva?",
      "Moje dijete je bolesno - može li se ipak cijepiti?",
    ],
    meta: {
      title: "Vodič kroz cjepiva - Redi Health",
      description: "Svako cjepivo objašnjeno jednostavnim riječima.",
    },
  },
  bs: {
    heroTitle: "Vodič kroz vakcine",
    heroSubtitle: "Svaka vakcina objašnjena jednostavno. Dodirnite bilo koju vakcinu da saznate više.",
    askCta: "Postavi pitanje o vakcinama",
    backToSchedule: "Nazad na kalendar",
    preventsLabel: "Štiti od",
    dosesNeeded: "{count, plural, one {# potrebna doza} other {# potrebne doze}}",
    howItWorks: "Kako djeluje",
    sideEffects: "Nuspojave (normalne)",
    mythTitle: "Mit vs. istina",
    qaTitle: "Pitaj o vakcinama",
    qaSubtitle: "Svako pitanje je dobrodošlo. Iskreni odgovori iz iskustva na terenu.",
    qaPlaceholder: "Upišite svoje pitanje o vakcinama...",
    qaAria: "Postavi pitanje o vakcinama",
    qaCommon: "Česta pitanja",
    childAgePrompt: "Koliko godina ima vaše dijete?",
    childAgeAria: "Odaberite dob djeteta",
    ageOptionDefault: "Odaberite dob...",
    ageNewborn: "Novorođenče (0 mjeseci)",
    age2m: "2 mjeseca",
    age4m: "4 mjeseca",
    age6m: "6 mjeseci",
    age12m: "12 mjeseci (1 godina)",
    age18m: "18 mjeseci",
    age48m: "4-6 godina",
    age108m: "9-12 godina",
    neededByAge: "Vakcine potrebne u ovoj dobi:",
    vaccinesCount: "{count, plural, one {# vakcina} other {# vakcine}}",
    importance: {
      critical: "Neophodna",
      important: "Važna",
      recommended: "Preporučena",
    },
    fears: [
      "Jesu li vakcine sigurne za moju bebu?",
      "Hoće li moje dijete boljeti?",
      "Šta ako dobije temperaturu poslije?",
      "Mogu li odgoditi vakcine?",
      "Moje dijete je bolesno - može li se ipak vakcinisati?",
    ],
    meta: {
      title: "Vodič kroz vakcine - Redi Health",
      description: "Svaka vakcina objašnjena jednostavnim riječima.",
    },
  },
  mk: {
    heroTitle: "Водич за вакцини",
    heroSubtitle: "Секоја вакцина е објаснета едноставно. Допрете која било вакцина за да дознаете повеќе.",
    askCta: "Постави прашање за вакцините",
    backToSchedule: "Назад кон календарот",
    preventsLabel: "Штити од",
    dosesNeeded: "{count, plural, one {# потребна доза} other {# потребни дози}}",
    howItWorks: "Како делува",
    sideEffects: "Несакани реакции (нормални)",
    mythTitle: "Мит vs. вистина",
    qaTitle: "Прашај за вакцините",
    qaSubtitle: "Секое прашање е добредојдено. Искрени одговори од искуство на терен.",
    qaPlaceholder: "Напиши го твоето прашање за вакцините...",
    qaAria: "Постави прашање за вакцините",
    qaCommon: "Чести прашања",
    childAgePrompt: "Колку години има вашето дете?",
    childAgeAria: "Изберете возраст на детето",
    ageOptionDefault: "Изберете возраст...",
    ageNewborn: "Новороденче (0 месеци)",
    age2m: "2 месеци",
    age4m: "4 месеци",
    age6m: "6 месеци",
    age12m: "12 месеци (1 година)",
    age18m: "18 месеци",
    age48m: "4-6 години",
    age108m: "9-12 години",
    neededByAge: "Вакцини потребни на оваа возраст:",
    vaccinesCount: "{count, plural, one {# вакцина} other {# вакцини}}",
    importance: {
      critical: "Неопходна",
      important: "Важна",
      recommended: "Препорачана",
    },
    fears: [
      "Дали вакцините се безбедни за моето бебе?",
      "Дали ќе го боли моето дете?",
      "Што ако добие температура потоа?",
      "Може ли да ги одложам вакцините?",
      "Моето дете е болно - може ли сепак да се вакцинира?",
    ],
    meta: {
      title: "Водич за вакцини - Redi Health",
      description: "Секоја вакцина е објаснета со едноставни зборови.",
    },
  },
  sl: {
    heroTitle: "Vodnik po cepljenju",
    heroSubtitle: "Vsako cepivo je razloženo preprosto. Tapnite katerokoli cepivo in izvedite več.",
    askCta: "Vprašaj o cepivih",
    backToSchedule: "Nazaj na koledar",
    preventsLabel: "Ščiti pred",
    dosesNeeded: "{count, plural, one {# potreben odmerek} other {# potrebni odmerki}}",
    howItWorks: "Kako deluje",
    sideEffects: "Stranski učinki (običajni)",
    mythTitle: "Mit vs. resnica",
    qaTitle: "Vprašaj o cepivih",
    qaSubtitle: "Vsako vprašanje je dobrodošlo. Iskreni odgovori iz terenske prakse.",
    qaPlaceholder: "Vpišite svoje vprašanje o cepivih...",
    qaAria: "Postavi vprašanje o cepivih",
    qaCommon: "Pogosta vprašanja",
    childAgePrompt: "Koliko je star vaš otrok?",
    childAgeAria: "Izberite starost otroka",
    ageOptionDefault: "Izberite starost...",
    ageNewborn: "Novorojenček (0 mesecev)",
    age2m: "2 meseca",
    age4m: "4 mesece",
    age6m: "6 mesecev",
    age12m: "12 mesecev (1 leto)",
    age18m: "18 mesecev",
    age48m: "4-6 let",
    age108m: "9-12 let",
    neededByAge: "Cepiva, potrebna v tej starosti:",
    vaccinesCount: "{count, plural, one {# cepivo} other {# cepiva}}",
    importance: {
      critical: "Nujno",
      important: "Pomembno",
      recommended: "Priporočeno",
    },
    fears: [
      "Ali so cepiva varna za mojega dojenčka?",
      "Ali bo mojega otroka bolelo?",
      "Kaj če dobi potem vročino?",
      "Ali lahko cepljenje odložim?",
      "Moj otrok je bolan - ali se lahko vseeno cepi?",
    ],
    meta: {
      title: "Vodnik po cepljenju - Redi Health",
      description: "Vsako cepivo je razloženo s preprostimi besedami.",
    },
  },
  el: {
    heroTitle: "Οδηγός εμβολίων",
    heroSubtitle: "Κάθε εμβόλιο εξηγείται απλά. Πατήστε οποιοδήποτε εμβόλιο για να μάθετε περισσότερα.",
    askCta: "Κάνε μια ερώτηση για τα εμβόλια",
    backToSchedule: "Πίσω στο πρόγραμμα",
    preventsLabel: "Προλαμβάνει",
    dosesNeeded: "{count, plural, one {# δόση χρειάζεται} other {# δόσεις χρειάζονται}}",
    howItWorks: "Πώς λειτουργεί",
    sideEffects: "Παρενέργειες (φυσιολογικές)",
    mythTitle: "Μύθος vs. αλήθεια",
    qaTitle: "Ρώτησε για τα εμβόλια",
    qaSubtitle: "Κάθε ερώτηση είναι καλοδεχούμενη. Ειλικρινείς απαντήσεις από εμπειρία πεδίου.",
    qaPlaceholder: "Γράψε την ερώτησή σου για τα εμβόλια...",
    qaAria: "Κάνε μια ερώτηση για τα εμβόλια",
    qaCommon: "Συχνές ερωτήσεις",
    childAgePrompt: "Πόσο χρονών είναι το παιδί σου;",
    childAgeAria: "Επιλέξτε ηλικία παιδιού",
    ageOptionDefault: "Επιλέξτε ηλικία...",
    ageNewborn: "Νεογέννητο (0 μηνών)",
    age2m: "2 μηνών",
    age4m: "4 μηνών",
    age6m: "6 μηνών",
    age12m: "12 μηνών (1 έτος)",
    age18m: "18 μηνών",
    age48m: "4-6 ετών",
    age108m: "9-12 ετών",
    neededByAge: "Εμβόλια που χρειάζονται σε αυτή την ηλικία:",
    vaccinesCount: "{count, plural, one {# εμβόλιο} other {# εμβόλια}}",
    importance: {
      critical: "Απαραίτητο",
      important: "Σημαντικό",
      recommended: "Συνιστώμενο",
    },
    fears: [
      "Είναι ασφαλή τα εμβόλια για το μωρό μου;",
      "Θα πονέσει το παιδί μου;",
      "Τι γίνεται αν κάνει πυρετό μετά;",
      "Μπορώ να καθυστερήσω τα εμβόλια;",
      "Το παιδί μου είναι άρρωστο - μπορεί παρ' όλα αυτά να εμβολιαστεί;",
    ],
    meta: {
      title: "Οδηγός εμβολίων - Redi Health",
      description: "Κάθε εμβόλιο εξηγείται με απλά λόγια.",
    },
  },
  tr: {
    heroTitle: "Asi rehberi",
    heroSubtitle: "Her asi basitçe anlatildi. Daha fazlasini öğrenmek için herhangi bir asiya dokunun.",
    askCta: "Asilar hakkinda soru sor",
    backToSchedule: "Takvime dön",
    preventsLabel: "Korur",
    dosesNeeded: "{count, plural, one {# doz gerekir} other {# doz gerekir}}",
    howItWorks: "Nasil çalisir",
    sideEffects: "Yan etkiler (normal)",
    mythTitle: "Efsane vs. gerçek",
    qaTitle: "Asilar hakkinda sor",
    qaSubtitle: "Her soru olur. Saha deneyiminden dürüst cevaplar.",
    qaPlaceholder: "Asi sorunu yaz...",
    qaAria: "Asilar hakkinda soru sor",
    qaCommon: "Sik sorulan sorular",
    childAgePrompt: "Çocuğunuz kaç yaşinda?",
    childAgeAria: "Çocuk yaşini seçin",
    ageOptionDefault: "Yaş seçin...",
    ageNewborn: "Yeni doğan (0 ay)",
    age2m: "2 ay",
    age4m: "4 ay",
    age6m: "6 ay",
    age12m: "12 ay (1 yaş)",
    age18m: "18 ay",
    age48m: "4-6 yaş",
    age108m: "9-12 yaş",
    neededByAge: "Bu yaşta gereken aşılar:",
    vaccinesCount: "{count, plural, one {# aşı} other {# aşı}}",
    importance: {
      critical: "Gerekli",
      important: "Önemli",
      recommended: "Önerilen",
    },
    fears: [
      "Aşılar bebeğim için güvenli mi?",
      "Çocuğumun canı yanacak mı?",
      "Ya sonra ateşi çıkarsa?",
      "Aşıları erteleyebilir miyim?",
      "Çocuğum hasta - yine de aşı olabilir mi?",
    ],
    meta: {
      title: "Asi rehberi - Redi Health",
      description: "Her asi basit kelimelerle anlatildi.",
    },
  },
  it: {
    heroTitle: "Guida ai vaccini",
    heroSubtitle: "Ogni vaccino spiegato in modo semplice. Tocca qualsiasi vaccino per saperne di più.",
    askCta: "Fai una domanda sui vaccini",
    backToSchedule: "Torna al programma",
    preventsLabel: "Previene",
    dosesNeeded: "{count, plural, one {# dose necessaria} other {# dosi necessarie}}",
    howItWorks: "Come funziona",
    sideEffects: "Effetti collaterali (normali)",
    mythTitle: "Mito contro verità",
    qaTitle: "Chiedi informazioni sui vaccini",
    qaSubtitle: "Qualsiasi domanda. Risposte oneste derivanti dall'esperienza sul campo.",
    qaPlaceholder: "Scrivi la tua domanda sul vaccino...",
    qaAria: "Fai una domanda sul vaccino",
    qaCommon: "Domande comuni",
    childAgePrompt: "Quanti anni ha tuo figlio?",
    childAgeAria: "Seleziona l'età del bambino",
    ageOptionDefault: "Seleziona l'età...",
    ageNewborn: "Neonato (0 mesi)",
    age2m: "2 mesi",
    age4m: "4 mesi",
    age6m: "6 mesi",
    age12m: "12 mesi (1 anno)",
    age18m: "18 mesi",
    age48m: "4–6 anni",
    age108m: "9-12 anni",
    neededByAge: "Vaccini necessari a questa età:",
    vaccinesCount: "{count, plural, one {# vaccino} other {# vaccini}}",
    importance: {
      critical: "Essenziale",
      important: "Importante",
      recommended: "Raccomandato",
    },
    fears: [
      "I vaccini sono sicuri per il mio bambino?",
      "Farà del male a mio figlio?",
      "Cosa succede se a mio figlio viene la febbre?",
      "Posso ritardare i vaccini?",
      "Mio figlio è malato: può ancora vaccinarsi?",
    ],
    meta: {
      title: "Guida ai vaccini – Redi Health",
      description: "Ogni vaccino spiegato in parole semplici.",
    },
  },
};

const AGE_GROUP_LABELS = {
  sq: {
    birth: "Në lindje",
    "2months": "2 muaj",
    "4months": "4 muaj",
    "6months": "6 muaj",
    "12months": "12 muaj",
    "18months": "18 muaj",
    "4years": "4-6 vjeç",
    "9years": "9-12 vjeç",
    adult: "Të rritur",
    pregnant: "Gratë shtatzëna",
  },
  rom: {
    birth: "Kana biandol",
    "2months": "2 čhona",
    "4months": "4 čhona",
    "6months": "6 čhona",
    "12months": "12 čhona",
    "18months": "18 čhona",
    "4years": "4-6 berš",
    "9years": "9-12 berš",
    adult: "Bare manuša",
    pregnant: "Pušne džuvlja",
  },
  ro: {
    birth: "La naștere",
    "2months": "2 luni",
    "4months": "4 luni",
    "6months": "6 luni",
    "12months": "12 luni",
    "18months": "18 luni",
    "4years": "4-6 ani",
    "9years": "9-12 ani",
    adult: "Adulți",
    pregnant: "Femei însărcinate",
  },
  hu: {
    birth: "Születéskor",
    "2months": "2 hónaposan",
    "4months": "4 hónaposan",
    "6months": "6 hónaposan",
    "12months": "12 hónaposan",
    "18months": "18 hónaposan",
    "4years": "4-6 évesen",
    "9years": "9-12 évesen",
    adult: "Felnőttek",
    pregnant: "Terhes nők",
  },
  sk: {
    birth: "Pri narodení",
    "2months": "2 mesiace",
    "4months": "4 mesiace",
    "6months": "6 mesiacov",
    "12months": "12 mesiacov",
    "18months": "18 mesiacov",
    "4years": "4-6 rokov",
    "9years": "9-12 rokov",
    adult: "Dospelí",
    pregnant: "Tehotné ženy",
  },
  cs: {
    birth: "Při narození",
    "2months": "2 měsíce",
    "4months": "4 měsíce",
    "6months": "6 měsíců",
    "12months": "12 měsíců",
    "18months": "18 měsíců",
    "4years": "4-6 let",
    "9years": "9-12 let",
    adult: "Dospělí",
    pregnant: "Těhotné ženy",
  },
  bg: {
    birth: "При раждане",
    "2months": "2 месеца",
    "4months": "4 месеца",
    "6months": "6 месеца",
    "12months": "12 месеца",
    "18months": "18 месеца",
    "4years": "4-6 години",
    "9years": "9-12 години",
    adult: "Възрастни",
    pregnant: "Бременни жени",
  },
  sr: {
    birth: "На рођењу",
    "2months": "2 месеца",
    "4months": "4 месеца",
    "6months": "6 месеци",
    "12months": "12 месеци",
    "18months": "18 месеци",
    "4years": "4-6 година",
    "9years": "9-12 година",
    adult: "Одрасли",
    pregnant: "Труднице",
  },
  hr: {
    birth: "Pri rođenju",
    "2months": "2 mjeseca",
    "4months": "4 mjeseca",
    "6months": "6 mjeseci",
    "12months": "12 mjeseci",
    "18months": "18 mjeseci",
    "4years": "4-6 godina",
    "9years": "9-12 godina",
    adult: "Odrasli",
    pregnant: "Trudnice",
  },
  bs: {
    birth: "Po rođenju",
    "2months": "2 mjeseca",
    "4months": "4 mjeseca",
    "6months": "6 mjeseci",
    "12months": "12 mjeseci",
    "18months": "18 mjeseci",
    "4years": "4-6 godina",
    "9years": "9-12 godina",
    adult: "Odrasli",
    pregnant: "Trudnice",
  },
  mk: {
    birth: "При раѓање",
    "2months": "2 месеци",
    "4months": "4 месеци",
    "6months": "6 месеци",
    "12months": "12 месеци",
    "18months": "18 месеци",
    "4years": "4-6 години",
    "9years": "9-12 години",
    adult: "Возрасни",
    pregnant: "Бремени жени",
  },
  sl: {
    birth: "Ob rojstvu",
    "2months": "2 meseca",
    "4months": "4 mesece",
    "6months": "6 mesecev",
    "12months": "12 mesecev",
    "18months": "18 mesecev",
    "4years": "4-6 let",
    "9years": "9-12 let",
    adult: "Odrasli",
    pregnant: "Nosečnice",
  },
  el: {
    birth: "Στη γέννηση",
    "2months": "2 μηνών",
    "4months": "4 μηνών",
    "6months": "6 μηνών",
    "12months": "12 μηνών",
    "18months": "18 μηνών",
    "4years": "4-6 ετών",
    "9years": "9-12 ετών",
    adult: "Ενήλικες",
    pregnant: "Έγκυες γυναίκες",
  },
  tr: {
    birth: "Doğumda",
    "2months": "2 aylık",
    "4months": "4 aylık",
    "6months": "6 aylık",
    "12months": "12 aylık",
    "18months": "18 aylık",
    "4years": "4-6 yaş",
    "9years": "9-12 yaş",
    adult: "Yetişkinler",
    pregnant: "Hamile kadınlar",
  },
  it: {
    birth: "Alla nascita",
    "2months": "2 mesi",
    "4months": "4 mesi",
    "6months": "6 mesi",
    "12months": "12 mesi",
    "18months": "18 mesi",
    "4years": "4-6 anni",
    "9years": "9-12 anni",
    adult: "Adulti",
    pregnant: "Donne incinte",
  },
};

const ITEM_TRANSLATIONS = {
  it: {
    bcg: item(
      "BCG (tubercolosi)",
      ["Tubercolosi (TBC)"],
      "Questo vaccino insegna al corpo del tuo bambino a combattere la tubercolosi, una grave malattia polmonare che si diffonde attraverso l'aria. Una piccola iniezione nel braccio garantisce protezione per anni.",
      "Una piccola protuberanza o cicatrice sul braccio nel punto in cui è stata effettuata l'iniezione. Questo è normale e significa che il vaccino sta funzionando.",
      "MITO: \"La tubercolosi non esiste più\". LA VERITÀ: la tubercolosi uccide ancora 1,5 milioni di persone ogni anno. In condizioni di vita affollate, si diffonde rapidamente. Ho visto epidemie di tubercolosi in insediamenti in cui le famiglie hanno rifiutato questo vaccino."
    ),
    hepb: item(
      "Epatite B",
      ["Epatite B (malattia del fegato)"],
      "Protegge il fegato da un virus che può causare danni al fegato e cancro per tutta la vita. Dato alla nascita perché i bambini sono i più vulnerabili.",
      "Lieve dolore nel sito di iniezione. Alcuni bambini sono un po’ schizzinosi per un giorno. Niente di serio.",
      "MITO: \"Il mio bambino è troppo piccolo per i vaccini alla nascita\". VERITÀ: i neonati sono in realtà i più vulnerabili. Prima li proteggiamo, più sono sicuri. Questo vaccino è stato somministrato in modo sicuro a miliardi di bambini."
    ),
    dtap: item(
      "DTaP (Difterite, Tetano, Pertosse)",
      ["Difterite", "Tetano (trisma)", "Pertosse"],
      "Protezione tre in uno. La difterite può bloccare la gola di tuo figlio. Il tetano provoca un doloroso blocco dei muscoli. La pertosse fa sì che i bambini tossiscano così forte da non riuscire a respirare.",
      "Il sito di iniezione può essere rosso e dolorante. Il tuo bambino potrebbe avere una leggera febbre per 1-2 giorni. Dai loro amore e liquidi extra.",
      "MITO: 'Queste malattie non esistono più, perché vaccinare?' VERITÀ: non esistono A CAUSA dei vaccini. Quando le comunità smettono di vaccinare, queste malattie ritornano. Ho assistito a un’epidemia di pertosse in un insediamenti nel 2018: tre bambini sono stati ricoverati in ospedale."
    ),
    ipv: item(
      "Poliomielite (IPV)",
      ["Poliomielite (paralisi)"],
      "La poliomielite è un virus che può paralizzare permanentemente le gambe di un bambino in poche ore. Questo vaccino ha quasi eliminato la poliomielite dal mondo.",
      "Molto mite. Qualche rossore nel sito di iniezione. Questo è tutto.",
      "MITO: \"La poliomielite è scomparsa, non ne abbiamo bisogno\". VERITÀ: la poliomielite è scomparsa in Europa GRAZIE a questo vaccino. Esiste ancora in alcuni paesi. Un viaggiatore non vaccinato può riportarlo indietro."
    ),
    mmr: item(
      "MMR (morbillo, parotite, rosolia)",
      ["Morbillo", "Parotite", "Rosolia (morbillo tedesco)"],
      "Il morbillo è estremamente contagioso e può causare danni cerebrali e morte. La parotite provoca gonfiore doloroso. La rosolia è pericolosa per le donne incinte. Un vaccino protegge da tutti e tre.",
      "Circa 1 bambino su 10 sviluppa una lieve febbre ed eruzione cutanea 7-10 giorni dopo. Ciò significa che il corpo sta imparando a combattere. Va via da solo.",
      "MITO: \"L'MMR causa l'autismo\". VERITÀ: questo è il mito del vaccino più studiato nella storia. Sono stati studiati oltre 1,2 milioni di bambini: NESSUN collegamento con l'autismo. Il medico che ha fatto questa richiesta ha perso la licenza medica per frode. Personalmente ho visto bambini morire di morbillo negli insediamenti dove si diffondeva questa menzogna."
    ),
    pneumo: item(
      "Pneumococco (PCV13)",
      ["Polmonite", "Meningite", "Infezioni del sangue"],
      "Protegge dai batteri che causano polmonite (infezione polmonare), meningite (infezione cerebrale) e infezioni del sangue. Questi sono i più grandi assassini di bambini piccoli.",
      "Lieve febbre, irritabilità, dolore al sito di iniezione per 1-2 giorni.",
      "MITO: \"I bambini si ammalano a causa dei troppi vaccini\". VERITÀ: il sistema immunitario dei bambini gestisce migliaia di germi ogni giorno. Alcuni vaccini non sono nulla in confronto a ciò che il loro corpo già combatte."
    ),
    rota: item(
      "Rotavirus",
      ["Grave diarrea e vomito nei bambini"],
      "Dato come gocce in bocca (non un'iniezione!). Protegge dal virus che causa una grave diarrea nei bambini, che può essere mortale a causa della disidratazione.",
      "Molto mite. Occasionalmente un po' di irritabilità o lieve diarrea.",
      "MITO: \"La diarrea è normale per i bambini, non hanno bisogno di un vaccino\". VERITÀ: la diarrea da rotavirus NON è normale: provoca una grave disidratazione che uccide centinaia di migliaia di bambini in tutto il mondo ogni anno."
    ),
    varicella: item(
      "Varicella (varicella)",
      ["Varicella"],
      "La varicella sembra lieve ma può causare gravi infezioni della pelle, polmonite e gonfiore del cervello. Il vaccino lo impedisce quasi completamente.",
      "Lieve dolore. Raramente, alcune macchie simili alla varicella vicino al sito di iniezione.",
      "MITO: \"È meglio prendere la varicella in modo naturale\". VERITÀ: la varicella naturale può causare gravi complicazioni e il virus rimane nel corpo per sempre, causando un doloroso fuoco di Sant'Antonio più avanti nella vita."
    ),
    hpv: item(
      "HPV (papillomavirus umano)",
      ["Cancro cervicale", "Altri tumori"],
      "Questo vaccino previene il cancro. L’HPV è un virus molto comune che può causare il cancro cervicale nelle donne e altri tumori sia negli uomini che nelle donne. Dato agli adolescenti prima che siano esposti al virus.",
      "Braccio dolorante, a volte un breve mal di testa o vertigini. Molto sicuro.",
      "MITO: \"Questo vaccino incoraggia l'attività sessuale\". VERITÀ: Questo vaccino previene il CANCRO. Non ha nulla a che fare con il comportamento. Rifiuteresti un farmaco antitumorale per tuo figlio?"
    ),
    flu: item(
      "Grip (influenza)",
      ["Influenza stagionale"],
      "L’influenza non è solo un raffreddore: può essere grave per i bambini piccoli, gli anziani e le donne incinte. Questo vaccino viene aggiornato ogni anno per corrispondere agli attuali ceppi influenzali.",
      "Lieve dolore, occasionalmente febbre bassa per un giorno. NON puoi prendere l'influenza dal vaccino antinfluenzale.",
      "MITO: \"Il vaccino antinfluenzale ti fa venire l'influenza\". VERITÀ: impossibile. Il vaccino non contiene virus vivi. Se ti senti un po' giù per un giorno, è il tuo sistema immunitario che sta imparando, non l'influenza."
    ),
  },
  sq: {
    bcg: item(
      "BCG (Tuberkulozi)",
      ["Tuberkulozi (TB)"],
      "Kjo vaksinë e mëson trupin e bebit të luftojë tuberkulozin - një sëmundje serioze e mushkërive që përhapet në ajër. Një injeksion i vogël në krah jep mbrojtje për vite.",
      "Mund të dalë një kokërr e vogël ose një shenjë në krah ku u bë injeksioni. Kjo është normale dhe tregon se vaksina po vepron.",
      "MIT: 'Tuberkulozi nuk ekziston më.' E VËRTETA: Tuberkulozi ende vret shumë njerëz çdo vit. Në vende të mbipopulluara përhapet shpejt.",
    ),
    hepb: item(
      "Hepatiti B",
      ["Hepatiti B (sëmundje e mëlçisë)"],
      "Mbron mëlçinë nga një virus që mund të shkaktojë dëmtime të përhershme dhe kancer. Jepet që në lindje sepse bebet janë më të pambrojtura.",
      "Pak dhimbje në vendin e injeksionit. Disa bebe mund të jenë pak të bezdisura për një ditë. Nuk është diçka serioze.",
      "MIT: 'Bebi im është shumë i vogël për vaksina në lindje.' E VËRTETA: Të porsalindurit janë më të pambrojturit. Sa më herët t'i mbrojmë, aq më të sigurt janë.",
    ),
    dtap: item(
      "DTaP (Difteria, Tetanozi, Kolla e mirë)",
      ["Difteria", "Tetanozi", "Kolla e mirë"],
      "Kjo vaksinë mbron nga tri sëmundje njëherësh. Difteria mund të bllokojë fytin, tetanozi ngurtëson muskujt dhe kolla e mirë i lë foshnjat pa frymë.",
      "Vendi i injeksionit mund të skuqet dhe të dhembë. Fëmija mund të ketë temperaturë të lehtë për 1-2 ditë.",
      "MIT: 'Këto sëmundje nuk ekzistojnë më, pse të vaksinojmë?' E VËRTETA: Janë bërë të rralla pikërisht sepse vaksinojmë. Kur vaksinat shtyhen, sëmundjet kthehen.",
    ),
    ipv: item(
      "Polio (IPV)",
      ["Polio (paralizë)"],
      "Polio është virus që mund t'i paralizojë këmbët e një fëmije për pak orë. Kjo vaksinë e ka ulur pothuajse në zero polion në shumë vende.",
      "Shumë e lehtë. Ndonjëherë ka pak skuqje në vendin e injeksionit.",
      "MIT: 'Polio është zhdukur, nuk na duhet kjo vaksinë.' E VËRTETA: Polio është zhdukur në Evropë sepse njerëzit vaksinohen. Një udhëtar i pavaksinuar mund ta rikthejë.",
    ),
    mmr: item(
      "MMR (Fruthi, Shytat, Rubeola)",
      ["Fruthi", "Shytat", "Rubeola"],
      "Fruthi është shumë ngjitës dhe mund të dëmtojë trurin ose të shkaktojë vdekje. Kjo vaksinë mbron nga të tria sëmundjet me një injeksion.",
      "Rreth 1 në 10 fëmijë mund të ketë temperaturë të lehtë dhe skuqje 7-10 ditë më vonë. Kjo tregon se trupi po mëson të mbrohet.",
      "MIT: 'MMR shkakton autizëm.' E VËRTETA: Studime shumë të mëdha nuk gjetën asnjë lidhje me autizmin. Fruthi, përkundrazi, mund të vrasë.",
    ),
    pneumo: item(
      "Pneumokoku (PCV13)",
      ["Pneumoni", "Meningjit", "Infeksione në gjak"],
      "Mbron nga bakteret që shkaktojnë pneumoni, meningjit dhe infeksione të rënda në gjak. Këto janë ndër rreziqet më të mëdha për fëmijët e vegjël.",
      "Temperaturë e lehtë, bezdisje dhe dhimbje në vendin e injeksionit për 1-2 ditë.",
      "MIT: 'Fëmijët sëmuren nga shumë vaksina.' E VËRTETA: Sistemi imunitar i fëmijës përballet me mijëra mikrobe çdo ditë. Disa vaksina nuk janë tepër për trupin e tyre.",
    ),
    rota: item(
      "Rotavirus",
      ["Diarre dhe të vjella të rënda te foshnjat"],
      "Jepet si pika në gojë, jo si injeksion. Mbron nga virusi që shkakton diarre të rëndë dhe dehidrim te foshnjat.",
      "Shumë e lehtë. Ndonjëherë pak bezdisje ose diarre e lehtë.",
      "MIT: 'Diarreja është normale te foshnjat, nuk duhet vaksinë.' E VËRTETA: Diarreja nga rotavirusi mund të thajë trupin shpejt dhe mund të jetë vdekjeprurëse.",
    ),
    varicella: item(
      "Varicela (Lija e dhenve)",
      ["Lija e dhenve"],
      "Lija e dhenve duket e lehtë, por mund të shkaktojë infeksione të rënda të lëkurës, pneumoni dhe ënjtje të trurit. Vaksina parandalon shumicën e rasteve.",
      "Dhimbje e lehtë. Rrallë mund të dalin disa pika si lia pranë vendit të injeksionit.",
      "MIT: 'Është më mirë ta kalosh natyrshëm lijën e dhenve.' E VËRTETA: Infeksioni natyral mund të japë komplikime serioze dhe mund të çojë më vonë në herpes zoster.",
    ),
    hpv: item(
      "HPV (Virusi Papilloma Njerëzor)",
      ["Kanceri i qafës së mitrës", "Kancere të tjera"],
      "Kjo vaksinë parandalon kancerin. Jepet zakonisht para adoleshencës së vonë, para se trupi të ekspozohet ndaj virusit.",
      "Dhimbje në krah, ndonjëherë pak dhimbje koke ose marramendje. Është shumë e sigurt.",
      "MIT: 'Kjo vaksinë nxit aktivitet seksual.' E VËRTETA: Kjo vaksinë parandalon kancerin. Nuk ka lidhje me sjelljen.",
    ),
    flu: item(
      "Gripi sezonal",
      ["Grip sezonal"],
      "Gripi nuk është thjesht ftohje. Mund të jetë i rrezikshëm për fëmijët e vegjël, të moshuarit dhe gratë shtatzëna. Vaksina përditësohet çdo vit.",
      "Dhimbje e lehtë në krah dhe ndonjëherë temperaturë e ulët për një ditë. Nga vaksina e gripit NUK merr grip.",
      "MIT: 'Vaksina e gripit të jep grip.' E VËRTETA: Kjo është e pamundur. Vaksina nuk ka virus të gjallë.",
    ),
  },
  rom: {
    bcg: item(
      "BCG (Tuberkuloza)",
      ["Tuberkuloza (TB)"],
      "Akaja vakcina sikavel e čhavesqo trupo te marolpes kontra tuberkuloza - phari pulmoni nasvalipen so phirel pala vazduho. Jekh cikni injekcija ando vast arakhel but bersa.",
      "Šaj te avel cikni bumba vaj cikni semna ando vast kaj diňa pes i injekcija. Kada si normalno thaj sikavel kaj vakcina kerel buti.",
      "MITO: 'Tuberkuloza na si maj.' ČAČIPE: Tuberkuloza akana vi murdarel but manušen sakko berš. Ande but manušesqe than phirel sig.",
    ),
    hepb: item(
      "Hepatitis B",
      ["Hepatitis B (nasvalipen e džigerica)"],
      "Arakhel e džigerica katar jekh viruso so šaj te kerel longo našavipen thaj kancero. Del pes ande biandipe kaj o neve biande si maj pharimasa.",
      "Cikni duk ande than kaj diňa pes i injekcija. Dikhlin čhave šaj te aven cikne nervozne jekh dives. Na si ništa pharo.",
      "MITO: 'Miro neve biando si but tikno vaš vakcina.' ČAČIPE: Neve biande si maj but pharimasa. Sar maj sig arakhas len, maj feder si.",
    ),
    dtap: item(
      "DTaP (Difterija, Tetanuso, Khosipen)",
      ["Difterija", "Tetanuso", "Khosipen"],
      "Akaja vakcina arakhel andar trin nasvalimata jekhe dromeske. Difterija šaj te phandel o kanli, tetanuso kerel miškipa pharimasa, a o khosipen na mukhel o čhavorre te phuvin.",
      "I than kaj diňa pes i injekcija šaj te avel loli thaj dukhal. O čhavo šaj te avel le cikne temperaturasa 1-2 divesa.",
      "MITO: 'Akala nasvalimata na si maj, soske vakcina?' ČAČIPE: Na si but sar angleder kaj vakcine arakhen. Kana khethanipe na vakcininelpes, nasvalimata pale aven.",
    ),
    ipv: item(
      "Polio (IPV)",
      ["Polio (paraliza)"],
      "Polio si viruso so šaj ande cikne ora te paralyzirinel e čhavesqe pindre. Akaja vakcina but cikňarela poliovo ando them.",
      "But loko. Šaj te avel cikni lolipe ande than kaj diňa pes i injekcija.",
      "MITO: 'Polio na si maj, na trubul akaja vakcina.' ČAČIPE: Polio na si but ande Europa baš akaja vakcina. Jekh manuš bi vakcina šaj te anel les pale.",
    ),
    mmr: item(
      "MMR (Kampi, Šaj, Rubeola)",
      ["Kampi", "Šaj", "Rubeola"],
      "Kampi si but phirel thaj šaj te kerel našavipen ando šero vaj te murdarel. Akaja vakcina arakhel andar sa trin nasvalimata.",
      "Paše jekh andar deš čhave šaj te avel e cikne temperaturasa thaj cikno osip 7-10 divesa pala. Kada phenel kaj o trupo sikljolpes.",
      "MITO: 'MMR kerel autizmo.' ČAČIPE: But bare studii na arakhle ni jekh lidhajpe le autizmosa. Kampi šaj te murdarel.",
    ),
    pneumo: item(
      "Pneumokokno (PCV13)",
      ["Pneumonija", "Meningitis", "Ratune infekcije"],
      "Arakhel katar bakterije so keren pneumonija, meningitis thaj phare infekcije ande rat. Akala si maškar e maj phare nasvalimata vaš tikne čhave.",
      "Cikni temperatura, nervoza thaj duk ande than kaj diňa pes i injekcija 1-2 divesa.",
      "MITO: 'Čhave nasvalon katar but vakcine.' ČAČIPE: Le čhavesqo imuniteto marolpes kontra but mikrobi sakko dives. Keci vakcine na si but vaš lesqo trupo.",
    ),
    rota: item(
      "Rotaviruso",
      ["Phari diarija thaj vomitimos ande čhavorre"],
      "Del pes sar kapura ando muj, na sar injekcija. Arakhel katar o viruso so kerel phari diarija thaj sušipe ande čhavorre.",
      "But loko. Varekana cikni nervoza vaj cikni diarija.",
      "MITO: 'Diarija si normalno ande čhavorre, na trubul vakcina.' ČAČIPE: Rotavirusoski diarija šaj sig te sušarel o trupo thaj šaj te avel phari.",
    ),
    varicella: item(
      "Varicela (Brânca)",
      ["Brânca"],
      "Brânca dikhel lokhi, ama šaj te kerel phare kožake infekcije, pneumonija thaj pharipen ando šero. Vakcina arakhel andar but kasusura.",
      "Cikni duk. Rare šaj te aven cikne brâncako buti pašal i than kaj diňa pes i injekcija.",
      "MITO: 'Maj feder si te aves nasvalo naturalno.' ČAČIPE: Naturalo infekcija šaj te kerel phare komplikacije thaj pašla ande trupo vaš but bersa.",
    ),
    hpv: item(
      "HPV (Humano papilloma viruso)",
      ["Kancero e garadutnesqo grlo", "Aver kancerura"],
      "Akaja vakcina arakhel katar kancero. Del pes angleder sar o ternimata te avel kontaktosa le virusosa.",
      "Duk ando vast, varekana cikni šeruni duk vaj vrtoglavo. But sigurno si.",
      "MITO: 'Akaja vakcina kerel seksualno buti.' ČAČIPE: Akaja vakcina arakhel katar KANCERO. Na si baš ahajiba.",
    ),
    flu: item(
      "Influenza (gripa)",
      ["Sezonalni gripa"],
      "Gripa na si numa prehlada. Šaj te avel phari vaš tikne čhave, phure manuša thaj pušne džuvlja. Vakcina sikhavel pes sakko berš.",
      "Cikni duk ando vast thaj varekana cikni temperatura jekh dives. Našti te les gripa katar akaja vakcina.",
      "MITO: 'Griposki vakcina del tuke gripa.' ČAČIPE: Našti. Vakcina na si le živone virusosa.",
    ),
  },
  ro: {
    bcg: item(
      "BCG (Tuberculoză)",
      ["Tuberculoză (TB)"],
      "Acest vaccin învață corpul bebelușului să lupte cu tuberculoza - o boală gravă de plămâni care se transmite prin aer. O injecție mică în braț oferă protecție ani de zile.",
      "Poate apărea un mic nodul sau o cicatrice pe braț unde s-a făcut injecția. Este normal și arată că vaccinul funcționează.",
      "MIT: 'Tuberculoza nu mai există.' ADEVĂR: Tuberculoza încă omoară mulți oameni în fiecare an. În locuri aglomerate se răspândește repede.",
    ),
    hepb: item(
      "Hepatita B",
      ["Hepatita B (boală de ficat)"],
      "Protejează ficatul de un virus care poate provoca leziuni pe viață și cancer. Se dă la naștere pentru că bebelușii sunt cei mai vulnerabili.",
      "Ușoară durere la locul injecției. Unii bebeluși sunt puțin agitați o zi. Nimic grav.",
      "MIT: 'Bebelușul meu e prea mic pentru vaccin la naștere.' ADEVĂR: Nou-născuții sunt cei mai vulnerabili. Cu cât îi protejăm mai devreme, cu atât sunt mai în siguranță.",
    ),
    dtap: item(
      "DTaP (Difterie, Tetanos, Tuse convulsivă)",
      ["Difterie", "Tetanos", "Tuse convulsivă"],
      "Acest vaccin protejează împotriva a trei boli dintr-o dată. Difteria poate bloca gâtul, tetanosul înțepenește mușchii, iar tusea convulsivă îi lasă pe bebeluși fără aer.",
      "Locul injecției poate fi roșu și dureros. Copilul poate avea febră ușoară 1-2 zile.",
      "MIT: 'Bolile astea nu mai există, de ce să vaccinăm?' ADEVĂR: Sunt rare tocmai pentru că vaccinăm. Când vaccinarea scade, bolile revin.",
    ),
    ipv: item(
      "Polio (IPV)",
      ["Polio (paralizie)"],
      "Polio este un virus care poate paraliza picioarele unui copil în doar câteva ore. Acest vaccin aproape a eliminat boala din multe părți ale lumii.",
      "Foarte ușor. Uneori doar puțină roșeață la locul injecției.",
      "MIT: 'Polio a dispărut, nu mai avem nevoie de vaccin.' ADEVĂR: În Europa a dispărut pentru că oamenii se vaccinează. Un călător nevaccinat îl poate readuce.",
    ),
    mmr: item(
      "MMR (Rujeolă, Oreion, Rubeolă)",
      ["Rujeolă", "Oreion", "Rubeolă"],
      "Rujeola este extrem de contagioasă și poate provoca leziuni cerebrale sau moarte. Un singur vaccin protejează împotriva tuturor celor trei boli.",
      "Cam 1 din 10 copii poate avea febră ușoară și erupție la 7-10 zile după vaccin. Asta arată că organismul învață să se apere.",
      "MIT: 'MMR provoacă autism.' ADEVĂR: Studii foarte mari au arătat că nu există nicio legătură cu autismul. Rujeola, în schimb, poate ucide.",
    ),
    pneumo: item(
      "Pneumococic (PCV13)",
      ["Pneumonie", "Meningită", "Infecții în sânge"],
      "Protejează împotriva bacteriilor care provoacă pneumonie, meningită și infecții grave în sânge. Aceste boli sunt printre cele mai periculoase pentru copiii mici.",
      "Febră ușoară, agitație și durere la locul injecției timp de 1-2 zile.",
      "MIT: 'Copiii se îmbolnăvesc de la prea multe vaccinuri.' ADEVĂR: Sistemul imunitar al copilului luptă zilnic cu mii de microbi. Câteva vaccinuri nu sunt prea mult pentru organism.",
    ),
    rota: item(
      "Rotavirus",
      ["Diaree severă și vărsături la bebeluși"],
      "Se dă sub formă de picături în gură, nu prin injecție. Protejează împotriva virusului care provoacă diaree severă și deshidratare la bebeluși.",
      "Foarte ușor. Uneori puțină agitație sau diaree ușoară.",
      "MIT: 'Diareea e normală la bebeluși, nu trebuie vaccin.' ADEVĂR: Diareea cu rotavirus poate deshidrata rapid copilul și poate deveni foarte periculoasă.",
    ),
    varicella: item(
      "Varicelă (Vărsat de vânt)",
      ["Vărsat de vânt"],
      "Varicela pare ușoară, dar poate provoca infecții grave ale pielii, pneumonie și inflamație a creierului. Vaccinul previne majoritatea cazurilor.",
      "Ușoară durere. Rar apar câteva bubițe asemănătoare varicelei lângă locul injecției.",
      "MIT: 'E mai bine să faci vărsat de vânt natural.' ADEVĂR: Boala naturală poate da complicații serioase și poate duce mai târziu la zona zoster.",
    ),
    hpv: item(
      "HPV (Virusul papiloma uman)",
      ["Cancer de col uterin", "Alte tipuri de cancer"],
      "Acest vaccin previne cancerul. Se face înainte ca adolescenții să intre în contact cu virusul.",
      "Braț dureros, uneori ușoară durere de cap sau amețeală. Este foarte sigur.",
      "MIT: 'Vaccinul acesta încurajează activitatea sexuală.' ADEVĂR: Vaccinul previne CANCERUL. Nu are legătură cu comportamentul.",
    ),
    flu: item(
      "Gripă sezonieră",
      ["Gripă sezonieră"],
      "Gripa nu este doar o răceală. Poate fi periculoasă pentru copiii mici, vârstnici și femeile însărcinate. Vaccinul se actualizează în fiecare an.",
      "Ușoară durere în braț și uneori febră mică pentru o zi. NU poți face gripă de la vaccinul gripal.",
      "MIT: 'Vaccinul antigripal îți dă gripă.' ADEVĂR: Este imposibil. Vaccinul nu conține virus viu.",
    ),
  },
  hu: {
    bcg: item(
      "BCG (tuberkulózis)",
      ["Tuberkulózis (TBC)"],
      "Ez az oltás megtanítja a baba szervezetét a tuberkulózis elleni védekezésre - ez egy súlyos, levegőben terjedő tüdőbetegség. Egy kis karba adott injekció évekre védelmet ad.",
      "Az oltás helyén kis csomó vagy heg lehet a karon. Ez normális, és azt jelzi, hogy az oltás működik.",
      "TÉVHIT: 'A TBC már nem létezik.' IGAZSÁG: A TBC ma is sok embert megöl minden évben. Zsúfolt körülmények között gyorsan terjed.",
    ),
    hepb: item(
      "Hepatitis B",
      ["Hepatitis B (májbetegség)"],
      "Megvédi a májat egy olyan vírustól, amely élethosszig tartó károsodást és rákot okozhat. Születéskor adják, mert a csecsemők a legvédtelenebbek.",
      "Enyhe fájdalom az injekció helyén. Néhány baba egy napig nyűgösebb lehet. Nem súlyos.",
      "TÉVHIT: 'A babám túl kicsi az újszülöttkori oltáshoz.' IGAZSÁG: Az újszülöttek a legsebezhetőbbek. Minél korábban védjük meg őket, annál biztonságosabb.",
    ),
    dtap: item(
      "DTaP (diftéria, tetanusz, szamárköhögés)",
      ["Diftéria", "Tetanusz", "Szamárköhögés"],
      "Ez az oltás egyszerre három betegség ellen véd. A diftéria elzárhatja a torkot, a tetanusz görcsbe húzza az izmokat, a szamárköhögés pedig fulladást okozhat a babáknál.",
      "Az injekció helye piros és fájdalmas lehet. A gyermek 1-2 napig enyhén lázas lehet.",
      "TÉVHIT: 'Ezek a betegségek már nincsenek, minek oltani?' IGAZSÁG: Azért ritkák, mert oltunk. Ha a közösségek abbahagyják az oltást, a betegségek visszatérnek.",
    ),
    ipv: item(
      "Polio (IPV)",
      ["Polio (bénulás)"],
      "A polio egy vírus, amely órák alatt végleges bénulást okozhat a gyermek lábában. Ez az oltás szinte eltüntette a betegséget a világ nagy részéről.",
      "Nagyon enyhe. Legfeljebb egy kis bőrpír az injekció helyén.",
      "TÉVHIT: 'A polio eltűnt, erre már nincs szükség.' IGAZSÁG: Európában azért tűnt el, mert oltunk. Egy oltatlan utazó visszahozhatja.",
    ),
    mmr: item(
      "MMR (kanyaró, mumpsz, rubeola)",
      ["Kanyaró", "Mumpsz", "Rubeola"],
      "A kanyaró rendkívül fertőző, és agykárosodást vagy halált is okozhat. Ez az oltás egyetlen injekcióval mindhárom betegség ellen véd.",
      "Körülbelül 10 gyerekből 1-nél enyhe láz és kiütés jelentkezhet 7-10 nappal később. Ez azt jelzi, hogy a szervezet tanul védekezni.",
      "TÉVHIT: 'Az MMR autizmust okoz.' IGAZSÁG: Nagy vizsgálatok nem találtak kapcsolatot az autizmussal. A kanyaró viszont ölhet.",
    ),
    pneumo: item(
      "Pneumococcus (PCV13)",
      ["Tüdőgyulladás", "Agyhártyagyulladás", "Véráramfertőzések"],
      "Megvéd azoktól a baktériumoktól, amelyek tüdőgyulladást, agyhártyagyulladást és súlyos vérfertőzést okoznak. Ezek a kisgyermekek legnagyobb veszélyei közé tartoznak.",
      "Enyhe láz, nyűgösség és fájdalom az oltás helyén 1-2 napig.",
      "TÉVHIT: 'A gyerekek a túl sok oltástól lesznek betegek.' IGAZSÁG: A gyermek immunrendszere naponta több ezer kórokozóval találkozik. Néhány oltás nem túl sok számára.",
    ),
    rota: item(
      "Rotavírus",
      ["Súlyos hasmenés és hányás csecsemőknél"],
      "Szájon át adott cseppek formájában kapják, nem injekcióként. Megvéd a súlyos hasmenést és kiszáradást okozó vírustól.",
      "Nagyon enyhe. Néha egy kis nyűgösség vagy enyhe hasmenés jelentkezhet.",
      "TÉVHIT: 'A hasmenés normális a babáknál, nem kell oltás.' IGAZSÁG: A rotavírusos hasmenés gyors kiszáradást okozhat, és veszélyes lehet.",
    ),
    varicella: item(
      "Varicella (bárányhimlő)",
      ["Bárányhimlő"],
      "A bárányhimlő enyhének tűnhet, mégis súlyos bőrfertőzést, tüdőgyulladást vagy agyi szövődményt okozhat. Az oltás a legtöbb esetet megelőzi.",
      "Enyhe fájdalom. Ritkán néhány bárányhimlőszerű pötty jelenhet meg az oltás helye közelében.",
      "TÉVHIT: 'Jobb természetesen átesni a bárányhimlőn.' IGAZSÁG: A természetes fertőzés súlyos szövődményeket okozhat, és később övsömörhöz vezethet.",
    ),
    hpv: item(
      "HPV (humán papillomavírus)",
      ["Méhnyakrák", "Más daganatok"],
      "Ez az oltás rákot előz meg. Általában még azelőtt adják, hogy a tinédzser kapcsolatba kerülne a vírussal.",
      "Fájó kar, néha enyhe fejfájás vagy szédülés. Nagyon biztonságos.",
      "TÉVHIT: 'Ez az oltás szexuális aktivitásra bátorít.' IGAZSÁG: Ez az oltás a RÁKOT előzi meg. Semmi köze a viselkedéshez.",
    ),
    flu: item(
      "Influenza (szezonális influenza)",
      ["Szezonális influenza"],
      "Az influenza nem egyszerű megfázás. A kisgyermekekre, idősekre és várandós nőkre különösen veszélyes lehet. Az oltást évente frissítik.",
      "Enyhe karfájdalom és néha alacsony láz egy napig. Az influenzaoltástól NEM lehet influenzát kapni.",
      "TÉVHIT: 'Az influenzaoltás influenzát okoz.' IGAZSÁG: Ez lehetetlen. Az oltás nem tartalmaz élő vírust.",
    ),
  },
  sk: {
    bcg: item(
      "BCG (tuberkulóza)",
      ["Tuberkulóza (TB)"],
      "Táto vakcína učí telo bábätka bojovať proti tuberkulóze - vážnej pľúcnej chorobe, ktorá sa šíri vzduchom. Jedna malá injekcia do ruky chráni na roky.",
      "Na ramene sa môže objaviť malá hrčka alebo jazva. Je to normálne a znamená to, že vakcína funguje.",
      "MÝTUS: 'Tuberkulóza už neexistuje.' PRAVDA: Tuberkulóza stále každý rok zabíja veľa ľudí. V preplnených podmienkach sa šíri rýchlo.",
    ),
    hepb: item(
      "Hepatitída B",
      ["Hepatitída B (ochorenie pečene)"],
      "Chráni pečeň pred vírusom, ktorý môže spôsobiť celoživotné poškodenie a rakovinu. Dáva sa pri narodení, lebo bábätká sú najzraniteľnejšie.",
      "Mierna bolesť v mieste vpichu. Niektoré bábätká sú deň trochu nepokojné. Nič vážne.",
      "MÝTUS: 'Moje bábätko je na vakcínu pri narodení príliš malé.' PRAVDA: Novorodenci sú najzraniteľnejší. Čím skôr ich chránime, tým bezpečnejšie sú.",
    ),
    dtap: item(
      "DTaP (záškrt, tetanus, čierny kašeľ)",
      ["Záškrt", "Tetanus", "Čierny kašeľ"],
      "Táto vakcína chráni proti trom chorobám naraz. Záškrt môže upchať hrdlo, tetanus bolestivo stiahne svaly a čierny kašeľ môže bábätku zastaviť dych.",
      "Miesto vpichu môže byť červené a citlivé. Dieťa môže mať 1-2 dni miernu horúčku.",
      "MÝTUS: 'Tieto choroby už nie sú, načo očkovať?' PRAVDA: Sú zriedkavé práve preto, že očkujeme. Keď sa prestane očkovať, vrátia sa.",
    ),
    ipv: item(
      "Polio (IPV)",
      ["Polio (obrna)"],
      "Polio je vírus, ktorý môže dieťaťu za pár hodín natrvalo ochromiť nohy. Táto vakcína chorobu takmer odstránila z veľkej časti sveta.",
      "Veľmi mierne. Niekedy len malé začervenanie v mieste vpichu.",
      "MÝTUS: 'Polio zmizlo, túto vakcínu netreba.' PRAVDA: V Európe zmizlo práve vďaka očkovaniu. Nezaočkovaný cestujúci ho môže priniesť späť.",
    ),
    mmr: item(
      "MMR (osýpky, mumps, ružienka)",
      ["Osýpky", "Mumps", "Ružienka"],
      "Osýpky sú mimoriadne nákazlivé a môžu poškodiť mozog alebo zabiť. Táto vakcína chráni proti všetkým trom chorobám naraz.",
      "Asi 1 z 10 detí môže mať 7-10 dní po očkovaní miernu horúčku a vyrážku. Znamená to, že telo sa učí brániť.",
      "MÝTUS: 'MMR spôsobuje autizmus.' PRAVDA: Veľké štúdie nepreukázali žiadnu súvislosť s autizmom. Osýpky však zabíjajú.",
    ),
    pneumo: item(
      "Pneumokoková vakcína (PCV13)",
      ["Zápal pľúc", "Meningitída", "Infekcie krvi"],
      "Chráni pred baktériami, ktoré spôsobujú zápal pľúc, meningitídu a ťažké infekcie krvi. Pre malé deti sú to jedny z najnebezpečnejších chorôb.",
      "Mierna horúčka, nepokoj a bolesť v mieste vpichu 1-2 dni.",
      "MÝTUS: 'Deti ochorejú z príliš veľa vakcín.' PRAVDA: Detská imunita sa denne stretáva s tisícmi mikróbov. Niekoľko vakcín pre ňu nie je priveľa.",
    ),
    rota: item(
      "Rotavírus",
      ["Ťažká hnačka a vracanie u bábätiek"],
      "Podáva sa ako kvapky do úst, nie ako injekcia. Chráni pred vírusom, ktorý spôsobuje ťažkú hnačku a odvodnenie.",
      "Veľmi mierne. Niekedy trochu nepokoja alebo mierna hnačka.",
      "MÝTUS: 'Hnačka je u bábätiek normálna, vakcínu netreba.' PRAVDA: Rotavírusová hnačka môže rýchlo spôsobiť nebezpečné odvodnenie.",
    ),
    varicella: item(
      "Varicella (ovčie kiahne)",
      ["Ovčie kiahne"],
      "Ovčie kiahne sa môžu zdať mierne, ale môžu spôsobiť vážnu infekciu kože, zápal pľúc alebo komplikácie v mozgu. Vakcína zabráni väčšine prípadov.",
      "Mierna bolesť. Zriedka sa objaví pár bodiek podobných kiahňam pri mieste vpichu.",
      "MÝTUS: 'Je lepšie dostať ovčie kiahne prirodzene.' PRAVDA: Prirodzená infekcia môže mať vážne komplikácie a neskôr spôsobiť pásový opar.",
    ),
    hpv: item(
      "HPV (ľudský papilomavírus)",
      ["Rakovina krčka maternice", "Iné druhy rakoviny"],
      "Táto vakcína predchádza rakovine. Podáva sa ešte predtým, ako sa dospievajúci stretnú s vírusom.",
      "Boľavá ruka, niekedy krátka bolesť hlavy alebo závrat. Je veľmi bezpečná.",
      "MÝTUS: 'Táto vakcína podporuje sexuálnu aktivitu.' PRAVDA: Táto vakcína predchádza RAKOVINE. Nesúvisí so správaním.",
    ),
    flu: item(
      "Chrípka",
      ["Sezónna chrípka"],
      "Chrípka nie je len nádcha. Môže byť nebezpečná pre malé deti, starších ľudí a tehotné ženy. Vakcína sa každý rok aktualizuje.",
      "Mierna bolesť ruky a niekedy nízka horúčka na jeden deň. Z vakcíny NEMÔŽETE dostať chrípku.",
      "MÝTUS: 'Vakcína proti chrípke spôsobí chrípku.' PRAVDA: To nie je možné. Vakcína neobsahuje živý vírus.",
    ),
  },
  cs: {
    bcg: item(
      "BCG (tuberkulóza)",
      ["Tuberkulóza (TB)"],
      "Tato vakcína učí tělo miminka bojovat proti tuberkulóze - závažné plicní nemoci, která se šíří vzduchem. Jedna malá injekce do paže chrání na roky.",
      "Na paži se může objevit malý hrbolek nebo jizva. Je to normální a znamená to, že vakcína funguje.",
      "MÝTUS: 'Tuberkulóza už neexistuje.' PRAVDA: Tuberkulóza stále každý rok zabíjí mnoho lidí. V přeplněných podmínkách se šíří rychle.",
    ),
    hepb: item(
      "Hepatitida B",
      ["Hepatitida B (onemocnění jater)"],
      "Chrání játra před virem, který může způsobit celoživotní poškození a rakovinu. Dává se při narození, protože novorozenci jsou nejzranitelnější.",
      "Mírná bolest v místě vpichu. Některá miminka jsou den trochu neklidná. Nic vážného.",
      "MÝTUS: 'Moje miminko je na vakcínu při narození příliš malé.' PRAVDA: Novorozenci jsou nejzranitelnější. Čím dříve je ochráníme, tím lépe.",
    ),
    dtap: item(
      "DTaP (záškrt, tetanus, černý kašel)",
      ["Záškrt", "Tetanus", "Černý kašel"],
      "Tato vakcína chrání proti třem nemocem najednou. Záškrt může ucpat hrdlo, tetanus bolestivě stáhne svaly a černý kašel může dítěti vzít dech.",
      "Místo vpichu může být červené a bolestivé. Dítě může mít 1-2 dny mírnou horečku.",
      "MÝTUS: 'Tyto nemoci už nejsou, proč očkovat?' PRAVDA: Jsou vzácné právě proto, že očkujeme. Když se přestane očkovat, vrátí se.",
    ),
    ipv: item(
      "Polio (IPV)",
      ["Polio (obrna)"],
      "Polio je virus, který může během několika hodin trvale ochromit dětské nohy. Tato vakcína nemoc téměř odstranila z velké části světa.",
      "Velmi mírné. Někdy jen malé zarudnutí v místě vpichu.",
      "MÝTUS: 'Polio zmizelo, tuto vakcínu už nepotřebujeme.' PRAVDA: V Evropě zmizelo právě díky očkování. Neočkovaný cestovatel ho může vrátit.",
    ),
    mmr: item(
      "MMR (spalničky, příušnice, zarděnky)",
      ["Spalničky", "Příušnice", "Zarděnky"],
      "Spalničky jsou velmi nakažlivé a mohou poškodit mozek nebo zabít. Tato vakcína chrání proti všem třem nemocem jednou dávkou.",
      "Asi 1 z 10 dětí může mít 7-10 dní po očkování mírnou horečku a vyrážku. Znamená to, že se tělo učí bránit.",
      "MÝTUS: 'MMR způsobuje autismus.' PRAVDA: Velké studie neprokázaly žádnou souvislost s autismem. Spalničky ale zabíjejí.",
    ),
    pneumo: item(
      "Pneumokoková vakcína (PCV13)",
      ["Zápal plic", "Meningitida", "Infekce krve"],
      "Chrání proti bakteriím, které způsobují zápal plic, meningitidu a těžké infekce krve. Pro malé děti patří mezi nejnebezpečnější infekce.",
      "Mírná horečka, neklid a bolest v místě vpichu 1-2 dny.",
      "MÝTUS: 'Děti onemocní z příliš mnoha vakcín.' PRAVDA: Dětská imunita se denně setkává s tisíci mikrobů. Několik vakcín pro ni není moc.",
    ),
    rota: item(
      "Rotavirus",
      ["Těžký průjem a zvracení u miminek"],
      "Podává se jako kapky do úst, ne injekcí. Chrání před virem, který způsobuje těžký průjem a dehydrataci.",
      "Velmi mírné. Někdy trochu neklidu nebo lehký průjem.",
      "MÝTUS: 'Průjem je u miminek normální, vakcínu nepotřebují.' PRAVDA: Rotavirový průjem může dítě rychle nebezpečně odvodnit.",
    ),
    varicella: item(
      "Varicella (plané neštovice)",
      ["Plané neštovice"],
      "Plané neštovice mohou vypadat lehce, ale mohou způsobit závažnou kožní infekci, zápal plic nebo komplikace v mozku. Vakcína většině případů zabrání.",
      "Mírná bolest. Vzácně se objeví pár pupínků podobných neštovicím u místa vpichu.",
      "MÝTUS: 'Je lepší prodělat plané neštovice přirozeně.' PRAVDA: Přirozená infekce může způsobit vážné komplikace a později pásový opar.",
    ),
    hpv: item(
      "HPV (lidský papilomavirus)",
      ["Rakovina děložního čípku", "Jiné druhy rakoviny"],
      "Tato vakcína předchází rakovině. Podává se ještě předtím, než se dospívající setkají s virem.",
      "Bolest paže, někdy krátká bolest hlavy nebo závrať. Je velmi bezpečná.",
      "MÝTUS: 'Tato vakcína podporuje sexuální aktivitu.' PRAVDA: Tato vakcína předchází RAKOVINĚ. Nemá nic společného s chováním.",
    ),
    flu: item(
      "Chřipka",
      ["Sezónní chřipka"],
      "Chřipka není jen nachlazení. Může být nebezpečná pro malé děti, seniory a těhotné ženy. Vakcína se každý rok upravuje.",
      "Mírná bolest paže a někdy nízká horečka na jeden den. Z vakcíny proti chřipce NEMŮŽETE dostat chřipku.",
      "MÝTUS: 'Vakcína proti chřipce vám dá chřipku.' PRAVDA: To není možné. Vakcína neobsahuje živý virus.",
    ),
  },
  bg: {
    bcg: item(
      "BCG (туберкулоза)",
      ["Туберкулоза (TB)"],
      "Тази ваксина учи тялото на бебето да се бори с туберкулозата - тежка белодробна болест, която се предава по въздуха. Една малка инжекция в ръката пази с години.",
      "Може да се появи малка бучка или белег на мястото на убождането. Това е нормално и показва, че ваксината действа.",
      "МИТ: 'Туберкулозата вече я няма.' ИСТИНА: Туберкулозата още убива много хора всяка година. В пренаселени условия се разпространява бързо.",
    ),
    hepb: item(
      "Хепатит B",
      ["Хепатит B (чернодробно заболяване)"],
      "Пази черния дроб от вирус, който може да причини трайно увреждане и рак. Дава се при раждането, защото новородените са най-уязвими.",
      "Лека болка на мястото на инжекцията. Някои бебета са малко неспокойни за ден. Нищо сериозно.",
      "МИТ: 'Бебето ми е твърде малко за ваксина при раждане.' ИСТИНА: Новородените са най-уязвими. Колкото по-рано ги защитим, толкова по-безопасно е.",
    ),
    dtap: item(
      "DTaP (дифтерия, тетанус, коклюш)",
      ["Дифтерия", "Тетанус", "Коклюш"],
      "Тази ваксина пази от три болести наведнъж. Дифтерията може да запуши гърлото, тетанусът стяга болезнено мускулите, а коклюшът може да остави бебето без въздух.",
      "Мястото на убождането може да е зачервено и болезнено. Детето може да има лека температура 1-2 дни.",
      "МИТ: 'Тези болести вече ги няма, защо да ваксинираме?' ИСТИНА: Те са редки именно защото ваксинираме. Когато хората спрат, болестите се връщат.",
    ),
    ipv: item(
      "Полио (IPV)",
      ["Полио (парализа)"],
      "Полиото е вирус, който може за часове да парализира краката на дете завинаги. Тази ваксина почти премахна болестта в много части на света.",
      "Много леки реакции. Понякога само леко зачервяване на мястото.",
      "МИТ: 'Полиото изчезна, тази ваксина не ни трябва.' ИСТИНА: В Европа изчезна точно заради ваксината. Един неваксиниран пътник може да го върне.",
    ),
    mmr: item(
      "MMR (морбили, паротит, рубеола)",
      ["Морбили", "Паротит", "Рубеола"],
      "Морбилите са изключително заразни и могат да увредят мозъка или да убият. Тази ваксина пази от трите болести с една инжекция.",
      "Около 1 на 10 деца може да има лека температура и обрив 7-10 дни по-късно. Това показва, че тялото се учи да се защитава.",
      "МИТ: 'MMR причинява аутизъм.' ИСТИНА: Големи проучвания не показват връзка с аутизъм. Морбилите обаче убиват.",
    ),
    pneumo: item(
      "Пневмококова ваксина (PCV13)",
      ["Пневмония", "Менингит", "Инфекции в кръвта"],
      "Пази от бактерии, които причиняват пневмония, менингит и тежки инфекции в кръвта. Това са сред най-опасните болести за малките деца.",
      "Лека температура, раздразнителност и болка на мястото на инжекцията за 1-2 дни.",
      "МИТ: 'Децата се разболяват от твърде много ваксини.' ИСТИНА: Имунната система на детето среща хиляди микроби всеки ден. Няколко ваксини не са прекалено много.",
    ),
    rota: item(
      "Ротавирус",
      ["Тежка диария и повръщане при бебета"],
      "Дава се като капки в устата, не като инжекция. Пази от вируса, който причинява тежка диария и обезводняване.",
      "Много леки реакции. Понякога малко раздразнителност или лека диария.",
      "МИТ: 'Диарията е нормална при бебетата, не трябва ваксина.' ИСТИНА: Диарията от ротавирус може бързо да обезводни детето и да стане опасна.",
    ),
    varicella: item(
      "Варицела (лещенка)",
      ["Варицела"],
      "Варицелата може да изглежда лека, но понякога причинява тежка кожна инфекция, пневмония или усложнения в мозъка. Ваксината предотвратява повечето случаи.",
      "Лека болка. Рядко излизат няколко шаркоподобни пъпки около мястото на убождане.",
      "МИТ: 'По-добре е да се изкара варицела естествено.' ИСТИНА: Естествената инфекция може да доведе до сериозни усложнения и по-късно до херпес зостер.",
    ),
    hpv: item(
      "HPV (човешки папиломен вирус)",
      ["Рак на шийката на матката", "Други видове рак"],
      "Тази ваксина предпазва от рак. Поставя се преди тийнейджърите да са били изложени на вируса.",
      "Болка в ръката, понякога кратко главоболие или замайване. Много е безопасна.",
      "МИТ: 'Тази ваксина насърчава сексуална активност.' ИСТИНА: Тази ваксина предпазва от РАК. Няма общо с поведение.",
    ),
    flu: item(
      "Грип",
      ["Сезонен грип"],
      "Грипът не е просто настинка. Може да е опасен за малки деца, възрастни хора и бременни жени. Ваксината се обновява всяка година.",
      "Лека болка в ръката и понякога ниска температура за ден. НЕ може да получите грип от противогрипната ваксина.",
      "МИТ: 'Противогрипната ваксина ти причинява грип.' ИСТИНА: Това е невъзможно. Ваксината не съдържа жив вирус.",
    ),
  },
  sr: {
    bcg: item(
      "BCG (туберкулоза)",
      ["Туберкулоза (ТБ)"],
      "Ова вакцина учи бебин организам да се бори против туберкулозе - тешке болести плућа која се преноси ваздухом. Једна мала инјекција у руку штити годинама.",
      "На руци може да се појави мала квржица или ожиљак. То је нормално и значи да вакцина делује.",
      "МИТ: 'Туберкулозе више нема.' ИСТИНА: Туберкулоза и даље сваке године убија много људи. У пренатрпаним условима брзо се шири.",
    ),
    hepb: item(
      "Хепатитис B",
      ["Хепатитис B (болест јетре)"],
      "Штити јетру од вируса који може да изазове трајно оштећење и рак. Даје се на рођењу јер су новорођенчад најосетљивија.",
      "Блага бол на месту убода. Неке бебе су мало нервозне један дан. Ништа озбиљно.",
      "МИТ: 'Моја беба је сувише мала за вакцину на рођењу.' ИСТИНА: Новорођенчад су најугроженија. Што их раније заштитимо, то боље.",
    ),
    dtap: item(
      "DTaP (дифтерија, тетанус, велики кашаљ)",
      ["Дифтерија", "Тетанус", "Велики кашаљ"],
      "Ова вакцина штити од три болести одједном. Дифтерија може да затвори грло, тетанус укочи мишиће, а велики кашаљ може да остави бебу без даха.",
      "Место убода може бити црвено и болно. Дете може имати благу температуру 1-2 дана.",
      "МИТ: 'Ове болести више не постоје, зашто вакцинисати?' ИСТИНА: Ретке су баш зато што вакцинишемо. Кад се стане, болести се враћају.",
    ),
    ipv: item(
      "Полио (IPV)",
      ["Полио (парализа)"],
      "Полио је вирус који за неколико сати може трајно да паралише ноге детета. Ова вакцина је скоро уклонила болест из многих делова света.",
      "Врло благе реакције. Понекад само мало црвенила на месту убода.",
      "МИТ: 'Полио је нестао, ова вакцина више не треба.' ИСТИНА: У Европи је нестао зато што смо вакцинисали. Невакцинисан путник може да га врати.",
    ),
    mmr: item(
      "MMR (мале богиње, заушке, рубеола)",
      ["Мале богиње", "Заушке", "Рубеола"],
      "Мале богиње су веома заразне и могу да оштете мозак или убију. Ова вакцина штити од све три болести једном дозом.",
      "Око 1 од 10 деце може добити благу температуру и осип 7-10 дана касније. То значи да тело учи да се брани.",
      "МИТ: 'MMR изазива аутизам.' ИСТИНА: Велике студије нису показале везу са аутизмом. Мале богиње, напротив, могу да убију.",
    ),
    pneumo: item(
      "Пнеумококна вакцина (PCV13)",
      ["Упала плућа", "Менингитис", "Инфекције крви"],
      "Штити од бактерија које изазивају упалу плућа, менингитис и тешке инфекције крви. То су неке од најопаснијих болести за малу децу.",
      "Блага температура, нервоза и бол на месту убода 1-2 дана.",
      "МИТ: 'Деца се разболе од превише вакцина.' ИСТИНА: Дечји имуни систем сваког дана сусреће хиљаде микроба. Неколико вакцина није превише.",
    ),
    rota: item(
      "Ротавирус",
      ["Тешка дијареја и повраћање код беба"],
      "Даје се као капи у уста, не као инјекција. Штити од вируса који изазива тешку дијареју и дехидратацију.",
      "Врло благе реакције. Понекад мало нервозе или блага дијареја.",
      "МИТ: 'Дијареја је нормална код беба, не треба вакцина.' ИСТИНА: Ротавирусна дијареја може брзо опасно да исуши дете.",
    ),
    varicella: item(
      "Варицела (овчије богиње)",
      ["Овчије богиње"],
      "Овчије богиње могу деловати благо, али могу изазвати тешку инфекцију коже, упалу плућа или компликације на мозгу. Вакцина спречава већину случајева.",
      "Блага бол. Ретко се појави неколико богињастих тачкица око места убода.",
      "МИТ: 'Боље је природно прележати овчије богиње.' ИСТИНА: Природна инфекција може дати озбиљне компликације и касније изазвати херпес зостер.",
    ),
    hpv: item(
      "HPV (хумани папилома вирус)",
      ["Рак грлића материце", "Други облици рака"],
      "Ова вакцина спречава рак. Даје се пре него што тинејџери дођу у контакт са вирусом.",
      "Болна рука, понекад кратка главобоља или вртоглавица. Веома је безбедна.",
      "МИТ: 'Ова вакцина подстиче сексуалну активност.' ИСТИНА: Ова вакцина спречава РАК. Нема везе са понашањем.",
    ),
    flu: item(
      "Грип",
      ["Сезонски грип"],
      "Грип није само прехлада. Може бити опасан за малу децу, старије људе и труднице. Вакцина се ажурира сваке године.",
      "Блага бол у руци и понекад ниска температура један дан. Од ове вакцине НЕ можете добити грип.",
      "МИТ: 'Вакцина против грипа ти даје грип.' ИСТИНА: То је немогуће. Вакцина не садржи жив вирус.",
    ),
  },
  hr: {
    bcg: item(
      "BCG (tuberkuloza)",
      ["Tuberkuloza (TB)"],
      "Ovo cjepivo uči bebin organizam kako se boriti protiv tuberkuloze - teške plućne bolesti koja se širi zrakom. Jedna mala injekcija u ruku štiti godinama.",
      "Na ruci se može pojaviti mala kvržica ili ožiljak. To je normalno i znači da cjepivo djeluje.",
      "MIT: 'Tuberkuloze više nema.' ISTINA: Tuberkuloza i dalje svake godine ubija mnoge ljude. U prenapučenim uvjetima brzo se širi.",
    ),
    hepb: item(
      "Hepatitis B",
      ["Hepatitis B (bolest jetre)"],
      "Štiti jetru od virusa koji može uzrokovati trajno oštećenje i rak. Daje se pri rođenju jer su novorođenčad najugroženija.",
      "Blaga bol na mjestu uboda. Neke bebe su dan malo nervoznije. Ništa ozbiljno.",
      "MIT: 'Moja je beba premala za cjepivo pri rođenju.' ISTINA: Novorođenčad su najranjivija. Što ih ranije zaštitimo, to bolje.",
    ),
    dtap: item(
      "DTaP (difterija, tetanus, hripavac)",
      ["Difterija", "Tetanus", "Hripavac"],
      "Ovo cjepivo štiti od tri bolesti odjednom. Difterija može zatvoriti grlo, tetanus ukoči mišiće, a hripavac može bebu ostaviti bez zraka.",
      "Mjesto uboda može biti crveno i bolno. Dijete može imati blagu temperaturu 1-2 dana.",
      "MIT: 'Te bolesti više ne postoje, zašto cijepiti?' ISTINA: Rijetke su upravo zato što cijepimo. Kad se prestane, bolesti se vraćaju.",
    ),
    ipv: item(
      "Polio (IPV)",
      ["Polio (paraliza)"],
      "Polio je virus koji u nekoliko sati može trajno paralizirati dječje noge. Ovo cjepivo gotovo je uklonilo bolest iz mnogih dijelova svijeta.",
      "Vrlo blage reakcije. Ponekad samo malo crvenila na mjestu uboda.",
      "MIT: 'Polio je nestao, ovo cjepivo više ne trebamo.' ISTINA: U Europi je nestao upravo zbog cijepljenja. Necijepljen putnik može ga vratiti.",
    ),
    mmr: item(
      "MMR (ospice, zaušnjaci, rubeola)",
      ["Ospice", "Zaušnjaci", "Rubeola"],
      "Ospice su vrlo zarazne i mogu oštetiti mozak ili ubiti. Ovo cjepivo štiti od sve tri bolesti jednom dozom.",
      "Oko 1 od 10 djece može imati blagu temperaturu i osip 7-10 dana kasnije. To znači da tijelo uči obranu.",
      "MIT: 'MMR uzrokuje autizam.' ISTINA: Velike studije nisu pokazale nikakvu vezu s autizmom. Ospice, s druge strane, ubijaju.",
    ),
    pneumo: item(
      "Pneumokokno cjepivo (PCV13)",
      ["Upala pluća", "Meningitis", "Infekcije krvi"],
      "Štiti od bakterija koje uzrokuju upalu pluća, meningitis i teške infekcije krvi. To su među najopasnijim bolestima za malu djecu.",
      "Blaga temperatura, razdražljivost i bol na mjestu uboda 1-2 dana.",
      "MIT: 'Djeca se razbole od previše cjepiva.' ISTINA: Dječji imunosni sustav svakodnevno susreće tisuće mikroba. Nekoliko cjepiva nije previše.",
    ),
    rota: item(
      "Rotavirus",
      ["Teški proljev i povraćanje kod beba"],
      "Daje se kao kapi u usta, ne kao injekcija. Štiti od virusa koji uzrokuje teški proljev i dehidraciju.",
      "Vrlo blage reakcije. Ponekad malo razdražljivosti ili blagi proljev.",
      "MIT: 'Proljev je normalan kod beba, ne treba cjepivo.' ISTINA: Rotavirusni proljev može brzo opasno isušiti dijete.",
    ),
    varicella: item(
      "Varicella (vodene kozice)",
      ["Vodene kozice"],
      "Vodene kozice mogu izgledati blago, ali mogu uzrokovati tešku infekciju kože, upalu pluća ili komplikacije na mozgu. Cjepivo sprječava većinu slučajeva.",
      "Blaga bol. Rijetko se pojavi nekoliko točkica sličnih kozicama oko mjesta uboda.",
      "MIT: 'Bolje je prirodno preboljeti vodene kozice.' ISTINA: Prirodna infekcija može izazvati ozbiljne komplikacije i kasnije herpes zoster.",
    ),
    hpv: item(
      "HPV (humani papiloma virus)",
      ["Rak vrata maternice", "Druge vrste raka"],
      "Ovo cjepivo sprječava rak. Daje se prije nego što tinejdžeri dođu u kontakt s virusom.",
      "Bolna ruka, ponekad kratka glavobolja ili vrtoglavica. Vrlo je sigurno.",
      "MIT: 'Ovo cjepivo potiče seksualnu aktivnost.' ISTINA: Ovo cjepivo sprječava RAK. Nema veze s ponašanjem.",
    ),
    flu: item(
      "Gripa",
      ["Sezonska gripa"],
      "Gripa nije samo prehlada. Može biti opasna za malu djecu, starije osobe i trudnice. Cjepivo se svake godine ažurira.",
      "Blaga bol u ruci i ponekad niska temperatura jedan dan. Od ovog cjepiva NE možete dobiti gripu.",
      "MIT: 'Cjepivo protiv gripe daje gripu.' ISTINA: To je nemoguće. Cjepivo ne sadrži živi virus.",
    ),
  },
  bs: {
    bcg: item(
      "BCG (tuberkuloza)",
      ["Tuberkuloza (TB)"],
      "Ova vakcina uči bebin organizam da se bori protiv tuberkuloze - teške plućne bolesti koja se širi zrakom. Jedna mala injekcija u ruku štiti godinama.",
      "Na ruci se može pojaviti mala kvržica ili ožiljak. To je normalno i znači da vakcina djeluje.",
      "MIT: 'Tuberkuloze više nema.' ISTINA: Tuberkuloza i dalje svake godine ubija mnogo ljudi. U prenapučenim uslovima brzo se širi.",
    ),
    hepb: item(
      "Hepatitis B",
      ["Hepatitis B (bolest jetre)"],
      "Štiti jetru od virusa koji može izazvati trajno oštećenje i rak. Daje se pri rođenju jer su novorođenčad najugroženija.",
      "Blaga bol na mjestu uboda. Neke bebe su dan malo nervoznije. Ništa ozbiljno.",
      "MIT: 'Moja beba je premala za vakcinu pri rođenju.' ISTINA: Novorođenčad su najranjivija. Što ih ranije zaštitimo, to bolje.",
    ),
    dtap: item(
      "DTaP (difterija, tetanus, hripavac)",
      ["Difterija", "Tetanus", "Hripavac"],
      "Ova vakcina štiti od tri bolesti odjednom. Difterija može zatvoriti grlo, tetanus ukoči mišiće, a hripavac može bebu ostaviti bez zraka.",
      "Mjesto uboda može biti crveno i bolno. Dijete može imati blagu temperaturu 1-2 dana.",
      "MIT: 'Te bolesti više ne postoje, zašto vakcinisati?' ISTINA: Rijetke su baš zato što vakcinišemo. Kad se prestane, bolesti se vraćaju.",
    ),
    ipv: item(
      "Polio (IPV)",
      ["Polio (paraliza)"],
      "Polio je virus koji u nekoliko sati može trajno paralizirati dječije noge. Ova vakcina gotovo je uklonila bolest iz mnogih dijelova svijeta.",
      "Vrlo blage reakcije. Ponekad samo malo crvenila na mjestu uboda.",
      "MIT: 'Polio je nestao, ova vakcina više ne treba.' ISTINA: U Evropi je nestao upravo zbog vakcinacije. Nevaksinisan putnik može ga vratiti.",
    ),
    mmr: item(
      "MMR (ospice, zaušnjaci, rubeola)",
      ["Ospice", "Zaušnjaci", "Rubeola"],
      "Ospice su vrlo zarazne i mogu oštetiti mozak ili ubiti. Ova vakcina štiti od sve tri bolesti jednom dozom.",
      "Oko 1 od 10 djece može imati blagu temperaturu i osip 7-10 dana kasnije. To znači da tijelo uči odbranu.",
      "MIT: 'MMR uzrokuje autizam.' ISTINA: Velike studije nisu pokazale nikakvu vezu s autizmom. Ospice, s druge strane, ubijaju.",
    ),
    pneumo: item(
      "Pneumokokna vakcina (PCV13)",
      ["Upala pluća", "Meningitis", "Infekcije krvi"],
      "Štiti od bakterija koje izazivaju upalu pluća, meningitis i teške infekcije krvi. To su među najopasnijim bolestima za malu djecu.",
      "Blaga temperatura, razdražljivost i bol na mjestu uboda 1-2 dana.",
      "MIT: 'Djeca se razbole od previše vakcina.' ISTINA: Dječiji imuni sistem svakodnevno susreće hiljade mikroba. Nekoliko vakcina nije previše.",
    ),
    rota: item(
      "Rotavirus",
      ["Teški proljev i povraćanje kod beba"],
      "Daje se kao kapi u usta, ne kao injekcija. Štiti od virusa koji izaziva teški proljev i dehidraciju.",
      "Vrlo blage reakcije. Ponekad malo razdražljivosti ili blagi proljev.",
      "MIT: 'Proljev je normalan kod beba, ne treba vakcina.' ISTINA: Rotavirusni proljev može brzo opasno isušiti dijete.",
    ),
    varicella: item(
      "Varicella (vodene kozice)",
      ["Vodene kozice"],
      "Vodene kozice mogu izgledati blago, ali mogu izazvati tešku infekciju kože, upalu pluća ili komplikacije na mozgu. Vakcina sprečava većinu slučajeva.",
      "Blaga bol. Rijetko se pojavi nekoliko tačkica sličnih kozicama oko mjesta uboda.",
      "MIT: 'Bolje je prirodno preležati vodene kozice.' ISTINA: Prirodna infekcija može izazvati ozbiljne komplikacije i kasnije herpes zoster.",
    ),
    hpv: item(
      "HPV (humani papiloma virus)",
      ["Rak grlića materice", "Druge vrste raka"],
      "Ova vakcina sprečava rak. Daje se prije nego što tinejdžeri dođu u kontakt s virusom.",
      "Bolna ruka, ponekad kratka glavobolja ili vrtoglavica. Vrlo je sigurna.",
      "MIT: 'Ova vakcina podstiče seksualnu aktivnost.' ISTINA: Ova vakcina sprečava RAK. Nema veze s ponašanjem.",
    ),
    flu: item(
      "Gripa",
      ["Sezonska gripa"],
      "Gripa nije samo prehlada. Može biti opasna za malu djecu, starije osobe i trudnice. Vakcina se svake godine ažurira.",
      "Blaga bol u ruci i ponekad niska temperatura jedan dan. Od ove vakcine NE možete dobiti gripu.",
      "MIT: 'Vakcina protiv gripe ti daje gripu.' ISTINA: To je nemoguće. Vakcina ne sadrži živi virus.",
    ),
  },
  mk: {
    bcg: item(
      "BCG (туберкулоза)",
      ["Туберкулоза (ТБ)"],
      "Оваа вакцина го учи телото на бебето да се бори против туберкулозата - тешка белодробна болест што се шири преку воздух. Една мала инјекција во раката штити со години.",
      "Може да се појави мало јазолче или лузна на раката. Тоа е нормално и значи дека вакцината делува.",
      "МИТ: 'Туберкулоза веќе нема.' ВИСТИНА: Туберкулозата и понатаму убива многу луѓе секоја година. Во пренатрупани услови брзо се шири.",
    ),
    hepb: item(
      "Хепатит Б",
      ["Хепатит Б (болест на црниот дроб)"],
      "Го штити црниот дроб од вирус што може да предизвика трајно оштетување и рак. Се дава при раѓање затоа што новороденчињата се најранливи.",
      "Лесна болка на местото на убодот. Некои бебиња се малку понемирни еден ден. Ништо сериозно.",
      "МИТ: 'Моето бебе е премало за вакцина при раѓање.' ВИСТИНА: Новороденчињата се најзагрозени. Колку порано ги заштитиме, толку подобро.",
    ),
    dtap: item(
      "DTaP (дифтерија, тетанус, голема кашлица)",
      ["Дифтерија", "Тетанус", "Голема кашлица"],
      "Оваа вакцина штити од три болести одеднаш. Дифтеријата може да го затвори грлото, тетанусот ги стега мускулите, а големата кашлица може да го остави бебето без здив.",
      "Местото на убодот може да биде црвено и болно. Детето може да има лесна температура 1-2 дена.",
      "МИТ: 'Овие болести веќе не постојат, зошто да вакцинираме?' ВИСТИНА: Ретки се токму затоа што вакцинираме. Кога ќе се прекине, се враќаат.",
    ),
    ipv: item(
      "Полио (IPV)",
      ["Полио (парализа)"],
      "Полиото е вирус што за неколку часа може трајно да ги парализира детските нозе. Оваа вакцина речиси ја отстрани болеста од многу делови на светот.",
      "Многу благи реакции. Понекогаш само малку црвенило на местото на убодот.",
      "МИТ: 'Полиото исчезна, оваа вакцина не ни треба.' ВИСТИНА: Во Европа исчезна токму поради вакцинацијата. Невакциниран патник може да го врати.",
    ),
    mmr: item(
      "MMR (мали сипаници, заушки, рубеола)",
      ["Мали сипаници", "Заушки", "Рубеола"],
      "Малите сипаници се многу заразни и можат да го оштетат мозокот или да убијат. Оваа вакцина штити од сите три болести со една доза.",
      "Околу 1 од 10 деца може да има лесна температура и осип 7-10 дена подоцна. Тоа значи дека телото учи да се брани.",
      "МИТ: 'MMR предизвикува аутизам.' ВИСТИНА: Големи студии не покажале никаква врска со аутизмот. Малите сипаници, напротив, можат да убијат.",
    ),
    pneumo: item(
      "Пневмококна вакцина (PCV13)",
      ["Пневмонија", "Менингитис", "Инфекции во крвта"],
      "Штити од бактерии што предизвикуваат пневмонија, менингитис и тешки инфекции во крвта. Ова се меѓу најопасните болести за малите деца.",
      "Лесна температура, раздразливост и болка на местото на убодот 1-2 дена.",
      "МИТ: 'Децата се разболуваат од премногу вакцини.' ВИСТИНА: Детскиот имун систем секој ден среќава илјадници микроби. Неколку вакцини не се премногу.",
    ),
    rota: item(
      "Ротавирус",
      ["Тешка дијареја и повраќање кај бебиња"],
      "Се дава како капки во уста, не како инјекција. Штити од вирусот што предизвикува тешка дијареја и дехидратација.",
      "Многу благи реакции. Понекогаш малку раздразливост или лесна дијареја.",
      "МИТ: 'Дијарејата е нормална кај бебињата, не треба вакцина.' ВИСТИНА: Ротавирусната дијареја може брзо опасно да го исуши детето.",
    ),
    varicella: item(
      "Варицела (овчи сипаници)",
      ["Овчи сипаници"],
      "Овчите сипаници може да изгледаат лесни, но можат да предизвикаат тешка инфекција на кожата, пневмонија или мозочни компликации. Вакцината спречува најголем дел од случаите.",
      "Лесна болка. Ретко се појавуваат неколку точки слични на сипаници околу местото на убодот.",
      "МИТ: 'Подобро е природно да се прележат овчи сипаници.' ВИСТИНА: Природната инфекција може да донесе сериозни компликации и подоцна херпес зостер.",
    ),
    hpv: item(
      "HPV (хуман папилома вирус)",
      ["Рак на грлото на матката", "Други видови рак"],
      "Оваа вакцина спречува рак. Се дава пред тинејџерите да дојдат во контакт со вирусот.",
      "Болка во раката, понекогаш кратка главоболка или вртоглавица. Многу е безбедна.",
      "МИТ: 'Оваа вакцина поттикнува сексуална активност.' ВИСТИНА: Оваа вакцина спречува РАК. Нема врска со однесувањето.",
    ),
    flu: item(
      "Грип",
      ["Сезонски грип"],
      "Грипот не е само настинка. Може да биде опасен за мали деца, постари лица и бремени жени. Вакцината се ажурира секоја година.",
      "Лесна болка во раката и понекогаш ниска температура еден ден. Од оваа вакцина НЕ можете да добиете грип.",
      "МИТ: 'Вакцината против грип ти дава грип.' ВИСТИНА: Тоа е невозможно. Вакцината не содржи жив вирус.",
    ),
  },
  sl: {
    bcg: item(
      "BCG (tuberkuloza)",
      ["Tuberkuloza (TB)"],
      "To cepivo uči otrokovo telo, kako se boriti proti tuberkulozi - hudi pljučni bolezni, ki se širi po zraku. Ena majhna injekcija v roko ščiti več let.",
      "Na roki se lahko pojavi majhna bunka ali brazgotina. To je normalno in pomeni, da cepivo deluje.",
      "MIT: 'Tuberkuloze ni več.' RESNICA: Tuberkuloza še vedno vsako leto ubije veliko ljudi. V prenatrpanih razmerah se hitro širi.",
    ),
    hepb: item(
      "Hepatitis B",
      ["Hepatitis B (bolezen jeter)"],
      "Ščiti jetra pred virusom, ki lahko povzroči trajno okvaro in raka. Dobi se ob rojstvu, ker so novorojenčki najbolj ranljivi.",
      "Blaga bolečina na mestu vboda. Nekateri dojenčki so en dan nekoliko bolj nemirni. Nič resnega.",
      "MIT: 'Moj dojenček je premajhen za cepljenje ob rojstvu.' RESNICA: Novorojenčki so najbolj ogroženi. Čim prej jih zaščitimo, tem bolje.",
    ),
    dtap: item(
      "DTaP (davica, tetanus, oslovski kašelj)",
      ["Davica", "Tetanus", "Oslovski kašelj"],
      "To cepivo ščiti pred tremi boleznimi naenkrat. Davica lahko zapre grlo, tetanus krčevito zategne mišice, oslovski kašelj pa lahko dojenčku vzame dih.",
      "Mesto vboda je lahko rdeče in boleče. Otrok ima lahko 1-2 dni blago vročino.",
      "MIT: 'Te bolezni ne obstajajo več, zakaj cepiti?' RESNICA: Redke so prav zato, ker cepimo. Ko se cepljenje ustavi, se vrnejo.",
    ),
    ipv: item(
      "Polio (IPV)",
      ["Polio (paraliza)"],
      "Polio je virus, ki lahko v nekaj urah trajno ohromi otrokove noge. To cepivo je bolezen skoraj odstranilo iz mnogih delov sveta.",
      "Zelo blage reakcije. Včasih le malo rdečine na mestu vboda.",
      "MIT: 'Polio je izginil, tega cepiva ne potrebujemo.' RESNICA: V Evropi je izginil prav zaradi cepljenja. Necepljen potnik ga lahko vrne.",
    ),
    mmr: item(
      "MMR (ošpice, mumps, rdečke)",
      ["Ošpice", "Mumps", "Rdečke"],
      "Ošpice so zelo nalezljive in lahko poškodujejo možgane ali ubijejo. To cepivo z eno dozo ščiti pred vsemi tremi boleznimi.",
      "Približno 1 od 10 otrok ima lahko 7-10 dni kasneje blago vročino in izpuščaj. To pomeni, da se telo uči obrambe.",
      "MIT: 'MMR povzroča avtizem.' RESNICA: Velike raziskave niso pokazale nobene povezave z avtizmom. Ošpice pa ubijajo.",
    ),
    pneumo: item(
      "Pnevmokokno cepivo (PCV13)",
      ["Pljučnica", "Meningitis", "Okužbe krvi"],
      "Ščiti pred bakterijami, ki povzročajo pljučnico, meningitis in hude okužbe krvi. To so med najnevarnejšimi boleznimi za majhne otroke.",
      "Blaga vročina, razdražljivost in bolečina na mestu vboda 1-2 dni.",
      "MIT: 'Otroci zbolijo zaradi preveč cepiv.' RESNICA: Otroški imunski sistem vsak dan sreča tisoče mikrobov. Nekaj cepiv ni preveč.",
    ),
    rota: item(
      "Rotavirus",
      ["Huda driska in bruhanje pri dojenčkih"],
      "Daje se kot kapljice v usta, ne kot injekcija. Ščiti pred virusom, ki povzroča hudo drisko in dehidracijo.",
      "Zelo blage reakcije. Včasih malo razdražljivosti ali blaga driska.",
      "MIT: 'Driska je pri dojenčkih normalna, cepivo ni potrebno.' RESNICA: Rotavirusna driska lahko otroka hitro nevarno izsuši.",
    ),
    varicella: item(
      "Varicella (norice)",
      ["Norice"],
      "Norice so lahko videti blage, a lahko povzročijo hudo okužbo kože, pljučnico ali zaplete na možganih. Cepivo prepreči večino primerov.",
      "Blaga bolečina. Redko se okoli mesta vboda pojavi nekaj pikic podobnih noricam.",
      "MIT: 'Bolje je, da otrok norice preboli naravno.' RESNICA: Naravna okužba lahko povzroči resne zaplete in kasneje pasovec.",
    ),
    hpv: item(
      "HPV (humani papilomavirus)",
      ["Rak materničnega vratu", "Druge vrste raka"],
      "To cepivo preprečuje raka. Daje se, preden najstniki pridejo v stik z virusom.",
      "Boleča roka, včasih kratek glavobol ali omotica. Zelo je varno.",
      "MIT: 'To cepivo spodbuja spolno aktivnost.' RESNICA: To cepivo preprečuje RAKA. Nima povezave z vedenjem.",
    ),
    flu: item(
      "Gripa",
      ["Sezonska gripa"],
      "Gripa ni samo prehlad. Lahko je nevarna za majhne otroke, starejše ljudi in nosečnice. Cepivo se vsako leto posodobi.",
      "Blaga bolečina v roki in včasih nizka temperatura en dan. Od tega cepiva NE morete dobiti gripe.",
      "MIT: 'Cepivo proti gripi povzroči gripo.' RESNICA: To ni mogoče. Cepivo ne vsebuje živega virusa.",
    ),
  },
  el: {
    bcg: item(
      "BCG (φυματίωση)",
      ["Φυματίωση (TB)"],
      "Αυτό το εμβόλιο μαθαίνει στο σώμα του μωρού να πολεμά τη φυματίωση - μια σοβαρή νόσο των πνευμόνων που μεταδίδεται από τον αέρα. Μια μικρή ένεση στο χέρι προστατεύει για χρόνια.",
      "Μπορεί να εμφανιστεί ένα μικρό εξόγκωμα ή σημάδι στο χέρι. Αυτό είναι φυσιολογικό και δείχνει ότι το εμβόλιο δουλεύει.",
      "ΜΥΘΟΣ: 'Η φυματίωση δεν υπάρχει πια.' ΑΛΗΘΕΙΑ: Η φυματίωση εξακολουθεί να σκοτώνει πολλούς ανθρώπους κάθε χρόνο. Σε συνθήκες συνωστισμού εξαπλώνεται γρήγορα.",
    ),
    hepb: item(
      "Ηπατίτιδα B",
      ["Ηπατίτιδα B (νόσος του ήπατος)"],
      "Προστατεύει το ήπαρ από έναν ιό που μπορεί να προκαλέσει μόνιμη βλάβη και καρκίνο. Γίνεται στη γέννηση γιατί τα νεογέννητα είναι πιο ευάλωτα.",
      "Ήπιος πόνος στο σημείο της ένεσης. Μερικά μωρά είναι λίγο πιο ανήσυχα για μία μέρα. Τίποτα σοβαρό.",
      "ΜΥΘΟΣ: 'Το μωρό μου είναι πολύ μικρό για εμβόλιο στη γέννηση.' ΑΛΗΘΕΙΑ: Τα νεογέννητα είναι τα πιο ευάλωτα. Όσο νωρίτερα τα προστατεύουμε, τόσο καλύτερα.",
    ),
    dtap: item(
      "DTaP (διφθερίτιδα, τέτανος, κοκκύτης)",
      ["Διφθερίτιδα", "Τέτανος", "Κοκκύτης"],
      "Αυτό το εμβόλιο προστατεύει από τρεις ασθένειες μαζί. Η διφθερίτιδα μπορεί να κλείσει τον λαιμό, ο τέτανος να σφίξει τους μυς και ο κοκκύτης να αφήσει το μωρό χωρίς ανάσα.",
      "Το σημείο της ένεσης μπορεί να είναι κόκκινο και πονεμένο. Το παιδί μπορεί να έχει ήπιο πυρετό για 1-2 μέρες.",
      "ΜΥΘΟΣ: 'Αυτές οι ασθένειες δεν υπάρχουν πια, γιατί να εμβολιάσουμε;' ΑΛΗΘΕΙΑ: Είναι σπάνιες ακριβώς επειδή εμβολιάζουμε. Όταν σταματάμε, επιστρέφουν.",
    ),
    ipv: item(
      "Πολιομυελίτιδα (IPV)",
      ["Πολιομυελίτιδα (παράλυση)"],
      "Η πολιομυελίτιδα είναι ιός που μπορεί μέσα σε ώρες να παραλύσει μόνιμα τα πόδια ενός παιδιού. Αυτό το εμβόλιο σχεδόν εξαφάνισε την ασθένεια από πολλά μέρη του κόσμου.",
      "Πολύ ήπιες αντιδράσεις. Μερικές φορές μόνο λίγο κοκκίνισμα στο σημείο.",
      "ΜΥΘΟΣ: 'Η πολιομυελίτιδα έφυγε, δεν χρειάζεται αυτό το εμβόλιο.' ΑΛΗΘΕΙΑ: Στην Ευρώπη έφυγε ακριβώς επειδή εμβολιάσαμε. Ένας ανεμβολίαστος ταξιδιώτης μπορεί να τη φέρει πίσω.",
    ),
    mmr: item(
      "MMR (ιλαρά, παρωτίτιδα, ερυθρά)",
      ["Ιλαρά", "Παρωτίτιδα", "Ερυθρά"],
      "Η ιλαρά είναι εξαιρετικά μεταδοτική και μπορεί να βλάψει τον εγκέφαλο ή να σκοτώσει. Αυτό το εμβόλιο προστατεύει και από τις τρεις ασθένειες με μία δόση.",
      "Περίπου 1 στα 10 παιδιά μπορεί να έχει ήπιο πυρετό και εξάνθημα 7-10 μέρες αργότερα. Αυτό δείχνει ότι το σώμα μαθαίνει άμυνα.",
      "ΜΥΘΟΣ: 'Το MMR προκαλεί αυτισμό.' ΑΛΗΘΕΙΑ: Μεγάλες μελέτες δεν έδειξαν καμία σχέση με τον αυτισμό. Η ιλαρά όμως σκοτώνει.",
    ),
    pneumo: item(
      "Πνευμονιοκοκκικό εμβόλιο (PCV13)",
      ["Πνευμονία", "Μηνιγγίτιδα", "Λοιμώξεις αίματος"],
      "Προστατεύει από βακτήρια που προκαλούν πνευμονία, μηνιγγίτιδα και σοβαρές λοιμώξεις αίματος. Αυτές είναι από τις πιο επικίνδυνες ασθένειες για μικρά παιδιά.",
      "Ήπιος πυρετός, γκρίνια και πόνος στο σημείο της ένεσης για 1-2 μέρες.",
      "ΜΥΘΟΣ: 'Τα παιδιά αρρωσταίνουν από πολλά εμβόλια.' ΑΛΗΘΕΙΑ: Το ανοσοποιητικό του παιδιού συναντά χιλιάδες μικρόβια κάθε μέρα. Μερικά εμβόλια δεν είναι πολλά.",
    ),
    rota: item(
      "Ροταϊός",
      ["Σοβαρή διάρροια και εμετός στα μωρά"],
      "Δίνεται σαν σταγόνες από το στόμα, όχι σαν ένεση. Προστατεύει από τον ιό που προκαλεί σοβαρή διάρροια και αφυδάτωση.",
      "Πολύ ήπιες αντιδράσεις. Μερικές φορές λίγη ανησυχία ή ήπια διάρροια.",
      "ΜΥΘΟΣ: 'Η διάρροια είναι φυσιολογική στα μωρά, δεν χρειάζεται εμβόλιο.' ΑΛΗΘΕΙΑ: Η διάρροια από ροταϊό μπορεί να αφυδατώσει γρήγορα το παιδί και να γίνει επικίνδυνη.",
    ),
    varicella: item(
      "Ανεμοβλογιά",
      ["Ανεμοβλογιά"],
      "Η ανεμοβλογιά μπορεί να φαίνεται ήπια, αλλά μπορεί να προκαλέσει σοβαρή λοίμωξη δέρματος, πνευμονία ή επιπλοκές στον εγκέφαλο. Το εμβόλιο προλαμβάνει τα περισσότερα περιστατικά.",
      "Ήπιος πόνος. Σπάνια εμφανίζονται λίγα σπυράκια σαν ανεμοβλογιά γύρω από το σημείο της ένεσης.",
      "ΜΥΘΟΣ: 'Καλύτερα να περάσεις ανεμοβλογιά φυσικά.' ΑΛΗΘΕΙΑ: Η φυσική λοίμωξη μπορεί να προκαλέσει σοβαρές επιπλοκές και αργότερα έρπητα ζωστήρα.",
    ),
    hpv: item(
      "HPV (ιός ανθρώπινων θηλωμάτων)",
      ["Καρκίνος τραχήλου μήτρας", "Άλλοι καρκίνοι"],
      "Αυτό το εμβόλιο προλαμβάνει τον καρκίνο. Γίνεται πριν οι έφηβοι εκτεθούν στον ιό.",
      "Πόνος στο χέρι, μερικές φορές σύντομος πονοκέφαλος ή ζάλη. Είναι πολύ ασφαλές.",
      "ΜΥΘΟΣ: 'Αυτό το εμβόλιο ενθαρρύνει τη σεξουαλική δραστηριότητα.' ΑΛΗΘΕΙΑ: Αυτό το εμβόλιο προλαμβάνει τον ΚΑΡΚΙΝΟ. Δεν έχει σχέση με τη συμπεριφορά.",
    ),
    flu: item(
      "Γρίπη",
      ["Εποχική γρίπη"],
      "Η γρίπη δεν είναι απλώς κρυολόγημα. Μπορεί να είναι επικίνδυνη για μικρά παιδιά, ηλικιωμένους και εγκύους. Το εμβόλιο ενημερώνεται κάθε χρόνο.",
      "Ήπιος πόνος στο χέρι και μερικές φορές χαμηλός πυρετός για μία μέρα. ΔΕΝ μπορείτε να πάθετε γρίπη από αυτό το εμβόλιο.",
      "ΜΥΘΟΣ: 'Το εμβόλιο της γρίπης σου δίνει γρίπη.' ΑΛΗΘΕΙΑ: Αυτό είναι αδύνατο. Το εμβόλιο δεν περιέχει ζωντανό ιό.",
    ),
  },
  tr: {
    bcg: item(
      "BCG (verem)",
      ["Verem (TB)"],
      "Bu asi bebeğin vücuduna veremle savaşmayı öğretir - havadan bulaşan ciddi bir akciğer hastalığıdır. Kola yapılan küçük bir iğne yıllarca koruma sağlar.",
      "İğnenin yapıldığı yerde küçük bir kabarcık veya iz olabilir. Bu normaldir ve aşının çalıştığını gösterir.",
      "EFSANE: 'Verem artık yok.' GERÇEK: Verem hâlâ her yıl çok sayıda insanı öldürüyor. Kalabalık koşullarda hızla yayılıyor.",
    ),
    hepb: item(
      "Hepatit B",
      ["Hepatit B (karaciğer hastalığı)"],
      "Karaciğeri, kalıcı hasar ve kansere yol açabilen bir virüsten korur. Yenidoğanlar en savunmasız olduğu için doğumda yapılır.",
      "İğne yerinde hafif ağrı olabilir. Bazı bebekler bir gün biraz huzursuz olabilir. Ciddi değildir.",
      "EFSANE: 'Bebeğim doğumda asi olmak için çok küçük.' GERÇEK: Yenidoğanlar en savunmasız gruptur. Ne kadar erken korursak o kadar iyi.",
    ),
    dtap: item(
      "DTaP (difteri, tetanoz, boğmaca)",
      ["Difteri", "Tetanoz", "Boğmaca"],
      "Bu asi aynı anda üç hastalığa karşı korur. Difteri boğazı tıkayabilir, tetanoz kasları kilitler, boğmaca ise bebeği nefessiz bırakabilir.",
      "İğne yeri kızarabilir ve acıyabilir. Çocuk 1-2 gün hafif ateşli olabilir.",
      "EFSANE: 'Bu hastalıklar artık yok, neden asi olalım?' GERÇEK: Nadir olmalarının nedeni aşılamadır. Aşılama azalınca hastalıklar geri gelir.",
    ),
    ipv: item(
      "Polio (IPV)",
      ["Polio (felç)"],
      "Polio birkaç saat içinde çocuğun bacaklarını kalıcı olarak felç edebilen bir virüstür. Bu asi hastalığı dünyanın birçok yerinden neredeyse sildi.",
      "Çok hafif yan etki yapar. Bazen sadece iğne yerinde biraz kızarıklık olur.",
      "EFSANE: 'Polio bitti, bu aşıya gerek yok.' GERÇEK: Avrupa'da aşılama sayesinde bitti. Aşısız bir yolcu hastalığı geri getirebilir.",
    ),
    mmr: item(
      "MMR (kızamık, kabakulak, kızamıkçık)",
      ["Kızamık", "Kabakulak", "Kızamıkçık"],
      "Kızamık çok bulaşıcıdır ve beyne zarar verebilir ya da öldürebilir. Bu asi tek dozla üç hastalığa da karşı korur.",
      "Yaklaşık her 10 çocuktan 1'inde 7-10 gün sonra hafif ateş ve döküntü olabilir. Bu, vücudun savunmayı öğrendiğini gösterir.",
      "EFSANE: 'MMR otizme neden olur.' GERÇEK: Büyük çalışmalar otizmle hiçbir bağlantı bulmadı. Kızamık ise öldürebilir.",
    ),
    pneumo: item(
      "Pnömokok aşısı (PCV13)",
      ["Zatürre", "Menenjit", "Kan enfeksiyonları"],
      "Zatürre, menenjit ve ciddi kan enfeksiyonlarına yol açan bakterilere karşı korur. Bunlar küçük çocuklar için en tehlikeli hastalıklardandır.",
      "1-2 gün hafif ateş, huzursuzluk ve iğne yerinde ağrı olabilir.",
      "EFSANE: 'Çocuklar çok aşıdan hastalanır.' GERÇEK: Çocuğun bağışıklık sistemi her gün binlerce mikropla karşılaşır. Birkaç asi onun için fazla değildir.",
    ),
    rota: item(
      "Rotavirüs",
      ["Bebeklerde ağır ishal ve kusma"],
      "İğne değil, ağızdan damla olarak verilir. Ağır ishale ve susuz kalmaya yol açan virüse karşı korur.",
      "Çok hafif yan etkiler olur. Bazen biraz huzursuzluk veya hafif ishal görülebilir.",
      "EFSANE: 'İshal bebeklerde normaldir, aşı gerekmez.' GERÇEK: Rotavirüs ishali çocuğu hızlıca susuz bırakabilir ve tehlikeli olabilir.",
    ),
    varicella: item(
      "Suçiçeği",
      ["Suçiçeği"],
      "Suçiçeği hafif görünebilir ama ciddi cilt enfeksiyonu, zatürre veya beyinle ilgili komplikasyonlara yol açabilir. Bu asi vakaların çoğunu önler.",
      "Hafif ağrı olabilir. Nadiren iğne yerinin yakınında birkaç suçiçeği benzeri nokta çıkar.",
      "EFSANE: 'Suçiçeğini doğal geçirmek daha iyidir.' GERÇEK: Doğal enfeksiyon ciddi komplikasyonlara yol açabilir ve ileride zona yapabilir.",
    ),
    hpv: item(
      "HPV (insan papilloma virüsü)",
      ["Rahim ağzı kanseri", "Diğer kanserler"],
      "Bu asi kanseri önler. Gençler virüsle karşılaşmadan önce yapılır.",
      "Kolda ağrı, bazen kısa baş ağrısı veya baş dönmesi olabilir. Çok güvenlidir.",
      "EFSANE: 'Bu asi cinsel davranışı teşvik eder.' GERÇEK: Bu asi KANSERİ önler. Davranışla ilgisi yoktur.",
    ),
    flu: item(
      "Grip",
      ["Mevsimsel grip"],
      "Grip sadece soğuk algınlığı değildir. Küçük çocuklar, yaşlılar ve hamile kadınlar için tehlikeli olabilir. Bu asi her yıl güncellenir.",
      "Kolda hafif ağrı ve bazen bir gün süren düşük ateş olabilir. Bu aşıdan grip OLMAZSINIZ.",
      "EFSANE: 'Grip aşısı grip yapar.' GERÇEK: Bu imkânsızdır. Aşıda canlı virüs yoktur.",
    ),
  },
};

function extractExistingUi(locale, currentVaccines) {
  if (!currentVaccines || typeof currentVaccines !== "object") {
    throw new Error(`Expected existing vaccines UI in ${locale}.json`);
  }

  const ui = {};
  for (const key of UI_KEYS) {
    ui[key] = currentVaccines[key];
  }
  return ui;
}

function validateUi(locale, vaccines) {
  for (const key of UI_KEYS) {
    if (!(key in vaccines)) {
      throw new Error(`Missing vaccines.${key} for locale "${locale}"`);
    }
  }

  const importanceKeys = ["critical", "important", "recommended"];
  for (const key of importanceKeys) {
    if (typeof vaccines.importance?.[key] !== "string" || !vaccines.importance[key].trim()) {
      throw new Error(`Missing vaccines.importance.${key} for locale "${locale}"`);
    }
  }

  if (!Array.isArray(vaccines.fears) || vaccines.fears.length === 0) {
    throw new Error(`Missing vaccines.fears array for locale "${locale}"`);
  }

  if (typeof vaccines.meta?.title !== "string" || !vaccines.meta.title.trim()) {
    throw new Error(`Missing vaccines.meta.title for locale "${locale}"`);
  }

  if (typeof vaccines.meta?.description !== "string" || !vaccines.meta.description.trim()) {
    throw new Error(`Missing vaccines.meta.description for locale "${locale}"`);
  }
}

function validateItems(locale, vaccines) {
  const items = vaccines.items;
  if (!items || typeof items !== "object") {
    throw new Error(`Missing vaccines.items for locale "${locale}"`);
  }

  const extraItems = Object.keys(items).filter((key) => !ITEM_IDS.includes(key));
  if (extraItems.length > 0) {
    throw new Error(`Unexpected vaccines.items keys for locale "${locale}": ${extraItems.join(", ")}`);
  }

  for (const itemId of ITEM_IDS) {
    const entry = items[itemId];
    if (!entry) {
      throw new Error(`Missing vaccines.items.${itemId} for locale "${locale}"`);
    }

    for (const field of ["name", "howItWorks", "sideEffects", "mythDebunked"]) {
      if (typeof entry[field] !== "string" || !entry[field].trim()) {
        throw new Error(`Missing vaccines.items.${itemId}.${field} for locale "${locale}"`);
      }
    }

    if (!Array.isArray(entry.preventsDiseases) || entry.preventsDiseases.length === 0) {
      throw new Error(`Missing vaccines.items.${itemId}.preventsDiseases for locale "${locale}"`);
    }
  }

  if (Object.keys(items).length !== ITEM_IDS.length) {
    throw new Error(`Expected ${ITEM_IDS.length} vaccines.items in locale "${locale}" but found ${Object.keys(items).length}`);
  }
}

function validateAgeGroups(locale, vaccines) {
  const ageGroups = vaccines.ageGroups;
  if (!ageGroups || typeof ageGroups !== "object") {
    throw new Error(`Missing vaccines.ageGroups for locale "${locale}"`);
  }

  const extraGroups = Object.keys(ageGroups).filter((key) => !AGE_GROUP_IDS.includes(key));
  if (extraGroups.length > 0) {
    throw new Error(`Unexpected vaccines.ageGroups keys for locale "${locale}": ${extraGroups.join(", ")}`);
  }

  for (const ageGroupId of AGE_GROUP_IDS) {
    const entry = ageGroups[ageGroupId];
    if (!entry || typeof entry.label !== "string" || !entry.label.trim()) {
      throw new Error(`Missing vaccines.ageGroups.${ageGroupId}.label for locale "${locale}"`);
    }
  }

  if (Object.keys(ageGroups).length !== AGE_GROUP_IDS.length) {
    throw new Error(`Expected ${AGE_GROUP_IDS.length} vaccines.ageGroups in locale "${locale}" but found ${Object.keys(ageGroups).length}`);
  }
}

function validateVaccinesNamespace(locale, vaccines) {
  validateUi(locale, vaccines);
  validateItems(locale, vaccines);
  validateAgeGroups(locale, vaccines);
}

function main() {
  const files = readdirSync(MESSAGES_DIR)
    .filter((name) => name.endsWith(".json") && !name.startsWith("_"))
    .sort();

  const fileLocales = files.map((name) => name.replace(/\.json$/, ""));
  const missingFiles = LOCALES.filter((locale) => !fileLocales.includes(locale));
  const unexpectedFiles = fileLocales.filter((locale) => !LOCALES.includes(locale));

  if (missingFiles.length > 0 || unexpectedFiles.length > 0) {
    throw new Error(
      `Locale file mismatch. Missing files: [${missingFiles.join(", ")}]. Unexpected files: [${unexpectedFiles.join(", ")}].`,
    );
  }

  const missingManualUi = Object.keys(UI_TRANSLATIONS).length !== LOCALES.length - EXISTING_UI_LOCALES.size - 1
    ? LOCALES.filter((locale) => locale !== "en" && !EXISTING_UI_LOCALES.has(locale) && !(locale in UI_TRANSLATIONS))
    : [];
  const missingItemTranslations = LOCALES.filter((locale) => locale !== "en" && !(locale in ITEM_TRANSLATIONS));
  const missingAgeTranslations = LOCALES.filter((locale) => locale !== "en" && !(locale in AGE_GROUP_LABELS));

  if (missingManualUi.length > 0 || missingItemTranslations.length > 0 || missingAgeTranslations.length > 0) {
    throw new Error(
      `Translation map mismatch. Missing UI: [${missingManualUi.join(", ")}]. Missing items: [${missingItemTranslations.join(", ")}]. Missing age groups: [${missingAgeTranslations.join(", ")}].`,
    );
  }

  const localeData = Object.fromEntries(
    files.map((file) => {
      const locale = file.replace(/\.json$/, "");
      const path = join(MESSAGES_DIR, file);
      return [locale, JSON.parse(readFileSync(path, "utf8"))];
    }),
  );

  const englishVaccines = localeData.en?.vaccines;
  if (!englishVaccines) {
    throw new Error("messages/en.json is missing vaccines namespace. Run generate-vaccines-i18n.mjs first.");
  }

  validateVaccinesNamespace("en", englishVaccines);

  const translations = {
    en: deepClone(englishVaccines),
  };

  for (const locale of LOCALES) {
    if (locale === "en") continue;

    const ui = EXISTING_UI_LOCALES.has(locale)
      ? extractExistingUi(locale, localeData[locale].vaccines)
      : deepClone(UI_TRANSLATIONS[locale]);

    translations[locale] = {
      ...ui,
      items: deepClone(ITEM_TRANSLATIONS[locale]),
      ageGroups: makeAgeGroups(AGE_GROUP_LABELS[locale]),
    };

    validateVaccinesNamespace(locale, translations[locale]);
  }

  for (const locale of LOCALES) {
    const file = `${locale}.json`;
    const path = join(MESSAGES_DIR, file);
    const data = localeData[locale];
    data.vaccines = deepClone(translations[locale]);
    writeFileSync(path, `${JSON.stringify(data, null, 2)}\n`);
    console.log(`Patched ${file} with vaccines (${ITEM_IDS.length} items, ${AGE_GROUP_IDS.length} age groups)`);
  }

  console.log(`Patched vaccines namespace in ${LOCALES.length} locale files: ${LOCALES.join(", ")}`);
}

main();
