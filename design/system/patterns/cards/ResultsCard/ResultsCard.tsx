import React from 'react';
import { Card, VStack, Typography } from '../../../components';
import { CDN_BASE_URL } from '../../../core/utils/helpers';
import './ResultsCard.css';

interface ResultsCardProps {
  // Content props
  heading: string;
  subheading: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  
  // Design variant props
  variant?: 'default' | 'compact' | 'hero' | 'minimal';
  imageAspectRatio?: '2-3' | '1-1' | '16-9' | '4-3';
  imagePosition?: 'top' | 'background' | 'side';
  textAlignment?: 'left' | 'center' | 'right';
  padding?: 'sm' | 'md' | 'lg' | 'xl';
}

export type { ResultsCardProps };

export function ResultsCard({ 
  heading, 
  subheading, 
  description, 
  imageSrc, 
  imageAlt,
  variant = 'default',
  imageAspectRatio = '2-3',
  imagePosition = 'top',
  textAlignment = 'left',
  padding = 'lg'
}: ResultsCardProps) {
  
  const cardClasses = `results-card results-card--${variant} results-card--aspect-${imageAspectRatio} results-card--image-${imagePosition} results-card--text-${textAlignment} results-card--padding-${padding}`;

  return (
    <Card variant="elevated" className={cardClasses}>
      {/* Image Container with configurable aspect ratio */}
      <div className={`results-card-image-container results-card-image-container--${imageAspectRatio}`}>
        <img 
          src={`${CDN_BASE_URL}${imageSrc}`}
          alt={imageAlt}
          className="results-card-image"
        />
      </div>
      
      {/* Text Content */}
      <VStack spacing="md" className={`results-card-content results-card-content--${textAlignment}`}>
        <Typography variant="h4" weight="bold" color="primary" className="results-card-heading">
          {subheading}
        </Typography>
        <Typography variant="body-lg" weight="medium" color="accent" className="results-card-subheading">
          {heading}
        </Typography>
        <Typography variant="body-md" weight="regular" color="secondary" className="results-card-description">
          {description}
        </Typography>
      </VStack>
    </Card>
  );
}