'use client';

import { createContext, useContext, useState, ReactNode, useEffect, Suspense } from 'react';
import { 
  requestEditingStatus,
  setupEditingMessageListener,
  type EditingMessageHandlers
} from '../../messaging/initial/child/initialMessaging';
import { 
  sendCurrentPageInfo,
  setupPageSwitchMessageListener,
  type PageSwitchMessageHandlers
} from '../../messaging/page-switch/child/pageSwitchMessaging';
import { extractLocaleFromPathname, extractPageSlugFromPathname } from '../../../system/utils/navigation';

export interface ToggleContextType {
  isEditingMode: boolean;
}

export const ToggleContext = createContext<ToggleContextType | undefined>(undefined);

function EditingProvider({ children }: { children: ReactNode }) {
  const [isEditingMode, setIsEditing] = useState<boolean>(false);

  // Listen for editing status updates from parent window
  useEffect(() => {
    
    const messageHandlers: EditingMessageHandlers = {
      onEditingStatusUpdate: (editing: boolean) => {
        setIsEditing(editing);
        
        // When editing mode is activated, send current page info
        if (editing && typeof window !== 'undefined') {
          const pathname = window.location.pathname;
          const locale = extractLocaleFromPathname(pathname);
          const pageSlug = extractPageSlugFromPathname(pathname, editing);
          
          console.log('Sending current page info:', { pageSlug, locale, pathname });
          sendCurrentPageInfo(pageSlug, locale);
        }
      }
    };

    const cleanup = setupEditingMessageListener(messageHandlers);

    requestEditingStatus();

    return cleanup;
  }, []);

  // Setup page switch message listener
  useEffect(() => {
    if (isEditingMode) {
      const pageSwitchHandlers: PageSwitchMessageHandlers = {
        onPageSwitchUpdate: (pageSlug: string, locale: string) => {
          console.log('Received page switch update:', { pageSlug, locale });
          // Handle page switch from parent if needed
          // For now, we just log it - future enhancement could navigate to the page
        }
      };

      const pageSwitchCleanup = setupPageSwitchMessageListener(pageSwitchHandlers);
      
      return pageSwitchCleanup;
    }
  }, [isEditingMode]);

  return (
    <ToggleContext.Provider value={{ isEditingMode }}>
      {children}
    </ToggleContext.Provider>
  );
}

// Wrapper som bara hanterar Suspense
export function EditingModeWrapper({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EditingProvider>{children}</EditingProvider>
    </Suspense>
  );
}

// Hook för att använda editing mode
export function useEditingMode() {
  const context = useContext(ToggleContext);
  if (context === undefined) {
    throw new Error('useEditingMode must be used within an EditingModeWrapper');
  }
  return context;
} 