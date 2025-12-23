// ===============================================
// Accordion Component
// Vertically stacked collapsible sections
// ===============================================

import React, { useState } from 'react';
import { cn } from '../../../utils/cn';
import { AccordionContext } from './AccordionContext';

// ===== TYPES =====
export type AccordionRadius = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
export type AccordionRadiusMode = 'edges' | 'all' | 'none';
export type AccordionVariant = 'default' | 'separated' | 'bordered' | 'sunken' | 'borderless';
export type AccordionGap = 'none' | 'xs' | 'sm' | 'md' | 'lg';

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

  /** Border radius size */
  radius?: AccordionRadius;

  /** How radius is applied - edges (first/last only), all (every item), none */
  radiusMode?: AccordionRadiusMode;

  /** Visual variant */
  variant?: AccordionVariant;

  /** Gap between items (only applies to 'separated' variant) */
  gap?: AccordionGap;

  /** Show/hide chevron indicators on all items */
  showIndicator?: boolean;

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
  radius = 'sm',
  radiusMode = 'edges',
  variant = 'default',
  gap = 'xs',
  showIndicator = true,
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
    <AccordionContext.Provider
      value={{
        expandedKeys,
        toggleKey,
        selectionMode,
        radius,
        radiusMode,
        variant,
        showIndicator
      }}
    >
      <div
        className={cn(
          'accordion',
          `accordion--${variant}`,
          `accordion--gap-${gap}`,
          `accordion--radius-${radius}`,
          `accordion--radius-mode-${radiusMode}`,
          className
        )}
      >
        {children}
      </div>
    </AccordionContext.Provider>
  );
};
