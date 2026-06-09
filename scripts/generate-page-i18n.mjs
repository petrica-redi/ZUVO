/**
 * Extracts translatable content from data files into messages/en.json namespaces.
 * Run: node scripts/generate-page-i18n.mjs
 */
import { readFileSync, writeFileSync } from "fs";

const enPath = "./messages/en.json";
const en = JSON.parse(readFileSync(enPath, "utf8"));

// --- Glossary ---
const glossarySrc = readFileSync("./src/data/glossary.ts", "utf8");
const glossaryEntries = {};
const entryRe = /\{\s*term:\s*"([^"]+)",\s*simple:\s*"([^"]+)",\s*category:\s*"([^"]+)",\s*emoji:\s*"([^"]+)"\s*\}/g;
let m;
while ((m = entryRe.exec(glossarySrc)) !== null) {
  const [, term, simple, category] = m;
  const id = term.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  glossaryEntries[id] = { term, simple, category };
}

en.glossary = {
  meta: { title: "Health Glossary — Redi Health", description: "Medical terms explained in simple words" },
  title: "Health Glossary",
  subtitle: "Medical terms explained in simple words.",
  searchPlaceholder: "Search terms...",
  searchAria: "Search medical terms",
  noResults: "No terms found. Try a different search.",
  allCount: "All ({count})",
  categories: {
    condition: "Conditions",
    medication: "Medications",
    procedure: "Procedures",
    body: "Body & Health",
    test: "Tests",
  },
  entries: Object.fromEntries(
    Object.entries(glossaryEntries).map(([id, { term, simple }]) => [id, { term, simple }])
  ),
};

// --- Health Quiz ---
const quizzesSrc = readFileSync("./src/data/quizzes.ts", "utf8");
const quizBlocks = [...quizzesSrc.matchAll(/\{\s*id:\s*"([^"]+)",\s*title:\s*"([^"]+)",\s*emoji:\s*"([^"]+)",\s*description:\s*"([^"]+)",[\s\S]*?questions:\s*\[([\s\S]*?)\],\s*\}/g)];
const healthQuizContent = { quizzes: {} };
for (const [, id, title, , description, questionsBlock] of quizBlocks) {
  const questions = [];
  const qRe = /\{\s*question:\s*"([^"]+)",\s*options:\s*\[([^\]]+)\],\s*correctIndex:\s*(\d+),\s*explanation:\s*"([^"]+)"\s*\}/g;
  let qm;
  while ((qm = qRe.exec(questionsBlock)) !== null) {
    const [, question, optionsRaw, , explanation] = qm;
    const options = [...optionsRaw.matchAll(/"([^"]+)"/g)].map((o) => o[1]);
    questions.push({ question, options, explanation });
  }
  healthQuizContent.quizzes[id] = { title, description, questions };
}

en.healthQuiz = {
  meta: { title: "Health Quiz — Redi Health", description: "Test your health knowledge with interactive quizzes" },
  title: "Health Quiz",
  subtitle: "Test your knowledge. Learn something new.",
  backToQuizzes: "Back to quizzes",
  seeResults: "See results",
  nextQuestion: "Next question",
  questionsCount: "{count} questions",
  results: {
    perfect: "Perfect score!",
    great: "Great job!",
    good: "Good effort!",
    keepLearning: "Keep learning!",
    score: "You got {score} out of {total} correct",
    tryAgain: "Try again",
    moreQuizzes: "More quizzes",
  },
  ...healthQuizContent,
};

// --- Rights ---
const rightsSrc = readFileSync("./src/data/rights.ts", "utf8");
const rightsEntries = {};
const rightRe = /\{\s*id:\s*"([^"]+)",\s*emoji:\s*"([^"]+)",\s*title:\s*"([^"]+)",\s*description:\s*"([^"]+)"\s*\}/g;
while ((m = rightRe.exec(rightsSrc)) !== null) {
  const [, id, , title, description] = m;
  rightsEntries[id] = { title, description };
}

const scenarioRe = /\{\s*id:\s*"([^"]+)",\s*emoji:\s*"([^"]+)",\s*situation:\s*"([^"]+)",\s*whatToSay:\s*"([^"]+)",\s*whatToDo:\s*\[([\s\S]*?)\],\s*\}/g;
const scenarios = {};
while ((m = scenarioRe.exec(rightsSrc)) !== null) {
  const [, id, , situation, whatToSay, stepsRaw] = m;
  const whatToDo = [...stepsRaw.matchAll(/"([^"]+)"/g)].map((s) => s[1]);
  scenarios[id] = { situation, whatToSay, whatToDo };
}

const contactRe = /\{\s*country:\s*"([^"]+)",\s*flag:\s*"([^"]+)",\s*ombudsman:\s*"([^"]+)"(?:,\s*ombudsmanPhone:\s*"([^"]*)")?,\s*antiDiscrimination:\s*"([^"]+)"(?:,\s*antiDiscriminationPhone:\s*"([^"]*)")?(?:,\s*romaRightsOrg:\s*"([^"]*)")?\s*\}/g;
const contacts = {};
while ((m = contactRe.exec(rightsSrc)) !== null) {
  const [, country, , ombudsman, ombudsmanPhone, antiDiscrimination, antiDiscriminationPhone, romaRightsOrg] = m;
  const id = country.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  contacts[id] = { country, ombudsman, antiDiscrimination, ...(ombudsmanPhone && { ombudsmanPhone }), ...(antiDiscriminationPhone && { antiDiscriminationPhone }), ...(romaRightsOrg && { romaRightsOrg }) };
}

en.rights = {
  meta: { title: "Know Your Rights — Redi Health", description: "Patient rights, discrimination help, and legal contacts for Roma communities" },
  title: "Know Your Rights",
  subtitle: "You have rights as a patient. Learn them. Use them.",
  back: "Back",
  menu: {
    patientRights: { title: "Patient Rights", desc: "8 rights every patient has" },
    discrimination: { title: "Facing Discrimination?", desc: "What to say and do — step by step" },
    contacts: { title: "Legal Help by Country", desc: "Ombudsman, anti-discrimination, Roma orgs" },
  },
  views: {
    patientRights: "Your Patient Rights",
    discrimination: "If You Face Discrimination",
    discriminationDesc: "Real situations and exactly what to say and do.",
    contacts: "Legal Help by Country",
  },
  labels: {
    sayThis: "Say this:",
    thenDo: "Then do this:",
    patientOmbudsman: "Patient Ombudsman",
    antiDiscrimination: "Anti-Discrimination",
    romaRightsOrg: "Roma Rights Organization",
  },
  rights: rightsEntries,
  scenarios,
  contacts,
};

// --- Stories ---
const storiesSrc = readFileSync("./src/data/stories.ts", "utf8");
const storyRe = /\{\s*id:\s*"([^"]+)",\s*name:\s*"([^"]+)",\s*age:\s*(\d+),\s*country:\s*"([^"]+)",\s*flag:\s*"([^"]+)",\s*avatar:\s*"([^"]+)",\s*title:\s*"([^"]+)",\s*story:\s*"([^"]+)",\s*lesson:\s*"([^"]+)",\s*category:\s*"([^"]+)"\s*\}/g;
const storyEntries = {};
while ((m = storyRe.exec(storiesSrc)) !== null) {
  const [, id, name, age, country, , , title, story, lesson] = m;
  storyEntries[id] = { name, age: Number(age), country, title, story, lesson };
}

en.stories = {
  meta: { title: "Community Stories — Redi Health", description: "Real health experiences from Roma communities across Europe" },
  title: "Community Stories",
  subtitle: "Real experiences from Roma communities. Learn from others.",
  backToStories: "Back to stories",
  lessonLearned: "Lesson learned",
  whatToDoNext: "What to do next",
  categories: {
    vaccines: "Vaccines",
    chronic: "Chronic Disease",
    maternal: "Pregnancy",
    discrimination: "Rights",
    prevention: "Prevention",
    mental: "Mental Health",
  },
  nextSteps: {
    vaccineGuide: "Vaccine guide",
    askZuvo: "Ask Zuvo",
    explainPrescription: "Explain prescription",
    navigateToCare: "Navigate to care",
    knowYourRights: "Know your rights",
    learnPrevention: "Learn prevention",
    checkSymptoms: "Check symptoms",
    learnMentalHealth: "Learn about mental health",
  },
  entries: storyEntries,
};

// --- Challenges ---
en.challenges = {
  meta: { title: "Challenges — Redi Health", description: "Community Challenges" },
  title: "Active Challenges",
  subtitle: "Join community goals and personal challenges to earn bonus XP and badges.",
  types: { community: "community", personal: "personal" },
  daysLeft: "{count} days left",
  viewLeaderboard: "View Leaderboard",
  items: {
    c1: {
      title: "Vaccine Knowledge Champion",
      description: "Get 50 students in your local area to pass the Vaccine module this week.",
    },
    c2: {
      title: "7-Day Health Streak",
      description: "Log your mood and water intake for 7 days in a row.",
    },
  },
};

// --- Certificate ---
en.certificate = {
  meta: { title: "Certificate — Redi Health", description: "National Health Literacy Certificate" },
  title: "Your Certificate",
  subtitle: "You have completed the National Stage of the Student Health Academy.",
  ofCompletion: "Certificate of Completion",
  diplomaTitle: "National Health Literacy",
  awardedFor: "Awarded for completing the Redi Health Student Academy curriculum.",
  date: "Date",
  downloadPdf: "Download PDF",
  share: "Share",
  gate: {
    title: "Complete the Academy first",
    description: "To earn your Health Literacy Certificate, you need to complete all lessons and pass the quiz in the National stage of the Student Health Academy.",
    cta: "Go to the Academy",
  },
};

// --- Regions detail UI ---
en.regions = {
  ...en.regions,
  romaPop: "Roma pop. {population}",
  detail: {
    back: "Back",
    romaPopulation: "Roma population",
    ofTotal: "of {total} total ({percent})",
    healthAccess: "Health access",
    healthChallenges: "Health challenges",
    organizationsHelp: "Organizations that can help",
    emergency: "Emergency: {number}",
    ambulance: "Ambulance: {number}",
    askAboutHealth: "Ask about health in {region}",
  },
  healthIndex: {
    veryPoor: "Very poor",
    poor: "Poor",
    fair: "Fair",
    good: "Good",
    excellent: "Excellent",
  },
};

writeFileSync(enPath, JSON.stringify(en, null, 2) + "\n");
console.log("Updated messages/en.json with page i18n namespaces");
