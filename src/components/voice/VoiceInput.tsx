"use client";

import { useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, Square, Loader2 } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { VoiceWaveform } from "./VoiceWaveform";
import { TranscriptPreview } from "./TranscriptPreview";

interface VoiceInputProps {
  onFinal: (transcript: string) => void;
}

export function VoiceInput({ onFinal }: VoiceInputProps) {
  const recordingState = useAppStore((s) => s.recordingState);
  const isAnalyzing = useAppStore((s) => s.isAnalyzing);
  const targetLanguage = useAppStore((s) => s.targetLanguage);

  const speechLang = targetLanguage === "en" ? "en-US" : "de-DE";

  const handleFinal = useCallback(
    (transcript: string) => {
      if (transcript) onFinal(transcript);
    },
    [onFinal]
  );

  const { start, stop, isSupported } = useSpeechRecognition(handleFinal, speechLang);

  const isRecording = recordingState === "recording";
  const isError = recordingState === "error";
  const isDisabled = isAnalyzing || !isSupported;

  const handleClick = () => {
    if (isRecording) stop();
    else if (!isDisabled) start();
  };

  const labels =
    targetLanguage === "en"
      ? {
          notSupported: "Web Speech API not supported — use Chrome",
          analyzing: "Analysing…",
          recording: "Speak — click to stop",
          error: "Error — please try again",
          idle: "Click and speak in English",
        }
      : {
          notSupported: "Web Speech API nicht unterstützt — nutze Chrome",
          analyzing: "Analysiere…",
          recording: "Sprich — klicke zum Stoppen",
          error: "Fehler — bitte erneut versuchen",
          idle: "Klicke und sprich auf Deutsch",
        };

  const statusText = !isSupported
    ? labels.notSupported
    : isAnalyzing
    ? labels.analyzing
    : isRecording
    ? labels.recording
    : isError
    ? labels.error
    : labels.idle;

  return (
    <div className="flex flex-col items-center gap-3 py-4">
      <TranscriptPreview />
      <div className="flex items-center gap-4">
        <motion.button
          onClick={handleClick}
          disabled={isDisabled}
          whileTap={{ scale: 0.93 }}
          className={`
            relative flex items-center justify-center w-16 h-16 rounded-full
            transition-colors duration-200 outline-none
            ${isRecording
              ? "bg-red-50 border-2 border-red-400 text-red-600"
              : isError
              ? "bg-red-50 border-2 border-red-300 text-red-400"
              : isDisabled
              ? "bg-slate-100 border-2 border-slate-200 text-slate-400 cursor-not-allowed"
              : "bg-amber-50 border-2 border-amber-200 text-amber-500 hover:bg-amber-100 hover:border-amber-300"
            }
          `}
          aria-label={isRecording ? labels.recording : labels.idle}
        >
          {isRecording && (
            <motion.span
              className="absolute inset-0 rounded-full border-2 border-red-400"
              animate={{ scale: [1, 1.4], opacity: [0.5, 0] }}
              transition={{ duration: 1.2, repeat: Infinity, ease: "easeOut" }}
            />
          )}
          {isAnalyzing ? (
            <Loader2 className="w-6 h-6 animate-spin" />
          ) : isRecording ? (
            <Square className="w-5 h-5 fill-current" />
          ) : (
            <Mic className="w-6 h-6" />
          )}
        </motion.button>

        <AnimatePresence>
          {isRecording && (
            <motion.div
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
            >
              <VoiceWaveform active={isRecording} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <p className="text-xs text-slate-400">{statusText}</p>
    </div>
  );
}
