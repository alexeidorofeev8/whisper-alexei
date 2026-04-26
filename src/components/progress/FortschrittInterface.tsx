"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { Sparkles, MessageCircle, AlertCircle, CheckCircle2 } from "lucide-react";
import { useDialogStore } from "@/store/useDialogStore";
import { aggregateErrorStats, buildHeatmap } from "@/lib/analytics";
import { TypeBars } from "./TypeBars";
import { TopRules } from "./TopRules";
import { Fehlerbericht } from "./Fehlerbericht";
import { GameCard } from "./GameCard";
import { Heatmap } from "./Heatmap";

export function FortschrittInterface() {
  const chats = useDialogStore((s) => s.chats);
  const hasHydrated = useDialogStore((s) => s.hasHydrated);

  const stats = useMemo(() => aggregateErrorStats(chats, 14), [chats]);
  const heatmap = useMemo(() => buildHeatmap(chats, 53), [chats]);

  if (!hasHydrated) {
    return (
      <div className="flex flex-1 items-center justify-center text-sm text-stone-400">
        Lade…
      </div>
    );
  }

  if (stats.totalUserTurns === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-1 flex-col items-center justify-center gap-3 px-6 py-10 text-center"
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-full border border-orange-200 bg-orange-50 text-orange-500">
          <Sparkles className="h-5 w-5" />
        </div>
        <h2 className="text-base font-semibold text-stone-700">Noch keine Daten</h2>
        <p className="max-w-sm text-sm text-stone-500">
          Sobald du im Dialog ein paar Nachrichten geschrieben hast, erscheint hier deine Fehler-Statistik. Schon nach 2-3 Antworten sind erste Muster sichtbar.
        </p>
      </motion.div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
      <div className="mx-auto max-w-3xl">

        {/* Header stats */}
        <header className="mb-6">
          <h1 className="text-lg font-semibold text-stone-800 mb-1">Fortschritt</h1>
          <p className="text-xs text-stone-400">
            Wird mit jeder Nachricht aktualisiert
          </p>
        </header>

        {/* Gamification card — points + streak */}
        <section className="mb-6">
          <GameCard
            totalPoints={stats.totalPoints}
            currentStreak={stats.currentStreak}
            longestStreak={stats.longestStreak}
          />
        </section>

        <div className="mb-6 grid grid-cols-3 gap-3">
          <StatTile
            icon={<MessageCircle className="h-4 w-4 text-orange-500" />}
            label="Nachrichten"
            value={stats.totalUserTurns.toString()}
          />
          <StatTile
            icon={<AlertCircle className="h-4 w-4 text-rose-500" />}
            label="Fehler"
            value={stats.totalErrors.toString()}
            sub={`Ø ${stats.errorRate.toFixed(2)}/Nachricht`}
          />
          <StatTile
            icon={<CheckCircle2 className="h-4 w-4 text-emerald-500" />}
            label="Perfekt"
            value={stats.perfectTurns.toString()}
            sub={
              stats.totalUserTurns > 0
                ? `${Math.round((stats.perfectTurns / stats.totalUserTurns) * 100)}%`
                : undefined
            }
          />
        </div>

        {/* GitHub-style heatmap — last ~53 weeks */}
        <section className="mb-6 rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-stone-500">
            Aktivitäts-Heatmap (letztes Jahr)
          </h2>
          <Heatmap days={heatmap} />
        </section>

        {/* By type */}
        <section className="mb-6 rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-stone-500">
            Nach Fehlertyp
          </h2>
          <TypeBars byType={stats.byType} total={stats.totalErrors} />
        </section>

        {/* Top rules */}
        <section className="mb-6 rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-stone-500">
            Häufigste Fehlerregeln
          </h2>
          <TopRules byRule={stats.byRule} />
        </section>

        {/* AI deep-dive on top rules */}
        <section className="mb-6">
          <Fehlerbericht
            topRules={stats.byRule.map((r) => r.rule)}
            totalUserTurns={stats.totalUserTurns}
          />
        </section>

        <p className="text-center text-[11px] text-stone-400">
          Daten werden lokal gespeichert (localStorage). Nichts wird hochgeladen.
        </p>
      </div>
    </div>
  );
}

function StatTile({
  icon,
  label,
  value,
  sub,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className="rounded-2xl border border-stone-200 bg-white px-3 py-3 shadow-sm">
      <div className="mb-1 flex items-center gap-1.5 text-[11px] text-stone-500">
        {icon}
        <span className="uppercase tracking-wider">{label}</span>
      </div>
      <div className="text-2xl font-semibold text-stone-800">{value}</div>
      {sub && <div className="mt-0.5 text-[11px] text-stone-400">{sub}</div>}
    </div>
  );
}
