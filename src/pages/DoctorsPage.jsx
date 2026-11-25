import React, { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Stethoscope, AlertTriangle, RefreshCw, Loader2 } from "lucide-react";
import { DoctorCard } from "../components/doctors/DoctorCard";
import { DoctorSlotModal } from "../components/doctors/DoctorSlotModal";
import { DoctorFilters } from "../components/doctors/DoctorFilters";
import { useApp } from "../context/AppContext";

export function DoctorsPage() {
  const {
    doctors,
    loadingDoctors,
    doctorsError,
    fetchDoctors,
    activeSpecialityFilter,
    setActiveSpecialityFilter,
  } = useApp();
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

  // Extract unique specialities from real backend doctors
  const specialities = useMemo(() => {
    const specs = doctors.map((d) => d.speciality || d.specialty).filter(Boolean);
    const list = ["All", ...new Set(specs)];
    return list;
  }, [doctors]);

  // Filter doctors locally based on search, active speciality, and availability
  const filteredDoctors = useMemo(() => {
    return doctors.filter((doc) => {
      const docSpec = (doc.speciality || doc.specialty || "").toLowerCase();
      const docName = (doc.name || "").toLowerCase();
      const docHospital = (doc.hospital || "").toLowerCase();
      const docAbout = (doc.about || "").toLowerCase();
      const q = searchQuery.toLowerCase().trim();

      const matchSearch =
        q === "" ||
        docName.includes(q) ||
        docSpec.includes(q) ||
        docHospital.includes(q) ||
        docAbout.includes(q);

      const matchSpeciality =
        activeSpecialityFilter === "All" ||
        (doc.speciality || doc.specialty) === activeSpecialityFilter;

      const isAvail = Boolean(doc.is_available ?? doc.status?.toLowerCase().includes("available"));
      const matchAvailable = !onlyAvailable || isAvail;

      return matchSearch && matchSpeciality && matchAvailable;
    });
  }, [doctors, searchQuery, activeSpecialityFilter, onlyAvailable]);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-charcoal-900 tracking-tight">
            Find Doctors & Specialists
          </h2>
          <p className="text-xs sm:text-sm text-charcoal-500 mt-0.5">
            Browse certified healthcare specialists, check live 30-minute consultation slots, and book directly.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200/70">
            {doctors.length} Verified Specialists
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

      {/* Loading State */}
      {loadingDoctors && (
        <div className="bg-white rounded-2xl border border-surface-border p-12 text-center shadow-card">
          <Loader2 className="w-8 h-8 text-emerald-600 animate-spin mx-auto mb-3" />
          <h4 className="text-sm font-bold text-charcoal-800">Loading Doctors from Database...</h4>
          <p className="text-xs text-charcoal-500 mt-1">Fetching certified specialists from SQLite backend.</p>
        </div>
      )}

      {/* Error State */}
      {!loadingDoctors && doctorsError && (
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-6 text-center space-y-3">
          <AlertTriangle className="w-8 h-8 text-rose-600 mx-auto" />
          <div>
            <h4 className="text-sm font-bold text-rose-900">Failed to Load Doctors</h4>
            <p className="text-xs text-rose-700 max-w-md mx-auto mt-1">{doctorsError}</p>
          </div>
          <button
            type="button"
            onClick={() => fetchDoctors()}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Retry Connection
          </button>
        </div>
      )}

      {/* Doctors Grid */}
      {!loadingDoctors && !doctorsError && (
        <>
          {filteredDoctors.length === 0 ? (
            <div className="bg-white rounded-2xl border border-surface-border p-12 text-center shadow-card">
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
                />
              ))}
            </div>
          )}
        </>
      )}

      {/* Full Schedule & Slot Picker Modal with Live Backend Slots */}
      <DoctorSlotModal
        doctor={selectedDoctor}
        isOpen={Boolean(selectedDoctor)}
        onClose={() => setSelectedDoctor(null)}
      />
    </div>
  );
}
