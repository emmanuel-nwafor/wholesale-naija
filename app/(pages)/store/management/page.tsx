"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Edit3, Check, XCircle, ImageIcon, X } from "lucide-react";
import StoreSidebar from "@/app/components/sidebar/StoreSidebar";
import DashboardHeader from "@/app/components/header/DashboardHeader";
import ReviewStatusModal from "@/app/components/modals/ReviewStatusModal";
import { fetchWithToken } from "@/app/utils/fetchWithToken";
import { getCurrentSellerId } from "@/app/utils/auth";

export default function StoreManagement() {
  const [isEditing, setIsEditing] = useState(false);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [bannerUrl, setBannerUrl] = useState<string | null>(null);
  const [reviewModal, setReviewModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const [store, setStore] = useState({
    name: "Not set",
    location: "Not set",
    address: "Not set",
    description: "No description",
    phone: "Not set",
    whatsapp: "Not set",
    openingDays: "Not set",
    bannerUrl: null as string | null,
  });

  const loadStore = async () => {
    try {
      setLoading(true);
      console.log("Loading store...");
      const res = await fetchWithToken<{ store: any }>("/v1/seller/store");
      console.log("Store loaded:", res);

      if (!res?.store) {
        console.log("No store found");
        return;
      }

      const s = res.store;

      const street = typeof s.address === "object" ? s.address?.street || "" : s.address || "";

      const banner = s.bannerUrl
        ? s.bannerUrl.startsWith("http")
          ? s.bannerUrl
          : `https://wholesalenaija-backend-9k01.onrender.com/api/uploads/single${s.bannerUrl}`
        : null;

      setStore({
        name: s.name || "Not set",
        location: s.location || "Not set",
        address: street || "Not set",
        description: s.description || "No description",
        phone: s.contactPhone || "Not set",
        whatsapp: s.whatsapp || s.contactPhone || "Not set",
        openingDays: s.openingDays || "Not set",
        bannerUrl: banner,
      });

      setBannerUrl(banner);
    } catch (err: any) {
      console.error("Failed to load store:", err.message || err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStore();
  }, []);

  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (bannerUrl?.startsWith("blob:")) URL.revokeObjectURL(bannerUrl);
      setBannerFile(file);
      setBannerUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log("SAVE BUTTON CLICKED");

    const sellerId = await getCurrentSellerId();

    console.log("SELLER ID FROM TOKEN:", sellerId);

    if (!sellerId) {
      alert("No seller ID found! Please log out and log in again.");
      console.error("SELLER ID IS NULL - CHECK YOUR JWT TOKEN");
      return;
    }

    console.log("Sending update for sellerId:", sellerId);

    const formData = new FormData();
    formData.append("sellerId", sellerId);
    formData.append("name", store.name);
    formData.append("description", store.description);
    formData.append("location", store.location);
    formData.append("contactPhone", store.phone);
    formData.append("whatsapp", store.whatsapp);
    formData.append("openingDays", store.openingDays);

    if (store.address && store.address !== "Not set") {
      formData.append("address[street]", store.address);
    }
    if (bannerFile) {
      formData.append("banner", bannerFile);
      console.log("Banner file attached:", bannerFile.name);
    }

    try {
      const response = await fetchWithToken("/v1/seller/store", {
        method: "PUT",
        body: formData,
      });

      console.log("UPDATE SUCCESS:", response);

      await loadStore();

      setIsEditing(false);
      setBannerFile(null);
      setReviewModal(true);
    } catch (err: any) {
      console.error("UPDATE FAILED:", err);
      alert("Update failed. Check console.");
    }
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setBannerFile(null);
    if (bannerUrl?.startsWith("blob:")) {
      URL.revokeObjectURL(bannerUrl);
    }
    loadStore();
  };

  if (loading) {
    return (
      <div className="flex min-h-screen">
        <StoreSidebar />
        <div className="flex-1 flex items-center justify-center text-lg">
          Loading store...
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <StoreSidebar />
      <div className="flex-1 flex flex-col">
        <DashboardHeader />
        <main className="flex-1 p-4 md:p-10 lg:p-10 md:ml-64 bg-gray-50">
          <div className="max-w-4xl">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-2xl font-semibold">Store Information</h1>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-xl hover:bg-slate-800"
                >
                  <Edit3 className="w-4 h-4" /> Edit
                </button>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-8 mt-8">
              {/* Logo */}
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-4">Store Logo</h2>
                <div className="flex items-center gap-6">
                  <div className="relative">
                    {bannerUrl ? (
                      <div className="w-32 h-32 rounded-xl overflow-hidden border border-gray-300">
                        <Image src={bannerUrl} alt="Store logo" fill className="object-cover" />
                        {isEditing && (
                          <button
                            type="button"
                            onClick={() => {
                              setBannerFile(null);
                              setBannerUrl(store.bannerUrl);
                            }}
                            className="absolute top-2 right-2 p-1.5 bg-white rounded-full shadow"
                          >
                            <X className="w-4 h-4 text-red-600" />
                          </button>
                        )}
                      </div>
                    ) : (
                      <div className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center">
                        <ImageIcon className="w-12 h-12 text-gray-400" />
                      </div>
                    )}
                  </div>

                  {isEditing && (
                    <label className="cursor-pointer text-sm text-blue-600 hover:underline">
                      Change logo
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleBannerChange}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>

              {/* Form Fields */}
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Store Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={store.name}
                      onChange={(e) => setStore({ ...store, name: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  ) : (
                    <p className="font-medium">{store.name}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">State / Region</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={store.location}
                        onChange={(e) => setStore({ ...store, location: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-100 rounded-xl"
                      />
                    ) : (
                      <p>{store.location}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Street Address</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={store.address}
                        onChange={(e) => setStore({ ...store, address: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-100 rounded-xl"
                      />
                    ) : (
                      <p>{store.address}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  {isEditing ? (
                    <textarea
                      value={store.description}
                      onChange={(e) => setStore({ ...store, description: e.target.value })}
                      rows={4}
                      className="w-full px-4 py-3 bg-gray-100 rounded-xl resize-none"
                    />
                  ) : (
                    <p className="whitespace-pre-wrap">{store.description}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Opening Days</label>
                  {isEditing ? (
                    <select
                      value={store.openingDays}
                      onChange={(e) => setStore({ ...store, openingDays: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-100 rounded-xl"
                    >
                      <option>Mon - Sun</option>
                      <option>Mon - Sat</option>
                      <option>Mon - Fri</option>
                    </select>
                  ) : (
                    <p>{store.openingDays}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={store.phone}
                        onChange={(e) => setStore({ ...store, phone: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-100 rounded-xl"
                      />
                    ) : (
                      <p>{store.phone}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">WhatsApp</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={store.whatsapp}
                        onChange={(e) => setStore({ ...store, whatsapp: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-100 rounded-xl"
                      />
                    ) : (
                      <p>{store.whatsapp}</p>
                    )}
                  </div>
                </div>
              </div>

              {isEditing && (
                <div className="flex justify-end gap-4 pt-8">
                  <button
                    type="button"
                    onClick={cancelEditing}
                    className="flex items-center gap-2 px-6 py-2.5 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50"
                  >
                    <XCircle className="w-4 h-4" /> Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 text-white rounded-xl hover:bg-slate-800"
                  >
                    <Check className="w-4 h-4" /> Save Changes
                  </button>
                </div>
              )}
            </form>
          </div>
        </main>
      </div>

      <ReviewStatusModal
        isOpen={reviewModal}
        onClose={() => setReviewModal(false)}
        status="review"
        productName="Store Information"
      />
    </div>
  );
}