'use client';

import { createContext, useContext, useState, ReactNode, useEffect, Suspense } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { 
  requestEditingStatus,
  setupEditingMessageListener,
  type EditingMessageHandlers
} from '../../messaging/initial/child/initialMessaging';
import {
  useI18nChildMessaging,
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

  // Setup I18n child messaging
  const i18nMessaging = useI18nChildMessaging(
    currentLanguage,
    (languageCode: string) => {
      console.log('🌍 EditingProvider: Language changed to:', languageCode);
      setCurrentLanguage(languageCode);
    }
  );

  // Listen for editing status updates from parent window
  useEffect(() => {
    const messageHandlers: EditingMessageHandlers = {
      onEditingStatusUpdate: (editing: boolean) => {
        console.log('📝 EditingProvider: Editing status changed to:', editing);
        setIsEditing(editing);
      }
    };

    const cleanup = setupEditingMessageListener(messageHandlers);
    
    // Setup I18n messaging listener
    const i18nCleanup = i18nMessaging.setupMessageListener();

    // Request editing status from parent
    requestEditingStatus();
    
    // Request available languages from parent
    i18nMessaging.requestAvailableLanguages();

    return () => {
      cleanup();
      i18nCleanup();
    };
  }, [i18nMessaging]);

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