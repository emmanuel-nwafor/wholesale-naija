'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Phone, MapPin, Clock, Store as StoreIcon } from 'lucide-react';
import ProductCard from '@/app/components/product-card/ProductCard';
import { fetchWithToken } from '@/app/utils/fetchWithToken';

// Define the shape of a product item used in state
interface ProductItem {
  _id: string;
  name: string;
  // FIX 1: Changed price type to number
  price: number;
  images: string[];
  moq: string;
  verified: boolean;
  coins: number | null;
  seller: { _id: string; fullName: string };
  variants: any[];
}

// Define the shape of the data returned from the API for a single product
interface ApiProduct {
  _id: string;
  name: string;
  // Api price comes as a string (assuming)
  price: string;
  images: string[] | any;
  moq?: string;
  verified?: boolean;
  coins?: number | null;
  variants?: any[];
}

interface StoreDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  sellerId: string;
  sellerName?: string;
  profilePicture?: string;
  store?: {
    name?: string;
    description?: string;
    location?: string;
    contactPhone?: string;
    whatsapp?: string;
    address?: { street?: string };
    openingDays?: string;
  };
}

export default function StoreDetailsModal({
  isOpen,
  onClose,
  sellerId,
  sellerName = 'Unknown Store',
  profilePicture,
  store: initialStore = {},
}: StoreDetailsModalProps) {
  // FIX 2: Specified state type
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(true);

  const store = initialStore;
  const storeName = store.name || sellerName;
  const location = store.location || 'Location not specified';
  const phone = store.contactPhone || null;
  const whatsappNumber = store.whatsapp || phone;
  const whatsappLink = whatsappNumber
    ? `https://wa.me/234${whatsappNumber.replace(/\D/g, '').slice(-10)}`
    : null;
  const address = store.address?.street || 'Address not provided';
  const description =
    store.description || 'Trusted supplier of quality wholesale products.';
  const openingHours = store.openingDays || 'Mon – Sat, 9:00 AM – 6:00 PM';

  useEffect(() => {
    if (!isOpen || !sellerId) {
      setProducts([]);
      return;
    }

    const fetchProducts = async () => {
      try {
        setLoading(true);
        // FIX 3: Specified fetch response type
        const res = await fetchWithToken<{ products: ApiProduct[] }>(
          `/v1/sellers/${sellerId}/products?limit=20`
        );
        const items = res?.products || [];

        // FIX 4: Specified map callback type & converted price
        const formatted = items.map(
          (p: ApiProduct): ProductItem => ({
            _id: p._id,
            name: p.name,
            // Convert string price to number (use parseFloat for safety)
            price: parseFloat(p.price) || 0,
            images: Array.isArray(p.images) ? p.images : [],
            moq: p.moq || '1 pc',
            verified: p.verified ?? false,
            coins: p.coins || null,
            seller: { _id: sellerId, fullName: storeName },
            variants: p.variants || [],
          })
        );

        setProducts(formatted);
      } catch (err) {
        console.error('Failed to load store products:', err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [isOpen, sellerId, storeName]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex justify-end bg-black/30 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ x: 500 }}
            animate={{ x: 0 }}
            exit={{ x: 500 }}
            transition={{ type: 'spring', damping: 32, stiffness: 300 }}
            className="w-full max-w-lg bg-white shadow-2xl h- flex flex-col rounded-2xl overflow-hidden m-5"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-5 border-b border-gray-200 bg-white">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Store Profile
                </h3>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-gray-100 transition"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto">
              {/* Store Header Card */}
              <div className="px-6 pt-6">
                <div className="bg-gradient-to-br from-slate-50 to-gray-50 rounded-2xl p-6 shadow-sm">
                  <div className="flex items-center gap-4">
                    {/* FIX 5: Replaced <img> with <Image /> and added 'relative' to container */}
                    <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-white shadow-lg relative">
                      <Image
                        src={
                          profilePicture || 'https://via.placeholder.com/150'
                        }
                        alt={storeName}
                        fill // Use fill to cover the parent div
                        sizes="80px"
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-xl font-bold text-gray-900">
                        {storeName}
                      </h2>
                      <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                        <MapPin className="w-4 h-4" />
                        {location}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-2 gap-3 mt-6">
                    <a
                      href={`/messages?user=${sellerId}`}
                      className="py-3.5 px-5 bg-white border border-slate-500 rounded-2xl font-medium text-sm flex items-center justify-center gap-2 hover:bg-gray-50 transition"
                    >
                      Message in App
                    </a>

                    {whatsappLink && (
                      <a
                        href={whatsappLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="py-3.5 px-5 bg-slate-900 text-white rounded-xl font-medium text-sm flex items-center justify-center gap-2 hover:bg-slate-700 transition"
                      >
                        Chat on WhatsApp
                      </a>
                    )}
                  </div>

                  {phone && (
                    <a
                      href={`tel:${phone}`}
                      className="mt-3 w-full py-4 bg-gray-200 text-slate-900 rounded-2xl font-medium flex items-center justify-center gap-2 hover:bg-gray-300 transition"
                    >
                      <Phone className="w-5 h-5" />
                      Call {phone}
                    </a>
                  )}
                </div>
              </div>

              {/* Store Description */}
              <div className="px-6 mt-6">
                <h4 className="font-semibold text-gray-900 mb-3">
                  Store Description
                </h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {description}
                </p>
              </div>

              {/* Address & Hours */}
              <div className="px-6 mt-6">
                <div className="bg-gray-50 rounded-2xl p-5">
                  <h4 className="font-semibold text-gray-900 mb-3">
                    Store Address
                  </h4>
                  <div className="flex items-start gap-3 text-sm text-gray-700">
                    <MapPin className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p>{address}</p>
                      <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {openingHours}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Products Section */}
              <div className="px-6 mt-8 pb-10">
                <div className="flex items-center justify-between mb-5">
                  <h4 className="text-lg font-semibold text-gray-900">
                    All Products
                  </h4>
                  <span className="text-sm text-gray-500">
                    {products.length} items
                  </span>
                </div>

                {loading ? (
                  <div className="grid grid-cols-2 gap-4">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <ProductCard key={i} loading />
                    ))}
                  </div>
                ) : products.length === 0 ? (
                  <div className="text-center py-12">
                    <StoreIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No products available yet</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    {products.map((product) => (
                      <ProductCard key={product._id} product={product} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
