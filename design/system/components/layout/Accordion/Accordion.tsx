// ===============================================
// Accordion Component
// Vertically stacked collapsible sections
// ===============================================

import React, { useState } from 'react';
import { cn } from '../../../utils/cn';
import { AccordionContext } from './AccordionContext';

// ===== TYPES =====
export interface AccordionProps {
  children: React.ReactNode;
  /** Selection mode - single allows one item open, multiple allows many */
  selectionMode?: 'single' | 'multiple';
  /** Default expanded keys (uncontrolled) */
  defaultExpandedKeys?: string[];
  /** Controlled expanded keys */
  expandedKeys?: string[];
  /** Callback when selection changes */
  onSelectionChange?: (keys: string[]) => void;
  /** Optional className */
  className?: string;
}

// ===== ACCORDION COMPONENT =====
export const Accordion: React.FC<AccordionProps> = ({
  children,
  selectionMode = 'single',
  defaultExpandedKeys = [],
  expandedKeys: controlledKeys,
  onSelectionChange,
  className
}) => {
  const [internalKeys, setInternalKeys] = useState<Set<string>>(
    new Set(defaultExpandedKeys)
  );

  // Use controlled or uncontrolled state
  const expandedKeys = controlledKeys
    ? new Set(controlledKeys)
    : internalKeys;

  const toggleKey = (key: string) => {
    const newKeys = new Set(expandedKeys);

    if (newKeys.has(key)) {
      newKeys.delete(key);
    } else {
      if (selectionMode === 'single') {
        newKeys.clear();
      }
      newKeys.add(key);
    }

    // Update state
    if (!controlledKeys) {
      setInternalKeys(newKeys);
    }

    // Notify parent
    onSelectionChange?.(Array.from(newKeys));
  };

  return (
    <AccordionContext.Provider value={{ expandedKeys, toggleKey, selectionMode }}>
      <div className={cn('accordion', className)}>
        {children}
      </div>
    </AccordionContext.Provider>
  );
};
