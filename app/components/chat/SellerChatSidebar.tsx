// app/components/chat/SellerChatSidebar.tsx
'use client';

import React from 'react';
import { Search, Filter } from 'lucide-react';
import { motion } from 'framer-motion';
import Image from 'next/image';

interface Participant {
  _id: string;
  fullName: string;
  profilePicture?: { url: string };
}
interface Conversation {
  _id: string;
  participants: Participant[];
  lastMessageAt?: string | null;
  createdAt: string;
  updatedAt: string;
  unreadCounts?: Record<string, number>;
}
// FIX: The 'Chat' interface now exactly matches the one in page.tsx
interface Chat {
  id: string;
  name: string;
  message: string;
  time: string;
  avatar: string;
  online: boolean;
  unread: number;
  conv: Conversation; // <-- FIXED: Changed 'unknown' back to 'Conversation'
}
// --- END FIX ---

interface ChatSidebarProps {
  chats: Chat[];
  selectedChatId: string | null;
  onChatClick: (chat: Chat) => void;
  isMobileOrTablet: boolean;
  selectedChat: Chat | null;
}

export default function SellerChatSidebar({
  chats,
  selectedChatId,
  onChatClick,
  isMobileOrTablet,
  selectedChat,
}: ChatSidebarProps) {
  return (
    // ... (rest of the component code remains the same)
    <div
      className={`bg-white flex flex-col overflow-hidden ${
        isMobileOrTablet && selectedChat
          ? 'hidden'
          : isMobileOrTablet
          ? 'w-full'
          : 'w-96 rounded-tl-3xl rounded-bl-3xl shadow-xs'
      }`}
    >
      <div className="p-4 mb-5 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">Messages</h1>
          <Filter className="w-5 h-5 text-gray-500" />
        </div>
        <div className="mt-3 relative">
          <Search className="absolute left-3 top-3 h-6 w-6 text-gray-400" />
          <input
            type="text"
            placeholder="Search"
            className="w-full pl-10 pr-16 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-sm outline-none"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {chats.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <p>No conversations yet</p>
          </div>
        ) : (
          chats.map((chat) => (
            <motion.div
              key={chat.id}
              onClick={() => onChatClick(chat)}
              className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${
                selectedChatId === chat.id ? 'bg-gray-50' : ''
              }`}
              whileHover={{ backgroundColor: 'rgb(249 250 251)' }}
              whileTap={{ scale: 0.99 }}
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Image
                    src={chat.avatar}
                    alt={chat.name}
                    width={48}
                    height={48}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  {chat.online && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-sm truncate">
                      {chat.name}
                    </h3>
                    <span className="text-xs text-gray-500">{chat.time}</span>
                  </div>
                  <p className="text-sm text-gray-600 truncate">
                    {chat.message}
                  </p>

                  {chat.unread > 0 && (
                    <div className="inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full mt-1">
                      {chat.unread}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}