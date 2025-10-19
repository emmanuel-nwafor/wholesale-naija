import Link from 'next/link';
import React from 'react';

export default function Header() {
  return (
    <>
      <div className="bg-[url('https://res.cloudinary.com/dqtjja88b/image/upload/v1760883994/3680b6919f2237dd1d7bcfe119a8522af6738e96_2_gtqmc2.jpg')] bg-cover bg-center h-32 relative overflow-hidden">
        <div className="relative z-10 flex items-center justify-between px-10 h-full">
          <img
            src="https://res.cloudinary.com/dqtjja88b/image/upload/v1760219419/Screenshot_2025-10-11_224658_q8bjy2.png"
            alt="Wholesale Naija"
            className="h-16"
          />
          <div className="flex space-x-2">
            <button className="bg-white text-black p-2 rounded-2xl flex items-center space-x-1">
              <img
                src="https://th.bing.com/th/id/OIP.8LeaM8UJ_yM4QPfb3wrecgHaHa?w=212&h=212&c=7&r=0&o=7&cb=12&pid=1.7&rm=3"
                alt="Google Play"
                className="h-6"
              />
              <span className="text-left">
                <p className="text-sm">GET IT ON</p>
                <p className="font-semibold text-lg">Google Play</p>
              </span>
            </button>

            <button className="bg-white text-black p-2 rounded-2xl flex items-center space-x-1">
              <img
                src="data:image/webp;base64,UklGRnwDAABXRUJQVlA4IHADAACwGACdASqjALQAPp1Mo00lpCMiI3Eo8LATiWlu4W8RtHXYx/jccj1ZiOnM7hpU7mF+Xjm2/M/9D/3fcI6IX7hew9+u4rfFwAbEZtp+4ANiM2bY1Zhm5WPT+cNYAJJiptjcZoNLtj5d7YDyRDRQaX32TSGH0fyXVSLE5Ypl80xfuT0QjOOIH3/yxDkZkbPQTXE2Pb10ynTnFj9+rxdWhx6TFoAZpJbbLC/zNTcvMK3YISWhgPSmkxV8CIWZ3dvTOHmB0e4uADYjNtP3ABsPgAD+/kGACde0TF6L88ZwNYFacFE/kXwKmhSNxPHPD6nybS0Dwj+IplM8MjAu7nvKxp38JsujTdKfT0dyEz1KW3+673BhlJWji8hsVcQ+X3yiU0m7BxXTucYtGjzAixx/bm/+RvfnotcB0f666xj6LrIOJwBCW1ykSXgyDlfSsFzFoSeVQzNkff/mBASvqK9t+lOB1fLghNG6+DZoFT8kZXT3tQBakk9lG4yX/Zn0JYPGZV7RuuHbLB9g7JXkQsQCkt4b3UfIyDxGTj751NL16gOmcPtrdDHL5kRlgtWnKxgjuzFDqB6CZfQ6g48RmLS4mg1QAiQcPaiH72rTK13ZvERwPGLO9J6yWFptPcbVsiHt0jqnKJxr6boHSM98t+Jt5svUuG/kvqavXiay9Ou+OUW+nYLS+x4hvhw/HBo8SqQDeMT46G7fppB7N1pYmV86wjap0ndNa+LRI3Dlj6i3n1S91gNOx/oN/0hLyI5dhfyb7WnX/isqky2/3fCp4jFXb46Jmz1tYtq/psX73pW8p6DGqTRnCXsfnWZiIm6m8tbYG3Ka2i2A64i99eC6OuyfpzLtI3+9dMsHsZXBO7S1T1w0FQ73Sk42dwM1+SRoo/yfYSt3zmX2IAu+RyETpCsySQdU9UPiP4B48x3RpcrZnHdboSQmsLBQcFd20Hb1dn9UkSt3IL54R4SghD3ScHj8LONSOOFP4Y56PcqH/9m97sXZaFnqAj0Y/sdUSgcS579XtkrUmv/3tLXNxRRphGgJUYgTzZw8j43C9uXal3CleqDlK4+OHelUaVvvGw12Z0PkOsF769R6P1OCpEyonF/5bm9zfUchyUaSsuyQGwqDBpbXkAefy/ZhSXvAOENS1YIY6c+JTy2gcdqK7SLVhrRMAAAA"
                alt="Google Play"
                className="h-6"
              />
              <span className="text-left">
                <p className="text-sm">Download on the</p>
                <p className="font-semibold text-lg">Apple Store</p>
              </span>
            </button>
          </div>
        </div>

        {/* <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-slate-800 to-transparent"></div> */}
      </div>

      <div className="bg-slate-800 px-10 py-4 flex items-center justify-between">
        <div className="relative flex-1 max-w-md mx-2">
          <input
            type="text"
            placeholder="Search for products"
            className="w-full px-4 py-3 bg-white rounded-full text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500 pl-12"
          />
          <div className="absolute left-4 top-3.5 text-gray-500">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>
        <div className="flex space-x-2">
          <Link href="/login">
            <button className="bg-transparent border border-white text-white px-8 py-5 rounded-2xl hover:bg-white hover:text-slate-800 transition">
              Login
            </button>
          </Link>
          <Link href="/signup">
            <button className="bg-white text-slate-800 px-6 py-5 rounded-2xl font-semibold hover:bg-gray-100 transition">
              Create Account
            </button>
          </Link>
        </div>
      </div>
    </>
  );
}
