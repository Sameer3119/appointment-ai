import React from "react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { cn } from "../../utils/cn";

export function StatCard({ title, value, change, isPositive = true, icon: Icon, color = "emerald" }) {
  return (
    <div className="bg-white rounded-xl border border-surface-border p-5 shadow-card hover:border-charcoal-300 transition-all">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-charcoal-500 uppercase tracking-wider">
          {title}
        </span>
        <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200/60 flex items-center justify-center">
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <div className="mt-3 flex items-baseline justify-between">
        <span className="text-2xl sm:text-3xl font-extrabold text-charcoal-900 tracking-tight">
          {value}
        </span>
        {change && (
          <span
            className={cn(
              "inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-md",
              isPositive
                ? "text-emerald-700 bg-emerald-50 border border-emerald-200/70"
                : "text-rose-700 bg-rose-50 border border-rose-200/70"
            )}
          >
            {isPositive ? (
              <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
            ) : (
              <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" />
            )}
            {change}
          </span>
        )}
      </div>
    </div>
  );
}
