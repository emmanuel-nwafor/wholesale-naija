"use client";
import React from "react";
import { Lock, MessageCircle, ShoppingBag, Star } from "lucide-react";

export default function StoreAnalytics(): React.JSX.Element {
  const data = {
    unlocks: 11,
    newMessages: 12,
    products: 56,
    avgRating: 4.5,
  };

  return (
    <>
      <h1 className="m-2 text-gray-700 font-semibold">Analytics</h1>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Unlocks */}
        <div className="bg-white rounded-xl p-6 border border-gray-100 flex justify-between items-center">
          <div className="flex-1">
            <p className="text-xs text-gray-600">Unlocks</p>
            <p className="text-xl font-bold text-gray-900 mt-1">{data.unlocks}</p>
          </div>
          <Lock className="w-6 h-6 text-gray-700" />
        </div>

        {/* New Messages */}
        <div className="bg-white rounded-xl p-6 border border-gray-100 flex justify-between items-center">
          <div className="flex-1">
            <p className="text-xs text-gray-600">New Messages</p>
            <p className="text-xl font-bold text-gray-900 mt-1">{data.newMessages}</p>
          </div>
          <MessageCircle className="w-6 h-6 text-green-600" />
        </div>

        {/* Products */}
        <div className="bg-white rounded-xl p-6 border border-gray-100 flex justify-between items-center">
          <div className="flex-1">
            <p className="text-xs text-gray-600">Products</p>
            <p className="text-xl font-bold text-gray-900 mt-1">{data.products}</p>
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