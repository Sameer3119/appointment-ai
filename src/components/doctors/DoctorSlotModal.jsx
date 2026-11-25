import React, { useState, useEffect, useCallback } from "react";
import {
  Calendar,
  Clock,
  Phone,
  User,
  Star,
  CheckCircle2,
  Stethoscope,
  MapPin,
  AlertCircle,
  Loader2,
  Mail,
  FileText,
} from "lucide-react";
import { Modal } from "../common/Modal";
import { Button } from "../common/Button";
import { useApp } from "../../context/AppContext";
import { doctorsApi, formatTime12h } from "../../services/api";

// Helper to generate next N days formatted as YYYY-MM-DD
function getNextDays(count = 5) {
  const days = [];
  const now = new Date();
  for (let i = 0; i < count; i++) {
    const d = new Date(now);
    d.setDate(now.getDate() + i);
    const dateStr = d.toISOString().split("T")[0];

    let label = "";
    if (i === 0) {
      label = `Today (${d.toLocaleDateString("en-US", { month: "short", day: "numeric" })})`;
    } else if (i === 1) {
      label = `Tomorrow (${d.toLocaleDateString("en-US", { month: "short", day: "numeric" })})`;
    } else {
      label = d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
    }

    days.push({ date: dateStr, label });
  }
  return days;
}

export function DoctorSlotModal({ doctor, isOpen, onClose }) {
  const { addAppointment, patient, trackRecentlyViewed } = useApp();

  const days = getNextDays(5);
  const [selectedDateIndex, setSelectedDateIndex] = useState(0);
  const [selectedTime, setSelectedTime] = useState("");

  // Patient form fields
  const [patientName, setPatientName] = useState(patient?.name || "");
  const [patientPhone, setPatientPhone] = useState(patient?.phone || "");
  const [patientEmail, setPatientEmail] = useState(patient?.email || "");
  const [patientNotes, setPatientNotes] = useState("");

  // Live availability states
  const [slots, setSlots] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [slotsError, setSlotsError] = useState(null);

  // Booking submission states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingError, setBookingError] = useState(null);

  // Sync patient info from profile
  useEffect(() => {
    if (patient) {
      setPatientName(patient.name || "");
      setPatientPhone(patient.phone || "");
      setPatientEmail(patient.email || "");
    }
  }, [patient]);

  // Track recently viewed doctor
  useEffect(() => {
    if (doctor) {
      trackRecentlyViewed(doctor.id);
    }
  }, [doctor, trackRecentlyViewed]);

  const activeDay = days[selectedDateIndex] || days[0];
  const activeDate = activeDay?.date;

  // -------------------------------------------------------------------------
  // Fetch real available slots from SQLite backend whenever date or doctor changes
  // -------------------------------------------------------------------------
  const fetchLiveSlots = useCallback(async () => {
    if (!doctor || !activeDate) return;

    setLoadingSlots(true);
    setSlotsError(null);
    setSelectedTime("");
    try {
      const data = await doctorsApi.getAvailability(doctor.id, activeDate);
      setSlots(data.slots || []);
      setAvailableSlots(data.available_slots || []);
    } catch (err) {
      console.error("[MediVoice API] Failed to fetch slots for doctor:", err);
      setSlotsError(err.message || "Failed to load live availability from backend.");
      setSlots([]);
      setAvailableSlots([]);
    } finally {
      setLoadingSlots(false);
    }
  }, [doctor, activeDate]);

  useEffect(() => {
    if (isOpen && doctor) {
      fetchLiveSlots();
      setBookingError(null);
    }
  }, [isOpen, doctor, activeDate, fetchLiveSlots]);

  if (!doctor) return null;

  // -------------------------------------------------------------------------
  // Handle Booking Submission to Backend
  // -------------------------------------------------------------------------
  const handleConfirmBooking = async (e) => {
    e.preventDefault();
    if (!selectedTime || isSubmitting) return;

    setBookingError(null);
    setIsSubmitting(true);

    try {
      await addAppointment({
        doctorId: doctor.id,
        doctorName: doctor.name,
        speciality: doctor.speciality || doctor.specialty,
        appointmentDate: activeDate,
        appointmentTime: selectedTime,
        patientName: patientName.trim(),
        patientPhone: patientPhone.trim(),
        patientEmail: patientEmail.trim() || null,
        reason: patientNotes.trim() || `Consultation with ${doctor.name}`,
      });

      // Close modal on success (BookingConfirmationModal will pop up via AppContext)
      onClose();
    } catch (err) {
      console.error("[MediVoice API] Booking submission failed:", err);
      // Display specific backend validation error (400, 404, 409)
      setBookingError(err.message || "Booking failed. Please choose an alternative slot.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Book Doctor Appointment"
      subtitle={`Choose a preferred date and time to consult with ${doctor.name}`}
      maxWidth="max-w-2xl"
    >
      <div className="space-y-5">
        {/* Doctor Summary Header */}
        <div className="bg-[#FAFBF9] border border-charcoal-200/80 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <img
              src={doctor.avatar}
              alt={doctor.name}
              className="w-14 h-14 rounded-2xl object-cover border border-charcoal-200 shadow-2xs shrink-0"
            />
            <div>
              <h3 className="text-base font-bold text-charcoal-900 leading-tight">
                {doctor.name}
              </h3>
              <p className="text-xs font-semibold text-emerald-700 flex items-center gap-1 mt-0.5">
                <Stethoscope className="w-3.5 h-3.5" />
                {doctor.speciality || doctor.specialty} Specialist
              </p>
              <div className="flex items-center gap-2 text-xs text-charcoal-500 mt-1">
                <span className="flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  <strong className="text-charcoal-800">{doctor.rating || 4.9}</strong> ({doctor.reviewsCount || 120})
                </span>
                <span>•</span>
                <span>{doctor.experience || "10+ yrs experience"}</span>
              </div>
            </div>
          </div>

          <div className="text-left sm:text-right border-t sm:border-t-0 pt-2 sm:pt-0 border-charcoal-200">
            <span className="text-[10px] uppercase font-bold text-charcoal-400 block">
              Consultation Fee
            </span>
            <span className="text-xl font-black text-charcoal-900 font-mono">
              {doctor.currency || "$"}{doctor.consultationFee || 120}
            </span>
            <span className="text-[11px] text-emerald-800 font-medium block mt-0.5">
              30-Minute Consultation
            </span>
          </div>
        </div>

        {/* 1. Date Selector Tabs */}
        <div>
          <label className="text-xs font-bold text-charcoal-700 uppercase tracking-wider block mb-2">
            1. Select Preferred Date
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {days.map((day, idx) => (
              <button
                key={day.date}
                type="button"
                onClick={() => {
                  setSelectedDateIndex(idx);
                  setSelectedTime("");
                  setBookingError(null);
                }}
                className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                  selectedDateIndex === idx
                    ? "bg-emerald-50 border-emerald-600 text-emerald-950 font-bold shadow-2xs ring-1 ring-emerald-600"
                    : "bg-white border-charcoal-200 text-charcoal-700 hover:bg-charcoal-50 font-medium"
                }`}
              >
                <div className="text-xs font-semibold">{day.label}</div>
                <div className="text-[10px] text-charcoal-400 font-mono mt-0.5">
                  {day.date}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* 2. Available Time Slots from Backend */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold text-charcoal-700 uppercase tracking-wider block">
              2. Select Consultation Slot (30 mins)
            </label>
            <span className="text-[11px] font-semibold text-emerald-800 font-mono">
              {availableSlots.length} slots available on {activeDate}
            </span>
          </div>

          {loadingSlots && (
            <div className="p-6 bg-charcoal-50 rounded-xl text-center border border-charcoal-200">
              <Loader2 className="w-5 h-5 text-emerald-600 animate-spin mx-auto mb-1.5" />
              <span className="text-xs text-charcoal-600 font-medium">Checking live doctor availability...</span>
            </div>
          )}

          {!loadingSlots && slotsError && (
            <div className="p-4 bg-rose-50 rounded-xl text-center border border-rose-200 text-xs text-rose-700">
              {slotsError}
            </div>
          )}

          {!loadingSlots && !slotsError && slots.length === 0 && (
            <div className="p-6 bg-charcoal-50 rounded-xl text-center border border-charcoal-200 text-xs text-charcoal-600">
              No consultation slots available for this doctor on the selected date.
            </div>
          )}

          {!loadingSlots && !slotsError && slots.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 max-h-52 overflow-y-auto pr-1">
              {slots.map((slot) => {
                const isSelected = selectedTime === slot.start_time;
                const isFree = slot.is_available;
                const formattedTime = formatTime12h(slot.start_time);

                return (
                  <button
                    key={slot.start_time}
                    type="button"
                    disabled={!isFree}
                    onClick={() => {
                      if (isFree) {
                        setSelectedTime(slot.start_time);
                        setBookingError(null);
                      }
                    }}
                    className={`py-2 px-2.5 rounded-xl border text-xs font-semibold flex items-center justify-between transition-all ${
                      isSelected
                        ? "bg-emerald-700 text-white border-emerald-700 shadow-sm ring-2 ring-emerald-600 cursor-pointer"
                        : isFree
                        ? "bg-white text-charcoal-800 border-charcoal-200 hover:border-emerald-400 hover:bg-emerald-50/50 cursor-pointer"
                        : "bg-charcoal-100 text-charcoal-400 border-charcoal-200/60 cursor-not-allowed opacity-60 line-through"
                    }`}
                  >
                    <span className="flex items-center gap-1">
                      <Clock className={`w-3 h-3 ${isSelected ? "text-white" : isFree ? "text-emerald-600" : "text-charcoal-400"}`} />
                      {formattedTime}
                    </span>
                    {!isFree && (
                      <span className="text-[9px] font-bold text-rose-600 uppercase tracking-tighter not-line-through">
                        Booked
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Backend Booking Error Notification Banner */}
        {bookingError && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2.5 text-xs text-rose-800 animate-shake">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block">Booking Conflict / Error:</span>
              <span>{bookingError}</span>
            </div>
          </div>
        )}

        {/* 3. Patient Details Form */}
        <form onSubmit={handleConfirmBooking} className="space-y-4 pt-3 border-t border-charcoal-100">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-charcoal-700 uppercase tracking-wider block">
              3. Patient Details
            </label>
            <span className="text-[11px] text-charcoal-500">
              Verified against clinic records
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-charcoal-600 block mb-1">
                Full Name *
              </label>
              <div className="relative">
                <User className="w-3.5 h-3.5 text-charcoal-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  required
                  placeholder="e.g. John Anderson"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 text-xs sm:text-sm rounded-lg border border-charcoal-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 bg-white"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-charcoal-600 block mb-1">
                Phone Number * (Unique Patient Key)
              </label>
              <div className="relative">
                <Phone className="w-3.5 h-3.5 text-charcoal-400 absolute left-3 top-2.5" />
                <input
                  type="tel"
                  required
                  placeholder="e.g. +1-555-234-8901"
                  value={patientPhone}
                  onChange={(e) => setPatientPhone(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 text-xs sm:text-sm rounded-lg border border-charcoal-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 font-mono bg-white"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-charcoal-600 block mb-1">
                Email Address (Optional)
              </label>
              <div className="relative">
                <Mail className="w-3.5 h-3.5 text-charcoal-400 absolute left-3 top-2.5" />
                <input
                  type="email"
                  placeholder="e.g. patient@example.com"
                  value={patientEmail}
                  onChange={(e) => setPatientEmail(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 text-xs sm:text-sm rounded-lg border border-charcoal-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 bg-white"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-charcoal-600 block mb-1">
                Reason for Visit (Optional)
              </label>
              <div className="relative">
                <FileText className="w-3.5 h-3.5 text-charcoal-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="e.g. Routine checkup, chest tightness..."
                  value={patientNotes}
                  onChange={(e) => setPatientNotes(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 text-xs sm:text-sm rounded-lg border border-charcoal-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 bg-white"
                />
              </div>
            </div>
          </div>

          <div className="pt-3 flex items-center justify-end gap-2.5">
            <Button variant="secondary" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>

            <Button
              type="submit"
              variant="primary"
              disabled={!selectedTime || isSubmitting}
              icon={isSubmitting ? Loader2 : CheckCircle2}
              className={`px-6 cursor-pointer ${isSubmitting ? "opacity-80" : ""}`}
            >
              {isSubmitting
                ? "Reserving Slot..."
                : selectedTime
                ? `Confirm Booking (${formatTime12h(selectedTime)})`
                : "Select an available slot"}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
