// ===============================================
// src/design-system/components/primitives/TextLink/TextLink.tsx
// TextLink primitive component inspired by Button but for semantic links
// ===============================================

import React, { forwardRef, ReactNode } from 'react';
import Link from 'next/link';
import { cn } from '../../../utils/cn';
import { Label, TypographyColor, TypographyWeight } from '../../Typography';
import { useLocaleHref } from '../../../hooks/useLocaleHref';
import { Component } from '../../frames/component/Component';
import './TextLink.css';

export interface TextLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'accent' | 'ghost' | 'brand';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  weight?: 'regular' | 'medium' | 'semibold' | 'bold';
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  underline?: 'none' | 'hover' | 'always';
  disabled?: boolean;
}

export const TextLink = forwardRef<HTMLAnchorElement, TextLinkProps>(({
  className,
  variant = 'primary',
  size = 'md',
  weight = 'medium',
  children,
  leftIcon,
  rightIcon,
  underline = 'hover',
  disabled = false,
  href,
  ...props
}, ref) => {
  
  const { buildHref } = useLocaleHref();
  
  // Build locale-aware href
  const localeAwareHref = href ? buildHref(href) : undefined;
  
  // Map textlink variant + state to typography properties
  const getTypographyProps = (
    variant: string, 
    size: string, 
    disabled: boolean
  ): { size: 'sm' | 'md' | 'lg'; weight: TypographyWeight; color: TypographyColor } => {
    
    // Size mapping
    const sizeMap = {
      sm: 'sm' as const,
      md: 'md' as const, 
      lg: 'lg' as const,
      xl: 'lg' as const, // xl uses lg typography
    };

    // Color mapping based on variant and state
    const getColor = (): TypographyColor => {
      if (disabled) {
        return 'disabled';
      }

      switch (variant) {
        case 'primary':
          return 'primary';
        case 'secondary':
          return 'secondary';
        case 'accent':
          return 'accent';
        case 'ghost':
          return 'tertiary';
        case 'brand':
          return 'heading'; // Strong color for brand text
        default:
          return 'primary';
      }
    };

    return {
      size: sizeMap[size as keyof typeof sizeMap] || sizeMap.md,
      weight: weight as TypographyWeight,
      color: getColor()
    };
  };

  const typographyProps = getTypographyProps(variant, size, disabled);

  // Build textlink classes
  const textLinkClasses = cn(
    'textlink',
    `textlink-${variant}`,
    `textlink-${size}`,
    `textlink-underline-${underline}`,
    disabled && 'textlink-disabled',
    className
  );

  // Check if this is a .html file (edit mode) or regular Next.js route
  const isHtmlFile = localeAwareHref?.endsWith('.html');

  // Content to render inside the link
  const linkContent = (
    <>
      {/* Left Icon */}
      {leftIcon && (
        <span className="textlink-icon textlink-icon-left" aria-hidden="true">
          {leftIcon}
        </span>
      )}

      {/* Text content with Typography system */}
      <Label
        size={typographyProps.size}
        weight={typographyProps.weight}
        color={typographyProps.color}
        as="span"
        className="textlink-text"
      >
        {children}
      </Label>

      {/* Right Icon */}
      {rightIcon && (
        <span className="textlink-icon textlink-icon-right" aria-hidden="true">
          {rightIcon}
        </span>
      )}
    </>
  );

  // If it's a .html file (edit mode), use regular anchor tag
  if (isHtmlFile) {
    return (
      <Component>
        <a
          ref={ref}
          href={localeAwareHref}
          className={textLinkClasses}
          aria-disabled={disabled}
          tabIndex={disabled ? -1 : undefined}
          {...props}
        >
          {linkContent}
        </a>
      </Component>
    );
  }

  // Otherwise, use Next.js Link for internal routing
  return (
    <Component>
      <Link
        href={localeAwareHref || '#'}
        className={textLinkClasses}
        aria-disabled={disabled}
        tabIndex={disabled ? -1 : undefined}
        ref={ref}
        {...props}
      >
        {linkContent}
      </Link>
    </Component>
  );
});

TextLink.displayName = 'TextLink';

export default TextLink;

// ===============================================
// USAGE EXAMPLES
// ===============================================

/*

// ✅ BRAND TEXTLINK (for brand names)
<TextLink variant="brand" size="lg" weight="bold">Brand Name</TextLink>

// ✅ PRIMARY TEXTLINK
<TextLink variant="primary" href="/about">About Us</TextLink>

// ✅ SECONDARY TEXTLINK
<TextLink variant="secondary" href="/contact">Contact</TextLink>

// ✅ ACCENT TEXTLINK
<TextLink variant="accent" href="/cta">Call to Action</TextLink>

// ✅ GHOST TEXTLINK (subtle)
<TextLink variant="ghost" href="/terms">Terms of Service</TextLink>

// ✅ WITH ICONS
<TextLink variant="primary" leftIcon={<LogoIcon />} rightIcon={<ArrowIcon />}>
  Brand with Icons
</TextLink>

// ✅ UNDERLINE VARIANTS
<TextLink underline="none">No underline</TextLink>
<TextLink underline="hover">Underline on hover</TextLink>
<TextLink underline="always">Always underlined</TextLink>

// ✅ DISABLED STATE
<TextLink disabled>Disabled Link</TextLink>

*/ 