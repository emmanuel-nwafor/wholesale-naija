"use client";
import React, { useState, useEffect } from 'react';
import { Menu } from 'lucide-react';
import StoreSidebar from '@/app/components/sidebar/StoreSidebar';
import DashboardHeader from '@/app/components/header/DashboardHeader';
import ProfileSidebar from '@/app/components/sidebar/SellersProfileSidebar';

export default function RequestVerificationPage() {
  const [isMobile, setIsMobile] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

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
                <Menu className="w-4 h-4" /> Verification
              </button>
            )}

            <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
              <div className="lg:w-64">
                <ProfileSidebar isMobile={isMobile} isOpen={menuOpen} setIsOpen={setMenuOpen} />
              </div>

              <div className="flex-1 bg-white rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-6">
                  <h1 className="text-xl font-semibold">Request Verification</h1>
                </div>

                <p className="text-sm text-gray-600 mb-6">
                  Verification helps buyers trust you. Provide valid details and documents to confirm your business.
                </p>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      NIN <span className="text-gray-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="10000000"
                      className="w-full px-4 py-3 bg-gray-50 rounded-2xl text-sm placeholder:text-gray-400"
                      readOnly
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Business Registration No (CAC)
                    </label>
                    <input
                      type="text"
                      placeholder="10000000"
                      className="w-full px-4 py-3 bg-gray-50 rounded-2xl text-sm placeholder:text-gray-400"
                      readOnly
                    />
                  </div>

                  <div className="flex justify-end">
                    <button className="px-6 py-3 bg-slate-800 text-white rounded-xl text-sm font-medium hover:bg-slate-800 transition">
                      Request Verification
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