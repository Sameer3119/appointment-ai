import React from "react";
import { Link } from "react-router-dom";
import {
  Calendar,
  Clock,
  MapPin,
  Stethoscope,
  ChevronRight,
  PhoneCall,
  CheckCircle2,
} from "lucide-react";
import { Badge } from "../common/Badge";
import { Button } from "../common/Button";

export function UpcomingAppointmentCard({
  appointment,
  onViewDetails,
  onTalkToAI,
}) {
  if (!appointment) {
    return (
      <div className="bg-white rounded-2xl border border-surface-border p-6 shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-charcoal-500 uppercase tracking-wider">
            <Calendar className="w-3.5 h-3.5 text-emerald-600" />
            Your Next Consultation
          </div>
          <h3 className="text-base font-bold text-charcoal-900">
            No upcoming appointments scheduled
          </h3>
          <p className="text-xs text-charcoal-500 max-w-md">
            Need to consult a specialist or schedule a follow-up? Speak to MediVoice AI or browse our specialists to book in seconds.
          </p>
        </div>
        <div className="flex items-center gap-2.5 shrink-0">
          <Button
            variant="primary"
            size="sm"
            onClick={onTalkToAI}
            icon={PhoneCall}
          >
            Talk to MediVoice AI
          </Button>
          <Link to="/doctors">
            <Button variant="secondary" size="sm">
              Find Doctors
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-emerald-50/90 via-white to-emerald-50/40 rounded-2xl border border-emerald-200/80 p-5 sm:p-6 shadow-card relative overflow-hidden">
      {/* Top Tag & Status */}
      <div className="flex items-center justify-between pb-3.5 border-b border-emerald-100">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
          <span className="text-xs font-bold text-emerald-900 uppercase tracking-wider">
            Upcoming Consultation
          </span>
        </div>
        <Badge variant="confirmed" dot>
          {appointment.status || "Confirmed"}
        </Badge>
      </div>

      {/* Main Appointment Body */}
      <div className="mt-4 flex flex-col md:flex-row md:items-center justify-between gap-5">
        {/* Doctor Info */}
        <div className="flex items-start gap-4">
          <img
            src={appointment.doctorAvatar}
            alt={appointment.doctorName}
            className="w-14 h-14 rounded-2xl object-cover border-2 border-white shadow-2xs shrink-0"
          />
          <div>
            <h3 className="text-base sm:text-lg font-bold text-charcoal-900 leading-tight">
              {appointment.doctorName}
            </h3>
            <p className="text-xs font-semibold text-emerald-800 flex items-center gap-1.5 mt-0.5">
              <Stethoscope className="w-3.5 h-3.5" />
              {appointment.speciality} Specialist
            </p>
            <p className="text-xs text-charcoal-500 mt-1 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-charcoal-400" />
              {appointment.room || "Suite 402, Consultation Wing"}
            </p>
          </div>
        </div>

        {/* Schedule Highlights */}
        <div className="flex items-center gap-3 text-xs bg-white/90 p-3 rounded-xl border border-emerald-200/60 shadow-2xs">
          <div className="flex items-center gap-2 pr-3 border-r border-emerald-100">
            <Calendar className="w-4 h-4 text-emerald-700 shrink-0" />
            <div>
              <span className="text-[10px] uppercase font-bold text-charcoal-400 block">
                Date
              </span>
              <span className="font-bold text-charcoal-900">
                {appointment.appointmentDate}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-emerald-700 shrink-0" />
            <div>
              <span className="text-[10px] uppercase font-bold text-charcoal-400 block">
                Time Slot
              </span>
              <span className="font-bold text-charcoal-900">
                {appointment.appointmentTime}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Actions Footer */}
      <div className="mt-4 pt-3.5 border-t border-emerald-100 flex flex-col sm:flex-row items-center justify-between gap-3">
        <span className="text-xs text-charcoal-600 flex items-center gap-1.5 self-start sm:self-auto">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          SMS reminder dispatched • Fee: ${appointment.consultationFee || 120} ({appointment.paymentStatus || "Pay at clinic"})
        </span>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onViewDetails(appointment)}
            className="flex-1 sm:flex-none text-xs"
          >
            View Details
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={onTalkToAI}
            icon={PhoneCall}
            className="flex-1 sm:flex-none text-xs"
          >
            Manage via AI
          </Button>
        </div>
      </div>
    </div>
  );
}
