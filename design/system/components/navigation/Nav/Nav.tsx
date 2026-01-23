// ===============================================
// src/design-system/components/navigation/Nav/Nav.tsx
// Navigation primitives - clean, semantic navigation component
// ===============================================

import React, { createContext, useContext, forwardRef, ReactNode } from 'react';
import { cn } from '../../../utils/cn';
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
export interface NavListProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  label?: string;
  className?: string;
}

const NavList = forwardRef<HTMLDivElement, NavListProps>(({
  children,
  label,
  className,
  ...props
}, ref) => {
  const { variant } = useContext(NavContext);

  return (
    <div
      ref={ref}
      className={cn('nav-list', `nav-list--${variant}`, className)}
      role="list"
      aria-label={label}
      {...props}
    >
      {children}
    </div>
  );
});

NavList.displayName = 'NavList';

// ===== NAV ITEM =====
export interface NavPrimitiveItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  href?: string;
  isActive?: boolean;
  isDisabled?: boolean;
  icon?: React.ReactElement;
  badge?: ReactNode;
  className?: string;
  as?: 'button' | 'a';
}

const NavItem = forwardRef<HTMLButtonElement, NavPrimitiveItemProps>(({
  children,
  href,
  onClick,
  isActive,
  isDisabled,
  icon,
  badge,
  className,
  as = 'button',
  ...props
}, ref) => {
  const { variant, currentPath, collapsed } = useContext(NavContext);
  const active = isActive ?? (href && currentPath === href);

  const classes = cn(
    'nav-item',
    `nav-item--${variant}`,
    active && 'nav-item--active',
    isDisabled && 'nav-item--disabled',
    collapsed && 'nav-item--collapsed',
    className
  );

  const content = (
    <>
      {icon && (
        <span className="nav-item__icon">
          {icon}
        </span>
      )}
      <Label
        size="md"
        weight={active ? 'bold' : 'semibold'}
        color="inherit"
        className="nav-item__label"
      >
        {children}
      </Label>
      {badge && <span className="nav-item__badge">{badge}</span>}
    </>
  );

  const Element = as;
  const elementProps: any = {
    ref,
    className: classes,
    'aria-current': active ? 'page' : undefined,
    'aria-disabled': isDisabled,
    'aria-label': collapsed ? String(children) : undefined,
    role: 'listitem',
  };

  if (as === 'a') {
    elementProps.href = href;
    elementProps.onClick = onClick;
  } else {
    elementProps.type = 'button';
    elementProps.onClick = onClick;
    elementProps.disabled = isDisabled;
    Object.assign(elementProps, props);
  }

  return React.createElement(Element, elementProps, content);
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
