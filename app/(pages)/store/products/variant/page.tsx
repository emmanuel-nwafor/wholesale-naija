"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  Plus,
  Trash2,
  Edit2,
  ChevronRight,
  ChevronLeft,
  ImageIcon,
} from "lucide-react";
import StoreSidebar from "@/app/components/sidebar/StoreSidebar";
import DashboardHeader from "@/app/components/header/DashboardHeader";
import AddVariantModal from "@/app/components/modals/AddvariantModal";
import Image from "next/image";
import ReviewStatusModal from "@/app/components/modals/ReviewStatusModal";
import { fetchWithToken } from "@/app/utils/fetchWithToken";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

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

const inputStyles = "w-full px-4 py-3 bg-gray-100 rounded-xl focus:outline-none";

export default function AddProductVariantPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [variants, setVariants] = useState<VariantData[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [mainImage, setMainImage] = useState<File | null>(null);
  const [mainImageUrl, setMainImageUrl] = useState<string>("");
  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedCat, setSelectedCat] = useState<Category | null>(null);
  const [selectedSub, setSelectedSub] = useState<Subcategory | null>(null);
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch categories
  useEffect(() => {
    fetchWithToken<{ categories: Category[] }>("/v1/categories")
      .then((d) => setCategories(d.categories))
      .catch(() => {});
  }, []);

  // Sync subcategories & brands
  useEffect(() => {
    if (selectedCat) {
      setSubcategories(selectedCat.subcategories || []);
      setSelectedSub(null);
      setSelectedBrand(null);
      setBrands([]);
    }
  }, [selectedCat]);

  useEffect(() => {
    if (selectedSub) {
      setBrands(selectedSub.brands || []);
      setSelectedBrand(null);
    }
  }, [selectedSub]);

  // Revoke main image URL on change/unmount
  useEffect(() => {
    return () => {
      if (mainImageUrl) URL.revokeObjectURL(mainImageUrl);
    };
  }, [mainImageUrl]);

  const handleMainImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (mainImageUrl) URL.revokeObjectURL(mainImageUrl);
      setMainImage(file);
      setMainImageUrl(URL.createObjectURL(file));
    }
  };

  const addVariant = () => {
    setEditingIndex(null);
    setModalOpen(true);
  };

  const handleSaveVariant = (data: {
    name: string;
    image: File | null;
    rows: VariantData["rows"];
  }) => {
    const imageUrl = data.image ? URL.createObjectURL(data.image) : null;
    const newVariant = { ...data, imageUrl };

    if (editingIndex !== null) {
      // Revoke old image URL if exists
      const old = variants[editingIndex];
      if (old.imageUrl) URL.revokeObjectURL(old.imageUrl);

      setVariants((prev) =>
        prev.map((v, i) => (i === editingIndex ? newVariant : v))
      );
    } else {
      setVariants((prev) => [...prev, newVariant]);
    }
    setModalOpen(false);
  };

  const handleEditVariant = (i: number) => {
    setEditingIndex(i);
    setModalOpen(true);
  };

  const removeVariant = (i: number) => {
    const variant = variants[i];
    if (variant.imageUrl) URL.revokeObjectURL(variant.imageUrl);
    setVariants((prev) => prev.filter((_, idx) => idx !== i));
    if (expandedIndex === i) setExpandedIndex(null);
  };

  const toggleExpand = (i: number) => {
    setExpandedIndex(expandedIndex === i ? null : i);
  };

  // Submit & Reset Form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productName.trim()) return alert("Product name required");
    if (!selectedCat) return alert("Select a category");
    if (!mainImage) return alert("Main image required");
    if (!description.trim()) return alert("Description required");
    if (variants.length === 0) return alert("Add at least one variant");

    setIsSubmitting(true);
    try {
      const uploadForm = new FormData();
      uploadForm.append("files", mainImage);
      variants.forEach((v) => v.image && uploadForm.append("files", v.image));

      const uploadRes = await fetchWithToken<{ uploaded: { url: string }[] }>(
        "/uploads/multiple",
        { method: "POST", body: uploadForm }
      );

      if (!uploadRes?.uploaded) throw new Error("Image upload failed");

      const uploadedUrls = uploadRes.uploaded.map((u) => u.url);
      const mainImageUrlFromServer = uploadedUrls[0];
      const variantImageUrls = uploadedUrls.slice(1);

      if (uploadedUrls.length !== 1 + variants.filter((v) => v.image).length) {
        throw new Error("Some images failed to upload");
      }

      const productVariants = variants.map((v, index) => {
        const validRows = v.rows
          .map((r) => ({
            minQty: Number(r.minQty),
            maxQty: r.maxQty ? Number(r.maxQty) : undefined,
            price: Number(r.price),
          }))
          .filter((r) => r.minQty > 0 && r.price > 0)
          .sort((a, b) => a.minQty - b.minQty);

        if (validRows.length === 0)
          throw new Error(`Variant "${v.name}" must have at least one pricing tier`);

        return {
          name: v.name,
          image: variantImageUrls[index] || null,
          price: validRows[0].price,
          minQty: validRows[0].minQty,
          maxQty: validRows[0].maxQty,
          pricingTiers: validRows,
        };
      });

      const topLevelPrice = productVariants[0].price;

      const productPayload = {
        name: productName.trim(),
        type: "Variant",
        description: description.trim(),
        categories: selectedCat._id,
        subcategory: selectedSub?.name || null,
        brand: selectedBrand?.name || null,
        mainImage: mainImageUrlFromServer,
        price: topLevelPrice,
        variants: productVariants,
        images: [mainImageUrlFromServer, ...variantImageUrls],
      };

      await fetchWithToken("/v1/seller/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productPayload),
      });

      // SUCCESS → FULL RESET + REDIRECT
      setProductName("");
      setDescription("");
      setMainImage(null);
      if (mainImageUrl) URL.revokeObjectURL(mainImageUrl);
      setMainImageUrl("");
      setVariants([]);
      setSelectedCat(null);
      setSelectedSub(null);
      setSelectedBrand(null);
      setStep(1);

      router.push("/store/products");
    } catch (err: any) {
      alert(err.message || "Product upload failed");
    } finally {
      setIsSubmitting(false);
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

              <div className="mb-10">
                <div className="flex items-center justify-between text-sm font-medium text-gray-700">
                  <span className={step === 1 ? "text-slate-900 font-bold" : "text-gray-500"}>
                    Product details
                  </span>
                  <span className={step === 2 ? "text-slate-900 font-bold" : "text-gray-500"}>
                    Variant Setup
                  </span>
                </div>
                <div className="mt-3 relative h-2 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div
                    className="absolute left-0 top-0 h-full bg-slate-900"
                    animate={{ width: step === 1 ? "50%" : "100%" }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                  />
                </div>
              </div>

              <form onSubmit={handleSubmit} className="relative overflow-hidden">
                <AnimatePresence mode="wait">
                  {step === 1 && (
                    <motion.div
                      key="step1"
                      initial={{ x: 300, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      exit={{ x: -300, opacity: 0 }}
                      transition={{ duration: 0.4, ease: "easeInOut" }}
                      className="space-y-10"
                    >
                      <div>
                        <h2 className="text-lg font-medium text-gray-900 mb-2">Product details</h2>
                        <p className="text-sm text-gray-600 mb-8">Add basic info about the product.</p>

                        <div className="space-y-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-3">Product Media *</label>
                            <div onClick={() => fileInputRef.current?.click()} className="cursor-pointer">
                              {mainImageUrl ? (
                                <img src={mainImageUrl} alt="main" className="w-full max-w-44 h-44 object-cover rounded-xl border" />
                              ) : (
                                <div className="w-full max-w-44 h-44 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center hover:border-gray-400 transition">
                                  <ImageIcon className="w-16 h-16 text-gray-400 mb-3" />
                                  <p className="text-sm text-gray-600">Click to upload</p>
                                </div>
                              )}
                              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleMainImage} className="hidden" />
                            </div>
                          </div>

                          <input type="text" value={productName} onChange={(e) => setProductName(e.target.value)} placeholder="Product name *" className={inputStyles} />

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                              <select
                                value={selectedCat?._id || ""}
                                onChange={(e) => {
                                  const cat = categories.find((c) => c._id === e.target.value);
                                  setSelectedCat(cat || null);
                                }}
                                className={`${inputStyles} disabled:opacity-50`}
                              >
                                <option value="">Select category</option>
                                {categories.map((c) => (
                                  <option key={c._id} value={c._id}>{c.name}</option>
                                ))}
                              </select>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Sub-category</label>
                              <select
                                value={selectedSub?.name || ""}
                                onChange={(e) => {
                                  const sub = subcategories.find((s) => s.name === e.target.value);
                                  setSelectedSub(sub || null);
                                }}
                                disabled={!selectedCat}
                                className={`${inputStyles} disabled:opacity-50`}
                              >
                                <option value="">Select subcategory</option>
                                {subcategories.map((s) => (
                                  <option key={s.name} value={s.name}>{s.name}</option>
                                ))}
                              </select>
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Brand / Nested Category</label>
                            <select
                              value={selectedBrand?.name || ""}
                              onChange={(e) => {
                                const brand = brands.find((b) => b.name === e.target.value);
                                setSelectedBrand(brand || null);
                              }}
                              disabled={!selectedSub}
                              className={`${inputStyles} disabled:opacity-50`}
                            >
                              <option value="">Select brand</option>
                              {brands.map((b) => (
                                <option key={b.name} value={b.name}>{b.name}</option>
                              ))}
                            </select>
                          </div>

                          <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Product description *"
                            rows={4}
                            className={`${inputStyles} resize-none`}
                          />

                          <div className="flex justify-end">
                            <button type="button" onClick={() => setStep(2)} className="px-10 py-3 bg-slate-900 text-white rounded-xl hover:bg-slate-800 flex items-center gap-2 transition">
                              Next <ChevronRight className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {step === 2 && (
                    <motion.div
                      key="step2"
                      initial={{ x: 300, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      exit={{ x: -300, opacity: 0 }}
                      transition={{ duration: 0.4, ease: "easeInOut" }}
                      className="space-y-10"
                    >
                      <div>
                        <h2 className="text-lg font-medium text-gray-900 mb-2">Variant Setup</h2>
                        <p className="text-sm text-gray-600 mb-8">Add product options or variations</p>

                        <div className="space-y-6">
                          <div className="flex items-center justify-between">
                            <h3 className="text-sm font-medium text-gray-700">Variants ({variants.length})</h3>
                            <button type="button" onClick={addVariant} className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-xl text-sm text-gray-700 hover:bg-gray-50">
                              <Plus className="h-4 w-4" /> Add variant
                            </button>
                          </div>

                          {variants.map((variant, index) => (
                            <div key={`${variant.name}-${index}`} className="bg-gray-50 rounded-xl overflow-hidden">
                              <div className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-100 transition" onClick={() => toggleExpand(index)}>
                                <div className="flex items-center gap-4 flex-1">
                                  <div className="w-16 h-16 rounded-xl overflow-hidden border border-gray-300">
                                    {variant.imageUrl ? (
                                      <Image src={variant.imageUrl} alt={variant.name} width={64} height={64} className="w-full h-full object-cover" />
                                    ) : (
                                      <div className="w-full h-full bg-gray-200 border-2 border-dashed rounded-xl flex items-center justify-center">
                                        <ImageIcon className="h-8 w-8 text-gray-400" />
                                      </div>
                                    )}
                                  </div>
                                  <div className="px-3 py-2 bg-white rounded-lg text-sm font-medium">{variant.name}</div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <button type="button" onClick={(e) => { e.stopPropagation(); handleEditVariant(index); }} className="p-2 text-gray-500 hover:text-gray-700">
                                    <Edit2 className="h-4 w-4" />
                                  </button>
                                  <button type="button" onClick={(e) => { e.stopPropagation(); removeVariant(index); }} className="p-2 text-red-500 hover:text-red-700">
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                  <ChevronRight className={`h-5 w-5 text-gray-500 transition-transform ${expandedIndex === index ? "rotate-90" : ""}`} />
                                </div>
                              </div>

                              {expandedIndex === index && (
                                <div className="border-t border-gray-200 px-4 py-3 bg-white">
                                  <div className="space-y-2">
                                    {variant.rows.map((row, i) => (
                                      <div key={i} className="grid grid-cols-3 gap-2 text-sm">
                                        <div className="px-3 py-2 bg-gray-50 rounded-lg">{row.minQty || "-"}</div>
                                        <div className="px-3 py-2 bg-gray-50 rounded-lg">{row.maxQty || "-"}</div>
                                        <div className="px-3 py-2 bg-gray-50 rounded-lg">₦{row.price || "-"}</div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>

                        <div className="flex flex-col sm:flex-row justify-between gap-4 pt-8">
                          <button type="button" onClick={() => setStep(1)} className="flex items-center gap-2 px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition">
                            <ChevronLeft className="w-5 h-5" /> Back
                          </button>
                          <button
                            type="submit"
                            disabled={isSubmitting || variants.length === 0}
                            className="px-10 py-3 bg-slate-900 text-white rounded-xl hover:bg-slate-800 font-medium transition disabled:opacity-70 disabled:cursor-not-allowed"
                          >
                            {isSubmitting ? "Adding Product..." : "Add Product"}
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </form>
            </div>
          </main>
        </div>
      </div>

      <AddVariantModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingIndex(null);
        }}
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