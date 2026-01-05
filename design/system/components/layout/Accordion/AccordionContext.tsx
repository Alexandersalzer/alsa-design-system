// ===============================================
// Accordion Context
// Shared context for Accordion and AccordionItem
// ===============================================

"use client";

import { createContext, useContext } from 'react';

export interface AccordionContextValue {
  expandedKeys: Set<string>;
  toggleKey: (key: string) => void;
  selectionMode: 'single' | 'multiple';
  radius: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  radiusMode: 'edges' | 'all' | 'none';
  variant: 'default' | 'separated' | 'bordered' | 'sunken' | 'borderless';
  showIndicator: boolean;
}

export const AccordionContext = createContext<AccordionContextValue | null>(null);

export const useAccordionContext = () => {
  const context = useContext(AccordionContext);
  if (!context) {
    throw new Error('AccordionItem must be used within Accordion');
  }
  return context;
};
