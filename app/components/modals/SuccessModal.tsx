'use client';
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface SuccessModalProps {
  isOpen: boolean;
  userRole: string;
}

const overlayVariants = { hidden: { opacity: 0 }, visible: { opacity: 1 } };
const contentVariants = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: { scale: 1, opacity: 1 },
};

export default function SuccessModal({ isOpen, userRole }: SuccessModalProps) {
  const router = useRouter();

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        if (userRole === 'seller') router.push('/store/dashboard');
        else router.push('/profile');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, userRole, router]);

  if (!isOpen) return null;

  return (
    <motion.div
      variants={overlayVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
    >
      <motion.div
        variants={contentVariants}
        className="relative w-full max-w-md bg-white rounded-3xl p-10 text-center shadow-2xl"
      >
        <Image
          src={`/svgs/modal-success.svg`}
          alt="success svg"
          height={44}
          width={44}
          className="mx-auto mb-3"
        />
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          Login Successful!
        </h2>
        <p className="text-gray-600">Redirecting shortly...</p>
      </motion.div>
    </motion.div>
  );
}
