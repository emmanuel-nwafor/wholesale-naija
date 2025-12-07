// app/(pages)/store/messages/page.tsx
'use client';
import React, { useState, useEffect, useMemo } from 'react';
import DashboardHeader from '@/app/components/header/DashboardHeader';
import SellerChatStoreSidebar from '@/app/components/sidebar/SellerChatStoreSidebar';
import SellerChatSidebar from '@/app/components/chat/SellerChatSidebar';
import ActionsModal from '@/app/components/chat/StoresActionsModal';
import DeleteModal from '@/app/components/modals/DeleteModal';
import { Send, ArrowLeft, MoreHorizontal } from 'lucide-react'; // FIX 1: Removed unused 'Paperclip' import
import Image from 'next/image';
import { fetchWithToken } from '@/app/utils/fetchWithToken';
import { getCurrentSellerId } from '@/app/utils/auth';

// Types unchanged...
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
interface Message {
  _id: string;
  body: string;
  createdAt: string;
  sender: string;
}
interface SharedProduct {
  id: string;
  name: string;
  price: number;
  moq: number;
  image: string;
}
interface Chat {
  id: string;
  name: string;
  message: string;
  time: string;
  avatar: string;
  unread: number;
  online: boolean;
  conv: Conversation;
}

export default function StoresChatPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [sharedProduct, setSharedProduct] = useState<SharedProduct | null>(
    null
  );

  const currentSellerId = getCurrentSellerId();

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    const load = async () => {
      try {
        const res: { conversations: Conversation[] } = await fetchWithToken(
          '/v1/chat/conversations'
        );
        setConversations(res.conversations || []);
      } catch (err) {
        console.error('Failed to load conversations:', err);
      }
    };
    load();
  }, []);

  // Pending product share
  useEffect(() => {
    const pending = sessionStorage.getItem('pendingChatWithProduct');
    if (!pending || conversations.length === 0) return;

    const data = JSON.parse(pending);
    setSharedProduct(data.product);
    const targetConv = conversations.find((c) =>
      c.participants.some((p) => p._id === data.buyerId)
    );
    if (targetConv) {
      const buyer = targetConv.participants.find(
        (p) => p._id !== currentSellerId
      );
      setSelectedChat({
        id: targetConv._id,
        name: buyer?.fullName || 'Buyer',
        message: 'No messages yet',
        time: '',
        avatar: buyer?.profilePicture?.url || '/svgs/default-avatar.svg',
        unread: 0,
        online: true,
        conv: targetConv,
      });
    }
    sessionStorage.removeItem('pendingChatWithProduct');
  }, [conversations, currentSellerId]);

  // Load messages
  useEffect(() => {
    if (!selectedChat) {
      setMessages([]);
      return;
    }
    const load = async () => {
      try {
        const res: { messages: Message[] } = await fetchWithToken(
          `/v1/chat/conversations/${selectedChat.id}/messages`
        );
        setMessages(res.messages || []);
      } catch (err) {
        console.error(err);
      }
    };
    load();
  }, [selectedChat]);

  const buyer = useMemo(() => {
    return (
      selectedChat?.conv.participants.find((p) => p._id !== currentSellerId) ||
      null
    );
  }, [selectedChat, currentSellerId]);

  const handleSend = async () => {
    if (!message.trim() || !selectedChat) return;
    const text = message.trim();
    setMessage('');

    try {
      await fetchWithToken(
        `/v1/chat/conversations/${selectedChat.id}/messages`,
        {
          method: 'POST',
          body: JSON.stringify({ body: text }),
        }
      );

      const newMsg: Message = {
        _id: Date.now().toString(),
        body: text,
        createdAt: new Date().toISOString(),
        sender: currentSellerId!,
      };
      setMessages((prev) => [...prev, newMsg]);
      setConversations((prev) =>
        prev.map((c) =>
          c._id === selectedChat.id
            ? { ...c, lastMessageAt: new Date().toISOString() }
            : c
        )
      );
    } catch (_err) {
      // FIX 2: Renamed 'err' to '_err' to avoid unused variable warning
      alert('Failed to send message');
      setMessage(text);
    }
  };

  const sidebarChats = useMemo(() => {
    return conversations
      .sort(
        (a, b) =>
          new Date(b.lastMessageAt || b.createdAt).getTime() -
          new Date(a.lastMessageAt || a.createdAt).getTime()
      )
      .map((conv) => {
        const buyer = conv.participants.find((p) => p._id !== currentSellerId);
        const lastMsg =
          selectedChat?.id === conv._id && messages.length > 0
            ? messages[messages.length - 1].body
            : 'No messages yet';

        return {
          id: conv._id,
          name: buyer?.fullName || 'Buyer',
          message: lastMsg,
          time: conv.lastMessageAt
            ? new Date(conv.lastMessageAt).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })
            : '',
          avatar: buyer?.profilePicture?.url || '/svgs/default-avatar.svg',
          unread: conv.unreadCounts?.[currentSellerId!] || 0,
          online: true,
          conv,
        };
      });
  }, [conversations, selectedChat, messages, currentSellerId]);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Fixed Desktop Sidebar */}
      <div className="hidden lg:block fixed inset-y-0 left-0 z-50 w-64">
        <SellerChatStoreSidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        {/* Fixed Header */}
        <div className="fixed top-0 left-0 right-0 z-40 bg-white border-b border-gray-200">
          <DashboardHeader />
        </div>

        {/* Mobile Sidebar */}
        <div className="lg:hidden">
          <SellerChatStoreSidebar />
        </div>

        {/* Chat Container */}
        <main className="flex-1 flex flex-col mt-16 lg:mt-16 overflow-hidden">
          <div className="flex flex-1 overflow-hidden">
            {/* Chat List - Hidden on mobile when chat is open */}
            <div
              className={`
              ${isMobile && selectedChat ? 'hidden' : 'flex'}
              flex-col w-full lg:w-96 bg-white border-r border-gray-200
            `}
            >
              <SellerChatSidebar
                chats={sidebarChats}
                selectedChatId={selectedChat?.id || null}
                onChatClick={(chat) => setSelectedChat(chat)}
                isMobileOrTablet={isMobile}
                selectedChat={selectedChat}
              />
            </div>

            {/* Chat Window - Full screen on mobile when selected */}
            <div
              className={`
              ${!selectedChat ? 'hidden lg:flex' : 'flex'}
              flex-col flex-1 bg-white
              ${isMobile ? 'fixed inset-0 z-30' : ''}
            `}
            >
              {selectedChat && buyer ? (
                <>
                  {/* Chat Header */}
                  <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200">
                    <div className="flex items-center gap-3">
                      {isMobile && (
                        <button
                          onClick={() => setSelectedChat(null)}
                          className="p-2 hover:bg-gray-100 rounded-lg"
                        >
                          <ArrowLeft className="w-6 h-6" />
                        </button>
                      )}
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <Image
                            src={
                              buyer.profilePicture?.url ||
                              '/svgs/default-avatar.svg'
                            }
                            alt={buyer.fullName}
                            width={40}
                            height={40}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {buyer.fullName}
                          </h3>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowActions(true)}
                      className="p-2 hover:bg-gray-100 rounded-lg"
                    >
                      <MoreHorizontal className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Shared Product */}
                  {sharedProduct && (
                    <div className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 border-b">
                      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-sm flex items-center gap-4 p-4">
                        <Image
                          src={sharedProduct.image}
                          alt=""
                          width={80}
                          height={80}
                          className="rounded-xl object-cover"
                        />
                        <div className="flex-1">
                          <h4 className="font-bold truncate">
                            {sharedProduct.name}
                          </h4>
                          <p className="text-xl font-bold text-indigo-600">
                            ₦{sharedProduct.price.toLocaleString()}
                          </p>
                          <p className="text-sm text-gray-600">
                            MOQ: {sharedProduct.moq} units
                          </p>
                        </div>
                        <button
                          onClick={() => setSharedProduct(null)}
                          className="text-2xl"
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
                    {messages.length === 0 ? (
                      <div className="text-center text-gray-500 mt-20">
                        <p>No messages yet. Start the conversation!</p>
                      </div>
                    ) : (
                      messages.map((msg, i) => {
                        const isMe = msg.sender === currentSellerId;
                        const prev = messages[i - 1];
                        const isFirst = !prev || prev.sender !== msg.sender;

                        return (
                          <div
                            key={msg._id}
                            className={`flex items-end gap-3 mb-4 ${isMe ? 'justify-end' : ''}`}
                          >
                            {!isMe && isFirst && (
                              <Image
                                src={
                                  buyer.profilePicture?.url ||
                                  '/svgs/default-avatar.svg'
                                }
                                alt=""
                                width={32}
                                height={32}
                                className="w-8 h-8 rounded-full"
                              />
                            )}
                            {!isMe && !isFirst && <div className="w-8" />}
                            <div
                              className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl shadow-sm ${
                                isMe
                                  ? 'bg-slate-900 text-white rounded-br-none'
                                  : 'bg-white rounded-bl-none'
                              }`}
                            >
                              <p className="text-sm">{msg.body}</p>
                              <span className="text-xs opacity-70 block text-right mt-1">
                                {new Date(msg.createdAt).toLocaleTimeString(
                                  [],
                                  { hour: '2-digit', minute: '2-digit' }
                                )}
                              </span>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>

                  {/* Input */}
                  <div className="p-4 bg-white">
                    <div className="flex items-center gap-3">
                      <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={(e) =>
                          e.key === 'Enter' && !e.shiftKey && handleSend()
                        }
                        placeholder="Type a message..."
                        className="flex-1 px-4 py-3 bg-gray-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                      />
                      <button
                        onClick={handleSend}
                        disabled={!message.trim()}
                        className="p-3 bg-slate-900 text-white rounded-2xl hover:bg-slate-800 disabled:opacity-50"
                      >
                        <Send className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                /* Empty state - only visible on desktop or when no chat selected on mobile */
                <div className="hidden lg:flex flex-1 items-center justify-center bg-gray-100">
                  <div className="text-center">
                    <Image
                      src="/svgs/emptyState-wholesale-svg.svg"
                      alt="No chat"
                      width={200}
                      height={200}
                      className="mx-auto mb-6 opacity-60"
                    />
                    <p className="text-gray-600 text-lg">
                      Select a buyer to start chatting
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Modals */}
      <ActionsModal
        show={showActions}
        onClose={() => setShowActions(false)}
        isMobileOrTablet={isMobile}
        onDeleteClick={() => {
          setShowActions(false);
          setShowDeleteModal(true);
        }}
      />
      <DeleteModal
        show={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={() => {
          if (selectedChat) {
            setConversations((prev) =>
              prev.filter((c) => c._id !== selectedChat.id)
            );
            setSelectedChat(null);
          }
          setShowDeleteModal(false);
        }}
        mode="delete"
        itemName="this conversation"
      />
    </div>
  );
}
