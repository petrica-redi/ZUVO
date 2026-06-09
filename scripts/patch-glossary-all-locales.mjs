/**
 * Adds full glossary namespace translations to all supported locales.
 * Run: node scripts/patch-glossary-all-locales.mjs
 */
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT_DIR = join(dirname(fileURLToPath(import.meta.url)), "..");
const MESSAGES_DIR = join(ROOT_DIR, "messages");

const LOCALES = ["en", "it", "sq", "rom", "ro", "hu", "sk", "cs", "bg", "sr", "hr", "bs", "mk", "sl", "el", "tr"];
const ENTRY_IDS = [
  "hypertension",
  "diabetes-type-2",
  "anemia",
  "asthma",
  "tuberculosis-tb",
  "depression",
  "hepatitis-b-c",
  "pneumonia",
  "gastritis",
  "eczema",
  "antibiotic",
  "ibuprofen",
  "paracetamol",
  "insulin",
  "metformin",
  "blood-test",
  "x-ray",
  "ultrasound",
  "ecg-ekg",
  "vaccination",
  "blood-pressure",
  "blood-sugar",
  "bmi",
  "immune-system",
];
const CATEGORY_IDS = ["condition", "medication", "procedure", "body", "test"];

const TRANSLATIONS = {
  en: {
    meta: {
      title: "Health Glossary — Redi Health",
      description: "Medical terms explained in simple words",
    },
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
    entries: {
      hypertension: {
        term: "Hypertension",
        simple: "High blood pressure. Your blood pushes too hard against your blood vessels. Can cause heart attack or stroke if not treated. Take your medicine every day.",
      },
      "diabetes-type-2": {
        term: "Diabetes (Type 2)",
        simple: "Your body can't use sugar properly. Sugar builds up in your blood and damages your organs. You need medicine, healthy food, and exercise. It is NOT caused by eating too much sugar.",
      },
      anemia: {
        term: "Anemia",
        simple: "Not enough healthy red blood cells. You feel tired, weak, dizzy. Often caused by not eating enough iron (meat, beans, spinach). Very common in pregnant women.",
      },
      asthma: {
        term: "Asthma",
        simple: "Your airways get narrow and swollen, making it hard to breathe. You may wheeze or cough. Use your inhaler when it happens. Avoid smoke and dust.",
      },
      "tuberculosis-tb": {
        term: "Tuberculosis (TB)",
        simple: "A serious infection in your lungs. You cough for weeks, lose weight, sweat at night. It spreads through the air. It CAN be cured with 6 months of medicine — but you must finish ALL the pills.",
      },
      depression: {
        term: "Depression",
        simple: "A medical condition where you feel sad, hopeless, or empty for weeks. It is NOT weakness. It is NOT your fault. Medicine and talking to someone can help. Please ask for help.",
      },
      "hepatitis-b-c": {
        term: "Hepatitis B/C",
        simple: "A virus that attacks your liver. You may not feel sick for years, but it damages your liver slowly. It spreads through blood and needles. There is a vaccine for Hepatitis B.",
      },
      pneumonia: {
        term: "Pneumonia",
        simple: "A serious infection in your lungs. You have fever, cough with mucus, and trouble breathing. You need antibiotics from a doctor. Can be dangerous for babies and old people.",
      },
      gastritis: {
        term: "Gastritis",
        simple: "Your stomach lining is irritated or inflamed. You feel burning pain, nausea, or bloating. Avoid spicy food, alcohol, and smoking. Medicine can help.",
      },
      eczema: {
        term: "Eczema",
        simple: "Itchy, red, dry patches on your skin. It is NOT contagious. Use moisturizer often. Avoid harsh soaps. A doctor can give you cream to help.",
      },
      antibiotic: {
        term: "Antibiotic",
        simple: "Medicine that kills bacteria (germs). It does NOT work against viruses like the flu or cold. You MUST finish the full course even if you feel better, or the germs come back stronger.",
      },
      ibuprofen: {
        term: "Ibuprofen",
        simple: "A painkiller that also reduces swelling and fever. Take with food to protect your stomach. Do not take more than the box says. Not safe during pregnancy.",
      },
      paracetamol: {
        term: "Paracetamol",
        simple: "A common painkiller for headaches and fever. Safe for most people, including pregnant women. Do NOT take more than 4 grams (8 tablets) per day — too much damages your liver.",
      },
      insulin: {
        term: "Insulin",
        simple: "A hormone your body needs to use sugar. People with diabetes may need insulin injections. It is NOT a sign that your diabetes is worse — it's just a different treatment.",
      },
      metformin: {
        term: "Metformin",
        simple: "The most common diabetes medicine. Helps your body use sugar better. Take with food. May cause stomach upset at first — this usually goes away.",
      },
      "blood-test": {
        term: "Blood test",
        simple: "A small needle takes a little blood from your arm. It helps the doctor check for infections, anemia, diabetes, and many other things. It hurts for just a second.",
      },
      "x-ray": {
        term: "X-ray",
        simple: "A picture of your bones and lungs using special light. You stand still for a few seconds. It does NOT hurt. Safe for most people, but tell the doctor if you are pregnant.",
      },
      ultrasound: {
        term: "Ultrasound",
        simple: "A picture of inside your body using sound waves. The doctor puts gel on your skin and moves a device over it. It does NOT hurt. Used to check babies during pregnancy.",
      },
      "ecg-ekg": {
        term: "ECG / EKG",
        simple: "A test that checks your heart rhythm. Small stickers are placed on your chest. It does NOT hurt. Takes about 5 minutes. Shows if your heart is beating normally.",
      },
      vaccination: {
        term: "Vaccination",
        simple: "A small injection that teaches your body to fight a disease BEFORE you get sick. Like training for your immune system. Side effects (sore arm, mild fever) are NORMAL and mean it's working.",
      },
      "blood-pressure": {
        term: "Blood pressure",
        simple: "The force of blood pushing against your blood vessel walls. Normal is around 120/80. High blood pressure (over 140/90) is dangerous because you can't feel it, but it damages your heart and brain.",
      },
      "blood-sugar": {
        term: "Blood sugar",
        simple: "The amount of sugar (glucose) in your blood. Normal fasting level is 70-100 mg/dL. Too high means diabetes. Too low makes you dizzy and shaky. Test it regularly if you have diabetes.",
      },
      bmi: {
        term: "BMI",
        simple: "Body Mass Index — a number that shows if your weight is healthy for your height. Under 18.5 is underweight. 18.5-25 is normal. Over 25 is overweight. Over 30 is obese.",
      },
      "immune-system": {
        term: "Immune system",
        simple: "Your body's army against germs. White blood cells fight infections. Vaccines train your immune system. Good food, sleep, and exercise make it stronger.",
      },
    },
  },
  it: {
    meta: {
      title: "Glossario della salute — Redi Salute",
      description: "Termini medici spiegati in parole semplici",
    },
    title: "Glossario della salute",
    subtitle: "Termini medici spiegati in parole semplici.",
    searchPlaceholder: "Termini di ricerca...",
    searchAria: "Cerca termini medici",
    noResults: "Nessun termine trovato Prova una ricerca diversa.",
    allCount: "Tutti ({count})",
    categories: {
      condition: "Condizioni",
      medication: "Farmaci",
      procedure: "Procedure",
      body: "Corpo e salute",
      test: "Test",
    },
    entries: {
      hypertension: {
        term: "Ipertensione",
        simple: "Ipertensione. Il tuo sangue spinge troppo forte contro i vasi sanguigni. Può causare infarto o ictus se non trattato. Prendi la tua medicina ogni giorno.",
      },
      "diabetes-type-2": {
        term: "Diabete (tipo 2)",
        simple: "Il tuo corpo non può utilizzare lo zucchero correttamente. Lo zucchero si accumula nel sangue e danneggia gli organi. Hai bisogno di medicine, cibo sano ed esercizio fisico. NON è causato dal consumo di troppo zucchero.",
      },
      anemia: {
        term: "Anemia",
        simple: "Non abbastanza globuli rossi sani. Ti senti stanco, debole, stordito. Spesso causato da una carenza di ferro (carne, fagioli, spinaci). Molto comune nelle donne in gravidanza.",
      },
      asthma: {
        term: "Asma",
        simple: "Le tue vie aeree si restringono e si gonfiano, rendendo difficile respirare. Potresti sibilare o tossire. Usa l'inalatore quando succede. Evitare fumo e polvere.",
      },
      "tuberculosis-tb": {
        term: "Tubercolosi (TBC)",
        simple: "Una grave infezione ai polmoni. Tossisci per settimane, dimagrisci, sudi di notte. Si diffonde nell'aria. PUOI essere curato con 6 mesi di medicine, ma devi finire TUTTE le pillole.",
      },
      depression: {
        term: "Depressione",
        simple: "Una condizione medica in cui ti senti triste, senza speranza o vuoto per settimane. NON è debolezza. NON è colpa tua. La medicina e parlare con qualcuno possono aiutare. Per favore chiedi aiuto.",
      },
      "hepatitis-b-c": {
        term: "Epatite B/C",
        simple: "Un virus che attacca il fegato. Potresti non sentirti male per anni, ma danneggia lentamente il tuo fegato. Si diffonde attraverso il sangue e gli aghi. Esiste un vaccino per l’epatite B.",
      },
      pneumonia: {
        term: "Polmonite",
        simple: "Una grave infezione ai polmoni. Hai febbre, tosse con muco e difficoltà a respirare. Hai bisogno di antibiotici da un medico. Può essere pericoloso per neonati e anziani.",
      },
      gastritis: {
        term: "Gastrite",
        simple: "Il rivestimento dello stomaco è irritato o infiammato. Senti dolore bruciante, nausea o gonfiore. Evita cibi piccanti, alcol e fumo. La medicina può aiutare.",
      },
      eczema: {
        term: "Eczema",
        simple: "Macchie pruriginose, rosse e secche sulla pelle. NON è contagioso. Usa spesso la crema idratante. Evita i saponi aggressivi. Un medico può darti una crema per aiutarti.",
      },
      antibiotic: {
        term: "Antibiotico",
        simple: "Medicina che uccide i batteri (germi). NON funziona contro virus come l'influenza o il raffreddore. DEVI finire l'intero corso anche se ti senti meglio, altrimenti i germi torneranno più forti.",
      },
      ibuprofen: {
        term: "Ibuprofene",
        simple: "Un antidolorifico che riduce anche il gonfiore e la febbre. Assumere con il cibo per proteggere lo stomaco. Non prendere più di quanto dice la scatola. Non sicuro durante la gravidanza.",
      },
      paracetamol: {
        term: "Paracetamolo",
        simple: "Un antidolorifico comune per mal di testa e febbre. Sicuro per la maggior parte delle persone, comprese le donne incinte. NON assumere più di 4 grammi (8 compresse) al giorno: troppi danneggiano il fegato.",
      },
      insulin: {
        term: "Insulina",
        simple: "Un ormone di cui il tuo corpo ha bisogno per utilizzare lo zucchero. Le persone con diabete possono aver bisogno di iniezioni di insulina. NON è un segno che il tuo diabete sia peggiorato, è solo un trattamento diverso.",
      },
      metformin: {
        term: "Metformina",
        simple: "Il farmaco per il diabete più comune. Aiuta il tuo corpo a utilizzare meglio lo zucchero. Assumere con il cibo. All'inizio può causare disturbi allo stomaco, che di solito scompaiono.",
      },
      "blood-test": {
        term: "Analisi del sangue",
        simple: "Un piccolo ago preleva un po' di sangue dal braccio. Aiuta il medico a verificare la presenza di infezioni, anemia, diabete e molte altre cose. Fa male solo per un secondo.",
      },
      "x-ray": {
        term: "Raggi X",
        simple: "Un'immagine delle tue ossa e dei tuoi polmoni utilizzando una luce speciale. Rimani immobile per qualche secondo. NON fa male. Sicuro per la maggior parte delle persone, ma informa il medico se sei incinta.",
      },
      ultrasound: {
        term: "Ultrasuoni",
        simple: "Un'immagine dell'interno del tuo corpo utilizzando le onde sonore. Il medico applica il gel sulla pelle e vi passa sopra un dispositivo. NON fa male. Utilizzato per controllare i bambini durante la gravidanza.",
      },
      "ecg-ekg": {
        term: "ECG / EKG",
        simple: "Un test che controlla il ritmo cardiaco. Piccoli adesivi sono posizionati sul petto. NON fa male. Ci vogliono circa 5 minuti. Mostra se il tuo cuore batte normalmente.",
      },
      vaccination: {
        term: "Vaccinazione",
        simple: "Una piccola iniezione che insegna al tuo corpo a combattere una malattia PRIMA di ammalarti. Come allenarsi per il tuo sistema immunitario. Gli effetti collaterali (dolore al braccio, lieve febbre) sono NORMALI e significano che funziona.",
      },
      "blood-pressure": {
        term: "Pressione sanguigna",
        simple: "La forza del sangue che spinge contro le pareti dei vasi sanguigni. Il valore normale è intorno a 120/80. La pressione alta (oltre 140/90) è pericolosa perché non si avverte, ma danneggia cuore e cervello.",
      },
      "blood-sugar": {
        term: "Glicemia",
        simple: "La quantità di zucchero (glucosio) nel sangue. Il livello normale a digiuno è 70-100 mg/dl. Troppo alto significa diabete. Troppo basso ti fa venire le vertigini e trema. Testalo regolarmente se hai il diabete.",
      },
      bmi: {
        term: "BMI",
        simple: "Indice di massa corporea: un numero che mostra se il tuo peso è adeguato alla tua altezza. Sotto i 18,5 è sottopeso. 18,5-25 è normale. Oltre i 25 anni è in sovrappeso. Over 30 è obeso.",
      },
      "immune-system": {
        term: "Sistema immunitario",
        simple: "L'esercito del tuo corpo contro i germi. I globuli bianchi combattono le infezioni. I vaccini allenano il tuo sistema immunitario. Il buon cibo, il sonno e l’esercizio fisico lo rendono più forte.",
      },
    },
  },
  sq: {
    meta: {
      title: "Fjalor shëndetësor — Redi Health",
      description: "Terma mjekësorë të shpjeguar me fjalë të thjeshta",
    },
    title: "Fjalor shëndetësor",
    subtitle: "Terma mjekësorë të shpjeguar me fjalë të thjeshta.",
    searchPlaceholder: "Kërko terma...",
    searchAria: "Kërko terma mjekësorë",
    noResults: "Nuk u gjet asnjë term. Provo një kërkim tjetër.",
    allCount: "Të gjitha ({count})",
    categories: {
      condition: "Sëmundje",
      medication: "Barna",
      procedure: "Procedura",
      body: "Trupi dhe shëndeti",
      test: "Analiza",
    },
    entries: {
      hypertension: {
        term: "Tension i lartë i gjakut",
        simple: "Presion i lartë i gjakut. Gjaku shtyn shumë fort muret e enëve të gjakut. Pa trajtim mund të shkaktojë infarkt ose goditje në tru. Merr barnat çdo ditë.",
      },
      "diabetes-type-2": {
        term: "Diabeti (Tipi 2)",
        simple: "Trupi yt nuk e përdor mirë sheqerin. Sheqeri grumbullohet në gjak dhe dëmton organet. Të duhen barna, ushqim i shëndetshëm dhe lëvizje. NUK shkaktohet vetëm nga ngrënia e shumë sheqerit.",
      },
      anemia: {
        term: "Anemi",
        simple: "Nuk ke mjaft qeliza të kuqe të shëndetshme. Ndihesh i lodhur, i dobët ose i trullosur. Shpesh vjen nga mungesa e hekurit. Është shumë e zakonshme në shtatzëni.",
      },
      asthma: {
        term: "Astmë",
        simple: "Rrugët e frymëmarrjes ngushtohen dhe fryhen, prandaj e ke të vështirë të marrësh frymë. Mund të kesh fishkëllimë ose kollë. Përdor inhalatorin kur ndodh. Shmang tymin dhe pluhurin.",
      },
      "tuberculosis-tb": {
        term: "Tuberkuloz (TB)",
        simple: "Infeksion serioz në mushkëri. Kollitesh për javë, humb peshë dhe djersitesh natën. Përhapet në ajër. MUND të shërohet me 6 muaj barna, por duhet t'i mbarosh TË GJITHA tabletat.",
      },
      depression: {
        term: "Depresion",
        simple: "Gjendje mjekësore kur ndihesh i trishtuar, pa shpresë ose bosh për javë të tëra. NUK është dobësi dhe NUK është faji yt. Barnat dhe biseda me dikë mund të ndihmojnë. Kërko ndihmë.",
      },
      "hepatitis-b-c": {
        term: "Hepatiti B/C",
        simple: "Virus që sulmon mëlçinë. Mund të mos ndihesh i sëmurë për vite, por e dëmton mëlçinë ngadalë. Përhapet me gjak dhe gjilpëra. Ka vaksinë për hepatitin B.",
      },
      pneumonia: {
        term: "Pneumoni",
        simple: "Infeksion serioz në mushkëri. Ke temperaturë, kollë me sekrecione dhe vështirësi në frymëmarrje. Të duhen antibiotikë nga mjeku. Mund të jetë e rrezikshme për foshnjat dhe të moshuarit.",
      },
      gastritis: {
        term: "Gastrit",
        simple: "Shtresa e brendshme e stomakut është e irrituar ose e përflakur. Ndien djegie, të përziera ose fryrje. Shmang ushqimin pikant, alkoolin dhe duhanin. Barnat mund të ndihmojnë.",
      },
      eczema: {
        term: "Ekzemë",
        simple: "Zona të kruajtura, të kuqe dhe të thata në lëkurë. NUK ngjitet. Përdor shpesh krem hidratues. Shmang sapunët e fortë. Mjeku mund të japë krem që ndihmon.",
      },
      antibiotic: {
        term: "Antibiotik",
        simple: "Bar që vret bakteret. NUK vepron kundër viruseve si gripi ose ftohja. DUHET ta mbarosh të gjithë kurën edhe kur ndihesh më mirë, përndryshe mikrobet kthehen më të forta.",
      },
      ibuprofen: {
        term: "Ibuprofen",
        simple: "Qetësues dhimbjeje që ul edhe ënjtjen dhe temperaturën. Merre me ushqim për të mbrojtur stomakun. Mos merr më shumë se sa shkruan në kuti. Nuk është i sigurt në shtatzëni.",
      },
      paracetamol: {
        term: "Paracetamol",
        simple: "Qetësues i zakonshëm për dhimbje koke dhe temperaturë. I sigurt për shumicën e njerëzve, edhe për gratë shtatzëna. Mos merr më shumë se 4 gramë në ditë, sepse dëmton mëlçinë.",
      },
      insulin: {
        term: "Insulinë",
        simple: "Hormon që trupi yt e përdor për të shfrytëzuar sheqerin. Njerëzit me diabet mund të kenë nevojë për injeksione me insulinë. Nuk do të thotë se diabeti është më i rëndë, vetëm se trajtimi është ndryshe.",
      },
      metformin: {
        term: "Metformin",
        simple: "Barnat më të zakonshme për diabet. Ndihmon trupin të përdorë më mirë sheqerin. Merret me ushqim. Në fillim mund të japë shqetësim në stomak, por zakonisht kalon.",
      },
      "blood-test": {
        term: "Analizë gjaku",
        simple: "Një gjilpërë e vogël merr pak gjak nga krahu yt. E ndihmon mjekun të kontrollojë infeksione, anemi, diabet dhe shumë gjëra të tjera. Dhemb vetëm për një çast.",
      },
      "x-ray": {
        term: "Rëntgen",
        simple: "Pamje e kockave dhe mushkërive me rreze të veçanta. Qëndron i palëvizur për pak sekonda. Nuk dhemb. Është i sigurt për shumicën, por thuaji mjekut nëse je shtatzënë.",
      },
      ultrasound: {
        term: "Eko",
        simple: "Pamje nga brenda trupit me valë zanore. Mjeku vendos xhel në lëkurë dhe lëviz një aparat mbi të. Nuk dhemb. Përdoret shpesh për të kontrolluar foshnjën në shtatzëni.",
      },
      "ecg-ekg": {
        term: "EKG",
        simple: "Analizë që kontrollon ritmin e zemrës. Në kraharor vendosen ngjitëse të vogla. Nuk dhemb. Zgjat rreth 5 minuta. Tregon nëse zemra rreh normalisht.",
      },
      vaccination: {
        term: "Vaksinim",
        simple: "Një injeksion i vogël që e mëson trupin të luftojë një sëmundje para se të sëmuresh. Efektet anësore të lehta, si dhimbja e krahut ose temperatura e ulët, janë normale dhe tregojnë se po vepron.",
      },
      "blood-pressure": {
        term: "Presioni i gjakut",
        simple: "Forca me të cilën gjaku shtyn muret e enëve të gjakut. Normalja është rreth 120/80. Presioni i lartë mbi 140/90 është i rrezikshëm sepse nuk ndihet, por dëmton zemrën dhe trurin.",
      },
      "blood-sugar": {
        term: "Sheqeri në gjak",
        simple: "Sasia e glukozës në gjak. Niveli normal esëll është 70-100 mg/dL. Shumë i lartë do të thotë diabet. Shumë i ulët të bën të trullosur dhe të dridhesh.",
      },
      bmi: {
        term: "BMI",
        simple: "Indeksi i masës trupore tregon nëse pesha jote është e shëndetshme për gjatësinë tënde. Nën 18.5 është nënpeshë. 18.5-25 është normale. Mbi 25 është mbipeshë. Mbi 30 është obezitet.",
      },
      "immune-system": {
        term: "Sistemi imunitar",
        simple: "Është ushtria e trupit kundër mikrobeve. Qelizat e bardha luftojnë infeksionet. Vaksinat e stërvitin sistemin imunitar. Ushqimi i mirë, gjumi dhe lëvizja e forcojnë.",
      },
    },
  },
  rom: {
    meta: {
      title: "Glosaro vaš sastipen — Redi Health",
      description: "Doktorke alava vakerde ko simple vorbi",
    },
    title: "Glosaro vaš sastipen",
    subtitle: "Doktorke alava vakerde ko simple vorbi.",
    searchPlaceholder: "Rod termura...",
    searchAria: "Rod doktorke alava",
    noResults: "Na arakhlepes ni jekh termino. Proba aver rodipen.",
    allCount: "Sa ({count})",
    categories: {
      condition: "Nasvalimata",
      medication: "Lekura",
      procedure: "Proceduri",
      body: "Trupo thaj sastipen",
      test: "Analize",
    },
    entries: {
      hypertension: {
        term: "Bari tensija",
        simple: "Baro presija ande rat. Rat phendel but zorales pe vazura. Te na lečol, šaj te anel infarkto vaj udar ando šero. Pij lekuria sakko dives.",
      },
      "diabetes-type-2": {
        term: "Diabeto (Tip 2)",
        simple: "Tiro trupo na istemal šukar o šećero. O šećero butarelpe ande rat thaj našavel organura. Trubul tuke lekura, lačho xaben thaj miškipen. Na avel numa andar but šećero.",
      },
      anemia: {
        term: "Anemija",
        simple: "Na si dosta lače lolo ratune ćelije. Šaj te aves zurales, slabo vaj vrtoglavo. Čači put si andar na dosta gvožđe ando xaben. But daždivutni džuvlja hin katar kada.",
      },
      asthma: {
        term: "Astma",
        simple: "O droma vaš o phuvipen thonpe anglo thaj šuvon, pa dur te phendes. Šaj te avel zviždipen vaj khosipen. Ister tiro inhalatori kana avel. Dural drom katar dimos thaj prašina.",
      },
      "tuberculosis-tb": {
        term: "Tuberkuloza (TB)",
        simple: "Phari infekcija ande pulmona. Khoses but kurke, xas greutipe thaj sudores ratja. Džal pala vazduho. Šaj te lačol le 6 masekera lekurenca, ama trubul te phagres sa i tableti.",
      },
      depression: {
        term: "Depresija",
        simple: "Doktorki nasvalipen kana sal tužno, bi nadoždo vaj prazno but kurke. Na si slabipen thaj na si tiro doš. Lekura thaj vakeren evarenca šaj te pomožin. Mang pomoć.",
      },
      "hepatitis-b-c": {
        term: "Hepatitis B/C",
        simple: "Viruso so atakirinel e džigerica. Šaj te na aves nasvalo but bersa, ama polokes našavel e džigerica. Phirel pala rat thaj igle. Vaš Hepatitis B si vakcina.",
      },
      pneumonia: {
        term: "Pneumonija",
        simple: "Phari infekcija ande pulmona. Si tuke temperatura, khosipen le sluzosa thaj pharo phuvipen. Trubul antibiotiko katar doktoro. Šaj te avel opasno vaš čhavorre thaj phure manuša.",
      },
      gastritis: {
        term: "Gastritis",
        simple: "I koža ande per šuvli vaj iritirime. Aves te jakharel, te mučis vaj te bumbul. Dural katar lolo xaben, alkoholo thaj cigarete. Lekura šaj te pomožin.",
      },
      eczema: {
        term: "Ekcema",
        simple: "Suve, lale thaj khamne thana pe tiri koža. Na phirel katar jekh pe aver. Ister krema vaš koža but droma. Dural katar zorale sapuni. Doktoro šaj te del krema.",
      },
      antibiotic: {
        term: "Antibiotiko",
        simple: "Lek so murdarel bakterije. Na pomožinel kontra virusura sar gripa vaj prehlada. Trubul te phagres sa o tretmano, makar sal feder, kaj e mikrobi te na aven pale.",
      },
      ibuprofen: {
        term: "Ibuprofen",
        simple: "Lek vaš duk thaj vaš upalipen thaj temperatura. Leha lesa xabenesa te arakhes o per. Na le buteder sar si ramome pe kutija. Na si sigurno ande pušnipen.",
      },
      paracetamol: {
        term: "Paracetamol",
        simple: "Sikavno lek vaš šerutni duk thaj temperatura. Sigurno vaš but manuša, vi vaš pušne džuvlja. Na le buteder andar 4 grama ando dives, kaj našavel e džigerica.",
      },
      insulin: {
        term: "Insulin",
        simple: "Hormono so tiro trupo trubul te istemal o šećero. Le manusha le diabetosa šaj te trubun injekcije. Kada na phenel kaj tiro diabeto si pharedo, numa aver tretmano si.",
      },
      metformin: {
        term: "Metformin",
        simple: "Najbut istemaldo lek vaš diabeto. Pomožinel e truposke te istemal maj lačhes o šećero. Leha lesa xabenesa. Ando početko šaj te iritirinel o per, ama angle džal.",
      },
      "blood-test": {
        term: "Analiza rat",
        simple: "Cikni igla lel cikna rat andar o vast. Pomožinel e doktoroske te dikhel infekcije, anemija, diabeto thaj but aver. Dukhal numa jekh sekunda.",
      },
      "x-ray": {
        term: "Rentgen",
        simple: "Slika andar kosti thaj pulmona le specialne zrakosa. Ačhos mirno cikne sekundura. Na dukhal. Sigurno vaš but manuša, ama phen e doktoroske te sal pušni.",
      },
      ultrasound: {
        term: "Ultrazvuko",
        simple: "Slika andar tiro trupo le zvukoske talasenca. Doktoro del gel pe koža thaj phirel aparato. Na dukhal. But puti istemalpe te dikhen o čhavo ande pušnipen.",
      },
      "ecg-ekg": {
        term: "EKG",
        simple: "Analiza so dikhel sar khelel tiro jilo. Cikne lepilura thovelpe pe čhati. Na dukhal. Trajel pač minuta. Sikavel te o jilo čal normalno.",
      },
      vaccination: {
        term: "Vakcinacija",
        simple: "Cikni injekcija so sikhavel tiro trupo te marolpes kontra nasvalipen angleder te aves nasvalo. Cikne efekti sar duk pe vast vaj cikni temperatura si normalno thaj sikaven kaj kerel.",
      },
      "blood-pressure": {
        term: "Tensija e rat",
        simple: "Zor so la rat phendel pe zidura le vazoske. Normalno si paše 120/80. Bori tensija upral 140/90 si opasno kaj na šaj te lačhes, ama našavel jilo thaj šero.",
      },
      "blood-sugar": {
        term: "Šećero ande rat",
        simple: "Kobor glukoza si ande rat. Normalno na xale si 70-100 mg/dL. Te si but, si diabeto. Te si tele, avel tuke vrtoglavo thaj treses. Mero les but puti te si tuke diabeto.",
      },
      bmi: {
        term: "BMI",
        simple: "Indekso le truposke mase sikavel te si tiro greutipe lačho vaš tiro učiaripe. Telal 18.5 si cikno greutipe. 18.5-25 si normalno. Upral 25 si but greutipe. Upral 30 si obeziteta.",
      },
      "immune-system": {
        term: "Imuniteto",
        simple: "Kada si e vojska le truposki kontra mikrobi. Parne ratune ćelije maren infekcije. Vakcine trenirinen o imuniteto. Lačho xaben, sovipen thaj miškipen kerel les maj zoralo.",
      },
    },
  },
  ro: {
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
    entries: {
      hypertension: { term: "Hipertensiune", simple: "Tensiune arterială mare. Sângele apasă prea tare pe vasele de sânge. Poate provoca infarct sau accident vascular cerebral dacă nu este tratată. Ia medicamentele în fiecare zi." },
      "diabetes-type-2": { term: "Diabet (Tip 2)", simple: "Corpul tău nu folosește zahărul corect. Zahărul se acumulează în sânge și îți afectează organele. Ai nevoie de medicamente, mâncare sănătoasă și mișcare. NU este cauzat de prea mult zahăr." },
      anemia: { term: "Anemie", simple: "Prea puține globule roșii sănătoase. Te simți obosit, slăbit, amețit. Adesea cauzată de lipsa fierului (carne, fasole, spanac). Foarte frecventă la femei însărcinate." },
      asthma: { term: "Astm", simple: "Căile respiratorii se îngustează și se umflă, făcând respirația dificilă. Poți șuiera sau tuși. Folosește inhalatorul când se întâmplă. Evită fumul și praful." },
      "tuberculosis-tb": { term: "Tuberculoză (TB)", simple: "O infecție gravă la plămâni. Tuși săptămâni întregi, slăbești, transpiri noaptea. Se transmite prin aer. POATE fi vindecată cu 6 luni de medicamente — dar trebuie să termini TOATE pastilele." },
      depression: { term: "Depresie", simple: "O afecțiune medicală în care te simți trist, fără speranță sau gol interior săptămâni întregi. NU este slăbiciune. NU este vina ta. Medicamentele și vorbitul cu cineva pot ajuta. Te rugăm să ceri ajutor." },
      "hepatitis-b-c": { term: "Hepatită B/C", simple: "Un virus care atacă ficatul. Poate nu te simți bolnav ani de zile, dar îți afectează ficatul încet. Se transmite prin sânge și ace. Există vaccin pentru Hepatita B." },
      pneumonia: { term: "Pneumonie", simple: "O infecție gravă la plămâni. Ai febră, tuse cu mucus și dificultăți la respirație. Ai nevoie de antibiotice de la medic. Poate fi periculoasă pentru bebeluși și persoanele în vârstă." },
      gastritis: { term: "Gastrită", simple: "Mucoasa stomacului este iritată sau inflamată. Simți durere înțepătoare, greață sau balonare. Evită mâncarea picantă, alcoolul și fumatul. Medicamentele pot ajuta." },
      eczema: { term: "Eczemă", simple: "Zone mâncărime, roșii și uscate pe piele. NU este contagioasă. Folosește cremă hidratantă des. Evită săpunurile agresive. Medicul poate da o cremă care ajută." },
      antibiotic: { term: "Antibiotic", simple: "Medicament care ucide bacteriile (microbi). NU funcționează împotriva virusurilor precum gripa sau răceala. TREBUIE să termini tot tratamentul chiar dacă te simți mai bine, altfel microbii revin mai puternici." },
      ibuprofen: { term: "Ibuprofen", simple: "Un analgezic care reduce și inflamația și febra. Ia-l cu mâncare pentru a proteja stomacul. Nu lua mai mult decât scrie pe cutie. Nesigur în timpul sarcinii." },
      paracetamol: { term: "Paracetamol", simple: "Un analgezic obișnuit pentru dureri de cap și febră. Sigur pentru majoritatea oamenilor, inclusiv femei însărcinate. NU lua mai mult de 4 grame (8 comprimate) pe zi — prea mult îți afectează ficatul." },
      insulin: { term: "Insulină", simple: "Un hormon de care corpul tău are nevoie pentru a folosi zahărul. Persoanele cu diabet pot avea nevoie de injecții cu insulină. NU înseamnă că diabetul tău e mai grav — e doar un alt tratament." },
      metformin: { term: "Metformin", simple: "Cel mai frecvent medicament pentru diabet. Ajută corpul să folosească zahărul mai bine. Ia-l cu mâncare. Poate provoca disconfort stomacal la început — de obicei trece." },
      "blood-test": { term: "Analiză de sânge", simple: "Un ac mic ia puțin sânge din braț. Ajută medicul să verifice infecții, anemie, diabet și multe altele. Doare doar o secundă." },
      "x-ray": { term: "Radiografie", simple: "O imagine a oaselor și plămânilor folosind lumină specială. Stai nemișcat câteva secunde. NU doare. Sigură pentru majoritatea oamenilor, dar spune medicului dacă ești însărcinată." },
      ultrasound: { term: "Ecografie", simple: "O imagine din interiorul corpului folosind unde sonore. Medicul pune gel pe piele și mișcă un aparat. NU doare. Folosită pentru a verifica bebelușii în sarcină." },
      "ecg-ekg": { term: "ECG / EKG", simple: "Un test care verifică ritmul inimii. Se pun mici plăcuțe pe piept. NU doare. Durează circa 5 minute. Arată dacă inima bate normal." },
      vaccination: { term: "Vaccinare", simple: "O injecție mică care învață corpul să lupte împotriva unei boli ÎNAINTE să te îmbolnăvești. Efectele secundare (durere la braț, febră ușoară) sunt NORMALE și înseamnă că funcționează." },
      "blood-pressure": { term: "Tensiune arterială", simple: "Forța cu care sângele apasă pe pereții vaselor. Normal este în jur de 120/80. Tensiunea mare (peste 140/90) e periculoasă pentru că nu o simți, dar îți afectează inima și creierul." },
      "blood-sugar": { term: "Glicemie", simple: "Cantitatea de zahăr (glucoză) din sânge. Nivelul normal la nemâncat este 70-100 mg/dL. Prea mare înseamnă diabet. Prea mică te face amețit și tremurător." },
      bmi: { term: "IMC", simple: "Indicele de masă corporală — arată dacă greutatea ta e sănătoasă pentru înălțimea ta. Sub 18,5 e subponderal. 18,5-25 e normal. Peste 25 e supraponderal. Peste 30 e obezitate." },
      "immune-system": { term: "Sistem imunitar", simple: "Armata corpului tău împotriva microbilor. Globulele albe luptă împotriva infecțiilor. Vaccinurile antrenează sistemul imunitar. Mâncare bună, somn și mișcare îl întăresc." },
    },
  },
  hu: {
    meta: {
      title: "Egészségügyi szótár — Redi Health",
      description: "Orvosi kifejezések egyszerűen elmagyarázva",
    },
    title: "Egészségügyi szótár",
    subtitle: "Orvosi kifejezések egyszerűen elmagyarázva.",
    searchPlaceholder: "Keresés a fogalmak között...",
    searchAria: "Orvosi kifejezések keresése",
    noResults: "Nincs találat. Próbáljon másik keresést.",
    allCount: "Összes ({count})",
    categories: {
      condition: "Betegségek",
      medication: "Gyógyszerek",
      procedure: "Beavatkozások",
      body: "Test és egészség",
      test: "Vizsgálatok",
    },
    entries: {
      hypertension: {
        term: "Magas vérnyomás",
        simple: "A vér túl erősen nyomja az erek falát. Kezelés nélkül szívrohamot vagy stroke-ot okozhat. A gyógyszert minden nap be kell venni.",
      },
      "diabetes-type-2": {
        term: "Cukorbetegség (2-es típus)",
        simple: "A tested nem tudja jól használni a cukrot. A cukor felgyűlik a vérben és károsítja a szerveket. Gyógyszer, egészséges étel és mozgás kell. Nem csak a sok cukorevéstől alakul ki.",
      },
      anemia: {
        term: "Vérszegénység",
        simple: "Nincs elég egészséges vörösvértest a szervezetben. Fáradtnak, gyengének vagy szédülősnek érezheted magad. Gyakran vashiány okozza. Terhes nőknél nagyon gyakori.",
      },
      asthma: {
        term: "Asztma",
        simple: "A légutak beszűkülnek és megduzzadnak, ezért nehéz levegőt venni. Sípoló légzés vagy köhögés jelentkezhet. Ilyenkor használd az inhalátort. Kerüld a füstöt és a port.",
      },
      "tuberculosis-tb": {
        term: "Tuberkulózis (TBC)",
        simple: "Súlyos tüdőfertőzés. Hetekig köhögsz, fogysz és éjszaka izzadsz. Levegővel terjed. Hat hónap gyógyszerrel gyógyítható, de az összes tablettát végig kell szedni.",
      },
      depression: {
        term: "Depresszió",
        simple: "Olyan betegség, amikor hetekig szomorúnak, reménytelennek vagy üresnek érzed magad. Nem gyengeség, és nem a te hibád. Gyógyszer és beszélgetés is segíthet. Kérj segítséget.",
      },
      "hepatitis-b-c": {
        term: "Hepatitis B/C",
        simple: "A májat támadó vírus. Évekig lehet tünet nélkül, mégis lassan károsítja a májat. Vérrel és tűvel terjed. Hepatitis B ellen van oltás.",
      },
      pneumonia: {
        term: "Tüdőgyulladás",
        simple: "Súlyos fertőzés a tüdőben. Láz, váladékos köhögés és nehézlégzés jelentkezik. Orvostól kapott antibiotikum kell. Csecsemőknél és időseknél veszélyes lehet.",
      },
      gastritis: {
        term: "Gyomorhurut",
        simple: "A gyomor nyálkahártyája irritált vagy gyulladt. Égő fájdalmat, hányingert vagy puffadást okozhat. Kerüld a csípős ételt, az alkoholt és a dohányzást. A gyógyszer segíthet.",
      },
      eczema: {
        term: "Ekcéma",
        simple: "Viszkető, piros, száraz foltok a bőrön. Nem fertőző. Gyakran használj hidratáló krémet. Kerüld az erős szappanokat. Az orvos segítő krémet írhat fel.",
      },
      antibiotic: {
        term: "Antibiotikum",
        simple: "A baktériumokat pusztító gyógyszer. Vírusok, például influenza vagy nátha ellen nem hat. A teljes kúrát végig kell szedni akkor is, ha jobban vagy, különben a baktériumok visszatérnek.",
      },
      ibuprofen: {
        term: "Ibuprofen",
        simple: "Fájdalomcsillapító, ami a gyulladást és a lázat is csökkenti. Étellel vedd be, hogy kíméld a gyomrot. Ne vegyél be többet a dobozon jelzettnél. Terhesség alatt nem biztonságos.",
      },
      paracetamol: {
        term: "Paracetamol",
        simple: "Gyakori fájdalom- és lázcsillapító. A legtöbb embernek biztonságos, terhes nőknek is. Napi 4 grammnál többet ne szedj, mert károsítja a májat.",
      },
      insulin: {
        term: "Inzulin",
        simple: "Hormon, amely segíti a szervezetet a cukor használatában. A cukorbetegeknek néha inzulininjekció kell. Ez nem azt jelenti, hogy rosszabb lett a betegség, csak más kezelés szükséges.",
      },
      metformin: {
        term: "Metformin",
        simple: "A leggyakoribb cukorbetegség elleni gyógyszer. Segít, hogy a tested jobban használja a cukrot. Étellel kell bevenni. Kezdetben gyomorpanaszt okozhat, de ez többnyire elmúlik.",
      },
      "blood-test": {
        term: "Vérvizsgálat",
        simple: "Egy kis tű kevés vért vesz a karodból. Az orvos így ellenőriz fertőzést, vérszegénységet, cukorbetegséget és sok más dolgot. Csak egy pillanatig fáj.",
      },
      "x-ray": {
        term: "Röntgen",
        simple: "Kép a csontokról és a tüdőről speciális sugárral. Néhány másodpercig mozdulatlanul kell állni. Nem fáj. A legtöbb embernek biztonságos, de terhességet jelezni kell az orvosnak.",
      },
      ultrasound: {
        term: "Ultrahang",
        simple: "Kép a test belsejéről hanghullámokkal. Az orvos gélt tesz a bőrre, majd egy eszközt mozgat rajta. Nem fáj. Terhességben gyakran a baba ellenőrzésére használják.",
      },
      "ecg-ekg": {
        term: "EKG",
        simple: "A szív ritmusát vizsgáló teszt. Kis tappancsokat tesznek a mellkasra. Nem fáj. Körülbelül 5 percig tart. Megmutatja, hogy rendesen ver-e a szív.",
      },
      vaccination: {
        term: "Védőoltás",
        simple: "Kis injekció, amely megtanítja a szervezetet harcolni egy betegség ellen még azelőtt, hogy megbetegednél. Az enyhe mellékhatások, például a fájó kar vagy kis láz normálisak.",
      },
      "blood-pressure": {
        term: "Vérnyomás",
        simple: "Az a nyomás, amellyel a vér az erek falát nyomja. A normális érték körülbelül 120/80. A 140/90 feletti magas vérnyomás veszélyes, mert nem mindig érezhető, mégis károsítja a szívet és az agyat.",
      },
      "blood-sugar": {
        term: "Vércukor",
        simple: "A vérben lévő cukor mennyisége. Éhgyomorra a normál érték 70-100 mg/dL. A túl magas érték cukorbetegségre utal. A túl alacsony szédülést és remegést okoz.",
      },
      bmi: {
        term: "BMI",
        simple: "A testtömegindex megmutatja, hogy a súlyod megfelelő-e a magasságodhoz. 18,5 alatt soványság, 18,5-25 között normál, 25 fölött túlsúly, 30 fölött elhízás.",
      },
      "immune-system": {
        term: "Immunrendszer",
        simple: "Ez a tested védelme a kórokozók ellen. A fehérvérsejtek a fertőzésekkel harcolnak. Az oltások edzik az immunrendszert. A jó étel, az alvás és a mozgás erősíti.",
      },
    },
  },
  sk: {
    meta: {
      title: "Zdravotný slovník — Redi Health",
      description: "Zdravotné pojmy vysvetlené jednoduchými slovami",
    },
    title: "Zdravotný slovník",
    subtitle: "Zdravotné pojmy vysvetlené jednoduchými slovami.",
    searchPlaceholder: "Hľadať pojmy...",
    searchAria: "Hľadať zdravotné pojmy",
    noResults: "Nenašli sa žiadne pojmy. Skúste iné hľadanie.",
    allCount: "Všetko ({count})",
    categories: {
      condition: "Ochorenia",
      medication: "Lieky",
      procedure: "Postupy",
      body: "Telo a zdravie",
      test: "Vyšetrenia",
    },
    entries: {
      hypertension: {
        term: "Vysoký krvný tlak",
        simple: "Krv tlačí príliš silno na steny ciev. Ak sa nelieči, môže spôsobiť infarkt alebo mozgovú príhodu. Lieky treba užívať každý deň.",
      },
      "diabetes-type-2": {
        term: "Cukrovka (2. typ)",
        simple: "Telo nevie správne používať cukor. Cukor sa hromadí v krvi a poškodzuje orgány. Potrebujete lieky, zdravé jedlo a pohyb. Nevzniká iba z toho, že jete veľa cukru.",
      },
      anemia: {
        term: "Anémia",
        simple: "V tele nie je dosť zdravých červených krviniek. Cítite únavu, slabosť alebo závrat. Často ju spôsobuje nedostatok železa. Je veľmi častá u tehotných žien.",
      },
      asthma: {
        term: "Astma",
        simple: "Dýchacie cesty sa zúžia a opuchnú, preto sa ťažko dýcha. Môžete sipieť alebo kašľať. Keď sa to stane, použite inhalátor. Vyhýbajte sa dymu a prachu.",
      },
      "tuberculosis-tb": {
        term: "Tuberkulóza (TB)",
        simple: "Vážna infekcia pľúc. Kašlete celé týždne, chudnete a v noci sa potíte. Šíri sa vzduchom. Dá sa vyliečiť za 6 mesiacov liekov, ale musíte doužívať všetky tablety.",
      },
      depression: {
        term: "Depresia",
        simple: "Zdravotný stav, pri ktorom sa celé týždne cítite smutní, bez nádeje alebo prázdni. Nie je to slabosť ani vaša vina. Pomôcť môžu lieky a rozhovor s niekým. Požiadajte o pomoc.",
      },
      "hepatitis-b-c": {
        term: "Hepatitída B/C",
        simple: "Vírus, ktorý napáda pečeň. Roky nemusíte nič cítiť, ale pečeň sa pomaly poškodzuje. Šíri sa krvou a ihlami. Proti hepatitíde B existuje očkovanie.",
      },
      pneumonia: {
        term: "Zápal pľúc",
        simple: "Vážna infekcia pľúc. Máte horúčku, kašeľ s hlienom a ťažko sa vám dýcha. Potrebujete antibiotiká od lekára. Pre bábätká a starších ľudí môže byť nebezpečný.",
      },
      gastritis: {
        term: "Gastritída",
        simple: "Sliznica žalúdka je podráždená alebo zapálená. Cítite pálenie, nevoľnosť alebo nafukovanie. Vyhýbajte sa pikantnému jedlu, alkoholu a fajčeniu. Lieky môžu pomôcť.",
      },
      eczema: {
        term: "Ekzém",
        simple: "Svrbiace, červené a suché miesta na koži. Nie je nákazlivý. Často používajte hydratačný krém. Vyhýbajte sa silným mydlám. Lekár môže dať liečivý krém.",
      },
      antibiotic: {
        term: "Antibiotikum",
        simple: "Liek, ktorý zabíja baktérie. Nepôsobí na vírusy, ako je chrípka alebo nádcha. Musíte dobrat celú kúru aj keď sa cítite lepšie, inak sa baktérie vrátia silnejšie.",
      },
      ibuprofen: {
        term: "Ibuprofen",
        simple: "Liek proti bolesti, ktorý znižuje aj zápal a horúčku. Užívajte ho s jedlom, aby chránil žalúdok. Neberte viac, než je uvedené na balení. V tehotenstve nie je bezpečný.",
      },
      paracetamol: {
        term: "Paracetamol",
        simple: "Bežný liek na bolesť hlavy a horúčku. Je bezpečný pre väčšinu ľudí, aj pre tehotné ženy. Neužívajte viac ako 4 gramy denne, lebo poškodzuje pečeň.",
      },
      insulin: {
        term: "Inzulín",
        simple: "Hormón, ktorý telo potrebuje na používanie cukru. Ľudia s cukrovkou môžu potrebovať inzulínové injekcie. Neznamená to, že je cukrovka horšia, iba že treba iný typ liečby.",
      },
      metformin: {
        term: "Metformín",
        simple: "Najčastejší liek na cukrovku. Pomáha telu lepšie používať cukor. Berie sa s jedlom. Na začiatku môže podráždiť žalúdok, ale zvyčajne to prejde.",
      },
      "blood-test": {
        term: "Krvný test",
        simple: "Malá ihla odoberie trochu krvi z ruky. Lekár tak kontroluje infekcie, anémiu, cukrovku a veľa iných vecí. Bolí to iba chvíľu.",
      },
      "x-ray": {
        term: "Röntgen",
        simple: "Obrázok kostí a pľúc pomocou špeciálneho žiarenia. Na pár sekúnd stojíte bez pohybu. Nebolí to. Je bezpečný pre väčšinu ľudí, ale tehotenstvo treba povedať lekárovi.",
      },
      ultrasound: {
        term: "Ultrazvuk",
        simple: "Obrázok z vnútra tela pomocou zvukových vĺn. Lekár dá na kožu gél a pohybuje prístrojom. Nebolí to. Často sa používa na kontrolu dieťaťa v tehotenstve.",
      },
      "ecg-ekg": {
        term: "EKG",
        simple: "Vyšetrenie srdcového rytmu. Na hrudník sa nalepia malé elektródy. Nebolí to. Trvá asi 5 minút. Ukáže, či srdce bije normálne.",
      },
      vaccination: {
        term: "Očkovanie",
        simple: "Malá injekcia, ktorá naučí telo bojovať proti chorobe ešte skôr, ako ochoriete. Mierne vedľajšie účinky, napríklad boľavá ruka alebo slabá horúčka, sú normálne.",
      },
      "blood-pressure": {
        term: "Krvný tlak",
        simple: "Sila, ktorou krv tlačí na steny ciev. Normálna hodnota je asi 120/80. Vysoký tlak nad 140/90 je nebezpečný, lebo ho necítite, ale poškodzuje srdce a mozog.",
      },
      "blood-sugar": {
        term: "Cukor v krvi",
        simple: "Množstvo glukózy v krvi. Normálna hodnota nalačno je 70-100 mg/dL. Príliš vysoká znamená cukrovku. Príliš nízka spôsobí závrat a tras.",
      },
      bmi: {
        term: "BMI",
        simple: "Index telesnej hmotnosti ukazuje, či je vaša hmotnosť zdravá vzhľadom na výšku. Pod 18,5 je podváha, 18,5-25 je normálne, nad 25 nadváha a nad 30 obezita.",
      },
      "immune-system": {
        term: "Imunitný systém",
        simple: "Je to obrana tela proti mikróbom. Biele krvinky bojujú s infekciami. Vakcíny imunitný systém trénujú. Dobré jedlo, spánok a pohyb ho posilňujú.",
      },
    },
  },
  cs: {
    meta: {
      title: "Zdravotní slovník — Redi Health",
      description: "Lékařské pojmy vysvětlené jednoduchými slovy",
    },
    title: "Zdravotní slovník",
    subtitle: "Lékařské pojmy vysvětlené jednoduchými slovy.",
    searchPlaceholder: "Hledat pojmy...",
    searchAria: "Hledat lékařské pojmy",
    noResults: "Nebyly nalezeny žádné pojmy. Zkuste jiné hledání.",
    allCount: "Vše ({count})",
    categories: {
      condition: "Onemocnění",
      medication: "Léky",
      procedure: "Postupy",
      body: "Tělo a zdraví",
      test: "Vyšetření",
    },
    entries: {
      hypertension: {
        term: "Vysoký krevní tlak",
        simple: "Krev tlačí příliš silně na stěny cév. Bez léčby může způsobit infarkt nebo mrtvici. Léky je potřeba brát každý den.",
      },
      "diabetes-type-2": {
        term: "Cukrovka (2. typu)",
        simple: "Tělo neumí správně používat cukr. Cukr se hromadí v krvi a poškozuje orgány. Potřebujete léky, zdravé jídlo a pohyb. Nevzniká jen z toho, že jíte moc cukru.",
      },
      anemia: {
        term: "Anémie",
        simple: "V těle není dost zdravých červených krvinek. Cítíte únavu, slabost nebo motání hlavy. Často ji způsobuje nedostatek železa. U těhotných žen je velmi častá.",
      },
      asthma: {
        term: "Astma",
        simple: "Dýchací cesty se zúží a otečou, proto se hůře dýchá. Můžete sípat nebo kašlat. Když se to stane, použijte inhalátor. Vyhýbejte se kouři a prachu.",
      },
      "tuberculosis-tb": {
        term: "Tuberkulóza (TB)",
        simple: "Vážná infekce plic. Kašlete celé týdny, hubnete a v noci se potíte. Šíří se vzduchem. Lze ji vyléčit za 6 měsíců léků, ale musíte dobrat všechny tablety.",
      },
      depression: {
        term: "Deprese",
        simple: "Zdravotní stav, kdy jste celé týdny smutní, bez naděje nebo prázdní. Není to slabost ani vaše vina. Pomoci mohou léky i rozhovor s někým. Požádejte o pomoc.",
      },
      "hepatitis-b-c": {
        term: "Hepatitida B/C",
        simple: "Virus, který napadá játra. Roky nemusíte nic cítit, ale játra se pomalu poškozují. Šíří se krví a jehlami. Proti hepatitidě B existuje očkování.",
      },
      pneumonia: {
        term: "Zápal plic",
        simple: "Vážná infekce plic. Máte horečku, kašel s hlenem a špatně se vám dýchá. Potřebujete antibiotika od lékaře. Pro miminka a starší lidi může být nebezpečný.",
      },
      gastritis: {
        term: "Gastritida",
        simple: "Sliznice žaludku je podrážděná nebo zanícená. Cítíte pálení, nevolnost nebo nadýmání. Vyhýbejte se pálivému jídlu, alkoholu a kouření. Léky mohou pomoci.",
      },
      eczema: {
        term: "Ekzém",
        simple: "Svědivá, červená a suchá místa na kůži. Není nakažlivý. Často používejte hydratační krém. Vyhýbejte se silným mýdlům. Lékař může dát krém, který pomůže.",
      },
      antibiotic: {
        term: "Antibiotikum",
        simple: "Lék, který zabíjí bakterie. Nepůsobí na viry, jako je chřipka nebo nachlazení. Musíte dobrat celou kúru, i když je vám lépe, jinak se bakterie vrátí silnější.",
      },
      ibuprofen: {
        term: "Ibuprofen",
        simple: "Lék proti bolesti, který snižuje i zánět a horečku. Berte ho s jídlem, aby chránil žaludek. Neberte více, než je napsáno na krabičce. V těhotenství není bezpečný.",
      },
      paracetamol: {
        term: "Paracetamol",
        simple: "Běžný lék na bolest hlavy a horečku. Je bezpečný pro většinu lidí, i pro těhotné ženy. Neužívejte více než 4 gramy denně, protože poškozuje játra.",
      },
      insulin: {
        term: "Inzulin",
        simple: "Hormon, který tělo potřebuje k využití cukru. Lidé s cukrovkou mohou potřebovat inzulinové injekce. Neznamená to, že je cukrovka horší, jen je potřeba jiná léčba.",
      },
      metformin: {
        term: "Metformin",
        simple: "Nejběžnější lék na cukrovku. Pomáhá tělu lépe používat cukr. Užívá se s jídlem. Na začátku může dráždit žaludek, ale většinou to přejde.",
      },
      "blood-test": {
        term: "Krevní test",
        simple: "Malá jehla vezme trochu krve z ruky. Lékař tak kontroluje infekce, anémii, cukrovku a mnoho dalších věcí. Bolí to jen chvilku.",
      },
      "x-ray": {
        term: "Rentgen",
        simple: "Obrázek kostí a plic pomocí zvláštního záření. Několik sekund stojíte bez pohybu. Nebolí to. Je bezpečný pro většinu lidí, ale těhotenství je potřeba říct lékaři.",
      },
      ultrasound: {
        term: "Ultrazvuk",
        simple: "Obrázek z vnitřku těla pomocí zvukových vln. Lékař dá na kůži gel a pohybuje přístrojem. Nebolí to. Často se používá ke kontrole dítěte v těhotenství.",
      },
      "ecg-ekg": {
        term: "EKG",
        simple: "Vyšetření srdečního rytmu. Na hrudník se nalepí malé elektrody. Nebolí to. Trvá asi 5 minut. Ukáže, jestli srdce tluče normálně.",
      },
      vaccination: {
        term: "Očkování",
        simple: "Malá injekce, která naučí tělo bojovat proti nemoci ještě předtím, než onemocníte. Mírné nežádoucí účinky, například bolest ruky nebo slabá horečka, jsou normální.",
      },
      "blood-pressure": {
        term: "Krevní tlak",
        simple: "Síla, kterou krev tlačí na stěny cév. Normální hodnota je kolem 120/80. Vysoký tlak nad 140/90 je nebezpečný, protože ho nemusíte cítit, ale poškozuje srdce a mozek.",
      },
      "blood-sugar": {
        term: "Cukr v krvi",
        simple: "Množství glukózy v krvi. Normální hodnota nalačno je 70-100 mg/dL. Příliš vysoká znamená cukrovku. Příliš nízká způsobuje motání hlavy a třes.",
      },
      bmi: {
        term: "BMI",
        simple: "Index tělesné hmotnosti ukazuje, jestli je vaše váha zdravá vzhledem k výšce. Pod 18,5 je podváha, 18,5-25 normální, nad 25 nadváha a nad 30 obezita.",
      },
      "immune-system": {
        term: "Imunitní systém",
        simple: "Je to obrana těla proti mikrobům. Bílé krvinky bojují s infekcemi. Vakcíny imunitní systém trénují. Dobré jídlo, spánek a pohyb ho posilují.",
      },
    },
  },
  bg: {
    meta: {
      title: "Здравен речник — Redi Health",
      description: "Медицински термини, обяснени с прости думи",
    },
    title: "Здравен речник",
    subtitle: "Медицински термини, обяснени с прости думи.",
    searchPlaceholder: "Търси термини...",
    searchAria: "Търси медицински термини",
    noResults: "Няма намерени термини. Опитайте друго търсене.",
    allCount: "Всички ({count})",
    categories: {
      condition: "Заболявания",
      medication: "Лекарства",
      procedure: "Процедури",
      body: "Тяло и здраве",
      test: "Изследвания",
    },
    entries: {
      hypertension: {
        term: "Високо кръвно налягане",
        simple: "Кръвта натиска твърде силно стените на кръвоносните съдове. Ако не се лекува, може да доведе до инфаркт или инсулт. Лекарствата трябва да се вземат всеки ден.",
      },
      "diabetes-type-2": {
        term: "Диабет (тип 2)",
        simple: "Тялото не използва правилно захарта. Тя се натрупва в кръвта и уврежда органите. Нужни са лекарства, здравословна храна и движение. Не се причинява само от ядене на много захар.",
      },
      anemia: {
        term: "Анемия",
        simple: "Няма достатъчно здрави червени кръвни клетки. Чувствате се уморени, слаби или замаяни. Често е от недостиг на желязо. Много честа е при бременни жени.",
      },
      asthma: {
        term: "Астма",
        simple: "Дихателните пътища се стесняват и подуват, затова се диша трудно. Може да има свирене в гърдите или кашлица. Ползвайте инхалатора, когато стане така. Избягвайте дим и прах.",
      },
      "tuberculosis-tb": {
        term: "Туберкулоза (ТБ)",
        simple: "Сериозна инфекция в белите дробове. Кашляте седмици наред, отслабвате и се потите нощем. Разпространява се по въздуха. Може да се излекува с 6 месеца лекарства, но трябва да се изпият всички таблетки.",
      },
      depression: {
        term: "Депресия",
        simple: "Медицинско състояние, при което се чувствате тъжни, без надежда или празни седмици наред. Това не е слабост и не е ваша вина. Лекарства и разговор могат да помогнат. Потърсете помощ.",
      },
      "hepatitis-b-c": {
        term: "Хепатит B/C",
        simple: "Вирус, който напада черния дроб. Може години да нямате оплаквания, но черният дроб се уврежда бавно. Предава се чрез кръв и игли. Има ваксина срещу хепатит B.",
      },
      pneumonia: {
        term: "Пневмония",
        simple: "Сериозна инфекция в белите дробове. Имате температура, кашлица с храчки и трудно дишане. Трябват антибиотици от лекар. Може да е опасна за бебета и възрастни хора.",
      },
      gastritis: {
        term: "Гастрит",
        simple: "Лигавицата на стомаха е раздразнена или възпалена. Имате парене, гадене или подуване. Избягвайте люта храна, алкохол и пушене. Лекарствата могат да помогнат.",
      },
      eczema: {
        term: "Екзема",
        simple: "Сърбящи, червени и сухи участъци по кожата. Не е заразна. Използвайте често хидратиращ крем. Избягвайте силни сапуни. Лекарят може да даде крем, който помага.",
      },
      antibiotic: {
        term: "Антибиотик",
        simple: "Лекарство, което убива бактериите. Не действа срещу вируси като грип или настинка. Трябва да изпиете целия курс дори когато се почувствате по-добре, иначе микробите се връщат по-силни.",
      },
      ibuprofen: {
        term: "Ибупрофен",
        simple: "Обезболяващо лекарство, което намалява и възпалението, и температурата. Вземайте го с храна, за да пазите стомаха. Не вземайте повече от написаното на кутията. Не е безопасен при бременност.",
      },
      paracetamol: {
        term: "Парацетамол",
        simple: "Често лекарство за главоболие и температура. Безопасно е за повечето хора, включително бременни жени. Не вземайте повече от 4 грама на ден, защото уврежда черния дроб.",
      },
      insulin: {
        term: "Инсулин",
        simple: "Хормон, който тялото използва, за да обработва захарта. Хората с диабет може да имат нужда от инсулинови инжекции. Това не значи, че диабетът е по-тежък, а че лечението е различно.",
      },
      metformin: {
        term: "Метформин",
        simple: "Най-често използваното лекарство за диабет. Помага на тялото да използва по-добре захарта. Взема се с храна. В началото може да подразни стомаха, но обикновено минава.",
      },
      "blood-test": {
        term: "Кръвно изследване",
        simple: "Малка игла взема малко кръв от ръката. Помага на лекаря да провери инфекции, анемия, диабет и много други неща. Боли само за миг.",
      },
      "x-ray": {
        term: "Рентген",
        simple: "Снимка на костите и белите дробове със специални лъчи. Стоите неподвижно няколко секунди. Не боли. Безопасен е за повечето хора, но кажете на лекаря, ако сте бременна.",
      },
      ultrasound: {
        term: "Ехография",
        simple: "Образ на вътрешността на тялото със звукови вълни. Лекарят слага гел върху кожата и движи уред. Не боли. Често се използва за преглед на бебе при бременност.",
      },
      "ecg-ekg": {
        term: "ЕКГ",
        simple: "Изследване, което проверява ритъма на сърцето. На гърдите се поставят малки лепенки. Не боли. Трае около 5 минути. Показва дали сърцето бие нормално.",
      },
      vaccination: {
        term: "Ваксинация",
        simple: "Малка инжекция, която учи тялото да се бори с болест още преди да се разболеете. Леките странични ефекти, като болка в ръката или леко повишена температура, са нормални.",
      },
      "blood-pressure": {
        term: "Кръвно налягане",
        simple: "Силата, с която кръвта натиска стените на съдовете. Нормално е около 120/80. Високо налягане над 140/90 е опасно, защото може да не се усеща, но уврежда сърцето и мозъка.",
      },
      "blood-sugar": {
        term: "Кръвна захар",
        simple: "Количеството глюкоза в кръвта. Нормалната стойност на гладно е 70-100 mg/dL. Твърде високата означава диабет. Твърде ниската причинява замайване и треперене.",
      },
      bmi: {
        term: "ИТМ",
        simple: "Индексът на телесната маса показва дали теглото е здравословно за вашия ръст. Под 18,5 е поднормено тегло. 18,5-25 е нормално. Над 25 е наднормено тегло. Над 30 е затлъстяване.",
      },
      "immune-system": {
        term: "Имунна система",
        simple: "Това е армията на тялото срещу микробите. Белите кръвни клетки се борят с инфекциите. Ваксините тренират имунната система. Добрата храна, сънят и движението я укрепват.",
      },
    },
  },
  sr: {
    meta: {
      title: "Здравствени речник — Redi Health",
      description: "Медицински појмови објашњени једноставним речима",
    },
    title: "Здравствени речник",
    subtitle: "Медицински појмови објашњени једноставним речима.",
    searchPlaceholder: "Претражи појмове...",
    searchAria: "Претражи медицинске појмове",
    noResults: "Ниједан појам није пронађен. Пробајте другу претрагу.",
    allCount: "Све ({count})",
    categories: {
      condition: "Стања",
      medication: "Лекови",
      procedure: "Поступци",
      body: "Тело и здравље",
      test: "Прегледи",
    },
    entries: {
      hypertension: {
        term: "Висок крвни притисак",
        simple: "Крв превише јако притиска зидове крвних судова. Ако се не лечи, може да изазове инфаркт или шлог. Лекове треба узимати сваки дан.",
      },
      "diabetes-type-2": {
        term: "Дијабетес (тип 2)",
        simple: "Тело не користи шећер како треба. Шећер се накупља у крви и оштећује органе. Потребни су лекови, здрава храна и кретање. Не настаје само зато што једете много шећера.",
      },
      anemia: {
        term: "Анемија",
        simple: "Нема довољно здравих црвених крвних зрнаца. Осећате умор, слабост или вртоглавицу. Често је узрок недостатак гвожђа. Врло је честа код трудница.",
      },
      asthma: {
        term: "Астма",
        simple: "Дисајни путеви се сузе и отекну, па је тешко дисати. Можете да шиштите или кашљете. Када се то деси, користите инхалатор. Избегавајте дим и прашину.",
      },
      "tuberculosis-tb": {
        term: "Туберкулоза (ТБ)",
        simple: "Озбиљна инфекција плућа. Кашљете недељама, мршавите и ноћу се знојите. Шири се ваздухом. Може да се излечи за 6 месеци лекова, али све таблете морају да се попију до краја.",
      },
      depression: {
        term: "Депресија",
        simple: "Медицинско стање када се недељама осећате тужно, без наде или празно. То није слабост и није ваша кривица. Лекови и разговор са неким могу да помогну. Потражите помоћ.",
      },
      "hepatitis-b-c": {
        term: "Хепатитис B/C",
        simple: "Вирус који напада јетру. Годинама можда нећете осећати симптоме, али полако оштећује јетру. Преноси се крвљу и иглама. За хепатитис B постоји вакцина.",
      },
      pneumonia: {
        term: "Упала плућа",
        simple: "Озбиљна инфекција плућа. Имате температуру, кашаљ са шлајмом и тешко дишете. Потребни су антибиотици од лекара. Може бити опасна за бебе и старије људе.",
      },
      gastritis: {
        term: "Гастритис",
        simple: "Слузница желуца је надражена или упаљена. Осећате печење, мучнину или надутост. Избегавајте љуту храну, алкохол и пушење. Лекови могу да помогну.",
      },
      eczema: {
        term: "Екцем",
        simple: "Сврабљиве, црвене и суве промене на кожи. Није заразно. Често користите хидратантну крему. Избегавајте јаке сапуне. Лекар може да препише крему која помаже.",
      },
      antibiotic: {
        term: "Антибиотик",
        simple: "Лек који убија бактерије. Не делује на вирусе као што су грип или прехлада. Морате да попијете целу терапију чак и кад вам буде боље, иначе се бактерије враћају јаче.",
      },
      ibuprofen: {
        term: "Ибупрофен",
        simple: "Лек против болова који смањује и упалу и температуру. Узима се уз храну да би штитио желудац. Не узимајте више него што пише на кутији. Није безбедан у трудноћи.",
      },
      paracetamol: {
        term: "Парацетамол",
        simple: "Чест лек за главобољу и температуру. Безбедан је за већину људи, укључујући труднице. Не узимајте више од 4 грама дневно, јер оштећује јетру.",
      },
      insulin: {
        term: "Инсулин",
        simple: "Хормон који телу треба да користи шећер. Људима са дијабетесом понекад су потребне инсулинске инјекције. То не значи да је болест гора, већ да је лечење другачије.",
      },
      metformin: {
        term: "Метформин",
        simple: "Најчешћи лек за дијабетес. Помаже телу да боље користи шећер. Узима се уз храну. У почетку може да иритира желудац, али то обично прође.",
      },
      "blood-test": {
        term: "Анализа крви",
        simple: "Мала игла узме мало крви из руке. Лекар тако проверава инфекције, анемију, дијабетес и многе друге ствари. Боли само кратко.",
      },
      "x-ray": {
        term: "Рендген",
        simple: "Слика костију и плућа помоћу посебних зрака. Стојите мирно неколико секунди. Не боли. Безбедан је за већину људи, али реците лекару ако сте трудни.",
      },
      ultrasound: {
        term: "Ултразвук",
        simple: "Слика унутрашњости тела помоћу звучних таласа. Лекар ставља гел на кожу и помера апарат. Не боли. Често се користи за преглед бебе у трудноћи.",
      },
      "ecg-ekg": {
        term: "ЕКГ",
        simple: "Преглед који проверава срчани ритам. На груди се стављају мале налепнице. Не боли. Траје око 5 минута. Показује да ли срце куца нормално.",
      },
      vaccination: {
        term: "Вакцинација",
        simple: "Мала инјекција која учи тело да се бори против болести пре него што се разболите. Благе нуспојаве, као што су бол у руци или блага температура, нормалне су.",
      },
      "blood-pressure": {
        term: "Крвни притисак",
        simple: "Сила којом крв притиска зидове крвних судова. Нормално је око 120/80. Висок притисак изнад 140/90 је опасан јер га често не осећате, а оштећује срце и мозак.",
      },
      "blood-sugar": {
        term: "Шећер у крви",
        simple: "Количина глукозе у крви. Нормално наташте је 70-100 mg/dL. Превисок ниво значи дијабетес. Пренизак ниво изазива вртоглавицу и дрхтање.",
      },
      bmi: {
        term: "БМИ",
        simple: "Индекс телесне масе показује да ли је тежина здрава за вашу висину. Испод 18,5 је потхрањеност. 18,5-25 је нормално. Изнад 25 је вишак килограма. Изнад 30 је гојазност.",
      },
      "immune-system": {
        term: "Имуни систем",
        simple: "То је војска вашег тела против микроба. Бела крвна зрнца се боре са инфекцијама. Вакцине тренирају имуни систем. Добра храна, сан и кретање га јачају.",
      },
    },
  },
  hr: {
    meta: {
      title: "Zdravstveni rječnik — Redi Health",
      description: "Medicinski pojmovi objašnjeni jednostavnim riječima",
    },
    title: "Zdravstveni rječnik",
    subtitle: "Medicinski pojmovi objašnjeni jednostavnim riječima.",
    searchPlaceholder: "Pretraži pojmove...",
    searchAria: "Pretraži medicinske pojmove",
    noResults: "Nijedan pojam nije pronađen. Pokušajte s drugom pretragom.",
    allCount: "Sve ({count})",
    categories: {
      condition: "Stanja",
      medication: "Lijekovi",
      procedure: "Postupci",
      body: "Tijelo i zdravlje",
      test: "Pretrage",
    },
    entries: {
      hypertension: {
        term: "Visoki krvni tlak",
        simple: "Krv prejako pritišće stijenke krvnih žila. Ako se ne liječi, može uzrokovati infarkt ili moždani udar. Lijekove treba uzimati svaki dan.",
      },
      "diabetes-type-2": {
        term: "Dijabetes (tip 2)",
        simple: "Tijelo ne koristi šećer kako treba. Šećer se nakuplja u krvi i oštećuje organe. Potrebni su lijekovi, zdrava hrana i kretanje. Ne nastaje samo od jedenja puno šećera.",
      },
      anemia: {
        term: "Anemija",
        simple: "Nema dovoljno zdravih crvenih krvnih stanica. Osjećate umor, slabost ili vrtoglavicu. Često je uzrok manjak željeza. Vrlo je česta kod trudnica.",
      },
      asthma: {
        term: "Astma",
        simple: "Dišni putovi se suze i oteknu pa je teško disati. Možete piskati ili kašljati. Kad se to dogodi, koristite inhalator. Izbjegavajte dim i prašinu.",
      },
      "tuberculosis-tb": {
        term: "Tuberkuloza (TB)",
        simple: "Ozbiljna infekcija pluća. Kašljete tjednima, mršavite i znojite se noću. Širi se zrakom. Može se izliječiti sa 6 mjeseci lijekova, ali sve tablete treba popiti do kraja.",
      },
      depression: {
        term: "Depresija",
        simple: "Medicinsko stanje kada se tjednima osjećate tužno, bez nade ili prazno. To nije slabost i nije vaša krivnja. Lijekovi i razgovor mogu pomoći. Zatražite pomoć.",
      },
      "hepatitis-b-c": {
        term: "Hepatitis B/C",
        simple: "Virus koji napada jetru. Godinama možda nećete osjećati simptome, ali polako oštećuje jetru. Prenosi se krvlju i iglama. Za hepatitis B postoji cjepivo.",
      },
      pneumonia: {
        term: "Upala pluća",
        simple: "Ozbiljna infekcija pluća. Imate temperaturu, kašalj sa sluzi i teško dišete. Potrebni su antibiotici od liječnika. Može biti opasna za bebe i starije osobe.",
      },
      gastritis: {
        term: "Gastritis",
        simple: "Sluznica želuca je nadražena ili upaljena. Osjećate pečenje, mučninu ili nadutost. Izbjegavajte ljutu hranu, alkohol i pušenje. Lijekovi mogu pomoći.",
      },
      eczema: {
        term: "Ekcem",
        simple: "Svrbljive, crvene i suhe promjene na koži. Nije zarazan. Često koristite hidratantnu kremu. Izbjegavajte jake sapune. Liječnik može dati kremu koja pomaže.",
      },
      antibiotic: {
        term: "Antibiotik",
        simple: "Lijek koji ubija bakterije. Ne djeluje protiv virusa kao što su gripa ili prehlada. Morate popiti cijelu terapiju čak i kada vam bude bolje, inače se bakterije vraćaju jače.",
      },
      ibuprofen: {
        term: "Ibuprofen",
        simple: "Lijek protiv bolova koji smanjuje i upalu i temperaturu. Uzimajte ga uz hranu kako biste zaštitili želudac. Nemojte uzimati više nego što piše na kutiji. Nije siguran u trudnoći.",
      },
      paracetamol: {
        term: "Paracetamol",
        simple: "Čest lijek za glavobolju i temperaturu. Siguran je za većinu ljudi, uključujući trudnice. Nemojte uzimati više od 4 grama dnevno jer oštećuje jetru.",
      },
      insulin: {
        term: "Inzulin",
        simple: "Hormon koji tijelu treba da koristi šećer. Osobama s dijabetesom ponekad trebaju inzulinske injekcije. To ne znači da je bolest gora, nego da je liječenje drukčije.",
      },
      metformin: {
        term: "Metformin",
        simple: "Najčešći lijek za dijabetes. Pomaže tijelu da bolje koristi šećer. Uzima se uz hranu. Na početku može uzrokovati smetnje u želucu, ali to obično prođe.",
      },
      "blood-test": {
        term: "Krvna pretraga",
        simple: "Mala igla uzima malo krvi iz ruke. Liječnik tako provjerava infekcije, anemiju, dijabetes i mnogo drugih stvari. Boli samo kratko.",
      },
      "x-ray": {
        term: "Rendgen",
        simple: "Snimka kostiju i pluća pomoću posebnih zraka. Mirno stojite nekoliko sekundi. Ne boli. Siguran je za većinu ljudi, ali recite liječniku ako ste trudni.",
      },
      ultrasound: {
        term: "Ultrazvuk",
        simple: "Slika unutrašnjosti tijela pomoću zvučnih valova. Liječnik stavi gel na kožu i pomiče uređaj. Ne boli. Često se koristi za pregled bebe u trudnoći.",
      },
      "ecg-ekg": {
        term: "EKG",
        simple: "Pretraga koja provjerava ritam srca. Na prsa se stave male naljepnice. Ne boli. Traje oko 5 minuta. Pokazuje kuca li srce normalno.",
      },
      vaccination: {
        term: "Cijepljenje",
        simple: "Mala injekcija koja uči tijelo da se bori protiv bolesti prije nego što se razbolite. Blage nuspojave, kao što su bol u ruci ili blaga temperatura, normalne su.",
      },
      "blood-pressure": {
        term: "Krvni tlak",
        simple: "Sila kojom krv pritišće stijenke krvnih žila. Normalno je oko 120/80. Visok tlak iznad 140/90 je opasan jer ga često ne osjećate, a oštećuje srce i mozak.",
      },
      "blood-sugar": {
        term: "Šećer u krvi",
        simple: "Količina glukoze u krvi. Normalna vrijednost natašte je 70-100 mg/dL. Previsoka vrijednost znači dijabetes. Preniska uzrokuje vrtoglavicu i drhtanje.",
      },
      bmi: {
        term: "BMI",
        simple: "Indeks tjelesne mase pokazuje je li težina zdrava za vašu visinu. Ispod 18,5 je pothranjenost. 18,5-25 je normalno. Iznad 25 je prekomjerna težina. Iznad 30 je debljina.",
      },
      "immune-system": {
        term: "Imunološki sustav",
        simple: "To je vojska tijela protiv mikroba. Bijele krvne stanice bore se protiv infekcija. Cjepiva treniraju imunološki sustav. Dobra hrana, san i kretanje ga jačaju.",
      },
    },
  },
  bs: {
    meta: {
      title: "Zdravstveni rječnik — Redi Health",
      description: "Medicinski pojmovi objašnjeni jednostavnim riječima",
    },
    title: "Zdravstveni rječnik",
    subtitle: "Medicinski pojmovi objašnjeni jednostavnim riječima.",
    searchPlaceholder: "Pretraži pojmove...",
    searchAria: "Pretraži medicinske pojmove",
    noResults: "Nijedan pojam nije pronađen. Probajte drugu pretragu.",
    allCount: "Sve ({count})",
    categories: {
      condition: "Stanja",
      medication: "Lijekovi",
      procedure: "Postupci",
      body: "Tijelo i zdravlje",
      test: "Pretrage",
    },
    entries: {
      hypertension: {
        term: "Visok krvni pritisak",
        simple: "Krv prejako pritiska zidove krvnih sudova. Ako se ne liječi, može izazvati infarkt ili moždani udar. Lijekove treba uzimati svaki dan.",
      },
      "diabetes-type-2": {
        term: "Dijabetes (tip 2)",
        simple: "Tijelo ne koristi šećer kako treba. Šećer se nakuplja u krvi i oštećuje organe. Potrebni su lijekovi, zdrava hrana i kretanje. Ne nastaje samo od jedenja puno šećera.",
      },
      anemia: {
        term: "Anemija",
        simple: "Nema dovoljno zdravih crvenih krvnih zrnaca. Osjećate umor, slabost ili vrtoglavicu. Često je uzrok manjak željeza. Vrlo je česta kod trudnica.",
      },
      asthma: {
        term: "Astma",
        simple: "Disajni putevi se suze i oteknu pa je teško disati. Možete šištati ili kašljati. Kad se to desi, koristite inhalator. Izbjegavajte dim i prašinu.",
      },
      "tuberculosis-tb": {
        term: "Tuberkuloza (TB)",
        simple: "Ozbiljna infekcija pluća. Kašljete sedmicama, mršate i noću se znojite. Širi se zrakom. Može se izliječiti sa 6 mjeseci lijekova, ali sve tablete treba popiti do kraja.",
      },
      depression: {
        term: "Depresija",
        simple: "Medicinsko stanje kada se sedmicama osjećate tužno, bez nade ili prazno. To nije slabost i nije vaša krivica. Lijekovi i razgovor mogu pomoći. Potražite pomoć.",
      },
      "hepatitis-b-c": {
        term: "Hepatitis B/C",
        simple: "Virus koji napada jetru. Godinama možda nećete osjećati simptome, ali polako oštećuje jetru. Prenosi se krvlju i iglama. Za hepatitis B postoji vakcina.",
      },
      pneumonia: {
        term: "Upala pluća",
        simple: "Ozbiljna infekcija pluća. Imate temperaturu, kašalj sa sluzi i teško dišete. Potrebni su antibiotici od ljekara. Može biti opasna za bebe i starije osobe.",
      },
      gastritis: {
        term: "Gastritis",
        simple: "Sluznica želuca je nadražena ili upaljena. Osjećate pečenje, mučninu ili nadutost. Izbjegavajte ljutu hranu, alkohol i pušenje. Lijekovi mogu pomoći.",
      },
      eczema: {
        term: "Ekcem",
        simple: "Svrbljive, crvene i suhe promjene na koži. Nije zarazan. Često koristite hidratantnu kremu. Izbjegavajte jake sapune. Ljekar može dati kremu koja pomaže.",
      },
      antibiotic: {
        term: "Antibiotik",
        simple: "Lijek koji ubija bakterije. Ne djeluje protiv virusa kao što su gripa ili prehlada. Morate popiti cijelu terapiju čak i kada vam bude bolje, inače se bakterije vraćaju jače.",
      },
      ibuprofen: {
        term: "Ibuprofen",
        simple: "Lijek protiv bolova koji smanjuje i upalu i temperaturu. Uzimajte ga uz hranu da zaštitite želudac. Nemojte uzimati više nego što piše na kutiji. Nije siguran u trudnoći.",
      },
      paracetamol: {
        term: "Paracetamol",
        simple: "Čest lijek za glavobolju i temperaturu. Siguran je za većinu ljudi, uključujući trudnice. Nemojte uzimati više od 4 grama dnevno jer oštećuje jetru.",
      },
      insulin: {
        term: "Inzulin",
        simple: "Hormon koji tijelu treba da koristi šećer. Osobama s dijabetesom ponekad trebaju inzulinske injekcije. To ne znači da je bolest gora, nego da je liječenje drugačije.",
      },
      metformin: {
        term: "Metformin",
        simple: "Najčešći lijek za dijabetes. Pomaže tijelu da bolje koristi šećer. Uzima se uz hranu. Na početku može izazvati tegobe sa želucem, ali to obično prođe.",
      },
      "blood-test": {
        term: "Krvna pretraga",
        simple: "Mala igla uzima malo krvi iz ruke. Ljekar tako provjerava infekcije, anemiju, dijabetes i mnogo drugih stvari. Boli samo kratko.",
      },
      "x-ray": {
        term: "Rentgen",
        simple: "Snimak kostiju i pluća pomoću posebnih zraka. Mirno stojite nekoliko sekundi. Ne boli. Siguran je za većinu ljudi, ali recite ljekaru ako ste trudni.",
      },
      ultrasound: {
        term: "Ultrazvuk",
        simple: "Slika unutrašnjosti tijela pomoću zvučnih valova. Ljekar stavi gel na kožu i pomjera uređaj. Ne boli. Često se koristi za pregled bebe u trudnoći.",
      },
      "ecg-ekg": {
        term: "EKG",
        simple: "Pretraga koja provjerava ritam srca. Na prsa se stave male naljepnice. Ne boli. Traje oko 5 minuta. Pokazuje kuca li srce normalno.",
      },
      vaccination: {
        term: "Vakcinacija",
        simple: "Mala injekcija koja uči tijelo da se bori protiv bolesti prije nego što se razbolite. Blage nuspojave, kao što su bol u ruci ili blaga temperatura, normalne su.",
      },
      "blood-pressure": {
        term: "Krvni pritisak",
        simple: "Sila kojom krv pritiska zidove krvnih sudova. Normalno je oko 120/80. Visok pritisak iznad 140/90 je opasan jer ga često ne osjećate, a oštećuje srce i mozak.",
      },
      "blood-sugar": {
        term: "Šećer u krvi",
        simple: "Količina glukoze u krvi. Normalna vrijednost natašte je 70-100 mg/dL. Previsoka vrijednost znači dijabetes. Preniska uzrokuje vrtoglavicu i drhtanje.",
      },
      bmi: {
        term: "BMI",
        simple: "Indeks tjelesne mase pokazuje je li težina zdrava za vašu visinu. Ispod 18,5 je pothranjenost. 18,5-25 je normalno. Iznad 25 je prekomjerna težina. Iznad 30 je gojaznost.",
      },
      "immune-system": {
        term: "Imuni sistem",
        simple: "To je vojska tijela protiv mikroba. Bijela krvna zrnca bore se protiv infekcija. Vakcine treniraju imuni sistem. Dobra hrana, san i kretanje ga jačaju.",
      },
    },
  },
  mk: {
    meta: {
      title: "Здравствен речник — Redi Health",
      description: "Медицински поими објаснети со едноставни зборови",
    },
    title: "Здравствен речник",
    subtitle: "Медицински поими објаснети со едноставни зборови.",
    searchPlaceholder: "Пребарај поими...",
    searchAria: "Пребарај медицински поими",
    noResults: "Не се пронајдени поими. Обидете се со друго пребарување.",
    allCount: "Сите ({count})",
    categories: {
      condition: "Состојби",
      medication: "Лекови",
      procedure: "Постапки",
      body: "Тело и здравје",
      test: "Испитувања",
    },
    entries: {
      hypertension: {
        term: "Висок крвен притисок",
        simple: "Крвта премногу силно притиска на ѕидовите на крвните садови. Ако не се лекува, може да предизвика инфаркт или мозочен удар. Лековите треба да се земаат секој ден.",
      },
      "diabetes-type-2": {
        term: "Дијабетес (тип 2)",
        simple: "Телото не го користи шеќерот правилно. Шеќерот се собира во крвта и ги оштетува органите. Потребни се лекови, здрава храна и движење. Не настанува само од јадење многу шеќер.",
      },
      anemia: {
        term: "Анемија",
        simple: "Нема доволно здрави црвени крвни клетки. Се чувствувате уморно, слабо или вртоглаво. Често причината е недостаток на железо. Многу е честа кај бремени жени.",
      },
      asthma: {
        term: "Астма",
        simple: "Дишните патишта се стеснуваат и отекуваат, па е тешко да се дише. Може да свирите при дишење или да кашлате. Кога ќе се случи тоа, користете инхалатор. Избегнувајте чад и прашина.",
      },
      "tuberculosis-tb": {
        term: "Туберкулоза (ТБ)",
        simple: "Сериозна инфекција на белите дробови. Кашлате со недели, слабеете и ноќе се потите. Се шири преку воздух. Може да се излекува со 6 месеци лекови, но мора да се испијат сите таблети.",
      },
      depression: {
        term: "Депресија",
        simple: "Медицинска состојба кога со недели се чувствувате тажно, без надеж или празно. Тоа не е слабост и не е ваша вина. Лекови и разговор можат да помогнат. Побарајте помош.",
      },
      "hepatitis-b-c": {
        term: "Хепатит Б/Ц",
        simple: "Вирус што го напаѓа црниот дроб. Може со години да немате симптоми, но полека го оштетува црниот дроб. Се пренесува преку крв и игли. За хепатит Б постои вакцина.",
      },
      pneumonia: {
        term: "Пневмонија",
        simple: "Сериозна инфекција на белите дробови. Имате температура, кашлица со секрет и тешко дишете. Потребни се антибиотици од лекар. Може да биде опасна за бебиња и постари луѓе.",
      },
      gastritis: {
        term: "Гастритис",
        simple: "Слузницата на желудникот е надразнета или воспалена. Чувствувате печење, мачнина или надуеност. Избегнувајте лута храна, алкохол и пушење. Лековите можат да помогнат.",
      },
      eczema: {
        term: "Егзема",
        simple: "Чешачки, црвени и суви места на кожата. Не е заразна. Често користете хидратантна крема. Избегнувајте силни сапуни. Лекар може да даде крема што помага.",
      },
      antibiotic: {
        term: "Антибиотик",
        simple: "Лек што убива бактерии. Не делува против вируси како грип или настинка. Мора да се испие целата терапија и кога ќе ви стане подобро, инаку бактериите се враќаат посилни.",
      },
      ibuprofen: {
        term: "Ибупрофен",
        simple: "Лек против болка што ја намалува и воспаленоста и температурата. Земете го со храна за да го заштитите желудникот. Не земајте повеќе од напишаното на кутијата. Не е безбеден во бременост.",
      },
      paracetamol: {
        term: "Парацетамол",
        simple: "Чест лек за главоболка и температура. Безбеден е за повеќето луѓе, и за бремени жени. Не земајте повеќе од 4 грама дневно, бидејќи го оштетува црниот дроб.",
      },
      insulin: {
        term: "Инсулин",
        simple: "Хормон што му треба на телото за да го користи шеќерот. Луѓето со дијабетес понекогаш имаат потреба од инсулински инјекции. Тоа не значи дека болеста е полоша, туку дека третманот е различен.",
      },
      metformin: {
        term: "Метформин",
        simple: "Најчестиот лек за дијабетес. Му помага на телото подобро да го користи шеќерот. Се зема со храна. На почеток може да предизвика тегоби во желудникот, но тоа обично поминува.",
      },
      "blood-test": {
        term: "Крвна анализа",
        simple: "Мала игла зема малку крв од раката. Така лекарот проверува инфекции, анемија, дијабетес и многу други работи. Боли само кратко.",
      },
      "x-ray": {
        term: "Рендген",
        simple: "Слика на коските и белите дробови со посебни зраци. Стоите мирно неколку секунди. Не боли. Безбеден е за повеќето луѓе, но кажете му на лекарот ако сте бремени.",
      },
      ultrasound: {
        term: "Ултразвук",
        simple: "Слика од внатрешноста на телото со звучни бранови. Лекарот става гел на кожата и движи апарат. Не боли. Често се користи за преглед на бебе во бременост.",
      },
      "ecg-ekg": {
        term: "ЕКГ",
        simple: "Испитување што го проверува срцевиот ритам. На градите се ставаат мали лепенки. Не боли. Трае околу 5 минути. Покажува дали срцето чука нормално.",
      },
      vaccination: {
        term: "Вакцинација",
        simple: "Мала инјекција што го учи телото да се бори против болест уште пред да се разболите. Благи несакани ефекти, како болка во раката или мала температура, се нормални.",
      },
      "blood-pressure": {
        term: "Крвен притисок",
        simple: "Силата со која крвта притиска на ѕидовите на крвните садови. Нормално е околу 120/80. Висок притисок над 140/90 е опасен бидејќи често не се чувствува, а ги оштетува срцето и мозокот.",
      },
      "blood-sugar": {
        term: "Шеќер во крвта",
        simple: "Количината на глукоза во крвта. Нормалната вредност на гладно е 70-100 mg/dL. Премногу висока вредност значи дијабетес. Премногу ниска предизвикува вртоглавица и тресење.",
      },
      bmi: {
        term: "БМИ",
        simple: "Индексот на телесна маса покажува дали тежината е здрава за вашата висина. Под 18,5 е потхранетост. 18,5-25 е нормално. Над 25 е прекумерна тежина. Над 30 е дебелина.",
      },
      "immune-system": {
        term: "Имун систем",
        simple: "Тоа е војската на телото против микробите. Белите крвни клетки се борат со инфекции. Вакцините го тренираат имунолошкиот систем. Добра храна, сон и движење го зајакнуваат.",
      },
    },
  },
  sl: {
    meta: {
      title: "Zdravstveni slovar — Redi Health",
      description: "Medicinski izrazi, razloženi s preprostimi besedami",
    },
    title: "Zdravstveni slovar",
    subtitle: "Medicinski izrazi, razloženi s preprostimi besedami.",
    searchPlaceholder: "Poišči izraze...",
    searchAria: "Poišči medicinske izraze",
    noResults: "Ni najdenih izrazov. Poskusite z drugim iskanjem.",
    allCount: "Vse ({count})",
    categories: {
      condition: "Stanja",
      medication: "Zdravila",
      procedure: "Postopki",
      body: "Telo in zdravje",
      test: "Preiskave",
    },
    entries: {
      hypertension: {
        term: "Visok krvni tlak",
        simple: "Kri premočno pritiska na stene žil. Če se ne zdravi, lahko povzroči srčni napad ali možgansko kap. Zdravila je treba jemati vsak dan.",
      },
      "diabetes-type-2": {
        term: "Sladkorna bolezen (tip 2)",
        simple: "Telo ne uporablja sladkorja pravilno. Sladkor se nabira v krvi in poškoduje organe. Potrebni so zdravila, zdrava hrana in gibanje. Ne nastane samo zaradi uživanja veliko sladkorja.",
      },
      anemia: {
        term: "Anemija",
        simple: "V telesu ni dovolj zdravih rdečih krvnih celic. Počutite se utrujeni, šibki ali omotični. Pogosto jo povzroča pomanjkanje železa. Pri nosečnicah je zelo pogosta.",
      },
      asthma: {
        term: "Astma",
        simple: "Dihalne poti se zožijo in otečejo, zato je težko dihati. Lahko piskate ali kašljate. Ko se to zgodi, uporabite inhalator. Izogibajte se dimu in prahu.",
      },
      "tuberculosis-tb": {
        term: "Tuberkuloza (TB)",
        simple: "Resna okužba pljuč. Kašljate več tednov, hujšate in se ponoči potite. Širi se po zraku. Lahko se pozdravi s 6 meseci zdravil, vendar morate vzeti vse tablete do konca.",
      },
      depression: {
        term: "Depresija",
        simple: "Zdravstveno stanje, pri katerem se več tednov počutite žalostni, brez upanja ali prazni. To ni šibkost in ni vaša krivda. Pomagajo lahko zdravila in pogovor. Prosite za pomoč.",
      },
      "hepatitis-b-c": {
        term: "Hepatitis B/C",
        simple: "Virus, ki napada jetra. Leta morda ne boste imeli težav, vendar počasi poškoduje jetra. Prenaša se s krvjo in iglami. Za hepatitis B obstaja cepljenje.",
      },
      pneumonia: {
        term: "Pljučnica",
        simple: "Resna okužba pljuč. Imate vročino, kašelj s sluzjo in težko dihate. Potrebujete antibiotike od zdravnika. Lahko je nevarna za dojenčke in starejše.",
      },
      gastritis: {
        term: "Gastritis",
        simple: "Želodčna sluznica je razdražena ali vneta. Čutite pekočo bolečino, slabost ali napihnjenost. Izogibajte se pekoči hrani, alkoholu in kajenju. Zdravila lahko pomagajo.",
      },
      eczema: {
        term: "Ekcem",
        simple: "Srbeče, rdeče in suhe lise na koži. Ni nalezljiv. Pogosto uporabljajte vlažilno kremo. Izogibajte se močnim milom. Zdravnik lahko predpiše kremo, ki pomaga.",
      },
      antibiotic: {
        term: "Antibiotik",
        simple: "Zdravilo, ki ubija bakterije. Ne deluje proti virusom, kot sta gripa ali prehlad. Celo kuro morate jemati do konca, tudi če se počutite bolje, sicer se bakterije vrnejo močnejše.",
      },
      ibuprofen: {
        term: "Ibuprofen",
        simple: "Zdravilo proti bolečini, ki zmanjša tudi vnetje in vročino. Vzemite ga s hrano, da zaščitite želodec. Ne vzemite več, kot piše na škatli. V nosečnosti ni varen.",
      },
      paracetamol: {
        term: "Paracetamol",
        simple: "Pogosto zdravilo za glavobol in vročino. Varno je za večino ljudi, tudi za nosečnice. Ne vzemite več kot 4 grame na dan, ker poškoduje jetra.",
      },
      insulin: {
        term: "Inzulin",
        simple: "Hormon, ki ga telo potrebuje za uporabo sladkorja. Ljudje s sladkorno boleznijo včasih potrebujejo inzulinske injekcije. To ne pomeni, da je bolezen hujša, ampak da je zdravljenje drugačno.",
      },
      metformin: {
        term: "Metformin",
        simple: "Najpogostejše zdravilo za sladkorno bolezen. Pomaga telesu bolje uporabljati sladkor. Jemlje se s hrano. Na začetku lahko povzroči težave z želodcem, a to običajno mine.",
      },
      "blood-test": {
        term: "Krvna preiskava",
        simple: "Majhna igla vzame malo krvi iz roke. Tako zdravnik preveri okužbe, anemijo, sladkorno bolezen in še veliko drugega. Zaboli le za trenutek.",
      },
      "x-ray": {
        term: "Rentgen",
        simple: "Slika kosti in pljuč s posebnimi žarki. Nekaj sekund stojite pri miru. Ne boli. Za večino ljudi je varen, vendar povejte zdravniku, če ste noseči.",
      },
      ultrasound: {
        term: "Ultrazvok",
        simple: "Slika notranjosti telesa s pomočjo zvočnih valov. Zdravnik nanese gel na kožo in premika napravo. Ne boli. Pogosto se uporablja za pregled otroka v nosečnosti.",
      },
      "ecg-ekg": {
        term: "EKG",
        simple: "Preiskava srčnega ritma. Na prsni koš se namestijo majhne nalepke. Ne boli. Traja približno 5 minut. Pokaže, ali srce bije normalno.",
      },
      vaccination: {
        term: "Cepljenje",
        simple: "Majhna injekcija, ki telo nauči, da se bori proti bolezni še preden zbolite. Blagi stranski učinki, kot sta boleča roka ali rahla vročina, so normalni.",
      },
      "blood-pressure": {
        term: "Krvni tlak",
        simple: "Sila, s katero kri pritiska na stene žil. Normalno je okoli 120/80. Visok tlak nad 140/90 je nevaren, ker ga pogosto ne čutite, a poškoduje srce in možgane.",
      },
      "blood-sugar": {
        term: "Krvni sladkor",
        simple: "Količina glukoze v krvi. Normalna vrednost na tešče je 70-100 mg/dL. Previsoka vrednost pomeni sladkorno bolezen. Prenizka povzroči omotico in tresenje.",
      },
      bmi: {
        term: "ITM",
        simple: "Indeks telesne mase pokaže, ali je teža zdrava glede na višino. Pod 18,5 je prenizka telesna teža. 18,5-25 je normalno. Nad 25 je prekomerna teža. Nad 30 je debelost.",
      },
      "immune-system": {
        term: "Imunski sistem",
        simple: "To je vojska telesa proti mikrobom. Bele krvne celice se borijo proti okužbam. Cepiva trenirajo imunski sistem. Dobra hrana, spanje in gibanje ga krepijo.",
      },
    },
  },
  el: {
    meta: {
      title: "Γλωσσάρι υγείας — Redi Health",
      description: "Ιατρικοί όροι εξηγημένοι με απλά λόγια",
    },
    title: "Γλωσσάρι υγείας",
    subtitle: "Ιατρικοί όροι εξηγημένοι με απλά λόγια.",
    searchPlaceholder: "Αναζήτηση όρων...",
    searchAria: "Αναζήτηση ιατρικών όρων",
    noResults: "Δεν βρέθηκαν όροι. Δοκιμάστε άλλη αναζήτηση.",
    allCount: "Όλα ({count})",
    categories: {
      condition: "Παθήσεις",
      medication: "Φάρμακα",
      procedure: "Διαδικασίες",
      body: "Σώμα και υγεία",
      test: "Εξετάσεις",
    },
    entries: {
      hypertension: {
        term: "Υψηλή αρτηριακή πίεση",
        simple: "Το αίμα πιέζει πολύ δυνατά τα τοιχώματα των αγγείων. Αν δεν θεραπευτεί, μπορεί να προκαλέσει έμφραγμα ή εγκεφαλικό. Τα φάρμακα πρέπει να λαμβάνονται κάθε μέρα.",
      },
      "diabetes-type-2": {
        term: "Διαβήτης (Τύπου 2)",
        simple: "Το σώμα δεν χρησιμοποιεί σωστά τη ζάχαρη. Η ζάχαρη μαζεύεται στο αίμα και βλάπτει τα όργανα. Χρειάζονται φάρμακα, υγιεινή τροφή και κίνηση. Δεν προκαλείται μόνο επειδή τρώτε πολλή ζάχαρη.",
      },
      anemia: {
        term: "Αναιμία",
        simple: "Δεν υπάρχουν αρκετά υγιή ερυθρά αιμοσφαίρια. Νιώθετε κούραση, αδυναμία ή ζάλη. Συχνά οφείλεται σε έλλειψη σιδήρου. Είναι πολύ συχνή στις εγκύους.",
      },
      asthma: {
        term: "Άσθμα",
        simple: "Οι αεραγωγοί στενεύουν και πρήζονται, γι' αυτό δυσκολεύεστε να αναπνεύσετε. Μπορεί να έχετε συριγμό ή βήχα. Όταν συμβαίνει αυτό, χρησιμοποιήστε το εισπνεόμενο. Αποφύγετε τον καπνό και τη σκόνη.",
      },
      "tuberculosis-tb": {
        term: "Φυματίωση (TB)",
        simple: "Σοβαρή λοίμωξη στους πνεύμονες. Βήχετε για εβδομάδες, χάνετε βάρος και ιδρώνετε τη νύχτα. Μεταδίδεται από τον αέρα. Θεραπεύεται με 6 μήνες φαρμάκων, αλλά πρέπει να πάρετε όλα τα χάπια.",
      },
      depression: {
        term: "Κατάθλιψη",
        simple: "Ιατρική κατάσταση όπου για εβδομάδες νιώθετε λύπη, απελπισία ή κενό. Δεν είναι αδυναμία και δεν είναι δικό σας φταίξιμο. Τα φάρμακα και η συζήτηση με κάποιον μπορούν να βοηθήσουν. Ζητήστε βοήθεια.",
      },
      "hepatitis-b-c": {
        term: "Ηπατίτιδα B/C",
        simple: "Ιός που προσβάλλει το ήπαρ. Μπορεί για χρόνια να μην έχετε συμπτώματα, αλλά βλάπτει αργά το ήπαρ. Μεταδίδεται με αίμα και βελόνες. Υπάρχει εμβόλιο για την ηπατίτιδα B.",
      },
      pneumonia: {
        term: "Πνευμονία",
        simple: "Σοβαρή λοίμωξη στους πνεύμονες. Έχετε πυρετό, βήχα με φλέματα και δυσκολία στην αναπνοή. Χρειάζονται αντιβιοτικά από γιατρό. Μπορεί να είναι επικίνδυνη για μωρά και ηλικιωμένους.",
      },
      gastritis: {
        term: "Γαστρίτιδα",
        simple: "Ο βλεννογόνος του στομάχου είναι ερεθισμένος ή φλεγμένος. Νιώθετε κάψιμο, ναυτία ή φούσκωμα. Αποφύγετε τα πικάντικα φαγητά, το αλκοόλ και το κάπνισμα. Τα φάρμακα μπορούν να βοηθήσουν.",
      },
      eczema: {
        term: "Έκζεμα",
        simple: "Κόκκινα, ξηρά και κνησμώδη σημεία στο δέρμα. Δεν είναι μεταδοτικό. Χρησιμοποιείτε συχνά ενυδατική κρέμα. Αποφύγετε τα δυνατά σαπούνια. Ο γιατρός μπορεί να δώσει κρέμα που βοηθά.",
      },
      antibiotic: {
        term: "Αντιβιοτικό",
        simple: "Φάρμακο που σκοτώνει τα βακτήρια. Δεν δρα στους ιούς, όπως η γρίπη ή το κρυολόγημα. Πρέπει να ολοκληρώσετε όλη τη θεραπεία ακόμη κι αν νιώθετε καλύτερα, αλλιώς τα μικρόβια επιστρέφουν δυνατότερα.",
      },
      ibuprofen: {
        term: "Ιβουπροφαίνη",
        simple: "Παυσίπονο που μειώνει και τη φλεγμονή και τον πυρετό. Πάρτε το με φαγητό για να προστατέψετε το στομάχι. Μην πάρετε περισσότερο από όσο γράφει το κουτί. Δεν είναι ασφαλές στην εγκυμοσύνη.",
      },
      paracetamol: {
        term: "Παρακεταμόλη",
        simple: "Συνηθισμένο φάρμακο για πονοκέφαλο και πυρετό. Είναι ασφαλές για τους περισσότερους ανθρώπους, και για εγκύους. Μην πάρετε πάνω από 4 γραμμάρια την ημέρα, γιατί βλάπτει το ήπαρ.",
      },
      insulin: {
        term: "Ινσουλίνη",
        simple: "Ορμόνη που χρειάζεται το σώμα για να χρησιμοποιεί τη ζάχαρη. Οι άνθρωποι με διαβήτη μπορεί να χρειάζονται ενέσεις ινσουλίνης. Αυτό δεν σημαίνει ότι ο διαβήτης είναι χειρότερος, αλλά ότι χρειάζεται άλλη θεραπεία.",
      },
      metformin: {
        term: "Μετφορμίνη",
        simple: "Το πιο συχνό φάρμακο για τον διαβήτη. Βοηθά το σώμα να χρησιμοποιεί καλύτερα τη ζάχαρη. Παίρνεται με φαγητό. Στην αρχή μπορεί να ενοχλήσει το στομάχι, αλλά συνήθως περνά.",
      },
      "blood-test": {
        term: "Εξέταση αίματος",
        simple: "Μια μικρή βελόνα παίρνει λίγο αίμα από το χέρι. Βοηθά τον γιατρό να ελέγξει λοιμώξεις, αναιμία, διαβήτη και πολλά άλλα. Πονά μόνο για λίγο.",
      },
      "x-ray": {
        term: "Ακτινογραφία",
        simple: "Εικόνα των οστών και των πνευμόνων με ειδικές ακτίνες. Στέκεστε ακίνητοι για λίγα δευτερόλεπτα. Δεν πονάει. Είναι ασφαλής για τους περισσότερους ανθρώπους, αλλά πείτε στον γιατρό αν είστε έγκυος.",
      },
      ultrasound: {
        term: "Υπερηχογράφημα",
        simple: "Εικόνα από το εσωτερικό του σώματος με ηχητικά κύματα. Ο γιατρός βάζει τζελ στο δέρμα και κινεί μια συσκευή. Δεν πονάει. Χρησιμοποιείται συχνά για έλεγχο του μωρού στην εγκυμοσύνη.",
      },
      "ecg-ekg": {
        term: "ΗΚΓ",
        simple: "Εξέταση που ελέγχει τον ρυθμό της καρδιάς. Μικρά αυτοκόλλητα μπαίνουν στο στήθος. Δεν πονάει. Διαρκεί περίπου 5 λεπτά. Δείχνει αν η καρδιά χτυπά φυσιολογικά.",
      },
      vaccination: {
        term: "Εμβολιασμός",
        simple: "Μια μικρή ένεση που μαθαίνει το σώμα να πολεμά μια ασθένεια πριν αρρωστήσετε. Ήπιες παρενέργειες, όπως πόνος στο χέρι ή ελαφρύς πυρετός, είναι φυσιολογικές.",
      },
      "blood-pressure": {
        term: "Αρτηριακή πίεση",
        simple: "Η δύναμη με την οποία το αίμα πιέζει τα τοιχώματα των αγγείων. Το φυσιολογικό είναι περίπου 120/80. Πίεση πάνω από 140/90 είναι επικίνδυνη, γιατί μπορεί να μην τη νιώθετε αλλά βλάπτει καρδιά και εγκέφαλο.",
      },
      "blood-sugar": {
        term: "Σάκχαρο αίματος",
        simple: "Η ποσότητα γλυκόζης στο αίμα. Η φυσιολογική τιμή νηστείας είναι 70-100 mg/dL. Η πολύ υψηλή τιμή σημαίνει διαβήτη. Η πολύ χαμηλή προκαλεί ζάλη και τρέμουλο.",
      },
      bmi: {
        term: "ΔΜΣ",
        simple: "Ο δείκτης μάζας σώματος δείχνει αν το βάρος σας είναι υγιές για το ύψος σας. Κάτω από 18,5 είναι χαμηλό βάρος. 18,5-25 είναι φυσιολογικό. Πάνω από 25 είναι υπερβολικό βάρος. Πάνω από 30 είναι παχυσαρκία.",
      },
      "immune-system": {
        term: "Ανοσοποιητικό σύστημα",
        simple: "Είναι ο στρατός του σώματος απέναντι στα μικρόβια. Τα λευκά αιμοσφαίρια πολεμούν τις λοιμώξεις. Τα εμβόλια εκπαιδεύουν το ανοσοποιητικό σύστημα. Το καλό φαγητό, ο ύπνος και η κίνηση το δυναμώνουν.",
      },
    },
  },
  tr: {
    meta: {
      title: "Sağlık sözlüğü — Redi Health",
      description: "Tıbbi terimler basit kelimelerle açıklandı",
    },
    title: "Sağlık sözlüğü",
    subtitle: "Tıbbi terimler basit kelimelerle açıklandı.",
    searchPlaceholder: "Terim ara...",
    searchAria: "Tıbbi terim ara",
    noResults: "Terim bulunamadı. Farklı bir arama deneyin.",
    allCount: "Tümü ({count})",
    categories: {
      condition: "Hastalıklar",
      medication: "İlaçlar",
      procedure: "İşlemler",
      body: "Vücut ve sağlık",
      test: "Testler",
    },
    entries: {
      hypertension: {
        term: "Yüksek tansiyon",
        simple: "Kan damarların duvarına çok güçlü baskı yapar. Tedavi edilmezse kalp krizi veya felce yol açabilir. İlaçlar her gün alınmalıdır.",
      },
      "diabetes-type-2": {
        term: "Diyabet (Tip 2)",
        simple: "Vücut şekeri doğru kullanamaz. Şeker kanda birikir ve organlara zarar verir. İlaç, sağlıklı yemek ve hareket gerekir. Sadece çok şeker yemekten olmaz.",
      },
      anemia: {
        term: "Kansızlık",
        simple: "Yeterli sağlıklı kırmızı kan hücresi yoktur. Kendinizi yorgun, güçsüz veya baş dönmesi içinde hissedebilirsiniz. Sık nedeni demir eksikliğidir. Hamile kadınlarda çok yaygındır.",
      },
      asthma: {
        term: "Astım",
        simple: "Hava yolları daralır ve şişer, bu yüzden nefes almak zorlaşır. Hırıltı veya öksürük olabilir. Böyle olduğunda inhaleri kullanın. Dumandan ve tozdan uzak durun.",
      },
      "tuberculosis-tb": {
        term: "Tüberküloz (TB)",
        simple: "Akciğerlerde ciddi bir enfeksiyondur. Haftalarca öksürürsünüz, kilo verirsiniz ve gece terlersiniz. Hava yoluyla bulaşır. 6 aylık ilaçla iyileşebilir, ama tüm hapları bitirmek gerekir.",
      },
      depression: {
        term: "Depresyon",
        simple: "Haftalar boyunca üzgün, umutsuz veya boş hissettiğiniz tıbbi bir durumdur. Bu zayıflık değildir ve sizin suçunuz değildir. İlaç ve biriyle konuşmak yardımcı olabilir. Yardım isteyin.",
      },
      "hepatitis-b-c": {
        term: "Hepatit B/C",
        simple: "Karaciğere saldıran bir virüstür. Yıllarca belirti olmayabilir ama karaciğere yavaşça zarar verir. Kan ve iğne ile bulaşır. Hepatit B için aşı vardır.",
      },
      pneumonia: {
        term: "Zatürre",
        simple: "Akciğerlerde ciddi bir enfeksiyondur. Ateş, balgamlı öksürük ve nefes darlığı olur. Doktordan antibiyotik gerekir. Bebekler ve yaşlılar için tehlikeli olabilir.",
      },
      gastritis: {
        term: "Gastrit",
        simple: "Mide iç yüzeyi tahriş olmuş veya iltihaplanmıştır. Yanma, bulantı veya şişkinlik hissedebilirsiniz. Acı yiyecek, alkol ve sigaradan uzak durun. İlaç yardımcı olabilir.",
      },
      eczema: {
        term: "Egzama",
        simple: "Ciltte kaşıntılı, kırmızı ve kuru alanlardır. Bulaşıcı değildir. Sık sık nemlendirici kullanın. Sert sabunlardan kaçının. Doktor yardımcı olacak krem verebilir.",
      },
      antibiotic: {
        term: "Antibiyotik",
        simple: "Bakterileri öldüren ilaçtır. Grip veya soğuk algınlığı gibi virüslere karşı işe yaramaz. Kendinizi iyi hissetseniz bile tüm tedaviyi bitirmelisiniz, yoksa mikroplar daha güçlü döner.",
      },
      ibuprofen: {
        term: "İbuprofen",
        simple: "Ağrıyı, iltihabı ve ateşi azaltan bir ilaçtır. Mideyi korumak için yemekle alın. Kutuda yazılandan fazla almayın. Hamilelikte güvenli değildir.",
      },
      paracetamol: {
        term: "Parasetamol",
        simple: "Baş ağrısı ve ateş için yaygın bir ilaçtır. Çoğu insan için, hamile kadınlar dahil, güvenlidir. Günde 4 gramdan fazla almayın, çünkü karaciğere zarar verir.",
      },
      insulin: {
        term: "İnsülin",
        simple: "Vücudun şekeri kullanması için gereken hormondur. Diyabeti olan kişiler insülin iğnesine ihtiyaç duyabilir. Bu, hastalığın daha kötü olduğu anlamına gelmez; sadece tedavi farklıdır.",
      },
      metformin: {
        term: "Metformin",
        simple: "Diyabet için en sık kullanılan ilaçtır. Vücudun şekeri daha iyi kullanmasına yardım eder. Yemekle alınır. Başta mideyi rahatsız edebilir, ama genelde geçer.",
      },
      "blood-test": {
        term: "Kan testi",
        simple: "Küçük bir iğne koldan biraz kan alır. Doktor enfeksiyon, kansızlık, diyabet ve başka birçok şeyi bununla kontrol eder. Sadece kısa süre acır.",
      },
      "x-ray": {
        term: "Röntgen",
        simple: "Kemiklerin ve akciğerlerin özel ışınlarla çekilen görüntüsüdür. Birkaç saniye hareketsiz durursunuz. Acıtmaz. Çoğu insan için güvenlidir, ama hamileyseniz doktora söyleyin.",
      },
      ultrasound: {
        term: "Ultrason",
        simple: "Ses dalgalarıyla vücudun içinin görüntüsüdür. Doktor cilde jel sürer ve cihazı gezdirir. Acıtmaz. Hamilelikte bebeği kontrol etmek için sık kullanılır.",
      },
      "ecg-ekg": {
        term: "EKG",
        simple: "Kalbin ritmini kontrol eden testtir. Göğse küçük yapışkanlar yerleştirilir. Acıtmaz. Yaklaşık 5 dakika sürer. Kalbin normal atıp atmadığını gösterir.",
      },
      vaccination: {
        term: "Aşılama",
        simple: "Hastalanmadan önce vücuda hastalığa karşı savaşmayı öğreten küçük bir iğnedir. Kolda ağrı veya hafif ateş gibi küçük yan etkiler normaldir.",
      },
      "blood-pressure": {
        term: "Kan basıncı",
        simple: "Kanın damar duvarlarına yaptığı baskıdır. Normal değer yaklaşık 120/80'dir. 140/90 üzerindeki yüksek tansiyon tehlikelidir; fark edilmeyebilir ama kalbe ve beyne zarar verir.",
      },
      "blood-sugar": {
        term: "Kan şekeri",
        simple: "Kandaki glukoz miktarıdır. Açlıkta normal değer 70-100 mg/dL'dir. Çok yüksekse diyabet anlamına gelir. Çok düşükse baş dönmesi ve titreme yapar.",
      },
      bmi: {
        term: "VKİ",
        simple: "Vücut kitle indeksi, kilonuzun boyunuza göre sağlıklı olup olmadığını gösterir. 18,5 altı zayıflık, 18,5-25 normal, 25 üstü fazla kilo, 30 üstü obezitedir.",
      },
      "immune-system": {
        term: "Bağışıklık sistemi",
        simple: "Bu, vücudun mikroplara karşı ordusudur. Beyaz kan hücreleri enfeksiyonlarla savaşır. Aşılar bağışıklık sistemini eğitir. İyi beslenme, uyku ve hareket onu güçlendirir.",
      },
    },
  },
};

function validateGlossary(locale, glossary) {
  const requiredKeys = [
    "meta",
    "title",
    "subtitle",
    "searchPlaceholder",
    "searchAria",
    "noResults",
    "allCount",
    "categories",
    "entries",
  ];

  for (const key of requiredKeys) {
    if (!(key in glossary)) {
      throw new Error(`Missing glossary key "${key}" for locale "${locale}"`);
    }
  }

  for (const key of ["title", "description"]) {
    if (typeof glossary.meta[key] !== "string" || !glossary.meta[key].trim()) {
      throw new Error(`Invalid meta.${key} for locale "${locale}"`);
    }
  }

  for (const categoryId of CATEGORY_IDS) {
    if (typeof glossary.categories[categoryId] !== "string" || !glossary.categories[categoryId].trim()) {
      throw new Error(`Missing category "${categoryId}" for locale "${locale}"`);
    }
  }

  for (const entryId of ENTRY_IDS) {
    const entry = glossary.entries[entryId];
    if (!entry) {
      throw new Error(`Missing entry "${entryId}" for locale "${locale}"`);
    }
    if (typeof entry.term !== "string" || !entry.term.trim()) {
      throw new Error(`Missing term for "${entryId}" in locale "${locale}"`);
    }
    if (typeof entry.simple !== "string" || !entry.simple.trim()) {
      throw new Error(`Missing simple explanation for "${entryId}" in locale "${locale}"`);
    }
  }

  const extraEntries = Object.keys(glossary.entries).filter((entryId) => !ENTRY_IDS.includes(entryId));
  if (extraEntries.length > 0) {
    throw new Error(`Unexpected glossary entries for locale "${locale}": ${extraEntries.join(", ")}`);
  }
}

const files = readdirSync(MESSAGES_DIR)
  .filter((name) => name.endsWith(".json") && !name.startsWith("_"))
  .sort();
const fileLocales = files.map((name) => name.replace(/\.json$/, ""));
const missingFiles = LOCALES.filter((locale) => !fileLocales.includes(locale));
const unexpectedFiles = fileLocales.filter((locale) => !LOCALES.includes(locale));
const missingTranslations = LOCALES.filter((locale) => !(locale in TRANSLATIONS));
const unexpectedTranslations = Object.keys(TRANSLATIONS).filter((locale) => !LOCALES.includes(locale));

if (missingFiles.length > 0 || unexpectedFiles.length > 0) {
  throw new Error(
    `Locale file mismatch. Missing files: [${missingFiles.join(", ")}]. Unexpected files: [${unexpectedFiles.join(", ")}].`,
  );
}

if (missingTranslations.length > 0 || unexpectedTranslations.length > 0) {
  throw new Error(
    `Translation map mismatch. Missing translations: [${missingTranslations.join(", ")}]. Unexpected translations: [${unexpectedTranslations.join(", ")}].`,
  );
}

for (const locale of LOCALES) {
  validateGlossary(locale, TRANSLATIONS[locale]);
}

for (const file of files) {
  const locale = file.replace(/\.json$/, "");
  const path = join(MESSAGES_DIR, file);
  const data = JSON.parse(readFileSync(path, "utf8"));
  const nextGlossary = JSON.parse(JSON.stringify(TRANSLATIONS[locale]));

  if (locale === "en" && JSON.stringify(data.glossary) === JSON.stringify(nextGlossary)) {
    console.log(`Verified ${file} glossary already matches source (${ENTRY_IDS.length} entries)`);
    continue;
  }

  data.glossary = nextGlossary;
  writeFileSync(path, JSON.stringify(data, null, 2) + "\n");
  console.log(`Patched ${file} with glossary (${ENTRY_IDS.length} entries)`);
}

console.log(`Patched glossary namespace in ${files.length} locale files: ${fileLocales.join(", ")}`);
