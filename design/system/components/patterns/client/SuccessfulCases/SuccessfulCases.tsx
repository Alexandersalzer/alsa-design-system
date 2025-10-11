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
import { IconContainer } from '../../../../../system/components/primitives/IconContainer';
import { Button } from '../../../../../system/components/primitives/Button';

export interface SuccessCase {
  id: string;
  title: string;
  description: string;
  compensation?: string;
  duration?: string;
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
      <div style={{ 
        maxWidth: 'var(--size-page-max-width)',
        margin: '0 auto',
        padding: '0 var(--foundation-space-6)'
      }}>
        <Stack spacing="lg" align="center">
          {/* Text */}
          <Stack spacing="md" align="center">
            <Typography
              variant="h2"
              weight="bold"
              color="heading"
              style={{
                fontSize: 'clamp(2.25rem, 4vw, 3rem)',
                lineHeight: 'var(--foundation-typography-line-height-tight)',
                textAlign: 'center'
              }}
            >
              {heading}
            </Typography>

            {subheading && (
              <Typography
                variant="body-lg"
                weight="medium"
                color="secondary"
                align="center"
                style={{ maxWidth: 'var(--size-page-narrow-max-width)' }}
              >
                {subheading}
              </Typography>
            )}
          </Stack>

          {/* Cases - Grid layout for equal heights */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: 'var(--foundation-space-6)',
            width: '100%',
            maxWidth: '1200px'
          }}>
            {cases.map((c) => (
              <Card
                key={c.id}
                variant="solid"
                radius="lg"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  padding: 'var(--foundation-space-6)',
                  textAlign: 'center',
                  height: '100%'
                }}
              >
                <div style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  flex: 1, 
                  justifyContent: 'space-between',
                  gap: 'var(--foundation-space-6)'
                }}>
                  {/* Icon and Content */}
                  <Stack spacing="md" align="center">
                    {c.icon && (
                      <IconContainer
                        variant="circle"
                        size="md"
                        iconColor="accent"
                      >
                        {c.icon}
                      </IconContainer>
                    )}

                    <Typography
                      variant="h4"
                      weight="bold"
                      color="heading"
                    >
                      {c.title}
                    </Typography>

                    <Typography
                      variant="body-md"
                      weight="regular"
                      color="secondary"
                      style={{ lineHeight: '1.6' }}
                    >
                      {c.description}
                    </Typography>
                  </Stack>

                  {/* Compensation and Duration - Always at bottom */}
                  {(c.compensation || c.duration) && (
                    <div style={{ width: '100%' }}>
                      <Stack spacing="sm" align="center">
                        {c.compensation && (
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 'var(--foundation-space-2)'
                          }}>
                            <Typography variant="body-sm" weight="medium" color="secondary">
                              Ersättning:
                            </Typography>
                            <Typography variant="body-sm" weight="bold" color="accent">
                              {c.compensation}
                            </Typography>
                          </div>
                        )}
                        {c.duration && (
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 'var(--foundation-space-2)'
                          }}>
                            <Typography variant="body-sm" weight="medium" color="secondary">
                              Tidsram:
                            </Typography>
                            <Typography variant="body-sm" weight="bold" color="secondary">
                              {c.duration}
                            </Typography>
                          </div>
                        )}
                      </Stack>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>

          {/* CTA */}
          <Stack spacing="lg" align="center">
            <Button variant="accent" size="lg">
              Starta bedömning
            </Button>
          </Stack>
        </Stack>
      </div>
    </section>
  );
};

SuccessfulCases.displayName = 'SuccessfulCases';