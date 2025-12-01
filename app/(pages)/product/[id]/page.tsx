'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import {
  Heart,
  Star,
  Share2,
  ChevronLeft,
  ChevronRight,
  MessageCircle,
  Store,
  Package,
  Verified as VerifiedIcon,
  HeartIcon,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '@/app/components/header/Header';
import ProductCard from '@/app/components/product-card/ProductCard';
import { fetchWithToken } from '@/app/utils/fetchWithToken';
import { useParams } from 'next/navigation';

const FALLBACK_IMAGE = '/svgs/logo.svg';

function maskName(name?: string) {
  if (!name || !name.trim()) return 'AB******';
  const clean = name.replace(/\s+/g, '');
  if (clean.length <= 2) return clean;
  return clean.slice(0, 2) + '*'.repeat(clean.length - 2);
}

export default function ProductDetailsPage() {
  const params = useParams();
  const id = params?.id;

  const [product, setProduct] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [imgError, setImgError] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'description' | 'reviews' | 'store'>('description');
  const [related, setRelated] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);

  useEffect(() => {
    if (!id) return;

    const run = async () => {
      try {
        setLoading(true);
        console.log('Fetching product:', `/v1/products/${id}`);
        const res = await fetchWithToken<{ product?: any }>(`/v1/products/${id}`);
        const fetched = res?.product || res;

        if (!fetched) {
          console.error('Empty product response', res);
          setLoading(false);
          return;
        }

        setProduct(fetched);

        // fetch related products
        try {
          const sellerId = fetched?.seller?._id;
          if (sellerId) {
            const rel = await fetchWithToken<{ products?: any[] }>(`/v1/products?seller=${sellerId}&limit=8`);
            if (rel?.products) setRelated(rel.products.filter((p: any) => p._id !== fetched._id));
          }
        } catch (e) {}

        // fetch reviews
        try {
          const revRes = await fetchWithToken<{ reviews?: any[] }>(`/v1/products/${id}/reviews`);
          if (revRes?.reviews) setReviews(revRes.reviews);
        } catch (e) {}
      } catch (err) {
        console.error('Failed to load product:', err);
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [id]);

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="grid lg:grid-cols-2 gap-8">
              <div className="rounded-2xl bg-gray-200 aspect-[4/3] animate-pulse" />
              <div className="space-y-6">
                <div className="h-8 w-3/4 bg-gray-200 rounded animate-pulse" />
                <div className="h-6 w-1/2 bg-gray-200 rounded animate-pulse" />
                <div className="h-10 w-full bg-gray-200 rounded animate-pulse" />
                <div className="h-40 w-full bg-gray-100 rounded animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Header />
        <div className="min-h-screen">
          <div className="max-w-7xl mx-auto px-4 py-6 text-center">
            <p className="text-gray-600">Product not found.</p>
          </div>
        </div>
      </>
    );
  }

  const images: string[] = Array.isArray(product.images) ? product.images : [];
  const currentImage = !imgError && images[currentIndex] && images[currentIndex].trim() !== '' ? images[currentIndex] : FALLBACK_IMAGE;
  const isVerifiedSeller = product.verified === true;
  const sellerNameMasked = maskName(product?.seller?.fullName || product?.seller || '');

  const handleNext = () => setCurrentIndex((prev) => (prev + 1) % Math.max(images.length, 1));
  const handlePrev = () => setCurrentIndex((prev) => (prev - 1 + Math.max(images.length, 1)) % Math.max(images.length, 1));

  const displayReviews = reviews.length
    ? reviews
    : [
        { id: 1, rating: 5, text: 'Excellent device, delivery was fast!', date: 'Jun 10, 2025', user: 'Chinedu O.' },
        { id: 2, rating: 4, text: 'Great phone, but battery could be better.', date: 'Jun 08, 2025', user: 'Aisha M.' },
      ];

  return (
    <>
      <Header />
      <div className="min-h-screen">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left: Image gallery */}
            <div className="relative bg-gray-50 rounded-3xl overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.img
                  key={currentIndex + (images[currentIndex] || FALLBACK_IMAGE)}
                  src={currentImage}
                  alt={product.name}
                  onError={() => setImgError(true)}
                  className="w-full object-cover h-[80vh]"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                />
              </AnimatePresence>

              {images.length > 1 && (
                <>
                  <button onClick={handlePrev} className="absolute left-8 top-1/2 -translate-y-1/2 p-2 bg-white rounded-full shadow-md">
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button onClick={handleNext} className="absolute right-8 top-1/2 -translate-y-1/2 p-2 bg-white rounded-full shadow-md">
                    <ChevronRight className="w-5 h-5" />
                  </button>
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                    {images.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentIndex(i)}
                        className={`w-2 h-2 rounded-full transition ${currentIndex === i ? 'bg-gray-800 w-8' : 'bg-gray-400'}`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Right: Info */}
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-medium flex items-center gap-4 text-gray-900">
                  {product.name}
                  <HeartIcon height={27} width={27} className="p-1 bg-gray-100 rounded-full" />
                  <Share2 height={27} width={27} className="p-1 bg-gray-100 rounded-full" />
                </h1>

                <div className="flex items-center gap-6 mt-2 text-sm text-gray-600">
                  <span className="flex items-center gap-2">
                    <span>{sellerNameMasked}</span>
                    {isVerifiedSeller && <VerifiedIcon className="w-4 h-4 fill-green-400 text-white" />}
                  </span>

                  <span className="flex items-center gap-1">
                    <span className="font-medium">{product.rating ?? '4.5'}</span>
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-gray-500">({product.reviews ?? '0'})</span>
                  </span>
                </div>
              </div>

              <div>
                <div className="flex rounded-2xl bg-gray-50 justify-between items-start">
                  <div className="p-6">
                    <p className="text-2xl font-medium text-gray-900">₦{(product.price ?? 0).toLocaleString()}</p>
                    <p className="text-xs text-gray-500 mt-1">MOQ: {product.moq ?? 'N/A'}</p>
                  </div>
                </div>

                <div className="mt-4 p-3 text-sm text-center text-gray-800">
                  You have {product.coins ?? 0} Coins available
                </div>

                <button className="w-full mt-4 bg-slate-900 text-white py-4 rounded-2xl font-medium flex items-center justify-center gap-2 hover:opacity-95 transition">
                  <span className="w-4 h-4 bg-yellow-400 rounded-full animate-pulse" />
                  Unlock Contact ({product.coins ?? 0} Coins)
                </button>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="mt-8 overflow-hidden">
            <div className="flex border-b border-gray-200">
              {[
                { id: 'description', label: 'Product Descriptions', icon: Package },
                { id: 'reviews', label: 'Ratings & Reviews', icon: MessageCircle },
                { id: 'store', label: 'Store Profile', icon: Store },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`hover:cursor-pointer py-4 px-6 flex items-center justify-center gap-2 text-sm font-medium transition ${
                    activeTab === tab.id ? 'text-slate-600 border-b-2 border-slate-800' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="py-6">
              <AnimatePresence mode="wait">
                {activeTab === 'description' && (
                  <motion.div key="desc" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-4 text-sm text-gray-600">
                    <p className="whitespace-pre-line">{product.description}</p>
                  </motion.div>
                )}

                {activeTab === 'reviews' && (
                  <motion.div key="reviews" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                    <span className="flex items-center font-medium">
                      Rating & Reviews
                      <p className="font-light text-gray-400 ml-2">({product.reviews ?? displayReviews.length} Reviews)</p>
                    </span>

                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                      <span className="font-medium flex"> {product.rating ?? '4.5'} out of 5</span>
                    </div>

                    {displayReviews.map((review) => (
                      <div key={review.id} className="border-b border-gray-100 pb-4 last:border-0">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-gray-200 rounded-full" />
                            <span className="font-medium text-sm">{review.user}</span>
                          </div>
                          <span className="text-xs text-gray-500">{review.date}</span>
                        </div>
                        <div className="flex gap-1 mb-1">
                          {[...Array(review.rating)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                        <p className="text-sm text-gray-600">{review.text}</p>
                      </div>
                    ))}
                  </motion.div>
                )}

                {activeTab === 'store' && (
                  <motion.div key="store" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="py-8">
                    <div className="flex items-start gap-4 mb-8">
                      <div className="w-16 h-16 bg-gray-200 rounded-full overflow-hidden">
                        <Image src={product?.seller?.profilePicture?.url || FALLBACK_IMAGE} alt={product?.seller?.fullName || 'Store'} width={64} height={64} className="object-cover w-full h-full" />
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="text-xl font-semibold">{product?.seller?.store?.name || product?.seller?.fullName || 'Store'}</h3>
                          {isVerifiedSeller && <VerifiedIcon className="w-5 h-5 fill-green-500 text-white" />}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                          <span>{product?.seller?.store?.location || 'Lagos, Nigeria'}</span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            {product.rating ?? '4.5'}
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            ({product.reviews ?? '3k+'})
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mb-10">
                      <h4 className="font-medium text-gray-900 mb-3">Store Description</h4>
                      <p className="text-sm text-gray-600 leading-relaxed">{product?.seller?.store?.description || 'Supplier of phones, accessories & parts with 5+ years wholesale experience.'}</p>
                    </div>

                    <div>
                      <h4 className="text-center text-lg font-medium text-gray-900 mb-6 bg-gray-50 py-3 rounded-xl">All Products</h4>

                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                        {related.length > 0 ? related.map((rp) => <ProductCard key={rp._id} product={rp} />) : Array.from({ length: 8 }).map((_, i) => <ProductCard key={`placeholder-${i}`} loading />)}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
