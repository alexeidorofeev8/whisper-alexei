"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, Square, Loader2, SendHorizontal } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { VoiceWaveform } from "./VoiceWaveform";

interface InputBarProps {
  onSubmit: (text: string) => void;
  placeholder?: string;
}

export function InputBar({ onSubmit, placeholder }: InputBarProps) {
  const [draft, setDraft] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const recordingState = useAppStore((s) => s.recordingState);
  const isAnalyzing = useAppStore((s) => s.isAnalyzing);
  const interimTranscript = useAppStore((s) => s.interimTranscript);
  const targetLanguage = useAppStore((s) => s.targetLanguage);

  const isRecording = recordingState === "recording";
  const isError = recordingState === "error";
  const speechLang = targetLanguage === "en" ? "en-US" : "de-DE";

  // When voice finishes — put transcript into textarea for editing, don't auto-submit
  const handleVoiceFinal = useCallback((transcript: string) => {
    setDraft(transcript);
    setTimeout(() => textareaRef.current?.focus(), 60);
  }, []);

  const { start, stop, isSupported } = useSpeechRecognition(handleVoiceFinal, speechLang);

  // While recording: textarea mirrors live interim transcript (read-only)
  // While idle: textarea shows editable draft
  const displayValue = isRecording ? interimTranscript : draft;
  const canSubmit = !isAnalyzing && !isRecording && draft.trim().length > 0;
  const micDisabled = isAnalyzing || !isSupported;

  // Auto-resize textarea height
  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = `${Math.min(ta.scrollHeight, 120)}px`;
  }, [displayValue]);

  const handleSubmit = () => {
    if (!canSubmit) return;
    onSubmit(draft.trim());
    setDraft("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleMicClick = () => {
    if (isRecording) stop();
    else if (!micDisabled) start();
  };

  const defaultPlaceholder = targetLanguage === "en"
    ? "Speak or type…"
    : "Sprechen oder tippen…";

  const statusText = !isSupported
    ? (targetLanguage === "en" ? "Use Chrome for voice" : "Chrome für Sprache verwenden")
    : isAnalyzing
    ? (targetLanguage === "en" ? "Analysing…" : "Analysiere…")
    : isError
    ? (targetLanguage === "en" ? "Error — try again" : "Fehler — erneut versuchen")
    : (targetLanguage === "en" ? "Enter to send · Shift+Enter for newline" : "Enter zum Senden · Shift+Enter für Zeilenumbruch");

  return (
    <div className="flex flex-col gap-2 py-3">

      {/* Text input row */}
      <div className="flex items-end gap-2">
        <textarea
          ref={textareaRef}
          value={displayValue}
          onChange={(e) => { if (!isRecording) setDraft(e.target.value); }}
          onKeyDown={handleKeyDown}
          readOnly={isRecording}
          disabled={isAnalyzing}
          placeholder={placeholder ?? defaultPlaceholder}
          rows={1}
          className={`
            flex-1 resize-none rounded-xl border px-3.5 py-2.5 text-sm
            leading-relaxed outline-none transition-colors
            ${isRecording
              ? "border-red-200 bg-red-50/50 text-slate-700 cursor-default"
              : isAnalyzing
              ? "border-slate-200 bg-slate-50 text-slate-400 cursor-not-allowed"
              : "border-slate-200 bg-white text-slate-800 hover:border-slate-300 focus:border-orange-300 focus:ring-2 focus:ring-orange-100"
            }
          `}
        />

        <AnimatePresence>
          {canSubmit && (
            <motion.button
              initial={{ opacity: 0, scale: 0.75 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.75 }}
              transition={{ duration: 0.12 }}
              onClick={handleSubmit}
              className="shrink-0 flex items-center justify-center w-10 h-10 rounded-xl bg-orange-100 text-orange-600 hover:bg-orange-200 transition-colors"
              aria-label="Send"
            >
              <SendHorizontal className="w-4 h-4" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Mic button row */}
      <div className="flex items-center gap-3">
        <motion.button
          onClick={handleMicClick}
          disabled={micDisabled}
          whileTap={{ scale: 0.92 }}
          className={`
            relative flex items-center justify-center w-9 h-9 rounded-full
            transition-colors duration-200 outline-none shrink-0
            ${isRecording
              ? "bg-red-50 border-2 border-red-400 text-red-600"
              : isError
              ? "bg-red-50 border-2 border-red-300 text-red-400"
              : micDisabled
              ? "bg-slate-100 border-2 border-slate-200 text-slate-400 cursor-not-allowed"
              : "bg-amber-50 border-2 border-amber-200 text-amber-500 hover:bg-amber-100 hover:border-amber-300"
            }
          `}
          aria-label={isRecording ? "Stop recording" : "Start recording"}
        >
          {isRecording && (
            <motion.span
              className="absolute inset-0 rounded-full border-2 border-red-400"
              animate={{ scale: [1, 1.55], opacity: [0.5, 0] }}
              transition={{ duration: 1.2, repeat: Infinity, ease: "easeOut" }}
            />
          )}
          {isAnalyzing ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : isRecording ? (
            <Square className="w-3 h-3 fill-current" />
          ) : (
            <Mic className="w-3.5 h-3.5" />
          )}
        </motion.button>

        <AnimatePresence>
          {isRecording && (
            <motion.div
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -6 }}
            >
              <VoiceWaveform active />
            </motion.div>
          )}
        </AnimatePresence>

        {!isRecording && (
          <p className="text-xs text-slate-400">{statusText}</p>
        )}
      </div>
    </div>
  );
}
