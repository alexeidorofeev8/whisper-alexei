"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { AnalysisResult, DialogChat, DialogTurn, Scenario } from "@/lib/types";

interface DialogState {
  chats: DialogChat[];
  activeChatId: string | null;
  hasHydrated: boolean;

  setActiveChatId: (id: string | null) => void;
  setHasHydrated: (v: boolean) => void;

  /** Create a new chat from a generated scenario, optionally with the AI's opener turn baked in. */
  createChat: (scenario: Scenario, opener?: string) => string;

  /** Permanently delete a chat. If it was active, clears active. */
  deleteChat: (id: string) => void;

  /** Append a user turn (with its analysis) and an assistant turn (the in-role reply). */
  addExchange: (
    chatId: string,
    userText: string,
    analysis: AnalysisResult,
    assistantText: string
  ) => void;

  /** Clear everything (used for "wipe data" debug action). */
  clearAll: () => void;
}

function makeId(): string {
  return crypto.randomUUID();
}

function makeTitle(scenario: Scenario): string {
  const role = scenario.role.trim();
  return role.length > 32 ? role.slice(0, 32) + "…" : role;
}

export const useDialogStore = create<DialogState>()(
  persist(
    (set) => ({
      chats: [],
      activeChatId: null,
      hasHydrated: false,

      setActiveChatId: (id) => set({ activeChatId: id }),
      setHasHydrated: (v) => set({ hasHydrated: v }),

      createChat: (scenario, opener) => {
        const id = makeId();
        const now = Date.now();
        const turns: DialogTurn[] = [];
        if (opener && opener.trim()) {
          turns.push({
            id: makeId(),
            role: "assistant",
            text: opener.trim(),
            timestamp: now,
          });
        }
        const chat: DialogChat = {
          id,
          scenario,
          title: makeTitle(scenario),
          turns,
          createdAt: now,
          updatedAt: now,
        };
        set((s) => ({ chats: [chat, ...s.chats], activeChatId: id }));
        return id;
      },

      deleteChat: (id) =>
        set((s) => ({
          chats: s.chats.filter((c) => c.id !== id),
          activeChatId: s.activeChatId === id ? null : s.activeChatId,
        })),

      addExchange: (chatId, userText, analysis, assistantText) =>
        set((s) => {
          const now = Date.now();
          const userTurn: DialogTurn = {
            id: makeId(),
            role: "user",
            text: userText,
            analysis,
            timestamp: now,
          };
          const assistantTurn: DialogTurn = {
            id: makeId(),
            role: "assistant",
            text: assistantText,
            timestamp: now + 1,
          };
          return {
            chats: s.chats.map((c) =>
              c.id === chatId
                ? {
                    ...c,
                    turns: [...c.turns, userTurn, assistantTurn],
                    updatedAt: now,
                  }
                : c
            ),
          };
        }),

      clearAll: () => set({ chats: [], activeChatId: null }),
    }),
    {
      name: "linguaflow-dialog-v1",
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({ chats: s.chats, activeChatId: s.activeChatId }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
