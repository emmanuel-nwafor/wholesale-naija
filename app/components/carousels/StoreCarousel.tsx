'use client';
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function StoreCarousel() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % 3);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const next = () => setCurrent((prev) => (prev + 1) % 3);
  const prev = () => setCurrent((prev) => (prev === 0 ? 2 : prev - 1));

  return (
    <div className="relative w-full rounded-3xl overflow-hidden md:h-80 lg:h-full">
      <div className="flex items-center justify-center mt-10 h-full">
        <img
          src="/svgs/hero-banner.svg"
          alt="Starter Packs Banner"
          className="w-full h-full object-contain md:object-cover"
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