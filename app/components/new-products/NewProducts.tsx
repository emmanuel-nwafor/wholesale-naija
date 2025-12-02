'use client';

import React, { useEffect, useState } from 'react';
import ProductCard from '../product-card/ProductCard';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface NewProduct {
  _id: string;
  name: string;
  price: number;
  images: string[];
  slug: string;
  seller?: {
    _id: string;
    fullName?: string;
    store?: { name?: string };
  };
}

export default function NewProducts() {
  const [products, setProducts] = useState<NewProduct[]>([]);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/products/new`, {
          method: 'GET',
        });

        const data = await res.json();

        if (data?.products) setProducts(data.products);
      } catch (err) {
        console.error('Failed to fetch new products:', err);
      }
    };

    loadProducts();
  }, []);

  return (
    <section className="py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex bg-gray-50 rounded-xl p-2 items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Newest Products</h2>
          <Link
            href="#"
            className="text-sm font-medium text-gray-600 hover:text-gray-900 flex items-center gap-1"
          >
            See All
            <ArrowRight />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {products.length > 0
            ? products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))
            : Array.from({ length: 8 }).map((_, i) => <ProductCard key={i} />)}
        </div>
      </div>
    </section>
  );
}
