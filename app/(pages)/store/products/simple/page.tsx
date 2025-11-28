"use client";
import React, { useState, useEffect, useRef } from "react";
import { ImageIcon } from "lucide-react";
import { fetchWithToken } from "@/app/utils/fetchWithToken";
import StoreSidebar from "@/app/components/sidebar/StoreSidebar";
import DashboardHeader from "@/app/components/header/DashboardHeader";
import ReviewStatusModal from "@/app/components/modals/ReviewStatusModal";

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

export default function AddProductSimplePage() {
  const [isActive, setIsActive] = useState(true);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCat, setSelectedCat] = useState<Category | null>(null);
  const [selectedSub, setSelectedSub] = useState<Subcategory | null>(null);
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [images, setImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form fields
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [moq, setMoq] = useState("");
  const [unit, setUnit] = useState("pieces"); // optional: customize unit

  // Fetch categories
  useEffect(() => {
    fetchWithToken<{ categories: Category[] }>("/v1/categories")
      .then((data) => setCategories(data.categories))
      .catch(() => alert("Failed to load categories"));
  }, []);

  // Update subcategories
  useEffect(() => {
    if (selectedCat) {
      setSubcategories(selectedCat.subcategories || []);
      setSelectedSub(null);
      setSelectedBrand(null);
      setBrands([]);
    }
  }, [selectedCat]);

  // Update brands
  useEffect(() => {
    if (selectedSub) {
      setBrands(selectedSub.brands || []);
      setSelectedBrand(null);
    }
  }, [selectedSub]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + images.length > 4) {
      alert("Maximum 4 images allowed");
      return;
    }
    setImages(prev => [...prev, ...files]);
    files.forEach(file => {
      const url = URL.createObjectURL(file);
      setPreviewUrls(prev => [...prev, url]);
    });
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) return alert("Product name is required");
    if (!selectedCat) return alert("Please select a category");
    if (!description.trim()) return alert("Description is required");
    if (!price) return alert("Price is required");
    if (images.length === 0) return alert("Upload at least one image");

    const cleanPrice = price.replace(/[₦,\s]/g, "");
    const moqValue = moq ? parseInt(moq, 10) : 1;
    const moqString = moqValue > 0 ? `${moqValue} ${unit}` : "1 piece";

    try {
      // Match your exact payload structure
      await fetchWithToken("/v1/seller/products", {
        method: "POST",
        body: JSON.stringify({
          media: images,
          additionalFields: {
            name: name.trim(),
            type: "Simple",
            price: cleanPrice,
            moq: moqString,
            description: description.trim(),
            categories: selectedCat._id,
            subcategory: selectedSub?.name || undefined,
            brand: selectedBrand?.name || undefined,
          },
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      setShowReviewModal(true);

      // Reset form
      setName("");
      setDescription("");
      setPrice("");
      setMoq("");
      setImages([]);
      setPreviewUrls([]);
      setSelectedCat(null);
      setSelectedSub(null);
      setSelectedBrand(null);
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Failed to add product");
    }
  };

  return (
    <>
      <div className="flex flex-col min-h-screen bg-gray-50">
        <header className="w-full">
          <DashboardHeader />
        </header>
        <div className="flex flex-col md:flex-row flex-1">
          <div className="flex-shrink-0 w-full md:w-64">
            <StoreSidebar />
          </div>
          <main className="flex-1 p-4 md:p-10 w-full">
            <div className="w-full max-w-full md:max-w-6xl mx-auto">
              <h1 className="text-2xl md:text-3xl font-semibold mb-6">Add Product</h1>

              <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Media * ({images.length}/4)
                  </label>
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed w-full h-64 border-gray-300 rounded-2xl p-6 text-center flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 transition-colors"
                  >
                    {previewUrls.length === 0 ? (
                      <>
                        <ImageIcon className="h-12 w-12 text-gray-400 mb-2" />
                        <p className="text-sm text-gray-600">Click to upload (max 4 images)</p>
                      </>
                    ) : (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
                        {previewUrls.map((url, i) => (
                          <div key={i} className="relative group">
                            <img src={url} alt="preview" className="w-full h-32 object-cover rounded-lg" />
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                removeImage(i);
                              }}
                              className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 text-xs opacity-0 group-hover:opacity-100 transition"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                        {images.length < 4 && (
                          <div className="border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center h-32">
                            <span className="text-4xl text-gray-400">+</span>
                          </div>
                        )}
                      </div>
                    )}
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept="image/jpeg,image/png"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </div>
                </div>

                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Product name *"
                  className="w-full px-4 py-3 bg-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                    <select
                      value={selectedCat?._id || ""}
                      onChange={(e) => {
                        const cat = categories.find(c => c._id === e.target.value);
                        setSelectedCat(cat || null);
                      }}
                      className="w-full px-4 py-3 bg-gray-100 rounded-2xl"
                      required
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">Sub-category</label>
                    <select
                      value={selectedSub?.name || ""}
                      onChange={(e) => {
                        const sub = subcategories.find(s => s.name === e.target.value);
                        setSelectedSub(sub || null);
                      }}
                      disabled={!selectedCat}
                      className="w-full px-4 py-3 bg-gray-100 rounded-2xl disabled:opacity-50"
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Brand (Optional)</label>
                  <select
                    value={selectedBrand?.name || ""}
                    onChange={(e) => {
                      const brand = brands.find(b => b.name === e.target.value);
                      setSelectedBrand(brand || null);
                    }}
                    disabled={!selectedSub}
                    className="w-full px-4 py-3 bg-gray-100 rounded-2xl disabled:opacity-50"
                  >
                    <option value="">Select brand</option>
                    {brands.map((b) => (
                      <option key={b.name} value={b.name}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>

                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Product description *"
                  rows={4}
                  className="w-full px-4 py-4 bg-gray-100 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Price (₦) *</label>
                    <input
                      type="text"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="e.g. 550,000"
                      className="w-full px-4 py-3 bg-gray-100 rounded-2xl"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">MOQ (Minimum Order Quantity)</label>
                    <input
                      type="number"
                      value={moq}
                      onChange={(e) => setMoq(e.target.value)}
                      placeholder="e.g. 100"
                      className="w-full px-4 py-3 bg-gray-100 rounded-2xl"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="font-medium text-gray-700">Status</span>
                  <button
                    type="button"
                    onClick={() => setIsActive(!isActive)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isActive ? "bg-blue-600" : "bg-gray-300"}`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isActive ? "translate-x-6" : "translate-x-1"}`} />
                  </button>
                  <span className="text-sm text-gray-600">{isActive ? "Active" : "Inactive"}</span>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button type="button" className="px-6 py-3 border border-gray-300 rounded-xl hover:bg-gray-50">
                    Cancel
                  </button>
                  <button type="submit" className="px-6 py-3 bg-slate-900 text-white rounded-xl hover:bg-slate-800">
                    Add Product
                  </button>
                </div>
              </form>
            </div>
          </main>
        </div>
      </div>

      <ReviewStatusModal
        isOpen={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        status="review"
        productName={name || "Your Product"}
      />
    </>
  );
}