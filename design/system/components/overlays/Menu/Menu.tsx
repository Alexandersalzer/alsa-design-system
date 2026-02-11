// ===============================================
// src/design-system/components/primitives/Menu/Menu.tsx
// Enhanced with HeroUI-inspired features + animations
// ===============================================

import React, {
  useState,
  useRef,
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

interface MenuContextValue {
  closeOnSelect: boolean;
  size: MenuSize;
  variant: MenuVariant;
  color: MenuColor;
  colorPalette: MenuColorPalette;
  placement: MenuPlacement;
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
  animationVariant = 'none',
  animateContainer = false,
  animateItems = false,
  itemStagger = 50,
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
  componentKey
}: MenuRootProps<T>) => {
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
    getAndIncrementItemIndex
  };

  // Handle dynamic items rendering
  const renderChildren = () => {
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
        open={open}
        defaultOpen={defaultOpen}
        onOpenChange={onOpenChange}
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
    placement: contextPlacement,
    animationVariant,
    animateContainer,
    disableAnimation
  } = useMenuContext();

  const shouldAnimate = animateContainer && !disableAnimation && animationVariant !== 'none';
  const finalPlacement = placementOverride || contextPlacement;

  return (
    <Popover.Positioner positioning={{ placement: finalPlacement }}>
      <Popover.Content
        maxHeight={maxHeight}
        className={cn(
          'menu-content',
          `menu-content--${size}`,
          shouldAnimate && 'menu-content--animated',
          shouldAnimate && `menu-content--${animationVariant}`,
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
  key?: Key;
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
  key,
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
    getAndIncrementItemIndex
  } = useMenuContext();

  // Track this item's index for stagger animation (using useMemo is safe with ref mutation)
  const myIndex = useMemo(() => getAndIncrementItemIndex(), [getAndIncrementItemIndex]);

  const shouldClose = itemCloseOnSelect ?? rootCloseOnSelect;
  const itemKey = key || value;
  const isDisabled = disabled || (itemKey ? disabledKeys.has(itemKey) : false);
  const isSelected = itemKey ? selectedKeys.has(itemKey) : false;

  const shouldAnimateItem = animateItems && !disableAnimation && animationVariant !== 'none';
  const animationDelay = shouldAnimateItem ? myIndex * itemStagger : 0;

  const handleClick = () => {
    if (isDisabled) return;

    // Handle selection
    if (selectionMode !== 'none' && itemKey) {
      const newKeys = new Set(selectedKeys);
      if (selectionMode === 'single') {
        newKeys.clear();
        if (!isSelected) {
          newKeys.add(itemKey);
        }
      } else if (selectionMode === 'multiple') {
        if (isSelected) {
          newKeys.delete(itemKey);
        } else {
          newKeys.add(itemKey);
        }
      }
      onSelectionChange?.(newKeys);
    }

    // Handle actions
    onClick?.();
    onAction?.();
    if (itemKey) {
      rootOnAction?.(itemKey);
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
