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
    <Card variant="elevated" className="results-card">
      <div className="results-card-image-container">
        <img 
          src={`${CDN_BASE_URL}${imageSrc}`}
          alt={imageAlt}
          className="results-card-image"
        />
      </div>
      <VStack spacing="md" className="results-card-content">
        <Typography variant="h4" weight="bold" color="primary">
          {heading}
        </Typography>
        <Typography variant="body-lg" weight="medium" color="accent">
          {subheading}
        </Typography>
        <Typography variant="body-md" weight="regular" color="secondary">
          {description}
        </Typography>
      </VStack>
    </Card>
  );
}