'use client';

import { createContext, useContext, useState, ReactNode, useEffect, Suspense } from 'react';
import { 
  requestEditingStatus,
  setupEditingMessageListener,
  type EditingMessageHandlers
} from '../../messaging/initial/child/initialMessaging';
import { 
  setupI18nMessageListener,
  type I18nMessageHandlers
} from '../../messaging/i18n/child/i18nMessaging';
import { getCurrentLocale, switchLocale, type SupportedLocale } from '../../../system/utils/locale';

export interface ToggleContextType {
  isEditingMode: boolean;
  currentLocale: string;
  setCurrentLocale: (locale: string) => void;
}

export const ToggleContext = createContext<ToggleContextType | undefined>(undefined);

function EditingProvider({ children }: { children: ReactNode }) {
  const [isEditingMode, setIsEditing] = useState<boolean>(false);
  const [currentLocale, setCurrentLocaleState] = useState<string>(() => getCurrentLocale());

  // Combined message listener for both editing status and i18n
  useEffect(() => {
    console.log('🌐 EditingWrapper setting up combined message listeners');
    
    // Setup editing message handlers
    const editingHandlers: EditingMessageHandlers = {
      onEditingStatusUpdate: (editing: boolean) => {
        console.log('📝 EditingWrapper received editing status:', editing);
        setIsEditing(editing);
      }
    };

    // Setup i18n message handlers
    const i18nHandlers: I18nMessageHandlers = {
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
      }
    };

    // Setup both message listeners
    const editingCleanup = setupEditingMessageListener(editingHandlers);
    const i18nCleanup = setupI18nMessageListener(i18nHandlers);

    // Request initial editing status
    requestEditingStatus();

    // Return combined cleanup function
    return () => {
      editingCleanup();
      i18nCleanup();
    };
  }, []);

  // Function to update locale (for use by child components)
  const setCurrentLocale = (locale: string) => {
    setCurrentLocaleState(locale);
  };

  return (
    <ToggleContext.Provider value={{ 
      isEditingMode, 
      currentLocale, 
      setCurrentLocale 
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