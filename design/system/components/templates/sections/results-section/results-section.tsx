'use client';

import { Section, Container } from '../../../../../system/layout';
import { Button } from '../../../../../system/components/primitives/Button';

interface ResultsSectionProps {
    radius?: 'sm' | 'md' | 'lg' | 'xl' | 'full' | 'none' | 'xs';
}

export const ResultsSection: React.FC<ResultsSectionProps> = ({ 
    radius = 'md'
}) => {

  return (
    <Section id="results-section" height="auto">
      <Container 
        align="center" 
        height="auto"
        style={{ 
          paddingTop: '18rem', 
          paddingBottom: '2rem'
        }}
      >
        <Button variant="primary" size="md" radius={radius}>Button</Button>
      </Container>
    </Section>
  );
};