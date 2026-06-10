/**
 * Guided steps for obtaining STP (Straniero Temporaneamente Presente) or
 * ENI (Europeo Non Iscritto) codes in Italy — essential for undocumented
 * persons and non-registered EU citizens to access free urgent care.
 */

export type StpEniStep = {
  id: string;
  titleKey: string;
  bodyKey: string;
  emoji: string;
};

export const STP_ENI_STEPS: StpEniStep[] = [
  {
    id: "what",
    titleKey: "stpEni.whatTitle",
    bodyKey: "stpEni.whatBody",
    emoji: "📋",
  },
  {
    id: "where",
    titleKey: "stpEni.whereTitle",
    bodyKey: "stpEni.whereBody",
    emoji: "🏥",
  },
  {
    id: "bring",
    titleKey: "stpEni.bringTitle",
    bodyKey: "stpEni.bringBody",
    emoji: "🪪",
  },
  {
    id: "say",
    titleKey: "stpEni.sayTitle",
    bodyKey: "stpEni.sayBody",
    emoji: "🗣️",
  },
  {
    id: "rights",
    titleKey: "stpEni.rightsTitle",
    bodyKey: "stpEni.rightsBody",
    emoji: "⚖️",
  },
];

/** Phrase card mediators can hand to ASL desk staff (Italian). */
export const STP_ENI_PHRASE_IT =
  "Buongiorno. Ho bisogno di un codice STP (o ENI se sono cittadino UE non iscritto) per accedere alle cure essenziali. Sono temporaneamente presente in Italia / non ho la tessera sanitaria.";
