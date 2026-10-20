import React, { useState, useEffect } from 'react';
import { Search, RefreshCw, AlertTriangle, CheckCircle2, Clock, Send, ShieldAlert, ArrowRight, X } from 'lucide-react';
import { Application, DeptTask, DerivedStatus } from '../types';
import { StatusBadge } from './StatusBadge';
import { translations } from '../i18n/translations';

interface TrackingTimelineProps {
  currentTrackingId?: string;
  lang: 'en' | 'mr';
  onNavigateToWizard: () => void;
}

export const TrackingTimeline: React.FC<TrackingTimelineProps> = ({
  currentTrackingId,
  lang,
  onNavigateToWizard,
}) => {
  const t = translations[lang];

  const [searchId, setSearchId] = useState(currentTrackingId || '');
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [loading, setLoading] = useState(false);
  const [allApps, setAllApps] = useState<Application[]>([]);
  const [timelineEvents, setTimelineEvents] = useState<any[]>([]);

  // Resubmit modal
  const [resubmitDept, setResubmitDept] = useState<string | null>(null);
  const [resubmitReason, setResubmitReason] = useState('');
  const [resubmitSuccess, setResubmitSuccess] = useState<string | null>(null);

  // Grievance modal
  const [isGrievanceOpen, setIsGrievanceOpen] = useState(false);
  const [grievanceReason, setGrievanceReason] = useState('');
  const [grievanceSuccess, setGrievanceSuccess] = useState<string | null>(null);

  // Load all applications list
  const loadApplications = async () => {
    try {
      const res = await fetch('/v1/applications?user_id=usr-ravi');
      const data = await res.json();
      if (data.applications) {
        setAllApps(data.applications);
        if (data.applications.length > 0 && !selectedApp) {
          const target = currentTrackingId
            ? data.applications.find((a: Application) => a.tracking_id === currentTrackingId)
            : data.applications[0];
          if (target) {
            setSelectedApp(target);
            setSearchId(target.tracking_id);
            fetchTimeline(target.tracking_id);
          }
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchTimeline = async (id: string) => {
    if (!id) return;
    setLoading(true);
    try {
      const res = await fetch(`/v1/applications/${id}/timeline`);
      if (res.ok) {
        const data = await res.json();
        setSelectedApp({
          ...data.application,
          derived_status: data.derived_status,
          tasks: data.tasks,
        });
        setTimelineEvents(data.timeline_events || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApplications();
  }, [currentTrackingId]);

  // Periodic polling for real-time sync
  useEffect(() => {
    const timer = setInterval(() => {
      if (selectedApp) {
        fetchTimeline(selectedApp.tracking_id);
      } else {
        loadApplications();
      }
    }, 4000);
    return () => clearInterval(timer);
  }, [selectedApp?.tracking_id]);

  // Handle single-department resubmission
  const handleResubmit = async () => {
    if (!selectedApp || !resubmitDept) return;
    try {
      const res = await fetch(`/v1/applications/${selectedApp.tracking_id}/resubmit/${resubmitDept}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          corrected_fields: { correction_note: resubmitReason },
          corrected_documents: ['revised_plan_v2.pdf'],
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setResubmitSuccess(lang === 'mr' ? data.message_mr : data.message_en);
        setTimeout(() => {
          setResubmitDept(null);
          setResubmitReason('');
          setResubmitSuccess(null);
          fetchTimeline(selectedApp.tracking_id);
        }, 2000);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Handle citizen filing grievance
  const handleFileGrievance = async () => {
    if (!selectedApp || !grievanceReason.trim()) return;
    try {
      const res = await fetch('/v1/grievances', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tracking_id: selectedApp.tracking_id,
          reason: grievanceReason,
        }),
      });
      if (res.ok) {
        setGrievanceSuccess(lang === 'mr' ? 'तक्रार यशस्वीरीत्या नोंदवली गेली.' : 'Grievance officially filed and escalated to Nodal Officer.');
        setTimeout(() => {
          setIsGrievanceOpen(false);
          setGrievanceReason('');
          setGrievanceSuccess(null);
          fetchTimeline(selectedApp.tracking_id);
        }, 2000);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 space-y-6">
      
      {/* Search & Top Action Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            {t.tracking_title}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {lang === 'mr'
              ? 'एकाच ट्रॅकिंग आयडी सह सर्व विभागांची स्थिती तपासा'
              : 'One application fans out to sovereign department systems with parallel tracking.'}
          </p>
        </div>

        {/* Search Input */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <input
              type="text"
              placeholder="e.g. MH-2026-..."
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs font-mono border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 w-48 sm:w-56"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
          </div>
          <button
            onClick={() => fetchTimeline(searchId)}
            className="px-3 py-1.5 bg-blue-900 hover:bg-blue-800 text-white rounded-lg text-xs font-semibold cursor-pointer transition-colors"
          >
            {lang === 'mr' ? 'शोधा' : 'Track'}
          </button>
          <button
            onClick={() => selectedApp && fetchTimeline(selectedApp.tracking_id)}
            disabled={loading}
            className="p-1.5 text-slate-600 hover:text-slate-900 border border-slate-300 rounded-lg hover:bg-slate-50 cursor-pointer"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Empty State */}
      {!selectedApp && (
        <div className="text-center py-16 bg-white border border-slate-200 rounded-xl p-6">
          <Clock className="w-10 h-10 text-slate-400 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-800">
            {lang === 'mr' ? 'कोणताही अर्ज सापडला नाही' : 'No Applications Found'}
          </h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            {lang === 'mr'
              ? 'नवीन अर्ज करण्यासाठी "नवीन अर्ज" बटणावर क्लिक करा.'
              : 'Submit an application through the citizen single-window wizard to start live tracking.'}
          </p>
          <button
            onClick={onNavigateToWizard}
            className="mt-4 px-4 py-2 bg-blue-900 hover:bg-blue-800 text-white text-xs font-semibold rounded-lg cursor-pointer"
          >
            + {t.btn_apply_another}
          </button>
        </div>
      )}

      {/* Selected Application Overview Card */}
      {selectedApp && (
        <div className="space-y-6">
          
          {/* Top Banner Card */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    {t.submit_tracking_id_label}
                  </span>
                  <span className="text-base font-mono font-bold text-blue-950">
                    {selectedApp.tracking_id}
                  </span>
                </div>
                <h2 className="text-lg font-bold text-slate-900 mt-1">
                  {selectedApp.project.factory_name}
                </h2>
                <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                  <span>{selectedApp.project.district}</span>
                  <span>·</span>
                  <span className="font-medium text-slate-700">{selectedApp.project.sectors && selectedApp.project.sectors.length > 0 ? selectedApp.project.sectors.join(' + ') : selectedApp.project.sector}</span>
                  <span>·</span>
                  <span>₹{selectedApp.project.investment_inr_lakhs} Lakhs</span>
                  <span>·</span>
                  <span>Submitted {new Date(selectedApp.created_at).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Derived Status Display */}
              <div className="flex flex-col items-start md:items-end gap-1.5 shrink-0">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  {t.tracking_badge_label}
                </span>
                <StatusBadge status={selectedApp.derived_status || 'in_progress'} lang={lang} size="lg" />
              </div>
            </div>

            {/* Explanatory text for derived status */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-600">
              <p>
                {selectedApp.derived_status === 'approved' && (lang === 'mr' ? 'सर्व विभागांकडून पूर्ण मंजुरी प्राप्त झाली आहे!' : 'All department clearances have been granted! You may proceed with operations.')}
                {selectedApp.derived_status === 'partly_approved' && (lang === 'mr' ? 'काही विभागांची मंजुरी मिळाली आहे, उर्वरित प्रक्रियेत आहेत.' : 'Partially approved: Some departments approved; awaiting remaining decisions.')}
                {selectedApp.derived_status === 'action_needed' && (lang === 'mr' ? 'कृती आवश्यक: एका किंवा अधिक विभागाने त्रुटी दर्शवली आहे किंवा अर्ज नाकारला आहे.' : 'Action required: One or more departments rejected or requested corrections.')}
                {selectedApp.derived_status === 'delayed' && (lang === 'mr' ? 'विलंब: गेटवे पुन्हा प्रयत्न करत आहे. प्रशासकीय पथक देखरेख करत आहे.' : 'Delayed: Department connector encountering timeout; retrying in background.')}
                {selectedApp.derived_status === 'in_progress' && (lang === 'mr' ? 'सर्व विभागांकडे अर्ज तपासणीच्या प्रक्रियेत आहे.' : 'In progress: Applications received and under statutory review.')}
              </p>

              <button
                onClick={() => setIsGrievanceOpen(true)}
                className="text-xs text-rose-700 hover:text-rose-900 underline font-medium cursor-pointer shrink-0"
              >
                {t.file_grievance}
              </button>
            </div>
          </div>

          {/* Parallel Department Cards Grid */}
          <div>
            <div className="mb-3">
              <h2 className="text-base font-bold text-slate-900">
                {t.timeline_heading}
              </h2>
              <p className="text-xs text-slate-500">
                {t.timeline_subheading}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {(selectedApp.tasks || []).map((task) => {
                const isRejectedOrMoreInfo = task.state === 'rejected' || task.state === 'more_info';
                
                return (
                  <div
                    key={task.id}
                    className={`bg-white border rounded-xl p-5 shadow-xs flex flex-col justify-between transition-all ${
                      task.state === 'approved'
                        ? 'border-emerald-200'
                        : task.state === 'rejected'
                        ? 'border-rose-300 ring-1 ring-rose-200'
                        : task.breached
                        ? 'border-amber-300'
                        : 'border-slate-200'
                    }`}
                  >
                    <div className="space-y-3">
                      
                      {/* Dept Header */}
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
                          {task.dept === 'industries' ? t.dept_industries : task.dept === 'mpcb' ? t.dept_mpcb : task.dept === 'fire' ? t.dept_fire : t.dept_labour}
                        </span>
                        <StatusBadge status={task.state} lang={lang} size="sm" />
                      </div>

                      {/* Reference code */}
                      <div className="text-xs text-slate-500 font-mono">
                        Ref: {task.dept_ref_id || 'PENDING'} · Ver: v{task.submission_version}
                      </div>

                      {/* SLA Countdown & Warning */}
                      <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-500">{t.sla_time_left}:</span>
                          <span className={`font-mono font-bold ${task.breached ? 'text-rose-700' : task.warned ? 'text-amber-700' : 'text-slate-700'}`}>
                            {task.breached ? 'EXPIRED' : `${Math.max(0, Math.round((new Date(task.sla_due).getTime() - Date.now()) / 1000))}s`}
                          </span>
                        </div>
                        {task.warned && !task.breached && (
                          <div className="text-[11px] text-amber-800 flex items-center gap-1 font-medium">
                            <AlertTriangle className="w-3 h-3 text-amber-600 shrink-0" />
                            <span>{t.sla_warning}</span>
                          </div>
                        )}
                        {task.breached && (
                          <div className="text-[11px] text-rose-800 flex items-center gap-1 font-medium">
                            <ShieldAlert className="w-3 h-3 text-rose-600 shrink-0" />
                            <span>{t.sla_breached} (Escalation Level {task.escalation_level})</span>
                          </div>
                        )}
                      </div>

                      {/* Rejection / More Info Callout if applicable */}
                      {task.decision_reason && (
                        <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-900 space-y-1">
                          <span className="font-bold block">
                            {lang === 'mr' ? 'विभागाचा शेरा:' : 'Officer Reason:'}
                          </span>
                          <p>{task.decision_reason}</p>
                        </div>
                      )}

                      {task.requested_info && (
                        <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1">
                          <span className="font-bold block">
                            {lang === 'mr' ? 'मागितलेली माहिती:' : 'Requested Documents:'}
                          </span>
                          <p>{task.requested_info}</p>
                        </div>
                      )}

                    </div>

                    {/* Resubmit button for rejected department (Canonical Story Step 11) */}
                    {isRejectedOrMoreInfo && (
                      <div className="pt-4 mt-4 border-t border-slate-100">
                        <button
                          onClick={() => setResubmitDept(task.dept)}
                          className="w-full py-2 px-3 bg-blue-900 hover:bg-blue-800 text-white rounded-lg text-xs font-semibold cursor-pointer transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>{t.btn_resubmit}</span>
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Audit & Event Trail */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-slate-900">
              {lang === 'mr' ? 'प्रणाली घटनाक्रम व नोंदी (Audit Trail)' : 'System Event & Connector Logs'}
            </h3>
            
            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {timelineEvents.map((ev) => (
                <div key={ev.id} className="text-xs p-2.5 rounded bg-slate-50 border border-slate-200 flex items-start justify-between gap-4">
                  <div>
                    <span className="font-semibold text-slate-800 font-mono">[{ev.action}]</span>
                    <span className="text-slate-500 ml-2">by {ev.actor}</span>
                    {ev.details?.reason && (
                      <p className="text-slate-600 mt-0.5">{ev.details.reason}</p>
                    )}
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono shrink-0">
                    {new Date(ev.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* Resubmit Modal */}
      {resubmitDept && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                {t.resubmit_modal_title}
              </h3>
              <button
                onClick={() => setResubmitDept(null)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600">
              {t.resubmit_modal_desc}
            </p>

            {resubmitSuccess && (
              <div className="p-3 rounded bg-emerald-50 text-emerald-800 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{resubmitSuccess}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {lang === 'mr' ? 'दुरुस्तीचा तपशील / स्पष्टीकरण' : 'Clarification / Rectification Note'}
              </label>
              <textarea
                rows={3}
                value={resubmitReason}
                onChange={(e) => setResubmitReason(e.target.value)}
                placeholder={lang === 'mr' ? 'उदा. सुधारित स्प्रिंकलर व आपत्कालीन मार्ग नकाशा जोडला आहे...' : 'e.g. Revised hydraulic sprinkler layout attached per CFO guidelines...'}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setResubmitDept(null)}
                className="px-4 py-2 text-xs text-slate-600 hover:text-slate-900 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleResubmit}
                className="px-4 py-2 bg-blue-900 hover:bg-blue-800 text-white rounded-lg text-xs font-semibold cursor-pointer"
              >
                {t.btn_confirm_resubmit}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Grievance Modal */}
      {isGrievanceOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                {lang === 'mr' ? 'शासकीय तक्रार नोंदणी' : 'File Official Delay Grievance'}
              </h3>
              <button
                onClick={() => setIsGrievanceOpen(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600">
              {lang === 'mr'
                ? 'महाराष्ट्र लोकसेवा हक्क अधिनियमानुसार वेळेत निर्णय न मिळाल्यास तक्रार थेट नोडल अधिकाऱ्यांकडे पोहोचते.'
                : 'Under the Maharashtra Right to Public Services Act, unaddressed delays escalate to the Nodal Monitoring Cell.'}
            </p>

            {grievanceSuccess && (
              <div className="p-3 rounded bg-emerald-50 text-emerald-800 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{grievanceSuccess}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {lang === 'mr' ? 'तक्रारीचे कारण' : 'Grievance Description'}
              </label>
              <textarea
                rows={3}
                value={grievanceReason}
                onChange={(e) => setGrievanceReason(e.target.value)}
                placeholder={lang === 'mr' ? 'विहित मुदतीत निर्णय न मिळाल्यामुळे तक्रार...' : 'Turnaround target SLA breached without official intimation...'}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setIsGrievanceOpen(false)}
                className="px-4 py-2 text-xs text-slate-600 hover:text-slate-900 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleFileGrievance}
                className="px-4 py-2 bg-rose-700 hover:bg-rose-800 text-white rounded-lg text-xs font-semibold cursor-pointer"
              >
                {lang === 'mr' ? 'तक्रार दाखल करा' : 'Submit Grievance'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
