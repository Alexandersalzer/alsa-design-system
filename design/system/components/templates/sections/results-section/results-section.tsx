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
        <Results name="Results" subtitle="UGC reklam" reviewText="Results" body="Denna videon förändrade detta företagets framtid, en UGC video skapad av någon som har känsla för det. Det räcker." title="10.4 miljoner visningar" />
      </Container>
    </Section>
  );
};