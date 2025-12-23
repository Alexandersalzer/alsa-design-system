'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

// Consent kategorier enligt GDPR
export interface ConsentState {
  necessary: boolean;    // Alltid true - kan inte nekas
  analytics: boolean;    // Google Analytics, etc.
  marketing: boolean;    // Meta Pixel, TikTok, etc.
  preferences: boolean;  // Språkval, tema, etc.
}

export interface ConsentContextType {
  consent: ConsentState;
  hasResponded: boolean;  // Har användaren svarat på bannern?
  isLoading: boolean;     // Laddar vi från storage?
  acceptAll: () => void;
  rejectAll: () => void;
  acceptSelected: (categories: Partial<ConsentState>) => void;
  resetConsent: () => void;
}

const STORAGE_KEY = 'blimpify_cookie_consent';
const CONSENT_VERSION = '1.0'; // Öka för att tvinga ny consent vid policy-ändring

const defaultConsent: ConsentState = {
  necessary: true,
  analytics: false,
  marketing: false,
  preferences: false,
};

const ConsentContext = createContext<ConsentContextType | null>(null);

export function useConsent(): ConsentContextType {
  const context = useContext(ConsentContext);
  if (!context) {
    throw new Error('useConsent must be used within a ConsentProvider');
  }
  return context;
}

interface StoredConsent {
  version: string;
  consent: ConsentState;
  timestamp: string;
}

interface ConsentProviderProps {
  children: ReactNode;
}

export function ConsentProvider({ children }: ConsentProviderProps) {
  const [consent, setConsent] = useState<ConsentState>(defaultConsent);
  const [hasResponded, setHasResponded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Läs från localStorage vid mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed: StoredConsent = JSON.parse(stored);
        
        // Kontrollera version - om gammal, visa banner igen
        if (parsed.version === CONSENT_VERSION) {
          setConsent({ ...parsed.consent, necessary: true });
          setHasResponded(true);
        }
      }
    } catch (error) {
      console.warn('[Consent] Could not read stored consent:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Spara till localStorage
  const saveConsent = useCallback((newConsent: ConsentState) => {
    const toStore: StoredConsent = {
      version: CONSENT_VERSION,
      consent: newConsent,
      timestamp: new Date().toISOString(),
    };
    
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(toStore));
    } catch (error) {
      console.warn('[Consent] Could not save consent:', error);
    }
  }, []);

  const acceptAll = useCallback(() => {
    const newConsent: ConsentState = {
      necessary: true,
      analytics: true,
      marketing: true,
      preferences: true,
    };
    setConsent(newConsent);
    setHasResponded(true);
    saveConsent(newConsent);
  }, [saveConsent]);

  const rejectAll = useCallback(() => {
    const newConsent: ConsentState = {
      necessary: true,
      analytics: false,
      marketing: false,
      preferences: false,
    };
    setConsent(newConsent);
    setHasResponded(true);
    saveConsent(newConsent);
  }, [saveConsent]);

  const acceptSelected = useCallback((categories: Partial<ConsentState>) => {
    const newConsent: ConsentState = {
      ...defaultConsent,
      ...categories,
      necessary: true, // Alltid true
    };
    setConsent(newConsent);
    setHasResponded(true);
    saveConsent(newConsent);
  }, [saveConsent]);

  const resetConsent = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setConsent(defaultConsent);
    setHasResponded(false);
  }, []);

  return (
    <ConsentContext.Provider
      value={{
        consent,
        hasResponded,
        isLoading,
        acceptAll,
        rejectAll,
        acceptSelected,
        resetConsent,
      }}
    >
      {children}
    </ConsentContext.Provider>
  );
}
