'use client';

import React, { useEffect, useState } from 'react';
import ProductCard from '../product-card/ProductCard';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { fetchWithToken } from '@/app/utils/fetchWithToken';

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

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const res = await fetchWithToken<{ products: PopularProduct[] }>('/v1/products/popular');
        if (res?.products) setProducts(res.products);
      } catch (err) {
        console.error('Failed to fetch popular products:', err);
      }
    };
    loadProducts();
  }, []);

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
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
