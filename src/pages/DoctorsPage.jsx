import React, { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Stethoscope, Sparkles } from "lucide-react";
import { DoctorCard } from "../components/doctors/DoctorCard";
import { DoctorSlotModal } from "../components/doctors/DoctorSlotModal";
import { DoctorFilters } from "../components/doctors/DoctorFilters";
import { useApp } from "../context/AppContext";

export function DoctorsPage() {
  const { doctors, addAppointment, activeSpecialityFilter, setActiveSpecialityFilter } = useApp();
  const [searchParams] = useSearchParams();

  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [onlyAvailable, setOnlyAvailable] = useState(false);

  // Sync with search param if navigated from Quick Search (?q=...)
  useEffect(() => {
    const q = searchParams.get("q");
    if (q) {
      setSearchQuery(q);
    }
  }, [searchParams]);

  // Extract unique specialities
  const specialities = useMemo(() => {
    const list = ["All", ...new Set(doctors.map((d) => d.speciality))];
    return list;
  }, [doctors]);

  // Filter doctors
  const filteredDoctors = useMemo(() => {
    return doctors.filter((doc) => {
      const matchSearch =
        searchQuery.trim() === "" ||
        doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.speciality.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.hospital.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.about.toLowerCase().includes(searchQuery.toLowerCase());

      const matchSpeciality =
        activeSpecialityFilter === "All" || doc.speciality === activeSpecialityFilter;

      const matchAvailable =
        !onlyAvailable || doc.status.toLowerCase().includes("available");

      return matchSearch && matchSpeciality && matchAvailable;
    });
  }, [doctors, searchQuery, activeSpecialityFilter, onlyAvailable]);

  // Quick book slot directly from card
  const handleQuickBookSlot = (doctor, date, time) => {
    addAppointment({
      doctorId: doctor.id,
      doctorName: doctor.name,
      doctorAvatar: doctor.avatar,
      speciality: doctor.speciality,
      appointmentDate: date,
      appointmentTime: time,
      consultationFee: doctor.consultationFee,
      bookedVia: "Find Doctors",
      reason: `Direct slot reservation with ${doctor.name}`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-charcoal-900 tracking-tight">
            Find Doctors & Specialists
          </h2>
          <p className="text-xs sm:text-sm text-charcoal-500 mt-0.5">
            Browse certified healthcare providers, view available consultation slots, and book in seconds.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200/70">
            {filteredDoctors.length} Specialists Available
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <DoctorFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedSpeciality={activeSpecialityFilter}
        setSelectedSpeciality={setActiveSpecialityFilter}
        onlyAvailable={onlyAvailable}
        setOnlyAvailable={setOnlyAvailable}
        specialities={specialities}
      />

      {/* Doctors Grid */}
      {filteredDoctors.length === 0 ? (
        <div className="bg-white rounded-2xl border border-surface-border p-12 text-center">
          <Stethoscope className="w-8 h-8 text-charcoal-300 mx-auto mb-2" />
          <h4 className="text-base font-bold text-charcoal-900">
            No doctors match your search
          </h4>
          <p className="text-xs text-charcoal-500 max-w-sm mx-auto mt-1">
            Try resetting your search query or selecting "All" specialities to view all available medical specialists.
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setActiveSpecialityFilter("All");
              setOnlyAvailable(false);
            }}
            className="mt-4 px-4 py-2 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-lg border border-emerald-200 hover:bg-emerald-100 transition-colors cursor-pointer"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredDoctors.map((doctor) => (
            <DoctorCard
              key={doctor.id}
              doctor={doctor}
              onSelectDoctor={(doc) => setSelectedDoctor(doc)}
              onQuickBookSlot={handleQuickBookSlot}
            />
          ))}
        </div>
      )}

      {/* Full Schedule & Slot Picker Modal */}
      <DoctorSlotModal
        doctor={selectedDoctor}
        isOpen={Boolean(selectedDoctor)}
        onClose={() => setSelectedDoctor(null)}
      />
    </div>
  );
}
