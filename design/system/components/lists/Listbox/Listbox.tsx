// ===============================================
// src/design-system/components/primitives/Listbox/Listbox.tsx
// INTERACTIVE SELECTION LIST - Used by Menu, Picker, etc.
// ===============================================

import React, { 
  forwardRef,
  type ReactNode,
  type HTMLAttributes
} from 'react';
import { cn } from '../../../utils/cn';
import './Listbox.css';

// ===============================================
// TYPES & INTERFACES
// ===============================================

export type ListboxSize = 'sm' | 'md' | 'lg';
export type ListboxVariant = 'default' | 'bordered' | 'separated';
export type ListboxSpacing = 'none' | 'xs' | 'sm' | 'md' | 'lg';
export type ListboxSurface = 'page' | 'raised' | 'elevated';

export interface ListboxProps extends Omit<HTMLAttributes<HTMLUListElement>, 'role'> {
  children: ReactNode;
  size?: ListboxSize;
  variant?: ListboxVariant;
  spacing?: ListboxSpacing;
  dividers?: boolean;
  className?: string;
  role?: 'list' | 'listbox' | 'menu';
  /** Surface level for proper hover hierarchy */
  surface?: ListboxSurface;
}

// ===============================================
// LISTBOX COMPONENT
// ===============================================

export const Listbox = forwardRef<HTMLUListElement, ListboxProps>(({
  children,
  size = 'md',
  variant = 'default',
  spacing = 'sm',
  dividers = false,
  className,
  role = 'listbox',
  surface,
  ...props
}, ref) => {
  return (
    <ul
      ref={ref}
      role={role}
      className={cn(
        'listbox',
        `listbox--${size}`,
        `listbox--${variant}`,
        `listbox--spacing-${spacing}`,
        dividers && 'listbox--dividers',
        surface && `listbox--surface-${surface}`,
        className
      )}
      {...props}
    >
      {children}
    </ul>
  );
});

Listbox.displayName = 'Listbox';