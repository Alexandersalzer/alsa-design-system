// ===============================================
// src/design-system/components/primitives/Listbox/ListboxItem.tsx
// INTERACTIVE LIST ITEM - Flexible composition pattern
// ===============================================

import React, { 
  forwardRef,
  type ReactNode,
  type HTMLAttributes,
  type MouseEvent
} from 'react';
import { cn } from '../../../utils/cn';

// ===============================================
// TYPES & INTERFACES
// ===============================================

export type ListboxItemSize = 'sm' | 'md' | 'lg';

export interface ListboxItemProps extends Omit<HTMLAttributes<HTMLLIElement>, 'role'> {
  children: ReactNode;
  leading?: ReactNode;
  trailing?: ReactNode;
  size?: ListboxItemSize;
  selected?: boolean;
  disabled?: boolean;
  focused?: boolean;
  interactive?: boolean;
  onClick?: (event: MouseEvent<HTMLLIElement>) => void;
  className?: string;
  role?: 'listitem' | 'option' | 'menuitem' | 'menuitemcheckbox' | 'menuitemradio';
  'aria-selected'?: boolean;
  'aria-checked'?: boolean;
  'aria-disabled'?: boolean;
}

// ===============================================
// LISTBOX ITEM COMPONENT
// ===============================================

export const ListboxItem = forwardRef<HTMLLIElement, ListboxItemProps>(({
  children,
  leading,
  trailing,
  size = 'md',
  selected = false,
  disabled = false,
  focused = false,
  interactive = true,
  onClick,
  className,
  role = 'option',
  ...props
}, ref) => {
  const handleClick = (e: MouseEvent<HTMLLIElement>) => {
    if (disabled) return;
    onClick?.(e);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLLIElement>) => {
    if (disabled) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick?.(e as any);
    }
  };

  // Fix: Convert to boolean explicitly
  const hasAccessories = Boolean(leading || trailing);

  return (
    <li
      ref={ref}
      role={role}
      tabIndex={disabled ? -1 : interactive ? 0 : -1}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      aria-selected={props['aria-selected'] ?? (selected ? true : undefined)}
      aria-checked={props['aria-checked']}
      aria-disabled={disabled}
      className={cn(
        'listbox-item',
        `listbox-item--${size}`,
        selected && 'listbox-item--selected',
        disabled && 'listbox-item--disabled',
        focused && 'listbox-item--focused',
        interactive && 'listbox-item--interactive',
        hasAccessories && 'listbox-item--with-accessories',
        className
      )}
      {...props}
    >
      {leading && (
        <div className={cn('listbox-item-leading', `listbox-item-leading--${size}`)}>
          {leading}
        </div>
      )}
      
      <div className={cn('listbox-item-content', `listbox-item-content--${size}`)}>
        {children}
      </div>
      
      {trailing && (
        <div className={cn('listbox-item-trailing', `listbox-item-trailing--${size}`)}>
          {trailing}
        </div>
      )}
    </li>
  );
});

ListboxItem.displayName = 'ListboxItem';