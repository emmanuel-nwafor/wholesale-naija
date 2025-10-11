"use client"

import React, { useState } from 'react';
import Link from 'next/link';
import { Poppins } from 'next/font/google';
import { X, Menu } from 'lucide-react';
import {
  LayoutDashboard,
  Package,
  Folder,
  Layers,
  CreditCard,
  Users,
  CheckCircle,
  BarChart3,
  Mail,
  Image,
  Settings
} from 'lucide-react';

const poppins = Poppins({ subsets: ['latin'], weight: ['400', '600'] });

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/admin/dashboard' },
  { icon: Package, label: 'Products Management', href: '/admin/products' },
  { icon: Folder, label: 'Categories Management', href: '/admin/categories' },
  { icon: Layers, label: 'Starter Packs', href: '/admin/starter-packs' },
  { icon: CreditCard, label: 'Transactions', href: '/admin/transactions' },
  { icon: Users, label: 'Users Management', href: '/admin/users' },
  { icon: CheckCircle, label: 'Verification Requests', href: '/admin/verifications' },
  { icon: BarChart3, label: 'Report Management', href: '/admin/reports' },
  { icon: Mail, label: 'Communication Mgmt', href: '/admin/communication' },
  { icon: Image, label: 'Banners', href: '/admin/banners' },
  { icon: Settings, label: 'Settings', href: '/admin/settings' },
];

export default function Sidebar({ isOpen: externalOpen, onClose: externalClose }) {
  const [isOpen, setIsOpen] = useState(false);
  const open = externalOpen ?? isOpen;
  const toggle = () => setIsOpen(!isOpen);
  const close = externalClose ?? (() => setIsOpen(false));

  return (
    <>
      <button
        onClick={toggle}
        className="fixed top-4 left-4 z-40 lg:hidden bg-gray-900 text-white p-2 rounded-lg"
      >
        <Menu className="h-6 w-6" />
      </button>
      <aside className={`fixed inset-y-0 left-0 z-50 w-80 bg-gray-900 text-white h-screen p-4 flex flex-col overflow-y-auto ${poppins.className} transform transition-transform duration-300 ease-in-out ${open ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:block`}>
        <div className="relative mb-8 flex-shrink-0">
          <img
            src="https://res.cloudinary.com/dqtjja88b/image/upload/v1760219419/Screenshot_2025-10-11_224658_q8bjy2.png"
            alt="Wholesalenaija"
            className="h-16 w-auto"
          />
          <button
            onClick={close}
            className="absolute -right-2 top-0 lg:hidden text-gray-300 hover:text-white"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        <nav className="flex-1">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className="flex items-center space-x-3 p-3 rounded-2xl hover:bg-white hover:text-slate-600"
                  onClick={close}
                >
                  <item.icon className="h-6 w-6 flex-shrink-0" />
                  <span className="whitespace-nowrap">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
      {open && (
        <div
          className="fixed inset-0 bg-black bg-opacity-20 z-40 lg:hidden"
          onClick={close}
        />
      )}
    </>
  );
}