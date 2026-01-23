// ===============================================
// src/design-system/components/primitives/Menu/Menu.tsx
// FIXED - No double trigger background
// ===============================================

import React, {
  useState,
  createContext,
  useContext,
  forwardRef,
  type ReactNode
} from 'react';
import { cn } from '../../../utils/cn';
import { Icon } from '../../media';
import { CheckIcon, ChevronDownIcon } from '@heroicons/react/24/solid';
import { Popover } from '../Popover';
import { Listbox, ListboxItem } from '../../lists';
import './Menu.css';

// ===============================================
// TYPES & INTERFACES
// ===============================================

export type MenuSize = 'sm' | 'md' | 'lg';
export type MenuVariant = 'subtle' | 'solid';
export type MenuColorPalette = 'gray' | 'red' | 'orange' | 'yellow' | 'green' | 'teal' | 'blue' | 'cyan' | 'purple' | 'pink';

interface MenuContextValue {
  closeOnSelect: boolean;
  size: MenuSize;
  variant: MenuVariant;
  colorPalette: MenuColorPalette;
}

const MenuContext = createContext<MenuContextValue | null>(null);

const useMenuContext = () => {
  const context = useContext(MenuContext);
  if (!context) {
    throw new Error('Menu components must be used within Menu.Root');
  }
  return context;
};

// ===============================================
// MENU ROOT
// ===============================================

export interface MenuRootProps {
  children: ReactNode;
  closeOnSelect?: boolean;
  size?: MenuSize;
  variant?: MenuVariant;
  colorPalette?: MenuColorPalette;
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
  componentKey?: string;
}

export const MenuRoot = ({
  children,
  closeOnSelect = true,
  size = 'md',
  variant = 'subtle',
  colorPalette = 'gray',
  defaultOpen = false,
  open,
  onOpenChange,
  className,
  componentKey
}: MenuRootProps) => {
  const value: MenuContextValue = {
    closeOnSelect,
    size,
    variant,
    colorPalette
  };
  
  return (
    <MenuContext.Provider value={value}>
      <Popover
        open={open}
        defaultOpen={defaultOpen}
        onOpenChange={onOpenChange}
        size={size}
        componentKey={componentKey}
      >
        <div 
          className={cn('menu-root', className)}
          data-color-palette={colorPalette}
        >
          {children}
        </div>
      </Popover>
    </MenuContext.Provider>
  );
};

// ===============================================
// MENU TRIGGER - FIXED (NO DOUBLE WRAPPER)
// ===============================================

export interface MenuTriggerProps {
  children?: ReactNode;
  asChild?: boolean;
  className?: string;
  disabled?: boolean;
}

export const MenuTrigger = forwardRef<HTMLButtonElement, MenuTriggerProps>(
  ({ children, asChild = false, className, disabled, ...props }, ref) => {
    const { size } = useMenuContext();
    
    // If asChild, just pass the child through - don't add menu-trigger classes
    if (asChild && React.isValidElement(children)) {
      return (
        <Popover.Trigger asChild ref={ref}>
          {children}
        </Popover.Trigger>
      );
    }
    
    // Default: render our own button trigger
    return (
      <Popover.Trigger asChild ref={ref}>
        <button
          type="button"
          disabled={disabled}
          className={cn(
            'menu-trigger',
            `menu-trigger--${size}`,
            className
          )}
          {...props}
        >
          {children || 'Menu'}
          <div className="menu-trigger-icon">
            <Icon color='secondary' size='sm'>
              <ChevronDownIcon />
            </Icon>
          </div>
        </button>
      </Popover.Trigger>
    );
  }
);

MenuTrigger.displayName = 'Menu.Trigger';

// ===============================================
// MENU CONTENT
// ===============================================

export interface MenuContentProps {
  children: ReactNode;
  className?: string;
  maxHeight?: number;
}

export const MenuContent = ({ children, className, maxHeight = 400 }: MenuContentProps) => {
  const { size } = useMenuContext();

  return (
    <Popover.Positioner>
      <Popover.Content
        maxHeight={maxHeight}
        className={cn('menu-content', `menu-content--${size}`, className)}
      >
        <Listbox role="menu" size={size} spacing="xs" surface="elevated">
          {children}
        </Listbox>
      </Popover.Content>
    </Popover.Positioner>
  );
};

// ===============================================
// MENU ITEM - Uses ListboxItem internally
// ===============================================

export interface MenuItemProps {
  children: ReactNode;
  value?: string;
  disabled?: boolean;
  closeOnSelect?: boolean;
  onClick?: () => void;
  className?: string;
}

export const MenuItem = ({
  children,
  value = '',
  disabled = false,
  closeOnSelect: itemCloseOnSelect,
  onClick,
  className
}: MenuItemProps) => {
  const { closeOnSelect: rootCloseOnSelect, size } = useMenuContext();

  const shouldClose = itemCloseOnSelect ?? rootCloseOnSelect;

  const handleClick = () => {
    if (disabled) return;
    onClick?.();
  };

  return (
    <ListboxItem
      size={size}
      disabled={disabled}
      onClick={handleClick}
      className={cn('menu-item', className)}
      role="menuitem"
      aria-disabled={disabled}
    >
      {children}
    </ListboxItem>
  );
};

// ===============================================
// MENU ITEM GROUP
// ===============================================

export interface MenuItemGroupProps {
  children: ReactNode;
  label?: string;
  className?: string;
}

export const MenuItemGroup = ({ children, label, className }: MenuItemGroupProps) => {
  const { size } = useMenuContext();
  
  return (
    <div role="group" className={cn('menu-item-group', `menu-item-group--${size}`, className)}>
      {label && <div className="menu-item-group-label">{label}</div>}
      {children}
    </div>
  );
};

// ===============================================
// MENU SEPARATOR
// ===============================================

export interface MenuSeparatorProps {
  className?: string;
}

export const MenuSeparator = ({ className }: MenuSeparatorProps) => {
  const { size } = useMenuContext();
  
  return (
    <div 
      role="separator" 
      className={cn('menu-separator', `menu-separator--${size}`, className)} 
    />
  );
};

// ===============================================
// MENU CHECKBOX ITEM - Uses ListboxItem internally
// ===============================================

export interface MenuCheckboxItemProps {
  children: ReactNode;
  value: string;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  className?: string;
}

export const MenuCheckboxItem = ({
  children,
  value,
  checked = false,
  onChange,
  className
}: MenuCheckboxItemProps) => {
  const { size } = useMenuContext();

  const handleClick = () => {
    onChange?.(!checked);
  };

  return (
    <ListboxItem
      size={size}
      onClick={handleClick}
      className={cn('menu-checkbox-item', className)}
      role="menuitemcheckbox"
      aria-checked={checked}
      leading={
        <div className={cn('menu-item-indicator', `menu-item-indicator--${size}`)}>
          {checked && (
            <Icon color='primary' size='sm'>
              <CheckIcon />
            </Icon>
          )}
        </div>
      }
    >
      {children}
    </ListboxItem>
  );
};

// ===============================================
// MENU ITEM COMMAND
// ===============================================

export interface MenuItemCommandProps {
  children: ReactNode;
  className?: string;
}

export const MenuItemCommand = ({ children, className }: MenuItemCommandProps) => {
  return <span className={cn('menu-item-command', className)}>{children}</span>;
};

// ===============================================
// MENU RADIO ITEM GROUP
// ===============================================

export interface MenuRadioItemGroupProps {
  children: ReactNode;
  value?: string;
  onValueChange?: (value: string) => void;
  className?: string;
}

export const MenuRadioItemGroup = ({ 
  children, 
  value: selectedValue,
  onValueChange,
  className 
}: MenuRadioItemGroupProps) => {
  const { size } = useMenuContext();
  
  return (
    <div 
      role="group" 
      className={cn('menu-radio-item-group', `menu-radio-item-group--${size}`, className)}
    >
      {React.Children.map(children, child => {
        if (React.isValidElement<MenuRadioItemProps>(child) && child.type === MenuRadioItem) {
          return React.cloneElement(child, {
            checked: child.props.value === selectedValue,
            onSelect: () => onValueChange?.(child.props.value)
          });
        }
        return child;
      })}
    </div>
  );
};

// ===============================================
// MENU RADIO ITEM - Uses ListboxItem internally
// ===============================================

export interface MenuRadioItemProps {
  children: ReactNode;
  value: string;
  checked?: boolean;
  onSelect?: () => void;
  className?: string;
}

export const MenuRadioItem = ({
  children,
  value,
  checked = false,
  onSelect,
  className
}: MenuRadioItemProps) => {
  const { size } = useMenuContext();

  return (
    <ListboxItem
      size={size}
      onClick={onSelect}
      selected={checked}
      className={cn('menu-radio-item', className)}
      role="menuitemradio"
      aria-checked={checked}
      leading={
        <div className={cn('menu-item-indicator', `menu-item-indicator--${size}`)}>
          {checked && (
            <Icon color='primary' size='sm'>
              <CheckIcon />
            </Icon>
          )}
        </div>
      }
    >
      {children}
    </ListboxItem>
  );
};

// ===============================================
// EXPORTS (Compound Component Pattern)
// ===============================================

export const Menu = Object.assign(MenuRoot, {
  Trigger: MenuTrigger,
  Content: MenuContent,
  Item: MenuItem,
  ItemGroup: MenuItemGroup,
  Separator: MenuSeparator,
  CheckboxItem: MenuCheckboxItem,
  ItemCommand: MenuItemCommand,
  RadioItemGroup: MenuRadioItemGroup,
  RadioItem: MenuRadioItem
});