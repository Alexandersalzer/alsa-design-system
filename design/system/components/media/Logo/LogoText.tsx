// ===============================================
// design/system/components/media/Logo/LogoText.tsx
// LOGO TEXT COMPONENT - Branded text for logos and headings
// ===============================================

import React, { ReactNode } from 'react';
import { cn } from '../../../utils/cn';
import { Component } from '../../frames/component/Component';
import './LogoText.css';

// ===== INLINE MARKUP PROCESSOR =====
/**
 * Inline markup syntax:
 * - **text** → bold
 * - *text* → italic  
 * - {font:Name}text{/font} → custom font
 * - {font:Name:400}text{/font} → custom font with weight
 */
const processInlineMarkup = (content: ReactNode): ReactNode => {
  if (typeof content !== 'string') return content;

  const parse = (text: string, key = 0): ReactNode[] => {
    const result: ReactNode[] = [];
    let i = 0;

    while (i < text.length) {
      // Custom font: {font:Name}text{/font} or {font:Name:weight}text{/font}
      const fontMatch = text.slice(i).match(/^{font:([^:}]+)(?::(\d+))?}([\s\S]*?){\/font}/);
      if (fontMatch) {
        const [full, fontName, weight, inner] = fontMatch;
        const style: React.CSSProperties = { fontFamily: fontName };
        if (weight) style.fontWeight = Number(weight);
        result.push(<span key={`f-${key++}`} style={style}>{parse(inner, key)}</span>);
        i += full.length;
        continue;
      }

      // Bold: **text**
      const boldMatch = text.slice(i).match(/^\*\*(.+?)\*\*/);
      if (boldMatch) {
        const [full, inner] = boldMatch;
        result.push(<strong key={`b-${key++}`}>{parse(inner, key)}</strong>);
        i += full.length;
        continue;
      }

      // Italic: *text*
      const italicMatch = text.slice(i).match(/^\*(.+?)\*/);
      if (italicMatch) {
        const [full, inner] = italicMatch;
        result.push(<em key={`i-${key++}`}>{parse(inner, key)}</em>);
        i += full.length;
        continue;
      }

      // Plain text until next special char
      let end = i + 1;
      while (end < text.length && !'{*'.includes(text[end])) end++;
      result.push(text.slice(i, end));
      i = end;
    }

    return result;
  };

  return <>{parse(content)}</>;
};

// ===== TYPE DEFINITIONS =====

export interface LogoTextProps {
  /** Text content */
  children: React.ReactNode;
  /** Link href (optional) */
  href?: string;
  /** Size variant */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  /** Font weight */
  weight?: 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold' | 'black';
  /** Text transform */
  transform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
  /** Letter spacing */
  spacing?: 'normal' | 'tight' | 'wide' | 'wider' | 'widest';
  /** Color variant */
  color?: 'primary' | 'secondary' | 'inverse' | 'inherit';
  /** Font family variant */
  font?: 'brand' | 'heading' | 'body' | 'mono';
  /** Enable gradient text effect */
  gradient?: boolean;
  /** Gradient direction (if gradient enabled) */
  gradientDirection?: 'to-r' | 'to-br' | 'to-b' | 'to-bl' | 'to-l';
  /** Enable hover effect */
  hover?: boolean;
  /** Custom className */
  className?: string;
  /** Click handler */
  onClick?: () => void;
  /** Component key for editing */
  componentKey?: string;
}

// ===== LOGO TEXT COMPONENT =====

export const LogoText: React.FC<LogoTextProps> = ({
  children,
  href,
  size = 'md',
  weight = 'extrabold',
  transform = 'none',
  spacing = 'normal',
  color = 'primary',
  font = 'brand',
  gradient = false,
  gradientDirection = 'to-r',
  hover = true,
  className,
  onClick,
  componentKey,
}) => {
  const classes = cn(
    'logo-text',
    `logo-text--size-${size}`,
    `logo-text--weight-${weight}`,
    `logo-text--transform-${transform}`,
    `logo-text--spacing-${spacing}`,
    `logo-text--color-${color}`,
    `logo-text--font-${font}`,
    gradient && 'logo-text--gradient',
    gradient && `logo-text--gradient-${gradientDirection}`,
    hover && 'logo-text--hover',
    className
  );

  // Process inline markup (bold, italic, font)
  const processedContent = processInlineMarkup(children);

  // If href is provided, render as link
  if (href) {
    return (
      <Component componentKey={componentKey}>
        <a href={href} className={classes} onClick={onClick}>
          {processedContent}
        </a>
      </Component>
    );
  }

  // Otherwise render as span
  return (
    <Component componentKey={componentKey}>
      <span className={classes} onClick={onClick}>
        {processedContent}
      </span>
    </Component>
  );
};

LogoText.displayName = 'LogoText';

// ===== SPECIALIZED VARIANTS =====

export interface BrandNameProps {
  /** Brand name text */
  children?: React.ReactNode;
  /** Text content (for JSON-driven rendering) */
  content?: string;
  /** Link href */
  href?: string;
  /** Size variant */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  /** Font weight */
  weight?: 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold' | 'black';
  /** Text transform */
  transform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
  /** Letter spacing */
  spacing?: 'normal' | 'tight' | 'wide' | 'wider' | 'widest';
  /** Color variant */
  color?: 'primary' | 'secondary' | 'inverse' | 'inherit';
  /** Enable gradient */
  gradient?: boolean;
  /** Custom className */
  className?: string;
  /** Click handler */
  onClick?: () => void;
  /** Component key for editing */
  componentKey?: string;
}

/**
 * BrandName - Preset for main brand/company names
 * Used in navbars and headers
 */
export const BrandName: React.FC<BrandNameProps> = ({
  size = 'lg',
  weight = 'extrabold',
  transform = 'none',
  spacing = 'normal',
  color = 'primary',
  gradient = false,
  children,
  content,
  ...props
}) => {
  // Use content prop if provided, otherwise use children (for JSON-driven rendering)
  const displayContent = content || children;
  
  return (
    <LogoText
      {...props}
      size={size}
      weight={weight}
      transform={transform}
      spacing={spacing}
      color={color}
      gradient={gradient}
      font="brand"
    >
      {displayContent}
    </LogoText>
  );
};

BrandName.displayName = 'BrandName';

export interface ProductNameProps {
  /** Product name text */
  children?: React.ReactNode;
  /** Text content (for JSON-driven rendering) */
  content?: string;
  /** Link href */
  href?: string;
  /** Size variant */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  /** Font weight */
  weight?: 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold' | 'black';
  /** Text transform */
  transform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
  /** Letter spacing */
  spacing?: 'normal' | 'tight' | 'wide' | 'wider' | 'widest';
  /** Custom className */
  className?: string;
  /** Component key for editing */
  componentKey?: string;
}

/**
 * ProductName - Preset for product/app names
 * Used in dashboards and product headers
 */
export const ProductName: React.FC<ProductNameProps> = ({
  size = 'md',
  weight = 'bold',
  spacing = 'tight',
  children,
  content,
  ...props
}) => {
  const displayContent = content || children;
  
  return (
    <LogoText
      {...props}
      size={size}
      weight={weight}
      spacing={spacing}
      font="heading"
    >
      {displayContent}
    </LogoText>
  );
};

ProductName.displayName = 'ProductName';

export interface SectionTitleProps {
  /** Section title text */
  children?: React.ReactNode;
  /** Text content (for JSON-driven rendering) */
  content?: string;
  /** Link href */
  href?: string;
  /** Size variant */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  /** Font weight */
  weight?: 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold' | 'black';
  /** Text transform */
  transform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
  /** Letter spacing */
  spacing?: 'normal' | 'tight' | 'wide' | 'wider' | 'widest';
  /** Color variant */
  color?: 'primary' | 'secondary' | 'inverse' | 'inherit';
  /** Custom className */
  className?: string;
  /** Component key for editing */
  componentKey?: string;
}

/**
 * SectionTitle - Preset for section titles
 * Used in footers and content sections
 */
export const SectionTitle: React.FC<SectionTitleProps> = ({
  size = 'md',
  weight = 'semibold',
  transform = 'uppercase',
  spacing = 'wide',
  children,
  content,
  ...props
}) => {
  const displayContent = content || children;
  
  return (
    <LogoText
      {...props}
      size={size}
      weight={weight}
      transform={transform}
      spacing={spacing}
      font="heading"
    >
      {displayContent}
    </LogoText>
  );
};

SectionTitle.displayName = 'SectionTitle';