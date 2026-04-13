"use client";

import { motion } from "framer-motion";
import { Message } from "@/lib/types";

export function UserBubble({ message }: { message: Message }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex justify-end px-4"
    >
      <div className="max-w-[75%] bg-teal-600 rounded-2xl rounded-tr-sm px-4 py-3 shadow-sm">
        <p className="text-white text-sm leading-relaxed">
          {message.transcript}
        </p>
      </div>
    </motion.div>
  );
}
