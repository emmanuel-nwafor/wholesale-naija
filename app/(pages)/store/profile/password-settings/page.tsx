"use client";
import React, { useState, useEffect } from 'react';
import { Menu, Eye, EyeOff } from 'lucide-react';
import StoreSidebar from '@/app/components/sidebar/StoreSidebar';
import DashboardHeader from '@/app/components/header/DashboardHeader';
import ProfileSidebar from '@/app/components/sidebar/SellersProfileSidebar';

export default function ProfilePasswordSetting() {
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
    <div className="flex min-h-screen">
      <StoreSidebar />
      <div className="flex-1 flex flex-col">
        <DashboardHeader />
        <main className="flex-1 md:ml-64 p-4 md:p-8 bg-gray-50">
          <div className="max-w-5xl">
            {isMobile && (
              <button
                onClick={() => setMenuOpen(true)}
                className="mb-6 hover:bg-gray-100 rounded-xl p-2 flex items-center gap-2 text-sm font-medium text-gray-700"
              >
                <Menu className="w-4 h-4" /> Password Settings
              </button>
            )}

            <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
              <div className="lg:w-64">
                <ProfileSidebar isMobile={isMobile} isOpen={menuOpen} setIsOpen={setMenuOpen} />
              </div>

              <div className="flex-1 bg-white rounded-2xl p-6">
                <h1 className="text-xl font-semibold mb-6">Change Passwords</h1>

                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type={showOld ? 'text' : 'password'}
                        placeholder="••••••••"
                        className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-2xl outline-none text-sm placeholder:text-gray-400"
                      />
                      <button
                        type="button"
                        onClick={() => setShowOld(!showOld)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showOld ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showNew ? 'text' : 'password'}
                        placeholder="••••••••"
                        className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-2xl outline-none text-sm placeholder:text-gray-400"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNew(!showNew)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showNew ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirm ? 'text' : 'password'}
                        placeholder="Olamide1234"
                        className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-2xl outline-none text-sm placeholder:text-gray-400"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirm(!showConfirm)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-end pt-4">
                    <button className="px-6 py-3 bg-slate-900 text-white rounded-full text-sm font-medium hover:bg-slate-800 transition">
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
  );
}