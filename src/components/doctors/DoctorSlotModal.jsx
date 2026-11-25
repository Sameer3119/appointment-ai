import React, { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  Phone,
  User,
  Star,
  CheckCircle2,
  Stethoscope,
  MapPin,
  Sparkles,
  GraduationCap,
} from "lucide-react";
import { Modal } from "../common/Modal";
import { Button } from "../common/Button";
import { useApp } from "../../context/AppContext";

export function DoctorSlotModal({ doctor, isOpen, onClose }) {
  const { addAppointment, patient, trackRecentlyViewed } = useApp();

  const [selectedDateIndex, setSelectedDateIndex] = useState(0);
  const [selectedTime, setSelectedTime] = useState("");
  const [patientName, setPatientName] = useState(patient.name);
  const [patientPhone, setPatientPhone] = useState(patient.phone);
  const [patientNotes, setPatientNotes] = useState("");

  useEffect(() => {
    if (patient) {
      setPatientName(patient.name);
      setPatientPhone(patient.phone);
    }
  }, [patient]);

  useEffect(() => {
    if (doctor) {
      trackRecentlyViewed(doctor.id);
    }
  }, [doctor]);

  if (!doctor) return null;

  const slotGroup = doctor.availableSlots?.[selectedDateIndex] || doctor.availableSlots?.[0];
  const activeDate = slotGroup?.date || "2026-11-25";

  const handleConfirmBooking = (e) => {
    e.preventDefault();
    if (!selectedTime) return;

    addAppointment({
      patientName: patientName || patient.name,
      patientPhone: patientPhone || patient.phone,
      doctorId: doctor.id,
      doctorName: doctor.name,
      doctorAvatar: doctor.avatar,
      speciality: doctor.speciality,
      appointmentDate: activeDate,
      appointmentTime: selectedTime,
      consultationFee: doctor.consultationFee,
      bookedVia: "Find Doctors",
      reason: patientNotes || `Consultation with ${doctor.name}`,
    });

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Book Doctor Appointment"
      subtitle={`Choose a preferred date and time to consult with ${doctor.name}`}
      maxWidth="max-w-2xl"
    >
      <div className="space-y-6">
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
                {doctor.speciality} Specialist
              </p>
              <div className="flex items-center gap-2 text-xs text-charcoal-500 mt-1">
                <span className="flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  <strong className="text-charcoal-800">{doctor.rating}</strong> ({doctor.reviewsCount})
                </span>
                <span>•</span>
                <span>{doctor.experience}</span>
              </div>
            </div>
          </div>

          <div className="text-left sm:text-right border-t sm:border-t-0 pt-2 sm:pt-0 border-charcoal-200">
            <span className="text-[10px] uppercase font-bold text-charcoal-400 block">
              Consultation Fee
            </span>
            <span className="text-xl font-black text-charcoal-900 font-mono">
              {doctor.currency}{doctor.consultationFee}
            </span>
            <span className="text-[11px] text-emerald-800 font-medium block mt-0.5">
              Pay at Clinic or Insurance
            </span>
          </div>
        </div>

        {/* Date Selector Tabs */}
        <div>
          <label className="text-xs font-bold text-charcoal-700 uppercase tracking-wider block mb-2">
            1. Select Preferred Date
          </label>
          <div className="grid grid-cols-3 gap-2.5">
            {doctor.availableSlots?.map((slot, idx) => (
              <button
                key={slot.date}
                type="button"
                onClick={() => {
                  setSelectedDateIndex(idx);
                  setSelectedTime("");
                }}
                className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                  selectedDateIndex === idx
                    ? "bg-emerald-50 border-emerald-600 text-emerald-950 font-bold shadow-2xs ring-1 ring-emerald-600"
                    : "bg-white border-charcoal-200 text-charcoal-700 hover:bg-charcoal-50 font-medium"
                }`}
              >
                <div className="text-xs">{slot.label}</div>
                <div className="text-[11px] text-charcoal-500 font-normal mt-0.5 font-mono">
                  {slot.times.length} slots open
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Available Time Slots */}
        <div>
          <label className="text-xs font-bold text-charcoal-700 uppercase tracking-wider block mb-2">
            2. Select Consultation Time
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {slotGroup?.times?.map((time) => {
              const isSelected = selectedTime === time;
              return (
                <button
                  key={time}
                  type="button"
                  onClick={() => setSelectedTime(time)}
                  className={`py-2.5 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    isSelected
                      ? "bg-emerald-700 text-white border-emerald-700 shadow-sm"
                      : "bg-white text-charcoal-800 border-charcoal-200 hover:border-emerald-300 hover:bg-emerald-50/50"
                  }`}
                >
                  <Clock className={`w-3.5 h-3.5 ${isSelected ? "text-white" : "text-emerald-600"}`} />
                  {time}
                </button>
              );
            })}
          </div>
        </div>

        {/* Patient Details Form */}
        <form onSubmit={handleConfirmBooking} className="space-y-4 pt-2 border-t border-charcoal-100">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-charcoal-700 uppercase tracking-wider block">
              3. Patient Information
            </label>
            <span className="text-[11px] text-charcoal-500">
              Pre-filled from your profile
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-charcoal-600 block mb-1">
                Patient Name
              </label>
              <input
                type="text"
                required
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-charcoal-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 bg-white"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-charcoal-600 block mb-1">
                Phone Number (for SMS & Voice Confirmation)
              </label>
              <input
                type="tel"
                required
                value={patientPhone}
                onChange={(e) => setPatientPhone(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-charcoal-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 font-mono bg-white"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-charcoal-600 block mb-1">
              Reason for Visit / Symptoms (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Follow-up consultation, mild chest tightness, routine screening..."
              value={patientNotes}
              onChange={(e) => setPatientNotes(e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-charcoal-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2.5">
            <Button variant="secondary" onClick={onClose}>
              Cancel
            </Button>

            <Button
              type="submit"
              variant="primary"
              disabled={!selectedTime}
              icon={CheckCircle2}
              className="px-6 cursor-pointer"
            >
              {selectedTime
                ? `Confirm Booking (${selectedTime})`
                : "Select a time slot"}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
