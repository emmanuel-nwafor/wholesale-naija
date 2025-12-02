"use client";

import React, { useState, useEffect } from "react";
import { Menu } from "lucide-react";
import Header from "@/app/components/header/Header";
import BuyersProfileSidebar from "@/app/components/sidebar/BuyersProfileSidebar";
import ChangePasswordModal from "@/app/components/auth/modals/ChangePasswordModal";
import { fetchWithToken } from "@/app/utils/fetchWithToken";
import CarouselBanner from "@/app/components/carousels/CarouselBanner";
import DynamicHeader from "@/app/components/header/DynamicHeader";

interface UserProfile {
  fullName: string;
  email: string;
  phone: string;
  store?: {
    name: string;
    contactPhone?: string;
  };
}

export default function BuyersProfilePasswordPage() {
  const [isMobile, setIsMobile] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Fetch profile data from the same API as sellers
  const loadProfile = async () => {
    try {
      setLoading(true);
      const data = await fetchWithToken<{ user: UserProfile }>("/auth/profile");
      setProfile(data.user);
    } catch (err) {
      console.error("Failed to fetch profile:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
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
                  <BuyersProfileSidebar isMobile={false} isOpen={true} setIsOpen={() => {}} />
                )}

                {/* Main Content */}
                <div className="flex-1 rounded-3xl p-6 md:p-8 bg-white">
                  <h1 className="text-xl font-bold mb-8">Password Setting</h1>

                  {/* Display profile info */}
                  <div className="space-y-4 max-w-lg">
                    <p className="text-gray-600">
                      To keep your account secure, you can change your password anytime using the verification code sent to your email.
                    </p>
                  </div>

                  {/* Change Password Button */}
                  <div className="flex justify-left pt-8">
                    <button
                      onClick={() => setShowChangePasswordModal(true)}
                      className="px-8 py-4 bg-slate-900 text-white rounded-xl hover:cursor-pointer font-medium hover:bg-slate-800 transition"
                    >
                      Change Password
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
        <CarouselBanner />

      {/* Modal */}
      <ChangePasswordModal
        isOpen={showChangePasswordModal}
        onClose={() => setShowChangePasswordModal(false)}
      />
    </>
  );
}
