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
  children?: React.ReactNode;
  /** Content alias (for localized content compatibility) */
  content?: React.ReactNode;
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
  content,
  startContent,
  disabled = false,
  disableIndicator = false,
  indicatorIcon,
  className
}) => {
  // Use content if provided, otherwise use children
  const itemContent = content || children;
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
      // Get computed style to read CSS variables from root
      const rootStyle = getComputedStyle(document.documentElement);
      const paddingTopValue = rootStyle.getPropertyValue('--foundation-space-2').trim() || '8px';
      const paddingBottomValue = rootStyle.getPropertyValue('--foundation-space-4').trim() || '16px';

      // Set expanded state immediately without measuring first
      contentEl.style.transition = 'none';
      contentEl.style.paddingTop = paddingTopValue;
      contentEl.style.paddingBottom = paddingBottomValue;
      contentEl.style.maxHeight = 'none';
      contentEl.style.overflow = 'visible';

      // Force reflow and measure
      void contentEl.offsetHeight;
      const height = contentEl.scrollHeight;

      // Reset overflow back to hidden for animation
      contentEl.style.overflow = 'hidden';
      contentEl.style.maxHeight = '0';
      contentEl.style.opacity = '0';
      contentEl.style.transform = 'translateY(-10px)';

      // Force reflow
      void contentEl.offsetHeight;

      // Re-enable transitions
      contentEl.style.transition = '';

      // Animate to full height with a small delay
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          contentEl.style.maxHeight = height + 'px';
          contentEl.style.opacity = '1';
          contentEl.style.transform = 'translateY(0)';
          contentEl.style.paddingTop = paddingTopValue;
          contentEl.style.paddingBottom = paddingBottomValue;
        });
      });
    } else {
      contentEl.style.maxHeight = '0';
      contentEl.style.opacity = '0';
      contentEl.style.transform = 'translateY(-10px)';
      contentEl.style.paddingTop = '0';
      contentEl.style.paddingBottom = '0';
      contentEl.style.overflow = 'hidden';
    }
  }, [isExpanded]);

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
        {itemContent}
      </div>
    </div>
  );
};
