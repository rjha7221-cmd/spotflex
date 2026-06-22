import React, { createContext, useCallback, useContext, useMemo, useState } from "react";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [toastIds, setToastIds] = useState([]);

  const addNotification = useCallback(({ title, message, type = "info" }) => {
    const item = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      title,
      message,
      type,
      read: false,
      createdAt: new Date().toISOString(),
    };

    setNotifications((current) => [item, ...current].slice(0, 10));
    setToastIds((current) => [item.id, ...current].slice(0, 3));

    window.setTimeout(() => {
      setToastIds((current) => current.filter((id) => id !== item.id));
    }, 4200);

    return item.id;
  }, []);

  const markAllRead = useCallback(() => {
    setNotifications((current) =>
      current.map((notification) => ({ ...notification, read: true }))
    );
  }, []);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
    setToastIds([]);
  }, []);

  const dismissToast = useCallback((id) => {
    setToastIds((current) => current.filter((toastId) => toastId !== id));
  }, []);

  const toasts = useMemo(
    () => toastIds.map((id) => notifications.find((item) => item.id === id)).filter(Boolean),
    [notifications, toastIds]
  );

  const unreadCount = useMemo(
    () => notifications.filter((notification) => !notification.read).length,
    [notifications]
  );

  const value = useMemo(
    () => ({
      notifications,
      toasts,
      unreadCount,
      addNotification,
      markAllRead,
      clearNotifications,
      dismissToast,
    }),
    [
      notifications,
      toasts,
      unreadCount,
      addNotification,
      markAllRead,
      clearNotifications,
      dismissToast,
    ]
  );

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);

  if (!context) {
    throw new Error("useNotifications must be used within a NotificationProvider");
  }

  return context;
};
