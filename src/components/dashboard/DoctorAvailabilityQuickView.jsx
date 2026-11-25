import React from "react";
import { Link } from "react-router-dom";
import { Stethoscope, Clock, CheckCircle2, ChevronRight } from "lucide-react";
import { Badge } from "../common/Badge";

export function DoctorAvailabilityQuickView({ doctors = [], onSelectDoctor }) {
  return (
    <div className="bg-white rounded-xl border border-surface-border shadow-card p-5">
      <div className="flex items-center justify-between pb-3 border-b border-surface-border mb-4">
        <div>
          <h3 className="text-sm sm:text-base font-bold text-charcoal-900 tracking-tight">
            Doctor Availability
          </h3>
          <p className="text-xs text-charcoal-500 mt-0.5">
            Active medical specialists today
          </p>
        </div>
        <Link
          to="/doctors"
          className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 hover:underline"
        >
          View all doctors
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {doctors.slice(0, 6).map((doc) => {
          const isAvailable = doc.status.toLowerCase().includes("available");
          const nextSlot = doc.availableSlots?.[0]?.times?.[0] || "10:00 AM";

          return (
            <div
              key={doc.id}
              onClick={() => onSelectDoctor(doc)}
              className="p-3.5 rounded-xl border border-charcoal-200/80 bg-[#FAFBF9] hover:bg-white hover:border-emerald-300 hover:shadow-subtle transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div className="flex items-start gap-3">
                <img
                  src={doc.avatar}
                  alt={doc.name}
                  className="w-10 h-10 rounded-xl object-cover border border-charcoal-200 shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <h4 className="text-xs font-bold text-charcoal-900 group-hover:text-emerald-800 transition-colors truncate">
                    {doc.name}
                  </h4>
                  <p className="text-[11px] text-charcoal-600 font-medium truncate">
                    {doc.speciality}
                  </p>
                  <div className="flex items-center gap-1 text-[10px] text-charcoal-400 mt-0.5">
                    <span>{doc.experience}</span>
                    <span>•</span>
                    <span className="font-semibold text-charcoal-800 font-mono">
                      {doc.currency}{doc.consultationFee}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-3 pt-2.5 border-t border-charcoal-200/60 flex items-center justify-between text-[11px]">
                <span className="flex items-center gap-1 text-charcoal-600">
                  <Clock className="w-3 h-3 text-emerald-600" />
                  Next: <strong className="text-charcoal-900">{nextSlot}</strong>
                </span>

                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                    isAvailable
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-charcoal-100 text-charcoal-600"
                  }`}
                >
                  {doc.status}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
