'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Paperclip, Send, ArrowLeft, MoreHorizontal } from 'lucide-react';
import Image from 'next/image';
import ChatSidebar from '@/app/components/chat/ChatSidebar';
import ActionsModal from '@/app/components/chat/BuyersActionsModal';
import DeleteModal from '@/app/components/modals/DeleteModal';
import Header from '@/app/components/header/Header';
import DynamicHeader from '@/app/components/header/DynamicHeader';
import { fetchWithToken } from '@/app/utils/fetchWithToken';
import { getCurrentSellerId } from '@/app/utils/auth';

interface Participant {
  _id: string;
  fullName: string;
  profilePicture?: { url: string };
  store?: { name: string; _id: string };
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

type ModalMode = 'delete' | 'block' | 'unblock';

export default function BuyersChatPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedChat, setSelectedChat] = useState<any>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState('');
  const [isMobileOrTablet, setIsMobileOrTablet] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmMode, setConfirmMode] = useState<ModalMode>('delete');
  const [loading, setLoading] = useState(false);

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

  // Handle direct open from product page
  useEffect(() => {
    const targetSellerId = sessionStorage.getItem('pendingChatSellerId');
    if (!targetSellerId || conversations.length === 0) return;

    sessionStorage.removeItem('pendingChatSellerId');

    const existingConv = conversations.find(conv =>
      conv.participants.some(p => p._id === currentUserId) &&
      conv.participants.some(p => p._id === targetSellerId)
    );

    if (existingConv) {
      const other = existingConv.participants.find(p => p._id !== currentUserId);
      const chatItem = {
        id: existingConv._id,
        name: other?.store?.name || other?.fullName || 'Seller',
        message: 'No messages yet',
        time: '',
        online: true,
        avatar: other?.profilePicture?.url || '/svgs/default-avatar.svg',
        conv: existingConv,
      };
      handleChatClick(chatItem);
      return;
    }

    const createAndOpen = async () => {
      try {
        const res = await fetchWithToken('/v1/chat/conversations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ participantIds: [targetSellerId] }),
        });
        const newConv = (res as any).conversation || res;
        setConversations(prev => [newConv, ...prev]);

        const other = newConv.participants.find((p: any) => p._id !== currentUserId);
        const chatItem = {
          id: newConv._id,
          name: other?.store?.name || other?.fullName || 'Seller',
          message: 'No messages yet',
          time: '',
          online: true,
          avatar: other?.profilePicture?.url || '/svgs/default-avatar.svg',
          conv: newConv,
        };
        handleChatClick(chatItem);
      } catch (err) {
        console.error('Failed to create chat:', err);
        alert('Could not start chat. Try again.');
      }
    };
    createAndOpen();
  }, [conversations, currentUserId]);

  // Fetch messages
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

  const handleBack = () => setSelectedChat(null);

  const getOtherParticipant = (conv: Conversation) => {
    return conv.participants.find(p => p._id !== currentUserId) || conv.participants[0];
  };

  const getChatDisplay = () => {
    if (!selectedChat?.conv) return null;
    const other = getOtherParticipant(selectedChat.conv);
    return {
      name: other?.store?.name || other?.fullName || 'Seller',
      avatar: other?.profilePicture?.url || '/svgs/default-avatar.svg',
      sellerId: other?._id,
      storeId: other?.store?._id,
    };
  };

  const chatDisplay = getChatDisplay();

  // Handle delete/block/unblock actions
  const handleConfirmAction = async () => {
    if (!selectedChat || !chatDisplay?.sellerId) return;

    setLoading(true);

    try {
      if (confirmMode === 'delete') {
        // Delete conversation (you may have a DELETE endpoint)
        await fetchWithToken(`/v1/chat/conversations/${selectedChat.id}`, { method: 'DELETE' });
        setConversations(prev => prev.filter(c => c._id !== selectedChat.id));
        setSelectedChat(null);
      } else {
        const method = confirmMode === 'block' ? 'POST' : 'DELETE';
        await fetchWithToken(`/v1/users/me/block/${chatDisplay.sellerId}`, { method });
        alert(confirmMode === 'block' ? 'User blocked' : 'User unblocked');
      }
    } catch (err) {
      alert(`Failed to ${confirmMode === 'block' ? 'block' : confirmMode === 'unblock' ? 'unblock' : 'delete'}`);
    } finally {
      setLoading(false);
      setShowConfirmModal(false);
      setShowActions(false);
    }
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

  const sidebarChats = useMemo(() => {
    return conversations
      .sort((a, b) => {
        const aTime = a.lastMessageAt || a.createdAt;
        const bTime = b.lastMessageAt || b.createdAt;
        return new Date(bTime).getTime() - new Date(aTime).getTime();
      })
      .map(conv => {
        const other = conv.participants.find(p => p._id !== currentUserId);
        const lastMsg = selectedChat?.id === conv._id && messages.length > 0
          ? messages[messages.length - 1].body
          : 'No messages yet';
        return {
          id: conv._id,
          name: other?.store?.name || other?.fullName || 'Seller',
          message: lastMsg,
          time: conv.lastMessageAt
            ? new Date(conv.lastMessageAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
            : '',
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
          <DynamicHeader />
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
                <div className={`flex-1 flex flex-col bg-white ${isMobileOrTablet ? 'w-full' : 'rounded-r-3xl shadow-lg'} overflow-hidden`}>
                  {/* Chat Header */}
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
                    <button
                      onClick={() => setShowActions(true)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition"
                    >
                      <MoreHorizontal className="h-5 w-5 text-gray-600" />
                    </button>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 lg:p-6 bg-gray-50">
                    {messages.length === 0 ? (
                      <div className="text-center text-gray-500 mt-20">
                        <p className="text-lg">No messages yet. Say hi!</p>
                      </div>
                    ) : (
                      messages.map((msg, i) => {
                        const isMe = msg.sender === currentUserId;
                        const prev = messages[i - 1];
                        const isFirst = !prev || prev.sender !== msg.sender;

                        return (
                          <div key={msg._id} className={`flex items-end gap-2 mb-2 ${isMe ? 'justify-end' : 'justify-start'}`}>
                            {!isMe && isFirst && (
                              <Image src={chatDisplay.avatar} alt="" width={32} height={32} className="w-8 h-8 rounded-full object-cover" />
                            )}
                            {!isMe && !isFirst && <div className="w-8 h-8" />}

                            <div className={`relative max-w-xs lg:max-w-md px-4 py-3 rounded-2xl shadow-sm ${
                              isMe
                                ? 'bg-slate-900 text-white rounded-br-none'
                                : 'bg-white text-gray-900 rounded-bl-none border border-gray-200'
                            }`}>
                              <p className="text-sm leading-relaxed">{msg.body}</p>
                              <span className="text-xs opacity-70 block text-right mt-1">
                                {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                              <div className={`absolute bottom-0 w-3 h-3 ${isMe ? 'right-0 -mr-1 bg-slate-900' : 'left-0 -ml-1 bg-white'}`}
                                style={{ clipPath: isMe ? 'polygon(100% 0%, 0% 100%, 100% 100%)' : 'polygon(0% 0%, 100% 100%, 0% 100%)' }}
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
                    <Image src="/svgs/emptyState-wholesale-svg.svg" alt="no messages" width={180} height={180} className="mx-auto mb-6 opacity-80" />
                    <p className="text-gray-600 text-lg">Select a chat to start messaging</p>
                  </div>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>

      {/* Actions Modal */}
      {selectedChat && chatDisplay && (
        <ActionsModal
          show={showActions}
          onClose={() => setShowActions(false)}
          isMobile={isMobileOrTablet && window.innerWidth < 768}
          onDeleteClick={() => {
            setConfirmMode('delete');
            setShowActions(false);
            setShowConfirmModal(true);
          }}
          sellerId={chatDisplay.sellerId}
          storeId={chatDisplay.storeId}
          sellerName={chatDisplay.name}
          isBlocked={false} // You can enhance this later with real blocked status
        />
      )}

      {/* Reusable Confirmation Modal */}
      <DeleteModal
        show={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleConfirmAction}
        mode={confirmMode}
        itemName={chatDisplay?.name}
        loading={loading}
      />
    </>
  );
}