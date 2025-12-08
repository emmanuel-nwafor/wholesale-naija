// components/chat/BuyersActionsModal.tsx
'use client';

import React, { useState } from 'react';
import { Eye, Ban, UserCheck, Trash2, AlertTriangle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchWithToken } from '@/app/utils/fetchWithToken';
import { useRouter } from 'next/navigation';

interface ActionsModalProps {
  show: boolean;
  onClose: () => void;
  isMobile: boolean;
  onDeleteClick: () => void;
  sellerId: string;
  storeId?: string;
  sellerName: string;
  isBlocked?: boolean;
}

export default function BuyersActionsModal({
  show,
  onClose,
  isMobile,
  onDeleteClick,
  sellerId,
  storeId,
  sellerName,
  isBlocked = false,
}: ActionsModalProps) {
  const [showReportForm, setShowReportForm] = useState(false);
  const [reportType, setReportType] = useState('spam');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [blocked, setBlocked] = useState(isBlocked);
  const router = useRouter();

  const toggleBlock = async () => {
    try {
      setLoading(true);
      const method = blocked ? 'DELETE' : 'POST';
      await fetchWithToken(`/v1/users/me/block/${sellerId}`, { method });
      setBlocked(!blocked);
      alert(blocked ? 'User unblocked' : 'User blocked');
      onClose();
    } catch (err) {
      alert('Failed to update block status');
      console.log(err)
    } finally {
      setLoading(false);
    }
  };

  const handleReport = async () => {
    if (!description.trim()) return alert('Description required');
    setLoading(true);
    try {
      await fetchWithToken('/v1/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetUser: sellerId,
          targetStore: storeId,
          type: reportType,
          description: description.trim(),
        }),
      });
      alert('Report submitted');
      setShowReportForm(false);
      setDescription('');
      onClose();
    } catch (err) {
      alert('Failed to submit report');
      console.log(err)
    } finally {
      setLoading(false);
    }
  };

  const handleViewProfile = () => {
    router.push(`/store/${storeId || sellerId}`);
    onClose();
  };

  if (showReportForm) {
    return (
      <AnimatePresence>
        {show && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowReportForm(false)}
              className="fixed inset-0 bg-black/50 z-40"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: isMobile ? 100 : -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: isMobile ? 100 : -20 }}
              className={`fixed z-50 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden ${
                isMobile
                  ? 'bottom-0 left-0 right-0 max-w-md mx-auto rounded-t-3xl'
                  : 'top-16 right-4 w-80'
              }`}
            >
              <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                <h3 className="font-semibold text-lg">Report {sellerName}</h3>
                <button
                  onClick={() => setShowReportForm(false)}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-5 space-y-4">
                <select
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
                >
                  <option value="spam">Spam</option>
                  <option value="harassment">Harassment</option>
                  <option value="fake">Fake Account</option>
                  <option value="inappropriate">Inappropriate Content</option>
                  <option value="other">Other</option>
                </select>

                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the issue..."
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-slate-900"
                />

                <button
                  onClick={handleReport}
                  disabled={loading || !description.trim()}
                  className="w-full bg-red-600 text-white py-3 rounded-xl font-medium hover:bg-red-700 disabled:opacity-50"
                >
                  {loading ? 'Submitting...' : 'Submit Report'}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    );
  }

  return (
    <AnimatePresence>
      {show && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40"
          />

          <motion.div
            initial={{
              opacity: 0,
              scale: isMobile ? 0.95 : 0.9,
              y: isMobile ? 100 : -10,
            }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{
              opacity: 0,
              scale: isMobile ? 0.95 : 0.9,
              y: isMobile ? 100 : -10,
            }}
            className={`fixed z-50 bg-white shadow-2xl border border-gray-200 overflow-hidden ${
              isMobile
                ? 'bottom-0 left-0 right-0 max-w-md mx-auto rounded-t-3xl'
                : 'top-16 right-4 w-64 rounded-2xl'
            }`}
          >
            {isMobile && (
              <div className="flex justify-center pt-4 pb-2">
                <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
              </div>
            )}

            <div className="px-6 py-4 border-b border-gray-100">
              <h3 className="font-semibold text-lg text-gray-900">Actions</h3>
            </div>

            <div className="py-2">
              <button
                onClick={handleViewProfile}
                className="w-full flex items-center gap-3 px-6 py-3 hover:bg-gray-50 text-left transition-colors"
              >
                <Eye className="w-5 h-5 text-gray-600" />
                <span className="text-gray-700">View Profile</span>
              </button>

              <button
                onClick={toggleBlock}
                disabled={loading}
                className="w-full flex items-center gap-3 px-6 py-3 hover:bg-gray-50 text-left transition-colors"
              >
                {blocked ? (
                  <>
                    <UserCheck className="w-5 h-5 text-green-600" />
                    <span className="text-green-600">Unblock User</span>
                  </>
                ) : (
                  <>
                    <Ban className="w-5 h-5 text-gray-600" />
                    <span className="text-gray-700">Block User</span>
                  </>
                )}
              </button>

              <button
                onClick={() => {
                  onDeleteClick();
                  onClose();
                }}
                className="w-full flex items-center gap-3 px-6 py-3 hover:bg-gray-50 text-left transition-colors"
              >
                <Trash2 className="w-5 h-5 text-gray-600" />
                <span className="text-gray-700">Delete Conversation</span>
              </button>

              <button
                onClick={() => setShowReportForm(true)}
                className="w-full flex items-center justify-between px-6 py-3 hover:bg-gray-50 text-left transition-colors text-red-600"
              >
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-5 h-5" />
                  <span>Report User</span>
                </div>
                <span className="text-lg">→</span>
              </button>
            </div>

            {isMobile && (
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
