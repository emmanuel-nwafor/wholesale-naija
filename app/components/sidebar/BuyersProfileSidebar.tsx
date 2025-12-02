// app/components/sidebar/BuyersProfileSidebar.tsx
"use client";

import React, { useState } from 'react';
import { Bell, Lock, Trash2, LogOut, User, X, MapPin, Star } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import LogoutModal from '@/app/components/modals/LogoutModal';
import DeleteModal from '@/app/components/modals/DeleteModal'; // Import the new modal

interface ProfileSidebarProps {
  isMobile: boolean;
  isOpen: boolean;
  setIsOpen: (v: boolean) => void;
}

export default function BuyersProfileSidebar({ isMobile, isOpen, setIsOpen }: ProfileSidebarProps) {
  const pathname = usePathname();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false); // New state

  const items = [
    { icon: User, label: "Profile Info", href: "/profile" },
    { icon: Star, label: "Reviews", href: "/profile/reviews" },
    { icon: MapPin, label: "Country/Region", href: "/profile/country-region" },
    { icon: Bell, label: "Notification Settings", href: "/profile/notifications" },
    { icon: Lock, label: "Password Settings", href: "/profile/password" },
    // Delete Account now triggers modal instead of direct navigation
  ];

  const isActive = (href: string) => pathname === href;

  const handleLogoutClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowLogoutModal(true);
    if (isMobile) setIsOpen(false);
  };

  const handleDeleteAccountClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowDeleteModal(true);
    if (isMobile) setIsOpen(false);
  };

  const handleConfirmDelete = () => {
    // Replace with actual delete logic or redirect
    console.log("Account deletion confirmed");
    // Example: router.push('/profile/delete') or API call
    setShowDeleteModal(false);
  };

  const content = (
    <nav className="space-y-1">
      {/* Regular menu items */}
      {items.map((item) => {
        const active = isActive(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => isMobile && setIsOpen(false)}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
              active
                ? 'bg-gray-100 text-gray-900'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <item.icon className="w-5 h-5" />
            {item.label}
          </Link>
        );
      })}

      {/* Delete Account - Now opens modal */}
      <button
        onClick={handleDeleteAccountClick}
        className="flex w-full items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-all"
      >
        <Trash2 className="w-5 h-5" />
        Delete Account
      </button>

      {/* Logout */}
      <button
        onClick={handleLogoutClick}
        className="flex w-full items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-all mt-4"
      >
        <LogOut className="w-5 h-5" />
        Log Out
      </button>
    </nav>
  );

  if (isMobile) {
    return (
      <>
        {isOpen && <div className="fixed inset-0 bg-black/30 z-40" onClick={() => setIsOpen(false)} />}
        
        <div
          className={`fixed left-0 top-0 h-full w-72 bg-white shadow-2xl z-50 transition-transform duration-300 ease-out ${
            isOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="p-5 border-b flex justify-between items-center">
            <h3 className="text-lg font-semibold">Account Settings</h3>
            <button onClick={() => setIsOpen(false)} className="p-1">
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="p-4">{content}</div>
        </div>

        {/* Modals */}
        <LogoutModal isOpen={showLogoutModal} onClose={() => setShowLogoutModal(false)} />
        <DeleteModal
          show={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleConfirmDelete}
          title="Delete Your Account?"
          message="This will permanently delete your account and all associated data. This action cannot be undone."
          loading={false}
        />
      </>
    );
  }

  return (
    <div className="bg-white rounded-3xl p-6">
      {content}

      <LogoutModal isOpen={showLogoutModal} onClose={() => setShowLogoutModal(false)} />
      <DeleteModal
        show={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Your Account?"
        message="This will permanently delete your account and all associated data. This action cannot be undone."
        loading={false}
      />
    </div>
  );
}