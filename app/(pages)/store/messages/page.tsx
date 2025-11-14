'use client';

import React, { useState, useEffect } from 'react';
import DashboardHeader from '@/app/components/header/DashboardHeader';
import StoreSidebar from '@/app/components/sidebar/StoreSidebar';
import { Search, MoreVertical, Paperclip, Send, ArrowLeft, MoreHorizontal, Filter } from 'lucide-react';
import Image from 'next/image';

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
  { id: '1', name: 'ABSOLUTE Stores', message: 'Office ipsum you must be muted. Quarter be anyway.', time: '03:48 PM', online: true },
  { id: '2', name: 'ABSOLUTE Stores', message: 'Office ipsum you must be muted. Quarter be anyway.', time: '2 hours ago', online: true },
  { id: '3', name: 'ABSOLUTE Stores', message: 'Office ipsum you must be muted. Quarter be anyway.', time: '03:48 PM', online: false, date: '10/08/2025' },
  { id: '4', name: 'ABSOLUTE Stores', message: 'Office ipsum you must be muted. Quarter be anyway.', time: '', online: true, date: '09/08/2025' },
];

const mockMessages: Message[] = [
  { id: '1', text: 'iPhone 15 Pro Max (Blue)... N28,000 - N30,500 MOQ: 20 bags', time: 'Today', sender: 'other', isImage: true },
  { id: '2', text: 'What are the main points in this document?', time: '03:48 PM', sender: 'user' },
  { id: '3', text: 'Startups are advised to outsource non-core tasks, invest in compliance, and use partnerships to scale effectively in a new on', time: '03:48 PM', sender: 'other' },
  { id: '4', text: 'What are the main points in this document?', time: '03:49 PM', sender: 'user' },
];

export default function ChatPage() {
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [message, setMessage] = useState('');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleChatClick = (chat: Chat) => {
    setSelectedChat(chat);
  };

  const handleBack = () => {
    setSelectedChat(null);
  };

  return (
    <>
      <div className="flex min-h-screen">
        <StoreSidebar />
        <div className="flex-1 flex flex-col">
          <DashboardHeader />
          <main className="flex-1 p-4 md:p-6 lg:p-8 md:ml-64">
            <div className="flex h-full gap-0">
              {/* Chat List - Hidden on mobile when chat selected */}
              <div className={`bg-white flex flex-col overflow-hidden ${isMobile && selectedChat ? 'hidden' : isMobile ? 'w-full' : 'w-96 rounded-xl shadow-sm'}`}>
                <div className="p-4 mb-5 border-gray-200">
                  <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold">Messages</h1>

                    <Filter />
                  </div>
                  <div className="mt-3 relative">
                    <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search"
                      className="w-full pl-10 pr-16 py-3 border border-gray-300 rounded-2xl text-sm"
                    />
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto">
                  {mockChats.map((chat) => (
                    <div
                      key={chat.id}
                      onClick={() => handleChatClick(chat)}
                      className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                        selectedChat?.id === chat.id ? 'bg-gray-50' : ''
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <div className="w-12 h-12 bg-gray-300 rounded-full" />
                          {chat.online && (
                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h3 className="font-medium text-sm truncate">{chat.name}</h3>
                            <span className="text-xs text-gray-500">{chat.time}</span>
                          </div>
                          <p className="text-sm text-gray-600 truncate">{chat.message}</p>
                          {chat.date && <p className="text-xs text-gray-400 mt-1">{chat.date}</p>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Chat Area - Hidden on mobile when no chat selected */}
              {selectedChat && (
                <div className={`flex-1 flex flex-col ${isMobile ? 'w-full' : 'ml-4 rounded-xl shadow-sm'} overflow-hidden`}>
                  {/* Header */}
                  <div className="px-4 py-3 flex items-center gap-3">
                    {isMobile && (
                      <button onClick={handleBack} className="p-1 hover:bg-gray-100 rounded-lg">
                        <ArrowLeft className="w-5 h-5" />
                      </button>
                    )}
                    <div className="flex items-center gap-3 flex-1">
                      <div className="relative">
                        <div className="w-10 h-10 bg-gray-300 rounded-full" />
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                      </div>
                      <div>
                        <h2 className="font-medium text-sm">{selectedChat.name}</h2>
                        <p className="text-xs text-green-600">Online</p>
                      </div>
                    </div>
                    <button className="p-2 hover:bg-gray-100 rounded-lg">
                      <MoreHorizontal className="h-5 w-5" />
                    </button>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {mockMessages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm ${
                            msg.sender === 'user' ? 'bg-white text-gray-800 shadow-2xs py-4' : 'bg-gray-100'
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
                              <p className={msg.sender === 'user' ? 'text-white' : ''}>{msg.text}</p>
                            </div>
                          )}
                          {!msg.isImage && <p>{msg.text}</p>}
                          {msg.time !== 'Today' && (
                            <p className={`text-xs mt-1 ${msg.sender === 'user' ? 'text-gray-500' : 'text-gray-800'} text-right`}>
                              {msg.time}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Input */}
                  <div className="border-t border-gray-200 p-3">
                    <div className="flex items-center gap-2">
                      <button className="p-2 hover:bg-gray-100 rounded-lg">
                        <Paperclip className="h-5 w-5 text-gray-500" />
                      </button>
                      <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Message"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-full text-sm focus:outline-none"
                      />
                      <button className="p-2 hover:bg-gray-100 rounded-lg">
                        <Send className="h-5 w-5 text-blue-600" />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Empty State - Desktop only */}
              {!isMobile && !selectedChat && (
                <div className="flex-1 bg-white rounded-xl shadow-sm flex items-center justify-center ml-4">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4 opacity-50" />
                    <p className="text-gray-500">You have no chat history</p>
                    <p className="text-gray-400 text-sm mt-2">Select a chat to view conversation</p>
                  </div>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </>
  );
}