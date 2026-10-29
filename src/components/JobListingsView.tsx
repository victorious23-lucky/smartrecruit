import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Vacancy } from '../types/dfd';
import {
  Briefcase,
  Plus,
  MapPin,
  Clock,
  DollarSign,
  Users,
  Search,
  Filter,
  CheckCircle2,
  Building,
  Sparkles,
  ArrowRight,
  TrendingUp,
  LayoutGrid,
  List,
  MoreVertical,
  X,
  ExternalLink,
  ShieldAlert,
} from 'lucide-react';

export const JobListingsView: React.FC = () => {
  const {
    vacancies,
    addVacancy,
    updateVacancy,
    applications,
    currentUser,
    hasPermission,
    switchUser,
    allUsers,
    setActiveTab,
  } = useApp();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [filterType, setFilterType] = useState('ALL');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // New Job Form State
  const [title, setTitle] = useState('');
  const [department, setDepartment] = useState('Core Infrastructure');
  const [location, setLocation] = useState('San Francisco, CA (Hybrid)');
  const [employmentType, setEmploymentType] = useState<'Full-time' | 'Contract' | 'Remote' | 'Hybrid'>('Full-time');
  const [salaryRange, setSalaryRange] = useState('$160k - 210k Annually');
  const [status, setStatus] = useState<'ACTIVE' | 'DRAFT' | 'CLOSED'>('ACTIVE');
  const [description, setDescription] = useState('');
  const [skillsInput, setSkillsInput] = useState('Go, Kubernetes, Distributed Systems, Kafka');
  const [minExp, setMinExp] = useState(5);
  const [education, setEducation] = useState("Bachelor's or Master's in CS");

  const canManage = hasPermission('MANAGE_VACANCIES');

  const handleCreateJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const parsedSkills = skillsInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    addVacancy({
      title,
      department,
      location,
      employmentType,
      salaryRange,
      status,
      description: description || `Join our high-impact team building resilient cloud software. Looking for experienced ${title} with proven engineering mastery.`,
      requiredSkills: parsedSkills,
      minExperienceYears: minExp,
      educationRequired: education,
    });

    setShowCreateModal(false);
    setTitle('');
    setDescription('');
  };

  const departments = ['ALL', 'Core Infrastructure', 'Applied AI Research', 'Product Engineering', 'Cloud Security'];

  // Filter vacancies
  const filteredVacancies = vacancies.filter((v) => {
    if (filterDepartment !== 'ALL' && v.department !== filterDepartment) return false;
    if (filterStatus !== 'ALL' && v.status !== filterStatus) return false;
    if (filterType !== 'ALL' && v.employmentType !== filterType) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = v.title.toLowerCase().includes(q);
      const matchDept = v.department.toLowerCase().includes(q);
      const matchSkills = v.requiredSkills.some((s) => s.toLowerCase().includes(q));
      if (!matchTitle && !matchDept && !matchSkills) return false;
    }
    return true;
  });

  const activeCount = vacancies.filter((v) => v.status === 'ACTIVE').length;
  const draftCount = vacancies.filter((v) => v.status === 'DRAFT').length;
  const closedCount = vacancies.filter((v) => v.status === 'CLOSED').length;
  const totalCount = vacancies.length;
  const openPercentage = totalCount > 0 ? Math.round((activeCount / totalCount) * 100) : 75;

  // Selected highlight vacancy matching Joblings screenshot (Product Designer - Greenloty style)
  const highlightVacancy = vacancies[0] || {
    id: 'VAC-001',
    title: 'Product Designer',
    department: 'Product Engineering',
    employerName: 'Greenloty Inc.',
    location: 'New York, NY (Hybrid)',
    employmentType: 'Full-time',
    salaryRange: '$90k - 180k Annually',
    status: 'ACTIVE',
    description: 'We are seeking an experienced product designer to guide our cross-platform UX systems and design scalable component libraries.',
    requiredSkills: ['Figma', 'Design Systems', 'UX Prototyping', 'User Research'],
    minExperienceYears: 4,
  };

  // Weekly applicant insights data for Job Post Insights widget
  const weeklyInsights = [
    { day: 'Mon', applicants: 85, fillPct: 60 },
    { day: 'Tue', applicants: 110, fillPct: 78 },
    { day: 'Wed', applicants: 142, fillPct: 100, isPeak: true },
    { day: 'Thu', applicants: 98, fillPct: 70 },
    { day: 'Fri', applicants: 76, fillPct: 54 },
    { day: 'Sat', applicants: 32, fillPct: 22 },
    { day: 'Sun', applicants: 45, fillPct: 32 },
  ];

  return (
    <div className="space-y-6">
      {/* Module Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <span>TalentaSync</span>
            <span>›</span>
            <span className="text-slate-800 font-semibold">Job Listings</span>
            <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 font-bold border border-blue-200">
              Process 1.0 · D1
            </span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight mt-1">Job Listings</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage open requisitions, review publishing status, and track candidate pipeline velocity
          </p>
        </div>

        <div className="flex items-center gap-3">
          {canManage ? (
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" />
              Post a Job
            </button>
          ) : (
            <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-lg text-xs text-amber-800">
              <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Requires Employer role to post.</span>
              <button
                onClick={() => {
                  const emp = allUsers.find((u) => u.role === 'EMPLOYER');
                  if (emp) switchUser(emp.id);
                }}
                className="underline text-amber-900 hover:text-black font-semibold"
              >
                Switch Role
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Top 3 Strategic Cards (Matching Joblings UI Screenshot) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Card 1: Open Jobs Highlight Feature Card (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-colors">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono">
                Open Jobs Highlight
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-mono">
                Featured
              </span>
            </div>

            <div className="mt-4 flex items-start gap-3">
              <div className="w-12 h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-lg shadow-sm">
                {highlightVacancy.employerName?.charAt(0) || 'G'}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-bold text-slate-900 truncate">{highlightVacancy.title}</h3>
                <div className="text-xs text-slate-500 font-medium">
                  {highlightVacancy.employerName || 'Greenloty Inc.'} · {highlightVacancy.department}
                </div>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-slate-600">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                {highlightVacancy.location}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                {highlightVacancy.employmentType}
              </span>
              <span className="flex items-center gap-1 font-mono font-semibold text-slate-900">
                <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                {highlightVacancy.salaryRange}
              </span>
            </div>

            <div className="mt-4 flex flex-wrap gap-1.5">
              {highlightVacancy.requiredSkills.slice(0, 4).map((skill) => (
                <span
                  key={skill}
                  className="text-[11px] font-medium bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-md"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-1.5 overflow-hidden">
                <img
                  className="inline-block h-6 w-6 rounded-full ring-2 ring-white"
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=50&auto=format&fit=crop&q=80"
                  alt="Applicant"
                />
                <img
                  className="inline-block h-6 w-6 rounded-full ring-2 ring-white"
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&auto=format&fit=crop&q=80"
                  alt="Applicant"
                />
                <img
                  className="inline-block h-6 w-6 rounded-full ring-2 ring-white"
                  src="https://images.unsplash.com/photo-1580489944761-15a19d654956?w=50&auto=format&fit=crop&q=80"
                  alt="Applicant"
                />
              </div>
              <span className="text-xs font-semibold text-slate-700 font-mono">
                {applications.length * 4 + 8} Applicants
              </span>
            </div>

            <button
              onClick={() => setActiveTab('pipeline')}
              className="flex items-center gap-1 text-xs font-semibold text-emerald-600 hover:text-emerald-700"
            >
              View Pipeline <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Card 2: Job Summary Donut Gauge (3 cols) */}
        <div className="lg:col-span-3 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">Job Summary</h3>
              <span className="text-xs text-slate-400 font-mono">D1 Store</span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">Status ratio of all registered postings</p>

            {/* Circular Gauge / Donut Graphic */}
            <div className="mt-6 flex flex-col items-center justify-center">
              <div className="relative w-32 h-32 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                  {/* Background track */}
                  <path
                    className="text-slate-100"
                    strokeWidth="3.8"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  {/* Active / Open arc */}
                  <path
                    className="text-emerald-500"
                    strokeDasharray={`${openPercentage}, 100`}
                    strokeWidth="3.8"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute text-center">
                  <div className="text-2xl font-black font-mono text-slate-900 tabular-nums">{openPercentage}%</div>
                  <div className="text-[10px] uppercase font-semibold text-slate-400">Open Jobs</div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-slate-600">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Active Openings
              </span>
              <span className="font-mono font-bold text-slate-900">{activeCount}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-slate-600">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span> Draft Postings
              </span>
              <span className="font-mono font-bold text-slate-900">{draftCount}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-slate-600">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-300"></span> Closed Postings
              </span>
              <span className="font-mono font-bold text-slate-900">{closedCount}</span>
            </div>
          </div>
        </div>

        {/* Card 3: Job Post Insights Weekly Bar Chart (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">Job Post Insights</h3>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                Weekly
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">Application influx per weekday</p>

            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl font-black font-mono text-slate-900 tabular-nums">142</span>
              <span className="text-xs text-slate-400">Peak applications on Wednesday</span>
            </div>

            {/* Weekly Bars */}
            <div className="mt-6 flex items-end justify-between gap-2 h-28 px-1">
              {weeklyInsights.map((d) => (
                <div key={d.day} className="flex-1 flex flex-col items-center gap-1.5 group">
                  <div
                    style={{ height: `${d.fillPct}%` }}
                    className={`w-full max-w-[24px] rounded-t-md transition-all ${
                      d.isPeak
                        ? 'bg-emerald-500 group-hover:bg-emerald-600'
                        : 'bg-slate-200 group-hover:bg-slate-300'
                    }`}
                    title={`${d.day}: ${d.applicants} applicants`}
                  ></div>
                  <span
                    className={`text-[10px] font-mono font-medium ${
                      d.isPeak ? 'text-emerald-600 font-bold' : 'text-slate-400'
                    }`}
                  >
                    {d.day}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Overall Conversion Rate</span>
            <span className="font-mono font-bold text-emerald-600 flex items-center gap-0.5">
              <TrendingUp className="w-3.5 h-3.5" /> 18.4%
            </span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search job title, skills, or department..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Status Dropdown */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-emerald-500"
            >
              <option value="ALL">All Status</option>
              <option value="ACTIVE">Active Only</option>
              <option value="DRAFT">Draft</option>
              <option value="CLOSED">Closed</option>
            </select>

            {/* Employment Type */}
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-emerald-500"
            >
              <option value="ALL">All Work Types</option>
              <option value="Full-time">Full-time</option>
              <option value="Hybrid">Hybrid</option>
              <option value="Remote">Remote</option>
              <option value="Contract">Contract</option>
            </select>

            {/* Grid / Table toggle */}
            <div className="flex bg-slate-100 rounded-xl p-0.5 border border-slate-200">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === 'grid' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
                }`}
                title="Grid View"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === 'table' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
                }`}
                title="Table View"
              >
                <List className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Department quick filter pills */}
        <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-100">
          <span className="text-xs text-slate-400 mr-1 flex items-center gap-1">
            <Filter className="w-3 h-3" /> Department:
          </span>
          {departments.map((dept) => (
            <button
              key={dept}
              onClick={() => setFilterDepartment(dept)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                filterDepartment === dept
                  ? 'bg-slate-900 text-white font-semibold'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {dept}
            </button>
          ))}
        </div>
      </div>

      {/* Main Job Listings View Area (Grid or Table) */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredVacancies.map((vacancy) => {
            const isActive = vacancy.status === 'ACTIVE';
            const isDraft = vacancy.status === 'DRAFT';

            return (
              <div
                key={vacancy.id}
                className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:border-slate-300 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-mono font-bold text-slate-400">
                        {vacancy.id} · {vacancy.department}
                      </span>
                      <h3 className="text-base font-bold text-slate-900 mt-1 leading-snug">
                        {vacancy.title}
                      </h3>
                      <div className="text-xs text-slate-500 font-medium mt-0.5">
                        {vacancy.employerName || 'Spare Team'}
                      </div>
                    </div>

                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded-full uppercase font-bold shrink-0 ${
                        isActive
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : isDraft
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-slate-100 text-slate-600 border border-slate-200'
                      }`}
                    >
                      {vacancy.status}
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 mt-3 line-clamp-2 leading-relaxed">
                    {vacancy.description}
                  </p>

                  {/* Metadata Chips */}
                  <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-slate-600">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {vacancy.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {vacancy.employmentType}
                    </span>
                    <span className="flex items-center gap-1 font-mono font-semibold text-slate-800">
                      <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                      {vacancy.salaryRange}
                    </span>
                  </div>

                  {/* Skills badges */}
                  <div className="mt-3.5 flex flex-wrap gap-1.5">
                    {vacancy.requiredSkills.slice(0, 3).map((skill) => (
                      <span
                        key={skill}
                        className="text-[10px] font-medium bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md"
                      >
                        {skill}
                      </span>
                    ))}
                    {vacancy.requiredSkills.length > 3 && (
                      <span className="text-[10px] font-mono text-slate-400 self-center">
                        +{vacancy.requiredSkills.length - 3}
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Action Footer */}
                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-1 text-xs text-slate-500 font-mono">
                    <Users className="w-3.5 h-3.5 text-slate-400" />
                    <span>{applications.length + 3} applicants</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {canManage && (
                      <button
                        onClick={() =>
                          updateVacancy(vacancy.id, {
                            status: vacancy.status === 'ACTIVE' ? 'CLOSED' : 'ACTIVE',
                          })
                        }
                        className="px-2.5 py-1 text-xs font-medium rounded-lg border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
                      >
                        {vacancy.status === 'ACTIVE' ? 'Close' : 'Reopen'}
                      </button>
                    )}

                    <button
                      onClick={() => setActiveTab('semantic-match')}
                      className="flex items-center gap-1 px-3 py-1 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors shadow-xs"
                    >
                      <Sparkles className="w-3 h-3" /> Match AI
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Table View */
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-500 uppercase font-mono text-[10px] border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4 font-semibold">Job ID</th>
                  <th className="py-3 px-4 font-semibold">Job Title & Employer</th>
                  <th className="py-3 px-4 font-semibold">Department</th>
                  <th className="py-3 px-4 font-semibold">Work Type & Location</th>
                  <th className="py-3 px-4 font-semibold">Salary Range</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                  <th className="py-3 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredVacancies.map((vacancy) => (
                  <tr key={vacancy.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-700">{vacancy.id}</td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{vacancy.title}</div>
                      <div className="text-[11px] text-slate-500">{vacancy.employerName || 'Spare Team'}</div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">{vacancy.department}</td>
                    <td className="py-3.5 px-4 text-slate-600">
                      <div>{vacancy.employmentType}</div>
                      <div className="text-[11px] text-slate-400">{vacancy.location}</div>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-semibold text-slate-800">
                      {vacancy.salaryRange}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold ${
                          vacancy.status === 'ACTIVE'
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {vacancy.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => setActiveTab('semantic-match')}
                        className="text-xs font-semibold text-emerald-600 hover:text-emerald-800 transition-colors"
                      >
                        Match Candidates ➔
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Post a Job Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-lg w-full p-6 shadow-2xl relative my-8 animate-fadeIn">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h2 className="text-base font-bold text-slate-900">Post a Job (Process 1.0)</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Publishes vacancy to D1 Vacancies repository with automated skill criteria
                </p>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateJob} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Job Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Senior Distributed Systems Architect"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Department
                  </label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white"
                  >
                    <option value="Core Infrastructure">Core Infrastructure</option>
                    <option value="Applied AI Research">Applied AI Research</option>
                    <option value="Product Engineering">Product Engineering</option>
                    <option value="Cloud Security">Cloud Security</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Employment Type
                  </label>
                  <select
                    value={employmentType}
                    onChange={(e) => setEmploymentType(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white"
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="Remote">Remote</option>
                    <option value="Contract">Contract</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. San Francisco, CA (Hybrid)"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Salary Range
                  </label>
                  <input
                    type="text"
                    value={salaryRange}
                    onChange={(e) => setSalaryRange(e.target.value)}
                    placeholder="e.g. $160,000 - $210,000"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Required Skills (comma-separated)
                </label>
                <input
                  type="text"
                  value={skillsInput}
                  onChange={(e) => setSkillsInput(e.target.value)}
                  placeholder="e.g. Go, Kubernetes, Kafka, Distributed Systems"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Min Experience (Years)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={20}
                    value={minExp}
                    onChange={(e) => setMinExp(parseInt(e.target.value, 10) || 1)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Initial Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white"
                  >
                    <option value="ACTIVE">ACTIVE (Published)</option>
                    <option value="DRAFT">DRAFT</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Job Description & Scope
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Briefly describe key mission, technical scope, and expectations..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors shadow-sm"
                >
                  Publish to D1 Vacancies
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
