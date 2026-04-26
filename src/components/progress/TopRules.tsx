"use client";

interface TopRulesProps {
  byRule: { rule: string; count: number }[];
}

function renderBold(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.length > 4 && part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="font-semibold text-slate-900">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

export function TopRules({ byRule }: TopRulesProps) {
  if (byRule.length === 0) {
    return <p className="py-2 text-sm text-stone-400">Noch keine Regeln gesammelt.</p>;
  }

  return (
    <ul className="flex flex-col gap-1.5">
      {byRule.map((r, i) => (
        <li
          key={r.rule + i}
          className="flex items-start justify-between gap-3 rounded-lg border border-stone-100 bg-white px-3 py-2 text-sm"
        >
          <span lang="de" className="text-stone-700 leading-snug">
            {renderBold(r.rule)}
          </span>
          <span className="shrink-0 rounded-full bg-orange-50 border border-orange-100 px-2 py-0.5 text-[11px] font-medium text-orange-700">
            {r.count}×
          </span>
        </li>
      ))}
    </ul>
  );
}
