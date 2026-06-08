/**
 * Redi Health region data (directory).
 *
 * Real-world data about Roma communities in each country:
 * - Population estimates (Council of Europe / ERRC data)
 * - Key health challenges
 * - Active health organizations / NGOs
 * - Emergency numbers
 */

export type HealthOrganization = {
  name: string;
  type: "ngo" | "government" | "international";
  /** i18n key under regions.countries.{regionId}.organizations.{focus}.focus */
  focus: string;
  website?: string;
  phone?: string;
};

export type RegionData = {
  id: string;
  flag: string;
  countryCode: string;
  romaPopulation: string;
  totalPopulation: string;
  percentRoma: string;
  capitalCity: string;
  emergencyNumber: string;
  ambulanceNumber: string;
  /** i18n keys under regions.countries.{id}.healthChallenges.{key} */
  healthChallenges: string[];
  organizations: HealthOrganization[];
  /** i18n key under regions.countries.{id}.keyFact */
  keyFact: string;
  healthIndex: number; // 1-5, 5 being best access to healthcare
};

export const REGIONS: RegionData[] = [
  {
    id: "romania",
    flag: "🇷🇴",
    countryCode: "RO",
    romaPopulation: "1.85M–2.5M",
    totalPopulation: "19.2M",
    percentRoma: "up to 13%",
    capitalCity: "Bucharest",
    emergencyNumber: "112",
    ambulanceNumber: "112",
    healthChallenges: ["0", "1", "2", "3", "4"],
    organizations: [
      {
        name: "Romani CRISS",
        type: "ngo",
        focus: "0",
        website: "www.romanicriss.org",
      },
      {
        name: "National Agency for Roma",
        type: "government",
        focus: "1",
      },
      {
        name: "Médecins Sans Frontières (MSF)",
        type: "international",
        focus: "2",
        website: "www.msf.org",
      },
    ],
    keyFact: "keyFact",
    healthIndex: 3,
  },
  {
    id: "bulgaria",
    flag: "🇧🇬",
    countryCode: "BG",
    romaPopulation: "700K–800K",
    totalPopulation: "6.5M",
    percentRoma: "up to 10%",
    capitalCity: "Sofia",
    emergencyNumber: "112",
    ambulanceNumber: "112",
    healthChallenges: ["0", "1", "2", "3", "4"],
    organizations: [
      {
        name: "Health and Social Development Foundation (HSDF)",
        type: "ngo",
        focus: "0",
        website: "www.hsdf.bg",
      },
      {
        name: "Roma Health Project Bulgaria",
        type: "international",
        focus: "1",
      },
    ],
    keyFact: "keyFact",
    healthIndex: 2,
  },
  {
    id: "hungary",
    flag: "🇭🇺",
    countryCode: "HU",
    romaPopulation: "600K–900K",
    totalPopulation: "9.7M",
    percentRoma: "up to 9%",
    capitalCity: "Budapest",
    emergencyNumber: "112",
    ambulanceNumber: "104",
    healthChallenges: ["0", "1", "2", "3", "4"],
    organizations: [
      {
        name: "Romaversitas Foundation",
        type: "ngo",
        focus: "0",
        website: "www.romaversitas.hu",
      },
      {
        name: "National Roma Self-Government",
        type: "government",
        focus: "1",
      },
    ],
    keyFact: "keyFact",
    healthIndex: 3,
  },
  {
    id: "northMacedonia",
    flag: "🇲🇰",
    countryCode: "MK",
    romaPopulation: "260K–300K",
    totalPopulation: "2.1M",
    percentRoma: "up to 14%",
    capitalCity: "Skopje",
    emergencyNumber: "112",
    ambulanceNumber: "194",
    healthChallenges: ["0", "1", "2", "3", "4"],
    organizations: [
      {
        name: "National Roma Centrum",
        type: "ngo",
        focus: "0",
      },
      {
        name: "HOPS – Healthy Options Project Skopje",
        type: "ngo",
        focus: "1",
      },
    ],
    keyFact: "keyFact",
    healthIndex: 2,
  },
  {
    id: "slovakia",
    flag: "🇸🇰",
    countryCode: "SK",
    romaPopulation: "400K–600K",
    totalPopulation: "5.5M",
    percentRoma: "up to 11%",
    capitalCity: "Bratislava",
    emergencyNumber: "112",
    ambulanceNumber: "155",
    healthChallenges: ["0", "1", "2", "3", "4"],
    organizations: [
      {
        name: "Center for Civil and Human Rights (Poradňa)",
        type: "ngo",
        focus: "0",
        website: "www.poradna-prava.sk",
      },
      {
        name: "WHO Slovakia",
        type: "international",
        focus: "1",
      },
    ],
    keyFact: "keyFact",
    healthIndex: 2,
  },
  {
    id: "serbia",
    flag: "🇷🇸",
    countryCode: "RS",
    romaPopulation: "500K–600K",
    totalPopulation: "6.8M",
    percentRoma: "up to 9%",
    capitalCity: "Belgrade",
    emergencyNumber: "112",
    ambulanceNumber: "194",
    healthChallenges: ["0", "1", "2", "3", "4"],
    organizations: [
      {
        name: "Roma National Council Serbia",
        type: "government",
        focus: "0",
      },
      {
        name: "Bibija Roma Women's Center",
        type: "ngo",
        focus: "1",
      },
    ],
    keyFact: "keyFact",
    healthIndex: 3,
  },
  {
    id: "turkey",
    flag: "🇹🇷",
    countryCode: "TR",
    romaPopulation: "500K–700K",
    totalPopulation: "84M",
    percentRoma: "~1%",
    capitalCity: "Ankara",
    emergencyNumber: "112",
    ambulanceNumber: "112",
    healthChallenges: ["0", "1", "2", "3", "4"],
    organizations: [
      {
        name: "Roman Bir-Der",
        type: "ngo",
        focus: "0",
      },
      {
        name: "BRIC – Başkent Roma Integration Center",
        type: "ngo",
        focus: "1",
      },
    ],
    keyFact: "keyFact",
    healthIndex: 3,
  },
  {
    id: "greece",
    flag: "🇬🇷",
    countryCode: "GR",
    romaPopulation: "200K–300K",
    totalPopulation: "10.7M",
    percentRoma: "up to 3%",
    capitalCity: "Athens",
    emergencyNumber: "112",
    ambulanceNumber: "166",
    healthChallenges: ["0", "1", "2", "3", "4"],
    organizations: [
      {
        name: "Greek National Roma Integration Strategy",
        type: "government",
        focus: "0",
      },
      {
        name: "ARSIS – Association for Social Support of Youth",
        type: "ngo",
        focus: "1",
      },
    ],
    keyFact: "keyFact",
    healthIndex: 3,
  },
  {
    id: "albania",
    flag: "🇦🇱",
    countryCode: "AL",
    romaPopulation: "100K–150K",
    totalPopulation: "2.8M",
    percentRoma: "up to 5%",
    capitalCity: "Tirana",
    emergencyNumber: "112",
    ambulanceNumber: "127",
    healthChallenges: ["0", "1", "2", "3", "4"],
    organizations: [
      {
        name: "Roma and Balkan Egyptian Community of Albania",
        type: "ngo",
        focus: "0",
      },
      {
        name: "Amaro Drom Albania",
        type: "ngo",
        focus: "1",
      },
    ],
    keyFact: "keyFact",
    healthIndex: 2,
  },
  {
    id: "czech",
    flag: "🇨🇿",
    countryCode: "CZ",
    romaPopulation: "200K–300K",
    totalPopulation: "10.9M",
    percentRoma: "up to 3%",
    capitalCity: "Prague",
    emergencyNumber: "112",
    ambulanceNumber: "155",
    healthChallenges: ["0", "1", "2", "3", "4"],
    organizations: [
      {
        name: "Agency for Social Inclusion (Czech Government)",
        type: "government",
        focus: "0",
      },
      {
        name: "ERGO Network – Czech Member",
        type: "ngo",
        focus: "1",
      },
    ],
    keyFact: "keyFact",
    healthIndex: 3,
  },
  {
    id: "croatia",
    flag: "🇭🇷",
    countryCode: "HR",
    romaPopulation: "40K–60K",
    totalPopulation: "3.9M",
    percentRoma: "up to 2%",
    capitalCity: "Zagreb",
    emergencyNumber: "112",
    ambulanceNumber: "194",
    healthChallenges: ["0", "1", "2", "3", "4"],
    organizations: [
      {
        name: "Kali Sara – Roma Women's Center Croatia",
        type: "ngo",
        focus: "0",
      },
      {
        name: "Roma National Council of Croatia",
        type: "government",
        focus: "1",
      },
    ],
    keyFact: "keyFact",
    healthIndex: 3,
  },
  {
    id: "bosnia",
    flag: "🇧🇦",
    countryCode: "BA",
    romaPopulation: "40K–60K",
    totalPopulation: "3.3M",
    percentRoma: "up to 2%",
    capitalCity: "Sarajevo",
    emergencyNumber: "112",
    ambulanceNumber: "124",
    healthChallenges: ["0", "1", "2", "3", "4"],
    organizations: [
      {
        name: "Roma Center Sarajevo",
        type: "ngo",
        focus: "0",
      },
      {
        name: "OSCE Mission to Bosnia",
        type: "international",
        focus: "1",
      },
    ],
    keyFact: "keyFact",
    healthIndex: 2,
  },
  {
    id: "kosovo",
    flag: "🇽🇰",
    countryCode: "XK",
    romaPopulation: "30K–40K",
    totalPopulation: "1.8M",
    percentRoma: "up to 2%",
    capitalCity: "Pristina",
    emergencyNumber: "112",
    ambulanceNumber: "194",
    healthChallenges: ["0", "1", "2", "3", "4"],
    organizations: [
      {
        name: "Voice of Roma, Ashkali and Egyptians in Kosovo",
        type: "ngo",
        focus: "0",
      },
      {
        name: "UNHCR Kosovo",
        type: "international",
        focus: "1",
      },
    ],
    keyFact: "keyFact",
    healthIndex: 1,
  },
  {
    id: "slovenia",
    flag: "🇸🇮",
    countryCode: "SI",
    romaPopulation: "10K–15K",
    totalPopulation: "2.1M",
    percentRoma: "~0.6%",
    capitalCity: "Ljubljana",
    emergencyNumber: "112",
    ambulanceNumber: "112",
    healthChallenges: ["0", "1", "2", "3", "4"],
    organizations: [
      {
        name: "Romano Them Roma Association",
        type: "ngo",
        focus: "0",
      },
      {
        name: "Republic of Slovenia Roma Community Council",
        type: "government",
        focus: "1",
      },
    ],
    keyFact: "keyFact",
    healthIndex: 3,
  },
];

export type RegionSlug = (typeof REGIONS)[number]["id"];

export function getRegion(id: string): RegionData | undefined {
  return REGIONS.find((r) => r.id === id);
}

export const HEALTH_INDEX_LABELS: Record<number, string> = {
  1: "Critical",
  2: "Challenging",
  3: "Moderate",
  4: "Good",
  5: "Excellent",
};
