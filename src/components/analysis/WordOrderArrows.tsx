"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { GrammarError } from "@/lib/types";

interface Arrow {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  length: number;
}

interface WordOrderArrowsProps {
  errors: GrammarError[];
  tokenRefs: React.RefObject<(HTMLSpanElement | null)[]>;
  correctedTokenRefs: React.RefObject<(HTMLSpanElement | null)[]>;
  containerRef: React.RefObject<HTMLDivElement | null>;
}

export function WordOrderArrows({
  errors,
  tokenRefs,
  correctedTokenRefs,
  containerRef,
}: WordOrderArrowsProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [arrows, setArrows] = useState<Arrow[]>([]);
  const [svgSize, setSvgSize] = useState({ w: 0, h: 0 });

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!containerRef.current) return;
      const containerRect = containerRef.current.getBoundingClientRect();

      const computed: Arrow[] = [];
      for (const err of errors) {
        if (err.type !== "word_order" || !err.correct_indices?.length) continue;

        const srcIndex = err.original_indices[0];
        const dstIndex = err.correct_indices[0];
        const srcEl = tokenRefs.current?.[srcIndex];
        const dstEl = correctedTokenRefs.current?.[dstIndex];

        if (!srcEl || !dstEl) continue;

        const sr = srcEl.getBoundingClientRect();
        const dr = dstEl.getBoundingClientRect();

        const x1 = sr.left + sr.width / 2 - containerRect.left;
        const y1 = sr.bottom - containerRect.top;
        const x2 = dr.left + dr.width / 2 - containerRect.left;
        const y2 = dr.top - containerRect.top;

        const dx = x2 - x1;
        const dy = y2 - y1;
        const length = Math.sqrt(dx * dx + dy * dy);

        computed.push({ x1, y1, x2, y2, length });
      }

      setSvgSize({
        w: containerRect.width,
        h: containerRect.height,
      });
      setArrows(computed);
    }, 600);

    return () => clearTimeout(timer);
  }, [errors, tokenRefs, correctedTokenRefs, containerRef]);

  if (!arrows.length) return null;

  const pathD = (a: Arrow) => {
    const cx = (a.x1 + a.x2) / 2;
    const cy = (a.y1 + a.y2) / 2 - 20;
    return `M ${a.x1} ${a.y1} Q ${cx} ${cy} ${a.x2} ${a.y2}`;
  };

  return (
    <svg
      ref={svgRef}
      className="absolute inset-0 pointer-events-none overflow-visible"
      width={svgSize.w}
      height={svgSize.h}
    >
      <defs>
        <marker
          id="arrow-blue"
          markerWidth="8"
          markerHeight="8"
          refX="4"
          refY="4"
          orient="auto"
        >
          <path d="M0,0 L8,4 L0,8 Z" fill="#60A5FA" opacity={0.7} />
        </marker>
      </defs>
      {arrows.map((a, i) => (
        <motion.path
          key={i}
          d={pathD(a)}
          fill="none"
          stroke="#60A5FA"
          strokeWidth={1.5}
          strokeOpacity={0.6}
          strokeDasharray={a.length + 40}
          markerEnd="url(#arrow-blue)"
          initial={{ strokeDashoffset: a.length + 40 }}
          animate={{ strokeDashoffset: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut", delay: i * 0.1 }}
        />
      ))}
    </svg>
  );
}
