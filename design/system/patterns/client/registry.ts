import { SpinningBanner } from './spinning-banner/SpinningBanner';
import { MediaPattern } from './media/MediaPattern';

// Client patterns registry
export const clientRegistry: Record<string, React.ComponentType<any>> = {
  spinningLogos: SpinningBanner,
  media: MediaPattern,
};