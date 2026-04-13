"use client";

import { useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, MicOff, Loader2 } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { useAnalysis } from "@/hooks/useAnalysis";
import { VoiceWaveform } from "./VoiceWaveform";
import { TranscriptPreview } from "./TranscriptPreview";

export function VoiceInput() {
  const recordingState = useAppStore((s) => s.recordingState);
  const isAnalyzing = useAppStore((s) => s.isAnalyzing);
  const { analyze } = useAnalysis();

  const handleFinal = useCallback(
    (transcript: string) => {
      if (transcript) analyze(transcript);
    },
    [analyze]
  );

  const { start, stop, isSupported } = useSpeechRecognition(handleFinal);

  const isRecording = recordingState === "recording";
  const isError = recordingState === "error";
  const isDisabled = isAnalyzing || !isSupported;

  const handleClick = () => {
    if (isRecording) stop();
    else if (!isDisabled) start();
  };

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
              ? "bg-red-500/20 border-2 border-red-500 text-red-400"
              : isError
              ? "bg-red-900/30 border-2 border-red-700 text-red-500"
              : isDisabled
              ? "bg-zinc-800/50 border-2 border-zinc-700 text-zinc-600 cursor-not-allowed"
              : "bg-indigo-500/10 border-2 border-indigo-500/50 text-indigo-400 hover:bg-indigo-500/20 hover:border-indigo-400"
            }
          `}
          aria-label={isRecording ? "Aufnahme stoppen" : "Aufnahme starten"}
        >
          {isRecording && (
            <motion.span
              className="absolute inset-0 rounded-full border-2 border-red-500"
              animate={{ scale: [1, 1.4], opacity: [0.6, 0] }}
              transition={{ duration: 1.2, repeat: Infinity, ease: "easeOut" }}
            />
          )}
          {isAnalyzing ? (
            <Loader2 className="w-6 h-6 animate-spin" />
          ) : isRecording ? (
            <MicOff className="w-6 h-6" />
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

      <p className="text-xs text-zinc-600">
        {!isSupported
          ? "Web Speech API nicht unterstützt — nutze Chrome"
          : isAnalyzing
          ? "Analysiere..."
          : isRecording
          ? "Sprich jetzt — klicke zum Stoppen"
          : isError
          ? "Fehler — bitte erneut versuchen"
          : "Klicke und sprich auf Deutsch"}
      </p>
    </div>
  );
}
