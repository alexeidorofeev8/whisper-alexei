"use client";

import { motion } from "framer-motion";

const BARS = [0.4, 0.8, 0.6, 1.0, 0.5, 0.7, 0.3];

export function VoiceWaveform({ active }: { active: boolean }) {
  return (
    <div className="flex items-center gap-[3px] h-6">
      {BARS.map((phase, i) => (
        <motion.div
          key={i}
          className="w-[3px] rounded-full bg-teal-500"
          animate={
            active
              ? { scaleY: [0.3, phase, 0.3], opacity: [0.6, 1, 0.6] }
              : { scaleY: 0.2, opacity: 0.3 }
          }
          transition={
            active
              ? { duration: 0.8, repeat: Infinity, delay: i * 0.1, ease: "easeInOut" }
              : { duration: 0.3 }
          }
          style={{ height: "100%", transformOrigin: "center" }}
        />
      ))}
    </div>
  );
}
