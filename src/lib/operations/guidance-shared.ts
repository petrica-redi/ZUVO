export type CountryAccessGuidance = {
  id: string;
  originCountryCode: string;
  destinationCountryCode: string;
  topicSlug: string;
  titleKey: string;
  contentTemplate: string;
  sortOrder: number;
  isActive: boolean;
  organisationId?: string;
  updatedBy?: string;
  createdAt: string;
  updatedAt: string;
};

export function renderGuidanceTemplate(
  template: string,
  vars: Record<string, string>,
): string {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key: string) => vars[key] ?? `{{${key}}}`);
}
