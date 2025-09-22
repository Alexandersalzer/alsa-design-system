'use client';

import React from 'react';
import { Container } from '@/design-system/components/patterns/page/Container';
import { Stack } from '@/design-system/components/patterns/page/Stack';
import { Cluster } from '@/design-system/components/patterns/page/Cluster';
import { Typography } from '@/design-system/components/primitives/Typography';
import { Card } from '@/design-system/components/primitives/Card';
import { Icon } from '@/design-system/components/primitives/Icon';
import { Button } from '@/design-system/components/primitives/Button';

interface SuccessfulCasesProps {
  title: string;
  subtitle: string;
  cases: {
    icon: React.ReactNode;
    description: string;
  }[];
  stats?: {
    label: string;
    value: string;
  }[];
}

export const SuccessfulCases: React.FC<SuccessfulCasesProps> = ({
  title,
  subtitle,
  cases,
  stats
}) => {
  return (
    <section className="successful-cases-section">
      <Container maxWidth="xl" align="center">
        <Stack spacing="2xl" align="center">
          {/* Titel + Intro */}
          <Stack spacing="md" align="center" style={{ maxWidth: '640px' }}>
            <Typography
              as="h2"
              variant="display-lg"
              weight="bold"
              className="successful-cases-title"
            >
              {title}{' '}
              <span className="successful-cases-title-accent">fall</span>
            </Typography>
            <Typography
              as="p"
              variant="body-lg"
              color="secondary"
              className="successful-cases-subtitle"
            >
              {subtitle}
            </Typography>
          </Stack>

          {/* Cases + Stats */}
          <Cluster spacing="xl" wrap justify="center" align="start">
            {/* Cases list */}
            <Stack spacing="lg" flexChild>
              {cases.map((c, i) => (
                <Card
                  key={i}
                  variant="surface"
                  radius="xl"
                  className="successful-cases-card"
                >
                  <Stack spacing="md" align="center">
                    <div className="successful-cases-icon">
                      <Icon size="xl">{c.icon}</Icon>
                    </div>
                    <Typography
                      as="p"
                      variant="body-md"
                      color="secondary"
                      className="successful-cases-description"
                    >
                      {c.description}
                    </Typography>
                  </Stack>
                </Card>
              ))}
            </Stack>

            {/* Stats (optional) */}
            {stats && (
              <Stack spacing="lg" align="center" style={{ maxWidth: '400px' }}>
                {stats.map((s, i) => (
                  <Stack key={i} spacing="xs" align="center">
                    <Typography as="div" variant="display-md" weight="bold">
                      {s.value}
                    </Typography>
                    <Typography as="p" variant="body-sm" color="secondary">
                      {s.label}
                    </Typography>
                  </Stack>
                ))}
              </Stack>
            )}
          </Cluster>

          {/* CTA (optional) */}
          <Button variant="accent" size="lg">
            Kontakta oss
          </Button>
        </Stack>
      </Container>
    </section>
  );
};

export default SuccessfulCases;