import type {
  BarrierSlug,
  CaseSource,
  CaseStatus,
  CaseUrgency,
  CategorySlug,
  ConsentStatus,
  EscalationStatus,
  IntakeHelpType,
  IntakeStatus,
  NotificationType,
  TaskStatus,
  TaskType,
} from "./constants";

export type NavigationCase = {
  id: string;
  caseNumber: string;
  beneficiaryPseudonym: string;
  responsibleMediatorId?: string;
  countryCode: string;
  municipalityCode?: string;
  preferredLanguage: string;
  contactMethod?: string;
  consentStatus: ConsentStatus;
  source: CaseSource;
  categorySlug: CategorySlug;
  mainProblem: string;
  urgency: CaseUrgency;
  status: CaseStatus;
  nextAction?: string;
  targetDate?: string;
  notes: string;
  barriers: BarrierSlug[];
  barrierNotes?: string;
  openedAt: string;
  updatedAt: string;
  closedAt?: string;
};

export type OperationTask = {
  id: string;
  caseId?: string;
  title: string;
  description: string;
  taskType: TaskType;
  status: TaskStatus;
  priority: CaseUrgency;
  assignee?: string;
  createdBy?: string;
  dueDate?: string;
  reminderDate?: string;
  completionEvidence?: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
};

export type IntakeRequest = {
  id: string;
  referenceCode: string;
  preferredLanguage: string;
  contactMethod: string;
  contactValue?: string;
  countryCode: string;
  municipalityCode?: string;
  helpType: IntakeHelpType;
  consentGranted: boolean;
  status: IntakeStatus;
  routedTeamId?: string;
  routedTeamName?: string;
  notes: string;
  createdAt: string;
};

export type RoutingRule = {
  id: string;
  countryCode: string;
  municipalityCode?: string;
  preferredLanguage?: string;
  helpType?: IntakeHelpType;
  teamId: string;
  teamName?: string;
  notifyWorkspaceId?: string;
  priority: number;
  isActive: boolean;
};

export type NotificationPreferences = {
  workspaceId: string;
  emailEnabled: boolean;
  inAppEnabled: boolean;
  notifyEmail?: string;
  preferredLocale: string;
  intakeAlerts: boolean;
  escalationAlerts: boolean;
  missedAppointmentAlerts: boolean;
};

export type OperationNotification = {
  id: string;
  workspaceId: string;
  notificationType: NotificationType;
  title: string;
  body: string;
  data: Record<string, unknown>;
  isRead: boolean;
  emailSent: boolean;
  createdAt: string;
};

export type EscalationRecord = {
  id: string;
  caseId?: string;
  intakeId?: string;
  workspaceId: string;
  escalatedBy: string;
  assignedSupervisor?: string;
  reason: string;
  status: EscalationStatus;
  priority: CaseUrgency;
  resolutionNotes?: string;
  resolvedAt?: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateCaseInput = {
  beneficiaryPseudonym: string;
  countryCode?: string;
  municipalityCode?: string;
  preferredLanguage?: string;
  contactMethod?: string;
  consentStatus?: ConsentStatus;
  source?: CaseSource;
  categorySlug: CategorySlug;
  mainProblem: string;
  urgency?: CaseUrgency;
  status?: CaseStatus;
  nextAction?: string;
  targetDate?: string;
  notes?: string;
  barriers?: BarrierSlug[];
  barrierNotes?: string;
};

export type CreateTaskInput = {
  caseId?: string;
  title: string;
  description?: string;
  taskType?: TaskType;
  priority?: CaseUrgency;
  assignee?: string;
  dueDate?: string;
  reminderDate?: string;
};

export type CreateIntakeInput = {
  preferredLanguage?: string;
  contactMethod: string;
  contactValue?: string;
  countryCode?: string;
  municipalityCode?: string;
  helpType: IntakeHelpType;
  consentGranted: boolean;
  notes?: string;
};

export type CreateEscalationInput = {
  caseId?: string;
  intakeId?: string;
  reason: string;
  priority?: CaseUrgency;
  assignedSupervisor?: string;
};

export type MissedAppointmentInput = {
  caseId?: string;
  intakeId?: string;
  beneficiaryPseudonym?: string;
  notes?: string;
};

export type CaseOutcome = {
  id: string;
  caseId: string;
  workspaceId: string;
  outcomeType: import("./constants").OutcomeType;
  status: import("./constants").OutcomeStatus;
  achievedAt?: string;
  notes: string;
  evidenceRef?: string;
  recordedBy?: string;
  createdAt: string;
  updatedAt: string;
};

export type QualityFlag = {
  id: string;
  caseId?: string;
  workspaceId: string;
  flagType: import("./constants").QualityFlagType;
  severity: import("./constants").QualitySeverity;
  status: import("./constants").QualityFlagStatus;
  message: string;
  raisedBy?: string;
  resolvedBy?: string;
  resolvedAt?: string;
  createdAt: string;
  updatedAt: string;
};

export type RecordOutcomeInput = {
  caseId: string;
  outcomeType: import("./constants").OutcomeType;
  status: import("./constants").OutcomeStatus;
  achievedAt?: string;
  notes?: string;
  evidenceRef?: string;
};

export type RaiseQualityFlagInput = {
  caseId?: string;
  flagType: import("./constants").QualityFlagType;
  severity?: import("./constants").QualitySeverity;
  message?: string;
};

export type ProgrammeIndicatorValue = {
  slug: string;
  labelKey: string;
  count: number | null;
  suppressed: boolean;
};

export type OutcomeAggregateRow = {
  outcomeType: string;
  achieved: number;
  pending: number;
  notAchieved: number;
};

export type OperationalProvider = {
  id: string;
  name: string;
  type: string;
  address: string;
  phone?: string;
  website?: string;
  region?: string;
  countryCode?: string;
  municipalityCode?: string;
  verificationState: string;
  categorySlugs: string[];
  isRomaFriendly: boolean;
  isFreeClinic: boolean;
  hasInterpreter: boolean;
  languages: string[];
  matchScore?: number;
  matchReasons?: string[];
};

export type ProviderSearchParams = {
  categorySlug?: string;
  language?: string;
  municipalityCode?: string;
  countryCode?: string;
  verificationState?: string;
};

export type Referral = {
  id: string;
  referralNumber: string;
  caseId: string;
  providerId: string;
  providerName?: string;
  status: string;
  purpose: string;
  notes: string;
  initiatedBy?: string;
  scheduledFollowUp?: string;
  createdAt: string;
  updatedAt: string;
};

export type Appointment = {
  id: string;
  caseId: string;
  providerId: string;
  providerName?: string;
  referralId?: string;
  status: string;
  appointmentDate: string;
  appointmentTime?: string;
  location?: string;
  accompanimentRequired: boolean;
  interpretationRequired: boolean;
  notes: string;
  createdAt: string;
  updatedAt: string;
};

export type AttendanceRecord = {
  id: string;
  appointmentId: string;
  outcome: string;
  followUpRequired: boolean;
  followUpAction?: string;
  notes: string;
  recordedAt: string;
};

export type CreateReferralInput = {
  caseId: string;
  providerId: string;
  purpose?: string;
  notes?: string;
  scheduledFollowUp?: string;
};

export type CreateAppointmentInput = {
  caseId: string;
  providerId: string;
  referralId?: string;
  appointmentDate: string;
  appointmentTime?: string;
  location?: string;
  accompanimentRequired?: boolean;
  interpretationRequired?: boolean;
  notes?: string;
};

export type RecordAttendanceInput = {
  outcome: string;
  followUpRequired?: boolean;
  followUpAction?: string;
  notes?: string;
};
