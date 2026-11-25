import React from "react";
import { cn } from "../../utils/cn";

export function Button({
  children,
  variant = "primary",
  size = "md",
  className,
  disabled = false,
  onClick,
  type = "button",
  icon: Icon,
  iconPosition = "left",
  ...props
}) {
  const variants = {
    primary:
      "bg-emerald-700 hover:bg-emerald-800 text-white shadow-xs hover:shadow-subtle active:translate-y-px transition-all duration-150 border border-emerald-800/20 font-medium focus:ring-2 focus:ring-emerald-600/20",
    secondary:
      "bg-white hover:bg-charcoal-50 text-charcoal-800 border border-charcoal-200 shadow-2xs hover:border-charcoal-300 active:bg-charcoal-100 font-medium focus:ring-2 focus:ring-charcoal-200",
    outline:
      "bg-transparent hover:bg-emerald-50/60 text-emerald-800 border border-emerald-600/30 font-medium hover:border-emerald-600/60",
    ghost:
      "bg-transparent hover:bg-charcoal-100/70 text-charcoal-700 hover:text-charcoal-900 font-medium",
    danger:
      "bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-medium active:bg-rose-200",
    subtleGreen:
      "bg-emerald-50 hover:bg-emerald-100/80 text-emerald-800 border border-emerald-200/60 font-medium",
  };

  const sizes = {
    xs: "px-2 py-1 text-xs rounded-md gap-1",
    sm: "px-3 py-1.5 text-xs rounded-lg gap-1.5",
    md: "px-4 py-2 text-sm rounded-lg gap-2",
    lg: "px-5 py-2.5 text-sm md:text-base rounded-xl gap-2.5 font-semibold",
    icon: "p-2 rounded-lg",
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "inline-flex items-center justify-center select-none outline-none disabled:opacity-50 disabled:pointer-events-none transition-all cursor-pointer",
        variants[variant] || variants.primary,
        sizes[size] || sizes.md,
        className
      )}
      {...props}
    >
      {Icon && iconPosition === "left" && <Icon className="w-4 h-4 shrink-0" />}
      {children}
      {Icon && iconPosition === "right" && <Icon className="w-4 h-4 shrink-0" />}
    </button>
  );
}
