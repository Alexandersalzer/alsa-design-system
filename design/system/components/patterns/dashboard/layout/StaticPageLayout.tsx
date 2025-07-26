// ===============================================
// src/design-system/components/patterns/layout/StaticPageLayout.tsx
// STATIC PAGE LAYOUT - For auth, landing, paywall pages - USING DESIGN SYSTEM BUTTON
// ===============================================

import React, { forwardRef, ReactNode } from 'react';
import { cn } from '../../../../lib/utils';
import { Button } from '../../../primitives';

// ===== TYPE DEFINITIONS =====
export interface StaticPageLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Page content */
  children: ReactNode;
  /** Background variant */
  background?: 'default' | 'gradient' | 'image' | 'custom';
  /** Show back button */
  showBackButton?: boolean;
  /** Back button configuration */
  backButton?: {
    href?: string;
    text?: string;
    onClick?: () => void;
    variant?: 'primary' | 'secondary' | 'accent' | 'ghost' | 'destructive';
    size?: 'sm' | 'md' | 'lg' | 'xl';
  };
  /** Custom background image URL */
  backgroundImage?: string;
  /** Additional CSS classes */
  className?: string;
}

// ===== MAIN COMPONENT =====
export const StaticPageLayout = forwardRef<HTMLDivElement, StaticPageLayoutProps>(({
  children,
  background = 'default',
  showBackButton = false,
  backButton = {
    href: '/',
    text: 'Back',
    variant: 'ghost',
    size: 'sm'
  },
  backgroundImage,
  className,
  ...props
}, ref) => {
  const layoutClasses = cn(
    'static-page-layout',
    `static-page-layout--${background}`,
    className
  );

  const backgroundStyles = backgroundImage ? {
    '--static-page-background-image': `url(${backgroundImage})`
  } as React.CSSProperties : undefined;

  // Back button icon
  const backIcon = (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path d="M19 12H5M12 19l-7-7 7-7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

  // Handle back button click for link navigation
  const handleBackClick = () => {
    if (backButton.onClick) {
      backButton.onClick();
    } else if (backButton.href) {
      window.location.href = backButton.href;
    }
  };

  return (
    <div ref={ref} className={layoutClasses} style={backgroundStyles} {...props}>
      {/* Background Layer */}
      <div className="static-page-layout__background">
        <div className="static-page-layout__overlay"></div>
      </div>

      {/* Back Button - Using Design System Button */}
      {showBackButton && (
        <div className="static-page-layout__back-button">
          <Button
            variant={'secondary'}
            size={backButton.size || 'sm'}
            leftIcon={backIcon}
            onClick={handleBackClick}
            className="static-page-back-btn"
          >
            {backButton.text}
          </Button>
        </div>
      )}

      {/* Main Content */}
      <div className="static-page-layout__content">
        {children}
      </div>
    </div>
  );
});

StaticPageLayout.displayName = 'StaticPageLayout';

// ===== SPECIALIZED LAYOUT COMPONENTS =====

export interface AuthLayoutProps extends Omit<StaticPageLayoutProps, 'background'> {
  /** Show back button (defaults to true for auth) */
  showBackButton?: boolean;
  /** Back button configuration */
  backButton?: {
    href?: string;
    text?: string;
    onClick?: () => void;
    variant?: 'primary' | 'secondary' | 'accent' | 'ghost' | 'destructive';
    size?: 'sm' | 'md' | 'lg' | 'xl';
  };
}

export const AuthLayout = forwardRef<HTMLDivElement, AuthLayoutProps>(({
  showBackButton = true,
  backButton = {
    href: 'https://blimpify-im.com',
    text: 'Tillbaka',
    variant: 'ghost',
    size: 'sm'
  },
  ...props
}, ref) => (
  <StaticPageLayout
    ref={ref}
    background="gradient"
    showBackButton={showBackButton}
    backButton={backButton}
    {...props}
  />
));

AuthLayout.displayName = 'AuthLayout';

export interface PaywallLayoutProps extends Omit<StaticPageLayoutProps, 'background'> {
  /** Show back button (defaults to true for paywall) */
  showBackButton?: boolean;
  /** Back button configuration */
  backButton?: {
    href?: string;
    text?: string;
    onClick?: () => void;
    variant?: 'primary' | 'secondary' | 'accent' | 'ghost' | 'destructive';
    size?: 'sm' | 'md' | 'lg' | 'xl';
  };
}

export const PaywallLayout = forwardRef<HTMLDivElement, PaywallLayoutProps>(({
  showBackButton = true,
  backButton = {
    text: 'Back',
    variant: 'secondary',
    size: 'sm'
  },
  ...props
}, ref) => (
  <StaticPageLayout
    ref={ref}
    background="default"
    showBackButton={showBackButton}
    backButton={backButton}
    {...props}
  />
));

PaywallLayout.displayName = 'PaywallLayout';

export interface LandingLayoutProps extends Omit<StaticPageLayoutProps, 'background'> {
  /** Background variant for landing pages */
  background?: 'default' | 'gradient' | 'image';
  /** Custom background image */
  backgroundImage?: string;
}

export const LandingLayout = forwardRef<HTMLDivElement, LandingLayoutProps>(({
  background = 'gradient',
  ...props
}, ref) => (
  <StaticPageLayout
    ref={ref}
    background={background}
    showBackButton={false}
    {...props}
  />
));

LandingLayout.displayName = 'LandingLayout';