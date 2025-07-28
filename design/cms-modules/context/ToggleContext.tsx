'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { 
  requestEditingStatus,
  setupEditingMessageListener,
  type EditingMessageHandlers
} from '../../cms-modules/messaging/toggleMessaging';

interface ToggleContextType {
  isEditingMode: boolean;
}

const ToggleContext = createContext<ToggleContextType | undefined>(undefined);


function EditingProvider({ children }: { children: ReactNode }) {
  const searchParams = useSearchParams();
  const versionId = searchParams.get('version') ? parseInt(searchParams.get('version')!, 10) : undefined;
  const [isEditingMode, setIsEditing] = useState<boolean>(false);

  // Listen for editing status updates from parent window
  useEffect(() => {
    const messageHandlers: EditingMessageHandlers = {
      onEditingStatusUpdate: (editing) => setIsEditing(editing)
    };

    const cleanup = setupEditingMessageListener(messageHandlers);
    
    // Request initial editing status from parent
    if (versionId) {
      requestEditingStatus(versionId);
    }

    return cleanup;
  }, [versionId]);

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

export function useToggle() {
  const context = useContext(ToggleContext);
  if (context === undefined) {
    throw new Error('useToggle must be used within a EditingProvider');
  }
  return context;
} 