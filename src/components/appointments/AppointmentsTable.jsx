import React from "react";
import {
  Calendar,
  Clock,
  Phone,
  Eye,
  XCircle,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  MoreVertical,
} from "lucide-react";
import { Badge } from "../common/Badge";
import { cn } from "../../utils/cn";

export function AppointmentsTable({
  appointments = [],
  newlyBookedId,
  onViewDetails,
  onCancelAppointment,
}) {
  if (appointments.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-surface-border p-12 text-center">
        <div className="w-12 h-12 bg-charcoal-100 rounded-full flex items-center justify-center mx-auto text-charcoal-400 mb-3">
          <Calendar className="w-6 h-6" />
        </div>
        <h4 className="text-base font-bold text-charcoal-900">
          No appointments found
        </h4>
        <p className="text-xs text-charcoal-500 max-w-sm mx-auto mt-1">
          No appointments match your search or filter criteria. Try adjusting your filters or book a new appointment via Voice AI.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-surface-border shadow-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs sm:text-sm">
          <thead className="bg-[#FAFBF9] border-b border-surface-border text-[11px] font-semibold text-charcoal-500 uppercase tracking-wider">
            <tr>
              <th className="px-5 py-3.5">Patient Details</th>
              <th className="px-5 py-3.5">Doctor Name</th>
              <th className="px-5 py-3.5">Speciality</th>
              <th className="px-5 py-3.5">Appointment Date</th>
              <th className="px-5 py-3.5">Appointment Time</th>
              <th className="px-5 py-3.5">Status</th>
              <th className="px-5 py-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-border">
            {appointments.map((apt) => {
              const isNewlyBooked = apt.id === newlyBookedId || apt.isNewlyCreated;
              const isConfirmed = apt.status.toLowerCase() === "confirmed";
              const isCancelled = apt.status.toLowerCase() === "cancelled";
              const isCompleted = apt.status.toLowerCase() === "completed";

              return (
                <tr
                  key={apt.id}
                  className={cn(
                    "hover:bg-[#F9FAF8] transition-colors group",
                    isNewlyBooked && "bg-emerald-50/50 ring-1 ring-emerald-400/40"
                  )}
                >
                  {/* Patient phone number & name */}
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-charcoal-900 font-mono">
                        {apt.patientPhone}
                      </span>
                      {isNewlyBooked && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded animate-pulse">
                          <Sparkles className="w-2.5 h-2.5" />
                          New
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-charcoal-500 mt-0.5 font-medium">
                      {apt.patientName}
                    </div>
                  </td>

                  {/* Doctor Name */}
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={
                          apt.doctorAvatar ||
                          "https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=120&auto=format&fit=crop"
                        }
                        alt={apt.doctorName}
                        className="w-7 h-7 rounded-full object-cover border border-charcoal-200"
                      />
                      <span className="font-medium text-charcoal-900">
                        {apt.doctorName}
                      </span>
                    </div>
                  </td>

                  {/* Speciality */}
                  <td className="px-5 py-3.5">
                    <span className="text-xs font-semibold text-emerald-800 bg-emerald-50/70 border border-emerald-200/50 px-2 py-0.5 rounded-md">
                      {apt.speciality}
                    </span>
                  </td>

                  {/* Appointment Date */}
                  <td className="px-5 py-3.5">
                    <span className="text-charcoal-800 font-medium flex items-center gap-1.5 text-xs">
                      <Calendar className="w-3.5 h-3.5 text-charcoal-400" />
                      {apt.appointmentDate}
                    </span>
                  </td>

                  {/* Appointment Time */}
                  <td className="px-5 py-3.5">
                    <span className="text-charcoal-800 font-medium flex items-center gap-1.5 text-xs">
                      <Clock className="w-3.5 h-3.5 text-charcoal-400" />
                      {apt.appointmentTime}
                    </span>
                  </td>

                  {/* Status Badge */}
                  <td className="px-5 py-3.5">
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
                      {apt.status}
                    </Badge>
                  </td>

                  {/* Actions */}
                  <td className="px-5 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => onViewDetails(apt)}
                        className="p-1.5 rounded-lg text-charcoal-500 hover:text-emerald-700 hover:bg-emerald-50 border border-charcoal-200/70 hover:border-emerald-200 transition-colors"
                        title="View Full Appointment Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      {isConfirmed && (
                        <button
                          type="button"
                          onClick={() => onCancelAppointment(apt)}
                          className="p-1.5 rounded-lg text-charcoal-500 hover:text-rose-600 hover:bg-rose-50 border border-charcoal-200/70 hover:border-rose-200 transition-colors"
                          title="Cancel Appointment"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
