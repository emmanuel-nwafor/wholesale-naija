"use client";
import React, { useState, useEffect } from 'react';
import { Menu, Bell, Mail } from 'lucide-react';
import StoreSidebar from '@/app/components/sidebar/StoreSidebar';
import DashboardHeader from '@/app/components/header/DashboardHeader';
import ProfileSidebar from '@/app/components/sidebar/SellersProfileSidebar';

export default function ProfileNotification() {
  const [isMobile, setIsMobile] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [pushEnabled, setPushEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(false);

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
                className="mb-6 hover:cursor-pointer hover:bg-gray-100 rounded-xl p-2 flex items-center gap-2 text-sm font-medium text-gray-700"
              >
                <Menu className="w-4 h-4" /> Notification Settings
              </button>
            )}

            <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
              <div className="lg:w-64">
                <ProfileSidebar isMobile={isMobile} isOpen={menuOpen} setIsOpen={setMenuOpen} />
              </div>

              <div className="flex-1 bg-white rounded-2xl p-6">
                <h1 className="text-xl font-semibold mb-6">Notification Settings</h1>
                
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                        <Bell className="w-5 h-5 text-gray-700" />
                      </div>
                      <span className="text-sm font-medium text-gray-900">Push Notifications</span>
                    </div>
                    <button
                      onClick={() => setPushEnabled(!pushEnabled)}
                      className={`relative w-11 h-6 rounded-full transition-colors ${
                        pushEnabled ? 'bg-slate-800 hover:cursor-pointer' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${
                          pushEnabled ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                        <Mail className="w-5 h-5 text-gray-700" />
                      </div>
                      <span className="text-sm font-medium text-gray-900">Email Notifications</span>
                    </div>
                    <button
                      onClick={() => setEmailEnabled(!emailEnabled)}
                      className={`relative w-11 h-6 rounded-full transition-colors ${
                        emailEnabled ? 'bg-slate-800 hover:cursor-pointer' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${
                          emailEnabled ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
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