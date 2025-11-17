"use client";
import React, { useEffect, useState } from "react";
import { Lock, MessageCircle, ShoppingBag, Star } from "lucide-react";
import { fetchWithToken } from "../../utils/fetchWithToken";

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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await fetchWithToken<DashboardData>("/v1/seller/dashboard");
        setData({
          totalUnlocks: res.totalUnlocks,
          messagesCount: res.messagesCount,
          productsCount: res.productsCount,
          avgRating: res.avgRating ?? 0,
        });
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Failed to fetch analytics");
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) return <p className="m-2 text-gray-500">Loading analytics...</p>;
  if (error) return <p className="m-2 text-red-500">Error: {error}</p>;

  return (
    <>
      <h1 className="m-2 text-gray-700 font-semibold">Analytics</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Unlocks */}
        <div className="bg-white rounded-xl p-6 border border-gray-100 flex justify-between items-center">
          <div className="flex-1">
            <p className="text-xs text-gray-600">Unlocks</p>
            <p className="text-xl font-bold text-gray-900 mt-1">{data.totalUnlocks}</p>
          </div>
          <Lock className="w-6 h-6 text-gray-700" />
        </div>

        {/* New Messages */}
        <div className="bg-white rounded-xl p-6 border border-gray-100 flex justify-between items-center">
          <div className="flex-1">
            <p className="text-xs text-gray-600">New Messages</p>
            <p className="text-xl font-bold text-gray-900 mt-1">{data.messagesCount}</p>
          </div>
          <MessageCircle className="w-6 h-6 text-green-600" />
        </div>

        {/* Products */}
        <div className="bg-white rounded-xl p-6 border border-gray-100 flex justify-between items-center">
          <div className="flex-1">
            <p className="text-xs text-gray-600">Products</p>
            <p className="text-xl font-bold text-gray-900 mt-1">{data.productsCount}</p>
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
