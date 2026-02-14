import { CountUp } from './CountUp/CountUp';
import { FadeIn } from './FadeIn/FadeIn';
import { SlideIn } from './SlideIn/SlideIn';
import { Opacity } from './Opacity/Opacity';
import { Scale } from './Scale/Scale';
import { CarouselAnimation } from './CarouselAnimation/CarouselAnimation';
import { ProgressRail } from './ProgressRail/ProgressRail';
import { RailSegment } from './ProgressRail/RailSegment';
import { ProcessRailContainer } from './ProgressRail/ProcessRailContainer';
import { Bounce } from './Bounce/Bounce';
import { OpacityBounce } from './OpacityBounce/OpacityBounce';

export const animationComponents: Record<string, React.ComponentType<any>> = {
  countUp: CountUp,
  fadeIn: FadeIn,
  slideIn: SlideIn,
  opacity: Opacity,
  scale: Scale,
  carouselAnimation: CarouselAnimation,
  progressRail: ProgressRail,
  railSegment: RailSegment,
  processRailContainer: ProcessRailContainer,
  bounce: Bounce,
  opacityBounce: OpacityBounce,
};