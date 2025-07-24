'use client';

import { Section } from '../../../../../system/layout/frames/section';
import { Container } from '../../../../../system/layout/frames/container';
import { KjFooter } from '../../../../../system/components/patterns/kj-footer';

const Footer = () => {
  return (
    <Section 
      as="footer" 
      style={{ 
        backgroundColor: 'var(--primary-1200)',
        overflow: 'visible', // Allow dropdown to show outside footer bounds
        paddingTop: 'var(--foundation-space-16, 4rem)',
        paddingBottom: 'var(--foundation-space-16, 4rem)'
      }}
    >
      <Container align="center">
        <KjFooter />
      </Container>
    </Section>
  );
};

export default Footer; 