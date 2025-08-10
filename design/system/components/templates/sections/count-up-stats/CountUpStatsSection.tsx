'use client';

import { Section, Container } from '../../../../../system/layout';
import { CountUpSection } from '../../../../../system/components/patterns/client/CountUpSection';
import { TypographyColor } from '../../../../../system/components/primitives/Typography';
import { useContent } from '../../../../../cms/wrappers/content/hooks/useContent';
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
  countDuration = 2500,
  countDelay = 0,
  countSeparator = '',
  countSuffix = '+',
  countPrefix = '',
  countDecimals = 0,
  useEasing = true,
  enableScrollTrigger = true,
  triggerOffset = 100,
  
  // Typography defaults
  countVariant = 'display-xl',
  countWeight = 'bold',
  countColor = 'primary',
  
  subtitleVariant = 'body-lg',
  subtitleWeight = 'regular',
  subtitleColor = 'secondary',
  
  // Button defaults
  buttonVariant = 'primary',
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
  
  // Extract content using generic functions
  const subtitle = getBlockContent(countUpBlocks, 'subtitle') || 'VIEWS IN 2024';
  const buttonText = getBlockContent(countUpBlocks, 'button') || '';
  
  const handleButtonClick = () => {
    // Default action - could be customized via CMS
    console.log('Count up stats button clicked');
  };

  return (
    <Section 
      id="count-up-stats-section" 
      height="auto"
    >
      <Container 
        align={containerAlign}
        maxWidth={containerMaxWidth}
        style={{ 
          paddingTop: '3rem',
          paddingBottom: '3rem'
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
          button={buttonText ? {
            text: buttonText,
            variant: buttonVariant,
            size: buttonSize,
            onClick: handleButtonClick
          } : undefined}
          spacing={spacing}
          align={align}
        />
      </Container>
    </Section>
  );
}; 