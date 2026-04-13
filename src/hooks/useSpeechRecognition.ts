"use client";

import { useEffect, useRef, useCallback } from "react";
import { useAppStore } from "@/store/useAppStore";

// Web Speech API typings (not fully covered in all TS lib versions)
interface ISpeechRecognition extends EventTarget {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  maxAlternatives: number;
  start(): void;
  stop(): void;
  abort(): void;
  onstart: (() => void) | null;
  onend: (() => void) | null;
  onerror: ((e: { error: string }) => void) | null;
  onresult: ((e: ISpeechRecognitionEvent) => void) | null;
}

interface ISpeechRecognitionEvent {
  resultIndex: number;
  results: {
    length: number;
    [index: number]: {
      isFinal: boolean;
      0: { transcript: string };
    };
  };
}

declare global {
  interface Window {
    SpeechRecognition?: new () => ISpeechRecognition;
    webkitSpeechRecognition?: new () => ISpeechRecognition;
  }
}

export function useSpeechRecognition(onFinal: (transcript: string) => void) {
  const recognitionRef = useRef<ISpeechRecognition | null>(null);
  const { setRecordingState, setInterimTranscript, setFinalTranscript } =
    useAppStore();

  const isSupported =
    typeof window !== "undefined" &&
    ("SpeechRecognition" in window || "webkitSpeechRecognition" in window);

  const start = useCallback(() => {
    if (typeof window === "undefined") return;
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return;

    const recognition = new SR();
    recognition.lang = "de-DE";
    recognition.interimResults = true;
    recognition.continuous = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setRecordingState("recording");

    recognition.onresult = (event) => {
      let interim = "";
      let final = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const t = event.results[i][0].transcript;
        if (event.results[i].isFinal) final += t;
        else interim += t;
      }
      if (interim) setInterimTranscript(interim);
      if (final) {
        setFinalTranscript(final);
        setInterimTranscript("");
        onFinal(final.trim());
      }
    };

    recognition.onerror = () => {
      setRecordingState("error");
      setTimeout(() => setRecordingState("idle"), 2000);
    };

    recognition.onend = () => {
      setRecordingState("idle");
      setInterimTranscript("");
    };

    recognitionRef.current = recognition;
    recognition.start();
  }, [isSupported, onFinal, setRecordingState, setInterimTranscript, setFinalTranscript]);

  const stop = useCallback(() => {
    recognitionRef.current?.stop();
  }, []);

  useEffect(() => {
    return () => recognitionRef.current?.abort();
  }, []);

  return { start, stop, isSupported };
}
