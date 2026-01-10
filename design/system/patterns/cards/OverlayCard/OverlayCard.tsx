import React from 'react';
import { Card, VStack, Typography, Icon } from '../../../components';
import { CDN_BASE_URL } from '../../../core/utils/env';
import './OverlayCard.css';

interface OverlayCardProps {
  componentKey?: string;
  heading: string;
  subheading?: string;
  description?: string;
  imageSrc?: string; // Optional now
  imageAlt?: string;
  // Icon support
  icon?: React.ReactElement; // Lucide/Heroicons icon element
  iconSize?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  // Overlay mode
  overlayMode?: 'dark' | 'light'; // dark = black overlay with white text, light = white overlay with dark text
  overlayOpacity?: number; // 0-1 (default: 0.5 for dark, 0.7 for light)
  imageObjectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  // Text alignment
  textAlign?: 'left' | 'center' | 'right';
  // Card customization
  cardVariant?: 'default' | 'elevated' | 'outlined' | 'solid';
  cardPadding?: 'sm' | 'md' | 'lg';
  cardRadius?: 'sm' | 'md' | 'lg';
  // Layout customization
  spacing?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  minHeight?: string; // e.g., '300px', '400px'
}

export type { OverlayCardProps };

export function OverlayCard({
  componentKey,
  heading,
  subheading,
  description,
  imageSrc,
  imageAlt,
  icon,
  iconSize = 'xl',
  // Defaults
  overlayMode = 'dark',
  overlayOpacity,
  imageObjectFit = 'cover',
  textAlign = 'center',
  cardVariant = 'elevated',
  cardPadding = 'lg',
  cardRadius = 'md',
  spacing = 'sm',
  minHeight = '400px'
}: OverlayCardProps) {
  // Map textAlign to VStack align prop
  const getVStackAlign = (align: 'left' | 'center' | 'right'): 'start' | 'center' | 'end' => {
    if (align === 'left') return 'start';
    if (align === 'right') return 'end';
    return 'center';
  };

  // Determine text color based on overlay mode
  const textColor = overlayMode === 'dark' ? 'inverse' : 'primary';
  const textColorSecondary = overlayMode === 'dark' ? 'inverse' : 'secondary';

  // Default opacity based on mode
  const defaultOpacity = overlayMode === 'dark' ? 0.5 : 0.7;
  const finalOpacity = overlayOpacity !== undefined ? overlayOpacity : defaultOpacity;

  return (
    <Card
      variant={cardVariant}
      padding="none"
      radius={cardRadius}
      className={`overlay-card overlay-card--${overlayMode}`}
      data-component-key={componentKey}
      style={{ minHeight }}
    >
      {/* Background Image with Overlay (optional) */}
      {imageSrc && (
        <div className="overlay-card__background">
          <img
            src={`${CDN_BASE_URL}${imageSrc}`}
            alt={imageAlt || ''}
            className="overlay-card__image"
            style={{ objectFit: imageObjectFit }}
          />
          <div
            className={`overlay-card__overlay overlay-card__overlay--${overlayMode}`}
            style={{ opacity: finalOpacity }}
          />
        </div>
      )}

      {/* Content - Centered Vertically, Customizable Horizontal Alignment */}
      <div
        className={`overlay-card__content overlay-card__content--${textAlign}`}
        style={{ padding: `var(--spacing-${cardPadding})` }}
      >
        <VStack spacing={spacing} align={getVStackAlign(textAlign)}>
          {icon && (
            <Icon size={iconSize} color={overlayMode === 'dark' ? 'inverse' : 'primary'}>
              {icon}
            </Icon>
          )}
          <Typography variant="h3" weight="bold" color={textColor}>
            {heading}
          </Typography>
          {subheading && (
            <Typography variant="body-lg" weight="semibold" color={textColorSecondary}>
              {subheading}
            </Typography>
          )}
          {description && (
            <Typography variant="body-md" weight="regular" color={textColorSecondary}>
              {description}
            </Typography>
          )}
        </VStack>
      </div>
    </Card>
  );
}
