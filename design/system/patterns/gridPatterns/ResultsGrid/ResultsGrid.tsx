'use client';

import React from 'react';
import { Grid } from '../../../components';
import { ResultsCard } from '../../cards/ResultsCard';
import './ResultsGrid.css';

// ===== GRID LAYOUT TYPE DEFINITIONS =====
type GridLayoutType = '2x2' | '3x3' | '4x2' | '3x2' | 'responsive' | 'uneven' | 'masonry';
type CardVariant = 'default' | 'compact' | 'hero' | 'minimal';

// ===== COMPONENT TYPE DEFINITIONS =====
export interface ResultsCardData {
  type: 'resultsCard';
  heading: string;
  subheading: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  variant?: CardVariant;
  imageAspectRatio?: '2-3' | '1-1' | '16-9' | '4-3';
}

// ===== PATTERN PROPS =====
export interface ResultsGridProps {
  props?: {
    // Grid layout configuration
    layout?: GridLayoutType;
    cardVariant?: CardVariant;
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
    
    // Card appearance
    imageAspectRatio?: '2-3' | '1-1' | '16-9' | '4-3';
    textAlignment?: 'left' | 'center' | 'right';
    cardPadding?: 'sm' | 'md' | 'lg' | 'xl';
  };
  components?: Record<string, {
    type: string;
    heading?: string;
    subheading?: string;
    description?: string;
    imageSrc?: string;
    imageAlt?: string;
    variant?: CardVariant;
  }>;
}

// ===== GRID LAYOUT PRESETS =====
const getGridLayoutProps = (layout: GridLayoutType) => {
  switch (layout) {
    case '2x2':
      return { columns: { base: 1, sm: 2, md: 2 }, gap: 'lg' as const };
    case '3x3':
      return { columns: { base: 1, sm: 2, md: 3 }, gap: 'lg' as const };
    case '4x2':
      return { columns: { base: 1, sm: 2, md: 4 }, gap: 'md' as const };
    case '3x2':
      return { columns: { base: 1, sm: 2, md: 3 }, gap: 'lg' as const };
    case 'uneven':
      return { columns: { base: 1, sm: 2, md: 3, lg: 4 }, gap: 'md' as const };
    case 'masonry':
      return { columns: { base: 1, sm: 2, md: 3 }, gap: 'lg' as const };
    case 'responsive':
    default:
      return { columns: { base: 1, sm: 2, md: 3 }, gap: 'lg' as const };
  }
};

// ===== MAIN RESULTS GRID PATTERN =====
export const ResultsGrid: React.FC<ResultsGridProps> = ({
  props: patternProps = {},
  components = {}
}) => {
  const {
    layout = 'responsive',
    cardVariant = 'default',
    columns: customColumns,
    gap: customGap,
    maxWidth = '1200px',
    imageAspectRatio = '2-3',
    textAlignment = 'left',
    cardPadding = 'lg'
  } = patternProps;

  // Get layout configuration
  const layoutProps = getGridLayoutProps(layout);
  const finalColumns = customColumns || layoutProps.columns;
  const finalGap = customGap || layoutProps.gap;

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
      variant: comp.variant || cardVariant,
    }))
    .filter((card) => card.heading && card.imageSrc);

  // Fallback data for development
  const fallbackCards = [
    {
      type: 'resultsCard' as const,
      heading: 'UGC Reklam',
      subheading: '10.4 miljoner visningar',
      description: 'Denna videon förändrade detta företagets framtid – en UGC video skapad av någon som har känsla för det.',
      imageSrc: '/2194716412/images/tiktokstats.jpeg',
      imageAlt: 'UGC Reklam resultat',
      variant: cardVariant,
    },
    {
      type: 'resultsCard' as const,
      heading: 'Takeover',
      subheading: '1M visningar på 4 veckor',
      description: 'Låt mig ta över er eller skapa en TikTok-kanal åt er. Ni lutar er tillbaka, och jag fixar kunderna.',
      imageSrc: '/2194716412/images/highscore.jpg',
      imageAlt: 'Takeover resultat',
      variant: cardVariant,
    },
    {
      type: 'resultsCard' as const,
      heading: 'TikTok Growth',
      subheading: '12.300 följare på 2 månader',
      description: 'Fick styra deras TikTok i 2 månader – appen blev en av de mest trendande på App Store.',
      imageSrc: '/2194716412/images/12.3.jpg',
      imageAlt: 'TikTok Growth resultat',
      variant: cardVariant,
    },
  ];

  const allCards = cards.length ? cards : fallbackCards;
  if (allCards.length === 0) return null;

  return (
    <div 
      className={`results-grid-container results-grid-container--${layout}`} 
      style={{ maxWidth, margin: '0 auto' }}
    >
      <Grid
        columns={finalColumns}
        gap={finalGap}
        className={`results-grid results-grid--${layout}`}
      >
        {allCards.map((card, index) => (
          <ResultsCard
            key={`results-card-${index}`}
            heading={card.heading}
            subheading={card.subheading}
            description={card.description}
            imageSrc={card.imageSrc}
            imageAlt={card.imageAlt}
            variant={card.variant}
            imageAspectRatio={imageAspectRatio}
            textAlignment={textAlignment}
            padding={cardPadding}
          />
        ))}
      </Grid>
    </div>
  );
};

ResultsGrid.displayName = 'ResultsGrid';