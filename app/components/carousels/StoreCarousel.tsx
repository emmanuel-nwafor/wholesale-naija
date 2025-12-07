'use client';
import React, { useState, useEffect } from 'react';
// 1. Import the Image component from Next.js
import Image from 'next/image'; 
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function StoreCarousel() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    // Note: This carousel logic currently only shows a single image. 
    // If you intend to have a sliding carousel, you will need to map 
    // over an array of image data and use 'current' to determine which 
    // image is visible (e.g., using translate or opacity).
    
    // The current auto-rotate logic is kept as-is, assuming future implementation
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % 3);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const next = () => setCurrent((prev) => (prev + 1) % 3);
  const prev = () => setCurrent((prev) => (prev === 0 ? 2 : prev - 1));

  // Define the image source data (only one is used in the current JSX)
  const images = ['/svgs/hero-banner.svg', '/svgs/banner-2.svg', '/svgs/banner-3.svg']; 

  return (
    // 2. Add 'relative' to the container for Image 'fill' to work correctly
    <div className="relative w-full rounded-3xl overflow-hidden md:h-80 lg:h-full">
      
      {/* 3. Wrap the Image in a container with defined height */}
      <div className="flex items-center justify-center mt-10 h-full relative">
        <Image
          src={images[0]} // Using the first image source defined above
          alt="Starter Packs Banner"
          // Key for optimization: Use 'fill' to size the image relative to the parent
          fill 
          // Use sizes attribute to tell Next.js the expected size for optimization
          sizes="(max-width: 768px) 100vw, 800px" 
          className="object-contain md:object-cover"
          // Set priority for the main hero image to improve LCP
          priority
        />
      </div>

      {/* Navigation */}
      <button
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/20 hover:bg-white/30 rounded-full backdrop-blur-sm transition opacity-0 md:opacity-100"
      >
        <ChevronLeft className="w-5 h-5 text-white" />
      </button>
      <button
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/20 hover:bg-white/30 rounded-full backdrop-blur-sm transition opacity-0 md:opacity-100"
      >
        <ChevronRight className="w-5 h-5 text-white" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 opacity-0 md:opacity-100">
        {[0, 1, 2].map((i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-2 h-2 rounded-full transition ${
              current === i ? 'bg-gray-300 w-6' : 'bg-gray-600/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
}