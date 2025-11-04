'use client';

import { ContentProvider } from '../..';
import { ReactNode } from "react";
import type { WebsiteContent } from "./content/types/content";

interface ContentLayoutProps {
  children: ReactNode;
  initialContent: WebsiteContent | null;
}

export function ContentLayout({ 
  children, 
  initialContent
}: ContentLayoutProps) {
  return (
    <ContentProvider initialContent={initialContent}>
      {children}
    </ContentProvider>
  );
}

// Export the interface for use in client projects
export type { ContentLayoutProps }; 