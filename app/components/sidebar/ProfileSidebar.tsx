// app/components/profile/ProfileSidebar.tsx
import React from 'react';
import { Globe, Bell, Lock, Trash2, LogOut, User, X } from 'lucide-react';

interface ProfileSidebarProps {
  isMobile: boolean;
  isOpen: boolean;
  setIsOpen: (v: boolean) => void;
}

export default function ProfileSidebar({ isMobile, isOpen, setIsOpen }: ProfileSidebarProps) {
  const items = [
    { icon: User, label: "Profile Info", active: true },
    { icon: Globe, label: "Country/Region" },
    { icon: Bell, label: "Notification Settings" },
    { icon: Lock, label: "Password Settings" },
    { icon: Trash2, label: "Delete Account", danger: true },
    { icon: LogOut, label: "Log Out", danger: true },
  ];

  const content = (
    <nav className="space-y-1">
      {items.map((item, i) => (
        <button
          key={i}
          className={`flex items-center gap-3 px-4 py-3 w-full text-left rounded-xl text-sm font-medium transition-colors ${
            item.active
              ? 'bg-gray-100 text-gray-900'
              : item.danger
              ? 'text-red-600 hover:bg-red-50'
              : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          <item.icon className="w-4 h-4" />
          {item.label}
        </button>
      ))}
    </nav>
  );

  if (isMobile) {
    return (
      <>
        {isOpen && <div className="fixed inset-0 bg-black/20 z-40" onClick={() => setIsOpen(false)} />}
        <div className={`fixed left-0 top-0 h-full w-64 bg-white z-50 transition-transform ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="p-4 border-b border-gray-50 flex justify-between items-center">
            <h3 className="font-medium">Account Settings</h3>
            <button onClick={() => setIsOpen(false)}><X className="w-5 h-5" /></button>
          </div>
          <div className="p-4">{content}</div>
        </div>
      </>
    );
  }

  return <div className="bg-white rounded-2xl p-4">{content}</div>;
}