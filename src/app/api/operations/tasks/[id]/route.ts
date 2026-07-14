/**
 * PATCH /api/operations/tasks/[id] — Update task status
 */
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getDb } from "@/db/client";
import { parseJsonBody } from "@/lib/api/validation";
import { applyRateLimitAsync } from "@/lib/api/rate-limit";
import { auditLog } from "@/lib/audit";
import { getClientIp } from "@/lib/api/validation";
import { TASK_STATUSES } from "@/lib/operations/constants";
import { updateTaskStatus } from "@/lib/operations/case-service";
import {
  databaseUnavailableResponse,
  resolveOperationActor,
  workspaceMissingResponse,
  workspaceUnauthorizedResponse,
} from "@/lib/operations/api-auth";

const patchSchema = z.object({
  status: z.enum(TASK_STATUSES),
  completionEvidence: z.string().trim().max(2000).optional(),
});

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(req: NextRequest, context: RouteContext) {
  const actor = await resolveOperationActor(req);
  if (!actor) {
    const id = req.headers.get("x-workspace-id");
    return id ? workspaceUnauthorizedResponse() : workspaceMissingResponse();
  }

  const rate = await applyRateLimitAsync(req, {
    namespace: "operations-tasks-patch",
    limit: 60,
    windowMs: 60_000,
  });
  if (!rate.allowed) return rate.response;

  const parsed = await parseJsonBody(req, patchSchema);
  if (!parsed.success) return parsed.response;

  if (!getDb()) return databaseUnavailableResponse();

  const { id } = await context.params;
  const task = await updateTaskStatus(
    actor,
    id,
    parsed.data.status,
    parsed.data.completionEvidence,
  );

  if (!task) {
    return NextResponse.json(
      { success: false, error: "Task not found or access denied" },
      { status: 404 },
    );
  }

  if (task.status === "completed") {
    void auditLog({
      userId: actor.workspaceId,
      action: "operations.task_completed",
      resourceType: "operation_task",
      resourceId: task.id,
      metadata: { caseId: task.caseId },
      ipAddress: getClientIp(req),
    });
  }

  return NextResponse.json({ success: true, data: task });
}
