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

  // Extract resultsCard data only
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

  // Fallback data
  const fallbackCards = [
    {
      type: 'resultsCard' as const,
      heading: 'UGC Reklam',
      subheading: '10.4 miljoner visningar',
      description: 'Denna videon förändrade detta företagets framtid – en UGC video skapad av någon som har känsla för det.',
      imageSrc: '/images/results/ugc-reklam.jpg',
      imageAlt: 'UGC Reklam resultat'
    },
    {
      type: 'resultsCard' as const,
      heading: 'TikTok Growth',
      subheading: '12.300 följare på 2 månader',
      description: 'Fick styra deras TikTok i 2 månader – appen blev en av de mest trendande på App Store.',
      imageSrc: '/images/results/tiktok-growth.jpg',
      imageAlt: 'TikTok Growth resultat'
    },
    {
      type: 'resultsCard' as const,
      heading: 'Otrolig ROAS',
      subheading: 'Spenderade bara 60 kr',
      description: 'Varje lead gav 750–2500 kr i resultat av bara 60 kr i annonskostnad.',
      imageSrc: '/images/results/roas.jpg',
      imageAlt: 'ROAS resultat'
    }
  ];

  const allCards = cards.length ? cards : fallbackCards;

  if (allCards.length === 0) return null;

  return (
    <div className="results-grid-container" style={{ maxWidth, margin: '0 auto' }}>
      <Grid
        columns={columns}
        gap={gap}
        className="results-grid"
      >
        {allCards.map((card, index) => (
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