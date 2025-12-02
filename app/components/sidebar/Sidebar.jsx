'use client';

import React from 'react';
import Link from 'next/link';
import { X, ChevronRight } from 'lucide-react';

export default function Sidebar({ isOpen, setIsOpen }) {
  return (
    <>
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out w-full sm:w-80 bg-white shadow-lg flex flex-col h-full md:hidden ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-3 sm:p-4 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <img
              src="https://res.cloudinary.com/dqtjja88b/image/upload/v1760218941/wholesaleNaija-removebg-preview_tkw3tv.png"
              alt="Wholesale Naija"
              className="h-10 sm:h-14"
            />
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-500 hover:text-gray-700 p-1 sm:p-2"
          >
            <X className="w-5 sm:w-6 h-5 sm:h-6" />
          </button>
        </div>

        {/* Auth Buttons */}
        <div className="p-3 sm:p-4 space-y-2">
          <Link href="/login">
            <button className="w-full m-1 px-3 sm:px-4 py-3 border border-gray-300 bg-white text-gray-700 rounded-xl sm:rounded-2xl font-medium hover:bg-gray-50 transition text-sm sm:text-base">
              Login
            </button>
          </Link>
          <Link href="/signup">
            <button className="w-full m-1 px-3 sm:px-4 py-3 bg-black text-white rounded-xl sm:rounded-2xl font-semibold hover:bg-gray-900 transition text-sm sm:text-base">
              Create Account
            </button>
          </Link>
        </div>

        {/* Categories */}
        <div className="flex-1 p-3 sm:p-4 overflow-y-auto">
          <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">
            Categories
          </h3>
          <ul className="space-y-2">
            <li>
              <Link
                href="/category/phones"
                className="flex items-center justify-between w-full py-2 sm:py-3 px-2 rounded-md hover:bg-gray-100 text-sm sm:text-base"
                onClick={() => setIsOpen(false)}
              >
                <span>Phones & Tablets</span>
                <ChevronRight className="w-4 sm:w-5 h-4 sm:h-5 text-gray-400" />
              </Link>
            </li>
            <li>
              <Link
                href="/category/computers"
                className="flex items-center justify-between w-full py-2 sm:py-3 px-2 rounded-md hover:bg-gray-100 text-sm sm:text-base"
                onClick={() => setIsOpen(false)}
              >
                <span>Computers & Accessories</span>
                <ChevronRight className="w-4 sm:w-5 h-4 sm:h-5 text-gray-400" />
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
