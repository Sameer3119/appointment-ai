import React, { useState } from "react";
import {
  CalendarDays,
  UserCheck,
  CheckCircle2,
  XCircle,
  PhoneCall,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Cpu,
  Wifi,
} from "lucide-react";
import { StatCard } from "../components/dashboard/StatCard";
import { RecentAppointmentsTable } from "../components/dashboard/RecentAppointmentsTable";
import { ActivityFeed } from "../components/dashboard/ActivityFeed";
import { DoctorAvailabilityQuickView } from "../components/dashboard/DoctorAvailabilityQuickView";
import { AppointmentDetailsModal } from "../components/appointments/AppointmentDetailsModal";
import { DoctorSlotModal } from "../components/doctors/DoctorSlotModal";
import { Button } from "../components/common/Button";
import { useApp } from "../context/AppContext";

export function OverviewPage() {
  const { stats, appointments, doctors, activities, openCallModal } = useApp();

  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  return (
    <div className="space-y-6">
      {/* Premium Hero Welcome Banner with Quick "Try AI Assistant" */}
      <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 rounded-2xl p-6 sm:p-7 text-white shadow-call relative overflow-hidden border border-emerald-700/50">
        {/* Subtle background ambient rings */}
        <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-emerald-500/10 blur-2xl pointer-events-none" />
        <div className="absolute right-32 -bottom-20 w-80 h-80 rounded-full bg-teal-400/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-semibold text-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              MediVoice Clinical Voice Agent • v1.4 Active
            </div>

            <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-white">
              Intelligent Voice Doctor Appointments
            </h2>

            <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
              Patients call in and converse naturally with MediVoice AI. The assistant checks specialist calendars, books appointment slots, and verifies phone confirmations in real time.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <Button
              variant="primary"
              size="lg"
              onClick={openCallModal}
              icon={PhoneCall}
              className="bg-white hover:bg-emerald-50 text-emerald-950 font-bold border-0 shadow-lg hover:shadow-xl hover:scale-102 transition-all"
            >
              Try AI Assistant
            </Button>
          </div>
        </div>
      </div>

      {/* 4 Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Appointments"
          value={stats.total}
          change="+12.4% vs last week"
          isPositive={true}
          icon={CalendarDays}
        />
        <StatCard
          title="Available Doctors"
          value={`${stats.availableDoctors} / ${stats.totalDoctors}`}
          change="5 specialities open"
          isPositive={true}
          icon={UserCheck}
        />
        <StatCard
          title="Confirmed Appointments"
          value={stats.confirmed}
          change="+8.1% booking rate"
          isPositive={true}
          icon={CheckCircle2}
        />
        <StatCard
          title="Cancelled Appointments"
          value={stats.cancelled}
          change="-2.5% churn"
          isPositive={true}
          icon={XCircle}
        />
      </div>

      {/* Main Grid: Left (Tables & Doctor View) | Right (Activity & Pipeline Status) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols wide on desktop) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Recent Appointments Table */}
          <RecentAppointmentsTable
            appointments={appointments}
            onViewDetails={(apt) => setSelectedAppointment(apt)}
          />

          {/* Doctor Availability Quick View */}
          <DoctorAvailabilityQuickView
            doctors={doctors}
            onSelectDoctor={(doc) => setSelectedDoctor(doc)}
          />
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Activity Feed */}
          <ActivityFeed activities={activities} />

          {/* Clinical Telemetry Card */}
          <div className="bg-white rounded-xl border border-surface-border shadow-card p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-surface-border">
              <h4 className="text-xs font-bold text-charcoal-900 uppercase tracking-wider flex items-center gap-2">
                <Cpu className="w-4 h-4 text-emerald-700" />
                Voice Pipeline Health
              </h4>
              <span className="text-[10px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full font-semibold border border-emerald-200/60">
                Operational
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-charcoal-500">Pipeline Engine</span>
                <span className="font-semibold text-charcoal-800">Pipecat AI WebRTC</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-charcoal-500">Audio Latency</span>
                <span className="font-mono font-bold text-emerald-700">~185 ms</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-charcoal-500">FastAPI Gateway</span>
                <span className="font-mono font-medium text-charcoal-800">http://localhost:8000</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-charcoal-500">Live Transcript Protocol</span>
                <span className="font-medium text-charcoal-800">WebSocket /ws/voice-events</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={openCallModal}
                className="w-full py-2 px-3 rounded-lg bg-[#FAFBF9] hover:bg-emerald-50 text-emerald-800 text-xs font-bold border border-charcoal-200 hover:border-emerald-300 transition-colors flex items-center justify-center gap-1.5"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                Launch Test Call Session
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Reusable Details & Slot Picker Modals */}
      <AppointmentDetailsModal
        appointment={selectedAppointment}
        isOpen={Boolean(selectedAppointment)}
        onClose={() => setSelectedAppointment(null)}
      />

      <DoctorSlotModal
        doctor={selectedDoctor}
        isOpen={Boolean(selectedDoctor)}
        onClose={() => setSelectedDoctor(null)}
      />
    </div>
  );
}
