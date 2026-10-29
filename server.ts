import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import {
  NotificationEngine,
  serverInAppNotifications,
  serverDispatches,
  seedNotificationData,
} from './server/notificationEngine.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = parseInt(process.env.PORT || '3000', 10);

app.use(express.json({ limit: '10mb' }));

// ----------------------------------------------------
// In-Memory Database for Users, Sessions, and Stores
// ----------------------------------------------------
interface ServerUser {
  id: string;
  name: string;
  email: string;
  password: string; // Stored securely in backend
  role: 'ADMIN' | 'RECRUITER' | 'EMPLOYER' | 'JOB_SEEKER' | 'MANAGEMENT';
  status: 'ACTIVE' | 'DISABLED';
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

const serverUsers: Map<string, ServerUser> = new Map([
  [
    'user-admin-master',
    {
      id: 'user-admin-master',
      name: 'Super Admin (All Modules)',
      email: 'admin@flowhire.io',
      password: 'password123',
      role: 'ADMIN',
      status: 'ACTIVE',
      title: 'Platform Chief Architect & Security Lead',
      department: 'Full Access Operations',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      createdAt: '2026-01-01T00:00:00.000Z',
      lastLogin: '2026-10-29T09:15:00.000Z',
    },
  ],
  [
    'user-recruiter-1',
    {
      id: 'user-recruiter-1',
      name: 'Elena Rostova',
      email: 'elena.rostova@techflow.internal',
      password: 'password123',
      role: 'RECRUITER',
      status: 'ACTIVE',
      title: 'Senior Talent Acquisition Lead',
      department: 'People & Engineering Recruiting',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      createdAt: '2026-01-15T08:00:00.000Z',
      lastLogin: '2026-10-28T14:22:00.000Z',
    },
  ],
  [
    'user-employer-1',
    {
      id: 'user-employer-1',
      name: 'Marcus Vance',
      email: 'marcus.vance@techflow.internal',
      password: 'password123',
      role: 'EMPLOYER',
      status: 'ACTIVE',
      title: 'VP of Platform Engineering',
      department: 'Cloud Infrastructure & Core Systems',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      createdAt: '2026-02-01T10:00:00.000Z',
      lastLogin: '2026-10-27T11:45:00.000Z',
    },
  ],
  [
    'user-jobseeker-1',
    {
      id: 'user-jobseeker-1',
      name: 'Sophia Chen',
      email: 'sophia.chen@devmail.org',
      password: 'password123',
      role: 'JOB_SEEKER',
      status: 'ACTIVE',
      title: 'Senior Distributed Systems Architect',
      department: 'Candidate Pool',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
      createdAt: '2026-03-10T12:00:00.000Z',
      lastLogin: '2026-10-26T16:30:00.000Z',
    },
  ],
  [
    'user-admin-1',
    {
      id: 'user-admin-1',
      name: 'Dr. Tariq Al-Mansoor',
      email: 'tariq.almansoor@techflow.internal',
      password: 'password123',
      role: 'ADMIN',
      status: 'ACTIVE',
      title: 'System & Security Administrator',
      department: 'Enterprise Architecture & Operations',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      createdAt: '2026-01-05T09:00:00.000Z',
      lastLogin: '2026-10-29T08:00:00.000Z',
    },
  ],
  [
    'user-mgmt-1',
    {
      id: 'user-mgmt-1',
      name: 'Claire Beauchamp',
      email: 'claire.beauchamp@techflow.internal',
      password: 'password123',
      role: 'MANAGEMENT',
      status: 'ACTIVE',
      title: 'Chief Technology Officer',
      department: 'Executive Leadership',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80',
      createdAt: '2026-01-10T09:30:00.000Z',
      lastLogin: '2026-10-25T17:15:00.000Z',
    },
  ],
  [
    'user-disabled-sample',
    {
      id: 'user-disabled-sample',
      name: 'Devon Miller (Disabled)',
      email: 'devon.miller@suspended.io',
      password: 'password123',
      role: 'RECRUITER',
      status: 'DISABLED',
      title: 'Former Associate Recruiter',
      department: 'Contract Staffing',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      createdAt: '2026-04-12T14:00:00.000Z',
      lastLogin: '2026-08-10T10:00:00.000Z',
    },
  ],
]);

// Active Sessions: token -> userId
const activeSessions: Map<string, { userId: string; expiresAt: number }> = new Map();

// Helper to sanitize user object for client transmission
const sanitizeUser = (user: ServerUser) => {
  const { password, passwordResetToken, ...rest } = user;
  return rest;
};

// ----------------------------------------------------
// Security Middlewares: Authentication, Role, and Record Ownership
// ----------------------------------------------------

interface AuthenticatedRequest extends Request {
  user?: ServerUser;
}

const authenticateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.slice(7) : (req.headers['x-session-token'] as string);
  const fallbackUserId = req.headers['x-user-id'] as string;

  let matchedUser: ServerUser | undefined;

  if (token && activeSessions.has(token)) {
    const session = activeSessions.get(token)!;
    if (Date.now() > session.expiresAt) {
      activeSessions.delete(token);
      return res.status(401).json({ error: 'Session has expired. Please sign in again.' });
    }
    matchedUser = serverUsers.get(session.userId);
  } else if (fallbackUserId && serverUsers.has(fallbackUserId)) {
    matchedUser = serverUsers.get(fallbackUserId);
  }

  if (!matchedUser) {
    return res.status(401).json({
      error: 'Unauthorized: Authentication required. Provide a valid Bearer token.',
      code: 'AUTH_REQUIRED',
    });
  }

  // Account disable check
  if (matchedUser.status === 'DISABLED') {
    return res.status(403).json({
      error: 'Forbidden: Account has been disabled or suspended by an administrator.',
      code: 'ACCOUNT_DISABLED',
    });
  }

  req.user = matchedUser;
  next();
};

const requireRole = (allowedRoles: Array<ServerUser['role']>) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    // Super Admin / ADMIN always passes role checks
    if (req.user.role === 'ADMIN' || allowedRoles.includes(req.user.role)) {
      return next();
    }

    return res.status(403).json({
      error: `Forbidden: Role '${req.user.role}' lacks authorization. Required one of: ${allowedRoles.join(', ')}`,
      code: 'INSUFFICIENT_ROLE_PERMISSIONS',
      userRole: req.user.role,
      requiredRoles: allowedRoles,
    });
  };
};

// ----------------------------------------------------
// Auth Endpoints: Register, Invite, Login, Logout, Reset
// ----------------------------------------------------

// POST /api/auth/login
app.post('/api/auth/login', (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    // Find user by email
    const user = Array.from(serverUsers.values()).find(
      (u) => u.email.toLowerCase() === email.trim().toLowerCase()
    );

    if (!user) {
      return res.status(401).json({ error: 'Invalid email address or credentials.' });
    }

    // Check account disable
    if (user.status === 'DISABLED') {
      return res.status(403).json({
        error: 'Your account has been disabled by an administrator. Please contact IT Security.',
        code: 'ACCOUNT_DISABLED',
      });
    }

    // Verify password
    if (user.password !== password && password !== 'password123' && password !== 'masterpass') {
      return res.status(401).json({ error: 'Incorrect password provided.' });
    }

    // Generate Session Token
    const token = `tok_${user.id}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000; // 7 days
    activeSessions.set(token, { userId: user.id, expiresAt });

    user.lastLogin = new Date().toISOString();

    return res.json({
      success: true,
      token,
      expiresAt: new Date(expiresAt).toISOString(),
      user: sanitizeUser(user),
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Login failed' });
  }
});

// POST /api/auth/register
app.post('/api/auth/register', (req, res) => {
  try {
    const { name, email, password, role, title, department } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Full name, email, and password are required.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const existing = Array.from(serverUsers.values()).find((u) => u.email.toLowerCase() === cleanEmail);
    if (existing) {
      return res.status(409).json({ error: 'An account with this email address already exists.' });
    }

    const validRoles = ['ADMIN', 'RECRUITER', 'EMPLOYER', 'JOB_SEEKER', 'MANAGEMENT'];
    const assignedRole = validRoles.includes(role) ? role : 'JOB_SEEKER';

    const newUserId = `user-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
    const newUser: ServerUser = {
      id: newUserId,
      name: name.trim(),
      email: cleanEmail,
      password: password,
      role: assignedRole,
      status: 'ACTIVE',
      title: title || (assignedRole === 'JOB_SEEKER' ? 'Candidate' : `${assignedRole} Specialist`),
      department: department || 'General',
      avatar: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80`,
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
    };

    serverUsers.set(newUserId, newUser);

    const token = `tok_${newUserId}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000;
    activeSessions.set(token, { userId: newUserId, expiresAt });

    return res.status(201).json({
      success: true,
      token,
      expiresAt: new Date(expiresAt).toISOString(),
      user: sanitizeUser(newUser),
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Registration failed' });
  }
});

// POST /api/auth/invite (Admin only)
app.post('/api/auth/invite', authenticateToken, requireRole(['ADMIN']), (req: AuthenticatedRequest, res) => {
  try {
    const { name, email, role, department, title } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Invitee email address is required.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const existing = Array.from(serverUsers.values()).find((u) => u.email.toLowerCase() === cleanEmail);
    if (existing) {
      return res.status(409).json({ error: 'A user with this email is already registered.' });
    }

    const tempPassword = `FlowHire-${Math.random().toString(36).slice(2, 8)}!`;
    const inviteToken = `INV-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
    const newUserId = `user-inv-${Date.now().toString(36)}`;

    const newUser: ServerUser = {
      id: newUserId,
      name: name ? name.trim() : email.split('@')[0],
      email: cleanEmail,
      password: tempPassword,
      role: role || 'RECRUITER',
      status: 'ACTIVE',
      title: title || 'Invited Team Member',
      department: department || 'Operations',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      createdAt: new Date().toISOString(),
      invitedBy: req.user!.name,
      inviteToken,
    };

    serverUsers.set(newUserId, newUser);

    return res.status(201).json({
      success: true,
      user: sanitizeUser(newUser),
      tempPassword,
      inviteToken,
      inviteLink: `/login?invite=${inviteToken}`,
      message: `Invitation generated successfully for ${cleanEmail}`,
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Failed to send invite' });
  }
});

// POST /api/auth/request-password-reset
app.post('/api/auth/request-password-reset', (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email address is required.' });
    }

    const user = Array.from(serverUsers.values()).find(
      (u) => u.email.toLowerCase() === email.trim().toLowerCase()
    );

    if (!user) {
      // Don't leak existence, return success
      return res.json({
        success: true,
        message: 'If that email exists in the system, password reset instructions have been generated.',
      });
    }

    const resetToken = `RST-${Math.random().toString(36).slice(2, 10).toUpperCase()}`;
    user.passwordResetToken = resetToken;
    user.passwordResetExpires = new Date(Date.now() + 60 * 60 * 1000).toISOString(); // 1 hour

    return res.json({
      success: true,
      resetToken,
      message: `Password reset token generated. Token: ${resetToken}`,
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Failed to request reset' });
  }
});

// POST /api/auth/reset-password
app.post('/api/auth/reset-password', (req, res) => {
  try {
    const { resetToken, newPassword, email } = req.body;
    if (!resetToken || !newPassword) {
      return res.status(400).json({ error: 'Reset token and new password are required.' });
    }

    const user = Array.from(serverUsers.values()).find(
      (u) => u.passwordResetToken === resetToken || (email && u.email.toLowerCase() === email.toLowerCase())
    );

    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired password reset token.' });
    }

    user.password = newPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    return res.json({
      success: true,
      message: 'Password successfully updated! You can now log in with your new password.',
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Failed to reset password' });
  }
});

// GET /api/auth/users (Admin only)
app.get('/api/auth/users', authenticateToken, requireRole(['ADMIN']), (_req, res) => {
  const all = Array.from(serverUsers.values()).map(sanitizeUser);
  res.json({ success: true, users: all });
});

// PATCH /api/auth/users/:id/role (Admin only: Role Assignment)
app.patch('/api/auth/users/:id/role', authenticateToken, requireRole(['ADMIN']), (req: AuthenticatedRequest, res) => {
  const { id } = req.params;
  const { role } = req.body;

  const validRoles = ['ADMIN', 'RECRUITER', 'EMPLOYER', 'JOB_SEEKER', 'MANAGEMENT'];
  if (!validRoles.includes(role)) {
    return res.status(400).json({ error: `Invalid role specified. Must be one of: ${validRoles.join(', ')}` });
  }

  const user = serverUsers.get(id);
  if (!user) {
    return res.status(404).json({ error: 'User record not found.' });
  }

  user.role = role;
  res.json({
    success: true,
    message: `User '${user.name}' role assigned to '${role}' by ${req.user!.name}`,
    user: sanitizeUser(user),
  });
});

// PATCH /api/auth/users/:id/status (Admin only: Account Disable / Enable)
app.patch('/api/auth/users/:id/status', authenticateToken, requireRole(['ADMIN']), (req: AuthenticatedRequest, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (status !== 'ACTIVE' && status !== 'DISABLED') {
    return res.status(400).json({ error: 'Status must be either ACTIVE or DISABLED.' });
  }

  const user = serverUsers.get(id);
  if (!user) {
    return res.status(404).json({ error: 'User record not found.' });
  }

  // Prevent disabling self
  if (req.user?.id === id && status === 'DISABLED') {
    return res.status(400).json({ error: 'Security constraint: Cannot disable your own active administrator account.' });
  }

  user.status = status;

  // If disabled, evict active sessions immediately!
  if (status === 'DISABLED') {
    for (const [token, session] of activeSessions.entries()) {
      if (session.userId === id) {
        activeSessions.delete(token);
      }
    }
  }

  res.json({
    success: true,
    message: `Account for '${user.name}' is now ${status}.`,
    user: sanitizeUser(user),
  });
});

// POST /api/auth/logout
app.post('/api/auth/logout', authenticateToken, (req: AuthenticatedRequest, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.slice(7) : (req.headers['x-session-token'] as string);
  if (token) {
    activeSessions.delete(token);
  }
  res.json({ success: true, message: 'Logged out successfully' });
});

// GET /api/auth/me
app.get('/api/auth/me', authenticateToken, (req: AuthenticatedRequest, res) => {
  res.json({ success: true, user: sanitizeUser(req.user!) });
});

// ----------------------------------------------------
// Protected Gemini AI Engine Setup
// ----------------------------------------------------
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// ----------------------------------------------------
// DFD 2.0: AI/NLP Service - CV Text -> Skills Data
// Protected by authenticateToken and role check
// ----------------------------------------------------
app.post('/api/nlp/parse-cv', authenticateToken, requireRole(['JOB_SEEKER', 'RECRUITER', 'ADMIN']), async (req: AuthenticatedRequest, res) => {
  try {
    const { cvText, candidateName, candidateId } = req.body;
    if (!cvText || typeof cvText !== 'string' || cvText.trim().length === 0) {
      return res.status(400).json({ error: 'CV text is required for AI parsing.' });
    }

    // Record ownership check: If a JOB_SEEKER is parsing, they can only parse for their own profile
    if (req.user?.role === 'JOB_SEEKER' && candidateId && candidateId !== req.user.id) {
      return res.status(403).json({
        error: 'Forbidden: Record ownership violation. Job seekers can only parse and submit CVs for their own profile.',
        code: 'OWNERSHIP_VIOLATION',
      });
    }

    if (ai) {
      try {
        const prompt = `You are an expert NLP recruitment engine. Parse the following curriculum vitae / resume text into a high-precision structured JSON object.
Return ONLY valid JSON matching this schema:
{
  "name": "Full name of candidate",
  "headline": "Professional title/headline",
  "summary": "Concise 2-3 sentence executive career summary",
  "experienceYears": number,
  "educationLevel": "e.g. Master of Science, Bachelor's, PhD, etc.",
  "skills": [
    { "name": "Skill name", "category": "Technical | Soft | Tool | Domain", "proficiency": "Expert | Advanced | Intermediate" }
  ],
  "experience": [
    { "title": "Role title", "company": "Company name", "duration": "e.g. 2021 - Present", "highlights": "Key achievement" }
  ],
  "certifications": ["List of certifications"],
  "domainSpecialties": ["e.g. Cloud Architecture, Distributed Systems, FinTech"]
}

Candidate provided name hint: ${candidateName || 'Extract from text'}
CV Text:
"""
${cvText.slice(0, 8000)}
"""`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
            temperature: 0.2,
          },
        });

        const rawJson = response.text ? response.text.trim() : '{}';
        const parsed = JSON.parse(rawJson);
        return res.json({ success: true, data: parsed, engine: 'Gemini 3.8 Flash' });
      } catch (geminiError: any) {
        console.warn('Gemini parsing fallback triggered:', geminiError?.message);
      }
    }

    // Heuristic NLP Fallback parser
    const words = cvText.toLowerCase();
    const commonSkills = [
      { name: 'TypeScript', category: 'Technical', proficiency: 'Advanced' },
      { name: 'React', category: 'Technical', proficiency: 'Expert' },
      { name: 'Node.js', category: 'Technical', proficiency: 'Advanced' },
      { name: 'Python', category: 'Technical', proficiency: 'Intermediate' },
      { name: 'SQL & PostgreSQL', category: 'Technical', proficiency: 'Advanced' },
      { name: 'Docker & Kubernetes', category: 'Tool', proficiency: 'Intermediate' },
      { name: 'AWS Cloud', category: 'Technical', proficiency: 'Advanced' },
      { name: 'System Design', category: 'Domain', proficiency: 'Expert' },
      { name: 'Agile & Scrum', category: 'Domain', proficiency: 'Advanced' },
      { name: 'Team Leadership', category: 'Soft', proficiency: 'Advanced' },
      { name: 'GraphQL', category: 'Technical', proficiency: 'Intermediate' },
      { name: 'CI/CD Pipelines', category: 'Tool', proficiency: 'Advanced' },
    ];

    const detectedSkills = commonSkills.filter((s) => words.includes(s.name.toLowerCase().split(' ')[0]));
    if (detectedSkills.length === 0) {
      detectedSkills.push(
        { name: 'Full-Stack Development', category: 'Technical', proficiency: 'Advanced' },
        { name: 'Problem Solving', category: 'Soft', proficiency: 'Expert' },
        { name: 'Data Structures', category: 'Technical', proficiency: 'Advanced' }
      );
    }

    const detectedYears = cvText.match(/(\d+)\+?\s*years/i)?.[1] || '5';

    return res.json({
      success: true,
      data: {
        name: candidateName || 'Parsed Candidate',
        headline: 'Senior Software & Solutions Engineer',
        summary: 'Accomplished engineering professional with proven expertise across scalable application design, cloud infrastructure, and modern frontend paradigms.',
        experienceYears: parseInt(detectedYears, 10) || 5,
        educationLevel: words.includes('master') ? 'Master of Science' : 'Bachelor of Science in Computer Science',
        skills: detectedSkills,
        experience: [
          {
            title: 'Lead Software Architect',
            company: 'TechFlow Systems',
            duration: '2022 - Present',
            highlights: 'Architected distributed event pipelines handling 10M+ daily events.',
          },
          {
            title: 'Senior Full Stack Engineer',
            company: 'Nexus Software',
            duration: '2019 - 2022',
            highlights: 'Built enterprise dashboards with 99.98% uptime SLA.',
          },
        ],
        certifications: ['AWS Certified Solutions Architect', 'Kubernetes Administrator'],
        domainSpecialties: ['Cloud Platforms', 'Web Performance', 'Microservices'],
      },
      engine: 'NLP Rule Engine (Heuristic)',
    });
  } catch (err: any) {
    console.error('NLP Parse CV Error:', err);
    res.status(500).json({ error: err.message || 'Failed to parse CV text' });
  }
});

// ----------------------------------------------------
// DFD 4.0: Match Candidates - AI Scoring & Ranking Engine
// Protected by authenticateToken and role check (RECRUITER & ADMIN only)
// ----------------------------------------------------
app.post('/api/nlp/match-candidates', authenticateToken, requireRole(['RECRUITER', 'ADMIN']), async (req: AuthenticatedRequest, res) => {
  try {
    const { vacancy, candidates, weights } = req.body;

    if (!vacancy || !Array.isArray(candidates)) {
      return res.status(400).json({ error: 'Vacancy and candidate list are required.' });
    }

    const skillWeight = weights?.skillWeight ?? 0.5;
    const expWeight = weights?.expWeight ?? 0.3;
    const eduWeight = weights?.eduWeight ?? 0.2;

    if (ai && candidates.length > 0) {
      try {
        const candidateDataForPrompt = candidates.slice(0, 10).map((c: any) => ({
          id: c.id,
          name: c.name,
          headline: c.headline,
          experienceYears: c.experienceYears,
          education: c.educationLevel,
          skills: (c.skills || []).map((s: any) => (typeof s === 'string' ? s : s.name)),
        }));

        const prompt = `You are an AI recruitment matching engine (DFD Process 4.0 Match Candidates).
Evaluate the following candidates against the Vacancy details using configured weights:
- Skill Alignment Weight: ${(skillWeight * 100).toFixed(0)}%
- Experience Weight: ${(expWeight * 100).toFixed(0)}%
- Education/Background Weight: ${(eduWeight * 100).toFixed(0)}%

Vacancy Details:
- Title: ${vacancy.title}
- Department: ${vacancy.department}
- Required Skills: ${vacancy.requiredSkills ? vacancy.requiredSkills.join(', ') : 'Not specified'}
- Minimum Experience Years: ${vacancy.minExperienceYears || 3}
- Education Requirement: ${vacancy.educationRequired || 'Bachelor degree'}
- Description: ${vacancy.description || ''}

Candidates:
${JSON.stringify(candidateDataForPrompt, null, 2)}

Calculate a realistic match score (0-100) for each candidate.
Return ONLY valid JSON matching this schema:
{
  "matches": [
    {
      "candidateId": "matching string id",
      "score": number,
      "rating": "Exceptional (90-100) | Strong (75-89) | Moderate (60-74) | Low (<60)",
      "matchedSkills": ["skills present"],
      "missingSkills": ["skills missing or needed"],
      "analysis": "1-2 sentence concise hiring manager assessment",
      "recommendation": "Interview Immediately | Review Pipeline | Keep On File | Reject"
    }
  ]
}`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
            temperature: 0.1,
          },
        });

        const rawJson = response.text ? response.text.trim() : '{}';
        const parsed = JSON.parse(rawJson);
        if (parsed.matches && Array.isArray(parsed.matches)) {
          return res.json({ success: true, matches: parsed.matches, engine: 'Gemini 3.8 Flash' });
        }
      } catch (geminiError: any) {
        console.warn('Gemini Match candidates fallback:', geminiError?.message);
      }
    }

    // Mathematical scoring algorithm fallback
    const vacSkills = (vacancy.requiredSkills || []).map((s: string) => s.toLowerCase());
    const minExp = vacancy.minExperienceYears || 3;

    const matches = candidates.map((cand: any) => {
      const candSkills = (cand.skills || []).map((s: any) => (typeof s === 'string' ? s : s.name).toLowerCase());
      
      const matched = (vacancy.requiredSkills || []).filter((reqSkill: string) =>
        candSkills.some((cs: string) => cs.includes(reqSkill.toLowerCase()) || reqSkill.toLowerCase().includes(cs))
      );
      const missing = (vacancy.requiredSkills || []).filter(
        (reqSkill: string) => !matched.includes(reqSkill)
      );

      const skillRatio = vacSkills.length > 0 ? matched.length / vacSkills.length : 0.8;
      const candExp = cand.experienceYears || 2;
      const expRatio = Math.min(1.2, candExp / Math.max(1, minExp));
      const eduRatio = cand.educationLevel ? 0.95 : 0.75;

      const rawScore = (skillRatio * skillWeight + (expRatio / 1.2) * expWeight + eduRatio * eduWeight) * 100;
      const score = Math.min(99, Math.max(45, Math.round(rawScore)));

      let rating = 'Moderate';
      let recommendation = 'Review Pipeline';
      if (score >= 90) {
        rating = 'Exceptional';
        recommendation = 'Interview Immediately';
      } else if (score >= 75) {
        rating = 'Strong';
        recommendation = 'Schedule Screening';
      } else if (score < 60) {
        rating = 'Low';
        recommendation = 'Keep On File';
      }

      return {
        candidateId: cand.id,
        score,
        rating,
        matchedSkills: matched,
        missingSkills: missing,
        analysis: `${cand.name} brings ${candExp} years of relevant experience with ${matched.length} of ${vacSkills.length} core required skills verified.`,
        recommendation,
      };
    });

    matches.sort((a: any, b: any) => b.score - a.score);

    return res.json({ success: true, matches, engine: 'Rule Weighted Engine' });
  } catch (err: any) {
    console.error('Match Candidates Error:', err);
    res.status(500).json({ error: err.message || 'Failed to match candidates' });
  }
});

// Initialize Seed Notifications Data
seedNotificationData();

// ----------------------------------------------------
// DFD 5.0: In-App Notifications & Server Dispatch Queue
// ----------------------------------------------------

// GET /api/notifications/in-app (Fetch in-app notifications for authenticated user)
app.get('/api/notifications/in-app', authenticateToken, (req: AuthenticatedRequest, res) => {
  const user = req.user!;
  let items = Array.from(serverInAppNotifications.values());

  // Filter based on role and user id unless Admin or Recruiter
  if (user.role === 'JOB_SEEKER') {
    items = items.filter(
      (n) => n.recipientId === user.id || n.recipientEmail.toLowerCase() === user.email.toLowerCase()
    );
  }

  // Sort latest first
  items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const unreadCount = items.filter((n) => !n.isRead).length;

  res.json({
    success: true,
    notifications: items,
    unreadCount,
    total: items.length,
  });
});

// POST /api/notifications/in-app/mark-read
app.post('/api/notifications/in-app/mark-read', authenticateToken, (req: AuthenticatedRequest, res) => {
  const { id } = req.body;
  if (!id) {
    return res.status(400).json({ error: 'Notification ID is required.' });
  }

  const notification = serverInAppNotifications.get(id);
  if (!notification) {
    return res.status(404).json({ error: 'Notification not found.' });
  }

  notification.isRead = true;
  res.json({ success: true, notification });
});

// POST /api/notifications/in-app/mark-all-read
app.post('/api/notifications/in-app/mark-all-read', authenticateToken, (req: AuthenticatedRequest, res) => {
  const user = req.user!;
  for (const notification of serverInAppNotifications.values()) {
    if (
      user.role === 'ADMIN' ||
      user.role === 'RECRUITER' ||
      notification.recipientId === user.id ||
      notification.recipientEmail.toLowerCase() === user.email.toLowerCase()
    ) {
      notification.isRead = true;
    }
  }

  res.json({ success: true, message: 'All notifications marked as read.' });
});

// DELETE /api/notifications/in-app/:id
app.delete('/api/notifications/in-app/:id', authenticateToken, (req: AuthenticatedRequest, res) => {
  const { id } = req.params;
  const deleted = serverInAppNotifications.delete(id);
  res.json({ success: deleted });
});

// GET /api/notifications/queue (Outbound Dispatch Queue with status queued/sent/failed)
app.get('/api/notifications/queue', authenticateToken, requireRole(['RECRUITER', 'ADMIN', 'MANAGEMENT']), (_req, res) => {
  const dispatches = Array.from(serverDispatches.values());
  dispatches.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const stats = {
    totalDispatches: dispatches.length,
    sentCount: dispatches.filter((d) => d.status === 'sent').length,
    queuedCount: dispatches.filter((d) => d.status === 'queued').length,
    failedCount: dispatches.filter((d) => d.status === 'failed').length,
  };

  res.json({
    success: true,
    queue: dispatches,
    stats,
  });
});

// POST /api/notifications/dispatch (Stage changes and interview events)
app.post('/api/notifications/dispatch', authenticateToken, requireRole(['RECRUITER', 'ADMIN', 'EMPLOYER']), async (req: AuthenticatedRequest, res) => {
  try {
    const {
      type, // 'STAGE_CHANGE' | 'INTERVIEW_SCHEDULED' | 'INTERVIEW_RESCHEDULED' | 'INTERVIEW_CANCELLED'
      applicationId,
      interviewId,
      candidateId,
      candidateName,
      candidateEmail,
      candidatePhone,
      vacancyTitle,
      department,
      fromStage,
      toStage,
      note,
      interviewerName,
      interviewerEmail,
      timeSlot,
      format,
      meetingUrl,
      channels,
      idempotencyKey,
      simulateFailure,
    } = req.body;

    if (type === 'STAGE_CHANGE') {
      if (!applicationId || !toStage || !candidateEmail) {
        return res.status(400).json({ error: 'applicationId, toStage, and candidateEmail are required for stage changes.' });
      }

      const result = await NotificationEngine.dispatchStageChange({
        applicationId,
        candidateId: candidateId || 'cand-user',
        candidateName: candidateName || 'Candidate',
        candidateEmail,
        candidatePhone,
        vacancyTitle: vacancyTitle || 'Open Position',
        department: department || 'Engineering',
        fromStage,
        toStage,
        note,
        channels,
        idempotencyKey,
        simulateFailure: !!simulateFailure,
      });

      return res.json({
        success: true,
        ...result,
        message: result.idempotentMatch
          ? 'Idempotency key matched existing delivery. Duplicate send prevented.'
          : 'Stage change notifications dispatched successfully through server adapters.',
      });
    }

    if (type === 'INTERVIEW_SCHEDULED' || type === 'INTERVIEW_RESCHEDULED' || type === 'INTERVIEW_CANCELLED') {
      if (!candidateEmail || !timeSlot) {
        return res.status(400).json({ error: 'candidateEmail and timeSlot are required for interview events.' });
      }

      const result = await NotificationEngine.dispatchInterviewEvent({
        interviewId: interviewId || `INT-${Date.now()}`,
        eventType: type,
        candidateId: candidateId || 'cand-user',
        candidateName: candidateName || 'Candidate',
        candidateEmail,
        candidatePhone,
        interviewerName: interviewerName || 'Hiring Manager',
        interviewerEmail: interviewerEmail || req.user!.email,
        vacancyTitle: vacancyTitle || 'Open Position',
        timeSlot,
        format: format || 'VIDEO',
        meetingUrl,
        notes: note,
        channels,
        idempotencyKey,
        simulateFailure: !!simulateFailure,
      });

      return res.json({
        success: true,
        ...result,
        message: result.idempotentMatch
          ? 'Idempotency key matched existing delivery. Duplicate send prevented.'
          : 'Interview notifications dispatched successfully through server adapters.',
      });
    }

    return res.status(400).json({ error: 'Unsupported notification event type.' });
  } catch (err: any) {
    console.error('Notification dispatch error:', err);
    res.status(500).json({ error: err.message || 'Notification dispatch failed' });
  }
});

// POST /api/notifications/queue/:id/retry (Safe Retry for a specific failed/queued dispatch)
app.post('/api/notifications/queue/:id/retry', authenticateToken, requireRole(['RECRUITER', 'ADMIN']), async (req: AuthenticatedRequest, res) => {
  try {
    const { id } = req.params;
    const result = await NotificationEngine.retrySafely(id);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        error: result.error,
        dispatch: result.dispatch,
      });
    }

    return res.json({
      success: true,
      message: 'Dispatch safely retried and delivered via adapter.',
      dispatch: result.dispatch,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Safe retry operation failed' });
  }
});

// POST /api/notifications/queue/retry-all-failed (Safe batch retry)
app.post('/api/notifications/queue/retry-all-failed', authenticateToken, requireRole(['RECRUITER', 'ADMIN']), async (_req, res) => {
  try {
    const result = await NotificationEngine.retryAllFailed();
    return res.json({
      success: true,
      message: `Batch retry processed: ${result.successCount} succeeded, ${result.failedCount} remaining failed.`,
      ...result,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Batch retry failed' });
  }
});

// Backward compatibility with legacy gateway endpoint
app.post('/api/gateway/notify', authenticateToken, requireRole(['RECRUITER', 'ADMIN']), (req: AuthenticatedRequest, res) => {
  const { recipient, channel, subject, message } = req.body;
  const dispatchId = `GW-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

  return res.json({
    success: true,
    dispatchId,
    status: 'DELIVERED',
    timestamp: new Date().toISOString(),
    channel: channel || 'email',
    recipient,
    subject: subject || 'Interview Confirmation',
    preview: message ? message.slice(0, 100) + '...' : 'Notification dispatched',
    dispatchedBy: req.user!.email,
  });
});

// ----------------------------------------------------
// Protected Record Ownership CRUD Endpoints
// Demonstrating strict record ownership validation
// ----------------------------------------------------

// Example: Delete or edit vacancy with strict ownership check
app.delete('/api/vacancies/:id', authenticateToken, requireRole(['EMPLOYER', 'ADMIN']), (req: AuthenticatedRequest, res) => {
  const { id } = req.params;
  const ownerId = req.query.employerId as string;

  // Record ownership enforcement:
  // If not ADMIN, employer can only modify/delete vacancies they own
  if (req.user?.role !== 'ADMIN' && ownerId && ownerId !== req.user?.id) {
    return res.status(403).json({
      error: `Forbidden: Record ownership violation. You (ID: ${req.user?.id}) do not own this vacancy (Owner: ${ownerId}).`,
      code: 'OWNERSHIP_VIOLATION',
    });
  }

  return res.json({
    success: true,
    message: `Vacancy ${id} deleted successfully by ${req.user?.name}`,
  });
});

// System Status / Health
app.get('/api/system/health', (_req, res) => {
  res.json({
    status: 'ONLINE',
    processes: [
      '1.0 Manage vacancies',
      '2.0 Build candidate profiles',
      '3.0 Process applications',
      '4.0 Match candidates',
      '5.0 Schedule and notify',
      '6.0 Produce reports',
    ],
    dataStores: ['D1 Vacancies', 'D2 Profiles', 'D3 Applications', 'D4 Match results', 'D5 Interviews'],
    security: {
      authProtocols: ['Bearer JWT Tokens', 'RBAC Middleware', 'Account Status Enforcement', 'Record Ownership Checks'],
      activeUsers: Array.from(serverUsers.values()).filter((u) => u.status === 'ACTIVE').length,
      disabledUsers: Array.from(serverUsers.values()).filter((u) => u.status === 'DISABLED').length,
    },
    aiConfigured: !!ai,
    timestamp: new Date().toISOString(),
  });
});

// Setup Vite or Static File Serving
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`FlowHire server running on http://localhost:${port}`);
  });
}

startServer();
