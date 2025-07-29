import React from 'react';
import { cn } from '../../../../lib/utils';

export interface LayoutProps {
  children: React.ReactNode;
  className?: string;
  hasSidebar?: boolean;
}

export const Layout = React.forwardRef<HTMLDivElement, LayoutProps>(
  ({ children, className, hasSidebar = false, ...props }, ref) => {
    const baseClasses = ['layout'];
    if (hasSidebar) baseClasses.push('layout--with-sidebar');
    if (className) baseClasses.push(className);

    return (
      <div
        ref={ref}
        className={cn(...baseClasses)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Layout.displayName = 'Layout';

export interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

export const PageContainer = React.forwardRef<HTMLDivElement, PageContainerProps>(
  ({ children, className, maxWidth = 'lg', ...props }, ref) => {
    const baseClasses = ['page-container'];
    
    if (maxWidth === 'sm') baseClasses.push('page-container--sm');
    if (maxWidth === 'md') baseClasses.push('page-container--md');
    if (maxWidth === 'lg') baseClasses.push('page-container--lg');
    if (maxWidth === 'xl') baseClasses.push('page-container--xl');
    if (maxWidth === 'full') baseClasses.push('page-container--full');
    
    if (className) baseClasses.push(className);

    return (
      <div ref={ref} className={cn(...baseClasses)} {...props}>
        {children}
      </div>
    );
  }
);

PageContainer.displayName = 'PageContainer';

export interface PageHeaderProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export const PageHeader = React.forwardRef<HTMLElement, PageHeaderProps>(
  ({ children, className, title, subtitle, actions, ...props }, ref) => {
    const baseClasses = ['page-header'];
    if (className) baseClasses.push(className);

    return (
      <header ref={ref} className={cn(...baseClasses)} {...props}>
        <div className="page-header__content">
          {(title || subtitle) && (
            <div className="page-header__text">
              {title && <h1 className="page-header__title">{title}</h1>}
              {subtitle && <p className="page-header__subtitle">{subtitle}</p>}
            </div>
          )}
          {actions && <div className="page-header__actions">{actions}</div>}
        </div>
        {children}
      </header>
    );
  }
);

PageHeader.displayName = 'PageHeader';