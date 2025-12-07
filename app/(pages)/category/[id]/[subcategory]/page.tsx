'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Header from '@/app/components/header/Header';
import DynamicHeader from '@/app/components/header/DynamicHeader';
import FilterHeader from '@/app/components/header/FilterHeader';
import ProductCard from '@/app/components/product-card/ProductCard';
import { fetchWithToken } from '@/app/utils/fetchWithToken';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface Product {
  _id: string;
  name: string;
  price: number;
  images: string[];
  moq?: string;
  verified?: boolean;
  seller?: { _id: string; fullName?: string };
}

export default function SubCategoryPage() {
  const params = useParams();
  const searchParams = useSearchParams();

  // Safe access
  const categoryId = params?.id as string | undefined;
  const subcategorySlug = params?.subcategory as string | undefined;

  // Hooks
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const originalName =
    searchParams.get('name') || subcategorySlug?.replace(/-/g, ' ') || '';

  const displayName = originalName
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');

  useEffect(() => {
    if (!categoryId || !originalName) return;

    const loadProducts = async () => {
      try {
        setLoading(true);
        const res = await fetchWithToken<{ products: Product[] }>(
          '/v1/products/search',
          {
            method: 'POST',
            body: JSON.stringify({
              category: categoryId,
              subcategory: originalName,
              limit: 100,
            }),
          }
        );
        setProducts(res.products || []);
      } catch (err) {
        console.error('Failed to load products:', err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [categoryId, originalName]);

  // Return for invalid params
  if (!categoryId || !subcategorySlug) {
    return (
      <>
        <Header />
        <DynamicHeader />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <p className="text-gray-600">Loading...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <DynamicHeader />

      <div className="min-h-screen bg-gray-100 pt- pb-7">
        {/* Title + See All */}
        <div className="px-14 mb-3">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold text-gray-800">
              {displayName}
            </h1>
            {products.length > 8 && (
              <Link
                href={`/search?subcategory=${encodeURIComponent(originalName)}`}
                className="text-sm font-medium text-blue-600 flex items-center gap-1 hover:gap-2 transition-all"
              >
                See All
                <ChevronRight className="w-4 h-4" />
              </Link>
            )}
          </div>
        </div>

        {/* Filter Bar */}
        <div className="mx-8">
          <FilterHeader />
        </div>

        {/* Horizontal Scrollable Products */}
        <div className="px-6 overflow-x-auto scrollbar-none">
          <div className="flex gap-5 py-6 min-w-max">
            {loading ? (
              Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="w-48 flex-shrink-0">
                  <ProductCard loading />
                </div>
              ))
            ) : products.length === 0 ? (
              <div className="justify-center flex flex-col w-full items-center text-center py-20 text-gray-500">
                <Image
                  src={`/svgs/emptyState-wholesale-svg.svg`}
                  alt={`no product found`}
                  height={200}
                  width={200}
                />
                <p className="m-3">No products found in this subcategory.</p>
              </div>
            ) : (
              products.map((product, index) => (
                <div key={product._id} className="w-48 flex-shrink-0 relative">
                  {index < 3 && (
                    <div className="absolute top-2 left-2 z-10 bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                      Popular
                    </div>
                  )}
                  <ProductCard product={product} />
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
}
