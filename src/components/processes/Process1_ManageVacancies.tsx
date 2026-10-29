import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Vacancy } from '../../types/dfd';
import {
  Briefcase,
  Plus,
  MapPin,
  Clock,
  DollarSign,
  CheckCircle2,
  AlertCircle,
  Building,
  ShieldAlert,
  ArrowRight,
  Filter,
} from 'lucide-react';

export const Process1_ManageVacancies: React.FC = () => {
  const {
    vacancies,
    addVacancy,
    updateVacancy,
    currentUser,
    hasPermission,
    switchUser,
    allUsers,
    setActiveTab,
  } = useApp();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filterDepartment, setFilterDepartment] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');

  // Form State
  const [title, setTitle] = useState('');
  const [department, setDepartment] = useState('Core Infrastructure');
  const [location, setLocation] = useState('San Francisco, CA (Hybrid)');
  const [employmentType, setEmploymentType] = useState<'Full-time' | 'Contract' | 'Remote' | 'Hybrid'>('Full-time');
  const [salaryRange, setSalaryRange] = useState('$180,000 - $220,000');
  const [status, setStatus] = useState<'ACTIVE' | 'DRAFT' | 'CLOSED'>('ACTIVE');
  const [description, setDescription] = useState('');
  const [skillsInput, setSkillsInput] = useState('Go, Kubernetes, Distributed Systems, Kafka');
  const [minExp, setMinExp] = useState(5);
  const [education, setEducation] = useState("Bachelor's or Master's in CS");

  const canManage = hasPermission('MANAGE_VACANCIES');

  const handleCreate = (e: React.FormEvent) => {
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
      description,
      requiredSkills: parsedSkills,
      minExperienceYears: minExp,
      educationRequired: education,
    });

    setShowCreateModal(false);
    // Reset form
    setTitle('');
    setDescription('');
  };

  const departments = ['ALL', 'Core Infrastructure', 'Applied AI Research', 'Product Engineering', 'Cloud Security'];

  const filteredVacancies = vacancies.filter((v) => {
    if (filterDepartment !== 'ALL' && v.department !== filterDepartment) return false;
    if (filterStatus !== 'ALL' && v.status !== filterStatus) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Process Header & Flow Breadcrumbs */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-blue-600 text-white">
                Process 1.0
              </span>
              <span className="text-xs text-slate-400 font-mono">
                DFD Data Flow: Employer ➔ Process 1.0 ➔ D1 Vacancies
              </span>
            </div>
            <h1 className="text-xl font-bold text-white mt-1">Manage Vacancies</h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Allows Employers to post, update, and manage job openings stored in the D1 Vacancies database.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {canManage ? (
              <button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors shadow-sm whitespace-nowrap"
              >
                <Plus className="w-4 h-4" />
                Post New Vacancy
              </button>
            ) : (
              <div className="flex items-center gap-2 bg-amber-950/40 border border-amber-800/80 px-3 py-1.5 rounded-lg text-xs text-amber-300">
                <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Requires Employer or Admin role.</span>
                <button
                  onClick={() => {
                    const emp = allUsers.find((u) => u.role === 'EMPLOYER');
                    if (emp) switchUser(emp.id);
                  }}
                  className="ml-1 underline text-amber-200 hover:text-white font-medium"
                >
                  Switch to Employer
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Filter controls */}
        <div className="mt-5 pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs text-slate-400 mr-1 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Department:
            </span>
            {departments.map((dept) => (
              <button
                key={dept}
                onClick={() => setFilterDepartment(dept)}
                className={`px-2.5 py-1 text-xs rounded-md transition-colors ${
                  filterDepartment === dept
                    ? 'bg-slate-800 text-white font-medium shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {dept}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500">Status:</span>
            {['ALL', 'ACTIVE', 'DRAFT', 'CLOSED'].map((st) => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-2 py-0.5 rounded text-xs transition-colors ${
                  filterStatus === st
                    ? 'bg-slate-800 text-white font-medium'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Vacancies Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredVacancies.map((vacancy) => {
          const isClosed = vacancy.status === 'CLOSED';
          const isDraft = vacancy.status === 'DRAFT';

          return (
            <div
              key={vacancy.id}
              className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-slate-500">{vacancy.id}</span>
                      <span className="text-slate-600">·</span>
                      <span className="text-xs text-slate-400">{vacancy.department}</span>
                    </div>
                    <h3 className="text-base font-bold text-white mt-1">{vacancy.title}</h3>
                  </div>

                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded uppercase font-semibold ${
                      vacancy.status === 'ACTIVE'
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                        : isDraft
                        ? 'bg-amber-950 text-amber-400 border border-amber-800'
                        : 'bg-slate-800 text-slate-400 border border-slate-700'
                    }`}
                  >
                    {vacancy.status}
                  </span>
                </div>

                <p className="text-xs text-slate-400 mt-3 line-clamp-2 leading-relaxed">
                  {vacancy.description}
                </p>

                {/* Key metadata */}
                <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-500" />
                    {vacancy.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    {vacancy.employmentType}
                  </span>
                  <span className="flex items-center gap-1 font-mono text-slate-300">
                    <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                    {vacancy.salaryRange}
                  </span>
                </div>

                {/* Skills tags */}
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {vacancy.requiredSkills.map((skill) => (
                    <span
                      key={skill}
                      className="text-[11px] font-mono bg-slate-800/80 text-slate-300 px-2 py-0.5 rounded border border-slate-700/60"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="mt-5 pt-4 border-t border-slate-800 flex items-center justify-between">
                <div className="text-[11px] text-slate-500 truncate max-w-[200px]">
                  Posted by {vacancy.employerName}
                </div>

                <div className="flex items-center gap-2">
                  {canManage && (
                    <button
                      onClick={() =>
                        updateVacancy(vacancy.id, {
                          status: vacancy.status === 'ACTIVE' ? 'CLOSED' : 'ACTIVE',
                        })
                      }
                      className="px-2.5 py-1 text-xs rounded border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                    >
                      {vacancy.status === 'ACTIVE' ? 'Close Opening' : 'Reactivate'}
                    </button>
                  )}

                  <button
                    onClick={() => setActiveTab('matching')}
                    className="flex items-center gap-1 px-3 py-1 text-xs font-medium bg-blue-600 hover:bg-blue-500 text-white rounded transition-colors whitespace-nowrap"
                  >
                    Match Candidates <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Post Vacancy Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-lg w-full p-6 shadow-2xl relative my-8">
            <h2 className="text-lg font-bold text-white">Create New Vacancy (Process 1.0)</h2>
            <p className="text-xs text-slate-400 mt-1">
              Inputs provided by Employer are validated and committed to D1 Vacancies.
            </p>

            <form onSubmit={handleCreate} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Job Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Principal Cloud Security Architect"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Department
                  </label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Core Infrastructure">Core Infrastructure</option>
                    <option value="Applied AI Research">Applied AI Research</option>
                    <option value="Product Engineering">Product Engineering</option>
                    <option value="Cloud Security">Cloud Security</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Employment Type
                  </label>
                  <select
                    value={employmentType}
                    onChange={(e) => setEmploymentType(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Remote">Remote</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="Contract">Contract</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. San Francisco / Remote"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Salary Range
                  </label>
                  <input
                    type="text"
                    value={salaryRange}
                    onChange={(e) => setSalaryRange(e.target.value)}
                    placeholder="e.g. $180,000 - $220,000"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Required Skills (comma-separated)
                </label>
                <input
                  type="text"
                  value={skillsInput}
                  onChange={(e) => setSkillsInput(e.target.value)}
                  placeholder="e.g. Go, Kubernetes, gRPC, Distributed Systems"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Min Experience (Years)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={20}
                    value={minExp}
                    onChange={(e) => setMinExp(parseInt(e.target.value, 10) || 1)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Initial Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="ACTIVE">ACTIVE (Published)</option>
                    <option value="DRAFT">DRAFT</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Job Description & Scope
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe key responsibilities and technical scope..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-3 py-1.5 text-xs text-slate-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors"
                >
                  Save to D1 Vacancies
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
