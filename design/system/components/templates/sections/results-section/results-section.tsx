'use client';

import { Section, Container } from '../../../../../system/layout';
import { Results } from '../../../../../system/components/patterns/client/results';

interface ResultsSectionProps {
}

export const ResultsSection: React.FC<ResultsSectionProps> = ({ 
}) => {

  return (
    <Section id="results-section" height="auto">
      <Container 
        align="center" 
        height="auto"
        maxWidth="lg"
        style={{ 
          paddingTop: '18rem', 
          paddingBottom: '2rem'
        }}
      >
        <Results name="Results" subtitle="Results" reviewText="Results" />
      </Container>
    </Section>
  );
};