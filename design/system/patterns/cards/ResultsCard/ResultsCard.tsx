import React from 'react';
import { Card, VStack, Typography } from '../../../components';
import { Image } from '../../../components/media/Image';
import { resolveCdnImageUrl } from '../../../core/utils/env';
import './ResultsCard.css';

interface ResultsCardProps {
  componentKey?: string;
  heading: string;
  subheading: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  // Image customization
  imageRadius?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
  imageObjectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  imageAspectRatio?: string;
  imageTint?: 'accent' | 'none';
  // Card customization
  cardVariant?: 'default' | 'elevated' | 'outlined' | 'solid';
  cardPadding?: 'sm' | 'md' | 'lg';
  // Layout customization
  spacing?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

export type { ResultsCardProps };

export function ResultsCard({
  componentKey,
  heading,
  subheading,
  description,
  imageSrc,
  imageAlt,
  // Defaults
  imageRadius = 'sm',
  imageObjectFit = 'contain',
  imageAspectRatio = '2/3',
  imageTint = 'accent',
  cardVariant = 'elevated',
  cardPadding = 'md',
  spacing = 'sm'
}: ResultsCardProps) {
  // Build card container style with aspectRatio for space reservation
  const cardContainerStyle: React.CSSProperties = {
    aspectRatio: imageAspectRatio
  };

  return (
    <div className="results-card" data-component-key={componentKey}>
      {/* Image Card - separate container with background */}
      <Card
        variant={cardVariant}
        padding={cardPadding}
        className="results-card-image-container"
        style={cardContainerStyle}
      >
        <Image
          src={resolveCdnImageUrl(imageSrc)}
          alt={imageAlt}
          width="100%"
          aspectRatio={imageAspectRatio}
          objectFit={imageObjectFit}
          radius={imageRadius}
          tint={imageTint}
          loading="lazy"
          showSkeleton={true}
          className="results-card-image"
        />
      </Card>
      
      {/* Text Content - VStack with no background, left aligned */}
      <VStack spacing={spacing} className="results-card-text">
        <Typography variant="h3" weight="bold" color="primary">
          {heading}
        </Typography>
        <Typography variant="body-lg" weight="semibold" color="secondary">
          {subheading}
        </Typography>
        <Typography variant="body-md" weight="regular" color="tertiary">
          {description}
        </Typography>
      </VStack>
    </div>
  );
}