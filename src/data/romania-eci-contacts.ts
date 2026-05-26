/**
 * Romanian counties (județe) and the Județean Social Service Unit (UJSS) that
 * coordinates POIDS / FSE+ integrated community teams (ECI).
 *
 * `phone` and `email` are intentionally left blank for counties where we do
 * not yet have a verified primary contact — mediators should confirm with
 * their UAT / UJSS coordinator. The structure is in place so contacts can be
 * filled in centrally without code changes elsewhere.
 */

export type EciCountyContact = {
  /** ISO 3166-2:RO subdivision code (e.g. "BN"). */
  code: string;
  /** County name (Romanian, with diacritics). */
  name: string;
  /** UJSS / county social-service body name. */
  ujssName: string;
  /** Optional landline / mobile (E.164 preferred when known). */
  phone?: string;
  /** Optional coordinator inbox. */
  email?: string;
  /** Optional county-level website. */
  website?: string;
  /** Optional contextual note (e.g. flagship project). */
  note?: string;
};

/**
 * National orientation message shown alongside any county block. Confirmed
 * county contacts must be obtained from UJSS directly.
 */
export const POIDS_NATIONAL_NOTE =
  "Servicii integrate în comunități rurale (POIDS / FSE+). Confirmați datele de contact cu coordonatorul UJSS al județului și cu primăria UAT.";

export const ROMANIA_ECI_COUNTIES: EciCountyContact[] = [
  { code: "AB", name: "Alba", ujssName: "UJSS Alba" },
  { code: "AR", name: "Arad", ujssName: "UJSS Arad" },
  { code: "AG", name: "Argeș", ujssName: "UJSS Argeș" },
  { code: "BC", name: "Bacău", ujssName: "UJSS Bacău" },
  { code: "BH", name: "Bihor", ujssName: "UJSS Bihor" },
  {
    code: "BN",
    name: "Bistrița-Năsăud",
    ujssName: "UJSS Bistrița-Năsăud",
    note:
      "Coordonator județean pentru echipe comunitare integrate (ex. ECI Dumitra). Confirmați datele de contact cu coordonatorul de proiect.",
  },
  { code: "BT", name: "Botoșani", ujssName: "UJSS Botoșani" },
  { code: "BV", name: "Brașov", ujssName: "UJSS Brașov" },
  { code: "BR", name: "Brăila", ujssName: "UJSS Brăila" },
  { code: "B", name: "București", ujssName: "DGASMB / structuri municipale" },
  { code: "BZ", name: "Buzău", ujssName: "UJSS Buzău" },
  { code: "CS", name: "Caraș-Severin", ujssName: "UJSS Caraș-Severin" },
  { code: "CL", name: "Călărași", ujssName: "UJSS Călărași" },
  { code: "CJ", name: "Cluj", ujssName: "UJSS Cluj" },
  { code: "CT", name: "Constanța", ujssName: "UJSS Constanța" },
  { code: "CV", name: "Covasna", ujssName: "UJSS Covasna" },
  { code: "DB", name: "Dâmbovița", ujssName: "UJSS Dâmbovița" },
  { code: "DJ", name: "Dolj", ujssName: "UJSS Dolj" },
  { code: "GL", name: "Galați", ujssName: "UJSS Galați" },
  { code: "GR", name: "Giurgiu", ujssName: "UJSS Giurgiu" },
  { code: "GJ", name: "Gorj", ujssName: "UJSS Gorj" },
  { code: "HR", name: "Harghita", ujssName: "UJSS Harghita" },
  { code: "HD", name: "Hunedoara", ujssName: "UJSS Hunedoara" },
  { code: "IL", name: "Ialomița", ujssName: "UJSS Ialomița" },
  { code: "IS", name: "Iași", ujssName: "UJSS Iași" },
  { code: "IF", name: "Ilfov", ujssName: "UJSS Ilfov" },
  { code: "MM", name: "Maramureș", ujssName: "UJSS Maramureș" },
  { code: "MH", name: "Mehedinți", ujssName: "UJSS Mehedinți" },
  { code: "MS", name: "Mureș", ujssName: "UJSS Mureș" },
  { code: "NT", name: "Neamț", ujssName: "UJSS Neamț" },
  { code: "OT", name: "Olt", ujssName: "UJSS Olt" },
  { code: "PH", name: "Prahova", ujssName: "UJSS Prahova" },
  { code: "SJ", name: "Sălaj", ujssName: "UJSS Sălaj" },
  { code: "SM", name: "Satu Mare", ujssName: "UJSS Satu Mare" },
  { code: "SB", name: "Sibiu", ujssName: "UJSS Sibiu" },
  { code: "SV", name: "Suceava", ujssName: "UJSS Suceava" },
  { code: "TR", name: "Teleorman", ujssName: "UJSS Teleorman" },
  { code: "TM", name: "Timiș", ujssName: "UJSS Timiș" },
  { code: "TL", name: "Tulcea", ujssName: "UJSS Tulcea" },
  { code: "VS", name: "Vaslui", ujssName: "UJSS Vaslui" },
  { code: "VL", name: "Vâlcea", ujssName: "UJSS Vâlcea" },
  { code: "VN", name: "Vrancea", ujssName: "UJSS Vrancea" },
];

const COUNTY_INDEX = new Map(ROMANIA_ECI_COUNTIES.map((c) => [c.code, c]));

export function getCountyContact(
  code: string | undefined | null,
): EciCountyContact | undefined {
  if (!code) return undefined;
  return COUNTY_INDEX.get(code);
}
