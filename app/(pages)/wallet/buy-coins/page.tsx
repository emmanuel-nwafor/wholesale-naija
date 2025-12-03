'use client';

import React, { useState } from 'react';
import Header from '@/app/components/header/Header';
import DynamicHeader from '@/app/components/header/DynamicHeader';
import { ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { fetchWithToken } from '@/app/utils/fetchWithToken';

export default function BuyCoins() {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const router = useRouter();

  const minAmount = 500;

  // 1 coin = ₦500 → coins = amount / 500
  const coinsReceived = amount ? Math.floor(Number(amount) / 500) : 0;
  const isValidAmount = amount && Number(amount) >= minAmount && Number(amount) % 500 === 0;

  const handleProceed = async () => {
    if (!isValidAmount || loading) return;

    setLoading(true);
    setError('');

    try {
      const response = await fetchWithToken<{
        success: boolean;
        init: {
          status: boolean;
          message: string;
          data: {
            authorization_url: string;
            access_code: string;
            reference: string;
          };
        };
      }>('/wallet/purchase', {
        method: 'POST',
        body: JSON.stringify({
          nairaAmount: Number(amount),
        }),
      });

      if (response?.success && response.init?.data?.authorization_url) {
        window.location.href = response.init.data.authorization_url;
      } else {
        throw new Error(response?.init?.message || 'Payment failed to initialize');
      }
    } catch (err: any) {
      console.error('Payment initiation failed:', err);
      setError(err.message || 'Unable to connect. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <DynamicHeader />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-xl mx-auto px-4 py-6">
          {/* Back Button & Title */}
          <div className="flex items-center gap-4 mb-8">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-gray-100 rounded-full transition"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-semibold">Buy Coins</h1>
          </div>

          {/* Main Card */}
          <div className="bg-white rounded-3xl p-6 space-y-8">
            {/* Coin Rate */}
            <div className="bg-gradient-to-r from-blue-50 to-slate-50 rounded-2xl py-5 text-center border border-gray-200">
              <div className="flex items-center justify-center gap-3 text-lg font-semibold text-amber-900">
                <Image src="/svgs/coin-1.svg" alt="coin" height={50} width={50} />
                <span>1 coin = ₦500</span>
              </div>
            </div>

            {/* Amount Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enter Amount (₦)
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="e.g. 5000"
                min={minAmount}
                step="500"
                disabled={loading}
                className="w-full px-4 py-4 border border-gray-300 rounded-2xl text-center text-lg font-medium focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:bg-gray-50"
              />

              {amount && Number(amount) < minAmount && (
                <p className="text-red-500 text-xs mt-2 text-center">
                  Minimum amount is ₦500
                </p>
              )}
              {amount && Number(amount) % 500 !== 0 && Number(amount) >= minAmount && (
                <p className="text-amber-700 text-xs mt-2 text-center font-medium">
                  Amount must be in multiples of ₦500 (e.g. 500, 1000, 1500...)
                </p>
              )}
            </div>

            {/* You will receive */}
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl py-6 text-center border border-emerald-200">
              <p className="text-sm text-gray-600 mb-3">You will receive</p>
              <div className="flex items-center justify-center gap-4">
                <Image src="/svgs/coin-1.svg" alt="coins" height={56} width={56} />
                <span className="text-5xl font-bold text-gray-700">
                  {coinsReceived}
                </span>
                <span className="text-xl font-medium text-gray-700">
                  {coinsReceived === 1 ? 'coin' : 'coins'}
                </span>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm text-center">
                {error}
              </div>
            )}

            {/* Proceed Button */}
            <button
              onClick={handleProceed}
              disabled={!isValidAmount || loading}
              className={`w-full py-5 rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-3 shadow-lg ${
                isValidAmount && !loading
                  ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Redirecting to Paystack...
                </>
              ) : (
                'Proceed to Pay'
              )}
            </button>

            <p className="text-xs text-gray-500 text-center">
              Secured by Paystack • Instant delivery after payment
            </p>
          </div>
        </div>
      </div>
    </>
  );
}