"use client";
import React, { useState } from "react";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";
import SelectCountryDropdown from "../SelectCountryDropdown";
import WelcomeBonusModal from "@/app/components/modals/WelcomeBonusModal";

interface CompleteProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const contentVariants = {
  hidden: { y: -30, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.3 } },
};

export default function CompleteProfileModal({ isOpen, onClose }: CompleteProfileModalProps) {
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState({
    name: "Nigeria",
    code: "+234",
    flag: "🇳🇬",
  });
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);

  if (!isOpen) return null;

  const handleCreateAccount = () => {
    // Here you would normally handle API call and validation
    // For demo, we'll just simulate success
    onClose(); // close profile modal
    setShowWelcomeModal(true); // open welcome bonus modal
  };

  return (
    <>
      {/* Complete Profile Modal */}
      <motion.div
        variants={overlayVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
        onClick={onClose}
      >
        <motion.div
          variants={contentVariants}
          className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 relative overflow-y-auto max-h-[90vh]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 left-4 hover:cursor-pointer text-gray-500 hover:text-gray-700"
          >
            <ArrowLeft size={28} />
          </button>

          <h2 className="text-2xl font-bold text-gray-900 mt-8">
            Complete Profile
          </h2>
          <p className="text-sm text-gray-600 mb-6">
            Create your account to start exploring trusted sellers.
          </p>

          <div className="space-y-4">
            {/* Phone Number */}
            <div>
              <label className="text-sm font-medium text-gray-700">Phone Number *</label>
              <div className="relative mt-1 flex items-center gap-2 border border-gray-300 rounded-2xl px-2">
                <SelectCountryDropdown
                  selectedCountry={selectedCountry}
                  onSelect={setSelectedCountry}
                />
                <input
                  type="tel"
                  placeholder="901247XXXX"
                  className="flex-1 py-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-gray-900"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="text-sm font-medium text-gray-700">Email Address *</label>
              <input
                type="email"
                placeholder="johndoe@gmail.com"
                className="w-full mt-1 px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none"
              />
            </div>

            {/* First & Last Name */}
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="text-sm font-medium text-gray-700">First Name *</label>
                <input
                  type="text"
                  placeholder="John"
                  className="w-full mt-1 px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none"
                />
              </div>
              <div className="flex-1">
                <label className="text-sm font-medium text-gray-700">Last Name *</label>
                <input
                  type="text"
                  placeholder="Adeleke"
                  className="w-full mt-1 px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="text-sm font-medium text-gray-700">Password *</label>
              <div className="relative mt-1">
                <input
                  type={showPass ? "text" : "password"}
                  placeholder="Use at least 8 characters"
                  className="w-full pr-12 pl-4 py-3 border border-gray-300 rounded-2xl focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2"
                >
                  {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="text-sm font-medium text-gray-700">Confirm Password *</label>
              <div className="relative mt-1">
                <input
                  type={showConfirm ? "text" : "password"}
                  placeholder="Olamide@1234"
                  className="w-full pr-12 pl-4 py-3 border border-gray-300 rounded-2xl focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-4 top-1/2 -translate-y-1/2"
                >
                  {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
          </div>

          <button
            onClick={handleCreateAccount}
            className="w-full mt-8 bg-gray-900 text-white py-4 rounded-2xl font-semibold text-md hover:bg-gray-800 transition"
          >
            Create Account
          </button>
        </motion.div>
      </motion.div>

      {/* Welcome Bonus Modal */}
      <WelcomeBonusModal
        isOpen={showWelcomeModal}
        onClose={() => setShowWelcomeModal(false)}
        onStartBrowsing={() => setShowWelcomeModal(false)}
      />
    </>
  );
}
