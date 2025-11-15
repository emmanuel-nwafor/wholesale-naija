import React from 'react';

export default function NewsLetter() {
  return (
    <div className="bg-white py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-left">
            <h3 className="text-xl font-bold text-gray-900">Join Our Newsletter</h3>
            <p className="text-sm text-gray-600 mt-1">
              By subscribing you agree to our Terms & Conditions and Privacy & Cookies Policy.
            </p>
          </div>
          <form className="flex w-full md:w-auto gap-2">
            <input
              type="email"
              placeholder="example@email.com"
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-gray-900"
            />
            <button
              type="submit"
              className="px-6 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}