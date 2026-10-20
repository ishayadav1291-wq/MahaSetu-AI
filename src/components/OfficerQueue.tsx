import React, { useState, useEffect } from 'react';
import { CheckCircle2, XCircle, HelpCircle, AlertTriangle, Clock, RefreshCw, X, ShieldAlert, ArrowRight } from 'lucide-react';
import { DeptTask, Department } from '../types';
import { StatusBadge } from './StatusBadge';
import { translations } from '../i18n/translations';

interface OfficerQueueProps {
  department?: Department;
  officerName?: string;
  lang: 'en' | 'mr';
}

export const OfficerQueue: React.FC<OfficerQueueProps> = ({
  department = 'industries',
  officerName,
  lang,
}) => {
  const t = translations[lang];

  const [selectedDept, setSelectedDept] = useState<Department>(department);
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [filterState, setFilterState] = useState<'all' | 'pending'>('pending');
  const [selectedTask, setSelectedTask] = useState<any | null>(null);

  const deptProfiles: Record<Department, { name_en: string; name_mr: string; officer_en: string; officer_mr: string }> = {
    industries: {
      name_en: 'Industries (MIDC)',
      name_mr: 'उद्योग (MIDC)',
      officer_en: 'Shri A. K. Deshmukh (Desk Officer)',
      officer_mr: 'श्री ए. के. देशमुख (डेस्क अधिकारी)',
    },
    mpcb: {
      name_en: 'Pollution Control (MPCB)',
      name_mr: 'प्रदूषण नियंत्रण (MPCB)',
      officer_en: 'Dr. Sunita Kulkarni (Sub-Regional Officer)',
      officer_mr: 'डॉ. सुनिता कुलकर्णी (उपप्रादेशिक अधिकारी)',
    },
    fire: {
      name_en: 'Fire Services',
      name_mr: 'अग्निशमन सेवा',
      officer_en: 'Chief Fire Officer S. Shinde',
      officer_mr: 'मुख्य अग्निशमन अधिकारी एस. शिंदे',
    },
    labour: {
      name_en: 'Labour (DISH)',
      name_mr: 'कामगार विभाग (DISH)',
      officer_en: 'Inspector V. R. Pawar (Factory Inspector)',
      officer_mr: 'निरीक्षक व्ही. आर. पवार (कारखाना निरीक्षक)',
    },
  };

  // Decision Modal State
  const [decisionType, setDecisionType] = useState<'approved' | 'rejected' | 'more_info'>('approved');
  const [decisionReason, setDecisionReason] = useState('');
  const [requestedInfo, setRequestedInfo] = useState('');
  const [decisionError, setDecisionError] = useState<string | null>(null);
  const [submittingDecision, setSubmittingDecision] = useState(false);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/v1/officer/tasks?department=${selectedDept}`);
      const data = await res.json();
      if (data.tasks) {
        setTasks(data.tasks);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
    const interval = setInterval(fetchTasks, 3000);
    return () => clearInterval(interval);
  }, [selectedDept]);

  const handleDecision = async () => {
    if (!selectedTask) return;
    setDecisionError(null);

    if (decisionType === 'rejected' && !decisionReason.trim()) {
      setDecisionError(lang === 'mr' ? 'अर्ज नाकारण्यासाठी कारण देणे अनिवार्य आहे.' : 'A valid reason is strictly required to reject an application.');
      return;
    }

    setSubmittingDecision(true);
    try {
      const res = await fetch(`/v1/officer/tasks/${selectedTask.id}/decision`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          decision: decisionType,
          reason: decisionReason,
          requested_info: requestedInfo,
          officer_name: officerName,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setDecisionError(data.error?.message_en || 'Failed to submit decision.');
        return;
      }

      setSelectedTask(null);
      setDecisionReason('');
      setRequestedInfo('');
      fetchTasks();
    } catch (e) {
      setDecisionError('Network error recording decision.');
    } finally {
      setSubmittingDecision(false);
    }
  };

  const filteredTasks = tasks.filter((t) => {
    if (filterState === 'pending') {
      return !['approved', 'rejected'].includes(t.state);
    }
    return true;
  });

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 space-y-6">
      
      {/* Department Selector Tabs */}
      <div className="flex items-center gap-1.5 p-1.5 bg-slate-100 rounded-lg overflow-x-auto no-scrollbar">
        {(['industries', 'mpcb', 'fire', 'labour'] as Department[]).map((d) => (
          <button
            key={d}
            onClick={() => setSelectedDept(d)}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer whitespace-nowrap ${
              selectedDept === d
                ? 'bg-blue-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            {lang === 'mr' ? deptProfiles[d].name_mr : deptProfiles[d].name_en}
          </button>
        ))}
      </div>

      {/* Queue Header Strip */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              {lang === 'mr' ? deptProfiles[selectedDept].name_mr : deptProfiles[selectedDept].name_en}
            </h1>
            <span className="text-xs font-mono font-semibold uppercase px-2 py-0.5 bg-blue-100 text-blue-900 rounded">
              {selectedDept.toUpperCase()}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            {lang === 'mr' ? deptProfiles[selectedDept].officer_mr : deptProfiles[selectedDept].officer_en} · {t.officer_subheading}
          </p>
        </div>

        {/* Filters and Refresh */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
            <button
              onClick={() => setFilterState('pending')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                filterState === 'pending'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t.filter_pending}
            </button>
            <button
              onClick={() => setFilterState('all')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                filterState === 'all'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t.filter_all}
            </button>
          </div>

          <button
            onClick={fetchTasks}
            disabled={loading}
            className="p-2 text-slate-600 hover:text-slate-900 border border-slate-300 rounded-lg hover:bg-slate-50 cursor-pointer"
            title="Refresh Queue"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Task Queue Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        {filteredTasks.length === 0 ? (
          <div className="text-center py-12 text-slate-500 text-xs">
            {lang === 'mr' ? 'या विभागात सध्या कोणतीही प्रलंबित कामे नाहीत.' : 'No pending tasks in this department queue.'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                <tr>
                  <th className="px-4 py-3">{t.queue_col_tracking}</th>
                  <th className="px-4 py-3">{t.queue_col_factory}</th>
                  <th className="px-4 py-3">{t.queue_col_sla}</th>
                  <th className="px-4 py-3">{t.queue_col_risk}</th>
                  <th className="px-4 py-3 text-right">{t.queue_col_actions}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredTasks.map((task) => {
                  return (
                    <tr key={task.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="px-4 py-3 font-mono font-bold text-blue-950">
                        {task.tracking_id}
                        <span className="block text-[10px] font-normal text-slate-400 font-mono">
                          v{task.submission_version}
                        </span>
                      </td>

                      <td className="px-4 py-3">
                        <span className="font-semibold text-slate-900 block">
                          {task.application?.project?.factory_name || 'Enterprise Unit'}
                        </span>
                        <span className="text-slate-500 text-[11px]">
                          {task.application?.project?.district} · {task.application?.project?.sector}
                        </span>
                      </td>

                      <td className="px-4 py-3 font-mono">
                        <span className={`font-bold ${task.breached ? 'text-rose-600' : task.warned ? 'text-amber-600' : 'text-slate-700'}`}>
                          {task.breached ? '00:00 (BREACHED)' : `${task.remaining_seconds}s`}
                        </span>
                      </td>

                      <td className="px-4 py-3">
                        {task.risk_label === 'Breached' && (
                          <span className="inline-flex items-center gap-1 text-rose-800 font-semibold">
                            <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
                            <span>Breached</span>
                          </span>
                        )}
                        {task.risk_label === 'At Risk (80%)' && (
                          <span className="inline-flex items-center gap-1 text-amber-800 font-semibold">
                            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                            <span>At Risk (80%)</span>
                          </span>
                        )}
                        {task.risk_label === 'Nominal' && (
                          <span className="inline-flex items-center gap-1 text-emerald-800 font-medium">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Nominal</span>
                          </span>
                        )}
                      </td>

                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => {
                            setSelectedTask(task);
                            setDecisionType('approved');
                            setDecisionReason('');
                          }}
                          className="px-3 py-1.5 bg-blue-900 hover:bg-blue-800 text-white rounded text-xs font-semibold transition-colors cursor-pointer"
                        >
                          {t.btn_review}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Decision Modal */}
      {selectedTask && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {t.modal_decision_title}
                </h3>
                <span className="text-xs font-mono text-slate-500">
                  {selectedTask.tracking_id} · {selectedTask.dept.toUpperCase()}
                </span>
              </div>
              <button
                onClick={() => setSelectedTask(null)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Projected Fields Section (Field projection: Officer sees only relevant info) */}
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs space-y-1.5">
              <span className="font-bold text-slate-700 block uppercase tracking-wider text-[10px]">
                {lang === 'mr' ? 'विभागास प्राप्त झालेली माहिती (Projected Fields)' : 'Projected Department Payload'}
              </span>
              <p><span className="font-semibold">Unit:</span> {selectedTask.application?.project?.factory_name}</p>
              <p><span className="font-semibold">Plot Location:</span> {selectedTask.application?.project?.plot_address}</p>
              <p><span className="font-semibold">Workforce:</span> {selectedTask.application?.project?.worker_count} workers</p>
              <p><span className="font-semibold">Capital:</span> ₹{selectedTask.application?.project?.investment_inr_lakhs} Lakhs</p>
              <p><span className="font-semibold">Power:</span> {selectedTask.application?.project?.power_kw} KW</p>
            </div>

            {/* Department Submitted Documents */}
            {selectedTask.application?.project?.documents_submitted && (
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs space-y-2">
                <span className="font-bold text-slate-700 block uppercase tracking-wider text-[10px]">
                  {lang === 'mr' ? 'संलग्न शासकीय कागदपत्रे (Uploaded Documents)' : 'Submitted Documents for Clearance'}
                </span>
                <div className="space-y-1.5">
                  {selectedTask.application.project.documents_submitted
                    .filter((d: any) => d.department === selectedDept)
                    .map((d: any, idx: number) => (
                      <div key={idx} className="flex items-center justify-between p-2 rounded bg-white border border-slate-200">
                        <div className="flex items-center gap-2">
                          <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold font-mono uppercase ${
                            d.file_name?.toLowerCase().endsWith('.pdf') ? 'bg-rose-100 text-rose-800' : 'bg-blue-100 text-blue-800'
                          }`}>
                            {d.file_name?.toLowerCase().endsWith('.pdf') ? 'PDF' : 'JPG'}
                          </span>
                          <div>
                            <p className="font-semibold text-slate-900">{d.doc_name}</p>
                            <p className="text-[10px] text-slate-500 font-mono">{d.file_name} {d.file_size ? `· ${d.file_size}` : ''}</p>
                          </div>
                        </div>
                        <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-medium">
                          ✓ Verified
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {decisionError && (
              <div className="p-2.5 rounded bg-rose-50 text-rose-800 text-xs border border-rose-200">
                {decisionError}
              </div>
            )}

            {/* Decision Type Tabs */}
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-700">
                {lang === 'mr' ? 'निर्णय निवडा' : 'Select Officer Action'}
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setDecisionType('approved')}
                  className={`py-2 px-2 text-xs font-semibold rounded border cursor-pointer text-center ${
                    decisionType === 'approved'
                      ? 'bg-emerald-600 text-white border-emerald-700'
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  ✓ {t.decision_approve}
                </button>
                <button
                  type="button"
                  onClick={() => setDecisionType('rejected')}
                  className={`py-2 px-2 text-xs font-semibold rounded border cursor-pointer text-center ${
                    decisionType === 'rejected'
                      ? 'bg-rose-600 text-white border-rose-700'
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  ✕ {t.decision_reject}
                </button>
                <button
                  type="button"
                  onClick={() => setDecisionType('more_info')}
                  className={`py-2 px-2 text-xs font-semibold rounded border cursor-pointer text-center ${
                    decisionType === 'more_info'
                      ? 'bg-amber-600 text-white border-amber-700'
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  ? {t.decision_more_info}
                </button>
              </div>
            </div>

            {/* Reason Field */}
            {decisionType !== 'approved' && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {decisionType === 'rejected' ? (lang === 'mr' ? 'नाकारण्याचे कारण (अनिवार्य)' : 'Rejection Reason (Mandatory)') : (lang === 'mr' ? 'अपेक्षित माहिती' : 'Additional Information Required')}
                </label>
                <textarea
                  rows={3}
                  value={decisionReason}
                  onChange={(e) => setDecisionReason(e.target.value)}
                  placeholder={
                    decisionType === 'rejected'
                      ? (lang === 'mr' ? 'उदा. स्प्रिंकलर यंत्रणा आणि आपत्कालीन मार्ग नकाशात त्रुटी...' : 'e.g. Fire sprinkler capacity inadequate for moderate industrial category...')
                      : (lang === 'mr' ? 'उदा. महावितरण वीज जोडणीचे अधिकृत पत्र जोडावे...' : 'e.g. Please provide sanctioned power connection agreement...')
                  }
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900"
                />
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setSelectedTask(null)}
                className="px-4 py-2 text-xs text-slate-600 hover:text-slate-900 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDecision}
                disabled={submittingDecision}
                className="px-5 py-2 bg-blue-900 hover:bg-blue-800 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
              >
                {submittingDecision ? 'Saving...' : 'Confirm Decision'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
