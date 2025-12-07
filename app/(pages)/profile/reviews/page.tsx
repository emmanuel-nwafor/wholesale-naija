'use client';

import React, { useState, useEffect } from 'react';
import { Menu, Star, Verified } from 'lucide-react';
import Header from '@/app/components/header/Header';
import BuyersProfileSidebar from '@/app/components/sidebar/BuyersProfileSidebar';
import LeaveReviewModal from '@/app/components/modals/LeaveReviewModal';
import { fetchWithToken } from '@/app/utils/fetchWithToken';
import Image from 'next/image';
import CarouselBanner from '@/app/components/carousels/CarouselBanner';
import DynamicHeader from '@/app/components/header/DynamicHeader';

// --- NEW INTERFACES TO RESOLVE 'any' ERRORS ---

interface RawSellerData {
  _id: string;
  store: {
    name: string;
    bannerUrl?: string;
  };
  isVerifiedSeller?: boolean; // Making optional to align with validation below
  profilePicture?: { url: string };
  // Assuming other properties exist but are not used
}

interface SellersApiResponse {
  sellers: RawSellerData[];
}

// --- EXISTING INTERFACES ---

interface Seller {
  _id: string;
  store: {
    name: string;
    bannerUrl?: string;
  };
  isVerifiedSeller: boolean;
  profilePicture?: { url: string };
}

interface GivenReview {
  _id: string;
  sellerId: {
    store: { name: string; bannerUrl?: string };
    profilePicture?: { url: string };
    isVerifiedSeller: boolean;
  };
  productId: {
    _id: string;
    name: string;
    images: string[];
  };
  rating: number;
  comment: string;
  createdAt: string;
}

export default function ProfileReviewsPage() {
  const [isMobile, setIsMobile] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'ready' | 'given'>('ready');
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedSeller, setSelectedSeller] = useState<Seller | null>(null);
  const [allSellers, setAllSellers] = useState<Seller[]>([]);
  const [givenReviews, setGivenReviews] = useState<GivenReview[]>([]);
  const [loadingSellers, setLoadingSellers] = useState(true);
  const [loadingReviews, setLoadingReviews] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Fetch all sellers
  useEffect(() => {
    const fetchSellers = async () => {
      try {
        setLoadingSellers(true);
        const res =
          await fetchWithToken<SellersApiResponse>('/v1/users/sellers');

        if (!res?.sellers || !Array.isArray(res.sellers)) {
          setAllSellers([]);
          return;
        }

        const validSellers = res.sellers
          .filter((s: RawSellerData) => s.store?.name)
          .map(
            (s: RawSellerData): Seller => ({
              _id: s._id,
              store: {
                name: s.store.name,
                bannerUrl: s.store.bannerUrl || '',
              },
              isVerifiedSeller: s.isVerifiedSeller || false,
              profilePicture: s.profilePicture || undefined,
            })
          );

        setAllSellers(validSellers);
      } catch (err) {
        console.error('Failed to load sellers:', err);
      } finally {
        setLoadingSellers(false);
      }
    };

    fetchSellers();
  }, []);

  useEffect(() => {
    if (activeTab !== 'given') return;

    const fetchGivenReviews = async () => {
      try {
        setLoadingReviews(true);
        const res = await fetchWithToken<{ reviews: GivenReview[] }>(
          '/v1/users/me/reviews-written'
        );

        if (res?.reviews && Array.isArray(res.reviews)) {
          setGivenReviews(res.reviews);
        } else {
          setGivenReviews([]);
        }
      } catch (err) {
        console.error('Failed to load your reviews:', err);
        setGivenReviews([]);
      } finally {
        setLoadingReviews(false);
      }
    };

    fetchGivenReviews();
  }, [activeTab]);

  const openReviewModal = (seller: Seller) => {
    setSelectedSeller(seller);
    localStorage.setItem('sellerId', seller._id);
    localStorage.setItem('currentProductId', 'any-product-id');
    setIsReviewModalOpen(true);
  };

  const closeReviewModal = () => {
    setIsReviewModalOpen(false);
    setSelectedSeller(null);
    localStorage.removeItem('sellerId');
    localStorage.removeItem('currentProductId');
  };

  return (
    <>
      <Header />
      <DynamicHeader />

      <div className="flex min-h-screen">
        <div className="flex-1 flex flex-col">
          <main className="flex-1 p-4 md:p-8">
            <div className="max-w-5xl mx-auto">
              {isMobile && (
                <button
                  onClick={() => setMenuOpen(true)}
                  className="mb-6 flex items-center gap-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-xl p-3"
                >
                  <Menu className="w-5 h-5" />
                  Menu
                </button>
              )}

              <div className="flex flex-col lg:flex-row gap-8">
                {isMobile && (
                  <BuyersProfileSidebar
                    isMobile={true}
                    isOpen={menuOpen}
                    setIsOpen={setMenuOpen}
                  />
                )}
                {!isMobile && (
                  <BuyersProfileSidebar
                    isMobile={false}
                    isOpen={true}
                    setIsOpen={() => {}}
                  />
                )}

                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-gray-900 mb-6">
                    Your Reviews
                  </h1>

                  <div className="flex gap-8 border-b border-gray-200 mb-8">
                    <button
                      onClick={() => setActiveTab('ready')}
                      className={`pb-4 text-sm font-medium transition ${activeTab === 'ready' ? 'text-black border-b-2 border-black' : 'text-gray-500 hover:text-gray-900'}`}
                    >
                      Ready for review ({allSellers.length})
                    </button>
                    <button
                      onClick={() => setActiveTab('given')}
                      className={`pb-4 text-sm font-medium transition ${activeTab === 'given' ? 'text-black border-b-2 border-black' : 'text-gray-500 hover:text-gray-900'}`}
                    >
                      Reviews given ({givenReviews.length})
                    </button>
                  </div>

                  {/* Ready for Review — ALL sellers */}
                  {activeTab === 'ready' && (
                    <>
                      {loadingSellers ? (
                        <div className="text-center py-16">
                          <div className="w-12 h-12 border-4 border-gray-300 border-t-slate-900 rounded-full animate-spin mx-auto" />
                          <p className="mt-4 text-gray-600">
                            Loading sellers...
                          </p>
                        </div>
                      ) : allSellers.length === 0 ? (
                        <div className="text-center py-16 bg-white rounded-3xl border border-gray-100">
                          <p className="text-gray-500 text-lg">
                            No sellers found
                          </p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                          {allSellers.map((seller) => (
                            <div
                              key={seller._id}
                              className="bg-white rounded-3xl p-6 border border-gray-100"
                            >
                              <div className="flex flex-col items-start gap-4">
                                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white shadow">
                                  {seller.profilePicture?.url ? (
                                    <Image
                                      src={seller.profilePicture.url}
                                      alt={seller.store.name}
                                      width={64}
                                      height={64}
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <div className="w-full h-full bg-gray-300" />
                                  )}
                                </div>
                                <div className="flex-1">
                                  <h3 className="font-semibold text-gray-900 flex items-center gap-1.5">
                                    {seller.store.name}
                                    {seller.isVerifiedSeller && (
                                      <Verified className="w-4 h-4 fill-green-500 text-white" />
                                    )}
                                  </h3>
                                  <p className="text-xs text-gray-600 mt-1">
                                    Wholesale Store
                                  </p>
                                  <div className="flex gap-1 mt-3">
                                    {[1, 2, 3, 4, 5].map((i) => (
                                      <Star
                                        key={i}
                                        className="w-5 h-5 fill-yellow-400 text-yellow-400"
                                      />
                                    ))}
                                    <span className="text-sm text-gray-600 ml-1">
                                      (5.0)
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <button
                                onClick={() => openReviewModal(seller)}
                                className="mt-6 w-full py-3 hover:cursor-pointer bg-slate-900 text-white rounded-2xl font-medium hover:bg-slate-800 transition"
                              >
                                Leave a Review
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  )}

                  {/* Reviews Given — REAL from API */}
                  {activeTab === 'given' && (
                    <>
                      {loadingReviews ? (
                        <div className="text-center py-16">
                          <div className="w-12 h-12 border-4 border-gray-300 border-t-slate-900 rounded-full animate-spin mx-auto" />
                          <p className="mt-4 text-gray-600">
                            Loading your reviews...
                          </p>
                        </div>
                      ) : givenReviews.length === 0 ? (
                        <div className="text-center py-20 bg-white rounded-3xl border border-gray-100">
                          <p className="text-gray-500 text-lg">
                            No reviews yet
                          </p>
                          <p className="text-sm text-gray-400 mt-2">
                            Your reviews will appear here
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-6">
                          {givenReviews.map((review) => (
                            <div
                              key={review._id}
                              className="bg-white rounded-3xl p-6 border border-gray-100"
                            >
                              <div className="flex items-start gap-4">
                                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white">
                                  {review.sellerId.profilePicture?.url ? (
                                    <Image
                                      src={review.sellerId.profilePicture.url}
                                      alt={review.sellerId.store.name}
                                      width={64}
                                      height={64}
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <div className="w-full h-full bg-gray-300" />
                                  )}
                                </div>
                                <div className="flex-1">
                                  <h3 className="font-semibold text-gray-900 flex items-center gap-1.5">
                                    {review.sellerId.store.name}
                                    {review.sellerId.isVerifiedSeller && (
                                      <Verified className="w-4 h-4 fill-green-500 text-white" />
                                    )}
                                  </h3>
                                  <p className="text-xs text-gray-600 mt-1">
                                    Reviewed: {review.productId.name}
                                  </p>

                                  <div className="flex gap-1 mt-3">
                                    {[...Array(5)].map((_, i) => (
                                      <Star
                                        key={i}
                                        className={`w-5 h-5 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                                      />
                                    ))}
                                  </div>

                                  <p className="mt-4 text-gray-800 font-medium">
                                    {review.comment}
                                  </p>

                                  {review.productId.images[0] && (
                                    <div className="flex gap-3 mt-4">
                                      <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                                        <Image
                                          src={review.productId.images[0]}
                                          alt={review.productId.name}
                                          width={64}
                                          height={64}
                                          className="w-full h-full object-cover"
                                        />
                                      </div>
                                    </div>
                                  )}

                                  <p className="text-xs text-gray-500 mt-4">
                                    {new Date(
                                      review.createdAt
                                    ).toLocaleDateString()}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
      <CarouselBanner />

      {/* Modal */}
      {selectedSeller && (
        <LeaveReviewModal
          isOpen={isReviewModalOpen}
          onClose={closeReviewModal}
          sellerName={selectedSeller.store.name}
          sellerVerified={selectedSeller.isVerifiedSeller}
          storeBannerUrl={selectedSeller.store.bannerUrl}
          onSuccess={() => {
            alert('Review submitted!');
            closeReviewModal();
          }}
        />
      )}
    </>
  );
}
