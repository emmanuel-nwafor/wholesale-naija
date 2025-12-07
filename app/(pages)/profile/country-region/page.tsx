'use client';

import React, { useState, useEffect } from 'react';

import { Menu, ChevronRight, Check } from 'lucide-react';

import Header from '@/app/components/header/Header';

import BuyersProfileSidebar from '@/app/components/sidebar/BuyersProfileSidebar';

import { fetchWithToken } from '@/app/utils/fetchWithToken';

import {
  Modal,
  StateSelection,
  LGASelection,
  AreaSelection,
} from '@/app/components/modals/LocationsModal';

import CarouselBanner from '@/app/components/carousels/CarouselBanner';

import DynamicHeader from '@/app/components/header/DynamicHeader';

// --- Interface Definition for Type Safety ---
interface UserAddress {
  state?: string;
  city?: string;
  street?: string;
}

interface UserProfile {
  user: {
    address?: UserAddress;
    // ... other user properties
  };
}
// -------------------------------------------


export default function ProfileCountryRegion() {
  const [isMobile, setIsMobile] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [modalStep, setModalStep] = useState<'state' | 'lga' | 'area' | null>(
    null
  );

  const [selectedState, setSelectedState] = useState('');
  const [selectedLGA, setSelectedLGA] = useState('');
  const [selectedArea, setSelectedArea] = useState('');

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Load saved location from API
  useEffect(() => {
    const loadLocation = async () => {
      try {
        // FIX: Replace 'any' with the specific interface
        const data = await fetchWithToken<UserProfile>('/auth/profile');
        const addr = data.user.address || {};
        setSelectedState(addr.state || '');
        setSelectedLGA(addr.city || '');
        setSelectedArea(addr.street || '');
      } catch { // FIX: Remove 'err' to satisfy @typescript-eslint/no-unused-vars
        console.error('Failed to load location');
      } finally {
        setLoading(false);
      }
    };
    loadLocation();
  }, []);

  const openModal = () => setModalStep('state');
  const closeModal = () => setModalStep(null);

  const handleStateSelect = (state: string) => {
    if (state === 'current') {
      setSelectedState('Current Location');
      closeModal();
      return;
    }
    setSelectedState(state);
    setSelectedLGA('');
    setSelectedArea('');
    setModalStep('lga');
  };

  const handleLGASelect = (lga: string) => {
    setSelectedLGA(lga);
    setSelectedArea('');
    setModalStep('area');
  };

  const handleAreaSelect = async (area: string) => {
    setSelectedArea(area);
    closeModal();

    // Save to backend
    setSaving(true);
    try {
      await fetchWithToken('/auth/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          address: {
            state: selectedState,
            city: selectedLGA,
            street: area,
          },
        }),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch { // FIX: Remove 'err' to satisfy @typescript-eslint/no-unused-vars
      alert('Failed to save location. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const displayValue =
    selectedArea || selectedLGA || selectedState || 'Select your location';

  return (
    <>
      <Header />
      <DynamicHeader />

      <div className="flex min-h-screen">
        <div className="flex-1 flex flex-col">
          <main className="flex-1 p-4 md:p-8">
            <div className="max-w-5xl mx-auto">
              {isMobile && (
                <button
                  onClick={() => setMenuOpen(true)}
                  className="mb-6 flex items-center gap-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-xl p-3"
                >
                  <Menu className="w-5 h-5" />
                  Menu
                </button>
              )}

              <div className="flex flex-col lg:flex-row gap-8">
                {isMobile && (
                  <BuyersProfileSidebar
                    isMobile={true}
                    isOpen={menuOpen}
                    setIsOpen={setMenuOpen}
                  />
                )}
                {!isMobile && (
                  <BuyersProfileSidebar
                    isMobile={false}
                    isOpen={true}
                    setIsOpen={() => {}}
                  />
                )}

                <div className="flex-1 bg-white rounded-3xl p-6 md:p-8">
                  <h1 className="text-xl md:text-2xl font-bold mb-8">
                    Country/Region
                  </h1>

                  {loading ? (
                    <p className="text-gray-500">Loading your location...</p>
                  ) : (
                    <div className="max-w-lg space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                          Delivery Location
                        </label>
                        <button
                          onClick={openModal}
                          className="w-full px-5 py-4 text-left bg-gray-50 rounded-xl flex items-center justify-between hover:bg-gray-100 transition focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <span
                            className={
                              !selectedState ? 'text-gray-500' : 'text-gray-900'
                            }
                          >
                            {displayValue}
                          </span>
                          <ChevronRight className="w-5 h-5 text-gray-400" />
                        </button>
                      </div>

                      {selectedState && (
                        <div className="p-5 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3">
                          <Check className="w-6 h-6 text-green-600 flex-shrink-0" />
                          <div>
                            <p className="text-sm font-medium text-green-900">
                              Location Saved
                            </p>
                            <p className="text-xs text-green-700 mt-1">
                              {selectedState}
                              {selectedLGA && ` • ${selectedLGA}`}
                              {selectedArea && ` • ${selectedArea}`}
                            </p>
                          </div>
                          {saving && (
                            <span className="ml-auto text-xs text-gray-600">
                              Saving...
                            </span>
                          )}
                          {saved && (
                            <span className="ml-auto text-xs font-medium text-green-600">
                              Saved!
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </main>
          <CarouselBanner />
        </div>
      </div>

      {/* Single Smart Modal – Works on Mobile & Desktop */}
      <Modal
        isOpen={!!modalStep}
        onClose={closeModal}
        onBack={() => {
          if (modalStep === 'lga') setModalStep('state');
          if (modalStep === 'area') setModalStep('lga');
        }}
        title={
          modalStep === 'state'
            ? 'Select State'
            : modalStep === 'lga'
              ? `LGA in ${selectedState}`
              : `Area in ${selectedLGA}`
        }
        isMobile={isMobile}
        currentStep={modalStep}
      >
        {modalStep === 'state' && (
          <StateSelection onSelect={handleStateSelect} />
        )}
        {modalStep === 'lga' && (
          <LGASelection state={selectedState} onSelect={handleLGASelect} />
        )}
        {modalStep === 'area' && (
          <AreaSelection lga={selectedLGA} onSelect={handleAreaSelect} />
        )}
      </Modal>
    </>
  );
}