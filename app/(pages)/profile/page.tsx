// Updated BuyerProfilePage.tsx (Fixed + Cleaned)
"use client";
import React, { useState, useEffect } from 'react';
import { ChevronDown, Menu, Camera } from 'lucide-react';
import Header from '@/app/components/header/Header';
import BuyersProfileSidebar from '@/app/components/sidebar/BuyersProfileSidebar';

export default function BuyersProfilePage() {
  const [isMobile, setIsMobile] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

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
              {/* Mobile Sidebar (Overlay) */}
              {isMobile && (
                <BuyersProfileSidebar
                  isMobile={true}
                  isOpen={menuOpen}
                  setIsOpen={setMenuOpen}
                />
              )}
              {/* Desktop Sidebar */}
              {!isMobile && <BuyersProfileSidebar isMobile={false} isOpen={true} setIsOpen={() => {}} />}

              {/* Main Content */}
              <div className="flex-1 bg-white rounded-3xl p-6 md:p-8">
                <div className="flex justify-between items-center mb-8">
                  <h1 className="text-2xl font-bold">Profile Info</h1>
                  {!isEditing && (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="px-5 py-2.5 border border-gray-300 rounded-xl text-sm font-medium hover:bg-gray-50 transition"
                    >
                      Edit Profile
                    </button>
                  )}
                </div>

                {/* Profile Photo */}
                <div className="flex items-center gap-6 mb-10">
                  <div className="relative">
                    <div className="w-28 h-28 bg-gray-200 rounded-full flex items-center justify-center text-3xl font-bold text-gray-600">
                      AA
                    </div>
                    {isEditing && (
                      <button className="absolute bottom-1 right-1 p-3 bg-white rounded-full border-2 border-white shadow-lg">
                        <Camera className="w-5 h-5 text-gray-600" />
                      </button>
                    )}
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold">Adams Adeleke</h2>
                    <p className="text-sm text-gray-500">Update your photo and personal details.</p>
                  </div>
                </div>

                {/* Form */}
                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                      <input
                        type="text"
                        defaultValue="Adams"
                        disabled={!isEditing}
                        className={`w-full px-4 py-3.5 rounded-xl border transition ${
                          isEditing 
                            ? 'border-gray-300 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500' 
                            : 'border-transparent bg-gray-50'
                        }`}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                      <input
                        type="text"
                        defaultValue="Adeleke"
                        disabled={!isEditing}
                        className={`w-full px-4 py-3.5 rounded-xl border transition ${
                          isEditing 
                            ? 'border-gray-300 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500' 
                            : 'border-transparent bg-gray-50'
                        }`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Select date"
                        disabled={!isEditing}
                        className={`w-full px-4 py-3.5 rounded-xl border transition pr-10 ${
                          isEditing 
                            ? 'border-gray-300 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500' 
                            : 'border-transparent bg-gray-50'
                        }`}
                      />
                      {isEditing && (
                        <ChevronDown className="absolute right-4 top-4 w-5 h-5 text-gray-400 pointer-events-none" />
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                    <input
                      type="tel"
                      defaultValue="+234 812 345 6789"
                      disabled={!isEditing}
                      className={`w-full px-4 py-3.5 rounded-xl border transition ${
                        isEditing 
                          ? 'border-gray-300 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500' 
                          : 'border-transparent bg-gray-50'
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                    <input
                      type="email"
                      defaultValue="adams.adeleke@example.com"
                      disabled
                      className="w-full px-4 py-3.5 rounded-xl bg-gray-50 border border-transparent"
                    />
                  </div>

                  {isEditing && (
                    <div className="flex justify-end gap-4 pt-6">
                      <button
                        type="button"
                        onClick={() => setIsEditing(false)}
                        className="px-6 py-3 border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsEditing(false)}
                        className="px-8 py-3 bg-slate-900 text-white rounded-xl font-medium hover:bg-slate-800"
                      >
                        Save Changes
                      </button>
                    </div>
                  )}
                </form>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
    </>
  );
}