"use client";

import { useCallback, useState } from "react";
import { Difficulty, DialogChat, DialogReplyResult, Scenario } from "@/lib/types";
import { useAppStore } from "@/store/useAppStore";
import { useDialogStore } from "@/store/useDialogStore";

interface UseDialogReturn {
  chats: DialogChat[];
  activeChat: DialogChat | null;
  hasHydrated: boolean;
  isCreating: boolean;
  error: string | null;
  selectChat: (id: string) => void;
  createNewChat: (difficulty?: Difficulty) => Promise<void>;
  deleteChat: (id: string) => void;
  sendUserTurn: (text: string) => Promise<void>;
}

export function useDialog(): UseDialogReturn {
  const setIsAnalyzing = useAppStore((s) => s.setIsAnalyzing);

  const chats = useDialogStore((s) => s.chats);
  const activeChatId = useDialogStore((s) => s.activeChatId);
  const hasHydrated = useDialogStore((s) => s.hasHydrated);
  const setActiveChatId = useDialogStore((s) => s.setActiveChatId);
  const createChatInStore = useDialogStore((s) => s.createChat);
  const deleteChatInStore = useDialogStore((s) => s.deleteChat);
  const addExchange = useDialogStore((s) => s.addExchange);

  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const activeChat = chats.find((c) => c.id === activeChatId) ?? null;

  const selectChat = useCallback(
    (id: string) => {
      setActiveChatId(id);
    },
    [setActiveChatId]
  );

  const deleteChat = useCallback(
    (id: string) => {
      deleteChatInStore(id);
    },
    [deleteChatInStore]
  );

  const createNewChat = useCallback(
    async (difficulty: Difficulty = "medium") => {
      setIsCreating(true);
      setError(null);
      try {
        const recent = chats
          .slice(0, 5)
          .map((c) => ({ role: c.scenario.role, situation: c.scenario.situation }));

        const res = await fetch("/api/scenario", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ difficulty, avoid: recent }),
        });
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body.detail || body.error || `HTTP ${res.status}`);
        }
        const scenario: Scenario = await res.json();
        createChatInStore(scenario, scenario.opener);
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        setError(msg);
      } finally {
        setIsCreating(false);
      }
    },
    [chats, createChatInStore]
  );

  const sendUserTurn = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || !activeChat) return;
      setIsAnalyzing(true);
      setError(null);
      try {
        const res = await fetch("/api/dialog/reply", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            scenario: activeChat.scenario,
            turns: activeChat.turns,
            newUserText: trimmed,
          }),
        });
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body.detail || body.error || `HTTP ${res.status}`);
        }
        const data: DialogReplyResult = await res.json();
        addExchange(activeChat.id, trimmed, data.analysis, data.reply);
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        setError(msg);
      } finally {
        setIsAnalyzing(false);
      }
    },
    [activeChat, addExchange, setIsAnalyzing]
  );

  return {
    chats,
    activeChat,
    hasHydrated,
    isCreating,
    error,
    selectChat,
    createNewChat,
    deleteChat,
    sendUserTurn,
  };
}
