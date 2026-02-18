// ===============================================
// src/design-system/components/navigation/Nav/Nav.tsx
// Navigation primitives with variant/size system (Button-style)
// ===============================================

import React, { createContext, useContext, forwardRef, ReactNode, useState, useCallback } from 'react';
import { cn } from '../../../utils/cn';
import { ListboxItem } from '../../lists/Listbox/ListboxItem';
import { Icon } from '../../media';
import { TypographyWeight } from '../../Typography';

// ===============================================
// TYPES
// ===============================================

/** Nav layout variant - controls the nav container layout */
export type NavLayout = 'sidebar' | 'horizontal' | 'tabs';

/** Nav surface variant - controls what surface the nav sits on */
export type NavSurface = 'page' | 'raised' | 'sunken';

/** Nav.Item visual variant - controls colors/appearance */
export type NavItemVariant = 'default' | 'accent' | 'ghost';

/** Nav.Item size - controls height/padding/text */
export type NavItemSize = 'sm' | 'md';

// ===============================================
// CONTEXT
// ===============================================

interface NavContextValue {
  layout: NavLayout;
  surface: NavSurface;
  currentPath?: string;
  collapsed?: boolean;
}

const NavContext = createContext<NavContextValue>({
  layout: 'sidebar',
  surface: 'raised',
  collapsed: false
});

// ===============================================
// NAV ROOT
// ===============================================

export interface NavRootProps extends React.HTMLAttributes<HTMLElement> {
  children: ReactNode;
  /** Layout variant: sidebar (vertical), horizontal, or tabs */
  layout?: NavLayout;
  /** @deprecated Use `layout` instead */
  variant?: NavLayout;
  /** Surface the nav sits on - affects child item hover/active colors */
  surface?: NavSurface;
  /** Current active path for auto-matching */
  currentPath?: string;
  /** Gap between sections */
  gap?: 'sm' | 'md' | 'lg' | 'xl';
  /** Collapsed state (icon-only mode) */
  collapsed?: boolean;
  className?: string;
}

const NavRoot = forwardRef<HTMLElement, NavRootProps>(({
  children,
  layout,
  variant, // deprecated, for backwards compat
  surface = 'raised',
  currentPath,
  gap = 'md',
  collapsed = false,
  className,
  ...props
}, ref) => {
  // Support deprecated 'variant' prop
  const effectiveLayout = layout ?? variant ?? 'sidebar';

  const gapMap = { sm: '2', md: '3', lg: '4', xl: '5' };

  return (
    <NavContext.Provider value={{ layout: effectiveLayout, surface, currentPath, collapsed }}>
      <nav
        ref={ref}
        className={cn(
          'nav-root',
          `nav-root--${effectiveLayout}`,
          `nav-root--surface-${surface}`,
          collapsed && 'nav-root--collapsed',
          className
        )}
        role="navigation"
        data-surface={surface}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: `var(--foundation-space-${gapMap[gap]})`
        }}
        {...props}
      >
        {children}
      </nav>
    </NavContext.Provider>
  );
});
NavRoot.displayName = 'NavRoot';

// ===============================================
// NAV LIST
// ===============================================

export interface NavListProps extends React.HTMLAttributes<HTMLUListElement> {
  children: ReactNode;
  label?: string;
  className?: string;
}

const NavList = forwardRef<HTMLUListElement, NavListProps>(({
  children,
  label,
  className,
  ...props
}, ref) => {
  const { layout } = useContext(NavContext);

  return (
    <ul
      ref={ref}
      className={cn('nav-list', `nav-list--${layout}`, className)}
      role="list"
      aria-label={label}
      {...props}
    >
      {children}
    </ul>
  );
});
NavList.displayName = 'NavList';

// ===============================================
// NAV ITEM
// ===============================================

export interface NavPrimitiveItemProps {
  children: ReactNode;
  /** URL for path matching */
  href?: string;
  /** Force active state (overrides path matching) */
  isActive?: boolean;
  /** Disabled state */
  isDisabled?: boolean;
  /** Leading icon element */
  icon?: React.ReactElement;
  /** Trailing badge/indicator */
  badge?: ReactNode;
  /** Visual variant */
  variant?: NavItemVariant;
  /** Size variant */
  size?: NavItemSize;
  /** Click handler */
  onClick?: () => void;
  className?: string;
}

/**
 * Nav.Item - Navigation item with variant/size support
 *
 * Variants:
 * - `default`: Neutral colors - subtle hover, neutral background + text/icon on active
 * - `accent`: Accent colors - accent background + accent text/icon on active
 * - `ghost`: No background - accent text/icon on active only (minimal style)
 *
 * Sizes:
 * - `sm`: 32px height, tighter padding
 * - `md`: 40px height, standard padding
 *
 * Surface-aware:
 * Nav.Item automatically adapts to the parent Nav.Root's surface prop.
 * - `page` surface → hover: raised, active: raised
 * - `raised` surface → hover: elevated, active: elevated
 * - `sunken` surface → hover: raised, active: raised
 */
const NavItem = forwardRef<HTMLLIElement, NavPrimitiveItemProps>(({
  children,
  href,
  onClick,
  isActive,
  isDisabled,
  icon,
  badge,
  variant = 'default',
  size = 'sm',
  className,
}, ref) => {
  const { layout, surface, currentPath, collapsed } = useContext(NavContext);
  const active = isActive ?? (href ? currentPath === href : false);
  const [optimisticActive, setOptimisticActive] = useState(false);

  // Show active state immediately on click (optimistic) while waiting for route change
  const effectiveActive = active || optimisticActive;

  const handleClick = useCallback((_e: React.MouseEvent<HTMLLIElement>) => {
    if (isDisabled) return;
    setOptimisticActive(true);
    onClick?.();
    // Reset optimistic state after a short delay in case navigation doesn't happen
    setTimeout(() => setOptimisticActive(false), 1500);
  }, [isDisabled, onClick]);

  // Icon wrapped in Icon component for size/weight normalization
  // NO color prop - CSS handles it via currentColor
  const iconSize = size === 'sm' ? 'sm' : 'md';
  const iconElement = icon ? (
    <Icon size={iconSize} weight="light" aria-hidden>
      {icon}
    </Icon>
  ) : undefined;

  // Label weight based on active state
  const labelWeight: TypographyWeight = effectiveActive ? 'semibold' : 'medium';
  const labelSize = size === 'sm' ? 'sm' : 'md';

  return (
    <ListboxItem
      ref={ref}
      role="listitem"
      selected={effectiveActive}
      disabled={isDisabled}
      onClick={handleClick}
      leading={iconElement}
      trailing={badge}
      className={cn(
        'nav-item',
        `nav-item--${layout}`,
        `nav-item--${variant}`,
        `nav-item--${size}`,
        `nav-item--surface-${surface}`,
        effectiveActive && 'nav-item--active',
        isDisabled && 'nav-item--disabled',
        collapsed && 'nav-item--collapsed',
        className
      )}
      aria-current={effectiveActive ? 'page' : undefined}
      aria-label={collapsed ? String(children) : undefined}
    >
      {/*
        IMPORTANT: Do NOT pass color prop to Label here!
        We use CSS currentColor inheritance from .nav-item parent.
        Passing color would apply inline styles that override CSS.
      */}
      <span
        className={cn(
          'nav-item__label',
          `text-label-${labelSize}`,
          `font-weight-${labelWeight}`
        )}
      >
        {children}
      </span>
    </ListboxItem>
  );
});
NavItem.displayName = 'NavItem';

// ===============================================
// NAV SECTION
// ===============================================

export interface NavSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  label?: string;
  className?: string;
}

const NavSection = forwardRef<HTMLDivElement, NavSectionProps>(({
  children,
  label,
  className,
  ...props
}, ref) => {
  return (
    <div ref={ref} className={cn('nav-section', className)} {...props}>
      {label && <div className="nav-section__label">{label}</div>}
      <div className="nav-section__content">{children}</div>
    </div>
  );
});
NavSection.displayName = 'NavSection';

// ===============================================
// COMPOUND EXPORT
// ===============================================

export const Nav = {
  Root: NavRoot,
  List: NavList,
  Item: NavItem,
  Section: NavSection
};

// Re-export types for external use
export type { NavLayout as NavVariant }; // backwards compat alias
