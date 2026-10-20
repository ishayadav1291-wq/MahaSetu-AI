export type Role = 'citizen' | 'business' | 'officer' | 'admin';
export type Department = 'industries' | 'mpcb' | 'fire' | 'labour';

export type DerivedStatus = 'approved' | 'action_needed' | 'partly_approved' | 'delayed' | 'in_progress' | 'draft';
export type TaskState = 'submitted' | 'received' | 'in_review' | 'approved' | 'rejected' | 'more_info' | 'dead_letter';

export interface UserSession {
  id: string;
  name: string;
  email: string;
  role: Role;
  department?: Department;
  language: 'en' | 'mr';
  mobile?: string;
  enterprise?: string;
  district?: string;
  sector?: string;
  scale?: string;
  udyam_or_pan?: string;
}

export type SectorId =
  | 'manufacturing_engineering'
  | 'automobile_ev'
  | 'chemicals_petrochemicals'
  | 'pharmaceuticals_biotech'
  | 'it_ites_datacenter'
  | 'food_agro_processing'
  | 'textiles_apparel'
  | 'renewable_energy_solar'
  | 'warehousing_logistics'
  | 'healthcare_hospitality';

export interface SectorDefinition {
  id: SectorId;
  name_en: string;
  name_mr: string;
  category: string;
  category_mr: string;
  icon: string;
  pollution_category: 'Red' | 'Orange' | 'Green' | 'White';
  pollution_description_en: string;
  pollution_description_mr: string;
  typical_worker_range: string;
  typical_investment_range: string;
  sample_unit_name: string;
  sample_address: string;
}

export interface DepartmentDocumentRequirement {
  doc_id: string;
  department: Department;
  dept_name_en: string;
  dept_name_mr: string;
  doc_name_en: string;
  doc_name_mr: string;
  category: string;
  description_en: string;
  description_mr: string;
  legal_basis: string;
  is_mandatory: boolean;
  sample_file_name: string;
  mime_type: string;
  sector_ids: SectorId[] | 'all';
}

export interface ApprovalRule {
  rule_id: string;
  department: Department;
  department_name_en: string;
  department_name_mr: string;
  approval_name_en: string;
  approval_name_mr: string;
  legal_act_en: string;
  legal_act_mr: string;
  reason_en: string;
  reason_mr: string;
  business_sectors?: string[];
  required_documents: {
    type: string;
    name_en: string;
    name_mr: string;
    required: boolean;
    description_en?: string;
    description_mr?: string;
  }[];
  sla_minutes: number;
}

export interface DeptTask {
  id: string;
  tracking_id: string;
  dept: Department;
  dept_ref_id: string;
  state: TaskState;
  submission_version: number;
  idempotency_key: string;
  sla_due: string;
  sla_start: string;
  sla_duration_seconds: number;
  warned: boolean;
  breached: boolean;
  escalation_level: number;
  decision_reason?: string;
  requested_info?: string;
  created_at: string;
  updated_at: string;
  remaining_seconds?: number;
  risk_label?: 'Nominal' | 'At Risk (80%)' | 'Breached';
}

export interface Application {
  tracking_id: string;
  user_id: string;
  service_type: string;
  project: {
    factory_name: string;
    district: string;
    taluka?: string;
    size: 'Micro' | 'Small' | 'Medium';
    business_sector?: SectorId | string;
    sector: string;
    sectors?: string[];
    sector_name_en?: string;
    sector_name_mr?: string;
    pollution_category?: 'Red' | 'Orange' | 'Green' | 'White';
    worker_count: number;
    investment_inr_lakhs: number;
    plot_address: string;
    power_kw: number;
    documents_submitted?: Array<{
      doc_id: string;
      doc_name: string;
      department: Department;
      file_name: string;
      verified: boolean;
    }>;
  };
  created_at: string;
  updated_at: string;
  derived_status?: DerivedStatus;
  tasks?: DeptTask[];
}

export interface ConsentRecord {
  id: string;
  user_id: string;
  dept: Department;
  purpose: string;
  granted_at: string;
  expires_at: string;
  revoked_at: string | null;
}

export interface DeadLetterItem {
  id: string;
  outbox_id: string;
  tracking_id: string;
  dept: Department;
  payload: any;
  error: string;
  attempts: number;
  created_at: string;
  retried_at?: string;
}

export interface AuditRow {
  id: number;
  actor: string;
  action: string;
  entity: string;
  tracking_id?: string;
  timestamp: string;
  details: any;
  prev_hash: string;
  hash: string;
}

export interface ApiHealthRecord {
  id: string;
  connector: Department;
  format: 'nested_json' | 'flat_json' | 'xml' | 'csv';
  status: 'ok' | 'degraded' | 'error';
  latency_ms: number;
  success_rate: number;
  last_error?: string;
  checked_at: string;
}

export interface Grievance {
  id: string;
  tracking_id: string;
  task_id?: string;
  dept?: string;
  reason: string;
  escalation_level: number;
  created_at: string;
  resolved_at: string | null;
}
