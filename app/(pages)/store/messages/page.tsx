'use client';

import React, { useState, useEffect, useRef } from 'react';
import DashboardHeader from '@/app/components/header/DashboardHeader';
import StoreSidebar from '@/app/components/sidebar/StoreSidebar';
import { Search, Paperclip, Send, ArrowLeft, MoreHorizontal, Filter, Eye, Ban, Trash2, AlertTriangle, X } from 'lucide-react';
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
  const [isMobileOrTablet, setIsMobileOrTablet] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkScreenSize = () => setIsMobileOrTablet(window.innerWidth < 1024);
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        setShowActions(false);
      }
    };
    if (showActions) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showActions]);

  const handleChatClick = (chat: Chat) => {
    setSelectedChat(chat);
    setShowActions(false);
  };

  const handleBack = () => {
    setSelectedChat(null);
    setShowActions(false);
  };

  const toggleActions = () => {
    setShowActions(prev => !prev);
  };

  return (
    <>
      <div className="flex min-h-screen">
        <StoreSidebar />
        <div className="flex-1 flex flex-col">
          <DashboardHeader />
          <main className="flex-1 p-4 md:p-6 lg:p-8 md:ml-64">
            <div className="flex h-full gap-0 relative">
              {/* Chat List */}
              <div className={`bg-white flex flex-col overflow-hidden ${isMobileOrTablet && selectedChat ? 'hidden' : isMobileOrTablet ? 'w-full' : 'w-96 rounded-tl-3xl rounded-bl-3xl shadow-sm'}`}>
                <div className="p-4 mb-5 border-gray-200">
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

              {/* Chat Area */}
              {selectedChat && (
                <div className={`flex-1 flex flex-col ${isMobileOrTablet ? 'w-full' : 'ml-4 rounded-xl shadow-sm'} overflow-hidden`}>
                  {/* Header */}
                  <div className="px-4 py-3 flex items-center gap-3 bg-white border-b border-gray-200 relative">
                    {isMobileOrTablet && (
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
                    <button onClick={toggleActions} className="p-2 hover:bg-gray-100 rounded-lg">
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
                            msg.sender === 'user' ? 'bg-white text-gray-800 shadow-xs' : 'bg-gray-100'
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
                              <p className={msg.sender === 'user' ? 'text-gray-800' : ''}>{msg.text}</p>
                            </div>
                          )}
                          {!msg.isImage && <p>{msg.text}</p>}
                          {msg.time !== 'Today' && (
                            <p className={`text-xs mt-1 text-gray-500 text-right`}>
                              {msg.time}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Input */}
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

              {/* Empty State - Desktop only */}
              {!isMobileOrTablet && !selectedChat && (
                <div className="flex-1 p-5 bg-gray-100 rounded-br-3xl rounded-tr-3xl shadow-sm flex items-center justify-center">
                  <div className="text-center">
                    <Image 
                      src="/svgs/emptyState-wholesale-svg.svg"
                      alt='no messages'
                      height={100}
                      width={100}
                      className='mx-auto mb-5'
                    />
                    <p className="text-gray-500">You have no chat history</p>
                  </div>
                </div>
              )}

              {/* Actions Modal - Mobile Bottom Sheet / Desktop Dropdown */}
              {showActions && selectedChat && (
                <div className={`fixed inset-0 z-50 flex ${isMobileOrTablet ? 'justify-center items-end' : 'items-start justify-center'}`}>
                  {/* Backdrop */}
                  <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setShowActions(false)} />

                  {/* Modal Content */}
                  <div
                    ref={modalRef}
                    className={`relative bg-white w-full ${isMobileOrTablet ? 'max-w-md rounded-t-3xl' : 'max-w-xs rounded-2xl shadow-2xl'} overflow-hidden`}
                  >
                    {/* Mobile Handle */}
                    {isMobileOrTablet && (
                      <div className="flex justify-center pt-3 pb-2">
                        <div className="w-12 h-1 bg-gray-300 rounded-full" />
                      </div>
                    )}

                    {/* Header */}
                    <div className="px-6 py-4 border-b border-gray-100">
                      <h3 className="font-semibold text-lg">Actions</h3>
                    </div>

                    {/* Actions List */}
                    <div className="py-2">
                      <button className="w-full flex items-center gap-3 px-6 py-3 hover:bg-gray-50 text-left">
                        <Eye className="w-5 h-5 text-gray-600" />
                        <span className="text-gray-700">View Profile</span>
                      </button>
                      <button className="w-full flex items-center gap-3 px-6 py-3 hover:bg-gray-50 text-left">
                        <Ban className="w-5 h-5 text-gray-600" />
                        <span className="text-gray-700">Block User</span>
                      </button>
                      <button className="w-full flex items-center gap-3 px-6 py-3 hover:bg-gray-50 text-left">
                        <Trash2 className="w-5 h-5 text-gray-600" />
                        <span className="text-gray-700">Delete Conversation</span>
                      </button>
                      <button className="w-full flex items-center gap-3 px-6 py-3 hover:bg-gray-50 text-left text-red-600">
                        <AlertTriangle className="w-5 h-5" />
                        <span>Report User</span>
                        <span className="ml-auto">→</span>
                      </button>
                    </div>

                    {/* Mobile Close Button */}
                    {isMobileOrTablet && (
                      <div className="border-t border-gray-100 p-4">
                        <button
                          onClick={() => setShowActions(false)}
                          className="w-full py-3 text-center text-red-600 font-medium"
                        >
                          Close
                        </button>
                      </div>
                    )}
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