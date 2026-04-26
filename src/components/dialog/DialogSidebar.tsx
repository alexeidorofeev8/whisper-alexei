"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, Loader2, MessageCircle } from "lucide-react";
import { Difficulty, DialogChat } from "@/lib/types";
import { useState } from "react";

interface DialogSidebarProps {
  chats: DialogChat[];
  activeChatId: string | null;
  isCreating: boolean;
  onCreate: (difficulty: Difficulty) => void;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
}

const DIFF_BUTTONS: { value: Difficulty; label: string }[] = [
  { value: "easy", label: "leicht" },
  { value: "medium", label: "mittel" },
  { value: "hard", label: "schwer" },
];

export function DialogSidebar({
  chats,
  activeChatId,
  isCreating,
  onCreate,
  onSelect,
  onDelete,
}: DialogSidebarProps) {
  const [diffOpen, setDiffOpen] = useState(false);

  return (
    <aside className="flex h-full w-full flex-col gap-3 border-r border-stone-200 bg-white/50 p-3 sm:w-64">

      {/* New chat — primary CTA, expands to difficulty selector */}
      <div className="relative">
        <button
          onClick={() => setDiffOpen((v) => !v)}
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

        <AnimatePresence>
          {diffOpen && !isCreating && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15 }}
              className="absolute left-0 right-0 top-full z-20 mt-1 flex flex-col gap-1 rounded-xl border border-stone-200 bg-white p-1 shadow-lg"
            >
              {DIFF_BUTTONS.map((d) => (
                <button
                  key={d.value}
                  onClick={() => {
                    setDiffOpen(false);
                    onCreate(d.value);
                  }}
                  className="rounded-lg px-3 py-2 text-left text-sm text-stone-700 hover:bg-orange-50 hover:text-orange-800 transition-colors"
                >
                  {d.label}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Chats list */}
      <div className="flex-1 overflow-y-auto">
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
                    className="flex-1 flex flex-col gap-0.5 px-3 py-2 text-left min-w-0"
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
                    className="opacity-0 group-hover:opacity-100 hover:bg-rose-50 hover:text-rose-600 text-stone-400 rounded-lg p-1.5 mr-1 transition-all"
                    aria-label="Chat löschen"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
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
