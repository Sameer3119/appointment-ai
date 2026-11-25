import React from "react";
import { Link } from "react-router-dom";
import { PhoneCall, Calendar, ShieldCheck, HeartPulse } from "lucide-react";
import { Button } from "../common/Button";

export function BookingCtaBanner({ onTalkToAI }) {
  return (
    <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 rounded-2xl p-6 sm:p-7 text-white shadow-call relative overflow-hidden">
      <div className="absolute right-0 top-0 -mt-10 -mr-10 w-48 h-48 rounded-full bg-emerald-400/10 blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-emerald-200 border border-white/15">
            <HeartPulse className="w-3.5 h-3.5 text-emerald-300" />
            MediVoice Patient Care
          </div>
          <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white">
            Need to see a doctor today or tomorrow?
          </h3>
          <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
            Call MediVoice AI to check real-time clinic openings, reserve preferred consultation slots, and receive immediate appointment confirmations on your phone.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
          <Button
            variant="primary"
            size="lg"
            onClick={onTalkToAI}
            icon={PhoneCall}
            className="bg-white hover:bg-emerald-50 text-emerald-950 font-bold border-0 shadow-lg cursor-pointer"
          >
            Talk to MediVoice AI
          </Button>

          <Link to="/doctors">
            <Button
              variant="outline"
              size="lg"
              className="text-white border-white/30 hover:bg-white/10 hover:border-white/50 w-full cursor-pointer"
            >
              Browse All Doctors
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
