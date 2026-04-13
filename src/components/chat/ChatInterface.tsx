"use client";

import { AppHeader } from "@/components/layout/AppHeader";
import { MessageList } from "./MessageList";
import { VoiceInput } from "@/components/voice/VoiceInput";

export function ChatInterface() {
  return (
    <div className="flex flex-col h-screen bg-[#0A0B14]">
      <AppHeader />
      <div className="flex-1 overflow-hidden flex flex-col max-w-3xl w-full mx-auto">
        <MessageList />
        <div className="border-t border-white/5 bg-[#0A0B14]/90 backdrop-blur-xl">
          <VoiceInput />
        </div>
      </div>
    </div>
  );
}
