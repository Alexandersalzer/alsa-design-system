'use client';

/**
 * SplitButton
 *
 * A button with a primary action on the left and a chevron trigger on the right
 * that opens a dropdown of additional options.
 *
 * Usage:
 *   <SplitButton
 *     onClick={() => save()}
 *     options={[
 *       { value: 'save', label: 'Save', onClick: () => save() },
 *       { value: 'save-deploy', label: 'Save & Deploy', onClick: () => saveDeploy() },
 *     ]}
 *   >
 *     Save
 *   </SplitButton>
 */

import React, { useState, useRef, useEffect, useId } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/solid';
import { cn } from '../../../utils/cn';
import { Label } from '../../Typography/Typography';
import { Listbox, ListboxItem } from '../../lists';
import './SplitButton.css';

export interface SplitButtonOption {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
  onClick?: () => void;
}

export interface SplitButtonProps {
  /** Primary button label */
  children: React.ReactNode;
  /** Options in the dropdown */
  options: SplitButtonOption[];
  /** Primary button click handler */
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'accent';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  /** Dropdown alignment relative to the trigger */
  menuAlignment?: 'bottom-start' | 'bottom-end';
  className?: string;
  /** Accessible label for the chevron trigger */
  menuButtonLabel?: string;
}

export const SplitButton: React.FC<SplitButtonProps> = ({
  children,
  options,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  menuAlignment = 'bottom-end',
  className,
  menuButtonLabel = 'More options',
}) => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const id = useId();

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

  const isDisabled = disabled || loading;

  const labelSize: 'sm' | 'md' | 'lg' =
    size === 'sm' ? 'sm' : size === 'lg' ? 'lg' : 'md';
  const labelWeight = size === 'sm' || size === 'md' ? 'semibold' : 'bold';

  return (
    <div
      ref={containerRef}
      className={cn('split-btn', `split-btn--${variant}`, `split-btn--${size}`, className)}
    >
      {/* Primary action */}
      <button
        type="button"
        className={cn('split-btn__primary', isDisabled && 'split-btn__primary--disabled')}
        onClick={onClick}
        disabled={isDisabled}
        aria-disabled={isDisabled}
      >
        <Label size={labelSize} weight={labelWeight} as="span" className="split-btn__label">
          {children}
        </Label>
      </button>

      {/* Divider */}
      <div className="split-btn__divider" aria-hidden="true" />

      {/* Chevron trigger */}
      <button
        type="button"
        className={cn('split-btn__trigger', isDisabled && 'split-btn__trigger--disabled')}
        onClick={() => setOpen((v) => !v)}
        disabled={isDisabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={`${id}-menu`}
        aria-label={menuButtonLabel}
      >
        <ChevronDownIcon
          className={cn('split-btn__chevron', open && 'split-btn__chevron--open')}
        />
      </button>

      {/* Dropdown */}
      {open && (
        <div
          ref={menuRef}
          id={`${id}-menu`}
          className={cn(
            'split-btn__menu',
            `split-btn__menu--${menuAlignment}`
          )}
          role="listbox"
        >
          <Listbox spacing="xs">
            {options.map((opt) => (
              <ListboxItem
                key={opt.value}
                role="option"
                size={size === 'lg' ? 'md' : 'sm'}
                disabled={opt.disabled}
                onClick={() => {
                  if (opt.disabled) return;
                  opt.onClick?.();
                  setOpen(false);
                }}
              >
                <div className="split-btn__menu-item">
                  <span className="split-btn__menu-label">{opt.label}</span>
                  {opt.description && (
                    <span className="split-btn__menu-desc">{opt.description}</span>
                  )}
                </div>
              </ListboxItem>
            ))}
          </Listbox>
        </div>
      )}
    </div>
  );
};

SplitButton.displayName = 'SplitButton';
