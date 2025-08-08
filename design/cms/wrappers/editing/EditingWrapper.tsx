'use client';

import { createContext, useContext, useState, ReactNode, useEffect, Suspense } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { 
  requestEditingStatus,
  setupEditingMessageListener,
  type EditingMessageHandlers
} from '../../messaging/initial/child/initialMessaging';
import {
  I18nChildHandler,
  type I18nChildHandlers,
  type AvailableLanguage
} from '../../messaging/i18n/child';

export interface ToggleContextType {
  isEditingMode: boolean;
}

export interface I18nContextType {
  currentLanguage: string;
  availableLanguages: AvailableLanguage[];
}

export const ToggleContext = createContext<ToggleContextType | undefined>(undefined);
export const I18nContext = createContext<I18nContextType | undefined>(undefined);

function EditingProvider({ children }: { children: ReactNode }) {
  const [isEditingMode, setIsEditing] = useState<boolean>(false);
  const [currentLanguage, setCurrentLanguage] = useState<string>('sv');
  const [availableLanguages, setAvailableLanguages] = useState<AvailableLanguage[]>([]);
  
  const router = useRouter();
  const pathname = usePathname();

  // Extract initial language from pathname
  useEffect(() => {
    const pathSegments = pathname.split('/');
    const localeFromPath = pathSegments[1];
    if (localeFromPath && localeFromPath !== currentLanguage) {
      console.log('🌍 EditingProvider: Setting initial language from path:', localeFromPath);
      setCurrentLanguage(localeFromPath);
    }
  }, [pathname, currentLanguage]);

  // Listen for messages from parent window
  useEffect(() => {
    // Check if we're in iframe
    const inIframe = window.parent !== window;
    if (!inIframe) {
      console.log('🌍 EditingProvider: Not in iframe, skipping postMessage setup');
      return;
    }

    console.log('🌍 EditingProvider: Setting up message listeners in iframe');

    // Simple test message listener
    const testMessageHandler = (event: MessageEvent) => {
      if (event.data.type === 'language-change-request') {
        console.log('🌍 TEST HANDLER: Received language change request:', event.data.languageCode);
      }
    };
    window.addEventListener('message', testMessageHandler);

    // Global message listener for debugging
    const globalMessageHandler = (event: MessageEvent) => {
      console.log('🌍 GLOBAL: Received message:', event.data);
    };
    window.addEventListener('message', globalMessageHandler);

    // Setup editing message handlers
    const editingHandlers: EditingMessageHandlers = {
      onEditingStatusUpdate: (editing: boolean) => {
        console.log('📝 EditingProvider: Editing status changed to:', editing);
        setIsEditing(editing);
      }
    };

    // Setup i18n message handlers
    const i18nHandlers: I18nChildHandlers = {
      onLanguageChangeRequest: (languageCode: string) => {
        console.log('🌍 EditingProvider: Language change requested:', languageCode);
        
        // Get current pathname dynamically to avoid stale closure
        const currentPathname = window.location.pathname;
        const pathSegments = currentPathname.split('/');
        const routeWithoutLocale = pathSegments.slice(2).join('/') || '';
        
        // Construct new URL with new language
        const newPath = `/${languageCode}${routeWithoutLocale ? `/${routeWithoutLocale}` : ''}`;
        
        console.log('🌍 EditingProvider: Navigating from', currentPathname, 'to', newPath);
        
        // Update local state first
        setCurrentLanguage(languageCode);
        
        // Navigate to new language URL
        router.push(newPath);
      },
      onAvailableLanguages: (languages: AvailableLanguage[]) => {
        console.log('🌍 EditingProvider: Received available languages:', languages);
        setAvailableLanguages(languages);
      }
    };

    // Create i18n handler
    const i18nHandler = new I18nChildHandler(i18nHandlers, currentLanguage);
    console.log('🌍 EditingProvider: Created I18nChildHandler with language:', currentLanguage);

    // Setup message listeners
    const editingCleanup = setupEditingMessageListener(editingHandlers);
    const i18nCleanup = i18nHandler.setupMessageListener();
    console.log('🌍 EditingProvider: Set up message listeners');

    // Request initial data from parent
    requestEditingStatus();
    i18nHandler.requestAvailableLanguages();
    console.log('🌍 EditingProvider: Requested initial data from parent');

    return () => {
      window.removeEventListener('message', testMessageHandler);
      window.removeEventListener('message', globalMessageHandler);
      editingCleanup();
      i18nCleanup();
    };
  }, [router]); // Remove pathname and currentLanguage from dependencies

  const toggleContextValue: ToggleContextType = {
    isEditingMode
  };

  const i18nContextValue: I18nContextType = {
    currentLanguage,
    availableLanguages
  };

  return (
    <ToggleContext.Provider value={toggleContextValue}>
      <I18nContext.Provider value={i18nContextValue}>
        {children}
      </I18nContext.Provider>
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

// Hook för att använda i18n context
export function useI18nContext() {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error('useI18nContext must be used within an EditingModeWrapper');
  }
  return context;
} 