// Header.tsx (updated)
"use client";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Search, Menu, X } from "lucide-react";
import Sidebar from "../../components/sidebar/Sidebar";
import { AnimatePresence } from "framer-motion";
import ChooseModal from "../auth/modals/ChooseModal";

export default function Header() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <div className="bg-[url('https://res.cloudinary.com/dqtjja88b/image/upload/v1760883994/3680b6919f2237dd1d7bcfe119a8522af6738e96_2_gtqmc2.jpg')] bg-cover bg-center h-24 sm:h-28 md:h-32 relative overflow-hidden">
        <div className="relative z-10 flex items-center justify-between px-2 sm:px-4 md:px-10 h-full">
          <Link href="/">
            <Image
              src="https://res.cloudinary.com/dqtjja88b/image/upload/v1760219419/Screenshot_2025-10-11_224658_q8bjy2.png"
              alt="Wholesale Naija"
              width={170}
              height={64}
              className="h-12 sm:h-14 md:h-16 w-auto"
            />
          </Link>
          <div className="hidden md:flex space-x-2">
            <button className="bg-white text-black p-2 rounded-2xl flex items-center space-x-1 text-xs sm:text-sm">
              <Image
                src="https://th.bing.com/th/id/OIP.8LeaM8UJ_yM4QPfb3wrecgHaHa?w=212&h=212&c=7&r=0&o=7&cb=12&pid=1.7&rm=3"
                alt="Google Play"
                width={24}
                height={24}
                className="h-5 sm:h-6"
              />
              <span className="text-left">
                <p className="text-xs">GET IT ON</p>
                <p className="font-semibold text-sm">Google Play</p>
              </span>
            </button>
            <button className="bg-white text-black p-2 rounded-2xl flex items-center space-x-1 text-xs sm:text-sm">
              <Image
                src="data:image/webp;base64,UklGRnwDAABXRUJQVlA4IHADAACwGACdASqjALQAPp1Mo00lpCMiI3Eo8LATiWlu4W8RtHXYx/jccj1ZiOnM7hpU7mF+Xjm2/M/9D/3fcI6IX7hew9+u4rfFwAbEZtp+4ANiM2bY1Zhm5WPT+cNYAJJiptjcZoNLtj5d7YDyRDRQaX32TSGH0fyXVSLE5Ypl80xfuT0QjOOIH3/yxDkZkbPQTXE2Pb10ynTnFj9+rxdWhx6TFoAZpJbbLC/zNTcvMK3YISWhgPSmkxV8CIWZ3dvTOHmB0e4uADYjNtP3ABsPgAD+/kGACde0TF6L88ZwNYFacFE/kXwKmhSNxPHPD6nybS0Dwj+IplM8MjAu7nvKxp38JsujTdKfT0dyEz1KW3+673BhlJWji8hsVcQ+X3yiU0m7BxXTucYtGjzAixx/bm/+RvfnotcB0f666xj6LrIOJwBCW1ykSXgyDlfSsFzFoSeVQzNkff/mBASvqK9t+lOB1fLghNG6+DZoFT8kZXT3tQBakk9lG4yX/Zn0JYPGZV7RuuHbLB9g7JXkQsQCkt4b3UfIyDxGTj751NL16gOmcPtrdDHL5kRlgtWnKxgjuzFDqB6CZfQ6g48RmLS4mg1QAiQcPaiH72rTK13ZvERwPGLO9J6yWFptPcbVsiHt0jqnKJxr6boHSM98t+Jt5svUuG/kvqavXiay9Ou+OUW+nYLS+x4hvhw/HBo8SqQDeMT46G7fppB7N1pYmV86wjap0ndNa+LRI3Dlj6i3n1S91gNOx/oN/0hLyI5dhfyb7WnX/isqky2/3fCp4jFXb46Jmz1tYtq/psX73pW8p6DGqTRnCXsfnWZiIm6m8tbYG3Ka2i2A64i99eC6OuyfpzLtI3+9dMsHsZXBO7S1T1w0FQ73Sk42dwM1+SRoo/yfYSt3zmX2IAu+RyETpCsySQdU9UPiP4B48x3RpcrZnHdboSQmsLBQcFd20Hb1dn9UkSt3IL54R4SghD3ScHj8LONSOOFP4Y56PcqH/9m97sXZaFnqAj0Y/sdUSgcS579XtkrUmv/3tLXNxRRphGgJUYgTzZw8j43C9uXal3CleqDlK4+OHelUaVvvGw12Z0PkOsF769R6P1OCpEyonF/5bm9zfUchyUaSsuyQGwqDBpbXkAefy/ZhSXvAOENS1YIY6c+JTy2gcdqK7SLVhrRMAAAA"
                alt="App Store"
                width={24}
                height={24}
                className="h-5 sm:h-6"
              />
              <span className="text-left">
                <p className="text-xs">Download on the</p>
                <p className="font-semibold text-sm">App Store</p>
              </span>
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