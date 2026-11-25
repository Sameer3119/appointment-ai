/**
 * MediVoice AI - Centralized Backend API Service Layer
 * 
 * Connected to Python FastAPI + SQLite Backend running at http://127.0.0.1:8000
 * Base API URL: http://127.0.0.1:8000/api/v1
 */

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api/v1";

// Curated avatar list to provide professional medical portraits for doctors from SQLite
const DOCTOR_AVATARS = [
  "https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=300&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1594824813589-980757db6ef8?q=80&w=300&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=300&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=300&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1537368910025-700350fe46c7?q=80&w=300&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1582750433449-648ed127bb54?q=80&w=300&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1551601651-2a8555f1a136?q=80&w=300&auto=format&fit=crop",
];

/**
 * Format 24-hour time "HH:MM" into "hh:mm AM/PM"
 */
export function formatTime12h(timeStr) {
  if (!timeStr) return "";
  if (timeStr.includes("AM") || timeStr.includes("PM")) return timeStr;

  const parts = timeStr.split(":");
  let hours = parseInt(parts[0], 10);
  const minutes = parts[1] || "00";
  if (isNaN(hours)) return timeStr;

  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12;
  const strHours = hours < 10 ? `0${hours}` : `${hours}`;
  return `${strHours}:${minutes} ${ampm}`;
}

/**
 * Converts 12-hour "hh:mm AM/PM" or 24-hour "HH:MM" into standard "HH:MM"
 */
export function formatTime24h(timeStr) {
  if (!timeStr) return "09:00";
  if (!timeStr.includes("AM") && !timeStr.includes("PM")) {
    const parts = timeStr.split(":");
    return `${parts[0].padStart(2, "0")}:${(parts[1] || "00").padStart(2, "0")}`;
  }

  const match = timeStr.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return "09:00";

  let hours = parseInt(match[1], 10);
  const minutes = match[2];
  const ampm = match[3].toUpperCase();

  if (ampm === "PM" && hours < 12) hours += 12;
  if (ampm === "AM" && hours === 12) hours = 0;

  return `${String(hours).padStart(2, "0")}:${minutes}`;
}

/**
 * Normalizes backend Doctor record to match frontend component expectations
 */
export function normalizeDoctor(rawDoc, index = 0) {
  if (!rawDoc) return null;
  const avatarIndex = (Number(rawDoc.id) - 1) % DOCTOR_AVATARS.length;
  const avatar = DOCTOR_AVATARS[avatarIndex >= 0 ? avatarIndex : 0];

  return {
    id: rawDoc.id,
    name: rawDoc.name,
    specialty: rawDoc.specialty,
    speciality: rawDoc.specialty, // support both spellings
    email: rawDoc.email,
    phone: rawDoc.phone,
    is_available: rawDoc.is_available,
    status: rawDoc.is_available ? "Available Today" : "Unavailable",
    rating: 4.8 + ((Number(rawDoc.id) * 3) % 3) * 0.1,
    reviewsCount: 110 + (Number(rawDoc.id) * 19),
    consultationFee: 100 + ((Number(rawDoc.id) * 10) % 50),
    currency: "$",
    experience: `${8 + (Number(rawDoc.id) % 10)} years experience`,
    education: `MD, Board Certified in ${rawDoc.specialty}`,
    hospital: "MediVoice Specialty Medical Center",
    languages: ["English"],
    about: `Dr. ${rawDoc.name.replace(/^Dr\.\s*/i, "")} is a dedicated healthcare specialist in ${rawDoc.specialty} with comprehensive clinical background in diagnosis and advanced patient care.`,
    avatar: avatar,
    created_at: rawDoc.created_at,
    updated_at: rawDoc.updated_at,
  };
}

/**
 * Normalizes backend Appointment record to match frontend component expectations
 */
export function normalizeAppointment(rawApt) {
  if (!rawApt) return null;

  let dateStr = "";
  let timeStr = "";

  if (rawApt.appointment_date) {
    try {
      const dt = new Date(rawApt.appointment_date);
      if (!isNaN(dt.getTime())) {
        dateStr = dt.toISOString().split("T")[0];
        const hours = dt.getHours();
        const minutes = String(dt.getMinutes()).padStart(2, "0");
        timeStr = formatTime12h(`${String(hours).padStart(2, "0")}:${minutes}`);
      } else {
        // Fallback string split
        const parts = String(rawApt.appointment_date).split("T");
        dateStr = parts[0];
        timeStr = formatTime12h(parts[1]?.substring(0, 5) || "10:00");
      }
    } catch {
      dateStr = "2026-11-26";
      timeStr = "10:00 AM";
    }
  }

  const doctor = rawApt.doctor ? normalizeDoctor(rawApt.doctor) : null;
  const rawStatus = rawApt.status || "scheduled";
  
  // Standardize status for display (Scheduled -> Confirmed for upcoming UI compatibility)
  let displayStatus = "Confirmed";
  if (rawStatus.toLowerCase() === "cancelled") {
    displayStatus = "Cancelled";
  } else if (rawStatus.toLowerCase() === "completed") {
    displayStatus = "Completed";
  }

  return {
    id: rawApt.id,
    doctorId: rawApt.doctor_id,
    patientId: rawApt.patient_id,
    doctorName: doctor?.name || `Doctor #${rawApt.doctor_id}`,
    doctorAvatar: doctor?.avatar || DOCTOR_AVATARS[0],
    speciality: doctor?.specialty || "General Medicine",
    appointmentDate: dateStr,
    appointmentTime: timeStr,
    status: displayStatus,
    rawStatus: rawStatus,
    reason: rawApt.reason || "General Consultation",
    notes: rawApt.notes,
    patientName: rawApt.patient?.name || "Patient",
    patientPhone: rawApt.patient?.phone || "",
    patientEmail: rawApt.patient?.email || "",
    consultationFee: doctor?.consultationFee || 120,
    paymentStatus: "Pay at Clinic",
    room: "Suite 402, Consultation Wing",
    bookedVia: "MediVoice Web Portal",
    createdAt: rawApt.created_at,
    updatedAt: rawApt.updated_at,
    rawBackendData: rawApt,
  };
}

/**
 * Core HTTP Request wrapper with detailed backend error extraction
 */
async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);

    // If request failed, parse error details from backend response
    if (!response.ok) {
      let errorMessage = `HTTP error ${response.status}`;
      let errorData = null;

      try {
        errorData = await response.json();
        if (errorData && errorData.detail) {
          if (typeof errorData.detail === "string") {
            errorMessage = errorData.detail;
          } else if (Array.isArray(errorData.detail)) {
            // Pydantic validation error array
            errorMessage = errorData.detail.map((err) => `${err.loc.join(".")}: ${err.msg}`).join("; ");
          }
        }
      } catch {
        errorMessage = response.statusText || errorMessage;
      }

      const error = new Error(errorMessage);
      error.status = response.status;
      error.data = errorData;
      throw error;
    }

    if (response.status === 204) {
      return null;
    }

    return await response.json();
  } catch (err) {
    // If the backend was completely unreachable
    if (err.name === "TypeError" && err.message.includes("fetch")) {
      const networkError = new Error(
        `Unable to reach MediVoice backend at ${API_BASE_URL}. Please ensure the FastAPI server is running.`
      );
      networkError.status = 0;
      throw networkError;
    }
    throw err;
  }
}

// ---------------------------------------------------------------------------
// 1. DOCTORS SERVICE
// ---------------------------------------------------------------------------
export const doctorsApi = {
  /**
   * Fetch all doctors with optional specialty filtering
   * Backend endpoint: GET /api/v1/doctors
   */
  async getAll({ specialty, is_available } = {}) {
    const params = new URLSearchParams();
    if (specialty && specialty !== "All") {
      params.append("specialty", specialty);
    }
    if (typeof is_available === "boolean") {
      params.append("is_available", String(is_available));
    }

    const qs = params.toString() ? `?${params.toString()}` : "";
    const rawList = await request(`/doctors${qs}`);
    return rawList.map((doc, idx) => normalizeDoctor(doc, idx));
  },

  /**
   * Fetch doctor details by doctor ID
   * Backend endpoint: GET /api/v1/doctors/{doctorId}
   */
  async getById(doctorId) {
    const rawDoc = await request(`/doctors/${doctorId}`);
    return normalizeDoctor(rawDoc);
  },

  /**
   * Fetch available 30-minute appointment slots for a specific doctor & date
   * Backend endpoint: GET /api/v1/doctors/{doctorId}/availability?date=YYYY-MM-DD
   */
  async getAvailability(doctorId, date) {
    const data = await request(`/doctors/${doctorId}/availability?date=${encodeURIComponent(date)}`);
    return data;
  },

  // Alias for backward compatibility
  async getSlots(doctorId, date) {
    return this.getAvailability(doctorId, date);
  },
};

// ---------------------------------------------------------------------------
// 2. APPOINTMENTS SERVICE
// ---------------------------------------------------------------------------
export const appointmentsApi = {
  /**
   * Fetch all appointments with optional filters
   * Backend endpoint: GET /api/v1/appointments
   */
  async getAll({ doctor_id, patient_id, status, date } = {}) {
    const params = new URLSearchParams();
    if (doctor_id) params.append("doctor_id", String(doctor_id));
    if (patient_id) params.append("patient_id", String(patient_id));
    if (status) params.append("status", status);
    if (date) params.append("date", date);

    const qs = params.toString() ? `?${params.toString()}` : "";
    const rawList = await request(`/appointments${qs}`);
    return rawList.map(normalizeAppointment);
  },

  /**
   * Fetch appointment by ID
   * Backend endpoint: GET /api/v1/appointments/{appointmentId}
   */
  async getById(appointmentId) {
    const rawApt = await request(`/appointments/${appointmentId}`);
    return normalizeAppointment(rawApt);
  },

  /**
   * Fetch appointments for a specific patient phone number
   * Backend endpoint: GET /api/v1/appointments/by-phone/{phone}
   */
  async getByPhone(phone) {
    if (!phone) return [];
    const cleanPhone = phone.trim();
    const rawList = await request(`/appointments/by-phone/${encodeURIComponent(cleanPhone)}`);
    return rawList.map(normalizeAppointment);
  },

  /**
   * Book a new appointment in SQLite backend
   * Backend endpoint: POST /api/v1/appointments
   * 
   * Payload schema:
   * {
   *   doctor_id: number,
   *   appointment_date: string (ISO),
   *   patient_phone: string,
   *   patient_name: string,
   *   patient_email?: string,
   *   reason?: string,
   *   notes?: string
   * }
   */
  async create(appointmentInput) {
    // Format appointment date and time into valid ISO string: YYYY-MM-DDTHH:MM:00
    const date = appointmentInput.appointmentDate || appointmentInput.date;
    const rawTime = appointmentInput.appointmentTime || appointmentInput.time || "09:00";
    const time24 = formatTime24h(rawTime);
    const appointmentDateIso = `${date}T${time24}:00`;

    const payload = {
      doctor_id: Number(appointmentInput.doctorId || appointmentInput.doctor_id),
      appointment_date: appointmentDateIso,
      patient_phone: (appointmentInput.patientPhone || appointmentInput.phone || "").trim(),
      patient_name: (appointmentInput.patientName || appointmentInput.name || "").trim(),
      patient_email: (appointmentInput.patientEmail || appointmentInput.email || "").trim() || null,
      reason: appointmentInput.reason || "General Consultation",
      notes: appointmentInput.notes || null,
    };

    const rawResponse = await request("/appointments", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    return normalizeAppointment(rawResponse);
  },

  /**
   * Cancel an appointment
   * Backend endpoint: PATCH /api/v1/appointments/{appointmentId}/cancel
   */
  async cancel(appointmentId) {
    const rawResponse = await request(`/appointments/${appointmentId}/cancel`, {
      method: "PATCH",
    });
    return normalizeAppointment(rawResponse);
  },
};

// ---------------------------------------------------------------------------
// 3. HEALTH CHECK SERVICE
// ---------------------------------------------------------------------------
export const healthApi = {
  async check() {
    return await request("/health");
  },
};
