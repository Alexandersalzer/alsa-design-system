// ===============================================
// design/system/components/media/Logo/Logo.tsx
// UNIFIED LOGO COMPONENT - Handles image, text, or both + RADIUS SUPPORT
// ===============================================

import React from 'react';
import { cn } from '../../../utils/cn';
import { HStack } from '../../layout';
import { LogoImage, LogoImageProps } from '../Image/Image';
import { BrandName } from './LogoText';
import './Logo.css';

// ===== TYPE DEFINITIONS =====

export interface LogoProps {
  /** Logo image source (optional) */
  src?: string;
  /** Image alt text */
  alt?: string;
  /** Logo text content (optional) */
  text?: string;
  /** Link href for entire logo */
  href?: string;
  /** Image width */
  width?: number;
  /** Image height */
  height?: number;
  /** Border radius for image */
  radius?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
  /** Unified color for both image and text - adapts to theme */
  color?: 'auto' | 'light' | 'dark' | 'brand';
  /** Text size */
  textSize?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  /** Text weight */
  textWeight?: 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold' | 'black';
  /** Text transform */
  textTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
  /** Text letter spacing */
  textSpacing?: 'normal' | 'tight' | 'wide' | 'wider' | 'widest';
  /** Text gradient effect */
  textGradient?: boolean;
  /** Spacing between image and text */
  gap?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  /** Alignment of image and text */
  align?: 'start' | 'center' | 'end';
  /** Show only image on mobile, hide text */
  hideTextOnMobile?: boolean;
  /** Image loading strategy */
  loading?: 'eager' | 'lazy';
  /** Priority loading */
  priority?: boolean;
  /** Click handler */
  onClick?: () => void;
  /** Custom className */
  className?: string;
}

// ===== MAIN LOGO COMPONENT =====

export const Logo: React.FC<LogoProps> = ({
  src,
  alt = 'Logo',
  text,
  href = '/',
  width = 40,
  height = 40,
  radius = 'none',
  color = 'auto',
  textSize = 'lg',
  textWeight = 'extrabold',
  textTransform = 'none',
  textSpacing = 'normal',
  textGradient = false,
  gap = 'sm',
  align = 'center',
  hideTextOnMobile = false,
  loading = 'lazy',
  priority = false,
  onClick,
  className,
}) => {
  // Map unified color to image variant and text color
  const getImageVariant = (color: 'auto' | 'light' | 'dark' | 'brand'): 'auto' | 'light' | 'dark' | 'color' => {
    const mapping = {
      'auto': 'auto',
      'light': 'dark',   // Light color = show dark logo on light bg
      'dark': 'light',   // Dark color = show light logo on dark bg
      'brand': 'color'
    } as const;
    return mapping[color];
  };

  const getTextColor = (color: 'auto' | 'light' | 'dark' | 'brand'): 'primary' | 'secondary' | 'inverse' | 'inherit' => {
    const mapping = {
      'auto': 'primary',    // Auto-adapts to theme
      'light': 'inverse',   // Light = white text
      'dark': 'primary',    // Dark = black text
      'brand': 'primary'    // Brand = use primary (can be customized)
    } as const;
    return mapping[color];
  };

  const imageVariant = getImageVariant(color);
  const textColor = getTextColor(color);
  
  // Determine what to render
  const hasImage = Boolean(src);
  const hasText = Boolean(text);
  const hasBoth = hasImage && hasText;

  // If neither image nor text, return null
  if (!hasImage && !hasText) {
    return null;
  }

  // Container classes
  const containerClasses = cn(
    'logo',
    hasBoth && 'logo--combined',
    hideTextOnMobile && hasText && 'logo--hide-text-mobile',
    className
  );

  // Wrapper component (link or div)
  const Wrapper = href ? 'a' : 'div';
  const wrapperProps = href 
    ? { href, onClick, className: containerClasses }
    : { onClick, className: containerClasses };

  // Single image only
  if (hasImage && !hasText) {
    return (
      <Wrapper {...wrapperProps}>
        <LogoImage
          src={src!}
          alt={alt}
          width={width}
          height={height}
          radius={radius}
          variant={imageVariant}
          loading={loading}
          priority={priority}
          className="logo__image-only"
        />
      </Wrapper>
    );
  }

  // Single text only
  if (!hasImage && hasText) {
    return (
      <Wrapper {...wrapperProps}>
        <BrandName
          href={undefined}
          size={textSize}
          weight={textWeight}
          transform={textTransform}
          spacing={textSpacing}
          color={textColor}
          gradient={textGradient}
          className="logo__text-only"
        >
          {text}
        </BrandName>
      </Wrapper>
    );
  }

  // Combined image + text
  return (
    <Wrapper {...wrapperProps}>
      <HStack 
        align={align} 
        spacing={gap === 'xl' ? 'lg' : gap}
        className="logo__combined-container"
      >
        <LogoImage
          src={src!}
          alt={alt}
          width={width}
          height={height}
          radius={radius}
          variant={imageVariant}
          loading={loading}
          priority={priority}
          className="logo__image"
        />
        <BrandName
          href={undefined}
          size={textSize}
          weight={textWeight}
          transform={textTransform}
          spacing={textSpacing}
          color={textColor}
          gradient={textGradient}
          className={cn(
            'logo__text',
            hideTextOnMobile && 'logo__text--hide-mobile'
          )}
        >
          {text}
        </BrandName>
      </HStack>
    </Wrapper>
  );
};

Logo.displayName = 'Logo';

// ===== EXPORT =====
export default Logo;