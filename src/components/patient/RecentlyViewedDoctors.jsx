import React from "react";
import { Link } from "react-router-dom";
import { Clock, Star, Calendar, ChevronRight, Stethoscope } from "lucide-react";
import { Button } from "../common/Button";

export function RecentlyViewedDoctors({ doctors = [], onSelectDoctor }) {
  if (!doctors.length) return null;

  return (
    <div className="space-y-3.5">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-charcoal-900 tracking-tight">
            Top Rated Specialists
          </h3>
          <p className="text-xs text-charcoal-500 mt-0.5">
            Verified doctors ready for same-day and upcoming appointments
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {doctors.slice(0, 3).map((doc) => {
          const isAvail = Boolean(doc.is_available ?? doc.status?.toLowerCase().includes("available"));

          return (
            <div
              key={doc.id}
              className="bg-white rounded-xl border border-surface-border p-4.5 shadow-card hover:border-emerald-300 hover:shadow-subtle transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start gap-3">
                  <img
                    src={doc.avatar}
                    alt={doc.name}
                    className="w-13 h-13 rounded-xl object-cover border border-charcoal-200 shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <h4 className="text-sm font-bold text-charcoal-900 group-hover:text-emerald-800 transition-colors truncate">
                      {doc.name}
                    </h4>
                    <p className="text-xs font-semibold text-emerald-700 truncate">
                      {doc.speciality || doc.specialty}
                    </p>
                    <div className="flex items-center gap-1 text-[11px] text-charcoal-500 mt-1">
                      <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                      <strong className="text-charcoal-800">{doc.rating || 4.9}</strong>
                      <span>({doc.reviewsCount || 120} reviews)</span>
                    </div>
                  </div>
                </div>

                <div className="mt-3.5 pt-3 border-t border-charcoal-100 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-charcoal-400 block">
                      Fee
                    </span>
                    <span className="font-extrabold text-charcoal-900 font-mono">
                      {doc.currency || "$"}{doc.consultationFee || 120}
                    </span>
                  </div>

                  <span
                    className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${
                      isAvail
                        ? "text-emerald-800 bg-emerald-50 border-emerald-200/60"
                        : "text-charcoal-600 bg-charcoal-100 border-charcoal-200"
                    }`}
                  >
                    {isAvail ? "Available" : "Unavailable"}
                  </span>
                </div>

                {/* Open slot preview */}
                <div className="mt-3 bg-[#FAFBF9] p-2.5 rounded-lg border border-charcoal-200/60 text-xs flex items-center justify-between">
                  <div className="text-[11px] text-charcoal-600 font-medium flex items-center gap-1">
                    <Clock className="w-3 h-3 text-emerald-600" />
                    <span>09:00 AM – 05:00 PM</span>
                  </div>
                  <span className="text-[10px] text-emerald-800 font-semibold bg-emerald-50 px-2 py-0.5 rounded">
                    30-Min Slots
                  </span>
                </div>
              </div>

              <div className="mt-3.5 pt-2 border-t border-charcoal-100">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => onSelectDoctor(doc)}
                  className="w-full text-xs font-semibold cursor-pointer"
                >
                  View Open Slots
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
