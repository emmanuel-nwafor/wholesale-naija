"use client";
import React from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import Image from "next/image";

interface WelcomeBonusModalProps {
  isOpen: boolean;
  onClose?: () => void;
  onStartBrowsing?: () => void;
}

const overlayVariants = { hidden: { opacity: 0 }, visible: { opacity: 1 } };
const contentVariants = { hidden: { scale: 0.8, opacity: 0 }, visible: { scale: 1, opacity: 1 } };

export default function WelcomeBonusModal({
  isOpen,
  onClose,
  onStartBrowsing,
}: WelcomeBonusModalProps) {
  if (!isOpen) return null;

  return (
    <motion.div
      variants={overlayVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div
        variants={contentVariants}
        className="relative w-full max-w-md bg-white rounded-3xl p-10 text-center shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {onClose && (
          <button onClick={onClose} className="hover:cursor-pointer absolute top-6 right-6 text-gray-400 hover:text-gray-600">
            <X size={28} />
          </button>
        )}

        <Image
          src="/svgs/modal-live.svg"
          alt="Wholesale Naija"
          width={86}
          height={86}
          className="mx-auto mb-4"
          priority
        />

        <h2 className="text-xl font-bold text-gray-900 mb-3">
          Welcome to Wholesale Naija!
        </h2>

        <p className="text-sm text-gray-600 leading-relaxed">
          You've been credited with <span className="text-gray-900">100 FREE coins</span> to start
          <br />
          connecting with sellers.
        </p>

        <button
          onClick={onStartBrowsing}
          className="mt-10 w-full bg-[#0f172a] text-white text-md font-semibold py-4 rounded-2xl hover:cursor-pointer hover:bg-[#1e293b] transition"
        >
          Start Browsing
        </button>
      </motion.div>
    </motion.div>
  );
}