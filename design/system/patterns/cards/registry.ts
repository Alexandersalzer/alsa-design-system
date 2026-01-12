import { Stats } from './Stats';
import { NewsCard } from './NewsCard';
import { PortfolioCard } from './PortfolioCard';
import { ResultsCard } from './ResultsCard';
import { TestimonialCard } from './TestimonialCard';
import { ContentCard } from './ContentCard/ContentCard';
import { OverlayCard } from './OverlayCard/OverlayCard';
import { ProcessCard } from './ProcessCard/ProcessCard';
import { ProcessStepCard } from './ProcessStepCard/ProcessStepCard';

export const cardsRegistry: Record<string, React.ComponentType<any>> = {
  stats: Stats,
  news: NewsCard,
  portfolio: PortfolioCard,
  resultsCard: ResultsCard,
  testimonial: TestimonialCard,
  contentCard: ContentCard,
  overlayCard: OverlayCard,
  processCard: ProcessCard,
  processStepCard: ProcessStepCard,
};
