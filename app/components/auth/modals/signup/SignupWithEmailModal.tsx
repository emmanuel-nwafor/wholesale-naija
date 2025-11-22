"use client";
import React, { useState } from "react";
import { X } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";

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

export default function SignupWithEmailModal({
  isOpen,
  onClose,
  onSwitchToPhone,
  onContinue, // ✅ Added here
}: SignupWithEmailModalProps) {
  const [email, setEmail] = useState("");

  if (!isOpen) return null;

  return (
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
        className="w-full max-w-[30rem] bg-white rounded-2xl p-6 shadow-xl max-h-[90vh] overflow-y-auto relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X size={24} />
        </button>

        <div className="flex items-center justify-between mt-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Create Account</h2>

          {onSwitchToPhone && (
            <button
              onClick={onSwitchToPhone}
              className="bg-gray-50 p-2 text-gray-600 hover:cursor-pointer rounded-xl"
            >
              Use phone instead
            </button>
          )}
        </div>

        <p className="text-gray-600 text-xs mb-6">
          We&apos;ll send you an OTP to confirm it&apos;s really you
        </p>

        <div className="mb-6">
          <label className="text-sm font-medium text-gray-700">Email Address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="mt-2 w-full px-4 py-4 bg-gray-100 rounded-2xl text-lg focus:outline-none"
          />
        </div>

        {/* Continue button triggers onContinue */}
        <button
          onClick={() => {
            if (email && onContinue) {
              onContinue(email);
            }
          }}
          className="w-full bg-gray-900 hover:cursor-pointer text-white py-4 rounded-2xl text-lg font-medium mb-4"
        >
          Continue
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
          <a href="#" className="underline">Terms of Service</a> and{" "}
          <a href="#" className="underline">Privacy Policies</a>
        </p>
      </motion.div>
    </motion.div>
  );
}
