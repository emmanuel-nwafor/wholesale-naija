'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import {
Home,
Package,
Store,
MessageSquare,
User,
Menu,
X,
Star,
} from 'lucide-react';

interface MenuItem {
label: string;
href: string;
icon: React.ReactNode;
badge?: number;
}

const MENU_ITEMS: MenuItem[] = [
{ label: 'Home', href: '/store/dashboard', icon: <Home size={20} /> },
{ label: 'Products', href: '/store/products', icon: <Package size={20} /> },
{ label: 'Store Management', href: '/store/management', icon: <Store size={20} /> },
{ label: 'Reviews', href: '/store/reviews', icon: <Star size={20} /> },
{ label: 'Messages', href: '/store/messages', icon: <MessageSquare size={20} />, badge: 5 },
{ label: 'Profile', href: '/store/profile', icon: <User size={20} /> },
];

export default function SellerChatStoreSidebar() {
const [isOpen, setIsOpen] = useState(false);

const SidebarContent = ( <div className="flex flex-col h-full bg-gray-50 text-gray-800"> <div className="p-4 border-b border-gray-200"> <Link href="/"> <Image
         src="/svgs/wholesale-ng-logo.png"
         alt="Wholesale Naija"
         width={170}
         height={48}
         className="mx-auto"
       /> </Link> </div> <nav className="flex-1 p-4"> <ul className="space-y-1">
{MENU_ITEMS.map((item) => ( <li key={item.label}>
<Link
href={item.href}
onClick={() => setIsOpen(false)}
className="hover:bg-white flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all"
> <span>{item.icon}</span> <span className="flex-1">{item.label}</span>
{item.badge && ( <span className="bg-gray-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
{item.badge} </span>
)} </Link> </li>
))} </ul> </nav> <div className="p-4 flex gap-2"> <Image src="/svgs/playstore-logo.svg" alt="Google Play" width={120} height={40} /> <Image src="/svgs/apple-logo.svg" alt="App Store" width={120} height={40} /> </div> </div>
);

return (
<>
{/* Toggle button: show on mobile + tablet (sm + md) */} <div className="lg:hidden fixed top-4 left-4 z-50">
<button
onClick={() => setIsOpen((p) => !p)}
className="p-2 bg-gray-800 text-white rounded-md"
>
{isOpen ? <X size={20} /> : <Menu size={20} />} </button> </div>

  {/* Sidebar slide-in: mobile + tablet */}
  <div
    className={`fixed inset-0 z-40 lg:hidden transition-transform ${
      isOpen ? 'translate-x-0' : '-translate-x-full'
    }`}
  >
    <div className="absolute inset-0 bg-black/50" onClick={() => setIsOpen(false)} />
    <div className="relative w-64 h-full bg-white shadow-xl">{SidebarContent}</div>
  </div>

  {/* Sidebar always visible: desktop only */}
  <div className="hidden lg:block fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-200">
    {SidebarContent}
  </div>
</>

);
}
