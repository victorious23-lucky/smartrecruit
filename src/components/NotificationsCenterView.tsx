import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { InAppNotification, NotificationDispatch } from '../types/notifications';
import {
  Bell,
  Mail,
  MessageSquare,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Clock,
  Send,
  Eye,
  Trash2,
  CheckCheck,
  Filter,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  GitBranch,
  Calendar,
  X,
  Phone,
  Radio,
  SlidersHorizontal,
} from 'lucide-react';

export const NotificationsCenterView: React.FC = () => {
  const {
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
    setActiveTab,
  } = useApp();

  const [activeMainTab, setActiveMainTab] = useState<'in_app' | 'dispatch_queue'>('in_app');
  const [filterType, setFilterType] = useState<string>('ALL');
  const [queueStatusFilter, setQueueStatusFilter] = useState<'ALL' | 'sent' | 'queued' | 'failed'>('ALL');
  const [queueChannelFilter, setQueueChannelFilter] = useState<'ALL' | 'email' | 'sms'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Retry action states
  const [retryingId, setRetryingId] = useState<string | null>(null);
  const [isBatchRetrying, setIsBatchRetrying] = useState(false);
  const [retryFeedback, setRetryFeedback] = useState<string | null>(null);

  // Simulation test state
  const [showSimulateModal, setShowSimulateModal] = useState(false);
  const [simulateEventType, setSimulateEventType] = useState<'STAGE_CHANGE' | 'INTERVIEW_SCHEDULED'>('STAGE_CHANGE');
  const [simulateFailure, setSimulateFailure] = useState(true); // default true to easily demo retry!
  const [isSimulating, setIsSimulating] = useState(false);

  // Payload Preview Modal state
  const [previewDispatch, setPreviewDispatch] = useState<NotificationDispatch | null>(null);

  // Filter in-app notifications
  const filteredInApp = inAppNotifications.filter((n) => {
    if (filterType === 'UNREAD' && n.isRead) return false;
    if (filterType === 'STAGE_CHANGE' && n.type !== 'STAGE_CHANGE') return false;
    if (filterType === 'INTERVIEW' && !n.type.includes('INTERVIEW')) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        n.title.toLowerCase().includes(q) ||
        n.message.toLowerCase().includes(q) ||
        n.recipientName.toLowerCase().includes(q) ||
        (n.metadata?.vacancyTitle && n.metadata.vacancyTitle.toLowerCase().includes(q))
      );
    }
    return true;
  });

  // Filter dispatch queue
  const filteredQueue = dispatchQueue.filter((d) => {
    if (queueStatusFilter !== 'ALL' && d.status !== queueStatusFilter) return false;
    if (queueChannelFilter !== 'ALL' && d.channel !== queueChannelFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        d.recipient.toLowerCase().includes(q) ||
        d.recipientName.toLowerCase().includes(q) ||
        d.subject.toLowerCase().includes(q) ||
        d.idempotencyKey.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Queue counts
  const sentCount = dispatchQueue.filter((d) => d.status === 'sent').length;
  const queuedCount = dispatchQueue.filter((d) => d.status === 'queued').length;
  const failedCount = dispatchQueue.filter((d) => d.status === 'failed').length;

  // Handle single safe retry
  const handleSingleRetry = async (dispatchId: string) => {
    setRetryingId(dispatchId);
    setRetryFeedback(null);
    const result = await retryDispatch(dispatchId);
    setRetryingId(null);
    if (result.success) {
      setRetryFeedback(`✓ Dispatch ${dispatchId} safely retried and delivered via adapter!`);
    } else {
      setRetryFeedback(`⚠ Retry attempt failed: ${result.error}`);
    }
    setTimeout(() => setRetryFeedback(null), 5000);
  };

  // Handle batch retry
  const handleBatchRetry = async () => {
    setIsBatchRetrying(true);
    setRetryFeedback(null);
    const result = await retryAllFailedDispatches();
    setIsBatchRetrying(false);
    setRetryFeedback(
      `✓ Safe batch retry executed: ${result.successCount} succeeded, ${result.failedCount} remaining failed.`
    );
    setTimeout(() => setRetryFeedback(null), 6000);
  };

  // Run test dispatch simulation
  const handleRunSimulation = async () => {
    setIsSimulating(true);
    try {
      await simulateTestDispatch(simulateEventType, simulateFailure);
      setShowSimulateModal(false);
      setRetryFeedback(
        simulateFailure
          ? '⚠ Simulated network failure created! Dispatch recorded with status FAILED. You can now test clicking "Retry Safely".'
          : '✓ Test notification dispatched successfully via server Email & SMS adapters!'
      );
      setTimeout(() => setRetryFeedback(null), 7000);
    } catch (e: any) {
      console.error(e);
    } finally {
      setIsSimulating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <span>TalentaSync</span>
            <span>›</span>
            <span className="text-slate-800 font-semibold">Notifications</span>
            <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 font-bold border border-blue-200">
              DFD Process 5.0 · Gateway Adapters
            </span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight mt-1 flex items-center gap-2">
            <Bell className="w-5 h-5 text-emerald-600" />
            Notifications & Server Gateway Hub
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            DFD Process 5.0 · In-app event records for stage changes and interviews, email/SMS server adapters with queued/sent/failed statuses, and safe retries.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setShowSimulateModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Simulate Event Trigger
          </button>

          <button
            onClick={() => refreshNotifications()}
            className="p-1.5 text-slate-600 hover:text-slate-900 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors shadow-xs"
            title="Refresh queue and notifications from server"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Operation Feedback Alert */}
      {retryFeedback && (
        <div
          className={`p-3.5 rounded-xl border text-xs font-medium flex items-center justify-between animate-fadeIn ${
            retryFeedback.includes('✓')
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-amber-50 border-amber-200 text-amber-800'
          }`}
        >
          <div className="flex items-center gap-2">
            {retryFeedback.includes('✓') ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            )}
            <span>{retryFeedback}</span>
          </div>
          <button onClick={() => setRetryFeedback(null)} className="text-slate-400 hover:text-slate-600">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Tab Switcher */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveMainTab('in_app')}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-colors flex items-center gap-2 ${
            activeMainTab === 'in_app'
              ? 'border-emerald-500 text-emerald-700 bg-emerald-50/40'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Bell className="w-4 h-4" />
          <span>In-App Notification Feed</span>
          {unreadNotificationsCount > 0 && (
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-emerald-500 text-white font-black">
              {unreadNotificationsCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveMainTab('dispatch_queue')}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-colors flex items-center gap-2 ${
            activeMainTab === 'dispatch_queue'
              ? 'border-blue-600 text-blue-700 bg-blue-50/40'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Radio className="w-4 h-4" />
          <span>Server Dispatch Queue & Adapters (Email / SMS)</span>
          {failedCount > 0 && (
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-rose-500 text-white font-black">
              {failedCount} failed
            </span>
          )}
        </button>
      </div>

      {/* TAB 1: IN-APP NOTIFICATIONS */}
      {activeMainTab === 'in_app' && (
        <div className="space-y-4">
          {/* In-App KPI summary cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white rounded-xl p-3 border border-slate-200 shadow-xs">
              <span className="text-[11px] font-medium text-slate-400">Total In-App Records</span>
              <div className="text-xl font-bold font-mono text-slate-900 mt-0.5">{inAppNotifications.length}</div>
            </div>
            <div className="bg-white rounded-xl p-3 border border-slate-200 shadow-xs">
              <span className="text-[11px] font-medium text-emerald-600">Unread Alerts</span>
              <div className="text-xl font-bold font-mono text-emerald-600 mt-0.5">{unreadNotificationsCount}</div>
            </div>
            <div className="bg-white rounded-xl p-3 border border-slate-200 shadow-xs">
              <span className="text-[11px] font-medium text-purple-600">Stage Transitions</span>
              <div className="text-xl font-bold font-mono text-purple-700 mt-0.5">
                {inAppNotifications.filter((n) => n.type === 'STAGE_CHANGE').length}
              </div>
            </div>
            <div className="bg-white rounded-xl p-3 border border-slate-200 shadow-xs">
              <span className="text-[11px] font-medium text-blue-600">Interview Events</span>
              <div className="text-xl font-bold font-mono text-blue-700 mt-0.5">
                {inAppNotifications.filter((n) => n.type.includes('INTERVIEW')).length}
              </div>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
            <div className="flex flex-wrap items-center gap-1.5">
              {[
                { id: 'ALL', label: 'All Records' },
                { id: 'UNREAD', label: `Unread (${unreadNotificationsCount})` },
                { id: 'STAGE_CHANGE', label: 'Stage Changes' },
                { id: 'INTERVIEW', label: 'Interviews' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setFilterType(tab.id)}
                  className={`px-3 py-1 text-xs rounded-lg font-medium transition-colors ${
                    filterType === tab.id
                      ? 'bg-slate-900 text-white font-semibold'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Search notifications..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full sm:w-56 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs text-slate-800 focus:outline-none focus:border-emerald-500"
              />
              <button
                onClick={() => markAllNotificationsAsRead()}
                disabled={unreadNotificationsCount === 0}
                className="flex items-center gap-1 px-3 py-1 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 rounded-lg transition-colors whitespace-nowrap"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>Mark All Read</span>
              </button>
            </div>
          </div>

          {/* In-App Notifications List */}
          <div className="space-y-2.5">
            {filteredInApp.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-xs space-y-2">
                <Bell className="w-8 h-8 text-slate-300 mx-auto" />
                <h3 className="text-sm font-bold text-slate-700">No Notifications Matching Filter</h3>
                <p className="text-xs text-slate-400">
                  Transition candidate stages in Pipeline (Kanban) or schedule interviews to generate in-app records.
                </p>
              </div>
            ) : (
              filteredInApp.map((notif) => {
                const isInterview = notif.type.includes('INTERVIEW');
                const isStage = notif.type === 'STAGE_CHANGE';
                const isOffer = notif.type === 'OFFER_EXTENDED';

                return (
                  <div
                    key={notif.id}
                    className={`bg-white rounded-xl p-4 border transition-all shadow-xs hover:shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                      notif.isRead ? 'border-slate-200/80 bg-white' : 'border-emerald-300/80 bg-emerald-50/20'
                    }`}
                  >
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      {/* Icon */}
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                          isStage
                            ? 'bg-purple-100 text-purple-700 border border-purple-200'
                            : isInterview
                            ? 'bg-blue-100 text-blue-700 border border-blue-200'
                            : isOffer
                            ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {isStage && <GitBranch className="w-4 h-4" />}
                        {isInterview && <Calendar className="w-4 h-4" />}
                        {isOffer && <CheckCircle2 className="w-4 h-4" />}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-bold text-xs text-slate-900">{notif.title}</span>
                          {!notif.isRead && (
                            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                          )}
                          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 border border-slate-200">
                            {notif.type}
                          </span>
                        </div>

                        <p className="text-xs text-slate-600 mt-1 leading-relaxed">{notif.message}</p>

                        {/* Metadata Pills */}
                        <div className="flex flex-wrap items-center gap-2 mt-2 text-[10px] text-slate-500">
                          {notif.metadata?.candidateName && (
                            <span className="bg-slate-50 border border-slate-200 px-2 py-0.5 rounded font-medium">
                              Candidate: <strong>{notif.metadata.candidateName}</strong>
                            </span>
                          )}
                          {notif.metadata?.vacancyTitle && (
                            <span className="bg-slate-50 border border-slate-200 px-2 py-0.5 rounded">
                              Role: {notif.metadata.vacancyTitle}
                            </span>
                          )}
                          {notif.metadata?.toStage && (
                            <span className="bg-purple-50 text-purple-700 border border-purple-200 px-2 py-0.5 rounded font-bold font-mono">
                              Stage: {notif.metadata.toStage}
                            </span>
                          )}
                          {notif.metadata?.timeSlot && (
                            <span className="bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded font-mono">
                              Slot: {notif.metadata.timeSlot}
                            </span>
                          )}
                          <span className="text-slate-400 font-mono">
                            {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} · {new Date(notif.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                      {notif.linkTab && (
                        <button
                          onClick={() => {
                            if (!notif.isRead) markNotificationAsRead(notif.id);
                            setActiveTab(notif.linkTab!);
                          }}
                          className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors"
                        >
                          <span>Open</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      )}

                      {!notif.isRead && (
                        <button
                          onClick={() => markNotificationAsRead(notif.id)}
                          className="p-1.5 text-slate-400 hover:text-emerald-600 rounded-lg transition-colors"
                          title="Mark as read"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                        </button>
                      )}

                      <button
                        onClick={() => deleteNotification(notif.id)}
                        className="p-1.5 text-slate-300 hover:text-rose-500 rounded-lg transition-colors"
                        title="Dismiss notification"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* TAB 2: SERVER DISPATCH QUEUE & ADAPTERS */}
      {activeMainTab === 'dispatch_queue' && (
        <div className="space-y-4">
          {/* Architecture Banner */}
          <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-4 text-white shadow-md border border-slate-700">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800 font-bold">
                    DFD Process 5.0 Schedule and Notify
                  </span>
                  <span className="text-[10px] font-mono text-blue-300 bg-blue-950 px-2 py-0.5 rounded border border-blue-800">
                    Idempotency Guard Active
                  </span>
                </div>
                <h3 className="text-sm font-bold text-white">Outbound Server Dispatch Adapters (Email & SMS)</h3>
                <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
                  Stage transitions and interview invites are piped through server-side SendGrid (Email) and Twilio (SMS) adapters. Dispatches track delivery states (<span className="text-emerald-400 font-mono font-bold">sent</span>, <span className="text-blue-400 font-mono font-bold">queued</span>, <span className="text-rose-400 font-mono font-bold">failed</span>) and support safe retries with attempt caps and idempotency keys to guarantee no duplicate transmissions.
                </p>
              </div>

              {failedCount > 0 && (
                <button
                  onClick={handleBatchRetry}
                  disabled={isBatchRetrying}
                  className="px-3.5 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 disabled:opacity-50 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 whitespace-nowrap self-start lg:self-center"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isBatchRetrying ? 'animate-spin' : ''}`} />
                  <span>Retry All Failed ({failedCount})</span>
                </button>
              )}
            </div>
          </div>

          {/* Status KPI Summary Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white rounded-xl p-3 border border-slate-200 shadow-xs">
              <span className="text-[11px] font-medium text-slate-500">Total Dispatched</span>
              <div className="text-xl font-bold font-mono text-slate-900 mt-0.5">{dispatchQueue.length}</div>
            </div>
            <div className="bg-white rounded-xl p-3 border border-emerald-200 bg-emerald-50/20 shadow-xs">
              <span className="text-[11px] font-medium text-emerald-700 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Delivered (Sent)
              </span>
              <div className="text-xl font-bold font-mono text-emerald-600 mt-0.5">{sentCount}</div>
            </div>
            <div className="bg-white rounded-xl p-3 border border-blue-200 bg-blue-50/20 shadow-xs">
              <span className="text-[11px] font-medium text-blue-700 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-blue-600" />
                Queued
              </span>
              <div className="text-xl font-bold font-mono text-blue-600 mt-0.5">{queuedCount}</div>
            </div>
            <div className="bg-white rounded-xl p-3 border border-rose-200 bg-rose-50/20 shadow-xs">
              <span className="text-[11px] font-medium text-rose-700 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                Failed (Needs Retry)
              </span>
              <div className="text-xl font-bold font-mono text-rose-600 mt-0.5">{failedCount}</div>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1">
                <span className="text-[10px] font-mono text-slate-400 uppercase mr-1">Status:</span>
                {(['ALL', 'sent', 'queued', 'failed'] as const).map((st) => (
                  <button
                    key={st}
                    onClick={() => setQueueStatusFilter(st)}
                    className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-colors ${
                      queueStatusFilter === st
                        ? 'bg-slate-900 text-white font-semibold'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {st === 'ALL' ? 'All' : st.toUpperCase()}
                  </button>
                ))}
              </div>

              <div className="h-4 w-px bg-slate-200 mx-1 hidden sm:block"></div>

              <div className="flex items-center gap-1">
                <span className="text-[10px] font-mono text-slate-400 uppercase mr-1">Channel:</span>
                {(['ALL', 'email', 'sms'] as const).map((ch) => (
                  <button
                    key={ch}
                    onClick={() => setQueueChannelFilter(ch)}
                    className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-colors ${
                      queueChannelFilter === ch
                        ? 'bg-slate-900 text-white font-semibold'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {ch === 'ALL' ? 'All' : ch === 'email' ? 'Email (SendGrid)' : 'SMS (Twilio)'}
                  </button>
                ))}
              </div>
            </div>

            <input
              type="text"
              placeholder="Search by recipient, subject, or key..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-64 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Queue Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-mono text-[11px] uppercase">
                  <tr>
                    <th className="px-4 py-3">Channel / Provider</th>
                    <th className="px-4 py-3">Recipient</th>
                    <th className="px-4 py-3">Subject / Body Snippet</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Attempts</th>
                    <th className="px-4 py-3">Idempotency Key</th>
                    <th className="px-4 py-3 text-right">Safe Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredQueue.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-12 text-slate-400">
                        No dispatch records matching current filters.
                      </td>
                    </tr>
                  ) : (
                    filteredQueue.map((item) => {
                      const isEmail = item.channel === 'email';
                      const isFailed = item.status === 'failed';
                      const isSent = item.status === 'sent';
                      const isQueued = item.status === 'queued';
                      const isRetrying = retryingId === item.id;

                      return (
                        <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                          {/* Channel & Adapter */}
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <div
                                className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                                  isEmail
                                    ? 'bg-blue-50 text-blue-600 border border-blue-200'
                                    : 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                                }`}
                              >
                                {isEmail ? <Mail className="w-3.5 h-3.5" /> : <Phone className="w-3.5 h-3.5" />}
                              </div>
                              <div>
                                <div className="font-bold text-slate-800 uppercase text-[11px]">
                                  {item.channel}
                                </div>
                                <div className="text-[10px] text-slate-400 font-mono">
                                  {item.provider}
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Recipient */}
                          <td className="px-4 py-3">
                            <div className="font-semibold text-slate-900 truncate max-w-[150px]">
                              {item.recipientName}
                            </div>
                            <div className="text-[11px] font-mono text-slate-500 truncate max-w-[170px]">
                              {item.recipient}
                            </div>
                          </td>

                          {/* Subject & Error info */}
                          <td className="px-4 py-3 max-w-[280px]">
                            <div className="font-medium text-slate-800 truncate" title={item.subject}>
                              {item.subject}
                            </div>
                            <div className="text-[11px] text-slate-400 truncate mt-0.5" title={item.body}>
                              {item.body}
                            </div>
                            {item.errorDetails && (
                              <div className="mt-1 text-[10px] text-rose-600 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded font-mono truncate" title={item.errorDetails}>
                                {item.errorDetails}
                              </div>
                            )}
                          </td>

                          {/* Status */}
                          <td className="px-4 py-3 whitespace-nowrap">
                            <span
                              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold font-mono ${
                                isSent
                                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                  : isQueued
                                  ? 'bg-blue-100 text-blue-800 border border-blue-300'
                                  : 'bg-rose-100 text-rose-800 border border-rose-300'
                              }`}
                            >
                              {isSent && <CheckCircle2 className="w-3 h-3" />}
                              {isQueued && <Clock className="w-3 h-3" />}
                              {isFailed && <AlertCircle className="w-3 h-3" />}
                              {item.status.toUpperCase()}
                            </span>
                          </td>

                          {/* Attempts */}
                          <td className="px-4 py-3 whitespace-nowrap font-mono text-xs">
                            <span className={isFailed ? 'text-rose-600 font-bold' : 'text-slate-600'}>
                              {item.attempts} / {item.maxRetries}
                            </span>
                          </td>

                          {/* Idempotency Key */}
                          <td className="px-4 py-3 font-mono text-[10px] text-slate-500 max-w-[140px] truncate" title={item.idempotencyKey}>
                            {item.idempotencyKey}
                          </td>

                          {/* Safe Actions */}
                          <td className="px-4 py-3 text-right whitespace-nowrap space-x-1.5">
                            {/* Preview Payload Button */}
                            <button
                              onClick={() => setPreviewDispatch(item)}
                              className="px-2.5 py-1 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors inline-flex items-center gap-1"
                              title="Preview formatted payload rendered by server adapter"
                            >
                              <Eye className="w-3 h-3" />
                              <span>Preview</span>
                            </button>

                            {/* Safe Retry Button (Active when failed or queued) */}
                            {isFailed && (
                              <button
                                onClick={() => handleSingleRetry(item.id)}
                                disabled={isRetrying || item.attempts >= item.maxRetries}
                                className="px-2.5 py-1 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 disabled:opacity-40 rounded-lg transition-colors inline-flex items-center gap-1 shadow-xs"
                                title="Safely retry through server adapter with idempotency guarantee"
                              >
                                <RefreshCw className={`w-3 h-3 ${isRetrying ? 'animate-spin' : ''}`} />
                                <span>{isRetrying ? 'Retrying...' : 'Retry Safely'}</span>
                              </button>
                            )}

                            {isQueued && (
                              <button
                                onClick={() => handleSingleRetry(item.id)}
                                disabled={isRetrying}
                                className="px-2.5 py-1 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors inline-flex items-center gap-1"
                              >
                                <Send className="w-3 h-3" />
                                <span>Dispatch Now</span>
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SIMULATE EVENT TRIGGER MODAL */}
      {showSimulateModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-2xl p-6 space-y-4 animate-scaleUp">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-sm text-slate-900">Simulate Event & Gateway Dispatch</h3>
              </div>
              <button
                onClick={() => setShowSimulateModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              Test the end-to-end notification lifecycle: create in-app records and dispatch Email & SMS via server adapters with status recording and safe retry.
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Select Event Type</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setSimulateEventType('STAGE_CHANGE')}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      simulateEventType === 'STAGE_CHANGE'
                        ? 'border-purple-500 bg-purple-50/50 text-purple-900 font-bold'
                        : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <GitBranch className="w-3.5 h-3.5 text-purple-600" />
                      <span>Stage Transition</span>
                    </div>
                    <div className="text-[10px] text-slate-400 font-normal">Candidate moves to Shortlisted</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSimulateEventType('INTERVIEW_SCHEDULED')}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      simulateEventType === 'INTERVIEW_SCHEDULED'
                        ? 'border-blue-500 bg-blue-50/50 text-blue-900 font-bold'
                        : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <Calendar className="w-3.5 h-3.5 text-blue-600" />
                      <span>Interview Event</span>
                    </div>
                    <div className="text-[10px] text-slate-400 font-normal">Technical pairing invitation</div>
                  </button>
                </div>
              </div>

              {/* Force failure toggle for testing safe retry */}
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl space-y-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={simulateFailure}
                    onChange={(e) => setSimulateFailure(e.target.checked)}
                    className="rounded text-amber-600 focus:ring-amber-500 w-4 h-4 cursor-pointer"
                  />
                  <span className="font-bold text-amber-900">Simulate Network Gateway Failure</span>
                </label>
                <p className="text-[11px] text-amber-700 pl-6 leading-relaxed">
                  When enabled, adapter simulates a temporary carrier/relay timeout (HTTP 504), recording the dispatch status as <span className="font-mono font-bold">FAILED</span>. You can then click "Retry Safely" to verify the safe retry mechanism.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowSimulateModal(false)}
                className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleRunSimulation}
                disabled={isSimulating}
                className="px-4 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 disabled:opacity-50 rounded-lg shadow-xs flex items-center gap-1.5"
              >
                {isSimulating ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                <span>{isSimulating ? 'Dispatching...' : 'Dispatch Trigger'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PAYLOAD PREVIEW MODAL */}
      {previewDispatch && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-2xl p-6 space-y-4 max-h-[90vh] flex flex-col animate-scaleUp">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                {previewDispatch.channel === 'email' ? (
                  <Mail className="w-5 h-5 text-blue-600" />
                ) : (
                  <Phone className="w-5 h-5 text-emerald-600" />
                )}
                <div>
                  <h3 className="font-bold text-sm text-slate-900">
                    Adapter Payload Preview · {previewDispatch.channel.toUpperCase()}
                  </h3>
                  <p className="text-[10px] text-slate-400 font-mono">
                    Provider: {previewDispatch.provider} · Status: {previewDispatch.status.toUpperCase()}
                  </p>
                </div>
              </div>
              <button onClick={() => setPreviewDispatch(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="text-xs space-y-1.5 bg-slate-50 p-3 rounded-xl border border-slate-200 font-mono">
              <div><span className="text-slate-400">To:</span> <strong className="text-slate-800">{previewDispatch.recipient}</strong> ({previewDispatch.recipientName})</div>
              <div><span className="text-slate-400">Subject:</span> <strong className="text-slate-800">{previewDispatch.subject}</strong></div>
              <div><span className="text-slate-400">Idempotency Key:</span> <span className="text-blue-700">{previewDispatch.idempotencyKey}</span></div>
              {previewDispatch.providerMessageId && (
                <div><span className="text-slate-400">Provider Message ID:</span> <span className="text-emerald-700">{previewDispatch.providerMessageId}</span></div>
              )}
            </div>

            {/* Rendered content */}
            <div className="flex-1 overflow-y-auto border border-slate-200 rounded-xl p-4 bg-slate-100/50">
              {previewDispatch.channel === 'email' && previewDispatch.htmlBody ? (
                <div
                  className="bg-white rounded-lg p-2 shadow-xs"
                  dangerouslySetInnerHTML={{ __html: previewDispatch.htmlBody }}
                />
              ) : (
                /* SMS Phone Bubble Preview */
                <div className="max-w-xs mx-auto bg-slate-900 text-white rounded-2xl p-4 shadow-lg border border-slate-700 space-y-3 font-sans">
                  <div className="text-[10px] text-slate-400 text-center font-mono">
                    SMS from TalentaSync Gateway
                  </div>
                  <div className="bg-emerald-600 text-white p-3 rounded-2xl rounded-tl-xs text-xs shadow-sm leading-relaxed">
                    {previewDispatch.body}
                  </div>
                  <div className="text-[9px] text-slate-400 text-right font-mono">
                    Delivered via {previewDispatch.provider}
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
              <span className="text-slate-400 font-mono text-[11px]">
                Attempts: {previewDispatch.attempts} / {previewDispatch.maxRetries}
              </span>
              <button
                onClick={() => setPreviewDispatch(null)}
                className="px-4 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
