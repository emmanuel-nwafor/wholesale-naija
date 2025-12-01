"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { Menu, ChevronRight } from "lucide-react";
import Sidebar from "../../components/sidebar/Sidebar";
import { AnimatePresence } from "framer-motion";
import ChooseModal from "../auth/modals/ChooseModal";
import SignupWithEmailModal from "../auth/modals/signup/SignupWithEmailModal";
import VerifyPhoneOrEmailOtpModal from "../auth/modals/VerifyPhoneOrEmailOtpModal";
import LoginWithEmailModal from "../auth/modals/login/LoginWithEmailModal";
import CompleteProfileModal from "../auth/modals/signup/CompleteProfileModal";
import { fetchWithToken } from "@/app/utils/fetchWithToken";
import { useRouter } from "next/navigation";

const suggestions = [
  "iPhone 15 Pro Max",
  "iPhone 14 Pro",
  "iPhone Chargers",
  "iPhone Cases",
];

interface UserProfile {
  fullName: string;
  role: "buyer" | "seller";
  profilePicture?: {
    url: string;
  };
  store?: {
    name: string;
    bannerUrl: string;
    contactPhone: string;
    location: string;
    address: { street: string };
    openingDays: string;
  };
}

export default function Header() {
  const router = useRouter();

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

  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);

  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = suggestions.filter((s) =>
    s.toLowerCase().includes(query.toLowerCase())
  );

  // Load token and user profile
  useEffect(() => {
    const t = localStorage.getItem("token");
    setToken(t);

    if (t) {
      loadUserProfile(t);
    }
  }, []);

  const loadUserProfile = async (authToken: string) => {
    try {
      const res = await fetchWithToken<{ user: UserProfile }>("/auth/profile");

      if (res?.user) {
        setUser(res.user);
      }
    } catch (err) {
      console.error("Failed to fetch user profile:", err);
    }
  };

  // Signup helpers
  const openEmailModal = () => {
    const t = localStorage.getItem("token");
    setToken(t);
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

        <div className="flex gap-3 w-full md:w-auto items-center">
          {user ? (
            <>
              <button onClick={() => {router.push("")}} className="p-2 hover:cursor-pointer text-white hover:text-gray-300">
                <Image 
                  src={`/svgs/heart.svg`}
                  alt="heart"
                  width={40}
                  height={40}
                />
              </button>
              <button onClick={() => {router.push("/messages")}} className="p-2 hover:cursor-pointer text-white hover:text-gray-300">
                <Image 
                  src={`/svgs/message.svg`}
                  alt="message"
                  width={40}
                  height={40}
                />
              </button>
              <div className="flex items-center gap-2 bg-gray-700 text-white px-3 py-2 rounded-2xl font-semibold">
                <Image 
                  src={`/svgs/coin-1.svg`}
                  alt="message"
                  width={30}
                  height={30}
                />
                115 Coins
              </div>
              <button
                onClick={() => {
                  if (user?.role === "seller") {
                    router.push("/store/dashboard");
                  } else {
                    router.push("/profile");
                  }
                }}
                className="flex items-center gap-2 bg-gray-700 rounded-full px-3 py-2 hover:cursor-pointer hover:bg-gray-600 transition"
              >
                <div className="w-8 h-8 sm:w-9 sm:h-9 relative flex-shrink-0">
                  <Image
                    src={user.profilePicture?.url || "/svgs/logo.svg"}
                    alt="User"
                    fill
                    className="rounded-full object-cover"
                  />
                </div>

                <span className="text-sm sm:text-base text-white truncate max-w-[120px]">
                  {user.fullName.length > 15 ? user.fullName.slice(0, 15) + "..." : user.fullName}
                </span>

                <ChevronRight color="white" />
              </button>
            </>
          ) : (
            <>
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
            </>
          )}
        </div>
      </div>

      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      <AnimatePresence>
        {/* Modals */}
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

        {signupChooseModalOpen && (
          <ChooseModal
            isOpen={signupChooseModalOpen}
            onClose={() => setSignupChooseModalOpen(false)}
            onSelectBuyer={() => {
              localStorage.setItem("selectedRole", "buyer");
              setSignupChooseModalOpen(false);
              token ? setLoginModalOpen(true) : setSignupEmailOpen(true);
            }}
            onSelectSeller={() => {
              localStorage.setItem("selectedRole", "seller");
              setSignupChooseModalOpen(false);
              token ? setLoginModalOpen(true) : setSignupEmailOpen(true);
            }}
            onOpenLogin={() => {}}
          />
        )}

        {loginEmailOpen && (
          <LoginWithEmailModal
            isOpen={loginEmailOpen}
            onClose={() => setLoginEmailOpen(false)}
          />
        )}

        {signupEmailOpen && (
          <SignupWithEmailModal
            isOpen={signupEmailOpen}
            onClose={() => setSignupEmailOpen(false)}
            onContinue={handleContinueWithEmail}
          />
        )}

        {otpModalOpen && (
          <VerifyPhoneOrEmailOtpModal
            isOpen={otpModalOpen}
            type="email"
            identifier={otpIdentifier}
            onClose={() => setOtpModalOpen(false)}
            onVerified={handleOtpVerified}
          />
        )}

        {completeProfileOpen && (
          <CompleteProfileModal
            isOpen={completeProfileOpen}
            onClose={() => setCompleteProfileOpen(false)}
            onOpenLoginModal={() => setLoginEmailOpen(true)}
          />
        )}
      </AnimatePresence>

      {focused && (
        <div className="fixed inset-0 z-40" onClick={() => setFocused(false)} />
      )}
    </>
  );
}
