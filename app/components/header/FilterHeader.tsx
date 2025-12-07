// app/components/header/FilterHeader.tsx
'use client';

import React, { useState } from 'react';
import { ChevronDown, MapPin, Search } from 'lucide-react';
import { Modal, StateSelection } from '@/app/components/modals/LocationsModal';
import { motion, AnimatePresence } from 'framer-motion';

export default function FilterHeader() {
  const [locationOpen, setLocationOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState('All Location');
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const [selectedFilters, setSelectedFilters] = useState({
    'Seller Type': 'Seller Type',
    'Store Type': 'Store Type',
    'Minimum order quantity': 'Minimum order quantity',
    Price: 'Price',
    Rating: 'Rating',
  });

  const filters = [
    {
      name: 'Seller Type',
      options: [
        'All',
        'Manufacturer',
        'Wholesalers',
        'Importer',
        'Distributor',
      ],
    },
    {
      name: 'Store Type',
      options: ['All Stores', 'Verified Only', 'Top Rated'],
    },
    {
      name: 'Minimum order quantity',
      options: ['Any', '1–10', '11–50', '51–100', '100+'],
    },
    {
      name: 'Price',
      options: ['Any Price', '₦0 – ₦50k', '₦50k – ₦200k', '₦200k+'],
    },
    { name: 'Rating', options: ['Any Rating', '4.5+', '4.0+', '3.5+', '3.0+'] },
  ];

  const handleSelect = (name: string, value: string) => {
    setSelectedFilters((prev) => ({ ...prev, [name]: value }));
    setOpenDropdown(null);
  };

  return (
    <>
      {/* Filter Bar */}
      <div className="bg-gray-100 border-b border-gray-200">
        <div className="px-4 py-4">
          <div
            className="flex items-center gap-3 overflow-x-auto scrollbar-none"
            style={{ overflow: 'visible' }}
          >
            {/* Location */}
            <button
              onClick={() => setLocationOpen(true)}
              className="flex items-center gap-2 px-5 py-3 bg-white hover:bg-gray-50 hover:cursor-pointer rounded-2xl text-gray-700 text-sm font-medium whitespace-nowrap transition"
            >
              <MapPin className="w-4 h-4" />
              <span>{selectedLocation}</span>
              <ChevronDown className="w-4 h-4 ml-1" />
            </button>

            {/* All Filters */}
            {filters.map((filter) => (
              <div key={filter.name} className="relative">
                <button
                  onClick={() =>
                    setOpenDropdown(
                      openDropdown === filter.name ? null : filter.name
                    )
                  }
                  className="flex items-center gap-2 px-5 py-3 bg-white hover:bg-gray-50 hover:cursor-pointer rounded-2xl text-gray-700 text-sm font-medium whitespace-nowrap transition"
                >
                  <span>
                    {
                      selectedFilters[
                        filter.name as keyof typeof selectedFilters
                      ]
                    }
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 ml-1 transition-transform ${
                      openDropdown === filter.name ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {/* Dropdown */}
                <AnimatePresence>
                  {openDropdown === filter.name && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.18 }}
                      className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 z-50"
                    >
                      <div className="py-2">
                        {filter.options.map((option, i) => (
                          <button
                            key={option}
                            onClick={() => handleSelect(filter.name, option)}
                            className={`w-full text-left px-6 py-3.5 text-sm font-medium transition-colors ${
                              i === 0
                                ? 'bg-gray-100 font-semibold'
                                : 'hover:bg-gray-50'
                            }`}
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Location Modal */}
      <Modal
        isOpen={locationOpen}
        onClose={() => setLocationOpen(false)}
        title="Select Location"
        isMobile={true}
        currentStep={null}
      >
        <div className="pb-6">
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search city or region"
              className="w-full pl-12 pr-5 py-4 bg-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-gray-900"
            />
          </div>
          <StateSelection
            onSelect={(value) => {
              setSelectedLocation(
                value === 'current' ? 'Current Location' : value
              );
              setLocationOpen(false);
            }}
          />
        </div>
      </Modal>
    </>
  );
}
