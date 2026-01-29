import { SpinningBanner } from './spinning-banner/SpinningBanner';
import { MediaPattern } from './media';
import { SpinningCarousel } from './spinning-carousel';
import { ProgressRailPattern } from './ProgressRailPattern';


// Client patterns registry
export const clientRegistry: Record<string, React.ComponentType<any>> = {
  spinningLogos: SpinningBanner,
  media: MediaPattern,
  spinningCarousel: SpinningCarousel,
  progressRail: ProgressRailPattern
};