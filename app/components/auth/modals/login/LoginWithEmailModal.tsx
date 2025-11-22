"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";

interface LoginWithEmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToPhone?: () => void;
  onLogin?: (email: string, password: string) => void;
}

const overlayVariants = { hidden: { opacity: 0 }, visible: { opacity: 1 } };
const contentVariants = { hidden: { y: -50, opacity: 0 }, visible: { y: 0, opacity: 1, transition: { delay: 0.05 } } };

export default function LoginWithEmailModal({
  isOpen,
  onClose,
  onSwitchToPhone,
  onLogin,
}: LoginWithEmailModalProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  if (!isOpen) return null;

  return (
    <motion.div
      variants={overlayVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div
        variants={contentVariants}
        className="relative w-full max-w-[30rem] bg-white rounded-2xl p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 left-4">
          <ArrowLeft size={28} className="text-gray-700" />
        </button>

        {onSwitchToPhone && (
          <button
            onClick={onSwitchToPhone}
            className="absolute top-4 right-4 text-sm text-gray-600 bg-gray-100 px-4 py-2 rounded-xl"
          >
            Use phone instead
          </button>
        )}

        <div className="mt-12 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Welcome back! 👋
          </h2>
          <p className="text-gray-600 text-sm">Securely login to continue</p>
        </div>

        <div className="mt-8 space-y-6">
          <div>
            <label className="text-sm font-medium text-gray-700">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="mt-2 w-full px-4 py-4 bg-gray-100 rounded-2xl text-lg focus:outline-none"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="mt-2 w-full px-4 py-4 bg-gray-100 rounded-2xl text-lg focus:outline-none"
            />
          </div>

          <a href="#" className="block text-sm text-gray-600 text-right -mt-4">
            Forgot Password? Reset it.
          </a>
        </div>

        <button
          onClick={() => onLogin?.(email, password)}
          className="mt-8 w-full bg-[#0f172a] text-white py-4 rounded-full text-lg font-medium"
        >
          Log In
        </button>

        <div className="my-6 text-center text-gray-500 relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <span className="relative bg-white px-4 text-sm">Or</span>
        </div>

        <div className="flex gap-4 justify-center">
          <button className="flex items-center gap-3 border border-gray-300 px-6 py-3 rounded-xl">
            <Image src="/svgs/google-auth-svg.svg" alt="Google" width={24} height={24} />
            <span className="text-sm">Continue with Google</span>
          </button>
          <button className="flex items-center gap-3 border border-gray-300 px-6 py-3 rounded-xl">
            <Image src="/svgs/apple-auth-svg.svg" alt="Apple" width={24} height={24} />
            <span className="text-sm">Continue with Apple</span>
          </button>
        </div>

        <p className="mt-6 text-center text-xs text-gray-500">
          By continuing you agree to Wholesale Naija's <br />
          <a href="#" className="underline">Terms of Service</a> and <a href="#" className="underline">Privacy Policies</a>
        </p>
      </motion.div>
    </motion.div>
  );
}