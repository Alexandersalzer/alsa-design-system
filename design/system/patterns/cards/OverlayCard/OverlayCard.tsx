import React from 'react';
import { Card, VStack, Typography } from '../../../components';
import { CDN_BASE_URL } from '../../../core/utils/env';
import './OverlayCard.css';

interface OverlayCardProps {
  componentKey?: string;
  heading: string;
  subheading?: string;
  description?: string;
  imageSrc: string;
  imageAlt: string;
  // Image overlay customization
  overlayOpacity?: number; // 0-1 (default: 0.7)
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
  // Defaults
  overlayOpacity = 0.7,
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

  return (
    <Card
      variant={cardVariant}
      padding="none"
      radius={cardRadius}
      className="overlay-card"
      data-component-key={componentKey}
      style={{ minHeight }}
    >
      {/* Background Image with Overlay */}
      <div className="overlay-card__background">
        <img
          src={`${CDN_BASE_URL}${imageSrc}`}
          alt={imageAlt}
          className="overlay-card__image"
          style={{ objectFit: imageObjectFit }}
        />
        <div
          className="overlay-card__overlay"
          style={{ opacity: overlayOpacity }}
        />
      </div>

      {/* Content - Centered Vertically, Customizable Horizontal Alignment */}
      <div
        className={`overlay-card__content overlay-card__content--${textAlign}`}
        style={{ padding: `var(--spacing-${cardPadding})` }}
      >
        <VStack spacing={spacing} align={getVStackAlign(textAlign)}>
          <Typography variant="h3" weight="bold" color="inverse">
            {heading}
          </Typography>
          {subheading && (
            <Typography variant="body-lg" weight="semibold" color="inverse">
              {subheading}
            </Typography>
          )}
          {description && (
            <Typography variant="body-md" weight="regular" color="inverse">
              {description}
            </Typography>
          )}
        </VStack>
      </div>
    </Card>
  );
}
