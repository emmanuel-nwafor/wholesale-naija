'use client';

import React, { useState, useEffect } from 'react';
import { Menu } from 'lucide-react'; // FIX: Removed unused import 'CheckCircle' (L4)
import StoreSidebar from '@/app/components/sidebar/StoreSidebar';
import DashboardHeader from '@/app/components/header/DashboardHeader';
import ProfileSidebar from '@/app/components/sidebar/SellersProfileSidebar';
import OkaySuccessModal from '@/app/components/modals/OkaySuccessModal';
import { fetchWithToken } from '@/app/utils/fetchWithToken';

export default function RequestVerificationPage() {
  const [isMobile, setIsMobile] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const [formData, setFormData] = useState({
    nin: '',
    cacNumber: '',
    businessName: '',
    businessRegNumber: '',
  });

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.nin ||
      !formData.cacNumber ||
      !formData.businessName ||
      !formData.businessRegNumber
    ) {
      alert('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      // NOTE: No specific response type is expected here, so fetchWithToken<void> or similar generic can be used.
      await fetchWithToken('/v1/seller/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      setShowSuccess(true);
      // Reset form
      setFormData({
        nin: '',
        cacNumber: '',
        businessName: '',
        businessRegNumber: '',
      });
    } catch (error: unknown) { // FIX: Replaced 'err: any' with 'error: unknown' (L60)
      const message = error instanceof Error
        ? error.message
        : 'Verification request failed. Please try again.';
      alert(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex min-h-screen">
        <StoreSidebar />
        <div className="flex-1 flex flex-col">
          <DashboardHeader />
          <main className="flex-1 md:ml-64 p-4 md:p-8 bg-gray-50">
            <div className="max-w-5xl">
              {isMobile && (
                <button
                  onClick={() => setMenuOpen(true)}
                  className="mb-6 hover:bg-gray-100 rounded-xl p-2 flex items-center gap-2 text-sm font-medium text-gray-700"
                >
                  <Menu className="w-4 h-4" /> Menu
                </button>
              )}

              <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
                <div className="lg:w-64">
                  <ProfileSidebar
                    isMobile={isMobile}
                    isOpen={menuOpen}
                    setIsOpen={setMenuOpen}
                  />
                </div>

                <div className="flex-1 bg-white rounded-3xl p-6 md:p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">
                      Request Verification
                    </h1>
                  </div>

                  <p className="text-sm text-gray-600 mb-8 max-w-2xl">
                    Get verified to build trust with buyers. Submit your
                    business details for review. Once approved, you&apos;ll get a {/* FIX: Escaped apostrophe (L102) */}
                    verified badge on your store.
                  </p>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        NIN (National Identification Number){' '}
                        <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.nin}
                        onChange={(e) =>
                          setFormData({ ...formData, nin: e.target.value })
                        }
                        placeholder="e.g. 12345678901"
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        CAC Number
                      </label>
                      <input
                        type="text"
                        value={formData.cacNumber}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            cacNumber: e.target.value,
                          })
                        }
                        placeholder="e.g. RC1234567"
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Business Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.businessName}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            businessName: e.target.value,
                          })
                        }
                        placeholder="e.g. Arewa Trading Co."
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Business Registration Number{' '}
                        <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.businessRegNumber}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            businessRegNumber: e.target.value,
                          })
                        }
                        placeholder="e.g. BN123456789"
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                        required
                      />
                    </div>

                    <div className="flex justify-end pt-4">
                      <button
                        type="submit"
                        disabled={loading}
                        className="px-8 py-4 hover:cursor-pointer bg-[#1e293b] text-white rounded-2xl text-sm font-medium hover:bg-[#0f172a] disabled:opacity-70 disabled:cursor-not-allowed transition flex items-center gap-2"
                      >
                        {loading ? (
                          <>
                            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Submitting...
                          </>
                        ) : (
                          'Submit for Verification'
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Success Modal */}
      <OkaySuccessModal
        show={showSuccess}
        onClose={() => setShowSuccess(false)}
        title="Verification Request Submitted!"
      />
    </>
  );
}