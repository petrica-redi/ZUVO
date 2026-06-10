/**
 * Italian ASL (Azienda Sanitaria Locale) reference contacts for the
 * mediatore culturale / mediatore sanitario field layer.
 *
 * Phone and email are left blank where not centrally verified — regional
 * coordinators should confirm before publishing to production tenants.
 */

export type AslRegionContact = {
  /** ISTAT region code (e.g. "LAZ"). */
  code: string;
  name: string;
  aslName: string;
  /** Capital or primary city for the region. */
  hubCity: string;
  phone?: string;
  email?: string;
  website?: string;
  note?: string;
};

export const ITALY_UNAR_NOTE =
  "Strategia Nazionale per le comunità Rom, Sinti e Caminanti (UNAR). Per codici STP/ENI e accesso alle cure essenziali, rivolgersi all'ASL di residenza o domicilio.";

export const ITALY_ASL_REGIONS: AslRegionContact[] = [
  { code: "LAZ", name: "Lazio", aslName: "ASL Roma 1 / Roma 2 / Roma 3", hubCity: "Roma", website: "https://www.salutelazio.it", note: "Grande concentrazione di comunità romene e rom." },
  { code: "CAM", name: "Campania", aslName: "ASL Napoli 1 / Napoli 2 / Napoli 3", hubCity: "Napoli", website: "https://www.aslnapoli1centro.it", note: "Insediamenti informali in periferia — mediatore culturale attivo in diversi comuni." },
  { code: "LOM", name: "Lombardia", aslName: "ATS Milano / Bergamo / Brescia", hubCity: "Milano", website: "https://www.ats-milano.it", note: "Comunità romene in Milano e hinterland." },
  { code: "PIE", name: "Piemonte", aslName: "ASL Città di Torino", hubCity: "Torino", website: "https://www.aslto1.piemonte.it" },
  { code: "VEN", name: "Veneto", aslName: "ULSS 3 Serenissima", hubCity: "Venezia", website: "https://www.aulss3.veneto.it" },
  { code: "EMR", name: "Emilia-Romagna", aslName: "AUSL Bologna", hubCity: "Bologna", website: "https://www.ausl.bologna.it" },
  { code: "TOS", name: "Toscana", aslName: "AUSL Toscana Centro", hubCity: "Firenze", website: "https://www.uslcentro.toscana.it" },
  { code: "PUG", name: "Puglia", aslName: "ASL Bari", hubCity: "Bari", website: "https://www.asl.bari.it" },
  { code: "SIC", name: "Sicilia", aslName: "ASP Palermo", hubCity: "Palermo", website: "https://www.asp.palermo.it" },
  { code: "SAR", name: "Sardegna", aslName: "ATS Sardegna", hubCity: "Cagliari", website: "https://www.regione.sardegna.it/salute" },
];

export function getAslContact(code: string): AslRegionContact | undefined {
  return ITALY_ASL_REGIONS.find((r) => r.code === code);
}
