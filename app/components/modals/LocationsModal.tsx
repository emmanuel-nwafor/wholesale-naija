// app/components/modals/LocationsModal.tsx
"use client";

import React from "react";
import { X, ChevronRight, Search, MapPin } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBack?: () => void;
  title: string;
  children: React.ReactNode;
  isMobile: boolean;
  currentStep: "state" | "lga" | "area" | null;
}

export const Modal = ({
  isOpen,
  onClose,
  onBack,
  title,
  children,
  isMobile,
}: ModalProps) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          onClick={onClose}
        >
          <motion.div
            initial={isMobile ? { y: "100%" } : { scale: 0.95, opacity: 0 }}
            animate={isMobile ? { y: 0 } : { scale: 1, opacity: 1 }}
            exit={isMobile ? { y: "100%" } : { scale: 0.95, opacity: 0 }}
            transition={{ type: "spring", damping: 30, stiffness: 400 }}
            className="relative w-full max-w-md bg-white rounded-t-3xl md:rounded-3xl shadow-2xl overflow-hidden max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              {onBack && (
                <button onClick={onBack} className="p-2 -ml-2">
                  <ChevronRight className="w-6 h-6 rotate-180 text-gray-700" />
                </button>
              )}
              <h3 className="text-lg font-semibold flex-1 text-center md:text-left">
                {title}
              </h3>
              <button onClick={onClose} className="p-2">
                <X className="w-6 h-6 text-gray-600" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="overflow-y-auto" style={{ maxHeight: "calc(90vh - 80px)" }}>
              <div className="p-5 pb-10">{children}</div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

/* STATE SELECTION */
export const StateSelection = ({ onSelect }: { onSelect: (state: string) => void }) => {
  const states = [
    "Abia State", "Adamawa State", "Akwa Ibom State", "Anambra State", "Bauchi State",
    "Bayelsa State", "Benue State", "Borno State", "Cross River State", "Delta State",
    "Ebonyi State", "Edo State", "Ekiti State", "Enugu State", "FCT", "Gombe State",
    "Imo State", "Jigawa State", "Kaduna State", "Kano State", "Katsina State",
    "Kebbi State", "Kogi State", "Kwara State", "Lagos State", "Nasarawa State",
    "Niger State", "Ogun State", "Ondo State", "Osun State", "Oyo State",
    "Plateau State", "Rivers State", "Sokoto State", "Taraba State", "Yobe State",
    "Zamfara State",
  ];

  return (
    <div className="space-y-4">
      <button
        onClick={() => onSelect("current")}
        className="w-full flex items-center gap-3 p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition"
      >
        <MapPin className="w-5 h-5 text-blue-600" />
        <span className="font-medium text-blue-900">Use current location</span>
      </button>

      <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">
        All States in Nigeria
      </div>

      {states.map((state) => (
        <button
          key={state}
          onClick={() => onSelect(state)}
          className="w-full flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 transition"
        >
          <span className="text-gray-800">{state}</span>
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </button>
      ))}
    </div>
  );
};

/* LGA SELECTION */
export const LGASelection = ({ state, onSelect }: { state: string; onSelect: (lga: string) => void }) => {
  const lgas: Record<string, string[]> = {
    "Lagos State": [
      "Agege", "Ajeromi-Ifelodun", "Alimosho", "Amuwo-Odofin", "Apapa", "Badagry",
      "Epe", "Eti-Osa", "Ibeju-Lekki", "Ifako-Ijaiye", "Ikeja", "Ikorodu", "Kosofe",
      "Lagos Island", "Lagos Mainland", "Mushin", "Ojo", "Oshodi-Isolo", "Shomolu", "Surulere",
    ],
    "FCT": ["Abaji", "Bwari", "Gwagwalada", "Kuje", "Kwali", "Municipal Area Council"],
    "Abia State": [
      "Aba North", "Aba South", "Arochukwu", "Bende", "Ikwuano", "Isiala Ngwa North",
      "Isiala Ngwa South", "Isuikwuato", "Obi Ngwa", "Ohafia", "Osisioma", "Ugwunagbo",
      "Ukwa East", "Ukwa West", "Umunneochi",
    ],
    "Oyo State": [
      "Afijio", "Akinyele", "Atiba", "Atisbo", "Egbeda", "Ibadan North", "Ibadan North-East",
      "Ibadan North-West", "Ibadan South-East", "Ibadan South-West", "Ibarapa Central",
      "Ibarapa East", "Ibarapa North", "Ido", "Irepo", "Iseyin", "Itesiwaju", "Iwajowa",
      "Kajola", "Lagelu", "Ogbomosho North", "Ogbomosho South", "Ogo Oluwa", "Olorunsogo",
      "Oluyole", "Ona Ara", "Orelope", "Ori Ire", "Oyo East", "Oyo West", "Saki East",
      "Saki West", "Surulere",
    ],
  };

  const items = lgas[state] || [];

  return (
    <div className="space-y-4">
      <div className="sticky top-0 bg-white pt-2 pb-3 z-10">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search LGA..."
            className="w-full pl-10 pr-4 py-3 bg-gray-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
          />
        </div>
      </div>

      {items.length === 0 ? (
        <p className="text-center text-gray-500 py-8">No LGAs found for this state</p>
      ) : (
        items.map((lga) => (
          <button
            key={lga}
            onClick={() => onSelect(lga)}
            className="w-full flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 transition"
          >
            <span>{lga}</span>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
        ))
      )}
    </div>
  );
};

/* AREA SELECTION */
export const AreaSelection = ({ lga, onSelect }: { lga: string; onSelect: (area: string) => void }) => {
  const areas: Record<string, string[]> = {
    Ikeja: [
      "Adeniyi Jones", "Agidingbi", "Airport Road", "Alausa", "Allen Avenue", "Awolowo Way",
      "Computer Village", "Ikeja GRA", "Opebi", "Oregun", "Maryland", "Anthony", "Omole", "Magodo",
    ],
    Surulere: [
      "Adelabu", "Aguda", "Bode Thomas", "Coker", "Ijesha", "Masha", "Ogunlana Drive",
      "Stadium", "Tejuosho", "Western Avenue", "Lawanson", "Itire", "Ojuelegba", "Yaba",
    ],
    Agege: ["Orile Agege", "Dopemu", "Iju Ishaga", "Oko Oba", "Abule Egba", "Pen Cinema"],
    Alimosho: ["Igando", "Ikotun", "Egbeda", "Ipaja", "Ayobo", "Shasha", "Idimu"],
    // Add more as needed
  };

  const items = areas[lga] || [];

  return (
    <div className="space-y-4">
      <div className="sticky top-0 bg-white pt-2 pb-3 z-10">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search area or street..."
            className="w-full pl-10 pr-4 py-3 bg-gray-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
          />
        </div>
      </div>

      {items.length === 0 ? (
        <p className="text-center text-gray-500 py-8">No areas found for this LGA</p>
      ) : (
        items.map((area) => (
          <button
            key={area}
            onClick={() => onSelect(area)}
            className="w-full text-left p-4 rounded-xl hover:bg-gray-50 transition font-medium"
          >
            {area}
          </button>
        ))
      )}
    </div>
  );
};