"use client";

import React from "react";
import { Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface OkaySuccessModalProps {
  show: boolean;
  onClose: () => false | void;
  title?: string;
}

export default function OkaySuccessModal({
  show,
  onClose,
  title = "Success!",
}: OkaySuccessModalProps) {
  return (
    <AnimatePresence>
      {show && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="fixed inset-x-4 top-1/2 -translate-y-1/2 max-w-sm mx-auto z-50"
          >
            <div className="bg-white rounded-3xl shadow-2xl p-8 text-center">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-5">
                <Check className="w-10 h-10 text-green-600" strokeWidth={3} />
              </div>

              <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>

              <button
                onClick={onClose}
                className="w-full py-4 bg-[#1e293b] text-white rounded-2xl font-medium hover:bg-[#0f172a] transition-colors"
              >
                Done
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
