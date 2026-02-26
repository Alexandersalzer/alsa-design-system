import { MasonryGrid } from './MasonryGrid/MasonryGrid';
import { GridPattern } from './GridPattern/GridPattern';
import { AlternatingCards } from './AlternatingCards/AlternatingCards';
import { StickyNavContent } from './StickyNavContent/StickyNavContent';
import { StickyTextContent } from './StickyTextContent/StickyTextContent';
import { PortfolioGrid } from './PortfolioGrid';
import { PortfolioCarousel } from './PortfolioCarousel';
import { BentoGridPattern } from './BentoGridPattern/BentoGridPattern';

// Grid patterns registry
export const gridPatternsRegistry: Record<string, React.ComponentType<any>> = {
  // Generic patterns - layout-based naming
  masonryGrid: MasonryGrid,
  gridPattern: GridPattern,
  alternatingCards: AlternatingCards,
  stickyNavContent: StickyNavContent,
  stickyTextContent: StickyTextContent,
  bentoGrid: BentoGridPattern,

  // Specialized patterns - kept for unique features
  portfolioGrid: PortfolioGrid, // Has filtering, tabs, video support
  portfolioCarousel: PortfolioCarousel, // Carousel med bilder + videor (thumbnail, klick → play)
};
