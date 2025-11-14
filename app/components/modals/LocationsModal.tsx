// app/components/modals/LocationsModal.tsx
"use client";
import React from "react";
import { X, Search, ChevronRight, MapPin } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBack?: () => void;
  title: string;
  children: React.ReactNode;
  isMobile: boolean;
  stepIndex: number;
  currentStep: number;
}

export const Modal = ({
  isOpen,
  onClose,
  onBack,
  title,
  children,
  isMobile,
  stepIndex,
  currentStep,
}: ModalProps) => {
  if (!isOpen) return null;

  const isActive = stepIndex === currentStep;
  const isPast = stepIndex < currentStep;
  const isFuture = stepIndex > currentStep;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex items-center justify-center"
          style={{ backdropFilter: "blur(4px)", backgroundColor: "rgba(0,0,0,0.25)" }}
        >
          <motion.div
            initial={{ x: isFuture ? "100%" : "-100%", scale: 0.95, opacity: 0 }}
            animate={{
              x: isActive ? 0 : isPast ? "-100%" : "100%",
              scale: isActive ? 1 : 0.95,
              opacity: isActive ? 1 : 0,
            }}
            exit={{ x: isPast ? "-100%" : "100%", scale: 0.95, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="relative w-full max-w-md bg-white rounded-2xl shadow-xl"
            style={{ height: "32rem", zIndex: 70 + stepIndex }}
          >
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              {stepIndex > 0 && (
                <button onClick={onBack} className="p-1 mr-2">
                  <ChevronRight className="w-5 h-5 rotate-180 text-gray-700" />
                </button>
              )}
              <h3 className="text-lg font-medium flex-1">{title}</h3>
              <button onClick={onClose} className="p-1">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3 overflow-y-auto p-4" style={{ maxHeight: "calc(32rem - 80px)" }}>
              {children}
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
    <>
      <motion.button
        whileTap={{ scale: 0.98 }}
        className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-gray-50 text-left"
        onClick={() => onSelect("current")}
      >
        <MapPin className="w-5 h-5 text-blue-600" />
        <span className="text-sm">Use your current location</span>
      </motion.button>

      <div className="text-xs font-medium text-gray-500 uppercase pt-2">All Nigeria</div>

      {states.map((state, i) => (
        <motion.button
          key={state}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelect(state)}
          className="flex items-center justify-between w-full p-3 rounded-lg hover:bg-gray-50 text-left"
        >
          <span className="text-sm">{state}</span>
          <ChevronRight className="w-4 h-4 text-gray-400" />
        </motion.button>
      ))}
    </>
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

  const popular = (lgas[state] || []).slice(0, 5);
  const all = lgas[state] || [];

  return (
    <>
      <div className="sticky top-0 pb-2 bg-white z-10">
        <motion.div layout className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg">
          <Search className="w-4 h-4 text-gray-400" />
          <input type="text" placeholder="Search city or region" className="flex-1 text-sm bg-transparent outline-none placeholder:text-gray-400" />
        </motion.div>
      </div>

      {popular.length > 0 && (
        <>
          <div className="text-xs font-medium text-gray-500 uppercase pt-2">Popular</div>
          {popular.map((lga, i) => (
            <motion.button
              key={lga}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelect(lga)}
              className="flex items-center justify-between w-full p-3 rounded-lg hover:bg-gray-50 text-left"
            >
              <span className="text-sm">{lga}</span>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </motion.button>
          ))}
        </>
      )}

      {all.length > 0 && (
        <>
          <div className="text-xs font-medium text-gray-500 uppercase pt-3">All Locations</div>
          {all.map((lga, i) => (
            <motion.button
              key={lga}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: (popular.length + i) * 0.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelect(lga)}
              className="flex items-center justify-between w-full p-3 rounded-lg hover:bg-gray-50 text-left"
            >
              <span className="text-sm">{lga}</span>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </motion.button>
          ))}
        </>
      )}
    </>
  );
};

/* AREA SELECTION */
export const AreaSelection = ({ lga, onSelect }: { lga: string; onSelect: (area: string) => void }) => {
  const areas: Record<string, string[]> = {
    Ikeja: [
      "Adeniyi Jones", "Agidingbi", "Airport Road", "Alausa", "Allen Avenue", "Awolowo Way",
      "Balogun", "Computer Village", "Ikeja GRA", "Opebi", "Oregun", "Maryland", "Anthony",
      "Omole", "Magodo",
    ],
    Surulere: [
      "Adelabu", "Aguda", "Bode Thomas", "Coker", "Ijesha", "Masha", "Ogunlana Drive",
      "Stadium", "Tejuosho", "Western Avenue", "Lawanson", "Itire", "Ojuelegba", "Yaba",
      "Ebute Metta",
    ],
    Agege: [
      "Orile Agege", "Dopemu", "Iju Ishaga", "Oko Oba", "Mulero", "Tabon Tabon",
      "Abule Egba", "Fagba", "Ijaiye", "Pen Cinema",
    ],
    Alimosho: [
      "Igando", "Ikotun", "Egbeda", "Ipaja", "Ayobo", "Akowonjo", "Shasha", "Idimu",
      "Isheri", "Abule Egba",
    ],
  };

  const popular = (areas[lga] || []).slice(0, 5);
  const all = areas[lga] || [];

  return (
    <>
      <div className="sticky top-0 pb-2 bg-white z-10">
        <motion.div layout className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg">
          <Search className="w-4 h-4 text-gray-400" />
          <input type="text" placeholder="Search area or street" className="flex-1 text-sm bg-transparent outline-none placeholder:text-gray-400" />
        </motion.div>
      </div>

      {popular.length > 0 && (
        <>
          <div className="text-xs font-medium text-gray-500 uppercase pt-2">Popular</div>
          {popular.map((area, i) => (
            <motion.button
              key={area}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelect(area)}
              className="flex items-center w-full p-3 rounded-lg hover:bg-gray-50 text-left text-sm"
            >
              {area}
            </motion.button>
          ))}
        </>
      )}

      {all.length > 0 && (
        <>
          <div className="text-xs font-medium text-gray-500 uppercase pt-3">All Areas</div>
          {all.map((area, i) => (
            <motion.button
              key={area}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: (popular.length + i) * 0.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelect(area)}
              className="flex items-center w-full p-3 rounded-lg hover:bg-gray-50 text-left text-sm"
            >
              {area}
            </motion.button>
          ))}
        </>
      )}
    </>
  );
};