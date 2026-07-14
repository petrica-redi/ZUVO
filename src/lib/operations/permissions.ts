/** Workspace-scoped access control for operational data. */

export type OperationActor = {
  workspaceId: string;
  isAdmin: boolean;
  organisationId?: string;
};

export function assertWorkspaceAccess(
  actor: OperationActor,
  resourceWorkspaceId: string,
): boolean {
  if (actor.isAdmin) return true;
  return actor.workspaceId === resourceWorkspaceId;
}

export function canReadAggregates(role: string): boolean {
  return ["admin", "manager", "supervisor", "ministry_viewer"].includes(role);
}

export function canExportIdentifiable(role: string): boolean {
  return ["admin", "supervisor", "mediator"].includes(role);
}

export function ministryCannotSeePseudonym(role: string): boolean {
  return role === "ministry_viewer" || role === "manager";
}

export function canManageQualityFlags(role: string): boolean {
  return ["admin", "supervisor"].includes(role);
}

export function canViewQualityFlags(role: string): boolean {
  return ["admin", "supervisor", "mediator"].includes(role);
}

export function canExportScope(role: string, scope: string): boolean {
  if (scope === "national" || scope === "organisation") {
    return canReadAggregates(role);
  }
  return canExportIdentifiable(role) || role === "supervisor";
}

/** Suppress small-cell counts on ministry dashboards (k-anonymity). */
export function applyIndicatorThreshold(count: number, minThreshold = 5): number | null {
  return count >= minThreshold ? count : null;
}
