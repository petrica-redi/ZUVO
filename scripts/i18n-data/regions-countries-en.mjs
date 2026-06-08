/** English source for regions.countries — keyed by region id. */

function country(challenges, keyFact, orgFocuses) {
  const healthChallenges = Object.fromEntries(challenges.map((text, i) => [String(i), text]));
  const organizations = Object.fromEntries(orgFocuses.map((focus, i) => [String(i), { focus }]));
  return { healthChallenges, keyFact, organizations };
}

export const REGION_IDS = [
  "romania",
  "bulgaria",
  "hungary",
  "northMacedonia",
  "slovakia",
  "serbia",
  "turkey",
  "greece",
  "albania",
  "czech",
  "croatia",
  "bosnia",
  "kosovo",
  "slovenia",
];

export const ENGLISH_COUNTRIES = {
  romania: country(
    [
      "Limited access to health insurance",
      "High infant and maternal mortality in Roma communities",
      "Tuberculosis rates higher than national average",
      "Low vaccination coverage in rural settlements",
      "Barriers to registering with family doctors",
    ],
    "Romania has the largest Roma population in Europe and a national health mediator program.",
    [
      "Roma rights, health mediation",
      "Roma inclusion policies",
      "Mobile health clinics in marginalized communities",
    ],
  ),
  bulgaria: country(
    [
      "Segregated neighborhoods limiting healthcare access",
      "High unemployment reducing health insurance coverage",
      "Cardiovascular disease as leading cause of death",
      "Low life expectancy compared to national average",
      "Limited access to specialist care",
    ],
    "Bulgaria's Roma community health mediator program was one of the first in the Balkans.",
    ["Roma health promotion and mediation", "Access to healthcare for marginalized Roma"],
  ),
  hungary: country(
    [
      "Life expectancy 10–15 years lower than national average",
      "High rates of cardiovascular and respiratory disease",
      "Poverty-related malnutrition",
      "Low mental health service uptake",
      "Geographic isolation in northeastern Hungary",
    ],
    "Hungary has significant Roma populations concentrated in the Borsod, Szabolcs, and Baranya regions.",
    ["Roma education including health literacy", "Roma welfare and health advocacy"],
  ),
  northMacedonia: country(
    [
      "The Šuto Orizari (Sutka) municipality has specific healthcare needs",
      "Hepatitis B prevalence",
      "Limited access to gynecological and maternal health services",
      "High rates of anemia especially in children and women",
      "COVID-19 vaccination hesitancy",
    ],
    "Šuto Orizari near Skopje is the largest Roma municipality in the world.",
    ["Roma rights and health access", "Public health and harm reduction"],
  ),
  slovakia: country(
    [
      "Segregated settlements (osady) in eastern Slovakia lack infrastructure",
      "Tuberculosis rates among the highest in the EU",
      "Child malnutrition and stunting",
      "Limited access to clean water and sanitation in settlements",
      "Discrimination in healthcare settings reported",
    ],
    "Slovakia has the highest proportion of Roma living in segregated settlements in the EU.",
    ["Anti-discrimination in healthcare", "Public health programs including Roma health"],
  ),
  serbia: country(
    [
      "Informal settlements (mahale) lacking health infrastructure",
      "High rates of hepatitis and intestinal parasites",
      "Limited birth registration affecting healthcare access",
      "Substance use challenges in urban Roma youth",
      "Mental health stigma within communities",
    ],
    "Serbia's health mediator program trains Roma women as community health liaisons.",
    ["Roma rights and health policy", "Women and children's health"],
  ),
  turkey: country(
    [
      "Roma (Dom and Lom) communities face economic marginalization",
      "Limited documentation affecting healthcare access",
      "Higher rates of occupational health risks (waste collection workers)",
      "Limited maternal healthcare in informal urban areas",
      "Social isolation and mental health challenges",
    ],
    "Roma communities in Turkey are largely concentrated in Istanbul, Edirne, and Izmir.",
    ["Roma rights and social inclusion in Turkey", "Roma education and health literacy"],
  ),
  greece: country(
    [
      "Roma in rural camps lack access to municipal health services",
      "Economic crisis impact on healthcare access for vulnerable groups",
      "Hepatitis C in some communities",
      "Limited access to dental care",
      "Economic precarity worsened by COVID-19",
    ],
    "Greece has Roma communities in both settled and nomadic camps across Central Macedonia and Thessaly.",
    ["Roma inclusion across health, education, housing", "Social and health support for marginalized groups"],
  ),
  albania: country(
    [
      "High child poverty and malnutrition rates",
      "Limited health insurance coverage",
      "Maternal mortality higher in Roma communities",
      "Limited access to safe housing affecting health",
      "Seasonal work leading to health instability",
    ],
    "Albania also has an Ashkali (Egyptian) minority historically grouped with Roma communities.",
    ["Roma rights and community development", "Education and health access for Roma"],
  ),
  czech: country(
    [
      "Persistent segregation in housing with health impact",
      "High rates of preventable cardiovascular disease",
      "Lower vaccination rates in Roma communities",
      "Barriers in healthcare communication and literacy",
      "Challenges in accessing specialist care",
    ],
    "The Czech Republic has a significant Roma population concentrated in Moravia and northern Bohemia.",
    ["Integrated approach to Roma inclusion", "European Roma Grassroots Organizations advocacy"],
  ),
  croatia: country(
    [
      "Roma in Međimurje county face healthcare access barriers",
      "Language barriers limiting healthcare communication",
      "Higher rates of diabetes in older Roma adults",
      "Limited preschool vaccination uptake",
      "Poverty affecting nutrition and health",
    ],
    "Croatia's largest Roma community is in Međimurje County near the Hungarian border.",
    ["Roma women's health and rights", "Roma policy and inclusion"],
  ),
  bosnia: country(
    [
      "Post-war infrastructure affecting healthcare in some regions",
      "Lack of personal documents restricting healthcare access",
      "High unemployment leading to lack of health insurance",
      "Childhood malnutrition in poorer Roma families",
      "Limited mental health services for community trauma",
    ],
    "Bosnia and Herzegovina has Roma communities in both the Federation and Republika Srpska entities.",
    ["Roma rights, health access, and documentation", "Minority rights including Roma health access"],
  ),
  kosovo: country(
    [
      "Roma in Mitrovica were displaced to lead-contaminated camps",
      "Severe poverty limiting healthcare access",
      "Limited Roma health mediators",
      "Post-conflict trauma and mental health needs",
      "High child mortality compared to national average",
    ],
    "Roma in North Mitrovica were exposed to severe lead poisoning in UN camps after the 1999 conflict.",
    ["Roma RAE community rights and health", "Health access for displaced Roma populations"],
  ),
  slovenia: country(
    [
      "Roma in Dolenjska and Prekmurje regions face marginalization",
      "Lower educational attainment affecting health literacy",
      "Social exclusion impacting mental health",
      "Limited vaccination uptake in some settlements",
      "Poverty-related dietary deficiencies",
    ],
    "Slovenia has two legally recognized Roma communities: the autochthonous (western) and non-autochthonous (eastern) Roma.",
    ["Roma social and cultural rights", "Roma welfare and health access"],
  ),
};
