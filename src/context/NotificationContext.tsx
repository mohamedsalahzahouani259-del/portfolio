// ====================================================================
// SCHOOLFLOW TN - NOTIFICATION CONTEXT
// ====================================================================

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { AppNotification } from '../types';
import { useAuth } from './AuthContext';

interface NotificationContextType {
  notifications: AppNotification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  addNotification: (title: string, message: string, type: AppNotification['type'], link?: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

const NOTIF_STORAGE_KEY = 'schoolflow_notifications';

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { organization } = useAuth();
  const orgId = organization?.id || '';

  const [notifications, setNotifications] = useState<AppNotification[]>([]);

  const loadNotifications = useCallback(() => {
    try {
      const raw = localStorage.getItem(NOTIF_STORAGE_KEY);
      if (raw) {
        const all: AppNotification[] = JSON.parse(raw);
        setNotifications(orgId ? all.filter((n) => n.organizationId === orgId) : all);
      } else {
        setNotifications([]);
      }
    } catch {
      setNotifications([]);
    }
  }, [orgId]);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  const markAsRead = (id: string) => {
    setNotifications((prev) => {
      const updated = prev.map((n) => (n.id === id ? { ...n, isRead: true } : n));
      try {
        localStorage.setItem(NOTIF_STORAGE_KEY, JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const markAllAsRead = () => {
    setNotifications((prev) => {
      const updated = prev.map((n) => ({ ...n, isRead: true }));
      try {
        localStorage.setItem(NOTIF_STORAGE_KEY, JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const addNotification = (
    title: string,
    message: string,
    type: AppNotification['type'],
    link?: string
  ) => {
    if (!orgId) return;
    const newNotif: AppNotification = {
      id: `notif_${Date.now()}`,
      organizationId: orgId,
      title,
      message,
      type,
      link,
      isRead: false,
      createdAt: new Date().toISOString(),
    };

    setNotifications((prev) => {
      const updated = [newNotif, ...prev];
      try {
        localStorage.setItem(NOTIF_STORAGE_KEY, JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        addNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
