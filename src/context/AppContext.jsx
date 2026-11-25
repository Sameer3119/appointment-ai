import React, { createContext, useContext, useState, useEffect } from "react";
import {
  CURRENT_PATIENT,
  INITIAL_DOCTORS,
  INITIAL_PATIENT_APPOINTMENTS,
  INITIAL_PATIENT_NOTIFICATIONS,
} from "../services/mockData";

const AppContext = createContext(null);

const STORAGE_KEYS = {
  PATIENT_APPOINTMENTS: "medivoice_patient_appointments_v2",
  PATIENT_PROFILE: "medivoice_patient_profile_v2",
  DOCTORS: "medivoice_doctors_v2",
  SIDEBAR_COLLAPSED: "medivoice_sidebar_collapsed",
  RECENTLY_VIEWED: "medivoice_recently_viewed_doctors",
};

export function AppProvider({ children }) {
  // 1. Patient Profile State
  const [patient, setPatient] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PATIENT_PROFILE);
      return saved ? JSON.parse(saved) : CURRENT_PATIENT;
    } catch {
      return CURRENT_PATIENT;
    }
  });

  // 2. Doctors State
  const [doctors, setDoctors] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.DOCTORS);
      return saved ? JSON.parse(saved) : INITIAL_DOCTORS;
    } catch {
      return INITIAL_DOCTORS;
    }
  });

  // 3. Patient Appointments State
  const [appointments, setAppointments] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PATIENT_APPOINTMENTS);
      return saved ? JSON.parse(saved) : INITIAL_PATIENT_APPOINTMENTS;
    } catch {
      return INITIAL_PATIENT_APPOINTMENTS;
    }
  });

  // 4. Recently viewed doctors
  const [recentlyViewedIds, setRecentlyViewedIds] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.RECENTLY_VIEWED);
      return saved ? JSON.parse(saved) : ["doc-1", "doc-2", "doc-5"];
    } catch {
      return ["doc-1", "doc-2", "doc-5"];
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

  // Persist appointments changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PATIENT_APPOINTMENTS, JSON.stringify(appointments));
    } catch (err) {
      console.error("Failed to save patient appointments:", err);
    }
  }, [appointments]);

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

  // Toast Helper
  const addToast = ({ title, message, type = "success", duration = 4000 }) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    setToasts((prev) => [...prev, { id, title, message, type }]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
    return id;
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Add Appointment (from Voice AI or Doctor Slot Picker)
  const addAppointment = (appointmentInput) => {
    const id = `apt-${Date.now().toString().slice(-4)}`;
    const newAppointment = {
      id,
      patientName: patient.name,
      patientPhone: appointmentInput.patientPhone || patient.phone,
      patientEmail: patient.email,
      doctorId: appointmentInput.doctorId || "doc-1",
      doctorName: appointmentInput.doctorName || "Dr. Rajesh Sharma",
      doctorAvatar: appointmentInput.doctorAvatar || "https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=300&auto=format&fit=crop",
      speciality: appointmentInput.speciality || "Cardiology",
      appointmentDate: appointmentInput.appointmentDate || "2026-11-26",
      appointmentTime: appointmentInput.appointmentTime || "10:00 AM",
      status: "Confirmed",
      bookedVia: appointmentInput.bookedVia || "Talk to MediVoice AI",
      consultationFee: appointmentInput.consultationFee || 120,
      paymentStatus: "Pay at Clinic",
      room: "Suite 402, Consultation Wing",
      reason: appointmentInput.reason || "Scheduled via MediVoice AI Assistant",
      createdAt: new Date().toISOString(),
      isNewlyCreated: true,
    };

    setAppointments((prev) => [newAppointment, ...prev]);
    setNewlyBookedId(id);

    // Track recently viewed doctor
    if (appointmentInput.doctorId) {
      trackRecentlyViewed(appointmentInput.doctorId);
    }

    // Add in-app notification
    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        title: "Appointment Confirmed",
        message: `Your booking with ${newAppointment.doctorName} for ${newAppointment.appointmentDate} at ${newAppointment.appointmentTime} is confirmed.`,
        time: "Just now",
        unread: true,
      },
      ...prev,
    ]);

    // Show Toast
    addToast({
      title: "Appointment Successfully Booked!",
      message: `${newAppointment.doctorName} • ${newAppointment.appointmentDate} at ${newAppointment.appointmentTime}`,
      type: "success",
    });

    // Trigger confirmation card modal
    setConfirmationData(newAppointment);

    return newAppointment;
  };

  // Cancel Appointment
  const cancelAppointment = (appointmentId, reason = "Patient requested change") => {
    let cancelledApt = null;

    setAppointments((prev) =>
      prev.map((apt) => {
        if (apt.id === appointmentId) {
          cancelledApt = { ...apt, status: "Cancelled", cancellationReason: reason };
          return cancelledApt;
        }
        return apt;
      })
    );

    if (cancelledApt) {
      // Add cancellation notification
      setNotifications((prev) => [
        {
          id: `notif-${Date.now()}`,
          title: "Appointment Cancelled",
          message: `Your appointment with ${cancelledApt.doctorName} has been cancelled.`,
          time: "Just now",
          unread: true,
        },
        ...prev,
      ]);

      addToast({
        title: "Appointment Cancelled",
        message: `Your booking with ${cancelledApt.doctorName} has been cancelled.`,
        type: "info",
      });
    }
  };

  // Cancel by Doctor Name (for simulated voice assistant cancellation flow)
  const cancelAppointmentByDoctor = (doctorName) => {
    const target = appointments.find(
      (a) => a.status === "Confirmed" && a.doctorName.toLowerCase().includes(doctorName.toLowerCase())
    );
    if (target) {
      cancelAppointment(target.id, "Cancelled via MediVoice AI voice assistant");
      return target;
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
    setPatient((prev) => ({ ...prev, ...updates }));
    addToast({
      title: "Profile Updated",
      message: "Your patient details have been saved.",
      type: "success",
    });
  };

  // Reset to default sample mock data
  const resetToSampleData = () => {
    setAppointments(INITIAL_PATIENT_APPOINTMENTS);
    setDoctors(INITIAL_DOCTORS);
    setPatient(CURRENT_PATIENT);
    setRecentlyViewedIds(["doc-1", "doc-2", "doc-5"]);
    setNewlyBookedId(null);
    localStorage.removeItem(STORAGE_KEYS.PATIENT_APPOINTMENTS);
    localStorage.removeItem(STORAGE_KEYS.PATIENT_PROFILE);
    localStorage.removeItem(STORAGE_KEYS.DOCTORS);
    localStorage.removeItem(STORAGE_KEYS.RECENTLY_VIEWED);
    addToast({
      title: "Data Reset",
      message: "Restored initial patient demo dataset.",
      type: "info",
    });
  };

  // Open call modal with a specific scenario ('booking' | 'cancellation' | 'availability')
  const openCallModalWithScenario = (scenario = "booking") => {
    setVoiceCallScenario(scenario);
    setIsCallModalOpen(true);
  };

  // Derived appointment categories for patient view
  const upcomingAppointments = appointments.filter((a) => a.status === "Confirmed");
  const completedAppointments = appointments.filter((a) => a.status === "Completed");
  const cancelledAppointments = appointments.filter((a) => a.status === "Cancelled");
  const nextUpcomingAppointment = upcomingAppointments[0] || null;

  // Recently viewed doctors objects
  const recentlyViewedDoctors = recentlyViewedIds
    .map((id) => doctors.find((d) => d.id === id))
    .filter(Boolean);

  const value = {
    patient,
    updatePatientProfile,
    doctors,
    setDoctors,
    appointments,
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
