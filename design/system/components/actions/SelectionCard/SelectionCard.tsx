// ===============================================
// design/system/components/actions/SelectionCard/SelectionCard.tsx
// ✅ UNIFIED SELECTION CARD - Replaces RadioCard, CheckboxCard, and selection patterns
// ===============================================

import React, { forwardRef, useId } from 'react';
import { cn } from '../../../utils/cn';
import './SelectionCard.css';

// ===== TYPE DEFINITIONS =====

export type SelectionCardOrientation = 'horizontal' | 'vertical';
export type SelectionCardSize = 'sm' | 'md' | 'lg';
export type SelectionCardIndicator = 'none' | 'checkbox' | 'radio';
export type SelectionCardVariant = 'neutral' | 'accent';

export interface SelectionCardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  children: React.ReactNode;

  // Selection state
  selected?: boolean;
  onChange?: (selected: boolean) => void;
  disabled?: boolean;

  // Visual indicator
  indicator?: SelectionCardIndicator;

  // Layout
  orientation?: SelectionCardOrientation;
  size?: SelectionCardSize;
  variant?: SelectionCardVariant;

  // Radio-specific (for form groups)
  name?: string;
  value?: string;

  // Accessibility
  'aria-label'?: string;
  'aria-describedby'?: string;

  className?: string;
}

/**
 * SelectionCard - Unified component for ALL selection scenarios
 *
 * ✅ Replaces: RadioCard, CheckboxCard, and custom selection patterns
 *
 * Use cases:
 * - Theme pickers (color swatches)
 * - Page/section selectors
 * - Dashboard layout pickers
 * - Any grid-based selection interface
 *
 * @example
 * // Single select (visual only, no indicator)
 * <SelectionCard
 *   selected={theme === 'ocean'}
 *   onClick={() => setTheme('ocean')}
 * >
 *   <VStack spacing="sm" align="center">
 *     <div style={{ width: 40, height: 40, background: 'blue', borderRadius: '50%' }} />
 *     <Body>Ocean Theme</Body>
 *   </VStack>
 * </SelectionCard>
 *
 * @example
 * // Multi-select with checkbox
 * <SelectionCard
 *   selected={selected.includes('hero')}
 *   onChange={(checked) => toggleSection('hero', checked)}
 *   indicator="checkbox"
 * >
 *   <Icon><SparklesIcon /></Icon>
 *   <H5>Hero Section</H5>
 *   <Body size="sm">Eye-catching header</Body>
 * </SelectionCard>
 *
 * @example
 * // Single select with radio (form group)
 * <SelectionCard
 *   selected={plan === 'pro'}
 *   onChange={() => setPlan('pro')}
 *   indicator="radio"
 *   name="plan"
 *   value="pro"
 * >
 *   <H4>Pro Plan</H4>
 *   <Body>$29/month</Body>
 * </SelectionCard>
 *
 * @example
 * // Horizontal layout with icon
 * <SelectionCard
 *   selected={page === 'about'}
 *   onClick={() => setPage('about')}
 *   orientation="horizontal"
 * >
 *   <Icon><InformationCircleIcon /></Icon>
 *   <VStack spacing="xs">
 *     <Body weight="medium">About Page</Body>
 *     <Body size="sm" color="secondary">Company info</Body>
 *   </VStack>
 * </SelectionCard>
 */
export const SelectionCard = forwardRef<HTMLDivElement, SelectionCardProps>(({
  children,
  selected = false,
  onChange,
  disabled = false,
  indicator = 'none',
  orientation = 'vertical',
  size = 'md',
  variant = 'neutral',
  name,
  value,
  className,
  id: providedId,
  onClick,
  ...props
}, ref) => {
  const generatedId = useId();
  const id = providedId || generatedId;
  const inputId = `${id}-input`;

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (disabled) return;

    // Don't trigger if clicking directly on the input
    const target = e.target as HTMLElement;
    if (target.closest('input[type="checkbox"], input[type="radio"]')) return;

    if (indicator === 'radio') {
      // Radio behavior: only trigger if not already selected
      if (!selected) {
        onChange?.(true);
      }
    } else {
      // Checkbox/none behavior: toggle
      onChange?.(!selected);
    }

    onClick?.(e);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (disabled) return;

    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();

      if (indicator === 'radio') {
        if (!selected) {
          onChange?.(true);
        }
      } else {
        onChange?.(!selected);
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;

    if (indicator === 'checkbox') {
      onChange?.(e.target.checked);
    } else if (indicator === 'radio') {
      if (e.target.checked) {
        onChange?.(true);
      }
    }
  };

  // Determine ARIA role
  const getRole = () => {
    if (indicator === 'checkbox') return 'checkbox';
    if (indicator === 'radio') return 'radio';
    return 'button';
  };

  return (
    <div
      ref={ref}
      id={id}
      role={getRole()}
      aria-checked={indicator !== 'none' ? selected : undefined}
      aria-pressed={indicator === 'none' ? selected : undefined}
      aria-disabled={disabled}
      tabIndex={disabled ? -1 : 0}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={cn(
        'selection-card',
        `selection-card--${size}`,
        `selection-card--${orientation}`,
        `selection-card--${variant}`,
        `selection-card--indicator-${indicator}`,
        selected && 'selection-card--selected',
        disabled && 'selection-card--disabled',
        className
      )}
      {...props}
    >
      {/* Content area */}
      <div className="selection-card__content">
        {children}
      </div>

      {/* Indicator (checkbox or radio) */}
      {indicator !== 'none' && (
        <div className="selection-card__indicator">
          <input
            id={inputId}
            type={indicator}
            name={name}
            value={value}
            checked={selected}
            onChange={handleInputChange}
            disabled={disabled}
            tabIndex={-1} // Remove from tab order since card is focusable
            className="selection-card__input"
            aria-hidden="true"
          />
        </div>
      )}
    </div>
  );
});

SelectionCard.displayName = 'SelectionCard';
