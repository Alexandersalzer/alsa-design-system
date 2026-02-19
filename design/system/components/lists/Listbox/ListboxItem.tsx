// ===============================================
// src/design-system/components/primitives/Listbox/ListboxItem.tsx
// ✅ SINGLE SOURCE OF TRUTH FOR INTERACTIVE LIST ITEMS
// Use this for: domains, notifications, news, selections, any clickable list
// ===============================================

import React, {
  forwardRef,
  type ReactNode,
  type HTMLAttributes,
  type MouseEvent,
  useState
} from 'react';
import { cn } from '../../../utils/cn';

// ===============================================
// TYPES & INTERFACES
// ===============================================

export type ListboxItemSize = 'sm' | 'md' | 'lg';

/**
 * Visual variants for ListboxItem
 * - default: Flat, transparent background (standard list item)
 * - card: Subtle border + elevated background (for grid/card layouts)
 */
export type ListboxItemVariant = 'default' | 'card';

export interface ListboxItemProps extends Omit<HTMLAttributes<HTMLLIElement>, 'role'> {
  children: ReactNode;

  /** Content to display before the main content (e.g., icon, avatar) */
  leading?: ReactNode;

  /** Content to display after the main content (e.g., chevron, button) */
  trailing?: ReactNode;

  /** Size of the item */
  size?: ListboxItemSize;

  /** Visual style variant */
  variant?: ListboxItemVariant;

  /** Whether the item is selected */
  selected?: boolean;

  /** Whether the item is disabled */
  disabled?: boolean;

  /** Whether the item is focused (programmatically) */
  focused?: boolean;

  /** Whether the item is interactive (clickable) */
  interactive?: boolean;

  /** Click handler */
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

/**
 * ListboxItem - Single source of truth for interactive list items
 *
 * ✅ Use this component for ALL clickable list items:
 * - Domain lists
 * - Notification lists
 * - News/article lists
 * - Selection lists (pages, sections, etc.)
 * - Navigation lists
 * - Settings lists
 *
 * @example
 * // Simple list item
 * <ListboxItem onClick={() => handleClick()}>
 *   <Body>Click me</Body>
 * </ListboxItem>
 *
 * @example
 * // With leading icon and trailing chevron
 * <ListboxItem
 *   leading={<Icon><ServerIcon /></Icon>}
 *   trailing={<Icon><ChevronRightIcon /></Icon>}
 *   onClick={() => navigate()}
 * >
 *   <VStack spacing="xs">
 *     <H4>example.com</H4>
 *     <Body size="sm" color="secondary">Ready to activate</Body>
 *   </VStack>
 * </ListboxItem>
 *
 * @example
 * // Card variant (with border + elevated bg)
 * <ListboxItem
 *   variant="card"
 *   selected={isSelected}
 *   onClick={() => toggle()}
 * >
 *   <Body>Selectable card</Body>
 * </ListboxItem>
 */
export const ListboxItem = forwardRef<HTMLLIElement, ListboxItemProps>(({
  children,
  leading,
  trailing,
  size = 'md',
  variant = 'default',
  selected = false,
  disabled = false,
  focused = false,
  interactive = true,
  onClick,
  className,
  role = 'option',
  ...props
}, ref) => {
  const [isPressing, setIsPressing] = useState(false);

  const handleMouseDown = (e: MouseEvent<HTMLLIElement>) => {
    if (disabled || selected) return;

    // Set pressing state immediately to show active surface
    setIsPressing(true);

    // Delay onClick to allow the pressed state to render
    setTimeout(() => {
      onClick?.(e);
      // Clear pressing state after onClick
      setIsPressing(false);
    }, 100); // 100ms delay to show the pressed surface
  };

  const handleMouseUp = () => {
    setIsPressing(false);
  };

  const handleMouseLeave = () => {
    setIsPressing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLLIElement>) => {
    if (disabled) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick?.(e as any);
    }
  };

  const hasAccessories = Boolean(leading || trailing);

  return (
    <li
      ref={ref}
      role={role}
      tabIndex={disabled ? -1 : interactive ? 0 : -1}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      onKeyDown={handleKeyDown}
      aria-selected={props['aria-selected'] ?? (selected ? true : undefined)}
      aria-checked={props['aria-checked']}
      aria-disabled={disabled}
      className={cn(
        'listbox-item',
        `listbox-item--${size}`,
        `listbox-item--variant-${variant}`,
        selected && 'listbox-item--selected',
        disabled && 'listbox-item--disabled',
        focused && 'listbox-item--focused',
        interactive && 'listbox-item--interactive',
        isPressing && 'listbox-item--pressing',
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