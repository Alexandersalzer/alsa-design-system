'use client';

import { ContentProvider, EditingModeWrapper } from '../..';
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
    <EditingModeWrapper>
      <ContentProvider initialContent={initialContent}>
        {children}
      </ContentProvider>
    </EditingModeWrapper>
  );
}

// Export the interface for use in client projects
export type { ContentLayoutProps }; 