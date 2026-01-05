// ===============================================
// src/design-system/components/primitives/Button/Button.tsx
// CLEAN BUTTON - USES LABEL WITHOUT COLOR PROP
// ===============================================

'use client';

import React, { forwardRef, ReactNode, useState } from 'react';
import Link from 'next/link';
import { cn } from '../../../utils/cn';
import { Label } from '../../Typography';
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
  componentKey?: string;
  action?: ActionConfig;
  formData?: Record<string, any>;
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
    
    const actionHook = action ? useAction(action) : null;
    const isDisabled = disabled || loading || internalLoading;
    
    const getEffectiveHref = () => {
      if (action?.type === 'navigation') {
        return (action as NavigationActionConfig).settings.href;
      }
      return href;
    };
    
    const effectiveHref = getEffectiveHref();
    const localeAwareHref = effectiveHref ? buildHref(effectiveHref) : undefined;
    
    const effectiveTarget = 
      (action?.type === 'navigation' && (action as NavigationActionConfig).settings.openInNewTab) 
        ? '_blank' 
        : target;

    // Map button size to Label size
    const getLabelSize = (btnSize: string): 'sm' | 'md' | 'lg' => {
      const sizeMap = { 
        sm: 'sm' as const, 
        md: 'md' as const, 
        lg: 'lg' as const, 
        xl: 'lg' as const // xl buttons use lg label
      };
      return sizeMap[btnSize as keyof typeof sizeMap] || 'md';
    };

    // Map button size to Label weight
    const getLabelWeight = (btnSize: string) => {
      return (btnSize === 'sm' || btnSize === 'md') ? 'semibold' : 'bold';
    };

    const buttonClasses = cn(
      'btn',
      `btn-${variant}`,
      `btn-${size}`,
      `btn-radius-${radius}`,
      fullWidth && 'btn-full-width',
      className,
      isDisabled && 'pointer-events-none opacity-60'
    );

    const handleActionClick = async (e: React.MouseEvent) => {
      if (action?.type === 'navigation' && actionHook) {
        e.preventDefault();
        await actionHook.execute({});
        return;
      }

      if (!action) {
        onClick?.(e as any);
        return;
      }

      e.preventDefault();
      setInternalLoading(true);
      
      try {
        await actionHook!.execute(formData || {});
      } finally {
        setInternalLoading(false);
      }
    };

    // ✅ SOLUTION: Use Label component but WITHOUT color prop
    // Color is inherited from parent .btn-{variant} via CSS
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
        {!loading && !internalLoading && leftIcon && (
          <span className="flex-shrink-0">{leftIcon}</span>
        )}
        {/* ✅ Label without color prop - inherits from parent */}
        <Label
          size={getLabelSize(size)}
          weight={getLabelWeight(size)}
          as="span"
          className="btn-text"
        >
          {children}
        </Label>
        {!loading && !internalLoading && rightIcon && (
          <span className="flex-shrink-0">{rightIcon}</span>
        )}
      </>
    );

    // Render as Link or <a>
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

    // Render as <button>
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