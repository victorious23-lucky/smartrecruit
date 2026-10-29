import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { User, UserRole, AccountStatus } from '../types/dfd';
import {
  ShieldCheck,
  UserPlus,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Key,
  ShieldAlert,
  Lock,
  Mail,
  User as UserIcon,
  Building,
  RotateCcw,
  Clock,
  Sparkles,
  Copy,
  Check,
  X,
  AlertTriangle,
} from 'lucide-react';

export const UsersAdminView: React.FC = () => {
  const {
    allUsers,
    currentUser,
    inviteUser,
    assignUserRole,
    toggleAccountStatus,
    requestPasswordReset,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');

  // Invite User Modal state
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteName, setInviteName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<UserRole>('RECRUITER');
  const [inviteDept, setInviteDept] = useState('Talent Acquisition');
  const [inviteTitle, setInviteTitle] = useState('Recruitment Partner');
  const [inviteResult, setInviteResult] = useState<{ tempPassword?: string; inviteToken?: string } | null>(null);

  // Password reset action feedback
  const [activeResetNotice, setActiveResetNotice] = useState<{ user: string; token: string } | null>(null);
  const [copiedToken, setCopiedToken] = useState(false);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const notify = (msg: string) => {
    setActionNotice(msg);
    setTimeout(() => setActionNotice(null), 3500);
  };

  const handleInviteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail) return;

    const res = await inviteUser({
      name: inviteName,
      email: inviteEmail,
      role: inviteRole,
      department: inviteDept,
      title: inviteTitle,
    });

    if (res.success) {
      setInviteResult({
        tempPassword: res.tempPassword,
        inviteToken: res.inviteToken,
      });
      notify(`Invitation generated for ${inviteEmail}`);
    } else {
      alert(res.error || 'Failed to invite user');
    }
  };

  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    const res = await assignUserRole(userId, newRole);
    if (res.success) {
      notify(`Role updated to ${newRole}`);
    } else {
      alert(res.error);
    }
  };

  const handleStatusToggle = async (userId: string, currentStatus: AccountStatus) => {
    const targetStatus: AccountStatus = currentStatus === 'ACTIVE' ? 'DISABLED' : 'ACTIVE';
    const res = await toggleAccountStatus(userId, targetStatus);
    if (res.success) {
      notify(`Account is now ${targetStatus}`);
    } else {
      alert(res.error);
    }
  };

  const handleTriggerReset = async (user: User) => {
    const res = await requestPasswordReset(user.email);
    if (res.resetToken) {
      setActiveResetNotice({ user: user.name, token: res.resetToken });
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedToken(true);
    setTimeout(() => setCopiedToken(false), 2000);
  };

  // Filtered users list
  const filteredUsers = allUsers.filter((u) => {
    if (filterRole !== 'ALL' && u.role !== filterRole) return false;
    if (filterStatus !== 'ALL' && u.status !== filterStatus) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = u.name.toLowerCase().includes(q);
      const matchEmail = u.email.toLowerCase().includes(q);
      const matchDept = (u.department || '').toLowerCase().includes(q);
      if (!matchName && !matchEmail && !matchDept) return false;
    }
    return true;
  });

  const totalUsers = allUsers.length;
  const activeCount = allUsers.filter((u) => u.status === 'ACTIVE').length;
  const disabledCount = allUsers.filter((u) => u.status === 'DISABLED').length;
  const adminCount = allUsers.filter((u) => u.role === 'ADMIN').length;

  return (
    <div className="space-y-6">
      {/* Module Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <span>TalentaSync</span>
            <span>›</span>
            <span className="text-slate-800 font-semibold">Users & Access Control</span>
            <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
              RBAC Engine
            </span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight mt-1 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            Users & Access Control (RBAC Administration)
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage authenticated users, assign role authorizations, configure account disable rules, and issue invitation tokens
          </p>
        </div>

        <button
          onClick={() => {
            setInviteResult(null);
            setShowInviteModal(true);
          }}
          className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors shadow-sm whitespace-nowrap self-start sm:self-auto"
        >
          <UserPlus className="w-4 h-4" />
          Invite User
        </button>
      </div>

      {/* Action Notification Toast */}
      {actionNotice && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{actionNotice}</span>
        </div>
      )}

      {/* Active Reset Token Callout */}
      {activeResetNotice && (
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl text-xs text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-fadeIn">
          <div className="flex items-center gap-2.5">
            <Key className="w-4 h-4 text-emerald-400 shrink-0" />
            <div>
              <span className="text-slate-400">Password Reset Token for </span>
              <span className="font-bold text-white">{activeResetNotice.user}</span>:
              <span className="ml-2 font-mono font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                {activeResetNotice.token}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleCopy(activeResetNotice.token)}
              className="px-3 py-1 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs font-semibold text-slate-200 flex items-center gap-1.5 transition-colors border border-slate-700"
            >
              {copiedToken ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedToken ? 'Copied' : 'Copy Token'}
            </button>
            <button
              onClick={() => setActiveResetNotice(null)}
              className="text-slate-400 hover:text-white p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Top 4 KPI Metrics Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Total Registered Users</span>
            <span className="text-xs font-mono text-slate-600 font-semibold bg-slate-100 px-2 py-0.5 rounded-full">
              Database
            </span>
          </div>
          <div className="text-2xl font-black font-mono text-slate-900 mt-2 tabular-nums">
            {totalUsers}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">Across 5 standard personas</div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Active Accounts</span>
            <span className="text-xs font-mono text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full">
              Authorized
            </span>
          </div>
          <div className="text-2xl font-black font-mono text-slate-900 mt-2 tabular-nums">
            {activeCount}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">Permitted to invoke protected APIs</div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Disabled / Blocked</span>
            <span className="text-xs font-mono text-rose-600 font-semibold bg-rose-50 px-2 py-0.5 rounded-full">
              Enforced
            </span>
          </div>
          <div className="text-2xl font-black font-mono text-slate-900 mt-2 tabular-nums">
            {disabledCount}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">Immediate 403 Forbidden rejection</div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Super Administrators</span>
            <span className="text-xs font-mono text-purple-600 font-semibold bg-purple-50 px-2 py-0.5 rounded-full">
              Full Bypass
            </span>
          </div>
          <div className="text-2xl font-black font-mono text-slate-900 mt-2 tabular-nums">
            {adminCount}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">100% module access granted</div>
        </div>
      </div>

      {/* Filters & Search Toolbar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search user name, email, department..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-emerald-500"
            >
              <option value="ALL">All Roles</option>
              <option value="ADMIN">Super Admin</option>
              <option value="RECRUITER">Recruiter</option>
              <option value="EMPLOYER">Employer</option>
              <option value="JOB_SEEKER">Job Seeker</option>
              <option value="MANAGEMENT">Management</option>
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-emerald-500"
            >
              <option value="ALL">All Account Statuses</option>
              <option value="ACTIVE">Active Accounts</option>
              <option value="DISABLED">Disabled Accounts</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Users Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-500 uppercase font-mono text-[10px] border-b border-slate-200">
              <tr>
                <th className="py-3 px-4 font-semibold">User Details</th>
                <th className="py-3 px-4 font-semibold">Department & Title</th>
                <th className="py-3 px-4 font-semibold">Role Assignment</th>
                <th className="py-3 px-4 font-semibold">Account Status</th>
                <th className="py-3 px-4 font-semibold">Last Active</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.map((user) => {
                const isCurrentUser = currentUser?.id === user.id;
                const isDisabled = user.status === 'DISABLED';

                return (
                  <tr
                    key={user.id}
                    className={`hover:bg-slate-50/70 transition-colors ${
                      isDisabled ? 'bg-rose-50/20 opacity-80' : ''
                    }`}
                  >
                    {/* User Identity */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-slate-200 overflow-hidden shrink-0 flex items-center justify-center font-bold text-xs text-slate-700">
                          {user.avatar ? (
                            <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                          ) : (
                            user.name.charAt(0)
                          )}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 flex items-center gap-1.5">
                            <span>{user.name}</span>
                            {isCurrentUser && (
                              <span className="text-[9px] font-mono font-bold bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded">
                                YOU
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-500 font-mono">{user.email}</div>
                        </div>
                      </div>
                    </td>

                    {/* Department & Title */}
                    <td className="py-3.5 px-4 text-slate-600">
                      <div className="font-medium text-slate-800">{user.title || 'Team Member'}</div>
                      <div className="text-[11px] text-slate-400">{user.department || 'General'}</div>
                    </td>

                    {/* Dynamic Role Assignment Dropdown */}
                    <td className="py-3.5 px-4">
                      <select
                        value={user.role}
                        onChange={(e) => handleRoleChange(user.id, e.target.value as UserRole)}
                        className={`text-xs font-mono font-semibold rounded-lg px-2.5 py-1 border transition-colors ${
                          user.role === 'ADMIN'
                            ? 'bg-purple-50 text-purple-700 border-purple-200'
                            : user.role === 'RECRUITER'
                            ? 'bg-blue-50 text-blue-700 border-blue-200'
                            : user.role === 'EMPLOYER'
                            ? 'bg-amber-50 text-amber-700 border-amber-200'
                            : user.role === 'JOB_SEEKER'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-indigo-50 text-indigo-700 border-indigo-200'
                        }`}
                      >
                        <option value="ADMIN">ADMIN (All Modules)</option>
                        <option value="RECRUITER">RECRUITER</option>
                        <option value="EMPLOYER">EMPLOYER</option>
                        <option value="JOB_SEEKER">JOB_SEEKER</option>
                        <option value="MANAGEMENT">MANAGEMENT</option>
                      </select>
                    </td>

                    {/* Account Status */}
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => handleStatusToggle(user.id, user.status)}
                        disabled={isCurrentUser}
                        title={isCurrentUser ? 'Cannot disable self' : 'Toggle account status'}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold transition-all ${
                          isDisabled
                            ? 'bg-rose-100 text-rose-700 hover:bg-rose-200'
                            : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                        } ${isCurrentUser ? 'cursor-not-allowed opacity-80' : 'cursor-pointer'}`}
                      >
                        {isDisabled ? (
                          <>
                            <XCircle className="w-3 h-3 text-rose-600" /> DISABLED
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" /> ACTIVE
                          </>
                        )}
                      </button>
                    </td>

                    {/* Last Login */}
                    <td className="py-3.5 px-4 font-mono text-[11px] text-slate-500">
                      {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}
                    </td>

                    {/* Quick Admin Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleTriggerReset(user)}
                          className="px-2.5 py-1 rounded-lg border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100 text-[11px] font-medium transition-colors flex items-center gap-1"
                          title="Generate reset token"
                        >
                          <Key className="w-3 h-3 text-emerald-600" /> Reset Pass
                        </button>

                        {!isCurrentUser && (
                          <button
                            onClick={() => handleStatusToggle(user.id, user.status)}
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors ${
                              isDisabled
                                ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                                : 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
                            }`}
                          >
                            {isDisabled ? 'Enable' : 'Disable'}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invite User Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-lg w-full p-6 shadow-2xl relative my-8 animate-fadeIn space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-emerald-600" />
                <div>
                  <h2 className="text-base font-bold text-slate-900">Invite New User</h2>
                  <p className="text-xs text-slate-500">
                    Assign role authorization and issue immediate onboarding credentials
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowInviteModal(false)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {inviteResult ? (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Invitation Generated Successfully!
                </div>
                <div className="space-y-1.5 text-xs text-slate-700">
                  <div>
                    <span className="text-slate-500">Invited User:</span>{' '}
                    <span className="font-semibold">{inviteEmail}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Temporary Password:</span>{' '}
                    <span className="font-mono font-bold bg-white px-2 py-0.5 rounded border border-emerald-200">
                      {inviteResult.tempPassword}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500">Invitation Token:</span>{' '}
                    <span className="font-mono text-[11px] text-slate-600">{inviteResult.inviteToken}</span>
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => {
                      setShowInviteModal(false);
                      setInviteResult(null);
                    }}
                    className="px-4 py-1.5 text-xs font-semibold bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
                  >
                    Done
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleInviteSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={inviteName}
                    onChange={(e) => setInviteName(e.target.value)}
                    placeholder="e.g. Liam Foster"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    placeholder="e.g. liam.foster@flowhire.io"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Role Assignment *
                    </label>
                    <select
                      value={inviteRole}
                      onChange={(e) => setInviteRole(e.target.value as UserRole)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white"
                    >
                      <option value="RECRUITER">Recruiter</option>
                      <option value="EMPLOYER">Employer</option>
                      <option value="JOB_SEEKER">Job Seeker</option>
                      <option value="MANAGEMENT">Management</option>
                      <option value="ADMIN">Super Admin</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Department
                    </label>
                    <input
                      type="text"
                      value={inviteDept}
                      onChange={(e) => setInviteDept(e.target.value)}
                      placeholder="e.g. Infrastructure"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Job Title
                  </label>
                  <input
                    type="text"
                    value={inviteTitle}
                    onChange={(e) => setInviteTitle(e.target.value)}
                    placeholder="e.g. Staff Recruiter"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white"
                  />
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowInviteModal(false)}
                    className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors shadow-sm"
                  >
                    Send Invitation
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
