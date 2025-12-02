'use client';

import React, { useEffect, useState } from 'react';
import ProductCard from '../product-card/ProductCard';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface FeaturedProduct {
  _id: string;
  name: string;
  price: number;
  images: string[];
  seller?: {
    _id: string;
    fullName: string;
    store?: {
      name: string;
    };
  };
  slug: string;
}

export default function FeaturedGrid() {
  const [products, setProducts] = useState<FeaturedProduct[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/products/featured`
        );
        const data = await res.json();

        if (data?.products) {
          setProducts(data.products);
        }
      } catch (err) {
        console.error('Failed to fetch featured products:', err);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  return (
    <section className="py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex bg-gray-50 rounded-xl p-2 items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Featured Products</h2>
          <Link
            href="/products?filter=featured"
            className="text-sm font-medium text-gray-600 hover:text-gray-900 flex items-center gap-1"
          >
            See All
            <ArrowRight />
          </Link>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="h-40 bg-gray-200 animate-pulse rounded-xl"
              ></div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && products.length === 0 && (
          <p className="text-gray-600 py-10">No featured products available.</p>
        )}

        {/* Product Grid */}
        {!loading && products.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
