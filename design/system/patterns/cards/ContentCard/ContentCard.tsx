import React from 'react';
import { Card, VStack, Typography } from '../../../components';
import { Image } from '../../../components/media/Image';
import { CDN_BASE_URL } from '../../../core/utils/env';
import './ContentCard.css';

interface ContentCardProps {
  componentKey?: string;
  heading: string;
  subheading?: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  // Image customization
  imageAspectRatio?: '1/1' | '3/2' | '2/3' | '4/3' | '3/4' | '16/9' | '9/16' | string;
  imageRadius?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
  imageObjectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  // Card customization
  cardVariant?: 'default' | 'elevated' | 'outlined' | 'solid';
  cardPadding?: 'sm' | 'md' | 'lg';
  // Layout customization
  spacing?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

export type { ContentCardProps };

export function ContentCard({
  componentKey,
  heading,
  subheading,
  description,
  imageSrc,
  imageAlt,
  // Defaults
  imageAspectRatio = '1/1',
  imageRadius = 'md',
  imageObjectFit = 'cover',
  cardVariant = 'elevated',
  cardPadding = 'md',
  spacing = 'sm'
}: ContentCardProps) {
  return (
    <div className="content-card" data-component-key={componentKey}>
      {/* Image Card - separate container with background */}
      <Card
        variant={cardVariant}
        padding={cardPadding}
        className="content-card-image-container"
      >
        <Image
          src={`${CDN_BASE_URL}${imageSrc}`}
          alt={imageAlt}
          width="100%"
          aspectRatio={imageAspectRatio}
          objectFit={imageObjectFit}
          radius={imageRadius}
          loading="lazy"
          showSkeleton={true}
          className="content-card-image"
        />
      </Card>

      {/* Text Content - VStack with no background, left aligned */}
      <VStack spacing={spacing} className="content-card-text">
        <Typography variant="h3" weight="bold" color="primary">
          {heading}
        </Typography>
        {subheading && (
          <Typography variant="body-lg" weight="semibold" color="secondary">
            {subheading}
          </Typography>
        )}
        <Typography variant="body-md" weight="regular" color="tertiary">
          {description}
        </Typography>
      </VStack>
    </div>
  );
}
