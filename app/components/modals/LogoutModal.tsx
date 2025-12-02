// app/components/modals/LogoutModal.tsx
'use client';

import React from 'react';
import { LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LogoutModal({ isOpen, onClose }: LogoutModalProps) {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{
                type: 'spring',
                stiffness: 400,
                damping: 30,
              }}
              className="bg-white rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden"
            >
              <div className="p-6 text-center">
                <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                  <LogOut className="w-8 h-8 text-red-600" />
                </div>

                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Log out?
                </h3>
                <p className="text-sm text-gray-600 mb-6">
                  Are you sure you want to log out of your account?
                </p>

                <div className="flex gap-3">
                  <button
                    onClick={onClose}
                    className="flex-1 hover:cursor-pointer px-4 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex-1 hover:cursor-pointer px-4 py-3 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition"
                  >
                    Log Out
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
