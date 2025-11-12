import { FeatureGrid } from './feature-grid/feature-grid';
import { ResultsGrid } from './ResultsGrid/ResultsGrid';

// Grid patterns registry
export const gridPatternsRegistry: Record<string, React.ComponentType<any>> = {
  featureGrid: FeatureGrid,
  resultsGrid: ResultsGrid,
  // Add more grid-based patterns here later if needed
};
