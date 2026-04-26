"use client";

import { create } from "zustand";
import {
  AppMode,
  Message,
  RecordingState,
  TargetLanguage,
  TranslationDifficulty,
  TranslationPhrase,
} from "@/lib/types";

interface AppState {
  messages: Message[];
  addMessage: (msg: Message) => void;
  clearMessages: () => void;
  clearTranslationHistory: () => void;

  recordingState: RecordingState;
  setRecordingState: (s: RecordingState) => void;
  interimTranscript: string;
  setInterimTranscript: (t: string) => void;
  finalTranscript: string;
  setFinalTranscript: (t: string) => void;

  isAnalyzing: boolean;
  setIsAnalyzing: (v: boolean) => void;

  totalErrors: number;
  sessionLevel: string;
  incrementErrors: (count: number) => void;
  setSessionLevel: (level: string) => void;

  selectedErrorId: string | null;
  setSelectedErrorId: (id: string | null) => void;

  targetLanguage: TargetLanguage;
  setTargetLanguage: (lang: TargetLanguage) => void;

  currentMode: AppMode;
  setCurrentMode: (m: AppMode) => void;

  translationDifficulty: TranslationDifficulty;
  setTranslationDifficulty: (d: TranslationDifficulty) => void;

  currentPhrase: TranslationPhrase | null;
  setCurrentPhrase: (p: TranslationPhrase | null) => void;

  usedPhrases: string[];
  addUsedPhrase: (phrase: string) => void;
}

export const useAppStore = create<AppState>((set) => ({
  messages: [],
  addMessage: (msg) => set((s) => ({ messages: [...s.messages, msg] })),
  clearMessages: () => set({ messages: [], currentPhrase: null }),
  clearTranslationHistory: () => set({ messages: [] }),

  recordingState: "idle",
  setRecordingState: (s) => set({ recordingState: s }),
  interimTranscript: "",
  setInterimTranscript: (t) => set({ interimTranscript: t }),
  finalTranscript: "",
  setFinalTranscript: (t) => set({ finalTranscript: t }),

  isAnalyzing: false,
  setIsAnalyzing: (v) => set({ isAnalyzing: v }),

  totalErrors: 0,
  sessionLevel: "B1",
  incrementErrors: (count) => set((s) => ({ totalErrors: s.totalErrors + count })),
  setSessionLevel: (level) => set({ sessionLevel: level }),

  selectedErrorId: null,
  setSelectedErrorId: (id) => set({ selectedErrorId: id }),

  targetLanguage: "en",
  setTargetLanguage: (lang) => set({ targetLanguage: lang }),

  currentMode: "translation",
  setCurrentMode: (m) => set({ currentMode: m }),

  translationDifficulty: "easy",
  setTranslationDifficulty: (d) => set({ translationDifficulty: d }),

  currentPhrase: null,
  setCurrentPhrase: (p) => set({ currentPhrase: p }),

  usedPhrases: [],
  addUsedPhrase: (phrase) =>
    set((s) => ({ usedPhrases: [...s.usedPhrases.slice(-9), phrase] })),
}));
