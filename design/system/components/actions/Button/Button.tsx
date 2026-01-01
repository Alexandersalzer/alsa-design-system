
// ===============================================
// src/design-system/components/primitives/Button/Button.tsx
// ===============================================

'use client';

import React, { forwardRef, ReactNode, useState } from 'react';
import Link from 'next/link';
import { cn } from '../../../utils/cn';
import { Label, TypographyColor, TypographyWeight } from '../../Typography';
import { Spinner } from '../../feedback';
import { useHref } from '../../../hooks/useHref';
import { Component } from '../../frames/component/Component';
import { useAction } from '../../../core/actions/useAction';
import type { ActionConfig, NavigationActionConfig } from '../../../core/actions/types';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  href?: string;
  target?: string;
  variant?: 'brand' | 'primary' | 'secondary' | 'accent' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  radius?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
  loading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
  componentKey?: string; // För live editing identification
  action?: ActionConfig; // För actions: contact, newsletter, booking
  formData?: Record<string, any>; // Data to submit with action
}

export const Button = forwardRef<
  HTMLButtonElement | HTMLAnchorElement,
  ButtonProps
>(
  (
    {
      className,
      href,
      target,
      variant = 'primary',
      size = 'md',
      radius = 'md',
      children,
      loading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      disabled,
      componentKey,
      action,
      formData,
      onClick,
      ...props
    },
    ref
  ) => {
    const { buildHref } = useHref();
    const [internalLoading, setInternalLoading] = useState(false);
    
    // Use action hook if action is provided
    const actionHook = action ? useAction(action) : null;
    const isDisabled = disabled || loading || internalLoading;
    
    // Build locale-aware href
    // Priority: action.settings.href > direct href prop
    const getEffectiveHref = () => {
      if (action?.type === 'navigation') {
        return (action as NavigationActionConfig).settings.href;
      }
      return href;
    };
    
    const effectiveHref = getEffectiveHref();
    const localeAwareHref = effectiveHref ? buildHref(effectiveHref) : undefined;
    
    // Get target from action or prop
    const effectiveTarget = 
      (action?.type === 'navigation' && (action as NavigationActionConfig).settings.openInNewTab) 
        ? '_blank' 
        : target;

    const getTypographyProps = (
      variant: string,
      size: string,
      isDisabled: boolean
    ): {
      size: 'sm' | 'md' | 'lg';
      weight: TypographyWeight;
      color: TypographyColor;
    } => {
      const sizeMap = { sm: 'sm', md: 'md', lg: 'lg', xl: 'lg' } as const;
      const weightMap = { sm: 'semibold', md: 'bold', lg: 'bold', xl: 'bold' } as const;

      const getColor = (): TypographyColor => {
        if (isDisabled) return 'button-disabled';
        switch (variant) {
          case 'brand':
            return 'button-brand';
          case 'primary':
            return 'button-primary';
          case 'secondary':
            return 'button-secondary';
          case 'accent':
            return 'button-accent';
          case 'ghost':
            return 'secondary';
          case 'destructive':
            return 'button-destructive';
          default:
            return 'button-primary';
        }
      };

      return {
        size: sizeMap[size as keyof typeof sizeMap],
        weight: weightMap[size as keyof typeof weightMap],
        color: getColor(),
      };
    };

    const typographyProps = getTypographyProps(variant, size, isDisabled);

    const buttonClasses = cn(
      'btn',
      `btn-${variant}`,
      `btn-${size}`,
      `btn-radius-${radius}`,
      fullWidth && 'btn-full-width',
      className,
      isDisabled && 'pointer-events-none opacity-60'
    );

    // Handle action execution
    const handleActionClick = async (e: React.MouseEvent) => {
      // If it's a navigation action, let useAction handle it
      if (action?.type === 'navigation' && actionHook) {
        e.preventDefault();
        await actionHook.execute({});
        return;
      }

      // If no action but has href, let default link behavior handle it
      if (!action) {
        onClick?.(e as any);
        return;
      }

      // Other actions (contact, newsletter, booking)
      e.preventDefault();
      setInternalLoading(true);
      
      try {
        await actionHook!.execute(formData || {});
      } finally {
        setInternalLoading(false);
      }
    };

    const content = (
      <>
        {(loading || internalLoading) && (
          <span className="btn-spinner" aria-hidden="true">
            <Spinner
              size={size === 'sm' ? 'xs' : 'sm'}
              variant={variant}
              disabled={disabled}
              animationDuration="0.6s"
            />
          </span>
        )}
        {!loading && !internalLoading && leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
        <Label
          size={typographyProps.size}
          weight={typographyProps.weight}
          color={typographyProps.color}
          as="span"
          className="btn-text"
        >
          {children}
        </Label>
        {!loading && !internalLoading && rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
      </>
    );

    // 🔗 Render as Link or <a>
    if (localeAwareHref && !action) {
      const isInternal = localeAwareHref.startsWith('/');
      const linkProps = {
        className: buttonClasses,
        target: effectiveTarget,
        rel: effectiveTarget === '_blank' ? 'noopener noreferrer' : undefined,
      };

      if (isInternal) {
        return (
          <Component componentKey={componentKey}>
            <Link href={localeAwareHref} {...linkProps}>
              {content}
            </Link>
          </Component>
        );
      }

      return (
        <Component componentKey={componentKey}>
          <a href={localeAwareHref} {...linkProps}>
            {content}
          </a>
        </Component>
      );
    }

    // 🧠 Render as <button> with action handling
    // For navigation actions or form submission actions
    return (
      <Component componentKey={componentKey}>
        <button
          ref={ref as React.Ref<HTMLButtonElement>}
          type={action ? 'button' : (props.type as any)}
          className={buttonClasses}
          disabled={isDisabled}
          aria-busy={loading || internalLoading}
          onClick={handleActionClick}
          {...props}
        >
          {content}
        </button>
      </Component>
    );
  }
);

Button.displayName = 'Button';

export default Button;
