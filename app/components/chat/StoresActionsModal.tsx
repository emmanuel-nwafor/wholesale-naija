// /components/chat/StoresActionsModal.tsx
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

export default function StoresActionsModal({ show, onClose, isMobileOrTablet, onDeleteClick }: ActionsModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  return (
    <AnimatePresence>
      {show && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed bg-opacity-50 z-40"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            ref={modalRef}
            initial={{ opacity: 0, scale: 0.9, y: isMobileOrTablet ? 50 : 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: isMobileOrTablet ? 50 : 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className={`fixed z-50 ${
              isMobileOrTablet
                ? 'bottom-0 left-0 right-0 max-w-md mx-auto rounded-t-3xl'
                : 'right-4 top-20 w-64 rounded-2xl shadow-2xl border border-gray-200'
            } bg-white overflow-hidden`}
          >
            {/* Mobile Handle */}
            {isMobileOrTablet && (
              <div className="flex justify-center pt-3 pb-2">
                <div className="w-12 h-1 bg-gray-300 rounded-full" />
              </div>
            )}

            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-100">
              <h3 className="font-semibold text-lg">Actions</h3>
            </div>

            {/* Actions */}
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
                onClick={onDeleteClick}
                className="w-full flex items-center gap-3 px-6 py-3 hover:bg-gray-50 text-left transition-colors"
              >
                <Trash2 className="w-5 h-5 text-gray-600" />
                <span className="text-gray-700">Delete Conversation</span>
              </button>
              <button className="w-full flex items-center gap-3 px-6 py-3 hover:bg-gray-50 text-left text-red-600 transition-colors">
                <AlertTriangle className="w-5 h-5" />
                <span className="flex-1">Report User</span>
                <span>→</span>
              </button>
            </div>

            {/* Mobile Close */}
            {isMobileOrTablet && (
              <div className="border-t border-gray-100 p-4">
                <button
                  onClick={onClose}
                  className="w-full py-3 text-center text-red-600 font-medium"
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