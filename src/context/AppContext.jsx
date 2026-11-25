import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import {
  CURRENT_PATIENT,
  INITIAL_PATIENT_NOTIFICATIONS,
} from "../services/mockData";
import { doctorsApi, appointmentsApi, healthApi } from "../services/api";

const AppContext = createContext(null);

const STORAGE_KEYS = {
  PATIENT_PROFILE: "medivoice_patient_profile_v2",
  SIDEBAR_COLLAPSED: "medivoice_sidebar_collapsed",
  RECENTLY_VIEWED: "medivoice_recently_viewed_doctors",
};

export function AppProvider({ children }) {
  // 1. Patient Profile State (persistent in localStorage so phone/name edits survive refresh)
  const [patient, setPatient] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PATIENT_PROFILE);
      return saved ? JSON.parse(saved) : CURRENT_PATIENT;
    } catch {
      return CURRENT_PATIENT;
    }
  });

  // 2. Doctors State (persisted in SQLite backend)
  const [doctors, setDoctors] = useState([]);
  const [loadingDoctors, setLoadingDoctors] = useState(true);
  const [doctorsError, setDoctorsError] = useState(null);

  // 3. Patient Appointments State (persisted in SQLite backend)
  const [appointments, setAppointments] = useState([]);
  const [loadingAppointments, setLoadingAppointments] = useState(true);
  const [appointmentsError, setAppointmentsError] = useState(null);

  // 4. Recently viewed doctors
  const [recentlyViewedIds, setRecentlyViewedIds] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.RECENTLY_VIEWED);
      return saved ? JSON.parse(saved) : [1, 2, 5];
    } catch {
      return [1, 2, 5];
    }
  });

  // 5. Patient Notifications
  const [notifications, setNotifications] = useState(INITIAL_PATIENT_NOTIFICATIONS);

  // 6. Highlighted newly booked appointment
  const [newlyBookedId, setNewlyBookedId] = useState(null);

  // 7. Booking Confirmation Modal State
  const [confirmationData, setConfirmationData] = useState(null);

  // 8. Voice Call Modal State
  const [isCallModalOpen, setIsCallModalOpen] = useState(false);
  const [voiceCallScenario, setVoiceCallScenario] = useState("booking"); // 'booking' | 'cancellation' | 'availability'

  // 9. Selected doctor speciality filter (for navigation from Home to Find Doctors)
  const [activeSpecialityFilter, setActiveSpecialityFilter] = useState("All");

  // 10. Navigation & UI state
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.SIDEBAR_COLLAPSED) === "true";
    } catch {
      return false;
    }
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // 11. Toast Notifications State
  const [toasts, setToasts] = useState([]);

  // 12. Backend connectivity state
  const [backendConnected, setBackendConnected] = useState(true);

  // Toast Helper
  const addToast = useCallback(({ title, message, type = "success", duration = 4000 }) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    setToasts((prev) => [...prev, { id, title, message, type }]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Persist patient profile changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PATIENT_PROFILE, JSON.stringify(patient));
    } catch (err) {
      console.error("Failed to save patient profile:", err);
    }
  }, [patient]);

  // Persist recently viewed doctors
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.RECENTLY_VIEWED, JSON.stringify(recentlyViewedIds));
    } catch {
      /* ignore */
    }
  }, [recentlyViewedIds]);

  // Persist sidebar state
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SIDEBAR_COLLAPSED, String(sidebarCollapsed));
    } catch {
      /* ignore */
    }
  }, [sidebarCollapsed]);

  // -------------------------------------------------------------------------
  // Fetch Doctors from SQLite Backend
  // -------------------------------------------------------------------------
  const fetchDoctors = useCallback(async ({ specialty } = {}) => {
    setLoadingDoctors(true);
    setDoctorsError(null);
    try {
      const data = await doctorsApi.getAll({ specialty });
      setDoctors(data);
      setBackendConnected(true);
      return data;
    } catch (err) {
      console.error("[MediVoice API] Failed to fetch doctors from backend:", err);
      setDoctorsError(err.message || "Unable to load doctors from backend server.");
      setBackendConnected(false);
      return [];
    } finally {
      setLoadingDoctors(false);
    }
  }, []);

  // -------------------------------------------------------------------------
  // Fetch Patient Appointments from SQLite Backend by Phone Number
  // -------------------------------------------------------------------------
  const fetchAppointments = useCallback(async (phoneOverride) => {
    const targetPhone = phoneOverride || patient.phone;
    if (!targetPhone) {
      setAppointments([]);
      setLoadingAppointments(false);
      return [];
    }

    setLoadingAppointments(true);
    setAppointmentsError(null);
    try {
      const data = await appointmentsApi.getByPhone(targetPhone);
      setAppointments(data);
      setBackendConnected(true);
      return data;
    } catch (err) {
      console.error("[MediVoice API] Failed to fetch appointments from backend:", err);
      setAppointmentsError(err.message || "Unable to load appointments from backend server.");
      setBackendConnected(false);
      return [];
    } finally {
      setLoadingAppointments(false);
    }
  }, [patient.phone]);

  // Initial Data Load on Mount
  useEffect(() => {
    fetchDoctors();
  }, [fetchDoctors]);

  // Reload appointments whenever patient phone changes
  useEffect(() => {
    if (patient.phone) {
      fetchAppointments(patient.phone);
    }
  }, [patient.phone, fetchAppointments]);

  // -------------------------------------------------------------------------
  // Book Appointment via Backend POST /appointments
  // -------------------------------------------------------------------------
  const addAppointment = async (appointmentInput) => {
    try {
      const payload = {
        doctorId: appointmentInput.doctorId || appointmentInput.doctor_id,
        appointmentDate: appointmentInput.appointmentDate || appointmentInput.date,
        appointmentTime: appointmentInput.appointmentTime || appointmentInput.time,
        patientPhone: appointmentInput.patientPhone || patient.phone,
        patientName: appointmentInput.patientName || patient.name,
        patientEmail: appointmentInput.patientEmail || patient.email || null,
        reason: appointmentInput.reason || `Consultation with ${appointmentInput.doctorName || "Doctor"}`,
        notes: appointmentInput.notes || null,
      };

      // Call backend API
      const createdApt = await appointmentsApi.create(payload);

      // Track newly booked ID
      setNewlyBookedId(createdApt.id);

      // Track recently viewed doctor
      if (payload.doctorId) {
        trackRecentlyViewed(payload.doctorId);
      }

      // Add in-app notification
      setNotifications((prev) => [
        {
          id: `notif-${Date.now()}`,
          title: "Appointment Confirmed",
          message: `Your booking with ${createdApt.doctorName} for ${createdApt.appointmentDate} at ${createdApt.appointmentTime} is confirmed.`,
          time: "Just now",
          unread: true,
        },
        ...prev,
      ]);

      // Show Toast
      addToast({
        title: "Appointment Successfully Booked!",
        message: `${createdApt.doctorName} • ${createdApt.appointmentDate} at ${createdApt.appointmentTime}`,
        type: "success",
      });

      // Refresh appointments from backend
      await fetchAppointments(patient.phone);

      // Trigger confirmation modal
      setConfirmationData(createdApt);

      return createdApt;
    } catch (err) {
      console.error("[MediVoice API] Error creating appointment:", err);
      addToast({
        title: "Booking Failed",
        message: err.message || "Failed to create appointment with backend.",
        type: "error",
      });
      throw err;
    }
  };

  // -------------------------------------------------------------------------
  // Cancel Appointment via Backend PATCH /appointments/{id}/cancel
  // -------------------------------------------------------------------------
  const cancelAppointment = async (appointmentId, reason = "Patient requested change") => {
    try {
      const updatedApt = await appointmentsApi.cancel(appointmentId);

      // Refresh appointments list from backend
      await fetchAppointments(patient.phone);

      // Add cancellation notification
      setNotifications((prev) => [
        {
          id: `notif-${Date.now()}`,
          title: "Appointment Cancelled",
          message: `Your appointment with ${updatedApt.doctorName} has been cancelled.`,
          time: "Just now",
          unread: true,
        },
        ...prev,
      ]);

      addToast({
        title: "Appointment Cancelled",
        message: `Your booking with ${updatedApt.doctorName} for ${updatedApt.appointmentDate} has been cancelled.`,
        type: "info",
      });

      return updatedApt;
    } catch (err) {
      console.error("[MediVoice API] Error cancelling appointment:", err);
      addToast({
        title: "Cancellation Failed",
        message: err.message || "Failed to cancel appointment on backend.",
        type: "error",
      });
      throw err;
    }
  };

  // Cancel by Doctor Name (for simulated voice assistant demo)
  const cancelAppointmentByDoctor = async (doctorName) => {
    const target = appointments.find(
      (a) =>
        (a.status.toLowerCase() === "confirmed" || a.status.toLowerCase() === "scheduled") &&
        a.doctorName.toLowerCase().includes(doctorName.toLowerCase())
    );
    if (target) {
      return await cancelAppointment(target.id, "Cancelled via MediVoice AI voice assistant");
    }
    return null;
  };

  // Track recently viewed doctor
  const trackRecentlyViewed = (doctorId) => {
    setRecentlyViewedIds((prev) => {
      const filtered = prev.filter((id) => id !== doctorId);
      return [doctorId, ...filtered].slice(0, 5);
    });
  };

  // Update Patient Profile
  const updatePatientProfile = (updates) => {
    setPatient((prev) => {
      const updated = { ...prev, ...updates };
      return updated;
    });

    addToast({
      title: "Profile Updated",
      message: "Your patient details have been saved.",
      type: "success",
    });

    // If phone number was changed, immediately fetch appointments for the new phone
    if (updates.phone && updates.phone !== patient.phone) {
      fetchAppointments(updates.phone);
    }
  };

  // Reset to default sample patient profile
  const resetToSampleData = () => {
    setPatient(CURRENT_PATIENT);
    setRecentlyViewedIds([1, 2, 5]);
    setNewlyBookedId(null);
    localStorage.removeItem(STORAGE_KEYS.PATIENT_PROFILE);
    localStorage.removeItem(STORAGE_KEYS.RECENTLY_VIEWED);
    fetchAppointments(CURRENT_PATIENT.phone);
    fetchDoctors();
    addToast({
      title: "Data Reset",
      message: "Restored initial patient demo profile.",
      type: "info",
    });
  };

  // Open call modal with a specific scenario ('booking' | 'cancellation' | 'availability')
  const openCallModalWithScenario = (scenario = "booking") => {
    setVoiceCallScenario(scenario);
    setIsCallModalOpen(true);
  };

  // Derived appointment categories for patient view
  const upcomingAppointments = appointments.filter(
    (a) => a.status.toLowerCase() === "confirmed" || a.status.toLowerCase() === "scheduled"
  );
  const completedAppointments = appointments.filter(
    (a) => a.status.toLowerCase() === "completed"
  );
  const cancelledAppointments = appointments.filter(
    (a) => a.status.toLowerCase() === "cancelled"
  );
  const nextUpcomingAppointment = upcomingAppointments[0] || null;

  // Recently viewed doctors objects
  const recentlyViewedDoctors = recentlyViewedIds
    .map((id) => doctors.find((d) => d.id === id || String(d.id) === String(id)))
    .filter(Boolean);

  const value = {
    patient,
    updatePatientProfile,
    doctors,
    setDoctors,
    loadingDoctors,
    doctorsError,
    fetchDoctors,
    appointments,
    loadingAppointments,
    appointmentsError,
    fetchAppointments,
    upcomingAppointments,
    completedAppointments,
    cancelledAppointments,
    nextUpcomingAppointment,
    recentlyViewedDoctors,
    trackRecentlyViewed,
    notifications,
    setNotifications,
    newlyBookedId,
    setNewlyBookedId,
    confirmationData,
    setConfirmationData,
    isCallModalOpen,
    setIsCallModalOpen,
    voiceCallScenario,
    setVoiceCallScenario,
    openCallModal: () => openCallModalWithScenario("booking"),
    openCallModalWithScenario,
    closeCallModal: () => setIsCallModalOpen(false),
    activeSpecialityFilter,
    setActiveSpecialityFilter,
    sidebarCollapsed,
    setSidebarCollapsed,
    toggleSidebar: () => setSidebarCollapsed((v) => !v),
    mobileMenuOpen,
    setMobileMenuOpen,
    toasts,
    addToast,
    removeToast,
    addAppointment,
    cancelAppointment,
    cancelAppointmentByDoctor,
    resetToSampleData,
    backendConnected,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
