/**
 * Adds full healthQuiz, rights, stories, challenges, certificate translations to all locales.
 * Run: node scripts/patch-content-pages-all-locales.mjs
 */
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT_DIR = join(dirname(fileURLToPath(import.meta.url)), "..");
const MESSAGES_DIR = join(ROOT_DIR, "messages");

const LOCALES = ["en","it","sq","rom","ro","hu","sk","cs","bg","sr","hr","bs","mk","sl","el","tr"];
const NAMESPACES = ["healthQuiz","rights","stories","challenges","certificate"];

const TRANSLATIONS = {
  "en": {
    "healthQuiz": {
      "meta": {
        "title": "Health Quiz — Redi Health",
        "description": "Test your health knowledge with interactive quizzes"
      },
      "title": "Health Quiz",
      "subtitle": "Test your knowledge. Learn something new.",
      "backToQuizzes": "Back to quizzes",
      "seeResults": "See results",
      "nextQuestion": "Next question",
      "questionsCount": "{count} questions",
      "results": {
        "perfect": "Perfect score!",
        "great": "Great job!",
        "good": "Good effort!",
        "keepLearning": "Keep learning!",
        "score": "You got {score} out of {total} correct",
        "tryAgain": "Try again",
        "moreQuizzes": "More quizzes"
      },
      "quizzes": {
        "antibiotics": {
          "title": "Antibiotics",
          "description": "Do you know when to use antibiotics?",
          "questions": [
            {
              "question": "Can antibiotics cure the flu?",
              "options": [
                "Yes",
                "No",
                "Sometimes"
              ],
              "explanation": "The flu is caused by a virus. Antibiotics only kill bacteria. Taking antibiotics for the flu does nothing and can make future infections harder to treat."
            },
            {
              "question": "You feel better after 3 days of antibiotics. Should you stop?",
              "options": [
                "Yes, you're cured",
                "No, finish the full course",
                "Take half the remaining pills"
              ],
              "explanation": "ALWAYS finish the full course. If you stop early, some bacteria survive and become resistant. Next time, the same antibiotic won't work."
            },
            {
              "question": "Can you share antibiotics with a family member who has similar symptoms?",
              "options": [
                "Yes, it saves money",
                "No, never",
                "Only if it's the same illness"
              ],
              "explanation": "Never share antibiotics. Different infections need different medicines. The wrong antibiotic can be dangerous and won't help."
            },
            {
              "question": "What happens if you take antibiotics too often?",
              "options": [
                "Nothing bad",
                "Your body becomes immune to illness",
                "Bacteria become resistant and harder to kill"
              ],
              "explanation": "Antibiotic resistance is a global crisis. When bacteria become resistant, simple infections can become deadly. Only take antibiotics when a doctor prescribes them."
            }
          ]
        },
        "vaccines": {
          "title": "Vaccines",
          "description": "Separate facts from myths",
          "questions": [
            {
              "question": "Do vaccines cause autism?",
              "options": [
                "Yes",
                "No",
                "We don't know"
              ],
              "explanation": "NO. This myth started from a fraudulent study that was retracted. The doctor who published it lost his medical license. Dozens of studies with millions of children prove vaccines do NOT cause autism."
            },
            {
              "question": "Is it safe to give a baby multiple vaccines at once?",
              "options": [
                "No, it's too much",
                "Yes, it's safe and tested",
                "Only one at a time"
              ],
              "explanation": "Babies' immune systems handle thousands of germs every day. Combination vaccines are thoroughly tested and safe. Delaying vaccines leaves your child unprotected."
            },
            {
              "question": "My child has a mild cold. Can they still get vaccinated?",
              "options": [
                "No, wait until fully healthy",
                "Yes, a mild cold is fine",
                "Only with doctor permission"
              ],
              "explanation": "A mild cold, low fever, or runny nose is NOT a reason to delay vaccination. Only severe illness requires postponement. Ask your doctor if unsure."
            },
            {
              "question": "Do vaccines contain dangerous chemicals?",
              "options": [
                "Yes, they're full of toxins",
                "No, all ingredients are safe in the tiny amounts used",
                "Some do, some don't"
              ],
              "explanation": "Vaccine ingredients are present in tiny, safe amounts. You get more aluminum from breast milk than from a vaccine. Every ingredient has been tested for safety."
            }
          ]
        },
        "diabetes": {
          "title": "Diabetes",
          "description": "Understanding diabetes management",
          "questions": [
            {
              "question": "Is diabetes caused by eating too much sugar?",
              "options": [
                "Yes",
                "No, it's more complex",
                "Only Type 2"
              ],
              "explanation": "Diabetes is caused by genetics, lifestyle, and how your body processes insulin. Eating sugar doesn't directly cause it, but an unhealthy diet and obesity increase risk."
            },
            {
              "question": "Can diabetes be cured with natural remedies like cinnamon?",
              "options": [
                "Yes, cinnamon cures it",
                "No, there is no cure but it can be managed",
                "Yes, with enough garlic and herbs"
              ],
              "explanation": "There is NO cure for diabetes. It can be MANAGED with medicine, healthy food, and exercise. Cinnamon may have tiny benefits but CANNOT replace medication. People who stop their medicine end up in hospital."
            },
            {
              "question": "A diabetic person feels dizzy and sweaty. What should you do?",
              "options": [
                "Give them insulin",
                "Give them something sweet immediately",
                "Tell them to rest"
              ],
              "explanation": "These are signs of LOW blood sugar (hypoglycemia). Give them juice, candy, or sugar water immediately. This can be life-threatening. After they feel better, they should eat a proper meal."
            },
            {
              "question": "How often should a diabetic person check their feet?",
              "options": [
                "Never, feet are fine",
                "Every day",
                "Once a year"
              ],
              "explanation": "Diabetes can damage nerves in your feet. You might not feel cuts or sores. Check your feet EVERY DAY for cuts, blisters, or color changes. Small wounds can become serious infections."
            }
          ]
        },
        "hygiene": {
          "title": "Hygiene & Prevention",
          "description": "Basic health habits that save lives",
          "questions": [
            {
              "question": "How long should you wash your hands with soap?",
              "options": [
                "5 seconds",
                "At least 20 seconds",
                "1 minute"
              ],
              "explanation": "Wash for at least 20 seconds — about the time it takes to sing 'Happy Birthday' twice. This removes most germs. Quick rinses don't work."
            },
            {
              "question": "Is it safe to drink water from a river or stream?",
              "options": [
                "Yes, natural water is clean",
                "No, always boil or filter it first",
                "Only if it looks clear"
              ],
              "explanation": "Even clear water can contain dangerous bacteria and parasites. Always boil water for at least 1 minute or use a filter. Dirty water causes diarrhea, cholera, and typhoid."
            },
            {
              "question": "Your child has diarrhea. What's the most important thing?",
              "options": [
                "Stop all food",
                "Give lots of fluids (water, ORS)",
                "Give antibiotics"
              ],
              "explanation": "Dehydration from diarrhea kills more children than the diarrhea itself. Give oral rehydration solution (ORS) or clean water with a pinch of salt and sugar. Keep breastfeeding babies."
            },
            {
              "question": "When should you wash your hands?",
              "options": [
                "Only before eating",
                "Before eating, after toilet, after touching animals, after coughing",
                "Only when they look dirty"
              ],
              "explanation": "Germs are invisible. Wash hands: before eating/cooking, after using the toilet, after changing diapers, after touching animals, after coughing/sneezing, and after touching sick people."
            }
          ]
        }
      }
    },
    "rights": {
      "meta": {
        "title": "Know Your Rights — Redi Health",
        "description": "Patient rights, discrimination help, and legal contacts for Roma communities"
      },
      "title": "Know Your Rights",
      "subtitle": "You have rights as a patient. Learn them. Use them.",
      "back": "Back",
      "menu": {
        "patientRights": {
          "title": "Patient Rights",
          "desc": "8 rights every patient has"
        },
        "discrimination": {
          "title": "Facing Discrimination?",
          "desc": "What to say and do — step by step"
        },
        "contacts": {
          "title": "Legal Help by Country",
          "desc": "Ombudsman, anti-discrimination, Roma orgs"
        }
      },
      "views": {
        "patientRights": "Your Patient Rights",
        "discrimination": "If You Face Discrimination",
        "discriminationDesc": "Real situations and exactly what to say and do.",
        "contacts": "Legal Help by Country"
      },
      "labels": {
        "sayThis": "Say this:",
        "thenDo": "Then do this:",
        "patientOmbudsman": "Patient Ombudsman",
        "antiDiscrimination": "Anti-Discrimination",
        "romaRightsOrg": "Roma Rights Organization"
      },
      "rights": {
        "treatment": {
          "title": "Right to emergency treatment",
          "description": "Every hospital MUST treat you in an emergency, even without insurance or documents. This is law in every EU country. If they refuse, ask for the doctor's name and report it."
        },
        "information": {
          "title": "Right to understand your diagnosis",
          "description": "Your doctor must explain your condition in words you understand. If you don't understand, say: 'Can you explain this more simply?' You can also ask for a written summary."
        },
        "consent": {
          "title": "Right to say no",
          "description": "No one can force treatment on you. Before any procedure, the doctor must explain what they will do and you must agree. You can always say 'I need time to think.'"
        },
        "privacy": {
          "title": "Right to privacy",
          "description": "Your medical information is private. Doctors cannot share it with your employer, family, or anyone else without your permission. This includes your HIV status, pregnancy, or mental health."
        },
        "interpreter": {
          "title": "Right to an interpreter",
          "description": "If you don't speak the local language well, you can request an interpreter. Many hospitals have this service. If not, you can bring someone you trust to translate."
        },
        "second-opinion": {
          "title": "Right to a second opinion",
          "description": "If you disagree with a diagnosis, you can see another doctor. This is your right. You don't need to explain why."
        },
        "records": {
          "title": "Right to your medical records",
          "description": "You can ask for a copy of all your medical records at any time. The hospital must provide them. This is useful when changing doctors or moving to another city."
        },
        "complaint": {
          "title": "Right to complain",
          "description": "If you feel mistreated or discriminated against, you can file a complaint. Every hospital has a complaints procedure. You can also contact the patient ombudsman in your country."
        }
      },
      "scenarios": {
        "refused-treatment": {
          "situation": "The hospital refuses to treat you",
          "whatToSay": "\"I have the right to emergency treatment under EU law. Please write down your name and the reason you are refusing.\"",
          "whatToDo": [
            "Stay calm but firm",
            "Ask for the doctor's full name",
            "Ask for the refusal in writing",
            "Call the patient ombudsman",
            "Contact a Roma rights organization"
          ]
        },
        "rude-staff": {
          "situation": "Hospital staff are rude or dismissive because of your ethnicity",
          "whatToSay": "\"I am here for medical help. I expect to be treated with the same respect as every other patient.\"",
          "whatToDo": [
            "Ask to speak with the head nurse or department chief",
            "Note the date, time, and names",
            "File a written complaint at the hospital",
            "Report to the national anti-discrimination body"
          ]
        },
        "no-insurance": {
          "situation": "You don't have health insurance",
          "whatToSay": "\"I need medical help. What are my options for uninsured patients?\"",
          "whatToDo": [
            "Emergency care is always free — insist on it",
            "Ask about social assistance programs",
            "Contact a health mediator in your area",
            "Many NGOs provide free clinics — ask at the hospital"
          ]
        },
        "language-barrier": {
          "situation": "You can't communicate with the doctor",
          "whatToSay": "\"I need help understanding. Can you provide an interpreter or speak more slowly?\"",
          "whatToDo": [
            "Use this app to translate key phrases",
            "Bring a trusted person who speaks the language",
            "Ask for written instructions you can translate later",
            "Use your phone's camera to translate documents"
          ]
        }
      },
      "contacts": {
        "romania": {
          "country": "Romania",
          "ombudsman": "Avocatul Poporului",
          "antiDiscrimination": "CNCD",
          "ombudsmanPhone": "021 312 7134",
          "antiDiscriminationPhone": "021 312 6578",
          "romaRightsOrg": "Romani CRISS"
        },
        "bulgaria": {
          "country": "Bulgaria",
          "ombudsman": "Ombudsman of Bulgaria",
          "antiDiscrimination": "Commission for Protection against Discrimination",
          "ombudsmanPhone": "02 810 6955",
          "romaRightsOrg": "Amalipe Center"
        },
        "hungary": {
          "country": "Hungary",
          "ombudsman": "Commissioner for Fundamental Rights",
          "antiDiscrimination": "Equal Treatment Authority",
          "ombudsmanPhone": "06 1 475 7100",
          "romaRightsOrg": "Romaversitas Foundation"
        },
        "slovakia": {
          "country": "Slovakia",
          "ombudsman": "Public Defender of Rights",
          "antiDiscrimination": "Slovak National Centre for Human Rights",
          "ombudsmanPhone": "02 4828 7401",
          "romaRightsOrg": "ETP Slovakia"
        },
        "czech-republic": {
          "country": "Czech Republic",
          "ombudsman": "Public Defender of Rights",
          "antiDiscrimination": "Office of the Public Defender",
          "ombudsmanPhone": "542 542 888",
          "romaRightsOrg": "Romea.cz"
        },
        "serbia": {
          "country": "Serbia",
          "ombudsman": "Protector of Citizens",
          "antiDiscrimination": "Commissioner for Equality",
          "ombudsmanPhone": "011 206 8100",
          "romaRightsOrg": "Praxis"
        },
        "albania": {
          "country": "Albania",
          "ombudsman": "People's Advocate",
          "antiDiscrimination": "Commissioner for Protection from Discrimination",
          "ombudsmanPhone": "042 380 300"
        },
        "north-macedonia": {
          "country": "North Macedonia",
          "ombudsman": "Ombudsman",
          "antiDiscrimination": "Commission for Prevention and Protection against Discrimination",
          "ombudsmanPhone": "02 3129 335"
        },
        "greece": {
          "country": "Greece",
          "ombudsman": "Greek Ombudsman",
          "antiDiscrimination": "Greek Ombudsman (Equal Treatment)",
          "ombudsmanPhone": "213 130 6600"
        },
        "croatia": {
          "country": "Croatia",
          "ombudsman": "Ombudswoman",
          "antiDiscrimination": "Ombudswoman",
          "ombudsmanPhone": "01 4851 855"
        }
      }
    },
    "stories": {
      "meta": {
        "title": "Community Stories — Redi Health",
        "description": "Real health experiences from Roma communities across Europe"
      },
      "title": "Community Stories",
      "subtitle": "Real experiences from Roma communities. Learn from others.",
      "backToStories": "Back to stories",
      "lessonLearned": "Lesson learned",
      "whatToDoNext": "What to do next",
      "categories": {
        "vaccines": "Vaccines",
        "chronic": "Chronic Disease",
        "maternal": "Pregnancy",
        "discrimination": "Rights",
        "prevention": "Prevention",
        "mental": "Mental Health"
      },
      "nextSteps": {
        "vaccineGuide": "Vaccine guide",
        "askZuvo": "Ask Zuvo",
        "explainPrescription": "Explain prescription",
        "navigateToCare": "Navigate to care",
        "knowYourRights": "Know your rights",
        "learnPrevention": "Learn prevention",
        "checkSymptoms": "Check symptoms",
        "learnMentalHealth": "Learn about mental health"
      },
      "entries": {
        "maria-vaccines": {
          "name": "Maria",
          "age": 28,
          "country": "Romania",
          "title": "I almost didn't vaccinate my daughter",
          "story": "My mother-in-law told me vaccines are poison. Everyone in the settlement said the same thing. When my daughter was born, I was scared. But the health mediator came to our home and explained everything — how vaccines work, what the side effects really are. She showed me photos of children with measles. I was more scared of the disease than the vaccine. My daughter got all her vaccines. She is healthy and strong.",
          "lesson": "Talk to a health mediator or doctor before making decisions based on what others say. Vaccines save lives."
        },
        "stefan-diabetes": {
          "name": "Stefan",
          "age": 52,
          "country": "Bulgaria",
          "title": "I stopped my diabetes medicine and almost died",
          "story": "I was diagnosed with Type 2 diabetes at 45. The medicine made my stomach hurt, so I stopped taking it. My neighbor said cinnamon tea would cure me. For 2 years I drank cinnamon tea instead. Then one day I collapsed. My blood sugar was over 500. The doctors said my kidneys were damaged. Now I take my medicine every day. I wish I had never stopped.",
          "lesson": "Never stop your medicine without talking to your doctor. Natural remedies cannot replace diabetes medication."
        },
        "elena-pregnancy": {
          "name": "Elena",
          "age": 22,
          "country": "Serbia",
          "title": "My first pregnancy — I didn't know I could see a doctor for free",
          "story": "When I got pregnant at 19, I didn't go to a doctor for 6 months. I didn't have insurance and I thought it would cost too much. A health mediator told me that prenatal care is free for all pregnant women in Serbia. She helped me register. The doctor found that I had anemia and high blood pressure. If I hadn't gone, my baby could have been in danger.",
          "lesson": "Prenatal care is free in most European countries. Ask a health mediator to help you register."
        },
        "janos-discrimination": {
          "name": "János",
          "age": 35,
          "country": "Hungary",
          "title": "The hospital tried to send me away",
          "story": "I went to the emergency room with chest pain. The nurse looked at me and said 'We're full, go to another hospital.' I knew this wasn't right. I said: 'I have chest pain. You must examine me. Please give me your name.' Her attitude changed immediately. They examined me and found I had a heart problem that needed treatment. If I had left, I could have had a heart attack.",
          "lesson": "You have the right to emergency treatment. If someone tries to turn you away, ask for their name and say you know your rights."
        },
        "ana-tb": {
          "name": "Ana",
          "age": 31,
          "country": "Slovakia",
          "title": "TB is not a death sentence — but you must finish the medicine",
          "story": "I was coughing for months. I thought it was just a cold. When I finally went to the doctor, they said I had tuberculosis. I was terrified — I thought I would die. But the doctor explained that TB can be cured with 6 months of medicine. The hardest part was taking pills every day for 6 months, even when I felt better after 2 months. But I finished. I am cured.",
          "lesson": "If you cough for more than 2 weeks, see a doctor. TB is curable, but you MUST finish all the medicine."
        },
        "mirela-depression": {
          "name": "Mirela",
          "age": 40,
          "country": "North Macedonia",
          "title": "Depression is not weakness — it's an illness",
          "story": "After my husband died, I couldn't get out of bed for months. My family said I was lazy. They said 'just be strong.' But I couldn't. A health mediator noticed something was wrong and took me to a doctor. The doctor said I had depression — a real medical condition. I started medicine and talking to a counselor. Slowly, I got better. I am not weak. I was sick.",
          "lesson": "Depression is a medical condition, not a character flaw. Medicine and counseling can help. Please ask for help."
        }
      }
    },
    "challenges": {
      "meta": {
        "title": "Challenges — Redi Health",
        "description": "Community Challenges"
      },
      "title": "Active Challenges",
      "subtitle": "Join community goals and personal challenges to earn bonus XP and badges.",
      "types": {
        "community": "community",
        "personal": "personal"
      },
      "daysLeft": "{count} days left",
      "viewLeaderboard": "View Leaderboard",
      "items": {
        "c1": {
          "title": "Vaccine Knowledge Champion",
          "description": "Get 50 students in your local area to pass the Vaccine module this week."
        },
        "c2": {
          "title": "7-Day Health Streak",
          "description": "Log your mood and water intake for 7 days in a row."
        }
      }
    },
    "certificate": {
      "meta": {
        "title": "Certificate — Redi Health",
        "description": "National Health Literacy Certificate"
      },
      "title": "Your Certificate",
      "subtitle": "You have completed the National Stage of the Student Health Academy.",
      "ofCompletion": "Certificate of Completion",
      "diplomaTitle": "National Health Literacy",
      "awardedFor": "Awarded for completing the Redi Health Student Academy curriculum.",
      "date": "Date",
      "downloadPdf": "Download PDF",
      "share": "Share",
      "gate": {
        "title": "Complete the Academy first",
        "description": "To earn your Health Literacy Certificate, you need to complete all lessons and pass the quiz in the National stage of the Student Health Academy.",
        "cta": "Go to the Academy"
      }
    }
  },
  "bg": {
    "healthQuiz": {
      "meta": {
        "title": "Здравен тест — Redi Health",
        "description": "Тествайте знанията си за здравето с интерактивни тестове"
      },
      "title": "Викторина за здравето",
      "subtitle": "Тествайте знанията си. Научете нещо ново.",
      "backToQuizzes": "Обратно към викторините",
      "seeResults": "Вижте резултатите",
      "nextQuestion": "Следващ въпрос",
      "questionsCount": "{count} въпроса",
      "results": {
        "perfect": "Перфектен резултат!",
        "great": "Страхотна работа!",
        "good": "Добро усилие!",
        "keepLearning": "Продължавай да учиш!",
        "score": "Имате {score} от {total} правилно",
        "tryAgain": "Опитайте отново",
        "moreQuizzes": "Още викторини"
      },
      "quizzes": {
        "antibiotics": {
          "title": "антибиотици",
          "description": "Знаете ли кога да използвате антибиотици?",
          "questions": [
            {
              "question": "Могат ли антибиотиците да излекуват грипа?",
              "options": [
                "да",
                "не",
                "Понякога"
              ],
              "explanation": "Грипът се причинява от вирус. Антибиотиците убиват само бактериите. Приемът на антибиотици за грип не води до нищо и може да направи бъдещите инфекции по-трудни за лечение."
            },
            {
              "question": "Чувствате се по-добре след 3 дни антибиотици. трябва ли да спреш",
              "options": [
                "Да, излекуван си",
                "Не, завършете пълния курс",
                "Вземете половината от останалите хапчета"
              ],
              "explanation": "ВИНАГИ завършвайте пълния курс. Ако спрете рано, някои бактерии оцеляват и стават резистентни. Следващия път същият антибиотик няма да работи."
            },
            {
              "question": "Можете ли да споделите антибиотици с член на семейството, който има подобни симптоми?",
              "options": [
                "Да, спестява пари",
                "Не, никога",
                "Само ако е същото заболяване"
              ],
              "explanation": "Никога не споделяйте антибиотици. Различните инфекции се нуждаят от различни лекарства. Неправилният антибиотик може да бъде опасен и няма да помогне."
            },
            {
              "question": "Какво се случва, ако приемате антибиотици твърде често?",
              "options": [
                "Нищо лошо",
                "Вашето тяло става имунизирано срещу болести",
                "Бактериите стават резистентни и по-трудни за убиване"
              ],
              "explanation": "Антибиотичната резистентност е глобална криза. Когато бактериите станат резистентни, обикновените инфекции могат да станат смъртоносни. Приемайте антибиотици само когато са предписани от лекар."
            }
          ]
        },
        "vaccines": {
          "title": "ваксини",
          "description": "Отделете фактите от митовете",
          "questions": [
            {
              "question": "Причиняват ли ваксините аутизъм?",
              "options": [
                "да",
                "не",
                "ние не знаем"
              ],
              "explanation": "НЕ Този мит започна от измамно проучване, което беше оттеглено. Лекарят, който го е публикувал, е загубил медицинския си лиценз. Десетки проучвания с милиони деца доказват, че ваксините НЕ причиняват аутизъм."
            },
            {
              "question": "Безопасно ли е да се поставят няколко ваксини на бебето наведнъж?",
              "options": [
                "Не, прекалено е",
                "Да, безопасно е и тествано",
                "Само един по един"
              ],
              "explanation": "Имунната система на бебетата се справя с хиляди микроби всеки ден. Комбинираните ваксини са щателно тествани и безопасни. Отлагането на ваксините оставя вашето дете незащитено."
            },
            {
              "question": "Детето ми има лека настинка. Могат ли все още да се ваксинират?",
              "options": [
                "Не, изчакайте, докато станете напълно здрави",
                "Да, лека настинка е добре",
                "Само с лекарско разрешение"
              ],
              "explanation": "Лека настинка, ниска температура или хрема НЕ са причина за забавяне на ваксинацията. Само тежките заболявания изискват отлагане. Попитайте Вашия лекар, ако не сте сигурни."
            },
            {
              "question": "Съдържат ли ваксините опасни химикали?",
              "options": [
                "Да, те са пълни с токсини",
                "Не, всички съставки са безопасни в малките използвани количества",
                "Някои го правят, други не"
              ],
              "explanation": "Съставките на ваксината присъстват в малки, безопасни количества. Вие получавате повече алуминий от кърмата, отколкото от ваксината. Всяка съставка е тествана за безопасност."
            }
          ]
        },
        "diabetes": {
          "title": "Диабет",
          "description": "Разбиране на управлението на диабета",
          "questions": [
            {
              "question": "Причинява ли се диабетът от консумацията на твърде много захар?",
              "options": [
                "да",
                "Не, по-сложно е",
                "Само тип 2"
              ],
              "explanation": "Диабетът се причинява от генетиката, начина на живот и начина, по който тялото ви обработва инсулина. Яденето на захар не го причинява директно, но нездравословната диета и затлъстяването увеличават риска."
            },
            {
              "question": "Може ли диабетът да се излекува с природни средства като канела?",
              "options": [
                "Да, канелата го лекува",
                "Не, няма лек, но може да се управлява",
                "Да, с достатъчно чесън и билки"
              ],
              "explanation": "НЯМА лек за диабет. Може да се управлява с лекарства, здравословна храна и упражнения. Канелата може да има малки ползи, но НЕ МОЖЕ да замени лекарствата. Хората, които спрат лекарствата си, стигат до болница."
            },
            {
              "question": "Човек с диабет се чувства замаян и се поти. Какво трябва да направите?",
              "options": [
                "Дайте им инсулин",
                "Веднага им дайте нещо сладко",
                "Кажете им да си починат"
              ],
              "explanation": "Това са признаци на НИСКА кръвна захар (хипогликемия). Веднага им дайте сок, бонбони или захарна вода. Това може да бъде животозастрашаващо. След като се почувстват по-добре, трябва да се хранят правилно."
            },
            {
              "question": "Колко често един диабетик трябва да проверява краката си?",
              "options": [
                "Никога, краката са добре",
                "всеки ден",
                "Веднъж в годината"
              ],
              "explanation": "Диабетът може да увреди нервите в краката ви. Може да не почувствате порязвания или рани. Проверявайте краката си ВСЕКИ ДЕН за порязвания, мехури или промени в цвета. Малките рани могат да се превърнат в сериозни инфекции."
            }
          ]
        },
        "hygiene": {
          "title": "Хигиена и профилактика",
          "description": "Основни здравословни навици, които спасяват животи",
          "questions": [
            {
              "question": "Колко време трябва да миете ръцете си със сапун?",
              "options": [
                "5 секунди",
                "Поне 20 секунди",
                "1 минута"
              ],
              "explanation": "Измийте най-малко 20 секунди — горе-долу времето, необходимо за изпяване на „Happy Birthday“ два пъти. Това премахва повечето микроби. Бързите изплаквания не работят."
            },
            {
              "question": "Безопасно ли е да се пие вода от река или поток?",
              "options": [
                "Да, естествената вода е чиста",
                "Не, винаги първо го сварете или филтрирайте",
                "Само ако изглежда ясно"
              ],
              "explanation": "Дори чистата вода може да съдържа опасни бактерии и паразити. Винаги кипете вода за поне 1 минута или използвайте филтър. Мръсната вода причинява диария, холера и коремен тиф."
            },
            {
              "question": "Вашето дете има диария. Кое е най-важното?",
              "options": [
                "Спрете всяка храна",
                "Давайте много течности (вода, ORS)",
                "Дайте антибиотици"
              ],
              "explanation": "Дехидратацията от диария убива повече деца, отколкото самата диария. Дайте разтвор за перорална рехидратация (ORS) или чиста вода с щипка сол и захар. Продължавайте да кърмите бебета."
            },
            {
              "question": "Кога трябва да миете ръцете си?",
              "options": [
                "Само преди ядене",
                "Преди хранене, след тоалетна, след докосване на животни, след кашляне",
                "Само когато изглеждат мръсни"
              ],
              "explanation": "Микробите са невидими. Мийте ръцете: преди хранене/готвене, след използване на тоалетна, след смяна на пелени, след докосване на животни, след кашляне/кихане и след докосване на болни хора."
            }
          ]
        }
      }
    },
    "rights": {
      "meta": {
        "title": "Познайте правата си — Redi Health",
        "description": "Права на пациентите, помощ при дискриминация и правни контакти за ромските общности"
      },
      "title": "Знайте правата си",
      "subtitle": "Вие имате права като пациент. Научете ги. Използвайте ги.",
      "back": "Назад",
      "menu": {
        "patientRights": {
          "title": "Права на пациента",
          "desc": "8 права, които всеки пациент има"
        },
        "discrimination": {
          "title": "Изправен пред дискриминация?",
          "desc": "Какво да кажа и направя - стъпка по стъпка"
        },
        "contacts": {
          "title": "Правна помощ по държави",
          "desc": "Омбудсман, антидискриминационни, ромски организации"
        }
      },
      "views": {
        "patientRights": "Вашите права на пациента",
        "discrimination": "Ако сте изправени пред дискриминация",
        "discriminationDesc": "Реални ситуации и какво точно да кажем и направим.",
        "contacts": "Правна помощ по държави"
      },
      "labels": {
        "sayThis": "кажи това:",
        "thenDo": "След това направете това:",
        "patientOmbudsman": "Пациентски омбудсман",
        "antiDiscrimination": "Anti-Discrimination",
        "romaRightsOrg": "Roma Rights Organization"
      },
      "rights": {
        "treatment": {
          "title": "Право на спешно лечение",
          "description": "Всяка болница ТРЯБВА да ви лекува по спешност, дори без застраховка и документи. Това е закон във всяка EU държава. Ако откажат, поискайте името на лекаря и го докладвайте."
        },
        "information": {
          "title": "Право да разбереш диагнозата си",
          "description": "Вашият лекар трябва да обясни Вашето състояние с думи, които разбирате. Ако не разбирате, кажете: „Можете ли да обясните това по-просто?“ Можете също така да поискате писмено резюме."
        },
        "consent": {
          "title": "Право да кажеш не",
          "description": "Никой не може да ви наложи лечение. Преди всяка процедура лекарят трябва да обясни какво ще прави и вие трябва да се съгласите. Винаги можете да кажете „имам нужда от време да помисля“."
        },
        "privacy": {
          "title": "Право на личен живот",
          "description": "Вашата медицинска информация е лична. Лекарите не могат да го споделят с вашия работодател, семейство или някой друг без ваше разрешение. Това включва вашия статус HIV, бременност или психично здраве."
        },
        "interpreter": {
          "title": "Право на преводач",
          "description": "Ако не говорите добре местния език, можете да поискате преводач. Много болници имат тази услуга. Ако не, можете да доведете някой, на когото имате доверие, за превод."
        },
        "second-opinion": {
          "title": "Право на второ мнение",
          "description": "Ако не сте съгласни с диагнозата, можете да посетите друг лекар. Това е ваше право. Не е нужно да обяснявате защо."
        },
        "records": {
          "title": "Право до вашите медицински досиета",
          "description": "Можете да поискате копие от всички ваши медицински досиета по всяко време. Болницата трябва да ги осигури. Това е полезно при смяна на лекар или преместване в друг град."
        },
        "complaint": {
          "title": "Право на оплакване",
          "description": "Ако се чувствате малтретирани или дискриминирани, можете да подадете жалба. Всяка болница има процедура за оплаквания. Можете също така да се свържете с пациентския омбудсман във вашата страна."
        }
      },
      "scenarios": {
        "refused-treatment": {
          "situation": "Болницата отказва да ви лекува",
          "whatToSay": "„Имам право на спешно лечение съгласно закона EU. Моля, запишете името си и причината, поради която отказвате.“",
          "whatToDo": [
            "Запазете спокойствие, но твърдо",
            "Поискайте пълното име на лекаря",
            "Поискайте писмено отказа",
            "Обадете се на пациентския омбудсман",
            "Свържете се с организация за правата на ромите"
          ]
        },
        "rude-staff": {
          "situation": "Болничният персонал е груб или пренебрежителен поради вашия етнически произход",
          "whatToSay": "„Тук съм за медицинска помощ. Очаквам да бъда третиран със същото уважение като всеки друг пациент.“",
          "whatToDo": [
            "Поискайте да говорите с главната сестра или началника на отделението",
            "Отбележете датата, часа и имената",
            "Подайте писмена жалба в болницата",
            "Докладвайте до националния антидискриминационен орган"
          ]
        },
        "no-insurance": {
          "situation": "Нямате здравни осигуровки",
          "whatToSay": "„Имам нужда от медицинска помощ. Какви са възможностите ми за неосигурени пациенти?“",
          "whatToDo": [
            "Спешната помощ винаги е безплатна - настоявайте за това",
            "Попитайте за програми за социално подпомагане",
            "Свържете се със здравен медиатор във вашия район",
            "Много неправителствени организации предоставят безплатни клиники - попитайте в болницата"
          ]
        },
        "language-barrier": {
          "situation": "Не можете да общувате с лекаря",
          "whatToSay": "„Имам нужда от помощ за разбирането. Можете ли да осигурите преводач или да говорите по-бавно?“",
          "whatToDo": [
            "Използвайте това приложение, за да превеждате ключови фрази",
            "Доведете доверен човек, който говори езика",
            "Поискайте писмени инструкции, които можете да преведете по-късно",
            "Използвайте камерата на телефона си, за да превеждате документи"
          ]
        }
      },
      "contacts": {
        "romania": {
          "country": "Romania",
          "ombudsman": "Avocatul Poporului",
          "antiDiscrimination": "CNCD",
          "ombudsmanPhone": "021 312 7134",
          "antiDiscriminationPhone": "021 312 6578",
          "romaRightsOrg": "Romani CRISS"
        },
        "bulgaria": {
          "country": "Bulgaria",
          "ombudsman": "Ombudsman of Bulgaria",
          "antiDiscrimination": "Commission for Protection against Discrimination",
          "ombudsmanPhone": "02 810 6955",
          "romaRightsOrg": "Amalipe Center"
        },
        "hungary": {
          "country": "Hungary",
          "ombudsman": "Commissioner for Fundamental Rights",
          "antiDiscrimination": "Equal Treatment Authority",
          "ombudsmanPhone": "06 1 475 7100",
          "romaRightsOrg": "Romaversitas Foundation"
        },
        "slovakia": {
          "country": "Slovakia",
          "ombudsman": "Public Defender of Rights",
          "antiDiscrimination": "Slovak National Centre for Human Rights",
          "ombudsmanPhone": "02 4828 7401",
          "romaRightsOrg": "ETP Slovakia"
        },
        "czech-republic": {
          "country": "Czech Republic",
          "ombudsman": "Public Defender of Rights",
          "antiDiscrimination": "Office of the Public Defender",
          "ombudsmanPhone": "542 542 888",
          "romaRightsOrg": "Romea.cz"
        },
        "serbia": {
          "country": "Serbia",
          "ombudsman": "Protector of Citizens",
          "antiDiscrimination": "Commissioner for Equality",
          "ombudsmanPhone": "011 206 8100",
          "romaRightsOrg": "Praxis"
        },
        "albania": {
          "country": "Albania",
          "ombudsman": "People's Advocate",
          "antiDiscrimination": "Commissioner for Protection from Discrimination",
          "ombudsmanPhone": "042 380 300"
        },
        "north-macedonia": {
          "country": "North Macedonia",
          "ombudsman": "Ombudsman",
          "antiDiscrimination": "Commission for Prevention and Protection against Discrimination",
          "ombudsmanPhone": "02 3129 335"
        },
        "greece": {
          "country": "Greece",
          "ombudsman": "Greek Ombudsman",
          "antiDiscrimination": "Greek Ombudsman (Equal Treatment)",
          "ombudsmanPhone": "213 130 6600"
        },
        "croatia": {
          "country": "Croatia",
          "ombudsman": "Ombudswoman",
          "antiDiscrimination": "Ombudswoman",
          "ombudsmanPhone": "01 4851 855"
        }
      }
    },
    "stories": {
      "meta": {
        "title": "Истории на общността - Redi Health",
        "description": "Реални здравни преживявания от ромски общности в цяла Европа"
      },
      "title": "Истории от общността",
      "subtitle": "Реални преживявания от ромските общности. Учете се от другите.",
      "backToStories": "Обратно към историите",
      "lessonLearned": "Научен урок",
      "whatToDoNext": "Какво да правя по-нататък",
      "categories": {
        "vaccines": "ваксини",
        "chronic": "Хронично заболяване",
        "maternal": "Бременност",
        "discrimination": "права",
        "prevention": "Профилактика",
        "mental": "Психично здраве"
      },
      "nextSteps": {
        "vaccineGuide": "Ръководство за ваксини",
        "askZuvo": "Питай Зуво",
        "explainPrescription": "Обяснете предписанието",
        "navigateToCare": "Навигирайте до грижа",
        "knowYourRights": "Знайте правата си",
        "learnPrevention": "Научете превенция",
        "checkSymptoms": "Проверете симптомите",
        "learnMentalHealth": "Научете за психичното здраве"
      },
      "entries": {
        "maria-vaccines": {
          "name": "Maria",
          "age": "28",
          "country": "Румъния",
          "title": "Почти не ваксинирах дъщеря си",
          "story": "Свекърва ми ми каза, че ваксините са отрова. Всички в селището казаха същото. Когато дъщеря ми се роди, се уплаших. Но здравният медиатор дойде в дома ни и ни обясни всичко — как действат ваксините, какви са всъщност страничните ефекти. Тя ми показа снимки на деца с морбили. Страхувах се повече от болестта, отколкото от ваксината. Дъщеря ми получи всички ваксини. Тя е здрава и силна.",
          "lesson": "Говорете със здравен медиатор или лекар, преди да вземете решения въз основа на казаното от другите. Ваксините спасяват животи."
        },
        "stefan-diabetes": {
          "name": "Stefan",
          "age": "52",
          "country": "България",
          "title": "Спрях лекарството си за диабет и почти умрях",
          "story": "Бях диагностициран с диабет тип 2 на 45. От лекарството ме заболя стомаха и спрях да го приемам. Съседът ми каза, че чай с канела ще ме излекува. В продължение на 2 години вместо това пих чай с канела. Тогава един ден се сринах. Кръвната ми захар беше над 500. Лекарите казаха, че бъбреците ми са увредени. Сега си пия лекарството всеки ден. Иска ми се никога да не съм спирал.",
          "lesson": "Никога не спирайте приема на лекарството, без да говорите с Вашия лекар. Естествените лекарства не могат да заменят лекарствата за диабет."
        },
        "elena-pregnancy": {
          "name": "Elena",
          "age": "22",
          "country": "Сърбия",
          "title": "Първата ми бременност — не знаех, че мога да посетя лекар безплатно",
          "story": "Когато забременях на 19, не съм ходила на лекар 6 месеца. Нямах застраховка и си помислих, че ще струва твърде скъпо. Здравен медиатор ми каза, че пренаталните грижи са безплатни за всички бременни жени в Сърбия. Тя ми помогна да се регистрирам. Лекарят установи, че имам анемия и високо кръвно. Ако не бях отишла, бебето ми можеше да е в опасност.",
          "lesson": "Пренаталните грижи са безплатни в повечето европейски страни. Помолете здравен медиатор да ви помогне да се регистрирате."
        },
        "janos-discrimination": {
          "name": "János",
          "age": "35",
          "country": "Унгария",
          "title": "От болницата се опитаха да ме отпратят",
          "story": "Отидох в спешното с болки в гърдите. Сестрата ме погледна и каза: „Пити сме, отидете в друга болница“. Знаех, че това не е правилно. Казах: „Имам болки в гърдите. Трябва да ме прегледате. Моля, дайте ми името си. Отношението й веднага се промени. Прегледаха ме и установиха, че имам сърдечен проблем, който се нуждае от лечение. Ако бях напуснал, можеше да получа инфаркт.",
          "lesson": "Имате право на спешно лечение. Ако някой се опита да ви отблъсне, попитайте за името му и кажете, че знаете правата си."
        },
        "ana-tb": {
          "name": "Ana",
          "age": "31",
          "country": "Словакия",
          "title": "TB не е смъртна присъда — но трябва да довършите лекарството",
          "story": "Кашлях с месеци. Мислех, че е просто настинка. Когато най-накрая отидох на лекар, казаха, че имам туберкулоза. Бях ужасен — мислех, че ще умра. Но лекарят обясни, че TB може да се излекува с 6 месеца лекарства. Най-трудното беше да пия хапчета всеки ден в продължение на 6 месеца, дори когато се почувствах по-добре след 2 месеца. Но свърших. излекуван съм.",
          "lesson": "Ако кашляте повече от 2 седмици, посетете лекар. TB е лечимо, но ТРЯБВА да изпиете цялото лекарство."
        },
        "mirela-depression": {
          "name": "Mirela",
          "age": "40",
          "country": "Северна Македония",
          "title": "Депресията не е слабост - тя е болест",
          "story": "След като съпругът ми почина, месеци наред не можех да стана от леглото. Семейството ми каза, че съм мързелив. Те казаха „просто бъди силен“. Но не можах. Здравен медиатор забеляза, че нещо не е наред и ме заведе на лекар. Лекарят каза, че имам депресия - истинско медицинско състояние. Започнах медицина и говорих с консултант. Бавно се оправих. не съм слаба. бях болен.",
          "lesson": "Депресията е медицинско състояние, а не недостатък на характера. Медицината и консултирането могат да помогнат. Моля, помолете за помощ."
        }
      }
    },
    "challenges": {
      "meta": {
        "title": "Предизвикателства — Redi Health",
        "description": "Предизвикателства на общността"
      },
      "title": "Активни предизвикателства",
      "subtitle": "Присъединете се към целите на общността и личните предизвикателства, за да спечелите бонус XP и значки.",
      "types": {
        "community": "общност",
        "personal": "лични"
      },
      "daysLeft": "Остават {count} дни",
      "viewLeaderboard": "Преглед на класацията",
      "items": {
        "c1": {
          "title": "Шампион по знания за ваксините",
          "description": "Накарайте 50 ученици във вашия район да преминат модула за ваксини тази седмица."
        },
        "c2": {
          "title": "7-дневна поредица от здраве",
          "description": "Записвайте настроението и приема на вода за 7 поредни дни."
        }
      }
    },
    "certificate": {
      "meta": {
        "title": "Сертификат — Redi Health",
        "description": "Национален сертификат за здравна грамотност"
      },
      "title": "Вашият сертификат",
      "subtitle": "Завършихте Националния етап на Студентска здравна академия.",
      "ofCompletion": "Сертификат за завършен курс",
      "diplomaTitle": "Национална здравна грамотност",
      "awardedFor": "Награждава се за завършване на учебната програма на Redi Health Student Academy.",
      "date": "Дата",
      "downloadPdf": "Изтеглете PDF",
      "share": "Споделете",
      "gate": {
        "title": "Първо завършете Академията",
        "description": "За да спечелите своя сертификат за здравна грамотност, трябва да завършите всички уроци и да преминете теста в Националния етап на Студентската здравна академия.",
        "cta": "Отидете в Академията"
      }
    }
  },
  "bs": {
    "healthQuiz": {
      "meta": {
        "title": "Kviz zdravlja — Redi Health",
        "description": "Testirajte svoje zdravstveno znanje interaktivnim kvizovima"
      },
      "title": "Health Quiz",
      "subtitle": "Testirajte svoje znanje. Naučite nešto novo.",
      "backToQuizzes": "Nazad na kvizove",
      "seeResults": "Pogledajte rezultate",
      "nextQuestion": "Sljedeće pitanje",
      "questionsCount": "{count} pitanja",
      "results": {
        "perfect": "Savršen rezultat!",
        "great": "Odličan posao!",
        "good": "Dobar trud!",
        "keepLearning": "Nastavite učiti!",
        "score": "Dobili ste {score} od {total} ispravno",
        "tryAgain": "Pokušajte ponovo",
        "moreQuizzes": "Više kvizova"
      },
      "quizzes": {
        "antibiotics": {
          "title": "Antibiotici",
          "description": "Da li znate kada treba koristiti antibiotike?",
          "questions": [
            {
              "question": "Mogu li antibiotici izliječiti gripu?",
              "options": [
                "Da",
                "br",
                "Ponekad"
              ],
              "explanation": "Gripu izaziva virus. Antibiotici ubijaju samo bakterije. Uzimanje antibiotika za gripu ne čini ništa i može otežati liječenje budućih infekcija."
            },
            {
              "question": "Osjećate se bolje nakon 3 dana uzimanja antibiotika. Treba li prestati?",
              "options": [
                "Da, izliječeni ste",
                "Ne, završi ceo kurs",
                "Uzmi polovinu preostalih tableta"
              ],
              "explanation": "UVIJEK završite cijeli kurs. Ako prestanete rano, neke bakterije prežive i postanu otporne. Sljedeći put, isti antibiotik neće djelovati."
            },
            {
              "question": "Možete li podijeliti antibiotike sa članom porodice koji ima slične simptome?",
              "options": [
                "Da, štedi novac",
                "Ne, nikad",
                "Samo ako je u pitanju ista bolest"
              ],
              "explanation": "Nikad ne dijelite antibiotike. Za različite infekcije su potrebni različiti lijekovi. Pogrešan antibiotik može biti opasan i neće pomoći."
            },
            {
              "question": "Šta se dešava ako prečesto uzimate antibiotike?",
              "options": [
                "Ništa loše",
                "Vaše tijelo postaje imuno na bolesti",
                "Bakterije postaju otporne i teže ih je ubiti"
              ],
              "explanation": "Otpornost na antibiotike je globalna kriza. Kada bakterije postanu otporne, jednostavne infekcije mogu postati smrtonosne. Antibiotike uzimajte samo kada ih lekar prepiše."
            }
          ]
        },
        "vaccines": {
          "title": "Vakcine",
          "description": "Odvojite činjenice od mitova",
          "questions": [
            {
              "question": "Da li vakcine izazivaju autizam?",
              "options": [
                "Da",
                "br",
                "Ne znamo"
              ],
              "explanation": "NO. Ovaj mit je započeo iz lažne studije koja je povučena. Doktor koji ga je objavio izgubio je ljekarsku dozvolu. Desetine studija sa milionima dece dokazuju da vakcine NE izazivaju autizam."
            },
            {
              "question": "Da li je bezbedno dati bebi više vakcina odjednom?",
              "options": [
                "Ne, to je previše",
                "Da, siguran je i testiran",
                "Samo jedan po jedan"
              ],
              "explanation": "Imuni sistem beba svakodnevno se nosi sa hiljadama mikroba. Kombinovane vakcine su temeljno testirane i bezbedne. Odgađanje vakcinacije ostavlja vaše dijete nezaštićenim."
            },
            {
              "question": "Moje dijete ima blagu prehladu. Mogu li se i dalje vakcinisati?",
              "options": [
                "Ne, sačekajte dok ne budete potpuno zdravi",
                "Da, blaga prehlada je u redu",
                "Samo uz dozvolu ljekara"
              ],
              "explanation": "Blaga prehlada, niska temperatura ili curenje iz nosa NISU razlog za odgađanje vakcinacije. Samo teška bolest zahtijeva odlaganje. Pitajte svog doktora ako niste sigurni."
            },
            {
              "question": "Da li vakcine sadrže opasne hemikalije?",
              "options": [
                "Da, puni su toksina",
                "Ne, svi sastojci su sigurni u malim količinama koje se koriste",
                "Neki to rade, neki ne"
              ],
              "explanation": "Sastojci vakcine prisutni su u malim, sigurnim količinama. Više aluminijuma dobijate iz majčinog mleka nego iz vakcine. Svaki sastojak je testiran na sigurnost."
            }
          ]
        },
        "diabetes": {
          "title": "Dijabetes",
          "description": "Razumijevanje upravljanja dijabetesom",
          "questions": [
            {
              "question": "Da li je dijabetes uzrokovan unosom previše šećera?",
              "options": [
                "Da",
                "Ne, složenije je",
                "Samo tip 2"
              ],
              "explanation": "Dijabetes je uzrokovan genetikom, načinom života i načinom na koji vaše tijelo obrađuje inzulin. Konzumiranje šećera ga ne uzrokuje direktno, ali nezdrava ishrana i gojaznost povećavaju rizik."
            },
            {
              "question": "Može li se dijabetes izliječiti prirodnim lijekovima poput cimeta?",
              "options": [
                "Da, cimet to liječi",
                "Ne, ne postoji lijek, ali se njime može upravljati",
                "Da, sa dovoljno belog luka i začinskog bilja"
              ],
              "explanation": "NEMA lijeka za dijabetes. Njime se može upravljati lijekovima, zdravom hranom i vježbanjem. Cimet može imati male koristi, ali NE MOŽE zamijeniti lijekove. Ljudi koji prestanu uzimati lijekove završavaju u bolnici."
            },
            {
              "question": "Osoba sa dijabetesom osjeća vrtoglavicu i znojenje. Šta treba da uradite?",
              "options": [
                "Dajte im insulin",
                "Odmah im dajte nešto slatko",
                "Reci im da se odmore"
              ],
              "explanation": "Ovo su znaci NISKOG šećera u krvi (hipoglikemija). Odmah im dajte sok, bombone ili vodu sa šećerom. Ovo može biti opasno po život. Nakon što se osete bolje, trebalo bi da jedu odgovarajući obrok."
            },
            {
              "question": "Koliko često dijabetičar treba da kontroliše svoja stopala?",
              "options": [
                "Nikada, stopala su u redu",
                "Svaki dan",
                "Jednom godišnje"
              ],
              "explanation": "Dijabetes može oštetiti nerve u vašim stopalima. Možda nećete osjetiti posjekotine ili rane. SVAKI DAN provjeravajte svoja stopala da li ima posjekotina, žuljeva ili promjena boje. Male rane mogu postati ozbiljne infekcije."
            }
          ]
        },
        "hygiene": {
          "title": "Higijena i prevencija",
          "description": "Osnovne zdravstvene navike koje spašavaju živote",
          "questions": [
            {
              "question": "Koliko dugo treba da perete ruke sapunom?",
              "options": [
                "5 sekundi",
                "Najmanje 20 sekundi",
                "1 minuta"
              ],
              "explanation": "Perite najmanje 20 sekundi — otprilike koliko je potrebno da otpjevate 'Happy Birthday' dvaput. Ovo uklanja većinu klica. Brza ispiranja ne rade."
            },
            {
              "question": "Da li je bezbedno piti vodu iz reke ili potoka?",
              "options": [
                "Da, prirodna voda je čista",
                "Ne, uvijek ga prvo prokuhajte ili filtrirajte",
                "Samo ako izgleda jasno"
              ],
              "explanation": "Čak i čista voda može sadržavati opasne bakterije i parazite. Vodu uvijek kuhajte najmanje 1 minutu ili koristite filter. Prljava voda uzrokuje dijareju, koleru i tifus."
            },
            {
              "question": "Vaše dijete ima dijareju. Šta je najvažnije?",
              "options": [
                "Zaustavite svu hranu",
                "Dajte puno tečnosti (voda, ORS)",
                "Dajte antibiotike"
              ],
              "explanation": "Dehidracija od proljeva ubija više djece nego sama dijareja. Dajte oralnu otopinu za rehidraciju (ORS) ili čistu vodu sa prstohvatom soli i šećera. Nastavite da dojite bebe."
            },
            {
              "question": "Kada treba da perete ruke?",
              "options": [
                "Samo prije jela",
                "Prije jela, nakon toaleta, nakon dodirivanja životinja, nakon kašlja",
                "Samo kada izgledaju prljavo"
              ],
              "explanation": "Klice su nevidljive. Operite ruke: prije jela/kuvanja, nakon korištenja toaleta, nakon mijenjanja pelena, nakon dodirivanja životinja, nakon kašljanja/kihanja i nakon dodirivanja bolesnih ljudi."
            }
          ]
        }
      }
    },
    "rights": {
      "meta": {
        "title": "Upoznajte svoja prava — Redi Health",
        "description": "Prava pacijenata, pomoć u borbi protiv diskriminacije i pravni kontakti za romske zajednice"
      },
      "title": "Upoznajte svoja prava",
      "subtitle": "Vi imate prava kao pacijent. Naučite ih. Iskoristi ih.",
      "back": "Nazad",
      "menu": {
        "patientRights": {
          "title": "Prava pacijenata",
          "desc": "8 prava koje svaki pacijent ima"
        },
        "discrimination": {
          "title": "Suočavanje s diskriminacijom?",
          "desc": "Šta reći i učiniti — korak po korak"
        },
        "contacts": {
          "title": "Pravna pomoć po zemljama",
          "desc": "Ombudsman, antidiskriminacija, romske organizacije"
        }
      },
      "views": {
        "patientRights": "Vaša prava pacijenata",
        "discrimination": "Ako se suočite sa diskriminacijom",
        "discriminationDesc": "Stvarne situacije i šta tačno reći i učiniti.",
        "contacts": "Pravna pomoć po zemljama"
      },
      "labels": {
        "sayThis": "reci ovo:",
        "thenDo": "Zatim uradite ovo:",
        "patientOmbudsman": "Ombudsman za pacijente",
        "antiDiscrimination": "Anti-Discrimination",
        "romaRightsOrg": "Roma Rights Organization"
      },
      "rights": {
        "treatment": {
          "title": "Pravo na hitno liječenje",
          "description": "Svaka bolnica vas MORA hitno liječiti, čak i bez osiguranja ili dokumenata. Ovo je zakon u svakoj EU zemlji. Ako odbiju, zatražite ime doktora i prijavite ga."
        },
        "information": {
          "title": "Pravo da razumem tvoju dijagnozu",
          "description": "Vaš lekar mora da objasni Vaše stanje rečima koje razumete. Ako ne razumijete, recite: 'Možete li ovo jednostavnije objasniti?' Također možete zatražiti pisani sažetak."
        },
        "consent": {
          "title": "Pravo reći ne",
          "description": "Niko vas ne može prisiliti na liječenje. Prije bilo kakvog zahvata, ljekar mora objasniti šta će učiniti, a vi se morate složiti. Uvijek možete reći 'Treba mi vremena da razmislim.'"
        },
        "privacy": {
          "title": "Pravo na privatnost",
          "description": "Vaši medicinski podaci su privatni. Doktori ne mogu to podijeliti s vašim poslodavcem, porodicom ili bilo kim drugim bez vaše dozvole. Ovo uključuje vaš HIV status, trudnoću ili mentalno zdravlje."
        },
        "interpreter": {
          "title": "Pravo na prevodioca",
          "description": "Ako ne govorite dobro lokalni jezik, možete zatražiti tumača. Mnoge bolnice imaju ovu uslugu. Ako ne, možete dovesti nekoga kome vjerujete da prevede."
        },
        "second-opinion": {
          "title": "Pravo na drugo mišljenje",
          "description": "Ako se ne slažete sa dijagnozom, možete se obratiti drugom lekaru. Ovo je tvoje pravo. Ne morate objašnjavati zašto."
        },
        "records": {
          "title": "Pravo na vašu medicinsku dokumentaciju",
          "description": "U svakom trenutku možete zatražiti kopiju svih vaših medicinskih kartona. Bolnica ih mora obezbijediti. Ovo je korisno prilikom promjene doktora ili selidbe u drugi grad."
        },
        "complaint": {
          "title": "Pravo na žalbu",
          "description": "Ako se osjećate maltretiranim ili diskriminiranim, možete podnijeti žalbu. Svaka bolnica ima proceduru za pritužbe. Također možete kontaktirati ombudsmana za pacijente u svojoj zemlji."
        }
      },
      "scenarios": {
        "refused-treatment": {
          "situation": "Bolnica odbija da vas leči",
          "whatToSay": "\"Imam pravo na hitno liječenje prema EU zakonu. Molimo zapišite svoje ime i razlog zašto odbijate.\"",
          "whatToDo": [
            "Ostanite mirni, ali čvrsti",
            "Pitajte puno ime doktora",
            "Zatražite odbijanje pismeno",
            "Pozovite ombudsmana za pacijente",
            "Obratite se organizaciji za prava Roma"
          ]
        },
        "rude-staff": {
          "situation": "Osoblje bolnice je nepristojno ili prezirno zbog vaše nacionalnosti",
          "whatToSay": "\"Ovdje sam radi medicinske pomoći. Očekujem da ću se prema meni odnositi s poštovanjem kao i prema svakom drugom pacijentu.\"",
          "whatToDo": [
            "Zamolite da razgovarate sa glavnom medicinskom sestrom ili šefom odjeljenja",
            "Zabilježite datum, vrijeme i imena",
            "Podnesite pismenu žalbu u bolnici",
            "Prijavite se nacionalnom tijelu za borbu protiv diskriminacije"
          ]
        },
        "no-insurance": {
          "situation": "Nemate zdravstveno osiguranje",
          "whatToSay": "\"Treba mi medicinska pomoć. Koje su moje mogućnosti za neosigurane pacijente?\"",
          "whatToDo": [
            "Hitna pomoć je uvijek besplatna - insistirajte na tome",
            "Pitajte o programima socijalne pomoći",
            "Obratite se zdravstvenom posredniku u vašem području",
            "Mnoge nevladine organizacije pružaju besplatne klinike - pitajte u bolnici"
          ]
        },
        "language-barrier": {
          "situation": "Ne možete komunicirati sa doktorom",
          "whatToSay": "\"Treba mi pomoć u razumijevanju. Možete li mi dati prevodioca ili govorite sporije?\"",
          "whatToDo": [
            "Koristite ovu aplikaciju za prevođenje ključnih fraza",
            "Dovedite osobu od povjerenja koja govori jezik",
            "Zatražite pismene upute koje možete prevesti kasnije",
            "Koristite kameru svog telefona za prevođenje dokumenata"
          ]
        }
      },
      "contacts": {
        "romania": {
          "country": "Romania",
          "ombudsman": "Avocatul Poporului",
          "antiDiscrimination": "CNCD",
          "ombudsmanPhone": "021 312 7134",
          "antiDiscriminationPhone": "021 312 6578",
          "romaRightsOrg": "Romani CRISS"
        },
        "bulgaria": {
          "country": "Bulgaria",
          "ombudsman": "Ombudsman of Bulgaria",
          "antiDiscrimination": "Commission for Protection against Discrimination",
          "ombudsmanPhone": "02 810 6955",
          "romaRightsOrg": "Amalipe Center"
        },
        "hungary": {
          "country": "Hungary",
          "ombudsman": "Commissioner for Fundamental Rights",
          "antiDiscrimination": "Equal Treatment Authority",
          "ombudsmanPhone": "06 1 475 7100",
          "romaRightsOrg": "Romaversitas Foundation"
        },
        "slovakia": {
          "country": "Slovakia",
          "ombudsman": "Public Defender of Rights",
          "antiDiscrimination": "Slovak National Centre for Human Rights",
          "ombudsmanPhone": "02 4828 7401",
          "romaRightsOrg": "ETP Slovakia"
        },
        "czech-republic": {
          "country": "Czech Republic",
          "ombudsman": "Public Defender of Rights",
          "antiDiscrimination": "Office of the Public Defender",
          "ombudsmanPhone": "542 542 888",
          "romaRightsOrg": "Romea.cz"
        },
        "serbia": {
          "country": "Serbia",
          "ombudsman": "Protector of Citizens",
          "antiDiscrimination": "Commissioner for Equality",
          "ombudsmanPhone": "011 206 8100",
          "romaRightsOrg": "Praxis"
        },
        "albania": {
          "country": "Albania",
          "ombudsman": "People's Advocate",
          "antiDiscrimination": "Commissioner for Protection from Discrimination",
          "ombudsmanPhone": "042 380 300"
        },
        "north-macedonia": {
          "country": "North Macedonia",
          "ombudsman": "Ombudsman",
          "antiDiscrimination": "Commission for Prevention and Protection against Discrimination",
          "ombudsmanPhone": "02 3129 335"
        },
        "greece": {
          "country": "Greece",
          "ombudsman": "Greek Ombudsman",
          "antiDiscrimination": "Greek Ombudsman (Equal Treatment)",
          "ombudsmanPhone": "213 130 6600"
        },
        "croatia": {
          "country": "Croatia",
          "ombudsman": "Ombudswoman",
          "antiDiscrimination": "Ombudswoman",
          "ombudsmanPhone": "01 4851 855"
        }
      }
    },
    "stories": {
      "meta": {
        "title": "Priče zajednice — Redi Health",
        "description": "Prava zdravstvena iskustva iz romskih zajednica širom Evrope"
      },
      "title": "Priče zajednice",
      "subtitle": "Prava iskustva iz romskih zajednica. Učite od drugih.",
      "backToStories": "Nazad na priče",
      "lessonLearned": "Naučena lekcija",
      "whatToDoNext": "Šta dalje",
      "categories": {
        "vaccines": "Vakcine",
        "chronic": "Hronična bolest",
        "maternal": "Trudnoća",
        "discrimination": "Prava",
        "prevention": "Prevencija",
        "mental": "Mentalno zdravlje"
      },
      "nextSteps": {
        "vaccineGuide": "Vodič za vakcinu",
        "askZuvo": "Pitaj Zuvo",
        "explainPrescription": "Objasnite recept",
        "navigateToCare": "Navigirajte do brige",
        "knowYourRights": "Znajte svoja prava",
        "learnPrevention": "Naučite prevenciju",
        "checkSymptoms": "Provjerite simptome",
        "learnMentalHealth": "Naučite o mentalnom zdravlju"
      },
      "entries": {
        "maria-vaccines": {
          "name": "Maria",
          "age": "28",
          "country": "Rumunija",
          "title": "Zamalo da nisam vakcinisao svoju ćerku",
          "story": "Moja svekrva mi je rekla da su vakcine otrov. Svi u naselju su rekli isto. Kada mi se rodila ćerka, bila sam uplašena. Ali zdravstveni posrednik je došao u naš dom i sve nam objasnio – kako vakcine djeluju, kakve su zapravo nuspojave. Pokazala mi je fotografije djece oboljele od morbila. Više sam se plašio bolesti nego vakcine. Moja ćerka je dobila sve vakcine. Zdrava je i jaka.",
          "lesson": "Razgovarajte sa zdravstvenim posrednikom ili doktorom prije donošenja odluka na osnovu onoga što drugi kažu. Vakcine spašavaju živote."
        },
        "stefan-diabetes": {
          "name": "Stefan",
          "age": "52",
          "country": "Bugarska",
          "title": "Prestao sam uzimati lijekove za dijabetes i zamalo umro",
          "story": "Dijagnostikovan mi je dijabetes tipa 2 u 45. Od lijeka me je zabolio stomak, pa sam prestala da ga uzimam. Moj komšija je rekao da će me čaj od cimeta izliječiti. Umjesto toga, dvije godine sam pio čaj od cimeta. Onda sam jednog dana kolabirala. Šećer mi je bio preko 500. Doktori su rekli da su mi bubrezi oštećeni. Sada uzimam lijekove svaki dan. Voleo bih da nikad nisam stao.",
          "lesson": "Nikada nemojte prestati da uzimate lek bez razgovora sa lekarom. Prirodni lijekovi ne mogu zamijeniti lijekove za dijabetes."
        },
        "elena-pregnancy": {
          "name": "Elena",
          "age": "22",
          "country": "Srbija",
          "title": "Moja prva trudnoća — nisam znala da mogu besplatno da odem kod doktora",
          "story": "Kada sam zatrudnjela u 19, nisam išla kod doktora 6 mjeseci. Nisam imao osiguranje i mislio sam da će koštati previše. Zdravstvena medijatorka mi je rekla da je prenatalna nega besplatna za sve trudnice u Srbiji. Pomogla mi je da se registrujem. Doktor je ustanovio da imam anemiju i visok krvni pritisak. Da nisam otišla, moja beba bi mogla biti u opasnosti.",
          "lesson": "Prenatalna njega je besplatna u većini evropskih zemalja. Zamolite zdravstvenog posrednika da vam pomogne u registraciji."
        },
        "janos-discrimination": {
          "name": "János",
          "age": "35",
          "country": "Mađarska",
          "title": "Bolnica je pokušala da me otera",
          "story": "Otišla sam u hitnu sa bolovima u grudima. Sestra me je pogledala i rekla 'Piti smo, idi u drugu bolnicu.' Znao sam da ovo nije u redu. Rekao sam: 'Imam bolove u grudima. Morate me pregledati. Molim te daj mi svoje ime.' Njen stav se odmah promenio. Pregledali su me i ustanovili da imam problem sa srcem koji treba liječiti. Da sam otišao, mogao sam dobiti srčani udar.",
          "lesson": "Imate pravo na hitan tretman. Ako vas neko pokuša odbiti, pitajte za njegovo ime i recite da znate svoja prava."
        },
        "ana-tb": {
          "name": "Ana",
          "age": "31",
          "country": "Slovakia",
          "title": "TB nije smrtna kazna — ali morate završiti lijek",
          "story": "Kašljao sam mjesecima. Mislio sam da je samo prehlada. Kada sam konačno otišao kod doktora, rekli su mi da imam tuberkulozu. Bio sam prestravljen — mislio sam da ću umrijeti. Ali doktor je objasnio da se TB može izliječiti uz 6 mjeseci lijeka. Najteže je bilo uzimati tablete svaki dan 6 mjeseci, čak i kada sam se osjećala bolje nakon 2 mjeseca. Ali završio sam. Izliječen sam.",
          "lesson": "Ako kašljete duže od 2 sedmice, posjetite ljekara. TB je izlječiv, ali MORATE završiti sve lijekove."
        },
        "mirela-depression": {
          "name": "Mirela",
          "age": "40",
          "country": "Sjeverna Makedonija",
          "title": "Depresija nije slabost – to je bolest",
          "story": "Nakon što mi je muž umro, mjesecima nisam mogla ustati iz kreveta. Moja porodica je rekla da sam lijen. Rekli su 'samo budi jak'. Ali nisam mogao. Zdravstveni posrednik je primijetio da nešto nije u redu i odveo me kod doktora. Doktor je rekao da imam depresiju - pravo zdravstveno stanje. Počeo sam s medicinom i razgovarao sa savjetnikom. Polako mi je bilo bolje. Nisam slaba. Bio sam bolestan.",
          "lesson": "Depresija je medicinsko stanje, a ne karakterna mana. Medicina i savjetovanje mogu pomoći. Zamolite za pomoć."
        }
      }
    },
    "challenges": {
      "meta": {
        "title": "Izazovi — Redi Health",
        "description": "Izazovi zajednice"
      },
      "title": "Aktivni izazovi",
      "subtitle": "Pridružite se ciljevima zajednice i ličnim izazovima da zaradite bonus XP i značke.",
      "types": {
        "community": "zajednica",
        "personal": "lični"
      },
      "daysLeft": "Još {count} dana",
      "viewLeaderboard": "Pogledajte Leaderboard",
      "items": {
        "c1": {
          "title": "Šampion znanja o vakcinama",
          "description": "Omogućite 50 učenika u vašem lokalnom području da ove sedmice prođu modul vakcine."
        },
        "c2": {
          "title": "7-dnevni zdravstveni niz",
          "description": "Zabilježite svoje raspoloženje i unos vode 7 dana za redom."
        }
      }
    },
    "certificate": {
      "meta": {
        "title": "Sertifikat — Redi Health",
        "description": "Nacionalni sertifikat o zdravstvenoj pismenosti"
      },
      "title": "Vaš certifikat",
      "subtitle": "Završili ste Nacionalnu fazu Studentske zdravstvene akademije.",
      "ofCompletion": "Potvrda o završetku",
      "diplomaTitle": "Nacionalna zdravstvena pismenost",
      "awardedFor": "Dodjeljuje se za završetak nastavnog plana i programa Redi Health Student Academy.",
      "date": "Datum",
      "downloadPdf": "Preuzmite PDF",
      "share": "Dijeli",
      "gate": {
        "title": "Prvo završite Akademiju",
        "description": "Da biste stekli sertifikat zdravstvene pismenosti, potrebno je da završite sve lekcije i položite kviz u nacionalnoj fazi Studentske zdravstvene akademije.",
        "cta": "Idi na Akademiju"
      }
    }
  },
  "cs": {
    "healthQuiz": {
      "meta": {
        "title": "Zdravotní kvíz — Redi Health",
        "description": "Otestujte si své zdravotní znalosti pomocí interaktivních kvízů"
      },
      "title": "Zdravotní kvíz",
      "subtitle": "Otestujte si své znalosti. Naučte se něco nového.",
      "backToQuizzes": "Zpět ke kvízům",
      "seeResults": "Zobrazit výsledky",
      "nextQuestion": "Další otázka",
      "questionsCount": "{count} otázek",
      "results": {
        "perfect": "Perfektní skóre!",
        "great": "Skvělá práce!",
        "good": "Dobrá snaha!",
        "keepLearning": "Učte se dál!",
        "score": "Správně jste získali {score} z {total}",
        "tryAgain": "Zkuste to znovu",
        "moreQuizzes": "Další kvízy"
      },
      "quizzes": {
        "antibiotics": {
          "title": "Antibiotika",
          "description": "Víte, kdy nasadit antibiotika?",
          "questions": [
            {
              "question": "Mohou antibiotika vyléčit chřipku?",
              "options": [
                "Ano",
                "Ne",
                "Někdy"
              ],
              "explanation": "Chřipka je způsobena virem. Antibiotika ničí pouze bakterie. Užívání antibiotik na chřipku nic neřeší a může ztížit léčbu budoucích infekcí."
            },
            {
              "question": "Po 3 dnech užívání antibiotik se cítíte lépe. Měl bys přestat?",
              "options": [
                "Ano, jsi vyléčený",
                "Ne, dokončete celý kurz",
                "Vezměte polovinu zbývajících pilulek"
              ],
              "explanation": "VŽDY dokončete celý kurz. Pokud přestanete brzy, některé bakterie přežijí a stanou se odolnými. Příště stejné antibiotikum nezabere."
            },
            {
              "question": "Můžete sdílet antibiotika s členem rodiny, který má podobné příznaky?",
              "options": [
                "Ano, šetří to peníze",
                "Ne, nikdy",
                "Jen jestli je to stejná nemoc"
              ],
              "explanation": "Nikdy nesdílejte antibiotika. Různé infekce vyžadují různé léky. Nesprávné antibiotikum může být nebezpečné a nepomůže."
            },
            {
              "question": "Co se stane, když užíváte antibiotika příliš často?",
              "options": [
                "Nic špatného",
                "Vaše tělo se stává imunní vůči nemocem",
                "Bakterie se stávají odolnými a je těžší je zabít"
              ],
              "explanation": "Rezistence na antibiotika je celosvětová krize. Když se bakterie stanou odolnými, jednoduché infekce se mohou stát smrtelnými. Antibiotika užívejte pouze tehdy, když je předepíše lékař."
            }
          ]
        },
        "vaccines": {
          "title": "Vakcíny",
          "description": "Oddělte fakta od mýtů",
          "questions": [
            {
              "question": "Způsobují vakcíny autismus?",
              "options": [
                "Ano",
                "Ne",
                "Nevíme"
              ],
              "explanation": "NE. Tento mýtus vycházel z podvodné studie, která byla stažena. Lékař, který to zveřejnil, přišel o lékařskou licenci. Desítky studií s miliony dětí dokazují, že vakcíny NEZPŮSOBÍ autismus."
            },
            {
              "question": "Je bezpečné dát dítěti více vakcín najednou?",
              "options": [
                "Ne, je toho moc",
                "Ano, je to bezpečné a testované",
                "Pouze jeden po druhém"
              ],
              "explanation": "Imunitní systém dětí se každý den vypořádá s tisíci bakterií. Kombinované vakcíny jsou důkladně testovány a bezpečné. Odložení očkování zanechá vaše dítě nechráněné."
            },
            {
              "question": "Moje dítě má mírnou rýmu. Mohou se ještě nechat očkovat?",
              "options": [
                "Ne, počkejte, až budete úplně zdraví",
                "Ano, mírné nachlazení je v pořádku",
                "Pouze se souhlasem lékaře"
              ],
              "explanation": "Mírná rýma, nízká horečka nebo rýma NENÍ důvodem k odložení očkování. Pouze těžká nemoc vyžaduje odklad. Pokud si nejste jisti, zeptejte se svého lékaře."
            },
            {
              "question": "Obsahují vakcíny nebezpečné chemikálie?",
              "options": [
                "Ano, jsou plné toxinů",
                "Ne, všechny přísady jsou v malých množstvích bezpečné",
                "Někteří ano, někteří ne"
              ],
              "explanation": "Složky vakcíny jsou přítomny v nepatrných, bezpečných množstvích. Z mateřského mléka získáte více hliníku než z vakcíny. Každá složka byla testována na bezpečnost."
            }
          ]
        },
        "diabetes": {
          "title": "Diabetes",
          "description": "Pochopení léčby diabetu",
          "questions": [
            {
              "question": "Je cukrovka způsobena konzumací příliš velkého množství cukru?",
              "options": [
                "Ano",
                "Ne, je to složitější",
                "Pouze typ 2"
              ],
              "explanation": "Diabetes je způsoben genetikou, životním stylem a tím, jak vaše tělo zpracovává inzulín. Konzumace cukru to přímo nezpůsobuje, ale nezdravá strava a obezita riziko zvyšují."
            },
            {
              "question": "Lze cukrovku vyléčit přírodními prostředky, jako je skořice?",
              "options": [
                "Ano, skořice to léčí",
                "Ne, neexistuje žádný lék, ale dá se to zvládnout",
                "Ano, s dostatkem česneku a bylinek"
              ],
              "explanation": "Na cukrovku NENÍ ŽÁDNÝ lék. Dá se to ZVLÁDNOUT pomocí léků, zdravé výživy a cvičení. Skořice může mít nepatrné výhody, ale NEMŮŽE nahradit léky. Lidé, kteří vysadí své léky, skončí v nemocnici."
            },
            {
              "question": "Diabetik pociťuje závratě a pocení. co byste měli udělat?",
              "options": [
                "Dejte jim inzulín",
                "Okamžitě jim dejte něco sladkého",
                "Řekni jim, ať si odpočinou"
              ],
              "explanation": "To jsou příznaky NÍZKÉ glykémie (hypoglykémie). Okamžitě jim dejte šťávu, bonbóny nebo cukrovou vodu. To může být životu nebezpečné. Poté, co se budou cítit lépe, by měli jíst správné jídlo."
            },
            {
              "question": "Jak často by si měl diabetik kontrolovat nohy?",
              "options": [
                "Nikdy, nohy jsou v pořádku",
                "Každý den",
                "Jednou za rok"
              ],
              "explanation": "Cukrovka může poškodit nervy na nohou. Možná nebudete cítit řezné rány nebo vředy. KAŽDÝ DEN kontrolujte své nohy, zda na nich nejsou řezné rány, puchýře nebo změny barvy. Z malých ran se mohou stát vážné infekce."
            }
          ]
        },
        "hygiene": {
          "title": "Hygiena a prevence",
          "description": "Základní zdravotní návyky, které zachraňují životy",
          "questions": [
            {
              "question": "Jak dlouho byste si měli mýt ruce mýdlem?",
              "options": [
                "5 sekund",
                "Minimálně 20 sekund",
                "1 minuta"
              ],
              "explanation": "Umyjte se alespoň 20 sekund – přibližně tak dlouho, než dvakrát zazpíváte „Happy Birthday“. Tím se odstraní většina choroboplodných zárodků. Rychlé oplachy nefungují."
            },
            {
              "question": "Je bezpečné pít vodu z řeky nebo potoka?",
              "options": [
                "Ano, přírodní voda je čistá",
                "Ne, vždy to nejprve převařte nebo přefiltrujte",
                "Jen když to vypadá jasně"
              ],
              "explanation": "I čistá voda může obsahovat nebezpečné bakterie a parazity. Vždy vařte vodu alespoň 1 minutu nebo použijte filtr. Špinavá voda způsobuje průjem, choleru a tyfus."
            },
            {
              "question": "Vaše dítě má průjem. Co je nejdůležitější?",
              "options": [
                "Zastavte všechno jídlo",
                "Podávejte hodně tekutin (voda, ORS)",
                "Dejte antibiotika"
              ],
              "explanation": "Dehydratace z průjmu zabíjí více dětí než průjem samotný. Podejte perorální rehydratační roztok (ORS) nebo čistou vodu se špetkou soli a cukru. Nechte kojit děti."
            },
            {
              "question": "Kdy byste si měli umýt ruce?",
              "options": [
                "Pouze před jídlem",
                "Před jídlem, po toaletě, po dotyku se zvířaty, po kašli",
                "Jen když vypadají špinavě"
              ],
              "explanation": "Bakterie jsou neviditelné. Umyjte si ruce: před jídlem/vařením, po použití toalety, po přebalování, po dotyku se zvířaty, po kašlání/kýchání a po dotyku s nemocnými lidmi."
            }
          ]
        }
      }
    },
    "rights": {
      "meta": {
        "title": "Poznejte svá práva — Redi Health",
        "description": "Práva pacientů, pomoc s diskriminací a právní kontakty na romské komunity"
      },
      "title": "Poznejte svá práva",
      "subtitle": "Jako pacient máte práva. Naučte se je. Použijte je.",
      "back": "Zpět",
      "menu": {
        "patientRights": {
          "title": "Práva pacienta",
          "desc": "8 práv má každý pacient"
        },
        "discrimination": {
          "title": "Čelit diskriminaci?",
          "desc": "Co říci a udělat – krok za krokem"
        },
        "contacts": {
          "title": "Právní pomoc podle země",
          "desc": "Ombudsman, antidiskriminační, romské organizace"
        }
      },
      "views": {
        "patientRights": "Vaše práva pacienta",
        "discrimination": "Pokud čelíte diskriminaci",
        "discriminationDesc": "Skutečné situace a přesně to, co říkat a dělat.",
        "contacts": "Právní pomoc podle země"
      },
      "labels": {
        "sayThis": "Řekněte toto:",
        "thenDo": "Pak proveďte toto:",
        "patientOmbudsman": "Ombudsman pacientů",
        "antiDiscrimination": "Anti-Discrimination",
        "romaRightsOrg": "Roma Rights Organization"
      },
      "rights": {
        "treatment": {
          "title": "Právo na pohotovostní ošetření",
          "description": "Každá nemocnice vás MUSÍ ošetřit v případě nouze, a to i bez pojištění a dokladů. Toto je zákon v každé EU zemi. Pokud odmítnou, zeptejte se na jméno lékaře a nahlaste to."
        },
        "information": {
          "title": "Právo porozumět vaší diagnóze",
          "description": "Váš lékař vám musí vysvětlit váš stav slovy, kterým rozumíte. Pokud nerozumíte, řekněte: 'Můžete to vysvětlit jednodušeji?' Můžete také požádat o písemné shrnutí."
        },
        "consent": {
          "title": "Právo říci ne",
          "description": "Nikdo vám nemůže vnutit léčbu. Před jakýmkoli zákrokem vám lékař musí vysvětlit, co bude dělat, a vy musíte souhlasit. Vždy můžete říct 'Potřebuji čas na rozmyšlenou.'"
        },
        "privacy": {
          "title": "Právo na soukromí",
          "description": "Vaše lékařské informace jsou soukromé. Lékaři jej bez vašeho svolení nemohou sdílet s vaším zaměstnavatelem, rodinou ani nikým jiným. To zahrnuje váš stav HIV, těhotenství nebo duševní zdraví."
        },
        "interpreter": {
          "title": "Právo na tlumočníka",
          "description": "Pokud nemluvíte dobře místním jazykem, můžete požádat o tlumočníka. Tuto službu má mnoho nemocnic. Pokud ne, můžete přivést někoho, komu důvěřujete, aby přeložil."
        },
        "second-opinion": {
          "title": "Právo na druhý názor",
          "description": "Pokud nesouhlasíte s diagnózou, můžete navštívit jiného lékaře. Toto je vaše právo. Nemusíte vysvětlovat proč."
        },
        "records": {
          "title": "Právo na vaši lékařskou dokumentaci",
          "description": "Kdykoli můžete požádat o kopii všech svých lékařských záznamů. Nemocnice je musí poskytnout. To je užitečné při změně lékaře nebo stěhování do jiného města."
        },
        "complaint": {
          "title": "Právo si stěžovat",
          "description": "Pokud se cítíte týráni nebo diskriminováni, můžete podat stížnost. Každá nemocnice má svůj reklamační řád. Můžete se také obrátit na ombudsmana pacientů ve vaší zemi."
        }
      },
      "scenarios": {
        "refused-treatment": {
          "situation": "Nemocnice vás odmítá ošetřit",
          "whatToSay": "\"Mám právo na pohotovostní ošetření podle zákona EU. Napište prosím své jméno a důvod, proč odmítáte.\"",
          "whatToDo": [
            "Zůstaňte klidní, ale pevní",
            "Zeptejte se na celé jméno lékaře",
            "Požádejte o odmítnutí písemně",
            "Zavolejte pacientovi ombudsmana",
            "Kontaktujte organizaci pro práva Romů"
          ]
        },
        "rude-staff": {
          "situation": "Personál nemocnice je hrubý nebo odmítavý kvůli vaší etnické příslušnosti",
          "whatToSay": "\"Jsem tu pro lékařskou pomoc. Očekávám, že se mnou bude zacházeno se stejným respektem jako s každým jiným pacientem.\"",
          "whatToDo": [
            "Požádejte o rozhovor s vrchní sestrou nebo vedoucím oddělení",
            "Poznamenejte si datum, čas a jména",
            "Podejte písemnou stížnost v nemocnici",
            "Zpráva národnímu antidiskriminačnímu orgánu"
          ]
        },
        "no-insurance": {
          "situation": "Nemáte zdravotní pojištění",
          "whatToSay": "\"Potřebuji lékařskou pomoc. Jaké mám možnosti pro nepojištěné pacienty?\"",
          "whatToDo": [
            "Pohotovostní péče je vždy bezplatná – trvejte na ní",
            "Zeptejte se na programy sociální pomoci",
            "Kontaktujte zdravotního mediátora ve vašem okolí",
            "Mnoho nevládních organizací poskytuje bezplatné kliniky – zeptejte se v nemocnici"
          ]
        },
        "language-barrier": {
          "situation": "Nemůžete komunikovat s lékařem",
          "whatToSay": "\"Potřebuji pomoc s porozuměním. Můžete zajistit tlumočníka nebo mluvit pomaleji?\"",
          "whatToDo": [
            "Použijte tuto aplikaci k překladu klíčových frází",
            "Přiveďte důvěryhodnou osobu, která mluví daným jazykem",
            "Požádejte o písemné pokyny, které můžete později přeložit",
            "K překladu dokumentů použijte fotoaparát telefonu"
          ]
        }
      },
      "contacts": {
        "romania": {
          "country": "Romania",
          "ombudsman": "Avocatul Poporului",
          "antiDiscrimination": "CNCD",
          "ombudsmanPhone": "021 312 7134",
          "antiDiscriminationPhone": "021 312 6578",
          "romaRightsOrg": "Romani CRISS"
        },
        "bulgaria": {
          "country": "Bulgaria",
          "ombudsman": "Ombudsman of Bulgaria",
          "antiDiscrimination": "Commission for Protection against Discrimination",
          "ombudsmanPhone": "02 810 6955",
          "romaRightsOrg": "Amalipe Center"
        },
        "hungary": {
          "country": "Hungary",
          "ombudsman": "Commissioner for Fundamental Rights",
          "antiDiscrimination": "Equal Treatment Authority",
          "ombudsmanPhone": "06 1 475 7100",
          "romaRightsOrg": "Romaversitas Foundation"
        },
        "slovakia": {
          "country": "Slovakia",
          "ombudsman": "Public Defender of Rights",
          "antiDiscrimination": "Slovak National Centre for Human Rights",
          "ombudsmanPhone": "02 4828 7401",
          "romaRightsOrg": "ETP Slovakia"
        },
        "czech-republic": {
          "country": "Czech Republic",
          "ombudsman": "Public Defender of Rights",
          "antiDiscrimination": "Office of the Public Defender",
          "ombudsmanPhone": "542 542 888",
          "romaRightsOrg": "Romea.cz"
        },
        "serbia": {
          "country": "Serbia",
          "ombudsman": "Protector of Citizens",
          "antiDiscrimination": "Commissioner for Equality",
          "ombudsmanPhone": "011 206 8100",
          "romaRightsOrg": "Praxis"
        },
        "albania": {
          "country": "Albania",
          "ombudsman": "People's Advocate",
          "antiDiscrimination": "Commissioner for Protection from Discrimination",
          "ombudsmanPhone": "042 380 300"
        },
        "north-macedonia": {
          "country": "North Macedonia",
          "ombudsman": "Ombudsman",
          "antiDiscrimination": "Commission for Prevention and Protection against Discrimination",
          "ombudsmanPhone": "02 3129 335"
        },
        "greece": {
          "country": "Greece",
          "ombudsman": "Greek Ombudsman",
          "antiDiscrimination": "Greek Ombudsman (Equal Treatment)",
          "ombudsmanPhone": "213 130 6600"
        },
        "croatia": {
          "country": "Croatia",
          "ombudsman": "Ombudswoman",
          "antiDiscrimination": "Ombudswoman",
          "ombudsmanPhone": "01 4851 855"
        }
      }
    },
    "stories": {
      "meta": {
        "title": "Komunitní příběhy — Redi Health",
        "description": "Skutečné zdravotní zkušenosti z romských komunit v celé Evropě"
      },
      "title": "Komunitní příběhy",
      "subtitle": "Reálné zkušenosti z romských komunit. Učte se od ostatních.",
      "backToStories": "Zpět k příběhům",
      "lessonLearned": "Ponaučení",
      "whatToDoNext": "Co dělat dál",
      "categories": {
        "vaccines": "Vakcíny",
        "chronic": "Chronické onemocnění",
        "maternal": "Těhotenství",
        "discrimination": "Práva",
        "prevention": "Prevence",
        "mental": "Duševní zdraví"
      },
      "nextSteps": {
        "vaccineGuide": "Průvodce vakcínou",
        "askZuvo": "Zeptej se Zuvo",
        "explainPrescription": "Vysvětlete předpis",
        "navigateToCare": "Přejděte do péče",
        "knowYourRights": "Poznejte svá práva",
        "learnPrevention": "Naučte se prevenci",
        "checkSymptoms": "Zkontrolujte příznaky",
        "learnMentalHealth": "Seznamte se s duševním zdravím"
      },
      "entries": {
        "maria-vaccines": {
          "name": "Maria",
          "age": "28",
          "country": "Rumunsko",
          "title": "Dceru jsem skoro nedala očkovat",
          "story": "Moje tchyně mi řekla, že vakcíny jsou jed. Všichni v osadě říkali totéž. Když se mi narodila dcera, měla jsem strach. Ale zdravotní mediátor přišel k nám domů a vše vysvětlil – jak vakcíny fungují, jaké jsou ve skutečnosti vedlejší účinky. Ukázala mi fotky dětí se spalničkami. Bál jsem se víc nemoci než vakcíny. Moje dcera dostala všechny vakcíny. Je zdravá a silná.",
          "lesson": "Než se rozhodnete na základě toho, co říkají ostatní, promluvte si se zdravotním mediátorem nebo lékařem. Vakcíny zachraňují životy."
        },
        "stefan-diabetes": {
          "name": "Stefan",
          "age": "52",
          "country": "Bulharsko",
          "title": "Vysadil jsem léky na cukrovku a málem jsem zemřel",
          "story": "Diabetes typu 2 mi byl diagnostikován v 45. Z léků mě bolelo břicho, tak jsem ho přestala brát. Můj soused řekl, že mě vyléčí skořicový čaj. 2 roky jsem místo toho pila skořicový čaj. Pak jsem jednoho dne zkolaboval. Moje hladina cukru v krvi byla vyšší než 500. Doktoři řekli, že mám poškozené ledviny. Nyní beru své léky každý den. Kéž bych se nikdy nezastavil.",
          "lesson": "Nikdy nepřestávejte užívat lék, aniž byste si promluvili se svým lékařem. Přírodní léky nemohou nahradit léky na cukrovku."
        },
        "elena-pregnancy": {
          "name": "Elena",
          "age": "22",
          "country": "Srbsko",
          "title": "Moje první těhotenství — nevěděla jsem, že můžu jít k lékaři zadarmo",
          "story": "Když jsem otěhotněla v 19, 6 měsíců jsem nešla k lékaři. Neměl jsem pojištění a myslel jsem, že to bude stát příliš mnoho. Zdravotní mediátor mi řekl, že prenatální péče je pro všechny těhotné ženy v Srbsku zdarma. Pomohla mi zaregistrovat se. Lékař zjistil, že mám anémii a vysoký krevní tlak. Kdybych neodešla, moje dítě mohlo být v nebezpečí.",
          "lesson": "Prenatální péče je ve většině evropských zemí bezplatná. Požádejte zdravotního mediátora, aby vám pomohl s registrací."
        },
        "janos-discrimination": {
          "name": "János",
          "age": "35",
          "country": "Maďarsko",
          "title": "Nemocnice se mě pokusila poslat pryč",
          "story": "Šel jsem na pohotovost s bolestí na hrudi. Sestra se na mě podívala a řekla 'Máme plno, jděte do jiné nemocnice.' Věděl jsem, že to není správné. Řekl jsem: ‚Bolí mě na hrudi. Musíte mě vyšetřit. Dej mi prosím své jméno.“ Její postoj se okamžitě změnil. Vyšetřili mě a zjistili, že mám problém se srdcem, který vyžaduje léčbu. Kdybych odešel, mohl jsem dostat infarkt.",
          "lesson": "Máte právo na pohotovostní ošetření. Pokud se vás někdo pokusí odmítnout, zeptejte se ho na jméno a řekněte, že znáte svá práva."
        },
        "ana-tb": {
          "name": "Ana",
          "age": "31",
          "country": "Slovensko",
          "title": "TB není rozsudek smrti – ale musíte dokončit lék",
          "story": "Měsíce jsem kašlal. Myslel jsem, že je to jen nachlazení. Když jsem konečně šel k lékaři, řekli mi, že mám tuberkulózu. Byl jsem vyděšený – myslel jsem, že umřu. Ale doktor vysvětlil, že TB lze vyléčit 6měsíčními léky. Nejtěžší bylo brát prášky každý den po dobu 6 měsíců, i když jsem se po 2 měsících cítil lépe. Ale skončil jsem. jsem vyléčen.",
          "lesson": "Pokud kašlete déle než 2 týdny, navštivte lékaře. TB je vyléčitelná, ale MUSÍTE dokončit všechny léky."
        },
        "mirela-depression": {
          "name": "Mirela",
          "age": "40",
          "country": "Severní Makedonie",
          "title": "Deprese není slabost – je to nemoc",
          "story": "Poté, co můj manžel zemřel, jsem nemohla měsíce vstát z postele. Moje rodina říkala, že jsem líný. Řekli 'jen buď silný'. Ale nemohl jsem. Zdravotnický mediátor si všiml, že něco není v pořádku, a vzal mě k lékaři. Doktor řekl, že mám deprese – skutečný zdravotní stav. Začal jsem s medicínou a mluvil jsem s poradcem. Pomalu jsem se zlepšoval. nejsem slabý. Bylo mi špatně.",
          "lesson": "Deprese je zdravotní stav, nikoli charakterová vada. Pomoci může medicína a poradenství. Prosím o pomoc."
        }
      }
    },
    "challenges": {
      "meta": {
        "title": "Výzvy — Redi Health",
        "description": "Komunitní výzvy"
      },
      "title": "Aktivní výzvy",
      "subtitle": "Připojte se k cílům komunity a osobním výzvám a získejte bonusové XP a odznaky.",
      "types": {
        "community": "společenství",
        "personal": "osobní"
      },
      "daysLeft": "Zbývá {count} dní",
      "viewLeaderboard": "Zobrazit výsledkovou tabulku",
      "items": {
        "c1": {
          "title": "Šampion znalostí o vakcínách",
          "description": "Získejte 50 studentů ve vaší oblasti, aby tento týden absolvovali modul vakcíny."
        },
        "c2": {
          "title": "7denní série zdraví",
          "description": "Zaznamenejte si náladu a příjem vody 7 dní v řadě."
        }
      }
    },
    "certificate": {
      "meta": {
        "title": "Certifikát — Redi Health",
        "description": "Národní certifikát zdravotní gramotnosti"
      },
      "title": "Váš certifikát",
      "subtitle": "Dokončili jste Národní etapu Studentské zdravotní akademie.",
      "ofCompletion": "Osvědčení o absolvování",
      "diplomaTitle": "Národní zdravotní gramotnost",
      "awardedFor": "Uděluje se za dokončení studijního plánu Redi Health Student Academy.",
      "date": "Datum",
      "downloadPdf": "Stáhnout PDF",
      "share": "Sdílejte",
      "gate": {
        "title": "Nejprve dokončete akademii",
        "description": "Chcete-li získat certifikát zdravotní gramotnosti, musíte absolvovat všechny lekce a projít kvízem na národní úrovni Studentské zdravotní akademie.",
        "cta": "Jděte do Akademie"
      }
    }
  },
  "el": {
    "healthQuiz": {
      "meta": {
        "title": "Κουίζ υγείας — Redi Health",
        "description": "Δοκιμάστε τις γνώσεις σας για την υγεία με διαδραστικά κουίζ"
      },
      "title": "Κουίζ υγείας",
      "subtitle": "Δοκιμάστε τις γνώσεις σας. Μάθετε κάτι νέο.",
      "backToQuizzes": "Επιστροφή στα κουίζ",
      "seeResults": "Δείτε αποτελέσματα",
      "nextQuestion": "Επόμενη ερώτηση",
      "questionsCount": "{count} ερωτήσεις",
      "results": {
        "perfect": "Τέλειο σκορ!",
        "great": "Μεγάλη δουλειά!",
        "good": "Καλή προσπάθεια!",
        "keepLearning": "Συνέχισε να μαθαίνεις!",
        "score": "Έχετε {score} από {total} σωστά",
        "tryAgain": "Προσπαθήστε ξανά",
        "moreQuizzes": "Περισσότερα κουίζ"
      },
      "quizzes": {
        "antibiotics": {
          "title": "Αντιβιοτικά",
          "description": "Γνωρίζετε πότε να χρησιμοποιείτε αντιβιοτικά;",
          "questions": [
            {
              "question": "Μπορούν τα αντιβιοτικά να θεραπεύσουν τη γρίπη;",
              "options": [
                "Ναι",
                "Όχι",
                "Μερικές φορές"
              ],
              "explanation": "Η γρίπη προκαλείται από έναν ιό. Τα αντιβιοτικά σκοτώνουν μόνο τα βακτήρια. Η λήψη αντιβιοτικών για τη γρίπη δεν κάνει τίποτα και μπορεί να κάνει τις μελλοντικές λοιμώξεις πιο δύσκολες στη θεραπεία."
            },
            {
              "question": "Αισθάνεστε καλύτερα μετά από 3 ημέρες αντιβίωση. Θα πρέπει να σταματήσετε;",
              "options": [
                "Ναι, θεραπεύτηκες",
                "Όχι, ολοκληρώστε το πλήρες μάθημα",
                "Πάρτε τα μισά χάπια που απομένουν"
              ],
              "explanation": "Τελειώνετε ΠΑΝΤΑ το πλήρες μάθημα. Εάν σταματήσετε νωρίς, μερικά βακτήρια επιβιώνουν και γίνονται ανθεκτικά. Την επόμενη φορά, το ίδιο αντιβιοτικό δεν θα λειτουργήσει."
            },
            {
              "question": "Μπορείτε να μοιραστείτε τα αντιβιοτικά με ένα μέλος της οικογένειας που έχει παρόμοια συμπτώματα;",
              "options": [
                "Ναι, εξοικονομεί χρήματα",
                "Όχι, ποτέ",
                "Μόνο αν πρόκειται για την ίδια ασθένεια"
              ],
              "explanation": "Ποτέ μην μοιράζεστε αντιβιοτικά. Οι διαφορετικές λοιμώξεις χρειάζονται διαφορετικά φάρμακα. Το λάθος αντιβιοτικό μπορεί να είναι επικίνδυνο και δεν θα βοηθήσει."
            },
            {
              "question": "Τι συμβαίνει εάν παίρνετε αντιβιοτικά πολύ συχνά;",
              "options": [
                "Τίποτα κακό",
                "Το σώμα σας αποκτά ανοσία στις ασθένειες",
                "Τα βακτήρια γίνονται ανθεκτικά και πιο δύσκολο να σκοτωθούν"
              ],
              "explanation": "Η αντοχή στα αντιβιοτικά είναι μια παγκόσμια κρίση. Όταν τα βακτήρια γίνονται ανθεκτικά, απλές λοιμώξεις μπορεί να γίνουν θανατηφόρες. Λαμβάνετε αντιβιοτικά μόνο όταν τα συνταγογραφήσει ο γιατρός."
            }
          ]
        },
        "vaccines": {
          "title": "Εμβόλια",
          "description": "Διαχωρίστε τα γεγονότα από τους μύθους",
          "questions": [
            {
              "question": "Τα εμβόλια προκαλούν αυτισμό;",
              "options": [
                "Ναι",
                "Όχι",
                "Δεν ξέρουμε"
              ],
              "explanation": "ΟΧΙ. Αυτός ο μύθος ξεκίνησε από μια δόλια μελέτη που ανακλήθηκε. Ο γιατρός που το δημοσίευσε έχασε την ιατρική του άδεια. Δεκάδες μελέτες με εκατομμύρια παιδιά αποδεικνύουν ότι τα εμβόλια ΔΕΝ προκαλούν αυτισμό."
            },
            {
              "question": "Είναι ασφαλές να κάνουμε ένα μωρό πολλαπλά εμβόλια ταυτόχρονα;",
              "options": [
                "Όχι, είναι πάρα πολύ",
                "Ναι, είναι ασφαλές και δοκιμασμένο",
                "Μόνο ένα κάθε φορά"
              ],
              "explanation": "Το ανοσοποιητικό σύστημα των μωρών χειρίζεται χιλιάδες μικρόβια κάθε μέρα. Τα συνδυασμένα εμβόλια είναι διεξοδικά ελεγμένα και ασφαλή. Η καθυστέρηση των εμβολίων αφήνει το παιδί σας απροστάτευτο."
            },
            {
              "question": "Το παιδί μου έχει ένα ήπιο κρυολόγημα. Μπορούν ακόμα να εμβολιαστούν;",
              "options": [
                "Όχι, περιμένετε μέχρι να είστε πλήρως υγιείς",
                "Ναι, ένα ήπιο κρυολόγημα είναι μια χαρά",
                "Μόνο με άδεια γιατρού"
              ],
              "explanation": "Ένα ήπιο κρυολόγημα, ο χαμηλός πυρετός ή η καταρροή ΔΕΝ είναι λόγος καθυστέρησης του εμβολιασμού. Μόνο η σοβαρή ασθένεια απαιτεί αναβολή. Ρωτήστε το γιατρό σας εάν δεν είστε σίγουροι."
            },
            {
              "question": "Περιέχουν τα εμβόλια επικίνδυνες χημικές ουσίες;",
              "options": [
                "Ναι, είναι γεμάτα τοξίνες",
                "Όχι, όλα τα συστατικά είναι ασφαλή στις μικρές ποσότητες που χρησιμοποιούνται",
                "Κάποιοι το κάνουν, κάποιοι όχι"
              ],
              "explanation": "Τα συστατικά του εμβολίου υπάρχουν σε μικροσκοπικές, ασφαλείς ποσότητες. Παίρνετε περισσότερο αλουμίνιο από το μητρικό γάλα παρά από ένα εμβόλιο. Κάθε συστατικό έχει ελεγχθεί για ασφάλεια."
            }
          ]
        },
        "diabetes": {
          "title": "Διαβήτης",
          "description": "Κατανόηση της διαχείρισης του διαβήτη",
          "questions": [
            {
              "question": "Ο διαβήτης προκαλείται από την υπερβολική κατανάλωση ζάχαρης;",
              "options": [
                "Ναι",
                "Όχι, είναι πιο σύνθετο",
                "Μόνο Τύπος 2"
              ],
              "explanation": "Ο διαβήτης προκαλείται από τη γενετική, τον τρόπο ζωής και τον τρόπο με τον οποίο το σώμα σας επεξεργάζεται την ινσουλίνη. Η κατανάλωση ζάχαρης δεν την προκαλεί άμεσα, αλλά η ανθυγιεινή διατροφή και η παχυσαρκία αυξάνουν τον κίνδυνο."
            },
            {
              "question": "Μπορεί ο διαβήτης να θεραπευτεί με φυσικές θεραπείες όπως η κανέλα;",
              "options": [
                "Ναι, η κανέλα το θεραπεύει",
                "Όχι, δεν υπάρχει θεραπεία, αλλά μπορεί να αντιμετωπιστεί",
                "Ναι, με αρκετό σκόρδο και βότανα"
              ],
              "explanation": "ΔΕΝ υπάρχει θεραπεία για τον διαβήτη. Μπορεί να ΔΙΑΧΕΙΡΙΣΤΕΙ με φάρμακα, υγιεινές τροφές και άσκηση. Η κανέλα μπορεί να έχει μικροσκοπικά οφέλη αλλά ΔΕΝ ΜΠΟΡΕΙ να αντικαταστήσει τη φαρμακευτική αγωγή. Οι άνθρωποι που σταματούν τα φάρμακά τους καταλήγουν στο νοσοκομείο."
            },
            {
              "question": "Ένα διαβητικό άτομο αισθάνεται ζάλη και ιδρώτα. Τι πρέπει να κάνετε;",
              "options": [
                "Δώστε τους ινσουλίνη",
                "Δώστε τους κάτι γλυκό αμέσως",
                "Πες τους να ξεκουραστούν"
              ],
              "explanation": "Αυτά είναι σημάδια χαμηλού σακχάρου στο αίμα (υπογλυκαιμία). Δώστε τους αμέσως χυμό, καραμέλα ή ζαχαρόνερο. Αυτό μπορεί να είναι απειλητικό για τη ζωή. Αφού αισθανθούν καλύτερα, θα πρέπει να τρώνε ένα σωστό γεύμα."
            },
            {
              "question": "Πόσο συχνά πρέπει ένας διαβητικός να ελέγχει τα πόδια του;",
              "options": [
                "Ποτέ, τα πόδια είναι καλά",
                "Κάθε μέρα",
                "Μια φορά το χρόνο"
              ],
              "explanation": "Ο διαβήτης μπορεί να βλάψει τα νεύρα στα πόδια σας. Μπορεί να μην αισθάνεστε κοψίματα ή πληγές. Ελέγχετε τα πόδια σας ΚΑΘΕ ΜΕΡΑ για κοψίματα, φουσκάλες ή αλλαγές χρώματος. Οι μικρές πληγές μπορεί να γίνουν σοβαρές λοιμώξεις."
            }
          ]
        },
        "hygiene": {
          "title": "Υγιεινή & Πρόληψη",
          "description": "Βασικές συνήθειες υγείας που σώζουν ζωές",
          "questions": [
            {
              "question": "Πόσο καιρό πρέπει να πλένετε τα χέρια σας με σαπούνι;",
              "options": [
                "5 δευτερόλεπτα",
                "Τουλάχιστον 20 δευτερόλεπτα",
                "1 λεπτό"
              ],
              "explanation": "Πλύνετε για τουλάχιστον 20 δευτερόλεπτα — περίπου το χρόνο που χρειάζεται για να τραγουδήσετε δύο φορές το \"Happy Birthday\". Αυτό αφαιρεί τα περισσότερα μικρόβια. Τα γρήγορα ξεβγάλματα δεν λειτουργούν."
            },
            {
              "question": "Είναι ασφαλές να πιεις νερό από ποτάμι ή ρυάκι;",
              "options": [
                "Ναι, το φυσικό νερό είναι καθαρό",
                "Όχι, πάντα το βράζετε ή το φιλτράρετε πρώτα",
                "Μόνο αν φαίνεται ξεκάθαρο"
              ],
              "explanation": "Ακόμη και το καθαρό νερό μπορεί να περιέχει επικίνδυνα βακτήρια και παράσιτα. Βράζετε πάντα νερό για τουλάχιστον 1 λεπτό ή χρησιμοποιείτε φίλτρο. Το βρώμικο νερό προκαλεί διάρροια, χολέρα και τύφο."
            },
            {
              "question": "Το παιδί σας έχει διάρροια. Ποιο είναι το πιο σημαντικό πράγμα;",
              "options": [
                "Σταματήστε όλα τα τρόφιμα",
                "Δώστε πολλά υγρά (νερό, ORS)",
                "Δώστε αντιβιοτικά"
              ],
              "explanation": "Η αφυδάτωση από τη διάρροια σκοτώνει περισσότερα παιδιά από την ίδια τη διάρροια. Δώστε από του στόματος διάλυμα επανυδάτωσης (ORS) ή καθαρό νερό με μια πρέζα αλάτι και ζάχαρη. Συνεχίστε να θηλάζουν τα μωρά."
            },
            {
              "question": "Πότε πρέπει να πλένετε τα χέρια σας;",
              "options": [
                "Μόνο πριν το φαγητό",
                "Πριν το φαγητό, μετά την τουαλέτα, αφού αγγίξετε ζώα, μετά το βήχα",
                "Μόνο όταν φαίνονται βρώμικα"
              ],
              "explanation": "Τα μικρόβια είναι αόρατα. Πλύνετε τα χέρια: πριν φάτε/ μαγείρεμα, μετά τη χρήση της τουαλέτας, αφού αλλάξετε πάνες, αφού αγγίξετε ζώα, μετά το βήχα/φτάρνισμα και αφού αγγίξετε άρρωστα άτομα."
            }
          ]
        }
      }
    },
    "rights": {
      "meta": {
        "title": "Γνωρίστε τα δικαιώματά σας — Redi Health",
        "description": "Δικαιώματα ασθενών, βοήθεια κατά των διακρίσεων και νομικές επαφές για τις κοινότητες των Ρομά"
      },
      "title": "Γνωρίστε τα δικαιώματά σας",
      "subtitle": "Έχεις δικαιώματα ως ασθενής. Μάθετε τους. Χρησιμοποιήστε τα.",
      "back": "Πίσω",
      "menu": {
        "patientRights": {
          "title": "Δικαιώματα Ασθενούς",
          "desc": "8 δικαιώματα έχει κάθε ασθενής"
        },
        "discrimination": {
          "title": "Αντιμετωπίζοντας διακρίσεις;",
          "desc": "Τι να πείτε και να κάνετε — βήμα προς βήμα"
        },
        "contacts": {
          "title": "Νομική βοήθεια ανά χώρα",
          "desc": "Συνήγορος του Πολίτη, κατά των διακρίσεων, οργανώσεις Ρομά"
        }
      },
      "views": {
        "patientRights": "Τα δικαιώματα του ασθενούς σας",
        "discrimination": "Εάν αντιμετωπίζετε διακρίσεις",
        "discriminationDesc": "Πραγματικές καταστάσεις και ακριβώς τι να πεις και να κάνεις.",
        "contacts": "Νομική βοήθεια ανά χώρα"
      },
      "labels": {
        "sayThis": "Πες αυτό:",
        "thenDo": "Στη συνέχεια κάντε αυτό:",
        "patientOmbudsman": "Συνήγορος του Ασθενούς",
        "antiDiscrimination": "Anti-Discrimination",
        "romaRightsOrg": "Roma Rights Organization"
      },
      "rights": {
        "treatment": {
          "title": "Δικαίωμα σε επείγουσα περίθαλψη",
          "description": "Κάθε νοσοκομείο ΠΡΕΠΕΙ να σας περιθάλψει σε περίπτωση έκτακτης ανάγκης, ακόμη και χωρίς ασφάλιση ή έγγραφα. Αυτός είναι νόμος σε κάθε EU χώρα. Εάν αρνηθούν, ζητήστε το όνομα του γιατρού και αναφέρετέ το."
        },
        "information": {
          "title": "Δικαίωμα κατανόησης της διάγνωσής σας",
          "description": "Ο γιατρός σας πρέπει να εξηγήσει την κατάστασή σας με λέξεις που καταλαβαίνετε. Αν δεν καταλαβαίνετε, πείτε: 'Μπορείς να το εξηγήσεις αυτό πιο απλά;' Μπορείτε επίσης να ζητήσετε μια γραπτή περίληψη."
        },
        "consent": {
          "title": "Δικαίωμα να πω όχι",
          "description": "Κανείς δεν μπορεί να σας επιβάλει θεραπεία. Πριν από οποιαδήποτε διαδικασία, ο γιατρός πρέπει να εξηγήσει τι θα κάνει και πρέπει να συμφωνήσετε. Μπορείτε πάντα να πείτε «Χρειάζομαι χρόνο για να σκεφτώ»."
        },
        "privacy": {
          "title": "Δικαίωμα στην ιδιωτικότητα",
          "description": "Τα ιατρικά σας στοιχεία είναι ιδιωτικά. Οι γιατροί δεν μπορούν να το μοιραστούν με τον εργοδότη, την οικογένειά σας ή οποιονδήποτε άλλο χωρίς την άδειά σας. Αυτό περιλαμβάνει την κατάσταση HIV, την εγκυμοσύνη ή την ψυχική σας υγεία."
        },
        "interpreter": {
          "title": "Δικαίωμα σε διερμηνέα",
          "description": "Εάν δεν μιλάτε καλά την τοπική γλώσσα, μπορείτε να ζητήσετε διερμηνέα. Πολλά νοσοκομεία έχουν αυτήν την υπηρεσία. Εάν όχι, μπορείτε να φέρετε κάποιον που εμπιστεύεστε να μεταφράσει."
        },
        "second-opinion": {
          "title": "Δικαίωμα σε δεύτερη γνώμη",
          "description": "Εάν διαφωνείτε με μια διάγνωση, μπορείτε να δείτε έναν άλλο γιατρό. Αυτό είναι δικαίωμα σου. Δεν χρειάζεται να εξηγήσεις γιατί."
        },
        "records": {
          "title": "Δικαίωμα στα ιατρικά σας αρχεία",
          "description": "Μπορείτε να ζητήσετε αντίγραφο όλων των ιατρικών σας αρχείων ανά πάσα στιγμή. Το νοσοκομείο πρέπει να τους παρέχει. Αυτό είναι χρήσιμο όταν αλλάζετε γιατρό ή μετακομίζετε σε άλλη πόλη."
        },
        "complaint": {
          "title": "Δικαίωμα καταγγελίας",
          "description": "Εάν αισθάνεστε κακομεταχείριση ή διακρίσεις, μπορείτε να υποβάλετε καταγγελία. Κάθε νοσοκομείο έχει μια διαδικασία παραπόνων. Μπορείτε επίσης να επικοινωνήσετε με τον διαμεσολαβητή ασθενών στη χώρα σας."
        }
      },
      "scenarios": {
        "refused-treatment": {
          "situation": "Το νοσοκομείο αρνείται να σας περιθάλψει",
          "whatToSay": "\"Έχω δικαίωμα σε επείγουσα περίθαλψη σύμφωνα με το νόμο EU. Σημειώστε το όνομά σας και τον λόγο που αρνείστε.\"",
          "whatToDo": [
            "Μείνετε ήρεμοι αλλά σταθεροί",
            "Ζητήστε το πλήρες όνομα του γιατρού",
            "Ζητήστε την άρνηση εγγράφως",
            "Καλέστε τον διαμεσολαβητή ασθενών",
            "Επικοινωνήστε με μια οργάνωση για τα δικαιώματα των Ρομά"
          ]
        },
        "rude-staff": {
          "situation": "Το προσωπικό του νοσοκομείου είναι αγενές ή απορριπτικό λόγω της εθνικότητάς σας",
          "whatToSay": "\"Είμαι εδώ για ιατρική βοήθεια. Περιμένω να με αντιμετωπίζουν με τον ίδιο σεβασμό όπως κάθε άλλος ασθενής.\"",
          "whatToDo": [
            "Ζητήστε να μιλήσετε με την επικεφαλής νοσοκόμα ή τον προϊστάμενο του τμήματος",
            "Σημειώστε την ημερομηνία, την ώρα και τα ονόματα",
            "Υποβάλετε έγγραφη καταγγελία στο νοσοκομείο",
            "Αναφορά στον εθνικό οργανισμό κατά των διακρίσεων"
          ]
        },
        "no-insurance": {
          "situation": "Δεν έχετε ασφάλεια υγείας",
          "whatToSay": "\"Χρειάζομαι ιατρική βοήθεια. Ποιες είναι οι επιλογές μου για ανασφάλιστους ασθενείς;\"",
          "whatToDo": [
            "Η επείγουσα περίθαλψη είναι πάντα δωρεάν — επιμείνετε σε αυτήν",
            "Ρωτήστε για προγράμματα κοινωνικής πρόνοιας",
            "Επικοινωνήστε με έναν διαμεσολαβητή υγείας στην περιοχή σας",
            "Πολλές ΜΚΟ παρέχουν δωρεάν κλινικές — ρωτήστε στο νοσοκομείο"
          ]
        },
        "language-barrier": {
          "situation": "Δεν μπορείς να επικοινωνήσεις με τον γιατρό",
          "whatToSay": "\"Χρειάζομαι βοήθεια για την κατανόηση. Μπορείτε να δώσετε διερμηνέα ή να μιλήσετε πιο αργά;\"",
          "whatToDo": [
            "Χρησιμοποιήστε αυτήν την εφαρμογή για να μεταφράσετε φράσεις κλειδιά",
            "Φέρτε ένα έμπιστο άτομο που μιλά τη γλώσσα",
            "Ζητήστε γραπτές οδηγίες που μπορείτε να μεταφράσετε αργότερα",
            "Χρησιμοποιήστε την κάμερα του τηλεφώνου σας για να μεταφράσετε έγγραφα"
          ]
        }
      },
      "contacts": {
        "romania": {
          "country": "Romania",
          "ombudsman": "Avocatul Poporului",
          "antiDiscrimination": "CNCD",
          "ombudsmanPhone": "021 312 7134",
          "antiDiscriminationPhone": "021 312 6578",
          "romaRightsOrg": "Romani CRISS"
        },
        "bulgaria": {
          "country": "Bulgaria",
          "ombudsman": "Ombudsman of Bulgaria",
          "antiDiscrimination": "Commission for Protection against Discrimination",
          "ombudsmanPhone": "02 810 6955",
          "romaRightsOrg": "Amalipe Center"
        },
        "hungary": {
          "country": "Hungary",
          "ombudsman": "Commissioner for Fundamental Rights",
          "antiDiscrimination": "Equal Treatment Authority",
          "ombudsmanPhone": "06 1 475 7100",
          "romaRightsOrg": "Romaversitas Foundation"
        },
        "slovakia": {
          "country": "Slovakia",
          "ombudsman": "Public Defender of Rights",
          "antiDiscrimination": "Slovak National Centre for Human Rights",
          "ombudsmanPhone": "02 4828 7401",
          "romaRightsOrg": "ETP Slovakia"
        },
        "czech-republic": {
          "country": "Czech Republic",
          "ombudsman": "Public Defender of Rights",
          "antiDiscrimination": "Office of the Public Defender",
          "ombudsmanPhone": "542 542 888",
          "romaRightsOrg": "Romea.cz"
        },
        "serbia": {
          "country": "Serbia",
          "ombudsman": "Protector of Citizens",
          "antiDiscrimination": "Commissioner for Equality",
          "ombudsmanPhone": "011 206 8100",
          "romaRightsOrg": "Praxis"
        },
        "albania": {
          "country": "Albania",
          "ombudsman": "People's Advocate",
          "antiDiscrimination": "Commissioner for Protection from Discrimination",
          "ombudsmanPhone": "042 380 300"
        },
        "north-macedonia": {
          "country": "North Macedonia",
          "ombudsman": "Ombudsman",
          "antiDiscrimination": "Commission for Prevention and Protection against Discrimination",
          "ombudsmanPhone": "02 3129 335"
        },
        "greece": {
          "country": "Greece",
          "ombudsman": "Greek Ombudsman",
          "antiDiscrimination": "Greek Ombudsman (Equal Treatment)",
          "ombudsmanPhone": "213 130 6600"
        },
        "croatia": {
          "country": "Croatia",
          "ombudsman": "Ombudswoman",
          "antiDiscrimination": "Ombudswoman",
          "ombudsmanPhone": "01 4851 855"
        }
      }
    },
    "stories": {
      "meta": {
        "title": "Ιστορίες κοινότητας — Redi Health",
        "description": "Πραγματικές εμπειρίες υγείας από κοινότητες Ρομά σε όλη την Ευρώπη"
      },
      "title": "Ιστορίες κοινότητας",
      "subtitle": "Πραγματικές εμπειρίες από τις κοινότητες των Ρομά. Μάθετε από τους άλλους.",
      "backToStories": "Επιστροφή στις ιστορίες",
      "lessonLearned": "Μάθημα",
      "whatToDoNext": "Τι να κάνετε μετά",
      "categories": {
        "vaccines": "Εμβόλια",
        "chronic": "Χρόνια Νόσος",
        "maternal": "Εγκυμοσύνη",
        "discrimination": "Δικαιώματα",
        "prevention": "Πρόληψη",
        "mental": "Ψυχική Υγεία"
      },
      "nextSteps": {
        "vaccineGuide": "Οδηγός εμβολίων",
        "askZuvo": "Ρωτήστε το Zuvo",
        "explainPrescription": "Εξηγήστε τη συνταγή",
        "navigateToCare": "Πλοηγηθείτε στη φροντίδα",
        "knowYourRights": "Γνωρίστε τα δικαιώματά σας",
        "learnPrevention": "Μάθετε την πρόληψη",
        "checkSymptoms": "Ελέγξτε τα συμπτώματα",
        "learnMentalHealth": "Μάθετε για την ψυχική υγεία"
      },
      "entries": {
        "maria-vaccines": {
          "name": "Maria",
          "age": "28",
          "country": "Ρουμανία",
          "title": "Σχεδόν δεν εμβολίασα την κόρη μου",
          "story": "Η πεθερά μου μου είπε ότι τα εμβόλια είναι δηλητήριο. Όλοι στον οικισμό είπαν το ίδιο πράγμα. Όταν γεννήθηκε η κόρη μου, φοβήθηκα. Αλλά ο διαμεσολαβητής υγείας ήρθε στο σπίτι μας και εξήγησε τα πάντα — πώς λειτουργούν τα εμβόλια, ποιες είναι πραγματικά οι παρενέργειες. Μου έδειξε φωτογραφίες παιδιών με ιλαρά. Φοβόμουν περισσότερο την ασθένεια παρά το εμβόλιο. Η κόρη μου έκανε όλα τα εμβόλια. Είναι υγιής και δυνατή.",
          "lesson": "Μιλήστε με έναν διαμεσολαβητή υγείας ή έναν γιατρό πριν λάβετε αποφάσεις με βάση αυτά που λένε οι άλλοι. Τα εμβόλια σώζουν ζωές."
        },
        "stefan-diabetes": {
          "name": "Stefan",
          "age": "52",
          "country": "Βουλγαρία",
          "title": "Σταμάτησα το φάρμακο για τον διαβήτη και κόντεψα να πεθάνω",
          "story": "Διαγνώστηκα με διαβήτη τύπου 2 στις 45. Το φάρμακο με πονούσε στο στομάχι, οπότε σταμάτησα να το παίρνω. Ο γείτονάς μου είπε ότι το τσάι με κανέλα θα με γιατρέψει. Για 2 χρόνια έπινα τσάι κανέλας. Τότε μια μέρα κατέρρευσα. Το σάκχαρό μου ήταν πάνω από 500. Οι γιατροί είπαν ότι τα νεφρά μου είχαν καταστραφεί. Τώρα παίρνω το φάρμακό μου κάθε μέρα. Μακάρι να μην είχα σταματήσει ποτέ.",
          "lesson": "Μην σταματήσετε ποτέ το φάρμακό σας χωρίς να μιλήσετε με το γιατρό σας. Οι φυσικές θεραπείες δεν μπορούν να αντικαταστήσουν τη φαρμακευτική αγωγή για τον διαβήτη."
        },
        "elena-pregnancy": {
          "name": "Elena",
          "age": "22",
          "country": "Σερβία",
          "title": "Η πρώτη μου εγκυμοσύνη — δεν ήξερα ότι μπορούσα να δω έναν γιατρό δωρεάν",
          "story": "Όταν έμεινα έγκυος στις 19, δεν πήγα σε γιατρό για 6 μήνες. Δεν είχα ασφάλεια και νόμιζα ότι θα κοστίσει πάρα πολύ. Ένας διαμεσολαβητής υγείας μου είπε ότι η προγεννητική φροντίδα είναι δωρεάν για όλες τις έγκυες γυναίκες στη Σερβία. Με βοήθησε να εγγραφώ. Ο γιατρός διαπίστωσε ότι είχα αναιμία και υπέρταση. Αν δεν είχα πάει, το μωρό μου θα μπορούσε να κινδυνεύσει.",
          "lesson": "Η προγεννητική φροντίδα είναι δωρεάν στις περισσότερες ευρωπαϊκές χώρες. Ζητήστε από έναν διαμεσολαβητή υγείας να σας βοηθήσει να εγγραφείτε."
        },
        "janos-discrimination": {
          "name": "János",
          "age": "35",
          "country": "Ουγγαρία",
          "title": "Το νοσοκομείο προσπάθησε να με διώξει",
          "story": "Πήγα στα επείγοντα με πόνο στο στήθος. Η νοσοκόμα με κοίταξε και είπε «Χορτάσαμε, πήγαινε σε άλλο νοσοκομείο». Ήξερα ότι αυτό δεν ήταν σωστό. Είπα: «Έχω πόνο στο στήθος. Πρέπει να με εξετάσεις. Δώσε μου σε παρακαλώ το όνομά σου». Η στάση της άλλαξε αμέσως. Με εξέτασαν και διαπίστωσαν ότι είχα ένα καρδιακό πρόβλημα που χρειαζόταν θεραπεία. Αν είχα φύγει, θα μπορούσα να είχα πάθει καρδιακή προσβολή.",
          "lesson": "Έχετε το δικαίωμα σε επείγουσα θεραπεία. Εάν κάποιος προσπαθήσει να σας απομακρύνει, ρωτήστε το όνομά του και πείτε ότι γνωρίζετε τα δικαιώματά σας."
        },
        "ana-tb": {
          "name": "Ana",
          "age": "31",
          "country": "Σλοβακία",
          "title": "Το TB δεν είναι θανατική ποινή — αλλά πρέπει να τελειώσετε το φάρμακο",
          "story": "Έβηχα για μήνες. Νόμιζα ότι ήταν απλώς ένα κρύο. Όταν τελικά πήγα στον γιατρό, μου είπαν ότι έχω φυματίωση. Ήμουν τρομοκρατημένος — νόμιζα ότι θα πέθαινα. Αλλά ο γιατρός εξήγησε ότι το TB μπορεί να θεραπευτεί με 6 μήνες φαρμάκου. Το πιο δύσκολο ήταν να έπαιρνα χάπια κάθε μέρα για 6 μήνες, ακόμα κι όταν ένιωθα καλύτερα μετά από 2 μήνες. Αλλά τελείωσα. θεραπεύομαι.",
          "lesson": "Εάν βήχετε για περισσότερες από 2 εβδομάδες, επισκεφθείτε έναν γιατρό. Το TB είναι ιάσιμο, αλλά ΠΡΕΠΕΙ να τελειώσετε όλο το φάρμακο."
        },
        "mirela-depression": {
          "name": "Mirela",
          "age": "40",
          "country": "Βόρεια Μακεδονία",
          "title": "Η κατάθλιψη δεν είναι αδυναμία - είναι ασθένεια",
          "story": "Αφού πέθανε ο άντρας μου, δεν μπορούσα να σηκωθώ από το κρεβάτι για μήνες. Η οικογένειά μου είπε ότι ήμουν τεμπέλης. Είπαν «απλά να είσαι δυνατός». Αλλά δεν μπορούσα. Ένας διαμεσολαβητής υγείας παρατήρησε ότι κάτι δεν πήγαινε καλά και με πήγε σε γιατρό. Ο γιατρός είπε ότι είχα κατάθλιψη — μια πραγματική ιατρική κατάσταση. Άρχισα την ιατρική και μιλάω με έναν σύμβουλο. Σιγά σιγά έγινα καλύτερα. Δεν είμαι αδύναμος. Ήμουν άρρωστος.",
          "lesson": "Η κατάθλιψη είναι μια ιατρική κατάσταση, όχι ένα ελάττωμα του χαρακτήρα. Η ιατρική και η συμβουλευτική μπορούν να βοηθήσουν. Ζητήστε βοήθεια."
        }
      }
    },
    "challenges": {
      "meta": {
        "title": "Προκλήσεις — Υγεία Redi",
        "description": "Προκλήσεις της Κοινότητας"
      },
      "title": "Ενεργές Προκλήσεις",
      "subtitle": "Εγγραφείτε στους στόχους της κοινότητας και τις προσωπικές προκλήσεις για να κερδίσετε μπόνους XP και σήματα.",
      "types": {
        "community": "κοινότητα",
        "personal": "προσωπική"
      },
      "daysLeft": "Απομένουν {count} ημέρες",
      "viewLeaderboard": "Προβολή βαθμολογικού πίνακα",
      "items": {
        "c1": {
          "title": "Πρωταθλητής Γνώσης Εμβολίων",
          "description": "Λάβετε 50 μαθητές στην περιοχή σας για να περάσουν την ενότητα Εμβόλια αυτήν την εβδομάδα."
        },
        "c2": {
          "title": "Σερί 7 ημερών υγείας",
          "description": "Καταγράψτε τη διάθεσή σας και την πρόσληψη νερού για 7 συνεχόμενες ημέρες."
        }
      }
    },
    "certificate": {
      "meta": {
        "title": "Πιστοποιητικό — Redi Health",
        "description": "Εθνικό Πιστοποιητικό Αλφαβητισμού Υγείας"
      },
      "title": "Το Πιστοποιητικό σας",
      "subtitle": "Έχετε ολοκληρώσει την Εθνική Σκηνή της Ακαδημίας Υγείας Φοιτητών.",
      "ofCompletion": "Πιστοποιητικό Ολοκλήρωσης",
      "diplomaTitle": "Εθνικός Γραμματισμός Υγείας",
      "awardedFor": "Βραβεύτηκε για την ολοκλήρωση του προγράμματος σπουδών Redi Health Student Academy.",
      "date": "Ημερομηνία",
      "downloadPdf": "Λήψη PDF",
      "share": "Κοινή χρήση",
      "gate": {
        "title": "Ολοκληρώστε πρώτα την Ακαδημία",
        "description": "Για να κερδίσετε το Πιστοποιητικό Υγείας Αλφαβητισμού σας, πρέπει να ολοκληρώσετε όλα τα μαθήματα και να περάσετε το κουίζ στο Εθνικό στάδιο της Ακαδημίας Υγείας Φοιτητών.",
        "cta": "Πήγαινε στην Ακαδημία"
      }
    }
  },
  "hr": {
    "healthQuiz": {
      "meta": {
        "title": "Zdravstveni kviz — Redi Health",
        "description": "Provjerite svoje zdravstveno znanje pomoću interaktivnih kvizova"
      },
      "title": "Zdravstveni kviz",
      "subtitle": "Provjerite svoje znanje. Naučite nešto novo.",
      "backToQuizzes": "Natrag na kvizove",
      "seeResults": "Pogledajte rezultate",
      "nextQuestion": "Sljedeće pitanje",
      "questionsCount": "{count} pitanja",
      "results": {
        "perfect": "Savršen rezultat!",
        "great": "odličan posao!",
        "good": "Dobar trud!",
        "keepLearning": "Nastavi učiti!",
        "score": "Dobili ste {score} od {total} točnih",
        "tryAgain": "Pokušajte ponovno",
        "moreQuizzes": "Više kvizova"
      },
      "quizzes": {
        "antibiotics": {
          "title": "Antibiotici",
          "description": "Znate li kada treba koristiti antibiotike?",
          "questions": [
            {
              "question": "Mogu li antibiotici izliječiti gripu?",
              "options": [
                "da",
                "br",
                "Ponekad"
              ],
              "explanation": "Gripu uzrokuje virus. Antibiotici ubijaju samo bakterije. Uzimanje antibiotika za gripu ne čini ništa i može otežati liječenje budućih infekcija."
            },
            {
              "question": "Osjećate se bolje nakon 3 dana uzimanja antibiotika. Trebate li prestati?",
              "options": [
                "Da, izliječen si",
                "Ne, završi cijeli tečaj",
                "Uzmite polovicu preostalih tableta"
              ],
              "explanation": "UVIJEK završite cijeli tečaj. Ako rano prestanete, neke bakterije prežive i postanu otporne. Sljedeći put, isti antibiotik neće djelovati."
            },
            {
              "question": "Možete li podijeliti antibiotike s članom obitelji koji ima slične simptome?",
              "options": [
                "Da, štedi novac",
                "Ne, nikada",
                "Samo ako se radi o istoj bolesti"
              ],
              "explanation": "Nikada nemojte dijeliti antibiotike. Za različite infekcije potrebni su različiti lijekovi. Pogrešan antibiotik može biti opasan i neće pomoći."
            },
            {
              "question": "Što se događa ako prečesto uzimate antibiotike?",
              "options": [
                "Ništa loše",
                "Vaše tijelo postaje imuno na bolesti",
                "Bakterije postaju otporne i teže ih je ubiti"
              ],
              "explanation": "Otpornost na antibiotike je globalna kriza. Kada bakterije postanu otporne, jednostavne infekcije mogu postati smrtonosne. Antibiotike uzimajte samo kada ih liječnik prepiše."
            }
          ]
        },
        "vaccines": {
          "title": "Cjepiva",
          "description": "Odvojite činjenice od mitova",
          "questions": [
            {
              "question": "Uzrokuju li cjepiva autizam?",
              "options": [
                "da",
                "br",
                "Ne znamo"
              ],
              "explanation": "NE Ovaj mit je krenuo od lažne studije koja je povučena. Liječnik koji je to objavio izgubio je liječničku licencu. Deseci studija s milijunima djece dokazuju da cjepiva NE uzrokuju autizam."
            },
            {
              "question": "Je li sigurno dati bebi više cjepiva odjednom?",
              "options": [
                "Ne, to je previše",
                "Da, siguran je i testiran",
                "Samo jedan po jedan"
              ],
              "explanation": "Imunološki sustav beba svakodnevno se nosi s tisućama klica. Kombinirana cjepiva su temeljito ispitana i sigurna. Odgađanje cjepiva ostavlja vaše dijete nezaštićenim."
            },
            {
              "question": "Moje dijete ima blagu prehladu. Mogu li se ipak cijepiti?",
              "options": [
                "Ne, čekaj dok ne bude potpuno zdrav",
                "Da, blaga prehlada je u redu",
                "Samo uz dopuštenje liječnika"
              ],
              "explanation": "Blaga prehlada, niska temperatura ili curenje nosa NISU razlog za odgodu cijepljenja. Samo teška bolest zahtijeva odgodu. Pitajte svog liječnika ako niste sigurni."
            },
            {
              "question": "Sadrže li cjepiva opasne kemikalije?",
              "options": [
                "Da, puni su toksina",
                "Ne, svi sastojci su sigurni u malim količinama",
                "Neki da, neki ne"
              ],
              "explanation": "Sastojci cjepiva prisutni su u malim, sigurnim količinama. Dobivate više aluminija iz majčinog mlijeka nego iz cjepiva. Svaki je sastojak testiran na sigurnost."
            }
          ]
        },
        "diabetes": {
          "title": "Dijabetes",
          "description": "Razumijevanje upravljanja dijabetesom",
          "questions": [
            {
              "question": "Je li dijabetes uzrokovan unosom previše šećera?",
              "options": [
                "da",
                "Ne, složenije je",
                "Samo tip 2"
              ],
              "explanation": "Dijabetes je uzrokovan genetikom, načinom života i načinom na koji vaše tijelo obrađuje inzulin. Konzumiranje šećera ga izravno ne uzrokuje, ali nezdrava prehrana i pretilost povećavaju rizik."
            },
            {
              "question": "Može li se dijabetes izliječiti prirodnim lijekovima poput cimeta?",
              "options": [
                "Da, cimet ga liječi",
                "Ne, nema lijeka, ali se može riješiti",
                "Da, s dovoljno češnjaka i začinskog bilja"
              ],
              "explanation": "NEMA lijeka za dijabetes. Može se upravljati lijekovima, zdravom hranom i tjelovježbom. Cimet može imati male koristi, ali NE MOŽE zamijeniti lijekove. Ljudi koji prestanu uzimati lijek završe u bolnici."
            },
            {
              "question": "Dijabetičar osjeća vrtoglavicu i znoj se. Što trebate učiniti?",
              "options": [
                "Dajte im inzulin",
                "Odmah im dajte nešto slatko",
                "Reci im da se odmore"
              ],
              "explanation": "Ovo su znakovi NISKOG šećera u krvi (hipoglikemije). Odmah im dajte sok, slatkiše ili šećernu vodicu. Ovo može biti opasno po život. Nakon što se osjećaju bolje, trebali bi pojesti odgovarajući obrok."
            },
            {
              "question": "Koliko često dijabetičar treba pregledavati svoja stopala?",
              "options": [
                "Nikad, noge su u redu",
                "Svaki dan",
                "Jednom godišnje"
              ],
              "explanation": "Dijabetes može oštetiti živce u vašim stopalima. Možda nećete osjetiti posjekotine ili ranice. Provjeravajte svoja stopala SVAKI DAN na posjekotine, žuljeve ili promjene boje. Male rane mogu postati ozbiljne infekcije."
            }
          ]
        },
        "hygiene": {
          "title": "Higijena i prevencija",
          "description": "Osnovne zdravstvene navike koje spašavaju živote",
          "questions": [
            {
              "question": "Koliko dugo trebate prati ruke sapunom?",
              "options": [
                "5 sekundi",
                "Najmanje 20 sekundi",
                "1 minuta"
              ],
              "explanation": "Perite se najmanje 20 sekundi — otprilike onoliko vremena koliko je potrebno da dva puta otpjevate 'Happy Birthday'. Ovo uklanja većinu klica. Brza ispiranja ne rade."
            },
            {
              "question": "Je li sigurno piti vodu iz rijeke ili potoka?",
              "options": [
                "Da, prirodna voda je čista",
                "Ne, uvijek ga prvo prokuhajte ili filtrirajte",
                "Samo ako izgleda jasno"
              ],
              "explanation": "Čak i bistra voda može sadržavati opasne bakterije i parazite. Vodu uvijek kuhajte najmanje 1 minutu ili koristite filter. Prljava voda uzrokuje proljev, koleru i tifus."
            },
            {
              "question": "Vaše dijete ima proljev. Što je najvažnije?",
              "options": [
                "Zaustavite svu hranu",
                "Dajte puno tekućine (voda, ORS)",
                "Dajte antibiotike"
              ],
              "explanation": "Dehidracija uzrokovana proljevom ubije više djece nego sam proljev. Dajte otopinu za oralnu rehidraciju (ORS) ili čistu vodu s prstohvatom soli i šećera. Nastavite dojiti bebe."
            },
            {
              "question": "Kada treba oprati ruke?",
              "options": [
                "Samo prije jela",
                "Prije jela, nakon toaleta, nakon dodirivanja životinja, nakon kašljanja",
                "Samo kad izgledaju prljavo"
              ],
              "explanation": "Klice su nevidljive. Perite ruke: prije jela/kuhanja, nakon korištenja toaleta, nakon mijenjanja pelena, nakon dodirivanja životinja, nakon kašljanja/kihanja i nakon dodirivanja bolesnih osoba."
            }
          ]
        }
      }
    },
    "rights": {
      "meta": {
        "title": "Upoznajte svoja prava — Redi Health",
        "description": "Prava pacijenata, pomoć protiv diskriminacije i pravni kontakti za romske zajednice"
      },
      "title": "Upoznajte svoja prava",
      "subtitle": "Imate prava kao pacijent. Naučite ih. Koristite ih.",
      "back": "natrag",
      "menu": {
        "patientRights": {
          "title": "Prava pacijenata",
          "desc": "8 prava koja svaki pacijent ima"
        },
        "discrimination": {
          "title": "Suočavanje s diskriminacijom?",
          "desc": "Što reći i učiniti — korak po korak"
        },
        "contacts": {
          "title": "Pravna pomoć po zemlji",
          "desc": "Ombudsman, antidiskriminacija, romske organizacije"
        }
      },
      "views": {
        "patientRights": "Vaša prava pacijenata",
        "discrimination": "Ako ste suočeni s diskriminacijom",
        "discriminationDesc": "Stvarne situacije i točno što reći i učiniti.",
        "contacts": "Pravna pomoć po zemlji"
      },
      "labels": {
        "sayThis": "Reci ovo:",
        "thenDo": "Zatim učinite ovo:",
        "patientOmbudsman": "Pravobranitelj za pacijente",
        "antiDiscrimination": "Protiv diskriminacije",
        "romaRightsOrg": "Organizacija za prava Roma"
      },
      "rights": {
        "treatment": {
          "title": "Pravo na hitno liječenje",
          "description": "Svaka vas bolnica MORA liječiti u hitnim slučajevima, čak i bez osiguranja ili dokumenata. Ovo je zakon u svakoj EU zemlji. Ako odbiju, zatražite ime liječnika i prijavite ga."
        },
        "information": {
          "title": "Pravo na razumijevanje vaše dijagnoze",
          "description": "Vaš liječnik mora objasniti vaše stanje riječima koje razumijete. Ako ne razumijete, recite: 'Možete li ovo objasniti jednostavnije?' Također možete zatražiti pisani sažetak."
        },
        "consent": {
          "title": "Pravo reći ne",
          "description": "Nitko vas ne može prisiliti na liječenje. Prije bilo kakvog zahvata liječnik mora objasniti što će učiniti, a vi se morate složiti. Uvijek možete reći 'treba mi vremena za razmišljanje.'"
        },
        "privacy": {
          "title": "Pravo na privatnost",
          "description": "Vaši medicinski podaci su privatni. Liječnici to ne mogu dijeliti s vašim poslodavcem, obitelji ili bilo kim drugim bez vašeg dopuštenja. To uključuje vaš HIV status, trudnoću ili mentalno zdravlje."
        },
        "interpreter": {
          "title": "Pravo na tumača",
          "description": "Ako ne govorite dobro lokalni jezik, možete zatražiti tumača. Mnoge bolnice imaju ovu uslugu. Ako ne, možete dovesti nekoga kome vjerujete da prevede."
        },
        "second-opinion": {
          "title": "Pravo na drugo mišljenje",
          "description": "Ako se ne slažete s dijagnozom, možete posjetiti drugog liječnika. Ovo je tvoje pravo. Ne morate objašnjavati zašto."
        },
        "records": {
          "title": "Pravo na vašu medicinsku dokumentaciju",
          "description": "U svakom trenutku možete zatražiti presliku svih svojih medicinskih podataka. Bolnica ih mora osigurati. Ovo je korisno kada mijenjate liječnika ili se selite u drugi grad."
        },
        "complaint": {
          "title": "Pravo na žalbu",
          "description": "Ako se osjećate zlostavljano ili diskriminirano, možete podnijeti pritužbu. Svaka bolnica ima postupak za pritužbe. Također se možete obratiti pravobranitelju za pacijente u svojoj zemlji."
        }
      },
      "scenarios": {
        "refused-treatment": {
          "situation": "Bolnica vas odbija liječiti",
          "whatToSay": "\"Imam pravo na hitno liječenje prema zakonu EU. Molimo zapišite svoje ime i razlog odbijanja.\"",
          "whatToDo": [
            "Ostanite mirni, ali čvrsti",
            "Zatražite puno ime liječnika",
            "Zatražite odbijanje pismenim putem",
            "Nazovite pravobranitelja za pacijente",
            "Obratite se organizaciji za prava Roma"
          ]
        },
        "rude-staff": {
          "situation": "Bolničko osoblje je nepristojno ili omalovažavajuće zbog vaše etničke pripadnosti",
          "whatToSay": "\"Ovdje sam zbog medicinske pomoći. Očekujem da me tretiraju s istim poštovanjem kao i svakog drugog pacijenta.\"",
          "whatToDo": [
            "Zatražite razgovor s glavnom sestrom ili šefom odjela",
            "Zabilježite datum, vrijeme i imena",
            "Podnesite pisani prigovor u bolnici",
            "Prijavite nacionalnom tijelu za suzbijanje diskriminacije"
          ]
        },
        "no-insurance": {
          "situation": "Nemate zdravstveno osiguranje",
          "whatToSay": "\"Trebam liječničku pomoć. Koje su moje mogućnosti za neosigurane pacijente?\"",
          "whatToDo": [
            "Hitna pomoć je uvijek besplatna — inzistirajte na tome",
            "Raspitajte se o programima socijalne pomoći",
            "Obratite se zdravstvenom posredniku u vašem području",
            "Mnoge nevladine organizacije pružaju besplatne klinike - pitajte u bolnici"
          ]
        },
        "language-barrier": {
          "situation": "Ne možete komunicirati s liječnikom",
          "whatToSay": "\"Trebam pomoć za razumijevanje. Možete li osigurati prevoditelja ili govoriti sporije?\"",
          "whatToDo": [
            "Koristite ovu aplikaciju za prijevod ključnih izraza",
            "Dovedite osobu od povjerenja koja govori jezik",
            "Zatražite pisane upute koje kasnije možete prevesti",
            "Koristite kameru svog telefona za prijevod dokumenata"
          ]
        }
      },
      "contacts": {
        "romania": {
          "country": "Romania",
          "ombudsman": "Avocatul Poporului",
          "antiDiscrimination": "CNCD",
          "ombudsmanPhone": "021 312 7134",
          "antiDiscriminationPhone": "021 312 6578",
          "romaRightsOrg": "Romani CRISS"
        },
        "bulgaria": {
          "country": "Bulgaria",
          "ombudsman": "Ombudsman of Bulgaria",
          "antiDiscrimination": "Commission for Protection against Discrimination",
          "ombudsmanPhone": "02 810 6955",
          "romaRightsOrg": "Amalipe Center"
        },
        "hungary": {
          "country": "Hungary",
          "ombudsman": "Commissioner for Fundamental Rights",
          "antiDiscrimination": "Equal Treatment Authority",
          "ombudsmanPhone": "06 1 475 7100",
          "romaRightsOrg": "Romaversitas Foundation"
        },
        "slovakia": {
          "country": "Slovakia",
          "ombudsman": "Public Defender of Rights",
          "antiDiscrimination": "Slovak National Centre for Human Rights",
          "ombudsmanPhone": "02 4828 7401",
          "romaRightsOrg": "ETP Slovakia"
        },
        "czech-republic": {
          "country": "Czech Republic",
          "ombudsman": "Public Defender of Rights",
          "antiDiscrimination": "Office of the Public Defender",
          "ombudsmanPhone": "542 542 888",
          "romaRightsOrg": "Romea.cz"
        },
        "serbia": {
          "country": "Serbia",
          "ombudsman": "Protector of Citizens",
          "antiDiscrimination": "Commissioner for Equality",
          "ombudsmanPhone": "011 206 8100",
          "romaRightsOrg": "Praxis"
        },
        "albania": {
          "country": "Albania",
          "ombudsman": "People's Advocate",
          "antiDiscrimination": "Commissioner for Protection from Discrimination",
          "ombudsmanPhone": "042 380 300"
        },
        "north-macedonia": {
          "country": "North Macedonia",
          "ombudsman": "Ombudsman",
          "antiDiscrimination": "Commission for Prevention and Protection against Discrimination",
          "ombudsmanPhone": "02 3129 335"
        },
        "greece": {
          "country": "Greece",
          "ombudsman": "Greek Ombudsman",
          "antiDiscrimination": "Greek Ombudsman (Equal Treatment)",
          "ombudsmanPhone": "213 130 6600"
        },
        "croatia": {
          "country": "Croatia",
          "ombudsman": "Ombudswoman",
          "antiDiscrimination": "Ombudswoman",
          "ombudsmanPhone": "01 4851 855"
        }
      }
    },
    "stories": {
      "meta": {
        "title": "Priče zajednice — Redi Health",
        "description": "Prava zdravstvena iskustva iz romskih zajednica diljem Europe"
      },
      "title": "Priče zajednice",
      "subtitle": "Prava iskustva iz romskih zajednica. Učite od drugih.",
      "backToStories": "Natrag na priče",
      "lessonLearned": "Naučena lekcija",
      "whatToDoNext": "Što dalje činiti",
      "categories": {
        "vaccines": "Cjepiva",
        "chronic": "Kronična bolest",
        "maternal": "Trudnoća",
        "discrimination": "Prava",
        "prevention": "Prevencija",
        "mental": "Mentalno zdravlje"
      },
      "nextSteps": {
        "vaccineGuide": "Vodič za cjepiva",
        "askZuvo": "Pitaj Zuvo",
        "explainPrescription": "Objasnite recept",
        "navigateToCare": "Navigirajte do brige",
        "knowYourRights": "Upoznajte svoja prava",
        "learnPrevention": "Naučite prevenciju",
        "checkSymptoms": "Provjerite simptome",
        "learnMentalHealth": "Učite o mentalnom zdravlju"
      },
      "entries": {
        "maria-vaccines": {
          "name": "Maria",
          "age": "28",
          "country": "Rumunjska",
          "title": "Kćer skoro nisam cijepila",
          "story": "Moja svekrva mi je rekla da su cjepiva otrovna. Svi u naselju su rekli isto. Kad mi se kćer rodila, bilo me strah. Ali zdravstvena medijatorka došla je u naš dom i sve nam objasnila — kako cjepiva djeluju, kakve su zapravo nuspojave. Pokazala mi je fotografije djece s ospicama. Više sam se bojala bolesti nego cjepiva. Moja kći je dobila sva cjepiva. Zdrava je i jaka.",
          "lesson": "Razgovarajte sa zdravstvenim medijatorom ili liječnikom prije donošenja odluka na temelju onoga što drugi kažu. Cjepiva spašavaju živote."
        },
        "stefan-diabetes": {
          "name": "Stefan",
          "age": "52",
          "country": "Bugarska",
          "title": "Prestala sam uzimati lijekove za dijabetes i skoro umrla",
          "story": "Dijagnosticiran mi je dijabetes tipa 2 u 45. Od lijeka me zabolio želudac pa sam ga prestala uzimati. Moj susjed je rekao da će me čaj od cimeta izliječiti. Umjesto toga 2 godine sam pila čaj od cimeta. Onda sam se jednog dana srušio. Šećer u krvi mi je bio preko 500. Doktori su rekli da su mi bubrezi oštećeni. Sada pijem lijek svaki dan. Volio bih da nikad nisam prestao.",
          "lesson": "Nikada nemojte prestati uzimati lijek bez razgovora s liječnikom. Prirodni lijekovi ne mogu zamijeniti lijekove za dijabetes."
        },
        "elena-pregnancy": {
          "name": "Elena",
          "age": "22",
          "country": "Srbija",
          "title": "Moja prva trudnoća — nisam znala da mogu posjetiti liječnika besplatno",
          "story": "Kad sam zatrudnjela u 19, nisam išla liječniku 6 mjeseci. Nisam imao osiguranje i mislio sam da će koštati previše. Zdravstvena medijatorka mi je rekla da je prenatalna njega besplatna za sve trudnice u Srbiji. Pomogla mi je da se registriram. Liječnik je ustanovio da imam anemiju i visok krvni tlak. Da nisam otišla, moje dijete je moglo biti u opasnosti.",
          "lesson": "Prenatalna skrb besplatna je u većini europskih zemalja. Zamolite zdravstvenog medijatora da vam pomogne u prijavi."
        },
        "janos-discrimination": {
          "name": "János",
          "age": "35",
          "country": "Mađarska",
          "title": "U bolnici su me pokušali poslati",
          "story": "Otišao sam na hitnu s bolovima u prsima. Sestra me pogledala i rekla 'Siti smo, idi u drugu bolnicu.' Znao sam da ovo nije u redu. Rekao sam: 'Imam bol u prsima. Morate me pregledati. Molim te daj mi svoje ime.' Njezin se stav odmah promijenio. Pregledali su me i ustanovili da imam srčani problem koji treba liječiti. Da sam otišao, mogao sam dobiti srčani udar.",
          "lesson": "Imate pravo na hitno liječenje. Ako vas netko pokuša odbiti, pitajte ga za ime i recite da znate svoja prava."
        },
        "ana-tb": {
          "name": "Ana",
          "age": "31",
          "country": "Slovačka",
          "title": "TB nije smrtna kazna — ali morate dovršiti lijek",
          "story": "Kašljao sam mjesecima. Mislio sam da je samo prehlada. Kad sam konačno otišao liječniku, rekli su da imam tuberkulozu. Bio sam prestravljen — mislio sam da ću umrijeti. Ali liječnik je objasnio da se TB može izliječiti 6 mjeseci lijeka. Najteže mi je bilo piti tablete svaki dan 6 mjeseci, čak i kad sam se nakon 2 mjeseca osjećala bolje. Ali završio sam. izliječen sam.",
          "lesson": "Ako kašljete dulje od 2 tjedna, posjetite liječnika. TB je izlječiv, ali MORATE popiti sav lijek."
        },
        "mirela-depression": {
          "name": "Mirela",
          "age": "40",
          "country": "Sjeverna Makedonija",
          "title": "Depresija nije slabost - to je bolest",
          "story": "Nakon što mi je muž umro, mjesecima nisam mogla ustati iz kreveta. Moja obitelj je rekla da sam lijen. Rekli su 'samo budi jak'. Ali nisam mogla. Zdravstvena medijatorka je primijetila da nešto nije u redu i odvela me liječniku. Liječnik je rekao da imam depresiju - stvarno zdravstveno stanje. Počeo sam s medicinom i razgovarao sa savjetnikom. Polako mi je bilo bolje. Nisam slaba. bila sam bolesna.",
          "lesson": "Depresija je zdravstveno stanje, a ne karakterna mana. Lijekovi i savjetovanje mogu pomoći. Molimo zatražite pomoć."
        }
      }
    },
    "challenges": {
      "meta": {
        "title": "Izazovi — Redi Health",
        "description": "Izazovi zajednice"
      },
      "title": "Aktivni izazovi",
      "subtitle": "Pridružite se ciljevima zajednice i osobnim izazovima da zaradite bonus XP i značke.",
      "types": {
        "community": "zajednice",
        "personal": "osobni"
      },
      "daysLeft": "Još {count} dana",
      "viewLeaderboard": "Pregledajte Leaderboard",
      "items": {
        "c1": {
          "title": "Šampion znanja o cjepivima",
          "description": "Navedite 50 učenika u vašem lokalnom području da polože modul Cjepivo ovaj tjedan."
        },
        "c2": {
          "title": "7-dnevni zdravstveni niz",
          "description": "Zabilježite svoje raspoloženje i unos vode 7 dana zaredom."
        }
      }
    },
    "certificate": {
      "meta": {
        "title": "Certifikat — Redi Health",
        "description": "Državni certifikat o zdravstvenoj pismenosti"
      },
      "title": "Vaš certifikat",
      "subtitle": "Završili ste Nacionalnu etapu Studentske zdravstvene akademije.",
      "ofCompletion": "Potvrda o završenom studiju",
      "diplomaTitle": "Nacionalna zdravstvena pismenost",
      "awardedFor": "Dodjeljuje se za završetak kurikuluma Redi Health Student Academy.",
      "date": "Datum",
      "downloadPdf": "Preuzmite PDF",
      "share": "Podijelite",
      "gate": {
        "title": "Najprije završite Akademiju",
        "description": "Da biste stekli svoj certifikat o zdravstvenoj pismenosti, trebate završiti sve lekcije i položiti kviz u nacionalnoj fazi Studentske zdravstvene akademije.",
        "cta": "Idi na Akademiju"
      }
    }
  },
  "hu": {
    "healthQuiz": {
      "meta": {
        "title": "Egészségügyi kvíz – Redi Health",
        "description": "Tesztelje egészségügyi ismereteit interaktív vetélkedőkkel"
      },
      "title": "Egészségügyi kvíz",
      "subtitle": "Tesztelje tudását. Tanulj valami újat.",
      "backToQuizzes": "Vissza a kvízekhez",
      "seeResults": "Lásd az eredményeket",
      "nextQuestion": "Következő kérdés",
      "questionsCount": "{count} kérdés",
      "results": {
        "perfect": "Tökéletes pontszám!",
        "great": "Remek munka!",
        "good": "Jó erőfeszítést!",
        "keepLearning": "Tanulj tovább!",
        "score": "{score}/{total} helyes eredmény",
        "tryAgain": "Próbáld újra",
        "moreQuizzes": "Még több kvíz"
      },
      "quizzes": {
        "antibiotics": {
          "title": "Antibiotikumok",
          "description": "Tudja, mikor kell antibiotikumot alkalmazni?",
          "questions": [
            {
              "question": "Az antibiotikumok gyógyíthatják az influenzát?",
              "options": [
                "Igen",
                "Nem",
                "Néha"
              ],
              "explanation": "Az influenzát vírus okozza. Az antibiotikumok csak a baktériumokat pusztítják el. Az influenza elleni antibiotikumok szedése semmit sem okoz, és megnehezítheti a jövőbeni fertőzések kezelését."
            },
            {
              "question": "3 napos antibiotikum kezelés után jobban érzi magát. Meg kellene állnod?",
              "options": [
                "Igen, meggyógyultál",
                "Nem, fejezze be a teljes tanfolyamot",
                "Vegye be a maradék tabletták felét"
              ],
              "explanation": "MINDIG fejezze be a teljes tanfolyamot. Ha korán abbahagyja, néhány baktérium túléli és rezisztenssé válik. Legközelebb ugyanaz az antibiotikum nem fog hatni."
            },
            {
              "question": "Megoszthat antibiotikumot egy családtaggal, akinek hasonló tünetei vannak?",
              "options": [
                "Igen, pénzt takarít meg",
                "Nem, soha",
                "Csak ha ugyanaz a betegség"
              ],
              "explanation": "Soha ne osszon antibiotikumot. A különböző fertőzésekhez különböző gyógyszerekre van szükség. A nem megfelelő antibiotikum veszélyes lehet, és nem segít."
            },
            {
              "question": "Mi történik, ha túl gyakran szed antibiotikumot?",
              "options": [
                "Semmi rossz",
                "A szervezet immunissá válik a betegségekkel szemben",
                "A baktériumok ellenállóvá válnak, és nehezebb elpusztulni"
              ],
              "explanation": "Az antibiotikum-rezisztencia globális válság. Amikor a baktériumok ellenállóvá válnak, az egyszerű fertőzések halálossá válhatnak. Csak akkor vegyen be antibiotikumot, ha az orvos felírja."
            }
          ]
        },
        "vaccines": {
          "title": "Védőoltások",
          "description": "Különítsd el a tényeket a mítoszoktól",
          "questions": [
            {
              "question": "Okoznak a védőoltások autizmust?",
              "options": [
                "Igen",
                "Nem",
                "Nem tudjuk"
              ],
              "explanation": "NEM. Ez a mítosz egy csaló tanulmányból indult ki, amelyet visszavontak. Az orvos, aki közzétette, elvesztette orvosi engedélyét. Több millió gyermekkel végzett tanulmányok tucatjai bizonyítják, hogy a vakcinák NEM okoznak autizmust."
            },
            {
              "question": "Biztonságos-e egyszerre több oltást beadni a babának?",
              "options": [
                "Nem, túl sok",
                "Igen, biztonságos és tesztelt",
                "Egyszerre csak egyet"
              ],
              "explanation": "A csecsemők immunrendszere naponta több ezer baktériumot kezel. A kombinált vakcinák alaposan teszteltek és biztonságosak. A védőoltások késleltetése védtelenné teszi gyermekét."
            },
            {
              "question": "Gyermekem enyhe nátha. Kaphatnak még oltást?",
              "options": [
                "Nem, várja meg, amíg teljesen egészséges lesz",
                "Igen, az enyhe megfázás is jó",
                "Csak orvosi engedéllyel"
              ],
              "explanation": "Enyhe megfázás, alacsony láz vagy orrfolyás NEM ok az oltás elhalasztására. Csak súlyos betegség esetén van szükség halasztásra. Ha bizonytalan, kérdezze meg orvosát."
            },
            {
              "question": "Tartalmaznak veszélyes vegyi anyagokat a vakcinák?",
              "options": [
                "Igen, tele vannak méreganyagokkal",
                "Nem, minden összetevő biztonságos kis mennyiségben is",
                "Van aki igen, van aki nem"
              ],
              "explanation": "A vakcina összetevői kis, biztonságos mennyiségben vannak jelen. Az anyatejből több alumíniumot kapsz, mint egy vakcinából. Minden összetevőt teszteltek a biztonság érdekében."
            }
          ]
        },
        "diabetes": {
          "title": "Cukorbetegség",
          "description": "A cukorbetegség kezelésének megértése",
          "questions": [
            {
              "question": "A cukorbetegség oka a túl sok cukorfogyasztás?",
              "options": [
                "Igen",
                "Nem, ez bonyolultabb",
                "Csak a 2. típus"
              ],
              "explanation": "A cukorbetegség oka a genetika, az életmód és az, hogy a szervezet hogyan dolgozza fel az inzulint. A cukorfogyasztás közvetlenül nem okozza, de az egészségtelen táplálkozás és az elhízás növeli a kockázatot."
            },
            {
              "question": "A cukorbetegség gyógyítható természetes gyógymódokkal, például a fahéjjal?",
              "options": [
                "Igen, a fahéj gyógyít",
                "Nem, nincs gyógymód, de kezelhető",
                "Igen, elegendő fokhagymával és fűszernövényekkel"
              ],
              "explanation": "A cukorbetegségre NINCS gyógymód. Gyógyszerekkel, egészséges ételekkel és testmozgással KEZELHETŐ. A fahéjnak apró előnyei lehetnek, de NEM helyettesítheti a gyógyszert. Azok, akik abbahagyják a gyógyszer szedését, kórházba kerülnek."
            },
            {
              "question": "A cukorbetegek szédülnek és izzadnak. Mit kell tenned?",
              "options": [
                "Adj nekik inzulint",
                "Azonnal adj nekik valami édeset",
                "Mondd meg nekik, hogy pihenjenek"
              ],
              "explanation": "Ezek az ALACSONY vércukorszint (hipoglikémia) jelei. Azonnal adjon nekik gyümölcslevet, cukorkát vagy cukros vizet. Ez életveszélyes lehet. Miután jobban érzik magukat, megfelelő ételt kell enniük."
            },
            {
              "question": "Milyen gyakran kell egy cukorbetegnek ellenőriznie a lábát?",
              "options": [
                "Soha, a lábak jól vannak",
                "Minden nap",
                "Évente egyszer"
              ],
              "explanation": "A cukorbetegség károsíthatja a láb idegeit. Előfordulhat, hogy nem érez vágásokat vagy sebeket. MINDEN NAP ellenőrizze lábát vágások, hólyagok vagy színváltozások szempontjából. A kis sebek súlyos fertőzésekké válhatnak."
            }
          ]
        },
        "hygiene": {
          "title": "Higiénia és megelőzés",
          "description": "Alapvető egészségügyi szokások, amelyek életeket menthetnek",
          "questions": [
            {
              "question": "Meddig kell kezet mosni szappannal?",
              "options": [
                "5 másodperc",
                "Legalább 20 másodpercig",
                "1 perc"
              ],
              "explanation": "Moss legalább 20 másodpercig – körülbelül annyi idő, mint a „Happy Birthday” kétszeri eléneklése. Ez eltávolítja a legtöbb baktériumot. A gyors öblítés nem működik."
            },
            {
              "question": "Biztonságos-e folyóból vagy patakból vizet inni?",
              "options": [
                "Igen, a természetes víz tiszta",
                "Nem, mindig először forraljuk fel vagy szűrjük le",
                "Csak ha tisztán látszik"
              ],
              "explanation": "Még a tiszta víz is tartalmazhat veszélyes baktériumokat és parazitákat. Mindig forraljon vizet legalább 1 percig, vagy használjon szűrőt. A piszkos víz hasmenést, kolerát és tífuszt okoz."
            },
            {
              "question": "Gyermekének hasmenése van. Mi a legfontosabb?",
              "options": [
                "Állítson le minden ételt",
                "Adjon sok folyadékot (víz, ORS)",
                "Adj antibiotikumot"
              ],
              "explanation": "A hasmenés okozta kiszáradás több gyermeket öl meg, mint maga a hasmenés. Adjon orális rehidratáló oldatot (ORS) vagy tiszta vizet egy csipet sóval és cukorral. Továbbra is szoptassa a babákat."
            },
            {
              "question": "Mikor kell kezet mosni?",
              "options": [
                "Csak evés előtt",
                "Étkezés előtt, WC után, állatok érintése után, köhögés után",
                "Csak akkor, ha piszkosnak tűnnek"
              ],
              "explanation": "A baktériumok láthatatlanok. Mossunk kezet: evés/főzés előtt, vécéhasználat után, pelenkázás után, állatok érintése után, köhögés/tüsszentés, beteg emberek érintése után."
            }
          ]
        }
      }
    },
    "rights": {
      "meta": {
        "title": "Ismerje meg jogait – Redi Health",
        "description": "Betegjogok, diszkriminációs segítség, jogi kapcsolattartás a roma közösségek számára"
      },
      "title": "Ismerje meg jogait",
      "subtitle": "Betegként jogai vannak. Tanuld meg őket. Használd őket.",
      "back": "Vissza",
      "menu": {
        "patientRights": {
          "title": "Betegjogok",
          "desc": "8 joga van minden betegnek"
        },
        "discrimination": {
          "title": "Szembesülni a diszkriminációval?",
          "desc": "Mit kell mondani és tenni – lépésről lépésre"
        },
        "contacts": {
          "title": "Jogi segítség országonként",
          "desc": "Ombudsman, antidiszkrimináció, roma orgs"
        }
      },
      "views": {
        "patientRights": "Az Ön betegjogai",
        "discrimination": "Ha diszkriminációval szembesül",
        "discriminationDesc": "Valós helyzetek és pontosan mit kell mondani és tenni.",
        "contacts": "Jogi segítség országonként"
      },
      "labels": {
        "sayThis": "Mondd ezt:",
        "thenDo": "Ezután tegye ezt:",
        "patientOmbudsman": "Betegombudsman",
        "antiDiscrimination": "Anti-Discrimination",
        "romaRightsOrg": "Roma Rights Organization"
      },
      "rights": {
        "treatment": {
          "title": "Sürgősségi ellátáshoz való jog",
          "description": "Minden kórháznak KELL ellátnia Önt vészhelyzetben, még biztosítás vagy dokumentumok nélkül is. Ez minden EU-tagállam törvénye. Ha megtagadják, kérdezze meg az orvos nevét és jelentse."
        },
        "information": {
          "title": "Joga, hogy megértse a diagnózisát",
          "description": "Orvosának olyan szavakkal kell elmagyaráznia állapotát, amelyeket megért. Ha nem érted, mondd: \"El tudnád ezt magyarázni egyszerűbben?\" Kérhet írásos összefoglalót is."
        },
        "consent": {
          "title": "Joga nemet mondani",
          "description": "Senki sem kényszerítheti rád a kezelést. Minden eljárás előtt az orvosnak el kell magyaráznia, mit fog tenni, és Önnek meg kell állapodnia. Mindig mondhatod, hogy \"gondolkodási időre van szükségem\"."
        },
        "privacy": {
          "title": "A magánélethez való jog",
          "description": "Orvosi adatai privátak. Az orvosok nem oszthatják meg munkáltatójával, családjával vagy bárki mással az Ön engedélye nélkül. Ez magában foglalja az Ön HIV-státuszát, terhességét vagy mentális egészségét."
        },
        "interpreter": {
          "title": "Tolmácshoz való jog",
          "description": "Ha nem beszéli jól a helyi nyelvet, kérhet tolmácsot. Sok kórház rendelkezik ezzel a szolgáltatással. Ha nem, hozhat valakit, akiben megbízik, hogy fordítson le."
        },
        "second-opinion": {
          "title": "Második vélemény joga",
          "description": "Ha nem ért egyet a diagnózissal, egy másik orvoshoz fordulhat. Ez a jogod. Nem kell magyarázni, miért."
        },
        "records": {
          "title": "Az orvosi feljegyzéseihez való jog",
          "description": "Bármikor kérhet másolatot az összes orvosi feljegyzéséről. A kórháznak biztosítania kell őket. Ez akkor hasznos, ha orvost vált, vagy másik városba költözik."
        },
        "complaint": {
          "title": "Panasz joga",
          "description": "Ha úgy érzi, hogy rosszul bánnak vele, vagy diszkriminálják, panaszt tehet. Minden kórházban van panaszkezelési eljárás. Felveheti a kapcsolatot országa betegombudsmanjával is."
        }
      },
      "scenarios": {
        "refused-treatment": {
          "situation": "A kórház nem hajlandó kezelni",
          "whatToSay": "\"Az uniós jog értelmében jogom van sürgősségi ellátáshoz. Kérjük, írja le a nevét és az elutasítás okát.\"",
          "whatToDo": [
            "Maradj nyugodt, de határozott",
            "Kérd meg az orvos teljes nevét",
            "Kérje írásban az elutasítást",
            "Hívja a beteg ombudsmant",
            "Vegye fel a kapcsolatot egy romajogi szervezettel"
          ]
        },
        "rude-staff": {
          "situation": "A kórházi személyzet durva vagy elutasító az Ön etnikai hovatartozása miatt",
          "whatToSay": "\"Orvosi segítségért vagyok itt. Elvárom, hogy ugyanolyan tisztelettel bánjanak velem, mint minden más beteggel.\"",
          "whatToDo": [
            "Kérje meg, hogy beszéljen a főnővérrel vagy az osztályvezetővel",
            "Jegyezze fel a dátumot, az időt és a neveket",
            "Írjon panaszt a kórházban",
            "Jelentés a nemzeti diszkriminációellenes testületnek"
          ]
        },
        "no-insurance": {
          "situation": "Nincs egészségbiztosításod",
          "whatToSay": "\"Orvosi segítségre van szükségem. Milyen lehetőségeim vannak a nem biztosított betegek számára?\"",
          "whatToDo": [
            "A sürgősségi ellátás mindig ingyenes – ragaszkodjon hozzá",
            "Érdeklődjön a szociális segélyprogramokról",
            "Vegye fel a kapcsolatot egy egészségügyi közvetítővel a környéken",
            "Sok civil szervezet ingyenes klinikát biztosít – érdeklődjön a kórházban"
          ]
        },
        "language-barrier": {
          "situation": "Nem tudsz kommunikálni az orvossal",
          "whatToSay": "\"Segítségre van szükségem a megértéshez. Tudsz tolmácsot biztosítani, vagy lassabban beszélsz?\"",
          "whatToDo": [
            "Használja ezt az alkalmazást kulcskifejezések lefordításához",
            "Hozz magaddal egy megbízható személyt, aki beszéli a nyelvet",
            "Kérjen írásos utasításokat, amelyeket később lefordíthat",
            "Használja telefonja kameráját dokumentumok fordításához"
          ]
        }
      },
      "contacts": {
        "romania": {
          "country": "Romania",
          "ombudsman": "Avocatul Poporului",
          "antiDiscrimination": "CNCD",
          "ombudsmanPhone": "021 312 7134",
          "antiDiscriminationPhone": "021 312 6578",
          "romaRightsOrg": "Romani CRISS"
        },
        "bulgaria": {
          "country": "Bulgaria",
          "ombudsman": "Ombudsman of Bulgaria",
          "antiDiscrimination": "Commission for Protection against Discrimination",
          "ombudsmanPhone": "02 810 6955",
          "romaRightsOrg": "Amalipe Center"
        },
        "hungary": {
          "country": "Hungary",
          "ombudsman": "Commissioner for Fundamental Rights",
          "antiDiscrimination": "Equal Treatment Authority",
          "ombudsmanPhone": "06 1 475 7100",
          "romaRightsOrg": "Romaversitas Foundation"
        },
        "slovakia": {
          "country": "Slovakia",
          "ombudsman": "Public Defender of Rights",
          "antiDiscrimination": "Slovak National Centre for Human Rights",
          "ombudsmanPhone": "02 4828 7401",
          "romaRightsOrg": "ETP Slovakia"
        },
        "czech-republic": {
          "country": "Czech Republic",
          "ombudsman": "Public Defender of Rights",
          "antiDiscrimination": "Office of the Public Defender",
          "ombudsmanPhone": "542 542 888",
          "romaRightsOrg": "Romea.cz"
        },
        "serbia": {
          "country": "Serbia",
          "ombudsman": "Protector of Citizens",
          "antiDiscrimination": "Commissioner for Equality",
          "ombudsmanPhone": "011 206 8100",
          "romaRightsOrg": "Praxis"
        },
        "albania": {
          "country": "Albania",
          "ombudsman": "People's Advocate",
          "antiDiscrimination": "Commissioner for Protection from Discrimination",
          "ombudsmanPhone": "042 380 300"
        },
        "north-macedonia": {
          "country": "North Macedonia",
          "ombudsman": "Ombudsman",
          "antiDiscrimination": "Commission for Prevention and Protection against Discrimination",
          "ombudsmanPhone": "02 3129 335"
        },
        "greece": {
          "country": "Greece",
          "ombudsman": "Greek Ombudsman",
          "antiDiscrimination": "Greek Ombudsman (Equal Treatment)",
          "ombudsmanPhone": "213 130 6600"
        },
        "croatia": {
          "country": "Croatia",
          "ombudsman": "Ombudswoman",
          "antiDiscrimination": "Ombudswoman",
          "ombudsmanPhone": "01 4851 855"
        }
      }
    },
    "stories": {
      "meta": {
        "title": "Közösségi történetek – Redi Health",
        "description": "Valódi egészségügyi tapasztalatok a roma közösségekből Európa-szerte"
      },
      "title": "Közösségi történetek",
      "subtitle": "Valódi élmények roma közösségekből. Tanulj másoktól.",
      "backToStories": "Vissza a történetekhez",
      "lessonLearned": "A tanulság",
      "whatToDoNext": "Mi a teendő ezután",
      "categories": {
        "vaccines": "Védőoltások",
        "chronic": "Krónikus Betegség",
        "maternal": "Terhesség",
        "discrimination": "jogok",
        "prevention": "Megelőzés",
        "mental": "Mentális egészség"
      },
      "nextSteps": {
        "vaccineGuide": "Vakcina útmutató",
        "askZuvo": "Kérdezd meg Zuvo-t",
        "explainPrescription": "Magyarázza el a receptet",
        "navigateToCare": "Navigáljon a gondoskodáshoz",
        "knowYourRights": "Ismerje meg a jogait",
        "learnPrevention": "Ismerje meg a megelőzést",
        "checkSymptoms": "Ellenőrizze a tüneteket",
        "learnMentalHealth": "Ismerje meg a mentális egészséget"
      },
      "entries": {
        "maria-vaccines": {
          "name": "Maria",
          "age": "28",
          "country": "Románia",
          "title": "Szinte nem oltattam be a lányomat",
          "story": "Az anyósom azt mondta, hogy az oltások mérgek. A településen mindenki ugyanezt mondta. Amikor a lányom megszületett, féltem. De az egészségügyi közvetítő eljött az otthonunkba, és mindent elmagyarázott – hogyan működnek a védőoltások, mik a tényleges mellékhatások. Mutatta nekem a kanyarós gyerekek fényképeit. Jobban féltem a betegségtől, mint az oltástól. A lányom megkapta az összes oltását. Egészséges és erős.",
          "lesson": "Beszéljen egy egészségügyi közvetítővel vagy orvossal, mielőtt döntéseket hozna mások véleménye alapján. A vakcinák életeket mentenek."
        },
        "stefan-diabetes": {
          "name": "Stefan",
          "age": "52",
          "country": "Bulgária",
          "title": "Abbahagytam a cukorbetegség gyógyszereimet, és majdnem meghaltam",
          "story": "45 évesen 2-es típusú cukorbetegséget diagnosztizáltak nálam. A gyógyszertől megfájdult a gyomrom, ezért abbahagytam a szedését. A szomszédom azt mondta, hogy a fahéjas tea meggyógyít. 2 évig inkább fahéjas teát ittam. Aztán egy nap összeestem. A vércukorszintem 500 felett volt. Az orvosok azt mondták, hogy sérült a vesém. Most minden nap beveszem a gyógyszerem. Bárcsak soha nem álltam volna meg.",
          "lesson": "Soha ne hagyja abba a gyógyszer szedését anélkül, hogy beszélt volna orvosával. A természetes gyógymódok nem helyettesíthetik a cukorbetegség elleni gyógyszereket."
        },
        "elena-pregnancy": {
          "name": "Elena",
          "age": "22",
          "country": "Szerbia",
          "title": "Első terhességem – nem tudtam, hogy ingyen járhatok orvoshoz",
          "story": "Amikor 19 évesen teherbe estem, 6 hónapig nem jártam orvoshoz. Nem volt biztosításom, és azt hittem, túl sokba fog kerülni. Egy egészségügyi közvetítő elmondta, hogy Szerbiában minden terhes nő számára ingyenes a terhesgondozás. Segített regisztrálni. Az orvos megállapította, hogy vérszegénységem és magas vérnyomásom van. Ha nem mentem volna el, veszélyben lehetett volna a babám.",
          "lesson": "A terhesgondozás a legtöbb európai országban ingyenes. Kérjen egészségügyi közvetítőt, hogy segítsen a regisztrációban."
        },
        "janos-discrimination": {
          "name": "János",
          "age": "35",
          "country": "Magyarország",
          "title": "A kórház megpróbált elküldeni",
          "story": "Mellkasi fájdalommal mentem az ügyeletre. A nővér rám nézett, és azt mondta: \"Telek vagyunk, menjen egy másik kórházba.\" Tudtam, hogy ez nem helyes. Azt mondtam: „Fáj a mellkasom. Meg kell vizsgálnod. Kérem, adja meg a nevét. A hozzáállása azonnal megváltozott. Megvizsgáltak és megállapították, hogy szívproblémám van, ami kezelést igényel. Ha elmentem volna, szívrohamot kaphattam volna.",
          "lesson": "Joga van sürgősségi ellátáshoz. Ha valaki megpróbálja visszautasítani, kérdezze meg a nevét, és mondja el, hogy ismeri a jogait."
        },
        "ana-tb": {
          "name": "Ana",
          "age": "31",
          "country": "Szlovákia",
          "title": "A tuberkulózis nem halálos ítélet – de be kell fejeznie a gyógyszert",
          "story": "Hónapokig köhögtem. Azt hittem, csak megfázás. Amikor végre elmentem az orvoshoz, azt mondták, hogy tuberkulózisom van. Megrémültem – azt hittem, meghalok. De az orvos elmagyarázta, hogy a tbc 6 hónapos gyógyszerrel gyógyítható. A legnehezebb az volt, hogy 6 hónapon keresztül minden nap tablettát szedjek, még akkor is, ha 2 hónap után jobban éreztem magam. De befejeztem. meggyógyultam.",
          "lesson": "Ha 2 hétnél tovább köhög, forduljon orvoshoz. A tbc gyógyítható, de az összes gyógyszert be KELL végeznie."
        },
        "mirela-depression": {
          "name": "Mirela",
          "age": "40",
          "country": "Észak-Macedónia",
          "title": "A depresszió nem gyengeség, hanem betegség",
          "story": "Miután a férjem meghalt, hónapokig nem tudtam felkelni az ágyból. A családom azt mondta, lusta vagyok. Azt mondták, csak légy erős. De nem tudtam. Egy egészségügyi közvetítő észrevette, hogy valami nincs rendben, és orvoshoz vitt. Az orvos azt mondta, hogy depresszióm van – valódi egészségügyi állapot. Elkezdtem a gyógyszert, és beszéltem egy tanácsadóval. Lassan jobban lettem. nem vagyok gyenge. beteg voltam.",
          "lesson": "A depresszió egészségügyi állapot, nem jellemhiba. Az orvostudomány és a tanácsadás segíthet. Kérjen segítséget."
        }
      }
    },
    "challenges": {
      "meta": {
        "title": "Kihívások – Redi Health",
        "description": "Közösségi kihívások"
      },
      "title": "Aktív kihívások",
      "subtitle": "Csatlakozz a közösségi célokhoz és a személyes kihívásokhoz, és szerezz bónusz XP-t és jelvényeket.",
      "types": {
        "community": "közösség",
        "personal": "személyes"
      },
      "daysLeft": "{count} nap van hátra",
      "viewLeaderboard": "Ranglista megtekintése",
      "items": {
        "c1": {
          "title": "Vakcina tudás bajnoka",
          "description": "Kérjen meg 50 diákot a helyi körzetében, hogy adja át a vakcina modult ezen a héten."
        },
        "c2": {
          "title": "7 napos egészségügyi sorozat",
          "description": "Jegyezze fel hangulatát és vízfogyasztását 7 egymást követő napon."
        }
      }
    },
    "certificate": {
      "meta": {
        "title": "Tanúsítvány – Redi Health",
        "description": "Országos egészségügyi műveltségi bizonyítvány"
      },
      "title": "Az Ön bizonyítványa",
      "subtitle": "Elvégezted az Egészségügyi Diákakadémia Országos Színpadját.",
      "ofCompletion": "Teljesítési igazolás",
      "diplomaTitle": "Nemzeti Egészségügyi Műveltség",
      "awardedFor": "A Redi Egészségügyi Diákakadémia tananyagának elvégzéséért díjazták.",
      "date": "Dátum",
      "downloadPdf": "PDF letöltése",
      "share": "Részesedés",
      "gate": {
        "title": "Először fejezze be az Akadémiát",
        "description": "Az Egészségügyi Művelődési Tanúsítvány megszerzéséhez teljesítenie kell az összes leckét, és teljesítenie kell a kvízt az Egészségügyi Diákakadémia Országos szakaszában.",
        "cta": "Menj az Akadémiára"
      }
    }
  },
  "it": {
    "healthQuiz": {
      "meta": {
        "title": "Quiz sulla salute — Redi Salute",
        "description": "Metti alla prova le tue conoscenze sulla salute con quiz interattivi"
      },
      "title": "Quiz sulla salute",
      "subtitle": "Metti alla prova le tue conoscenze. Impara qualcosa di nuovo.",
      "backToQuizzes": "Torniamo ai quiz",
      "seeResults": "Vedi i risultati",
      "nextQuestion": "Prossima domanda",
      "questionsCount": "{count} domande",
      "results": {
        "perfect": "Punteggio perfetto!",
        "great": "Ottimo lavoro!",
        "good": "Buono sforzo!",
        "keepLearning": "Continua a imparare!",
        "score": "Hai ottenuto {score} su {total} corretto",
        "tryAgain": "Riprova",
        "moreQuizzes": "Altri quiz"
      },
      "quizzes": {
        "antibiotics": {
          "title": "Antibiotici",
          "description": "Sai quando usare gli antibiotici?",
          "questions": [
            {
              "question": "Gli antibiotici possono curare l’influenza?",
              "options": [
                "Sì",
                "No",
                "A volte"
              ],
              "explanation": "L'influenza è causata da un virus. Gli antibiotici uccidono solo i batteri. L’assunzione di antibiotici per l’influenza non fa nulla e può rendere più difficili da trattare future infezioni."
            },
            {
              "question": "Ti senti meglio dopo 3 giorni di antibiotici. Dovresti fermarti?",
              "options": [
                "Sì, sei guarito",
                "No, finisci il corso completo",
                "Prendi la metà delle pillole rimanenti"
              ],
              "explanation": "Termina SEMPRE l'intero corso. Se ti fermi presto, alcuni batteri sopravvivono e diventano resistenti. La prossima volta lo stesso antibiotico non funzionerà."
            },
            {
              "question": "Puoi condividere gli antibiotici con un membro della famiglia che presenta sintomi simili?",
              "options": [
                "Sì, fa risparmiare denaro",
                "No, mai",
                "Solo se si tratta della stessa malattia"
              ],
              "explanation": "Non condividere mai gli antibiotici. Infezioni diverse necessitano di farmaci diversi. L'antibiotico sbagliato può essere pericoloso e non aiuta."
            },
            {
              "question": "Cosa succede se prendi gli antibiotici troppo spesso?",
              "options": [
                "Niente di male",
                "Il tuo corpo diventa immune alle malattie",
                "I batteri diventano resistenti e più difficili da uccidere"
              ],
              "explanation": "La resistenza agli antibiotici è una crisi globale. Quando i batteri diventano resistenti, le infezioni semplici possono diventare mortali. Prendi gli antibiotici solo quando il medico li prescrive."
            }
          ]
        },
        "vaccines": {
          "title": "Vaccini",
          "description": "Separare i fatti dai miti",
          "questions": [
            {
              "question": "I vaccini causano l’autismo?",
              "options": [
                "Sì",
                "No",
                "Non lo sappiamo"
              ],
              "explanation": "NO. Questo mito è nato da uno studio fraudolento che è stato poi ritirato. Il medico che lo ha pubblicato ha perso la licenza medica. Decine di studi con milioni di bambini dimostrano che i vaccini NON causano l’autismo."
            },
            {
              "question": "È sicuro somministrare a un bambino più vaccini contemporaneamente?",
              "options": [
                "No, è troppo",
                "Sì, è sicuro e testato",
                "Solo uno alla volta"
              ],
              "explanation": "Il sistema immunitario dei bambini gestisce migliaia di germi ogni giorno. I vaccini combinati sono accuratamente testati e sicuri. Ritardare la vaccinazione lascia il tuo bambino non protetto."
            },
            {
              "question": "Mio figlio ha un lieve raffreddore. Possono ancora vaccinarsi?",
              "options": [
                "No, aspetta fino alla piena salute",
                "Sì, un lieve raffreddore va bene",
                "Solo con il permesso del medico"
              ],
              "explanation": "Un lieve raffreddore, febbre bassa o naso che cola NON è un motivo per ritardare la vaccinazione. Solo una malattia grave richiede un rinvio. Chiedi al tuo medico se non sei sicuro."
            },
            {
              "question": "I vaccini contengono sostanze chimiche pericolose?",
              "options": [
                "Sì, sono pieni di tossine",
                "No, tutti gli ingredienti sono sicuri nelle piccole quantità utilizzate",
                "Alcuni lo fanno, altri no"
              ],
              "explanation": "Gli ingredienti del vaccino sono presenti in quantità piccole e sicure. Si ottiene più alluminio dal latte materno che da un vaccino. Ogni ingrediente è stato testato per la sicurezza."
            }
          ]
        },
        "diabetes": {
          "title": "Diabete",
          "description": "Comprendere la gestione del diabete",
          "questions": [
            {
              "question": "Il diabete è causato dal consumo eccessivo di zucchero?",
              "options": [
                "Sì",
                "No, è più complesso",
                "Solo tipo 2"
              ],
              "explanation": "Il diabete è causato dalla genetica, dallo stile di vita e dal modo in cui il corpo elabora l’insulina. Il consumo di zucchero non ne è la causa diretta, ma una dieta malsana e l’obesità aumentano il rischio."
            },
            {
              "question": "Il diabete può essere curato con rimedi naturali come la cannella?",
              "options": [
                "Sì, la cannella lo cura",
                "No, non esiste una cura ma può essere gestita",
                "Sì, con abbastanza aglio ed erbe aromatiche"
              ],
              "explanation": "NON esiste una cura per il diabete. Può essere GESTITO con medicine, cibo sano ed esercizio fisico. La cannella può avere piccoli benefici ma NON PUÒ sostituire i farmaci. Le persone che interrompono la terapia finiscono in ospedale."
            },
            {
              "question": "Una persona diabetica si sente stordita e sudata. Cosa dovresti fare?",
              "options": [
                "Date loro l'insulina",
                "Date loro subito qualcosa di dolce",
                "Digli di riposare"
              ],
              "explanation": "Questi sono segni di BASSO zucchero nel sangue (ipoglicemia). Date loro immediatamente succo, caramelle o acqua zuccherata. Questo può essere pericoloso per la vita. Dopo che si saranno sentiti meglio, dovrebbero consumare un pasto adeguato."
            },
            {
              "question": "Con quale frequenza una persona diabetica dovrebbe controllare i propri piedi?",
              "options": [
                "Mai, i piedi stanno bene",
                "Ogni giorno",
                "Una volta all'anno"
              ],
              "explanation": "Il diabete può danneggiare i nervi dei piedi. Potresti non sentire tagli o ferite. Controlla i tuoi piedi OGNI GIORNO per tagli, vesciche o cambiamenti di colore. Piccole ferite possono diventare infezioni gravi."
            }
          ]
        },
        "hygiene": {
          "title": "Igiene e prevenzione",
          "description": "Abitudini sanitarie di base che salvano vite umane",
          "questions": [
            {
              "question": "Per quanto tempo dovresti lavarti le mani con il sapone?",
              "options": [
                "5 secondi",
                "Almeno 20 secondi",
                "1 minuto"
              ],
              "explanation": "Lavati per almeno 20 secondi, più o meno il tempo necessario per cantare \"Happy Birthday\" due volte. Questo rimuove la maggior parte dei germi. I risciacqui rapidi non funzionano."
            },
            {
              "question": "È sicuro bere l'acqua di un fiume o di un ruscello?",
              "options": [
                "Sì, l'acqua naturale è pulita",
                "No, fallo sempre bollire o filtralo prima",
                "Solo se sembra chiaro"
              ],
              "explanation": "Anche l’acqua limpida può contenere batteri e parassiti pericolosi. Far bollire sempre l'acqua per almeno 1 minuto o utilizzare un filtro. L’acqua sporca provoca diarrea, colera e tifo."
            },
            {
              "question": "Tuo figlio ha la diarrea. Qual è la cosa più importante?",
              "options": [
                "Interrompi tutto il cibo",
                "Dare molti liquidi (acqua, ORS)",
                "Somministra antibiotici"
              ],
              "explanation": "La disidratazione causata dalla diarrea uccide più bambini della diarrea stessa. Somministrare una soluzione reidratante orale (ORS) o acqua pulita con un pizzico di sale e zucchero. Continua ad allattare i bambini."
            },
            {
              "question": "Quando dovresti lavarti le mani?",
              "options": [
                "Solo prima di mangiare",
                "Prima di mangiare, dopo la toilette, dopo aver toccato animali, dopo aver tossito",
                "Solo quando sembrano sporchi"
              ],
              "explanation": "I germi sono invisibili. Lavarsi le mani: prima di mangiare/cucinare, dopo aver usato il bagno, dopo aver cambiato i pannolini, dopo aver toccato animali, dopo aver tossito/starnutito e dopo aver toccato persone malate."
            }
          ]
        }
      }
    },
    "rights": {
      "meta": {
        "title": "Conosci i tuoi diritti – Redi Health",
        "description": "Diritti dei pazienti, aiuto alla discriminazione e contatti legali per le comunità rom"
      },
      "title": "Conosci i tuoi diritti",
      "subtitle": "Hai dei diritti come paziente. Imparateli. Usali.",
      "back": "Indietro",
      "menu": {
        "patientRights": {
          "title": "Diritti dei pazienti",
          "desc": "8 diritti che ogni paziente ha"
        },
        "discrimination": {
          "title": "Di fronte alla discriminazione?",
          "desc": "Cosa dire e fare – passo dopo passo"
        },
        "contacts": {
          "title": "Assistenza legale per Paese",
          "desc": "Difensore civico, antidiscriminazione, organizzazioni rom"
        }
      },
      "views": {
        "patientRights": "I tuoi diritti del paziente",
        "discrimination": "Se devi affrontare una discriminazione",
        "discriminationDesc": "Situazioni reali ed esattamente cosa dire e fare.",
        "contacts": "Assistenza legale per Paese"
      },
      "labels": {
        "sayThis": "Di' questo:",
        "thenDo": "Quindi fai questo:",
        "patientOmbudsman": "Difensore civico dei pazienti",
        "antiDiscrimination": "Anti-Discrimination",
        "romaRightsOrg": "Roma Rights Organization"
      },
      "rights": {
        "treatment": {
          "title": "Diritto alle cure d'urgenza",
          "description": "Ogni ospedale DEVE curarti in caso di emergenza, anche senza assicurazione o documenti. Questa è la legge in ogni EU paese. Se rifiutano, chiedi il nome del medico e segnalalo."
        },
        "information": {
          "title": "Diritto di comprendere la tua diagnosi",
          "description": "Il tuo medico deve spiegare la tua condizione con parole che capisci. Se non capisci, di': 'Puoi spiegarlo più semplicemente?' Puoi anche chiedere un riassunto scritto."
        },
        "consent": {
          "title": "Diritto di dire di no",
          "description": "Nessuno può obbligarti a curarti. Prima di qualsiasi procedura, il medico deve spiegare cosa farà e tu devi essere d'accordo. Puoi sempre dire \"Ho bisogno di tempo per pensare\"."
        },
        "privacy": {
          "title": "Diritto alla privacy",
          "description": "Le tue informazioni mediche sono private. I medici non possono condividerli con il tuo datore di lavoro, la tua famiglia o chiunque altro senza il tuo permesso. Ciò include il tuo stato HIV, la gravidanza o la salute mentale."
        },
        "interpreter": {
          "title": "Diritto ad un interprete",
          "description": "Se non parli bene la lingua locale, puoi richiedere un interprete. Molti ospedali offrono questo servizio. In caso contrario, puoi portare qualcuno di cui ti fidi per tradurre."
        },
        "second-opinion": {
          "title": "Diritto ad una seconda opinione",
          "description": "Se non sei d'accordo con una diagnosi, puoi consultare un altro medico. Questo è un tuo diritto. Non è necessario spiegare il motivo."
        },
        "records": {
          "title": "Direttamente sulla tua cartella clinica",
          "description": "Puoi richiedere in qualsiasi momento copia di tutta la tua cartella clinica. L'ospedale deve fornirli. Questo è utile quando si cambia medico o ci si trasferisce in un'altra città."
        },
        "complaint": {
          "title": "Diritto di lamentarsi",
          "description": "Se ti senti maltrattato o discriminato puoi sporgere denuncia. Ogni ospedale ha una procedura di reclamo. Puoi anche contattare il difensore civico dei pazienti nel tuo paese."
        }
      },
      "scenarios": {
        "refused-treatment": {
          "situation": "L'ospedale si rifiuta di curarti",
          "whatToSay": "\"Ho diritto a cure di emergenza secondo la legge EU. Per favore, scrivi il tuo nome e il motivo per cui rifiuti.\"",
          "whatToDo": [
            "Rimani calmo ma fermo",
            "Chiedi il nome completo del medico",
            "Chiedere il rifiuto per iscritto",
            "Chiama il difensore civico dei pazienti",
            "Contatta un'organizzazione per i diritti dei rom"
          ]
        },
        "rude-staff": {
          "situation": "Il personale ospedaliero è scortese o sprezzante a causa della tua etnia",
          "whatToSay": "\"Sono qui per assistenza medica. Mi aspetto di essere trattato con lo stesso rispetto di ogni altro paziente.\"",
          "whatToDo": [
            "Chiedere di parlare con la caposala o il capo reparto",
            "Annotare la data, l'ora e i nomi",
            "Presentare un reclamo scritto all'ospedale",
            "Segnalazione all'organismo nazionale antidiscriminazione"
          ]
        },
        "no-insurance": {
          "situation": "Non hai l'assicurazione sanitaria",
          "whatToSay": "\"Ho bisogno di aiuto medico. Quali sono le mie opzioni per i pazienti non assicurati?\"",
          "whatToDo": [
            "Le cure di emergenza sono sempre gratuite: insisti su questo",
            "Chiedi informazioni sui programmi di assistenza sociale",
            "Rivolgiti ad un mediatore sanitario della tua zona",
            "Molte ONG forniscono cliniche gratuite: chiedi in ospedale"
          ]
        },
        "language-barrier": {
          "situation": "Non puoi comunicare con il dottore",
          "whatToSay": "\"Ho bisogno di aiuto per capire. Potete fornirmi un interprete o parlare più lentamente?\"",
          "whatToDo": [
            "Utilizza questa app per tradurre frasi chiave",
            "Porta una persona fidata che parli la lingua",
            "Richiedi istruzioni scritte che potrai tradurre in seguito",
            "Utilizza la fotocamera del tuo telefono per tradurre documenti"
          ]
        }
      },
      "contacts": {
        "romania": {
          "country": "Romania",
          "ombudsman": "Avocatul Poporului",
          "antiDiscrimination": "CNCD",
          "ombudsmanPhone": "021 312 7134",
          "antiDiscriminationPhone": "021 312 6578",
          "romaRightsOrg": "Romani CRISS"
        },
        "bulgaria": {
          "country": "Bulgaria",
          "ombudsman": "Ombudsman of Bulgaria",
          "antiDiscrimination": "Commission for Protection against Discrimination",
          "ombudsmanPhone": "02 810 6955",
          "romaRightsOrg": "Amalipe Center"
        },
        "hungary": {
          "country": "Hungary",
          "ombudsman": "Commissioner for Fundamental Rights",
          "antiDiscrimination": "Equal Treatment Authority",
          "ombudsmanPhone": "06 1 475 7100",
          "romaRightsOrg": "Romaversitas Foundation"
        },
        "slovakia": {
          "country": "Slovakia",
          "ombudsman": "Public Defender of Rights",
          "antiDiscrimination": "Slovak National Centre for Human Rights",
          "ombudsmanPhone": "02 4828 7401",
          "romaRightsOrg": "ETP Slovakia"
        },
        "czech-republic": {
          "country": "Czech Republic",
          "ombudsman": "Public Defender of Rights",
          "antiDiscrimination": "Office of the Public Defender",
          "ombudsmanPhone": "542 542 888",
          "romaRightsOrg": "Romea.cz"
        },
        "serbia": {
          "country": "Serbia",
          "ombudsman": "Protector of Citizens",
          "antiDiscrimination": "Commissioner for Equality",
          "ombudsmanPhone": "011 206 8100",
          "romaRightsOrg": "Praxis"
        },
        "albania": {
          "country": "Albania",
          "ombudsman": "People's Advocate",
          "antiDiscrimination": "Commissioner for Protection from Discrimination",
          "ombudsmanPhone": "042 380 300"
        },
        "north-macedonia": {
          "country": "North Macedonia",
          "ombudsman": "Ombudsman",
          "antiDiscrimination": "Commission for Prevention and Protection against Discrimination",
          "ombudsmanPhone": "02 3129 335"
        },
        "greece": {
          "country": "Greece",
          "ombudsman": "Greek Ombudsman",
          "antiDiscrimination": "Greek Ombudsman (Equal Treatment)",
          "ombudsmanPhone": "213 130 6600"
        },
        "croatia": {
          "country": "Croatia",
          "ombudsman": "Ombudswoman",
          "antiDiscrimination": "Ombudswoman",
          "ombudsmanPhone": "01 4851 855"
        }
      }
    },
    "stories": {
      "meta": {
        "title": "Storie della comunità — Redi Salute",
        "description": "Esperienze di salute reali dalle comunità rom in tutta Europa"
      },
      "title": "Storie di comunità",
      "subtitle": "Esperienze reali dalle comunità rom. Impara dagli altri.",
      "backToStories": "Torniamo alle storie",
      "lessonLearned": "Lezione appresa",
      "whatToDoNext": "Cosa fare dopo",
      "categories": {
        "vaccines": "Vaccini",
        "chronic": "Malattia cronica",
        "maternal": "Gravidanza",
        "discrimination": "Diritti",
        "prevention": "Prevenzione",
        "mental": "Salute mentale"
      },
      "nextSteps": {
        "vaccineGuide": "Guida ai vaccini",
        "askZuvo": "Chiedi a Zuvo",
        "explainPrescription": "Spiegare la prescrizione",
        "navigateToCare": "Naviga verso la cura",
        "knowYourRights": "Conosci i tuoi diritti",
        "learnPrevention": "Impara la prevenzione",
        "checkSymptoms": "Controlla i sintomi",
        "learnMentalHealth": "Ulteriori informazioni sulla salute mentale"
      },
      "entries": {
        "maria-vaccines": {
          "name": "Maria",
          "age": "28",
          "country": "Romania",
          "title": "Quasi non ho vaccinato mia figlia",
          "story": "Mia suocera mi ha detto che i vaccini sono velenosi. Tutti nell'insediamento hanno detto la stessa cosa. Quando è nata mia figlia, ho avuto paura. Ma il mediatore sanitario è venuto a casa nostra e ci ha spiegato tutto: come funzionano i vaccini, quali sono realmente gli effetti collaterali. Mi ha mostrato foto di bambini con il morbillo. Avevo più paura della malattia che del vaccino. Mia figlia ha fatto tutti i vaccini. È sana e forte.",
          "lesson": "Parla con un mediatore sanitario o un medico prima di prendere decisioni basate su ciò che dicono gli altri. I vaccini salvano vite."
        },
        "stefan-diabetes": {
          "name": "Stefan",
          "age": "52",
          "country": "Bulgaria",
          "title": "Ho interrotto la terapia per il diabete e sono quasi morto",
          "story": "Mi è stato diagnosticato il diabete di tipo 2 alle 45. La medicina mi ha fatto male allo stomaco, quindi ho smesso di prenderla. Il mio vicino ha detto che il tè alla cannella mi avrebbe guarito. Per 2 anni ho invece bevuto il tè alla cannella. Poi un giorno sono crollato. Il mio livello di zucchero nel sangue era superiore a 500. I medici hanno detto che i miei reni erano danneggiati. Adesso prendo la mia medicina ogni giorno. Vorrei non aver mai smesso.",
          "lesson": "Non interrompere mai l'assunzione del medicinale senza parlare con il medico. I rimedi naturali non possono sostituire i farmaci per il diabete."
        },
        "elena-pregnancy": {
          "name": "Elena",
          "age": "22",
          "country": "Serbia",
          "title": "La mia prima gravidanza: non sapevo di poter vedere un medico gratuitamente",
          "story": "Quando sono rimasta incinta a 19, non sono andata dal medico per 6 mesi. Non avevo l'assicurazione e pensavo che sarebbe costata troppo. Un mediatore sanitario mi ha detto che le cure prenatali sono gratuite per tutte le donne incinte in Serbia. Mi ha aiutato a registrarmi. Il medico ha scoperto che avevo anemia e pressione alta. Se non fossi andata, il mio bambino avrebbe potuto essere in pericolo.",
          "lesson": "L’assistenza prenatale è gratuita nella maggior parte dei paesi europei. Chiedi a un mediatore sanitario di aiutarti a registrarti."
        },
        "janos-discrimination": {
          "name": "János",
          "age": "35",
          "country": "Ungheria",
          "title": "L'ospedale ha provato a mandarmi via",
          "story": "Sono andato al pronto soccorso con dolore al petto. L'infermiera mi guardò e disse: \"Siamo pieni, vai in un altro ospedale\". Sapevo che non era giusto. Ho detto: 'Ho dolore al petto. Devi esaminarmi. Per favore, dammi il tuo nome.\" Il suo atteggiamento cambiò immediatamente. Mi hanno esaminato e hanno scoperto che avevo un problema cardiaco che necessitava di cure. Se fossi andato via, avrei potuto avere un infarto.",
          "lesson": "Hai diritto a cure d'emergenza. Se qualcuno cerca di allontanarti, chiedi il suo nome e digli che conosci i tuoi diritti."
        },
        "ana-tb": {
          "name": "Ana",
          "age": "31",
          "country": "Slovacchia",
          "title": "TB non è una condanna a morte, ma devi finire la medicina",
          "story": "Ho tossito per mesi. Pensavo fosse solo un raffreddore. Quando finalmente andai dal dottore, mi dissero che avevo la tubercolosi. Ero terrorizzato: pensavo di morire. Ma il medico ha spiegato che TB può essere curato con 6 mesi di medicine. La parte più difficile è stata prendere le pillole ogni giorno per 6 mesi, anche quando mi sentivo meglio dopo 2 mesi. Ma ho finito. Sono guarito.",
          "lesson": "Se tossisci per più di 2 settimane, consulta un medico. TB è curabile, ma DEVI finire tutte le medicine."
        },
        "mirela-depression": {
          "name": "Mirela",
          "age": "40",
          "country": "Macedonia del Nord",
          "title": "La depressione non è debolezza: è una malattia",
          "story": "Dopo la morte di mio marito, non sono riuscita ad alzarmi dal letto per mesi. La mia famiglia diceva che ero pigro. Hanno detto 'sii forte'. Ma non potevo. Un mediatore sanitario ha notato che qualcosa non andava e mi ha portato da un medico. Il medico ha detto che soffrivo di depressione, una vera condizione medica. Ho iniziato la medicina e ho parlato con un consulente. Lentamente, sono migliorato. Non sono debole. Ero malato.",
          "lesson": "La depressione è una condizione medica, non un difetto caratteriale. La medicina e la consulenza possono aiutare. Per favore chiedi aiuto."
        }
      }
    },
    "challenges": {
      "meta": {
        "title": "Sfide — Redi Salute",
        "description": "Sfide comunitarie"
      },
      "title": "Sfide attive",
      "subtitle": "Partecipa agli obiettivi della community e alle sfide personali per guadagnare XP e badge bonus.",
      "types": {
        "community": "comunità",
        "personal": "personale"
      },
      "daysLeft": "{count} giorni rimasti",
      "viewLeaderboard": "Visualizza la classifica",
      "items": {
        "c1": {
          "title": "Campione della conoscenza dei vaccini",
          "description": "Chiedi agli studenti 50 della tua zona di superare il modulo sui vaccini questa settimana."
        },
        "c2": {
          "title": "Serie di salute di 7 giorni",
          "description": "Registra il tuo umore e l'assunzione di acqua per 7 giorni consecutivi."
        }
      }
    },
    "certificate": {
      "meta": {
        "title": "Certificato — Redi Sanità",
        "description": "Certificato nazionale di alfabetizzazione sanitaria"
      },
      "title": "Il tuo certificato",
      "subtitle": "Hai completato la fase nazionale della Student Health Academy.",
      "ofCompletion": "Certificato di completamento",
      "diplomaTitle": "Alfabetizzazione sanitaria nazionale",
      "awardedFor": "Premiato per aver completato il curriculum della Redi Health Student Academy.",
      "date": "Data",
      "downloadPdf": "Scarica PDF",
      "share": "Condividi",
      "gate": {
        "title": "Completa prima l'Accademia",
        "description": "Per ottenere il certificato di Health Literacy, devi completare tutte le lezioni e superare il quiz nella fase nazionale della Student Health Academy.",
        "cta": "Vai all'Accademia"
      }
    }
  },
  "mk": {
    "healthQuiz": {
      "meta": {
        "title": "Квиз за здравје — Реди здравје",
        "description": "Тестирајте го вашето знаење за здравјето со интерактивни квизови"
      },
      "title": "Квиз за здравје",
      "subtitle": "Тестирајте го вашето знаење. Научете нешто ново.",
      "backToQuizzes": "Назад на квизови",
      "seeResults": "Видете ги резултатите",
      "nextQuestion": "Следно прашање",
      "questionsCount": "{count} прашања",
      "results": {
        "perfect": "Совршен резултат!",
        "great": "Одлична работа!",
        "good": "Добар напор!",
        "keepLearning": "Продолжете да учите!",
        "score": "Имате {score} од {total} точни",
        "tryAgain": "Обидете се повторно",
        "moreQuizzes": "Повеќе квизови"
      },
      "quizzes": {
        "antibiotics": {
          "title": "Антибиотици",
          "description": "Дали знаете кога да користите антибиотици?",
          "questions": [
            {
              "question": "Дали антибиотиците можат да го излечат грипот?",
              "options": [
                "Да",
                "Бр",
                "Понекогаш"
              ],
              "explanation": "Грипот е предизвикан од вирус. Антибиотиците убиваат само бактерии. Земањето антибиотици за грип не прави ништо и може да ги отежне идните инфекции за лекување."
            },
            {
              "question": "Се чувствувате подобро по 3 дена антибиотици. Дали треба да престанете?",
              "options": [
                "Да, излечен си",
                "Не, завршете го целосниот курс",
                "Земете половина од преостанатите апчиња"
              ],
              "explanation": "СЕКОГАШ завршете го целосниот курс. Ако престанете рано, некои бактерии преживуваат и стануваат отпорни. Следниот пат, истиот антибиотик нема да делува."
            },
            {
              "question": "Можете ли да споделите антибиотици со член на семејството кој има слични симптоми?",
              "options": [
                "Да, тоа заштедува пари",
                "Не, никогаш",
                "Само ако се работи за истата болест"
              ],
              "explanation": "Никогаш не споделувајте антибиотици. За различни инфекции се потребни различни лекови. Погрешниот антибиотик може да биде опасен и нема да помогне."
            },
            {
              "question": "Што се случува ако премногу често земате антибиотици?",
              "options": [
                "Ништо лошо",
                "Вашето тело станува имуно на болести",
                "Бактериите стануваат отпорни и потешко се убиваат"
              ],
              "explanation": "Отпорноста на антибиотици е глобална криза. Кога бактериите стануваат отпорни, едноставните инфекции можат да станат смртоносни. Пијте антибиотици само кога ќе ви препише лекар."
            }
          ]
        },
        "vaccines": {
          "title": "Вакцини",
          "description": "Одделете ги фактите од митовите",
          "questions": [
            {
              "question": "Дали вакцините предизвикуваат аутизам?",
              "options": [
                "Да",
                "Бр",
                "Не знаеме"
              ],
              "explanation": "БР. Овој мит започна од една лажна студија која беше повлечена. Лекарот кој го објавил ја изгубил лекарската лиценца. Десетици студии со милиони деца докажаа дека вакцините НЕ предизвикуваат аутизам."
            },
            {
              "question": "Дали е безбедно да се даде на бебето повеќе вакцини одеднаш?",
              "options": [
                "Не, премногу е",
                "Да, тоа е безбедно и тестирано",
                "Само еден по еден"
              ],
              "explanation": "Имунолошкиот систем на бебињата се справува со илјадници бактерии секој ден. Комбинираните вакцини се темелно тестирани и безбедни. Одложувањето на вакцините го остава вашето дете незаштитено."
            },
            {
              "question": "Моето дете има блага настинка. Дали сè уште можат да се вакцинираат?",
              "options": [
                "Не, почекајте да биде целосно здрав",
                "Да, блага настинка е во ред",
                "Само со дозвола на лекар"
              ],
              "explanation": "Блага настинка, ниска температура или течење на носот НЕ се причина за одложување на вакцинацијата. Само тешката болест бара одложување. Прашајте го вашиот лекар ако не сте сигурни."
            },
            {
              "question": "Дали вакцините содржат опасни хемикалии?",
              "options": [
                "Да, тие се полни со токсини",
                "Не, сите состојки се безбедни во мали количини што се користат",
                "Некои прават, некои не"
              ],
              "explanation": "Состојките на вакцината се присутни во мали, безбедни количини. Повеќе алуминиум добивате од мајчиното млеко отколку од вакцината. Секоја состојка е тестирана за безбедност."
            }
          ]
        },
        "diabetes": {
          "title": "Дијабетес",
          "description": "Разбирање на управувањето со дијабетес",
          "questions": [
            {
              "question": "Дали дијабетесот е предизвикан од консумирање премногу шеќер?",
              "options": [
                "Да",
                "Не, покомплексно е",
                "Само тип 2"
              ],
              "explanation": "Дијабетесот е предизвикан од генетиката, начинот на живот и начинот на кој вашето тело го обработува инсулинот. Јадењето шеќер не го предизвикува директно, но нездравата исхрана и дебелината го зголемуваат ризикот."
            },
            {
              "question": "Може ли дијабетесот да се излечи со природни лекови како цимет?",
              "options": [
                "Да, циметот го лечи",
                "Не, нема лек, но може да се управува",
                "Да, со доволно лук и билки"
              ],
              "explanation": "НЕМА лек за дијабетес. Може да се менаџира со лекови, здрава храна и вежбање. Циметот може да има мали придобивки, но НЕ МОЖЕ да го замени лекот. Луѓето кои го прекинуваат лекот завршуваат во болница."
            },
            {
              "question": "Дијабетичарот чувствува вртоглавица и пот. Што треба да направите?",
              "options": [
                "Дајте им инсулин",
                "Веднаш дајте им нешто слатко",
                "Кажете им да се одморат"
              ],
              "explanation": "Ова се знаци на ниско ниво на шеќер во крвта (хипогликемија). Веднаш дајте им сок, бонбони или шеќерна вода. Ова може да биде опасно по живот. Откако ќе се чувствуваат подобро, треба да јадат соодветен оброк."
            },
            {
              "question": "Колку често дијабетичарот треба да ги проверува стапалата?",
              "options": [
                "Никогаш, стапалата се во ред",
                "Секој ден",
                "Еднаш годишно"
              ],
              "explanation": "Дијабетесот може да ги оштети нервите на вашите стапала. Можеби нема да почувствувате исеченици или рани. Проверувајте ги стапалата СЕКОЈ ДЕН за исекотини, плускавци или промени во бојата. Малите рани можат да станат сериозни инфекции."
            }
          ]
        },
        "hygiene": {
          "title": "Хигиена и превенција",
          "description": "Основни здравствени навики кои спасуваат животи",
          "questions": [
            {
              "question": "Колку долго треба да ги миете рацете со сапун?",
              "options": [
                "5 секунди",
                "Најмалку 20 секунди",
                "1 минута"
              ],
              "explanation": "Измијте најмалку 20 секунди - околу времето потребно за двапати да се пее „Happy Birthday“. Ова ги отстранува повеќето бактерии. Брзите плакнења не функционираат."
            },
            {
              "question": "Дали е безбедно да се пие вода од река или поток?",
              "options": [
                "Да, природната вода е чиста",
                "Не, секогаш прво варете го или филтрирајте го",
                "Само ако изгледа јасно"
              ],
              "explanation": "Дури и чистата вода може да содржи опасни бактерии и паразити. Секогаш вриејте ја водата најмалку 1 минута или користете филтер. Нечистата вода предизвикува дијареа, колера и тифус."
            },
            {
              "question": "Вашето дете има дијареа. Што е најважно?",
              "options": [
                "Престанете со сета храна",
                "Дајте многу течности (вода, ORS)",
                "Дајте антибиотици"
              ],
              "explanation": "Дехидрацијата од дијареа убива повеќе деца отколку самата дијареа. Дајте орален раствор за рехидратација (ORS) или чиста вода со малку сол и шеќер. Продолжете да ги доите бебињата."
            },
            {
              "question": "Кога треба да ги миете рацете?",
              "options": [
                "Само пред јадење",
                "Пред јадење, после тоалет, по допирање животни, после кашлање",
                "Само кога изгледаат валкано"
              ],
              "explanation": "Микробите се невидливи. Измијте ги рацете: пред јадење/готвење, по користење на тоалет, по менување пелени, по допирање животни, по кашлање/кивање и по допирање на болни луѓе."
            }
          ]
        }
      }
    },
    "rights": {
      "meta": {
        "title": "Знајте ги вашите права - Реди здравје",
        "description": "Права на пациенти, помош при дискриминација и правни контакти за ромските заедници"
      },
      "title": "Знајте ги вашите права",
      "subtitle": "Имате права како пациент. Научете ги. Користете ги.",
      "back": "Назад",
      "menu": {
        "patientRights": {
          "title": "Права на пациентот",
          "desc": "8 права има секој пациент"
        },
        "discrimination": {
          "title": "Се соочувате со дискриминација?",
          "desc": "Што да се каже и направи - чекор по чекор"
        },
        "contacts": {
          "title": "Правна помош по земја",
          "desc": "Народен правобранител, антидискриминација, ромски органи"
        }
      },
      "views": {
        "patientRights": "Вашите права на пациентот",
        "discrimination": "Ако се соочите со дискриминација",
        "discriminationDesc": "Реални ситуации и што точно да се каже и направи.",
        "contacts": "Правна помош по земја"
      },
      "labels": {
        "sayThis": "Кажи го ова:",
        "thenDo": "Потоа направете го ова:",
        "patientOmbudsman": "Народен правобранител за пациенти",
        "antiDiscrimination": "Anti-Discrimination",
        "romaRightsOrg": "Roma Rights Organization"
      },
      "rights": {
        "treatment": {
          "title": "Право на итен третман",
          "description": "Секоја болница МОРА да ве лекува во итен случај, дури и без осигурување или документи. Ова е закон во секоја EU земја. Ако одбијат, прашајте го името на докторот и пријавете го."
        },
        "information": {
          "title": "Право да се разбере вашата дијагноза",
          "description": "Вашиот лекар мора да ја објасни вашата состојба со зборови што ги разбирате. Ако не разбирате, кажете: 'Можете ли да го објасните ова поедноставно?' Можете исто така да побарате писмено резиме."
        },
        "consent": {
          "title": "Право да се каже не",
          "description": "Никој не може да ви присили третман. Пред каква било процедура, лекарот мора да објасни што ќе направат и мора да се согласите. Секогаш можете да кажете „Ми треба време за размислување“."
        },
        "privacy": {
          "title": "Право на приватност",
          "description": "Вашите медицински информации се приватни. Лекарите не можат да го споделат со вашиот работодавец, семејството или некој друг без ваша дозвола. Ова го вклучува вашиот статус HIV, бременост или ментално здравје."
        },
        "interpreter": {
          "title": "Право на преведувач",
          "description": "Ако не го зборувате добро локалниот јазик, можете да побарате преведувач. Многу болници ја имаат оваа услуга. Ако не, можете да доведете некој кому му верувате да преведува."
        },
        "second-opinion": {
          "title": "Право на второ мислење",
          "description": "Ако не се согласувате со дијагнозата, можете да посетите друг лекар. Ова е твое право. Не треба да објаснувате зошто."
        },
        "records": {
          "title": "Право на вашата медицинска евиденција",
          "description": "Можете да побарате копија од сите ваши медицински досиеја во секое време. Болницата мора да ги обезбеди. Ова е корисно кога менувате лекари или се преселувате во друг град."
        },
        "complaint": {
          "title": "Право да се жалите",
          "description": "Ако се чувствувате малтретирано или дискриминирани, можете да поднесете жалба. Секоја болница има постапка за жалби. Можете исто така да контактирате со омбудсманот за пациенти во вашата земја."
        }
      },
      "scenarios": {
        "refused-treatment": {
          "situation": "Болницата одбива да ве лекува",
          "whatToSay": "„Имам право на итен третман според законот EU. Ве молиме запишете го вашето име и причината што ја одбивате.",
          "whatToDo": [
            "Останете смирени, но цврсти",
            "Прашајте го целото име на докторот",
            "Побарајте го одбивањето писмено",
            "Повикајте го народниот правобранител на пациентите",
            "Контактирајте со организација за правата на Ромите"
          ]
        },
        "rude-staff": {
          "situation": "Персоналот во болницата е груб или отфрлен поради вашата етничка припадност",
          "whatToSay": "„Тука сум за медицинска помош. Очекувам да ме третираат со иста почит како и секој друг пациент.",
          "whatToDo": [
            "Побарајте да разговарате со главната медицинска сестра или шефот на одделот",
            "Забележете го датумот, времето и имињата",
            "Поднесете писмена жалба во болница",
            "Пријавете се до националното тело за антидискриминација"
          ]
        },
        "no-insurance": {
          "situation": "Немате здравствено осигурување",
          "whatToSay": "„Ми треба медицинска помош. Кои се моите опции за неосигурани пациенти?",
          "whatToDo": [
            "Итната помош е секогаш бесплатна - инсистирајте на тоа",
            "Прашајте за програмите за социјална помош",
            "Контактирајте со здравствен посредник во вашата област",
            "Многу невладини организации обезбедуваат бесплатни клиники - прашајте во болницата"
          ]
        },
        "language-barrier": {
          "situation": "Не можете да комуницирате со докторот",
          "whatToSay": "„Ми треба помош за разбирање. Дали можеш да обезбедиш преведувач или да зборуваш побавно?",
          "whatToDo": [
            "Користете ја оваа апликација за да преведувате клучни фрази",
            "Донесете доверлива личност која го зборува јазикот",
            "Побарајте писмени упатства што можете да ги преведете подоцна",
            "Користете ја камерата на вашиот телефон за да преведувате документи"
          ]
        }
      },
      "contacts": {
        "romania": {
          "country": "Romania",
          "ombudsman": "Avocatul Poporului",
          "antiDiscrimination": "CNCD",
          "ombudsmanPhone": "021 312 7134",
          "antiDiscriminationPhone": "021 312 6578",
          "romaRightsOrg": "Romani CRISS"
        },
        "bulgaria": {
          "country": "Bulgaria",
          "ombudsman": "Ombudsman of Bulgaria",
          "antiDiscrimination": "Commission for Protection against Discrimination",
          "ombudsmanPhone": "02 810 6955",
          "romaRightsOrg": "Amalipe Center"
        },
        "hungary": {
          "country": "Hungary",
          "ombudsman": "Commissioner for Fundamental Rights",
          "antiDiscrimination": "Equal Treatment Authority",
          "ombudsmanPhone": "06 1 475 7100",
          "romaRightsOrg": "Romaversitas Foundation"
        },
        "slovakia": {
          "country": "Slovakia",
          "ombudsman": "Public Defender of Rights",
          "antiDiscrimination": "Slovak National Centre for Human Rights",
          "ombudsmanPhone": "02 4828 7401",
          "romaRightsOrg": "ETP Slovakia"
        },
        "czech-republic": {
          "country": "Czech Republic",
          "ombudsman": "Public Defender of Rights",
          "antiDiscrimination": "Office of the Public Defender",
          "ombudsmanPhone": "542 542 888",
          "romaRightsOrg": "Romea.cz"
        },
        "serbia": {
          "country": "Serbia",
          "ombudsman": "Protector of Citizens",
          "antiDiscrimination": "Commissioner for Equality",
          "ombudsmanPhone": "011 206 8100",
          "romaRightsOrg": "Praxis"
        },
        "albania": {
          "country": "Albania",
          "ombudsman": "People's Advocate",
          "antiDiscrimination": "Commissioner for Protection from Discrimination",
          "ombudsmanPhone": "042 380 300"
        },
        "north-macedonia": {
          "country": "North Macedonia",
          "ombudsman": "Ombudsman",
          "antiDiscrimination": "Commission for Prevention and Protection against Discrimination",
          "ombudsmanPhone": "02 3129 335"
        },
        "greece": {
          "country": "Greece",
          "ombudsman": "Greek Ombudsman",
          "antiDiscrimination": "Greek Ombudsman (Equal Treatment)",
          "ombudsmanPhone": "213 130 6600"
        },
        "croatia": {
          "country": "Croatia",
          "ombudsman": "Ombudswoman",
          "antiDiscrimination": "Ombudswoman",
          "ombudsmanPhone": "01 4851 855"
        }
      }
    },
    "stories": {
      "meta": {
        "title": "Приказни за заедницата - Реди здравје",
        "description": "Вистински здравствени искуства од ромските заедници низ Европа"
      },
      "title": "Приказни за заедницата",
      "subtitle": "Вистински искуства од ромските заедници. Учете од другите.",
      "backToStories": "Назад на приказните",
      "lessonLearned": "Научена лекција",
      "whatToDoNext": "Што да се прави следно",
      "categories": {
        "vaccines": "Вакцини",
        "chronic": "Хронична болест",
        "maternal": "Бременост",
        "discrimination": "Права",
        "prevention": "Превенција",
        "mental": "Ментално здравје"
      },
      "nextSteps": {
        "vaccineGuide": "Водич за вакцини",
        "askZuvo": "Прашај го Зуво",
        "explainPrescription": "Објаснете го рецептот",
        "navigateToCare": "Одете до грижата",
        "knowYourRights": "Знајте ги вашите права",
        "learnPrevention": "Научете превенција",
        "checkSymptoms": "Проверете ги симптомите",
        "learnMentalHealth": "Дознајте за менталното здравје"
      },
      "entries": {
        "maria-vaccines": {
          "name": "Maria",
          "age": "28",
          "country": "Романија",
          "title": "Речиси не ја вакцинирав ќерка ми",
          "story": "Свекрва ми ми рече дека вакцините се отров. Сите во населбата го кажаа истото. Кога се роди ќерка ми, бев исплашен. Но, здравствениот посредник дојде во нашиот дом и објасни сè - како функционираат вакцините, кои се навистина несаканите ефекти. Таа ми покажа фотографии од деца со сипаници. Повеќе се плашев од болеста отколку од вакцината. Ќерка ми ги прими сите вакцини. Таа е здрава и силна.",
          "lesson": "Разговарајте со здравствен посредник или лекар пред да донесете одлуки врз основа на она што го велат другите. Вакцините спасуваат животи."
        },
        "stefan-diabetes": {
          "name": "Stefan",
          "age": "52",
          "country": "Бугарија",
          "title": "Го прекинав лекот за дијабетес и за малку ќе умрев",
          "story": "Ми беше дијагностициран дијабетес тип 2 на 45. Лекот ме боли стомакот, па престанав да го земам. Мојот сосед рече дека чајот од цимет ќе ме излечи. 2 години наместо тоа пиев чај од цимет. Потоа еден ден колабирав. Шеќерот во крвта ми беше над 500. Лекарите рекоа дека моите бубрези се оштетени. Сега го пијам мојот лек секој ден. Посакувам никогаш да не застанав.",
          "lesson": "Никогаш не го прекинувајте лекот без да разговарате со вашиот лекар. Природните лекови не можат да ги заменат лековите за дијабетес."
        },
        "elena-pregnancy": {
          "name": "Elena",
          "age": "22",
          "country": "Србија",
          "title": "Мојата прва бременост - не знаев дека можам да одам на лекар бесплатно",
          "story": "Кога забременив на 19, не отидов на лекар 6 месеци. Немав осигурување и мислев дека ќе чини премногу. Здравствен медијатор ми кажа дека пренаталната нега е бесплатна за сите трудници во Србија. Таа ми помогна да се регистрирам. Докторот откри дека имам анемија и висок крвен притисок. Да не одев, моето бебе можеше да биде во опасност.",
          "lesson": "Пренаталната нега е бесплатна во повеќето европски земји. Побарајте здравствен посредник да ви помогне да се регистрирате."
        },
        "janos-discrimination": {
          "name": "János",
          "age": "35",
          "country": "Унгарија",
          "title": "Болницата се обиде да ме испрати",
          "story": "Отидов во собата за итни случаи со болки во градите. Медицинската сестра ме погледна и ми рече: „Сити сме, оди во друга болница“. Знаев дека ова не е правилно. Реков: „Имам болка во градите. Мора да ме испитате. Те молам дај ми го твоето име.' Нејзиниот став веднаш се промени. Ме прегледаа и открија дека имам срцев проблем за кој треба да се лекувам. Да си заминав, можев да доживеам срцев удар.",
          "lesson": "Имате право на итен третман. Ако некој се обиде да ве одврати, прашајте го неговото име и кажете дека ги знаете вашите права."
        },
        "ana-tb": {
          "name": "Ana",
          "age": "31",
          "country": "Словачка",
          "title": "TB не е смртна казна - но мора да го завршите лекот",
          "story": "Кашлав со месеци. Мислев дека е само настинка. Кога конечно отидов на лекар, ми рекоа дека имам туберкулоза. Бев преплашен - мислев дека ќе умрам. Но, докторот објасни дека TB може да се излечи со 6 месеци лек. Најтешкиот дел беше земање апчиња секој ден 6 месеци, дури и кога се чувствував подобро после 2 месеци. Но јас завршив. излечен сум.",
          "lesson": "Ако кашлате повеќе од 2 недели, посетете лекар. TB се лекува, но МОРА да го завршите целиот лек."
        },
        "mirela-depression": {
          "name": "Mirela",
          "age": "40",
          "country": "Северна Македонија",
          "title": "Депресијата не е слабост - тоа е болест",
          "story": "Откако почина мојот сопруг, со месеци не можев да станам од кревет. Моето семејство рече дека сум мрзелив. Тие рекоа „само биди силен“. Но, не можев. Еден здравствен посредник забележа дека нешто не е во ред и ме одведе на лекар. Докторот рече дека имам депресија - вистинска медицинска состојба. Почнав да се лекувам и да разговарам со советник. Полека се подобрив. Јас не сум слаб. Бев болен.",
          "lesson": "Депресијата е медицинска состојба, а не карактерна мана. Лекот и советувањето можат да помогнат. Ве молиме побарајте помош."
        }
      }
    },
    "challenges": {
      "meta": {
        "title": "Предизвици - Реди здравје",
        "description": "Предизвици на заедницата"
      },
      "title": "Активни предизвици",
      "subtitle": "Придружете се на целите на заедницата и личните предизвици за да заработите бонус XP и значки.",
      "types": {
        "community": "заедница",
        "personal": "лични"
      },
      "daysLeft": "Преостануваат {count} дена",
      "viewLeaderboard": "Прикажи табла на водачи",
      "items": {
        "c1": {
          "title": "Шампион на знаење за вакцини",
          "description": "Добијте 50 студенти во вашата локална област да го поминат модулот за вакцина оваа недела."
        },
        "c2": {
          "title": "7-дневна здравствена низа",
          "description": "Пријавете го вашето расположение и внесот на вода 7 дена по ред."
        }
      }
    },
    "certificate": {
      "meta": {
        "title": "Сертификат — Реди здравје",
        "description": "Национален сертификат за здравствена писменост"
      },
      "title": "Вашиот сертификат",
      "subtitle": "Ја завршивте Националната сцена на Студентската здравствена академија.",
      "ofCompletion": "Сертификат за завршување",
      "diplomaTitle": "Национална здравствена писменост",
      "awardedFor": "Доделено за пополнување на наставната програма за студентска академија за здравство Реди.",
      "date": "Датум",
      "downloadPdf": "Преземете PDF",
      "share": "Споделете",
      "gate": {
        "title": "Прво завршете ја Академијата",
        "description": "За да го заработите вашиот сертификат за здравствена писменост, треба да ги завршите сите лекции и да го поминете квизот во Националната фаза на Студентската здравствена академија.",
        "cta": "Одете на Академијата"
      }
    }
  },
  "ro": {
    "healthQuiz": {
      "meta": {
        "title": "Test de sănătate — Redi Health",
        "description": "Testează-ți cunoștințele de sănătate cu chestionare interactive"
      },
      "title": "Test de sănătate",
      "subtitle": "Testează-ți cunoștințele. Învață ceva nou.",
      "backToQuizzes": "Înapoi la chestionare",
      "seeResults": "Vezi rezultatele",
      "nextQuestion": "Următoarea întrebare",
      "questionsCount": "{count} întrebări",
      "results": {
        "perfect": "Scor perfect!",
        "great": "Mare treaba!",
        "good": "Efort bun!",
        "keepLearning": "Continuați să învățați!",
        "score": "Ai luat {score} din {total} corect",
        "tryAgain": "Încercați din nou",
        "moreQuizzes": "Mai multe chestionare"
      },
      "quizzes": {
        "antibiotics": {
          "title": "Antibiotice",
          "description": "Știi când să folosești antibiotice?",
          "questions": [
            {
              "question": "Pot antibioticele să vindece gripa?",
              "options": [
                "Da",
                "Nu",
                "Uneori"
              ],
              "explanation": "Gripa este cauzată de un virus. Antibioticele ucid doar bacteriile. Luarea de antibiotice pentru gripă nu face nimic și poate face infecțiile viitoare mai greu de tratat."
            },
            {
              "question": "Te simti mai bine dupa 3 zile de antibiotice. Ar trebui să te oprești?",
              "options": [
                "Da, te-ai vindecat",
                "Nu, termină cursul complet",
                "Luați jumătate din pastilele rămase"
              ],
              "explanation": "Terminați ÎNTOTDEAUNA cursul complet. Dacă te oprești devreme, unele bacterii supraviețuiesc și devin rezistente. Data viitoare, același antibiotic nu va funcționa."
            },
            {
              "question": "Puteți împărtăși antibiotice cu un membru al familiei care are simptome similare?",
              "options": [
                "Da, economisește bani",
                "Nu, niciodată",
                "Doar dacă este aceeași boală"
              ],
              "explanation": "Nu împărtăși niciodată antibiotice. Infecțiile diferite au nevoie de medicamente diferite. Antibioticul greșit poate fi periculos și nu va ajuta."
            },
            {
              "question": "Ce se întâmplă dacă iei antibiotice prea des?",
              "options": [
                "Nimic rău",
                "Corpul tău devine imun la boli",
                "Bacteriile devin rezistente și mai greu de ucis"
              ],
              "explanation": "Rezistența la antibiotice este o criză globală. Când bacteriile devin rezistente, infecțiile simple pot deveni mortale. Luați antibiotice numai atunci când vi le prescrie un medic."
            }
          ]
        },
        "vaccines": {
          "title": "Vaccinuri",
          "description": "Separați faptele de mituri",
          "questions": [
            {
              "question": "Vaccinurile provoacă autism?",
              "options": [
                "Da",
                "Nu",
                "Nu știm"
              ],
              "explanation": "NU. Acest mit a pornit de la un studiu fraudulos care a fost retras. Medicul care a publicat-o și-a pierdut permisul medical. Zeci de studii cu milioane de copii demonstrează că vaccinurile NU provoacă autism."
            },
            {
              "question": "Este sigur să dai unui copil mai multe vaccinuri deodată?",
              "options": [
                "Nu, e prea mult",
                "Da, este sigur și testat",
                "Doar unul la un moment dat"
              ],
              "explanation": "Sistemul imunitar al bebelușilor gestionează mii de germeni în fiecare zi. Vaccinurile combinate sunt testate temeinic și sigure. Amânarea vaccinurilor lasă copilul neprotejat."
            },
            {
              "question": "Copilul meu are o răceală ușoară. Se mai pot vaccina?",
              "options": [
                "Nu, așteptați până când sunt complet sănătoși",
                "Da, o răceală ușoară e bine",
                "Doar cu permisiunea medicului"
              ],
              "explanation": "O răceală ușoară, febră scăzută sau nasul care curge NU este un motiv pentru a amâna vaccinarea. Doar bolile severe necesită amânare. Întrebați medicul dumneavoastră dacă nu sunteți sigur."
            },
            {
              "question": "Conțin vaccinurile substanțe chimice periculoase?",
              "options": [
                "Da, sunt pline de toxine",
                "Nu, toate ingredientele sunt sigure în cantitățile mici folosite",
                "Unii fac, alții nu"
              ],
              "explanation": "Ingredientele vaccinului sunt prezente în cantități mici, sigure. Primești mai mult aluminiu din laptele matern decât dintr-un vaccin. Fiecare ingredient a fost testat pentru siguranță."
            }
          ]
        },
        "diabetes": {
          "title": "Diabetul",
          "description": "Înțelegerea managementului diabetului",
          "questions": [
            {
              "question": "Este diabetul cauzat de consumul de prea mult zahăr?",
              "options": [
                "Da",
                "Nu, e mai complex",
                "Doar tipul 2"
              ],
              "explanation": "Diabetul este cauzat de genetică, stilul de viață și modul în care corpul dumneavoastră procesează insulina. Consumul de zahăr nu îl cauzează în mod direct, dar o dietă nesănătoasă și obezitatea cresc riscul."
            },
            {
              "question": "Poate fi vindecat diabetul cu remedii naturale precum scorțișoara?",
              "options": [
                "Da, scorțișoara o vindecă",
                "Nu, nu există leac, dar poate fi gestionat",
                "Da, cu destul usturoi și ierburi"
              ],
              "explanation": "NU există tratament pentru diabet. Poate fi GESTIONAT cu medicamente, mancare sanatoasa si exercitii fizice. Scorțișoara poate avea beneficii minuscule, dar NU POATE înlocui medicamentele. Oamenii care își opresc medicamentele ajung la spital."
            },
            {
              "question": "O persoană cu diabet se simte amețită și transpirată. Ce ar trebui să faci?",
              "options": [
                "Dați-le insulină",
                "Dă-le imediat ceva dulce",
                "Spune-le să se odihnească"
              ],
              "explanation": "Acestea sunt semne ale glicemiei scăzute (hipoglicemie). Dă-le imediat suc, bomboane sau apă cu zahăr. Acest lucru poate pune viața în pericol. După ce se simt mai bine, ar trebui să mănânce o masă adecvată."
            },
            {
              "question": "Cât de des ar trebui un diabetic să-și verifice picioarele?",
              "options": [
                "Niciodată, picioarele sunt bine",
                "În fiecare zi",
                "O dată pe an"
              ],
              "explanation": "Diabetul poate afecta nervii din picioare. Este posibil să nu simțiți tăieturi sau răni. Verificați-vă picioarele în fiecare zi pentru tăieturi, vezicule sau modificări de culoare. Rănile mici pot deveni infecții grave."
            }
          ]
        },
        "hygiene": {
          "title": "Igienă și prevenire",
          "description": "Obiceiuri de bază pentru sănătate care salvează vieți",
          "questions": [
            {
              "question": "Cât timp trebuie să vă spălați mâinile cu săpun?",
              "options": [
                "5 secunde",
                "Cel puțin 20 secunde",
                "1 minut"
              ],
              "explanation": "Spălați cel puțin 20 secunde — aproximativ timpul necesar pentru a cânta „Happy Birthday” de două ori. Acest lucru elimină majoritatea germenilor. Clătirile rapide nu funcționează."
            },
            {
              "question": "Este sigur să bei apă dintr-un râu sau un pârâu?",
              "options": [
                "Da, apa naturală este curată",
                "Nu, întotdeauna fierbeți sau filtrați-l mai întâi",
                "Doar dacă pare clar"
              ],
              "explanation": "Chiar și apa limpede poate conține bacterii și paraziți periculoși. Fierbeți întotdeauna apă timp de cel puțin 1 minut sau folosiți un filtru. Apa murdară provoacă diaree, holeră și tifoidă."
            },
            {
              "question": "Copilul dumneavoastră are diaree. Care este cel mai important lucru?",
              "options": [
                "Opriți toate alimentele",
                "Dați multe lichide (apă, ORS)",
                "Dați antibiotice"
              ],
              "explanation": "Deshidratarea cauzată de diaree ucide mai mulți copii decât diareea în sine. Dați soluție de rehidratare orală (ORS) sau apă curată cu un praf de sare și zahăr. Continuați să alăptați bebelușii."
            },
            {
              "question": "Când ar trebui să vă spălați pe mâini?",
              "options": [
                "Doar înainte de a mânca",
                "Înainte de a mânca, după toaletă, după atingerea animalelor, după tuse",
                "Doar când par murdare"
              ],
              "explanation": "Germenii sunt invizibili. Spălați-vă mâinile: înainte de a mânca/găti, după folosirea toaletei, după schimbarea scutecelor, după atingerea animalelor, după tuse/strănut și după atingerea persoanelor bolnave."
            }
          ]
        }
      }
    },
    "rights": {
      "meta": {
        "title": "Cunoaște-ți drepturile — Redi Health",
        "description": "Drepturile pacienților, ajutor pentru discriminare și contacte juridice pentru comunitățile de romi"
      },
      "title": "Cunoaște-ți drepturile",
      "subtitle": "Ai drepturi ca pacient. Învață-le. Folosește-le.",
      "back": "Înapoi",
      "menu": {
        "patientRights": {
          "title": "Drepturile pacientului",
          "desc": "8 drepturi pe care fiecare pacient le are"
        },
        "discrimination": {
          "title": "Te confrunți cu discriminarea?",
          "desc": "Ce să spui și să faci — pas cu pas"
        },
        "contacts": {
          "title": "Asistență juridică în funcție de țară",
          "desc": "Ombudsman, anti-discriminare, organizații de romi"
        }
      },
      "views": {
        "patientRights": "Drepturile dumneavoastră pacientului",
        "discrimination": "Dacă vă confruntați cu discriminare",
        "discriminationDesc": "Situații reale și exact ce să spui și să faci.",
        "contacts": "Asistență juridică în funcție de țară"
      },
      "labels": {
        "sayThis": "Spune asta:",
        "thenDo": "Atunci fă asta:",
        "patientOmbudsman": "Avocatul Pacienților",
        "antiDiscrimination": "Anti-Discrimination",
        "romaRightsOrg": "Roma Rights Organization"
      },
      "rights": {
        "treatment": {
          "title": "Dreptul la tratament de urgență",
          "description": "Fiecare spital TREBUIE să vă trateze în caz de urgență, chiar și fără asigurare sau documente. Aceasta este legea în fiecare EU țară. Dacă refuză, cereți numele medicului și raportați-l."
        },
        "information": {
          "title": "Dreptul de a-ți înțelege diagnosticul",
          "description": "Medicul dumneavoastră trebuie să vă explice starea în cuvinte pe care le înțelegeți. Dacă nu înțelegeți, spuneți: „Poți explica asta mai simplu?” De asemenea, puteți solicita un rezumat scris."
        },
        "consent": {
          "title": "Dreptul de a spune nu",
          "description": "Nimeni nu vă poate forța tratamentul. Înainte de orice procedură, medicul trebuie să explice ce vor face și tu trebuie să fii de acord. Puteți spune oricând „Am nevoie de timp să mă gândesc”."
        },
        "privacy": {
          "title": "Dreptul la intimitate",
          "description": "Informațiile dumneavoastră medicale sunt private. Medicii nu-l pot împărtăși angajatorului, familiei sau oricui altcineva fără permisiunea dumneavoastră. Aceasta include starea dvs. HIV, sarcina sau sănătatea mintală."
        },
        "interpreter": {
          "title": "Dreptul la un interpret",
          "description": "Dacă nu vorbiți bine limba locală, puteți solicita un interpret. Multe spitale au acest serviciu. Dacă nu, poți aduce pe cineva în care ai încredere să traducă."
        },
        "second-opinion": {
          "title": "Dreptul la o a doua opinie",
          "description": "Dacă nu sunteți de acord cu un diagnostic, puteți consulta un alt medic. Acesta este dreptul tău. Nu trebuie să explici de ce."
        },
        "records": {
          "title": "Dreptul la dosarele dumneavoastră medicale",
          "description": "Puteți cere oricând o copie a tuturor dosarelor dumneavoastră medicale. Spitalul trebuie să le furnizeze. Acest lucru este util atunci când schimbați doctorul sau vă mutați în alt oraș."
        },
        "complaint": {
          "title": "Dreptul de a se plânge",
          "description": "Dacă vă simțiți maltratat sau discriminat, puteți depune o plângere. Fiecare spital are o procedură de reclamații. De asemenea, puteți contacta ombudsmanul pacienților din țara dumneavoastră."
        }
      },
      "scenarios": {
        "refused-treatment": {
          "situation": "Spitalul refuză să te trateze",
          "whatToSay": "„Am dreptul la tratament de urgență conform legii EU. Vă rugăm să scrieți numele dumneavoastră și motivul pentru care refuzați.”",
          "whatToDo": [
            "Stai calm, dar ferm",
            "Solicitați numele complet al medicului",
            "Solicitați refuzul în scris",
            "Sunați ombudsmanul pacientului",
            "Contactați o organizație pentru drepturile romilor"
          ]
        },
        "rude-staff": {
          "situation": "Personalul spitalului este nepoliticos sau disprețuitor din cauza etniei tale",
          "whatToSay": "„Sunt aici pentru ajutor medical. Mă aștept să fiu tratat cu același respect ca orice alt pacient”.",
          "whatToDo": [
            "Cereți să vorbiți cu asistenta-șef sau cu șeful de departament",
            "Notați data, ora și numele",
            "Depuneți o plângere scrisă la spital",
            "Raportați către organismul național de luptă împotriva discriminării"
          ]
        },
        "no-insurance": {
          "situation": "Nu ai asigurare de sănătate",
          "whatToSay": "\"Am nevoie de ajutor medical. Care sunt opțiunile mele pentru pacienții neasigurați?\"",
          "whatToDo": [
            "Îngrijirea de urgență este întotdeauna gratuită - insistați asupra ei",
            "Întrebați despre programele de asistență socială",
            "Contactați un mediator sanitar din zona dumneavoastră",
            "Multe ONG-uri oferă clinici gratuite - întrebați la spital"
          ]
        },
        "language-barrier": {
          "situation": "Nu poți comunica cu medicul",
          "whatToSay": "„Am nevoie de ajutor pentru înțelegere. Puteți oferi un interpret sau puteți vorbi mai încet?”",
          "whatToDo": [
            "Utilizați această aplicație pentru a traduce fraze cheie",
            "Aduceți o persoană de încredere care vorbește limba",
            "Solicitați instrucțiuni scrise pe care le puteți traduce mai târziu",
            "Utilizați camera telefonului pentru a traduce documente"
          ]
        }
      },
      "contacts": {
        "romania": {
          "country": "Romania",
          "ombudsman": "Avocatul Poporului",
          "antiDiscrimination": "CNCD",
          "ombudsmanPhone": "021 312 7134",
          "antiDiscriminationPhone": "021 312 6578",
          "romaRightsOrg": "Romani CRISS"
        },
        "bulgaria": {
          "country": "Bulgaria",
          "ombudsman": "Ombudsman of Bulgaria",
          "antiDiscrimination": "Commission for Protection against Discrimination",
          "ombudsmanPhone": "02 810 6955",
          "romaRightsOrg": "Amalipe Center"
        },
        "hungary": {
          "country": "Hungary",
          "ombudsman": "Commissioner for Fundamental Rights",
          "antiDiscrimination": "Equal Treatment Authority",
          "ombudsmanPhone": "06 1 475 7100",
          "romaRightsOrg": "Romaversitas Foundation"
        },
        "slovakia": {
          "country": "Slovakia",
          "ombudsman": "Public Defender of Rights",
          "antiDiscrimination": "Slovak National Centre for Human Rights",
          "ombudsmanPhone": "02 4828 7401",
          "romaRightsOrg": "ETP Slovakia"
        },
        "czech-republic": {
          "country": "Czech Republic",
          "ombudsman": "Public Defender of Rights",
          "antiDiscrimination": "Office of the Public Defender",
          "ombudsmanPhone": "542 542 888",
          "romaRightsOrg": "Romea.cz"
        },
        "serbia": {
          "country": "Serbia",
          "ombudsman": "Protector of Citizens",
          "antiDiscrimination": "Commissioner for Equality",
          "ombudsmanPhone": "011 206 8100",
          "romaRightsOrg": "Praxis"
        },
        "albania": {
          "country": "Albania",
          "ombudsman": "People's Advocate",
          "antiDiscrimination": "Commissioner for Protection from Discrimination",
          "ombudsmanPhone": "042 380 300"
        },
        "north-macedonia": {
          "country": "North Macedonia",
          "ombudsman": "Ombudsman",
          "antiDiscrimination": "Commission for Prevention and Protection against Discrimination",
          "ombudsmanPhone": "02 3129 335"
        },
        "greece": {
          "country": "Greece",
          "ombudsman": "Greek Ombudsman",
          "antiDiscrimination": "Greek Ombudsman (Equal Treatment)",
          "ombudsmanPhone": "213 130 6600"
        },
        "croatia": {
          "country": "Croatia",
          "ombudsman": "Ombudswoman",
          "antiDiscrimination": "Ombudswoman",
          "ombudsmanPhone": "01 4851 855"
        }
      }
    },
    "stories": {
      "meta": {
        "title": "Povești ale comunității — Redi Health",
        "description": "Experiențe reale de sănătate din comunitățile de romi din Europa"
      },
      "title": "Poveștile comunității",
      "subtitle": "Experiențe reale din comunitățile de romi. Învață de la alții.",
      "backToStories": "Înapoi la povești",
      "lessonLearned": "Lecția învățată",
      "whatToDoNext": "Ce să faci în continuare",
      "categories": {
        "vaccines": "Vaccinuri",
        "chronic": "Boală cronică",
        "maternal": "Sarcina",
        "discrimination": "Drepturi",
        "prevention": "Prevenirea",
        "mental": "Sănătate mintală"
      },
      "nextSteps": {
        "vaccineGuide": "Ghid de vaccinare",
        "askZuvo": "Întreabă-l pe Zuvo",
        "explainPrescription": "Explicați prescripția",
        "navigateToCare": "Navigați către îngrijire",
        "knowYourRights": "Cunoaște-ți drepturile",
        "learnPrevention": "Învață prevenirea",
        "checkSymptoms": "Verificați simptomele",
        "learnMentalHealth": "Aflați despre sănătatea mintală"
      },
      "entries": {
        "maria-vaccines": {
          "name": "Maria",
          "age": "28",
          "country": "România",
          "title": "Aproape că nu mi-am vaccinat fiica",
          "story": "Soacra mea mi-a spus că vaccinurile sunt otravă. Toți cei din așezare au spus același lucru. Când s-a născut fiica mea, m-am speriat. Dar mediatorul sanitar a venit la noi acasă și ne-a explicat totul – cum funcționează vaccinurile, care sunt cu adevărat efectele secundare. Mi-a arătat fotografii cu copii cu rujeolă. Mi-a fost mai frică de boală decât de vaccin. Fiica mea și-a luat toate vaccinurile. Ea este sanatoasa si puternica.",
          "lesson": "Discutați cu un mediator sanitar sau cu un medic înainte de a lua decizii pe baza a ceea ce spun alții. Vaccinurile salvează vieți."
        },
        "stefan-diabetes": {
          "name": "Stefan",
          "age": "52",
          "country": "Bulgaria",
          "title": "Mi-am oprit medicamentele pentru diabet și aproape că am murit",
          "story": "Am fost diagnosticat cu diabet de tip 2 la 45. Medicamentul m-a durut stomacul, așa că am încetat să-l mai iau. Vecinul meu a spus că ceaiul de scorțișoară mă va vindeca. Timp de 2 ani am baut in schimb ceai de scortisoara. Apoi, într-o zi, m-am prăbușit. Glicemia mea era peste 500. Medicii au spus că rinichii mi-au fost afectați. Acum îmi iau medicamentele în fiecare zi. Mi-aș fi dorit să nu mă fi oprit niciodată.",
          "lesson": "Nu opriți niciodată medicamentul fără a discuta cu medicul dumneavoastră. Remediile naturale nu pot înlocui medicamentele pentru diabet."
        },
        "elena-pregnancy": {
          "name": "Elena",
          "age": "22",
          "country": "Serbia",
          "title": "Prima mea sarcină — nu știam că pot vedea un medic gratis",
          "story": "Când am rămas însărcinată la 19, nu am fost la medic timp de 6 luni. Nu aveam asigurare și m-am gândit că va costa prea mult. Un mediator sanitar mi-a spus că îngrijirea prenatală este gratuită pentru toate femeile însărcinate din Serbia. Ea m-a ajutat să mă înregistrez. Doctorul a constatat că am anemie și hipertensiune arterială. Dacă nu aș fi plecat, copilul meu ar fi putut fi în pericol.",
          "lesson": "Îngrijirea prenatală este gratuită în majoritatea țărilor europene. Cereți unui mediator sanitar să vă ajute să vă înscrieți."
        },
        "janos-discrimination": {
          "name": "János",
          "age": "35",
          "country": "Ungaria",
          "title": "Spitalul a încercat să mă trimită",
          "story": "Am fost la camera de urgenta cu dureri in piept. Asistenta s-a uitat la mine și a spus: „Suntem plini, mergi la alt spital”. Știam că acest lucru nu este corect. Am spus: „Am dureri în piept. Trebuie să mă examinezi. Te rog să-mi spui numele tău. Atitudinea ei s-a schimbat imediat. M-au examinat și au descoperit că aveam o problemă cu inima care avea nevoie de tratament. Dacă aș fi plecat, aș fi putut face un atac de cord.",
          "lesson": "Aveți dreptul la tratament de urgență. Dacă cineva încearcă să te îndepărteze, cere-i numele și spune-i că îți cunoști drepturile."
        },
        "ana-tb": {
          "name": "Ana",
          "age": "31",
          "country": "Slovacia",
          "title": "TB nu este o condamnare la moarte — dar trebuie să termini medicamentul",
          "story": "Tușeam luni de zile. Am crezut că e doar o răceală. Când am fost în sfârșit la doctor, mi-au spus că am tuberculoză. Eram îngrozit - am crezut că voi muri. Dar medicul a explicat că TB se poate vindeca cu 6 luni de medicamente. Cea mai grea parte a fost să iau pastile în fiecare zi timp de 6 luni, chiar și atunci când mă simțeam mai bine după 2 luni. Dar am terminat. sunt vindecat.",
          "lesson": "Dacă tușiți mai mult de 2 săptămâni, consultați un medic. TB este vindecabil, dar TREBUIE să termini toate medicamentele."
        },
        "mirela-depression": {
          "name": "Mirela",
          "age": "40",
          "country": "Macedonia de Nord",
          "title": "Depresia nu este slăbiciune - este o boală",
          "story": "După ce a murit soțul meu, nu m-am putut ridica din pat luni de zile. Familia mea a spus că sunt leneș. Au spus „doar fii puternic”. Dar nu am putut. Un mediator sanitar a observat că ceva nu era în regulă și m-a dus la medic. Doctorul a spus că am depresie - o adevărată afecțiune medicală. Am început medicina și am vorbit cu un consilier. Încet-încet, m-am îmbunătățit. nu sunt slab. Am fost bolnav.",
          "lesson": "Depresia este o condiție medicală, nu un defect de caracter. Medicina și consilierea pot ajuta. Vă rugăm să cereți ajutor."
        }
      }
    },
    "challenges": {
      "meta": {
        "title": "Provocări — Redi Health",
        "description": "Provocări ale comunității"
      },
      "title": "Provocări active",
      "subtitle": "Alăturați-vă obiectivelor comunității și provocărilor personale pentru a câștiga bonus XP și insigne.",
      "types": {
        "community": "comunitate",
        "personal": "personale"
      },
      "daysLeft": "Au mai rămas {count} zile",
      "viewLeaderboard": "Vedeți clasamentul",
      "items": {
        "c1": {
          "title": "Campion al cunoașterii vaccinurilor",
          "description": "Aduceți 50 studenți din zona dvs. locală să promoveze modulul Vaccin în această săptămână."
        },
        "c2": {
          "title": "Seria de sănătate de 7 zile",
          "description": "Înregistrați-vă starea de spirit și consumul de apă timp de 7 zile la rând."
        }
      }
    },
    "certificate": {
      "meta": {
        "title": "Certificat — Redi Health",
        "description": "Certificat național de alfabetizare în domeniul sănătății"
      },
      "title": "Certificatul dvs",
      "subtitle": "Ați finalizat Etapa Națională a Academiei de Sănătate Studențească.",
      "ofCompletion": "Certificat de finalizare",
      "diplomaTitle": "Educație națională în domeniul sănătății",
      "awardedFor": "Acordat pentru finalizarea curriculum-ului Redi Health Student Academy.",
      "date": "Data",
      "downloadPdf": "Descărcați PDF",
      "share": "Distribuie",
      "gate": {
        "title": "Finalizează mai întâi Academia",
        "description": "Pentru a obține certificatul de alfabetizare în domeniul sănătății, trebuie să finalizați toate lecțiile și să treceți testul în etapa națională a Academiei de sănătate a studenților.",
        "cta": "Du-te la Academie"
      }
    }
  },
  "rom": {
    "healthQuiz": {
      "meta": {
        "title": "Test de sastipen — Redi Health",
        "description": "Testează-ți cunoștințele de sastipen cu chestionare interactive"
      },
      "title": "Sastipenaki quiz",
      "subtitle": "Dikh sar zhanes. Sikhave kova nevo.",
      "backToQuizzes": "Înapoi la chestionare",
      "seeResults": "Vezi rezultatele",
      "nextQuestion": "Următoarea puximata",
      "questionsCount": "{count} întrebări",
      "results": {
        "perfect": "Scor perfect!",
        "great": "Mare treaba!",
        "good": "Efort bun!",
        "keepLearning": "Continuați să învățați!",
        "score": "Ai luat {score} din {total} corect",
        "tryAgain": "Încercați din nou",
        "moreQuizzes": "Mai multe chestionare"
      },
      "quizzes": {
        "antibiotics": {
          "title": "Antibiotice",
          "description": "Știi kana să folosești antibiotice?",
          "questions": [
            {
              "question": "Pot antibioticele să vindece gripa?",
              "options": [
                "Va",
                "na",
                "Uneori"
              ],
              "explanation": "Gripa si cauzată de un virus. Antibioticele ucid doar bacteriile. Luarea de antibiotice pentru gripă na face nimic thaj šaj face infecțiile viitoare mai greu de tratat."
            },
            {
              "question": "Te simti mai bine dupa 3 dives de antibiotice. Ar trebui să te oprești?",
              "options": [
                "Va, te-ai vindecat",
                "na, termină cursul complet",
                "Luați jumătate din pastilele rămase"
              ],
              "explanation": "Terminați ÎNTOTDEAUNA cursul complet. te te oprești devreme, unele bacterii supraviețuiesc thaj devin rezistente. Data viitoare, același antibiotic na va funcționa."
            },
            {
              "question": "Puteți împărtăși antibiotice cu un membru al familijai care are simptome similare?",
              "options": [
                "Va, economisește bani",
                "na, niciodată",
                "Doar te si aceeași boală"
              ],
              "explanation": "na împărtăși niciodată antibiotice. Infecțiile diferite au nevoie de doktoroamente diferite. Antibioticul greșit šaj fi periculos thaj na va ajuta."
            },
            {
              "question": "Ce se întâmplă te iei antibiotice prea des?",
              "options": [
                "Nimic rău",
                "Corpul tău devine imun la nasvalipen",
                "Bacteriile devin rezistente thaj mai greu de ucis"
              ],
              "explanation": "Rezistența la antibiotice si o criză globală. kana bacteriile devin rezistente, infecțiile simple pot deveni mortale. Luați antibiotice numai atunci kana vi le prescrie un doktoro."
            }
          ]
        },
        "vaccines": {
          "title": "vakcinuri",
          "description": "Separați faptele de mituri",
          "questions": [
            {
              "question": "vakcinurile provoacă autism?",
              "options": [
                "Va",
                "na",
                "na știm"
              ],
              "explanation": "na. Acest mit a pornit de la un studiu fraudulos care a fost retras. doktoroul care a publicat-o thaj-a pierdut permisul doktoroal. Zeci de studii cu milioane de čhavore demonstrează că vakcinurile na provoacă autism."
            },
            {
              "question": "si sigur să dai unui čhavo mai multe vakcinuri deodată?",
              "options": [
                "na, e prea mult",
                "Va, si sigur thaj testat",
                "Doar unul la un moment dat"
              ],
              "explanation": "Sistemul imunitar al bebelușilor gestionează mii de germeni în fiecare dives. vakcinurile combinate si testate temeinic thaj sigure. Amânarea vakcinurilor lasă čhavoul neprotejat."
            },
            {
              "question": "čhavoul meu are o răceală ușoară. Se mai pot vakcina?",
              "options": [
                "na, așteptați până kana si complet sănătoși",
                "Va, o răceală ușoară e bine",
                "Doar cu permisiunea doktoroului"
              ],
              "explanation": "O răceală ușoară, febră scăzută vaj nasul care curge na si un motiv pentru a amâna vakcinarea. Doar nasvalipenle severe necesită amânare. Întrebați doktoroul dumneavoastră te na sunteți sigur."
            },
            {
              "question": "Conțin vakcinurile substanțe chimice periculoase?",
              "options": [
                "Va, si pline de toxine",
                "na, toate ingredientele si sigure în cantitățile mici folosite",
                "Unii fac, alții na"
              ],
              "explanation": "Ingredientele vakcinului si prezente în cantități mici, sigure. Primești mai mult aluminiu din laptele matern decât dintr-un vakcin. Fiecare ingredient a fost testat pentru siguranță."
            }
          ]
        },
        "diabetes": {
          "title": "Diabetul",
          "description": "Înțelegerea managementului diabetului",
          "questions": [
            {
              "question": "si diabetul cauzat de consumul de prea mult zahăr?",
              "options": [
                "Va",
                "na, e mai complex",
                "Doar tipul 2"
              ],
              "explanation": "Diabetul si cauzat de genetică, stilul de viață thaj modul în care corpul dumneavoastră procesează insulina. Consumul de zahăr na îl cauzează în mod direct, amari o dietă nesănătoasă thaj obezitatea cresc riscul."
            },
            {
              "question": "šaj fi vindecat diabetul cu remedii naturale precum scorțișoara?",
              "options": [
                "Va, scorțișoara o vindecă",
                "na, na există leac, amari šaj fi gestionat",
                "Va, cu destul usturoi thaj ierburi"
              ],
              "explanation": "na există tretmano pentru diabet. šaj fi GESTIONAT cu doktoroamente, mancare sanatoasa si exercitii fizice. Scorțișoara šaj avea beneficii minuscule, amari na šaj înlocui doktoroamentele. Oamenii care își opresc doktoroamentele ajung la spitalo."
            },
            {
              "question": "O persoană cu diabet se simte amețită thaj transpirată. Ce ar trebui să faci?",
              "options": [
                "Dați-le insulină",
                "Dă-le imediat ceva dulce",
                "Spune-le să se odihnească"
              ],
              "explanation": "Acestea si semne ale glicemiei scăzute (hipoglicemie). Dă-le imediat suc, bomboane vaj paji cu zahăr. Acest lucru šaj pune viața în pericol. După ce se simt mai bine, ar trebui să mănânce o masă adecvată."
            },
            {
              "question": "Cât de des ar trebui un diabetic să-thaj verifice picioarele?",
              "options": [
                "Niciodată, picioarele si bine",
                "În fiecare dives",
                "O dată pe berš"
              ],
              "explanation": "Diabetul šaj afecta nervii din picioare. si posibil să na simțiți tăieturi vaj răni. Verificați-vă picioarele în fiecare dives pentru tăieturi, vezicule vaj modificări de culoare. Rănile mici pot deveni infecții grave."
            }
          ]
        },
        "hygiene": {
          "title": "Igienă thaj prevenire",
          "description": "Obiceiuri de bază pentru sastipen care salvează vieți",
          "questions": [
            {
              "question": "Cât timp trebuie să vă spălați vastale cu săpun?",
              "options": [
                "5 secunde",
                "Cel puțin 20 secunde",
                "1 minut"
              ],
              "explanation": "Spălați cel puțin 20 secunde — aproximativ timpul necesar pentru a cânta „Happy Birthday” de două ori. Acest lucru elimină majoritatea germenilor. Clătirile rapide na funcționează."
            },
            {
              "question": "si sigur să bei paji dintr-un râu vaj un pârâu?",
              "options": [
                "Va, apa naturală si curată",
                "na, întotdeauna fierbeți vaj filtrați-l mai întâi",
                "Doar te pare clar"
              ],
              "explanation": "Chiar thaj apa limpede šaj conține bacterii thaj paraziți periculoși. Fierbeți întotdeauna paji timp de cel puțin 1 minut vaj folosiți un filtru. Apa murdară provoacă diaree, holeră thaj tifoidă."
            },
            {
              "question": "čhavoul dumneavoastră are diaree. Care si cel mai important lucru?",
              "options": [
                "Opriți toate alimentele",
                "Dați multe lichide (paji, ORS)",
                "Dați antibiotice"
              ],
              "explanation": "Deshidratarea cauzată de diaree ucide mai mulți čhavore decât diareea în sine. Dați soluție de rehidratare orală (ORS) vaj paji curată cu un praf de sare thaj zahăr. Continuați să alăptați bebelușii."
            },
            {
              "question": "kana ar trebui să vă spălați pe vasta?",
              "options": [
                "Doar înainte de a mânca",
                "Înainte de a mânca, după toaletă, după atingerea animalelor, după tuse",
                "Doar kana par murdare"
              ],
              "explanation": "Germenii si invizibili. Spălați-vă vastale: înainte de a mânca/găti, după folosirea toaletei, după schimbarea scutecelor, după atingerea animalelor, după tuse/strănut thaj după atingerea persoanelor nasvaloe."
            }
          ]
        }
      }
    },
    "rights": {
      "meta": {
        "title": "Cunoaște-ți hakajale — Redi Health",
        "description": "hakajale pacienților, ajutor pentru discriminare thaj contacte juridice pentru comunitățile de romi"
      },
      "title": "Dikh tiri hakaja",
      "subtitle": "Ai hakaja ca pacient. Învață-le. Folosește-le.",
      "back": "Înapoi",
      "menu": {
        "patientRights": {
          "title": "hakajale pacientului",
          "desc": "8 hakaja pe care fiecare pacient le are"
        },
        "discrimination": {
          "title": "Te confrunți cu discriminarea?",
          "desc": "Ce să spui thaj să faci — pas cu pas"
        },
        "contacts": {
          "title": "Asistență juridică în funcție de țară",
          "desc": "Ombudsman, anti-discriminare, organizații de romi"
        }
      },
      "views": {
        "patientRights": "hakajale dumneavoastră pacientului",
        "discrimination": "te vă confruntați cu discriminare",
        "discriminationDesc": "Situații reale thaj exact ce să spui thaj să faci.",
        "contacts": "Asistență juridică în funcție de țară"
      },
      "labels": {
        "sayThis": "Spune asta:",
        "thenDo": "Atunci fă asta:",
        "patientOmbudsman": "Avocatul Pacienților",
        "antiDiscrimination": "Anti-diskriminim",
        "romaRightsOrg": "Organizacija vaš romane hakaja"
      },
      "rights": {
        "treatment": {
          "title": "Dreptul la tretmano de urgență",
          "description": "Fiecare spitalo TREBUIE să vă trateze în caz de urgență, chiar thaj fără asigurare vaj documente. Aceasta si legea în fiecare EU țară. te refuză, cereți numele doktoroului thaj raportați-l."
        },
        "information": {
          "title": "Dreptul de a-ți înțelege diagnosticul",
          "description": "doktoroul dumneavoastră trebuie să vă explice starea în cuvinte pe care le înțelegeți. te na înțelegeți, spuneți: „Poți explica asta mai simplu?” De asemenea, puteți solicita un rezumat scris."
        },
        "consent": {
          "title": "Dreptul de a spune na",
          "description": "Nimeni na vă šaj forța tretmanoul. Înainte de orice procedură, doktoroul trebuie să explice ce vor face thaj tu trebuie să fii de acord. Puteți spune oricând „Am nevoie de timp să mă gândesc”."
        },
        "privacy": {
          "title": "Dreptul la intimitate",
          "description": "Informațiile dumneavoastră doktoroale si private. doktoroii na-l pot împărtăși angajatorului, familijai vaj oricui altcineva fără permisiunea dumneavoastră. Aceasta include starea dvs. HIV, sarcina vaj sastipena mintală."
        },
        "interpreter": {
          "title": "Dreptul la un interpret",
          "description": "te na vorbiți bine limba locală, puteți solicita un interpret. Multe spitaloe au acest serviciu. te na, poți aduce pe cineva în care ai încredere să traducă."
        },
        "second-opinion": {
          "title": "Dreptul la o a doua opinie",
          "description": "te na sunteți de acord cu un diagnostic, puteți consulta un alt doktoro. Acesta si dreptul tău. na trebuie să explici de ce."
        },
        "records": {
          "title": "Dreptul la dosarele dumneavoastră doktoroale",
          "description": "Puteți cere oricând o copie a tuturor dosarelor dumneavoastră doktoroale. spitaloul trebuie să le furnizeze. Acest lucru si util atunci kana schimbați doktoroul vaj vă mutați în alt oraș."
        },
        "complaint": {
          "title": "Dreptul de a se plânge",
          "description": "te vă simțiți maltratat vaj discriminat, puteți depune o plângere. Fiecare spitalo are o procedură de reclamații. De asemenea, puteți contacta ombudsmanul pacienților din țara dumneavoastră."
        }
      },
      "scenarios": {
        "refused-treatment": {
          "situation": "spitaloul refuză să te trateze",
          "whatToSay": "„Am dreptul la tretmano de urgență conform legii EU. Vă rugăm să scrieți numele dumneavoastră thaj motivul pentru care refuzați.”",
          "whatToDo": [
            "Stai calm, amari ferm",
            "Solicitați numele complet al doktoroului",
            "Solicitați refuzul în scris",
            "Sunați ombudsmanul pacientului",
            "Contactați o organizație pentru hakajale romilor"
          ]
        },
        "rude-staff": {
          "situation": "Personalul spitaloului si nepoliticos vaj disprețuitor din cauza etniei tale",
          "whatToSay": "„si aici pentru ajutor doktoroal. Mă aștept să fiu tratat cu același respect ca orice alt pacient”.",
          "whatToDo": [
            "Cereți să vorbiți cu asistenta-șef vaj cu șeful de departament",
            "Notați data, ora thaj numele",
            "Depuneți o plângere scrisă la spitalo",
            "Raportați către organismul național de luptă împotriva discriminării"
          ]
        },
        "no-insurance": {
          "situation": "na ai asigurare de sastipen",
          "whatToSay": "\"Am nevoie de ajutor doktoroal. Care si opțiunile mele pentru pacienții neasigurați?\"",
          "whatToDo": [
            "Îngrijirea de urgență si întotdeauna makhloă - insistați asupra ei",
            "Întrebați despre programele de asistență socială",
            "Contactați un mediator sanitar din zona dumneavoastră",
            "Multe ONG-uri oferă clinici makhloe - întrebați la spitalo"
          ]
        },
        "language-barrier": {
          "situation": "na poți comunica cu doktoroul",
          "whatToSay": "„Am nevoie de ajutor pentru înțelegere. Puteți oferi un interpret vaj puteți vorbi mai încet?”",
          "whatToDo": [
            "Utilizați această aplicație pentru a traduce fraze cheie",
            "Aduceți o persoană de încredere care vorbește limba",
            "Solicitați instrucțiuni scrise pe care le puteți traduce mai târziu",
            "Utilizați camera telefonului pentru a traduce documente"
          ]
        }
      },
      "contacts": {
        "romania": {
          "country": "Romania",
          "ombudsman": "Avocatul Poporului",
          "antiDiscrimination": "CNCD",
          "ombudsmanPhone": "021 312 7134",
          "antiDiscriminationPhone": "021 312 6578",
          "romaRightsOrg": "Romani CRISS"
        },
        "bulgaria": {
          "country": "Bulgaria",
          "ombudsman": "Ombudsman of Bulgaria",
          "antiDiscrimination": "Commission for Protection against Discrimination",
          "ombudsmanPhone": "02 810 6955",
          "romaRightsOrg": "Amalipe Center"
        },
        "hungary": {
          "country": "Hungary",
          "ombudsman": "Commissioner for Fundamental Rights",
          "antiDiscrimination": "Equal Treatment Authority",
          "ombudsmanPhone": "06 1 475 7100",
          "romaRightsOrg": "Romaversitas Foundation"
        },
        "slovakia": {
          "country": "Slovakia",
          "ombudsman": "Public Defender of Rights",
          "antiDiscrimination": "Slovak National Centre for Human Rights",
          "ombudsmanPhone": "02 4828 7401",
          "romaRightsOrg": "ETP Slovakia"
        },
        "czech-republic": {
          "country": "Czech Republic",
          "ombudsman": "Public Defender of Rights",
          "antiDiscrimination": "Office of the Public Defender",
          "ombudsmanPhone": "542 542 888",
          "romaRightsOrg": "Romea.cz"
        },
        "serbia": {
          "country": "Serbia",
          "ombudsman": "Protector of Citizens",
          "antiDiscrimination": "Commissioner for Equality",
          "ombudsmanPhone": "011 206 8100",
          "romaRightsOrg": "Praxis"
        },
        "albania": {
          "country": "Albania",
          "ombudsman": "People's Advocate",
          "antiDiscrimination": "Commissioner for Protection from Discrimination",
          "ombudsmanPhone": "042 380 300"
        },
        "north-macedonia": {
          "country": "North Macedonia",
          "ombudsman": "Ombudsman",
          "antiDiscrimination": "Commission for Prevention and Protection against Discrimination",
          "ombudsmanPhone": "02 3129 335"
        },
        "greece": {
          "country": "Greece",
          "ombudsman": "Greek Ombudsman",
          "antiDiscrimination": "Greek Ombudsman (Equal Treatment)",
          "ombudsmanPhone": "213 130 6600"
        },
        "croatia": {
          "country": "Croatia",
          "ombudsman": "Ombudswoman",
          "antiDiscrimination": "Ombudswoman",
          "ombudsmanPhone": "01 4851 855"
        }
      }
    },
    "stories": {
      "meta": {
        "title": "Povești ale comunității — Redi Health",
        "description": "Experiențe reale de sastipen din comunitățile de romi din Europa"
      },
      "title": "Paramiča andar komuniteto",
      "subtitle": "Experiențe reale din comunitățile de romi. Învață de la alții.",
      "backToStories": "Înapoi la povești",
      "lessonLearned": "Lecția învățată",
      "whatToDoNext": "Ce să faci în continuare",
      "categories": {
        "vaccines": "vakcinuri",
        "chronic": "Boală cronică",
        "maternal": "Sarcina",
        "discrimination": "hakaja",
        "prevention": "Prevenirea",
        "mental": "sastipen mintală"
      },
      "nextSteps": {
        "vaccineGuide": "Ghid de vakcinare",
        "askZuvo": "Întreabă-l pe Zuvo",
        "explainPrescription": "Explicați prescripția",
        "navigateToCare": "Navigați către îngrijire",
        "knowYourRights": "Cunoaște-ți hakajale",
        "learnPrevention": "Învață prevenirea",
        "checkSymptoms": "Verificați simptomele",
        "learnMentalHealth": "Aflați despre sastipena mintală"
      },
      "entries": {
        "maria-vaccines": {
          "name": "Maria",
          "age": "28",
          "country": "România",
          "title": "Aproape că na mi-am vakcinat fiica",
          "story": "Soacra mea mi-a spus că vakcinurile si otravă. Toți cei din așezare au spus același lucru. kana s-a născut fiica mea, m-am speriat. amari mediatorul sanitar a venit la noi acasă thaj ne-a explicat totul – cum funcționează vakcinurile, care si cu adevărat efectele secundare. Mi-a arătat fotografii cu čhavore cu rujeolă. Mi-a fost mai dar de boală decât de vakcin. Fiica mea thaj-a luat toate vakcinurile. Ea si sanatoasa si puternica.",
          "lesson": "Discutați cu un mediator sanitar vaj cu un doktoro înainte de a lua decizii pe baza a ceea ce spun alții. vakcinurile salvează vieți."
        },
        "stefan-diabetes": {
          "name": "Stefan",
          "age": "52",
          "country": "Bulgarija",
          "title": "Mi-am oprit doktoroamentele pentru diabet thaj aproape că am murit",
          "story": "Am fost diagnosticat cu diabet de tip 2 la 45. doktoroamentul m-a durut stomacul, așa că am încetat să-l mai iau. Vecinul meu a spus că ceaiul de scorțișoară mă va vindeca. Timp de 2 berša am baut in schimb ceai de scortisoara. Apoi, într-o dives, m-am prăbușit. Glicemia mea era peste 500. doktoroii au spus că rinichii mi-au fost afectați. Acum îmi iau doktoroamentele în fiecare dives. Mi-aș fi dorit să na mă fi oprit niciodată.",
          "lesson": "na opriți niciodată doktoroamentul fără a discuta cu doktoroul dumneavoastră. Remediile naturale na pot înlocui doktoroamentele pentru diabet."
        },
        "elena-pregnancy": {
          "name": "Elena",
          "age": "22",
          "country": "Serbija",
          "title": "Prima mea sarcină — na știam că pot vedea un doktoro gratis",
          "story": "kana am rămas însărcinată la 19, na am fost la doktoro timp de 6 luni. na aveam asigurare thaj m-am gândit că va costa prea mult. Un mediator sanitar mi-a spus că îngrijirea prenatală si makhloă pentru toate femeile însărcinate din Serbia. Ea m-a ajutat să mă înregistrez. doktoroul a constatat că am anemie thaj hipertensiune arterială. te na aș fi plecat, čhavoul meu ar fi putut fi în pericol.",
          "lesson": "Îngrijirea prenatală si makhloă în majoritatea țărilor europene. Cereți unui mediator sanitar să vă ajute să vă înscrieți."
        },
        "janos-discrimination": {
          "name": "János",
          "age": "35",
          "country": "Ungaria",
          "title": "spitaloul a încercat să mă trimită",
          "story": "Am fost la camera de pharia cu dureri in piept. Asistenta s-a uitat la mine thaj a spus: „Suntem plini, mergi la alt spitalo”. Știam că acest lucru na si corect. Am spus: „Am dureri în piept. Trebuie să mă examinezi. Te rog să-mi spui numele tău. Atitudinea ei s-a schimbat imediat. M-au examinat thaj au descoperit că aveam o problemă cu inima care avea nevoie de tretmano. te aș fi plecat, aș fi putut face un atac de cord.",
          "lesson": "Aveți dreptul la tretmano de urgență. te cineva încearcă să te îndepărteze, cere-i numele thaj spune-i că îți cunoști hakajale."
        },
        "ana-tb": {
          "name": "Ana",
          "age": "31",
          "country": "Slovacia",
          "title": "TB na si o condamnare la moarte — amari trebuie să termini doktoroamentul",
          "story": "Tușeam luni de dives. Am crezut că e doar o răceală. kana am fost în sfârșit la doktoro, mi-au spus că am tuberculoză. Eram îngrozit - am crezut că voi muri. amari doktoroul a explicat că TB se šaj vindeca cu 6 luni de doktoroamente. Cea mai grea parte a fost să iau pastile în fiecare dives timp de 6 luni, chiar thaj atunci kana mă simțeam mai bine după 2 luni. amari am terminat. si vindecat.",
          "lesson": "te tușiți mai mult de 2 săptămâni, consultați un doktoro. TB si vindecabil, amari TREBUIE să termini toate doktoroamentele."
        },
        "mirela-depression": {
          "name": "Mirela",
          "age": "40",
          "country": "Macedonia de Nord",
          "title": "Depresia na si slăbiciune - si o boală",
          "story": "După ce a murit soțul meu, na m-am putut ridica din pat luni de dives. Familia mea a spus că si leneș. Au spus „doar fii puternic”. amari na am putut. Un mediator sanitar a observat că ceva na era în regulă thaj m-a dus la doktoro. doktoroul a spus că am depresie - o adevărată afecțiune doktoroală. Am început doktoroina thaj am vorbit cu un consilier. Încet-încet, m-am îmbunătățit. na si slab. Am fost nasvalo.",
          "lesson": "Depresia si o condiție doktoroală, na un defect de caracter. doktoroina thaj consilierea pot ajuta. Vă rugăm să cereți ajutor."
        }
      }
    },
    "challenges": {
      "meta": {
        "title": "Provocări — Redi Health",
        "description": "Provocări ale comunității"
      },
      "title": "Provocări active",
      "subtitle": "Alăturați-vă obiectivelor comunității thaj provocărilor personale pentru a câștiga bonus XP thaj insigne.",
      "types": {
        "community": "komuniteto",
        "personal": "personale"
      },
      "daysLeft": "Au mai rămas {count} dives",
      "viewLeaderboard": "Vedeți clasamentul",
      "items": {
        "c1": {
          "title": "Campion al cunoașterii vakcinurilor",
          "description": "Aduceți 50 studenți din zona dvs. locală să promoveze modulul vakcin în această săptămână."
        },
        "c2": {
          "title": "Seria de sastipen de 7 dives",
          "description": "Înregistrați-vă starea de spirit thaj consumul de paji timp de 7 dives la rând."
        }
      }
    },
    "certificate": {
      "meta": {
        "title": "Certificat — Redi Health",
        "description": "Certificat național de alfabetizare în domeniul sănătății"
      },
      "title": "Certificatul dvs",
      "subtitle": "Ați finalizat Etapa Națională a Academiei de sastipen Studențească.",
      "ofCompletion": "Certificat de finalizare",
      "diplomaTitle": "Educație națională în domeniul sănătății",
      "awardedFor": "Acordat pentru finalizarea curriculum-ului Redi Health Student Academy.",
      "date": "Data",
      "downloadPdf": "Descărcați PDF",
      "share": "Distribuie",
      "gate": {
        "title": "Finalizează mai întâi Academia",
        "description": "Pentru a obține certificatul de alfabetizare în domeniul sănătății, trebuie să finalizați toate lecțiile thaj să treceți testul în etapa națională a Academiei de sastipen a studenților.",
        "cta": "Du-te la Academie"
      }
    }
  },
  "sk": {
    "healthQuiz": {
      "meta": {
        "title": "Zdravotný kvíz — Redi Health",
        "description": "Otestujte si svoje zdravotné znalosti pomocou interaktívnych kvízov"
      },
      "title": "Zdravotný kvíz",
      "subtitle": "Otestujte si svoje vedomosti. Naučte sa niečo nové.",
      "backToQuizzes": "Späť ku kvízom",
      "seeResults": "Pozrite si výsledky",
      "nextQuestion": "Ďalšia otázka",
      "questionsCount": "{count} otázok",
      "results": {
        "perfect": "Perfektné skóre!",
        "great": "Skvelá práca!",
        "good": "Dobré úsilie!",
        "keepLearning": "Učte sa ďalej!",
        "score": "Správne ste dosiahli {score} z {total}",
        "tryAgain": "Skúste to znova",
        "moreQuizzes": "Viac kvízov"
      },
      "quizzes": {
        "antibiotics": {
          "title": "Antibiotiká",
          "description": "Viete, kedy užívať antibiotiká?",
          "questions": [
            {
              "question": "Môžu antibiotiká vyliečiť chrípku?",
              "options": [
                "áno",
                "Nie",
                "Niekedy"
              ],
              "explanation": "Chrípka je spôsobená vírusom. Antibiotiká zabíjajú iba baktérie. Užívanie antibiotík na chrípku nič nerobí a môže sťažiť liečbu budúcich infekcií."
            },
            {
              "question": "Po 3 dňoch užívania antibiotík sa cítite lepšie. Mali by ste prestať?",
              "options": [
                "Áno, si vyliečený",
                "Nie, dokončite celý kurz",
                "Vezmite polovicu zvyšných tabliet"
              ],
              "explanation": "VŽDY dokončite celý kurz. Ak prestanete skoro, niektoré baktérie prežijú a stanú sa odolnými. Nabudúce to isté antibiotikum nezaberie."
            },
            {
              "question": "Môžete zdieľať antibiotiká s členom rodiny, ktorý má podobné príznaky?",
              "options": [
                "Áno, šetrí to peniaze",
                "Nie, nikdy",
                "Iba ak ide o rovnakú chorobu"
              ],
              "explanation": "Nikdy nezdieľajte antibiotiká. Rôzne infekcie vyžadujú rôzne lieky. Nesprávne antibiotikum môže byť nebezpečné a nepomôže."
            },
            {
              "question": "Čo sa stane, ak užívate antibiotiká príliš často?",
              "options": [
                "Nič zlé",
                "Vaše telo sa stáva imúnnym voči chorobám",
                "Baktérie sa stávajú odolnými a ťažšie sa zabíjajú"
              ],
              "explanation": "Antibiotická rezistencia je globálna kríza. Keď sa baktérie stanú odolnými, jednoduché infekcie sa môžu stať smrteľnými. Antibiotiká užívajte len vtedy, keď ich predpíše lekár."
            }
          ]
        },
        "vaccines": {
          "title": "Vakcíny",
          "description": "Oddeľte fakty od mýtov",
          "questions": [
            {
              "question": "Spôsobujú vakcíny autizmus?",
              "options": [
                "áno",
                "Nie",
                "nevieme"
              ],
              "explanation": "NIE Tento mýtus vznikol na základe podvodnej štúdie, ktorá bola stiahnutá. Lekár, ktorý to zverejnil, prišiel o lekársku licenciu. Desiatky štúdií s miliónmi detí dokazujú, že vakcíny NEspôsobujú autizmus."
            },
            {
              "question": "Je bezpečné dať dieťaťu viacero vakcín naraz?",
              "options": [
                "Nie, je toho priveľa",
                "Áno, je to bezpečné a testované",
                "Len po jednom"
              ],
              "explanation": "Imunitný systém detí sa každý deň vysporiada s tisíckami baktérií. Kombinované vakcíny sú dôkladne testované a bezpečné. Odloženie očkovania ponecháva vaše dieťa nechránené."
            },
            {
              "question": "Moje dieťa má miernu nádchu. Môžu sa ešte dať zaočkovať?",
              "options": [
                "Nie, počkaj, kým nebude úplne zdravý",
                "Áno, mierne prechladnutie je v poriadku",
                "Len so súhlasom lekára"
              ],
              "explanation": "Mierna nádcha, nízka horúčka alebo nádcha NIE SÚ dôvodom na odloženie očkovania. Len ťažké ochorenie si vyžaduje odklad. Ak si nie ste istý, opýtajte sa svojho lekára."
            },
            {
              "question": "Obsahujú vakcíny nebezpečné chemikálie?",
              "options": [
                "Áno, sú plné toxínov",
                "Nie, všetky zložky sú v malých množstvách bezpečné",
                "Niektorí áno, niektorí nie"
              ],
              "explanation": "Zložky vakcíny sú prítomné v malých, bezpečných množstvách. Z materského mlieka dostanete viac hliníka ako z vakcíny. Každá zložka bola testovaná na bezpečnosť."
            }
          ]
        },
        "diabetes": {
          "title": "Diabetes",
          "description": "Pochopenie liečby cukrovky",
          "questions": [
            {
              "question": "Je cukrovka spôsobená konzumáciou príliš veľkého množstva cukru?",
              "options": [
                "áno",
                "Nie, je to zložitejšie",
                "Len typ 2"
              ],
              "explanation": "Diabetes je spôsobený genetikou, životným štýlom a tým, ako vaše telo spracováva inzulín. Konzumácia cukru to priamo nespôsobuje, ale nezdravá strava a obezita zvyšujú riziko."
            },
            {
              "question": "Dá sa cukrovka vyliečiť prírodnými prostriedkami, ako je škorica?",
              "options": [
                "Áno, škorica to lieči",
                "Nie, neexistuje žiadny liek, ale dá sa to zvládnuť",
                "Áno, s dostatkom cesnaku a byliniek"
              ],
              "explanation": "Na cukrovku NEEXISTUJE liek. Dá sa to zvládnuť liekmi, zdravým jedlom a cvičením. Škorica môže mať malé výhody, ale NEMÔŽE nahradiť lieky. Ľudia, ktorí prestanú užívať lieky, skončia v nemocnici."
            },
            {
              "question": "Diabetik pociťuje závraty a pot. Čo by ste mali urobiť?",
              "options": [
                "Dajte im inzulín",
                "Okamžite im dajte niečo sladké",
                "Povedzte im, aby si oddýchli"
              ],
              "explanation": "Toto sú príznaky NÍZKEHO cukru v krvi (hypoglykémia). Okamžite im dajte šťavu, cukrík alebo cukrovú vodu. To môže byť život ohrozujúce. Keď sa budú cítiť lepšie, mali by sa poriadne najesť."
            },
            {
              "question": "Ako často by si mal diabetik kontrolovať chodidlá?",
              "options": [
                "Nikdy, nohy sú v poriadku",
                "Každý deň",
                "Raz za rok"
              ],
              "explanation": "Diabetes môže poškodiť nervy v nohách. Možno nebudete cítiť rezné rany alebo rany. KAŽDÝ DEŇ kontrolujte svoje chodidlá, či na nich nie sú rezné rany, pľuzgiere alebo zmeny farby. Malé rany sa môžu stať vážnymi infekciami."
            }
          ]
        },
        "hygiene": {
          "title": "Hygiena a prevencia",
          "description": "Základné zdravotné návyky, ktoré zachraňujú životy",
          "questions": [
            {
              "question": "Ako dlho by ste si mali umývať ruky mydlom?",
              "options": [
                "5 sekúnd",
                "Minimálne 20 sekúnd",
                "1 minúta"
              ],
              "explanation": "Umývajte sa aspoň 20 sekúnd, čo je približne čas potrebný na zaspievanie „Happy Birthday“ dvakrát. Tým sa odstráni väčšina choroboplodných zárodkov. Rýchle oplachy nefungujú."
            },
            {
              "question": "Je bezpečné piť vodu z rieky alebo potoka?",
              "options": [
                "Áno, prírodná voda je čistá",
                "Nie, vždy to najskôr prevarte alebo prefiltrujte",
                "Iba ak to vyzerá jasne"
              ],
              "explanation": "Aj čistá voda môže obsahovať nebezpečné baktérie a parazity. Vodu vždy varte aspoň 1 minútu alebo použite filter. Špinavá voda spôsobuje hnačku, choleru a týfus."
            },
            {
              "question": "Vaše dieťa má hnačku. Čo je najdôležitejšie?",
              "options": [
                "Zastavte všetko jedlo",
                "Podávajte veľa tekutín (voda, ORS)",
                "Podávajte antibiotiká"
              ],
              "explanation": "Dehydratácia z hnačky zabíja viac detí ako samotná hnačka. Podávajte perorálny rehydratačný roztok (ORS) alebo čistú vodu so štipkou soli a cukru. Nechajte deti dojčiť."
            },
            {
              "question": "Kedy by ste si mali umývať ruky?",
              "options": [
                "Iba pred jedlom",
                "Pred jedlom, po toalete, po dotyku zvierat, po kašli",
                "Len keď vyzerajú špinavé"
              ],
              "explanation": "Baktérie sú neviditeľné. Umyte si ruky: pred jedlom/varením, po použití toalety, po výmene plienok, po dotyku zvierat, po kašľaní/kýchnutí a po dotyku chorých ľudí."
            }
          ]
        }
      }
    },
    "rights": {
      "meta": {
        "title": "Poznajte svoje práva — Redi Health",
        "description": "Práva pacientov, pomoc pri diskriminácii a právne kontakty pre rómske komunity"
      },
      "title": "Poznajte svoje práva",
      "subtitle": "Ako pacient máte práva. Naučte sa ich. Použite ich.",
      "back": "Späť",
      "menu": {
        "patientRights": {
          "title": "Práva pacienta",
          "desc": "8 práv má každý pacient"
        },
        "discrimination": {
          "title": "Čeliť diskriminácii?",
          "desc": "Čo povedať a urobiť – krok za krokom"
        },
        "contacts": {
          "title": "Právna pomoc podľa krajiny",
          "desc": "Ombudsman, antidiskriminácia, rómske organizácie"
        }
      },
      "views": {
        "patientRights": "Vaše práva pacienta",
        "discrimination": "Ak čelíte diskriminácii",
        "discriminationDesc": "Skutočné situácie a presne to, čo povedať a urobiť.",
        "contacts": "Právna pomoc podľa krajiny"
      },
      "labels": {
        "sayThis": "Povedz toto:",
        "thenDo": "Potom urob toto:",
        "patientOmbudsman": "Ombudsman pre pacientov",
        "antiDiscrimination": "Anti-Discrimination",
        "romaRightsOrg": "Roma Rights Organization"
      },
      "rights": {
        "treatment": {
          "title": "Právo na núdzové ošetrenie",
          "description": "Každá nemocnica vás MUSÍ v prípade núdze ošetriť aj bez poistenia a dokladov. Toto je zákon v každej EU krajine. Ak odmietnu, opýtajte sa na meno lekára a nahláste to."
        },
        "information": {
          "title": "Právo porozumieť svojej diagnóze",
          "description": "Váš lekár vám musí vysvetliť váš stav slovami, ktorým rozumiete. Ak nerozumiete, povedzte: 'Môžete to vysvetliť jednoduchšie?' Môžete tiež požiadať o písomné zhrnutie."
        },
        "consent": {
          "title": "Právo povedať nie",
          "description": "Nikto vám nemôže nútiť liečbu. Pred akýmkoľvek zákrokom vám lekár musí vysvetliť, čo bude robiť, a vy musíte súhlasiť. Vždy môžete povedať 'Potrebujem čas na rozmyslenie.'"
        },
        "privacy": {
          "title": "Právo na súkromie",
          "description": "Vaše zdravotné informácie sú súkromné. Lekári ho bez vášho súhlasu nemôžu zdieľať s vaším zamestnávateľom, rodinou ani nikým iným. To zahŕňa váš stav HIV, tehotenstvo alebo duševné zdravie."
        },
        "interpreter": {
          "title": "Právo na tlmočníka",
          "description": "Ak neovládate dobre miestny jazyk, môžete požiadať o tlmočníka. Túto službu má veľa nemocníc. Ak nie, na preklad môžete priviesť niekoho, komu dôverujete."
        },
        "second-opinion": {
          "title": "Právo na druhý názor",
          "description": "Ak nesúhlasíte s diagnózou, môžete navštíviť iného lekára. Toto je vaše právo. Nemusíte vysvetľovať prečo."
        },
        "records": {
          "title": "Právo na vaše zdravotné záznamy",
          "description": "Kedykoľvek môžete požiadať o kópiu všetkých vašich zdravotných záznamov. Nemocnica ich musí poskytnúť. To je užitočné pri zmene lekára alebo pri sťahovaní do iného mesta."
        },
        "complaint": {
          "title": "Právo sťažovať sa",
          "description": "Ak sa cítite zle zaobchádzané alebo diskriminovaný, môžete podať sťažnosť. Každá nemocnica má svoj reklamačný poriadok. Môžete sa tiež obrátiť na ombudsmana pacientov vo vašej krajine."
        }
      },
      "scenarios": {
        "refused-treatment": {
          "situation": "Nemocnica vás odmieta liečiť",
          "whatToSay": "\"Mám právo na núdzové ošetrenie podľa zákona EU. Napíšte svoje meno a dôvod, prečo odmietate.\"",
          "whatToDo": [
            "Zostaňte pokojní, ale pevní",
            "Opýtajte sa na celé meno lekára",
            "Požiadajte o odmietnutie písomne",
            "Zavolajte ombudsmana pacientov",
            "Obráťte sa na organizáciu za práva Rómov"
          ]
        },
        "rude-staff": {
          "situation": "Nemocničný personál je hrubý alebo odmietavý kvôli vašej etnickej príslušnosti",
          "whatToSay": "\"Som tu pre lekársku pomoc. Očakávam, že sa ku mne budú správať s rovnakým rešpektom ako ku každému inému pacientovi.\"",
          "whatToDo": [
            "Požiadajte o rozhovor s vedúcou sestrou alebo vedúcim oddelenia",
            "Všimnite si dátum, čas a mená",
            "Podajte písomnú sťažnosť v nemocnici",
            "Správa národnému antidiskriminačnému orgánu"
          ]
        },
        "no-insurance": {
          "situation": "Nemáte zdravotné poistenie",
          "whatToSay": "\"Potrebujem lekársku pomoc. Aké mám možnosti pre nepoistených pacientov?\"",
          "whatToDo": [
            "Núdzová starostlivosť je vždy bezplatná – trvajte na tom",
            "Opýtajte sa na programy sociálnej pomoci",
            "Obráťte sa na zdravotného mediátora vo vašom okolí",
            "Mnohé mimovládne organizácie poskytujú bezplatné kliniky – opýtajte sa v nemocnici"
          ]
        },
        "language-barrier": {
          "situation": "Nemôžete komunikovať s lekárom",
          "whatToSay": "\"Potrebujem pomoc s porozumením. Môžete poskytnúť tlmočníka alebo hovoriť pomalšie?\"",
          "whatToDo": [
            "Pomocou tejto aplikácie môžete prekladať kľúčové frázy",
            "Priveďte dôveryhodnú osobu, ktorá ovláda daný jazyk",
            "Požiadajte o písomné pokyny, ktoré môžete preložiť neskôr",
            "Na preklad dokumentov použite fotoaparát telefónu"
          ]
        }
      },
      "contacts": {
        "romania": {
          "country": "Romania",
          "ombudsman": "Avocatul Poporului",
          "antiDiscrimination": "CNCD",
          "ombudsmanPhone": "021 312 7134",
          "antiDiscriminationPhone": "021 312 6578",
          "romaRightsOrg": "Romani CRISS"
        },
        "bulgaria": {
          "country": "Bulgaria",
          "ombudsman": "Ombudsman of Bulgaria",
          "antiDiscrimination": "Commission for Protection against Discrimination",
          "ombudsmanPhone": "02 810 6955",
          "romaRightsOrg": "Amalipe Center"
        },
        "hungary": {
          "country": "Hungary",
          "ombudsman": "Commissioner for Fundamental Rights",
          "antiDiscrimination": "Equal Treatment Authority",
          "ombudsmanPhone": "06 1 475 7100",
          "romaRightsOrg": "Romaversitas Foundation"
        },
        "slovakia": {
          "country": "Slovakia",
          "ombudsman": "Public Defender of Rights",
          "antiDiscrimination": "Slovak National Centre for Human Rights",
          "ombudsmanPhone": "02 4828 7401",
          "romaRightsOrg": "ETP Slovakia"
        },
        "czech-republic": {
          "country": "Czech Republic",
          "ombudsman": "Public Defender of Rights",
          "antiDiscrimination": "Office of the Public Defender",
          "ombudsmanPhone": "542 542 888",
          "romaRightsOrg": "Romea.cz"
        },
        "serbia": {
          "country": "Serbia",
          "ombudsman": "Protector of Citizens",
          "antiDiscrimination": "Commissioner for Equality",
          "ombudsmanPhone": "011 206 8100",
          "romaRightsOrg": "Praxis"
        },
        "albania": {
          "country": "Albania",
          "ombudsman": "People's Advocate",
          "antiDiscrimination": "Commissioner for Protection from Discrimination",
          "ombudsmanPhone": "042 380 300"
        },
        "north-macedonia": {
          "country": "North Macedonia",
          "ombudsman": "Ombudsman",
          "antiDiscrimination": "Commission for Prevention and Protection against Discrimination",
          "ombudsmanPhone": "02 3129 335"
        },
        "greece": {
          "country": "Greece",
          "ombudsman": "Greek Ombudsman",
          "antiDiscrimination": "Greek Ombudsman (Equal Treatment)",
          "ombudsmanPhone": "213 130 6600"
        },
        "croatia": {
          "country": "Croatia",
          "ombudsman": "Ombudswoman",
          "antiDiscrimination": "Ombudswoman",
          "ombudsmanPhone": "01 4851 855"
        }
      }
    },
    "stories": {
      "meta": {
        "title": "Komunitné príbehy — Redi Health",
        "description": "Skutočné zdravotné skúsenosti z rómskych komunít v celej Európe"
      },
      "title": "Komunitné príbehy",
      "subtitle": "Reálne skúsenosti z rómskych komunít. Učte sa od iných.",
      "backToStories": "Späť k príbehom",
      "lessonLearned": "Ponaučenie",
      "whatToDoNext": "Čo robiť ďalej",
      "categories": {
        "vaccines": "Vakcíny",
        "chronic": "Chronická choroba",
        "maternal": "Tehotenstvo",
        "discrimination": "práva",
        "prevention": "Prevencia",
        "mental": "Duševné zdravie"
      },
      "nextSteps": {
        "vaccineGuide": "Sprievodca vakcínou",
        "askZuvo": "Spýtaj sa Zuvo",
        "explainPrescription": "Vysvetlite predpis",
        "navigateToCare": "Prejdite do starostlivosti",
        "knowYourRights": "Poznajte svoje práva",
        "learnPrevention": "Naučte sa prevenciu",
        "checkSymptoms": "Skontrolujte príznaky",
        "learnMentalHealth": "Získajte informácie o duševnom zdraví"
      },
      "entries": {
        "maria-vaccines": {
          "name": "Maria",
          "age": "28",
          "country": "Rumunsko",
          "title": "Dcéru som skoro nedala zaočkovať",
          "story": "Moja svokra mi povedala, že vakcíny sú jed. Všetci v osade hovorili to isté. Keď sa mi narodila dcéra, mala som strach. Ale zdravotník prišiel k nám domov a všetko vysvetlil – ako vakcíny fungujú, aké sú v skutočnosti vedľajšie účinky. Ukázala mi fotky detí s osýpkami. Viac som sa bála choroby ako vakcíny. Moja dcéra dostala všetky vakcíny. Je zdravá a silná.",
          "lesson": "Porozprávajte sa so zdravotným mediátorom alebo lekárom skôr, ako sa rozhodnete na základe toho, čo hovoria ostatní. Vakcíny zachraňujú životy."
        },
        "stefan-diabetes": {
          "name": "Stefan",
          "age": "52",
          "country": "Bulharsko",
          "title": "Prestal som užívať lieky na cukrovku a takmer som zomrel",
          "story": "Diabetes typu 2 mi diagnostikovali na 45. Z lieku ma bolelo brucho, tak som ho prestal brať. Môj sused povedal, že škoricový čaj ma vylieči. 2 roky som namiesto toho pila škoricový čaj. Potom som jedného dňa skolaboval. Moja hladina cukru v krvi bola vyššia ako 500. Lekári povedali, že mám poškodené obličky. Teraz beriem lieky každý deň. Kiežby som nikdy neprestal.",
          "lesson": "Nikdy neprestaňte užívať liek bez toho, aby ste sa porozprávali so svojím lekárom. Prírodné lieky nemôžu nahradiť lieky na cukrovku."
        },
        "elena-pregnancy": {
          "name": "Elena",
          "age": "22",
          "country": "Srbsko",
          "title": "Moje prvé tehotenstvo — nevedela som, že môžem navštíviť lekára zadarmo",
          "story": "Keď som otehotnela v 19, 6 mesiacov som nebola u lekára. Nemal som poistenie a myslel som si, že to bude stáť príliš veľa. Zdravotná mediátorka mi povedala, že prenatálna starostlivosť je pre všetky tehotné ženy v Srbsku bezplatná. Pomohla mi zaregistrovať sa. Lekár zistil, že mám anémiu a vysoký krvný tlak. Keby som neodišla, moje dieťa mohlo byť v nebezpečenstve.",
          "lesson": "Prenatálna starostlivosť je vo väčšine európskych krajín bezplatná. Požiadajte zdravotného mediátora, aby vám pomohol s registráciou."
        },
        "janos-discrimination": {
          "name": "János",
          "age": "35",
          "country": "Maďarsko",
          "title": "Nemocnica sa ma pokúsila poslať preč",
          "story": "Išiel som na pohotovosť s bolesťou na hrudníku. Sestra sa na mňa pozrela a povedala 'Máme plno, choďte do inej nemocnice.' Vedel som, že to nie je správne. Povedal som: ‚Bolí ma hrudník. Musíte ma preskúmať. Prosím, povedzte mi svoje meno.“ Jej postoj sa okamžite zmenil. Vyšetrili ma a zistili, že mám problém so srdcom, ktorý si vyžaduje liečbu. Keby som odišiel, mohol som dostať infarkt.",
          "lesson": "Máte právo na núdzové ošetrenie. Ak sa vás niekto pokúsi odmietnuť, opýtajte sa ho na meno a povedzte, že poznáte svoje práva."
        },
        "ana-tb": {
          "name": "Ana",
          "age": "31",
          "country": "Slovensko",
          "title": "TB nie je rozsudok smrti – ale musíte dokončiť liek",
          "story": "Kašlala som mesiace. Myslel som si, že je to len prechladnutie. Keď som konečne išiel k lekárovi, povedali mi, že mám tuberkulózu. Bol som vystrašený - myslel som, že zomriem. Ale lekár vysvetlil, že TB sa dá vyliečiť 6-mesačným liekom. Najťažšie bolo brať tabletky každý deň po dobu 6 mesiacov, aj keď som sa po 2 mesiacoch cítila lepšie. Ale skončil som. som vyliečený.",
          "lesson": "Ak kašlete dlhšie ako 2 týždne, navštívte lekára. TB je liečiteľná, ale MUSÍTE dokončiť všetky lieky."
        },
        "mirela-depression": {
          "name": "Mirela",
          "age": "40",
          "country": "Severné Macedónsko",
          "title": "Depresia nie je slabosť - je to choroba",
          "story": "Po smrti môjho manžela som celé mesiace nemohla vstať z postele. Moja rodina povedala, že som lenivý. Povedali 'len buď silný.' Ale nemohol som. Zdravotnícky mediátor si všimol, že niečo nie je v poriadku a vzal ma k lekárovi. Lekár povedal, že mám depresiu - skutočný zdravotný stav. Začal som medicínu a rozprával som sa s poradcom. Pomaly som sa zlepšoval. Nie som slabý. Bolo mi zle.",
          "lesson": "Depresia je zdravotný stav, nie charakterová vada. Pomôcť môže medicína a poradenstvo. Požiadajte o pomoc."
        }
      }
    },
    "challenges": {
      "meta": {
        "title": "Výzvy — Redi Health",
        "description": "Komunitné výzvy"
      },
      "title": "Aktívne výzvy",
      "subtitle": "Pripojte sa k cieľom komunity a osobným výzvam a získajte bonusové XP a odznaky.",
      "types": {
        "community": "komunity",
        "personal": "osobné"
      },
      "daysLeft": "Zostáva {count} dní",
      "viewLeaderboard": "Zobraziť tabuľku výsledkov",
      "items": {
        "c1": {
          "title": "Šampión vedomostí o očkovaní",
          "description": "Získajte 50 študentov vo vašej oblasti, aby tento týždeň absolvovali modul vakcíny."
        },
        "c2": {
          "title": "7-dňový cyklus zdravia",
          "description": "Zaznamenajte svoju náladu a príjem vody 7 dní v rade."
        }
      }
    },
    "certificate": {
      "meta": {
        "title": "Certifikát — Redi Health",
        "description": "Národný certifikát zdravotnej gramotnosti"
      },
      "title": "Váš certifikát",
      "subtitle": "Máte za sebou Národnú etapu Študentskej akadémie zdravia.",
      "ofCompletion": "Osvedčenie o absolvovaní",
      "diplomaTitle": "Národná zdravotná gramotnosť",
      "awardedFor": "Udeľuje sa za dokončenie študijného programu Redi Health Student Academy.",
      "date": "Dátum",
      "downloadPdf": "Stiahnite si PDF",
      "share": "zdieľať",
      "gate": {
        "title": "Najprv dokončite Akadémiu",
        "description": "Ak chcete získať certifikát zdravotnej gramotnosti, musíte absolvovať všetky lekcie a prejsť kvízom na národnej úrovni Študentskej akadémie zdravia.",
        "cta": "Choďte do Akadémie"
      }
    }
  },
  "sl": {
    "healthQuiz": {
      "meta": {
        "title": "Zdravstveni kviz — Redi Health",
        "description": "Preizkusite svoje zdravstveno znanje z interaktivnimi kvizi"
      },
      "title": "Zdravstveni kviz",
      "subtitle": "Preizkusite svoje znanje. Naučite se nekaj novega.",
      "backToQuizzes": "Nazaj k kvizom",
      "seeResults": "Glej rezultate",
      "nextQuestion": "Naslednje vprašanje",
      "questionsCount": "{count} vprašanj",
      "results": {
        "perfect": "Popoln rezultat!",
        "great": "Odlično delo!",
        "good": "Dober trud!",
        "keepLearning": "Učite se naprej!",
        "score": "Dobili ste {score} od {total} pravilnih",
        "tryAgain": "poskusi ponovno",
        "moreQuizzes": "Več kvizov"
      },
      "quizzes": {
        "antibiotics": {
          "title": "Antibiotiki",
          "description": "Ali veste, kdaj uporabiti antibiotike?",
          "questions": [
            {
              "question": "Ali lahko antibiotiki pozdravijo gripo?",
              "options": [
                "ja",
                "št",
                "včasih"
              ],
              "explanation": "Gripo povzroča virus. Antibiotiki ubijajo samo bakterije. Jemanje antibiotikov za gripo ne pomaga in lahko oteži zdravljenje prihodnjih okužb."
            },
            {
              "question": "Po 3 dneh jemanja antibiotikov se počutite bolje. Bi moral prenehati?",
              "options": [
                "Da, ozdravljen si",
                "Ne, dokončaj celoten tečaj",
                "Vzemite polovico preostalih tablet"
              ],
              "explanation": "VEDNO končajte celoten tečaj. Če prenehate zgodaj, nekatere bakterije preživijo in postanejo odporne. Naslednjič isti antibiotik ne bo deloval."
            },
            {
              "question": "Ali lahko delite antibiotike z družinskim članom, ki ima podobne simptome?",
              "options": [
                "Da, prihrani denar",
                "Ne, nikoli",
                "Samo če gre za isto bolezen"
              ],
              "explanation": "Nikoli ne delite antibiotikov. Za različne okužbe so potrebna različna zdravila. Napačen antibiotik je lahko nevaren in ne bo pomagal."
            },
            {
              "question": "Kaj se zgodi, če prepogosto jemljete antibiotike?",
              "options": [
                "Nič slabega",
                "Vaše telo postane imuno na bolezni",
                "Bakterije postanejo odporne in jih je težje ubiti"
              ],
              "explanation": "Odpornost na antibiotike je globalna kriza. Ko bakterije postanejo odporne, lahko preproste okužbe postanejo smrtonosne. Antibiotike jemljite le, če jih predpiše zdravnik."
            }
          ]
        },
        "vaccines": {
          "title": "cepiva",
          "description": "Ločite dejstva od mitov",
          "questions": [
            {
              "question": "Ali cepiva povzročajo avtizem?",
              "options": [
                "ja",
                "št",
                "ne vemo"
              ],
              "explanation": "št. Ta mit je izhajal iz goljufive študije, ki je bila preklicana. Zdravnik, ki je to objavil, je izgubil zdravniško licenco. Na desetine študij z milijoni otrok dokazuje, da cepiva NE povzročajo avtizma."
            },
            {
              "question": "Ali je varno dati dojenčku več cepiv hkrati?",
              "options": [
                "Ne, preveč je",
                "Da, je varen in preizkušen",
                "Samo enega naenkrat"
              ],
              "explanation": "Imunski sistem dojenčkov se vsak dan spopade s tisočimi mikrobi. Kombinirana cepiva so temeljito testirana in varna. Zamujanje s cepivi pusti vašega otroka nezaščitenega."
            },
            {
              "question": "Moj otrok je rahlo prehlajen. Se še lahko cepijo?",
              "options": [
                "Ne, počakaj, dokler ne bo popolnoma zdrav",
                "Da, blag prehlad je v redu",
                "Samo z dovoljenjem zdravnika"
              ],
              "explanation": "Blag prehlad, nizka temperatura ali izcedek iz nosu NISO razlog za odložitev cepljenja. Samo huda bolezen zahteva odlog. Če niste prepričani, se posvetujte z zdravnikom."
            },
            {
              "question": "Ali cepiva vsebujejo nevarne kemikalije?",
              "options": [
                "Da, polni so toksinov",
                "Ne, vse sestavine so varne v majhnih uporabljenih količinah",
                "Nekateri da, nekateri ne"
              ],
              "explanation": "Sestavine cepiva so prisotne v majhnih, varnih količinah. Z materinim mlekom dobite več aluminija kot s cepivom. Vsaka sestavina je bila testirana glede varnosti."
            }
          ]
        },
        "diabetes": {
          "title": "Sladkorna bolezen",
          "description": "Razumevanje obvladovanja sladkorne bolezni",
          "questions": [
            {
              "question": "Je sladkorna bolezen posledica uživanja preveč sladkorja?",
              "options": [
                "ja",
                "Ne, bolj zapleteno je",
                "Samo tip 2"
              ],
              "explanation": "Sladkorno bolezen povzročajo genetika, življenjski slog in način, kako telo predeluje insulin. Uživanje sladkorja ga neposredno ne povzroča, vendar nezdrava prehrana in debelost povečata tveganje."
            },
            {
              "question": "Ali je mogoče sladkorno bolezen pozdraviti z naravnimi zdravili, kot je cimet?",
              "options": [
                "Da, cimet zdravi",
                "Ne, zdravila ni, vendar ga je mogoče obvladati",
                "Da, z dovolj česna in zelišč"
              ],
              "explanation": "Zdravila za sladkorno bolezen NI. Obvladujemo ga lahko z zdravili, zdravo hrano in telesno vadbo. Cimet ima lahko majhne koristi, vendar NE MORE nadomestiti zdravil. Ljudje, ki prenehajo jemati zdravila, končajo v bolnišnici."
            },
            {
              "question": "Oseba s sladkorno boleznijo ima vrtoglavico in se prepotuje. kaj naj narediš",
              "options": [
                "Dajte jim insulin",
                "Takoj jim dajte nekaj sladkega",
                "Reci jim, naj počivajo"
              ],
              "explanation": "To so znaki NIZKEGA krvnega sladkorja (hipoglikemije). Takoj jim dajte sok, sladkarije ali sladko vodo. To je lahko smrtno nevarno. Ko se počutijo bolje, morajo zaužiti ustrezen obrok."
            },
            {
              "question": "Kako pogosto naj si diabetik pregleduje stopala?",
              "options": [
                "Nikoli, noge so v redu",
                "vsak dan",
                "Enkrat na leto"
              ],
              "explanation": "Sladkorna bolezen lahko poškoduje živce v stopalih. Morda ne boste čutili ureznin ali ran. VSAK DAN preverite vaša stopala, ali so ure, žulji ali spremembe barve. Majhne rane lahko postanejo resne okužbe."
            }
          ]
        },
        "hygiene": {
          "title": "Higiena in preventiva",
          "description": "Osnovne zdravstvene navade, ki rešujejo življenja",
          "questions": [
            {
              "question": "Kako dolgo si morate umivati roke z milom?",
              "options": [
                "5 sekund",
                "Vsaj 20 sekund",
                "1 minuta"
              ],
              "explanation": "Umivajte se vsaj 20 sekund — približno toliko časa, kot je potrebno, da dvakrat zapojete 'Happy Birthday'. To odstrani večino mikrobov. Hitra izpiranja ne delujejo."
            },
            {
              "question": "Ali je varno piti vodo iz reke ali potoka?",
              "options": [
                "Da, naravna voda je čista",
                "Ne, vedno ga najprej zavrite ali filtrirajte",
                "Samo če je videti jasno"
              ],
              "explanation": "Tudi čista voda lahko vsebuje nevarne bakterije in parazite. Vodo vedno vrejte vsaj 1 minuto ali uporabite filter. Umazana voda povzroča drisko, kolero in tifus."
            },
            {
              "question": "Vaš otrok ima drisko. Kaj je najbolj pomembno?",
              "options": [
                "Ustavite vso hrano",
                "Dajte veliko tekočine (voda, ORS)",
                "Dajte antibiotike"
              ],
              "explanation": "Dehidracija zaradi driske ubije več otrok kot driska sama. Dajte peroralno rehidracijsko raztopino (ORS) ali čisto vodo s ščepcem soli in sladkorja. Nadaljujte z dojenjem."
            },
            {
              "question": "Kdaj si morate umiti roke?",
              "options": [
                "Samo pred jedjo",
                "Pred jedjo, po stranišču, po dotiku živali, po kašljanju",
                "Samo ko so videti umazani"
              ],
              "explanation": "Klice so nevidne. Umijte si roke: pred jedjo/kuho, po uporabi stranišča, po menjavi plenic, po dotiku živali, po kašljanju/kihanju in po dotiku bolnih ljudi."
            }
          ]
        }
      }
    },
    "rights": {
      "meta": {
        "title": "Spoznajte svoje pravice – Redi Health",
        "description": "Pacientove pravice, pomoč pri diskriminaciji in pravni stiki za romske skupnosti"
      },
      "title": "Spoznajte svoje pravice",
      "subtitle": "Kot bolnik imate pravice. Naučite se jih. Uporabite jih.",
      "back": "Nazaj",
      "menu": {
        "patientRights": {
          "title": "Pravice pacientov",
          "desc": "8 pravic, ki jih ima vsak bolnik"
        },
        "discrimination": {
          "title": "Se soočate z diskriminacijo?",
          "desc": "Kaj reči in narediti — korak za korakom"
        },
        "contacts": {
          "title": "Pravna pomoč po državah",
          "desc": "Varuh človekovih pravic, protidiskriminacija, romske organizacije"
        }
      },
      "views": {
        "patientRights": "Vaše pravice pacientov",
        "discrimination": "Če se soočate z diskriminacijo",
        "discriminationDesc": "Resnične situacije in kaj točno reči in narediti.",
        "contacts": "Pravna pomoč po državah"
      },
      "labels": {
        "sayThis": "Povej tole:",
        "thenDo": "Nato naredite to:",
        "patientOmbudsman": "Varuh bolnikovih pravic",
        "antiDiscrimination": "Anti-Discrimination",
        "romaRightsOrg": "Roma Rights Organization"
      },
      "rights": {
        "treatment": {
          "title": "Pravica do nujnega zdravljenja",
          "description": "Vsaka bolnišnica vas MORA zdraviti v nujnih primerih, tudi brez zavarovanja ali dokumentov. To je zakon v vsaki EU državi. Če zavrnejo, vprašajte za ime zdravnika in ga prijavite."
        },
        "information": {
          "title": "Pravica do razumevanja vaše diagnoze",
          "description": "Zdravnik vam mora pojasniti vaše stanje z besedami, ki jih razumete. Če ne razumete, recite: 'Ali lahko to razložiš bolj preprosto?' Zaprosite lahko tudi za pisni povzetek."
        },
        "consent": {
          "title": "Pravica reči ne",
          "description": "Nihče vam ne more vsiliti zdravljenja. Pred kakršnim koli posegom mora zdravnik pojasniti, kaj bo naredil, in vi se morate strinjati. Vedno lahko rečeš 'Potrebujem čas za razmislek.'"
        },
        "privacy": {
          "title": "Pravica do zasebnosti",
          "description": "Vaši zdravstveni podatki so zasebni. Zdravniki je brez vašega dovoljenja ne morejo deliti z vašim delodajalcem, družino ali komer koli drugim. To vključuje vaš status HIV, nosečnost ali duševno zdravje."
        },
        "interpreter": {
          "title": "Pravica do tolmača",
          "description": "Če ne govorite dobro lokalnega jezika, lahko zahtevate tolmača. Številne bolnišnice imajo to storitev. Če ne, lahko za prevod pripeljete nekoga, ki mu zaupate."
        },
        "second-opinion": {
          "title": "Pravica do drugega mnenja",
          "description": "Če se z diagnozo ne strinjate, lahko obiščete drugega zdravnika. To je vaša pravica. Ni vam treba razlagati zakaj."
        },
        "records": {
          "title": "Pravica do vaše zdravstvene kartoteke",
          "description": "Kadar koli lahko zahtevate kopijo vseh svojih zdravstvenih kartotek. Bolnišnica jih mora zagotoviti. To je uporabno pri menjavi zdravnika ali selitvi v drugo mesto."
        },
        "complaint": {
          "title": "Pravica do pritožbe",
          "description": "Če se počutite slabo ali diskriminirano, lahko vložite pritožbo. Vsaka bolnišnica ima pritožbeni postopek. Obrnete se lahko tudi na varuha bolnikovih pravic v vaši državi."
        }
      },
      "scenarios": {
        "refused-treatment": {
          "situation": "Bolnišnica te noče zdraviti",
          "whatToSay": "\"V skladu z zakonom EU imam pravico do nujnega zdravljenja. Prosim, zapišite svoje ime in razlog, zakaj zavračate.\"",
          "whatToDo": [
            "Ostanite mirni, a trdni",
            "Vprašajte zdravnikovo polno ime",
            "Zahtevajte zavrnitev pisno",
            "Pokličite varuha bolnikovih pravic",
            "Obrnite se na organizacijo za pravice Romov"
          ]
        },
        "rude-staff": {
          "situation": "Bolnišnično osebje je nesramno ali zaničljivo zaradi vaše etnične pripadnosti",
          "whatToSay": "\"Tukaj sem po zdravniško pomoč. Pričakujem, da me bodo obravnavali enako spoštljivo kot vsakega drugega pacienta.\"",
          "whatToDo": [
            "Prosite za pogovor z glavno medicinsko sestro ali vodjo oddelka",
            "Zabeležite si datum, uro in imena",
            "Vložite pisno pritožbo v bolnišnici",
            "Prijavite nacionalnemu organu za boj proti diskriminaciji"
          ]
        },
        "no-insurance": {
          "situation": "Nimate zdravstvenega zavarovanja",
          "whatToSay": "\"Potrebujem zdravniško pomoč. Kakšne so moje možnosti za nezavarovane bolnike?\"",
          "whatToDo": [
            "Nujna oskrba je vedno brezplačna - vztrajajte pri tem",
            "Povprašajte o programih socialne pomoči",
            "Obrnite se na zdravstvenega posrednika na vašem območju",
            "Številne nevladne organizacije nudijo brezplačne klinike – vprašajte v bolnišnici"
          ]
        },
        "language-barrier": {
          "situation": "Ne morete komunicirati z zdravnikom",
          "whatToSay": "\"Potrebujem pomoč pri razumevanju. Ali lahko zagotovite tolmača ali govorite počasneje?\"",
          "whatToDo": [
            "Uporabite to aplikacijo za prevajanje ključnih fraz",
            "Pripeljite zaupanja vredno osebo, ki govori jezik",
            "Prosite za pisna navodila, ki jih lahko prevedete pozneje",
            "Za prevajanje dokumentov uporabite kamero telefona"
          ]
        }
      },
      "contacts": {
        "romania": {
          "country": "Romania",
          "ombudsman": "Avocatul Poporului",
          "antiDiscrimination": "CNCD",
          "ombudsmanPhone": "021 312 7134",
          "antiDiscriminationPhone": "021 312 6578",
          "romaRightsOrg": "Romani CRISS"
        },
        "bulgaria": {
          "country": "Bulgaria",
          "ombudsman": "Ombudsman of Bulgaria",
          "antiDiscrimination": "Commission for Protection against Discrimination",
          "ombudsmanPhone": "02 810 6955",
          "romaRightsOrg": "Amalipe Center"
        },
        "hungary": {
          "country": "Hungary",
          "ombudsman": "Commissioner for Fundamental Rights",
          "antiDiscrimination": "Equal Treatment Authority",
          "ombudsmanPhone": "06 1 475 7100",
          "romaRightsOrg": "Romaversitas Foundation"
        },
        "slovakia": {
          "country": "Slovakia",
          "ombudsman": "Public Defender of Rights",
          "antiDiscrimination": "Slovak National Centre for Human Rights",
          "ombudsmanPhone": "02 4828 7401",
          "romaRightsOrg": "ETP Slovakia"
        },
        "czech-republic": {
          "country": "Czech Republic",
          "ombudsman": "Public Defender of Rights",
          "antiDiscrimination": "Office of the Public Defender",
          "ombudsmanPhone": "542 542 888",
          "romaRightsOrg": "Romea.cz"
        },
        "serbia": {
          "country": "Serbia",
          "ombudsman": "Protector of Citizens",
          "antiDiscrimination": "Commissioner for Equality",
          "ombudsmanPhone": "011 206 8100",
          "romaRightsOrg": "Praxis"
        },
        "albania": {
          "country": "Albania",
          "ombudsman": "People's Advocate",
          "antiDiscrimination": "Commissioner for Protection from Discrimination",
          "ombudsmanPhone": "042 380 300"
        },
        "north-macedonia": {
          "country": "North Macedonia",
          "ombudsman": "Ombudsman",
          "antiDiscrimination": "Commission for Prevention and Protection against Discrimination",
          "ombudsmanPhone": "02 3129 335"
        },
        "greece": {
          "country": "Greece",
          "ombudsman": "Greek Ombudsman",
          "antiDiscrimination": "Greek Ombudsman (Equal Treatment)",
          "ombudsmanPhone": "213 130 6600"
        },
        "croatia": {
          "country": "Croatia",
          "ombudsman": "Ombudswoman",
          "antiDiscrimination": "Ombudswoman",
          "ombudsmanPhone": "01 4851 855"
        }
      }
    },
    "stories": {
      "meta": {
        "title": "Zgodbe skupnosti – Redi Health",
        "description": "Resnične zdravstvene izkušnje romskih skupnosti po vsej Evropi"
      },
      "title": "Zgodbe skupnosti",
      "subtitle": "Resnične izkušnje iz romskih skupnosti. Učite se od drugih.",
      "backToStories": "Nazaj k zgodbam",
      "lessonLearned": "Naučena lekcija",
      "whatToDoNext": "Kaj storiti naprej",
      "categories": {
        "vaccines": "cepiva",
        "chronic": "Kronična bolezen",
        "maternal": "Nosečnost",
        "discrimination": "pravice",
        "prevention": "Preprečevanje",
        "mental": "Duševno zdravje"
      },
      "nextSteps": {
        "vaccineGuide": "Vodič po cepivih",
        "askZuvo": "Vprašaj Zuvo",
        "explainPrescription": "Pojasnite recept",
        "navigateToCare": "Navigacija do oskrbe",
        "knowYourRights": "Spoznajte svoje pravice",
        "learnPrevention": "Naučite se preventive",
        "checkSymptoms": "Preverite simptome",
        "learnMentalHealth": "Poučite se o duševnem zdravju"
      },
      "entries": {
        "maria-vaccines": {
          "name": "Maria",
          "age": "28",
          "country": "Romunija",
          "title": "Hčerke skoraj nisem cepila",
          "story": "Moja tašča mi je rekla, da so cepiva strupena. Vsi v naselju so rekli isto. Ko se je rodila moja hči, me je bilo strah. Toda zdravstvena mediatorka je prišla k nam domov in nam vse razložila — kako cepiva delujejo, kakšni so pravzaprav stranski učinki. Pokazala mi je fotografije otrok z ošpicami. Bolezen me je bilo strah kot cepiva. Moja hči je dobila vsa cepiva. Je zdrava in močna.",
          "lesson": "Pogovorite se z zdravstvenim posrednikom ali zdravnikom, preden se odločite na podlagi tega, kar pravijo drugi. Cepiva rešujejo življenja."
        },
        "stefan-diabetes": {
          "name": "Stefan",
          "age": "52",
          "country": "Bolgarija",
          "title": "Nehala sem jemati zdravila za sladkorno bolezen in skoraj umrla",
          "story": "Diabetes tipa 2 so mi diagnosticirali 45. Od zdravila me je bolel želodec, zato sem ga prenehala jemati. Soseda je rekla, da me bo ozdravil cimetov čaj. 2 leti sem namesto tega pila cimetov čaj. Potem sem se nekega dne zgrudil. Moj krvni sladkor je bil nad 500. Zdravniki so rekli, da so moje ledvice poškodovane. Zdaj zdravilo jemljem vsak dan. Želim si, da se ne bi nikoli ustavil.",
          "lesson": "Nikoli ne prenehajte jemati zdravila, ne da bi se posvetovali z zdravnikom. Naravna zdravila ne morejo nadomestiti zdravil za sladkorno bolezen."
        },
        "elena-pregnancy": {
          "name": "Elena",
          "age": "22",
          "country": "Srbija",
          "title": "Moja prva nosečnost — nisem vedela, da lahko obiščem zdravnika brezplačno",
          "story": "Ko sem zanosila pri 19, nisem bila 6 mesecev k zdravniku. Nisem imel zavarovanja in mislil sem, da bo preveč stalo. Zdravstvena mediatorka mi je povedala, da je predporodna oskrba brezplačna za vse nosečnice v Srbiji. Pomagala mi je pri registraciji. Zdravnik je ugotovil, da imam anemijo in visok krvni tlak. Če ne bi šla, bi bil moj otrok lahko v nevarnosti.",
          "lesson": "Predporodna oskrba je v večini evropskih držav brezplačna. Za pomoč pri prijavi prosite zdravstvenega posrednika."
        },
        "janos-discrimination": {
          "name": "János",
          "age": "35",
          "country": "Madžarska",
          "title": "Bolnišnica me je poskušala poslati stran",
          "story": "Šla sem na urgenco z bolečinami v prsih. Sestra me je pogledala in rekla: \"Smo polni, pojdi v drugo bolnišnico.\" Vedel sem, da to ni prav. Rekel sem: 'Imam bolečine v prsih. Morate me pregledati. Prosim povej mi svoje ime.' Njen odnos se je takoj spremenil. Pregledali so me in ugotovili, da imam težave s srcem, ki jih je treba zdraviti. Če bi odšel, bi lahko dobil srčni infarkt.",
          "lesson": "Pravico imate do nujnega zdravljenja. Če vas nekdo poskuša odvrniti, ga vprašajte za ime in recite, da poznate svoje pravice."
        },
        "ana-tb": {
          "name": "Ana",
          "age": "31",
          "country": "Slovaška",
          "title": "TB ni smrtna obsodba, vendar morate dokončati zdravilo",
          "story": "Mesece sem kašljala. Mislil sem, da je samo prehlad. Ko sem končno šel k zdravniku, so rekli, da imam tuberkulozo. Bil sem prestrašen - mislil sem, da bom umrl. Toda zdravnik je pojasnil, da se TB lahko pozdravi s 6-mesečnim zdravljenjem. Najtežje je bilo jemati tablete vsak dan 6 mesecev, tudi ko sem se po 2 mesecih počutila bolje. Ampak sem končal. ozdravljena sem.",
          "lesson": "Če kašljate več kot 2 tedna, obiščite zdravnika. TB je ozdravljiv, vendar MORATE popiti vsa zdravila."
        },
        "mirela-depression": {
          "name": "Mirela",
          "age": "40",
          "country": "Severna Makedonija",
          "title": "Depresija ni šibkost - je bolezen",
          "story": "Po moževi smrti več mesecev nisem mogla vstati iz postelje. Moja družina je rekla, da sem len. Rekli so 'samo bodi močan.' Ampak nisem mogel. Zdravstveni mediator je opazil, da nekaj ni v redu, in me odpeljal k zdravniku. Zdravnik je rekel, da imam depresijo – resnično zdravstveno stanje. Začel sem z medicino in se pogovarjal s svetovalcem. Počasi mi je šlo na bolje. Nisem šibek. bil sem bolan.",
          "lesson": "Depresija je zdravstveno stanje, ne karakterna pomanjkljivost. Zdravilo in svetovanje lahko pomagata. Prosim za pomoč."
        }
      }
    },
    "challenges": {
      "meta": {
        "title": "Izzivi — Redi Health",
        "description": "Izzivi skupnosti"
      },
      "title": "Aktivni izzivi",
      "subtitle": "Pridružite se ciljem skupnosti in osebnim izzivom, da pridobite dodatne XP in značke.",
      "types": {
        "community": "skupnosti",
        "personal": "osebno"
      },
      "daysLeft": "Še {count} dni",
      "viewLeaderboard": "Ogled lestvice najboljših",
      "items": {
        "c1": {
          "title": "Prvak v znanju o cepivih",
          "description": "Privabite 50 študentov v vašem lokalnem okolju, da ta teden opravijo modul o cepljenju."
        },
        "c2": {
          "title": "7-dnevni niz zdravja",
          "description": "Beležite svoje razpoloženje in vnos vode 7 dni zapored."
        }
      }
    },
    "certificate": {
      "meta": {
        "title": "Certifikat — Redi Health",
        "description": "Nacionalno potrdilo o zdravstveni pismenosti"
      },
      "title": "Vaše potrdilo",
      "subtitle": "Zaključili ste državni oder Študentske zdravstvene akademije.",
      "ofCompletion": "Potrdilo o zaključku",
      "diplomaTitle": "Nacionalna zdravstvena pismenost",
      "awardedFor": "Podeljeno za dokončanje učnega načrta Redi Health Student Academy.",
      "date": "Datum",
      "downloadPdf": "Prenesi PDF",
      "share": "Delite",
      "gate": {
        "title": "Najprej dokončajte akademijo",
        "description": "Če želite pridobiti certifikat zdravstvene pismenosti, morate opraviti vse lekcije in opraviti kviz na nacionalni stopnji Študentske zdravstvene akademije.",
        "cta": "Pojdi na Akademijo"
      }
    }
  },
  "sq": {
    "healthQuiz": {
      "meta": {
        "title": "Kuiz Shëndetësor — Redi Health",
        "description": "Testoni njohuritë tuaja shëndetësore me kuize interaktive"
      },
      "title": "Kuiz për shëndetin",
      "subtitle": "Testoni njohuritë tuaja. Mësoni diçka të re.",
      "backToQuizzes": "Kthehu te kuize",
      "seeResults": "Shihni rezultatet",
      "nextQuestion": "Pyetja e radhës",
      "questionsCount": "{count} pyetje",
      "results": {
        "perfect": "Rezultati perfekt!",
        "great": "Punë e madhe!",
        "good": "Përpjekje e mirë!",
        "keepLearning": "Vazhdoni të mësoni!",
        "score": "Ju morët {score} nga {total} të sakta",
        "tryAgain": "Provo sërish",
        "moreQuizzes": "Më shumë kuize"
      },
      "quizzes": {
        "antibiotics": {
          "title": "Antibiotikët",
          "description": "A e dini se kur duhet të përdorni antibiotikë?",
          "questions": [
            {
              "question": "A mund ta kurojnë gripin antibiotikët?",
              "options": [
                "po",
                "Nr",
                "Ndonjëherë"
              ],
              "explanation": "Gripi shkaktohet nga një virus. Antibiotikët vrasin vetëm bakteret. Marrja e antibiotikëve për gripin nuk bën asgjë dhe mund t'i bëjë infeksionet e ardhshme më të vështira për t'u trajtuar."
            },
            {
              "question": "Ndiheni më mirë pas 3 ditësh antibiotikë. A duhet të ndalosh?",
              "options": [
                "Po, ju jeni shëruar",
                "Jo, përfundoni kursin e plotë",
                "Merrni gjysmën e pilulave të mbetura"
              ],
              "explanation": "GJITHMONË përfundoni kursin e plotë. Nëse ndaloni herët, disa baktere mbijetojnë dhe bëhen rezistente. Herën tjetër, i njëjti antibiotik nuk do të funksionojë."
            },
            {
              "question": "A mund të ndani antibiotikë me një anëtar të familjes që ka simptoma të ngjashme?",
              "options": [
                "Po, kursen para",
                "Jo, kurrë",
                "Vetëm nëse është e njëjta sëmundje"
              ],
              "explanation": "Asnjëherë mos ndani antibiotikë. Infeksione të ndryshme kanë nevojë për ilaçe të ndryshme. Antibiotiku i gabuar mund të jetë i rrezikshëm dhe nuk do të ndihmojë."
            },
            {
              "question": "Çfarë ndodh nëse merrni antibiotikë shumë shpesh?",
              "options": [
                "Asgjë e keqe",
                "Trupi juaj bëhet imun ndaj sëmundjeve",
                "Bakteret bëhen rezistente dhe më të vështira për t'u vrarë"
              ],
              "explanation": "Rezistenca ndaj antibiotikëve është një krizë globale. Kur bakteret bëhen rezistente, infeksionet e thjeshta mund të bëhen vdekjeprurëse. Merrni antibiotikë vetëm kur i përshkruan mjeku."
            }
          ]
        },
        "vaccines": {
          "title": "Vaksinat",
          "description": "Ndani faktet nga mitet",
          "questions": [
            {
              "question": "A shkaktojnë vaksinat autizëm?",
              "options": [
                "po",
                "Nr",
                "Nuk e dimë"
              ],
              "explanation": "NR. Ky mit nisi nga një studim mashtrues që u tërhoq. Mjeku që e publikoi e humbi licencën mjekësore. Dhjetra studime me miliona fëmijë vërtetojnë se vaksinat NUK shkaktojnë autizëm."
            },
            {
              "question": "A është e sigurt për t'i dhënë një foshnje disa vaksina në të njëjtën kohë?",
              "options": [
                "Jo, është shumë",
                "Po, është i sigurt dhe i testuar",
                "Vetëm një nga një"
              ],
              "explanation": "Sistemi imunitar i foshnjave trajton mijëra mikrobe çdo ditë. Vaksinat e kombinuara janë testuar tërësisht dhe të sigurta. Vonesa e vaksinave e lë fëmijën tuaj të pambrojtur."
            },
            {
              "question": "Fëmija im ka një ftohje të lehtë. A mund të vaksinohen akoma?",
              "options": [
                "Jo, prisni derisa të jeni plotësisht të shëndetshëm",
                "Po, një ftohje e lehtë është mirë",
                "Vetëm me lejen e mjekut"
              ],
              "explanation": "Ftohja e lehtë, temperatura e ulët ose rrjedhja e hundës NUK është një arsye për të vonuar vaksinimin. Vetëm sëmundja e rëndë kërkon shtyrje. Pyesni mjekun tuaj nëse nuk jeni të sigurt."
            },
            {
              "question": "A përmbajnë vaksinat kimikate të rrezikshme?",
              "options": [
                "Po, ato janë plot me toksina",
                "Jo, të gjithë përbërësit janë të sigurt në sasi të vogla të përdorura",
                "Disa e bëjnë, disa jo"
              ],
              "explanation": "Përbërësit e vaksinës janë të pranishëm në sasi të vogla dhe të sigurta. Ju merrni më shumë alumin nga qumështi i gjirit sesa nga një vaksinë. Çdo përbërës është testuar për siguri."
            }
          ]
        },
        "diabetes": {
          "title": "Diabeti",
          "description": "Kuptimi i menaxhimit të diabetit",
          "questions": [
            {
              "question": "A shkaktohet diabeti nga ngrënia e tepërt e sheqerit?",
              "options": [
                "po",
                "Jo, është më komplekse",
                "Vetëm Lloji 2"
              ],
              "explanation": "Diabeti shkaktohet nga gjenetika, mënyra e jetesës dhe mënyra se si trupi juaj përpunon insulinën. Ngrënia e sheqerit nuk e shkakton drejtpërdrejt atë, por një dietë e pashëndetshme dhe obeziteti rrisin rrezikun."
            },
            {
              "question": "A mund të kurohet diabeti me ilaçe natyrale si kanella?",
              "options": [
                "Po, kanella e shëron",
                "Jo, nuk ka kurë, por mund të menaxhohet",
                "Po, me mjaft hudhra dhe barishte"
              ],
              "explanation": "Nuk ka kurë për diabetin. Mund të MENAXHET me ilaçe, ushqim të shëndetshëm dhe stërvitje. Kanella mund të ketë përfitime të vogla, por NUK MUND të zëvendësojë mjekimin. Njerëzit që ndalojnë mjekimin përfundojnë në spital."
            },
            {
              "question": "Një person diabetik ndihet i trullosur dhe i djersitur. Çfarë duhet të bëni?",
              "options": [
                "Jepini atyre insulinë",
                "Jepini atyre diçka të ëmbël menjëherë",
                "Thuaju të pushojnë"
              ],
              "explanation": "Këto janë shenja të sheqerit të ulët në gjak (hipoglicemia). Jepini menjëherë lëng, karamele ose ujë me sheqer. Kjo mund të jetë kërcënuese për jetën. Pasi të ndihen më mirë, duhet të hanë një vakt të duhur."
            },
            {
              "question": "Sa shpesh duhet të kontrollojë këmbët një diabetik?",
              "options": [
                "Asnjëherë, këmbët janë mirë",
                "Çdo ditë",
                "Një herë në vit"
              ],
              "explanation": "Diabeti mund të dëmtojë nervat në këmbët tuaja. Ju mund të mos ndjeni prerje ose plagë. Kontrolloni këmbët tuaja çdo ditë për prerje, flluska ose ndryshime ngjyrash. Plagët e vogla mund të bëhen infeksione serioze."
            }
          ]
        },
        "hygiene": {
          "title": "Higjiena dhe Parandalimi",
          "description": "Zakonet themelore shëndetësore që shpëtojnë jetë",
          "questions": [
            {
              "question": "Sa kohë duhet t'i lani duart me sapun?",
              "options": [
                "5 sekonda",
                "Të paktën 20 sekonda",
                "1 minutë"
              ],
              "explanation": "Lani për të paktën 20 sekonda - rreth kohës që duhet për të kënduar \"Happy Birthday\" dy herë. Kjo largon shumicën e mikrobeve. Shpëlarjet e shpejta nuk funksionojnë."
            },
            {
              "question": "A është e sigurt të pini ujë nga një lumë apo përrua?",
              "options": [
                "Po, uji natyral është i pastër",
                "Jo, gjithmonë ziejeni ose filtroni fillimisht",
                "Vetëm nëse duket qartë"
              ],
              "explanation": "Edhe uji i pastër mund të përmbajë baktere dhe parazitë të rrezikshëm. Gjithmonë zieni ujin për të paktën 1 minutë ose përdorni një filtër. Uji i ndotur shkakton diarre, kolerë dhe tifo."
            },
            {
              "question": "Fëmija juaj ka diarre. Cila është gjëja më e rëndësishme?",
              "options": [
                "Ndaloni të gjitha ushqimet",
                "Jepni shumë lëngje (ujë, ORS)",
                "Jepni antibiotikë"
              ],
              "explanation": "Dehidratimi nga diarreja vret më shumë fëmijë sesa vetë diarreja. Jepni tretësirë ​​rehidrimi oral (ORS) ose ujë të pastër me pak kripë dhe sheqer. Mbani foshnjat me gji."
            },
            {
              "question": "Kur duhet të lani duart?",
              "options": [
                "Vetëm para se të hahet",
                "Para ngrënies, pas tualetit, pas prekjes së kafshëve, pas kollitjes",
                "Vetëm kur duken të pista"
              ],
              "explanation": "Mikrobet janë të padukshëm. Lani duart: para ngrënies/gatimit, pas përdorimit të tualetit, pas ndërrimit të pelenave, pasi prekni kafshët, pasi kolliteni/teshtitni dhe pasi prekni njerëzit e sëmurë."
            }
          ]
        }
      }
    },
    "rights": {
      "meta": {
        "title": "Njihni të drejtat tuaja - Shëndeti Redi",
        "description": "Të drejtat e pacientëve, ndihma për diskriminimin dhe kontaktet ligjore për komunitetet rome"
      },
      "title": "Njihni të drejtat tuaja",
      "subtitle": "Ju keni të drejta si pacient. Mësoni ato. Përdorni ato.",
      "back": "Mbrapa",
      "menu": {
        "patientRights": {
          "title": "Të drejtat e pacientit",
          "desc": "8 të drejta që ka çdo pacient"
        },
        "discrimination": {
          "title": "Duke u përballur me diskriminimin?",
          "desc": "Çfarë të thuash dhe të bësh - hap pas hapi"
        },
        "contacts": {
          "title": "Ndihmë Ligjore sipas Vendit",
          "desc": "Avokati i Popullit, Antidiskriminimi, Organizatat Rome"
        }
      },
      "views": {
        "patientRights": "Të drejtat e pacientit tuaj",
        "discrimination": "Nëse përballeni me diskriminim",
        "discriminationDesc": "Situata reale dhe saktësisht çfarë të thuash dhe të bësh.",
        "contacts": "Ndihmë Ligjore sipas Vendit"
      },
      "labels": {
        "sayThis": "Thuaj këtë:",
        "thenDo": "Pastaj bëni këtë:",
        "patientOmbudsman": "Avokati i Popullit për pacientët",
        "antiDiscrimination": "Anti-Discrimination",
        "romaRightsOrg": "Roma Rights Organization"
      },
      "rights": {
        "treatment": {
          "title": "E drejta për trajtim urgjent",
          "description": "Çdo spital DUHET t'ju trajtojë në raste urgjence, edhe pa sigurim apo dokumente. Ky është ligj në çdo vend EU. Nëse ata refuzojnë, kërkoni emrin e mjekut dhe raportoni atë."
        },
        "information": {
          "title": "E drejta për të kuptuar diagnozën tuaj",
          "description": "Mjeku juaj duhet të shpjegojë gjendjen tuaj me fjalë që kuptoni. Nëse nuk kuptoni, thoni: 'A mund ta shpjegoni këtë më thjeshtë?' Ju gjithashtu mund të kërkoni një përmbledhje me shkrim."
        },
        "consent": {
          "title": "E drejta për të thënë jo",
          "description": "Askush nuk mund t'ju detyrojë trajtim. Para çdo procedure, mjeku duhet të shpjegojë se çfarë do të bëjë dhe ju duhet të bini dakord. Gjithmonë mund të thuash 'Më duhet kohë për të menduar.'"
        },
        "privacy": {
          "title": "E drejta për privatësi",
          "description": "Informacioni juaj mjekësor është privat. Mjekët nuk mund ta ndajnë atë me punëdhënësin, familjen ose dikë tjetër pa lejen tuaj. Kjo përfshin statusin tuaj HIV, shtatzëninë ose shëndetin mendor."
        },
        "interpreter": {
          "title": "E drejta për një përkthyes",
          "description": "Nëse nuk e flisni mirë gjuhën vendase, mund të kërkoni një përkthyes. Shumë spitale e kanë këtë shërbim. Nëse jo, mund të sillni dikë që keni besim për të përkthyer."
        },
        "second-opinion": {
          "title": "E drejta për një mendim të dytë",
          "description": "Nëse nuk jeni dakord me një diagnozë, mund të shihni një mjek tjetër. Kjo është e drejta juaj. Nuk keni nevojë të shpjegoni pse."
        },
        "records": {
          "title": "E drejta për të dhënat tuaja mjekësore",
          "description": "Ju mund të kërkoni një kopje të të gjitha të dhënave tuaja mjekësore në çdo kohë. Spitali duhet t'i sigurojë ato. Kjo është e dobishme kur ndryshoni mjekë ose lëvizni në një qytet tjetër."
        },
        "complaint": {
          "title": "E drejta për t'u ankuar",
          "description": "Nëse ndiheni të keqtrajtuar ose të diskriminuar, mund të bëni një ankesë. Çdo spital ka një procedurë ankesash. Ju gjithashtu mund të kontaktoni ombudsmenin e pacientëve në vendin tuaj."
        }
      },
      "scenarios": {
        "refused-treatment": {
          "situation": "Spitali refuzon t'ju trajtojë",
          "whatToSay": "\"Unë kam të drejtën për trajtim urgjent sipas ligjit EU. Ju lutemi shkruani emrin tuaj dhe arsyen që po refuzoni.\"",
          "whatToDo": [
            "Qëndroni të qetë, por të vendosur",
            "Kërkoni emrin e plotë të mjekut",
            "Kërkoni refuzimin me shkrim",
            "Thirrni ombudsmenin e pacientit",
            "Kontaktoni një organizatë për të drejtat e romëve"
          ]
        },
        "rude-staff": {
          "situation": "Stafi i spitalit është i pasjellshëm ose shpërfillës për shkak të përkatësisë suaj etnike",
          "whatToSay": "\"Unë jam këtu për ndihmë mjekësore. Pres të trajtohem me të njëjtin respekt si çdo pacient tjetër.\"",
          "whatToDo": [
            "Kërkoni të flisni me kryeinfermieren ose shefin e departamentit",
            "Vini re datën, orën dhe emrat",
            "Paraqisni një ankesë me shkrim në spital",
            "Raportoni në organin kombëtar kundër diskriminimit"
          ]
        },
        "no-insurance": {
          "situation": "Ju nuk keni sigurim shëndetësor",
          "whatToSay": "\"Kam nevojë për ndihmë mjekësore. Cilat janë opsionet e mia për pacientët e pasiguruar?\"",
          "whatToDo": [
            "Kujdesi urgjent është gjithmonë falas - insistoni në të",
            "Pyesni për programet e ndihmës sociale",
            "Kontaktoni një ndërmjetës shëndetësor në zonën tuaj",
            "Shumë OJQ ofrojnë klinika falas — pyesni në spital"
          ]
        },
        "language-barrier": {
          "situation": "Nuk mund të komunikosh me mjekun",
          "whatToSay": "\"Kam nevojë për ndihmë për të kuptuar. A mund të jepni një përkthyes apo të flisni më ngadalë?\"",
          "whatToDo": [
            "Përdorni këtë aplikacion për të përkthyer frazat kryesore",
            "Sillni një person të besuar që flet gjuhën",
            "Kërkoni udhëzime me shkrim që mund t'i përktheni më vonë",
            "Përdorni kamerën e telefonit tuaj për të përkthyer dokumente"
          ]
        }
      },
      "contacts": {
        "romania": {
          "country": "Romania",
          "ombudsman": "Avocatul Poporului",
          "antiDiscrimination": "CNCD",
          "ombudsmanPhone": "021 312 7134",
          "antiDiscriminationPhone": "021 312 6578",
          "romaRightsOrg": "Romani CRISS"
        },
        "bulgaria": {
          "country": "Bulgaria",
          "ombudsman": "Ombudsman of Bulgaria",
          "antiDiscrimination": "Commission for Protection against Discrimination",
          "ombudsmanPhone": "02 810 6955",
          "romaRightsOrg": "Amalipe Center"
        },
        "hungary": {
          "country": "Hungary",
          "ombudsman": "Commissioner for Fundamental Rights",
          "antiDiscrimination": "Equal Treatment Authority",
          "ombudsmanPhone": "06 1 475 7100",
          "romaRightsOrg": "Romaversitas Foundation"
        },
        "slovakia": {
          "country": "Slovakia",
          "ombudsman": "Public Defender of Rights",
          "antiDiscrimination": "Slovak National Centre for Human Rights",
          "ombudsmanPhone": "02 4828 7401",
          "romaRightsOrg": "ETP Slovakia"
        },
        "czech-republic": {
          "country": "Czech Republic",
          "ombudsman": "Public Defender of Rights",
          "antiDiscrimination": "Office of the Public Defender",
          "ombudsmanPhone": "542 542 888",
          "romaRightsOrg": "Romea.cz"
        },
        "serbia": {
          "country": "Serbia",
          "ombudsman": "Protector of Citizens",
          "antiDiscrimination": "Commissioner for Equality",
          "ombudsmanPhone": "011 206 8100",
          "romaRightsOrg": "Praxis"
        },
        "albania": {
          "country": "Albania",
          "ombudsman": "People's Advocate",
          "antiDiscrimination": "Commissioner for Protection from Discrimination",
          "ombudsmanPhone": "042 380 300"
        },
        "north-macedonia": {
          "country": "North Macedonia",
          "ombudsman": "Ombudsman",
          "antiDiscrimination": "Commission for Prevention and Protection against Discrimination",
          "ombudsmanPhone": "02 3129 335"
        },
        "greece": {
          "country": "Greece",
          "ombudsman": "Greek Ombudsman",
          "antiDiscrimination": "Greek Ombudsman (Equal Treatment)",
          "ombudsmanPhone": "213 130 6600"
        },
        "croatia": {
          "country": "Croatia",
          "ombudsman": "Ombudswoman",
          "antiDiscrimination": "Ombudswoman",
          "ombudsmanPhone": "01 4851 855"
        }
      }
    },
    "stories": {
      "meta": {
        "title": "Tregime Komuniteti - Shëndeti Redi",
        "description": "Përvoja reale shëndetësore nga komunitetet rome në të gjithë Evropën"
      },
      "title": "Histori Komuniteti",
      "subtitle": "Përvoja reale nga komunitetet rome. Mësoni nga të tjerët.",
      "backToStories": "Kthehu tek historitë",
      "lessonLearned": "Mësimi i nxjerrë",
      "whatToDoNext": "Çfarë duhet bërë më pas",
      "categories": {
        "vaccines": "Vaksinat",
        "chronic": "Sëmundje kronike",
        "maternal": "Shtatzënia",
        "discrimination": "Të drejtat",
        "prevention": "Parandalimi",
        "mental": "Shëndeti Mendor"
      },
      "nextSteps": {
        "vaccineGuide": "Udhëzues për vaksinat",
        "askZuvo": "Pyete Zuvo",
        "explainPrescription": "Shpjegoni recetën",
        "navigateToCare": "Navigoni drejt kujdesit",
        "knowYourRights": "Njihni të drejtat tuaja",
        "learnPrevention": "Mësoni parandalimin",
        "checkSymptoms": "Kontrolloni simptomat",
        "learnMentalHealth": "Mësoni për shëndetin mendor"
      },
      "entries": {
        "maria-vaccines": {
          "name": "Maria",
          "age": "28",
          "country": "Rumania",
          "title": "Unë pothuajse nuk e vaksinova vajzën time",
          "story": "Vjehrra më tha se vaksinat janë helm. Të gjithë në vendbanim thanë të njëjtën gjë. Kur lindi vajza ime, u tremba. Por ndërmjetësi shëndetësor erdhi në shtëpinë tonë dhe na shpjegoi gjithçka - si funksionojnë vaksinat, cilat janë në të vërtetë efektet anësore. Ajo më tregoi foto të fëmijëve me fruth. Unë kisha më shumë frikë nga sëmundja sesa nga vaksina. Vajza ime mori të gjitha vaksinat e saj. Ajo është e shëndetshme dhe e fortë.",
          "lesson": "Flisni me një ndërmjetës shëndetësor ose mjek përpara se të merrni vendime bazuar në atë që thonë të tjerët. Vaksinat shpëtojnë jetë."
        },
        "stefan-diabetes": {
          "name": "Stefan",
          "age": "52",
          "country": "Bullgaria",
          "title": "E ndërpreva mjekimin për diabetin dhe për pak sa nuk vdiqa",
          "story": "Unë u diagnostikova me diabet të tipit 2 në 45. Ilaçi më dhimbte stomakun, ndaj e ndërpreva. Fqinji im tha se çaji i kanellës do të më shëronte. Për 2 vjet kam pirë çaj kanelle në vend të saj. Pastaj një ditë u rrëzova. Sheqeri im në gjak ishte mbi 500. Mjekët më thanë se veshkat më ishin dëmtuar. Tani i marr ilaçet çdo ditë. Do të doja të mos kisha ndalur kurrë.",
          "lesson": "Asnjëherë mos e ndaloni mjekimin pa folur me mjekun tuaj. Ilaçet natyrale nuk mund të zëvendësojnë mjekimin e diabetit."
        },
        "elena-pregnancy": {
          "name": "Elena",
          "age": "22",
          "country": "Serbisë",
          "title": "Shtatzënia ime e parë - nuk e dija se mund të vizitoja një mjek falas",
          "story": "Kur mbeta shtatzënë në 19, nuk shkova te mjeku për 6 muaj. Nuk kisha sigurim dhe mendova se do të kushtonte shumë. Një ndërmjetës shëndetësor më tha se kujdesi prenatal është falas për të gjitha gratë shtatzëna në Serbi. Ajo më ndihmoi të regjistrohesha. Mjeku zbuloi se kisha anemi dhe tension të lartë. Nëse nuk do të kisha shkuar, fëmija im mund të ishte në rrezik.",
          "lesson": "Kujdesi prenatal është falas në shumicën e vendeve evropiane. Kërkoni nga një ndërmjetës shëndetësor t'ju ndihmojë të regjistroheni."
        },
        "janos-discrimination": {
          "name": "János",
          "age": "35",
          "country": "Hungaria",
          "title": "Spitali u përpoq të më largonte",
          "story": "Shkova në urgjencë me dhimbje gjoksi. Infermierja më shikoi dhe më tha 'Jemi ngopur, shkoni në një spital tjetër'. E dija që kjo nuk ishte e drejtë. I thashë: 'Kam dhimbje gjoksi. Duhet të më ekzaminosh. Ju lutem më jepni emrin tuaj.' Qëndrimi i saj ndryshoi menjëherë. Ata më ekzaminuan dhe zbuluan se kisha një problem me zemrën që kërkonte trajtim. Nëse do të isha larguar, mund të kisha pasur një atak në zemër.",
          "lesson": "Ju keni të drejtën për trajtim urgjent. Nëse dikush përpiqet t'ju largojë, kërkoni emrin e tij dhe thoni se i dini të drejtat tuaja."
        },
        "ana-tb": {
          "name": "Ana",
          "age": "31",
          "country": "Sllovakia",
          "title": "TB nuk është një dënim me vdekje - por ju duhet të përfundoni ilaçin",
          "story": "Unë kollitja për muaj të tërë. Mendova se ishte thjesht një i ftohtë. Kur më në fund shkova te mjeku, më thanë se kisha tuberkuloz. Isha i tmerruar - mendova se do të vdisja. Por mjeku shpjegoi se TB mund të shërohet me 6 muaj ilaçe. Pjesa më e vështirë ishte marrja e pilulave çdo ditë për 6 muaj, edhe kur u ndjeva më mirë pas 2 muajsh. Por mbarova. jam kuruar.",
          "lesson": "Nëse kolliteni për më shumë se 2 javë, shkoni te mjeku. TB është i shërueshëm, por ju DUHET të përfundoni të gjithë ilaçin."
        },
        "mirela-depression": {
          "name": "Mirela",
          "age": "40",
          "country": "Maqedonia e Veriut",
          "title": "Depresioni nuk është dobësi - është një sëmundje",
          "story": "Pasi më vdiq burri, nuk mund të ngrihesha nga shtrati për muaj të tërë. Familja ime tha se isha dembel. Ata thanë 'vetëm bëhu i fortë'. Por nuk munda. Një ndërmjetës shëndetësor vuri re se diçka nuk ishte në rregull dhe më çoi te një mjek. Doktori tha se kisha depresion - një gjendje e vërtetë mjekësore. Fillova mjekimin dhe fola me një këshilltar. Ngadalë, u bëra më mirë. Unë nuk jam i dobët. isha i sëmurë.",
          "lesson": "Depresioni është një gjendje mjekësore, jo një e metë karakteri. Mjekësia dhe këshillimi mund të ndihmojnë. Ju lutemi kërkoni ndihmë."
        }
      }
    },
    "challenges": {
      "meta": {
        "title": "Sfidat — Shëndeti Redi",
        "description": "Sfidat e Komunitetit"
      },
      "title": "Sfidat Aktive",
      "subtitle": "Bashkohuni me qëllimet e komunitetit dhe sfidat personale për të fituar bonus XP dhe distinktivë.",
      "types": {
        "community": "komunitetit",
        "personal": "personale"
      },
      "daysLeft": "{count} ditë të mbetura",
      "viewLeaderboard": "Shiko tabelën e drejtuesve",
      "items": {
        "c1": {
          "title": "Kampion i njohurive për vaksinat",
          "description": "Merrni 50 studentë në zonën tuaj lokale për të kaluar modulin e vaksinës këtë javë."
        },
        "c2": {
          "title": "Rrjedha shëndetësore 7-ditore",
          "description": "Regjistroni gjendjen shpirtërore dhe marrjen e ujit për 7 ditë rresht."
        }
      }
    },
    "certificate": {
      "meta": {
        "title": "Certifikata — Redi Health",
        "description": "Certifikata Kombëtare e Alfabetizmit Shëndetësor"
      },
      "title": "Certifikata juaj",
      "subtitle": "Ju keni përfunduar Fazën Kombëtare të Akademisë së Shëndetit Studentor.",
      "ofCompletion": "Certifikata e Përfundimit",
      "diplomaTitle": "Alfabetizmi Kombëtar i Shëndetit",
      "awardedFor": "Shpërblyer për plotësimin e kurrikulës së Akademisë Studentore të Shëndetit Redi.",
      "date": "Data",
      "downloadPdf": "Shkarkoni PDF",
      "share": "Shpërndaje",
      "gate": {
        "title": "Përfundoni së pari Akademinë",
        "description": "Për të fituar Certifikatën e Alfabetizmit Shëndetësor, duhet të përfundoni të gjitha mësimet dhe të kaloni kuizin në fazën Kombëtare të Akademisë së Shëndetit Studentor.",
        "cta": "Shkoni në Akademi"
      }
    }
  },
  "sr": {
    "healthQuiz": {
      "meta": {
        "title": "Квиз здравља — Реди Хеалтх",
        "description": "Тестирајте своје здравствено знање помоћу интерактивних квизова"
      },
      "title": "Хеалтх Куиз",
      "subtitle": "Тестирајте своје знање. Научите нешто ново.",
      "backToQuizzes": "Назад на квизове",
      "seeResults": "Погледајте резултате",
      "nextQuestion": "Следеће питање",
      "questionsCount": "{цоунт} питања",
      "results": {
        "perfect": "Савршен резултат!",
        "great": "Одличан посао!",
        "good": "Добар труд!",
        "keepLearning": "Наставите са учењем!",
        "score": "Добили сте {сцоре} од {тотал} тачних",
        "tryAgain": "Покушајте поново",
        "moreQuizzes": "Још квизова"
      },
      "quizzes": {
        "antibiotics": {
          "title": "Антибиотици",
          "description": "Да ли знате када треба користити антибиотике?",
          "questions": [
            {
              "question": "Могу ли антибиотици излечити грип?",
              "options": [
                "Да",
                "бр",
                "Понекад"
              ],
              "explanation": "Грип изазива вирус. Антибиотици убијају само бактерије. Узимање антибиотика за грип не чини ништа и може отежати лечење будућих инфекција."
            },
            {
              "question": "Осећате се боље након 3 дана антибиотика. Треба ли престати?",
              "options": [
                "Да, излечени сте",
                "Не, заврши цео курс",
                "Узми половину преосталих пилула"
              ],
              "explanation": "УВЕК завршите цео курс. Ако престанете рано, неке бактерије преживе и постану отпорне. Следећи пут, исти антибиотик неће радити."
            },
            {
              "question": "Да ли можете да делите антибиотике са чланом породице који има сличне симптоме?",
              "options": [
                "Да, штеди новац",
                "Не, никад",
                "Само ако је у питању иста болест"
              ],
              "explanation": "Никада не делите антибиотике. За различите инфекције су потребни различити лекови. Погрешан антибиотик може бити опасан и неће помоћи."
            },
            {
              "question": "Шта се дешава ако превише често узимате антибиотике?",
              "options": [
                "Ништа лоше",
                "Ваше тело постаје имуно на болест",
                "Бактерије постају отпорне и теже их је убити"
              ],
              "explanation": "Отпорност на антибиотике је глобална криза. Када бактерије постану отпорне, једноставне инфекције могу постати смртоносне. Узимајте антибиотике само када их лекар препише."
            }
          ]
        },
        "vaccines": {
          "title": "Вакцине",
          "description": "Одвојите чињенице од митова",
          "questions": [
            {
              "question": "Да ли вакцине изазивају аутизам?",
              "options": [
                "Да",
                "бр",
                "Не знамо"
              ],
              "explanation": "НО. Овај мит је започео из лажне студије која је повучена. Лекар који га је објавио изгубио је лекарску лиценцу. Десетине студија са милионима деце доказују да вакцине НЕ изазивају аутизам."
            },
            {
              "question": "Да ли је безбедно дати беби више вакцина одједном?",
              "options": [
                "Не, то је превише",
                "Да, безбедно је и тестирано",
                "Само један по један"
              ],
              "explanation": "Имуни систем беба свакодневно се носи са хиљадама микроба. Комбиноване вакцине су темељно тестиране и безбедне. Одлагање вакцинације оставља ваше дете незаштићеним."
            },
            {
              "question": "Моје дете има благу прехладу. Могу ли и даље да се вакцинишу?",
              "options": [
                "Не, сачекајте док не будете потпуно здрави",
                "Да, блага прехлада је у реду",
                "Само уз дозволу лекара"
              ],
              "explanation": "Блага прехлада, ниска температура или цурење из носа НИСУ разлог за одлагање вакцинације. Само тешка болест захтева одлагање. Питајте свог доктора ако нисте сигурни."
            },
            {
              "question": "Да ли вакцине садрже опасне хемикалије?",
              "options": [
                "Да, пуни су токсина",
                "Не, сви састојци су безбедни у малим количинама које се користе",
                "Неки то раде, неки не"
              ],
              "explanation": "Састојци вакцине су присутни у малим, сигурним количинама. Добијате више алуминијума из мајчиног млека него из вакцине. Сваки састојак је тестиран на безбедност."
            }
          ]
        },
        "diabetes": {
          "title": "дијабетеса",
          "description": "Разумевање управљања дијабетесом",
          "questions": [
            {
              "question": "Да ли је дијабетес узрокован уносом превише шећера?",
              "options": [
                "Да",
                "Не, сложеније је",
                "Само тип 2"
              ],
              "explanation": "Дијабетес је узрокован генетиком, начином живота и начином на који ваше тело обрађује инсулин. Конзумирање шећера га не узрокује директно, али нездрава исхрана и гојазност повећавају ризик."
            },
            {
              "question": "Може ли се дијабетес излечити природним лековима попут цимета?",
              "options": [
                "Да, цимет то лечи",
                "Не, не постоји лек, али се њиме може управљати",
                "Да, са довољно белог лука и зачинског биља"
              ],
              "explanation": "НЕМА лека за дијабетес. Њиме се може управљати лековима, здравом храном и вежбањем. Цимет може имати мале користи, али НЕ МОЖЕ да замени лекове. Људи који престану да узимају лек завршавају у болници."
            },
            {
              "question": "Особа са дијабетесом осећа вртоглавицу и знојење. Шта треба да урадите?",
              "options": [
                "Дајте им инсулин",
                "Одмах им дајте нешто слатко",
                "Реци им да се одморе"
              ],
              "explanation": "Ово су знаци НИСКОГ шећера у крви (хипогликемија). Одмах им дајте сок, бомбоне или воду са шећером. Ово може бити опасно по живот. Након што се осећају боље, требало би да једу одговарајући оброк."
            },
            {
              "question": "Колико често дијабетичар треба да проверава своја стопала?",
              "options": [
                "Никада, стопала су у реду",
                "Сваки дан",
                "Једном годишње"
              ],
              "explanation": "Дијабетес може оштетити нерве у стопалима. Можда нећете осетити посекотине или ране. Проверавајте своја стопала СВАКИ ДАН да ли има посекотина, пликова или промена боје. Мале ране могу постати озбиљне инфекције."
            }
          ]
        },
        "hygiene": {
          "title": "Хигијена и превенција",
          "description": "Основне здравствене навике које спашавају животе",
          "questions": [
            {
              "question": "Колико дуго треба да перете руке сапуном?",
              "options": [
                "5 секунди",
                "Најмање 20 секунди",
                "1 минут"
              ],
              "explanation": "Перите се најмање 20 секунди — отприлике онолико колико је потребно да отпевате „Срећан рођендан“ двапут. Ово уклања већину клица. Брза испирања не раде."
            },
            {
              "question": "Да ли је безбедно пити воду из реке или потока?",
              "options": [
                "Да, природна вода је чиста",
                "Не, увек прво прокувајте или филтрирајте",
                "Само ако изгледа јасно"
              ],
              "explanation": "Чак и чиста вода може садржати опасне бактерије и паразите. Увек кувајте воду најмање 1 минут или користите филтер. Прљава вода изазива дијареју, колеру и тифус."
            },
            {
              "question": "Ваше дете има дијареју. Шта је најважније?",
              "options": [
                "Зауставите сву храну",
                "Дајте пуно течности (вода, ОРС)",
                "Дајте антибиотике"
              ],
              "explanation": "Дехидрација од дијареје убија више деце него сама дијареја. Дајте орални раствор за рехидратацију (ОРС) или чисту воду са прстохватом соли и шећера. Наставите да дојите бебе."
            },
            {
              "question": "Када треба да оперете руке?",
              "options": [
                "Само пре јела",
                "Пре јела, после тоалета, након додиривања животиња, после кашља",
                "Само када изгледају прљаво"
              ],
              "explanation": "Клице су невидљиве. Оперите руке: пре јела/кувања, после коришћења тоалета, после мењања пелена, након додиривања животиња, после кашљања/кихања и након додиривања болесних људи."
            }
          ]
        }
      }
    },
    "rights": {
      "meta": {
        "title": "Упознајте своја права — Реди Хеалтх",
        "description": "Права пацијената, помоћ у борби против дискриминације и правни контакти за ромске заједнице"
      },
      "title": "Упознајте своја права",
      "subtitle": "Ви имате права као пацијент. Научите их. Користите их.",
      "back": "Назад",
      "menu": {
        "patientRights": {
          "title": "Права пацијената",
          "desc": "8 права које сваки пацијент има"
        },
        "discrimination": {
          "title": "Суочавање са дискриминацијом?",
          "desc": "Шта рећи и урадити — корак по корак"
        },
        "contacts": {
          "title": "Правна помоћ по земљама",
          "desc": "Омбудсман, антидискриминација, ромске организације"
        }
      },
      "views": {
        "patientRights": "Ваша права пацијената",
        "discrimination": "Ако се суочите са дискриминацијом",
        "discriminationDesc": "Стварне ситуације и шта тачно рећи и учинити.",
        "contacts": "Правна помоћ по земљама"
      },
      "labels": {
        "sayThis": "реци ово:",
        "thenDo": "Затим урадите ово:",
        "patientOmbudsman": "Омбудсман за пацијенте",
        "antiDiscrimination": "Anti-Discrimination",
        "romaRightsOrg": "Roma Rights Organization"
      },
      "rights": {
        "treatment": {
          "title": "Право на хитан третман",
          "description": "Свака болница МОРА да вас лечи у хитним случајевима, чак и без осигурања или докумената. Ово је закон у свакој земљи ЕУ. Ако одбију, затражите име доктора и пријавите га."
        },
        "information": {
          "title": "Право да разумем своју дијагнозу",
          "description": "Ваш лекар мора да објасни ваше стање речима које разумете. Ако не разумете, реците: 'Можете ли ово једноставније да објасните?' Такође можете затражити писани резиме."
        },
        "consent": {
          "title": "Право рећи не",
          "description": "Нико вам не може наметнути лечење. Пре било каквог поступка, лекар мора да објасни шта ће урадити, а ви се морате сложити. Увек можете рећи „Треба ми времена да размислим“."
        },
        "privacy": {
          "title": "Право на приватност",
          "description": "Ваше медицинске информације су приватне. Лекари не могу то поделити са вашим послодавцем, породицом или било ким другим без ваше дозволе. Ово укључује ваш ХИВ статус, трудноћу или ментално здравље."
        },
        "interpreter": {
          "title": "Право на преводиоца",
          "description": "Ако не говорите добро локални језик, можете затражити преводиоца. Многе болнице имају ову услугу. Ако не, можете довести некога коме верујете да преведе."
        },
        "second-opinion": {
          "title": "Право на друго мишљење",
          "description": "Ако се не слажете са дијагнозом, можете се обратити другом лекару. Ово је твоје право. Не морате објашњавати зашто."
        },
        "records": {
          "title": "Право на вашу медицинску документацију",
          "description": "У било ком тренутку можете затражити копију свих ваших медицинских картона. Болница их мора обезбедити. Ово је корисно када мењате доктора или прелазите у други град."
        },
        "complaint": {
          "title": "Право на жалбу",
          "description": "Ако се осећате малтретираним или дискриминисаним, можете поднети жалбу. Свака болница има процедуру за жалбе. Такође можете контактирати омбудсмана за пацијенте у својој земљи."
        }
      },
      "scenarios": {
        "refused-treatment": {
          "situation": "Болница одбија да вас лечи",
          "whatToSay": "„Имам право на хитно лечење по закону ЕУ. Молимо вас да напишете своје име и разлог зашто одбијате.",
          "whatToDo": [
            "Останите мирни, али чврсти",
            "Питајте пуно име доктора",
            "Затражите одбијање писмено",
            "Позовите омбудсмана за пацијенте",
            "Обратите се организацији за права Рома"
          ]
        },
        "rude-staff": {
          "situation": "Особље болнице је непристојно или презирно због ваше националности",
          "whatToSay": "„Овде сам због медицинске помоћи. Очекујем да ћу бити третиран са истим поштовањем као и сваки други пацијент.“",
          "whatToDo": [
            "Замолите да разговарате са главном медицинском сестром или шефом одељења",
            "Забележите датум, време и имена",
            "Поднесите писмену жалбу у болници",
            "Пријавите се националном телу за борбу против дискриминације"
          ]
        },
        "no-insurance": {
          "situation": "Немате здравствено осигурање",
          "whatToSay": "„Треба ми медицинска помоћ. Које су моје опције за неосигуране пацијенте?“",
          "whatToDo": [
            "Хитна помоћ је увек бесплатна - инсистирајте на томе",
            "Питајте о програмима социјалне помоћи",
            "Обратите се здравственом посреднику у вашем подручју",
            "Многе невладине организације пружају бесплатне клинике - питајте у болници"
          ]
        },
        "language-barrier": {
          "situation": "Не можете комуницирати са доктором",
          "whatToSay": "„Потребна ми је помоћ у разумевању. Можете ли да обезбедите преводиоца или говорите спорије?“",
          "whatToDo": [
            "Користите ову апликацију за превођење кључних фраза",
            "Доведите особу од поверења која говори језик",
            "Затражите писмена упутства која можете превести касније",
            "Користите камеру свог телефона за превођење докумената"
          ]
        }
      },
      "contacts": {
        "romania": {
          "country": "Romania",
          "ombudsman": "Avocatul Poporului",
          "antiDiscrimination": "CNCD",
          "ombudsmanPhone": "021 312 7134",
          "antiDiscriminationPhone": "021 312 6578",
          "romaRightsOrg": "Romani CRISS"
        },
        "bulgaria": {
          "country": "Bulgaria",
          "ombudsman": "Ombudsman of Bulgaria",
          "antiDiscrimination": "Commission for Protection against Discrimination",
          "ombudsmanPhone": "02 810 6955",
          "romaRightsOrg": "Amalipe Center"
        },
        "hungary": {
          "country": "Hungary",
          "ombudsman": "Commissioner for Fundamental Rights",
          "antiDiscrimination": "Equal Treatment Authority",
          "ombudsmanPhone": "06 1 475 7100",
          "romaRightsOrg": "Romaversitas Foundation"
        },
        "slovakia": {
          "country": "Slovakia",
          "ombudsman": "Public Defender of Rights",
          "antiDiscrimination": "Slovak National Centre for Human Rights",
          "ombudsmanPhone": "02 4828 7401",
          "romaRightsOrg": "ETP Slovakia"
        },
        "czech-republic": {
          "country": "Czech Republic",
          "ombudsman": "Public Defender of Rights",
          "antiDiscrimination": "Office of the Public Defender",
          "ombudsmanPhone": "542 542 888",
          "romaRightsOrg": "Romea.cz"
        },
        "serbia": {
          "country": "Serbia",
          "ombudsman": "Protector of Citizens",
          "antiDiscrimination": "Commissioner for Equality",
          "ombudsmanPhone": "011 206 8100",
          "romaRightsOrg": "Praxis"
        },
        "albania": {
          "country": "Albania",
          "ombudsman": "People's Advocate",
          "antiDiscrimination": "Commissioner for Protection from Discrimination",
          "ombudsmanPhone": "042 380 300"
        },
        "north-macedonia": {
          "country": "North Macedonia",
          "ombudsman": "Ombudsman",
          "antiDiscrimination": "Commission for Prevention and Protection against Discrimination",
          "ombudsmanPhone": "02 3129 335"
        },
        "greece": {
          "country": "Greece",
          "ombudsman": "Greek Ombudsman",
          "antiDiscrimination": "Greek Ombudsman (Equal Treatment)",
          "ombudsmanPhone": "213 130 6600"
        },
        "croatia": {
          "country": "Croatia",
          "ombudsman": "Ombudswoman",
          "antiDiscrimination": "Ombudswoman",
          "ombudsmanPhone": "01 4851 855"
        }
      }
    },
    "stories": {
      "meta": {
        "title": "Приче заједнице — Реди Хеалтх",
        "description": "Права здравствена искуства из ромских заједница широм Европе"
      },
      "title": "Приче заједнице",
      "subtitle": "Права искуства из ромских заједница. Учите од других.",
      "backToStories": "Назад на приче",
      "lessonLearned": "Научена лекција",
      "whatToDoNext": "Шта даље",
      "categories": {
        "vaccines": "Вакцине",
        "chronic": "Хронична болест",
        "maternal": "Трудноћа",
        "discrimination": "права",
        "prevention": "Превенција",
        "mental": "Ментално здравље"
      },
      "nextSteps": {
        "vaccineGuide": "Водич за вакцину",
        "askZuvo": "Питај Зуво",
        "explainPrescription": "Објасните рецепт",
        "navigateToCare": "Навигирајте до бриге",
        "knowYourRights": "Знајте своја права",
        "learnPrevention": "Научите превенцију",
        "checkSymptoms": "Проверите симптоме",
        "learnMentalHealth": "Научите о менталном здрављу"
      },
      "entries": {
        "maria-vaccines": {
          "name": "Maria",
          "age": "28",
          "country": "Румунија",
          "title": "Замало да нисам вакцинисао своју ћерку",
          "story": "Моја свекрва ми је рекла да су вакцине отров. Сви у насељу су рекли исто. Када ми се родила ћерка, био сам уплашен. Али здравствени посредник је дошао у наш дом и све објаснио — како вакцине функционишу, шта су заправо нежељени ефекти. Показала ми је фотографије деце оболеле од морбила. Више сам се плашио болести него вакцине. Моја ћерка је добила све вакцине. Здрава је и јака.",
          "lesson": "Разговарајте са здравственим посредником или лекаром пре него што донесете одлуке на основу онога што други кажу. Вакцине спашавају животе."
        },
        "stefan-diabetes": {
          "name": "Stefan",
          "age": "52",
          "country": "Бугарска",
          "title": "Престао сам да узимам лек за дијабетес и замало нисам умро",
          "story": "Дијагностикован ми је дијабетес типа 2 у 45. Лек ме је заболео у стомаку, па сам престао да га узимам. Мој комшија је рекао да ће ме чај од цимета излечити. Уместо тога, 2 године сам пио чај од цимета. Онда сам се једног дана срушио. Шећер ми је био преко 500. Доктори су рекли да су ми бубрези оштећени. Сада узимам лекове сваки дан. Волео бих да никада нисам стао.",
          "lesson": "Никада не прекидајте лек без разговора са лекаром. Природни лекови не могу заменити лекове за дијабетес."
        },
        "elena-pregnancy": {
          "name": "Elena",
          "age": "22",
          "country": "Србија",
          "title": "Моја прва трудноћа — нисам знала да могу бесплатно да одем код доктора",
          "story": "Када сам затруднела са 19 година, нисам ишла код доктора 6 месеци. Нисам имао осигурање и мислио сам да ће то коштати превише. Здравствена медијаторка ми је рекла да је пренатална нега бесплатна за све труднице у Србији. Помогла ми је да се региструјем. Доктор је установио да имам анемију и висок крвни притисак. Да нисам отишао, моја беба би могла бити у опасности.",
          "lesson": "Пренатална нега је бесплатна у већини европских земаља. Замолите здравственог посредника да вам помогне да се региструјете."
        },
        "janos-discrimination": {
          "name": "János",
          "age": "35",
          "country": "Мађарска",
          "title": "Болница је покушала да ме испрати",
          "story": "Отишао сам у хитну помоћ са болом у грудима. Сестра ме је погледала и рекла 'Пити смо, иди у другу болницу.' Знао сам да ово није у реду. Рекао сам: 'Имам болове у грудима. Морате ме испитати. Молим те, дај ми своје име.' Њен став се одмах променио. Прегледали су ме и установили да имам проблем са срцем који захтева лечење. Да сам отишао, могао сам да добијем срчани удар.",
          "lesson": "Имате право на хитан третман. Ако неко покуша да вас одбије, питајте за његово име и реците да знате своја права."
        },
        "ana-tb": {
          "name": "Ana",
          "age": "31",
          "country": "Словачка",
          "title": "Туберкулоза није смртна казна - али морате завршити лек",
          "story": "Кашљао сам месецима. Мислио сам да је само прехлада. Када сам коначно отишао код доктора, рекли су ми да имам туберкулозу. Био сам престрављен — мислио сам да ћу умрети. Али доктор је објаснио да се ТБ може излечити са 6 месеци лека. Најтеже је било узимати таблете сваки дан током 6 месеци, чак и када сам се осећао боље након 2 месеца. Али завршио сам. ја сам излечен.",
          "lesson": "Ако кашљете дуже од 2 недеље, обратите се лекару. ТБЦ је излечива, али МОРАТЕ завршити све лекове."
        },
        "mirela-depression": {
          "name": "Mirela",
          "age": "40",
          "country": "Северна Македонија",
          "title": "Депресија није слабост - то је болест",
          "story": "Након што ми је муж умро, месецима нисам могла да устанем из кревета. Моја породица је рекла да сам лењ. Рекли су 'само буди јак'. Али нисам могао. Здравствени посредник је приметио да нешто није у реду и одвео ме је код лекара. Доктор је рекао да имам депресију - право здравствено стање. Почео сам да се бавим медицином и разговарам са саветником. Полако ми је било боље. нисам слаб. Био сам болестан.",
          "lesson": "Депресија је медицинско стање, а не мана карактера. Медицина и саветовање могу помоћи. Замолите за помоћ."
        }
      }
    },
    "challenges": {
      "meta": {
        "title": "Изазови — Реди Хеалтх",
        "description": "Изазови заједнице"
      },
      "title": "Ацтиве Цхалленгес",
      "subtitle": "Придружите се циљевима заједнице и личним изазовима да бисте зарадили бонус КСП и значке.",
      "types": {
        "community": "заједница",
        "personal": "лични"
      },
      "daysLeft": "Преостало је {цоунт} дана",
      "viewLeaderboard": "Прикажи ранг листу",
      "items": {
        "c1": {
          "title": "Шампион знања о вакцинама",
          "description": "Наведите 50 ученика у вашој локалној области да ове недеље прођу модул вакцине."
        },
        "c2": {
          "title": "7-дневни здравствени низ",
          "description": "Забележите своје расположење и унос воде 7 дана за редом."
        }
      }
    },
    "certificate": {
      "meta": {
        "title": "Сертификат — Реди Хеалтх",
        "description": "Национални сертификат о здравственој писмености"
      },
      "title": "Ваш сертификат",
      "subtitle": "Завршили сте Националну етапу Студентске здравствене академије.",
      "ofCompletion": "Потврда о завршетку",
      "diplomaTitle": "Национална здравствена писменост",
      "awardedFor": "Додељује се за завршетак наставног плана и програма Реди Хеалтх Студент Ацадеми.",
      "date": "Датум",
      "downloadPdf": "Преузмите ПДФ",
      "share": "Схаре",
      "gate": {
        "title": "Прво завршите Академију",
        "description": "Да бисте стекли сертификат здравствене писмености, потребно је да завршите све лекције и положите квиз у Националној фази Студентске здравствене академије.",
        "cta": "Иди на Академију"
      }
    }
  },
  "tr": {
    "healthQuiz": {
      "meta": {
        "title": "Sağlık Testi — Redi Health",
        "description": "Etkileşimli sınavlarla sağlık bilginizi test edin"
      },
      "title": "Sağlık Testi",
      "subtitle": "Bilginizi test edin. Yeni bir şey öğrenin.",
      "backToQuizzes": "Testlere geri dön",
      "seeResults": "Sonuçları görün",
      "nextQuestion": "Sonraki soru",
      "questionsCount": "{count} sorular",
      "results": {
        "perfect": "Mükemmel skor!",
        "great": "Harika iş!",
        "good": "İyi çaba!",
        "keepLearning": "Öğrenmeye devam edin!",
        "score": "{total}'den {score}'yi doğru çıkardınız",
        "tryAgain": "Tekrar dene",
        "moreQuizzes": "Daha fazla test"
      },
      "quizzes": {
        "antibiotics": {
          "title": "Antibiyotikler",
          "description": "Antibiyotiklerin ne zaman kullanılacağını biliyor musunuz?",
          "questions": [
            {
              "question": "Antibiyotikler gribi tedavi edebilir mi?",
              "options": [
                "Evet",
                "Hayır",
                "Bazen"
              ],
              "explanation": "Gribe bir virüs neden olur. Antibiyotikler yalnızca bakterileri öldürür. Grip için antibiyotik almak hiçbir şey yapmaz ve gelecekteki enfeksiyonların tedavisini zorlaştırabilir."
            },
            {
              "question": "3 günlük antibiyotik tedavisinden sonra kendinizi daha iyi hissedersiniz. Durmalı mısın?",
              "options": [
                "Evet, iyileştin",
                "Hayır, kursun tamamını bitir",
                "Kalan hapların yarısını al"
              ],
              "explanation": "HER ZAMAN kursun tamamını bitirin. Erken durursanız bazı bakteriler hayatta kalır ve dirençli hale gelir. Bir dahaki sefere aynı antibiyotik işe yaramayacak."
            },
            {
              "question": "Benzer semptomları olan bir aile üyesiyle antibiyotik paylaşabilir misiniz?",
              "options": [
                "Evet, para tasarrufu sağlar",
                "Hayır, asla",
                "Sadece aynı hastalıksa"
              ],
              "explanation": "Antibiyotiği asla paylaşmayın. Farklı enfeksiyonlar farklı ilaçlara ihtiyaç duyar. Yanlış antibiyotik tehlikeli olabilir ve faydası olmaz."
            },
            {
              "question": "Çok sık antibiyotik alırsanız ne olur?",
              "options": [
                "Kötü bir şey yok",
                "Vücudunuz hastalıklara karşı bağışıklık kazanır",
                "Bakteriler dirençli hale geliyor ve öldürülmesi zorlaşıyor"
              ],
              "explanation": "Antibiyotik direnci küresel bir krizdir. Bakteriler dirençli hale geldiğinde basit enfeksiyonlar ölümcül olabilir. Antibiyotikleri yalnızca doktor önerdiğinde alın."
            }
          ]
        },
        "vaccines": {
          "title": "aşılar",
          "description": "Gerçekleri mitlerden ayırın",
          "questions": [
            {
              "question": "Aşılar otizme neden olur mu?",
              "options": [
                "Evet",
                "Hayır",
                "Bilmiyoruz"
              ],
              "explanation": "Hayır. Bu efsane, geri çekilen sahte bir çalışmayla başladı. Bunu yayınlayan doktor tıp lisansını kaybetti. Milyonlarca çocukla yapılan düzinelerce çalışma, aşıların otizme neden OLMADIĞINI kanıtlıyor."
            },
            {
              "question": "Bir bebeğe aynı anda birden fazla aşı yapmak güvenli midir?",
              "options": [
                "Hayır, bu çok fazla",
                "Evet, güvenli ve test edilmiştir",
                "Bir seferde yalnızca bir tane"
              ],
              "explanation": "Bebeklerin bağışıklık sistemleri her gün binlerce mikropla mücadele eder. Kombinasyon aşıları kapsamlı bir şekilde test edilmiştir ve güvenlidir. Aşıların geciktirilmesi çocuğunuzu korumasız bırakır."
            },
            {
              "question": "Çocuğumda hafif bir soğuk algınlığı var. Yine de aşı olabilirler mi?",
              "options": [
                "Hayır, tamamen sağlıklı olana kadar bekle",
                "Evet hafif bir soğuk iyidir",
                "Sadece doktor izniyle"
              ],
              "explanation": "Hafif bir soğuk algınlığı, düşük ateş veya burun akıntısı aşıyı geciktirmek için bir neden DEĞİLDİR. Yalnızca ciddi hastalıklar ertelemeyi gerektirir. Emin değilseniz doktorunuza sorun."
            },
            {
              "question": "Aşılar tehlikeli kimyasallar içeriyor mu?",
              "options": [
                "Evet, toksinlerle dolular",
                "Hayır, tüm malzemeler kullanılan küçük miktarlarda bile güvenlidir",
                "Bazıları yapar, bazıları yapmaz"
              ],
              "explanation": "Aşı bileşenleri küçük ve güvenli miktarlarda mevcuttur. Anne sütünden aşıdan daha fazla alüminyum alırsınız. Her bileşen güvenlik açısından test edilmiştir."
            }
          ]
        },
        "diabetes": {
          "title": "Diyabet",
          "description": "Diyabet yönetimini anlamak",
          "questions": [
            {
              "question": "Diyabet çok fazla şeker yemekten mi kaynaklanır?",
              "options": [
                "Evet",
                "Hayır, daha karmaşık",
                "Yalnızca Tip 2"
              ],
              "explanation": "Diyabetin nedeni genetik, yaşam tarzı ve vücudunuzun insülini işleme şeklidir. Şeker yemek doğrudan buna neden olmaz ancak sağlıksız beslenme ve obezite riski artırır."
            },
            {
              "question": "Şeker hastalığı tarçın gibi doğal ilaçlarla tedavi edilebilir mi?",
              "options": [
                "Evet tarçın iyileştirir",
                "Hayır tedavisi yok ama kontrol edilebilir",
                "Evet, yeterli sarımsak ve otlarla"
              ],
              "explanation": "Diyabetin tedavisi YOKTUR. İlaç, sağlıklı beslenme ve egzersizle kontrol altına alınabilir. Tarçının küçük faydaları olabilir ancak ilacın yerini ALAMAZ. İlaçlarını bırakan insanlar hastaneye kaldırılıyor."
            },
            {
              "question": "Diyabetik bir kişi baş dönmesi ve ter hisseder. Ne yapmalısın?",
              "options": [
                "Onlara insülin ver",
                "Onlara hemen tatlı bir şeyler verin",
                "Onlara dinlenmelerini söyle"
              ],
              "explanation": "Bunlar DÜŞÜK kan şekerinin (hipoglisemi) belirtileridir. Onlara hemen meyve suyu, şeker veya şekerli su verin. Bu yaşamı tehdit edici olabilir. Kendilerini daha iyi hissettikten sonra uygun bir yemek yemelidirler."
            },
            {
              "question": "Diyabetli bir kişi ayaklarını ne sıklıkla kontrol etmelidir?",
              "options": [
                "Asla, ayaklar iyi",
                "Her gün",
                "Yılda bir kez"
              ],
              "explanation": "Diyabet ayaklarınızdaki sinirlere zarar verebilir. Kesik veya yara hissetmeyebilirsiniz. Ayaklarınızı HER GÜN kesik, kabarcık veya renk değişikliği açısından kontrol edin. Küçük yaralar ciddi enfeksiyonlara dönüşebilir."
            }
          ]
        },
        "hygiene": {
          "title": "Hijyen ve Önleme",
          "description": "Hayat kurtaran temel sağlık alışkanlıkları",
          "questions": [
            {
              "question": "Ellerinizi sabunla ne kadar süre yıkamalısınız?",
              "options": [
                "5 saniye",
                "En az 20 saniye",
                "1 dakika"
              ],
              "explanation": "En az 20 saniye boyunca yıkayın; bu yaklaşık olarak 'Happy Birthday' şarkısını iki kez söylemek için gereken süre kadardır. Bu, mikropların çoğunu ortadan kaldırır. Hızlı durulamalar işe yaramaz."
            },
            {
              "question": "Bir nehirden veya dereden su içmek güvenli midir?",
              "options": [
                "Evet doğal su temizdir",
                "Hayır, her zaman önce kaynatın veya filtreleyin",
                "Sadece net görünüyorsa"
              ],
              "explanation": "Temiz su bile tehlikeli bakteri ve parazitler içerebilir. Suyu daima en az 1 dakika kaynatın veya filtre kullanın. Kirli su ishal, kolera ve tifoya neden olur."
            },
            {
              "question": "Çocuğunuzun ishali var. En önemli şey nedir?",
              "options": [
                "Tüm yiyecekleri durdur",
                "Bol miktarda sıvı verin (su, ORS)",
                "Antibiyotik ver"
              ],
              "explanation": "İshalden kaynaklanan dehidrasyon, ishalin kendisinden daha fazla çocuğu öldürür. Oral rehidrasyon solüsyonu (ORS) veya bir tutam tuz ve şeker içeren temiz su verin. Bebekleri emzirmeye devam edin."
            },
            {
              "question": "Ellerinizi ne zaman yıkamalısınız?",
              "options": [
                "Sadece yemekten önce",
                "Yemekten önce, tuvaletten sonra, hayvanlara dokunduktan sonra, öksürdükten sonra",
                "Sadece kirli göründüklerinde"
              ],
              "explanation": "Mikroplar görünmez. Ellerinizi yıkayın: Yemek yemeden/yemek pişirmeden önce, tuvaleti kullandıktan sonra, bebek bezini değiştirdikten sonra, hayvanlara dokunduktan sonra, öksürdükten/hapşırdıktan sonra ve hastalara dokunduktan sonra."
            }
          ]
        }
      }
    },
    "rights": {
      "meta": {
        "title": "Haklarınızı Bilin — Redi Sağlık",
        "description": "Roman toplulukları için hasta hakları, ayrımcılık yardımı ve yasal temaslar"
      },
      "title": "Haklarınızı Bilin",
      "subtitle": "Hasta olarak haklarınız var. Onları öğrenin. Onları kullanın.",
      "back": "Geri",
      "menu": {
        "patientRights": {
          "title": "Hasta Hakları",
          "desc": "Her hastanın sahip olduğu 8 hak"
        },
        "discrimination": {
          "title": "Ayrımcılıkla mı Karşılaşıyorsunuz?",
          "desc": "Ne söylenmeli ve ne yapılmalı — adım adım"
        },
        "contacts": {
          "title": "Ülkeye Göre Yasal Yardım",
          "desc": "Ombudsman, ayrımcılık karşıtı, Roman kuruluşları"
        }
      },
      "views": {
        "patientRights": "Hasta Haklarınız",
        "discrimination": "Ayrımcılıkla Karşılaşırsanız",
        "discriminationDesc": "Gerçek durumlar ve tam olarak ne söylenmesi ve yapılması gerektiği.",
        "contacts": "Ülkeye Göre Yasal Yardım"
      },
      "labels": {
        "sayThis": "Şunu söyle:",
        "thenDo": "Sonra şunu yapın:",
        "patientOmbudsman": "Hasta Ombudsmanı",
        "antiDiscrimination": "Anti-Discrimination",
        "romaRightsOrg": "Roma Rights Organization"
      },
      "rights": {
        "treatment": {
          "title": "Acil tedavi hakkı",
          "description": "Her hastane, sigorta veya belgeler olmasa bile, acil bir durumda sizi tedavi ETMEK ZORUNDADIR. Bu her EU ülkede yasadır. Reddederlerse doktorun adını sorun ve bildirin."
        },
        "information": {
          "title": "Teşhisinizi anlama hakkı",
          "description": "Doktorunuz durumunuzu anladığınız kelimelerle açıklamalıdır. Anlamadıysanız şunu söyleyin: 'Bunu daha basit bir şekilde açıklayabilir misiniz?' Ayrıca yazılı bir özet de isteyebilirsiniz."
        },
        "consent": {
          "title": "Hayır deme hakkı",
          "description": "Kimse sizi tedavi etmeye zorlayamaz. Herhangi bir işlemden önce doktorun ne yapacağını açıklaması ve sizin de kabul etmeniz gerekir. Her zaman 'Düşünmek için zamana ihtiyacım var' diyebilirsiniz."
        },
        "privacy": {
          "title": "Gizlilik hakkı",
          "description": "Tıbbi bilgileriniz gizlidir. Doktorlar izniniz olmadan bunu işvereninizle, ailenizle veya başkasıyla paylaşamaz. Buna HIV durumunuz, hamileliğiniz veya zihinsel sağlığınız da dahildir."
        },
        "interpreter": {
          "title": "Tercüman hakkı",
          "description": "Yerel dili iyi konuşamıyorsanız tercüman talep edebilirsiniz. Birçok hastanenin bu hizmeti var. Değilse, tercüme etmesi için güvendiğiniz birini getirebilirsiniz."
        },
        "second-opinion": {
          "title": "İkinci görüş alma hakkı",
          "description": "Eğer teşhise katılmıyorsanız başka bir doktora başvurabilirsiniz. Bu senin hakkın. Nedenini açıklamanıza gerek yok."
        },
        "records": {
          "title": "Tıbbi kayıtlarınıza erişim hakkı",
          "description": "İstediğiniz zaman tüm tıbbi kayıtlarınızın bir kopyasını isteyebilirsiniz. Hastanenin bunları sağlaması gerekiyor. Bu, doktor değiştirirken veya başka bir şehre taşınırken faydalıdır."
        },
        "complaint": {
          "title": "Şikayet etme hakkı",
          "description": "Kötü muameleye maruz kaldığınızı veya ayrımcılığa uğradığınızı düşünüyorsanız şikayette bulunabilirsiniz. Her hastanenin bir şikayet prosedürü vardır. Ayrıca ülkenizdeki hasta ombudsmanıyla da iletişime geçebilirsiniz."
        }
      },
      "scenarios": {
        "refused-treatment": {
          "situation": "Hastane sizi tedavi etmeyi reddediyor",
          "whatToSay": "\"EU yasası uyarınca acil tedavi hakkım var. Lütfen adınızı ve reddetme nedeninizi yazın.\"",
          "whatToDo": [
            "Sakin ama kararlı kalın",
            "Doktorun tam adını isteyin",
            "Reddi yazılı olarak isteyin",
            "Hasta ombudsmanını arayın",
            "Bir Roman hakları örgütüyle iletişime geçin"
          ]
        },
        "rude-staff": {
          "situation": "Hastane personeli etnik kökeniniz nedeniyle kaba veya küçümseyici davranıyor",
          "whatToSay": "\"Tıbbi yardım için buradayım. Diğer hastalarla aynı saygıyla davranılmayı bekliyorum.\"",
          "whatToDo": [
            "Başhemşire veya bölüm şefiyle konuşmayı isteyin",
            "Tarihi, saati ve adları not edin",
            "Hastaneye yazılı şikayette bulunun",
            "Ulusal ayrımcılıkla mücadele kurumuna rapor verin"
          ]
        },
        "no-insurance": {
          "situation": "Sağlık sigortanız yok",
          "whatToSay": "\"Tıbbi yardıma ihtiyacım var. Sigortasız hastalar için seçeneklerim nelerdir?\"",
          "whatToDo": [
            "Acil bakım her zaman ücretsizdir; bunda ısrar edin",
            "Sosyal yardım programlarını sorun",
            "Bölgenizdeki bir sağlık aracısına başvurun",
            "Birçok STK ücretsiz klinik sağlıyor; hastaneye sorun"
          ]
        },
        "language-barrier": {
          "situation": "Doktorla iletişim kuramıyorsun",
          "whatToSay": "\"Anlamak için yardıma ihtiyacım var. Bir tercüman sağlayabilir misiniz veya daha yavaş konuşabilir misiniz?\"",
          "whatToDo": [
            "Anahtar cümleleri çevirmek için bu uygulamayı kullanın",
            "Dili konuşan güvenilir bir kişiyi getirin",
            "Daha sonra çevirebileceğiniz yazılı talimatlar isteyin",
            "Belgeleri çevirmek için telefonunuzun kamerasını kullanın"
          ]
        }
      },
      "contacts": {
        "romania": {
          "country": "Romania",
          "ombudsman": "Avocatul Poporului",
          "antiDiscrimination": "CNCD",
          "ombudsmanPhone": "021 312 7134",
          "antiDiscriminationPhone": "021 312 6578",
          "romaRightsOrg": "Romani CRISS"
        },
        "bulgaria": {
          "country": "Bulgaria",
          "ombudsman": "Ombudsman of Bulgaria",
          "antiDiscrimination": "Commission for Protection against Discrimination",
          "ombudsmanPhone": "02 810 6955",
          "romaRightsOrg": "Amalipe Center"
        },
        "hungary": {
          "country": "Hungary",
          "ombudsman": "Commissioner for Fundamental Rights",
          "antiDiscrimination": "Equal Treatment Authority",
          "ombudsmanPhone": "06 1 475 7100",
          "romaRightsOrg": "Romaversitas Foundation"
        },
        "slovakia": {
          "country": "Slovakia",
          "ombudsman": "Public Defender of Rights",
          "antiDiscrimination": "Slovak National Centre for Human Rights",
          "ombudsmanPhone": "02 4828 7401",
          "romaRightsOrg": "ETP Slovakia"
        },
        "czech-republic": {
          "country": "Czech Republic",
          "ombudsman": "Public Defender of Rights",
          "antiDiscrimination": "Office of the Public Defender",
          "ombudsmanPhone": "542 542 888",
          "romaRightsOrg": "Romea.cz"
        },
        "serbia": {
          "country": "Serbia",
          "ombudsman": "Protector of Citizens",
          "antiDiscrimination": "Commissioner for Equality",
          "ombudsmanPhone": "011 206 8100",
          "romaRightsOrg": "Praxis"
        },
        "albania": {
          "country": "Albania",
          "ombudsman": "People's Advocate",
          "antiDiscrimination": "Commissioner for Protection from Discrimination",
          "ombudsmanPhone": "042 380 300"
        },
        "north-macedonia": {
          "country": "North Macedonia",
          "ombudsman": "Ombudsman",
          "antiDiscrimination": "Commission for Prevention and Protection against Discrimination",
          "ombudsmanPhone": "02 3129 335"
        },
        "greece": {
          "country": "Greece",
          "ombudsman": "Greek Ombudsman",
          "antiDiscrimination": "Greek Ombudsman (Equal Treatment)",
          "ombudsmanPhone": "213 130 6600"
        },
        "croatia": {
          "country": "Croatia",
          "ombudsman": "Ombudswoman",
          "antiDiscrimination": "Ombudswoman",
          "ombudsmanPhone": "01 4851 855"
        }
      }
    },
    "stories": {
      "meta": {
        "title": "Topluluk Hikayeleri — Redi Health",
        "description": "Avrupa'daki Roman topluluklarından gerçek sağlık deneyimleri"
      },
      "title": "Topluluk Hikayeleri",
      "subtitle": "Roman topluluklarından gerçek deneyimler. Başkalarından öğrenin.",
      "backToStories": "Hikayelere geri dön",
      "lessonLearned": "Öğrenilen ders",
      "whatToDoNext": "Bundan sonra ne yapmalı",
      "categories": {
        "vaccines": "aşılar",
        "chronic": "Kronik Hastalık",
        "maternal": "Hamilelik",
        "discrimination": "Haklar",
        "prevention": "Önleme",
        "mental": "Ruh Sağlığı"
      },
      "nextSteps": {
        "vaccineGuide": "Aşı rehberi",
        "askZuvo": "Zuvo'ya sor",
        "explainPrescription": "Reçeteyi açıkla",
        "navigateToCare": "Bakıma gidin",
        "knowYourRights": "Haklarınızı bilin",
        "learnPrevention": "Önlemeyi öğrenin",
        "checkSymptoms": "Belirtileri kontrol edin",
        "learnMentalHealth": "Ruh sağlığı hakkında bilgi edinin"
      },
      "entries": {
        "maria-vaccines": {
          "name": "Maria",
          "age": "28",
          "country": "Romanya",
          "title": "Neredeyse kızıma aşı yaptırmıyordum",
          "story": "Kayınvalidem bana aşıların zehir olduğunu söyledi. Yerleşimdeki herkes aynı şeyi söyledi. Kızım doğduğunda çok korktum. Ancak sağlık aracısı evimize geldi ve aşıların nasıl çalıştığını, yan etkilerinin gerçekte neler olduğunu anlattı. Bana kızamık hastası çocukların fotoğraflarını gösterdi. Aşıdan çok hastalıktan korkuyordum. Kızımın tüm aşıları yapıldı. O sağlıklı ve güçlü.",
          "lesson": "Başkalarının söylediklerine göre karar vermeden önce bir sağlık aracısı veya doktorla konuşun. Aşılar hayat kurtarır."
        },
        "stefan-diabetes": {
          "name": "Stefan",
          "age": "52",
          "country": "Bulgaristan",
          "title": "Diyabet ilacımı bıraktım ve neredeyse ölüyordum",
          "story": "45 tarihinde bana Tip 2 diyabet teşhisi konuldu. İlaç midemi ağrıttı, bu yüzden almayı bıraktım. Komşum tarçın çayının bana şifa vereceğini söyledi. 2 yıl boyunca onun yerine tarçın çayı içtim. Sonra bir gün yere yığıldım. Kan şekerim 500'in üzerindeydi. Doktorlar böbreklerimin hasar gördüğünü söyledi. Artık her gün ilacımı alıyorum. Keşke hiç durmasaydım.",
          "lesson": "Doktorunuzla konuşmadan asla ilacınızı kesmeyin. Doğal ilaçlar diyabet ilaçlarının yerini alamaz."
        },
        "elena-pregnancy": {
          "name": "Elena",
          "age": "22",
          "country": "Sırbistan",
          "title": "İlk hamileliğim — Ücretsiz olarak doktora gidebileceğimi bilmiyordum",
          "story": "19'da hamile kaldığımda 6 ay boyunca doktora gitmedim. Sigortam yoktu ve çok pahalıya mal olacağını düşündüm. Bir sağlık aracısı bana Sırbistan'daki tüm hamile kadınlar için doğum öncesi bakımın ücretsiz olduğunu söyledi. Kayıt olmama yardım etti. Doktor kansızlığım ve yüksek tansiyonum olduğunu tespit etti. Eğer gitmeseydim bebeğim tehlikede olabilirdi.",
          "lesson": "Çoğu Avrupa ülkesinde doğum öncesi bakım ücretsizdir. Kayıt olmanıza yardımcı olması için bir sağlık aracısından yardım isteyin."
        },
        "janos-discrimination": {
          "name": "János",
          "age": "35",
          "country": "Macaristan",
          "title": "Hastane beni göndermeye çalıştı",
          "story": "Göğüs ağrısı şikayetiyle acile gittim. Hemşire bana baktı ve 'Doyduk, başka hastaneye gidelim' dedi. Bunun doğru olmadığını biliyordum. Ben de 'Göğüs ağrım var' dedim. Beni muayene etmelisin. Lütfen bana isminizi verin.' Tutumu hemen değişti. Beni muayene ettiler ve tedavi gerektiren bir kalp problemim olduğunu tespit ettiler. Eğer gitseydim kalp krizi geçirebilirdim.",
          "lesson": "Acil tedavi hakkına sahipsiniz. Birisi sizi geri çevirmeye çalışırsa adını sorun ve haklarınızı bildiğinizi söyleyin."
        },
        "ana-tb": {
          "name": "Ana",
          "age": "31",
          "country": "Slovakya",
          "title": "TB ölüm cezası değil — ancak ilacı bitirmeniz gerekiyor",
          "story": "Aylardır öksürüyordum. Sadece soğuk algınlığı olduğunu düşündüm. Sonunda doktora gittiğimde tüberküloz olduğumu söylediler. Çok korktum; öleceğimi düşündüm. Ancak doktor TB'nun 6 aylık ilaç tedavisiyle iyileştirilebileceğini açıkladı. En zor kısmı, 2 ay sonra kendimi daha iyi hissetsem bile 6 ay boyunca her gün hap almaktı. Ama bitirdim. İyileştim.",
          "lesson": "Eğer 2 haftadan uzun süre öksürürseniz bir doktora görünün. TB tedavi edilebilir, ancak ilacın tamamını bitirmeniz GEREKİR."
        },
        "mirela-depression": {
          "name": "Mirela",
          "age": "40",
          "country": "Kuzey Makedonya",
          "title": "Depresyon zayıflık değil, bir hastalıktır",
          "story": "Kocam öldükten sonra aylarca yataktan çıkamadım. Ailem tembel olduğumu söyledi. 'Güçlü ol' dediler. Ama yapamadım. Bir sağlık aracısı bir şeylerin ters gittiğini fark etti ve beni doktora götürdü. Doktor depresyonumun gerçek bir tıbbi durum olduğunu söyledi. Tıbba başladım ve bir danışmanla konuştum. Yavaş yavaş iyileştim. Ben zayıf değilim. Ben hastaydım.",
          "lesson": "Depresyon tıbbi bir durumdur, karakter kusuru değildir. Tıp ve danışmanlık yardımcı olabilir. Lütfen yardım isteyin."
        }
      }
    },
    "challenges": {
      "meta": {
        "title": "Zorluklar — Redi Health",
        "description": "Topluluk Zorlukları"
      },
      "title": "Aktif Mücadeleler",
      "subtitle": "Bonus XP ve rozetler kazanmak için topluluk hedeflerine ve kişisel zorluklara katılın.",
      "types": {
        "community": "topluluk",
        "personal": "kişisel"
      },
      "daysLeft": "{count} gün kaldı",
      "viewLeaderboard": "Skor Tablosunu Görüntüle",
      "items": {
        "c1": {
          "title": "Aşı Bilgi Şampiyonu",
          "description": "Yerel bölgenizdeki 50 öğrencinin bu hafta Aşı modülünü geçmesini sağlayın."
        },
        "c2": {
          "title": "7 Günlük Sağlık Serisi",
          "description": "Arka arkaya 7 gün boyunca ruh halinizi ve su alımınızı kaydedin."
        }
      }
    },
    "certificate": {
      "meta": {
        "title": "Sertifika – Redi Sağlık",
        "description": "Ulusal Sağlık Okuryazarlığı Sertifikası"
      },
      "title": "Sertifikanız",
      "subtitle": "Öğrenci Sağlık Akademisi Ulusal Aşamasını tamamladınız.",
      "ofCompletion": "Bitirme Sertifikası",
      "diplomaTitle": "Ulusal Sağlık Okuryazarlığı",
      "awardedFor": "Redi Sağlık Öğrenci Akademisi müfredatını tamamladığınız için verilir.",
      "date": "Tarih",
      "downloadPdf": "PDF'yi indir",
      "share": "Paylaş",
      "gate": {
        "title": "Önce Akademiyi tamamla",
        "description": "Sağlık Okuryazarlığı Sertifikanızı kazanmak için Öğrenci Sağlık Akademisi Ulusal aşamasında tüm dersleri tamamlamanız ve sınavı geçmeniz gerekmektedir.",
        "cta": "Akademiye git"
      }
    }
  }
};

function leafPaths(obj, prefix = "") {
  const paths = [];
  if (obj === null || obj === undefined) return paths;
  if (Array.isArray(obj)) {
    obj.forEach((item, i) => paths.push(...leafPaths(item, `${prefix}[${i}]`)));
    return paths;
  }
  if (typeof obj === "object") {
    for (const [key, value] of Object.entries(obj)) {
      const next = prefix ? `${prefix}.${key}` : key;
      if (value && typeof value === "object") paths.push(...leafPaths(value, next));
      else paths.push(next);
    }
    return paths;
  }
  paths.push(prefix);
  return paths;
}

function getAtPath(obj, path) {
  const parts = path.replace(/\[(\d+)\]/g, ".$1").split(".").filter(Boolean);
  let cur = obj;
  for (const p of parts) {
    if (cur == null || typeof cur !== "object") return undefined;
    cur = cur[p];
  }
  return cur;
}

function validateNamespace(locale, ns, enNs, locNs) {
  for (const path of leafPaths(enNs)) {
    if (getAtPath(locNs, path) === undefined) {
      throw new Error(`Missing ${ns}.${path} for locale "${locale}"`);
    }
  }
}

const files = readdirSync(MESSAGES_DIR)
  .filter((name) => name.endsWith(".json") && !name.startsWith("_"))
  .sort();
const fileLocales = files.map((name) => name.replace(/\.json$/, ""));
const missingFiles = LOCALES.filter((locale) => !fileLocales.includes(locale));
if (missingFiles.length > 0) {
  throw new Error(`Missing locale files: [${missingFiles.join(", ")}]`);
}

for (const locale of LOCALES) {
  if (!(locale in TRANSLATIONS)) throw new Error(`Missing TRANSLATIONS for ${locale}`);
  for (const ns of NAMESPACES) {
    validateNamespace(locale, ns, TRANSLATIONS.en[ns], TRANSLATIONS[locale][ns]);
  }
}

let patched = 0;
for (const file of files) {
  const locale = file.replace(/\.json$/, "");
  const path = join(MESSAGES_DIR, file);
  const data = JSON.parse(readFileSync(path, "utf8"));
  let changed = false;
  for (const ns of NAMESPACES) {
    const next = JSON.parse(JSON.stringify(TRANSLATIONS[locale][ns]));
    if (JSON.stringify(data[ns]) !== JSON.stringify(next)) {
      data[ns] = next;
      changed = true;
    }
  }
  if (changed) {
    writeFileSync(path, JSON.stringify(data, null, 2) + "\n");
    patched += 1;
    console.log(`Patched ${file} — ${NAMESPACES.join(", ")}`);
  } else {
    console.log(`Verified ${file} already up to date`);
  }
}

console.log(`Done. Updated ${patched} of ${files.length} locale files.`);
