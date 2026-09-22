import {
  Appointment,
  Service,
  Enhancement,
  Testimonial,
  BusinessSettings,
  DurationOption,
  AdminAuthCredentials,
  IntakeForm,
  ClientIntakeStatus
} from '../types';
import {
  INITIAL_APPOINTMENTS,
  INITIAL_SERVICES,
  INITIAL_ENHANCEMENTS,
  INITIAL_TESTIMONIALS,
  INITIAL_BUSINESS_SETTINGS
} from '../data/initialData';

const STORAGE_KEYS = {
  APPOINTMENTS: 'eemt_appointments_v2',
  SERVICES: 'eemt_services_v2',
  ENHANCEMENTS: 'eemt_enhancements_v2',
  SETTINGS: 'eemt_settings_v2',
  TESTIMONIALS: 'eemt_testimonials_v2',
  ADMIN_AUTH: 'eemt_admin_auth_v1',
  ADMIN_SESSION: 'eemt_admin_session_v1'
};

const DEFAULT_ADMIN_AUTH: AdminAuthCredentials = {
  username: 'Emily.Erickson.MT@gmail.com',
  password: 'password',
  updatedAt: new Date().toISOString()
};

export const StorageService = {
  // Appointments
  getAppointments(): Appointment[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.APPOINTMENTS);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(INITIAL_APPOINTMENTS));
        return INITIAL_APPOINTMENTS;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_APPOINTMENTS;
    }
  },

  saveAppointment(appointment: Appointment): void {
    const list = this.getAppointments();
    const updated = [appointment, ...list.filter(a => a.id !== appointment.id)];
    localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(updated));
    // Asynchronously sync to Firestore for cross-device sync
    try {
      import('./firestoreSync').then(({ FirestoreSync }) => {
        FirestoreSync.syncAppointment(appointment).catch(() => {});
      }).catch(() => {});
    } catch {
      // ignore
    }
  },

  updateAppointment(id: string, updates: Partial<Appointment>): Appointment | null {
    const list = this.getAppointments();
    const index = list.findIndex(a => a.id === id);
    if (index === -1) return null;
    const updated = { ...list[index], ...updates };
    list[index] = updated;
    localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(list));
    // Asynchronously update in Firestore
    try {
      import('./firestoreSync').then(({ FirestoreSync }) => {
        FirestoreSync.updateAppointment(id, updates).catch(() => {});
      }).catch(() => {});
    } catch {
      // ignore
    }
    return updated;
  },

  cancelAppointment(id: string, reason?: string): boolean {
    const list = this.getAppointments();
    const index = list.findIndex(a => a.id === id);
    if (index === -1) return false;
    const cancellationReason = reason || 'Cancelled by client or admin';
    list[index] = {
      ...list[index],
      status: 'cancelled',
      cancellationReason
    };
    localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(list));
    // Asynchronously update in Firestore
    try {
      import('./firestoreSync').then(({ FirestoreSync }) => {
        FirestoreSync.updateAppointment(id, {
          status: 'cancelled',
          cancellationReason
        }).catch(() => {});
      }).catch(() => {});
    } catch {
      // ignore
    }
    return true;
  },

  deleteAppointment(id: string): boolean {
    const list = this.getAppointments();
    const filtered = list.filter(a => a.id !== id);
    localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(filtered));
    try {
      import('./firestoreSync').then(({ FirestoreSync }) => {
        FirestoreSync.deleteAppointment(id).catch(() => {});
      }).catch(() => {});
    } catch {
      // ignore
    }
    return true;
  },

  // Services
  getServices(): Service[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SERVICES);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(INITIAL_SERVICES));
        return INITIAL_SERVICES;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_SERVICES;
    }
  },

  updateService(id: string, updates: Partial<Service>): void {
    const list = this.getServices();
    const index = list.findIndex(s => s.id === id);
    if (index !== -1) {
      list[index] = { ...list[index], ...updates };
      localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(list));
    }
  },

  // Enhancements
  getEnhancements(): Enhancement[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ENHANCEMENTS);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.ENHANCEMENTS, JSON.stringify(INITIAL_ENHANCEMENTS));
        return INITIAL_ENHANCEMENTS;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_ENHANCEMENTS;
    }
  },

  updateEnhancement(id: string, updates: Partial<Enhancement>): void {
    const list = this.getEnhancements();
    const index = list.findIndex(e => e.id === id);
    if (index !== -1) {
      list[index] = { ...list[index], ...updates };
      localStorage.setItem(STORAGE_KEYS.ENHANCEMENTS, JSON.stringify(list));
    }
  },

  // Business Settings
  getSettings(): BusinessSettings {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(INITIAL_BUSINESS_SETTINGS));
        return INITIAL_BUSINESS_SETTINGS;
      }
      const parsed = JSON.parse(data);
      return {
        ...INITIAL_BUSINESS_SETTINGS,
        ...parsed,
        bufferMinutes: parsed.bufferMinutes !== undefined ? parsed.bufferMinutes : 15,
        squareSettings: {
          ...INITIAL_BUSINESS_SETTINGS.squareSettings,
          ...parsed.squareSettings,
          acceptInPersonAtStudio: false
        }
      };
    } catch {
      return INITIAL_BUSINESS_SETTINGS;
    }
  },

  saveSettings(settings: BusinessSettings): void {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  },

  // Client Intake Form Status by Email
  // Checks if client has an existing intake form and whether it is expired (> 365 days)
  getClientIntakeStatus(email: string): ClientIntakeStatus {
    if (!email || !email.includes('@')) {
      return {
        hasIntakeOnRecord: false,
        isIntakeExpired: true,
        lastSignedDate: null,
        daysSinceLastIntake: null,
        previousIntake: null
      };
    }
    const normalized = email.trim().toLowerCase();
    const appointments = this.getAppointments();

    // Match appointments by client email that have an intake form
    const matches = appointments.filter(
      a => a.intakeForm && a.intakeForm.email && a.intakeForm.email.trim().toLowerCase() === normalized
    );

    if (matches.length === 0) {
      return {
        hasIntakeOnRecord: false,
        isIntakeExpired: true,
        lastSignedDate: null,
        daysSinceLastIntake: null,
        previousIntake: null
      };
    }

    // Sort by signedAt or createdAt or date descending
    matches.sort((a, b) => {
      const timeA = new Date(a.intakeForm.signedAt || a.createdAt || a.date).getTime();
      const timeB = new Date(b.intakeForm.signedAt || b.createdAt || b.date).getTime();
      return timeB - timeA;
    });

    const mostRecent = matches[0];
    const signedDate = new Date(mostRecent.intakeForm.signedAt || mostRecent.createdAt || mostRecent.date);
    const now = new Date();
    const diffMs = now.getTime() - signedDate.getTime();
    const daysSince = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
    const isIntakeExpired = daysSince >= 365;

    return {
      hasIntakeOnRecord: true,
      isIntakeExpired,
      lastSignedDate: signedDate.toISOString(),
      daysSinceLastIntake: daysSince,
      previousIntake: mostRecent.intakeForm
    };
  },

  // Testimonials
  getTestimonials(): Testimonial[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.TESTIMONIALS);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.TESTIMONIALS, JSON.stringify(INITIAL_TESTIMONIALS));
        return INITIAL_TESTIMONIALS;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_TESTIMONIALS;
    }
  },

  // Admin Authentication
  getAdminCredentials(): AdminAuthCredentials {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ADMIN_AUTH);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.ADMIN_AUTH, JSON.stringify(DEFAULT_ADMIN_AUTH));
        return DEFAULT_ADMIN_AUTH;
      }
      return JSON.parse(data);
    } catch {
      return DEFAULT_ADMIN_AUTH;
    }
  },

  saveAdminCredentials(creds: AdminAuthCredentials): void {
    localStorage.setItem(STORAGE_KEYS.ADMIN_AUTH, JSON.stringify({
      ...creds,
      updatedAt: new Date().toISOString()
    }));
  },

  isAdminAuthenticated(): boolean {
    try {
      return sessionStorage.getItem(STORAGE_KEYS.ADMIN_SESSION) === 'true';
    } catch {
      return false;
    }
  },

  setAdminAuthenticated(auth: boolean): void {
    try {
      if (auth) {
        sessionStorage.setItem(STORAGE_KEYS.ADMIN_SESSION, 'true');
      } else {
        sessionStorage.removeItem(STORAGE_KEYS.ADMIN_SESSION);
      }
    } catch {
      // ignore
    }
  },

  // Reset to initial demo data
  resetDefaults(): void {
    localStorage.removeItem(STORAGE_KEYS.APPOINTMENTS);
    localStorage.removeItem(STORAGE_KEYS.SERVICES);
    localStorage.removeItem(STORAGE_KEYS.ENHANCEMENTS);
    localStorage.removeItem(STORAGE_KEYS.SETTINGS);
    localStorage.removeItem(STORAGE_KEYS.TESTIMONIALS);
    localStorage.removeItem(STORAGE_KEYS.ADMIN_AUTH);
    sessionStorage.removeItem(STORAGE_KEYS.ADMIN_SESSION);
  },

  // Compute available time slots for a given date and service duration (60 or 90)
  // Ensures ONLY 1 client per slot, plus required buffer between clients!
  getTimeSlotsForDate(
    dateStr: string,
    durationMinutes: DurationOption = 60
  ): { time: string; endTime: string; isAvailable: boolean; conflictReason?: string }[] {
    const settings = this.getSettings();
    const appointments = this.getAppointments().filter(
      a => a.date === dateStr && a.status !== 'cancelled'
    );

    // Determine Day of week from YYYY-MM-DD
    const [year, month, day] = dateStr.split('-').map(Number);
    const dateObj = new Date(year, month - 1, day);
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayName = daysOfWeek[dateObj.getDay()];

    const schedule = settings.operatingHours[dayName];
    if (!schedule || !schedule.isOpen) {
      return [];
    }

    const startMinutes = parseTimeToMinutes(schedule.start);
    const endMinutes = parseTimeToMinutes(schedule.end);
    const buffer = settings.bufferMinutes !== undefined ? settings.bufferMinutes : 15;

    // We can generate slots spaced every 60 or 90 mins or standard schedule blocks
    // Standard studio slot starts every 90 minutes (e.g. 09:00, 11:00, 01:00, 03:00, 04:30) or hourly
    const generatedSlots: { time: string; endTime: string; isAvailable: boolean; conflictReason?: string }[] = [];

    // Pre-calculate busy time windows [startMin, endMin] for booked appointments including buffer
    const busyRanges = appointments.map(appt => {
      const apptStart = parseTimeToMinutes(appt.timeSlot);
      const apptEnd = apptStart + appt.durationMinutes;
      return {
        start: apptStart,
        end: apptEnd,
        bufferedStart: Math.max(0, apptStart - buffer),
        bufferedEnd: apptEnd + buffer,
        clientName: appt.intakeForm.clientName,
        serviceName: appt.serviceName
      };
    });

    for (let current = startMinutes; current + durationMinutes <= endMinutes; current += 60) {
      const slotEnd = current + durationMinutes;
      const formattedStart = formatMinutesToTime(current);
      const formattedEnd = formatMinutesToTime(slotEnd);

      // Check for overlap: A slot is blocked if [current, slotEnd] conflicts with any booked appointment's [apptStart, apptEnd + buffer]
      // Or if the slot begins inside another's buffer window
      let hasConflict = false;
      let conflictNote = '';

      for (const busy of busyRanges) {
        // Direct overlap:
        const overlap = Math.max(current, busy.start) < Math.min(slotEnd, busy.end);
        // Buffer overlap:
        const bufferOverlap = Math.max(current, busy.start) < Math.min(slotEnd, busy.bufferedEnd) ||
                             Math.max(current, busy.bufferedStart) < Math.min(slotEnd, busy.end);

        if (overlap) {
          hasConflict = true;
          conflictNote = 'Booked: 1 client limit reached';
          break;
        } else if (bufferOverlap) {
          hasConflict = true;
          conflictNote = `Reserved for sanitization buffer (${buffer} min)`;
          break;
        }
      }

      generatedSlots.push({
        time: formattedStart,
        endTime: formattedEnd,
        isAvailable: !hasConflict,
        conflictReason: conflictNote || undefined
      });
    }

    return generatedSlots;
  }
};

// Helper: Convert "09:00 AM", "9:00 AM", or "18:00" to minutes from midnight
export function parseTimeToMinutes(timeStr: string): number {
  if (!timeStr) return 0;
  const trimmed = timeStr.trim();
  const upper = trimmed.toUpperCase();

  if (upper.includes('AM') || upper.includes('PM')) {
    const parts = trimmed.split(/\s+/);
    const [hoursStr, minsStr] = parts[0].split(':');
    let hours = parseInt(hoursStr, 10);
    const mins = parseInt(minsStr, 10) || 0;
    const modifier = parts[1] ? parts[1].toUpperCase() : 'AM';

    if (modifier === 'PM' && hours < 12) {
      hours += 12;
    }
    if (modifier === 'AM' && hours === 12) {
      hours = 0;
    }
    return hours * 60 + mins;
  } else {
    // 24-hr format e.g. "09:00" or "18:00"
    const [hoursStr, minsStr] = trimmed.split(':');
    const hours = parseInt(hoursStr, 10) || 0;
    const mins = parseInt(minsStr, 10) || 0;
    return hours * 60 + mins;
  }
}

// Helper: Convert minutes from midnight to "09:00 AM"
export function formatMinutesToTime(totalMinutes: number): string {
  let hours = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;
  const modifier = hours >= 12 ? 'PM' : 'AM';

  if (hours > 12) {
    hours -= 12;
  } else if (hours === 0) {
    hours = 12;
  }

  const formattedHours = hours.toString().padStart(2, '0');
  const formattedMins = mins.toString().padStart(2, '0');
  return `${formattedHours}:${formattedMins} ${modifier}`;
}

// Helper: Format date string YYYY-MM-DD to human friendly string
export function formatDateReadable(dateStr: string): string {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('-').map(Number);
  const dateObj = new Date(year, month - 1, day);
  return dateObj.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}
