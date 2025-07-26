// ===============================================
// src/design-system/components/patterns/header/Header.tsx
// DEBUG VERSION - Fixed TypeScript errors
// ===============================================

import React, { useState, useRef, useEffect } from 'react';
import { Bell, Search, Settings, User, LogOut, ChevronDown } from 'lucide-react';
import { cn } from '../../../../lib/utils';
import { Label, Body } from '../../../primitives';

// ===== SETUP GUIDE COMPONENT =====
interface SetupGuideButtonProps {
  progress: number;
  onClick: () => void;
}

const SetupGuideButton: React.FC<SetupGuideButtonProps> = ({ progress, onClick }) => {
  const circumference = 2 * Math.PI * 8;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  // Debug logging
  console.log('=== SETUP GUIDE DEBUG ===');
  console.log('Expected classes: text-label-md font-weight-bold text-primary');

  return (
    <button className="setup-guide-btn" onClick={onClick}>
      <div className="progress-indicator">
        <svg width="20" height="20" viewBox="0 0 20 20">
          <circle
            cx="10"
            cy="10"
            r="8"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            opacity="0.2"
          />
          <circle
            className="progress-arc"
            cx="10"
            cy="10"
            r="8"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        </svg>
      </div>
      
      {/* Test Typography component */}
      <Label 
        size="lg"
        weight="black"
        color="primary"
        as="span"
        className="hidden sm:inline"
      >
        Setup guide TEST
      </Label>
    </button>
  );
};

// ===== NOTIFICATION ITEM COMPONENT =====
interface NotificationItemProps {
  title: string;
  subtitle?: string;
  caption?: string;
  isUnread?: boolean;
  onClick?: () => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({
  title,
  subtitle,
  caption,
  isUnread = false,
  onClick
}) => (
  <div 
    className={cn("list-item", onClick && "list-item--clickable")} 
    onClick={onClick}
  >
    <div className="list-item__leading">
      <div className={cn("indicator", isUnread && "indicator--active")} />
    </div>
    <div className="list-item__content">
      <Body size="lg" weight="bold" color="primary" className="list-item__title">
        {title}
      </Body>
      {subtitle && (
        <Body size="xs" color="secondary" className="list-item__subtitle">
          {subtitle}
        </Body>
      )}
      {caption && (
        <Body size="xs" color="tertiary" className="list-item__caption">
          {caption}
        </Body>
      )}
    </div>
  </div>
);

// ===== NOTIFICATION DROPDOWN COMPONENT =====
interface NotificationDropdownProps {
  isOpen: boolean;
}

const NotificationDropdown: React.FC<NotificationDropdownProps> = ({ isOpen }) => {
  const notifications = [
    {
      title: "New update available",
      subtitle: "Version 2.1.0 is now available for download",
      caption: "2 hours ago",
      isUnread: true
    },
    {
      title: "Profile completed",
      subtitle: "Your profile setup is now complete",
      caption: "1 day ago",
      isUnread: false
    }
  ];

  if (!isOpen) return null;

  return (
    <div className="dropdown dropdown--notification">
      <div className="dropdown__header">
        <Label size="lg" weight="bold" color="heading">
          Notifications TEST
        </Label>
        <button className="btn btn--ghost btn--xs">
          <Label size="xs" weight="medium" color="secondary">
            Mark all read
          </Label>
        </button>
      </div>
      
      <div className="dropdown__content">
        {notifications.length > 0 ? (
          <div className="list">
            {notifications.map((notification, index) => (
              <NotificationItem key={index} {...notification} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-state__icon">
              <Bell />
            </div>
            <Body size="sm" weight="medium" color="primary" className="empty-state__title">
              No notifications
            </Body>
            <Body size="xs" color="secondary" className="empty-state__description">
              You're all caught up! Check back later for new notifications.
            </Body>
          </div>
        )}
      </div>
      
      <div className="dropdown__footer">
        <button className="btn btn--ghost btn--full-width">
          <Label size="sm" weight="medium" color="secondary">
            View all notifications
          </Label>
        </button>
      </div>
    </div>
  );
};

// ===== USER MENU COMPONENT =====
interface UserMenuProps {
  user: {
    name: string;
    email: string;
  };
}

const UserMenu: React.FC<UserMenuProps> = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const menuItems = [
    { icon: User, label: 'Profile Settings', onClick: () => console.log('Profile') },
    { icon: Settings, label: 'Account Settings', onClick: () => console.log('Settings') },
    { 
      icon: LogOut, 
      label: 'Sign Out', 
      onClick: () => console.log('Logout'), 
      variant: 'destructive' as const 
    }
  ];

  console.log('=== USER MENU DEBUG ===');

  return (
    <div className="user-menu" ref={menuRef}>
      <button
        className="user-menu-trigger"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <div className="user-menu-trigger__icon">
          <User />
        </div>
        
        <Label 
          size="lg"
          weight="bold"
          color="primary"
          className="user-menu-trigger__name hidden sm:inline"
        >
          {user.name} TEST
        </Label>
        
        <ChevronDown className="user-menu-trigger__chevron" />
      </button>

      <div className={cn("user-menu-dropdown", isOpen && "user-menu-dropdown--open")}>
        {menuItems.map((item, index) => (
          <button
            key={index}
            className={cn(
              "user-menu-item",
              item.variant === 'destructive' && "user-menu-item--destructive"
            )}
            onClick={() => {
              item.onClick();
              setIsOpen(false);
            }}
          >
            <item.icon className="user-menu-item__icon" />
            <Label 
              size="md"
              weight="medium"
              color={item.variant === 'destructive' ? 'error' : 'primary'}
              className="user-menu-item__text"
            >
              {item.label}
            </Label>
          </button>
        ))}
      </div>
    </div>
  );
};

// ===== SEARCH INPUT COMPONENT =====
const SearchInput: React.FC = () => (
  <div className="header-search">
    <input
      type="text"
      placeholder="Search..."
      className="input"
    />
    <Search className="header-search__icon" />
  </div>
);

// ===== MAIN HEADER COMPONENT =====
export interface HeaderProps {
  user: {
    name: string;
    email: string;
  };
  setupProgress?: number;
  onSetupGuideClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  setupProgress = 75,
  onSetupGuideClick = () => {}
}) => {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  console.log('=== HEADER COMPONENT LOADED ===');

  return (
    <header className="top-header">
      {/* Left Section */}
      <div className="header-left">
        <SearchInput />
      </div>

      {/* Right Section */}
      <div className="header-right">
        {/* Setup Guide Button */}
        <SetupGuideButton 
          progress={setupProgress} 
          onClick={onSetupGuideClick} 
        />

        {/* Notifications */}
        <div className="dropdown-container">
          <button
            className={cn(
              "icon-btn",
              isNotificationOpen && "icon-btn--active"
            )}
            onClick={() => setIsNotificationOpen(!isNotificationOpen)}
          >
            <div className="icon-btn__icon">
              <Bell />
            </div>
            <div className="icon-btn__badge">3</div>
          </button>
          <NotificationDropdown isOpen={isNotificationOpen} />
        </div>

        {/* User Menu */}
        <UserMenu user={user} />
      </div>
    </header>
  );
};

export default Header;