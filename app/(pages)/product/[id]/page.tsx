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
import { useParams } from 'next/navigation';
import { getCurrentSellerId } from '@/app/utils/auth';
import DynamicHeader from '@/app/components/header/DynamicHeader';
import CarouselBanner from '@/app/components/carousels/CarouselBanner';
import StoreUnlockModal from '@/app/components/modals/StoreUnlockModal';

const FALLBACK_IMAGE =
  'https://i.pinimg.com/736x/75/92/1a/75921a9653409e76f63f904530687fe0.jpg';

// --- INTERFACES FOR TYPE SAFETY ---
interface Seller {
  _id: string;
  fullName?: string;
  phone?: string;
  isVerifiedSeller?: boolean;
  profilePicture?: { url: string };
  store?: {
    name?: string;
    contactPhone?: string;
    whatsapp?: string;
    location?: string;
    description?: string;
  };
}

interface ProductVariant {
  _id: string;
  name: string;
  price?: number;
  MOQ?: number | string;
  images?: string[];
  pricingTiers?: Array<{
    minQty: number;
    maxQty?: number;
    price: number;
  }>;
}

interface ProductType {
  _id: string;
  name: string;
  description: string;
  price: number;
  moq: number | string;
  coins?: number;
  images?: string[];
  seller: Seller;
  variants?: ProductVariant[];
}

interface Review {
  _id: string;
  rating: number;
  comment?: string;
  text?: string;
  createdAt: string;
  buyerId?: {
    fullName?: string;
    profilePicture?: { url: string };
  };
}

interface UnlockedItem {
  _id: string;
  sellerId: Seller;
}

interface ProductCardCompatibleProps {
  _id: string;
  name: string;
  price: number;
  images: string[];
  moq?: string | number;
  verified?: boolean;
  seller?: { _id?: string; fullName?: string };
}

// --- UTILITY FUNCTIONS ---
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

// Safe number formatting
const formatPrice = (price: number): string => {
  const num = Number(price);
  return isNaN(num) ? 'N/A' : num.toLocaleString();
};

// --- COMPONENT START ---
export default function ProductDetailsPage() {
  const params = useParams();
  const id = params?.id as string;

  // State with proper types
  const [product, setProduct] = useState<ProductType | null>(null);
  const [loading, setLoading] = useState(true);
  const [unlocked, setUnlocked] = useState(false);
  const [unlocking, setUnlocking] = useState(false);
  const [sellerPhone, setSellerPhone] = useState<string | null>(null);
  const [imgError, setImgError] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<
    'description' | 'reviews' | 'store'
  >('description');
  const [related, setRelated] = useState<ProductType[]>([]);
  const [sellerReviews, setSellerReviews] = useState<Review[]>([]);
  const [avgRating, setAvgRating] = useState<number | null>(null);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [unlockModalOpen, setUnlockModalOpen] = useState(false);

  // Variant states with proper types
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    null
  );
  const [variantImages, setVariantImages] = useState<string[]>([]);

  const buyerId = getCurrentSellerId();
  const sellerId = product?.seller?._id;

  // Check unlocked status
  useEffect(() => {
    if (!buyerId || !sellerId) return;

    const checkUnlocked = async () => {
      try {
        const res = await fetchWithToken<{ unlocked: UnlockedItem[] }>(
          `/v1/users/${buyerId}/unlocked`
        );
        const unlockedList = res?.unlocked || [];
        // Typed item
        const match = unlockedList.find(
          (item) => item.sellerId?._id === sellerId
        );
        if (match) {
          setUnlocked(true);
          const phone =
            match.sellerId?.store?.contactPhone ||
            match.sellerId?.store?.whatsapp ||
            match.sellerId?.phone ||
            null;
          if (phone)
            setSellerPhone(phone.startsWith('0') ? phone : `0${phone}`);
        }
      } catch (err) {
        console.error('Failed to check unlocked status:', err);
      }
    };
    checkUnlocked();
  }, [buyerId, sellerId]);

  // Wishlist
  useEffect(() => {
    if (!id || !buyerId) return;
    const checkWishlist = async () => {
      try {
        const res = await fetchWithToken<{ wishlist: { products: string[] } }>(
          '/v1/users/me/wishlist'
        );
        setIsWishlisted(res?.wishlist?.products?.includes(id) || false);
      } catch (err) {
        console.error('Failed to fetch wishlist:', err);
      }
    };
    checkWishlist();
  }, [id, buyerId]);

  const toggleWishlist = async () => {
    if (!id || isAnimating) return;
    setIsAnimating(true);
    try {
      if (isWishlisted) {
        await fetchWithToken(`/v1/users/me/wishlist/${id}`, {
          method: 'DELETE',
        });
        setIsWishlisted(false);
      } else {
        await fetchWithToken(`/v1/users/me/wishlist/${id}`, { method: 'POST' });
        setIsWishlisted(true);
      }
    } catch (err: unknown) {
      alert('Failed to update wishlist');
      console.log(err)
    } finally {
      setTimeout(() => setIsAnimating(false), 600);
    }
  };

  // Fetch product
  useEffect(() => {
    if (!id) return;
    const run = async () => {
      try {
        setLoading(true);
        // Explicitly typed response
        const res = await fetchWithToken<{ product?: ProductType }>(
          `/v1/products/${id}`
        );
        const fetched = res?.product || (res as ProductType);
        if (!fetched) return;
        setProduct(fetched);

        if (fetched.variants && fetched.variants.length > 0) {
          const first: ProductVariant = fetched.variants[0];
          setSelectedVariant(first);
          setVariantImages(first.images || []);
        } else {
          setSelectedVariant(null);
          setVariantImages([]);
        }

        if (fetched?.seller?._id) {
          const relRes = await fetchWithToken<{ products: ProductType[] }>(
            `/v1/sellers/${fetched.seller._id}/products`
          );
          if (relRes?.products) {
            // Typed item
            setRelated(
              relRes.products.filter((p: ProductType) => p._id !== fetched._id)
            );
          }
          // Explicitly typed response
          const revRes = await fetchWithToken<{
            reviews: Review[];
            avgRating?: number;
          }>(`/v1/sellers/${fetched.seller._id}/reviews`);
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

  const handleUnlock = async () => {
    if (!sellerId || unlocking || unlocked || !buyerId) return;
    setUnlocking(true);
    try {
      // Explicitly typed response
      const res = await fetchWithToken<{
        unlocked: boolean;
        contact?: { phone: string };
      }>(`/wallet/unlock/${sellerId}`, { method: 'POST' });
      if (res && res.unlocked === true && res.contact?.phone) {
        setUnlocked(true);
        setSellerPhone(res.contact.phone);
        setUnlockModalOpen(true);
      } else {
        throw new Error('Unlock failed');
      }
    } catch (err) {
      // Use err as Error if available, otherwise default to a string
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to unlock store';
      alert(errorMessage);
    } finally {
      setUnlocking(false);
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-slate-900 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading product...</p>
          </div>
        </div>
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-gray-600">Product not found.</p>
        </div>
      </>
    );
  }
  // Images
  const baseImages = Array.isArray(product.images) ? product.images : [];
  const allImages = variantImages.length > 0 ? variantImages : baseImages;
  const imagesToUse = allImages.length > 0 ? allImages : [FALLBACK_IMAGE];
  // Explicitly type currentImage
  const currentImage: string =
    !imgError && imagesToUse[currentIndex]
      ? imagesToUse[currentIndex]
      : FALLBACK_IMAGE;
  const isVideo = /\.(mp4|mov|webm)$/i.test(currentImage);

  const displaySellerName = unlocked
    ? product.seller?.store?.name || product.seller?.fullName || 'Store'
    : maskName(product.seller?.fullName || 'Store');

  const displayPhone = sellerPhone ? `+234 ${sellerPhone.slice(1)}` : null;
  const maskedPhone = sellerPhone ? maskPhone(sellerPhone) : '080****1234';
  const whatsappLink = sellerPhone
    ? `https://wa.me/234${sellerPhone.slice(1)}`
    : '#';

  const handleNext = () =>
    setCurrentIndex((prev) => (prev + 1) % imagesToUse.length);
  const handlePrev = () =>
    setCurrentIndex(
      (prev) => (prev - 1 + imagesToUse.length) % imagesToUse.length
    );

  // Safe price for current selection
  const currentPrice = selectedVariant?.price ?? product.price ?? 0;
  const currentMOQ = selectedVariant?.MOQ ?? product.moq ?? '1';

  return (
    <>
      <Header />
      <DynamicHeader />
      <div className="min-h-screen max-w-7xl mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Gallery */}
          <div className="relative bg-gray-50 rounded-3xl overflow-hidden">
            <AnimatePresence mode="wait">
              {isVideo ? (
                <video
                  key={currentIndex}
                  src={currentImage}
                  className="w-full object-cover h-[80vh]"
                  autoPlay
                  loop
                  muted
                  playsInline
                />
              ) : (
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
              )}
            </AnimatePresence>

            {imagesToUse.length > 1 && (
              <>
                <button
                  onClick={handlePrev}
                  className="absolute left-8 top-1/2 -translate-y-1/2 p-2 bg-white rounded-full shadow-md z-10 hover:scale-110 transition"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={handleNext}
                  className="absolute right-8 top-1/2 -translate-y-1/2 p-2 bg-white rounded-full shadow-md z-10 hover:scale-110 transition"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                  {/* Typed map parameter */}
                  {imagesToUse.map((_image: string, i: number) => (
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
                <motion.button
                  onClick={toggleWishlist}
                  disabled={isAnimating}
                  className="relative"
                  whileTap={{ scale: 0.8 }}
                >
                  <motion.div
                    animate={{ scale: isWishlisted ? [1, 1.3, 1] : 1 }}
                    transition={{ duration: 0.4 }}
                  >
                    <Heart
                      size={28}
                      className={`transition-all ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-400 hover:text-red-500'}`}
                      strokeWidth={isWishlisted ? 0 : 2}
                    />
                  </motion.div>
                  {isAnimating && !isWishlisted && (
                    <motion.div
                      className="absolute inset-0"
                      initial={{ scale: 0.8, opacity: 1 }}
                      animate={{ scale: 2.5, opacity: 0 }}
                    >
                      <Heart size={28} className="text-red-500" />
                    </motion.div>
                  )}
                </motion.button>
                <Share2
                  size={28}
                  className="p-1 bg-gray-100 rounded-full cursor-pointer hover:bg-gray-200 transition"
                />
              </h1>
              <div className="flex items-center gap-6 mt-2 text-sm text-gray-600">
                <span className="flex items-center gap-2">
                  {displaySellerName} Stores
                  {product.seller?.isVerifiedSeller && (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  )}
                </span>
                <span className="flex items-center gap-1">
                  <span className="font-medium">
                    {avgRating?.toFixed(1) || '4.5'}
                  </span>
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-gray-500">
                    ({sellerReviews.length})
                  </span>
                </span>
              </div>
            </div>

            {/* Price Block – now fully safe */}
            <div className="bg-gray-50/80 backdrop-blur rounded-3xl p-6">
              {/* Check and safely assign tiers */}
              {selectedVariant?.pricingTiers?.length &&
              selectedVariant.pricingTiers.length > 0 ? (
                <div>
                  <div className="space-y-3">
                    {/* Use non-null assertion on selectedVariant.pricingTiers, which we just checked */}
                    {selectedVariant
                      .pricingTiers!.sort((a, b) => a.minQty - b.minQty)
                      .map((tier, i) => (
                        <div
                          key={i}
                          className="flex justify-between items-center"
                        >
                          <span className="text-sm text-gray-600">
                            {/* Use the tier object which is guaranteed to be defined */}
                            {tier.maxQty
                              ? `${tier.minQty}–${tier.maxQty}`
                              : `${tier.minQty}+`}{' '}
                            pcs
                          </span>
                          <span className="text-xl font-bold">
                            ₦{formatPrice(tier.price)}
                          </span>
                        </div>
                      ))}
                  </div>
                </div>
              ) : (
                <>
                  <p className="text-3xl font-bold text-gray-900">
                    ₦{formatPrice(currentPrice)}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    MOQ: {currentMOQ} {Number(currentMOQ) === 1 ? 'pc' : 'pcs'}
                  </p>
                </>
              )}
            </div>

            {/* Variant Selector */}
            {/* The check 'product.variants?.length > 0' ensures variants exists */}
            {product.variants?.length && product.variants.length > 0 && (
              <div className="space-y-3">
                <p className="text-sm font-medium text-gray-700">
                  Select Variant:
                </p>
                <div className="flex flex-wrap gap-3">
                  {(product.variants as ProductVariant[]).map(
                    (variant: ProductVariant) => (
                      <button
                        key={variant._id}
                        onClick={() => {
                          setSelectedVariant(variant);
                          setVariantImages(variant.images || []);
                          setCurrentIndex(0);
                          setImgError(false);
                        }}
                        className={`px-5 py-3 rounded-2xl text-sm font-medium border transition-all ${
                          selectedVariant?._id === variant._id
                            ? 'bg-slate-900 text-white border-slate-900'
                            : 'bg-white text-gray-700 border-gray-300 hover:border-gray-500'
                        }`}
                      >
                        {variant.name}
                      </button>
                    )
                  )}
                </div>
              </div>
            )}

            {/* Unlock / Contact */}
            {!unlocked ? (
              <button
                onClick={handleUnlock}
                disabled={unlocking}
                className="w-full bg-slate-900 text-white py-5 rounded-3xl font-medium text-lg flex items-center justify-center gap-3 hover:opacity-95 transition disabled:opacity-70"
              >
                <span className="w-5 h-5 bg-yellow-400 rounded-full animate-pulse" />
                {unlocking
                  ? 'Unlocking...'
                  : `Unlock Contact (${product.coins || 5} Coins)`}
              </button>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => {
                      sessionStorage.setItem(
                        'pendingChatSellerId',
                        product.seller._id
                      );
                      window.location.href = '/messages';
                    }}
                    className="w-full rounded-2xl border border-slate-800 text-slate-900 py-4 font-medium hover:bg-gray-50 transition"
                  >
                    Message in App
                  </button>
                  <a
                    href={whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full bg-slate-900 text-white py-4 rounded-2xl font-medium text-center hover:bg-slate-800 transition"
                  >
                    Chat on WhatsApp
                  </a>
                </div>
                <a
                  href={`tel:${sellerPhone}`}
                  className="w-full bg-gray-100 border text-gray-800 py-5 border-gray-200 rounded-2xl font-medium text-center flex items-center justify-center gap-3 hover:bg-gray-200 transition"
                >
                  <Phone className="w-5 h-5" />
                  Call {displayPhone}
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Tabs Section – unchanged */}
        <div className="mt-8 overflow-hidden">
          <div className="flex border-b border-gray-200">
            {[
              {
                id: 'description',
                label: 'Product Descriptions',
                icon: Package,
              },
              {
                id: 'reviews',
                label: 'Ratings & Reviews',
                icon: MessageCircle,
              },
              { id: 'store', label: 'Store Profile', icon: Store },
            ].map((tab) => (
              <button
                key={tab.id}
                // Asserted type for setActiveTab
                onClick={() =>
                  setActiveTab(tab.id as 'description' | 'reviews' | 'store')
                }
                className={`py-4 px-6 flex items-center justify-center gap-2 text-sm font-medium transition ${
                  activeTab === tab.id
                    ? 'text-slate-900 border-b-2 border-slate-900'
                    : 'text-gray-600 hover:text-gray-900'
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
                    // Typed item
                    sellerReviews.map((review: Review) => (
                      <div
                        key={review._id}
                        className="border-b border-gray-100 pb-4 last:border-0"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200">
                              <Image
                                src={
                                  review.buyerId?.profilePicture?.url ||
                                  FALLBACK_IMAGE
                                }
                                alt={review.buyerId?.fullName || 'User'}
                                width={32}
                                height={32}
                                className="object-cover w-full h-full"
                              />
                            </div>
                            <span className="font-medium text-sm">
                              {review.buyerId?.fullName || 'User'}
                            </span>
                          </div>
                          <span className="text-xs text-gray-500">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex gap-1 mb-1">
                          {[...Array(review.rating)].map((_, i) => (
                            <Star
                              key={i}
                              className="w-4 h-4 fill-yellow-400 text-yellow-400"
                            />
                          ))}
                        </div>
                        <p className="text-sm text-gray-600">
                          {review.comment || review.text}
                        </p>
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
                        src={
                          product?.seller?.profilePicture?.url || FALLBACK_IMAGE
                        }
                        alt="Store"
                        width={80}
                        height={80}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h3 className="text-2xl font-bold">
                          {displaySellerName}
                        </h3>
                        {product.seller?.isVerifiedSeller && (
                          <VerifiedIcon className="w-6 h-6 fill-green-500 text-white" />
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-4 mt-5 text-sm text-gray-600">
                        <span>
                          {product?.seller?.store?.location || 'Lagos, Nigeria'}
                        </span>
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
                    <h4 className="font-semibold text-gray-900 mb-3">
                      About Store
                    </h4>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {product?.seller?.store?.description ||
                        'Trusted wholesale supplier with quality products and reliable delivery.'}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-center text-lg font-medium text-gray-900 mb-6 bg-gray-50 py-3 rounded-xl">
                      All Products from {displaySellerName}
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                      {related.length > 0
                        ? // 🐛 FIX: Asserting the type to ProductCardCompatibleProps
                          related.map((rp: ProductType) => (
                            <ProductCard
                              key={rp._id}
                              product={rp as ProductCardCompatibleProps}
                            />
                          ))
                        : Array.from({ length: 8 }).map((_, i) => (
                            <ProductCard key={i} loading />
                          ))}
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