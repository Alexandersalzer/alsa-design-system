'use client';

import { Section, Container, Block } from '../../../../../system/layout';

export const AboutSection = () => {
  return (
    <Section id="about-section" height="full">
      <Container align="center" height="full">
        <Block as="h1">Om oss</Block>
        <Block as="div">
          <Block as="p">
            Välkommen till Blimpifyco! Vi är ett företag som strävar efter att leverera
            högkvalitativa lösningar till våra kunder.
          </Block>
          <Block as="p">
            Vår vision är att skapa innovativa och användarvänliga produkter som gör
            skillnad i människors vardag.
          </Block>
        </Block>
      </Container>
    </Section>
  );
}; 