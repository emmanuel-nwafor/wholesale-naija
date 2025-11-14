"use client";
import React, { useState } from 'react';
import { ChevronDown, Image, Upload, X } from 'lucide-react';
import StoreSidebar from "@/app/components/sidebar/StoreSidebar";
import DashboardHeader from "@/app/components/header/DashboardHeader";
import ReviewStatusModal from "@/app/components/modals/ReviewStatusModal";

export default function StoreManagement() {
  const [logo, setLogo] = useState<File | null>(null);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [reviewModal, setReviewModal] = useState(false);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogo(file);
      setLogoUrl(URL.createObjectURL(file));
    }
  };

  const removeLogo = () => {
    if (logoUrl) URL.revokeObjectURL(logoUrl);
    setLogo(null);
    setLogoUrl(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setReviewModal(true);
  };

  return (
    <div className="flex min-h-screen">
      <StoreSidebar />
      <div className="flex-1 flex flex-col">
        <DashboardHeader />
        <main className="flex-1 p-4 md:p-10 lg:p-10 md:ml-64 bg-gray-50">
          <div className="max-w-4xl">
            <h1 className="text-2xl font-semibold mb-8">Store Information</h1>
            <form className="space-y-8" onSubmit={handleSubmit}>
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-4">Basic Store Info</h2>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">Store Logo</label>
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      {logoUrl ? (
                        <div className="w-24 h-24 rounded-xl overflow-hidden border border-gray-300">
                          <img src={logoUrl} alt="Store logo" className="w-full h-full object-cover" />
                          <button type="button" onClick={removeLogo} className="absolute top-1 right-1 p-1 bg-white rounded-full shadow-md hover:bg-gray-100">
                            <X className="h-4 w-4 text-gray-600" />
                          </button>
                        </div>
                      ) : (
                        <>
                            <label className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 transition-colors">
                                <Image className="h-8 w-8 text-gray-400 mb-1" />
                                <span className="text-xs text-gray-600">Media</span>
                                <input type="file" accept="image/jpeg,image/png" onChange={handleLogoChange} className="hidden" />
                            </label>
                            <div className="text-xs text-gray-500 mt-4">
                                Supported formats: JPEG, PNG<br />
                                Media may not exceed 5MB
                            </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Business / Store name *</label>
                  <input type="text" placeholder="e.g. My Store" className="w-full px-4 py-3 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">State / Region *</label>
                  <div className="relative">
                    <select className="w-full px-4 py-3 bg-gray-100 rounded-xl appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option>e.g. Lagos/Ikeja</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-3.5 h-5 w-5 text-gray-400 pointer-events-none" />
                  </div>
                </div>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Store address *</label>
                  <input type="text" placeholder="e.g. 123 Main St" className="w-full px-4 py-3 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Workdays</label>
                    <div className="relative">
                      <select className="w-full px-4 py-3 bg-gray-100 rounded-xl appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option>Mon - Sat</option>
                      </select>
                      <ChevronDown className="absolute right-4 top-3.5 h-5 w-5 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Open time</label>
                    <div className="relative">
                      <select className="w-full px-4 py-3 bg-gray-100 rounded-xl appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option>09:00 - 05:00 PM</option>
                      </select>
                      <ChevronDown className="absolute right-4 top-3.5 h-5 w-5 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                </div>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Store description *</label>
                  <textarea placeholder="Describe your store..." rows={4} className="w-full px-4 py-3 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
                </div>
              </div>
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-4">Contact Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone number *</label>
                    <input type="text" placeholder="e.g. +2348012345678" className="w-full px-4 py-3 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">WhatsApp (phone incl.) *</label>
                    <input type="text" placeholder="e.g. +2348012345678" className="w-full px-4 py-3 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-6">
                <button type="button" className="px-6 py-2.5 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50">Cancel</button>
                <button type="submit" className="px-6 py-2.5 bg-slate-900 text-white rounded-xl hover:bg-slate-800">Save Store Info</button>
              </div>
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