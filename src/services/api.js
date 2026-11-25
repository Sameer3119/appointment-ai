/**
 * MediVoice AI - Backend Integration Service Layer
 * 
 * Prepared for Python FastAPI + Pipecat Voice Pipeline Backend.
 * 
 * Features:
 * - REST API endpoints for Doctors, Appointments, and Metrics.
 * - WebSocket & WebRTC abstraction for Pipecat real-time audio pipeline.
 * - Graceful fallback to local mock storage during frontend preview.
 */

import { INITIAL_DOCTORS, INITIAL_PATIENT_APPOINTMENTS } from "./mockData";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api/v1";
const WS_BASE_URL = import.meta.env.VITE_WS_BASE_URL || "ws://localhost:8000/ws";

// Standard Local Storage Keys for offline frontend state persistence
const STORAGE_KEYS = {
  APPOINTMENTS: "medivoice_appointments",
  DOCTORS: "medivoice_doctors",
  ACTIVITIES: "medivoice_activities",
  SETTINGS: "medivoice_settings",
};

/**
 * Generic HTTP Request wrapper for future FastAPI endpoints
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
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    // If backend is unreachable or not yet running, reject with descriptive error
    console.warn(`[MediVoice API] Backend request failed for ${endpoint}:`, error.message);
    throw error;
  }
}

// -------------------------------------------------------------
// 1. DOCTORS SERVICE
// -------------------------------------------------------------
export const doctorsApi = {
  /**
   * Fetch all doctors with their specialties and availability.
   * Future endpoint: GET /api/v1/doctors
   */
  async getAll() {
    try {
      return await request("/doctors");
    } catch {
      // Local fallback for demo
      const stored = localStorage.getItem(STORAGE_KEYS.DOCTORS);
      if (stored) {
        try { return JSON.parse(stored); } catch { /* ignore */ }
      }
      return INITIAL_DOCTORS;
    }
  },

  /**
   * Fetch doctor details by ID
   * Future endpoint: GET /api/v1/doctors/{doctorId}
   */
  async getById(doctorId) {
    try {
      return await request(`/doctors/${doctorId}`);
    } catch {
      const all = await this.getAll();
      return all.find((d) => d.id === doctorId) || null;
    }
  },

  /**
   * Fetch available appointment slots for a specific doctor & date
   * Future endpoint: GET /api/v1/doctors/{doctorId}/slots?date=YYYY-MM-DD
   */
  async getSlots(doctorId, date) {
    try {
      return await request(`/doctors/${doctorId}/slots?date=${encodeURIComponent(date)}`);
    } catch {
      const doctor = await this.getById(doctorId);
      if (!doctor) return [];
      const slotGroup = doctor.availableSlots.find((s) => s.date === date);
      return slotGroup ? slotGroup.times : [];
    }
  }
};

// -------------------------------------------------------------
// 2. APPOINTMENTS SERVICE
// -------------------------------------------------------------
export const appointmentsApi = {
  /**
   * Fetch all appointments with optional status & search filters
   * Future endpoint: GET /api/v1/appointments
   */
  async getAll() {
    try {
      return await request("/appointments");
    } catch {
      const stored = localStorage.getItem(STORAGE_KEYS.APPOINTMENTS);
      if (stored) {
        try { return JSON.parse(stored); } catch { /* ignore */ }
      }
      return INITIAL_PATIENT_APPOINTMENTS;
    }
  },

  /**
   * Book a new appointment
   * Future endpoint: POST /api/v1/appointments
   */
  async create(appointmentData) {
    try {
      return await request("/appointments", {
        method: "POST",
        body: JSON.stringify(appointmentData),
      });
    } catch {
      // Fallback local save
      const current = await this.getAll();
      const newAppointment = {
        id: `apt-${Date.now().toString().slice(-4)}`,
        status: "Confirmed",
        bookedVia: "Voice Assistant",
        createdAt: new Date().toISOString(),
        paymentStatus: "Pending at clinic",
        ...appointmentData,
      };
      const updated = [newAppointment, ...current];
      localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(updated));
      return newAppointment;
    }
  },

  /**
   * Cancel an existing appointment
   * Future endpoint: PATCH /api/v1/appointments/{id}/cancel
   */
  async cancel(appointmentId, reason = "Patient request") {
    try {
      return await request(`/appointments/${appointmentId}/cancel`, {
        method: "PATCH",
        body: JSON.stringify({ reason }),
      });
    } catch {
      const current = await this.getAll();
      const updated = current.map((apt) =>
        apt.id === appointmentId
          ? { ...apt, status: "Cancelled", cancellationReason: reason }
          : apt
      );
      localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(updated));
      return { success: true, id: appointmentId };
    }
  },

  /**
   * Get appointment analytics & statistics
   * Future endpoint: GET /api/v1/appointments/stats
   */
  async getStats() {
    try {
      return await request("/appointments/stats");
    } catch {
      const list = await this.getAll();
      const confirmed = list.filter((a) => a.status === "Confirmed").length;
      const cancelled = list.filter((a) => a.status === "Cancelled").length;
      const completed = list.filter((a) => a.status === "Completed").length;
      return {
        total: list.length,
        confirmed,
        cancelled,
        completed,
        availableDoctors: INITIAL_DOCTORS.filter(
          (d) => d.status.toLowerCase().includes("available")
        ).length,
      };
    }
  }
};

// -------------------------------------------------------------
// 3. PIPECAT VOICE PIPELINE WEBSOCKET & WEBRTC SERVICE
// -------------------------------------------------------------
/**
 * Real-time Voice Session Manager for Pipecat backend.
 * Provides hooks for WebRTC audio tracks and WebSocket transcripts.
 */
export class VoicePipelineSession {
  constructor(options = {}) {
    this.sessionId = null;
    this.ws = null;
    this.peerConnection = null;
    this.onTranscript = options.onTranscript || (() => {});
    this.onStateChange = options.onStateChange || (() => {});
    this.onAudioVolume = options.onAudioVolume || (() => {});
    this.onError = options.onError || (() => {});
  }

  /**
   * Connect to the Pipecat FastAPI backend
   * Future implementation will establish WebRTC peer connection and WebSocket event stream
   */
  async start({ patientPhone, language = "en" } = {}) {
    this.onStateChange("connecting");

    // When the real backend is running, this calls POST /api/v1/voice/session
    // to negotiate SDP tokens and WebSocket credentials for Pipecat.
    try {
      const sessionConfig = await request("/voice/session", {
        method: "POST",
        body: JSON.stringify({ patientPhone, language }),
      });
      this.sessionId = sessionConfig.sessionId;
      this.connectWebSocket(sessionConfig.wsUrl);
    } catch {
      // Backend not yet running; caller will handle simulation fallback
      this.onStateChange("ready_for_simulation");
    }
  }

  /**
   * Establish WebSocket connection for real-time transcript streaming
   */
  connectWebSocket(url = `${WS_BASE_URL}/voice-events`) {
    try {
      this.ws = new WebSocket(url);
      
      this.ws.onopen = () => {
        this.onStateChange("connected");
      };

      this.ws.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data);
          // Format expected from Pipecat:
          // { type: 'transcript', sender: 'ai' | 'patient', text: string, isFinal: boolean }
          if (payload.type === "transcript") {
            this.onTranscript(payload);
          } else if (payload.type === "volume") {
            this.onAudioVolume(payload.level);
          }
        } catch (err) {
          console.error("Failed to parse WS voice event:", err);
        }
      };

      this.ws.onerror = (err) => {
        this.onError(err);
      };

      this.ws.onclose = () => {
        this.onStateChange("ended");
      };
    } catch (err) {
      this.onError(err);
    }
  }

  /**
   * Gracefully terminate the call session
   */
  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    if (this.peerConnection) {
      this.peerConnection.close();
      this.peerConnection = null;
    }
    this.onStateChange("ended");
  }
}
