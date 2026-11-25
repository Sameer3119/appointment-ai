import React, { useState } from "react";
import {
  Calendar,
  Clock,
  Phone,
  User,
  Stethoscope,
  MapPin,
  AlertTriangle,
  XCircle,
  CheckCircle2,
  FileText,
  Loader2,
} from "lucide-react";
import { Modal } from "../common/Modal";
import { Button } from "../common/Button";
import { Badge } from "../common/Badge";
import { useApp } from "../../context/AppContext";

export function AppointmentDetailsModal({ appointment, isOpen, onClose }) {
  const { cancelAppointment } = useApp();
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [cancellationReason, setCancellationReason] = useState("Patient requested reschedule / cancellation");
  const [isCancelling, setIsCancelling] = useState(false);
  const [cancelError, setCancelError] = useState(null);

  if (!appointment) return null;

  const isConfirmed =
    appointment.status.toLowerCase() === "confirmed" ||
    appointment.status.toLowerCase() === "scheduled";

  const handleConfirmCancel = async () => {
    setIsCancelling(true);
    setCancelError(null);
    try {
      await cancelAppointment(appointment.id, cancellationReason);
      setShowCancelConfirm(false);
      onClose();
    } catch (err) {
      console.error("[MediVoice API] Cancellation failed:", err);
      setCancelError(err.message || "Failed to cancel appointment on backend.");
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        setShowCancelConfirm(false);
        setCancelError(null);
        onClose();
      }}
      title="Appointment Details"
      subtitle={`Booking Reference: #${String(appointment.id).toUpperCase()}`}
      maxWidth="max-w-xl"
    >
      <div className="space-y-5">
        {/* Top Status & Booking Channel Bar */}
        <div className="flex items-center justify-between pb-3 border-b border-charcoal-100">
          <Badge
            variant={
              isConfirmed
                ? "confirmed"
                : appointment.status.toLowerCase() === "cancelled"
                ? "cancelled"
                : "completed"
            }
            size="lg"
            dot
          >
            {appointment.status}
          </Badge>

          <span className="text-xs text-charcoal-500 flex items-center gap-1.5 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            Verified SQLite Record
          </span>
        </div>

        {/* Doctor Card */}
        <div className="bg-[#FAFBF9] border border-charcoal-200/80 rounded-2xl p-4 flex items-center gap-3.5">
          <img
            src={appointment.doctorAvatar}
            alt={appointment.doctorName}
            className="w-14 h-14 rounded-2xl object-cover border border-charcoal-200 shrink-0"
          />
          <div>
            <h4 className="text-sm sm:text-base font-bold text-charcoal-900 leading-tight">
              {appointment.doctorName}
            </h4>
            <p className="text-xs text-emerald-700 font-semibold flex items-center gap-1 mt-0.5">
              <Stethoscope className="w-3.5 h-3.5" />
              {appointment.speciality} Specialist
            </p>
            <p className="text-[11px] text-charcoal-500 mt-1 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-charcoal-400" />
              {appointment.room || "Suite 402, Consultation Wing"}
            </p>
          </div>
        </div>

        {/* Detailed Info Grid */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="p-3 bg-white border border-charcoal-200/80 rounded-xl">
            <span className="text-[10px] uppercase font-bold text-charcoal-400 block">
              Patient Name
            </span>
            <span className="font-semibold text-charcoal-900 mt-0.5 block">
              {appointment.patientName}
            </span>
          </div>

          <div className="p-3 bg-white border border-charcoal-200/80 rounded-xl">
            <span className="text-[10px] uppercase font-bold text-charcoal-400 block">
              Confirmation Phone
            </span>
            <span className="font-semibold text-charcoal-900 font-mono mt-0.5 block">
              {appointment.patientPhone}
            </span>
          </div>

          <div className="p-3 bg-white border border-charcoal-200/80 rounded-xl">
            <span className="text-[10px] uppercase font-bold text-charcoal-400 block">
              Date & Schedule
            </span>
            <span className="font-semibold text-charcoal-900 mt-0.5 block">
              {appointment.appointmentDate} at {appointment.appointmentTime}
            </span>
          </div>

          <div className="p-3 bg-white border border-charcoal-200/80 rounded-xl">
            <span className="text-[10px] uppercase font-bold text-charcoal-400 block">
              Consultation Fee
            </span>
            <span className="font-semibold text-charcoal-900 font-mono mt-0.5 block">
              ${appointment.consultationFee || 120} (Pay at clinic)
            </span>
          </div>
        </div>

        {/* Reason / Notes */}
        {appointment.reason && (
          <div className="p-3.5 bg-charcoal-50/60 rounded-xl border border-charcoal-200/70 text-xs">
            <span className="text-[10px] uppercase font-bold text-charcoal-400 block mb-1">
              Consultation Notes / Chief Complaint
            </span>
            <p className="text-charcoal-700 leading-relaxed">
              {appointment.reason}
            </p>
          </div>
        )}

        {/* Cancellation Notice if cancelled */}
        {appointment.status.toLowerCase() === "cancelled" && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 space-y-1">
            <div className="font-bold flex items-center gap-1.5">
              <XCircle className="w-4 h-4 text-rose-600" />
              Appointment Cancelled
            </div>
            <p className="text-[11px] text-rose-700">
              This slot has been released back to the clinic schedule.
            </p>
          </div>
        )}

        {/* Cancellation Error Banner */}
        {cancelError && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <span>{cancelError}</span>
          </div>
        )}

        {/* Cancellation confirmation sub-card */}
        {showCancelConfirm ? (
          <div className="p-4 bg-rose-50/80 border border-rose-200 rounded-xl space-y-3">
            <div className="flex items-start gap-2.5">
              <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <h5 className="text-xs font-bold text-rose-900">
                  Cancel this appointment with {appointment.doctorName}?
                </h5>
                <p className="text-[11px] text-rose-700 mt-0.5">
                  The appointment slot will be released back to the SQLite clinic schedule and will become available for other patients.
                </p>
              </div>
            </div>

            <input
              type="text"
              placeholder="Reason for cancellation (optional)"
              value={cancellationReason}
              onChange={(e) => setCancellationReason(e.target.value)}
              className="w-full px-3 py-1.5 text-xs rounded-lg border border-rose-300 bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/20"
            />

            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                type="button"
                disabled={isCancelling}
                onClick={() => setShowCancelConfirm(false)}
                className="px-3 py-1.5 text-xs font-semibold text-charcoal-700 bg-white rounded-lg border border-charcoal-200 cursor-pointer disabled:opacity-50"
              >
                Keep Appointment
              </button>
              <button
                type="button"
                disabled={isCancelling}
                onClick={handleConfirmCancel}
                className="px-3.5 py-1.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-xs cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
              >
                {isCancelling && <Loader2 className="w-3 h-3 animate-spin" />}
                {isCancelling ? "Cancelling..." : "Yes, Cancel Appointment"}
              </button>
            </div>
          </div>
        ) : (
          /* Action Footer */
          <div className="pt-2 flex items-center justify-between border-t border-charcoal-100">
            {isConfirmed ? (
              <Button
                variant="danger"
                size="sm"
                icon={XCircle}
                onClick={() => setShowCancelConfirm(true)}
              >
                Cancel Appointment
              </Button>
            ) : (
              <span className="text-xs text-charcoal-400">
                Archived Record
              </span>
            )}

            <Button variant="secondary" size="sm" onClick={onClose}>
              Close
            </Button>
          </div>
        )}
      </div>
    </Modal>
  );
}
