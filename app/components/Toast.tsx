"use client";
import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

type ToastProps = {
  message: string;
  type: "success" | "error";
  isVisible: boolean;
  onClose: () => void;
};

export default function Toast({ message, type, isVisible, onClose }: ToastProps) {
  const toastRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isVisible) {
      // auto close after 3s
      const timer = setTimeout(onClose, 3000);

      // scroll into view
      if (toastRef.current) {
        toastRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      }

      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          ref={toastRef}
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -50, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className={`fixed top-5 right-5 px-6 py-3 rounded-xl font-semibold shadow-2xl z-50 ${
            type === "success"
              ? "bg-gradient-to-r from-green-400 to-emerald-500 text-black"
              : "bg-gradient-to-r from-red-400 to-pink-600 text-white"
          }`}
        >
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
