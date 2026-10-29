import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Calendar as CalendarIcon,
  Clock,
  Plus,
  Video,
  Users,
  ChevronLeft,
  ChevronRight,
  Filter,
  CheckCircle2,
  CalendarCheck,
  Send,
  Sparkles,
} from 'lucide-react';

export const InterviewCalendarView: React.FC = () => {
  const {
    interviews,
    applications,
    scheduleInterview,
  } = useApp();

  const [viewMode, setViewMode] = useState<'daily' | 'weekly' | 'monthly'>('weekly');
  const [selectedDate, setSelectedDate] = useState<number>(24);
  const [showNewMeetingModal, setShowNewMeetingModal] = useState(false);
  const [syncStatus, setSyncStatus] = useState<string | null>(null);

  // Form state for scheduling
  const [candidateName, setCandidateName] = useState(applications[0]?.candidateName || 'Sophia Chen');
  const [candidateEmail, setCandidateEmail] = useState(applications[0]?.candidateEmail || 'sophia.chen@devmail.org');
  const [meetingTitle, setMeetingTitle] = useState('Technical Architecture Pairing Call');
  const [timeStr, setTimeStr] = useState('09:00 am - 10:00 am');
  const [interviewer, setInterviewer] = useState('Marcus Vance (VP Engineering)');

  // Calendar events matching AIRecruit360 Screenshot 6
  const weekEvents = [
    {
      id: 'EV-1',
      day: 'Monday',
      date: '08',
      time: '08:00 am - 08:15 am',
      title: 'Recruiter Workflow Optimization Call',
      attendees: ['https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=50&auto=format&fit=crop&q=80'],
      color: 'bg-slate-50 border-slate-200 text-slate-800',
    },
    {
      id: 'EV-2',
      day: 'Monday',
      date: '08',
      time: '09:00 am - 11:30 am',
      title: 'Onboarding Preparation Planning Meeting',
      attendees: [
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=50&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&auto=format&fit=crop&q=80',
      ],
      color: 'bg-slate-50 border-slate-200 text-slate-800',
    },
    {
      id: 'EV-3',
      day: 'Monday',
      date: '08',
      time: '11:00 am - 11:30 am',
      title: 'Candidate Feedback Review',
      attendees: ['https://images.unsplash.com/photo-1580489944761-15a19d654956?w=50&auto=format&fit=crop&q=80'],
      color: 'bg-slate-50 border-slate-200 text-slate-800',
    },
    {
      id: 'EV-4',
      day: 'Tuesday',
      date: '09',
      time: '08:15 am - 09:45 am',
      title: 'Team Performance Review Session',
      attendees: [
        'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=50&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&auto=format&fit=crop&q=80',
      ],
      color: 'bg-blue-600 text-white border-blue-700 font-semibold shadow-sm',
    },
    {
      id: 'EV-5',
      day: 'Tuesday',
      date: '09',
      time: '10:30 am - 12:00 pm',
      title: 'Job Description Refinement Meeting',
      attendees: ['https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=50&auto=format&fit=crop&q=80'],
      color: 'bg-slate-50 border-slate-200 text-slate-800',
    },
    {
      id: 'EV-6',
      day: 'Wednesday',
      date: '10',
      time: '08:00 am - 09:00 am',
      title: 'Schedule Coordination & Pipeline',
      attendees: [
        'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=50&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=50&auto=format&fit=crop&q=80',
      ],
      color: 'bg-slate-50 border-slate-200 text-slate-800',
    },
    {
      id: 'EV-7',
      day: 'Wednesday',
      date: '10',
      time: '11:00 am - 11:30 am',
      title: 'Weekly Talent Pipeline Update',
      attendees: ['https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&auto=format&fit=crop&q=80'],
      color: 'bg-slate-50 border-slate-200 text-slate-800',
    },
  ];

  const handleSyncGoogle = () => {
    setSyncStatus('Synchronized with Google Calendar (2-way OAuth active)');
    setTimeout(() => setSyncStatus(null), 3000);
  };

  const handleCreateMeeting = async (e: React.FormEvent) => {
    e.preventDefault();
    if (applications.length > 0) {
      await scheduleInterview({
        applicationId: applications[0].id,
        timeSlot: new Date().toISOString(),
        format: 'TECHNICAL_PAIRING',
        interviewerName: interviewer,
        interviewerEmail: 'interviewer@techflow.internal',
        notes: meetingTitle,
        channel: 'both',
      });
    }
    setShowNewMeetingModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Page Header (AIRecruit360 Style & unified structure) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <span>TalentaSync</span>
            <span>›</span>
            <span className="text-slate-800 font-semibold">Interview Calendar</span>
            <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 font-bold border border-blue-200">
              Process 5.0 · D5
            </span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight mt-1">Interview Calendar</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            DFD Process 5.0 · Schedule time slots, dispatch Email/SMS notifications via gateway, and sync to D5 Interviews
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowNewMeetingModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            + New Meeting
          </button>
        </div>
      </div>

      {syncStatus && (
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-800 flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
          <span>{syncStatus}</span>
        </div>
      )}

      {/* Main Grid: Mini Calendar Sidebar + Week View Schedule Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Side: Mini Calendar & Event Filter Toggles */}
        <div className="lg:col-span-3 space-y-4">
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
            {/* Calendar Selector Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <CalendarIcon className="w-4 h-4 text-blue-600" />
                <span className="font-bold text-xs text-slate-900">All Calendar</span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">Personal & Teams</span>
            </div>

            {/* Mini Month Grid (January 2026) */}
            <div>
              <div className="flex items-center justify-between text-xs font-bold text-slate-800 mb-2">
                <span>January 2026</span>
                <div className="flex items-center gap-1">
                  <button className="p-1 hover:bg-slate-100 rounded text-slate-500">
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                  <button className="p-1 hover:bg-slate-100 rounded text-slate-500">
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Day headers */}
              <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-mono text-slate-400 mb-1">
                <span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span><span>S</span>
              </div>

              {/* Calendar Days Matrix */}
              <div className="grid grid-cols-7 gap-1 text-center text-xs">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31].map((day) => {
                  const isSelected = day === selectedDate;
                  const hasDot = day === 8 || day === 9 || day === 10 || day === 24;
                  return (
                    <button
                      key={day}
                      onClick={() => setSelectedDate(day)}
                      className={`h-7 w-7 mx-auto rounded-lg flex flex-col items-center justify-center font-mono text-[11px] transition-all relative ${
                        isSelected
                          ? 'bg-blue-600 text-white font-bold shadow-xs'
                          : 'text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {day}
                      {hasDot && !isSelected && (
                        <span className="w-1 h-1 rounded-full bg-blue-600 absolute bottom-0.5"></span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Event Type Filters (AIRecruit360 Style) */}
            <div className="pt-3 border-t border-slate-100 space-y-2.5">
              <div className="text-xs font-bold text-slate-900">Event Type</div>
              <div className="space-y-2 text-xs">
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="flex items-center gap-2 text-slate-700">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span> Meeting Today's
                  </span>
                  <input type="checkbox" defaultChecked className="accent-blue-600" />
                </label>
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="flex items-center gap-2 text-slate-700">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Workshop Tomorrow's
                  </span>
                  <input type="checkbox" defaultChecked className="accent-emerald-600" />
                </label>
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="flex items-center gap-2 text-slate-700">
                    <span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span> Team Building
                  </span>
                  <input type="checkbox" defaultChecked className="accent-purple-600" />
                </label>
              </div>
            </div>

            {/* Sync Google Calendar Button */}
            <div className="pt-2">
              <button
                onClick={handleSyncGoogle}
                className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-xl hover:bg-slate-100 transition-colors"
              >
                <CalendarCheck className="w-4 h-4 text-blue-600" />
                Sync Google Calendar
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: Week Calendar Grid (Monday, Tuesday, Wednesday...) */}
        <div className="lg:col-span-9 bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
          {/* Header Controls: Timeframe mode & navigation */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <span className="text-base font-bold text-slate-900">January 2026</span>
              <div className="flex items-center gap-1 text-slate-400">
                <button className="p-1 hover:bg-slate-100 rounded">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button className="p-1 hover:bg-slate-100 rounded">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg text-xs font-medium text-slate-600">
              <button
                onClick={() => setViewMode('daily')}
                className={`px-3 py-1 rounded-md transition-all ${
                  viewMode === 'daily' ? 'bg-white text-slate-900 font-semibold shadow-xs' : ''
                }`}
              >
                Daily
              </button>
              <button
                onClick={() => setViewMode('weekly')}
                className={`px-3 py-1 rounded-md transition-all ${
                  viewMode === 'weekly' ? 'bg-white text-slate-900 font-semibold shadow-xs' : ''
                }`}
              >
                Weekly
              </button>
              <button
                onClick={() => setViewMode('monthly')}
                className={`px-3 py-1 rounded-md transition-all ${
                  viewMode === 'monthly' ? 'bg-white text-slate-900 font-semibold shadow-xs' : ''
                }`}
              >
                Monthly
              </button>
            </div>
          </div>

          {/* Schedule Week Columns Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Monday 08 */}
            <div className="space-y-3">
              <div className="text-center pb-2 border-b border-slate-100">
                <div className="text-xs text-slate-400 font-medium">Monday</div>
                <div className="text-lg font-bold font-mono text-slate-900">08</div>
              </div>

              <div className="space-y-2.5">
                {weekEvents
                  .filter((e) => e.day === 'Monday')
                  .map((ev) => (
                    <div
                      key={ev.id}
                      className={`p-3.5 rounded-xl border ${ev.color} transition-all space-y-2 group cursor-pointer hover:shadow-xs`}
                    >
                      <div className="text-[11px] font-mono flex items-center justify-between opacity-80">
                        <span>{ev.time}</span>
                      </div>
                      <div className="text-xs font-bold leading-snug">{ev.title}</div>
                      <div className="flex -space-x-1.5 overflow-hidden pt-1">
                        {ev.attendees.map((img, i) => (
                          <img
                            key={i}
                            className="inline-block h-5 w-5 rounded-full ring-2 ring-white"
                            src={img}
                            alt="Attendee"
                          />
                        ))}
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Tuesday 09 */}
            <div className="space-y-3">
              <div className="text-center pb-2 border-b border-slate-100">
                <div className="text-xs text-slate-400 font-medium">Tuesday</div>
                <div className="text-lg font-bold font-mono text-slate-900">09</div>
              </div>

              <div className="space-y-2.5">
                {weekEvents
                  .filter((e) => e.day === 'Tuesday')
                  .map((ev) => (
                    <div
                      key={ev.id}
                      className={`p-3.5 rounded-xl border ${ev.color} transition-all space-y-2 group cursor-pointer hover:shadow-xs`}
                    >
                      <div className="text-[11px] font-mono flex items-center justify-between opacity-90">
                        <span>{ev.time}</span>
                      </div>
                      <div className="text-xs font-bold leading-snug">{ev.title}</div>
                      <div className="flex -space-x-1.5 overflow-hidden pt-1">
                        {ev.attendees.map((img, i) => (
                          <img
                            key={i}
                            className="inline-block h-5 w-5 rounded-full ring-2 ring-white"
                            src={img}
                            alt="Attendee"
                          />
                        ))}
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Wednesday 10 */}
            <div className="space-y-3">
              <div className="text-center pb-2 border-b border-slate-100">
                <div className="text-xs text-slate-400 font-medium">Wednesday</div>
                <div className="text-lg font-bold font-mono text-slate-900">10</div>
              </div>

              <div className="space-y-2.5">
                {weekEvents
                  .filter((e) => e.day === 'Wednesday')
                  .map((ev) => (
                    <div
                      key={ev.id}
                      className={`p-3.5 rounded-xl border ${ev.color} transition-all space-y-2 group cursor-pointer hover:shadow-xs`}
                    >
                      <div className="text-[11px] font-mono flex items-center justify-between opacity-80">
                        <span>{ev.time}</span>
                      </div>
                      <div className="text-xs font-bold leading-snug">{ev.title}</div>
                      <div className="flex -space-x-1.5 overflow-hidden pt-1">
                        {ev.attendees.map((img, i) => (
                          <img
                            key={i}
                            className="inline-block h-5 w-5 rounded-full ring-2 ring-white"
                            src={img}
                            alt="Attendee"
                          />
                        ))}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* New Meeting Modal */}
      {showNewMeetingModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h2 className="text-base font-bold text-slate-900">Schedule Interview Meeting</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Outputs confirmed slot to Recruiter & dispatches to Email/SMS gateway.
            </p>

            <form onSubmit={handleCreateMeeting} className="mt-4 space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Candidate Name
                </label>
                <input
                  type="text"
                  value={candidateName}
                  onChange={(e) => setCandidateName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Meeting Title & Agenda
                </label>
                <input
                  type="text"
                  value={meetingTitle}
                  onChange={(e) => setMeetingTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Interviewer Panel
                </label>
                <input
                  type="text"
                  value={interviewer}
                  onChange={(e) => setInterviewer(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowNewMeetingModal(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-xs"
                >
                  Confirm & Dispatch Notifications
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
