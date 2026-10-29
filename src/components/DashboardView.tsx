import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Briefcase,
  Users,
  Eye,
  TrendingUp,
  Clock,
  CheckCircle2,
  Calendar,
  ChevronDown,
  MoreVertical,
  Plus,
  ArrowUpRight,
  Video,
  Check,
  Building,
  Sparkles,
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const {
    vacancies,
    applications,
    interviews,
    setActiveTab,
    updateApplicationStatus,
  } = useApp();

  const [scheduleFilter, setScheduleFilter] = useState<'today' | 'tomorrow' | 'week'>('today');
  const [chartView, setChartView] = useState<'weekly' | 'monthly'>('monthly');

  // Realistic metrics matching TalentaSync & Joblings screenshots
  const totalOpenedJobs = 352;
  const totalApplicants = 18780;
  const totalReviewed = 14320;
  const totalShortlisted = 40;
  const totalHired = 12;
  const totalRejected = 78;

  // Chart data for Applicant Jobs stacked bars (Jan - Jul)
  const monthlyApplicantData = [
    { month: 'Jan', onSite: 32, hybrid: 28, remote: 40 },
    { month: 'Feb', onSite: 38, hybrid: 35, remote: 48 },
    { month: 'Mar', onSite: 30, hybrid: 42, remote: 52 },
    { month: 'Apr', onSite: 45, hybrid: 38, remote: 60 },
    { month: 'May', onSite: 50, hybrid: 44, remote: 72 },
    { month: 'Jun', onSite: 48, hybrid: 52, remote: 80 },
    { month: 'Jul', onSite: 55, hybrid: 60, remote: 95 },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Dashboard</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Overview of notes and active pipeline regarding HR & talent acquisition
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('job-listings')}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            Post a Job
          </button>
        </div>
      </div>

      {/* Top Metric Stat Cards Strip (TalentaSync / Joblings Style) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1 */}
        <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-xs hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700">
              <Briefcase className="w-5 h-5" />
            </div>
            <span className="text-xs font-mono text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-0.5">
              <ArrowUpRight className="w-3 h-3" /> +12%
            </span>
          </div>
          <div className="text-2xl font-black font-mono text-slate-900 mt-3 tabular-nums">
            {totalOpenedJobs}
          </div>
          <div className="text-xs font-medium text-slate-500 mt-0.5">Total opened jobs</div>
        </div>

        {/* Card 2 */}
        <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-xs hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
              <Users className="w-5 h-5" />
            </div>
            <span className="text-xs font-mono text-indigo-600 font-semibold bg-indigo-50 px-2 py-0.5 rounded-full flex items-center gap-0.5">
              <ArrowUpRight className="w-3 h-3" /> +9.4%
            </span>
          </div>
          <div className="text-2xl font-black font-mono text-slate-900 mt-3 tabular-nums">
            {totalApplicants.toLocaleString()}
          </div>
          <div className="text-xs font-medium text-slate-500 mt-0.5">Total applicants</div>
        </div>

        {/* Card 3 */}
        <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-xs hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
              <Eye className="w-5 h-5" />
            </div>
            <span className="text-xs font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
              76.2%
            </span>
          </div>
          <div className="text-2xl font-black font-mono text-slate-900 mt-3 tabular-nums">
            {totalReviewed.toLocaleString()}
          </div>
          <div className="text-xs font-medium text-slate-500 mt-0.5">Total reviewed</div>
        </div>

        {/* Card 4 */}
        <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-xs hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
              <TrendingUp className="w-5 h-5" />
            </div>
            <span className="text-xs font-mono text-amber-600 font-semibold bg-amber-50 px-2 py-0.5 rounded-full">
              Hired: {totalHired}
            </span>
          </div>
          <div className="text-2xl font-black font-mono text-slate-900 mt-3 tabular-nums">
            {totalShortlisted}
          </div>
          <div className="text-xs font-medium text-slate-500 mt-0.5">Shortlisted candidates</div>
        </div>
      </div>

      {/* Main Grid: Chart Section (Left) & Schedule Widget (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Applicant Jobs Bar Chart Card */}
        <div className="lg:col-span-8 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900">Applicant Jobs</h2>
              <p className="text-xs text-slate-400">Total jobs applied by candidates in your company</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setChartView('weekly')}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                  chartView === 'weekly' ? 'bg-slate-900 text-white' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Weekly
              </button>
              <button
                onClick={() => setChartView('monthly')}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                  chartView === 'monthly' ? 'bg-slate-900 text-white' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Monthly
              </button>
            </div>
          </div>

          {/* Metric Callout */}
          <div className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl font-black font-mono text-slate-900 tracking-tight">9.42%</span>
              <div className="flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                <TrendingUp className="w-3.5 h-3.5" /> +2.1%
              </div>
              <span className="text-xs text-slate-400">
                Steady increase in candidate applications every week.
              </span>
            </div>

            {/* Legend */}
            <div className="flex items-center gap-4 text-xs font-medium text-slate-500">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-orange-300"></span> On-Site
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-sky-200"></span> Hybrid
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-900"></span> Remote
              </span>
            </div>
          </div>

          {/* Segmented Bar Chart */}
          <div className="mt-4 pt-6 border-t border-slate-100 flex items-end justify-between gap-3 h-56 px-2">
            {monthlyApplicantData.map((col) => {
              const totalHeight = col.onSite + col.hybrid + col.remote;
              return (
                <div key={col.month} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                  <div className="w-full max-w-[36px] flex flex-col-reverse rounded-t-lg overflow-hidden transition-all group-hover:opacity-90">
                    {/* Remote: Dark Slate */}
                    <div
                      style={{ height: `${(col.remote / 220) * 180}px` }}
                      className="bg-slate-900 w-full"
                      title={`Remote: ${col.remote}`}
                    ></div>
                    {/* Hybrid: Sky Blue */}
                    <div
                      style={{ height: `${(col.hybrid / 220) * 180}px` }}
                      className="bg-sky-200 w-full"
                      title={`Hybrid: ${col.hybrid}`}
                    ></div>
                    {/* On-Site: Coral/Orange */}
                    <div
                      style={{ height: `${(col.onSite / 220) * 180}px` }}
                      className="bg-orange-300 w-full"
                      title={`On-Site: ${col.onSite}`}
                    ></div>
                  </div>
                  <span className="text-xs font-mono text-slate-400 group-hover:text-slate-900 font-medium">
                    {col.month}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Schedule Widget (TalentaSync Style) */}
        <div className="lg:col-span-4 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">Schedule</h2>
            <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg text-[11px] font-medium text-slate-600">
              <button
                onClick={() => setScheduleFilter('today')}
                className={`px-2.5 py-1 rounded-md transition-all ${
                  scheduleFilter === 'today' ? 'bg-white text-slate-900 font-semibold shadow-xs' : ''
                }`}
              >
                Today
              </button>
              <button
                onClick={() => setScheduleFilter('tomorrow')}
                className={`px-2.5 py-1 rounded-md transition-all ${
                  scheduleFilter === 'tomorrow' ? 'bg-white text-slate-900 font-semibold shadow-xs' : ''
                }`}
              >
                Tomorrow
              </button>
              <button
                onClick={() => setScheduleFilter('week')}
                className={`px-2.5 py-1 rounded-md transition-all ${
                  scheduleFilter === 'week' ? 'bg-white text-slate-900 font-semibold shadow-xs' : ''
                }`}
              >
                This Week
              </button>
            </div>
          </div>

          {/* Pending Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">
              <span>Pending Interviews</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </div>

            {/* Interview Card 1 */}
            <div className="p-3.5 rounded-xl border border-slate-200/90 bg-slate-50/50 hover:bg-white hover:shadow-xs transition-all space-y-2">
              <div className="flex items-center justify-between text-xs font-mono text-slate-500">
                <span className="flex items-center gap-1 font-semibold text-slate-700">
                  <Clock className="w-3.5 h-3.5 text-indigo-500" />
                  09:00 - 09:30
                </span>
                <span className="text-[10px] font-sans px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 font-medium">
                  30 min call
                </span>
              </div>
              <div className="font-bold text-xs text-slate-900">
                Interview with Rubon Philips
              </div>
              <div className="text-[11px] text-slate-500 flex items-center justify-between">
                <span>December 30, 2026</span>
                <div className="flex -space-x-1.5 overflow-hidden">
                  <img
                    className="inline-block h-5 w-5 rounded-full ring-2 ring-white"
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=50&auto=format&fit=crop&q=80"
                    alt="Attendee"
                  />
                  <img
                    className="inline-block h-5 w-5 rounded-full ring-2 ring-white"
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&auto=format&fit=crop&q=80"
                    alt="Attendee"
                  />
                </div>
              </div>
            </div>

            {/* Interview Card 2 */}
            <div className="p-3.5 rounded-xl border border-slate-200/90 bg-slate-50/50 hover:bg-white hover:shadow-xs transition-all space-y-2">
              <div className="flex items-center justify-between text-xs font-mono text-slate-500">
                <span className="flex items-center gap-1 font-semibold text-slate-700">
                  <Clock className="w-3.5 h-3.5 text-indigo-500" />
                  10:30 - 11:30
                </span>
                <span className="text-[10px] font-sans px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 font-medium">
                  Tech Screen
                </span>
              </div>
              <div className="font-bold text-xs text-slate-900">
                Interview with Felix Oscar (Product Design)
              </div>
              <div className="text-[11px] text-slate-500 flex items-center justify-between">
                <span className="text-emerald-600 font-mono text-[10px]">meet.google.com/zau-psvf-tvh</span>
                <div className="flex -space-x-1.5 overflow-hidden">
                  <img
                    className="inline-block h-5 w-5 rounded-full ring-2 ring-white"
                    src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=50&auto=format&fit=crop&q=80"
                    alt="Attendee"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Completed Section */}
          <div className="pt-2 border-t border-slate-100 space-y-2">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">
              Completed
            </div>
            <div className="p-3 rounded-lg bg-slate-50 text-xs text-slate-600 flex items-center justify-between">
              <div>
                <div className="font-semibold text-slate-800">Interview with Sophia Chen</div>
                <div className="text-[10px] text-slate-400 font-mono">08:00 - 08:45 · Distributed Systems</div>
              </div>
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            </div>
          </div>

          <button
            onClick={() => setActiveTab('calendar')}
            className="w-full text-center py-2 text-xs font-semibold text-emerald-600 hover:text-emerald-700 bg-emerald-50 rounded-lg transition-colors"
          >
            Open Full Calendar Schedule ➔
          </button>
        </div>
      </div>

      {/* Bottom Section: Recently Applied Candidates Table (TalentaSync Style) */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <div>
            <h2 className="text-base font-bold text-slate-900">Recently Applied</h2>
            <p className="text-xs text-slate-400">Total jobs applied by candidates in your company</p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Filter:</span>
            <span className="text-xs font-medium text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md">
              Weekly
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-500 uppercase font-mono text-[10px] border-y border-slate-200">
              <tr>
                <th className="py-3 px-4 font-semibold">Candidate ID</th>
                <th className="py-3 px-4 font-semibold">Full Name</th>
                <th className="py-3 px-4 font-semibold">Role</th>
                <th className="py-3 px-4 font-semibold">Level</th>
                <th className="py-3 px-4 font-semibold">Application Date</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {applications.map((app) => {
                const isShortlist = app.status === 'SHORTLISTED';
                const isInterview = app.status === 'INTERVIEW_SCHEDULED';
                const isHired = app.status === 'HIRED';

                return (
                  <tr key={app.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-slate-700">{app.id}</td>
                    <td className="py-3 px-4 font-medium text-slate-900">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-[10px]">
                          {app.candidateName.split(' ').map((n) => n[0]).join('')}
                        </div>
                        <span>{app.candidateName}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-600">{app.vacancyTitle}</td>
                    <td className="py-3 px-4 font-mono text-slate-500">Senior</td>
                    <td className="py-3 px-4 font-mono text-slate-500">
                      {new Date(app.appliedAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                          isHired
                            ? 'bg-emerald-50 text-emerald-700'
                            : isInterview
                            ? 'bg-indigo-50 text-indigo-700'
                            : isShortlist
                            ? 'bg-blue-50 text-blue-700'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {app.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => setActiveTab('semantic-match')}
                        className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
                      >
                        Review AI Match ➔
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
