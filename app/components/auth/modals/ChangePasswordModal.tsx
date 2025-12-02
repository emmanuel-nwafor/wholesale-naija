// app/components/modals/ChangePasswordModal.tsx
"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Eye, EyeOff, Mail, Shield } from "lucide-react";
import { fetchWithToken } from "@/app/utils/fetchWithToken";
import OkaySuccessModal from "@/app/components/modals/OkaySuccessModal";

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ChangePasswordModal({ isOpen, onClose }: ChangePasswordModalProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  if (!isOpen) return null;

  const handleSendCode = async () => {
    if (!email || !email.includes("@")) return setError("Enter a valid email");

    setLoading(true);
    setError("");
    try {
      await fetchWithToken("/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email }),
      });
      setStep(2);
    } catch (err: any) {
      setError(err.message || "Failed to send code");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (code.length !== 4 || !/^\d+$/.test(code)) return setError("Enter valid 4-digit code");
    if (newPassword.length < 6) return setError("Password must be 6+ characters");
    if (newPassword !== confirmPassword) return setError("Passwords don't match");

    setLoading(true);
    setError("");
    try {
      await fetchWithToken("/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, token: code, newPassword }),
      });
      setShowSuccess(true);
      setTimeout(() => onClose(), 1800);
    } catch (err: any) {
      setError(err.message || "Wrong or expired code");
    } finally {
      setLoading(false);
    }
  };

  const goBack = () => {
    setError("");
    step === 1 ? onClose() : setStep(1);
  };

  return (
    <>
      {/* Overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
        onClick={onClose}
      >
        {/* Modal Card */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative w-full max-w-md max-h-[90vh] bg-white rounded-3xl shadow-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-6 border-b border-gray-100">
            <button onClick={goBack} className="text-gray-600 hover:text-gray-900">
              <ArrowLeft size={28} />
            </button>
            <h2 className="text-2xl font-bold text-center -mt-8">Change Password</h2>
          </div>

          {/* Scrollable Body */}
          <div className="px-6 pb-8 pt-4 max-h-[calc(90vh-140px)] overflow-y-auto">
            <div className="text-center mb-6">
              {step === 1 ? (
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-8 h-8 text-blue-600" />
                </div>
              ) : (
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-green-600" />
                </div>
              )}
              <p className="text-gray-600 text-sm">
                {step === 1
                  ? "Enter your email to receive a 4-digit code"
                  : "Check your email for the code"}
              </p>
            </div>

            {error && (
              <div className="mb-5 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm text-center">
                {error}
              </div>
            )}

            {/* Step 1: Email */}
            {step === 1 && (
              <div className="space-y-5">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-5 py-4 bg-gray-50 rounded-2xl text-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                  autoFocus
                />
                <button
                  onClick={handleSendCode}
                  disabled={loading || !email.includes("@")}
                  className="w-full py-4 bg-slate-900 text-white font-medium rounded-2xl hover:bg-slate-800 disabled:bg-gray-400 transition"
                >
                  {loading ? "Sending..." : "Send Code"}
                </button>
              </div>
            )}

            {/* Step 2: Code + Password */}
            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <label className="text-sm font-medium text-gray-700">4-Digit Code</label>
                  <input
                    type="text"
                    maxLength={4}
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                    placeholder="0000"
                    className="mt-2 w-full px-6 py-5 text-center text-3xl tracking-widest font-mono bg-gray-50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-slate-900"
                    autoFocus
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">New Password</label>
                  <div className="relative mt-2">
                    <input
                      type={showPass ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-5 py-4 pr-14 bg-gray-50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-slate-900"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass(!showPass)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
                    >
                      {showPass ? <EyeOff size={22} /> : <Eye size={22} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">Confirm Password</label>
                  <div className="relative mt-2">
                    <input
                      type={showConfirm ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-5 py-4 pr-14 bg-gray-50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-slate-900"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
                    >
                      {showConfirm ? <EyeOff size={22} /> : <Eye size={22} />}
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleResetPassword}
                  disabled={loading}
                  className="w-full py-4 bg-slate-900 text-white font-medium rounded-2xl hover:bg-slate-800 disabled:opacity-50 transition"
                >
                  {loading ? "Changing Password..." : "Change Password"}
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>

      <OkaySuccessModal
        show={showSuccess}
        onClose={onClose}
        title="Password Changed!"
      />
    </>
  );
}