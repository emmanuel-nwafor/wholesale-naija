'use client';

import React, { useState } from 'react';
import { Heart, Star, Share2, ChevronLeft, ChevronRight, MessageCircle, Store, Package, Verified } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '@/app/components/header/Header';
import ProductCard from '@/app/components/product-card/ProductCard';

const defaultImage = "https://i.pinimg.com/736x/77/bb/58/77bb584d7313eb31d40afa9a76b3c8d9.jpg";

export default function ProductDetailsPage() {
  const [quantity, setQuantity] = useState(1);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeTab, setActiveTab] = useState<'description' | 'reviews' | 'store'>('description');

  // Mock data
  const product = {
    name: "iPhone 16 Pro Max (Blue, 1TB - 256GB)",
    price: 28000,
    oldPrice: 35000,
    seller: "AB***** Stores",
    rating: 4.5,
    reviews: "3.5k+",
    moq: "20 bags",
    coins: 10,
    description: `Titanium design with larger 6.9-inch Super Retina XDR display, durable latest-generation Ceramic Shield, Action button, and USB-C with USB 3 speeds footnote 2.
                The first iPhone designed for Apple Intelligence. Personal, private, powerful.
                Camera Control gives you an easier way to quickly access camera tools and take stunning photos. A powerful 48MP Fusion camera delivers a huge leap in battery life with 120 fps Dolby Vision and 4K studio-quality mics.
                Capture magical spatial photos and videos on iPhone 16 Pro, then relive them on Apple Vision Pro.`,
    images: [
      'https://i.pinimg.com/1200x/44/47/03/444703777e071669cc07a4d0e2b208a3.jpg',
      'https://i.pinimg.com/736x/39/27/b2/3927b28fe30ca00d982af72eef291553.jpg',
      'https://i.pinimg.com/736x/d2/32/61/d23261b44ce8dc15f0289243867cfdf0.jpg',
    ],
  };

  const reviews = [
    { id: 1, rating: 5, text: "Excellent device, delivery was fast!", date: "Jun 10, 2025", user: "Chinedu O." },
    { id: 2, rating: 4, text: "Great phone, but battery could be better.", date: "Jun 08, 2025", user: "Aisha M." },
    { id: 3, rating: 5, text: "Trusted seller, highly recommend!", date: "Jun 05, 2025", user: "Emeka N." },
  ];

  const handleNext = () => setCurrentIndex((prev) => (prev + 1) % product.images.length);
  const handlePrev = () => setCurrentIndex((prev) => (prev - 1 + product.images.length) % product.images.length);

  return (
    <>
      <Header />
      <div className="min-h-screen">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left: Image */}
            <div className="relative bg-gray-50 rounded-3xl p-">
              <AnimatePresence mode="wait">
                <motion.img
                  key={currentIndex}
                  src={product.images[currentIndex]}
                  alt={product.name}
                  className="w-full object-cover h-[80vh] rounded-2xl"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                />
              </AnimatePresence>

              {/* Controls */}
              {product.images.length > 1 && (
                <>
                  <button onClick={handlePrev} className="absolute left-8 top-1/2 -translate-y-1/2 p-2 bg-white rounded-full shadow-md">
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button onClick={handleNext} className="absolute right-8 top-1/2 -translate-y-1/2 p-2 bg-white rounded-full shadow-md">
                    <ChevronRight className="w-5 h-5" />
                  </button>
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                    {product.images.map((_, i) => (
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
                <h1 className="text-2xl font-medium text-gray-900">{product.name}</h1>
                <div className="flex items-center gap-6 mt-2 text-sm text-gray-600">
                  <span className='flex items-center'>{product.seller} <Verified className="w-4 h-4 fill-green-400 text-white" /></span>
                  <span className="flex items-center gap-1">
                    {product.rating} <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" /> ({product.reviews})
                  </span>
                </div>
              </div>

              <div className="">
                <div className="flex rounded-2xl bg-gray-50 justify-between items-start">
                  <div className='p-6'>
                    <p className="text-2xl font-medium text-gray-900">₦{product.price.toLocaleString()}</p>
                    <p className="text-xs text-gray-500 mt-1">MOQ: {product.moq}</p>
                  </div>
                </div>

                <div className="mt-4 p-3 text-sm text-center text-gray-800">
                  You have {product.coins} Coins available
                </div>

                <button className="w-full mt-4 bg-slate-900 text-white py-4 rounded-2xl font-medium flex items-center justify-center gap-2 hover:from-blue-700 hover:to-blue-800 transition">
                  <span className="w-4 h-4 bg-yellow-400 rounded-full animate-pulse" />
                  Unlock Contact ({product.coins} Coins)
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
                    activeTab === tab.id
                      ? 'text-slate-600 border-b-2 border-slate-800'
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
                    <span className='flex items-center font-medium'>
                        Rating & Reviews  <p className="font-light text-gray-400">(3491 Reviews)</p>
                    </span>
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        {[1,2,3,4,5].map(i => (
                          <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                      <span className="font-medium flex">4.5 out of 5</span> 
                    </div>

                    {reviews.map((review) => (
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
                <motion.div
                    key="store"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="py-8"
                >
                    {/* Store Header */}
                    <div className="flex items-start gap-4 mb-8">
                    <div className="w-16 h-16 bg-gray-200 rounded-full" />
                    <div className="flex-1">
                        <div className="flex items-center gap-2">
                        <h3 className="text-xl font-semibold">{product.seller}</h3>
                        <Verified className="w-5 h-5 fill-green-500 text-white" />
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                        <span>Lagos, Nigeria</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                            4.5
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            (3k+)
                        </span>
                        </div>
                    </div>
                    </div>

                    {/* Store Description */}
                    <div className="mb-10">
                    <h4 className="font-medium text-gray-900 mb-3">Store Description</h4>
                    <p className="text-sm text-gray-600 leading-relaxed">
                        Supplier of phones, phones accessories & part with 5+ years wholesale experience.
                        Supplier of phones, phones accessories & part with 5+ years wholesale experience.
                        Supplier of phones, phones accessories & part with 5+ years wholesale experience.
                    </p>
                    </div>

                    {/* All Products Section */}
                    <div>
                    <h4 className="text-center text-lg font-medium text-gray-900 mb-6 bg-gray-50 py-3 rounded-xl">
                        All Products
                    </h4>

                    {/* Product Grid using ProductCard with proper unique key */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                        {[...Array(8)].map((_, i) => (
                        <ProductCard key={`store-product-${i}`} />
                        ))}
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