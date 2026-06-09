/**
 * Generates ui-pages-translations.mjs. Run: node scripts/i18n-data/generate-translations.mjs
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { LOCALE_DEFS, SQ_EXTRA, ROM_EXTRA } from "./ui-pages-locale-data.mjs";
import { EXTRA_LOCALE_DEFS } from "./ui-pages-extra-locales.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "../..");
const OUT = join(dirname(fileURLToPath(import.meta.url)), "ui-pages-translations.mjs");
const en = JSON.parse(readFileSync(join(ROOT, "messages/en.json"), "utf8"));
const clone = (v) => JSON.parse(JSON.stringify(v));

function theme(t) {
  return { ariaLabel: t[0], light: t[1], dark: t[2], system: t[3], switchTo: t[4] };
}
function emergency(t) {
  return { call112: t[0], banner: t[1], emergencyLabel: t[2], ambulanceLabel: t[3] };
}
function voice(t) {
  return {
    start: t[0], stop: t[1], readAloud: t[2], readMessageAloud: t[3], readExplanationAloud: t[4],
    micDeepgram: t[5], micError: t[6], detected: t[7],
  };
}
function severity(t) {
  return { green: t[0], amber: t[1], red: t[2], redHospital: t[3] };
}
function symptoms(p) {
  return {
    heroTitle: p.symptoms[0], heroSubtitle: p.symptoms[1], heroArtAlt: p.symptoms[2],
    backToMap: p.symptoms[3], checkAnother: p.symptoms[4], selectSymptoms: p.symptoms[5],
    extraPlaceholder: p.symptoms[6], extraAria: p.symptoms[7], analyzing: p.symptoms[8], checkCta: p.symptoms[9],
    whatToDoNow: p.symptoms[10], homeCare: p.symptoms[11], escalateTitle: p.symptoms[12], commonCauses: p.symptoms[13],
    regions: {
      head: p.regions[0], chest: p.regions[1], abdomen: p.regions[2], leftArm: p.regions[3], rightArm: p.regions[4],
      pelvis: p.regions[5], leftLeg: p.regions[6], rightLeg: p.regions[7],
    },
    headSymptoms: p.headSymptoms, chestSymptoms: p.chestSymptoms, abdomenSymptoms: p.abdomenSymptoms,
    armSymptoms: p.armSymptoms, pelvisSymptoms: p.pelvisSymptoms, legSymptoms: p.legSymptoms,
    meta: { title: p.symptoms[14], description: p.symptoms[15] },
  };
}
function consult(t) {
  return {
    heroTitle: t[0], heroSubtitle: t[1], prompt: t[2], orFreeform: t[3], freeformPlaceholder: t[4],
    freeformAria: t[5], chatHeader: t[6], chatSubtitle: t[7], answerAria: t[8], answerPlaceholder: t[9],
    newSession: t[10], assessment: t[11], whatToDo: t[12], homeCare: t[13], watchFor: t[14],
    showVisitCard: t[15], hideVisitCard: t[16], visitCardTitle: t[17], visitCardDisclaimer: t[18],
    concerns: {
      fever: t[19], pain: t[20], breathing: t[21], skin: t[22], pregnancy: t[23],
      child: t[24], mental: t[25], heart: t[26],
    },
  };
}
function explain(t) {
  return {
    heroTitle: t[0], heroSubtitle: t[1], heroArtAlt: t[2], placeholder: t[3], inputAria: t[4],
    cta: t[5], ctaAnalyzing: t[6], examplesHeading: t[7], loading: t[8],
    sections: {
      whatThisMeans: t[9], whyItMatters: t[10], ifIgnored: t[11], medicationsTitle: t[12],
      howToTake: t[13], sideEffects: t[14], neverDo: t[15], questionsTitle: t[16],
      tipsTitle: t[17], emergencyTitle: t[18],
    },
    anotherCta: t[19], disclaimerBold: t[20], disclaimerBody: t[21],
    meta: { title: t[22], description: t[23] },
    takePhoto: t[24], uploadImage: t[25], placeholderWithImage: t[26], imagePreviewAlt: t[27],
    imageReady: t[28], imageReadyBody: t[29], imageRemove: t[30], preparingImage: t[31], imageFailed: t[32],
    followUpChat: t[33], followUpNavigate: t[34], followUpGlossary: t[35],
  };
}
function navigate(t) {
  return {
    heroTitle: t[0], heroSubtitle: t[1], issuePrompt: t[2],
    issues: { fever: t[3], pain: t[4], pregnancy: t[5], chronic: t[6], mental: t[7], skin: t[8], child: t[9], other: t[10] },
    tellMore: t[11], detailPlaceholder: t[12], detailAria: t[13], insuranceTitle: t[14], insuranceSubtitle: t[15],
    insuranceYes: t[16], insuranceNo: t[17], insuranceUnknown: t[18], countryTitle: t[19], generating: t[20],
    generateCard: t[21], startOver: t[22], showDoctor: t[23], generatedBy: t[24], whatToBring: t[25],
    askYourDoctor: t[26], patientRights: t[27], findHospital: t[28], mapHint: t[29],
    meta: { title: t[30], description: t[31] },
    systemGuidesTitle: t[32],
    italySsnTitle: t[33],
    italyDoctorTitle: t[34],
    italyDoctorDesc: t[35],
    italyEnrollTitle: t[36],
    italyEnrollSteps: t[37],
    italyStpTitle: t[38],
    italyStpDesc: t[39],
    viewGuide: t[40],
    closeGuide: t[41],
  };
}
function about(t) {
  return {
    brand: t[0], tagline: t[1], version: t[2], missionBody: t[3],
    values: {
      careLabel: t[4], careDesc: t[5], languagesLabel: t[6], languagesDesc: t[7],
      evidenceLabel: t[8], evidenceDesc: t[9], communityLabel: t[10], communityDesc: t[11],
    },
    privacyLink: t[12], termsLink: t[13], disclaimer: t[14],
    meta: { title: t[15], description: t[16] },
  };
}
function healthQuizShell(t) {
  return {
    meta: { title: t[0], description: t[1] }, title: t[2], subtitle: t[3], backToQuizzes: t[4],
    seeResults: t[5], nextQuestion: t[6], questionsCount: t[7],
    results: { perfect: t[8], great: t[9], good: t[10], keepLearning: t[11], score: t[12], tryAgain: t[13], moreQuizzes: t[14] },
    quizzes: clone(en.healthQuiz.quizzes),
  };
}
function rightsShell(t) {
  return {
    meta: { title: t[0], description: t[1] }, title: t[2], subtitle: t[3], back: t[4],
    menu: {
      patientRights: { title: t[5], desc: t[6] },
      discrimination: { title: t[7], desc: t[8] },
      contacts: { title: t[9], desc: t[10] },
    },
    views: { patientRights: t[11], discrimination: t[12], discriminationDesc: t[13], contacts: t[14] },
    labels: { sayThis: t[15], thenDo: t[16], patientOmbudsman: t[17], antiDiscrimination: t[18], romaRightsOrg: t[19] },
    rights: clone(en.rights.rights), scenarios: clone(en.rights.scenarios), contacts: clone(en.rights.contacts),
  };
}
function storiesShell(t) {
  return {
    meta: { title: t[0], description: t[1] }, title: t[2], subtitle: t[3], backToStories: t[4],
    lessonLearned: t[5], whatToDoNext: t[6],
    categories: { vaccines: t[7], chronic: t[8], maternal: t[9], discrimination: t[10], prevention: t[11], mental: t[12] },
    nextSteps: {
      vaccineGuide: t[13], askZuvo: t[14], explainPrescription: t[15], navigateToCare: t[16],
      knowYourRights: t[17], learnPrevention: t[18], checkSymptoms: t[19], learnMentalHealth: t[20],
    },
    entries: clone(en.stories.entries),
  };
}
function challenges(t) {
  return {
    meta: { title: t[0], description: t[1] }, title: t[2], subtitle: t[3],
    types: { community: t[4], personal: t[5] }, daysLeft: t[6], viewLeaderboard: t[7],
    items: { c1: { title: t[8], description: t[9] }, c2: { title: t[10], description: t[11] } },
  };
}
function certificate(t) {
  return {
    meta: { title: t[0], description: t[1] }, title: t[2], subtitle: t[3], ofCompletion: t[4],
    diplomaTitle: t[5], awardedFor: t[6], date: t[7], downloadPdf: t[8], share: t[9],
    gate: { title: t[10], description: t[11], cta: t[12] },
  };
}

function buildPages(p) {
  return {
    theme: theme(p.theme), emergency: emergency(p.emergency), voice: voice(p.voice), severity: severity(p.severity),
    symptoms: symptoms(p), consult: consult(p.consult), explain: explain(p.explain), navigate: navigate(p.navigate),
    about: about(p.about), healthQuiz: healthQuizShell(p.healthQuiz), rights: rightsShell(p.rights),
    stories: storiesShell(p.stories), challenges: challenges(p.challenges), certificate: certificate(p.certificate),
  };
}

function buildSqRomExtra(extra) {
  return {
    healthQuiz: { ...extra.healthQuiz, quizzes: clone(en.healthQuiz.quizzes) },
    rights: {
      ...extra.rights,
      rights: clone(en.rights.rights), scenarios: clone(en.rights.scenarios), contacts: clone(en.rights.contacts),
    },
    stories: { ...extra.stories, entries: clone(en.stories.entries) },
    challenges: extra.challenges,
    certificate: extra.certificate,
  };
}

const ALL_DEFS = { ...LOCALE_DEFS, ...EXTRA_LOCALE_DEFS };
const NEW_UI_PAGE_NAMESPACES = [
  "explain", "symptoms", "consult", "navigate", "about", "theme", "emergency", "voice", "severity",
];
const TRANSLATIONS = {};

for (const [locale, def] of Object.entries(ALL_DEFS)) {
  const pages = buildPages(def);
  TRANSLATIONS[locale] = Object.fromEntries(
    NEW_UI_PAGE_NAMESPACES.map((ns) => [ns, pages[ns]]),
  );
}

TRANSLATIONS.sq = buildSqRomExtra(SQ_EXTRA);
TRANSLATIONS.rom = buildSqRomExtra(ROM_EXTRA);

writeFileSync(OUT, `/** Generated by scripts/i18n-data/generate-translations.mjs */\nexport const TRANSLATIONS = ${JSON.stringify(TRANSLATIONS, null, 2)};\n`);
console.log(`Wrote ${OUT} (${Object.keys(TRANSLATIONS).length} locales)`);
