"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import SuccessModal from "@/app/components/modals/SuccessModal";

interface LoginWithEmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToPhone?: () => void;
  onLogin?: (email: string, password: string) => void;
}

const overlayVariants = { hidden: { opacity: 0 }, visible: { opacity: 1 } };
const contentVariants = { hidden: { y: -50, opacity: 0 }, visible: { y: 0, opacity: 1, transition: { delay: 0.05 } } };
const API_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/login`;

export default function LoginWithEmailModal({ isOpen, onClose, onSwitchToPhone }: LoginWithEmailModalProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [userRole, setUserRole] = useState("");
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  if (!isOpen) return null;

  const handleLogin = async () => {
    const role = localStorage.getItem("selectedRole");
    if (!role) {
      setError("Please select a role first.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Login failed");
      } else if (data.user.role === "admin") {
        setError("Admin users are not allowed to log in here.");
      } else {
        // Save token and user info
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        setUserRole(data.user.role);
        setShowSuccess(true);
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleRedirect = () => {
    setShowSuccess(false);
    onClose();
    if (userRole === "seller") router.push("/store/dashboard");
    else router.push("/profile");
  };

  return (
    <>
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
              className="absolute top-4 right-4 text-sm text-gray-600 bg-gray-100 px-4 py-2 rounded-xl hover:cursor-pointer"
            >
              Use phone instead
            </button>
          )}

          <div className="mt-10 mb-3">
            <h2 className="text-2xl font-bold text-gray-900">Welcome back! 👍</h2>
            <p className="text-gray-600 text-sm">Securely login to continue</p>
          </div>

          <div className="mt- space-y-6">
            <div>
              <label className="text-sm font-medium text-gray-700">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-4 py-3 bg-gray-100 rounded-2xl text-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div className="relative">
              <label className="text-sm font-medium text-gray-700">Password</label>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-4 pr-12 py-3 bg-gray-100 rounded-2xl text-lg focus:outline-none"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 text-gray-500"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <a href="#" className="block text-sm text-gray-600 text-left -mt-4">
              Forgot Password? Reset it.
            </a>

          </div>

          {error && <p className="text-red-500 text-[10px] mt-4">{error}</p>}

          <button
            onClick={handleLogin}
            disabled={loading}
            className="mt-2 w-full bg-[#0f172a] text-white py-3 rounded-2xl text-sm hover:cursor-pointer font-medium disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Log In"}
          </button>

          <div className="my-6 text-center text-gray-500 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <span className="relative bg-white px-4 text-sm">Or</span>
          </div>

          <div className="flex gap-4">
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

          <p className="mt-6 text-center text-xs text-gray-500">
            By continuing you agree to Wholesale Naija's <br />
            <a href="#" className="underline">Terms of Service</a> and <a href="#" className="underline">Privacy Policies</a>
          </p>
        </motion.div>
      </motion.div>

      {/* Auto-redirect success modal */}
      <SuccessModal
        isOpen={showSuccess}
        userRole={userRole}
      />
    </>
  );
}
