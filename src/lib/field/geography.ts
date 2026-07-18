import { ITALY_ASL_REGIONS } from "@/data/italy-asl-contacts";
import { ROMANIA_ECI_COUNTIES } from "@/data/romania-eci-contacts";

export type FieldCountry = "RO" | "IT";

export type GeoRegion = {
  code: string;
  name: string;
  detail?: string;
};

export function isFieldCountry(value: string | null | undefined): value is FieldCountry {
  return value === "RO" || value === "IT";
}

export function regionsForCountry(country: FieldCountry): GeoRegion[] {
  if (country === "IT") {
    return ITALY_ASL_REGIONS.map((r) => ({
      code: r.code,
      name: r.name,
      detail: r.aslName,
    }));
  }
  return ROMANIA_ECI_COUNTIES.map((c) => ({
    code: c.code,
    name: c.name,
  }));
}

export function regionLabel(country: FieldCountry, code: string): string {
  const hit = regionsForCountry(country).find((r) => r.code === code);
  if (!hit) return code;
  return hit.detail ? `${hit.name} · ${hit.detail}` : hit.name;
}

/** Infer country from a stored region/county code when country is missing. */
export function inferCountryFromRegion(code: string): FieldCountry {
  if (ITALY_ASL_REGIONS.some((r) => r.code === code)) return "IT";
  return "RO";
}
