'use client';

import { Section, Container } from '../../../components';
import { CountUpSection } from '../../../../system/patterns/client/CountUpSection';
import { TypographyColor } from '../../../components/Typography';
import { useContent } from '../../../../cms/wrappers/content/hooks/useContent';
import { usePathname } from 'next/navigation';

interface CountUpStatsSectionProps {
  pageSlug?: string;
  templateIndex?: number;
  
  // CountUp configuration
  countEnd?: number;
  countStart?: number;
  countDuration?: number;
  countDelay?: number;
  countSeparator?: string;
  countSuffix?: string;
  countPrefix?: string;
  countDecimals?: number;
  useEasing?: boolean;
  enableScrollTrigger?: boolean;
  triggerOffset?: number;
  
  // Typography variants
  countVariant?: 'display-xl' | 'display-lg' | 'display-md' | 'display-sm' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  countWeight?: 'light' | 'regular' | 'medium' | 'semibold' | 'bold' | 'extrabold' | 'black';
  countColor?: TypographyColor;
  
  subtitleVariant?: 'body-xl' | 'body-lg' | 'body-md' | 'body-sm' | 'body-xs';
  subtitleWeight?: 'light' | 'regular' | 'medium' | 'semibold' | 'bold';
  subtitleColor?: TypographyColor;
  
  // Button configuration
  buttonVariant?: 'primary' | 'secondary' | 'accent' | 'ghost' | 'destructive';
  buttonSize?: 'sm' | 'md' | 'lg' | 'xl';
  
  // Layout configuration
  spacing?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  align?: 'start' | 'center' | 'end' | 'stretch';
  containerAlign?: 'left' | 'center' | 'right';
  containerMaxWidth?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
}

export const CountUpStatsSection: React.FC<CountUpStatsSectionProps> = ({
  pageSlug,
  templateIndex = 0,
  
  // CountUp defaults - matching KJ Marketing website (45M+ views)
  countEnd = 45000000,
  countStart = 0,
  countDuration = 3000, // Slightly longer for better effect
  countDelay = 300, // Small delay for better UX
  countSeparator = ' ', // Space as thousands separator like on KJ Marketing site
  countSuffix = '+',
  countPrefix = '',
  countDecimals = 0,
  useEasing = true,
  enableScrollTrigger = true, // Temporarily disable to test animation
  triggerOffset = 200, // Trigger when element is 50px from bottom of viewport
  
  // Typography defaults
  countVariant = 'display-xl',
  countWeight = 'bold',
  countColor = 'primary',
  
  subtitleVariant = 'body-xl',
  subtitleWeight = 'bold',
  subtitleColor = 'secondary',
  
  // Button defaults
  buttonVariant = 'accent',
  buttonSize = 'md',
  
  // Layout defaults
  spacing = 'sm',
  align = 'center',
  containerAlign = 'center',
  containerMaxWidth = 'md'
}) => {
  const { getPageTemplate, getTemplateBlocks, getBlockContent } = useContent();
  const pathname = usePathname();
  
  // Determine which page slug to use
  const currentSlug = pageSlug || pathname.replace('/', '') || 'home';
  
  // Get specific count up stats template by index
  const countUpTemplate = getPageTemplate(currentSlug, 'countUpStats', templateIndex);
  
  // Get blocks from count up stats pattern
  const countUpBlocks = getTemplateBlocks(countUpTemplate, 'countUpStats');
  
  // Extract content using generic functions with better defaults
  const subtitle = getBlockContent(countUpBlocks, 'subtitle') || 'VISNINGAR 2024';
  const buttonText = getBlockContent(countUpBlocks, 'button') || 'Kolla min kompletta Portfölj'; // Default button text from KJ site
  
  const handleButtonClick = () => {
    // Default action - could be customized via CMS
    console.log('Count up stats button clicked');
    // Could navigate to portfolio page
  };

  return (
    <Section 
      id="count-up-stats-section" 
      height="auto"
    >
      <Container 
        align={containerAlign}
        style={{ 
          paddingTop: '4rem',
          paddingBottom: '2rem'
        }}
      >
        <CountUpSection
          countUp={{
            end: countEnd,
            start: countStart,
            duration: countDuration,
            delay: countDelay,
            separator: countSeparator,
            suffix: countSuffix,
            prefix: countPrefix,
            decimals: countDecimals,
            useEasing: useEasing,
            enableScrollTrigger: enableScrollTrigger,
            triggerOffset: triggerOffset,
            variant: countVariant,
            weight: countWeight,
            color: countColor,
            align: 'center'
          }}
          subtitle={{
            text: subtitle,
            variant: subtitleVariant,
            weight: subtitleWeight,
            color: subtitleColor,
            align: 'center'
          }}
          button={{
            text: buttonText,
            variant: buttonVariant,
            size: buttonSize,
            onClick: handleButtonClick
          }}
          spacing={spacing}
          align={align}
        />
      </Container>
    </Section>
  );
}; 