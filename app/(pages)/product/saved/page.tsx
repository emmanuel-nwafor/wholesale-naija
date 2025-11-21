'use client';

import React, { useState } from 'react';
import Header from '@/app/components/header/Header';
import ProductCard from '@/app/components/product-card/ProductCard';
import StoreDetailsModal from '@/app/components/modals/StoreDetailsModal';
import { Star, MapPin, Verified } from 'lucide-react';

export default function SavedProducts() {
  const [activeTab, setActiveTab] = useState<'products' | 'stores'>('products');
  const [selectedStore, setSelectedStore] = useState<any>(null);

  const unlockedStores = [
    { id: 1, name: 'ABSOLUTE Stores', location: 'Lagos, Nigeria', rating: 4.5, reviews: '3k+', phone: '+234 812 345 6789', address: '123, Eko Street, Computer Village Ikeja, Lagos State', description: 'Supplier of phones, phones accessories & part with 5+ years wholesale experience Supplier of phones, phones accessories & part with 5+ years wholesale experience......' },
    { id: 2, name: 'ABSOLUTE Stores', location: 'Lagos, Nigeria', rating: 4.9, reviews: '5.3k+', phone: '+234 812 345 6789', address: '123, Eko Street, Computer Village Ikeja, Lagos State', description: 'Supplier of phones, phones accessories & part with 5+ years wholesale experience...' },
    { id: 3, name: 'ABSOLUTE Stores', location: 'Lagos, Nigeria', rating: 4.8, reviews: '5k+', phone: '+234 812 345 6789', address: '123, Eko Street, Computer Village Ikeja, Lagos State', description: 'Supplier of phones, phones accessories & part with 5+ years wholesale experience...' },
    { id: 4, name: 'ABSOLUTE Stores', location: 'Lagos, Nigeria', rating: 4.9, reviews: '1k+', phone: '+234 812 345 6789', address: '123, Eko Street, Computer Village Ikeja, Lagos State', description: 'Supplier of phones, phones accessories & part with 5+ years wholesale experience...' },
    { id: 5, name: 'ABSOLUTE Stores', location: 'Lagos, Nigeria', rating: 4.7, reviews: '9.5k+', phone: '+234 812 345 6789', address: '123, Eko Street, Computer Village Ikeja, Lagos State', description: 'Supplier of phones, phones accessories & part with 5+ years wholesale experience...' },
    { id: 6, name: 'ABSOLUTE Stores', location: 'Lagos, Nigeria', rating: 4.6, reviews: '3k+', phone: '+234 812 345 6789', address: '123, Eko Street, Computer Village Ikeja, Lagos State', description: 'Supplier of phones, phones accessories & part with 5+ years wholesale experience...' },
  ];

  return (
    <>
      <Header />
      <div className="min-h-screen">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Tabs */}
          <div className="mb-8">
            <div className="flex gap-8 text-sm font-medium border-b border-gray-200">
              <button
                onClick={() => setActiveTab('products')}
                className={`pb-4 hover:cursor-pointer transition ${activeTab === 'products' ? 'text-black border-b-2 border-black' : 'text-gray-600 hover:text-black'}`}
              >
                Saved Products
              </button>
              <button
                onClick={() => setActiveTab('stores')}
                className={`pb-4 hover:cursor-pointer transition ${activeTab === 'stores' ? 'text-black border-b-2 border-black' : 'text-gray-600 hover:text-black'}`}
              >
                Unlocked Stores
              </button>
            </div>
          </div>

          {/* Saved Products Tab */}
          {activeTab === 'products' && (
            <>
              <div className="mb-8">
                <h2 className="text-center text-lg font-medium text-gray-900 bg-gray-50 py-4 rounded-xl">
                  All Products
                </h2>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                <div className="relative">
                  <ProductCard />
                </div>

                {[...Array(11)].map((_, i) => (
                  <ProductCard key={`saved-product-${i}`} />
                ))}
              </div>

              <div className="flex justify-center mt-12">
                <button className="flex items-center gap-2 px-8 py-4 bg-slate-800 text-white font-medium rounded-full hover:bg-slate-900 transition">
                  See more
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
            </>
          )}

          {/* Unlocked Stores Tab */}
          {activeTab === 'stores' && (
            <>
              <div className="mb-8">
                <h2 className="text-center text-lg font-medium text-gray-900 bg-gray-50 py-4 rounded-xl">
                  Unlocked Stores
                </h2>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-6">
                {unlockedStores.map((store) => (
                  <div
                    key={store.id}
                    className="bg-white max-w-4xl rounded-3xl border border-gray-200 p-6 text-center transition"
                  >
                    <div className="w-20 h-20 bg-gray-200 rounded-full mb-4" />
                    <h3 className="font-semibold text-gray-900 flex items-center gap-1">
                      {store.name}
                      <Verified className="w-4 h-4 fill-green-500 text-white" />
                    </h3>
                    <div className="flex gap-5">
                        <div className="flex items-center gap-1 text-xs text-gray-600 mt-1">
                        <MapPin className="w-3 h-3" />
                        {store.location}
                        </div>
                        <div className="flex items-center gap-1 mt-1 text-sm">
                        <span className="font-medium text-gray-900">{store.rating}</span>
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-gray-500">({store.reviews})</span>
                        </div>
                    </div>
                    <button
                      onClick={() => setSelectedStore(store)}
                      className="mt-4 w-full py-2.5 border hover:cursor-pointer border-gray-100 bg-gray-100 text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-200 transition"
                    >
                      View Profile
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex justify-center mt-12">
                <button className="flex items-center gap-2 px-8 py-4 bg-slate-800 text-white font-medium rounded-full hover:bg-slate-900 transition">
                  See more
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Store Details Modal */}
      <StoreDetailsModal
        isOpen={!!selectedStore}
        onClose={() => setSelectedStore(null)}
        store={selectedStore}
      />
    </>
  );
}