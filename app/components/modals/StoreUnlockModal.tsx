'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

interface StoreUnlockModalProps {
  isOpen: boolean;
  onClose: () => void;
  storeName?: string;
  phoneNumber?: string;
}

export default function StoreUnlockModal({
  isOpen,
  onClose,
  storeName = 'This Store',
  phoneNumber = '',
}: StoreUnlockModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full overflow-hidden">
              {/* Content */}
              <div className="pt-10 pb-8 px-8 text-center">
                {/* Success Icon */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                  className="mb-6 flex justify-center"
                >
                  <Image
                    src="/svgs/unlock-success.svg"
                    alt="Store Unlocked"
                    width={80}
                    height={80}
                    className="drop-shadow-lg"
                  />
                </motion.div>

                {/* Title */}
                <motion.h2
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-2xl font-bold text-gray-900 mb-3"
                >
                  {storeName} Unlocked!
                </motion.h2>

                {/* Description */}
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-gray-600 text-sm leading-relaxed mb-6"
                >
                  You can now reach this store directly via:
                </motion.p>

                {/* Phone Number */}
                {phoneNumber && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="bg-green-50 border border-green-200 rounded-2xl py-4 px-6 mb-6"
                  >
                    <p className="text-green-800 font-semibold text-lg">
                      {phoneNumber}
                    </p>
                  </motion.div>
                )}

                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="text-xs text-gray-500"
                >
                  Contact details saved to store profile
                </motion.p>
              </div>

              {/* Done Button */}
              <div className="px-8 pb-8">
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onClose}
                  className="w-full bg-slate-900 text-white font-semibold py-4 rounded-full hover:bg-slate-800 transition shadow-lg"
                >
                  Done
                </motion.button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
