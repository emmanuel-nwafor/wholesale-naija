'use client';

import React, { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import StoreSidebar from '@/app/components/sidebar/StoreSidebar';
import DashboardHeader from '@/app/components/header/DashboardHeader';
import { getCurrentSellerId } from '@/app/utils/auth';
import { fetchWithToken } from '@/app/utils/fetchWithToken';

interface Review {
  _id: string;
  rating: number;
  comment: string;
  customerName?: string;
  customerImage?: string;
  images?: string[];
  createdAt: string;
}

const ReviewItem = ({ review }: { review: Review }) => (
  <div className="flex items-start gap-4 py-5 border-b border-gray-200 last:border-0">
    <div className="flex gap-0.5">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-300 text-gray-300'}`}
        />
      ))}
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-sm leading-snug text-gray-800">
        {review.comment || 'Great product and fast delivery!'}
      </p>
      {review.images && review.images.length > 0 && (
        <div className="flex items-center gap-2 mt-2">
          <div className="flex gap-1">
            {review.images.slice(0, 3).map((img, i) => (
              <div
                key={i}
                className="w-12 h-12 bg-gray-200 rounded-md border border-gray-300 overflow-hidden"
              >
                <img
                  src={img}
                  alt="Review"
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      )}
      <p className="text-xs text-gray-500 mt-1">
        Reviewed by {review.customerName || 'Customer'}
      </p>
    </div>
    <p className="text-xs text-gray-500 whitespace-nowrap">
      {new Date(review.createdAt).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })}
    </p>
  </div>
);

export default function ReviewsPage() {
  const [isMobile, setIsMobile] = useState(false);
  const [sellerId, setSellerId] = useState<string | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [averageRating, setAverageRating] = useState(0);

  // Detect mobile
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    const loadSellerId = async () => {
      const id = await getCurrentSellerId();
      setSellerId(id);
    };
    loadSellerId();
  }, []);

  useEffect(() => {
    if (!sellerId) return;

    const fetchReviews = async () => {
      try {
        setLoading(true);
        console.log('Fetching reviews for seller:', sellerId);

        const res = await fetchWithToken<{
          reviews: Review[];
          averageRating?: number;
        }>(`/v1/sellers/${sellerId}/reviews`);

        console.log('Reviews data:', res);

        setReviews(res.reviews || []);
        setAverageRating(res.averageRating || 0);
      } catch (err) {
        console.error('Failed to load reviews:', err);
        setReviews([]);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [sellerId]);

  return (
    <div className="flex min-h-screen bg-white">
      <StoreSidebar />
      <div className="flex-1 flex flex-col">
        <DashboardHeader />
        <main className={`flex-1 ${isMobile ? '' : 'md:ml-64'} p-4 md:p-8`}>
          <div className="max-w-3xl">
            <h1 className="text-xl font-medium mb-6">My Reviews</h1>

            {/* Average Rating */}
            <div className="bg-gray-50 rounded-lg px-4 py-3 mb-6">
              <div className="flex items-center gap-2">
                <span className="text-base font-medium">
                  {loading ? '—' : averageRating.toFixed(1) + '/5'}
                </span>
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.round(averageRating)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'fill-gray-300 text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-500 ml-2">
                  ({reviews.length} reviews)
                </span>
              </div>
            </div>

            {/* Reviews List */}
            {loading ? (
              <div className="text-center py-12 text-gray-500">
                Loading reviews...
              </div>
            ) : reviews.length > 0 ? (
              <div className="divide-y divide-gray-200">
                {reviews.map((review) => (
                  <ReviewItem key={review._id} review={review} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-gray-500 text-lg">No reviews yet</p>
                <p className="text-sm text-gray-400 mt-2">
                  Your first review will appear here once a customer leaves
                  feedback.
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
