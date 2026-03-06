// ===============================================
// src/design-system/components/primitives/Menu/Menu.tsx
// Enhanced with HeroUI-inspired features + animations
// ===============================================

import React, {
  useState,
  useRef,
  useEffect,
  createContext,
  useContext,
  forwardRef,
  useMemo,
  type ReactNode,
  type Key
} from 'react';
import { cn } from '../../../utils/cn';
import { Icon } from '../../media';
import { CheckIcon, ChevronDownIcon } from '@heroicons/react/24/solid';
import { Popover, type PopoverPlacement } from '../Popover';
import { Listbox, ListboxItem } from '../../lists';
import './Menu.css';

// ===============================================
// TYPES & INTERFACES
// ===============================================

export type MenuSize = 'sm' | 'md' | 'lg';
export type MenuVariant = 'solid' | 'bordered' | 'light' | 'flat' | 'faded' | 'shadow';
export type MenuColor = 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
export type MenuColorPalette = 'gray' | 'red' | 'orange' | 'yellow' | 'green' | 'teal' | 'blue' | 'cyan' | 'purple' | 'pink';
export type MenuPlacement = PopoverPlacement;
export type MenuAnimationVariant = 'none' | 'fade' | 'opacity' | 'bounce' | 'opacityBounce';
export type MenuSelectionMode = 'none' | 'single' | 'multiple';
export type MenuBackdrop = 'transparent' | 'opaque' | 'blur';
export type MenuTriggerType = 'click' | 'hover';

// CMS-friendly menu item type for props-based rendering
export interface MenuItemConfig {
  label: string;
  itemKey?: string;
  href?: string;
  icon?: ReactNode;
  description?: string;
  disabled?: boolean;
  action?: any; // ActionConfig type - kept as any to avoid circular dependencies
}

interface MenuContextValue {
  closeOnSelect: boolean;
  size: MenuSize;
  variant: MenuVariant;
  color: MenuColor;
  colorPalette: MenuColorPalette;
  placement: MenuPlacement;
  trigger: MenuTriggerType;
  animationVariant: MenuAnimationVariant;
  animateContainer: boolean;
  animateItems: boolean;
  itemStagger: number;
  disableAnimation: boolean;
  selectionMode: MenuSelectionMode;
  selectedKeys: Set<Key>;
  disabledKeys: Set<Key>;
  disallowEmptySelection: boolean;
  onSelectionChange?: (keys: Set<Key>) => void;
  onAction?: (key: Key) => void;
  hideSelectedIcon: boolean;
  getAndIncrementItemIndex: () => number;
  isOpen: boolean;
  isClosing: boolean;
  setIsOpen: (open: boolean) => void;
  handleHoverEnter: () => void;
  handleHoverLeave: () => void;
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

export interface MenuRootProps<T = object> {
  children: ReactNode | ((item: T) => ReactNode);
  /** Dynamic items for collection-based rendering */
  items?: Iterable<T>;
  /** Close menu when an item is selected */
  closeOnSelect?: boolean;
  /** Size variant */
  size?: MenuSize;
  /** Visual variant */
  variant?: MenuVariant;
  /** Color scheme */
  color?: MenuColor;
  /** Color palette (legacy, use color instead) */
  colorPalette?: MenuColorPalette;
  /** Placement relative to trigger */
  placement?: MenuPlacement;
  /** Trigger type: 'click' or 'hover' */
  trigger?: MenuTriggerType;
  /** Animation variant for the menu */
  animationVariant?: MenuAnimationVariant;
  /** Animate the container on open */
  animateContainer?: boolean;
  /** Animate items with stagger effect */
  animateItems?: boolean;
  /** Stagger delay between items (ms) */
  itemStagger?: number;
  /** Disable all animations */
  disableAnimation?: boolean;
  /** Selection mode */
  selectionMode?: MenuSelectionMode;
  /** Controlled selected keys */
  selectedKeys?: 'all' | Iterable<Key>;
  /** Default selected keys (uncontrolled) */
  defaultSelectedKeys?: 'all' | Iterable<Key>;
  /** Disabled keys */
  disabledKeys?: Iterable<Key>;
  /** Disallow empty selection in single/multiple mode */
  disallowEmptySelection?: boolean;
  /** Hide the selected icon */
  hideSelectedIcon?: boolean;
  /** Backdrop style */
  backdrop?: MenuBackdrop;
  /** Default open state */
  defaultOpen?: boolean;
  /** Controlled open state */
  open?: boolean;
  /** Open state change handler */
  onOpenChange?: (open: boolean) => void;
  /** Selection change handler */
  onSelectionChange?: (keys: Set<Key>) => void;
  /** Action handler when item is pressed */
  onAction?: (key: Key) => void;
  /** Custom className */
  className?: string;
  /** Component key for tracking */
  componentKey?: string;
  
  // NEW: CMS-friendly props for auto-generating trigger + content
  /** Trigger label text (auto-generates trigger button) */
  triggerLabel?: string;
  /** Trigger button variant */
  triggerVariant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'accent';
  /** Trigger icon (optional) */
  triggerIcon?: ReactNode;
  /** Menu items array (auto-generates Menu.Items) */
  menuItems?: MenuItemConfig[];
}

export const MenuRoot = <T extends object>({
  children,
  items,
  closeOnSelect = true,
  size = 'md',
  variant = 'solid',
  color = 'default',
  colorPalette = 'gray',
  placement = 'bottom-start',
  trigger = 'click',
  animationVariant = 'none',
  animateContainer = false,
  animateItems = false,
  itemStagger = 30,
  disableAnimation = false,
  selectionMode = 'none',
  selectedKeys: controlledSelectedKeys,
  defaultSelectedKeys,
  disabledKeys,
  disallowEmptySelection = false,
  hideSelectedIcon = false,
  backdrop = 'transparent',
  defaultOpen = false,
  open,
  onOpenChange,
  onSelectionChange,
  onAction,
  className,
  componentKey,
  // NEW props
  triggerLabel,
  triggerVariant = 'ghost',
  triggerIcon,
  menuItems
}: MenuRootProps<T>) => {
  // DEBUG: Log received props
  console.log('🔍 Menu props received:', { 
    componentKey, 
    triggerLabel, 
    menuItems: menuItems ? `Array(${menuItems.length})` : 'undefined',
    hasChildren: !!children
  });
  
  // Selection state management
  const [uncontrolledSelectedKeys, setUncontrolledSelectedKeys] = useState<Set<Key>>(
    () => new Set(defaultSelectedKeys === 'all' ? [] : defaultSelectedKeys || [])
  );

  const isSelectionControlled = controlledSelectedKeys !== undefined;
  const selectedKeys = useMemo(() => {
    if (controlledSelectedKeys === 'all') return new Set<Key>();
    return new Set(isSelectionControlled ? controlledSelectedKeys : uncontrolledSelectedKeys);
  }, [controlledSelectedKeys, isSelectionControlled, uncontrolledSelectedKeys]);

  const disabledKeysSet = useMemo(() => new Set(disabledKeys || []), [disabledKeys]);

  // Open state management with closing state for exit animations
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const [isClosing, setIsClosing] = useState(false);
  const isOpenControlled = open !== undefined;
  const isOpen = isOpenControlled ? open : uncontrolledOpen;
  const closeAnimationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const setIsOpen = (newOpen: boolean) => {
    // If closing and animations are enabled, trigger exit animation first
    if (!newOpen && !isClosing && !disableAnimation && animationVariant !== 'none' && animateContainer) {
      setIsClosing(true);

      // Determine animation duration based on variant and trigger type
      let duration = 100; // Default closing duration
      if (trigger === 'hover') {
        duration = 80; // Faster for hover menus
      }

      // Clear any existing timeout
      if (closeAnimationTimeoutRef.current) {
        clearTimeout(closeAnimationTimeoutRef.current);
      }

      // Delay actual close until animation completes
      closeAnimationTimeoutRef.current = setTimeout(() => {
        setIsClosing(false);
        if (!isOpenControlled) {
          setUncontrolledOpen(false);
        }
        onOpenChange?.(false);
        closeAnimationTimeoutRef.current = null;
      }, duration);

      return;
    }

    // Opening or immediate close (no animation)
    setIsClosing(false);
    if (closeAnimationTimeoutRef.current) {
      clearTimeout(closeAnimationTimeoutRef.current);
      closeAnimationTimeoutRef.current = null;
    }

    if (!isOpenControlled) {
      setUncontrolledOpen(newOpen);
    }
    onOpenChange?.(newOpen);
  };

  // Centralized hover timeout management for hover menus
  const hoverCloseTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleHoverEnter = () => {
    if (trigger !== 'hover') return;

    // Clear any pending close timeout
    if (hoverCloseTimeoutRef.current) {
      clearTimeout(hoverCloseTimeoutRef.current);
      hoverCloseTimeoutRef.current = null;
    }

    setIsOpen(true);
  };

  const handleHoverLeave = () => {
    if (trigger !== 'hover') return;

    // Very short timeout for instant switching between adjacent menus
    hoverCloseTimeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 30);
  };

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (hoverCloseTimeoutRef.current) {
        clearTimeout(hoverCloseTimeoutRef.current);
      }
      if (closeAnimationTimeoutRef.current) {
        clearTimeout(closeAnimationTimeoutRef.current);
      }
    };
  }, []);

  // Use ref for item index to avoid setState during render
  const itemIndexRef = useRef(0);

  const handleSelectionChange = (keys: Set<Key>) => {
    if (!isSelectionControlled) {
      setUncontrolledSelectedKeys(keys);
    }
    onSelectionChange?.(keys);
  };

  // Function to atomically get and increment the item index
  const getAndIncrementItemIndex = () => {
    const index = itemIndexRef.current;
    itemIndexRef.current += 1;
    return index;
  };

  const value: MenuContextValue = {
    closeOnSelect,
    size,
    variant,
    color,
    colorPalette,
    placement,
    trigger,
    animationVariant,
    animateContainer,
    animateItems,
    itemStagger,
    disableAnimation,
    selectionMode,
    selectedKeys,
    disabledKeys: disabledKeysSet,
    disallowEmptySelection,
    onSelectionChange: handleSelectionChange,
    onAction,
    hideSelectedIcon,
    getAndIncrementItemIndex,
    isOpen,
    isClosing,
    setIsOpen,
    handleHoverEnter,
    handleHoverLeave
  };

  // Handle dynamic items rendering
  const renderChildren = () => {
    console.log('🎯 renderChildren called with:', { 
      hasMenuItems: !!menuItems, 
      hasTriggerLabel: !!triggerLabel,
      willAutoGenerate: !!(menuItems && triggerLabel)
    });
    
    // NEW: If menuItems provided, auto-generate Menu.Trigger + Menu.Content structure
    if (menuItems && triggerLabel) {
      console.log('✅ Auto-generating Menu structure with', menuItems.length, 'items');
      return (
        <>
          <MenuTrigger asChild>
            <button
              type="button"
              className="menu-auto-trigger"
              style={{
                background: 'transparent',
                border: 'none',
                padding: '0.5rem 0.75rem',
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontWeight: 500,
                color: 'inherit',
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem'
              }}
            >
              {triggerLabel}
              {triggerIcon || <ChevronDownIcon style={{ width: '1rem', height: '1rem' }} />}
            </button>
          </MenuTrigger>
          <MenuContent>
            {menuItems.map((item, i) => {
              // For now, construct href from action config if present
              let itemHref = item.href;
              if (!itemHref && (item as any).action) {
                const action = (item as any).action;
                if (action.type === 'navigation') {
                  if (action.settings?.sectionId) {
                    itemHref = `#${action.settings.sectionId}`;
                  } else if (action.settings?.pageId) {
                    itemHref = `/${action.settings.pageId}`;
                  }
                }
              }
              
              return (
                <MenuItem
                  key={item.itemKey || i}
                  itemKey={item.itemKey || String(i)}
                  disabled={item.disabled}
                  onClick={() => {
                    if (itemHref) {
                      if (itemHref.startsWith('#')) {
                        // Smooth scroll to section
                        const element = document.getElementById(itemHref.slice(1));
                        element?.scrollIntoView({ behavior: 'smooth' });
                      } else {
                        // Navigate to page
                        window.location.href = itemHref;
                      }
                    }
                  }}
                >
                  {item.icon && <span className="menu-item-icon">{item.icon}</span>}
                  <span>{item.label}</span>
                </MenuItem>
              );
            })}
          </MenuContent>
        </>
      );
    }
    
    if (items && typeof children === 'function') {
      return Array.from(items).map((item, index) => {
        return React.cloneElement(
          children(item) as React.ReactElement,
          { key: index }
        );
      });
    }
    return children as ReactNode;
  };

  return (
    <MenuContext.Provider value={value}>
      <Popover
        open={isOpen || isClosing}
        onOpenChange={setIsOpen}
        size={size}
        componentKey={componentKey}
      >
        <div
          className={cn(
            'menu-root',
            `menu-root--${variant}`,
            `menu-root--${color}`,
            backdrop !== 'transparent' && `menu-root--backdrop-${backdrop}`,
            className
          )}
          data-color-palette={colorPalette}
          data-variant={variant}
          data-color={color}
        >
          {renderChildren()}
        </div>
      </Popover>
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
  ({ children, asChild = false, className, disabled, ...props }, ref) => {
    const { size, trigger, handleHoverEnter, handleHoverLeave } = useMenuContext();

    const handleMouseEnter = () => {
      if (disabled) return;
      handleHoverEnter();
    };

    const handleMouseLeave = () => {
      if (disabled) return;
      handleHoverLeave();
    };

    // If asChild, just pass the child through - don't add menu-trigger classes
    if (asChild && React.isValidElement(children)) {
      const childWithHover = trigger === 'hover'
        ? React.cloneElement(children as React.ReactElement<any>, {
            onMouseEnter: handleMouseEnter,
            onMouseLeave: handleMouseLeave
          })
        : children;

      return (
        <Popover.Trigger asChild ref={ref}>
          {childWithHover}
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
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
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
  placement?: MenuPlacement;
}

export const MenuContent = ({
  children,
  className,
  maxHeight = 400,
  placement: placementOverride
}: MenuContentProps) => {
  const {
    size,
    variant,
    placement: contextPlacement,
    animationVariant,
    animateContainer,
    disableAnimation,
    trigger,
    isClosing,
    handleHoverEnter,
    handleHoverLeave
  } = useMenuContext();

  const shouldAnimate = animateContainer && !disableAnimation && animationVariant !== 'none';
  const finalPlacement = placementOverride || contextPlacement;
  const isHoverMenu = trigger === 'hover';

  // 8px gap with wide hover bridge for hover menus
  const offset = isHoverMenu ? 8 : 8;

  return (
    <Popover.Positioner>
      <Popover.Content
        maxHeight={maxHeight}
        positioning={{ placement: finalPlacement, offset }}
        onMouseEnter={handleHoverEnter}
        onMouseLeave={handleHoverLeave}
        showHoverBridge={isHoverMenu}
        hoverBridgeOffset={offset}
        className={cn(
          'menu-content',
          `menu-content--${size}`,
          `menu-root--${variant}`, // Apply variant class here so CSS selectors work
          shouldAnimate && 'menu-content--animated',
          shouldAnimate && `menu-content--${animationVariant}`,
          shouldAnimate && isHoverMenu && 'menu-content--hover',
          shouldAnimate && isClosing && 'menu-content--closing',
          className
        )}
      >
        <Listbox role="menu" size={size} spacing="xs" surface="raised">
          {children}
        </Listbox>
      </Popover.Content>
    </Popover.Positioner>
  );
};

// ===============================================
// MENU ITEM
// ===============================================

export interface MenuItemProps {
  children: ReactNode;
  /** Unique identifier for this menu item (used for selection state) */
  itemKey?: Key;
  value?: string;
  disabled?: boolean;
  closeOnSelect?: boolean;
  onClick?: () => void;
  onAction?: () => void;
  /** Icon or content to display before the item */
  startContent?: ReactNode;
  /** Icon or content to display after the item */
  endContent?: ReactNode;
  /** Description text below the main content */
  description?: ReactNode;
  /** Keyboard shortcut to display */
  shortcut?: ReactNode;
  /** Show divider below this item */
  showDivider?: boolean;
  /** href for navigation items */
  href?: string;
  /** Link target */
  target?: string;
  className?: string;
}

export const MenuItem = ({
  children,
  itemKey,
  value = '',
  disabled = false,
  closeOnSelect: itemCloseOnSelect,
  onClick,
  onAction,
  startContent,
  endContent,
  description,
  shortcut,
  showDivider = false,
  href,
  target,
  className
}: MenuItemProps) => {
  const {
    closeOnSelect: rootCloseOnSelect,
    size,
    variant,
    color,
    animateItems,
    itemStagger,
    disableAnimation,
    animationVariant,
    selectionMode,
    selectedKeys,
    disabledKeys,
    onSelectionChange,
    onAction: rootOnAction,
    getAndIncrementItemIndex,
    setIsOpen
  } = useMenuContext();

  // Track this item's index for stagger animation (using useMemo is safe with ref mutation)
  const myIndex = useMemo(() => getAndIncrementItemIndex(), [getAndIncrementItemIndex]);

  const shouldClose = itemCloseOnSelect ?? rootCloseOnSelect;
  const finalItemKey = itemKey || value;
  const isDisabled = disabled || (finalItemKey ? disabledKeys.has(finalItemKey) : false);
  const isSelected = finalItemKey ? selectedKeys.has(finalItemKey) : false;

  const shouldAnimateItem = animateItems && !disableAnimation && animationVariant !== 'none';
  const animationDelay = shouldAnimateItem ? myIndex * itemStagger : 0;

  const handleClick = () => {
    if (isDisabled) return;

    // Close menu first if closeOnSelect is enabled (before calling onClick)
    // This ensures menu starts closing animation immediately
    if (shouldClose) {
      setIsOpen(false);
    }

    // Handle selection 
    if (selectionMode !== 'none' && finalItemKey) {
      const newKeys = new Set(selectedKeys);
      if (selectionMode === 'single') {
        newKeys.clear();
        if (!isSelected) {
          newKeys.add(finalItemKey);
        }
      } else if (selectionMode === 'multiple') {
        if (isSelected) {
          newKeys.delete(finalItemKey);
        } else {
          newKeys.add(finalItemKey);
        }
      }
      onSelectionChange?.(newKeys);
    }

    // Handle actions
    onClick?.();
    onAction?.();
    if (finalItemKey) {
      rootOnAction?.(finalItemKey);
    }
  };

  const itemContent = (
    <div className="menu-item__content">
      {startContent && (
        <div className="menu-item__start-content">{startContent}</div>
      )}
      <div className="menu-item__main">
        <div className="menu-item__title">{children}</div>
        {description && (
          <div className="menu-item__description">{description}</div>
        )}
      </div>
      {shortcut && (
        <div className="menu-item__shortcut">{shortcut}</div>
      )}
      {endContent && (
        <div className="menu-item__end-content">{endContent}</div>
      )}
    </div>
  );

  return (
    <>
      <ListboxItem
        size={size}
        disabled={isDisabled}
        selected={isSelected}
        onClick={handleClick}
        className={cn(
          'menu-item',
          `menu-item--${variant}`,
          `menu-item--${color}`,
          shouldAnimateItem && 'menu-item--animated',
          shouldAnimateItem && `menu-item--${animationVariant}`,
          className
        )}
        role="menuitem"
        aria-disabled={isDisabled}
        data-selected={isSelected}
        data-disabled={isDisabled}
        style={
          shouldAnimateItem
            ? ({
                '--menu-item-animation-delay': `${animationDelay}ms`
              } as React.CSSProperties)
            : undefined
        }
      >
        {itemContent}
      </ListboxItem>
      {showDivider && <MenuSeparator />}
    </>
  );
};

// ===============================================
// MENU ITEM GROUP / SECTION
// ===============================================

export interface MenuItemGroupProps {
  children: ReactNode;
  label?: string;
  title?: string;
  showDivider?: boolean;
  className?: string;
}

export const MenuItemGroup = ({
  children,
  label,
  title,
  showDivider = false,
  className
}: MenuItemGroupProps) => {
  const { size } = useMenuContext();
  const displayTitle = title || label;

  return (
    <>
      <div
        role="group"
        className={cn(
          'menu-item-group',
          `menu-item-group--${size}`,
          className
        )}
      >
        {displayTitle && (
          <div className="menu-item-group-label">{displayTitle}</div>
        )}
        {children}
      </div>
      {showDivider && <MenuSeparator />}
    </>
  );
};

// Alias for HeroUI compatibility
export const MenuSection = MenuItemGroup;

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
// MENU CHECKBOX ITEM
// ===============================================

export interface MenuCheckboxItemProps {
  children: ReactNode;
  value: string;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  startContent?: ReactNode;
  description?: ReactNode;
  className?: string;
}

export const MenuCheckboxItem = ({
  children,
  value,
  checked = false,
  onChange,
  startContent,
  description,
  className
}: MenuCheckboxItemProps) => {
  const { size, hideSelectedIcon } = useMenuContext();

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
        !hideSelectedIcon ? (
          <div className={cn('menu-item-indicator', `menu-item-indicator--${size}`)}>
            {checked && (
              <Icon color='primary' size='sm'>
                <CheckIcon />
              </Icon>
            )}
          </div>
        ) : startContent
      }
    >
      <div className="menu-item__content">
        {startContent && !hideSelectedIcon && (
          <div className="menu-item__start-content">{startContent}</div>
        )}
        <div className="menu-item__main">
          <div className="menu-item__title">{children}</div>
          {description && (
            <div className="menu-item__description">{description}</div>
          )}
        </div>
      </div>
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
// MENU RADIO ITEM
// ===============================================

export interface MenuRadioItemProps {
  children: ReactNode;
  value: string;
  checked?: boolean;
  onSelect?: () => void;
  startContent?: ReactNode;
  description?: ReactNode;
  className?: string;
}

export const MenuRadioItem = ({
  children,
  value,
  checked = false,
  onSelect,
  startContent,
  description,
  className
}: MenuRadioItemProps) => {
  const { size, hideSelectedIcon } = useMenuContext();

  return (
    <ListboxItem
      size={size}
      onClick={onSelect}
      selected={checked}
      className={cn('menu-radio-item', className)}
      role="menuitemradio"
      aria-checked={checked}
      leading={
        !hideSelectedIcon ? (
          <div className={cn('menu-item-indicator', `menu-item-indicator--${size}`)}>
            {checked && (
              <Icon color='primary' size='sm'>
                <CheckIcon />
              </Icon>
            )}
          </div>
        ) : startContent
      }
    >
      <div className="menu-item__content">
        {startContent && !hideSelectedIcon && (
          <div className="menu-item__start-content">{startContent}</div>
        )}
        <div className="menu-item__main">
          <div className="menu-item__title">{children}</div>
          {description && (
            <div className="menu-item__description">{description}</div>
          )}
        </div>
      </div>
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
  Section: MenuSection,
  Separator: MenuSeparator,
  CheckboxItem: MenuCheckboxItem,
  ItemCommand: MenuItemCommand,
  RadioItemGroup: MenuRadioItemGroup,
  RadioItem: MenuRadioItem
});
