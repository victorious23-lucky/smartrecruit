import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Sparkles,
  CheckCircle2,
  ChevronLeft,
  Share2,
  Mail,
  Phone,
  Linkedin,
  Github,
  Star,
  Check,
  UserCheck,
  AlertCircle,
  TrendingUp,
  Cpu,
  Layers,
  ArrowRight,
} from 'lucide-react';

export const SemanticMatchView: React.FC = () => {
  const {
    vacancies,
    profiles,
    applications,
    updateApplicationStatus,
    setActiveTab,
  } = useApp();

  const [selectedCandidate, setSelectedCandidate] = useState('AM');
  const [decisionNotice, setDecisionNotice] = useState<string | null>(null);

  const handleAction = (status: 'SHORTLISTED' | 'UNDER_REVIEW' | 'REJECTED', label: string) => {
    // Find or link active application
    const firstApp = applications[0];
    if (firstApp) {
      updateApplicationStatus(firstApp.id, status, `Moved via HireAI Semantic Matcher`);
    }
    setDecisionNotice(`Candidate successfully updated: ${label}`);
    setTimeout(() => setDecisionNotice(null), 3500);
  };

  const skillsOverlap = [
    { name: 'Python', matchPct: 100 },
    { name: 'FastAPI', matchPct: 100 },
    { name: 'PostgreSQL', matchPct: 100 },
    { name: 'AWS Cloud', matchPct: 90 },
    { name: 'Kafka Streaming', matchPct: 80 },
    { name: 'Node.js', matchPct: 70 },
    { name: 'Redis Cache', matchPct: 100 },
    { name: 'Docker Containers', matchPct: 100 },
    { name: 'System Design', matchPct: 80 },
    { name: 'Kubernetes', matchPct: 60 },
  ];

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb & Title Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <button onClick={() => setActiveTab('candidates')} className="hover:text-slate-900">
              Candidates
            </button>
            <span>›</span>
            <span className="text-slate-800 font-semibold">A. Mehta</span>
            <span>›</span>
            <span className="text-emerald-700 font-semibold">Match Details</span>
            <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 font-bold border border-blue-200">
              Process 4.0 · D1, D2, D4
            </span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight mt-1">
            Semantic JD Matching (HireAI)
          </h1>
          <div className="text-xs text-slate-500 mt-0.5">
            Job: <span className="text-slate-700 font-medium">Senior Backend Engineer</span> · Location: Bengaluru, India · Posted on Apr 10, 2026
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('candidates')}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors shadow-xs"
          >
            <ChevronLeft className="w-3.5 h-3.5" /> Back to Candidate
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors shadow-xs">
            <Share2 className="w-3.5 h-3.5" /> Share Match
          </button>
        </div>
      </div>

      {decisionNotice && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{decisionNotice}</span>
        </div>
      )}

      {/* Main 3-Column / Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Candidate Overview & Job Spec Excerpt */}
        <div className="lg:col-span-3 space-y-4">
          {/* Candidate Card */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-base shrink-0">
                AM
              </div>
              <div className="truncate">
                <div className="flex items-center gap-1.5">
                  <h3 className="font-bold text-sm text-slate-900">A. Mehta</h3>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-700 font-semibold">
                    AI Parsed
                  </span>
                </div>
                <div className="text-xs text-slate-500 truncate">Sr. Backend Engineer · 6 yrs</div>
                <div className="text-[11px] text-slate-400">Bengaluru, India</div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 space-y-2 text-xs text-slate-600">
              <div className="flex items-center gap-2 text-slate-600 truncate">
                <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="truncate">a.mehta@mail.com</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>+91 98765 43210</span>
              </div>
              <div className="flex items-center gap-2 text-indigo-600 font-medium">
                <Linkedin className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate text-[11px]">linkedin.com/in/aviralm</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700">
                <Github className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate text-[11px]">github.com/aviralmehta</span>
              </div>
            </div>

            <button
              onClick={() => setActiveTab('jobseeker-portal')}
              className="w-full text-center py-2 text-xs font-semibold text-indigo-600 hover:text-indigo-800 bg-indigo-50/70 rounded-lg transition-colors"
            >
              View Full Profile ➔
            </button>
          </div>

          {/* Job Description Excerpt */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
              Job Description
            </h4>
            <div className="text-xs font-bold text-slate-900">Senior Backend Engineer</div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Build and scale distributed systems and APIs in a cloud environment.
            </p>

            <div className="pt-2 border-t border-slate-100">
              <div className="text-[11px] font-semibold text-slate-700 mb-1.5">Key Requirements:</div>
              <ul className="text-xs text-slate-500 space-y-1 list-disc pl-4 leading-relaxed">
                <li>6+ years backend engineering</li>
                <li>Strong Python, FastAPI, Node.js</li>
                <li>Experience with PostgreSQL, Redis</li>
                <li>AWS services (ECS, RDS, S3)</li>
                <li>Kafka message streaming</li>
                <li>System design & scalability</li>
              </ul>
            </div>
          </div>

          {/* Matching Pipeline Metadata */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 text-[11px] font-mono text-slate-500 space-y-1.5">
            <div className="font-bold text-slate-700 mb-1">Matching Engine Specs:</div>
            <div className="flex justify-between">
              <span>Model:</span>
              <span className="text-slate-800 font-semibold">Gemini 3.8 Flash</span>
            </div>
            <div className="flex justify-between">
              <span>Vector Method:</span>
              <span>pgvector (cosine)</span>
            </div>
            <div className="flex justify-between">
              <span>Confidence:</span>
              <span className="text-emerald-700 font-bold">70% Threshold</span>
            </div>
            <div className="flex justify-between">
              <span>Match ID:</span>
              <span>match_9f3a2b1c7d</span>
            </div>
          </div>
        </div>

        {/* Center Column: Circular Match Score & Detailed Breakdown */}
        <div className="lg:col-span-6 space-y-4">
          {/* Main Score Header Card */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              {/* Circular Gauge */}
              <div className="relative w-36 h-36 flex items-center justify-center shrink-0">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="#E2E8F0"
                    strokeWidth="8"
                    fill="transparent"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="#4F46E5"
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray="251.2"
                    strokeDashoffset="20.1"
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-3xl font-black font-mono text-slate-900 tracking-tight">92%</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">
                    Excellent Match
                  </span>
                </div>
              </div>

              {/* Score Breakdown Horizontal Bars */}
              <div className="flex-1 w-full space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">Score Breakdown</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-semibold flex items-center gap-1">
                    <Check className="w-3 h-3" /> Strong Semantic Match
                  </span>
                </div>

                {/* Skills Bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-600 font-medium">Skills</span>
                    <span className="font-mono font-bold text-slate-900">96%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-indigo-600 h-full rounded-full" style={{ width: '96%' }}></div>
                  </div>
                  <div className="text-[10px] text-slate-400">Technical and tool-based capabilities</div>
                </div>

                {/* Experience Bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-600 font-medium">Experience</span>
                    <span className="font-mono font-bold text-slate-900">90%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-indigo-600 h-full rounded-full" style={{ width: '90%' }}></div>
                  </div>
                  <div className="text-[10px] text-slate-400">Years and depth of relevant experience</div>
                </div>

                {/* Domain Bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-600 font-medium">Domain</span>
                    <span className="font-mono font-bold text-slate-900">88%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-indigo-600 h-full rounded-full" style={{ width: '88%' }}></div>
                  </div>
                  <div className="text-[10px] text-slate-400">Industry and problem domain alignment</div>
                </div>
              </div>
            </div>

            {/* Informational Callout */}
            <div className="mt-5 p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-500 leading-relaxed">
              This match is based on semantic understanding of the job requirements and candidate background. We analyze meaning, context, and relationships — not just simple keywords.
            </div>
          </div>

          {/* Detailed Score Breakdown Table (from HireAI Screenshot) */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono mb-3">
              Detailed Score Breakdown
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-500 uppercase font-mono text-[10px] border-y border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3 font-semibold">Category</th>
                    <th className="py-2.5 px-3 font-semibold">What We Look For</th>
                    <th className="py-2.5 px-3 font-semibold">Candidate Strength</th>
                    <th className="py-2.5 px-3 font-semibold text-right">Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="py-3 px-3 font-bold text-slate-800">Skills</td>
                    <td className="py-3 px-3 text-slate-500 text-[11px]">
                      Programming languages, frameworks, cloud
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex flex-wrap gap-1">
                        <span className="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 font-mono text-[10px]">Python</span>
                        <span className="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 font-mono text-[10px]">FastAPI</span>
                        <span className="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 font-mono text-[10px]">PostgreSQL</span>
                        <span className="text-[10px] text-slate-400 self-center">+8 more</span>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <span className="font-mono font-bold text-emerald-600">96%</span>
                      <div className="text-[9px] text-slate-400">Excellent</div>
                    </td>
                  </tr>

                  <tr>
                    <td className="py-3 px-3 font-bold text-slate-800">Experience</td>
                    <td className="py-3 px-3 text-slate-500 text-[11px]">
                      Years of experience and role relevance
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex flex-wrap gap-1">
                        <span className="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 font-mono text-[10px]">6+ years</span>
                        <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 font-mono text-[10px]">Backend</span>
                        <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 font-mono text-[10px]">Microservices</span>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <span className="font-mono font-bold text-emerald-600">90%</span>
                      <div className="text-[9px] text-slate-400">Excellent</div>
                    </td>
                  </tr>

                  <tr>
                    <td className="py-3 px-3 font-bold text-slate-800">Domain</td>
                    <td className="py-3 px-3 text-slate-500 text-[11px]">
                      Industry knowledge, problem domain
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex flex-wrap gap-1">
                        <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 font-mono text-[10px]">Distributed Systems</span>
                        <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 font-mono text-[10px]">APIs</span>
                        <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 font-mono text-[10px]">Cloud</span>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <span className="font-mono font-bold text-indigo-600">88%</span>
                      <div className="text-[9px] text-slate-400">Very Good</div>
                    </td>
                  </tr>

                  <tr>
                    <td className="py-3 px-3 font-bold text-slate-800">Education</td>
                    <td className="py-3 px-3 text-slate-500 text-[11px]">
                      Educational background relevance
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 font-mono text-[10px]">B.Tech in CSE</span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <span className="font-mono font-bold text-slate-700">75%</span>
                      <div className="text-[9px] text-slate-400">Good</div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* AI Recommendation Banner & Action Buttons */}
          <div className="bg-indigo-50/60 border border-indigo-200/80 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-start gap-2.5">
              <Star className="w-5 h-5 text-indigo-600 fill-indigo-600 shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-bold text-indigo-950">AI Recommendation</div>
                <div className="text-xs text-indigo-900/80 leading-relaxed">
                  A. Mehta is a top match for this role. We highly recommend moving this candidate to the shortlist.
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => handleAction('SHORTLISTED', 'Added to Shortlist')}
                className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-sm whitespace-nowrap"
              >
                + Add to Shortlist
              </button>
              <button
                onClick={() => handleAction('UNDER_REVIEW', 'Moved to Review')}
                className="px-3 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg transition-colors whitespace-nowrap"
              >
                Move to Review
              </button>
              <button
                onClick={() => handleAction('REJECTED', 'Marked Not a Fit')}
                className="px-3 py-2 text-xs font-medium text-rose-700 bg-white border border-rose-200 hover:bg-rose-50 rounded-lg transition-colors whitespace-nowrap"
              >
                Not a Fit
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Why Candidate Matches & Skills Overlap Bar Chart */}
        <div className="lg:col-span-3 space-y-4">
          {/* Why This Candidate Matches Card */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
            <h3 className="text-xs font-bold text-slate-900">Why This Candidate Matches</h3>
            <div className="space-y-2.5 text-xs text-slate-600">
              <div className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span className="leading-relaxed">
                  Strong overlap in backend technologies (Python, FastAPI, Node.js, PostgreSQL).
                </span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span className="leading-relaxed">
                  Experience building and scaling distributed systems on AWS infrastructure.
                </span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span className="leading-relaxed">
                  Hands-on with Kafka for event streaming and asynchronous processing.
                </span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span className="leading-relaxed">
                  Proven track record of delivering high throughput, reliable APIs with low latency.
                </span>
              </div>
            </div>
          </div>

          {/* Skills Overlap Chart (HireAI Style) */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-900">Skills Overlap</h3>
              <div className="flex items-center gap-2 text-[10px] text-slate-500">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-indigo-600"></span> Matched
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-slate-200"></span> Missing
                </span>
              </div>
            </div>

            <div className="space-y-2 pt-1">
              {skillsOverlap.map((skill) => (
                <div key={skill.name} className="space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-700 font-medium">{skill.name}</span>
                    <span className="font-mono text-slate-500">{skill.matchPct}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-indigo-600 h-full rounded-full"
                      style={{ width: `${skill.matchPct}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Similar Candidates (HireAI Style) */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-900">Similar Candidates</h3>
              <button className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800">
                View All ➔
              </button>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                    SK
                  </div>
                  <div className="text-xs font-medium text-slate-800">S. Kapoor</div>
                </div>
                <span className="text-xs font-mono font-bold text-emerald-600">89%</span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xs">
                    PV
                  </div>
                  <div className="text-xs font-medium text-slate-800">P. Verma</div>
                </div>
                <span className="text-xs font-mono font-bold text-emerald-600">87%</span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-xs">
                    NG
                  </div>
                  <div className="text-xs font-medium text-slate-800">N. Gupta</div>
                </div>
                <span className="text-xs font-mono font-bold text-indigo-600">85%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
