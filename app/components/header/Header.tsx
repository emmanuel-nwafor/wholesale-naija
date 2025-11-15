// Header.tsx 
"use client";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Search, Menu } from "lucide-react";
import Sidebar from "../../components/sidebar/Sidebar";
import { AnimatePresence } from "framer-motion";
import ChooseModal from "../auth/modals/ChooseModal";
import { usePathname } from "next/navigation";

const getPageTitle = (path: string) => {
  const map: Record<string, string> = {
    "/": "Home",
    "/products": "Products",
    "/store/dashboard": "Dashboard",
    "/store/products": "Products",
    "/store/messages": "Messages",
  };
  return map[path] || "";
};

export default function Header() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const pathname = usePathname();
  const pageTitle = getPageTitle(pathname);

  return (
    <>
      {/* Hero Banner */}
      <div className="bg-[url('https://res.cloudinary.com/dqtjja88b/image/upload/v1760883994/3680b6919f2237dd1d7bcfe119a8522af6738e96_2_gtqmc2.jpg')] bg-cover bg-center h-24 sm:h-28 md:h-32 relative overflow-hidden">
        <div className="relative z-10 flex items-center justify-between px-2 sm:px-4 md:px-10 h-full">
          {/* Logo - Always visible */}
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/svgs/logo.svg"
              alt="Wholesale Naija"
              width={170}
              height={48}
              className="h-12 sm:h-14 md:h-16 w-auto"
            />
          </Link>

          {/* Store Buttons - Desktop only */}
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
                alt="play store"
                height={130}
                width={130}
               />
            </button>
          </div>

          {/* Mobile Menu Button */}
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
            type="text"
            placeholder="Search for products"
            className="w-full px-3 sm:px-4 py-3 sm:py-4 bg-white rounded-xl sm:rounded-2xl text-sm sm:text-base text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500 pr-10 sm:pr-12"
          />
          <div className="absolute right-3 sm:right-4 top-3.5 sm:top-4 text-gray-500">
            <Search className="w-4 sm:w-5 h-4 sm:h-5" />
          </div>
        </div>

        <div className="flex gap-2 w-full md:w-auto justify-stretch md:justify-start">
          <button
            onClick={() => setModalOpen(true)}
            className="flex-1 md:flex-initial bg-transparent border border-white text-white px-3 sm:px-4 py-2 sm:py-3 rounded-xl sm:rounded-2xl hover:bg-white hover:text-slate-800 transition text-sm sm:text-base"
          >
            Login
          </button>
          <Link href="/signup" className="flex-1 md:flex-initial">
            <button className="w-full bg-white text-slate-800 px-3 sm:px-4 py-2 sm:py-3 rounded-xl sm:rounded-2xl font-semibold hover:bg-gray-100 transition text-sm sm:text-base">
              Create Account
            </button>
          </Link>
        </div>
      </div>

      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      <AnimatePresence>
        <ChooseModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
      </AnimatePresence>
    </>
  );
}