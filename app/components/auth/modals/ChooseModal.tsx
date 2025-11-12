// components/auth/modals/ChooseModal.tsx
"use client";
import { X } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";

const modalVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const contentVariants = {
  hidden: { y: -50, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { delay: 0.1 } },
};

export default function ChooseModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  if (!isOpen) return null;

  return (
    <motion.div
      variants={modalVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <motion.div
        variants={contentVariants}
        className="w-full max-w-lg bg-white rounded-2xl p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Create Account</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="border border-gray-300 rounded-xl p-6 text-center hover:border-green-500 transition cursor-pointer">
            <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 mx-auto mb-3" />
            <h3 className="font-medium text-gray-900">I'm a buyer</h3>
            <p className="text-xs text-gray-500 mt-1">Browse and connect with sellers</p>
          </div>

          <div className="border border-gray-300 rounded-xl p-6 text-center hover:border-green-500 transition cursor-pointer">
            <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 mx-auto mb-3" />
            <h3 className="font-medium text-gray-900">I'm a seller</h3>
            <p className="text-xs text-gray-500 mt-1">List your product/services and reach buyers</p>
          </div>
        </div>

        <button className="w-full bg-slate-900 text-white py-3 rounded-full font-medium hover:bg-slate-800 transition">
          Next
        </button>
      </motion.div>
    </motion.div>
  );
}