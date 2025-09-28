// ===============================================
// src/design/system/components/patterns/client/SuccessfulCases/SuccessfulCases.tsx
// SUCCESSFUL CASES SECTION
// ===============================================

'use client';

import React from 'react';
import { Container } from '../../../../../system/layout/frames/container/Container';
import { Cluster } from '../../../../../system/layout/utilities/cluster/Cluster';
import { Stack } from '../../../../../system/layout/utilities/stack/Stack';
import { Typography } from '../../../../../system/components/primitives/Typography';
import { Card } from '../../../../../system/components/primitives/Card';
import { Icon } from '../../../../../system/components/primitives/Icon';
import { Button } from '../../../../../system/components/primitives/Button';

export interface SuccessCase {
  id: string;
  title: string;
  description: string;
  icon?: React.ReactElement;
}

export interface SuccessfulCasesProps {
  heading: string;
  subheading?: string;
  cases: SuccessCase[];
}

export const SuccessfulCases: React.FC<SuccessfulCasesProps> = ({
  heading,
  subheading,
  cases = [],
}) => {
  return (
    <section>
      <Container maxWidth="xl" align="center">
        <Stack spacing="lg" align="center">
          {/* Text */}
          <Stack spacing="md" align="center">
            <Typography
              variant="display-lg"
              weight="bold"
              color="heading"
              align="center"
            >
              {heading}
            </Typography>

            {subheading && (
              <Typography
                variant="body-lg"
                weight="medium"
                color="secondary"
                align="center"
                style={{ maxWidth: '640px' }}
              >
                {subheading}
              </Typography>
            )}
          </Stack>

          {/* Cases */}
          <Cluster spacing="lg" justify="center" wrap>
            {cases.map((c) => (
              <Card
                key={c.id}
                variant="solid"
                radius="lg"
                style={{
                  width: '300px',
                  minHeight: '300px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 'var(--foundation-space-6)',
                  textAlign: 'center',
                }}
              >
                {c.icon && (
                  <div
                    style={{
                      marginBottom: 'var(--foundation-space-4)',
                    }}
                  >
                    <Icon size="lg">{c.icon}</Icon>
                  </div>
                )}

                <Typography
                  variant="display-lg"
                  weight="semibold"
                  color="heading"
                >
                  {c.title}
                </Typography>

                <Typography
                  variant="body-md"
                  weight="regular"
                  color="secondary"
                  style={{ marginTop: 'var(--foundation-space-2)' }}
                >
                  {c.description}
                </Typography>
              </Card>
            ))}
          </Cluster>

          {/* CTA */}
          <Stack spacing="lg" align="center">
            <Button variant="accent" size="lg">
              Starta bedömning
            </Button>
          </Stack>
        </Stack>
      </Container>
    </section>
  );
};

SuccessfulCases.displayName = 'SuccessfulCases';