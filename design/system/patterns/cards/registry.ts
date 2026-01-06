import { Stats } from './Stats';
import { NewsCard } from './NewsCard';
import { PortfolioCard } from './PortfolioCard';
import { ResultsCard } from './ResultsCard';
import { TestimonialCard } from './TestimonialCard';

export const cardsRegistry: Record<string, React.ComponentType<any>> = {
  stats: Stats,
  news: NewsCard,
  portfolio: PortfolioCard,
  resultsCard: ResultsCard,
  testimonial: TestimonialCard,
};
