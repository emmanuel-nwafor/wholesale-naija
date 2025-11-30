"use client";

import { X, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { useRouter } from "next/navigation";

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
  const router = useRouter();

  if (!isOpen) return null;

  const handleNext = () => {
    if (!selectedType) return;

    if (selectedType === "simple") {
      router.push("/store/products/simple");
    } else if (selectedType === "variant") {
      router.push("/store/products/variant");
    }
    onClose();
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
        className="w-full max-w-xl bg-white rounded-2xl p-8 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Add Product</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="mb-10">
          <p className="text-sm text-gray-600 mb-6">Choose the type of product you want to add</p>

          <div className="grid grid-cols-2 gap-6">
            {/* Simple Product */}
            <button
              onClick={() => setSelectedType("simple")}
              className={`flex flex-col items-center justify-center gap-4 p-8 rounded-2xl border-2 transition-all duration-200 ${
                selectedType === "simple"
                  ? "border-slate-900 bg-slate-50"
                  : "border-gray-200 hover:border-gray-300 bg-white hover:cursor-pointer"
              }`}
            >
              <div className="p-4 bg-slate-100 rounded-full">
                <ShoppingBag className="w-10 h-10 text-slate-700" />
              </div>
              <div className="text-center">
                <h3 className="font-semibold text-gray-900">Simple Product</h3>
                <p className="text-xs text-gray-500 mt-1">One price, one variant</p>
              </div>
            </button>

            {/* Variant Product */}
            <button
              onClick={() => setSelectedType("variant")}
              className={`flex flex-col items-center justify-center gap-4 p-8 rounded-2xl border-2 transition-all duration-200 ${
                selectedType === "variant"
                  ? "border-slate-900 bg-slate-50"
                  : "border-gray-200 hover:border-gray-300 bg-white hover:cursor-pointer"
              }`}
            >
              <div className="p-4 bg-slate-100 rounded-full">
                <ShoppingBag className="w-10 h-10 text-slate-700" />
              </div>
              <div className="text-center">
                <h3 className="font-semibold text-gray-900">Variant Product</h3>
                <p className="text-xs text-gray-500 mt-1">Multiple sizes, colors, etc.</p>
              </div>
            </button>
          </div>
        </div>

        <button
          onClick={handleNext}
          disabled={!selectedType}
          className={`w-full py-4 rounded-xl font-semibold text-lg transition-all flex items-center justify-center gap-3 ${
            selectedType
              ? "bg-slate-900 text-white hover:bg-slate-800 shadow-lg"
              : "bg-gray-200 text-gray-500 cursor-not-allowed"
          }`}
        >
          Next
        </button>
      </motion.div>
    </motion.div>
  );
}