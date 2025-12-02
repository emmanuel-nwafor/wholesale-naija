'use client';
import React, { useState, useRef, useEffect } from 'react';
import { X } from 'lucide-react';
import { motion } from 'framer-motion';

interface VerifyOtpModalProps {
  isOpen: boolean;
  onClose?: () => void;
  type: 'phone' | 'email';
  identifier: string;
  onVerified?: () => void;
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

const API_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/verify-otp`;

export default function VerifyPhoneOrEmailOtpModal({
  isOpen,
  onClose,
  type,
  identifier,
  onVerified,
}: VerifyOtpModalProps) {
  const [code, setCode] = useState(['', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputRefs.current = Array(4).fill(null);
  }, []);

  if (!isOpen) return null;

  const handleChange = (index: number, value: string) => {
    // Only allow digits
    if (!/^\d?$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const paste = e.clipboardData.getData('text').trim().slice(0, 4);
    if (/^\d{1,4}$/.test(paste)) {
      const newCode = paste.split('');
      setCode([...newCode, '', '', '', ''].slice(0, 4));
      newCode.forEach((_, i) => inputRefs.current[i]?.focus());
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const maskedIdentifier =
    type === 'phone'
      ? identifier.replace(/\d(?=\d{4})/g, '*')
      : identifier.replace(/(.{2}).*(@.*)/, '$1***$2');

  const lastFour = maskedIdentifier.slice(-4);

  const handleVerify = async () => {
    if (!code.every((digit) => digit !== '')) {
      setError('Please enter all 4 digits.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: identifier, code: code.join('') }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || 'OTP verification failed');

      // Success → trigger parent callback
      onVerified?.();
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

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
        className="w-full max-w-[28rem] bg-white rounded-2xl p-6 shadow-xl max-h-[90vh] overflow-y-auto relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X size={24} />
        </button>

        <div className="mt-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Confirm your {type === 'phone' ? 'phone number' : 'email address'}
          </h2>

          <div className="text-5xl mb-4">{type === 'phone' ? '☎️' : '✉️'}</div>

          <p className="text-gray-600 text-sm">
            We've sent an OTP to your {type === 'phone' ? 'number' : 'email'}{' '}
            ending in <span className="font-medium">{lastFour}</span>
          </p>

          <div className="flex gap-3 mt-8 justify-center">
            {Array.from({ length: 4 }).map((_, i) => (
              <input
                key={i}
                ref={(el) => {
                  inputRefs.current[i] = el;
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={code[i]}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                onPaste={handlePaste}
                className="w-[90px] h-[90px] text-center text-2xl font-medium bg-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-gray-900"
              />
            ))}
          </div>

          {error && (
            <p className="text-red-500 text-sm text-center mt-2">{error}</p>
          )}

          <button
            onClick={handleVerify}
            disabled={loading}
            className={`w-full mt-8 py-4 rounded-2xl text-sm hover:cursor-pointer font-medium ${
              loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gray-900 text-white hover:bg-gray-800'
            }`}
          >
            {loading ? 'Verifying...' : 'Verify Code'}
          </button>

          <button className="text-sm text-gray-600 mt-4 block">
            Didn't get the code? Resend in 30s
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
