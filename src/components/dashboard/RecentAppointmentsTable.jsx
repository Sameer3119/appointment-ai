import React from "react";
import { Link } from "react-router-dom";
import { Calendar, Clock, ChevronRight, Stethoscope } from "lucide-react";
import { Badge } from "../common/Badge";
import { cn } from "../../utils/cn";

export function RecentAppointmentsTable({ appointments = [], onViewDetails }) {
  return (
    <div className="bg-white rounded-xl border border-surface-border shadow-card overflow-hidden">
      <div className="px-5 py-4 border-b border-surface-border flex items-center justify-between">
        <div>
          <h3 className="text-sm sm:text-base font-bold text-charcoal-900 tracking-tight">
            Recent Appointments
          </h3>
          <p className="text-xs text-charcoal-500 mt-0.5">
            Real-time consultation bookings
          </p>
        </div>
        <Link
          to="/appointments"
          className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 hover:underline"
        >
          View all
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs sm:text-sm">
          <thead className="bg-[#FAFBF9] border-b border-surface-border text-[11px] font-semibold text-charcoal-500 uppercase tracking-wider">
            <tr>
              <th className="px-5 py-3">Patient</th>
              <th className="px-5 py-3">Doctor & Speciality</th>
              <th className="px-5 py-3">Schedule</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-border">
            {appointments.slice(0, 5).map((apt) => (
              <tr
                key={apt.id}
                className={cn(
                  "hover:bg-[#F9FAF8] transition-colors group",
                  apt.isNewlyCreated && "bg-emerald-50/40"
                )}
              >
                {/* Patient */}
                <td className="px-5 py-3.5">
                  <div className="font-semibold text-charcoal-900">
                    {apt.patientName}
                  </div>
                  <div className="text-[11px] font-mono text-charcoal-500">
                    {apt.patientPhone}
                  </div>
                </td>

                {/* Doctor */}
                <td className="px-5 py-3.5">
                  <div className="font-medium text-charcoal-900">
                    {apt.doctorName}
                  </div>
                  <div className="text-[11px] text-emerald-800 font-medium">
                    {apt.speciality}
                  </div>
                </td>

                {/* Schedule */}
                <td className="px-5 py-3.5">
                  <div className="text-charcoal-900 font-medium flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-charcoal-400" />
                    {apt.appointmentDate}
                  </div>
                  <div className="text-[11px] text-charcoal-500 flex items-center gap-1.5 mt-0.5">
                    <Clock className="w-3 h-3 text-charcoal-400" />
                    {apt.appointmentTime}
                  </div>
                </td>

                {/* Status */}
                <td className="px-5 py-3.5">
                  <Badge
                    variant={
                      apt.status.toLowerCase() === "confirmed"
                        ? "confirmed"
                        : apt.status.toLowerCase() === "cancelled"
                        ? "cancelled"
                        : "completed"
                    }
                    dot
                  >
                    {apt.status}
                  </Badge>
                </td>

                {/* Action */}
                <td className="px-5 py-3.5 text-right">
                  <button
                    type="button"
                    onClick={() => onViewDetails(apt)}
                    className="text-xs font-semibold text-charcoal-600 hover:text-emerald-700 bg-charcoal-50 hover:bg-emerald-50 px-2.5 py-1 rounded-md border border-charcoal-200 hover:border-emerald-200 transition-colors"
                  >
                    Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
