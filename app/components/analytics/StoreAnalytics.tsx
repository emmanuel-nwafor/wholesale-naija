'use client';
import React, { useEffect, useState } from 'react';
import { Lock, MessageCircle, ShoppingBag, Star } from 'lucide-react';
import { fetchWithToken } from '../../utils/fetchWithToken';

interface DashboardData {
  totalUnlocks: number;
  messagesCount: number;
  productsCount: number;
  avgRating: number | null;
}

export default function StoreAnalytics(): React.JSX.Element {
  const [data, setData] = useState<DashboardData>({
    totalUnlocks: 0,
    messagesCount: 0,
    productsCount: 0,
    avgRating: null,
  });
  const [loading, setLoading] = useState(true);
  const [tokenMissing, setTokenMissing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await fetchWithToken<DashboardData>('/v1/seller/dashboard');

        if (!res) {
          setTokenMissing(true);
          return;
        }

        setData({
          totalUnlocks: res.totalUnlocks,
          messagesCount: res.messagesCount,
          productsCount: res.productsCount,
          avgRating: res.avgRating ?? 0,
        });
      } catch (error: unknown) { // FIX: Changed 'err: any' to 'error: unknown' (L40)
        console.error(error);
        const message = error instanceof Error
          ? error.message
          : 'Unable to load analytics.';
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  // Shimmer skeleton loader
  if (loading) {
    return (
      <>
        <h1 className="m-2 text-gray-700 font-semibold">Analytics</h1>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-white rounded-xl p-6 border border-gray-100 animate-pulse"
            >
              <div className="h-3 w-16 bg-gray-200 rounded"></div>
              <div className="h-6 w-10 bg-gray-300 rounded mt-3"></div>
            </div>
          ))}
        </div>
      </>
    );
  }

  if (tokenMissing) {
    return (
      <div className="p-4 mt-4 bg-yellow-50 border border-yellow-200 rounded-xl text-yellow-800">
        <p className="text-sm font-medium">Authentication Required</p>
        <p className="text-xs mt-1">
          You are not logged in. Please sign in again to view your analytics.
        </p>
      </div>
    );
  }

  // Better error handling UI
  if (error) {
    return (
      <div className="p-4 mt-4 bg-red-50 border border-red-200 rounded-xl text-red-600">
        <p className="text-sm font-medium">Failed to load analytics</p>
        <p className="text-xs mt-1">{error}</p>
      </div>
    );
  }

  return (
    <>
      <h1 className="m-2 text-gray-700 font-semibold">Analytics</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Unlocks */}
        <div className="bg-white rounded-xl p-6 border border-gray-100 flex justify-between items-center">
          <div className="flex-1">
            <p className="text-xs text-gray-600">Unlocks</p>
            <p className="text-xl font-bold text-gray-900 mt-1">
              {data.totalUnlocks}
            </p>
          </div>
          <Lock className="w-6 h-6 text-gray-700" />
        </div>

        {/* New Messages */}
        <div className="bg-white rounded-xl p-6 border border-gray-100 flex justify-between items-center">
          <div className="flex-1">
            <p className="text-xs text-gray-600">New Messages</p>
            <p className="text-xl font-bold text-gray-900 mt-1">
              {data.messagesCount}
            </p>
          </div>
          <MessageCircle className="w-6 h-6 text-green-600" />
        </div>

        {/* Products */}
        <div className="bg-white rounded-xl p-6 border border-gray-100 flex justify-between items-center">
          <div className="flex-1">
            <p className="text-xs text-gray-600">Products</p>
            <p className="text-xl font-bold text-gray-900 mt-1">
              {data.productsCount}
            </p>
          </div>
          <ShoppingBag className="w-6 h-6 text-blue-600" />
        </div>

        {/* Avg. Rating */}
        <div className="bg-white rounded-xl p-6 border border-gray-100 flex justify-between items-center">
          <div className="flex-1">
            <p className="text-xs text-gray-600">Avg. Rating</p>
            <p className="text-xl font-bold text-gray-900 mt-1 flex items-center gap-1">
              {data.avgRating}
              <Star className="w-5 h-5 text-yellow-500 fill-current" />
            </p>
          </div>
        </div>
      </div>
    </>
  );
}