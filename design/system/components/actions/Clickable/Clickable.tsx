// ===============================================
// design/system/components/actions/Clickable/Clickable.tsx
// GENERIC INTERACTIVE CONTAINER - Fully styled and polished
// ===============================================

import React, { forwardRef, type ReactNode, type HTMLAttributes } from 'react';
import { cn } from '../../../lib/utils';
import './Clickable.css';

// ===== TYPE DEFINITIONS =====

export type ClickableAs = 'div' | 'button' | 'a' | 'li';
export type ClickablePadding = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
export type ClickableRadius = 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'; // ✅ Added 2xl and full
export type ClickableBackground = 'transparent' | 'subdued' | 'card' | 'hover' | 'selected';
export type ClickableBorder = 'none' | 'base' | 'strong' | 'subtle';

export interface ClickableProps extends Omit<HTMLAttributes<HTMLElement>, 'onClick'> {
  children: ReactNode;
  
  // Interaction
  onClick?: () => void;
  href?: string;
  target?: '_blank' | '_self' | '_parent' | '_top';
  disabled?: boolean;
  loading?: boolean;
  
  // Visual states
  interactive?: boolean;
  selected?: boolean;
  
  // Layout & Styling
  as?: ClickableAs;
  padding?: ClickablePadding;
  paddingBlock?: ClickablePadding;
  paddingInline?: ClickablePadding;
  borderRadius?: ClickableRadius;
  background?: ClickableBackground;
  border?: ClickableBorder;
  borderStyle?: 'solid' | 'dashed' | 'dotted';
  
  // Width control
  width?: 'auto' | 'full';
  maxWidth?: string;
  
  // Event handling control
  stopPropagationOnInteractive?: boolean;
  
  // Accessibility
  role?: string;
  'aria-label'?: string;
  'aria-disabled'?: boolean;
  'aria-selected'?: boolean;
  
  className?: string;
}

// ===== CLICKABLE COMPONENT =====

export const Clickable = forwardRef<HTMLElement, ClickableProps>(({
  children,
  onClick,
  href,
  target,
  disabled = false,
  loading = false,
  interactive = true,
  selected = false,
  as = 'div',
  padding = 'md',
  paddingBlock,
  paddingInline,
  borderRadius = 'md',
  background = 'transparent',
  border = 'none',
  borderStyle = 'solid',
  width = 'auto',
  maxWidth,
  stopPropagationOnInteractive = true,
  role,
  className,
  ...props
}, ref) => {
  
  const Component = href ? 'a' : as;
  
  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    if (disabled || loading) {
      e.preventDefault();
      return;
    }
    
    if (stopPropagationOnInteractive && onClick) {
      const target = e.target as HTMLElement;
      const interactiveParent = target.closest(
        'button, a, input, select, textarea, [role="button"], [role="link"], [data-interactive="true"]'
      );
      
      if (interactiveParent && interactiveParent !== e.currentTarget) {
        return;
      }
    }
    
    onClick?.();
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    if (disabled || loading) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      
      if (stopPropagationOnInteractive && onClick) {
        const target = e.target as HTMLElement;
        const interactiveParent = target.closest(
          'button, a, input, select, textarea, [role="button"], [role="link"]'
        );
        
        if (interactiveParent && interactiveParent !== e.currentTarget) {
          return;
        }
      }
      
      onClick?.();
    }
  };
  
  const isInteractive = interactive && !disabled && !loading;
  
  return (
    <Component
      ref={ref as any}
      className={cn(
        'clickable',
        `clickable--padding-${padding}`,
        paddingBlock && `clickable--padding-block-${paddingBlock}`,
        paddingInline && `clickable--padding-inline-${paddingInline}`,
        `clickable--radius-${borderRadius}`,
        `clickable--bg-${background}`,
        `clickable--border-${border}`,
        borderStyle !== 'solid' && `clickable--border-style-${borderStyle}`,
        `clickable--width-${width}`,
        isInteractive && 'clickable--interactive',
        disabled && 'clickable--disabled',
        loading && 'clickable--loading',
        selected && 'clickable--selected',
        className
      )}
      style={{ maxWidth }}
      onClick={handleClick}
      onKeyDown={Component !== 'a' ? handleKeyDown : undefined}
      href={href}
      target={target}
      role={role || (Component === 'div' && isInteractive ? 'button' : undefined)}
      tabIndex={isInteractive ? 0 : -1}
      aria-label={props['aria-label']}
      aria-disabled={disabled || loading}
      aria-selected={selected}
      {...props}
    >
      {children}
    </Component>
  );
});

Clickable.displayName = 'Clickable';