// ===============================================
// src/design-system/components/primitives/Menu/Menu.tsx
// CHAKRA-INSPIRED MENU COMPONENT
// ===============================================

import React, { 
  useState, 
  useRef, 
  useEffect, 
  createContext, 
  useContext,
  forwardRef,
  useId,
  type ReactNode,
  type RefObject,
  type KeyboardEvent as ReactKeyboardEvent,
  type MouseEvent as ReactMouseEvent
} from 'react';
import { cn } from '../../../lib/utils';
import { Icon } from '../Icon/Icon';
import { CheckIcon, ChevronDownIcon } from '@heroicons/react/24/solid';

// ===============================================
// TYPES & INTERFACES
// ===============================================

export type MenuSize = 'sm' | 'md' | 'lg';
export type MenuVariant = 'subtle' | 'solid';
export type MenuColorPalette = 'gray' | 'red' | 'orange' | 'yellow' | 'green' | 'teal' | 'blue' | 'cyan' | 'purple' | 'pink';

interface MenuContextValue {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  closeOnSelect: boolean;
  size: MenuSize;
  variant: MenuVariant;
  colorPalette: MenuColorPalette;
  triggerId: string;
  contentId: string;
  highlightedValue: string | null;
  setHighlightedValue: (value: string | null) => void;
  selectedValues: Set<string>;
  toggleSelection: (value: string) => void;
  registerItem: (value: string) => void;
  unregisterItem: (value: string) => void;
  triggerRef: RefObject<HTMLElement | null>;
  contentRef: RefObject<HTMLDivElement | null>;
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
// UTILITY: Scroll Lock
// ===============================================

const useScrollLock = (isLocked: boolean) => {
  useEffect(() => {
    if (isLocked) {
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = `${scrollbarWidth}px`;
      
      return () => {
        document.body.style.overflow = '';
        document.body.style.paddingRight = '';
      };
    }
  }, [isLocked]);
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
}

const MenuRoot = ({
  children,
  closeOnSelect = true,
  size = 'md',
  variant = 'subtle',
  colorPalette = 'gray',
  defaultOpen = false,
  open: controlledOpen,
  onOpenChange,
  className
}: MenuRootProps) => {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const [highlightedValue, setHighlightedValue] = useState<string | null>(null);
  const [selectedValues] = useState(new Set<string>());
  const [items] = useState(new Set<string>());
  
  const triggerRef = useRef<HTMLElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  
  const isControlled = controlledOpen !== undefined;
  const isOpen = isControlled ? controlledOpen : uncontrolledOpen;
  
  const setIsOpen = (open: boolean) => {
    if (!isControlled) {
      setUncontrolledOpen(open);
    }
    onOpenChange?.(open);
  };
  
  const triggerId = useId();
  const contentId = useId();
  
  useScrollLock(isOpen);
  
  const toggleSelection = (value: string) => {
    if (selectedValues.has(value)) {
      selectedValues.delete(value);
    } else {
      selectedValues.add(value);
    }
  };
  
  const registerItem = (value: string) => {
    items.add(value);
  };
  
  const unregisterItem = (value: string) => {
    items.delete(value);
  };
  
  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;
    
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        triggerRef.current && !triggerRef.current.contains(target) &&
        contentRef.current && !contentRef.current.contains(target)
      ) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);
  
  const value: MenuContextValue = {
    isOpen,
    setIsOpen,
    closeOnSelect,
    size,
    variant,
    colorPalette,
    triggerId,
    contentId,
    highlightedValue,
    setHighlightedValue,
    selectedValues,
    toggleSelection,
    registerItem,
    unregisterItem,
    triggerRef,
    contentRef
  };
  
  return (
    <MenuContext.Provider value={value}>
      <div 
        className={cn('menu-root', className)}
        data-color-palette={colorPalette}
      >
        {children}
      </div>
    </MenuContext.Provider>
  );
};

// ===============================================
// MENU TRIGGER
// ===============================================

export interface MenuTriggerProps {
  children?: ReactNode;
  asChild?: boolean;
  className?: string;
  disabled?: boolean;
}

const MenuTrigger = forwardRef<HTMLButtonElement, MenuTriggerProps>(
  ({ children, asChild = false, className, disabled, ...props }, ref) => {
    const { isOpen, setIsOpen, triggerId, contentId, triggerRef, size } = useMenuContext();
    
    const handleClick = () => {
      if (disabled) return;
      setIsOpen(!isOpen);
    };
    
    const handleKeyDown = (e: ReactKeyboardEvent) => {
      if (disabled) return;
      
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        setIsOpen(!isOpen);
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setIsOpen(true);
      }
    };
    
    return (
      <button
        ref={(node) => {
          if (triggerRef) (triggerRef as any).current = node;
          if (typeof ref === 'function') ref(node);
          else if (ref) ref.current = node;
        }}
        id={triggerId}
        type="button"
        disabled={disabled}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        aria-controls={contentId}
        className={cn(
          'menu-trigger',
          `menu-trigger--${size}`,
          isOpen && 'menu-trigger--open',
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
    );
  }
);

MenuTrigger.displayName = 'Menu.Trigger';

// ===============================================
// MENU POSITIONER
// ===============================================

export interface MenuPositionerProps {
  children: ReactNode;
}

const MenuPositioner = ({ children }: MenuPositionerProps) => {
  const { isOpen } = useMenuContext();
  
  if (!isOpen) return null;
  
  return <div className="menu-positioner">{children}</div>;
};

// ===============================================
// MENU CONTENT
// ===============================================

export interface MenuContentProps {
  children: ReactNode;
  className?: string;
  maxHeight?: number;
}

const MenuContent = ({ children, className, maxHeight = 400 }: MenuContentProps) => {
  const { contentId, size, contentRef, setIsOpen } = useMenuContext();
  
  const handleKeyDown = (e: ReactKeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };
  
  return (
    <div
      ref={contentRef}
      id={contentId}
      role="menu"
      tabIndex={-1}
      onKeyDown={handleKeyDown}
      className={cn(
        'menu-content',
        `menu-content--${size}`,
        className
      )}
      style={{ maxHeight: `${maxHeight}px` }}
    >
      {children}
    </div>
  );
};

// ===============================================
// MENU ITEM
// ===============================================

export interface MenuItemProps {
  children: ReactNode;
  value?: string;
  disabled?: boolean;
  closeOnSelect?: boolean;
  onClick?: () => void;
  className?: string;
}

const MenuItem = ({ 
  children, 
  value = '', 
  disabled = false, 
  closeOnSelect: itemCloseOnSelect,
  onClick,
  className
}: MenuItemProps) => {
  const { 
    closeOnSelect: rootCloseOnSelect, 
    setIsOpen, 
    highlightedValue,
    setHighlightedValue,
    size,
    variant,
    registerItem,
    unregisterItem
  } = useMenuContext();
  
  const shouldClose = itemCloseOnSelect ?? rootCloseOnSelect;
  const isHighlighted = highlightedValue === value;
  
  useEffect(() => {
    if (value) {
      registerItem(value);
      return () => unregisterItem(value);
    }
  }, [value]);
  
  const handleClick = () => {
    if (disabled) return;
    onClick?.();
    if (shouldClose) {
      setIsOpen(false);
    }
  };
  
  return (
    <div
      role="menuitem"
      tabIndex={disabled ? -1 : 0}
      onClick={handleClick}
      onMouseEnter={() => !disabled && setHighlightedValue(value)}
      onMouseLeave={() => setHighlightedValue(null)}
      className={cn(
        'menu-item',
        `menu-item--${size}`,
        `menu-item--variant-${variant}`,
        isHighlighted && 'menu-item--highlighted',
        disabled && 'menu-item--disabled',
        className
      )}
      aria-disabled={disabled}
    >
      {children}
    </div>
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

const MenuItemGroup = ({ children, label, className }: MenuItemGroupProps) => {
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

const MenuSeparator = ({ className }: MenuSeparatorProps) => {
  const { size } = useMenuContext();
  
  return (
    <div 
      role="separator" 
      className={cn('menu-separator', `menu-separator--${size}`, className)} 
    />
  );
};

// ===============================================
// MENU CHECKBOX ITEM
// ===============================================

export interface MenuCheckboxItemProps {
  children: ReactNode;
  value: string;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  className?: string;
}

const MenuCheckboxItem = ({ 
  children, 
  value,
  checked: controlledChecked,
  onChange,
  className
}: MenuCheckboxItemProps) => {
  const [uncontrolledChecked, setUncontrolledChecked] = useState(false);
  const { size, highlightedValue, setHighlightedValue } = useMenuContext();
  
  const isControlled = controlledChecked !== undefined;
  const isChecked = isControlled ? controlledChecked : uncontrolledChecked;
  const isHighlighted = highlightedValue === value;
  
  const handleClick = () => {
    const newChecked = !isChecked;
    if (!isControlled) {
      setUncontrolledChecked(newChecked);
    }
    onChange?.(newChecked);
  };
  
  return (
    <div
      role="menuitemcheckbox"
      aria-checked={isChecked}
      onClick={handleClick}
      onMouseEnter={() => setHighlightedValue(value)}
      onMouseLeave={() => setHighlightedValue(null)}
      className={cn(
        'menu-checkbox-item',
        `menu-checkbox-item--${size}`,
        isHighlighted && 'menu-checkbox-item--highlighted',
        className
      )}
    >
      <div className={cn('menu-item-indicator', `menu-item-indicator--${size}`)}>
        {isChecked && (
          <Icon color='primary' size='sm'>
            <CheckIcon />
          </Icon>
        )}
      </div>
      {children}
    </div>
  );
};

// ===============================================
// MENU ITEM INDICATOR
// ===============================================

export interface MenuItemIndicatorProps {
  children?: ReactNode;
  className?: string;
}

const MenuItemIndicator = ({ children, className }: MenuItemIndicatorProps) => {
  const { size } = useMenuContext();
  
  return (
    <div className={cn('menu-item-indicator', `menu-item-indicator--${size}`, className)}>
      {children || (
        <Icon color='primary' size='sm'>
          <CheckIcon />
        </Icon>
      )}
    </div>
  );
};

// ===============================================
// MENU ITEM COMMAND
// ===============================================

export interface MenuItemCommandProps {
  children: ReactNode;
  className?: string;
}

const MenuItemCommand = ({ children, className }: MenuItemCommandProps) => {
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

const MenuRadioItemGroup = ({ 
  children, 
  value: controlledValue,
  onValueChange,
  className 
}: MenuRadioItemGroupProps) => {
  const [uncontrolledValue, setUncontrolledValue] = useState<string>('');
  const { size } = useMenuContext();
  
  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : uncontrolledValue;
  
  const handleValueChange = (newValue: string) => {
    if (!isControlled) {
      setUncontrolledValue(newValue);
    }
    onValueChange?.(newValue);
  };
  
  return (
    <div 
      role="group" 
      className={cn('menu-radio-item-group', `menu-radio-item-group--${size}`, className)}
    >
      {React.Children.map(children, child => {
        if (React.isValidElement<MenuRadioItemProps>(child) && child.type === MenuRadioItem) {
          const childProps = child.props as MenuRadioItemProps;
          return React.cloneElement(child, {
            checked: childProps.value === value,
            onSelect: () => handleValueChange(childProps.value)
          });
        }
        return child;
      })}
    </div>
  );
};

// ===============================================
// MENU RADIO ITEM
// ===============================================

export interface MenuRadioItemProps {
  children: ReactNode;
  value: string;
  checked?: boolean;
  onSelect?: () => void;
  className?: string;
}

const MenuRadioItem = ({ 
  children, 
  value,
  checked = false,
  onSelect,
  className
}: MenuRadioItemProps) => {
  const { size, highlightedValue, setHighlightedValue, closeOnSelect, setIsOpen } = useMenuContext();
  const isHighlighted = highlightedValue === value;
  
  const handleClick = () => {
    onSelect?.();
    if (closeOnSelect) {
      setIsOpen(false);
    }
  };
  
  return (
    <div
      role="menuitemradio"
      aria-checked={checked}
      onClick={handleClick}
      onMouseEnter={() => setHighlightedValue(value)}
      onMouseLeave={() => setHighlightedValue(null)}
      className={cn(
        'menu-radio-item',
        `menu-radio-item--${size}`,
        isHighlighted && 'menu-radio-item--highlighted',
        checked && 'menu-radio-item--selected',
        className
      )}
    >
      <div className={cn('menu-item-indicator', `menu-item-indicator--${size}`)}>
        {checked && (
          <Icon color='primary' size='sm'>
            <CheckIcon />
          </Icon>
        )}
      </div>
      {children}
    </div>
  );
};

// ===============================================
// MENU ARROW (Optional decorative element)
// ===============================================

export interface MenuArrowProps {
  className?: string;
}

const MenuArrow = ({ className }: MenuArrowProps) => {
  return <div className={cn('menu-arrow', className)} />;
};

// ===============================================
// EXPORTS (Compound Component Pattern)
// ===============================================

export const Menu = Object.assign(MenuRoot, {
  Trigger: MenuTrigger,
  Positioner: MenuPositioner,
  Content: MenuContent,
  Item: MenuItem,
  ItemGroup: MenuItemGroup,
  Separator: MenuSeparator,
  CheckboxItem: MenuCheckboxItem,
  ItemIndicator: MenuItemIndicator,
  ItemCommand: MenuItemCommand,
  RadioItemGroup: MenuRadioItemGroup,
  RadioItem: MenuRadioItem,
  Arrow: MenuArrow
});