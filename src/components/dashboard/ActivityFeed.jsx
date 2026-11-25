import React from "react";
import { PhoneCall, CalendarCheck, XCircle, Clock, Bot, Activity } from "lucide-react";
import { cn } from "../../utils/cn";

export function ActivityFeed({ activities = [] }) {
  const getIcon = (type) => {
    switch (type) {
      case "booking":
        return <CalendarCheck className="w-4 h-4 text-emerald-700" />;
      case "call":
        return <PhoneCall className="w-4 h-4 text-emerald-700" />;
      case "cancellation":
        return <XCircle className="w-4 h-4 text-rose-600" />;
      default:
        return <Activity className="w-4 h-4 text-charcoal-600" />;
    }
  };

  return (
    <div className="bg-white rounded-xl border border-surface-border shadow-card p-5">
      <div className="flex items-center justify-between pb-3 border-b border-surface-border mb-4">
        <div>
          <h3 className="text-sm sm:text-base font-bold text-charcoal-900 tracking-tight">
            Recent Activity
          </h3>
          <p className="text-xs text-charcoal-500 mt-0.5">
            Voice AI events and clinic updates
          </p>
        </div>
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
      </div>

      <div className="space-y-4">
        {activities.slice(0, 5).map((act, idx) => (
          <div key={act.id || idx} className="flex items-start gap-3 relative">
            {/* Timeline connector line */}
            {idx !== activities.slice(0, 5).length - 1 && (
              <span className="absolute left-4 top-8 bottom-0 w-px bg-charcoal-100 -mb-4" />
            )}

            {/* Icon Bubble */}
            <div className="w-8 h-8 rounded-lg bg-charcoal-50 border border-charcoal-200/80 flex items-center justify-center shrink-0 z-10">
              {getIcon(act.type)}
            </div>

            {/* Content */}
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <h4 className="text-xs font-semibold text-charcoal-900 leading-tight">
                  {act.title}
                </h4>
                <span className="text-[10px] text-charcoal-400 shrink-0 font-medium">
                  {act.timestamp}
                </span>
              </div>
              <p className="text-xs text-charcoal-600 mt-0.5 leading-relaxed line-clamp-2">
                {act.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
