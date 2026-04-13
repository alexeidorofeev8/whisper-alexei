"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { useAppStore } from "@/store/useAppStore";

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
  const accumulatedRef = useRef(""); // накапливаем все финальные фрагменты
  const { setRecordingState, setInterimTranscript, setFinalTranscript } =
    useAppStore();

  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    setIsSupported(
      "SpeechRecognition" in window || "webkitSpeechRecognition" in window
    );
  }, []);

  const start = useCallback(() => {
    if (!isSupported) return;
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return;

    accumulatedRef.current = "";

    const recognition = new SR();
    recognition.lang = "de-DE";
    recognition.interimResults = true;
    recognition.continuous = true;   // не останавливаться на паузах
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setRecordingState("recording");

    recognition.onresult = (event) => {
      let interim = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const t = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          accumulatedRef.current += (accumulatedRef.current ? " " : "") + t.trim();
        } else {
          interim = t;
        }
      }
      // показываем накопленное + текущий промежуточный результат
      setInterimTranscript(
        (accumulatedRef.current + (interim ? " " + interim : "")).trim()
      );
    };

    recognition.onerror = (e) => {
      // network/no-speech ошибки — не падаем, продолжаем
      if (e.error === "no-speech") return;
      setRecordingState("error");
      setTimeout(() => setRecordingState("idle"), 2000);
    };

    recognition.onend = () => {
      setRecordingState("idle");
      setInterimTranscript("");
      const final = accumulatedRef.current.trim();
      accumulatedRef.current = "";
      if (final) {
        setFinalTranscript(final);
        onFinal(final);
      }
    };

    recognitionRef.current = recognition;
    recognition.start();
  }, [isSupported, onFinal, setRecordingState, setInterimTranscript, setFinalTranscript]);

  const stop = useCallback(() => {
    // stop() → дождаться onend → там вызовем onFinal
    recognitionRef.current?.stop();
  }, []);

  useEffect(() => {
    return () => recognitionRef.current?.abort();
  }, []);

  return { start, stop, isSupported };
}
