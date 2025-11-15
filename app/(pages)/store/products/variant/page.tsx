"use client";
import React, { useState } from 'react';
import { ChevronDown, Plus, Trash2, Edit2, ChevronRight, ImageIcon } from 'lucide-react';
import StoreSidebar from "@/app/components/sidebar/StoreSidebar";
import DashboardHeader from "@/app/components/header/DashboardHeader";
import AddVariantModal from "@/app/components/modals/AddvariantModal";
import Image from "next/image"
import ReviewStatusModal from "@/app/components/modals/ReviewStatusModal";

interface VariantData {
  name: string;
  image: File | null;
  imageUrl: string | null;
  rows: { minQty: string; maxQty: string; price: string }[];
}

export default function AddProductVariantPage() {
  const [step, setStep] = useState(1);
  const [variants, setVariants] = useState<VariantData[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [reviewModal, setReviewModal] = useState(false);
  const [reviewStatus, setReviewStatus] = useState<'review' | 'approved' | 'rejected'>('review');

  const addVariant = () => {
    setEditingIndex(null);
    setModalOpen(true);
  };

  const handleSaveVariant = (data: { name: string; image: File | null; rows: VariantData['rows'] }) => {
    const imageUrl = data.image ? URL.createObjectURL(data.image) : null;
    const newVariant = { ...data, imageUrl };
    if (editingIndex !== null) {
      setVariants(variants.map((v, i) => i === editingIndex ? newVariant : v));
    } else {
      setVariants([...variants, newVariant]);
    }
    setModalOpen(false);
  };

  const handleEditVariant = (index: number) => {
    setEditingIndex(index);
    setModalOpen(true);
  };

  const removeVariant = (index: number) => {
    const variant = variants[index];
    if (variant.imageUrl) URL.revokeObjectURL(variant.imageUrl);
    setVariants(variants.filter((_, i) => i !== index));
    if (expandedIndex === index) setExpandedIndex(null);
  };

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setReviewModal(true);
    setReviewStatus('review');
  };

  return (
    <div className="flex min-h-screen">
      <StoreSidebar />
      <div className="flex-1 flex flex-col">
        <DashboardHeader />
        <main className="flex-1 p-4 md:p-6 lg:p-8 md:ml-64 bg-white">
          <div className="max-w-5xl mx-auto">
            <h1 className="text-2xl font-semibold mb-6">Add Product</h1>
            <div className="mb-10">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Product details</span>
                <span className="text-sm font-medium text-gray-700">Variant Setup</span>
              </div>
              <div className="relative mt-2">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full h-1 bg-gray-300 rounded-full" />
                </div>
                <div className="absolute inset-0 flex items-center transition-all duration-300" style={{ width: step === 1 ? '50%' : '100%' }}>
                  <div className="h-1 bg-slate-900 rounded-full transition-all duration-300" style={{ width: '100%' }} />
                </div>
                <div className="relative flex justify-between">
                  <div className={`w-2 h-2 rounded-full transition-colors ${step >= 1 ? 'bg-slate-900' : 'bg-gray-300'}`} />
                  <div className={`w-2 h-2 rounded-full transition-colors ${step >= 2 ? 'bg-slate-900' : 'bg-gray-300'}`} />
                </div>
              </div>
            </div>
            <div className="overflow-hidden">
              <div className={`flex transition-transform duration-500 ease-in-out ${step === 2 ? '-translate-x-full' : 'translate-x-0'}`}>
                <div className="w-full flex-shrink-0">
                  <div className="bg-white p-6 sm:p-6 md:p-6 lg:p-0">
                    <h2 className="text-lg font-medium text-gray-900 mb-2">Product details</h2>
                    <p className="text-sm text-gray-600 mb-8">Add basic info about the product.</p>
                    <form className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">Product Media *</label>
                        <div className="flex items-center gap-4">
                          <div className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center">
                            <ImageIcon className="h-10 w-10 text-gray-400" />
                          </div>
                          <div className="text-xs text-gray-600">Media</div>
                        </div>
                        <p className="text-xs text-gray-500 mt-3">
                          Add a main product image/video; you can add variant-specific media later<br />
                          Supported formats: JPEG, PNG, MP4 (Video)<br />
                          Media may not exceed 20MB
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Product name *</label>
                        <input type="text" placeholder="e.g. iPhone" className="w-full px-4 py-3 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                          <div className="relative">
                            <select className="w-full px-4 py-3 bg-gray-100 rounded-xl appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500">
                              <option>e.g. phone</option>
                            </select>
                            <ChevronDown className="absolute right-4 top-3.5 h-5 w-5 text-gray-400 pointer-events-none" />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Sub-category</label>
                          <div className="relative">
                            <select className="w-full px-4 py-3 bg-gray-100 rounded-xl appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500">
                              <option>e.g. phone</option>
                            </select>
                            <ChevronDown className="absolute right-4 top-3.5 h-5 w-5 text-gray-400 pointer-events-none" />
                          </div>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Brand / Nested Category</label>
                        <div className="relative">
                          <select className="w-full px-4 py-3 bg-gray-100 rounded-xl appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <option>e.g. phone</option>
                          </select>
                          <ChevronDown className="absolute right-4 top-3.5 h-5 w-5 text-gray-400 pointer-events-none" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Product description *</label>
                        <textarea placeholder="Describe your product..." rows={4} className="w-full px-4 py-3 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
                      </div>
                      <div className="flex justify-end gap-3 pt-6">
                        <button type="button" className="px-6 py-2.5 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50">Cancel</button>
                        <button type="button" onClick={() => setStep(2)} className="px-10 py-2.5 bg-slate-900 text-white rounded-xl hover:bg-slate-800 flex items-center gap-2">Next</button>
                      </div>
                    </form>
                  </div>
                </div>
                <div className="w-full flex-shrink-0">
                  <div className="bg-white p-6 sm:p-6 md:p-6 lg:p-0">
                    <h2 className="text-lg font-medium text-gray-900 mb-2">Variant Setup</h2>
                    <p className="text-sm text-gray-600 mb-8">Add product options or variations</p>
                    <form className="space-y-8" onSubmit={handleSubmit}>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">Unit of Measurement (UOM)</label>
                        <div className="relative max-w-md">
                          <select className="w-full px-4 py-3 bg-gray-50 rounded-xl appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <option>e.g. pieces / dozens / bags / packs / cartons</option>
                          </select>
                          <ChevronDown className="absolute right-4 top-3.5 h-5 w-5 text-gray-400 pointer-events-none" />
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-medium text-gray-700">Variants</h3>
                          <button type="button" onClick={addVariant} className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-xl text-sm text-gray-700 hover:bg-gray-50">
                            <Plus className="h-4 w-4" /> Add variant
                          </button>
                        </div>
                        {variants.map((variant, index) => (
                          <div key={index} className="bg-gray-50 rounded-xl overflow-hidden">
                            <div className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => toggleExpand(index)}>
                              <div className="flex items-center gap-4 flex-1">
                                <div className="w-16 h-16 rounded-xl overflow-hidden border border-gray-300">
                                  {variant.imageUrl ? (
                                    <Image src={variant.imageUrl} alt={variant.name} className="w-full h-full object-cover" />
                                  ) : (
                                    <div className="w-full h-full bg-gray-200 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center">
                                      <ImageIcon className="h-8 w-8 text-gray-400" />
                                    </div>
                                  )}
                                </div>
                                <div className="flex-1">
                                  <div className="px-3 py-2 bg-white rounded-lg text-sm font-medium">{variant.name}</div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <button type="button" onClick={(e) => { e.stopPropagation(); handleEditVariant(index); }} className="p-2 text-gray-500 hover:text-gray-700">
                                  <Edit2 className="h-4 w-4" />
                                </button>
                                <button type="button" onClick={(e) => { e.stopPropagation(); removeVariant(index); }} className="p-2 text-red-500 hover:text-red-700">
                                  <Trash2 className="h-4 w-4" />
                                </button>
                                <ChevronRight className={`h-5 w-5 text-gray-500 transition-transform ${expandedIndex === index ? 'rotate-90' : ''}`} />
                              </div>
                            </div>
                            {expandedIndex === index && (
                              <div className="border-t border-gray-200 px-4 py-3 bg-white">
                                <div className="space-y-2">
                                  {variant.rows.map((row, i) => (
                                    <div key={i} className="grid grid-cols-3 gap-2 text-sm">
                                      <div className="px-3 py-2 bg-gray-50 rounded-lg">{row.minQty || '-'}</div>
                                      <div className="px-3 py-2 bg-gray-50 rounded-lg">{row.maxQty || '-'}</div>
                                      <div className="px-3 py-2 bg-gray-50 rounded-lg">₦{row.price || '-'}</div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                      <div className="flex items-center justify-between py-4">
                        <div className="flex items-center">
                          <span className="text-sm font-medium text-gray-700 mr-3">Status</span>
                          <button type="button" onClick={() => setIsActive(!isActive)} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${isActive ? 'bg-blue-600' : 'bg-gray-200'}`}>
                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isActive ? 'translate-x-6' : 'translate-x-1'}`} />
                          </button>
                        </div>
                      </div>
                      <div className="flex justify-end gap-3 pt-6">
                        <button type="button" onClick={() => setStep(1)} className="px-6 py-2.5 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50">Back</button>
                        <button type="submit" className="px-6 py-2.5 bg-slate-900 text-white rounded-xl hover:bg-slate-800">Add Product</button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
            <AddVariantModal isOpen={modalOpen} onClose={() => { setModalOpen(false); setEditingIndex(null); }} onSave={handleSaveVariant} initialData={editingIndex !== null ? variants[editingIndex] : undefined} />
            <ReviewStatusModal isOpen={reviewModal} onClose={() => setReviewModal(false)} status={reviewStatus} productName="Sample Product" />
          </div>
        </main>
      </div>
    </div>
  );
}