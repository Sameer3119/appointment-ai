import React, { useEffect, useRef } from "react";
import { Bot, User, CheckCircle2 } from "lucide-react";
import { cn } from "../../utils/cn";

export function LiveTranscript({ messages = [], currentTurnIndex = 0 }) {
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div
      ref={scrollRef}
      className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-[#FAFBF9]/80 rounded-xl border border-charcoal-200/70 max-h-72 min-h-52 text-left"
    >
      <div className="flex items-center justify-between pb-2 border-b border-charcoal-200/50 text-[11px] font-semibold text-charcoal-400 uppercase tracking-wider">
        <span>Live Transcript Stream</span>
        <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full lowercase font-mono">
          speech-to-text
        </span>
      </div>

      {messages.length === 0 ? (
        <div className="h-40 flex flex-col items-center justify-center text-center text-charcoal-400 space-y-2">
          <Bot className="w-6 h-6 text-charcoal-300 animate-bounce" />
          <p className="text-xs">Connecting to voice pipeline...</p>
        </div>
      ) : (
        messages.map((msg, idx) => {
          const isAI = msg.sender === "ai";
          return (
            <div
              key={idx}
              className={cn(
                "flex flex-col gap-1 transition-all duration-200 animate-fadeIn",
                isAI ? "items-start" : "items-end"
              )}
            >
              <div className="flex items-center gap-1.5 text-[11px] font-semibold text-charcoal-500">
                {isAI ? (
                  <>
                    <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-[9px] font-bold">
                      AI
                    </span>
                    <span className="text-emerald-900">MediVoice</span>
                  </>
                ) : (
                  <>
                    <span className="text-charcoal-700">Patient</span>
                    <span className="w-4 h-4 rounded-full bg-charcoal-100 text-charcoal-700 flex items-center justify-center text-[9px]">
                      <User className="w-2.5 h-2.5" />
                    </span>
                  </>
                )}
              </div>

              <div
                className={cn(
                  "p-3 rounded-2xl text-xs sm:text-[13px] leading-relaxed max-w-[85%] shadow-2xs",
                  isAI
                    ? "bg-white text-charcoal-900 border border-charcoal-200/80 rounded-tl-xs"
                    : "bg-emerald-700 text-white rounded-tr-xs"
                )}
              >
                {msg.text}

                {msg.isCompletedBooking && (
                  <div className="mt-2 pt-2 border-t border-emerald-100 flex items-center gap-1.5 text-xs text-emerald-700 font-semibold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Appointment confirmed in calendar
                  </div>
                )}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
