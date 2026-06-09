// Italian Vaccine Translations
export const UI_IT = {
  "heroTitle": "Guida ai vaccini",
  "heroSubtitle": "Ogni vaccino spiegato in modo semplice. Tocca qualsiasi vaccino per saperne di più.",
  "askCta": "Fai una domanda sui vaccini",
  "backToSchedule": "Torna al programma",
  "preventsLabel": "Previene",
  "dosesNeeded": "{count, plural, one {# dose necessaria} other {# dosi necessarie}}",
  "howItWorks": "Come funziona",
  "sideEffects": "Effetti collaterali (normali)",
  "mythTitle": "Mito contro verità",
  "qaTitle": "Chiedi informazioni sui vaccini",
  "qaSubtitle": "Qualsiasi domanda. Risposte oneste derivanti dall'esperienza sul campo.",
  "qaPlaceholder": "Scrivi la tua domanda sul vaccino...",
  "qaAria": "Fai una domanda sul vaccino",
  "qaCommon": "Domande comuni",
  "childAgePrompt": "Quanti anni ha tuo figlio?",
  "childAgeAria": "Seleziona l'età del bambino",
  "ageOptionDefault": "Seleziona l'età...",
  "ageNewborn": "Neonato (0 mesi)",
  "age2m": "2 mesi",
  "age4m": "4 mesi",
  "age6m": "6 mesi",
  "age12m": "12 mesi (1 anno)",
  "age18m": "18 mesi",
  "age48m": "4–6 anni",
  "age108m": "9-12 anni",
  "neededByAge": "Vaccini necessari a questa età:",
  "vaccinesCount": "{contare, plurale, uno {# vaccino} altro {# vaccini}}",
  "importance": {
    "critical": "Essenziale",
    "important": "Importante",
    "recommended": "Raccomandato"
  },
  "fears": [
    "I vaccini sono sicuri per il mio bambino?",
    "Farà del male a mio figlio?",
    "Cosa succede se a mio figlio viene la febbre?",
    "Posso ritardare i vaccini?",
    "Mio figlio è malato: può ancora vaccinarsi?"
  ],
  "meta": {
    "title": "Guida ai vaccini – Redi Health",
    "description": "Ogni vaccino spiegato in parole semplici."
  }
};

export const AGE_IT = {
  "birth": "Alla nascita",
  "2months": "2 mesi",
  "4months": "4 mesi",
  "6months": "6 mesi",
  "12months": "12 mesi",
  "18months": "18 mesi",
  "4years": "4-6 anni",
  "9years": "9-12 anni",
  "adult": "Adulti",
  "pregnant": "Donne incinte"
};

export const ITEMS_IT = {
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
    "MITO: 'Queste malattie non esistono più, perché vaccinare?' VERITÀ: non esistono A CAUSA dei vaccini. Quando le comunità smettono di vaccinare, queste malattie ritornano. Ho assistito a un’epidemia di pertosse in un insediamento nel 2018: tre bambini sono stati ricoverati in ospedale."
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
    "Influenza (influenza)",
    ["Influenza stagionale"],
    "L’influenza non è solo un raffreddore: può essere grave per i bambini piccoli, gli anziani e le donne incinte. Questo vaccino viene aggiornato ogni anno per corrispondere agli attuali ceppi influenzali.",
    "Lieve dolore, occasionalmente febbre bassa per un giorno. NON puoi prendere l'influenza dal vaccino antinfluenzale.",
    "MITO: \"Il vaccino antinfluenzale ti fa venire l'influenza\". VERITÀ: impossibile. Il vaccino non contiene virus vivi. Se ti senti un po' giù per un giorno, è il tuo sistema immunitario che sta imparando, non l'influenza."
  ),
};
