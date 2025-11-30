"use client";

import React, { useState, useEffect } from "react";
import { Menu } from "lucide-react";
import StoreSidebar from "@/app/components/sidebar/StoreSidebar";
import DashboardHeader from "@/app/components/header/DashboardHeader";
import ProfileSidebar from "@/app/components/sidebar/SellersProfileSidebar";
import ChangePasswordModal from "@/app/components/auth/modals/ChangePasswordModal";

export default function ProfilePasswordSetting() {
  const [isMobile, setIsMobile] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return (
    <>
      <div className="flex min-h-screen">
        <StoreSidebar />
        <div className="flex-1 flex flex-col">
          <DashboardHeader />

          <main className="flex-1 md:ml-64 p-4 md:p-8 bg-gray-50">
            <div className="max-w-5xl">
              {/* Mobile Menu */}
              {isMobile && (
                <button
                  onClick={() => setMenuOpen(true)}
                  className="mb-6 flex items-center gap-2 text-sm font-medium hover:bg-gray-100 rounded-xl p-3"
                >
                  <Menu className="w-5 h-5" /> Password Settings
                </button>
              )}

              <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
                <div className="lg:w-64">
                  <ProfileSidebar isMobile={isMobile} isOpen={menuOpen} setIsOpen={setMenuOpen} />
                </div>

                {/* Main Card */}
                <div className="flex-1 bg-white rounded-2xl p-8">
                  <h1 className="text-2xl font-bold mb-8">Password Settings</h1>

                  <div className="max-w-md">
                    <p className="text-gray-600 mb-8">
                      To keep your account secure, you can change your password anytime using the verification code sent to your email.
                    </p>

                    <button
                      onClick={() => setShowChangePasswordModal(true)}
                      className="w-full sm:w-auto px-8 py-3 bg-slate-900 hover:cursor-pointer text-white font-medium rounded-2xl hover:bg-slate-800 transition shadow-lg"
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

      {/* The Beautiful Modal */}
      <ChangePasswordModal
        isOpen={showChangePasswordModal}
        onClose={() => setShowChangePasswordModal(false)}
      />
    </>
  );
}