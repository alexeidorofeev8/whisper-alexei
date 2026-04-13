"use client";

import { AppHeader } from "@/components/layout/AppHeader";
import { MessageList } from "./MessageList";
import { VoiceInput } from "@/components/voice/VoiceInput";

export function ChatInterface() {
  return (
    <div className="flex flex-col h-screen bg-[#F8FAFC]">
      <AppHeader />
      <div className="flex-1 overflow-hidden flex flex-col max-w-3xl w-full mx-auto">
        <MessageList />
        <div className="border-t border-slate-200 bg-white/90 backdrop-blur-xl">
          <VoiceInput />
        </div>
      </div>
    </div>
  );
}
