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
