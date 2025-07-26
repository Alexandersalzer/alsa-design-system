import React from 'react';
import { cn } from '../../../../lib/utils';

export interface SidebarProps {
  children: React.ReactNode;
  className?: string;
  isOpen?: boolean;
  position?: 'left' | 'right';
  width?: 'sm' | 'md' | 'lg';
}

export const Sidebar = React.forwardRef<HTMLElement, SidebarProps>(
  ({ children, className, isOpen = true, position = 'left', width = 'md', ...props }, ref) => {
    const baseClasses = ['sidebar'];
    
    if (isOpen) baseClasses.push('sidebar--open');
    if (!isOpen) baseClasses.push('sidebar--closed');
    if (position === 'left') baseClasses.push('sidebar--left');
    if (position === 'right') baseClasses.push('sidebar--right');
    if (width === 'sm') baseClasses.push('sidebar--width-sm');
    if (width === 'md') baseClasses.push('sidebar--width-md');
    if (width === 'lg') baseClasses.push('sidebar--width-lg');
    
    if (className) baseClasses.push(className);

    return (
      <aside ref={ref} className={cn(...baseClasses)} {...props}>
        {children}
      </aside>
    );
  }
);

Sidebar.displayName = 'Sidebar';

export interface SidebarHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export const SidebarHeader = React.forwardRef<HTMLDivElement, SidebarHeaderProps>(
  ({ children, className, ...props }, ref) => {
    const baseClasses = ['sidebar__header'];
    if (className) baseClasses.push(className);

    return (
      <div ref={ref} className={cn(...baseClasses)} {...props}>
        {children}
      </div>
    );
  }
);

SidebarHeader.displayName = 'SidebarHeader';

export interface SidebarContentProps {
  children: React.ReactNode;
  className?: string;
}

export const SidebarContent = React.forwardRef<HTMLDivElement, SidebarContentProps>(
  ({ children, className, ...props }, ref) => {
    const baseClasses = ['sidebar__content'];
    if (className) baseClasses.push(className);

    return (
      <div ref={ref} className={cn(...baseClasses)} {...props}>
        {children}
      </div>
    );
  }
);

SidebarContent.displayName = 'SidebarContent';

export interface SidebarFooterProps {
  children: React.ReactNode;
  className?: string;
}

export const SidebarFooter = React.forwardRef<HTMLDivElement, SidebarFooterProps>(
  ({ children, className, ...props }, ref) => {
    const baseClasses = ['sidebar__footer'];
    if (className) baseClasses.push(className);

    return (
      <div ref={ref} className={cn(...baseClasses)} {...props}>
        {children}
      </div>
    );
  }
);

SidebarFooter.displayName = 'SidebarFooter';