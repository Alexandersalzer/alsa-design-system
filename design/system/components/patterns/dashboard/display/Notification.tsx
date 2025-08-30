// ===============================================
// src/design-system/components/patterns/dashboard/display/Notification.tsx
// NOTIFICATION COMPONENT - For displaying notifications
// ===============================================

import React, { useState, useRef, useEffect } from 'react';
import { Bell, Check, X, MoreHorizontal } from 'lucide-react';
import { cn } from '../../../../lib/utils';
import { Label, Body, Icon, Button } from '../../../primitives';
import './Notification.css';

// ===== NOTIFICATION ITEM COMPONENT =====
export interface NotificationItemProps {
  id: string;
  type: 'chat_message' | 'support_ticket' | 'order_update' | 'website_published' | 'feature_activated' | 'billing' | 'system';
  title: string;
  content: string;
  timestamp: Date;
  read: boolean;
  source_id?: number;
  source_type?: string;
  onClick?: () => void;
  onMarkAsRead?: (id: string) => void;
}

export const NotificationItem: React.FC<NotificationItemProps> = ({
  id,
  type,
  title,
  content,
  timestamp,
  read,
  onClick,
  onMarkAsRead
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const getTypeIcon = () => {
    switch (type) {
      case 'chat_message':
        return '💬';
      case 'support_ticket':
        return '🎫';
      case 'order_update':
        return '📦';
      case 'website_published':
        return '🌐';
      case 'feature_activated':
        return '✨';
      case 'billing':
        return '💰';
      default:
        return '🔔';
    }
  };

  const getTypeColor = () => {
    switch (type) {
      case 'chat_message':
        return 'info';
      case 'support_ticket':
        return 'warning';
      case 'order_update':
        return 'accent';
      case 'website_published':
        return 'success';
      case 'feature_activated':
        return 'success';
      case 'billing':
        return 'warning';
      default:
        return 'primary';
    }
  };

  const timeAgo = (date: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'Nu';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m sedan`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h sedan`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d sedan`;
    
    return date.toLocaleDateString('sv-SE');
  };

  return (
    <div 
      className={cn(
        "notification-item",
        !read && "notification-item--unread",
        onClick && "notification-item--clickable"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      <div className="notification-item__leading">
        <div className="notification-item__icon">
          <span className="notification-item__icon-emoji">{getTypeIcon()}</span>
        </div>
        {!read && <div className="notification-item__indicator" />}
      </div>
      
      <div className="notification-item__content">
        <Label size="md" weight="semibold" color="primary" className="notification-item__title">
          {title}
        </Label>
        <Body size="sm" color="secondary" className="notification-item__content-text">
          {content}
        </Body>
        <Body size="xs" color="tertiary" className="notification-item__timestamp">
          {timeAgo(timestamp)}
        </Body>
      </div>
      
      <div className="notification-item__trailing">
        {isHovered && !read && onMarkAsRead && (
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onMarkAsRead(id);
            }}
            aria-label="Markera som läst"
          >
            <Icon size="sm" color="secondary">
              <Check />
            </Icon>
          </Button>
        )}
      </div>
    </div>
  );
};

// ===== NOTIFICATION DROPDOWN COMPONENT =====
export interface NotificationDropdownProps {
  isOpen: boolean;
  notifications: NotificationItemProps[];
  unreadCount: number;
  onNotificationClick?: (notification: NotificationItemProps) => void;
  onMarkAsRead?: (id: string) => void;
  onMarkAllAsRead?: () => void;
  onViewAll?: () => void;
}

export const NotificationDropdown: React.FC<NotificationDropdownProps> = ({
  isOpen,
  notifications,
  unreadCount,
  onNotificationClick,
  onMarkAsRead,
  onMarkAllAsRead,
  onViewAll
}) => {
  if (!isOpen) return null;

  return (
    <div className="notification-dropdown">
      <div className="notification-dropdown__header">
        <Label size="lg" weight="bold" color="heading">
          Notiser
        </Label>
        {unreadCount > 0 && onMarkAllAsRead && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onMarkAllAsRead}
          >
            <Label size="sm" weight="medium" color="secondary">
              Markera alla som lästa
            </Label>
          </Button>
        )}
      </div>
      
      <div className="notification-dropdown__content">
        {notifications.length > 0 ? (
          <div className="notification-dropdown__list">
            {notifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                {...notification}
                onClick={() => onNotificationClick?.(notification)}
                onMarkAsRead={onMarkAsRead}
              />
            ))}
          </div>
        ) : (
          <div className="notification-dropdown__empty">
            <div className="notification-dropdown__empty-icon">
              <Icon size="xl" color="empty-state">
                <Bell />
              </Icon>
            </div>
            <Body size="sm" weight="medium" color="primary">
              Inga nya notiser
            </Body>
            <Body size="xs" color="secondary">
              Du kommer att se notiser här när de kommer in
            </Body>
          </div>
        )}
      </div>
      
      {notifications.length > 0 && onViewAll && (
        <div className="notification-dropdown__footer">
          <Button
            variant="ghost"
            size="sm"
            className="notification-dropdown__view-all-btn"
            onClick={onViewAll}
          >
            <Label size="sm" weight="medium" color="secondary">
              Visa alla notiser
            </Label>
          </Button>
        </div>
      )}
    </div>
  );
};

// ===== NOTIFICATION BELL COMPONENT =====
export interface NotificationBellProps {
  unreadCount: number;
  isOpen: boolean;
  onToggle: () => void;
  className?: string;
}

export const NotificationBell: React.FC<NotificationBellProps> = ({
  unreadCount,
  isOpen,
  onToggle,
  className
}) => {
  return (
    <button
      className={cn(
        "notification-bell",
        isOpen && "notification-bell--active",
        className
      )}
      onClick={onToggle}
      aria-label="Notiser"
    >
      <div className="notification-bell__icon">
        <Icon size="md" color="primary">
          <Bell />
        </Icon>
      </div>
      {unreadCount > 0 && (
        <div className="notification-bell__badge">
          <Label size="xs" weight="bold" color="button-primary">
            {unreadCount > 99 ? '99+' : unreadCount}
          </Label>
        </div>
      )}
    </button>
  );
};

// ===== MAIN NOTIFICATION COMPONENT =====
export interface NotificationProps {
  notifications: NotificationItemProps[];
  unreadCount: number;
  isOpen: boolean;
  onToggle: () => void;
  onNotificationClick?: (notification: NotificationItemProps) => void;
  onMarkAsRead?: (id: string) => void;
  onMarkAllAsRead?: () => void;
  onViewAll?: () => void;
  className?: string;
}

export const Notification: React.FC<NotificationProps> = ({
  notifications,
  unreadCount,
  isOpen,
  onToggle,
  onNotificationClick,
  onMarkAsRead,
  onMarkAllAsRead,
  onViewAll,
  className
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    if (!isOpen) return;
    
    const handleClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        onToggle();
      }
    };
    
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [isOpen, onToggle]);

  return (
    <div ref={containerRef} className={cn("notification-container", className)}>
      <NotificationBell
        unreadCount={unreadCount}
        isOpen={isOpen}
        onToggle={onToggle}
      />
      <NotificationDropdown
        isOpen={isOpen}
        notifications={notifications}
        unreadCount={unreadCount}
        onNotificationClick={onNotificationClick}
        onMarkAsRead={onMarkAsRead}
        onMarkAllAsRead={onMarkAllAsRead}
        onViewAll={onViewAll}
      />
    </div>
  );
};

export default Notification;
