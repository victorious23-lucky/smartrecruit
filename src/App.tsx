import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { DashboardView } from './components/DashboardView';
import { JobListingsView } from './components/JobListingsView';
import { CandidatesView } from './components/CandidatesView';
import { PipelineKanbanView } from './components/PipelineKanbanView';
import { SemanticMatchView } from './components/SemanticMatchView';
import { InterviewCalendarView } from './components/InterviewCalendarView';
import { RecruitmentAnalyticsView } from './components/RecruitmentAnalyticsView';
import { JobSeekerPortalView } from './components/JobSeekerPortalView';
import { DFDDiagramViewer } from './components/DFDDiagramViewer';
import { DataStoreInspector } from './components/DataStoreInspector';
import { UsersAdminView } from './components/UsersAdminView';
import { LoginPage } from './components/LoginPage';
import { ShieldAlert, ArrowLeft, Lock, Sparkles } from 'lucide-react';

const MainLayout: React.FC = () => {
  const {
    isAuthenticated,
    currentUser,
    activeTab,
    setActiveTab,
    canAccessTab,
    quickLoginAs,
  } = useApp();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  // If unauthenticated, render the dedicated, distinct Login Page
  if (!isAuthenticated || !currentUser) {
    return <LoginPage />;
  }

  // Check role-based route access
  const isAuthorizedForCurrentTab = canAccessTab(activeTab);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans antialiased selection:bg-emerald-500/20 selection:text-emerald-900">
      {/* Left Navigation Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Column */}
      <div className="lg:pl-64 flex flex-col flex-1 min-w-0">
        {/* Top Header */}
        <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        {/* Viewport Content Container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto animate-fadeIn">
          {!isAuthorizedForCurrentTab ? (
            /* Role-Based Access Denied Card */
            <div className="max-w-xl mx-auto my-12 bg-white rounded-2xl p-8 border border-slate-200/90 shadow-sm text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto border border-rose-100">
                <Lock className="w-7 h-7" />
              </div>

              <div>
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                  403 Forbidden · Role Restricted
                </span>
                <h2 className="text-xl font-bold text-slate-900 mt-2">
                  Access Restricted for Role: {currentUser.role}
                </h2>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Your current account does not have sufficient role permissions to access module <span className="font-mono font-semibold text-slate-700">'{activeTab}'</span>. Protected endpoints enforce strict role checks and record ownership.
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className="w-full sm:w-auto px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors flex items-center justify-center gap-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Return to Dashboard
                </button>

                <button
                  onClick={() => quickLoginAs('MASTER_ALL')}
                  className="w-full sm:w-auto px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors shadow-xs flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" /> Unlock All as Super Admin
                </button>
              </div>
            </div>
          ) : (
            /* Authorized View Rendering */
            <>
              {activeTab === 'dashboard' && <DashboardView />}
              {(activeTab === 'job-listings' || activeTab === 'vacancies') && <JobListingsView />}
              {(activeTab === 'candidates' || activeTab === 'profiles') && <CandidatesView />}
              {activeTab === 'pipeline' && <PipelineKanbanView />}
              {activeTab === 'calendar' && <InterviewCalendarView />}
              {activeTab === 'analytics' && <RecruitmentAnalyticsView />}
              {activeTab === 'semantic-match' && <SemanticMatchView />}
              {activeTab === 'jobseeker-portal' && <JobSeekerPortalView />}
              {activeTab === 'dfd-engine' && <DFDDiagramViewer />}
              {activeTab === 'datastore' && <DataStoreInspector />}
              {activeTab === 'users-admin' && <UsersAdminView />}

              {/* Legacy fallback tabs routing to unified views */}
              {activeTab === 'applications' && <PipelineKanbanView />}
              {activeTab === 'matching' && <SemanticMatchView />}
              {activeTab === 'interviews' && <InterviewCalendarView />}
              {activeTab === 'reports' && <RecruitmentAnalyticsView />}
              {activeTab === 'overview' && <DashboardView />}
            </>
          )}
        </main>

        {/* Bottom subtle footer */}
        <footer className="border-t border-slate-200 py-4 px-6 text-xs text-slate-500 bg-white">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
            <span>TalentaSync Recruitment Platform · Level-1 DFD Compliant</span>
            <span className="font-mono text-[11px] text-slate-400">
              Authenticated: {currentUser.name} ({currentUser.role}) · Session Active
            </span>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
