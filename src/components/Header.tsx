import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Search,
  Plus,
  Bell,
  Menu,
  ChevronDown,
  Lock,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  LogOut,
  UserCheck,
  CheckCheck,
  GitBranch,
  Calendar,
  ArrowRight,
  Radio,
} from 'lucide-react';

interface HeaderProps {
  onToggleSidebar?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar }) => {
  const {
    currentUser,
    allUsers,
    quickLoginAs,
    logout,
    setActiveTab,
    resetAllData,
    inAppNotifications,
    unreadNotificationsCount,
    markNotificationAsRead,
    markAllNotificationsAsRead,
  } = useApp();

  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [searchVal, setSearchVal] = useState('');

  return (
    <header className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800 text-white shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 h-16">
          {/* Left: Mobile Sidebar Toggle & Brand */}
          <div className="flex items-center gap-3">
            <button
              onClick={onToggleSidebar}
              className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2">
              <span className="font-bold text-white text-base tracking-tight">
                Talenta<span className="text-emerald-400">Sync</span>
              </span>
              <span className="hidden sm:inline-block text-[10px] font-mono text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/80">
                RBAC Level-1
              </span>
            </div>
          </div>

          {/* Center: Global Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search candidates, jobs, competencies..."
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-800 rounded-full pl-9 pr-4 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors shadow-inner"
              />
            </div>
          </div>

          {/* Right Action Cluster */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setActiveTab('job-listings')}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-full transition-colors shadow-sm whitespace-nowrap"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Post a Job</span>
            </button>

            {/* Interactive Notification Bell & Popover Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowNotifMenu(!showNotifMenu);
                  if (showRoleMenu) setShowRoleMenu(false);
                }}
                className={`p-2 rounded-full transition-colors relative ${
                  showNotifMenu ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
                title="Notifications & Gateway Queue"
              >
                <Bell className="w-4 h-4" />
                {unreadNotificationsCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-emerald-500 text-slate-950 font-black text-[10px] flex items-center justify-center font-mono ring-2 ring-slate-900 shadow-sm animate-pulse">
                    {unreadNotificationsCount}
                  </span>
                )}
              </button>

              {/* Notification Popover Dropdown */}
              {showNotifMenu && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-3 z-50 animate-fadeIn text-left">
                  {/* Dropdown Header */}
                  <div className="flex items-center justify-between pb-2.5 border-b border-slate-800 px-1">
                    <div className="flex items-center gap-2">
                      <Bell className="w-4 h-4 text-emerald-400" />
                      <span className="text-xs font-bold text-white tracking-tight">Notifications</span>
                      {unreadNotificationsCount > 0 && (
                        <span className="text-[10px] font-mono bg-emerald-950 text-emerald-400 px-1.5 py-0.2 rounded border border-emerald-800 font-bold">
                          {unreadNotificationsCount} new
                        </span>
                      )}
                    </div>
                    {unreadNotificationsCount > 0 && (
                      <button
                        onClick={() => markAllNotificationsAsRead()}
                        className="text-[10px] text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1"
                      >
                        <CheckCheck className="w-3 h-3" />
                        <span>Mark all read</span>
                      </button>
                    )}
                  </div>

                  {/* Notification Items List */}
                  <div className="max-h-72 overflow-y-auto divide-y divide-slate-800/60 my-1 py-1 space-y-1">
                    {inAppNotifications.length === 0 ? (
                      <div className="py-8 text-center text-xs text-slate-500">
                        No notifications yet.
                      </div>
                    ) : (
                      inAppNotifications.slice(0, 5).map((n) => {
                        const isStage = n.type === 'STAGE_CHANGE';
                        const isInterview = n.type.includes('INTERVIEW');

                        return (
                          <div
                            key={n.id}
                            onClick={() => {
                              if (!n.isRead) markNotificationAsRead(n.id);
                              if (n.linkTab) setActiveTab(n.linkTab);
                              setShowNotifMenu(false);
                            }}
                            className={`p-2.5 rounded-xl cursor-pointer transition-colors flex items-start gap-2.5 hover:bg-slate-800/80 ${
                              !n.isRead ? 'bg-slate-800/40 border-l-2 border-emerald-400' : ''
                            }`}
                          >
                            <div
                              className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                                isStage
                                  ? 'bg-purple-950 text-purple-300 border border-purple-800'
                                  : isInterview
                                  ? 'bg-blue-950 text-blue-300 border border-blue-800'
                                  : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                              }`}
                            >
                              {isStage ? (
                                <GitBranch className="w-3.5 h-3.5" />
                              ) : isInterview ? (
                                <Calendar className="w-3.5 h-3.5" />
                              ) : (
                                <Bell className="w-3.5 h-3.5" />
                              )}
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-1">
                                <h4 className="text-xs font-bold text-slate-200 truncate">{n.title}</h4>
                                <span className="text-[9px] text-slate-500 shrink-0 font-mono">
                                  {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-400 line-clamp-2 mt-0.5 leading-snug">
                                {n.message}
                              </p>
                              {n.metadata?.toStage && (
                                <span className="inline-block mt-1 text-[9px] font-mono px-1.5 py-0.2 rounded bg-purple-950/80 text-purple-300 border border-purple-800/60 font-semibold">
                                  Stage: {n.metadata.toStage}
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>

                  {/* Dropdown Footer */}
                  <div className="pt-2 border-t border-slate-800">
                    <button
                      onClick={() => {
                        setActiveTab('notifications');
                        setShowNotifMenu(false);
                      }}
                      className="w-full py-1.5 px-3 rounded-xl bg-slate-800/90 hover:bg-slate-750 text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Radio className="w-3.5 h-3.5" />
                      <span>Open Full Notifications & Gateway Hub</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Authenticated Persona Switcher Dropdown */}
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setShowRoleMenu(!showRoleMenu)}
                  className="flex items-center gap-2.5 p-1 rounded-full hover:bg-slate-800 border border-transparent hover:border-slate-700 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-slate-800 border border-emerald-500/80 overflow-hidden flex items-center justify-center font-bold text-xs text-slate-200">
                    {currentUser.avatar ? (
                      <img
                        src={currentUser.avatar}
                        alt={currentUser.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      currentUser.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')
                    )}
                  </div>
                  <div className="hidden xl:block text-left pr-1">
                    <div className="text-xs font-semibold text-white truncate max-w-[120px]">
                      {currentUser.name}
                    </div>
                    <div className="text-[10px] text-emerald-400 font-mono">
                      {currentUser.role}
                    </div>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
                </button>

                {/* Dropdown Menu */}
                {showRoleMenu && (
                  <div className="absolute right-0 mt-2 w-72 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-2.5 z-50 animate-fadeIn">
                    <div className="px-3 py-2 border-b border-slate-800 mb-1.5 flex items-center justify-between">
                      <div>
                        <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1.5 font-bold">
                          <Lock className="w-3 h-3 text-emerald-400" />
                          Authenticated Session
                        </div>
                        <div className="text-[11px] text-emerald-400 font-semibold mt-0.5">
                          {currentUser.email}
                        </div>
                      </div>
                      <span className="text-[9px] font-mono bg-emerald-950 text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-800">
                        {currentUser.role}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <div className="px-3 py-1 text-[10px] font-mono text-slate-500 uppercase tracking-wider">
                        Switch Authenticated Role:
                      </div>
                      {allUsers.slice(0, 5).map((user) => {
                        const isSelected = user.id === currentUser.id;
                        return (
                          <button
                            key={user.id}
                            onClick={() => {
                              quickLoginAs(user.id);
                              setShowRoleMenu(false);
                            }}
                            className={`w-full text-left p-2 rounded-xl text-xs transition-colors flex items-center justify-between ${
                              isSelected
                                ? 'bg-emerald-950/70 border border-emerald-800 text-white font-medium'
                                : 'text-slate-300 hover:bg-slate-800/80'
                            }`}
                          >
                            <div className="truncate pr-2">
                              <div className="font-semibold text-white text-xs">{user.name}</div>
                              <div className="text-[10px] text-slate-400 truncate">{user.title}</div>
                            </div>
                            <span
                              className={`text-[9px] font-mono px-1.5 py-0.5 rounded border uppercase shrink-0 ${
                                user.role === 'ADMIN'
                                  ? 'bg-purple-950/60 text-purple-300 border-purple-800'
                                  : user.role === 'RECRUITER'
                                  ? 'bg-blue-950/60 text-blue-300 border-blue-800'
                                  : user.role === 'EMPLOYER'
                                  ? 'bg-amber-950/60 text-amber-300 border-amber-800'
                                  : 'bg-emerald-950/60 text-emerald-300 border-emerald-800'
                              }`}
                            >
                              {user.role}
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Admin Access Control Quick Link */}
                    {currentUser.role === 'ADMIN' && (
                      <div className="pt-1.5 mt-1.5 border-t border-slate-800">
                        <button
                          onClick={() => {
                            setActiveTab('users-admin');
                            setShowRoleMenu(false);
                          }}
                          className="w-full text-left p-2 rounded-xl text-xs text-purple-300 hover:bg-purple-950/40 border border-purple-900/60 flex items-center gap-2 font-medium"
                        >
                          <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
                          <span>Open Users & Access Management</span>
                        </button>
                      </div>
                    )}

                    {/* Bottom Actions: Reset & Sign Out */}
                    <div className="pt-2 mt-2 border-t border-slate-800 flex items-center justify-between px-2 text-[11px]">
                      <button
                        onClick={() => {
                          resetAllData();
                          setShowRoleMenu(false);
                        }}
                        className="text-slate-400 hover:text-white flex items-center gap-1 font-medium"
                      >
                        <RotateCcw className="w-3 h-3" />
                        Reset Data
                      </button>

                      <button
                        onClick={() => {
                          logout();
                          setShowRoleMenu(false);
                        }}
                        className="text-rose-400 hover:text-rose-300 flex items-center gap-1 font-semibold"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </header>
  );
};
