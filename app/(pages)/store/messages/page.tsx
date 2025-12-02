// Updated ChatPage.tsx
'use client';

import React, { useState, useEffect } from 'react';
import DashboardHeader from '@/app/components/header/DashboardHeader';
import StoreSidebar from '@/app/components/sidebar/StoreSidebar';
import { Paperclip, Send, ArrowLeft, MoreHorizontal } from 'lucide-react';
import Image from 'next/image';
import ChatSidebar from '@/app/components/chat/ChatSidebar';
import ActionsModal from '@/app/components/chat/StoresActionsModal';
import DeleteModal from '@/app/components/modals/DeleteModal';

interface Message {
  id: string;
  text: string;
  time: string;
  sender: 'user' | 'other';
  isImage?: boolean;
}

interface Chat {
  id: string;
  name: string;
  message: string;
  time: string;
  online: boolean;
  date?: string;
}

const mockChats: Chat[] = [
  {
    id: '1',
    name: 'ABSOLUTE Stores',
    message: 'Office ipsum you must be muted. Quarter be anyway.',
    time: '03:48 PM',
    online: true,
  },
  {
    id: '2',
    name: 'ABSOLUTE Stores',
    message: 'Office ipsum you must be muted. Quarter be anyway.',
    time: '2 hours ago',
    online: true,
  },
  {
    id: '3',
    name: 'ABSOLUTE Stores',
    message: 'Office ipsum you must be muted. Quarter be anyway.',
    time: '03:48 PM',
    online: false,
    date: '10/08/2025',
  },
  {
    id: '4',
    name: 'ABSOLUTE Stores',
    message: 'Office ipsum you must be muted. Quarter be anyway.',
    time: '',
    online: true,
    date: '09/08/2025',
  },
];

const mockMessages: Message[] = [
  {
    id: '1',
    text: 'iPhone 15 Pro Max (Blue)... N28,000 - N30,500 MOQ: 20 bags',
    time: 'Today',
    sender: 'other',
    isImage: true,
  },
  {
    id: '2',
    text: 'What are the main points in this document?',
    time: '03:48 PM',
    sender: 'user',
  },
  {
    id: '3',
    text: 'Startups are advised to outsource non-core tasks, invest in compliance, and use partnerships to scale effectively in a new on',
    time: '03:48 PM',
    sender: 'other',
  },
  {
    id: '4',
    text: 'What are the main points in this document?',
    time: '03:49 PM',
    sender: 'user',
  },
];

export default function StoresChatPage() {
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [message, setMessage] = useState('');
  const [isMobileOrTablet, setIsMobileOrTablet] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => setIsMobileOrTablet(window.innerWidth < 1024);
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const handleChatClick = (chat: Chat) => {
    setSelectedChat(chat);
    setShowActions(false);
  };

  const handleBack = () => {
    setSelectedChat(null);
    setShowActions(false);
  };

  const toggleActions = () => {
    setShowActions((prev) => !prev);
  };

  const openDeleteModal = () => {
    setShowActions(false);
    setShowDeleteModal(true);
  };

  const handleDelete = () => {
    // Delete logic here
    setSelectedChat(null);
    setShowDeleteModal(false);
  };

  return (
    <>
      <div className="flex min-h-screen">
        <StoreSidebar />
        <div className="flex-1 flex flex-col">
          <DashboardHeader />
          <main className="flex-1 p-4 md:p-6 lg:p-8 md:ml-64">
            <div className="flex h-full gap-0 relative">
              <ChatSidebar
                chats={mockChats}
                selectedChatId={selectedChat?.id || null}
                onChatClick={handleChatClick}
                isMobileOrTablet={isMobileOrTablet}
                selectedChat={selectedChat}
              />

              {selectedChat && (
                <div
                  className={`flex-1 flex flex-col ${isMobileOrTablet ? 'w-full' : 'ml-4 rounded-xl shadow-sm'} overflow-hidden`}
                >
                  <div className="px-4 py-3 flex items-center gap-3 bg-white border-b border-gray-200 relative">
                    {isMobileOrTablet && (
                      <button
                        onClick={handleBack}
                        className="p-1 hover:bg-gray-100 rounded-lg"
                      >
                        <ArrowLeft className="w-5 h-5" />
                      </button>
                    )}
                    <div className="flex items-center gap-3 flex-1">
                      <div className="relative">
                        <div className="w-10 h-10 bg-gray-300 rounded-full" />
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                      </div>
                      <div>
                        <h2 className="font-medium text-sm">
                          {selectedChat.name}
                        </h2>
                        <p className="text-xs text-green-600">Online</p>
                      </div>
                    </div>
                    <button
                      onClick={toggleActions}
                      className="p-2 hover:bg-gray-100 rounded-lg"
                    >
                      <MoreHorizontal className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {mockMessages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm ${
                            msg.sender === 'user'
                              ? 'bg-white text-gray-800 shadow-xs'
                              : 'bg-gray-100'
                          }`}
                        >
                          {msg.isImage && (
                            <div className="flex items-center gap-2 mb-1">
                              <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden">
                                <Image
                                  src="/svgs/phone.png"
                                  alt="Product"
                                  width={64}
                                  height={64}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <p
                                className={
                                  msg.sender === 'user' ? 'text-gray-800' : ''
                                }
                              >
                                {msg.text}
                              </p>
                            </div>
                          )}
                          {!msg.isImage && <p>{msg.text}</p>}
                          {msg.time !== 'Today' && (
                            <p className="text-xs mt-1 text-gray-500 text-right">
                              {msg.time}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-gray-200 p-6 bg-white">
                    <div className="flex items-center gap-2">
                      <button className="p-2">
                        <Paperclip className="h-5 w-5 text-gray-500" />
                      </button>
                      <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Message"
                        className="flex-1 px-3 py-3 rounded-xl text-sm focus:outline-none"
                      />
                      <button className="p-2 hover:bg-gray-100 rounded-lg">
                        <Send className="h-7 w-7 fill-gray-200 text-gray-600" />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {!isMobileOrTablet && !selectedChat && (
                <div className="flex-1 p-5 bg-gray-100 rounded-br-3xl rounded-tr-3xl shadow-sm flex items-center justify-center">
                  <div className="text-center">
                    <Image
                      src="/svgs/emptyState-wholesale-svg.svg"
                      alt="no messages"
                      height={100}
                      width={100}
                      className="mx-auto mb-5"
                    />
                    <p className="text-gray-500">You have no chat history</p>
                  </div>
                </div>
              )}

              <ActionsModal
                show={showActions}
                onClose={() => setShowActions(false)}
                isMobileOrTablet={isMobileOrTablet}
                onDeleteClick={openDeleteModal}
              />

              <DeleteModal
                show={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={handleDelete}
              />
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
