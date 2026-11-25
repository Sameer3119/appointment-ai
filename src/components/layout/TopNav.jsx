import React, { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import {
  Menu,
  Bell,
  PhoneCall,
  Calendar,
  CheckCircle2,
  Clock,
  User,
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import { Button } from "../common/Button";

export function TopNav() {
  const location = useLocation();
  const {
    openCallModal,
    setMobileMenuOpen,
    notifications,
    setNotifications,
    patient,
  } = useApp();

  const [notificationsOpen, setNotificationsOpen] = useState(false);

  // Derive title from pathname
  const getPageMeta = () => {
    switch (location.pathname) {
      case "/":
        return {
          title: `Welcome back, ${patient.name.split(" ")[0]}`,
          subtitle: "Your health, one conversation away.",
        };
      case "/doctors":
        return {
          title: "Find Doctors",
          subtitle: "Search top medical specialists, check available slots and book appointments",
        };
      case "/my-appointments":
      case "/appointments":
        return {
          title: "My Appointments",
          subtitle: "Manage your upcoming doctor consultations, past visits and confirmations",
        };
      case "/voice":
        return {
          title: "Talk to MediVoice AI",
          subtitle: "Simulated conversational AI phone call to check availability, book or cancel",
        };
      case "/settings":
        return {
          title: "Profile & Settings",
          subtitle: "Personal information, phone number and appointment notification preferences",
        };
      default:
        return {
          title: "MediVoice AI",
          subtitle: "Voice-Based Doctor Appointment Assistant",
        };
    }
  };

  const meta = getPageMeta();
  const unreadCount = notifications.filter((n) => n.unread).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-surface-border">
      <div className="h-16 px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        {/* Left: Mobile hamburger + Page Title */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="p-2 rounded-lg text-charcoal-500 hover:text-charcoal-800 hover:bg-charcoal-100 lg:hidden cursor-pointer"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div>
            <h1 className="text-base sm:text-lg font-bold text-charcoal-900 tracking-tight leading-tight">
              {meta.title}
            </h1>
            <p className="text-xs text-charcoal-500 hidden sm:block">
              {meta.subtitle}
            </p>
          </div>
        </div>

        {/* Right Action Bar */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Prominent "Talk to MediVoice AI" Button */}
          <Button
            variant="primary"
            size="sm"
            onClick={openCallModal}
            icon={PhoneCall}
            className="shadow-2xs font-semibold sm:px-3.5"
          >
            <span className="hidden sm:inline">Talk to MediVoice AI</span>
            <span className="sm:hidden">Call AI</span>
          </Button>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="relative p-2 rounded-lg text-charcoal-500 hover:text-charcoal-800 hover:bg-charcoal-100 transition-colors border border-charcoal-200/60 cursor-pointer"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white" />
              )}
            </button>

            {/* Dropdown Panel */}
            {notificationsOpen && (
              <>
                <div
                  className="fixed inset-0 z-20"
                  onClick={() => setNotificationsOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-80 sm:w-88 bg-white rounded-xl shadow-modal border border-surface-border z-30 py-2 animate-scaleUp">
                  <div className="px-4 py-2 border-b border-charcoal-100 flex items-center justify-between">
                    <span className="text-xs font-bold text-charcoal-900 uppercase tracking-wider">
                      Appointment Notifications
                    </span>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllRead}
                        className="text-[11px] text-emerald-700 hover:underline cursor-pointer font-medium"
                      >
                        Mark all as read
                      </button>
                    )}
                  </div>

                  <div className="max-h-72 overflow-y-auto divide-y divide-charcoal-50 px-1">
                    {notifications.map((notif) => (
                      <div
                        key={notif.id}
                        className="p-3 hover:bg-charcoal-50 rounded-lg transition-colors flex items-start gap-3"
                      >
                        <div
                          className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                            notif.unread ? "bg-emerald-500" : "bg-charcoal-300"
                          }`}
                        />
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-semibold text-charcoal-900 leading-snug">
                            {notif.title}
                          </p>
                          <p className="text-[11px] text-charcoal-600 mt-0.5 line-clamp-2">
                            {notif.message}
                          </p>
                          <span className="text-[10px] text-charcoal-400 mt-1 block">
                            {notif.time}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Patient Profile Pill */}
          <Link
            to="/settings"
            className="flex items-center gap-2 pl-2 border-l border-surface-border hover:opacity-85 transition-opacity"
          >
            <div className="relative">
              <img
                src={patient.avatar}
                alt={patient.name}
                className="w-8 h-8 rounded-full object-cover border border-emerald-300 ring-2 ring-emerald-50"
              />
              <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white" />
            </div>
            <div className="hidden md:flex flex-col text-left">
              <span className="text-xs font-semibold text-charcoal-900 leading-none">
                {patient.name}
              </span>
              <span className="text-[10px] text-charcoal-500 mt-0.5 leading-none">
                {patient.phone}
              </span>
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
}
