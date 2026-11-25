import React from "react";
import { cn } from "../../utils/cn";

export function Badge({ children, variant = "default", size = "md", className, dot = false }) {
  const variants = {
    default: "bg-charcoal-100 text-charcoal-700 border-charcoal-200",
    confirmed: "bg-emerald-50 text-emerald-800 border-emerald-200/80 font-medium",
    cancelled: "bg-rose-50 text-rose-700 border-rose-200/70 font-medium",
    completed: "bg-slate-100 text-slate-700 border-slate-200 font-medium",
    primary: "bg-brand-50 text-brand-800 border-brand-200 font-medium",
    warning: "bg-amber-50 text-amber-800 border-amber-200 font-medium",
    ai: "bg-emerald-50 text-emerald-800 border-emerald-200/90 font-medium shadow-2xs",
    outline: "bg-transparent text-charcoal-600 border-charcoal-200",
  };

  const sizes = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-2.5 py-1 text-xs",
    lg: "px-3 py-1.5 text-sm",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border transition-colors",
        variants[variant] || variants.default,
        sizes[size] || sizes.md,
        className
      )}
    >
      {dot && (
        <span
          className={cn(
            "w-1.5 h-1.5 rounded-full",
            variant === "confirmed" && "bg-emerald-600 animate-pulse",
            variant === "cancelled" && "bg-rose-500",
            variant === "completed" && "bg-slate-500",
            variant === "primary" && "bg-brand-600",
            variant === "ai" && "bg-emerald-500",
            (!variant || variant === "default") && "bg-charcoal-400"
          )}
        />
      )}
      {children}
    </span>
  );
}
