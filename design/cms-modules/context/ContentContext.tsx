'use client';

import React, { createContext, useContext } from 'react';
import { type WebsiteContent } from '../../cms-modules/types/content';

// Interface for hero content - only text content
export interface HeroContent {
  title: string;
  subtitle: string;
  primaryButtonText: string;
  secondaryButtonText: string;
}

// Interface for navbar content - navigation items with labels
export interface NavbarContent {
  navItems: Array<{
    label: string;
    slug: string;
  }>;
}

export interface ContentContextType {
  content: WebsiteContent | null;
  staticContent: WebsiteContent | null;
  dynamicContent: WebsiteContent | null;
  isLoading: boolean;
  error: string | null;
  accentColor: string;
  radius: string;
  fontName: string;
  getHeroContent: (pageSlug: string) => HeroContent | undefined;
  getNavbarContent: () => NavbarContent | undefined;
}

export const ContentContext = createContext<ContentContextType | undefined>(undefined);

export function useContent() {
  const context = useContext(ContentContext);
  if (context === undefined) {
    throw new Error('useContent must be used within a ContentProvider');
  }
  return context;
} 