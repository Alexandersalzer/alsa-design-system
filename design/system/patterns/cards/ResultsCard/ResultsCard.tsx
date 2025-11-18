import React from 'react';
import { Card, VStack, Typography } from '../../../components';
import { Image } from '../../../components/media/Image';
import { CDN_BASE_URL } from '../../../core/utils/helpers';
import './ResultsCard.css';

interface ResultsCardProps {
  heading: string;
  subheading: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  // Image customization
  imageRadius?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
  imageObjectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  imageAspectRatio?: string;
  // Card customization
  cardVariant?: 'default' | 'elevated' | 'outlined' | 'solid';
  cardPadding?: 'sm' | 'md' | 'lg';
  // Layout customization
  spacing?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

export type { ResultsCardProps };

export function ResultsCard({ 
  heading, 
  subheading, 
  description, 
  imageSrc, 
  imageAlt,
  // Defaults
  imageRadius = 'sm',
  imageObjectFit = 'contain',
  imageAspectRatio = '2/3',
  cardVariant = 'elevated',
  cardPadding = 'md',
  spacing = 'sm'
}: ResultsCardProps) {
  return (
    <div className="results-card">
      {/* Image Card - separate container with background */}
      <Card 
        variant={cardVariant} 
        padding={cardPadding}
        className="results-card-image-container"
      >
        <Image
          src={`${CDN_BASE_URL}${imageSrc}`}
          alt={imageAlt}
          width="100%"
          height="100%"
          aspectRatio={imageAspectRatio}
          objectFit={imageObjectFit}
          radius={imageRadius}
          loading="lazy"
          showSkeleton={true}
          className="results-card-image"
        />
      </Card>
      
      {/* Text Content - VStack with no background, left aligned */}
      <VStack spacing={spacing} className="results-card-text">
        <Typography variant="h4" weight="bold" color="primary">
          {subheading}
        </Typography>
        <Typography variant="body-md" weight="regular" color="secondary">
          {heading}
        </Typography>
        <Typography variant="body-sm" weight="regular" color="tertiary">
          {description}
        </Typography>
      </VStack>
    </div>
  );
}