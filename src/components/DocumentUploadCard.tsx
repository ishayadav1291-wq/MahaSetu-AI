import React, { useRef, useState } from 'react';
import {
  FileText,
  UploadCloud,
  CheckCircle2,
  Trash2,
  Eye,
  RefreshCw,
  AlertCircle,
  FileCheck2,
  Image as ImageIcon,
  File,
  ShieldCheck
} from 'lucide-react';
import { DepartmentDocumentRequirement } from '../types';

export interface UploadedDocMeta {
  uploaded: boolean;
  fileName: string;
  fileSize?: string;
  fileType?: string;
  dataUrl?: string;
  verified: boolean;
  uploadedAt?: string;
}

interface DocumentUploadCardProps {
  doc: DepartmentDocumentRequirement;
  uploadedMeta?: UploadedDocMeta;
  onUpload: (docId: string, meta: UploadedDocMeta) => void;
  onRemove: (docId: string) => void;
  onPreview: (doc: DepartmentDocumentRequirement, meta: UploadedDocMeta) => void;
  lang: 'en' | 'mr';
}

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

export const DocumentUploadCard: React.FC<DocumentUploadCardProps> = ({
  doc,
  uploadedMeta,
  onUpload,
  onRemove,
  onPreview,
  lang,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const isUploaded = uploadedMeta?.uploaded;

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const processFile = (file: File) => {
    setUploadError(null);

    // Validate type (PDF or JPG/JPEG/PNG)
    const validExtensions = ['.pdf', '.jpg', '.jpeg', '.png'];
    const lowerName = file.name.toLowerCase();
    const isExtensionValid = validExtensions.some(ext => lowerName.endsWith(ext));
    const isMimeValid = file.type === 'application/pdf' || file.type.startsWith('image/');

    if (!isExtensionValid && !isMimeValid) {
      setUploadError(
        lang === 'mr'
          ? 'फक्त PDF किंवा JPG/PNG फॉरमॅटमधील फाईल्स स्वीकारल्या जातात.'
          : 'Invalid file format. Only PDF and JPG/PNG documents are accepted.'
      );
      return;
    }

    // Validate size (max 10MB)
    if (file.size > MAX_FILE_SIZE_BYTES) {
      setUploadError(
        lang === 'mr'
          ? 'फाईलचा आकार १० MB पेक्षा जास्त नसावा. कृपया कमी आकाराची फाईल निवडा.'
          : 'File exceeds 10 MB limit. Please compress or choose a smaller file.'
      );
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const resultDataUrl = reader.result as string;
      onUpload(doc.doc_id, {
        uploaded: true,
        fileName: file.name,
        fileSize: formatFileSize(file.size),
        fileType: file.type || (lowerName.endsWith('.pdf') ? 'application/pdf' : 'image/jpeg'),
        dataUrl: resultDataUrl,
        verified: true,
        uploadedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
    };
    reader.onerror = () => {
      setUploadError(lang === 'mr' ? 'फाईल वाचताना त्रुटी आली.' : 'Error reading file.');
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleAttachSample = () => {
    setUploadError(null);
    onUpload(doc.doc_id, {
      uploaded: true,
      fileName: doc.sample_file_name,
      fileSize: '1.4 MB',
      fileType: doc.mime_type || 'application/pdf',
      verified: true,
      uploadedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
  };

  const isPdf = uploadedMeta?.fileName?.toLowerCase().endsWith('.pdf') || uploadedMeta?.fileType === 'application/pdf';

  return (
    <div
      className={`p-3.5 rounded-lg border transition-all ${
        isUploaded
          ? 'bg-emerald-50/30 border-emerald-200/90'
          : isDragging
          ? 'bg-blue-50/60 border-blue-400 ring-2 ring-blue-200'
          : 'bg-white border-slate-200 hover:border-slate-300'
      }`}
    >
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
        className="hidden"
      />

      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        
        {/* Document Information */}
        <div className="space-y-1 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-bold text-xs text-slate-900">
              {lang === 'mr' ? doc.doc_name_mr : doc.doc_name_en}
            </span>
            {doc.is_mandatory ? (
              <span className="text-[10px] font-semibold text-rose-700 bg-rose-50 border border-rose-200 px-1.5 py-0.2 rounded">
                {lang === 'mr' ? '*अनिवार्य' : '*Mandatory'}
              </span>
            ) : (
              <span className="text-[10px] font-medium text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded">
                {lang === 'mr' ? 'ऐच्छिक' : 'Optional'}
              </span>
            )}
            <span className="text-[10px] text-slate-500 font-mono">
              ID: {doc.doc_id}
            </span>
          </div>

          <p className="text-[11px] text-slate-600 leading-relaxed">
            {lang === 'mr' ? doc.description_mr : doc.description_en}
          </p>

          <div className="flex items-center gap-2 text-[10px] text-slate-500 pt-0.5">
            <span className="font-semibold text-slate-700">
              {lang === 'mr' ? 'कायदेशीर आधार:' : 'Legal Basis:'}
            </span>
            <span>{doc.legal_basis}</span>
          </div>

          {/* Validation Error Message */}
          {uploadError && (
            <div className="flex items-center gap-1.5 text-[11px] text-rose-700 bg-rose-50 border border-rose-200 p-2 rounded mt-1.5">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{uploadError}</span>
            </div>
          )}
        </div>

        {/* Upload State & Actions */}
        <div className="sm:text-right shrink-0">
          {isUploaded ? (
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-white border border-emerald-300 shadow-2xs">
                {isPdf ? (
                  <span className="px-1.5 py-0.5 rounded bg-rose-100 text-rose-800 text-[9px] font-bold uppercase font-mono">
                    PDF
                  </span>
                ) : (
                  <span className="px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 text-[9px] font-bold uppercase font-mono">
                    JPG
                  </span>
                )}
                <span className="text-xs font-semibold text-slate-800 max-w-[150px] sm:max-w-[180px] truncate block" title={uploadedMeta.fileName}>
                  {uploadedMeta.fileName}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  {uploadedMeta.fileSize || '1.4 MB'}
                </span>
              </div>

              <div className="flex items-center sm:justify-end gap-1.5 text-xs">
                <button
                  type="button"
                  onClick={() => onPreview(doc, uploadedMeta)}
                  className="px-2 py-1 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded text-[11px] font-medium flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                  title="Preview Document"
                >
                  <Eye className="w-3.5 h-3.5 text-slate-500" />
                  <span>{lang === 'mr' ? 'पहा' : 'Preview'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-2 py-1 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded text-[11px] font-medium flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                  title="Replace Document"
                >
                  <RefreshCw className="w-3 h-3 text-slate-500" />
                  <span>{lang === 'mr' ? 'बदला' : 'Replace'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => onRemove(doc.doc_id)}
                  className="p-1 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded cursor-pointer transition-colors"
                  title="Remove Document"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="flex items-center sm:justify-end gap-1 text-[10px] text-emerald-700 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>{lang === 'mr' ? 'कागदपत्र संलग्न व पडताळले' : 'Attached & Validated'}</span>
              </div>
            </div>
          ) : (
            <div className="space-y-1.5">
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-lg p-2.5 text-center cursor-pointer transition-all ${
                  isDragging
                    ? 'border-blue-500 bg-blue-50/80'
                    : 'border-slate-300 hover:border-blue-900/60 bg-slate-50/50 hover:bg-blue-50/30'
                }`}
              >
                <div className="flex items-center justify-center gap-1.5 text-blue-900 font-semibold text-xs">
                  <UploadCloud className="w-4 h-4" />
                  <span>{lang === 'mr' ? 'अपलोड करा' : 'Upload File'}</span>
                </div>
                <span className="text-[10px] text-slate-500 block mt-0.5">
                  PDF, JPG (Max 10MB)
                </span>
              </div>

              <div className="text-right">
                <button
                  type="button"
                  onClick={handleAttachSample}
                  className="text-[10px] text-slate-500 hover:text-blue-900 underline cursor-pointer"
                >
                  {lang === 'mr' ? 'नमुना टेम्पलेट वापरा' : 'Use Official Template'}
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
