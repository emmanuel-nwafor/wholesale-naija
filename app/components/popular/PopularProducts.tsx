'use client';

import React, { useEffect, useState } from 'react';
import ProductCard from '../product-card/ProductCard';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface PopularProduct {
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
    isVerified?: boolean;
  };
  slug: string;
}

export default function PopularProducts() {
  const [products, setProducts] = useState<PopularProduct[]>([]);
  const [loading, setLoading] = useState(true); // <-- Loading state

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true); // start loading
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/products/popular`,
          {
            method: 'GET',
          }
        );

        const data = await res.json();

        if (data?.products) setProducts(data.products);
      } catch (err) {
        console.error('Failed to fetch popular products:', err);
      } finally {
        setLoading(false); // stop loading
      }
    };

    loadProducts();
  }, []);

  // Number of placeholders to show while loading
  const placeholderCount = 8;

  return (
    <section className="py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex bg-gray-50 rounded-xl p-2 items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Popular Products</h2>

          <Link
            href="#"
            className="text-sm font-medium text-gray-600 hover:text-gray-900 flex items-center gap-1"
          >
            See All <ArrowRight />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {loading
            ? Array.from({ length: placeholderCount }).map((_, i) => (
                <ProductCard key={i} loading={true} />
              ))
            : products.map((product) => (
                <ProductCard key={product._id} product={product} type="popular" />
              ))}
        </div>
      </div>
    </section>
  );
}
