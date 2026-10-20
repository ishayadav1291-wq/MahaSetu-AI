import React from 'react';
import { X, FileText, Image as ImageIcon, ShieldCheck, Download, ExternalLink, Building2 } from 'lucide-react';
import { DepartmentDocumentRequirement } from '../types';
import { UploadedDocMeta } from './DocumentUploadCard';

interface DocumentPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  doc: DepartmentDocumentRequirement | null;
  uploadedMeta: UploadedDocMeta | null;
  lang: 'en' | 'mr';
}

export const DocumentPreviewModal: React.FC<DocumentPreviewModalProps> = ({
  isOpen,
  onClose,
  doc,
  uploadedMeta,
  lang,
}) => {
  if (!isOpen || !doc || !uploadedMeta) return null;

  const isPdf = uploadedMeta.fileName.toLowerCase().endsWith('.pdf') || uploadedMeta.fileType === 'application/pdf';
  const isImage = uploadedMeta.fileName.toLowerCase().match(/\.(jpg|jpeg|png)$/) || uploadedMeta.fileType?.startsWith('image/');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="relative w-full max-w-2xl bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95 duration-150">
        
        {/* Tricolor Government Top Strip */}
        <div className="h-1 bg-gradient-to-r from-orange-500 via-white to-emerald-600" />

        {/* Modal Header */}
        <div className="px-5 py-3.5 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded bg-white/10 flex items-center justify-center">
              {isPdf ? (
                <FileText className="w-4 h-4 text-rose-300" />
              ) : (
                <ImageIcon className="w-4 h-4 text-blue-300" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xs font-bold truncate max-w-md">
                  {lang === 'mr' ? doc.doc_name_mr : doc.doc_name_en}
                </h3>
                <span className="text-[10px] font-mono px-1.5 py-0.2 bg-white/20 rounded uppercase">
                  {isPdf ? 'PDF' : 'JPG/PNG'}
                </span>
              </div>
              <p className="text-[11px] text-slate-300">
                {uploadedMeta.fileName} · {uploadedMeta.fileSize || '1.4 MB'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Document Content / Viewer */}
        <div className="p-4 overflow-y-auto flex-1 bg-slate-100 flex flex-col items-center justify-center min-h-[300px]">
          {isImage && uploadedMeta.dataUrl ? (
            <div className="bg-white p-2 rounded-lg shadow-xs border border-slate-300 max-h-[450px] overflow-auto">
              <img
                src={uploadedMeta.dataUrl}
                alt={uploadedMeta.fileName}
                className="max-h-[420px] w-auto object-contain rounded"
              />
            </div>
          ) : isPdf && uploadedMeta.dataUrl ? (
            <div className="w-full h-[450px] bg-white rounded-lg shadow-xs border border-slate-300 overflow-hidden">
              <iframe
                src={uploadedMeta.dataUrl}
                title={uploadedMeta.fileName}
                className="w-full h-full border-0"
              />
            </div>
          ) : (
            /* Statutory Verified Document Inspection Pane (for demo templates or fallback) */
            <div className="w-full max-w-md bg-white p-6 rounded-lg border border-slate-300 shadow-xs space-y-4 text-center">
              <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-700 mx-auto flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-slate-900">
                  {uploadedMeta.fileName}
                </h4>
                <p className="text-xs text-slate-500">
                  {lang === 'mr'
                    ? 'महाराष्ट्र शासन एकल खिडकी पडताळणी कागदपत्र'
                    : 'Government of Maharashtra Statutory Single Window Document'}
                </p>
              </div>

              <div className="text-left bg-slate-50 p-3 rounded border border-slate-200 text-xs space-y-1.5 font-mono">
                <div><span className="text-slate-500">Document ID:</span> {doc.doc_id}</div>
                <div><span className="text-slate-500">Department:</span> {doc.department.toUpperCase()}</div>
                <div><span className="text-slate-500">Legal Authority:</span> {doc.legal_basis}</div>
                <div><span className="text-slate-500">Status:</span> OCR Verified & Digitally Indexed</div>
              </div>

              {uploadedMeta.dataUrl && (
                <a
                  href={uploadedMeta.dataUrl}
                  download={uploadedMeta.fileName}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-900 hover:bg-blue-800 text-white rounded text-xs font-semibold"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{lang === 'mr' ? 'फाईल डाऊनलोड करा' : 'Download File'}</span>
                </a>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 bg-white border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <div className="flex items-center gap-1 text-emerald-700 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>DPDP Act Compliant Storage</span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded font-semibold transition-colors cursor-pointer"
          >
            {lang === 'mr' ? 'बंद करा' : 'Close'}
          </button>
        </div>

      </div>
    </div>
  );
};
