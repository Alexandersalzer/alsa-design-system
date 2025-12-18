// ===============================================
// src/design-system/components/primitives/Nav/Nav.tsx
// Navigation primitives - properly uses your Icon component
// ===============================================

import React, { createContext, useContext, forwardRef, ReactNode } from 'react';
import { cn } from '../../../utils/cn';
import { Icon, IconColor } from '../../media';

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
  gap?: 'sm' | 'md' | 'lg' | 'xl'; // Add gap prop
  collapsed?: boolean; // Add collapsed prop
}

const NavRoot = forwardRef<HTMLElement, NavRootProps>(({
  children,
  variant = 'sidebar',
  currentPath,
  className,
  gap = 'md', // Default gap
  collapsed = false, // Default collapsed
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
// ADD 'export' keyword here!
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

  const getIconColor = (): IconColor => {
    if (isDisabled) return 'nav-item';
    if (active) return 'nav-item-selected';
    return 'nav-item';
  };

  // Check if icon is a custom component (Logo, Avatar, etc.) or a raw SVG
  const isCustomComponent = React.isValidElement(icon) &&
    typeof icon.type !== 'string'; // Not a native HTML element like 'svg'

  const content = (
    <>
      {icon && (
        <span className="nav-item__icon">
          {isCustomComponent ? (
            // Render custom components (Logo, Avatar) directly without Icon wrapper
            icon
          ) : (
            // Wrap SVG icons in Icon component
            <Icon
              size="lg"
              color={getIconColor()}
            >
              {icon}
            </Icon>
          )}
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
    'aria-label': collapsed ? String(children) : undefined, // Add aria-label when collapsed
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