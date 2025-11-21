'use client';

import React, { useState } from 'react';
import Header from '@/app/components/header/Header';
import { ArrowLeft } from 'lucide-react';
import Image from 'next/image';

export default function BuyCoinsForSellers() {
  const [amount, setAmount] = useState('');
  const minAmount = 500;
  const coinsReceived = amount ? Math.floor(Number(amount) / 50) * 10 : 0;
  const isBelowMinimum = amount && Number(amount) < minAmount;

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-xl mx-auto px-4 py-6">
          {/* Back Button & Title */}
          <div className="flex items-center gap-4 mb-8">
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-semibold">Buy Coins</h1>
          </div>

          {/* Main Card */}
          <div className="bg-white rounded-3xl p-6 space-y-8">
            {/* Coin Rate */}
            <div className="bg-gray-50 rounded-2xl py-4 text-center">
              <div className="flex items-center justify-center gap-3 text-lg">
                <Image
                  src="/svgs/coin-1.svg"
                  alt="coins"
                  height={50}
                  width={50}
                />
                <span className="font-medium">10 coins = ₦500</span>
              </div>
            </div>

            {/* Amount Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enter Amount
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Amount"
                className="w-full px-4 py-4 border border-gray-300 rounded-2xl text-center text-lg font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {isBelowMinimum && (
                <p className="text-red-500 text-xs mt-2 text-center">
                  Minimum ₦500
                </p>
              )}
            </div>

            {/* You Will Receive */}
            <div className="bg-gray-50 rounded-2xl py-6 text-center">
              <p className="text-sm text-gray-600 mb-3">You will receive</p>
              <div className="flex items-center justify-center gap-3">
                <Image
                  src="/svgs/coin-1.svg"
                  alt="coins"
                  height={40}
                  width={40}
                />
                <span className="text-3xl font-bold text-gray-900">
                  {coinsReceived}
                </span>
                <span className="text-lg text-gray-600">coins</span>
              </div>
            </div>

            {/* Proceed Button */}
            <button
              disabled={!amount || Number(amount) < minAmount}
              className={`w-full py-4 rounded-2xl font-medium transition ${
                amount && Number(amount) >= minAmount
                  ? 'bg-slate-800 text-white hover:bg-slate-900 cursor-pointer'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Proceed
            </button>
          </div>
        </div>
      </div>
    </>
  );
}