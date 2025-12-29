// ===============================================
// AccordionItem Component
// Individual collapsible item within Accordion
// ===============================================

import React, { useRef, useEffect } from 'react';
import { cn } from '../../../utils/cn';
import { ChevronDownIcon, PlusIcon } from '@heroicons/react/24/outline';
import { useAccordionContext } from './AccordionContext';
import { Label, Body } from '../../Typography';

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
  /** Custom indicator icon (replaces default chevron/plus) */
  indicatorIcon?: React.ReactNode;
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
  indicatorIcon,
  className
}) => {
  const { expandedKeys, toggleKey, showIndicator } = useAccordionContext();
  const isExpanded = expandedKeys.has(itemKey);
  const shouldShowIndicator = showIndicator && !disableIndicator;
  const contentRef = useRef<HTMLDivElement>(null);

  const handleToggle = () => {
    if (!disabled) {
      toggleKey(itemKey);
    }
  };

  // Dynamic maxHeight calculation based on content - like the HTML/CSS version
  useEffect(() => {
    const contentEl = contentRef.current;
    if (!contentEl) return;

    if (isExpanded) {
      // Temporarily remove overflow to measure full height
      const originalOverflow = contentEl.style.overflow;
      contentEl.style.overflow = 'visible';
      const height = contentEl.scrollHeight;
      contentEl.style.overflow = originalOverflow;

      // Start from 0
      contentEl.style.maxHeight = '0';

      // Animate to full height in next frame
      requestAnimationFrame(() => {
        contentEl.style.maxHeight = height + 'px';
      });
    } else {
      contentEl.style.maxHeight = '0';
    }
  }, [isExpanded, children]);

  // Default indicator icon (chevron)
  const defaultIndicator = <ChevronDownIcon />;
  const indicatorElement = indicatorIcon || defaultIndicator;

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

        {/* Title and subtitle using Typography */}
        <div className="accordion-item__title-wrapper">
          <Label size="md" weight="semibold" color="primary" as="div">
            {title}
          </Label>
          {subtitle && (
            <Body size="sm" color="secondary" as="div">
              {subtitle}
            </Body>
          )}
        </div>

        {/* Indicator icon */}
        {shouldShowIndicator && (
          <div
            className={cn(
              'accordion-item__indicator',
              isExpanded && 'accordion-item__indicator--expanded'
            )}
          >
            {indicatorElement}
          </div>
        )}
      </button>

      {/* Content - always rendered for smooth height transitions */}
      <div
        ref={contentRef}
        className="accordion-item__content"
      >
        {children}
      </div>
    </div>
  );
};
