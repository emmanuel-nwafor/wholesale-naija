"use client";
import React, { useEffect, useRef, useState } from "react";
import { ChevronDown, LogOut, Settings, Bell } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import NotificationsModal from "../modals/NotificationsModal";

const pathToTitle: Record<string, string> = {
  "/store/dashboard": "Dashboard",
  "/store/products": "Products",
  "/store/orders": "Orders",
  "/store/analytics": "Analytics",
  "/store/customers": "Customers",
  "/store/reviews": "Reviews",
  "/store/settings": "Settings",
};

export default function DashboardHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const title = pathToTitle[pathname] ?? "Dashboard";

  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [sellerName, setSellerName] = useState("Seller");

  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const name = localStorage.getItem("sellerName") || localStorage.getItem("storeName");
    if (name) setSellerName(name);
  }, []);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    router.push("/login");
  };

  return (
    <>
      <header className="md:ml-64 bg-white shadow-sm sticky top-0 z-20 border-b border-gray-200">
        <div className="flex items-center justify-between px-4 py-3 md:px-6">
          <h1 className="text-lg md:text-xl font-semibold text-gray-900 truncate">{title}</h1>

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
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 rounded-lg p-2 hover:bg-gray-100 transition"
              >
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-green-100 flex items-center justify-center overflow-hidden">
                  <Image
                    src="https://res.cloudinary.com/dqtjja88b/image/upload/v1760219419/Screenshot_2025-10-11_224658_q8bjy2.png"
                    alt="Store"
                    width={40}
                    height={40}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="hidden sm:block text-sm font-medium text-gray-700 max-w-[140px] truncate">
                  {sellerName}
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