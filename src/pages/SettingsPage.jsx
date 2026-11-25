import React, { useState } from "react";
import {
  User,
  Phone,
  Mail,
  Bell,
  Shield,
  RotateCcw,
  CheckCircle2,
  Heart,
  Globe,
  Sliders,
} from "lucide-react";
import { Button } from "../components/common/Button";
import { useApp } from "../context/AppContext";

export function SettingsPage() {
  const { patient, updatePatientProfile, resetToSampleData } = useApp();

  const [formData, setFormData] = useState({
    name: patient.name,
    phone: patient.phone,
    email: patient.email,
    dob: patient.dob || "1988-06-14",
    bloodGroup: patient.bloodGroup || "O+",
    emergencyContact: patient.emergencyContact || "+1 (555) 998-1122 (Sarah Anderson)",
    address: patient.address || "742 Evergreen Terrace, Springfield",
    notificationPrefs: {
      smsReminders: patient.notificationPrefs?.smsReminders ?? true,
      whatsappUpdates: patient.notificationPrefs?.whatsappUpdates ?? true,
      emailConfirmations: patient.notificationPrefs?.emailConfirmations ?? true,
      calendarSync: patient.notificationPrefs?.calendarSync ?? true,
    },
    preferences: {
      preferredLanguage: patient.preferences?.preferredLanguage || "English (US)",
      shareHealthRecords: patient.preferences?.shareHealthRecords ?? true,
    },
  });

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNotifChange = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      notificationPrefs: {
        ...prev.notificationPrefs,
        [key]: value,
      },
    }));
  };

  const handlePrefChange = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [key]: value,
      },
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updatePatientProfile(formData);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-charcoal-900 tracking-tight">
          Patient Profile & Preferences
        </h2>
        <p className="text-xs sm:text-sm text-charcoal-500 mt-0.5">
          Manage your contact details, voice assistant preferences, and appointment notification settings.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Details */}
        <div className="bg-white rounded-2xl border border-surface-border shadow-card p-5 sm:p-6 space-y-4">
          <div className="flex items-center gap-2.5 pb-3.5 border-b border-surface-border">
            <User className="w-4 h-4 text-emerald-700" />
            <h3 className="text-sm font-bold text-charcoal-900 uppercase tracking-wider">
              Patient Information
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-semibold text-charcoal-700 block mb-1">
                Full Name
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-charcoal-200 text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 outline-none"
              />
            </div>

            <div>
              <label className="font-semibold text-charcoal-700 block mb-1">
                Mobile Phone (Used for Voice Confirmations)
              </label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-charcoal-200 text-xs font-mono focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 outline-none"
              />
            </div>

            <div>
              <label className="font-semibold text-charcoal-700 block mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-charcoal-200 text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 outline-none"
              />
            </div>

            <div>
              <label className="font-semibold text-charcoal-700 block mb-1">
                Emergency Contact
              </label>
              <input
                type="text"
                value={formData.emergencyContact}
                onChange={(e) => handleChange("emergencyContact", e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-charcoal-200 text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Notification Preferences */}
        <div className="bg-white rounded-2xl border border-surface-border shadow-card p-5 sm:p-6 space-y-4">
          <div className="flex items-center gap-2.5 pb-3.5 border-b border-surface-border">
            <Bell className="w-4 h-4 text-emerald-700" />
            <h3 className="text-sm font-bold text-charcoal-900 uppercase tracking-wider">
              Notification & Reminder Preferences
            </h3>
          </div>

          <div className="space-y-3">
            <label className="flex items-center justify-between p-3 rounded-xl border border-charcoal-100 hover:bg-[#FAFBF9] cursor-pointer">
              <div>
                <span className="text-xs font-bold text-charcoal-900 block">
                  SMS Appointment Reminders
                </span>
                <span className="text-[11px] text-charcoal-500">
                  Receive an automated text reminder 2 hours prior to your doctor appointment.
                </span>
              </div>
              <input
                type="checkbox"
                checked={formData.notificationPrefs.smsReminders}
                onChange={(e) => handleNotifChange("smsReminders", e.target.checked)}
                className="rounded border-charcoal-300 text-emerald-600 focus:ring-emerald-500 w-4 h-4 cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl border border-charcoal-100 hover:bg-[#FAFBF9] cursor-pointer">
              <div>
                <span className="text-xs font-bold text-charcoal-900 block">
                  WhatsApp Confirmation Messages
                </span>
                <span className="text-[11px] text-charcoal-500">
                  Send doctor details, clinic room location, and directions to WhatsApp.
                </span>
              </div>
              <input
                type="checkbox"
                checked={formData.notificationPrefs.whatsappUpdates}
                onChange={(e) => handleNotifChange("whatsappUpdates", e.target.checked)}
                className="rounded border-charcoal-300 text-emerald-600 focus:ring-emerald-500 w-4 h-4 cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl border border-charcoal-100 hover:bg-[#FAFBF9] cursor-pointer">
              <div>
                <span className="text-xs font-bold text-charcoal-900 block">
                  Email Summary & Receipts
                </span>
                <span className="text-[11px] text-charcoal-500">
                  Receive digital booking slips and consultation fee receipts via email.
                </span>
              </div>
              <input
                type="checkbox"
                checked={formData.notificationPrefs.emailConfirmations}
                onChange={(e) => handleNotifChange("emailConfirmations", e.target.checked)}
                className="rounded border-charcoal-300 text-emerald-600 focus:ring-emerald-500 w-4 h-4 cursor-pointer"
              />
            </label>
          </div>
        </div>

        {/* Application Preferences */}
        <div className="bg-white rounded-2xl border border-surface-border shadow-card p-5 sm:p-6 space-y-4">
          <div className="flex items-center gap-2.5 pb-3.5 border-b border-surface-border">
            <Globe className="w-4 h-4 text-emerald-700" />
            <h3 className="text-sm font-bold text-charcoal-900 uppercase tracking-wider">
              MediVoice AI Language & Privacy
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-semibold text-charcoal-700 block mb-1">
                Preferred Voice Language
              </label>
              <select
                value={formData.preferences.preferredLanguage}
                onChange={(e) => handlePrefChange("preferredLanguage", e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-charcoal-200 text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 outline-none bg-white"
              >
                <option value="English (US)">English (US)</option>
                <option value="English (UK)">English (UK)</option>
                <option value="Spanish">Spanish (Español)</option>
                <option value="Hindi">Hindi (हिन्दी)</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-charcoal-700 block mb-1">
                Share Prior Health Records with Specialist
              </label>
              <select
                value={formData.preferences.shareHealthRecords ? "yes" : "no"}
                onChange={(e) => handlePrefChange("shareHealthRecords", e.target.value === "yes")}
                className="w-full px-3.5 py-2 rounded-xl border border-charcoal-200 text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 outline-none bg-white"
              >
                <option value="yes">Yes, share records automatically</option>
                <option value="no">No, ask me during each visit</option>
              </select>
            </div>
          </div>

          {/* Reset Demo Data */}
          <div className="pt-3 border-t border-charcoal-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 bg-[#FAFBF9] rounded-xl border border-charcoal-200/70">
            <div>
              <span className="font-bold text-charcoal-900 block text-xs">
                Reset Demo Appointments
              </span>
              <span className="text-[11px] text-charcoal-500">
                Restore the default upcoming, completed, and cancelled demo consultations.
              </span>
            </div>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              icon={RotateCcw}
              onClick={resetToSampleData}
              className="shrink-0 cursor-pointer"
            >
              Reset Data
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <Button type="submit" variant="primary" icon={CheckCircle2} className="px-6 cursor-pointer">
            Save Preferences
          </Button>
        </div>
      </form>
    </div>
  );
}
