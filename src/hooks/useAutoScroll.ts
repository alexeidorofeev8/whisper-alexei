"use client";

import { useEffect, useRef } from "react";
import { useAppStore } from "@/store/useAppStore";

export function useAutoScroll() {
  const bottomRef = useRef<HTMLDivElement>(null);
  const messages = useAppStore((s) => s.messages);
  const isAnalyzing = useAppStore((s) => s.isAnalyzing);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isAnalyzing]);

  return { bottomRef };
}
