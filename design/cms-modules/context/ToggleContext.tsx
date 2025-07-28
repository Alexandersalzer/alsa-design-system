'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { 
  requestEditingStatus,
  setupToggleMessageListener,
  type ToggleMessageHandlers
} from '../../cms-modules/messaging/toggleMessaging';

interface ToggleContextType {
  isToggled: boolean;
}

const ToggleContext = createContext<ToggleContextType | undefined>(undefined);

// COMBINED: SearchParams + Toggle Provider i en komponent
function ToggleProvider({ children }: { children: ReactNode }) {
  const searchParams = useSearchParams();
  const versionId = searchParams.get('version') ? parseInt(searchParams.get('version')!, 10) : undefined;
  const [isToggled, setIsToggled] = useState<boolean>(false);

  // Listen for editing status updates from parent window
  useEffect(() => {
    const messageHandlers: ToggleMessageHandlers = {
      onEditingStatusUpdate: (editing) => setIsToggled(editing)
    };

    const cleanup = setupToggleMessageListener(messageHandlers);
    
    // Request initial editing status from parent
    if (versionId) {
      requestEditingStatus(versionId);
    }

    return cleanup;
  }, [versionId]);

  return (
    <ToggleContext.Provider value={{ isToggled }}>
      {children}
    </ToggleContext.Provider>
  );
}

// Wrapper som bara hanterar Suspense
export function ToggleProviderWrapper({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ToggleProvider>
        {children}
      </ToggleProvider>
    </Suspense>
  );
}

export function useToggle() {
  const context = useContext(ToggleContext);
  if (context === undefined) {
    throw new Error('useToggle must be used within a ToggleProvider');
  }
  return context;
} 