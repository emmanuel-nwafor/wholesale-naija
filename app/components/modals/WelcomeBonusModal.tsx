// app/components/modals/WelcomeBonusModal.tsx
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import Image from 'next/image';

interface WelcomeBonusModalProps {
  isOpen: boolean;
  onClose?: () => void;
  onStartBrowsing?: () => void;
}

export default function WelcomeBonusModal({
  isOpen,
  onClose,
  onStartBrowsing,
}: WelcomeBonusModalProps) {
  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className="relative w-full max-w-md bg-white rounded-3xl p-10 text-center"
        onClick={(e) => e.stopPropagation()}
      >
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-6 right-6 text-gray-400 hover:text-gray-600"
          >
            <X size={28} />
          </button>
        )}

        <Image
          src="/svgs/modal-live.svg"
          alt="Welcome"
          width={86}
          height={86}
          className="mx-auto mb-6"
          priority
        />

        <h2 className="text-2xl font-bold text-gray-900 mb-3">
          Welcome to Wholesale Naija!
        </h2>

        <p className="text-sm text-gray-600 leading-relaxed mb-10">
          You've been credited with{' '}
          <span className="font-bold text-gray-900">100 FREE coins</span> to
          start start connecting with sellers.
        </p>

        <button
          onClick={onStartBrowsing}
          className="w-full bg-[#0f172a] hover:cursor-pointer text-white font-semibold py-4 rounded-2xl hover:bg-[#1e293b] transition"
        >
          Start Browsing
        </button>
      </motion.div>
    </motion.div>
  );
}
