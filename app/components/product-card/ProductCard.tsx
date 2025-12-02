'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Star, Verified } from 'lucide-react';
import Link from 'next/link';
import { fetchWithToken } from '@/app/utils/fetchWithToken';

interface ProductCardProps {
  loading?: boolean;
  product?: {
    _id: string;
    name: string;
    price: number;
    images: string[];
    moq?: string;
    verified?: boolean;
    seller?: {
      _id?: string;
      fullName?: string;
    };
  };
}

// Mask seller name
function maskName(name?: string) {
  if (!name || name.trim() === "") return "AB******";
  const clean = name.replace(/\s+/g, "");
  if (clean.length <= 2) return clean;
  return clean.slice(0, 2) + "*****";
}

export default function ProductCard({ product, loading = false }: ProductCardProps) {
  const [imgError, setImgError] = useState(false);
  const [avgRating, setAvgRating] = useState<number | null>(null);
  const [reviewsCount, setReviewsCount] = useState<number>(0);

  // Show shimmer when loading
  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="aspect-square rounded-xl bg-gray-200"></div>
        <div className="mt-4 space-y-3">
          <div className="w-3/4 h-4 bg-gray-200 rounded"></div>
          <div className="w-1/2 h-4 bg-gray-200 rounded"></div>
          <div className="flex justify-between mt-3">
            <div className="w-20 h-3 bg-gray-200 rounded"></div>
            <div className="w-12 h-3 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) return null;
  const p = product;
  const isVerifiedSeller = p.verified === true;

  // Determine correct image
  const mainImage =
    imgError || !p.images?.[0] || p.images[0].trim() === ""
      ? "https://i.pinimg.com/736x/51/5f/c5/515fc584baa97d0aae930bc6161a864f.jpg"
      : p.images[0];

  // Fetch seller reviews & average rating
  useEffect(() => {
    if (!p.seller?._id) return;

    const fetchReviews = async () => {
      try {
        const res = await fetchWithToken<{ reviews?: any[]; avgRating?: number | null }>(
          `/v1/sellers/${p.seller?._id}/reviews`
        );
        setAvgRating(res?.avgRating ?? null);
        setReviewsCount(res?.reviews?.length ?? 0);
      } catch (err) {
        console.error('Failed to fetch seller reviews:', err);
        setAvgRating(null);
        setReviewsCount(0);
      }
    };

    fetchReviews();
  }, [p.seller?._id]);

  return (
    <Link href={`/product/${p._id}`}>
      <div className="overflow-hidden hover:cursor-pointer z-10">
        {/* Image */}
        <div className="aspect-square bg-gray-100 rounded-xl flex items-center justify-center">
          <Image
            src={mainImage}
            alt={p.name}
            width={300}
            height={300}
            className="w-full h-full object-cover rounded-xl"
            onError={() => setImgError(true)}
          />
        </div>

        {/* Info */}
        <div className="mt-4 space-y-2">
          <h3 className="text-base font-medium text-gray-900 line-clamp-2">
            {p.name}
          </h3>

          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-gray-900">
              ₦{p.price.toLocaleString()}
            </span>
          </div>

          <div className="flex-col items-center justify-between">
            <p className="text-xs text-gray-500">MOQ: {p.moq || "N/A"}</p>

            <div className="flex items-center justify-between mt-3">
              <span className="flex text-xs text-gray-400 items-center gap-1">
                {maskName(p.seller?.fullName)}
                {isVerifiedSeller && <Verified className="w-4 h-4 text-green-500" />}
              </span>

              <div className="flex items-center gap-1">
                {reviewsCount === 0 ? (
                  <span className="text-xs text-gray-400 flex items-center gap-1">
                    <span className="text-xs text-gray-400">0</span>
                    <span className="text-xs text-gray-400">(0)</span>
                    <Star className="w-3 h-3 fill-current text-yellow-500" />
                  </span>
                ) : (
                  <>
                    <span className="text-xs text-gray-400">{(avgRating ?? 0).toFixed(1)}</span>
                    <span className="text-xs text-gray-400">({reviewsCount})</span>
                    <Star className="w-3 h-3 fill-current text-yellow-500" />
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
