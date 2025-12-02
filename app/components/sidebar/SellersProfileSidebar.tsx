// app/components/sidebar/SellersProfileSidebar.tsx
'use client';

import React, { useState } from 'react';
import {
  Globe,
  Bell,
  Lock,
  Trash2,
  LogOut,
  User,
  X,
  Store,
} from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';

import DeleteModal from '@/app/components/modals/DeleteModal';
import DeleteAccountPasswordModal from '@/app/components/auth/modals/DeleteAccountPasswordModal';

interface ProfileSidebarProps {
  isMobile: boolean;
  isOpen: boolean;
  setIsOpen: (v: boolean) => void;
}

export default function SellersProfileSidebar({
  isMobile,
  isOpen,
  setIsOpen,
}: ProfileSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showFinalDeleteModal, setShowFinalDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const items = [
    { icon: User, label: 'Profile Info', href: '/store/profile' },
    {
      icon: Globe,
      label: 'Country/Region',
      href: '/store/profile/country-region',
    },
    {
      icon: Bell,
      label: 'Notification Settings',
      href: '/store/profile/notifications',
    },
    {
      icon: Lock,
      label: 'Password Settings',
      href: '/store/profile/password-settings',
    },
    { icon: Store, label: 'Verification Request', href: '/store/verification' },
    { icon: Trash2, label: 'Delete Account', danger: true },
    { icon: LogOut, label: 'Log Out', danger: true },
  ];

  const isActive = (href: string) => pathname === href;

  const handleClick = (item: any) => {
    if (item.label === 'Delete Account') {
      setShowPasswordModal(true);
    } else if (item.label === 'Log Out') {
      // LOG OUT FUNCTIONALITY
      localStorage.clear();
      sessionStorage.clear();
      document.cookie.split(';').forEach((c) => {
        document.cookie = c
          .replace(/^ +/, '')
          .replace(/=.*/, '=;expires=' + new Date().toUTCString() + ';path=/');
      });
      router.push('/');
    } else if (item.href) {
      router.push(item.href);
    }

    if (isMobile) setIsOpen(false);
  };

  const handleDeleteConfirmed = async () => {
    setDeleting(true);
    try {
      localStorage.clear();
      sessionStorage.clear();
      router.push('/');
    } finally {
      setDeleting(false);
    }
  };

  const content = (
    <nav className="space-y-1">
      {items.map((item) => {
        const active = item.href && isActive(item.href);

        return (
          <button
            key={item.label}
            onClick={() => handleClick(item)}
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
            <h3 className="font-semibold">Account Settings</h3>
            <button onClick={() => setIsOpen(false)}>
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="p-4">{content}</div>
        </div>

        {/* Password verification before delete */}
        <DeleteAccountPasswordModal
          isOpen={showPasswordModal}
          onClose={() => setShowPasswordModal(false)}
          onSuccess={() => {
            setShowPasswordModal(false);
            setShowFinalDeleteModal(true);
          }}
        />

        {/* Final delete confirmation */}
        <DeleteModal
          show={showFinalDeleteModal}
          onClose={() => setShowFinalDeleteModal(false)}
          onConfirm={handleDeleteConfirmed}
          title="Permanently Delete Account?"
          message="All your data will be gone forever. This cannot be undone."
          itemName="Your entire account & store"
          loading={deleting}
        />
      </>
    );
  }

  // Desktop
  return (
    <>
      <div className="bg-white rounded-2xl p-4">{content}</div>

      <DeleteAccountPasswordModal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        onSuccess={() => {
          setShowPasswordModal(false);
          setShowFinalDeleteModal(true);
        }}
      />

      <DeleteModal
        show={showFinalDeleteModal}
        onClose={() => setShowFinalDeleteModal(false)}
        onConfirm={handleDeleteConfirmed}
        title="Delete Account Permanently?"
        message="This action is irreversible."
        itemName="Your entire account"
        loading={deleting}
      />
    </>
  );
}
