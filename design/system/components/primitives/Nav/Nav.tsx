// ===============================================
// src/design-system/components/primitives/Nav/Nav.tsx
// Navigation primitives - properly uses your Icon component
// ===============================================

import React, { createContext, useContext, forwardRef, ReactNode } from 'react';
import { cn } from '../../../lib/utils';
import { Icon, IconColor } from '../Icon/Icon';

// ===== TYPES =====
export type NavVariant = 'sidebar' | 'horizontal' | 'tabs';

interface NavContextValue {
  variant: NavVariant;
  currentPath?: string;
}

const NavContext = createContext<NavContextValue>({
  variant: 'sidebar'
});

// ===== NAV ROOT =====
export interface NavRootProps extends React.HTMLAttributes<HTMLElement> {
  children: ReactNode;
  variant?: NavVariant;
  currentPath?: string;
  className?: string;
}

export const NavRoot = forwardRef<HTMLElement, NavRootProps>(({
  children,
  variant = 'sidebar',
  currentPath,
  className,
  ...props
}, ref) => {
  return (
    <NavContext.Provider value={{ variant, currentPath }}>
      <nav
        ref={ref}
        className={cn('nav-root', `nav-root--${variant}`, className)}
        role="navigation"
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

export const NavList = forwardRef<HTMLDivElement, NavListProps>(({
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
export interface NavItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  href?: string;
  isActive?: boolean;
  isDisabled?: boolean;
  icon?: React.ReactElement;
  badge?: ReactNode;
  className?: string;
  as?: 'button' | 'a';
}

export const NavItem = forwardRef<HTMLButtonElement, NavItemProps>(({
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
  const { variant, currentPath } = useContext(NavContext);
  const active = isActive ?? (href && currentPath === href);

  const classes = cn(
    'nav-item',
    `nav-item--${variant}`,
    active && 'nav-item--active',
    isDisabled && 'nav-item--disabled',
    className
  );

  const getIconColor = (): IconColor => {
    if (isDisabled) return 'nav-item';
    if (active) return 'nav-item-selected';
    return 'nav-item';
  };

  const content = (
    <>
      {icon && (
        <span className="nav-item__icon">
          <Icon 
            size="lg" 
            color={getIconColor()} 
            weight="medium"
          >
            {icon}
          </Icon>
        </span>
      )}
      <span className="nav-item__label">{children}</span>
      {badge && <span className="nav-item__badge">{badge}</span>}
    </>
  );

  const Element = as;
  const elementProps: any = {
    ref,
    className: classes,
    'aria-current': active ? 'page' : undefined,
    'aria-disabled': isDisabled,
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

export const NavSection = forwardRef<HTMLDivElement, NavSectionProps>(({
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