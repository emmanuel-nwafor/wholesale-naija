// /components/chat/BuyersActionsModal.tsx
'use client';

import React, { useRef } from 'react';
import { Eye, Ban, Trash2, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ActionsModalProps {
  show: boolean;
  onClose: () => void;
  isMobileOrTablet: boolean;
  onDeleteClick: () => void;
}

export default function BuyersActionsModal({
  show,
  onClose,
  isMobileOrTablet,
  onDeleteClick,
}: ActionsModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  return (
    <AnimatePresence>
      {show && (
        <>
          {/* Backdrop - now covers full screen */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 bg-opacity-50 z-40"
          />

          {/* Modal Container */}
          <motion.div
            ref={modalRef}
            initial={{
              opacity: 0,
              scale: isMobileOrTablet ? 0.95 : 0.9,
              y: isMobileOrTablet ? 100 : -10,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              scale: isMobileOrTablet ? 0.95 : 0.9,
              y: isMobileOrTablet ? 100 : -10,
            }}
            transition={{ type: 'spring', stiffness: 320, damping: 30 }}
            className={`fixed z-50 bg-white shadow-2xl border border-gray-200 overflow-hidden ${
              isMobileOrTablet
                ? 'bottom-0 left-0 right-0 rounded-t-3xl max-w-md mx-auto'
                : 'top-16 right-4 w-64 rounded-2xl' // Dropdown style on desktop
            }`}
          >
            {/* Mobile Handle */}
            {isMobileOrTablet && (
              <div className="flex justify-center pt-4 pb-2">
                <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
              </div>
            )}

            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-100">
              <h3 className="font-semibold text-lg text-gray-900">Actions</h3>
            </div>

            {/* Action Items */}
            <div className="py-2">
              <button className="w-full flex items-center gap-3 px-6 py-3 hover:bg-gray-50 text-left transition-colors">
                <Eye className="w-5 h-5 text-gray-600" />
                <span className="text-gray-700">View Profile</span>
              </button>

              <button className="w-full flex items-center gap-3 px-6 py-3 hover:bg-gray-50 text-left transition-colors">
                <Ban className="w-5 h-5 text-gray-600" />
                <span className="text-gray-700">Block User</span>
              </button>

              <button
                onClick={() => {
                  onDeleteClick();
                  onClose(); // Optional: close modal after action
                }}
                className="w-full flex items-center gap-3 px-6 py-3 hover:bg-gray-50 text-left transition-colors"
              >
                <Trash2 className="w-5 h-5 text-gray-600" />
                <span className="text-gray-700">Delete Conversation</span>
              </button>

              <button className="w-full flex items-center justify-between px-6 py-3 hover:bg-gray-50 text-left transition-colors text-red-600">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-5 h-5" />
                  <span>Report User</span>
                </div>
                <span className="text-lg">→</span>
              </button>
            </div>

            {/* Mobile Close Button */}
            {isMobileOrTablet && (
              <div className="border-t border-gray-100 p-4">
                <button
                  onClick={onClose}
                  className="w-full py-3 text-center text-red-600 font-medium text-lg"
                >
                  Close
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}