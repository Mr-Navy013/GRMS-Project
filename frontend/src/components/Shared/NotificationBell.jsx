import React, { useState, useEffect, useRef } from "react";
import "./SharedComponents.css";

const NotificationBell = ({ notifications = [], onMarkAsRead, onClearAll }) => {
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const totalCount = notifications.length;
  // Badge formula: if 5 -> 4+, if > 1 -> (N-1)+
  let badgeText = "";
  if (totalCount > 1) {
    badgeText = `${totalCount - 1}+`;
  } else if (totalCount === 1) {
    badgeText = "1";
  }

  const handleItemClick = (id) => {
    if (onMarkAsRead) {
      onMarkAsRead(id);
    }
  };

  const handleClearAllClick = () => {
    if (onClearAll) {
      onClearAll();
    }
  };

  return (
    <div className="notification-bell-wrapper" ref={popoverRef}>
      {/* Simple Plain Bell Logo Icon */}
      <button
        className="plain-notification-bell-btn"
        title="Notifications & Alerts"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Notifications"
      >
        <svg
          className="plain-bell-icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>

        {badgeText && <span className="notification-count-badge">{badgeText}</span>}
      </button>

      {/* Notification Drawer Popover */}
      {isOpen && (
        <div className="notification-popover-box">
          <div className="notification-popover-header">
            <div className="notification-title-area">
              <span className="popover-icon">🔔</span>
              <h4>Notifications</h4>
            </div>

            <div className="notification-header-actions">
              {notifications.length > 0 && (
                <button
                  type="button"
                  className="clear-all-btn"
                  onClick={handleClearAllClick}
                  title="Clear all notifications"
                >
                  Clear All
                </button>
              )}
              <button
                type="button"
                className="popover-close-btn"
                onClick={() => setIsOpen(false)}
                title="Close popover"
              >
                ✖
              </button>
            </div>
          </div>

          <div className="notification-popover-list">
            {notifications.length > 0 ? (
              notifications.map((n) => (
                <div
                  key={n.id}
                  className={`notification-list-item ${n.isRead ? "read" : "unread-highlight"}`}
                  onClick={() => handleItemClick(n.id)}
                >
                  <div className="item-header-row">
                    <strong className="item-title">{n.title}</strong>
                    {!n.isRead && <span className="unread-dot" title="Unread message"></span>}
                  </div>
                  <p className="item-msg">{n.msg}</p>
                  <span className="item-time">{n.time}</span>
                </div>
              ))
            ) : (
              <div className="empty-notifications-msg">
                <p>No notifications available</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
