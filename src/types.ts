export type DurationOption = 60 | 90;

export const SQUARE_BOOKING_URL = 'https://square.site/appointments/buyer/widget/6jkiftssg2nhc1/L2N4AWWF3XG13';

export interface Service {
  id: string;
  name: string;
  shortDescription: string;
  fullDescription: string;
  price60: number;
  price90: number;
  category: 'therapeutic' | 'relaxation' | 'specialized';
  isPopular?: boolean;
  idealFor: string[];
  techniquesUsed: string[];
  active: boolean;
}

export interface Enhancement {
  id: string;
  name: string;
  description: string;
  price: number;
  active: boolean;
  category: 'therapeutic' | 'aromatherapy' | 'skincare';
}

export interface Testimonial {
  id: string;
  author: string;
  date: string;
  rating: number;
  comment: string;
  serviceMentioned?: string;
  verified: boolean;
}

export interface MedicalHistory {
  highBloodPressure: boolean;
  heartConditions: boolean;
  recentSurgeries: boolean;
  recentSurgeriesDetails: string;
  varicoseVeins: boolean;
  bloodClots: boolean;
  pregnant: boolean;
  allergies: boolean;
  allergiesDetails: string;
  skinConditions: boolean;
  implantsOrPins: boolean;
  currentMedications: string;
  otherConditions: string;
}

export interface MassagePreferences {
  pressure: 'Light / Gentle' | 'Medium' | 'Firm' | 'Deep Tissue';
  focusAreas: string[];
  areasToAvoid: string[];
  primaryGoal: string;
}

export interface IntakeForm {
  clientName: string;
  email: string;
  phone: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  dob: string;
  occupation: string;
  medicalHistory: MedicalHistory;
  massagePreferences: MassagePreferences;
  agreedToArrivalPolicy: boolean;
  agreedToCancellationPolicy: boolean;
  agreedToLiabilityRelease: boolean;
  signatureName: string;
  signedAt: string;
}

export type AppointmentStatus = 'confirmed' | 'pending' | 'completed' | 'cancelled';
export type PaymentStatus = 'paid_square' | 'pay_at_arrival' | 'refunded';

export interface Appointment {
  id: string;
  bookingReference: string;
  serviceId: string;
  serviceName: string;
  durationMinutes: DurationOption;
  date: string; // YYYY-MM-DD
  timeSlot: string; // e.g. "09:00 AM"
  endTime: string; // e.g. "10:00 AM"
  selectedEnhancements: string[]; // enhancement ids
  totalPrice: number;
  status: AppointmentStatus;
  paymentStatus: PaymentStatus;
  squareTransactionId?: string;
  squarePaymentMethod?: 'credit_card' | 'apple_pay' | 'google_pay' | 'cash_app' | 'in_person';
  intakeForm: IntakeForm;
  therapistNotes?: string;
  cancellationReason?: string;
  createdAt: string;
}

export interface DaySchedule {
  isOpen: boolean;
  start: string; // e.g. "9:00 AM" or "09:00"
  end: string;   // e.g. "6:00 PM" or "18:00"
}

export interface AdminAuthCredentials {
  username: string;
  password: string;
  updatedAt?: string;
}

export interface SquareSettings {
  enabled: boolean;
  environment: 'sandbox' | 'production';
  applicationId: string;
  locationId: string;
  acceptInPersonAtStudio: boolean;
  acceptOnlineCard: boolean;
  acceptDigitalWallets?: boolean;
}

export interface ClientIntakeStatus {
  hasIntakeOnRecord: boolean;
  isIntakeExpired: boolean;
  lastSignedDate: string | null;
  daysSinceLastIntake: number | null;
  previousIntake: IntakeForm | null;
}

export interface BusinessSettings {
  businessName: string;
  leadTherapist: string;
  lmtLicense: string;
  phone: string;
  email: string;
  address: string;
  neighborhood: string;
  cityStateZip: string;
  bufferMinutes: number; // buffer between appointments, e.g. 15
  operatingHours: {
    [key: string]: DaySchedule;
  };
  parkingInstructions: string;
  arrivalPolicy: string;
  cancellationPolicy: string;
  squareSettings?: SquareSettings;
}
