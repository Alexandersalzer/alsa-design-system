// ===============================================
// src/design-system/components/navigation/Nav/Nav.tsx
// Navigation primitives - uses ListboxItem for interaction
// ===============================================

import React, { createContext, useContext, forwardRef, ReactNode } from 'react';
import { cn } from '../../../utils/cn';
import { ListboxItem } from '../../lists/Listbox/ListboxItem';
import { Icon } from '../../media';
import { Label } from '../../Typography';

// ===== TYPES =====
export type NavVariant = 'sidebar' | 'horizontal' | 'tabs';

interface NavContextValue {
  variant: NavVariant;
  currentPath?: string;
  collapsed?: boolean;
}

const NavContext = createContext<NavContextValue>({
  variant: 'sidebar',
  collapsed: false
});

// ===== NAV ROOT =====
export interface NavRootProps extends React.HTMLAttributes<HTMLElement> {
  children: ReactNode;
  variant?: NavVariant;
  currentPath?: string;
  className?: string;
  gap?: 'sm' | 'md' | 'lg' | 'xl';
  collapsed?: boolean;
}

const NavRoot = forwardRef<HTMLElement, NavRootProps>(({
  children,
  variant = 'sidebar',
  currentPath,
  className,
  gap = 'md',
  collapsed = false,
  ...props
}, ref) => {
  return (
    <NavContext.Provider value={{ variant, currentPath, collapsed }}>
      <nav
        ref={ref}
        className={cn(
          'nav-root',
          `nav-root--${variant}`,
          collapsed && 'nav-root--collapsed',
          className
        )}
        role="navigation"
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: `var(--foundation-space-${gap === 'sm' ? '2' : gap === 'md' ? '3' : gap === 'lg' ? '4' : '5'})`
        }}
        {...props}
      >
        {children}
      </nav>
    </NavContext.Provider>
  );
});
NavRoot.displayName = 'NavRoot';

// ===== NAV LIST =====
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
  const { variant } = useContext(NavContext);

  return (
    <ul
      ref={ref}
      className={cn('nav-list', `nav-list--${variant}`, className)}
      role="list"
      aria-label={label}
      {...props}
    >
      {children}
    </ul>
  );
});

NavList.displayName = 'NavList';

// ===== NAV ITEM =====
export interface NavPrimitiveItemProps {
  children: ReactNode;
  href?: string;
  isActive?: boolean;
  isDisabled?: boolean;
  icon?: React.ReactElement;
  badge?: ReactNode;
  className?: string;
  onClick?: () => void;
}

/**
 * Nav.Item - Navigation item that uses ListboxItem internally
 *
 * Color is controlled by CSS on the .nav-item class:
 * - Default: var(--text-secondary)
 * - Active: var(--text-accent)
 * - Disabled: var(--text-disabled)
 *
 * Icons inherit color via CSS currentColor, not via props.
 */
const NavItem = forwardRef<HTMLLIElement, NavPrimitiveItemProps>(({
  children,
  href,
  onClick,
  isActive,
  isDisabled,
  icon,
  badge,
  className,
}, ref) => {
  const { variant, currentPath, collapsed } = useContext(NavContext);
  const active = isActive ?? (href ? currentPath === href : false);

  // Icon wrapped in Icon component for size/weight, but NO color prop
  // Color comes from CSS currentColor inheritance
  const iconElement = icon ? (
    <Icon size="md" weight="light" aria-hidden>
      {icon}
    </Icon>
  ) : undefined;

  return (
    <ListboxItem
      ref={ref}
      role="listitem"
      selected={active}
      disabled={isDisabled}
      onClick={onClick}
      leading={iconElement}
      trailing={badge}
      className={cn(
        'nav-item',
        `nav-item--${variant}`,
        active && 'nav-item--active',
        isDisabled && 'nav-item--disabled',
        collapsed && 'nav-item--collapsed',
        className
      )}
      aria-current={active ? 'page' : undefined}
      aria-label={collapsed ? String(children) : undefined}
    >
      <Label
        size="md"
        weight={active ? 'bold' : 'semibold'}
        className="nav-item__label"
      >
        {children}
      </Label>
    </ListboxItem>
  );
});

NavItem.displayName = 'NavItem';

// ===== NAV SECTION =====
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

// ===== COMPOUND COMPONENT EXPORT =====
export const Nav = {
  Root: NavRoot,
  List: NavList,
  Item: NavItem,
  Section: NavSection
};
