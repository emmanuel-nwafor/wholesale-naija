// components/modals/LeaveReviewModal.tsx
'use client';

import React, { useState } from 'react';
import { X, Star, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import OkaySuccessModal from './OkaySuccessModal';

interface LeaveReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  sellerName?: string;
  sellerVerified?: boolean;
  storeBannerUrl?: string;
  storeProfileImageUrl?: string; // New prop
  onSuccess?: () => void;
}

export default function LeaveReviewModal({
  isOpen,
  onClose,
  sellerName = 'This Store',
  sellerVerified = false,
  storeBannerUrl = '',
  storeProfileImageUrl = '', // New prop
}: LeaveReviewModalProps) {
  const [rating, setRating] = useState(0);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = () => {
    if (rating === 0 || !comment.trim()) return;

    const sellerId = localStorage.getItem('sellerId');
    const productId = localStorage.getItem('currentProductId');

    if (!sellerId || !productId) {
      alert('Missing store or product information.');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      const newReview = {
        id: Date.now().toString(),
        sellerId,
        storeName: sellerName,
        productId,
        productName: 'Unknown Product',
        productImage: '/placeholder.jpg',
        rating,
        comment: comment.trim(),
        date: new Date().toISOString(),
      };

      const existing = JSON.parse(localStorage.getItem('userReviews') || '[]');
      const updated = [...existing, newReview];
      localStorage.setItem('userReviews', JSON.stringify(updated));

      setShowSuccess(true);
      setLoading(false);
    }, 800);
  };

  const handleCloseSuccess = () => {
    setShowSuccess(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Main Review Modal */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.95 }}
          className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Store Profile Image + Name (positioned over banner) */}
          <div className="px-6 relative z-10">
            {/* header */}
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold mt-4">Leave a Review</h2>

              <div className="flex items-center justify-between px-6 pt-4 pb-3 bg-white">
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="flex items-end gap-4">
              <div className="w-20 h-20 bg-white rounded-full p-1 shadow-lg">
                {storeProfileImageUrl ? (
                  <img
                    src={storeProfileImageUrl}
                    alt={sellerName}
                    className="w-full h-full rounded-full object-cover border-4 border-white"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-300 rounded-full flex items-center justify-center">
                    <span className="text-2xl font-bold text-gray-600">
                      {sellerName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
              <div className="mb-2">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-gray-900">
                    {sellerName}
                  </h3>
                  {sellerVerified && (
                    <Check className="w-5 h-5 bg-green-500 text-white rounded-full p-0.5" />
                  )}
                </div>
                <p className="text-sm text-gray-500">Wholesale Store</p>
              </div>
            </div>
          </div>

          {/* Scrollable Body */}
          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
            {/* Review Textarea */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Review
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your experience with this store..."
                rows={5}
                className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:border-gray-400 resize-none text-sm"
                maxLength={300}
              />
              <div className="flex justify-end mt-1">
                <span className="text-xs text-gray-400">
                  {comment.length}/300
                </span>
              </div>
            </div>

            {/* Rating Stars */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4 text-center">
                {rating >= 5
                  ? 'Excellent'
                  : rating >= 4
                    ? 'Very Good'
                    : rating >= 3
                      ? 'Good'
                      : rating >= 2
                        ? 'Fair'
                        : rating >= 1
                          ? 'Poor'
                          : 'Tap a star to rate'}
              </label>
              <div className="flex justify-center gap-5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoveredStar(star)}
                    onMouseLeave={() => setHoveredStar(0)}
                    className="transition-transform hover:scale-110 active:scale-95"
                  >
                    <Star
                      className={`w-14 h-14 drop-shadow-md transition-all ${
                        star <= (hoveredStar || rating)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="p-6 bg-white border-t border-gray-100">
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 hover:cursor-pointer py-3 border border-gray-300 rounded-xl font-medium hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading || rating === 0 || !comment.trim()}
                className="flex-1 hover:cursor-pointer py-3 bg-slate-900 text-white rounded-xl font-medium hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
              >
                {loading ? (
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  'Submit Review'
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Success Modal */}
      <OkaySuccessModal
        show={showSuccess}
        onClose={handleCloseSuccess}
        title="Review Submitted!"
      />
    </>
  );
}
