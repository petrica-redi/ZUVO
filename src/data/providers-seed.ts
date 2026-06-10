/**
 * Government-style provider directory seed — Romania + Italy.
 * Loaded into DB on first API request when the table is empty.
 */

export type ProviderSeed = {
  name: string;
  type: "hospital" | "clinic" | "pharmacy" | "emergency" | "mediator_office" | "maternity" | "mental_health" | "dental";
  latitude: number;
  longitude: number;
  address: string;
  phone?: string;
  website?: string;
  region: string;
  isRomaFriendly: boolean;
  isFreeClinic: boolean;
  hasInterpreter: boolean;
  languages: string[];
};

export const PROVIDER_SEED: ProviderSeed[] = [
  {
    name: "Centrul de Sănătate Ferentari",
    type: "clinic",
    latitude: 44.408,
    longitude: 26.089,
    address: "Str. Livezeni, Sector 5, București",
    phone: "+40213334455",
    region: "romania",
    isRomaFriendly: true,
    isFreeClinic: true,
    hasInterpreter: true,
    languages: ["ro", "rom", "en"],
  },
  {
    name: "Spitalul Clinic Colțea",
    type: "hospital",
    latitude: 44.434,
    longitude: 26.102,
    address: "B-dul I.C. Brătianu 1, București",
    phone: "+40213114111",
    region: "romania",
    isRomaFriendly: true,
    isFreeClinic: false,
    hasInterpreter: true,
    languages: ["ro", "en"],
  },
  {
    name: "UJSS Bistrița-Năsăud — ECI Dumitra",
    type: "mediator_office",
    latitude: 47.216,
    longitude: 24.383,
    address: "Comuna Dumitra, jud. Bistrița-Năsăud",
    region: "romania",
    isRomaFriendly: true,
    isFreeClinic: true,
    hasInterpreter: true,
    languages: ["ro", "rom", "hu"],
  },
  {
    name: "ASL Roma 1 — Sportello STP",
    type: "clinic",
    latitude: 41.902,
    longitude: 12.496,
    address: "Via di Torre Argentina, Roma",
    phone: "+390683060",
    website: "https://www.aslroma1.it",
    region: "italy",
    isRomaFriendly: true,
    isFreeClinic: true,
    hasInterpreter: true,
    languages: ["it", "ro", "rom", "en"],
  },
  {
    name: "Consultorio ASL Napoli 1 — Centrale",
    type: "maternity",
    latitude: 40.852,
    longitude: 14.268,
    address: "Via Comunale Margherita, Napoli",
    region: "italy",
    isRomaFriendly: true,
    isFreeClinic: true,
    hasInterpreter: true,
    languages: ["it", "ro", "ar"],
  },
  {
    name: "ATS Milano — Mediatore culturale",
    type: "mediator_office",
    latitude: 45.464,
    longitude: 9.19,
    address: "Via San Barnaba, Milano",
    website: "https://www.ats-milano.it",
    region: "italy",
    isRomaFriendly: true,
    isFreeClinic: true,
    hasInterpreter: true,
    languages: ["it", "ro", "rom", "en"],
  },
];
