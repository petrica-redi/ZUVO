/** Italian translation for regions.countries — keyed by region id. */

function country(challenges, keyFact, orgFocuses) {
  const healthChallenges = Object.fromEntries(challenges.map((text, i) => [String(i), text]));
  const organizations = Object.fromEntries(orgFocuses.map((focus, i) => [String(i), { focus }]));
  return { healthChallenges, keyFact, organizations };
}

export const COUNTRIES = {
  romania: country(
    ["Accesso limitato all'assicurazione sanitaria", "Alta mortalità infantile e materna nelle comunità rom", "Tassi di tubercolosi superiori alla media nazionale", "Bassa copertura vaccinale negli insediamenti rurali", "Barriere alla registrazione con i medici di famiglia"],
    "La Romania ha la più grande popolazione rom in Europa e un programma nazionale di mediatori sanitari.",
    ["Diritti dei rom, mediazione sanitaria", "Politiche di inclusione dei rom", "Cliniche sanitarie mobili nelle comunità emarginate"]
  ),
  bulgaria: country(
    ["Quartieri segregati che limitano l'accesso all'assistenza sanitaria", "Alta disoccupazione che riduce la copertura dell'assicurazione sanitaria", "Malattie cardiovascolari come principale causa di morte", "Bassa aspettativa di vita rispetto alla media nazionale", "Accesso limitato alle cure specialistiche"],
    "Il programma di mediatori sanitari della comunità rom in Bulgaria è stato uno dei primi nei Balcani.",
    ["Promozione della salute e mediazione dei rom", "Accesso all'assistenza sanitaria per i rom emarginati"]
  ),
  hungary: country(
    ["Aspettativa di vita inferiore di 10-15 anni rispetto alla media nazionale", "Tassi elevati di malattie cardiovascolari e respiratorie", "Malnutrizione legata alla povertà", "Basso utilizzo dei servizi di salute mentale", "Isolamento geografico nell'Ungheria nord-orientale"],
    "L'Ungheria ha popolazioni rom significative concentrate nelle regioni di Borsod, Szabolcs e Baranya.",
    ["Educazione dei rom, compresa l'alfabetizzazione sanitaria", "Assistenza sociale e tutela della salute dei rom"]
  ),
  northMacedonia: country(
    ["Il comune di Šuto Orizari (Sutka) ha esigenze sanitarie specifiche", "Prevalenza dell'epatite B", "Accesso limitato ai servizi di salute ginecologica e materna", "Tassi elevati di anemia soprattutto nei bambini e nelle donne", "Esitazione vaccinale per il COVID-19"],
    "Šuto Orizari vicino a Skopje è il più grande comune rom del mondo.",
    ["Diritti dei rom e accesso alla salute", "Salute pubblica e riduzione del danno"]
  ),
  slovakia: country(
    ["Gli insediamenti segregati (osady) nella Slovacchia orientale mancano di infrastrutture", "Tassi di tubercolosi tra i più alti dell'UE", "Malnutrizione infantile e arresto della crescita", "Accesso limitato all'acqua pulita e ai servizi igienico-sanitari negli insediamenti", "Discriminazioni segnalate nelle strutture sanitarie"],
    "La Slovacchia ha la percentuale più alta di rom che vivono in insediamenti segregati nell'UE.",
    ["Antidiscriminazione in sanità", "Programmi di salute pubblica inclusa la salute dei rom"]
  ),
  serbia: country(
    ["Insediamenti informali (mahale) privi di infrastrutture sanitarie", "Alti tassi di epatite e parassiti intestinali", "Registrazione limitata delle nascite che influisce sull'accesso alla salute", "Sfide legate all'uso di sostanze tra i giovani rom urbani", "Stigma della salute mentale all'interno delle comunità"],
    "Il programma di mediatori sanitari della Serbia forma le donne rom come collegamenti per la salute della comunità.",
    ["Diritti dei rom e politica sanitaria", "Salute delle donne e dei bambini"]
  ),
  turkey: country(
    ["Le comunità rom (Dom e Lom) affrontano l'emarginazione economica", "Documentazione limitata che influisce sull'accesso all'assistenza sanitaria", "Tassi più elevati di rischi per la salute sul lavoro (operatori della raccolta dei rifiuti)", "Assistenza sanitaria materna limitata nelle aree urbane informali", "Isolamento sociale e sfide di salute mentale"],
    "Le comunità rom in Turchia sono concentrate principalmente a Istanbul, Edirne e Smirne.",
    ["Diritti dei rom e inclusione sociale in Turchia", "Educazione dei rom e alfabetizzazione sanitaria"]
  ),
  greece: country(
    ["I rom nei campi rurali non hanno accesso ai servizi sanitari comunali", "Impatto della crisi economica sull'accesso all'assistenza sanitaria per i gruppi vulnerabili", "Epatite C in alcune comunità", "Accesso limitato alle cure dentistiche", "Precarietà economica peggiorata dal COVID-19"],
    "La Grecia ha comunità rom sia stanziali che nomadi nella Macedonia Centrale e in Tessaglia.",
    ["Inclusione dei rom in salute, istruzione, alloggio", "Supporto sociale e sanitario per gruppi emarginati"]
  ),
  albania: country(
    ["Alti tassi di povertà infantile e malnutrizione", "Copertura assicurativa sanitaria limitata", "Mortalità materna più elevata nelle comunità rom", "Accesso limitato ad alloggi sicuri che influiscono sulla salute", "Lavoro stagionale che porta a instabilità sanitaria"],
    "L'Albania ha anche una minoranza Ashkali (egiziana) storicamente raggruppata con le comunità rom.",
    ["Diritti dei rom e sviluppo della comunità", "Accesso all'istruzione e alla salute per i rom"]
  ),
  czech: country(
    ["Segregazione persistente negli alloggi con impatto sulla salute", "Alti tassi di malattie cardiovascolari prevenibili", "Tassi di vaccinazione più bassi nelle comunità rom", "Barriere nella comunicazione e nell'alfabetizzazione sanitaria", "Difficoltà nell'accesso alle cure specialistiche"],
    "La Repubblica Ceca ha una popolazione rom significativa concentrata in Moravia e Boemia settentrionale.",
    ["Approccio integrato per l'inclusione dei rom", "Tutela delle organizzazioni rom dell'erba"]
  ),
  croatia: country(
    ["I rom nella contea di Međimurje affrontano barriere di accesso alla sanità", "Barriere linguistiche che limitano la comunicazione sanitaria", "Tassi più elevati di diabete negli anziani rom", "Assunzione limitata di vaccini in età prescolare", "Povertà che influisce sulla nutrizione e sulla salute"],
    "La più grande comunità rom della Croazia si trova nella contea di Međimurje, vicino al confine con l'Ungheria.",
    ["Salute e diritti delle donne rom", "Politica e inclusione dei rom"]
  ),
  bosnia: country(
    ["Infrastrutture post-belliche che influiscono sulla sanità in alcune regioni", "Mancanza di documenti personali che limitano l'accesso alla salute", "Alta disoccupazione che porta alla mancanza di assicurazione sanitaria", "Malnutrizione infantile nelle famiglie rom più povere", "Servizi di salute mentale limitati per i traumi della comunità"],
    "La Bosnia ed Erzegovina ha comunità rom sia nella Federazione che nella Repubblica Serba di Bosnia ed Erzegovina.",
    ["Diritti dei rom, accesso alla salute e documentazione", "Diritti delle minoranze compreso l'accesso alla salute per i rom"]
  ),
  kosovo: country(
    ["I rom a Mitrovica sono stati sfollati in campi contaminati da piombo", "Grave povertà che limita l'accesso all'assistenza sanitaria", "Mediatori sanitari rom limitati", "Traumi post-conflitto e bisogni di salute mentale", "Alta mortalità infantile rispetto alla media nazionale"],
    "I rom di Mitrovica Nord sono stati esposti a un grave avvelenamento da piombo nei campi delle Nazioni Unite dopo il conflitto del 1999.",
    ["Diritti e salute della comunità rom RAE", "Accesso alla salute per le popolazioni rom sfollate"]
  ),
  slovenia: country(
    ["I rom nelle regioni di Dolenjska e Prekmurje affrontano l'emarginazione", "Livello di istruzione inferiore che influisce sull'alfabetizzazione sanitaria", "Esclusione sociale con impatto sulla salute mentale", "Assunzione limitata di vaccini in alcuni insediamenti", "Carenze alimentari legate alla povertà"],
    "La Slovenia ha due comunità rom legalmente riconosciute: i rom autoctoni (occidentali) e non autoctoni (orientali).",
    ["Diritti sociali e culturali dei rom", "Benessere dei rom e accesso alla salute"]
  ),
};
