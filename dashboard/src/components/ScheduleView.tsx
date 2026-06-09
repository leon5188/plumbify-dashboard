'use client';

import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Clock, User, Plus, Search, CheckCircle, AlertCircle } from 'lucide-react';

export default function ScheduleView() {
  const [calendars, setCalendars] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCalendar, setSelectedCalendar] = useState<string>('all');

  useEffect(() => {
    async function fetchSchedule() {
      try {
        setLoading(true);
        const res = await fetch('/api/schedule');
        const json = await res.json();
        if (json.success) {
          setCalendars(json.calendars || []);
          setEvents(json.events || []);
        } else {
          setError(json.error || 'Failed to load GHL schedules');
        }
      } catch (err: any) {
        setError(err.message || 'An error occurred while loading schedules');
      } finally {
        setLoading(false);
      }
    }
    fetchSchedule();
  }, []);

  // Beautiful fallback mock schedules if GoHighLevel calendar has no events yet
  const fallbackSchedules = [
    {
      id: 'evt-001',
      title: 'Residential Pipe Burst Repair',
      calendarName: 'Emergency Plumbing',
      startTime: new Date().setHours(9, 0, 0, 0),
      endTime: new Date().setHours(11, 0, 0, 0),
      contactName: 'Robert Vance',
      contactPhone: '(555) 123-4567',
      assignedTech: 'Liam B.',
      status: 'confirmed'
    },
    {
      id: 'evt-002',
      title: 'Commercial Kitchen Faucet Install',
      calendarName: 'Standard Installs',
      startTime: new Date().setHours(11, 30, 0, 0),
      endTime: new Date().setHours(13, 30, 0, 0),
      contactName: 'Alice Margatroid',
      contactPhone: '(555) 987-6543',
      assignedTech: 'Mike C.',
      status: 'confirmed'
    },
    {
      id: 'evt-003',
      title: 'Water Heater Annual Flush',
      calendarName: 'Maintenance Tune-up',
      startTime: new Date().setHours(14, 0, 0, 0),
      endTime: new Date().setHours(15, 30, 0, 0),
      contactName: 'Gale Dekarios',
      contactPhone: '(555) 432-1098',
      assignedTech: 'Dave P.',
      status: 'pending'
    },
    {
      id: 'evt-004',
      title: 'Sewer Line Camera Inspection',
      calendarName: 'Diagnostics & Camera',
      startTime: new Date().setHours(16, 0, 0, 0),
      endTime: new Date().setHours(17, 30, 0, 0),
      contactName: 'Shadowheart H.',
      contactPhone: '(555) 890-5678',
      assignedTech: 'Sarah L.',
      status: 'confirmed'
    }
  ];

  const processedEvents = events.length > 0 
    ? events.map(e => ({
        id: e.id,
        title: e.title || 'GHL Appointment',
        calendarName: calendars.find(c => c.id === e.calendarId)?.name || 'Default Calendar',
        startTime: new Date(e.startTime).getTime(),
        endTime: new Date(e.endTime).getTime(),
        contactName: e.contact?.name || 'GHL Customer',
        contactPhone: e.contact?.phone || 'No phone',
        assignedTech: e.assignedToUser?.name || 'Unassigned',
        status: e.status || 'confirmed'
      }))
    : fallbackSchedules;

  // Filter events based on selected calendar
  const filteredEvents = selectedCalendar === 'all'
    ? processedEvents
    : processedEvents.filter(e => e.calendarName === selectedCalendar || (calendars.find(c => c.id === selectedCalendar)?.name === e.calendarName));

  const formatTime = (timeMs: number) => {
    return new Date(timeMs).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (timeMs: number) => {
    return new Date(timeMs).toLocaleDateString([], { month: 'short', day: 'numeric', weekday: 'short' });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dispatch & Scheduling</h1>
          <p className="text-sm text-muted">Manage technician calendars and booking schedules</p>
        </div>
        <button className="flex items-center gap-2 bg-cyan-glow hover:bg-cyan-glow/85 text-background px-4 py-2.5 rounded-lg text-sm font-semibold transition-all">
          <Plus className="h-4 w-4" /> Book Appointment
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Left Side: Calendar Groups */}
        <div className="bg-card border border-card-border rounded-xl p-5 space-y-6">
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-muted uppercase tracking-wider">GHL Calendars</h3>
            <div className="space-y-1">
              <button 
                onClick={() => setSelectedCalendar('all')}
                className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-semibold flex items-center justify-between transition-all ${
                  selectedCalendar === 'all' 
                    ? 'bg-cyan-glow/15 text-cyan-glow border-l-2 border-cyan-glow' 
                    : 'text-muted hover:bg-card-border/30 hover:text-foreground'
                }`}
              >
                <span>📅 All Calendars</span>
                <span className="bg-[#070b16] px-2 py-0.5 rounded text-[10px] text-muted-foreground border border-card-border">
                  {processedEvents.length}
                </span>
              </button>

              {loading ? (
                <div className="text-xs text-muted py-4 text-center">Loading calendars...</div>
              ) : calendars.length === 0 ? (
                <div className="text-xs text-muted-foreground italic py-3 text-center">No GHL calendars found</div>
              ) : (
                calendars.map((cal) => (
                  <button
                    key={cal.id}
                    onClick={() => setSelectedCalendar(cal.id)}
                    className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-semibold flex items-center justify-between transition-all ${
                      selectedCalendar === cal.id 
                        ? 'bg-cyan-glow/15 text-cyan-glow border-l-2 border-cyan-glow' 
                        : 'text-muted hover:bg-card-border/30 hover:text-foreground'
                    }`}
                  >
                    <span className="truncate mr-2">📌 {cal.name}</span>
                    <span className="bg-[#070b16] px-2 py-0.5 rounded text-[10px] text-muted border border-card-border">
                      {processedEvents.filter(e => e.calendarName === cal.name).length}
                    </span>
                  </button>
                ))
              )}
            </div>
          </div>
          
          <div className="border-t border-card-border/50 pt-4 space-y-2 text-xs">
            <h4 className="font-bold text-muted uppercase tracking-wider">Status Indicators</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-muted">
                <div className="h-2.5 w-2.5 rounded-full bg-emerald-500"></div>
                <span>Confirmed & Assigned</span>
              </div>
              <div className="flex items-center gap-2 text-muted">
                <div className="h-2.5 w-2.5 rounded-full bg-amber-500"></div>
                <span>Pending Approval</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Agenda Events View */}
        <div className="lg:col-span-3 space-y-4">
          <div className="bg-card border border-card-border rounded-xl p-4 flex items-center justify-between gap-4">
            <div className="relative flex-1">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <Search className="h-4 w-4 text-muted" />
              </span>
              <input 
                type="text" 
                placeholder="Filter bookings by tech or customer..." 
                className="w-full h-10 bg-[#070b16] border border-card-border rounded-lg pl-9 pr-4 text-xs placeholder-muted focus:outline-none focus:border-cyan-glow"
              />
            </div>
            
            <div className="flex gap-1.5 bg-[#070b16] border border-card-border rounded-lg p-1">
              <button className="bg-card px-3 py-1.5 rounded text-xs font-semibold text-foreground">Agenda</button>
              <button className="px-3 py-1.5 rounded text-xs font-semibold text-muted hover:text-foreground">Day</button>
              <button className="px-3 py-1.5 rounded text-xs font-semibold text-muted hover:text-foreground">Week</button>
            </div>
          </div>

          <div className="space-y-3">
            {loading ? (
              <div className="bg-card border border-card-border rounded-xl p-12 text-center text-muted">
                <div className="animate-spin h-6 w-6 border-2 border-cyan-glow border-t-transparent rounded-full mx-auto mb-4"></div>
                Loading scheduling data...
              </div>
            ) : filteredEvents.length === 0 ? (
              <div className="bg-card border border-card-border rounded-xl p-12 text-center text-muted">
                <CalendarIcon className="h-10 w-10 text-muted/30 mx-auto mb-4" />
                No appointments found for the selected calendar
              </div>
            ) : (
              filteredEvents.map((evt) => (
                <div 
                  key={evt.id} 
                  className={`bg-card border rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all hover:border-cyan-glow/30 ${
                    evt.status === 'confirmed' ? 'border-card-border' : 'border-amber-500/30 bg-amber-500/5'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className="bg-[#070b16] border border-card-border rounded-lg p-3 flex flex-col items-center justify-center min-w-16 h-16 text-center">
                      <span className="text-[10px] font-bold text-muted uppercase">
                        {new Date(evt.startTime).toLocaleDateString([], { weekday: 'short' })}
                      </span>
                      <span className="text-xl font-extrabold text-foreground">
                        {new Date(evt.startTime).getDate()}
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-bold text-base text-foreground">{evt.title}</h3>
                        <span className="bg-card-border/50 px-2 py-0.5 rounded text-[10px] text-muted font-bold border border-card-border">
                          {evt.calendarName}
                        </span>
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5 text-cyan-glow" />
                          {formatTime(evt.startTime)} - {formatTime(evt.endTime)}
                        </span>
                        <span className="flex items-center gap-1">
                          <User className="h-3.5 w-3.5 text-orange-glow" />
                          Client: <strong className="text-foreground">{evt.contactName}</strong> ({evt.contactPhone})
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-4 border-t md:border-t-0 border-card-border/40 pt-3 md:pt-0">
                    <div className="text-left md:text-right">
                      <span className="text-[10px] text-muted font-bold uppercase tracking-wide block">Assigned Tech</span>
                      <span className="text-sm font-semibold text-cyan-glow">{evt.assignedTech}</span>
                    </div>

                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${
                      evt.status === 'confirmed' 
                        ? 'bg-emerald-500/10 text-emerald-400' 
                        : 'bg-amber-500/10 text-amber-400'
                    }`}>
                      {evt.status === 'confirmed' ? (
                        <>
                          <CheckCircle className="h-3.5 w-3.5" />
                          Confirmed
                        </>
                      ) : (
                        <>
                          <AlertCircle className="h-3.5 w-3.5" />
                          Pending
                        </>
                      )}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
