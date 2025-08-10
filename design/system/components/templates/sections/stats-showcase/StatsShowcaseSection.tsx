// ===============================================
// design/system/components/templates/sections/stats-showcase/StatsShowcaseSection.tsx
// STATS SHOWCASE SECTION TEMPLATE
// ===============================================

'use client';

import React from 'react';
import { Section, Container } from '../../../../../system/layout';
import { StatsShowcase, StatsShowcaseProps } from '../../../../../system/components/patterns/client/stats-showcase';

export interface StatsShowcaseSectionProps {
  pageSlug?: string;
  templateIndex?: number;
  className?: string;
  
  // Override default stats showcase props
  statsShowcaseProps?: Partial<StatsShowcaseProps>;
}

export const StatsShowcaseSection: React.FC<StatsShowcaseSectionProps> = ({
  pageSlug,
  templateIndex = 0,
  className = '',
  statsShowcaseProps = {}
}) => {
  // Hardcoded content matching kjmarketingsweden.com
  const countValue = 45000000;
  const countSuffix = '+';
  const subtitle = 'VIEWS IN 2024';
  const buttonText = 'Check my full portfolio';
  const buttonVariant = 'primary';
  const buttonSize = 'lg';

  // Default stats showcase configuration
  const defaultStatsShowcaseProps: StatsShowcaseProps = {
    countUpProps: {
      end: countValue,
      suffix: countSuffix,
      variant: 'display-xl',
      weight: 'extrabold',
      color: 'primary',
      separator: ',',
      duration: 2500,
      enableScrollTrigger: true,
      triggerOffset: 100
    },
    subtitle,
    subtitleVariant: 'label-sm',
    buttonText,
    buttonProps: {
      variant: buttonVariant as 'primary' | 'secondary' | 'accent' | 'ghost' | 'destructive',
      size: buttonSize as 'sm' | 'md' | 'lg' | 'xl',
      radius: 'md'
    },
    onButtonClick: () => {
      // Handle button click - could navigate to portfolio page
      console.log('Portfolio button clicked');
    },
    spacing: 'lg',
    align: 'center'
  };

  // Merge with custom props
  const finalProps: StatsShowcaseProps = {
    ...defaultStatsShowcaseProps,
    ...statsShowcaseProps,
    countUpProps: {
      ...defaultStatsShowcaseProps.countUpProps!,
      ...statsShowcaseProps.countUpProps
    },
    buttonProps: {
      ...defaultStatsShowcaseProps.buttonProps!,
      ...statsShowcaseProps.buttonProps
    }
  };

  return (
    <Section id="stats-showcase-section" height="auto" className={className}>
      <Container align="center" maxWidth="lg" style={{ paddingTop: '4rem', paddingBottom: '4rem' }}>
        <StatsShowcase {...finalProps} />
      </Container>
    </Section>
  );
}; 