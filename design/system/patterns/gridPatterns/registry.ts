import { MasonryGrid } from './MasonryGrid/MasonryGrid';
import { GridPattern } from './GridPattern/GridPattern';
import { AlternatingCards } from './AlternatingCards/AlternatingCards';
import { StickyNavContent } from './StickyNavContent/StickyNavContent';
import { StickyTextContent } from './StickyTextContent/StickyTextContent';
import { PortfolioGrid } from './PortfolioGrid';

// Grid patterns registry
export const gridPatternsRegistry: Record<string, React.ComponentType<any>> = {
  // Generic patterns - layout-based naming
  masonryGrid: MasonryGrid,
  gridPattern: GridPattern,
  alternatingCards: AlternatingCards,
  stickyNavContent: StickyNavContent,
  stickyTextContent: StickyTextContent,

  // Specialized patterns - kept for unique features
  portfolioGrid: PortfolioGrid, // Has filtering, tabs, video support
};
