'use client';

import { ContentProvider, EditingModeWrapper } from '../..';
import { ReactNode } from "react";
import type { WebsiteContent } from "../../cms/types/content";

interface ClientLayoutProps {
  children: ReactNode;
  initialContent: WebsiteContent | null;
}

export function ClientLayout({ 
  children, 
  initialContent
}: ClientLayoutProps) {
  return (
    <ContentProvider initialContent={initialContent}>
      <EditingModeWrapper>
        {children}
      </EditingModeWrapper>
    </ContentProvider>
  );
}

// Export the interface for use in client projects
export type { ClientLayoutProps }; 