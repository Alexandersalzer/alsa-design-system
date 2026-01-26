import { Scale } from './Scale'
import { SlideIn } from './SlideIn'
import { Opacity } from './Opacity'
import { FadeIn } from './FadeIn'
import { CountUp } from './CountUp'
import { CarouselAnimation } from './CarouselAnimation'


export const animationComponents: Record<string, React.ComponentType<any>> = {
    scale: Scale,
    slideIn: SlideIn,
    opacity: Opacity,
    fadeIn: FadeIn,
    countUp: CountUp,
    carouselAnimation: CarouselAnimation,
};