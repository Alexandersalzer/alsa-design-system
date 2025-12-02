'use client';

import React from 'react';
import { Grid } from '../../../components';
import { ResultsCard } from '../../cards/ResultsCard';
import './ResultsGrid.css';

// ===== COMPONENT TYPE DEFINITIONS =====
export interface ResultsCardData {
  type: 'resultsCard';
  heading: string;
  subheading: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
}

// ===== PATTERN PROPS =====
export interface ResultsGridProps {
  props?: {
    cardDensity?: 'compact' | 'standard' | 'spacious';
    gap?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    maxWidth?: string;
  };
  components?: Record<string, {
    type: string;
    heading?: string;
    subheading?: string;
    description?: string;
    imageSrc?: string;
    imageAlt?: string;
  }>;
}

// ===== MAIN RESULTS GRID PATTERN =====
export const ResultsGrid: React.FC<ResultsGridProps> = ({
  props: patternProps = {},
  components = {}
}) => {
  const {
    cardDensity = 'standard',
    gap = 'lg'
  } = patternProps;

  // Extract resultsCard data
  const cards = Object.entries(components)
    .filter(([_, comp]) => comp.type === 'resultsCard')
    .map(([_, comp]) => ({
      type: 'resultsCard' as const,
      heading: comp.props?.heading || '',
      subheading: comp.props?.subheading || '',
      description: comp.props?.description || '',
      imageSrc: comp.props?.imageSrc || '',
      imageAlt: comp.props?.imageAlt || 'Result image',
    }))
    .filter((card) => card.heading && card.imageSrc);

  if (cards.length === 0) return null;

  return (
    <div className="results-grid-container">
      <Grid
        cardDensity={cardDensity}
        gap={gap}
        className="results-grid"
      >
        {cards.map((card, index) => (
          <ResultsCard
            key={`results-card-${index}`}
            heading={card.heading}
            subheading={card.subheading}
            description={card.description}
            imageSrc={card.imageSrc}
            imageAlt={card.imageAlt}
          />
        ))}
      </Grid>
    </div>
  );
};

ResultsGrid.displayName = 'ResultsGrid';