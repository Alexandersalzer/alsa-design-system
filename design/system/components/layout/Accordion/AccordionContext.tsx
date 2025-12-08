// ===============================================
// Accordion Context
// Shared context for Accordion and AccordionItem
// ===============================================

import { createContext, useContext } from 'react';

export interface AccordionContextValue {
  expandedKeys: Set<string>;
  toggleKey: (key: string) => void;
  selectionMode: 'single' | 'multiple';
}

export const AccordionContext = createContext<AccordionContextValue | null>(null);

export const useAccordionContext = () => {
  const context = useContext(AccordionContext);
  if (!context) {
    throw new Error('AccordionItem must be used within Accordion');
  }
  return context;
};
