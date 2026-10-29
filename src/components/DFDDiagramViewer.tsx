import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  ExternalLink,
  Layers,
  Database,
  Cpu,
  Mail,
  Users,
  Briefcase,
  FileText,
  BarChart3,
  Calendar,
  Sparkles,
  ShieldCheck,
  Maximize2,
  Info,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';

interface DFDDiagramViewerProps {
  onSelectProcess?: (processId: string) => void;
  onSelectStore?: (storeId: string) => void;
}

export const DFDDiagramViewer: React.FC<DFDDiagramViewerProps> = ({
  onSelectProcess,
  onSelectStore,
}) => {
  const {
    activeDFDHighlight,
    vacancies,
    profiles,
    applications,
    matchResults,
    interviews,
    setActiveTab,
    triggerDFDHighlight,
  } = useApp();

  const [showOriginalScreenshot, setShowOriginalScreenshot] = useState(false);
  const [selectedEntityInfo, setSelectedEntityInfo] = useState<string | null>(null);

  const isHighlighted = (id: string) => activeDFDHighlight === id;

  const handleProcessClick = (tab: string, nodeId: string) => {
    triggerDFDHighlight(nodeId);
    if (onSelectProcess) {
      onSelectProcess(tab);
    } else {
      setActiveTab(tab);
    }
  };

  const handleStoreClick = (tab: string, nodeId: string) => {
    triggerDFDHighlight(nodeId);
    if (onSelectStore) {
      onSelectStore(tab);
    } else {
      setActiveTab(tab);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs relative overflow-hidden space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-wider text-emerald-600 font-bold">
              Architecture Blueprint
            </span>
            <span className="text-slate-300">·</span>
            <span className="text-xs text-slate-500 font-medium">Level-1 Data Flow Engine</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight mt-1">
            Recruitment System DFD Matrix
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Interactive visualization of the 6 processes, 5 persistent data stores, and 7 external entities
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowOriginalScreenshot(!showOriginalScreenshot)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors border border-slate-200 whitespace-nowrap"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            {showOriginalScreenshot ? 'Hide Reference Image' : 'View Lecture Slide DFD'}
          </button>
          <div className="hidden lg:flex items-center gap-3 text-xs text-slate-500 pl-2">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>
              External Entity
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600 inline-block"></span>
              DFD Process
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 inline-block"></span>
              Data Store (D1-D5)
            </span>
          </div>
        </div>
      </div>

      {/* Side-by-Side Original Lecture Slide Diagram Image */}
      {showOriginalScreenshot && (
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 animate-fadeIn space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-800 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-emerald-600" />
              User Provided Blueprint (Baseline Lecture Slide Specification)
            </span>
            <span className="text-slate-500 font-mono text-[11px]">6 Processes · 5 Data Stores · 7 Entities</span>
          </div>
          <div className="max-h-96 overflow-y-auto rounded-xl border border-slate-200 bg-white p-2 flex justify-center">
            <img
              src="/public/assets/aistudio/Screenshot_20261028-231742_77cc33e3.jpg"
              alt="Level-1 Data Flow Diagram"
              className="max-h-[500px] object-contain rounded-lg"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
        </div>
      )}

      {/* Interactive Level-1 DFD Layout Canvas */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-stretch">
        {/* Left Column: Client / Human External Entities */}
        <div className="xl:col-span-3 flex flex-col justify-between gap-3">
          <div className="text-xs uppercase font-mono tracking-wider text-slate-400 font-bold mb-1">
            Input Entities (Actors)
          </div>

          {/* Entity: Employer */}
          <div
            onClick={() => setSelectedEntityInfo('Employer: Submits job vacancies, monitors applicant counts and posting status.')}
            className="group p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 hover:border-emerald-400 hover:shadow-xs transition-all cursor-pointer relative"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-emerald-600" />
                <span className="font-bold text-sm text-emerald-950">Employer</span>
              </div>
              <span className="text-[10px] font-mono text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full font-semibold">
                Entity
              </span>
            </div>
            <div className="mt-2 text-xs text-slate-600 leading-relaxed">
              Posts vacancies & receives publishing status confirmation.
            </div>
            <div className="mt-3 pt-2 border-t border-emerald-200/80 flex items-center justify-between text-xs text-emerald-800 font-medium">
              <span>Vacancy ➔ Status</span>
              <span className="font-mono font-bold">{vacancies.length} active</span>
            </div>
          </div>

          {/* Entity: Job seeker */}
          <div
            onClick={() => setSelectedEntityInfo('Job seeker: Uploads CV, builds profile, submits applications and receives status notifications.')}
            className="group p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 hover:border-emerald-400 hover:shadow-xs transition-all cursor-pointer relative"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-600" />
                <span className="font-bold text-sm text-emerald-950">Job seeker</span>
              </div>
              <span className="text-[10px] font-mono text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full font-semibold">
                Entity
              </span>
            </div>
            <div className="mt-2 text-xs text-slate-600 leading-relaxed">
              Uploads CV, completes profile data, and submits applications.
            </div>
            <div className="mt-3 pt-2 border-t border-emerald-200/80 flex items-center justify-between text-xs text-emerald-800 font-medium">
              <span>CV / Profile ➔ Status</span>
              <span className="font-mono font-bold">{profiles.length} profiles</span>
            </div>
          </div>

          {/* Entity: Recruiter */}
          <div
            onClick={() => setSelectedEntityInfo('Recruiter: Reviews applicants, triggers candidate matching, sets interview time slots and decides application progression.')}
            className="group p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 hover:border-emerald-400 hover:shadow-xs transition-all cursor-pointer relative"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span className="font-bold text-sm text-emerald-950">Recruiter</span>
              </div>
              <span className="text-[10px] font-mono text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full font-semibold">
                Entity
              </span>
            </div>
            <div className="mt-2 text-xs text-slate-600 leading-relaxed">
              Evaluates applicants, matches candidates, assigns interview slots.
            </div>
            <div className="mt-3 pt-2 border-t border-emerald-200/80 flex items-center justify-between text-xs text-emerald-800 font-medium">
              <span>Decision ➔ Ranked list</span>
              <span className="font-mono font-bold">{applications.length} pipeline</span>
            </div>
          </div>
        </div>

        {/* Center Column: The 6 DFD Processes (1.0 to 6.0) */}
        <div className="xl:col-span-6 flex flex-col justify-between gap-3">
          <div className="text-xs uppercase font-mono tracking-wider text-slate-400 font-bold mb-1 flex items-center justify-between">
            <span>6 Core DFD Processes</span>
            <span className="text-slate-400 text-[11px] font-sans font-normal">Click process to navigate</span>
          </div>

          {/* Process 1.0 */}
          <div
            onClick={() => handleProcessClick('job-listings', 'process-1')}
            className={`p-3.5 rounded-xl border transition-all cursor-pointer group relative ${
              isHighlighted('process-1')
                ? 'bg-blue-50 border-blue-500 shadow-md ring-2 ring-blue-500'
                : 'bg-blue-50/60 border-blue-200 hover:border-blue-400 hover:bg-blue-50'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-md text-xs font-mono font-bold bg-blue-600 text-white">
                  1.0
                </span>
                <span className="font-bold text-sm text-blue-950 group-hover:text-blue-700">
                  Manage vacancies (Job Listings)
                </span>
              </div>
              <span className="text-xs font-semibold text-blue-600 flex items-center gap-1">
                Open <ExternalLink className="w-3 h-3" />
              </span>
            </div>
            <div className="mt-1.5 flex items-center justify-between text-xs text-slate-600">
              <span>Employer ➔ Vacancy ➔ D1 Vacancies</span>
              <span className="font-mono font-semibold text-slate-800">{vacancies.length} records</span>
            </div>
          </div>

          {/* Process 2.0 */}
          <div
            onClick={() => handleProcessClick('candidates', 'process-2')}
            className={`p-3.5 rounded-xl border transition-all cursor-pointer group relative ${
              isHighlighted('process-2')
                ? 'bg-blue-50 border-blue-500 shadow-md ring-2 ring-blue-500'
                : 'bg-blue-50/60 border-blue-200 hover:border-blue-400 hover:bg-blue-50'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-md text-xs font-mono font-bold bg-blue-600 text-white">
                  2.0
                </span>
                <span className="font-bold text-sm text-blue-950 group-hover:text-blue-700">
                  Build candidate profiles
                </span>
              </div>
              <span className="text-xs font-semibold text-blue-600 flex items-center gap-1">
                Open <ExternalLink className="w-3 h-3" />
              </span>
            </div>
            <div className="mt-1.5 flex items-center justify-between text-xs text-slate-600">
              <span>CV / Profile ➔ AI/NLP Service ➔ D2 Profiles</span>
              <span className="font-mono font-semibold text-slate-800">{profiles.length} profiles</span>
            </div>
          </div>

          {/* Process 3.0 */}
          <div
            onClick={() => handleProcessClick('pipeline', 'process-3')}
            className={`p-3.5 rounded-xl border transition-all cursor-pointer group relative ${
              isHighlighted('process-3')
                ? 'bg-blue-50 border-blue-500 shadow-md ring-2 ring-blue-500'
                : 'bg-blue-50/60 border-blue-200 hover:border-blue-400 hover:bg-blue-50'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-md text-xs font-mono font-bold bg-blue-600 text-white">
                  3.0
                </span>
                <span className="font-bold text-sm text-blue-950 group-hover:text-blue-700">
                  Process applications
                </span>
              </div>
              <span className="text-xs font-semibold text-blue-600 flex items-center gap-1">
                Open <ExternalLink className="w-3 h-3" />
              </span>
            </div>
            <div className="mt-1.5 flex items-center justify-between text-xs text-slate-600">
              <span>Application ➔ Recruiter Decision ➔ D3 Applications</span>
              <span className="font-mono font-semibold text-slate-800">{applications.length} submitted</span>
            </div>
          </div>

          {/* Process 4.0 */}
          <div
            onClick={() => handleProcessClick('semantic-match', 'process-4')}
            className={`p-3.5 rounded-xl border transition-all cursor-pointer group relative ${
              isHighlighted('process-4')
                ? 'bg-blue-50 border-blue-500 shadow-md ring-2 ring-blue-500'
                : 'bg-blue-50/60 border-blue-200 hover:border-blue-400 hover:bg-blue-50'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-md text-xs font-mono font-bold bg-blue-600 text-white">
                  4.0
                </span>
                <span className="font-bold text-sm text-blue-950 group-hover:text-blue-700">
                  Match candidates (Semantic AI)
                </span>
              </div>
              <span className="text-xs font-semibold text-blue-600 flex items-center gap-1">
                Open <ExternalLink className="w-3 h-3" />
              </span>
            </div>
            <div className="mt-1.5 flex items-center justify-between text-xs text-slate-600">
              <span>Weights (Admin) + D1 + D2 ➔ Ranked List ➔ D4 Match</span>
              <span className="font-mono font-semibold text-slate-800">{matchResults.length} scored</span>
            </div>
          </div>

          {/* Process 5.0 */}
          <div
            onClick={() => handleProcessClick('calendar', 'process-5')}
            className={`p-3.5 rounded-xl border transition-all cursor-pointer group relative ${
              isHighlighted('process-5')
                ? 'bg-blue-50 border-blue-500 shadow-md ring-2 ring-blue-500'
                : 'bg-blue-50/60 border-blue-200 hover:border-blue-400 hover:bg-blue-50'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-md text-xs font-mono font-bold bg-blue-600 text-white">
                  5.0
                </span>
                <span className="font-bold text-sm text-blue-950 group-hover:text-blue-700">
                  Schedule and notify
                </span>
              </div>
              <span className="text-xs font-semibold text-blue-600 flex items-center gap-1">
                Open <ExternalLink className="w-3 h-3" />
              </span>
            </div>
            <div className="mt-1.5 flex items-center justify-between text-xs text-slate-600">
              <span>Time Slot ➔ Email/SMS Gateway ➔ D5 Interviews</span>
              <span className="font-mono font-semibold text-slate-800">{interviews.length} scheduled</span>
            </div>
          </div>

          {/* Process 6.0 */}
          <div
            onClick={() => handleProcessClick('analytics', 'process-6')}
            className={`p-3.5 rounded-xl border transition-all cursor-pointer group relative ${
              isHighlighted('process-6')
                ? 'bg-blue-50 border-blue-500 shadow-md ring-2 ring-blue-500'
                : 'bg-blue-50/60 border-blue-200 hover:border-blue-400 hover:bg-blue-50'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-md text-xs font-mono font-bold bg-blue-600 text-white">
                  6.0
                </span>
                <span className="font-bold text-sm text-blue-950 group-hover:text-blue-700">
                  Produce reports (Recruitment Analytics)
                </span>
              </div>
              <span className="text-xs font-semibold text-blue-600 flex items-center gap-1">
                Open <ExternalLink className="w-3 h-3" />
              </span>
            </div>
            <div className="mt-1.5 flex items-center justify-between text-xs text-slate-600">
              <span>D1 + D3 + D5 Aggregate ➔ Hiring Reports to Management</span>
              <span className="font-mono font-bold text-emerald-600">Live Analytics</span>
            </div>
          </div>
        </div>

        {/* Right Column: External Gateways & Management */}
        <div className="xl:col-span-3 flex flex-col justify-between gap-3">
          <div className="text-xs uppercase font-mono tracking-wider text-slate-400 font-bold mb-1">
            External Entities & Services
          </div>

          {/* AI/NLP service */}
          <div
            onClick={() => handleProcessClick('candidates', 'entity-ai')}
            className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 hover:border-emerald-400 hover:shadow-xs transition-all cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span className="font-bold text-sm text-emerald-950">AI/NLP service</span>
              </div>
              <span className="text-[10px] font-mono text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full font-semibold">
                Entity
              </span>
            </div>
            <div className="mt-2 text-xs text-slate-600 leading-relaxed">
              CV text ➔ Semantic Skills extraction (Gemini 3.8 Flash).
            </div>
          </div>

          {/* Admin */}
          <div
            onClick={() => handleProcessClick('semantic-match', 'entity-admin')}
            className="p-4 rounded-xl bg-purple-50/70 border border-purple-200 hover:border-purple-400 hover:shadow-xs transition-all cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-purple-600" />
                <span className="font-bold text-sm text-purple-950">Admin</span>
              </div>
              <span className="text-[10px] font-mono text-purple-700 bg-purple-100 px-2 py-0.5 rounded-full font-semibold">
                Entity
              </span>
            </div>
            <div className="mt-2 text-xs text-slate-600 leading-relaxed">
              Configures weights, algorithm parameters, and skill taxonomies.
            </div>
          </div>

          {/* Email/SMS gateway */}
          <div
            onClick={() => handleProcessClick('calendar', 'entity-gateway')}
            className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 hover:border-amber-400 hover:shadow-xs transition-all cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-600" />
                <span className="font-bold text-sm text-amber-950">Email/SMS gateway</span>
              </div>
              <span className="text-[10px] font-mono text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full font-semibold">
                Entity
              </span>
            </div>
            <div className="mt-2 text-xs text-slate-600 leading-relaxed">
              Dispatches interview invites and candidate status updates.
            </div>
          </div>

          {/* Management */}
          <div
            onClick={() => handleProcessClick('analytics', 'entity-mgmt')}
            className="p-4 rounded-xl bg-indigo-50/70 border border-indigo-200 hover:border-indigo-400 hover:shadow-xs transition-all cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-indigo-600" />
                <span className="font-bold text-sm text-indigo-950">Management</span>
              </div>
              <span className="text-[10px] font-mono text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded-full font-semibold">
                Entity
              </span>
            </div>
            <div className="mt-2 text-xs text-slate-600 leading-relaxed">
              Receives executive pipeline and hiring velocity reports.
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Strip: The 5 Data Stores (D1 to D5) */}
      <div className="pt-4 border-t border-slate-100">
        <div className="flex items-center justify-between mb-3">
          <div className="text-xs uppercase font-mono tracking-wider text-slate-500 font-bold flex items-center gap-2">
            <Database className="w-4 h-4 text-indigo-600" />
            Data Stores (D1 to D5) · Persistent Database Repositories
          </div>
          <button
            onClick={() => handleStoreClick('datastore', 'store-all')}
            className="text-xs text-indigo-600 hover:text-indigo-800 transition-colors flex items-center gap-1 font-semibold"
          >
            Inspect Database Tables <ExternalLink className="w-3 h-3" />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {/* D1 Vacancies */}
          <div
            onClick={() => handleStoreClick('datastore', 'store-d1')}
            className={`p-3.5 rounded-xl border transition-all cursor-pointer text-left ${
              isHighlighted('store-d1')
                ? 'bg-indigo-50 border-indigo-400 ring-2 ring-indigo-500'
                : 'bg-slate-50 border-slate-200 hover:border-slate-300 hover:bg-white'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-indigo-600">D1</span>
              <span className="text-xs font-mono font-bold text-slate-800 tabular-nums">{vacancies.length}</span>
            </div>
            <div className="font-bold text-xs text-slate-900 mt-1">Vacancies</div>
            <div className="text-[11px] text-slate-500 mt-0.5 truncate">Job roles & criteria</div>
          </div>

          {/* D2 Profiles */}
          <div
            onClick={() => handleStoreClick('datastore', 'store-d2')}
            className={`p-3.5 rounded-xl border transition-all cursor-pointer text-left ${
              isHighlighted('store-d2')
                ? 'bg-indigo-50 border-indigo-400 ring-2 ring-indigo-500'
                : 'bg-slate-50 border-slate-200 hover:border-slate-300 hover:bg-white'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-indigo-600">D2</span>
              <span className="text-xs font-mono font-bold text-slate-800 tabular-nums">{profiles.length}</span>
            </div>
            <div className="font-bold text-xs text-slate-900 mt-1">Profiles</div>
            <div className="text-[11px] text-slate-500 mt-0.5 truncate">Candidate skills & CV</div>
          </div>

          {/* D3 Applications */}
          <div
            onClick={() => handleStoreClick('datastore', 'store-d3')}
            className={`p-3.5 rounded-xl border transition-all cursor-pointer text-left ${
              isHighlighted('store-d3')
                ? 'bg-indigo-50 border-indigo-400 ring-2 ring-indigo-500'
                : 'bg-slate-50 border-slate-200 hover:border-slate-300 hover:bg-white'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-indigo-600">D3</span>
              <span className="text-xs font-mono font-bold text-slate-800 tabular-nums">{applications.length}</span>
            </div>
            <div className="font-bold text-xs text-slate-900 mt-1">Applications</div>
            <div className="text-[11px] text-slate-500 mt-0.5 truncate">Submissions & stages</div>
          </div>

          {/* D4 Match results */}
          <div
            onClick={() => handleStoreClick('datastore', 'store-d4')}
            className={`p-3.5 rounded-xl border transition-all cursor-pointer text-left ${
              isHighlighted('store-d4')
                ? 'bg-indigo-50 border-indigo-400 ring-2 ring-indigo-500'
                : 'bg-slate-50 border-slate-200 hover:border-slate-300 hover:bg-white'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-indigo-600">D4</span>
              <span className="text-xs font-mono font-bold text-slate-800 tabular-nums">{matchResults.length}</span>
            </div>
            <div className="font-bold text-xs text-slate-900 mt-1">Match results</div>
            <div className="text-[11px] text-slate-500 mt-0.5 truncate">AI scores & gaps</div>
          </div>

          {/* D5 Interviews */}
          <div
            onClick={() => handleStoreClick('datastore', 'store-d5')}
            className={`p-3.5 rounded-xl border transition-all cursor-pointer text-left ${
              isHighlighted('store-d5')
                ? 'bg-indigo-50 border-indigo-400 ring-2 ring-indigo-500'
                : 'bg-slate-50 border-slate-200 hover:border-slate-300 hover:bg-white'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-indigo-600">D5</span>
              <span className="text-xs font-mono font-bold text-slate-800 tabular-nums">{interviews.length}</span>
            </div>
            <div className="font-bold text-xs text-slate-900 mt-1">Interviews</div>
            <div className="text-[11px] text-slate-500 mt-0.5 truncate">Slots & gateway sync</div>
          </div>
        </div>
      </div>

      {/* Info notice if clicked */}
      {selectedEntityInfo && (
        <div className="p-3.5 bg-slate-100 border border-slate-200 rounded-xl text-xs text-slate-800 flex items-center justify-between">
          <span>{selectedEntityInfo}</span>
          <button
            onClick={() => setSelectedEntityInfo(null)}
            className="text-slate-500 hover:text-slate-900 ml-2 text-xs font-semibold"
          >
            Dismiss
          </button>
        </div>
      )}
    </div>
  );
};
