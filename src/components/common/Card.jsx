import React from "react";
import { cn } from "../../utils/cn";

export function Card({ children, className, hover = false, padding = "p-5" }) {
  return (
    <div
      className={cn(
        "bg-white rounded-xl border border-surface-border shadow-card",
        hover && "hover:border-charcoal-300 hover:shadow-elevated transition-all duration-200",
        padding,
        className
      )}
    >
      {children}
    </div>
  );
}

export function CardHeader({ title, subtitle, action, className }) {
  return (
    <div className={cn("flex items-start justify-between gap-4 pb-4 border-b border-charcoal-100", className)}>
      <div>
        <h3 className="text-base font-semibold text-charcoal-900 tracking-tight">{title}</h3>
        {subtitle && <p className="text-xs text-charcoal-500 mt-0.5">{subtitle}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
