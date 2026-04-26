"use client";

import { useCallback } from "react";
import { motion } from "framer-motion";
import { Mic, Square, Loader2 } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";

interface VoiceOnlyButtonProps {
  onSubmit: (text: string) => void;
  speechLang?: string;
}

/**
 * Single big mic button: tap to start, tap to stop.
 * Stop auto-submits the transcript. No textarea, no interim display.
 */
export function VoiceOnlyButton({ onSubmit, speechLang = "de-DE" }: VoiceOnlyButtonProps) {
  const recordingState = useAppStore((s) => s.recordingState);
  const isAnalyzing = useAppStore((s) => s.isAnalyzing);
  const isRecording = recordingState === "recording";

  const handleFinal = useCallback(
    (transcript: string) => {
      const t = transcript.trim();
      if (t) onSubmit(t);
    },
    [onSubmit]
  );

  const { start, stop, isSupported } = useSpeechRecognition(handleFinal, speechLang);

  const disabled = isAnalyzing || !isSupported;

  const handleClick = () => {
    if (isRecording) stop();
    else if (!disabled) start();
  };

  const label = !isSupported
    ? "Web Speech API nicht unterstützt — bitte Chrome verwenden"
    : isAnalyzing
    ? "Bitte warten…"
    : isRecording
    ? "Tippen zum Stoppen"
    : "Tippen und sprechen";

  return (
    <div className="flex items-center justify-center py-6">
      <motion.button
        onClick={handleClick}
        disabled={disabled}
        whileTap={{ scale: 0.94 }}
        className={`
          relative flex items-center justify-center w-20 h-20 rounded-full
          transition-colors duration-200 outline-none shadow-md
          ${
            isRecording
              ? "bg-red-50 border-2 border-red-400 text-red-600"
              : disabled
              ? "bg-slate-100 border-2 border-slate-200 text-slate-400 cursor-not-allowed"
              : "bg-amber-50 border-2 border-amber-200 text-amber-500 hover:bg-amber-100 hover:border-amber-300"
          }
        `}
        aria-label={label}
      >
        {isRecording && (
          <motion.span
            className="absolute inset-0 rounded-full border-2 border-red-400"
            animate={{ scale: [1, 1.6], opacity: [0.5, 0] }}
            transition={{ duration: 1.2, repeat: Infinity, ease: "easeOut" }}
          />
        )}
        {isAnalyzing ? (
          <Loader2 className="w-7 h-7 animate-spin" />
        ) : isRecording ? (
          <Square className="w-6 h-6 fill-current" />
        ) : (
          <Mic className="w-7 h-7" />
        )}
      </motion.button>
    </div>
  );
}
