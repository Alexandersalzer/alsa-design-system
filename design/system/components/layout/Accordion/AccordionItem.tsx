// ===============================================
// AccordionItem Component
// Individual collapsible item within Accordion
// ===============================================

import React from 'react';
import { cn } from '../../../utils/cn';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { useAccordionContext } from './AccordionContext';

// ===== TYPES =====
export interface AccordionItemProps {
  /** Unique key for this item */
  itemKey: string;
  /** Title content */
  title: React.ReactNode;
  /** Optional subtitle */
  subtitle?: React.ReactNode;
  /** Content to show when expanded */
  children: React.ReactNode;
  /** Optional start content (icon, avatar, etc.) */
  startContent?: React.ReactNode;
  /** Disabled state */
  disabled?: boolean;
  /** Override indicator visibility for this item */
  disableIndicator?: boolean;
  /** Optional className */
  className?: string;
}

// ===== ACCORDION ITEM COMPONENT =====
export const AccordionItem: React.FC<AccordionItemProps> = ({
  itemKey,
  title,
  subtitle,
  children,
  startContent,
  disabled = false,
  disableIndicator = false,
  className
}) => {
  const { expandedKeys, toggleKey, showIndicator } = useAccordionContext();
  const isExpanded = expandedKeys.has(itemKey);
  const shouldShowIndicator = showIndicator && !disableIndicator;

  const handleToggle = () => {
    if (!disabled) {
      toggleKey(itemKey);
    }
  };

  return (
    <div
      className={cn(
        'accordion-item',
        isExpanded && 'accordion-item--expanded',
        disabled && 'accordion-item--disabled',
        className
      )}
    >
      {/* Header (trigger) */}
      <button
        type="button"
        className="accordion-item__trigger"
        onClick={handleToggle}
        disabled={disabled}
        aria-expanded={isExpanded}
        aria-disabled={disabled}
      >
        {/* Start content */}
        {startContent && (
          <div className="accordion-item__start-content">
            {startContent}
          </div>
        )}

        {/* Title and subtitle */}
        <div className="accordion-item__title-wrapper">
          <div className="accordion-item__title">{title}</div>
          {subtitle && (
            <div className="accordion-item__subtitle">{subtitle}</div>
          )}
        </div>

        {/* Chevron indicator */}
        {shouldShowIndicator && (
          <div
            className={cn(
              'accordion-item__indicator',
              isExpanded && 'accordion-item__indicator--expanded'
            )}
          >
            <ChevronDownIcon />
          </div>
        )}
      </button>

      {/* Content */}
      {isExpanded && (
        <div className="accordion-item__content">
          {children}
        </div>
      )}
    </div>
  );
};
