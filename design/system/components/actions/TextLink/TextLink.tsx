// ===============================================
// src/design-system/components/primitives/TextLink/TextLink.tsx
// TextLink primitive component inspired by Button but for semantic links
// ===============================================

import React, { forwardRef, ReactNode } from 'react';
import Link from 'next/link';
import { cn } from '../../../utils/cn';
import { Label, TypographyWeight } from '../../Typography';
import { useHref } from '../../../hooks/useHref';
import { Component } from '../../frames/component/Component';
import { ActionConfig } from '../../../core/actions/types';
import './TextLink.css';

export interface TextLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  children?: ReactNode;
  content?: string;
  variant?: 'primary' | 'secondary' | 'accent' | 'ghost' | 'button-ghost' | 'brand' | 'inverse';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  weight?: 'regular' | 'medium' | 'semibold' | 'bold';
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  underline?: 'none' | 'hover' | 'always';
  disabled?: boolean;
  componentKey?: string;
  action?: ActionConfig;
  skipClient?: boolean; // Skip buildHref for dashboard/client navigation - use href directly
}

export const TextLink = forwardRef<HTMLAnchorElement, TextLinkProps>(({
  className,
  variant = 'primary',
  size = 'md',
  weight = 'medium',
  children,
  content,
  leftIcon,
  rightIcon,
  underline = 'none',
  disabled = false,
  href,
  action,
  componentKey,
  skipClient = false,
  ...props
}, ref) => {

  const { buildHref } = useHref();

  // Extract href and pageId from action or use direct href prop
  let finalHref = href;
  let pageId: string | undefined;

  if (action && action.type === 'navigation') {
    finalHref = action.settings.href;
    pageId = action.settings.pageId;
  }

  // Build locale-aware href (pageId takes precedence if provided)
  // Skip buildHref if skipClient is true (for dashboard internal navigation)
  const localeAwareHref = skipClient
    ? finalHref
    : ((finalHref || pageId) ? buildHref(finalHref, pageId) : undefined);
  
  // Use content if provided, otherwise use children
  const displayContent = content || children;
  
  // Map textlink size to typography size
  const getTypographySize = (size: string): 'sm' | 'md' | 'lg' => {
    const sizeMap = {
      sm: 'sm' as const,
      md: 'md' as const,
      lg: 'lg' as const,
      xl: 'lg' as const, // xl uses lg typography
    };
    return sizeMap[size as keyof typeof sizeMap] || sizeMap.md;
  };

  const typographySize = getTypographySize(size);

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
  
  // Filter out non-DOM props
  const { type, sectionKey, patternKey, components, order, ...domProps } = props as any;

  // Content to render inside the link
  const linkContent = (
    <>
      {/* Left Icon */}
      {leftIcon && (
        <span className="textlink-icon textlink-icon-left" aria-hidden="true">
          {leftIcon}
        </span>
      )}

      {/* Text content with Typography system - color inherited from CSS */}
      <Label
        size={typographySize}
        weight={weight as TypographyWeight}
        as="span"
        className="textlink-text"
        style={{ color: 'inherit' }}
      >
        {displayContent}
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
      <Component componentKey={componentKey}>
        <a
          ref={ref}
          href={localeAwareHref}
          className={textLinkClasses}
          aria-disabled={disabled}
          tabIndex={disabled ? -1 : undefined}
          {...domProps}
        >
          {linkContent}
        </a>
      </Component>
    );
  }

  // Otherwise, use Next.js Link for internal routing
  return (
    <Component componentKey={componentKey}>
      <Link
        href={localeAwareHref || '#'}
        className={textLinkClasses}
        aria-disabled={disabled}
        tabIndex={disabled ? -1 : undefined}
        ref={ref}
        {...domProps}
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
<TextLink variant="accent" href="/about">About Us</TextLink>

// ✅ SECONDARY TEXTLINK
<TextLink variant="secondary" href="/contact">Contact</TextLink>

// ✅ ACCENT TEXTLINK
<TextLink variant="accent" href="/cta">Call to Action</TextLink>

// ✅ GHOST TEXTLINK (subtle)
<TextLink variant="ghost" href="/terms">Terms of Service</TextLink>

// ✅ WITH ICONS
<TextLink variant="accent" leftIcon={<LogoIcon />} rightIcon={<ArrowIcon />}>
  Brand with Icons
</TextLink>

// ✅ UNDERLINE VARIANTS
<TextLink underline="none">No underline</TextLink>
<TextLink underline="hover">Underline on hover</TextLink>
<TextLink underline="always">Always underlined</TextLink>

// ✅ DISABLED STATE
<TextLink disabled>Disabled Link</TextLink>

*/ 