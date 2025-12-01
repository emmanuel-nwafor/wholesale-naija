// app/profile/reviews/page.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { Menu, Star, Verified } from 'lucide-react';
import Header from '@/app/components/header/Header';
import BuyersProfileSidebar from '@/app/components/sidebar/BuyersProfileSidebar';
import LeaveReviewModal from '@/app/components/modals/LeaveReviewModal';
import { fetchWithToken } from '@/app/utils/fetchWithToken';
import Image from 'next/image';

interface SellerWithProduct {
  sellerId: string;
  productId: string;
  storeName: string;
  bannerUrl?: string;
  isVerifiedSeller: boolean;
  profilePictureUrl?: string;
  productName: string;
  productImage: string;
}

export default function ProfileReviewsPage() {
  const [isMobile, setIsMobile] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'ready' | 'given'>('ready');
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState<SellerWithProduct | null>(null);
  const [reviewableSellers, setReviewableSellers] = useState<SellerWithProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Fetch real products → extract unique sellers with real productId
  useEffect(() => {
    const fetchReviewableSellers = async () => {
      try {
        setLoading(true);

        // This tells TypeScript the shape of the response
        const res = await fetchWithToken<{ products: any[] }>('/v1/products/search');

        if (!res?.products || !Array.isArray(res.products)) {
          setReviewableSellers([]);
          return;
        }

        const uniqueSellers = new Map<string, SellerWithProduct>();

        res.products.forEach((product: any) => {
          const sellerId = product.seller?._id || product.vendor?._id;
          const store = product.seller?.store || product.vendor?.store;

          if (!sellerId || !store?.name) return;

          if (!uniqueSellers.has(sellerId)) {
            uniqueSellers.set(sellerId, {
              sellerId,
              productId: product._id,
              storeName: store.name,
              bannerUrl: store.bannerUrl || '',
              isVerifiedSeller: product.seller?.isVerifiedSeller || product.vendor?.isVerifiedSeller || false,
              profilePictureUrl: product.seller?.profilePicture?.url || product.vendor?.profilePicture?.url,
              productName: product.name,
              productImage: product.images?.[0] || '/placeholder.jpg',
            });
          }
        });

        setReviewableSellers(Array.from(uniqueSellers.values()));
      } catch (err) {
        console.error('Failed to load reviewable sellers:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchReviewableSellers();
  }, []);

  const openReviewModal = (item: SellerWithProduct) => {
    setSelectedReview(item);
    localStorage.setItem('sellerId', item.sellerId);
    localStorage.setItem('currentProductId', item.productId); // Real productId!
    setIsReviewModalOpen(true);
  };

  const closeReviewModal = () => {
    setIsReviewModalOpen(false);
    setSelectedReview(null);
    localStorage.removeItem('sellerId');
    localStorage.removeItem('currentProductId');
  };

  return (
    <>
      <Header />

      <div className="flex min-h-screen bg-gray-50">
        <div className="flex-1 flex flex-col">
          <main className="flex-1 p-4 md:p-8">
            <div className="max-w-5xl mx-auto">
              {isMobile && (
                <button onClick={() => setMenuOpen(true)} className="mb-6 flex items-center gap-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-xl p-3">
                  <Menu className="w-5 h-5" />
                  Menu
                </button>
              )}

              <div className="flex flex-col lg:flex-row gap-8">
                {isMobile && <BuyersProfileSidebar isMobile={true} isOpen={menuOpen} setIsOpen={setMenuOpen} />}
                {!isMobile && <BuyersProfileSidebar isMobile={false} isOpen={true} setIsOpen={() => {}} />}

                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-gray-900 mb-6">Your Reviews</h1>

                  <div className="flex gap-8 border-b border-gray-200 mb-8">
                    <button
                      onClick={() => setActiveTab('ready')}
                      className={`pb-4 text-sm font-medium transition ${activeTab === 'ready' ? 'text-black border-b-2 border-black' : 'text-gray-500 hover:text-gray-900'}`}
                    >
                      Ready for review ({reviewableSellers.length})
                    </button>
                    <button
                      onClick={() => setActiveTab('given')}
                      className={`pb-4 text-sm font-medium transition ${activeTab === 'given' ? 'text-black border-b-2 border-black' : 'text-gray-500 hover:text-gray-900'}`}
                    >
                      Reviews given (0)
                    </button>
                  </div>

                  {activeTab === 'ready' && (
                    <>
                      {loading ? (
                        <div className="text-center py-16">
                          <div className="w-12 h-12 border-4 border-gray-300 border-t-slate-900 rounded-full animate-spin mx-auto" />
                          <p className="mt-4 text-gray-600">Loading sellers...</p>
                        </div>
                      ) : reviewableSellers.length === 0 ? (
                        <div className="text-center py-16 bg-white rounded-3xl border border-gray-100">
                          <p className="text-gray-500 text-lg">No sellers to review yet</p>
                          <p className="text-sm text-gray-400 mt-2">Browse products and come back!</p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                          {reviewableSellers.map((item) => (
                            <div key={item.sellerId} className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
                              <div className="flex items-start gap-4">
                                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white shadow">
                                  {item.profilePictureUrl ? (
                                    <Image src={item.profilePictureUrl} alt={item.storeName} width={64} height={64} className="w-full h-full object-cover" />
                                  ) : (
                                    <div className="w-full h-full bg-gray-300" />
                                  )}
                                </div>
                                <div className="flex-1">
                                  <h3 className="font-semibold text-gray-900 flex items-center gap-1.5">
                                    {item.storeName}
                                    {item.isVerifiedSeller && <Verified className="w-4 h-4 fill-green-500 text-white" />}
                                  </h3>
                                  <p className="text-xs text-gray-600 mt-1">You viewed: {item.productName}</p>
                                  <div className="flex gap-1 mt-3">
                                    {[1, 2, 3, 4, 5].map((i) => (
                                      <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                                    ))}
                                    <span className="text-sm text-gray-600 ml-1">(5.0)</span>
                                  </div>
                                </div>
                              </div>
                              <button
                                onClick={() => openReviewModal(item)}
                                className="mt-6 w-full py-3 bg-slate-900 text-white rounded-2xl font-medium hover:bg-slate-800 transition"
                              >
                                Leave a Review
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  )}

                  {activeTab === 'given' && (
                    <div className="text-center py-20 bg-white rounded-3xl border border-gray-100">
                      <p className="text-gray-500 text-lg">No reviews yet</p>
                      <p className="text-sm text-gray-400 mt-2">Your reviews will appear here</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Modal with REAL productId and sellerId */}
      {selectedReview && (
        <LeaveReviewModal
          isOpen={isReviewModalOpen}
          onClose={closeReviewModal}
          sellerName={selectedReview.storeName}
          sellerVerified={selectedReview.isVerifiedSeller}
          storeBannerUrl={selectedReview.bannerUrl}
          // onSuccess={() => {
          //   alert('Thank you! Your review has been submitted.');
          //   closeReviewModal();
          // }}
        />
      )}
    </>
  );
}