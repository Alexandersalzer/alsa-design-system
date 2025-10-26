// ===============================================
// src/design/system/components/patterns/client/SuccessfulCases/SuccessfulCases.tsx
// SUCCESSFUL CASES SECTION
// ===============================================

'use client';

import React from 'react';
import { Container } from '../../../components/frames/container/Container';
import { HStack } from '../../../components/layout/hStack/HStack';
import { VStack } from '../../../components/layout/vStack/VStack';
import { Box } from '../../../components/layout/box/Box';
import { Typography } from '../../../components/Typography';
import { Card } from '../../../components/Card';
import { Icon } from '../../../components/media';
import { Button } from '../../../../system/components';

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
      <Container maxWidth="xl" align="center">
        <VStack spacing="lg" align="center">
          {/* Text */}
          <VStack spacing="md" align="center">
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
          </VStack>

          {/* Cases */}
          <HStack spacing="lg" justify="center" wrap>
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
                  <VStack spacing="md" align="center">
                    {c.icon && (
                      <Box
                        style={{
                          width: '64px',
                          height: '64px',
                          borderRadius: 'var(--foundation-radius-full)',
                          backgroundColor: 'var(--accent-50)',
                          border: '2px solid var(--accent-200)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                          transition: 'all 0.2s ease',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'scale(1.05)';
                          e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'scale(1)';
                          e.currentTarget.style.boxShadow = 'none';
                        }}
                      >
                        <Icon size="lg" color="accent">
                          {c.icon}
                        </Icon>
                      </Box>
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
                  </VStack>

                  {/* Compensation and Duration - Always at bottom */}
                  {(c.compensation || c.duration) && (
                    <div style={{ width: '100%' }}>
                      <VStack spacing="sm" align="center">
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
                      </VStack>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </HStack>

          {/* CTA */}
          <VStack spacing="lg" align="center">
            <Button variant="accent" size="lg">
              Starta bedömning
            </Button>
          </VStack>
        </VStack>
      </Container>
    </section>
  );
};

SuccessfulCases.displayName = 'SuccessfulCases';