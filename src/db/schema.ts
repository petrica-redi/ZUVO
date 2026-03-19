/**
 * Drizzle ORM schema — Sastipe
 *
 * Primary persistence is Supabase PostgreSQL (with RLS).
 * This schema mirrors the core tables for type-safe queries via Drizzle.
 * The authoritative source of truth for migrations is `supabase/migrations/`.
 *
 * Add tables here as features are implemented.
 */

import { pgTable, text, timestamp, uuid, jsonb } from "drizzle-orm/pg-core";

// ── Users ──────────────────────────────────────────────────────────────────
export const users = pgTable("users", {
  id: uuid("id").primaryKey(),
  email: text("email"),
  displayName: text("display_name"),
  locale: text("locale").default("sq"),
  avatarUrl: text("avatar_url"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

// ── Audit log ──────────────────────────────────────────────────────────────
export const auditLog = pgTable("audit_log", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id"),
  action: text("action").notNull(),
  resourceType: text("resource_type"),
  resourceId: text("resource_id"),
  metadata: jsonb("metadata"),
  ipAddress: text("ip_address"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

// ── Health logs ────────────────────────────────────────────────────────────
export const healthLogs = pgTable("health_logs", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull(),
  pillarId: text("pillar_id").notNull(),
  note: text("note"),
  metadata: jsonb("metadata"),
  loggedAt: timestamp("logged_at", { withTimezone: true }).defaultNow(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});
