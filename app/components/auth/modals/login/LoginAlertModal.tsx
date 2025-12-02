// components/LoginAlertModal.tsx
'use client';
import { X } from 'lucide-react';

interface LoginAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenChooseModal: () => void; // callback to open choose modal
}

export default function LoginAlertModal({
  isOpen,
  onClose,
  onOpenChooseModal,
}: LoginAlertModalProps) {
  if (!isOpen) return null;

  const handleClose = () => {
    onClose(); // close this modal
    onOpenChooseModal(); // open choose modal next
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-white rounded-2xl p-6 shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">
            Login Required
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>
        <p className="text-gray-600">
          You are browsing without an account. Please log in to access all
          features.
        </p>
        <button
          onClick={handleClose}
          className="mt-6 w-full py-3 bg-slate-900 text-white rounded-2xl hover:bg-slate-800"
        >
          Okay
        </button>
      </div>
    </div>
  );
}
