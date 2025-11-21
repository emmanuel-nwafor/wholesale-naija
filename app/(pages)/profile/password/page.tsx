// app/profile/password/page.tsx
"use client";
import React, { useState, useEffect } from 'react';
import { Menu, Eye, EyeOff } from 'lucide-react';
import Header from '@/app/components/header/Header';
import BuyersProfileSidebar from '@/app/components/sidebar/BuyersProfileSidebar';

export default function ProfilePasswordPage() {
  const [isMobile, setIsMobile] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  return (
    <>
      <Header />

      <div className="flex min-h-screen bg-gray-50">
        <div className="flex-1 flex flex-col">
          <main className="flex-1 p-4 md:p-8">
            <div className="max-w-5xl mx-auto">
              {/* Mobile Menu Trigger */}
              {isMobile && (
                <button
                  onClick={() => setMenuOpen(true)}
                  className="mb-6 flex items-center gap-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-xl p-3"
                >
                  <Menu className="w-5 h-5" />
                  Menu
                </button>
              )}

              <div className="flex flex-col lg:flex-row gap-8">
                {/* Mobile Sidebar */}
                {isMobile && (
                  <BuyersProfileSidebar
                    isMobile={true}
                    isOpen={menuOpen}
                    setIsOpen={setMenuOpen}
                  />
                )}

                {/* Desktop Sidebar */}
                {!isMobile && (
                  <BuyersProfileSidebar isMobile={false} isOpen={true} setIsOpen={() => {}} />
                )}

                {/* Main Content */}
                <div className="flex-1 rounded-3xl p-6 md:p-8">
                  <h1 className="text-xl font-bold mb-8">Change Password</h1>

                  <div className="space-y-6 max-w-lg">
                    {/* Current Password */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Current Password
                      </label>
                      <div className="relative">
                        <input
                          type={showOld ? 'text' : 'password'}
                          placeholder="••••••••"
                          className="w-full px-5 py-4 pr-14 border border-gray-200 rounded-xl outline-none text-base placeholder:text-gray-400 focus:border-gray-400"
                        />
                        <button
                          type="button"
                          onClick={() => setShowOld(!showOld)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        >
                          {showOld ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>

                    {/* New Password */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        New Password
                      </label>
                      <div className="relative">
                        <input
                          type={showNew ? 'text' : 'password'}
                          placeholder="••••••••"
                          className="w-full px-5 py-4 pr-14 border border-gray-200 rounded-xl outline-none text-base placeholder:text-gray-400 focus:border-gray-400"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNew(!showNew)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        >
                          {showNew ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>

                    {/* Confirm New Password */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Confirm New Password
                      </label>
                      <div className="relative">
                        <input
                          type={showConfirm ? 'text' : 'password'}
                          placeholder="••••••••"
                          className="w-full px-5 py-4 pr-14 border border-gray-200 rounded-xl outline-none text-base placeholder:text-gray-400 focus:border-gray-400"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirm(!showConfirm)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        >
                          {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>

                    {/* Save Button */}
                    <div className="flex justify-end pt-6">
                      <button className="px-8 py-4 bg-slate-900 text-white rounded-xl hover:cursor-pointer font-medium hover:bg-slate-800 transition">
                        Save Changes
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}