import React from "react";
import {
  Calendar,
  Clock,
  MapPin,
  Stethoscope,
  PhoneCall,
  XCircle,
  Eye,
  Sparkles,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { Badge } from "../common/Badge";
import { Button } from "../common/Button";
import { cn } from "../../utils/cn";

export function PatientAppointmentCard({
  appointment,
  isNewlyBooked,
  onViewDetails,
  onCancelAppointment,
  onTalkToAI,
}) {
  const isConfirmed = appointment.status.toLowerCase() === "confirmed";
  const isCancelled = appointment.status.toLowerCase() === "cancelled";
  const isCompleted = appointment.status.toLowerCase() === "completed";

  return (
    <div
      className={cn(
        "bg-white rounded-2xl border border-surface-border p-5 shadow-card hover:shadow-elevated transition-all flex flex-col justify-between group",
        isNewlyBooked && "ring-2 ring-emerald-500 bg-emerald-50/20"
      )}
    >
      <div>
        {/* Top Header: Schedule Date & Status Badge */}
        <div className="flex items-center justify-between pb-3.5 border-b border-charcoal-100">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-charcoal-800 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-emerald-700" />
              {appointment.appointmentDate}
            </span>
            <span className="text-charcoal-300">•</span>
            <span className="text-xs font-semibold text-charcoal-700 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-emerald-700" />
              {appointment.appointmentTime}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {isNewlyBooked && (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full animate-pulse">
                <Sparkles className="w-2.5 h-2.5" />
                Just Booked
              </span>
            )}
            <Badge
              variant={
                isConfirmed
                  ? "confirmed"
                  : isCancelled
                  ? "cancelled"
                  : "completed"
              }
              dot
            >
              {appointment.status}
            </Badge>
          </div>
        </div>

        {/* Doctor Identity */}
        <div className="mt-4 flex items-start gap-3.5">
          <img
            src={appointment.doctorAvatar}
            alt={appointment.doctorName}
            className="w-14 h-14 rounded-2xl object-cover border border-charcoal-200 shrink-0 shadow-2xs"
          />

          <div className="min-w-0 flex-1">
            <h3 className="text-base font-bold text-charcoal-900 leading-snug group-hover:text-emerald-800 transition-colors">
              {appointment.doctorName}
            </h3>
            <p className="text-xs font-semibold text-emerald-700 flex items-center gap-1 mt-0.5">
              <Stethoscope className="w-3.5 h-3.5" />
              {appointment.speciality} Specialist
            </p>
            <p className="text-[11px] text-charcoal-500 mt-1 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-charcoal-400 shrink-0" />
              {appointment.room || "Suite 402, Consultation Wing"}
            </p>
          </div>
        </div>

        {/* Reason / Notes */}
        {appointment.reason && (
          <div className="mt-3.5 bg-[#FAFBF9] p-3 rounded-xl border border-charcoal-200/70 text-xs text-charcoal-700">
            <span className="text-[10px] font-bold text-charcoal-400 uppercase tracking-wider block mb-0.5">
              Reason for Visit
            </span>
            <p className="line-clamp-2 leading-relaxed">
              {appointment.reason}
            </p>
          </div>
        )}

        {/* Cancellation Notice */}
        {isCancelled && appointment.cancellationReason && (
          <div className="mt-3 bg-rose-50 p-2.5 rounded-xl border border-rose-200/80 text-xs text-rose-800">
            <span className="font-semibold block text-[11px]">Cancellation Note:</span>
            <p className="text-[11px] text-rose-700 mt-0.5">
              {appointment.cancellationReason}
            </p>
          </div>
        )}

        {/* Meta Bar: Fee & Booking Method */}
        <div className="mt-3.5 pt-3 border-t border-charcoal-100 flex items-center justify-between text-xs">
          <div>
            <span className="text-[10px] uppercase font-bold text-charcoal-400 block">
              Consultation Fee
            </span>
            <span className="font-extrabold text-charcoal-900 font-mono">
              ${appointment.consultationFee || 120} ({appointment.paymentStatus || "Pay at clinic"})
            </span>
          </div>

          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-charcoal-400 block">
              Booked Via
            </span>
            <span className="font-semibold text-charcoal-700">
              {appointment.bookedVia || "MediVoice AI"}
            </span>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="mt-4 pt-3 border-t border-charcoal-100 flex items-center justify-between gap-2">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => onViewDetails(appointment)}
          icon={Eye}
          className="text-xs flex-1 cursor-pointer"
        >
          View Details
        </Button>

        {isConfirmed && (
          <Button
            variant="danger"
            size="sm"
            onClick={() => onCancelAppointment(appointment)}
            icon={XCircle}
            className="text-xs cursor-pointer"
          >
            Cancel
          </Button>
        )}

        {isConfirmed && (
          <Button
            variant="outline"
            size="sm"
            onClick={onTalkToAI}
            icon={PhoneCall}
            className="text-xs cursor-pointer"
            title="Manage or reschedule using MediVoice AI"
          >
            AI Assist
          </Button>
        )}
      </div>
    </div>
  );
}
