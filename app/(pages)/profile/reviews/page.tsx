// app/profile/reviews/page.tsx
"use client";
import React, { useState, useEffect } from 'react';
import { Menu, Star, Verified } from 'lucide-react';
import Header from '@/app/components/header/Header';
import BuyersProfileSidebar from '@/app/components/sidebar/BuyersProfileSidebar';
import Image from 'next/image';

export default function ProfileReviewsPage() {
  const [isMobile, setIsMobile] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'ready' | 'given'>('ready');

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const readyForReview = [
    { id: 1, name: "ABSOLUTE Stores", category: "Phones, Accessories", rating: 5.0 },
    { id: 2, name: "ABSOLUTE Stores", category: "Phones, Accessories", rating: 4.9 },
  ];

  const reviewsGiven = [
    {
      id: 3,
      name: "ABSOLUTE Stores",
      category: "Phones, Accessories",
      rating: 5.0,
      comment: "Trusted, honest and he delivers",
      products: ["/images/blender1.png", "/images/blender2.png", "/images/blender3.png"],
    },
    {
      id: 4,
      name: "ABSOLUTE Stores",
      category: "Phones, Accessories",
      rating: 4.0,
      comment: "Trusted, honest and he delivers",
      products: ["/images/blender1.png", "/images/blender2.png", "/images/blender3.png"],
    },
  ];

  return (
    <>
      <Header />

      <div className="flex min-h-screen bg-gray-50">
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
                  <BuyersProfileSidebar isMobile={true} isOpen={menuOpen} setIsOpen={setMenuOpen} />
                )}
                {!isMobile && (
                  <BuyersProfileSidebar isMobile={false} isOpen={true} setIsOpen={() => {}} />
                )}

                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-gray-900 mb-6">Your Reviews</h1>

                  <div className="flex gap-8 border-b border-gray-200 mb-8">
                    <button
                      onClick={() => setActiveTab('ready')}
                      className={`pb-4 text-sm font-medium transition ${
                        activeTab === 'ready'
                          ? 'text-black border-b-2 border-black'
                          : 'text-gray-500 hover:text-gray-900'
                      }`}
                    >
                      Ready for review (14)
                    </button>
                    <button
                      onClick={() => setActiveTab('given')}
                      className={`pb-4 text-sm font-medium transition ${
                        activeTab === 'given'
                          ? 'text-black border-b-2 border-black'
                          : 'text-gray-500 hover:text-gray-900'
                      }`}
                    >
                      Reviews (2)
                    </button>
                  </div>

                  {activeTab === 'ready' && readyForReview.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {readyForReview.map((store) => (
                        <div key={store.id} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                          <div className="flex items-start gap-4">
                            <div className="w-16 h-16 bg-gray-200 rounded-full" />
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-900 flex items-center gap-1">
                                {store.name}
                                <Verified className="w-4 h-4 fill-green-500 text-white" />
                              </h3>
                              <p className="text-xs text-gray-600 mt-1">{store.category}</p>
                              <div className="flex items-center gap-1 mt-3">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-5 h-5 ${
                                      i < Math.floor(store.rating)
                                        ? 'fill-yellow-400 text-yellow-400'
                                        : 'text-gray-300'
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                          </div>
                          <button className="mt-6 w-full py-3 bg-slate-900 text-white rounded-full font-medium hover:bg-slate-800">
                            Leave a review
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {activeTab === 'given' && (
                    <div className="space-y-6">
                      {reviewsGiven.map((review) => (
                        <div key={review.id} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                          <div className="flex items-start gap-4">
                            <div className="w-16 h-16 bg-gray-200 rounded-full" />
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-900 flex items-center gap-1">
                                {review.name}
                                <Verified className="w-4 h-4 fill-green-500 text-white" />
                              </h3>
                              <p className="text-xs text-gray-600">{review.category}</p>

                              <div className="flex items-center gap-1 mt-3">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-5 h-5 ${
                                      i < review.rating
                                        ? 'fill-yellow-400 text-yellow-400'
                                        : 'text-gray-300'
                                    }`}
                                  />
                                ))}
                              </div>

                              <p className="mt-4 text-gray-800 font-medium">{review.comment}</p>

                              <div className="flex gap-3 mt-4">
                                {review.products.map((src, i) => (
                                  <div key={i} className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                                    <Image
                                      src={src}
                                      alt="product"
                                      width={64}
                                      height={64}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                ))}
                              </div>

                              <p className="text-xs text-gray-500 mt-4">Reviewed by you</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex justify-center mt-12">
                    <button className="flex items-center gap-2 px-8 py-4 bg-slate-900 text-white rounded-full font-medium hover:bg-slate-800 transition">
                      See more
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}