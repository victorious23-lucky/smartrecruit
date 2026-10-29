import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Application, ApplicationStatus } from '../types/dfd';
import {
  GitBranch,
  Search,
  Filter,
  Plus,
  MoreVertical,
  CheckCircle2,
  Calendar,
  Sparkles,
  ArrowRight,
  User,
  MoveRight,
} from 'lucide-react';

export const PipelineKanbanView: React.FC = () => {
  const {
    applications,
    updateApplicationStatus,
    setActiveTab,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAppDetail, setSelectedAppDetail] = useState<Application | null>(null);

  // Kanban Stage definitions matching Screenshot 5
  const stages: { key: ApplicationStatus | 'JOINED' | 'DROPPED'; label: string; subtext: string; color: string; dotColor: string }[] = [
    { key: 'SUBMITTED', label: 'Applied', subtext: 'New applications', color: 'border-blue-500', dotColor: 'bg-blue-500' },
    { key: 'UNDER_REVIEW', label: 'Screening', subtext: 'Under review', color: 'border-amber-500', dotColor: 'bg-amber-500' },
    { key: 'SHORTLISTED', label: 'Interview', subtext: 'In interview process', color: 'border-purple-500', dotColor: 'bg-purple-500' },
    { key: 'OFFERED', label: 'Offer', subtext: 'Offer extended', color: 'border-emerald-500', dotColor: 'bg-emerald-500' },
    { key: 'HIRED', label: 'Hired', subtext: 'Successfully hired', color: 'border-green-600', dotColor: 'bg-green-600' },
    { key: 'REJECTED', label: 'Rejected', subtext: 'Not selected', color: 'border-rose-500', dotColor: 'bg-rose-500' },
  ];

  // Candidates with source metadata matching Screenshot 5
  const candidatePool = [
    {
      id: 'APP-501',
      candidateName: 'Ella Green',
      vacancyTitle: 'Customer Success Manager',
      source: 'LinkedIn',
      status: 'SUBMITTED',
      appliedAt: '2026-10-24',
    },
    {
      id: 'APP-502',
      candidateName: 'Gabriel Evans',
      vacancyTitle: 'Security Engineer',
      source: 'Glassdoor',
      status: 'UNDER_REVIEW',
      appliedAt: '2026-10-23',
    },
    {
      id: 'APP-503',
      candidateName: 'Daniel Roberts',
      vacancyTitle: 'Senior Software Engineer',
      source: 'Company Website',
      status: 'SHORTLISTED',
      appliedAt: '2026-10-22',
    },
    {
      id: 'APP-504',
      candidateName: 'Sophia Chen',
      vacancyTitle: 'Staff Distributed Systems Engineer',
      source: 'Referral',
      status: 'SHORTLISTED',
      appliedAt: '2026-10-21',
    },
    {
      id: 'APP-505',
      candidateName: 'Darius Vance-Kowalski',
      vacancyTitle: 'Senior AI Research Scientist',
      source: 'LinkedIn',
      status: 'OFFERED',
      appliedAt: '2026-10-20',
    },
    {
      id: 'APP-506',
      candidateName: 'Maya Lin-Peterson',
      vacancyTitle: 'Lead Full-Stack Web Architect',
      source: 'Direct Sourcing',
      status: 'HIRED',
      appliedAt: '2026-10-18',
    },
    {
      id: 'APP-507',
      candidateName: 'Alexandre Mercier',
      vacancyTitle: 'DevOps Security Specialist',
      source: 'Indeed',
      status: 'UNDER_REVIEW',
      appliedAt: '2026-10-26',
    },
    {
      id: 'APP-508',
      candidateName: 'Lucas Thorne',
      vacancyTitle: 'Frontend Engineer',
      source: 'AngelList',
      status: 'REJECTED',
      appliedAt: '2026-10-15',
    },
  ];

  const handleStageShift = (candId: string, newStage: ApplicationStatus) => {
    updateApplicationStatus(candId, newStage, 'Stage transitioned via Kanban board');
  };

  const filteredPool = candidatePool.filter((c) =>
    c.candidateName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.vacancyTitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <span>TalentaSync</span>
            <span>›</span>
            <span className="text-slate-800 font-semibold">Pipeline (Kanban)</span>
            <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 font-bold border border-blue-200">
              Process 3.0 · D3
            </span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight mt-1 flex items-center gap-2">
            <GitBranch className="w-5 h-5 text-emerald-600" />
            Pipeline (Kanban)
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            DFD Process 3.0 · Drag cards across stages to record recruiter evaluations and commit status to D3 Applications
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              placeholder="Search candidates, jobs... (⌘K)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white border border-slate-200 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-emerald-500 shadow-xs"
            />
          </div>
          <button
            onClick={() => setActiveTab('semantic-match')}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5" /> Match AI
          </button>
        </div>
      </div>

      {/* Stage Summary Pill Strip (Exactly matching Screenshot 5) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
        {stages.map((st) => {
          const count = filteredPool.filter((c) => c.status === st.key).length;
          return (
            <div
              key={st.key}
              className="bg-white rounded-xl p-3 border border-slate-200/90 shadow-xs flex items-center justify-between"
            >
              <div>
                <div className="flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${st.dotColor}`}></span>
                  <span className="text-xs font-bold text-slate-800">{st.label}</span>
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">{st.subtext}</div>
              </div>
              <span className="text-sm font-black font-mono text-slate-900 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-200">
                {count}
              </span>
            </div>
          );
        })}
      </div>

      {/* Multi-Column Kanban Board */}
      <div className="overflow-x-auto pb-4">
        <div className="flex gap-4 min-w-[1100px] items-start">
          {stages.map((stage) => {
            const cardsInStage = filteredPool.filter((c) => c.status === stage.key);
            return (
              <div
                key={stage.key}
                className="flex-1 bg-slate-100/70 rounded-2xl p-3.5 border border-slate-200 min-w-[240px] space-y-3"
              >
                {/* Column Header */}
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${stage.dotColor}`}></span>
                    <span className="font-bold text-xs text-slate-800">{stage.label}</span>
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-500 bg-white px-2 py-0.5 rounded-full shadow-xs">
                    {cardsInStage.length}
                  </span>
                </div>

                {/* Candidate Cards */}
                <div className="space-y-2.5">
                  {cardsInStage.length === 0 ? (
                    <div className="p-6 text-center text-xs text-slate-400 border border-dashed border-slate-200 rounded-xl">
                      No candidates in {stage.label}
                    </div>
                  ) : (
                    cardsInStage.map((card) => {
                      const initials = card.candidateName
                        .split(' ')
                        .map((n) => n[0])
                        .join('');

                      return (
                        <div
                          key={card.id}
                          className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-xs hover:shadow-md transition-all space-y-2 group"
                        >
                          <div className="flex items-start gap-2.5">
                            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs shrink-0 font-mono">
                              {initials}
                            </div>
                            <div className="truncate flex-1">
                              <h4 className="font-bold text-xs text-slate-900 group-hover:text-emerald-700 transition-colors truncate">
                                {card.candidateName}
                              </h4>
                              <p className="text-[11px] text-slate-500 truncate mt-0.5">
                                {card.vacancyTitle}
                              </p>
                            </div>
                          </div>

                          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px]">
                            <span className="text-slate-400 font-medium bg-slate-50 px-1.5 py-0.5 rounded border border-slate-200">
                              {card.source}
                            </span>

                            {/* Stage Transition Selector */}
                            <select
                              value={card.status}
                              onChange={(e) => handleStageShift(card.id, e.target.value as any)}
                              className="bg-slate-50 border border-slate-200 rounded px-1.5 py-0.5 text-[10px] text-slate-700 font-semibold focus:outline-none focus:border-emerald-500 cursor-pointer"
                            >
                              <option value="SUBMITTED">Applied</option>
                              <option value="UNDER_REVIEW">Screening</option>
                              <option value="SHORTLISTED">Interview</option>
                              <option value="OFFERED">Offer</option>
                              <option value="HIRED">Hired</option>
                              <option value="REJECTED">Reject</option>
                            </select>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
