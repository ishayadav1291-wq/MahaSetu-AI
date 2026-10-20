import React, { useState } from 'react';
import {
  X,
  User,
  ShieldCheck,
  Building2,
  Lock,
  ArrowRight,
  CheckCircle,
  Briefcase,
  AlertCircle,
  UserPlus,
  Phone,
  Mail,
  MapPin,
  CheckSquare,
  FileCheck2,
  Sparkles
} from 'lucide-react';
import { UserSession, Department, Role } from '../types';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserSession | null;
  onLoginSuccess: (user: UserSession) => void;
  lang: 'en' | 'mr';
}

const MAHARASHTRA_DISTRICTS = [
  'Pune',
  'Mumbai City',
  'Mumbai Suburban',
  'Thane',
  'Nashik',
  'Chhatrapati Sambhajinagar',
  'Nagpur',
  'Kolhapur',
  'Solapur',
  'Raigad',
  'Palghar',
  'Ahilyanagar (Ahmednagar)',
  'Satara',
  'Sangli',
  'Jalgaon',
  'Amravati',
  'Nanded',
  'Chandrapur'
];

const SECTORS = [
  { id: 'manufacturing_engineering', name_en: 'Engineering & Machinery', name_mr: 'अभियांत्रिकी व यंत्रसामग्री' },
  { id: 'automobile_ev', name_en: 'Automobile & EV Components', name_mr: 'वाहन व इलेक्ट्रिक व्हेईकल' },
  { id: 'food_agro_processing', name_en: 'Food & Agro Processing', name_mr: 'अन्न व कृषी प्रक्रिया' },
  { id: 'pharmaceuticals_biotech', name_en: 'Pharmaceuticals & Biotech', name_mr: 'औषध निर्माण व बायोटेक्नॉलॉजी' },
  { id: 'it_ites_datacenter', name_en: 'IT Services & Data Centers', name_mr: 'माहिती तंत्रज्ञान व डेटा केंद्र' },
  { id: 'chemicals_petrochemicals', name_en: 'Chemicals & Petrochemicals', name_mr: 'रसायने व पेट्रोकेमिकल्स' },
  { id: 'textiles_apparel', name_en: 'Textiles & Apparel', name_mr: 'वस्त्रोद्योग व गारमेंट्स' },
  { id: 'renewable_energy_solar', name_en: 'Renewable Energy & Solar', name_mr: 'सौर व अपारंपरिक ऊर्जा' },
  { id: 'warehousing_logistics', name_en: 'Warehousing & Logistics', name_mr: 'गोदाम व लॉजिस्टिक्स' }
];

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onLoginSuccess,
  lang,
}) => {
  // Mode: Sign In vs New Registration
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [tab, setTab] = useState<'citizen' | 'officer'>('citizen');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Form states for custom login
  const [citizenIdentifier, setCitizenIdentifier] = useState('ravi@example.com');
  const [citizenOtp, setCitizenOtp] = useState('');
  const [officerDept, setOfficerDept] = useState<Department>('industries');
  const [officerEmpId, setOfficerEmpId] = useState('MH-MIDC-4421');

  // Form states for New User Registration
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regMobile, setRegMobile] = useState('');
  const [regEnterprise, setRegEnterprise] = useState('');
  const [regDistrict, setRegDistrict] = useState('Pune');
  const [regSector, setRegSector] = useState('manufacturing_engineering');
  const [regScale, setRegScale] = useState<'Micro' | 'Small' | 'Medium' | 'Large'>('Small');
  const [regUdyam, setRegUdyam] = useState('');
  const [regConsentAccepted, setRegConsentAccepted] = useState(true);

  if (!isOpen) return null;

  // Preset quick login accounts
  const citizenPresets = [
    {
      id: 'usr-ravi',
      name: 'Ravi Patil',
      email: 'ravi@example.com',
      enterprise: 'Shree Ganesh Engineering',
      role: 'business' as Role,
      sector: 'Engineering & Machinery',
      district: 'Pune',
      scale: 'Small',
      badge: lang === 'mr' ? 'उद्योजक अर्जदार' : 'Business Applicant'
    },
    {
      id: 'usr-food',
      name: 'Sunita Agro Foods',
      email: 'sunita.agro@example.com',
      enterprise: 'Godavari Food Processing Park',
      role: 'business' as Role,
      sector: 'Food & Agro Processing',
      district: 'Nashik',
      scale: 'Medium',
      badge: lang === 'mr' ? 'अन्न प्रक्रिया उद्योजक' : 'Food Processing Applicant'
    },
    {
      id: 'usr-it',
      name: 'MahaCloud IT Services',
      email: 'tech@mahacloud.in',
      enterprise: 'MahaCloud Data Center & IT Services',
      role: 'business' as Role,
      sector: 'IT Services & Data Centers',
      district: 'Mumbai Suburban',
      scale: 'Large',
      badge: lang === 'mr' ? 'आयटी उद्योजक' : 'IT Services Applicant'
    }
  ];

  const officerPresets = [
    {
      id: 'usr-off-ind',
      name: 'Shri A. K. Deshmukh',
      email: 'officer.ind@maha.gov.in',
      department: 'industries' as Department,
      title: lang === 'mr' ? 'उद्योग संचालनालय (एमआयडीसी)' : 'Directorate of Industries (MIDC)',
      role: 'officer' as Role,
      badge: 'MIDC Desk'
    },
    {
      id: 'usr-off-mpcb',
      name: 'Dr. Sunita Kulkarni',
      email: 'officer.mpcb@maha.gov.in',
      department: 'mpcb' as Department,
      title: lang === 'mr' ? 'महाराष्ट्र प्रदूषण नियंत्रण मंडळ (MPCB)' : 'Pollution Control Board (MPCB)',
      role: 'officer' as Role,
      badge: 'MPCB Desk'
    },
    {
      id: 'usr-off-fire',
      name: 'Chief Fire Officer S. Shinde',
      email: 'officer.fire@maha.gov.in',
      department: 'fire' as Department,
      title: lang === 'mr' ? 'अग्निशमन व आणीबाणी सेवा' : 'Fire & Emergency Services',
      role: 'officer' as Role,
      badge: 'Fire Desk'
    },
    {
      id: 'usr-off-lab',
      name: 'Inspector V. R. Pawar',
      email: 'officer.labour@maha.gov.in',
      department: 'labour' as Department,
      title: lang === 'mr' ? 'कामगार विभाग (DISH)' : 'Department of Labour (DISH)',
      role: 'officer' as Role,
      badge: 'Labour Desk'
    },
    {
      id: 'usr-admin',
      name: 'Nodal Director IT Cell',
      email: 'admin@mahasetu.gov.in',
      department: undefined,
      title: lang === 'mr' ? 'प्रशासन व एसएलए नियंत्रण' : 'State Governance & SLA Monitoring',
      role: 'admin' as Role,
      badge: 'Admin'
    }
  ];

  const handleSelectUser = async (user: UserSession) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email, role_override: user.role })
      });
      const data = await res.json();
      if (data.user) {
        onLoginSuccess({
          ...data.user,
          name: user.name,
          department: user.department,
          enterprise: user.enterprise || data.user.enterprise,
          district: user.district || data.user.district,
          sector: user.sector || data.user.sector,
          scale: user.scale || data.user.scale,
          language: lang
        });
      } else {
        onLoginSuccess(user);
      }
      onClose();
    } catch (err: any) {
      // Offline fallback
      onLoginSuccess(user);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const handleFormLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (tab === 'citizen') {
      const user: UserSession = {
        id: `usr-${Date.now()}`,
        name: citizenIdentifier.includes('@') ? citizenIdentifier.split('@')[0] : 'Citizen User',
        email: citizenIdentifier,
        role: 'business',
        language: lang
      };
      handleSelectUser(user);
    } else {
      const deptNames: Record<Department, string> = {
        industries: 'Shri A. K. Deshmukh',
        mpcb: 'Dr. Sunita Kulkarni',
        fire: 'Chief Fire Officer S. Shinde',
        labour: 'Inspector V. R. Pawar'
      };
      const user: UserSession = {
        id: `usr-off-${officerDept}`,
        name: deptNames[officerDept] || 'Govt Officer',
        email: `officer.${officerDept}@maha.gov.in`,
        role: 'officer',
        department: officerDept,
        language: lang
      };
      handleSelectUser(user);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (!regName.trim()) {
      setError(lang === 'mr' ? 'कृपया पूर्ण नाव प्रविष्ट करा' : 'Please enter your full name');
      return;
    }

    if (!regEmail.trim() || !regEmail.includes('@')) {
      setError(lang === 'mr' ? 'कृपया वैध ईमेल पत्ता प्रविष्ट करा' : 'Please enter a valid email address');
      return;
    }

    if (!regMobile.trim() || regMobile.length < 10) {
      setError(lang === 'mr' ? 'कृपया १० अंकी वैध मोबाईल क्र. प्रविष्ट करा' : 'Please enter a valid 10-digit mobile number');
      return;
    }

    if (!regEnterprise.trim()) {
      setError(lang === 'mr' ? 'कृपया उद्योग / कंपनीचे नाव प्रविष्ट करा' : 'Please enter your Enterprise / Company name');
      return;
    }

    if (!regConsentAccepted) {
      setError(lang === 'mr' ? 'कृपया DPDP कायद्यांतर्गत डेटा संमती स्वीकारा' : 'Please accept the DPDP Act consent declaration');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        name: regName.trim(),
        email: regEmail.trim(),
        mobile: regMobile.trim(),
        enterprise: regEnterprise.trim(),
        district: regDistrict,
        sector: regSector,
        scale: regScale,
        udyam_or_pan: regUdyam.trim() || undefined,
        language: lang
      };

      const res = await fetch('/v1/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to complete registration');
      }

      setSuccessMsg(
        lang === 'mr'
          ? 'नोंदणी यशस्वी! तुमचे महासेतू खाते तयार झाले आहे.'
          : 'Registration successful! Your MahaSetu enterprise account is now active.'
      );

      // Auto login user
      setTimeout(() => {
        onLoginSuccess({
          ...data.user,
          language: lang
        });
        onClose();
      }, 700);

    } catch (err: any) {
      setError(err.message || 'Error creating account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="relative w-full max-w-lg bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Tricolor Government Top Strip */}
        <div className="h-1 bg-gradient-to-r from-orange-500 via-white to-emerald-600" />

        {/* Modal Header */}
        <div className="px-6 pt-5 pb-4 border-b border-slate-200 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-sm shrink-0">
              <Building2 className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900">
                  {authMode === 'register'
                    ? (lang === 'mr' ? 'नवीन अर्जदार नोंदणी' : 'New Enterprise Registration')
                    : (lang === 'mr' ? 'महासेतू प्रवेश व लॉगिन' : 'MahaSetu Single Window Access')}
                </h2>
                <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Govt of Maharashtra
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {authMode === 'register'
                  ? (lang === 'mr'
                      ? 'महाराष्ट्र राज्य एकल खिडकीसाठी नवीन उद्योग खात्याची त्वरित नोंदणी करा.'
                      : 'Create your official enterprise account for unified statutory clearances.')
                  : (lang === 'mr'
                      ? 'नागरिक, उद्योजक व शासकीय अधिकारी यांच्यासाठी अधिकृत लॉगिन'
                      : 'Unified SSO portal for business applicants and department officers.')}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Primary Mode Toggle: Sign In vs New Registration */}
        <div className="px-6 pt-3 pb-0 bg-slate-50/80 border-b border-slate-200">
          <div className="flex border-b border-slate-200 gap-6 text-xs font-semibold">
            <button
              type="button"
              onClick={() => {
                setAuthMode('login');
                setError(null);
                setSuccessMsg(null);
              }}
              className={`pb-2.5 transition-colors cursor-pointer border-b-2 flex items-center gap-1.5 ${
                authMode === 'login'
                  ? 'border-blue-900 text-blue-900 font-bold'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Lock className="w-3.5 h-3.5" />
              <span>{lang === 'mr' ? 'प्रवेश / लॉगिन' : 'Sign In'}</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthMode('register');
                setError(null);
                setSuccessMsg(null);
              }}
              className={`pb-2.5 transition-colors cursor-pointer border-b-2 flex items-center gap-1.5 ${
                authMode === 'register'
                  ? 'border-emerald-600 text-emerald-700 font-bold'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>{lang === 'mr' ? 'नवीन अर्जदार नोंदणी' : 'New Registration'}</span>
              <span className="text-[9px] bg-emerald-100 text-emerald-800 px-1 py-0.2 rounded font-bold">New</span>
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* VIEW 1: SIGN IN (Existing functionality enhanced) */}
        {/* ========================================================================= */}
        {authMode === 'login' && (
          <div>
            {/* Tab Switcher: Citizen vs Officer */}
            <div className="p-4 bg-slate-50 border-b border-slate-200">
              <div className="grid grid-cols-2 gap-2 bg-slate-200/80 p-1 rounded-lg text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setTab('citizen')}
                  className={`py-2 px-3 rounded-md transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    tab === 'citizen'
                      ? 'bg-white text-slate-900 shadow-xs font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <User className="w-4 h-4 text-blue-900" />
                  <span>{lang === 'mr' ? 'उद्योजक / नागरिक' : 'Applicant / Citizen'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setTab('officer')}
                  className={`py-2 px-3 rounded-md transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    tab === 'officer'
                      ? 'bg-white text-slate-900 shadow-xs font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>{lang === 'mr' ? 'शासकीय अधिकारी' : 'Department Officer'}</span>
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 max-h-[60vh] overflow-y-auto no-scrollbar space-y-4">
              
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md text-xs text-red-700 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Banner promoting New Registration for applicants */}
              {tab === 'citizen' && (
                <div className="p-3 bg-gradient-to-r from-emerald-50 to-blue-50 border border-emerald-200/80 rounded-lg flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-xs">
                    <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="text-slate-700">
                      {lang === 'mr'
                        ? 'प्रथमच अर्ज करत आहात? नवीन खात्याची त्वरित नोंदणी करा.'
                        : 'First time here? Register your enterprise profile.'}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setAuthMode('register')}
                    className="text-xs font-bold text-emerald-700 hover:text-emerald-900 bg-white px-2.5 py-1 rounded border border-emerald-300 shadow-2xs hover:bg-emerald-50 transition-colors shrink-0 cursor-pointer"
                  >
                    {lang === 'mr' ? 'नोंदणी करा →' : 'Register Now →'}
                  </button>
                </div>
              )}

              {/* Quick 1-Click Access Section */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-700">
                    {lang === 'mr' ? 'त्वरित प्रवेश (१-क्लिक):' : 'Instant 1-Click Demo Login:'}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    {lang === 'mr' ? 'नोंदणीकृत खाते निवडा' : 'Select verified account'}
                  </span>
                </div>

                {tab === 'citizen' ? (
                  <div className="space-y-2">
                    {citizenPresets.map((preset) => (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => handleSelectUser({
                          id: preset.id,
                          name: preset.name,
                          email: preset.email,
                          enterprise: preset.enterprise,
                          role: preset.role,
                          sector: preset.sector,
                          district: preset.district,
                          scale: preset.scale,
                          language: lang
                        })}
                        className="w-full text-left p-2.5 rounded-lg border border-slate-200 hover:border-blue-900/40 bg-white hover:bg-blue-50/40 transition-all flex items-center justify-between group cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-900 font-bold flex items-center justify-center text-xs shrink-0">
                            {preset.name.charAt(0)}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-slate-900 group-hover:text-blue-900">
                                {preset.name}
                              </span>
                              <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-medium">
                                {preset.badge}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-500 mt-0.5">
                              {preset.enterprise} · {preset.district}
                            </p>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-blue-900 transition-colors" />
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-2">
                    {officerPresets.map((preset) => (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => handleSelectUser({
                          id: preset.id,
                          name: preset.name,
                          email: preset.email,
                          role: preset.role,
                          department: preset.department,
                          language: lang
                        })}
                        className="w-full text-left p-2.5 rounded-lg border border-slate-200 hover:border-emerald-600/50 bg-white hover:bg-emerald-50/40 transition-all flex items-center justify-between group cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-900 font-bold flex items-center justify-center text-xs shrink-0">
                            {preset.name.charAt(0)}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-slate-900 group-hover:text-emerald-900">
                                {preset.name}
                              </span>
                              <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-medium">
                                {preset.badge}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-500 mt-0.5">
                              {preset.title}
                            </p>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-emerald-900 transition-colors" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Divider */}
              <div className="relative flex items-center justify-center my-3">
                <div className="w-full border-t border-slate-200" />
                <span className="bg-white px-3 text-[11px] font-medium text-slate-400 absolute">
                  {lang === 'mr' ? 'किंवा इतर तपशीलासह' : 'or manual credentials'}
                </span>
              </div>

              {/* Standard Form */}
              <form onSubmit={handleFormLogin} className="space-y-3">
                {tab === 'citizen' ? (
                  <>
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">
                        {lang === 'mr' ? 'मोबाईल क्र. / आधार / ईमेल *' : 'Mobile / Aadhaar / Email *'}
                      </label>
                      <input
                        type="text"
                        value={citizenIdentifier}
                        onChange={(e) => setCitizenIdentifier(e.target.value)}
                        placeholder="e.g. 9822012345 or user@example.com"
                        className="w-full px-3 py-2 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-blue-900 focus:outline-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">
                        {lang === 'mr' ? 'ओटीपी / पासवर्ड' : 'OTP / Password'}
                      </label>
                      <input
                        type="password"
                        value={citizenOtp}
                        onChange={(e) => setCitizenOtp(e.target.value)}
                        placeholder="••••••"
                        className="w-full px-3 py-2 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-blue-900 focus:outline-none"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">
                          {lang === 'mr' ? 'विभाग *' : 'Department *'}
                        </label>
                        <select
                          value={officerDept}
                          onChange={(e) => setOfficerDept(e.target.value as Department)}
                          className="w-full px-3 py-2 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-blue-900 focus:outline-none bg-white"
                        >
                          <option value="industries">MIDC (Industries)</option>
                          <option value="mpcb">MPCB (Pollution)</option>
                          <option value="fire">Fire & Emergency</option>
                          <option value="labour">Labour (DISH)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">
                          {lang === 'mr' ? 'अधिकारी आयडी *' : 'Govt Employee ID *'}
                        </label>
                        <input
                          type="text"
                          value={officerEmpId}
                          onChange={(e) => setOfficerEmpId(e.target.value)}
                          className="w-full px-3 py-2 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-blue-900 focus:outline-none"
                          required
                        />
                      </div>
                    </div>
                  </>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded text-xs font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer mt-2"
                >
                  {loading ? (
                    <span>{lang === 'mr' ? 'पडताळणी करत आहे...' : 'Verifying...'}</span>
                  ) : (
                    <>
                      <Lock className="w-3.5 h-3.5 text-amber-400" />
                      <span>{lang === 'mr' ? 'सुरक्षित प्रवेश करा' : 'Sign In Securely'}</span>
                    </>
                  )}
                </button>
              </form>

            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW 2: NEW USER REGISTRATION */}
        {/* ========================================================================= */}
        {authMode === 'register' && (
          <div className="p-6 max-h-[65vh] overflow-y-auto no-scrollbar space-y-4">
            
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md text-xs text-red-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {successMsg && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-md text-xs text-emerald-800 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>{successMsg}</span>
              </div>
            )}

            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              
              {/* Applicant Personal Details */}
              <div className="space-y-2.5 bg-slate-50 p-3.5 rounded-lg border border-slate-200">
                <span className="text-[11px] font-bold text-slate-800 uppercase tracking-wider block">
                  1. {lang === 'mr' ? 'अर्जदार / प्रमोटर तपशील' : 'Applicant / Promotor Details'}
                </span>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    {lang === 'mr' ? 'पूर्ण नाव *' : 'Full Name *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder={lang === 'mr' ? 'उदा. अनिकेत सुरेश शिंदे' : 'e.g. Aniket Suresh Shinde'}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-blue-900 focus:outline-none bg-white"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      {lang === 'mr' ? 'मोबाईल क्र. *' : 'Mobile Number *'}
                    </label>
                    <div className="flex">
                      <span className="inline-flex items-center px-2.5 rounded-l border border-r-0 border-slate-300 bg-slate-100 text-slate-600 text-xs font-mono">
                        +91
                      </span>
                      <input
                        type="tel"
                        required
                        maxLength={10}
                        value={regMobile}
                        onChange={(e) => setRegMobile(e.target.value.replace(/\D/g, ''))}
                        placeholder="9822012345"
                        className="w-full px-3 py-2 text-xs border border-slate-300 rounded-r focus:ring-1 focus:ring-blue-900 focus:outline-none bg-white font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      {lang === 'mr' ? 'ईमेल पत्ता *' : 'Email Address *'}
                    </label>
                    <input
                      type="email"
                      required
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="promotor@enterprise.com"
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-blue-900 focus:outline-none bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Enterprise & Unit Details */}
              <div className="space-y-2.5 bg-slate-50 p-3.5 rounded-lg border border-slate-200">
                <span className="text-[11px] font-bold text-slate-800 uppercase tracking-wider block">
                  2. {lang === 'mr' ? 'उद्योग व प्रकल्प तपशील' : 'Enterprise & Unit Profile'}
                </span>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    {lang === 'mr' ? 'उद्योग / कंपनीचे नाव *' : 'Enterprise / Factory Unit Name *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={regEnterprise}
                    onChange={(e) => setRegEnterprise(e.target.value)}
                    placeholder={lang === 'mr' ? 'उदा. सह्याद्री प्रिसिजन टूलिंग प्रा. लि.' : 'e.g. Sahyadri Precision Tooling Pvt Ltd'}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-blue-900 focus:outline-none bg-white"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      {lang === 'mr' ? 'महाराष्ट्र जिल्हा *' : 'Maharashtra District *'}
                    </label>
                    <select
                      value={regDistrict}
                      onChange={(e) => setRegDistrict(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-blue-900 focus:outline-none bg-white"
                    >
                      {MAHARASHTRA_DISTRICTS.map((dist) => (
                        <option key={dist} value={dist}>{dist}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      {lang === 'mr' ? 'उद्योगाचा प्रकार / स्केल' : 'Enterprise Scale (MSME)'}
                    </label>
                    <select
                      value={regScale}
                      onChange={(e) => setRegScale(e.target.value as any)}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-blue-900 focus:outline-none bg-white"
                    >
                      <option value="Micro">Micro (&lt; ₹1 Cr)</option>
                      <option value="Small">Small (₹1 Cr - ₹10 Cr)</option>
                      <option value="Medium">Medium (₹10 Cr - ₹50 Cr)</option>
                      <option value="Large">Large (&gt; ₹50 Cr)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      {lang === 'mr' ? 'औद्योगिक क्षेत्र *' : 'Industrial Sector *'}
                    </label>
                    <select
                      value={regSector}
                      onChange={(e) => setRegSector(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-blue-900 focus:outline-none bg-white"
                    >
                      {SECTORS.map((sec) => (
                        <option key={sec.id} value={sec.id}>
                          {lang === 'mr' ? sec.name_mr : sec.name_en}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      {lang === 'mr' ? 'उद्यम नोंदणी / पॅन (ऐच्छिक)' : 'Udyam No. / PAN (Optional)'}
                    </label>
                    <input
                      type="text"
                      value={regUdyam}
                      onChange={(e) => setRegUdyam(e.target.value.toUpperCase())}
                      placeholder="UDYAM-MH-26-0012345"
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-blue-900 focus:outline-none bg-white font-mono uppercase"
                    />
                  </div>
                </div>
              </div>

              {/* Statutory DPDP Act Consent Checkbox */}
              <div className="p-3 bg-emerald-50/60 border border-emerald-200 rounded-lg text-xs">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={regConsentAccepted}
                    onChange={(e) => setRegConsentAccepted(e.target.checked)}
                    className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                  />
                  <span className="text-slate-700 leading-relaxed text-[11px]">
                    {lang === 'mr' ? (
                      <>
                        मी <strong className="font-semibold text-slate-900">डिजिटल वैयक्तिक डेटा संरक्षण कायदा (DPDP), २०२३</strong> अंतर्गत महाराष्ट्र शासनाच्या विभागांमध्ये (MIDC, MPCB, अग्निशमन, कामगार) एकल खिडकी परवानग्यांसाठी व्यावसायिक ओळख व कागदपत्रे प्रक्रिया करण्याची संमती देतो.
                      </>
                    ) : (
                      <>
                        I consent under the <strong className="font-semibold text-slate-900">Digital Personal Data Protection (DPDP) Act, 2023</strong> for verified routing and processing of enterprise data across Maharashtra State Single Window clearance authorities.
                      </>
                    )}
                  </span>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 bg-emerald-700 hover:bg-emerald-800 text-white rounded text-xs font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs disabled:opacity-50"
              >
                {loading ? (
                  <span>{lang === 'mr' ? 'नोंदणी करत आहे...' : 'Creating Enterprise Profile...'}</span>
                ) : (
                  <>
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>{lang === 'mr' ? 'नोंदणी पूर्ण करा व लॉगिन करा' : 'Complete Registration & Sign In'}</span>
                  </>
                )}
              </button>

              <div className="text-center pt-1">
                <button
                  type="button"
                  onClick={() => setAuthMode('login')}
                  className="text-xs text-blue-900 hover:underline font-medium cursor-pointer"
                >
                  {lang === 'mr' ? 'आधीच खाते आहे? लॉगिन करा' : 'Already have an account? Sign In'}
                </button>
              </div>

            </form>
          </div>
        )}

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 text-center text-[11px] text-slate-500 flex items-center justify-between">
          <span className="flex items-center gap-1">
            <Lock className="w-3 h-3 text-emerald-600" />
            256-Bit SSL Encrypted · DPDP Compliant
          </span>
          <span>MahaSetu v1.0 · Govt of Maharashtra</span>
        </div>

      </div>
    </div>
  );
};
