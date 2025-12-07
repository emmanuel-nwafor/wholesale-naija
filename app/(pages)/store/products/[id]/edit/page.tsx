'use client';
import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, Upload, X, Image as ImageIcon } from 'lucide-react';
import StoreSidebar from '@/app/components/sidebar/StoreSidebar';
import DashboardHeader from '@/app/components/header/DashboardHeader';
import { fetchWithToken } from '@/app/utils/fetchWithToken';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import ReviewStatusModal from '@/app/components/modals/ReviewStatusModal';

// --- Type Definitions ---
interface Brand {
  name: string;
}

interface Subcategory {
  name: string;
  brands: Brand[];
}

interface Category {
  _id: string;
  name: string;
  subcategories: Subcategory[];
}

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  moq?: string | number;
  images: string[];
  categories: string[];
  subcategory?: string;
  brand?: string;
  status: string;
}

// --- Component ---
export default function ProductEditPage() {
  const router = useRouter();
  const productId =
    typeof window !== 'undefined'
      ? localStorage.getItem('selectedProductId')
      : null;

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);
  const [product, setProduct] = useState<Product | null>(null);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [moq, setMoq] = useState('');
  const [_status, setStatus] = useState(true);

  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCat, setSelectedCat] = useState('');
  const [selectedSub, setSelectedSub] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  // FIX: Replaced 'any[]' with specific types (L48, L49)
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);

  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // REMOVED: Unused warning fix (L56)
  const [modalState, setModalState] = useState<{
    show: boolean;
    type: 'success' | 'error';
    message: string;
  }>({ show: false, type: 'success', message: '' });

  const [showReviewModal, setShowReviewModal] = useState(false);

  useEffect(() => {
    if (!productId) {
      setModalState({
        show: true,
        type: 'error',
        message: 'No product selected for editing.',
      });
      setTimeout(() => router.push('/store/products'), 1500);
    }
  }, [productId, router]);

  useEffect(() => {
    if (!productId) return;
    const load = async () => {
      try {
        const [prodRes, catRes] = await Promise.all([
          fetchWithToken<{ product: Product }>(`/v1/products/${productId}`),
          fetchWithToken<{ categories: Category[] }>('/v1/categories'),
        ]);
        const p = prodRes.product;
        setProduct(p);
        setName(p.name);
        setDescription(p.description || '');
        setPrice(p.price.toString());
        setMoq(p.moq?.toString() || '');
        setStatus(p.status === 'active' || p.status === 'approved');
        setExistingImages(p.images);
        setPreviewUrls(p.images);
        setSelectedCat(p.categories[0] || '');
        setSelectedSub(p.subcategory || '');
        setSelectedBrand(p.brand || '');
        setCategories(catRes.categories);
      } catch {
        setModalState({
          show: true,
          type: 'error',
          message: 'Failed to load product.',
        });
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [productId]);

  useEffect(() => {
    // FIX: Added 'categories' to dependency array (L105)
    if (selectedCat && categories.length > 0) {
      const cat = categories.find((c) => c._id === selectedCat);
      setSubcategories(cat?.subcategories || []);
      if (!cat?.subcategories.find((s) => s.name === selectedSub)) {
        setSelectedSub('');
        setSelectedBrand('');
      }
    }
  }, [selectedCat, categories, selectedSub]);

  useEffect(() => {
    if (selectedSub && subcategories.length > 0) {
      const sub = subcategories.find((s) => s.name === selectedSub);
      const subBrands: Brand[] = sub?.brands || [];
      setBrands(subBrands);
      if (!subBrands.find((b) => b.name === selectedBrand))
        setSelectedBrand('');
    }
  }, [selectedSub, subcategories, selectedBrand]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + existingImages.length + newImages.length > 4) {
      setModalState({
        show: true,
        type: 'error',
        message: 'Maximum 4 images allowed.',
      });
      return;
    }
    setNewImages((prev) => [...prev, ...files]);
    files.forEach((f) =>
      setPreviewUrls((prev) => [...prev, URL.createObjectURL(f)])
    );
  };

  const removeImage = (index: number) => {
    if (index < existingImages.length)
      setExistingImages((prev) => prev.filter((_, i) => i !== index));
    else
      setNewImages((prev) =>
        prev.filter((_, i) => i !== index - existingImages.length)
      );
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productId) return;
    if (!name || !price || previewUrls.length === 0) {
      setModalState({
        show: true,
        type: 'error',
        message: 'Please fill all required fields.',
      });
      return;
    }
    setSaving(true);
    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('price', price);
    if (moq) formData.append('moq', moq);
    formData.append('categories', selectedCat);
    if (selectedSub) formData.append('subcategory', selectedSub);
    if (selectedBrand) formData.append('brand', selectedBrand);
    existingImages.forEach((img) => formData.append('existingImages', img));
    newImages.forEach((img) => formData.append('images', img));
    try {
      await fetchWithToken(`/v1/seller/products/${productId}`, {
        method: 'PATCH',
        body: formData,
      });
      setModalState({
        show: true,
        type: 'success',
        message: 'Product updated successfully!',
      });
      setTimeout(() => setShowReviewModal(true), 500);
    } catch (err: unknown) {
      // FIX: Replaced 'any' with 'unknown' and safely access error message (L154)
      const message =
        err instanceof Error
          ? err.message
          : 'Failed to update. An unknown error occurred.';
      setModalState({ show: true, type: 'error', message: message });
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-gray-600">Loading product...</p>
      </div>
    );

  return (
    <>
      <div className="flex min-h-screen bg-gray-50">
        <StoreSidebar />
        <div className="flex-1 flex flex-col">
          <DashboardHeader />
          <main className="flex-1 p-6 lg:p-8 md:ml-64">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center gap-4 mb-8">
                <button
                  onClick={() => router.back()}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <h1 className="text-2xl font-bold text-gray-900">
                  Edit Product
                </h1>
              </div>
              <form
                onSubmit={handleSubmit}
                className="bg-white rounded-3xl shadow-sm p-8 space-y-8"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Product Media *
                  </label>
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-gray-300 rounded-2xl p-6 cursor-pointer hover:border-gray-400 transition"
                  >
                    {previewUrls.length === 0 ? (
                      <div className="text-center py-12">
                        <ImageIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <p className="text-sm text-gray-600">
                          Click to upload (max 4 images)
                        </p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-4 gap-4">
                        {previewUrls.map((url, i) => (
                          <div key={i} className="relative group">
                            <Image
                              src={url}
                              alt="Preview"
                              width={200}
                              height={200}
                              className="w-full h-48 object-cover rounded-xl"
                            />
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                removeImage(i);
                              }}
                              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                        {previewUrls.length < 4 && (
                          <div className="border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center h-48">
                            <Upload className="w-10 h-10 text-gray-400" />
                          </div>
                        )}
                      </div>
                    )}
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product name *
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500"
                    placeholder="iPhone 15 Promax"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category *
                    </label>
                    <select
                      value={selectedCat}
                      onChange={(e) => setSelectedCat(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-100 rounded-xl"
                    >
                      <option value="">Select category</option>
                      {categories.map((c) => (
                        <option key={c._id} value={c._id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Sub-category
                    </label>
                    <select
                      value={selectedSub}
                      onChange={(e) => setSelectedSub(e.target.value)}
                      disabled={!selectedCat}
                      className="w-full px-4 py-3 bg-gray-100 rounded-xl disabled:opacity-50"
                    >
                      <option value="">Select subcategory</option>
                      {subcategories.map((s) => (
                        <option key={s.name} value={s.name}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Brand / Nested Category
                  </label>
                  <select
                    value={selectedBrand}
                    onChange={(e) => setSelectedBrand(e.target.value)}
                    disabled={!selectedSub}
                    className="w-full px-4 py-3 bg-gray-100 rounded-xl disabled:opacity-50"
                  >
                    <option value="">e.g. Apple</option>
                    {brands.map((b) => (
                      <option key={b.name} value={b.name}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product description *
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={5}
                    className="w-full px-4 py-3 bg-gray-100 rounded-xl resize-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Official iPhone you must be invited..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price (per item) *
                    </label>
                    <input
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500"
                      placeholder="550000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      MOQ
                    </label>
                    <input
                      type="number"
                      value={moq}
                      onChange={(e) => setMoq(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500"
                      placeholder="50"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-4 pt-6">
                  <button
                    type="button"
                    onClick={() => router.back()}
                    className="px-6 py-3 border border-gray-300 rounded-xl hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-8 py-3 bg-slate-900 text-white rounded-xl hover:bg-slate-800 disabled:opacity-70"
                  >
                    {saving ? 'Updating...' : 'Update Changes'}
                  </button>
                </div>
              </form>
            </div>
          </main>
        </div>
      </div>

      {showReviewModal && product && (
        <ReviewStatusModal
          isOpen={showReviewModal}
          onClose={() => setShowReviewModal(false)}
          status="review"
          productName={product.name}
        />
      )}
    </>
  );
}
