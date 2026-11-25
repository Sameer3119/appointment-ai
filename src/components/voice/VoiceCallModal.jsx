import React, { useState, useEffect, useRef } from "react";
import {
  PhoneOff,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Bot,
  RotateCcw,
  CheckCircle2,
  Calendar,
  Clock,
  User,
  ShieldCheck,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { Modal } from "../common/Modal";
import { AudioVisualizer } from "./AudioVisualizer";
import { LiveTranscript } from "./LiveTranscript";
import { useApp } from "../../context/AppContext";
import {
  VOICE_BOOKING_SCRIPT,
  VOICE_CANCELLATION_SCRIPT,
  VOICE_AVAILABILITY_SCRIPT,
} from "../../services/mockData";

export function VoiceCallModal() {
  const {
    isCallModalOpen,
    closeCallModal,
    addAppointment,
    cancelAppointmentByDoctor,
    voiceCallScenario,
    setVoiceCallScenario,
    patient,
  } = useApp();

  // Call status: 'connecting' | 'connected' | 'ended'
  const [callStatus, setCallStatus] = useState("connecting");
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);

  // Transcript dialogue state
  const [transcriptMessages, setTranscriptMessages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const timerRef = useRef(null);
  const timeoutRef = useRef(null);

  // Pick script based on active scenario
  const getActiveScript = (scenario) => {
    switch (scenario) {
      case "cancellation":
        return VOICE_CANCELLATION_SCRIPT;
      case "availability":
        return VOICE_AVAILABILITY_SCRIPT;
      case "booking":
      default:
        return VOICE_BOOKING_SCRIPT;
    }
  };

  const currentScript = getActiveScript(voiceCallScenario);

  // Reset and start call when modal opens or scenario changes
  useEffect(() => {
    if (isCallModalOpen) {
      startNewCall(voiceCallScenario);
    } else {
      stopCall();
    }
    return () => {
      clearInterval(timerRef.current);
      clearTimeout(timeoutRef.current);
    };
  }, [isCallModalOpen, voiceCallScenario]);

  // Duration Timer
  useEffect(() => {
    if (callStatus === "connected") {
      timerRef.current = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [callStatus]);

  // Dialogue simulation progression
  useEffect(() => {
    if (callStatus === "connected" && isAutoPlaying && currentIndex < currentScript.length) {
      const step = currentScript[currentIndex];
      timeoutRef.current = setTimeout(() => {
        setTranscriptMessages((prev) => [...prev, step]);
        setCurrentIndex((i) => i + 1);

        // Check if this step completed a booking
        if (step.isCompletedBooking && step.bookingDetails) {
          setTimeout(() => {
            addAppointment({
              ...step.bookingDetails,
              patientName: patient.name,
              bookedVia: "Talk to MediVoice AI",
            });
          }, 800);
        }

        // Check if this step completed a cancellation
        if (step.isCompletedCancellation && step.targetDoctorName) {
          setTimeout(() => {
            cancelAppointmentByDoctor(step.targetDoctorName);
          }, 800);
        }
      }, step.delayMs || 1600);
    } else if (currentIndex >= currentScript.length && callStatus === "connected") {
      timeoutRef.current = setTimeout(() => {
        setCallStatus("ended");
      }, 3000);
    }
    return () => clearTimeout(timeoutRef.current);
  }, [callStatus, currentIndex, isAutoPlaying, currentScript, patient]);

  const startNewCall = (scenario = voiceCallScenario) => {
    clearTimeout(timeoutRef.current);
    clearInterval(timerRef.current);
    setCallStatus("connecting");
    setCallDuration(0);
    setTranscriptMessages([]);
    setCurrentIndex(0);
    setIsAutoPlaying(true);
    setIsMuted(false);

    // Simulate connection delay
    setTimeout(() => {
      setCallStatus("connected");
    }, 1200);
  };

  const stopCall = () => {
    clearTimeout(timeoutRef.current);
    clearInterval(timerRef.current);
    setCallStatus("ended");
  };

  const handleEndCall = () => {
    stopCall();
  };

  // Format seconds to mm:ss
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const currentSpeaker =
    transcriptMessages.length > 0
      ? transcriptMessages[transcriptMessages.length - 1].sender
      : "ai";

  return (
    <Modal
      isOpen={isCallModalOpen}
      onClose={closeCallModal}
      maxWidth="max-w-md"
      className="p-0 border-0 bg-transparent shadow-none"
    >
      {/* Phone-style Shell */}
      <div className="bg-charcoal-950 text-white rounded-[32px] border-4 border-charcoal-800 shadow-modal overflow-hidden flex flex-col relative">
        {/* Phone Top Notch / Speaker Bar */}
        <div className="pt-3 pb-2 flex justify-center items-center relative">
          <div className="w-20 h-4 bg-charcoal-900 rounded-full flex items-center justify-center gap-2 px-2">
            <span className="w-2 h-2 rounded-full bg-charcoal-700" />
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/80" />
          </div>
        </div>

        {/* Call Header */}
        <div className="px-6 pt-2 pb-3 text-center space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-charcoal-900 border border-charcoal-800 text-[11px] font-semibold text-emerald-400">
            <ShieldCheck className="w-3.5 h-3.5" />
            MediVoice AI • Clinical Voice Assistant
          </div>

          <h3 className="text-xl font-bold tracking-tight text-white pt-1">
            Talk to MediVoice AI
          </h3>

          {/* Call Status & Timer */}
          <div className="flex items-center justify-center gap-2 text-xs">
            {callStatus === "connecting" && (
              <span className="text-amber-400 flex items-center gap-1 font-medium animate-pulse">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                Connecting your call...
              </span>
            )}
            {callStatus === "connected" && (
              <span className="text-emerald-400 flex items-center gap-1.5 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Connected • <span className="font-mono text-white">{formatTime(callDuration)}</span>
              </span>
            )}
            {callStatus === "ended" && (
              <span className="text-charcoal-400 flex items-center gap-1 font-medium">
                <span className="w-2 h-2 rounded-full bg-charcoal-500" />
                Call Finished ({formatTime(callDuration)})
              </span>
            )}
          </div>
        </div>

        {/* Scenario Switcher Tabs */}
        <div className="px-5 pb-2">
          <div className="grid grid-cols-3 gap-1.5 p-1 bg-charcoal-900 rounded-xl text-[10px] font-semibold">
            <button
              type="button"
              onClick={() => {
                setVoiceCallScenario("booking");
                startNewCall("booking");
              }}
              className={`py-1.5 px-2 rounded-lg transition-all cursor-pointer ${
                voiceCallScenario === "booking"
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "text-charcoal-400 hover:text-white"
              }`}
            >
              1. Book Doctor
            </button>

            <button
              type="button"
              onClick={() => {
                setVoiceCallScenario("availability");
                startNewCall("availability");
              }}
              className={`py-1.5 px-2 rounded-lg transition-all cursor-pointer ${
                voiceCallScenario === "availability"
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "text-charcoal-400 hover:text-white"
              }`}
            >
              2. Check Slots
            </button>

            <button
              type="button"
              onClick={() => {
                setVoiceCallScenario("cancellation");
                startNewCall("cancellation");
              }}
              className={`py-1.5 px-2 rounded-lg transition-all cursor-pointer ${
                voiceCallScenario === "cancellation"
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "text-charcoal-400 hover:text-white"
              }`}
            >
              3. Cancel Visit
            </button>
          </div>
        </div>

        {/* Central Audio Visualizer & Avatar Area */}
        <div className="px-6 py-1 bg-gradient-to-b from-charcoal-950 via-charcoal-900 to-charcoal-950 flex flex-col items-center">
          {/* Pulsing AI Circle */}
          <div className="relative my-2">
            {callStatus === "connected" && !isMuted && (
              <span className="absolute inset-0 rounded-full bg-emerald-500/20 animate-ping duration-1000" />
            )}
            <div className="w-18 h-18 rounded-full bg-gradient-to-br from-emerald-600 to-emerald-800 flex items-center justify-center border-2 border-emerald-400/40 shadow-glow-green relative z-10">
              <Bot className="w-8 h-8 text-white" />
            </div>
          </div>

          {/* Real-time sound wave bars */}
          <AudioVisualizer
            isActive={callStatus === "connected"}
            isSpeaking={currentSpeaker === "ai"}
            isMuted={isMuted}
          />
        </div>

        {/* Live Transcript Stream in light container */}
        <div className="px-5 py-3 bg-white text-charcoal-900">
          <LiveTranscript messages={transcriptMessages} />
        </div>

        {/* Phone Action Controls Footer */}
        <div className="p-5 bg-charcoal-950 border-t border-charcoal-900 flex items-center justify-around">
          {/* Mute Toggle */}
          <button
            type="button"
            onClick={() => setIsMuted(!isMuted)}
            className={`w-12 h-12 rounded-full flex flex-col items-center justify-center transition-all cursor-pointer ${
              isMuted
                ? "bg-rose-500 text-white"
                : "bg-charcoal-800 text-charcoal-300 hover:bg-charcoal-700 hover:text-white"
            }`}
            title={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          {/* End Call / Replay Button */}
          {callStatus === "ended" ? (
            <button
              type="button"
              onClick={() => startNewCall(voiceCallScenario)}
              className="w-14 h-14 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center shadow-lg transition-transform active:scale-95 cursor-pointer"
              title="Restart Call Simulation"
            >
              <RotateCcw className="w-6 h-6" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleEndCall}
              className="w-14 h-14 rounded-full bg-rose-600 hover:bg-rose-700 text-white flex items-center justify-center shadow-lg transition-transform active:scale-95 cursor-pointer"
              title="End Call"
            >
              <PhoneOff className="w-6 h-6" />
            </button>
          )}

          {/* Speaker Toggle */}
          <button
            type="button"
            onClick={() => setIsSpeakerOn(!isSpeakerOn)}
            className={`w-12 h-12 rounded-full flex flex-col items-center justify-center transition-all cursor-pointer ${
              !isSpeakerOn
                ? "bg-charcoal-800 text-charcoal-500"
                : "bg-charcoal-800 text-charcoal-200 hover:bg-charcoal-700 hover:text-white"
            }`}
            title={isSpeakerOn ? "Speaker Off" : "Speaker On"}
          >
            {isSpeakerOn ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </Modal>
  );
}
