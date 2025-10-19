'use client';

import React from 'react';
import Link from 'next/link';
import { X, ChevronRight } from 'lucide-react';

export default function Sidebar({ isOpen, setIsOpen }) {
  return (
    <>
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out w-80 bg-white shadow-lg flex flex-col h-full md:hidden ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center space-x-2">
            <img 
              src="https://res.cloudinary.com/dqtjja88b/image/upload/v1760219419/Screenshot_2025-10-11_224658_q8bjy2.png" 
              alt="Wholesale Naija" 
              className="h-8" 
            />
            <span className="text-xl font-bold text-green-600">Wholesale Naija</span>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Auth Buttons */}
        <div className="p-4 space-y-2">
          <Link href="/login">
            <button className="w-full py-3 px-4 border border-gray-300 rounded-md text-gray-700 font-medium hover:bg-gray-50">
              Login
            </button>
          </Link>
          <Link href="/signup">
            <button className="w-full py-3 px-4 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700">
              Create Account
            </button>
          </Link>
        </div>

        {/* Categories */}
        <div className="flex-1 p-4 overflow-y-auto">
          <h3 className="text-lg font-semibold mb-4">Categories</h3>
          <ul className="space-y-2">
            <li>
              <Link
                href="/category/phones"
                className="flex items-center justify-between w-full py-3 px-2 rounded-md hover:bg-gray-100"
                onClick={() => setIsOpen(false)}
              >
                <span>Phones & Tablets</span>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </Link>
            </li>
            <li>
              <Link
                href="/category/computers"
                className="flex items-center justify-between w-full py-3 px-2 rounded-md hover:bg-gray-100"
                onClick={() => setIsOpen(false)}
              >
                <span>Computers & Accessories</span>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </Link>
            </li>
            {/* Add more */}
          </ul>
        </div>
      </div>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}