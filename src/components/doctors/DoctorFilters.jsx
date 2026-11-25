import React from "react";
import { Search, Filter, X } from "lucide-react";

export function DoctorFilters({
  searchQuery,
  setSearchQuery,
  selectedSpeciality,
  setSelectedSpeciality,
  onlyAvailable,
  setOnlyAvailable,
  specialities = [],
}) {
  return (
    <div className="bg-white rounded-xl border border-surface-border shadow-card p-4 space-y-3.5">
      {/* Top Search bar & Available Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-charcoal-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by doctor name, speciality or hospital..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-8 py-2 text-xs sm:text-sm rounded-lg border border-charcoal-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 placeholder:text-charcoal-400"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-charcoal-400 hover:text-charcoal-700"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Available Today Filter */}
        <label className="flex items-center gap-2 cursor-pointer select-none text-xs font-semibold text-charcoal-700 shrink-0">
          <input
            type="checkbox"
            checked={onlyAvailable}
            onChange={(e) => setOnlyAvailable(e.target.checked)}
            className="rounded border-charcoal-300 text-emerald-600 focus:ring-emerald-500 w-4 h-4 cursor-pointer"
          />
          Available Today Only
        </label>
      </div>

      {/* Speciality Filter Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
        <span className="text-[11px] font-bold text-charcoal-400 uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1">
          <Filter className="w-3 h-3" />
          Speciality:
        </span>
        {specialities.map((spec) => {
          const isSelected = selectedSpeciality === spec;
          return (
            <button
              key={spec}
              type="button"
              onClick={() => setSelectedSpeciality(spec)}
              className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-all ${
                isSelected
                  ? "bg-emerald-700 text-white shadow-2xs font-semibold"
                  : "bg-charcoal-50 text-charcoal-700 hover:bg-charcoal-100 hover:text-charcoal-900 border border-charcoal-200/70"
              }`}
            >
              {spec}
            </button>
          );
        })}
      </div>
    </div>
  );
}
