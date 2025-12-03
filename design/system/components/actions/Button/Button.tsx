
// ===============================================
// src/design-system/components/primitives/Button/Button.tsx
// ===============================================

'use client';

import React, { forwardRef, ReactNode } from 'react';
import Link from 'next/link';
import { cn } from '../../../utils/cn';
import { Label, TypographyColor, TypographyWeight } from '../../Typography';
import { Spinner } from '../../feedback';
import { useHref } from '../../../hooks/useHref';
import { Component } from '../../frames/component/Component';

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
  componentKey?: string; // För live editing identification
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
      disabled,
      componentKey,
      ...props
    },
    ref
  ) => {
    const { buildHref } = useHref();
    const isDisabled = disabled || loading;
    
    // Build locale-aware href
    const localeAwareHref = href ? buildHref(href) : undefined;

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
      className,
      isDisabled && 'pointer-events-none opacity-60'
    );

    const content = (
      <>
        {loading && (
          <span className="btn-spinner" aria-hidden="true">
            <Spinner
              size={size === 'sm' ? 'xs' : 'sm'}
              variant={variant}
              disabled={disabled}
              animationDuration="0.6s"
            />
          </span>
        )}
        {!loading && leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
        <Label
          size={typographyProps.size}
          weight={typographyProps.weight}
          color={typographyProps.color}
          as="span"
          className="btn-text"
        >
          {children}
        </Label>
        {!loading && rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
      </>
    );

    // 🔗 Render as Link or <a>
    if (localeAwareHref) {
      const isInternal = localeAwareHref.startsWith('/');
      const linkProps = {
        className: buttonClasses,
        target,
        rel: target === '_blank' ? 'noopener noreferrer' : undefined,
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

    // 🧠 Render as <button>
    return (
      <Component componentKey={componentKey}>
        <button
          ref={ref as React.Ref<HTMLButtonElement>}
          className={buttonClasses}
          disabled={isDisabled}
          aria-busy={loading}
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
