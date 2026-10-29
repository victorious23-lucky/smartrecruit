/**
 * Level-1 DFD Type Definitions
 * Represents the 7 External Entities, 6 Processes (1.0 to 6.0), and 5 Data Stores (D1 to D5)
 */

export type UserRole = 'EMPLOYER' | 'JOB_SEEKER' | 'RECRUITER' | 'ADMIN' | 'MANAGEMENT';
export type AccountStatus = 'ACTIVE' | 'DISABLED';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: AccountStatus;
  password?: string;
  avatar?: string;
  title?: string;
  department?: string;
  createdAt: string;
  lastLogin?: string;
  invitedBy?: string;
  inviteToken?: string;
  passwordResetToken?: string;
  passwordResetExpires?: string;
}

export interface AuthSession {
  token: string;
  user: User;
  expiresAt: string;
}

// ----------------------------------------------------
// D1: Vacancies
// ----------------------------------------------------
export interface Vacancy {
  id: string;
  title: string;
  department: string;
  location: string;
  employmentType: 'Full-time' | 'Contract' | 'Remote' | 'Hybrid';
  salaryRange: string;
  status: 'ACTIVE' | 'DRAFT' | 'CLOSED';
  description: string;
  requiredSkills: string[];
  minExperienceYears: number;
  educationRequired: string;
  employerId: string;
  employerName: string;
  createdAt: string;
  updatedAt: string;
}

// ----------------------------------------------------
// D2: Candidate Profiles
// ----------------------------------------------------
export interface CandidateSkill {
  name: string;
  category: 'Technical' | 'Soft' | 'Tool' | 'Domain';
  proficiency: 'Expert' | 'Advanced' | 'Intermediate';
}

export interface CandidateExperience {
  title: string;
  company: string;
  duration: string;
  highlights: string;
}

export interface CandidateProfile {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  headline: string;
  summary: string;
  experienceYears: number;
  educationLevel: string;
  skills: CandidateSkill[];
  experience: CandidateExperience[];
  certifications: string[];
  domainSpecialties: string[];
  cvRawText?: string;
  parsedByAI: boolean;
  aiEngine?: string;
  updatedAt: string;
}

// ----------------------------------------------------
// D3: Applications
// ----------------------------------------------------
export type ApplicationStatus =
  | 'SUBMITTED'
  | 'UNDER_REVIEW'
  | 'SHORTLISTED'
  | 'INTERVIEW_SCHEDULED'
  | 'OFFERED'
  | 'REJECTED'
  | 'HIRED';

export interface Application {
  id: string;
  vacancyId: string;
  candidateId: string;
  candidateName: string;
  candidateEmail: string;
  candidateHeadline: string;
  vacancyTitle: string;
  department: string;
  status: ApplicationStatus;
  coverNote?: string;
  recruiterNotes?: string;
  decisionBy?: string;
  appliedAt: string;
  updatedAt: string;
}

// ----------------------------------------------------
// D4: Match Results
// ----------------------------------------------------
export interface MatchResult {
  id: string;
  vacancyId: string;
  candidateId: string;
  candidateName: string;
  score: number; // 0 - 100
  rating: 'Exceptional' | 'Strong' | 'Moderate' | 'Low';
  matchedSkills: string[];
  missingSkills: string[];
  analysis: string;
  recommendation: string;
  weightsUsed: {
    skillWeight: number;
    expWeight: number;
    eduWeight: number;
  };
  computedAt: string;
}

// ----------------------------------------------------
// D5: Interviews
// ----------------------------------------------------
export interface Interview {
  id: string;
  applicationId: string;
  vacancyId: string;
  candidateId: string;
  candidateName: string;
  candidateEmail: string;
  vacancyTitle: string;
  interviewerName: string;
  interviewerEmail: string;
  timeSlot: string;
  format: 'VIDEO' | 'TECHNICAL_PAIRING' | 'ONSITE' | 'BEHAVIORAL';
  status: 'SCHEDULED' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
  notes?: string;
  gatewayDispatchId?: string;
  gatewayStatus?: 'QUEUED' | 'DELIVERED' | 'FAILED';
  gatewayChannel?: 'email' | 'sms' | 'both';
  scheduledBy: string;
  createdAt: string;
}

// ----------------------------------------------------
// DFD Event Audit / Real-Time Data Flow Stream
// ----------------------------------------------------
export interface DFDEvent {
  id: string;
  timestamp: string;
  sourceEntity: 'Employer' | 'Job seeker' | 'Recruiter' | 'Admin' | 'Management' | 'AI/NLP service' | 'Email/SMS gateway' | 'System';
  process: '1.0 Manage vacancies' | '2.0 Build candidate profiles' | '3.0 Process applications' | '4.0 Match candidates' | '5.0 Schedule and notify' | '6.0 Produce reports';
  targetStore?: 'D1 Vacancies' | 'D2 Profiles' | 'D3 Applications' | 'D4 Match results' | 'D5 Interviews';
  targetEntity?: 'Employer' | 'Job seeker' | 'Recruiter' | 'Management' | 'Email/SMS gateway';
  description: string;
  payloadSummary: string;
  status: 'SUCCESS' | 'DISPATCHED' | 'SYNCED' | 'RESTRICTED';
}

// ----------------------------------------------------
// Admin Configuration for Matching Algorithm
// ----------------------------------------------------
export interface AdminWeightsConfig {
  skillWeight: number;    // e.g. 0.50
  expWeight: number;      // e.g. 0.30
  eduWeight: number;      // e.g. 0.20
  autoRejectThreshold: number; // e.g. 40
  autoShortlistThreshold: number; // e.g. 85
  emailGatewayEnabled: boolean;
  smsGatewayEnabled: boolean;
}

export * from './notifications';
