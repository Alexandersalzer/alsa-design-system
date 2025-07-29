// ===============================================
// src/design-system/components/patterns/layout/AppLayout.tsx
// APP LAYOUT - Dashboard and content pages layout
// ===============================================

import React, { ReactNode } from 'react';
import { cn } from '../../../../lib/utils';

// ===== TYPE DEFINITIONS =====

export interface AppLayoutProps {
  children: ReactNode;
  className?: string;
  
  // Layout structure
  sidebar: ReactNode;
  header?: ReactNode;
  
  // Layout options
  sidebarWidth?: 'sm' | 'md' | 'lg';
  headerHeight?: 'sm' | 'md' | 'lg';
  
  // Layout behavior
  sidebarCollapsible?: boolean;
  sidebarCollapsed?: boolean;
  onSidebarToggle?: () => void;
  
  // Responsive behavior
  hideSidebarOnMobile?: boolean;
  stickyHeader?: boolean;
}

export interface AppLayoutHeaderProps {
  children: ReactNode;
  className?: string;
  height?: 'sm' | 'md' | 'lg';
}

export interface AppLayoutSidebarProps {
  children: ReactNode;
  className?: string;
  width?: 'sm' | 'md' | 'lg';
  collapsed?: boolean;
}

export interface AppLayoutMainProps {
  children: ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

// ===== MAIN APP LAYOUT COMPONENT =====

export const AppLayout = React.forwardRef<HTMLDivElement, AppLayoutProps>(({
  children,
  className,
  sidebar,
  header,
  sidebarWidth = 'md',
  headerHeight = 'md',
  sidebarCollapsible = false,
  sidebarCollapsed = false,
  onSidebarToggle,
  hideSidebarOnMobile = true,
  stickyHeader = true,
  ...props
}, ref) => {
  
  // Build CSS classes
  const containerClasses = cn(
    'app-layout',
    sidebarCollapsed && 'app-layout--sidebar-collapsed',
    hideSidebarOnMobile && 'app-layout--hide-sidebar-mobile',
    className
  );

  const sidebarClasses = cn(
    'app-layout__sidebar',
    `app-layout__sidebar--${sidebarWidth}`,
    sidebarCollapsed && 'app-layout__sidebar--collapsed'
  );

  const headerClasses = cn(
    'app-layout__header',
    `app-layout__header--${headerHeight}`,
    stickyHeader && 'app-layout__header--sticky'
  );

  const mainClasses = cn(
    'app-layout__main',
    !!header && 'app-layout__main--with-header'
  );

  return (
    <div ref={ref} className={containerClasses} {...props}>
      {/* Sidebar */}
      <aside className={sidebarClasses}>
        {sidebarCollapsible && onSidebarToggle && (
          <button 
            className="app-layout__sidebar-toggle"
            onClick={onSidebarToggle}
            aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {/* Toggle icon - using your existing design system approach */}
            <span className="app-layout__sidebar-toggle-icon">
              {sidebarCollapsed ? '→' : '←'}
            </span>
          </button>
        )}
        {sidebar}
      </aside>

      {/* Main area */}
      <div className="app-layout__content">
        {/* Header */}
        {header && (
          <header className={headerClasses}>
            {header}
          </header>
        )}

        {/* Main content */}
        <main className={mainClasses}>
          {children}
        </main>
      </div>
    </div>
  );
});

AppLayout.displayName = 'AppLayout';

// ===== SUB-COMPONENTS =====

export const AppLayoutHeader = React.forwardRef<HTMLElement, AppLayoutHeaderProps>(({
  children,
  className,
  height = 'md',
  ...props
}, ref) => {
  const classes = cn(
    'app-layout-header',
    `app-layout-header--${height}`,
    className
  );

  return (
    <header ref={ref} className={classes} {...props}>
      {children}
    </header>
  );
});

AppLayoutHeader.displayName = 'AppLayoutHeader';

export const AppLayoutSidebar = React.forwardRef<HTMLElement, AppLayoutSidebarProps>(({
  children,
  className,
  width = 'md',
  collapsed = false,
  ...props
}, ref) => {
  const classes = cn(
    'app-layout-sidebar',
    `app-layout-sidebar--${width}`,
    collapsed && 'app-layout-sidebar--collapsed',
    className
  );

  return (
    <aside ref={ref} className={classes} {...props}>
      {children}
    </aside>
  );
});

AppLayoutSidebar.displayName = 'AppLayoutSidebar';

export const AppLayoutMain = React.forwardRef<HTMLDivElement, AppLayoutMainProps>(({
  children,
  className,
  padding = 'md',
  ...props
}, ref) => {
  const classes = cn(
    'app-layout-main',
    `app-layout-main--padding-${padding}`,
    className
  );

  return (
    <div ref={ref} className={classes} {...props}>
      {children}
    </div>
  );
});

AppLayoutMain.displayName = 'AppLayoutMain';