CREATE TABLE "achievements" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"icon" text NOT NULL,
	"point_value" integer DEFAULT 10 NOT NULL,
	"category" text NOT NULL,
	"criteria" jsonb NOT NULL,
	"title_key" text NOT NULL,
	"description_key" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "achievements_slug_unique" UNIQUE("slug")
);

CREATE TABLE "audit_log" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"session_id" text,
	"action" text NOT NULL,
	"resource_type" text,
	"resource_id" text,
	"metadata" jsonb,
	"ip_address" text,
	"user_agent" text,
	"created_at" timestamp with time zone DEFAULT now()
);

CREATE TABLE "challenge_participations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"challenge_id" uuid NOT NULL,
	"current_value" integer DEFAULT 0 NOT NULL,
	"is_completed" boolean DEFAULT false NOT NULL,
	"completed_at" timestamp with time zone
);

CREATE TABLE "challenges" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"type" text NOT NULL,
	"title_key" text NOT NULL,
	"description_key" text NOT NULL,
	"target_value" integer NOT NULL,
	"point_reward" integer DEFAULT 50 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"start_date" timestamp with time zone NOT NULL,
	"end_date" timestamp with time zone NOT NULL,
	"metadata" jsonb,
	"created_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "challenges_slug_unique" UNIQUE("slug")
);

CREATE TABLE "communities" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"region" text NOT NULL,
	"municipality" text NOT NULL,
	"mediator_id" uuid,
	"latitude" real,
	"longitude" real,
	"estimated_population" integer,
	"created_at" timestamp with time zone DEFAULT now()
);

CREATE TABLE "community_members" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"community_id" uuid NOT NULL,
	"joined_at" timestamp with time zone DEFAULT now()
);

CREATE TABLE "health_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"type" text NOT NULL,
	"value" real NOT NULL,
	"unit" text,
	"note" text,
	"pillar_id" text,
	"metadata" jsonb,
	"logged_at" timestamp with time zone DEFAULT now(),
	"created_at" timestamp with time zone DEFAULT now()
);

CREATE TABLE "mediator_assignments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"pillar_id" text NOT NULL,
	"module_id" text NOT NULL,
	"assigned_by" uuid NOT NULL,
	"due_date" timestamp with time zone,
	"notes" text,
	"is_completed" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now()
);

CREATE TABLE "mediator_profiles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"employer" text,
	"region" text NOT NULL,
	"communities_served" jsonb DEFAULT '[]'::jsonb,
	"certifications" jsonb DEFAULT '[]'::jsonb,
	"is_verified" boolean DEFAULT false NOT NULL,
	"verified_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "mediator_profiles_user_id_unique" UNIQUE("user_id")
);

CREATE TABLE "mediator_visits" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"mediator_id" uuid NOT NULL,
	"community_id" uuid,
	"member_name" text,
	"visit_date" timestamp with time zone DEFAULT now(),
	"notes" text,
	"metadata" jsonb,
	"created_at" timestamp with time zone DEFAULT now()
);

CREATE TABLE "notifications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"type" text NOT NULL,
	"title" text NOT NULL,
	"body" text NOT NULL,
	"data" jsonb,
	"is_read" boolean DEFAULT false NOT NULL,
	"sent_at" timestamp with time zone DEFAULT now()
);

CREATE TABLE "progress" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"pillar_id" text NOT NULL,
	"module_id" text NOT NULL,
	"status" text DEFAULT 'not_started' NOT NULL,
	"quiz_score" real,
	"started_at" timestamp with time zone,
	"completed_at" timestamp with time zone,
	"last_accessed_at" timestamp with time zone DEFAULT now(),
	"created_at" timestamp with time zone DEFAULT now()
);

CREATE TABLE "provider_ratings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"provider_id" uuid NOT NULL,
	"rating" integer NOT NULL,
	"comment" text,
	"is_anonymous" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now()
);

CREATE TABLE "providers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"type" text NOT NULL,
	"latitude" real NOT NULL,
	"longitude" real NOT NULL,
	"address" text NOT NULL,
	"phone" text,
	"website" text,
	"region" text,
	"is_roma_friendly" boolean DEFAULT false NOT NULL,
	"is_free_clinic" boolean DEFAULT false NOT NULL,
	"has_interpreter" boolean DEFAULT false NOT NULL,
	"languages" jsonb DEFAULT '[]'::jsonb,
	"operating_hours" jsonb,
	"verified_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);

CREATE TABLE "user_achievements" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"achievement_id" uuid NOT NULL,
	"earned_at" timestamp with time zone DEFAULT now()
);

CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"auth_id" uuid,
	"anonymous_id" text,
	"email" text,
	"display_name" text,
	"phone" text,
	"role" text DEFAULT 'user' NOT NULL,
	"locale" text DEFAULT 'sq' NOT NULL,
	"profile_type" text,
	"age_group" text,
	"gender" text,
	"avatar_url" text,
	"is_anonymous" boolean DEFAULT true NOT NULL,
	"total_points" integer DEFAULT 0 NOT NULL,
	"current_streak" integer DEFAULT 0 NOT NULL,
	"longest_streak" integer DEFAULT 0 NOT NULL,
	"last_active_date" text,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "users_auth_id_unique" UNIQUE("auth_id"),
	CONSTRAINT "users_anonymous_id_unique" UNIQUE("anonymous_id"),
	CONSTRAINT "users_phone_unique" UNIQUE("phone")
);

CREATE INDEX "idx_audit_user" ON "audit_log" USING btree ("user_id","created_at");
CREATE INDEX "idx_challenge_user" ON "challenge_participations" USING btree ("user_id","challenge_id");
CREATE INDEX "idx_comm_member" ON "community_members" USING btree ("user_id","community_id");
CREATE INDEX "idx_health_user_type" ON "health_logs" USING btree ("user_id","type","logged_at");
CREATE INDEX "idx_assignment_user" ON "mediator_assignments" USING btree ("user_id");
CREATE INDEX "idx_visit_mediator" ON "mediator_visits" USING btree ("mediator_id","visit_date");
CREATE INDEX "idx_notif_user" ON "notifications" USING btree ("user_id","is_read");
CREATE INDEX "idx_progress_user" ON "progress" USING btree ("user_id","pillar_id");
CREATE INDEX "idx_rating_provider" ON "provider_ratings" USING btree ("provider_id");
CREATE INDEX "idx_provider_region" ON "providers" USING btree ("region","type");
CREATE INDEX "idx_user_achievements" ON "user_achievements" USING btree ("user_id");
