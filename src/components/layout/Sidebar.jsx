import React from "react";
import { NavLink } from "react-router-dom";
import {
  Home,
  Stethoscope,
  CalendarDays,
  Mic,
  User,
  ChevronLeft,
  ChevronRight,
  PhoneCall,
  HeartPulse,
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import { cn } from "../../utils/cn";

export function Sidebar() {
  const {
    sidebarCollapsed,
    toggleSidebar,
    openCallModal,
    mobileMenuOpen,
    setMobileMenuOpen,
    upcomingAppointments,
    patient,
  } = useApp();

  const navItems = [
    { name: "Home", path: "/", icon: Home },
    { name: "Find Doctors", path: "/doctors", icon: Stethoscope },
    {
      name: "My Appointments",
      path: "/my-appointments",
      icon: CalendarDays,
      count: upcomingAppointments.length,
    },
    {
      name: "Talk to MediVoice AI",
      path: "/voice",
      icon: Mic,
      highlight: true,
    },
    { name: "Settings", path: "/settings", icon: User },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-charcoal-950/40 z-40 lg:hidden backdrop-blur-xs transition-opacity"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={cn(
          "fixed top-0 bottom-0 left-0 z-40 bg-white border-r border-surface-border flex flex-col transition-all duration-300 ease-in-out",
          sidebarCollapsed ? "w-20" : "w-64",
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-surface-border/80">
          <NavLink
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 overflow-hidden group"
          >
            <div className="w-9 h-9 rounded-xl bg-emerald-700 flex items-center justify-center text-white shadow-xs group-hover:bg-emerald-800 transition-colors shrink-0">
              <HeartPulse className="w-5 h-5 text-emerald-100" />
            </div>
            {!sidebarCollapsed && (
              <div className="flex flex-col min-w-0">
                <span className="text-base font-bold text-charcoal-900 tracking-tight leading-tight flex items-center gap-1.5">
                  MediVoice
                  <span className="text-[10px] font-semibold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">
                    AI
                  </span>
                </span>
                <span className="text-[11px] text-charcoal-500 font-medium truncate">
                  Patient Care Assistant
                </span>
              </div>
            )}
          </NavLink>

          {/* Desktop Collapse Toggle */}
          <button
            type="button"
            onClick={toggleSidebar}
            className="hidden lg:flex w-7 h-7 rounded-lg items-center justify-center text-charcoal-400 hover:text-charcoal-700 hover:bg-charcoal-100 transition-colors"
            title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {sidebarCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group relative select-none",
                    isActive
                      ? "bg-emerald-50 text-emerald-900 font-semibold shadow-2xs"
                      : "text-charcoal-600 hover:bg-charcoal-50 hover:text-charcoal-900",
                    sidebarCollapsed && "justify-center px-2"
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      className={cn(
                        "w-5 h-5 shrink-0 transition-colors",
                        isActive
                          ? "text-emerald-700"
                          : "text-charcoal-400 group-hover:text-charcoal-700",
                        item.highlight && !isActive && "text-emerald-600"
                      )}
                    />
                    {!sidebarCollapsed && (
                      <span className="truncate flex-1">{item.name}</span>
                    )}

                    {!sidebarCollapsed && item.count !== undefined && item.count > 0 && (
                      <span
                        className={cn(
                          "text-xs px-2 py-0.5 rounded-full font-semibold",
                          isActive
                            ? "bg-emerald-200/60 text-emerald-900"
                            : "bg-emerald-100 text-emerald-800"
                        )}
                      >
                        {item.count}
                      </span>
                    )}

                    {!sidebarCollapsed && item.highlight && (
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                    )}

                    {/* Active Indicator Bar */}
                    {isActive && (
                      <span className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-emerald-600 rounded-r" />
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Quick Voice Assistant Banner CTA in Sidebar */}
        <div className="p-3 border-t border-surface-border">
          {!sidebarCollapsed ? (
            <div className="bg-gradient-to-b from-emerald-50/80 to-emerald-50/30 border border-emerald-200/70 rounded-xl p-3.5 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-900">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Voice Booking
                </span>
                <span className="text-[10px] text-emerald-700 bg-emerald-100/90 px-1.5 py-0.5 rounded font-medium">
                  24/7 AI
                </span>
              </div>
              <p className="text-xs text-charcoal-600 leading-relaxed">
                Book or manage appointments instantly by speaking naturally with MediVoice AI.
              </p>
              <button
                type="button"
                onClick={openCallModal}
                className="w-full py-2 px-3 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                Talk to MediVoice AI
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={openCallModal}
              title="Talk to MediVoice AI"
              className="w-full aspect-square rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white flex items-center justify-center shadow-xs transition-colors cursor-pointer"
            >
              <PhoneCall className="w-5 h-5 text-white" />
            </button>
          )}

          {/* Patient Profile Footer */}
          <NavLink
            to="/settings"
            onClick={() => setMobileMenuOpen(false)}
            className={cn(
              "mt-3 pt-3 border-t border-surface-border/60 flex items-center gap-3 hover:bg-charcoal-50 p-1 rounded-lg transition-colors group",
              sidebarCollapsed && "justify-center p-0"
            )}
          >
            <div className="relative shrink-0">
              <img
                src={patient.avatar}
                alt={patient.name}
                className="w-8 h-8 rounded-full object-cover border border-emerald-300 ring-2 ring-emerald-50"
              />
              <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white" />
            </div>
            {!sidebarCollapsed && (
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-semibold text-charcoal-900 truncate group-hover:text-emerald-800">
                  {patient.name}
                </span>
                <span className="text-[11px] text-charcoal-500 truncate">
                  Patient Profile
                </span>
              </div>
            )}
          </NavLink>
        </div>
      </aside>
    </>
  );
}
