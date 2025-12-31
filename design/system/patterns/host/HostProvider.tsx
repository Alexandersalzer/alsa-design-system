'use client';

import React, { createContext, useContext, ReactNode } from 'react';

export interface HostContextType {
  host: string;
  subdomain: string | null;
  isProduction: boolean;
}

const HostContext = createContext<HostContextType | null>(null);

export function useHost(): HostContextType {
  const context = useContext(HostContext);
  if (!context) {
    throw new Error('useHost must be used within a HostProvider');
  }
  return context;
}

interface HostProviderProps {
  children: ReactNode;
}

export function HostProvider({ children }: HostProviderProps) {
  // Hämta host från browser (client-side)
  const host = typeof window !== 'undefined' ? window.location.host : '';
  
  // Extrahera subdomain om det är onblimpify.com
  const subdomain = host.endsWith('.onblimpify.com')
    ? host.replace('.onblimpify.com', '')
    : null;
  
  // Kolla om det är produktion (inte localhost)
  const isProduction = !host.includes('localhost');

  return (
    <HostContext.Provider value={{ host, subdomain, isProduction }}>
      {children}
    </HostContext.Provider>
  );
}
