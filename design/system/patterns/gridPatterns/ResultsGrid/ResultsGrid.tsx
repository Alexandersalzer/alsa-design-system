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
    columns?: {
      base?: number;
      sm?: number;
      md?: number;
      lg?: number;
      xl?: number;
      '2xl'?: number;
    };
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
    columns = { base: 1, sm: 2, md: 3 },
    gap = 'lg',
    maxWidth = '1200px'
  } = patternProps;

  // Extract resultsCard data
  const cards = Object.entries(components)
    .filter(([_, comp]) => comp.type === 'resultsCard')
    .map(([_, comp]) => ({
      type: 'resultsCard' as const,
      heading: comp.heading || '',
      subheading: comp.subheading || '',
      description: comp.description || '',
      imageSrc: comp.imageSrc || '',
      imageAlt: comp.imageAlt || 'Result image',
    }))
    .filter((card) => card.heading && card.imageSrc);

  if (cards.length === 0) return null;

  return (
    <div className="results-grid-container" style={{ maxWidth, margin: '0 auto' }}>
      <Grid
        columns={columns}
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