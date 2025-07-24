'use client';

import { Section } from '@/design/system/layout/frames/section';
import { Container } from '@/design/system/layout/frames/container';
import { KjFooter } from '@/design/system/components/patterns/kj-footer';

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