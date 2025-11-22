"use client";
import React, { useState, useRef, useEffect } from "react";
import { X } from "lucide-react";
import { motion } from "framer-motion";

interface VerifyOtpModalProps {
  isOpen: boolean;
  onClose?: () => void;
  type: "phone" | "email";
  identifier: string;
  onVerified?: () => void; // NEW: called after OTP verification
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

export default function VerifyPhoneOrEmailOtpModal({
  isOpen,
  onClose,
  type,
  identifier,
  onVerified,
}: VerifyOtpModalProps) {
  const [code, setCode] = useState(["", "", "", ""]); // 4-digit code
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputRefs.current = Array(4).fill(null);
  }, []);

  if (!isOpen) return null;

  const handleChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value && index < 3) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const maskedIdentifier =
    type === "phone"
      ? identifier.replace(/\d(?=\d{4})/g, "*")
      : identifier.replace(/(.{2}).*(@.*)/, "$1***$2");

  const lastFour = maskedIdentifier.slice(-4);

  // NEW: handle OTP submission
  const handleVerify = () => {
    if (code.every((digit) => digit !== "")) {
      // Trigger parent callback
      onVerified?.();
    } else {
      alert("Please enter all 4 digits.");
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
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X size={24} />
        </button>

        <div className="text-center mt-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Confirm your {type === "phone" ? "phone number" : "email address"}
          </h2>

          <div className="text-5xl mb-4">{type === "phone" ? "☎️" : "✉️"}</div>

          <p className="text-gray-600 text-sm">
            We've sent an OTP to your {type === "phone" ? "number" : "email"} ending in{" "}
            <span className="font-medium">{lastFour}</span>
          </p>

          {/* OTP Inputs */}
<div className="flex gap-3 mt-8 justify-center">
  {Array.from({ length: 4 }).map((_, i) => (
    <input
      key={i}
      ref={(el) => { inputRefs.current[i] = el; }} // <-- fix
      type="text"
      maxLength={1}
      value={code[i]}
      onChange={(e) => handleChange(i, e.target.value)}
      onKeyDown={(e) => handleKeyDown(i, e)}
      className="w-[90px] h-[90px] text-center text-2xl font-medium bg-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-gray-900"
    />
  ))}
</div>


          <button className="text-sm text-gray-600 mt-4 block">
            Didn't get the code? Resend in 30s
          </button>
        </div>

        {/* Submit */}
        <button
          onClick={handleVerify} // call new handler
          className="w-full hover:cursor-pointer bg-gray-900 text-white py-4 rounded-2xl text-lg font-medium mt-8"
        >
          Verify Code
        </button>
      </motion.div>
    </motion.div>
  );
}
