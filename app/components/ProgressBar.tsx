// ProgressBar.tsx
"use client";
import { motion } from "framer-motion";

export default function ProgressBar({ step, total }: { step: number; total: number }) {
  const progress = ((step + 1) / total) * 100;

  return (
    <div className="w-full h-3 bg-gray-800 rounded-full overflow-hidden shadow-inner mb-4">
      <motion.div
        className="h-full bg-gradient-to-r from-amber-400 to-pink-500 shadow-lg"
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.4 }}
      />
    </div>
  );
}
