import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Application, ApplicationStatus } from '../../types/dfd';
import {
  FileCheck2,
  Send,
  User,
  ArrowRight,
  Filter,
  CheckCircle2,
  Clock,
  XCircle,
  Calendar,
  Sparkles,
  MessageSquare,
  ShieldCheck,
} from 'lucide-react';

export const Process3_ProcessApplications: React.FC = () => {
  const {
    applications,
    vacancies,
    currentUser,
    submitApplication,
    updateApplicationStatus,
    hasPermission,
    setActiveTab,
    profiles,
  } = useApp();

  const [selectedVacancyId, setSelectedVacancyId] = useState<string>(vacancies[0]?.id || '');
  const [coverNote, setCoverNote] = useState('I am eager to contribute to this role with my background and technical skillset.');
  const [filterStage, setFilterStage] = useState<string>('ALL');
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [activeDecisionApp, setActiveDecisionApp] = useState<Application | null>(null);
  const [decisionNotes, setDecisionNotes] = useState('');

  const isRecruiterOrAdmin = hasPermission('PROCESS_APPLICATIONS');

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVacancyId) return;

    submitApplication(selectedVacancyId, coverNote);
    setShowApplyModal(false);
    setCoverNote('');
  };

  const handleUpdateStatus = (appId: string, newStatus: ApplicationStatus) => {
    updateApplicationStatus(appId, newStatus, decisionNotes);
    setActiveDecisionApp(null);
    setDecisionNotes('');
  };

  const statusColors: Record<ApplicationStatus, string> = {
    SUBMITTED: 'bg-slate-800 text-slate-300 border-slate-700',
    UNDER_REVIEW: 'bg-amber-950/80 text-amber-300 border-amber-800',
    SHORTLISTED: 'bg-blue-950/80 text-blue-300 border-blue-800',
    INTERVIEW_SCHEDULED: 'bg-indigo-950/80 text-indigo-300 border-indigo-800',
    OFFERED: 'bg-purple-950/80 text-purple-300 border-purple-800',
    REJECTED: 'bg-rose-950/80 text-rose-300 border-rose-800',
    HIRED: 'bg-emerald-950/80 text-emerald-300 border-emerald-800',
  };

  const filteredApps = applications.filter((app) => {
    if (filterStage !== 'ALL' && app.status !== filterStage) return false;
    // If Job seeker, only show their own applications
    if (currentUser?.role === 'JOB_SEEKER') {
      return app.candidateEmail === currentUser.email || app.candidateName.toLowerCase() === (currentUser.name || '').toLowerCase();
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-blue-600 text-white">
                Process 3.0
              </span>
              <span className="text-xs text-slate-400 font-mono">
                DFD Data Flow: Job seeker ➔ Application ➔ Process 3.0 ➔ Recruiter / D3 Applications
              </span>
            </div>
            <h1 className="text-xl font-bold text-white mt-1">Process Applications</h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Receives candidate applications into D3, delivers applicant list to Recruiters, and delivers decision status back to Job Seekers.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowApplyModal(true)}
              className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors shadow-sm whitespace-nowrap"
            >
              <Send className="w-3.5 h-3.5" />
              Submit Application
            </button>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="mt-5 pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-1 text-xs">
            <span className="text-slate-500 mr-2 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Stage:
            </span>
            {['ALL', 'SUBMITTED', 'UNDER_REVIEW', 'SHORTLISTED', 'INTERVIEW_SCHEDULED', 'OFFERED', 'HIRED', 'REJECTED'].map((st) => (
              <button
                key={st}
                onClick={() => setFilterStage(st)}
                className={`px-2.5 py-1 rounded-md text-xs transition-colors ${
                  filterStage === st
                    ? 'bg-slate-800 text-white font-medium shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {st.replace('_', ' ')}
              </button>
            ))}
          </div>

          <div className="text-xs text-slate-400">
            Total Pipeline in D3: <span className="font-mono font-bold text-white">{applications.length}</span>
          </div>
        </div>
      </div>

      {/* Applications List */}
      <div className="space-y-3">
        {filteredApps.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center text-xs text-slate-400">
            <FileCheck2 className="w-8 h-8 text-slate-600 mx-auto mb-2" />
            <div>No applications match current filters.</div>
            <div className="text-slate-500 mt-1">Submit an application above to initiate Process 3.0!</div>
          </div>
        ) : (
          filteredApps.map((app) => (
            <div
              key={app.id}
              className="bg-slate-900 border border-slate-800 rounded-xl p-4 hover:border-slate-700 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-slate-500">{app.id}</span>
                  <span className="text-slate-600">·</span>
                  <span className="font-bold text-sm text-white">{app.candidateName}</span>
                  <span className="text-slate-600">·</span>
                  <span className="text-xs text-indigo-400 font-medium">{app.vacancyTitle}</span>
                </div>

                <div className="text-xs text-slate-400">
                  {app.candidateHeadline} · Applied on{' '}
                  <span className="font-mono text-slate-300">
                    {new Date(app.appliedAt).toLocaleDateString()}
                  </span>
                </div>

                {app.coverNote && (
                  <p className="text-xs text-slate-400 italic line-clamp-1 pt-1">
                    "{app.coverNote}"
                  </p>
                )}

                {app.recruiterNotes && (
                  <div className="text-[11px] text-blue-300 pt-1 flex items-center gap-1.5">
                    <MessageSquare className="w-3 h-3 text-blue-400 shrink-0" />
                    <span>Recruiter notes: {app.recruiterNotes}</span>
                  </div>
                )}
              </div>

              {/* Status and Action Controls */}
              <div className="flex items-center gap-3 shrink-0">
                <span
                  className={`text-[10px] font-mono px-2.5 py-1 rounded-md uppercase font-bold border ${
                    statusColors[app.status]
                  }`}
                >
                  {app.status.replace('_', ' ')}
                </span>

                {isRecruiterOrAdmin && (
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setActiveDecisionApp(app)}
                      className="px-3 py-1.5 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors border border-slate-700 whitespace-nowrap"
                    >
                      Decision
                    </button>
                    <button
                      onClick={() => setActiveTab('interviews')}
                      className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors whitespace-nowrap"
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      Schedule (5.0)
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Submit Application Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-lg w-full p-6 shadow-2xl relative">
            <h2 className="text-lg font-bold text-white">Submit Job Application</h2>
            <p className="text-xs text-slate-400 mt-1">
              Data flow: Job Seeker ➔ Application ➔ D3 Applications.
            </p>

            <form onSubmit={handleApply} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Select Active Vacancy (D1)
                </label>
                <select
                  value={selectedVacancyId}
                  onChange={(e) => setSelectedVacancyId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                >
                  {vacancies.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.title} ({v.department}) - {v.salaryRange}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Candidate Profile Linked (D2)
                </label>
                <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-slate-300">
                  <div className="font-semibold text-white">{currentUser?.name || 'Applicant'}</div>
                  <div className="text-slate-400">{currentUser?.email || 'applicant@devmail.org'}</div>
                  <div className="text-[11px] text-emerald-400 mt-1">
                    Profile and extracted skills from D2 will be linked to this application.
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Cover Note / Pitch
                </label>
                <textarea
                  rows={4}
                  value={coverNote}
                  onChange={(e) => setCoverNote(e.target.value)}
                  placeholder="Explain why you are the ideal candidate for this role..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowApplyModal(false)}
                  className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors"
                >
                  Submit to Process 3.0
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Recruiter Decision Modal */}
      {activeDecisionApp && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-md w-full p-6 shadow-2xl relative">
            <h2 className="text-base font-bold text-white">
              Recruiter Decision: {activeDecisionApp.candidateName}
            </h2>
            <div className="text-xs text-slate-400 mt-1">
              Position: {activeDecisionApp.vacancyTitle}
            </div>

            <div className="mt-4">
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Recruiter Notes & Feedback
              </label>
              <textarea
                rows={3}
                value={decisionNotes}
                onChange={(e) => setDecisionNotes(e.target.value)}
                placeholder="Assessment notes recorded in audit log..."
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800">
              <div className="text-xs font-medium text-slate-400 mb-2">Set Application Stage:</div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  onClick={() => handleUpdateStatus(activeDecisionApp.id, 'SHORTLISTED')}
                  className="px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium transition-colors"
                >
                  Shortlist for Interview
                </button>
                <button
                  onClick={() => handleUpdateStatus(activeDecisionApp.id, 'UNDER_REVIEW')}
                  className="px-3 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-medium transition-colors"
                >
                  Mark Under Review
                </button>
                <button
                  onClick={() => handleUpdateStatus(activeDecisionApp.id, 'OFFERED')}
                  className="px-3 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-medium transition-colors"
                >
                  Extend Offer
                </button>
                <button
                  onClick={() => handleUpdateStatus(activeDecisionApp.id, 'REJECTED')}
                  className="px-3 py-2 rounded-lg bg-rose-900/60 hover:bg-rose-800 text-rose-200 border border-rose-800 font-medium transition-colors"
                >
                  Reject Application
                </button>
              </div>
            </div>

            <div className="mt-4 text-right">
              <button
                onClick={() => setActiveDecisionApp(null)}
                className="text-xs text-slate-400 hover:text-white"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
