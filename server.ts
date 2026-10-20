import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import crypto from 'crypto';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import {
  SECTOR_CATALOG,
  DEPARTMENT_DOCUMENT_REQUIREMENTS,
  getDepartmentDocumentsForSector,
  getSectorDefinition
} from './src/data/sectorsAndDocuments';
import { getSectorApprovalRules } from './src/data/sectorLegalChecklists';

dotenv.config();

const app = express();
const PORT = 3000;
const isProduction = process.env.NODE_ENV === 'production';

app.use(express.json({ limit: '10mb' }));

// --------------------------------------------------------------------------
// 1. RULES CATALOG & APPROVALS (approvals_rules.json)
// --------------------------------------------------------------------------
export interface ApprovalRule {
  rule_id: string;
  department: 'industries' | 'mpcb' | 'fire' | 'labour';
  department_name_en: string;
  department_name_mr: string;
  approval_name_en: string;
  approval_name_mr: string;
  legal_act_en: string;
  legal_act_mr: string;
  trigger_condition: {
    sectors?: string[];
    min_size?: string;
    requires_power?: boolean;
    min_workers?: number;
  };
  reason_en: string;
  reason_mr: string;
  required_documents: {
    type: string;
    name_en: string;
    name_mr: string;
    required: boolean;
  }[];
  sla_minutes: number;
}

const APPROVALS_RULES: ApprovalRule[] = [
  {
    rule_id: 'RULE-IND-2024-01',
    department: 'industries',
    department_name_en: 'Directorate of Industries (MIDC)',
    department_name_mr: 'उद्योग संचालनालय (एमआयडीसी)',
    approval_name_en: 'Industrial Undertaking Acknowledgement (IUA)',
    approval_name_mr: 'औद्योगिक उपक्रम पोचपावती (IUA)',
    legal_act_en: 'Maharashtra Industrial Development Act & MSMED Act',
    legal_act_mr: 'महाराष्ट्र औद्योगिक विकास कायदा आणि एमएसएमईडी कायदा',
    trigger_condition: {},
    reason_en: 'Mandatory registration for all manufacturing setups operating in Maharashtra districts.',
    reason_mr: 'महाराष्ट्रातील सर्व उत्पादन प्रकल्पांसाठी उद्योग नोंदणी अनिवार्य आहे.',
    required_documents: [
      { type: 'id_proof', name_en: 'Applicant ID Proof (Aadhaar / PAN)', name_mr: 'अर्जदाराचा ओळख पुरावा (आधार / पॅन)', required: true },
      { type: 'address_proof', name_en: 'Industrial Plot Proof / Electricity Bill', name_mr: 'औद्योगिक भूखंड पुरावा / वीज बिल', required: true },
      { type: 'project_report', name_en: 'Project Summary & Plant Layout', name_mr: 'प्रकल्प सारांश आणि कारखाना आराखडा', required: true }
    ],
    sla_minutes: 5
  },
  {
    rule_id: 'RULE-MPCB-RED-04',
    department: 'mpcb',
    department_name_en: 'Maharashtra Pollution Control Board (MPCB)',
    department_name_mr: 'महाराष्ट्र प्रदूषण नियंत्रण मंडळ (MPCB)',
    approval_name_en: 'Consent to Establish (CTE)',
    approval_name_mr: 'स्थापना संमती प्रमाणपत्र (CTE)',
    legal_act_en: 'Water (Prevention and Control of Pollution) Act 1974 & Air Act 1981',
    legal_act_mr: 'जल आणि वायू प्रदूषण नियंत्रण कायदा',
    trigger_condition: {
      sectors: [
        'Engineering',
        'Chemical',
        'Textile',
        'Food Processing',
        'Pharmaceuticals',
        'Automobile',
        'Plastics & Polymers',
        'Electronics & Semiconductors',
        'Renewable Energy'
      ]
    },
    reason_en: 'Mandatory environmental clearance for industrial manufacturing processes with effluent or stack emissions under Water & Air Acts.',
    reason_mr: 'उत्सर्जन किंवा सांडपाणी निर्मितीची शक्यता असलेल्या सर्व प्रक्रिया उद्योगांसाठी पर्यावरण मंजुरी आवश्यक.',
    required_documents: [
      { type: 'effluent_treatment_plan', name_en: 'Effluent Treatment & Emission Plan', name_mr: 'सांडपाणी प्रक्रिया व वायू प्रदूषण नियंत्रण आराखडा', required: true },
      { type: 'factory_plan', name_en: 'Machinery Layout & Water Balance', name_mr: 'यंत्रसामग्री आराखडा आणि पाणी वापर विवरण', required: true }
    ],
    sla_minutes: 7
  },
  {
    rule_id: 'RULE-FIRE-NOC-02',
    department: 'fire',
    department_name_en: 'Maharashtra Fire & Emergency Services',
    department_name_mr: 'महाराष्ट्र अग्निशमन व आणीबाणी सेवा',
    approval_name_en: 'Provisional Fire Safety NOC',
    approval_name_mr: 'तात्पुरते अग्निशमन ना-हरकत प्रमाणपत्र (NOC)',
    legal_act_en: 'Maharashtra Fire Prevention and Life Safety Measures Act 2006',
    legal_act_mr: 'महाराष्ट्र आग प्रतिबंधक आणि जीवन सुरक्षा उपाययोजना कायदा २००६',
    trigger_condition: {},
    reason_en: 'Mandatory life and fire safety verification for industrial premises and warehouses.',
    reason_mr: 'औद्योगिक कारखाने व गोदामांसाठी अग्नि सुरक्षा यंत्रणा पडताळणी अनिवार्य.',
    required_documents: [
      { type: 'fire_safety_plan', name_en: 'Fire Sprinkler & Hydrant Line Drawing', name_mr: 'अग्निशमन स्प्रिंकलर व हायड्रंट नकाशा', required: true },
      { type: 'building_layout', name_en: 'Approved Factory Building Architectural Blueprint', name_mr: 'मंजूर इमारत बांधकाम व आणीबाणी मार्ग नकाशा', required: true }
    ],
    sla_minutes: 6
  },
  {
    rule_id: 'RULE-LAB-FACT-01',
    department: 'labour',
    department_name_en: 'Department of Labour (Directorate of Industrial Safety)',
    department_name_mr: 'कामगार विभाग (औद्योगिक सुरक्षा संचालनालय)',
    approval_name_en: 'Factory License & Worker Welfare Registration',
    approval_name_mr: 'कारखाना परवाना आणि कामगार कल्याण नोंदणी',
    legal_act_en: 'Factories Act 1948 & Maharashtra Factories Rules',
    legal_act_mr: 'कारखाने कायदा १९४८ आणि महाराष्ट्र कारखाने नियम',
    trigger_condition: {
      min_workers: 10,
      requires_power: true
    },
    reason_en: 'Applies to industrial manufacturing premises employing 10 or more workers using electric power.',
    reason_mr: 'विजेचा वापर करून १० किंवा त्याहून अधिक कामगार काम करत असलेल्या कारखान्यांसाठी परवाना आवश्यक.',
    required_documents: [
      { type: 'worker_welfare_plan', name_en: 'Occupational Safety & First-Aid Plan', name_mr: 'व्यावसायिक सुरक्षा व प्रथमोपचार योजना', required: true }
    ],
    sla_minutes: 8
  },
  {
    rule_id: 'RULE-FDA-PHARMA-03',
    department: 'industries',
    department_name_en: 'Food & Drug Administration (FDA Maharashtra Desk)',
    department_name_mr: 'अन्न व औषध प्रशासन (एफडीए महाराष्ट्र डेस्क)',
    approval_name_en: 'Good Manufacturing Practice (GMP) Drug Premises Clearance',
    approval_name_mr: 'चांगल्या उत्पादन पद्धती (GMP) औषध कारखाना मंजुरी',
    legal_act_en: 'Drugs and Cosmetics Act 1940 & Rules 1945',
    legal_act_mr: 'औषधे आणि सौंदर्यप्रसाधने कायदा १९४०',
    trigger_condition: {
      sectors: ['Pharmaceuticals']
    },
    reason_en: 'Specific regulatory clearance for pharmaceutical formulation and active pharmaceutical ingredient (API) manufacturing plants.',
    reason_mr: 'औषध निर्माण आणि अ‍ॅक्टिव्ह फार्मास्युटिकल घटक (API) उत्पादन प्रकल्पांसाठी विशेष तांत्रिक मंजुरी.',
    required_documents: [
      { type: 'gmp_layout', name_en: 'Clean Room & Air Handling Unit (AHU) Layout', name_mr: 'क्लीन रूम व एअर हँडलिंग युनिट (AHU) आराखडा', required: true }
    ],
    sla_minutes: 6
  },
  {
    rule_id: 'RULE-FSSAI-AGRO-05',
    department: 'industries',
    department_name_en: 'Agro & Food Processing Desk',
    department_name_mr: 'कृषी व अन्न प्रक्रिया विशेष डेस्क',
    approval_name_en: 'Food Safety & Cold-Chain Processing Endorsement',
    approval_name_mr: 'अन्न सुरक्षा व शीतगृह प्रक्रिया संमती',
    legal_act_en: 'Food Safety and Standards Act 2006 (FSSAI Regulations)',
    legal_act_mr: 'अन्न सुरक्षा आणि मानके कायदा २००६',
    trigger_condition: {
      sectors: ['Food Processing', 'Warehousing & Logistics']
    },
    reason_en: 'Required for commercial food processing, cold-chain preservation, and packaged food manufacturing.',
    reason_mr: 'व्यावसायिक अन्न प्रक्रिया, पॅकेजिंग आणि शीतगृह साखळी प्रकल्पांसाठी अन्न सुरक्षा संमती आवश्यक.',
    required_documents: [
      { type: 'hazard_analysis', name_en: 'HACCP Food Safety Plan & Water Potability Test', name_mr: 'एचएसीसीपी अन्न सुरक्षा योजना आणि पाणी तपासणी अहवाल', required: true }
    ],
    sla_minutes: 5
  }
];

// --------------------------------------------------------------------------
// 2. IN-MEMORY DATABASE WITH RELIABILITY DATA STRUCTURES
// --------------------------------------------------------------------------
interface User {
  id: string;
  name: string;
  email: string;
  role: 'citizen' | 'business' | 'officer' | 'admin';
  department?: 'industries' | 'mpcb' | 'fire' | 'labour';
  language: 'en' | 'mr';
  mobile?: string;
  enterprise?: string;
  district?: string;
  sector?: string;
  scale?: string;
  udyam_or_pan?: string;
}

interface Application {
  tracking_id: string;
  user_id: string;
  service_type: string;
  project: {
    factory_name: string;
    district: string;
    taluka?: string;
    size: 'Micro' | 'Small' | 'Medium';
    business_sector?: string;
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
      department: string;
      file_name: string;
      verified: boolean;
    }>;
  };
  created_at: string;
  updated_at: string;
}

export type TaskState = 'submitted' | 'received' | 'in_review' | 'approved' | 'rejected' | 'more_info' | 'dead_letter';

interface DeptTask {
  id: string;
  tracking_id: string;
  dept: 'industries' | 'mpcb' | 'fire' | 'labour';
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
}

interface OutboxItem {
  id: string;
  task_id: string;
  tracking_id: string;
  dept: 'industries' | 'mpcb' | 'fire' | 'labour';
  idem_key: string;
  payload: any;
  state: 'pending' | 'processing' | 'delivered' | 'failed' | 'dead_letter';
  attempts: number;
  max_attempts: number;
  next_attempt_at: number;
  last_error?: string;
  created_at: string;
}

interface DeadLetterItem {
  id: string;
  outbox_id: string;
  tracking_id: string;
  dept: 'industries' | 'mpcb' | 'fire' | 'labour';
  payload: any;
  error: string;
  attempts: number;
  created_at: string;
  retried_at?: string;
}

interface ConsentRecord {
  id: string;
  user_id: string;
  dept: 'industries' | 'mpcb' | 'fire' | 'labour';
  purpose: string;
  granted_at: string;
  expires_at: string;
  revoked_at: string | null;
}

interface Grievance {
  id: string;
  tracking_id: string;
  task_id?: string;
  dept?: string;
  reason: string;
  escalation_level: number;
  created_at: string;
  resolved_at: string | null;
}

interface AuditRow {
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

interface ApiHealthRecord {
  id: string;
  connector: 'industries' | 'mpcb' | 'fire' | 'labour';
  format: 'nested_json' | 'flat_json' | 'xml' | 'csv';
  status: 'ok' | 'degraded' | 'error';
  latency_ms: number;
  success_rate: number;
  last_error?: string;
  checked_at: string;
}

// Global in-memory DB collections
const db = {
  users: new Map<string, User>(),
  applications: new Map<string, Application>(),
  tasks: new Map<string, DeptTask>(),
  outbox: new Map<string, OutboxItem>(),
  dead_letter: new Map<string, DeadLetterItem>(),
  consents: new Map<string, ConsentRecord>(),
  grievances: new Map<string, Grievance>(),
  audit_log: [] as AuditRow[],
  api_health: new Map<string, ApiHealthRecord>(),
  demoSettings: {
    failNextDept: null as 'industries' | 'mpcb' | 'fire' | 'labour' | null,
    shortenSlaToSeconds: null as number | null,
  }
};

// --------------------------------------------------------------------------
// 3. CRYPTOGRAPHIC HASH CHAIN FOR AUDIT LOG
// --------------------------------------------------------------------------
const GENESIS_HASH = '0000000000000000000000000000000000000000000000000000000000000000';
let auditSequence = 1;

function writeAuditRow(actor: string, action: string, entity: string, details: any, tracking_id?: string): AuditRow {
  const prev_hash = db.audit_log.length > 0 ? db.audit_log[db.audit_log.length - 1].hash : GENESIS_HASH;
  const timestamp = new Date().toISOString();
  
  const contentToHash = `${prev_hash}|${actor}|${action}|${entity}|${tracking_id || ''}|${timestamp}|${JSON.stringify(details)}`;
  const hash = crypto.createHash('sha256').update(contentToHash).digest('hex');

  const row: AuditRow = {
    id: auditSequence++,
    actor,
    action,
    entity,
    tracking_id,
    timestamp,
    details,
    prev_hash,
    hash
  };

  db.audit_log.push(row);
  return row;
}

function verifyAuditChain(): { ok: boolean; count: number; broken_index?: number; reason?: string } {
  let prev = GENESIS_HASH;
  for (let i = 0; i < db.audit_log.length; i++) {
    const row = db.audit_log[i];
    if (row.prev_hash !== prev) {
      return { ok: false, count: db.audit_log.length, broken_index: i, reason: `Chain broken at entry #${row.id}: prev_hash mismatch` };
    }
    const content = `${row.prev_hash}|${row.actor}|${row.action}|${row.entity}|${row.tracking_id || ''}|${row.timestamp}|${JSON.stringify(row.details)}`;
    const expected = crypto.createHash('sha256').update(content).digest('hex');
    if (expected !== row.hash) {
      return { ok: false, count: db.audit_log.length, broken_index: i, reason: `Tampered hash at entry #${row.id}` };
    }
    prev = row.hash;
  }
  return { ok: true, count: db.audit_log.length };
}

// --------------------------------------------------------------------------
// 4. DERIVED STATUS FUNCTION (Pure functional, never stored)
// --------------------------------------------------------------------------
export type DerivedStatus = 'approved' | 'action_needed' | 'partly_approved' | 'delayed' | 'in_progress' | 'draft';

export function deriveApplicationStatus(tasks: DeptTask[]): DerivedStatus {
  if (!tasks || tasks.length === 0) return 'draft';

  const anyRejectedOrMoreInfo = tasks.some(t => t.state === 'rejected' || t.state === 'more_info');
  if (anyRejectedOrMoreInfo) return 'action_needed';

  const anyDeadLetter = tasks.some(t => t.state === 'dead_letter');
  if (anyDeadLetter) return 'delayed';

  const allApproved = tasks.every(t => t.state === 'approved');
  if (allApproved) return 'approved';

  const anyApproved = tasks.some(t => t.state === 'approved');
  if (anyApproved) return 'partly_approved';

  return 'in_progress';
}

// --------------------------------------------------------------------------
// 5. MOCK DEPARTMENT CONNECTORS
// --------------------------------------------------------------------------
// Each connector adapts the canonical payload to the department's native schema.
const mockConnectors = {
  // 1. Industries: Nested JSON format
  industries: {
    format: 'nested_json' as const,
    encode: (app: Application) => ({
      applicant_profile: {
        id: app.user_id,
        tracking_ref: app.tracking_id
      },
      manufacturing_unit: {
        unit_name: app.project.factory_name,
        district: app.project.district,
        plot: app.project.plot_address,
        enterprise_scale: app.project.size
      },
      capital_investment: {
        total_inr_lakhs: app.project.investment_inr_lakhs,
        power_sanction_kw: app.project.power_kw
      }
    }),
    send: async (payload: any, idempotencyKey: string) => {
      // Simulate network latency (80ms)
      await new Promise(r => setTimeout(r, 80));
      return {
        department_reference: `IND-MIDC-${Date.now().toString().slice(-6)}`,
        status: 'ACCEPTED',
        received_timestamp: new Date().toISOString()
      };
    }
  },

  // 2. Pollution Control: Flat JSON format
  mpcb: {
    format: 'flat_json' as const,
    encode: (app: Application) => ({
      app_tracking_id: app.tracking_id,
      industry_name: app.project.factory_name,
      location_district: app.project.district,
      sector_category: app.project.sector,
      pollution_index_category: 'ORANGE_CATEGORY',
      water_discharge_kld: 15.5,
      chimney_stack_count: 2
    }),
    send: async (payload: any, idempotencyKey: string) => {
      await new Promise(r => setTimeout(r, 110));
      return {
        department_reference: `MPCB-CTE-${Date.now().toString().slice(-6)}`,
        status: 'RECEIVED',
        ack_code: 'MPCB-ACK-9921'
      };
    }
  },

  // 3. Fire & Emergency: XML format
  fire: {
    format: 'xml' as const,
    encode: (app: Application) => {
      return `<?xml version="1.0" encoding="UTF-8"?>
<FireNOCApplication xmlns="http://mahafire.gov.in/noc/v2">
  <TrackingId>${app.tracking_id}</TrackingId>
  <FacilityName>${escapeXml(app.project.factory_name)}</FacilityName>
  <District>${escapeXml(app.project.district)}</District>
  <PlotAddress>${escapeXml(app.project.plot_address)}</PlotAddress>
  <HazardCategory>MODERATE_INDUSTRIAL</HazardCategory>
  <Timestamp>${new Date().toISOString()}</Timestamp>
</FireNOCApplication>`;
    },
    send: async (payload: string, idempotencyKey: string) => {
      await new Promise(r => setTimeout(r, 95));
      return {
        department_reference: `MFES-NOC-${Date.now().toString().slice(-6)}`,
        status: 'QUEUED',
        dispatch_channel: 'XML_GATEWAY'
      };
    }
  },

  // 4. Labour: CSV format drop
  labour: {
    format: 'csv' as const,
    encode: (app: Application) => {
      return `tracking_id,factory_name,district,workers_count,power_kw,submission_date\n"${app.tracking_id}","${app.project.factory_name}","${app.project.district}",${app.project.worker_count},${app.project.power_kw},"${new Date().toISOString()}"`;
    },
    send: async (payload: string, idempotencyKey: string) => {
      await new Promise(r => setTimeout(r, 70));
      return {
        department_reference: `LAB-REG-${Date.now().toString().slice(-6)}`,
        status: 'BATCH_INGESTED',
        batch_id: `CSV-BATCH-${Date.now().toString().slice(-4)}`
      };
    }
  }
};

function escapeXml(unsafe: string) {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });
}

// --------------------------------------------------------------------------
// 6. TRANSACTIONAL OUTBOX WORKER & DEAD-LETTER QUEUE
// --------------------------------------------------------------------------
let isWorkerRunning = false;

async function processOutbox() {
  if (isWorkerRunning) return;
  isWorkerRunning = true;

  try {
    const now = Date.now();
    const pendingItems = Array.from(db.outbox.values()).filter(
      item => (item.state === 'pending' || item.state === 'failed') && item.next_attempt_at <= now
    );

    for (const item of pendingItems) {
      item.state = 'processing';
      const task = db.tasks.get(item.task_id);
      if (!task) {
        item.state = 'failed';
        continue;
      }

      // Check Consent validity before dispatch
      const activeConsent = Array.from(db.consents.values()).find(
        c => c.dept === item.dept && c.revoked_at === null && new Date(c.expires_at) > new Date()
      );
      if (!activeConsent) {
        item.state = 'failed';
        item.last_error = 'Consent missing, revoked, or expired at send time';
        writeAuditRow('OUTBOX_WORKER', 'SEND_BLOCKED_NO_CONSENT', 'dept_tasks', { task_id: task.id, dept: item.dept }, item.tracking_id);
        continue;
      }

      // Check Demo Mode forced failure switch
      if (db.demoSettings.failNextDept === item.dept) {
        db.demoSettings.failNextDept = null; // consume once
        item.attempts += 1;
        item.last_error = 'Simulated department gateway timeout (503 Service Unavailable)';
        
        writeAuditRow('DEMO_ENGINE', 'FORCED_FAILURE_SIMULATED', 'outbox', { dept: item.dept, attempts: item.attempts }, item.tracking_id);

        if (item.attempts >= item.max_attempts) {
          item.state = 'dead_letter';
          task.state = 'dead_letter';
          task.updated_at = new Date().toISOString();

          // Move to dead letter queue
          const dlqItem: DeadLetterItem = {
            id: `dlq-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
            outbox_id: item.id,
            tracking_id: item.tracking_id,
            dept: item.dept,
            payload: item.payload,
            error: item.last_error || 'Simulated gateway timeout',
            attempts: item.attempts,
            created_at: new Date().toISOString()
          };
          db.dead_letter.set(dlqItem.id, dlqItem);
          writeAuditRow('OUTBOX_WORKER', 'MOVED_TO_DEAD_LETTER', 'dead_letter', { dlq_id: dlqItem.id, dept: item.dept }, item.tracking_id);
        } else {
          item.state = 'failed';
          const backoffSec = Math.pow(2, item.attempts - 1); // 1s, 2s, 4s
          item.next_attempt_at = Date.now() + backoffSec * 1000;
        }
        continue;
      }

      // Normal send
      try {
        const connector = mockConnectors[item.dept];
        const res = await connector.send(item.payload, item.idem_key);

        item.state = 'delivered';
        task.dept_ref_id = res.department_reference;
        task.state = 'received';
        task.updated_at = new Date().toISOString();

        writeAuditRow('OUTBOX_WORKER', 'DEPARTMENT_DELIVERY_CONFIRMED', 'dept_tasks', {
          dept: item.dept,
          dept_ref: res.department_reference,
          idem_key: item.idem_key
        }, item.tracking_id);

        // Shortly simulate officer moving it to in_review
        setTimeout(() => {
          if (task.state === 'received') {
            task.state = 'in_review';
            task.updated_at = new Date().toISOString();
            writeAuditRow('DEPARTMENT_SYSTEM', 'OFFICER_OPENED_FILE', 'dept_tasks', { dept: item.dept, state: 'in_review' }, item.tracking_id);
          }
        }, 1200);

      } catch (err: any) {
        item.attempts += 1;
        item.last_error = err.message || 'Department connection error';
        if (item.attempts >= item.max_attempts) {
          item.state = 'dead_letter';
          task.state = 'dead_letter';
          task.updated_at = new Date().toISOString();
          const dlqItem: DeadLetterItem = {
            id: `dlq-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
            outbox_id: item.id,
            tracking_id: item.tracking_id,
            dept: item.dept,
            payload: item.payload,
            error: item.last_error || 'Department connection error',
            attempts: item.attempts,
            created_at: new Date().toISOString()
          };
          db.dead_letter.set(dlqItem.id, dlqItem);
        } else {
          item.state = 'failed';
          const backoffSec = Math.pow(2, item.attempts - 1);
          item.next_attempt_at = Date.now() + backoffSec * 1000;
        }
      }
    }
  } finally {
    isWorkerRunning = false;
  }
}

// --------------------------------------------------------------------------
// 7. SLA MONITORING & AUTO-GRIEVANCE ENGINE
// --------------------------------------------------------------------------
function checkSlas() {
  const now = new Date();
  
  for (const task of db.tasks.values()) {
    // Only check active tasks that are not yet approved or rejected
    if (['approved', 'rejected', 'more_info'].includes(task.state)) continue;

    const start = new Date(task.sla_start).getTime();
    const due = new Date(task.sla_due).getTime();
    const totalDuration = due - start;
    if (totalDuration <= 0) continue;

    const elapsed = now.getTime() - start;
    const progress = elapsed / totalDuration;

    // 80% SLA Warning Trigger
    if (progress >= 0.8 && !task.warned && !task.breached) {
      task.warned = true;
      writeAuditRow('SLA_ENGINE', 'SLA_WARN_80_PERCENT', 'dept_tasks', {
        task_id: task.id,
        dept: task.dept,
        elapsed_sec: Math.round(elapsed / 1000),
        due_in_sec: Math.max(0, Math.round((due - now.getTime()) / 1000))
      }, task.tracking_id);
    }

    // 100% SLA Breach Trigger -> Create automatic Grievance
    if (now.getTime() >= due && !task.breached) {
      task.breached = true;
      task.escalation_level = 1;

      const grievanceId = `GRV-AUTO-${Date.now().toString().slice(-6)}`;
      const grievance: Grievance = {
        id: grievanceId,
        tracking_id: task.tracking_id,
        task_id: task.id,
        dept: task.dept,
        reason: `Automatic SLA breach: ${task.dept.toUpperCase()} department exceeded committed turnaround time without resolution.`,
        escalation_level: 1,
        created_at: now.toISOString(),
        resolved_at: null
      };
      db.grievances.set(grievance.id, grievance);

      writeAuditRow('SLA_ENGINE', 'SLA_BREACH_AUTO_GRIEVANCE_CREATED', 'grievances', {
        task_id: task.id,
        grievance_id: grievanceId,
        dept: task.dept,
        escalation: 1
      }, task.tracking_id);
    }
  }
}

// Start timers for outbox and SLA check
setInterval(processOutbox, 500);
setInterval(checkSlas, 1000);

// Update connector health status periodically
function refreshApiHealth() {
  const depts: ('industries' | 'mpcb' | 'fire' | 'labour')[] = ['industries', 'mpcb', 'fire', 'labour'];
  const formats = { industries: 'nested_json', mpcb: 'flat_json', fire: 'xml', labour: 'csv' } as const;

  for (const d of depts) {
    const isFailing = db.demoSettings.failNextDept === d;
    db.api_health.set(d, {
      id: `health-${d}`,
      connector: d,
      format: formats[d],
      status: isFailing ? 'degraded' : 'ok',
      latency_ms: isFailing ? 840 : (45 + Math.floor(Math.random() * 35)),
      success_rate: isFailing ? 66.7 : 99.4,
      last_error: isFailing ? 'Simulated 503 Gateway Timeout queued' : undefined,
      checked_at: new Date().toISOString()
    });
  }
}
setInterval(refreshApiHealth, 2500);

// --------------------------------------------------------------------------
// 8. SEED DATABASE
// --------------------------------------------------------------------------
function seedDatabase() {
  // Users
  const seedUsers: User[] = [
    { id: 'usr-ravi', name: 'Ravi Patil', email: 'ravi@example.com', role: 'business', language: 'en' },
    { id: 'usr-off-ind', name: 'Shri A. K. Deshmukh', email: 'officer.ind@maha.gov.in', role: 'officer', department: 'industries', language: 'en' },
    { id: 'usr-off-mpcb', name: 'Dr. Sunita Kulkarni', email: 'officer.mpcb@maha.gov.in', role: 'officer', department: 'mpcb', language: 'mr' },
    { id: 'usr-off-fire', name: 'Chief Fire Officer S. Shinde', email: 'officer.fire@maha.gov.in', role: 'officer', department: 'fire', language: 'en' },
    { id: 'usr-off-lab', name: 'Inspector V. R. Pawar', email: 'officer.labour@maha.gov.in', role: 'officer', department: 'labour', language: 'mr' },
    { id: 'usr-admin', name: 'Nodal Director IT Cell', email: 'admin@mahasetu.gov.in', role: 'admin', language: 'en' },
  ];
  for (const u of seedUsers) db.users.set(u.id, u);

  // Initial audit row
  writeAuditRow('SYSTEM_INIT', 'PLATFORM_BOOTSTRAP', 'system', {
    version: '1.0.0-MVP',
    environment: 'Maharashtra State GovTech Sandbox',
    departments: ['industries', 'mpcb', 'fire', 'labour']
  });

  refreshApiHealth();
}
seedDatabase();

// --------------------------------------------------------------------------
// 9. API ROUTES (/v1/*)
// --------------------------------------------------------------------------

// Standard error helper
function apiError(res: Response, status: number, code: string, en: string, mr: string) {
  return res.status(status).json({
    error: {
      code,
      message_en: en,
      message_mr: mr
    }
  });
}

// Authentication
// Authentication: Login
app.post('/v1/auth/login', (req: Request, res: Response) => {
  const { email, role_override } = req.body;
  const normalizedEmail = (email || '').trim().toLowerCase();
  let user = Array.from(db.users.values()).find(u => u.email.toLowerCase() === normalizedEmail);

  if (!user && role_override) {
    user = Array.from(db.users.values()).find(u => u.role === role_override);
  }

  if (!user) {
    // Default to Ravi if unverified
    user = db.users.get('usr-ravi')!;
  }

  const token = `token-${user.id}-${Date.now()}`;
  writeAuditRow(user.name, 'USER_LOGIN', 'users', { user_id: user.id, role: user.role, dept: user.department });

  res.json({
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
      language: user.language,
      mobile: user.mobile,
      enterprise: user.enterprise,
      district: user.district,
      sector: user.sector,
      scale: user.scale,
      udyam_or_pan: user.udyam_or_pan
    }
  });
});

// Authentication: New User Registration (Applicant / Enterprise)
app.post('/v1/auth/register', (req: Request, res: Response) => {
  const {
    name,
    email,
    mobile,
    enterprise,
    district,
    sector,
    scale,
    udyam_or_pan,
    language = 'en'
  } = req.body;

  if (!name || !name.trim()) {
    return res.status(400).json({ error: 'Full name is required.' });
  }

  if (!email || !email.trim()) {
    return res.status(400).json({ error: 'Valid email address is required.' });
  }

  const normalizedEmail = email.trim().toLowerCase();

  // Check if an account already exists with this email
  const existingUser = Array.from(db.users.values()).find(
    u => u.email.toLowerCase() === normalizedEmail
  );

  if (existingUser) {
    return res.status(409).json({
      error: 'An account with this email address already exists. Please sign in instead.',
      existing_user_id: existingUser.id
    });
  }

  // Generate unique user identifier
  const newUserId = `usr-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;

  const newUser: User = {
    id: newUserId,
    name: name.trim(),
    email: normalizedEmail,
    role: 'business',
    language: language === 'mr' ? 'mr' : 'en',
    mobile: mobile?.trim() || undefined,
    enterprise: enterprise?.trim() || undefined,
    district: district?.trim() || undefined,
    sector: sector?.trim() || undefined,
    scale: scale || 'Small',
    udyam_or_pan: udyam_or_pan?.trim() || undefined
  };

  db.users.set(newUserId, newUser);

  // Cryptographic audit row for registration
  writeAuditRow(newUser.name, 'USER_REGISTERED', 'users', {
    user_id: newUser.id,
    email: newUser.email,
    enterprise: newUser.enterprise,
    district: newUser.district,
    sector: newUser.sector,
    scale: newUser.scale,
    udyam_or_pan: newUser.udyam_or_pan ? 'PROVIDED_HASHED' : 'NONE'
  });

  const token = `token-${newUser.id}-${Date.now()}`;

  res.status(201).json({
    token,
    user: {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      department: newUser.department,
      language: newUser.language,
      mobile: newUser.mobile,
      enterprise: newUser.enterprise,
      district: newUser.district,
      sector: newUser.sector,
      scale: newUser.scale,
      udyam_or_pan: newUser.udyam_or_pan
    }
  });
});

// --------------------------------------------------------------------------
// Sector Catalog & Dynamic Department Document Checklist
// --------------------------------------------------------------------------
app.get('/v1/approvals/sectors', (req: Request, res: Response) => {
  res.json({
    sectors: SECTOR_CATALOG,
    total: SECTOR_CATALOG.length
  });
});

app.get('/v1/approvals/documents', (req: Request, res: Response) => {
  const sector = (req.query.sector as string) || (req.query.business_sector as string) || 'manufacturing_engineering';
  const sectorDef = getSectorDefinition(sector);
  const docsByDept = getDepartmentDocumentsForSector(sectorDef.id);
  const totalDocs = Object.values(docsByDept).reduce((sum, list) => sum + list.length, 0);

  res.json({
    sector: sectorDef,
    department_documents: docsByDept,
    total_documents: totalDocs
  });
});

// Approvals Checklist based on rules & dynamic department documents
app.post('/v1/assistant/checklist', (req: Request, res: Response) => {
  const { sector, sectors, business_sector, size, worker_count, requires_power } = req.body;
  const targetSectorId = business_sector || (typeof sector === 'string' && sector.includes('_') ? sector : null);
  const sectorDef = getSectorDefinition(targetSectorId || sector || 'manufacturing_engineering');

  // Load dynamically tailored legal approvals for this specific sector
  const matchedRules = getSectorApprovalRules(sectorDef.id);
  const departmentDocs = getDepartmentDocumentsForSector(sectorDef.id);
  const totalDocs = Object.values(departmentDocs).reduce((sum, list) => sum + list.length, 0);

  res.json({
    approvals: matchedRules,
    total: matchedRules.length,
    sector: sectorDef,
    department_documents: departmentDocs,
    total_documents: totalDocs
  });
});

// Document Pre-check & Cross-Document Validation
app.post('/v1/validate', (req: Request, res: Response) => {
  const { documents } = req.body; // array of { type, extracted_fields: { name, address, ... } }
  
  const issues: { field: string; code: string; message_en: string; message_mr: string }[] = [];

  if (!documents || !Array.isArray(documents) || documents.length === 0) {
    return res.json({ ok: true, issues: [] });
  }

  const idDoc = documents.find((d: any) => d.type === 'id_proof');
  const addressDoc = documents.find((d: any) => d.type === 'address_proof');

  if (idDoc && addressDoc) {
    const idAddr = idDoc.extracted_fields?.address || '';
    const utilAddr = addressDoc.extracted_fields?.address || '';

    // Check for address conflict if provided
    if (idAddr && utilAddr && idAddr !== utilAddr) {
      issues.push({
        field: 'address',
        code: 'ADDRESS_MISMATCH',
        message_en: `Address discrepancy detected between Identity Proof ("${idAddr}") and Premises Utility Bill ("${utilAddr}"). Please verify or provide MIDC allotment letter.`,
        message_mr: `ओळख पुरावा पत्ता ("${idAddr}") आणि वीज बिल पत्ता ("${utilAddr}") यात तफावत आढळली आहे. कृपया पडताळणी करा किंवा एमआयडीसी वाटप पत्र जोडा.`
      });
    }

    const idName = idDoc.extracted_fields?.name || '';
    const utilName = addressDoc.extracted_fields?.name || '';
    if (idName && utilName && !utilName.toLowerCase().includes(idName.toLowerCase()) && !idName.toLowerCase().includes(utilName.toLowerCase())) {
      issues.push({
        field: 'name',
        code: 'NAME_SPELLING_MISMATCH',
        message_en: `Applicant name spelling variation detected: "${idName}" vs "${utilName}".`,
        message_mr: `अर्जदाराच्या नावाच्या स्पेलिंगमध्ये तफावत आढळली: "${idName}" आणि "${utilName}".`
      });
    }
  }

  res.json({
    ok: issues.length === 0,
    issues
  });
});

// Consent Management
app.post('/v1/consent', (req: Request, res: Response) => {
  const { user_id, department, purpose, expires_in_days = 90 } = req.body;
  if (!department || !purpose) {
    return apiError(res, 422, 'invalid_input', 'Department and purpose are required for consent.', 'संमतीसाठी विभाग आणि उद्देश आवश्यक आहेत.');
  }

  const now = new Date();
  const expiresAt = new Date(now.getTime() + expires_in_days * 24 * 60 * 60 * 1000);

  const consentId = `cst-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
  const record: ConsentRecord = {
    id: consentId,
    user_id: user_id || 'usr-ravi',
    dept: department,
    purpose,
    granted_at: now.toISOString(),
    expires_at: expiresAt.toISOString(),
    revoked_at: null
  };

  db.consents.set(consentId, record);
  writeAuditRow(user_id || 'usr-ravi', 'CONSENT_GRANTED', 'consents', { dept: department, consent_id: consentId });

  res.status(201).json({ consent_id: consentId, record });
});

app.get('/v1/consent', (req: Request, res: Response) => {
  const user_id = (req.query.user_id as string) || 'usr-ravi';
  const userConsents = Array.from(db.consents.values()).filter(c => c.user_id === user_id);
  res.json({ consents: userConsents });
});

app.delete('/v1/consent/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const consent = db.consents.get(id);
  if (!consent) {
    return apiError(res, 404, 'not_found', 'Consent record not found.', 'संमती नोंद आढळली नाही.');
  }

  consent.revoked_at = new Date().toISOString();
  writeAuditRow(consent.user_id, 'CONSENT_REVOKED', 'consents', { consent_id: id, dept: consent.dept });
  res.status(204).send();
});

// Submit Application (Atomic with Outbox)
app.post('/v1/applications', (req: Request, res: Response) => {
  const idempotencyKey = req.headers['idempotency-key'] as string;
  const { user_id = 'usr-ravi', service_type = 'Factory Setup Composite Clearance', project, target_departments = ['industries', 'mpcb', 'fire'] } = req.body;

  if (!project || !project.factory_name || !project.district) {
    return apiError(res, 422, 'invalid_input', 'Factory name and district are required.', 'कारखान्याचे नाव आणि जिल्हा आवश्यक आहेत.');
  }

  // Check consent for every targeted department
  const missingConsents: string[] = [];
  for (const dept of target_departments) {
    const hasConsent = Array.from(db.consents.values()).some(
      c => c.dept === dept && c.user_id === user_id && c.revoked_at === null && new Date(c.expires_at) > new Date()
    );
    if (!hasConsent) {
      missingConsents.push(dept);
    }
  }

  if (missingConsents.length > 0) {
    return res.status(403).json({
      error: {
        code: 'consent_required',
        message_en: `Please allow data sharing with the ${missingConsents.join(', ').toUpperCase()} department to continue.`,
        message_mr: `पुढे जाण्यासाठी ${missingConsents.join(', ').toUpperCase()} विभागाला माहिती देण्यास परवानगी द्या.`
      }
    });
  }

  // Generate official tracking ID: MH-2026-XXXXX
  const trackingNumber = Math.floor(10000 + Math.random() * 90000);
  const trackingId = `MH-2026-${trackingNumber}`;
  const now = new Date();

  // 1. Insert Application
  const targetSector = getSectorDefinition(project.business_sector || project.sector || 'manufacturing_engineering');
  const application: Application = {
    tracking_id: trackingId,
    user_id,
    service_type,
    project: {
      factory_name: project.factory_name,
      district: project.district,
      taluka: project.taluka,
      size: project.size || 'Small',
      business_sector: targetSector.id,
      sector: project.sector || targetSector.name_en,
      sectors: project.sectors || [targetSector.name_en],
      sector_name_en: project.sector_name_en || targetSector.name_en,
      sector_name_mr: project.sector_name_mr || targetSector.name_mr,
      pollution_category: project.pollution_category || targetSector.pollution_category,
      worker_count: Number(project.worker_count) || 25,
      investment_inr_lakhs: Number(project.investment_inr_lakhs) || 120,
      plot_address: project.plot_address || `Plot 14, MIDC Industrial Area, ${project.district}`,
      power_kw: Number(project.power_kw) || 45,
      documents_submitted: project.documents_submitted || []
    },
    created_at: now.toISOString(),
    updated_at: now.toISOString()
  };
  db.applications.set(trackingId, application);

  // 2. Insert Tasks and Outbox rows transactionally
  const createdTasks: DeptTask[] = [];
  const baseSlaSeconds = db.demoSettings.shortenSlaToSeconds || 180; // demo SLA or 3 mins default

  for (const dept of target_departments as ('industries' | 'mpcb' | 'fire' | 'labour')[]) {
    const taskId = `task-${trackingId}-${dept}`;
    const taskKey = idempotencyKey ? `${idempotencyKey}-${dept}-v1` : `${trackingId}-${dept}-v1`;
    const slaDue = new Date(now.getTime() + baseSlaSeconds * 1000);

    const task: DeptTask = {
      id: taskId,
      tracking_id: trackingId,
      dept,
      dept_ref_id: 'PENDING_DISPATCH',
      state: 'submitted',
      submission_version: 1,
      idempotency_key: taskKey,
      sla_start: now.toISOString(),
      sla_due: slaDue.toISOString(),
      sla_duration_seconds: baseSlaSeconds,
      warned: false,
      breached: false,
      escalation_level: 0,
      created_at: now.toISOString(),
      updated_at: now.toISOString()
    };
    db.tasks.set(taskId, task);
    createdTasks.push(task);

    // Encode payload via department connector
    const connector = mockConnectors[dept];
    const encodedPayload = connector ? connector.encode(application) : application;

    // Outbox Row
    const outboxId = `obx-${taskId}`;
    const outboxRow: OutboxItem = {
      id: outboxId,
      task_id: taskId,
      tracking_id: trackingId,
      dept,
      idem_key: taskKey,
      payload: encodedPayload,
      state: 'pending',
      attempts: 0,
      max_attempts: 4,
      next_attempt_at: Date.now() + 100, // immediate
      created_at: now.toISOString()
    };
    db.outbox.set(outboxId, outboxRow);
  }

  // 3. Write Audit entry
  writeAuditRow(user_id, 'APPLICATION_SUBMITTED', 'applications', {
    tracking_id: trackingId,
    departments: target_departments,
    idempotency_key: idempotencyKey
  }, trackingId);

  // Trigger worker asynchronously
  setTimeout(processOutbox, 50);

  res.status(201).json({
    tracking_id: trackingId,
    status: deriveApplicationStatus(createdTasks),
    tasks: createdTasks,
    created_at: application.created_at
  });
});

// List Applications with derived status
app.get('/v1/applications', (req: Request, res: Response) => {
  const user_id = (req.query.user_id as string) || 'usr-ravi';
  const apps = Array.from(db.applications.values())
    .filter(a => !user_id || a.user_id === user_id)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  const enriched = apps.map(app => {
    const tasks = Array.from(db.tasks.values()).filter(t => t.tracking_id === app.tracking_id);
    return {
      ...app,
      derived_status: deriveApplicationStatus(tasks),
      tasks
    };
  });

  res.json({ applications: enriched });
});

// Application Timeline
app.get('/v1/applications/:id/timeline', (req: Request, res: Response) => {
  const { id } = req.params;
  const application = db.applications.get(id);
  if (!application) {
    return apiError(res, 404, 'not_found', 'Application not found.', 'अर्ज सापडला नाही.');
  }

  const tasks = Array.from(db.tasks.values()).filter(t => t.tracking_id === id);
  const derived_status = deriveApplicationStatus(tasks);
  const auditEntries = db.audit_log.filter(a => a.tracking_id === id);

  res.json({
    application,
    derived_status,
    tasks,
    timeline_events: auditEntries.map(e => ({
      id: e.id,
      actor: e.actor,
      action: e.action,
      timestamp: e.timestamp,
      details: e.details
    }))
  });
});

// Targeted Resubmission to a single department
app.post('/v1/applications/:id/resubmit/:dept', (req: Request, res: Response) => {
  const { id, dept } = req.params;
  const { corrected_fields, corrected_documents } = req.body;

  const appRecord = db.applications.get(id);
  if (!appRecord) {
    return apiError(res, 404, 'not_found', 'Application not found.', 'अर्ज सापडला नाही.');
  }

  const task = Array.from(db.tasks.values()).find(t => t.tracking_id === id && t.dept === dept);
  if (!task) {
    return apiError(res, 404, 'not_found', 'Department task not found.', 'विभागीय कार्य सापडले नाही.');
  }

  if (task.state !== 'rejected' && task.state !== 'more_info') {
    return apiError(res, 409, 'invalid_transition', `Cannot resubmit: task is in state "${task.state}". Resubmissions are only valid for rejected or more_info states.`, `पुन्हा सादर करता येत नाही: कार्य "${task.state}" स्थितीत आहे.`);
  }

  task.submission_version += 1;
  task.state = 'in_review';
  task.updated_at = new Date().toISOString();
  // Reset SLA start for new iteration
  task.sla_start = new Date().toISOString();
  task.sla_due = new Date(Date.now() + (db.demoSettings.shortenSlaToSeconds || task.sla_duration_seconds) * 1000).toISOString();
  task.warned = false;
  task.breached = false;

  writeAuditRow(appRecord.user_id, 'DEPARTMENT_CORRECTION_RESUBMITTED', 'dept_tasks', {
    dept,
    version: task.submission_version,
    corrected_fields,
    corrected_documents
  }, id);

  res.status(202).json({
    message_en: `Resubmission to ${dept.toUpperCase()} accepted and queued for review. Other department approvals remain intact.`,
    message_mr: `${dept.toUpperCase()} विभागाकडे सुधारित अर्ज स्वीकारला गेला. इतर विभागांच्या मंजुऱ्या अबाधित आहेत.`,
    task
  });
});

// Officer Task Queue (filtered to officer's own department)
app.get('/v1/officer/tasks', (req: Request, res: Response) => {
  const dept = req.query.department as string;
  let taskList = Array.from(db.tasks.values());

  if (dept) {
    taskList = taskList.filter(t => t.dept === dept);
  }

  // Sort by SLA due time
  taskList.sort((a, b) => new Date(a.sla_due).getTime() - new Date(b.sla_due).getTime());

  const enriched = taskList.map(task => {
    const appRecord = db.applications.get(task.tracking_id);
    const now = Date.now();
    const dueTime = new Date(task.sla_due).getTime();
    const remainingSeconds = Math.max(0, Math.round((dueTime - now) / 1000));
    
    let riskLabel: 'Nominal' | 'At Risk (80%)' | 'Breached' = 'Nominal';
    if (task.breached || remainingSeconds === 0) riskLabel = 'Breached';
    else if (task.warned) riskLabel = 'At Risk (80%)';

    return {
      ...task,
      application: appRecord,
      remaining_seconds: remainingSeconds,
      risk_label: riskLabel
    };
  });

  res.json({ tasks: enriched });
});

// Officer Decision
app.post('/v1/officer/tasks/:id/decision', (req: Request, res: Response) => {
  const { id } = req.params;
  const { decision, reason, requested_info, officer_name = 'Department Officer' } = req.body;

  const task = db.tasks.get(id);
  if (!task) {
    return apiError(res, 404, 'not_found', 'Task not found.', 'कार्य सापडले नाही.');
  }

  if (!['approved', 'rejected', 'more_info'].includes(decision)) {
    return apiError(res, 422, 'invalid_input', 'Decision must be approved, rejected, or more_info.', 'निर्णय मंजूर, नाकारलेले किंवा अधिक माहिती असावा.');
  }

  if (decision === 'rejected' && (!reason || reason.trim().length === 0)) {
    return apiError(res, 422, 'reason_required', 'A valid reason is required for rejecting an application.', 'अर्ज नाकारण्यासाठी कारण देणे अनिवार्य आहे.');
  }

  task.state = decision as TaskState;
  task.decision_reason = reason;
  task.requested_info = requested_info;
  task.updated_at = new Date().toISOString();

  writeAuditRow(officer_name, `OFFICER_DECISION_${decision.toUpperCase()}`, 'dept_tasks', {
    task_id: id,
    dept: task.dept,
    decision,
    reason
  }, task.tracking_id);

  // Derive new application status
  const allTasks = Array.from(db.tasks.values()).filter(t => t.tracking_id === task.tracking_id);
  const derivedStatus = deriveApplicationStatus(allTasks);

  res.json({
    task,
    derived_application_status: derivedStatus
  });
});

// Grievances
app.post('/v1/grievances', (req: Request, res: Response) => {
  const { tracking_id, task_id, reason } = req.body;
  if (!tracking_id || !reason) {
    return apiError(res, 422, 'invalid_input', 'Tracking ID and reason required.', 'ट्रॅकिंग आयडी आणि कारण आवश्यक आहेत.');
  }

  const grievanceId = `GRV-CITIZEN-${Date.now().toString().slice(-6)}`;
  const grievance: Grievance = {
    id: grievanceId,
    tracking_id,
    task_id,
    reason,
    escalation_level: 1,
    created_at: new Date().toISOString(),
    resolved_at: null
  };
  db.grievances.set(grievanceId, grievance);

  writeAuditRow('CITIZEN', 'GRIEVANCE_FILED', 'grievances', { grievance_id: grievanceId, reason }, tracking_id);
  res.status(201).json({ grievance_id: grievanceId, grievance });
});

app.get('/v1/grievances', (req: Request, res: Response) => {
  res.json({ grievances: Array.from(db.grievances.values()) });
});

// Admin Analytics
app.get('/v1/analytics', (req: Request, res: Response) => {
  const totalApps = db.applications.size;
  const totalTasks = db.tasks.size;
  const breaches = Array.from(db.tasks.values()).filter(t => t.breached).length;
  const deadLetters = db.dead_letter.size;

  // Average turnaround time calculation
  const depts = ['industries', 'mpcb', 'fire', 'labour'];
  const deptStats = depts.map(d => {
    const tasks = Array.from(db.tasks.values()).filter(t => t.dept === d);
    const approved = tasks.filter(t => t.state === 'approved').length;
    const breached = tasks.filter(t => t.breached).length;
    return {
      dept: d,
      name: d.toUpperCase(),
      total_tasks: tasks.length,
      approved_count: approved,
      breached_count: breached,
      avg_processing_minutes: d === 'fire' ? 4.2 : d === 'mpcb' ? 5.8 : 3.5
    };
  });

  res.json({
    summary: {
      total_applications: totalApps,
      total_department_tasks: totalTasks,
      total_sla_breaches: breaches,
      dead_letter_count: deadLetters,
      healthy_connectors: Array.from(db.api_health.values()).filter(h => h.status === 'ok').length
    },
    departments: deptStats,
    api_health: Array.from(db.api_health.values())
  });
});

// Admin Dead-Letter Queue
app.get('/v1/admin/failed-calls', (req: Request, res: Response) => {
  res.json({ dead_letter_calls: Array.from(db.dead_letter.values()) });
});

app.post('/v1/admin/failed-calls/:id/retry', (req: Request, res: Response) => {
  const { id } = req.params;
  const dlqItem = db.dead_letter.get(id);
  if (!dlqItem) {
    return apiError(res, 404, 'not_found', 'Dead letter entry not found.', 'त्रुटी नोंद सापडली नाही.');
  }

  // Restore task to 'submitted'
  const task = Array.from(db.tasks.values()).find(t => t.tracking_id === dlqItem.tracking_id && t.dept === dlqItem.dept);
  if (task) {
    task.state = 'submitted';
    task.updated_at = new Date().toISOString();
  }

  // Re-queue in outbox with same idempotency key
  const outboxItem = db.outbox.get(dlqItem.outbox_id);
  if (outboxItem) {
    outboxItem.state = 'pending';
    outboxItem.attempts = 0;
    outboxItem.next_attempt_at = Date.now();
  }

  dlqItem.retried_at = new Date().toISOString();
  db.dead_letter.delete(id);

  writeAuditRow('ADMIN', 'DEAD_LETTER_RETRIED', 'outbox', { dlq_id: id, tracking_id: dlqItem.tracking_id, dept: dlqItem.dept }, dlqItem.tracking_id);

  setTimeout(processOutbox, 50);

  res.status(202).json({
    message_en: `Call for ${dlqItem.dept.toUpperCase()} re-queued with identical idempotency key. No duplicate created.`,
    message_mr: `${dlqItem.dept.toUpperCase()} विभागाची पुनरावृत्ती सुरू झाली. दुय्यम नोंद होणार नाही.`
  });
});

// Admin Audit Log and Verification
app.get('/v1/admin/audit', (req: Request, res: Response) => {
  const tracking_id = req.query.tracking_id as string;
  let rows = db.audit_log;
  if (tracking_id) {
    rows = rows.filter(r => r.tracking_id === tracking_id);
  }
  res.json({ audit_rows: rows.slice(-100) });
});

app.get('/v1/admin/audit/verify', (req: Request, res: Response) => {
  const verification = verifyAuditChain();
  res.json({
    verified: verification.ok,
    total_entries_checked: verification.count,
    details: verification
  });
});

// Demo Control Switches
app.post('/v1/admin/demo/fail-next', (req: Request, res: Response) => {
  const { department = 'mpcb' } = req.body;
  db.demoSettings.failNextDept = department;
  refreshApiHealth();
  writeAuditRow('ADMIN_DEMO', 'DEMO_FAIL_NEXT_TRIGGERED', 'demo', { department });
  res.json({ message: `Next call to ${department.toUpperCase()} will fail and test outbox retry/dead-letter.`, failNextDept: department });
});

app.post('/v1/admin/demo/sla', (req: Request, res: Response) => {
  const { seconds = 30 } = req.body;
  db.demoSettings.shortenSlaToSeconds = seconds;

  // Shorten all existing active tasks
  const now = Date.now();
  for (const t of db.tasks.values()) {
    if (!['approved', 'rejected'].includes(t.state)) {
      t.sla_start = new Date(now).toISOString();
      t.sla_due = new Date(now + seconds * 1000).toISOString();
      t.sla_duration_seconds = seconds;
      t.warned = false;
      t.breached = false;
    }
  }

  writeAuditRow('ADMIN_DEMO', 'DEMO_SLA_SHORTENED', 'demo', { seconds });
  res.json({ message: `SLA deadlines fast-forwarded to ${seconds} seconds for active tasks.`, seconds });
});

// AI Assistant Chat (Rules-First with timeout protection and comprehensive statutory guidance)
app.post('/v1/assistant/chat', async (req: Request, res: Response) => {
  const { question, language = 'en' } = req.body;
  if (!question || !question.trim()) {
    return apiError(res, 422, 'invalid_input', 'Question is required.', 'प्रश्न विचारणे आवश्यक आहे.');
  }

  const isMr = language === 'mr';
  const qLower = question.toLowerCase();

  // Comprehensive rule matching across Maharashtra departments
  let matchedRule: ApprovalRule | undefined;
  let generalTopic: 'portal' | 'sla' | 'tracking' | null = null;

  if (qLower.includes('fire') || qLower.includes('अग्नि') || qLower.includes('noc') || qLower.includes('सुरक्षा')) {
    matchedRule = APPROVALS_RULES.find(r => r.department === 'fire');
  } else if (qLower.includes('pollution') || qLower.includes('mpcb') || qLower.includes('प्रदूषण') || qLower.includes('cte') || qLower.includes('cto') || qLower.includes('consent') || qLower.includes('waste') || qLower.includes('effluent')) {
    matchedRule = APPROVALS_RULES.find(r => r.department === 'mpcb');
  } else if (qLower.includes('industry') || qLower.includes('industries') || qLower.includes('midc') || qLower.includes('उद्योग') || qLower.includes('iua') || qLower.includes('manufacture') || qLower.includes('acknowledgement') || qLower.includes('plot')) {
    matchedRule = APPROVALS_RULES.find(r => r.department === 'industries');
  } else if (qLower.includes('labour') || qLower.includes('worker') || qLower.includes('workers') || qLower.includes('कामगार') || qLower.includes('कर्मचारी') || qLower.includes('dish') || qLower.includes('factory license') || qLower.includes('factories act') || qLower.includes('परवाना')) {
    matchedRule = APPROVALS_RULES.find(r => r.department === 'labour');
  } else if (qLower.includes('pharma') || qLower.includes('drug') || qLower.includes('fda') || qLower.includes('औषध')) {
    matchedRule = APPROVALS_RULES.find(r => r.rule_id === 'RULE-FDA-PHARMA-03') || APPROVALS_RULES.find(r => r.department === 'industries');
  } else if (qLower.includes('sla') || qLower.includes('दिवस') || qLower.includes('days') || qLower.includes('time') || qLower.includes('वेळ')) {
    generalTopic = 'sla';
  } else if (qLower.includes('track') || qLower.includes('status') || qLower.includes('स्थिती') || qLower.includes('तपासा')) {
    generalTopic = 'tracking';
  } else if (qLower.includes('mahasetu') || qLower.includes('portal') || qLower.includes('apply') || qLower.includes('अर्ज') || qLower.includes('single window') || qLower.includes('एकल')) {
    generalTopic = 'portal';
  }

  // Attempt Gemini AI if configured with a 2-second strict timeout
  if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY') {
    try {
      const ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: {
          headers: { 'User-Agent': 'aistudio-build' }
        }
      });

      const systemPrompt = `You are the official regulatory assistant for MahaSetu AI (Maharashtra Interoperability Layer).
Your job is to assist entrepreneurs setting up factories or businesses in Maharashtra.
CRITICAL RULES:
1. Ground answers strictly in official Maharashtra rules:
   - RULE-IND-2024-01: Directorate of Industries (MIDC) Industrial Undertaking Acknowledgement.
   - RULE-MPCB-RED-04: Maharashtra Pollution Control Board Consent to Establish under Water & Air Acts.
   - RULE-FIRE-NOC-02: Maharashtra Fire & Emergency Services Provisional Fire Safety NOC.
   - RULE-LAB-FACT-01: Department of Labour Factory License (10+ workers with power).
2. Cite the exact Rule ID and Act in your answer.
3. Keep answers concise, actionable, and formatted with bullet points.
4. Answer in the requested language: ${isMr ? 'Marathi' : 'English'}.`;

      // Strict 2000ms timeout race so request never hangs
      const geminiPromise = ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: question,
        config: {
          systemInstruction: systemPrompt,
          temperature: 0.2
        }
      });

      const timeoutPromise = new Promise<null>((_, reject) =>
        setTimeout(() => reject(new Error('Gemini API timeout')), 2000)
      );

      const response = await Promise.race([geminiPromise, timeoutPromise]);

      if (response && response.text) {
        return res.json({
          answer: response.text,
          rule_id: matchedRule ? matchedRule.rule_id : undefined,
          department: matchedRule ? matchedRule.department : undefined
        });
      }
    } catch (err: any) {
      console.warn('[Assistant] Gemini fast timeout or error, falling back to statutory rules catalog:', err.message);
    }
  }

  // Authoritative Deterministic Statutory Responses
  if (matchedRule) {
    let answer = '';
    if (isMr) {
      answer = `होय, ${matchedRule.legal_act_mr} मधील नियम (${matchedRule.rule_id}) नुसार:\n\n` +
        `• आवश्यक मंजुरी: ${matchedRule.department_name_mr} कडून "${matchedRule.approval_name_mr}"\n` +
        `• कारण व व्याप्ती: ${matchedRule.reason_mr}\n` +
        `• आवश्यक कागदपत्रे:\n` +
        matchedRule.required_documents.map((d, i) => `  ${i + 1}. ${d.name_mr}`).join('\n') + '\n\n' +
        `• सेवा हमी कालावधी (SLA): महाराष्ट्र लोकसेवा हक्क अधिनियमानुसार ${matchedRule.sla_minutes} कार्यदिवस.\n\n` +
        `हा अर्ज तुम्ही महासेतूच्या 'नवीन अर्ज' खिडकीतून एकाच वेळी इतर विभागांसोबत सादर करू शकता.`;
    } else {
      answer = `Yes, under rule ${matchedRule.rule_id} of the ${matchedRule.legal_act_en}:\n\n` +
        `• Required Clearance: "${matchedRule.approval_name_en}" issued by ${matchedRule.department_name_en}\n` +
        `• Statutory Reason: ${matchedRule.reason_en}\n` +
        `• Mandatory Documents Required:\n` +
        matchedRule.required_documents.map((d, i) => `  ${i + 1}. ${d.name_en}`).join('\n') + '\n\n' +
        `• Statutory SLA: ${matchedRule.sla_minutes} Working Days (under Maharashtra Right to Public Services Act).\n\n` +
        `You can apply for this clearance along with all other required approvals in a single submission through the MahaSetu portal.`;
    }

    return res.json({
      answer,
      rule_id: matchedRule.rule_id,
      department: matchedRule.department
    });
  }

  if (generalTopic === 'portal') {
    const answer = isMr
      ? `महासेतू (MahaSetu) हे महाराष्ट्र शासनाचे एकीकृत एकल खिडकी आंतरकार्यक्षमता पोर्टल आहे.\n\n` +
        `• प्रमुख वैशिष्ट्ये:\n` +
        `  १. एकच अर्ज: MIDC, MPCB, अग्निशमन व कामगार विभागांचे परवाने एकाच अर्जाद्वारे प्राप्त करा.\n` +
        `  २. समांतर प्रक्रिया: सर्व विभागांकडे एकाच वेळी अर्ज पाठवला जातो, ज्यामुळे परवानगीचा वेळ ६०% कमी होतो.\n` +
        `  ३. पारदर्शक ट्रॅकिंग: प्रत्येक अर्जासाठी युनिक ट्रॅकिंग आयडी आणि क्रिप्टोग्राफिक ऑडिट ट्रेल.\n` +
        `  ४. डिजिटल डेटा संरक्षण (DPDP) कायद्याचे काटेकोर पालन.`
      : `MahaSetu is Maharashtra's official Single Window Interoperability Gateway for industrial permissions.\n\n` +
        `• Key Features:\n` +
        `  1. Composite Application: Apply once for MIDC, MPCB (Pollution), Fire Safety, and Labour (DISH) clearances.\n` +
        `  2. Parallel Processing: Applications are concurrently routed to all departments, reducing clearance turnaround by 60%.\n` +
        `  3. Tamper-Proof Audit: Every status update and officer remark is cryptographically hash-chained.\n` +
        `  4. DPDP Act Compliant: Explicit granular data consent and full citizen privacy protection.`;

    return res.json({ answer, rule_id: 'MAH-SINGLE-WINDOW-ACT' });
  }

  if (generalTopic === 'sla') {
    const answer = isMr
      ? `महाराष्ट्र लोकसेवा हक्क अधिनियमानुसार (Maharashtra Right to Public Services Act):\n\n` +
        `• MIDC पोचपावती: कमाल ५ कार्यदिवस\n` +
        `• MPCB स्थापना संमती (CTE): कमाल ७ ते १५ कार्यदिवस\n` +
        `• अग्निशमन तात्पुरते NOC: कमाल ६ ते १५ कार्यदिवस\n` +
        `• कारखाना परवाना (DISH): कमाल ८ ते २१ कार्यदिवस\n\n` +
        `मुदत संपल्यास प्रणालीमध्ये स्वयंचलित 'Deemed Approval' किंवा वरिष्ठ अधिकाऱ्यांकडे एस्केलेशन होते.`
      : `Under the Maharashtra Right to Public Services Act (RTS Act), statutory clearance timelines are:\n\n` +
        `• MIDC Industrial Acknowledgement: 5 Working Days\n` +
        `• MPCB Consent to Establish (CTE): 7 - 15 Working Days\n` +
        `• Fire Safety Provisional NOC: 6 - 15 Working Days\n` +
        `• Labour (DISH) Factory License: 8 - 21 Working Days\n\n` +
        `If the SLA deadline expires without departmental query, the system triggers deemed approval review or escalation.`;

    return res.json({ answer, rule_id: 'MAH-RTS-ACT-2015' });
  }

  if (generalTopic === 'tracking') {
    const answer = isMr
      ? `तुम्ही तुमच्या अर्जाची स्थिती 'थेट स्थिती' (Track Status) टॅबमध्ये ट्रॅकिंग आयडी (उदा. TRK-...) टाकून त्वरित पाहू शकता.\nयेथे प्रत्येक विभागाची प्रगती, SLA काउंटडाउन आणि निर्णय टिप्पण्या थेट दिसतात.`
      : `You can monitor real-time clearance status under the 'Track Status' tab using your Application Tracking ID (e.g., TRK-...). It provides a live timeline, department status badges, and SLA countdowns.`;

    return res.json({ answer, rule_id: 'TRACKING-MODULE' });
  }

  // Safe helpful guidance when no specific keyword matched
  const defaultAnswer = isMr
    ? `नमस्कार! मी महासेतू नियम सहाय्यक आहे. महाराष्ट्रातील खालील परवानग्यांबद्दल विचारू शकता:\n` +
      `१. अग्निशमन ना-हरकत प्रमाणपत्र (Fire Safety NOC)\n` +
      `२. प्रदूषण नियंत्रण मंडळ (MPCB Consent to Establish)\n` +
      `३. उद्योग संचालनालय (MIDC Acknowledgment)\n` +
      `४. कामगार विभाग कारखाना परवाना (Factory License DISH)\n\n` +
      `अधिक माहितीसाठी कृपया वरील पर्यायांपैकी एक प्रश्न निवडा किंवा थेट प्रश्न विचारा.`
    : `I am the MahaSetu Rules & Regulatory Assistant. You can ask me about:\n` +
      `1. Fire Safety NOC requirements under the Maharashtra Fire Act\n` +
      `2. MPCB Consent to Establish (CTE) under Water & Air Acts\n` +
      `3. MIDC Industrial Undertaking Acknowledgement\n` +
      `4. Factory License requirements (10+ workers with power under Factories Act)\n` +
      `5. Statutory SLA timelines and composite single-window application process.\n\n` +
      `Please ask a specific regulatory question or click one of the suggested prompts below.`;

  return res.json({
    answer: defaultAnswer,
    rule_id: 'GENERAL-GUIDANCE'
  });
});

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    service: 'MahaSetu AI Interoperability Gateway',
    timestamp: new Date().toISOString()
  });
});

// --------------------------------------------------------------------------
// 10. VITE DEV SERVER INTEGRATION OR STATIC SERVE
// --------------------------------------------------------------------------
async function startServer() {
  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`MahaSetu AI Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
