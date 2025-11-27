import React from 'react';
import Link from 'next/link';
import { cn } from '../../../utils/cn';

export interface NavItemProps {
  href: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  isActive?: boolean;
  isDisabled?: boolean;
  className?: string;
}

export const NavItem = React.forwardRef<HTMLAnchorElement, NavItemProps>(
  ({ href, children, icon, isActive = false, isDisabled = false, className, ...props }, ref) => {
    const baseClasses = ['nav-item'];
    
    if (isActive) baseClasses.push('nav-item--selected');
    if (isDisabled) baseClasses.push('nav-item--disabled');
    if (className) baseClasses.push(className);

    if (isDisabled) {
      return (
        <div className={cn(...baseClasses)}>
          {icon && <span className="nav-item__icon">{icon}</span>}
          <span className="nav-item__label">{children}</span>
        </div>
      );
    }

    return (
      <Link href={href} className={cn(...baseClasses)} ref={ref} {...props}>
        {icon && <span className="nav-item__icon">{icon}</span>}
        <span className="nav-item__label">{children}</span>
      </Link>
    );
  }
);

NavItem.displayName = 'NavItem';

export interface NavigationProps {
  children: React.ReactNode;
  className?: string;
}

export const Navigation = React.forwardRef<HTMLElement, NavigationProps>(
  ({ children, className, ...props }, ref) => {
    const baseClasses = ['navigation'];
    if (className) baseClasses.push(className);

    return (
      <nav ref={ref} className={cn(...baseClasses)} {...props}>
        {children}
      </nav>
    );
  }
);

Navigation.displayName = 'Navigation';

export interface SidebarNavProps {
  items: Array<{
    href: string;
    label: string;
    icon?: React.ReactNode;
    isActive?: boolean;
    isDisabled?: boolean;
  }>;
  className?: string;
}

export const SidebarNav = React.forwardRef<HTMLElement, SidebarNavProps>(
  ({ items, className, ...props }, ref) => {
    const baseClasses = ['sidebar__nav'];
    if (className) baseClasses.push(className);

    return (
      <Navigation ref={ref} className={cn(...baseClasses)} {...props}>
        {items.map((item) => (
          <NavItem
            key={item.href}
            href={item.href}
            icon={item.icon}
            isActive={item.isActive}
            isDisabled={item.isDisabled}
          >
            {item.label}
          </NavItem>
        ))}
      </Navigation>
    );
  }
);

SidebarNav.displayName = 'SidebarNav';