"use client";
import React, { useState } from 'react';
import { ChevronDown, Image } from 'lucide-react';
import StoreSidebar from "@/app/components/sidebar/StoreSidebar";
import DashboardHeader from "@/app/components/header/DashboardHeader";

export default function AddProductSimplePage() {
  const [isActive, setIsActive] = useState(false);

  return (
    <div className="flex min-h-screen">
      <StoreSidebar />
      
      <div className="flex-1 flex flex-col">
        <DashboardHeader />
        
        <main className="flex-1 p-4 md:p-10 lg:p-10 md:ml-64 bg-gray-50">
          <div className="max-w-5xl">
            <h1 className="text-2xl font-semibold mb-6">Add Product</h1>
            
            <form className="gap-6 flex flex-col">
              {/* Media Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Media *
                </label>
                <div className="border-2 border-dashed w-40 h-40 border-gray-300 rounded-2xl p-6 text-center flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 transition-colors">
                  <Image className="h-12 w-12 text-gray-400 mb-2" />
                  <p className="text-xs text-gray-600">Media</p>
                  <input type="file" multiple accept="image/jpeg,image/png" className="hidden" />
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Media type: 4 images<br />
                  Supported formats: JPEG, PNG<br />
                  Media should not exceed 20MB in total
                </p>
              </div>

              {/* Product Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. iPhone"
                  className="w-full px-3 py-3 bg-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Category & Sub-category */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <div className="relative">
                    <select className="w-full px-3 py-3 bg-gray-100 rounded-2xl appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option>e.g. phone</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-3 h-4 w-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sub-category
                  </label>
                  <div className="relative">
                    <select className="w-full px-3 py-3 bg-gray-100 rounded-2xl appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option>e.g. phone</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-3 h-4 w-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Brand */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Brand / Nested Category
                </label>
                <div className="relative">
                  <select className="w-full px-3 py-3 bg-gray-100 rounded-2xl appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>e.g. phone</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-3 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product description *
                </label>
                <textarea
                  placeholder="Describe your product..."
                  rows={4}
                  className="w-full px-3 py-4 bg-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

              {/* Price */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price (per item) *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-gray-500">₦</span>
                  <input
                    type="text"
                    placeholder="0.00"
                    className="w-full pl-8 pr-3 py-3 bg-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* MOQ */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  MOQ (Minimum Order Quantity)
                </label>
                <input
                  type="text"
                  placeholder="e.g. 100"
                  className="w-full px-3 py-3 bg-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Status Toggle */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="text-sm font-medium text-gray-700 mr-3">Status</span>
                  <button
                    type="button"
                    onClick={() => setIsActive(!isActive)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      isActive ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        isActive ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  className="px-6 py-2 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-slate-900 text-white rounded-xl hover:bg-slate-800"
                >
                  Add Product
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}