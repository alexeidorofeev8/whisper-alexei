"use client";

import { Plus, Trash2, Loader2, MessageCircle } from "lucide-react";
import { Difficulty, DialogChat } from "@/lib/types";

interface DialogSidebarProps {
  chats: DialogChat[];
  activeChatId: string | null;
  isCreating: boolean;
  onCreate: (difficulty: Difficulty) => void;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
}

export function DialogSidebar({
  chats,
  activeChatId,
  isCreating,
  onCreate,
  onSelect,
  onDelete,
}: DialogSidebarProps) {
  return (
    <aside className="flex h-full w-full flex-col gap-3 border-r border-stone-200 bg-white/50 p-3 sm:w-64">

      {/* Primary CTA */}
      <button
        onClick={() => onCreate("medium")}
        disabled={isCreating}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-100 px-3 py-2.5 text-sm font-semibold text-orange-800 hover:bg-orange-200 disabled:opacity-60 disabled:cursor-not-allowed transition-colors shadow-sm"
      >
        {isCreating ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Generiere…
          </>
        ) : (
          <>
            <Plus className="w-4 h-4" />
            Neuer Chat
          </>
        )}
      </button>

      {/* Chats list */}
      <div className="flex-1 overflow-y-auto pt-1">
        {chats.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 py-8 text-center text-xs text-stone-400">
            <MessageCircle className="w-6 h-6" />
            <p>Noch keine Chats.</p>
          </div>
        ) : (
          <ul className="flex flex-col gap-1">
            {chats.map((c) => (
              <li key={c.id}>
                <div
                  className={`group flex items-center gap-1 rounded-xl border transition-colors ${
                    activeChatId === c.id
                      ? "border-orange-200 bg-orange-50"
                      : "border-transparent hover:bg-stone-50"
                  }`}
                >
                  <button
                    onClick={() => onSelect(c.id)}
                    className="flex flex-1 flex-col gap-0.5 px-3 py-2 text-left min-w-0"
                  >
                    <span
                      className={`truncate text-sm font-medium ${
                        activeChatId === c.id ? "text-orange-800" : "text-stone-700"
                      }`}
                    >
                      {c.title}
                    </span>
                    <span className="truncate text-[11px] text-stone-400">
                      {c.scenario.situation}
                    </span>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm(`Chat "${c.title}" löschen?`)) onDelete(c.id);
                    }}
                    className="mr-1 rounded-lg p-1.5 text-stone-400 opacity-0 transition-all hover:bg-rose-50 hover:text-rose-600 group-hover:opacity-100"
                    aria-label="Chat löschen"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </aside>
  );
}
