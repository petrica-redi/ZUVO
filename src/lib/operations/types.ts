import type {
  BarrierSlug,
  CaseSource,
  CaseStatus,
  CaseUrgency,
  CategorySlug,
  ConsentStatus,
  IntakeHelpType,
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
  status: "new" | "routed" | "assigned" | "converted" | "closed";
  notes: string;
  createdAt: string;
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
