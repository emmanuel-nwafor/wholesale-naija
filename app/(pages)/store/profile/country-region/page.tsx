// app/profile/country-region/page.tsx
"use client";
import React, { useState, useEffect } from 'react';
import { Menu, ChevronRight } from 'lucide-react';
import StoreSidebar from '@/app/components/sidebar/StoreSidebar';
import DashboardHeader from '@/app/components/header/DashboardHeader';
import ProfileSidebar from '@/app/components/sidebar/ProfileSidebar';
import { Modal, StateSelection, LGASelection, AreaSelection } from '@/app/components/modals/LocationsModal';

export default function ProfileCountryRegion() {
  const [isMobile, setIsMobile] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [modalStep, setModalStep] = useState<'state' | 'lga' | 'area' | null>(null);
  const [selectedState, setSelectedState] = useState('');
  const [selectedLGA, setSelectedLGA] = useState('');
  const [selectedArea, setSelectedArea] = useState('');

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const openStateModal = () => setModalStep('state');
  const closeModal = () => setModalStep(null);

  const handleStateSelect = (state: string) => {
    if (state === 'current') {
      setSelectedState('Current Location');
      closeModal();
    } else {
      setSelectedState(state);
      setModalStep('lga');
    }
  };

  const handleLGASelect = (lga: string) => {
    setSelectedLGA(lga);
    setModalStep('area');
  };

  const handleAreaSelect = (area: string) => {
    setSelectedArea(area);
    closeModal();
  };

  const displayValue = selectedArea || selectedLGA || selectedState || 'Select location';

  const getCurrentStepIndex = () => {
    switch (modalStep) {
      case 'state': return 0;
      case 'lga': return 1;
      case 'area': return 2;
      default: return -1;
    }
  };

  const currentStep = getCurrentStepIndex();

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
                  className="mb-6 hover:cursor-pointer hover:bg-gray-100 rounded-xl p-2 flex items-center gap-2 text-sm font-medium text-gray-700"
                >
                  <Menu className="w-4 h-4" /> Profile Info
                </button>
              )}

              <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
                <div className="lg:w-64">
                  <ProfileSidebar isMobile={isMobile} isOpen={menuOpen} setIsOpen={setMenuOpen} />
                </div>

                <div className="flex-1 bg-white rounded-2xl p-6">
                  <h1 className="text-xl font-semibold mb-6">Country/Region</h1>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Select your location
                      </label>
                      <button
                        onClick={openStateModal}
                        className="w-full px-4 py-3 text-left bg-gray-50 rounded-xl flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                      >
                        <span className="text-sm text-gray-900">{displayValue}</span>
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                      </button>
                    </div>

                    {(selectedState || selectedLGA || selectedArea) && (
                      <div className="p-4 bg-blue-50 rounded-lg">
                        <p className="text-sm text-blue-900">
                          Selected: {selectedState} {selectedLGA && `→ ${selectedLGA}`} {selectedArea && `→ ${selectedArea}`}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Desktop: All modals visible, sliding right */}
      {!isMobile && (
        <>
          <Modal
            isOpen={modalStep !== null}
            onClose={closeModal}
            title="Select Location"
            isMobile={false}
            stepIndex={0}
            currentStep={currentStep}
          >
            {modalStep === 'state' && <StateSelection onSelect={handleStateSelect} />}
          </Modal>

          <Modal
            isOpen={modalStep === 'lga' || modalStep === 'area'}
            onClose={closeModal}
            title="Select Location"
            isMobile={false}
            stepIndex={1}
            currentStep={currentStep}
          >
            {modalStep === 'lga' && <LGASelection state={selectedState} onSelect={handleLGASelect} />}
          </Modal>

          <Modal
            isOpen={modalStep === 'area'}
            onClose={closeModal}
            title="Select Location"
            isMobile={false}
            stepIndex={2}
            currentStep={currentStep}
          >
            {modalStep === 'area' && <AreaSelection lga={selectedLGA} onSelect={handleAreaSelect} />}
          </Modal>
        </>
      )}

      {/* Mobile: Single full-screen modal */}
      {isMobile && (
        <>
          <Modal
            isOpen={modalStep === 'state'}
            onClose={closeModal}
            title="Select Location"
            isMobile={true}
            stepIndex={0}
            currentStep={currentStep}
          >
            <StateSelection onSelect={handleStateSelect} />
          </Modal>

          <Modal
            isOpen={modalStep === 'lga'}
            onClose={closeModal}
            title="Select Location"
            isMobile={true}
            stepIndex={1}
            currentStep={currentStep}
          >
            <LGASelection state={selectedState} onSelect={handleLGASelect} />
          </Modal>

          <Modal
            isOpen={modalStep === 'area'}
            onClose={closeModal}
            title="Select Location"
            isMobile={true}
            stepIndex={2}
            currentStep={currentStep}
          >
            <AreaSelection lga={selectedLGA} onSelect={handleAreaSelect} />
          </Modal>
        </>
      )}
    </>
  );
}