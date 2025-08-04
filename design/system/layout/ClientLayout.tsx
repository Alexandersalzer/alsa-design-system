'use client';

import { ContentProvider, EditingModeWrapper, Navbar, Footer, ArrowRightIcon } from '../..';
import { ReactNode } from "react";
import type { WebsiteContent } from "../../cms/types/content";
import type { NavigationItem } from "../../cms/content/navigationHelper";

interface ClientLayoutProps {
  children: ReactNode;
  initialContent: WebsiteContent | null;
  navigationItems: NavigationItem[];
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
}

export function ClientLayout({ 
  children, 
  initialContent,
  navigationItems,
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
  brandUnderline = 'none'
}: ClientLayoutProps) {
  // Convert string icon references back to JSX
  const processedNavItems = navigationItems.map(item => ({
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