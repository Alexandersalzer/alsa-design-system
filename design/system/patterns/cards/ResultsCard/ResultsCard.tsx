import React from 'react';
import { Card, VStack, Typography } from '../../../components';
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
    <Card variant="elevated" className="results-card">
      <div className="results-card-image-container">
        <img 
          src={imageSrc} 
          alt={imageAlt}
          className="results-card-image"
        />
      </div>
      <VStack spacing="md" className="results-card-content">
        <Typography variant="h5" weight="semibold">
          {heading}
        </Typography>
        <Typography variant="body-sm" color="secondary">
          {subheading}
        </Typography>
        <Typography variant="body-md">
          {description}
        </Typography>
      </VStack>
    </Card>
  );
}