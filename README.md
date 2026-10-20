# MahaSetu AI — Maharashtra State Single-Window Interoperability Gateway

[![Government of Maharashtra](https://img.shields.io/badge/Govt_of_Maharashtra-State_Single_Window-orange.svg)](#)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue.svg)](#)
[![React](https://img.shields.io/badge/React-19.0-61dafb.svg)](#)
[![DPDP Act 2023](https://img.shields.io/badge/DPDP_Act_2023-Compliant-emerald.svg)](#)
[![Security](https://img.shields.io/badge/Audit_Trail-SHA--256_Hash_Chain-purple.svg)](#)
[![Test Suite](https://img.shields.io/badge/Tests-23%2F23_Passed_(100%25)-success.svg)](#)

> **MahaSetu (महासेतू)** is Maharashtra's next-generation inter-departmental regulatory clearance gateway. It unifies isolated departmental systems (**MIDC, MPCB, Fire & Emergency Services, Labour/DISH**) into a single-window digital pipeline with parallel processing, cryptographic auditability, and statutory SLA enforcement.

---

## 1. Problem Statement

Establishing or expanding an industrial factory in Maharashtra traditionally requires entrepreneurs to navigate **4 to 8 siloed department portals**, each operating independently:

1. **Fragmented Portals & Repetitive Data Entry**: An entrepreneur must fill identical company, address, power, and workforce details across MIDC, MPCB, Fire Services, and the Labour Department separately.
2. **Serial Dependency & Turnaround Delays**: Clearances that could be evaluated in parallel are stuck in sequential queues, inflating approval times from **15 days to 90–180 days**.
3. **Repeated Document Submissions**: Applicants repeatedly upload identical 7/12 land records, floor plans, and identity proofs, risking discrepancies and administrative rejections.
4. **Lack of Inter-Departmental Interoperability**: Department legacy databases (XML, SOAP, JSON, flat files) do not communicate with one another, resulting in blind handoffs and orphaned applications.
5. **Absence of Tamper-Evident Auditability**: Traditional database logs can be retroactively altered, obscuring why or when an application was delayed, rejected, or modified.
6. **Statutory SLA Non-Compliance**: Timelines mandated under the **Maharashtra Right to Public Services Act (RTS Act), 2015** are difficult to enforce without real-time tracking and deemed approval triggers.
7. **Privacy & DPDP Vulnerabilities**: Citizen identity and business data are shared across departments without explicit, granular, or revocable consent under the **Digital Personal Data Protection (DPDP) Act, 2023**.

---

## 2. The MahaSetu Solution

MahaSetu solves this by serving as an **Interoperability Gateway and Rules Engine**:

- **Apply Once, Route Everywhere (Parallel Dispatch)**: A single composite application form automatically evaluates statutory triggers and fans out dedicated, projected requests to all relevant departments simultaneously.
- **Statutory Rule Engine**: Declaratively maps industrial scale (Micro/Small/Medium/Large), workforce, power load, and pollution categories (Red/Orange/Green/White) to real Maharashtra state acts.
- **DPDP Act (2023) Compliant Consent**: Generates signed cryptographic consent tokens per department with explicit data-field scoping and 1-click citizen revocation.
- **SHA-256 Tamper-Proof Audit Chain**: Every state change, document upload, and officer remark is cryptographically linked to the previous block in a verifiable hash chain (`prev_hash | actor | action | entity | timestamp | hash`).
- **Resilient Transactional Outbox & Dead Letter Queue (DLQ)**: Department server timeouts are captured in an outbox retry queue with exponential backoff and manual replay capabilities.
- **Statutory SLA Countdown & Deemed Approvals**: Real-time SLA tracking pursuant to the Maharashtra RTS Act 2015, featuring warning thresholds and automated deemed approval mechanisms.
- **Bilingual Accessibility**: Comprehensive native language support across Marathi (**मराठी**) and English.

---

## 3. System Architecture Diagram

```
+---------------------------------------------------------------------------------------+
|                                CITIZEN & BUSINESS APPLICANT                           |
|       (New Registration | Unified Clearance Wizard | File Uploads | Live Tracking)     |
+-------------------------------------------+-------------------------------------------+
                                            |
                                  HTTPS / JSON (REST APIs)
                                            |
                                            v
+---------------------------------------------------------------------------------------+
|                     MAHASETU API GATEWAY & ORCHESTRATION ENGINE                       |
|                                                                                       |
|   +-------------------+   +--------------------+   +------------------------------+   |
|   | Identity & Auth   |   | Statutory Rules    |   | DPDP Consent Registry        |   |
|   | (SSO / Register)  |   | (MIDC, MPCB, Fire) |   | (Tokens / Field Scopes / Rev)|   |
|   +-------------------+   +--------------------+   +------------------------------+   |
|                                                                                       |
|   +-------------------+   +--------------------+   +------------------------------+   |
|   | Document Store    |   | SLA Timer Engine   |   | Rules Assistant (AI/RAG)     |   |
|   | (PDF/JPG Uploads) |   | (RTS Act Timelines)|   | (Grounding & Guidance)       |   |
|   +-------------------+   +--------------------+   +------------------------------+   |
+-------------------------------------------+-------------------------------------------+
                                            |
                                  Atomic State Mutation
                                            |
                                            v
+---------------------------------------------------------------------------------------+
|                    TRANSACTIONAL OUTBOX & FAULT-TOLERANT DISPATCH                     |
|                                                                                       |
|        [ Outbox Queue ] ---> (Retry Worker with Backoff) ---> [ Dead Letter Queue ]   |
+-------------+-----------------------------+-----------------------------+-------------+
              |                             |                             |
      Adapter | (JSON)              Adapter | (XML)               Adapter | (REST)
              v                             v                             v
    +-------------------+         +-------------------+         +-------------------+
    | Directorate of    |         | Maharashtra       |         | Maharashtra Fire  |
    | Industries (MIDC) |         | Pollution Control |         | & Emergency Desk  |
    | Desk Officer      |         | Board (MPCB) Desk |         | Chief Fire Officer|
    +-------------------+         +-------------------+         +-------------------+
              ^                             ^                             ^
              |                             |                             |
+-------------+-----------------------------+-----------------------------+-------------+
|                          DEPARTMENT OFFICER DECISION WORKBENCH                        |
|                  (Field Projections | Document Verification | Decision Logs)          |
+-------------------------------------------+-------------------------------------------+
                                            |
                                  Audit Event Chaining
                                            |
                                            v
+---------------------------------------------------------------------------------------+
|                 IMMUTABLE CRYPTOGRAPHIC AUDIT LEDGER (SHA-256 HASH CHAIN)              |
|                                                                                       |
|   [ Genesis Block ] ===> [ Block #1 (Register) ] ===> [ Block #2 (Submit) ] ===> ...  |
|                                                                                       |
|   * Tamper-Proof Audit API: /v1/admin/audit/verify (Detects any modified byte)        |
+---------------------------------------------------------------------------------------+
```

---

## 4. End-to-End User Flow

```
Step 1: Registration
  Citizen / Enterprise registers with Promotor Details, Maharashtra District, and MSME Scale.
  A cryptographic account record is committed to the ledger.
       │
       ▼
Step 2: Describe Enterprise
  Citizen specifies sector, capital investment, power load (KW), and workforce.
  The rule engine automatically identifies required statutory approvals.
       │
       ▼
Step 3: Document Upload (PDF / JPG)
  Upload required blueprints, factory layouts, and NOC forms with instant drag-and-drop.
  System performs automated cross-document address verification.
       │
       ▼
Step 4: DPDP Act (2023) Consent Grant
  Citizen reviews explicit purpose, duration (90 days), and fields transmitted per department.
  Issues immutable digital consent tokens.
       │
       ▼
Step 5: Composite Submission
  One-click submission generates an official Tracking ID (e.g., MH-2026-44210).
  Outbox dispatches parallel payloads to MIDC, MPCB, Fire, and Labour.
       │
       ▼
Step 6: Officer Queue & Decision
  Department officers review projected fields and verify uploaded documents.
  Officers Approve, Query, or Reject with mandatory statutory justification.
       │
       ▼
Step 7: Real-Time Tracking & Deemed Approval
  Citizen monitors live department timelines and SLA countdowns.
  If an SLA deadline expires without departmental query, deemed approval triggers.
```

---

## 5. Technology Stack

### Frontend Application
- **Framework**: React 19 SPA (Functional components, custom hooks)
- **Tooling**: Vite 6 (Ultra-fast build & HMR)
- **Type Safety**: TypeScript 5.8 (Strict mode, zero `any` policy for core data structures)
- **Styling**: Tailwind CSS v4 (Official institutional government visual theme)
- **Icons**: Lucide React

### Backend & Interoperability Gateway
- **Runtime**: Node.js 22 LTS (ES Modules)
- **Server Framework**: Express 4 mounted via Vite development middleware
- **Resilience Engine**: Transactional Outbox pattern with exponential backoff & Dead Letter Queue (DLQ)
- **Data Protection**: DPDP Act (2023) granular consent tokens & token revocation lifecycle
- **Cryptography**: Node.js Native `crypto` (SHA-256 tamper-evident hash chaining)
- **AI / Regulatory Assistant**: `@google/genai` (Rules-grounded statutory RAG with 2s circuit-breaker)

---

## 6. Statutory Acts & Clearances Covered

| Department | Clearance Name | Governing Legal Act | Statutory SLA |
| :--- | :--- | :--- | :---: |
| **Industries (MIDC)** | Industrial Undertaking Acknowledgement (IUA) | *Maharashtra Industrial Development Act & MSMED Act* | 5 Days |
| **Pollution Board (MPCB)** | Consent to Establish (CTE) | *Water Act 1974 & Air Act 1981* | 7–15 Days |
| **Fire Services** | Provisional Fire Safety NOC | *Maharashtra Fire Prevention & Life Safety Measures Act 2006* | 6–15 Days |
| **Labour (DISH)** | Factory License & Registration | *Factories Act 1948 & Maharashtra Factories Rules* | 8–21 Days |
| **State Governance** | Deemed Approval & Grievance Redressal | *Maharashtra Right to Public Services Act (RTS Act), 2015* | Variable |

---

## 7. Key REST API Endpoints

### Authentication & Consent (DPDP Act 2023)
- `POST /v1/auth/register` — Register new enterprise applicant profile.
- `POST /v1/auth/login` — Single sign-on authentication.
- `POST /v1/consent` — Issue granular, departmental consent token.
- `GET /v1/consent` — List active user consent tokens.
- `DELETE /v1/consent/:id` — Revoke departmental data-sharing consent.

### Approvals & Clearances
- `GET /v1/approvals/sectors` — Retrieve 9-sector Maharashtra industrial catalog.
- `GET /v1/approvals/documents` — Fetch dynamic departmental document checklist.
- `POST /v1/assistant/checklist` — Compute required approvals based on project scale & power.
- `POST /v1/applications` — Atomic composite application submission.
- `GET /v1/applications/:id/timeline` — Retrieve real-time clearance status and SLA countdowns.

### Officer & Admin Governance
- `GET /v1/officer/tasks` — Department-specific task review queue.
- `POST /v1/officer/tasks/:id/decision` — Submit officer decision (Approve/Reject/Query).
- `GET /v1/admin/failed-calls` — Dead Letter Queue (DLQ) inspection.
- `POST /v1/admin/failed-calls/:id/retry` — Manually replay failed departmental sync.
- `GET /v1/admin/audit` — Retrieve immutable audit trail records.
- `GET /v1/admin/audit/verify` — Execute cryptographic SHA-256 hash-chain verification.

### Regulatory Rules Assistant
- `POST /v1/assistant/chat` — Rules-grounded bilingual guidance (Marathi / English) with verified rule citations.

---

## 8. Local Setup & Execution

### Prerequisites
- Node.js (v20 or v22 LTS recommended)
- npm (v10+)

### 1. Clone & Install Dependencies
```bash
git clone <repository-url>
cd mahasetu-ai
npm install
```

### 2. Environment Configuration
Copy the example environment file:
```bash
cp .env.example .env.local
```

### 3. Run Development Server
```bash
npm run dev
```
The application will be live at `http://localhost:3000`.

### 4. Run Automated Pre-Deployment Test Suite
```bash
npm test
```
Executes all **23 automated test cases** covering the entire citizen, officer, resilience, and cryptographic audit pipeline.

### 5. Production Build & Lint
```bash
npm run lint    # Strict TypeScript verification (tsc --noEmit)
npm run build   # Production Vite bundle
npm start       # Production server start
```

---

## 9. License & Governance

Developed as an open digital public infrastructure (DPI) reference implementation for the **Government of Maharashtra**.  
Adheres to the statutory provisions of the **Maharashtra Right to Public Services Act, 2015** and the **Digital Personal Data Protection Act, 2023**.
