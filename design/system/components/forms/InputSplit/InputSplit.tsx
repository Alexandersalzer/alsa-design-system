'use client';

/**
 * InputSplit
 *
 * A text input with an attached picker dropdown on the trailing side.
 * Useful for value + unit inputs (e.g. "1.5  [×  ▾]" for playback speed,
 * "100  [px  ▾]" for dimensions, etc.)
 *
 * Usage:
 *   <InputSplit
 *     value="1.5"
 *     onValueChange={(v) => setVal(v)}
 *     pickerValue="x"
 *     onPickerChange={(v) => setUnit(v)}
 *     pickerOptions={[
 *       { value: '0.5x', label: '0.5×' },
 *       { value: '1x',   label: '1×' },
 *       { value: '1.5x', label: '1.5×' },
 *       { value: '2x',   label: '2×' },
 *     ]}
 *   />
 */

import React, { forwardRef, useId, useState, useRef, useEffect } from 'react';
import { ChevronDownIcon, CheckIcon } from '@heroicons/react/24/solid';
import { cn } from '../../../utils/cn';
import { Listbox, ListboxItem } from '../../lists';
import './InputSplit.css';

export interface InputSplitOption {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
}

export interface InputSplitProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'onChange'> {
  /** Current text input value */
  value?: string;
  /** Called when the text input changes */
  onValueChange?: (value: string) => void;
  /** Currently selected picker value */
  pickerValue?: string | null;
  /** Called when the picker selection changes */
  onPickerChange?: (value: string) => void;
  /** Options for the picker dropdown */
  pickerOptions: InputSplitOption[];
  /** Placeholder label shown in the picker trigger when nothing is selected */
  pickerPlaceholder?: string;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  /** Accessible label for the picker trigger */
  pickerLabel?: string;
  className?: string;
  label?: string;
  error?: string;
}

export const InputSplit = forwardRef<HTMLInputElement, InputSplitProps>(({
  value,
  onValueChange,
  pickerValue,
  onPickerChange,
  pickerOptions,
  pickerPlaceholder = '—',
  size = 'md',
  disabled = false,
  pickerLabel = 'Select option',
  className,
  label,
  error,
  ...inputProps
}, ref) => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const id = useId();

  const selectedOption = pickerOptions.find((o) => o.value === pickerValue);
  const pickerDisplay = selectedOption?.label ?? pickerPlaceholder;

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handle = (e: MouseEvent) => {
      if (containerRef.current?.contains(e.target as Node)) return;
      setOpen(false);
    };
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handle = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', handle);
    return () => document.removeEventListener('keydown', handle);
  }, [open]);

  return (
    <div className={cn('input-split-wrapper', className)}>
      {label && (
        <label htmlFor={`${id}-input`} className="input-split__label">
          {label}
        </label>
      )}

      <div
        ref={containerRef}
        className={cn(
          'input-split',
          `input-split--${size}`,
          disabled && 'input-split--disabled',
          error && 'input-split--error',
        )}
      >
        {/* Text input */}
        <input
          ref={ref}
          id={`${id}-input`}
          className="input-split__input"
          value={value ?? ''}
          onChange={(e) => onValueChange?.(e.target.value)}
          disabled={disabled}
          {...inputProps}
        />

        {/* Divider */}
        <div className="input-split__divider" aria-hidden="true" />

        {/* Picker trigger */}
        <button
          type="button"
          className={cn('input-split__picker-trigger', open && 'input-split__picker-trigger--open')}
          onClick={() => setOpen((v) => !v)}
          disabled={disabled}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={`${id}-menu`}
          aria-label={pickerLabel}
        >
          <span className="input-split__picker-value">{pickerDisplay}</span>
          <ChevronDownIcon
            className={cn('input-split__chevron', open && 'input-split__chevron--open')}
          />
        </button>

        {/* Dropdown */}
        {open && (
          <div
            id={`${id}-menu`}
            className="input-split__menu"
            role="listbox"
          >
            <Listbox spacing="xs" surface="raised">
              {pickerOptions.map((opt) => (
                <ListboxItem
                  key={opt.value}
                  role="option"
                  size={size === 'lg' ? 'md' : 'sm'}
                  disabled={opt.disabled}
                  selected={opt.value === pickerValue}
                  trailing={
                    opt.value === pickerValue ? (
                      <CheckIcon style={{ width: 14, height: 14, color: 'var(--color-primary)' }} />
                    ) : undefined
                  }
                  onClick={() => {
                    if (opt.disabled) return;
                    onPickerChange?.(opt.value);
                    setOpen(false);
                  }}
                >
                  <div className="input-split__menu-item">
                    <span className="input-split__menu-label">{opt.label}</span>
                    {opt.description && (
                      <span className="input-split__menu-desc">{opt.description}</span>
                    )}
                  </div>
                </ListboxItem>
              ))}
            </Listbox>
          </div>
        )}
      </div>

      {error && (
        <div className="input-split__error" role="alert">{error}</div>
      )}
    </div>
  );
});

InputSplit.displayName = 'InputSplit';
