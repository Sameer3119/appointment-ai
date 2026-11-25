import React, { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  PhoneCall,
  PhoneOff,
  Mic,
  MicOff,
  Volume2,
  Bot,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { PipecatClient } from "@pipecat-ai/client-js";
import { SmallWebRTCTransport } from "@pipecat-ai/small-webrtc-transport";
import { Modal } from "../common/Modal";
import { AudioVisualizer } from "./AudioVisualizer";
import { LiveTranscript } from "./LiveTranscript";
import { useApp } from "../../context/AppContext";
import { API_BASE_URL } from "../../services/api";

export function VoiceCallModal() {
  const {
    isCallModalOpen,
    closeCallModal,
    fetchAppointments,
    fetchDoctors,
    addToast,
  } = useApp();

  // Real WebRTC call state: 'disconnected' | 'connecting' | 'connected' | 'error'
  const [callStatus, setCallStatus] = useState("disconnected");
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isBotSpeaking, setIsBotSpeaking] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  // Real transcripts from Pipecat events
  const [transcriptMessages, setTranscriptMessages] = useState([]);
  const [interimUserText, setInterimUserText] = useState("");

  const clientRef = useRef(null);
  const audioRef = useRef(null);
  const timerRef = useRef(null);
  const isConnectingRef = useRef(false);
  const currentBotMsgIdRef = useRef(null);

  const cleanupCallResources = useCallback(async () => {
    clearInterval(timerRef.current);
    timerRef.current = null;
    isConnectingRef.current = false;
    setIsBotSpeaking(false);
    setInterimUserText("");
    currentBotMsgIdRef.current = null;

    if (audioRef.current) {
      audioRef.current.srcObject = null;
    }

    const client = clientRef.current;
    clientRef.current = null;
    if (client) {
      try {
        await client.disconnect();
      } catch (err) {
        console.warn("[MediVoice WebRTC] Disconnect cleanup warning:", err);
      }
    }
  }, []);

  // Refresh SQLite-backed appointments & doctors after a call
  const refreshClinicData = useCallback(async () => {
    await Promise.all([fetchAppointments(), fetchDoctors()]);
  }, [fetchAppointments, fetchDoctors]);

  const startCall = useCallback(async () => {
    // Prevent multiple simultaneous connections from this browser session
    if (isConnectingRef.current || clientRef.current) {
      return;
    }

    isConnectingRef.current = true;
    setErrorMessage(null);
    setCallStatus("connecting");
    setCallDuration(0);
    setTranscriptMessages([]);
    setInterimUserText("");
    setIsMuted(false);
    setIsBotSpeaking(false);
    currentBotMsgIdRef.current = null;

    try {
      const transport = new SmallWebRTCTransport({
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
      });

      const client = new PipecatClient({
        transport,
        enableMic: true,
        enableCam: false,
        callbacks: {
          onConnected: () => {
            isConnectingRef.current = false;
            setCallStatus("connected");
            setErrorMessage(null);
          },
          onDisconnected: () => {
            isConnectingRef.current = false;
            setCallStatus("disconnected");
            setIsBotSpeaking(false);
            setInterimUserText("");
            currentBotMsgIdRef.current = null;
            if (audioRef.current) {
              audioRef.current.srcObject = null;
            }
            clientRef.current = null;
            refreshClinicData();
          },
          onBotStartedSpeaking: () => {
            setIsBotSpeaking(true);
          },
          onBotStoppedSpeaking: () => {
            setIsBotSpeaking(false);
            currentBotMsgIdRef.current = null;
          },
          onUserStartedSpeaking: () => {
            currentBotMsgIdRef.current = null;
          },
          onUserTranscript: (data) => {
            const text = data?.text?.trim();
            if (!text) return;
            if (data.final) {
              setInterimUserText("");
              setTranscriptMessages((prev) => [
                ...prev,
                {
                  id: `user-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
                  sender: "user",
                  text,
                },
              ]);
            } else {
              setInterimUserText(text);
            }
          },
          onBotTranscript: (data) => {
            const chunk = data?.text;
            if (!chunk) return;
            setTranscriptMessages((prev) => {
              const activeId = currentBotMsgIdRef.current;
              if (activeId) {
                return prev.map((msg) =>
                  msg.id === activeId ? { ...msg, text: `${msg.text}${chunk}` } : msg
                );
              }
              const newId = `ai-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
              currentBotMsgIdRef.current = newId;
              return [...prev, { id: newId, sender: "ai", text: chunk }];
            });
          },
          onTrackStarted: (track, participant) => {
            if (track?.kind === "audio" && !participant?.local && audioRef.current) {
              const stream = new MediaStream([track]);
              audioRef.current.srcObject = stream;
              audioRef.current.play().catch((playErr) => {
                console.warn("[MediVoice WebRTC] Audio autoplay blocked:", playErr);
              });
            }
          },
          onTrackStopped: (track, participant) => {
            if (track?.kind === "audio" && !participant?.local && audioRef.current) {
              audioRef.current.srcObject = null;
            }
          },
          onError: (errMsg) => {
            const detail =
              errMsg?.data?.error ||
              errMsg?.message ||
              "Voice pipeline reported an error.";
            setErrorMessage(detail);
            setCallStatus("error");
            isConnectingRef.current = false;
          },
        },
      });

      clientRef.current = client;

      await client.connect({
        webrtcRequestParams: {
          endpoint: `${API_BASE_URL}/voice/offer`,
        },
      });
    } catch (err) {
      await cleanupCallResources();
      let friendly = err?.message || "Failed to connect to MediVoice AI.";
      if (
        err?.name === "NotAllowedError" ||
        err?.name === "PermissionDeniedError" ||
        /permission/i.test(friendly)
      ) {
        friendly =
          "Microphone access was denied. Please allow microphone permissions in your browser and try again.";
      }
      setErrorMessage(friendly);
      setCallStatus("error");
      addToast({
        title: "Voice Call Connection Failed",
        message: friendly,
        type: "error",
      });
    }
  }, [addToast, cleanupCallResources, refreshClinicData]);

  const endCall = useCallback(async () => {
    await cleanupCallResources();
    setCallStatus("disconnected");
    await refreshClinicData();
  }, [cleanupCallResources, refreshClinicData]);

  const handleCloseModal = useCallback(async () => {
    await cleanupCallResources();
    setCallStatus("disconnected");
    closeCallModal();
    await refreshClinicData();
  }, [cleanupCallResources, closeCallModal, refreshClinicData]);

  const toggleMute = () => {
    if (!clientRef.current || callStatus !== "connected") return;
    const nextMuted = !isMuted;
    clientRef.current.enableMic(!nextMuted);
    setIsMuted(nextMuted);
  };

  // Duration timer while connected
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

  // Ensure cleanup on unmount or when modal closes externally
  useEffect(() => {
    if (!isCallModalOpen && clientRef.current) {
      cleanupCallResources();
      setCallStatus("disconnected");
    }
  }, [isCallModalOpen, cleanupCallResources]);

  useEffect(() => {
    return () => {
      cleanupCallResources();
    };
  }, [cleanupCallResources]);

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const isCallActive = callStatus === "connecting" || callStatus === "connected";

  return (
    <Modal isOpen={isCallModalOpen} onClose={handleCloseModal} maxWidth="max-w-2xl">
      <div className="space-y-4">
        {/* Hidden remote WebRTC audio output element */}
        <audio ref={audioRef} autoPlay playsInline className="hidden" />

        {/* Top Calling Header */}
        <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 text-white rounded-2xl p-5 shadow-call relative overflow-hidden">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-emerald-300">
                <Bot className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-white">MediVoice Clinical AI</h3>
                  <span
                    className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full border ${
                      callStatus === "connected"
                        ? "bg-emerald-400/20 text-emerald-200 border-emerald-400/40"
                        : callStatus === "error"
                        ? "bg-rose-400/20 text-rose-200 border-rose-400/40"
                        : "bg-white/10 text-emerald-100 border-white/20"
                    }`}
                  >
                    {callStatus === "connected"
                      ? "Live WebRTC"
                      : callStatus === "connecting"
                      ? "Connecting"
                      : callStatus === "error"
                      ? "Error"
                      : "Disconnected"}
                  </span>
                </div>
                <p className="text-xs text-emerald-100/80 mt-0.5 flex items-center gap-2 font-mono">
                  {callStatus === "connecting" && (
                    <span className="inline-flex items-center gap-1.5 text-amber-300">
                      <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                      Negotiating WebRTC Audio...
                    </span>
                  )}
                  {callStatus === "connected" && (
                    <span className="inline-flex items-center gap-1.5 text-emerald-300">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      Connected • {formatDuration(callDuration)}
                    </span>
                  )}
                  {callStatus === "disconnected" && (
                    <span className="text-emerald-100/75">
                      Ready to start a real-time voice call
                    </span>
                  )}
                  {callStatus === "error" && (
                    <span className="text-rose-200">Connection failed</span>
                  )}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={refreshClinicData}
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-emerald-100 flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Refresh appointments from database"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Sync</span>
            </button>
          </div>

          {/* Audio Wave Visualizer */}
          <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-emerald-200">
              <Volume2 className="w-4 h-4 text-emerald-400" />
              <span>
                {callStatus === "connected"
                  ? "Real-Time SmallWebRTC Audio Active"
                  : "Microphone & Speaker Standby"}
              </span>
            </div>
            <AudioVisualizer
              isActive={callStatus === "connected"}
              isSpeaking={isBotSpeaking}
              isMuted={isMuted}
            />
          </div>
        </div>

        {/* Error Banner */}
        {errorMessage && (
          <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 flex items-start gap-2.5 text-xs text-rose-900">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div className="leading-relaxed">{errorMessage}</div>
          </div>
        )}

        {/* Live Transcript Box */}
        <div className="bg-[#FAFBF9] border border-charcoal-200/80 rounded-2xl p-4 min-h-[220px] max-h-[300px] overflow-y-auto">
          <LiveTranscript
            messages={transcriptMessages}
            interimUserText={interimUserText}
            callStatus={callStatus}
          />
        </div>

        {/* Footer Call Action Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleMute}
              disabled={callStatus !== "connected"}
              className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                callStatus !== "connected"
                  ? "opacity-50 cursor-not-allowed bg-charcoal-50 border-charcoal-200 text-charcoal-400"
                  : isMuted
                  ? "bg-rose-50 border-rose-300 text-rose-700 cursor-pointer"
                  : "bg-white border-charcoal-200 text-charcoal-700 hover:bg-charcoal-50 cursor-pointer"
              }`}
            >
              {isMuted ? (
                <MicOff className="w-4 h-4" />
              ) : (
                <Mic className="w-4 h-4 text-emerald-700" />
              )}
              <span>{isMuted ? "Unmute" : "Mute"}</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/appointments"
              onClick={handleCloseModal}
              className="px-4 py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold rounded-xl border border-emerald-200 transition-colors"
            >
              View Appointments
            </Link>

            {!isCallActive ? (
              <button
                type="button"
                onClick={startCall}
                className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
              >
                <PhoneCall className="w-4 h-4" />
                <span>Start Call</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={endCall}
                className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
              >
                <PhoneOff className="w-4 h-4" />
                <span>End Call</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
}
