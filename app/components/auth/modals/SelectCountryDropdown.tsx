'use client';
import React, { useState, useRef, useEffect } from 'react';

interface Country {
  name: string;
  code: string;
  flag: string;
}

const countries: Country[] = [
  { name: 'Nigeria', code: '+234', flag: '🇳🇬' },
  { name: 'United States', code: '+1', flag: '🇺🇸' },
  { name: 'United Kingdom', code: '+44', flag: '🇬🇧' },
  { name: 'Canada', code: '+1', flag: '🇨🇦' },
  { name: 'Ghana', code: '+233', flag: '🇬🇭' },
  // add more countries here
];

interface SelectCountryDropdownProps {
  selectedCountry: Country;
  onSelect: (country: Country) => void;
}

export default function SelectCountryDropdown({
  selectedCountry,
  onSelect,
}: SelectCountryDropdownProps) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="z-50 flex items-center gap-2 hover:cursor-pointer"
      >
        <span>{selectedCountry.flag}</span>
        <span className="text-gray-500">{selectedCountry.code}</span>
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute top-full left-0 mt-2 w-44 bg-white rounded-2xl shadow-xl border border-gray-200 z-50 max-h-60 overflow-y-auto">
          {countries.map((country) => (
            <button
              key={`${country.code}-${country.name}`}
              onClick={() => {
                onSelect(country);
                setOpen(false);
              }}
              className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
            >
              <span>{country.flag}</span>
              <span>{country.name}</span>
              <span className="ml-auto text-gray-500">{country.code}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
