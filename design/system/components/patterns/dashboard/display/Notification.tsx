// ===============================================
// src/design-system/components/patterns/dashboard/display/Notification.tsx
// NOTIFICATION COMPONENT - Refactored with Popover primitive
// ===============================================

import React, { useState } from 'react';
import { Bell, Check } from 'lucide-react';
import { cn } from '../../../../lib/utils';
import { Label, Body, Icon, Button, IconButtons } from '../../../primitives';
import { Popover } from '../../../primitives/Popover';
import './Notification.css';

// ===== TYPES =====
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
  showIcon?: boolean;
}

// ===== NOTIFICATION ITEM COMPONENT =====
export const NotificationItem: React.FC<NotificationItemProps> = ({
  id,
  type,
  title,
  content,
  timestamp,
  read,
  onClick,
  onMarkAsRead,
  showIcon = true
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
        {showIcon && (
          <div className="notification-item__icon">
            <span className="notification-item__icon-emoji">{getTypeIcon()}</span>
          </div>
        )}
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

// ===== MAIN NOTIFICATION COMPONENT (using Popover) =====
export interface NotificationProps {
  notifications: NotificationItemProps[];
  unreadCount: number;
  onNotificationClick?: (notification: NotificationItemProps) => void;
  onMarkAsRead?: (id: string) => void;
  onMarkAllAsRead?: () => void;
  onViewAll?: () => void;
  className?: string;
  showIcons?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const Notification: React.FC<NotificationProps> = ({
  notifications,
  unreadCount,
  onNotificationClick,
  onMarkAsRead,
  onMarkAllAsRead,
  onViewAll,
  className,
  showIcons = true,
  open,
  onOpenChange
}) => {
  return (
    <Popover 
      open={open} 
      onOpenChange={onOpenChange}
      size="md"
    >
      <Popover.Trigger asChild>
        <div className={cn("notification-trigger-wrapper", className)}>
          <IconButtons.Bell
            variant="secondary"
            size="md"
            badge={unreadCount > 0 ? unreadCount : undefined}
            aria-label="Notiser"
          />
        </div>
      </Popover.Trigger>
      
      <Popover.Positioner>
        <Popover.Content 
          maxHeight={500}
          className="notification-popover-content"
        >
          {/* Header */}
          <div className="notification-header">
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
          
          {/* Content */}
          <div className="notification-list">
            {notifications.length > 0 ? (
              <>
                {notifications.map((notification) => (
                  <NotificationItem
                    key={notification.id}
                    {...notification}
                    showIcon={showIcons}
                    onClick={() => onNotificationClick?.(notification)}
                    onMarkAsRead={onMarkAsRead}
                  />
                ))}
              </>
            ) : (
              <div className="notification-empty">
                <div className="notification-empty__icon">
                  <Icon size="xl" color="tertiary">
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
          
          {/* Footer */}
          {notifications.length > 0 && onViewAll && (
            <div className="notification-footer">
              <Button
                variant="ghost"
                size="sm"
                className="notification-view-all-btn"
                onClick={onViewAll}
              >
                <Label size="sm" weight="medium" color="secondary">
                  Visa alla notiser
                </Label>
              </Button>
            </div>
          )}
        </Popover.Content>
      </Popover.Positioner>
    </Popover>
  );
};

// ===== LEGACY EXPORTS FOR BACKWARDS COMPATIBILITY =====
export const NotificationDropdown: React.FC<{
  isOpen: boolean;
  notifications: NotificationItemProps[];
  unreadCount: number;
  onNotificationClick?: (notification: NotificationItemProps) => void;
  onMarkAsRead?: (id: string) => void;
  onMarkAllAsRead?: () => void;
  onViewAll?: () => void;
  showIcons?: boolean;
}> = ({ isOpen, ...props }) => {
  // Legacy wrapper - just renders content without Popover
  if (!isOpen) return null;
  
  return (
    <div className="notification-dropdown">
      <div className="notification-header">
        <Label size="lg" weight="bold" color="heading">
          Notiser
        </Label>
        {props.unreadCount > 0 && props.onMarkAllAsRead && (
          <Button
            variant="ghost"
            size="sm"
            onClick={props.onMarkAllAsRead}
          >
            <Label size="sm" weight="medium" color="secondary">
              Markera alla som lästa
            </Label>
          </Button>
        )}
      </div>
      
      <div className="notification-dropdown__content">
        {props.notifications.length > 0 ? (
          <div className="notification-dropdown__list">
            {props.notifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                {...notification}
                showIcon={props.showIcons}
                onClick={() => props.onNotificationClick?.(notification)}
                onMarkAsRead={props.onMarkAsRead}
              />
            ))}
          </div>
        ) : (
          <div className="notification-dropdown__empty">
            <div className="notification-dropdown__empty-icon">
              <Icon size="xl" color="tertiary">
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
      
      {props.notifications.length > 0 && props.onViewAll && (
        <div className="notification-dropdown__footer">
          <Button
            variant="ghost"
            size="sm"
            className="notification-dropdown__view-all-btn"
            onClick={props.onViewAll}
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

export default Notification;