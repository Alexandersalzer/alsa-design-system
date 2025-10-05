// ===============================================
// src/design-system/components/primitives/Menu/Menu.tsx
// CHAKRA-INSPIRED MENU COMPONENT (FIXED DROPDOWN POSITION)
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
  type KeyboardEvent as ReactKeyboardEvent
} from 'react';
import { cn } from '../../../lib/utils';
import { Icon } from '../Icon/Icon';
import { CheckIcon, ChevronDownIcon } from '@heroicons/react/24/solid';
import './Menu.css';

// ===============================================
// TYPES & CONTEXT
// ===============================================

export type MenuSize = 'sm' | 'md' | 'lg';
export type MenuVariant = 'subtle' | 'solid';
export type MenuColorPalette =
  | 'gray' | 'red' | 'orange' | 'yellow' | 'green' | 'teal'
  | 'blue' | 'cyan' | 'purple' | 'pink';

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
  if (!context) throw new Error('Menu components must be used within Menu.Root');
  return context;
};

// ===============================================
// SCROLL LOCK
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

export const MenuRoot = ({
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
    if (!isControlled) setUncontrolledOpen(open);
    onOpenChange?.(open);
  };

  const triggerId = useId();
  const contentId = useId();
  useScrollLock(isOpen);

  const toggleSelection = (value: string) => {
    if (selectedValues.has(value)) selectedValues.delete(value);
    else selectedValues.add(value);
  };

  const registerItem = (value: string) => items.add(value);
  const unregisterItem = (value: string) => items.delete(value);

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
      <div className={cn('menu-root', className)} data-color-palette={colorPalette}>
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

export const MenuTrigger = forwardRef<HTMLButtonElement, MenuTriggerProps>(
  ({ children, className, disabled, ...props }, ref) => {
    const { isOpen, setIsOpen, triggerId, contentId, triggerRef, size } = useMenuContext();

    const handleClick = () => {
      if (!disabled) setIsOpen(!isOpen);
    };

    const handleKeyDown = (e: ReactKeyboardEvent) => {
      if (disabled) return;
      if (['Enter', ' '].includes(e.key)) {
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
          triggerRef.current = node;
          if (typeof ref === 'function') ref(node);
          else if (ref) (ref as any).current = node;
        }}
        id={triggerId}
        type="button"
        disabled={disabled}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        aria-controls={contentId}
        className={cn('menu-trigger', `menu-trigger--${size}`, isOpen && 'menu-trigger--open', className)}
        {...props}
      >
        {children || 'Menu'}
        <div className="menu-trigger-icon">
          <Icon color="secondary" size="sm">
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

export const MenuPositioner = ({ children }: { children: ReactNode }) => {
  const { isOpen } = useMenuContext();
  if (!isOpen) return null;
  return <div className="menu-positioner">{children}</div>;
};

// ===============================================
// MENU CONTENT (FIXED)
// ===============================================

export const MenuContent = ({ children, className, maxHeight = 400 }: { children: ReactNode; className?: string; maxHeight?: number }) => {
  const { contentId, size, contentRef, setIsOpen, triggerRef } = useMenuContext();
  const [position, setPosition] = useState({
    shouldOpenUpward: false,
    calculatedMaxHeight: maxHeight,
    leftOffset: 0
  });

  const handleKeyDown = (e: ReactKeyboardEvent) => {
    if (e.key === 'Escape') setIsOpen(false);
  };

  const calculatePosition = () => {
    if (!triggerRef.current || !contentRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const viewportHeight = window.innerHeight;

    const spaceAbove = triggerRect.top;
    const spaceBelow = viewportHeight - triggerRect.bottom;
    const shouldOpenUpward = spaceBelow < maxHeight && spaceAbove > spaceBelow;

    const calculatedMaxHeight = shouldOpenUpward
      ? Math.min(maxHeight, spaceAbove - 16)
      : Math.min(maxHeight, spaceBelow - 16);

    // Center horizontally relative to trigger
    const leftOffset = triggerRect.width / 2 - contentRef.current.offsetWidth / 2;

    setPosition({ shouldOpenUpward, calculatedMaxHeight, leftOffset });
  };

  useEffect(() => {
    const timer = setTimeout(calculatePosition, 0);
    return () => clearTimeout(timer);
  }, [maxHeight]);

  useEffect(() => {
    window.addEventListener('scroll', calculatePosition, true);
    window.addEventListener('resize', calculatePosition);
    return () => {
      window.removeEventListener('scroll', calculatePosition, true);
      window.removeEventListener('resize', calculatePosition);
    };
  }, []);

  return (
    <div
      ref={contentRef}
      id={contentId}
      role="menu"
      tabIndex={-1}
      onKeyDown={handleKeyDown}
      className={cn('menu-content', `menu-content--${size}`, className)}
      style={{
        transform: `translateX(${position.leftOffset}px)`,
        maxHeight: `${position.calculatedMaxHeight}px`,
        ...(position.shouldOpenUpward
          ? { bottom: '100%', marginBottom: '8px', top: 'auto' }
          : { top: '100%', marginTop: '8px' })
      }}
    >
      {children}
    </div>
  );
};

// ===============================================
// MENU ITEM
// ===============================================

export const MenuItem = ({
  children,
  value = '',
  disabled = false,
  closeOnSelect: itemCloseOnSelect,
  onClick,
  className
}: {
  children: ReactNode;
  value?: string;
  disabled?: boolean;
  closeOnSelect?: boolean;
  onClick?: () => void;
  className?: string;
}) => {
  const { closeOnSelect: rootCloseOnSelect, setIsOpen, highlightedValue, setHighlightedValue, size, variant, registerItem, unregisterItem } = useMenuContext();
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
    if (shouldClose) setIsOpen(false);
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
    >
      {children}
    </div>
  );
};

// ===============================================
// OTHER SUBCOMPONENTS (unchanged)
// ===============================================

export const MenuItemGroup = ({ children, label, className }: { children: ReactNode; label?: string; className?: string }) => {
  const { size } = useMenuContext();
  return (
    <div role="group" className={cn('menu-item-group', `menu-item-group--${size}`, className)}>
      {label && <div className="menu-item-group-label">{label}</div>}
      {children}
    </div>
  );
};

export const MenuSeparator = ({ className }: { className?: string }) => {
  const { size } = useMenuContext();
  return <div role="separator" className={cn('menu-separator', `menu-separator--${size}`, className)} />;
};

// ===============================================
// EXPORT
// ===============================================

export const Menu = Object.assign(MenuRoot, {
  Trigger: MenuTrigger,
  Positioner: MenuPositioner,
  Content: MenuContent,
  Item: MenuItem,
  ItemGroup: MenuItemGroup,
  Separator: MenuSeparator
});
