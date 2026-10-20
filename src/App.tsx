import React, { useState } from 'react';
import { Header } from './components/Header';
import { CitizenWizard } from './components/CitizenWizard';
import { TrackingTimeline } from './components/TrackingTimeline';
import { OfficerQueue } from './components/OfficerQueue';
import { AdminDashboard } from './components/AdminDashboard';
import { AssistantChatModal } from './components/AssistantChatModal';
import { LoginModal } from './components/LoginModal';
import { Application, UserSession } from './types';
import { translations } from './i18n/translations';

export default function App() {
  const [lang, setLang] = useState<'en' | 'mr'>('en');
  const [activeTab, setActiveTab] = useState<'citizen' | 'officer' | 'admin' | 'tracking'>('citizen');
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [currentTrackingId, setCurrentTrackingId] = useState<string>('');

  // Active User Session with instant verified profile
  const [userSession, setUserSession] = useState<UserSession | null>({
    id: 'usr-ravi',
    name: 'Ravi Patil',
    email: 'ravi@example.com',
    role: 'business',
    language: 'en'
  });

  const handleLoginSuccess = (user: UserSession) => {
    setUserSession(user);
    if (user.role === 'officer') {
      setActiveTab('officer');
    } else if (user.role === 'admin') {
      setActiveTab('admin');
    } else {
      setActiveTab('citizen');
    }
  };

  const handleSignOut = () => {
    setUserSession(null);
  };

  // Demo Action Triggers (Still available for Admin simulation if needed)
  const handleTriggerDemoFailure = async () => {
    await fetch('/v1/admin/demo/fail-next', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ department: 'mpcb' }),
    });
  };

  const handleTriggerFastSla = async () => {
    await fetch('/v1/admin/demo/sla', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ seconds: 30 }),
    });
  };

  const handleApplicationCreated = (app: Application) => {
    setCurrentTrackingId(app.tracking_id);
  };

  const handleOpenTracking = (trackingId: string) => {
    setCurrentTrackingId(trackingId);
    setActiveTab('tracking');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-blue-100 selection:text-blue-900">
      
      {/* Main Top Navigation Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        lang={lang}
        setLang={setLang}
        onOpenAssistant={() => setIsAssistantOpen(true)}
        userSession={userSession}
        onOpenLogin={() => setIsLoginOpen(true)}
        onSignOut={handleSignOut}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-16">
        {activeTab === 'citizen' && (
          <CitizenWizard
            lang={lang}
            userSession={userSession}
            onApplicationCreated={handleApplicationCreated}
            onOpenTracking={handleOpenTracking}
          />
        )}

        {activeTab === 'tracking' && (
          <TrackingTimeline
            currentTrackingId={currentTrackingId}
            lang={lang}
            onNavigateToWizard={() => setActiveTab('citizen')}
          />
        )}

        {activeTab === 'officer' && (
          <OfficerQueue
            department={userSession?.department || 'industries'}
            officerName={userSession?.name || 'Shri A. K. Deshmukh'}
            lang={lang}
          />
        )}

        {activeTab === 'admin' && (
          <AdminDashboard
            lang={lang}
            onTriggerDemoFailure={handleTriggerDemoFailure}
            onTriggerFastSla={handleTriggerFastSla}
          />
        )}
      </main>

      {/* Unified Citizen & Officer Login Modal / Portal */}
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        currentUser={userSession}
        onLoginSuccess={handleLoginSuccess}
        lang={lang}
      />

      {/* Rules-grounded Regulatory Assistant Modal */}
      <AssistantChatModal
        isOpen={isAssistantOpen}
        onClose={() => setIsAssistantOpen(false)}
        lang={lang}
      />

      {/* Official Government Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-800">MahaSetu</span>
            <span>·</span>
            <span>Government of Maharashtra · Single Window Interoperability Portal</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-slate-400">
            <span>Industries (MIDC)</span>
            <span>·</span>
            <span>Pollution Control (MPCB)</span>
            <span>·</span>
            <span>Fire Services</span>
            <span>·</span>
            <span>Labour (DISH)</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
