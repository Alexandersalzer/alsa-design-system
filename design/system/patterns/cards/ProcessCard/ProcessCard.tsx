import React from 'react';
import { Card, VStack, Typography } from '../../../components';
import { Image } from '../../../components/media/Image';
import { NumberDisplay } from '../../../components/feedback/NumberDisplay/NumberDisplay';
import { CDN_BASE_URL } from '../../../core/utils/env';
import '../../../components/feedback/NumberDisplay/NumberDisplay.css';
import './ProcessCard.css';

interface ProcessCardProps {
  componentKey?: string;
  number: string | number;
  title: string;
  description: string;
  imageSrc?: string;
  imageAlt?: string;
  // Number display customization
  numberVariant?: 'brand' | 'primary' | 'secondary' | 'accent' | 'ghost';
  numberSize?: 'sm' | 'md' | 'lg' | 'xl';
  numberShape?: 'square' | 'rounded' | 'circle';
  // Image customization
  imageAspectRatio?: '1/1' | '3/2' | '2/3' | '4/3' | '3/4' | '16/9' | '9/16' | string;
  imageRadius?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
  imageObjectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  // Card customization
  cardVariant?: 'default' | 'elevated' | 'outlined' | 'solid' | 'raised';
  cardPadding?: 'sm' | 'md' | 'lg';
  // Layout customization
  spacing?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

export type { ProcessCardProps };

export function ProcessCard({
  componentKey,
  number,
  title,
  description,
  imageSrc,
  imageAlt,
  // Number display defaults
  numberVariant = 'secondary',
  numberSize = 'md',
  numberShape = 'circle',
  // Image defaults
  imageAspectRatio = '16/9',
  imageRadius = 'md',
  imageObjectFit = 'cover',
  // Card defaults
  cardVariant = 'raised',
  cardPadding = 'md',
  // Layout defaults
  spacing = 'md'
}: ProcessCardProps) {
  return (
    <Card
      variant={cardVariant}
      padding={cardPadding}
      className="process-card"
      data-component-key={componentKey}
    >
      <VStack spacing={spacing} align="start" className="process-card-content">
        {/* Number Display - Left Aligned */}
        <NumberDisplay
          value={number}
          size={numberSize}
          variant={numberVariant}
          shape={numberShape}
        />

        {/* Title */}
        <Typography variant="h3" weight="bold" color="primary">
          {title}
        </Typography>

        {/* Description */}
        <Typography variant="body-md" weight="regular" color="tertiary">
          {description}
        </Typography>

        {/* Optional Image */}
        {imageSrc && (
          <Image
            src={`${CDN_BASE_URL}${imageSrc}`}
            alt={imageAlt || title}
            width="100%"
            aspectRatio={imageAspectRatio}
            objectFit={imageObjectFit}
            radius={imageRadius}
            loading="lazy"
            showSkeleton={true}
            className="process-card-image"
          />
        )}
      </VStack>
    </Card>
  );
}
