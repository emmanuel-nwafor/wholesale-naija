"use client";
import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, Plus, Trash2, Edit2, ChevronRight, ImageIcon } from 'lucide-react';
import StoreSidebar from "@/app/components/sidebar/StoreSidebar";
import DashboardHeader from "@/app/components/header/DashboardHeader";
import AddVariantModal from "@/app/components/modals/AddvariantModal";
import Image from "next/image";
import ReviewStatusModal from "@/app/components/modals/ReviewStatusModal";
import { fetchWithToken } from "@/app/utils/fetchWithToken";

interface Category {
  _id: string;
  name: string;
  subcategories: Subcategory[];
}
interface Subcategory {
  name: string;
  brands: Brand[];
}
interface Brand {
  name: string;
}

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
  const [showReviewModal, setShowReviewModal] = useState(false);

  // Form Fields
  const [mainImage, setMainImage] = useState<File | null>(null);
  const [mainImageUrl, setMainImageUrl] = useState<string>("");
  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedCat, setSelectedCat] = useState("");
  const [selectedSub, setSelectedSub] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch categories
  useEffect(() => {
    fetchWithToken<{ categories: Category[] }>("/v1/categories")
      .then(data => setCategories(data.categories))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (selectedCat) {
      const cat = categories.find(c => c._id === selectedCat);
      setSubcategories(cat?.subcategories || []);
      setSelectedSub("");
      setSelectedBrand("");
      setBrands([]);
    }
  }, [selectedCat, categories]);

  useEffect(() => {
    if (selectedSub) {
      const sub = subcategories.find(s => s.name === selectedSub);
      setBrands(sub?.brands || []);
      setSelectedBrand("");
    }
  }, [selectedSub, subcategories]);

  const handleMainImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setMainImage(file);
      setMainImageUrl(URL.createObjectURL(file));
    }
  };

  const addVariant = () => {
    setEditingIndex(null);
    setModalOpen(true);
  };

  const handleSaveVariant = (data: { name: string; image: File | null; rows: VariantData['rows'] }) => {
    const imageUrl = data.image ? URL.createObjectURL(data.image) : null;
    const newVariant = { ...data, imageUrl };
    if (editingIndex !== null) {
      setVariants(prev => prev.map((v, i) => i === editingIndex ? newVariant : v));
    } else {
      setVariants(prev => [...prev, newVariant]);
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
    setVariants(prev => prev.filter((_, i) => i !== index));
    if (expandedIndex === index) setExpandedIndex(null);
  };

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!productName || !selectedCat || !description || !mainImage || variants.length === 0) {
      alert("Please fill all required fields and add at least one variant");
      return;
    }

    const formData = new FormData();

    formData.append("name", productName);
    formData.append("type", "Variant");
    formData.append("description", description);
    formData.append("categories", selectedCat);
    if (selectedBrand) formData.append("brand", selectedBrand);
    formData.append("images", mainImage);

    // Required top-level price
    let basePrice = "0";
    for (const variant of variants) {
      const firstTier = variant.rows.find(r => r.price && r.price.trim() !== "");
      if (firstTier?.price) {
        basePrice = firstTier.price;
        break;
      }
    }
    formData.append("price", basePrice);

    // Variants
    variants.forEach((variant, i) => {
      formData.append(`variants[${i}][name]`, variant.name);
      const sku = `${productName.slice(0, 8).toUpperCase().replace(/\s/g, '-')}-${variant.name.slice(0, 8).toUpperCase().replace(/\s/g, '-')}`;
      formData.append(`variants[${i}][sku]`, sku);

      const firstTier = variant.rows.find(r => r.price);
      if (firstTier) formData.append(`variants[${i}][price]`, firstTier.price);

      formData.append(`variants[${i}][stock]`, "100");
      formData.append(`variants[${i}][MOQ]`, "1");

      variant.rows
        .filter(row => row.minQty && row.price)
        .forEach((row, j) => {
          formData.append(`variants[${i}][pricingTiers][${j}][minQty]`, row.minQty);
          if (row.maxQty) formData.append(`variants[${i}][pricingTiers][${j}][maxQty]`, row.maxQty);
          formData.append(`variants[${i}][pricingTiers][${j}][price]`, row.price);
        });
    });

    try {
      await fetchWithToken("/v1/seller/products", {
        method: "POST",
        body: formData,
      });
      setShowReviewModal(true);
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Failed to create product");
    }
  };

  return (
    <>
      <div className="flex min-h-screen bg-gray-50">
        <StoreSidebar />
        <div className="flex-1 flex flex-col">
          <DashboardHeader />
          <main className="flex-1 p-4 md:p-6 lg:p-8 md:ml-64">
            <div className="max-w-5xl mx-auto">
              <h1 className="text-2xl font-semibold mb-6">Add Product</h1>

              {/* Progress Bar - Mobile Friendly */}
              <div className="mb-10">
                <div className="flex items-center justify-between text-sm font-medium text-gray-700">
                  <span className={step === 1 ? "text-slate-900" : "text-gray-500"}>Product details</span>
                  <span className={step === 2 ? "text-slate-900" : "text-gray-500"}>Variant Setup</span>
                </div>
                <div className="mt-3 relative h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="absolute left-0 top-0 h-full bg-slate-900 transition-all duration-500"
                    style={{ width: step === 1 ? "50%" : "100%" }}
                  />
                </div>
              </div>

              {/* Responsive Form - No Horizontal Sliding */}
              <form onSubmit={handleSubmit} className="space-y-10">
                {/* Step 1: Product Details */}
                <div className={step === 1 ? "block" : "hidden"}>
                  <h2 className="text-lg font-medium text-gray-900 mb-2">Product details</h2>
                  <p className="text-sm text-gray-600 mb-8">Add basic info about the product.</p>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">Product Media *</label>
                      <div onClick={() => fileInputRef.current?.click()} className="cursor-pointer">
                        {mainImageUrl ? (
                          <img src={mainImageUrl} alt="main" className="w-full max-w-44 h-44 object-cover rounded-xl border" />
                        ) : (
                          <div className="w-full max-w-44 h-44 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center">
                            <ImageIcon className="w-16 h-16 text-gray-400 mb-3" />
                            <p className="text-sm text-gray-600">Click to upload</p>
                          </div>
                        )}
                        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleMainImage} className="hidden" />
                      </div>
                    </div>

                    <input
                      type="text"
                      value={productName}
                      onChange={(e) => setProductName(e.target.value)}
                      placeholder="Product name *"
                      className="w-full px-4 py-3 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                        <select value={selectedCat} onChange={(e) => setSelectedCat(e.target.value)} className="w-full px-4 py-3 bg-gray-100 rounded-xl">
                          <option value="">Select category</option>
                          {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Sub-category</label>
                        <select value={selectedSub} onChange={(e) => setSelectedSub(e.target.value)} disabled={!selectedCat} className="w-full px-4 py-3 bg-gray-100 rounded-xl disabled:opacity-50">
                          <option value="">Select subcategory</option>
                          {subcategories.map(s => <option key={s.name}>{s.name}</option>)}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Brand / Nested Category</label>
                      <select value={selectedBrand} onChange={(e) => setSelectedBrand(e.target.value)} disabled={!selectedSub} className="w-full px-4 py-3 bg-gray-100 rounded-xl disabled:opacity-50">
                        <option value="">Select brand</option>
                        {brands.map(b => <option key={b.name}>{b.name}</option>)}
                      </select>
                    </div>

                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Product description *"
                      rows={4}
                      className="w-full px-4 py-3 bg-gray-100 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    <div className="flex justify-end">
                      <button type="button" onClick={() => setStep(2)} className="px-10 py-3 bg-slate-900 text-white rounded-xl hover:bg-slate-800 flex items-center gap-2">
                        Next <ChevronRight className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Step 2: Variant Setup */}
                <div className={step === 2 ? "block" : "hidden"}>
                  <h2 className="text-lg font-medium text-gray-900 mb-2">Variant Setup</h2>
                  <p className="text-sm text-gray-600 mb-8">Add product options or variations</p>

                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium text-gray-700">Variants</h3>
                      <button type="button" onClick={addVariant} className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-xl text-sm text-gray-700 hover:bg-gray-50">
                        <Plus className="h-4 w-4" /> Add variant
                      </button>
                    </div>

                    {variants.map((variant, index) => (
                      <div key={index} className="bg-gray-50 rounded-xl overflow-hidden">
                        <div className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-100" onClick={() => toggleExpand(index)}>
                          <div className="flex items-center gap-4 flex-1">
                            <div className="w-16 h-16 rounded-xl overflow-hidden border border-gray-300">
                              {variant.imageUrl ? (
                                <Image src={variant.imageUrl} alt={variant.name} width={64} height={64} className="w-full h-full object-cover" />
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

                  <div className="flex flex-col sm:flex-row justify-between gap-4 pt-6">
                    <button type="button" onClick={() => setStep(1)} className="px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 order-2 sm:order-1">
                      Back
                    </button>
                    <button type="submit" className="px-8 py-3 bg-slate-900 text-white rounded-xl hover:bg-slate-800 font-medium order-1 sm:order-2">
                      Add Product
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </main>
        </div>
      </div>

      <AddVariantModal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setEditingIndex(null); }}
        onSave={handleSaveVariant}
        initialData={editingIndex !== null ? variants[editingIndex] : undefined}
      />

      <ReviewStatusModal
        isOpen={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        status="review"
        productName={productName || "Your Product"}
      />
    </>
  );
}