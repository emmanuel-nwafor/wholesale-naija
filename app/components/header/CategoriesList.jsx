'use client';

import React, { useRef } from 'react';
import Link from 'next/link';

export default function CategoriesList() {
  const scrollRef = useRef(null);

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  return (
    <div className="hidden md:block">
      <div ref={scrollRef} className="relative flex flex-nowrap overflow-x-auto bg-green-600 p-4 items-center justify-center [&::-webkit-scrollbar]:hidden scrollbar-none">
        <Link href="/" className="mx-2 text-white whitespace-nowrap flex-shrink-0">
          All Categories
        </Link>
        <Link href="/" className="mx-2 text-white whitespace-nowrap flex-shrink-0">
          Phones & Tablet
        </Link>
        <Link href="/" className="mx-2 text-white whitespace-nowrap flex-shrink-0">
          Computer & Accessories
        </Link>
        <Link href="/" className="mx-2 text-white whitespace-nowrap flex-shrink-0">
          Home Electronics
        </Link>
        <Link href="/" className="mx-2 text-white whitespace-nowrap flex-shrink-0">
          Home Appliances
        </Link>
        <Link href="/" className="mx-2 text-white whitespace-nowrap flex-shrink-0">
          Fashion
        </Link>
        <Link href="/" className="mx-2 text-white whitespace-nowrap flex-shrink-0">
          Cosmetics & Health
        </Link>
        <Link href="/" className="mx-2 text-white whitespace-nowrap flex-shrink-0">
          Food & Drinks
        </Link>
        <button 
          onClick={scrollRight}
          className="absolute right-4 top-1/2 -translate-y-1/2 hidden sm:block text-white bg-green-700 px-2 py-1 rounded text-sm hover:bg-green-500 transition"
        >
          →
        </button>
      </div>
    </div>
  );
}