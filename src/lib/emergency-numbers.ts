import { REGIONS } from "@/data/regions";

/**
 * Per-country service numbers (ambulance, police, etc.) for the SOS sheet.
 * Main emergency line for the large CTA comes from `REGIONS` when possible.
 */
export const SERVICE_NUMBERS: Record<
  string,
  { ambulance: string; police: string; fire: string; domestic: string; poison: string }
> = {
  albania: { ambulance: "127", police: "129", fire: "128", domestic: "116 117", poison: "127" },
  romania: { ambulance: "112", police: "112", fire: "112", domestic: "0800 500 333", poison: "021 318 3606" },
  bulgaria: { ambulance: "150", police: "166", fire: "160", domestic: "02 981 7686", poison: "112" },
  hungary: { ambulance: "104", police: "107", fire: "105", domestic: "06 80 505 101", poison: "06 80 201 199" },
  slovakia: { ambulance: "155", police: "158", fire: "150", domestic: "0800 212 212", poison: "02 5477 4166" },
  serbia: { ambulance: "194", police: "192", fire: "193", domestic: "0800 100 007", poison: "112" },
  northMacedonia: { ambulance: "194", police: "192", fire: "193", domestic: "1800 116 006", poison: "02 25 12 12" },
  czech: { ambulance: "155", police: "158", fire: "150", domestic: "116 006", poison: "224 54 19 19" },
  croatia: { ambulance: "194", police: "192", fire: "193", domestic: "116 006", poison: "01 23 45 67" },
  bosnia: { ambulance: "124", police: "122", fire: "123", domestic: "1265", poison: "124" },
  greece: { ambulance: "166", police: "100", fire: "199", domestic: "15900", poison: "210 77 93 777" },
  turkey: { ambulance: "112", police: "155", fire: "110", domestic: "183", poison: "114" },
  kosovo: { ambulance: "94", police: "92", fire: "93", domestic: "0800 11 12", poison: "112" },
  slovenia: { ambulance: "112", police: "113", fire: "112", domestic: "116 123", poison: "112" },
  default: { ambulance: "112", police: "112", fire: "112", domestic: "112", poison: "112" },
};

export function getServiceNumbersForRegion(regionId: string) {
  return SERVICE_NUMBERS[regionId] ?? SERVICE_NUMBERS.default;
}

export function getPrimaryEmergencyTel(regionId: string): string {
  if (regionId === "default") return "112";
  const r = REGIONS.find((x) => x.id === regionId);
  return (r?.emergencyNumber ?? "112").replace(/\s/g, "");
}
