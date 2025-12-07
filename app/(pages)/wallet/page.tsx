'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/app/components/header/Header';
import DynamicHeader from '@/app/components/header/DynamicHeader';
import Link from 'next/link';
import Image from 'next/image';
import { fetchWithToken } from '@/app/utils/fetchWithToken';
import { format } from 'date-fns';

interface Transaction {
  _id: string;
  type: 'CREDIT' | 'DEBIT';
  reason: string;
  amount: number;
  createdAt: string;
}

interface WalletData {
  wallet: {
    balance: number;
  };
  transactions: Transaction[];
}

export default function Wallet() {
  const [walletData, setWalletData] = useState<WalletData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchWallet = async () => {
      try {
        const data = await fetchWithToken<WalletData>('/wallet');
        setWalletData(data);
      } catch (err) {
        console.error('Failed to fetch wallet:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchWallet();
  }, []);

  const balance = walletData?.wallet.balance ?? 0;
  const transactions = walletData?.transactions ?? [];

  return (
    <>
      <Header />
      <DynamicHeader />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-2xl mx-auto px-4 py-8">
          {/* Wallet Balance Card */}
          <div className="bg-white rounded-xl p-8 text-center shadow-sm">
            <p className="text-sm text-gray-600 mb-4">Wallet Balance</p>

            <div className="flex items-center justify-center gap-3 mb-6">
              <Image
                src="/svgs/coin-1.svg"
                alt="coins"
                height={50}
                width={50}
              />
              {loading ? (
                <span className="text-5xl font-bold text-gray-900 animate-pulse">
                  ...
                </span>
              ) : (
                <span className="text-5xl font-bold text-gray-900">
                  {balance}
                </span>
              )}
            </div>

            <Link href="/wallet/buy-coins">
              <button className="w-full max-w-xs mx-auto hover:cursor-pointer bg-slate-900 text-white py-4 rounded-2xl font-medium hover:bg-slate-800 transition">
                Buy Coins
              </button>
            </Link>
          </div>

          {/* Coin Rate */}
          <div className="mt-4 p-6 bg-white rounded-xl shadow-sm">
            <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
              <Image
                src="/svgs/coin-1.svg"
                alt="coins"
                height={20}
                width={20}
              />
              <span>1 coins = ₦500</span>
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="mt-8">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Recent Transactions
            </h2>

            {loading ? (
              <div className="bg-white rounded-3xl shadow-sm p-12 text-center">
                <p className="text-gray-500">Loading transactions...</p>
              </div>
            ) : error ? (
              <div className="bg-white rounded-3xl shadow-sm p-12 text-center">
                <p className="text-red-600">Failed to load transactions</p>
              </div>
            ) : transactions.length === 0 ? (
              <div className="bg-white rounded-3xl shadow-sm p-12 text-center">
                <div className="flex justify-center mb-6">
                  <Image
                    src="/svgs/emptyState-wholesale-svg.svg"
                    alt="No transactions"
                    height={150}
                    width={150}
                  />
                </div>
                <p className="text-gray-500 text-sm">
                  No transactions yet. Your purchases and unlocks will appear
                  here.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {transactions.map((tx) => (
                  <div
                    key={tx._id}
                    className="bg-white rounded-2xl p-4 flex items-center justify-between shadow-sm hover:shadow transition"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          tx.type === 'CREDIT' ? 'bg-green-100' : 'bg-red-100'
                        }`}
                      >
                        <span
                          className={`text-lg font-bold ${tx.type === 'CREDIT' ? 'text-green-600' : 'text-red-600'}`}
                        >
                          {tx.type === 'CREDIT' ? '+' : '−'}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {tx.reason === 'UNLOCK_SELLER' && 'Store Unlocked'}
                          {tx.reason === 'SIGNUP_BONUS' && 'Welcome Bonus'}
                          {tx.reason.includes('PURCHASE') && 'Coins Purchased'}
                        </p>
                        <p className="text-xs text-gray-500">
                          {format(
                            new Date(tx.createdAt),
                            'dd MMM yyyy, h:mm a'
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p
                        className={`font-bold ${tx.type === 'CREDIT' ? 'text-green-600' : 'text-red-600'}`}
                      >
                        {tx.type === 'CREDIT' ? '+' : '−'}
                        {tx.amount}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
