// app/components/modals/AddProductModal.tsx
"use client";
import { X, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

const modalVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const contentVariants = {
  hidden: { y: -50, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { delay: 0.1 } },
};

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddProductModal({ isOpen, onClose }: AddProductModalProps) {
  const [selectedType, setSelectedType] = useState<"simple" | "variant" | null>(null);

  if (!isOpen) return null;

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
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Add Product</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-gray-100 transition text-red-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mb-6">
          <p className="text-sm text-gray-600 mb-4">Select product type</p>

          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setSelectedType("simple")}
              className={`flex flex-col items-center justify-center gap-3 p-6 rounded-2xl border-2 transition-all ${
                selectedType === "simple"
                  ? "border-slate-900 bg-slate-50"
                  : "border-gray-200 hover:border-gray-300 bg-white"
              }`}
            >
              <ShoppingBag className="w-8 h-8 text-gray-700" />
              <span className="text-sm font-medium text-gray-900">Simple Product</span>
            </button>

            <button
              onClick={() => setSelectedType("variant")}
              className={`flex flex-col items-center justify-center gap-3 p-6 rounded-2xl border-2 transition-all ${
                selectedType === "variant"
                  ? "border-slate-900 bg-slate-50"
                  : "border-gray-200 hover:border-gray-300 bg-white"
              }`}
            >
              <ShoppingBag className="w-8 h-8 text-gray-700" />
              <span className="text-sm font-medium text-gray-900">Variant Product</span>
            </button>
          </div>
        </div>

        <button
          disabled={!selectedType}
          className={`w-full py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
            selectedType
              ? "bg-slate-900 text-white hover:bg-slate-800"
              : "bg-gray-200 text-gray-500 cursor-not-allowed"
          }`}
        >
          Next
        </button>
      </motion.div>
    </motion.div>
  );
}