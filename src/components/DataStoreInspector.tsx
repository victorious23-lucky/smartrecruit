import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Database,
  Search,
  Table,
  Code,
  FileText,
  Copy,
  Check,
  RotateCcw,
  Layers,
} from 'lucide-react';

export const DataStoreInspector: React.FC = () => {
  const {
    vacancies,
    profiles,
    applications,
    matchResults,
    interviews,
    resetAllData,
  } = useApp();

  const [activeStore, setActiveStore] = useState<'D1' | 'D2' | 'D3' | 'D4' | 'D5'>('D1');
  const [viewMode, setViewMode] = useState<'table' | 'json'>('table');
  const [searchQuery, setSearchQuery] = useState('');
  const [copied, setCopied] = useState(false);

  const getStoreData = () => {
    switch (activeStore) {
      case 'D1':
        return { name: 'D1 Vacancies', data: vacancies, entity: 'Employer', schema: 'id, title, department, requiredSkills, minExperienceYears, salaryRange, status' };
      case 'D2':
        return { name: 'D2 Profiles', data: profiles, entity: 'Job seeker / AI/NLP', schema: 'id, userId, name, email, headline, skills, experienceYears, educationLevel' };
      case 'D3':
        return { name: 'D3 Applications', data: applications, entity: 'Job seeker / Recruiter', schema: 'id, vacancyId, candidateId, status, appliedAt, recruiterNotes' };
      case 'D4':
        return { name: 'D4 Match results', data: matchResults, entity: 'Recruiter / Admin', schema: 'id, vacancyId, candidateId, score, rating, matchedSkills, analysis' };
      case 'D5':
        return { name: 'D5 Interviews', data: interviews, entity: 'Recruiter / Gateway', schema: 'id, applicationId, timeSlot, format, status, interviewerName, gatewayDispatchId' };
    }
  };

  const currentStore = getStoreData();

  const filteredRecords = currentStore.data.filter((item: any) => {
    if (!searchQuery.trim()) return true;
    return JSON.stringify(item).toLowerCase().includes(searchQuery.toLowerCase());
  });

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(filteredRecords, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header Container */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-emerald-600" />
              <span className="text-xs font-mono font-bold text-emerald-600">
                Direct Data Store Inspector
              </span>
              <span className="text-slate-300">·</span>
              <span className="text-xs text-slate-500">Stores D1 to D5</span>
            </div>
            <h1 className="text-xl font-bold text-slate-900 mt-1">Data Store Live State</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Inspect raw relational tables, document schemas, and active records stored across the 5 DFD repositories.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyJson}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg border border-slate-200 transition-colors whitespace-nowrap"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied JSON' : 'Copy Store JSON'}
            </button>
            <button
              onClick={resetAllData}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-rose-700 hover:text-rose-900 bg-rose-50 hover:bg-rose-100 rounded-lg border border-rose-200 transition-colors whitespace-nowrap"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset All Stores
            </button>
          </div>
        </div>

        {/* Store Selection Tabs */}
        <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            {(['D1', 'D2', 'D3', 'D4', 'D5'] as const).map((storeKey) => {
              const isActive = activeStore === storeKey;
              const count =
                storeKey === 'D1'
                  ? vacancies.length
                  : storeKey === 'D2'
                  ? profiles.length
                  : storeKey === 'D3'
                  ? applications.length
                  : storeKey === 'D4'
                  ? matchResults.length
                  : interviews.length;

              const label =
                storeKey === 'D1'
                  ? 'D1 Vacancies'
                  : storeKey === 'D2'
                  ? 'D2 Profiles'
                  : storeKey === 'D3'
                  ? 'D3 Applications'
                  : storeKey === 'D4'
                  ? 'D4 Match results'
                  : 'D5 Interviews';

              return (
                <button
                  key={storeKey}
                  onClick={() => setActiveStore(storeKey)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
                    isActive
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                  }`}
                >
                  <span>{label}</span>
                  <span
                    className={`font-mono text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                      isActive ? 'bg-slate-800 text-white' : 'bg-white text-slate-700 border border-slate-200'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                placeholder="Search store records..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white"
              />
            </div>

            <div className="flex bg-slate-100 rounded-xl p-0.5 border border-slate-200 text-xs">
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === 'table' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
                }`}
                title="Table View"
              >
                <Table className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewMode('json')}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === 'json' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
                }`}
                title="JSON View"
              >
                <Code className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Store Schema Spec */}
        <div className="text-[11px] text-slate-500 font-mono flex flex-wrap items-center gap-2">
          <span>Schema: {currentStore.schema}</span>
          <span>·</span>
          <span>Related Entity: {currentStore.entity}</span>
        </div>
      </div>

      {/* Main View Area */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {viewMode === 'json' ? (
          <div className="p-4 bg-slate-950 font-mono text-xs text-emerald-400 overflow-x-auto max-h-[600px]">
            <pre>{JSON.stringify(filteredRecords, null, 2)}</pre>
          </div>
        ) : (
          <div className="overflow-x-auto max-h-[600px]">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-500 uppercase font-mono text-[10px] sticky top-0 border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4 font-semibold">ID</th>
                  <th className="py-3 px-4 font-semibold">Primary Title / Name</th>
                  <th className="py-3 px-4 font-semibold">Key Attribute</th>
                  <th className="py-3 px-4 font-semibold">Status / Score</th>
                  <th className="py-3 px-4 font-semibold">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono">
                {filteredRecords.map((item: any) => {
                  const id = item.id;
                  const title = item.title || item.name || item.candidateName || item.vacancyTitle;
                  const attr =
                    item.department ||
                    item.headline ||
                    (item.matchedSkills ? `Matched: ${item.matchedSkills.length} skills` : null) ||
                    item.format;
                  const status = item.status || (item.score !== undefined ? `${item.score}%` : 'RECORDED');
                  const time = item.updatedAt || item.appliedAt || item.computedAt || item.timeSlot || item.createdAt;

                  return (
                    <tr key={id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4 text-emerald-600 font-bold">{id}</td>
                      <td className="py-3 px-4 font-sans font-medium text-slate-900">{title}</td>
                      <td className="py-3 px-4 text-slate-500 font-sans text-xs">{attr}</td>
                      <td className="py-3 px-4">
                        <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] bg-slate-100 text-slate-700 font-semibold border border-slate-200">
                          {status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-400 text-[11px]">
                        {time ? new Date(time).toLocaleDateString() : '-'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
