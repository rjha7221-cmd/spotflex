import React, { useState } from "react";
import { Bell, CheckCheck, Info, Trash2 } from "lucide-react";

import { useNotifications } from "../context/NotificationContext";

function NotificationCenter() {
  const {
    notifications,
    unreadCount,
    markAllRead,
    clearNotifications,
  } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="notification-center">
      <button
        type="button"
        className="icon-btn notification-trigger"
        onClick={() => setIsOpen((current) => !current)}
        aria-label="Notifications"
        title="Notifications"
      >
        <Bell size={18} />
        {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
      </button>

      {isOpen && (
        <div className="notification-menu">
          <div className="notification-header">
            <div>
              <strong>Notifications</strong>
              <span>{unreadCount ? `${unreadCount} unread` : "All caught up"}</span>
            </div>
            <div className="notification-actions">
              <button type="button" onClick={markAllRead} title="Mark all read">
                <CheckCheck size={16} />
              </button>
              <button type="button" onClick={clearNotifications} title="Clear notifications">
                <Trash2 size={16} />
              </button>
            </div>
          </div>

          <div className="notification-list">
            {notifications.length ? (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`notification-item notification-${notification.type} ${
                    notification.read ? "read" : ""
                  }`}
                >
                  <span className="notification-dot" />
                  <div>
                    <strong>{notification.title}</strong>
                    {notification.message && <p>{notification.message}</p>}
                  </div>
                </div>
              ))
            ) : (
              <div className="notification-empty">
                <Info size={18} />
                <p>No notifications yet</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default NotificationCenter;
