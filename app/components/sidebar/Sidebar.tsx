'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { X, ChevronRight, Loader2 } from 'lucide-react';
import { fetchWithToken } from '@/app/utils/fetchWithToken';

interface Category {
  _id: string;
  name: string;
  subcategories: { name: string }[];
}

export default function Sidebar({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoading(true);
        setError(false);
        const res = await fetchWithToken<{ categories: Category[] }>(
          '/v1/categories'
        );

        if (res?.categories) {
          setCategories(res.categories);
        }
      } catch (err) {
        console.error('Failed to load categories for sidebar:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    if (isOpen) {
      loadCategories();
    }
  }, [isOpen]);

  return (
    <>
      {/* Mobile Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out w-full sm:w-80 bg-white shadow-2xl flex flex-col h-full md:hidden ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="https://res.cloudinary.com/dqtjja88b/image/upload/v1760218941/wholesaleNaija-removebg-preview_tkw3tv.png"
              alt="Wholesale Naija"
              width={160}
              height={60}
              className="h-12 w-auto"
              priority
            />
          </Link>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 rounded-lg hover:bg-gray-100 transition"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Auth Buttons */}
        <div className="p-4 space-y-3">
          <Link href="/login" className="block">
            <button
              onClick={() => setIsOpen(false)}
              className="w-full py-3.5 border border-gray-300 rounded-xl font-medium hover:bg-gray-50 transition text-base"
            >
              Login
            </button>
          </Link>
          <Link href="/signup" className="block">
            <button
              onClick={() => setIsOpen(false)}
              className="w-full py-3.5 bg-black text-white rounded-xl font-semibold hover:bg-gray-900 transition text-base"
            >
              Create Account
            </button>
          </Link>
        </div>

        {/* Categories Section */}
        <div className="flex-1 overflow-y-auto px-4 py-6 border-t">
          <h3 className="text-lg font-bold mb-4 text-gray-900">Categories</h3>

          {loading ? (
            <div className="space-y-3 py-8 text-center">
              <Loader2 className="w-8 h-8 mx-auto text-green-600 animate-spin" />
              <p className="text-sm text-gray-500">Loading categories...</p>
            </div>
          ) : error ? (
            <p className="text-center text-red-500 text-sm py-8">
              Failed to load categories
            </p>
          ) : categories.length === 0 ? (
            <p className="text-center text-gray-500 py-8">
              No categories found
            </p>
          ) : (
            <ul className="space-y-1">
              {categories.map((category) => (
                <li key={category._id}>
                  <Link
                    href={`/category/${category._id}`}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-between w-full py-3.5 px-4 rounded-lg hover:bg-gray-100 transition text-base font-medium text-gray-800"
                  >
                    <span>{category.name}</span>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Backdrop Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
