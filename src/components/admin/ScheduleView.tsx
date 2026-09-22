import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  User,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Eye
} from 'lucide-react';
import { Appointment, BusinessSettings } from '../../types';
import { formatDateReadable } from '../../services/storage';

interface ScheduleViewProps {
  appointments: Appointment[];
  settings: BusinessSettings;
  onSelectAppointment: (appointment: Appointment) => void;
}

export const ScheduleView: React.FC<ScheduleViewProps> = ({
  appointments,
  settings,
  onSelectAppointment
}) => {
  const [viewMode, setViewMode] = useState<'daily' | 'weekly'>('daily');
  const [currentDate, setCurrentDate] = useState<Date>(new Date());

  // Format current date as YYYY-MM-DD
  const formatYMD = (d: Date) => {
    return d.toISOString().split('T')[0];
  };

  const currentDateStr = formatYMD(currentDate);

  const navigateDate = (deltaDays: number) => {
    const next = new Date(currentDate);
    next.setDate(next.getDate() + deltaDays);
    setCurrentDate(next);
  };

  // Get days in the current week (Sunday to Saturday)
  const getWeekDays = (baseDate: Date) => {
    const days: Date[] = [];
    const temp = new Date(baseDate);
    const dayOfWeek = temp.getDay();
    temp.setDate(temp.getDate() - dayOfWeek); // start on Sunday

    for (let i = 0; i < 7; i++) {
      days.push(new Date(temp));
      temp.setDate(temp.getDate() + 1);
    }
    return days;
  };

  const weekDays = getWeekDays(currentDate);

  // Time grid hours
  const hours = [
    '09:00 AM',
    '10:00 AM',
    '11:00 AM',
    '12:00 PM',
    '01:00 PM',
    '02:00 PM',
    '03:00 PM',
    '04:00 PM',
    '05:00 PM',
    '06:00 PM'
  ];

  const dailyAppointments = appointments.filter(
    a => a.date === currentDateStr && a.status !== 'cancelled'
  );

  return (
    <div className="space-y-6">
      {/* Top Controls: View Toggle & Date Navigator */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-2xl border border-stone-200 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="inline-flex rounded-xl bg-stone-100 p-1 border border-stone-200">
            <button
              onClick={() => setViewMode('daily')}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                viewMode === 'daily'
                  ? 'bg-white text-stone-900 shadow-sm'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Daily View
            </button>
            <button
              onClick={() => setViewMode('weekly')}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                viewMode === 'weekly'
                  ? 'bg-white text-stone-900 shadow-sm'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Weekly View
            </button>
          </div>

          <button
            onClick={() => setCurrentDate(new Date())}
            className="text-xs font-medium text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg border border-emerald-200 transition-colors cursor-pointer"
          >
            Jump to Today
          </button>
        </div>

        {/* Date Navigator */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigateDate(viewMode === 'daily' ? -1 : -7)}
            className="p-2 rounded-lg border border-stone-200 hover:bg-stone-50 text-stone-700 cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <span className="font-serif font-bold text-stone-900 text-sm sm:text-base min-w-[200px] text-center">
            {viewMode === 'daily'
              ? formatDateReadable(currentDateStr)
              : `Week of ${weekDays[0].toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – ${weekDays[6].toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`}
          </span>

          <button
            onClick={() => navigateDate(viewMode === 'daily' ? 1 : 7)}
            className="p-2 rounded-lg border border-stone-200 hover:bg-stone-50 text-stone-700 cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Info Notice: 1 client limit & buffer display */}
      <div className="bg-stone-100/80 border border-stone-200 p-3.5 rounded-xl flex items-center justify-between text-xs text-stone-600">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-700" />
          <span>
            Studio Constraint: <strong>Strict 1 client per time window</strong> with a <strong>{settings.bufferMinutes}-minute sanitization buffer</strong> between clients.
          </span>
        </div>
        <span className="hidden sm:inline font-mono text-[11px] text-stone-500">
          Rio Rancho Studio
        </span>
      </div>

      {/* DAILY VIEW */}
      {viewMode === 'daily' && (
        <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
          <div className="p-4 bg-stone-50 border-b border-stone-200 flex items-center justify-between">
            <h3 className="font-semibold text-stone-900 text-sm">
              Appointments for {formatDateReadable(currentDateStr)}
            </h3>
            <span className="text-xs text-stone-500">
              {dailyAppointments.length} session{dailyAppointments.length !== 1 ? 's' : ''} scheduled
            </span>
          </div>

          <div className="divide-y divide-stone-100">
            {hours.map(hour => {
              // Find if any appointment starts in or around this hour
              const matchingAppts = dailyAppointments.filter(a => a.timeSlot.startsWith(hour.slice(0, 2)));

              return (
                <div key={hour} className="flex min-h-[90px] group hover:bg-stone-50/60 transition-colors">
                  {/* Time column */}
                  <div className="w-24 sm:w-28 p-3 border-r border-stone-100 text-xs font-mono text-stone-500 flex-shrink-0">
                    {hour}
                  </div>

                  {/* Slot content */}
                  <div className="p-3 flex-1 flex flex-col justify-center">
                    {matchingAppts.length > 0 ? (
                      <div className="space-y-2">
                        {matchingAppts.map(appt => (
                          <div
                            key={appt.id}
                            onClick={() => onSelectAppointment(appt)}
                            className="bg-emerald-50/90 border border-emerald-300/80 hover:border-emerald-500 rounded-xl p-3 shadow-xs transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                          >
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-stone-900 text-sm">
                                  {appt.intakeForm.clientName}
                                </span>
                                <span className="text-[11px] font-mono text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded font-semibold">
                                  {appt.durationMinutes} min
                                </span>
                                <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                                  appt.status === 'confirmed' ? 'bg-emerald-200 text-emerald-900' : 'bg-amber-100 text-amber-900'
                                }`}>
                                  {appt.status}
                                </span>
                              </div>
                              <p className="text-xs text-stone-600 font-medium">
                                {appt.serviceName}
                              </p>
                              <div className="text-[11px] text-stone-500 flex items-center gap-2">
                                <span>{appt.timeSlot} – {appt.endTime}</span>
                                <span>•</span>
                                <span>Pressure: {appt.intakeForm.massagePreferences.pressure}</span>
                              </div>
                            </div>

                            <div className="flex items-center gap-3">
                              <span className="text-xs font-serif font-bold text-stone-900">
                                ${appt.totalPrice} ({appt.paymentStatus === 'paid_square' ? 'Paid Sq' : 'Pay Arrival'})
                              </span>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onSelectAppointment(appt);
                                }}
                                className="p-1.5 rounded-lg bg-white border border-stone-200 text-stone-700 hover:text-emerald-700 hover:bg-stone-50 transition-colors"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span className="text-xs text-stone-300 italic">
                        Available Slot
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* WEEKLY VIEW */}
      {viewMode === 'weekly' && (
        <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-x-auto">
          <div className="min-w-[800px]">
            {/* Weekday headers */}
            <div className="grid grid-cols-7 border-b border-stone-200 bg-stone-50">
              {weekDays.map((day, idx) => {
                const dayYMD = formatYMD(day);
                const isToday = dayYMD === formatYMD(new Date());
                const dayAppts = appointments.filter(
                  a => a.date === dayYMD && a.status !== 'cancelled'
                );

                return (
                  <div
                    key={idx}
                    className={`p-3 text-center border-r border-stone-200 last:border-r-0 ${
                      isToday ? 'bg-emerald-50/60' : ''
                    }`}
                  >
                    <span className="text-xs text-stone-500 uppercase tracking-wider block">
                      {day.toLocaleDateString('en-US', { weekday: 'short' })}
                    </span>
                    <span className={`text-base font-bold font-serif ${isToday ? 'text-emerald-800' : 'text-stone-900'}`}>
                      {day.getDate()}
                    </span>
                    <span className="text-[10px] text-stone-400 block mt-0.5">
                      {dayAppts.length} booked
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Weekly columns with appointment cards */}
            <div className="grid grid-cols-7 min-h-[450px] divide-x divide-stone-200">
              {weekDays.map((day, idx) => {
                const dayYMD = formatYMD(day);
                const dayAppts = appointments.filter(
                  a => a.date === dayYMD && a.status !== 'cancelled'
                );

                return (
                  <div key={idx} className="p-2 space-y-2 bg-stone-50/30">
                    {dayAppts.length === 0 ? (
                      <div className="text-center pt-10 text-[11px] text-stone-300 italic">
                        No bookings
                      </div>
                    ) : (
                      dayAppts.map(appt => (
                        <div
                          key={appt.id}
                          onClick={() => onSelectAppointment(appt)}
                          className="bg-white rounded-xl p-2.5 border border-stone-200 shadow-xs hover:border-emerald-500 cursor-pointer transition-all space-y-1"
                        >
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="font-bold text-stone-900 truncate">
                              {appt.intakeForm.clientName}
                            </span>
                            <span className="text-[10px] font-mono text-emerald-800 font-semibold">
                              {appt.durationMinutes}m
                            </span>
                          </div>
                          <p className="text-[10px] text-stone-500 truncate">
                            {appt.serviceName}
                          </p>
                          <div className="text-[10px] text-stone-600 font-mono">
                            {appt.timeSlot}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
