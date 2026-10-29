import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CandidateProfile, CandidateSkill } from '../../types/dfd';
import {
  FileText,
  Sparkles,
  User,
  GraduationCap,
  Briefcase,
  CheckCircle,
  Plus,
  Trash2,
  Upload,
  ArrowRight,
  Loader2,
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

export const Process2_CandidateProfiles: React.FC = () => {
  const {
    profiles,
    saveCandidateProfile,
    parseCVWithAI,
    currentUser,
    setActiveTab,
  } = useApp();

  const [cvText, setCvText] = useState(SAMPLE_CVS.distributed);
  const [candidateName, setCandidateName] = useState(currentUser?.name || 'Sophia Chen');
  const [candidateEmail, setCandidateEmail] = useState(currentUser?.email || 'sophia.chen@devmail.org');
  const [candidatePhone, setCandidatePhone] = useState('+1 (415) 890-4421');

  const [isParsing, setIsParsing] = useState(false);
  const [parsingEngine, setParsingEngine] = useState<string | null>(null);
  const [extractedProfile, setExtractedProfile] = useState<any>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);

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

  return (
    <div className="space-y-6">
      {/* Process Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-blue-600 text-white">
                Process 2.0
              </span>
              <span className="text-xs text-slate-400 font-mono">
                DFD Data Flow: Job seeker ➔ Process 2.0 ➔ AI/NLP service ➔ D2 Profiles
              </span>
            </div>
            <h1 className="text-xl font-bold text-white mt-1">Build Candidate Profiles</h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Processes raw CV text through the AI/NLP Service (Gemini 3.8 Flash) to extract structured skills and qualifications, saving into D2 Profiles.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('applications')}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-300 hover:text-white bg-slate-800 rounded-lg border border-slate-700 transition-colors"
            >
              Go to Applications (3.0) <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: CV Input & AI Parsing trigger */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-indigo-400" />
                <h2 className="text-sm font-bold text-white">Job Seeker CV Input</h2>
              </div>
              <div className="flex items-center gap-1 text-[11px] text-slate-400">
                <span>Sample CV:</span>
                <button
                  onClick={() => setCvText(SAMPLE_CVS.distributed)}
                  className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                >
                  Distributed
                </button>
                <button
                  onClick={() => setCvText(SAMPLE_CVS.ai_scientist)}
                  className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                >
                  AI Scientist
                </button>
                <button
                  onClick={() => setCvText(SAMPLE_CVS.frontend)}
                  className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                >
                  Frontend
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">
                  Candidate Name
                </label>
                <input
                  type="text"
                  value={candidateName}
                  onChange={(e) => setCandidateName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={candidateEmail}
                  onChange={(e) => setCandidateEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">
                  Phone
                </label>
                <input
                  type="text"
                  value={candidatePhone}
                  onChange={(e) => setCandidatePhone(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-400 mb-1">
                CV / Resume Text (Data Flow: CV Text ➔ AI/NLP Service)
              </label>
              <textarea
                rows={12}
                value={cvText}
                onChange={(e) => setCvText(e.target.value)}
                placeholder="Paste curriculum vitae text here..."
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs font-mono text-slate-300 focus:outline-none focus:border-indigo-500 leading-relaxed"
              />
            </div>

            <div className="mt-4 flex items-center justify-between">
              <div className="text-xs text-slate-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>AI/NLP Extraction via Gemini 3.8 Flash</span>
              </div>

              <button
                onClick={handleRunAIParse}
                disabled={isParsing || !cvText.trim()}
                className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 rounded-lg transition-colors shadow-md"
              >
                {isParsing ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Parsing with AI...
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
        </div>

        {/* Right Column: Extracted Profile & Commit to D2 */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <div className="flex items-center justify-between mb-3 pb-3 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-indigo-400">D2</span>
                  <h2 className="text-sm font-bold text-white">Extracted Candidate Profile</h2>
                </div>
                <div className="text-[11px] text-slate-400">
                  {parsingEngine ? `Synthesized by ${parsingEngine}` : 'Run AI extraction to inspect output'}
                </div>
              </div>

              {extractedProfile && (
                <button
                  onClick={handleSaveToStore}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-colors shadow-sm"
                >
                  <CheckCircle className="w-3.5 h-3.5" />
                  Save to D2 Profiles
                </button>
              )}
            </div>

            {savedSuccess && (
              <div className="mb-4 p-3 rounded-lg bg-emerald-950/60 border border-emerald-800/80 text-xs text-emerald-300 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Profile successfully saved to D2 Profiles store! Ready for candidate matching.</span>
              </div>
            )}

            {extractedProfile ? (
              <div className="space-y-4">
                <div>
                  <div className="text-base font-bold text-white">{extractedProfile.name || candidateName}</div>
                  <div className="text-xs text-indigo-300 font-medium">{extractedProfile.headline}</div>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed bg-slate-950/60 p-3 rounded-lg border border-slate-800/60">
                    {extractedProfile.summary}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
                    <div className="text-slate-500 font-medium">Experience</div>
                    <div className="text-slate-200 font-mono font-bold mt-0.5">
                      {extractedProfile.experienceYears} Years
                    </div>
                  </div>
                  <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
                    <div className="text-slate-500 font-medium">Education</div>
                    <div className="text-slate-200 font-medium mt-0.5 truncate">
                      {extractedProfile.educationLevel}
                    </div>
                  </div>
                </div>

                {/* Skills Taxonomy */}
                <div>
                  <div className="text-xs font-semibold text-slate-300 mb-2 flex items-center justify-between">
                    <span>Extracted Skills ({extractedProfile.skills?.length || 0})</span>
                    <span className="text-[10px] text-slate-500">Skills data from AI/NLP service</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 max-h-44 overflow-y-auto pr-1">
                    {(extractedProfile.skills || []).map((skill: any, idx: number) => {
                      const name = typeof skill === 'string' ? skill : skill.name;
                      const cat = skill.category || 'Skill';
                      const prof = skill.proficiency;
                      return (
                        <div
                          key={idx}
                          className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 px-2.5 py-1 rounded text-xs"
                        >
                          <span className="text-white font-medium">{name}</span>
                          {prof && (
                            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-1 rounded">
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
                    <div className="text-xs font-semibold text-slate-300 mb-2">Work Experience</div>
                    <div className="space-y-2">
                      {extractedProfile.experience.map((exp: any, i: number) => (
                        <div key={i} className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800 text-xs">
                          <div className="font-semibold text-slate-200">{exp.title}</div>
                          <div className="text-slate-400 text-[11px]">
                            {exp.company} · {exp.duration}
                          </div>
                          {exp.highlights && (
                            <div className="text-slate-400 text-[11px] mt-1">{exp.highlights}</div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="py-16 text-center text-slate-500 text-xs">
                <Sparkles className="w-8 h-8 text-slate-700 mx-auto mb-2" />
                <div>Click "Extract Skills with AI" to parse the CV text</div>
                <div className="text-[11px] text-slate-600 mt-1">
                  Processes raw CV text through Gemini 3.8 Flash NLP pipeline
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Existing Profiles in D2 Store */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-indigo-400">D2</span>
              <span>All Registered Candidate Profiles ({profiles.length})</span>
            </h3>
            <div className="text-xs text-slate-400 mt-0.5">
              Persistent profiles accessible by Process 4.0 (Match Candidates)
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {profiles.map((p) => (
            <div
              key={p.id}
              className="bg-slate-950 border border-slate-800/80 rounded-lg p-4 hover:border-slate-700 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-bold text-sm text-white">{p.name}</div>
                  <div className="text-[11px] text-indigo-400 truncate max-w-[180px]">{p.headline}</div>
                </div>
                <span className="text-[10px] font-mono text-slate-500">{p.id}</span>
              </div>

              <div className="mt-3 text-xs text-slate-400">
                <span className="font-mono text-slate-300">{p.experienceYears} yrs exp</span> ·{' '}
                <span className="truncate">{p.educationLevel.split('(')[0]}</span>
              </div>

              <div className="mt-3 flex flex-wrap gap-1">
                {p.skills.slice(0, 4).map((s, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] font-mono bg-slate-900 text-slate-300 px-1.5 py-0.5 rounded border border-slate-800"
                  >
                    {s.name}
                  </span>
                ))}
                {p.skills.length > 4 && (
                  <span className="text-[10px] text-slate-500 self-center">+{p.skills.length - 4}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
