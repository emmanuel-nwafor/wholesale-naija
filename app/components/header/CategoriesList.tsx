'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { fetchWithToken } from '@/app/utils/fetchWithToken';

interface Brand {
  name: string;
}

interface SubCategory {
  name: string;
  brands: Brand[];
}

interface Category {
  _id: string;
  name: string;
  subcategories: SubCategory[];
}

export default function CategoriesList() {
  const [showModal, setShowModal] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await fetchWithToken<{ categories: Category[] }>(
          '/v1/categories'
        );
        if (res?.categories) {
          setCategories(res.categories);
          // Optional: pre-select first one
          // setSelectedCategory(res.categories[0]);
        }
      } catch (err) {
        console.error('Failed to fetch categories:', err);
      }
    };
    loadCategories();
  }, []);

  const topCategories = categories.slice(0, 4);

  return (
    <>
      {/* Top Green Bar - Desktop Only */}
      <div className="hidden md:block">
        <div className="bg-green-600">
          <div className="flex items-center justify-center gap-8 px-8 py-5 overflow-x-auto scrollbar-none">
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 text-white font-light text-lg whitespace-nowrap hover:opacity-90 transition"
            >
              All Categories
              <Menu className="w-5 h-5" />
            </button>

            {topCategories.map((cat) => (
              <Link
                key={cat._id}
                href={`/category/${cat._id}`}
                className="text-white font-light text-lg whitespace-nowrap hover:opacity-90 transition"
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Mega Menu Modal */}
      <AnimatePresence>
        {showModal && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
              onClick={() => setShowModal(false)}
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed top-24 left-1/2 -translate-x-1/2 w-full max-w-7xl z-50 bg-white rounded-2xl shadow-2xl overflow-hidden"
            >
              <div className="flex h-[70vh]">
                {/* Left: Categories List */}
                <div className="w-80 bg-gray-50 border-r border-gray-200 overflow-y-auto">
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">
                      Categories
                    </h3>
                    {categories.map((cat) => (
                      <button
                        key={cat._id}
                        onClick={() => {
                          setSelectedCategory(cat);
                        }}
                        className={`w-full text-left px-5 py-3 rounded-lg text-sm font-medium transition-all ${
                          selectedCategory?._id === cat._id
                            ? 'bg-white text-green-700 shadow-sm border border-green-100'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Right: Subcategories & Brands - ALL CLICKABLE TO CATEGORY PAGE */}
                <div className="flex-1 bg-white overflow-y-auto relative p-10">
                  <button
                    onClick={() => setShowModal(false)}
                    className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full transition"
                  >
                    <X className="w-6 h-6 text-gray-500" />
                  </button>

                  {selectedCategory ? (
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-8">
                        {selectedCategory.name}
                      </h3>

                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
                        {selectedCategory.subcategories.map((sub) => (
                          <div key={sub.name}>
                            {/* Subcategory Title - Clickable */}
                            <Link
                              href={`/category/${selectedCategory._id}`}
                              onClick={() => setShowModal(false)}
                              className="block font-semibold text-gray-800 mb-4 hover:text-green-600 transition"
                            >
                              {sub.name}
                            </Link>

                            {/* Brands - All Clickable */}
                            <ul className="space-y-2">
                              {sub.brands.map((brand) => (
                                <li key={brand.name}>
                                  <Link
                                    href={`/category/${selectedCategory._id}`}
                                    onClick={() => setShowModal(false)}
                                    className="text-sm text-gray-600 hover:text-green-600 transition"
                                  >
                                    {brand.name}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-500">
                      Click a category to view details
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
