import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Interview } from '../../types/dfd';
import {
  Calendar,
  Mail,
  Smartphone,
  CheckCircle2,
  Clock,
  User,
  Video,
  Send,
  Loader2,
  FileCheck,
  Building,
} from 'lucide-react';

export const Process5_ScheduleAndNotify: React.FC = () => {
  const {
    applications,
    interviews,
    scheduleInterview,
    currentUser,
    hasPermission,
    setActiveTab,
  } = useApp();

  const [selectedAppId, setSelectedAppId] = useState<string>(
    applications[0]?.id || ''
  );
  const [timeSlot, setTimeSlot] = useState<string>('2026-11-04T16:00');
  const [format, setFormat] = useState<'VIDEO' | 'TECHNICAL_PAIRING' | 'ONSITE' | 'BEHAVIORAL'>('TECHNICAL_PAIRING');
  const [interviewerName, setInterviewerName] = useState<string>('Marcus Vance (VP Platform Eng)');
  const [interviewerEmail, setInterviewerEmail] = useState<string>('marcus.vance@techflow.internal');
  const [channel, setChannel] = useState<'email' | 'sms' | 'both'>('both');
  const [notes, setNotes] = useState<string>('Technical architecture deep-dive: consensus algorithms and low-latency clustering.');

  const [isScheduling, setIsScheduling] = useState(false);
  const [confirmationNotice, setConfirmationNotice] = useState<Interview | null>(null);

  const isRecruiterOrAdmin = hasPermission('SCHEDULE_INTERVIEW');

  const handleSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAppId) return;

    setIsScheduling(true);
    setConfirmationNotice(null);

    try {
      const interview = await scheduleInterview({
        applicationId: selectedAppId,
        timeSlot: new Date(timeSlot).toISOString(),
        format,
        interviewerName,
        interviewerEmail,
        notes,
        channel,
      });
      setConfirmationNotice(interview);
    } catch (err) {
      console.error(err);
    } finally {
      setIsScheduling(false);
    }
  };

  const selectedApp = applications.find((a) => a.id === selectedAppId);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-blue-600 text-white">
                Process 5.0
              </span>
              <span className="text-xs text-slate-400 font-mono">
                DFD Data Flow: Recruiter Time Slot ➔ Process 5.0 ➔ Email/SMS Gateway + D5 Interviews
              </span>
            </div>
            <h1 className="text-xl font-bold text-white mt-1">Schedule and Notify</h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Receives recruiter time slots, commits the confirmed interview record to D5, and dispatches real-time Email/SMS gateway notifications.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('reports')}
              className="px-3 py-1.5 text-xs text-slate-300 hover:text-white bg-slate-800 rounded-lg border border-slate-700 transition-colors"
            >
              View Analytics (6.0) ➔
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Schedule Form */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <h2 className="text-sm font-bold text-white mb-3 pb-2 border-b border-slate-800 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-indigo-400" />
              Schedule Interview Session
            </h2>

            <form onSubmit={handleSchedule} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Target Candidate / Application (from D3)
                </label>
                <select
                  value={selectedAppId}
                  onChange={(e) => setSelectedAppId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 font-medium"
                >
                  {applications.map((app) => (
                    <option key={app.id} value={app.id}>
                      {app.candidateName} — {app.vacancyTitle} ({app.status})
                    </option>
                  ))}
                </select>
              </div>

              {selectedApp && (
                <div className="bg-slate-950/70 border border-slate-800/80 rounded-lg p-3 text-xs text-slate-400">
                  <div className="flex justify-between items-center text-slate-300 font-semibold">
                    <span>{selectedApp.candidateName}</span>
                    <span className="font-mono text-emerald-400">{selectedApp.candidateEmail}</span>
                  </div>
                  <div className="mt-1 text-[11px] text-slate-500">
                    Applying for: {selectedApp.vacancyTitle} ({selectedApp.department})
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Date & Time Slot (Recruiter Input)
                  </label>
                  <input
                    type="datetime-local"
                    value={timeSlot}
                    onChange={(e) => setTimeSlot(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Interview Format
                  </label>
                  <select
                    value={format}
                    onChange={(e) => setFormat(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="TECHNICAL_PAIRING">Technical Pairing (Coding & Systems)</option>
                    <option value="VIDEO">Video Call (Google Meet / Zoom)</option>
                    <option value="ONSITE">Onsite Office Panel</option>
                    <option value="BEHAVIORAL">Behavioral & Culture Fit</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Interviewer Name
                  </label>
                  <input
                    type="text"
                    value={interviewerName}
                    onChange={(e) => setInterviewerName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Gateway Dispatch Channel
                  </label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setChannel('both')}
                      className={`flex-1 py-1.5 px-2 text-xs rounded-lg border transition-colors flex items-center justify-center gap-1 ${
                        channel === 'both'
                          ? 'bg-indigo-600 border-indigo-500 text-white font-medium'
                          : 'bg-slate-950 border-slate-800 text-slate-400'
                      }`}
                    >
                      <Mail className="w-3 h-3" />+<Smartphone className="w-3 h-3" /> Both
                    </button>
                    <button
                      type="button"
                      onClick={() => setChannel('email')}
                      className={`flex-1 py-1.5 px-2 text-xs rounded-lg border transition-colors flex items-center justify-center gap-1 ${
                        channel === 'email'
                          ? 'bg-indigo-600 border-indigo-500 text-white font-medium'
                          : 'bg-slate-950 border-slate-800 text-slate-400'
                      }`}
                    >
                      <Mail className="w-3 h-3" /> Email
                    </button>
                    <button
                      type="button"
                      onClick={() => setChannel('sms')}
                      className={`flex-1 py-1.5 px-2 text-xs rounded-lg border transition-colors flex items-center justify-center gap-1 ${
                        channel === 'sms'
                          ? 'bg-indigo-600 border-indigo-500 text-white font-medium'
                          : 'bg-slate-950 border-slate-800 text-slate-400'
                      }`}
                    >
                      <Smartphone className="w-3 h-3" /> SMS
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Interview Instructions & Agenda
                </label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Notes for candidate and interviewer panel..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isScheduling}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 rounded-lg transition-colors shadow-md"
                >
                  {isScheduling ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Dispatching to Email/SMS Gateway...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Confirm Schedule & Dispatch Notifications
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Column: Confirmed Confirmation & Gateway Dispatch Stream */}
        <div className="lg:col-span-6 space-y-4">
          {/* Confirmed Output Box (DFD Output: Confirmed to Recruiter) */}
          {confirmationNotice ? (
            <div className="bg-emerald-950/40 border border-emerald-800/80 rounded-xl p-5 animate-fadeIn">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                <CheckCircle2 className="w-4 h-4" />
                DFD Output: Confirmed to Recruiter
              </div>
              <p className="text-xs text-emerald-300/90 mt-1">
                Interview record committed to <strong>D5 Interviews</strong> and dispatched to{' '}
                <strong>Email/SMS gateway</strong>.
              </p>

              <div className="mt-4 bg-slate-950/90 border border-emerald-900/60 rounded-lg p-3.5 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Interview ID (D5):</span>
                  <span className="font-mono font-bold text-white">{confirmationNotice.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Candidate:</span>
                  <span className="text-white font-medium">{confirmationNotice.candidateName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Time Slot:</span>
                  <span className="font-mono text-emerald-300">
                    {new Date(confirmationNotice.timeSlot).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Gateway Dispatch Token:</span>
                  <span className="font-mono text-indigo-400">{confirmationNotice.gatewayDispatchId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Status:</span>
                  <span className="text-emerald-400 font-mono font-bold">
                    {confirmationNotice.gatewayStatus}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 text-center text-xs text-slate-400">
              <Clock className="w-8 h-8 text-slate-700 mx-auto mb-2" />
              <div>Recruiter Time Slot Confirmation Area</div>
              <div className="text-slate-500 mt-1">
                Fill the schedule form on the left to trigger Process 5.0
              </div>
            </div>
          )}

          {/* D5 Store Interviews List */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-indigo-400">D5</span>
                <h3 className="text-sm font-bold text-white">
                  Interviews Scheduled ({interviews.length})
                </h3>
              </div>
              <span className="text-[11px] text-slate-500 font-mono">D5 Interviews Store</span>
            </div>

            <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
              {interviews.map((item) => (
                <div
                  key={item.id}
                  className="bg-slate-950 border border-slate-800/80 rounded-lg p-3 hover:border-slate-700 transition-colors text-xs"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-bold text-white">{item.candidateName}</div>
                      <div className="text-[11px] text-slate-400">{item.vacancyTitle}</div>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                      {item.status}
                    </span>
                  </div>

                  <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400 pt-2 border-t border-slate-900">
                    <span className="font-mono text-slate-300">
                      {new Date(item.timeSlot).toLocaleString()}
                    </span>
                    <span className="text-indigo-400">{item.format.replace('_', ' ')}</span>
                  </div>

                  <div className="mt-1 flex items-center justify-between text-[10px] text-slate-500">
                    <span>Interviewer: {item.interviewerName}</span>
                    <span className="font-mono text-slate-400">{item.gatewayDispatchId}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
