'use client';
import { ShoppingCartIcon, Store, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';

const modalVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const contentVariants = {
  hidden: { y: -50, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { delay: 0.1 } },
};

interface ChooseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectBuyer: () => void;
  onSelectSeller: () => void;
  onOpenLogin: () => void;
}

export default function ChooseModal({
  isOpen,
  onClose,
  onSelectBuyer,
  onSelectSeller,
  onOpenLogin,
}: ChooseModalProps) {
  const [selectedRole, setSelectedRole] = useState<'buyer' | 'seller' | null>(
    null
  );

  if (!isOpen) return null;

  const handleNext = () => {
    if (!selectedRole) return;
    localStorage.setItem('selectedRole', selectedRole);
    if (selectedRole === 'buyer') onSelectBuyer();
    if (selectedRole === 'seller') onSelectSeller();
    onClose();
    onOpenLogin();
  };

  return (
    <motion.div
      variants={modalVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div
        variants={contentVariants}
        className="w-full max-w-lg bg-white rounded-2xl p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Create Account
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-8">
          {/* Buyer */}
          <div
            onClick={() => setSelectedRole('buyer')}
            className={`border rounded-xl p-6 text-center cursor-pointer transition ${
              selectedRole === 'buyer'
                ? 'border-green-500 bg-green-50'
                : 'border-gray-300 hover:border-green-500'
            }`}
          >
            <div className="rounded-xl mx-auto mb-3">
              <ShoppingCartIcon className="mx-auto" height={40} width={40} />
            </div>
            <h3 className="font-medium text-gray-900">I am a buyer</h3>
            <p className="text-xs text-gray-500 mt-1">
              Browse and connect with sellers
            </p>
          </div>

          {/* Seller */}
          <div
            onClick={() => setSelectedRole('seller')}
            className={`border rounded-xl p-6 text-center cursor-pointer transition ${
              selectedRole === 'seller'
                ? 'border-green-500 bg-green-50'
                : 'border-gray-300 hover:border-green-500'
            }`}
          >
            <div className="rounded-xl mx-auto mb-3">
              <Store className="mx-auto" height={40} width={40} />
            </div>
            <h3 className="font-medium text-gray-900">I am a seller</h3>
            <p className="text-xs text-gray-500 mt-1">
              List your product/services and reach buyers
            </p>
          </div>
        </div>

        <button
          onClick={handleNext}
          disabled={!selectedRole}
          className={`w-full py-3 hover:cursor-pointer rounded-2xl font-medium transition ${
            selectedRole
              ? 'bg-slate-900 text-white hover:bg-slate-800'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Next
        </button>
      </motion.div>
    </motion.div>
  );
}
