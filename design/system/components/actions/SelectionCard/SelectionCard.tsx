// ===============================================
// design/system/components/actions/SelectionCard/SelectionCard.tsx
// ✅ UNIFIED SELECTION CARD - Replaces RadioCard, CheckboxCard, and selection patterns
// ===============================================

import React, { forwardRef, useId, useEffect, useState } from 'react';
import { cn } from '../../../utils/cn';
import { Checkbox } from '../../forms/Checkbox/Checkbox';
import { Radio } from '../../forms/Radio/Radio';
import './SelectionCard.css';

// ===== TYPE DEFINITIONS =====

export type SelectionCardOrientation = 'horizontal' | 'vertical';
export type SelectionCardSize = 'sm' | 'md' | 'lg';
export type SelectionCardIndicator = 'none' | 'checkbox' | 'radio';
export type SelectionCardVariant = 'neutral' | 'accent';

export interface SelectionCardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  children?: React.ReactNode;
  /** Text label rendered as content when no children are provided */
  label?: string;

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

// ===== RADIO GROUP REGISTRY =====
// Module-level shared state for uncontrolled radio groups.
// Cards with the same `name` coordinate through this registry.

type GroupStore = {
  selected: string | null;
  listeners: Set<(selected: string | null) => void>;
  select: (id: string) => void;
};

const radioGroupRegistry: Record<string, GroupStore> = {};

function getOrCreateGroup(name: string): GroupStore {
  if (!radioGroupRegistry[name]) {
    const listeners = new Set<(selected: string | null) => void>();
    radioGroupRegistry[name] = {
      selected: null,
      listeners,
      select(id: string) {
        radioGroupRegistry[name].selected = id;
        listeners.forEach(fn => fn(id));
      },
    };
  }
  return radioGroupRegistry[name];
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
 */
export const SelectionCard = forwardRef<HTMLDivElement, SelectionCardProps>(({
  children,
  label,
  selected: selectedProp,
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
  // Use value prop as the stable key (avoids StrictMode double-mount id mismatch)
  // Fall back to id only if value is not set
  const cardKey = value ?? id;

  const isControlled = onChange !== undefined || selectedProp !== undefined;

  // Uncontrolled radio group state — only used when indicator='radio', name is set, and not controlled
  const [groupSelected, setGroupSelected] = useState<string | null>(null);

  useEffect(() => {
    if (isControlled || indicator !== 'radio' || !name) return;
    const group = getOrCreateGroup(name);
    // Sync initial state
    setGroupSelected(group.selected);
    // Subscribe to changes
    const listener = (sel: string | null) => setGroupSelected(sel);
    group.listeners.add(listener);
    return () => { group.listeners.delete(listener); };
  }, [isControlled, indicator, name]);

  // Resolve final selected state
  let selected: boolean;
  if (isControlled) {
    selected = selectedProp ?? false;
  } else if (indicator === 'radio' && name) {
    selected = groupSelected === cardKey;
  } else {
    // checkbox / none without external state: use local toggle (handled below)
    selected = selectedProp ?? false;
  }

  // Local toggle state for checkbox/none uncontrolled
  const [localSelected, setLocalSelected] = useState(selectedProp ?? false);
  const effectiveSelected = (indicator !== 'radio' && !isControlled) ? localSelected : selected;

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (disabled) return;

    const target = e.target as HTMLElement;
    if (target.closest('input[type="checkbox"], input[type="radio"]')) return;

    if (indicator === 'radio') {
      if (!effectiveSelected) {
        onChange?.(true);
        if (!isControlled && name) {
          getOrCreateGroup(name).select(cardKey);
        }
      }
    } else {
      onChange?.(!effectiveSelected);
      if (!isControlled) setLocalSelected(s => !s);
    }

    onClick?.(e);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (disabled) return;
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      if (indicator === 'radio') {
        if (!effectiveSelected) {
          onChange?.(true);
          if (!isControlled && name) {
            getOrCreateGroup(name).select(cardKey);
          }
        }
      } else {
        onChange?.(!effectiveSelected);
        if (!isControlled) setLocalSelected(s => !s);
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;
    if (indicator === 'checkbox') {
      onChange?.(e.target.checked);
      if (!isControlled) setLocalSelected(e.target.checked);
    } else if (indicator === 'radio') {
      if (e.target.checked) {
        onChange?.(true);
        if (!isControlled && name) {
          getOrCreateGroup(name).select(cardKey);
        }
      }
    }
  };

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
      aria-checked={indicator !== 'none' ? effectiveSelected : undefined}
      aria-pressed={indicator === 'none' ? effectiveSelected : undefined}
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
        effectiveSelected && 'selection-card--selected',
        disabled && 'selection-card--disabled',
        className
      )}
      {...props}
    >
      {/* Content area */}
      <div className="selection-card__content">
        {children ?? (label ? <span>{label}</span> : null)}
      </div>

      {/* Indicator (checkbox or radio) */}
      {indicator === 'checkbox' && (
        <div className="selection-card__indicator">
          <Checkbox
            id={inputId}
            checked={effectiveSelected}
            onChange={handleInputChange}
            disabled={disabled}
            tabIndex={-1}
            aria-hidden="true"
            wrapperClassName="selection-card__checkbox-wrapper"
          />
        </div>
      )}

      {indicator === 'radio' && (
        <div className="selection-card__indicator">
          <Radio
            id={inputId}
            name={name}
            value={value}
            checked={effectiveSelected}
            onChange={handleInputChange}
            disabled={disabled}
            tabIndex={-1}
            aria-hidden="true"
            wrapperClassName="selection-card__radio-wrapper"
          />
        </div>
      )}
    </div>
  );
});

SelectionCard.displayName = 'SelectionCard';
