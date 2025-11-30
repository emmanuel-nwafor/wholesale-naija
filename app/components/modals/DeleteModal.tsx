'use client';

import React from 'react';
import { Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface DeleteModalProps {
  show: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  itemName?: string;
  loading?: boolean;
}

export default function DeleteModal({
  show,
  onClose,
  onConfirm,
  title = "Delete this item?",
  message = "This action cannot be undone.",
  itemName,
  loading = false,
}: DeleteModalProps) {
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
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-x-4 top-1/2 -translate-y-1/2 max-w-md mx-auto bg-white rounded-2xl shadow-2xl z-50 p-6"
          >
            <div className="text-center">
              <div className="mx-auto w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mb-5">
                <Trash2 className="w-7 h-7 text-red-600" />
              </div>

              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {title}
              </h3>

              {/* {itemName && (
                <p className="text-lg font-medium text-gray-800 mb-2">
                  {itemName}
                </p>
              )} */}

              <p className="text-sm text-gray-600 mb-8 max-w-xs mx-auto">
                {message}
              </p>

              <div className="flex gap-3 justify-center">
                <button
                  onClick={onClose}
                  disabled={loading}
                  className="px-8 py-3 cursor-pointer bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 disabled:opacity-70 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={onConfirm}
                  disabled={loading}
                  className="px-8 py-3 bg-red-600 hover:cursor-pointer text-white rounded-xl font-medium hover:bg-red-700 disabled:opacity-70 transition-colors flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    "Delete"
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