'use client';

import React from 'react';
import Header from '@/app/components/header/Header';
import { Coins, Store, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';

interface Transaction {
  id: string;
  type: 'purchase' | 'unlock' | 'failed';
  title: string;
  date: Date;
  coins: number;
}

const transactions: Transaction[] = [
  // Today
  { id: '1', type: 'purchase', title: 'Coins Purchased', date: new Date(2025, 5, 29, 11, 29), coins: 150 },
  { id: '2', type: 'unlock', title: 'Store Unlock', date: new Date(2025, 5, 29, 11, 23), coins: -10 },
  { id: '3', type: 'purchase', title: 'Coins Purchased', date: new Date(2025, 5, 29, 11, 20), coins: 50 },
  { id: '4', type: 'unlock', title: 'Store Unlock', date: new Date(2025, 5, 29, 11, 15), coins: -10 },
  { id: '5', type: 'failed', title: 'Coins Purchase Failed', date: new Date(2025, 5, 29, 11, 10), coins: 0 },
  { id: '6', type: 'purchase', title: 'Coins Purchased', date: new Date(2025, 5, 29, 11, 5), coins: 150 },

  // August 26, 2025
  { id: '7', type: 'purchase', title: 'Coins Purchased', date: new Date(2025, 7, 26, 14, 30), coins: 150 },
  { id: '8', type: 'unlock', title: 'Store Unlock', date: new Date(2025, 7, 26, 13, 45), coins: -10 },
  { id: '9', type: 'purchase', title: 'Coins Purchased', date: new Date(2025, 7, 26, 12, 20), coins: 150 },
  { id: '10', type: 'unlock', title: 'Store Unlock', date: new Date(2025, 7, 26, 11, 10), coins: -10 },
  { id: '11', type: 'failed', title: 'Coins Purchase Failed', date: new Date(2025, 7, 26, 10, 5), coins: 0 },
  { id: '12', type: 'purchase', title: 'Coins Purchased', date: new Date(2025, 7, 26, 9, 30), coins: 150 },
];

export default function BuyersTransactionsPage() {
  const groupByDate = () => {
    const groups: { [key: string]: Transaction[] } = {};
    transactions.forEach(t => {
      const dateKey = format(t.date, 'MMMM d, yyyy');
      const label = t.date.toDateString() === new Date().toDateString() ? 'Today' : dateKey;
      if (!groups[label]) groups[label] = [];
      groups[label].push(t);
    });
    return groups;
  };

  const groupedTransactions = groupByDate();

  const getIcon = (type: string) => {
    if (type === 'purchase') return <Coins className="w-5 h-5 text-yellow-500" />;
    if (type === 'unlock') return <Store className="w-5 h-5 text-blue-500" />;
    return <AlertCircle className="w-5 h-5 text-red-500" />;
  };

  const getCoinsText = (coins: number, type: string) => {
    if (type === 'failed') return <span className="text-red-500">0 Coins</span>;
    if (coins > 0) return <span className="text-green-600">+{coins} Coins</span>;
    return <span className="text-red-600">{coins} Coins</span>;
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Filters */}
          <div className="flex sm:flex-row gap-4 mb-8">
            <select className="px-14 py-3 bg-white border border-gray-200 rounded-xl text-sm">
              <option>Transaction Type</option>
            </select>
            <select className="px-14 py-3 bg-white border border-gray-200 rounded-xl text-sm">
              <option>All Status</option>
            </select>
          </div>

          {/* Transactions List */}
          <div className="space-y-8">
            {Object.entries(groupedTransactions).map(([dateLabel, items]) => (
              <div key={dateLabel}>
                <h3 className="text-sm font-medium text-gray-500 bg-gray-100 px-4 py-2 rounded-xl mb-4">
                  {dateLabel}
                </h3>
                <div className="bg-white rounded-2xl shadow-sm divide-y divide-gray-100">
                  {items.map((tx) => (
                    <div key={tx.id} className="px-6 py-5 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center">
                          {getIcon(tx.type)}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{tx.title}</p>
                          <p className="text-xs text-gray-500">
                            {format(tx.date, 'h:mm a, MMM d, yyyy')}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">
                          {getCoinsText(tx.coins, tx.type)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}