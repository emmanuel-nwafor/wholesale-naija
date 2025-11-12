"use client";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { Home, Package, Store, MessageSquare, User, Menu, X } from "lucide-react";

interface MenuItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: number;
}

const MENU_ITEMS: MenuItem[] = [
  { label: "Home", href: "/", icon: <Home size={20} /> },
  { label: "Products", href: "/products", icon: <Package size={20} /> },
  { label: "Store Management", href: "/store", icon: <Store size={20} /> },
  { label: "Reviews", href: "/reviews", icon: <MessageSquare size={20} /> },
  { label: "Messages", href: "/messages", icon: <MessageSquare size={20} />, badge: 5 },
  { label: "Profile", href: "/profile", icon: <User size={20} /> },
];

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const SidebarContent = (
    <div className="flex flex-col h-full bg-white text-gray-800">
      <div className="p-4 border-b border-gray-200">
        <Link href="/">
          <Image
            src="https://res.cloudinary.com/dqtjja88b/image/upload/v1760219419/Screenshot_2025-10-11_224658_q8bjy2.png"
            alt="Wholesale Naija"
            width={170}
            height={48}
            className="mx-auto"
          />
        </Link>
      </div>
      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {MENU_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.label}>
                <Link
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all ${
                    isActive
                      ? "bg-green-50 text-green-600 font-medium"
                      : "hover:bg-gray-100"
                  }`}
                >
                  <span className={isActive ? "text-green-600" : "text-gray-600"}>
                    {item.icon}
                  </span>
                  <span className="flex-1">{item.label}</span>
                  {item.badge && (
                    <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {item.badge}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      <div className="p-4 flex gap-2">
        <Image src="/google-play.png" alt="Google Play" width={120} height={40} />
        <Image src="/app-store.png" alt="App Store" width={120} height={40} />
      </div>
    </div>
  );

  return (
    <>
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsOpen((p) => !p)}
          className="p-2 bg-gray-800 text-white rounded-md"
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      <div
        className={`fixed inset-0 z-40 md:hidden transition-transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div
          className="absolute inset-0 bg-black/50"
          onClick={() => setIsOpen(false)}
        />
        <div className="relative w-64 h-full bg-white shadow-xl">
          {SidebarContent}
        </div>
      </div>

      <div className="hidden md:block fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-200">
        {SidebarContent}
      </div>
    </>
  );
}