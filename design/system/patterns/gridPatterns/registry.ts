import { FeatureGrid } from './feature-grid/feature-grid';
import { ResultsGrid } from './ResultsGrid/ResultsGrid';
import { TestimonialGrid } from './TestimonialGrid/TestimonialGrid';
import { PortfolioGrid } from './PortfolioGrid';

// Grid patterns registry
export const  gridPatternsRegistry: Record<string, React.ComponentType<any>> = {
  featureGrid: FeatureGrid,
  resultsGrid: ResultsGrid,
  testimonialGrid: TestimonialGrid,
  portfolioGrid: PortfolioGrid,
  // Add more grid-based patterns here later if needed
};
