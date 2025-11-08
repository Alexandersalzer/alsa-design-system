import { FeatureGrid } from './feature-grid/feature-grid';

// Grid patterns registry
export const gridPatternsRegistry: Record<string, React.ComponentType<any>> = {
  featureGrid: FeatureGrid,
  // Add more grid-based patterns here later if needed
};
