import React from "react";
import { Star, Calendar, Stethoscope, GraduationCap, MapPin, Check, Clock } from "lucide-react";
import { Button } from "../common/Button";

export function DoctorCard({ doctor, onSelectDoctor, onQuickBookSlot }) {
  const isAvailable = Boolean(doctor.is_available ?? doctor.status?.toLowerCase().includes("available"));

  return (
    <div className="bg-white rounded-2xl border border-surface-border shadow-card hover:shadow-elevated hover:border-emerald-300 transition-all duration-200 p-5 flex flex-col justify-between group">
      <div>
        {/* Top Meta: Availability & Rating */}
        <div className="flex items-center justify-between pb-3.5 border-b border-charcoal-100">
          <span
            className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full inline-flex items-center gap-1.5 ${
              isAvailable
                ? "bg-emerald-50 text-emerald-800 border border-emerald-200/80"
                : "bg-charcoal-100 text-charcoal-600 border border-charcoal-200"
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                isAvailable ? "bg-emerald-500 animate-pulse" : "bg-charcoal-400"
              }`}
            />
            {isAvailable ? "Available for Booking" : "Unavailable"}
          </span>

          <div className="flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/60">
            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            <span className="text-xs font-bold text-charcoal-800">{doctor.rating || 4.9}</span>
            <span className="text-[10px] text-charcoal-400">({doctor.reviewsCount || 120})</span>
          </div>
        </div>

        {/* Doctor Identity */}
        <div className="mt-4 flex items-start gap-3.5">
          <img
            src={doctor.avatar}
            alt={doctor.name}
            className="w-16 h-16 rounded-2xl object-cover border border-charcoal-200 shadow-2xs group-hover:scale-102 transition-transform shrink-0"
          />

          <div className="min-w-0 flex-1">
            <h3 className="text-base font-bold text-charcoal-900 group-hover:text-emerald-800 transition-colors leading-snug">
              {doctor.name}
            </h3>
            <p className="text-xs font-semibold text-emerald-700 flex items-center gap-1 mt-0.5">
              <Stethoscope className="w-3.5 h-3.5" />
              {doctor.speciality || doctor.specialty} Specialist
            </p>
            <p className="text-[11px] text-charcoal-500 mt-1 flex items-center gap-1 line-clamp-1">
              <GraduationCap className="w-3 h-3 text-charcoal-400 shrink-0" />
              {doctor.education || `Board Certified in ${doctor.specialty || "Medicine"}`}
            </p>
          </div>
        </div>

        {/* Hospital & Contact */}
        <div className="mt-3 text-xs text-charcoal-500 flex items-center gap-2">
          <span className="flex items-center gap-1 truncate">
            <MapPin className="w-3.5 h-3.5 text-charcoal-400 shrink-0" />
            {doctor.hospital || "MediVoice Medical Center"}
          </span>
          <span>•</span>
          <span className="shrink-0 font-medium text-charcoal-700">{doctor.experience || "10+ yrs exp"}</span>
        </div>

        {/* Consultation Fee */}
        <div className="mt-4 pt-3 border-t border-charcoal-100 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-charcoal-400 block">
              Consultation Fee
            </span>
            <span className="text-lg font-extrabold text-charcoal-900 font-mono">
              {doctor.currency || "$"}{doctor.consultationFee || 120}
            </span>
          </div>

          <span className="text-xs text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-medium">
            30-Min Consultation
          </span>
        </div>

        {/* Available Schedule Info Banner */}
        <div className="mt-3.5 bg-[#FAFBF9] rounded-xl p-3 border border-charcoal-200/70">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="font-semibold text-charcoal-700 flex items-center gap-1.5 text-[11px]">
              <Calendar className="w-3.5 h-3.5 text-emerald-600" />
              Working Hours
            </span>
            <span className="text-[10px] text-emerald-800 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/60">
              09:00 AM – 05:00 PM
            </span>
          </div>
          <p className="text-[11px] text-charcoal-500 leading-relaxed">
            Real-time appointment slots available daily in 30-minute intervals.
          </p>
        </div>
      </div>

      {/* Action Footer */}
      <div className="mt-4 pt-3 border-t border-charcoal-100">
        <Button
          variant="primary"
          size="sm"
          onClick={() => onSelectDoctor(doctor)}
          disabled={!isAvailable}
          className="w-full py-2 text-xs font-bold cursor-pointer"
        >
          {isAvailable ? "Select Date & Book Slot" : "Currently Unavailable"}
        </Button>
      </div>
    </div>
  );
}
