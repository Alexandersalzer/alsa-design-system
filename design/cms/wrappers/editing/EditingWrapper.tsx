'use client';

import { createContext, useContext, useState, ReactNode, useEffect, Suspense } from 'react';
import { 
  requestEditingStatus,
  type EditingMessageHandlers
} from '../../messaging/initial/child/initialMessaging';
import { 
  type I18nMessageHandlers
} from '../../messaging/i18n/child/i18nMessaging';
import { 
  requestWebsiteContent,
  parseContentFromUrl,
  type MessageHandlers
} from '../../messaging/content/child/contentMessaging';
import { getCurrentLocale, switchLocale, type SupportedLocale } from '../../../system/utils/locale';
import { type WebsiteContent } from '../content/types/content';

export interface ToggleContextType {
  isEditingMode: boolean;
  currentLocale: string;
  setCurrentLocale: (locale: string) => void;
  // Content-related state
  dynamicContent: WebsiteContent | null;
  setDynamicContent: (content: WebsiteContent | null) => void;
  isContentLoading: boolean;
  contentError: string | null;
}

export const ToggleContext = createContext<ToggleContextType | undefined>(undefined);

function EditingProvider({ children }: { children: ReactNode }) {
  const [isEditingMode, setIsEditing] = useState<boolean>(false);
  const [currentLocale, setCurrentLocaleState] = useState<string>(() => getCurrentLocale());
  
  // Content-related state (moved from ContentProvider)
  const [dynamicContent, setDynamicContent] = useState<WebsiteContent | null>(null);
  const [isContentLoading, setIsContentLoading] = useState(true);
  const [contentError, setContentError] = useState<string | null>(null);

  // CENTRALIZED message listener for ALL message types
  useEffect(() => {
    console.log('🌐 EditingWrapper setting up CENTRALIZED message dispatcher');
    console.log('🌐 Current window location:', window.location.href);
    console.log('🌐 Parent window exists:', window.parent !== window);
    
    // Single message handler that dispatches to appropriate handlers
    const handleAllMessages = (event: MessageEvent) => {
      // Add origin check for security (optional, but good practice)
      console.log('📨 EditingWrapper received message from origin:', event.origin);
      console.log('📨 Message type:', event.data.type);
      console.log('📨 Full message data:', event.data);
      
      // Handle editing status messages
      if (event.data.type === 'editing-status-update') {
        console.log('📝 EditingWrapper handling editing status:', event.data.editing);
        setIsEditing(event.data.editing);
      }
      
      // Handle i18n messages
      else if (event.data.type === 'locale-change') {
        console.log('🌐 EditingWrapper handling locale change:', event.data.locale);
        console.log('🌐 Current locale before change:', currentLocale);
        setCurrentLocaleState(event.data.locale);
        // Trigger the actual locale switch
        console.log('🌐 Calling switchLocale with:', event.data.locale, true);
        switchLocale(event.data.locale as SupportedLocale, true);
      }
      else if (event.data.type === 'locale-sync') {
        console.log('🌐 EditingWrapper handling locale sync:', event.data.locale);
        setCurrentLocaleState(event.data.locale);
        // For sync, just update state without triggering navigation
      }
      
      // Handle content messages
      else if (event.data.type === 'content-update') {
        console.log('📄 EditingWrapper handling content update');
        setDynamicContent(event.data.content);
        setIsContentLoading(false);
      }
      else if (event.data.type === 'website-content-response') {
        console.log('📄 EditingWrapper handling website content response');
        setDynamicContent(event.data.content);
        setIsContentLoading(false);
      }
      
      // Log unhandled message types
      else {
        console.log('❓ EditingWrapper received unhandled message type:', event.data.type);
      }
    };

    // Register single message listener
    console.log('🌐 Registering message listener on window');
    window.addEventListener('message', handleAllMessages);

    // Request initial data
    console.log('🌐 Requesting initial editing status');
    requestEditingStatus();

    // Return cleanup function
    return () => {
      console.log('🌐 Cleaning up message listener');
      window.removeEventListener('message', handleAllMessages);
    };
  }, [currentLocale]); // Add currentLocale as dependency to get updated value in logs

  // Handle content loading in editing mode
  useEffect(() => {
    if (isEditingMode) {
      console.log('📄 EditingWrapper handling content loading for editing mode');
      
      // Try to get content from URL first
      const urlContent = parseContentFromUrl();
      if (urlContent) {
        console.log('📄 EditingWrapper found content in URL');
        setDynamicContent(urlContent);
        setIsContentLoading(false);
        return;
      }

      // If no content in URL, request it from parent CMS
      console.log('📄 EditingWrapper requesting content from parent');
      requestWebsiteContent();
    } else {
      // In normal mode: clear dynamic content and stop loading
      setDynamicContent(null);
      setIsContentLoading(false);
    }
  }, [isEditingMode]);

  // Function to update locale (for use by child components)
  const setCurrentLocale = (locale: string) => {
    console.log('🌐 EditingWrapper setCurrentLocale called with:', locale);
    setCurrentLocaleState(locale);
  };

  return (
    <ToggleContext.Provider value={{ 
      isEditingMode, 
      currentLocale, 
      setCurrentLocale,
      dynamicContent,
      setDynamicContent,
      isContentLoading,
      contentError
    }}>
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

export function useEditingMode(): ToggleContextType {
  const context = useContext(ToggleContext);
  if (context === undefined) {
    throw new Error('useEditingMode must be used within an EditingModeWrapper');
  }
  return context;
} 