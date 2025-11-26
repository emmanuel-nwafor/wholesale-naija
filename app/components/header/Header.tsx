"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useRef } from "react";
import { Menu } from "lucide-react";
import Sidebar from "../../components/sidebar/Sidebar";
import { AnimatePresence } from "framer-motion";
import ChooseModal from "../auth/modals/ChooseModal";
import SignupWithEmailModal from "../auth/modals/signup/SignupWithEmailModal";
import VerifyPhoneOrEmailOtpModal from "../auth/modals/VerifyPhoneOrEmailOtpModal";
import LoginWithEmailModal from "../auth/modals/login/LoginWithEmailModal";
import { usePathname } from "next/navigation";
import CompleteProfileModal from "../auth/modals/signup/CompleteProfileModal";

const suggestions = [
  "iPhone 15 Pro Max",
  "iPhone 14 Pro",
  "iPhone Chargers",
  "iPhone Cases",
];

export default function Header() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Signup states
  const [signupEmailOpen, setSignupEmailOpen] = useState(false);
  const [otpModalOpen, setOtpModalOpen] = useState(false);
  const [otpIdentifier, setOtpIdentifier] = useState("");
  const [completeProfileOpen, setCompleteProfileOpen] = useState(false);

  // Login states
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [loginEmailOpen, setLoginEmailOpen] = useState(false);

  // Create Account ChooseModal state
  const [signupChooseModalOpen, setSignupChooseModalOpen] = useState(false);
  const [isTokenExist, setIsTokenExist] = useState(false);

  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const pathname = usePathname();

  const filtered = suggestions.filter((s) =>
    s.toLowerCase().includes(query.toLowerCase())
  );

  // Signup helpers
  const openEmailModal = () => {
    const token = localStorage.getItem("token");
    setIsTokenExist(!!token);
    setSignupChooseModalOpen(true); 
  };

  const handleContinueWithEmail = (email: string) => {
    setOtpIdentifier(email);
    setOtpModalOpen(true);
    setSignupEmailOpen(false);
  };

  const handleOtpVerified = () => {
    setOtpModalOpen(false);
    setCompleteProfileOpen(true);
  };

  return (
    <>
      {/* Hero Banner */}
      <div className="bg-[url('https://res.cloudinary.com/dqtjja88b/image/upload/v1760883994/3680b6919f2237dd1d7bcfe119a8522af6738e96_2_gtqmc2.jpg')] bg-cover bg-center h-24 sm:h-28 md:h-32 relative overflow-hidden">
        <div className="relative z-10 flex items-center justify-between px-2 sm:px-4 md:px-10 h-full">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/svgs/logo.svg"
              alt="Wholesale Naija"
              width={170}
              height={48}
              className="h-12 sm:h-14 md:h-16 w-auto"
            />
          </Link>

          <div className="hidden md:flex space-x-2">
            <button>
              <Image src="/svgs/playstore.svg" alt="play store" height={130} width={130} />
            </button>
            <button>
              <Image src="/svgs/apple.svg" alt="apple store" height={130} width={130} />
            </button>
          </div>

          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden p-1 sm:p-2 text-white"
          >
            <Menu className="w-5 sm:w-6 h-5 sm:h-6" />
          </button>
        </div>
      </div>

      {/* Search + Auth Bar */}
      <div className="bg-slate-800 px-2 sm:px-4 md:px-10 py-3 sm:py-4 flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative flex-1 w-full md:max-w-md">
          <input
            ref={inputRef}
            type="text"
            placeholder="Search for products"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setFocused(true)}
            className="w-full px-3 sm:px-4 py-3 sm:py-4 bg-white rounded-xl sm:rounded-2xl text-sm sm:text-base text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500 pr-10 sm:pr-12"
          />
        </div>

        <div className="flex gap-3 w-full md:w-auto">
          <button
            onClick={() => setLoginModalOpen(true)}
            className="flex-1 md:flex-initial border border-white text-white px-6 py-3 rounded-xl hover:cursor-pointer hover:bg-white hover:text-slate-800 transition"
          >
            Login
          </button>

          <button
            onClick={openEmailModal}
            className="flex-1 md:flex-initial bg-white text-slate-800 px-6 py-3 rounded-xl font-semibold hover:cursor-pointer hover:bg-gray-100 transition"
          >
            Create Account
          </button>
        </div>
      </div>

      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      <AnimatePresence>
        {/* Login Choose Buyer/Seller */}
        {loginModalOpen && (
          <ChooseModal
            isOpen={loginModalOpen}
            onClose={() => setLoginModalOpen(false)}
            onSelectBuyer={() => {}}
            onSelectSeller={() => {}}
            onOpenLogin={() => {
              setLoginEmailOpen(true); 
              setLoginModalOpen(false); 
            }}
          />
        )}

        {/* Create Account ChooseModal */}
        {signupChooseModalOpen && (
          <ChooseModal
            isOpen={signupChooseModalOpen}
            onClose={() => setSignupChooseModalOpen(false)}
            onSelectBuyer={() => {
              localStorage.setItem("selectedRole", "buyer");
              setSignupChooseModalOpen(false);
              isTokenExist ? setLoginModalOpen(true) : setSignupEmailOpen(true);
            }}
            onSelectSeller={() => {
              localStorage.setItem("selectedRole", "seller");
              setSignupChooseModalOpen(false);
              isTokenExist ? setLoginModalOpen(true) : setSignupEmailOpen(true);
            }}
            onOpenLogin={() => {}}
          />
        )}

        {/* Login Email */}
        {loginEmailOpen && (
          <LoginWithEmailModal
            isOpen={loginEmailOpen}
            onClose={() => setLoginEmailOpen(false)}
            onSwitchToPhone={undefined} 
            onLogin={(email: string, password: string) => {
              console.log("Login with email:", email, password);
            }}
          />
        )}

        {/* Signup Email */}
        {signupEmailOpen && (
          <SignupWithEmailModal
            isOpen={signupEmailOpen}
            onClose={() => setSignupEmailOpen(false)}
            onContinue={handleContinueWithEmail}
          />
        )}

        {/* OTP */}
        {otpModalOpen && (
          <VerifyPhoneOrEmailOtpModal
            isOpen={otpModalOpen}
            type="email"
            identifier={otpIdentifier}
            onClose={() => setOtpModalOpen(false)}
            onVerified={handleOtpVerified}
          />
        )}

        {/* Complete Profile */}
        {completeProfileOpen && (
          <CompleteProfileModal
            isOpen={completeProfileOpen}
            onClose={() => setCompleteProfileOpen(false)}
          />
        )}
      </AnimatePresence>

      {focused && (
        <div className="fixed inset-0 z-40" onClick={() => setFocused(false)} />
      )}
    </>
  );
}
