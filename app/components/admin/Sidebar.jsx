import React from 'react';
import Link from 'next/link';
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

export default function Sidebar() {
  return (
    <aside className="w-64 bg-gray-900 text-white h-screen p-4 flex flex-col">
      <div className="text-2xl font-bold mb-8">Wholesalenaija</div>
      <nav className="flex-1">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.label}>
              <Link
                href={item.href}
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-700"
              >
                <item.icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}