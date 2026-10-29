import React from 'react';
import { useApp } from '../context/AppContext';
import {
  LayoutDashboard,
  Briefcase,
  Users,
  GitBranch,
  Calendar,
  BarChart3,
  Sparkles,
  FileText,
  Database,
  Layers,
  Settings,
  ShieldCheck,
  HelpCircle,
  LogOut,
  Building2,
  ChevronDown,
  UserCheck,
  Shield,
  Bell,
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const {
    activeTab,
    setActiveTab,
    currentUser,
    logout,
    canAccessTab,
    quickLoginAs,
    allUsers,
    unreadNotificationsCount,
  } = useApp();

  const allMainMenuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, badge: null },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: Bell,
      badge: unreadNotificationsCount > 0 ? `${unreadNotificationsCount}` : null,
    },
    { id: 'job-listings', label: 'Job Listings', icon: Briefcase, badge: '352' },
    { id: 'candidates', label: 'Candidates', icon: Users, badge: null },
    { id: 'pipeline', label: 'Pipeline (Kanban)', icon: GitBranch, badge: '25' },
    { id: 'calendar', label: 'Interview Calendar', icon: Calendar, badge: '4' },
    { id: 'analytics', label: 'Analytics & Reports', icon: BarChart3, badge: null },
  ];

  const allToolsItems = [
    { id: 'semantic-match', label: 'Semantic AI Matcher', icon: Sparkles, badge: 'HireAI' },
    { id: 'jobseeker-portal', label: 'My Resumes & Jobs', icon: FileText, badge: null },
    { id: 'users-admin', label: 'Users & Access (RBAC)', icon: ShieldCheck, badge: 'Admin' },
    { id: 'dfd-engine', label: 'Level-1 DFD Matrix', icon: Layers, badge: 'Engine' },
    { id: 'datastore', label: 'Data Stores (D1-D5)', icon: Database, badge: null },
  ];

  // Role-based navigation filtering
  const visibleMainMenuItems = allMainMenuItems.filter((item) => canAccessTab(item.id));
  const visibleToolsItems = allToolsItems.filter((item) => canAccessTab(item.id));

  const handleNavClick = (id: string) => {
    setActiveTab(id);
    if (window.innerWidth < 1024) {
      onClose();
    }
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-slate-900 border-r border-slate-800 flex flex-col transition-transform duration-200 lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 px-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-white font-black text-sm shadow-md shadow-emerald-500/20">
              TS
            </div>
            <div>
              <div className="font-bold text-white tracking-tight text-sm">
                Talenta<span className="text-emerald-400">Sync</span>
              </div>
              <div className="text-[10px] text-slate-400 font-medium">Recruitment Platform</div>
            </div>
          </div>
        </div>

        {/* Navigation Content */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {/* Main Menu (Role Filtered) */}
          <div>
            <div className="px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2 font-mono flex items-center justify-between">
              <span>Main Menu</span>
              <span className="text-[10px] text-emerald-400 font-mono">
                {currentUser?.role || 'GUEST'}
              </span>
            </div>
            <div className="space-y-1">
              {visibleMainMenuItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-emerald-500 text-white font-semibold shadow-sm'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span
                        className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                          isActive
                            ? 'bg-emerald-600 text-white'
                            : 'bg-slate-800 text-slate-400 border border-slate-700'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* DFD Intelligence & Candidate Tools (Role Filtered) */}
          <div>
            <div className="px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2 font-mono">
              Intelligence & Security
            </div>
            <div className="space-y-1">
              {visibleToolsItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-emerald-500 text-white font-semibold shadow-sm'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span
                        className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                          isActive
                            ? 'bg-emerald-600 text-white'
                            : item.id === 'users-admin'
                            ? 'bg-purple-950 text-purple-300 border border-purple-800'
                            : 'bg-slate-800 text-emerald-400 border border-slate-700'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Switch Persona (Demo Testing) */}
          <div className="pt-2 border-t border-slate-800">
            <div className="px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2 font-mono flex items-center justify-between">
              <span>Switch Active Persona</span>
              <span className="text-[10px] text-emerald-400 font-mono">Test Auth</span>
            </div>
            <div className="space-y-1">
              {allUsers.slice(0, 5).map((user) => {
                const isSelected = user.id === currentUser?.id;
                return (
                  <button
                    key={user.id}
                    onClick={() => quickLoginAs(user.id)}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition-colors flex items-center justify-between ${
                      isSelected
                        ? 'bg-slate-800 text-white border border-slate-700 font-medium'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                    }`}
                  >
                    <div className="truncate pr-1">
                      <div className="font-medium text-white truncate text-[11px]">{user.name}</div>
                      <div className="text-[9px] text-slate-400 truncate">{user.title}</div>
                    </div>
                    <span
                      className={`text-[9px] font-mono px-1.5 py-0.2 rounded border uppercase shrink-0 ${
                        user.role === 'ADMIN'
                          ? 'bg-purple-950/60 text-purple-300 border-purple-800'
                          : user.role === 'RECRUITER'
                          ? 'bg-blue-950/60 text-blue-300 border-blue-800'
                          : user.role === 'EMPLOYER'
                          ? 'bg-amber-950/60 text-amber-300 border-amber-800'
                          : user.role === 'MANAGEMENT'
                          ? 'bg-indigo-950/60 text-indigo-300 border-indigo-800'
                          : 'bg-emerald-950/60 text-emerald-300 border-emerald-800'
                      }`}
                    >
                      {user.role}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom Current User & Logout Button */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/50 space-y-2">
          {currentUser && (
            <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900 border border-slate-800">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-7 h-7 rounded-full bg-slate-800 text-slate-200 overflow-hidden shrink-0 flex items-center justify-center font-bold text-xs border border-emerald-500/60">
                  {currentUser.avatar ? (
                    <img src={currentUser.avatar} alt={currentUser.name} className="w-full h-full object-cover" />
                  ) : (
                    currentUser.name.charAt(0)
                  )}
                </div>
                <div className="truncate">
                  <div className="text-xs font-bold text-white truncate">{currentUser.name}</div>
                  <div className="text-[10px] text-emerald-400 font-mono truncate">{currentUser.role}</div>
                </div>
              </div>

              <button
                onClick={logout}
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                title="Sign Out / Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
