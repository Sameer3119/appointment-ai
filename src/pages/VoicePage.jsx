import React from "react";
import {
  PhoneCall,
  Bot,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Clock,
  ArrowRight,
  MessageSquare,
  HelpCircle,
} from "lucide-react";
import { Button } from "../components/common/Button";
import { useApp } from "../context/AppContext";
import {
  VOICE_BOOKING_SCRIPT,
  VOICE_CANCELLATION_SCRIPT,
  VOICE_AVAILABILITY_SCRIPT,
} from "../services/mockData";

export function VoicePage() {
  const { openCallModalWithScenario } = useApp();

  return (
    <div className="space-y-8">
      {/* Hero Calling Banner */}
      <div className="bg-white rounded-3xl border border-surface-border p-6 sm:p-8 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-3.5 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-xs font-semibold text-emerald-800">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            MediVoice AI • 24/7 Telephone Booking Assistant
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-charcoal-900 tracking-tight">
            Talk to MediVoice AI
          </h2>

          <p className="text-xs sm:text-sm text-charcoal-600 leading-relaxed">
            Experience our conversational voice assistant built exclusively for healthcare. Speak naturally to find doctors, inquire about open clinic slots, confirm appointment times, or cancel existing reservations.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <Button
              variant="primary"
              size="lg"
              onClick={() => openCallModalWithScenario("booking")}
              icon={PhoneCall}
              className="px-6 shadow-call font-bold text-sm cursor-pointer"
            >
              Start Simulated Voice Call
            </Button>
          </div>
        </div>

        {/* Visual Phone Mockup Widget */}
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
              <p className="text-[11px] text-emerald-400 font-medium">Ready to take your call</p>
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
                Click to Start Call
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 3 Selectable Voice Scenarios */}
      <div className="space-y-4">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-charcoal-900 tracking-tight">
            Choose What You Want to Test
          </h3>
          <p className="text-xs text-charcoal-500 mt-0.5">
            MediVoice AI supports natural language doctor booking, real-time availability checks, and cancellations
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Scenario 1 */}
          <div className="bg-white rounded-2xl border border-surface-border p-5 shadow-card hover:border-emerald-300 transition-all flex flex-col justify-between">
            <div className="space-y-2.5">
              <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 inline-block">
                Scenario 1: Appointment Booking
              </span>
              <h4 className="text-sm font-bold text-charcoal-900">
                Book a Cardiologist for Tomorrow
              </h4>
              <p className="text-xs text-charcoal-600 leading-relaxed">
                "I want to book an appointment with a cardiologist tomorrow at 10 AM..."
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
                Test Booking Call
              </Button>
            </div>
          </div>

          {/* Scenario 2 */}
          <div className="bg-white rounded-2xl border border-surface-border p-5 shadow-card hover:border-emerald-300 transition-all flex flex-col justify-between">
            <div className="space-y-2.5">
              <span className="text-[11px] font-bold text-teal-800 bg-teal-50 px-2.5 py-1 rounded-full border border-teal-200 inline-block">
                Scenario 2: Check Availability
              </span>
              <h4 className="text-sm font-bold text-charcoal-900">
                Inquire Doctor Times & Same-Day Slots
              </h4>
              <p className="text-xs text-charcoal-600 leading-relaxed">
                "When is Dr. Priya Nair available for skin consultation today?..."
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
                Test Availability Call
              </Button>
            </div>
          </div>

          {/* Scenario 3 */}
          <div className="bg-white rounded-2xl border border-surface-border p-5 shadow-card hover:border-emerald-300 transition-all flex flex-col justify-between">
            <div className="space-y-2.5">
              <span className="text-[11px] font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200 inline-block">
                Scenario 3: Cancel Appointment
              </span>
              <h4 className="text-sm font-bold text-charcoal-900">
                Cancel an Upcoming Doctor Visit
              </h4>
              <p className="text-xs text-charcoal-600 leading-relaxed">
                "I need to cancel my upcoming appointment with Dr. Sharma..."
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
                Test Cancellation Call
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Transcript Preview Flow */}
      <div className="bg-white rounded-2xl border border-surface-border shadow-card p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-surface-border">
          <div>
            <h3 className="text-base font-bold text-charcoal-900 tracking-tight flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-emerald-700" />
              Standard Booking Conversation Script
            </h3>
            <p className="text-xs text-charcoal-500 mt-0.5">
              Natural conversational turn-taking executed during the AI phone call
            </p>
          </div>
          <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            Preview
          </span>
        </div>

        {/* Chat Bubbles Preview */}
        <div className="space-y-3 max-w-2xl mx-auto py-2">
          {VOICE_BOOKING_SCRIPT.map((turn, i) => {
            const isAI = turn.sender === "ai";
            return (
              <div
                key={i}
                className={`flex flex-col gap-1 ${isAI ? "items-start" : "items-end"}`}
              >
                <span className="text-[11px] font-semibold text-charcoal-500">
                  {isAI ? "MediVoice AI" : "Patient (John Anderson)"}
                </span>
                <div
                  className={`p-3 rounded-2xl text-xs sm:text-[13px] leading-relaxed max-w-[85%] ${
                    isAI
                      ? "bg-[#FAFBF9] text-charcoal-900 border border-charcoal-200/80 rounded-tl-xs"
                      : "bg-emerald-700 text-white rounded-tr-xs"
                  }`}
                >
                  {turn.text}
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center pt-4 border-t border-surface-border">
          <Button
            variant="primary"
            onClick={() => openCallModalWithScenario("booking")}
            icon={PhoneCall}
            className="cursor-pointer"
          >
            Launch Interactive Call Simulation
          </Button>
        </div>
      </div>
    </div>
  );
}
