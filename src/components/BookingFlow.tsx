import React, { useState, useEffect } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  User,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  MapPin,
  ChevronRight,
  Check,
  CreditCard,
  X
} from 'lucide-react';
import {
  Service,
  Enhancement,
  DurationOption,
  IntakeForm,
  Appointment,
  BusinessSettings,
  ClientIntakeStatus
} from '../types';
import { StorageService, formatDateReadable } from '../services/storage';
import { SquarePaymentModal } from './SquarePaymentModal';

interface BookingFlowProps {
  services: Service[];
  enhancements: Enhancement[];
  settings: BusinessSettings;
  preSelectedServiceId?: string;
  preSelectedDuration?: DurationOption;
  onClose: () => void;
  onAppointmentBooked: (newAppt: Appointment) => void;
}

export const BookingFlow: React.FC<BookingFlowProps> = ({
  services,
  enhancements,
  settings,
  preSelectedServiceId,
  preSelectedDuration = 60,
  onClose,
  onAppointmentBooked
}) => {
  // Booking Steps: 1: Service, 2: Date & Slot, 3: Intake Form, 4: Confirmed
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Step 1 State: Service & Duration & Enhancements
  const [selectedServiceId, setSelectedServiceId] = useState<string>(
    preSelectedServiceId || (services[0]?.id ?? 'deep-tissue')
  );
  const [selectedDuration, setSelectedDuration] = useState<DurationOption>(preSelectedDuration);
  const [selectedEnhancementIds, setSelectedEnhancementIds] = useState<string[]>([]);

  // Step 2 State: Date & Slot Selection
  // Default to tomorrow's date formatted as YYYY-MM-DD
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const initialDateStr = tomorrow.toISOString().split('T')[0];

  const [selectedDate, setSelectedDate] = useState<string>(initialDateStr);
  const [selectedSlot, setSelectedSlot] = useState<{ time: string; endTime: string } | null>(null);
  const [availableSlots, setAvailableSlots] = useState<{
    time: string;
    endTime: string;
    isAvailable: boolean;
    conflictReason?: string;
  }[]>([]);

  // Step 3 State: Digital Intake Form
  const [intake, setIntake] = useState<IntakeForm>({
    clientName: '',
    email: '',
    phone: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    dob: '',
    occupation: '',
    medicalHistory: {
      highBloodPressure: false,
      heartConditions: false,
      recentSurgeries: false,
      recentSurgeriesDetails: '',
      varicoseVeins: false,
      bloodClots: false,
      pregnant: false,
      allergies: false,
      allergiesDetails: '',
      skinConditions: false,
      implantsOrPins: false,
      currentMedications: '',
      otherConditions: ''
    },
    massagePreferences: {
      pressure: 'Firm',
      focusAreas: ['Neck', 'Upper Shoulders', 'Upper Back'],
      areasToAvoid: [],
      primaryGoal: 'Relieve chronic muscle knots and tension'
    },
    agreedToArrivalPolicy: false,
    agreedToCancellationPolicy: false,
    agreedToLiabilityRelease: false,
    signatureName: '',
    signedAt: new Date().toISOString()
  });

  const [intakeErrors, setIntakeErrors] = useState<string[]>([]);
  const [intakeStatus, setIntakeStatus] = useState<ClientIntakeStatus | null>(null);

  // Step 4 State: Square Payment Handoff
  const [showSquareModal, setShowSquareModal] = useState(false);
  const [confirmedAppointment, setConfirmedAppointment] = useState<Appointment | null>(null);

  // Check client intake status whenever email changes
  useEffect(() => {
    if (intake.email && intake.email.includes('@') && intake.email.includes('.')) {
      const status = StorageService.getClientIntakeStatus(intake.email.trim());
      setIntakeStatus(status);
      if (status.hasIntakeOnRecord && status.previousIntake) {
        setIntake(prev => ({
          ...prev,
          clientName: prev.clientName || status.previousIntake!.clientName || '',
          phone: prev.phone || status.previousIntake!.phone || '',
          dob: prev.dob || status.previousIntake!.dob || '',
          occupation: prev.occupation || status.previousIntake!.occupation || '',
          emergencyContactName: prev.emergencyContactName || status.previousIntake!.emergencyContactName || '',
          emergencyContactPhone: prev.emergencyContactPhone || status.previousIntake!.emergencyContactPhone || '',
          medicalHistory: {
            ...status.previousIntake!.medicalHistory,
            ...prev.medicalHistory
          },
          massagePreferences: {
            ...status.previousIntake!.massagePreferences,
            ...prev.massagePreferences
          }
        }));
      }
    } else {
      setIntakeStatus(null);
    }
  }, [intake.email]);

  // Recalculate available slots whenever date or duration changes
  useEffect(() => {
    if (selectedDate) {
      const slots = StorageService.getTimeSlotsForDate(selectedDate, selectedDuration);
      setAvailableSlots(slots);
      // Reset selected slot if no longer available
      setSelectedSlot(null);
    }
  }, [selectedDate, selectedDuration]);

  const activeServices = services.filter(s => s.active);
  const activeEnhancements = enhancements.filter(e => e.active);
  const selectedService = services.find(s => s.id === selectedServiceId) || services[0];

  // Calculate total price
  const basePrice = selectedDuration === 60 ? (selectedService?.price60 || 95) : (selectedService?.price90 || 140);
  const enhancementsPrice = selectedEnhancementIds.reduce((sum, id) => {
    const enh = enhancements.find(e => e.id === id);
    return sum + (enh?.price || 0);
  }, 0);
  const totalPrice = basePrice + enhancementsPrice;

  // Enhancements toggle
  const toggleEnhancement = (id: string) => {
    setSelectedEnhancementIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // Focus areas toggle
  const toggleFocusArea = (area: string) => {
    setIntake(prev => {
      const current = prev.massagePreferences.focusAreas;
      const updated = current.includes(area)
        ? current.filter(a => a !== area)
        : [...current, area];
      return {
        ...prev,
        massagePreferences: {
          ...prev.massagePreferences,
          focusAreas: updated
        }
      };
    });
  };

  // Validate Intake Form
  const validateIntake = (): boolean => {
    const errors: string[] = [];
    if (!intake.clientName.trim()) errors.push('Full Name is required');
    if (!intake.email.trim() || !intake.email.includes('@')) errors.push('A valid email address is required');
    if (!intake.phone.trim()) errors.push('Phone number is required');
    if (!intake.agreedToArrivalPolicy) errors.push('You must acknowledge the Rio Rancho studio arrival & parking policy');
    if (!intake.agreedToCancellationPolicy) errors.push('You must agree to the 24-hour cancellation policy');
    if (!intake.agreedToLiabilityRelease) errors.push('You must agree to the massage therapy liability release');
    if (!intake.signatureName.trim()) errors.push('Digital signature is required');

    setIntakeErrors(errors);
    return errors.length === 0;
  };

  const handleProceedToPayment = () => {
    if (!validateIntake()) return;
    setShowSquareModal(true);
  };

  const handleSquarePaymentSuccess = (
    method: 'credit_card' | 'apple_pay' | 'google_pay' | 'cash_app' | 'in_person',
    txId: string
  ) => {
    setShowSquareModal(false);

    const bookingRef = `EEMT-${Math.floor(1000 + Math.random() * 9000)}`;
    const newAppointment: Appointment = {
      id: `appt-${Date.now()}`,
      bookingReference: bookingRef,
      serviceId: selectedService.id,
      serviceName: selectedService.name,
      durationMinutes: selectedDuration,
      date: selectedDate,
      timeSlot: selectedSlot ? selectedSlot.time : '10:00 AM',
      endTime: selectedSlot ? selectedSlot.endTime : '11:00 AM',
      selectedEnhancements: selectedEnhancementIds,
      totalPrice: totalPrice,
      status: 'confirmed',
      paymentStatus: method === 'in_person' ? 'pay_at_arrival' : 'paid_square',
      squareTransactionId: txId,
      squarePaymentMethod: method,
      intakeForm: {
        ...intake,
        signedAt: new Date().toISOString()
      },
      createdAt: new Date().toISOString()
    };

    StorageService.saveAppointment(newAppointment);
    setConfirmedAppointment(newAppointment);
    onAppointmentBooked(newAppointment);
    setStep(4);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6">
      <div className="bg-white rounded-2xl max-w-3xl w-full shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header bar */}
        <div className="bg-stone-900 text-stone-100 p-4 sm:p-5 flex items-center justify-between border-b border-stone-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-bold tracking-wider text-emerald-400">
                Online Booking Engine
              </span>
              <span className="text-[11px] bg-stone-800 text-stone-300 px-2 py-0.5 rounded border border-stone-700">
                1 Client Capacity per Slot
              </span>
            </div>
            <h2 className="font-serif text-lg sm:text-xl font-bold text-white">
              Schedule Your Session with Emily Erickson, LMT
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-stone-400 hover:text-white hover:bg-stone-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step indicator breadcrumbs */}
        <div className="bg-stone-100 border-b border-stone-200 px-4 sm:px-6 py-3 flex items-center justify-between text-xs font-medium text-stone-600">
          <div className={`flex items-center gap-1.5 ${step === 1 ? 'text-emerald-700 font-bold' : step > 1 ? 'text-stone-900' : 'text-stone-400'}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] ${step === 1 ? 'bg-emerald-700 text-white' : step > 1 ? 'bg-stone-300 text-stone-800' : 'bg-stone-200 text-stone-500'}`}>1</span>
            <span>Service & Add-ons</span>
          </div>
          <ChevronRight className="w-4 h-4 text-stone-400" />

          <div className={`flex items-center gap-1.5 ${step === 2 ? 'text-emerald-700 font-bold' : step > 2 ? 'text-stone-900' : 'text-stone-400'}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] ${step === 2 ? 'bg-emerald-700 text-white' : step > 2 ? 'bg-stone-300 text-stone-800' : 'bg-stone-200 text-stone-500'}`}>2</span>
            <span>Date & Time</span>
          </div>
          <ChevronRight className="w-4 h-4 text-stone-400" />

          <div className={`flex items-center gap-1.5 ${step === 3 ? 'text-emerald-700 font-bold' : step > 3 ? 'text-stone-900' : 'text-stone-400'}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] ${step === 3 ? 'bg-emerald-700 text-white' : step > 3 ? 'bg-stone-300 text-stone-800' : 'bg-stone-200 text-stone-500'}`}>3</span>
            <span>Intake & Consent</span>
          </div>
          <ChevronRight className="w-4 h-4 text-stone-400" />

          <div className={`flex items-center gap-1.5 ${step === 4 ? 'text-emerald-700 font-bold' : 'text-stone-400'}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] ${step === 4 ? 'bg-emerald-700 text-white' : 'bg-stone-200 text-stone-500'}`}>4</span>
            <span>Confirmation</span>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6">
          {/* STEP 1: SERVICE & DURATION & ENHANCEMENTS */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-2">
                  1. Choose Duration
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedDuration(60)}
                    className={`p-4 rounded-xl border text-left cursor-pointer transition-all ${
                      selectedDuration === 60
                        ? 'border-emerald-600 bg-emerald-50/60 ring-2 ring-emerald-500/30'
                        : 'border-stone-200 hover:border-stone-300 bg-stone-50/40'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-stone-900 text-base">60 Minutes</span>
                      <span className="font-serif font-bold text-emerald-800">
                        ${selectedService.price60}
                      </span>
                    </div>
                    <p className="text-xs text-stone-500 mt-1">
                      Targeted relief for high priority tension zones.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedDuration(90)}
                    className={`p-4 rounded-xl border text-left cursor-pointer transition-all ${
                      selectedDuration === 90
                        ? 'border-emerald-600 bg-emerald-50/60 ring-2 ring-emerald-500/30'
                        : 'border-stone-200 hover:border-stone-300 bg-stone-50/40'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-stone-900 text-base">90 Minutes</span>
                      <span className="font-serif font-bold text-emerald-800">
                        ${selectedService.price90}
                      </span>
                    </div>
                    <p className="text-xs text-stone-500 mt-1">
                      Recommended: Comprehensive full-body tension release.
                    </p>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-2">
                  2. Select Massage Modality
                </label>
                <div className="space-y-2.5">
                  {activeServices.map(service => (
                    <div
                      key={service.id}
                      onClick={() => setSelectedServiceId(service.id)}
                      className={`p-4 rounded-xl border text-left cursor-pointer transition-all flex items-start justify-between gap-4 ${
                        selectedServiceId === service.id
                          ? 'border-emerald-600 bg-emerald-50/40 ring-1 ring-emerald-500'
                          : 'border-stone-200 hover:border-stone-300'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-stone-900 text-sm sm:text-base">
                            {service.name}
                          </span>
                          {service.isPopular && (
                            <span className="text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded">
                              Top Rated
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-stone-600 leading-relaxed">
                          {service.shortDescription}
                        </p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <span className="font-serif font-bold text-stone-900 text-base">
                          ${selectedDuration === 60 ? service.price60 : service.price90}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Enhancements Selection */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700">
                    3. Optional Clinical Enhancements
                  </label>
                  <span className="text-xs text-stone-500">Select any add-on</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {activeEnhancements.map(enh => {
                    const isSelected = selectedEnhancementIds.includes(enh.id);
                    return (
                      <div
                        key={enh.id}
                        onClick={() => toggleEnhancement(enh.id)}
                        className={`p-3 rounded-lg border text-left cursor-pointer transition-all flex items-center justify-between ${
                          isSelected
                            ? 'border-emerald-600 bg-emerald-50 text-emerald-950 ring-1 ring-emerald-500'
                            : 'border-stone-200 hover:bg-stone-50 text-stone-700'
                        }`}
                      >
                        <div className="pr-2">
                          <span className="font-medium text-xs block">{enh.name}</span>
                          <span className="text-[11px] text-stone-500 leading-tight block line-clamp-1">
                            {enh.description}
                          </span>
                        </div>
                        <span className="text-xs font-bold text-emerald-800 font-serif flex-shrink-0">
                          +${enh.price}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: DATE & TIME SLOT SELECTION */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="bg-emerald-50/70 border border-emerald-200 p-4 rounded-xl text-xs text-emerald-900 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-700 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="font-bold">Strict 1-Client Policy & Sanitization Buffer</strong>
                  <p className="mt-0.5 text-emerald-800">
                    Emily accepts only one client in the studio at any time. A mandatory {settings.bufferMinutes}-minute buffer is held between appointments for deep sanitization and sheet sterilization.
                  </p>
                </div>
              </div>

              {/* Date Input */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-2">
                  Select Date
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="date"
                    min={new Date().toISOString().split('T')[0]}
                    value={selectedDate}
                    onChange={e => setSelectedDate(e.target.value)}
                    className="w-full sm:w-auto p-3 rounded-xl border border-stone-300 text-stone-800 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <span className="text-sm font-medium text-stone-600">
                    {formatDateReadable(selectedDate)}
                  </span>
                </div>
              </div>

              {/* Available Slots */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-2">
                  Select Available Time Slot ({selectedDuration} Minutes)
                </label>

                {availableSlots.length === 0 ? (
                  <div className="p-8 text-center bg-stone-50 rounded-xl border border-stone-200 text-stone-500">
                    <p className="font-medium">Studio is closed on this day.</p>
                    <p className="text-xs mt-1">Please select another date from the calendar.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {availableSlots.map((slot, idx) => {
                      const isSelected = selectedSlot?.time === slot.time;
                      return (
                        <button
                          key={idx}
                          type="button"
                          disabled={!slot.isAvailable}
                          onClick={() => setSelectedSlot({ time: slot.time, endTime: slot.endTime })}
                          className={`p-3.5 rounded-xl border text-center transition-all cursor-pointer relative ${
                            !slot.isAvailable
                              ? 'bg-stone-100 border-stone-200 text-stone-400 cursor-not-allowed opacity-60'
                              : isSelected
                              ? 'border-emerald-600 bg-emerald-600 text-white font-bold ring-2 ring-emerald-500 shadow-sm'
                              : 'border-stone-300 bg-white hover:border-emerald-500 text-stone-800 font-medium'
                          }`}
                        >
                          <div className="text-sm">{slot.time}</div>
                          <div className={`text-[11px] mt-0.5 ${isSelected ? 'text-emerald-100' : 'text-stone-500'}`}>
                            until {slot.endTime}
                          </div>
                          {!slot.isAvailable && (
                            <span className="text-[10px] text-stone-500 block mt-1 font-normal">
                              {slot.conflictReason || 'Unavailable'}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {selectedSlot && (
                <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-700 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-emerald-700" />
                    <span>
                      Selected Slot: <strong>{selectedSlot.time} – {selectedSlot.endTime}</strong> on {formatDateReadable(selectedDate)}
                    </span>
                  </div>
                  <span className="text-emerald-700 font-semibold">Available for Booking</span>
                </div>
              )}
            </div>
          )}

          {/* STEP 3: DIGITAL INTAKE FORM */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="bg-stone-50 border border-stone-200 p-4 rounded-xl text-xs text-stone-600">
                <p className="font-semibold text-stone-900 mb-1">Confidential Digital Intake Form</p>
                Emily reviews this clinical information prior to your session to adapt pressure, ensure zero contraindications, and deliver safe, targeted bodywork.
              </div>

              {intakeErrors.length > 0 && (
                <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs space-y-1">
                  <div className="font-bold flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-red-600" />
                    <span>Please complete the required fields:</span>
                  </div>
                  <ul className="list-disc pl-5">
                    {intakeErrors.map((err, i) => (
                      <li key={i}>{err}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Personal Details */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700">
                  Client Information
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-stone-600 mb-1">Full Legal Name *</label>
                    <input
                      type="text"
                      value={intake.clientName}
                      onChange={e => setIntake({ ...intake, clientName: e.target.value })}
                      placeholder="e.g. Jane Smith"
                      className="w-full p-2.5 rounded-lg border border-stone-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-stone-600 mb-1">Email Address *</label>
                    <input
                      type="email"
                      value={intake.email}
                      onChange={e => setIntake({ ...intake, email: e.target.value })}
                      placeholder="jane@example.com"
                      className="w-full p-2.5 rounded-lg border border-stone-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-stone-600 mb-1">Mobile Phone *</label>
                    <input
                      type="tel"
                      value={intake.phone}
                      onChange={e => setIntake({ ...intake, phone: e.target.value })}
                      placeholder="(505) 555-0123"
                      className="w-full p-2.5 rounded-lg border border-stone-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-stone-600 mb-1">Occupation (Helps assess repetitive strain)</label>
                    <input
                      type="text"
                      value={intake.occupation}
                      onChange={e => setIntake({ ...intake, occupation: e.target.value })}
                      placeholder="e.g. Software developer, nurse, teacher"
                      className="w-full p-2.5 rounded-lg border border-stone-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Dynamic Intake Status Notice */}
                {intakeStatus && intakeStatus.hasIntakeOnRecord && !intakeStatus.isIntakeExpired && (
                  <div className="p-3 rounded-xl bg-emerald-50/90 border border-emerald-200 text-xs text-emerald-900 flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold">Returning Client — Valid Annual Intake on File</p>
                      <p className="text-emerald-800 text-[11px] mt-0.5">
                        Last completed: {intakeStatus.lastSignedDate}. Your health history and preferences have been pre-filled. Please review and confirm your consent below for today's session.
                      </p>
                    </div>
                  </div>
                )}

                {intakeStatus && intakeStatus.hasIntakeOnRecord && intakeStatus.isIntakeExpired && (
                  <div className="p-3 rounded-xl bg-amber-50 border border-amber-300 text-xs text-amber-950 flex items-start gap-2.5">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold">Annual Intake Renewal Required (Expired &gt; 1 Year)</p>
                      <p className="text-amber-800 text-[11px] mt-0.5">
                        Your previous intake was signed on {intakeStatus.lastSignedDate}. State regulations require an annual health update. We've pre-filled your info—please review and update any changes.
                      </p>
                    </div>
                  </div>
                )}

                {intake.email.includes('@') && intakeStatus && !intakeStatus.hasIntakeOnRecord && (
                  <div className="p-3 rounded-xl bg-pink-50 border border-pink-200 text-xs text-stone-800 flex items-start gap-2.5">
                    <Sparkles className="w-4 h-4 text-pink-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-stone-900">New Client Welcome Intake</p>
                      <p className="text-stone-600 text-[11px] mt-0.5">
                        Welcome to Emily's studio! Please complete your confidential health history and massage preferences below.
                      </p>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block text-xs font-medium text-stone-600 mb-1">Emergency Contact Name</label>
                    <input
                      type="text"
                      value={intake.emergencyContactName}
                      onChange={e => setIntake({ ...intake, emergencyContactName: e.target.value })}
                      placeholder="Contact Name"
                      className="w-full p-2.5 rounded-lg border border-stone-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-stone-600 mb-1">Emergency Contact Phone</label>
                    <input
                      type="tel"
                      value={intake.emergencyContactPhone}
                      onChange={e => setIntake({ ...intake, emergencyContactPhone: e.target.value })}
                      placeholder="(505) 555-0199"
                      className="w-full p-2.5 rounded-lg border border-stone-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Medical Contraindications Checklist */}
              <div className="space-y-3 pt-3 border-t border-stone-200">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700">
                  Medical History & Contraindications
                </h4>
                <p className="text-xs text-stone-500">
                  Please check any conditions that currently apply to you:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <label className="flex items-center gap-2 p-2 rounded-lg bg-stone-50 border border-stone-200 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={intake.medicalHistory.highBloodPressure}
                      onChange={e => setIntake({
                        ...intake,
                        medicalHistory: { ...intake.medicalHistory, highBloodPressure: e.target.checked }
                      })}
                      className="rounded text-emerald-600 focus:ring-emerald-500"
                    />
                    <span>High Blood Pressure</span>
                  </label>

                  <label className="flex items-center gap-2 p-2 rounded-lg bg-stone-50 border border-stone-200 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={intake.medicalHistory.heartConditions}
                      onChange={e => setIntake({
                        ...intake,
                        medicalHistory: { ...intake.medicalHistory, heartConditions: e.target.checked }
                      })}
                      className="rounded text-emerald-600 focus:ring-emerald-500"
                    />
                    <span>Heart Conditions</span>
                  </label>

                  <label className="flex items-center gap-2 p-2 rounded-lg bg-stone-50 border border-stone-200 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={intake.medicalHistory.bloodClots}
                      onChange={e => setIntake({
                        ...intake,
                        medicalHistory: { ...intake.medicalHistory, bloodClots: e.target.checked }
                      })}
                      className="rounded text-emerald-600 focus:ring-emerald-500"
                    />
                    <span>History of Blood Clots / DVT</span>
                  </label>

                  <label className="flex items-center gap-2 p-2 rounded-lg bg-stone-50 border border-stone-200 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={intake.medicalHistory.varicoseVeins}
                      onChange={e => setIntake({
                        ...intake,
                        medicalHistory: { ...intake.medicalHistory, varicoseVeins: e.target.checked }
                      })}
                      className="rounded text-emerald-600 focus:ring-emerald-500"
                    />
                    <span>Varicose Veins</span>
                  </label>

                  <label className="flex items-center gap-2 p-2 rounded-lg bg-stone-50 border border-stone-200 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={intake.medicalHistory.pregnant}
                      onChange={e => setIntake({
                        ...intake,
                        medicalHistory: { ...intake.medicalHistory, pregnant: e.target.checked }
                      })}
                      className="rounded text-emerald-600 focus:ring-emerald-500"
                    />
                    <span>Currently Pregnant</span>
                  </label>

                  <label className="flex items-center gap-2 p-2 rounded-lg bg-stone-50 border border-stone-200 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={intake.medicalHistory.allergies}
                      onChange={e => setIntake({
                        ...intake,
                        medicalHistory: { ...intake.medicalHistory, allergies: e.target.checked }
                      })}
                      className="rounded text-emerald-600 focus:ring-emerald-500"
                    />
                    <span>Allergies (Nut oils, lotions, scents)</span>
                  </label>
                </div>

                {intake.medicalHistory.allergies && (
                  <input
                    type="text"
                    value={intake.medicalHistory.allergiesDetails}
                    onChange={e => setIntake({
                      ...intake,
                      medicalHistory: { ...intake.medicalHistory, allergiesDetails: e.target.value }
                    })}
                    placeholder="Please specify allergies (e.g., coconut oil, lavender, citrus)"
                    className="w-full p-2.5 rounded-lg border border-amber-300 bg-amber-50 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                )}

                <div>
                  <label className="block text-xs font-medium text-stone-600 mb-1">
                    Other Injuries, Surgeries, or Medications:
                  </label>
                  <textarea
                    rows={2}
                    value={intake.medicalHistory.otherConditions}
                    onChange={e => setIntake({
                      ...intake,
                      medicalHistory: { ...intake.medicalHistory, otherConditions: e.target.value }
                    })}
                    placeholder="e.g. Rotator cuff recovery, neck pin, taking blood thinners"
                    className="w-full p-2.5 rounded-lg border border-stone-300 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Focus Areas & Pressure Preference */}
              <div className="space-y-3 pt-3 border-t border-stone-200">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700">
                  Massage Focus & Preferences
                </h4>

                <div>
                  <label className="block text-xs font-medium text-stone-600 mb-1.5">
                    Preferred Pressure Level
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {(['Light / Gentle', 'Medium', 'Firm', 'Deep Tissue'] as const).map(level => (
                      <button
                        type="button"
                        key={level}
                        onClick={() => setIntake({
                          ...intake,
                          massagePreferences: { ...intake.massagePreferences, pressure: level }
                        })}
                        className={`p-2.5 rounded-lg border text-xs font-semibold cursor-pointer transition-all ${
                          intake.massagePreferences.pressure === level
                            ? 'bg-emerald-700 text-white border-emerald-700'
                            : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
                        }`}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-600 mb-1.5">
                    Select Areas Needing Special Attention
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      'Neck',
                      'Upper Shoulders',
                      'Upper Back',
                      'Lower Back',
                      'Glutes',
                      'Hamstrings',
                      'Calves',
                      'Feet',
                      'Arms/Hands',
                      'Jaw / Suboccipitals'
                    ].map(area => {
                      const isChecked = intake.massagePreferences.focusAreas.includes(area);
                      return (
                        <button
                          type="button"
                          key={area}
                          onClick={() => toggleFocusArea(area)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all border ${
                            isChecked
                              ? 'bg-emerald-100 text-emerald-900 border-emerald-300 font-semibold'
                              : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
                          }`}
                        >
                          {isChecked ? `✓ ${area}` : `+ ${area}`}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Policies & Digital Signature */}
              <div className="space-y-3 pt-3 border-t border-stone-200">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700">
                  Required Studio Policies & Digital Consent
                </h4>

                <label className="flex items-start gap-2.5 p-3 rounded-xl bg-emerald-50/70 border border-emerald-200 cursor-pointer text-xs text-stone-800">
                  <input
                    type="checkbox"
                    checked={intake.agreedToArrivalPolicy}
                    onChange={e => setIntake({ ...intake, agreedToArrivalPolicy: e.target.checked })}
                    className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <div>
                    <strong className="text-emerald-950 font-semibold">Rio Rancho Studio Arrival Policy:</strong>
                    <p className="text-emerald-900 mt-0.5">
                      I understand that 2807 Cambridge Ave is a quiet residential home studio. I agree to <strong>remain in my car until my exact scheduled appointment time</strong> so previous clients depart privately and Emily completes full room sanitization.
                    </p>
                  </div>
                </label>

                <label className="flex items-start gap-2.5 p-3 rounded-xl bg-stone-50 border border-stone-200 cursor-pointer text-xs text-stone-700">
                  <input
                    type="checkbox"
                    checked={intake.agreedToCancellationPolicy}
                    onChange={e => setIntake({ ...intake, agreedToCancellationPolicy: e.target.checked })}
                    className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <div>
                    <strong>24-Hour Cancellation Policy:</strong>
                    <p className="text-stone-500 mt-0.5">
                      I understand that cancellations or rescheduling with less than 24 hours notice may incur a 50% service charge.
                    </p>
                  </div>
                </label>

                <label className="flex items-start gap-2.5 p-3 rounded-xl bg-stone-50 border border-stone-200 cursor-pointer text-xs text-stone-700">
                  <input
                    type="checkbox"
                    checked={intake.agreedToLiabilityRelease}
                    onChange={e => setIntake({ ...intake, agreedToLiabilityRelease: e.target.checked })}
                    className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <div>
                    <strong>Therapy Consent & Medical Waiver:</strong>
                    <p className="text-stone-500 mt-0.5">
                      I affirm that I have stated all my known medical conditions and will update the therapist of any changes. I understand massage therapy does not replace medical diagnosis.
                    </p>
                  </div>
                </label>

                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Digital Signature (Type Full Legal Name) *
                  </label>
                  <input
                    type="text"
                    value={intake.signatureName}
                    onChange={e => setIntake({ ...intake, signatureName: e.target.value })}
                    placeholder="Type full legal name as digital signature"
                    className="w-full p-2.5 rounded-lg border border-stone-300 font-serif italic text-base text-stone-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                  <span className="text-[11px] text-stone-400 block mt-1">
                    Legally binding digital signature timestamped at {new Date().toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: CONFIRMATION SCREEN */}
          {step === 4 && confirmedAppointment && (
            <div className="space-y-6 text-center py-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <span className="text-xs uppercase font-bold tracking-wider text-emerald-700">
                  Booking Confirmed!
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 mt-1">
                  You are scheduled with Emily Erickson, LMT
                </h3>
                <p className="text-sm text-stone-600 mt-1">
                  Booking Reference: <strong className="font-mono text-emerald-800">{confirmedAppointment.bookingReference}</strong>
                </p>
              </div>

              {/* Appointment summary card */}
              <div className="bg-stone-50 rounded-2xl p-5 sm:p-6 border border-stone-200 text-left max-w-lg mx-auto space-y-3 text-sm">
                <div className="flex justify-between border-b border-stone-200 pb-2">
                  <span className="text-stone-500">Service</span>
                  <span className="font-bold text-stone-900">{confirmedAppointment.serviceName}</span>
                </div>

                <div className="flex justify-between border-b border-stone-200 pb-2">
                  <span className="text-stone-500">Duration</span>
                  <span className="font-medium text-stone-900">{confirmedAppointment.durationMinutes} Minutes</span>
                </div>

                <div className="flex justify-between border-b border-stone-200 pb-2">
                  <span className="text-stone-500">Date & Time</span>
                  <span className="font-medium text-stone-900">
                    {formatDateReadable(confirmedAppointment.date)} at {confirmedAppointment.timeSlot}
                  </span>
                </div>

                <div className="flex justify-between border-b border-stone-200 pb-2">
                  <span className="text-stone-500">Square Payment</span>
                  <span className="font-medium text-emerald-800">
                    {confirmedAppointment.paymentStatus === 'paid_square'
                      ? `Paid ($${confirmedAppointment.totalPrice}.00 via Square)`
                      : `Pay In-Person at Arrival ($${confirmedAppointment.totalPrice}.00)`}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-stone-500">Client</span>
                  <span className="font-medium text-stone-900">{confirmedAppointment.intakeForm.clientName}</span>
                </div>
              </div>

              {/* Arrival & Directions reminder */}
              <div className="bg-emerald-50 rounded-2xl p-5 border border-emerald-200 text-left max-w-lg mx-auto space-y-2 text-xs text-emerald-950">
                <div className="flex items-center gap-2 font-bold text-emerald-900 text-sm">
                  <MapPin className="w-4 h-4 text-emerald-700" />
                  <span>Rio Rancho Studio Arrival Instructions</span>
                </div>
                <p>
                  <strong>Address:</strong> {settings.address}, {settings.cityStateZip}
                </p>
                <p className="text-emerald-900">
                  <strong>Parking:</strong> Park in the designated driveway space or along the curb directly in front of the residence.
                </p>
                <div className="p-2.5 rounded-lg bg-emerald-100/70 border border-emerald-300 font-medium">
                  Important: Please remain comfortably in your vehicle until your exact appointment time ({confirmedAppointment.timeSlot}). Emily will greet you at the entrance.
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={onClose}
                  className="bg-stone-900 hover:bg-stone-800 text-white font-semibold px-8 py-3 rounded-xl transition-all cursor-pointer"
                >
                  Done & Return to Website
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation Buttons */}
        {step < 4 && (
          <div className="bg-stone-50 border-t border-stone-200 p-4 sm:p-5 flex items-center justify-between">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep((step - 1) as 1 | 2 | 3)}
                className="px-4 py-2.5 rounded-xl border border-stone-300 text-stone-700 hover:bg-stone-100 text-sm font-medium flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
            ) : (
              <div className="text-xs text-stone-500">
                Total: <strong className="text-stone-900 text-sm font-serif">${totalPrice}</strong>
              </div>
            )}

            <div className="flex items-center gap-3">
              {step === 1 && (
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm px-6 py-2.5 rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-sm"
                >
                  <span>Select Date & Time</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}

              {step === 2 && (
                <button
                  type="button"
                  disabled={!selectedSlot}
                  onClick={() => setStep(3)}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm px-6 py-2.5 rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span>Proceed to Digital Intake</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}

              {step === 3 && (
                <button
                  type="button"
                  onClick={handleProceedToPayment}
                  className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-pink-700 hover:from-emerald-800 hover:to-pink-600 text-white font-bold text-sm px-6 py-2.5 rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-md"
                >
                  <CreditCard className="w-4 h-4 text-emerald-200" />
                  <span>Square Checkout (${totalPrice})</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Square Payment Modal */}
      {showSquareModal && (
        <SquarePaymentModal
          isOpen={showSquareModal}
          appointmentData={{
            serviceName: selectedService.name,
            duration: selectedDuration,
            date: formatDateReadable(selectedDate),
            timeSlot: selectedSlot?.time || '',
            totalPrice: totalPrice,
            clientName: intake.clientName,
            clientEmail: intake.email
          }}
          squareSettings={settings.squareSettings}
          onClose={() => setShowSquareModal(false)}
          onPaymentSuccess={handleSquarePaymentSuccess}
        />
      )}
    </div>
  );
};
