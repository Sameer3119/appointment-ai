import React from "react";
import { useNavigate } from "react-router-dom";
import {
  HeartPulse,
  Sparkles,
  Brain,
  Activity,
  Stethoscope,
  Wind,
  ChevronRight,
} from "lucide-react";
import { SPECIALITIES } from "../../services/mockData";
import { useApp } from "../../context/AppContext";

export function SpecialityBrowser() {
  const navigate = useNavigate();
  const { setActiveSpecialityFilter } = useApp();

  const getIcon = (iconName) => {
    switch (iconName) {
      case "HeartPulse":
        return <HeartPulse className="w-5 h-5 text-emerald-700" />;
      case "Sparkles":
        return <Sparkles className="w-5 h-5 text-emerald-700" />;
      case "Brain":
        return <Brain className="w-5 h-5 text-emerald-700" />;
      case "Activity":
        return <Activity className="w-5 h-5 text-emerald-700" />;
      case "Wind":
        return <Wind className="w-5 h-5 text-emerald-700" />;
      default:
        return <Stethoscope className="w-5 h-5 text-emerald-700" />;
    }
  };

  const handleSelectSpeciality = (specName) => {
    setActiveSpecialityFilter(specName);
    navigate("/doctors");
  };

  return (
    <div className="space-y-3.5">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-charcoal-900 tracking-tight">
            Browse by Medical Speciality
          </h3>
          <p className="text-xs text-charcoal-500 mt-0.5">
            Select a department to view certified specialists and open consultation slots
          </p>
        </div>
        <button
          onClick={() => {
            setActiveSpecialityFilter("All");
            navigate("/doctors");
          }}
          className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 hover:underline cursor-pointer"
        >
          View all
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {SPECIALITIES.map((spec) => (
          <div
            key={spec.id}
            onClick={() => handleSelectSpeciality(spec.name)}
            className="p-3.5 rounded-xl border border-charcoal-200/80 bg-white hover:bg-emerald-50/50 hover:border-emerald-300 hover:shadow-subtle transition-all cursor-pointer group flex flex-col justify-between text-left"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200/60 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                {getIcon(spec.iconName)}
              </div>
              <h4 className="text-xs sm:text-sm font-bold text-charcoal-900 group-hover:text-emerald-800 transition-colors leading-tight">
                {spec.name}
              </h4>
              <p className="text-[11px] text-charcoal-500 mt-1 line-clamp-2 leading-relaxed">
                {spec.description}
              </p>
            </div>

            <div className="mt-3 pt-2 border-t border-charcoal-100 flex items-center justify-between text-[11px] font-semibold text-emerald-700">
              <span>Find doctors</span>
              <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
