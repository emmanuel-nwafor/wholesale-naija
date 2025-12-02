// components/modals/ReviewStatusModal.tsx
'use client';
import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

type Status = 'review' | 'approved' | 'rejected';

interface ReviewStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEdit?: () => void;
  status: Status;
  productName: string;
  reason?: string;
}

interface StatusConfig {
  svg: string;
  title: string;
  message: (name: string) => string;
  subtext?: string | ((reason?: string) => string);
  buttonText: string;
  buttonVariant: string;
  secondaryButton?: string;
  secondaryVariant?: string;
}

const statusConfig: Record<Status, StatusConfig> = {
  review: {
    svg: '/svgs/modal-time.svg',
    title: 'Under Review',
    message: (name) => `Your "${name}" is pending approval.`,
    subtext: "We'll notify you once it's live.",
    buttonText: 'Close',
    buttonVariant: 'bg-slate-900 text-white hover:bg-slate-800',
  },

  approved: {
    svg: '/svgs/modal-live.svg',
    title: 'Approved!',
    message: (name) => `Your "${name}" is now live.`,
    subtext: 'You can view it in your store.',
    buttonText: 'Close',
    buttonVariant: 'bg-slate-900 text-white hover:bg-slate-800',
  },

  rejected: {
    svg: '/svgs/modal-rejected.svg',
    title: 'Rejected',
    message: (name) => `Your "${name}" was not approved.`,
    subtext: (reason) => (reason ? `Reason: ${reason}` : ''),
    buttonText: 'Close',
    buttonVariant:
      'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50',
    secondaryButton: 'Edit & Resubmit',
    secondaryVariant: 'bg-slate-900 text-white hover:bg-slate-800',
  },
};

export default function ReviewStatusModal({
  isOpen,
  onClose,
  onEdit,
  status,
  productName,
  reason,
}: ReviewStatusModalProps) {
  if (!isOpen) return null;

  const config = statusConfig[status];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 text-center">
          {/* SVG ICON */}
          <div className="flex justify-center mb-4">
            <Image
              src={config.svg}
              alt={status}
              width={80}
              height={80}
              className="w-[80px] h-[80px] object-contain"
            />
          </div>

          {/* Title */}
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            {config.title}
          </h2>

          {/* Message */}
          <p className="text-sm text-gray-600 mb-1">
            {config.message(productName)}
          </p>

          {/* Subtext / Reason */}
          {config.subtext && (
            <p
              className={`text-sm ${
                status === 'rejected'
                  ? 'text-red-600 font-medium'
                  : 'text-gray-500'
              }`}
            >
              {typeof config.subtext === 'function'
                ? config.subtext(reason)
                : config.subtext}
            </p>
          )}
        </div>

        {/* Buttons */}
        <div className="flex gap-3 p-6 pt-0">
          <button
            onClick={onClose}
            className={`flex-1 py-3 rounded-xl font-medium transition-all ${config.buttonVariant}`}
          >
            {config.buttonText}
          </button>

          {config.secondaryButton && (
            <button
              onClick={() => {
                onEdit?.();
                onClose();
              }}
              className={`flex-1 py-3 rounded-xl font-medium transition-all hover:cursor-pointer ${config.secondaryVariant}`}
            >
              {config.secondaryButton}
            </button>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
