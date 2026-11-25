import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Stethoscope, Sparkles } from "lucide-react";
import { useApp } from "../../context/AppContext";

export function QuickDoctorSearch() {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const { setActiveSpecialityFilter } = useApp();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      setActiveSpecialityFilter("All");
      navigate(`/doctors?q=${encodeURIComponent(searchTerm.trim())}`);
    } else {
      navigate("/doctors");
    }
  };

  const quickPills = ["Cardiologist", "Dermatologist", "Neurologist", "General Medicine"];

  return (
    <div className="bg-white rounded-2xl border border-surface-border p-5 sm:p-6 shadow-card space-y-4">
      <div className="space-y-1">
        <h3 className="text-sm font-bold text-charcoal-900 uppercase tracking-wider flex items-center gap-1.5">
          <Search className="w-4 h-4 text-emerald-700" />
          Quick Doctor & Speciality Search
        </h3>
        <p className="text-xs text-charcoal-500">
          Find doctors by name, health symptom, or medical speciality
        </p>
      </div>

      <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2.5">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-charcoal-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by doctor name (e.g. Dr. Sharma) or symptom (e.g. skin rash, heart)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl border border-charcoal-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 placeholder:text-charcoal-400 bg-[#FAFBF9]"
          />
        </div>

        <button
          type="submit"
          className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs sm:text-sm transition-colors shadow-xs cursor-pointer"
        >
          Search Doctors
        </button>
      </form>

      {/* Suggested Quick Searches */}
      <div className="flex items-center gap-2 flex-wrap text-xs text-charcoal-500 pt-1">
        <span className="text-[11px] font-semibold text-charcoal-400">Popular:</span>
        {quickPills.map((pill) => (
          <button
            key={pill}
            type="button"
            onClick={() => {
              navigate(`/doctors?q=${encodeURIComponent(pill)}`);
            }}
            className="px-2.5 py-1 rounded-full bg-charcoal-50 hover:bg-emerald-50 hover:text-emerald-800 text-charcoal-700 text-[11px] font-medium border border-charcoal-200/70 transition-colors cursor-pointer"
          >
            {pill}
          </button>
        ))}
      </div>
    </div>
  );
}
