// components/modals/DeleteModal.tsx
'use client';

import React from 'react';
import { Trash2, Ban, UserCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type ModalMode = 'delete' | 'block' | 'unblock';

interface DeleteModalProps {
  show: boolean;
  onClose: () => void;
  onConfirm: () => void;
  mode?: ModalMode;
  title?: string;
  message?: string;
  itemName?: string;
  loading?: boolean;
}

const icons = {
  delete: Trash2,
  block: Ban,
  unblock: UserCheck,
};

const colors = {
  delete: 'bg-red-100 text-red-600',
  block: 'bg-orange-100 text-orange-600',
  unblock: 'bg-green-100 text-green-600',
};

const buttonColors = {
  delete: 'bg-red-600 hover:bg-red-700',
  block: 'bg-orange-600 hover:bg-orange-700',
  unblock: 'bg-green-600 hover:bg-green-700',
};

const actionTexts = {
  delete: 'Delete',
  block: 'Block User',
  unblock: 'Unblock User',
};

export default function DeleteModal({
  show,
  onClose,
  onConfirm,
  mode = 'delete',
  title,
  message,
  itemName,
  loading = false,
}: DeleteModalProps) {
  const Icon = icons[mode];
  const bgColor = colors[mode];
  const btnColor = buttonColors[mode];
  const actionText = actionTexts[mode];

  const defaultTitles = {
    delete: 'Delete Conversation?',
    block: 'Block this user?',
    unblock: 'Unblock this user?',
  };

  const defaultMessages = {
    delete: 'This conversation will be deleted permanently.',
    block: 'You will no longer receive messages from this user.',
    unblock: 'You will be able to message this user again.',
  };

  return (
    <AnimatePresence>
      {show && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed inset-x-4 top-1/2 -translate-y-1/2 max-w-md mx-auto bg-white rounded-2xl shadow-2xl z-50 p-6"
          >
            <div className="text-center">
              <div
                className={`mx-auto w-14 h-14 ${bgColor} rounded-full flex items-center justify-center mb-5`}
              >
                <Icon className="w-7 h-7" />
              </div>

              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {title || defaultTitles[mode]}
              </h3>

              {itemName && (
                <p className="text-lg font-medium text-gray-800 mb-2">
                  {itemName}
                </p>
              )}

              <p className="text-sm text-gray-600 mb-8 max-w-xs mx-auto">
                {message || defaultMessages[mode]}
              </p>

              <div className="flex gap-3 justify-center">
                <button
                  onClick={onClose}
                  disabled={loading}
                  className="px-8 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 disabled:opacity-70 transition-colors"
                >
                  Cancel
                </button>

                <button
                  onClick={onConfirm}
                  disabled={loading}
                  className={`px-8 py-3 ${btnColor} text-white rounded-xl font-medium disabled:opacity-70 transition-colors flex items-center gap-2`}
                >
                  {loading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      {actionText}ing...
                    </>
                  ) : (
                    actionText
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
