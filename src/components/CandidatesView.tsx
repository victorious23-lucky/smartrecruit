import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Users,
  Sparkles,
  FileText,
  Search,
  Filter,
  CheckCircle2,
  Check,
  ArrowRight,
  Loader2,
  GraduationCap,
  Briefcase,
  Mail,
  Phone,
  Building,
  Star,
  Award,
} from 'lucide-react';

const SAMPLE_CVS = {
  distributed: `SOPHIA CHEN
Senior Distributed Systems Architect & Infrastructure Lead
sophia.chen@devmail.org · +1 (415) 890-4421 · San Francisco, CA

PROFESSIONAL SUMMARY
7+ years architecting high-throughput data pipelines and fault-tolerant microservices. Proven track record leading distributed consensus algorithms (Raft), Kafka message brokers, and low-latency storage engines.

CORE COMPETENCIES & TECHNICAL SKILLS
• Distributed Systems, Consensus Protocols, Raft, Paxos
• Languages: Go, Rust, C++, Python
• Infrastructure: Kubernetes, Docker, Helm, Envoy, gRPC
• Storage & Streaming: Apache Kafka, Apache Pulsar, PostgreSQL, Redis, ScyllaDB
• Cloud & Observability: AWS (EKS, MSK), Prometheus, OpenTelemetry, Grafana

EXPERIENCE
Staff Infrastructure Engineer | CloudMatrix Technologies | 2023 - Present
• Designed distributed streaming architecture handling 15B events/day with P99 latency < 8ms.
• Built custom Go-based Raft consensus controller for automated partition rebalancing across 500+ broker nodes.

Senior Systems Engineer | Aether Streaming Networks | 2020 - 2023
• Led migration of 40+ legacy services into Kubernetes EKS with GitOps ArgoCD workflows.

EDUCATION & CREDENTIALS
• Master of Science in Distributed Computing — Carnegie Mellon University (2019)
• Certified Kubernetes Administrator (CKA)`,

  ai_scientist: `DR. DARIUS VANCE-KOWALSKI
Senior AI / Machine Learning Research Scientist
darius.kowalski@ai-research.io · Seattle, WA

EXECUTIVE SUMMARY
Ph.D. in Computer Science with 5 years specialization in deep learning, transformer fine-tuning, retrieval-augmented generation (RAG), and vector database optimization.

CORE TECHNICAL SKILLS
• Deep Learning: PyTorch, JAX, Hugging Face Transformers, DeepSpeed, vLLM
• NLP: LLM Quantization, LoRA/QLoRA, Instruction Tuning, Prompt Engineering, Vector Search
• Tools: Docker, Ray, Triton Inference Server, Milvus, Pinecone, MLflow
• Languages: Python, C++, CUDA (basics)

PROFESSIONAL EXPERIENCE
Senior Machine Learning Scientist | Cognitive Synth Labs | 2022 - Present
• Engineered and served custom 7B/13B parameter code completion models with 60% inference latency reduction.
• Authored 3 NeurIPS/ICLR workshop papers on efficient transformer attention mechanisms.

EDUCATION
• Ph.D. in Computer Science (NLP Specialization) — University of Washington (2021)
• Google Cloud Professional ML Engineer Certified`,

  frontend: `MAYA LIN-PETERSON
Lead Frontend Systems Engineer & UI Specialist
maya.lin@frontendcraft.dev · Chicago, IL

SUMMARY
Full-stack UI engineer with 6 years leading enterprise design system implementations, reactive WebSocket dashboards, and accessible web experiences.

TECHNICAL EXPERTISE
• Frontend: TypeScript, React 19, Next.js, Vite, Tailwind CSS, WebSockets, Canvas/WebGL
• State & Architecture: Redux Toolkit, Zustand, React Query, Microfrontends
• Backend & APIs: Node.js, Express, GraphQL, REST, PostgreSQL
• Testing & Quality: Jest, Vitest, Playwright, WCAG 2.1 AA Accessibility Standards

EXPERIENCE
Principal UI Architect | Prism Analytics | 2021 - Present
• Architected high-frequency financial charting suite handling 60fps streaming data updates.
• Built unified company-wide Tailwind design system used across 14 enterprise applications.

EDUCATION
• B.S. in Computer Science — University of Illinois Urbana-Champaign (2020)`,
};

export const CandidatesView: React.FC = () => {
  const {
    profiles,
    saveCandidateProfile,
    parseCVWithAI,
    currentUser,
    setActiveTab,
  } = useApp();

  const [cvText, setCvText] = useState(SAMPLE_CVS.distributed);
  const [candidateName, setCandidateName] = useState('Sophia Chen');
  const [candidateEmail, setCandidateEmail] = useState('sophia.chen@devmail.org');
  const [candidatePhone, setCandidatePhone] = useState('+1 (415) 890-4421');

  const [isParsing, setIsParsing] = useState(false);
  const [parsingEngine, setParsingEngine] = useState<string | null>(null);
  const [extractedProfile, setExtractedProfile] = useState<any>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleRunAIParse = async () => {
    if (!cvText.trim()) return;
    setIsParsing(true);
    setSavedSuccess(false);

    try {
      const res = await parseCVWithAI(cvText, candidateName);
      if (res.data) {
        setExtractedProfile(res.data);
        setParsingEngine(res.engine);
        if (res.data.name) setCandidateName(res.data.name);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsParsing(false);
    }
  };

  const handleSaveToStore = async () => {
    if (!extractedProfile) return;

    await saveCandidateProfile({
      userId: currentUser?.id || 'cand-anon',
      name: candidateName,
      email: candidateEmail,
      phone: candidatePhone,
      headline: extractedProfile.headline || 'Software Engineer',
      summary: extractedProfile.summary || '',
      experienceYears: extractedProfile.experienceYears || 5,
      educationLevel: extractedProfile.educationLevel || "Bachelor's Degree",
      skills: extractedProfile.skills || [],
      experience: extractedProfile.experience || [],
      certifications: extractedProfile.certifications || [],
      domainSpecialties: extractedProfile.domainSpecialties || [],
      cvRawText: cvText,
      parsedByAI: true,
      aiEngine: parsingEngine || 'Gemini 3.8 Flash',
    });

    setSavedSuccess(true);
  };

  const filteredProfiles = profiles.filter((p) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const matchName = p.name.toLowerCase().includes(q);
    const matchHeadline = p.headline.toLowerCase().includes(q);
    const matchSkills = p.skills.some((s) => s.name.toLowerCase().includes(q));
    return matchName || matchHeadline || matchSkills;
  });

  return (
    <div className="space-y-6">
      {/* Module Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <span>TalentaSync</span>
            <span>›</span>
            <span className="text-slate-800 font-semibold">Candidates</span>
            <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 font-bold border border-blue-200">
              Process 2.0 · D2
            </span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight mt-1">
            Candidates & CV Profiles
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            DFD Process 2.0 · Parse unstructured resumes via Gemini 3.8 Flash NLP into structured D2 Profiles
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('semantic-match')}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors shadow-sm"
          >
            <Sparkles className="w-4 h-4" />
            Semantic JD Matcher
          </button>
        </div>
      </div>

      {/* Top 4 KPI Metrics Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Total Profiles</span>
            <span className="text-xs font-mono text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full">
              D2 Live
            </span>
          </div>
          <div className="text-2xl font-black font-mono text-slate-900 mt-2 tabular-nums">
            18,780
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">Across all technology domains</div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">AI Skills Indexed</span>
            <span className="text-xs font-mono text-indigo-600 font-semibold bg-indigo-50 px-2 py-0.5 rounded-full">
              Gemini 3.8
            </span>
          </div>
          <div className="text-2xl font-black font-mono text-slate-900 mt-2 tabular-nums">
            98.4%
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">Semantic taxonomy extraction rate</div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Avg Experience</span>
            <span className="text-xs font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
              Senior
            </span>
          </div>
          <div className="text-2xl font-black font-mono text-slate-900 mt-2 tabular-nums">
            5.8 Years
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">Verified engineering tenure</div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Shortlisted Pool</span>
            <span className="text-xs font-mono text-amber-600 font-semibold bg-amber-50 px-2 py-0.5 rounded-full">
              Ready
            </span>
          </div>
          <div className="text-2xl font-black font-mono text-slate-900 mt-2 tabular-nums">
            {profiles.length * 8 + 4}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">High-match score candidates</div>
        </div>
      </div>

      {/* Main 2-Column CV Parser Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: CV Input & AI Parser Trigger */}
        <div className="lg:col-span-6 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-900">Job Seeker CV Input</h2>
                <div className="text-[11px] text-slate-400">Flow: CV Text ➔ AI/NLP Service (Process 2.0)</div>
              </div>
            </div>

            {/* Quick Sample CV Switchers */}
            <div className="flex items-center gap-1 text-[11px]">
              <span className="text-slate-400 mr-1">Sample:</span>
              <button
                onClick={() => {
                  setCvText(SAMPLE_CVS.distributed);
                  setCandidateName('Sophia Chen');
                  setCandidateEmail('sophia.chen@devmail.org');
                }}
                className="px-2 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-colors"
              >
                Distributed
              </button>
              <button
                onClick={() => {
                  setCvText(SAMPLE_CVS.ai_scientist);
                  setCandidateName('Dr. Darius Vance-Kowalski');
                  setCandidateEmail('darius.kowalski@ai-research.io');
                }}
                className="px-2 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-colors"
              >
                AI Scientist
              </button>
              <button
                onClick={() => {
                  setCvText(SAMPLE_CVS.frontend);
                  setCandidateName('Maya Lin-Peterson');
                  setCandidateEmail('maya.lin@frontendcraft.dev');
                }}
                className="px-2 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-colors"
              >
                Frontend
              </button>
            </div>
          </div>

          {/* Candidate Contact Metadata Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Candidate Name
              </label>
              <input
                type="text"
                value={candidateName}
                onChange={(e) => setCandidateName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={candidateEmail}
                onChange={(e) => setCandidateEmail(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Phone Number
              </label>
              <input
                type="text"
                value={candidatePhone}
                onChange={(e) => setCandidatePhone(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
              Curriculum Vitae / Resume Plaintext
            </label>
            <textarea
              rows={11}
              value={cvText}
              onChange={(e) => setCvText(e.target.value)}
              placeholder="Paste candidate resume text or CV content here..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-mono text-slate-800 focus:outline-none focus:border-emerald-500 focus:bg-white leading-relaxed"
            />
          </div>

          <div className="pt-2 flex items-center justify-between">
            <div className="text-xs text-slate-500 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Engine: Google Gemini 3.8 Flash NLP</span>
            </div>

            <button
              onClick={handleRunAIParse}
              disabled={isParsing || !cvText.trim()}
              className="flex items-center gap-2 px-5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 rounded-xl transition-colors shadow-sm"
            >
              {isParsing ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Parsing with Gemini...
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  Extract Skills with AI
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: AI Extraction Output & Commit to D2 */}
        <div className="lg:col-span-6 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                  D2 Store
                </span>
                <h2 className="text-sm font-bold text-slate-900">Extracted Candidate Profile</h2>
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                {parsingEngine ? `Synthesized by ${parsingEngine}` : 'Run AI extraction to inspect output schema'}
              </div>
            </div>

            {extractedProfile && (
              <button
                onClick={handleSaveToStore}
                className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors shadow-xs"
              >
                <Check className="w-3.5 h-3.5" />
                Save to D2 Profiles
              </button>
            )}
          </div>

          {savedSuccess && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Profile committed to D2 Profiles store! Ready for matching in Process 4.0.</span>
            </div>
          )}

          {extractedProfile ? (
            <div className="space-y-4">
              <div>
                <div className="text-base font-bold text-slate-900">
                  {extractedProfile.name || candidateName}
                </div>
                <div className="text-xs text-emerald-700 font-semibold mt-0.5">
                  {extractedProfile.headline}
                </div>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                  {extractedProfile.summary}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <div className="text-slate-400 font-medium text-[11px]">Experience</div>
                  <div className="text-slate-900 font-mono font-bold mt-0.5">
                    {extractedProfile.experienceYears} Years
                  </div>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <div className="text-slate-400 font-medium text-[11px]">Education</div>
                  <div className="text-slate-900 font-medium mt-0.5 truncate">
                    {extractedProfile.educationLevel}
                  </div>
                </div>
              </div>

              {/* Skills Taxonomy */}
              <div>
                <div className="text-xs font-semibold text-slate-800 mb-2 flex items-center justify-between">
                  <span>Extracted Skills ({extractedProfile.skills?.length || 0})</span>
                  <span className="text-[10px] text-slate-400">Structured by AI/NLP service</span>
                </div>
                <div className="flex flex-wrap gap-1.5 max-h-40 overflow-y-auto pr-1">
                  {(extractedProfile.skills || []).map((skill: any, idx: number) => {
                    const name = typeof skill === 'string' ? skill : skill.name;
                    const prof = skill.proficiency;
                    return (
                      <div
                        key={idx}
                        className="flex items-center gap-1.5 bg-slate-100 px-2.5 py-1 rounded-lg text-xs"
                      >
                        <span className="text-slate-800 font-medium">{name}</span>
                        {prof && (
                          <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-1 rounded">
                            {prof}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Experience History */}
              {extractedProfile.experience && extractedProfile.experience.length > 0 && (
                <div>
                  <div className="text-xs font-semibold text-slate-800 mb-2">Work Experience</div>
                  <div className="space-y-2">
                    {extractedProfile.experience.map((exp: any, i: number) => (
                      <div key={i} className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs">
                        <div className="font-semibold text-slate-900">{exp.title}</div>
                        <div className="text-slate-500 text-[11px]">
                          {exp.company} · {exp.duration}
                        </div>
                        {exp.highlights && (
                          <div className="text-slate-600 text-[11px] mt-1">{exp.highlights}</div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="py-20 text-center text-slate-400 text-xs">
              <Sparkles className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <div className="font-semibold text-slate-700">No profile parsed yet</div>
              <div className="text-[11px] text-slate-400 mt-1 max-w-xs mx-auto">
                Click "Extract Skills with AI" to pass raw CV text through Gemini 3.8 Flash NLP into structured JSON
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Section: All Registered Candidate Profiles in D2 Store */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span className="font-mono text-xs font-bold px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                D2
              </span>
              <span>All Registered Candidate Profiles ({profiles.length})</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Persistent profiles accessible by Process 4.0 (Match Candidates) & Process 3.0 (Process Applications)
            </p>
          </div>

          <div className="relative max-w-xs w-full">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search candidate or skill..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredProfiles.map((p) => (
            <div
              key={p.id}
              className="bg-white border border-slate-200/90 rounded-2xl p-4 hover:border-slate-300 hover:shadow-xs transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-bold text-sm text-slate-900">{p.name}</div>
                    <div className="text-[11px] text-emerald-700 font-medium truncate max-w-[180px]">
                      {p.headline}
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">{p.id}</span>
                </div>

                <div className="mt-3 text-xs text-slate-600">
                  <span className="font-mono font-semibold text-slate-800">{p.experienceYears} yrs exp</span> ·{' '}
                  <span className="truncate">{p.educationLevel.split('(')[0]}</span>
                </div>

                <div className="mt-3 flex flex-wrap gap-1">
                  {p.skills.slice(0, 3).map((s, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] font-medium bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md"
                    >
                      {s.name}
                    </span>
                  ))}
                  {p.skills.length > 3 && (
                    <span className="text-[10px] font-mono text-slate-400 self-center">
                      +{p.skills.length - 3}
                    </span>
                  )}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[10px] font-mono text-slate-400">{p.email}</span>
                <button
                  onClick={() => setActiveTab('semantic-match')}
                  className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-0.5"
                >
                  Match <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
