// ===============================================
// design/system/components/media/Logo/Logo.tsx
// UNIFIED LOGO COMPONENT - Handles image, text, or both + SPA-safe navigation
// ===============================================

'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { cn } from '../../../utils/cn';
import { HStack } from '../../layout';
import { LogoImage } from '../Image/Image';
import { BrandName } from './LogoText';
import { Component } from '../../frames/component/Component';
import './Logo.css';

// ===== TYPE DEFINITIONS =====

export interface LogoProps {
  src?: string;
  alt?: string;
  text?: string;
  href?: string;
  width?: number;
  height?: number;
  radius?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
  border?: 'none' | 'default' | 'subtle' | 'strong' | 'emphasis';
  color?: 'auto' | 'inverse' | 'brand';
  textSize?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  textWeight?: 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold' | 'black';
  textTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
  textSpacing?: 'normal' | 'tight' | 'wide' | 'wider' | 'widest';
  textGradient?: boolean;
  gap?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  align?: 'start' | 'center' | 'end';
  hideTextOnMobile?: boolean;
  display?: 'both' | 'logo' | 'text';
  loading?: 'eager' | 'lazy';
  priority?: boolean;
  onClick?: () => void;
  className?: string;
  componentKey?: string;
  textComponentKey?: string;
}

// ===== HELPERS =====

const isInternalHref = (href?: string) =>
  !!href && href.startsWith('/') && !href.startsWith('//');

// ===== MAIN LOGO COMPONENT =====

export const Logo: React.FC<LogoProps> = ({
  src,
  alt = 'Logo',
  text,
  href,
  width = 40,
  height = 40,
  radius = 'none',
  border = 'none',
  color = 'auto' as 'auto' | 'inverse' | 'brand',
  textSize = 'lg',
  textWeight = 'extrabold',
  textTransform = 'none',
  textSpacing = 'normal',
  textGradient = false,
  gap = 'sm',
  align = 'center',
  hideTextOnMobile = false,
  display,
  loading = 'lazy',
  priority = false,
  onClick,
  className,
  componentKey,
  textComponentKey,
}) => {
  const router = useRouter();

  // ----- Color mapping -----

  const getImageVariant = (
    color: 'auto' | 'inverse' | 'brand'
  ): 'auto' | 'inverse' | 'color' => {
    const mapping = {
      auto: 'auto',
      inverse: 'inverse',
      brand: 'color',
    } as const;
    return mapping[color];
  };

  const getTextColor = (
    color: 'auto' | 'inverse' | 'brand'
  ): 'primary' | 'secondary' | 'inverse' => {
    // Logo text should ALWAYS follow theme text color
    // Never inherit from <a>
    return 'primary';
  };

  const imageVariant = getImageVariant(color);
  const textColor = getTextColor(color);

  const hasImage = Boolean(src);
  const hasText = Boolean(text);
  
  // ----- Display filtering logic -----
  // Respects display prop while maintaining backwards compatibility
  const shouldShowImage = display === 'logo' || display === 'both' || (!display && hasImage);
  const shouldShowText = display === 'text' || display === 'both' || (!display && hasText);
  
  const hasBoth = shouldShowImage && shouldShowText;

  if (!shouldShowImage && !shouldShowText) return null;

  const containerClasses = cn(
    'logo',
    hasBoth && 'logo--combined',
    hideTextOnMobile && hasText && 'logo--hide-text-mobile',
    border !== 'none' && `logo--border-${border}`,
    className
  );

  // ----- Navigation handling (KEY FIX) -----

  const handleClick = (e?: React.MouseEvent) => {
    if (!href) return;

    if (isInternalHref(href)) {
      e?.preventDefault();
      router.push(href);
    }

    onClick?.();
  };

  const Wrapper = href ? 'a' : 'div';

  const wrapperProps = href
    ? {
        href,
        onClick: handleClick,
        className: containerClasses,
      }
    : {
        onClick: handleClick,
        className: containerClasses,
      };

  // ----- Render variants -----

  if (shouldShowImage && !shouldShowText) {
    return (
      <Wrapper {...wrapperProps}>
        <Component componentKey={componentKey}>
          <LogoImage
            src={src!}
            alt={alt}
            width={width}
            height={height}
            radius={radius}
            variant={imageVariant}
            loading={loading}
            priority={priority}
            className={cn(
              'logo__image-only',
              border !== 'none' && `logo__image--border-${border}`
            )}
          />
        </Component>
      </Wrapper>
    );
  }

  if (!shouldShowImage && shouldShowText) {
    return (
      <Wrapper {...wrapperProps}>
        <Component componentKey={textComponentKey}>
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
        </Component>
      </Wrapper>
    );
  }

  return (
    <Wrapper {...wrapperProps}>
      <HStack
        align={align}
        spacing={gap === 'xl' ? 'lg' : gap}
        className="logo__combined-container"
      >
        <Component componentKey={componentKey}>
          <LogoImage
            src={src!}
            alt={alt}
            width={width}
            height={height}
            radius={radius}
            variant={imageVariant}
            loading={loading}
            priority={priority}
            className={cn(
              'logo__image',
              border !== 'none' && `logo__image--border-${border}`
            )}
          />
        </Component>

        <Component componentKey={textComponentKey}>
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
        </Component>
      </HStack>
    </Wrapper>
  );
};

Logo.displayName = 'Logo';

export default Logo;
