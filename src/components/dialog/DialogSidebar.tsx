"use client";

import { Plus, Trash2, Loader2 } from "lucide-react";
import { Difficulty, DialogChat } from "@/lib/types";

interface DialogSidebarProps {
  chats: DialogChat[];
  activeChatId: string | null;
  isCreating: boolean;
  onCreate: (difficulty: Difficulty) => void;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
}

function initial(role: string): string {
  const trimmed = role.trim();
  if (!trimmed) return "?";
  // First letter, uppercased; if multi-word and second word starts with capital,
  // try to combine, but a single letter is fine and keeps the column tight.
  return trimmed[0].toUpperCase();
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
    <aside className="flex h-full w-14 shrink-0 flex-col items-center gap-2 border-r border-stone-200 bg-white/60 py-3">

      {/* New chat — icon-only */}
      <button
        onClick={() => onCreate("medium")}
        disabled={isCreating}
        title="Neuer Chat"
        className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100 text-orange-700 shadow-sm hover:bg-orange-200 disabled:cursor-not-allowed disabled:opacity-60 transition-colors"
      >
        {isCreating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
      </button>

      {/* Chats list */}
      <div className="flex flex-1 flex-col gap-1.5 overflow-y-auto pt-2">
        {chats.map((c) => {
          const active = activeChatId === c.id;
          return (
            <div key={c.id} className="group relative">
              <button
                onClick={() => onSelect(c.id)}
                title={c.scenario.role}
                className={`flex h-9 w-9 items-center justify-center rounded-lg border text-sm font-semibold transition-colors ${
                  active
                    ? "border-orange-300 bg-orange-100 text-orange-800"
                    : "border-stone-200 bg-white text-stone-600 hover:border-stone-300 hover:bg-stone-50"
                }`}
              >
                {initial(c.scenario.role)}
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (confirm(`Chat "${c.scenario.role}" löschen?`)) onDelete(c.id);
                }}
                title="Löschen"
                className="absolute -right-1 -top-1 hidden h-4 w-4 items-center justify-center rounded-full border border-stone-200 bg-white text-stone-400 shadow-sm hover:text-rose-600 group-hover:flex"
              >
                <Trash2 className="h-2.5 w-2.5" />
              </button>
            </div>
          );
        })}
      </div>
    </aside>
  );
}
