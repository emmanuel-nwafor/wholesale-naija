import React from 'react';
import ProductCard from '../product-card/ProductCard';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function NewProducts() {
  return (
    <section className="py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex bg-gray-50 rounded-xl p-2 items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Newest Products</h2>
          <Link href="#" className="text-sm font-medium text-gray-600 hover:text-gray-900 flex items-center gap-1">
            See All
            <ArrowRight />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <ProductCard key={i} />
          ))}
        </div>
      </div>
    </section>
  );
}