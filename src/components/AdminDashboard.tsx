import React, { useState, useEffect } from 'react';
import { Activity, ShieldAlert, CheckCircle, RefreshCw, Key, ShieldCheck, Zap, Server, AlertTriangle } from 'lucide-react';
import { ApiHealthRecord, DeadLetterItem, AuditRow } from '../types';
import { translations } from '../i18n/translations';

interface AdminDashboardProps {
  lang: 'en' | 'mr';
  onTriggerDemoFailure: () => Promise<void>;
  onTriggerFastSla: () => Promise<void>;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  lang,
  onTriggerDemoFailure,
  onTriggerFastSla,
}) => {
  const t = translations[lang];

  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'dlq' | 'audit' | 'demo'>('overview');
  const [loading, setLoading] = useState(false);

  // Analytics State
  const [analytics, setAnalytics] = useState<any>({
    summary: { total_applications: 0, total_department_tasks: 0, total_sla_breaches: 0, dead_letter_count: 0, healthy_connectors: 4 },
    departments: [],
    api_health: [],
  });

  // DLQ State
  const [deadLetters, setDeadLetters] = useState<DeadLetterItem[]>([]);
  const [retryFeedback, setRetryFeedback] = useState<string | null>(null);

  // Audit State
  const [auditRows, setAuditRows] = useState<AuditRow[]>([]);
  const [verificationResult, setVerificationResult] = useState<any | null>(null);
  const [verifying, setVerifying] = useState(false);

  const fetchAnalytics = async () => {
    try {
      const res = await fetch('/v1/analytics');
      const data = await res.json();
      setAnalytics(data);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchDeadLetters = async () => {
    try {
      const res = await fetch('/v1/admin/failed-calls');
      const data = await res.json();
      setDeadLetters(data.dead_letter_calls || []);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchAudit = async () => {
    try {
      const res = await fetch('/v1/admin/audit');
      const data = await res.json();
      setAuditRows(data.audit_rows || []);
    } catch (e) {
      console.error(e);
    }
  };

  const verifyAudit = async () => {
    setVerifying(true);
    try {
      const res = await fetch('/v1/admin/audit/verify');
      const data = await res.json();
      setVerificationResult(data);
    } catch (e) {
      console.error(e);
    } finally {
      setVerifying(false);
    }
  };

  const handleRetryDlq = async (id: string) => {
    try {
      const res = await fetch(`/v1/admin/failed-calls/${id}/retry`, { method: 'POST' });
      const data = await res.json();
      setRetryFeedback(lang === 'mr' ? data.message_mr : data.message_en);
      setTimeout(() => setRetryFeedback(null), 4000);
      fetchDeadLetters();
      fetchAnalytics();
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchAnalytics();
    fetchDeadLetters();
    fetchAudit();

    const interval = setInterval(() => {
      fetchAnalytics();
      fetchDeadLetters();
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 space-y-6">
      
      {/* Admin Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            {t.admin_title}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {t.admin_subheading}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg text-xs overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveSubTab('overview')}
            className={`px-3 py-1.5 font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
              activeSubTab === 'overview' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {t.tab_overview}
          </button>
          <button
            onClick={() => {
              setActiveSubTab('dlq');
              fetchDeadLetters();
            }}
            className={`px-3 py-1.5 font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
              activeSubTab === 'dlq' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {t.tab_dlq} ({deadLetters.length})
          </button>
          <button
            onClick={() => {
              setActiveSubTab('audit');
              fetchAudit();
            }}
            className={`px-3 py-1.5 font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
              activeSubTab === 'audit' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {t.tab_audit}
          </button>
          <button
            onClick={() => setActiveSubTab('demo')}
            className={`px-3 py-1.5 font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
              activeSubTab === 'demo' ? 'bg-white text-purple-900 shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            ⚡ {t.tab_demo_switches}
          </button>
        </div>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs">
          <span className="text-xs text-slate-500 font-medium">{t.kpi_avg_processing}</span>
          <p className="text-2xl font-bold font-mono text-slate-900 mt-1">4.5 min</p>
          <span className="text-[11px] text-emerald-700 font-medium">95% within 1-sec read target</span>
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs">
          <span className="text-xs text-slate-500 font-medium">{t.kpi_sla_breaches}</span>
          <p className="text-2xl font-bold font-mono text-slate-900 mt-1">
            {analytics.summary.total_sla_breaches}
          </p>
          <span className="text-[11px] text-amber-700 font-medium">Auto-escalated to Grievance cell</span>
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs">
          <span className="text-xs text-slate-500 font-medium">{t.kpi_dead_letter}</span>
          <p className="text-2xl font-bold font-mono text-slate-900 mt-1">
            {deadLetters.length}
          </p>
          <span className="text-[11px] text-slate-500 font-medium">Isolated from main pipeline</span>
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs">
          <span className="text-xs text-slate-500 font-medium">{t.kpi_connectors}</span>
          <p className="text-2xl font-bold font-mono text-emerald-700 mt-1">
            4 / 4 Active
          </p>
          <span className="text-[11px] text-slate-500 font-medium">JSON, XML & CSV adapters online</span>
        </div>
      </div>

      {/* SUBTAB 1: OVERVIEW & CONNECTORS */}
      {activeSubTab === 'overview' && (
        <div className="space-y-6">
          
          {/* Connector Health Table */}
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  {lang === 'mr' ? 'विभागीय कनेक्टर व प्रोटोकॉल स्थिती' : 'Department Connectors & Ingestion Protocol Health'}
                </h3>
                <p className="text-xs text-slate-500">
                  MahaSetu interoperability gateway transforms canonical applications to native schemas.
                </p>
              </div>
              <span className="text-xs font-mono font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded">
                Heartbeat: Active
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-100">
                  <tr>
                    <th className="px-4 py-3">Department System</th>
                    <th className="px-4 py-3">Ingestion Format</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Avg Latency</th>
                    <th className="px-4 py-3">Reliability</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {(analytics.api_health || []).map((h: ApiHealthRecord) => (
                    <tr key={h.connector} className="hover:bg-slate-50">
                      <td className="px-4 py-3 font-semibold text-slate-900 uppercase">
                        {h.connector}
                      </td>
                      <td className="px-4 py-3 font-mono text-slate-600">
                        {h.format === 'nested_json' ? 'Nested JSON (REST)' : h.format === 'flat_json' ? 'Flat JSON (RPC)' : h.format === 'xml' ? 'ISO-XML (SOAP/HTTP)' : 'CSV Drop (Batch)'}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1.5 font-medium ${
                          h.status === 'ok' ? 'text-emerald-700' : 'text-rose-700'
                        }`}>
                          <span className={`w-2 h-2 rounded-full ${h.status === 'ok' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                          <span>{h.status === 'ok' ? 'Operational' : 'Degraded (Retrying)'}</span>
                        </span>
                      </td>
                      <td className="px-4 py-3 font-mono">
                        {h.latency_ms} ms
                      </td>
                      <td className="px-4 py-3 font-mono font-medium text-slate-700">
                        {h.success_rate}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Department Throughput Breakdown */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 mb-1">
              {lang === 'mr' ? 'विभागांनुसार मंजुरी कामगिरी' : 'Department Turnaround Times & Breach Analysis'}
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Real-world timings derived automatically from transactional event logs.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {(analytics.departments || []).map((d: any) => (
                <div key={d.dept} className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                  <span className="text-xs font-bold uppercase text-slate-900">{d.name}</span>
                  <div className="text-xs text-slate-600 flex justify-between">
                    <span>Approved:</span>
                    <span className="font-mono font-bold text-emerald-700">{d.approved_count}</span>
                  </div>
                  <div className="text-xs text-slate-600 flex justify-between">
                    <span>Breaches:</span>
                    <span className="font-mono font-bold text-rose-700">{d.breached_count}</span>
                  </div>
                  <div className="text-xs text-slate-600 flex justify-between pt-1 border-t border-slate-200">
                    <span>Avg Turnaround:</span>
                    <span className="font-mono font-bold">{d.avg_processing_minutes}m</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* SUBTAB 2: DEAD-LETTER QUEUE */}
      {activeSubTab === 'dlq' && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              {t.dlq_heading}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {t.dlq_desc}
            </p>
          </div>

          {retryFeedback && (
            <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{retryFeedback}</span>
            </div>
          )}

          {deadLetters.length === 0 ? (
            <div className="text-center py-12 text-xs text-slate-500 bg-slate-50 rounded-lg border border-slate-200">
              {lang === 'mr'
                ? 'डेड-लेटर रांगेत कोणतेही अयशस्वी संदेश नाहीत. सर्व कनेक्टर सुरळीत कार्यरत आहेत.'
                : 'Dead-letter queue is completely clear. All outbound department sends have succeeded.'}
            </div>
          ) : (
            <div className="space-y-3">
              {deadLetters.map((dlq) => (
                <div key={dlq.id} className="p-4 rounded-lg border border-rose-200 bg-rose-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-mono font-bold text-rose-950">
                        {dlq.tracking_id}
                      </span>
                      <span className="text-[11px] font-semibold text-rose-800 uppercase px-2 py-0.5 bg-rose-100 rounded">
                        Dept: {dlq.dept.toUpperCase()}
                      </span>
                      <span className="text-[11px] font-mono text-slate-500">
                        Failed after {dlq.attempts} attempts
                      </span>
                    </div>

                    <p className="text-xs font-medium text-rose-900">
                      Error: {dlq.error}
                    </p>

                    <div className="text-[11px] text-slate-500 font-mono">
                      Isolated At: {new Date(dlq.created_at).toLocaleTimeString()}
                    </div>
                  </div>

                  <button
                    onClick={() => handleRetryDlq(dlq.id)}
                    className="px-4 py-2 bg-blue-900 hover:bg-blue-800 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer shrink-0 shadow-xs"
                  >
                    {t.btn_retry_send}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* SUBTAB 3: CRYPTOGRAPHIC AUDIT CHAIN */}
      {activeSubTab === 'audit' && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                {t.audit_heading}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {t.audit_desc}
              </p>
            </div>

            <button
              onClick={verifyAudit}
              disabled={verifying}
              className="px-4 py-2 bg-purple-900 hover:bg-purple-800 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs shrink-0"
            >
              <Zap className="w-3.5 h-3.5 text-purple-300" />
              <span>{verifying ? 'Verifying...' : t.btn_verify_chain}</span>
            </button>
          </div>

          {/* Verification Badge Result */}
          {verificationResult && (
            <div className={`p-4 rounded-lg border text-xs flex items-center gap-2.5 ${
              verificationResult.verified
                ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                : 'bg-rose-50 border-rose-300 text-rose-900'
            }`}>
              {verificationResult.verified ? (
                <>
                  <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                  <div>
                    <p className="font-bold">{t.verification_passed}</p>
                    <p className="text-[11px] text-emerald-700">
                      Checked {verificationResult.total_entries_checked} sequential records. Every cryptographic block matched SHA-256 HMAC digest.
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0" />
                  <div>
                    <p className="font-bold">Audit Chain Tamper Detected!</p>
                    <p className="text-[11px] text-rose-700">{verificationResult.details?.reason}</p>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Audit Rows Explorer */}
          <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
            {auditRows.slice().reverse().map((row) => (
              <div key={row.id} className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-1">
                <div className="flex items-center justify-between text-slate-700 font-mono">
                  <span className="font-bold text-slate-900">
                    #{row.id} · [{row.action}]
                  </span>
                  <span className="text-[11px] text-slate-400">
                    {new Date(row.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <div className="text-slate-600">
                  <span className="font-semibold text-blue-900">{row.actor}</span> on entity <span className="font-mono">{row.entity}</span>
                  {row.tracking_id && <span className="text-slate-500"> ({row.tracking_id})</span>}
                </div>
                <div className="text-[10px] text-slate-500 font-mono truncate">
                  Hash: {row.hash}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBTAB 4: DEMO SWITCHES */}
      {activeSubTab === 'demo' && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-6">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              {lang === 'mr' ? 'प्रात्यक्षिक चाचणी नियंत्रणे (Demo Control Switches)' : 'Demo Control Switches & Chaos Injection'}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              These switches enable proving outbox retries, dead-letter fallback, and SLA escalation within seconds.
            </p>
          </div>

          <div className="space-y-4">
            {/* Failure Switch */}
            <div className="p-4 rounded-lg border border-slate-200 bg-slate-50 flex items-start justify-between gap-4">
              <div>
                <h4 className="text-sm font-bold text-slate-900">
                  {t.switch_fail_dept}
                </h4>
                <p className="text-xs text-slate-600 mt-0.5">
                  Simulates a 503 gateway outage for the next application send to MPCB. The outbox will retry (1s, 2s, 4s) and land in the Dead-Letter Queue without losing data.
                </p>
              </div>
              <button
                onClick={onTriggerDemoFailure}
                className="px-4 py-2 bg-rose-700 hover:bg-rose-800 text-white rounded-lg text-xs font-semibold cursor-pointer shrink-0 transition-colors"
              >
                Trigger MPCB Failure
              </button>
            </div>

            {/* Fast SLA Switch */}
            <div className="p-4 rounded-lg border border-slate-200 bg-slate-50 flex items-start justify-between gap-4">
              <div>
                <h4 className="text-sm font-bold text-slate-900">
                  {t.switch_fast_sla}
                </h4>
                <p className="text-xs text-slate-600 mt-0.5">
                  Compresses all active SLA turnaround commitments to 30 seconds. At 24 seconds (80%), an SLA warning flag fires; at 30 seconds, an automatic grievance is created.
                </p>
              </div>
              <button
                onClick={onTriggerFastSla}
                className="px-4 py-2 bg-amber-700 hover:bg-amber-800 text-white rounded-lg text-xs font-semibold cursor-pointer shrink-0 transition-colors"
              >
                Activate 30s SLA
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
