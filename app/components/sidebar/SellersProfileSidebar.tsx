// app/components/sidebar/SellersProfileSidebar.tsx
"use client";

import React, { useState } from 'react';
import { Globe, Bell, Lock, Trash2, LogOut, User, X, Store } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import DeleteModal from '@/app/components/modals/DeleteModal';

interface ProfileSidebarProps {
  isMobile: boolean;
  isOpen: boolean;
  setIsOpen: (v: boolean) => void;
}

export default function SellersProfileSidebar({ isMobile, isOpen, setIsOpen }: ProfileSidebarProps) {
  const pathname = usePathname();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const items = [
    { icon: User, label: "Profile Info", href: "/store/profile" },
    { icon: Globe, label: "Country/Region", href: "/store/profile/country-region" },
    { icon: Bell, label: "Notification Settings", href: "/store/profile/notifications" },
    { icon: Lock, label: "Password Settings", href: "/store/profile/password-settings" },
    { icon: Store, label: "Verification Request", href: "/store/verification" },
    { icon: Trash2, label: "Delete Account", danger: true, action: () => setShowDeleteModal(true) },
    { icon: LogOut, label: "Log Out", href: "/logout", danger: true },
  ];

  const isActive = (href: string) => pathname === href;

  const handleItemClick = (item: any) => {
    if (item.action) {
      item.action();
    } else if (item.href) {
      window.location.href = item.href; // or use router.push if preferred
    }
    if (isMobile) setIsOpen(false);
  };

  const content = (
    <nav className="space-y-1">
      {items.map((item) => {
        const active = item.href && isActive(item.href);
        const isDelete = item.label === "Delete Account";

        return (
          <button
            key={item.label}
            onClick={() => handleItemClick(item)}
            className={`flex w-full items-center gap-3 px-4 py-3 text-left rounded-xl text-sm font-medium transition-colors ${
              active
                ? 'bg-gray-100 text-gray-900'
                : item.danger
                ? 'text-red-600 hover:bg-red-50'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <item.icon className="w-4 h-4" />
            {item.label}
          </button>
        );
      })}
    </nav>
  );

  if (isMobile) {
    return (
      <>
        {isOpen && (
          <div
            className="fixed inset-0 bg-black/20 z-40"
            onClick={() => setIsOpen(false)}
          />
        )}
        <div
          className={`fixed left-0 top-0 h-full w-64 bg-white z-50 transition-transform duration-300 ${
            isOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="p-4 border-b border-gray-100 flex justify-between items-center">
            <h3 className="font-semibold text-gray-900">Account Settings</h3>
            <button onClick={() => setIsOpen(false)}>
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>
          <div className="p-4">{content}</div>
        </div>

        {/* Delete Account Confirmation Modal */}
        <DeleteModal
          show={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={() => {
            // Replace with your actual delete account logic
            alert("Account deletion requested. This would call your API here.");
            setShowDeleteModal(false);
            // Optionally redirect or log out
            // router.push('/logout');
          }}
          title="Delete Your Account?"
          message="This will permanently delete your account, store, products, and all data. This action cannot be undone."
          itemName="Your entire account"
          loading={false}
        />
      </>
    );
  }

  // Desktop version
  return (
    <>
      <div className="bg-white rounded-2xl p-4 shadow-sm">{content}</div>

      {/* Delete Modal for Desktop */}
      <DeleteModal
        show={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={() => {
          alert("Account deletion requested.");
          setShowDeleteModal(false);
        }}
        title="Delete Your Account?"
        message="This will permanently delete your account and all data."
        itemName="Your entire account"
        loading={false}
      />
    </>
  );
}