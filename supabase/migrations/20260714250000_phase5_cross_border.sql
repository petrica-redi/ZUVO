-- Phase 5: Cross-border continuity — handover consent, team workflow, country guidance

-- ── Cross-border handovers ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS cross_border_handovers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id uuid NOT NULL REFERENCES navigation_cases(id) ON DELETE CASCADE,
  case_number text NOT NULL,
  origin_country_code text NOT NULL,
  destination_country_code text NOT NULL,
  origin_workspace_id text NOT NULL,
  destination_workspace_id text,
  origin_team_id uuid REFERENCES teams(id) ON DELETE SET NULL,
  destination_team_id uuid REFERENCES teams(id) ON DELETE SET NULL,
  status text NOT NULL DEFAULT 'consent_pending' CHECK (
    status IN (
      'consent_pending',
      'requested',
      'accepted',
      'rejected',
      'in_progress',
      'completed',
      'cancelled'
    )
  ),
  consent_status text NOT NULL DEFAULT 'pending' CHECK (
    consent_status IN ('pending', 'granted', 'withdrawn')
  ),
  consent_granted_at timestamptz,
  consent_recorded_by text,
  reason text NOT NULL DEFAULT '',
  rejection_reason text,
  navigation_summary jsonb NOT NULL DEFAULT '{}',
  shared_payload jsonb,
  requested_by text,
  accepted_by text,
  completed_by text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  completed_at timestamptz
);

CREATE INDEX IF NOT EXISTS idx_handover_origin ON cross_border_handovers(origin_workspace_id, status);
CREATE INDEX IF NOT EXISTS idx_handover_destination ON cross_border_handovers(destination_workspace_id, status);
CREATE INDEX IF NOT EXISTS idx_handover_case ON cross_border_handovers(case_id);
CREATE INDEX IF NOT EXISTS idx_handover_countries ON cross_border_handovers(origin_country_code, destination_country_code);

-- ── Handover event log (in addition to platform audit_log) ───────────────────
CREATE TABLE IF NOT EXISTS cross_border_handover_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  handover_id uuid NOT NULL REFERENCES cross_border_handovers(id) ON DELETE CASCADE,
  event_type text NOT NULL CHECK (
    event_type IN (
      'created',
      'consent_recorded',
      'consent_withdrawn',
      'requested',
      'accepted',
      'rejected',
      'data_shared',
      'completed',
      'cancelled'
    )
  ),
  actor_workspace_id text NOT NULL,
  metadata jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_handover_events ON cross_border_handover_events(handover_id, created_at);

-- ── Country-specific access guidance (admin-configurable templates) ────────────
CREATE TABLE IF NOT EXISTS country_access_guidance (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  origin_country_code text NOT NULL,
  destination_country_code text NOT NULL,
  topic_slug text NOT NULL,
  title_key text NOT NULL,
  content_template text NOT NULL DEFAULT '',
  sort_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  organisation_id uuid REFERENCES organisations(id) ON DELETE SET NULL,
  updated_by text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (origin_country_code, destination_country_code, topic_slug)
);

CREATE INDEX IF NOT EXISTS idx_guidance_pair ON country_access_guidance(
  origin_country_code,
  destination_country_code,
  is_active
);

-- ── Seed RO → IT guidance templates (editable by admins) ───────────────────
INSERT INTO country_access_guidance (
  origin_country_code,
  destination_country_code,
  topic_slug,
  title_key,
  content_template,
  sort_order
) VALUES
  (
    'RO',
    'IT',
    'insurance_entitlement',
    'operations.guidanceInsuranceTitle',
    E'## Health insurance continuity (RO → IT)\n\n**Minimum check:** Confirm whether the beneficiary holds a valid European Health Insurance Card (EHIC) or has S1/S2 portable entitlement.\n\n1. Ask if they are registered with CNAS (Romania) or have voluntary insurance.\n2. In Italy, contact the local ASL (Azienda Sanitaria Locale) for registration.\n3. EHIC covers necessary care during temporary stays; long-term residence may require S1.\n\n**Do not share:** full insurance numbers until consent is recorded.\n\n**Next step for destination team:** Verify ASL registration path and required documents.',
    1
  ),
  (
    'RO',
    'IT',
    'gp_registration',
    'operations.guidanceGpTitle',
    E'## GP / primary care registration (RO → IT)\n\n**Minimum check:** Beneficiary needs a medico di medicina generale (MMG) in Italy.\n\n1. Confirm municipality of residence in Italy.\n2. Required documents typically: identity document, tax code (codice fiscale), residence proof.\n3. Registration is via the chosen MMG or through the ASL.\n\n**Navigation note:** This platform does not book appointments — mediators facilitate access only.\n\n**Destination team action:** Identify nearest ASL office and MMG accepting new patients.',
    2
  ),
  (
    'RO',
    'IT',
    'emergency_access',
    'operations.guidanceEmergencyTitle',
    E'## Emergency access (RO → IT)\n\n**Immediate:** In Italy call **118** for medical emergencies; **112** for general emergencies.\n\n**Minimum info to share after consent:**\n- Preferred language\n- Known access barriers (insurance, documents)\n- Whether beneficiary is a temporary visitor or resident\n\n**Never share** detailed medical history without explicit consent.',
    3
  ),
  (
    'RO',
    'IT',
    'documents',
    'operations.guidanceDocumentsTitle',
    E'## Documents checklist (RO → IT)\n\nCommon documents for health access:\n- Valid identity document\n- Codice fiscale (Italian tax code)\n- Proof of residence or domicilio\n- EHIC or S1 form (if applicable)\n- Any referral letters (navigation summary only — not full clinical records)\n\n**Template placeholders:** {{origin_country}}, {{destination_country}}, {{preferred_language}}',
    4
  ),
  (
    'RO',
    'IT',
    'language_support',
    'operations.guidanceLanguageTitle',
    E'## Language and interpretation (RO → IT)\n\n**Minimum necessary:** Record preferred language (Romanian, Romani, Italian, etc.).\n\n1. Check if destination provider offers interpreter services.\n2. Community mediators may accompany — confirm consent before sharing contact details.\n3. ASL and some NGOs provide free interpretation for entitlement registration.\n\n**Editable section:** Add local interpreter contacts for your organisation below.',
    5
  ),
  (
    'RO',
    'IT',
    'cross_border_handover',
    'operations.guidanceHandoverTitle',
    E'## Cross-border handover protocol (RO → IT)\n\n**Origin team:**\n1. Obtain beneficiary consent for minimum necessary data sharing.\n2. Share only navigation summary (category, barriers, next action) — not clinical records.\n3. Request handover when destination support is needed.\n\n**Destination team:**\n1. Accept or reject with reason.\n2. Use guidance templates to plan access steps.\n3. Mark handover complete when navigation continuity is established.\n\n**Consent boundary:** No beneficiary identifiers or contact details until consent is granted.',
    6
  )
ON CONFLICT (origin_country_code, destination_country_code, topic_slug) DO NOTHING;
