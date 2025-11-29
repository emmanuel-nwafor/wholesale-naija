"use client";
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Upload, Trash2, Plus } from 'lucide-react';

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

export default function AddVariantModal({
  isOpen,
  onClose,
  onSave,
  initialData,
}: AddVariantModalProps) {
  const [name, setName] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [rows, setRows] = useState<VariantRow[]>([
    { minQty: '', maxQty: '', price: '' },
  ]);

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setName(initialData.name);
        setImagePreview(initialData.imageUrl || null);
        setRows(
          initialData.rows.length > 0
            ? initialData.rows
            : [{ minQty: '', maxQty: '', price: '' }]
        );
      } else {
        setName('');
        setImage(null);
        setImagePreview(null);
        setRows([{ minQty: '', maxQty: '', price: '' }]);
      }
    }
  }, [initialData, isOpen]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const updateRow = (index: number, field: keyof VariantRow, value: string) => {
    setRows((prev) =>
      prev.map((row, i) => (i === index ? { ...row, [field]: value } : row))
    );
  };

  const addRow = () => setRows((prev) => [...prev, { minQty: '', maxQty: '', price: '' }]);
  const removeRow = (index: number) => {
    if (rows.length === 1) return;
    setRows((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    if (!name.trim()) return alert('Variant name is required');

    const validRows = rows.filter((r) => r.minQty.trim() !== '' && r.price.trim() !== '');
    if (validRows.length === 0)
      return alert('Please add at least one pricing tier with Min Qty and Price');

    onSave({ name: name.trim(), image, rows: validRows });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">
            {initialData ? 'Edit Variant' : 'Add New Variant'}
          </h2>
          <button
            onClick={onClose}
            className="p-3 hover:bg-gray-100 rounded-xl transition"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-8">
          {/* Variant Image */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-4">
              Variant Image{' '}
              <span className="text-gray-500 font-normal">(Optional - for preview only)</span>
            </label>
            <div className="flex items-center gap-6">
              <label htmlFor="variant-image" className="cursor-pointer">
                <div className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center hover:border-gray-400 transition">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover rounded-2xl"
                    />
                  ) : (
                    <>
                      <Upload className="w-10 h-10 text-gray-400 mb-2" />
                      <span className="text-sm text-gray-500">Upload Image</span>
                    </>
                  )}
                </div>
                <input
                  id="variant-image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>

              {imagePreview && (
                <button
                  onClick={() => {
                    setImage(null);
                    setImagePreview(null);
                  }}
                  className="text-sm text-red-600 hover:text-red-700 font-medium"
                >
                  Remove Image
                </button>
              )}
            </div>
          </div>

          {/* Variant Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Variant Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. 256GB, Black Titanium, Large"
              className="w-full px-5 py-4 bg-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Pricing Tiers */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <label className="text-sm font-semibold text-gray-700">
                Pricing Tiers
              </label>
              <button
                type="button"
                onClick={addRow}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
              >
                <Plus className="w-4 h-4" /> Add Row
              </button>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-3 text-sm font-semibold text-gray-600">
              <div>Min Qty</div>
              <div>Max Qty (Optional)</div>
              <div>Price per Unit</div>
            </div>

            <div className="space-y-3">
              {rows.map((row, index) => (
                <div key={index} className="grid grid-cols-3 gap-4 items-center">
                  <input
                    type="number"
                    value={row.minQty}
                    onChange={(e) => updateRow(index, 'minQty', e.target.value)}
                    placeholder="5"
                    className="px-4 py-3 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="number"
                    value={row.maxQty}
                    onChange={(e) => updateRow(index, 'maxQty', e.target.value)}
                    placeholder="50 (optional)"
                    className="px-4 py-3 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600">₦</span>
                    <input
                      type="number"
                      value={row.price}
                      onChange={(e) => updateRow(index, 'price', e.target.value)}
                      placeholder="120000"
                      className="w-full pl-10 pr-12 py-3 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {rows.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeRow(index)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-4 p-6 border-t border-gray-200 bg-gray-50 rounded-b-3xl">
          <button
            onClick={onClose}
            className="px-8 py-3.5 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-100 font-medium transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-10 py-3.5 bg-slate-900 text-white rounded-xl hover:bg-slate-800 font-medium transition shadow-lg"
          >
            {initialData ? 'Update Variant' : 'Save Variant'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
