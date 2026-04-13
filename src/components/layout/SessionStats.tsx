"use client";

import { useAppStore } from "@/store/useAppStore";

export function SessionStats() {
  const totalErrors = useAppStore((s) => s.totalErrors);

  if (totalErrors === 0) return null;

  return (
    <span className="min-w-[1.25rem] h-5 rounded-full bg-orange-100 text-orange-600 text-xs font-semibold flex items-center justify-center px-1.5 border border-orange-200">
      {totalErrors}
    </span>
  );
}
