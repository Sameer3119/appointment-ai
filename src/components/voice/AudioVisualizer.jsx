import React from "react";
import { cn } from "../../utils/cn";

export function AudioVisualizer({ isActive = true, isSpeaking = true, isMuted = false }) {
  // 12 dynamic frequency bars with staggered animations
  const barHeights = [24, 45, 75, 95, 60, 85, 100, 70, 90, 50, 65, 30];

  return (
    <div className="flex flex-col items-center justify-center py-3">
      {/* Visualizer Waveform */}
      <div className="h-14 flex items-center justify-center gap-1.5 px-4">
        {barHeights.map((h, i) => {
          return (
            <span
              key={i}
              style={{
                height: isActive && isSpeaking && !isMuted ? `${h}%` : "12%",
                animationDelay: `${(i % 5) * 120}ms`,
                transitionDuration: "250ms",
              }}
              className={cn(
                "w-1 sm:w-1.5 rounded-full transition-all ease-in-out",
                isActive && isSpeaking && !isMuted
                  ? "bg-gradient-to-t from-emerald-600 to-emerald-400 animate-wave shadow-glow-green"
                  : isMuted
                  ? "bg-rose-300 h-2"
                  : "bg-charcoal-200 h-2"
              )}
            />
          );
        })}
      </div>

      {/* Speaking Status Caption */}
      <div className="text-[11px] font-medium tracking-wide mt-1">
        {isMuted ? (
          <span className="text-rose-600 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
            Microphone Muted
          </span>
        ) : isSpeaking ? (
          <span className="text-emerald-700 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            MediVoice AI is speaking...
          </span>
        ) : (
          <span className="text-charcoal-400 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-charcoal-300" />
            Listening for patient response...
          </span>
        )}
      </div>
    </div>
  );
}
