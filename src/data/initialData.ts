import { Service, Enhancement, Testimonial, BusinessSettings, Appointment } from '../types';

export const INITIAL_SERVICES: Service[] = [
  {
    id: 'deep-tissue',
    name: 'Therapeutic Deep Tissue Massage',
    shortDescription: 'Targeted firm pressure to relieve chronic tension, stubborn knots, and muscular tightness.',
    fullDescription: 'Emily’s signature specialty. Using precise slow strokes, cross-fiber friction, and focused pressure, this treatment addresses deeper muscle layers and connective tissue. Highly recommended for chronic neck, shoulder, and lower back tightness, postural strain, and athletic recovery.',
    price60: 95,
    price90: 140,
    category: 'therapeutic',
    isPopular: true,
    idealFor: ['Chronic muscle knots', 'Neck & shoulder tightness', 'Athletic stiffness', 'Desk worker postural strain'],
    techniquesUsed: ['Myofascial release', 'Neuromuscular friction', 'Cross-fiber soft tissue mobilization', 'Deep structural pressure'],
    active: true,
  },
  {
    id: 'swedish-relaxation',
    name: 'Custom Swedish Relaxation Massage',
    shortDescription: 'Long, fluid strokes designed to soothe the nervous system, improve circulation, and melt stress.',
    fullDescription: 'A classic, restorative full-body treatment utilizing gentle-to-medium pressure, effleurage, and petrissage. Formulated to lower cortisol, promote restful sleep, and revitalize the entire body in a tranquil, calm private studio setting.',
    price60: 85,
    price90: 125,
    category: 'relaxation',
    isPopular: false,
    idealFor: ['Stress relief', 'Fatigue & restlessness', 'Circulation improvement', 'First-time massage clients'],
    techniquesUsed: ['Effleurage', 'Petrissage', 'Gentle passive stretching', 'Rhythmic soothing strokes'],
    active: true,
  }
];

export const INITIAL_ENHANCEMENTS: Enhancement[] = [
  {
    id: 'hot-stones',
    name: 'Moving Basalt Hot Stones',
    description: 'Heated river basalt stones smoothly glided across muscular tissue, deeply softening muscle fibers and easing restricted fascia.',
    price: 20,
    active: true,
    category: 'therapeutic'
  },
  {
    id: 'silicone-cupping',
    name: 'Targeted Silicone Cupping',
    description: 'Negative pressure suction cups that decompress tight fascial layers and enhance localized microcirculation.',
    price: 20,
    active: true,
    category: 'therapeutic'
  },
  {
    id: 'theragun-percussive',
    name: 'TheraGun Percussive Therapy',
    description: 'Targeted rapid mechanical percussive oscillation to release stubborn hypertonic muscle fibers quickly and effectively.',
    price: 15,
    active: true,
    category: 'therapeutic'
  },
  {
    id: 'cbd-targeted-relief',
    name: 'Targeted CBD Relief Balm',
    description: 'Premium organic botanical CBD topical applied directly to overworked muscle groups and joints.',
    price: 20,
    active: true,
    category: 'therapeutic'
  },
  {
    id: 'therapeutic-aromatherapy',
    name: 'Therapeutic Aromatherapy',
    description: 'Pure organic botanical essential oil blend (Eucalyptus, Lavender, or Sweet Orange) diffused and applied.',
    price: 10,
    active: true,
    category: 'aromatherapy'
  },
  {
    id: 'hand-foot-scrub',
    name: 'Revitalizing Hand & Foot Scrub',
    description: 'Exfoliating sugar or sea salt scrub, followed by soothing warm steaming towels, finished with rich hydrating butter.',
    price: 20,
    active: true,
    category: 'skincare'
  }
];

export const INITIAL_TESTIMONIALS: Testimonial[] = [
  {
    id: 'rev-1',
    author: 'Larry Polanis',
    date: 'March 03, 2026',
    rating: 5,
    comment: 'No one does a deep tissue massage like Emily. She’s a rock star.',
    serviceMentioned: 'Therapeutic Deep Tissue',
    verified: true
  },
  {
    id: 'rev-2',
    author: 'Kim B',
    date: 'February 26, 2026',
    rating: 5,
    comment: 'I read nice reviews about Emily, so I was glad to get in with her. She has very strong hands and really worked hard to fix my shoulder! Great Job, thanks Emily! Whenever I get back to ABQ I will book you again!',
    serviceMentioned: 'Shoulder & Deep Tissue Relief',
    verified: true
  },
  {
    id: 'rev-3',
    author: 'Amor Trujillo',
    date: 'August 02, 2025',
    rating: 5,
    comment: 'Emily’s communication was 10/10, her technique and pressure were GREAT & she listened to exactly what my needs were. Awesome therapist overall!',
    serviceMentioned: 'Custom Therapeutic Bodywork',
    verified: true
  },
  {
    id: 'rev-4',
    author: 'Melissa Montano',
    date: 'September 26, 2025',
    rating: 5,
    comment: 'All the therapists really listen to my needs and help with my problem areas... Emily really helped with my problems areas and her neck work is phenomenal.',
    serviceMentioned: 'Targeted Neck Relief',
    verified: true
  },
  {
    id: 'rev-5',
    author: 'Dorothy Allen',
    date: 'August 02, 2025',
    rating: 5,
    comment: 'Went in with bad neck pain and left feeling great. Thanks Emily!',
    serviceMentioned: 'Neck & Upper Back Rescue',
    verified: true
  },
  {
    id: 'rev-6',
    author: 'Debbie Kenworthy',
    date: 'December 17, 2025',
    rating: 5,
    comment: 'I have gone to Massage Envy for 10+ years. Emily is my current massage therapist. She is friendly and very responsive to my request. I highly recommend Emily.',
    serviceMentioned: 'Regular Monthly Maintenance',
    verified: true
  },
  {
    id: 'rev-7',
    author: 'RLH',
    date: 'November 20, 2025',
    rating: 5,
    comment: 'Emily is a very good massage therapist. Asks questions about pressure and hit the right spots that need attention.',
    serviceMentioned: 'Deep Tissue Massage',
    verified: true
  },
  {
    id: 'rev-8',
    author: 'Daniel Stein',
    date: 'October 26, 2025',
    rating: 5,
    comment: 'Thank you Emily for the thorough deep tissue.',
    serviceMentioned: 'Therapeutic Deep Tissue',
    verified: true
  },
  {
    id: 'rev-9',
    author: 'Darlean Urban',
    date: 'November 22, 2025',
    rating: 5,
    comment: 'Emily E. is a top of the line massage therapist.',
    serviceMentioned: 'Full Body Massage',
    verified: true
  },
  {
    id: 'rev-10',
    author: 'Lauren Lighthall',
    date: 'July 17, 2025',
    rating: 5,
    comment: 'Emily is a sweet, kind woman and an amazing masseuse! I love having her work on me once a month.',
    serviceMentioned: 'Swedish & Maintenance',
    verified: true
  },
  {
    id: 'rev-11',
    author: 'Randall Nelson',
    date: 'November 15, 2025',
    rating: 5,
    comment: 'Emily does an awesome job! Very satisfied!!!',
    serviceMentioned: 'Deep Tissue',
    verified: true
  },
  {
    id: 'rev-12',
    author: 'Blanca Wheeler',
    date: 'July 24, 2025',
    rating: 5,
    comment: 'Emily does a great job and listens to my concerns.',
    serviceMentioned: 'Therapeutic Massage',
    verified: true
  },
  {
    id: 'rev-13',
    author: 'Lisa Patterson',
    date: 'July 23, 2025',
    rating: 5,
    comment: 'Enjoyed the massage Emily. Good job. Slept well.',
    serviceMentioned: 'Restorative Swedish',
    verified: true
  },
  {
    id: 'rev-14',
    author: 'Janece Lyle',
    date: 'June 06, 2025',
    rating: 5,
    comment: 'Had a deep tissue massage with Emily. She was amazing!',
    serviceMentioned: 'Therapeutic Deep Tissue',
    verified: true
  }
];

export const INITIAL_BUSINESS_SETTINGS: BusinessSettings = {
  businessName: 'Emily Erickson Massage Therapy',
  leadTherapist: 'Emily Erickson, LMT',
  lmtLicense: 'MT-2025-0039',
  phone: '(505) 615-6043',
  email: 'Emily.Erickson.MT@gmail.com',
  address: '2807 Cambridge Ave',
  neighborhood: 'Rio Rancho',
  cityStateZip: 'Rio Rancho, NM 87144',
  bufferMinutes: 15, // 15-minute sanitization buffer between clients
  operatingHours: {
    Saturday: { isOpen: true, start: '9:00 AM', end: '6:00 PM' },
    Sunday: { isOpen: true, start: '9:00 AM', end: '6:00 PM' },
    Monday: { isOpen: true, start: '9:00 AM', end: '6:00 PM' },
    Tuesday: { isOpen: false, start: '9:00 AM', end: '6:00 PM' },
    Wednesday: { isOpen: false, start: '9:00 AM', end: '6:00 PM' },
    Thursday: { isOpen: false, start: '9:00 AM', end: '6:00 PM' },
    Friday: { isOpen: false, start: '9:00 AM', end: '6:00 PM' },
  },
  parkingInstructions: 'Please park directly in the designated driveway space or along the street curbing directly in front of 2807 Cambridge Ave. Please do not block neighboring driveways.',
  arrivalPolicy: 'To preserve complete privacy for the client before you and ensure Emily has adequate time for medical sanitization and room reset, please remain comfortably in your vehicle until your exact scheduled appointment time. Emily will greet you at the front entrance when ready.',
  cancellationPolicy: 'We require a minimum of 24 hours advance notice for any rescheduling or cancellations. Because this is a private home studio with limited daily client capacity, late cancellations may incur a 50% service fee.',
  squareSettings: {
    enabled: true,
    environment: 'sandbox',
    applicationId: 'sandbox-sq0idb-demo-rio-rancho-mt',
    locationId: 'L_RR_STUDIO_01',
    acceptInPersonAtStudio: false,
    acceptOnlineCard: true,
    acceptDigitalWallets: true
  }
};

export const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: 'appt-101',
    bookingReference: 'EEMT-9482',
    serviceId: 'deep-tissue',
    serviceName: 'Therapeutic Deep Tissue Massage',
    durationMinutes: 90,
    date: '2026-09-21',
    timeSlot: '10:00 AM',
    endTime: '11:30 AM',
    selectedEnhancements: ['silicone-cupping', 'cbd-targeted-relief'],
    totalPrice: 180,
    status: 'confirmed',
    paymentStatus: 'paid_square',
    squareTransactionId: 'sq_tx_8391740291',
    squarePaymentMethod: 'apple_pay',
    createdAt: '2026-09-18T14:20:00Z',
    therapistNotes: 'Prefers firm pressure on upper traps and right scapula. Client reported tightness from marathon training. Applied silicone cupping along rhomboids.',
    intakeForm: {
      clientName: 'Larry Polanis',
      email: 'larry.polanis@example.com',
      phone: '(505) 555-0144',
      emergencyContactName: 'Sarah Polanis',
      emergencyContactPhone: '(505) 555-0145',
      dob: '1984-06-12',
      occupation: 'Civil Engineer',
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
        currentMedications: 'None',
        otherConditions: 'Occasional mild sciatica'
      },
      massagePreferences: {
        pressure: 'Deep Tissue',
        focusAreas: ['Upper Shoulders', 'Upper Back', 'Lower Back', 'Hamstrings'],
        areasToAvoid: [],
        primaryGoal: 'Relieve deep chronic muscle knots and lower back tightness'
      },
      agreedToArrivalPolicy: true,
      agreedToCancellationPolicy: true,
      agreedToLiabilityRelease: true,
      signatureName: 'Larry Polanis',
      signedAt: '2026-09-18T14:18:00Z'
    }
  },
  {
    id: 'appt-102',
    bookingReference: 'EEMT-9483',
    serviceId: 'deep-tissue',
    serviceName: 'Therapeutic Deep Tissue Massage',
    durationMinutes: 60,
    date: '2026-09-21',
    timeSlot: '01:00 PM',
    endTime: '02:00 PM',
    selectedEnhancements: ['hot-stones'],
    totalPrice: 115,
    status: 'confirmed',
    paymentStatus: 'paid_square',
    squareTransactionId: 'sq_tx_7492019482',
    squarePaymentMethod: 'credit_card',
    createdAt: '2026-09-19T09:12:00Z',
    therapistNotes: 'Focus on suboccipitals and levator scapulae with moving basalt hot stones. Client reports desk postural fatigue.',
    intakeForm: {
      clientName: 'Kim B',
      email: 'kimb.nm@example.com',
      phone: '(505) 555-0199',
      emergencyContactName: 'David B',
      emergencyContactPhone: '(505) 555-0198',
      dob: '1979-11-04',
      occupation: 'Graphic Designer',
      medicalHistory: {
        highBloodPressure: false,
        heartConditions: false,
        recentSurgeries: false,
        recentSurgeriesDetails: '',
        varicoseVeins: false,
        bloodClots: false,
        pregnant: false,
        allergies: true,
        allergiesDetails: 'Mild sensitivity to eucalyptus',
        skinConditions: false,
        implantsOrPins: false,
        currentMedications: 'None',
        otherConditions: 'Right rotator cuff strain'
      },
      massagePreferences: {
        pressure: 'Firm',
        focusAreas: ['Neck', 'Upper Shoulders', 'Upper Back'],
        areasToAvoid: [],
        primaryGoal: 'Shoulder mobility and alleviating tension headaches'
      },
      agreedToArrivalPolicy: true,
      agreedToCancellationPolicy: true,
      agreedToLiabilityRelease: true,
      signatureName: 'Kim B',
      signedAt: '2026-09-19T09:10:00Z'
    }
  },
  {
    id: 'appt-103',
    bookingReference: 'EEMT-9484',
    serviceId: 'swedish-relaxation',
    serviceName: 'Custom Swedish Relaxation Massage',
    durationMinutes: 60,
    date: '2026-09-23',
    timeSlot: '11:00 AM',
    endTime: '12:00 PM',
    selectedEnhancements: ['therapeutic-aromatherapy'],
    totalPrice: 95,
    status: 'pending',
    paymentStatus: 'pay_at_arrival',
    createdAt: '2026-09-20T16:45:00Z',
    therapistNotes: 'First session at home studio. Requested lavender oil.',
    intakeForm: {
      clientName: 'Debbie Kenworthy',
      email: 'debbie.k@example.com',
      phone: '(505) 555-0322',
      emergencyContactName: 'Mark Kenworthy',
      emergencyContactPhone: '(505) 555-0323',
      dob: '1968-03-21',
      occupation: 'Retired Teacher',
      medicalHistory: {
        highBloodPressure: true,
        heartConditions: false,
        recentSurgeries: false,
        recentSurgeriesDetails: '',
        varicoseVeins: true,
        bloodClots: false,
        pregnant: false,
        allergies: false,
        allergiesDetails: '',
        skinConditions: false,
        implantsOrPins: false,
        currentMedications: 'Lisinopril (blood pressure controlled)',
        otherConditions: 'Mild arthritis in fingers'
      },
      massagePreferences: {
        pressure: 'Medium',
        focusAreas: ['Upper Back', 'Arms/Hands', 'Feet'],
        areasToAvoid: ['Lower legs / varicose veins'],
        primaryGoal: 'Gentle relaxation and circulation improvement'
      },
      agreedToArrivalPolicy: true,
      agreedToCancellationPolicy: true,
      agreedToLiabilityRelease: true,
      signatureName: 'Debbie Kenworthy',
      signedAt: '2026-09-20T16:42:00Z'
    }
  },
  {
    id: 'appt-103',
    bookingReference: 'EEMT-2104',
    serviceId: 'deep-tissue',
    serviceName: 'Therapeutic Deep Tissue Massage',
    durationMinutes: 60,
    date: '2025-05-10',
    timeSlot: '11:00 AM',
    endTime: '12:00 PM',
    selectedEnhancements: [],
    totalPrice: 95,
    status: 'completed',
    paymentStatus: 'paid_square',
    squareTransactionId: 'sq_tx_past_annual_test',
    squarePaymentMethod: 'credit_card',
    createdAt: '2025-05-08T10:00:00Z',
    therapistNotes: 'Initial session last year. Chronic lower back tightness.',
    intakeForm: {
      clientName: 'David Miller',
      email: 'david.miller@example.com',
      phone: '(505) 555-0899',
      emergencyContactName: 'Laura Miller',
      emergencyContactPhone: '(505) 555-0890',
      dob: '1979-11-04',
      occupation: 'Software Architect',
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
        currentMedications: 'None',
        otherConditions: 'Sciatic nerve sensitivity (right side)'
      },
      massagePreferences: {
        pressure: 'Deep Tissue',
        focusAreas: ['Lower Back', 'Glutes/Hips', 'Hamstrings'],
        areasToAvoid: [],
        primaryGoal: 'Relieve lumbar compression and hip stiffness'
      },
      agreedToArrivalPolicy: true,
      agreedToCancellationPolicy: true,
      agreedToLiabilityRelease: true,
      signatureName: 'David Miller',
      signedAt: '2025-05-08T10:15:00Z' // Signed > 1 year ago!
    }
  }
];
