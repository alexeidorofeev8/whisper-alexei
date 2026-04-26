"use client";

import { useEffect } from "react";
import { useDialog } from "@/hooks/useDialog";
import { useAppStore } from "@/store/useAppStore";
import { InputBar } from "@/components/voice/InputBar";
import { DialogSidebar } from "./DialogSidebar";
import { ScenarioCard } from "./ScenarioCard";
import { DialogMessageList } from "./DialogMessageList";
import { EmptyState } from "./EmptyState";
import { StreakBadge } from "./StreakBadge";

export function DialogInterface() {
  const setTargetLanguage = useAppStore((s) => s.setTargetLanguage);
  const {
    chats,
    activeChat,
    hasHydrated,
    isCreating,
    error,
    selectChat,
    createNewChat,
    deleteChat,
    sendUserTurn,
  } = useDialog();

  // Force the language label to DE while in Dialog mode (chat bubbles use it for their badge)
  useEffect(() => {
    setTargetLanguage("de");
  }, [setTargetLanguage]);

  if (!hasHydrated) {
    return (
      <div className="flex flex-1 items-center justify-center text-sm text-stone-400">
        Lade…
      </div>
    );
  }

  return (
    <div className="flex flex-1 overflow-hidden">
      <DialogSidebar
        chats={chats}
        activeChatId={activeChat?.id ?? null}
        isCreating={isCreating}
        onCreate={createNewChat}
        onSelect={selectChat}
        onDelete={deleteChat}
      />

      <section className="flex flex-1 flex-col overflow-hidden">
        {!activeChat ? (
          <EmptyState isCreating={isCreating} onCreate={createNewChat} />
        ) : (
          <>
            <div className="px-4 pt-4">
              <div className="mb-2 flex items-center justify-end">
                <StreakBadge />
              </div>
              <ScenarioCard scenario={activeChat.scenario} />
            </div>

            <div className="flex-1 overflow-y-auto">
              <DialogMessageList turns={activeChat.turns} isLoading={false} />
            </div>

            {error && (
              <div className="mx-4 mb-2 rounded-xl border border-red-100 bg-red-50 px-3 py-2 text-xs text-red-700">
                <span className="font-medium">Fehler:</span> {error}
              </div>
            )}

            <div className="border-t border-stone-200 bg-white/90 backdrop-blur-xl px-2">
              <InputBar
                onSubmit={sendUserTurn}
                placeholder="Antworte auf Deutsch…"
                speechLang="de-DE"
              />
            </div>
          </>
        )}
      </section>
    </div>
  );
}
