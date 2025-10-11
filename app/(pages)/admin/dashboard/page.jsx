"use client"

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, ShoppingCart, AlertTriangle, DollarSign, TrendingUp } from 'lucide-react';

const data = [
  { name: '1', value: 100 },
  { name: '2', value: 200 },
  { name: '3', value: 150 },
  { name: '4', value: 300 },
  { name: '5', value: 250 },
  { name: '6', value: 180 },
  { name: '7', value: 220 },
  { name: '8', value: 190 },
  { name: '9', value: 160 },
  { name: '10', value: 280 },
];

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans text-gray-800">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg text-center shadow-sm">
          <Users className="mx-auto mb-2 h-8 w-8 text-blue-500" />
          <div className="text-4xl font-bold text-blue-600">0</div>
          <div className="text-sm text-gray-600">Total Users</div>
        </div>
        <div className="bg-white p-6 rounded-lg text-center shadow-sm">
          <ShoppingCart className="mx-auto mb-2 h-8 w-8 text-blue-500" />
          <div className="text-4xl font-bold text-blue-600">0</div>
          <div className="text-sm text-gray-600">Total Cart Purchases</div>
        </div>
        <div className="bg-white p-6 rounded-lg text-center shadow-sm">
          <AlertTriangle className="mx-auto mb-2 h-8 w-8 text-blue-500" />
          <div className="text-4xl font-bold text-blue-600">0</div>
          <div className="text-sm text-gray-600">Pending Reports</div>
        </div>
        <div className="bg-white p-6 rounded-lg text-center shadow-sm">
          <DollarSign className="mx-auto mb-2 h-8 w-8 text-blue-500" />
          <div className="text-4xl font-bold text-blue-600">0</div>
          <div className="text-sm text-gray-600">Total Revenue</div>
        </div>
      </div>

      {/* Total Transactions Chart */}
      <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Total Transactions</h2>
          <select className="px-3 py-1 border border-gray-300 rounded-md">
            <option>Last 30 days</option>
          </select>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#007bff" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Product Approval and Verification Request */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold">Product Approval</h3>
            <button className="text-blue-600 text-sm font-medium">View all →</button>
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <img src="https://via.placeholder.com/50x100?text=iPhone" alt="iPhone 16 Pro Max" className="w-12 h-24" />
              <div>
                <div>iPhone 16 Pro Max</div>
                <div className="text-sm text-gray-600">₹1,00,000</div>
              </div>
              <div className="ml-auto flex gap-2">
                <button className="px-4 py-1 bg-green-500 text-white rounded-md">Approve</button>
                <button className="px-4 py-1 bg-red-500 text-white rounded-md">Reject</button>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <img src="https://via.placeholder.com/50x100?text=iPhone" alt="iPhone" className="w-12 h-24" />
              <div>
                <div>iPhone 16 Pro</div>
                <div className="text-sm text-gray-600">₹90,000</div>
              </div>
              <div className="ml-auto flex gap-2">
                <button className="px-4 py-1 bg-green-500 text-white rounded-md">Approve</button>
                <button className="px-4 py-1 bg-red-500 text-white rounded-md">Reject</button>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <img src="https://via.placeholder.com/50x100?text=iPhone" alt="iPhone" className="w-12 h-24" />
              <div>
                <div>iPhone 15 Pro Max</div>
                <div className="text-sm text-gray-600">₹80,000</div>
              </div>
              <div className="ml-auto flex gap-2">
                <button className="px-4 py-1 bg-green-500 text-white rounded-md">Approve</button>
                <button className="px-4 py-1 bg-red-500 text-white rounded-md">Reject</button>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold">Verification Request</h3>
            <button className="text-blue-600 text-sm font-medium">View all →</button>
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">AB</div>
              <div>Absolute Johannes</div>
              <div className="ml-auto flex gap-2">
                <button className="px-4 py-1 bg-red-500 text-white rounded-md">Reject</button>
                <button className="px-4 py-1 bg-blue-500 text-white rounded-md">Verify</button>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">AB</div>
              <div>Absolute Johannes</div>
              <div className="ml-auto flex gap-2">
                <button className="px-4 py-1 bg-red-500 text-white rounded-md">Reject</button>
                <button className="px-4 py-1 bg-blue-500 text-white rounded-md">Verify</button>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">AB</div>
              <div>Absolute Johannes</div>
              <div className="ml-auto flex gap-2">
                <button className="px-4 py-1 bg-red-500 text-white rounded-md">Reject</button>
                <button className="px-4 py-1 bg-blue-500 text-white rounded-md">Verify</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Purchases and Active Banners */}
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold">Recent Purchases</h3>
            <button className="text-blue-600 text-sm font-medium">View all →</button>
          </div>
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-left">Amount</th>
                <th className="px-4 py-2 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-4 py-2">Johannes</td>
                <td className="px-4 py-2">₹10,000</td>
                <td className="px-4 py-2">
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">Success</span>
                </td>
              </tr>
              <tr>
                <td className="px-4 py-2">Johannes</td>
                <td className="px-4 py-2">₹10,000</td>
                <td className="px-4 py-2">
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">Success</span>
                </td>
              </tr>
              <tr>
                <td className="px-4 py-2">Johannes</td>
                <td className="px-4 py-2">₹10,000</td>
                <td className="px-4 py-2">
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">Success</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold">Active Banners</h3>
            <button className="text-blue-600 text-sm font-medium">View all →</button>
          </div>
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-2 text-left">Banner Title</th>
                <th className="px-4 py-2 text-left">Device</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-4 py-2">Start Banner</td>
                <td className="px-4 py-2">
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">Mobile</span>
                </td>
              </tr>
              <tr>
                <td className="px-4 py-2">Start Banner</td>
                <td className="px-4 py-2">
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">Mobile</span>
                </td>
              </tr>
              <tr>
                <td className="px-4 py-2">Start Banner</td>
                <td className="px-4 py-2">
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">Mobile</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}