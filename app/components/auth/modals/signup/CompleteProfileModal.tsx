// app/auth/modals/signup/CompleteProfileModal.tsx
'use client';

import React, { useState } from 'react';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';
import SelectCountryDropdown from '../SelectCountryDropdown';
import WelcomeBonusModal from '@/app/components/modals/WelcomeBonusModal';

interface CompleteProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenLoginModal: () => void;
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

const API_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/complete-profile`;

export default function CompleteProfileModal({
  isOpen,
  onClose,
  onOpenLoginModal,
}: CompleteProfileModalProps) {
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState({
    name: 'Nigeria',
    code: '+234',
    flag: 'NG',
  });

  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  if (!isOpen) return null;

  const handleCreateAccount = async () => {
    setError('');

    if (
      !phone ||
      !email ||
      !firstName ||
      !lastName ||
      !password ||
      !confirmPassword
    ) {
      setError('All fields are required.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    const role = localStorage.getItem('selectedRole') || 'buyer';

    setLoading(true);
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          key: email,
          password,
          phone: `${selectedCountry.code}${phone}`,
          fullName: `${firstName} ${lastName}`.trim(),
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          role,
        }),
      });

      const data = await res.json();
      if (!res.ok)
        throw new Error(data.message || 'Failed to complete profile');

      onClose();
      setShowWelcomeModal(true);
    } catch (error: unknown) {
      // FIX: Changed 'err: any' to 'error: unknown' (L97)
      const message =
        error instanceof Error ? error.message : 'Something went wrong';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleWelcomeClose = () => {
    setShowWelcomeModal(false);
    onOpenLoginModal(); // Opens LoginWithEmailModal directly
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
          className="w-full max-w-md bg-white rounded-3xl p-6 relative overflow-y-auto max-h-[90vh]"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute top-4 left-4 text-gray-500 hover:text-gray-700"
          >
            <ArrowLeft size={28} />
          </button>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 text-center">
            Complete Profile
          </h2>
          <p className="text-sm text-gray-600 text-center mb-6">
            Create your account to start exploring trusted sellers.
          </p>

          <div className="space-y-4">
            {/* Phone Number */}
            <div>
              <label className="text-sm font-medium text-gray-700">
                Phone Number *
              </label>
              <div className="relative mt-1 flex items-center gap-2 border border-gray-300 rounded-2xl px-2">
                <SelectCountryDropdown
                  selectedCountry={selectedCountry}
                  onSelect={setSelectedCountry}
                />
                <input
                  type="tel"
                  placeholder="901247XXXX"
                  className="flex-1 py-3 focus:outline-none"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="text-sm font-medium text-gray-700">
                Email Address *
              </label>
              <input
                type="email"
                placeholder="johndoe@gmail.com"
                className="w-full mt-1 px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Names */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  First Name *
                </label>
                <input
                  type="text"
                  placeholder="John"
                  className="w-full mt-1 px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Last Name *
                </label>
                <input
                  type="text"
                  placeholder="Doe"
                  className="w-full mt-1 px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="text-sm font-medium text-gray-700">
                Password *
              </label>
              <div className="relative mt-1">
                <input
                  type={showPass ? 'text' : 'password'}
                  placeholder="Use at least 8 characters"
                  className="w-full pr-12 pl-4 py-3 border border-gray-300 rounded-2xl focus:outline-none"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
              <label className="text-sm font-medium text-gray-700">
                Confirm Password *
              </label>
              <div className="relative mt-1">
                <input
                  type={showConfirm ? 'text' : 'password'}
                  placeholder="Confirm password"
                  className="w-full pr-12 pl-4 py-3 border border-gray-300 rounded-2xl focus:outline-none"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
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

          {error && (
            <p className="text-red-500 text-sm text-center mt-4">{error}</p>
          )}

          <button
            onClick={handleCreateAccount}
            disabled={loading}
            className="w-full mt-8 py-4 bg-gray-900 text-white rounded-2xl font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </motion.div>
      </motion.div>

      {/* Welcome Bonus Modal */}
      <WelcomeBonusModal
        isOpen={showWelcomeModal}
        onClose={handleWelcomeClose}
        onStartBrowsing={handleWelcomeClose}
      />
    </>
  );
}
