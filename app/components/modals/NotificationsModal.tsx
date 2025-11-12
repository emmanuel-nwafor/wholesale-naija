// app/components/modals/NotificationsModal.tsx
"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, AlertCircle, XCircle, MessageSquare, Store, ShoppingBag, Star, Bell, X } from "lucide-react";

const mockNotifications = [
  {
    id: 1,
    type: "contact",
    title: "Contact Purchased",
    message: "A buyer has unlocked your contact details for ₦1,000",
    time: "0.4h ago",
    icon: <MessageSquare className="w-4 h-4" />,
    bg: "bg-blue-100",
    color: "text-blue-700",
    read: false,
  },
  {
    id: 2,
    type: "message",
    title: "New Message",
    message: "You have a new message from a buyer",
    time: "0.4h ago",
    icon: <MessageSquare className="w-4 h-4" />,
    bg: "bg-green-100",
    color: "text-green-700",
    read: false,
  },
  {
    id: 3,
    type: "verified",
    title: "Account Verified",
    message: "Your account has been successfully verified",
    time: "2 hours ago",
    icon: <CheckCircle className="w-4 h-4" />,
    bg: "bg-green-100",
    color: "text-green-700",
    read: true,
  },
  {
    id: 4,
    type: "store",
    title: "Store Info Updated",
    message: "Your store information has been updated",
    time: "2 hours ago",
    icon: <Store className="w-4 h-4" />,
    bg: "bg-blue-100",
    color: "text-blue-700",
    read: true,
  },
  {
    id: 5,
    type: "profile",
    title: "Profile Incomplete",
    message: "Complete profile to attract buyers",
    time: "2 hours ago",
    icon: <AlertCircle className="w-4 h-4" />,
    bg: "bg-yellow-100",
    color: "text-yellow-700",
    read: false,
  },
  {
    id: 6,
    type: "rating",
    title: "Rating Received",
    message: "You received overall 5 Star review",
    time: "2 days ago",
    icon: <Star className="w-4 h-4" />,
    bg: "bg-yellow-100",
    color: "text-yellow-700",
    read: true,
  },
  {
    id: 7,
    type: "approved",
    title: "Product Approved",
    message: "Your product iPhone 14 Pro is now live",
    time: "2 hours ago",
    icon: <CheckCircle className="w-4 h-4" />,
    bg: "bg-green-100",
    color: "text-green-700",
    read: true,
  },
  {
    id: 8,
    type: "rejected",
    title: "Product Rejected",
    message: "Your product Samsung A30 was rejected. Reason: missing images",
    time: "2 hours ago",
    icon: <XCircle className="w-4 h-4" />,
    bg: "bg-red-100",
    color: "text-red-700",
    read: false,
  },
  {
    id: 9,
    type: "deleted",
    title: "Product Deleted",
    message: "Your product Samsung A30 was deleted. Reason: violating guidelines",
    time: "2 hours ago",
    icon: <XCircle className="w-4 h-4" />,
    bg: "bg-red-100",
    color: "text-red-700",
    read: true,
  },
  {
    id: 10,
    type: "reminder",
    title: "Important Notice",
    message: "Scheduled maintenance from 12 AM - 2 AM",
    time: "10/08/2025",
    icon: <AlertCircle className="w-4 h-4" />,
    bg: "bg-gray-100",
    color: "text-gray-700",
    read: true,
  },
];

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NotificationsModal({ isOpen, onClose }: NotificationsModalProps) {
  const [activeTab, setActiveTab] = useState<"all" | "unread">("all");

  if (!isOpen) return null;

  const filteredNotifications = activeTab === "unread"
    ? mockNotifications.filter(n => !n.read)
    : mockNotifications;

  const unreadCount = mockNotifications.filter(n => !n.read).length;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 p-10 flex justify-end rounded-xl"
          onClick={onClose}
        >
          <motion.div
            initial={{ x: 400 }}
            animate={{ x: 0 }}
            exit={{ x: 400 }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="w-full max-w-md bg-white shadow-2xl rounded-2xl h-full overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-5 border-b border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-lg hover:bg-gray-100 transition"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              {/* Tabs */}
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setActiveTab("all")}
                  className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-all duration-200 ${
                    activeTab === "all"
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setActiveTab("unread")}
                  className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-all duration-200 relative ${
                    activeTab === "unread"
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Unread
                  {unreadCount > 0 && activeTab !== "unread" && (
                    <span className="absolute top-1 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
                  )}
                </button>
              </div>
            </div>

            {/* Notifications List */}
            <div className="flex-1 overflow-y-auto">
              <AnimatePresence mode="wait">
                {filteredNotifications.length === 0 ? (
                  <motion.p
                    key="empty"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-center text-gray-500 py-12"
                  >
                    No {activeTab === "unread" ? "unread" : ""} notifications
                  </motion.p>
                ) : (
                  <motion.div
                    key="list"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    {filteredNotifications.map((notif, index) => (
                      <motion.div
                        key={notif.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className={`p-4 border-b border-gray-50 hover:bg-gray-50 transition cursor-pointer ${
                          !notif.read ? "bg-blue-50/30" : ""
                        }`}
                      >
                        <div className="flex gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${notif.bg}`}>
                            <div className={notif.color}>{notif.icon}</div>
                          </div>
                          <div className="flex-1">
                            <p className={`text-sm font-medium ${notif.read ? "text-gray-900" : "text-gray-900 font-semibold"}`}>
                              {notif.title}
                              {!notif.read && <span className="ml-2 inline-block w-2 h-2 bg-blue-600 rounded-full"></span>}
                            </p>
                            <p className="text-xs text-gray-600 mt-1">{notif.message}</p>
                            <p className="text-xs text-gray-400 mt-2">{notif.time}</p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}