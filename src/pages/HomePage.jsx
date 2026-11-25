import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  PhoneCall,
  Sparkles,
  Calendar,
  Search,
  HeartPulse,
  Clock,
  ArrowRight,
  ShieldCheck,
  Bot,
} from "lucide-react";
import { UpcomingAppointmentCard } from "../components/patient/UpcomingAppointmentCard";
import { QuickDoctorSearch } from "../components/patient/QuickDoctorSearch";
import { SpecialityBrowser } from "../components/patient/SpecialityBrowser";
import { RecentlyViewedDoctors } from "../components/patient/RecentlyViewedDoctors";
import { BookingCtaBanner } from "../components/patient/BookingCtaBanner";
import { DoctorSlotModal } from "../components/doctors/DoctorSlotModal";
import { AppointmentDetailsModal } from "../components/appointments/AppointmentDetailsModal";
import { Button } from "../components/common/Button";
import { useApp } from "../context/AppContext";

export function HomePage() {
  const {
    patient,
    nextUpcomingAppointment,
    doctors,
    recentlyViewedDoctors,
    openCallModal,
    addAppointment,
  } = useApp();

  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  const handleQuickBookSlot = (doctor, date, time) => {
    addAppointment({
      doctorId: doctor.id,
      doctorName: doctor.name,
      doctorAvatar: doctor.avatar,
      speciality: doctor.speciality,
      appointmentDate: date,
      appointmentTime: time,
      consultationFee: doctor.consultationFee,
      bookedVia: "Find Doctors",
      reason: `Direct consultation with ${doctor.name}`,
    });
  };

  return (
    <div className="space-y-7">
      {/* Patient Welcome Hero with Prominent "Talk to MediVoice AI" CTA */}
      <div className="bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-950 rounded-3xl p-6 sm:p-8 text-white shadow-call relative overflow-hidden border border-emerald-700/60">
        {/* Subtle Ambient Glow */}
        <div className="absolute right-0 top-0 w-96 h-96 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute left-1/3 -bottom-20 w-80 h-80 bg-teal-300/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-semibold text-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              MediVoice AI • 24/7 Voice Healthcare Assistant
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white leading-tight">
              Your health, one conversation away.
            </h1>

            <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed max-w-lg">
              Skip typing and waiting. Talk directly with MediVoice AI to check specialist schedules, book consultation slots, or manage your upcoming visits in real time.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <Button
                variant="primary"
                size="lg"
                onClick={openCallModal}
                icon={PhoneCall}
                className="bg-white hover:bg-emerald-50 text-emerald-950 font-bold border-0 shadow-lg hover:shadow-xl hover:scale-102 transition-all cursor-pointer"
              >
                Talk to MediVoice AI
              </Button>

              <Link to="/doctors">
                <Button
                  variant="outline"
                  size="lg"
                  className="text-white border-white/30 hover:bg-white/10 hover:border-white/50 cursor-pointer"
                >
                  Find Doctors Online
                </Button>
              </Link>
            </div>
          </div>

          {/* Quick Voice Interactive Feature Widget */}
          <div className="shrink-0 flex justify-center">
            <div
              onClick={openCallModal}
              className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-4.5 text-center cursor-pointer hover:bg-white/15 transition-all group max-w-xs w-full"
            >
              <div className="w-12 h-12 rounded-full bg-emerald-500/90 text-white flex items-center justify-center mx-auto mb-3 shadow-glow-green group-hover:scale-105 transition-transform">
                <Bot className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-white">Call Clinical AI</h4>
              <p className="text-[11px] text-emerald-200 mt-0.5">
                "Book cardiologist tomorrow at 10 AM"
              </p>
              <div className="mt-3 flex items-center justify-center gap-1.5 text-xs text-emerald-300 font-semibold group-hover:text-white">
                <span>Start conversation</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Doctor Search */}
      <QuickDoctorSearch />

      {/* Upcoming Appointment Card */}
      <div className="space-y-2">
        <UpcomingAppointmentCard
          appointment={nextUpcomingAppointment}
          onViewDetails={(apt) => setSelectedAppointment(apt)}
          onTalkToAI={openCallModal}
        />
      </div>

      {/* Browse Specialities */}
      <SpecialityBrowser />

      {/* Recently Viewed / Top Doctors */}
      <RecentlyViewedDoctors
        doctors={recentlyViewedDoctors.length ? recentlyViewedDoctors : doctors.slice(0, 3)}
        onSelectDoctor={(doc) => setSelectedDoctor(doc)}
        onQuickBookSlot={handleQuickBookSlot}
      />

      {/* Simple Booking Call-to-action Banner */}
      <BookingCtaBanner onTalkToAI={openCallModal} />

      {/* Reusable Modals */}
      <DoctorSlotModal
        doctor={selectedDoctor}
        isOpen={Boolean(selectedDoctor)}
        onClose={() => setSelectedDoctor(null)}
      />

      <AppointmentDetailsModal
        appointment={selectedAppointment}
        isOpen={Boolean(selectedAppointment)}
        onClose={() => setSelectedAppointment(null)}
      />
    </div>
  );
}
