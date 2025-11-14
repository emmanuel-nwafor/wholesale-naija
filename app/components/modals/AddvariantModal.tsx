// components/modals/AddvariantModal.tsx
"use client";
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Upload } from 'lucide-react';

interface VariantRow {
  minQty: string;
  maxQty: string;
  price: string;
}

interface VariantData {
  name: string;
  image: File | null;
  imageUrl?: string | null;
  rows: VariantRow[];
}

interface AddVariantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { name: string; image: File | null; rows: VariantRow[] }) => void;
  initialData?: VariantData;
}

const modalVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const contentVariants = {
  hidden: { y: -50, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { delay: 0.1 } },
};

export default function AddVariantModal({ isOpen, onClose, onSave, initialData }: AddVariantModalProps) {
  const [name, setName] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [rows, setRows] = useState<VariantRow[]>([
    { minQty: '', maxQty: '', price: '' },
    { minQty: '', maxQty: '', price: '' },
    { minQty: '', maxQty: '', price: '' }
  ]);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setImagePreview(initialData.imageUrl || null);
      setRows(initialData.rows.length > 0 ? initialData.rows : [
        { minQty: '', maxQty: '', price: '' },
        { minQty: '', maxQty: '', price: '' },
        { minQty: '', maxQty: '', price: '' }
      ]);
    } else {
      setName('');
      setImage(null);
      setImagePreview(null);
      setRows([
        { minQty: '', maxQty: '', price: '' },
        { minQty: '', maxQty: '', price: '' },
        { minQty: '', maxQty: '', price: '' }
      ]);
    }
  }, [initialData, isOpen]);

  const updateRow = (index: number, field: keyof VariantRow, value: string) => {
    const newRows = [...rows];
    newRows[index][field] = value;
    setRows(newRows);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (!name.trim()) return;
    onSave({ name, image, rows });
  };

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
        className="w-full max-w-2xl bg-white rounded-2xl shadow-xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {initialData ? 'Edit Variant' : 'Add Variant'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Variant Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Variant Image *
            </label>
            <div className="flex items-center gap-4">
              <label htmlFor="variant-image" className="cursor-pointer">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center hover:border-gray-400 transition-colors"
                >
                  {imagePreview ? (
                    <motion.img
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover rounded-xl"
                    />
                  ) : (
                    <>
                      <Upload className="h-6 w-6 text-gray-400" />
                      <span className="text-xs text-gray-500 mt-1">Upload</span>
                    </>
                  )}
                </motion.div>
                <input
                  id="variant-image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
              {imagePreview && (
                <motion.button
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  onClick={() => {
                    setImage(null);
                    setImagePreview(null);
                  }}
                  className="text-xs text-red-500 hover:text-red-700"
                >
                  Remove
                </motion.button>
              )}
            </div>
          </div>

          {/* Variant Name */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Variant name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. phone"
              className="w-full px-4 py-3 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            />
          </motion.div>

          {/* Table Header */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="grid grid-cols-3 gap-2 text-xs font-medium text-gray-500 bg-gray-100 rounded-lg p-2"
          >
            <div>Min Qty</div>
            <div>Max Qty</div>
            <div>Price per unit</div>
          </motion.div>

          {/* Table Rows */}
          <div className="space-y-3">
            {rows.map((row, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + index * 0.05 }}
                className="grid grid-cols-3 gap-2"
              >
                <input
                  type="text"
                  value={row.minQty}
                  onChange={(e) => updateRow(index, 'minQty', e.target.value)}
                  placeholder="e.g. 100"
                  className="px-3 py-2 bg-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
                <input
                  type="text"
                  value={row.maxQty}
                  onChange={(e) => updateRow(index, 'maxQty', e.target.value)}
                  placeholder="e.g. 100"
                  className="px-3 py-2 bg-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-gray-500">₦</span>
                  <input
                    type="text"
                    value={row.price}
                    onChange={(e) => updateRow(index, 'price', e.target.value)}
                    placeholder=""
                    className="w-full pl-8 pr-3 py-2 bg-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="flex justify-end gap-3 p-6 border-t border-gray-200"
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={handleSave}
            className="px-6 py-2.5 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-colors"
          >
            {initialData ? 'Update Variant' : 'Save Variant'}
          </motion.button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}