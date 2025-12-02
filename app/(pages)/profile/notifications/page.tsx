// app/profile/notifications/page.tsx
'use client';
import React, { useState, useEffect } from 'react';
import { Menu, Bell, Mail } from 'lucide-react';
import Header from '@/app/components/header/Header';
import BuyersProfileSidebar from '@/app/components/sidebar/BuyersProfileSidebar';
import CarouselBanner from '@/app/components/carousels/CarouselBanner';
import DynamicHeader from '@/app/components/header/DynamicHeader';

export default function ProfileNotifications() {
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
    <>
      <Header />
      <DynamicHeader />

      <div className="flex">
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
                  <BuyersProfileSidebar
                    isMobile={false}
                    isOpen={true}
                    setIsOpen={() => {}}
                  />
                )}

                {/* Main Content */}
                <div className="flex-1 bg-white rounded-3xl p-6 md:p-8">
                  <h1 className="text-xl font-bold mb-8">
                    Notification Settings
                  </h1>

                  <div className="space-y-8">
                    {/* Push Notifications */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center">
                          <Bell className="w-6 h-6 text-gray-700" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            Push Notifications
                          </p>
                          <p className="text-sm text-gray-500">
                            Receive notifications in the app
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => setPushEnabled(!pushEnabled)}
                        className={`relative w-14 h-8 rounded-full transition-colors ${
                          pushEnabled ? 'bg-slate-800' : 'bg-gray-300'
                        }`}
                      >
                        <span
                          className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-sm transition-transform ${
                            pushEnabled ? 'translate-x-6' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>

                    {/* Email Notifications */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center">
                          <Mail className="w-6 h-6 text-gray-700" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            Email Notifications
                          </p>
                          <p className="text-sm text-gray-500">
                            Receive updates via email
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => setEmailEnabled(!emailEnabled)}
                        className={`relative w-14 h-8 rounded-full transition-colors ${
                          emailEnabled ? 'bg-slate-800' : 'bg-gray-300'
                        }`}
                      >
                        <span
                          className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-sm transition-transform ${
                            emailEnabled ? 'translate-x-6' : 'translate-x-0'
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
      <CarouselBanner />
    </>
  );
}
