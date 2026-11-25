import React, { useEffect, useRef } from "react";
import { Bot, User } from "lucide-react";
import { cn } from "../../utils/cn";

export function LiveTranscript({
  messages = [],
  interimUserText = "",
  callStatus = "disconnected",
}) {
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, interimUserText]);

  const emptyText =
    callStatus === "connecting"
      ? "Connecting to MediVoice AI voice pipeline..."
      : callStatus === "connected"
      ? "Connected. Start speaking — live transcripts will appear here."
      : "Press Start Call to begin a real-time voice conversation.";

  return (
    <div
      ref={scrollRef}
      className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-[#FAFBF9]/80 rounded-xl border border-charcoal-200/70 max-h-72 min-h-52 text-left"
    >
      <div className="flex items-center justify-between pb-2 border-b border-charcoal-200/50 text-[11px] font-semibold text-charcoal-400 uppercase tracking-wider">
        <span>Live Transcript</span>
        <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full lowercase font-mono">
          {callStatus === "connected" ? "webrtc-live" : callStatus}
        </span>
      </div>

      {messages.length === 0 && !interimUserText ? (
        <div className="h-40 flex flex-col items-center justify-center text-center text-charcoal-400 space-y-2">
          <Bot
            className={cn(
              "w-6 h-6 text-charcoal-300",
              callStatus === "connecting" && "animate-bounce"
            )}
          />
          <p className="text-xs">{emptyText}</p>
        </div>
      ) : (
        <>
          {messages.map((msg) => {
            const isAI = msg.sender === "ai";
            return (
              <div
                key={msg.id}
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
                      <span className="text-emerald-900">MediVoice AI</span>
                    </>
                  ) : (
                    <>
                      <span className="text-charcoal-700">You</span>
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
                </div>
              </div>
            );
          })}

          {interimUserText && (
            <div className="flex flex-col gap-1 items-end opacity-75">
              <div className="flex items-center gap-1.5 text-[11px] font-semibold text-charcoal-500">
                <span className="text-charcoal-600">You (speaking...)</span>
              </div>
              <div className="p-3 rounded-2xl text-xs sm:text-[13px] leading-relaxed max-w-[85%] bg-emerald-600/80 text-white rounded-tr-xs italic">
                {interimUserText}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
