// app/(pages)/chat/page.tsx
'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Paperclip, Send, ArrowLeft, MoreHorizontal } from 'lucide-react';
import Image from 'next/image';
import ChatSidebar from '@/app/components/chat/ChatSidebar';
import ActionsModal from '@/app/components/chat/BuyersActionsModal';
import DeleteModal from '@/app/components/modals/DeleteModal';
import Header from '@/app/components/header/Header';
import { fetchWithToken } from '@/app/utils/fetchWithToken';
import { getCurrentSellerId } from '@/app/utils/auth';

interface Participant {
  _id: string;
  fullName: string;
  profilePicture?: { url: string };
  store?: { name: string };
}

interface Conversation {
  _id: string;
  participants: Participant[];
  lastMessageAt?: string | null;
  createdAt: string;
  updatedAt: string;
  unreadCounts?: Record<string, number>;
}

interface Message {
  _id: string;
  body: string;
  createdAt: string;
  sender: string;
}

// NEW: Shared product from product page
interface SharedProduct {
  id: string;
  name: string;
  price: number;
  moq: number;
  image: string;
}

export default function BuyersChatPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedChat, setSelectedChat] = useState<any>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState('');
  const [isMobileOrTablet, setIsMobileOrTablet] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [sharedProduct, setSharedProduct] = useState<SharedProduct | null>(null); // ← NEW

  const currentUserId = getCurrentSellerId();

  useEffect(() => {
    const checkScreenSize = () => setIsMobileOrTablet(window.innerWidth < 1024);
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Fetch conversations
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const res = await fetchWithToken('/v1/chat/conversations');
        setConversations((res as any)?.conversations || []);
      } catch (err) {
        console.error('Failed to load chats:', err);
      }
    };
    fetchConversations();
  }, []);

  // NEW: Check for shared product on load
  useEffect(() => {
    const pending = sessionStorage.getItem('pendingChatWithProduct');
    if (pending && conversations.length > 0) {
      const data = JSON.parse(pending);
      setSharedProduct(data.product);

      // Auto-open the correct conversation
      const targetConv = conversations.find(c =>
        c.participants.some((p: any) => p._id === data.sellerId)
      );

      if (targetConv) {
        const chatItem = sidebarChats.find((c: any) => c.id === targetConv._id);
        if (chatItem) {
          handleChatClick(chatItem);
        }
      }

      sessionStorage.removeItem('pendingChatWithProduct');
    }
  }, [conversations]);

  // Fetch messages when chat selected
  useEffect(() => {
    if (!selectedChat) {
      setMessages([]);
      return;
    }

    const fetchMessages = async () => {
      try {
        const res = await fetchWithToken(`/v1/chat/conversations/${selectedChat.id}/messages`);
        setMessages((res as any)?.messages || []);
      } catch (err) {
        console.error('Failed to load messages:', err);
      }
    };
    fetchMessages();
  }, [selectedChat]);

  const handleChatClick = (chat: any) => {
    setSelectedChat(chat);
    setShowActions(false);
  };

  const handleBack = () => {
    setSelectedChat(null);
    setShowActions(false);
  };

  const toggleActions = () => setShowActions(prev => !prev);
  const openDeleteModal = () => { setShowActions(false); setShowDeleteModal(true); };
  const handleDelete = () => { setSelectedChat(null); setShowDeleteModal(false); };

  const getOtherParticipant = (conv: Conversation) => {
    return conv.participants.find(p => p._id !== currentUserId) || conv.participants[0];
  };

  const getChatDisplay = () => {
    if (!selectedChat?.conv) return null;
    const other = getOtherParticipant(selectedChat.conv);
    return {
      name: other?.store?.name || other?.fullName || 'Unknown',
      avatar: other?.profilePicture?.url || '/svgs/default-avatar.svg',
    };
  };

  const handleSend = async () => {
    if (!message.trim() || !selectedChat) return;

    const text = message.trim();
    setMessage('');

    try {
      await fetchWithToken(`/v1/chat/conversations/${selectedChat.id}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ body: text }),
      });

      const newMsg: Message = {
        _id: Date.now().toString(),
        body: text,
        createdAt: new Date().toISOString(),
        sender: currentUserId!,
      };
      setMessages(prev => [...prev, newMsg]);

      setConversations(prev => prev.map(c =>
        c._id === selectedChat.id
          ? { ...c, lastMessageAt: new Date().toISOString() }
          : c
      ));
    } catch (err) {
      alert('Failed to send message');
      setMessage(text);
    }
  };

  const chatDisplay = getChatDisplay();

  const sidebarChats = useMemo(() => {
    return [...conversations]
      .sort((a, b) => {
        const aTime = a.lastMessageAt || a.createdAt;
        const bTime = b.lastMessageAt || b.createdAt;
        return new Date(bTime).getTime() - new Date(aTime).getTime();
      })
      .map(conv => {
        const other = getOtherParticipant(conv);
        let lastMessageText = 'No messages yet';
        if (selectedChat?.id === conv._id && messages.length > 0) {
          lastMessageText = messages[messages.length - 1].body;
        }

        const time = conv.lastMessageAt
          ? new Date(conv.lastMessageAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
          : '';

        return {
          id: conv._id,
          name: other?.store?.name || other?.fullName || 'Unknown',
          message: lastMessageText,
          time,
          online: true,
          avatar: other?.profilePicture?.url || '/svgs/default-avatar.svg',
          unread: conv.unreadCounts?.[currentUserId!] || 0,
          conv,
        };
      });
  }, [conversations, selectedChat, messages, currentUserId]);

  return (
    <>
      <div className="flex min-h-screen bg-gray-50">
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="flex-1 md:p-10 p-3">
            <div className="flex h-full gap-0 relative max-w-7xl mx-auto">

              <ChatSidebar
                chats={sidebarChats}
                selectedChatId={selectedChat?.id || null}
                onChatClick={handleChatClick}
                isMobileOrTablet={isMobileOrTablet}
                selectedChat={selectedChat}
              />

              {selectedChat && chatDisplay && (
                <div className={`flex-1 flex flex-col bg-white ${isMobileOrTablet ? 'w-full' : 'rounded-3xl shadow-lg'} overflow-hidden`}>
                  
                  {/* Header */}
                  <div className="px-6 py-4 flex items-center gap-4 bg-white border-b border-gray-200">
                    {isMobileOrTablet && (
                      <button onClick={handleBack} className="p-2 hover:bg-gray-100 rounded-lg">
                        <ArrowLeft className="w-5 h-5" />
                      </button>
                    )}
                    <div className="flex items-center gap-3 flex-1">
                      <div className="relative">
                        <Image
                          src={chatDisplay.avatar}
                          alt={chatDisplay.name}
                          width={44}
                          height={44}
                          className="w-11 h-11 rounded-full object-cover border-2 border-white shadow-sm"
                        />
                        <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white" />
                      </div>
                      <div>
                        <h2 className="font-semibold text-gray-900">{chatDisplay.name}</h2>
                        <p className="text-xs text-green-600">Online</p>
                      </div>
                    </div>
                    <button onClick={toggleActions} className="p-2 hover:bg-gray-100 rounded-lg">
                      <MoreHorizontal className="h-5 w-5 text-gray-600" />
                    </button>
                  </div>

                  {/* NEW: Shared Product Card */}
                  {sharedProduct && (
                    <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                      <div className="flex items-center gap-4 max-w-2xl mx-auto bg-white rounded-2xl p-4 shadow-md border border-gray-100">
                        <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
                          <Image
                            src={sharedProduct.image}
                            alt={sharedProduct.name}
                            width={80}
                            height={80}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-gray-900 truncate text-lg">{sharedProduct.name}</h4>
                          <p className="text-xl font-bold text-slate-900">₦{sharedProduct.price.toLocaleString()}</p>
                          <p className="text-sm text-gray-600">MOQ: {sharedProduct.moq} bags</p>
                        </div>
                        <button
                          onClick={() => setSharedProduct(null)}
                          className="text-gray-400 hover:text-gray-700 text-3xl font-light -mr-2"
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 lg:p-6 bg-gray-50">
                    {messages.length === 0 ? (
                      <div className="text-center text-gray-500 mt-20">
                        <p className="text-lg">No messages yet. Say hi!</p>
                      </div>
                    ) : (
                      messages.map((msg, index) => {
                        const isMe = msg.sender === currentUserId;
                        const prevMsg = messages[index - 1];
                        const isFirstInGroup = !prevMsg || prevMsg.sender !== msg.sender;

                        return (
                          <div
                            key={msg._id}
                            className={`flex items-end gap-2 mb-2 ${isMe ? 'justify-end' : 'justify-start'}`}
                          >
                            {!isMe && isFirstInGroup && (
                              <Image
                                src={chatDisplay.avatar}
                                alt={chatDisplay.name}
                                width={32}
                                height={32}
                                className="w-8 h-8 rounded-full object-cover"
                              />
                            )}
                            {!isMe && !isFirstInGroup && <div className="w-8 h-8" />}

                            <div
                              className={`relative max-w-xs lg:max-w-md px-4 py-3 rounded-2xl shadow-sm ${
                                isMe
                                  ? 'bg-slate-900 text-white rounded-br-none'
                                  : 'bg-white text-gray-900 rounded-bl-none border border-gray-200'
                              }`}
                            >
                              <p className="text-sm leading-relaxed">{msg.body}</p>
                              <div className="flex items-center justify-end gap-1 mt-1">
                                <span className="text-xs opacity-70">
                                  {new Date(msg.createdAt).toLocaleTimeString([], {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                  })}
                                </span>
                                {isMe && (
                                  <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 16 16">
                                    <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425a.247.247 0 0 1 .02-.037Z"/>
                                  </svg>
                                )}
                              </div>

                              <div
                                className={`absolute bottom-0 w-3 h-3 ${
                                  isMe ? 'right-0 -mr-1 bg-slate-900' : 'left-0 -ml-1 bg-white'
                                }`}
                                style={{
                                  clipPath: isMe
                                    ? 'polygon(100% 0%, 0% 100%, 100% 100%)'
                                    : 'polygon(0% 0%, 100% 100%, 0% 100%)',
                                }}
                              />
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>

                  {/* Input */}
                  <div className="border-t border-gray-200 p-4 bg-white">
                    <div className="flex items-center gap-3">
                      <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg">
                        <Paperclip className="h-5 w-5" />
                      </button>
                      <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                        placeholder="Type a message..."
                        className="flex-1 px-4 py-3 bg-gray-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                      />
                      <button
                        onClick={handleSend}
                        disabled={!message.trim()}
                        className="p-3 bg-slate-900 text-white rounded-2xl hover:bg-slate-800 disabled:opacity-50 transition"
                      >
                        <Send className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Empty State */}
              {!isMobileOrTablet && !selectedChat && (
                <div className="flex-1 flex items-center justify-center bg-gray-100 rounded-3xl">
                  <div className="text-center">
                    <Image
                      src="/svgs/emptyState-wholesale-svg.svg"
                      alt="no messages"
                      width={180}
                      height={180}
                      className="mx-auto mb-6 opacity-80"
                    />
                    <p className="text-gray-600 text-lg">Select a chat to start messaging</p>
                  </div>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>

      <ActionsModal show={showActions} onClose={() => setShowActions(false)} isMobileOrTablet={isMobileOrTablet} onDeleteClick={openDeleteModal} />
      <DeleteModal show={showDeleteModal} onClose={() => setShowDeleteModal(false)} onConfirm={handleDelete} />
    </>
  );
}