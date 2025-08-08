'use client';

import { createContext, useContext, useState, ReactNode, useEffect, Suspense } from 'react';
import { requestEditingStatus } from '../../messaging/initial/child/initialMessaging';
import { getCurrentLocale, switchLocale, type SupportedLocale } from '../../../system/utils/locale';
import { setupCentralMessageDispatcher, type CentralMessageHandlers } from '../../messaging/central/centralMessaging';

export interface ToggleContextType {
  isEditingMode: boolean;
  currentLocale: string;
  setCurrentLocale: (locale: string) => void;
  registerMessageHandlers?: (handlers: Partial<CentralMessageHandlers>) => void;
}

export const ToggleContext = createContext<ToggleContextType | undefined>(undefined);

function EditingProvider({ children }: { children: ReactNode }) {
  const [isEditingMode, setIsEditing] = useState<boolean>(false);
  const [currentLocale, setCurrentLocaleState] = useState<string>(() => getCurrentLocale());
  const [messageDispatcher, setMessageDispatcher] = useState<any>(null);

  // Centralized message listener for all postMessage communication
  useEffect(() => {
    console.log('🌐 EditingWrapper setting up centralized message dispatcher');
    
    // Define all message handlers in one place
    const messageHandlers: CentralMessageHandlers = {
      // Editing status handler
      onEditingStatusUpdate: (editing: boolean) => {
        console.log('📝 EditingWrapper received editing status:', editing);
        setIsEditing(editing);
      },
      
      // I18n handlers
      onLocaleChange: (locale: string) => {
        console.log('🌐 EditingWrapper received locale change:', locale);
        setCurrentLocaleState(locale);
        // Trigger the actual locale switch
        switchLocale(locale as SupportedLocale, true);
      },
      
      onLocaleSync: (locale: string) => {
        console.log('🌐 EditingWrapper received locale sync:', locale);
        setCurrentLocaleState(locale);
        // For sync, just update state without triggering navigation
      },
      
      // Log unhandled messages for debugging
      onUnhandledMessage: (event: MessageEvent) => {
        console.log('🌐 EditingWrapper unhandled message:', event.data);
      }
    };

    // Setup the centralized dispatcher
    const { dispatcher, cleanup, updateHandlers } = setupCentralMessageDispatcher(messageHandlers);
    setMessageDispatcher({ updateHandlers });

    // Request initial editing status
    requestEditingStatus();

    // Return cleanup function
    return cleanup;
  }, []);

  // Function to update locale (for use by child components)
  const setCurrentLocale = (locale: string) => {
    setCurrentLocaleState(locale);
  };

  // Function to register additional message handlers (for ContentProvider, etc.)
  const registerMessageHandlers = (handlers: Partial<CentralMessageHandlers>) => {
    if (messageDispatcher) {
      messageDispatcher.updateHandlers(handlers);
    }
  };

  return (
    <ToggleContext.Provider value={{ 
      isEditingMode, 
      currentLocale, 
      setCurrentLocale,
      registerMessageHandlers
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