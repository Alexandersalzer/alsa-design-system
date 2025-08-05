'use client';

import { ContentProvider, EditingModeWrapper, Navbar, Footer, ArrowRightIcon } from '../..';
import { ReactNode } from "react";
import type { WebsiteContent } from "../../cms/types/content";
import type { EnhancedNavigationItem, NavigationItem } from "../../cms/content/navigationHelper";
import { enhanceNavigationWithCMS } from "../../cms/content/navigationHelper";

interface ClientLayoutProps {
  children: ReactNode;
  initialContent: WebsiteContent | null;
  // Brand configuration
  brandName: string;
  brandHref: string;
  logoSrc?: string;
  logoAlt?: string;
  logoWidth?: number;
  logoHeight?: number;
  // Layout options
  showNavbar?: boolean;
  showFooter?: boolean;
  // Navbar styling options
  navSize?: 'sm' | 'md' | 'lg';
  brandVariant?: 'brand' | 'primary' | 'secondary';
  brandSize?: 'sm' | 'md' | 'lg';
  brandWeight?: 'regular' | 'medium' | 'semibold' | 'bold';
  brandUnderline?: 'none' | 'hover' | 'always';
  // Navigation item configuration
  navigationConfig?: {
    textlink?: {
      componentType: 'textlink';
      textLinkVariant?: 'primary';
      weight?: 'medium';
      underline?: 'hover';
    };
    button?: {
      componentType: 'button';
      variant?: 'primary';
      rightIcon?: string;
    };
  };
}

export function ClientLayout({ 
  children, 
  initialContent,
  brandName,
  brandHref,
  logoSrc,
  logoAlt,
  logoWidth,
  logoHeight,
  showNavbar = true,
  showFooter = true,
  navSize = 'md',
  brandVariant = 'brand',
  brandSize = 'lg',
  brandWeight = 'bold',
  brandUnderline = 'none',
  navigationConfig = {
    textlink: {
      componentType: 'textlink' as const,
      textLinkVariant: 'primary' as const,
      weight: 'medium' as const,
      underline: 'hover' as const
    },
    button: {
      componentType: 'button' as const,
      variant: 'primary' as const,
      rightIcon: 'ArrowRightIcon'
    }
  }
}: ClientLayoutProps) {
  // Create base navigation items from configuration
  const baseNavigationItems: NavigationItem[] = [
    {
      componentType: 'textlink' as const,
      textLinkVariant: navigationConfig?.textlink?.textLinkVariant || 'primary',
      weight: navigationConfig?.textlink?.weight || 'medium',
      underline: navigationConfig?.textlink?.underline || 'hover'
    },
    {
      componentType: 'button' as const,
      variant: navigationConfig?.button?.variant || 'primary',
      rightIcon: navigationConfig?.button?.rightIcon || 'ArrowRightIcon'
    }
  ];

  // Enhance navigation with CMS content
  const enhancedNavigationItems = enhanceNavigationWithCMS(baseNavigationItems, initialContent);

  // Convert string icon references back to JSX
  const processedNavItems = enhancedNavigationItems.map(item => ({
    ...item,
    rightIcon: item.rightIcon === 'ArrowRightIcon' ? <ArrowRightIcon /> : undefined
  }));

  return (
    <ContentProvider initialContent={initialContent}>
      <EditingModeWrapper>
        {showNavbar && (
          <Navbar 
            brandName={brandName}
            brandHref={brandHref}
            navItems={processedNavItems}
            navSize={navSize}
            brandVariant={brandVariant}
            brandSize={brandSize}
            brandWeight={brandWeight}
            brandUnderline={brandUnderline}
            logoSrc={logoSrc}
            logoAlt={logoAlt}
            logoWidth={logoWidth}
            logoHeight={logoHeight}
          />
        )}
        {children}
        {showFooter && <Footer />}
      </EditingModeWrapper>
    </ContentProvider>
  );
}

// Export the interface for use in client projects
export type { ClientLayoutProps }; 