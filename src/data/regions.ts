/**
 * Sastipe Region Data
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
  healthChallenges: string[];
  organizations: HealthOrganization[];
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
    healthChallenges: [
      "Limited access to health insurance",
      "High infant and maternal mortality in Roma communities",
      "Tuberculosis rates higher than national average",
      "Low vaccination coverage in rural settlements",
      "Barriers to registering with family doctors",
    ],
    organizations: [
      {
        name: "Romani CRISS",
        type: "ngo",
        focus: "Roma rights, health mediation",
        website: "www.romanicriss.org",
      },
      {
        name: "National Agency for Roma",
        type: "government",
        focus: "Roma inclusion policies",
      },
      {
        name: "Médecins Sans Frontières (MSF)",
        type: "international",
        focus: "Mobile health clinics in marginalized communities",
        website: "www.msf.org",
      },
    ],
    keyFact: "Romania has the largest Roma population in Europe and a national health mediator program.",
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
    healthChallenges: [
      "Segregated neighborhoods limiting healthcare access",
      "High unemployment reducing health insurance coverage",
      "Cardiovascular disease as leading cause of death",
      "Low life expectancy compared to national average",
      "Limited access to specialist care",
    ],
    organizations: [
      {
        name: "Health and Social Development Foundation (HSDF)",
        type: "ngo",
        focus: "Roma health promotion and mediation",
        website: "www.hsdf.bg",
      },
      {
        name: "Roma Health Project Bulgaria",
        type: "international",
        focus: "Access to healthcare for marginalized Roma",
      },
    ],
    keyFact: "Bulgaria's Roma community health mediator program was one of the first in the Balkans.",
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
    healthChallenges: [
      "Life expectancy 10–15 years lower than national average",
      "High rates of cardiovascular and respiratory disease",
      "Poverty-related malnutrition",
      "Low mental health service uptake",
      "Geographic isolation in northeastern Hungary",
    ],
    organizations: [
      {
        name: "Romaversitas Foundation",
        type: "ngo",
        focus: "Roma education including health literacy",
        website: "www.romaversitas.hu",
      },
      {
        name: "National Roma Self-Government",
        type: "government",
        focus: "Roma welfare and health advocacy",
      },
    ],
    keyFact: "Hungary has significant Roma populations concentrated in the Borsod, Szabolcs, and Baranya regions.",
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
    healthChallenges: [
      "The Šuto Orizari (Sutka) municipality has specific healthcare needs",
      "Hepatitis B prevalence",
      "Limited access to gynecological and maternal health services",
      "High rates of anemia especially in children and women",
      "COVID-19 vaccination hesitancy",
    ],
    organizations: [
      {
        name: "National Roma Centrum",
        type: "ngo",
        focus: "Roma rights and health access",
      },
      {
        name: "HOPS – Healthy Options Project Skopje",
        type: "ngo",
        focus: "Public health and harm reduction",
      },
    ],
    keyFact: "Šuto Orizari near Skopje is the largest Roma municipality in the world.",
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
    healthChallenges: [
      "Segregated settlements (osady) in eastern Slovakia lack infrastructure",
      "Tuberculosis rates among the highest in the EU",
      "Child malnutrition and stunting",
      "Limited access to clean water and sanitation in settlements",
      "Discrimination in healthcare settings reported",
    ],
    organizations: [
      {
        name: "Center for Civil and Human Rights (Poradňa)",
        type: "ngo",
        focus: "Anti-discrimination in healthcare",
        website: "www.poradna-prava.sk",
      },
      {
        name: "WHO Slovakia",
        type: "international",
        focus: "Public health programs including Roma health",
      },
    ],
    keyFact: "Slovakia has the highest proportion of Roma living in segregated settlements in the EU.",
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
    healthChallenges: [
      "Informal settlements (mahale) lacking health infrastructure",
      "High rates of hepatitis and intestinal parasites",
      "Limited birth registration affecting healthcare access",
      "Substance use challenges in urban Roma youth",
      "Mental health stigma within communities",
    ],
    organizations: [
      {
        name: "Roma National Council Serbia",
        type: "government",
        focus: "Roma rights and health policy",
      },
      {
        name: "Bibija Roma Women's Center",
        type: "ngo",
        focus: "Women and children's health",
      },
    ],
    keyFact: "Serbia's health mediator program trains Roma women as community health liaisons.",
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
    healthChallenges: [
      "Roma (Dom and Lom) communities face economic marginalization",
      "Limited documentation affecting healthcare access",
      "Higher rates of occupational health risks (waste collection workers)",
      "Limited maternal healthcare in informal urban areas",
      "Social isolation and mental health challenges",
    ],
    organizations: [
      {
        name: "Roman Bir-Der",
        type: "ngo",
        focus: "Roma rights and social inclusion in Turkey",
      },
      {
        name: "BRIC – Başkent Roma Integration Center",
        type: "ngo",
        focus: "Roma education and health literacy",
      },
    ],
    keyFact: "Roma communities in Turkey are largely concentrated in Istanbul, Edirne, and Izmir.",
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
    healthChallenges: [
      "Roma in rural camps lack access to municipal health services",
      "Economic crisis impact on healthcare access for vulnerable groups",
      "Hepatitis C in some communities",
      "Limited access to dental care",
      "Economic precarity worsened by COVID-19",
    ],
    organizations: [
      {
        name: "Greek National Roma Integration Strategy",
        type: "government",
        focus: "Roma inclusion across health, education, housing",
      },
      {
        name: "ARSIS – Association for Social Support of Youth",
        type: "ngo",
        focus: "Social and health support for marginalized groups",
      },
    ],
    keyFact: "Greece has Roma communities in both settled and nomadic camps across Central Macedonia and Thessaly.",
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
    healthChallenges: [
      "High child poverty and malnutrition rates",
      "Limited health insurance coverage",
      "Maternal mortality higher in Roma communities",
      "Limited access to safe housing affecting health",
      "Seasonal work leading to health instability",
    ],
    organizations: [
      {
        name: "Roma and Balkan Egyptian Community of Albania",
        type: "ngo",
        focus: "Roma rights and community development",
      },
      {
        name: "Amaro Drom Albania",
        type: "ngo",
        focus: "Education and health access for Roma",
      },
    ],
    keyFact: "Albania also has an Ashkali (Egyptian) minority historically grouped with Roma communities.",
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
    healthChallenges: [
      "Persistent segregation in housing with health impact",
      "High rates of preventable cardiovascular disease",
      "Lower vaccination rates in Roma communities",
      "Barriers in healthcare communication and literacy",
      "Challenges in accessing specialist care",
    ],
    organizations: [
      {
        name: "Agency for Social Inclusion (Czech Government)",
        type: "government",
        focus: "Integrated approach to Roma inclusion",
      },
      {
        name: "ERGO Network – Czech Member",
        type: "ngo",
        focus: "European Roma Grassroots Organizations advocacy",
      },
    ],
    keyFact: "The Czech Republic has a significant Roma population concentrated in Moravia and northern Bohemia.",
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
    healthChallenges: [
      "Roma in Međimurje county face healthcare access barriers",
      "Language barriers limiting healthcare communication",
      "Higher rates of diabetes in older Roma adults",
      "Limited preschool vaccination uptake",
      "Poverty affecting nutrition and health",
    ],
    organizations: [
      {
        name: "Kali Sara – Roma Women's Center Croatia",
        type: "ngo",
        focus: "Roma women's health and rights",
      },
      {
        name: "Roma National Council of Croatia",
        type: "government",
        focus: "Roma policy and inclusion",
      },
    ],
    keyFact: "Croatia's largest Roma community is in Međimurje County near the Hungarian border.",
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
    healthChallenges: [
      "Post-war infrastructure affecting healthcare in some regions",
      "Lack of personal documents restricting healthcare access",
      "High unemployment leading to lack of health insurance",
      "Childhood malnutrition in poorer Roma families",
      "Limited mental health services for community trauma",
    ],
    organizations: [
      {
        name: "Roma Center Sarajevo",
        type: "ngo",
        focus: "Roma rights, health access, and documentation",
      },
      {
        name: "OSCE Mission to Bosnia",
        type: "international",
        focus: "Minority rights including Roma health access",
      },
    ],
    keyFact: "Bosnia and Herzegovina has Roma communities in both the Federation and Republika Srpska entities.",
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
    healthChallenges: [
      "Roma in Mitrovica were displaced to lead-contaminated camps",
      "Severe poverty limiting healthcare access",
      "Limited Roma health mediators",
      "Post-conflict trauma and mental health needs",
      "High child mortality compared to national average",
    ],
    organizations: [
      {
        name: "Voice of Roma, Ashkali and Egyptians in Kosovo",
        type: "ngo",
        focus: "Roma RAE community rights and health",
      },
      {
        name: "UNHCR Kosovo",
        type: "international",
        focus: "Health access for displaced Roma populations",
      },
    ],
    keyFact: "Roma in North Mitrovica were exposed to severe lead poisoning in UN camps after the 1999 conflict.",
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
    healthChallenges: [
      "Roma in Dolenjska and Prekmurje regions face marginalization",
      "Lower educational attainment affecting health literacy",
      "Social exclusion impacting mental health",
      "Limited vaccination uptake in some settlements",
      "Poverty-related dietary deficiencies",
    ],
    organizations: [
      {
        name: "Romano Them Roma Association",
        type: "ngo",
        focus: "Roma social and cultural rights",
      },
      {
        name: "Republic of Slovenia Roma Community Council",
        type: "government",
        focus: "Roma welfare and health access",
      },
    ],
    keyFact: "Slovenia has two legally recognized Roma communities: the autochthonous (western) and non-autochthonous (eastern) Roma.",
    healthIndex: 3,
  },
];

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
