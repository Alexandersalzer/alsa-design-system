'use client';

import { createContext, useContext, useState, ReactNode, useEffect, Suspense } from 'react';
import { 
  requestEditingStatus,
  setupEditingMessageListener,
  type EditingMessageHandlers
} from './initialMessaging';

interface ToggleContextType {
  isEditingMode: boolean;
}

const ToggleContext = createContext<ToggleContextType | undefined>(undefined);

function EditingProvider({ children }: { children: ReactNode }) {
  const [isEditingMode, setIsEditing] = useState<boolean>(false);


  // Listen for editing status updates from parent window
  useEffect(() => {
    
    const messageHandlers: EditingMessageHandlers = {
      onEditingStatusUpdate: (editing: boolean) => {
        setIsEditing(editing);
      }
    };

    const cleanup = setupEditingMessageListener(messageHandlers);

    requestEditingStatus();

    return cleanup;
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