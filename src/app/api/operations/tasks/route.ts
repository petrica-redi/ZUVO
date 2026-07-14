/**
 * GET  /api/operations/tasks — List tasks for workspace
 * POST /api/operations/tasks — Create a task
 */
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getDb } from "@/db/client";
import { parseJsonBody } from "@/lib/api/validation";
import { applyRateLimitAsync } from "@/lib/api/rate-limit";
import { auditLog } from "@/lib/audit";
import { getClientIp } from "@/lib/api/validation";
import { CASE_URGENCIES, TASK_TYPES } from "@/lib/operations/constants";
import { createTask, listTasks } from "@/lib/operations/case-service";
import {
  databaseUnavailableResponse,
  resolveOperationActor,
  workspaceMissingResponse,
  workspaceUnauthorizedResponse,
} from "@/lib/operations/api-auth";

const createTaskSchema = z.object({
  caseId: z.string().uuid().optional(),
  title: z.string().trim().min(1).max(200),
  description: z.string().trim().max(2000).optional(),
  taskType: z.enum(TASK_TYPES).optional(),
  priority: z.enum(CASE_URGENCIES).optional(),
  assignee: z.string().trim().max(80).optional(),
  dueDate: z.string().trim().max(20).optional(),
  reminderDate: z.string().trim().max(20).optional(),
});

export async function GET(req: NextRequest) {
  const actor = await resolveOperationActor(req);
  if (!actor) {
    const id = req.headers.get("x-workspace-id");
    return id ? workspaceUnauthorizedResponse() : workspaceMissingResponse();
  }

  const rate = await applyRateLimitAsync(req, {
    namespace: "operations-tasks-read",
    limit: 120,
    windowMs: 60_000,
  });
  if (!rate.allowed) return rate.response;

  if (!getDb()) return databaseUnavailableResponse();

  const tasks = await listTasks(actor.workspaceId);
  return NextResponse.json({ success: true, data: tasks });
}

export async function POST(req: NextRequest) {
  const actor = await resolveOperationActor(req);
  if (!actor) {
    const id = req.headers.get("x-workspace-id");
    return id ? workspaceUnauthorizedResponse() : workspaceMissingResponse();
  }

  const rate = await applyRateLimitAsync(req, {
    namespace: "operations-tasks-write",
    limit: 60,
    windowMs: 60_000,
  });
  if (!rate.allowed) return rate.response;

  const parsed = await parseJsonBody(req, createTaskSchema);
  if (!parsed.success) return parsed.response;

  if (!getDb()) return databaseUnavailableResponse();

  const task = await createTask(actor, parsed.data);
  if (!task) {
    return NextResponse.json(
      { success: false, error: "Failed to create task" },
      { status: 500 },
    );
  }

  void auditLog({
    userId: actor.workspaceId,
    action: "operations.task_created",
    resourceType: "operation_task",
    resourceId: task.id,
    metadata: { taskType: task.taskType, caseId: task.caseId },
    ipAddress: getClientIp(req),
  });

  return NextResponse.json({ success: true, data: task }, { status: 201 });
}
