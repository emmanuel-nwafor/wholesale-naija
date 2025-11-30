// app/components/modals/NotificationsModal.tsx
"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle,
  Star,
  Megaphone,
  X,
  Package,
  Bell,
} from "lucide-react";
import { fetchWithToken } from "@/app/utils/fetchWithToken";
import { formatDistanceToNow } from "date-fns";

interface Notification {
  _id: string;
  type: string;
  payload: {
    productName?: string;
    productId?: string;
    rating?: number;
    title?: string;
    message?: string;
  };
  read: boolean;
  createdAt: string;
}

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NotificationsModal({ isOpen, onClose }: NotificationsModalProps) {
  const [activeTab, setActiveTab] = useState<"all" | "unread">("all");
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isOpen) return;

    const fetchNotifications = async () => {
      try {
        setLoading(true);
        const res = await fetchWithToken<{ notifications: Notification[] }>("/v1/notifications");
        setNotifications(res.notifications || []);
      } catch (err) {
        console.error("Failed to load notifications:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [isOpen]);

  const markAsRead = async (id: string) => {
    try {
      await fetchWithToken(`/notifications/${id}/read`, {
        method: "PATCH",
      });

      setNotifications(prev =>
        prev.map(n => (n._id === id ? { ...n, read: true } : n))
      );
    } catch (err) {
      console.error("Failed to mark as read:", err);
    }
  };

  const getNotificationConfig = (type: string) => {
    switch (type) {
      case "productApproved":
        return {
          icon: <CheckCircle className="w-5 h-5" />,
          bg: "bg-green-100",
          color: "text-green-700",
          title: (n: Notification) => `Product "${n.payload.productName || "Unknown"}" approved!`,
          message: () => "Your product is now live and visible to buyers.",
        };
      case "rating":
        return {
          icon: <Star className="w-5 h-5" />,
          bg: "bg-yellow-100",
          color: "text-yellow-700",
          title: (n: Notification) => `New ${n.payload.rating || 5} star review`,
          message: () => "A customer left a review on your product.",
        };
      case "notice":
        return {
          icon: <Megaphone className="w-5 h-5" />,
          bg: "bg-blue-100",
          color: "text-blue-700",
          title: (n: Notification) => n.payload.title || "Notice",
          message: (n: Notification) => n.payload.message || "No message",
        };
      default:
        return {
          icon: <Package className="w-5 h-5" />,
          bg: "bg-gray-100",
          color: "text-gray-700",
          title: () => "New notification",
          message: () => "You have a new update.",
        };
    }
  };

  const filteredNotifications = activeTab === "unread"
    ? notifications.filter(n => !n.read)
    : notifications;

  const unreadCount = notifications.filter(n => !n.read).length;

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex justify-end bg-black/30 backdrop-blur-sm p-10 rounded-2xl"
          onClick={onClose}
        >
          <motion.div
            initial={{ x: 400 }}
            animate={{ x: 0 }}
            exit={{ x: 400 }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="w-full max-w-md bg-white shadow-2xl rounded-2xl h-full flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-5 border-b border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
                <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 transition">
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setActiveTab("all")}
                  className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-all ${
                    activeTab === "all" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setActiveTab("unread")}
                  className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-all relative ${
                    activeTab === "unread" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Unread
                  {unreadCount > 0 && activeTab !== "unread" && (
                    <span className="absolute top-1 right-3 w-2 h-2 bg-red-500 rounded-full"></span>
                  )}
                </button>
              </div>
            </div>

            {/* Notifications List */}
            <div className="flex-1 overflow-y-auto">
              {loading ? (
                <div className="p-8 text-center text-gray-500">Loading...</div>
              ) : filteredNotifications.length === 0 ? (
                <div className="p-12 text-center text-gray-500">
                  <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p>No {activeTab === "unread" ? "unread" : ""} notifications</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {filteredNotifications.map((notif, index) => {
                    const config = getNotificationConfig(notif.type);
                    return (
                      <motion.div
                        key={notif._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => !notif.read && markAsRead(notif._id)}
                        className={`p-4 hover:bg-gray-50 transition cursor-pointer relative ${
                          !notif.read ? "bg-blue-50/30 pr-12" : ""
                        }`}
                      >
                        {/* Blue dot for unread */}
                        {!notif.read && (
                          <div className="absolute right-4 top-6 w-3 h-3 bg-blue-600 rounded-full"></div>
                        )}

                        <div className="flex gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${config.bg}`}>
                            <div className={config.color}>{config.icon}</div>
                          </div>
                          <div className="flex-1">
                            <p className={`text-sm font-medium ${!notif.read ? "font-semibold" : "text-gray-900"}`}>
                              {config.title(notif)}
                            </p>
                            <p className="text-xs text-gray-600 mt-1">
                              {config.message(notif)}
                            </p>
                            <p className="text-xs text-gray-400 mt-2">
                              {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true })}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}