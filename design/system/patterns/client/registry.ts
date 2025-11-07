import { SpinningBanner } from './spinning-banner/SpinningBanner';
import { MediaPattern } from './media/MediaPattern';
import { SpinningCarousel } from './spinning-carousel';
import { Testimonials } from './Testimonials';


// Client patterns registry
export const clientRegistry: Record<string, React.ComponentType<any>> = {
  spinningLogos: SpinningBanner,
  media: MediaPattern,
  spinningCarousel: SpinningCarousel,
  testimonials: Testimonials,
};