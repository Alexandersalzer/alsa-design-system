import { FeatureGrid } from './feature-grid/feature-grid';
import { MasonryGrid } from './MasonryGrid/MasonryGrid';
import { GridPattern } from './GridPattern/GridPattern';
import { AlternatingCards } from './AlternatingCards/AlternatingCards';

// Keep legacy patterns for backward compatibility
import { ResultsGrid } from './ResultsGrid/ResultsGrid';

import { PortfolioGrid } from './PortfolioGrid';

// Grid patterns registry
export const gridPatternsRegistry: Record<string, React.ComponentType<any>> = {
  // New generic patterns - layout-based naming
  masonryGrid: MasonryGrid,
  gridPattern: GridPattern,
  alternatingCards: AlternatingCards,

  // Legacy patterns (deprecated) - kept for backward compatibility
  featureGrid: FeatureGrid,
  resultsGrid: ResultsGrid,
  portfolioGrid: PortfolioGrid,
};
