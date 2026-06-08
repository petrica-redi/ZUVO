/**
 * Adds Romanian translations for newly i18n'd pages.
 * Run: node scripts/patch-ro-pages.mjs
 */
import { readFileSync, writeFileSync } from "fs";

const ro = JSON.parse(readFileSync("./messages/ro.json", "utf8"));
const en = JSON.parse(readFileSync("./messages/en.json", "utf8"));

// UI namespaces with Romanian translations
ro.glossary = {
  meta: { title: "Glosar medical — Redi Health", description: "Termeni medicali explicați cu cuvinte simple" },
  title: "Glosar medical",
  subtitle: "Termeni medicali explicați cu cuvinte simple.",
  searchPlaceholder: "Caută termeni...",
  searchAria: "Caută termeni medicali",
  noResults: "Niciun termen găsit. Încearcă o altă căutare.",
  allCount: "Toate ({count})",
  categories: {
    condition: "Afecțiuni",
    medication: "Medicamente",
    procedure: "Proceduri",
    body: "Corp și sănătate",
    test: "Analize",
  },
  entries: en.glossary.entries,
};

ro.healthQuiz = {
  meta: { title: "Test de sănătate — Redi Health", description: "Testează-ți cunoștințele de sănătate" },
  title: "Test de sănătate",
  subtitle: "Testează-ți cunoștințele. Învață ceva nou.",
  backToQuizzes: "Înapoi la teste",
  seeResults: "Vezi rezultatele",
  nextQuestion: "Următoarea întrebare",
  questionsCount: "{count} întrebări",
  results: {
    perfect: "Scor perfect!",
    great: "Foarte bine!",
    good: "Efort bun!",
    keepLearning: "Continuă să înveți!",
    score: "Ai răspuns corect la {score} din {total}",
    tryAgain: "Încearcă din nou",
    moreQuizzes: "Mai multe teste",
  },
  quizzes: en.healthQuiz.quizzes,
};

ro.rights = {
  meta: { title: "Cunoaște-ți drepturile — Redi Health", description: "Drepturile pacientului, ajutor la discriminare și contacte legale" },
  title: "Cunoaște-ți drepturile",
  subtitle: "Ai drepturi ca pacient. Învață-le. Folosește-le.",
  back: "Înapoi",
  menu: {
    patientRights: { title: "Drepturile pacientului", desc: "8 drepturi pe care le are fiecare pacient" },
    discrimination: { title: "Te confrunți cu discriminare?", desc: "Ce să spui și ce să faci — pas cu pas" },
    contacts: { title: "Ajutor legal pe țări", desc: "Avocatul poporului, anti-discriminare, organizații roma" },
  },
  views: {
    patientRights: "Drepturile tale ca pacient",
    discrimination: "Dacă te confrunți cu discriminare",
    discriminationDesc: "Situații reale și exact ce să spui și să faci.",
    contacts: "Ajutor legal pe țări",
  },
  labels: {
    sayThis: "Spune asta:",
    thenDo: "Apoi fă asta:",
    patientOmbudsman: "Avocatul pacientului",
    antiDiscrimination: "Anti-discriminare",
    romaRightsOrg: "Organizație pentru drepturile romilor",
  },
  rights: en.rights.rights,
  scenarios: en.rights.scenarios,
  contacts: en.rights.contacts,
};

ro.stories = {
  meta: { title: "Povești din comunitate — Redi Health", description: "Experiențe reale de sănătate din comunitățile rome din Europa" },
  title: "Povești din comunitate",
  subtitle: "Experiențe reale din comunitățile rome. Învață de la alții.",
  backToStories: "Înapoi la povești",
  lessonLearned: "Lecția învățată",
  whatToDoNext: "Ce să faci în continuare",
  categories: {
    vaccines: "Vaccinuri",
    chronic: "Boli cronice",
    maternal: "Sarcină",
    discrimination: "Drepturi",
    prevention: "Prevenție",
    mental: "Sănătate mintală",
  },
  nextSteps: {
    vaccineGuide: "Ghid vaccinuri",
    askZuvo: "Întreabă Zuvo",
    explainPrescription: "Explică rețeta",
    navigateToCare: "Navighează spre îngrijire",
    knowYourRights: "Cunoaște-ți drepturile",
    learnPrevention: "Învață prevenția",
    checkSymptoms: "Verifică simptomele",
    learnMentalHealth: "Învață despre sănătatea mintală",
  },
  entries: en.stories.entries,
};

ro.challenges = {
  meta: { title: "Provocări — Redi Health", description: "Provocări comunitare" },
  title: "Provocări active",
  subtitle: "Alătură-te obiectivelor comunitare și provocărilor personale pentru XP și insigne bonus.",
  types: { community: "comunitate", personal: "personal" },
  daysLeft: "{count} zile rămase",
  viewLeaderboard: "Vezi clasamentul",
  items: {
    c1: {
      title: "Campion al cunoștințelor despre vaccinuri",
      description: "Ajută 50 de elevi din zona ta să treacă modulul Vaccinuri săptămâna aceasta.",
    },
    c2: {
      title: "Serie de 7 zile de sănătate",
      description: "Înregistrează-ți starea și consumul de apă timp de 7 zile la rând.",
    },
  },
};

ro.certificate = {
  meta: { title: "Certificat — Redi Health", description: "Certificat național de alfabetizare în sănătate" },
  title: "Certificatul tău",
  subtitle: "Ai finalizat etapa Națională a Academiei de Sănătate pentru Elevi.",
  ofCompletion: "Certificat de finalizare",
  diplomaTitle: "Alfabetizare în sănătate națională",
  awardedFor: "Acordat pentru finalizarea curriculumului Academiei Redi Health.",
  date: "Data",
  downloadPdf: "Descarcă PDF",
  share: "Distribuie",
  gate: {
    title: "Finalizează mai întâi Academia",
    description: "Pentru a obține certificatul de alfabetizare în sănătate, trebuie să finalizezi toate lecțiile și să treci testul din etapa Națională a Academiei de Sănătate.",
    cta: "Mergi la Academie",
  },
};

ro.regions = {
  ...ro.regions,
  romaPop: "Pop. romă {population}",
  detail: {
    back: "Înapoi",
    romaPopulation: "Populație romă",
    ofTotal: "din {total} total ({percent})",
    healthAccess: "Acces la sănătate",
    healthChallenges: "Provocări de sănătate",
    organizationsHelp: "Organizații care pot ajuta",
    emergency: "Urgență: {number}",
    ambulance: "Ambulanță: {number}",
    askAboutHealth: "Întreabă despre sănătate în {region}",
  },
  healthIndex: {
    veryPoor: "Foarte slab",
    poor: "Slab",
    fair: "Acceptabil",
    good: "Bun",
    excellent: "Excelent",
  },
};

if (!ro.common?.all) {
  ro.common = { ...ro.common, all: "Toate", clear: ro.common?.clear ?? "Șterge" };
}

writeFileSync("./messages/ro.json", JSON.stringify(ro, null, 2) + "\n");
console.log("Updated messages/ro.json with page i18n (UI in Romanian, content from en for now)");
