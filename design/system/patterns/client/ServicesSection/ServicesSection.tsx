// ===============================================
// src/design/system/components/patterns/client/ServicesSection/ServicesSection.tsx
// SERVICES SECTION
// ===============================================

'use client';

import React from 'react';
import { VStack } from '../../../components/layout';
import { Box } from '../../../components/layout/box/Box';
import { Typography } from '../../../../system/components';
import { Card } from '../../../../system/components/primitives/Card';
import { Icon } from '../../../../system/components/primitives/Icon';

export interface Service {
  id: string;
  title: string;
  description: string;
  features?: string[];
  icon?: React.ReactElement;
}

export interface ServicesSectionProps {
  heading: string;
  subheading?: string;
  services: Service[];
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({
  heading,
  subheading,
  services = [],
}) => {
  return (
    <section>
      <div style={{ 
        maxWidth: 'var(--size-page-max-width)',
        margin: '0 auto',
        padding: '0 var(--foundation-space-6)'
      }}>
        <VStack spacing="lg" align="center">
          {/* Header */}
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

          {/* Services Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))',
            gap: 'var(--foundation-space-8)',
            width: '100%',
            maxWidth: '100%'
          }}>
            {services.map((service) => (
              <Card
                key={service.id}
                variant="elevated"
                radius="lg"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  padding: 'var(--foundation-space-6)',
                  height: '100%',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                  cursor: 'default'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <div style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  flex: 1, 
                  gap: 'var(--foundation-space-5)'
                }}>
                  {/* Icon and Title */}
                  <VStack spacing="md" align="start">
                    {service.icon && (
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
                          {service.icon}
                        </Icon>
                      </Box>
                    )}

                    <Typography
                      variant="h4"
                      weight="bold"
                      color="heading"
                      style={{ textAlign: 'left' }}
                    >
                      {service.title}
                    </Typography>

                    <Typography
                      variant="body-md"
                      weight="regular"
                      color="secondary"
                      style={{ lineHeight: '1.6', textAlign: 'left' }}
                    >
                      {service.description}
                    </Typography>
                  </VStack>

                  {/* Features List */}
                  {service.features && service.features.length > 0 && (
                    <VStack spacing="xs" align="start">
                      {service.features.map((feature, index) => (
                        <div 
                          key={index}
                          style={{
                            display: 'flex',
                            alignItems: 'start',
                            gap: 'var(--foundation-space-2)',
                            width: '100%'
                          }}
                        >
                          <div style={{
                            width: '6px',
                            height: '6px',
                            borderRadius: '50%',
                            background: 'var(--accent-500)',
                            marginTop: '8px',
                            flexShrink: 0
                          }} />
                          <Typography
                            variant="body-sm"
                            weight="regular"
                            color="secondary"
                            style={{ textAlign: 'left', flex: 1 }}
                          >
                            {feature}
                          </Typography>
                        </div>
                      ))}
                    </VStack>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </VStack>
      </div>
    </section>
  );
};

ServicesSection.displayName = 'ServicesSection';