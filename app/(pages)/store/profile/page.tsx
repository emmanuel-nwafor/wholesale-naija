// Updated SellerProfilePage.tsx
"use client";
import React, { useState, useEffect } from 'react';
import { ChevronDown, Menu, Camera } from 'lucide-react';
import StoreSidebar from "@/app/components/sidebar/StoreSidebar";
import DashboardHeader from "@/app/components/header/DashboardHeader";
import ProfileSidebar from '@/app/components/sidebar/SellersProfileSidebar';

export default function SellerProfilePage() {
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
    <div className="flex min-h-screen">
      <StoreSidebar />
      <div className="flex-1 flex flex-col">
        <DashboardHeader />
        <main className="flex-1 md:ml-64 p-4 md:p-8 bg-gray-50">
          <div className="max-w-5xl">
            {/* Mobile Menu Trigger */}
            {isMobile && (
              <button
                onClick={() => setMenuOpen(true)}
                className="mb-6 hover:cursor-pointer hover:bg-gray-100 rounded-xl p-2 flex items-center gap-2 text-sm font-medium text-gray-700"
              >
                <Menu className="w-4 h-4" /> Profile Info
              </button>
            )}
            <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
              {/* Sidebar */}
              <div className="lg:w-64">
                <ProfileSidebar isMobile={isMobile} isOpen={menuOpen} setIsOpen={setMenuOpen} />
              </div>
              {/* Main Content */}
              <div className="flex-1 bg-white rounded-2xl p-6">
                <div className="flex justify-between items-start mb-8">
                  <h1 className="text-xl font-semibold">Profile Info</h1>
                  <button
                    onClick={() => setIsEditing(true)}
                    className={`px-4 py-2 border border-gray-300 rounded-xl text-sm font-medium transition-colors ${
                      isEditing ? 'hidden' : 'hover:bg-gray-50'
                    }`}
                  >
                    Edit Profile
                  </button>
                </div>
                <div className="flex items-center mb-8">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-2xl font-bold text-gray-600">
                      OR
                    </div>
                    {isEditing && (
                      <button className="absolute bottom-0 right-0 p-2 bg-white rounded-full border shadow-sm">
                        <Camera className="w-4 h-4 text-gray-600" />
                      </button>
                    )}
                  </div>
                  <div className="ml-6 flex-1">
                    <h2 className="text-lg font-semibold">Adams Adeleke</h2>
                    <p className="text-sm text-gray-500">Update your photo and personal details.</p>
                    {isEditing && (
                      <div className="flex gap-2 mt-3">
                        <button className="px-3 py-1 text-xs border border-gray-300 rounded-lg hover:bg-gray-50">Delete</button>
                        <button className="px-3 py-1 text-xs border border-gray-300 rounded-lg hover:bg-gray-50">Update</button>
                      </div>
                    )}
                  </div>
                </div>
                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                      <input
                        type="text"
                        defaultValue="example@email.com"
                        disabled={!isEditing}
                        className={`w-full px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                          isEditing ? 'bg-white border border-gray-300' : 'bg-gray-50'
                        }`}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                      <input
                        type="text"
                        defaultValue="example@email.com"
                        disabled={!isEditing}
                        className={`w-full px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                          isEditing ? 'bg-white border border-gray-300' : 'bg-gray-50'
                        }`}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                    <div className="relative">
                      <input
                        type="text"
                        defaultValue="example@email.com"
                        disabled={!isEditing}
                        className={`w-full px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10 transition-colors ${
                          isEditing ? 'bg-white border border-gray-300' : 'bg-gray-50'
                        }`}
                      />
                      {isEditing && <ChevronDown className="absolute right-3 top-3.5 w-4 h-4 text-gray-400 pointer-events-none" />}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    <input
                      type="text"
                      defaultValue="example@email.com"
                      disabled={!isEditing}
                      className={`w-full px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                        isEditing ? 'bg-white border border-gray-300' : 'bg-gray-50'
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    <input
                      type="email"
                      defaultValue="example@email.com"
                      disabled={!isEditing}
                      className={`w-full px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                        isEditing ? 'bg-white border border-gray-300' : 'bg-gray-50'
                      }`}
                    />
                  </div>
                  {isEditing && (
                    <div className="flex justify-end pt-4">
                      <button
                        type="button"
                        onClick={() => setIsEditing(false)}
                        className="px-6 py-2 bg-slate-900 text-white rounded-xl hover:bg-slate-800 text-sm font-medium"
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
  );
}