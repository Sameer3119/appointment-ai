import React from "react";
import { Link } from "react-router-dom";
import { PhoneCall, Bot, ShieldCheck } from "lucide-react";
import { Button } from "../components/common/Button";
import { useApp } from "../context/AppContext";

export function VoicePage() {
  const { openCallModalWithScenario } = useApp();

  return (
    <div className="space-y-8">
      {/* Live Voice Notice Banner */}
      <div className="bg-emerald-50 border border-emerald-200/90 rounded-2xl p-4 flex items-start gap-3 text-xs text-emerald-900 shadow-card">
        <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-bold text-sm block">
            Real-Time Voice Assistant — Pipecat SmallWebRTC
          </span>
          <p className="text-emerald-800 leading-relaxed">
            Connect directly to the MediVoice AI backend using your browser microphone to check doctor availability, book appointments, or cancel existing bookings. You can also browse doctors manually on{" "}
            <Link to="/doctors" className="font-bold underline text-emerald-950">
              Find Doctors
            </Link>
            .
          </p>
        </div>
      </div>

      {/* Hero Calling Banner */}
      <div className="bg-white rounded-3xl border border-surface-border p-6 sm:p-8 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-3.5 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-xs font-semibold text-emerald-800">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            MediVoice AI • Real-Time Voice Pipeline
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-charcoal-900 tracking-tight">
            Talk to MediVoice AI
          </h2>

          <p className="text-xs sm:text-sm text-charcoal-600 leading-relaxed">
            Start a live voice call to speak naturally with MediVoice AI. The assistant will verify your phone number verbally before booking or cancelling any appointment in the clinic database.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <Button
              variant="primary"
              size="lg"
              onClick={() => openCallModalWithScenario("booking")}
              icon={PhoneCall}
              className="px-6 shadow-call font-bold text-sm cursor-pointer"
            >
              Open Voice Call
            </Button>

            <Link to="/doctors">
              <Button variant="outline" size="lg" className="cursor-pointer">
                Browse Doctors
              </Button>
            </Link>
          </div>
        </div>

        {/* Visual Phone Widget */}
        <div className="shrink-0 flex justify-center">
          <div
            onClick={() => openCallModalWithScenario("booking")}
            className="w-68 bg-charcoal-950 text-white rounded-3xl p-5 border-4 border-charcoal-800 shadow-modal cursor-pointer hover:scale-102 transition-transform duration-200 group text-center space-y-3"
          >
            <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-glow-green group-hover:bg-emerald-500 transition-colors">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold">MediVoice Assistant</h4>
              <p className="text-[11px] text-emerald-400 font-medium">
                WebRTC • Ready for live call
              </p>
            </div>
            <div className="h-6 flex items-center justify-center gap-1">
              {[40, 75, 100, 60, 85, 30].map((h, i) => (
                <span
                  key={i}
                  style={{ height: `${h}%` }}
                  className="w-1 bg-emerald-400 rounded-full animate-wave"
                />
              ))}
            </div>
            <div className="pt-1">
              <span className="inline-block w-full py-2 px-3 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-semibold">
                Open Call Controls
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* What You Can Ask */}
      <div className="space-y-4">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-charcoal-900 tracking-tight">
            What You Can Ask MediVoice AI
          </h3>
          <p className="text-xs text-charcoal-500 mt-0.5">
            All requests are handled in real time against the live clinic schedule.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl border border-surface-border p-5 shadow-card hover:border-emerald-300 transition-all flex flex-col justify-between">
            <div className="space-y-2.5">
              <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 inline-block">
                Appointment Booking
              </span>
              <h4 className="text-sm font-bold text-charcoal-900">
                Book a Specialist Visit
              </h4>
              <p className="text-xs text-charcoal-600 leading-relaxed">
                "I want to book an appointment with a cardiologist tomorrow at 10 AM."
              </p>
            </div>
            <div className="pt-4 mt-2 border-t border-charcoal-100">
              <Button
                variant="primary"
                size="sm"
                onClick={() => openCallModalWithScenario("booking")}
                icon={PhoneCall}
                className="w-full text-xs"
              >
                Start Voice Call
              </Button>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-surface-border p-5 shadow-card hover:border-emerald-300 transition-all flex flex-col justify-between">
            <div className="space-y-2.5">
              <span className="text-[11px] font-bold text-teal-800 bg-teal-50 px-2.5 py-1 rounded-full border border-teal-200 inline-block">
                Check Availability
              </span>
              <h4 className="text-sm font-bold text-charcoal-900">
                Ask About Open Slots
              </h4>
              <p className="text-xs text-charcoal-600 leading-relaxed">
                "Which doctors are available tomorrow for dermatology?"
              </p>
            </div>
            <div className="pt-4 mt-2 border-t border-charcoal-100">
              <Button
                variant="primary"
                size="sm"
                onClick={() => openCallModalWithScenario("availability")}
                icon={PhoneCall}
                className="w-full text-xs"
              >
                Start Voice Call
              </Button>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-surface-border p-5 shadow-card hover:border-emerald-300 transition-all flex flex-col justify-between">
            <div className="space-y-2.5">
              <span className="text-[11px] font-bold text-rose-800 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200 inline-block">
                Cancel Appointment
              </span>
              <h4 className="text-sm font-bold text-charcoal-900">
                Cancel an Existing Visit
              </h4>
              <p className="text-xs text-charcoal-600 leading-relaxed">
                "I need to cancel my upcoming appointment."
              </p>
            </div>
            <div className="pt-4 mt-2 border-t border-charcoal-100">
              <Button
                variant="primary"
                size="sm"
                onClick={() => openCallModalWithScenario("cancellation")}
                icon={PhoneCall}
                className="w-full text-xs"
              >
                Start Voice Call
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
