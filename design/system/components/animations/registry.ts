import Scale from './Scale/Scale'
import SlideIn from './SlideIn/SlideIn'
import Opacity from './Opacity/Opacity'
import FadeIn from './FadeIn/FadeIn'
import CountUp from './CountUp/CountUp'
import CarouselAnimation from './CarouselAnimation/CarouselAnimation'


export const animationComponents: Record<string, React.ComponentType<any>> = {
    scale: Scale,
    slideIn: SlideIn,
    opacity: Opacity,
    fadeIn: FadeIn,
    countUp: CountUp,
    carouselAnimation: CarouselAnimation,
};