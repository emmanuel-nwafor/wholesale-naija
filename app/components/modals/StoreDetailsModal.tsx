'use client';

import React from 'react';
import { Star, MapPin, Verified, Phone, MessageCircle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ProductCard from '@/app/components/product-card/ProductCard';

interface StoreDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  store: {
    name: string;
    location: string;
    rating: number;
    reviews: string;
    phone: string;
    address: string;
    description: string;
  };
}

export default function StoreDetailsModal({
  isOpen,
  onClose,
  store,
}: StoreDetailsModalProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-4 md:inset-8 lg:inset-12 z-50 overflow-y-auto"
          >
            <div className="bg-white rounded-3xl shadow-2xl max-w-4xl mx-auto mt-10">
              {/* Header */}
              <div className="sticky top-0 bg-white rounded-t-3xl border-b border-gray-100 p-4 flex justify-between items-center">
                <h2 className="text-xl font-semibold">Store Profile</h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-full transition"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-6">
                {/* Store Info */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-20 h-20 bg-gray-200 rounded-full flex-shrink-0" />
                  <div>
                    <h3 className="text-xl font-semibold flex items-center gap-2">
                      {store.name}
                      <Verified className="w-5 h-5 fill-green-500 text-white" />
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                      <MapPin className="w-4 h-4" />
                      {store.location}
                      <span className="mx-2">•</span>
                      <span className="flex items-center gap-1">
                        {store.rating}{' '}
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />{' '}
                        ({store.reviews})
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex sm:flex-row gap-3 mb-6">
                  <button className="px-10 py-3 bg-gray-50 border border-slate-900 text-slate-900 rounded-2xl font-medium flex items-center justify-center gap-2 hover:bg-green-700 transition">
                    Message in App
                  </button>
                  <button className="px-10 py-3 bg-slate-900 text-white rounded-2xl font-medium flex items-center justify-center gap-2 hover:bg-slate-800 transition">
                    Chat on WhatsApp
                  </button>
                </div>

                <button className="px-10 py-3 bg-gray-50 text-black border border-gray-200 rounded-2xl font-medium flex items-center justify-center hover:bg-gray-300 transition">
                  <Phone className="w-4 h-4" />
                  Call: {store.phone}
                </button>

                {/* Description */}
                <div className="mb-8">
                  <h4 className="font-semibold text-gray-900 mb-3 mt-5">
                    Store Description
                  </h4>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {store.description}
                  </p>
                </div>

                {/* Address */}
                <div className="mb-8">
                  <h4 className="font-semibold text-gray-900 mb-3">
                    Store Address
                  </h4>
                  <p className="text-sm text-gray-600 flex items-start gap-2">
                    <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    {store.address}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    Mon - Sat | 09:00 AM - 06:00 PM
                  </p>
                </div>

                {/* Products Section */}
                <h4 className="text-center text-lg font-medium text-gray-900 mb-6 bg-gray-50 py-4 rounded-xl">
                  All Products
                </h4>

                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-6">
                  <div className="relative">
                    <ProductCard />
                  </div>
                  {[...Array(5)].map((_, i) => (
                    <ProductCard key={`modal-product-${i}`} />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
