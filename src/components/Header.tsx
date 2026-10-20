import React, { useState, useRef, useEffect } from 'react';
import { Languages, BookOpen, User, ChevronDown, LogOut, Briefcase, Lock } from 'lucide-react';
import { translations } from '../i18n/translations';
import { UserSession } from '../types';

interface HeaderProps {
  activeTab: 'citizen' | 'officer' | 'admin' | 'tracking';
  setActiveTab: (tab: 'citizen' | 'officer' | 'admin' | 'tracking') => void;
  lang: 'en' | 'mr';
  setLang: (lang: 'en' | 'mr') => void;
  onOpenAssistant: () => void;
  userSession: UserSession | null;
  onOpenLogin: () => void;
  onSignOut: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  lang,
  setLang,
  onOpenAssistant,
  userSession,
  onOpenLogin,
  onSignOut,
}) => {
  const t = translations[lang];
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      {/* Official Government Accent Line */}
      <div className="h-0.5 bg-gradient-to-r from-orange-500 via-white to-emerald-600" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          
          {/* Brand: Clean Institutional Typography */}
          <div className="flex flex-col shrink-0">
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold tracking-tight text-slate-900 leading-tight">
                MahaSetu
              </span>
              <span className="text-[11px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                {lang === 'mr' ? 'महाराष्ट्र शासन' : 'Govt. of Maharashtra'}
              </span>
            </div>
            <span className="text-[11px] text-slate-500 hidden sm:inline leading-none mt-0.5">
              {lang === 'mr' ? 'एकल खिडकी उद्योग परवानगी व आंतरकार्यक्षमता प्रणाली' : 'Single Window Industrial Clearances & Interoperability Gateway'}
            </span>
          </div>

          {/* Clean Functional Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-xs font-semibold text-slate-600">
            <button
              onClick={() => setActiveTab('citizen')}
              className={`px-3.5 py-1.5 rounded-md transition-all cursor-pointer ${
                activeTab === 'citizen'
                  ? 'bg-white text-slate-900 shadow-xs font-bold'
                  : 'hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              {lang === 'mr' ? 'नवीन अर्ज' : 'New Application'}
            </button>

            <button
              onClick={() => setActiveTab('tracking')}
              className={`px-3.5 py-1.5 rounded-md transition-all cursor-pointer ${
                activeTab === 'tracking'
                  ? 'bg-white text-slate-900 shadow-xs font-bold'
                  : 'hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              {lang === 'mr' ? 'थेट स्थिती' : 'Track Status'}
            </button>

            <button
              onClick={() => setActiveTab('officer')}
              className={`px-3.5 py-1.5 rounded-md transition-all cursor-pointer ${
                activeTab === 'officer'
                  ? 'bg-white text-slate-900 shadow-xs font-bold'
                  : 'hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              {lang === 'mr' ? 'विभागीय डेस्क' : 'Department Desk'}
            </button>

            <button
              onClick={() => setActiveTab('admin')}
              className={`px-3.5 py-1.5 rounded-md transition-all cursor-pointer ${
                activeTab === 'admin'
                  ? 'bg-white text-slate-900 shadow-xs font-bold'
                  : 'hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              {lang === 'mr' ? 'प्रशासन व एसएलए' : 'Governance & SLAs'}
            </button>
          </nav>

          {/* Right Action Tools: Utilities, Login & Profile */}
          <div className="flex items-center gap-2">
            
            {/* Rules & Regulatory Help */}
            <button
              onClick={onOpenAssistant}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-md transition-colors cursor-pointer"
              title="View Regulatory Rules & Legal References"
            >
              <BookOpen className="w-3.5 h-3.5 text-slate-600" />
              <span className="hidden sm:inline">{lang === 'mr' ? 'नियम व मार्गदर्शक' : 'Rules & Guidance'}</span>
            </button>

            {/* Language Switcher */}
            <button
              onClick={() => setLang(lang === 'en' ? 'mr' : 'en')}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-md transition-colors cursor-pointer"
              title="Toggle English / Marathi"
            >
              <Languages className="w-3.5 h-3.5 text-slate-600" />
              <span>{lang === 'en' ? 'मराठी' : 'English'}</span>
            </button>

            {/* User Profile Logo / Login Button */}
            {userSession ? (
              <div className="relative" ref={profileRef}>
                <button
                  type="button"
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 px-2.5 py-1.5 rounded-md border border-slate-200 hover:border-slate-300 bg-slate-50 hover:bg-slate-100 transition-all cursor-pointer"
                  title="User Profile & Account"
                >
                  <div className="w-6 h-6 rounded-full bg-blue-900 text-white flex items-center justify-center text-xs font-bold shrink-0">
                    {userSession.name.charAt(0)}
                  </div>
                  <div className="hidden sm:flex flex-col text-left leading-none">
                    <span className="text-xs font-bold text-slate-900 max-w-[120px] truncate">
                      {userSession.name}
                    </span>
                    <span className="text-[10px] text-slate-500 capitalize mt-0.5">
                      {userSession.department ? `${userSession.department.toUpperCase()} Officer` : (userSession.role === 'business' ? 'Applicant' : userSession.role)}
                    </span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
                </button>

                {/* Dropdown Menu */}
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-60 bg-white border border-slate-200 rounded-lg shadow-xl z-50 py-1 text-xs animate-in fade-in zoom-in-95 duration-100">
                    <div className="px-3.5 py-2.5 border-b border-slate-100 bg-slate-50">
                      <p className="font-bold text-slate-900">{userSession.name}</p>
                      <p className="text-[11px] text-slate-500 truncate">{userSession.email}</p>
                      <div className="mt-1.5">
                        <span className="inline-block px-1.5 py-0.5 rounded bg-blue-100 text-blue-900 text-[10px] font-semibold uppercase">
                          {userSession.department ? `${userSession.department} Officer` : (userSession.role === 'business' ? 'Verified Applicant' : userSession.role)}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setIsProfileOpen(false);
                        onOpenLogin();
                      }}
                      className="w-full text-left px-3.5 py-2 hover:bg-slate-50 text-slate-700 font-medium flex items-center gap-2 cursor-pointer"
                    >
                      <User className="w-3.5 h-3.5 text-slate-500" />
                      <span>{lang === 'mr' ? 'खाते बदला / लॉगिन' : 'Switch Account / Login'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setIsProfileOpen(false);
                        setActiveTab('tracking');
                      }}
                      className="w-full text-left px-3.5 py-2 hover:bg-slate-50 text-slate-700 font-medium flex items-center gap-2 cursor-pointer"
                    >
                      <Briefcase className="w-3.5 h-3.5 text-slate-500" />
                      <span>{lang === 'mr' ? 'माझे अर्ज पहा' : 'My Applications'}</span>
                    </button>

                    <div className="border-t border-slate-100 my-1" />

                    <button
                      type="button"
                      onClick={() => {
                        setIsProfileOpen(false);
                        onSignOut();
                      }}
                      className="w-full text-left px-3.5 py-2 hover:bg-red-50 text-red-600 font-medium flex items-center gap-2 cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5 text-red-500" />
                      <span>{lang === 'mr' ? 'लॉग आऊट' : 'Sign Out'}</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                type="button"
                onClick={onOpenLogin}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-900 hover:bg-blue-800 rounded-md transition-colors cursor-pointer shadow-xs"
              >
                <User className="w-3.5 h-3.5" />
                <span>{lang === 'mr' ? 'लॉगिन' : 'Login'}</span>
              </button>
            )}

          </div>
        </div>

        {/* Mobile Navigation Row */}
        <div className="md:hidden flex items-center justify-between py-2 border-t border-slate-100 text-xs overflow-x-auto no-scrollbar gap-1">
          <button
            onClick={() => setActiveTab('citizen')}
            className={`px-2.5 py-1 rounded whitespace-nowrap cursor-pointer ${
              activeTab === 'citizen' ? 'bg-slate-900 text-white font-bold' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {lang === 'mr' ? 'नवीन अर्ज' : 'New Application'}
          </button>
          <button
            onClick={() => setActiveTab('tracking')}
            className={`px-2.5 py-1 rounded whitespace-nowrap cursor-pointer ${
              activeTab === 'tracking' ? 'bg-slate-900 text-white font-bold' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {lang === 'mr' ? 'थेट स्थिती' : 'Track Status'}
          </button>
          <button
            onClick={() => setActiveTab('officer')}
            className={`px-2.5 py-1 rounded whitespace-nowrap cursor-pointer ${
              activeTab === 'officer' ? 'bg-slate-900 text-white font-bold' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {lang === 'mr' ? 'विभागीय डेस्क' : 'Department Desk'}
          </button>
          <button
            onClick={() => setActiveTab('admin')}
            className={`px-2.5 py-1 rounded whitespace-nowrap cursor-pointer ${
              activeTab === 'admin' ? 'bg-slate-900 text-white font-bold' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {lang === 'mr' ? 'प्रशासन व एसएलए' : 'Governance & SLAs'}
          </button>
        </div>
      </div>
    </header>
  );
};
