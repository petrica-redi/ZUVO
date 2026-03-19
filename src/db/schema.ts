/**
 * Drizzle ORM schema — Sastipe / Zuvo
 *
 * Primary persistence is Supabase PostgreSQL (with RLS).
 * This schema mirrors the core tables for type-safe queries via Drizzle.
 * The authoritative source of truth for migrations is `supabase/migrations/`.
 *
 * Tables:
 *  - users          Core user profiles (anonymous or registered)
 *  - auditLog       GDPR-compliant action tracking
 *  - healthLogs     Health measurements and daily check-ins
 *  - progress       Module completion tracking
 *  - achievements   Badge definitions
 *  - userAchievements  Earned badges per user
 *  - challenges     Community / family / individual challenges
 *  - challengeParticipations  Challenge engagement
 *  - providers      Healthcare provider directory
 *  - providerRatings  Anonymous community ratings
 *  - communities    Roma settlements / communities
 *  - communityMembers  User ↔ community membership
 *  - mediatorProfiles  Health mediator extended profile
 *  - mediatorAssignments  Module assignments from mediator to user
 *  - mediatorVisits   Field visit logs
 *  - notifications  Push / in-app notifications
 */

import {
  pgTable,
  text,
  timestamp,
  uuid,
  jsonb,
  integer,
  real,
  boolean,
  index,
} from "drizzle-orm/pg-core";

// ── Users ──────────────────────────────────────────────────────────────────
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  authId: uuid("auth_id").unique(), // Supabase auth.uid() for registered users
  anonymousId: text("anonymous_id").unique(), // For anonymous sessions
  email: text("email"),
  displayName: text("display_name"),
  phone: text("phone").unique(),
  role: text("role").notNull().default("user"), // user | mediator | admin | content_manager
  locale: text("locale").notNull().default("sq"),
  profileType: text("profile_type"), // general | pregnant | parent_young_child | chronic_condition | youth
  ageGroup: text("age_group"), // youth_15_25 | adult_26_40 | adult_41_60 | senior_60_plus
  gender: text("gender"), // male | female | prefer_not_say
  avatarUrl: text("avatar_url"),
  isAnonymous: boolean("is_anonymous").notNull().default(true),
  totalPoints: integer("total_points").notNull().default(0),
  currentStreak: integer("current_streak").notNull().default(0),
  longestStreak: integer("longest_streak").notNull().default(0),
  lastActiveDate: text("last_active_date"), // ISO date string
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

// ── Audit log ──────────────────────────────────────────────────────────────
export const auditLog = pgTable(
  "audit_log",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id"),
    sessionId: text("session_id"),
    action: text("action").notNull(),
    resourceType: text("resource_type"),
    resourceId: text("resource_id"),
    metadata: jsonb("metadata"),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  },
  (t) => [index("idx_audit_user").on(t.userId, t.createdAt)]
);

// ── Health logs ────────────────────────────────────────────────────────────
export const healthLogs = pgTable(
  "health_logs",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").notNull(),
    type: text("type").notNull(), // mood | water | activity | bp_systolic | bp_diastolic | blood_glucose | weight | temperature | vaccination
    value: real("value").notNull(), // numeric value (mood 1-5, water glasses, etc.)
    unit: text("unit"), // glasses, bpm, mg/dL, kg, etc.
    note: text("note"),
    pillarId: text("pillar_id"), // optional link to pillar
    metadata: jsonb("metadata"), // flexible extra data
    loggedAt: timestamp("logged_at", { withTimezone: true }).defaultNow(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  },
  (t) => [index("idx_health_user_type").on(t.userId, t.type, t.loggedAt)]
);

// ── Module progress ────────────────────────────────────────────────────────
export const progress = pgTable(
  "progress",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").notNull(),
    pillarId: text("pillar_id").notNull(), // prevention, nutrition, etc.
    moduleId: text("module_id").notNull(), // handwashing, vaccination, etc.
    status: text("status").notNull().default("not_started"), // not_started | in_progress | completed
    quizScore: real("quiz_score"),
    startedAt: timestamp("started_at", { withTimezone: true }),
    completedAt: timestamp("completed_at", { withTimezone: true }),
    lastAccessedAt: timestamp("last_accessed_at", { withTimezone: true }).defaultNow(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  },
  (t) => [index("idx_progress_user").on(t.userId, t.pillarId)]
);

// ── Achievements ───────────────────────────────────────────────────────────
export const achievements = pgTable("achievements", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: text("slug").unique().notNull(),
  icon: text("icon").notNull(), // emoji or lucide icon name
  pointValue: integer("point_value").notNull().default(10),
  category: text("category").notNull(), // learning | streak | health_log | community | special
  criteria: jsonb("criteria").notNull(), // { type, count, pillar?, ... }
  titleKey: text("title_key").notNull(), // i18n key
  descriptionKey: text("description_key").notNull(), // i18n key
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const userAchievements = pgTable(
  "user_achievements",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").notNull(),
    achievementId: uuid("achievement_id").notNull(),
    earnedAt: timestamp("earned_at", { withTimezone: true }).defaultNow(),
  },
  (t) => [index("idx_user_achievements").on(t.userId)]
);

// ── Challenges ─────────────────────────────────────────────────────────────
export const challenges = pgTable("challenges", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: text("slug").unique().notNull(),
  type: text("type").notNull(), // individual | family | community
  titleKey: text("title_key").notNull(),
  descriptionKey: text("description_key").notNull(),
  targetValue: integer("target_value").notNull(),
  pointReward: integer("point_reward").notNull().default(50),
  isActive: boolean("is_active").notNull().default(true),
  startDate: timestamp("start_date", { withTimezone: true }).notNull(),
  endDate: timestamp("end_date", { withTimezone: true }).notNull(),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const challengeParticipations = pgTable(
  "challenge_participations",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").notNull(),
    challengeId: uuid("challenge_id").notNull(),
    currentValue: integer("current_value").notNull().default(0),
    isCompleted: boolean("is_completed").notNull().default(false),
    completedAt: timestamp("completed_at", { withTimezone: true }),
  },
  (t) => [index("idx_challenge_user").on(t.userId, t.challengeId)]
);

// ── Healthcare Providers ───────────────────────────────────────────────────
export const providers = pgTable(
  "providers",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    type: text("type").notNull(), // hospital | clinic | pharmacy | emergency | mediator_office | maternity | mental_health | dental
    latitude: real("latitude").notNull(),
    longitude: real("longitude").notNull(),
    address: text("address").notNull(),
    phone: text("phone"),
    website: text("website"),
    region: text("region"), // albania, romania, etc.
    isRomaFriendly: boolean("is_roma_friendly").notNull().default(false),
    isFreeClinic: boolean("is_free_clinic").notNull().default(false),
    hasInterpreter: boolean("has_interpreter").notNull().default(false),
    languages: jsonb("languages").default([]), // ["sq", "rom", "en"]
    operatingHours: jsonb("operating_hours"), // { mon: "08:00-16:00", ... }
    verifiedAt: timestamp("verified_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
  },
  (t) => [index("idx_provider_region").on(t.region, t.type)]
);

export const providerRatings = pgTable(
  "provider_ratings",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    providerId: uuid("provider_id").notNull(),
    rating: integer("rating").notNull(), // 1-5
    comment: text("comment"),
    isAnonymous: boolean("is_anonymous").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  },
  (t) => [index("idx_rating_provider").on(t.providerId)]
);

// ── Communities & Mediators ────────────────────────────────────────────────
export const communities = pgTable("communities", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  region: text("region").notNull(),
  municipality: text("municipality").notNull(),
  mediatorId: uuid("mediator_id"),
  latitude: real("latitude"),
  longitude: real("longitude"),
  estimatedPopulation: integer("estimated_population"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const communityMembers = pgTable(
  "community_members",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").notNull(),
    communityId: uuid("community_id").notNull(),
    joinedAt: timestamp("joined_at", { withTimezone: true }).defaultNow(),
  },
  (t) => [index("idx_comm_member").on(t.userId, t.communityId)]
);

export const mediatorProfiles = pgTable("mediator_profiles", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").unique().notNull(),
  employer: text("employer"),
  region: text("region").notNull(),
  communitiesServed: jsonb("communities_served").default([]),
  certifications: jsonb("certifications").default([]),
  isVerified: boolean("is_verified").notNull().default(false),
  verifiedAt: timestamp("verified_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const mediatorAssignments = pgTable(
  "mediator_assignments",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").notNull(),
    pillarId: text("pillar_id").notNull(),
    moduleId: text("module_id").notNull(),
    assignedBy: uuid("assigned_by").notNull(),
    dueDate: timestamp("due_date", { withTimezone: true }),
    notes: text("notes"),
    isCompleted: boolean("is_completed").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  },
  (t) => [index("idx_assignment_user").on(t.userId)]
);

export const mediatorVisits = pgTable(
  "mediator_visits",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    mediatorId: uuid("mediator_id").notNull(),
    communityId: uuid("community_id"),
    memberName: text("member_name"),
    visitDate: timestamp("visit_date", { withTimezone: true }).defaultNow(),
    notes: text("notes"),
    metadata: jsonb("metadata"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  },
  (t) => [index("idx_visit_mediator").on(t.mediatorId, t.visitDate)]
);

// ── Notifications ──────────────────────────────────────────────────────────
export const notifications = pgTable(
  "notifications",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").notNull(),
    type: text("type").notNull(), // module_reminder | vaccination_due | challenge_invite | achievement_earned | mediator_message | campaign
    title: text("title").notNull(),
    body: text("body").notNull(),
    data: jsonb("data"),
    isRead: boolean("is_read").notNull().default(false),
    sentAt: timestamp("sent_at", { withTimezone: true }).defaultNow(),
  },
  (t) => [index("idx_notif_user").on(t.userId, t.isRead)]
);
