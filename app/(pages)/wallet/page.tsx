'use client';

import React from 'react';
import Header from '@/app/components/header/Header';
import Link from 'next/link';
import Image from 'next/image';

export default function BuyersWallet() {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50">
        {/* <h1 className="">Buy Coins</h1> */}
        <div className="max-w-2xl mx-auto px-4 py-8">
          {/* Wallet Balance Card */}
          <div className="bg-white rounded-xl p-8 text-center">
            <p className="text-sm text-gray-600 mb-4">Wallet Balance</p>

            <div className="flex items-center justify-center gap-3 mb-6">
              <Image
                src={'/svgs/coin-1.svg'}
                alt="coins"
                height={50}
                width={50}
              />
              <span className="text-5xl font-bold text-gray-900">115</span>
            </div>

            <Link href={`/wallet/buy-coins`}>
              <button className="hover:cursor-pointer w-full max-w-xs mx-auto bg-slate-900 text-white py-4 rounded-2xl font-medium hover:bg-slate-800 transition">
                Buy Coins
              </button>
            </Link>
          </div>

          {/* Coin Rate */}
          <div className="mt-4 p-6 bg-white rounded-xl">
            <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
              <Image
                src={'/svgs/coin-1.svg'}
                alt="coins"
                height={20}
                width={20}
              />
              <span>10 coins = ₦500</span>
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="mt-8">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Recent Transactions
            </h2>

            <div className="bg-white rounded-3xl shadow-sm p-12 text-center">
              <div className="flex justify-center mb-6">
                <div className="flex items-center justify-center">
                  <Image
                    src={'/svgs/emptyState-wholesale-svg.svg'}
                    alt="coins"
                    height={150}
                    width={150}
                  />
                </div>
              </div>

              <p className="text-gray-500 text-sm">
                No transactions yet. Your purchases and unlocks will appear
                here.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
