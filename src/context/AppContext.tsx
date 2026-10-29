import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  User,
  UserRole,
  AccountStatus,
  Vacancy,
  CandidateProfile,
  Application,
  ApplicationStatus,
  MatchResult,
  Interview,
  DFDEvent,
  AdminWeightsConfig,
} from '../types/dfd';
import {
  InAppNotification,
  NotificationDispatch,
  NotificationType,
} from '../types/notifications';
import {
  INITIAL_USERS,
  INITIAL_VACANCIES,
  INITIAL_PROFILES,
  INITIAL_APPLICATIONS,
  INITIAL_MATCH_RESULTS,
  INITIAL_INTERVIEWS,
  DEFAULT_ADMIN_CONFIG,
  INITIAL_EVENTS,
} from '../data/mockData';

interface AppContextType {
  // Authentication & Security Session
  currentUser: User | null;
  sessionToken: string | null;
  isAuthenticated: boolean;
  allUsers: User[];
  login: (email: string, password: string) => Promise<{ success: boolean; user?: User; error?: string }>;
  register: (data: {
    name: string;
    email: string;
    password: string;
    role: UserRole;
    title?: string;
    department?: string;
  }) => Promise<{ success: boolean; user?: User; error?: string }>;
  logout: () => Promise<void>;
  inviteUser: (data: {
    name: string;
    email: string;
    role: UserRole;
    department?: string;
    title?: string;
  }) => Promise<{ success: boolean; user?: User; tempPassword?: string; inviteToken?: string; error?: string }>;
  requestPasswordReset: (email: string) => Promise<{ success: boolean; resetToken?: string; error?: string }>;
  resetPassword: (token: string, newPassword: string) => Promise<{ success: boolean; error?: string }>;
  assignUserRole: (userId: string, newRole: UserRole) => Promise<{ success: boolean; error?: string }>;
  toggleAccountStatus: (userId: string, status: AccountStatus) => Promise<{ success: boolean; error?: string }>;
  quickLoginAs: (roleOrId: string) => Promise<void>;
  switchUser: (userId: string) => void;
  canAccessTab: (tabId: string) => boolean;
  hasPermission: (action: string) => boolean;

  // D1: Vacancies
  vacancies: Vacancy[];
  addVacancy: (vacancy: Omit<Vacancy, 'id' | 'createdAt' | 'updatedAt' | 'employerId' | 'employerName'>) => Vacancy;
  updateVacancy: (id: string, updates: Partial<Vacancy>) => void;
  deleteVacancy: (id: string) => void;

  // D2: Profiles
  profiles: CandidateProfile[];
  currentJobSeekerProfile?: CandidateProfile;
  saveCandidateProfile: (profile: Omit<CandidateProfile, 'id' | 'updatedAt'>) => Promise<CandidateProfile>;
  parseCVWithAI: (cvText: string, candidateName?: string) => Promise<{ success: boolean; data: any; engine: string }>;

  // D3: Applications
  applications: Application[];
  submitApplication: (vacancyId: string, coverNote?: string) => Application;
  updateApplicationStatus: (id: string, status: ApplicationStatus, recruiterNotes?: string) => void;

  // D4: Match Results
  matchResults: MatchResult[];
  runCandidateMatch: (vacancyId: string) => Promise<MatchResult[]>;

  // D5: Interviews
  interviews: Interview[];
  scheduleInterview: (data: {
    applicationId: string;
    timeSlot: string;
    format: 'VIDEO' | 'TECHNICAL_PAIRING' | 'ONSITE' | 'BEHAVIORAL';
    interviewerName: string;
    interviewerEmail: string;
    notes?: string;
    channel?: 'email' | 'sms' | 'both';
  }) => Promise<Interview>;

  // Real-Time Event Audit Stream
  events: DFDEvent[];
  activeDFDHighlight: string | null;
  triggerDFDHighlight: (nodeId: string) => void;

  // Admin Configuration
  adminConfig: AdminWeightsConfig;
  updateAdminConfig: (newConfig: Partial<AdminWeightsConfig>) => void;

  // Notifications & Gateway Queue (Process 5.0)
  inAppNotifications: InAppNotification[];
  dispatchQueue: NotificationDispatch[];
  unreadNotificationsCount: number;
  markNotificationAsRead: (id: string) => Promise<void>;
  markAllNotificationsAsRead: () => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
  retryDispatch: (dispatchId: string) => Promise<{ success: boolean; error?: string }>;
  retryAllFailedDispatches: () => Promise<{ retriedCount: number; successCount: number; failedCount: number }>;
  simulateTestDispatch: (eventType: 'STAGE_CHANGE' | 'INTERVIEW_SCHEDULED', simulateFailure?: boolean) => Promise<any>;
  refreshNotifications: () => Promise<void>;

  // Navigation & Reset
  activeTab: string;
  setActiveTab: (tab: string) => void;
  resetAllData: () => void;
}

const AppContext = createContext<AppContextType | null>(null);

const STORAGE_KEY_PREFIX = 'flowhire_dfd_';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Users Database State
  const [allUsers, setAllUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}all_users`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_USERS;
  });

  // Current Session & Auth State
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}auth_user`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.status !== 'DISABLED') {
          return parsed;
        }
      } catch (e) {
        console.error(e);
      }
    }
    // Default to Super Admin so user initially has instant access
    return INITIAL_USERS[0];
  });

  const [sessionToken, setSessionToken] = useState<string | null>(() => {
    return localStorage.getItem(`${STORAGE_KEY_PREFIX}session_token`) || 'tok_admin_master_default';
  });

  const isAuthenticated = !!currentUser && currentUser.status === 'ACTIVE' && !!sessionToken;

  // DFD Repositories
  const [vacancies, setVacancies] = useState<Vacancy[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}d1_vacancies`);
    return saved ? JSON.parse(saved) : INITIAL_VACANCIES;
  });

  const [profiles, setProfiles] = useState<CandidateProfile[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}d2_profiles`);
    return saved ? JSON.parse(saved) : INITIAL_PROFILES;
  });

  const [applications, setApplications] = useState<Application[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}d3_applications`);
    return saved ? JSON.parse(saved) : INITIAL_APPLICATIONS;
  });

  const [matchResults, setMatchResults] = useState<MatchResult[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}d4_match_results`);
    return saved ? JSON.parse(saved) : INITIAL_MATCH_RESULTS;
  });

  const [interviews, setInterviews] = useState<Interview[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}d5_interviews`);
    return saved ? JSON.parse(saved) : INITIAL_INTERVIEWS;
  });

  const [events, setEvents] = useState<DFDEvent[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}events`);
    return saved ? JSON.parse(saved) : INITIAL_EVENTS;
  });

  const [adminConfig, setAdminConfig] = useState<AdminWeightsConfig>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}admin_config`);
    return saved ? JSON.parse(saved) : DEFAULT_ADMIN_CONFIG;
  });

  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [activeDFDHighlight, setActiveDFDHighlight] = useState<string | null>(null);

  // Notifications & Gateway Dispatch State
  const [inAppNotifications, setInAppNotifications] = useState<InAppNotification[]>([]);
  const [dispatchQueue, setDispatchQueue] = useState<NotificationDispatch[]>([]);

  const refreshNotifications = useCallback(async () => {
    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (sessionToken) headers['Authorization'] = `Bearer ${sessionToken}`;
      if (currentUser?.id) headers['x-user-id'] = currentUser.id;

      const [notifsRes, queueRes] = await Promise.all([
        fetch('/api/notifications/in-app', { headers }),
        fetch('/api/notifications/queue', { headers }),
      ]);

      if (notifsRes.ok) {
        const notifsData = await notifsRes.json();
        if (notifsData.notifications) {
          setInAppNotifications(notifsData.notifications);
        }
      }

      if (queueRes.ok) {
        const queueData = await queueRes.json();
        if (queueData.queue) {
          setDispatchQueue(queueData.queue);
        }
      }
    } catch (e) {
      console.warn('Error fetching notification records:', e);
    }
  }, [sessionToken, currentUser]);

  useEffect(() => {
    refreshNotifications();
  }, [refreshNotifications]);

  const unreadNotificationsCount = inAppNotifications.filter((n) => !n.isRead).length;

  // Persistence Effects
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}all_users`, JSON.stringify(allUsers));
  }, [allUsers]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(`${STORAGE_KEY_PREFIX}auth_user`, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(`${STORAGE_KEY_PREFIX}auth_user`);
    }
  }, [currentUser]);

  useEffect(() => {
    if (sessionToken) {
      localStorage.setItem(`${STORAGE_KEY_PREFIX}session_token`, sessionToken);
    } else {
      localStorage.removeItem(`${STORAGE_KEY_PREFIX}session_token`);
    }
  }, [sessionToken]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}d1_vacancies`, JSON.stringify(vacancies));
  }, [vacancies]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}d2_profiles`, JSON.stringify(profiles));
  }, [profiles]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}d3_applications`, JSON.stringify(applications));
  }, [applications]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}d4_match_results`, JSON.stringify(matchResults));
  }, [matchResults]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}d5_interviews`, JSON.stringify(interviews));
  }, [interviews]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}events`, JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}admin_config`, JSON.stringify(adminConfig));
  }, [adminConfig]);

  // Flash node in DFD diagram when an event happens
  const triggerDFDHighlight = (nodeId: string) => {
    setActiveDFDHighlight(nodeId);
    setTimeout(() => {
      setActiveDFDHighlight((curr) => (curr === nodeId ? null : curr));
    }, 2400);
  };

  const addEvent = (event: Omit<DFDEvent, 'id' | 'timestamp'>) => {
    const newEvent: DFDEvent = {
      ...event,
      id: `EVT-${Date.now()}`,
      timestamp: new Date().toISOString(),
    };
    setEvents((prev) => [newEvent, ...prev.slice(0, 49)]);
  };

  // ----------------------------------------------------
  // Authentication & Session Management
  // ----------------------------------------------------

  const login = async (email: string, password: string): Promise<{ success: boolean; user?: User; error?: string }> => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        return { success: false, error: data.error || 'Authentication failed' };
      }

      const authenticatedUser: User = data.user;
      setCurrentUser(authenticatedUser);
      setSessionToken(data.token);

      // Sync local allUsers list lastLogin
      setAllUsers((prev) =>
        prev.map((u) => (u.id === authenticatedUser.id ? { ...u, lastLogin: new Date().toISOString() } : u))
      );

      addEvent({
        sourceEntity: 'System',
        process: '1.0 Manage vacancies',
        description: `User '${authenticatedUser.name}' authenticated successfully`,
        payloadSummary: `Session granted for role: ${authenticatedUser.role}`,
        status: 'SUCCESS',
      });

      return { success: true, user: authenticatedUser };
    } catch (err: any) {
      // Local fallback in case server route is unavailable
      const user = allUsers.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
      if (!user) {
        return { success: false, error: 'User not found. Check credentials or register.' };
      }
      if (user.status === 'DISABLED') {
        return { success: false, error: 'Account disabled by administrator. Contact IT Security.' };
      }

      const token = `tok_local_${user.id}_${Date.now()}`;
      setCurrentUser(user);
      setSessionToken(token);
      return { success: true, user };
    }
  };

  const register = async (userData: {
    name: string;
    email: string;
    password: string;
    role: UserRole;
    title?: string;
    department?: string;
  }): Promise<{ success: boolean; user?: User; error?: string }> => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        return { success: false, error: data.error || 'Registration failed' };
      }

      const newUser: User = data.user;
      setAllUsers((prev) => [newUser, ...prev]);
      setCurrentUser(newUser);
      setSessionToken(data.token);

      addEvent({
        sourceEntity: 'System',
        process: '1.0 Manage vacancies',
        description: `New user self-registered: '${newUser.name}' as ${newUser.role}`,
        payloadSummary: `Account initialized with status: ACTIVE`,
        status: 'SUCCESS',
      });

      return { success: true, user: newUser };
    } catch (err: any) {
      return { success: false, error: err.message || 'Registration failed' };
    }
  };

  const logout = async () => {
    try {
      if (sessionToken) {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${sessionToken}`,
          },
        });
      }
    } catch (e) {
      console.warn('Logout API error:', e);
    } finally {
      setCurrentUser(null);
      setSessionToken(null);
      localStorage.removeItem(`${STORAGE_KEY_PREFIX}auth_user`);
      localStorage.removeItem(`${STORAGE_KEY_PREFIX}session_token`);
    }
  };

  // Invite user (Admin only)
  const inviteUser = async (data: {
    name: string;
    email: string;
    role: UserRole;
    department?: string;
    title?: string;
  }): Promise<{ success: boolean; user?: User; tempPassword?: string; inviteToken?: string; error?: string }> => {
    if (!currentUser || currentUser.role !== 'ADMIN') {
      return { success: false, error: 'Forbidden: Only Administrators can invite users.' };
    }

    try {
      const res = await fetch('/api/auth/invite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${sessionToken}`,
        },
        body: JSON.stringify(data),
      });

      const resData = await res.json();
      if (!res.ok || !resData.success) {
        return { success: false, error: resData.error || 'Invitation dispatch failed' };
      }

      const invitedUser: User = resData.user;
      setAllUsers((prev) => [invitedUser, ...prev]);

      addEvent({
        sourceEntity: 'Admin',
        process: '1.0 Manage vacancies',
        description: `Admin invited user '${invitedUser.name}' (${invitedUser.email}) as ${invitedUser.role}`,
        payloadSummary: `Invite token generated: ${resData.inviteToken}`,
        status: 'SUCCESS',
      });

      return {
        success: true,
        user: invitedUser,
        tempPassword: resData.tempPassword,
        inviteToken: resData.inviteToken,
      };
    } catch (err: any) {
      return { success: false, error: err.message || 'Invitation failed' };
    }
  };

  // Password reset request
  const requestPasswordReset = async (email: string): Promise<{ success: boolean; resetToken?: string; error?: string }> => {
    try {
      const res = await fetch('/api/auth/request-password-reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      return { success: true, resetToken: data.resetToken };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  // Set new password
  const resetPassword = async (token: string, newPassword: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resetToken: token, newPassword }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        return { success: false, error: data.error || 'Password reset failed' };
      }
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  // Role Assignment (Admin only)
  const assignUserRole = async (userId: string, newRole: UserRole): Promise<{ success: boolean; error?: string }> => {
    if (!currentUser || currentUser.role !== 'ADMIN') {
      return { success: false, error: 'Forbidden: Only Administrators can reassign roles.' };
    }

    try {
      const res = await fetch(`/api/auth/users/${userId}/role`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${sessionToken}`,
        },
        body: JSON.stringify({ role: newRole }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        return { success: false, error: data.error || 'Failed to update role' };
      }

      setAllUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u)));

      if (currentUser.id === userId) {
        setCurrentUser((prev) => (prev ? { ...prev, role: newRole } : null));
      }

      addEvent({
        sourceEntity: 'Admin',
        process: '1.0 Manage vacancies',
        description: `Role for user ID ${userId} modified to ${newRole}`,
        payloadSummary: `Access control permissions updated`,
        status: 'SUCCESS',
      });

      return { success: true };
    } catch (err: any) {
      // Local fallback
      setAllUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u)));
      return { success: true };
    }
  };

  // Account Disable / Enable (Admin only)
  const toggleAccountStatus = async (userId: string, status: AccountStatus): Promise<{ success: boolean; error?: string }> => {
    if (!currentUser || currentUser.role !== 'ADMIN') {
      return { success: false, error: 'Forbidden: Only Administrators can modify account status.' };
    }

    if (currentUser.id === userId && status === 'DISABLED') {
      return { success: false, error: 'Cannot disable your own active administrator account.' };
    }

    try {
      const res = await fetch(`/api/auth/users/${userId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${sessionToken}`,
        },
        body: JSON.stringify({ status }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        return { success: false, error: data.error || 'Failed to update account status' };
      }

      setAllUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, status } : u)));

      addEvent({
        sourceEntity: 'Admin',
        process: '1.0 Manage vacancies',
        description: `Account ID ${userId} set to status: ${status}`,
        payloadSummary: status === 'DISABLED' ? 'User access immediately revoked' : 'User access restored',
        status: 'SUCCESS',
      });

      return { success: true };
    } catch (err: any) {
      setAllUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, status } : u)));
      return { success: true };
    }
  };

  // Quick Switch / Login As (for testing all personas)
  const quickLoginAs = async (roleOrId: string) => {
    let target = allUsers.find((u) => u.id === roleOrId);
    if (!target) {
      if (roleOrId === 'MASTER_ALL' || roleOrId === 'ADMIN') {
        target = allUsers.find((u) => u.role === 'ADMIN') || INITIAL_USERS[0];
      } else {
        target = allUsers.find((u) => u.role === roleOrId);
      }
    }

    if (target) {
      if (target.status === 'DISABLED') {
        alert('Cannot login: Account is disabled by an administrator.');
        return;
      }
      const token = `tok_${target.id}_${Date.now()}`;
      setCurrentUser(target);
      setSessionToken(token);
      setActiveTab('dashboard');
    }
  };

  // ----------------------------------------------------
  // Role-Based Navigation & Permissions
  // ----------------------------------------------------

  const canAccessTab = (tabId: string): boolean => {
    if (!currentUser) return false;
    const role = currentUser.role;

    // Super Admin / ADMIN has access to ALL modules!
    if (role === 'ADMIN') return true;

    switch (tabId) {
      case 'dashboard':
      case 'dfd-engine':
      case 'datastore':
        return true;
      case 'job-listings':
      case 'vacancies':
        return true; // Everyone can view listings
      case 'candidates':
      case 'profiles':
        return role === 'RECRUITER';
      case 'pipeline':
      case 'applications':
        return role === 'RECRUITER' || role === 'EMPLOYER';
      case 'calendar':
      case 'interviews':
        return true;
      case 'analytics':
      case 'reports':
        return role === 'MANAGEMENT' || role === 'RECRUITER';
      case 'semantic-match':
      case 'matching':
        return role === 'RECRUITER';
      case 'jobseeker-portal':
        return role === 'JOB_SEEKER';
      case 'notifications':
        return true;
      case 'users-admin':
        return false;
      default:
        return false;
    }
  };

  const hasPermission = (action: string): boolean => {
    if (!currentUser) return false;
    const role = currentUser.role;

    if (role === 'ADMIN') return true;

    switch (action) {
      case 'MANAGE_VACANCIES':
        return role === 'EMPLOYER';
      case 'APPLY_JOB':
        return role === 'JOB_SEEKER';
      case 'EDIT_OWN_PROFILE':
        return role === 'JOB_SEEKER';
      case 'PROCESS_APPLICATIONS':
        return role === 'RECRUITER';
      case 'MATCH_CANDIDATES':
        return role === 'RECRUITER';
      case 'SCHEDULE_INTERVIEW':
        return role === 'RECRUITER';
      case 'VIEW_REPORTS':
        return role === 'MANAGEMENT' || role === 'RECRUITER';
      case 'MANAGE_SYSTEM_WEIGHTS':
      case 'MANAGE_USERS':
      case 'INVITE_USERS':
      case 'DISABLE_ACCOUNTS':
        return false;
      default:
        return false;
    }
  };

  const currentJobSeekerProfile = currentUser
    ? profiles.find((p) => p.userId === currentUser.id || p.email === currentUser.email)
    : undefined;

  // ----------------------------------------------------------------
  // Process 1.0: Manage Vacancies (with Ownership check)
  // ----------------------------------------------------------------
  const addVacancy = (vacancyData: Omit<Vacancy, 'id' | 'createdAt' | 'updatedAt' | 'employerId' | 'employerName'>) => {
    const newId = `VAC-${100 + vacancies.length + 1}`;
    const newVacancy: Vacancy = {
      ...vacancyData,
      id: newId,
      employerId: currentUser?.id || 'emp-system',
      employerName: `${currentUser?.name || 'Authorized Employer'} (${currentUser?.title || 'Employer'})`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setVacancies((prev) => [newVacancy, ...prev]);
    triggerDFDHighlight('process-1');
    triggerDFDHighlight('store-d1');

    addEvent({
      sourceEntity: 'Employer',
      process: '1.0 Manage vacancies',
      targetStore: 'D1 Vacancies',
      targetEntity: 'Employer',
      description: `New vacancy posted: '${newVacancy.title}' by ${currentUser?.name}`,
      payloadSummary: `Status: ${newVacancy.status} · Req skills: ${newVacancy.requiredSkills.slice(0, 3).join(', ')}...`,
      status: 'SUCCESS',
    });

    return newVacancy;
  };

  const updateVacancy = (id: string, updates: Partial<Vacancy>) => {
    // Record ownership check:
    const target = vacancies.find((v) => v.id === id);
    if (target && currentUser?.role !== 'ADMIN' && target.employerId !== currentUser?.id) {
      alert(`Permission Denied: You do not own vacancy '${target.title}'. Only the creator or an Administrator can modify it.`);
      return;
    }

    setVacancies((prev) =>
      prev.map((v) => (v.id === id ? { ...v, ...updates, updatedAt: new Date().toISOString() } : v))
    );
    triggerDFDHighlight('process-1');
    triggerDFDHighlight('store-d1');
  };

  const deleteVacancy = (id: string) => {
    const target = vacancies.find((v) => v.id === id);
    if (target && currentUser?.role !== 'ADMIN' && target.employerId !== currentUser?.id) {
      alert(`Permission Denied: You do not own vacancy '${target.title}'.`);
      return;
    }
    setVacancies((prev) => prev.filter((v) => v.id !== id));
  };

  // ----------------------------------------------------------------
  // Process 2.0: Build Candidate Profiles
  // ----------------------------------------------------------------
  const saveCandidateProfile = async (profileData: Omit<CandidateProfile, 'id' | 'updatedAt'>) => {
    const existingIndex = profiles.findIndex((p) => p.userId === profileData.userId || p.email === profileData.email);
    let updatedProfile: CandidateProfile;

    if (existingIndex >= 0) {
      updatedProfile = {
        ...profiles[existingIndex],
        ...profileData,
        updatedAt: new Date().toISOString(),
      };
      setProfiles((prev) => prev.map((p, i) => (i === existingIndex ? updatedProfile : p)));
    } else {
      updatedProfile = {
        ...profileData,
        id: `CAND-${200 + profiles.length + 1}`,
        updatedAt: new Date().toISOString(),
      };
      setProfiles((prev) => [updatedProfile, ...prev]);
    }

    triggerDFDHighlight('process-2');
    triggerDFDHighlight('store-d2');

    addEvent({
      sourceEntity: 'Job seeker',
      process: '2.0 Build candidate profiles',
      targetStore: 'D2 Profiles',
      targetEntity: 'Job seeker',
      description: `Candidate profile updated: ${updatedProfile.name} (${updatedProfile.headline})`,
      payloadSummary: `Skills: ${updatedProfile.skills.length} extracted · Exp: ${updatedProfile.experienceYears}y`,
      status: 'SUCCESS',
    });

    return updatedProfile;
  };

  const parseCVWithAI = async (cvText: string, candidateName?: string) => {
    triggerDFDHighlight('process-2');
    triggerDFDHighlight('entity-ai');

    try {
      const res = await fetch('/api/nlp/parse-cv', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${sessionToken}`,
          'x-user-id': currentUser?.id || '',
        },
        body: JSON.stringify({ cvText, candidateName }),
      });

      if (!res.ok) {
        throw new Error(`NLP API Error: ${res.statusText}`);
      }

      const json = await res.json();
      return json;
    } catch (e) {
      console.warn('NLP extraction fallback to client heuristic:', e);
      return {
        success: true,
        data: {
          name: candidateName || 'Parsed Candidate',
          headline: 'Senior Distributed Systems Architect',
          summary: 'Experienced infrastructure architect with deep expertise across distributed messaging and cloud platforms.',
          experienceYears: 6,
          educationLevel: 'Master of Science in Distributed Computing',
          skills: [
            { name: 'Distributed Systems', category: 'Domain', proficiency: 'Expert' },
            { name: 'Go', category: 'Technical', proficiency: 'Expert' },
            { name: 'Kubernetes', category: 'Tool', proficiency: 'Advanced' },
            { name: 'Kafka', category: 'Tool', proficiency: 'Advanced' },
          ],
        },
        engine: 'Client Fallback Heuristic',
      };
    }
  };

  // ----------------------------------------------------------------
  // Process 3.0: Process Applications
  // ----------------------------------------------------------------
  const submitApplication = (vacancyId: string, coverNote?: string) => {
    const vacancy = vacancies.find((v) => v.id === vacancyId);
    if (!vacancy) throw new Error('Vacancy not found');

    const newApp: Application = {
      id: `APP-${500 + applications.length + 1}`,
      vacancyId,
      candidateId: currentUser?.id || 'cand-anon',
      candidateName: currentUser?.name || 'Anonymous Candidate',
      candidateEmail: currentUser?.email || 'cand@mail.io',
      candidateHeadline: currentUser?.title || 'Applicant',
      vacancyTitle: vacancy.title,
      department: vacancy.department,
      status: 'SUBMITTED',
      coverNote,
      appliedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setApplications((prev) => [newApp, ...prev]);
    triggerDFDHighlight('process-3');
    triggerDFDHighlight('store-d3');

    addEvent({
      sourceEntity: 'Job seeker',
      process: '3.0 Process applications',
      targetStore: 'D3 Applications',
      targetEntity: 'Recruiter',
      description: `Application submitted for '${vacancy.title}' by ${newApp.candidateName}`,
      payloadSummary: `Initial status: SUBMITTED`,
      status: 'SUCCESS',
    });

    return newApp;
  };

  const updateApplicationStatus = async (id: string, status: ApplicationStatus, recruiterNotes?: string) => {
    if (!hasPermission('PROCESS_APPLICATIONS')) {
      alert('Permission Denied: Only Recruiters and Administrators can modify application stages.');
      return;
    }

    const targetApp = applications.find((a) => a.id === id);
    const fromStage = targetApp?.status;

    setApplications((prev) =>
      prev.map((app) =>
        app.id === id
          ? {
              ...app,
              status,
              recruiterNotes: recruiterNotes || app.recruiterNotes,
              decisionBy: currentUser?.name,
              updatedAt: new Date().toISOString(),
            }
          : app
      )
    );

    triggerDFDHighlight('process-3');
    triggerDFDHighlight('store-d3');
    triggerDFDHighlight('process-5');

    // Server-side notification dispatch (creates in-app record + email/sms queue entries)
    if (targetApp) {
      try {
        await fetch('/api/notifications/dispatch', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${sessionToken}`,
            'x-user-id': currentUser?.id || '',
          },
          body: JSON.stringify({
            type: 'STAGE_CHANGE',
            applicationId: targetApp.id,
            candidateId: targetApp.candidateId,
            candidateName: targetApp.candidateName,
            candidateEmail: targetApp.candidateEmail,
            vacancyTitle: targetApp.vacancyTitle,
            department: targetApp.department,
            fromStage,
            toStage: status,
            note: recruiterNotes,
            channels: ['in_app', 'email', 'sms'],
          }),
        });
        await refreshNotifications();
      } catch (err) {
        console.warn('Background notification dispatch error:', err);
      }
    }

    addEvent({
      sourceEntity: 'Recruiter',
      process: '5.0 Schedule and notify',
      targetStore: 'D3 Applications',
      targetEntity: 'Email/SMS gateway',
      description: `Stage changed to '${status}' for ${targetApp?.candidateName || id}`,
      payloadSummary: `In-App notification recorded · Email/SMS adapter dispatched`,
      status: 'DISPATCHED',
    });
  };

  // ----------------------------------------------------------------
  // Process 4.0: Match Candidates
  // ----------------------------------------------------------------
  const runCandidateMatch = async (vacancyId: string): Promise<MatchResult[]> => {
    const vacancy = vacancies.find((v) => v.id === vacancyId);
    if (!vacancy) return [];

    triggerDFDHighlight('process-4');
    triggerDFDHighlight('store-d1');
    triggerDFDHighlight('store-d2');

    try {
      const res = await fetch('/api/nlp/match-candidates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${sessionToken}`,
          'x-user-id': currentUser?.id || '',
        },
        body: JSON.stringify({
          vacancy,
          candidates: profiles,
          weights: {
            skillWeight: adminConfig.skillWeight,
            expWeight: adminConfig.expWeight,
            eduWeight: adminConfig.eduWeight,
          },
        }),
      });

      const json = await res.json();
      if (json.matches) {
        const newResults: MatchResult[] = json.matches.map((m: any, i: number) => {
          const cand = profiles.find((p) => p.id === m.candidateId);
          return {
            id: `MATCH-${Date.now()}-${i}`,
            vacancyId: vacancy.id,
            candidateId: m.candidateId,
            candidateName: cand ? cand.name : 'Candidate',
            score: m.score,
            rating: m.rating,
            matchedSkills: m.matchedSkills || [],
            missingSkills: m.missingSkills || [],
            analysis: m.analysis,
            recommendation: m.recommendation,
            weightsUsed: {
              skillWeight: adminConfig.skillWeight,
              expWeight: adminConfig.expWeight,
              eduWeight: adminConfig.eduWeight,
            },
            computedAt: new Date().toISOString(),
          };
        });

        setMatchResults((prev) => [...newResults, ...prev]);
        triggerDFDHighlight('store-d4');
        return newResults;
      }
    } catch (e) {
      console.warn('Match Candidates API fallback:', e);
    }

    return [];
  };

  // ----------------------------------------------------------------
  // Process 5.0: Schedule and Notify
  // ----------------------------------------------------------------
  const scheduleInterview = async (data: {
    applicationId: string;
    timeSlot: string;
    format: 'VIDEO' | 'TECHNICAL_PAIRING' | 'ONSITE' | 'BEHAVIORAL';
    interviewerName: string;
    interviewerEmail: string;
    notes?: string;
    channel?: 'email' | 'sms' | 'both';
  }): Promise<Interview> => {
    const app = applications.find((a) => a.id === data.applicationId) || applications[0];

    const newInterview: Interview = {
      id: `INT-${800 + interviews.length + 1}`,
      applicationId: data.applicationId,
      vacancyId: app?.vacancyId || 'VAC-101',
      candidateId: app?.candidateId || 'CAND-201',
      candidateName: app?.candidateName || 'Candidate',
      candidateEmail: app?.candidateEmail || 'candidate@flowhire.io',
      vacancyTitle: app?.vacancyTitle || 'Software Role',
      interviewerName: data.interviewerName,
      interviewerEmail: data.interviewerEmail,
      timeSlot: data.timeSlot,
      format: data.format,
      status: 'SCHEDULED',
      notes: data.notes,
      gatewayChannel: data.channel || 'email',
      scheduledBy: currentUser?.name || 'Recruiter',
      createdAt: new Date().toISOString(),
    };

    triggerDFDHighlight('process-5');
    triggerDFDHighlight('store-d5');

    // Call server-side notifications dispatch (Email + SMS adapters)
    try {
      const res = await fetch('/api/notifications/dispatch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${sessionToken}`,
          'x-user-id': currentUser?.id || '',
        },
        body: JSON.stringify({
          type: 'INTERVIEW_SCHEDULED',
          interviewId: newInterview.id,
          candidateId: newInterview.candidateId,
          candidateName: newInterview.candidateName,
          candidateEmail: newInterview.candidateEmail,
          vacancyTitle: newInterview.vacancyTitle,
          timeSlot: newInterview.timeSlot,
          format: newInterview.format,
          interviewerName: newInterview.interviewerName,
          interviewerEmail: newInterview.interviewerEmail,
          channels: data.channel === 'both' ? ['in_app', 'email', 'sms'] : data.channel === 'sms' ? ['in_app', 'sms'] : ['in_app', 'email'],
          note: data.notes,
        }),
      });
      const gwRes = await res.json();
      if (gwRes.dispatches && gwRes.dispatches.length > 0) {
        newInterview.gatewayDispatchId = gwRes.dispatches[0].id;
        newInterview.gatewayStatus = gwRes.dispatches[0].status === 'sent' ? 'DELIVERED' : 'QUEUED';
      } else {
        newInterview.gatewayStatus = 'DELIVERED';
      }
      await refreshNotifications();
    } catch (e) {
      newInterview.gatewayStatus = 'QUEUED';
    }

    setInterviews((prev) => [newInterview, ...prev]);

    // Update application stage to INTERVIEW_SCHEDULED
    if (app) {
      updateApplicationStatus(app.id, 'INTERVIEW_SCHEDULED', `Interview slot scheduled: ${data.timeSlot}`);
    }

    return newInterview;
  };

  // Notification Operations
  const markNotificationAsRead = async (id: string) => {
    setInAppNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
    try {
      await fetch('/api/notifications/in-app/mark-read', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${sessionToken}`,
          'x-user-id': currentUser?.id || '',
        },
        body: JSON.stringify({ id }),
      });
    } catch (e) {
      console.warn('Failed to mark read on server:', e);
    }
  };

  const markAllNotificationsAsRead = async () => {
    setInAppNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    try {
      await fetch('/api/notifications/in-app/mark-all-read', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${sessionToken}`,
          'x-user-id': currentUser?.id || '',
        },
      });
    } catch (e) {
      console.warn('Failed to mark all read on server:', e);
    }
  };

  const deleteNotification = async (id: string) => {
    setInAppNotifications((prev) => prev.filter((n) => n.id !== id));
    try {
      await fetch(`/api/notifications/in-app/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${sessionToken}`,
          'x-user-id': currentUser?.id || '',
        },
      });
    } catch (e) {
      console.warn('Failed to delete notification on server:', e);
    }
  };

  const retryDispatch = async (dispatchId: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch(`/api/notifications/queue/${dispatchId}/retry`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${sessionToken}`,
          'x-user-id': currentUser?.id || '',
        },
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        return { success: false, error: data.error || 'Retry failed' };
      }

      if (data.dispatch) {
        setDispatchQueue((prev) =>
          prev.map((d) => (d.id === dispatchId ? data.dispatch : d))
        );
      } else {
        await refreshNotifications();
      }

      addEvent({
        sourceEntity: 'System',
        process: '5.0 Schedule and notify',
        targetEntity: 'Email/SMS gateway',
        description: `Safe retry succeeded for dispatch ${dispatchId}`,
        payloadSummary: `Status transitioned to SENT · Idempotency preserved`,
        status: 'SUCCESS',
      });

      return { success: true };
    } catch (e: any) {
      return { success: false, error: e.message || 'Retry request failed' };
    }
  };

  const retryAllFailedDispatches = async (): Promise<{ retriedCount: number; successCount: number; failedCount: number }> => {
    try {
      const res = await fetch('/api/notifications/queue/retry-all-failed', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${sessionToken}`,
          'x-user-id': currentUser?.id || '',
        },
      });

      const data = await res.json();
      if (data.dispatches) {
        setDispatchQueue(data.dispatches);
      } else {
        await refreshNotifications();
      }

      addEvent({
        sourceEntity: 'System',
        process: '5.0 Schedule and notify',
        targetEntity: 'Email/SMS gateway',
        description: `Batch safe retry completed`,
        payloadSummary: `${data.successCount || 0} succeeded, ${data.failedCount || 0} remaining`,
        status: 'SUCCESS',
      });

      return {
        retriedCount: data.retriedCount || 0,
        successCount: data.successCount || 0,
        failedCount: data.failedCount || 0,
      };
    } catch (e) {
      await refreshNotifications();
      return { retriedCount: 0, successCount: 0, failedCount: 0 };
    }
  };

  const simulateTestDispatch = async (
    eventType: 'STAGE_CHANGE' | 'INTERVIEW_SCHEDULED',
    simulateFailure: boolean = false
  ) => {
    try {
      const randomId = Math.random().toString(36).substring(2, 7);
      const payload: any =
        eventType === 'STAGE_CHANGE'
          ? {
              type: 'STAGE_CHANGE',
              applicationId: `APP-SIM-${randomId}`,
              candidateId: 'user-jobseeker-1',
              candidateName: 'Sophia Chen',
              candidateEmail: 'sophia.chen@devmail.org',
              candidatePhone: '+1 (555) 349-8812',
              vacancyTitle: 'Staff Distributed Systems Engineer',
              department: 'Cloud Infrastructure',
              fromStage: 'UNDER_REVIEW',
              toStage: 'SHORTLISTED',
              note: 'Simulated stage transition for notification pipeline validation.',
              simulateFailure,
            }
          : {
              type: 'INTERVIEW_SCHEDULED',
              interviewId: `INT-SIM-${randomId}`,
              candidateId: 'user-jobseeker-1',
              candidateName: 'Sophia Chen',
              candidateEmail: 'sophia.chen@devmail.org',
              candidatePhone: '+1 (555) 349-8812',
              interviewerName: 'Marcus Vance',
              interviewerEmail: 'marcus.vance@techflow.internal',
              vacancyTitle: 'Staff Distributed Systems Engineer',
              timeSlot: 'Thursday 10:00 am - 11:00 am',
              format: 'VIDEO',
              note: 'Simulated interview schedule test.',
              simulateFailure,
            };

      const res = await fetch('/api/notifications/dispatch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${sessionToken}`,
          'x-user-id': currentUser?.id || '',
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      await refreshNotifications();

      addEvent({
        sourceEntity: 'Recruiter',
        process: '5.0 Schedule and notify',
        targetEntity: 'Email/SMS gateway',
        description: `Notification dispatched for ${payload.type}`,
        payloadSummary: simulateFailure ? 'Simulated failure recorded for safe retry testing' : 'Dispatched via Email & SMS adapters',
        status: simulateFailure ? 'RESTRICTED' : 'DISPATCHED',
      });

      return data;
    } catch (e: any) {
      console.error(e);
      throw e;
    }
  };

  const updateAdminConfig = (newConfig: Partial<AdminWeightsConfig>) => {
    if (!hasPermission('MANAGE_SYSTEM_WEIGHTS')) {
      alert('Permission Denied: Only Administrators can adjust algorithm weights.');
      return;
    }
    setAdminConfig((prev) => ({ ...prev, ...newConfig }));
  };

  const resetAllData = () => {
    localStorage.clear();
    setAllUsers(INITIAL_USERS);
    setCurrentUser(INITIAL_USERS[0]);
    setSessionToken('tok_admin_master_default');
    setVacancies(INITIAL_VACANCIES);
    setProfiles(INITIAL_PROFILES);
    setApplications(INITIAL_APPLICATIONS);
    setMatchResults(INITIAL_MATCH_RESULTS);
    setInterviews(INITIAL_INTERVIEWS);
    setEvents(INITIAL_EVENTS);
    setAdminConfig(DEFAULT_ADMIN_CONFIG);
    setActiveTab('dashboard');
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        sessionToken,
        isAuthenticated,
        allUsers,
        login,
        register,
        logout,
        inviteUser,
        requestPasswordReset,
        resetPassword,
        assignUserRole,
        toggleAccountStatus,
        quickLoginAs,
        switchUser: quickLoginAs,
        canAccessTab,
        hasPermission,
        vacancies,
        addVacancy,
        updateVacancy,
        deleteVacancy,
        profiles,
        currentJobSeekerProfile,
        saveCandidateProfile,
        parseCVWithAI,
        applications,
        submitApplication,
        updateApplicationStatus,
        matchResults,
        runCandidateMatch,
        interviews,
        scheduleInterview,
        inAppNotifications,
        dispatchQueue,
        unreadNotificationsCount,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        deleteNotification,
        retryDispatch,
        retryAllFailedDispatches,
        simulateTestDispatch,
        refreshNotifications,
        events,
        activeDFDHighlight,
        triggerDFDHighlight,
        adminConfig,
        updateAdminConfig,
        activeTab,
        setActiveTab,
        resetAllData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
