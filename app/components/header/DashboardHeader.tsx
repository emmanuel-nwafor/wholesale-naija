'use client';

import React, { useEffect, useRef, useState } from 'react';
import { ChevronDown, LogOut, Settings, Bell } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';
import NotificationsModal from '../modals/NotificationsModal';
import { fetchWithToken } from '@/app/utils/fetchWithToken';

const pathToTitle: Record<string, string> = {
  '/store/dashboard': 'Dashboard',
  '/store/products': 'Products',
  '/store/orders': 'Orders',
  '/store/analytics': 'Analytics',
  '/store/customers': 'Customers',
  '/store/reviews': 'Reviews',
  '/store/settings': 'Settings',
};

interface UserProfile {
  fullName: string;
  profilePicture?: {
    url: string;
  };
}

export default function DashboardHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const title = pathToTitle[pathname] ?? 'Dashboard';

  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);

  const profileRef = useRef<HTMLDivElement>(null);

  // Fetch user profile
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      loadUserProfile();
    }
  }, []);

  const loadUserProfile = async () => {
    try {
      const res = await fetchWithToken<{ user: UserProfile }>('/auth/profile');
      if (res?.user) setUser(res.user);
    } catch (err) {
      console.error('Failed to fetch user profile:', err);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(e.target as Node)
      ) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    router.push('/');
  };

  return (
    <>
      <header className="md:ml-64 bg-white sticky top-0 z-20 border-gray-200">
        <div className="flex items-center justify-between px-4 py-3 md:px-6">
          {/* Left: Logo (mobile) + Title (desktop) */}
          <div className="flex items-center gap-3">
            <div className="md:hidden">
              <Image
                src="/svgs/wholesale-ng-logo.png"
                alt="Wholesale Naija"
                width={100}
                height={100}
                className="ml-10"
              />
            </div>

            <h1 className="hidden md:block text-lg md:text-xl font-semibold text-gray-900 truncate">
              {title}
            </h1>
          </div>

          {/* Right: Bell + Profile */}
          <div className="flex items-center gap-3">
            {/* Bell Icon */}
            <button
              onClick={() => setNotificationsOpen(true)}
              className="relative p-2 rounded-lg hover:bg-gray-100 transition"
            >
              <Bell className="w-5 h-5 text-gray-700" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* Profile Dropdown */}
            <div className="hidden md:block relative" ref={profileRef}>
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 rounded-lg p-2 hover:bg-gray-100 transition"
              >
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-green-100 flex items-center justify-center overflow-hidden relative flex-shrink-0">
                  <Image
                    src={user?.profilePicture?.url || '/svgs/profile-image.jpg'}
                    alt="User"
                    fill
                    className="object-cover"
                  />
                </div>
                <span className="text-sm font-medium text-gray-700 max-w-[140px] truncate">
                  {user
                    ? user.fullName.split(' ')[0].length > 12
                      ? user.fullName.split(' ')[0].slice(0, 12) + '...'
                      : user.fullName.split(' ')[0]
                    : 'User'}
                </span>
                <ChevronDown className="w-4 h-4 text-gray-600" />
              </button>

              {profileOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                  <a
                    href="/store/settings"
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    onClick={() => setProfileOpen(false)}
                  >
                    <Settings className="w-4 h-4" />
                    Settings
                  </a>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <LogOut className="w-4 h-4" />
                    Log out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <NotificationsModal
        isOpen={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
      />
    </>
  );
}
