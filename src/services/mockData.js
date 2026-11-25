// MediVoice AI – Patient-Facing Mock Data & Scenario Scripts

export const CURRENT_PATIENT = {
  id: "pat-101",
  name: "John Anderson",
  phone: "+1 (555) 234-8901",
  formattedPhone: "+1 (555) 234-8901",
  email: "john.anderson@example.com",
  dob: "1988-06-14",
  gender: "Male",
  bloodGroup: "O+",
  emergencyContact: "+1 (555) 998-1122 (Sarah Anderson - Spouse)",
  address: "742 Evergreen Terrace, Springfield",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop",
  notificationPrefs: {
    smsReminders: true,
    whatsappUpdates: true,
    emailConfirmations: true,
    calendarSync: true,
  },
  preferences: {
    preferredLanguage: "English (US)",
    shareHealthRecords: true,
    audioPlaybackVolume: "Normal",
  }
};

export const INITIAL_DOCTORS = [
  {
    id: "doc-1",
    name: "Dr. Rajesh Sharma",
    title: "Senior Consultant Cardiologist",
    speciality: "Cardiology",
    experience: "14 years experience",
    rating: 4.9,
    reviewsCount: 184,
    consultationFee: 120,
    currency: "$",
    status: "Available Today",
    badge: "Top Rated",
    avatar: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=300&auto=format&fit=crop",
    education: "MD (Medicine), DM (Cardiology) - AIIMS New Delhi",
    hospital: "MediVoice Heart & Vascular Institute",
    languages: ["English", "Hindi"],
    about: "Dr. Sharma specializes in preventive cardiology, management of complex hypertension, heart rhythm disorders, and non-invasive cardiovascular assessment with over a decade of clinical excellence.",
    availableSlots: [
      {
        date: "2026-11-25",
        label: "Today (Nov 25)",
        times: ["10:00 AM", "11:30 AM", "02:00 PM", "04:30 PM"]
      },
      {
        date: "2026-11-26",
        label: "Tomorrow (Nov 26)",
        times: ["09:30 AM", "10:00 AM", "11:00 AM", "03:15 PM", "05:00 PM"]
      },
      {
        date: "2026-11-27",
        label: "Friday (Nov 27)",
        times: ["10:00 AM", "12:00 PM", "02:30 PM", "04:00 PM"]
      }
    ]
  },
  {
    id: "doc-2",
    name: "Dr. Priya Nair",
    title: "Lead Dermatologist & Aesthetic Specialist",
    speciality: "Dermatology",
    experience: "9 years experience",
    rating: 4.8,
    reviewsCount: 142,
    consultationFee: 95,
    currency: "$",
    status: "Available Today",
    badge: "Popular",
    avatar: "https://images.unsplash.com/photo-1594824813589-980757db6ef8?q=80&w=300&auto=format&fit=crop",
    education: "MBBS, MD (Dermatology, Venereology & Leprosy)",
    hospital: "DermaCare Specialty Clinic",
    languages: ["English", "Hindi", "Malayalam"],
    about: "Dr. Nair is an expert in clinical dermatology, chronic eczema, acne scar treatments, autoimmune dermatological conditions, and advanced laser therapies.",
    availableSlots: [
      {
        date: "2026-11-25",
        label: "Today (Nov 25)",
        times: ["11:00 AM", "01:00 PM", "03:30 PM"]
      },
      {
        date: "2026-11-26",
        label: "Tomorrow (Nov 26)",
        times: ["10:00 AM", "11:30 AM", "02:00 PM", "04:00 PM"]
      },
      {
        date: "2026-11-27",
        label: "Friday (Nov 27)",
        times: ["09:00 AM", "11:00 AM", "03:00 PM"]
      }
    ]
  },
  {
    id: "doc-3",
    name: "Dr. Arvind Swaminathan",
    title: "Chief of Neurology & Neurophysiology",
    speciality: "Neurology",
    experience: "16 years experience",
    rating: 4.95,
    reviewsCount: 215,
    consultationFee: 150,
    currency: "$",
    status: "Slots Open Tomorrow",
    badge: "Senior Fellow",
    avatar: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?q=80&w=300&auto=format&fit=crop",
    education: "DM (Neurology) - PGIMER, Clinical Neurophysiology Fellowship (Johns Hopkins)",
    hospital: "Metropolitan Brain & Spine Center",
    languages: ["English", "Tamil", "Hindi"],
    about: "Specialized in stroke rehabilitation, migraine and cluster headache relief, neuropathies, Parkinson's disease, and comprehensive neuro-diagnostic studies.",
    availableSlots: [
      {
        date: "2026-11-26",
        label: "Tomorrow (Nov 26)",
        times: ["10:00 AM", "11:00 AM", "02:30 PM", "04:30 PM"]
      },
      {
        date: "2026-11-27",
        label: "Friday (Nov 27)",
        times: ["09:30 AM", "11:30 AM", "03:00 PM"]
      },
      {
        date: "2026-11-28",
        label: "Saturday (Nov 28)",
        times: ["10:00 AM", "01:00 PM"]
      }
    ]
  },
  {
    id: "doc-4",
    name: "Dr. Marcus Vance",
    title: "Consultant Orthopaedic & Joint Surgeon",
    speciality: "Orthopaedics",
    experience: "12 years experience",
    rating: 4.75,
    reviewsCount: 168,
    consultationFee: 110,
    currency: "$",
    status: "Available Today",
    badge: "Surgeon",
    avatar: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=300&auto=format&fit=crop",
    education: "MS (Orthopaedics), MCh (Joint Replacement) - Royal College of Surgeons",
    hospital: "Apex Orthopaedic & Sports Medicine",
    languages: ["English"],
    about: "Pioneering minimally invasive arthroscopic surgeries, sports ligament reconstruction (ACL/PCL), joint preservation therapies, and spine ergonomics.",
    availableSlots: [
      {
        date: "2026-11-25",
        label: "Today (Nov 25)",
        times: ["02:00 PM", "03:30 PM", "05:00 PM"]
      },
      {
        date: "2026-11-26",
        label: "Tomorrow (Nov 26)",
        times: ["09:00 AM", "10:30 AM", "01:30 PM", "03:30 PM"]
      },
      {
        date: "2026-11-27",
        label: "Friday (Nov 27)",
        times: ["10:00 AM", "11:30 AM", "04:00 PM"]
      }
    ]
  },
  {
    id: "doc-5",
    name: "Dr. Sarah Chen",
    title: "Senior Physician & Internal Medicine Specialist",
    speciality: "General Medicine",
    experience: "10 years experience",
    rating: 4.9,
    reviewsCount: 198,
    consultationFee: 80,
    currency: "$",
    status: "Available Today",
    badge: "Primary Care",
    avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=300&auto=format&fit=crop",
    education: "MD Internal Medicine, Harvard Medical School Affiliated Residency",
    hospital: "MediVoice Wellness & Community Care",
    languages: ["English", "Mandarin"],
    about: "Dedicated to comprehensive chronic disease management, diabetes care, geriatric health, acute febrile illnesses, and preventive health screenings.",
    availableSlots: [
      {
        date: "2026-11-25",
        label: "Today (Nov 25)",
        times: ["09:00 AM", "10:00 AM", "11:30 AM", "02:00 PM", "03:30 PM", "05:00 PM"]
      },
      {
        date: "2026-11-26",
        label: "Tomorrow (Nov 26)",
        times: ["09:00 AM", "11:00 AM", "01:00 PM", "04:00 PM"]
      },
      {
        date: "2026-11-27",
        label: "Friday (Nov 27)",
        times: ["10:00 AM", "12:00 PM", "02:30 PM"]
      }
    ]
  },
  {
    id: "doc-6",
    name: "Dr. Elena Rostova",
    title: "Senior Consultant Pulmonologist",
    speciality: "Pulmonology",
    experience: "11 years experience",
    rating: 4.85,
    reviewsCount: 130,
    consultationFee: 115,
    currency: "$",
    status: "Slots Open Tomorrow",
    badge: "Chest Specialist",
    avatar: "https://images.unsplash.com/photo-1527613426441-4da17471b66d?q=80&w=300&auto=format&fit=crop",
    education: "MD (Pulmonary Medicine), Fellowship in Sleep Medicine",
    hospital: "BreatheEasy Respiratory Center",
    languages: ["English", "Russian"],
    about: "Specialized in asthma, chronic obstructive pulmonary disease (COPD), post-viral recovery, sleep apnea evaluation, and allergic bronchitis.",
    availableSlots: [
      {
        date: "2026-11-26",
        label: "Tomorrow (Nov 26)",
        times: ["10:30 AM", "01:00 PM", "03:30 PM"]
      },
      {
        date: "2026-11-27",
        label: "Friday (Nov 27)",
        times: ["11:00 AM", "02:00 PM", "04:30 PM"]
      }
    ]
  }
];

// Patient-centric initial appointments for John Anderson
export const INITIAL_PATIENT_APPOINTMENTS = [
  {
    id: "apt-101",
    patientName: "John Anderson",
    patientPhone: "+1 (555) 234-8901",
    patientEmail: "john.anderson@example.com",
    doctorId: "doc-1",
    doctorName: "Dr. Rajesh Sharma",
    doctorAvatar: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=300&auto=format&fit=crop",
    speciality: "Cardiology",
    appointmentDate: "2026-11-26",
    appointmentTime: "10:00 AM",
    status: "Confirmed",
    bookedVia: "Talk to MediVoice AI",
    consultationFee: 120,
    paymentStatus: "Pay at Clinic",
    room: "Suite 402, Cardiac Wing",
    reason: "Preventive heart checkup & blood pressure review",
    createdAt: "2026-11-24T09:15:00Z"
  },
  {
    id: "apt-102",
    patientName: "John Anderson",
    patientPhone: "+1 (555) 234-8901",
    patientEmail: "john.anderson@example.com",
    doctorId: "doc-2",
    doctorName: "Dr. Priya Nair",
    doctorAvatar: "https://images.unsplash.com/photo-1594824813589-980757db6ef8?q=80&w=300&auto=format&fit=crop",
    speciality: "Dermatology",
    appointmentDate: "2026-11-18",
    appointmentTime: "02:30 PM",
    status: "Completed",
    bookedVia: "Find Doctors",
    consultationFee: 95,
    paymentStatus: "Paid",
    room: "Room 108, Derma Wing",
    reason: "Seasonal dry skin allergy consultation & treatment prescription",
    createdAt: "2026-11-15T14:40:00Z"
  },
  {
    id: "apt-103",
    patientName: "John Anderson",
    patientPhone: "+1 (555) 234-8901",
    patientEmail: "john.anderson@example.com",
    doctorId: "doc-5",
    doctorName: "Dr. Sarah Chen",
    doctorAvatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=300&auto=format&fit=crop",
    speciality: "General Medicine",
    appointmentDate: "2026-10-22",
    appointmentTime: "11:00 AM",
    status: "Completed",
    bookedVia: "Talk to MediVoice AI",
    consultationFee: 80,
    paymentStatus: "Paid",
    room: "Room 201, Primary Care",
    reason: "Annual wellness checkup and comprehensive metabolic panel review",
    createdAt: "2026-10-20T11:00:00Z"
  },
  {
    id: "apt-104",
    patientName: "John Anderson",
    patientPhone: "+1 (555) 234-8901",
    patientEmail: "john.anderson@example.com",
    doctorId: "doc-3",
    doctorName: "Dr. Arvind Swaminathan",
    doctorAvatar: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?q=80&w=300&auto=format&fit=crop",
    speciality: "Neurology",
    appointmentDate: "2026-11-10",
    appointmentTime: "03:00 PM",
    status: "Cancelled",
    cancellationReason: "Schedule conflict with office travel",
    bookedVia: "Talk to MediVoice AI",
    consultationFee: 150,
    paymentStatus: "Cancelled",
    room: "Room 305, Neuro Center",
    reason: "Occasional migraine follow-up",
    createdAt: "2026-11-08T10:05:00Z"
  }
];

export const INITIAL_APPOINTMENTS = INITIAL_PATIENT_APPOINTMENTS;

export const SPECIALITIES = [
  {
    id: "cardio",
    name: "Cardiology",
    label: "Cardiologist",
    iconName: "HeartPulse",
    description: "Heart checkups, ECG & blood pressure care",
    doctorCount: 1,
  },
  {
    id: "derma",
    name: "Dermatology",
    label: "Dermatologist",
    iconName: "Sparkles",
    description: "Skin allergies, acne, hair & cosmetics",
    doctorCount: 1,
  },
  {
    id: "neuro",
    name: "Neurology",
    label: "Neurologist",
    iconName: "Brain",
    description: "Brain, migraines, spine & neuro exams",
    doctorCount: 1,
  },
  {
    id: "ortho",
    name: "Orthopaedics",
    label: "Orthopaedic Surgeon",
    iconName: "Activity",
    description: "Joint pain, spine, knee & athletic injuries",
    doctorCount: 1,
  },
  {
    id: "general",
    name: "General Medicine",
    label: "Physician",
    iconName: "Stethoscope",
    description: "Fever, routine checkups & primary health",
    doctorCount: 1,
  },
  {
    id: "pulmo",
    name: "Pulmonology",
    label: "Pulmonologist",
    iconName: "Wind",
    description: "Lungs, asthma, cough & sleep evaluation",
    doctorCount: 1,
  },
];

// Patient notifications (e.g. appointment updates)
export const INITIAL_PATIENT_NOTIFICATIONS = [
  {
    id: "notif-1",
    title: "Appointment Tomorrow at 10:00 AM",
    message: "Reminder: Consultation with Dr. Rajesh Sharma (Cardiology) is tomorrow in Suite 402.",
    time: "2 hours ago",
    unread: true,
  },
  {
    id: "notif-2",
    title: "Prescription Ready",
    message: "Dr. Priya Nair updated your consultation notes and prescription summary.",
    time: "Yesterday",
    unread: false,
  },
];

// Voice Assistant Scenario Scripts
// Scenario 1: Booking Flow (matching user prompt)
export const VOICE_BOOKING_SCRIPT = [
  {
    sender: "ai",
    text: "Hello! Welcome to MediVoice. How can I help you today?",
    delayMs: 1200
  },
  {
    sender: "patient",
    text: "I want to book an appointment with a cardiologist.",
    delayMs: 2000
  },
  {
    sender: "ai",
    text: "Certainly. May I know your preferred appointment date?",
    delayMs: 1800
  },
  {
    sender: "patient",
    text: "Tomorrow.",
    delayMs: 1600
  },
  {
    sender: "ai",
    text: "I found Dr. Sharma available at 10 AM and 11 AM.",
    delayMs: 2000
  },
  {
    sender: "patient",
    text: "Book 10 AM.",
    delayMs: 1600
  },
  {
    sender: "ai",
    text: "May I have your phone number?",
    delayMs: 1800
  },
  {
    sender: "patient",
    text: "9876543210",
    delayMs: 1800
  },
  {
    sender: "ai",
    text: "Your number is 9876543210. Is that correct?",
    delayMs: 1900
  },
  {
    sender: "patient",
    text: "Yes.",
    delayMs: 1400
  },
  {
    sender: "ai",
    text: "Your appointment has been successfully booked! A confirmation SMS and calendar invite have been dispatched.",
    delayMs: 2000,
    isCompletedBooking: true,
    bookingDetails: {
      patientName: "John Anderson",
      patientPhone: "9876543210",
      doctorId: "doc-1",
      doctorName: "Dr. Rajesh Sharma",
      speciality: "Cardiology",
      appointmentDate: "2026-11-26",
      appointmentTime: "10:00 AM",
      consultationFee: 120,
      reason: "Voice Assistant Consultation Booking"
    }
  }
];

// Scenario 2: Cancellation Flow
export const VOICE_CANCELLATION_SCRIPT = [
  {
    sender: "ai",
    text: "Hello John! Welcome back to MediVoice. How can I assist you today?",
    delayMs: 1200
  },
  {
    sender: "patient",
    text: "I need to cancel my upcoming appointment with Dr. Sharma.",
    delayMs: 2000
  },
  {
    sender: "ai",
    text: "I found your upcoming appointment with Dr. Rajesh Sharma on Nov 26 at 10:00 AM. Would you like me to cancel this booking?",
    delayMs: 2200
  },
  {
    sender: "patient",
    text: "Yes, please cancel it.",
    delayMs: 1600
  },
  {
    sender: "ai",
    text: "Your appointment with Dr. Rajesh Sharma has been successfully cancelled. The slot has been released. Would you like to reschedule for another time?",
    delayMs: 2000,
    isCompletedCancellation: true,
    targetDoctorName: "Dr. Rajesh Sharma"
  }
];

// Scenario 3: Check Availability Flow
export const VOICE_AVAILABILITY_SCRIPT = [
  {
    sender: "ai",
    text: "Hello John! Welcome to MediVoice. Which doctor or speciality are you looking for?",
    delayMs: 1200
  },
  {
    sender: "patient",
    text: "When is Dr. Priya Nair available for skin consultation?",
    delayMs: 2000
  },
  {
    sender: "ai",
    text: "Dr. Priya Nair has 3 open slots today: 11:00 AM, 1:00 PM, and 3:30 PM. She is also available tomorrow at 10:00 AM.",
    delayMs: 2200
  },
  {
    sender: "patient",
    text: "Let's book today at 1:00 PM please.",
    delayMs: 1800
  },
  {
    sender: "ai",
    text: "Booking Dr. Priya Nair for Today, Nov 25 at 1:00 PM for John Anderson. Your appointment has been successfully booked!",
    delayMs: 2000,
    isCompletedBooking: true,
    bookingDetails: {
      patientName: "John Anderson",
      patientPhone: "+1 (555) 234-8901",
      doctorId: "doc-2",
      doctorName: "Dr. Priya Nair",
      speciality: "Dermatology",
      appointmentDate: "2026-11-25",
      appointmentTime: "01:00 PM",
      consultationFee: 95,
      reason: "Skin consultation & allergy check"
    }
  }
];
