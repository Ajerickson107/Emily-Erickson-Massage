import React, { useState } from 'react';
import {
  User,
  Heart,
  AlertTriangle,
  Search,
  FileCheck,
  Calendar,
  Save,
  Clock,
  Sparkles,
  Phone,
  Mail,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { Appointment } from '../../types';
import { StorageService, formatDateReadable } from '../../services/storage';

interface ClientRecordsViewProps {
  appointments: Appointment[];
  selectedAppointment: Appointment | null;
  onSelectAppointment: (appointment: Appointment | null) => void;
  onRefresh: () => void;
}

export const ClientRecordsView: React.FC<ClientRecordsViewProps> = ({
  appointments,
  selectedAppointment,
  onSelectAppointment,
  onRefresh
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeAppt, setActiveAppt] = useState<Appointment | null>(
    selectedAppointment || appointments[0] || null
  );
  const [therapistNotes, setTherapistNotes] = useState<string>(
    activeAppt?.therapistNotes || ''
  );
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Update therapist notes when active appointment changes
  const handleSelect = (appt: Appointment) => {
    setActiveAppt(appt);
    onSelectAppointment(appt);
    setTherapistNotes(appt.therapistNotes || '');
    setSavedSuccess(false);
  };

  const handleSaveNotes = () => {
    if (!activeAppt) return;
    StorageService.updateAppointment(activeAppt.id, {
      therapistNotes: therapistNotes
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
    onRefresh();
  };

  const filtered = appointments.filter(a => {
    const q = searchQuery.toLowerCase();
    return (
      a.intakeForm.clientName.toLowerCase().includes(q) ||
      a.intakeForm.email.toLowerCase().includes(q) ||
      a.bookingReference.toLowerCase().includes(q)
    );
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Left Column: Client List Directory */}
      <div className="lg:col-span-4 space-y-4">
        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-serif font-bold text-stone-900 text-base">
              Client Directory
            </h3>
            <span className="text-xs bg-stone-100 text-stone-600 px-2 py-0.5 rounded font-mono">
              {filtered.length} Records
            </span>
          </div>

          <div className="relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by client or email..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-stone-50 border border-stone-200 text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden divide-y divide-stone-100 max-h-[650px] overflow-y-auto">
          {filtered.map(appt => {
            const isSelected = activeAppt?.id === appt.id;
            const hasContraindications =
              appt.intakeForm.medicalHistory.highBloodPressure ||
              appt.intakeForm.medicalHistory.allergies ||
              appt.intakeForm.medicalHistory.heartConditions ||
              appt.intakeForm.medicalHistory.varicoseVeins;

            return (
              <div
                key={appt.id}
                onClick={() => handleSelect(appt)}
                className={`p-4 transition-all cursor-pointer text-left ${
                  isSelected
                    ? 'bg-emerald-50/80 border-l-4 border-emerald-600'
                    : 'hover:bg-stone-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-stone-900 text-sm">
                    {appt.intakeForm.clientName}
                  </span>
                  <span className="text-[11px] font-mono text-stone-400">
                    {appt.bookingReference}
                  </span>
                </div>

                <p className="text-xs text-stone-500 truncate mt-0.5">
                  {appt.serviceName}
                </p>

                <div className="flex items-center justify-between text-[11px] text-stone-400 mt-2">
                  <span>{formatDateReadable(appt.date)}</span>
                  {hasContraindications && (
                    <span className="flex items-center gap-1 text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200 font-medium">
                      <AlertTriangle className="w-3 h-3 text-amber-600" />
                      <span>Medical Alert</span>
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right Column: Detailed Digital Intake Form & Clinical Notes */}
      <div className="lg:col-span-8">
        {activeAppt ? (
          <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6 sm:p-8 space-y-6">
            {/* Header info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-5">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs uppercase font-bold text-emerald-700">
                    Digital Intake & Health History
                  </span>
                  <span className="text-xs font-mono bg-stone-100 px-2 py-0.5 rounded text-stone-600">
                    Ref: {activeAppt.bookingReference}
                  </span>
                </div>
                <h3 className="font-serif text-2xl font-bold text-stone-900 mt-0.5">
                  {activeAppt.intakeForm.clientName}
                </h3>
                <div className="flex items-center gap-4 text-xs text-stone-500 mt-1 flex-wrap">
                  <span className="flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5" />
                    <span>{activeAppt.intakeForm.phone}</span>
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5" />
                    <span>{activeAppt.intakeForm.email}</span>
                  </span>
                  {activeAppt.intakeForm.occupation && (
                    <>
                      <span>•</span>
                      <span>Occupation: {activeAppt.intakeForm.occupation}</span>
                    </>
                  )}
                </div>
              </div>

              <div className="text-right sm:self-center">
                <span className="text-xs text-stone-500 block">Session Scheduled</span>
                <span className="font-bold text-stone-900 text-sm">
                  {formatDateReadable(activeAppt.date)} at {activeAppt.timeSlot}
                </span>
                <span className="text-xs text-emerald-800 font-semibold block">
                  {activeAppt.serviceName} ({activeAppt.durationMinutes} min)
                </span>
              </div>
            </div>

            {/* Medical Contraindications Box */}
            <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-xs uppercase tracking-wider text-stone-700 flex items-center gap-1.5">
                  <Heart className="w-4 h-4 text-red-600" />
                  <span>Clinical Health & Contraindications Check</span>
                </h4>
                <span className="text-[11px] text-stone-500">
                  Self-reported by client
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
                <div className={`p-2.5 rounded-lg border flex items-center justify-between ${
                  activeAppt.intakeForm.medicalHistory.highBloodPressure
                    ? 'bg-amber-50 border-amber-300 text-amber-900 font-semibold'
                    : 'bg-white border-stone-200 text-stone-600'
                }`}>
                  <span>High Blood Pressure</span>
                  <span>{activeAppt.intakeForm.medicalHistory.highBloodPressure ? '⚠️ YES' : 'No'}</span>
                </div>

                <div className={`p-2.5 rounded-lg border flex items-center justify-between ${
                  activeAppt.intakeForm.medicalHistory.heartConditions
                    ? 'bg-amber-50 border-amber-300 text-amber-900 font-semibold'
                    : 'bg-white border-stone-200 text-stone-600'
                }`}>
                  <span>Heart Conditions</span>
                  <span>{activeAppt.intakeForm.medicalHistory.heartConditions ? '⚠️ YES' : 'No'}</span>
                </div>

                <div className={`p-2.5 rounded-lg border flex items-center justify-between ${
                  activeAppt.intakeForm.medicalHistory.bloodClots
                    ? 'bg-red-50 border-red-300 text-red-900 font-bold'
                    : 'bg-white border-stone-200 text-stone-600'
                }`}>
                  <span>Blood Clots / DVT</span>
                  <span>{activeAppt.intakeForm.medicalHistory.bloodClots ? '⛔ YES' : 'No'}</span>
                </div>

                <div className={`p-2.5 rounded-lg border flex items-center justify-between ${
                  activeAppt.intakeForm.medicalHistory.varicoseVeins
                    ? 'bg-amber-50 border-amber-300 text-amber-900 font-semibold'
                    : 'bg-white border-stone-200 text-stone-600'
                }`}>
                  <span>Varicose Veins</span>
                  <span>{activeAppt.intakeForm.medicalHistory.varicoseVeins ? '⚠️ YES' : 'No'}</span>
                </div>

                <div className={`p-2.5 rounded-lg border flex items-center justify-between ${
                  activeAppt.intakeForm.medicalHistory.pregnant
                    ? 'bg-purple-50 border-purple-300 text-purple-900 font-semibold'
                    : 'bg-white border-stone-200 text-stone-600'
                }`}>
                  <span>Pregnant</span>
                  <span>{activeAppt.intakeForm.medicalHistory.pregnant ? '🤰 YES' : 'No'}</span>
                </div>

                <div className={`p-2.5 rounded-lg border flex items-center justify-between ${
                  activeAppt.intakeForm.medicalHistory.allergies
                    ? 'bg-amber-50 border-amber-300 text-amber-900 font-semibold'
                    : 'bg-white border-stone-200 text-stone-600'
                }`}>
                  <span>Skin/Oil Allergies</span>
                  <span>{activeAppt.intakeForm.medicalHistory.allergies ? '⚠️ YES' : 'No'}</span>
                </div>
              </div>

              {activeAppt.intakeForm.medicalHistory.allergiesDetails && (
                <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-900">
                  <strong>Allergy Details:</strong> {activeAppt.intakeForm.medicalHistory.allergiesDetails}
                </div>
              )}

              {activeAppt.intakeForm.medicalHistory.otherConditions && (
                <div className="p-2.5 rounded-lg bg-stone-100 border border-stone-200 text-xs text-stone-800">
                  <strong>Notes on Surgeries, Meds & Injuries:</strong> {activeAppt.intakeForm.medicalHistory.otherConditions}
                </div>
              )}
            </div>

            {/* Massage Preferences & Focus */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-stone-500 block">
                  Pressure Depth Preference
                </span>
                <span className="font-bold text-emerald-800 text-base font-serif">
                  {activeAppt.intakeForm.massagePreferences.pressure}
                </span>
                <p className="text-xs text-stone-500">
                  Primary Goal: {activeAppt.intakeForm.massagePreferences.primaryGoal || 'Relieve tension'}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-stone-500 block">
                  Target Focus Areas
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {activeAppt.intakeForm.massagePreferences.focusAreas.map((area, i) => (
                    <span
                      key={i}
                      className="text-xs bg-emerald-100 text-emerald-900 font-semibold px-2 py-0.5 rounded border border-emerald-300"
                    >
                      {area}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Signed Consent & Policies */}
            <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-2 text-xs text-stone-600">
              <div className="flex items-center justify-between font-bold text-stone-900">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                  <span>Signed Digital Consent & Liability Release</span>
                </span>
                <span className="text-emerald-700 font-mono text-[11px]">
                  Verified Signature
                </span>
              </div>
              <div className="flex items-center justify-between pt-1">
                <div>
                  <span className="text-stone-400">Digital Signature: </span>
                  <span className="font-serif italic font-bold text-stone-900 text-sm">
                    {activeAppt.intakeForm.signatureName || activeAppt.intakeForm.clientName}
                  </span>
                </div>
                <div className="text-stone-400 font-mono text-[11px]">
                  Signed: {new Date(activeAppt.intakeForm.signedAt).toLocaleString()}
                </div>
              </div>
            </div>

            {/* Therapist Clinical Treatment Notes (Editable) */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-800">
                  Emily’s Clinical Treatment & Session Notes
                </label>
                {savedSuccess && (
                  <span className="text-xs text-emerald-700 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Notes saved successfully</span>
                  </span>
                )}
              </div>

              <textarea
                rows={4}
                value={therapistNotes}
                onChange={e => setTherapistNotes(e.target.value)}
                placeholder="Log therapist findings, pressure tolerance, specific muscles treated (e.g. suboccipitals, right levator scapulae), and recommended follow-up..."
                className="w-full p-3 rounded-xl border border-stone-300 text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 leading-relaxed"
              />

              <div className="flex justify-end">
                <button
                  onClick={handleSaveNotes}
                  className="bg-stone-900 hover:bg-emerald-700 text-white font-semibold text-xs px-4 py-2 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Clinical Notes</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center text-stone-400">
            <User className="w-10 h-10 mx-auto mb-2 opacity-40" />
            <p className="text-sm font-medium">Select a client record to view digital intake details.</p>
          </div>
        )}
      </div>
    </div>
  );
};
