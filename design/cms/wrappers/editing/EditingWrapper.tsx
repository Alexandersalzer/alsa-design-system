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

export interface ToggleContextType {
  isEditingMode: boolean;
}

export const ToggleContext = createContext<ToggleContextType | undefined>(undefined);

function EditingProvider({ children }: { children: ReactNode }) {
  const [isEditingMode, setIsEditing] = useState<boolean>(false);

  // Listen for editing status updates and language changes from parent window
  useEffect(() => {
    
    const messageHandlers: EditingMessageHandlers = {
      onEditingStatusUpdate: (editing: boolean) => {
        console.log('Editing status update received:', editing);
        setIsEditing(editing);
      }
    };

    const i18nHandlers: I18nMessageHandlers = {
      onLanguageChange: (languageCode: string) => {
        console.log('Language change received in EditingProvider:', languageCode);
        // The switchLocale function in i18nMessaging will handle the actual navigation
        // We don't need to do anything else here since it will trigger a page reload
      }
    };

    const editingCleanup = setupEditingMessageListener(messageHandlers);
    const i18nCleanup = setupI18nMessageListener(i18nHandlers);

    // Request editing status from parent
    requestEditingStatus();

    return () => {
      editingCleanup();
      i18nCleanup();
    };
  }, []);

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