import React, { useState, useEffect } from 'react';
import {
  CheckCircle,
  AlertTriangle,
  FileText,
  ArrowRight,
  ShieldCheck,
  Copy,
  Building2,
  Send,
  ExternalLink,
  ChevronDown,
  Check,
  FileCheck2,
  UploadCloud,
  Eye,
  CheckCircle2,
  Sparkles,
  Paperclip
} from 'lucide-react';
import { ApprovalRule, Application, SectorId, SectorDefinition, DepartmentDocumentRequirement, UserSession } from '../types';
import { translations } from '../i18n/translations';
import {
  SECTOR_CATALOG,
  getDepartmentDocumentsForSector,
  getSectorDefinition
} from '../data/sectorsAndDocuments';
import {
  getSectorLegalChecklist,
  getSectorApprovalRules
} from '../data/sectorLegalChecklists';
import { DocumentUploadCard, UploadedDocMeta } from './DocumentUploadCard';
import { DocumentPreviewModal } from './DocumentPreviewModal';

interface CitizenWizardProps {
  lang: 'en' | 'mr';
  onApplicationCreated: (app: Application) => void;
  onOpenTracking: (trackingId: string) => void;
  userSession?: UserSession | null;
}

export const CitizenWizard: React.FC<CitizenWizardProps> = ({
  lang,
  onApplicationCreated,
  onOpenTracking,
  userSession,
}) => {
  const t = translations[lang];

  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<{ en: string; mr: string } | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    factory_name: userSession?.enterprise || 'Shree Ganesh Precision Engineering Works',
    district: userSession?.district || 'Pune',
    taluka: 'Haveli / Khed',
    size: (userSession?.scale as 'Micro' | 'Small' | 'Medium') || 'Small',
    business_sector: ((userSession?.sector as SectorId) || 'manufacturing_engineering') as SectorId,
    worker_count: 24,
    investment_inr_lakhs: 145,
    plot_address: 'Plot 14, MIDC Industrial Area, Phase II, Chakan, Pune - 410501',
    power_kw: 65,
  });

  // Sync form data whenever a user logs in or registers
  useEffect(() => {
    if (userSession) {
      setFormData(prev => ({
        ...prev,
        factory_name: userSession.enterprise || prev.factory_name,
        district: userSession.district || prev.district,
        business_sector: (userSession.sector as SectorId) || prev.business_sector,
        size: (userSession.scale as any) || prev.size
      }));
    }
  }, [userSession]);

  // Approvals & Rules
  const [approvals, setApprovals] = useState<ApprovalRule[]>([]);

  // Synthetic Document Pre-check State
  const [idAddress, setIdAddress] = useState('Plot 14, MIDC Industrial Area, Phase II, Chakan, Pune - 410501');
  const [utilityAddress, setUtilityAddress] = useState('Plot 41, Hadapsar Industrial Estate, Pune - 411028');
  const [addressMismatchResolved, setAddressMismatchResolved] = useState(false);

  // Uploaded documents tracking (PDF, JPG, PNG)
  const [uploadedDocs, setUploadedDocs] = useState<Record<string, UploadedDocMeta>>({});

  // Document Preview Modal State
  const [previewDoc, setPreviewDoc] = useState<DepartmentDocumentRequirement | null>(null);
  const [previewMeta, setPreviewMeta] = useState<UploadedDocMeta | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const bulkFileInputRef = React.useRef<HTMLInputElement>(null);

  // Consents per department
  const [consents, setConsents] = useState<Record<string, boolean>>({
    industries: true,
    mpcb: true,
    fire: true,
    labour: true,
  });

  // Submitted Application result
  const [createdApp, setCreatedApp] = useState<Application | null>(null);
  const [copiedId, setCopiedId] = useState(false);

  // Active sector definition, required documents, and legal compliance checklist
  const activeSector: SectorDefinition = getSectorDefinition(formData.business_sector);
  const departmentDocs = getDepartmentDocumentsForSector(formData.business_sector);
  const allDepartmentDocsList = Object.values(departmentDocs).flat();
  const totalRequiredDocs = allDepartmentDocsList.length;
  const activeLegalChecklist = getSectorLegalChecklist(formData.business_sector);

  // Initialize uploaded docs state whenever sector changes
  useEffect(() => {
    const initialMap: Record<string, UploadedDocMeta> = {};
    Object.values(departmentDocs).flat().forEach((doc) => {
      initialMap[doc.doc_id] = {
        uploaded: true,
        fileName: doc.sample_file_name,
        fileSize: '1.4 MB',
        fileType: doc.mime_type || 'application/pdf',
        verified: true,
        uploadedAt: 'Sample'
      };
    });
    setUploadedDocs(initialMap);
  }, [formData.business_sector]);

  const handleDocUpload = (docId: string, meta: UploadedDocMeta) => {
    setUploadedDocs(prev => ({ ...prev, [docId]: meta }));
  };

  const handleDocRemove = (docId: string) => {
    setUploadedDocs(prev => ({
      ...prev,
      [docId]: {
        uploaded: false,
        fileName: '',
        verified: false,
      }
    }));
  };

  const handleDocPreview = (doc: DepartmentDocumentRequirement, meta: UploadedDocMeta) => {
    setPreviewDoc(doc);
    setPreviewMeta(meta);
    setIsPreviewOpen(true);
  };

  const handleAttachAllSamples = () => {
    const allMap: Record<string, UploadedDocMeta> = {};
    allDepartmentDocsList.forEach((doc) => {
      allMap[doc.doc_id] = {
        uploaded: true,
        fileName: doc.sample_file_name,
        fileSize: '1.4 MB',
        fileType: doc.mime_type || 'application/pdf',
        verified: true,
        uploadedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
    });
    setUploadedDocs(allMap);
  };

  const handleBulkUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const files = Array.from(e.target.files);

    files.forEach((file) => {
      const lowerName = file.name.toLowerCase();
      // Match with document by ID or filename hint
      let targetDoc = allDepartmentDocsList.find(d =>
        lowerName.includes(d.doc_id.toLowerCase()) ||
        lowerName.includes(d.sample_file_name.toLowerCase().replace('.pdf', '').replace('.jpg', ''))
      );

      if (!targetDoc) {
        // Find first doc that isn't uploaded yet
        targetDoc = allDepartmentDocsList.find(d => !uploadedDocs[d.doc_id]?.uploaded);
      }

      if (targetDoc) {
        const docId = targetDoc.doc_id;
        const reader = new FileReader();
        reader.onload = () => {
          const formatSize = (bytes: number) => {
            if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
            return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
          };
          setUploadedDocs(prev => ({
            ...prev,
            [docId]: {
              uploaded: true,
              fileName: file.name,
              fileSize: formatSize(file.size),
              fileType: file.type || (lowerName.endsWith('.pdf') ? 'application/pdf' : 'image/jpeg'),
              dataUrl: reader.result as string,
              verified: true,
              uploadedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }
          }));
        };
        reader.readAsDataURL(file);
      }
    });

    e.target.value = '';
  };

  // Quick helper to populate sample data for chosen sector
  const applySectorProfile = (sectorId: SectorId) => {
    const sec = getSectorDefinition(sectorId);
    let sampleWorkers = 25;
    let sampleInvestment = 120;
    let samplePower = 55;

    switch (sectorId) {
      case 'pharmaceuticals_biotech':
        sampleWorkers = 65;
        sampleInvestment = 850;
        samplePower = 180;
        break;
      case 'chemicals_petrochemicals':
        sampleWorkers = 55;
        sampleInvestment = 950;
        samplePower = 220;
        break;
      case 'it_ites_datacenter':
        sampleWorkers = 250;
        sampleInvestment = 1400;
        samplePower = 350;
        break;
      case 'food_agro_processing':
        sampleWorkers = 40;
        sampleInvestment = 220;
        samplePower = 90;
        break;
      case 'automobile_ev':
        sampleWorkers = 90;
        sampleInvestment = 650;
        samplePower = 160;
        break;
      default:
        sampleWorkers = 24;
        sampleInvestment = 145;
        samplePower = 65;
    }

    setFormData(prev => ({
      ...prev,
      business_sector: sectorId,
      factory_name: sec.sample_unit_name,
      plot_address: sec.sample_address,
      worker_count: sampleWorkers,
      investment_inr_lakhs: sampleInvestment,
      power_kw: samplePower
    }));
    setIdAddress(sec.sample_address);
    setUtilityAddress('Plot 41, Hadapsar Industrial Estate, Pune - 411028');
    setAddressMismatchResolved(false);
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      factory_name: '',
      district: 'Pune',
      taluka: '',
      size: 'Small',
      business_sector: 'manufacturing_engineering',
      worker_count: 10,
      investment_inr_lakhs: 50,
      plot_address: '',
      power_kw: 25,
    });
    setIdAddress('');
    setUtilityAddress('');
    setAddressMismatchResolved(true);
  };

  // Load approvals checklist
  const fetchChecklist = async () => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const res = await fetch('/v1/assistant/checklist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sector: activeSector.name_en,
          sectors: [activeSector.name_en, activeSector.id],
          business_sector: formData.business_sector,
          size: formData.size,
          worker_count: formData.worker_count,
          requires_power: true,
        }),
      });
      const data = await res.json();
      if (data.approvals && Array.isArray(data.approvals) && data.approvals.length > 0) {
        setApprovals(data.approvals);
      } else {
        setApprovals(getSectorApprovalRules(formData.business_sector));
      }
      setCurrentStep(2);
    } catch (err: any) {
      // Offline fallback: load tailored sector legal rules directly
      setApprovals(getSectorApprovalRules(formData.business_sector));
      setCurrentStep(2);
    } finally {
      setLoading(false);
    }
  };

  // Submit Application
  const handleSubmitApplication = async () => {
    setLoading(true);
    setErrorMessage(null);

    const selectedDepts = Object.keys(consents).filter((k) => consents[k]);
    if (selectedDepts.length === 0) {
      setErrorMessage({
        en: 'At least one department consent is required to proceed.',
        mr: 'अर्ज पुढे पाठवण्यासाठी किमान एका विभागास संमती देणे आवश्यक आहे.',
      });
      setLoading(false);
      return;
    }

    try {
      const applicantId = userSession?.id || 'usr-ravi';

      // 1. Post Granular Consents
      for (const dept of selectedDepts) {
        await fetch('/v1/consent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            user_id: applicantId,
            department: dept,
            purpose: `Factory Composite Setup Clearance - ${formData.factory_name}`,
            data_fields: ['identity', 'premises_address', 'water_requirement', 'power_load', 'worker_safety_plan'],
            valid_days: 90,
          }),
        });
      }

      // Collect documents list submitted
      const submittedDocs = Object.values(departmentDocs).flat().map(doc => ({
        doc_id: doc.doc_id,
        doc_name: doc.doc_name_en,
        department: doc.department,
        file_name: uploadedDocs[doc.doc_id]?.fileName || doc.sample_file_name,
        file_size: uploadedDocs[doc.doc_id]?.fileSize || '1.4 MB',
        file_type: uploadedDocs[doc.doc_id]?.fileType || doc.mime_type || 'application/pdf',
        verified: uploadedDocs[doc.doc_id]?.verified ?? true,
      }));

      // Submit composite application
      const idemKey = `idem-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
      const res = await fetch('/v1/applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Idempotency-Key': idemKey,
        },
        body: JSON.stringify({
          user_id: applicantId,
          service_type: 'Factory Composite Setup NOC & Registration',
          project: {
            ...formData,
            business_sector: formData.business_sector,
            sector: activeSector.name_en,
            sectors: [activeSector.name_en],
            sector_name_en: activeSector.name_en,
            sector_name_mr: activeSector.name_mr,
            pollution_category: activeSector.pollution_category,
            documents_submitted: submittedDocs,
          },
          target_departments: selectedDepts,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMessage({
          en: data.error?.message_en || 'Application submission failed.',
          mr: data.error?.message_mr || 'अर्ज सादरीकरणात त्रुटी आली.',
        });
        return;
      }

      const createdObj: Application = {
        tracking_id: data.tracking_id,
        user_id: applicantId,
        service_type: 'Factory Composite Setup NOC & Registration',
        project: {
          ...formData,
          business_sector: formData.business_sector,
          sector: activeSector.name_en,
          sector_name_en: activeSector.name_en,
          sector_name_mr: activeSector.name_mr,
          pollution_category: activeSector.pollution_category,
          documents_submitted: submittedDocs,
        },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        derived_status: data.status,
      };

      setCreatedApp(createdObj);
      onApplicationCreated(createdObj);
      setCurrentStep(5);
    } catch (err: any) {
      setErrorMessage({ en: 'Network error submitting application.', mr: 'अर्ज सादर करताना नेटवर्क त्रुटी आली.' });
    } finally {
      setLoading(false);
    }
  };

  // Group sectors by category
  const groupedSectors = SECTOR_CATALOG.reduce((acc, sec) => {
    if (!acc[sec.category]) acc[sec.category] = [];
    acc[sec.category].push(sec);
    return acc;
  }, {} as Record<string, SectorDefinition[]>);

  // Department labels
  const departmentMeta: Record<string, { label_en: string; label_mr: string }> = {
    industries: {
      label_en: 'Directorate of Industries (MIDC)',
      label_mr: 'उद्योग संचालनालय (एमआयडीसी)',
    },
    mpcb: {
      label_en: 'Maharashtra Pollution Control Board (MPCB)',
      label_mr: 'महाराष्ट्र प्रदूषण नियंत्रण मंडळ (MPCB)',
    },
    fire: {
      label_en: 'Maharashtra Fire & Emergency Services',
      label_mr: 'महाराष्ट्र अग्निशमन सेवा',
    },
    labour: {
      label_en: 'Department of Labour (DISH)',
      label_mr: 'कामगार विभाग (औद्योगिक सुरक्षा)',
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pt-4 px-4 sm:px-6">
      
      {/* Official Government Portal Stepper */}
      <div className="border border-slate-200 bg-white rounded-lg p-3">
        <div className="grid grid-cols-5 text-center text-xs">
          {[
            { step: 1, label: lang === 'mr' ? 'उद्योगाचा तपशील' : 'Enterprise Profile' },
            { step: 2, label: lang === 'mr' ? 'परवानग्या' : 'Clearances' },
            { step: 3, label: lang === 'mr' ? 'कागदपत्रे' : 'Documents' },
            { step: 4, label: lang === 'mr' ? 'संमती' : 'Single Consent' },
            { step: 5, label: lang === 'mr' ? 'पोचपावती' : 'Acknowledgement' },
          ].map((s) => (
            <div
              key={s.step}
              className={`py-2 px-1 border-b-2 transition-colors flex flex-col items-center gap-0.5 ${
                currentStep === s.step
                  ? 'border-blue-900 text-blue-900 font-bold'
                  : currentStep > s.step
                  ? 'border-emerald-600 text-emerald-800 font-medium'
                  : 'border-transparent text-slate-400'
              }`}
            >
              <span className="text-[11px]">Step {s.step}</span>
              <span className="truncate w-full">{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Error Alert */}
      {errorMessage && (
        <div className="p-4 rounded-md bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-3">
          <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">{lang === 'mr' ? 'त्रुटी' : 'Submission Note'}</p>
            <p className="mt-0.5">{lang === 'mr' ? errorMessage.mr : errorMessage.en}</p>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* STEP 1: FACTORY PROFILE & SECTOR */}
      {/* ==================================================================== */}
      {currentStep === 1 && (
        <div className="bg-white border border-slate-200 rounded-lg p-6 sm:p-8 space-y-6 shadow-xs">
          
          {/* Section 1 Header */}
          <div className="pb-4 border-b border-slate-200">
            <h2 className="text-base font-bold text-slate-900">
              {lang === 'mr' ? 'भाग १: उद्योगाचा तपशील व क्षेत्र निवड' : 'Section 1: Enterprise Profile & Sector Selection'}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {lang === 'mr' ? 'आपल्या कारखान्याची माहिती नोंदवा' : 'Provide industrial enterprise setup details to determine applicable department clearances.'}
            </p>
          </div>

          {/* Sector Selection (Clean Standard Form Select) */}
          <div className="space-y-1.5">
            <label htmlFor="sector-select" className="block text-xs font-bold text-slate-800">
              {lang === 'mr' ? 'व्यवसाय क्षेत्र *' : 'Business Sector *'}
            </label>
            <select
              id="sector-select"
              value={formData.business_sector}
              onChange={(e) => {
                const newSectorId = e.target.value as SectorId;
                applySectorProfile(newSectorId);
              }}
              className="w-full px-3.5 py-2.5 text-sm text-slate-900 bg-white border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-900 cursor-pointer"
            >
              {Object.entries(groupedSectors).map(([groupName, sectors]) => (
                <optgroup key={groupName} label={groupName}>
                  {sectors.map((s) => (
                    <option key={s.id} value={s.id}>
                      {lang === 'mr' ? s.name_mr : s.name_en}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>

            {/* Zero-Pill Clean Unboxed Metadata */}
            <div className="flex items-center gap-2 text-xs text-slate-500 pt-1">
              <span className="font-semibold text-slate-700">{lang === 'mr' ? activeSector.name_mr : activeSector.name_en}</span>
              <span aria-hidden="true">·</span>
              <span>{lang === 'mr' ? activeSector.category_mr : activeSector.category}</span>
              <span aria-hidden="true">·</span>
              <span>{totalRequiredDocs} {lang === 'mr' ? 'कागदपत्रे' : 'Documents Required'}</span>
            </div>

            {/* Clean Minimalist Clearances Summary */}
            <div className="pt-2">
              <div className="p-2.5 sm:p-3 bg-slate-50 border border-slate-200 rounded-md">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-slate-800">
                    <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                    <span>
                      {lang === 'mr' ? 'आवश्यक कायदेशीर परवानग्या:' : 'Required Clearances:'}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500">
                    {lang === 'mr' ? 'एकत्रित सिंगल विंडो मंजुरी' : 'Single Window Fast-Track Clearances'}
                  </span>
                </div>

                {/* 4 Clean Scannable Badges */}
                <div className="flex flex-wrap items-center gap-1.5 mt-2">
                  {activeLegalChecklist.compliances.map((item) => (
                    <span
                      key={item.id}
                      className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-slate-200 rounded text-xs text-slate-800 font-medium shadow-2xs"
                    >
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{lang === 'mr' ? item.title_mr.split('(')[0].trim() : item.title_en.split('(')[0].trim()}</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Standard Form Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t.form_factory_name} *
              </label>
              <input
                type="text"
                value={formData.factory_name}
                onChange={(e) => setFormData({ ...formData, factory_name: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t.form_district} *
              </label>
              <select
                value={formData.district}
                onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-900 bg-white"
              >
                <option value="Pune">Pune</option>
                <option value="Thane">Thane</option>
                <option value="Raigad">Raigad</option>
                <option value="Nashik">Nashik</option>
                <option value="Chhatrapati Sambhajinagar">Chhatrapati Sambhajinagar</option>
                <option value="Nagpur">Nagpur</option>
                <option value="Kolhapur">Kolhapur</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t.form_size} *
              </label>
              <select
                value={formData.size}
                onChange={(e) => setFormData({ ...formData, size: e.target.value as any })}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-900 bg-white"
              >
                <option value="Micro">Micro (&lt; ₹1 Cr investment)</option>
                <option value="Small">Small (₹1 Cr - ₹10 Cr)</option>
                <option value="Medium">Medium (₹10 Cr - ₹50 Cr)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t.form_workers} *
              </label>
              <input
                type="number"
                value={formData.worker_count}
                onChange={(e) => setFormData({ ...formData, worker_count: Number(e.target.value) })}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-900"
              />
              <span className="text-[11px] text-slate-500 mt-1 block">
                {formData.worker_count >= 10 ? 'Requires Factories Act 1948 registration' : 'Under 10 workers threshold'}
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t.form_investment} *
              </label>
              <input
                type="number"
                value={formData.investment_inr_lakhs}
                onChange={(e) => setFormData({ ...formData, investment_inr_lakhs: Number(e.target.value) })}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t.form_power} *
              </label>
              <input
                type="number"
                value={formData.power_kw}
                onChange={(e) => setFormData({ ...formData, power_kw: Number(e.target.value) })}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-900"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t.form_address} *
              </label>
              <input
                type="text"
                value={formData.plot_address}
                onChange={(e) => {
                  setFormData({ ...formData, plot_address: e.target.value });
                  setIdAddress(e.target.value);
                }}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-900"
              />
            </div>
          </div>

          {/* Action Row */}
          <div className="pt-4 flex justify-end border-t border-slate-200">
            <button
              onClick={fetchChecklist}
              disabled={loading}
              className="px-5 py-2.5 bg-blue-900 hover:bg-blue-800 text-white rounded text-sm font-semibold transition-colors flex items-center gap-2 cursor-pointer"
            >
              <span>{loading ? 'Evaluating Rules...' : 'Check Required Clearances'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      )}

      {/* ==================================================================== */}
      {/* STEP 2: CLEARANCES CHECKLIST */}
      {/* ==================================================================== */}
      {currentStep === 2 && (
        <div className="bg-white border border-slate-200 rounded-lg p-6 sm:p-8 space-y-6 shadow-xs">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                {lang === 'mr' ? 'भाग २: आवश्यक शासकीय परवानग्यांची यादी' : 'Section 2: Deterministic Regulatory Clearances'}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {lang === 'mr'
                  ? `आपल्या उद्योगासाठी (${activeSector.name_mr}) आवश्यक असणाऱ्या ${approvals.length} परवानग्या:`
                  : `${approvals.length} statutory clearances evaluated for ${activeSector.name_en}.`}
              </p>
            </div>
            <div className="text-xs text-slate-600 font-medium">
              {lang === 'mr' ? activeSector.category_mr : activeSector.category}
            </div>
          </div>

          {/* Plain Language Local Business Guidance Banner */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-md text-xs text-slate-800 flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-blue-900 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold block text-slate-900">
                {lang === 'mr' ? 'स्थानिक व्यवसाय नियमन सारांश:' : 'Statutory Compliance Summary:'}
              </span>
              <span className="text-slate-600 leading-relaxed">
                {lang === 'mr' ? activeLegalChecklist.easy_summary_mr : activeLegalChecklist.easy_summary_en}
              </span>
            </div>
          </div>

          {/* Clean List of Clearances */}
          <div className="border border-slate-200 rounded-md divide-y divide-slate-200">
            {approvals.map((rule) => (
              <div
                key={rule.rule_id}
                className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap text-xs">
                    <span className="font-bold text-slate-900 text-sm">
                      {lang === 'mr' ? rule.approval_name_mr : rule.approval_name_en}
                    </span>
                    <span className="text-slate-500">·</span>
                    <span className="font-medium text-slate-700">
                      {lang === 'mr' ? rule.department_name_mr : rule.department_name_en}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600">
                    {lang === 'mr' ? rule.reason_mr : rule.reason_en}
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Authority: {lang === 'mr' ? rule.legal_act_mr : rule.legal_act_en}
                  </p>
                </div>

                <div className="shrink-0 text-left sm:text-right text-xs font-medium text-slate-600">
                  SLA: {rule.sla_minutes} min
                </div>
              </div>
            ))}
          </div>

          {/* Action Row */}
          <div className="pt-4 flex items-center justify-between border-t border-slate-200">
            <button
              onClick={() => setCurrentStep(1)}
              className="text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
            >
              ← {lang === 'mr' ? 'तपशील बदला' : 'Back to Details'}
            </button>
            <button
              onClick={() => setCurrentStep(3)}
              className="px-5 py-2.5 bg-blue-900 hover:bg-blue-800 text-white rounded text-sm font-semibold transition-colors flex items-center gap-2 cursor-pointer"
            >
              <span>{lang === 'mr' ? `कागदपत्रे जोडा (${totalRequiredDocs})` : `Proceed to Documents (${totalRequiredDocs})`}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      )}

      {/* ==================================================================== */}
      {/* STEP 3: DYNAMIC REQUIRED DOCUMENTS & INTERACTIVE FILE UPLOADER */}
      {/* ==================================================================== */}
      {currentStep === 3 && (
        <div className="bg-white border border-slate-200 rounded-lg p-6 sm:p-8 space-y-6 shadow-xs">
          
          {/* Header & Dynamic Progress */}
          <div className="pb-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900">
                  {lang === 'mr' ? 'भाग ३: आवश्यक शासकीय कागदपत्रे अपलोड करा' : 'Section 3: Mandatory Government Documents Upload'}
                </h2>
                <span className="text-[10px] font-semibold text-blue-900 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  PDF / JPG (Max 10MB)
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                {lang === 'mr'
                  ? `निवडलेले क्षेत्र: ${activeSector.name_mr} · सर्व विभागांसाठी आवश्यक कागदपत्रे संलग्न करा.`
                  : `Requirements dynamically mapped for ${activeSector.name_en}. Upload clear scanned copies.`}
              </p>
            </div>

            {/* Quick Bulk Actions */}
            <div className="flex items-center gap-2 shrink-0">
              <input
                type="file"
                ref={bulkFileInputRef}
                multiple
                accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
                onChange={handleBulkUpload}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => bulkFileInputRef.current?.click()}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded text-xs font-semibold flex items-center gap-1.5 cursor-pointer border border-slate-300 transition-colors"
                title="Upload multiple PDF or JPG files at once"
              >
                <UploadCloud className="w-3.5 h-3.5 text-blue-900" />
                <span>{lang === 'mr' ? 'एकत्रित फाइल्स निवडा' : 'Batch Upload Files'}</span>
              </button>

              <button
                type="button"
                onClick={handleAttachAllSamples}
                className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded text-xs font-semibold flex items-center gap-1.5 cursor-pointer border border-emerald-200 transition-colors"
                title="Auto-fill verified official sample documents for instant submission"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>{lang === 'mr' ? 'नमुना टेम्पलेट्स जोडा' : 'Attach All Templates'}</span>
              </button>
            </div>
          </div>

          {/* Upload Progress Status Bar */}
          {(() => {
            const uploadedCount = allDepartmentDocsList.filter(d => uploadedDocs[d.doc_id]?.uploaded).length;
            const mandatoryCount = allDepartmentDocsList.filter(d => d.is_mandatory).length;
            const uploadedMandatoryCount = allDepartmentDocsList.filter(d => d.is_mandatory && uploadedDocs[d.doc_id]?.uploaded).length;
            const pct = totalRequiredDocs > 0 ? Math.round((uploadedCount / totalRequiredDocs) * 100) : 0;
            const allMandatoryDone = uploadedMandatoryCount >= mandatoryCount;

            return (
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-800">
                      {lang === 'mr' ? 'कागदपत्र पूर्तता प्रगती:' : 'Document Completion Progress:'}
                    </span>
                    <span className="font-semibold text-blue-900">
                      {uploadedCount} / {totalRequiredDocs} {lang === 'mr' ? 'संलग्न' : 'Attached'} ({pct}%)
                    </span>
                  </div>
                  {allMandatoryDone ? (
                    <span className="text-[11px] font-semibold text-emerald-700 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {lang === 'mr' ? 'सर्व अनिवार्य कागदपत्रे सज्ज' : 'All Mandatory Documents Ready'}
                    </span>
                  ) : (
                    <span className="text-[11px] font-semibold text-amber-700">
                      {mandatoryCount - uploadedMandatoryCount} {lang === 'mr' ? 'अनिवार्य कागदपत्रे प्रलंबित' : 'Mandatory Pending'}
                    </span>
                  )}
                </div>

                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${
                      allMandatoryDone ? 'bg-emerald-600' : 'bg-blue-900'
                    }`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })()}

          {/* Address Discrepancy Alert */}
          {!addressMismatchResolved ? (
            <div className="p-4 rounded-md bg-amber-50 border border-amber-300 text-amber-900 space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
                <h3 className="font-bold">
                  {lang === 'mr' ? 'पत्ता पडताळणी: तफावत आढळली' : 'Cross-Document Address Discrepancy'}
                </h3>
              </div>
              <p className="leading-relaxed">
                {lang === 'mr'
                  ? 'वीज बिलावरील पत्ता आणि कारखान्याचा पत्ता यांच्यामध्ये तफावत आहे. एका क्लिकने दुरुस्त करा:'
                  : `Electricity Bill specifies "Plot 41, Hadapsar" while Factory plot is "${idAddress.split(',')[0]}". Synchronize records to prevent department rejection:`}
              </p>
              <div>
                <button
                  type="button"
                  onClick={() => {
                    setUtilityAddress(idAddress);
                    setAddressMismatchResolved(true);
                  }}
                  className="px-3 py-1.5 bg-amber-800 hover:bg-amber-900 text-white font-semibold rounded cursor-pointer transition-colors"
                >
                  ✓ {lang === 'mr' ? 'पत्ता त्वरित जुळवा' : 'Synchronize Address to Factory Plot'}
                </button>
              </div>
            </div>
          ) : (
            <div className="p-3 rounded-md bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                {lang === 'mr'
                  ? 'सर्व कागदपत्रांमधील ओळख व जागेचा पत्ता जुळला आहे.'
                  : 'Document address verification passed: All premises records match factory plot.'}
              </span>
            </div>
          )}

          {/* Document Groups by Department with Interactive Upload Cards */}
          <div className="space-y-5">
            {(['industries', 'mpcb', 'fire', 'labour'] as const).map((deptKey) => {
              const meta = departmentMeta[deptKey];
              const docs = departmentDocs[deptKey] || [];
              if (docs.length === 0) return null;

              const deptUploadedCount = docs.filter(d => uploadedDocs[d.doc_id]?.uploaded).length;

              return (
                <div key={deptKey} className="border border-slate-200 rounded-lg overflow-hidden bg-white shadow-2xs">
                  
                  {/* Department Heading */}
                  <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-blue-900" />
                      <span className="text-xs font-bold text-slate-800">
                        {lang === 'mr' ? meta.label_mr : meta.label_en}
                      </span>
                    </div>
                    <span className="text-[11px] font-semibold text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-200">
                      {deptUploadedCount} / {docs.length} {lang === 'mr' ? 'अपलोड केले' : 'Uploaded'}
                    </span>
                  </div>

                  {/* Document upload cards */}
                  <div className="p-3.5 space-y-2.5 bg-slate-50/30">
                    {docs.map((doc) => (
                      <DocumentUploadCard
                        key={doc.doc_id}
                        doc={doc}
                        uploadedMeta={uploadedDocs[doc.doc_id]}
                        onUpload={handleDocUpload}
                        onRemove={handleDocRemove}
                        onPreview={handleDocPreview}
                        lang={lang}
                      />
                    ))}
                  </div>

                </div>
              );
            })}
          </div>

          {/* Action Row */}
          <div className="pt-4 flex items-center justify-between border-t border-slate-200">
            <button
              onClick={() => setCurrentStep(2)}
              className="text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
            >
              ← {lang === 'mr' ? 'परवानग्या पहा' : 'Back to Clearances'}
            </button>
            <button
              onClick={() => setCurrentStep(4)}
              className="px-5 py-2.5 bg-blue-900 hover:bg-blue-800 text-white rounded text-sm font-semibold transition-colors flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <span>{lang === 'mr' ? 'संमती द्या' : 'Proceed to Consent'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      )}

      {/* ==================================================================== */}
      {/* STEP 4: DATA SHARING CONSENT */}
      {/* ==================================================================== */}
      {currentStep === 4 && (
        <div className="bg-white border border-slate-200 rounded-lg p-6 sm:p-8 space-y-6 shadow-xs">
          
          <div className="pb-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                {lang === 'mr' ? 'भाग ४: एकल-खिडकी डेटा देवाणघेवाण संमती' : 'Section 4: Single-Window Data Sharing Consent'}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {lang === 'mr'
                  ? 'सर्व विभागांना अर्ज व कागदपत्रे पाठवण्यासाठी संमती नोंदवा.'
                  : 'Grant consent to transmit your verified application profile and documents to department systems.'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setConsents({ industries: true, mpcb: true, fire: true, labour: true });
              }}
              className="text-xs font-semibold text-blue-900 hover:text-blue-950 underline cursor-pointer shrink-0"
            >
              {lang === 'mr' ? 'सर्व संमती निवडा' : 'Select All Departments'}
            </button>
          </div>

          <div className="space-y-3">
            {[
              { id: 'industries', name: 'Directorate of Industries (MIDC)', purpose: 'Industrial plot allotment verification and power feasibility' },
              { id: 'mpcb', name: 'Maharashtra Pollution Control Board (MPCB)', purpose: 'Consent to establish and environmental compliance verification' },
              { id: 'fire', name: 'Maharashtra Fire & Emergency Services', purpose: 'Building layout fire safety and evacuation clearance' },
              { id: 'labour', name: 'Department of Labour (DISH)', purpose: 'Factories Act worker safety and health registration' },
            ].map((d) => (
              <label
                key={d.id}
                className="p-3.5 rounded border border-slate-200 bg-white hover:bg-slate-50 flex items-center justify-between gap-4 cursor-pointer"
              >
                <div>
                  <span className="text-xs font-bold text-slate-900 block">{d.name}</span>
                  <span className="text-[11px] text-slate-500">{d.purpose}</span>
                </div>

                <input
                  type="checkbox"
                  checked={!!consents[d.id]}
                  onChange={(e) => setConsents({ ...consents, [d.id]: e.target.checked })}
                  className="w-4 h-4 rounded text-blue-900 focus:ring-blue-900 cursor-pointer"
                />
              </label>
            ))}
          </div>

          {/* Action Row */}
          <div className="pt-4 flex items-center justify-between border-t border-slate-200">
            <button
              onClick={() => setCurrentStep(3)}
              className="text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
            >
              ← {lang === 'mr' ? 'कागदपत्रे' : 'Back to Documents'}
            </button>
            <button
              onClick={handleSubmitApplication}
              disabled={loading}
              className="px-5 py-2.5 bg-blue-900 hover:bg-blue-800 text-white rounded text-sm font-semibold transition-colors flex items-center gap-2 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>{loading ? 'Submitting Application...' : 'Submit Composite Application'}</span>
            </button>
          </div>

        </div>
      )}

      {/* ==================================================================== */}
      {/* STEP 5: SUBMISSION ACKNOWLEDGEMENT */}
      {/* ==================================================================== */}
      {currentStep === 5 && createdApp && (
        <div className="bg-white border border-slate-200 rounded-lg p-6 sm:p-10 text-center space-y-6 shadow-xs">
          
          <div className="w-12 h-12 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle className="w-6 h-6" />
          </div>

          <div>
            <h2 className="text-lg font-bold text-slate-900">
              {lang === 'mr' ? 'अर्ज यशस्वीरीत्या सादर झाला!' : 'Application Successfully Submitted'}
            </h2>
            <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
              {lang === 'mr'
                ? 'आपला अर्ज महासेतू द्वारे संबंधित विभागांना एकाच वेळी पाठवला गेला आहे.'
                : 'Your composite application has been fan-out dispatched to all 4 department systems in parallel.'}
            </p>
          </div>

          {/* Tracking ID Callout */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded max-w-sm mx-auto space-y-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
              {t.submit_tracking_id_label}
            </span>
            <div className="flex items-center justify-center gap-2">
              <span className="text-lg font-mono font-bold text-slate-900">
                {createdApp.tracking_id}
              </span>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(createdApp.tracking_id);
                  setCopiedId(true);
                  setTimeout(() => setCopiedId(false), 2000);
                }}
                className="p-1 hover:bg-slate-200 rounded text-slate-600 transition-colors cursor-pointer"
                title="Copy tracking ID"
              >
                {copiedId ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            {copiedId && <span className="text-[10px] text-emerald-600 font-semibold block">Copied to clipboard!</span>}
          </div>

          {/* Primary Action to Track */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={() => onOpenTracking(createdApp.tracking_id)}
              className="w-full sm:w-auto px-5 py-2.5 bg-blue-900 hover:bg-blue-800 text-white rounded text-sm font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{lang === 'mr' ? 'थेट स्थिती ट्रॅक करा' : 'Track Application Status'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                applySectorProfile('manufacturing_engineering');
                setCurrentStep(1);
              }}
              className="w-full sm:w-auto px-4 py-2.5 text-slate-700 hover:text-slate-900 border border-slate-300 rounded text-xs font-semibold cursor-pointer"
            >
              + {lang === 'mr' ? 'दुसरा अर्ज करा' : 'New Application'}
            </button>
          </div>

        </div>
      )}

      {/* Document Inspection & Preview Modal */}
      <DocumentPreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        doc={previewDoc}
        uploadedMeta={previewMeta}
        lang={lang}
      />

    </div>
  );
};
