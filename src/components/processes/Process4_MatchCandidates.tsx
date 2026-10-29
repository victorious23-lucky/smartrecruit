import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MatchResult } from '../../types/dfd';
import {
  Sparkles,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Brain,
  ShieldCheck,
  Calendar,
  Loader2,
  RefreshCw,
} from 'lucide-react';

export const Process4_MatchCandidates: React.FC = () => {
  const {
    vacancies,
    profiles,
    matchResults,
    adminConfig,
    updateAdminConfig,
    runCandidateMatch,
    setActiveTab,
    currentUser,
  } = useApp();

  const [selectedVacancyId, setSelectedVacancyId] = useState<string>(vacancies[0]?.id || '');
  const [isRunningMatch, setIsRunningMatch] = useState(false);
  const [matchEngineUsed, setMatchEngineUsed] = useState<string | null>(null);

  const selectedVacancy = vacancies.find((v) => v.id === selectedVacancyId);

  // Match results for currently selected vacancy
  const currentMatches = matchResults
    .filter((m) => m.vacancyId === selectedVacancyId)
    .sort((a, b) => b.score - a.score);

  const handleRunMatch = async () => {
    if (!selectedVacancyId) return;
    setIsRunningMatch(true);

    try {
      const results = await runCandidateMatch(selectedVacancyId);
      setMatchEngineUsed('Gemini 3.8 Flash NLP');
    } catch (e) {
      console.error(e);
    } finally {
      setIsRunningMatch(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-emerald-400 bg-emerald-950/60 border-emerald-800';
    if (score >= 70) return 'text-blue-400 bg-blue-950/60 border-blue-800';
    if (score >= 55) return 'text-amber-400 bg-amber-950/60 border-amber-800';
    return 'text-rose-400 bg-rose-950/60 border-rose-800';
  };

  return (
    <div className="space-y-6">
      {/* Process Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-blue-600 text-white">
                Process 4.0
              </span>
              <span className="text-xs text-slate-400 font-mono">
                DFD Data Flow: Recruiter Request + Admin Weights + D1 + D2 ➔ Process 4.0 ➔ D4 Match Results
              </span>
            </div>
            <h1 className="text-xl font-bold text-white mt-1">Match Candidates (AI Scoring Engine)</h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Evaluates D2 Profiles against D1 Vacancy requirements using Admin-configured weights to output candidate rankings and store scores in D4.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleRunMatch}
              disabled={isRunningMatch || !selectedVacancyId}
              className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 rounded-lg transition-colors shadow-md whitespace-nowrap"
            >
              {isRunningMatch ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Running AI Evaluation...
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  Calculate Match Rankings
                </>
              )}
            </button>
          </div>
        </div>

        {/* Vacancy Selector & Admin Weights Summary */}
        <div className="mt-5 pt-4 border-t border-slate-800 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          <div className="md:col-span-5">
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Select Target Vacancy (from D1 Store)
            </label>
            <select
              value={selectedVacancyId}
              onChange={(e) => setSelectedVacancyId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 font-medium"
            >
              {vacancies.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.id}: {v.title} ({v.department})
                </option>
              ))}
            </select>
          </div>

          {/* Admin Weights configuration box */}
          <div className="md:col-span-7 bg-slate-950/80 border border-slate-800/80 rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-indigo-400" />
                Admin Configured Weights (Entity: Admin ➔ Process 4.0)
              </span>
              <span className="text-[11px] font-mono text-slate-500">Total: 100%</span>
            </div>

            <div className="grid grid-cols-3 gap-3 text-xs">
              <div>
                <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                  <span>Skills Match</span>
                  <span className="font-mono text-white">{(adminConfig.skillWeight * 100).toFixed(0)}%</span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="0.8"
                  step="0.05"
                  value={adminConfig.skillWeight}
                  onChange={(e) => {
                    const skill = parseFloat(e.target.value);
                    const remainder = 1 - skill;
                    updateAdminConfig({
                      skillWeight: skill,
                      expWeight: remainder * 0.6,
                      eduWeight: remainder * 0.4,
                    });
                  }}
                  className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
              </div>

              <div>
                <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                  <span>Experience</span>
                  <span className="font-mono text-white">{(adminConfig.expWeight * 100).toFixed(0)}%</span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="0.6"
                  step="0.05"
                  value={adminConfig.expWeight}
                  onChange={(e) =>
                    updateAdminConfig({
                      expWeight: parseFloat(e.target.value),
                    })
                  }
                  className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
              </div>

              <div>
                <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                  <span>Education</span>
                  <span className="font-mono text-white">{(adminConfig.eduWeight * 100).toFixed(0)}%</span>
                </div>
                <input
                  type="range"
                  min="0.05"
                  max="0.4"
                  step="0.05"
                  value={adminConfig.eduWeight}
                  onChange={(e) =>
                    updateAdminConfig({
                      eduWeight: parseFloat(e.target.value),
                    })
                  }
                  className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Selected Vacancy Profile Brief */}
      {selectedVacancy && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
          <div>
            <div className="text-slate-400">Target Role Criteria:</div>
            <div className="text-white font-bold text-sm mt-0.5">
              {selectedVacancy.title} · {selectedVacancy.salaryRange}
            </div>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {selectedVacancy.requiredSkills.map((s) => (
                <span
                  key={s}
                  className="text-[11px] font-mono bg-slate-800 text-indigo-300 px-2 py-0.5 rounded border border-slate-700"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>

          <div className="text-slate-400 md:text-right">
            <div>
              Min Experience: <span className="font-mono font-bold text-white">{selectedVacancy.minExperienceYears} Years</span>
            </div>
            <div className="mt-1">
              Education: <span className="text-slate-300">{selectedVacancy.educationRequired}</span>
            </div>
          </div>
        </div>
      )}

      {/* Ranked Candidate Results (Output to Recruiter & D4 Store) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-indigo-400">D4</span>
            <h2 className="text-sm font-bold text-white">
              Candidate Match Results ({currentMatches.length})
            </h2>
          </div>
          <span className="text-xs text-slate-400">
            Stored in D4 Match Results · Ranked by AI Alignment Score
          </span>
        </div>

        {currentMatches.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center text-xs text-slate-400">
            <Sparkles className="w-8 h-8 text-indigo-400 mx-auto mb-2 opacity-60" />
            <div>No match results recorded yet for this vacancy.</div>
            <div className="text-slate-500 mt-1">
              Click "Calculate Match Rankings" above to run Process 4.0 using Gemini 3.8 Flash!
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {currentMatches.map((match, index) => {
              const candProfile = profiles.find((p) => p.id === match.candidateId);
              return (
                <div
                  key={match.id}
                  className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-all"
                >
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    {/* Candidate Details & Rank */}
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center font-mono font-bold text-xs text-slate-300 shrink-0 border border-slate-700">
                        #{index + 1}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-base font-bold text-white">{match.candidateName}</h3>
                          <span className="text-xs font-mono text-slate-500">{match.candidateId}</span>
                        </div>
                        <div className="text-xs text-slate-400 mt-0.5">
                          {candProfile?.headline || 'Candidate Profile'} ·{' '}
                          <span className="font-mono text-slate-300">
                            {candProfile?.experienceYears || 5} yrs experience
                          </span>
                        </div>

                        {/* AI Rationale */}
                        <p className="text-xs text-slate-300 mt-3 bg-slate-950/60 p-3 rounded-lg border border-slate-800/60 leading-relaxed">
                          <span className="text-indigo-400 font-semibold">AI Assessment: </span>
                          {match.analysis}
                        </p>
                      </div>
                    </div>

                    {/* Score Badge */}
                    <div className="flex md:flex-col items-center md:items-end justify-between shrink-0 gap-2">
                      <div
                        className={`text-center px-4 py-2 rounded-xl border ${getScoreColor(
                          match.score
                        )}`}
                      >
                        <div className="text-2xl font-black font-mono tracking-tight tabular-nums">
                          {match.score}%
                        </div>
                        <div className="text-[10px] font-semibold uppercase tracking-wider">
                          {match.rating}
                        </div>
                      </div>

                      <button
                        onClick={() => setActiveTab('interviews')}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors whitespace-nowrap shadow-sm"
                      >
                        <Calendar className="w-3.5 h-3.5" />
                        Schedule Interview (5.0)
                      </button>
                    </div>
                  </div>

                  {/* Skills Match Breakdown */}
                  <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-wrap items-center gap-4 text-xs">
                    <div className="flex items-center gap-1.5">
                      <span className="text-slate-500">Matched Skills:</span>
                      <div className="flex flex-wrap gap-1">
                        {match.matchedSkills.length > 0 ? (
                          match.matchedSkills.map((s) => (
                            <span
                              key={s}
                              className="text-[10px] font-mono bg-emerald-950/80 text-emerald-300 border border-emerald-800/80 px-2 py-0.5 rounded"
                            >
                              ✓ {s}
                            </span>
                          ))
                        ) : (
                          <span className="text-slate-500 italic">None</span>
                        )}
                      </div>
                    </div>

                    {match.missingSkills.length > 0 && (
                      <div className="flex items-center gap-1.5">
                        <span className="text-slate-500">Skill Gaps:</span>
                        <div className="flex flex-wrap gap-1">
                          {match.missingSkills.map((s) => (
                            <span
                              key={s}
                              className="text-[10px] font-mono bg-rose-950/60 text-rose-300 border border-rose-800/60 px-2 py-0.5 rounded"
                            >
                              ✗ {s}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
