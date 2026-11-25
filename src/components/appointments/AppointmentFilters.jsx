import React from "react";
import { Search, Calendar, Filter, X } from "lucide-react";

export function AppointmentFilters({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  dateFilter,
  setDateFilter,
  counts = {},
}) {
  const statusOptions = [
    { label: "All Appointments", value: "all", count: counts.total || 0 },
    { label: "Confirmed", value: "confirmed", count: counts.confirmed || 0 },
    { label: "Cancelled", value: "cancelled", count: counts.cancelled || 0 },
    { label: "Completed", value: "completed", count: counts.completed || 0 },
  ];

  return (
    <div className="bg-white rounded-xl border border-surface-border shadow-card p-4 space-y-3.5">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-charcoal-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by phone number, patient name, doctor or speciality..."
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

        {/* Date Filter Dropdown */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-charcoal-200 bg-[#FAFBF9] text-xs">
            <Calendar className="w-3.5 h-3.5 text-charcoal-500" />
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="bg-transparent border-0 font-medium text-charcoal-800 focus:outline-none cursor-pointer"
            >
              <option value="all">All Dates</option>
              <option value="2026-11-25">Today (Nov 25)</option>
              <option value="2026-11-26">Tomorrow (Nov 26)</option>
              <option value="2026-11-24">Past (Nov 24)</option>
              <option value="2026-11-23">Past (Nov 23)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        {statusOptions.map((opt) => {
          const isSelected = statusFilter === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => setStatusFilter(opt.value)}
              className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-all flex items-center gap-2 ${
                isSelected
                  ? "bg-emerald-700 text-white shadow-2xs font-semibold"
                  : "bg-charcoal-50 text-charcoal-700 hover:bg-charcoal-100 border border-charcoal-200/70"
              }`}
            >
              <span>{opt.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  isSelected ? "bg-white/20 text-white" : "bg-charcoal-200 text-charcoal-700"
                }`}
              >
                {opt.count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
