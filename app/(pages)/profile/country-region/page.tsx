// app/profile/country-region/page.tsx (Buyers version)
"use client";
import React, { useState, useEffect } from 'react';
import { Menu, ChevronRight } from 'lucide-react';
import Header from '@/app/components/header/Header';
import BuyersProfileSidebar from '@/app/components/sidebar/BuyersProfileSidebar';
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
      <Header />

      <div className="flex min-h-screen bg-gray-50">
        <div className="flex-1 flex flex-col">
          <main className="flex-1 p-4 md:p-8">
            <div className="max-w-5xl mx-auto">
              {/* Mobile Menu Trigger */}
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
                {/* Mobile Sidebar */}
                {isMobile && (
                  <BuyersProfileSidebar
                    isMobile={true}
                    isOpen={menuOpen}
                    setIsOpen={setMenuOpen}
                  />
                )}

                {/* Desktop Sidebar */}
                {!isMobile && (
                  <BuyersProfileSidebar isMobile={false} isOpen={true} setIsOpen={() => {}} />
                )}

                {/* Main Content */}
                <div className="flex-1 bg-white rounded-3xl p-6 md:p-8">
                  <h1 className="text-xl font-bold mb-8">Country/Region</h1>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Select your location
                      </label>
                      <button
                        onClick={openStateModal}
                        className="w-full px-5 py-4 text-left bg-gray-50 rounded-xl flex items-center justify-between hover:bg-gray-100 transition focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <span className="text-gray-900">{displayValue}</span>
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                      </button>
                    </div>

                    {(selectedState || selectedLGA || selectedArea) && (
                      <div className="p-5 bg-blue-50 rounded-xl">
                        <p className="text-sm text-blue-900 font-medium">
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

      {/* Desktop: Sliding modals */}
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

      {/* Mobile: Full-screen modals */}
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