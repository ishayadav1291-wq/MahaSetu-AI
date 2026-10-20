import React from 'react';
import { CheckCircle2, Clock, AlertTriangle, Hourglass, FileEdit, CircleSlash } from 'lucide-react';
import { DerivedStatus, TaskState } from '../types';
import { translations } from '../i18n/translations';

interface StatusBadgeProps {
  status: DerivedStatus | TaskState;
  lang?: 'en' | 'mr';
  size?: 'sm' | 'md' | 'lg';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, lang = 'en', size = 'md' }) => {
  const t = translations[lang];

  // Resolve label & icon
  let label = '';
  let icon = <Hourglass className="w-4 h-4 text-slate-600" />;
  let colorClass = 'text-slate-700 bg-slate-100 border-slate-300';

  switch (status) {
    case 'approved':
      label = t.status_approved;
      icon = <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />;
      colorClass = 'text-emerald-800 bg-emerald-50/80 border-emerald-300';
      break;
    case 'partly_approved':
      label = t.status_partly_approved;
      icon = <CircleSlash className="w-4 h-4 text-blue-600 shrink-0" />;
      colorClass = 'text-blue-800 bg-blue-50/80 border-blue-300';
      break;
    case 'action_needed':
      label = t.status_action_needed;
      icon = <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />;
      colorClass = 'text-amber-900 bg-amber-50/80 border-amber-300';
      break;
    case 'delayed':
      label = t.status_delayed;
      icon = <Clock className="w-4 h-4 text-rose-600 shrink-0" />;
      colorClass = 'text-rose-900 bg-rose-50/80 border-rose-300';
      break;
    case 'in_progress':
      label = t.status_in_progress;
      icon = <Hourglass className="w-4 h-4 text-indigo-600 shrink-0" />;
      colorClass = 'text-indigo-900 bg-indigo-50/80 border-indigo-300';
      break;
    case 'draft':
      label = t.status_draft;
      icon = <FileEdit className="w-4 h-4 text-slate-600 shrink-0" />;
      colorClass = 'text-slate-700 bg-slate-100 border-slate-300';
      break;
    // Task States
    case 'submitted':
      label = t.task_submitted;
      icon = <Clock className="w-4 h-4 text-slate-600 shrink-0" />;
      colorClass = 'text-slate-800 bg-slate-100 border-slate-300';
      break;
    case 'received':
      label = t.task_received;
      icon = <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />;
      colorClass = 'text-teal-800 bg-teal-50 border-teal-300';
      break;
    case 'in_review':
      label = t.task_in_review;
      icon = <Hourglass className="w-4 h-4 text-blue-600 shrink-0" />;
      colorClass = 'text-blue-900 bg-blue-50 border-blue-300';
      break;
    case 'rejected':
      label = t.task_rejected;
      icon = <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />;
      colorClass = 'text-rose-900 bg-rose-50 border-rose-300';
      break;
    case 'more_info':
      label = t.task_more_info;
      icon = <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />;
      colorClass = 'text-amber-900 bg-amber-50 border-amber-300';
      break;
    case 'dead_letter':
      label = t.task_dead_letter;
      icon = <Clock className="w-4 h-4 text-red-600 shrink-0" />;
      colorClass = 'text-red-900 bg-red-50 border-red-300';
      break;
    default:
      label = status;
  }

  const sizeClass = size === 'sm' ? 'text-xs px-2 py-0.5 gap-1.5' : size === 'lg' ? 'text-sm px-3.5 py-1.5 gap-2 font-medium' : 'text-xs px-2.5 py-1 gap-1.5 font-medium';

  return (
    <span className={`inline-flex items-center rounded border ${colorClass} ${sizeClass} whitespace-nowrap`}>
      {icon}
      <span>{label}</span>
    </span>
  );
};
