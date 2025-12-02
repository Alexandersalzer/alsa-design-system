'use client';

import React from 'react';
import { Grid } from '../../../components';
import { ResultsCard } from '../../cards/ResultsCard';
import { PatternNode } from '../../../core/types/nodes';
import { componentProps, patternProps, useMapComponents, getPatternOrder } from '../../../core/utils/props';
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

// ===== MAIN RESULTS GRID PATTERN =====
export const ResultsGrid: React.FC<PatternNode> = (patternNode) => {
  const { components = {} } = patternNode;
  const getComponent = componentProps(components);
  const getPatternProps = patternProps(patternNode);
  const mapComponentsOfType = useMapComponents(components);
  const componentOrder = getPatternOrder(patternNode);

  // Extract pattern props with defaults
  const {
    cardDensity = 'standard',
    gap = 'lg'
  } = getPatternProps();

  // Extract results cards using the order from PatternNode
  const cards: ResultsCardData[] = componentOrder
    .reduce<ResultsCardData[]>((acc, key) => {
      const component = components[key];
      if (!component || component.type !== 'resultsCard') return acc;
      
      const props = component.props || {};
      const heading = props.heading || '';
      const imageSrc = props.imageSrc || '';
      
      if (!heading || !imageSrc) return acc;
      
      acc.push({
        type: 'resultsCard',
        heading,
        subheading: props.subheading || '',
        description: props.description || '',
        imageSrc,
        imageAlt: props.imageAlt || 'Result image',
      });
      
      return acc;
    }, []);

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