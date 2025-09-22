'use client';

import { useState, useEffect, ReactElement } from 'react';

import { Typography } from '../../../../../system/components/primitives/Typography';
import { Card } from '../../../../../system/components/primitives/Card';
import { Section } from '../../../../../system/layout/frames/section/Section';
import { Container } from '../../../../../system/layout/frames/container/Container';
import { Stack } from '../../../../../system/layout/utilities/stack/Stack';
import { Grid } from '../../../../../system/layout/utilities/grid/Grid';
import { Cluster } from '../../../../../system/layout/utilities/cluster/Cluster';
import { Icon } from '../../../../../system/components/primitives/Icon';
import './SuccessfulCases.css';

export interface SuccessCase {
  id: string;
  title: string;
  description: string;
  compensation: string;
  duration: string;
  icon: ReactElement;
}

export interface SuccessfulCasesContent {
  title: string;
  titleAccent?: string;
  subtitle: string;
  cases: SuccessCase[];
}

export interface SuccessfulCasesProps {
  id?: string;
  content: SuccessfulCasesContent;
  className?: string;
  autoPlay?: boolean;
  autoPlayInterval?: number;
}

const SuccessfulCases = ({ 
  id = "portfolio", 
  content, 
  className,
  autoPlay = true,
  autoPlayInterval = 5000
}: SuccessfulCasesProps) => {
  const { title, titleAccent, subtitle, cases } = content;
  const [currentCase, setCurrentCase] = useState(0);

  const handleDotClick = (index: number) => {
    setCurrentCase(index);
  };

  // Auto-play carousel
  useEffect(() => {
    if (!autoPlay || cases.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentCase((prev) => (prev + 1) % cases.length);
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [autoPlay, autoPlayInterval, cases.length]);

  return (
    <Section 
      id={id} 
      as="section"
      className={`successful-cases-section ${className || ''}`}
    >
      <Container maxWidth="xl" align="center">
        <Grid 
          columns={2} 
          gap="xl" 
          alignItems="start"
          collapseOn="tablet"
          className="successful-cases-grid"
        >
          {/* Left side - Title and Description */}
          <Stack spacing="lg" className="successful-cases-text-content">
            <Typography 
              variant="h2" 
              as="h2"
              weight="bold" 
              color="heading"
              className="successful-cases-title"
            >
              {title.split(' ').map((word, index) => {
                if (titleAccent && word === titleAccent) {
                  return (
                    <span 
                      key={index} 
                      className="successful-cases-title-accent"
                    >
                      {word}
                    </span>
                  );
                }
                return word + ' ';
              })}
            </Typography>
            <Typography 
              variant="body-xl" 
              color="secondary"
              className="successful-cases-subtitle"
            >
              {subtitle}
            </Typography>
          </Stack>

          {/* Right side - Carousel */}
          <Stack spacing="lg" className="successful-cases-carousel">
            {/* Case Card */}
            <Card 
              variant="elevated"
              padding="lg"
              className="successful-cases-card"
            >
              <Stack spacing="lg" align="center">
                {/* Case Icon */}
                <div className="successful-cases-icon">
                  <Icon color="inverse" size="lg">
                    {cases[currentCase]?.icon}
                  </Icon>
                </div>
                
                {/* Case Title */}
                <Typography variant="h4" weight="semibold" color="heading">
                  {cases[currentCase]?.title}
                </Typography>
                
                {/* Case Description */}
                <Typography 
                  variant="body-lg" 
                  color="secondary"
                  className="successful-cases-description"
                >
                  {cases[currentCase]?.description}
                </Typography>
                
                {/* Case Stats */}
                <Grid 
                  columns={2} 
                  gap="md" 
                  className="successful-cases-stats"
                >
                  <Stack spacing="xs" align="center">
                    <Typography variant="body-sm" color="secondary">
                      Ersättning
                    </Typography>
                    <Typography variant="h5" weight="bold" color="accent">
                      {cases[currentCase]?.compensation}
                    </Typography>
                  </Stack>
                  <Stack spacing="xs" align="center">
                    <Typography variant="body-sm" color="secondary">
                      Handläggningstid
                    </Typography>
                    <Typography variant="h6" weight="semibold" color="primary">
                      {cases[currentCase]?.duration}
                    </Typography>
                  </Stack>
                </Grid>
              </Stack>
            </Card>

            {/* Navigation Dots */}
            <Cluster 
              justify="center" 
              spacing="sm"
              className="successful-cases-navigation"
            >
              {cases.map((_, index) => (
                <button
                  key={index}
                  onClick={() => handleDotClick(index)}
                  className={`successful-cases-dot ${index === currentCase ? 'active' : ''}`}
                  aria-label={`Visa ärende ${index + 1}`}
                  type="button"
                />
              ))}
            </Cluster>
          </Stack>
        </Grid>
      </Container>
    </Section>
  );
};

export { SuccessfulCases };
