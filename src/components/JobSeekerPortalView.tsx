import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  FileText,
  Eye,
  Edit2,
  Download,
  Trash2,
  Plus,
  Search,
  CheckCircle,
  Building,
  Calendar,
  Sparkles,
} from 'lucide-react';

export const JobSeekerPortalView: React.FC = () => {
  const { setActiveTab } = useApp();

  const [searchJobQuery, setSearchJobQuery] = useState('');
  const [downloadMsg, setDownloadMsg] = useState<string | null>(null);

  const resumes = [
    {
      id: 'res-1',
      title: 'Software Engineer Resume',
      updated: 'Last updated: 2 days ago',
      primary: true,
    },
    {
      id: 'res-2',
      title: 'Data Analyst Resume (Finance)',
      updated: 'Last updated: 1 week ago',
      primary: false,
    },
    {
      id: 'res-3',
      title: 'Project Manager - Final Version',
      updated: 'Last updated: 3 weeks ago',
      primary: false,
    },
  ];

  const columns = [
    {
      id: 'applied',
      title: 'Applied',
      count: 20,
      color: 'bg-blue-50 text-blue-700',
      items: [
        { role: 'Software Engineer', company: 'Quantum Solutions', date: '2026-06-12' },
        { role: 'Cloud Architect', company: 'Zenith Systems', date: '2026-06-29' },
        { role: 'Backend Engineer', company: 'Apex Technologies', date: '2026-06-25' },
      ],
    },
    {
      id: 'initial',
      title: 'Initial Interview',
      count: 5,
      color: 'bg-indigo-50 text-indigo-700',
      items: [
        { role: 'Product Manager', company: 'HealthWell', date: '2026-06-08' },
        { role: 'Data Analyst', company: 'Innovate Inc.', date: '2026-06-05' },
        { role: 'UX/UI Designer', company: 'Quantum Solutions', date: '2026-06-07' },
      ],
    },
    {
      id: 'second',
      title: 'Second Round Interview',
      count: 1,
      color: 'bg-purple-50 text-purple-700',
      items: [
        { role: 'Software Engineer', company: 'Quantum Solutions', date: '2026-06-05' },
      ],
    },
    {
      id: 'offer',
      title: 'Offer',
      count: 1,
      color: 'bg-emerald-50 text-emerald-700',
      items: [
        { role: 'UX/UI Designer', company: 'HealthWell', date: '2026-06-02' },
      ],
    },
  ];

  const handleDownload = (name: string) => {
    setDownloadMsg(`Downloaded "${name}.pdf"`);
    setTimeout(() => setDownloadMsg(null), 2500);
  };

  return (
    <div className="space-y-8">
      {/* Page Header (Screenshot 3 Style) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Candidate Portal</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage your resumes, parse CV text with AI, and track your active job application statuses
          </p>
        </div>

        <button
          onClick={() => setActiveTab('candidates')}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-xs"
        >
          <Sparkles className="w-3.5 h-3.5" />
          AI Resume Builder (Process 2.0)
        </button>
      </div>

      {downloadMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2 animate-fadeIn">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{downloadMsg}</span>
        </div>
      )}

      {/* Section 1: My Resumes (Screenshot 3) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900">My Resumes</h2>
          <button
            onClick={() => setActiveTab('candidates')}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" /> + New Resume
          </button>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
          {resumes.map((resume) => (
            <div
              key={resume.id}
              className="flex items-center justify-between p-3.5 rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50/60 transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">{resume.title}</div>
                  <div className="text-[11px] text-slate-400 font-mono mt-0.5">{resume.updated}</div>
                </div>
              </div>

              <div className="flex items-center gap-3 text-slate-500">
                <button
                  onClick={() => setActiveTab('semantic-match')}
                  className="p-1.5 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                  title="View"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setActiveTab('candidates')}
                  className="p-1.5 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                  title="Edit"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDownload(resume.title)}
                  className="p-1.5 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                  title="Download"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section 2: My Job Applications Multi-Column Tracker (Screenshot 3) */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h2 className="text-base font-bold text-slate-900">My Job Applications</h2>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                placeholder="Search by company or job title..."
                value={searchJobQuery}
                onChange={(e) => setSearchJobQuery(e.target.value)}
                className="bg-white border border-slate-200 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500 shadow-xs"
              />
            </div>
            <button
              onClick={() => setActiveTab('job-listings')}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors shadow-xs whitespace-nowrap"
            >
              <Plus className="w-3.5 h-3.5" /> + Add Job
            </button>
          </div>
        </div>

        {/* 4 Column Tracker */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-start">
          {columns.map((col) => (
            <div key={col.id} className="space-y-3">
              {/* Column Header Pill */}
              <div
                className={`py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-between ${col.color}`}
              >
                <span>{col.title}</span>
                <span className="font-mono">({col.count})</span>
              </div>

              {/* Job Cards */}
              <div className="space-y-2.5">
                {col.items.map((job, idx) => (
                  <div
                    key={idx}
                    className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-xs hover:shadow-md transition-all space-y-1.5"
                  >
                    <div className="flex items-start justify-between">
                      <div className="font-bold text-xs text-slate-900">{job.role}</div>
                      <button className="text-slate-300 hover:text-rose-500 transition-colors">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="text-xs text-slate-500">{job.company}</div>
                    <div className="text-[10px] text-slate-400 font-mono pt-1">
                      Applied: {job.date}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
