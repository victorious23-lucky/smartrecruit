import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  BarChart3,
  TrendingUp,
  DollarSign,
  Clock,
  Users,
  CheckCircle2,
  PieChart,
  ArrowUpRight,
  Download,
} from 'lucide-react';

export const RecruitmentAnalyticsView: React.FC = () => {
  const { applications, vacancies, interviews, matchResults } = useApp();

  const [downloadSuccess, setDownloadSuccess] = useState(false);

  // Exact metrics from Screenshot 9
  const totalApplicants = 100;
  const shortlistedCandidates = 92;
  const hiredCandidates = 18;
  const rejectedCandidates = 8;
  const timeToHire = '15 days(s)';
  const costToHire = '$ 175';

  // Chart 1: Open position by department
  const openPosByDept = [
    { name: 'Accounts', count: 12, color: 'bg-emerald-500', hex: '#10B981' },
    { name: 'IT', count: 9, color: 'bg-blue-500', hex: '#3B82F6' },
    { name: 'Marketing', count: 16, color: 'bg-amber-500', hex: '#F59E0B' },
    { name: 'Operation', count: 3, color: 'bg-purple-500', hex: '#8B5CF6' },
    { name: 'HR', count: 2, color: 'bg-rose-500', hex: '#EF4444' },
    { name: 'Analytics', count: 11, color: 'bg-sky-500', hex: '#0EA5E9' },
  ];

  // Chart 2: Application Received By Source
  const appBySource = [
    { source: 'Job Boards', count: 32 },
    { source: 'Referrals', count: 27 },
    { source: 'Social Media', count: 22 },
    { source: 'Internal', count: 20 },
  ];

  // Chart 5: Application Received by Department
  const appByDept = [
    { name: 'Accounts', count: 20 },
    { name: 'Analytics', count: 8 },
    { name: 'HR', count: 12 },
    { name: 'IT', count: 22 },
    { name: 'Marketing', count: 21 },
    { name: 'Operation', count: 16 },
  ];

  // Chart 6: Department Wise Hiring Average Time
  const deptAvgTime = [
    { dept: 'Cust. Service', actual: 48, target: 40 },
    { dept: 'Engineering', actual: 62, target: 50 },
    { dept: 'HR', actual: 38, target: 35 },
    { dept: 'Finance', actual: 44, target: 42 },
    { dept: 'Marketing', actual: 52, target: 45 },
    { dept: 'Product', actual: 58, target: 50 },
    { dept: 'Sales', actual: 40, target: 38 },
  ];

  const handleExport = () => {
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Page Header (Matching Screenshot 9 & unified system structure) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <span>TalentaSync</span>
            <span>›</span>
            <span className="text-slate-800 font-semibold">Analytics & Reports</span>
            <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 font-bold border border-blue-200">
              Process 6.0 · D1, D3, D5
            </span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight mt-1">
            Recruitment Analytics Dashboard
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            DFD Process 6.0 · Synthesizes recruitment funnel, cost per hire, department velocity, and turnover analytics for executive management
          </p>
        </div>

        <button
          onClick={handleExport}
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors shadow-xs"
        >
          <Download className="w-3.5 h-3.5" />
          Export PDF / Report
        </button>
      </div>

      {downloadSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Recruitment analytics report exported successfully.</span>
        </div>
      )}

      {/* Top 6 KPI Summary Cards Strip (Exact values from Screenshot 9) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs text-center">
          <div className="text-[11px] font-semibold text-slate-500 uppercase font-mono">
            Total Applicants
          </div>
          <div className="text-2xl font-black font-mono text-slate-900 mt-1 tabular-nums">
            {totalApplicants}
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs text-center">
          <div className="text-[11px] font-semibold text-slate-500 uppercase font-mono">
            Shortlisted Candidates
          </div>
          <div className="text-2xl font-black font-mono text-slate-900 mt-1 tabular-nums">
            {shortlistedCandidates}
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs text-center">
          <div className="text-[11px] font-semibold text-slate-500 uppercase font-mono">
            Hired Candidates
          </div>
          <div className="text-2xl font-black font-mono text-emerald-600 mt-1 tabular-nums">
            {hiredCandidates}
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs text-center">
          <div className="text-[11px] font-semibold text-slate-500 uppercase font-mono">
            Rejected Candidates
          </div>
          <div className="text-2xl font-black font-mono text-rose-600 mt-1 tabular-nums">
            {rejectedCandidates}
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs text-center">
          <div className="text-[11px] font-semibold text-slate-500 uppercase font-mono">
            Time to hire
          </div>
          <div className="text-2xl font-black font-mono text-blue-600 mt-1 tabular-nums">
            {timeToHire}
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs text-center">
          <div className="text-[11px] font-semibold text-slate-500 uppercase font-mono">
            Cost to hire
          </div>
          <div className="text-2xl font-black font-mono text-emerald-700 mt-1 tabular-nums">
            {costToHire}
          </div>
        </div>
      </div>

      {/* 8 Charts Grid (Matching Screenshot 9 layout) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-stretch">
        {/* Chart 1: Open position by department */}
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs flex flex-col justify-between">
          <h3 className="text-xs font-bold text-slate-900 mb-3">Open position by department</h3>
          {/* Donut chart simulation */}
          <div className="flex items-center justify-center my-3">
            <div className="relative w-28 h-28 rounded-full border-8 border-indigo-500 flex items-center justify-center">
              <div className="absolute inset-2 rounded-full border-4 border-amber-400"></div>
              <span className="font-mono font-bold text-sm text-slate-800">53 pos</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-1 text-[10px] text-slate-600 mt-2">
            {openPosByDept.map((d) => (
              <div key={d.name} className="flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${d.color}`}></span>
                <span className="truncate">{d.name} {d.count} pos</span>
              </div>
            ))}
          </div>
        </div>

        {/* Chart 2: Application Received By Source */}
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs flex flex-col justify-between">
          <h3 className="text-xs font-bold text-slate-900 mb-3">Application Received By Source</h3>
          <div className="space-y-2.5 my-auto">
            {appBySource.map((s) => (
              <div key={s.source} className="space-y-1">
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-600 font-medium">{s.source}</span>
                  <span className="font-mono font-bold text-blue-600">{s.count}</span>
                </div>
                <div className="w-full bg-slate-100 h-3 rounded-md overflow-hidden">
                  <div
                    className="bg-blue-600 h-full rounded-md"
                    style={{ width: `${(s.count / 35) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-[10px] text-slate-400 text-right mt-2 font-mono">Max: 40 Applications</div>
        </div>

        {/* Chart 3: Recruiting Funnel */}
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold text-slate-900">Recruiting Funnel</h3>
            <div className="text-[10px] text-slate-400">Conversion across stages</div>
          </div>

          {/* Visual Funnel Stack */}
          <div className="space-y-1.5 my-3 text-center text-xs font-mono font-bold">
            <div className="bg-amber-100 text-amber-900 py-1.5 px-3 rounded-lg w-full">
              270 Applications
            </div>
            <div className="text-[10px] text-slate-400 font-sans">↓ 50%</div>
            <div className="bg-blue-100 text-blue-900 py-1.5 px-3 rounded-lg w-4/5 mx-auto">
              156 Interviews
            </div>
            <div className="text-[10px] text-slate-400 font-sans">↓ 36%</div>
            <div className="bg-indigo-100 text-indigo-900 py-1.5 px-3 rounded-lg w-3/5 mx-auto">
              55 Assessments
            </div>
            <div className="text-[10px] text-slate-400 font-sans">↓ 54%</div>
            <div className="bg-emerald-100 text-emerald-900 py-1.5 px-3 rounded-lg w-2/5 mx-auto">
              25 Hires
            </div>
          </div>

          <div className="text-[10px] text-slate-500 text-center font-medium">
            Overall Funnel Yield: <span className="font-bold text-emerald-600 font-mono">9.2%</span>
          </div>
        </div>

        {/* Chart 4: Offer Acceptance Ratio */}
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs flex flex-col justify-between text-center">
          <h3 className="text-xs font-bold text-slate-900 text-left">Offer Acceptance Ratio</h3>
          <div className="my-auto py-2">
            <div className="text-4xl font-black font-mono text-emerald-600">80%</div>
            <div className="text-xs text-slate-500 mt-2 font-medium">
              Offer Accepted: <span className="font-bold font-mono text-slate-800">19</span> · Offers Provided:{' '}
              <span className="font-bold font-mono text-slate-800">23</span>
            </div>
          </div>
          <div className="p-2 rounded-lg bg-emerald-50 text-[10px] text-emerald-800 font-medium">
            Exceeding quarterly target (75%)
          </div>
        </div>

        {/* Chart 5: Application Received by Department */}
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs flex flex-col justify-between">
          <h3 className="text-xs font-bold text-slate-900 mb-2">Application Received by Department</h3>
          <div className="flex items-end justify-between gap-1.5 h-36 pt-3 px-1">
            {appByDept.map((d) => (
              <div key={d.name} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                <span className="text-[9px] font-mono text-slate-600 font-bold">{d.count}</span>
                <div
                  className="w-full bg-sky-500 rounded-t-sm"
                  style={{ height: `${(d.count / 25) * 100}%` }}
                ></div>
                <span className="text-[9px] font-sans text-slate-500 truncate max-w-[34px]">{d.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Chart 6: Department Wise Hiring Average Time */}
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-xs font-bold text-slate-900">Dept Wise Hiring Avg Time</h3>
            <span className="text-[9px] font-mono text-slate-400">Target vs Actual</span>
          </div>
          <div className="flex items-end justify-between gap-1 h-36 pt-3 px-1">
            {deptAvgTime.map((d) => (
              <div key={d.dept} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                <div
                  className="w-full bg-amber-500 rounded-t-sm"
                  style={{ height: `${(d.actual / 70) * 100}%` }}
                ></div>
                <span className="text-[8px] font-sans text-slate-500 truncate max-w-[32px]">{d.dept}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Chart 7: Hiring Cost on Average by Seniority Level */}
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs flex flex-col justify-between">
          <h3 className="text-xs font-bold text-slate-900 mb-2">Hiring Cost by Seniority</h3>
          <div className="flex items-center justify-center my-auto">
            <div className="relative w-24 h-24 rounded-full border-8 border-sky-600 flex items-center justify-center">
              <span className="text-xs font-mono font-bold text-slate-800">$13.5k</span>
            </div>
          </div>
          <div className="space-y-1 text-[10px] text-slate-600 pt-2 border-t border-slate-100">
            <div className="flex justify-between">
              <span>Junior Level:</span>
              <span className="font-mono font-bold text-slate-800">$6,325 (43%)</span>
            </div>
            <div className="flex justify-between">
              <span>Mid-Level:</span>
              <span className="font-mono font-bold text-slate-800">$3,152 (25%)</span>
            </div>
            <div className="flex justify-between">
              <span>Senior Level:</span>
              <span className="font-mono font-bold text-slate-800">$4,023 (32%)</span>
            </div>
          </div>
        </div>

        {/* Chart 8: Age Group Wise Turnover Rate */}
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs flex flex-col justify-between">
          <h3 className="text-xs font-bold text-slate-900 mb-2">Age Group Wise Turnover Rate</h3>
          <div className="space-y-2 my-auto text-xs">
            <div className="space-y-1">
              <div className="flex justify-between text-[10px]">
                <span className="text-slate-600">&lt;25 years</span>
                <span className="font-mono text-amber-600 font-bold">40% Turnover</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-amber-500 h-full w-2/5"></div>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-[10px]">
                <span className="text-slate-600">26-35 years</span>
                <span className="font-mono text-blue-600 font-bold">20% Turnover</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-blue-500 h-full w-1/5"></div>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-[10px]">
                <span className="text-slate-600">36-45 years</span>
                <span className="font-mono text-emerald-600 font-bold">11% Turnover</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full w-[11%]"></div>
              </div>
            </div>
          </div>
          <div className="text-[10px] text-slate-400 text-center pt-2 border-t border-slate-100">
            Voluntary vs Involuntary tracking active
          </div>
        </div>
      </div>
    </div>
  );
};
