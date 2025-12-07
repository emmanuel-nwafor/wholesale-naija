'use client';
import React, { useState } from 'react';
import { X } from 'lucide-react';
import { motion } from 'framer-motion';
import Image from 'next/image';

interface SignupWithEmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToPhone?: () => void;
  onContinue?: (email: string) => void;
}

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const contentVariants = {
  hidden: { y: -50, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { delay: 0.05 } },
};

const API_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/send-otp`;

export default function SignupWithEmailModal({
  isOpen,
  onClose,
  onContinue,
}: SignupWithEmailModalProps) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  // FIX: Removed unused state variable 'showSuccess' (L35)
  // const [showSuccess, setShowSuccess] = useState(false);

  if (!isOpen) return null;

  const handleContinue = async () => {
    if (!email) return;
    setLoading(true);
    setError('');

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to send OTP');
      }

      // Success, call parent callback
      // setShowSuccess(true); // Removed as it was unused
      if (onContinue) onContinue(email);
    } catch (error: unknown) {
      // FIX: Changed 'err: any' to 'error: unknown' (L60)
      const message =
        error instanceof Error ? error.message : 'Something went wrong';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
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
          className="w-full max-w-[30rem] max-h-[90vh] overflow-y-auto bg-white rounded-2xl p-6 sm:p-8 shadow-xl relative"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>

          <div className="flex items-center justify-between mt-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              Create Account
            </h2>
          </div>

          <p className="text-gray-600 text-xs mb-6">
            We&apos;ll send you an OTP to confirm it&apos;s really you
          </p>

          <div className="mb-6">
            <label className="text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="mt-2 w-full px-4 py-4 sm:py-3 bg-gray-100 rounded-2xl text-lg focus:outline-none"
            />
          </div>

          {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

          <button
            onClick={handleContinue}
            disabled={!email || loading}
            className={`w-full py-4 sm:py-3 rounded-2xl text-sm font-medium mb-4 transition ${
              email && !loading
                ? 'bg-gray-900 text-white hover:bg-gray-800 cursor-pointer'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {loading ? 'Sending OTP...' : 'Continue'}
          </button>

          <div className="relative text-center text-gray-500 text-sm mb-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <span className="relative bg-white px-4">Or</span>
          </div>

          <div className="flex gap-4 mb-4">
            <button>
              <Image
                src={`/svgs/google-auth-svg.svg`}
                alt="google-login"
                width={224}
                height={224}
                className="hover:cursor-pointer"
              />
            </button>
            <button>
              <Image
                src={`/svgs/apple-auth-svg.svg`}
                alt="apple-login"
                width={224}
                height={224}
                className="hover:cursor-pointer"
              />
            </button>
          </div>

          <p className="text-center text-xs text-gray-500 mb-4">
            By continuing you agree to Wholesale Naija <br />
            <a href="#" className="underline">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="#" className="underline">
              Privacy Policies
            </a>
          </p>
        </motion.div>
      </motion.div>
    </>
  );
}
