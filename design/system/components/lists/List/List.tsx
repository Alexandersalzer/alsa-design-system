// ===============================================
// design/system/components/layout/List/List.tsx
// SEMANTIC LIST WRAPPER - Properly styled
// ===============================================

import React, { forwardRef, type ReactNode, type HTMLAttributes } from 'react';
import { cn } from '../../../utils/cn';
import './List.css';

// ===== TYPE DEFINITIONS =====

export type ListVariant = 'default' | 'divided' | 'bordered';
export type ListSpacing = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface ListProps extends HTMLAttributes<HTMLUListElement | HTMLOListElement> {
  children: ReactNode;
  
  // List type
  ordered?: boolean;
  
  // Visual variants
  variant?: ListVariant;
  spacing?: ListSpacing;
  
  // Accessibility
  'aria-label'?: string;
  role?: 'list' | 'listbox' | 'menu';
  
  className?: string;
}

// ===== LIST COMPONENT =====

export const List = forwardRef<HTMLUListElement | HTMLOListElement, ListProps>(({
  children,
  ordered = false,
  variant = 'default',
  spacing = 'none',
  role = 'list',
  className,
  ...props
}, ref) => {
  
  const Component = ordered ? 'ol' : 'ul';
  
  return (
    <Component
      ref={ref as any}
      role={role}
      className={cn(
        'list',
        `list--${variant}`,
        `list--spacing-${spacing}`,
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
});

List.displayName = 'List';