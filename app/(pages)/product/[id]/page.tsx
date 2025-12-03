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
  Phone,
  CheckCircle,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '@/app/components/header/Header';
import ProductCard from '@/app/components/product-card/ProductCard';
import { fetchWithToken } from '@/app/utils/fetchWithToken';
import { useParams, useRouter } from 'next/navigation';
import { getCurrentSellerId } from '@/app/utils/auth';
import DynamicHeader from '@/app/components/header/DynamicHeader';
import CarouselBanner from '@/app/components/carousels/CarouselBanner';
import StoreUnlockModal from '@/app/components/modals/StoreUnlockModal';
import Spinner from '@/app/components/spinner/Spinner';

const FALLBACK_IMAGE = 'https://i.pinimg.com/736x/75/92/1a/75921a9653409e76f63f904530687fe0.jpg';

function maskName(name?: string) {
  if (!name || !name.trim()) return 'AB******';
  const clean = name.replace(/\s+/g, '');
  if (clean.length <= 2) return clean;
  return clean.slice(0, 2) + '*'.repeat(clean.length - 2);
}

function maskPhone(phone?: string) {
  if (!phone || phone.length < 4) return '080****1234';
  return phone.slice(0, 4) + '****' + phone.slice(-4);
}

export default function ProductDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [product, setProduct] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [unlocked, setUnlocked] = useState(false);
  const [unlocking, setUnlocking] = useState(false);
  const [sellerPhone, setSellerPhone] = useState<string | null>(null);
  const [imgError, setImgError] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'description' | 'reviews' | 'store'>('description');
  const [related, setRelated] = useState<any[]>([]);
  const [sellerReviews, setSellerReviews] = useState<any[]>([]);
  const [avgRating, setAvgRating] = useState<number | null>(null);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [unlockModalOpen, setUnlockModalOpen] = useState(false);

  const buyerId = getCurrentSellerId();
  const sellerId = product?.seller?._id;

  // Check unlocked status
  useEffect(() => {
    if (!buyerId || !sellerId) return;

    const checkUnlocked = async () => {
      try {
        const res = await fetchWithToken<{ unlocked: any[] }>(`/v1/users/${buyerId}/unlocked`);
        const unlockedList = res?.unlocked || [];
        const match = unlockedList.find((item: any) => item.sellerId?._id === sellerId);

        if (match) {
          setUnlocked(true);
          const phone =
            match.sellerId?.store?.contactPhone ||
            match.sellerId?.store?.whatsapp ||
            match.sellerId?.phone ||
            null;
          if (phone) setSellerPhone(phone.startsWith('0') ? phone : `0${phone}`);
        }
      } catch (err) {
        console.error('Failed to check unlocked status:', err);
      }
    };

    checkUnlocked();
  }, [buyerId, sellerId]);

  // Check wishlist status
  useEffect(() => {
    if (!id || !buyerId) return;

    const checkWishlist = async () => {
      try {
        const res = await fetchWithToken<{ wishlist: { products: string[] } }>('/v1/users/me/wishlist');
        setIsWishlisted(res?.wishlist?.products?.includes(id) || false);
      } catch (err) {
        console.error('Failed to fetch wishlist:', err);
      }
    };

    checkWishlist();
  }, [id, buyerId]);

  // Toggle wishlist
  const toggleWishlist = async () => {
    if (!id || isAnimating) return;
    setIsAnimating(true);

    try {
      if (isWishlisted) {
        await fetchWithToken(`/v1/users/me/wishlist/${id}`, { method: 'DELETE' });
        setIsWishlisted(false);
      } else {
        await fetchWithToken(`/v1/users/me/wishlist/${id}`, { method: 'POST' });
        setIsWishlisted(true);
      }
    } catch (err) {
      alert('Failed to update wishlist');
    } finally {
      setTimeout(() => setIsAnimating(false), 600);
    }
  };

  // Fetch product + related + reviews
  useEffect(() => {
    if (!id) return;

    const run = async () => {
      try {
        setLoading(true);
        const res = await fetchWithToken<{ product?: any }>(`/v1/products/${id}`);
        const fetched = res?.product || res;
        if (!fetched) return;
        setProduct(fetched);

        if (fetched?.seller?._id) {
          const relRes = await fetchWithToken<{ products: any[] }>(`/v1/sellers/${fetched.seller._id}/products`);
          if (relRes?.products) {
            setRelated(relRes.products.filter((p: any) => p._id !== fetched._id));
          }

          const revRes = await fetchWithToken<{ reviews: any[]; avgRating?: number }>(`/v1/sellers/${fetched.seller._id}/reviews`);
          if (revRes) {
            setSellerReviews(revRes.reviews || []);
            setAvgRating(revRes.avgRating || null);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [id]);

  // Unlock handler
  const handleUnlock = async () => {
    if (!sellerId || unlocking || unlocked || !buyerId) return;

    setUnlocking(true);
    try {
      const res = await fetchWithToken<any>(`/wallet/unlock/${sellerId}`, { method: 'POST' });

      if (res && res.unlocked === true && res.contact?.phone) {
        setUnlocked(true);
        setSellerPhone(res.contact.phone);
        setUnlockModalOpen(true);
      } else {
        throw new Error('Unlock failed');
      }
    } catch (err: any) {
      alert(err.message || 'Failed to unlock store.');
    } finally {
      setUnlocking(false);
    }
  };

  // NEW: Open chat with product context
  const openChatWithProduct = () => {
    const chatData = {
      sellerId: product.seller._id,
      sellerName: displaySellerName,
      sellerAvatar: product.seller?.profilePicture?.url || FALLBACK_IMAGE,
      product: {
        id: product._id,
        name: product.name,
        price: product.price,
        moq: product.moq || 20,
        image: product.images?.[0] || FALLBACK_IMAGE,
      },
    };

    sessionStorage.setItem('pendingChatWithProduct', JSON.stringify(chatData));
    router.push('/messages');
  };

  if (loading) return <div className="min-h-screen flex flex-col items-center justify-center">
    <Header />
    <p className="">
      <Spinner />
      Loading
    </p>
  </div>;
  if (!product) return <div className="min-h-screen flex items-center justify-center"><Header /><p>Product not found.</p></div>;

  const images: string[] = Array.isArray(product.images) ? product.images : [];
  const currentImage = !imgError && images[currentIndex] ? images[currentIndex] : FALLBACK_IMAGE;

  const displaySellerName = unlocked
    ? (product.seller?.store?.name || product.seller?.fullName || 'Store')
    : maskName(product.seller?.fullName || 'Store');

  const displayPhone = sellerPhone ? `+234 ${sellerPhone.slice(1)}` : null;
  const maskedPhone = sellerPhone ? maskPhone(sellerPhone) : '080****1234';
  const whatsappLink = sellerPhone ? `https://wa.me/234${sellerPhone.slice(1)}` : '#';

  const handleNext = () => setCurrentIndex((prev) => (prev + 1) % images.length || 0);
  const handlePrev = () => setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);

  return (
    <>
      <Header />
      <DynamicHeader />
      <div className="min-h-screen max-w-7xl mx-auto px-4 py-6">

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Image Gallery */}
          <div className="relative bg-gray-50 rounded-3xl overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.img
                key={currentIndex}
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
                <button onClick={handlePrev} className="absolute left-8 top-1/2 -translate-y-1/2 p-2 bg-white rounded-full shadow-md z-10 hover:scale-110 transition">
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button onClick={handleNext} className="absolute right-8 top-1/2 -translate-y-1/2 p-2 bg-white rounded-full shadow-md z-10 hover:scale-110 transition">
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

          {/* Right Side */}
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-medium flex items-center gap-4 text-gray-900">
                {product.name}
                <motion.button onClick={toggleWishlist} disabled={isAnimating} whileTap={{ scale: 0.8 }}>
                  <motion.div animate={{ scale: isWishlisted ? [1, 1.3, 1] : 1 }}>
                    <Heart size={28} className={`transition-all ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-400 hover:text-red-500'}`} strokeWidth={isWishlisted ? 0 : 2} />
                  </motion.div>
                </motion.button>
                <Share2 size={28} className="p-1 bg-gray-100 rounded-full cursor-pointer hover:bg-gray-200 transition" />
              </h1>

              <div className="flex items-center gap-6 mt-2 text-sm text-gray-600">
                <span className="flex items-center gap-2">
                  <span>{displaySellerName} Stores</span>
                  {product.seller?.isVerifiedSeller && <CheckCircle className="w-4 h-4 text-green-600" />}
                </span>
                <span className="flex items-center gap-1">
                  <span className="font-medium">{avgRating?.toFixed(1) || '4.5'}</span>
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-gray-500">({sellerReviews.length})</span>
                </span>
              </div>
            </div>

            <div className="bg-gray-50/80 backdrop-blur rounded-3xl p-6">
              <p className="text-3xl font-bold text-gray-900">₦{product.price.toLocaleString()}</p>
              <p className="text-sm text-gray-500 mt-1">MOQ: {product.moq || '20'} bags</p>
            </div>

            {!unlocked ? (
              <button
                onClick={handleUnlock}
                disabled={unlocking}
                className="w-full bg-slate-900 text-white py-5 rounded-3xl font-medium text-lg flex items-center justify-center gap-3 hover:opacity-95 transition disabled:opacity-70"
              >
                <span className="w-5 h-5 bg-yellow-400 rounded-full animate-pulse" />
                {unlocking ? 'Unlocking...' : `Unlock Contact (${product.coins || 5} Coins)`}
              </button>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  {/* MESSAGE IN APP WITH PRODUCT */}
                  <button
                    onClick={openChatWithProduct}
                    className="w-full rounded-2xl border border-slate-800 text-slate-900 py-4 font-medium hover:bg-gray-50 transition flex items-center justify-center gap-2"
                  >
                    Message in App
                  </button>
                  <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="block w-full bg-slate-900 text-white py-4 rounded-2xl font-medium text-center hover:bg-slate-800 transition">
                    Chat on WhatsApp
                  </a>
                </div>
                <a href={`tel:${sellerPhone}`} className="w-full bg-gray-100 border text-gray-800 py-5 border-gray-200 rounded-2xl font-medium text-center flex items-center justify-center gap-3 hover:bg-gray-200 transition">
                  <Phone className="w-5 h-5" />
                  Call {displayPhone}
                </a>
              </div>
            )}
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
                className={`py-4 px-6 flex items-center justify-center gap-2 text-sm font-medium transition ${
                  activeTab === tab.id ? 'text-slate-900 border-b-2 border-slate-900' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="py-6">
            <AnimatePresence mode="wait">
              {activeTab === 'description' && (
                <motion.div
                  key="desc"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-4 text-sm text-gray-600"
                >
                  <p className="whitespace-pre-line">{product.description}</p>
                </motion.div>
              )}

              {activeTab === 'reviews' && (
                <motion.div
                  key="reviews"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  {sellerReviews.length > 0 ? (
                    sellerReviews.map((review) => (
                      <div key={review._id} className="border-b border-gray-100 pb-4 last:border-0">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200">
                              <Image
                                src={review.buyerId?.profilePicture?.url || FALLBACK_IMAGE}
                                alt={review.buyerId?.fullName || 'User'}
                                width={32}
                                height={32}
                                className="object-cover w-full h-full"
                              />
                            </div>
                            <span className="font-medium text-sm">{review.buyerId?.fullName || 'User'}</span>
                          </div>
                          <span className="text-xs text-gray-500">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex gap-1 mb-1">
                          {[...Array(review.rating)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                        <p className="text-sm text-gray-600">{review.comment || review.text}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm">No reviews yet.</p>
                  )}
                </motion.div>
              )}

              {activeTab === 'store' && (
                <motion.div
                  key="store"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="py-8 space-y-8"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-20 h-20 bg-gray-200 rounded-full overflow-hidden border-4 border-white shadow-lg">
                      <Image
                        src={product?.seller?.profilePicture?.url || FALLBACK_IMAGE}
                        alt="Store"
                        width={80}
                        height={80}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h3 className="text-2xl font-bold">{displaySellerName}</h3>
                        {product.seller?.isVerifiedSeller && <VerifiedIcon className="w-6 h-6 fill-green-500 text-white" />}
                      </div>

                      <div className="flex flex-wrap items-center gap-4 mt-5 text-sm text-gray-600">
                        <span>{product?.seller?.store?.location || 'Lagos, Nigeria'}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          {avgRating?.toFixed(1) ?? '4.5'}
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          ({sellerReviews.length} reviews)
                        </span>

                        {unlocked && sellerPhone ? (
                          <div className="flex items-center gap-3 text-sm font-medium">
                            <Phone className="w-5 h-5 text-green-600" />
                            <span>{displayPhone}</span>
                          </div>
                        ) : (
                          <div className="p-4 bg-gray-100 rounded-xl">
                            <span className="text-sm text-gray-600">
                              <strong>Phone:</strong> {maskedPhone}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">About Store</h4>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {product?.seller?.store?.description || 'Trusted wholesale supplier with quality products and reliable delivery.'}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-center text-lg font-medium text-gray-900 mb-6 bg-gray-50 py-3 rounded-xl">
                      All Products from {displaySellerName}
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                      {related.length > 0
                        ? related.map((rp) => <ProductCard key={rp._id} product={rp} />)
                        : Array.from({ length: 8 }).map((_, i) => <ProductCard key={i} loading />)}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

      </div>

      <CarouselBanner />

      <StoreUnlockModal
        isOpen={unlockModalOpen}
        onClose={() => setUnlockModalOpen(false)}
        storeName={displaySellerName}
        phoneNumber={displayPhone || ''}
      />
    </>
  );
}