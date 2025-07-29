'use client';

import { createContext, useContext, useState, ReactNode, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
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

  console.log('EditingProvider debug:', { isEditingMode });

  // Listen for editing status updates from parent window
  useEffect(() => {
    console.log('Setting up editing message listener...');
    
    const messageHandlers: EditingMessageHandlers = {
      onEditingStatusUpdate: (editing) => {
        console.log('Received editing status update:', { editing });
        setIsEditing(editing);
      }
    };

    const cleanup = setupEditingMessageListener(messageHandlers);
    
    // Always request editing status from parent, regardless of version parameter
    console.log('Requesting editing status...');
    requestEditingStatus(1); // Use dummy versionId since parent always returns true anyway

    return cleanup;
  }, []); // Remove versionId dependency

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
      <EditingProvider>
        {children}
      </EditingProvider>
    </Suspense>
  );
}

export function useEditingMode() {
  const context = useContext(ToggleContext);
  if (context === undefined) {
    throw new Error('useEditingMode must be used within a EditingProvider');
  }
  return context;
} 