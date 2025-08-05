'use client';

import { ContentProvider, EditingModeWrapper, Navbar, Footer } from '../..';
import { ReactNode } from "react";
import type { WebsiteContent } from "../../cms/types/content";

interface ClientLayoutProps {
  children: ReactNode;
  initialContent: WebsiteContent | null;
  showNavbar?: boolean;
  showFooter?: boolean;
}

export function ClientLayout({ 
  children, 
  initialContent,
  showNavbar = true,
  showFooter = true
}: ClientLayoutProps) {
  return (
    <ContentProvider initialContent={initialContent}>
      <EditingModeWrapper>
        {showNavbar && <Navbar />}
        {children}
        {showFooter && <Footer />}
      </EditingModeWrapper>
    </ContentProvider>
  );
}

// Export the interface for use in client projects
export type { ClientLayoutProps }; 