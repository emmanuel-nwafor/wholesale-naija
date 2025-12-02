'use client';

import React, { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { fetchWithToken } from '@/app/utils/fetchWithToken';

interface Brand { name: string; }
interface SubCategory { name: string; brands: Brand[]; }
interface Category { _id: string; name: string; subcategories: SubCategory[]; }

export default function CategoriesList() {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [visibleCount, setVisibleCount] = useState(4);

  // Update visible count based on window width
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width >= 1024) setVisibleCount(4); 
      else if (width >= 768) setVisibleCount(4);
      else setVisibleCount(0); 
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fetch categories
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await fetchWithToken<{ categories: Category[] }>('/v1/categories');
        if (res?.categories) {
          setCategories(res.categories);
          setSelectedCategory(res.categories[0]);
        }
      } catch (err) {
        console.error('Failed to fetch categories:', err);
      }
    };
    loadCategories();
  }, []);

  const scrollRight = () => {
    scrollRef.current?.scrollBy({ left: 300, behavior: 'smooth' });
  };

  const topCategories = categories.slice(0, visibleCount);

  return (
    <div className="md:block">
      {visibleCount > 0 && (
        <div className="overflow-x-auto scrollbar-none [&::-webkit-scrollbar]:hidden">
          <div
            ref={scrollRef}
            className="inline-flex items-center justify-center space-x-2 bg-green-600 p-4 min-w-full"
          >
            {/* All Categories Button */}
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center text-white whitespace-nowrap flex-shrink-0 px-2 py-1 hover:cursor-pointer"
            >
              All Categories <Menu className="text-white text-sm ml-1" height={18} />
            </button>

            {/* Top categories */}
            {topCategories.map((cat) => (
              <Link
                key={cat._id}
                href="/"
                className="text-white whitespace-nowrap flex-shrink-0 px-2 py-1 hover:text-gray-200"
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-md z-40"
              onClick={() => setShowModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
            >
              <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
                <button
                  onClick={() => setShowModal(false)}
                  className="hover:cursor-pointer sticky top-4 right-4 float-right text-gray-500 hover:text-gray-700 text-2xl z-10"
                >
                  <X />
                </button>
                <div className="flex flex-col md:flex-row">
                  {/* Sidebar */}
                  <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-gray-200 pr-0 md:pr-4 py-6 space-y-1 overflow-y-auto flex md:flex-col">
                    {categories.map((cat, idx) => (
                      <motion.button
                        key={cat._id}
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: idx * 0.05 }}
                        onClick={() => setSelectedCategory(cat)}
                        className={`w-full text-left px-4 py-3 transition ${
                          selectedCategory?._id === cat._id
                            ? 'bg-gray-100 text-black border-l-4 border-green-500'
                            : 'hover:bg-gray-100'
                        }`}
                      >
                        {cat.name}
                      </motion.button>
                    ))}
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-4 md:p-6">
                    {selectedCategory && (
                      <motion.div
                        key={selectedCategory._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
                      >
                        {selectedCategory.subcategories.map((sub, idx) => (
                          <motion.div
                            key={sub.name}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                          >
                            <h3 className="font-semibold text-md text-gray-500 mb-2">{sub.name}</h3>
                            <ul className="space-y-1 text-sm text-gray-600">
                              {sub.brands.map((brand) => (
                                <li
                                  key={brand.name}
                                  className="hover:text-green-600 cursor-pointer"
                                >
                                  <Link href="/" onClick={() => setShowModal(false)}>
                                    {brand.name}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </motion.div>
                        ))}
                      </motion.div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
