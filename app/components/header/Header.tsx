'use client';

import Link from 'next/link';
import Image from 'next/image';
// FIX 1: Import 'useCallback' to correctly define dependency functions.
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Menu, ChevronRight, SearchIcon } from 'lucide-react';
import Sidebar from '../../components/sidebar/Sidebar';
import { AnimatePresence } from 'framer-motion';
import ChooseModal from '../auth/modals/ChooseModal';
import SignupWithEmailModal from '../auth/modals/signup/SignupWithEmailModal';
import VerifyPhoneOrEmailOtpModal from '../auth/modals/VerifyPhoneOrEmailOtpModal';
import LoginWithEmailModal from '../auth/modals/login/LoginWithEmailModal';
import CompleteProfileModal from '../auth/modals/signup/CompleteProfileModal';
import { fetchWithToken } from '@/app/utils/fetchWithToken';
import { useRouter } from 'next/navigation';
import LoginAlertModal from '../auth/modals/login/LoginAlertModal';

interface UserProfile {
  fullName: string;
  role: 'buyer' | 'seller';
  profilePicture?: { url: string };
}

interface Product {
  _id: string;
  name: string;
  price: number;
  images: string[];
}

// Define AbortError type for the catch block type guard
interface AbortError extends Error {
  name: 'AbortError';
}

export default function Header() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Signup & Login states
  const [signupChooseModalOpen, setSignupChooseModalOpen] = useState(false);
  const [signupEmailOpen, setSignupEmailOpen] = useState(false);
  const [otpModalOpen, setOtpModalOpen] = useState(false);
  const [otpIdentifier, setOtpIdentifier] = useState('');
  const [completeProfileOpen, setCompleteProfileOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [loginEmailOpen, setLoginEmailOpen] = useState(false);
  const [loginAlertOpen, setLoginAlertOpen] = useState(false);

  const [query, setQuery] = useState('');
  const [focused, setFocused] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  // Wallet balance state
  const [walletBalance, setWalletBalance] = useState<number>(0);
  const [balanceLoading, setBalanceLoading] = useState<boolean>(true);

  const navigateToWallet = () => {
    router.push('/wallet');
  };

  const fetchWalletBalance = async () => {
    try {
      setBalanceLoading(true);
      const res = await fetchWithToken<{ wallet: { balance: number } }>(
        '/wallet'
      );
      if (res?.wallet?.balance !== undefined)
        setWalletBalance(res.wallet.balance);
    } catch (_err) {
    } finally {
      setBalanceLoading(false);
    }
  };

  // Wrap loadUserProfile in useCallback for useEffect dependency (L66)
  const loadUserProfile = useCallback(async () => {
    try {
      const res = await fetchWithToken<{ user: UserProfile }>('/auth/profile');
      if (res?.user) {
        setUser(res.user);
        // fetchWalletBalance depends on loadUserProfile, but fetchWalletBalance doesn't change, so this is okay.
        fetchWalletBalance();
      }
    } catch {
      setBalanceLoading(false);
    }
  }, []);

  // Load token and user profile
  useEffect(() => {
    const t = localStorage.getItem('token');
    setToken(t);
    if (t)
      loadUserProfile(); // FIX 1: loadUserProfile is now included in dependencies below
    else setBalanceLoading(false);
  }, [loadUserProfile]); // FIX 1: Added loadUserProfile to dependency array

  const openEmailModal = () => {
    const t = localStorage.getItem('token');
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

  // Search products from API
  useEffect(() => {
    const controller = new AbortController();
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    const fetchSearch = async () => {
      try {
        const res = await fetchWithToken<{ products: Product[] }>(
          `/v1/products/search?q=${encodeURIComponent(query)}&page=1&limit=10`,
          { signal: controller.signal }
        );
        if (res?.products) setSearchResults(res.products);
      } catch (err: unknown) {
        // FIX 2: Used 'unknown' instead of 'any'
        // Type guard for AbortError
        if (err instanceof Error && (err as AbortError).name !== 'AbortError') {
          console.error(err);
        }
      }
    };

    fetchSearch();
    return () => controller.abort();
  }, [query]);

  const handleSelectProduct = (id: string) => {
    router.push(`/product/${id}`);
    setFocused(false);
    setQuery('');
  };

  return (
    <>
      {/* Hero Banner */}
      <div className="bg-[url('https://res.cloudinary.com/dqtjja88b/image/upload/v1760883994/3680b6919f2237dd1d7bcfe119a8522af6738e96_2_gtqmc2.jpg')] bg-cover bg-center h-20 sm:h-20 md:h-24 relative overflow-hidden">
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
              <Image
                src="/svgs/playstore.svg"
                alt="play store"
                height={130}
                width={130}
              />
            </button>
            <button>
              <Image
                src="/svgs/apple.svg"
                alt="apple store"
                height={130}
                width={130}
              />
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
            className="w-full px-3 sm:px-4 py-3 sm:py-4 bg-white rounded-xl sm:rounded-2xl text-sm sm:text-base text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500 pr-12 sm:pr-14"
          />

          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-slate-900 p-2 rounded-full cursor-pointer">
            <SearchIcon height={20} width={20} className="text-white" />
          </div>

          {focused && searchResults.length > 0 && (
            <div className="absolute z-50 w-full mt-1 bg-white rounded-xl shadow-lg max-h-60 overflow-y-auto">
              {searchResults.map((product) => (
                <div
                  key={product._id}
                  onClick={() => handleSelectProduct(product._id)}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 cursor-pointer"
                >
                  <Image
                    src={product.images[0] || '/svgs/logo.svg'}
                    alt={product.name}
                    width={50}
                    height={50}
                    className="w-12 h-12 object-cover rounded-lg"
                  />
                  <div className="flex flex-col truncate">
                    <span className="text-sm font-medium text-gray-800 truncate">
                      {product.name}
                    </span>
                    <span className="text-xs text-gray-500">
                      ₦{product.price.toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Auth & Wallet Buttons */}
        <div className="flex gap-3 w-full md:w-auto items-center">
          {user ? (
            <>
              <button
                onClick={() => router.push('/product/saved')}
                className="p-2 text-white hover:text-gray-300"
              >
                <Image
                  src="/svgs/heart.svg"
                  alt="heart"
                  width={40}
                  height={40}
                />
              </button>

              <button
                onClick={() => router.push('/messages')}
                className="p-2 text-white hover:text-gray-300"
              >
                <Image
                  src="/svgs/message.svg"
                  alt="message"
                  width={40}
                  height={40}
                />
              </button>

              <button
                onClick={navigateToWallet}
                className="flex items-center gap-2 bg-gray-700 text-white px-2 py-2 rounded-2xl font-semibold"
              >
                <Image
                  src="/svgs/coin-1.svg"
                  alt="coin"
                  width={25}
                  height={25}
                />
                {balanceLoading ? (
                  <p className="text-xs animate-pulse">...</p>
                ) : (
                  <p className="text-xs">{walletBalance} Coins</p>
                )}
              </button>

              <button
                onClick={() =>
                  router.push(
                    user?.role === 'seller' ? '/store/dashboard' : '/profile'
                  )
                }
                className="flex items-center gap-2 bg-gray-700 rounded-full px-3 py-2 hover:bg-gray-600 transition"
              >
                <div className="w-8 h-8 sm:w-9 sm:h-9 relative flex-shrink-0">
                  <Image
                    src={user.profilePicture?.url || '/svgs/logo.svg'}
                    alt="User"
                    fill
                    className="rounded-full object-cover"
                  />
                </div>
                <span className="text-sm sm:text-base text-white truncate max-w-[120px]">
                  {user.fullName.length > 15
                    ? user.fullName.slice(0, 15) + '...'
                    : user.fullName}
                </span>
                <ChevronRight color="white" />
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setLoginModalOpen(true)}
                className="flex-1 md:flex-initial border border-white text-white px-6 py-3 rounded-xl hover:bg-white hover:text-slate-800 transition"
              >
                Login
              </button>
              <button
                onClick={openEmailModal}
                className="flex-1 md:flex-initial bg-white text-slate-800 px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 transition"
              >
                Create Account
              </button>
            </>
          )}
        </div>
      </div>

      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      <AnimatePresence>
        {loginModalOpen && (
          <ChooseModal
            key="login-modal"
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
            key="signup-choose-modal"
            isOpen={signupChooseModalOpen}
            onClose={() => setSignupChooseModalOpen(false)}
            onSelectBuyer={() => {
              // FIX 3: Wrapped expressions in {}
              localStorage.setItem('selectedRole', 'buyer');
              setSignupChooseModalOpen(false);
              token ? setLoginModalOpen(true) : setSignupEmailOpen(true);
            }}
            onSelectSeller={() => {
              // FIX 3: Wrapped expressions in {}
              localStorage.setItem('selectedRole', 'seller');
              setSignupChooseModalOpen(false);
              token ? setLoginModalOpen(true) : setSignupEmailOpen(true);
            }}
            onOpenLogin={() => {}}
          />
        )}
        {loginEmailOpen && (
          <LoginWithEmailModal
            key="login-email-modal"
            isOpen={loginEmailOpen}
            onClose={() => setLoginEmailOpen(false)}
          />
        )}
        {signupEmailOpen && (
          <SignupWithEmailModal
            key="signup-email-modal"
            isOpen={signupEmailOpen}
            onClose={() => setSignupEmailOpen(false)}
            onContinue={handleContinueWithEmail}
          />
        )}
        {otpModalOpen && (
          <VerifyPhoneOrEmailOtpModal
            key="otp-modal"
            isOpen={otpModalOpen}
            type="email"
            identifier={otpIdentifier}
            onClose={() => setOtpModalOpen(false)}
            onVerified={handleOtpVerified}
          />
        )}
        {completeProfileOpen && (
          <CompleteProfileModal
            key="complete-profile-modal"
            isOpen={completeProfileOpen}
            onClose={() => setCompleteProfileOpen(false)}
            onOpenLoginModal={() => setLoginEmailOpen(true)}
          />
        )}
        {loginAlertOpen && (
          <LoginAlertModal
            key="login-alert-modal"
            isOpen={loginAlertOpen}
            onClose={() => setLoginAlertOpen(false)}
            onOpenChooseModal={() => setSignupChooseModalOpen(true)}
          />
        )}
      </AnimatePresence>

      {focused && (
        <div className="fixed inset-0 z-40" onClick={() => setFocused(false)} />
      )}
    </>
  );
}
