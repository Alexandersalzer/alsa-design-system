import React from 'react';
import { Card, VStack, Typography } from '../../../components';
import { CDN_BASE_URL } from '../../../core/utils/helpers';
import './ResultsCard.css';

interface ResultsCardProps {
  heading: string;
  subheading: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
}

export type { ResultsCardProps };

export function ResultsCard({ 
  heading, 
  subheading, 
  description, 
  imageSrc, 
  imageAlt 
}: ResultsCardProps) {
  return (
    <div className="results-card">
      {/* Image Card - separate container */}
      <Card variant="elevated" className="results-card-image-container">
        <img 
          src={`${CDN_BASE_URL}${imageSrc}`}
          alt={imageAlt}
          className="results-card-image"
        />
      </Card>
      
      {/* Text Content - placed under the card */}
      <VStack spacing="md" className="results-card-content">
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