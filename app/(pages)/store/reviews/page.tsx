"use client";
import React, { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import StoreSidebar from "@/app/components/sidebar/StoreSidebar";
import DashboardHeader from "@/app/components/header/DashboardHeader";

const ReviewItem = () => (
  <div className="flex items-start gap-4 py-5 border-b border-gray-200 last:border-0">
    <div className="flex gap-0.5">
      {[...Array(5)].map((_, i) => (
        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
      ))}
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-sm leading-snug text-gray-800">Trusted, honest and he delivers</p>
      <div className="flex items-center gap-2 mt-2">
        <div className="flex gap-1">
          {[1, 2, 3].map((i) => (
            <div key={i} className="w-12 h-12 bg-gray-200 rounded-md border border-gray-300" />
          ))}
        </div>
      </div>
      <p className="text-xs text-gray-500 mt-1">Reviewed by customer</p>
    </div>
    <p className="text-xs text-gray-500 whitespace-nowrap">June 9, 2025</p>
  </div>
);

export default function ReviewsPage() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  return (
    <div className="flex min-h-screen bg-white">
      <StoreSidebar />
      <div className="flex-1 flex flex-col">
        <DashboardHeader />
        <main className={`flex-1 ${isMobile ? '' : 'md:ml-64'} p-4 md:p-8`}>
          <div className="max-w-3xl">
            <h1 className="text-xl font-medium mb-6">My Reviews</h1>
            <div className="bg-gray-50 rounded-lg px-4 py-3 mb-6">
              <div className="flex items-center gap-2">
                <span className="text-base font-medium">4.5/5</span>
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < 4 ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-300 text-gray-300'}`}
                    />
                  ))}
                </div>
              </div>
            </div>
            <div className="divide-y divide-gray-200">
              {[1, 2, 3, 4, 5].map((i) => (
                <ReviewItem key={i} />
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}