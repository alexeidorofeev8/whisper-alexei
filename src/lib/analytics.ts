import { DialogChat, ErrorType, GrammarError } from "@/lib/types";

export interface DailyBucket {
  /** ISO date YYYY-MM-DD in local time */
  date: string;
  /** Unix ms at start of local day */
  startMs: number;
  turns: number;
  errors: number;
  errorRate: number;
}

export interface FortschrittStats {
  totalUserTurns: number;
  totalErrors: number;
  perfectTurns: number;
  errorRate: number; // average errors per user turn

  /** Sorted by count desc */
  byType: { type: ErrorType; count: number }[];

  /** Top rule_names sorted by count desc, normalised (markdown bold preserved) */
  byRule: { rule: string; count: number }[];

  /** Last N days, oldest first. Days with no activity have turns=0, errors=0. */
  byDay: DailyBucket[];

  /** Last activity timestamp (ms) — for "Heute aktiv" hint, etc. */
  lastActivityMs: number | null;

  /** Total gamification score across all chats. */
  totalPoints: number;

  /** Current consecutive perfect-message streak (resets on any errored turn). */
  currentStreak: number;

  /** Best perfect-message streak ever achieved. */
  longestStreak: number;

  /** Points earned per local day, last N days, oldest first. */
  dailyPoints: { date: string; startMs: number; points: number }[];
}

/**
 * Compute points awarded for a single user turn.
 * - 0 errors (perfect):   10 base + 5 × (current streak before this turn) bonus, capped sensibly
 * - 1 error:              3 points (small reward)
 * - 2 errors:             1 point
 * - 3+ errors:            0 points
 */
export function computeTurnPoints(errorCount: number, streakBefore: number): number {
  if (errorCount === 0) {
    const bonus = Math.min(streakBefore * 5, 100);
    return 10 + bonus;
  }
  if (errorCount === 1) return 3;
  if (errorCount === 2) return 1;
  return 0;
}

function localDayStart(ms: number): number {
  const d = new Date(ms);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

function isoDate(ms: number): string {
  const d = new Date(ms);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** Strip basic markdown bold for grouping/comparison; preserves the original for display. */
function normaliseRule(rule: string): string {
  return rule.trim();
}

/** Aggregate stats from all chats. Pure function — safe to call on every render. */
export function aggregateErrorStats(
  chats: DialogChat[],
  windowDays = 14
): FortschrittStats {
  let totalUserTurns = 0;
  let totalErrors = 0;
  let perfectTurns = 0;
  let lastActivityMs: number | null = null;
  let totalPoints = 0;
  let currentStreak = 0;
  let longestStreak = 0;

  const typeCounts = new Map<ErrorType, number>();
  const ruleCounts = new Map<string, number>();
  const dailyTurns = new Map<number, number>();
  const dailyErrors = new Map<number, number>();
  const dailyPointsMap = new Map<number, number>();

  // Iterate user turns CHRONOLOGICALLY (across chats) so streak is correct
  const allUserTurns = chats
    .flatMap((c) => c.turns.filter((t) => t.role === "user"))
    .sort((a, b) => a.timestamp - b.timestamp);

  for (const turn of allUserTurns) {
    totalUserTurns++;
    const dayStart = localDayStart(turn.timestamp);
    dailyTurns.set(dayStart, (dailyTurns.get(dayStart) ?? 0) + 1);

    if (lastActivityMs == null || turn.timestamp > lastActivityMs) {
      lastActivityMs = turn.timestamp;
    }

    const errs: GrammarError[] = turn.analysis?.errors ?? [];
    const errorCount = errs.length;
    if (errorCount === 0) perfectTurns++;

    totalErrors += errorCount;
    dailyErrors.set(dayStart, (dailyErrors.get(dayStart) ?? 0) + errorCount);

    for (const e of errs) {
      typeCounts.set(e.type, (typeCounts.get(e.type) ?? 0) + 1);
      const rule = normaliseRule(e.rule_name);
      if (rule) ruleCounts.set(rule, (ruleCounts.get(rule) ?? 0) + 1);
    }

    // Points + streak
    const pts = computeTurnPoints(errorCount, currentStreak);
    totalPoints += pts;
    dailyPointsMap.set(dayStart, (dailyPointsMap.get(dayStart) ?? 0) + pts);

    if (errorCount === 0) {
      currentStreak++;
      if (currentStreak > longestStreak) longestStreak = currentStreak;
    } else {
      currentStreak = 0;
    }
  }

  const byType = Array.from(typeCounts.entries())
    .map(([type, count]) => ({ type, count }))
    .sort((a, b) => b.count - a.count);

  const byRule = Array.from(ruleCounts.entries())
    .map(([rule, count]) => ({ rule, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  // Build daily buckets for last `windowDays` days, oldest -> newest
  const byDay: DailyBucket[] = [];
  const dailyPoints: { date: string; startMs: number; points: number }[] = [];
  const todayStart = localDayStart(Date.now());
  for (let i = windowDays - 1; i >= 0; i--) {
    const startMs = todayStart - i * 86_400_000;
    const turns = dailyTurns.get(startMs) ?? 0;
    const errors = dailyErrors.get(startMs) ?? 0;
    byDay.push({
      date: isoDate(startMs),
      startMs,
      turns,
      errors,
      errorRate: turns > 0 ? errors / turns : 0,
    });
    dailyPoints.push({
      date: isoDate(startMs),
      startMs,
      points: dailyPointsMap.get(startMs) ?? 0,
    });
  }

  return {
    totalUserTurns,
    totalErrors,
    perfectTurns,
    errorRate: totalUserTurns > 0 ? totalErrors / totalUserTurns : 0,
    byType,
    byRule,
    byDay,
    lastActivityMs,
    totalPoints,
    currentStreak,
    longestStreak,
    dailyPoints,
  };
}

const TYPE_LABELS_DE: Record<ErrorType, string> = {
  word_order: "Satzstellung",
  case: "Kasus",
  wrong_word: "Wortwahl",
  grammar: "Grammatik",
  article: "Artikel",
  tense: "Zeitform",
  preposition: "Präposition",
};

export function typeLabelDe(type: ErrorType): string {
  return TYPE_LABELS_DE[type] ?? type;
}
