import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  User,
  CheckCircle2,
  XCircle,
  Clock3,
  CalendarCheck,
  Search,
  Filter,
  Eye,
  Trash2,
  Phone,
  Mail,
  AlertTriangle,
  FileText
} from 'lucide-react';
import { Appointment, DurationOption, BusinessSettings } from '../../types';
import { StorageService, formatDateReadable } from '../../services/storage';

interface AppointmentsManagerProps {
  appointments: Appointment[];
  settings: BusinessSettings;
  onSelectAppointment: (appointment: Appointment) => void;
  onRefresh: () => void;
}

export const AppointmentsManager: React.FC<AppointmentsManagerProps> = ({
  appointments,
  settings,
  onSelectAppointment,
  onRefresh
}) => {
  const [statusFilter, setStatusFilter] = useState<'all' | 'confirmed' | 'pending' | 'completed' | 'cancelled'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Reschedule state
  const [reschedulingAppt, setReschedulingAppt] = useState<Appointment | null>(null);
  const [rescheduleDate, setRescheduleDate] = useState<string>('');
  const [rescheduleSlot, setRescheduleSlot] = useState<string>('');
  const [rescheduleAvailableSlots, setRescheduleAvailableSlots] = useState<{
    time: string;
    endTime: string;
    isAvailable: boolean;
  }[]>([]);

  // Cancel reason state
  const [cancellingAppt, setCancellingAppt] = useState<Appointment | null>(null);
  const [cancellationReason, setCancellationReason] = useState<string>('');

  const filteredAppointments = appointments.filter(a => {
    const matchesStatus = statusFilter === 'all' || a.status === statusFilter;
    const matchesSearch =
      a.intakeForm.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.serviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.bookingReference.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleApprove = (id: string) => {
    StorageService.updateAppointment(id, { status: 'confirmed' });
    onRefresh();
  };

  const handleComplete = (id: string) => {
    StorageService.updateAppointment(id, { status: 'completed' });
    onRefresh();
  };

  const handleConfirmCancel = () => {
    if (!cancellingAppt) return;
    StorageService.cancelAppointment(cancellingAppt.id, cancellationReason || 'Cancelled by Studio Admin');
    setCancellingAppt(null);
    setCancellationReason('');
    onRefresh();
  };

  const openRescheduleModal = (appt: Appointment) => {
    setReschedulingAppt(appt);
    setRescheduleDate(appt.date);
    setRescheduleSlot('');
    const slots = StorageService.getTimeSlotsForDate(appt.date, appt.durationMinutes);
    setRescheduleAvailableSlots(slots);
  };

  const handleDateChangeForReschedule = (newDate: string) => {
    setRescheduleDate(newDate);
    setRescheduleSlot('');
    if (reschedulingAppt) {
      const slots = StorageService.getTimeSlotsForDate(newDate, reschedulingAppt.durationMinutes);
      setRescheduleAvailableSlots(slots);
    }
  };

  const handleConfirmReschedule = () => {
    if (!reschedulingAppt || !rescheduleDate || !rescheduleSlot) return;

    // Calculate end time
    const slotInfo = rescheduleAvailableSlots.find(s => s.time === rescheduleSlot);
    const endTime = slotInfo ? slotInfo.endTime : '11:00 AM';

    StorageService.updateAppointment(reschedulingAppt.id, {
      date: rescheduleDate,
      timeSlot: rescheduleSlot,
      endTime: endTime,
      status: 'confirmed'
    });

    setReschedulingAppt(null);
    onRefresh();
  };

  return (
    <div className="space-y-6">
      {/* Top Filter Controls */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Status tabs */}
        <div className="flex flex-wrap items-center gap-1.5">
          {(['all', 'confirmed', 'pending', 'completed', 'cancelled'] as const).map(st => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold capitalize cursor-pointer transition-all ${
                statusFilter === st
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {st} ({appointments.filter(a => st === 'all' || a.status === st).length})
            </button>
          ))}
        </div>

        {/* Search input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by client or reference..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-stone-50 border border-stone-200 text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>

      {/* Appointments List */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
        <div className="p-4 bg-stone-50 border-b border-stone-200 flex items-center justify-between">
          <h3 className="font-semibold text-stone-900 text-sm">
            All Managed Bookings ({filteredAppointments.length})
          </h3>
          <span className="text-xs text-stone-500">
            Click &ldquo;Review Intake&rdquo; to inspect medical history
          </span>
        </div>

        {filteredAppointments.length === 0 ? (
          <div className="p-12 text-center text-stone-400">
            <CalendarCheck className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm font-medium">No appointments match the selected filters.</p>
          </div>
        ) : (
          <div className="divide-y divide-stone-200">
            {filteredAppointments.map(appt => (
              <div
                key={appt.id}
                className="p-4 sm:p-5 hover:bg-stone-50/70 transition-colors flex flex-col lg:flex-row lg:items-center justify-between gap-4"
              >
                {/* Left: Client & Service Details */}
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="font-bold text-stone-900 text-base">
                      {appt.intakeForm.clientName}
                    </span>
                    <span className="font-mono text-xs font-semibold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                      {appt.bookingReference}
                    </span>
                    <span
                      className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                        appt.status === 'confirmed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : appt.status === 'pending'
                          ? 'bg-amber-100 text-amber-800'
                          : appt.status === 'completed'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {appt.status}
                    </span>
                    <span className="text-xs text-stone-500 font-bold">
                      ${appt.totalPrice} ({appt.paymentStatus === 'paid_square' ? 'Paid via Square' : 'Square Payment Pending'})
                    </span>
                  </div>

                  <p className="text-xs font-medium text-stone-700">
                    {appt.serviceName} ({appt.durationMinutes} min)
                    {appt.selectedEnhancements.length > 0 && (
                      <span className="text-stone-500 ml-1">
                        + {appt.selectedEnhancements.join(', ')}
                      </span>
                    )}
                  </p>

                  <div className="flex items-center gap-4 text-xs text-stone-500 flex-wrap">
                    <span className="flex items-center gap-1 font-medium text-stone-800">
                      <Calendar className="w-3.5 h-3.5 text-emerald-700" />
                      <span>{formatDateReadable(appt.date)}</span>
                    </span>
                    <span className="flex items-center gap-1 font-medium text-stone-800">
                      <Clock className="w-3.5 h-3.5 text-emerald-700" />
                      <span>{appt.timeSlot} – {appt.endTime}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-stone-400" />
                      <span>{appt.intakeForm.phone}</span>
                    </span>
                  </div>

                  {/* Medical Contraindication alert tag if any */}
                  {(appt.intakeForm.medicalHistory.highBloodPressure ||
                    appt.intakeForm.medicalHistory.allergies ||
                    appt.intakeForm.medicalHistory.heartConditions ||
                    appt.intakeForm.medicalHistory.varicoseVeins) && (
                    <div className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
                      <AlertTriangle className="w-3 h-3 text-amber-600" />
                      <span>Intake notes medical condition to review</span>
                    </div>
                  )}
                </div>

                {/* Right: Operational Actions */}
                <div className="flex items-center gap-2 flex-wrap self-start lg:self-center">
                  <button
                    onClick={() => onSelectAppointment(appt)}
                    className="px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Review Intake</span>
                  </button>

                  {appt.status === 'pending' && (
                    <button
                      onClick={() => handleApprove(appt.id)}
                      className="px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Approve</span>
                    </button>
                  )}

                  {appt.status === 'confirmed' && (
                    <button
                      onClick={() => handleComplete(appt.id)}
                      className="px-3 py-1.5 rounded-lg bg-blue-700 hover:bg-blue-600 text-white text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Complete</span>
                    </button>
                  )}

                  {appt.status !== 'cancelled' && appt.status !== 'completed' && (
                    <>
                      <button
                        onClick={() => openRescheduleModal(appt)}
                        className="px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-white text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <Clock3 className="w-3.5 h-3.5" />
                        <span>Reschedule</span>
                      </button>

                      <button
                        onClick={() => setCancellingAppt(appt)}
                        className="px-3 py-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Cancel</span>
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* RESCHEDULE MODAL */}
      {reschedulingAppt && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 space-y-5">
            <div>
              <span className="text-xs uppercase font-bold text-emerald-700">
                Admin Reschedule Tool
              </span>
              <h3 className="font-serif text-xl font-bold text-stone-900 mt-0.5">
                Reschedule for {reschedulingAppt.intakeForm.clientName}
              </h3>
              <p className="text-xs text-stone-500 mt-1">
                Current: {formatDateReadable(reschedulingAppt.date)} at {reschedulingAppt.timeSlot} ({reschedulingAppt.durationMinutes} min)
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Select New Date
              </label>
              <input
                type="date"
                value={rescheduleDate}
                min={new Date().toISOString().split('T')[0]}
                onChange={e => handleDateChangeForReschedule(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Select New Time Slot (Enforces 1 Client Limit & {settings.bufferMinutes}m Buffer)
              </label>
              <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto p-1">
                {rescheduleAvailableSlots.map((slot, i) => (
                  <button
                    key={i}
                    disabled={!slot.isAvailable}
                    onClick={() => setRescheduleSlot(slot.time)}
                    className={`p-2.5 rounded-lg border text-xs text-center cursor-pointer transition-all ${
                      !slot.isAvailable
                        ? 'bg-stone-100 text-stone-400 border-stone-200 opacity-50 cursor-not-allowed'
                        : rescheduleSlot === slot.time
                        ? 'bg-emerald-700 text-white font-bold border-emerald-700 ring-2 ring-emerald-500'
                        : 'bg-stone-50 border-stone-200 text-stone-800 hover:bg-stone-100'
                    }`}
                  >
                    <div>{slot.time}</div>
                    <div className="text-[10px] opacity-75">to {slot.endTime}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-200">
              <button
                onClick={() => setReschedulingAppt(null)}
                className="px-4 py-2 rounded-lg border border-stone-300 text-stone-700 text-xs font-medium cursor-pointer"
              >
                Cancel
              </button>
              <button
                disabled={!rescheduleSlot}
                onClick={handleConfirmReschedule}
                className="px-5 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold cursor-pointer disabled:opacity-50"
              >
                Confirm Reschedule
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CANCELLATION MODAL */}
      {cancellingAppt && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-stone-200 space-y-4">
            <h3 className="font-serif text-lg font-bold text-stone-900">
              Cancel Appointment: {cancellingAppt.bookingReference}
            </h3>
            <p className="text-xs text-stone-600">
              Are you sure you want to cancel the booking for <strong>{cancellingAppt.intakeForm.clientName}</strong> on {formatDateReadable(cancellingAppt.date)} at {cancellingAppt.timeSlot}?
            </p>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Reason / Note for Cancellation
              </label>
              <input
                type="text"
                value={cancellationReason}
                onChange={e => setCancellationReason(e.target.value)}
                placeholder="e.g. Client requested via phone, family emergency"
                className="w-full p-2.5 rounded-lg border border-stone-300 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setCancellingAppt(null)}
                className="px-4 py-2 rounded-lg border border-stone-300 text-stone-700 text-xs font-medium cursor-pointer"
              >
                Keep Booking
              </button>
              <button
                onClick={handleConfirmCancel}
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold cursor-pointer"
              >
                Confirm Cancellation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
