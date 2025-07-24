'use client';

import React, { createContext, useContext, useState, ReactNode, useCallback, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { 
  sendToggleEditingRequest,
  requestEditingStatus,
  setupToggleMessageListener,
  type ToggleMessageHandlers
} from '../../cms-modules/messaging/toggleMessaging';

interface ToggleContextType {
  isToggled: boolean;
  setIsToggled: (value: boolean) => void;
  toggleState: () => void;
  isLoading: boolean;
}

interface ToggleProviderProps {
  children: ReactNode;
  versionId?: number;
  initialEditingStatus?: boolean;
}

const ToggleContext = createContext<ToggleContextType | undefined>(undefined);

export function ToggleProvider({ children, versionId, initialEditingStatus = false }: ToggleProviderProps) {
  const [isToggled, setIsToggled] = useState(initialEditingStatus);
  const [isLoading, setIsLoading] = useState(false);

  // Update state when initialEditingStatus changes
  useEffect(() => {
    setIsToggled(initialEditingStatus);
  }, [initialEditingStatus]);

  const handleToggleChange = useCallback(async (newValue: boolean) => {
    if (!versionId) {
      return;
    }

    try {
      setIsLoading(true);
      
      // Send toggle request to parent window (editor.tsx)
      sendToggleEditingRequest(versionId, newValue);
      
      // Optimistically update the state
      setIsToggled(newValue);
    } catch (error) {
      console.error('Error updating editing status:', error);
    } finally {
      setIsLoading(false);
    }
  }, [versionId]);

  const toggleState = useCallback(() => {
    handleToggleChange(!isToggled);
  }, [isToggled, handleToggleChange]);

  const setIsToggledWithApi = useCallback((value: boolean) => {
    handleToggleChange(value);
  }, [handleToggleChange]);

  return (
    <ToggleContext.Provider value={{ 
      isToggled, 
      setIsToggled: setIsToggledWithApi, 
      toggleState,
      isLoading 
    }}>
      {children}
    </ToggleContext.Provider>
  );
}

// Component that handles search params - needs to be wrapped in Suspense
function SearchParamsProvider({ children }: { children: ReactNode }) {
  const searchParams = useSearchParams();
  const versionId = searchParams.get('version') ? parseInt(searchParams.get('version')!, 10) : undefined;
  const [editingStatus, setEditingStatus] = useState<boolean>(false);

  // Listen for editing status updates from parent window
  useEffect(() => {
    const messageHandlers: ToggleMessageHandlers = {
      onEditingStatusUpdate: (editing) => setEditingStatus(editing)
    };

    const cleanup = setupToggleMessageListener(messageHandlers);
    
    // Request initial editing status from parent
    if (versionId) {
      requestEditingStatus(versionId);
    }

    return cleanup;
  }, [versionId]);

  return (
    <ToggleProvider versionId={versionId} initialEditingStatus={editingStatus}>
      {children}
    </ToggleProvider>
  );
}

// Wrapper component that wraps SearchParamsProvider in Suspense
export function ToggleProviderWrapper({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchParamsProvider>
        {children}
      </SearchParamsProvider>
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