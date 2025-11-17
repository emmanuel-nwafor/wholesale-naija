'use client';

import React, { useRef, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Hamburger, Menu } from 'lucide-react';

interface SubCategory {
  title: string;
  items: string[];
}

interface Category {
  name: string;
  subCategories: SubCategory[];
}

const categoriesData: Category[] = [
  {
    name: 'Phones & Tablet',
    subCategories: [
      { title: 'Mobile Phones', items: ['Apple', 'Samsung Phone', 'Infinix', 'Samsung'] },
      { title: 'Phones Accessories', items: ['Apple', 'Samsung Phone', 'Infinix', 'Samsung'] },
      { title: 'Power Banks', items: ['Apple', 'Samsung Phone', 'Infinix', 'Samsung'] },
      { title: 'Phone Chargers', items: ['Apple', 'Samsung Phone', 'Infinix', 'Samsung'] },
      { title: 'Audio Devices', items: ['Apple', 'Samsung Phone', 'Infinix', 'Samsung'] },
    ],
  },
  {
    name: 'Computers & Accessories',
    subCategories: [
      { title: 'Laptops', items: ['Apple', 'Dell', 'HP', 'Lenovo'] },
      { title: 'Desktops', items: ['Apple', 'Dell', 'HP', 'Custom Build'] },
      { title: 'Monitors', items: ['Samsung', 'LG', 'Dell', 'ASUS'] },
      { title: 'Keyboards & Mice', items: ['Logitech', 'Razer', 'Apple', 'Microsoft'] },
    ],
  },
  {
    name: 'Home Electronics',
    subCategories: [
      { title: 'Televisions', items: ['Samsung', 'LG', 'Sony', 'Hisense'] },
      { title: 'Home Theater', items: ['Bose', 'Sony', 'JBL', 'LG'] },
      { title: 'Air Conditioners', items: ['LG', 'Samsung', 'Panasonic', 'Haier'] },
    ],
  },
  {
    name: 'Home Appliances',
    subCategories: [
      { title: 'Refrigerators', items: ['Samsung', 'LG', 'Hisense', 'Thermocool'] },
      { title: 'Washing Machines', items: ['LG', 'Samsung', 'Haier', 'Bosch'] },
      { title: 'Microwaves', items: ['Samsung', 'LG', 'Panasonic', 'Sharp'] },
    ],
  },
  {
    name: 'Fashion',
    subCategories: [
      { title: 'Men\'s Clothing', items: ['Shirts', 'Trousers', 'Shoes', 'Accessories'] },
      { title: 'Women\'s Clothing', items: ['Dresses', 'Tops', 'Skirts', 'Bags'] },
      { title: 'Kids', items: ['Boys', 'Girls', 'Baby'] },
    ],
  },
  {
    name: 'Cosmetics & Health',
    subCategories: [
      { title: 'Skincare', items: ['Nivea', 'Dove', 'The Ordinary', 'CeraVe'] },
      { title: 'Makeup', items: ['Maybelline', 'L\'Oreal', 'MAC', 'Fenty'] },
      { title: 'Vitamins', items: ['Centrum', 'Nature Made', 'Vitabiotics', 'Seven Seas'] },
    ],
  },
  {
    name: 'Food & Drinks',
    subCategories: [
      { title: 'Groceries', items: ['Rice', 'Beans', 'Oil', 'Spices'] },
      { title: 'Beverages', items: ['Coca-Cola', 'Pepsi', 'Water', 'Juices'] },
      { title: 'Snacks', items: ['Chips', 'Biscuits', 'Nuts', 'Chocolate'] },
    ],
  },
];

export default function CategoriesList() {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(categoriesData[0]);

  const scrollRight = () => {
    const el = scrollRef.current;
    if (el) {
      el.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  return (
    <div className="hidden md:block">
      <div ref={scrollRef} className="relative flex flex-nowrap overflow-x-auto bg-green-600 p-4 items-center justify-center [&::-webkit-scrollbar]:hidden scrollbar-none">
        <button onClick={() => setShowModal(true)} className="mx-2 hover:cursor-pointer flex items-center text-white whitespace-nowrap flex-shrink-0">
          All Categories <Menu className='text-white text-sm' height={18} />
        </button>
        {categoriesData.map((cat) => (
          <Link key={cat.name} href="/" className="mx-2 text-white whitespace-nowrap flex-shrink-0">
            {cat.name}
          </Link>
        ))}
        <button onClick={scrollRight} className="absolute right-4 top-1/2 -translate-y-1/2 hidden sm:block text-white bg-green-700 px-2 py-1 rounded text-sm hover:bg-green-500 transition">→</button>
      </div>

      <AnimatePresence>
        {showModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-md z-40"
              onClick={() => setShowModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
            >
              <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
                <button onClick={() => setShowModal(false)} className="sticky top-4 right-4 float-right text-gray-500 hover:text-gray-700 text-2xl z-10">×</button>
                <div className="flex">
                  {/* Sidebar */}
                  <div className="w-64 border-r pr-4 py-6 space-y-1 overflow-y-auto">
                    {categoriesData.map((cat, idx) => (
                      <motion.button
                        key={cat.name}
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: idx * 0.05 }}
                        onClick={() => setSelectedCategory(cat)}
                        className={`w-full text-left px-4 py-3 transition ${
                          selectedCategory?.name === cat.name
                            ? 'bg-gray-100 text-black border-l-4 border-green-500'
                            : 'hover:bg-gray-100'
                        }`}
                      >
                        {cat.name}
                      </motion.button>
                    ))}
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-6">
                    {selectedCategory && (
                      <motion.div
                        key={selectedCategory.name}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="grid grid-cols-3 gap-6"
                      >
                        {selectedCategory.subCategories.map((sub, idx) => (
                          <motion.div
                            key={sub.title}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                          >
                            <h3 className="font-semibold text-lg mb-2">{sub.title}</h3>
                            <ul className="space-y-1 text-sm text-gray-600">
                              {sub.items.map((item) => (
                                <li key={item} className="hover:text-green-600 cursor-pointer">
                                  <Link href="/" onClick={() => setShowModal(false)}>{item}</Link>
                                </li>
                              ))}
                            </ul>
                          </motion.div>
                        ))}
                      </motion.div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}