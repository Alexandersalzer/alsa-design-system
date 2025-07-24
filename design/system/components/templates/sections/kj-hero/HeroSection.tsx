'use client';

import { Section, Container } from '@/design/system/layout';
import { RichText } from '@/design/system/components/patterns/RichText';
import { useContent } from '@/design/cms-modules/context/ContentContext';
import { usePathname } from 'next/navigation';

interface HeroSectionProps {
  pageSlug?: string; // Optional override for page slug
}

// Predefined design settings for HeroSection
const HERO_DESIGN_SETTINGS = {
  titleAs: 'h1' as const,
  subtitleAs: 'p' as const,
  primaryButton: {
    variant: 'primary' as const,
    size: 'md' as const,
    radius: 'full' as const,
  },
  layout: {
    unit: 'xl' as const,
    textPosition: 1,
    buttonsPosition: 9, // Increased for more spacing like KJ Marketing Sweden
    textSpacing: 'sm' as const,
    buttonSpacing: 'md' as const,
    textAlign: 'center' as const,
  }
};

export const HeroSection: React.FC<HeroSectionProps> = ({ pageSlug }) => {
  const { getHeroContent } = useContent();
  const pathname = usePathname();
  
  // Determine which page slug to use
  const currentSlug = pageSlug || pathname.replace('/', '') || 'home';
  
  // Get hero content for the current page
  const heroContent = getHeroContent(currentSlug);
  
  // Don't render if no content is available
  if (!heroContent) {
    return null;
  }

  return (
    <Section id="hero-section" height="full">
      <Container align="center" height="full">
        <RichText
          heading={heroContent.title}
          headingAs={HERO_DESIGN_SETTINGS.titleAs}
          subtitle={heroContent.subtitle}
          subtitleAs={HERO_DESIGN_SETTINGS.subtitleAs}
          primaryButton={{
            size: HERO_DESIGN_SETTINGS.primaryButton.size,
            radius: HERO_DESIGN_SETTINGS.primaryButton.radius,
            children: heroContent.primaryButtonText
          }}
          unit={HERO_DESIGN_SETTINGS.layout.unit}
          textPosition={HERO_DESIGN_SETTINGS.layout.textPosition}
          buttonsPosition={HERO_DESIGN_SETTINGS.layout.buttonsPosition}
          textSpacing={HERO_DESIGN_SETTINGS.layout.textSpacing}
          buttonSpacing={HERO_DESIGN_SETTINGS.layout.buttonSpacing}
          textAlign={HERO_DESIGN_SETTINGS.layout.textAlign}
          maxWidth="550px"
        />
      </Container>
    </Section>
  );
};